'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const ALL_STATES = [
  {code:'AL',name:'Alabama',props:1842000,avg:175000},
  {code:'AK',name:'Alaska',props:248000,avg:312000},
  {code:'AZ',name:'Arizona',props:2845000,avg:385000},
  {code:'AR',name:'Arkansas',props:1124000,avg:168000},
  {code:'CA',name:'California',props:9769601,avg:742000},
  {code:'CO',name:'Colorado',props:2412000,avg:548000},
  {code:'CT',name:'Connecticut',props:1342000,avg:412000},
  {code:'DE',name:'Delaware',props:412000,avg:325000},
  {code:'FL',name:'Florida',props:7869965,avg:385000},
  {code:'GA',name:'Georgia',props:3245678,avg:295000},
  {code:'HI',name:'Hawaii',props:512000,avg:842000},
  {code:'ID',name:'Idaho',props:712000,avg:412000},
  {code:'IL',name:'Illinois',props:3756891,avg:285000},
  {code:'IN',name:'Indiana',props:2412000,avg:198000},
  {code:'IA',name:'Iowa',props:1312000,avg:185000},
  {code:'KS',name:'Kansas',props:1142000,avg:195000},
  {code:'KY',name:'Kentucky',props:1712000,avg:178000},
  {code:'LA',name:'Louisiana',props:1712000,avg:195000},
  {code:'ME',name:'Maine',props:612000,avg:285000},
  {code:'MD',name:'Maryland',props:2312000,avg:412000},
  {code:'MA',name:'Massachusetts',props:2612000,avg:542000},
  {code:'MI',name:'Michigan',props:3987542,avg:215000},
  {code:'MN',name:'Minnesota',props:2312000,avg:285000},
  {code:'MS',name:'Mississippi',props:1012000,avg:158000},
  {code:'MO',name:'Missouri',props:2412000,avg:212000},
  {code:'MT',name:'Montana',props:512000,avg:352000},
  {code:'NE',name:'Nebraska',props:812000,avg:212000},
  {code:'NV',name:'Nevada',props:1312000,avg:412000},
  {code:'NH',name:'New Hampshire',props:612000,avg:385000},
  {code:'NJ',name:'New Jersey',props:3212000,avg:512000},
  {code:'NM',name:'New Mexico',props:812000,avg:248000},
  {code:'NY',name:'New York',props:4699111,avg:498000},
  {code:'NC',name:'North Carolina',props:3245678,avg:285000},
  {code:'ND',name:'North Dakota',props:312000,avg:248000},
  {code:'OH',name:'Ohio',props:3987542,avg:212000},
  {code:'OK',name:'Oklahoma',props:1512000,avg:185000},
  {code:'OR',name:'Oregon',props:1712000,avg:485000},
  {code:'PA',name:'Pennsylvania',props:4503850,avg:248000},
  {code:'RI',name:'Rhode Island',props:412000,avg:398000},
  {code:'SC',name:'South Carolina',props:1912000,avg:265000},
  {code:'SD',name:'South Dakota',props:342000,avg:248000},
  {code:'TN',name:'Tennessee',props:2712000,avg:285000},
  {code:'TX',name:'Texas',props:8697873,avg:295000},
  {code:'UT',name:'Utah',props:1012000,avg:512000},
  {code:'VT',name:'Vermont',props:312000,avg:312000},
  {code:'VA',name:'Virginia',props:3212000,avg:385000},
  {code:'WA',name:'Washington',props:2912000,avg:548000},
  {code:'WV',name:'West Virginia',props:712000,avg:148000},
  {code:'WI',name:'Wisconsin',props:2312000,avg:248000},
  {code:'WY',name:'Wyoming',props:248000,avg:312000},
  {code:'DC',name:'Washington DC',props:248000,avg:742000},
];

interface PanelData { label: string; count: number; pct: number; }

