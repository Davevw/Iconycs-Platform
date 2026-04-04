# ICONYCS Sprint 1 — Live Data + Core Reporting Build Spec
## Date: April 4, 2026
## Priority: HIGH — Top shelf production quality

---

## CONTEXT
ICONYCS Housing Analytics — iconycs.com/reports
- Next.js 14 app, deployed on Vercel
- Snowflake backend: account=xp62895.west-us-2.azure, user=IconycsHA1234, password=!Dave0145
- Warehouse=QRY_WAREHOUSE, Database=PROPERTYANALYTICS, Schema=PUBLIC
- GitHub: Davevw/Iconycs-Platform
- Supabase: vdgxbfumlysatthimpcb.supabase.co (for auth/subscriptions later)

## EXISTING VIEWS IN SNOWFLAKE (use these — do not modify)
- VW_DASHBOARD_NATIONAL — national aggregates
- VW_DASHBOARD_STATE — by STATE
- VW_DASHBOARD_COUNTY — by STATE, COUNTY
- VW_DASHBOARD_CITY — by STATE, CITY
- VW_DASHBOARD_ZIP — by STATE, ZIP
- VW_LENDER_ANALYSIS — STATE, CITY, ZIP, LENDER_NAME, MTG1_LOAN_CATEGORY, ETHNICITY, INCOME_TIER, LOAN_COUNT, AVG_LOAN_AMOUNT, AVG_RATE, AVG_PROPERTY_VALUE
- VW_RESIDENTIAL_PROP — full property records (130M rows) — use with WHERE + LIMIT only
- VW_RESIDENTIAL_DEMO — property + demographic fields
- NARC3 — ethnicity data (join on PID)
- VW_BI_PROP — has PROP_LOANTOVAL (raw LTV integer)
- NACR_MRKTHOMEVAL — home value tier lookup (CODE, DESC)
- PROP_MTGLOANCD — mortgage loan code lookup

## SPRINT 1 TASKS — IN ORDER

### TASK 1: Snowflake API Routes
Create `app/api/snowflake/` directory with these route files:
- `national/route.ts` — query VW_DASHBOARD_NATIONAL
- `state/route.ts` — query VW_DASHBOARD_STATE where STATE = param
- `county/route.ts` — query VW_DASHBOARD_COUNTY where STATE = param
- `city/route.ts` — query VW_DASHBOARD_CITY where STATE = param, optionally CITY
- `zip/route.ts` — query VW_DASHBOARD_ZIP where STATE = param, optionally ZIP
- `lenders/route.ts` — query VW_LENDER_ANALYSIS with filters
- `ltv/route.ts` — LTV tier distribution query (see below)
- `trends/route.ts` — recording date year distribution query
- `parcels/route.ts` — property detail query (requires auth code)

Use snowflake-sdk or snowflake.connector via edge runtime.
**Connection pattern:** Use environment variables:
```
SNOWFLAKE_ACCOUNT=xp62895.west-us-2.azure
SNOWFLAKE_USER=IconycsHA1234
SNOWFLAKE_PASSWORD=!Dave0145
SNOWFLAKE_WAREHOUSE=QRY_WAREHOUSE
SNOWFLAKE_DATABASE=PROPERTYANALYTICS
SNOWFLAKE_SCHEMA=PUBLIC
```

### TASK 2: LTV Tier Snowflake View
Create this view in Snowflake (run via API or include as migration):
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
  END as LTV_TIER,
  COUNT(*) as RECORD_COUNT,
  AVG(MTG1_AMOUNT) as AVG_LOAN_AMOUNT,
  AVG(VALUE_MARKET) as AVG_PROPERTY_VALUE
