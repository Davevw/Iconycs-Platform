import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'ICONYCS Housing Analytics Dashboard — AI Query Lab, demographics explorer, market data, and reports.',
  robots: { index: false }, // Don't index the authenticated dashboard
};

export default function DashboardPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* 
        In production, this page imports the full React dashboard app
        (the iconycs-platform.jsx we built earlier) as a client component.
        
        The dashboard includes:
        - AI Query Lab (Claude Opus 4.6 → Snowflake SQL → Charts)
        - Demographics Explorer
        - Market Data
        - Report Generator
        - News & Insights
        - LinkedIn Publisher
        - Settings (Snowflake + Claude + LinkedIn config)
        
        For now, this is a placeholder that redirects to the dashboard.
        The actual dashboard component would be:
        
        import ICONYCSPlatform from '@/components/dashboard/Platform';
        return <ICONYCSPlatform />;
      */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', flexDirection: 'column', gap: 24,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--accent), #00A862)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 800, color: 'var(--bg)',
        }}>iC</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)' }}>ICONYCS Dashboard</h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 440, lineHeight: 1.7 }}>
          The full interactive dashboard with AI Query Lab, demographics explorer,
          market data, reports, news, and LinkedIn publisher loads here.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {['AI Query Lab', 'Demographics', 'Markets', 'Reports', 'News', 'LinkedIn', 'Settings'].map(mod => (
            <span key={mod} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}>{mod}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 24 }}>
          Powered by Claude Opus 4.6 · Snowflake · Next.js
        </p>
      </div>
    </div>
  );
}
