/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress workspace root warning when multiple lockfiles exist in parent dirs
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img1.wsimg.com' },
      { protocol: 'https', hostname: 'iconycs.com' },
    ],
  },
  // Redirect www to apex
  // Redirect handled by Vercel domain config — no Next.js redirect needed
  // (was causing redirect loop: Vercel sends apex→www, Next.js sent www→apex)
  // Security headers + crawler blocking for a private, passcode-gated site.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          // Server-side crawler/AI directive — does not rely on HTML parsing.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, max-snippet:0, max-image-preview:none' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
