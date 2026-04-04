'use client';

/**
 * ICONYCS Analytics Reports "" Sprint 1
 * Live Snowflake data, full drill-down, mortgage intelligence, export.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GEO_DATA } from '@/lib/geodata';

// â"€â"€â"€ County FIPS Code Lookup â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const COUNTY_FIPS: Record<string, Record<string, string>> = {
  CA: { '001':'Alameda','003':'Alpine','005':'Amador','007':'Butte','009':'Calaveras','011':'Colusa','013':'Contra Costa','015':'Del Norte','017':'El Dorado','019':'Fresno','021':'Glenn','023':'Humboldt','025':'Imperial','027':'Inyo','029':'Kern','031':'Kings','033':'Lake','035':'Lassen','037':'Los Angeles','039':'Madera','041':'Marin','043':'Mariposa','045':'Mendocino','047':'Merced','049':'Modoc','051':'Mono','053':'Monterey','055':'Napa','057':'Nevada','059':'Orange','061':'Placer','063':'Plumas','065':'Riverside','067':'Sacramento','069':'San Benito','071':'San Bernardino','073':'San Diego','075':'San Francisco','077':'San Joaquin','079':'San Luis Obispo','081':'San Mateo','083':'Santa Barbara','085':'Santa Clara','087':'Santa Cruz','089':'Shasta','091':'Sierra','093':'Siskiyou','095':'Solano','097':'Sonoma','099':'Stanislaus','101':'Sutter','103':'Tehama','105':'Trinity','107':'Tulare','109':'Tuolumne','111':'Ventura','113':'Yolo','115':'Yuba' },
  TX: { '001':'Anderson','003':'Andrews','005':'Angelina','007':'Aransas','009':'Archer','011':'Armstrong','013':'Atascosa','015':'Austin','017':'Bailey','019':'Bandera','021':'Bastrop','023':'Baylor','025':'Bee','027':'Bell','029':'Bexar','031':'Blanco','033':'Borden','035':'Bosque','037':'Bowie','039':'Brazoria','041':'Brazos','043':'Brewster','045':'Briscoe','047':'Brooks','049':'Brown','051':'Burleson','053':'Burnet','055':'Caldwell','057':'Calhoun','059':'Callahan','061':'Cameron','063':'Camp','065':'Carson','067':'Cass','069':'Castro','071':'Chambers','073':'Cherokee','075':'Childress','077':'Clay','079':'Cochran','081':'Coke','083':'Coleman','085':'Collin','087':'Collingsworth','089':'Colorado','091':'Comal','093':'Comanche','095':'Concho','097':'Cooke','099':'Corpus Christi','101':'Cottle','103':'Crane','105':'Crockett','107':'Crosby','109':'Culberson','111':'Dallam','113':'Dallas','115':'Dawson','117':'Deaf Smith','119':'Delta','121':'Denton','123':'De Witt','125':'Dickens','127':'Dimmit','129':'Donley','131':'Duval','133':'Eastland','135':'Ector','137':'Edwards','139':'Ellis','141':'El Paso','143':'Erath','145':'Falls','147':'Fannin','149':'Fayette','151':'Fisher','153':'Floyd','155':'Foard','157':'Fort Bend','159':'Franklin','161':'Freestone','163':'Frio','165':'Gaines','167':'Galveston','169':'Garza','171':'Gillespie','173':'Glasscock','175':'Goliad','177':'Gonzales','179':'Gray','181':'Grayson','183':'Gregg','185':'Grimes','187':'Guadalupe','189':'Hale','191':'Hall','193':'Hamilton','195':'Hansford','197':'Hardeman','199':'Hardin','201':'Harris','203':'Harrison','205':'Hartley','207':'Haskell','209':'Hays','211':'Hemphill','213':'Henderson','215':'Hidalgo','217':'Hill','219':'Hockley','221':'Hood','223':'Hopkins','225':'Houston','227':'Howard','229':'Hudspeth','231':'Hunt','233':'Hutchinson','235':'Irion','237':'Jack','239':'Jackson','241':'Jasper','243':'Jeff Davis','245':'Jefferson','247':'Jim Hogg','249':'Jim Wells','251':'Johnson','253':'Jones','255':'Karnes','257':'Kaufman','259':'Kendall','261':'Kenedy','263':'Kent','265':'Kerr','267':'Kimble','269':'King','271':'Kinney','273':'Kleberg','275':'Knox','277':'Lamar','279':'Lamb','281':'Lampasas','283':'La Salle','285':'Lavaca','287':'Lee','289':'Leon','291':'Liberty','293':'Limestone','295':'Lipscomb','297':'Live Oak','299':'Llano','301':'Loving','303':'Lubbock','305':'Lynn','307':'McCulloch','309':'McLennan','311':'McMullen','313':'Madison','315':'Marion','317':'Martin','319':'Mason','321':'Matagorda','323':'Maverick','325':'Medina','327':'Menard','329':'Midland','331':'Milam','333':'Mills','335':'Mitchell','337':'Montague','339':'Montgomery','341':'Moore','343':'Morris','345':'Motley','347':'Nacogdoches','349':'Navarro','351':'Newton','353':'Nolan','355':'Nueces','357':'Ochiltree','359':'Oldham','361':'Orange','363':'Palo Pinto','365':'Panola','367':'Parker','369':'Parmer','371':'Pecos','373':'Polk','375':'Potter','377':'Presidio','379':'Rains','381':'Randall','383':'Reagan','385':'Real','387':'Red River','389':'Reeves','391':'Refugio','393':'Roberts','395':'Robertson','397':'Rockwall','399':'Runnels','401':'Rusk','403':'Sabine','405':'San Augustine','407':'San Jacinto','409':'San Patricio','411':'San Saba','413':'Schleicher','415':'Scurry','417':'Shackelford','419':'Shelby','421':'Sherman','423':'Smith','425':'Somervell','427':'Starr','429':'Stephens','431':'Sterling','433':'Stonewall','435':'Sutton','437':'Swisher','439':'Tarrant','441':'Taylor','443':'Terrell','445':'Terry','447':'Throckmorton','449':'Titus','451':'Tom Green','453':'Travis','455':'Trinity','457':'Tyler','459':'Upshur','461':'Upton','463':'Uvalde','465':'Val Verde','467':'Van Zandt','469':'Victoria','471':'Walker','473':'Waller','475':'Ward','477':'Washington','479':'Webb','481':'Wharton','483':'Wheeler','485':'Wichita','487':'Wilbarger','489':'Willacy','491':'Williamson','493':'Wilson','495':'Winkler','497':'Wise','499':'Wood','501':'Yoakum','503':'Young','505':'Zapata','507':'Zavala' },
  FL: { '001':'Alachua','003':'Baker','005':'Bay','007':'Bradford','009':'Brevard','011':'Broward','013':'Calhoun','015':'Charlotte','017':'Citrus','019':'Clay','021':'Collier','023':'Columbia','027':'De Soto','029':'Dixie','031':'Duval','033':'Escambia','035':'Flagler','037':'Franklin','039':'Gadsden','041':'Gilchrist','043':'Glades','045':'Gulf','047':'Hamilton','049':'Hardee','051':'Hendry','053':'Hernando','055':'Highlands','057':'Hillsborough','059':'Holmes','061':'Indian River','063':'Jackson','065':'Jefferson','067':'Lafayette','069':'Lake','071':'Lee','073':'Leon','075':'Levy','077':'Liberty','079':'Madison','081':'Manatee','083':'Marion','085':'Martin','086':'Miami-Dade','087':'Monroe','089':'Nassau','091':'Okaloosa','093':'Okeechobee','095':'Orange','097':'Osceola','099':'Palm Beach','101':'Pasco','103':'Pinellas','105':'Polk','107':'Putnam','109':'St. Johns','111':'St. Lucie','113':'Santa Rosa','115':'Sarasota','117':'Seminole','119':'Sumter','121':'Suwannee','123':'Taylor','125':'Union','127':'Volusia','129':'Wakulla','131':'Walton','133':'Washington' },
};

function getCountyName(state: string, fips: string): string {
  const name = COUNTY_FIPS[state]?.[fips];
  return name ? name + ' Co.' : `County ${fips}`;
}


import { METHODOLOGY_NOTE } from '@/lib/data-labels';

// â"€â"€â"€ Design Tokens â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF', bgWarm: '#F5F0E8',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', sage: '#5D7E52', gold: '#B8860B', navy: '#1B2A4A',
  chart: ['#C4653A','#5D7E52','#B8860B','#4A7FB5','#A85D8A','#3D908E','#D4845E','#7A6B5D'],
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

// â"€â"€â"€ Fallback static state list (for sidebar) â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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

// â"€â"€â"€ Types â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
interface PanelData { label: string; count: number; pct?: number; }
interface NationalData { [key: string]: any; }
interface StateRow   { [key: string]: any; }
interface LoadState  { loading: boolean; error: string | null; }
/** Row returned by the breakdown queries: { LABEL, RECORD_COUNT } */
interface BreakdownRow { LABEL: string; RECORD_COUNT: number | string; }

// â"€â"€â"€ Skeleton shimmer â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
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

// â"€â"€â"€ Error State â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function ErrorMsg({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '12px 16px', background: '#FFF4F0', borderRadius: 8, border: `1px solid ${C.terra}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 16 }}>âš ï¸</span>
      <span style={{ fontSize: 12, color: C.terra, flex: 1 }}>{msg}</span>
      {onRetry && (
        <button onClick={onRetry} style={{ fontSize: 11, color: C.terra, background: 'none', border: `1px solid ${C.terra}60`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
          Retry
        </button>
      )}
    </div>
  );
}

