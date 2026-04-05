import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog  -  Housing Market Insights',
  description: 'Housing market news, demographic analysis, and data-driven insights from ICONYCS Housing Intelligence.',
};

const POSTS = [
  { slug: 'homeownership-ethnicity-gap-2026', title: 'The Homeownership Gap by Ethnicity in 2026', date: 'Mar 28, 2026', category: 'Demographics', excerpt: 'An analysis of 187M+ owner profiles reveals persistent gaps in homeownership rates across ethnic groups, with some encouraging signs of progress in key markets.' },
  { slug: 'ai-housing-analytics', title: 'How AI is Transforming Housing Intelligence', date: 'Mar 21, 2026', category: 'Technology', excerpt: 'Claude Opus 4.6 now powers our AI Query Lab, enabling natural language queries across 130M+ property records with instant visualization.' },
  { slug: 'dc-market-update-q1', title: 'Washington DC Housing Market: Q1 2026 Update', date: 'Mar 14, 2026', category: 'Market Update', excerpt: 'DC continues to show unique ownership patterns with a 42.1% homeownership rate  -  the lowest among major markets. Here\'s what the data reveals.' },
  { slug: 'education-homeownership-correlation', title: 'Education Level and Homeownership: What 187M Profiles Tell Us', date: 'Mar 7, 2026', category: 'Research', excerpt: 'Graduate degree holders have a 76% homeownership rate vs 52% for high school graduates. But the story is more nuanced than the headline numbers.' },
];

export default function BlogPage() {
  return (
    <main style={{ paddingTop: 72 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            
            <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', letterSpacing: '-0.02em' }}>ICONYCS</span>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>Housing Intelligence</div>
              </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 13, color: 'var(--text-body)', textDecoration: 'none', fontWeight: 500, padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s' }}>{item}</Link>
            ))}
            <Link href="/dashboard" style={{ padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#C4653A', color: '#fff', textDecoration: 'none', boxShadow: '0 1px 2px rgba(196,101,58,0.3)' }}>Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '100px 32px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>News & Insights</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 24 }}>Housing Market Blog</h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600 }}>
          Data-driven analysis and insights from the ICONYCS platform. Research, market updates, and demographic trends.
        </p>
      </section>

      <section style={{ padding: '0 32px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {POSTS.map(post => (
            <article key={post.slug} style={{
              padding: 32, borderRadius: 16, background: 'var(--bg-card)',
              border: '1px solid var(--border)', cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', padding: '3px 10px', borderRadius: 20, background: 'rgba(0,212,126,0.12)' }}>{post.category}</span>
                <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{post.date}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
              <span style={{ fontSize: 14, color: 'var(--accent)', marginTop: 16, display: 'inline-block', fontWeight: 500 }}>Read more →</span>
            </article>
          ))}
        </div>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        © {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
