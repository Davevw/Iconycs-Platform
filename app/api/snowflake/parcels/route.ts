/**
 * GET /api/snowflake/parcels?state=CA&city=LOS+ANGELES
 * Returns parcel-level detail from VW_RESIDENTIAL_PROP + NARC3.
 * Requires valid access-code header: x-access-code: Iconycs01
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryParcels } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ACCESS_CODE = 'Iconycs01';

export async function GET(request: NextRequest) {
  // Auth check — require access code header or query param
  const accessCode =
    request.headers.get('x-access-code') ??
    new URL(request.url).searchParams.get('access_code');

  if (accessCode !== ACCESS_CODE) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing access code.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const state  = searchParams.get('state')  ?? undefined;
    const county = searchParams.get('county') ?? undefined;
    const city   = searchParams.get('city')   ?? undefined;
    const zip    = searchParams.get('zip')    ?? undefined;

    if (!state) {
      return NextResponse.json(
        { success: false, error: 'state parameter is required' },
        { status: 400 }
      );
    }

    const sql = queryParcels({ state, county, city, zip });
    const result = await executeQuery(sql);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data ?? [],
      rowCount: result.rowCount,
      executionTime: result.executionTime,
    });
  } catch (err: any) {
    console.error('[/api/snowflake/parcels]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
