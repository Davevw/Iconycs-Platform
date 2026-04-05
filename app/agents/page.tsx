'use client';

/**
 * ICONYCS Agent Marketplace
 * Pre-built AI agents deployed against 130M property records.
 */

import Link from 'next/link';

// --- Design Tokens -----------------------------------------------------------
const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF', bgWarm: '#F5F0E8',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', sage: '#5D7E52', gold: '#B8860B', navy: '#1B2A4A',
  navyLight: '#243659', navyDark: '#0F1D33',
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

// --- Agent Data ---------------------------------------------------------------
const AGENTS = [
  {
    icon: '[scales]',
    name: 'Fair Lending Compliance Agent',
    price: '$5,000',
    period: '/month',
    description:
      'Continuously monitors your lending portfolio against ICONYCS demographic data. Auto-generates monthly CFPB/OCC-ready fair lending reports. Flags geographic disparities. Drafts regulatory responses.',
    useCases: [
      'Monthly fair lending monitoring',
      'CRA assessment area analysis',
      'HMDA cross-reference reporting',
      'Regulatory examination preparation',
    ],
    status: 'AVAILABLE',
    statusLabel: 'AVAILABLE  -  Deploy in 48 hours',
    statusColor: C.sage,
    statusBg: '#F0F7EE',
    ctaLabel: 'Request Deployment',
    ctaHref: 'mailto:info@iconycs.com?subject=Fair Lending Agent Inquiry',
    ctaStyle: 'primary',
  },
  {
    icon: '[chart]',
    name: 'Market Intelligence Agent',
    price: '$3,000',
    period: '/month',
    description:
      'Watches your target markets 24/7. Alerts when demographic shifts exceed thresholds. Auto-generates weekly market briefings. Tracks competitor lending patterns.',
    useCases: [
      'Market entry analysis',
      'Portfolio monitoring',
      'Competitor intelligence',
      'Trend alerting',
    ],
    status: 'AVAILABLE',
    statusLabel: 'AVAILABLE  -  Deploy in 48 hours',
    statusColor: C.sage,
    statusBg: '#F0F7EE',
    ctaLabel: 'Request Deployment',
    ctaHref: 'mailto:info@iconycs.com?subject=Market Intelligence Agent Inquiry',
    ctaStyle: 'primary',
  },
  {
    icon: '[house]',
    name: 'Acquisition Scout Agent',
    price: '$2,000',
    period: '/month',
    description:
      'Monitors property transfers in your target markets. Scores acquisition opportunities by demographic fit and LTV profile. Auto-generates acquisition memos with ICONYCS data.',
    useCases: [
      'Portfolio acquisition targeting',
      'Off-market opportunity identification',
      'Market entry scoring',
      'Investment memo generation',
    ],
    status: 'BETA',
    statusLabel: 'BETA  -  Available Q2 2026',
    statusColor: C.gold,
    statusBg: '#FEFBF0',
    ctaLabel: 'Join Waitlist',
    ctaHref: 'mailto:info@iconycs.com?subject=Acquisition Scout Waitlist',
    ctaStyle: 'secondary',
  },
];

