/**
 * GET /api/v1/market-overlay
 *
 * Built 2026-10-01 for ReGround Asset Resolution's Flyover "Housing Market" map view
 * (David, 18:23 PDT: show ICONYCS housing data as an overlay on the map that already
 * plots the construction projects — NOT matched to the pins; the pins are current
 * construction, the ICONYCS feed is recorded sales and assessor rolls).
 *
 * One call, every state, aggregates only:
 *   records, avgValue, ownerOccupiedPct, totalLiens,
 *   highLtvPct (liens at >=80% LTV), veryHighLtvPct (>=90%), ltvTiers[]
 *
 * avgMortgage is deliberately NOT returned: VW_DASHBOARD_STATE.AVG_MORTGAGE carries raw
 * MTG1_AMOUNT outliers (cells averaging > $1B — source-file garbage) that pull TX to $3.3M.
 * AVG_VALUE is clean (trimmed vs. raw differ by 0.2%).
 *
 * Three full scans of the state rollups (~45s + 20s + 7s cold). The caller caches the
 * whole payload for 7 days; nobody should call this on a page load.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import {
  queryMarketOverlayStates,
  queryMarketOverlayOccupancy,
  queryMarketOverlayLtv,
} from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

export interface StateMarketOverlay {
  state: string;
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

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;
  const t0 = Date.now();

  try {
    const [states, occ, ltv] = await Promise.all([
      executeQuery(queryMarketOverlayStates()),
      executeQuery(queryMarketOverlayOccupancy()),
      executeQuery(queryMarketOverlayLtv()),
    ]);
    for (const r of [states, occ, ltv]) if (!r.success) throw new Error(r.error ?? 'Query failed');

    const out = new Map<string, StateMarketOverlay>();
    for (const row of (states.data ?? []) as any[]) {
      const st = String(row.STATE ?? '').toUpperCase();
      if (st.length !== 2) continue;
      out.set(st, {
        state: st,
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
      const st = String(row.STATE ?? '').toUpperCase();
      const o = out.get(st);
      if (!o) continue;
      const own = Number(row.OWNER_OCC ?? 0);
      const non = Number(row.NON_OWNER_OCC ?? 0);
      o.ownerOccupiedPct = pct(own, own + non);
      o.totalLiens = num(row.TOTAL_LIENS);
    }
    const tiersBy = new Map<string, { tier: string; count: number }[]>();
    for (const row of (ltv.data ?? []) as any[]) {
      const st = String(row.STATE ?? '').toUpperCase();
      if (!tiersBy.has(st)) tiersBy.set(st, []);
      tiersBy.get(st)!.push({ tier: String(row.LTV_TIER), count: Number(row.RECORDS ?? 0) });
    }
    for (const [st, tiers] of tiersBy) {
      const o = out.get(st);
      if (!o) continue;
      const total = tiers.reduce((s, t) => s + t.count, 0);
      tiers.sort((a, b) => tierRank(a.tier) - tierRank(b.tier));
      o.ltvTiers = tiers.map((t) => ({ ...t, pct: pct(t.count, total) ?? 0 }));
      o.highLtvPct = pct(tiers.filter((t) => isHigh(t.tier)).reduce((s, t) => s + t.count, 0), total);
      o.veryHighLtvPct = pct(tiers.filter((t) => isVeryHigh(t.tier)).reduce((s, t) => s + t.count, 0), total);
    }

    const list = [...out.values()].sort((a, b) => a.state.localeCompare(b.state));
    const totalRecords = list.reduce((s, o) => s + o.records, 0);
    const national = {
      records: totalRecords,
      avgValue:
        list.reduce((s, o) => s + (o.avgValue ?? 0) * o.records, 0) / Math.max(1, totalRecords),
    };

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      source: {
        name: 'ICONYCS licensed property + household feed (county assessor + recorder rollups)',
        note: 'State-level aggregates. Owner-occupancy from the assessor occupancy flag; LTV from recorded first liens against assessed value.',
      },
      national,
      states: list,
      executionTime: Date.now() - t0,
    });
    applyHeaders(res);
    res.headers.set('Cache-Control', 'private, max-age=86400');
    return res;
  } catch (err: any) {
    console.error('[/api/v1/market-overlay]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
