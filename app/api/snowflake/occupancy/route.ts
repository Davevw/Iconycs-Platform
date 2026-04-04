import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { queryOccupancy } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const filters = {
    state: p.get('state') ?? undefined,
    city:  p.get('city')  ?? undefined,
    zip:   p.get('zip')   ?? undefined,
  };

  try {
    const result = await executeQuery(queryOccupancy(filters));
    if (!result.success)
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });

    const rows = result.data ?? [];

    // OCCUPANCY_STATUS values from VW_RESIDENTIAL_DEMO/DASHBOARD views:
    //   'Owner Occupied'      (PROP_OWNEROCC = 'O')
    //   'Absentee Owner'      (PROP_OWNEROCC = 'A')
    //   'Situs From Sale'     (PROP_OWNEROCC = 'S')
    //   null / other          → 'Unknown'
    // Consolidate Absentee Owner + Situs From Sale → Non-Owner Occupied
    const aggregated: Record<string, number> = {};
    for (const r of rows as any[]) {
      const raw = r.OCCUPANCY_STATUS as string | null;
      let label: string;
      if (raw === 'Owner Occupied') {
        label = 'Owner Occupied';
      } else if (raw === 'Absentee Owner' || raw === 'Situs From Sale') {
        label = 'Non-Owner Occupied';
      } else {
        label = raw ?? 'Unknown';
      }
      aggregated[label] = (aggregated[label] ?? 0) + Number(r.RECORD_COUNT ?? 0);
    }

    const mapped = Object.entries(aggregated)
      .map(([label, count]) => ({ label, count, pct: 0 }))
      .sort((a, b) => b.count - a.count);

    const total = mapped.reduce((s, r) => s + r.count, 0);
    const withPct = mapped.map(r => ({ ...r, pct: total > 0 ? (r.count / total) * 100 : 0 }));

    return NextResponse.json(
      { success: true, data: withPct, executionTime: result.executionTime },
      { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1200' } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
