'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#FAFAF7',
  bgCard: '#FFFFFF',
  bgWarm: '#F5F0E8',
  border: '#E8E2D8',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  terra: '#C4653A',
  sage: '#5D7E52',
  navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/reports');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch (err: any) {
      setError('Failed to initiate Google sign-in.');
      setOauthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email address above, then click Forgot Password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setForgotSent(true);
      }
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        fontFamily: C.font,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Card */}
      <div
        style={{
          background: C.bgCard,
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          boxShadow: '0 8px 32px rgba(28,25,23,0.08)',
          width: '100%',
          maxWidth: 420,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: C.navy,
            padding: '28px 32px 24px',
            textAlign: 'center',
          }}
        >
                    <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.06em',
                  fontFamily: C.fontSerif,
                }}
              >
                ICONYCS
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Housing Intelligence</div>
            </div>
          </Link>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            👋 Sign In
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginBottom: 24 }}>
            Welcome back. Access your analytics dashboard.
          </p>

          {error && (
            <div
              style={{
                background: '#FFF4F0',
                border: `1px solid ${C.terra}40`,
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: C.terra,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {forgotSent && (
            <div
              style={{
                background: '#F0F7EE',
                border: `1px solid ${C.sage}40`,
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: C.sage,
                marginBottom: 16,
              }}
            >
              " Password reset email sent. Check your inbox.
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={oauthLoading}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: 8,
              border: `1.5px solid ${C.border}`,
              background: C.bgCard,
              color: C.textBody,
              fontSize: 14,
              fontWeight: 600,
              cursor: oauthLoading ? 'not-allowed' : 'pointer',
              fontFamily: C.font,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 20,
              opacity: oauthLoading ? 0.7 : 1,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!oauthLoading) (e.currentTarget.style.borderColor = C.terra);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.borderColor = C.border);
            }}
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            {oauthLoading ? 'Redirecting...' : 'Sign in with Google'}
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 12, color: C.textDim }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textBody,
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${C.border}`,
                  fontSize: 14,
                  fontFamily: C.font,
                  color: C.text,
                  background: C.bgWarm,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textBody,
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=""
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${C.border}`,
                  fontSize: 14,
                  fontFamily: C.font,
                  color: C.text,
                  background: C.bgWarm,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: C.terra,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: C.font,
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 0',
                borderRadius: 8,
                background: loading ? C.textDim : C.terra,
                color: '#fff',
                border: 'none',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: C.font,
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign up link */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: C.textMuted }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              style={{ color: C.terra, fontWeight: 600, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 11, color: C.textDim, textAlign: 'center' }}>
        <Link href="/terms" style={{ color: C.textDim, textDecoration: 'none' }}>
          Terms of Service
        </Link>
        {' * '}
        <Link href="/privacy" style={{ color: C.textDim, textDecoration: 'none' }}>
          Privacy Policy
        </Link>
        {' * '}
        <Link href="/" style={{ color: C.textDim, textDecoration: 'none' }}>
          iconycs.com
        </Link>
      </div>
    </div>
  );
}
