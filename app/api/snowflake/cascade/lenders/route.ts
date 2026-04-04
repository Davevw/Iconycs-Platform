/**
 * GET /api/snowflake/cascade/lenders
 * Top lenders with count + avg loan by geography/filters.
 * Accepts: state, county, city, zip, loan_type, ethnicity
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryCascadeLenders } from '@/lib/snowflake-queries';
import type { CascadeFilters } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;

    const filters: CascadeFilters = {
      state:     p.get('state')     ?? undefined,
      county:    p.get('county')    ?? undefined,
      city:      p.get('city')      ?? undefined,
      zip:       p.get('zip')       ?? undefined,
      loan_type: p.get('loan_type') ?? undefined,
      ethnicity: p.get('ethnicity') ?? undefined,
    };

    const sql = queryCascadeLenders(filters);
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
    console.error('[/api/snowflake/cascade/lenders]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
