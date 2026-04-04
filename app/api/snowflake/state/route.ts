/**
 * GET /api/snowflake/state?state=CA
 * Returns state-level housing data from VW_DASHBOARD_STATE.
 * When a specific state is requested, also returns dimension breakdowns
 * (ethnicity, property category, loan type) for pie charts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQueryCached } from '@/lib/snowflake';
import { queryState, queryStateBreakdown } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

async function safeQuery(sql: string): Promise<any[]> {
  const r = await executeQuery(sql);
  return r.success ? (r.data ?? []) : [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') ?? undefined;

    const sql = queryState({ state });

    if (state) {
      // Fetch state summary + dimension breakdowns in parallel
      const [result, ethnicityRows, propertyRows, loanRows] = await Promise.all([
        executeQueryCached(sql),
        safeQuery(queryStateBreakdown(state, 'ETHNICITY')),
        safeQuery(queryStateBreakdown(state, 'PROPERTY_CATEGORY')),
        safeQuery(queryStateBreakdown(state, 'MTG1_LOAN_CATEGORY')),
      ]);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      const response = NextResponse.json({
        success: true,
        data: result.data ?? [],
        rowCount: result.rowCount,
        executionTime: result.executionTime,
        ethnicityBreakdown: ethnicityRows,
        propertyBreakdown: propertyRows,
        loanBreakdown: loanRows,
      });
      response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return response;
    } else {
      // National all-states list — no breakdown needed
      const result = await executeQueryCached(sql);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      const response = NextResponse.json({
        success: true,
        data: result.data ?? [],
        rowCount: result.rowCount,
        executionTime: result.executionTime,
      });
      response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return response;
    }
  } catch (err: any) {
    console.error('[/api/snowflake/state]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
