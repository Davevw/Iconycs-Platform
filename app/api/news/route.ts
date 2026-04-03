/**
 * GET /api/news
 * 
 * Aggregates housing news from multiple sources.
 * In production, this would use real RSS feeds and news APIs.
 * Currently returns curated housing market news.
 */

import { NextRequest, NextResponse } from 'next/server';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  summary?: string;
}

// RSS feed URLs for housing news (would be fetched in production)
const NEWS_SOURCES = [
  { name: 'HUD.gov', feedUrl: 'https://www.hud.gov/rss/HUDnews' },
  { name: 'NAR', feedUrl: 'https://www.nar.realtor/newsroom/rss' },
  { name: 'Census Bureau', feedUrl: 'https://www.census.gov/newsroom/press-releases.xml' },
  { name: 'FHFA', feedUrl: 'https://www.fhfa.gov/rss/news.xml' },
];

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from RSS feeds:
    // const feeds = await Promise.all(NEWS_SOURCES.map(s => fetchRSS(s.feedUrl)));
    
    // For now, return structured news data
    // The frontend News module uses this to display live feeds
    const news: NewsItem[] = [
      {
        id: '1',
        title: 'Mortgage Rates Hold Steady at 6.2% as Fed Signals Patience on Rate Cuts',
        source: 'Reuters',
        url: 'https://reuters.com',
        publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        category: 'Rates',
        summary: 'The Federal Reserve held rates steady, signaling a data-dependent approach to future cuts.',
      },
      {
        id: '2',
        title: 'First-Time Homebuyer Activity Surges in Southern Markets',
        source: 'NAR',
        url: 'https://nar.realtor',
        publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        category: 'Buyers',
      },
      {
        id: '3',
        title: 'Urban-to-Suburban Migration Trend Continues Into 2026',
        source: 'Bloomberg',
        url: 'https://bloomberg.com',
        publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
        category: 'Migration',
      },
      {
        id: '4',
        title: 'Housing Inventory Reaches Highest Level Since 2020',
        source: 'Zillow',
        url: 'https://zillow.com',
        publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
        category: 'Supply',
      },
      {
        id: '5',
        title: 'HUD Announces New Fair Lending Compliance Framework',
        source: 'HUD.gov',
        url: 'https://hud.gov',
        publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        category: 'Policy',
      },
      {
        id: '6',
        title: 'Commercial-to-Residential Conversions Accelerate Nationwide',
        source: 'WSJ',
        url: 'https://wsj.com',
        publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        category: 'Trends',
      },
    ];

    return NextResponse.json({
      success: true,
      news,
      sources: NEWS_SOURCES.map(s => s.name),
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
