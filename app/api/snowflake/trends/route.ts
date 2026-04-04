/**
 * GET /api/snowflake/trends?state=CA&time_period=2020-2024
 * Returns recording count by year for trend chart.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryTrends } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state       = searchParams.get('state')       ?? undefined;
    const city        = searchParams.get('city')        ?? undefined;
    const zip         = searchParams.get('zip')         ?? undefined;
    const time_period = searchParams.get('time_period') ?? undefined;

    const sql = queryTrends({ state, city, zip, time_period });
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
    console.error('[/api/snowflake/trends]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
