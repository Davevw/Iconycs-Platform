/**
 * Shared helpers for ICONYCS Public API v1
 */

import { NextRequest, NextResponse } from 'next/server';

export const API_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'X-API-Key, Content-Type',
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Remaining': '99',
  'X-ICONYCS-Version': '1.0',
  'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
};

export function applyHeaders(res: NextResponse): NextResponse {
  Object.entries(API_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function checkApiKey(request: NextRequest): NextResponse | null {
  const key = request.headers.get('X-API-Key');
  if (!key || key.trim() === '') {
    const res = NextResponse.json(
      {
        version: '1.0',
        error: 'Unauthorized',
        message: 'Missing X-API-Key header. Request API access at mailto:info@iconycs.com or visit iconycs.com/api-docs',
      },
      { status: 401 }
    );
    applyHeaders(res);
    return res;
  }
  return null;
}

export function errorResponse(message: string, status = 500): NextResponse {
  const res = NextResponse.json({ version: '1.0', error: message }, { status });
  applyHeaders(res);
  return res;
}

export function optionsResponse(): NextResponse {
  const res = new NextResponse(null, { status: 204 });
  applyHeaders(res);
  return res;
}
