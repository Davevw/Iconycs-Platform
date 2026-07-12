'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const C = {
  bg: '#FAFAF7',
  bgWarm: '#F5F0E8',
  bgCard: '#FFFFFF',
  border: '#E8E2D8',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  terra: '#C4653A',
  terraSoft: '#FFF0E9',
  terraDark: '#9A4420',
  sage: '#5D7E52',
  navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

function GateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/reports';
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        router.push(nextPath);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Incorrect passcode.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font, display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400;1,8..60,600&display=swap');
        @media (max-width: 900px) { .icx-split { flex-direction: column !important; } .icx-left, .icx-right { flex: 1 1 auto !important; } }
      `}</style>

      {/* ══ SIDE-BY-SIDE: banner+text LEFT, passcode RIGHT (full height) ══ */}
      <div className="icx-split" style={{ display: 'flex', width: '100%', minHeight: '100vh', alignItems: 'stretch' }}>

        {/* ══ LEFT — banner header above descriptive features & benefits ══ */}
        <div className="icx-left" style={{ flex: '1 1 56%', display: 'flex', flexDirection: 'column', background: C.bg }}>

          {/* banner image — top of LEFT panel only */}
          <div style={{ width: '100%', lineHeight: 0 }}>
            <img
              src="/brand/gateway-hero.jpg"
              alt="ICONYCS Housing Intelligence — Every home tells a story. We help you read it."
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* descriptive text below banner */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 56px' }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: C.terraSoft, border: `1px solid ${C.terra}22`, borderRadius: 999, padding: '7px 18px', marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: C.terra }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.terraDark, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                The Socio-Economics of Home Ownership
              </span>
            </div>

            <p style={{ fontSize: 15.5, color: C.textBody, lineHeight: 1.8, marginBottom: 18 }}>
              ICONYCS is a housing-intelligence platform that turns raw property and ownership data into clear, decision-grade insight. We unify 109 million residential property records with 73.6M+ owner-occupied homeowner profiles, then layer in AI-powered analytics across ethnicity, income, education, marital status, and household composition — resolvable from a single ZIP code all the way up to the national picture.
            </p>

            <p style={{ fontSize: 15.5, color: C.textBody, lineHeight: 1.8, marginBottom: 24 }}>
              For lenders, investors, researchers, and policymakers, that means sharper fair-lending analysis, smarter market and portfolio targeting, and a true socio-economic view of who owns homes and how neighborhoods are changing. ICONYCS connects the data points others miss — so you can act with confidence when the housing market shifts.
            </p>

            <blockquote style={{ fontSize: 16, color: C.textMuted, fontStyle: 'italic', fontFamily: C.fontSerif, borderLeft: `3px solid ${C.terra}40`, paddingLeft: 20, margin: 0 }}>
              &ldquo;When Housing Markets Shift, Iconycs Knows.&rdquo;
            </blockquote>
          </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL — passcode gate (unchanged) ══ */}
        <div className="icx-right" style={{ flex: '1 1 44%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: C.bgCard, borderLeft: `1px solid ${C.border}` }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, letterSpacing: '0.04em', fontFamily: C.fontSerif }}>ICONYCS</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.textDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Housing Intelligence</div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 6, fontFamily: C.fontSerif, textAlign: 'center' }}>
            Private Access
          </h2>
          <p style={{ fontSize: 13.5, color: C.textMuted, marginBottom: 26, textAlign: 'center', lineHeight: 1.6 }}>
            Enter your access passcode to continue.
          </p>

          {error && (
            <div style={{ background: '#FFF4F0', border: `1px solid ${C.terra}40`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.terra, marginBottom: 16, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                autoFocus
                autoComplete="off"
                placeholder="Enter passcode"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 8,
                  border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: C.font,
                  color: C.text, background: C.bgWarm, outline: 'none', boxSizing: 'border-box',
                  letterSpacing: '0.08em', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 8,
                background: loading ? C.textDim : C.terra, color: '#fff', border: 'none',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: C.font, transition: 'background 0.15s',
                boxShadow: loading ? 'none' : '0 1px 2px rgba(196,101,58,0.3), 0 4px 12px rgba(196,101,58,0.15)',
              }}
            >
              {loading ? 'Verifying...' : 'Enter'}
            </button>
          </form>

          <div style={{ marginTop: 24, fontSize: 12, color: C.textDim, textAlign: 'center', lineHeight: 1.6 }}>
            Access is by invitation only.<br />Contact the site owner for a passcode.
          </div>

          <div style={{ marginTop: 24, fontSize: 11, color: C.textDim, textAlign: 'center' }}>
            <Link href="/terms" style={{ color: C.textDim, textDecoration: 'none' }}>Terms</Link>
            {'  ·  '}
            <Link href="/privacy" style={{ color: C.textDim, textDecoration: 'none' }}>Privacy</Link>
            {'  ·  '}
            <span style={{ color: C.textDim }}>iconycs.com</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
          Loading...
        </div>
      }
    >
      <GateForm />
    </Suspense>
  );
}
