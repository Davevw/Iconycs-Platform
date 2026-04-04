'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Design Tokens (matches reports page) ────────────────────────────────────
const C = {
  bg: '#FAFAF7',
  bgCard: '#FFFFFF',
  bgWarm: '#F5F0E8',
  border: '#E8E2D8',
  borderLight: '#F0EBE3',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  terra: '#C4653A',
  sage: '#5D7E52',
  gold: '#B8860B',
  navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

// ─── Tier Definitions ─────────────────────────────────────────────────────────
// ─── Pricing Tiers ────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'free',
    name: 'FREE',
    subtitle: 'Explore',
    price: '$0',
    period: '/month',
    description: 'National and state-level summary data. No credit card required.',
    features: [
      'National + state-level data',
      'Basic ethnicity & loan charts',
      '3 report views per day',
      'PDF export (watermarked)',
    ],
    cta: 'Start Free',
    ctaLink: '/reports',
    highlighted: false,
  },
  {
    id: 'analyst',
    name: 'ANALYST',
    subtitle: 'Single State',
    price: '$98',
    period: '/month',
    description: 'Full drill-down for one state. Add major states individually.',
    features: [
      'Full geographic drill-down',
      'State → County → City → ZIP',
      'All demographic breakdowns',
      'LTV tier analysis',
      'Mortgage intelligence panel',
      'PDF export (branded)',
      'Cascade report builder',
    ],
    addons: [
      'CA, FL, TX, or NY: $2,500/mo each',
      'Up to 4 additional states: $1,500/mo total',
    ],
    cta: 'Get Early Access',
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    subtitle: 'Multi-State',
    price: '$398',
    period: '/month',
    description: 'Power user access across multiple states with advanced analytics.',
    badge: 'POPULAR',
    features: [
      'Everything in Analyst',
      '5–25 states: $10,000/mo',
      'Social Housing Score',
      'Fair Lending Report generator',
      'Time-series analysis',
      'Matrix report builder',
      'API access (v1)',
      'Custom data feeds',
    ],
    cta: 'Get Early Access',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    subtitle: 'Full Platform Access',
    price: '$20,000',
    period: '/month',
    description: 'All 50 states + DC. White label. Snowflake direct access. Custom build.',
    features: [
      'All 50 states + DC',
      'Snowflake direct access key',
      'White label / co-branded',
      'Fair Lending Agent (AI)',
      'Custom Snowflake views',
      'Team seats (unlimited)',
      'Priority support & SLA',
      'Quarterly data updates',
      'Signed data use agreement',
    ],
    cta: 'Contact Us',
    ctaLink: 'mailto:info@iconycs.com',
    highlighted: false,
  },
];

const PAY_PER_REPORT = { price: '$19.99', description: 'Single report download, any geography, no subscription required.' };

