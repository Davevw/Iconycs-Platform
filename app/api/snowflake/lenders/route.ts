/**
 * GET /api/snowflake/lenders?state=CA&city=&loan_type=FHA&limit=10
 * Returns lender analysis from VW_LENDER_ANALYSIS with optional filters.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryTopLenders } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state     = searchParams.get('state')     ?? undefined;
    const city      = searchParams.get('city')      ?? undefined;
    const zip       = searchParams.get('zip')       ?? undefined;
    const loan_type = searchParams.get('loan_type') ?? undefined;
    const limitStr  = searchParams.get('limit');
    const limit     = limitStr ? parseInt(limitStr, 10) : 10;

    const sql = queryTopLenders({ state, city, zip, loan_type, limit });
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
    console.error('[/api/snowflake/lenders]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
