'use client';

/**
 * ICONYCS Cascade Report Builder — Sprint 2
 * Matrix drill-down across Property, Ownership, Social, Media, and Lender cascades.
 */

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CASCADE_START_POINTS,
  LOAN_TYPES,
  ETHNICITY_CODES,
  WEALTH_SCORE_TIERS,
  loanTypeLabel,
  type CascadeType,
} from '@/lib/tiers';

// ─── Design Tokens ─────────────────────────────────────────────────────────
const C = {
  bg: '#F5F0E8',       // slightly darker to differentiate cascade
  bgCard: '#FFFFFF',
  bgWarm: '#EDE8DF',
  border: '#E8E2D8',
  text: '#1C1917',
  textBody: '#3D3833',
  textMuted: '#78716C',
  textDim: '#A8A29E',
  terra: '#C4653A',
  sage: '#5D7E52',
  gold: '#B8860B',
  navy: '#1B2A4A',
  chart: ['#C4653A','#5D7E52','#B8860B','#4A7FB5','#A85D8A','#3D908E','#D4845E','#7A6B5D'],
  font: "'Outfit', sans-serif",
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface FreqRow { label: string; count: number; pct?: number; extra?: string }

interface PropertyData {
  rows: any[];
  loading: boolean;
  error: string | null;
}

interface OwnershipData {
  rows: any[];
  loading: boolean;
  error: string | null;
}

interface LendersData {
  rows: any[];
  loading: boolean;
  error: string | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, decimals = 0): string {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function fmtDollar(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function aggregateBy(rows: any[], key: string): FreqRow[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const val = String(r[key] ?? 'Unknown');
    map.set(val, (map.get(val) ?? 0) + Number(r.RECORD_COUNT ?? 0));
  }
  const total = Array.from(map.values()).reduce((s, v) => s + v, 0);
  return Array.from(map.entries())
    .map(([label, count]) => ({
      label,
      count,
      pct: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildCascadeUrl(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v);
  }
  return `/reports/cascade?${sp.toString()}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Skeleton({ h = 18, w = '100%' }: { h?: number; w?: string | number }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 6,
      background: `linear-gradient(90deg, #EDE8DF 25%, #E2DDD4 50%, #EDE8DF 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function ErrorMsg({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '10px 14px', background: '#FFF4F0', borderRadius: 8, border: `1px solid ${C.terra}30`, display: 'flex', gap: 10, alignItems: 'center' }}>
      <span>⚠️</span>
      <span style={{ fontSize: 12, color: C.terra, flex: 1 }}>{msg}</span>
      {onRetry && (
        <button onClick={onRetry} style={{ fontSize: 11, color: C.terra, background: 'none', border: `1px solid ${C.terra}60`, borderRadius: 5, padding: '3px 8px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
          Retry
        </button>
      )}
    </div>
  );
}

function FreqTable({
  title,
  data,
  loading = false,
  error = null,
  onRetry,
  onRowClick,
  activeFilter,
  barColor = C.terra,
}: {
  title: string;
  data: FreqRow[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onRowClick?: (label: string) => void;
  activeFilter?: string;
  barColor?: string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '9px 14px', background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </div>
      {loading ? (
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} />)}
        </div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : data.length === 0 ? (
        <div style={{ padding: 14, fontSize: 12, color: C.textDim, textAlign: 'center' }}>No data for current filters</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px', padding: '5px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
            <span>CATEGORY</span><span style={{ textAlign: 'right' }}>COUNT</span><span style={{ textAlign: 'right' }}>%</span>
          </div>
          {data.map((row, i) => {
            const pct = total > 0 ? (row.count / total) * 100 : 0;
            const isActive = activeFilter === row.label;
            return (
              <div
                key={i}
                onClick={() => onRowClick?.(row.label)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 60px',
                  padding: '6px 14px',
                  borderBottom: `1px solid ${C.border}`,
                  cursor: onRowClick ? 'pointer' : 'default',
                  background: isActive ? `${barColor}15` : 'transparent',
                  transition: 'background 0.15s',
                  position: 'relative',
                  alignItems: 'center',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = C.bgWarm; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isActive ? `${barColor}15` : 'transparent'; }}
              >
                {/* bar */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(2, pct)}%`, background: `${barColor}20`, pointerEvents: 'none' }} />
                <span style={{ fontSize: 12, color: isActive ? barColor : C.textBody, fontWeight: isActive ? 700 : 400, position: 'relative', zIndex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isActive && '● '}{row.label}
                </span>
                <span style={{ fontSize: 12, color: C.textMuted, textAlign: 'right', position: 'relative', zIndex: 1 }}>{fmt(row.count)}</span>
                <span style={{ fontSize: 11, color: C.textDim, textAlign: 'right', position: 'relative', zIndex: 1 }}>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
          <div style={{ padding: '6px 14px', display: 'grid', gridTemplateColumns: '1fr 80px 60px', borderTop: `1px solid ${C.border}`, background: C.bgWarm }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>TOTAL</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.navy, textAlign: 'right' }}>{fmt(total)}</span>
            <span style={{ fontSize: 11, color: C.textDim, textAlign: 'right' }}>100%</span>
          </div>
        </>
      )}
    </div>
  );
}

function MiniDonut({ data, colors }: { data: FreqRow[]; colors: string[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textDim, fontSize: 12 }}>No data</div>;

  const radius = 45, cx = 60, cy = 55, strokeW = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={120} height={110} viewBox="0 0 120 110">
      {data.map((d, i) => {
        const pct = d.count / total;
        const dash = circumference * pct;
        const gap = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={C.textMuted}>
        {data.length} types
      </text>
    </svg>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: C.bgCard, borderRadius: 8, border: `1px solid ${C.border}`, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.textMuted }}>{sub}</div>}
    </div>
  );
}

// ─── Property Cascade View ──────────────────────────────────────────────────

function PropertyCascade({
  propData,
  lendersData,
  filters,
  onFilter,
  loadProp,
  loadLenders,
}: {
  propData: PropertyData;
  lendersData: LendersData;
  filters: Record<string, string>;
  onFilter: (key: string, value: string) => void;
  loadProp: () => void;
  loadLenders: () => void;
}) {
  const rows = propData.rows;
  const purchaseVal = aggregateBy(rows, 'PURCHASE_VALUE_TIER');
  const marketVal   = aggregateBy(rows, 'MARKET_VALUE_TIER');
  const ownership   = aggregateBy(rows, 'OWNERSHIP_DURATION');
  const ltv         = aggregateBy(rows, 'LTV_TIER');
  const loanType    = aggregateBy(rows, 'LOAN_TYPE');
  const occupancy   = aggregateBy(rows, 'OCCUPANCY');

  // Summary stats
  const totalRecords   = rows.reduce((s, r) => s + Number(r.RECORD_COUNT ?? 0), 0);
  const avgMarketVal   = rows.length > 0 ? rows.reduce((s, r) => s + Number(r.AVG_MARKET_VALUE ?? 0), 0) / rows.length : 0;
  const avgLoanAmt     = rows.length > 0 ? rows.reduce((s, r) => s + Number(r.AVG_LOAN_AMOUNT ?? 0), 0) / rows.length : 0;
  const totalLiens     = rows.reduce((s, r) => s + Number(r.TOTAL_LIENS ?? 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <StatCard label="Total Properties" value={fmt(totalRecords)} />
        <StatCard label="Avg Market Value" value={fmtDollar(avgMarketVal)} />
        <StatCard label="Avg Loan Amount"  value={fmtDollar(avgLoanAmt)} />
        <StatCard label="Total Liens"      value={fmtDollar(totalLiens)} />
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FreqTable title="Purchase Value Tier" data={purchaseVal} loading={propData.loading} error={propData.error}
          onRetry={loadProp} onRowClick={v => onFilter('purchase_value', v)} barColor={C.terra} />
        <FreqTable title="Market Value Tier" data={marketVal} loading={propData.loading} error={propData.error}
          onRetry={loadProp} onRowClick={v => onFilter('value_tier', v)} barColor={C.sage} activeFilter={filters.value_tier} />
        <FreqTable title="Ownership Duration" data={ownership} loading={propData.loading} error={propData.error}
          onRetry={loadProp} onRowClick={v => onFilter('ownership_duration', v)} barColor={C.gold} activeFilter={filters.ownership_duration} />
        <FreqTable title="LTV Tier (FNMA)" data={ltv} loading={propData.loading} error={propData.error}
          onRetry={loadProp} onRowClick={v => onFilter('ltv_tier', v)} barColor={C.navy} activeFilter={filters.ltv_tier} />
      </div>

      {/* Loan type + occupancy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '9px 14px', background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loan Type</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
            <MiniDonut data={loanType} colors={LOAN_TYPES.map(lt => lt.color)} />
            <div style={{ flex: 1 }}>
              {loanType.map((row, i) => (
                <div key={i} onClick={() => onFilter('loan_type', row.label)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.textBody, flex: 1 }}>{row.label}</span>
                  <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>{row.pct?.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <FreqTable title="Occupancy" data={occupancy} loading={propData.loading} error={propData.error}
          onRetry={loadProp} onRowClick={v => onFilter('occupancy', v)} barColor='#4A7FB5' activeFilter={filters.occupancy} />
      </div>

      {/* Top 10 Lenders */}
      <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '9px 14px', background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top 10 Lenders</div>
        {lendersData.loading ? (
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>{[1,2,3].map(i => <Skeleton key={i} />)}</div>
        ) : lendersData.error ? (
          <div style={{ padding: 12 }}><ErrorMsg msg={lendersData.error} onRetry={loadLenders} /></div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '5px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
              <span>LENDER</span><span style={{ textAlign: 'right' }}>TYPE</span><span style={{ textAlign: 'right' }}>COUNT</span><span style={{ textAlign: 'right' }}>AVG LOAN</span>
            </div>
            {lendersData.rows.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '6px 14px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: C.textBody, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {i + 1}. {r.LENDER_NAME ?? '—'}
                </span>
                <span style={{ fontSize: 11, color: C.textMuted, textAlign: 'right' }}>{r.LOAN_TYPE ?? '—'}</span>
                <span style={{ fontSize: 12, color: C.textBody, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(r.LOAN_COUNT)}</span>
                <span style={{ fontSize: 12, color: C.terra, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{fmtDollar(r.AVG_LOAN_AMOUNT)}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Ownership Cascade View ─────────────────────────────────────────────────

function OwnershipCascade({
  ownData,
  filters,
  onFilter,
  loadOwn,
}: {
  ownData: OwnershipData;
  filters: Record<string, string>;
  onFilter: (key: string, value: string) => void;
  loadOwn: () => void;
}) {
  const rows = ownData.rows;
  const ethnicity = aggregateBy(rows, 'ETHNICITY_DESC');
  const gender    = aggregateBy(rows, 'GENDER');
  const marital   = aggregateBy(rows, 'MARITALSTAT');
  const education = aggregateBy(rows, 'EDUCATION_LEVEL');
  const income    = aggregateBy(rows, 'INCOME_TIER');
  const wealth    = aggregateBy(rows, 'WEALTH_SCORE');

  const totalRecords = rows.reduce((s, r) => s + Number(r.RECORD_COUNT ?? 0), 0);

  const genderLabels: Record<string, string> = { M: 'Male', F: 'Female' };
  const maritalLabels: Record<string, string> = { M: 'Married', S: 'Single', U: 'Unknown' };

  const genderDisplay = gender.map(g => ({ ...g, label: genderLabels[g.label] ?? g.label }));
  const maritalDisplay = marital.map(m => ({ ...m, label: maritalLabels[m.label] ?? m.label }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <StatCard label="Direct Identified Records" value={fmt(totalRecords)} sub="Demographic records matched" />
        <StatCard label="Ethnicity Groups" value={String(ethnicity.filter(e => e.label !== 'Not Identified').length)} sub="Identified ethnicities" />
        <StatCard label="Income Tiers" value={String(income.length)} sub="Income brackets present" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Ethnicity with confidence badges */}
        <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '9px 14px', background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ethnicity — Direct Identified Records</div>
          {ownData.loading ? (
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>{[1,2,3].map(i => <Skeleton key={i} />)}</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 50px 50px', padding: '5px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
                <span>ETHNICITY</span><span style={{ textAlign: 'right' }}>COUNT</span><span style={{ textAlign: 'right' }}>%</span><span style={{ textAlign: 'right' }}>CONF</span>
              </div>
              {ethnicity.map((row, i) => {
                const ethCode = ETHNICITY_CODES.find(e => e.description === row.label);
                const color = ethCode?.color ?? C.textDim;
                const conf = ethCode?.confidenceBadge ?? 'N/A';
                const pct = totalRecords > 0 ? (row.count / totalRecords) * 100 : 0;
                return (
                  <div key={i} onClick={() => onFilter('ethnicity', ethCode?.code ?? '')}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 70px 50px 50px', padding: '6px 14px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', alignItems: 'center' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.bgWarm; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                    <span style={{ fontSize: 12, color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                      {row.label}
                    </span>
                    <span style={{ fontSize: 12, color: C.textMuted, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(row.count)}</span>
                    <span style={{ fontSize: 11, color: C.textDim, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                    <span style={{ fontSize: 10, textAlign: 'right' }}>
                      <span style={{ background: conf === 'High' ? `${C.sage}20` : C.bgWarm, color: conf === 'High' ? C.sage : C.textDim, borderRadius: 4, padding: '2px 5px', fontWeight: 600 }}>{conf}</span>
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FreqTable title="Gender" data={genderDisplay} loading={ownData.loading} error={ownData.error}
            onRetry={loadOwn} onRowClick={v => onFilter('gender', Object.keys(genderLabels).find(k => genderLabels[k] === v) ?? v)} barColor='#4A7FB5' />
          <FreqTable title="Marital Status" data={maritalDisplay} loading={ownData.loading} error={ownData.error}
            onRetry={loadOwn} onRowClick={v => onFilter('marital_status', Object.keys(maritalLabels).find(k => maritalLabels[k] === v) ?? v)} barColor={C.gold} />
        </div>

        <FreqTable title="Education Level" data={education} loading={ownData.loading} error={ownData.error}
          onRetry={loadOwn} onRowClick={v => onFilter('education', v)} barColor={C.sage} activeFilter={filters.education} />
        <FreqTable title="Income Tier" data={income} loading={ownData.loading} error={ownData.error}
          onRetry={loadOwn} onRowClick={v => onFilter('income_tier', v)} barColor={C.terra} activeFilter={filters.income_tier} />
      </div>

      {/* Wealth Score */}
      <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '9px 14px', background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wealth Score Distribution (A–H)</div>
        {ownData.loading ? (
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>{[1,2,3].map(i => <Skeleton key={i} />)}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: C.border }}>
            {WEALTH_SCORE_TIERS.map((tier) => {
              const row = wealth.find(w => w.label === tier.score);
              const count = row?.count ?? 0;
              const total2 = wealth.reduce((s, w) => s + w.count, 0);
              const pct = total2 > 0 ? (count / total2) * 100 : 0;
              return (
                <div key={tier.score} style={{ background: C.bgCard, padding: '10px 12px', textAlign: 'center', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.bgWarm; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = C.bgCard; }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: tier.color, fontFamily: "'IBM Plex Mono', monospace" }}>{tier.score}</div>
                  <div style={{ fontSize: 9, color: C.textDim, marginTop: 2, lineHeight: 1.2 }}>{tier.description.split('(')[0].trim()}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{pct.toFixed(1)}%</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{fmt(count)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Placeholder cascades ────────────────────────────────────────────────────

function PlaceholderCascade({ label, icon }: { label: string; icon: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 60, background: C.bgCard, borderRadius: 12, border: `1px dashed ${C.border}` }}>
      <div style={{ fontSize: 40 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{label} Cascade</div>
      <div style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', maxWidth: 360 }}>
        This cascade dimension requires Enterprise tier access. Includes detailed social and media signal data.
      </div>
      <div style={{ padding: '8px 20px', background: C.navy, color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        🔒 Upgrade to Enterprise
      </div>
    </div>
  );
}

// ─── Main Component (inner — reads search params) ───────────────────────────

function CascadeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cascadeType, setCascadeType] = useState<CascadeType>('property');

  // Active filters
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Geo from search params
  const geoState  = searchParams.get('state')  ?? '';
  const geoCounty = searchParams.get('county') ?? '';
  const geoCity   = searchParams.get('city')   ?? '';
  const geoZip    = searchParams.get('zip')    ?? '';

  // Data states
  const [propData, setPropData]       = useState<PropertyData>({ rows: [], loading: false, error: null });
  const [ownData, setOwnData]         = useState<OwnershipData>({ rows: [], loading: false, error: null });
  const [lendersData, setLendersData] = useState<LendersData>({ rows: [], loading: false, error: null });

  // Build query params from geo + filters
  function buildQP(extra: Record<string, string> = {}): string {
    const sp = new URLSearchParams();
    if (geoState)  sp.set('state', geoState);
    if (geoCounty) sp.set('county', geoCounty);
    if (geoCity)   sp.set('city', geoCity);
    if (geoZip)    sp.set('zip', geoZip);
    for (const [k, v] of Object.entries(filters)) if (v) sp.set(k, v);
    for (const [k, v] of Object.entries(extra)) if (v) sp.set(k, v);
    return sp.toString();
  }

  const loadProp = useCallback(async () => {
    setPropData(d => ({ ...d, loading: true, error: null }));
    try {
      const res = await fetch(`/api/snowflake/cascade/property?${buildQP()}`);
      const json = await res.json();
      if (json.success) setPropData({ rows: json.data ?? [], loading: false, error: null });
      else setPropData({ rows: [], loading: false, error: json.error ?? 'Failed to load' });
    } catch (e: any) {
      setPropData({ rows: [], loading: false, error: e?.message ?? 'Network error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoState, geoCounty, geoCity, geoZip, JSON.stringify(filters)]);

  const loadOwn = useCallback(async () => {
    setOwnData(d => ({ ...d, loading: true, error: null }));
    try {
      const res = await fetch(`/api/snowflake/cascade/ownership?${buildQP()}`);
      const json = await res.json();
      if (json.success) setOwnData({ rows: json.data ?? [], loading: false, error: null });
      else setOwnData({ rows: [], loading: false, error: json.error ?? 'Failed to load' });
    } catch (e: any) {
      setOwnData({ rows: [], loading: false, error: e?.message ?? 'Network error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoState, geoCounty, geoCity, geoZip, JSON.stringify(filters)]);

  const loadLenders = useCallback(async () => {
    setLendersData(d => ({ ...d, loading: true, error: null }));
    try {
      const res = await fetch(`/api/snowflake/cascade/lenders?${buildQP()}`);
      const json = await res.json();
      if (json.success) setLendersData({ rows: json.data ?? [], loading: false, error: null });
      else setLendersData({ rows: [], loading: false, error: json.error ?? 'Failed to load' });
    } catch (e: any) {
      setLendersData({ rows: [], loading: false, error: e?.message ?? 'Network error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoState, geoCounty, geoCity, geoZip, JSON.stringify(filters)]);

  // Load data on mount + when cascade type changes
  useEffect(() => {
    if (cascadeType === 'property' || cascadeType === 'lender') {
      loadProp();
      loadLenders();
    }
    if (cascadeType === 'ownership') {
      loadOwn();
    }
  }, [cascadeType, loadProp, loadOwn, loadLenders]);

  function handleFilter(key: string, value: string) {
    setFilters(f => {
      // Toggle off if same value
      if (f[key] === value) {
        const next = { ...f };
        delete next[key];
        return next;
      }
      return { ...f, [key]: value };
    });
  }

  function clearFilters() {
    setFilters({});
  }

  // Build breadcrumb
  const breadcrumb: string[] = ['National'];
  if (geoState)  breadcrumb.push(geoState);
  if (geoCounty) breadcrumb.push(geoCounty);
  if (geoCity)   breadcrumb.push(geoCity);
  if (geoZip)    breadcrumb.push(geoZip);

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div style={{ fontFamily: C.font, background: C.bg, minHeight: '100vh', color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bgWarm}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.navy, color: '#fff', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/reports" style={{ color: '#fff', opacity: 0.7, fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
          ← Reports
        </Link>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em' }}>CASCADE REPORT BUILDER</div>
        <div style={{ flex: 1 }} />
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: 0.85 }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ opacity: 0.5 }}>›</span>}
              <span style={{ fontWeight: i === breadcrumb.length - 1 ? 700 : 400 }}>{crumb}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
        {/* Left sidebar — cascade type selector */}
        <div style={{ width: 220, background: '#fff', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>
            Start Point
          </div>
          {CASCADE_START_POINTS.map(sp => {
            const isActive = cascadeType === sp.id;
            const isLocked = sp.minTier === 'enterprise' || sp.minTier === 'data_partner';
            return (
              <div
                key={sp.id}
                onClick={() => !isLocked && setCascadeType(sp.id)}
                style={{
                  padding: '14px 16px',
                  background: isActive ? `${C.terra}10` : 'transparent',
                  borderLeft: isActive ? `3px solid ${C.terra}` : '3px solid transparent',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isLocked && !isActive) (e.currentTarget as HTMLDivElement).style.background = C.bgWarm; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isActive ? `${C.terra}10` : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{sp.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? C.terra : C.navy, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {sp.label}
                      {isLocked && <span style={{ fontSize: 10 }}>🔒</span>}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, lineHeight: 1.3 }}>{sp.description}</div>
                  </div>
                </div>
                {isActive && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sp.dimensions.map(dim => (
                      <div key={dim} style={{ fontSize: 10, color: C.terra, padding: '1px 0', paddingLeft: 26 }}>• {dim}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Active filters panel */}
          {activeFilterCount > 0 && (
            <div style={{ margin: 12, background: C.bgWarm, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Filters</span>
                <button onClick={clearFilters} style={{ fontSize: 9, color: C.terra, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.font, fontWeight: 700 }}>Clear All</button>
              </div>
              {Object.entries(filters).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textBody, padding: '2px 0' }}>
                  <span style={{ color: C.textMuted }}>{k.replace(/_/g, ' ')}</span>
                  <span style={{ fontWeight: 600, color: C.terra }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {cascadeType === 'property' && (
              <PropertyCascade
                propData={propData}
                lendersData={lendersData}
                filters={filters}
                onFilter={handleFilter}
                loadProp={loadProp}
                loadLenders={loadLenders}
              />
            )}
            {cascadeType === 'ownership' && (
              <OwnershipCascade
                ownData={ownData}
                filters={filters}
                onFilter={handleFilter}
                loadOwn={loadOwn}
              />
            )}
            {cascadeType === 'lender' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <StatCard label="Total Lenders" value={fmt(lendersData.rows.length)} />
                  <StatCard label="Top Lender" value={lendersData.rows[0]?.LENDER_NAME ?? '—'} sub="By loan count" />
                  <StatCard label="Avg Loan (Top 10)" value={fmtDollar(lendersData.rows.slice(0, 10).reduce((s, r) => s + Number(r.AVG_LOAN_AMOUNT ?? 0), 0) / Math.max(lendersData.rows.slice(0, 10).length, 1))} />
                </div>
                <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  <div style={{ padding: '9px 14px', background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lender Analysis</div>
                  {lendersData.loading ? (
                    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>{[1,2,3,4,5].map(i => <Skeleton key={i} />)}</div>
                  ) : lendersData.error ? (
                    <div style={{ padding: 12 }}><ErrorMsg msg={lendersData.error} onRetry={loadLenders} /></div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '5px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
                        <span>#  LENDER</span><span style={{ textAlign: 'right' }}>TYPE</span><span style={{ textAlign: 'right' }}>COUNT</span><span style={{ textAlign: 'right' }}>AVG LOAN</span><span style={{ textAlign: 'right' }}>AVG PROP VAL</span>
                      </div>
                      {lendersData.rows.map((r, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '7px 14px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: C.textBody }}>
                            <span style={{ color: C.textDim, marginRight: 8 }}>{i + 1}.</span>{r.LENDER_NAME ?? '—'}
                          </span>
                          <span style={{ fontSize: 11, color: C.textMuted, textAlign: 'right' }}>{loanTypeLabel(r.LOAN_TYPE)}</span>
                          <span style={{ fontSize: 12, color: C.textBody, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(r.LOAN_COUNT)}</span>
                          <span style={{ fontSize: 12, color: C.terra, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{fmtDollar(r.AVG_LOAN_AMOUNT)}</span>
                          <span style={{ fontSize: 12, color: C.navy, textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace" }}>{fmtDollar(r.AVG_PROPERTY_VALUE)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
            {cascadeType === 'social' && <PlaceholderCascade label="Social Network" icon="🌐" />}
            {cascadeType === 'media' && <PlaceholderCascade label="Social Media" icon="📱" />}
          </div>
        </div>
      </div>

      {/* Floating Back button */}
      <div
        onClick={() => router.back()}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          background: C.navy, color: '#fff',
          borderRadius: 24, padding: '10px 20px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(27,42,74,0.35)',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'transform 0.15s, box-shadow 0.15s',
          userSelect: 'none',
          zIndex: 100,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(27,42,74,0.45)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'none';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(27,42,74,0.35)';
        }}
      >
        ↑ Back
      </div>
    </div>
  );
}

// ─── Page export (wraps in Suspense for useSearchParams) ────────────────────

export default function CascadePage() {
  return (
    <Suspense fallback={
      <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78716C' }}>
        Loading Cascade Builder…
      </div>
    }>
      <CascadeInner />
    </Suspense>
  );
}
