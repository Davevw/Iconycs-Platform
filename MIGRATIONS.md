# ICONYCS Snowflake Migrations

---

## Sprint 2 — Cascade Views + Lookup Tables

### VW_CASCADE_PROPERTY

Pre-aggregated property cascade dimensions: value tiers, LTV tiers, ownership duration, loan type, occupancy, attached/detached.

```sql
CREATE OR REPLACE VIEW VW_CASCADE_PROPERTY AS
SELECT
  p.STATE,
  p.CNTYCD AS COUNTY,
  p.CITY,
  p.ZIP,
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
GROUP BY 1,2,3,4,5,6,7,8,9,10,11;
```

### VW_CASCADE_OWNERSHIP

Demographic cascade dimensions joined to property records.

```sql
CREATE OR REPLACE VIEW VW_CASCADE_OWNERSHIP AS
SELECT
  p.STATE,
  p.CNTYCD AS COUNTY,
  p.CITY,
  p.ZIP,
  n.ETHNICITYCD,
  CASE n.ETHNICITYCD
    WHEN 'Y' THEN 'Hispanic'
    WHEN 'F' THEN 'African American'
    WHEN 'A' THEN 'Asian'
    ELSE 'Not Identified'
  END AS ETHNICITY_DESC,
  n.GENDER,
  n.MARITALSTAT,
  CASE n.EDUCATIONCD
    WHEN 'A' THEN 'High School'
    WHEN 'B' THEN 'College'
    WHEN 'C' THEN 'Graduate'
    WHEN 'D' THEN 'Other'
    ELSE 'Unknown'
  END AS EDUCATION_LEVEL,
  CASE
    WHEN n.EHI_CODE <= 3 THEN '$10K-$30K'
    WHEN n.EHI_CODE <= 5 THEN '$30K-$50K'
    WHEN n.EHI_CODE <= 8 THEN '$50K-$100K'
    WHEN n.EHI_CODE <= 12 THEN '$100K-$250K'
    WHEN n.EHI_CODE <= 15 THEN '$250K-$500K'
    ELSE '$500K+'
  END AS INCOME_TIER,
  n.WEALTHSCR AS WEALTH_SCORE,
  COUNT(*) AS RECORD_COUNT
FROM VW_RESIDENTIAL_PROP p
JOIN NARC3 n ON p.PID = n.PID
GROUP BY 1,2,3,4,5,6,7,8,9,10,11;
```

### LOOKUP_VALUE_RANGES

Single-source lookup table for all range/tier definitions.

```sql
CREATE TABLE IF NOT EXISTS LOOKUP_VALUE_RANGES (
  RANGE_TYPE  TEXT,
  RANGE_LABEL TEXT,
  MIN_VAL     NUMERIC,
  MAX_VAL     NUMERIC,
  SORT_ORDER  INTEGER
);

-- Purchase / Market value ranges
INSERT INTO LOOKUP_VALUE_RANGES VALUES
  ('purchase_value', '$25K-$100K',   25000,    100000,    1),
  ('purchase_value', '$100K-$250K',  100001,   250000,    2),
  ('purchase_value', '$250K-$400K',  250001,   400000,    3),
  ('purchase_value', '$400K-$750K',  400001,   750000,    4),
  ('purchase_value', '$750K-$1M',    750001,   1000000,   5),
  ('purchase_value', '$1M+',         1000001,  999999999, 6),
  ('market_value',  '$25K-$100K',    25000,    100000,    1),
  ('market_value',  '$100K-$250K',   100001,   250000,    2),
  ('market_value',  '$250K-$400K',   250001,   400000,    3),
  ('market_value',  '$400K-$750K',   400001,   750000,    4),
  ('market_value',  '$750K-$1M',     750001,   1000000,   5),
  ('market_value',  '$1M+',          1000001,  999999999, 6);

-- LTV ranges
INSERT INTO LOOKUP_VALUE_RANGES VALUES
  ('ltv', '0-60%',  0,    60,   1),
  ('ltv', '60-70%', 60,   70,   2),
  ('ltv', '70-80%', 70,   80,   3),
  ('ltv', '80-90%', 80,   90,   4),
  ('ltv', '90-95%', 90,   95,   5),
  ('ltv', '95%+',   95,   100,  6);

-- Income ranges (maps to EHI_CODE buckets)
INSERT INTO LOOKUP_VALUE_RANGES VALUES
  ('income', '$10K-$30K',   10000,  30000,  1),
  ('income', '$30K-$50K',   30001,  50000,  2),
  ('income', '$50K-$100K',  50001,  100000, 3),
  ('income', '$100K-$250K', 100001, 250000, 4),
  ('income', '$250K-$500K', 250001, 500000, 5),
  ('income', '$500K+',      500001, 999999, 6);

-- Credit score ranges
INSERT INTO LOOKUP_VALUE_RANGES VALUES
  ('credit_score', '<500',     0,   499, 1),
  ('credit_score', '501-600',  501, 600, 2),
  ('credit_score', '601-660',  601, 660, 3),
  ('credit_score', '661-700',  661, 700, 4),
  ('credit_score', '701-800',  701, 800, 5),
  ('credit_score', '801+',     801, 999, 6);
```

**How to run Sprint 2 migrations via API:**
```bash
curl -X POST https://iconycs.com/api/snowflake/migrate \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_SECRET_HERE" \
  -d '{"migration":"cascade_views"}'

curl -X POST https://iconycs.com/api/snowflake/migrate \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_SECRET_HERE" \
  -d '{"migration":"lookup_tables"}'
```

---

## Sprint 1 — VW_LTV_TIERS View

**Status:** Must be run once in Snowflake before LTV endpoint returns data.

**How to run:**

Option A — Direct in Snowflake UI:
```sql
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
GROUP BY 1,2,3,4,5,6;
```

Option B — Via API (set ADMIN_MIGRATE_SECRET in Vercel env vars first):
```bash
curl -X POST https://iconycs.com/api/snowflake/migrate \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: YOUR_SECRET_HERE" \
  -d '{"migration":"ltv_view"}'
```

## Required Vercel Environment Variables

Set these in the Vercel dashboard → Settings → Environment Variables:

```
SNOWFLAKE_ACCOUNT=xp62895.west-us-2.azure
SNOWFLAKE_USER=IconycsHA1234
SNOWFLAKE_PASSWORD=!Dave0145
SNOWFLAKE_WAREHOUSE=QRY_WAREHOUSE
SNOWFLAKE_DATABASE=PROPERTYANALYTICS
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_ROLE=ACCOUNTADMIN
ADMIN_MIGRATE_SECRET=<generate a secure random string>
```
