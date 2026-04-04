// GET /api/snowflake/census?state=CA&tract=4001.01
// GET /api/snowflake/census?state=CA&aggregate=true  ← state-level aggregation
// Returns Census ACS 5-Year 2023 data for a geography
// Source: PUBLIC_DATA.CENSUS_ACS_TRACT (public data — no Infutor contamination)

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

// State abbreviation → FIPS code lookup
const STATE_FIPS: Record<string, string> = {
  'AL':'01','AK':'02','AZ':'04','AR':'05','CA':'06','CO':'08','CT':'09','DE':'10',
  'DC':'11','FL':'12','GA':'13','HI':'15','ID':'16','IL':'17','IN':'18','IA':'19',
  'KS':'20','KY':'21','LA':'22','ME':'23','MD':'24','MA':'25','MI':'26','MN':'27',
  'MS':'28','MO':'29','MT':'30','NE':'31','NV':'32','NH':'33','NJ':'34','NM':'35',
  'NY':'36','NC':'37','ND':'38','OH':'39','OK':'40','OR':'41','PA':'42','RI':'44',
  'SC':'45','SD':'46','TN':'47','TX':'48','UT':'49','VT':'50','VA':'51','WA':'53',
  'WV':'54','WI':'55','WY':'56',
};

function resolveStateFips(stateParam: string): string {
  const upper = stateParam.toUpperCase().trim();
  // If it's already a 2-digit FIPS code (all digits), return as-is with zero-padding
  if (/^\d+$/.test(upper)) {
    return upper.padStart(2, '0');
  }
  // Otherwise treat as state abbreviation
  return STATE_FIPS[upper] ?? upper;
}

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const state     = p.get('state');     // e.g. "06" or "CA"
  const tract     = p.get('tract');     // e.g. "4001.01"
  const county    = p.get('county');    // e.g. "037"
  const zip       = p.get('zip');       // future use
  const aggregate = p.get('aggregate'); // "true" → state-level aggregation

  // ── State-level aggregate query ─────────────────────────────────────────────
  if (aggregate === 'true' && state) {
    const sanitizedState = state.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2);
    const fips = resolveStateFips(sanitizedState);

    const sql = `
      SELECT
        COUNT(*)                                                              AS TRACT_COUNT,
        SUM(TOTAL_POPULATION)                                                 AS STATE_POPULATION,
        SUM(WHITE_ALONE)                                                      AS WHITE_TOTAL,
        SUM(BLACK_ALONE)                                                      AS BLACK_TOTAL,
        SUM(ASIAN_ALONE)                                                      AS ASIAN_TOTAL,
        SUM(TOTAL_HOUSING_UNITS)                                              AS TOTAL_HOUSING,
        SUM(OWNER_OCCUPIED)                                                   AS OWNER_OCCUPIED_TOTAL,
        SUM(RENTER_OCCUPIED)                                                  AS RENTER_OCCUPIED_TOTAL,
        AVG(MEDIAN_HOUSEHOLD_INCOME)                                          AS AVG_MEDIAN_INCOME,
        AVG(MEDIAN_HOME_VALUE)                                                AS AVG_MEDIAN_HOME_VALUE,
        ROUND(SUM(WHITE_ALONE)  / NULLIF(SUM(TOTAL_POPULATION), 0) * 100, 1) AS PCT_WHITE,
        ROUND(SUM(BLACK_ALONE)  / NULLIF(SUM(TOTAL_POPULATION), 0) * 100, 1) AS PCT_BLACK,
        ROUND(SUM(ASIAN_ALONE)  / NULLIF(SUM(TOTAL_POPULATION), 0) * 100, 1) AS PCT_ASIAN,
        ROUND(
          100
          - SUM(WHITE_ALONE)  / NULLIF(SUM(TOTAL_POPULATION), 0) * 100
          - SUM(BLACK_ALONE)  / NULLIF(SUM(TOTAL_POPULATION), 0) * 100
          - SUM(ASIAN_ALONE)  / NULLIF(SUM(TOTAL_POPULATION), 0) * 100,
          1
        )                                                                     AS PCT_HISPANIC_OTHER,
        ROUND(SUM(OWNER_OCCUPIED) / NULLIF(SUM(TOTAL_HOUSING_UNITS), 0) * 100, 1) AS PCT_OWNER_OCCUPIED
      FROM PROPERTYANALYTICS.PUBLIC_DATA.CENSUS_ACS_TRACT
      WHERE STATE_FIPS = '${fips}'
    `;

    const result = await executeQuery(sql);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      aggregate: true,
      stateFips: fips,
      stateAbbr: state.toUpperCase(),
      data: result.data?.[0] ?? null,
      source: 'Census Bureau ACS 5-Year 2023 (Public Data)',
      note: 'State-level aggregation across all census tracts. No Infutor data modified.',
    });
  }

  // ── Tract / county-level query (existing behavior) ──────────────────────────
  const conditions: string[] = [];

  if (state) {
    const sanitizedState = state.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2);
    const fips = resolveStateFips(sanitizedState);
    conditions.push(`STATE_FIPS = '${fips}'`);
  }

  if (tract) {
    const sanitizedTract = tract.replace(/[^0-9.]/g, '').substring(0, 10);
    conditions.push(`TRACT = '${sanitizedTract}'`);
  }

  if (county) {
    const sanitizedCounty = county.replace(/[^0-9]/g, '').substring(0, 3);
    conditions.push(`COUNTY_FIPS = '${sanitizedCounty}'`);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const sql = `
    SELECT
      STATE_FIPS,
      COUNTY_FIPS,
      TRACT,
      TOTAL_POPULATION,
      WHITE_ALONE,
      BLACK_ALONE,
      ASIAN_ALONE,
      NATIVE_HAWAIIAN,
      MEDIAN_HOUSEHOLD_INCOME,
      TOTAL_HOUSING_UNITS,
      OWNER_OCCUPIED,
      RENTER_OCCUPIED,
      PCT_WHITE,
      PCT_BLACK,
      PCT_ASIAN,
      PCT_OWNER_OCCUPIED,
      MEDIAN_HOME_VALUE,
      DATA_YEAR,
      DATA_SOURCE
    FROM PROPERTYANALYTICS.PUBLIC_DATA.CENSUS_ACS_TRACT
    ${whereClause}
    LIMIT 100
  `;

  const result = await executeQuery(sql);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    count: result.data?.length ?? 0,
    data: result.data,
    filters: { state, tract, county },
    source: 'Census Bureau ACS 5-Year 2023 (Public Data)',
    note: 'Area-level estimates only. Joined to property records at query time. No Infutor data modified.',
  });
}
