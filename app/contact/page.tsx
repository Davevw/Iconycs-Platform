import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact ICONYCS Housing Analytics. Schedule a call to discuss your property data and demographic analysis needs.',
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: 72 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
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

      <section style={{ padding: '100px 32px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Get in Touch</h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 48 }}>
          Schedule a call to discuss your housing analytics needs, or reach out directly.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Address</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  300 Spectrum Center Drive, Ste 400<br />
                  Irvine, California 92618
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Phone</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>(760) 599-1261</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Contact</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>David Van Waldick</div>
              </div>
            </div>
          </div>

          {/* Form placeholder */}
          <div style={{ padding: 28, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Send a Message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Name', 'Email', 'Company'].map(field => (
                <div key={field}>
                  <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>{field}</label>
                  <input style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
                  }} placeholder={field} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Message</label>
                <textarea style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, minHeight: 100,
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical',
                }} placeholder="Tell us about your project..." />
              </div>
              <button style={{
                padding: '12px 24px', borderRadius: 8, border: 'none',
                background: '#C4653A', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Send Message</button>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
