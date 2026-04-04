/**
 * GET /api/snowflake/national
 * Returns national housing aggregate data from VW_DASHBOARD_NATIONAL
 * Runs 4 queries in parallel: totals + 3 dimension breakdowns (ethnicity, property, loan)
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryNational, queryNationalBreakdown } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Run a query and return its rows, or [] on failure */
async function safeQuery(sql: string): Promise<any[]> {
  const r = await executeQuery(sql);
  return r.success ? (r.data ?? []) : [];
}

export async function GET() {
  try {
    const [totalsResult, ethnicityRows, propertyRows, loanRows] = await Promise.all([
      executeQuery(queryNational()),
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

    return NextResponse.json({
      success: true,
      totalProperties: totals.TOTAL_PROPERTIES ?? 0,
      avgValue: totals.AVG_VALUE ?? 0,
      avgMortgage: totals.AVG_MORTGAGE ?? 0,
      ethnicityBreakdown: ethnicityRows,
      propertyBreakdown: propertyRows,
      loanBreakdown: loanRows,
      executionTime: totalsResult.executionTime,
    });
  } catch (err: any) {
    console.error('[/api/snowflake/national]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
