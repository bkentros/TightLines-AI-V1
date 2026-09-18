import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const piercast = resolve(dir, '..');
const pass1 = JSON.parse(readFileSync(resolve(piercast, 'five-city-2026-09-pass1/species-decisions.json')));
const baseSources = JSON.parse(readFileSync(resolve(piercast, 'five-city-2026-09-pass1/source-ledger.json')));
const addedSources = JSON.parse(readFileSync(resolve(dir, 'source-addendum.json')));
const sourceIds = new Set([...baseSources.sources, ...addedSources.sources].map(s => s.id));
const existing = [
  JSON.parse(readFileSync(resolve(piercast, 'scoring-v3-pass1/v3-mode-calibrations.json'))).modes,
  JSON.parse(readFileSync(resolve(piercast, 'scoring-v3-secondary/secondary-mode-calibrations.json'))).modes,
].flat();
const curves = Object.fromEntries(existing.filter(m => m.thermalResponse?.knots).map(m => [m.speciesId, m.thermalResponse]));
const secondaryRuntime = JSON.parse(readFileSync(resolve(piercast, 'scoring-v3-secondary/secondary-runtime-candidates.json')));
for (const pair of secondaryRuntime.candidates) if (!curves[pair.speciesId]) curves[pair.speciesId] = {curveId:pair.modes[0].thermalCurveId};
const expansion = JSON.parse(readFileSync(resolve(piercast, 'species-expansion-pass2/runtime-candidates.json')));
curves.northern_pike = {policy:'inherit_existing_shared_species_response', curveId:expansion.candidates.find(p=>p.speciesId==='northern_pike').modes[0].thermalCurveId};

