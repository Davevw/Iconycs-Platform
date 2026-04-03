'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#FAFAF7', bgWarm: '#F5F0E8', bgCard: '#FFFFFF', bgCode: '#FBF5EE', bgAccent: '#FFF8F4',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', terraSoft: '#FFF0E9', terraDark: '#9A4420',
  sage: '#5D7E52', sageSoft: '#EDF4EB',
  gold: '#B8860B', goldSoft: '#FDF6E3',
  navy: '#1B2A4A',
  chart: ['#C4653A', '#5D7E52', '#B8860B', '#4A7FB5', '#A85D8A', '#3D908E', '#D4845E', '#7A6B5D'],
  font: "'Outfit', sans-serif",
  fontSerif: "'Source Serif 4', Georgia, serif",
  fontMono: "'IBM Plex Mono', monospace",
};

function DynChart({ spec }: any) {
  if (!spec?.data?.length) return null;
  const xKey = spec.xKey || 'label';
  const yKeys = spec.yKeys || [{ key: 'value', name: 'Value' }];
  const yKey = yKeys[0]?.key || 'value';
  const max = Math.max(...spec.data.map((d: any) => Number(d[yKey]) || 0));

  if (spec.type === 'pie') {
    const total = spec.data.reduce((s: number, d: any) => s + (Number(d[yKey]) || 0), 0);
    return (
      <div>
        {spec.title && <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>{spec.title}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {spec.data.map((d: any, i: number) => {
            const pct = total > 0 ? ((Number(d[yKey]) / total) * 100).toFixed(1) : '0';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.textBody, flex: 1 }}>{d[xKey]}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.fontMono }}>{pct}%</span>
                <div style={{ width: 100, height: 8, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {spec.title && <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>{spec.title}</div>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, padding: '0 4px' }}>
        {spec.data.map((d: any, i: number) => {
          const val = Number(d[yKey]) || 0;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFamily: C.fontMono }}>{val}</span>
              <div style={{
                width: '100%', maxWidth: 52, height: `${max > 0 ? (val / max) * 160 : 0}px`, minHeight: 4,
                background: C.chart[i % C.chart.length], borderRadius: '6px 6px 3px 3px',
              }} />
              <span style={{ fontSize: 9, color: C.textMuted, textAlign: 'center', lineHeight: 1.2, maxWidth: 65, overflow: 'hidden' }}>{d[xKey]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const runQuery = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    try {
      setPhase('Claude Opus 4.6 generating SQL...');
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      setPhase('Processing results...');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Query failed');
      setMessages(prev => [...prev, {
        role: 'sql', sql: data.pipeline.sql.query,
        description: data.pipeline.sql.description,
        tables: data.pipeline.sql.tables, execution: data.pipeline.execution,
      }]);
      setMessages(prev => [...prev, {
        role: 'analysis', interpretation: data.pipeline.analysis.interpretation,
        insights: data.pipeline.analysis.insights, chart: data.pipeline.analysis.chart,
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'error', text: err.message }]);
    } finally { setLoading(false); setPhase(''); }
  };

  const SUGGESTIONS = [
    'Show homeownership rates by ethnicity',
    'Average property value by education level',
    'Income distribution of owners vs renters',
    'Single family vs multi family breakdown',
    'Marital status of homeowners',
    'Properties by state with highest values',
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
      <nav style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 24 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>ICONYCS</span>
          </Link>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>AI Query Lab</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 12, background: C.sageSoft }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.sage }}>Snowflake Live</span>
            </div>
            <Link href="/" style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none' }}>← Home</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 20, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, minHeight: 'calc(100vh - 56px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: C.bgCard, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🏠</div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: C.text, fontFamily: C.fontSerif, marginBottom: 8 }}>Ask anything about housing data</h2>
                <p style={{ fontSize: 13, color: C.textMuted, maxWidth: 380, margin: '0 auto', lineHeight: 1.7 }}>
                  Claude Opus 4.6 → Snowflake SQL → 130M+ records → Insights & Charts
                </p>
              </div>
            )}
            {messages.map((msg, i) => {
              if (msg.role === 'user') return (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '70%', padding: '11px 16px', borderRadius: '14px 14px 4px 14px', background: C.terra, color: '#fff', fontSize: 14, lineHeight: 1.6 }}>{msg.text}</div>
                </div>
              );
              if (msg.role === 'sql') return (
                <div key={i} style={{ background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.sage }}>✓ SQL Generated</span>
                    {msg.tables?.map((t: string) => <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: C.sageSoft, color: C.sage }}>{t}</span>)}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: msg.execution?.rowCount > 0 ? C.sage : C.gold }}>
                      {msg.execution?.connected ? (msg.execution.rowCount > 0 ? `${msg.execution.rowCount} rows · ${msg.execution.executionTime}ms` : 'Connected · AI-estimated') : 'Snowflake not configured'}
                    </span>
                  </div>
                  {msg.description && <div style={{ padding: '8px 16px', fontSize: 12, color: C.textMuted, borderBottom: `1px solid ${C.borderLight}` }}>{msg.description}</div>}
                  <pre style={{ padding: '14px 16px', fontSize: 11, lineHeight: 1.7, color: C.text, fontFamily: C.fontMono, overflow: 'auto', margin: 0, background: C.bgCode, whiteSpace: 'pre-wrap' }}>{msg.sql}</pre>
                </div>
              );
              if (msg.role === 'analysis') return (
                <div key={i} style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.gold }}>📊 Analysis</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, color: C.textBody, lineHeight: 1.85, marginBottom: 16, whiteSpace: 'pre-wrap' }}>
                      {msg.interpretation?.split(/\*\*(.*?)\*\*/g).map((p: string, j: number) => j % 2 === 1 ? <strong key={j} style={{ color: C.terra }}>{p}</strong> : p)}
                    </div>
                    {msg.chart && (
                      <div style={{ padding: 16, background: C.bg, borderRadius: 10, border: `1px solid ${C.borderLight}`, marginBottom: 16 }}>
                        <DynChart spec={msg.chart} />
                      </div>
                    )}
                    {msg.insights?.length > 0 && (
                      <div style={{ padding: 14, background: C.terraSoft, borderRadius: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.terra, marginBottom: 8 }}>Key Insights</div>
                        {msg.insights.map((ins: string, j: number) => (
                          <div key={j} style={{ fontSize: 13, color: C.textBody, lineHeight: 1.7, padding: '4px 0 4px 14px', borderLeft: `2px solid ${C.terra}30`, marginBottom: 4 }}>
                            {ins.split(/\*\*(.*?)\*\*/g).map((p: string, k: number) => k % 2 === 1 ? <strong key={k} style={{ color: C.terraDark }}>{p}</strong> : p)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
              if (msg.role === 'error') return (
                <div key={i} style={{ padding: '12px 16px', borderRadius: 12, background: C.terraSoft, border: `1px solid ${C.terra}25`, color: C.terraDark, fontSize: 13 }}>⚠️ {msg.text}</div>
              );
              return null;
            })}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, width: 'fit-content' }}>
                <div style={{ width: 14, height: 14, border: `2px solid ${C.terra}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: 13, color: C.terra, fontWeight: 500 }}>{phase}</span>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && runQuery()}
                placeholder={loading ? 'Processing...' : 'Ask about housing data...'} disabled={loading}
                style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: 'none', fontFamily: C.font }}
              />
              <button onClick={runQuery} disabled={loading || !input.trim()}
                style={{ padding: '11px 22px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, fontFamily: C.font, cursor: 'pointer', background: !loading && input.trim() ? C.terra : C.border, color: '#fff' }}>Send</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>Try these queries</div>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{ display: 'block', width: '100%', padding: '8px 10px', marginBottom: 5, borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.textBody, fontSize: 12, textAlign: 'left', cursor: 'pointer', fontFamily: C.font }}>{s}</button>
            ))}
          </div>
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>Pipeline</div>
            {['1. Claude Opus 4.6 → SQL', '2. Snowflake → Execute', '3. Claude Sonnet → Interpret', '4. Chart → Visualize'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12, color: C.textBody }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: [C.terra, C.sage, C.gold, C.navy][i] }} />{s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
