/**
 * Shared single-parcel lookup (address or APN) against VW_RESIDENTIAL_PROP ⋈ PROP.
 *
 * Used by:
 *   - app/api/v1/parcel/route.ts  (X-API-Key clients, e.g. Solis parcel lookup)
 *   - app/parcel/page.tsx + app/api/parcel/route.ts (Iconycs internal tool behind the site gate)
 *
 * Returns assessor/recorder fields ONLY: situs, characteristics, valuation/tax, sale history,
 * mortgage liens. Owner names, phones, HHID and household demographics are deliberately
 * excluded — this is a property record, not a people record.
 */

import { executeQuery } from '@/lib/snowflake';

export interface ParcelQuery {
  address?: string;
  /** Condo/apartment unit, e.g. "206" or "D". Matched against APTNBR; also accepted inline ("… Unit 206"). */
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  apn?: string;
}

export type ParcelRecord = Record<string, unknown>;

export interface ParcelResult {
  version: '1.0';
  generated: string;
  mode: 'address' | 'apn';
  matches: number;
  parcel: ParcelRecord | null;
  candidates: ParcelRecord[];
  source: { name: string; vintage: string; note: string };
  executionTime: number;
}

export class ParcelInputError extends Error {}

const STREET_TYPES: Record<string, string> = {
  LANE: 'LN', LN: 'LN', DRIVE: 'DR', DR: 'DR', STREET: 'ST', ST: 'ST', AVENUE: 'AVE', AVE: 'AVE', AV: 'AVE',
  ROAD: 'RD', RD: 'RD', COURT: 'CT', CT: 'CT', CIRCLE: 'CIR', CIR: 'CIR', BOULEVARD: 'BLVD', BLVD: 'BLVD',
  PLACE: 'PL', PL: 'PL', WAY: 'WAY', TRAIL: 'TRL', TRL: 'TRL', TERRACE: 'TER', TER: 'TER', PARKWAY: 'PKWY',
  PKWY: 'PKWY', HIGHWAY: 'HWY', HWY: 'HWY', LOOP: 'LOOP', RUN: 'RUN', PATH: 'PATH', COVE: 'CV', CV: 'CV',
  POINT: 'PT', PT: 'PT', SQUARE: 'SQ', SQ: 'SQ', ALLEY: 'ALY', ALY: 'ALY', PIKE: 'PIKE', ROW: 'ROW', WALK: 'WALK',
};
const DIRS = new Set(['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW', 'NORTH', 'SOUTH', 'EAST', 'WEST']);
const DIR_ABBR: Record<string, string> = { NORTH: 'N', SOUTH: 'S', EAST: 'E', WEST: 'W' };

