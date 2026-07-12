type AuditRequest = {
  headers: Headers;
  nextUrl?: { pathname: string };
  method?: string;
};

export type GateAuditEvent = {
  eventType: 'attempt' | 'entry' | 'view' | 'blocked' | 'logout';
  outcome: 'success' | 'failure' | 'allowed' | 'blocked';
  statusCode: number;
  path?: string;
  method?: string;
  passcodeLabel?: string;
  sessionId?: string;
  reason?: string;
};

type AuditPayload = GateAuditEvent & {
  occurred_at: string;
  app: 'iconycs';
  ip_hash: string | null;
  user_agent_hash: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  referrer: string | null;
};

function firstHeader(headers: Headers, names: string[]): string {
  for (const name of names) {
    const value = headers.get(name);
    if (value) return value.split(',')[0]?.trim() || value.trim();
  }
  return '';
}

async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPrivate(value: string): Promise<string | null> {
  if (!value) return null;
  const salt = process.env.ICONYCS_AUDIT_HASH_SECRET || process.env.ICONYCS_SESSION_SECRET || '';
  return sha256(`${salt}:${value}`);
}

function decodeHeader(value: string): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function buildPayload(request: AuditRequest, event: GateAuditEvent): Promise<AuditPayload> {
  const ip = firstHeader(request.headers, [
    'x-forwarded-for',
    'x-real-ip',
    'x-vercel-forwarded-for',
    'cf-connecting-ip',
  ]);
  const userAgent = request.headers.get('user-agent') || '';
  const city = decodeHeader(firstHeader(request.headers, ['x-vercel-ip-city']));
  const region = firstHeader(request.headers, ['x-vercel-ip-country-region']);
  const country = firstHeader(request.headers, ['x-vercel-ip-country', 'cf-ipcountry']);
  const referrer = request.headers.get('referer') || 'direct';

  return {
    ...event,
    path: event.path || request.nextUrl?.pathname || '/',
    method: event.method || request.method || 'GET',
    occurred_at: new Date().toISOString(),
    app: 'iconycs',
    ip_hash: await hashPrivate(ip),
    user_agent_hash: await hashPrivate(userAgent),
    city: city || null,
    region: region || null,
    country: country || null,
    referrer,
  };
}

export async function writeGateAudit(request: AuditRequest, event: GateAuditEvent): Promise<void> {
  const payload = await buildPayload(request, event);
  console.info('iconycs_gate_audit', JSON.stringify(payload));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/iconycs_gate_audit`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        occurred_at: payload.occurred_at,
        event_type: payload.eventType,
        outcome: payload.outcome,
        status_code: payload.statusCode,
        path: payload.path,
        method: payload.method,
        passcode_label: payload.passcodeLabel || null,
        session_id: payload.sessionId || null,
        reason: payload.reason || null,
        ip_hash: payload.ip_hash,
        user_agent_hash: payload.user_agent_hash,
        city: payload.city,
        region: payload.region,
        referrer: payload.referrer,
        country: payload.country,
      }),
    });

    const body = res.ok ? '' : await res.text();

    if (res.status === 404 || (res.status === 400 && body.includes('column'))) {
      await writeLegacyLoginAudit(supabaseUrl, serviceKey, payload);
      return;
    }

    if (!res.ok) {
      console.warn('iconycs_gate_audit_persist_failed', res.status, body);
    }
  } catch (error) {
    console.warn('iconycs_gate_audit_persist_error', error);
  }
}

async function writeLegacyLoginAudit(
  supabaseUrl: string,
  serviceKey: string,
  payload: AuditPayload
): Promise<void> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/login_audit`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        passphrase_used: [
          'iron_gate',
          payload.eventType,
          payload.passcodeLabel || 'unlabeled',
          payload.path || '/',
        ].join(':').slice(0, 255),
        role_granted: payload.outcome === 'success' || payload.outcome === 'allowed' ? 'analyst' : 'denied',
        ip_address: payload.ip_hash,
        user_agent: payload.user_agent_hash,
        success: payload.outcome === 'success' || payload.outcome === 'allowed',
        city: payload.city,
        region: payload.region,
        country: payload.country,
        referrer: payload.referrer,
      }),
    });

    if (!res.ok) {
      console.warn('iconycs_gate_audit_legacy_persist_failed', res.status, await res.text());
    }
  } catch (error) {
    console.warn('iconycs_gate_audit_legacy_persist_error', error);
  }
}
