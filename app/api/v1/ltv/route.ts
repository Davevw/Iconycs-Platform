/**
 * GET /api/v1/ltv
 * Public API  -  LTV tier distribution
 * Query params: state, city, zip
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryLTV } from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') ?? undefined;
    const city  = searchParams.get('city')  ?? undefined;
    const zip   = searchParams.get('zip')   ?? undefined;

    const sql = queryLTV({ state, city, zip });
    const result = await executeQuery(sql);

    if (!result.success) {
      return errorResponse(result.error ?? 'Query failed');
    }

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      geography: zip ?? city ?? state ?? 'National',
      data: result.data ?? [],
      rowCount: result.rowCount,
    });

    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error('[/api/v1/ltv]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
