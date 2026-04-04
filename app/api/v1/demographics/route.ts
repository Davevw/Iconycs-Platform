/**
 * GET /api/v1/demographics
 * Public API — Demographic breakdown for geography
 * Query params: state, city, zip
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryDemographics } from '@/lib/snowflake-queries';
import type { CascadeFilters } from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

interface RawRow {
  GENDER?: string;
  MARITALSTAT?: string;
  EDUCATION_LEVEL?: string;
  INCOME_TIER?: string;
  WEALTH_SCORE?: string;
  ETHNICITY_DESC?: string;
  RECORD_COUNT?: number;
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

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  try {
    const p = request.nextUrl.searchParams;

    const filters: CascadeFilters = {
      state: p.get('state') ?? undefined,
      city:  p.get('city')  ?? undefined,
      zip:   p.get('zip')   ?? undefined,
    };

    const sql = queryDemographics(filters);
    const result = await executeQuery(sql);

    if (!result.success) {
      return errorResponse(result.error ?? 'Query failed');
    }

    const rows: RawRow[] = result.data ?? [];

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      geography: filters.zip ?? filters.city ?? filters.state ?? 'National',
      data: {
        gender:    aggregate(rows, 'GENDER'),
        marital:   aggregate(rows, 'MARITALSTAT'),
        education: aggregate(rows, 'EDUCATION_LEVEL'),
        income:    aggregate(rows, 'INCOME_TIER'),
        wealth:    aggregate(rows, 'WEALTH_SCORE'),
        ethnicity: aggregate(rows, 'ETHNICITY_DESC'),
      },
      rowCount: result.rowCount,
    });

    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error('[/api/v1/demographics]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
