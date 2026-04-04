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
    SELECT
      SUM(RECORD_COUNT) AS TOTAL_PROPERTIES,
      AVG(AVG_VALUE) AS AVG_VALUE,
      AVG(AVG_MORTGAGE) AS AVG_MORTGAGE
    FROM VW_DASHBOARD_NATIONAL
  `.trim();
}

export function queryNationalBreakdown(dimension: 'ETHNICITY' | 'PROPERTY_CATEGORY' | 'MTG1_LOAN_CATEGORY'): string {
  return `
    SELECT
      ${dimension} AS LABEL,
      SUM(RECORD_COUNT) AS RECORD_COUNT
    FROM VW_DASHBOARD_NATIONAL
    WHERE ${dimension} IS NOT NULL AND ${dimension} != 'Unknown'
    GROUP BY ${dimension}
    ORDER BY RECORD_COUNT DESC
    LIMIT 10
  `.trim();
}

// ─── State ────────────────────────────────────────────────────────────────

export function queryState(filters: GeoFilters): string {
  if (filters.state) {
    return `
      SELECT GEO_VALUE AS STATE, SUM(RECORD_COUNT) AS RECORD_COUNT,
             AVG(AVG_VALUE) AS AVG_VALUE, AVG(AVG_MORTGAGE) AS AVG_MORTGAGE
      FROM VW_DASHBOARD_STATE
      WHERE GEO_VALUE = '${filters.state.toUpperCase()}'
      GROUP BY GEO_VALUE
      LIMIT 1
    `.trim();
  }
  return `
    SELECT GEO_VALUE AS STATE, SUM(RECORD_COUNT) AS RECORD_COUNT,
           AVG(AVG_VALUE) AS AVG_VALUE, AVG(AVG_MORTGAGE) AS AVG_MORTGAGE
    FROM VW_DASHBOARD_STATE
    GROUP BY GEO_VALUE
    ORDER BY RECORD_COUNT DESC
    LIMIT 51
  `.trim();
}

/**
 * Returns a dimension breakdown for a single state from VW_DASHBOARD_NATIONAL.
 * The national view has STATE column — use it when a specific state is selected.
 */
export function queryStateBreakdown(
  state: string,
  dimension: 'ETHNICITY' | 'PROPERTY_CATEGORY' | 'MTG1_LOAN_CATEGORY'
): string {
  return `
    SELECT
      ${dimension} AS LABEL,
      SUM(RECORD_COUNT) AS RECORD_COUNT
    FROM VW_DASHBOARD_STATE
    WHERE GEO_VALUE = '${state.toUpperCase()}'
      AND ${dimension} IS NOT NULL AND ${dimension} != 'Unknown'
    GROUP BY ${dimension}
    ORDER BY RECORD_COUNT DESC
    LIMIT 10
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
    ORDER BY RECORD_COUNT DESC
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
    ORDER BY RECORD_COUNT DESC
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
    ORDER BY RECORD_COUNT DESC
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
  const where = `WHERE ${conditions.join(' AND ')}`;
  return `
    SELECT
      LEFT(RECORDING_DATE, 4) AS RECORD_YEAR,
      COUNT(*) AS RECORD_COUNT
    FROM VW_RESIDENTIAL_PROP
    ${where}
    GROUP BY RECORD_YEAR
    HAVING RECORD_YEAR BETWEEN '1980' AND '${new Date().getFullYear()}'
    ORDER BY RECORD_YEAR ASC
    LIMIT 50
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
      END AS ETHNICITYCD
    FROM VW_RESIDENTIAL_PROP p
    LEFT JOIN NARC3 n ON p.PID = n.PID
    ${where}
    ORDER BY p.VALUE_MARKET DESC
    LIMIT 50
  `.trim();
}

// ─── Cascade Filters ──────────────────────────────────────────────────────

export interface CascadeFilters extends AnalyticsFilters {
  value_tier?: string;
  ethnicity?: string;
  gender?: string;
  marital_status?: string;
  education?: string;
  income_tier?: string;
  occupancy?: string;
  attached_detached?: string;
  ownership_duration?: string;
}

