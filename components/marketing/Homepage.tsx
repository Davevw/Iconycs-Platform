'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════
// DESIGN TOKENS — Dark base + warm earth accents
// ═══════════════════════════════════════════
const C = {
  bg: '#0C0F12', bgWarm: '#12110F', card: '#1A1814', surface: '#1E1C18',
  border: '#2A2620', borderLight: '#363028',
  text: '#F2EDE6', textSoft: '#C4B9A8', textMuted: '#8A7E6E', textDim: '#5C5347',
  terra: '#C4653A', terraLight: '#D4845E', terraGlow: 'rgba(196,101,58,0.12)',
  sage: '#7A9A6D', sageGlow: 'rgba(122,154,109,0.12)',
  gold: '#D4A54A', goldGlow: 'rgba(212,165,74,0.12)',
  navy: '#1B2A4A', cream: '#FAF7F2',
  chart: ['#C4653A', '#7A9A6D', '#D4A54A', '#6B8EBD', '#B85C8A', '#5AADA8'],
  font: "'DM Sans', sans-serif",
  fontSerif: "'Playfair Display', serif",
  fontMono: "'JetBrains Mono', monospace",
  radius: 14, radiusSm: 8,
};

// ═══════════════════════════════════════════
// INTERACTIVE DEMO DATA
// ═══════════════════════════════════════════
const ETHNICITY_DATA = [
  { group: 'White', rate: 73.1, value: 310, count: '76.2M', color: C.chart[3] },
  { group: 'Hispanic', rate: 51.1, value: 280, count: '10.8M', color: C.chart[0] },
  { group: 'Black', rate: 44.2, value: 235, count: '9.4M', color: C.chart[1] },
  { group: 'Asian', rate: 62.8, value: 475, count: '4.1M', color: C.chart[2] },
  { group: 'Other', rate: 56.5, value: 295, count: '2.8M', color: C.chart[4] },
];

const INCOME_DATA = [
  { bracket: '<$20K', owners: 8.2, renters: 22.1 },
  { bracket: '$20-40K', owners: 12.5, renters: 24.3 },
  { bracket: '$40-60K', owners: 16.8, renters: 19.7 },
  { bracket: '$60-80K', owners: 18.3, renters: 14.2 },
  { bracket: '$80-100K', owners: 15.7, renters: 9.8 },
  { bracket: '$100K+', owners: 28.5, renters: 9.9 },
];

const EDUCATION_DATA = [
  { level: 'High School', rate: 52, color: C.chart[3] },
  { level: 'Vocational', rate: 61, color: C.chart[5] },
  { level: 'College', rate: 68, color: C.chart[2] },
  { level: 'Graduate', rate: 76, color: C.chart[1] },
];

