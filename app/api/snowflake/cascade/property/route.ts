/**
 * GET /api/snowflake/cascade/property
 * Property cascade dimensions from VW_CASCADE_PROPERTY.
 * Accepts: state, county, city, zip, loan_type, ltv_tier, value_tier,
 *          occupancy, attached_detached, ownership_duration
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryCascadeProperty } from '@/lib/snowflake-queries';
import type { CascadeFilters } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;

    const filters: CascadeFilters = {
      state:              p.get('state')              ?? undefined,
      county:             p.get('county')             ?? undefined,
      city:               p.get('city')               ?? undefined,
      zip:                p.get('zip')                ?? undefined,
      loan_type:          p.get('loan_type')          ?? undefined,
      ltv_tier:           p.get('ltv_tier')           ?? undefined,
      value_tier:         p.get('value_tier')         ?? undefined,
      occupancy:          p.get('occupancy')          ?? undefined,
      attached_detached:  p.get('attached_detached')  ?? undefined,
      ownership_duration: p.get('ownership_duration') ?? undefined,
    };

    const sql = queryCascadeProperty(filters);
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
    console.error('[/api/snowflake/cascade/property]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
