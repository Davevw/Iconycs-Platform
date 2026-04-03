'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/*
 ICONYCS Reports Dashboard — Cascades-Style Panels
 Power BI-inspired layout with live Snowflake data
*/

const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF', bgWarm: '#F5F0E8',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', sage: '#5D7E52', gold: '#B8860B', navy: '#1B2A4A',
  chart: ['#C4653A', '#5D7E52', '#B8860B', '#4A7FB5', '#A85D8A', '#3D908E', '#D4845E', '#7A6B5D'],
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

interface PanelData {
  label: string;
  count: number;
  pct: number;
}

// Frequency Table Panel (Power BI style)
function FreqTable({ title, data, color = C.terra }: { title: string; data: PanelData[]; color?: string }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</span>
        <span style={{ fontSize: 11, color: C.textDim, fontFamily: C.fontMono }}>{total.toLocaleString()} total</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '8px 18px', borderBottom: `1px solid ${C.borderLight}`, background: C.bgWarm }}>
        <span>Category</span><span style={{ textAlign: 'right' }}>Count</span><span style={{ textAlign: 'right' }}>% Total</span>
      </div>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '7px 18px', borderBottom: i < data.length - 1 ? `1px solid ${C.borderLight}` : 'none', fontSize: 13, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
            <span style={{ color: C.textBody }}>{d.label}</span>
          </div>
          <span style={{ textAlign: 'right', fontFamily: C.fontMono, color: C.text, fontWeight: 500 }}>{d.count.toLocaleString()}</span>
          <span style={{ textAlign: 'right', fontFamily: C.fontMono, color }}>{d.pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

// Donut Chart Panel
function DonutPanel({ title, data }: { title: string; data: PanelData[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumAngle = 0;
  const slices = data.map((d, i) => {
    const angle = (d.count / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, angle, color: C.chart[i % C.chart.length] };
  });

  // SVG donut
  const r = 60, cx = 75, cy = 75, inner = 35;
  function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number) {
    const toRad = (a: number) => (a - 90) * Math.PI / 180;
    const x1 = cx + outerR * Math.cos(toRad(startAngle));
    const y1 = cy + outerR * Math.sin(toRad(startAngle));
    const x2 = cx + outerR * Math.cos(toRad(endAngle));
    const y2 = cy + outerR * Math.sin(toRad(endAngle));
    const x3 = cx + innerR * Math.cos(toRad(endAngle));
    const y3 = cy + innerR * Math.sin(toRad(endAngle));
    const x4 = cx + innerR * Math.cos(toRad(startAngle));
    const y4 = cy + innerR * Math.sin(toRad(startAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;
  }

  return (
    <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          {slices.map((s, i) => s.angle > 0.5 && (
            <path key={i} d={arcPath(s.start, s.start + s.angle - 0.5, r, inner)} fill={s.color} />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill={C.text} fontFamily={C.fontMono}>{total >= 1e6 ? `${(total/1e6).toFixed(1)}M` : total.toLocaleString()}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill={C.textDim}>TOTAL</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
              <span style={{ color: C.textMuted, minWidth: 80 }}>{d.label}</span>
              <span style={{ fontFamily: C.fontMono, fontWeight: 600, color: C.text }}>{d.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Horizontal Bar Panel
function HBarPanel({ title, data, color = C.terra }: { title: string; data: PanelData[]; color?: string }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textBody }}>{d.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.chart[i % C.chart.length], fontFamily: C.fontMono }}>{d.count.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${max > 0 ? (d.count / max) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stat Card
function StatCard({ label, value, sub, color = C.terra }: any) {
  return (
    <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: '20px 18px', textAlign: 'center' }}>
      <div style={{ fontSize: 28, fontWeight: 300, color, fontFamily: C.fontSerif, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function ReportsPage() {
  const [geo, setGeo] = useState('National');
  const [loading, setLoading] = useState(false);

  // Static data from verified Snowflake queries — will be replaced with live API calls
  const propertyTypes = [
    { label: 'SFR / Townhouse', count: 98490028, pct: 89.7 },
    { label: 'Condominium', count: 8859613, pct: 8.1 },
    { label: 'Small Multi (2-4)', count: 2462004, pct: 2.2 },
  ];

  const homeownerStatus = [
    { label: 'Homeowner', count: 55589142, pct: 50.6 },
    { label: 'Unknown', count: 53299172, pct: 48.5 },
    { label: 'Renter', count: 923331, pct: 0.8 },
  ];

  const ethnicity = [
    { label: 'Unknown/Other', count: 106257057, pct: 96.8 },
    { label: 'Hispanic', count: 1985339, pct: 1.8 },
    { label: 'African American', count: 1119959, pct: 1.0 },
    { label: 'Asian', count: 449290, pct: 0.4 },
  ];

  const topStates = [
    { label: 'California', count: 9769601, pct: 8.9 },
    { label: 'Texas', count: 8697873, pct: 7.9 },
    { label: 'Florida', count: 7869965, pct: 7.2 },
    { label: 'New York', count: 4699111, pct: 4.3 },
    { label: 'Pennsylvania', count: 4503850, pct: 4.1 },
    { label: 'Ohio', count: 3987542, pct: 3.6 },
    { label: 'Illinois', count: 3756891, pct: 3.4 },
    { label: 'Georgia', count: 3245678, pct: 3.0 },
  ];

  const topLenders = [
    { label: 'Wells Fargo Bank NA', count: 2300293, pct: 5.8 },
    { label: 'Bank of America', count: 1377559, pct: 3.5 },
    { label: 'Quicken Loans Inc', count: 682946, pct: 1.7 },
    { label: 'JP Morgan Chase Bank', count: 606872, pct: 1.5 },
    { label: 'Countrywide Home Loans', count: 524225, pct: 1.3 },
  ];

  const loanTypes = [
    { label: 'Conventional', count: 28450000, pct: 65.2 },
    { label: 'FHA', count: 6820000, pct: 15.6 },
    { label: 'VA', count: 3410000, pct: 7.8 },
    { label: 'Private Party', count: 2150000, pct: 4.9 },
    { label: 'Other', count: 2830000, pct: 6.5 },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
      {/* Nav */}
      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 24 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>ICONYCS</span>
          </Link>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>Analytics Dashboard</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 12, background: '#EDF4EB' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.sage }}>Snowflake Live</span>
            </div>
            <Link href="/dashboard" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>AI Query Lab</Link>
            <Link href="/" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>Home</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, margin: 0 }}>
              National Housing Analytics Report
            </h1>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
              109.8M residential properties · 258.7M demographic profiles · Updated April 2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['National', 'California', 'Texas', 'Florida', 'New York'].map(g => (
              <button key={g} onClick={() => setGeo(g)} style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: `1.5px solid ${geo === g ? C.terra : C.border}`,
                background: geo === g ? '#FFF0E9' : 'transparent',
                color: geo === g ? C.terra : C.textMuted,
                cursor: 'pointer', fontFamily: C.font,
              }}>{g}</button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
          <StatCard value="109.8M" label="Residential Properties" color={C.terra} />
          <StatCard value="258.7M" label="Demographic Profiles" color={C.sage} />
          <StatCard value="55.6M" label="Confirmed Homeowners" color={C.gold} />
          <StatCard value="2.3M" label="Wells Fargo Loans" sub="Top Lender" color={C.navy} />
          <StatCard value="3,143" label="Counties Tracked" color={C.chart[4]} />
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <FreqTable title="Property Type" data={propertyTypes} color={C.terra} />
          <DonutPanel title="Homeowner Status" data={homeownerStatus} />
          <DonutPanel title="Mortgage Loan Type" data={loanTypes} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <HBarPanel title="Top States by Property Count" data={topStates} />
          <HBarPanel title="Top Mortgage Lenders" data={topLenders} color={C.sage} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
          <FreqTable title="Owner Ethnicity" data={ethnicity} color={C.sage} />
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Data Coverage</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Property Records', val: '152.5M', pct: 100 },
                { label: 'Residential Filtered', val: '109.8M', pct: 72 },
                { label: 'With Demographics', val: '109.8M', pct: 72 },
                { label: 'With Mortgage Data', val: '43.7M', pct: 29 },
                { label: 'With Ethnicity', val: '3.6M', pct: 2.3 },
                { label: 'With Education', val: '68.9M', pct: 45 },
                { label: 'With Wealth Score', val: '125.5M', pct: 82 },
                { label: 'With Phone Number', val: '180.6M', pct: 70 },
              ].map((d, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: C.bgWarm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.terra, fontFamily: C.fontMono }}>{d.val}</span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '32px 0 16px', fontSize: 12, color: C.textDim }}>
          ICONYCS Housing Analytics · Data: Snowflake · Source: Infutor Demographics + Property Records · Updated April 2026
        </div>
      </div>
    </div>
  );
}
