/**
 * GET /api/snowflake/ltv?state=CA&city=&loan_type=CONV
 * Returns LTV tier distribution from VW_LTV_TIERS (FNMA tier buckets).
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryLTV } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state     = searchParams.get('state')     ?? undefined;
    const city      = searchParams.get('city')      ?? undefined;
    const zip       = searchParams.get('zip')       ?? undefined;
    const ethnicity = searchParams.get('ethnicity') ?? undefined;
    const loan_type = searchParams.get('loan_type') ?? undefined;

    const sql = queryLTV({ state, city, zip, ethnicity, loan_type });
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
    console.error('[/api/snowflake/ltv]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
