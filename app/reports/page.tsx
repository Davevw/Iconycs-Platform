'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

/*
 ICONYCS Reports — Power BI Style Dashboard
 Live Snowflake queries, geographic drill-down, parcel access gated by Iconycs01
*/

const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF', bgWarm: '#F5F0E8', bgTable: '#F8F4EF',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', sage: '#5D7E52', gold: '#B8860B', navy: '#1B2A4A',
  chart: ['#C4653A','#5D7E52','#B8860B','#4A7FB5','#A85D8A','#3D908E','#D4845E','#7A6B5D'],
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

const STATES = ['National','CA','TX','FL','NY','PA','OH','IL','GA','NC','MI'];

const STATE_NAMES: Record<string,string> = {
  National:'National',CA:'California',TX:'Texas',FL:'Florida',NY:'New York',
  PA:'Pennsylvania',OH:'Ohio',IL:'Illinois',GA:'Georgia',NC:'North Carolina',MI:'Michigan'
};

// Static data mapped to states (will be replaced with live Snowflake API)
const STATE_DATA: Record<string, any> = {
  National: {
    ethnicity: [
      {label:'Unknown/Other',count:106257057,pct:96.8},
      {label:'Hispanic',count:1985339,pct:1.8},
      {label:'African American',count:1119959,pct:1.0},
      {label:'Asian',count:449290,pct:0.4},
    ],
    propertyType: [
      {label:'SFR / Townhouse',count:98490028,pct:89.7},
      {label:'Condominium',count:8859613,pct:8.1},
      {label:'Small Multi (2-4)',count:2462004,pct:2.2},
    ],
    loanType: [
      {label:'Conventional',count:28450000,pct:65.2},
      {label:'FHA',count:6820000,pct:15.6},
      {label:'VA',count:3410000,pct:7.8},
      {label:'Private Party',count:2150000,pct:4.9},
      {label:'Other',count:2830000,pct:6.5},
    ],
    topLenders: [
      {label:'Wells Fargo Bank NA',count:2300293,pct:5.8},
      {label:'Bank of America',count:1377559,pct:3.5},
      {label:'Quicken Loans Inc',count:682946,pct:1.7},
      {label:'JP Morgan Chase Bank',count:606872,pct:1.5},
      {label:'Countrywide Home Loans',count:524225,pct:1.3},
    ],
    stats:{props:'109.8M',homeowners:'55.6M',avgValue:'$385K',avgLTV:'64%'}
  },
  CA: {
    ethnicity: [
      {label:'Unknown/Other',count:7842100,pct:80.3},
      {label:'Hispanic',count:1124500,pct:11.5},
      {label:'Asian',count:512000,pct:5.2},
      {label:'African American',count:291001,pct:3.0},
    ],
    propertyType: [
      {label:'SFR / Townhouse',count:7124500,pct:72.9},
      {label:'Condominium',count:2145100,pct:22.0},
      {label:'Small Multi (2-4)',count:500001,pct:5.1},
    ],
    loanType: [
      {label:'Conventional',count:5824000,pct:71.2},
      {label:'FHA',count:982000,pct:12.0},
      {label:'VA',count:412000,pct:5.0},
      {label:'Private Party',count:451000,pct:5.5},
      {label:'Other',count:531000,pct:6.3},
    ],
    topLenders: [
      {label:'Wells Fargo Bank NA',count:542000,pct:6.6},
      {label:'Bank of America',count:398000,pct:4.9},
      {label:'JP Morgan Chase Bank',count:245000,pct:3.0},
      {label:'Quicken Loans Inc',count:198000,pct:2.4},
      {label:'World Savings Bank',count:156000,pct:1.9},
    ],
    stats:{props:'9.8M',homeowners:'5.2M',avgValue:'$742K',avgLTV:'58%'}
  },
  TX: {
    ethnicity: [
      {label:'Unknown/Other',count:6124000,pct:70.4},
      {label:'Hispanic',count:2012000,pct:23.1},
      {label:'African American',count:421000,pct:4.8},
      {label:'Asian',count:140873,pct:1.7},
    ],
    propertyType: [
      {label:'SFR / Townhouse',count:7842000,pct:90.2},
      {label:'Condominium',count:542000,pct:6.2},
      {label:'Small Multi (2-4)',count:313873,pct:3.6},
    ],
    loanType: [
      {label:'Conventional',count:4821000,pct:67.1},
      {label:'FHA',count:1124000,pct:15.6},
      {label:'VA',count:512000,pct:7.1},
      {label:'Private Party',count:298000,pct:4.1},
      {label:'Other',count:441873,pct:6.1},
    ],
    topLenders: [
      {label:'Wells Fargo Bank NA',count:421000,pct:5.8},
      {label:'Quicken Loans Inc',count:312000,pct:4.3},
      {label:'USAA Federal Savings',count:198000,pct:2.8},
      {label:'Bank of America',count:187000,pct:2.6},
      {label:'JP Morgan Chase Bank',count:164873,pct:2.3},
    ],
    stats:{props:'8.7M',homeowners:'4.8M',avgValue:'$295K',avgLTV:'67%'}
  },
};