// --- Component ----------------------------------------------------------------
export default function AgentsPage() {
  return (
    <div style={{ fontFamily: C.font, background: C.bg, minHeight: '100vh', color: C.text }}>

      {/* -- Nav -- */}
      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', letterSpacing: '-0.02em' }}>ICONYCS</span>
              <div style={{ fontSize: 9, fontWeight: 600, color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>Housing Intelligence</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/reports" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.bgWarm }}>Reports</Link>
            <Link href="/dashboard" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.bgWarm }}>Dashboard</Link>
            <Link href="/api-docs" style={{ fontSize: 12, color: C.sage, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#F0F7EE', fontWeight: 600 }}>API</Link>
            <Link href="/fair-lending" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.terra, fontWeight: 600 }}>Fair Lending</Link>
            <Link href="/pricing" style={{ fontSize: 12, color: C.terra, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#FFF8F5', fontWeight: 600 }}>Pricing</Link>
            <Link href="/agents" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.navy, fontWeight: 700 }}>Agents</Link>
            <Link href="/login" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 14px', borderRadius: 6, background: C.terra, fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </nav>

      {/* -- Hero -- */}
      <section style={{
        background: `linear-gradient(135deg, ${C.navyDark} 0%, ${C.navy} 60%, ${C.navyLight} 100%)`,
        padding: '80px 20px 90px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(196,101,58,0.15)', border: '1px solid rgba(196,101,58,0.35)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.terra, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#E8A485', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              AI Agent Marketplace
            </span>
          </div>

          <h1 style={{
            fontFamily: C.fontSerif,
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
          }}>
            ICONYCS Agent Marketplace
            <br />
            <span style={{ color: '#8FA8CC', fontSize: '0.65em', fontWeight: 400 }}>
              Deploy AI analysts against 130M property records
            </span>
          </h1>

          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.7,
            maxWidth: 580,
            margin: '0 auto 36px',
          }}>
            Pre-built agents for fair lending compliance, market intelligence, and investment analysis.
            Enterprise-ready. Deploy in minutes.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@iconycs.com?subject=Agent Marketplace Inquiry"
              style={{
                display: 'inline-block', padding: '12px 28px', borderRadius: 8,
                background: C.terra, color: '#fff', fontWeight: 700, fontSize: 14,
                textDecoration: 'none', letterSpacing: '0.01em',
              }}>
              Talk to Sales
            </a>
            <Link href="/fair-lending"
              style={{
                display: 'inline-block', padding: '12px 28px', borderRadius: 8,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}>
              View Sample Report
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 52, flexWrap: 'wrap' }}>
            {[
              { value: '130M+', label: 'Property Records' },
              { value: '3', label: 'Pre-Built Agents' },
              { value: '48 hrs', label: 'Avg. Deploy Time' },
              { value: 'CFPB/OCC', label: 'Report Standards' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: C.fontMono }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Agent Cards -- */}
      <section style={{ background: C.bgWarm, padding: '72px 20px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: C.fontSerif, fontSize: 30, fontWeight: 700, color: C.navy, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
              Available Agents
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 480, margin: '0 auto' }}>
              Each agent connects directly to your ICONYCS data subscription and runs continuously on your behalf.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}>
            {AGENTS.map((agent) => (
              <div key={agent.name} style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}>
                {/* Card Header */}
                <div style={{ padding: '28px 28px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>{agent.icon}</div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: agent.statusBg,
                    border: `1px solid ${agent.statusColor}30`,
                    borderRadius: 12, padding: '3px 10px', marginBottom: 14,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: agent.statusColor, display: 'inline-block' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: agent.statusColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {agent.statusLabel}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: C.fontSerif, fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 6px', lineHeight: 1.25 }}>
                    {agent.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 16 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: C.terra, fontFamily: C.fontMono }}>{agent.price}</span>
                    <span style={{ fontSize: 13, color: C.textMuted }}>{agent.period}</span>
                  </div>

                  <p style={{ fontSize: 14, color: C.textBody, lineHeight: 1.65, margin: '0 0 20px' }}>
                    {agent.description}
                  </p>
                </div>

                {/* Use Cases */}
                <div style={{ padding: '0 28px 24px', flexGrow: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Use Cases
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {agent.useCases.map((uc) => (
                      <li key={uc} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: C.textBody, padding: '5px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                        <span style={{ color: C.sage, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>[check]</span>
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div style={{ padding: '0 28px 28px' }}>
                  <a href={agent.ctaHref} style={{
                    display: 'block', textAlign: 'center',
                    padding: '12px 20px', borderRadius: 8,
                    background: agent.ctaStyle === 'primary' ? C.terra : 'transparent',
                    border: agent.ctaStyle === 'primary' ? 'none' : `2px solid ${C.terra}`,
                    color: agent.ctaStyle === 'primary' ? '#fff' : C.terra,
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    letterSpacing: '0.01em',
                  }}>
                    {agent.ctaLabel}  to 
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- How It Works -- */}
      <section style={{ background: C.bgCard, padding: '72px 20px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: C.fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: '0 0 12px' }}>
            How Agent Deployment Works
          </h2>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 48 }}>
            From inquiry to live monitoring in under 48 hours.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Select Agent', desc: 'Choose the agent that fits your workflow and click Request Deployment.' },
              { step: '02', title: 'Scope & Config', desc: 'Our team configures the agent to your portfolio, geography, and thresholds.' },
              { step: '03', title: 'Deploy & Monitor', desc: 'Agent goes live. Reports and alerts delivered on your schedule.' },
              { step: '04', title: 'Iterate', desc: 'Refine thresholds, add geographies, or request custom outputs at any time.' },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: 'center', padding: '24px 16px', background: C.bgWarm, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: C.fontMono, fontSize: 11, fontWeight: 700, color: C.terra, letterSpacing: '0.1em', marginBottom: 10 }}>
                  STEP {s.step}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Custom Agent Development -- */}
      <section style={{
        background: `linear-gradient(135deg, ${C.navyDark} 0%, ${C.navy} 100%)`,
        padding: '72px 20px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(196,101,58,0.15)', border: '1px solid rgba(196,101,58,0.35)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 24,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#E8A485', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Bespoke Engagements
            </span>
          </div>

          <h2 style={{ fontFamily: C.fontSerif, fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Custom Agent Development
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: 12 }}>
            Need a bespoke AI agent for your specific workflow? Our team builds custom agents on the ICONYCS data platform.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 36, fontFamily: C.fontMono }}>
            Typical engagement: $25,000-$75,000 setup + $2,000-$5,000/month hosting
          </p>
          <a href="mailto:info@iconycs.com?subject=Custom Agent Consultation"
            style={{
              display: 'inline-block', padding: '14px 32px', borderRadius: 8,
              background: C.terra, color: '#fff', fontWeight: 700, fontSize: 15,
              textDecoration: 'none', letterSpacing: '0.01em',
            }}>
            Schedule Consultation  to 
          </a>

          <div style={{ marginTop: 48, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Compliance Workflow', icon: '[scales]' },
              { label: 'Portfolio Analytics', icon: '[trending]' },
              { label: 'Regulatory Reporting', icon: '' },
              { label: 'Market Surveillance', icon: '[search]' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Footer -- */}
      <footer style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: C.fontSerif, fontSize: 16, fontWeight: 700, color: C.navy }}>ICONYCS</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Reports', href: '/reports' },
              { label: 'API', href: '/api-docs' },
              { label: 'Fair Lending', href: '/fair-lending' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Contact', href: 'mailto:info@iconycs.com' },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.textDim }}>(c) 2026 ICONYCS. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