FROM VW_BI_PROP p
LEFT JOIN NARC3 n ON p.PID = n.PID
WHERE PROP_LOANTOVAL IS NOT NULL AND PROP_LOANTOVAL != ''
GROUP BY 1,2,3,4,5,6;
```

### TASK 3: Reports Page — Replace Static Data with Live API Calls
File: `app/reports/page.tsx`

Replace ALL hardcoded/static data with live API calls:
- National totals → fetch from /api/snowflake/national
- State property counts/avg values → fetch from /api/snowflake/state
- City drill-down → fetch from /api/snowflake/city?state=XX
- ZIP drill-down → fetch from /api/snowflake/zip?state=XX&city=YY
- Ethnicity pie chart → from VW_DASHBOARD_NATIONAL/STATE/CITY (has ETHNICITY field)
- Mortgage type chart → from MTG1_LOAN_CATEGORY field in dashboard views
- LTV panel → from /api/snowflake/ltv

Keep all existing UI components (FreqTable, PieChart, HBarChart) — just feed them live data.
Add loading states (skeleton loaders) while data fetches.
Add error states gracefully.

### TASK 4: Add County Level to Drill-Down
Current: State → City → ZIP
New: State → County → City → ZIP

- Add county selector after state selection
- Fetch counties from VW_DASHBOARD_COUNTY for selected state
- When county selected, filter city list to that county

### TASK 5: Data Source Labels
NEVER use "Infutor" anywhere in the UI.
Use these labels:
- "Direct Identified Records" — individually sourced ownership + demographic data
- "Area Estimates" — for any modeled/aggregated data
- "Property Records" — for physical property data
- Confidence indicator on ethnicity data:
  - 🟢 "Direct Identified" (DEMOLVL=1)
  - 🟡 "Household Modeled" (DEMOLVL=2)
  - 🔴 "Area Estimated" (DEMOLVL=3)

Add a small methodology note at bottom of every report:
"Data sourced from Direct Identified Records (individually sourced property and ownership data) and public records. Geographic coverage: 50 states + DC. Property count: 130M+."

### TASK 6: Mortgage Reporting Panel
Add a new "Mortgage Intelligence" section to the reports page showing:
- Loan type breakdown (Conventional/FHA/VA/Private/Other) — pie chart
- Average loan amount by loan type — bar chart
- LTV tier distribution — bar chart (FNMA tiers)
- Top 10 lenders by volume — frequency table
- Avg interest rate (note: limited coverage ~9.5% of records)

All panels drill down with geography selection.

### TASK 7: Time Period Selector
Add time period selector to reports header:
Options: All Time | Last 5 Years | 2020-2024 | 2015-2019 | 2010-2014 | 2005-2009 | Custom Range

Filter queries using RECORDING_DATE field (format YYYYMMDD):
```sql
WHERE LEFT(RECORDING_DATE, 4) BETWEEN '2020' AND '2024'
```

Add trend chart: recording count by year (line chart) — shows market activity over time.

### TASK 8: Interactive/Animated Charts
Upgrade existing charts:
- Pie charts: add hover tooltips with count + percentage
- Bar charts: add hover tooltips
- Add "pop-out" modal for any chart (click to expand full-screen)
- Add subtle entrance animations (fade in on load)
- Charts should be clickable — clicking a slice/bar filters the rest of the dashboard

Use Recharts library (already likely in package.json, add if not).

### TASK 9: Export Button (PDF)
Add "Export Report" button to report header.
On click:
- Generate a clean print-friendly version of current report
- Use browser's window.print() with print-specific CSS as Phase 1
- Include: ICONYCS logo/branding, report title, geography selection, timestamp, methodology note
- Label: "Download PDF Report"

Phase 2 will be server-side PDF generation with full formatting.

### TASK 10: Parcel Modal — Wire to Live Data
Current parcel modal shows 5 fake sample records.
Replace with real Snowflake query:
```sql
SELECT 
  CONCAT(p.HOUSE, ' ', p.STREET, ' ', p.STRTYPE) as ADDRESS,
  p.CITY, p.STATE, p.ZIP,
  p.VALUE_MARKET,
  p.LIVING_SQFT,
  p.BEDROOMS, p.BATHS_CALC,
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
  END as ETHNICITY_DESC
FROM VW_RESIDENTIAL_PROP p
LEFT JOIN NARC3 n ON p.PID = n.PID
WHERE p.STATE = :state
AND p.CITY = :city
ORDER BY p.VALUE_MARKET DESC
LIMIT 50
```

Show paginated table with sorting. Add FNMA LTV tier badge per record.

---

## DESIGN STANDARDS
- Keep existing warm light theme (C color constants)
- Navy headers, terra accents, sage for positive indicators
- Font: Outfit (body), IBM Plex Mono (numbers), Source Serif 4 (titles)
- All numbers: use toLocaleString() formatting
- Percentages: 1 decimal place
- Dollar amounts: $X,XXX,XXX format
- Loading states: skeleton shimmer effect in bgWarm color
- Error states: subtle terra-colored message, retry button
- Mobile responsive: sidebar collapses to top filter bar on mobile

## ARCHITECTURE NOTES (future-proof)
- All Snowflake queries in a single `lib/snowflake-queries.ts` file — never inline SQL in components
- All chart configs in `lib/chart-config.ts` — easy to modify
- All data labels/terminology in `lib/data-labels.ts` — single source of truth for terminology
- API routes should accept: state, county, city, zip, ethnicity, loan_type, time_period, ltv_tier as filter params
- Design for adding new dimensions without rewriting — config-driven where possible

## QUALITY BAR
- No TypeScript errors
- No console errors
- Loading states on all async operations
- Graceful error handling (Snowflake timeouts etc.)
- Data freshness indicator (show when data was last updated)
- All charts labeled clearly — no ambiguous axes
- Methodology note on every ethnicity-related chart

## COMMIT STRATEGY
- Commit after each task completes
- Commit message format: "ICONYCS Sprint1: Task N — description"
- Push to main branch (deploys to Vercel automatically)

---
*Spec authored by Keystone AI — April 4, 2026*