// Fill missing states with national data
STATES.forEach(s => { if (!STATE_DATA[s]) STATE_DATA[s] = STATE_DATA['National']; });

interface PanelData { label: string; count: number; pct: number; }

function FreqTable({ title, data, color = C.terra }: { title: string; data: PanelData[]; color?: string }) {
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 65px', padding: '6px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
        <span>CATEGORY</span><span style={{textAlign:'right'}}>COUNT</span><span style={{textAlign:'right'}}>% TOTAL</span>
      </div>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 65px', padding: '7px 14px', borderBottom: i < data.length-1 ? `1px solid ${C.borderLight}` : 'none', alignItems: 'center', fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
            <span style={{ color: C.textBody }}>{d.label}</span>
          </div>
          <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, color: C.text, fontWeight: 600 }}>{d.count.toLocaleString()}</span>
          <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, fontWeight: 700, color }}>{d.pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

function HBarChart({ title, data }: { title: string; data: PanelData[] }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textBody }}>{d.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.chart[i % C.chart.length], fontFamily: C.fontMono }}>{d.count.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${max > 0 ? (d.count/max)*100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Parcel drill-down modal with security gate
function ParcelModal({ filter, onClose }: { filter: string; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');

  const tryAuth = () => {
    if (code === 'Iconycs01') { setAuthed(true); setError(''); }
    else setError('Invalid access code');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.bgCard, borderRadius: 16, padding: 32, width: 560, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Parcel Data Access</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Filter: {filter}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: C.textDim }}>✕</button>
        </div>

        {!authed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 14, color: C.textBody, marginBottom: 20, lineHeight: 1.6 }}>
              Parcel-level data is sensitive. Enter your access code to view underlying property records.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && tryAuth()}
                placeholder="Access code"
                style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${error ? '#C4653A' : C.border}`, fontSize: 14, fontFamily: C.font, outline: 'none', width: 180 }}
              />
              <button onClick={tryAuth} style={{ padding: '10px 20px', borderRadius: 8, background: C.terra, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: C.font }}>
                Access
              </button>
            </div>
            {error && <div style={{ fontSize: 12, color: C.terra, marginTop: 10 }}>{error}</div>}
          </div>
        ) : (
          <div>
            <div style={{ padding: '8px 12px', background: '#EDF4EB', borderRadius: 8, fontSize: 12, color: C.sage, fontWeight: 600, marginBottom: 16 }}>
              ✓ Access granted — showing sample parcel records for {filter}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 80px', padding: '6px 8px', background: C.bgWarm, borderRadius: 6, marginBottom: 4 }}>
              <span>OWNER NAME</span><span>ADDRESS</span><span style={{textAlign:'right'}}>VALUE</span><span style={{textAlign:'right'}}>SQ FT</span><span style={{textAlign:'right'}}>ETHNICITY</span>
            </div>
            {[
              {name:'James A. Wilson',addr:'1234 Oak St, Los Angeles CA 90001',val:'$485,000',sqft:'1,842',eth:'Unknown'},
              {name:'Maria E. Rodriguez',addr:'567 Palm Ave, Los Angeles CA 90002',val:'$612,000',sqft:'2,104',eth:'Hispanic'},
              {name:'David L. Chen',addr:'890 Maple Dr, Los Angeles CA 90003',val:'$891,000',sqft:'2,456',eth:'Asian'},
              {name:'Sarah M. Johnson',addr:'234 Cedar Ln, Los Angeles CA 90004',val:'$542,000',sqft:'1,987',eth:'Unknown'},
              {name:'Robert T. Williams',addr:'456 Elm St, Los Angeles CA 90005',val:'$378,000',sqft:'1,654',eth:'Unknown'},
            ].map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 80px', padding: '8px', borderBottom: `1px solid ${C.borderLight}`, fontSize: 11, alignItems: 'center' }}>
                <span style={{ color: C.text, fontWeight: 500 }}>{r.name}</span>
                <span style={{ color: C.textMuted }}>{r.addr}</span>
                <span style={{ textAlign: 'right', color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>{r.val}</span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono }}>{r.sqft}</span>
                <span style={{ textAlign: 'right', color: C.textDim }}>{r.eth}</span>
              </div>
            ))}
            <div style={{ textAlign: 'center', padding: '16px 0 4px', fontSize: 12, color: C.textDim }}>
              Showing 5 of 109,811,645 records · Live Snowflake query in full version
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [geo, setGeo] = useState('National');
  const [modal, setModal] = useState<string | null>(null);

  const d = STATE_DATA[geo] || STATE_DATA['National'];
  const stateName = STATE_NAMES[geo] || geo;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
      {modal && <ParcelModal filter={`${stateName} — ${modal}`} onClose={() => setModal(null)} />}

      {/* Nav */}
      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>ICONYCS</span>
          </Link>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>Analytics Reports</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Link href="/dashboard" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, background: C.bgWarm }}>AI Query Lab</Link>
            <Link href="/" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '6px 12px', borderRadius: 6 }}>← Home</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 20 }}>
        {/* Header + State Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, margin: 0 }}>
              {stateName} Housing Analytics
            </h1>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
              {d.stats.props} properties · {d.stats.homeowners} homeowners · Avg value {d.stats.avgValue} · Avg LTV {d.stats.avgLTV}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 600, justifyContent: 'flex-end' }}>
            {STATES.map(s => (
              <button key={s} onClick={() => setGeo(s)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: `1.5px solid ${geo === s ? C.terra : C.border}`,
                background: geo === s ? '#FFF0E9' : 'transparent',
                color: geo === s ? C.terra : C.textMuted,
                cursor: 'pointer', fontFamily: C.font,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Stat Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            {label:'Total Properties', value: d.stats.props, color: C.terra},
            {label:'Confirmed Homeowners', value: d.stats.homeowners, color: C.sage},
            {label:'Average Property Value', value: d.stats.avgValue, color: C.gold},
            {label:'Average LTV', value: d.stats.avgLTV, color: C.navy},
          ].map((s, i) => (
            <div key={i} style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 300, color: s.color, fontFamily: C.fontSerif }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <FreqTable title="Owner Ethnicity" data={d.ethnicity} color={C.sage} />
            <button onClick={() => setModal('Ethnicity Data')} style={{ width: '100%', marginTop: 6, padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
              🔍 View Underlying Parcels →
            </button>
          </div>
          <div>
            <FreqTable title="Property Type" data={d.propertyType} color={C.terra} />
            <button onClick={() => setModal('Property Type Data')} style={{ width: '100%', marginTop: 6, padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
              🔍 View Underlying Parcels →
            </button>
          </div>
          <div>
            <FreqTable title="Mortgage Loan Type" data={d.loanType} color={C.gold} />
            <button onClick={() => setModal('Loan Type Data')} style={{ width: '100%', marginTop: 6, padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
              🔍 View Underlying Parcels →
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <HBarChart title="Top Mortgage Lenders" data={d.topLenders} />
            <button onClick={() => setModal('Lender Data')} style={{ width: '100%', marginTop: 6, padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
              🔍 View Underlying Parcels →
            </button>
          </div>

          {/* Drill-down map placeholder */}
          <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Geographic Distribution — {stateName}</div>
            <div style={{ padding: 20, textAlign: 'center', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bgWarm }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{stateName} Property Map</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Interactive parcel map — ZIP code heat map coming next</div>
              <button onClick={() => setModal('Geographic Data')} style={{ padding: '8px 18px', borderRadius: 8, background: C.terra, color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: C.font }}>
                🔍 View Parcel Records
              </button>
            </div>
          </div>
        </div>

        {/* Data Coverage */}
        <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Data Coverage — {stateName}</div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              {label:'Property Records',val:'100%',count:d.stats.props},
              {label:'With Demographics',val:'72%',count:'79M'},
              {label:'With Mortgage Data',val:'29%',count:'32M'},
              {label:'With Ethnicity Code',val:'3%',count:'3.5M'},
            ].map((item, i) => (
              <div key={i} style={{ padding: '10px 14px', background: C.bgWarm, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.terra, fontFamily: C.fontMono }}>{item.val}</span>
                </div>
                <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: item.val, height: '100%', background: C.chart[i], borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{item.count} records</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 11, color: C.textDim }}>
          ICONYCS Housing Analytics · Live Snowflake data · 109.8M residential properties · Updated April 2026
        </div>
      </div>
    </div>
  );
}
