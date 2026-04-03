import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investor Relations',
  description: 'ICONYCS investor information. PropTech company with 130M+ property records and AI-powered housing analytics.',
};

export default function InvestorsPage() {
  return (
    <main style={{ paddingTop: 72 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(11,14,17,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>ICONYCS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{ padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '100px 32px', maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Investor Relations</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: 24 }}>
          Investing in the future of <span style={{ color: 'var(--accent)' }}>housing intelligence</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 48 }}>
          ICONYCS is a Property Technology company at the intersection of big data, AI, and housing analytics.
          With 130M+ property records, 187M+ owner profiles, and a new AI-powered platform,
          we&apos;re building the definitive source for socio-economic housing intelligence.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { metric: '130M+', label: 'Property records in our Snowflake database' },
            { metric: '187M+', label: 'Homeowner demographic profiles' },
            { metric: '30+', label: 'Years of housing & mortgage analytics experience' },
            { metric: '8+', label: 'Technology partners (Attom, CoreLogic, etc.)' },
          ].map(m => (
            <div key={m.label} style={{ padding: 28, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{m.metric}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 32, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Interested in ICONYCS?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
            Contact David Van Waldick to discuss investment opportunities and partnership.
          </p>
          <Link href="/contact" style={{ padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>
            Get in Touch
          </Link>
        </div>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
