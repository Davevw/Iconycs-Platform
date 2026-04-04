/**
 * GET /api/snowflake/county?state=CA&county=LOS+ANGELES
 * Returns county-level data from VW_DASHBOARD_COUNTY
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryCounty } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state  = searchParams.get('state')  ?? undefined;
    const county = searchParams.get('county') ?? undefined;

    const sql = queryCounty({ state, county });
    const result = await executeQuery(sql);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: result.data ?? [],
      rowCount: result.rowCount,
      executionTime: result.executionTime,
    });
    response.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    return response;
  } catch (err: any) {
    console.error('[/api/snowflake/county]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
