/**
 * GET /api/v1/parcel — single-parcel lookup by street address or APN (X-API-Key clients).
 *
 * Built 2026-09-18 for Solis "Parcel lookup". Solis's server functions run on an edge runtime
 * that cannot load snowflake-sdk, so Solis calls this Node route with its own X-API-Key;
 * Iconycs holds the warehouse creds. Query logic lives in lib/parcel-lookup.ts (shared with
 * the internal /parcel page).
 *
 *   ?address=2402 Windsor Ln&city=Pasadena&state=TX      (city optional if zip given)
 *   ?address=2402 Windsor Ln&zip=77506
 *   ?apn=080-509-000-0008&state=TX                        (APN formats repeat across states)
 *
 * Assessor/recorder fields ONLY — no owner names, phones, HHID or household demographics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { lookupParcel, ParcelInputError } from '@/lib/parcel-lookup';
import { checkApiKey, applyHeaders, errorResponse, optionsResponse } from '../_middleware';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const authErr = checkApiKey(request);
  if (authErr) return authErr;

  const sp = new URL(request.url).searchParams;
  try {
    const data = await lookupParcel({
      address: sp.get('address') ?? undefined,
      apn: sp.get('apn') ?? undefined,
      state: sp.get('state') ?? undefined,
      city: sp.get('city') ?? undefined,
      zip: sp.get('zip') ?? undefined,
    });
    const res = NextResponse.json(data);
    // Parcel results are per-lookup and must not be edge-cached across users.
    applyHeaders(res);
    res.headers.set('Cache-Control', 'private, no-store');
    return res;
  } catch (err: any) {
    if (err instanceof ParcelInputError) return errorResponse(err.message, 400);
    console.error('[/api/v1/parcel]', err);
    return errorResponse(err?.message ?? 'Internal server error');
  }
}
