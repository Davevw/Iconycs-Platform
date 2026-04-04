import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ICONYCS Data API v1.0 — Developer Documentation',
  description: 'Public REST API for ICONYCS housing intelligence data. Access national, state, and local demographics, LTV, lenders, and occupancy data.',
};

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#FAFAF7',
  bgWarm: '#F5F0E8',
  bgCard: '#FFFFFF',
  bgCode: '#0F1117',
  bgCodeAlt: '#1A1D27',
  border: '#E8E2D8',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  terra: '#C4653A',
  sage: '#5D7E52',
  navy: '#1B2A4A',
  gold: '#B8860B',
  codeGreen: '#7EC8A4',
  codePurple: '#C084FC',
  codeBlue: '#60A5FA',
  codeOrange: '#FB923C',
  codeYellow: '#FBBF24',
  codeGray: '#9CA3AF',
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', 'Fira Mono', monospace",
};

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/national',
    description: 'National housing summary — totals, averages, ethnicity/property/loan breakdowns',
    params: [],
  },
  {
    method: 'GET',
    path: '/api/v1/state/:state',
    description: 'State-level housing data with full breakdowns',
    params: [{ name: ':state', type: 'path', desc: '2-letter state code (CA, TX, FL…)' }],
  },
  {
    method: 'GET',
    path: '/api/v1/demographics',
    description: 'Demographic breakdown — gender, marital, education, income, wealth, ethnicity',
    params: [
      { name: 'state', type: 'query', desc: '2-letter state code' },
      { name: 'city', type: 'query', desc: 'City name' },
      { name: 'zip', type: 'query', desc: '5-digit ZIP code' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/ltv',
    description: 'LTV tier distribution (FNMA buckets: ≤60%, 60–80%, 80–95%, 95–100%, 100%+)',
    params: [
      { name: 'state', type: 'query', desc: '2-letter state code' },
      { name: 'city', type: 'query', desc: 'City name' },
      { name: 'zip', type: 'query', desc: '5-digit ZIP code' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/lenders',
    description: 'Top lenders by loan volume for any geography',
    params: [
      { name: 'state', type: 'query', desc: '2-letter state code' },
      { name: 'city', type: 'query', desc: 'City name' },
      { name: 'limit', type: 'query', desc: 'Max results (default: 10, max: 100)' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/occupancy',
    description: 'Owner vs. non-owner occupancy split with percentages',
    params: [
      { name: 'state', type: 'query', desc: '2-letter state code' },
      { name: 'city', type: 'query', desc: 'City name' },
      { name: 'zip', type: 'query', desc: '5-digit ZIP code' },
    ],
  },
];

const RATE_LIMITS = [
  { tier: 'Free', limit: '—', note: 'No API access' },
  { tier: 'Professional', limit: '100 req / day', note: 'Test key issued at launch' },
  { tier: 'Enterprise', limit: '1,000 req / day', note: 'Priority support + SLA' },
];

// ── Code example snippets ──────────────────────────────────────────────────
const CURL_EXAMPLE = `curl -X GET \\
  "https://iconycs.com/api/v1/national" \\
  -H "X-API-Key: YOUR_API_KEY"`;

const JS_EXAMPLE = `const response = await fetch(
  'https://iconycs.com/api/v1/state/CA',
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY',
    },
  }
);

const data = await response.json();
console.log(data);
// {
//   version: "1.0",
//   generated: "2025-01-15T18:30:00.000Z",
//   geography: "CA",
//   data: {
//     state: "CA",
//     totalProperties: 14200000,
//     avgPropertyValue: 648000,
//     avgMortgage: 521000,
//     ethnicityBreakdown: [...],
//     propertyBreakdown: [...],
//     loanBreakdown: [...]
//   }
// }`;

const RESPONSE_EXAMPLE = `{
  "version": "1.0",
  "generated": "2025-01-15T18:30:00.000Z",
  "geography": "National",
  "data": {
    "totalProperties": 109811645,
    "avgPropertyValue": 215614,
    "avgMortgage": 185960,
    "ethnicityBreakdown": [
      { "DIMENSION": "ETHNICITY", "LABEL": "White", "COUNT": 72450000 },
      { "DIMENSION": "ETHNICITY", "LABEL": "Hispanic", "COUNT": 15200000 }
    ],
    "propertyBreakdown": [...],
    "loanBreakdown": [...]
  }
}`;

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  return (
    <div style={{
      background: C.bgCode,
      borderRadius: 10,
      border: `1px solid #2A2D3A`,
      overflow: 'hidden',
    }}>
      <div style={{
        background: C.bgCodeAlt,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid #2A2D3A',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: C.codeGray, fontFamily: C.fontMono }}>{lang}</span>
      </div>
      <pre style={{
        margin: 0,
        padding: '20px',
        fontFamily: C.fontMono,
        fontSize: 13,
        lineHeight: 1.7,
        color: '#E2E8F0',
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}>
        {code}
      </pre>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: C.fontMono,
      background: '#D1FAE5',
      color: '#065F46',
      letterSpacing: '0.05em',
    }}>
      {method}
    </span>
  );
}

function ParamBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    path: { bg: '#FEF3C7', color: '#92400E' },
    query: { bg: '#EDE9FE', color: '#5B21B6' },
  };
  const c = colors[type] ?? { bg: '#F3F4F6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '1px 6px',
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 600,
      background: c.bg,
      color: c.color,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    }}>
      {type}
    </span>
  );
}

export default function ApiDocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font, color: C.text }}>
      {/* ── Nav ── */}
      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 52, gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>ICONYCS</span>
          </Link>
          <span style={{ fontSize: 13, color: C.textMuted }}>Developer Docs</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/reports" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none' }}>Reports</Link>
            <Link href="/pricing" style={{ fontSize: 12, color: C.terra, textDecoration: 'none', fontWeight: 600 }}>Pricing</Link>
            <a href="mailto:info@iconycs.com"
              style={{ fontSize: 12, color: '#fff', background: C.terra, textDecoration: 'none', padding: '5px 14px', borderRadius: 6, fontWeight: 600 }}>
              Request Access
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #2A3F6A 100%)`, color: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '4px 14px',
            fontSize: 12, fontWeight: 600, marginBottom: 20, letterSpacing: '0.05em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            EARLY ACCESS
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.15 }}>
            ICONYCS Data API
            <span style={{ display: 'block', fontSize: 28, fontWeight: 400, opacity: 0.7, marginTop: 6 }}>v1.0</span>
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 600, lineHeight: 1.6, margin: '0 0 32px' }}>
            Programmatic access to 109M+ U.S. residential properties — demographics, LTV, lender intelligence, and occupancy data at national, state, and local levels.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', fontSize: 13 }}>
              🏠 109M+ Properties
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', fontSize: 13 }}>
              📍 National → ZIP Level
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', fontSize: 13 }}>
              ⚡ 5-Min Cache
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', fontSize: 13 }}>
              🔒 Key Auth
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>

        {/* ── Sidebar TOC ── */}
        <aside style={{ position: 'sticky', top: 72 }}>
          <nav>
            {[
              { href: '#access', label: '🔑 Early Access' },
              { href: '#authentication', label: '🔐 Authentication' },
              { href: '#endpoints', label: '📡 Endpoints' },
              { href: '#examples', label: '💻 Code Examples' },
              { href: '#response', label: '📦 Response Format' },
              { href: '#rate-limits', label: '⚡ Rate Limits' },
              { href: '#errors', label: '❌ Error Codes' },
            ].map(item => (
              <a key={item.href} href={item.href} style={{
                display: 'block', padding: '8px 12px', fontSize: 13, color: C.textMuted,
                textDecoration: 'none', borderRadius: 6, marginBottom: 2,
              }}>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main style={{ minWidth: 0 }}>

          {/* Early Access Banner */}
          <section id="access" style={{ marginBottom: 48 }}>
            <div style={{
              background: `linear-gradient(135deg, #FFF8F5 0%, #FFF3EB 100%)`,
              border: `2px solid ${C.terra}`,
              borderRadius: 12,
              padding: '24px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 28 }}>🚀</span>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: C.terra, margin: '0 0 8px' }}>
                    Early Access — Professional & Enterprise
                  </h2>
                  <p style={{ margin: '0 0 12px', color: C.textBody, lineHeight: 1.6 }}>
                    The ICONYCS Data API is available to <strong>Professional</strong> and <strong>Enterprise</strong> subscribers.
                    API keys are issued when ICONYCS launches. Join the waitlist to reserve your key.
                  </p>
                  <a href="mailto:info@iconycs.com"
                    style={{
                      display: 'inline-block', padding: '10px 22px',
                      background: C.terra, color: '#fff', borderRadius: 8,
                      textDecoration: 'none', fontWeight: 700, fontSize: 14,
                    }}>
                    Request API Access →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px', color: C.text }}>Authentication</h2>
            <p style={{ color: C.textBody, lineHeight: 1.7, marginBottom: 20 }}>
              All API requests require an API key passed in the <code style={{ fontFamily: C.fontMono, background: C.bgWarm, padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>X-API-Key</code> request header.
              Keys are issued to Professional and Enterprise subscribers.
            </p>
            <CodeBlock lang="http" code={`GET /api/v1/national HTTP/1.1
Host: iconycs.com
X-API-Key: ick_live_your_api_key_here`} />
            <div style={{
              marginTop: 16, padding: '12px 16px',
              background: '#FEF9C3', border: '1px solid #FDE047',
              borderRadius: 8, fontSize: 13, color: '#713F12',
            }}>
              ⚠️ Keep your API key confidential. Do not expose it in client-side JavaScript or public repositories.
            </div>
          </section>

          {/* Base URL */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px', color: C.text }}>Base URL</h2>
            <CodeBlock lang="text" code="https://iconycs.com/api/v1" />
          </section>

          {/* Endpoints */}
          <section id="endpoints" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px', color: C.text }}>Endpoints</h2>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: C.bgWarm }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Method</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Path</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Description</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Parameters</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((ep, i) => (
                    <tr key={ep.path} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : 'none', background: C.bgCard }}>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' as const }}>
                        <MethodBadge method={ep.method} />
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' as const }}>
                        <code style={{ fontFamily: C.fontMono, fontSize: 13, color: C.navy, fontWeight: 600 }}>{ep.path}</code>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' as const, fontSize: 13, color: C.textBody, lineHeight: 1.5 }}>
                        {ep.description}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' as const }}>
                        {ep.params.length === 0 ? (
                          <span style={{ fontSize: 12, color: C.textMuted }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                            {ep.params.map(p => (
                              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                                <ParamBadge type={p.type} />
                                <code style={{ fontFamily: C.fontMono, fontSize: 12, color: C.terra }}>{p.name}</code>
                                <span style={{ fontSize: 12, color: C.textMuted }}>{p.desc}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Code Examples */}
          <section id="examples" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px', color: C.text }}>Code Examples</h2>

            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px', color: C.textBody }}>cURL</h3>
            <div style={{ marginBottom: 24 }}>
              <CodeBlock lang="bash" code={CURL_EXAMPLE} />
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px', color: C.textBody }}>JavaScript (fetch)</h3>
            <CodeBlock lang="javascript" code={JS_EXAMPLE} />
          </section>

          {/* Response Format */}
          <section id="response" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px', color: C.text }}>Response Format</h2>
            <p style={{ color: C.textBody, lineHeight: 1.7, marginBottom: 20 }}>
              All responses return JSON with a consistent envelope. Every response includes:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { field: 'version', desc: 'API version string' },
                { field: 'generated', desc: 'ISO 8601 timestamp' },
                { field: 'geography', desc: 'Geographic scope of data' },
                { field: 'data', desc: 'Requested payload' },
                { field: 'rowCount', desc: 'Result row count (where applicable)' },
              ].map(f => (
                <div key={f.field} style={{ background: C.bgWarm, borderRadius: 8, padding: '12px 14px' }}>
                  <code style={{ fontFamily: C.fontMono, fontSize: 12, color: C.navy, display: 'block', marginBottom: 4 }}>{f.field}</code>
                  <span style={{ fontSize: 12, color: C.textMuted }}>{f.desc}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px', color: C.textBody }}>Example Response — /api/v1/national</h3>
            <CodeBlock lang="json" code={RESPONSE_EXAMPLE} />

            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 12px', color: C.textBody }}>Response Headers</h3>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {[
                { header: 'X-ICONYCS-Version', value: '1.0', desc: 'API version' },
                { header: 'X-RateLimit-Limit', value: '100', desc: 'Requests allowed per day' },
                { header: 'X-RateLimit-Remaining', value: '99', desc: 'Requests remaining' },
                { header: 'Cache-Control', value: 's-maxage=300', desc: '5-minute CDN cache' },
                { header: 'Access-Control-Allow-Origin', value: '*', desc: 'CORS enabled' },
              ].map((h, i) => (
                <div key={h.header} style={{
                  display: 'grid', gridTemplateColumns: '240px 140px 1fr',
                  padding: '11px 16px',
                  borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 0 ? C.bgCard : C.bgWarm,
                  fontSize: 13,
                }}>
                  <code style={{ fontFamily: C.fontMono, color: C.navy }}>{h.header}</code>
                  <code style={{ fontFamily: C.fontMono, color: C.sage }}>{h.value}</code>
                  <span style={{ color: C.textMuted }}>{h.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px', color: C.text }}>Rate Limits</h2>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: C.bgWarm }}>
                    {['Plan', 'Daily Limit', 'Notes'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATE_LIMITS.map((r, i) => (
                    <tr key={r.tier} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 600, color: C.text }}>{r.tier}</td>
                      <td style={{ padding: '13px 16px', fontFamily: C.fontMono, fontSize: 13, color: r.limit === '—' ? C.textMuted : C.navy }}>{r.limit}</td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: C.textMuted }}>{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Error Codes */}
          <section id="errors" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px', color: C.text }}>Error Codes</h2>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {[
                { code: '401', name: 'Unauthorized', desc: 'Missing or invalid X-API-Key header' },
                { code: '400', name: 'Bad Request', desc: 'Invalid parameters (e.g. state code not 2 letters)' },
                { code: '500', name: 'Internal Server Error', desc: 'Data query failed — try again or contact support' },
              ].map((e, i) => (
                <div key={e.code} style={{
                  display: 'grid', gridTemplateColumns: '60px 160px 1fr',
                  padding: '12px 16px',
                  borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 0 ? C.bgCard : C.bgWarm,
                  alignItems: 'center',
                  fontSize: 13,
                }}>
                  <code style={{ fontFamily: C.fontMono, color: '#DC2626', fontWeight: 700 }}>{e.code}</code>
                  <span style={{ fontWeight: 600, color: C.text }}>{e.name}</span>
                  <span style={{ color: C.textMuted }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{
            background: `linear-gradient(135deg, ${C.navy} 0%, #2A3F6A 100%)`,
            borderRadius: 16,
            padding: '40px 36px',
            color: '#fff',
            textAlign: 'center' as const,
          }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 12px' }}>Ready to get started?</h2>
            <p style={{ opacity: 0.8, fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 28px' }}>
              API keys are issued to Professional and Enterprise subscribers at launch.
              Your key will be waiting for you at <strong>iconycs.com/api-docs</strong>.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <a href="mailto:info@iconycs.com"
                style={{
                  padding: '12px 28px',
                  background: C.terra,
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                }}>
                Request API Access
              </a>
              <Link href="/pricing"
                style={{
                  padding: '12px 28px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                }}>
                View Pricing
              </Link>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px', textAlign: 'center' as const, fontSize: 12, color: C.textMuted }}>
        ICONYCS Data API v1.0 · © {new Date().getFullYear()} ICONYCS · <a href="mailto:info@iconycs.com" style={{ color: C.terra }}>info@iconycs.com</a>
      </footer>
    </div>
  );
}
