import crypto from 'crypto';

/**
 * Passcode gate — standalone, no external auth provider.
 * Valid passcodes live ONLY server-side in ICONYCS_PASSCODES (comma-separated).
 * A successful entry mints a signed session token stored in an HttpOnly cookie.
 */

export const GATE_COOKIE = 'icx_gate';
// Absolute hard cap: a session can never live longer than this since first entry,
// regardless of activity.
const SESSION_HOURS = 12;
// Idle timeout: if there is no activity for this long, the session dies and the
// passcode is required again. This works even when a browser restores the
// session cookie on reopen.
export const IDLE_MINUTES = 5;

function getSecret(): string {
  const s = process.env.ICONYCS_SESSION_SECRET;
  if (!s) throw new Error('ICONYCS_SESSION_SECRET is not set');
  return s;
}

type PasscodeEntry = {
  label: string;
  code: string;
};

function getPasscodes(): PasscodeEntry[] {
  return (process.env.ICONYCS_PASSCODES || '')
    .split(',')
    .map((p, index) => {
      const raw = p.trim();
      const separator = raw.match(/^([A-Za-z0-9_-]+)\s*[:=]\s*(.+)$/);
      if (separator) {
        return { label: separator[1], code: separator[2].trim() };
      }
      return { label: `passcode_${index + 1}`, code: raw };
    })
    .filter((entry) => Boolean(entry.code));
}

export function createSessionId(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function identifyPasscode(input: string): { valid: boolean; label?: string } {
  const candidate = (input || '').trim().toLowerCase();
  if (!candidate) return { valid: false };
  const codes = getPasscodes();
  let label: string | undefined;
  for (const entry of codes) {
    const a = Buffer.from(entry.code.toLowerCase());
    const b = Buffer.from(candidate);
    // timingSafeEqual requires equal length; guard then compare.
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      label = entry.label;
    }
  }
  return { valid: Boolean(label), label };
}

/** Constant-time, case-insensitive check of a submitted passcode against the valid list. */
export function isValidPasscode(input: string): boolean {
  return identifyPasscode(input).valid;
}

/** Mint a signed session token. iat = first entry, lst = last-seen (sliding). */
export function mintToken(iatOverride?: number, subject?: string, sessionId?: string): string {
  const now = Date.now();
  const payload = JSON.stringify({
    iat: iatOverride ?? now,
    lst: now,
    sub: subject || 'unlabeled',
    sid: sessionId || createSessionId(),
    v: 3,
  });
  const body = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('hex');
  return `${body}.${sig}`;
}

/** Verify signature + absolute + idle expiry. Returns the original iat if valid. */
export function verifyToken(token: string | undefined | null): { valid: boolean; iat?: number } {
  if (!token) return { valid: false };
  const [body, sig] = token.split('.');
  if (!body || !sig) return { valid: false };
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { valid: false };
  try {
    const { iat, lst } = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (typeof iat !== 'number') return { valid: false };
    const last = typeof lst === 'number' ? lst : iat;
    const now = Date.now();
    const absOk = now - iat >= 0 && now - iat < SESSION_HOURS * 60 * 60 * 1000;
    const idleOk = now - last >= 0 && now - last < IDLE_MINUTES * 60 * 1000;
    return { valid: absOk && idleOk, iat };
  } catch {
    return { valid: false };
  }
}