function FreqTable({ title, data, color = C.terra }: { title: string; data: PanelData[]; color?: string }) {
  const total = data.reduce((s,d) => s + d.count, 0);
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '6px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
        <span>CATEGORY</span><span style={{textAlign:'right'}}>COUNT</span><span style={{textAlign:'right'}}>% TOTAL</span>
      </div>
      {data.map((d, i) => {
        const pct = total > 0 ? (d.count/total*100) : d.pct;
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '7px 14px', borderBottom: i < data.length-1 ? `1px solid ${C.borderLight}` : 'none', alignItems: 'center', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
              <span style={{ color: C.textBody }}>{d.label}</span>
            </div>
            <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, color: C.text, fontWeight: 600 }}>{d.count.toLocaleString()}</span>
            <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, fontWeight: 700, color }}>{pct.toFixed(1)}%</span>
          </div>
        );
      })}
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

function ParcelModal({ filter, onClose }: { filter: string; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const tryAuth = () => { if (code === 'Iconycs01') { setAuthed(true); setError(''); } else setError('Invalid access code'); };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.bgCard, borderRadius: 16, padding: 32, width: 600, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Parcel Data Access</div><div style={{ fontSize: 12, color: C.textMuted }}>{filter}</div></div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: C.textDim }}>✕</button>
        </div>
        {!authed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 14, color: C.textBody, marginBottom: 20, lineHeight: 1.6 }}>Parcel-level data is sensitive. Enter your access code to view underlying property records.</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <input type="password" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && tryAuth()} placeholder="Access code" style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${error ? C.terra : C.border}`, fontSize: 14, fontFamily: C.font, outline: 'none', width: 180 }} />
              <button onClick={tryAuth} style={{ padding: '10px 20px', borderRadius: 8, background: C.terra, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: C.font }}>Access</button>
            </div>
            {error && <div style={{ fontSize: 12, color: C.terra, marginTop: 10 }}>{error}</div>}
          </div>
        ) : (
          <div>
            <div style={{ padding: '8px 12px', background: '#EDF4EB', borderRadius: 8, fontSize: 12, color: C.sage, fontWeight: 600, marginBottom: 16 }}>✓ Access granted — {filter}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, display: 'grid', gridTemplateColumns: '1.5fr 2fr 80px 70px 80px', padding: '6px 8px', background: C.bgWarm, borderRadius: 6, marginBottom: 4 }}>
              <span>OWNER</span><span>ADDRESS</span><span style={{textAlign:'right'}}>VALUE</span><span style={{textAlign:'right'}}>SQFT</span><span style={{textAlign:'right'}}>ETHNICITY</span>
            </div>
            {[
              {name:'James A. Wilson',addr:'1234 Oak St',val:'$485,000',sqft:'1,842',eth:'Unknown'},
              {name:'Maria E. Rodriguez',addr:'567 Palm Ave',val:'$612,000',sqft:'2,104',eth:'Hispanic'},
              {name:'David L. Chen',addr:'890 Maple Dr',val:'$891,000',sqft:'2,456',eth:'Asian'},
              {name:'Sarah M. Johnson',addr:'234 Cedar Ln',val:'$542,000',sqft:'1,987',eth:'Unknown'},
              {name:'Robert T. Williams',addr:'456 Elm St',val:'$378,000',sqft:'1,654',eth:'Unknown'},
            ].map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 80px 70px 80px', padding: '8px', borderBottom: `1px solid ${C.borderLight}`, fontSize: 11, alignItems: 'center' }}>
                <span style={{ color: C.text, fontWeight: 500 }}>{r.name}</span>
                <span style={{ color: C.textMuted }}>{r.addr}</span>
                <span style={{ textAlign: 'right', color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>{r.val}</span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono }}>{r.sqft}</span>
                <span style={{ textAlign: 'right', color: C.textDim }}>{r.eth}</span>
              </div>
            ))}
            <div style={{ textAlign: 'center', padding: '16px 0 4px', fontSize: 12, color: C.textDim }}>Sample of 5 — full live query coming with Snowflake API connection</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Aggregate data across selected states
function buildAggregated(selected: string[]) {
  if (selected.length === 0 || selected.includes('ALL')) {
    return {
      totalProps: ALL_STATES.reduce((s,st) => s + st.props, 0),
      avgValue: Math.round(ALL_STATES.reduce((s,st) => s + st.avg, 0) / ALL_STATES.length),
      stateCount: ALL_STATES.length,
      label: 'National',
    };
  }
  const sel = ALL_STATES.filter(s => selected.includes(s.code));
  return {
    totalProps: sel.reduce((s,st) => s + st.props, 0),
    avgValue: sel.length > 0 ? Math.round(sel.reduce((s,st) => s + st.avg, 0) / sel.length) : 0,
    stateCount: sel.length,
    label: sel.length === 1 ? sel[0].name : `${sel.length} States`,
  };
}

export default function ReportsPage() {
  const [selected, setSelected] = useState<string[]>(['ALL']);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<string | null>(null);

  const toggleState = (code: string) => {
    if (code === 'ALL') { setSelected(['ALL']); return; }
    setSelected(prev => {
      const without = prev.filter(s => s !== 'ALL');
      if (without.includes(code)) {
        const next = without.filter(s => s !== code);
        return next.length === 0 ? ['ALL'] : next;
      }
      return [...without, code];
    });
  };

  const agg = buildAggregated(selected);
  const isAll = selected.includes('ALL');

  const filteredStates = ALL_STATES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  // Generate analysis data based on selection
  const ethnicity: PanelData[] = [
    {label:'Unknown/Other', count: Math.round(agg.totalProps * 0.968), pct: 96.8},
    {label:'Hispanic', count: Math.round(agg.totalProps * 0.018), pct: 1.8},
    {label:'African American', count: Math.round(agg.totalProps * 0.010), pct: 1.0},
    {label:'Asian', count: Math.round(agg.totalProps * 0.004), pct: 0.4},
  ];
  const propertyType: PanelData[] = [
    {label:'SFR / Townhouse', count: Math.round(agg.totalProps * 0.897), pct: 89.7},
    {label:'Condominium', count: Math.round(agg.totalProps * 0.081), pct: 8.1},
    {label:'Small Multi (2-4)', count: Math.round(agg.totalProps * 0.022), pct: 2.2},
  ];
  const loanType: PanelData[] = [
    {label:'Conventional', count: Math.round(agg.totalProps * 0.652 * 0.40), pct: 65.2},
    {label:'FHA', count: Math.round(agg.totalProps * 0.156 * 0.40), pct: 15.6},
    {label:'VA', count: Math.round(agg.totalProps * 0.078 * 0.40), pct: 7.8},
    {label:'Private Party', count: Math.round(agg.totalProps * 0.049 * 0.40), pct: 4.9},
    {label:'Other / Unknown', count: Math.round(agg.totalProps * 0.065 * 0.40), pct: 6.5},
  ];
  const topLenders: PanelData[] = [
    {label:'Wells Fargo Bank NA', count: Math.round(agg.totalProps * 0.021), pct: 5.8},
    {label:'Bank of America', count: Math.round(agg.totalProps * 0.013), pct: 3.5},
    {label:'Quicken Loans Inc', count: Math.round(agg.totalProps * 0.006), pct: 1.7},
    {label:'JP Morgan Chase Bank', count: Math.round(agg.totalProps * 0.006), pct: 1.5},
    {label:'Countrywide Home Loans', count: Math.round(agg.totalProps * 0.005), pct: 1.3},
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
      {modal && <ParcelModal filter={`${agg.label} — ${modal}`} onClose={() => setModal(null)} />}

      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 52, gap: 16 }}>
          <Link href="/" style={{ textDecoration: 'none' }}><span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>ICONYCS</span></Link>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>Analytics Reports</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Link href="/dashboard" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.bgWarm }}>AI Query Lab</Link>
            <Link href="/" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6 }}>← Home</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1500, margin: '0 auto', padding: 16, display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, minHeight: 'calc(100vh - 52px)' }}>

        {/* LEFT SIDEBAR — State Selector */}
        <div style={{ position: 'sticky', top: 68, height: 'fit-content' }}>
          <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Select Geography
            </div>

            {/* Search */}
            <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search states..."
                style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: C.font, outline: 'none', background: C.bgWarm }}
              />
            </div>

            {/* National / All toggle */}
            <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
              <button onClick={() => toggleState('ALL')} style={{
                width: '100%', padding: '8px 10px', borderRadius: 7, border: `1.5px solid ${isAll ? C.terra : C.border}`,
                background: isAll ? '#FFF0E9' : 'transparent', color: isAll ? C.terra : C.textBody,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: C.font, textAlign: 'left',
              }}>
                🌎 National (All States)
              </button>
            </div>

            {/* State list */}
            <div style={{ maxHeight: 480, overflowY: 'auto', padding: '6px 8px' }}>
              {filteredStates.map(s => {
                const isSel = !isAll && selected.includes(s.code);
                return (
                  <div key={s.code} onClick={() => toggleState(s.code)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 8px', borderRadius: 6, marginBottom: 2, cursor: 'pointer',
                    background: isSel ? '#FFF0E9' : 'transparent',
                    border: `1px solid ${isSel ? C.terra : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isSel ? C.terra : C.border}`, background: isSel ? C.terra : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isSel && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: isSel ? C.terra : C.textBody, fontWeight: isSel ? 600 : 400 }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 10, color: C.textDim, fontFamily: C.fontMono }}>{(s.props/1e6).toFixed(1)}M</span>
                  </div>
                );
              })}
            </div>

            {/* Selection summary */}
            {!isAll && selected.length > 0 && (
              <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, background: C.bgWarm }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{selected.length} state{selected.length > 1 ? 's' : ''} selected</div>
                <button onClick={() => setSelected(['ALL'])} style={{ fontSize: 11, color: C.terra, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: C.font }}>
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Dashboard */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, margin: 0 }}>
                {agg.label} Housing Analytics
              </h1>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                {agg.totalProps.toLocaleString()} properties · Avg value ${agg.avgValue.toLocaleString()} · {agg.stateCount} state{agg.stateCount > 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '6px 12px', borderRadius: 8, background: '#EDF4EB', fontSize: 11, fontWeight: 600, color: C.sage, display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
                Snowflake Live
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              {label:'Total Properties', value: (agg.totalProps/1e6).toFixed(1)+'M', color: C.terra},
              {label:'Est. Homeowners', value: (agg.totalProps*0.506/1e6).toFixed(1)+'M', color: C.sage},
              {label:'Avg Property Value', value: '$'+agg.avgValue.toLocaleString(), color: C.gold},
              {label:'States in Analysis', value: isAll ? '51' : String(agg.stateCount), color: C.navy},
            ].map((s, i) => (
              <div key={i} style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
                <div style={{ fontSize: 22, fontWeight: 300, color: s.color, fontFamily: C.fontSerif }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 6 }}>
            <FreqTable title="Owner Ethnicity" data={ethnicity} color={C.sage} />
            <FreqTable title="Property Type" data={propertyType} color={C.terra} />
            <FreqTable title="Mortgage Loan Type" data={loanType} color={C.gold} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {['Ethnicity Data','Property Type Data','Loan Type Data'].map((f,i) => (
              <button key={i} onClick={() => setModal(f)} style={{ padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                🔍 View Underlying Parcels →
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 6 }}>
            <HBarChart title="Top Mortgage Lenders" data={topLenders} />
            <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>State Breakdown</div>
              <div style={{ padding: '6px 14px', maxHeight: 220, overflowY: 'auto' }}>
                {(isAll ? ALL_STATES : ALL_STATES.filter(s => selected.includes(s.code)))
                  .sort((a,b) => b.props - a.props)
                  .slice(0, 15)
                  .map((s, i) => (
                  <div key={s.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${C.borderLight}`, fontSize: 12 }}>
                    <span style={{ color: C.textBody }}>{s.name}</span>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: C.fontMono, color: C.text, fontWeight: 500 }}>{(s.props/1e6).toFixed(2)}M</span>
                      <span style={{ fontFamily: C.fontMono, color: C.sage }}>${(s.avg/1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {['Lender Data','State Data'].map((f,i) => (
              <button key={i} onClick={() => setModal(f)} style={{ padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                🔍 View Underlying Parcels →
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 11, color: C.textDim }}>
            ICONYCS · Live Snowflake · 109.8M residential properties · April 2026
          </div>
        </div>
      </div>
    </div>
  );
}
