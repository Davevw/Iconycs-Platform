import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partners',
  description: 'ICONYCS partners with industry leaders in property data, analytics, appraisal services, and technology solutions.',
};

const PARTNERS = [
  { name: 'Attom Data', url: 'https://www.attomdata.com/', desc: 'Comprehensive property data and real estate analytics' },
  { name: 'CoreLogic', url: 'https://www.corelogic.com/', desc: 'Property insights, analytics, and data-enabled solutions' },
  { name: 'Veros Real Estate Solutions', url: 'https://www.veros.com/', desc: 'AVM technology and real estate valuation' },
  { name: 'Black Knight', url: 'https://www.blackknightinc.com/', desc: 'Mortgage and real estate technology, data, and analytics' },
  { name: 'AVMetrics', url: 'https://www.avmetrics.net/', desc: 'Independent AVM testing and quality assurance' },
  { name: 'Infutor Demographics', url: 'https://infutor.com/', desc: 'Consumer identity and demographic data solutions' },
  { name: 'NTERSOL Technology', url: 'https://www.ntersol.com/', desc: 'Custom software development and technology solutions' },
  { name: 'VonExpy SofTech', url: 'http://vonexpy.com/', desc: 'Appraisal management systems' },
];

export default function PartnersPage() {
  return (
    <main style={{ paddingTop: 72 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(11,14,17,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            
            <span style={{ fontSize: 25, fontWeight: 700, color: 'var(--text)' }}>ICONYCS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 14, color: item === 'Partners' ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{ padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none' }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '100px 32px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Our Partners</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: 24 }}>
          Industry-leading <span style={{ color: 'var(--accent)' }}>technology partners</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 640 }}>
          We partner with the top providers in real estate technology to deliver comprehensive property
          data, analytics, and valuation solutions.
        </p>
      </section>

      <section style={{ padding: '40px 32px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {PARTNERS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{
              padding: 28, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)',
              textDecoration: 'none', transition: 'border-color 0.2s',
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{p.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</p>
              <span style={{ fontSize: 12, color: 'var(--accent)', marginTop: 12, display: 'inline-block' }}>Visit →</span>
            </a>
          ))}
        </div>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
