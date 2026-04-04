/**
 * GET /api/snowflake/national
 * Returns national housing aggregate data from VW_DASHBOARD_NATIONAL
 */

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryNational } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const sql = queryNational();
    const result = await executeQuery(sql);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data?.[0] ?? null,
      executionTime: result.executionTime,
    });
  } catch (err: any) {
    console.error('[/api/snowflake/national]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
