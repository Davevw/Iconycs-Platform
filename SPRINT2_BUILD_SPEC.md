# ICONYCS Sprint 2 — Cascade Engine + Demographics Build Spec
## Date: April 4, 2026
## Priority: HIGH — This is the core product differentiator

---

## CONTEXT
Sprint 1 complete: live Snowflake API routes, reports page wired to live data, county drill-down, mortgage panel, time selector, animated charts, export PDF, live parcel records.

Sprint 2 builds the FULL cascade system as originally designed by David Van Waldick.

Read these files for full context:
- C:\Users\dave\.openclaw\workspace\iconycs\TOP_CASCADE_SPEC.md
- C:\Users\dave\.openclaw\workspace\iconycs\ICONYCS_VISION_SYNTHESIS.md
- C:\Users\dave\.openclaw\workspace\iconycs-platform\SPRINT1_BUILD_SPEC.md

---

## SPRINT 2 TASKS

### TASK 1: Snowflake Views for All Cascade Dimensions
Create these views in Snowflake (add SQL to MIGRATIONS.md, also add API routes):

```sql
-- VW_CASCADE_PROPERTY: property value + LTV + date + loan type buckets
CREATE OR REPLACE VIEW VW_CASCADE_PROPERTY AS
SELECT
  p.STATE, p.CNTYCD as COUNTY, p.CITY, p.ZIP,
  p.MTG1_LOAN_CATEGORY as LOAN_TYPE,
  p.PROP_OWNEROCC as OCCUPANCY,
  CASE WHEN p.PROPERTY_CATEGORY = 'SINGLE FAMILY' THEN 'Detached'
       WHEN p.PROPERTY_CATEGORY LIKE '%CONDO%' THEN 'Attached'
       ELSE 'Other' END as ATTACHED_DETACHED,
  -- Purchase value tier
  CASE
    WHEN p.SALE_AMOUNT <= 100000 THEN '$25K-$100K'
    WHEN p.SALE_AMOUNT <= 250000 THEN '$100K-$250K'
    WHEN p.SALE_AMOUNT <= 400000 THEN '$250K-$400K'
    WHEN p.SALE_AMOUNT <= 750000 THEN '$400K-$750K'
    WHEN p.SALE_AMOUNT <= 1000000 THEN '$750K-$1M'
    WHEN p.SALE_AMOUNT > 1000000 THEN '$1M+'
    ELSE 'Unknown'
  END as PURCHASE_VALUE_TIER,
  -- Market value tier
  CASE
    WHEN p.VALUE_MARKET <= 100000 THEN '$25K-$100K'
    WHEN p.VALUE_MARKET <= 250000 THEN '$100K-$250K'
    WHEN p.VALUE_MARKET <= 400000 THEN '$250K-$400K'
    WHEN p.VALUE_MARKET <= 750000 THEN '$400K-$750K'
    WHEN p.VALUE_MARKET <= 1000000 THEN '$750K-$1M'
    WHEN p.VALUE_MARKET > 1000000 THEN '$1M+'
    ELSE 'Unknown'
  END as MARKET_VALUE_TIER,
  -- Purchase date / ownership duration tier
  CASE
    WHEN DATEDIFF('month', TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 12 THEN '0-1 Year'
    WHEN DATEDIFF('month', TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 24 THEN '1-2 Years'
    WHEN DATEDIFF('month', TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 60 THEN '2-5 Years'
    WHEN DATEDIFF('month', TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 120 THEN '5-10 Years'
    WHEN DATEDIFF('month', TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) <= 240 THEN '10-20 Years'
    WHEN DATEDIFF('month', TO_DATE(p.RECORDING_DATE, 'YYYYMMDD'), CURRENT_DATE()) > 240 THEN '20+ Years'
    ELSE 'Unknown'
  END as OWNERSHIP_DURATION,
  -- LTV tier
  CASE
    WHEN CAST(p.PROP_LOANTOVAL AS FLOAT) <= 60 THEN '0-60%'
    WHEN CAST(p.PROP_LOANTOVAL AS FLOAT) <= 70 THEN '60-70%'
    WHEN CAST(p.PROP_LOANTOVAL AS FLOAT) <= 80 THEN '70-80%'
    WHEN CAST(p.PROP_LOANTOVAL AS FLOAT) <= 90 THEN '80-90%'
    WHEN CAST(p.PROP_LOANTOVAL AS FLOAT) <= 95 THEN '90-95%'
    WHEN CAST(p.PROP_LOANTOVAL AS FLOAT) > 95 THEN '95%+'
    ELSE 'Unknown'
  END as LTV_TIER,
  COUNT(*) as RECORD_COUNT,
  AVG(p.VALUE_MARKET) as AVG_MARKET_VALUE,
  AVG(p.MTG1_AMOUNT) as AVG_LOAN_AMOUNT,
  SUM(p.MTG1_AMOUNT) as TOTAL_LIENS
FROM VW_BI_PROP p
GROUP BY 1,2,3,4,5,6,7,8,9,10,11;

-- VW_CASCADE_OWNERSHIP: demographics by geography
CREATE OR REPLACE VIEW VW_CASCADE_OWNERSHIP AS
SELECT
  p.STATE, p.CNTYCD as COUNTY, p.CITY, p.ZIP,
  n.ETHNICITYCD,
  CASE n.ETHNICITYCD
    WHEN 'Y' THEN 'Hispanic'
    WHEN 'F' THEN 'African American'
    WHEN 'A' THEN 'Asian'
    ELSE 'Not Identified'
  END as ETHNICITY_DESC,
  n.GENDER,
  n.MARITALSTAT,
  -- Education tier
  CASE n.EDUCATIONCD
    WHEN 'A' THEN 'High School'
    WHEN 'B' THEN 'College'
    WHEN 'C' THEN 'Graduate'
    WHEN 'D' THEN 'Other'
    ELSE 'Unknown'
  END as EDUCATION_LEVEL,
  -- Income tier
  CASE
    WHEN n.EHI_CODE <= 3 THEN '$10K-$30K'
    WHEN n.EHI_CODE <= 5 THEN '$30K-$50K'
    WHEN n.EHI_CODE <= 8 THEN '$50K-$100K'
    WHEN n.EHI_CODE <= 12 THEN '$100K-$250K'
    WHEN n.EHI_CODE <= 15 THEN '$250K-$500K'
    ELSE '$500K+'
  END as INCOME_TIER,
  n.WEALTHSCR as WEALTH_SCORE,
  COUNT(*) as RECORD_COUNT
FROM VW_RESIDENTIAL_PROP p
JOIN NARC3 n ON p.PID = n.PID
GROUP BY 1,2,3,4,5,6,7,8,9,10,11;
```

