/**
 * ICONYCS Snowflake Query Library
 * All Snowflake queries live here — never inline SQL in components or routes.
 * 
 * Views available:
 *   VW_DASHBOARD_NATIONAL — national aggregates
 *   VW_DASHBOARD_STATE    — by STATE
 *   VW_DASHBOARD_COUNTY   — by STATE, COUNTY
 *   VW_DASHBOARD_CITY     — by STATE, CITY
 *   VW_DASHBOARD_ZIP      — by STATE, ZIP
 *   VW_LENDER_ANALYSIS    — lender/ethnicity/income breakdowns
 *   VW_RESIDENTIAL_PROP   — full property records (130M rows) — use WHERE + LIMIT
 *   VW_RESIDENTIAL_DEMO   — property + demographic
 *   VW_BI_PROP            — has PROP_LOANTOVAL
 *   VW_LTV_TIERS          — pre-computed LTV tier buckets (created in Sprint1 Task2)
 *   NARC3                 — ethnicity data (join on PID)
 *   NACR_MRKTHOMEVAL      — home value tier lookup
 *   PROP_MTGLOANCD        — mortgage loan code lookup
 */

// ─── Filter Parameter Types ────────────────────────────────────────────────

export interface GeoFilters {
  state?: string;
  county?: string;
  city?: string;
  zip?: string;
}

export interface AnalyticsFilters extends GeoFilters {
  ethnicity?: string;
  loan_type?: string;
  time_period?: string;  // 'all' | '5yr' | '2020-2024' | '2015-2019' | '2010-2014' | '2005-2009'
  ltv_tier?: string;
  limit?: number;
}

// ─── Time Period Helper ────────────────────────────────────────────────────

function buildTimePeriodClause(time_period?: string, field = 'RECORDING_DATE'): string {
  if (!time_period || time_period === 'all') return '';
  const clauses: Record<string, string> = {
    '5yr':      `AND LEFT(${field}, 4) >= '${new Date().getFullYear() - 5}'`,
    '2020-2024': `AND LEFT(${field}, 4) BETWEEN '2020' AND '2024'`,
    '2015-2019': `AND LEFT(${field}, 4) BETWEEN '2015' AND '2019'`,
    '2010-2014': `AND LEFT(${field}, 4) BETWEEN '2010' AND '2014'`,
    '2005-2009': `AND LEFT(${field}, 4) BETWEEN '2005' AND '2009'`,
  };
  return clauses[time_period] || '';
}

// ─── National ─────────────────────────────────────────────────────────────

export function queryNational(): string {
  return `
    SELECT *
    FROM VW_DASHBOARD_NATIONAL
    LIMIT 1
  `.trim();
}

// ─── State ────────────────────────────────────────────────────────────────

export function queryState(filters: GeoFilters): string {
  const where = filters.state
    ? `WHERE STATE = '${filters.state.toUpperCase()}'`
    : '';
  return `
    SELECT *
    FROM VW_DASHBOARD_STATE
    ${where}
    ORDER BY TOTAL_PROPERTIES DESC
  `.trim();
}

// ─── County ───────────────────────────────────────────────────────────────

export function queryCounty(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT *
    FROM VW_DASHBOARD_COUNTY
    ${where}
    ORDER BY TOTAL_PROPERTIES DESC
  `.trim();
}

// ─── City ─────────────────────────────────────────────────────────────────

export function queryCity(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)   conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT *
    FROM VW_DASHBOARD_CITY
    ${where}
    ORDER BY TOTAL_PROPERTIES DESC
  `.trim();
}

// ─── ZIP ──────────────────────────────────────────────────────────────────

export function queryZip(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.city)   conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`ZIP = '${filters.zip}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT *
    FROM VW_DASHBOARD_ZIP
    ${where}
    ORDER BY TOTAL_PROPERTIES DESC
  `.trim();
}

// ─── Lender Analysis ─────────────────────────────────────────────────────

