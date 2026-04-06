'use client';

import Link from 'next/link';

const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF',
  border: '#E8E2D8',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
};

export default function FairHousingPage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font, color: C.text }}>
      {/* Header */}
      <div style={{ background: C.navy, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>
          ICONYCS
        </Link>
        <Link href="/reports" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>
          Back to Reports
        </Link>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Badge */}
        <div style={{ display: 'inline-block', background: '#FFF3CD', border: '1px solid #FBBF24', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 24 }}>
          COMPLIANCE NOTICE
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1.2 }}>
          Fair Housing &amp; Equal Credit Opportunity Policy
        </h1>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 40 }}>
          Last Updated: April 2026 &nbsp;|&nbsp; ICONYCS Housing Intelligence
        </p>

        <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, marginBottom: 40 }} />

        {/* Section 1 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
            Our Commitment
          </h2>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 12 }}>
            ICONYCS is committed to full compliance with the <strong>Fair Housing Act (FHA)</strong> and the
            <strong> Equal Credit Opportunity Act (ECOA)</strong>. We do not discriminate on the basis of race,
            color, national origin, religion, sex, familial status, disability, age, or any other class protected
            by federal or state law.
          </p>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75 }}>
            The ICONYCS platform provides access to aggregated, publicly available housing and demographic data
            for analytical, research, and compliance purposes only. No data provided through this platform is
            intended to be used, nor should it be used, as a basis for any lending, underwriting, or credit
            decision.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
            Data Sourcing &amp; Purpose
          </h2>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 12 }}>
            All demographic data displayed within ICONYCS -- including race/ethnicity distributions, income
            estimates, and tenure (owner/renter) breakdowns -- is sourced exclusively from the
            <strong> U.S. Census Bureau American Community Survey (ACS) 5-Year Estimates, 2023</strong>.
            This data reflects <em>area-level estimates</em> aggregated at the census-tract level across
            84,400+ tracts nationwide. It is not individual-level data and does not identify specific persons.
          </p>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75 }}>
            Property records are sourced from Infutor Data Solutions. No Infutor individual-level data is
            modified, re-identified, or combined with census demographics in any manner that would identify
            specific individuals. All joins between property and census data are performed at the census-tract
            level only.
          </p>
          <div style={{ background: '#F0F4FF', border: '1px solid #C7D7F8', borderRadius: 8, padding: '16px 20px', marginTop: 16 }}>
            <p style={{ fontSize: 14, color: '#1B3A7A', margin: 0, lineHeight: 1.6 }}>
              <strong>Data Use Notice:</strong> Demographic breakdowns (race, income, tenure) displayed in
              ICONYCS reports are area-level Census estimates provided for informational and fair-lending
              analysis purposes only. They are not used in any credit or lending decision and must not be
              used as such by platform users.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
            Permitted Uses
          </h2>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 12 }}>
            ICONYCS data is intended for the following lawful purposes:
          </p>
          <ul style={{ paddingLeft: 24, margin: 0 }}>
            {[
              'Fair lending analysis and HMDA/CRA compliance reporting',
              'Market research and community development planning',
              'Academic, policy, and housing advocacy research',
              'Capital markets due diligence and geographic portfolio analysis',
              'Identifying underserved markets for targeted outreach programs',
              'Real estate investment and origination strategy (area-level only)',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 8 }}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
            Prohibited Uses
          </h2>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 12 }}>
            The following uses of ICONYCS data are expressly prohibited and constitute a violation of these
            Terms of Service and applicable federal law:
          </p>
          <ul style={{ paddingLeft: 24, margin: 0 }}>
            {[
              'Using demographic or racial composition data to deny, limit, or condition credit or housing',
              'Redlining or reverse-redlining practices based on neighborhood demographics',
              'Steering applicants toward or away from specific neighborhoods based on race or ethnicity',
              'Using this data as a factor in any individual lending, underwriting, or pricing decision',
              'Any use that violates the Fair Housing Act, ECOA, or applicable state fair lending laws',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 8 }}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
            User Responsibility
          </h2>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75 }}>
            By accessing demographic data through the ICONYCS platform, users agree to use such data only
            in compliance with all applicable federal, state, and local fair lending and fair housing laws.
            Users are solely responsible for ensuring that their use of ICONYCS data complies with all
            regulatory requirements applicable to their business. ICONYCS assumes no liability for
            downstream misuse of data by platform users.
          </p>
        </section>

        {/* Section 6 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
            Contact &amp; Opt-Out
          </h2>
          <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.75, marginBottom: 12 }}>
            If you have questions about this policy, believe your data has been misused, or wish to request
            removal of any data you believe to be inaccurate, please contact us:
          </p>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px' }}>
            <p style={{ margin: 0, fontSize: 15, color: C.textBody, lineHeight: 2 }}>
              <strong>ICONYCS Housing Intelligence</strong><br />
              300 Spectrum Center Drive, Suite 400<br />
              Irvine, CA 92618<br />
              Email: <a href="mailto:info@iconycs.com" style={{ color: C.terra }}>info@iconycs.com</a><br />
              Phone: <a href="tel:+17605991261" style={{ color: C.terra }}>760-599-1261</a>
            </p>
          </div>
          <p style={{ fontSize: 14, color: C.textMuted, marginTop: 16, lineHeight: 1.6 }}>
            To file a fair housing complaint, contact the U.S. Department of Housing and Urban Development (HUD)
            at{' '}
            <a href="https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint" target="_blank" rel="noopener noreferrer" style={{ color: C.terra }}>
              hud.gov
            </a>{' '}
            or call 1-800-669-9777.
          </p>
        </section>

        <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, marginBottom: 32 }} />

        {/* Footer nav */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/reports" style={{ fontSize: 13, color: C.terra, textDecoration: 'none', fontWeight: 600 }}>
            Back to Reports
          </Link>
          <Link href="/terms" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>
            Terms of Service
          </Link>
          <Link href="/privacy" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link href="/" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
