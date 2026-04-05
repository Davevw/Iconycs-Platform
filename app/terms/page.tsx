import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ICONYCS',
  description: 'ICONYCS Housing Intelligence Terms of Service & Data Use Agreement',
};

const C = {
  bg: '#FAFAF7',
  bgCard: '#FFFFFF',
  bgWarm: '#F5F0E8',
  border: '#E8E2D8',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  terra: '#C4653A',
  navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontSize: 18,
        fontWeight: 700,
        color: C.navy,
        fontFamily: C.fontSerif,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: `2px solid ${C.border}`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.terra, fontFamily: C.font, minWidth: 28 }}>{number}.</span>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: C.textBody, lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16, paddingLeft: 16, borderLeft: `3px solid ${C.border}` }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: C.textBody, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '8px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

function ProhibitedList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '8px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 13, color: '#B91C1C', lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600;8..60,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; font-family: ${C.font}; }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>

        {/* Nav */}
        <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 52, gap: 16 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', letterSpacing: '-0.02em' }}>ICONYCS</span>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>Housing Intelligence</div>
              </div>
            </Link>
            <span style={{ fontSize: 13, color: C.textMuted }}>Terms of Service</span>
            <div style={{ marginLeft: 'auto' }}>
              <Link href="/reports" style={{ fontSize: 12, color: C.terra, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <- Back to Reports
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: C.navy, color: '#fff', borderRadius: 6, padding: '4px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Legal
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, lineHeight: 1.2, marginBottom: 12 }}>
              Terms of Service &amp; Data Use Agreement
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted }}>
              <strong>Effective Date:</strong> April 2026 &nbsp;*&nbsp; <strong>Version:</strong> 1.0
            </p>
            <div style={{ marginTop: 20, padding: '14px 18px', background: '#FFF9F0', border: `1px solid ${C.terra}40`, borderRadius: 10, fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              <strong>Summary:</strong> By using ICONYCS, you agree to these terms. Our data is for analytics and compliance purposes only  -  not for discriminatory uses. Subscriptions renew monthly. All fees are governed by California law.
            </div>
          </div>

          {/* ToC */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Table of Contents</div>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Acceptance of Terms',
                'Description of Service',
                'Data Use Policy',
                'Subscription Tiers & Payment',
                'Data Accuracy & Disclaimers',
                'Intellectual Property',
                'Privacy',
                'Termination',
                'Governing Law',
                'Contact',
              ].map((item, i) => (
                <li key={i}>
                  <a href={`#section-${i + 1}`} style={{ fontSize: 13, color: C.terra, textDecoration: 'none', fontWeight: 500 }}>
                    {i + 1}. {item}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections */}
          <div id="section-1">
            <Section number="1" title="Acceptance of Terms">
              By accessing or using the ICONYCS Housing Intelligence platform ("Service") operated by Western Realty Finance ("Company," "we," "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.
            </Section>
          </div>

          <div id="section-2">
            <Section number="2" title="Description of Service">
              ICONYCS provides housing analytics, demographic intelligence, and property data reporting services through a cloud-based platform. Data is sourced from Direct Identified Records (individually sourced property and ownership data), public records, and licensed third-party data providers.
            </Section>
          </div>

          <div id="section-3">
            <Section number="3" title="Data Use Policy">
              <SubSection title="3.1 Permitted Uses">
                You may use ICONYCS data for:
                <BulletList items={[
                  'Market research and analysis',
                  'Fair lending compliance analysis and reporting',
                  'Academic and policy research',
                  'Investment due diligence',
                  'News media reporting and journalism',
                  'Internal business intelligence',
                ]} />
              </SubSection>

              <SubSection title="3.2 Prohibited Uses">
                You may NOT use ICONYCS data for:
                <ProhibitedList items={[
                  'Targeted marketing to individuals without appropriate consent',
                  'Discrimination based on race, ethnicity, religion, sex, national origin, disability, or familial status in violation of the Fair Housing Act or Equal Credit Opportunity Act',
                  'Resale or redistribution of raw data without written consent',
                  'Any purpose that violates applicable federal, state, or local law',
                  'Scraping, automated harvesting, or bulk extraction beyond your subscription tier',
                ]} />
              </SubSection>

              <SubSection title="3.3 Fair Housing Compliance">
                ICONYCS demographic data is provided for <strong>analytical and compliance purposes only</strong>. Subscribers who are lenders, insurers, or housing providers acknowledge their obligation to comply with the Fair Housing Act (42 U.S.C. Section 3601 et seq.), the Equal Credit Opportunity Act, and applicable state laws. ICONYCS data may not be used as the basis for any discriminatory lending, insurance, or housing decision.
              </SubSection>
            </Section>
          </div>

          <div id="section-4">
            <Section number="4" title="Subscription Tiers & Payment">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { name: 'Free Tier', price: 'No cost', badge: 'Explore', bg: C.bgWarm, color: C.textMuted, desc: 'National and state-level summary data. Limited to 3 report views per day.' },
                  { name: 'Analyst Tier', price: '$49/month', badge: 'Analyst', bg: '#FFF0E9', color: C.terra, desc: 'Full geographic drill-down (national -> state -> county -> city -> ZIP). All demographic breakdowns. PDF export. Cascade report builder.' },
                  { name: 'Professional Tier', price: '$199/month', badge: 'Pro', bg: '#EEF2F8', color: C.navy, desc: 'All Analyst features plus Social Housing Score, matrix reporting, time-series analysis, API access, custom data feeds.' },
                  { name: 'Enterprise Tier', price: '$999/month', badge: 'Enterprise', bg: '#1B2A4A', color: '#fff', desc: 'All Professional features plus Snowflake direct access, team seats (up to 5), custom views, priority support.' },
                ].map((tier, i) => (
                  <div key={i} style={{ background: tier.bg, borderRadius: 10, padding: '16px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: tier.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{tier.badge}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: i === 3 ? '#fff' : C.text, marginBottom: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 300, color: tier.color, fontFamily: C.fontSerif, marginBottom: 10 }}>{tier.price}</div>
                    <div style={{ fontSize: 12, color: i === 3 ? 'rgba(255,255,255,0.75)' : C.textMuted, lineHeight: 1.7 }}>{tier.desc}</div>
                  </div>
                ))}
              </div>

              <SubSection title="4.5 Pay-Per-Report  -  $9.99/report">
                Single report download at any tier level. No subscription required.
              </SubSection>

              <SubSection title="4.6 Payment Terms">
                Subscriptions are billed monthly in advance. All fees are non-refundable except as required by law. We reserve the right to modify pricing with 30 days notice.
              </SubSection>
            </Section>
          </div>

          <div id="section-5">
            <Section number="5" title="Data Accuracy & Disclaimers">
              <SubSection title="5.1 Data Currency">
                Property and demographic data reflects available records as of the data vintage date displayed on each report. ICONYCS does not guarantee real-time accuracy.
              </SubSection>

              <SubSection title="5.2 Ethnicity Data Methodology">
                Ethnicity data is sourced from Direct Identified Records using individually-sourced demographic information. "Not Identified" records have no direct ethnic identification. BISG (Bayesian Improved Surname Geocoding) modeled estimates, where provided, are clearly labeled and represent statistical probabilities, not individual identifications.
              </SubSection>

              <SubSection title="5.3 No Warranty">
                <div style={{ padding: '12px 16px', background: C.bgWarm, borderRadius: 8, fontWeight: 600, color: C.textBody, fontSize: 13 }}>
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. ICONYCS DOES NOT WARRANT THE ACCURACY, COMPLETENESS, OR FITNESS FOR A PARTICULAR PURPOSE OF ANY DATA.
                </div>
              </SubSection>

              <SubSection title="5.4 Limitation of Liability">
                <div style={{ padding: '12px 16px', background: C.bgWarm, borderRadius: 8, fontWeight: 600, color: C.textBody, fontSize: 13 }}>
                  IN NO EVENT SHALL ICONYCS OR WESTERN REALTY FINANCE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID IN THE PRIOR 12 MONTHS.
                </div>
              </SubSection>
            </Section>
          </div>

          <div id="section-6">
            <Section number="6" title="Intellectual Property">
              All platform software, designs, and proprietary analytics methodologies are owned by Western Realty Finance. Raw data sourced from licensed providers remains subject to those providers&apos; terms. You receive a limited, non-exclusive license to use the Service for its intended purpose.
            </Section>
          </div>

          <div id="section-7">
            <Section number="7" title="Privacy">
              We collect account information, usage data, and payment information. We do not sell your personal information.{' '}
              <Link href="/privacy" style={{ color: C.terra, textDecoration: 'underline' }}>See our Privacy Policy</Link>{' '}
              at iconycs.com/privacy for details.
            </Section>
          </div>

          <div id="section-8">
            <Section number="8" title="Termination">
              We may terminate or suspend your account for violation of these Terms, non-payment, or any reason with 30 days notice. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period.
            </Section>
          </div>

          <div id="section-9">
            <Section number="9" title="Governing Law">
              These Terms are governed by the laws of the State of California. Disputes shall be resolved in San Diego County, California.
            </Section>
          </div>

          <div id="section-10">
            <Section number="10" title="Contact">
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Western Realty Finance | ICONYCS Housing Intelligence</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, color: C.textBody }}>
                    <span style={{ color: C.textMuted, marginRight: 8 }}>Address:</span>
                    701 Palomar Airport Rd., #300, Carlsbad CA 92011
                  </div>
                  <div style={{ fontSize: 13, color: C.textBody }}>
                    <span style={{ color: C.textMuted, marginRight: 8 }}>Email:</span>
                    <a href="mailto:info@iconycs.com" style={{ color: C.terra, textDecoration: 'none' }}>info@iconycs.com</a>
                  </div>
                  <div style={{ fontSize: 13, color: C.textBody }}>
                    <span style={{ color: C.textMuted, marginRight: 8 }}>Phone:</span>
                    <a href="tel:7606720145" style={{ color: C.terra, textDecoration: 'none' }}>760-672-0145</a>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Footer acknowledgment */}
          <div style={{ marginTop: 48, padding: '20px 24px', background: C.bgWarm, borderRadius: 12, border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7, fontStyle: 'italic' }}>
              By subscribing or using the Service, you acknowledge that you have read, understood, and agree to these Terms.
            </p>
          </div>

          {/* Footer links */}
          <div style={{ marginTop: 32, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Pricing', href: '/pricing' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Contact', href: 'mailto:info@iconycs.com' },
              { label: 'Back to Reports', href: '/reports' },
            ].map((link, i) => (
              <Link key={i} href={link.href} style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: C.textDim }}>
            (c) {new Date().getFullYear()} Western Realty Finance / ICONYCS. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