export function queryLenders(filters: AnalyticsFilters): string {
  const conditions: string[] = [];
  if (filters.state)     conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.city)      conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)       conditions.push(`ZIP = '${filters.zip}'`);
  if (filters.ethnicity) conditions.push(`ETHNICITY = '${filters.ethnicity}'`);
  if (filters.loan_type) conditions.push(`MTG1_LOAN_CATEGORY = '${filters.loan_type}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const lim = filters.limit || 20;
  return `
    SELECT
      LENDER_NAME,
      MTG1_LOAN_CATEGORY,
      ETHNICITY,
      INCOME_TIER,
      SUM(LOAN_COUNT) AS LOAN_COUNT,
      AVG(AVG_LOAN_AMOUNT) AS AVG_LOAN_AMOUNT,
      AVG(AVG_RATE) AS AVG_RATE,
      AVG(AVG_PROPERTY_VALUE) AS AVG_PROPERTY_VALUE
    FROM VW_LENDER_ANALYSIS
    ${where}
    GROUP BY LENDER_NAME, MTG1_LOAN_CATEGORY, ETHNICITY, INCOME_TIER
    ORDER BY LOAN_COUNT DESC
    LIMIT ${lim}
  `.trim();
}

// ─── Top Lenders (simple aggregation) ────────────────────────────────────

export function queryTopLenders(filters: AnalyticsFilters): string {
  const conditions: string[] = [];
  if (filters.state)     conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.city)      conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)       conditions.push(`ZIP = '${filters.zip}'`);
  if (filters.loan_type) conditions.push(`MTG1_LOAN_CATEGORY = '${filters.loan_type}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      LENDER_NAME,
      SUM(LOAN_COUNT) AS LOAN_COUNT,
      AVG(AVG_LOAN_AMOUNT) AS AVG_LOAN_AMOUNT,
      AVG(AVG_RATE) AS AVG_RATE
    FROM VW_LENDER_ANALYSIS
    ${where}
    GROUP BY LENDER_NAME
    ORDER BY LOAN_COUNT DESC
    LIMIT 10
  `.trim();
}

// ─── LTV Tier Distribution ────────────────────────────────────────────────

export function queryLTV(filters: AnalyticsFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.city)   conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`ZIP = '${filters.zip}'`);
  if (filters.ethnicity) conditions.push(`ETHNICITYCD = '${filters.ethnicity}'`);
  if (filters.loan_type) conditions.push(`MTG1_LOAN_CATEGORY = '${filters.loan_type}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      LTV_TIER,
      SUM(RECORD_COUNT) AS RECORD_COUNT,
      AVG(AVG_LOAN_AMOUNT) AS AVG_LOAN_AMOUNT,
      AVG(AVG_PROPERTY_VALUE) AS AVG_PROPERTY_VALUE
    FROM VW_LTV_TIERS
    ${where}
    GROUP BY LTV_TIER
    ORDER BY
      CASE LTV_TIER
        WHEN '≤60% — Tier 1'   THEN 1
        WHEN '60-65% — Tier 2' THEN 2
        WHEN '65-70% — Tier 3' THEN 3
        WHEN '70-75% — Tier 4' THEN 4
        WHEN '75-80% — Tier 5' THEN 5
        WHEN '80-85% — Tier 6' THEN 6
        WHEN '85-90% — Tier 7' THEN 7
        WHEN '90-95% — Tier 8' THEN 8
        WHEN '95-97% — Tier 9' THEN 9
        ELSE 10
      END
  `.trim();
}

// ─── Recording Date Trends ────────────────────────────────────────────────

export function queryTrends(filters: AnalyticsFilters): string {
  const conditions: string[] = [`RECORDING_DATE IS NOT NULL`, `LENGTH(RECORDING_DATE) >= 4`];
  if (filters.state) conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.city)  conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)   conditions.push(`ZIP = '${filters.zip}'`);
  const timePeriodClause = buildTimePeriodClause(filters.time_period);
  const where = `WHERE ${conditions.join(' AND ')} ${timePeriodClause}`;
  return `
    SELECT
      LEFT(RECORDING_DATE, 4) AS RECORD_YEAR,
      COUNT(*) AS RECORD_COUNT
    FROM VW_DASHBOARD_ZIP
    ${where}
    GROUP BY RECORD_YEAR
    HAVING RECORD_YEAR BETWEEN '1980' AND '${new Date().getFullYear()}'
    ORDER BY RECORD_YEAR ASC
  `.trim();
}

// ─── Parcel Detail Query ──────────────────────────────────────────────────

export function queryParcels(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`p.STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`p.COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)   conditions.push(`p.CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`p.ZIP = '${filters.zip}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : 'WHERE 1=1';
  return `
    SELECT
      TRIM(CONCAT(COALESCE(p.HOUSE, ''), ' ', COALESCE(p.STREET, ''), ' ', COALESCE(p.STRTYPE, ''))) AS ADDRESS,
      p.CITY,
      p.STATE,
      p.ZIP,
      p.VALUE_MARKET,
      p.LIVING_SQFT,
      p.BEDROOMS,
      p.BATHS_CALC,
      p.YEAR_BUILT,
      p.MTG1_LOAN_CATEGORY,
      p.MTG1_AMOUNT,
      p.SALE_DATE,
      p.SALE_AMOUNT,
      n.ETHNICITYCD,
      CASE n.ETHNICITYCD
        WHEN 'Y' THEN 'Hispanic'
        WHEN 'F' THEN 'African American'
        WHEN 'A' THEN 'Asian'
        ELSE 'Not Identified'
      END AS ETHNICITY_DESC
    FROM VW_RESIDENTIAL_PROP p
    LEFT JOIN NARC3 n ON p.PID = n.PID
    ${where}
    ORDER BY p.VALUE_MARKET DESC
    LIMIT 50
  `.trim();
}

// ─── Create LTV View SQL (run once as migration) ──────────────────────────

export const CREATE_LTV_VIEW_SQL = `
CREATE OR REPLACE VIEW VW_LTV_TIERS AS
SELECT
  STATE, CITY, ZIP,
  ETHNICITYCD,
  MTG1_LOAN_CATEGORY,
  CASE
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 60 THEN '≤60% — Tier 1'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 65 THEN '60-65% — Tier 2'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 70 THEN '65-70% — Tier 3'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 75 THEN '70-75% — Tier 4'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 80 THEN '75-80% — Tier 5'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 85 THEN '80-85% — Tier 6'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 90 THEN '85-90% — Tier 7'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 95 THEN '90-95% — Tier 8'
    WHEN CAST(PROP_LOANTOVAL AS FLOAT) <= 97 THEN '95-97% — Tier 9'
    ELSE 'Over 97%'
  END AS LTV_TIER,
  COUNT(*) AS RECORD_COUNT,
  AVG(MTG1_AMOUNT) AS AVG_LOAN_AMOUNT,
  AVG(VALUE_MARKET) AS AVG_PROPERTY_VALUE
FROM VW_BI_PROP p
LEFT JOIN NARC3 n ON p.PID = n.PID
WHERE PROP_LOANTOVAL IS NOT NULL AND PROP_LOANTOVAL != ''
GROUP BY 1,2,3,4,5,6
`.trim();
