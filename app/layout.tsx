import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://iconycs.com'),
  title: {
    default: 'ICONYCS — Housing Analytics & Homeowner Demographics',
    template: '%s | ICONYCS',
  },
  description:
    'ICONYCS combines 130M+ property records with 187M+ owner demographic profiles. Analytics by ethnicity, income, education, marital status, and more. The socio-economics of home ownership.',
  keywords: [
    'housing analytics', 'homeowner demographics', 'property data', 'real estate analytics',
    'home ownership data', 'demographic analysis', 'property records', 'housing market data',
    'socio-economic housing', 'ICONYCS', 'PDaaS', 'property data as a service',
  ],
  authors: [{ name: 'ICONYCS Housing Analytics' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iconycs.com',
    siteName: 'ICONYCS',
    title: 'ICONYCS — Housing Analytics & Homeowner Demographics',
    description: '130M+ property records. 187M+ owner profiles. The socio-economics of home ownership.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICONYCS — Housing Analytics',
    description: '130M+ properties. 187M+ owner profiles. The socio-economics of home ownership.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ICONYCS',
              description: 'Housing Analytics and Homeowner Demographics',
              url: 'https://iconycs.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '300 Spectrum Center Drive, Ste 400',
                addressLocality: 'Irvine',
                addressRegion: 'CA',
                postalCode: '92618',
                addressCountry: 'US',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-760-599-1261',
                contactType: 'sales',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
