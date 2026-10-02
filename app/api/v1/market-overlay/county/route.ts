/**
 * GET /api/v1/market-overlay/county?state=XX
 *
 * Built 2026-10-02 as the county-grain drill-down for ReGround Asset Resolution's
 * Flyover "Housing Market" map (David, 07:20 PDT: click a state -> county shading
 * for that state only, lazy-fetched, same visual language as the national overlay).
 *
 * One state at a time, by design: every query below carries a WHERE STATE = ?
 * clause, so this never scans the whole country. Shape mirrors
 * /api/v1/market-overlay exactly (records, avgValue, ownerOccupiedPct, totalLiens,
 * highLtvPct, veryHighLtvPct, ltvTiers[]) but keyed by county FIPS instead of state,
 * plus a county display name from the shared FIPS lookup.
 *
 * avgMortgage is deliberately NOT returned, same reasoning as the state route:
 * the raw mortgage field carries source-file outliers; AVG_VALUE off
 * VW_DASHBOARD_COUNTY is the clean figure.
 *
 * Aggregates only. No parcel, owner, or household field is read, stored, or
 * returned.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import {
  queryMarketOverlayCounties,
  queryMarketOverlayCountyOccupancy,
  queryMarketOverlayCountyLtv,
} from '@/lib/snowflake-queries';
import { getCountyName } from '@/lib/county-fips';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

export interface CountyMarketOverlay {
  state: string;
  countyFips: string;
  countyName: string;
  records: number;
  avgValue: number | null;
  ownerOccupiedPct: number | null;
  totalLiens: number | null;
  highLtvPct: number | null;
  veryHighLtvPct: number | null;
  ltvTiers: { tier: string; count: number; pct: number }[];
}

const LTV_ORDER = ['<=60%', '60-65%', '65-70%', '70-75%', '75-80%', '80-85%', '85-90%', '90-95%', '95-97%', 'Over 97%'];
const tierRank = (t: string) => {
  const i = LTV_ORDER.findIndex((p) => t.startsWith(p));
  return i === -1 ? 99 : i;
};
const isHigh = (t: string) => tierRank(t) >= 5;
const isVeryHigh = (t: string) => tierRank(t) >= 7;
const num = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number(v));
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : null);
const fips3 = (v: unknown): string => String(v ?? '').trim().padStart(3, '0');

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;
  const t0 = Date.now();

  const stateParam = request.nextUrl.searchParams.get('state') ?? '';
  const state = stateParam.toUpperCase().replace(/[^A-Z]/g, '');
  if (state.length !== 2) {
    return errorResponse('Query param "state" must be a 2-letter state code, e.g. ?state=GA', 400);
  }

  try {
    const [counties, occ, ltv] = await Promise.all([
      executeQuery(queryMarketOverlayCounties(state)),
      executeQuery(queryMarketOverlayCountyOccupancy(state)),
      executeQuery(queryMarketOverlayCountyLtv(state)),
    ]);
    for (const r of [counties, occ, ltv]) if (!r.success) throw new Error(r.error ?? 'Query failed');

    const out = new Map<string, CountyMarketOverlay>();
    for (const row of (counties.data ?? []) as any[]) {
      const fips = fips3(row.CNTYCD);
      if (!fips || fips === '000') continue;
      out.set(fips, {
        state,
        countyFips: fips,
        countyName: getCountyName(state, fips),
        records: Number(row.RECORDS ?? 0),
        avgValue: num(row.AVG_VALUE),
        ownerOccupiedPct: null,
        totalLiens: null,
        highLtvPct: null,
        veryHighLtvPct: null,
        ltvTiers: [],
      });
    }
    for (const row of (occ.data ?? []) as any[]) {
      const fips = fips3(row.CNTYCD);
      const o = out.get(fips);
      if (!o) continue;
      const own = Number(row.OWNER_OCC ?? 0);
      const non = Number(row.NON_OWNER_OCC ?? 0);
      o.ownerOccupiedPct = pct(own, own + non);
      o.totalLiens = num(row.TOTAL_LIENS);
    }
    const tiersBy = new Map<string, { tier: string; count: number }[]>();
    for (const row of (ltv.data ?? []) as any[]) {
      const fips = fips3(row.CNTYCD);
      if (!tiersBy.has(fips)) tiersBy.set(fips, []);
      tiersBy.get(fips)!.push({ tier: String(row.LTV_TIER), count: Number(row.RECORDS ?? 0) });
    }
    for (const [fips, tiers] of tiersBy) {
      const o = out.get(fips);
      if (!o) continue;
      const total = tiers.reduce((s, t) => s + t.count, 0);
      tiers.sort((a, b) => tierRank(a.tier) - tierRank(b.tier));
      o.ltvTiers = tiers.map((t) => ({ ...t, pct: pct(t.count, total) ?? 0 }));
      o.highLtvPct = pct(tiers.filter((t) => isHigh(t.tier)).reduce((s, t) => s + t.count, 0), total);
      o.veryHighLtvPct = pct(tiers.filter((t) => isVeryHigh(t.tier)).reduce((s, t) => s + t.count, 0), total);
    }

    const list = [...out.values()].sort((a, b) => a.countyFips.localeCompare(b.countyFips));
    const totalRecords = list.reduce((s, o) => s + o.records, 0);

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      source: {
        name: 'ICONYCS licensed property + household feed (county assessor + recorder rollups)',
        note: 'County-level aggregates for a single state. Owner-occupancy from the assessor occupancy flag; LTV from recorded first liens against assessed value.',
      },
      state,
      summary: { records: totalRecords, counties: list.length },
      counties: list,
      executionTime: Date.now() - t0,
    });
    applyHeaders(res);
    res.headers.set('Cache-Control', 'private, max-age=86400');
    return res;
  } catch (err: any) {
    console.error('[/api/v1/market-overlay/county]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