// Strengths are ordinal judgment ceilings, not agency ratings or catch probabilities.
// Every numeric row below has exact-city pier/harbor targeting plus independent mode data.
const approved = {
  'two_rivers_wi/chinook_salmon': {grade:'B', strength:8.4, sources:['TWO_RIVERS_OUTDOOR_2019','WI_PIER_REPORT_2010_09','WI_COUNTY_SPECIES_2024','WI_WEEKLY_2026_09_07'], why:'Recurring county pier Chinook plus exact Two Rivers fall reports, including a documented hit-or-miss window in which a morning produced six to eight salmon across the Two Rivers/Manitowoc piers. The peak is excellent but remains below Kewaunee, Algoma, and Sheboygan.'},
  'two_rivers_wi/coho_salmon': {grade:'B', strength:7.1, sources:['WI_TWO_RIVERS_1969','WI_COUNTY_SPECIES_2024','WI_PIER_2022','WI_PIER_2023','WI_PIER_2024'], why:'Historic exact north-pier coho plus recurring recent county pier coho establish a strong prime window; city allocation remains the disclosed Grade B limitation, not a score discount.'},
  'two_rivers_wi/steelhead': {grade:'B', strength:7.3, sources:['WI_ACCESS_2023','WI_COUNTY_SPECIES_2024','WI_STEELHEAD_PIER'], why:'DNR names rainbow at Two Rivers harbor access and county pier rainbow recurs, including 116 in 2024; calibrated below the corrected Sheboygan 7.8 and the strongest Michigan fall ports.'},
  'two_rivers_wi/brown_trout': {grade:'B', strength:7.2, sources:['WI_ACCESS_2023','WI_PIER_REPORT_2010_09','WI_COUNTY_SPECIES_2024','WI_PIER_2024'], why:'DNR names brown at Two Rivers harbor access, exact fall pier reporting includes brown trout, and county pier brown recurs; calibrated below Port Washington 8.1 and Sheboygan 7.8.'},
  'kewaunee_wi/chinook_salmon': {grade:'B', strength:9.1, sources:['WI_WEEKLY_2026_09_07','MWO_2025_11','WI_COUNTY_SPECIES_2024'], why:'Repeated exact Kewaunee pier/harbor Chinook reports sit inside the county that led Wisconsin Chinook harvest in 2024. The recurring pier peak is elite, below Sheboygan 9.4 and the 9.5+ reference class.'},
  'kewaunee_wi/coho_salmon': {grade:'B', strength:6.8, sources:['MWO_2025_11','WI_WEEKLY_2026_09_07','WI_COUNTY_SPECIES_2024'], why:'Exact current pier coho and pooled county recurrence support a strong prime window, below the corrected 8.2-8.6 established Wisconsin spring-coho anchors.'},
  'kewaunee_wi/steelhead': {grade:'B', strength:7.8, sources:['MWO_2025_11','WI_WEEKS_2024_09','WI_COUNTY_SPECIES_2024','WI_STEELHEAD_PIER'], why:'Exact 2024/25 pier rainbow/steelhead reports and 133 county pier rainbows in 2024 support an excellent local peak equal to corrected Sheboygan 7.8 and well below Michigan reference-class ports.'},
  'kewaunee_wi/brown_trout': {grade:'B', strength:7.4, sources:['WI_ACCESS_2023','MWO_2025_11','WI_COUNTY_SPECIES_2024'], why:'DNR river-mouth access, exact 2025 pier brown trout, and recurring county pier harvest support a strong peak below Port Washington 8.1 and Sheboygan 7.8.'},
  'kewaunee_wi/lake_trout': {grade:'B', strength:4.2, sources:['WI_NORTH_LM_ARCHIVE','NOAA_WI_1981','WI_CREEL_COUNTY_2024','WI_PIER_2022','WI_PIER_2023','WI_PIER_2024'], why:'Historic exact Kewaunee pier targeting and older county pier recurrence establish an ordinary but real cold-season opportunity. Recent zero estimates prevent an offshore-derived high score but do not justify a hidden confidence penalty below comparable 3.6-4.0 Michigan pier modes.'},
  'algoma_wi/chinook_salmon': {grade:'B', strength:9.0, sources:['WI_WEEKLY_2026_09_07','MWO_2025_11','WI_PIER_REPORT_2010_09','WI_COUNTY_SPECIES_2024'], why:'Exact 2010, 2025, and 2026 pier targeting/catch reports plus leading Kewaunee County context support an elite recurring fall peak, just below Kewaunee 9.1 and Sheboygan 9.4.'},
  'algoma_wi/coho_salmon': {grade:'B', strength:7.0, sources:['MWO_2025_11','WI_PIER_REPORT_2010_09','WI_WEEKLY_2026_09_07','WI_COUNTY_SPECIES_2024'], why:'Exact Algoma pier coho reports in 2010 and 2025 support a strong prime window; pooled county magnitude places it below the corrected 8.2-8.6 established Wisconsin spring-coho anchors.'},
  'algoma_wi/steelhead': {grade:'B', strength:7.7, sources:['WI_ACCESS_2023','MWO_2025_11','WI_COUNTY_SPECIES_2024'], why:'DNR breakwall rainbow association and exact 2025 pier rainbow, within Wisconsin\'s leading 2024 rainbow-harvest county, support an excellent peak just below Kewaunee and Sheboygan 7.8.'},
  'algoma_wi/brown_trout': {grade:'B', strength:7.6, sources:['WI_PIER_REPORT_2010_09','WI_WEEKLY_2026_09_07','WI_COUNTY_SPECIES_2024','WI_ACCESS_2023'], why:'An exact Algoma pier report describes many anglers catching a mixed bag that included brown trout, and current trout targeting plus county recurrence support a strong peak near Sheboygan 7.8.'},
  'manitowoc_wi/chinook_salmon': {grade:'B', strength:8.5, sources:['WI_WEEKLY_2026_09_07','WI_PIER_REPORT_2010_09','WI_COUNTY_SPECIES_2024','MANITOWOC_OUTDOOR_2010'], why:'Exact south-pier reports, a six-to-eight-salmon peak morning across the paired city piers, and about ten county-pier Chinook in a 2026 week support an excellent recurring peak below Kewaunee, Algoma, and Sheboygan.'},
  'manitowoc_wi/coho_salmon': {grade:'B', strength:7.2, sources:['WI_COUNTY_SPECIES_2024','NOAA_WI_1981','WI_PIER_2024'], why:'Historic exact breakwater association and county pier coho estimates of 20, 205, and 133 in 2022-24 support a strong prime window; the city split remains a Grade B disclosure.'},
  'manitowoc_wi/steelhead': {grade:'B', strength:7.2, sources:['WI_ACCESS_2023','WI_COUNTY_SPECIES_2024','WI_STEELHEAD_PIER'], why:'DNR names rainbow at Manitowoc Marina pier and county pier rainbow recurs, including 116 in 2024; calibrated below corrected Sheboygan 7.8.'},
  'manitowoc_wi/brown_trout': {grade:'B', strength:7.2, sources:['WI_ACCESS_2023','WI_PIER_REPORT_2010_09','WI_COUNTY_SPECIES_2024','WI_PIER_2024'], why:'DNR names brown at the marina pier, exact paired-city fall reporting includes brown trout, and county pier brown recurs; calibrated below Port Washington 8.1 and Sheboygan 7.8.'},
  'manitowoc_wi/smallmouth_bass': {grade:'B', strength:5.8, sources:['WI_ACCESS_2023','WI_WEEKLY_2026_09_07','WI_PIER_2022','WI_PIER_2023','WI_PIER_2024'], why:'DNR exact marina-pier association plus current county pier catches support an ordinary but worthwhile warm-season fishery equal to Ludington 5.8 and below Grand Haven 7.0.'},
  'manitowoc_wi/northern_pike': {grade:'B', strength:5.2, sources:['WI_ACCESS_2023','WI_WEEKLY_2026_09_07','WI_PIER_2022','WI_PIER_2023','WI_PIER_2024','WI_PIKE_SEASON_2026'], why:'DNR exact marina-pier association plus current county pier catches support an ordinary peak equal to Ludington 5.2; no evidence supports an excellent pike rating.'},
  'waukegan_il/chinook_salmon': {grade:'B', strength:7.6, sources:['INHS_2023_SITE','INHS_2024_SITE','WAUKEGAN_PIER_GUIDE','WAUKEGAN_2019_PIER','IL_STOCKING_2025'], why:'Repeated Waukegan Harbor pedestrian harvest and exact Government Pier fall targeting support a strong staging peak above Kenosha 7.4 and below the excellent central-Wisconsin ports; October remains outside the quantitative survey.'},
  'waukegan_il/coho_salmon': {grade:'B', strength:8.8, sources:['INHS_2023_SITE','INHS_2024_SITE','WAUKEGAN_PIER_GUIDE','IL_SEASON_2026'], why:'Repeated Waukegan Harbor pedestrian harvest of 2,493 and 1,893 coho with heavy salmon-directed effort supports an excellent spring fishery equal to Grand Haven 8.8 and above Kenosha 8.6.'},
  'waukegan_il/steelhead': {grade:'B', strength:6.8, sources:['INHS_2023_SITE','INHS_2024_SITE','WAUKEGAN_PIER_GUIDE','IL_SEASON_2026'], why:'Waukegan pedestrian estimates of 29 and 162 rainbows plus exact pier seasonal targeting support a strong 6.8 peak, above Port Washington 6.6 and below Oscoda 7.4 and Racine 7.7. Cold-month coverage remains a Grade B limitation rather than a score multiplier.'},
  'waukegan_il/brown_trout': {grade:'B', strength:7.0, sources:['WAUKEGAN_PIER_GUIDE','WAUKEGAN_2019_PIER','INHS_2023_SITE','INHS_2024_SITE','IL_SEASON_2026'], why:'Exact Government Pier cold-season targeting and local catch reporting support a strong peak below corrected Port Washington 8.1; warm-season survey zeros do not measure the primary winter window.'},
  'waukegan_il/yellow_perch': {grade:'B', strength:5.4, sources:['INHS_2023_SITE','INHS_2024_SITE','WAUKEGAN_2019_PIER','IL_FISHERY_2026'], why:'A 460-fish pedestrian estimate in 2023, exact-area targeting, and a zero 2024 estimate support a variable ordinary peak equal to Kenosha 5.4; the May 1-June 15 closure remains hard-zero availability.'},
};

