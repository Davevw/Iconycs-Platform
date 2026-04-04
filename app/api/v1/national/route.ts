/**
 * GET /api/v1/national
 * Public API — National housing summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQueryCached } from '@/lib/snowflake';
import { queryNational, queryNationalBreakdown } from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

async function safeQuery(sql: string): Promise<any[]> {
  const r = await executeQuery(sql);
  return r.success ? (r.data ?? []) : [];
}

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  try {
    const [totalsResult, ethnicityRows, propertyRows, loanRows] = await Promise.all([
      executeQueryCached(queryNational()),
      safeQuery(queryNationalBreakdown('ETHNICITY')),
      safeQuery(queryNationalBreakdown('PROPERTY_CATEGORY')),
      safeQuery(queryNationalBreakdown('MTG1_LOAN_CATEGORY')),
    ]);

    if (!totalsResult.success) {
      return errorResponse(totalsResult.error ?? 'Query failed');
    }

    const totals = totalsResult.data?.[0] ?? {};

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      geography: 'National',
      data: {
        totalProperties: Number(totals.TOTAL_PROPERTIES ?? 0),
        avgPropertyValue: Number(totals.AVG_VALUE ?? 0),
        avgMortgage: Number(totals.AVG_MORTGAGE ?? 0),
        ethnicityBreakdown: ethnicityRows,
        propertyBreakdown: propertyRows,
        loanBreakdown: loanRows,
      },
    });

    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error('[/api/v1/national]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
