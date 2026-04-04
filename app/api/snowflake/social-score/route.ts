/**
 * GET /api/snowflake/social-score
 * Computes the Social Housing Score (0-100) for any geography.
 * Formula:
 *   - Ethnic diversity index    (25 pts) — Shannon entropy of ethnicity distribution
 *   - Income diversity          (25 pts) — Shannon entropy of income tiers
 *   - LTV distribution          (25 pts) — higher low-LTV share = higher score
 *   - Owner-occupancy rate      (25 pts) — higher owner-occ = higher score
 *
 * Accepts: state, county, city, zip
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import {
  querySocialHousingComponents,
  querySocialHousingEthnicity,
  querySocialHousingIncome,
} from '@/lib/snowflake-queries';
import type { GeoFilters } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

// ─── Shannon entropy (0-1) ────────────────────────────────────────────────

function shannonEntropy(counts: number[]): number {
  const total = counts.reduce((s, c) => s + c, 0);
  if (total === 0) return 0;
  let entropy = 0;
  for (const c of counts) {
    if (c <= 0) continue;
    const p = c / total;
    entropy -= p * Math.log2(p);
  }
  // Normalize by log2(n) so max entropy = 1
  const maxEntropy = Math.log2(counts.length || 1);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;
    const filters: GeoFilters = {
      state:  p.get('state')  ?? undefined,
      county: p.get('county') ?? undefined,
      city:   p.get('city')   ?? undefined,
      zip:    p.get('zip')    ?? undefined,
    };

    // Run three queries in parallel
    const [propResult, ethResult, incomeResult] = await Promise.all([
      executeQuery(querySocialHousingComponents(filters)),
      executeQuery(querySocialHousingEthnicity(filters)),
      executeQuery(querySocialHousingIncome(filters)),
    ]);

    if (!propResult.success || !ethResult.success || !incomeResult.success) {
      const errors = [propResult.error, ethResult.error, incomeResult.error].filter(Boolean);
      return NextResponse.json({ success: false, error: errors.join('; ') }, { status: 500 });
    }

    const prop: any = propResult.data?.[0] ?? {};
    const total = Number(prop.TOTAL_RECORDS ?? 0);

    // ── LTV Score (0-25) ──────────────────────────────────────────────────
    const ltvLow  = Number(prop.LTV_LOW ?? 0);
    const ltvMid  = Number(prop.LTV_MID ?? 0);
    const ltvHigh = Number(prop.LTV_HIGH ?? 0);
    const ltvScore = total > 0
      ? ((ltvLow * 1.0 + ltvMid * 0.6 + ltvHigh * 0.2) / total) * 25
      : 0;

    // ── Owner Occupancy Score (0-25) ──────────────────────────────────────
    const ownerOcc = Number(prop.OWNER_OCC_COUNT ?? 0);
    const ownerOccScore = total > 0 ? (ownerOcc / total) * 25 : 0;

    // ── Ethnicity Diversity Score (0-25) ──────────────────────────────────
    const ethCounts = (ethResult.data ?? []).map((r: any) => Number(r.RECORD_COUNT));
    const ethDiversity = shannonEntropy(ethCounts) * 25;

    // ── Income Diversity Score (0-25) ────────────────────────────────────
    const incomeCounts = (incomeResult.data ?? []).map((r: any) => Number(r.RECORD_COUNT));
    const incomeDiversity = shannonEntropy(incomeCounts) * 25;

    const rawScore = ltvScore + ownerOccScore + ethDiversity + incomeDiversity;
    const score = Math.round(Math.min(100, Math.max(0, rawScore)));

    const band =
      score >= 70 ? 'green'  :
      score >= 40 ? 'yellow' :
                    'red';

    const label =
      score >= 70 ? 'High Diversity'    :
      score >= 40 ? 'Moderate Diversity':
                    'Low Diversity';

    return NextResponse.json({
      success: true,
      data: {
        score,
        band,
        label,
        components: {
          ltvScore:        Math.round(ltvScore),
          ownerOccScore:   Math.round(ownerOccScore),
          ethDiversity:    Math.round(ethDiversity),
          incomeDiversity: Math.round(incomeDiversity),
        },
        meta: {
          totalRecords: total,
          avgMarketValue: Number(prop.AVG_MARKET_VALUE ?? 0),
        },
      },
      executionTime:
        (propResult.executionTime ?? 0) +
        (ethResult.executionTime  ?? 0) +
        (incomeResult.executionTime ?? 0),
    });
  } catch (err: any) {
    console.error('[/api/snowflake/social-score]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