const priorStrengths = {
  'two_rivers_wi/chinook_salmon':5.8,'two_rivers_wi/coho_salmon':4.5,'two_rivers_wi/steelhead':5.2,'two_rivers_wi/brown_trout':5.1,
  'kewaunee_wi/chinook_salmon':6.4,'kewaunee_wi/coho_salmon':4.8,'kewaunee_wi/steelhead':5.1,'kewaunee_wi/brown_trout':5.2,'kewaunee_wi/lake_trout':3.2,
  'algoma_wi/chinook_salmon':6.0,'algoma_wi/coho_salmon':4.7,'algoma_wi/steelhead':5.1,'algoma_wi/brown_trout':4.4,
  'manitowoc_wi/chinook_salmon':6.2,'manitowoc_wi/coho_salmon':5.0,'manitowoc_wi/steelhead':5.1,'manitowoc_wi/brown_trout':5.0,'manitowoc_wi/smallmouth_bass':4.6,'manitowoc_wi/northern_pike':4.2,
  'waukegan_il/chinook_salmon':6.1,'waukegan_il/coho_salmon':8.0,'waukegan_il/steelhead':5.2,'waukegan_il/brown_trout':4.7,'waukegan_il/yellow_perch':4.3,
};

const modeTemplates = {
  chinook_salmon:[
    {id:'spring_nearshore_transient', factor:0.34, knots:[['03-15',0],['04-20',0.28],['05-20',0.72],['06-10',1],['06-25',0.35],['07-05',0]]},
    {id:'summer_coldwater_pulse', factor:0.72, knots:[['06-20',0],['07-15',0.7],['08-05',1],['08-25',0.6],['09-10',0]]},
    {id:'fall_harbor_staging', factor:1, knots:[['07-25',0],['08-15',0.42],['09-05',1],['09-20',0.83],['10-10',0.18],['11-01',0]]},
  ],
  coho_salmon:[
    {id:'spring_nearshore', factor:0.9, knots:[['02-15',0],['03-20',0.45],['04-20',1],['05-20',0.75],['06-20',0.2],['07-05',0]]},
    {id:'summer_coldwater_pulse', factor:0.82, knots:[['06-10',0],['07-15',1],['08-20',0.48],['09-10',0]]},
    {id:'fall_harbor_staging', factor:1, knots:[['08-15',0],['09-05',0.35],['10-05',1],['10-25',0.7],['11-20',0.12],['12-10',0]]},
  ],
  steelhead:[
    {id:'winter_spring_thermal_front', factor:0.94, knots:[['01-01',0.36],['02-15',0.42],['04-15',1],['05-20',0.7],['06-20',0.1],['07-01',0],['12-01',0.38]]},
    {id:'summer_coldwater_pulse', factor:0.85, knots:[['06-10',0],['07-20',1],['08-25',0.55],['09-15',0]]},
    {id:'fall_harbor_staging', factor:1, knots:[['08-20',0],['09-20',0.4],['10-25',1],['11-20',0.7],['12-20',0.38]]},
  ],
  brown_trout:[
    {id:'spring_nearshore', factor:1, knots:[['01-01',0.32],['02-15',0.5],['04-10',1],['05-15',0.67],['06-15',0.12],['07-01',0],['12-01',0.28]]},
    {id:'fall_harbor', factor:0.7, knots:[['08-25',0],['10-01',0.35],['11-10',1],['12-20',0.7]]},
  ],
  smallmouth_bass:[
    {id:'warm_season_harbor', factor:1, knots:[['03-15',0],['04-25',0.24],['06-20',1],['08-20',0.87],['10-01',0.38],['11-01',0]]},
  ],
  northern_pike:[
    {id:'spring_harbor', factor:0.92, knots:[['02-20',0.2],['04-25',1],['06-15',0.48],['07-15',0.2],['11-15',0.2]]},
    {id:'late_summer_fall_harbor', factor:1, knots:[['06-20',0.15],['08-20',0.62],['09-20',1],['11-15',0.42],['12-20',0.2]]},
  ],
  lake_trout:[
    {id:'cold_season_nearshore', factor:1, knots:[['01-01',0.55],['03-20',0.78],['05-01',0.28],['06-01',0],['09-20',0],['10-25',1],['11-20',0.8],['12-31',0.55]]},
    {id:'summer_coldwater_pulse', factor:0.75, knots:[['05-20',0],['06-20',0.4],['07-20',1],['08-25',0.42],['09-20',0]]},
  ],
  yellow_perch:[
    {id:'spring_harbor_schooling', factor:1, knots:[['01-15',0.18],['03-01',0.45],['04-15',1],['04-30',0.6],['05-01',0],['06-15',0],['06-16',0.25],['07-20',0.38],['09-01',0.15],['11-01',0.2],['12-15',0.15]]},
  ],
};

