/**
 * GET /api/snowflake/national
 * Returns national housing aggregate data from VW_DASHBOARD_NATIONAL
 * Runs 4 queries in parallel: totals + 3 dimension breakdowns (ethnicity, property, loan)
 */

import { NextResponse } from 'next/server';
import { executeQuery, executeQueryCached } from '@/lib/snowflake';
import { queryNational, queryNationalBreakdown } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

/** Run a query and return its rows, or [] on failure */
async function safeQuery(sql: string): Promise<any[]> {
  const r = await executeQuery(sql);
  return r.success ? (r.data ?? []) : [];
}

export async function GET() {
  try {
    const [totalsResult, ethnicityRows, propertyRows, loanRows] = await Promise.all([
      executeQueryCached(queryNational()),
      safeQuery(queryNationalBreakdown('ETHNICITY')),
      safeQuery(queryNationalBreakdown('PROPERTY_CATEGORY')),
      safeQuery(queryNationalBreakdown('MTG1_LOAN_CATEGORY')),
    ]);

    if (!totalsResult.success) {
      return NextResponse.json(
        { success: false, error: totalsResult.error },
        { status: 500 }
      );
    }

    const totals = totalsResult.data?.[0] ?? {};

    const totalProps = Number(totals.TOTAL_PROPERTIES ?? 0);
    const avgVal = Number(totals.AVG_VALUE ?? 0);
    const avgMtg = Number(totals.AVG_MORTGAGE ?? 0);

    const response = NextResponse.json({
      success: true,
      // camelCase for new code
      totalProperties: totalProps,
      avgValue: avgVal,
      avgMortgage: avgMtg,
      ethnicityBreakdown: ethnicityRows,
      propertyBreakdown: propertyRows,
      loanBreakdown: loanRows,
      // UPPERCASE aliases for legacy frontend code
      TOTAL_PROPERTIES: totalProps,
      AVG_VALUE: avgVal,
      AVG_MORTGAGE: avgMtg,
      executionTime: totalsResult.executionTime,
    });
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (err: any) {
    console.error('[/api/snowflake/national]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
