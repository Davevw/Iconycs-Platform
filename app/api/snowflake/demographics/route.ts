/**
 * GET /api/snowflake/demographics
 * Full demographics deep-dive: gender, marital status, education, income, wealth, ethnicity.
 * Joins VW_RESIDENTIAL_PROP + NARC3.
 * Accepts: state, county, city, zip
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryDemographics } from '@/lib/snowflake-queries';
import type { CascadeFilters } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─── Aggregation helpers ───────────────────────────────────────────────────

interface RawRow {
  GENDER?: string;
  MARITALSTAT?: string;
  EDUCATION_LEVEL?: string;
  INCOME_TIER?: string;
  WEALTH_SCORE?: string;
  ETHNICITYCD?: string;
  ETHNICITY_DESC?: string;
  RECORD_COUNT: number;
}

function aggregate(rows: RawRow[], key: keyof RawRow): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const val = String(row[key] ?? 'Unknown');
    map.set(val, (map.get(val) ?? 0) + Number(row.RECORD_COUNT));
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;

    const filters: CascadeFilters = {
      state:  p.get('state')  ?? undefined,
      county: p.get('county') ?? undefined,
      city:   p.get('city')   ?? undefined,
      zip:    p.get('zip')    ?? undefined,
    };

    const sql = queryDemographics(filters);
    const result = await executeQuery(sql);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    const rows: RawRow[] = result.data ?? [];

    return NextResponse.json({
      success: true,
      data: {
        gender:    aggregate(rows, 'GENDER'),
        marital:   aggregate(rows, 'MARITALSTAT'),
        education: aggregate(rows, 'EDUCATION_LEVEL'),
        income:    aggregate(rows, 'INCOME_TIER'),
        wealth:    aggregate(rows, 'WEALTH_SCORE'),
        ethnicity: aggregate(rows, 'ETHNICITY_DESC'),
      },
      rowCount: result.rowCount,
      executionTime: result.executionTime,
    });
  } catch (err: any) {
    console.error('[/api/snowflake/demographics]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