const absence = {
  lake_trout:'Historical Wisconsin county pier lake trout and offshore abundance establish occurrence, but 2022-24 county estimates are zero and the 2024 statewide pier estimate is only three. Illinois 2023-24 Waukegan pedestrian estimates are zero. No defensible current exact-pier annual magnitude; offshore catch is excluded.',
  coho_salmon:'Where held: the county pier harvest is real, but Two Rivers and Manitowoc have no recent species-separated exact-pier coho observations or city effort split. Historic mixed-mode or 1969 evidence does not justify a current city ceiling.',
  brown_trout:'Where held: generic Algoma pier trout targeting and Waukegan cold-season qualitative reports do not provide recent species-separated seasonal magnitude at the named pier.',
  yellow_perch:'New DNR perch table finds 2022-24 county pier harvest 0/0/0 in Kewaunee and 0/0/3 in Manitowoc. Algoma 2026 perch report is river, not pier. Local common pier targeting is unproven.',
  lake_whitefish:'The Waukegan advisory/rule establishes presence or legal treatment, not repeated Government Pier targeting or seasonal catch.',
  round_whitefish:'Combined whitefish regulation cannot identify a Government Pier round-whitefish fishery.',
};

const decisions = pass1.decisions.map(row => {
  const spec = approved[row.pairKey];
  if (spec) {
    return {...row, pass2Disposition:'numeric_shadow', evidenceGrade:spec.grade, numericAdmission:'private_formula_v3_estimate', fisheryStrength:spec.strength, evidenceIds:[...new Set([...row.sourceIds,...spec.sources])], evidenceReason:spec.why, limitation:'City pier effort and exact-structure allocation are unresolved unless the row has direct site data; all scores are estimates and stay private.'};
  }
  const gap = absence[row.speciesId];
  const evidenceReason=row.decision==='exclude' ? (row.nextEvidence || row.claim) : (gap || row.nextEvidence || row.claim);
  return {...row, pass2Disposition:row.decision==='exclude'?'exclude':'research_hold', evidenceGrade:row.decision==='exclude'?'D':'C', numericAdmission:'not_approved', evidenceIds:row.sourceIds, evidenceReason, limitation:'No numeric score is assigned from occurrence, stocking, offshore harvest, or unsplit neighboring-port data.'};
});
if (decisions.length!==95 || Object.keys(approved).length!==24 || new Set(decisions.map(x=>x.pairKey)).size!==95) throw new Error('Pair inventory incomplete');
if (Object.entries(approved).some(([, row]) => !Number.isFinite(row.strength) || row.strength < 2.1 || row.strength > 10)) throw new Error('Approved fishery strength outside the 2.1-10 rubric');
for (const row of decisions) for (const id of row.evidenceIds) if (!sourceIds.has(id)) throw new Error(`Unknown source ${id} in ${row.pairKey}`);

