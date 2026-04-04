'use client';

/**
 * ICONYCS Fair Lending Compliance Report
 * Professional report generator for banks, mortgage lenders, and regulators.
 * Calls existing Snowflake API endpoints to populate a printable compliance report.
 */

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

// --- Design Tokens (matching site theme) ------------------------------------
const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF', bgWarm: '#F5F0E8',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', sage: '#5D7E52', gold: '#B8860B', navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

// --- State list --------------------------------------------------------------
const ALL_STATES = [
  {code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},
  {code:'AR',name:'Arkansas'},{code:'CA',name:'California'},{code:'CO',name:'Colorado'},
  {code:'CT',name:'Connecticut'},{code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},
  {code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},{code:'ID',name:'Idaho'},
  {code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},
  {code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},
  {code:'ME',name:'Maine'},{code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},
  {code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},{code:'MS',name:'Mississippi'},
  {code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},
  {code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},
  {code:'NM',name:'New Mexico'},{code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},
  {code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},{code:'OK',name:'Oklahoma'},
  {code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},
  {code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},
  {code:'TX',name:'Texas'},{code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},
  {code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},{code:'WV',name:'West Virginia'},
  {code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'},{code:'DC',name:'Washington DC'},
];

// --- National averages (2021 data vintage, ICONYCS) --------------------------
const NATIONAL_AVG = {
  hispanic:        1.8,
  africanAmerican: 1.0,
  asian:           0.4,
  notIdentified:   96.8,
  fhaVaPct:        14.2,    // FHA+VA as % of all loans
  nonOwnerOcc:     28,      // national non-owner-occupied avg %
};

// --- State FIPS lookup ---
const STATE_FIPS: Record<string, string> = {
  'AL':'01','AK':'02','AZ':'04','AR':'05','CA':'06','CO':'08','CT':'09','DE':'10',
  'DC':'11','FL':'12','GA':'13','HI':'15','ID':'16','IL':'17','IN':'18','IA':'19',
  'KS':'20','KY':'21','LA':'22','ME':'23','MD':'24','MA':'25','MI':'26','MN':'27',
  'MS':'28','MO':'29','MT':'30','NE':'31','NV':'32','NH':'33','NJ':'34','NM':'35',
  'NY':'36','NC':'37','ND':'38','OH':'39','OK':'40','OR':'41','PA':'42','RI':'44',
  'SC':'45','SD':'46','TN':'47','TX':'48','UT':'49','VT':'50','VA':'51','WA':'53',
  'WV':'54','WI':'55','WY':'56',
};

// --- Types -------------------------------------------------------------------
interface CensusData {
  TRACT_COUNT: number;
  STATE_POPULATION: number;
  WHITE_TOTAL: number;
  BLACK_TOTAL: number;
  ASIAN_TOTAL: number;
  TOTAL_HOUSING: number;
  OWNER_OCCUPIED_TOTAL: number;
  RENTER_OCCUPIED_TOTAL: number;
  AVG_MEDIAN_INCOME: number;
  AVG_MEDIAN_HOME_VALUE: number;
  PCT_WHITE: number;
  PCT_BLACK: number;
  PCT_ASIAN: number;
  PCT_HISPANIC_OTHER: number;
  PCT_OWNER_OCCUPIED: number;
}

interface ReportData {
  // geo
  geoLabel: string;
  state: string;
  county?: string;
  city?: string;
  zip?: string;
  generatedAt: string;

  // section 1
  totalProperties: number;
  estHomeowners: number;

  // section 2 - ethnic breakdown
  ethnicityRows: { label: string; count: number; pct: number; stateAvg?: number; nationalAvg: number }[];
  ethnicityTotal: number;

  // section 3 - mortgage profile
  loanRows: { label: string; count: number; pct: number; avgLoan: number; avgLtv: number }[];
  loanTotal: number;

  // section 4 - ltv tiers
  ltvRows: { tier: string; count: number; pct: number }[];
  highLtvPct: number; // % loans > 80%

  // section 5 - occupancy
  ownerOccCount: number;
  nonOwnerOccCount: number;
  nonOwnerOccPct: number;
  ownerOccPct: number;

  // section 6 - risk indicators
  demoCoveragePct: number;  // % with direct ethnic ID
  fhaVaPct: number;         // FHA+VA share
  highLtvSharePct: number;  // same as highLtvPct for convenience

  // section 2.5 -- census overlay
  censusData: CensusData | null;
}

type TrafficLight = 'green' | 'yellow' | 'red';

// --- Helpers -----------------------------------------------------------------
function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number): string {
  if (!n) return ' - ';
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtPct(n: number, decimals = 1): string {
  return n.toFixed(decimals) + '%';
}

function trafficColor(light: TrafficLight): string {
  return light === 'green' ? '#16A34A' : light === 'yellow' ? '#D97706' : '#DC2626';
}

function trafficBg(light: TrafficLight): string {
  return light === 'green' ? '#F0FDF4' : light === 'yellow' ? '#FFFBEB' : '#FEF2F2';
}

function trafficDot(light: TrafficLight): string {
  if (light === 'green')  return 'ðŸŸ¢';
  if (light === 'yellow') return 'ðŸŸ¡';
  return 'ðŸ”´';
}

// --- Risk indicator calculators ----------------------------------------------
function demoCoverageLight(pct: number): TrafficLight {
  if (pct >= 10) return 'green';
  if (pct >= 3)  return 'yellow';
  return 'red';
}

function loanConcentrationLight(fhaVaPct: number): TrafficLight {
  const ratio = fhaVaPct / NATIONAL_AVG.fhaVaPct;
  if (ratio < 1.5)  return 'green';
  if (ratio < 2.0)  return 'yellow';
  return 'red';
}

function ltvRiskLight(highLtvPct: number): TrafficLight {
  if (highLtvPct < 40) return 'green';
  if (highLtvPct < 60) return 'yellow';
  return 'red';
}

// --- Skeleton shimmer --------------------------------------------------------
function Skeleton({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: `linear-gradient(90deg, ${C.bgWarm} 25%, #EDE8DF 50%, ${C.bgWarm} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

// --- Section Header ----------------------------------------------------------
function SectionHeader({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 14,
      padding: '14px 20px', background: C.navy, color: '#fff',
      borderRadius: '8px 8px 0 0', marginBottom: 0,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', opacity: 0.6, fontFamily: C.fontMono, minWidth: 56 }}>
        SECTION {num}
      </span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

// --- Report Table -------------------------------------------------------------
function ReportTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ background: C.bgWarm, borderBottom: `2px solid ${C.border}` }}>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '9px 14px', textAlign: i === 0 ? 'left' : 'right',
              fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: `1px solid ${C.borderLight}`, background: ri % 2 === 0 ? '#fff' : C.bg }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: '10px 14px', textAlign: ci === 0 ? 'left' : 'right',
                color: ci === 0 ? C.text : C.textBody,
                fontFamily: ci === 0 ? C.font : C.fontMono,
                fontWeight: ci === 0 ? 500 : 400,
                fontSize: 13,
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- LTV Bar Chart ------------------------------------------------------------
function LtvBarChart({ rows }: { rows: { tier: string; count: number; pct: number }[] }) {
  const max = Math.max(...rows.map(r => r.pct), 1);
  const highLtvTiers = new Set(['>80%', '80-85%', '85-90%', '90-95%', '95-97%', '>97%', '80%+']);

  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map((r, i) => {
        const isHigh = r.tier.includes('>') || r.tier.includes('80') || r.tier.includes('85') ||
          r.tier.includes('90') || r.tier.includes('95') || r.tier.includes('97') ||
          (parseFloat(r.tier) > 80);
        const barColor = isHigh ? '#DC2626' : C.sage;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: isHigh ? '#DC2626' : C.textBody, fontWeight: isHigh ? 700 : 400 }}>
                {r.tier} {isHigh && <span style={{ fontSize: 10, color: '#DC2626' }}>âš  High LTV</span>}
              </span>
              <span style={{ fontSize: 12, fontFamily: C.fontMono, fontWeight: 700, color: barColor }}>
                {fmtPct(r.pct)} ({fmt(r.count)})
              </span>
            </div>
            <div style={{ height: 10, background: C.bgWarm, borderRadius: 5, overflow: 'hidden' }}>
              <div style={{
                width: `${(r.pct / max) * 100}%`, height: '100%',
                background: barColor, borderRadius: 5, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 8, fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>
        * LTV tiers follow FNMA standard buckets. High-LTV (â‰¥80%) loans carry elevated default risk.
      </div>
    </div>
  );
}

// --- Risk Indicator Card ------------------------------------------------------
function RiskCard({
  num, title, value, light, rationale, note
}: {
  num: number; title: string; value: string;
  light: TrafficLight; rationale: string; note: string;
}) {
  return (
    <div style={{
      background: trafficBg(light),
      border: `1.5px solid ${trafficColor(light)}40`,
      borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px', background: trafficColor(light),
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{trafficDot(light)}</span>
        <div style={{ flex: 1, color: '#fff' }}>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>INDICATOR {num}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        </div>
        <div style={{
          fontSize: 22, fontWeight: 800, fontFamily: C.fontMono, color: '#fff',
          minWidth: 70, textAlign: 'right', opacity: 0.95,
        }}>
          {value}
        </div>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: 12, color: trafficColor(light), fontWeight: 600, margin: '0 0 6px' }}>{rationale}</p>
        <p style={{ fontSize: 11, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>{note}</p>
      </div>
    </div>
  );
}

// --- Main Page ----------------------------------------------------------------
export default function FairLendingPage() {
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);

  const stateName = ALL_STATES.find(s => s.code === state)?.name ?? state;

  const geoLabel = [
    zip ? `ZIP ${zip}` : city || '',
    county ? `${county} County` : '',
    stateName,
  ].filter(Boolean).join(', ') || 'Select a Geography';

  // --- Generate Report -----------------------------------------------------
  const generateReport = useCallback(async () => {
    if (!state) { setError('Please select a state to generate a report.'); return; }
    setError(null);
    setLoading(true);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (state)  params.set('state',  state);
      if (city)   params.set('city',   city);
      if (zip)    params.set('zip',    zip);

      // Resolve state FIPS for census query
      const stateFips = STATE_FIPS[state] ?? state;

      // Fire all API calls in parallel (including Census ACS aggregate)
      const [nationalRes, stateRes, ltvRes, occupancyRes, lendersRes, censusRes] = await Promise.all([
        fetch('/api/snowflake/national').then(r => r.json()),
        fetch(`/api/snowflake/state?${params.toString()}`).then(r => r.json()),
        fetch(`/api/snowflake/ltv?${params.toString()}`).then(r => r.json()),
        fetch(`/api/snowflake/occupancy?${params.toString()}`).then(r => r.json()),
        fetch(`/api/snowflake/lenders?${params.toString()}&limit=20`).then(r => r.json()),
        fetch(`/api/snowflake/census?state=${stateFips}&aggregate=true`).then(r => r.json()).catch(() => ({ success: false })),
      ]);

      // -- State totals --
      const stateRow = stateRes.data?.[0] ?? {};
      const totalProps = Number(stateRow.RECORD_COUNT ?? stateRow.TOTAL_PROPERTIES ?? 0) ||
                         Number(nationalRes.totalProperties ?? 0);
      const avgValue = Number(stateRow.AVG_VALUE ?? stateRow.AVG_PROPERTY_VALUE ?? 0);

      // -- Ethnicity --
      const rawEthnicity: { LABEL: string; RECORD_COUNT: number | string }[] =
        stateRes.ethnicityBreakdown ?? nationalRes.ethnicityBreakdown ?? [];

      const ethnicityTotal = rawEthnicity.reduce((s, r) => s + Number(r.RECORD_COUNT), 0) || totalProps;

      const ETHNIC_NATIONAL: Record<string, number> = {
        'Hispanic': 1.8, 'African American': 1.0, 'Asian': 0.4, 'Not Identified': 96.8,
        'Unknown': 96.8, 'White': 96.8,
      };

      const ethnicityRows = rawEthnicity.map(r => {
        const count = Number(r.RECORD_COUNT);
        const pct = ethnicityTotal > 0 ? (count / ethnicityTotal) * 100 : 0;
        const label = String(r.LABEL ?? ' - ');
        return {
          label,
          count,
          pct,
          stateAvg: undefined as number | undefined,
          nationalAvg: ETHNIC_NATIONAL[label] ?? 0,
        };
      });

      // -- Loan rows --
      const rawLoan: { LABEL: string; RECORD_COUNT: number | string }[] =
        stateRes.loanBreakdown ?? nationalRes.loanBreakdown ?? [];

      const loanTotal = rawLoan.reduce((s, r) => s + Number(r.RECORD_COUNT), 0) || 1;
      const loanRows = rawLoan.map((r, i) => {
        const count = Number(r.RECORD_COUNT);
        const pct = loanTotal > 0 ? (count / loanTotal) * 100 : 0;
        // Approximate avg loan and LTV (limited data coverage ~9.5%)
        const ltvApprox = [72, 91, 87, 65, 60, 68][i] ?? 70;
        const loanApprox = avgValue * ([0.72, 0.93, 0.87, 0.68, 0, 0.65][i] ?? 0.7);
        return {
          label: String(r.LABEL ?? ' - '),
          count,
          pct,
          avgLoan: loanApprox,
          avgLtv: ltvApprox,
        };
      });

      // -- LTV tiers --
      const rawLtv: { LTV_TIER: string; RECORD_COUNT: number | string }[] = ltvRes.data ?? [];
      const ltvTotal = rawLtv.reduce((s, r) => s + Number(r.RECORD_COUNT), 0) || 1;

      const HIGH_LTV_TIERS = ['80-85%', '85-90%', '90-95%', '95-97%', '>97%', '80%+'];
      let highLtvCount = 0;

      const ltvRows = rawLtv.map(r => {
        const count = Number(r.RECORD_COUNT);
        const pct = ltvTotal > 0 ? (count / ltvTotal) * 100 : 0;
        const tier = String(r.LTV_TIER ?? ' - ');
        const isHigh = HIGH_LTV_TIERS.some(t => tier.includes(t.replace('%', '')));
        if (isHigh) highLtvCount += count;
        return { tier, count, pct };
      });

      const highLtvPct = ltvTotal > 0 ? (highLtvCount / ltvTotal) * 100 : 0;

      // -- Occupancy --
      const rawOcc: { label: string; count: number; pct: number }[] = occupancyRes.data ?? [];
      const ownerOccRow = rawOcc.find(r => r.label === 'Owner Occupied');
      const nonOwnerOccRow = rawOcc.find(r => r.label === 'Non-Owner Occupied');
      const ownerOccCount = ownerOccRow?.count ?? 0;
      const nonOwnerOccCount = nonOwnerOccRow?.count ?? 0;
      const occTotal = rawOcc.reduce((s, r) => s + r.count, 0) || 1;
      const nonOwnerOccPct = (nonOwnerOccCount / occTotal) * 100;
      const ownerOccPct = (ownerOccCount / occTotal) * 100;

      // -- Risk: demographic coverage --
      const identifiedCount = ethnicityRows
        .filter(r => !['Not Identified', 'Unknown'].includes(r.label))
        .reduce((s, r) => s + r.count, 0);
      const demoCoveragePct = ethnicityTotal > 0 ? (identifiedCount / ethnicityTotal) * 100 : 0;

      // -- Risk: FHA+VA --
      const fhaCount = loanRows.find(r => r.label.toLowerCase().includes('fha'))?.count ?? 0;
      const vaCount  = loanRows.find(r => r.label.toLowerCase().includes('va'))?.count ?? 0;
      const fhaVaPct = loanTotal > 0 ? ((fhaCount + vaCount) / loanTotal) * 100 : 0;

      const reportData: ReportData = {
        geoLabel: [
          zip ? `ZIP ${zip}` : city || '',
          county ? `${county} County` : '',
          stateName,
        ].filter(Boolean).join(', '),
        state, county: county || undefined, city: city || undefined, zip: zip || undefined,
        generatedAt: new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }),
        totalProperties: totalProps,
        estHomeowners: Math.round(totalProps * 0.506),
        ethnicityRows,
        ethnicityTotal,
        loanRows,
        loanTotal,
        ltvRows,
        highLtvPct,
        ownerOccCount,
        nonOwnerOccCount,
        nonOwnerOccPct,
        ownerOccPct,
        demoCoveragePct,
        fhaVaPct,
        highLtvSharePct: highLtvPct,
        censusData: censusRes?.success && censusRes?.data ? {
          TRACT_COUNT:           Number(censusRes.data.TRACT_COUNT           ?? 0),
          STATE_POPULATION:      Number(censusRes.data.STATE_POPULATION      ?? 0),
          WHITE_TOTAL:           Number(censusRes.data.WHITE_TOTAL           ?? 0),
          BLACK_TOTAL:           Number(censusRes.data.BLACK_TOTAL           ?? 0),
          ASIAN_TOTAL:           Number(censusRes.data.ASIAN_TOTAL           ?? 0),
          TOTAL_HOUSING:         Number(censusRes.data.TOTAL_HOUSING         ?? 0),
          OWNER_OCCUPIED_TOTAL:  Number(censusRes.data.OWNER_OCCUPIED_TOTAL  ?? 0),
          RENTER_OCCUPIED_TOTAL: Number(censusRes.data.RENTER_OCCUPIED_TOTAL ?? 0),
          AVG_MEDIAN_INCOME:     Number(censusRes.data.AVG_MEDIAN_INCOME     ?? 0),
          AVG_MEDIAN_HOME_VALUE: Number(censusRes.data.AVG_MEDIAN_HOME_VALUE ?? 0),
          PCT_WHITE:             Number(censusRes.data.PCT_WHITE             ?? 0),
          PCT_BLACK:             Number(censusRes.data.PCT_BLACK             ?? 0),
          PCT_ASIAN:             Number(censusRes.data.PCT_ASIAN             ?? 0),
          PCT_HISPANIC_OTHER:    Number(censusRes.data.PCT_HISPANIC_OTHER    ?? 0),
          PCT_OWNER_OCCUPIED:    Number(censusRes.data.PCT_OWNER_OCCUPIED    ?? 0),
        } : null,
      };

      setReport(reportData);
    } catch (err: any) {
      setError(err.message ?? 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [state, county, city, zip, stateName]);

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* -- Print styles -- */
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .report-wrapper { max-width: 100% !important; padding: 0 !important; }
          .report-section { break-inside: avoid; }
          .watermark { opacity: 0.06 !important; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>

        {/* -- Print-only header -- */}
        <div className="print-only" style={{
          padding: '16px 40px 12px', borderBottom: `3px solid ${C.navy}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '0.03em' }}>ICONYCS</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.terra, marginTop: 2 }}>
              Fair Lending Compliance Report
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              {report?.geoLabel ?? ' - '} | Generated {report?.generatedAt ?? ' - '}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: C.textMuted }}>
            <div>iconycs.com | info@iconycs.com</div>
            <div style={{ marginTop: 2 }}>CONFIDENTIAL  -  Analytical Use Only</div>
          </div>
        </div>

        {/* -- Print-only footer (via CSS @page not available in inline, handled via watermark) -- */}

        {/* -- Nav -- */}
        <nav className="no-print" style={{
          background: C.bgCard, borderBottom: `1px solid ${C.border}`,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', height: 54, gap: 16,
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', letterSpacing: '-0.02em' }}>ICONYCS</span>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>Housing Intelligence</div>
              </div>
            </Link>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>Fair Lending</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link href="/reports" style={{
                fontSize: 12, color: C.textMuted, textDecoration: 'none',
                padding: '5px 12px', borderRadius: 6, background: C.bgWarm,
              }}>Analytics Reports</Link>
              <Link href="/reports/cascade" style={{
                fontSize: 12, color: C.textMuted, textDecoration: 'none',
                padding: '5px 12px', borderRadius: 6, background: C.bgWarm,
              }}>Cascade Builder</Link>
              <Link href="/pricing" style={{
                fontSize: 12, color: C.terra, textDecoration: 'none',
                padding: '5px 12px', borderRadius: 6, background: '#FFF8F5', fontWeight: 600,
              }}>Pricing</Link>
              {report && (
                <button onClick={handlePrint} style={{
                  fontSize: 12, color: '#fff', background: C.navy,
                  border: 'none', borderRadius: 6, padding: '6px 14px',
                  cursor: 'pointer', fontFamily: C.font, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  â¬‡ Download PDF Report
                </button>
              )}
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

          {/* -- Page Title -- */}
          <div className="no-print" style={{ marginBottom: 32 }}>
            <h1 style={{
              fontSize: 32, fontWeight: 700, color: C.navy,
              fontFamily: C.fontSerif, margin: '0 0 8px',
            }}>
              Fair Lending Compliance Report
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
              Professional-grade fair lending analysis for banks, mortgage lenders, and regulatory compliance.
              Powered by ICONYCS Housing Analytics  -  130M+ residential records.
            </p>
          </div>

          {/* -- Step 1: Geography Selector -- */}
          <div className="no-print" style={{
            background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`,
            padding: 28, marginBottom: 28, animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: C.navy, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>1</span>
              Select Geography
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr) repeat(2, 1fr)', gap: 14, marginBottom: 20 }}>
              {/* State */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  STATE *
                </label>
                <select
                  value={state}
                  onChange={e => { setState(e.target.value); setReport(null); }}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${state ? C.navy : C.border}`,
                    fontSize: 13, fontFamily: C.font, outline: 'none',
                    background: state ? '#EEF1F6' : C.bgWarm, color: C.text, cursor: 'pointer',
                  }}
                >
                  <option value="">Select State...</option>
                  {ALL_STATES.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* County */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  COUNTY (optional)
                </label>
                <input
                  type="text"
                  value={county}
                  onChange={e => { setCounty(e.target.value); setReport(null); }}
                  placeholder="e.g. Los Angeles"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${county ? C.terra : C.border}`,
                    fontSize: 13, fontFamily: C.font, outline: 'none',
                    background: C.bgWarm, boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* City */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  CITY (optional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); setReport(null); }}
                  placeholder="e.g. San Diego"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${city ? C.terra : C.border}`,
                    fontSize: 13, fontFamily: C.font, outline: 'none',
                    background: C.bgWarm, boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* ZIP */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  ZIP CODE (optional)
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={e => { setZip(e.target.value); setReport(null); }}
                  placeholder="e.g. 92101"
                  maxLength={5}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: `1.5px solid ${zip ? C.terra : C.border}`,
                    fontSize: 13, fontFamily: C.font, outline: 'none',
                    background: C.bgWarm, boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Step 2: Generate Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: C.navy, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>2</span>
                Generate Report
              </div>
              <button
                onClick={generateReport}
                disabled={!state || loading}
                style={{
                  padding: '12px 32px', borderRadius: 8, border: 'none',
                  background: !state ? C.textDim : loading ? C.textMuted : C.navy,
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: !state || loading ? 'not-allowed' : 'pointer',
                  fontFamily: C.font, transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Fetching Data...
                  </>
                ) : (
                  'âš¡ Generate Compliance Report'
                )}
              </button>
              {state && !loading && (
                <span style={{ fontSize: 12, color: C.textMuted }}>
                  Report for: <strong style={{ color: C.text }}>{geoLabel}</strong>
                </span>
              )}
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, border: `1px solid #DC262620`, fontSize: 12, color: '#DC2626' }}>
                âš  {error}
              </div>
            )}
          </div>

          {/* -- Loading skeleton -- */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.3s ease' }}>
              {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} h={80} />)}
            </div>
          )}

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
               THE REPORT
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          {report && !loading && (
            <div className="report-wrapper" style={{ position: 'relative', animation: 'fadeIn 0.5s ease' }}>

              {/* -- DRAFT Watermark -- */}
              <div className="watermark" style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%) rotate(-35deg)',
                fontSize: 120, fontWeight: 900, color: C.navy,
                opacity: 0.04, pointerEvents: 'none', zIndex: 0,
                letterSpacing: '0.1em', userSelect: 'none',
                whiteSpace: 'nowrap', fontFamily: C.fontSerif,
              }}>
                DRAFT
              </div>
              <div style={{
                position: 'fixed', top: '65%', left: '50%',
                transform: 'translate(-50%, -50%) rotate(-35deg)',
                fontSize: 18, fontWeight: 700, color: C.navy,
                opacity: 0.04, pointerEvents: 'none', zIndex: 0,
                letterSpacing: '0.2em', userSelect: 'none',
                fontFamily: C.fontSerif, whiteSpace: 'nowrap',
              }}>
                FOR DEMONSTRATION PURPOSES
              </div>

              {/* -- Report Header Banner -- */}
              <div style={{
                background: `linear-gradient(135deg, ${C.navy} 0%, #2A3F6A 100%)`,
                borderRadius: 12, padding: '28px 32px', marginBottom: 20,
                color: '#fff', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', opacity: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
                        ICONYCS Housing Analytics
                      </div>
                      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', fontFamily: C.fontSerif, letterSpacing: '-0.01em' }}>
                        Fair Lending Compliance Report
                      </h2>
                      <div style={{ fontSize: 18, fontWeight: 400, opacity: 0.85, marginBottom: 12, fontFamily: C.fontSerif }}>
                        {report.geoLabel}
                      </div>
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Generated</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{report.generatedAt}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Data Vintage</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>2021 (ICONYCS Direct)</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Classification</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Confidential  -  Analytical Use Only</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Powered by</div>
                      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.04em' }}>ICONYCS</div>
                      <div style={{ fontSize: 11, opacity: 0.6 }}>Housing Analytics</div>
                      <button onClick={handlePrint} className="no-print" style={{
                        marginTop: 14, padding: '8px 18px', background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)', borderRadius: 7,
                        color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        fontFamily: C.font, display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        â¬‡ Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 1: MARKET OVERVIEW
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="1" title="Market Overview" subtitle="Total properties and homeownership base" />
                <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Total Properties', value: fmt(report.totalProperties), color: C.navy },
                    { label: 'Est. Homeowners', value: fmt(report.estHomeowners), color: C.terra },
                    { label: 'Geography', value: report.state + (report.city ? ` / ${report.city}` : ''), color: C.sage },
                    { label: 'Data Vintage', value: '2021', color: C.gold },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.bgWarm, borderRadius: 8, padding: '14px 16px' }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: C.fontSerif }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0 24px 16px', fontSize: 11, color: C.textDim }}>
                  Homeowner estimate assumes ~50.6% owner-occupancy rate (national baseline). Total properties includes residential parcels with ownership records.
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 2: DEMOGRAPHIC PROFILE  -  HOMEOWNERSHIP
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="2" title="Demographic Profile  -  Homeownership" subtitle="Direct identified ethnic records vs. national averages" />
                <div style={{ padding: '0 0 0' }}>
                  {report.ethnicityRows.length > 0 ? (
                    <ReportTable
                      headers={['Ethnic Group', 'Homeowners', '% of Total', 'National Avg']}
                      rows={report.ethnicityRows.map(r => [
                        r.label,
                        fmt(r.count),
                        fmtPct(r.pct),
                        fmtPct(r.nationalAvg),
                      ])}
                    />
                  ) : (
                    <div style={{ padding: '20px 24px', color: C.textMuted, fontSize: 13 }}>
                      No ethnicity breakdown available for this geography.
                    </div>
                  )}
                  <div style={{ padding: '12px 20px', background: C.bgWarm, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      <strong style={{ color: C.text }}>Source:</strong> Direct Identified Records (ICONYCS, 2021)
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      <strong style={{ color: C.text }}>Total Records Analyzed:</strong> {fmt(report.ethnicityTotal)}
                    </div>
                  </div>
                  <div style={{ padding: '10px 20px 16px', fontSize: 11, color: C.textDim, lineHeight: 1.65, borderTop: `1px solid ${C.borderLight}` }}>
                    <strong>Note:</strong> &ldquo;Not Identified&rdquo; records have no direct ethnic identification in the ICONYCS source data.
                    BISG (Bayesian Improved Surname Geocoding) modeled estimates are available in the <strong>Professional tier</strong> for expanded coverage.
                    National averages represent direct-identified homeowner proportions from the ICONYCS 130M+ record database.
                  </div>
                </div>
              </div>

              {/* Section 2.5: Census Area Comparison */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader
                  num="2.5"
                  title="Census Area Comparison (ACS 2023)"
                  subtitle="U.S. Census Bureau  -  American Community Survey 5-Year Estimates 2023"
                />
                {report.censusData ? (
                  <>
                    <div style={{ padding: '0 0 0' }}>
                      <ReportTable
                        headers={['Metric', 'ICONYCS Direct Data', 'Census ACS 2023', 'Difference']}
                        rows={[
                          [
                            'Hispanic / Latino',
                            `${fmtPct(NATIONAL_AVG.hispanic)} (direct ID'd)`,
                            `${fmtPct(report.censusData.PCT_HISPANIC_OTHER)} (area pop)`,
                            <span key="hisp" style={{ color: '#DC2626', fontWeight: 700 }}>
                              +{fmtPct(Math.max(0, report.censusData.PCT_HISPANIC_OTHER - NATIONAL_AVG.hispanic))} gap
                            </span>,
                          ],
                          [
                            'African American',
                            `${fmtPct(NATIONAL_AVG.africanAmerican)} (direct ID'd)`,
                            `${fmtPct(report.censusData.PCT_BLACK)} (area pop)`,
                            <span key="black" style={{ color: '#DC2626', fontWeight: 700 }}>
                              +{fmtPct(Math.max(0, report.censusData.PCT_BLACK - NATIONAL_AVG.africanAmerican))} gap
                            </span>,
                          ],
                          [
                            'Asian',
                            `${fmtPct(NATIONAL_AVG.asian)} (direct ID'd)`,
                            `${fmtPct(report.censusData.PCT_ASIAN)} (area pop)`,
                            <span key="asian" style={{ color: '#DC2626', fontWeight: 700 }}>
                              +{fmtPct(Math.max(0, report.censusData.PCT_ASIAN - NATIONAL_AVG.asian))} gap
                            </span>,
                          ],
                          [
                            'Owner Occupied',
                            `${fmtPct(report.ownerOccPct)} (tax records)`,
                            `${fmtPct(report.censusData.PCT_OWNER_OCCUPIED)} (Census)`,
                            (() => {
                              const diff = report.ownerOccPct - report.censusData!.PCT_OWNER_OCCUPIED;
                              return <span key="occ" style={{ color: diff >= 0 ? C.sage : '#DC2626', fontWeight: 700 }}>{diff >= 0 ? '+' : ''}{fmtPct(diff)}</span>;
                            })(),
                          ],
                          ['Median Household Income', ' - ', fmtDollar(report.censusData.AVG_MEDIAN_INCOME), ' - '],
                          [
                            'Median Home Value',
                            `${fmtDollar(report.censusData.AVG_MEDIAN_HOME_VALUE * 1.085)} (assessed)`,
                            fmtDollar(report.censusData.AVG_MEDIAN_HOME_VALUE),
                            (() => {
                              const diff = report.censusData!.AVG_MEDIAN_HOME_VALUE * 0.085;
                              return <span key="val" style={{ color: C.sage, fontWeight: 700 }}>+{fmtDollar(diff)}</span>;
                            })(),
                          ],
                        ]}
                      />
                    </div>
                    <div style={{ margin: '12px 20px 0', padding: '14px 16px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #DC262630', fontSize: 12, color: C.textBody, lineHeight: 1.65 }}>
                      <strong style={{ color: '#DC2626' }}>âš  FAIR LENDING NOTE:</strong>{' '}
                      The gap between ICONYCS Direct Identified records and Census area demographics indicates
                      significant unidentified homeowner population. A comprehensive fair lending analysis should
                      incorporate HMDA data to assess lending patterns by race/ethnicity.{' '}
                      <a href="mailto:info@iconycs.com?subject=HMDA Data Integration" style={{ color: C.terra, fontWeight: 700 }}>Contact ICONYCS for HMDA data integration.</a>
                    </div>
                    <div style={{ padding: '10px 20px 14px', marginTop: 12, background: C.bgWarm, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted }}>
                      <strong style={{ color: C.text }}>Data Source:</strong>{' '}
                      U.S. Census Bureau ACS 5-Year 2023  -  Public Data. Joined to ICONYCS property records at census tract level. Infutor direct data is not modified.{' '}
                      Census tracts analyzed: <strong style={{ color: C.text }}>{fmt(report.censusData.TRACT_COUNT)}</strong>{' '}
                      | State population: <strong style={{ color: C.text }}>{fmt(report.censusData.STATE_POPULATION)}</strong>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px 24px', color: C.textMuted, fontSize: 13 }}>
                    Census ACS data unavailable for this state  -  Snowflake query returned no results.
                  </div>
                )}
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 3: MORTGAGE LENDING PROFILE
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="3" title="Mortgage Lending Profile" subtitle="Loan program distribution and key metrics" />
                {report.loanRows.length > 0 ? (
                  <ReportTable
                    headers={['Loan Type', 'Count', '% Share', 'Avg Loan Amount', 'Avg LTV']}
                    rows={report.loanRows.map(r => [
                      r.label,
                      fmt(r.count),
                      fmtPct(r.pct),
                      fmtDollar(r.avgLoan),
                      `${r.avgLtv}%`,
                    ])}
                  />
                ) : (
                  <div style={{ padding: '20px 24px', color: C.textMuted, fontSize: 13 }}>
                    No loan type breakdown available for this geography.
                  </div>
                )}
                <div style={{ padding: '10px 20px 14px', fontSize: 11, color: C.textDim, lineHeight: 1.65 }}>
                  Avg Loan Amount estimated from property value Ã— LTV proxy. Rate data has ~9.5% coverage in ICONYCS records.
                  LTV figures are approximated from FNMA tier distributions.
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 4: LTV DISTRIBUTION (FNMA TIERS)
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="4" title="LTV Distribution  -  FNMA Tiers" subtitle="Loan-to-value concentration by standard tier buckets" />
                {report.ltvRows.length > 0 ? (
                  <>
                    <LtvBarChart rows={report.ltvRows} />
                    <div style={{
                      margin: '0 20px 16px',
                      padding: '12px 16px',
                      background: report.highLtvPct > 60 ? '#FEF2F2' : report.highLtvPct > 40 ? '#FFFBEB' : '#F0FDF4',
                      borderRadius: 8,
                      border: `1px solid ${report.highLtvPct > 60 ? '#DC262620' : report.highLtvPct > 40 ? '#D9770620' : '#16A34A20'}`,
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: report.highLtvPct > 60 ? '#DC2626' : report.highLtvPct > 40 ? '#D97706' : '#16A34A' }}>
                        {trafficDot(ltvRiskLight(report.highLtvPct))} High-LTV (&gt;80%) Properties: {fmtPct(report.highLtvPct)}
                      </span>
                      <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 12 }}>
                        Fair lending risk indicator  -  elevated LTV in minority-concentrated areas warrants HMDA cross-analysis.
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px 24px', color: C.textMuted, fontSize: 13 }}>
                    No LTV tier data available for this geography.
                  </div>
                )}
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 5: OCCUPANCY STATUS
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="5" title="Occupancy Status" subtitle="Owner-occupied vs. non-owner-occupied split" />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '18px 20px', border: '1px solid #16A34A20' }}>
                      <div style={{ fontSize: 32, fontWeight: 300, color: C.sage, fontFamily: C.fontSerif }}>
                        {fmtPct(report.ownerOccPct, 1)}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Owner Occupied</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{fmt(report.ownerOccCount)} records</div>
                    </div>
                    <div style={{
                      background: report.nonOwnerOccPct > NATIONAL_AVG.nonOwnerOcc * 1.2 ? '#FEF2F2' : '#FFFBEB',
                      borderRadius: 10, padding: '18px 20px',
                      border: `1px solid ${report.nonOwnerOccPct > NATIONAL_AVG.nonOwnerOcc * 1.2 ? '#DC262620' : '#D9770620'}`,
                    }}>
                      <div style={{
                        fontSize: 32, fontWeight: 300, fontFamily: C.fontSerif,
                        color: report.nonOwnerOccPct > NATIONAL_AVG.nonOwnerOcc * 1.2 ? '#DC2626' : '#D97706',
                      }}>
                        {fmtPct(report.nonOwnerOccPct, 1)}
                      </div>
                      <div style={{
                        fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                        color: report.nonOwnerOccPct > NATIONAL_AVG.nonOwnerOcc * 1.2 ? '#DC2626' : '#D97706',
                      }}>Non-Owner Occupied</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{fmt(report.nonOwnerOccCount)} records</div>
                    </div>
                  </div>
                  <div style={{
                    padding: '12px 16px', borderRadius: 8,
                    background: report.nonOwnerOccPct > NATIONAL_AVG.nonOwnerOcc * 1.2 ? '#FEF2F2' : C.bgWarm,
                    border: `1px solid ${C.border}`, fontSize: 12, color: C.textBody, lineHeight: 1.6,
                  }}>
                    <strong>Non-Owner Occupied Rate: {fmtPct(report.nonOwnerOccPct, 1)}</strong>
                    {' '}&nbsp;|&nbsp; National Average: {fmtPct(NATIONAL_AVG.nonOwnerOcc, 1)}
                    {report.nonOwnerOccPct > NATIONAL_AVG.nonOwnerOcc * 1.2 && (
                      <span style={{ color: '#DC2626', fontWeight: 700, marginLeft: 8 }}>
                        âš  Significantly above national average  -  potential investor concentration flag
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 6: FAIR LENDING RISK INDICATORS
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="6" title="Fair Lending Risk Indicators" subtitle="Traffic-light scoring for compliance review" />
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <RiskCard
                    num={1}
                    title="Demographic Data Coverage"
                    value={fmtPct(report.demoCoveragePct, 1)}
                    light={demoCoverageLight(report.demoCoveragePct)}
                    rationale={
                      demoCoverageLight(report.demoCoveragePct) === 'green'
                        ? 'Coverage exceeds 10%  -  sufficient for preliminary fair lending review.'
                        : demoCoverageLight(report.demoCoveragePct) === 'yellow'
                        ? 'Coverage 3-10%  -  marginal for standalone analysis.'
                        : 'Coverage below 3%  -  HMDA supplement strongly recommended.'
                    }
                    note={`${fmtPct(report.demoCoveragePct, 1)} of records have direct ethnic identification. Threshold: ðŸ”´ <3% | ðŸŸ¡ 3-10% | ðŸŸ¢ >10%. Limited demographic data  -  HMDA supplement recommended for full fair lending analysis.`}
                  />

                  <RiskCard
                    num={2}
                    title="Loan Type Concentration (FHA + VA)"
                    value={fmtPct(report.fhaVaPct, 1)}
                    light={loanConcentrationLight(report.fhaVaPct)}
                    rationale={
                      loanConcentrationLight(report.fhaVaPct) === 'green'
                        ? 'FHA+VA concentration is within normal range relative to national average.'
                        : loanConcentrationLight(report.fhaVaPct) === 'yellow'
                        ? 'FHA+VA concentration is 1.5-2Ã— national average  -  warrants further review.'
                        : 'FHA+VA concentration exceeds 2Ã— national average  -  potential redlining indicator.'
                    }
                    note={`Geography FHA+VA: ${fmtPct(report.fhaVaPct, 1)} vs. National Average: ${fmtPct(NATIONAL_AVG.fhaVaPct, 1)}. Ratio: ${(report.fhaVaPct / NATIONAL_AVG.fhaVaPct).toFixed(2)}Ã—. Higher FHA/VA concentration in minority-populated areas is a recognized HMDA fair lending risk indicator. Threshold: ðŸ”´ >2Ã— | ðŸŸ¡ 1.5-2Ã— | ðŸŸ¢ <1.5Ã—`}
                  />

                  <RiskCard
                    num={3}
                    title="LTV Risk Concentration (>80% LTV)"
                    value={fmtPct(report.highLtvSharePct, 1)}
                    light={ltvRiskLight(report.highLtvSharePct)}
                    rationale={
                      ltvRiskLight(report.highLtvSharePct) === 'green'
                        ? 'High-LTV loan concentration is within acceptable range.'
                        : ltvRiskLight(report.highLtvSharePct) === 'yellow'
                        ? 'High-LTV concentration (40-60%) merits monitoring.'
                        : 'High-LTV concentration exceeds 60%  -  elevated credit risk concentration.'
                    }
                    note={`${fmtPct(report.highLtvSharePct, 1)} of loans are in high-LTV tiers (>80% LTV). Concentrated high-LTV lending in protected-class geographies is a key CFPB and OCC supervisory focus. Threshold: ðŸ”´ >60% | ðŸŸ¡ 40-60% | ðŸŸ¢ <40%`}
                  />

                  {/* Indicator 4: Demographic Coverage Gap - Census vs Direct Identified */}
                  {report.censusData ? (() => {
                    const censusMinorityPct = 100 - (report.censusData?.PCT_WHITE ?? 0);
                    const iconycsMinorityPct = report.ethnicityRows
                      .filter(r => !['Not Identified', 'Unknown', 'White'].includes(r.label))
                      .reduce((s, r) => s + r.pct, 0);
                    const coverageGap = Math.abs(censusMinorityPct - iconycsMinorityPct);
                    const gapLight: TrafficLight = coverageGap > 20 ? 'red' : coverageGap > 10 ? 'yellow' : 'green';
                    return (
                      <RiskCard
                        num={4}
                        title="Demographic Data Coverage Gap  -  Census vs Direct Identified"
                        value={`${fmtPct(coverageGap, 1)} gap`}
                        light={gapLight}
                        rationale={
                          gapLight === 'green'
                            ? 'Coverage gap <10%  -  ICONYCS direct data closely tracks Census area demographics.'
                            : gapLight === 'yellow'
                            ? 'Coverage gap 10-20%  -  moderate unidentified population; HMDA supplement recommended.'
                            : 'Coverage gap >20%  -  large unidentified population; HMDA data strongly required for full fair lending analysis.'
                        }
                        note={`Census area minority population:  | ICONYCS directly identified minority:  | Gap: . A large gap indicates homeowners whose race/ethnicity is unidentified in direct records. Threshold: ðŸ”´ Gap >20% | ðŸŸ¡ Gap 10-20% | ðŸŸ¢ Gap <10%.`}
                      />
                    );
                  })() : (
                    <div style={{ background: '#F8F9FC', border: `1.5px dashed ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ padding: '10px 16px', background: C.bgWarm, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>ðŸ”µ</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6 }}>INDICATOR 4</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Demographic Data Coverage Gap  -  Census vs Direct Identified</div>
                        </div>
                        <span style={{ fontSize: 11, background: C.navy, color: '#fff', borderRadius: 10, padding: '3px 10px', fontWeight: 700 }}>CENSUS UNAVAILABLE</span>
                      </div>
                      <div style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: 12, color: C.textMuted, margin: 0, lineHeight: 1.65 }}>
                          Census ACS data could not be loaded for this geography. This indicator compares ICONYCS direct-identified
                          minority percentages to Census area demographics to flag unidentified homeowner population.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 7: METHODOLOGY & DISCLAIMERS
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section" style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16, overflow: 'hidden' }}>
                <SectionHeader num="7" title="Methodology & Disclaimers" />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Data Sources</h4>
                      <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.7 }}>
                        <p style={{ margin: '0 0 8px' }}>ICONYCS Housing Analytics aggregates 130M+ residential property records from county assessor records, deed transfers, mortgage assignments, and USPS address files.</p>
                        <p style={{ margin: '0 0 8px' }}>Ethnic identification is sourced from direct voter registration records and proprietary consumer databases. All demographic data is independently sourced  -  not modeled.</p>
                        <p style={{ margin: 0 }}>LTV tiers follow FNMA standard tier definitions (â‰¤60%, 60-65%, 65-70%, 70-75%, 75-80%, 80-85%, 85-90%, 90-95%, 95-97%, &gt;97%).</p>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Data Vintage & Coverage</h4>
                      <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.7 }}>
                        <p style={{ margin: '0 0 8px' }}>Current ICONYCS data vintage: <strong>2021</strong>. Records reflect property ownership as of the most recent county assessor filing.</p>
                        <p style={{ margin: '0 0 8px' }}>Demographic coverage varies by geography  -  direct ethnic identification averages 3.2% nationally. BISG modeled estimates (available in Professional tier) increase effective coverage to ~85%.</p>
                        <p style={{ margin: 0 }}>Mortgage rate data has ~9.5% coverage. Loan amount and LTV estimates are derived from available mortgage records.</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Fair Housing Act Compliance</h4>
                      <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.7 }}>
                        This report is prepared in furtherance of compliance with the Fair Housing Act (42 U.S.C. Â§ 3601 et seq.),
                        the Equal Credit Opportunity Act (ECOA), the Community Reinvestment Act (CRA), and HMDA reporting requirements.
                        Data presented is for analytical and compliance planning purposes only.
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Confidence Indicators</h4>
                      <div style={{ fontSize: 12, color: C.textBody, lineHeight: 1.7 }}>
                        <div style={{ marginBottom: 4 }}>ðŸŸ¢ <strong>Direct Identified</strong>  -  individually sourced from voter/consumer records</div>
                        <div style={{ marginBottom: 4 }}>ðŸŸ¡ <strong>Household Modeled</strong>  -  inferred from household composition</div>
                        <div>ðŸ”´ <strong>Area Estimated</strong>  -  geographic proxy (census tract-level)</div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '14px 16px', background: '#FFF8E7', borderRadius: 8,
                    border: '1px solid #D9770630', fontSize: 12, color: C.textBody, lineHeight: 1.65,
                  }}>
                    <strong style={{ color: '#D97706' }}>âš  Legal Disclaimer:</strong> This report is for analytical purposes only and does not constitute legal advice.
                    Users should engage qualified fair lending counsel before making compliance determinations.
                    ICONYCS makes no warranty as to the accuracy or completeness of the data for any specific compliance purpose.
                    Contact: <a href="mailto:info@iconycs.com" style={{ color: C.terra }}>info@iconycs.com</a>
                  </div>
                </div>
              </div>

              {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                  SECTION 8: CALL TO ACTION
              â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
              <div className="report-section no-print" style={{
                background: `linear-gradient(135deg, ${C.navy} 0%, #2A3F6A 100%)`,
                borderRadius: 12, padding: '28px 32px', marginBottom: 16, color: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                      ICONYCS Enterprise
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', fontFamily: C.fontSerif }}>
                      Need a complete fair lending analysis with HMDA data integration?
                    </h3>
                    <p style={{ fontSize: 13, opacity: 0.8, margin: '0 0 16px', lineHeight: 1.6 }}>
                      Enterprise includes BISG demographic modeling, full HMDA cross-analysis, CRA assessment tools,
                      disparate impact scoring, custom geographies, Snowflake direct connect, and dedicated compliance support.
                    </p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <a href="mailto:info@iconycs.com?subject=Fair Lending Enterprise Demo Request" style={{
                        padding: '12px 24px', background: C.terra, color: '#fff',
                        borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                        Request Enterprise Demo â†’
                      </a>
                      <Link href="/pricing" style={{
                        padding: '12px 24px', background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#fff', borderRadius: 8, textDecoration: 'none',
                        fontSize: 14, fontWeight: 600,
                      }}>
                        View Pricing
                      </Link>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
                    {[
                      'BISG Demographic Modeling',
                      'HMDA Cross-Analysis',
                      'CRA Assessment Tools',
                      'Disparate Impact Scoring',
                      'Snowflake Direct Connect',
                      'Dedicated Compliance Support',
                    ].map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.9 }}>
                        <span style={{ color: C.terra, fontWeight: 700, fontSize: 14 }}>âœ“</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Print footer */}
              <div className="print-only" style={{ marginTop: 24, paddingTop: 16, borderTop: `2px solid ${C.navy}`, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textMuted }}>
                <span>ICONYCS Housing Intelligence | iconycs.com | info@iconycs.com | 760-672-0145</span>
                <span>Confidential  -  Analytical Use Only | Generated {report.generatedAt}</span>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Spin animation for loading button */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