// ─── Waitlist Modal ───────────────────────────────────────────────────────────
function WaitlistModal({
  tier,
  onClose,
}: {
  tier: (typeof TIERS)[number];
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, tier: tier.id }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(28,25,23,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.bgCard, borderRadius: 16, padding: 36,
          maxWidth: 440, width: '100%', boxShadow: '0 24px 64px rgba(28,25,23,0.2)',
          border: `1px solid ${C.border}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {!success ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: 'inline-block', padding: '4px 10px',
                background: tier.id === 'professional' ? C.navy : C.bgWarm,
                color: tier.id === 'professional' ? '#fff' : C.terra,
                borderRadius: 20, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', marginBottom: 10, fontFamily: C.font,
              }}>
                {tier.name} — {tier.tagline}
              </div>
              <h2 style={{
                fontSize: 22, fontWeight: 700, color: C.text,
                fontFamily: C.fontSerif, margin: '0 0 8px',
              }}>
                Join the Early Access List
              </h2>
              <p style={{ fontSize: 14, color: C.textMuted, fontFamily: C.font, margin: 0 }}>
                ICONYCS is in private beta. Get notified the moment{' '}
                <strong>{tier.name} ({tier.price}/mo)</strong> goes live.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textBody, fontFamily: C.font, display: 'block', marginBottom: 6 }}>
                  Work Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: `1.5px solid ${error ? '#EF4444' : C.border}`,
                    borderRadius: 8, fontSize: 14, fontFamily: C.font,
                    outline: 'none', background: C.bgWarm, boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textBody, fontFamily: C.font, display: 'block', marginBottom: 6 }}>
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Acme Bank, City of San Diego…"
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8, fontSize: 14, fontFamily: C.font,
                    outline: 'none', background: C.bgWarm, boxSizing: 'border-box',
                  }}
                />
              </div>
              {error && (
                <p style={{ fontSize: 13, color: '#EF4444', margin: 0, fontFamily: C.font }}>{error}</p>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1, padding: '11px 0', borderRadius: 8,
                    border: `1.5px solid ${C.border}`, background: 'transparent',
                    fontSize: 14, fontWeight: 600, fontFamily: C.font,
                    color: C.textMuted, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2, padding: '11px 0', borderRadius: 8,
                    border: 'none', background: C.terra,
                    fontSize: 14, fontWeight: 700, fontFamily: C.font,
                    color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Submitting…' : "I'm In →"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{
              fontSize: 24, fontWeight: 700, color: C.text,
              fontFamily: C.fontSerif, margin: '0 0 12px',
            }}>
              You&apos;re on the list!
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, fontFamily: C.font, marginBottom: 24 }}>
              We&apos;ll notify you at <strong>{email}</strong> as soon as{' '}
              <strong>{tier.name}</strong> opens up. First in line gets the best rate.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '11px 32px', borderRadius: 8,
                border: 'none', background: C.navy,
                fontSize: 14, fontWeight: 700, fontFamily: C.font,
                color: '#fff', cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Check icon ───────────────────────────────────────────────────────────────
function Check({ dark }: { dark?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="8" cy="8" r="8" fill={dark ? 'rgba(255,255,255,0.15)' : '#E8F4E8'} />
      <path d="M4.5 8L7 10.5L11.5 5.5" stroke={dark ? '#fff' : C.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lock({ dark }: { dark?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <rect x="2" y="6" width="10" height="7" rx="2" stroke={dark ? 'rgba(255,255,255,0.3)' : C.textDim} strokeWidth="1.4" fill="none" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke={dark ? 'rgba(255,255,255,0.3)' : C.textDim} strokeWidth="1.4" fill="none" />
    </svg>
  );
}

// ─── Tier Card ────────────────────────────────────────────────────────────────
function TierCard({
  tier,
  onEarlyAccess,
}: {
  tier: (typeof TIERS)[number];
  onEarlyAccess: (tier: (typeof TIERS)[number]) => void;
}) {
  const isDark = tier.id === 'professional';
  const textColor = isDark ? '#fff' : C.text;
  const mutedColor = isDark ? 'rgba(255,255,255,0.65)' : C.textMuted;

  return (
    <div
      style={{
        background: tier.bg,
        border: `2px solid ${tier.popular ? C.terra : tier.border}`,
        borderRadius: 16,
        padding: '28px 24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: tier.popular
          ? '0 8px 40px rgba(196,101,58,0.18)'
          : '0 2px 12px rgba(28,25,23,0.06)',
      }}
    >
      {tier.popular && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          background: C.terra, color: '#fff',
          padding: '4px 16px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          fontFamily: C.font, whiteSpace: 'nowrap',
        }}>
          ⭐ MOST POPULAR
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          color: isDark ? 'rgba(255,255,255,0.5)' : C.textDim,
          fontFamily: C.font, marginBottom: 4,
        }}>
          {tier.name}
        </div>
        <div style={{
          fontSize: 17, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.85)' : C.terra,
          fontFamily: C.fontSerif, marginBottom: 16, fontStyle: 'italic',
        }}>
          "{tier.tagline}"
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ fontSize: 42, fontWeight: 800, color: textColor, fontFamily: C.font, lineHeight: 1 }}>
            {tier.price}
          </span>
          {tier.period && (
            <span style={{ fontSize: 13, color: mutedColor, fontFamily: C.font, paddingBottom: 6 }}>
              /{tier.period}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginBottom: 24 }}>
        {tier.ctaHref ? (
          <Link
            href={tier.ctaHref}
            style={{
              display: 'block', textAlign: 'center',
              padding: '12px 0', borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: C.font,
              textDecoration: 'none',
              border: `2px solid ${C.border}`,
              background: 'transparent',
              color: C.textBody,
              transition: 'all 0.15s',
            }}
          >
            {tier.cta}
          </Link>
        ) : (
          <button
            onClick={() => onEarlyAccess(tier)}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: C.font,
              cursor: 'pointer', transition: 'all 0.15s',
              ...(tier.ctaStyle === 'inverse'
                ? { background: '#fff', color: C.navy, border: '2px solid rgba(255,255,255,0.3)' }
                : tier.ctaStyle === 'gold'
                ? { background: C.gold, color: '#fff', border: `2px solid ${C.gold}` }
                : { background: C.terra, color: '#fff', border: `2px solid ${C.terra}` }),
            }}
          >
            {tier.cta} →
          </button>
        )}
      </div>

      {/* Features */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          color: mutedColor, fontFamily: C.font, marginBottom: 10,
        }}>
          INCLUDES
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tier.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Check dark={isDark} />
              <span style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.85)' : C.textBody, fontFamily: C.font, lineHeight: 1.4 }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {tier.locked.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              color: mutedColor, fontFamily: C.font, marginBottom: 10,
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : C.borderLight}`,
              paddingTop: 12,
            }}>
              REQUIRES UPGRADE
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {tier.locked.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Lock dark={isDark} />
                  <span style={{ fontSize: 12, color: mutedColor, fontFamily: C.font, lineHeight: 1.4 }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [waitlistTier, setWaitlistTier] = useState<(typeof TIERS)[number] | null>(null);
  const [payPerReportModal, setPayPerReportModal] = useState(false);

  const payPerReportTier = {
    id: 'pay_per_report',
    name: 'PAY-PER-REPORT',
    tagline: 'One Report',
    price: '$19.99',
    period: 'one-time',
    priceId: 'price_1TIbbJ9CvaSs0o4AkpHLrruj',
    cta: 'Get Early Access',
    ctaStyle: 'primary',
    popular: false,
    bg: C.bgCard,
    border: C.border,
    color: C.text,
    features: [],
    locked: [],
  } as const;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pricing-card { animation: fadeUp 0.4s ease both; }
        .pricing-card:nth-child(1) { animation-delay: 0.05s; }
        .pricing-card:nth-child(2) { animation-delay: 0.1s; }
        .pricing-card:nth-child(3) { animation-delay: 0.15s; }
        .pricing-card:nth-child(4) { animation-delay: 0.2s; }
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 32px !important; }
        }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
        {/* ── Nav ── */}
        <nav style={{
          background: C.bgCard, borderBottom: `1px solid ${C.border}`,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', height: 56, gap: 20,
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>ICONYCS</span>
            </Link>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
              <Link href="/reports" style={{
                fontSize: 13, color: C.textMuted, textDecoration: 'none',
                padding: '6px 14px', borderRadius: 7, background: C.bgWarm,
                fontWeight: 500,
              }}>
                Analytics
              </Link>
              <Link href="/pricing" style={{
                fontSize: 13, color: '#fff', textDecoration: 'none',
                padding: '6px 14px', borderRadius: 7, background: C.terra,
                fontWeight: 600,
              }}>
                Pricing
              </Link>
              <Link href="/" style={{
                fontSize: 13, color: C.textMuted, textDecoration: 'none',
                padding: '6px 14px', borderRadius: 7,
                fontWeight: 500,
              }}>
                Home
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div style={{
          background: `linear-gradient(160deg, #FFF8F5 0%, ${C.bgWarm} 50%, #F0EBE3 100%)`,
          borderBottom: `1px solid ${C.border}`,
          padding: '72px 24px 60px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#FFF', border: `1px solid ${C.border}`,
            borderRadius: 20, padding: '6px 16px',
            fontSize: 12, fontWeight: 600, color: C.terra,
            marginBottom: 24, letterSpacing: '0.06em',
          }}>
            🚀 NOW IN EARLY ACCESS
          </div>
          <h1
            className="hero-title"
            style={{
              fontSize: 48, fontWeight: 800, color: C.text,
              fontFamily: C.fontSerif, margin: '0 0 16px',
              lineHeight: 1.15, letterSpacing: '-0.02em',
            }}
          >
            Housing Intelligence,<br />
            <span style={{ color: C.terra }}>Priced to Perform</span>
          </h1>
          <p style={{
            fontSize: 17, color: C.textMuted, maxWidth: 560,
            margin: '0 auto 32px', lineHeight: 1.6,
          }}>
            130M+ property records. 187M+ owner profiles. Every tier unlocks
            a deeper layer of the socio-economics of home ownership.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted }}>
              <span style={{ color: C.sage, fontWeight: 700 }}>✓</span> No contracts
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted }}>
              <span style={{ color: C.sage, fontWeight: 700 }}>✓</span> Cancel anytime
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted }}>
              <span style={{ color: C.sage, fontWeight: 700 }}>✓</span> 14-day free trial
            </div>
          </div>
        </div>

        {/* ── Pricing Grid ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
          <div
            className="pricing-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {TIERS.map((tier, i) => (
              <div key={tier.id} className="pricing-card" style={{ paddingTop: tier.popular ? 14 : 0 }}>
                <TierCard tier={tier} onEarlyAccess={setWaitlistTier} />
              </div>
            ))}
          </div>

          {/* ── Pay-per-report Banner ── */}
          <div style={{
            marginTop: 48,
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                color: C.textDim, fontFamily: C.font, marginBottom: 6,
              }}>
                NEED JUST ONE REPORT?
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: C.text, fontFamily: C.font }}>$9.99</span>
                <span style={{ fontSize: 13, color: C.textMuted }}>one-time per report</span>
              </div>
              <p style={{ fontSize: 14, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                Full drill-down report for any geography — county, city, or ZIP.
                Perfect for one-off projects, due diligence, or feasibility studies.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['Instant download', 'PDF + data export', 'Full demographics', 'No subscription needed'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textBody }}>
                    <span style={{ color: C.sage, fontWeight: 700, fontSize: 14 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setWaitlistTier(payPerReportTier as any)}
                style={{
                  padding: '13px 28px', borderRadius: 9,
                  border: 'none', background: C.terra,
                  fontSize: 14, fontWeight: 700, fontFamily: C.font,
                  color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Get Early Access →
              </button>
            </div>
          </div>

          {/* ── FAQ Strip ── */}
          <div style={{
            marginTop: 64, paddingTop: 48,
            borderTop: `1px solid ${C.border}`,
          }}>
            <h2 style={{
              fontSize: 24, fontWeight: 700, color: C.text,
              fontFamily: C.fontSerif, textAlign: 'center', marginBottom: 40,
            }}>
              Common Questions
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {[
                {
                  q: 'When does ICONYCS launch?',
                  a: 'We\'re in private beta now. Early access waitlist members get first access and locked-in pricing.',
                },
                {
                  q: 'What\'s included in the free tier?',
                  a: 'National and state-level housing data, basic demographic breakdowns, and 3 report views per day — no credit card required.',
                },
                {
                  q: 'Can I switch tiers?',
                  a: 'Yes. Upgrade or downgrade anytime. Billing is prorated to the day.',
                },
                {
                  q: 'What is the Social Housing Score?',
                  a: 'The Social Housing Score™ is ICONYCS\'s proprietary index combining ethnicity, wealth, income, education, and loan data into a single community risk/opportunity score.',
                },
                {
                  q: 'Is there an annual plan?',
                  a: 'Yes — annual subscribers save 20%. Contact us after joining the waitlist to lock in annual pricing.',
                },
                {
                  q: 'Do you offer custom data feeds?',
                  a: 'Enterprise and above get custom Snowflake views. For bespoke data partnerships, contact the ICONYCS team directly.',
                },
              ].map(({ q, a }) => (
                <div key={q} style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '20px 22px',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: C.font, marginBottom: 8 }}>
                    {q}
                  </div>
                  <div style={{ fontSize: 13, color: C.textMuted, fontFamily: C.font, lineHeight: 1.6 }}>
                    {a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div style={{
            marginTop: 64,
            background: `linear-gradient(135deg, ${C.navy} 0%, #2A4A7F 100%)`,
            borderRadius: 16, padding: '48px 40px',
            textAlign: 'center', color: '#fff',
          }}>
            <h2 style={{
              fontSize: 28, fontWeight: 700,
              fontFamily: C.fontSerif, margin: '0 0 12px',
            }}>
              Ready to see inside the data?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 28px' }}>
              Start free. No credit card required. Upgrade when you need more depth.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/reports"
                style={{
                  padding: '13px 28px', borderRadius: 9,
                  background: C.terra, color: '#fff',
                  fontSize: 14, fontWeight: 700, fontFamily: C.font,
                  textDecoration: 'none', display: 'inline-block',
                }}
              >
                Start Free →
              </Link>
              <button
                onClick={() => setWaitlistTier(TIERS[2])}
                style={{
                  padding: '13px 28px', borderRadius: 9,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  fontFamily: C.font, cursor: 'pointer',
                }}
              >
                Join Early Access
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: '24px',
          textAlign: 'center',
          fontSize: 12, color: C.textDim,
          fontFamily: C.font,
        }}>
          © {new Date().getFullYear()} ICONYCS Housing Analytics · All prices in USD ·{' '}
          <Link href="/" style={{ color: C.textDim, textDecoration: 'none' }}>Home</Link>
          {' · '}
          <Link href="/reports" style={{ color: C.textDim, textDecoration: 'none' }}>Analytics</Link>
        </div>
      </div>

      {/* ── Waitlist Modal ── */}
      {waitlistTier && (
        <WaitlistModal
          tier={waitlistTier as (typeof TIERS)[number]}
          onClose={() => setWaitlistTier(null)}
        />
      )}
    </>
  );
}
