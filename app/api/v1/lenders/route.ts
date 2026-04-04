/**
 * GET /api/v1/lenders
 * Public API — Top lenders by volume
 * Query params: state, city, limit (default 10)
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryTopLenders } from '@/lib/snowflake-queries';
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
    const state    = searchParams.get('state') ?? undefined;
    const city     = searchParams.get('city')  ?? undefined;
    const limitStr = searchParams.get('limit');
    const limit    = limitStr ? Math.min(parseInt(limitStr, 10) || 10, 100) : 10;

    const sql = queryTopLenders({ state, city, limit });
    const result = await executeQuery(sql);

    if (!result.success) {
      return errorResponse(result.error ?? 'Query failed');
    }

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      geography: city ?? state ?? 'National',
      data: result.data ?? [],
      rowCount: result.rowCount,
    });

    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error('[/api/v1/lenders]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
