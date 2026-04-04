'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

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
  gold: '#B8860B',
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

const TIERS = [
  {
    id: 'free',
    label: 'Free',
    price: '$0/mo',
    description: 'National & state-level data, 3 views/day',
    color: C.textMuted,
    border: C.border,
    selectedBg: C.bgWarm,
  },
  {
    id: 'analyst',
    label: 'Analyst',
    price: '$98/mo',
    description: 'Full drill-down for one state',
    color: C.terra,
    border: C.terra,
    selectedBg: '#FFF4F0',
  },
  {
    id: 'professional',
    label: 'Professional',
    price: '$249/mo',
    description: 'Multi-state + Demographics + API access',
    color: C.navy,
    border: C.navy,
    selectedBg: '#F0F3F8',
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    price: 'Custom',
    description: 'Snowflake direct, team seats, bulk export',
    color: C.gold,
    border: C.gold,
    selectedBg: '#FDF8EE',
  },
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') ?? 'free';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [selectedTier, setSelectedTier] = useState(tierParam);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
            tier: selectedTier,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setOauthLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setOauthLoading(false);
      }
    } catch (err: any) {
      setError('Failed to initiate Google sign-up.');
      setOauthLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
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
  };

  if (success) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>
          Check your email
        </h2>
        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 24 }}>
          We&apos;ve sent a confirmation link to <strong>{email}</strong>.<br />
          Click it to activate your account and start analyzing.
        </p>
        <Link
          href="/login"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: C.terra,
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
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
        Create Account
      </h1>
      <p style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginBottom: 24 }}>
        Get access to 130M+ residential property records.
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

      {/* Google OAuth */}
      <button
        onClick={handleGoogleSignUp}
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
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
        {oauthLoading ? 'Redirecting...' : 'Sign up with Google'}
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 12, color: C.textDim }}>or</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      <form onSubmit={handleSignUp}>
        {/* Name + Company row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Jane Smith"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min. 8 characters"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
          />
        </div>

        {/* Tier Selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textBody, marginBottom: 10 }}>
            Choose Plan
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `2px solid ${isSelected ? tier.border : C.border}`,
                    background: isSelected ? tier.selectedBg : C.bgCard,
                    cursor: 'pointer',
                    fontFamily: C.font,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? tier.color : C.text }}>
                    {tier.label}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? tier.color : C.textMuted }}>
                    {tier.price}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 2, lineHeight: 1.4 }}>
                    {tier.description}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 8 }}>
            You can upgrade anytime. Paid plans require a credit card after signup.
          </div>
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
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Terms */}
        <p style={{ fontSize: 11, color: C.textDim, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          By creating an account, you agree to our{' '}
          <Link href="/terms" style={{ color: C.terra, textDecoration: 'none' }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" style={{ color: C.terra, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: C.textMuted }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: C.terra, fontWeight: 600, textDecoration: 'none' }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
      <div
        style={{
          background: C.bgCard,
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          boxShadow: '0 8px 32px rgba(28,25,23,0.08)',
          width: '100%',
          maxWidth: 480,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: C.navy,
            padding: '24px 32px 20px',
            textAlign: 'center',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
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
          </Link>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
            Housing Analytics Platform
          </div>
        </div>

        <Suspense fallback={<div style={{ padding: '48px 32px', textAlign: 'center', color: C.textMuted, fontFamily: C.font }}>Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>

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
