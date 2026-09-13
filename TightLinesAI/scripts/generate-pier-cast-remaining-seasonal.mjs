import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const research = path.join(root, 'docs/onboarding/piercast/remaining-species');
export const configurationPath = path.join(root, 'docs/PierCast_Remaining_Species_Seasonal_Curves.json');
const dayMs = 86400000;

export function dateOf(monthDay, year) {
  if (!/^\d{2}-\d{2}$/.test(monthDay)) throw new Error('Invalid month-day');
  const [month, day] = monthDay.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new Error('Invalid calendar date');
  return date.getTime();
}

// Mirror the completed core calendar contract; the Deno parity test checks
// every generated day against the actual runtime evaluator, including leap years.
export function evaluate(row, date) {
  const instant = date.getTime();
  if (!Number.isFinite(instant)) throw new Error('Invalid evaluation date');
  if (!row.knots.length) return null;
  const year = date.getUTCFullYear();
  const anchors = [year - 1, year, year + 1].flatMap(y =>
    row.knots.map(a => ({ time: dateOf(a.monthDay, y), rating: a.rating }))
  ).sort((a,b) => a.time - b.time);
  for (let i=1;i<anchors.length;i++) {
    const left=anchors[i-1],right=anchors[i];
    if (instant>=left.time && instant<=right.time)
      return left.rating+(right.rating-left.rating)*(instant-left.time)/(right.time-left.time);
  }
  throw new Error('Annual curve failed to cover date');
}

export function validate(config, sourceIds, roster) {
  if (config.publicReleaseEnabled !== false || config.referenceYear !== 2025 || config.phase !== 1) throw new Error('Invalid research contract');
  const expected = new Set(roster.rows.map(r => `${r.cityId}/${r.speciesId}`));
  if (config.rows.length !== 45 || expected.size !== 45) throw new Error('Expected all 45 pairings');
  for (const row of config.rows) {
    if (!expected.delete(`${row.cityId}/${row.speciesId}`)) throw new Error('Duplicate or out-of-scope pairing');
    if (row.productionReady !== false || row.ratingEnabled !== false) throw new Error('Research cannot enable runtime ratings');
    if (!row.calibrationRationale || !row.confidence || !row.attribution) throw new Error('Missing evidence rationale');
    for (const id of row.evidenceIds) if (!sourceIds.has(id)) throw new Error(`Unknown evidence: ${id}`);
    const accepted=row.phase1Decision==='accepted_annual_calibration';
    if (!accepted && row.phase1Decision!=='deferred') throw new Error('Invalid decision');
    if (row.calibrationStatus!=='provisional' || row.annualCoverageComplete!==accepted) throw new Error('Invalid calibration gate');
    if (accepted) {
      if (row.knots.length<2 || row.reviewStatus!=='annual_research_calibrated' || row.unavailableReason!==null || !row.seasonalMechanism || !row.annualLimitations) throw new Error('Incomplete annual research');
    } else if (row.knots.length || row.reviewStatus!=='deferred_pairing' || !row.deferralReason || !row.unavailableReason) throw new Error('Deferred pair must remain wholly unavailable');
    let previous=-Infinity;
    for (const anchor of row.knots) {
      const instant=dateOf(anchor.monthDay,2025);
      if (instant<=previous) throw new Error('Duplicate or unsorted anchors');
      if (!Number.isFinite(anchor.rating) || anchor.rating<1 || anchor.rating>10) throw new Error('Rating outside unchanged rubric');
      if (!anchor.rationale || !anchor.evidenceIds?.length || !anchor.basis || !anchor.confidence) throw new Error('Unexplained anchor');
      for (const id of anchor.evidenceIds) if (!sourceIds.has(id)) throw new Error(`Unknown anchor evidence: ${id}`);
      previous=instant;
    }
  }
  if (expected.size) throw new Error('Missing pairing');
}

function csv(rows) {
  return rows.map(row => row.map(v => {
    const text = v == null ? '' : String(v);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }).join(',')).join('\n') + '\n';
}

