import { NextRequest, NextResponse } from 'next/server';
import { createSessionId, identifyPasscode, mintToken, GATE_COOKIE } from '@/lib/gate';
import { writeGateAudit } from '@/lib/gate-audit';

export const runtime = 'nodejs';

// POST /api/gate  { passcode }  -> sets signed session cookie
export async function POST(request: NextRequest) {
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
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  const match = identifyPasscode(passcode);
  if (!match.valid) {
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
