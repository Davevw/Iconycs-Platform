/**
 * GET /api/snowflake/social-score
 * Computes the Social Housing Score (0-100) for any geography.
 *
 * Formula (each component 0-25):
 *   ltv_score       = (ltv_low / total) * 25            — low-LTV owners
 *   owner_score     = (owner_occ / total) * 25           — owner occupancy
 *   diversity_score = min((ethnic_pct * 2), 25)          — ethnic diversity
 *   market_score    = 25                                  — placeholder (Census overlay TBD)
 *   total_shs       = ltv + owner + diversity + market
 *
 * Accepts: state, county, city, zip
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { querySocialHousingScore } from '@/lib/snowflake-queries';
import type { GeoFilters } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;
    const filters: GeoFilters = {
      state:  p.get('state')  ?? undefined,
      county: p.get('county') ?? undefined,
      city:   p.get('city')   ?? undefined,
      zip:    p.get('zip')    ?? undefined,
    };

    const result = await executeQuery(querySocialHousingScore(filters));

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? 'Snowflake query failed' },
        { status: 500 }
      );
    }

    const row: any = result.data?.[0] ?? {};
    const total       = Number(row.TOTAL_RECORDS    ?? 0);
    const ltvLow      = Number(row.LTV_LOW          ?? 0);
    const ownerOcc    = Number(row.OWNER_OCC_COUNT  ?? 0);
    const hispanic    = Number(row.HISPANIC_COUNT   ?? 0);
    const black       = Number(row.BLACK_COUNT      ?? 0);
    const asian       = Number(row.ASIAN_COUNT      ?? 0);
    const avgMktValue = Number(row.AVG_MARKET_VALUE ?? 0);

    // Component scores
    const ltvScore       = total > 0 ? (ltvLow / total) * 25          : 0;
    const ownerScore     = total > 0 ? (ownerOcc / total) * 25        : 0;
    const ethnicPct      = total > 0 ? ((hispanic + black + asian) / total) * 100 : 0;
    const diversityScore = Math.min(ethnicPct * 2, 25);
    const marketScore    = 25; // placeholder until Census median income overlay

    const rawScore = ltvScore + ownerScore + diversityScore + marketScore;
    const score    = Math.round(Math.min(100, Math.max(0, rawScore)));

    const band =
      score >= 70 ? 'green'  :
      score >= 40 ? 'yellow' :
                    'red';

    const label =
      score >= 70 ? 'High Diversity'     :
      score >= 40 ? 'Moderate Diversity' :
                    'Low Diversity';

    return NextResponse.json({
      success: true,
      data: {
        score,
        band,
        label,
        components: {
          ltvScore:        Math.round(ltvScore),
          ownerOccScore:   Math.round(ownerScore),
          ethDiversity:    Math.round(diversityScore),
          incomeDiversity: Math.round(marketScore), // market placeholder maps to incomeDiversity slot
        },
        meta: {
          totalRecords:  total,
          avgMarketValue: avgMktValue,
        },
      },
      executionTime: result.executionTime ?? 0,
    });
  } catch (err: any) {
    console.error('[/api/snowflake/social-score]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