### TASK 2: Cascade API Routes
Add to `app/api/snowflake/`:
- `cascade/property/route.ts` — query VW_CASCADE_PROPERTY with filters
- `cascade/ownership/route.ts` — query VW_CASCADE_OWNERSHIP with filters
- `cascade/lenders/route.ts` — top lenders with count + avg loan by geography

All routes accept: state, county, city, zip, time_period, loan_type, ltv_tier, value_tier, ethnicity as params.

### TASK 3: Cascade Report Builder UI
Create `app/reports/cascade/page.tsx` — the Matrix/Cascade report builder.

**Layout:**
- Left sidebar: "Start Point" selector (5 cascade types: Property, Ownership, Social, Media, Lender)
- Main area: selected cascade renders with charts + frequency tables
- Breadcrumb nav at top: shows current drill path (e.g., CA > Los Angeles County > Los Angeles)
- Floating "↑ Back" button bottom-right
- Each cascade shows: count, % of total, avg value, avg LTV

**Property Cascade View:**
- Purchase Value tier breakdown (bar chart + freq table)
- Market Value tier breakdown
- Ownership Duration breakdown
- LTV tier breakdown (use FNMA tiers from spec)
- Loan Type pie chart (C/F/V/O)
- Top 10 Lenders frequency table

**Ownership Cascade View:**
- Ethnicity breakdown (pie chart + freq table) with confidence badges
- Gender breakdown (M/F/Unknown)
- Marital Status (Married/Not/Unknown)
- Education Level (HS/College/Graduate/Other)
- Income Tier breakdown
- Wealth Score (A-H) breakdown

