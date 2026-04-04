/**
 * GET /api/snowflake/cascade/ownership
 * Ownership / demographic cascade from VW_CASCADE_OWNERSHIP.
 * Accepts: state, county, city, zip, ethnicity, gender, marital_status,
 *          education, income_tier
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryCascadeOwnership } from '@/lib/snowflake-queries';
import type { CascadeFilters } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;

    const filters: CascadeFilters = {
      state:          p.get('state')          ?? undefined,
      county:         p.get('county')         ?? undefined,
      city:           p.get('city')           ?? undefined,
      zip:            p.get('zip')            ?? undefined,
      ethnicity:      p.get('ethnicity')      ?? undefined,
      gender:         p.get('gender')         ?? undefined,
      marital_status: p.get('marital_status') ?? undefined,
      education:      p.get('education')      ?? undefined,
      income_tier:    p.get('income_tier')    ?? undefined,
    };

    const sql = queryCascadeOwnership(filters);
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
    console.error('[/api/snowflake/cascade/ownership]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
