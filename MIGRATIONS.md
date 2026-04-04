# ICONYCS Snowflake Migrations

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
