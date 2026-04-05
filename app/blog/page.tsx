import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog  -  Housing Market Insights | ICONYCS',
  description: 'Data-driven housing market analysis, fair lending insights, and demographic research from ICONYCS — powered by 109.8M property records and Census ACS 2023.',
};

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
  link: string;
  linkLabel: string;
}

const POSTS: Post[] = [
  {
    slug: 'homeownership-demographic-gap-109m-records',
    title: 'The Homeownership Demographic Gap: What 109M Property Records Reveal',
    date: 'Apr 4, 2026',
    category: 'Demographics',
    link: '/fair-lending',
    linkLabel: 'Run a Fair Lending Report →',
    excerpt: 'Across 109.8 million U.S. residential property records, direct ethnic identification data exposes a persistent and measurable homeownership gap that conventional surveys have historically understated.',
    body: `Across 109.8 million U.S. residential property records, direct ethnic identification data exposes a persistent and measurable homeownership gap that conventional surveys have historically understated.

ICONYCS maintains direct-identified records on 1.98 million Hispanic homeowners, 1.12 million African American homeowners, and 449,000 Asian homeowners — drawn from voter registration files, deed transfer records, and proprietary consumer data, not modeled estimates. These figures represent the floor of minority homeownership, not a ceiling.

The geographic picture sharpens when compared state by state. California's 9.7 million properties carry an average assessed value of $742,000, making it the nation's most expensive major housing market. Texas's 8.7 million properties average $295,000 — a 60% discount to California — while Florida's 7.9 million properties sit at $385,000. Despite lower price points, homeownership concentration among directly identified minority households is not proportionally higher in Texas or Florida, suggesting that price alone does not close the ownership gap.

When ICONYCS overlays Census ACS 2023 data — spanning 84,400 census tracts — the divergence becomes stark. In many markets, Census area demographics show minority populations representing 30–50% of residents, while direct property ownership records identify minority homeowners at 3–6% of total records. This is not primarily a data coverage problem; it reflects a structural reality: minority populations rent at higher rates, own in areas with lower record digitization, or have ownership records that predate digital matching.

Fair lending regulators increasingly require lenders to demonstrate affirmative outreach to underserved communities. ICONYCS data provides the geographic and demographic precision needed to identify those communities, model BISG-adjusted ownership probabilities, and produce audit-ready compliance documentation.

The full demographic breakdown by state, county, city, and ZIP code is available through the ICONYCS Fair Lending Compliance Report — queryable in under 60 seconds.`,
  },
  {
    slug: 'fha-vs-conventional-20-years-housing-finance',
    title: 'FHA vs. Conventional Loans: 20 Years of Housing Finance Data',
    date: 'Apr 2, 2026',
    category: 'Finance',
    link: '/fair-lending',
    linkLabel: 'Analyze Loan Concentration →',
    excerpt: 'With 45.5 million conventional loans, 6.3 million FHA loans, and 2.7 million VA loans in the ICONYCS database, two decades of mortgage data reveal durable geographic and demographic concentration patterns with direct fair lending implications.',
    body: `With 45.5 million conventional loans (42% of all properties), 6.3 million FHA loans (6%), and 2.7 million VA loans (3%) in the ICONYCS database, two decades of mortgage data reveal durable geographic and demographic concentration patterns with direct fair lending implications.

Recording dates in the ICONYCS dataset go back to 2002, capturing the full arc of the housing crisis, recovery, and post-pandemic surge. FHA origination volume spiked sharply between 2008 and 2012 as conventional credit contracted — a pattern still visible in geographic heat maps of FHA concentration across Sun Belt metros and inland California markets.

The national FHA+VA share averages 14.2% of all loan-bearing properties. Markets where this ratio exceeds 2x the national average — above 28% — are flagged in ICONYCS fair lending reports as potential redlining indicators, consistent with CFPB supervisory guidance. These high-FHA zones frequently overlap with census tracts where minority population share exceeds 40% per ACS 2023 data, creating a dual-layer compliance signal.

Conventional loan concentration ($45.5M records) skews heavily toward high-value coastal markets. California, New York, and Massachusetts account for a disproportionate share of conventional originations relative to their property counts, reflecting both income levels and conforming loan limit geography. Texas and Florida, despite large absolute volumes, show stronger FHA penetration in metro fringe and rural ZIP codes.

VA loan geography tracks military installation proximity with high precision. Markets near major bases — San Diego, Norfolk, Fayetteville, Killeen — show VA shares of 15–25%, and these markets require separate fair lending analysis given the income and credit profile of VA borrowers.

For lenders subject to HMDA reporting, ICONYCS loan-type data provides a cross-reference baseline for validating submission accuracy, identifying underreported geographies, and benchmarking origination mix against peer institutions.`,
  },
  {
    slug: 'california-housing-market-97m-properties',
    title: 'California Housing Market: 9.7 Million Properties, $742K Average',
    date: 'Mar 28, 2026',
    category: 'Market Update',
    link: '/reports',
    linkLabel: 'View Analytics Reports →',
    excerpt: 'California remains the largest and most expensive state housing market in the ICONYCS database. Nine-point-seven million properties at a $742,000 average value represent a market that is simultaneously the engine of national housing wealth and its primary affordability crisis.',
    body: `California remains the largest and most expensive state housing market in the ICONYCS database. Nine-point-seven million properties at a $742,000 average value represent a market that is simultaneously the engine of national housing wealth and its primary affordability crisis.

The county breakdown illustrates the state's internal stratification. Los Angeles County anchors the market with approximately 2 million properties — a metropolitan base larger than most U.S. states. San Diego County contributes 794,000 properties at a market average above $800,000, driven by coastal premiums and limited inland development capacity. Orange County's 752,000 properties consistently rank among the highest-valued in the western United States, with median assessed values exceeding $900,000 in many ZIP codes.

Owner-occupancy patterns in California diverge sharply from the national 50.6% baseline. Dense urban cores — Downtown LA, San Francisco, Oakland — show owner-occupancy rates below 35%, reflecting high institutional ownership, long-term rental stock, and rent-controlled units that never transact. Suburban and inland communities skew higher, sometimes above 65%, but these are increasingly occupied by homeowners who purchased before 2018 and cannot afford to move.

The demographic overlay amplifies the complexity. California's Hispanic population — the largest in any U.S. state by Census measure — is dramatically underrepresented in ICONYCS direct-identified ownership records relative to area demographics. This gap drives California's fair lending exposure: lenders operating in LA, Inland Empire, and Central Valley markets face elevated regulatory scrutiny under CRA assessment area rules.

For mortgage lenders, investment analysts, and fair lending compliance teams, California's data richness in the ICONYCS platform — updated through 2021 recording vintages with Census ACS 2023 overlay on all 58 counties — provides a complete picture no public data source can match.`,
  },
  {
    slug: 'census-acs-2023-property-records-housing-analysis',
    title: 'Census ACS 2023 Meets Property Records: A New Standard for Housing Analysis',
    date: 'Mar 21, 2026',
    category: 'Research',
    link: '/fair-lending',
    linkLabel: 'See the Census Overlay in Action →',
    excerpt: 'ICONYCS has joined its 109.8 million property records with Census ACS 2023 five-year estimates across 84,400 census tracts — creating the most comprehensive residential housing intelligence dataset commercially available.',
    body: `ICONYCS has joined its 109.8 million property records with Census ACS 2023 five-year estimates across 84,400 census tracts — creating the most comprehensive residential housing intelligence dataset commercially available.

The methodology is straightforward in concept and rigorous in execution. Each ICONYCS property record is geocoded to its census tract. That tract is then linked to ACS 2023 five-year estimates for population, race, income, housing tenure, and home value. The result: every property query returns not just deed and mortgage data, but the demographic and economic context of the community in which it sits.

This matters most for fair lending analysis. The "demographic gap" — the difference between Census-reported minority population share and ICONYCS direct-identified minority ownership — is the core metric driving regulatory scrutiny. When a census tract reports 45% Hispanic population and property ownership records show 4% direct-identified Hispanic homeowners, the gap is not primarily a data artifact. It reflects real disparities in homeownership access, tenure stability, and generational wealth accumulation. Regulators look at exactly this gap when evaluating CRA performance and HMDA disparate impact.

BISG (Bayesian Improved Surname Geocoding) modeling addresses the identification gap by combining last name surname analysis with census tract geography to estimate race/ethnicity probabilities for unidentified records. ICONYCS offers BISG-enhanced demographic estimates in the Professional tier, increasing effective minority identification from 3.2% direct coverage to approximately 85% probabilistic coverage nationally.

The practical application is significant: lenders can now identify census tracts where their origination activity falls below community demographic representation, quantify the gap with defensible statistical methodology, and design targeted outreach programs with geographic precision. Regulators can benchmark lender performance against actual community demographics rather than HMDA peer averages.

With 84,400 tracts covered and ACS 2023 data representing the most current five-year survey available, the ICONYCS census overlay is the analytical foundation for next-generation fair lending compliance.`,
  },
];