const modes = [];
for (const row of decisions.filter(x=>x.pass2Disposition==='numeric_shadow')) {
  const templates=row.pairKey==='waukegan_il/brown_trout' ? [
    {id:'cold_season_harbor',factor:1,knots:[['01-01',0.75],['02-10',0.85],['03-20',0.48],['04-30',0.1],['06-01',0],['09-01',0],['10-20',0.65],['11-20',1],['12-20',0.85]]},
  ] : modeTemplates[row.speciesId];
  for (const t of templates) {
    const factor=row.pairKey==='waukegan_il/coho_salmon' ? (t.id==='spring_nearshore'?1:t.id==='fall_harbor_staging'?0.72:0.5) : t.factor;
    const f=+(1+(row.fisheryStrength-1)*factor).toFixed(2);
    if (!Number.isFinite(f) || f < 2.1 || f > 10) throw new Error(`Mode strength outside the 2.1-10 rubric: ${row.pairKey}/${t.id}`);
    modes.push({modeCalibrationId:`${row.cityId}__${row.speciesId}__${t.id}__five_city_pass2`,pairKey:row.pairKey,modeId:t.id,fisheryStrength:f,evidenceGrade:row.evidenceGrade,availabilityKnots:t.knots.map(([monthDay,availability])=>({monthDay,availability})),thermalCurveId:curves[row.speciesId].curveId,fisheryEvidenceIds:row.evidenceIds,calibrationStatus:'private_shadow_only',limitations:[row.limitation,'Curve knot dates are bounded recurring-season estimates from broad pier timing and city evidence, not observed daily catch rates.']});
  }
}

