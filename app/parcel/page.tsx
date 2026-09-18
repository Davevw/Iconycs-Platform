'use client';

/**
 * /parcel — Iconycs internal parcel lookup (behind the whole-site gate).
 * David, 2026-09-18: "Parcel lookup tool inside both Iconycs and Solis."
 *
 * Address (+ ZIP or city/state) or APN (+ state) → assessor/recorder record via /api/parcel.
 * Assessor/recorder fields only — no owner names or household demographics on this surface.
 */

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF',
  border: '#E8E2D8',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', navy: '#1B2A4A',
  font: "'Outfit', sans-serif",
};

type Rec = Record<string, unknown>;
interface Result {
  mode: 'address' | 'apn';
  matches: number;
  parcel: Rec | null;
  candidates: Rec[];
  source: { name: string; vintage: string; note: string };
  executionTime: number;
}

// ── decoding (mirrors Solis ParcelLookup.tsx) ─────────────────────────────────
const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
};
const usd0 = (v: unknown) => {
  const n = num(v);
  return n === null ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
};
const int = (v: unknown) => { const n = num(v); return n === null ? '—' : n.toLocaleString('en-US'); };
const plain = (v: unknown) => { const n = num(v); return n === null ? '—' : String(Math.trunc(n)); };
const x100 = (v: unknown, d = 1) => { const n = num(v); return n === null ? '—' : (n / 100).toFixed(d).replace(/\.0+$/, ''); };
const ymd = (v: unknown) => {
  const s = v == null ? '' : String(v);
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
  if (!m) return s || '—';
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
const text = (v: unknown) => { const s = v == null ? '' : String(v).trim(); return s ? s.replace(/\s+/g, ' ') : '—'; };
const present = (v: unknown) => { const s = v == null ? '' : String(v).trim(); return !s ? '—' : s === 'N' || s === '0' ? 'No' : 'Yes'; };
const DEED: Record<string, string> = { G: 'Grant deed', W: 'Warranty deed', Q: 'Quitclaim deed', T: "Trustee's deed", S: 'Special warranty deed', B: 'Bargain & sale deed', C: 'Corporate deed', D: 'Deed', I: 'Interfamily transfer', F: 'Foreclosure / trustee sale', E: "Executor's deed" };
const deed = (v: unknown) => { const s = v == null ? '' : String(v).trim().toUpperCase(); return !s ? '—' : (DEED[s] ?? `Code ${s}`); };
const term = (v: unknown) => { const n = num(v); if (n === null) return '—'; return n <= 50 ? `${n} yr` : `${Math.round(n / 12)} yr (${int(n)} mo)`; };
const titleCase = (s: string) => s.toLowerCase().replace(/\b([a-z])/g, (c) => c.toUpperCase()).replace(/\b(Ne|Nw|Se|Sw|N|S|E|W)\b/g, (d) => d.toUpperCase());
const situs = (p: Rec) => titleCase([p.HOUSE, p.PREDIR, p.STREET, p.STRTYPE, p.POSTDIR].map((s) => (s == null ? '' : String(s).trim())).filter(Boolean).join(' '));

function sections(p: Rec): { title: string; rows: [string, string][] }[] {
  const baths = num(p.BATHS_CALC);
  const bathsStr = baths !== null ? x100(baths, 2).replace(/\.?0+$/, '') : num(p.FULL_BATHS) !== null ? `${int(p.FULL_BATHS)}${num(p.HALF_BATHS) ? ` + ${int(p.HALF_BATHS)} half` : ''}` : '—';
  const acres = num(p.ACRES);
  const acresStr = acres === null ? '—' : (acres > 100 ? acres / 10000 : acres).toFixed(2);
  const tax = num(p.TAX_AMOUNT);
  const mtg2Dup = num(p.MTG2_AMOUNT) !== null && num(p.MTG2_AMOUNT) === num(p.MTG1_AMOUNT) && text(p.MTG2_LENDER) === text(p.MTG1_LENDER);
  return [
    { title: 'Property', rows: [
      ['Type', text(p.PROP_TYPE_DESC ?? p.LANDUSE_DESC)], ['Year built', plain(p.YEAR_BUILT)], ['Stories', x100(p.STORIES, 0)],
      ['Bedrooms', int(p.BEDROOMS)], ['Bathrooms', bathsStr], ['Rooms', int(p.ROOMS)],
      ['Living area', num(p.LIVING_SQFT) === null ? '—' : `${int(p.LIVING_SQFT)} sq ft`],
      ['Lot', num(p.LAND_SQFT) === null ? '—' : `${int(p.LAND_SQFT)} sq ft · ${acresStr} ac`],
      ['Pool', present(p.POOL_CODE)], ['Garage / parking', `${present(p.GARAGE_CODE)}${num(p.PARKING_SPACES) ? ` · ${int(p.PARKING_SPACES)} spaces` : ''}`],
      ['Air conditioning', present(p.PROP_AC)], ['Quality', text(p.QUALITY_DESC)],
    ]},
    { title: 'Financing', rows: [
      ['1st mortgage', usd0(p.MTG1_AMOUNT)], ['Loan type', text(p.MTG1_LOAN_DESC ?? p.MTG1_LOAN_CATEGORY)], ['Lender', titleCase(text(p.MTG1_LENDER))],
      ['Origination', ymd(p.MTG1_DATE)], ['Term', term(p.MTG1_TERM)], ['Maturity', ymd(p.MTG1_DUE_DATE)],
      ['Rate', num(p.MTG1_INTEREST_RATE) === null ? '—' : `${x100(p.MTG1_INTEREST_RATE, 3)}%`],
      ['2nd mortgage', mtg2Dup ? '—' : usd0(p.MTG2_AMOUNT)], ['3rd mortgage', usd0(p.MTG3_AMOUNT)],
    ]},
    { title: 'Sale history', rows: [
      ['Last sale date', ymd(p.SALE_DATE)], ['Last sale price', usd0(p.SALE_AMOUNT)], ['Deed', deed(p.DEED_TYPE)], ['Recording date', ymd(p.RECORDING_DATE)],
      ['Prior sale date', ymd(p.PRIOR_SALE_DATE)], ['Prior sale price', usd0(p.PRIOR_SALE_AMOUNT)],
    ]},
    { title: 'Valuation & tax', rows: [
      ['Market value', usd0(p.VALUE_MARKET)], ['Assessed value', usd0(p.VALUE_ASSESSED)], ['Appraised value', usd0(p.VALUE_APPRAISED)],
      ['Land / improvement', `${usd0(p.VALUE_MARKET_LAND)} / ${usd0(p.VALUE_MARKET_IMPROVEMENT)}`],
      ['Annual tax', `${tax === null ? '—' : usd0(tax / 100)}${p.TAX_YEAR ? ` (${plain(p.TAX_YEAR)})` : ''}`],
      ['Occupancy', text(p.OCCUPANCY_STATUS)], ['Homestead exemption', present(p.PROP_HOMESTEAD)],
    ]},
  ];
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6,
  fontFamily: C.font, fontSize: 14, color: C.text, background: '#fff',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6 };

export default function ParcelPage() {
  const [mode, setMode] = useState<'address' | 'apn'>('address');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [apn, setApn] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setResult(null);
    const qs = new URLSearchParams();
    if (mode === 'apn') { qs.set('apn', apn); qs.set('state', state); }
    else { qs.set('address', address); if (zip) qs.set('zip', zip); if (unit) qs.set('unit', unit); if (city) qs.set('city', city); if (state) qs.set('state', state); }
    try {
      const r = await fetch(`/api/parcel?${qs}`, { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? `HTTP ${r.status}`);
      if (!j.parcel) setError('No residential parcel matched. Check the house number and ZIP, or try the APN.');
      else setResult(j as Result);
    } catch (err: any) {
      setError(err?.message ?? 'Lookup failed.');
    } finally { setBusy(false); }
  }

  const p = result?.parcel;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font, color: C.text }}>
      <div style={{ background: C.navy, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>ICONYCS</Link>
        <Link href="/reports" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>Back to Reports</Link>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'inline-block', background: '#EEF2F7', border: `1px solid ${C.navy}33`, borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 24 }}>
          PARCEL LOOKUP
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1.2 }}>Individual parcel record</h1>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32, maxWidth: 680, lineHeight: 1.6 }}>
          Street address or assessor parcel number → property characteristics, sale history, mortgage liens, valuation and tax
          from the licensed county assessor and recorder files. Residential parcels only.
        </p>

        <form onSubmit={submit} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['address', 'apn'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: C.font,
                border: `1px solid ${mode === m ? C.terra : C.border}`, color: mode === m ? C.terra : C.textMuted, background: '#fff',
              }}>{m === 'address' ? 'Street address' : 'Parcel number (APN)'}</button>
            ))}
          </div>
          {mode === 'address' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
              <div><label style={labelStyle} htmlFor="address">Street address</label><input id="address" style={inputStyle} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="4325 E Sleighbell Dr" required /></div>
              <div><label style={labelStyle} htmlFor="unit">Unit <span style={{ fontWeight: 400, opacity: 0.7 }}>(condo/apt)</span></label><input id="unit" style={inputStyle} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="206" /></div>
              <div><label style={labelStyle} htmlFor="zip">ZIP</label><input id="zip" style={inputStyle} value={zip} onChange={(e) => setZip(e.target.value)} placeholder="85297" inputMode="numeric" /></div>
              <div><label style={labelStyle} htmlFor="city">City (if no ZIP)</label><input id="city" style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Gilbert" /></div>
              <div><label style={labelStyle} htmlFor="state">State</label><input id="state" style={inputStyle} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} placeholder="AZ" maxLength={2} /></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div><label style={labelStyle} htmlFor="apn">Assessor parcel number</label><input id="apn" style={inputStyle} value={apn} onChange={(e) => setApn(e.target.value)} placeholder="313-01-821" required /><div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>Use the county&apos;s formatting, including dashes.</div></div>
              <div><label style={labelStyle} htmlFor="apn-state">State</label><input id="apn-state" style={inputStyle} value={state} onChange={(e) => setState(e.target.value.toUpperCase())} placeholder="AZ" maxLength={2} required /></div>
            </div>
          )}
          {error && <p style={{ marginTop: 16, fontSize: 13, color: '#B42318' }}>{error}</p>}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: C.textDim }}>Warehouse read; first query after idle may take up to ~10s while the warehouse resumes.</span>
            <button type="submit" disabled={busy} style={{ padding: '10px 18px', background: busy ? C.textDim : C.terra, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: busy ? 'default' : 'pointer', fontFamily: C.font }}>
              {busy ? 'Looking up…' : 'Look up parcel'}
            </button>
          </div>
        </form>

        {p && (
          <article style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <header style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: C.terra }}>PARCEL RECORD</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.navy, margin: '8px 0 2px' }}>{situs(p)}</h2>
                <div style={{ fontSize: 14, color: C.textMuted }}>{titleCase(text(p.CITY))}, {text(p.STATE)} {text(p.ZIP)}</div>
                {p.PROP_SUBDIVISION ? <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>{titleCase(text(p.PROP_SUBDIVISION))}</div> : null}
              </div>
              <div style={{ fontSize: 13, textAlign: 'right' }}>
                <div style={{ color: C.textMuted }}>APN <span style={{ fontFamily: 'ui-monospace, monospace', color: C.text, marginLeft: 8 }}>{text(p.APN)}</span></div>
                <div style={{ color: C.textMuted, marginTop: 4 }}>County FIPS <span style={{ fontFamily: 'ui-monospace, monospace', color: C.text, marginLeft: 8 }}>{text(p.PROP_FIPSCD)}</span></div>
                {p.PROP_CENSUSTRACT ? <div style={{ color: C.textMuted, marginTop: 4 }}>Tract <span style={{ fontFamily: 'ui-monospace, monospace', color: C.text, marginLeft: 8 }}>{text(p.PROP_CENSUSTRACT)}</span></div> : null}
              </div>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, padding: 24 }}>
              {sections(p).map((s) => (
                <section key={s.title}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: C.terra, marginBottom: 10 }}>{s.title.toUpperCase()}</h3>
                  <dl style={{ margin: 0 }}>
                    {s.rows.map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: `1px solid ${C.border}66`, fontSize: 14 }}>
                        <dt style={{ color: C.textMuted }}>{k}</dt>
                        <dd style={{ margin: 0, color: v === '—' ? C.textDim : C.text, textAlign: 'right' }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
            <footer style={{ padding: '14px 24px', borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: C.text }}>{result.source.name}</strong> · {result.source.vintage} vintage · {result.source.note}
              {result.candidates.length > 0 && <> · {result.candidates.length} additional unit{result.candidates.length === 1 ? '' : 's'} matched (showing first).</>}
              {' '}· {(result.executionTime / 1000).toFixed(1)}s
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
