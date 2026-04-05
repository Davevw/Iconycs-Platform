import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog -- Housing Intelligence | ICONYCS',
  description: 'Data-driven housing market analysis, fair lending insights, and demographic research from ICONYCS -- powered by 130M+ property records and Census ACS 2023.',
};

interface Post {
  slug: string;
  title: string;
  date: string;
  category: 'Demographics' | 'Finance' | 'Market' | 'Research';
  categoryLabel: string;
  excerpt: string;
  teaser: string;
  body: string;
  link: string;
}

const POSTS: Post[] = [
  {
    slug: 'homeownership-demographic-gap-109m-records',
    title: 'The Homeownership Demographic Gap: What 109M Property Records Reveal',
    date: 'Apr 4, 2026',
    category: 'Demographics',
    categoryLabel: 'Demographics',
    link: '/fair-lending',
    teaser: 'Across 109.8M U.S. residential property records, direct ethnic identification exposes a persistent homeownership gap...',
    excerpt: 'Across 109.8 million U.S. residential property records, direct ethnic identification data exposes a persistent and measurable homeownership gap that conventional surveys have historically understated.',
    body: `Across 109.8 million U.S. residential property records, direct ethnic identification data exposes a persistent and measurable homeownership gap that conventional surveys have historically understated.

ICONYCS maintains direct-identified records on 1.98 million Hispanic homeowners, 1.12 million African American homeowners, and 449,000 Asian homeowners -- drawn from voter registration files, deed transfer records, and proprietary consumer data, not modeled estimates. These figures represent the floor of minority homeownership, not a ceiling.

The geographic picture sharpens when compared state by state. California's 9.7 million properties carry an average assessed value of $742,000, making it the nation's most expensive major housing market. Texas's 8.7 million properties average $295,000 -- a 60% discount to California -- while Florida's 7.9 million properties sit at $385,000. Despite lower price points, homeownership concentration among directly identified minority households is not proportionally higher in Texas or Florida, suggesting that price alone does not close the ownership gap.

When ICONYCS overlays Census ACS 2023 data -- spanning 84,400 census tracts -- the divergence becomes stark. In many markets, Census area demographics show minority populations representing 30-50% of residents, while direct property ownership records identify minority homeowners at 3-6% of total records. This is not primarily a data coverage problem; it reflects a structural reality: minority populations rent at higher rates, own in areas with lower record digitization, or have ownership records that predate digital matching.

Fair lending regulators increasingly require lenders to demonstrate affirmative outreach to underserved communities. ICONYCS data provides the geographic and demographic precision needed to identify those communities, model BISG-adjusted ownership probabilities, and produce audit-ready compliance documentation.

The full demographic breakdown by state, county, city, and ZIP code is available through the ICONYCS Fair Lending Compliance Report -- queryable in under 60 seconds.`,
  },
  {
    slug: 'fha-vs-conventional-20-years-housing-finance',
    title: 'FHA vs. Conventional Loans: 20 Years of Housing Finance Data',
    date: 'Apr 2, 2026',
    category: 'Finance',
    categoryLabel: 'Market',
    link: '/fair-lending',
    teaser: 'With 45.5M conventional loans and 6.3M FHA loans in the ICONYCS database, two decades of mortgage data reveal durable geographic concentration patterns...',
    excerpt: 'With 45.5 million conventional loans, 6.3 million FHA loans, and 2.7 million VA loans in the ICONYCS database, two decades of mortgage data reveal durable geographic and demographic concentration patterns with direct fair lending implications.',
    body: `With 45.5 million conventional loans (42% of all properties), 6.3 million FHA loans (6%), and 2.7 million VA loans (3%) in the ICONYCS database, two decades of mortgage data reveal durable geographic and demographic concentration patterns with direct fair lending implications.

Recording dates in the ICONYCS dataset go back to 2002, capturing the full arc of the housing crisis, recovery, and post-pandemic surge. FHA origination volume spiked sharply between 2008 and 2012 as conventional credit contracted -- a pattern still visible in geographic heat maps of FHA concentration across Sun Belt metros and inland California markets.

The national FHA+VA share averages 14.2% of all loan-bearing properties. Markets where this ratio exceeds 2x the national average -- above 28% -- are flagged in ICONYCS fair lending reports as potential redlining indicators, consistent with CFPB supervisory guidance. These high-FHA zones frequently overlap with census tracts where minority population share exceeds 40% per ACS 2023 data, creating a dual-layer compliance signal.

Conventional loan concentration ($45.5M records) skews heavily toward high-value coastal markets. California, New York, and Massachusetts account for a disproportionate share of conventional originations relative to their property counts, reflecting both income levels and conforming loan limit geography. Texas and Florida, despite large absolute volumes, show stronger FHA penetration in metro fringe and rural ZIP codes.

VA loan geography tracks military installation proximity with high precision. Markets near major bases -- San Diego, Norfolk, Fayetteville, Killeen -- show VA shares of 15-25%, and these markets require separate fair lending analysis given the income and credit profile of VA borrowers.

For lenders subject to HMDA reporting, ICONYCS loan-type data provides a cross-reference baseline for validating submission accuracy, identifying underreported geographies, and benchmarking origination mix against peer institutions.`,
  },
  {
    slug: 'california-housing-market-97m-properties',
    title: 'California Housing Market: 9.7 Million Properties, $742K Average',
    date: 'Mar 28, 2026',
    category: 'Market',
    categoryLabel: 'Market',
    link: '/reports',
    teaser: 'California\'s 9.7M properties at a $742K average value are simultaneously the engine of national housing wealth and its primary affordability crisis...',
    excerpt: 'California remains the largest and most expensive state housing market in the ICONYCS database. Nine-point-seven million properties at a $742,000 average value represent a market that is simultaneously the engine of national housing wealth and its primary affordability crisis.',
    body: `California remains the largest and most expensive state housing market in the ICONYCS database. Nine-point-seven million properties at a $742,000 average value represent a market that is simultaneously the engine of national housing wealth and its primary affordability crisis.

The county breakdown illustrates the state's internal stratification. Los Angeles County anchors the market with approximately 2 million properties -- a metropolitan base larger than most U.S. states. San Diego County contributes 794,000 properties at a market average above $800,000, driven by coastal premiums and limited inland development capacity. Orange County's 752,000 properties consistently rank among the highest-valued in the western United States, with median assessed values exceeding $900,000 in many ZIP codes.

Owner-occupancy patterns in California diverge sharply from the national 50.6% baseline. Dense urban cores -- Downtown LA, San Francisco, Oakland -- show owner-occupancy rates below 35%, reflecting high institutional ownership, long-term rental stock, and rent-controlled units that never transact. Suburban and inland communities skew higher, sometimes above 65%, but these are increasingly occupied by homeowners who purchased before 2018 and cannot afford to move.

The demographic overlay amplifies the complexity. California's Hispanic population -- the largest in any U.S. state by Census measure -- is dramatically underrepresented in ICONYCS direct-identified ownership records relative to area demographics. This gap drives California's fair lending exposure: lenders operating in LA, Inland Empire, and Central Valley markets face elevated regulatory scrutiny under CRA assessment area rules.

For mortgage lenders, investment analysts, and fair lending compliance teams, California's data richness in the ICONYCS platform -- updated through 2021 recording vintages with Census ACS 2023 overlay on all 58 counties -- provides a complete picture no public data source can match.`,
  },
  {
    slug: 'census-acs-2023-property-records-housing-analysis',
    title: 'Census ACS 2023 Meets Property Records: A New Standard for Housing Analysis',
    date: 'Mar 21, 2026',
    category: 'Research',
    categoryLabel: 'Research',
    link: '/fair-lending',
    teaser: 'ICONYCS joins 109.8M property records with Census ACS 2023 estimates across 84,400 census tracts -- the most comprehensive residential housing intelligence dataset available...',
    excerpt: 'ICONYCS has joined its 109.8 million property records with Census ACS 2023 five-year estimates across 84,400 census tracts -- creating the most comprehensive residential housing intelligence dataset commercially available.',
    body: `ICONYCS has joined its 109.8 million property records with Census ACS 2023 five-year estimates across 84,400 census tracts -- creating the most comprehensive residential housing intelligence dataset commercially available.

The methodology is straightforward in concept and rigorous in execution. Each ICONYCS property record is geocoded to its census tract. That tract is then linked to ACS 2023 five-year estimates for population, race, income, housing tenure, and home value. The result: every property query returns not just deed and mortgage data, but the demographic and economic context of the community in which it sits.

This matters most for fair lending analysis. The "demographic gap" -- the difference between Census-reported minority population share and ICONYCS direct-identified minority ownership -- is the core metric driving regulatory scrutiny. When a census tract reports 45% Hispanic population and property ownership records show 4% direct-identified Hispanic homeowners, the gap is not primarily a data artifact. It reflects real disparities in homeownership access, tenure stability, and generational wealth accumulation. Regulators look at exactly this gap when evaluating CRA performance and HMDA disparate impact.

BISG (Bayesian Improved Surname Geocoding) modeling addresses the identification gap by combining last name surname analysis with census tract geography to estimate race/ethnicity probabilities for unidentified records. ICONYCS offers BISG-enhanced demographic estimates in the Professional tier, increasing effective minority identification from 3.2% direct coverage to approximately 85% probabilistic coverage nationally.

The practical application is significant: lenders can now identify census tracts where their origination activity falls below community demographic representation, quantify the gap with defensible statistical methodology, and design targeted outreach programs with geographic precision. Regulators can benchmark lender performance against actual community demographics rather than HMDA peer averages.

With 84,400 tracts covered and ACS 2023 data representing the most current five-year survey available, the ICONYCS census overlay is the analytical foundation for next-generation fair lending compliance.`,
  },
];