export default function BlogPage() {
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

      <section style={{ padding: '100px 32px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>News &amp; Insights</p>
        <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 24 }}>Housing Market Blog</h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600 }}>
          Data-driven analysis from the ICONYCS platform — 109.8M property records, Census ACS 2023, and 20 years of mortgage data.
        </p>
      </section>

      <section style={{ padding: '0 32px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {POSTS.map(post => (
            <article key={post.slug} style={{
              borderRadius: 16, background: 'var(--bg-card)',
              border: '1px solid var(--border)', overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{ padding: '28px 32px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', padding: '3px 10px', borderRadius: 20, background: 'rgba(0,212,126,0.12)' }}>{post.category}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{post.date}</span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{post.excerpt}</p>
              </div>

              {/* Body */}
              <div style={{ padding: '0 32px 24px' }}>
                {post.body.split('\n\n').map((paragraph, i) => (
                  <p key={i} style={{
                    fontSize: 14,
                    color: 'var(--text-body)',
                    lineHeight: 1.8,
                    margin: '0 0 16px',
                  }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Footer CTA */}
              <div style={{ padding: '16px 32px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <Link href={post.link} style={{
                  fontSize: 14, color: '#C4653A', fontWeight: 600,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  {post.linkLabel}
                </Link>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                  Source: ICONYCS Snowflake — 109.8M property records
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer style={{ padding: '32px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-dim)' }}>
        &copy; {new Date().getFullYear()} ICONYCS. All Rights Reserved.
      </footer>
    </main>
  );
}