/** Very small US address parser: "2402 Windsor Ln", "4325 E Sleighbell Dr", "123 N Main St Apt 4". */
function parseAddress(raw: string): { house: string; street: string; strtype?: string; predir?: string; unit?: string } | null {
  const tokens = raw
    .toUpperCase()
    .replace(/[.,#]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length < 2) return null;
  const house = tokens.shift()!;
  if (!/^\d+[A-Z]?$/.test(house)) return null;
  // strip unit designators
  let unit: string | undefined;
  const unitIdx = tokens.findIndex((t) => /^(APT|UNIT|STE|SUITE|BLDG|LOT|TRLR|SPC)$/.test(t));
  if (unitIdx >= 0) {
    unit = tokens[unitIdx + 1];
    tokens.splice(unitIdx);
  }
  let predir: string | undefined;
  if (tokens.length > 1 && DIRS.has(tokens[0])) predir = DIR_ABBR[tokens[0]] ?? tokens.shift()!;
  if (predir && DIR_ABBR[tokens[0]]) tokens.shift();
  let strtype: string | undefined;
  const last = tokens[tokens.length - 1];
  if (tokens.length > 1 && last && STREET_TYPES[last]) {
    strtype = STREET_TYPES[last];
    tokens.pop();
  }
  // trailing post-direction after type (e.g. "MAIN ST N") — drop
  if (tokens.length > 1 && DIRS.has(tokens[tokens.length - 1])) tokens.pop();
  const street = tokens.join(' ');
  if (!street) return null;
  return { house, street, ...(strtype ? { strtype } : {}), ...(predir ? { predir } : {}), ...(unit ? { unit } : {}) };
}

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const SELECT = `
  v.HOUSE, v.PREDIR, v.STREET, v.STRTYPE, v.POSTDIR, v.APTTYPE,
  v.APTNBR, v.CITY, v.STATE, v.ZIP, v.Z4, v.PROP_FIPSCD,
  v.PROP_CENSUSTRACT, v.PROP_MUNINAME, v.PROP_SUBDIVISION, v.PROP_ZONING, v.LATITUDE, v.LONGITUDE,
  v.LANDUSE_DESC, v.PROP_TYPE_DESC, v.PROPERTY_CATEGORY, v.PROP_STYLE, v.STORIES, v.YEAR_BUILT,
  v.EFF_YEAR_BUILT, v.CONDITION_CODE, v.QUALITY_DESC, v.LIVING_SQFT, v.GROSS_SQFT, v.BUILDING_SQFT,
  v.LAND_SQFT, v.ACRES, v.ROOMS, v.BEDROOMS, v.BATHS_CALC, v.FULL_BATHS,
  v.HALF_BATHS, v.PROP_AC, v.FIREPLACE_COUNT, v.GARAGE_CODE, v.PARKING_SPACES, v.POOL_CODE,
  v.HEATING_CODE, v.FOUNDATION_CODE, v.PROP_ROOFTYPE, v.EXTERIOR_WALLS, v.VALUE_CALCULATED, v.VALUE_ASSESSED,
  v.VALUE_ASSESSED_LAND, v.VALUE_ASSESSED_IMPROVEMENT, v.VALUE_MARKET, v.VALUE_MARKET_LAND, v.VALUE_MARKET_IMPROVEMENT, v.VALUE_APPRAISED,
  v.TAX_AMOUNT, v.TAX_YEAR, v.OCCUPANCY_STATUS, v.DEED_TYPE, v.RECORDING_DATE, v.SALE_DATE,
  v.SALE_AMOUNT, v.SALE_TRANS_CODE, v.PRIOR_SALE_DATE, v.PRIOR_SALE_AMOUNT, v.MTG1_AMOUNT, v.MTG1_DATE,
  v.MTG1_LOAN_DESC, v.MTG1_LOAN_CATEGORY, v.MTG1_TERM, v.MTG1_DUE_DATE, v.MTG1_LENDER, v.MTG1_INTEREST_RATE,
  v.MTG1_RATE_TYPE, v.MTG1_REFI_CODE, v.MTG2_AMOUNT, v.MTG2_LOAN_CODE, v.MTG2_LENDER, v.MTG2_INTEREST_RATE,
  v.MTG3_AMOUNT, v.MTG3_LOAN_CODE, v.MTG3_LENDER, v.PROP_HOMESTEAD, v.VETERAN_EXEMPT, v.DISABLED_EXEMPT`;

// APN lives on PROP, not the view; join once by PID for the APN column + APN lookups.
const FROM = `FROM VW_RESIDENTIAL_PROP v LEFT JOIN PROP p ON p.PID = v.PID`;


export const PARCEL_SOURCE = {
  name: 'Iconycs licensed property dataset (county assessor + recorder files)',
  vintage: '2020',
  note: 'Field coverage varies by county. Sale amounts are absent for many deeds in non-disclosure states (e.g. TX); some assessors do not report bedroom counts.',
};

export async function lookupParcel(input: ParcelQuery): Promise<ParcelResult> {
  const address = input.address?.trim();
  const apn = input.apn?.trim();
  const state = input.state?.trim().toUpperCase();
  const city = input.city?.trim().toUpperCase();
  const zip = input.zip?.trim().slice(0, 5);

  const where: string[] = [];
  const soft: string[] = []; // strtype/predir: applied first, dropped on zero matches
  let mode: 'address' | 'apn';

  if (apn) {
    mode = 'apn';
    if (!state) throw new ParcelInputError('state is required with apn (APN formats repeat across states)');
    where.push(`v.STATE = ${q(state)}`);
    // Exact match (assessor formatting, e.g. 080-509-000-0008 / 313-01-821). A normalized
    // REGEXP_REPLACE compare over a whole state is a full scan and times out; keep it strict.
    where.push(`p.PROP_APN = ${q(apn.toUpperCase())}`);
  } else if (address) {
    mode = 'address';
    const parsed = parseAddress(address);
    if (!parsed) throw new ParcelInputError('address must look like "2402 Windsor Ln"');
    if (!zip && !(city && state)) throw new ParcelInputError('provide zip, or city + state, with address');
    where.push(`v.HOUSE = ${q(parsed.house)}`);
    where.push(`v.STREET = ${q(parsed.street)}`);
    if (zip) where.push(`v.ZIP = ${q(zip)}`);
    if (state) where.push(`v.STATE = ${q(state)}`);
    if (city && !zip) where.push(`v.CITY = ${q(city)}`);
    const unit = (input.unit?.trim() || parsed.unit || '').toUpperCase().replace(/^#/, '');
    if (unit) where.push(`UPPER(v.APTNBR) = ${q(unit)}`);
    if (parsed.strtype) soft.push(`v.STRTYPE = ${q(parsed.strtype)}`);
    if (parsed.predir) soft.push(`v.PREDIR = ${q(parsed.predir)}`);
  } else {
    throw new ParcelInputError('provide address (+ zip or city/state) or apn (+ state)');
  }

  const t0 = Date.now();
  const run = (conds: string[]) =>
    executeQuery(`SELECT v.PID, p.PROP_APN AS APN, ${SELECT} ${FROM} WHERE ${conds.join(' AND ')} LIMIT 5`);

  let result = await run([...where, ...soft]);
  if (result.success && (result.data?.length ?? 0) === 0 && soft.length) {
    result = await run(where); // retry without strtype/predir
  }
  if (!result.success) throw new Error(result.error ?? 'Query failed');

  const rows = (result.data ?? []) as ParcelRecord[];
  return {
    version: '1.0',
    generated: new Date().toISOString(),
    mode,
    matches: rows.length,
    parcel: rows[0] ?? null,
    candidates: rows.length > 1 ? rows.slice(1) : [],
    source: PARCEL_SOURCE,
    executionTime: Date.now() - t0,
  };
}
