'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#FAFAF7',
  bgWarm: '#F5F0E8',
  bgCard: '#FFFFFF',
  border: '#E8E2D8',
  borderLight: '#F0EBE3',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  terra: '#C4653A',
  terraSoft: '#FFF0E9',
  terraDark: '#9A4420',
  sage: '#5D7E52',
  sageSoft: '#EDF4EB',
  gold: '#B8860B',
  goldSoft: '#FDF6E3',
  navy: '#1B2A4A',
  navyLight: '#EEF1F6',
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
  fontMono: "'IBM Plex Mono', monospace",
};

// ── Mock user data ─────────────────────────────────────────────────────────────
const mockUser = {
  name: 'David Van Waldick',
  email: 'dave@wrfco.com',
  company: 'Western Realty Finance',
  tier: 'free' as 'free' | 'analyst' | 'professional' | 'enterprise',
  memberSince: 'April 2026',
};

// ── Tier config ────────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  free: {
    label: 'FREE',
    color: C.textMuted,
    bg: C.bgWarm,
    price: '$0',
    planName: 'Free Plan',
    reportViews: { used: 3, limit: 10 },
    apiCalls: { used: 0, limit: 0 },
    pdfDownloads: 1,
  },
  analyst: {
    label: 'ANALYST',
    color: C.sage,
    bg: C.sageSoft,
    price: '$49/mo',
    planName: 'Analyst Plan',
    reportViews: { used: 18, limit: 100 },
    apiCalls: { used: 0, limit: 0 },
    pdfDownloads: 5,
  },
  professional: {
    label: 'PROFESSIONAL',
    color: C.terra,
    bg: C.terraSoft,
    price: '$149/mo',
    planName: 'Professional Plan',
    reportViews: { used: 42, limit: 500 },
    apiCalls: { used: 128, limit: 1000 },
    pdfDownloads: 24,
  },
  enterprise: {
    label: 'ENTERPRISE',
    color: C.navy,
    bg: C.navyLight,
    price: 'Custom',
    planName: 'Enterprise Plan',
    reportViews: { used: 87, limit: -1 },
    apiCalls: { used: 3420, limit: -1 },
    pdfDownloads: 61,
  },
};

// ── Feature access matrix ──────────────────────────────────────────────────────
const FEATURES = [
  {
    name: 'National & State Reports',
    tiers: ['free', 'analyst', 'professional', 'enterprise'],
    desc: 'Full national and all 50-state housing analytics',
  },
  {
    name: 'County / City / ZIP Drill-down',
    tiers: ['analyst', 'professional', 'enterprise'],
    desc: 'Granular sub-state geographic analysis',
  },
  {
    name: 'Cascade Report Builder',
    tiers: ['analyst', 'professional', 'enterprise'],
    desc: 'Multi-geography side-by-side comparison reports',
  },
  {
    name: 'Fair Lending Reports',
    tiers: ['professional', 'enterprise'],
    desc: 'HMDA-based fair lending and ECOA analysis',
  },
  {
    name: 'API Access',
    tiers: ['professional', 'enterprise'],
    desc: 'Programmatic access to all ICONYCS data endpoints',
  },
  {
    name: 'Snowflake Direct Access',
    tiers: ['enterprise'],
    desc: 'Direct Snowflake data share for BI tools',
  },
  {
    name: 'White Label',
    tiers: ['enterprise'],
    desc: 'Fully branded reports and portal for your clients',
  },
];

// ── Recent activity (placeholder) ─────────────────────────────────────────────
const RECENT_ACTIVITY = [
  { icon: '📊', label: 'California Housing Report', date: 'Apr 4, 2026' },
  { icon: '⚖️', label: 'Fair Lending Report — Los Angeles', date: 'Apr 4, 2026' },
  { icon: '🔌', label: 'API Query — /api/v1/national', date: 'Apr 4, 2026' },
];

// ── Quick links ────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'Analytics Reports', href: '/reports', icon: '📈', color: C.terra },
  { label: 'Cascade Builder', href: '/reports/cascade', icon: '🔀', color: C.navy },
  { label: 'Fair Lending', href: '/fair-lending', icon: '⚖️', color: C.sage },
  { label: 'API Docs', href: '/api-docs', icon: '🔌', color: C.gold },
  { label: 'Pricing', href: '/pricing', icon: '💳', color: C.textMuted },
];

// ── Helper: initials circle ────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 60, height: 60, borderRadius: '50%',
      background: `linear-gradient(135deg, ${C.terra}, ${C.terraDark})`,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, fontWeight: 700, fontFamily: C.font, flexShrink: 0,
      boxShadow: `0 2px 8px ${C.terra}40`,
    }}>
      {initials}
    </div>
  );
}

