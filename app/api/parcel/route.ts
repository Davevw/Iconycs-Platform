/**
 * GET /api/parcel — internal parcel lookup for the Iconycs /parcel page.
 * Protected by the whole-site gate cookie (middleware.ts); no API key involved.
 * Same query + same field policy as /api/v1/parcel (lib/parcel-lookup.ts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { lookupParcel, ParcelInputError } from '@/lib/parcel-lookup';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  try {
    const data = await lookupParcel({
      address: sp.get('address') ?? undefined,
      unit: sp.get('unit') ?? undefined,
      apn: sp.get('apn') ?? undefined,
      state: sp.get('state') ?? undefined,
      city: sp.get('city') ?? undefined,
      zip: sp.get('zip') ?? undefined,
    });
    return NextResponse.json(data, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (err: any) {
    if (err instanceof ParcelInputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error('[/api/parcel]', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}