function doy(md){return Math.floor((Date.parse(`2027-${md}T00:00:00Z`)-Date.parse('2027-01-01T00:00:00Z'))/86400000)}
function availability(knots,day){
  const arr=knots.map(k=>({d:doy(k.monthDay),v:k.availability})).sort((a,b)=>a.d-b.d);
  for(let i=0;i<arr.length;i++){
    const a=arr[i], b=i===arr.length-1?{d:arr[0].d+365,v:arr[0].v}:arr[i+1];
    const x=day<a.d?day+365:day;
    if(x>=a.d&&x<=b.d) return a.v+(b.v-a.v)*(x-a.d)/(b.d-a.d);
  }
  throw new Error('No curve segment');
}
const byPair = Map.groupBy(modes,m=>m.pairKey);
const daily=[];
for(const row of decisions.filter(x=>x.pass2Disposition==='numeric_shadow')){
  for(let d=0;d<365;d++){
    const date=new Date(Date.UTC(2027,0,1+d)).toISOString().slice(0,10);
    const closed=row.cityId==='waukegan_il'&&row.speciesId==='yellow_perch'&&date.slice(5)>='05-01'&&date.slice(5)<='06-15';
    const potentials=byPair.get(row.pairKey).map(m=>({mode:m.modeId,p:1+(m.fisheryStrength-1)*availability(m.availabilityKnots,d),F:m.fisheryStrength}));
    const winning=potentials.reduce((a,b)=>b.p>a.p?b:a);
    const potential=closed?null:winning.p;
    const rounded=v=>v==null?null:+v.toFixed(3);
    daily.push({date,pairKey:row.pairKey,legalStatus:closed?'species_closed':'open',winningMode:closed?null:winning.mode,seasonalPotential:rounded(potential),scoreThermalFit0:rounded(potential==null?null:1+(potential-1)*0.30),scoreThermalFitHalf:rounded(potential==null?null:1+(potential-1)*0.65),scoreThermalFit1:rounded(potential)});
  }
}
for (const x of daily) {
  if(x.legalStatus==='species_closed') {if(x.scoreThermalFit1!==null)throw new Error('Closed perch scored');continue;}
  const f=decisions.find(d=>d.pairKey===x.pairKey).fisheryStrength;
  if(!(1<=x.scoreThermalFit0 && x.scoreThermalFit0<=x.scoreThermalFitHalf && x.scoreThermalFitHalf<=x.scoreThermalFit1 && x.scoreThermalFit1<=f+0.001))throw new Error(`Bounds fail ${x.pairKey} ${x.date}`);
}
const baseline=readFileSync(resolve(piercast,'seasonal-opportunity-audit-2026-09/current-ideal-temperature-matrix.csv'),'utf8').trim().split('\n').slice(1).map(s=>s.split(','));
const comparedSpecies=new Set(Object.keys(approved).map(k=>k.split('/')[1]));
const comparisons=baseline.filter(r=>comparedSpecies.has(r[2])).map(r=>({pairKey:r[0],cityId:r[1],speciesId:r[2],peakScore:+r[8],peakDate:r[6],goodDays:+r[9],excellentDays:+r[10],source:'2026-09 current ideal temperature baseline'}));
const peakByPair = new Map([
  ...comparisons.map(x=>[x.pairKey,x.peakScore]),
  ...Object.entries(approved).map(([pairKey,x])=>[pairKey,x.strength]),
]);
const placementChecks = [
  {label:'Chinook corrected order',pairs:['sheboygan_wi/chinook_salmon','kewaunee_wi/chinook_salmon','algoma_wi/chinook_salmon','port_washington_wi/chinook_salmon','manitowoc_wi/chinook_salmon','two_rivers_wi/chinook_salmon','ludington_mi/chinook_salmon','racine_wi/chinook_salmon','waukegan_il/chinook_salmon','kenosha_wi/chinook_salmon'],relation:'descending'},
  {label:'Coho corrected order',pairs:['waukegan_il/coho_salmon','grand_haven_mi/coho_salmon','kenosha_wi/coho_salmon','port_washington_wi/coho_salmon','racine_wi/coho_salmon','sheboygan_wi/coho_salmon','milwaukee_wi/coho_salmon','manitowoc_wi/coho_salmon','two_rivers_wi/coho_salmon','algoma_wi/coho_salmon','kewaunee_wi/coho_salmon'],relation:'coho_corrected'},
  {label:'Steelhead corrected order',pairs:['ludington_mi/steelhead','kewaunee_wi/steelhead','sheboygan_wi/steelhead','algoma_wi/steelhead','racine_wi/steelhead','oscoda_mi/steelhead','two_rivers_wi/steelhead','manitowoc_wi/steelhead','waukegan_il/steelhead','port_washington_wi/steelhead'],relation:'steelhead_corrected'},
  {label:'Brown trout corrected order',pairs:['port_washington_wi/brown_trout','sheboygan_wi/brown_trout','algoma_wi/brown_trout','ludington_mi/brown_trout','kewaunee_wi/brown_trout','milwaukee_wi/brown_trout','racine_wi/brown_trout','two_rivers_wi/brown_trout','manitowoc_wi/brown_trout','waukegan_il/brown_trout'],relation:'brown_corrected'},
  {label:'Lake trout: Oscoda > Kewaunee > Manistee',pairs:['oscoda_mi/lake_trout','kewaunee_wi/lake_trout','manistee_mi/lake_trout'],relation:'descending'},
  {label:'Waukegan perch equals Kenosha perch',pairs:['waukegan_il/yellow_perch','kenosha_wi/yellow_perch'],relation:'equal'},
  {label:'Manitowoc smallmouth equals Ludington smallmouth',pairs:['manitowoc_wi/smallmouth_bass','ludington_mi/smallmouth_bass'],relation:'equal'},
  {label:'Manitowoc pike equals Ludington pike',pairs:['manitowoc_wi/northern_pike','ludington_mi/northern_pike'],relation:'equal'},
].map(check=>({...check,values:check.pairs.map(pairKey=>({pairKey,peakScore:peakByPair.get(pairKey)}))}));
for (const check of placementChecks) {
  const values=check.values.map(x=>x.peakScore);
  if(values.some(x=>!Number.isFinite(x))) throw new Error(`Missing cross-city anchor: ${check.label}`);
  const pass = check.relation==='equal' ? values[0]===values[1]
    : check.relation==='first_two_equal_then_descending' ? values[0]===values[1] && values.slice(1).every((x,i,a)=>i===a.length-1||x>a[i+1])
    : check.relation==='descending_with_positions_3_4_equal' ? values[3]===values[4] && values.every((x,i)=>i===values.length-1||i===3||x>values[i+1])
    : check.relation==='documented_mixed_order' ? values[1]===values[2] && values[4]===values[5] && values[6]===values[7] && values[0]>values[1] && values[2]>values[3] && values[3]>values[4] && values[5]>values[6] && values[7]>values[8]
    : check.relation==='coho_corrected' ? values[0]===values[1] && values[0]>values[2] && values[2]>values[3] && values[3]===values[4] && values[4]>values[5] && values[5]===values[6] && values.slice(6).every((x,i,a)=>i===a.length-1||x>a[i+1])
    : check.relation==='steelhead_corrected' ? values[0]>values[1] && values[1]===values[2] && values[2]>values[3] && values[3]===values[4] && values.slice(4).every((x,i,a)=>i===a.length-1||x>a[i+1])
    : check.relation==='brown_corrected' ? values[0]>values[1] && values[1]>values[2] && values[2]===values[3] && values[3]>values[4] && values[4]===values[5] && values[5]>values[6] && values[6]>values[7] && values[7]===values[8] && values[8]>values[9]
    : values.every((x,i)=>i===values.length-1||x>values[i+1]);
  if(!pass) throw new Error(`Cross-city placement failed: ${check.label} (${values.join(', ')})`);
  check.pass=true;
}
const summary=decisions.filter(x=>x.pass2Disposition==='numeric_shadow').map(row=>{
  const series=daily.filter(x=>x.pairKey===row.pairKey&&x.scoreThermalFit1!==null);
  const peak=series.reduce((a,b)=>b.scoreThermalFit1>a.scoreThermalFit1?b:a);
  return {pairKey:row.pairKey,evidenceGrade:row.evidenceGrade,priorStrength:priorStrengths[row.pairKey],fisheryStrength:row.fisheryStrength,strengthChange:+(row.fisheryStrength-priorStrengths[row.pairKey]).toFixed(1),peakDate:peak.date,idealPeak:peak.scoreThermalFit1,goodDays:series.filter(x=>x.scoreThermalFit1>=7).length,excellentDays:series.filter(x=>x.scoreThermalFit1>=8).length,minimumIdeal:Math.min(...series.map(x=>x.scoreThermalFit1)),closedDays:daily.filter(x=>x.pairKey===row.pairKey&&x.legalStatus==='species_closed').length};
});
const counts={numericShadow:summary.length,researchHold:decisions.filter(x=>x.pass2Disposition==='research_hold').length,exclude:decisions.filter(x=>x.pass2Disposition==='exclude').length,modes:modes.length,dailyRows:daily.length};
const checkpointDates=['01-15','02-15','03-15','04-15','05-15','06-15','07-15','08-15','09-15','10-15','11-15','12-15'];
const monthlyCheckpoints=summary.flatMap(x=>checkpointDates.map(monthDay=>{
  const row=daily.find(d=>d.pairKey===x.pairKey&&d.date===`2027-${monthDay}`);
  return {pairKey:x.pairKey,date:row.date,legalStatus:row.legalStatus,winningMode:row.winningMode,scoreThermalFit0:row.scoreThermalFit0,scoreThermalFitHalf:row.scoreThermalFitHalf,scoreThermalFit1:row.scoreThermalFit1};
}));
if(monthlyCheckpoints.length!==summary.length*12) throw new Error('Monthly checkpoint inventory incomplete');
const audit={schemaVersion:'piercast-five-city-pass2-audit-v2',calibrationStandardVersion:'piercast-absolute-cross-city-2026-09-17',reviewedAt:'2026-09-17',status:'private_shadow_only',formula:'1+(F-1)*A*(0.30+0.70*T)',temperatureScenarios:'Thermal fit T=0,0.5,1; not observed water temperatures',counts,summary,placementChecks,comparisons};
writeFileSync(resolve(dir,'pair-decisions.json'),JSON.stringify({schemaVersion:'piercast-five-city-pass2-pair-decisions-v2',calibrationStandardVersion:'piercast-absolute-cross-city-2026-09-17',reviewedAt:'2026-09-17',counts,decisions},null,2)+'\n');
writeFileSync(resolve(dir,'private-mode-calibrations.json'),JSON.stringify({schemaVersion:'piercast-five-city-pass2-mode-calibrations-v2',calibrationStandardVersion:'piercast-absolute-cross-city-2026-09-17',status:'private_shadow_only',modes},null,2)+'\n');
writeFileSync(resolve(dir,'full-year-daily-audit.csv'),['date,pairKey,legalStatus,winningMode,seasonalPotential,scoreThermalFit0,scoreThermalFitHalf,scoreThermalFit1',...daily.map(x=>[x.date,x.pairKey,x.legalStatus,x.winningMode??'',x.seasonalPotential??'',x.scoreThermalFit0??'',x.scoreThermalFitHalf??'',x.scoreThermalFit1??''].join(','))].join('\n')+'\n');
writeFileSync(resolve(dir,'monthly-checkpoints.csv'),[
  'pairKey,date,legalStatus,winningMode,scoreThermalFit0,scoreThermalFitHalf,scoreThermalFit1',
  ...monthlyCheckpoints.map(x=>[x.pairKey,x.date,x.legalStatus,x.winningMode??'',x.scoreThermalFit0??'',x.scoreThermalFitHalf??'',x.scoreThermalFit1??''].join(',')),
].join('\n')+'\n');
writeFileSync(resolve(dir,'cross-city-audit.json'),JSON.stringify(audit,null,2)+'\n');
writeFileSync(resolve(dir,'score-summary.csv'),[
  'pairKey,evidenceGrade,priorFisheryStrength,fisheryStrength,strengthChange,idealPeakDate,goodDays,excellentDays,closedDays',
  ...summary.map(x=>[x.pairKey,x.evidenceGrade,x.priorStrength,x.fisheryStrength,x.strengthChange,x.peakDate,x.goodDays,x.excellentDays,x.closedDays].join(',')),
].join('\n')+'\n');
writeFileSync(resolve(dir,'calibration-comparison.csv'),[
  'speciesId,cityId,pairKey,status,evidenceGrade,peakScore,peakDate,goodDays,excellentDays',
  ...comparisons.map(x=>[x.speciesId,x.cityId,x.pairKey,'established','',x.peakScore,x.peakDate,x.goodDays,x.excellentDays].join(',')),
  ...summary.map(x=>{const [cityId,speciesId]=x.pairKey.split('/');return [speciesId,cityId,x.pairKey,'five_city_private',x.evidenceGrade,x.fisheryStrength,x.peakDate,x.goodDays,x.excellentDays].join(',')}),
].join('\n')+'\n');
writeFileSync(resolve(dir,'research-holds.csv'),[
  'pairKey,evidenceGrade,pass2Disposition,reason',
  ...decisions.filter(x=>x.pass2Disposition!=='numeric_shadow').map(x=>[x.pairKey,x.evidenceGrade,x.pass2Disposition,`"${x.evidenceReason.replaceAll('"','""')}"`].join(',')),
].join('\n')+'\n');
console.log(JSON.stringify(counts));
