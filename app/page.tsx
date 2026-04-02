/**
 * ICONYCS Public Homepage
 * Server-rendered for SEO — replaces the GoDaddy site
 * 
 * This is what visitors see at iconycs.com
 * Authenticated users get redirected to /dashboard
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ICONYCS — The Socio-Economics of Home Ownership',
  description:
    'ICONYCS Housing Analytics combines 130M+ property records with 187M+ owner demographic profiles. National housing data, demographic analysis, and AI-powered insights.',
};

// Stats displayed on the homepage
const STATS = [
  { value: '130M+', label: 'Property Records' },
  { value: '187M+', label: 'Owner Profiles' },
  { value: '3,143', label: 'Markets Tracked' },
  { value: '30+', label: 'Years Experience' },
];

const SERVICES = [
  {
    title: 'National Housing Data & Analytics',
    description:
      'Know the demographic makeup of property ownership in any community, ZIP code, county, state, or national region. Get data in minutes through our rapid response platform.',
    icon: '📊',
  },
  {
    title: 'Custom Reports & Dashboards',
    description:
      'Give us your parameters and let our analysts deliver. Power BI dashboards, data exports, and presentation-quality reports tailored to your needs.',
    icon: '📋',
  },
  {
    title: 'AI-Powered Query Lab',
    description:
      'Ask questions in plain English. Our Claude AI generates SQL, queries 130M+ records, and returns visualizations with business insights — in seconds.',
    icon: '🤖',
  },
  {
    title: 'Socio-Economic Analytics',
    description:
      'Analytics by ethnicity, income level, education, marital status, veteran status, age, and more. Understand who owns what, where, and why.',
    icon: '👥',
  },
];

const PARTNERS = [
  'Attom Data', 'CoreLogic', 'Veros Real Estate Solutions', 'Black Knight',
  'AVMetrics', 'Infutor Demographics', 'NTERSOL Technology', 'VonExpy SofTech',
];

const AUDIENCES = [
  { label: 'Lenders', description: 'Risk assessment and portfolio analysis by owner demographics' },
  { label: 'Insurers', description: 'Property risk profiling with socio-economic overlays' },
  { label: 'Government Agencies', description: 'Fair lending compliance and housing policy analysis' },
  { label: 'Market Analysts', description: 'National and regional market trend intelligence' },
  { label: 'Media & Researchers', description: 'Data-driven stories about home ownership in America' },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Navigation ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(11,14,17,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img
              src="https://img1.wsimg.com/isteam/ip/e8c68af0-b86d-4dc7-b39a-77c07572bad7/ICONYCS_S5.jpg"
              alt="ICONYCS"
              width={40} height={40}
              style={{ borderRadius: 8, objectFit: 'contain', background: '#fff' }}
            />
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              ICONYCS
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/dashboard"
              style={{
                padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none',
              }}
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 32px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,126,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(74,158,255,0.06) 0%, transparent 50%)',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', width: '100%' }}>
          <div style={{ maxWidth: 720 }}>
            <p className="animate-fade-up" style={{
              fontSize: 13, fontWeight: 600, color: 'var(--accent)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20,
            }}>
              Housing Analytics & Homeowner Demographics
            </p>

            <h1 className="animate-fade-up" style={{
              fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
              fontFamily: 'var(--font-display)',
              animationDelay: '0.1s',
            }}>
              The Socio-Economics of{' '}
              <span style={{ color: 'var(--accent)' }}>Home Ownership</span>
            </h1>

            <p className="animate-fade-up" style={{
              fontSize: 20, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40,
              maxWidth: 560, animationDelay: '0.2s',
            }}>
              130 million property records. 187 million owner profiles. AI-powered analytics
              by demographics, income, education, and more — at every geographic level.
            </p>

            <div className="animate-fade-up" style={{ display: 'flex', gap: 16, animationDelay: '0.3s' }}>
              <Link href="/dashboard" style={{
                padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600,
                background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                Try the AI Query Lab →
              </Link>
              <Link href="/contact" style={{
                padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500,
                border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none',
              }}>
                Schedule a Call
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="stagger-children" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
            marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--border)',
          }}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontSize: 36, fontWeight: 800, color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section style={{ padding: '100px 32px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 40, fontWeight: 700, marginBottom: 16,
            fontFamily: 'var(--font-display)',
          }}>
            Featured Analytics
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 60, maxWidth: 600 }}>
            From raw property data to presentation-ready insights — we deliver analytics
            that drive decisions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {SERVICES.map((service) => (
              <div
                key={service.title}
                style={{
                  padding: 32, borderRadius: 16,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{service.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{service.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section style={{ padding: '100px 32px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 60 }}>
            Who We Serve
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
            {AUDIENCES.map((a) => (
              <div key={a.label} style={{
                padding: 24, borderRadius: 12, border: '1px solid var(--border)',
                background: 'var(--bg)',
              }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--accent)' }}>{a.label}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>
            Trusted Technology Partners
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 40 }}>
            {PARTNERS.map((p) => (
              <span key={p} style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{
        padding: '100px 32px', textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,126,0.08), transparent 70%)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            Ready to explore your data?
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.7 }}>
            Try the AI Query Lab free, or schedule a call with our team to discuss
            your housing analytics needs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <Link href="/dashboard" style={{
              padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600,
              background: 'var(--accent)', color: 'var(--bg)', textDecoration: 'none',
            }}>
              Launch Dashboard
            </Link>
            <Link href="/contact" style={{
              padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500,
              border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none',
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '48px 32px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img
                src="https://img1.wsimg.com/isteam/ip/e8c68af0-b86d-4dc7-b39a-77c07572bad7/ICONYCS_S5.jpg"
                alt="ICONYCS" width={32} height={32}
                style={{ borderRadius: 6, objectFit: 'contain', background: '#fff' }}
              />
              <span style={{ fontWeight: 700, fontSize: 16 }}>ICONYCS</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', maxWidth: 300, lineHeight: 1.6 }}>
              Housing Analytics and Owner Demographic Analytics.
              300 Spectrum Center Drive, Ste 400, Irvine, CA 92618
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8 }}>
              (760) 599-1261
            </p>
          </div>

          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Platform</h4>
              {['Analytics', 'MarketPlace', 'Dashboard', 'Blog'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} style={{ display: 'block', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 10 }}>{item}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Company</h4>
              {['About Us', 'Partners', 'Investor Relations', 'Contact'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} style={{ display: 'block', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 10 }}>{item}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: 1200, margin: '32px auto 0', paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, color: 'var(--text-dim)',
        }}>
          <span>© {new Date().getFullYear()} ICONYCS. All Rights Reserved.</span>
          <span>Powered by Next.js · Claude AI · Snowflake</span>
        </div>
      </footer>
    </main>
  );
}
