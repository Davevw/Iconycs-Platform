import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MarketPlace',
  description: 'ICONYCS property data products: PDaaS cloud access, AVM tools, appraisal services, collateral analytics, and demographic data subscriptions.',
};

const PRODUCTS = [
  {
    name: 'PDaaS — Property Data as a Service',
    desc: 'Cloud-based access to 130M+ property records with demographic overlays. Self-service queries or analyst-prepared reports.',
    price: 'Custom',
    features: ['Snowflake cloud access', 'Power BI dashboards', 'API integration', 'Custom geographic filters'],
  },
  {
    name: 'AI Query Lab',
    desc: 'Natural language access to the full ICONYCS database. Ask questions, get SQL-backed answers with visualizations.',
    price: 'Included with PDaaS',
    features: ['Claude Opus 4.6 powered', 'Auto-generated charts', 'Export to PDF/PPTX', 'Query history & favorites'],
  },
  {
    name: 'Demographic Analytics Package',
    desc: 'Deep-dive reports on homeowner demographics by any geographic area. Ethnicity, income, education, wealth, and more.',
    price: 'Per Report',
    features: ['187M+ owner profiles', '8 demographic dimensions', 'Area comparison tools', 'Trend analysis'],
  },
  {
    name: 'Custom Analyst Reports',
    desc: 'Let our 30+ year veterans build the exact report you need. From portfolio risk analysis to fair lending compliance.',
    price: 'Project-based',
    features: ['Dedicated analyst', 'Presentation-ready output', 'Power BI or Excel delivery', 'Ongoing support'],
  },
];

const PARTNER_PRODUCTS = [
  { name: 'AVM & Appraisal Tools', partners: 'Veros, AVMetrics, VonExpy SofTech' },
  { name: 'Property Data Feeds', partners: 'Attom Data, CoreLogic, Black Knight' },
  { name: 'Demographic Enrichment', partners: 'Infutor Demographics' },
  { name: 'Technology Integration', partners: 'NTERSOL Technology Development' },
];

export default function MarketplacePage() {
  return (
    <main style={{ paddingTop: 72 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(11,14,17,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            
            <span style={{ fontSize: 25, fontWeight: 700, color: 'var(--text)' }}>ICONYCS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 14, color: item === 'MarketPlace' ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{ padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 32px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Products & Services</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: 24, maxWidth: 700 }}>
          Tools for <span style={{ color: 'var(--accent)' }}>marketing and risk managers</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 640 }}>
          Property and demographic data cascades through our national database. Conveniently accessed
          through PDaaS cloud, Power BI tools, and our new AI Query Lab.
          If it&apos;s about residential property data and ownership profiles, ICONYCS can provide it.
        </p>
      </section>

      {/* Products Grid */}
      <section style={{ padding: '40px 32px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {PRODUCTS.map(p => (
            <div key={p.name} style={{ padding: 32, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, maxWidth: '70%' }}>{p.name}</h3>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, background: 'rgba(0,212,126,0.12)' }}>{p.price}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.features.map(f => (
                  <span key={f} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-dim)' }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Products */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 40 }}>Partner Solutions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {PARTNER_PRODUCTS.map(pp => (
              <div key={pp.name} style={{ padding: 24, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{pp.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{pp.partners}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Ready to order?</h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>Contact us to discuss your data needs and get started.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Link href="/contact" style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>Schedule a Call</Link>
          <Link href="/dashboard" style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500, border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}>Try Free Demo</Link>
        </div>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