// ─── Cascade Property Query ────────────────────────────────────────────────

export function queryCascadeProperty(filters: CascadeFilters): string {
  const conditions: string[] = [];
  if (filters.state)             conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county)            conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)              conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)               conditions.push(`ZIP = '${filters.zip}'`);
  if (filters.loan_type)         conditions.push(`LOAN_TYPE = '${filters.loan_type}'`);
  if (filters.ltv_tier)          conditions.push(`LTV_TIER = '${filters.ltv_tier}'`);
  if (filters.value_tier)        conditions.push(`MARKET_VALUE_TIER = '${filters.value_tier}'`);
  if (filters.occupancy)         conditions.push(`OCCUPANCY = '${filters.occupancy}'`);
  if (filters.attached_detached) conditions.push(`ATTACHED_DETACHED = '${filters.attached_detached}'`);
  if (filters.ownership_duration) conditions.push(`OWNERSHIP_DURATION = '${filters.ownership_duration}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      PURCHASE_VALUE_TIER,
      MARKET_VALUE_TIER,
      OWNERSHIP_DURATION,
      LTV_TIER,
      LOAN_TYPE,
      OCCUPANCY,
      ATTACHED_DETACHED,
      SUM(RECORD_COUNT) AS RECORD_COUNT,
      AVG(AVG_MARKET_VALUE) AS AVG_MARKET_VALUE,
      AVG(AVG_LOAN_AMOUNT) AS AVG_LOAN_AMOUNT,
      SUM(TOTAL_LIENS) AS TOTAL_LIENS
    FROM VW_CASCADE_PROPERTY
    ${where}
    GROUP BY
      PURCHASE_VALUE_TIER, MARKET_VALUE_TIER, OWNERSHIP_DURATION,
      LTV_TIER, LOAN_TYPE, OCCUPANCY, ATTACHED_DETACHED
    ORDER BY RECORD_COUNT DESC
  `.trim();
}

// ─── Cascade Ownership Query ───────────────────────────────────────────────

export function queryCascadeOwnership(filters: CascadeFilters): string {
  const conditions: string[] = [];
  if (filters.state)        conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county)       conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)         conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)          conditions.push(`ZIP = '${filters.zip}'`);
  if (filters.ethnicity)    conditions.push(`ETHNICITYCD = '${filters.ethnicity}'`);
  if (filters.gender)       conditions.push(`GENDER = '${filters.gender}'`);
  if (filters.marital_status) conditions.push(`MARRIEDCD = '${filters.marital_status}'`);
  if (filters.education)    conditions.push(`EDUCATION_LEVEL = '${filters.education}'`);
  if (filters.income_tier)  conditions.push(`INCOME_TIER = '${filters.income_tier}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      ETHNICITYCD,
      ETHNICITYCD,
      GENDER,
      MARRIEDCD,
      EDUCATION_LEVEL,
      INCOME_TIER,
      WEALTH_SCORE,
      SUM(RECORD_COUNT) AS RECORD_COUNT
    FROM VW_CASCADE_OWNERSHIP
    ${where}
    GROUP BY
      ETHNICITYCD, ETHNICITYCD, GENDER, MARRIEDCD,
      EDUCATION_LEVEL, INCOME_TIER, WEALTH_SCORE
    ORDER BY RECORD_COUNT DESC
  `.trim();
}

// ─── Cascade Lenders Query ─────────────────────────────────────────────────

export function queryCascadeLenders(filters: CascadeFilters): string {
  const conditions: string[] = [];
  if (filters.state)     conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county)    conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)      conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)       conditions.push(`ZIP = '${filters.zip}'`);
  if (filters.loan_type) conditions.push(`MTG1_LOAN_CATEGORY = '${filters.loan_type}'`);
  if (filters.ethnicity) conditions.push(`ETHNICITY = '${filters.ethnicity}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      LENDER_NAME,
      MTG1_LOAN_CATEGORY AS LOAN_TYPE,
      SUM(LOAN_COUNT) AS LOAN_COUNT,
      AVG(AVG_LOAN_AMOUNT) AS AVG_LOAN_AMOUNT,
      AVG(AVG_PROPERTY_VALUE) AS AVG_PROPERTY_VALUE
    FROM VW_LENDER_ANALYSIS
    ${where}
    GROUP BY LENDER_NAME, MTG1_LOAN_CATEGORY
    ORDER BY LOAN_COUNT DESC
    LIMIT 10
  `.trim();
}