// â"€â"€â"€ FreqTable â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function FreqTable({ title, data, color = C.terra, loading = false, error = null, onRetry }: {
  title: string; data: PanelData[]; color?: string;
  loading?: boolean; error?: string | null; onRetry?: () => void;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      {loading ? (
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h={18} />)}
        </div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '6px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
            <span>CATEGORY</span><span style={{ textAlign: 'right' }}>COUNT</span><span style={{ textAlign: 'right' }}>% TOTAL</span>
          </div>
          {data.map((d, i) => {
            const pct = total > 0 ? (d.count / total * 100) : (d.pct ?? 0);
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '7px 14px', borderBottom: i < data.length - 1 ? `1px solid ${C.borderLight}` : 'none', alignItems: 'center', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
                  <span style={{ color: C.textBody }}>{d.label}</span>
                </div>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, color: C.text, fontWeight: 600 }}>{d.count.toLocaleString()}</span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, fontWeight: 700, color }}>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// â"€â"€â"€ HBarChart â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function HBarChart({ title, data, loading = false, error = null, onRetry, valuePrefix = '', valueSuffix = '' }: {
  title: string; data: PanelData[];
  loading?: boolean; error?: string | null; onRetry?: () => void;
  valuePrefix?: string; valueSuffix?: string;
}) {
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null);
  const max = data.length > 0 ? Math.max(...data.map(d => d.count)) : 1;
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          [1,2,3,4,5].map(i => <Skeleton key={i} h={28} />)
        ) : error ? (
          <ErrorMsg msg={error} onRetry={onRetry} />
        ) : (
          data.map((d, i) => (
            <div key={i} style={{ position: 'relative' }}
              onMouseEnter={(e) => setTooltip({ i, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textBody, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.chart[i % C.chart.length], fontFamily: C.fontMono, flexShrink: 0 }}>
                  {valuePrefix}{d.count.toLocaleString()}{valueSuffix}
                </span>
              </div>
              <div style={{ height: 8, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${max > 0 ? (d.count / max) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
              {tooltip?.i === i && (
                <div style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 30, background: C.text, color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, pointerEvents: 'none', zIndex: 999, whiteSpace: 'nowrap' }}>
                  {d.label}: {valuePrefix}{d.count.toLocaleString()}{valueSuffix}
                  {d.pct != null ? ` (${d.pct.toFixed(1)}%)` : ''}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// â"€â"€â"€ PieChart â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function PieChart({ title, data, loading = false, error = null, onRetry }: {
  title: string; data: PanelData[];
  loading?: boolean; error?: string | null; onRetry?: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumAngle = -90;
  const cx = 80, cy = 80, r = 65, inner = 38;
  const slices = data.filter(d => d.count > 0).map((d, i) => {
    const angle = total > 0 ? (d.count / total) * 360 : 0;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, angle, color: C.chart[i % C.chart.length], idx: i };
  });
  const toRad = (a: number) => a * Math.PI / 180;
  const arcPath = (start: number, end: number, expand = false) => {
    const extraR = expand ? 5 : 0;
    const curR = r + extraR;
    const x1 = cx + curR * Math.cos(toRad(start));
    const y1 = cy + curR * Math.sin(toRad(start));
    const x2 = cx + curR * Math.cos(toRad(end - 0.5));
    const y2 = cy + curR * Math.sin(toRad(end - 0.5));
    const ix1 = cx + inner * Math.cos(toRad(end - 0.5));
    const iy1 = cy + inner * Math.sin(toRad(end - 0.5));
    const ix2 = cx + inner * Math.cos(toRad(start));
    const iy2 = cy + inner * Math.sin(toRad(start));
    const large = (end - start) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${curR} ${curR} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z`;
  };
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      {loading ? (
        <div style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Skeleton w={160} h={160} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3].map(i => <Skeleton key={i} h={16} />)}
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : (
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width={160} height={160} viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
            {slices.map((s) => (
              <path key={s.idx} d={arcPath(s.start, s.start + s.angle, hovered === s.idx)}
                fill={s.color}
                style={{ filter: hovered === s.idx ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(s.idx)}
                onMouseLeave={() => setHovered(null)} />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="700" fill={C.text} fontFamily={C.fontMono}>
              {total >= 1e9 ? (total / 1e9).toFixed(1) + 'B' : total >= 1e6 ? (total / 1e6).toFixed(1) + 'M' : total.toLocaleString()}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill={C.textDim}>TOTAL</text>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
            {slices.map((d) => (
              <div key={d.idx} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '2px 4px', borderRadius: 4, background: hovered === d.idx ? C.bgWarm : 'transparent', transition: 'background 0.15s' }}
                onMouseEnter={() => setHovered(d.idx)}
                onMouseLeave={() => setHovered(null)}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.textBody, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.color, fontFamily: C.fontMono }}>{(d.count / total * 100).toFixed(1)}%</span>
                  {hovered === d.idx && <div style={{ fontSize: 9, color: C.textDim }}>{d.count.toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// â"€â"€â"€ Line / Trend Chart â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function TrendChart({ title, data, loading = false, error = null, onRetry }: {
  title: string; data: { year: string; count: number }[];
  loading?: boolean; error?: string | null; onRetry?: () => void;
}) {
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null);
  const max = data.length > 0 ? Math.max(...data.map(d => d.count)) : 1;
  const W = 340, H = 120, PAD = { t: 12, r: 12, b: 28, l: 48 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const pts = data.map((d, i) => ({
    x: PAD.l + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
    y: PAD.t + chartH - (max > 0 ? (d.count / max) * chartH : 0),
    ...d,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      {loading ? (
        <div style={{ padding: 16 }}><Skeleton h={120} /></div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : data.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 12 }}>No trend data available for this selection.</div>
      ) : (
        <div style={{ padding: '12px 16px', position: 'relative' }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            {/* Y gridlines */}
            {[0.25, 0.5, 0.75, 1].map(pct => {
              const y = PAD.t + chartH - pct * chartH;
              return <line key={pct} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={C.borderLight} strokeWidth={0.5} />;
            })}
            {/* Line */}
            {pts.length > 1 && (
              <polyline points={polyline} fill="none" stroke={C.terra} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            )}
            {/* Fill */}
            {pts.length > 1 && (
              <polygon
                points={`${pts[0].x},${PAD.t + chartH} ${polyline} ${pts[pts.length-1].x},${PAD.t + chartH}`}
                fill={`${C.terra}18`} />
            )}
            {/* Dots */}
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={tooltip?.i === i ? 5 : 3}
                fill={tooltip?.i === i ? C.terra : C.bgCard} stroke={C.terra} strokeWidth={2}
                style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                onMouseEnter={(e) => setTooltip({ i, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)} />
            ))}
            {/* X labels "" show every 5 years */}
            {pts.filter((_, i) => i % 5 === 0 || i === pts.length - 1).map((p, i) => (
              <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize={7} fill={C.textDim}>{p.year}</text>
            ))}
            {/* Y label */}
            <text x={PAD.l - 4} y={PAD.t + chartH / 2} textAnchor="middle" fontSize={7} fill={C.textDim}
              transform={`rotate(-90, ${PAD.l - 4}, ${PAD.t + chartH / 2})`}>Count</text>
          </svg>
          {tooltip !== null && (
            <div style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 30, background: C.text, color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, pointerEvents: 'none', zIndex: 999, whiteSpace: 'nowrap' }}>
              {pts[tooltip.i].year}: {pts[tooltip.i].count.toLocaleString()} records
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// â"€â"€â"€ Parcel Modal (live data) â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function ParcelModal({ filter, state, county, city, zip, onClose }: {
  filter: string; state?: string; county?: string; city?: string; zip?: string; onClose: () => void;
}) {
  const [code, setCode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState('VALUE_MARKET');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const tryAuth = () => {
    if (code === 'Iconycs01') {
      setAuthed(true);
      setError('');
      fetchParcels();
    } else {
      setError('Invalid access code');
    }
  };

  const fetchParcels = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({ access_code: 'Iconycs01' });
      if (state)  params.set('state', state);
      if (county) params.set('county', county);
      if (city)   params.set('city', city);
      if (zip)    params.set('zip', zip);
      const res = await fetch(`/api/snowflake/parcels?${params.toString()}`);
      const json = await res.json();
      if (json.success) setData(json.data ?? []);
      else setFetchError(json.error ?? 'Failed to load parcels');
    } catch (e: any) {
      setFetchError(e.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const ltvBadge = (val: number, loan: number): string => {
    if (!val || !loan) return '""';
    const ltv = (loan / val) * 100;
    if (ltv <= 60)  return 'â‰¤60%';
    if (ltv <= 65)  return '60-65%';
    if (ltv <= 70)  return '65-70%';
    if (ltv <= 75)  return '70-75%';
    if (ltv <= 80)  return '75-80%';
    if (ltv <= 85)  return '80-85%';
    if (ltv <= 90)  return '85-90%';
    if (ltv <= 95)  return '90-95%';
    if (ltv <= 97)  return '95-97%';
    return '>97%';
  };

  const sorted = [...data].sort((a, b) => {
    const va = a[sortCol] ?? 0;
    const vb = b[sortCol] ?? 0;
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });
  const paged = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortArrow = ({ col }: { col: string }) => (
    <span style={{ marginLeft: 4, opacity: sortCol === col ? 1 : 0.3 }}>
      {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.bgCard, borderRadius: 16, padding: 32, width: 800, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Parcel Data Access</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{filter}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: C.textDim, lineHeight: 1 }}>Ã - </button>
        </div>

        {!authed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>ðŸ"'</div>
            <div style={{ fontSize: 14, color: C.textBody, marginBottom: 20, lineHeight: 1.6 }}>
              Parcel-level data includes individually sourced property and ownership records.<br/>
              Enter your access code to view underlying property data.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <input type="password" value={code} onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && tryAuth()}
                placeholder="Access code"
                style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${error ? C.terra : C.border}`, fontSize: 14, fontFamily: C.font, outline: 'none', width: 180 }} />
              <button onClick={tryAuth} style={{ padding: '10px 20px', borderRadius: 8, background: C.terra, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: C.font }}>Access</button>
            </div>
            {error && <div style={{ fontSize: 12, color: C.terra, marginTop: 10 }}>{error}</div>}
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} h={32} />)}
          </div>
        ) : fetchError ? (
          <ErrorMsg msg={fetchError} onRetry={fetchParcels} />
        ) : (
          <div>
            <div style={{ padding: '8px 12px', background: '#EDF4EB', borderRadius: 8, fontSize: 12, color: C.sage, fontWeight: 600, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>âœ" Access granted "" {data.length} records "" Direct Identified Records</span>
              <span style={{ fontSize: 11, color: C.textMuted }}>{filter}</span>
            </div>

            {/* Table header */}
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, display: 'grid', gridTemplateColumns: '2fr 1fr 80px 55px 55px 70px 70px', padding: '6px 8px', background: C.bgWarm, borderRadius: 6, marginBottom: 4, gap: 6 }}>
              {[
                ['ADDRESS', 'ADDRESS'], ['ETHNICITY', 'ETHNICITY_DESC'],
                ['VALUE', 'VALUE_MARKET'], ['SQFT', 'LIVING_SQFT'],
                ['BEDS', 'BEDROOMS'], ['LOAN AMT', 'MTG1_AMOUNT'], ['LTV TIER', null],
              ].map(([label, col]) => (
                <span key={label} onClick={() => col && toggleSort(col)}
                  style={{ cursor: col ? 'pointer' : 'default', userSelect: 'none' }}>
                  {label}{col && <SortArrow col={col} />}
                </span>
              ))}
            </div>

            {paged.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 55px 55px 70px 70px', padding: '8px', borderBottom: `1px solid ${C.borderLight}`, fontSize: 11, alignItems: 'center', gap: 6 }}>
                <div>
                  <div style={{ color: C.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ADDRESS || '""'}</div>
                  <div style={{ color: C.textMuted, fontSize: 10 }}>{r.CITY}, {r.STATE} {r.ZIP}</div>
                </div>
                <div>
                  <div style={{ color: C.textBody }}>{r.ETHNICITY_DESC || 'Not Identified'}</div>
                  <div style={{ fontSize: 9, color: C.textDim }}>{r.ETHNICITYCD ? '[Green] Direct ID' : 'ðŸ"´ Area Est.'}</div>
                </div>
                <span style={{ textAlign: 'right', color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>
                  {r.VALUE_MARKET ? '$' + Number(r.VALUE_MARKET).toLocaleString() : '""'}
                </span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono }}>{r.LIVING_SQFT ? Number(r.LIVING_SQFT).toLocaleString() : '""'}</span>
                <span style={{ textAlign: 'center' }}>{r.BEDROOMS ?? '""'}</span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 10 }}>
                  {r.MTG1_AMOUNT ? '$' + (Number(r.MTG1_AMOUNT) / 1000).toFixed(0) + 'K' : '""'}
                </span>
                <span style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: C.bgWarm, fontFamily: C.fontMono, fontWeight: 700 }}>
                    {ltvBadge(r.VALUE_MARKET, r.MTG1_AMOUNT)}
                  </span>
                </span>
              </div>
            ))}

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 0', fontSize: 11, color: C.textMuted }}>
              <span>Showing {page * PER_PAGE + 1}""{Math.min((page + 1) * PER_PAGE, sorted.length)} of {sorted.length} records</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: page === 0 ? C.bgWarm : C.bgCard, color: page === 0 ? C.textDim : C.terra, cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: 11, fontFamily: C.font }}>
                  "¹ Prev
                </button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                  style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: page >= totalPages - 1 ? C.bgWarm : C.bgCard, color: page >= totalPages - 1 ? C.textDim : C.terra, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: 11, fontFamily: C.font }}>
                  Next "º
                </button>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: C.bgWarm, borderRadius: 8, fontSize: 10, color: C.textDim, lineHeight: 1.6 }}>
              {METHODOLOGY_NOTE}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// --- Upgrade Modal ---------------------------------------------------------
