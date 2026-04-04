/**
 * GET /api/v1/occupancy
 * Public API  -  Owner/non-owner occupancy split
 * Query params: state, city, zip
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryOccupancy } from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  try {
    const p = request.nextUrl.searchParams;
    const filters = {
      state: p.get('state') ?? undefined,
      city:  p.get('city')  ?? undefined,
      zip:   p.get('zip')   ?? undefined,
    };

    const result = await executeQuery(queryOccupancy(filters));
    if (!result.success) {
      return errorResponse(result.error ?? 'Query failed');
    }

    const rows = result.data ?? [];

    const aggregated: Record<string, number> = {};
    for (const r of rows as any[]) {
      const raw = r.OCCUPANCY_STATUS as string | null;
      let label: string;
      if (raw === 'Owner Occupied') {
        label = 'Owner Occupied';
      } else if (raw === 'Absentee Owner' || raw === 'Situs From Sale') {
        label = 'Non-Owner Occupied';
      } else {
        label = raw ?? 'Unknown';
      }
      aggregated[label] = (aggregated[label] ?? 0) + Number(r.RECORD_COUNT ?? 0);
    }

    const mapped = Object.entries(aggregated)
      .map(([label, count]) => ({ label, count, pct: 0 }))
      .sort((a, b) => b.count - a.count);

    const total = mapped.reduce((s, r) => s + r.count, 0);
    const withPct = mapped.map(r => ({
      ...r,
      pct: total > 0 ? Math.round((r.count / total) * 10000) / 100 : 0,
    }));

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      geography: filters.zip ?? filters.city ?? filters.state ?? 'National',
      data: withPct,
      rowCount: result.rowCount,
    });

    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error('[/api/v1/occupancy]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