// ─── Demographics Deep Dive Query ──────────────────────────────────────────

export function queryDemographics(filters: CascadeFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`p.STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`p.CNTYCD = '${filters.county.toUpperCase()}'`);
  if (filters.city)   conditions.push(`p.CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`p.ZIP = '${filters.zip}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      n.GENDER,
      n.MARRIEDCD,
      CASE n.EDUCATIONCD
        WHEN 'A' THEN 'High School'
        WHEN 'B' THEN 'College'
        WHEN 'C' THEN 'Graduate'
        WHEN 'D' THEN 'Other'
        ELSE 'Unknown'
      END AS EDUCATION_LEVEL,
      CASE
        WHEN n.EHI <= 3 THEN '$10K-$30K'
        WHEN n.EHI <= 5 THEN '$30K-$50K'
        WHEN n.EHI <= 8 THEN '$50K-$100K'
        WHEN n.EHI <= 12 THEN '$100K-$250K'
        WHEN n.EHI <= 15 THEN '$250K-$500K'
        ELSE '$500K+'
      END AS INCOME_TIER,
      n.WEALTHSCR AS WEALTH_SCORE,
      n.ETHNICITYCD,
      CASE n.ETHNICITYCD
        WHEN 'Y' THEN 'Hispanic'
        WHEN 'F' THEN 'African American'
        WHEN 'A' THEN 'Asian'
        ELSE 'Not Identified'
      END AS ETHNICITYCD,
      COUNT(*) AS RECORD_COUNT
    FROM VW_RESIDENTIAL_PROP p
    JOIN NARC3 n ON p.PID = n.PID
    ${where}
    GROUP BY
      n.GENDER, n.MARRIEDCD, n.EDUCATIONCD, n.EHI, n.WEALTHSCR, n.ETHNICITYCD
    ORDER BY RECORD_COUNT DESC
    LIMIT 500
  `.trim();
}

// ─── Social Housing Score Components ──────────────────────────────────────

export function querySocialHousingComponents(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)   conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`ZIP = '${filters.zip}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      SUM(RECORD_COUNT) AS TOTAL_RECORDS,
      -- LTV distribution
      SUM(CASE WHEN LTV_TIER = '0-60%'  THEN RECORD_COUNT ELSE 0 END) AS LTV_LOW,
      SUM(CASE WHEN LTV_TIER IN ('60-70%','70-80%') THEN RECORD_COUNT ELSE 0 END) AS LTV_MID,
      SUM(CASE WHEN LTV_TIER IN ('80-90%','90-95%','95%+') THEN RECORD_COUNT ELSE 0 END) AS LTV_HIGH,
      -- Owner occupancy
      SUM(CASE WHEN OCCUPANCY = 'Y' THEN RECORD_COUNT ELSE 0 END) AS OWNER_OCC_COUNT,
      -- Average market value (for context)
      AVG(AVG_MARKET_VALUE) AS AVG_MARKET_VALUE
    FROM VW_CASCADE_PROPERTY
    ${where}
  `.trim();
}

export function querySocialHousingEthnicity(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)   conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`ZIP = '${filters.zip}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      ETHNICITYCD,
      SUM(RECORD_COUNT) AS RECORD_COUNT
    FROM VW_CASCADE_OWNERSHIP
    ${where}
    GROUP BY ETHNICITYCD
  `.trim();
}

