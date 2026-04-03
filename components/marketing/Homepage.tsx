'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/*
 ═══════════════════════════════════════════════════════════════
 ICONYCS HOMEPAGE v3 — "Editorial Warmth"
 
 Design direction: Light, warm, editorial
 Inspired by: EquityDesk/PLUSAdvantage card design
 Palette: Warm cream + terracotta + sage + deep navy text
 Typography: Source Serif 4 (display) + Outfit (body)
 Feel: Trusted financial partner, not tech startup
 ═══════════════════════════════════════════════════════════════
*/

const C = {
  // Backgrounds
  bg: '#FAFAF7',
  bgWarm: '#F5F0E8',
  bgCard: '#FFFFFF',
  bgCardHover: '#FEFDFB',
  bgCode: '#FBF5EE',
  bgAccent: '#FFF8F4',
  // Borders
  border: '#E8E2D8',
  borderLight: '#F0EBE3',
  borderAccent: '#D4A574',
  // Text
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  textLight: '#D6D3D1',
  // Accents
  terra: '#C4653A',
  terraLight: '#E8956A',
  terraSoft: '#FFF0E9',
  terraDark: '#9A4420',
  sage: '#5D7E52',
  sageSoft: '#EDF4EB',
  sageLight: '#7A9A6D',
  gold: '#B8860B',
  goldSoft: '#FDF6E3',
  navy: '#1B2A4A',
  navyLight: '#2D4166',
  navySoft: '#EEF1F6',
  // Chart
  chart: ['#C4653A', '#5D7E52', '#B8860B', '#4A7FB5', '#A85D8A', '#3D908E'],
  // Fonts
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
  fontMono: "'IBM Plex Mono', monospace",
  // Radii
  r: 16, rs: 10, rl: 20,
};

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const ETHNICITY = [
  { group: 'White', rate: 73.1, value: 310, count: '76.2M', color: C.chart[3] },
  { group: 'Hispanic', rate: 51.1, value: 280, count: '10.8M', color: C.chart[0] },
  { group: 'Black', rate: 44.2, value: 235, count: '9.4M', color: C.chart[1] },
  { group: 'Asian', rate: 62.8, value: 475, count: '4.1M', color: C.chart[2] },
  { group: 'Other', rate: 56.5, value: 295, count: '2.8M', color: C.chart[4] },
];

const INCOME = [
  { bracket: '<$20K', owners: 8.2, renters: 22.1 },
  { bracket: '$20-40K', owners: 12.5, renters: 24.3 },
  { bracket: '$40-60K', owners: 16.8, renters: 19.7 },
  { bracket: '$60-80K', owners: 18.3, renters: 14.2 },
  { bracket: '$80-100K', owners: 15.7, renters: 9.8 },
  { bracket: '$100K+', owners: 28.5, renters: 9.9 },
];

const EDUCATION = [
  { level: 'High School', rate: 52, color: C.chart[3] },
  { level: 'Vocational', rate: 61, color: C.chart[5] },
  { level: 'College', rate: 68, color: C.chart[2] },
  { level: 'Graduate', rate: 76, color: C.chart[1] },
];

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════

const Pill = ({ children, active, onClick, color = C.terra }: any) => (
  <button onClick={onClick} style={{
    padding: '7px 18px', borderRadius: 24, fontSize: 13, fontWeight: 500,
    border: `1.5px solid ${active ? color : C.border}`,
    background: active ? `${color}10` : 'transparent',
    color: active ? color : C.textMuted,
    cursor: 'pointer', fontFamily: C.font, transition: 'all 0.2s',
  }}>{children}</button>
);

const Stat = ({ value, label, color = C.terra, sub }: any) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 44, fontWeight: 300, color, fontFamily: C.fontSerif, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, color: C.textMuted, marginTop: 10, fontWeight: 500, letterSpacing: '0.02em' }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>{sub}</div>}
  </div>
);

