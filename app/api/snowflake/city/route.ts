/**
 * GET /api/snowflake/city?state=CA&city=LOS+ANGELES&county=LOS+ANGELES
 * Returns city-level data from VW_DASHBOARD_CITY
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryCity } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state  = searchParams.get('state')  ?? undefined;
    const city   = searchParams.get('city')   ?? undefined;
    const county = searchParams.get('county') ?? undefined;

    const sql = queryCity({ state, city, county });
    const result = await executeQuery(sql);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data ?? [],
      rowCount: result.rowCount,
      executionTime: result.executionTime,
    });
  } catch (err: any) {
    console.error('[/api/snowflake/city]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
