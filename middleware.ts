import { NextRequest, NextResponse } from 'next/server';
import { writeGateAudit } from './lib/gate-audit';

// Whole-site passcode gate. Everything requires a valid signed session
// EXCEPT the gateway page and the gate API itself.
const GATE_COOKIE = 'icx_gate';
const SESSION_HOURS = 12;   // absolute cap since first entry
const IDLE_MINUTES = 5;     // sliding inactivity cap

const PUBLIC_PATHS = ['/login', '/api/gate'];

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

type VerifyResult = { valid: boolean; iat?: number; sub?: string; sid?: string };

async function verifyToken(token: string | undefined, secret: string): Promise<VerifyResult> {
  if (!token || !secret) return { valid: false };
  const [body, sig] = token.split('.');
  if (!body || !sig) return { valid: false };

  const key = await importKey(secret);
  const expected = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  );
  let provided: Uint8Array;
  try {
    provided = hexToBytes(sig);
  } catch {
    return { valid: false };
  }
  if (!timingSafeEqual(expected, provided)) return { valid: false };

  try {
    const json = JSON.parse(new TextDecoder().decode(b64urlToBytes(body)));
    if (typeof json.iat !== 'number') return { valid: false };
    const last = typeof json.lst === 'number' ? json.lst : json.iat;
    const now = Date.now();
    const absOk = now - json.iat >= 0 && now - json.iat < SESSION_HOURS * 60 * 60 * 1000;
    const idleOk = now - last >= 0 && now - last < IDLE_MINUTES * 60 * 1000;
    return {
      valid: absOk && idleOk,
      iat: json.iat,
      sub: typeof json.sub === 'string' ? json.sub : undefined,
      sid: typeof json.sid === 'string' ? json.sid : undefined,
    };
  } catch {
    return { valid: false };
  }
}

// Mint a refreshed token preserving original iat, updating last-seen to now.
async function mintToken(iat: number, secret: string, subject?: string, sessionId?: string): Promise<string> {
  const payload = JSON.stringify({
    iat,
    lst: Date.now(),
    sub: subject || 'unlabeled',
    sid: sessionId,
    v: 3,
  });
  const body = bytesToB64url(new TextEncoder().encode(payload));
  const key = await importKey(secret);
  const sig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  );
  return `${body}.${bytesToHex(sig)}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ICONYCS_SESSION_SECRET || '';

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const token = request.cookies.get(GATE_COOKIE)?.value;
  const { valid, iat, sub, sid } = await verifyToken(token, secret);

  // Already in? Bounce away from the gateway page.
  if (valid && pathname === '/login') {
    const dest = request.nextUrl.clone();
    dest.pathname = '/reports';
    dest.search = '';
    return NextResponse.redirect(dest);
  }

  if (isPublic) return NextResponse.next();

  if (!valid) {
    await writeGateAudit(request, {
      eventType: 'blocked',
      outcome: 'blocked',
      statusCode: pathname.startsWith('/api/') ? 401 : 307,
      path: pathname,
      method: request.method,
      reason: token ? 'invalid_or_expired_session' : 'missing_session',
    });

    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    const res = NextResponse.redirect(loginUrl);
    // Proactively clear any stale/expired cookie so it can't linger.
    res.cookies.set(GATE_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
    return res;
  }

  // Authenticated: slide the idle window by re-issuing a refreshed session cookie.
  await writeGateAudit(request, {
    eventType: 'view',
    outcome: 'allowed',
    statusCode: 200,
    path: pathname,
    method: request.method,
    passcodeLabel: sub,
    sessionId: sid,
  });

  const res = NextResponse.next();
  if (typeof iat === 'number' && secret) {
    res.cookies.set(GATE_COOKIE, await mintToken(iat, secret, sub, sid), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      // session cookie (no maxAge) + sliding idle expiry enforced server-side
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf)$).*)'],
};