const Card = ({ children, style: s = {}, hover = false }: any) => (
  <div style={{
    background: C.bgCard, borderRadius: C.r, padding: 32,
    border: `1px solid ${C.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    transition: 'all 0.3s',
    ...s,
  }}>{children}</div>
);

const SectionTag = ({ children, color = C.terra }: any) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 14px', borderRadius: 24, marginBottom: 20,
    background: `${color}08`, border: `1px solid ${color}20`,
  }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
    <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{children}</span>
  </div>
);

// ═══════════════════════════════════════════
// INTERACTIVE CHARTS — Pure CSS bars
// ═══════════════════════════════════════════
function ChartDemo() {
  const [tab, setTab] = useState('ethnicity');
  const [metric, setMetric] = useState('rate');

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {[
          { id: 'ethnicity', label: 'By Ethnicity' },
          { id: 'income', label: 'By Income' },
          { id: 'education', label: 'By Education' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '16px 20px', fontSize: 13, fontWeight: 500,
            border: 'none', borderBottom: `2px solid ${tab === t.id ? C.terra : 'transparent'}`,
            background: tab === t.id ? C.terraSoft : 'transparent',
            color: tab === t.id ? C.terra : C.textMuted,
            cursor: 'pointer', fontFamily: C.font, transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '28px 32px' }}>
        {tab === 'ethnicity' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <Pill active={metric === 'rate'} onClick={() => setMetric('rate')}>Ownership Rate %</Pill>
              <Pill active={metric === 'value'} onClick={() => setMetric('value')}>Avg Value ($K)</Pill>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, paddingBottom: 4 }}>
              {ETHNICITY.map((d, i) => {
                const val = metric === 'rate' ? d.rate : d.value;
                const max = metric === 'rate' ? 100 : 500;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.fontMono }}>{val}{metric === 'rate' ? '%' : 'K'}</span>
                    <div style={{
                      width: '100%', maxWidth: 56, height: `${(val / max) * 160}px`,
                      background: `linear-gradient(180deg, ${d.color}, ${d.color}CC)`,
                      borderRadius: '8px 8px 4px 4px', transition: 'height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} />
                    <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{d.group}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
              {ETHNICITY.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: e.color }} />
                  <span style={{ color: C.textMuted }}>{e.group}:</span>
                  <span style={{ fontWeight: 600, color: C.text }}>{e.count}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'income' && (
          <>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Household income distribution — owners vs renters</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {INCOME.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: C.textMuted, width: 60, textAlign: 'right', flexShrink: 0, fontFamily: C.fontMono }}>{d.bracket}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 2, height: 22, background: C.bgWarm, borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${d.owners * 2.8}%`, background: C.sage, borderRadius: '6px 0 0 6px', transition: 'width 0.6s ease' }} />
                    <div style={{ width: `${d.renters * 2.8}%`, background: C.terra, borderRadius: '0 6px 6px 0', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.textDim, width: 80, fontFamily: C.fontMono }}>{d.owners}% / {d.renters}%</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.borderLight}` }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMuted }}><span style={{ width: 12, height: 12, background: C.sage, borderRadius: 3 }} /> Owners</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMuted }}><span style={{ width: 12, height: 12, background: C.terra, borderRadius: 3 }} /> Renters</span>
            </div>
          </>
        )}

        {tab === 'education' && (
          <>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Homeownership rate by education level</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {EDUCATION.map((d, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.textBody }}>{d.level}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: d.color, fontFamily: C.fontMono }}>{d.rate}%</span>
                  </div>
                  <div style={{ height: 10, background: C.bgWarm, borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      width: `${d.rate}%`, height: '100%', borderRadius: 5,
                      background: `linear-gradient(90deg, ${d.color}, ${d.color}BB)`,
                      transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '14px 32px', borderTop: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.bgAccent }}>
        <span style={{ fontSize: 11, color: C.textDim }}>Interactive sample from 130M+ property records</span>
        <Link href="/dashboard" style={{ fontSize: 12, color: C.terra, fontWeight: 600, textDecoration: 'none' }}>Open AI Query Lab →</Link>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════
// I-PaaS PIPELINE
// ═══════════════════════════════════════════
const PIPELINE = [
  { label: 'Data Sources', icon: '◉', color: C.chart[3], items: ['Snowflake DB', 'Census Bureau', 'Property Records', 'Infutor Demographics'] },
  { label: 'Property Elements', icon: '⌂', color: C.terra, items: ['Value & Financing', 'Location & Type', 'Beds / Bath / SqFt', 'Mortgage Data'] },
  { label: 'AI Dashboard', icon: '◈', color: C.sage, items: ['Valuation', 'Trends & Economics', 'Insurance & Risk', 'Match & Append'] },
  { label: 'Owner Profiles', icon: '◎', color: C.gold, items: ['Ethnicity & Race', 'Income & Wealth', 'Education Level', 'Family & Network'] },
  { label: 'Distribution', icon: '◆', color: C.chart[4], items: ['Reports & Dashboards', 'LinkedIn Publishing', 'News & Media', 'API Data Feeds'] },
];

// ═══════════════════════════════════════════
// CLIENT TIERS
// ═══════════════════════════════════════════
const TIERS = [
  {
    tier: 'Tier I', title: 'Financial Services', color: C.terra, status: 'Primary',
    clients: ['Banks & Mortgage Lenders', 'Credit Unions', 'National Real Estate Firms', 'Loan Servicers', 'Insurance & Risk Advisors', 'Pension Funds', 'Equity Investors'],
    desc: 'Portfolio analysis by owner demographics. Fair lending compliance. Socially responsible marketing strategies.',
    price: '$12K – $30K /year',
  },
  {
    tier: 'Tier II', title: 'Government & Academic', color: C.sage, status: 'Growing',
    clients: ['Federal Government (VA, HUD)', 'State Housing Agencies', 'Universities & Researchers', 'News Media & Reporters', 'Regulatory Agencies', 'Housing Non-profits'],
    desc: 'Market monitoring for policy and compliance. Research datasets. High-impact media analytics.',
    price: '$2.5K – $10K per engagement',
  },
  {
    tier: 'Tier III', title: 'Investment Advisory', color: C.gold, status: 'Expanding',
    clients: ['Home Builders & Developers', 'Home Investors', 'RE Investment Groups', 'Development Advisors', 'Strategic Marketers'],
    desc: 'Market composition for targeted investment. Homeowner profile data feeds. Area demographic intelligence.',
    price: '$10K+ data purchases',
  },
];

// ═══════════════════════════════════════════
// DASHBOARD FEATURES
// ═══════════════════════════════════════════
const FEATURES = [
  { label: 'Valuation', desc: 'AVM and property value analytics', color: C.terra, status: 'Live' },
  { label: 'Economics & Trends', desc: 'Market movement and forecasting', color: C.sage, status: 'Live' },
  { label: 'Insurance & Risk', desc: 'Hazard, flood, and disaster data', color: C.gold, status: 'Live' },
  { label: 'Mortgage Analytics', desc: 'Loan structure and servicing trends', color: C.chart[3], status: 'Live' },
  { label: 'Match & Append', desc: 'Enrich records with demographics', color: C.chart[4], status: 'Live' },
  { label: 'Social & Network', desc: 'Community and affiliation data', color: C.chart[5], status: 'Beta' },
  { label: 'News & Media', desc: 'Real-time housing news monitoring', color: C.terra, status: 'Live' },
  { label: 'AI Query Lab', desc: 'Natural language → Snowflake SQL', color: C.sage, status: 'Live' },
];

// ═══════════════════════════════════════════
// MAIN HOMEPAGE
// ═══════════════════════════════════════════
export default function Homepage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.font, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        ::selection { background: ${C.terraSoft}; color: ${C.terraDark}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fu { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .fu1 { animation-delay: 0.1s; }
        .fu2 { animation-delay: 0.2s; }
        .fu3 { animation-delay: 0.3s; }
        .fu4 { animation-delay: 0.4s; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(250,250,247,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>ICONYCS</div>
              <div style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: -1 }}>Housing Analytics</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 14, color: C.textMuted, fontWeight: 500 }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{
              padding: '10px 24px', borderRadius: C.rs, fontSize: 14, fontWeight: 600,
              background: C.terra, color: '#fff',
              boxShadow: '0 1px 2px rgba(196,101,58,0.3), 0 4px 12px rgba(196,101,58,0.15)',
            }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ paddingTop: 140, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: `radial-gradient(ellipse at 80% 30%, ${C.terraSoft}, transparent 70%)`, opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40%', height: '60%', background: `radial-gradient(ellipse at 20% 80%, ${C.sageSoft}, transparent 70%)`, opacity: 0.4 }} />

        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <SectionTag>The Socio-Economics of Home Ownership</SectionTag>

              <h1 className="fu" style={{
                fontSize: 52, fontWeight: 600, lineHeight: 1.1,
                fontFamily: C.fontSerif, color: C.text, marginBottom: 24,
              }}>
                Every home tells a story.{' '}
                <em style={{ color: C.terra, fontWeight: 600 }}>We help you read it.</em>
              </h1>

              <p className="fu fu1" style={{ fontSize: 17, color: C.textBody, lineHeight: 1.85, marginBottom: 20, maxWidth: 480, fontWeight: 400 }}>
                130 million property records. 187 million owner profiles. AI-powered analytics by ethnicity, income, education, marital status, and more — from ZIP code to national.
              </p>

              <blockquote className="fu fu2" style={{
                fontSize: 15, color: C.textMuted, fontStyle: 'italic', fontFamily: C.fontSerif,
                borderLeft: `3px solid ${C.terra}40`, paddingLeft: 20, marginBottom: 36,
              }}>
                &ldquo;When Housing Markets Shift, Iconycs Knows.&rdquo;
              </blockquote>

              <div className="fu fu3" style={{ display: 'flex', gap: 14 }}>
                <Link href="/dashboard" style={{
                  padding: '14px 28px', borderRadius: C.rs, fontSize: 15, fontWeight: 600,
                  background: C.terra, color: '#fff',
                  boxShadow: '0 1px 2px rgba(196,101,58,0.3), 0 6px 20px rgba(196,101,58,0.18)',
                  transition: 'all 0.2s',
                }}>Try the AI Query Lab</Link>
                <Link href="/contact" style={{
                  padding: '14px 28px', borderRadius: C.rs, fontSize: 15, fontWeight: 500,
                  border: `1.5px solid ${C.border}`, color: C.textBody,
                  background: C.bgCard,
                }}>Schedule a Call</Link>
              </div>
            </div>

            <div className="fu fu2">
              <ChartDemo />
            </div>
          </div>

          {/* Stats */}
          <div className="fu fu4" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
            marginTop: 80, padding: '48px 40px',
            background: C.bgCard, borderRadius: C.rl, border: `1px solid ${C.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <Stat value="130M+" label="Property Records" color={C.terra} />
            <Stat value="187M+" label="Owner Profiles" color={C.sage} />
            <Stat value="3,143" label="Markets Tracked" color={C.gold} />
            <Stat value="30+" label="Years Experience" color={C.navyLight} />
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section style={{ padding: '100px 40px', background: C.bgWarm }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <SectionTag color={C.sage}>Our Mission</SectionTag>
          <h2 style={{ fontSize: 38, fontWeight: 600, fontFamily: C.fontSerif, lineHeight: 1.2, marginBottom: 24, color: C.text }}>
            Whose home is it?
          </h2>
          <p style={{ fontSize: 17, color: C.textBody, lineHeight: 2, fontWeight: 400 }}>
            With real estate buyers seeking a foothold in communities for new lives, financial stability,
            and social mobility — it has become imperative that home ownership trends be explained in a
            granular manner. ICONYCS unlocks the value of adding market analytics expertise to build a
            robust research system for every stakeholder in the housing ecosystem.
          </p>
        </div>
      </section>

      {/* ═══ I-PaaS PIPELINE ═══ */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <SectionTag color={C.sage}>I-PaaS Platform</SectionTag>
          <h2 style={{ fontSize: 34, fontWeight: 600, fontFamily: C.fontSerif, marginBottom: 12 }}>
            Real estate anchored socio-economic analytics
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 48, maxWidth: 560 }}>
            From raw data sources through AI-powered analysis to distribution channels.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {PIPELINE.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '18px 16px', borderRadius: `${C.rs}px ${C.rs}px 0 0`,
                  background: `${s.color}08`, borderTop: `3px solid ${s.color}`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</div>
                </div>
                <div style={{
                  flex: 1, padding: '14px 16px', background: C.bgCard,
                  border: `1px solid ${C.border}`, borderTop: 'none',
                  borderRadius: `0 0 ${C.rs}px ${C.rs}px`,
                  display: 'flex', flexDirection: 'column', gap: 7,
                }}>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 12, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CLIENT TIERS ═══ */}
      <section style={{ padding: '100px 40px', background: C.bgWarm }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <SectionTag color={C.terra}>Who We Serve</SectionTag>
          <h2 style={{ fontSize: 34, fontWeight: 600, fontFamily: C.fontSerif, marginBottom: 48 }}>
            Built for decision makers across the housing ecosystem
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TIERS.map((t, i) => (
              <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px 20px', borderBottom: `1px solid ${C.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: `${t.color}10`, color: t.color, border: `1px solid ${t.color}25`,
                    }}>{t.tier}</span>
                    <span style={{ fontSize: 11, color: C.textDim, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color }} />
                      {t.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t.title}</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{t.desc}</p>
                </div>
                <div style={{ padding: '16px 28px' }}>
                  {t.clients.map((c, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13, color: C.textBody }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      {c}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px 28px', background: `${t.color}06`, borderTop: `1px solid ${C.borderLight}` }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>Typical: </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.color }}>{t.price}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI PLATFORM ═══ */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56, alignItems: 'center' }}>
            <div>
              <SectionTag color={C.gold}>AI-Powered Platform</SectionTag>
              <h2 style={{ fontSize: 34, fontWeight: 600, fontFamily: C.fontSerif, lineHeight: 1.2, marginBottom: 20 }}>
                Like having an analyst at your fingertips <em style={{ color: C.terra }}>24/7</em>
              </h2>
              <p style={{ fontSize: 16, color: C.textBody, lineHeight: 1.85, marginBottom: 32 }}>
                Ask questions in plain English. Claude Opus 4.6 generates SQL, queries 130M+ records on Snowflake, and returns business-ready visualizations — in seconds.
              </p>
              {[
                { label: 'Natural Language Queries', desc: 'Ask anything about housing demographics — get instant, data-backed answers' },
                { label: 'AI-Generated SQL', desc: 'Claude Opus 4.6 maps questions to valid Snowflake queries with schema awareness' },
                { label: 'Interactive Visualizations', desc: 'Auto-generated charts — slice by demographics, geography, and time' },
                { label: 'Report & Publish', desc: 'Export to PDF or publish insights to LinkedIn' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.terra, marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Code terminal */}
            <Card style={{ padding: 0, overflow: 'hidden', background: '#1C1917', border: 'none', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #2A2620', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.terra }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.gold }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.sage }} />
                <span style={{ fontSize: 12, color: '#78716C', marginLeft: 12, fontFamily: C.fontMono }}>AI Query Lab — Claude Opus 4.6</span>
              </div>
              <div style={{ padding: '24px 24px 28px', fontFamily: C.fontMono, fontSize: 13, lineHeight: 2.2, color: '#D6D3D1' }}>
                <div><span style={{ color: '#78716C' }}>User &gt;</span> <span style={{ color: '#FAFAF7' }}>Show homeownership by ethnicity in DC</span></div>
                <div style={{ marginTop: 14, color: '#7A9A6D' }}>
                  <span style={{ color: '#78716C' }}>SQL &gt;</span> SELECT &quot;Ethnicity&quot;, COUNT(*) as owners,
                </div>
                <div style={{ color: '#7A9A6D', paddingLeft: 52 }}>ROUND(AVG(PROP_VALCALC),0) as avg_value</div>
                <div style={{ color: '#7A9A6D', paddingLeft: 52 }}>FROM VW_NARC3_SAMPLE n</div>
                <div style={{ color: '#7A9A6D', paddingLeft: 52 }}>JOIN VW_PROP_SAMPLE p ON n.PID = p.PID</div>
                <div style={{ color: '#7A9A6D', paddingLeft: 52 }}>WHERE STATE = &apos;DC&apos;</div>
                <div style={{ color: '#7A9A6D', paddingLeft: 52 }}>GROUP BY &quot;Ethnicity&quot;</div>
                <div style={{ marginTop: 14 }}>
                  <span style={{ color: '#78716C' }}>Result &gt;</span> <span style={{ color: '#C4653A' }}>5 rows · 0.8s · Chart generated ✓</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: '#78716C' }}>Insight &gt;</span> <span style={{ color: '#B8860B' }}>African American homeowners = 38.2% of DC owners, avg value $485K</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{ padding: '80px 40px', background: C.bgWarm }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionTag color={C.sage}>Dashboard Capabilities</SectionTag>
            <h2 style={{ fontSize: 30, fontWeight: 600, fontFamily: C.fontSerif }}>Everything you need in one platform</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <Card key={i} style={{ padding: '22px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: f.color }} />
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 12,
                    background: f.status === 'Live' ? C.sageSoft : C.goldSoft,
                    color: f.status === 'Live' ? C.sage : C.gold,
                  }}>{f.status}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section style={{ padding: '56px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>Trusted Technology Partners</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 40 }}>
            {['Attom Data', 'CoreLogic', 'Veros', 'Black Knight', 'AVMetrics', 'Infutor', 'NTERSOL', 'VonExpy'].map(p => (
              <span key={p} style={{ fontSize: 14, color: C.textMuted, fontWeight: 500, letterSpacing: '0.01em' }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '100px 40px', background: C.terraSoft }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 34, fontWeight: 600, fontFamily: C.fontSerif, marginBottom: 16, color: C.text }}>Ready to explore your data?</h2>
          <p style={{ fontSize: 16, color: C.textBody, lineHeight: 1.8, marginBottom: 36 }}>
            Try the AI Query Lab free, or schedule a call to discuss your housing analytics needs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <Link href="/dashboard" style={{
              padding: '14px 32px', borderRadius: C.rs, fontSize: 15, fontWeight: 600,
              background: C.terra, color: '#fff',
              boxShadow: '0 2px 8px rgba(196,101,58,0.25)',
            }}>Launch Dashboard</Link>
            <Link href="/contact" style={{
              padding: '14px 32px', borderRadius: C.rs, fontSize: 15, fontWeight: 500,
              border: `1.5px solid ${C.border}`, color: C.textBody, background: C.bgCard,
            }}>Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '56px 40px 40px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>ICONYCS</span>
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, maxWidth: 260, lineHeight: 1.7 }}>
              Housing Analytics & Owner Demographics.
              300 Spectrum Center Drive, Ste 400, Irvine, CA 92618
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>(760) 599-1261 · info@iconycs.com</p>
          </div>
          <div style={{ display: 'flex', gap: 56 }}>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Platform</h4>
              {['Analytics', 'MarketPlace', 'Dashboard', 'Blog'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} style={{ display: 'block', fontSize: 14, color: C.textMuted, marginBottom: 10, fontWeight: 450 }}>{item}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Company</h4>
              {['About', 'Partners', 'Investors', 'Contact'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} style={{ display: 'block', fontSize: 14, color: C.textMuted, marginBottom: 10, fontWeight: 450 }}>{item}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.textDim }}>
          <span>© {new Date().getFullYear()} ICONYCS. All Rights Reserved.</span>
          <span>Powered by Next.js · Claude Opus 4.6 · Snowflake</span>
        </div>
      </footer>
    </div>
  );
}
