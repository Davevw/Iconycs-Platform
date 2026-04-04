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

// ─── Tier Definitions ────────────────────────────────────────────────────────
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
      'One state — full drill-down',
      'State → County → City → ZIP',
      'All demographic breakdowns',
      'LTV tier analysis (FNMA tiers)',
      'Mortgage intelligence panel',
      'PDF export (branded)',
      'Cascade report builder',
    ],
    addons: [
      'Add CA, FL, TX, or NY: +$2,500/mo each',
      'Add up to 4 more states: +$1,500/mo total',
    ],
    cta: 'Get Early Access',
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    subtitle: '5-25 States',
    price: '$10,000',
    period: '/month',
    description: 'Multi-state coverage with advanced analytics and Fair Lending reporting.',
    badge: 'POPULAR',
    features: [
      'Everything in Analyst',
      '5 to 25 states included',
      'Social Housing Score',
      'Fair Lending Report generator',
      'Time-series trend analysis',
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
      'White label / co-branded',
      'Snowflake direct access',
      'Fair Lending AI Agent',
      'Custom build to spec',
    ],
    cta: 'Contact Us',
    ctaLink: 'mailto:info@iconycs.com',
    highlighted: false,
  },
] as const;

type Tier = (typeof TIERS)[number];

// ─── Enterprise Geographic Pricing Modal ─────────────────────────────────────
function EnterpriseGeoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,14,26,0.72)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.bgCard, borderRadius: 18, overflow: 'hidden',
          maxWidth: 520, width: '100%',
          boxShadow: '0 32px 80px rgba(10,14,26,0.35)',
          border: `1px solid ${C.border}`,
          maxHeight: '90vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          background: C.navy, padding: '22px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.5)', fontFamily: C.font, marginBottom: 4,
            }}>
              PRICING BREAKDOWN
            </div>
            <h2 style={{
              fontSize: 18, fontWeight: 800, color: '#fff',
              fontFamily: C.font, margin: 0, letterSpacing: '-0.01em',
            }}>
              ENTERPRISE GEOGRAPHIC PRICING
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.12)', border: 'none',
              borderRadius: 8, width: 34, height: 34,
              color: 'rgba(255,255,255,0.7)', fontSize: 18,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 300, flexShrink: 0,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 28px 0' }}>

          {/* Major Markets */}
          <Section label="Major Markets" sub="per state / month">
            <PriceRow label="California" value="$2,500/mo" />
            <PriceRow label="Florida" value="$2,500/mo" />
            <PriceRow label="Texas" value="$2,500/mo" />
            <PriceRow label="New York" value="$2,500/mo" />
          </Section>

          <Divider />

          {/* Regional Expansion */}
          <Section label="Regional Expansion">
            <PriceRow label="Up to 4 additional states" value="$1,500/mo total" />
          </Section>

          <Divider />

          {/* Multi-State Programs */}
          <Section label="Multi-State Programs">
            <PriceRow label="5–25 states" value="$10,000/mo" />
            <PriceRow label="All 50 states + DC" value="$20,000/mo" highlight />
          </Section>

          {/* Includes List */}
          <div style={{
            margin: '24px 0 0',
            padding: '20px',
            background: C.bgWarm,
            borderRadius: 10,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              color: C.textDim, fontFamily: C.font, marginBottom: 12,
            }}>
              ALL ENTERPRISE PLANS INCLUDE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                'Snowflake direct access key',
                'Signed data use agreement',
                'White label / co-branded option',
                'Fair Lending AI Agent',
                'Quarterly data updates',
                'Priority support & SLA',
                'Team seats (unlimited)',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: C.sage, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.textBody, fontFamily: C.font }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{
            margin: '16px 0',
            padding: '14px 20px',
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 9,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 15 }}>📬</span>
            <span style={{ fontSize: 13, color: C.textMuted, fontFamily: C.font }}>
              <strong style={{ color: C.textBody }}>info@iconycs.com</strong>
              {' · '}
              <strong style={{ color: C.textBody }}>760-672-0145</strong>
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '20px 28px 24px',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          borderTop: `1px solid ${C.borderLight}`,
          marginTop: 8,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px', borderRadius: 8,
              border: `1.5px solid ${C.border}`, background: 'transparent',
              fontSize: 13, fontWeight: 600, fontFamily: C.font,
              color: C.textMuted, cursor: 'pointer',
            }}
          >
            Close
          </button>
          <a
            href="mailto:info@iconycs.com?subject=Enterprise%20Demo%20Request"
            style={{
              padding: '10px 20px', borderRadius: 8,
              border: 'none', background: C.terra,
              fontSize: 13, fontWeight: 700, fontFamily: C.font,
              color: '#fff', cursor: 'pointer', textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Request a Demo →
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: C.font }}>{label}</span>
        {sub && <span style={{ fontSize: 11, color: C.textDim, fontFamily: C.font }}>{sub}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '18px 0' }} />;
}

function PriceRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 10px', borderRadius: 7,
      background: highlight ? 'rgba(196,101,58,0.07)' : 'transparent',
      border: highlight ? `1px solid rgba(196,101,58,0.18)` : '1px solid transparent',
    }}>
      <span style={{
        fontSize: 13, fontFamily: C.font,
        color: highlight ? C.textBody : C.textMuted,
        fontWeight: highlight ? 600 : 400,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 14, fontWeight: 700, fontFamily: C.font,
        color: C.terra,
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Waitlist Modal ───────────────────────────────────────────────────────────
function WaitlistModal({
  tier,
  onClose,
}: {
  tier: { id: string; name: string; price: string };
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
                {tier.name}
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

// ─── Check / Lock icons ───────────────────────────────────────────────────────
function Check({ dark }: { dark?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="8" cy="8" r="8" fill={dark ? 'rgba(255,255,255,0.15)' : '#E8F4E8'} />
      <path d="M4.5 8L7 10.5L11.5 5.5" stroke={dark ? '#fff' : C.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Standard Tier Card ───────────────────────────────────────────────────────
function TierCard({
  tier,
  onEarlyAccess,
}: {
  tier: Tier;
  onEarlyAccess: (tier: Tier) => void;
}) {
  const isPro = tier.id === 'professional';
  const bgColor = isPro ? C.navy : C.bgCard;
  const borderColor = isPro ? C.navy : (tier.highlighted ? C.terra : C.border);
  const textColor = isPro ? '#fff' : C.text;
  const mutedColor = isPro ? 'rgba(255,255,255,0.65)' : C.textMuted;
  const bodyColor = isPro ? 'rgba(255,255,255,0.85)' : C.textBody;

  return (
    <div
      style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 16,
        padding: '28px 24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isPro
          ? '0 8px 40px rgba(27,42,74,0.25)'
          : '0 2px 12px rgba(28,25,23,0.06)',
        height: '100%',
      }}
    >
      {'badge' in tier && tier.badge && (
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
          color: isPro ? 'rgba(255,255,255,0.5)' : C.textDim,
          fontFamily: C.font, marginBottom: 4,
        }}>
          {tier.name}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 500, color: mutedColor,
          fontFamily: C.font, marginBottom: 14, fontStyle: 'italic',
        }}>
          {tier.subtitle}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 38, fontWeight: 800, color: textColor, fontFamily: C.font, lineHeight: 1 }}>
            {tier.price}
          </span>
          <span style={{ fontSize: 13, color: mutedColor, fontFamily: C.font, paddingBottom: 5 }}>
            {tier.period}
          </span>
        </div>
        <p style={{ fontSize: 13, color: mutedColor, fontFamily: C.font, margin: '10px 0 0', lineHeight: 1.5 }}>
          {tier.description}
        </p>
      </div>

      {/* CTA */}
      <div style={{ marginBottom: 20 }}>
        {'ctaLink' in tier && tier.ctaLink ? (
          <Link
            href={tier.ctaLink}
            style={{
              display: 'block', textAlign: 'center',
              padding: '11px 0', borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: C.font,
              textDecoration: 'none',
              border: `2px solid ${C.border}`,
              background: 'transparent',
              color: C.textBody,
            }}
          >
            {tier.cta}
          </Link>
        ) : (
          <Link
            href={`/signup?tier=${tier.id}`}
            style={{
              display: 'block', textAlign: 'center',
              width: '100%', padding: '11px 0', borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: C.font,
              cursor: 'pointer', textDecoration: 'none',
              background: isPro ? '#fff' : C.terra,
              color: isPro ? C.navy : '#fff',
              border: `2px solid ${isPro ? 'rgba(255,255,255,0.3)' : C.terra}`,
              boxSizing: 'border-box',
            }}
          >
            {tier.cta} →
          </Link>
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
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tier.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Check dark={isPro} />
              <span style={{ fontSize: 13, color: bodyColor, fontFamily: C.font, lineHeight: 1.4 }}>
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Enterprise Card ──────────────────────────────────────────────────────────
function EnterpriseCard({ onViewPricing }: { onViewPricing: () => void }) {
  const tier = TIERS[3]; // enterprise

  return (
    <div
      style={{
        background: C.bgCard,
        border: `2px solid ${C.border}`,
        borderRadius: 16,
        padding: '28px 24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 12px rgba(28,25,23,0.06)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          color: C.textDim, fontFamily: C.font, marginBottom: 4,
        }}>
          {tier.name}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 500, color: C.textMuted,
          fontFamily: C.font, marginBottom: 14, fontStyle: 'italic',
        }}>
          {tier.subtitle}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 38, fontWeight: 800, color: C.text, fontFamily: C.font, lineHeight: 1 }}>
            {tier.price}
          </span>
          <span style={{ fontSize: 13, color: C.textMuted, fontFamily: C.font, paddingBottom: 5 }}>
            {tier.period}
          </span>
        </div>
        <p style={{ fontSize: 13, color: C.textMuted, fontFamily: C.font, margin: '10px 0 0', lineHeight: 1.5 }}>
          {tier.description}
        </p>
      </div>

      {/* Dual CTA Buttons */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
        <button
          onClick={onViewPricing}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 8,
            fontSize: 13, fontWeight: 700, fontFamily: C.font,
            cursor: 'pointer',
            background: 'transparent',
            color: C.navy,
            border: `2px solid ${C.navy}`,
          }}
        >
          View Pricing
        </button>
        <a
          href="mailto:info@iconycs.com"
          style={{
            flex: 1, padding: '10px 0', borderRadius: 8,
            fontSize: 13, fontWeight: 700, fontFamily: C.font,
            cursor: 'pointer',
            background: C.terra,
            color: '#fff',
            border: `2px solid ${C.terra}`,
            textDecoration: 'none',
            textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Contact Us
        </a>
      </div>

      {/* Features */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          color: C.textMuted, fontFamily: C.font, marginBottom: 10,
        }}>
          INCLUDES
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tier.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Check />
              <span style={{ fontSize: 13, color: C.textBody, fontFamily: C.font, lineHeight: 1.4 }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* View Geographic Pricing link */}
        <button
          onClick={onViewPricing}
          style={{
            marginTop: 18, width: '100%',
            padding: '9px 0', borderRadius: 7,
            background: 'rgba(196,101,58,0.08)',
            border: `1px solid rgba(196,101,58,0.22)`,
            fontSize: 12, fontWeight: 700, fontFamily: C.font,
            color: C.terra, cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          🗺 View Geographic Pricing
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [waitlistTier, setWaitlistTier] = useState<{ id: string; name: string; price: string } | null>(null);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);

  const payPerReportTier = {
    id: 'pay_per_report',
    name: 'PAY-PER-REPORT',
    price: '$9.99',
  };

  // Tiers for the grid (first 3 use TierCard, enterprise uses EnterpriseCard)
  const regularTiers = TIERS.slice(0, 3);

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
            {['No contracts', 'Cancel anytime', '14-day free trial'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted }}>
                <span style={{ color: C.sage, fontWeight: 700 }}>✓</span> {label}
              </div>
            ))}
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
            {regularTiers.map((tier) => (
              <div
                key={tier.id}
                className="pricing-card"
                style={{ paddingTop: tier.highlighted ? 14 : 0 }}
              >
                <TierCard tier={tier} onEarlyAccess={setWaitlistTier} />
              </div>
            ))}

            {/* Enterprise card — custom layout */}
            <div className="pricing-card">
              <EnterpriseCard onViewPricing={() => setShowEnterpriseModal(true)} />
            </div>
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
                onClick={() => setWaitlistTier(payPerReportTier)}
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
                  a: "We're in private beta now. Early access waitlist members get first access and locked-in pricing.",
                },
                {
                  q: "What's included in the free tier?",
                  a: 'National and state-level housing data, basic demographic breakdowns, and 3 report views per day — no credit card required.',
                },
                {
                  q: 'Can I switch tiers?',
                  a: 'Yes. Upgrade or downgrade anytime. Billing is prorated to the day.',
                },
                {
                  q: 'What is the Social Housing Score?',
                  a: "The Social Housing Score™ is ICONYCS's proprietary index combining ethnicity, wealth, income, education, and loan data into a single community risk/opportunity score.",
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

      {/* ── Enterprise Geo Pricing Modal ── */}
      {showEnterpriseModal && (
        <EnterpriseGeoModal onClose={() => setShowEnterpriseModal(false)} />
      )}

      {/* ── Waitlist Modal ── */}
      {waitlistTier && (
        <WaitlistModal
          tier={waitlistTier}
          onClose={() => setWaitlistTier(null)}
        />
      )}
    </>
  );
}
