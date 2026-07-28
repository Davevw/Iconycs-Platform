import { NextRequest, NextResponse } from 'next/server';
import { createSessionId, identifyPasscode, mintToken, GATE_COOKIE } from '@/lib/gate';
import { writeGateAudit } from '@/lib/gate-audit';

export const runtime = 'nodejs';

type GateBucket = {
  count: number;
  resetAt: number;
};

const GATE_WINDOW_MS = 10 * 60 * 1000;
const GATE_MAX_FAILURES = 6;
const gateBuckets = new Map<string, GateBucket>();

function firstHeader(request: NextRequest, names: string[]): string {
  for (const name of names) {
    const value = request.headers.get(name);
    if (value) return value.split(',')[0]?.trim() || value.trim();
  }
  return '';
}

function gateRateKey(request: NextRequest): string {
  return firstHeader(request, [
    'x-forwarded-for',
    'x-real-ip',
    'x-vercel-forwarded-for',
    'cf-connecting-ip',
  ]) || 'unknown';
}

function getBucket(key: string, now = Date.now()): GateBucket {
  const existing = gateBuckets.get(key);
  if (existing && existing.resetAt > now) return existing;
  const fresh = { count: 0, resetAt: now + GATE_WINDOW_MS };
  gateBuckets.set(key, fresh);
  return fresh;
}

function isRateLimited(key: string): boolean {
  return getBucket(key).count >= GATE_MAX_FAILURES;
}

function recordFailure(key: string): void {
  getBucket(key).count += 1;
}

function clearFailures(key: string): void {
  gateBuckets.delete(key);
}

// POST /api/gate  { passcode }  -> sets signed session cookie
export async function POST(request: NextRequest) {
  const rateKey = gateRateKey(request);

  if (isRateLimited(rateKey)) {
    await writeGateAudit(request, {
      eventType: 'attempt',
      outcome: 'failure',
      statusCode: 429,
      path: '/api/gate',
      method: 'POST',
      reason: 'rate_limited',
    });
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(GATE_WINDOW_MS / 1000) } }
    );
  }

  let passcode = '';
  try {
    const body = await request.json();
    passcode = typeof body?.passcode === 'string' ? body.passcode : '';
  } catch {
    await writeGateAudit(request, {
      eventType: 'attempt',
      outcome: 'failure',
      statusCode: 400,
      path: '/api/gate',
      method: 'POST',
      reason: 'bad_request',
    });
    recordFailure(rateKey);
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  const match = identifyPasscode(passcode);
  if (!match.valid) {
    recordFailure(rateKey);
    await writeGateAudit(request, {
      eventType: 'attempt',
      outcome: 'failure',
      statusCode: 401,
      path: '/api/gate',
      method: 'POST',
      reason: 'incorrect_passcode',
    });
    return NextResponse.json({ ok: false, error: 'Incorrect passcode.' }, { status: 401 });
  }

  const sessionId = createSessionId();
  clearFailures(rateKey);
  await writeGateAudit(request, {
    eventType: 'entry',
    outcome: 'success',
    statusCode: 200,
    path: '/api/gate',
    method: 'POST',
    passcodeLabel: match.label,
    sessionId,
  });

  const res = NextResponse.json({ ok: true });
  // Session cookie: no maxAge / expires => browser deletes it when fully closed,
  // so a new browsing session requires the passcode again.
  res.cookies.set(GATE_COOKIE, mintToken(undefined, match.label, sessionId), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });
  return res;
}

// DELETE /api/gate -> clears session (logout)
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
