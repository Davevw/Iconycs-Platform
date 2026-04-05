import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://iconycs.com'),
  title: {
    default: 'ICONYCS | 109M Properties. Every U.S. Neighborhood. Real Data.',
    template: '%s | ICONYCS',
  },
  description: 'AI-powered housing analytics platform. 109M+ residential properties, 73.6M+ homeowner-occupied homeowners, and census-tract demographics across all 50 states -- built for capital markets.',
  keywords: [
    'housing analytics', 'homeowner demographics', 'property data', 'real estate analytics',
    'home ownership data', 'demographic analysis', 'property records', 'housing market data',
    'capital markets housing data', 'ICONYCS', 'PDaaS', 'property data as a service',
    'census tract analytics', 'fair lending analytics',
  ],
  authors: [{ name: 'ICONYCS Housing Intelligence' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iconycs.com',
    siteName: 'ICONYCS',
    title: 'ICONYCS | 109M Properties. Every U.S. Neighborhood. Real Data.',
    description: 'AI-powered housing analytics platform. Census, demographics, and ownership data at the census-tract level -- built for capital markets.',
    images: [{ url: 'https://vdgxbfumlysatthimpcb.supabase.co/storage/v1/object/public/public/og-image.png', width: 1536, height: 1024, alt: 'ICONYCS - 109M+ U.S. Property Records, Housing Intelligence Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICONYCS | 109M Properties. Every U.S. Neighborhood. Real Data.',
    description: 'AI-powered housing analytics. 109M+ residential properties, 73.6M+ homeowner-occupied homeowners, census-tract demographics -- built for capital markets.',
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
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
              description: 'Housing Intelligence and Homeowner Demographics',
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