export function generate(check = false) {
  const config = JSON.parse(fs.readFileSync(configurationPath, 'utf8'));
  const sources = ['sources.json', 'phase1-sources.json', 'annual-sources.json'].flatMap(f => JSON.parse(fs.readFileSync(path.join(research, f), 'utf8')));
  if (new Set(sources.map(s => s.evidenceId)).size !== sources.length) throw new Error('Duplicate evidence identifier');
  const retrievals = ['phase1-retrieval-ledger.json','annual-retrieval-ledger.json'].flatMap(f=>JSON.parse(fs.readFileSync(path.join(research,f),'utf8')));
  for (const item of retrievals) {
    if (item.error || !item.file || !item.sha256) throw new Error('Unresolved preserved source');
    const bytes = fs.readFileSync(path.join(research, item.file));
    if (bytes.length !== item.bytes || createHash('sha256').update(bytes).digest('hex') !== item.sha256) throw new Error(`Source snapshot drift: ${item.evidenceId}`);
  }
  const roster = JSON.parse(fs.readFileSync(path.join(research, 'candidate-roster.json'), 'utf8'));
  validate(config, new Set(sources.map(s => s.evidenceId)), roster);
  const start = Date.UTC(config.referenceYear, 0, 1);
  const daily = [['cityId','speciesId','date','seasonalProposal','status','confidence','productionReady']];
  const weekly = [['cityId','speciesId','week','weekStart','weekEnd','midpointDate','seasonalProposal','availableDays','daysInWeek','status','confidence','productionReady']];
  const monthly = [['cityId','speciesId','month','midmonthProposal','availableDays','daysInMonth','availableDayMean','status','confidence','productionReady']];
  const summary = [];
  for (const row of config.rows) {
    const values = Array.from({length:365}, (_, i) => evaluate(row, new Date(start + i * dayMs)));
    const status = v => v == null ? 'deferred_pairing' : 'provisional_research_only';
    const printable = v => v == null ? null : v.toFixed(6);
    for (let i=0; i<365; i++) daily.push([row.cityId,row.speciesId,new Date(start+i*dayMs).toISOString().slice(0,10),printable(values[i]),status(values[i]),row.confidence,false]);
    for (let w=0; w<52; w++) {
      const first=w*7, last=w===51?364:first+6, mid=first+3;
      const iso=i=>new Date(start+i*dayMs).toISOString().slice(0,10);
      weekly.push([row.cityId,row.speciesId,w+1,iso(first),iso(last),iso(mid),printable(values[mid]),values.slice(first,last+1).filter(v=>v!=null).length,last-first+1,status(values[mid]),row.confidence,false]);
    }
    for (let m=0;m<12;m++) {
      const first=(Date.UTC(2025,m,1)-start)/dayMs, last=(Date.UTC(2025,m+1,1)-start)/dayMs;
      const available=values.slice(first,last).filter(v=>v!=null);
      const mid=values[first+14];
      monthly.push([row.cityId,row.speciesId,m+1,printable(mid),available.length,last-first,printable(available.length?available.reduce((a,b)=>a+b,0)/available.length:null),status(mid),row.confidence,false]);
    }
    summary.push({cityId:row.cityId,speciesId:row.speciesId,availableDays:values.filter(v=>v!=null).length,unavailableDays:values.filter(v=>v==null).length,peak:values.some(v=>v!=null)?Math.max(...values.filter(v=>v!=null)):null});
  }
  const detached=config.rows.filter(r=>r.knots.length).map(r=>({
    cityId:r.cityId,speciesId:r.speciesId,curveId:r.curveId,
    calibrationStatus:r.calibrationStatus,
    knots:r.knots.map(({monthDay,rating})=>({monthDay,rating})),
  }));
  const moduleText='// Generated by scripts/generate-pier-cast-remaining-seasonal.mjs.\n'
    +'// RESEARCH ONLY: owner research output; never active city profiles or public scope.\n'
    +'// Provisional seasonal calibration is not thermal/structure or public-release approval.\n'
    +'import type { PierCastCityId, PierCastSpeciesId, PierCastSeasonalOpportunityCurve } from "../types.ts";\n\n'
    +'export const PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH: (PierCastSeasonalOpportunityCurve & {cityId: PierCastCityId; speciesId: PierCastSpeciesId})[] = '
    +JSON.stringify(detached,null,2)+';\n';
  const outputs = [
    ['supabase/functions/_shared/pierCastEngine/config/additionalSeasonalResearch.generated.ts',moduleText],
    ['docs/PierCast_Remaining_Species_Weekly_Ratings.csv',csv(weekly)],
    ['docs/onboarding/piercast/remaining-species/phase1-daily-ratings.csv',csv(daily)],
    ['docs/onboarding/piercast/remaining-species/phase1-monthly-ratings.csv',csv(monthly)],
    ['docs/onboarding/piercast/remaining-species/phase1-coverage.json',JSON.stringify({referenceYear:2025,weeklyConvention:'52 January-1-based bins; final bin December 24-31 includes eight days. Midpoint remains December 27 for compatibility with core review. Daily table covers every date. Missing days excluded from availableDayMean, never treated as zero.',rows:summary},null,2)+'\n'],
  ];
  for (const [relative, contents] of outputs) {
    const target=path.join(root,relative);
    if (check) {if (!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==contents) throw new Error(`Regenerate ${relative}`);}
    else fs.writeFileSync(target,contents);
  }
  console.log(`${check?'Verified':'Generated'} ${daily.length-1} daily, ${weekly.length-1} weekly and ${monthly.length-1} monthly research rows; ${summary.filter(s=>s.peak!=null).length} complete annual proposals; runtime/public gates unchanged.`);
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) generate(process.argv.includes('--check'));