const CATEGORY_STYLES: Record<string, { bg: string; color: string; emoji: string }> = {
  Demographics: { bg: 'rgba(99,102,241,0.12)', color: '#4f46e5', emoji: '👥' },
  Finance:      { bg: 'rgba(16,185,129,0.12)', color: '#059669', emoji: '⚖️' },
  Market:       { bg: 'rgba(245,158,11,0.14)', color: '#b45309', emoji: '🏠' },
  Research:     { bg: 'rgba(139,92,246,0.12)', color: '#7c3aed', emoji: '📊' },
};

export default function BlogPage() {
  return (
    <main style={{ paddingTop: 72, fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <style>{`
        .blog-card {
          background: #ffffff;
          border: 1px solid #e8e4df;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
        }
        .blog-card:hover {
          border-color: #C4653A;
          box-shadow: 0 4px 24px rgba(196,101,58,0.12);
          transform: translateY(-2px);
        }
        .blog-card:hover .read-more {
          color: #a3522d;
        }
        .read-more {
          font-size: 13px;
          font-weight: 600;
          color: #C4653A;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 720px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
        .nav-link {
          font-size: 13px;
          color: #6b6660;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover {
          background: rgba(196,101,58,0.08);
          color: #C4653A;
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(250,249,246,0.94)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e8e4df',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1a1714', letterSpacing: '-0.02em' }}>ICONYCS</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#9a8f86', letterSpacing: '0.02em', marginTop: 2 }}>Housing Intelligence</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {['About', 'Analytics', 'MarketPlace', 'Partners', 'Blog'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="nav-link">{item}</Link>
            ))}
            <Link href="/dashboard" style={{
              marginLeft: 8, padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: '#C4653A', color: '#fff', textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(196,101,58,0.35)',
            }}>Launch Dashboard</Link>
            <Link href="/" style={{ fontSize: 13, color: '#6b6660', textDecoration: 'none', fontWeight: 500, padding: '8px 14px', borderRadius: '8px' }}>Home</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #fdf6ef 0%, #faf3ec 40%, #f5ede3 100%)',
        borderBottom: '1px solid #ede6dc',
        padding: '72px 32px 64px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#C4653A',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: 18,
          }}>News &amp; Insights</p>
          <h1 style={{
            fontSize: 44, fontWeight: 800, color: '#1a1714',
            letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 20,
          }}>📰 Housing Intelligence Blog</h1>
          <p style={{
            fontSize: 17, color: '#7a6f66', lineHeight: 1.7, maxWidth: 560, margin: '0 auto',
          }}>
            Data-driven analysis from 130M+ property records. Research, market updates, and demographic trends.
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      <section style={{ padding: '56px 32px 96px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="blog-grid">
          {POSTS.map(post => {
            const catStyle = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES['Research'];
            return (
              <article key={post.slug} className="blog-card">
                <div style={{ padding: '24px 26px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: catStyle.color, background: catStyle.bg,
                      padding: '3px 10px', borderRadius: 20,
                      letterSpacing: '0.04em',
                    }}>{catStyle.emoji} {post.categoryLabel}</span>
                    <span style={{ fontSize: 12, color: '#a89e95' }}>{post.date}</span>
                  </div>

                  {/* Headline */}
                  <h2 style={{
                    fontSize: 18, fontWeight: 700, color: '#1a1714',
                    lineHeight: 1.35, marginBottom: 12, margin: '0 0 12px',
                  }}>{post.title}</h2>

                  {/* Teaser */}
                  <p style={{
                    fontSize: 14, color: '#7a6f66', lineHeight: 1.65,
                    margin: '0 0 20px', flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{post.teaser}</p>

                  {/* Read more */}
                  <div style={{ marginTop: 'auto' }}>
                    <Link href={post.link} className="read-more">
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer style={{
        padding: '28px 32px', borderTop: '1px solid #e8e4df',
        textAlign: 'center', fontSize: 12, color: '#b0a89e',
      }}>
        &copy; {new Date().getFullYear()} ICONYCS Housing Intelligence. All Rights Reserved.
      </footer>
    </main>
  );
}