Each dimension is clickable → filters ALL other charts on the page.

### TASK 4: Demographics Expansion on Main Reports Page
Add new "Demographics Deep Dive" section to `app/reports/page.tsx`:
- Gender breakdown chart (pull GENDER from NARC3 via new API)
- Marital status breakdown
- Education level breakdown
- Income range breakdown
- Wealth score breakdown (A-H with descriptions)
- "Social Housing Score" composite — calculate as weighted index of ethnicity diversity, income diversity, LTV distribution for a geography

### TASK 5: Social Housing Score
Compute a "Social Housing Score" for any geography (0-100):
- Formula: weighted combination of:
  - Ethnic diversity index (higher diversity = higher score)
  - Income diversity (spread across tiers)
  - LTV distribution (lower avg LTV = higher score)
  - Owner-occupancy rate (higher = higher score)
- Display as: score badge (0-100) with color (green 70+, yellow 40-70, red <40)
- Add to every geography card in drill-down
- This is a PREMIUM feature — show for Pro/Enterprise tier

### TASK 6: Value Range Lookup Tables in Snowflake
Create lookup tables exactly as specified in TOP_CASCADE_SPEC.md:
```sql
CREATE TABLE IF NOT EXISTS LOOKUP_VALUE_RANGES (
  RANGE_TYPE TEXT, RANGE_LABEL TEXT, MIN_VAL NUMERIC, MAX_VAL NUMERIC, SORT_ORDER INTEGER
);
-- Insert purchase/market value ranges
INSERT INTO LOOKUP_VALUE_RANGES VALUES
('purchase_value', '$25K-$100K', 25000, 100000, 1),
('purchase_value', '$100K-$250K', 100001, 250000, 2),
('purchase_value', '$250K-$400K', 250001, 400000, 3),
('purchase_value', '$400K-$750K', 400001, 750000, 4),
('purchase_value', '$750K-$1M', 750001, 1000000, 5),
('purchase_value', '$1M+', 1000001, 999999999, 6);
-- Same for market_value, ltv, income, purchase_date, credit_score
```

### TASK 7: Subscription Tier Gating (UI only — no payment yet)
Add tier badge to reports page header:
- Free tier badge: shows what's locked
- Lock icons (🔒) on premium features: cascade builder, demographics deep dive, social housing score, export

Add a "Upgrade to Pro" banner for locked features.
Don't implement Stripe yet — just the UI gating with a "Coming Soon" modal.

Tier definitions:
- **Free (Explore)**: National/State, basic ethnicity + loan type, 3 report views/day
- **Pro Analyst ($49/mo)**: Full geography drill-down, all demographics, PDF export, cascade builder
- **Enterprise ($199/mo)**: Social Housing Score, matrix builder, API access, custom data feeds
- **Data Partner ($999/mo)**: Snowflake direct access, bulk data, custom views

---

## DESIGN STANDARDS
Same as Sprint 1 — warm light theme, navy headers, terra accents, Outfit font.

New for Sprint 2:
- Cascade pages: slightly darker background (#F5F0E8) to differentiate from main reports
- Tier badges: terra for Pro, navy for Enterprise, gold (#B8860B) for Data Partner
- Social Housing Score: circular gauge component, green/yellow/red

## ARCHITECTURE NOTES
- All cascade SQL in `lib/snowflake-queries.ts` (extend existing file)
- All range/tier lookups in `lib/tiers.ts` (new file — single source of truth for all bucket definitions)
- Cascade state managed with URL params so pages are shareable/bookmarkable
- API routes: follow existing pattern with nodejs runtime

## COMMIT STRATEGY
- Commit after each task
- Format: "ICONYCS Sprint2: Task N — description"
- Push to main → auto-deploys to Vercel

## QUALITY BAR
Same as Sprint 1 — no TypeScript errors, no console errors, loading states, graceful error handling.

---
*Spec authored by Keystone AI — April 4, 2026*
*Based on original ICONYCS cascade design by David Van Waldick*