// ── Helper: tier badge ─────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: keyof typeof TIER_CONFIG }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      color: cfg.color, background: cfg.bg,
      padding: '3px 10px', borderRadius: 20,
      border: `1px solid ${cfg.color}30`,
    }}>
      {cfg.label}
    </span>
  );
}

// ── Helper: usage bar ──────────────────────────────────────────────────────────
function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const unlimited = limit <= 0;
  const pct = unlimited ? 0 : Math.min((used / limit) * 100, 100);
  const warn = !unlimited && pct > 80;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.textBody }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: C.fontMono, fontWeight: 600, color: warn ? C.terra : C.text }}>
          {used.toLocaleString()} {unlimited ? '' : `/ ${limit.toLocaleString()}`}
          {unlimited && <span style={{ fontSize: 11, color: C.sage, marginLeft: 4 }}>Unlimited</span>}
        </span>
      </div>
      {!unlimited && (
        <div style={{ height: 6, background: C.bgWarm, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%', borderRadius: 3,
            background: warn ? C.terra : C.sage,
            transition: 'width 0.5s ease',
          }} />
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function UserDashboardPage() {
  const user = mockUser;
  const tier = user.tier;
  const cfg = TIER_CONFIG[tier];
  const [billingStatus] = useState<'active' | 'past_due' | 'cancelled'>('active');

  const statusColors = {
    active: { color: C.sage, bg: C.sageSoft, label: 'Active' },
    past_due: { color: C.gold, bg: C.goldSoft, label: 'Past Due' },
    cancelled: { color: C.textMuted, bg: C.bgWarm, label: 'Cancelled' },
  };
  const statusCfg = statusColors[billingStatus];

  const hasFeature = (featureTiers: string[]) => featureTiers.includes(tier);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>

      {/* ── Nav ── */}
      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 24 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>ICONYCS</span>
          </Link>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>My Dashboard</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/reports" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6 }}>Reports</Link>
            <Link href="/pricing" style={{ fontSize: 13, color: C.terra, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.terraSoft, fontWeight: 600 }}>Pricing</Link>
            <Link href="/" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6 }}>← Home</Link>
          </div>
        </div>
      </nav>

      {/* ── Demo Banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #243556 100%)`,
        color: '#fff', padding: '12px 24px', textAlign: 'center',
        fontSize: 13, lineHeight: 1.5,
      }}>
        <span style={{ marginRight: 8 }}>👋</span>
        <strong>You&apos;re viewing a demo dashboard.</strong>
        {' '}Sign in or create an account to see your real data.{' '}
        <Link href="/pricing" style={{ color: '#F9C784', fontWeight: 700, textDecoration: 'underline' }}>
          Get started →
        </Link>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Grid layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 1. Account Overview */}
            <div style={{ background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <Avatar name={user.name} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, margin: 0 }}>
                      {user.name}
                    </h1>
                    <TierBadge tier={tier} />
                  </div>
                  <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 2 }}>{user.email}</div>
                  <div style={{ fontSize: 14, color: C.textBody, fontWeight: 500 }}>{user.company}</div>
                  <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>
                    Member since {user.memberSince}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Subscription Status */}
            <div style={{ background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: C.fontSerif, margin: '0 0 18px' }}>
                Subscription
              </h2>

              {tier === 'free' ? (
                <div style={{
                  padding: '14px 18px', borderRadius: 10,
                  background: C.terraSoft, border: `1px solid ${C.terra}30`,
                  fontSize: 14, color: C.terraDark, marginBottom: 18, lineHeight: 1.6,
                }}>
                  💡 You&apos;re on the <strong>Free plan</strong>. Upgrade to unlock full access to drill-down reports,
                  the Cascade Builder, Fair Lending tools, and API access.
                </div>
              ) : null}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: C.textDim, marginBottom: 2 }}>Current Plan</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{cfg.planName}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, fontFamily: C.fontMono }}>{cfg.price}</div>
                  {tier !== 'free' && tier !== 'enterprise' && (
                    <div style={{ fontSize: 12, color: C.textMuted }}>billed monthly</div>
                  )}
                </div>
              </div>

              {tier !== 'free' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 12, color: statusCfg.color, background: statusCfg.bg, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                    ● {statusCfg.label}
                  </span>
                  <span style={{ fontSize: 12, color: C.textMuted }}>Monthly billing cycle</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/pricing" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 20px', borderRadius: 8, textDecoration: 'none',
                  fontSize: 13, fontWeight: 700, background: C.terra, color: '#fff',
                }}>
                  {tier === 'free' ? '🚀 Upgrade Plan' : '⬆️ Change Plan'}
                </Link>
                {tier !== 'free' && (
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 20px', borderRadius: 8, border: `1.5px solid ${C.border}`,
                    fontSize: 13, fontWeight: 600, background: C.bgCard, color: C.textBody,
                    cursor: 'pointer', fontFamily: C.font,
                  }}
                    onClick={() => alert('Stripe customer portal coming soon.')}>
                    💳 Manage Billing
                  </button>
                )}
              </div>
            </div>

            {/* 4. Usage This Month */}
            <div style={{ background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: C.fontSerif, margin: '0 0 18px' }}>
                Usage This Month
              </h2>
              <UsageBar used={cfg.reportViews.used} limit={cfg.reportViews.limit} label="Report Views" />
              <UsageBar used={cfg.apiCalls.used} limit={cfg.apiCalls.limit} label="API Calls" />
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                <span style={{ fontSize: 13, color: C.textBody }}>PDF Downloads</span>
                <span style={{ fontSize: 13, fontFamily: C.fontMono, fontWeight: 600, color: C.text }}>
                  {cfg.pdfDownloads}
                </span>
              </div>
              <div style={{ marginTop: 14, padding: '10px 14px', background: C.bgWarm, borderRadius: 8, fontSize: 11, color: C.textDim }}>
                📅 Usage resets on May 1, 2026 · Placeholder values — live tracking coming soon
              </div>
            </div>

            {/* 5. Recent Activity */}
            <div style={{ background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: C.fontSerif, margin: '0 0 18px' }}>
                Recent Activity
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0',
                    borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${C.borderLight}` : 'none',
                  }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: C.textBody, fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: C.textDim, fontStyle: 'italic' }}>
                Placeholder activity — real history coming soon.
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 3. Feature Access */}
            <div style={{ background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', background: C.navy, color: '#fff' }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>
                  FEATURE ACCESS
                </h2>
                <div style={{ fontSize: 12, color: '#A8B5CC', marginTop: 2 }}>
                  Your {cfg.label} plan includes:
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                {FEATURES.map((feat, i) => {
                  const unlocked = hasFeature(feat.tiers);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '10px 20px',
                      borderBottom: i < FEATURES.length - 1 ? `1px solid ${C.borderLight}` : 'none',
                      opacity: unlocked ? 1 : 0.55,
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                        {unlocked ? '✅' : '🔒'}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: unlocked ? 600 : 400, color: unlocked ? C.text : C.textMuted }}>
                          {feat.name}
                        </div>
                        <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, lineHeight: 1.4 }}>
                          {feat.desc}
                        </div>
                        {!unlocked && (
                          <div style={{ fontSize: 11, color: C.terra, marginTop: 3, fontWeight: 600 }}>
                            {feat.tiers[0] === 'analyst' ? 'Analyst+' : feat.tiers[0] === 'professional' ? 'Professional+' : 'Enterprise only'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {tier !== 'enterprise' && (
                <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, background: C.bgWarm }}>
                  <Link href="/pricing" style={{
                    display: 'block', textAlign: 'center', padding: '9px 16px',
                    borderRadius: 8, textDecoration: 'none', fontSize: 13,
                    fontWeight: 700, background: C.terra, color: '#fff',
                  }}>
                    🚀 Unlock More Features
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Quick Links */}
            <div style={{ background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', background: C.navy, color: '#fff' }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>
                  QUICK LINKS
                </h2>
              </div>
              <div style={{ padding: '8px 0' }}>
                {QUICK_LINKS.map((link, i) => (
                  <Link key={i} href={link.href} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 20px', textDecoration: 'none',
                    borderBottom: i < QUICK_LINKS.length - 1 ? `1px solid ${C.borderLight}` : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.bgWarm)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 18 }}>{link.icon}</span>
                    <span style={{ fontSize: 14, color: C.textBody, fontWeight: 500 }}>{link.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 14, color: C.textDim }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tier upgrade hint */}
            {tier === 'free' && (
              <div style={{
                background: `linear-gradient(135deg, ${C.navy} 0%, #243556 100%)`,
                borderRadius: 14, padding: 24, color: '#fff',
              }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>🚀</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: C.fontSerif }}>
                  Unlock the Full Platform
                </div>
                <div style={{ fontSize: 13, color: '#A8B5CC', marginBottom: 16, lineHeight: 1.6 }}>
                  Get county drill-down, fair lending analysis, API access and more starting at $49/mo.
                </div>
                <Link href="/pricing" style={{
                  display: 'block', textAlign: 'center', padding: '10px 16px',
                  borderRadius: 8, textDecoration: 'none', fontSize: 13,
                  fontWeight: 700, background: C.terra, color: '#fff',
                }}>
                  View Plans →
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
