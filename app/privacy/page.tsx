import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ICONYCS',
  description: 'ICONYCS Housing Analytics Privacy Policy — how we collect, use, and protect your data.',
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
  sage: '#5D7E52',
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

function Callout({ icon, title, children, variant = 'neutral' }: {
  icon: string; title: string; children: React.ReactNode; variant?: 'neutral' | 'positive' | 'warning';
}) {
  const styles = {
    neutral: { bg: C.bgWarm, border: C.border, titleColor: C.navy },
    positive: { bg: '#EDF6EA', border: `${C.sage}60`, titleColor: C.sage },
    warning: { bg: '#FFF9F0', border: `${C.terra}60`, titleColor: C.terra },
  }[variant];

  return (
    <div style={{
      padding: '16px 20px',
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      borderRadius: 10,
      marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: styles.titleColor, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
      </div>
      <div style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function BulletList({ items, color = C.textBody }: { items: string[]; color?: string }) {
  return (
    <ul style={{ margin: '8px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 13, color, lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
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
              <span style={{ fontSize: 19, fontWeight: 700, color: C.text, fontFamily: C.font }}>ICONYCS</span>
            </Link>
            <span style={{ fontSize: 13, color: C.textMuted }}>Privacy Policy</span>
            <div style={{ marginLeft: 'auto' }}>
              <Link href="/reports" style={{ fontSize: 12, color: C.terra, textDecoration: 'none', fontWeight: 600 }}>
                ← Back to Reports
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
              Privacy Policy
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted }}>
              <strong>Effective Date:</strong> April 2026 &nbsp;·&nbsp; <strong>Governing Law:</strong> California
            </p>
            <div style={{ marginTop: 20, padding: '14px 18px', background: '#EDF6EA', border: `1px solid ${C.sage}60`, borderRadius: 10, fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              <strong>The short version:</strong> We collect only what we need to run the platform. We never sell your personal information. Your data is protected by reputable third-party services operating under strict data agreements.
            </div>
          </div>

          {/* Section 1 */}
          <Section number="1" title="Data We Collect">
            <p style={{ marginBottom: 16 }}>We collect the minimum information necessary to provide the ICONYCS platform. This includes:</p>

            <Callout icon="👤" title="Account Information">
              When you create an account or join our waitlist, we collect your name, email address, company name, and selected subscription tier. This is used to manage your access and communicate with you about the service.
            </Callout>

            <Callout icon="📊" title="Usage Data">
              We automatically collect information about how you use the platform — including pages viewed, report queries run, geographic selections made, and session timestamps. This data is aggregated and used to improve the service. We do not profile individual users for advertising purposes.
            </Callout>

            <Callout icon="💳" title="Payment Information">
              Payment is processed through Stripe. ICONYCS does not store your credit card numbers, CVV, or full payment details. We retain only transaction records (amount, date, subscription tier) necessary for billing and accounting.
            </Callout>
          </Section>

          {/* Section 2 */}
          <Section number="2" title="How We Use Your Data">
            <BulletList items={[
              'Service delivery — processing your queries, generating reports, and managing your subscription',
              'Platform analytics — understanding usage patterns to improve features and performance',
              'Communication — account notifications, billing receipts, and product updates (you can unsubscribe at any time)',
              'Legal compliance — responding to lawful requests, enforcing our Terms of Service, and protecting platform integrity',
              'Fraud prevention — detecting and preventing unauthorized access or abuse',
            ]} />
          </Section>

          {/* Section 3 */}
          <Section number="3" title="Data We Do NOT Sell">
            <div style={{ padding: '20px 24px', background: '#EDF6EA', border: `2px solid ${C.sage}`, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.sage, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>✅</span> We do not sell your personal information. Period.
              </div>
              <div style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
                ICONYCS does not sell, rent, trade, or otherwise transfer your personal information to third parties for their marketing or commercial use. We are not an advertising business and have no financial incentive to monetize your personal data.
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              California residents: You have rights under the California Consumer Privacy Act (CCPA) including the right to know what data we collect, request deletion, and opt out of any sale of data. Since we do not sell data, the opt-out right is already satisfied. To submit a CCPA request, email{' '}
              <a href="mailto:info@iconycs.com" style={{ color: C.terra }}>info@iconycs.com</a>.
            </p>
          </Section>

          {/* Section 4 */}
          <Section number="4" title="Third-Party Services">
            <p style={{ marginBottom: 16, fontSize: 13, color: C.textBody }}>
              ICONYCS relies on the following reputable infrastructure providers. Each operates under strict data protection standards:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              {[
                {
                  name: 'Snowflake',
                  role: 'Data Warehouse',
                  desc: 'Hosts and processes all property analytics data. Enterprise-grade security with SOC 2 Type II certification.',
                  icon: '❄️',
                },
                {
                  name: 'Stripe',
                  role: 'Payment Processing',
                  desc: 'Handles all subscription billing and payment card data. PCI DSS Level 1 certified.',
                  icon: '💳',
                },
                {
                  name: 'Vercel',
                  role: 'Hosting & Delivery',
                  desc: 'Hosts the ICONYCS web platform and API layer. SOC 2 compliant edge network.',
                  icon: '▲',
                },
                {
                  name: 'Supabase',
                  role: 'Authentication & Database',
                  desc: 'Manages user accounts, authentication, and application data. SOC 2 Type II certified.',
                  icon: '🔐',
                },
              ].map((service, i) => (
                <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{service.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{service.name}</div>
                  <div style={{ fontSize: 11, color: C.terra, fontWeight: 600, marginBottom: 8 }}>{service.role}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>{service.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              These providers may process your data only as necessary to deliver their services to ICONYCS. They are contractually prohibited from using your data for their own commercial purposes.
            </p>
          </Section>

          {/* Section 5 */}
          <Section number="5" title="Data Retention & Security">
            <BulletList items={[
              'Account data is retained for the duration of your account plus 90 days after cancellation',
              'Payment records are retained for 7 years as required by tax and accounting law',
              'Usage logs are retained for 12 months then automatically purged',
              'All data is encrypted in transit (TLS 1.3) and at rest (AES-256)',
              'You may request deletion of your account and associated data at any time by emailing info@iconycs.com',
            ]} />
          </Section>

          {/* Section 6 */}
          <Section number="6" title="Cookies">
            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              ICONYCS uses essential cookies to maintain your session and authentication state. We do not use advertising cookies or cross-site tracking cookies. Analytics cookies, if used, are first-party only and do not share data with ad networks.
            </p>
          </Section>

          {/* Section 7 */}
          <Section number="7" title="Children's Privacy">
            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              ICONYCS is a professional business analytics platform not directed at children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a minor has provided us with personal information, please contact us immediately.
            </p>
          </Section>

          {/* Section 8 */}
          <Section number="8" title="Changes to This Policy">
            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              We may update this Privacy Policy from time to time. Significant changes will be communicated via email or a prominent notice on the platform at least 14 days before taking effect. Your continued use of the Service after such changes constitutes acceptance.
            </p>
          </Section>

          {/* Section 9 */}
          <Section number="9" title="Governing Law">
            <p style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7 }}>
              This Privacy Policy is governed by the laws of the State of California. Any disputes relating to privacy shall be resolved in San Diego County, California. California residents have additional rights under the CCPA as described in Section 3.
            </p>
          </Section>

          {/* Section 10 */}
          <Section number="10" title="Contact">
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Privacy Questions &amp; Requests</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: C.textBody }}>
                  <span style={{ color: C.textMuted, marginRight: 8 }}>Email:</span>
                  <a href="mailto:info@iconycs.com" style={{ color: C.terra, textDecoration: 'none', fontWeight: 600 }}>info@iconycs.com</a>
                </div>
                <div style={{ fontSize: 13, color: C.textBody }}>
                  <span style={{ color: C.textMuted, marginRight: 8 }}>Mail:</span>
                  Western Realty Finance / ICONYCS, 701 Palomar Airport Rd., #300, Carlsbad CA 92011
                </div>
                <div style={{ fontSize: 13, color: C.textBody }}>
                  <span style={{ color: C.textMuted, marginRight: 8 }}>Response time:</span>
                  Within 45 days for CCPA requests; within 14 days for general privacy inquiries
                </div>
              </div>
            </div>
          </Section>

          {/* Footer links */}
          <div style={{ marginTop: 48, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Contact', href: 'mailto:info@iconycs.com' },
              { label: 'Back to Reports', href: '/reports' },
            ].map((link, i) => (
              <Link key={i} href={link.href} style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: C.textDim }}>
            © {new Date().getFullYear()} Western Realty Finance / ICONYCS. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