export function querySocialHousingIncome(filters: GeoFilters): string {
  const conditions: string[] = [];
  if (filters.state)  conditions.push(`STATE = '${filters.state.toUpperCase()}'`);
  if (filters.county) conditions.push(`COUNTY = '${filters.county.toUpperCase()}'`);
  if (filters.city)   conditions.push(`CITY = '${filters.city.toUpperCase()}'`);
  if (filters.zip)    conditions.push(`ZIP = '${filters.zip}'`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return `
    SELECT
      INCOME_TIER,
      SUM(RECORD_COUNT) AS RECORD_COUNT
    FROM VW_CASCADE_OWNERSHIP
    ${where}
    GROUP BY INCOME_TIER
    ORDER BY RECORD_COUNT DESC
  `.trim();
}

// ─── Create Cascade Views SQL (Sprint 2 migration) ────────────────────────

export const CREATE_CASCADE_PROPERTY_VIEW_SQL = `
CREATE OR REPLACE VIEW VW_CASCADE_PROPERTY AS
SELECT
  p.STATE, p.CNTYCD AS COUNTY, p.CITY, p.ZIP,
  p.MTG1_LOAN_CATEGORY AS LOAN_TYPE,
  p.PROP_OWNEROCC AS OCCUPANCY,
  CASE
    WHEN p.PROPERTY_CATEGORY = 'SINGLE FAMILY' THEN 'Detached'
    WHEN p.PROPERTY_CATEGORY LIKE '%CONDO%' THEN 'Attached'
    ELSE 'Other'
  END AS ATTACHED_DETACHED,
  CASE
    WHEN p.SALE_AMOUNT <= 100000 THEN '$25K-$100K'
    WHEN p.SALE_AMOUNT <= 250000 THEN '$100K-$250K'
    WHEN p.SALE_AMOUNT <= 400000 THEN '$250K-$400K'
    WHEN p.SALE_AMOUNT <= 750000 THEN '$400K-$750K'
    WHEN p.SALE_AMOUNT <= 1000000 THEN '$750K-$1M'
    WHEN p.SALE_AMOUNT > 1000000 THEN '$1M+'
    ELSE 'Unknown'
  END AS PURCHASE_VALUE_TIER,
  CASE
    WHEN p.VALUE_MARKET <= 100000 THEN '$25K-$100K'
    WHEN p.VALUE_MARKET <= 250000 THEN '$100K-$250K'
    WHEN p.VALUE_MARKET <= 400000 THEN '$250K-$400K'
    WHEN p.VALUE_MARKET <= 750000 THEN '$400K-$750K'
    WHEN p.VALUE_MARKET <= 1000000 THEN '$750K-$1M'
    WHEN p.VALUE_MARKET > 1000000 THEN '$1M+'
    ELSE 'Unknown'
  END AS MARKET_VALUE_TIER,
  CASE
    WHEN DATEDIFF('month', TRY_TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 12 THEN '0-1 Year'
    WHEN DATEDIFF('month', TRY_TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 24 THEN '1-2 Years'
    WHEN DATEDIFF('month', TRY_TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 60 THEN '2-5 Years'
    WHEN DATEDIFF('month', TRY_TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 120 THEN '5-10 Years'
    WHEN DATEDIFF('month', TRY_TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 240 THEN '10-20 Years'
    WHEN DATEDIFF('month', TRY_TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) > 240 THEN '20+ Years'
    ELSE 'Unknown'
  END AS OWNERSHIP_DURATION,
  CASE
    WHEN CAST(TRY_TO_DOUBLE(p.PROP_LOANTOVAL) AS FLOAT) <= 60 THEN '0-60%'
    WHEN CAST(TRY_TO_DOUBLE(p.PROP_LOANTOVAL) AS FLOAT) <= 70 THEN '60-70%'
    WHEN CAST(TRY_TO_DOUBLE(p.PROP_LOANTOVAL) AS FLOAT) <= 80 THEN '70-80%'
    WHEN CAST(TRY_TO_DOUBLE(p.PROP_LOANTOVAL) AS FLOAT) <= 90 THEN '80-90%'
    WHEN CAST(TRY_TO_DOUBLE(p.PROP_LOANTOVAL) AS FLOAT) <= 95 THEN '90-95%'
    WHEN CAST(TRY_TO_DOUBLE(p.PROP_LOANTOVAL) AS FLOAT) > 95 THEN '95%+'
    ELSE 'Unknown'
  END AS LTV_TIER,
  COUNT(*) AS RECORD_COUNT,
  AVG(p.VALUE_MARKET) AS AVG_MARKET_VALUE,
  AVG(p.MTG1_AMOUNT) AS AVG_LOAN_AMOUNT,
  SUM(p.MTG1_AMOUNT) AS TOTAL_LIENS
FROM VW_BI_PROP p
GROUP BY 1,2,3,4,5,6,7,8,9,10,11
`.trim();

export const CREATE_CASCADE_OWNERSHIP_VIEW_SQL = `
CREATE OR REPLACE VIEW VW_CASCADE_OWNERSHIP AS
SELECT
  p.STATE, p.CNTYCD AS COUNTY, p.CITY, p.ZIP,
  n.ETHNICITYCD,
  CASE n.ETHNICITYCD
    WHEN 'Y' THEN 'Hispanic'
    WHEN 'F' THEN 'African American'
    WHEN 'A' THEN 'Asian'
    ELSE 'Not Identified'
  END AS ETHNICITYCD,
  n.GENDER,
  n.MARRIEDCD,
  CASE n.EDUCATIONCD
    WHEN 'A' THEN 'High School'
    WHEN 'B' THEN 'College'
    WHEN 'C' THEN 'Graduate'
    WHEN 'D' THEN 'Other'
    ELSE 'Unknown'
  END AS EDUCATION_LEVEL,
  CASE
    WHEN n.EHI <= 3 THEN '$10K-$30K'
    WHEN n.EHI <= 5 THEN '$30K-$50K'
    WHEN n.EHI <= 8 THEN '$50K-$100K'
    WHEN n.EHI <= 12 THEN '$100K-$250K'
    WHEN n.EHI <= 15 THEN '$250K-$500K'
    ELSE '$500K+'
  END AS INCOME_TIER,
  n.WEALTHSCR AS WEALTH_SCORE,
  COUNT(*) AS RECORD_COUNT
FROM VW_RESIDENTIAL_PROP p
JOIN NARC3 n ON p.PID = n.PID
GROUP BY 1,2,3,4,5,6,7,8,9,10,11
`.trim();

export const CREATE_LOOKUP_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS LOOKUP_VALUE_RANGES (
  RANGE_TYPE  TEXT,
  RANGE_LABEL TEXT,
  MIN_VAL     NUMERIC,
  MAX_VAL     NUMERIC,
  SORT_ORDER  INTEGER
);
INSERT INTO LOOKUP_VALUE_RANGES
  SELECT * FROM VALUES
  ('purchase_value','$25K-$100K',25000,100000,1),
  ('purchase_value','$100K-$250K',100001,250000,2),
  ('purchase_value','$250K-$400K',250001,400000,3),
  ('purchase_value','$400K-$750K',400001,750000,4),
  ('purchase_value','$750K-$1M',750001,1000000,5),
  ('purchase_value','$1M+',1000001,999999999,6),
  ('market_value','$25K-$100K',25000,100000,1),
  ('market_value','$100K-$250K',100001,250000,2),
  ('market_value','$250K-$400K',250001,400000,3),
  ('market_value','$400K-$750K',400001,750000,4),
  ('market_value','$750K-$1M',750001,1000000,5),
  ('market_value','$1M+',1000001,999999999,6),
  ('ltv','0-60%',0,60,1),
  ('ltv','60-70%',60,70,2),
  ('ltv','70-80%',70,80,3),
  ('ltv','80-90%',80,90,4),
  ('ltv','90-95%',90,95,5),
  ('ltv','95%+',95,100,6),
  ('income','$10K-$30K',10000,30000,1),
  ('income','$30K-$50K',30001,50000,2),
  ('income','$50K-$100K',50001,100000,3),
  ('income','$100K-$250K',100001,250000,4),
  ('income','$250K-$500K',250001,500000,5),
  ('income','$500K+',500001,999999,6),
  ('credit_score','<500',0,499,1),
  ('credit_score','501-600',501,600,2),
  ('credit_score','601-660',601,660,3),
  ('credit_score','661-700',661,700,4),
  ('credit_score','701-800',701,800,5),
  ('credit_score','801+',801,999,6)
  AS t(RANGE_TYPE,RANGE_LABEL,MIN_VAL,MAX_VAL,SORT_ORDER)
`.trim();

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



