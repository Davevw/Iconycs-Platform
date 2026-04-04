/**
 * GET /api/v1/state/:state
 * Public API — State-level housing data
 * Example: /api/v1/state/CA
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQueryCached } from '@/lib/snowflake';
import { queryState, queryStateBreakdown } from '@/lib/snowflake-queries';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../../_middleware';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { state: string } }
) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  const state = params.state?.toUpperCase();

  if (!state || state.length !== 2) {
    return errorResponse('Invalid state code. Use 2-letter abbreviation (e.g. CA, TX, FL)', 400);
  }

  try {
    const sql = queryState({ state });

    const [result, ethnicityRows, propertyRows, loanRows] = await Promise.all([
      executeQueryCached(sql),
      safeQuery(queryStateBreakdown(state, 'ETHNICITY')),
      safeQuery(queryStateBreakdown(state, 'PROPERTY_CATEGORY')),
      safeQuery(queryStateBreakdown(state, 'MTG1_LOAN_CATEGORY')),
    ]);

    if (!result.success) {
      return errorResponse(result.error ?? 'Query failed');
    }

    const row = result.data?.[0] ?? {};

    const res = NextResponse.json({
      version: '1.0',
      generated: new Date().toISOString(),
      geography: state,
      data: {
        state,
        totalProperties: Number(row.TOTAL_PROPERTIES ?? 0),
        avgPropertyValue: Number(row.AVG_VALUE ?? 0),
        avgMortgage: Number(row.AVG_MORTGAGE ?? 0),
        ethnicityBreakdown: ethnicityRows,
        propertyBreakdown: propertyRows,
        loanBreakdown: loanRows,
      },
    });

    applyHeaders(res);
    return res;
  } catch (err: any) {
    console.error(`[/api/v1/state/${state}]`, err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
