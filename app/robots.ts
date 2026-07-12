import { MetadataRoute } from 'next';

// Private, passcode-gated site: instruct all crawlers to stay out entirely,
// and explicitly name common AI/data-scraping bots.
export default function robots(): MetadataRoute.Robots {
  const blockedBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'CCBot',
    'Google-Extended',
    'Applebot-Extended',
    'PerplexityBot',
    'Perplexity-User',
    'Amazonbot',
    'Bytespider',
    'meta-externalagent',
    'FacebookBot',
    'cohere-ai',
    'Diffbot',
    'omgili',
    'omgilibot',
    'ImagesiftBot',
    'DataForSeoBot',
    'AhrefsBot',
    'SemrushBot',
    'MJ12bot',
    'dotbot',
  ];

  return {
    rules: [
      // Everything is private — no crawler should index any path.
      { userAgent: '*', disallow: '/' },
      // Explicit deny for known AI training / scraping agents.
      ...blockedBots.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    // No sitemap published for a private site.
  };
}