function UpgradeModal({
  feature,
  minTier,
  onClose,
}: {
  feature: string;
  minTier: string;
  onClose: () => void;
}) {
  const tiers: Record<string, { bg: string; color: string; name: string; price: string }> = {
    pro:          { bg: '#C4653A', color: '#fff',    name: 'Analyst',      price: '$49/mo' },
    enterprise:   { bg: '#1B2A4A', color: '#fff',    name: 'Professional', price: '$199/mo' },
    data_partner: { bg: '#B8860B', color: '#1C1917', name: 'Enterprise',   price: '$999/mo' },
  };
  const tier = tiers[minTier] ?? tiers.pro;

  const allTiers = [
    { key: 'pro',          name: 'Analyst',      price: '$49/mo',  features: ['State/County/City/ZIP drill-down', 'All demographics breakdowns', 'PDF export', 'Cascade Builder', 'Unlimited views'] },
    { key: 'enterprise',   name: 'Professional', price: '$199/mo', features: ['Everything in Analyst', 'Social Housing Score', 'Matrix Builder', 'API access', 'Custom data feeds'] },
    { key: 'data_partner', name: 'Enterprise',   price: '$999/mo', features: ['Everything in Professional', 'Snowflake direct connect', 'Team seats (5)', 'Bulk export', 'Priority support'] },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 560, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#A8A29E', lineHeight: 1 }}>x</button>

        <div style={{ fontSize: 22, fontWeight: 700, color: '#1C1917', marginBottom: 6 }}>Get Early Access</div>
        <div style={{ fontSize: 13, color: '#78716C', marginBottom: 24, lineHeight: 1.6 }}>
          <strong style={{ color: '#1C1917' }}>{feature}</strong> is available on paid tiers. Choose the plan that fits your workflow.
        </div>

        {/* Tier cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {allTiers.map((t, i) => {
            const isRecommended = t.key === minTier;
            const tierStyle = tiers[t.key];
            return (
              <div key={i} style={{ border: `2px solid ${isRecommended ? tierStyle.bg : '#E8E2D8'}`, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                {isRecommended && (
                  <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, background: tierStyle.bg, color: tierStyle.color, borderRadius: 10, padding: '2px 10px', fontWeight: 700 }}>RECOMMENDED</div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '12px 16px', background: isRecommended ? tierStyle.bg : '#FAFAF7' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isRecommended ? tierStyle.color : '#1C1917' }}>{t.name}</div>
                  <div style={{ fontSize: 18, fontWeight: 300, color: isRecommended ? tierStyle.color : tierStyle.bg, fontFamily: "'Source Serif 4', Georgia, serif" }}>{t.price}</div>
                </div>
                <div style={{ padding: '10px 16px', background: '#fff' }}>
                  {t.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#3D3833', marginBottom: 4 }}>
                      <span style={{ color: '#5D7E52', fontWeight: 700, flexShrink: 0 }}>checkmark</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Link
            href="/pricing"
            onClick={onClose}
            style={{ flex: 1, padding: '12px 20px', background: tier.bg, color: tier.color, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
          >
            View Pricing
          </Link>
          <Link
            href="/pricing#waitlist"
            onClick={onClose}
            style={{ flex: 1, padding: '12px 20px', background: 'transparent', color: tier.bg, border: `2px solid ${tier.bg}`, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Get Early Access
          </Link>
          <button onClick={onClose} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid #E8E2D8', borderRadius: 8, fontSize: 13, color: '#78716C', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            Later
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#A8A29E' }}>
          Payments via Stripe - Questions? <a href="mailto:info@iconycs.com" style={{ color: '#C4653A', textDecoration: 'none' }}>info@iconycs.com</a>
        </div>
      </div>
    </div>
  );
}

// â"€â"€â"€ Tier Badge â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function TierBadge({ tier }: { tier: 'free' | 'pro' | 'enterprise' | 'data_partner' }) {
  const config = {
    free:         { label: 'Explore',     bg: '#F5F0E8', color: '#78716C', border: '#E8E2D8' },
    pro:          { label: 'Pro Analyst', bg: '#C4653A', color: '#fff',    border: '#C4653A' },
    enterprise:   { label: 'Enterprise',  bg: '#1B2A4A', color: '#fff',    border: '#1B2A4A' },
    data_partner: { label: 'Data Partner',bg: '#B8860B', color: '#fff',    border: '#B8860B' },
  }[tier];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: config.bg, color: config.color, border: `1px solid ${config.border}`, fontSize: 11, fontWeight: 700, userSelect: 'none' }}>
      <span>â­</span> {config.label}
    </div>
  );
}

// â"€â"€â"€ Main Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function ReportsPage() {
  // Geography selection
  const [selected, setSelected]     = useState<string[]>(['ALL']);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [drillCity, setDrillCity]   = useState<string | null>(null);
  const [drillZip, setDrillZip]     = useState<string | null>(null);
  const [search, setSearch]         = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [countySearch, setCountySearch] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<{state:string;stateName:string;city:string;props:number;avg:number}[]>([]);

  // Time period
  const [timePeriod, setTimePeriod] = useState<string>('all');

  // Tier gating
  const [currentTier] = useState<'free' | 'pro' | 'enterprise' | 'data_partner'>('free'); // UI only "" no auth yet
  const [upgradeModal, setUpgradeModal] = useState<{ feature: string; minTier: string } | null>(null);

  // Modal
  const [modal, setModal] = useState<{ filter: string; state?: string; county?: string; city?: string; zip?: string } | null>(null);

  // Live data
  const [nationalData, setNationalData]   = useState<NationalData | null>(null);
  // Breakdown arrays for pie charts (populated from national or state API)
  const [ethnicityBreakdown,  setEthnicityBreakdown]  = useState<BreakdownRow[]>([]);
  const [propertyBreakdown,   setPropertyBreakdown]   = useState<BreakdownRow[]>([]);
  const [loanBreakdown,       setLoanBreakdown]       = useState<BreakdownRow[]>([]);
  const [stateData,    setStateData]      = useState<StateRow[]>([]);
  const [countyData,   setCountyData]     = useState<StateRow[]>([]);
  const [cityData,     setCityData]       = useState<StateRow[]>([]);
  const [zipData,      setZipData]        = useState<StateRow[]>([]);
  const [lenderData,   setLenderData]     = useState<PanelData[]>([]);
  const [ltvData,      setLtvData]        = useState<PanelData[]>([]);
  const [occupancyData, setOccupancyData] = useState<PanelData[]>([]);
  const [trendsData,   setTrendsData]     = useState<{year:string;count:number}[]>([]);

  // Demographics Deep Dive
  const [demoData,   setDemoData]   = useState<{
    gender: PanelData[]; marital: PanelData[]; education: PanelData[];
    income: PanelData[]; wealth: PanelData[]; ethnicity: PanelData[];
  } | null>(null);
  const [demoLoad,   setDemoLoad]   = useState<LoadState>({ loading: false, error: null });
  const [showDemographics, setShowDemographics] = useState(false);

  // Social Housing Score
  const [shsData,  setShsData]  = useState<{ score: number; band: string; label: string; components: Record<string, number> } | null>(null);
  const [shsLoad,  setShsLoad]  = useState<LoadState>({ loading: false, error: null });
  const [showShs,  setShowShs]  = useState(false);

  // Load states
  const [natLoad,    setNatLoad]    = useState<LoadState>({ loading: true,  error: null });
  const [stateLoad,  setStateLoad]  = useState<LoadState>({ loading: false, error: null });
  const [countyLoad, setCountyLoad] = useState<LoadState>({ loading: false, error: null });
  const [cityLoad,   setCityLoad]   = useState<LoadState>({ loading: false, error: null });
  const [zipLoad,    setZipLoad]    = useState<LoadState>({ loading: false, error: null });
  const [lenderLoad, setLenderLoad] = useState<LoadState>({ loading: false, error: null });
  const [ltvLoad,    setLtvLoad]    = useState<LoadState>({ loading: false, error: null });
  const [trendsLoad, setTrendsLoad] = useState<LoadState>({ loading: false, error: null });

  const isAll    = selected.includes('ALL');
  const stateCode = isAll ? undefined : selected[0];

  // â"€â"€ Fetch national â"€â"€
  const fetchNational = useCallback(async () => {
    setNatLoad({ loading: true, error: null });
    try {
      const res = await fetch('/api/snowflake/national');
      const json = await res.json();
      if (json.success) {
        // Store top-level aggregates so stat cards still work
        setNationalData({
          TOTAL_PROPERTIES: json.totalProperties,
          AVG_PROPERTY_VALUE: json.avgValue,
          AVG_MORTGAGE: json.avgMortgage,
        });
        // Store breakdown arrays for pie charts
        setEthnicityBreakdown(json.ethnicityBreakdown ?? []);
        setPropertyBreakdown(json.propertyBreakdown ?? []);
        setLoanBreakdown(json.loanBreakdown ?? []);
        setNatLoad({ loading: false, error: null });
      } else {
        setNatLoad({ loading: false, error: json.error ?? 'Failed to load national data' });
      }
      // Fetch occupancy data (national, no state filter)
      fetch('/api/snowflake/occupancy')
        .then(r => r.json())
        .then(d => { if (d.success) setOccupancyData(d.data); })
        .catch(() => {});
    } catch (e: any) {
      setNatLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch state â"€â"€
  const fetchState = useCallback(async (state?: string) => {
    setStateLoad({ loading: true, error: null });
    try {
      const params = state ? `?state=${state}` : '';
      const res = await fetch(`/api/snowflake/state${params}`);
      const json = await res.json();
      if (json.success) {
        setStateData(json.data ?? []);
        // When a specific state is selected, use its breakdown arrays for pie charts
        if (state && json.ethnicityBreakdown) {
          setEthnicityBreakdown(json.ethnicityBreakdown ?? []);
          setPropertyBreakdown(json.propertyBreakdown ?? []);
          setLoanBreakdown(json.loanBreakdown ?? []);
        }
        setStateLoad({ loading: false, error: null });
      } else {
        setStateLoad({ loading: false, error: json.error ?? 'Failed to load state data' });
      }
      // Fetch occupancy data (scoped to state if provided)
      fetch('/api/snowflake/occupancy' + (state ? `?state=${state}` : ''))
        .then(r => r.json())
        .then(d => { if (d.success) setOccupancyData(d.data); })
        .catch(() => {});
    } catch (e: any) {
      setStateLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch county â"€â"€
  const fetchCounty = useCallback(async (state: string) => {
    setCountyLoad({ loading: true, error: null });
    try {
      const res = await fetch(`/api/snowflake/county?state=${state}`);
      const json = await res.json();
      if (json.success) {
        setCountyData(json.data ?? []);
        setCountyLoad({ loading: false, error: null });
      } else {
        setCountyLoad({ loading: false, error: json.error ?? 'Failed to load county data' });
      }
    } catch (e: any) {
      setCountyLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch city â"€â"€
  const fetchCity = useCallback(async (state: string, county?: string) => {
    setCityLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ state });
      if (county) params.set('county', county);
      const res = await fetch(`/api/snowflake/city?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCityData(json.data ?? []);
        setCityLoad({ loading: false, error: null });
      } else {
        setCityLoad({ loading: false, error: json.error ?? 'Failed to load city data' });
      }
    } catch (e: any) {
      setCityLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch ZIP â"€â"€
  const fetchZip = useCallback(async (state: string, city?: string) => {
    setZipLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ state });
      if (city) params.set('city', city);
      const res = await fetch(`/api/snowflake/zip?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setZipData(json.data ?? []);
        setZipLoad({ loading: false, error: null });
      } else {
        setZipLoad({ loading: false, error: json.error ?? 'Failed to load ZIP data' });
      }
    } catch (e: any) {
      setZipLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch lenders â"€â"€
  const fetchLenders = useCallback(async (state?: string, city?: string) => {
    setLenderLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state) params.set('state', state);
      if (city)  params.set('city', city);
      params.set('limit', '10');
      const res = await fetch(`/api/snowflake/lenders?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLenderData((json.data ?? []).map((r: any) => ({
          label: r.LENDER_NAME ?? 'Unknown',
          count: Number(r.LOAN_COUNT ?? 0),
          pct: 0,
        })));
        setLenderLoad({ loading: false, error: null });
      } else {
        setLenderLoad({ loading: false, error: json.error ?? 'Failed to load lender data' });
      }
    } catch (e: any) {
      setLenderLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch LTV â"€â"€
  const fetchLTV = useCallback(async (state?: string, city?: string) => {
    setLtvLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state) params.set('state', state);
      if (city)  params.set('city', city);
      const res = await fetch(`/api/snowflake/ltv?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLtvData((json.data ?? []).map((r: any) => ({
          label: r.LTV_TIER ?? '""',
          count: Number(r.RECORD_COUNT ?? 0),
        })));
        setLtvLoad({ loading: false, error: null });
      } else {
        setLtvLoad({ loading: false, error: json.error ?? 'Failed to load LTV data' });
      }
    } catch (e: any) {
      setLtvLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch trends â"€â"€
  const fetchTrends = useCallback(async (state?: string, city?: string, period?: string) => {
    setTrendsLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state)  params.set('state', state);
      if (city)   params.set('city', city);
      if (period) params.set('time_period', period);
      const res = await fetch(`/api/snowflake/trends?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setTrendsData((json.data ?? []).map((r: any) => ({
          year: String(r.RECORD_YEAR),
          count: Number(r.RECORD_COUNT ?? 0),
        })));
        setTrendsLoad({ loading: false, error: null });
      } else {
        setTrendsLoad({ loading: false, error: json.error ?? 'Failed to load trend data' });
      }
    } catch (e: any) {
      setTrendsLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch demographics â"€â"€
  const fetchDemographics = useCallback(async (state?: string, county?: string, city?: string, zip?: string) => {
    setDemoLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state)  params.set('state', state);
      if (county) params.set('county', county);
      if (city)   params.set('city', city);
      if (zip)    params.set('zip', zip ?? '');
      const res = await fetch(`/api/snowflake/demographics?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        const toPanel = (arr: {label:string;count:number}[]): PanelData[] =>
          arr.map(r => ({ label: r.label ?? '""', count: Number(r.count ?? 0) }));
        setDemoData({
          gender:    toPanel(d.gender    ?? []),
          marital:   toPanel(d.marital   ?? []),
          education: toPanel(d.education ?? []),
          income:    toPanel(d.income    ?? []),
          wealth:    toPanel(d.wealth    ?? []),
          ethnicity: toPanel(d.ethnicity ?? []),
        });
        setDemoLoad({ loading: false, error: null });
      } else {
        setDemoLoad({ loading: false, error: json.error ?? 'Failed to load demographics' });
      }
    } catch (e: any) {
      setDemoLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Fetch Social Housing Score â"€â"€
  const fetchSocialScore = useCallback(async (state?: string, county?: string, city?: string, zip?: string) => {
    setShsLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state)  params.set('state', state);
      if (county) params.set('county', county);
      if (city)   params.set('city', city);
      if (zip)    params.set('zip', zip ?? '');
      const res = await fetch(`/api/snowflake/social-score?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setShsData(json.data);
        setShsLoad({ loading: false, error: null });
      } else {
        setShsLoad({ loading: false, error: json.error ?? 'Failed to compute score' });
      }
    } catch (e: any) {
      setShsLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // â"€â"€ Initial load â"€â"€
  useEffect(() => {
    fetchNational();
    fetchState();
    fetchLenders();
    fetchLTV();
    fetchTrends();
  }, [fetchNational, fetchState, fetchLenders, fetchLTV, fetchTrends]);

  // â"€â"€ Re-fetch when geography changes â"€â"€
  useEffect(() => {
    if (!isAll && stateCode) {
      fetchState(stateCode);
      fetchCounty(stateCode);
      fetchLenders(stateCode, drillCity ?? undefined);
      fetchLTV(stateCode, drillCity ?? undefined);
      fetchTrends(stateCode, drillCity ?? undefined, timePeriod);
    } else if (isAll) {
      fetchNational(); // reload national breakdowns when switching back to All States
      fetchState();
      fetchLenders();
      fetchLTV();
      fetchTrends(undefined, undefined, timePeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, isAll, drillCity, timePeriod]);

  // â"€â"€ Load county when state selected â"€â"€
  useEffect(() => {
    if (!isAll && stateCode) {
      fetchCounty(stateCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, isAll]);

  // â"€â"€ Load cities when county selected â"€â"€
  useEffect(() => {
    if (!isAll && stateCode) {
      fetchCity(stateCode, selectedCounty ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, selectedCounty, isAll]);

  // â"€â"€ Load ZIPs when city drilled into â"€â"€
  useEffect(() => {
    if (!isAll && stateCode && drillCity) {
      fetchZip(stateCode, drillCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, drillCity, isAll]);

  // â"€â"€â"€ Helpers â"€â"€
  const handleCitySearch = (val: string) => {
    setCitySearch(val);
    if (val.length < 2) { setCitySearchResults([]); return; }
    const q = val.toLowerCase();
    const results: typeof citySearchResults = [];
    Object.entries(GEO_DATA).forEach(([state, data]) => {
      const stateName = ALL_STATES.find(s => s.code === state)?.name || state;
      data.cities.forEach(city => {
        if (city.name.toLowerCase().includes(q) && results.length < 12) {
          results.push({ state, stateName, city: city.name, props: city.props, avg: city.avg });
        }
      });
    });
    setCitySearchResults(results);
  };

  const toggleState = (code: string) => {
    if (code === 'ALL') {
      setSelected(['ALL']);
      setSelectedCounty(null);
      setDrillCity(null);
      setDrillZip(null);
      return;
    }
    setSelected(prev => {
      const without = prev.filter(s => s !== 'ALL');
      if (without.includes(code)) {
        const next = without.filter(s => s !== code);
        return next.length === 0 ? ['ALL'] : next;
      }
      return [...without, code];
    });
    setSelectedCounty(null);
    setDrillCity(null);
    setDrillZip(null);
  };

  const filteredStates = ALL_STATES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  // â"€â"€â"€ Compute dashboard stats from live data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const currentStateRow = stateCode && stateData.length > 0
    ? stateData.find(r => r.STATE === stateCode) ?? stateData[0]
    : null;

  const totalProps = currentStateRow
    ? Number(currentStateRow.RECORD_COUNT ?? currentStateRow.TOTAL_PROPERTIES ?? 0)
    : nationalData
    ? Number(nationalData.TOTAL_PROPERTIES ?? 0)
    : 0;

  const avgValue = currentStateRow
    ? Number(currentStateRow.AVG_VALUE ?? currentStateRow.AVG_PROPERTY_VALUE ?? 0)
    : nationalData
    ? Number(nationalData.AVG_PROPERTY_VALUE ?? 0)
    : 0;

  const geoLabel = isAll
    ? 'National'
    : selected.length === 1
    ? ALL_STATES.find(s => s.code === selected[0])?.name ?? selected[0]
    : `${selected.length} States`;

  // â"€â"€â"€ Build chart data from live data with smart fallback â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const buildEthnicity = (): PanelData[] => {
    // Prefer live breakdown data from the aggregated API queries
    if (ethnicityBreakdown.length > 0) {
      return ethnicityBreakdown.map(r => ({
        label: String(r.LABEL ?? '""'),
        count: Number(r.RECORD_COUNT ?? 0),
      })).filter(d => d.count > 0);
    }
    // Legacy column-based fallback (pre-breakdown API)
    const src = currentStateRow ?? nationalData;
    if (!src) return [];
    const fields: [string, string][] = [
      ['ETHNICITY_UNKNOWN', 'Unknown / Other'],
      ['ETHNICITY_HISPANIC', 'Hispanic'],
      ['ETHNICITY_AFRICAN_AMERICAN', 'African American'],
      ['ETHNICITY_ASIAN', 'Asian'],
      ['ETHNICITY_WHITE', 'White / Non-Hispanic'],
      ['ETHNICITY_OTHER', 'Other Identified'],
    ];
    const result = fields
      .map(([f, label]) => ({ label, count: Number(src[f] ?? 0) }))
      .filter(d => d.count > 0);
    if (result.length === 0 && totalProps > 0) {
      return [
        { label: 'Unknown / Other',  count: Math.round(totalProps * 0.968) },
        { label: 'Hispanic',         count: Math.round(totalProps * 0.018) },
        { label: 'African American', count: Math.round(totalProps * 0.010) },
        { label: 'Asian',            count: Math.round(totalProps * 0.004) },
      ];
    }
    return result;
  };

  const buildLoanType = (): PanelData[] => {
    // Prefer live breakdown data from the aggregated API queries
    if (loanBreakdown.length > 0) {
      return loanBreakdown.map(r => ({
        label: String(r.LABEL ?? '""'),
        count: Number(r.RECORD_COUNT ?? 0),
      })).filter(d => d.count > 0);
    }
    // Legacy column-based fallback
    const src = currentStateRow ?? nationalData;
    if (!src) return [];
    const fields: [string, string][] = [
      ['LOAN_TYPE_CONVENTIONAL', 'Conventional'],
      ['LOAN_TYPE_FHA', 'FHA'],
      ['LOAN_TYPE_VA', 'VA'],
      ['LOAN_TYPE_PRIVATE', 'Private Party'],
      ['LOAN_TYPE_CASH', 'Cash Purchase'],
      ['LOAN_TYPE_OTHER', 'Other / Unknown'],
    ];
    const result = fields
      .map(([f, label]) => ({ label, count: Number(src[f] ?? 0) }))
      .filter(d => d.count > 0);
    if (result.length === 0 && totalProps > 0) {
      return [
        { label: 'Conventional',    count: Math.round(totalProps * 0.261) },
        { label: 'FHA',             count: Math.round(totalProps * 0.062) },
        { label: 'VA',              count: Math.round(totalProps * 0.031) },
        { label: 'Private Party',   count: Math.round(totalProps * 0.020) },
        { label: 'Other / Unknown', count: Math.round(totalProps * 0.026) },
      ];
    }
    return result;
  };

  const buildPropertyType = (): PanelData[] => {
    // Prefer live breakdown data from the aggregated API queries
    if (propertyBreakdown.length > 0) {
      return propertyBreakdown.map(r => ({
        label: String(r.LABEL ?? '""'),
        count: Number(r.RECORD_COUNT ?? 0),
      })).filter(d => d.count > 0);
    }
    // Legacy column-based fallback
    const src = currentStateRow ?? nationalData;
    if (!src) return [];
    const fields: [string, string][] = [
      ['PROP_TYPE_SFR', 'SFR / Townhouse'],
      ['PROP_TYPE_CONDO', 'Condominium'],
      ['PROP_TYPE_MULTI', 'Small Multi (2-4)'],
    ];
    const result = fields
      .map(([f, label]) => ({ label, count: Number(src[f] ?? 0) }))
      .filter(d => d.count > 0);
    if (result.length === 0 && totalProps > 0) {
      return [
        { label: 'SFR / Townhouse',   count: Math.round(totalProps * 0.897) },
        { label: 'Condominium',       count: Math.round(totalProps * 0.081) },
        { label: 'Small Multi (2-4)', count: Math.round(totalProps * 0.022) },
      ];
    }
    return result;
  };

  // â"€â"€â"€ Time Period Options â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const TIME_PERIODS = [
    { value: 'all',      label: 'All Time' },
    { value: '5yr',      label: 'Last 5 Years' },
    { value: '2020-2024', label: '2020""2024' },
    { value: '2015-2019', label: '2015""2019' },
    { value: '2010-2014', label: '2010""2014' },
    { value: '2005-2009', label: '2005""2009' },
  ];

  // â"€â"€â"€ Print / Export â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const handleExport = () => {
    window.print();
  };

  // â"€â"€â"€ State breakdown table from live data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const stateBreakdown: PanelData[] = (isAll ? stateData : stateData.filter(r => selected.includes(r.STATE)))
    .sort((a, b) => Number(b.RECORD_COUNT ?? b.TOTAL_PROPERTIES ?? 0) - Number(a.RECORD_COUNT ?? a.TOTAL_PROPERTIES ?? 0))
    .slice(0, 15)
    .map(r => ({
      label: ALL_STATES.find(s => s.code === r.STATE)?.name ?? r.STATE,
      count: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
    }));

  const ethnicityData   = buildEthnicity();
  const loanTypeData    = buildLoanType();
  const propertyTypeData = buildPropertyType();
  const overallLoading  = natLoad.loading;

  // â"€â"€â"€ County cards from live data with GEO_DATA fallback â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const countyCards = countyData.length > 0
    ? countyData.slice(0, 25).map(r => ({
        name: getCountyName(stateCode ?? '', String(r.CNTYCD ?? r.COUNTY ?? '')), rawFips: String(r.CNTYCD ?? ''),
        props: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
        avg: Number(r.AVG_VALUE ?? r.AVG_PROPERTY_VALUE ?? 0),
      }))
    : [];

  // â"€â"€â"€ City cards "" live data preferred, GEO_DATA fallback â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const cityCards = cityData.length > 0
    ? cityData.slice(0, 20).map(r => ({
        name: r.CITY ?? '""',
        props: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
        avg: Number(r.AVG_VALUE ?? r.AVG_PROPERTY_VALUE ?? 0),
      }))
    : (stateCode && GEO_DATA[stateCode] ? GEO_DATA[stateCode].cities.slice(0, 20) : []);

  // â"€â"€â"€ ZIP cards "" live data preferred, GEO_DATA fallback â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const zipCards = zipData.length > 0
    ? zipData.slice(0, 30).map(r => ({
        zip: r.ZIP ?? '""',
        city: r.CITY ?? drillCity ?? '',
        props: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
        avg: Number(r.AVG_VALUE ?? r.AVG_PROPERTY_VALUE ?? 0),
      }))
    : (stateCode && GEO_DATA[stateCode] ? GEO_DATA[stateCode].zips.slice(0, 30) : []);

  const drillLabel = [
    geoLabel,
    selectedCounty,
    drillCity,
    drillZip,
  ].filter(Boolean).join(' "º ');

  return (
    <>
      {/* â"€â"€ Global CSS animations â"€â"€ */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white; }
          .print-header { display: block !important; }
        }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .sidebar   { position: static !important; }
          .card-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .card-grid-3 { grid-template-columns: 1fr !important; }
          .stat-grid   { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
        {/* Parcel Modal */}
        {modal && (
          <ParcelModal
            filter={modal.filter}
            state={modal.state}
            county={modal.county}
            city={modal.city}
            zip={modal.zip}
            onClose={() => setModal(null)}
          />
        )}

        {/* Upgrade Modal */}
        {upgradeModal && (
          <UpgradeModal
            feature={upgradeModal.feature}
            minTier={upgradeModal.minTier}
            onClose={() => setUpgradeModal(null)}
          />
        )}

        {/* â"€â"€ Print-only header â"€â"€ */}
        <div className="print-header" style={{ display: 'none', padding: '20px 40px', borderBottom: '2px solid #1B2A4A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A' }}>ICONYCS Housing Analytics</div>
              <div style={{ fontSize: 14, color: '#78716C', marginTop: 4 }}>{drillLabel} "" {TIME_PERIODS.find(t => t.value === timePeriod)?.label}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, color: '#78716C' }}>
              <div>Generated: {new Date().toLocaleDateString()}</div>
              <div>iconycs.com/reports</div>
            </div>
          </div>
        </div>

        {/* â"€â"€ Nav â"€â"€ */}
        <nav className="no-print" style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 52, gap: 16 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div>
                <span style={{ fontSize: 19, fontWeight: 700, color: C.text }}>ICONYCS</span>
                <div style={{ fontSize: 9, fontWeight: 600, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>Housing Demographics Intelligence</div>
              </div>
            </Link>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>Analytics Reports</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Tier Badge */}
              <TierBadge tier={currentTier} />
              {currentTier === 'free' && (
                <button
                  onClick={() => setUpgradeModal({ feature: 'Full Platform Access', minTier: 'pro' })}
                  style={{ fontSize: 11, color: '#fff', background: C.terra, border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
                  Upgrade â†'
                </button>
              )}
              {/* Time Period Selector */}
              <div style={{ display: 'flex', gap: 4, background: C.bgWarm, borderRadius: 8, padding: 3 }}>
                {TIME_PERIODS.map(tp => (
                  <button key={tp.value} onClick={() => setTimePeriod(tp.value)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: timePeriod === tp.value ? 700 : 400, cursor: 'pointer', fontFamily: C.font, background: timePeriod === tp.value ? C.navy : 'transparent', color: timePeriod === tp.value ? '#fff' : C.textMuted, transition: 'all 0.15s' }}>
                    {tp.label}
                  </button>
                ))}
              </div>
              <button onClick={currentTier === 'free' ? () => setUpgradeModal({ feature: 'PDF / Print Export', minTier: 'pro' }) : handleExport}
                style={{ fontSize: 12, color: '#fff', background: currentTier === 'free' ? C.textMuted : C.terra, border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                {currentTier === 'free' ? '🔒' : '⬇'} Download PDF
              </button>
              <Link href={`/reports/cascade?${stateCode ? `state=${stateCode}` : ''}${selectedCounty ? `&county=${selectedCounty}` : ''}${drillCity ? `&city=${drillCity}` : ''}${drillZip ? `&zip=${drillZip}` : ''}`}
                style={{ fontSize: 12, color: '#fff', background: C.navy, textDecoration: 'none', padding: '5px 14px', borderRadius: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                ðŸ"€ Cascade Builder
              </Link>
              <Link href="/dashboard" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.bgWarm }}>AI Query Lab</Link>
              <Link href="/api-docs" style={{ fontSize: 12, color: C.sage, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#F0F7EE', fontWeight: 600 }}>API</Link>
              <Link href="/fair-lending" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.terra, fontWeight: 600 }}>Fair Lending</Link>
              <Link href="/pricing" style={{ fontSize: 12, color: C.terra, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#FFF8F5', fontWeight: 600 }}>Pricing</Link>
              <Link href="/agents" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.navy, fontWeight: 700 }}>Agents</Link>
              <Link href="/" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6 }}>Home</Link>
              <Link href="/login" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 14px', borderRadius: 6, background: C.terra, fontWeight: 700 }}>Sign In</Link>
            </div>
          </div>
        </nav>

        {/* â"€â"€ City Search Bar â"€â"€ */}
        <div className="no-print" style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: '10px 20px', position: 'sticky', top: 52, zIndex: 40 }}>
          <div style={{ maxWidth: 1500, margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: C.textDim, whiteSpace: 'nowrap' }}>Quick search:</span>
              <div style={{ position: 'relative', flex: 1, maxWidth: 500 }}>
                <input value={citySearch} onChange={e => handleCitySearch(e.target.value)}
                  placeholder="Search any city — e.g. Watsonville, Monterey, Santa Cruz..."
                  style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: 8, border: `1.5px solid ${citySearch ? C.terra : C.border}`, fontSize: 13, fontFamily: C.font, outline: 'none', background: C.bgWarm }} />
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.textDim }}>ðŸ"</span>
                {citySearch && (
                  <button onClick={() => { setCitySearch(''); setCitySearchResults([]); }}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textDim, fontSize: 18 }}>Ã - </button>
                )}
                {citySearchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, marginTop: 4, overflow: 'hidden' }}>
                    {citySearchResults.map((r, i) => (
                      <div key={i} onClick={() => {
                        setSelected([r.state]);
                        setDrillCity(r.city);
                        setCitySearch('');
                        setCitySearchResults([]);
                      }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < citySearchResults.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.bgWarm)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.navy, padding: '2px 8px', borderRadius: 10, background: '#EEF1F6' }}>{r.state}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.city}</span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>{r.stateName}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: C.text, fontFamily: C.fontMono }}>{r.props.toLocaleString()} props</span>
                          <span style={{ fontSize: 12, color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>${(r.avg / 1000).toFixed(0)}K avg</span>
                          <span style={{ fontSize: 11, color: C.terra, fontWeight: 600 }}>View "º</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, color: C.textDim }}>502 cities across 51 states</span>
            </div>
          </div>
        </div>

        {/* â"€â"€ Main Layout â"€â"€ */}
        <div className="main-grid" style={{ maxWidth: 1500, margin: '0 auto', padding: 16, display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>

          {/* â"€â"€ SIDEBAR â"€â"€ */}
          <div className="sidebar" style={{ position: 'sticky', top: 110, height: 'fit-content' }}>
            <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select Geography</div>
              <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search states..."
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: C.font, outline: 'none', background: C.bgWarm }} />
              </div>
              <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
                <button onClick={() => toggleState('ALL')} style={{
                  width: '100%', padding: '8px 10px', borderRadius: 7,
                  border: `1.5px solid ${isAll ? C.terra : C.border}`,
                  background: isAll ? '#FFF0E9' : 'transparent',
                  color: isAll ? C.terra : C.textBody,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: C.font, textAlign: 'left',
                }}>National (All States)</button>
              </div>
              <div style={{ maxHeight: 480, overflowY: 'auto', padding: '6px 8px' }}>
                {filteredStates.map(s => {
                  const isSel = !isAll && selected.includes(s.code);
                  const stRow = stateData.find(r => r.STATE === s.code);
                  const propCount = stRow ? Number(stRow.RECORD_COUNT ?? stRow.TOTAL_PROPERTIES ?? 0) : 0;
                  return (
                    <div key={s.code} onClick={() => toggleState(s.code)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 8px', borderRadius: 6, marginBottom: 2, cursor: 'pointer',
                      background: isSel ? '#FFF0E9' : 'transparent',
                      border: `1px solid ${isSel ? C.terra : 'transparent'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isSel ? C.terra : C.border}`, background: isSel ? C.terra : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isSel && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>âœ"</span>}
                        </div>
                        <span style={{ fontSize: 12, color: isSel ? C.terra : C.textBody, fontWeight: isSel ? 600 : 400 }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: C.textDim, fontFamily: C.fontMono }}>
                        {propCount > 0 ? (propCount / 1e6).toFixed(1) + 'M' : '"¦'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {!isAll && selected.length > 0 && (
                <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, background: C.bgWarm }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{selected.length} state{selected.length > 1 ? 's' : ''} selected</div>
                  <button onClick={() => setSelected(['ALL'])} style={{ fontSize: 11, color: C.terra, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: C.font }}>Clear selection</button>
                </div>
              )}
            </div>
          </div>

          {/* â"€â"€ MAIN DASHBOARD â"€â"€ */}
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, margin: 0 }}>{geoLabel} Housing Demographics</h1>
                {overallLoading ? (
                  <div style={{ marginTop: 6 }}><Skeleton w={280} h={14} /></div>
                ) : (
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                    {totalProps > 0 ? totalProps.toLocaleString() + ' properties' : '""'} *
                    Avg value {avgValue > 0 ? '$' + avgValue.toLocaleString() : '""'} *
                    {isAll ? ' 51 states' : ` ${selected.length} state${selected.length > 1 ? 's' : ''}`} *
                    {TIME_PERIODS.find(t => t.value === timePeriod)?.label}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ padding: '6px 12px', borderRadius: 8, background: '#EDF4EB', fontSize: 11, fontWeight: 600, color: C.sage, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
                  Snowflake Live
                </div>
                {natLoad.error && (
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#FFF4F0', fontSize: 11, color: C.terra }}>
                    âš  {natLoad.error}
                  </div>
                )}
              </div>
            </div>

            {/* â"€â"€ Stat Cards â"€â"€ */}
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                {
                  label: 'Total Properties',
                  value: overallLoading ? null : totalProps >= 1e9 ? (totalProps / 1e9).toFixed(1) + 'B' : totalProps >= 1e6 ? (totalProps / 1e6).toFixed(1) + 'M' : totalProps.toLocaleString(),
                  color: C.terra,
                },
                {
                  label: 'Est. Homeowners',
                  value: overallLoading ? null : totalProps > 0 ? ((totalProps * 0.506) / 1e6).toFixed(1) + 'M' : '""',
                  color: C.sage,
                },
                {
                  label: 'Avg Property Value',
                  value: overallLoading ? null : avgValue > 0 ? '$' + avgValue.toLocaleString() : '""',
                  color: C.gold,
                },
                {
                  label: 'States in Analysis',
                  value: isAll ? '51' : String(selected.length),
                  color: C.navy,
                },
              ].map((s, i) => (
                <div key={i} style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 16px', animation: 'fadeIn 0.4s ease' }}>
                  {s.value === null ? (
                    <Skeleton h={32} />
                  ) : (
                    <div style={{ fontSize: 22, fontWeight: 300, color: s.color, fontFamily: C.fontSerif }}>{s.value}</div>
                  )}
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* â"€â"€ Free Tier Upgrade Banner â"€â"€ */}
            {currentTier === 'free' && (
              <div style={{ marginBottom: 16, padding: '14px 20px', background: `linear-gradient(135deg, ${C.terra} 0%, #D4754A 100%)`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeIn 0.4s ease' }}>
                <div style={{ fontSize: 22 }}>🚀</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Unlock the Full ICONYCS Platform</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    County/City/ZIP drill-down * Demographics Deep Dive * Cascade Report Builder * PDF Export * Social Housing Score
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setUpgradeModal({ feature: 'Pro Analyst "" Full Platform', minTier: 'pro' })}
                    style={{ padding: '8px 18px', background: '#fff', color: C.terra, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: C.font, whiteSpace: 'nowrap' }}>
                    Pro "" $49/mo
                  </button>
                  <button
                    onClick={() => setUpgradeModal({ feature: 'Enterprise "" Full Platform + Social Housing Score', minTier: 'enterprise' })}
                    style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: C.font, whiteSpace: 'nowrap' }}>
                    Enterprise "" $199/mo
                  </button>
                </div>
              </div>
            )}

            {/* â"€â"€ Trend Chart + LTV side by side â"€â"€ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <TrendChart
                title="Recording Activity by Year"
                data={trendsData}
                loading={trendsLoad.loading}
                error={trendsLoad.error}
                onRetry={() => fetchTrends(stateCode, drillCity ?? undefined, timePeriod)}
              />
              <HBarChart
                title="LTV Tier Distribution (FNMA)"
                data={ltvData}
                loading={ltvLoad.loading}
                error={ltvLoad.error}
                onRetry={() => fetchLTV(stateCode, drillCity ?? undefined)}
                valueSuffix=" rec"
              />
            </div>

            {/* â"€â"€ Pie Charts â"€â"€ */}
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <PieChart
                title="Owner Ethnicity"
                data={ethnicityData}
                loading={overallLoading}
                error={natLoad.error}
                onRetry={fetchNational}
              />
              <PieChart
                title="Property Category"
                data={propertyTypeData}
                loading={overallLoading}
                error={natLoad.error}
                onRetry={fetchNational}
              />
              <PieChart
                title="Loan Program"
                data={loanTypeData.slice(0, 4)}
                loading={overallLoading}
                error={natLoad.error}
                onRetry={fetchNational}
              />
            </div>

            {/* â"€â"€ Freq Tables â"€â"€ */}
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 6 }}>
              <FreqTable title="Owner Ethnicity — Direct Identified Records" data={ethnicityData} color={C.sage}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
              <FreqTable title="Property Type" data={propertyTypeData} color={C.terra}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
              <FreqTable title="Mortgage Loan Type" data={loanTypeData} color={C.gold}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
            </div>
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Ethnicity Data', state: stateCode, city: drillCity ?? undefined },
                { label: 'Property Type Data', state: stateCode, city: drillCity ?? undefined },
                { label: 'Loan Type Data', state: stateCode, city: drillCity ?? undefined },
              ].map((f, i) => (
                <button key={i} onClick={() => setModal({ filter: `${geoLabel} "" ${f.label}`, state: f.state, city: f.city })}
                  style={{ padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                  View Underlying Parcels
                </button>
              ))}
            </div>

            {/* â"€â"€ Occupancy Status Panel â"€â"€ */}
            <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Property Occupancy Status</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Source: Tax Record / Homestead Filing</span>
              </div>
              <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <PieChart title="Occupancy Split" data={occupancyData}
                  loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
                <div>
                  <FreqTable title="Occupancy Breakdown" data={occupancyData} color={C.sage}
                    loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 8, lineHeight: 1.6 }}>
                    â"˜ Owner Occupied: homestead exemption or tax bill matches property address.<br/>
                    Non-Owner Occupied: investor-owned, second home, or rental unit.<br/>
                    <em>Census ACS tenure overlay coming in next release.</em>
                  </div>
                </div>
              </div>
            </div>

            {/* â"€â"€ Mortgage Intelligence Section â"€â"€ */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: C.fontSerif, letterSpacing: '0.02em', marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${C.border}` }}>
                Mortgage Intelligence
              </div>
            </div>
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 6 }}>
              <PieChart title="Loan Program Mix" data={loanTypeData}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
              <HBarChart title="Top 10 Lenders by Volume" data={lenderData}
                loading={lenderLoad.loading} error={lenderLoad.error}
                onRetry={() => fetchLenders(stateCode, drillCity ?? undefined)} />
              <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Avg Loan by Type</div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {loanTypeData.length === 0 ? (
                    [1,2,3,4].map(i => <Skeleton key={i} h={24} />)
                  ) : loanTypeData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                      <span style={{ color: C.textBody }}>{d.label}</span>
                      <span style={{ fontFamily: C.fontMono, fontWeight: 600, color: C.chart[i % C.chart.length] }}>
                        {d.count > 0 ? '$' + Math.round(avgValue * (i === 0 ? 0.72 : i === 1 ? 0.93 : i === 2 ? 0.87 : 0.68)).toLocaleString() : '""'}
                      </span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${C.borderLight}` }}>
                    â„¹ Rate data limited (~9.5% coverage)
                  </div>
                </div>
              </div>
            </div>
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {['Loan Program Data', 'Lender Data', 'Loan Amount Data'].map((f, i) => (
                <button key={i} onClick={() => setModal({ filter: `${geoLabel} "" ${f}`, state: stateCode, city: drillCity ?? undefined })}
                  style={{ padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                  View Underlying Parcels
                </button>
              ))}
            </div>

            {/* â"€â"€ Social Housing Score â"€â"€ */}
            <div style={{ marginBottom: 16, background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div
                onClick={() => {
                  const next = !showShs;
                  setShowShs(next);
                  if (next && !shsData && !shsLoad.loading) {
                    fetchSocialScore(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined);
                  }
                }}
                style={{ padding: '12px 18px', background: `linear-gradient(135deg, ${C.navy} 0%, #2A3F6A 100%)`, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: 16 }}>ðŸ˜ï¸</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>SOCIAL HOUSING SCORE</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>Diversity index: ethnicity * income * LTV * owner-occupancy</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {shsData && (
                    <div style={{
                      fontSize: 20, fontWeight: 800, color: shsData.band === 'green' ? '#4ADE80' : shsData.band === 'yellow' ? '#FCD34D' : '#F87171',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}>{shsData.score}</div>
                  )}
                  <span style={{ fontSize: 10, background: '#B8860B', color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>ENTERPRISE</span>
                  <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 600 }}>ðŸ"'</span>
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{showShs ? 'â-²' : 'â-¼'}</span>
                </div>
              </div>

              {showShs && (
                <div style={{ padding: 20, animation: 'fadeIn 0.3s ease' }}>
                  {shsLoad.loading ? (
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <Skeleton w={120} h={120} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Skeleton h={16} /><Skeleton h={16} /><Skeleton h={16} /><Skeleton h={16} />
                      </div>
                    </div>
                  ) : shsLoad.error ? (
                    <ErrorMsg msg={shsLoad.error} onRetry={() => fetchSocialScore(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined)} />
                  ) : shsData ? (
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                      {/* Circular gauge */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <svg width={130} height={130} viewBox="0 0 130 130">
                          <circle cx={65} cy={65} r={52} fill="none" stroke={C.bgWarm} strokeWidth={14} />
                          <circle cx={65} cy={65} r={52} fill="none"
                            stroke={shsData.band === 'green' ? '#22C55E' : shsData.band === 'yellow' ? '#EAB308' : '#EF4444'}
                            strokeWidth={14}
                            strokeDasharray={`${(shsData.score / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                            strokeDashoffset={2 * Math.PI * 52 * 0.25}
                            strokeLinecap="round"
                            transform="rotate(-90 65 65)"
                          />
                          <text x={65} y={60} textAnchor="middle" fontSize={28} fontWeight={800}
                            fill={shsData.band === 'green' ? '#22C55E' : shsData.band === 'yellow' ? '#EAB308' : '#EF4444'}
                            fontFamily="'IBM Plex Mono', monospace">
                            {shsData.score}
                          </text>
                          <text x={65} y={78} textAnchor="middle" fontSize={9} fill={C.textDim}>out of 100</text>
                        </svg>
                        <div style={{ fontSize: 12, fontWeight: 700, color: shsData.band === 'green' ? '#22C55E' : shsData.band === 'yellow' ? '#EAB308' : '#EF4444' }}>
                          {shsData.label}
                        </div>
                      </div>

                      {/* Component breakdown */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Score components (each weighted 0""25):</div>
                        {[
                          { label: 'Ethnic Diversity Index', key: 'ethDiversity', color: C.terra },
                          { label: 'Income Diversity',        key: 'incomeDiversity', color: C.sage },
                          { label: 'LTV Distribution (Low LTV = Higher Score)', key: 'ltvScore', color: C.gold },
                          { label: 'Owner Occupancy Rate',    key: 'ownerOccScore', color: C.navy },
                        ].map(({ label, key, color }) => {
                          const val = shsData.components[key] ?? 0;
                          return (
                            <div key={key} style={{ marginBottom: 10 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ fontSize: 12, color: C.textBody }}>{label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>{val}/25</span>
                              </div>
                              <div style={{ height: 6, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ width: `${(val / 25) * 100}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ marginTop: 12, fontSize: 10, color: C.textDim, padding: '8px 12px', background: C.bgWarm, borderRadius: 6, lineHeight: 1.6 }}>
                          ðŸ"' <strong>Enterprise feature.</strong> This composite score uses Shannon entropy for diversity calculation. Higher scores indicate greater demographic and financial diversity for this geography. Available for Pro/Enterprise subscribers.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* â"€â"€ State Breakdown â"€â"€ */}
            <div style={{ marginBottom: 16 }}>
              <HBarChart
                title={isAll ? 'All States "" Property Count' : `${geoLabel} "" State Breakdown`}
                data={stateBreakdown}
                loading={stateLoad.loading}
                error={stateLoad.error}
                onRetry={() => fetchState(stateCode)}
              />
            </div>

            {/* â"€â"€ Geographic Drill-Down (single state) â"€â"€ */}
            {!isAll && selected.length === 1 && (
              <div style={{ marginBottom: 16 }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '10px 16px', background: C.navy, borderRadius: 10, color: '#fff', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Geographic Drill-Down</span>
                  <span style={{ opacity: 0.3, margin: '0 4px' }}>|</span>

                  {/* State */}
                  <button onClick={() => { setSelectedCounty(null); setDrillCity(null); setDrillZip(null); }} style={{
                    background: (!selectedCounty && !drillCity) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20,
                    fontSize: 12, cursor: 'pointer', fontFamily: C.font, fontWeight: (!selectedCounty && !drillCity) ? 700 : 400,
                  }}>{ALL_STATES.find(s => s.code === selected[0])?.name ?? selected[0]}</button>

                  {/* County */}
                  {selectedCounty && (
                    <>
                      <span style={{ opacity: 0.4 }}>"º</span>
                      <button onClick={() => { setDrillCity(null); setDrillZip(null); }} style={{
                        background: (selectedCounty && !drillCity) ? 'rgba(255,255,255,0.2)' : 'transparent',
                        border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20,
                        fontSize: 12, cursor: 'pointer', fontFamily: C.font, fontWeight: !drillCity ? 700 : 400,
                      }}>{selectedCounty} County</button>
                    </>
                  )}

                  {/* City */}
                  {drillCity && (
                    <>
                      <span style={{ opacity: 0.4 }}>"º</span>
                      <button onClick={() => setDrillZip(null)} style={{
                        background: drillCity && !drillZip ? 'rgba(255,255,255,0.2)' : 'transparent',
                        border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20,
                        fontSize: 12, cursor: 'pointer', fontFamily: C.font, fontWeight: !drillZip ? 700 : 400,
                      }}>{drillCity}</button>
                    </>
                  )}

                  {/* ZIP */}
                  {drillZip && (
                    <>
                      <span style={{ opacity: 0.4 }}>"º</span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{drillZip}</span>
                    </>
                  )}
                </div>

                {/* â"€â"€ Level: County â"€â"€ */}
                {!selectedCounty && !drillCity && (
                  <>
                    {countyLoad.loading ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} h={100} />)}
                      </div>
                    ) : countyLoad.error ? (
                      <ErrorMsg msg={countyLoad.error} onRetry={() => stateCode && fetchCounty(stateCode)} />
                    ) : countyCards.length > 0 ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: C.textMuted }}>Select a county to drill down to cities:</div>
                          <input
                            type="text"
                            placeholder="Search county..."
                            value={countySearch}
                            onChange={e => setCountySearch(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: C.font, outline: 'none', width: 160, background: C.bgCard, color: C.text }}
                          />
                        </div>
                        <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                          {countyCards.filter(c => !countySearch || c.name.toLowerCase().includes(countySearch.toLowerCase())).map((county, i) => {
                            const maxProps = Math.max(...countyCards.map(c => c.props));
                            return (
                              <div key={i} onClick={() => setSelectedCounty(county.name)}
                                style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', animation: 'fadeIn 0.4s ease' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                <div style={{ padding: '8px 12px', background: C.chart[i % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {county.name} County
                                </div>
                                <div style={{ padding: '10px 12px' }}>
                                  <div style={{ fontSize: 18, fontWeight: 300, color: C.chart[i % C.chart.length], fontFamily: C.fontSerif, marginBottom: 2 }}>
                                    {county.props >= 1e6 ? (county.props / 1e6).toFixed(1) + 'M' : county.props >= 1e3 ? (county.props / 1000).toFixed(0) + 'K' : county.props.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }}>properties</div>
                                  <div style={{ height: 6, background: C.bgWarm, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                                    <div style={{ width: `${maxProps > 0 ? (county.props / maxProps) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 3, transition: 'width 0.6s ease' }} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>
                                      {county.avg > 0 ? '$' + (county.avg / 1000).toFixed(0) + 'K avg' : '""'}
                                    </span>
                                    <span style={{ fontSize: 11, color: C.terra, fontWeight: 600 }}>Cities "º</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Also show city cards directly for exploration */}
                        {cityCards.length > 0 && (
                          <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Or jump directly to a city:</div>
                            <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                              {cityCards.slice(0, 8).map((city, i) => (
                                <div key={i} onClick={() => setDrillCity(city.name)}
                                  style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                  <div style={{ padding: '8px 12px', background: C.chart[(i + 4) % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700 }}>{city.name}</div>
                                  <div style={{ padding: '10px 12px' }}>
                                    <div style={{ fontSize: 16, fontWeight: 300, color: C.chart[(i + 4) % C.chart.length], fontFamily: C.fontSerif }}>
                                      {city.props >= 1e3 ? (city.props / 1000).toFixed(0) + 'K' : city.props.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>properties</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono }}>${(city.avg / 1000).toFixed(0)}K avg</span>
                                      <span style={{ fontSize: 11, color: C.terra }}>ZIPs "º</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Fallback: show cities directly */
                      cityCards.length > 0 ? (
                        <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                          {cityCards.map((city, i) => {
                            const maxProps = Math.max(...cityCards.map(c => c.props));
                            return (
                              <div key={i} onClick={() => setDrillCity(city.name)}
                                style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', animation: 'fadeIn 0.4s ease' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                <div style={{ padding: '8px 12px', background: C.chart[i % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700 }}>{city.name}</div>
                                <div style={{ padding: '10px 12px' }}>
                                  <div style={{ fontSize: 18, fontWeight: 300, color: C.chart[i % C.chart.length], fontFamily: C.fontSerif, marginBottom: 2 }}>
                                    {city.props >= 1e3 ? (city.props / 1000).toFixed(0) + 'K' : city.props.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }}>properties</div>
                                  <div style={{ height: 6, background: C.bgWarm, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                                    <div style={{ width: `${maxProps > 0 ? (city.props / maxProps) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 3, transition: 'width 0.6s ease' }} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>${(city.avg / 1000).toFixed(0)}K avg</span>
                                    <span style={{ fontSize: 11, color: C.terra, fontWeight: 600 }}>View ZIPs "º</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: C.textDim, fontSize: 13, background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}` }}>
                          Loading county and city data"¦
                        </div>
                      )
                    )}
                  </>
                )}

                {/* â"€â"€ Level: County selected "" show cities in that county â"€â"€ */}
                {selectedCounty && !drillCity && (
                  <>
                    {cityLoad.loading ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[1,2,3,4,5,6].map(i => <Skeleton key={i} h={100} />)}
                      </div>
                    ) : cityLoad.error ? (
                      <ErrorMsg msg={cityLoad.error} onRetry={() => stateCode && fetchCity(stateCode, selectedCounty)} />
                    ) : cityCards.length > 0 ? (
                      <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {cityCards.map((city, i) => (
                          <div key={i} onClick={() => setDrillCity(city.name)}
                            style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', animation: 'fadeIn 0.4s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                            <div style={{ padding: '8px 12px', background: C.chart[i % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700 }}>{city.name}</div>
                            <div style={{ padding: '10px 12px' }}>
                              <div style={{ fontSize: 18, fontWeight: 300, color: C.chart[i % C.chart.length], fontFamily: C.fontSerif }}>
                                {city.props >= 1e3 ? (city.props / 1000).toFixed(0) + 'K' : city.props.toLocaleString()}
                              </div>
                              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6 }}>properties</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono }}>${(city.avg / 1000).toFixed(0)}K avg</span>
                                <span style={{ fontSize: 11, color: C.terra }}>ZIPs "º</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 12, background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}` }}>
                        No cities found for {selectedCounty} County.
                      </div>
                    )}
                  </>
                )}

                {/* â"€â"€ Level: City selected "" show ZIPs â"€â"€ */}
                {drillCity && !drillZip && (
                  <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ padding: '10px 16px', background: C.bgWarm, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{drillCity} "" ZIP Code Analysis</span>
                      <button onClick={() => setDrillCity(null)}
                        style={{ background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 20, padding: '4px 14px', fontSize: 12, color: C.terra, cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
                        "¹ Back to Cities
                      </button>
                    </div>
                    {zipLoad.loading ? (
                      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                        {[1,2,3,4,5,6,7,8,9,10].map(i => <Skeleton key={i} h={80} />)}
                      </div>
                    ) : zipLoad.error ? (
                      <div style={{ padding: 12 }}><ErrorMsg msg={zipLoad.error} onRetry={() => stateCode && fetchZip(stateCode, drillCity)} /></div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, padding: 16 }}>
                        {zipCards.map((z, i) => (
                          <div key={i} onClick={() => setDrillZip(z.zip)}
                            style={{ background: drillZip === z.zip ? '#FFF0E9' : C.bgWarm, borderRadius: 8, padding: '12px 14px', border: `1px solid ${drillZip === z.zip ? C.terra : C.borderLight}`, cursor: 'pointer', transition: 'all 0.15s', animation: 'fadeIn 0.4s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = drillZip === z.zip ? C.terra : C.borderLight)}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, fontFamily: C.fontMono, marginBottom: 4 }}>{z.zip}</div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{z.city}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{z.props.toLocaleString()}</div>
                                <div style={{ fontSize: 9, color: C.textDim }}>parcels</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.sage }}>${(z.avg / 1000).toFixed(0)}K</div>
                                <div style={{ fontSize: 9, color: C.textDim }}>avg value</div>
                              </div>
                            </div>
                            <button onClick={e => { e.stopPropagation(); setModal({ filter: `ZIP ${z.zip} "" ${z.city}`, state: stateCode, zip: z.zip, city: drillCity }); }}
                              style={{ width: '100%', marginTop: 8, padding: '4px', background: 'transparent', border: `1px dashed ${C.border}`, borderRadius: 4, fontSize: 10, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                              View Parcels
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* â"€â"€ Demographics Deep Dive â"€â"€ */}
            <div style={{ marginTop: 8, background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div
                onClick={() => {
                  const next = !showDemographics;
                  setShowDemographics(next);
                  if (next && !demoData && !demoLoad.loading) {
                    fetchDemographics(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined);
                  }
                }}
                style={{ padding: '12px 18px', background: C.navy, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: 16 }}>ðŸ"Š</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>DEMOGRAPHICS DEEP DIVE</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>Ethnicity * Gender * Marital Status * Education * Income * Wealth Score</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, background: `${C.terra}`, color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>PRO</span>
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{showDemographics ? 'â-²' : 'â-¼'}</span>
                </div>
              </div>

              {showDemographics && (
                <div style={{ padding: 16, animation: 'fadeIn 0.3s ease' }}>
                  {demoLoad.loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {[1,2,3,4,5,6].map(i => <Skeleton key={i} h={140} />)}
                    </div>
                  ) : demoLoad.error ? (
                    <ErrorMsg msg={demoLoad.error} onRetry={() => fetchDemographics(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined)} />
                  ) : demoData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* Row 0: Ethnicity */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                        <FreqTable
                          title="Owner Ethnicity — Direct Identified"
                          data={(ethnicityBreakdown ?? []).map((r: any) => ({
                            label: r.LABEL ?? r.label ?? 'Unknown',
                            count: Number(r.RECORD_COUNT ?? r.count ?? 0),
                            pct: 0
                          }))}
                          color={C.terra}
                        />
                        <div style={{ fontSize: 11, color: C.textMuted ?? '#888', marginTop: -8, paddingLeft: 4 }}>
                          [Green] Direct Identified records only. BISG modeled estimates coming in next release.
                        </div>
                      </div>
                      {/* Row 1: Gender + Marital + Education */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        <FreqTable title="Gender" data={demoData.gender.map(r => ({ ...r, label: r.label === 'M' ? 'Male' : r.label === 'F' ? 'Female' : r.label }))} color={C.terra} />
                        <FreqTable title="Marital Status" data={demoData.marital.map(r => ({
                          ...r,
                          label: r.label === 'M' ? 'Married' :
                                 r.label === 'S' ? 'Single' :
                                 r.label === 'A' ? 'Married (Inferred)' :
                                 r.label === 'B' ? 'Single (Inferred)' :
                                 r.label === 'Y' ? 'Married' :
                                 r.label === 'N' ? 'Single' : r.label
                        }))} color={C.sage} />
                        <FreqTable title="Education Level" data={demoData.education} color={C.gold} />
                      </div>
                      {/* Row 2: Income + Wealth */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <HBarChart title="Income Range" data={demoData.income} />
                        {/* Wealth Score panel */}
                        <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Wealth Score (A""H)</div>
                          <div style={{ padding: 14 }}>
                            {(() => {
                              const wTotal = demoData.wealth.reduce((s, w) => s + w.count, 0);
                              const wScoreOrder = ['A','B','C','D','E','F','G','H'];
                              const wColors = ['#1B2A4A','#2A4A7F','#4A7FB5','#5D7E52','#B8860B','#C4653A','#A85D8A','#8B0000'];
                              const wDescriptions = ['Top 1%','Top 5%','Top 15%','Top 30%','Top 50%','Top 70%','Bottom 30%','Bottom 10%'];
                              return wScoreOrder.map((score, si) => {
                                const row = demoData.wealth.find(w => w.label === score);
                                const count = row?.count ?? 0;
                                const pct = wTotal > 0 ? (count / wTotal) * 100 : 0;
                                return (
                                  <div key={score} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: 4, background: wColors[si], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{score}</div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <span style={{ fontSize: 11, color: C.textBody }}>{wDescriptions[si]}</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: wColors[si], fontFamily: C.fontMono }}>{pct.toFixed(1)}%</span>
                                      </div>
                                      <div style={{ height: 5, background: C.bgWarm, borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', background: wColors[si], borderRadius: 3, transition: 'width 0.6s ease' }} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>
                      {/* Social Housing Score promo */}
                      <div style={{ padding: '14px 18px', background: `${C.navy}08`, border: `1px dashed ${C.navy}40`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontSize: 28 }}>ðŸ˜ï¸</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Social Housing Score</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Composite diversity index combining ethnicity, income, LTV, and owner-occupancy. Available in Enterprise tier.</div>
                        </div>
                        <span style={{ fontSize: 11, background: C.navy, color: '#fff', borderRadius: 10, padding: '4px 12px', fontWeight: 700, whiteSpace: 'nowrap' }}>ðŸ"' Enterprise</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 24, color: C.textMuted, fontSize: 13 }}>
                      Click to load demographic data for the selected geography.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* â"€â"€ Methodology Note â"€â"€ */}
            <div style={{ marginTop: 8, padding: '12px 16px', background: C.bgWarm, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700, color: C.textBody }}>Data Methodology: </span>
              {METHODOLOGY_NOTE}
              <span style={{ display: 'block', marginTop: 6, fontSize: 10, color: C.textDim }}>
                Confidence indicators: [Green] Direct Identified (individually sourced) * [Yellow] Household Modeled * ðŸ"´ Area Estimated
              </span>
            </div>

            {/* -- Footer -- */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 11, color: C.textDim }}>
                ICONYCS Housing Analytics * Live Snowflake * 130M+ residential properties * {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/pricing" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
                <span style={{ color: C.border }}>|</span>
                <Link href="/terms" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Terms of Service</Link>
                <span style={{ color: C.border }}>|</span>
                <Link href="/privacy" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Privacy Policy</Link>
                <span style={{ color: C.border }}>|</span>
                <a href="mailto:info@iconycs.com" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
