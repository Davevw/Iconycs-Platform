import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'ICONYCS Housing Analytics: AI-powered queries across 130M+ properties. Analyze homeowner demographics by ethnicity, income, education, and more.',
};

const DEMOGRAPHIC_FIELDS = [
  { field: 'Ethnicity', values: 'Hispanic, African American, Asian, Unknown' },
  { field: 'Household Income', values: '<$20K through $125K+ (8 brackets)' },
  { field: 'Education Level', values: 'High School, College, Graduate School, Vocational' },
  { field: 'Marital Status', values: 'Married, Single, Unknown' },
  { field: 'Wealth Score', values: '<$5K through $500K+ (8 brackets)' },
  { field: 'Dwelling Type', values: 'Single Family, Multi Family, Unknown' },
  { field: 'Market Home Value', values: 'Full range by market value brackets' },
  { field: 'Area Demographics', values: 'Pct Black, White, Hispanic, Asian by area' },
];

const PROPERTY_FIELDS = [
  'Property Value (Calculated, Assessed, Market, Appraised)',
  'Square Footage (Gross, Building)',
  'Bedrooms & Bathrooms',
  'Mortgage Amount, Term & Due Date',
  'Land Use Code',
  'Sales Transaction Code',
  'Full Address (Street, City, State, ZIP)',
];

export default function AnalyticsPage() {
  return (
    <main style={{ paddingTop: 72 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(11,14,17,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>ICONYCS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 14, color: item === 'Analytics' ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{ padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 32px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Analytics Platform</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: 24, maxWidth: 700 }}>
          AI-powered housing analytics at <span style={{ color: 'var(--accent)' }}>every scale</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 640, marginBottom: 40 }}>
          From a single ZIP code to the entire nation. Ask questions in plain English and get
          SQL-backed answers with visualizations — powered by Claude Opus 4.6 and a Snowflake
          database of 130M+ properties.
        </p>
        <Link href="/dashboard" style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Try the AI Query Lab →
        </Link>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 48 }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { step: '01', title: 'Ask in Plain English', desc: '"What is the homeownership rate by ethnicity in DC?"' },
              { step: '02', title: 'Claude Generates SQL', desc: 'Opus 4.6 maps your question to valid Snowflake SQL with schema awareness' },
              { step: '03', title: 'Snowflake Executes', desc: 'Query runs against 130M+ property records in seconds' },
              { step: '04', title: 'AI Interprets & Charts', desc: 'Sonnet 4.6 provides business insights and auto-generates visualizations' },
            ].map(s => (
              <div key={s.step} style={{ padding: 28, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>{s.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Schema */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 48 }}>Available Data Fields</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Demographics */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 20 }}>Owner Demographics (187M+ profiles)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {DEMOGRAPHIC_FIELDS.map(d => (
                  <div key={d.field} style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{d.field}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{d.values}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue)', marginBottom: 20 }}>Property Records (130M+ properties)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PROPERTY_FIELDS.map(p => (
                  <div key={p} style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: 14, color: 'var(--text-muted)' }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,126,0.08), transparent 70%)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Ready to query?</h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>Launch the AI Query Lab and start exploring 130M+ records in seconds.</p>
        <Link href="/dashboard" style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>Launch Dashboard</Link>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
