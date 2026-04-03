/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img1.wsimg.com' },
      { protocol: 'https', hostname: 'iconycs.com' },
    ],
  },
  // Redirect www to apex
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.iconycs.com' }],
        destination: 'https://iconycs.com/:path*',
        permanent: true,
      },
    ];
  },
  // SEO-friendly headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
