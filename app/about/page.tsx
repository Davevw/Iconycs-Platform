import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'ICONYCS is a Property Technology company focused on socio-economic housing analytics with 30+ years in housing, mortgage, and property analytics.',
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: 72 }}>
      {/* Nav  -  reused across pages (would be a shared component in production) */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            
            <span style={{ fontSize: 25, fontWeight: 700, color: 'var(--text)' }}>ICONYCS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 13, color: 'var(--text-body)', textDecoration: 'none', fontWeight: 500, padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s' }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{ padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#C4653A', color: '#fff', textDecoration: 'none', boxShadow: '0 1px 2px rgba(196,101,58,0.3)' }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 32px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>About ICONYCS</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: 24, maxWidth: 700 }}>
          We answer the question: <span style={{ color: 'var(--accent)' }}>Whose home is it?</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 640, marginBottom: 48 }}>
          ICONYCS is a Property Technology company focused on socio-economic housing analytics.
          With a mission to support data-informed decision-making for government agencies, lenders,
          and insurers, we manage a large-scale database of over 130 million property records and
          187 million homeowner demographic profiles.
        </p>
      </section>

      {/* What We Do */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 48 }}>What We Deliver</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Property Data as a Service (PDaaS)', desc: 'Cloud-based access to 130M+ property records with demographic overlays. Query by ZIP, county, state, or national region in minutes.' },
              { title: 'AI-Powered Analytics', desc: 'Natural language queries powered by Claude Opus 4.6 generate instant SQL, business interpretation, and visualization from your Snowflake data.' },
              { title: 'Presentation-Ready Reports', desc: 'Power BI dashboards, automated report generation, and LinkedIn publishing for sharing housing market insights with stakeholders.' },
            ].map(item => (
              <div key={item.title} style={{ padding: 28, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 48 }}>Our Technology</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { name: 'Snowflake', role: 'Cloud data platform  -  130M+ property records' },
              { name: 'Claude Opus 4.6', role: 'AI-powered SQL generation and reasoning' },
              { name: 'Microsoft Power BI', role: 'Mapping and analytical dashboards' },
              { name: 'Next.js + Vercel', role: 'Modern web platform with SSR for SEO' },
            ].map(t => (
              <div key={t.name} style={{ padding: 24, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Get In Touch</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 8 }}>
            300 Spectrum Center Drive, Ste 400, Irvine, California 92618
          </p>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>
            (760) 599-1261 * <Link href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Contact David Van Waldick</Link>
          </p>
          <Link href="/contact" style={{ padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, background: '#C4653A', color: '#fff', textDecoration: 'none' }}>
            Schedule a Call
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved. * Powered by Next.js * Claude AI * Snowflake
      </footer>
    </main>
  );
}
