/**
 * GET /api/v1/market-context?zips=77494,78701,...   (max 50 per call)
 *
 * Built 2026-10-01 for ReGround Asset Resolution's Flyover "Market" block (David's Layer 1).
 * One batched call returns, per ZIP, an aggregate-only market snapshot from the ICONYCS
 * property + household feed:
 *
 *   records, avgValue, avgMortgage, avgSqft, totalLiens, ownerOccupiedPct (assessor flag),
 *   propertyMix[], valueTierMix[], tenureMix[], incomeMix[], ethnicityMix[], loanMix[],
 *   ltvTiers[] (+ highLtvPct = share of liens at >=80% LTV)
 *
 * Aggregates only. Nothing here descends to a parcel, an owner, or a household — the
 * ZIP rollups (VW_DASHBOARD_ZIP, VW_CASCADE_PROPERTY, VW_LTV_TIERS) are the only sources. Cells with
 * fewer than MIN_CELL records are dropped from the mixes so small ZIPs can't be reverse-read.
 *
 * The caller (ReGround's `iconycs-market-context` Edge Function) caches results per ZIP in
 * its own `market.zip_context` table with a 7-day TTL, so a given ZIP hits Snowflake about
 * once a week regardless of how many subscribers open its popup.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import {
  queryMarketContextZip,
  queryMarketContextMix,
  queryMarketContextLtv,
  queryMarketContextOccupancy,
  queryMarketContextCascadeMix,
} from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_ZIPS = 50;
const MIN_CELL = 5;

interface Mix { label: string; count: number; pct: number }
interface LtvTier { tier: string; count: number; pct: number; avgLoan: number | null }

export interface ZipMarketContext {
  zip: string;
  state: string | null;
  city: string | null;
  records: number;
  avgValue: number | null;
  avgMortgage: number | null;
  avgSqft: number | null;
  totalLiens: number | null;
  ownerOccupiedPct: number | null;
  propertyMix: Mix[];
  valueTierMix: Mix[];
  tenureMix: Mix[];
  incomeMix: Mix[];
  ethnicityMix: Mix[];
  loanMix: Mix[];
  ltvTiers: LtvTier[];
  highLtvPct: number | null;
}

const LTV_ORDER = ['<=60%', '60-65%', '65-70%', '70-75%', '75-80%', '80-85%', '85-90%', '90-95%', '95-97%', 'Over 97%'];
function ltvRank(tier: string): number {
  const i = LTV_ORDER.findIndex(p => tier.startsWith(p));
  return i === -1 ? 99 : i;
}
function isHighLtv(tier: string): boolean {
  return ltvRank(tier) >= 5 && ltvRank(tier) !== 99;
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function round(v: number | null, places = 0): number | null {
  if (v === null) return null;
  const f = 10 ** places;
  return Math.round(v * f) / f;
}

function toMix(rows: any[], zip: string): Mix[] {
  const own = rows.filter(r => r.ZIP === zip && String(r.LABEL ?? '') !== '' && Number(r.RECORD_COUNT) >= MIN_CELL);
  const total = own.reduce((s, r) => s + Number(r.RECORD_COUNT), 0);
  return own
    .map(r => ({
      label: String(r.LABEL),
      count: Number(r.RECORD_COUNT),
      pct: total > 0 ? Math.round((Number(r.RECORD_COUNT) / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  const raw = request.nextUrl.searchParams.get('zips') ?? '';
  const zips = Array.from(new Set(raw.split(',').map(z => z.trim()).filter(z => /^\d{5}$/.test(z))));
  if (zips.length === 0) return errorResponse('provide zips=<5-digit ZIP>[,...]', 400);
  if (zips.length > MAX_ZIPS) return errorResponse(`at most ${MAX_ZIPS} zips per call`, 400);

  try {
    const started = Date.now();
    const [base, occ, prop, valueTier, tenure, income, eth, loan, ltv] = await Promise.all([
      executeQuery(queryMarketContextZip(zips)),
      executeQuery(queryMarketContextOccupancy(zips)),
      executeQuery(queryMarketContextMix(zips, 'PROPERTY_CATEGORY')),
      executeQuery(queryMarketContextCascadeMix(zips, 'MARKET_VALUE_TIER')),
      executeQuery(queryMarketContextCascadeMix(zips, 'OWNERSHIP_DURATION')),
      executeQuery(queryMarketContextMix(zips, 'INCOME_TIER')),
      executeQuery(queryMarketContextMix(zips, 'ETHNICITY')),
      executeQuery(queryMarketContextMix(zips, 'MTG1_LOAN_CATEGORY')),
      executeQuery(queryMarketContextLtv(zips)),
    ]);
    if (!base.success) return errorResponse(base.error ?? 'Query failed');

    const baseRows: any[] = base.data ?? [];
    const occRows: any[] = occ.success ? occ.data ?? [] : [];
    const propRows = prop.success ? prop.data ?? [] : [];
    const valueTierRows = valueTier.success ? valueTier.data ?? [] : [];
    const tenureRows = tenure.success ? tenure.data ?? [] : [];
    const incomeRows = income.success ? income.data ?? [] : [];
    const ethRows = eth.success ? eth.data ?? [] : [];
    const loanRows = loan.success ? loan.data ?? [] : [];
    const ltvRows: any[] = ltv.success ? ltv.data ?? [] : [];

    const out: ZipMarketContext[] = [];
    for (const zip of zips) {
      const b = baseRows.find(r => r.ZIP === zip);
      if (!b) continue;
      const records = Number(b.RECORD_COUNT ?? 0);
      const o = occRows.find(r => r.ZIP === zip);
      const owner = num(o?.OWNER_OCC) ?? 0;
      const nonOwner = num(o?.NON_OWNER_OCC) ?? 0;
      const occKnown = owner + nonOwner;

      const tiers = ltvRows
        .filter(r => r.ZIP === zip && Number(r.RECORD_COUNT) >= MIN_CELL)
        .map(r => ({ tier: String(r.LTV_TIER), count: Number(r.RECORD_COUNT), avgLoan: round(num(r.AVG_LOAN_AMOUNT)) }))
        .sort((a, b2) => ltvRank(a.tier) - ltvRank(b2.tier));
      const ltvTotal = tiers.reduce((s, t) => s + t.count, 0);
      const highLtv = tiers.filter(t => isHighLtv(t.tier)).reduce((s, t) => s + t.count, 0);

      out.push({
        zip,
        state: b.STATE ?? null,
        city: b.CITY ?? null,
        records,
        avgValue: round(num(b.AVG_VALUE)),
        avgMortgage: round(num(b.AVG_MORTGAGE)),
        avgSqft: round(num(b.AVG_SQFT)),
        totalLiens: round(num(o?.TOTAL_LIENS)),
        ownerOccupiedPct: occKnown >= MIN_CELL ? round((owner / occKnown) * 100, 1) : null,
        propertyMix: toMix(propRows, zip),
        valueTierMix: toMix(valueTierRows, zip),
        tenureMix: toMix(tenureRows, zip),
        incomeMix: toMix(incomeRows, zip),
        ethnicityMix: toMix(ethRows, zip),
        loanMix: toMix(loanRows, zip),
        ltvTiers: tiers.map(t => ({ ...t, pct: ltvTotal > 0 ? Math.round((t.count / ltvTotal) * 1000) / 10 : 0 })),
        highLtvPct: ltvTotal >= MIN_CELL ? round((highLtv / ltvTotal) * 100, 1) : null,
      });
    }

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      source: 'ICONYCS property + household feed, ZIP rollups',
      requested: zips.length,
      returned: out.length,
      missing: zips.filter(z => !out.some(o => o.zip === z)),
      executionTime: Date.now() - started,
      data: out,
    });
    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error('[/api/v1/market-context]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