// ═══════════════════════════════════════════
// SIMPLE BAR CHART (pure CSS, no recharts dep needed for SSR page)
// ═══════════════════════════════════════════
function BarChart({ data, valueKey, labelKey, maxVal, colorKey, unit = '', horizontal = false }: any) {
  const max = maxVal || Math.max(...data.map((d: any) => d[valueKey]));
  if (horizontal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.map((d: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: C.textSoft, width: 85, textAlign: 'right', flexShrink: 0 }}>{d[labelKey]}</span>
            <div style={{ flex: 1, height: 24, background: C.surface, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: `${(d[valueKey] / max) * 100}%`, height: '100%',
                background: d[colorKey] || C.chart[i % C.chart.length],
                borderRadius: 6, transition: 'width 0.8s ease',
              }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.fontMono, width: 50 }}>
              {d[valueKey]}{unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, padding: '0 4px' }}>
      {data.map((d: any, i: number) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFamily: C.fontMono }}>{d[valueKey]}{unit}</span>
          <div style={{
            width: '100%', maxWidth: 48,
            height: `${(d[valueKey] / max) * 160}px`,
            background: d[colorKey] || C.chart[i % C.chart.length],
            borderRadius: '6px 6px 0 0', transition: 'height 0.8s ease',
          }} />
          <span style={{ fontSize: 10, color: C.textMuted, textAlign: 'center' }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// INTERACTIVE CHART TABS
// ═══════════════════════════════════════════
function InteractiveDemo() {
  const [tab, setTab] = useState('ethnicity');
  const [metric, setMetric] = useState('rate');

  const tabs = [
    { id: 'ethnicity', label: 'Ethnicity' },
    { id: 'income', label: 'Income' },
    { id: 'education', label: 'Education' },
  ];

  return (
    <div style={{ background: C.card, borderRadius: C.radius, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '14px 16px', fontSize: 13,
            background: tab === t.id ? C.terraGlow : 'transparent',
            borderBottom: tab === t.id ? `2px solid ${C.terra}` : '2px solid transparent',
            color: tab === t.id ? C.terra : C.textMuted,
            fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer',
            border: 'none', borderBottomStyle: 'solid', fontFamily: C.font,
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding: '24px 28px' }}>
        {tab === 'ethnicity' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ id: 'rate', label: 'Ownership Rate %' }, { id: 'value', label: 'Avg Value ($K)' }].map(m => (
                <button key={m.id} onClick={() => setMetric(m.id)} style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: `1px solid ${metric === m.id ? C.terra : C.border}`,
                  background: metric === m.id ? C.terraGlow : 'transparent',
                  color: metric === m.id ? C.terra : C.textMuted,
                  fontSize: 12, cursor: 'pointer', fontFamily: C.font,
                }}>{m.label}</button>
              ))}
            </div>
            <BarChart
              data={ETHNICITY_DATA}
              valueKey={metric} labelKey="group" colorKey="color"
              maxVal={metric === 'rate' ? 100 : 500}
              unit={metric === 'rate' ? '%' : 'K'}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16 }}>
              {ETHNICITY_DATA.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textSoft }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: e.color }} />
                  {e.group}: <strong style={{ color: C.text }}>{e.count}</strong>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === 'income' && (
          <>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Household income distribution: owners vs renters</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {INCOME_DATA.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: C.textSoft, width: 65, textAlign: 'right', flexShrink: 0 }}>{d.bracket}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 3, height: 20 }}>
                    <div style={{ width: `${d.owners * 3}%`, background: C.sage, borderRadius: '4px 0 0 4px', minWidth: 2 }} />
                    <div style={{ width: `${d.renters * 3}%`, background: C.terra, borderRadius: '0 4px 4px 0', minWidth: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.textDim, width: 80 }}>{d.owners}% / {d.renters}%</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted }}><span style={{ width: 10, height: 10, background: C.sage, borderRadius: 2 }} /> Owners</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted }}><span style={{ width: 10, height: 10, background: C.terra, borderRadius: 2 }} /> Renters</span>
            </div>
          </>
        )}
        {tab === 'education' && (
          <BarChart data={EDUCATION_DATA} valueKey="rate" labelKey="level" colorKey="color" maxVal={100} unit="%" horizontal />
        )}
      </div>
      <div style={{ padding: '12px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: C.textDim }}>Sample from 130M+ records · Interactive</span>
        <Link href="/dashboard" style={{ fontSize: 12, color: C.terra, fontWeight: 500 }}>Open AI Query Lab →</Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// I-PaaS DATA FLOW DIAGRAM
// ═══════════════════════════════════════════
function IPaaSFlow() {
  const stages = [
    { label: 'Data Sources', sub: 'Cloud Storage\n130M+ Records', color: C.chart[3], items: ['Snowflake DB', 'Census Bureau', 'Property Records', 'Demographic Data'] },
    { label: 'Property Elements', sub: 'Core Data Fields', color: C.terra, items: ['Value & Financing', 'Location & Type', 'Beds/Bath/SqFt', 'Mortgage Data'] },
    { label: 'AI Dashboard', sub: 'Analysis Engine', color: C.sage, items: ['Valuation', 'Economics & Trends', 'Insurance & Risk', 'Match & Append'] },
    { label: 'Demographics', sub: 'Owner Profiles', color: C.gold, items: ['Ethnicity & Race', 'Income & Wealth', 'Education Level', 'Family & Network'] },
    { label: 'Distribution', sub: 'Output Channels', color: C.chart[4], items: ['Reports & Dashboards', 'LinkedIn / Social', 'News & Media', 'API Data Feeds'] },
  ];

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
      {stages.map((s, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            padding: '16px 14px', borderRadius: `${C.radiusSm}px ${C.radiusSm}px 0 0`,
            background: `${s.color}18`, borderTop: `3px solid ${s.color}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 2, whiteSpace: 'pre-line' }}>{s.sub}</div>
          </div>
          <div style={{
            flex: 1, padding: '12px 14px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderTop: 'none', borderRadius: `0 0 ${C.radiusSm}px ${C.radiusSm}px`,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {s.items.map((item, j) => (
              <div key={j} style={{ fontSize: 11, color: C.textSoft, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
          {i < stages.length - 1 && (
            <div style={{ position: 'absolute', right: -8, top: '50%', color: C.textDim, fontSize: 16 }}>→</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// CLIENT TIER CARDS
// ═══════════════════════════════════════════
const CLIENT_TIERS = [
  {
    tier: 'Tier I', title: 'Financial Services', color: C.terra,
    clients: ['Banks & Mortgage Lenders', 'Credit Unions', 'National Real Estate Firms', 'Mortgage Loan Servicers', 'Insurance Companies & Risk Advisors', 'Pension Funds', 'Equity Investors'],
    desc: 'Portfolio analysis by owner demographics. Socially responsible lending strategies. Fair lending compliance monitoring.',
    engagement: '$12K–$30K annual contracts',
  },
  {
    tier: 'Tier II', title: 'Government & Academic', color: C.sage,
    clients: ['Federal Government (VA, HUD)', 'State Housing Agencies', 'Universities & Researchers', 'News Media & Reporters', 'Political Interest Groups', 'Regulatory Agencies', 'National Housing Non-profits'],
    desc: 'Market monitoring reports for policy and compliance. Research datasets for academic study. High-impact media analytics.',
    engagement: '$2.5K–$10K per report/contract',
  },
  {
    tier: 'Tier III', title: 'Investment Advisory', color: C.gold,
    clients: ['Home Builders & Developers', 'Home Investors', 'Real Estate Investment Groups', 'Development Advisors', 'Strategic Marketers'],
    desc: 'Market composition analysis for targeted investment. Homeowner profile data feeds for niche marketing. Area demographic breakdowns.',
    engagement: '$10K+ data purchases',
  },
];

// ═══════════════════════════════════════════
// MAIN HOMEPAGE COMPONENT
// ═══════════════════════════════════════════
export default function Homepage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.font }}>
      {/* ═══ NAV ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(12,15,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <img src="https://img1.wsimg.com/isteam/ip/e8c68af0-b86d-4dc7-b39a-77c07572bad7/ICONYCS_S5.jpg" alt="ICONYCS" width={42} height={42} style={{ borderRadius: 10, objectFit: 'contain', background: '#fff' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>ICONYCS</div>
              <div style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Housing Analytics</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { label: 'About', href: '/about' },
              { label: 'Analytics', href: '/analytics' },
              { label: 'MarketPlace', href: '/marketplace' },
              { label: 'Partners', href: '/partners' },
              { label: 'Blog', href: '/blog' },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, textDecoration: 'none' }}>{item.label}</Link>
            ))}
            <Link href="/dashboard" style={{
              padding: '9px 22px', borderRadius: C.radiusSm, fontSize: 13, fontWeight: 600,
              background: C.terra, color: C.cream, textDecoration: 'none',
            }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 32px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(196,101,58,0.07) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 70%, rgba(122,154,109,0.05) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.terra, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
                The Socio-Economics of Home Ownership
              </p>
              <h1 style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.12, fontFamily: C.fontSerif, marginBottom: 24 }}>
                Every home tells a story.{' '}
                <span style={{ color: C.terra, fontStyle: 'italic' }}>We help you read it.</span>
              </h1>
              <p style={{ fontSize: 17, color: C.textSoft, lineHeight: 1.8, marginBottom: 20, maxWidth: 500 }}>
                130 million property records. 187 million owner profiles. AI-powered analytics
                by ethnicity, income, education, marital status, and more — from ZIP code to national.
              </p>
              <p style={{
                fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480,
                fontStyle: 'italic', borderLeft: `3px solid ${C.terra}40`, paddingLeft: 16,
              }}>
                &ldquo;When Housing Markets Shift, Iconycs Knows.&rdquo;
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <Link href="/dashboard" style={{
                  padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                  background: C.terra, color: C.cream, textDecoration: 'none',
                }}>Try the AI Query Lab</Link>
                <Link href="/contact" style={{
                  padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500,
                  border: `1px solid ${C.border}`, color: C.textSoft, textDecoration: 'none',
                }}>Schedule a Call</Link>
              </div>
            </div>
            <InteractiveDemo />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 80, padding: '36px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
            {[
              { value: '130M+', label: 'Property Records', color: C.terra },
              { value: '187M+', label: 'Owner Profiles', color: C.sage },
              { value: '3,143', label: 'Markets Tracked', color: C.gold },
              { value: '30+', label: 'Years Experience', color: C.chart[3] },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: s.color, fontFamily: C.fontMono, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section style={{ padding: '100px 32px', background: C.bgWarm, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.terra, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Our Mission</p>
          <h2 style={{ fontSize: 40, fontWeight: 700, fontFamily: C.fontSerif, marginBottom: 24, lineHeight: 1.2 }}>Whose home is it?</h2>
          <p style={{ fontSize: 18, color: C.textSoft, lineHeight: 1.9, maxWidth: 700, margin: '0 auto' }}>
            With real estate buyers seeking a foothold in communities for new lives, financial stability,
            and social mobility — it has become imperative that home ownership trends be explained in a
            granular manner. ICONYCS unlocks the value of adding market analytics expertise to build a
            robust research system for every stakeholder in the housing ecosystem.
          </p>
        </div>
      </section>

      {/* ═══ I-PaaS DATA FLOW ═══ */}
      <section style={{ padding: '100px 32px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.sage, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>I-PaaS Platform</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: C.fontSerif, marginBottom: 16 }}>
            Real estate anchored socio-economic trend analytics
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 40, maxWidth: 640 }}>
            From raw data sources through AI-powered analysis to distribution channels — our platform connects every link in the housing intelligence chain.
          </p>
          <IPaaSFlow />
        </div>
      </section>

      {/* ═══ CLIENT TIERS ═══ */}
      <section style={{ padding: '100px 32px', background: C.bgWarm, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.terra, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Who We Serve</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: C.fontSerif, marginBottom: 48 }}>
            Built for decision makers across the housing ecosystem
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {CLIENT_TIERS.map((tier, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: C.radius, background: C.card,
                border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${tier.color}08` }} />
                <div style={{
                  display: 'inline-flex', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: `${tier.color}18`, color: tier.color, marginBottom: 14,
                }}>{tier.tier}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{tier.title}</h3>
                <p style={{ fontSize: 14, color: C.textSoft, lineHeight: 1.7, marginBottom: 16 }}>{tier.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  {tier.clients.map((client, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.textMuted }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
                      {client}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 14px', borderRadius: C.radiusSm, background: C.surface, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>Typical: </span>
                  <span style={{ fontSize: 12, color: C.textSoft }}>{tier.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI PLATFORM ═══ */}
      <section style={{ padding: '100px 32px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>AI-Powered Platform</p>
              <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: C.fontSerif, marginBottom: 20, lineHeight: 1.2 }}>
                Like having an analyst at your fingertips <span style={{ color: C.terra }}>24/7</span>
              </h2>
              <p style={{ fontSize: 16, color: C.textSoft, lineHeight: 1.8, marginBottom: 28 }}>
                Ask questions in plain English. Claude Opus 4.6 generates SQL, queries 130M+ records
                on Snowflake, and returns business-ready visualizations — in seconds.
              </p>
              {[
                { label: 'Natural Language Queries', desc: 'Ask anything about housing demographics and get instant, data-backed answers' },
                { label: 'AI-Generated SQL', desc: 'Claude Opus 4.6 maps questions to valid Snowflake queries with full schema awareness' },
                { label: 'Interactive Visualizations', desc: 'Auto-generated charts you can slice by demographics, geography, and time' },
                { label: 'Report & Publish', desc: 'Export to PDF/PPTX or publish insights directly to LinkedIn' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.terra, marginTop: 7, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Terminal mock */}
            <div style={{ background: C.card, borderRadius: C.radius, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.terra }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.gold }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.sage }} />
                <span style={{ fontSize: 12, color: C.textDim, marginLeft: 12 }}>AI Query Lab — Claude Opus 4.6</span>
              </div>
              <div style={{ padding: 24, fontFamily: C.fontMono, fontSize: 12, lineHeight: 2.2, color: C.textSoft }}>
                <div><span style={{ color: C.textDim }}>User &gt;</span> <span style={{ color: C.cream }}>Show homeownership by ethnicity in DC</span></div>
                <div style={{ marginTop: 12, color: C.sage }}>
                  <span style={{ color: C.textDim }}>SQL &gt;</span> SELECT &quot;Ethnicity&quot;, COUNT(*) as owners,
                </div>
                <div style={{ color: C.sage, paddingLeft: 52 }}>ROUND(AVG(PROP_VALCALC),0) as avg_value</div>
                <div style={{ color: C.sage, paddingLeft: 52 }}>FROM VW_NARC3_SAMPLE n</div>
                <div style={{ color: C.sage, paddingLeft: 52 }}>JOIN VW_PROP_SAMPLE p ON n.PID = p.PID</div>
                <div style={{ color: C.sage, paddingLeft: 52 }}>WHERE STATE = &apos;DC&apos;</div>
                <div style={{ color: C.sage, paddingLeft: 52 }}>GROUP BY &quot;Ethnicity&quot;</div>
                <div style={{ marginTop: 12 }}>
                  <span style={{ color: C.textDim }}>Result &gt;</span> <span style={{ color: C.terra }}>5 rows · 0.8s · Chart generated ✓</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: C.textDim }}>Insight &gt;</span> <span style={{ color: C.gold }}>African American homeowners represent 38.2% of DC owners with avg property value $485K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD FEATURES ═══ */}
      <section style={{ padding: '80px 32px', background: C.bgWarm, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.sage, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>Dashboard Capabilities</p>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: C.fontSerif, marginBottom: 40, textAlign: 'center' }}>Everything you need in one platform</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Valuation', desc: 'AVM and property value analytics', color: C.terra },
              { label: 'Economics & Trends', desc: 'Market movement and forecasting', color: C.sage },
              { label: 'Insurance & Risk', desc: 'Hazard, flood, and disaster data', color: C.gold },
              { label: 'Mortgage Analytics', desc: 'Loan structure and servicing trends', color: C.chart[3] },
              { label: 'Match & Append', desc: 'Enrich records with demographics', color: C.chart[4] },
              { label: 'Social & Network', desc: 'Community and affiliation profiles', color: C.chart[5] },
              { label: 'News & Media', desc: 'Real-time housing news monitoring', color: C.terra },
              { label: 'AI Query Lab', desc: 'Natural language data exploration', color: C.sage },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '20px 18px', borderRadius: C.radiusSm,
                background: C.card, border: `1px solid ${C.border}`,
                borderTop: `3px solid ${f.color}`,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section style={{ padding: '60px 32px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 28 }}>Trusted Technology Partners</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 36 }}>
            {['Attom Data', 'CoreLogic', 'Veros', 'Black Knight', 'AVMetrics', 'Infutor', 'NTERSOL', 'VonExpy'].map(p => (
              <span key={p} style={{ fontSize: 14, color: C.textMuted, fontWeight: 500 }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '100px 32px', textAlign: 'center', background: `radial-gradient(ellipse at 50% 50%, ${C.terraGlow}, transparent 60%)`, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: C.fontSerif, marginBottom: 16 }}>Ready to explore your data?</h2>
          <p style={{ fontSize: 17, color: C.textSoft, lineHeight: 1.7, marginBottom: 36 }}>
            Try the AI Query Lab free, or schedule a call to discuss your housing analytics needs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <Link href="/dashboard" style={{ padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: C.terra, color: C.cream, textDecoration: 'none' }}>Launch Dashboard</Link>
            <Link href="/contact" style={{ padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, border: `1px solid ${C.border}`, color: C.textSoft, textDecoration: 'none' }}>Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '48px 32px', borderTop: `1px solid ${C.border}`, background: C.card }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="https://img1.wsimg.com/isteam/ip/e8c68af0-b86d-4dc7-b39a-77c07572bad7/ICONYCS_S5.jpg" alt="ICONYCS" width={32} height={32} style={{ borderRadius: 6, objectFit: 'contain', background: '#fff' }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>ICONYCS</span>
            </div>
            <p style={{ fontSize: 13, color: C.textDim, maxWidth: 280, lineHeight: 1.6 }}>
              Housing Analytics and Owner Demographic Analytics.
              300 Spectrum Center Drive, Ste 400, Irvine, CA 92618
            </p>
            <p style={{ fontSize: 13, color: C.textDim, marginTop: 8 }}>(760) 599-1261 · info@iconycs.com</p>
          </div>
          <div style={{ display: 'flex', gap: 48 }}>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Platform</h4>
              {['Analytics', 'MarketPlace', 'Dashboard', 'Blog'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} style={{ display: 'block', fontSize: 13, color: C.textMuted, marginBottom: 8, textDecoration: 'none' }}>{item}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Company</h4>
              {['About', 'Partners', 'Investors', 'Contact'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} style={{ display: 'block', fontSize: 13, color: C.textMuted, marginBottom: 8, textDecoration: 'none' }}>{item}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '28px auto 0', paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textDim }}>
          <span>© {new Date().getFullYear()} ICONYCS. All Rights Reserved.</span>
          <span>Powered by Next.js · Claude Opus 4.6 · Snowflake</span>
        </div>
      </footer>
    </div>
  );
}
