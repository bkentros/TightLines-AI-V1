import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeCreel, summarizeStrata, speciesNames } from './pier-cast-remaining-species-evidence.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.join(root,'docs/onboarding/piercast/remaining-species');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const config=read(path.join(root,'docs/PierCast_Remaining_Species_Seasonal_Curves.json'));
const sources=['sources.json','phase1-sources.json'].flatMap(f=>read(path.join(directory,f)));
const sourceMap=new Map(sources.map((s,i)=>[s.evidenceId,{...s,number:i+1}]));
const refs=ids=>[...new Set(ids)].map(id=>`[^${sourceMap.get(id).number}]`).join('');
const ports={ludington_mi:'LUDINGTON',grand_haven_mi:'GRAND HAVEN',manistee_mi:'MANISTEE',frankfort_elberta_mi:'FRANKFORT-ELBERTA'};
const all=read(path.join(directory,'creel-snapshot.json')).files.flatMap(f=>decodeCreel(read(path.join(directory,f.file))).map(r=>({year:r['Combined.Year'],port:r['Combined.PORT'],month:r['Combined.Month'],species:r['Combined.SpeciesName'],estimateType:r['Combined.Estimate Type'],estimate:r['Sum(Combined.Estimate)']})));
const pretty=id=>id.replaceAll('_',' ');
const lines=[`# PierCast remaining-species seasonal research — Phase 1

Reviewed 2026-09-12. This document accompanies the [authoritative seasonal proposals](../../../PierCast_Remaining_Species_Seasonal_Curves.json), [52-week review](../../../PierCast_Remaining_Species_Weekly_Ratings.csv), [daily values](phase1-daily-ratings.csv), [monthly values](phase1-monthly-ratings.csv) and [coverage counts](phase1-coverage.json).

## Outcome and limits

All 45 city × species combinations have explicit annual review coverage. Fifteen have bounded provisional seasonal proposals; 30 remain numerically unresolved, including ten admitted research candidates. These are **research configuration**, not runtime onboarding or validated annual scores. A complete calendar table is not the same as complete numerical knowledge. Unsupported days remain null. None of these nine species has a justified January–December numerical profile from this evidence package.

The recurring warm-season fisheries deserve batch development. Grand Haven drum and largemouth have the strongest proposed summer windows; Manistee perch has a stronger spring window than summer. Ludington perch peaks later than Manistee perch. A fishery can be worth targeting without being a premier salmonid-scale opportunity. Several species can simultaneously receive strong values: there is no quota of seasonal winners.

The four completed core species, their weekly table and runtime configuration remain unchanged. Their existing 1–10 rubric governs these proposals. The UI, scoring formula, temperature pipeline, daily lock, city footprint, seven covered structures and disabled public release remain unchanged. Phase 2 owns thermal-response work and runtime eligibility; Phase 3 owns the joint annual-lineup review.

## What a number means

A seasonal value is a product calibration judgment about pier opportunity under supportive temperature. It is not fish abundance, a catch percentage, fish per hour, a government rating or a prediction that fish will bite. The existing bands are negligible 1, poor through 2, limited through 4, fair through 6, good through 8, excellent through 9.4, and premier above 9.4. The completed catalog reference remains Manistee late-October steelhead at 10.

Sparse anchors are deliberately coarse, mostly half-point increments. No evidence identifies an exact 6.5 optimum on a particular day. Representative mid-month anchors carry approximately month-level timing resolution. Month boundaries are declared interpolation limits within a researched season, not demonstrated arrival or departure dates. Daily and weekly decimals between anchors are arithmetic, not additional biological findings. A score difference of 0.5 between weakly supported proposals should not be treated as statistically established.

Each anchor has a rationale and source identifiers in the JSON. Linear interpolation is allowed only inside a listed segment. No extrapolation, annual wrapping, missing-month zero, winter floor or interpolation across disconnected seasons is permitted. A bounded segment is continuous within its domain; availability outside it is unresolved. Phase 2 must preserve that distinction, because the existing core runtime interpolator wraps annual curves and cannot safely receive these anchors without bounded-availability support.

## Evidence hierarchy and interpretation

1. Michigan DNR port-specific Pier/Dock estimates establish broad calendar recurrence and within-species comparisons. Modern 2012–2022 and recent 2018–2022 subsets exclude 2020 consistently with the preserved audit. Catch estimates, explicit zeros and omitted rows remain distinct.${refs(['MI_CREEL','MI_CREEL_PORTAL'])}
2. Dated DNR weekly paragraphs corroborate pier mode, species identity, practical methods and contemporary timing. A report of bass is not both bass species; whitefish is not automatically lake whitefish or menominee. A report of boats fishing from pierheads out to depth is not pier angling.
3. The 2025 Michigan creel supplement is newer but its Lake Michigan Pier/Dock table is lake-wide. Wisconsin 2022–2024 pier tables combine survey regions and cannot supply Sheboygan-only rates; 2024 sampling and modeling gaps require particular caution.${refs(['MI_2025','MI_2025_XLSX','WI_2022','WI_2023','WI_2024'])}
4. Agency species accounts and studies explain plausible mechanisms. Spawning, thermal occupancy, tolerances, growth and nearshore juvenile sampling do not supply bite probabilities or establish adult pier catches. Stocking records establish releases, not contemporary adult pier strength.${refs(['T016','T019','T023','T028','MI_STOCKING','WI_STOCKING'])}
5. Dated local reports and historical biologist recollections are corroboration or leads only. Sheboygan smallmouth and perch leads remain distinguishable from regional harvest and upstream fisheries.${refs(['SHEBOYGAN_SMALLMOUTH','SHEBOYGAN_PERCH_HISTORY','ROUND_DECLINE'])}

The rates below divide matched published catch estimates by **all-species Pier/Dock hours**. They are not directed catch rates. Changes in target effort, school encounters, fish size and catch-and-release practices can alter them without equivalent changes in an individual's opportunity. Perch counts cannot be converted into the salmonid scale with the same logarithmic transformation. We inspect recurrence, recent concentration, direct observations, method and structure before assigning a band. No invented quantitative discount corrects absent effort data.${refs(['CATCHABILITY_METHOD'])}

For lake trout the original conservative combined summary requires both Lean and Fat component rows. That omits some known Lean observations. The tables below therefore show **Lean Lake Trout only** for transparent seasonal inspection, never as a complete combined-species total. Candidate recurrence can count a known positive component without assuming that an absent component is zero.

## Material contradictions and their resolution

- **Winter:** January–March contain no matched local strata for the nine species in the preserved extract. DNR reporting also has seasonal interruptions. Ice fishing in a bayou or inland lake is a different mode/location. Winter silence cannot become a 1.0 or an inferred winter fishery. Cold-season fish biology is not a substitute for local catchability.${refs(['P1_3347f01','P1_40db479'])}
- **Perch:** Manistee's April–May strength contrasts with Ludington's June–July pattern. Large pooled estimates coexist with concentrated catch years, small fish and slow contemporary reports. Proposed peaks stop at good or fair, without pretending every year produces the historical best outcome.${refs(['B_1953bab','P1_1edc9d3','P1_2927150','B_35ed629','B_36281c5'])}
- **Manistee walleye:** older May zero estimates conflict with repeated May night catches in 2019, 2022 and 2023. A narrow night-fishing proposal follows the direct multi-year timing instead of giving the old July estimate an automatic summer peak. The discrepancy is unresolved statistically, not erased.${refs(['P1_2452955','B_3176352','B_3588f66'])}
- **Drum:** Grand Haven has strong recurring summer port records and contemporary catches. Manistee has recent pier reports despite mostly zero recent creel estimates, while Ludington's modern recurrence exceeds its recent series. They receive separate curves and ceilings; there is no shared drum curve.${refs(['B_41b62ae','B_41c718b','B_3a521c4','B_421929e'])}
- **Lake trout:** spring Manistee pier catches corroborate a limited proposal. Offshore abundance, stocking and autumn shoal spawning cannot fill other cities or autumn intervals. The April 2025 Ludington “pierheads out to 50 feet” wording occurs in boat context and is excluded from pier corroboration.${refs(['B_3548e2b','B_39595be','P1_3dc30dc','T016'])}
- **Grand Haven lake whitefish:** the DNR recognizes the autumn fishery but describes historical snagging contributions and changed November gear rules. Old jigging harvest and species-unspecified bait catches cannot identify current lawful lake-whitefish magnitude. The November lead stays active with null scores; a made-up percentage reduction would not fix the data.${refs(['WHITEFISH_GEAR','MI_REGS_2026','P1_26a3cdd','P1_26d27d2'])}
- **Species biology:** smallmouth's rocky habitat and largemouth's vegetation association explain different use of harbor faces, but neither makes every pier equivalent. Menominee's shallow spring/fall biology and pre-spawn feeding cessation argue against a generic spawning bonus. Temperature suitability remains a separate Phase 2 endpoint.${refs(['T023','T030','T019'])}

## Cross-city and completed-scale review

The highest new proposal is 7.0, shared by Grand Haven June drum and Manistee May perch. This is an evidence decision, not a permanent rule that non-salmonids must score lower. Neither has sufficiently strong contemporary exact-structure effort evidence here to justify an excellent or premier rating. Grand Haven August largemouth and drum can both be 6.5. Manistee smallmouth/drum and Ludington smallmouth/drum have lower ceilings because contemporary reports and recent estimates are weaker or more variable. No port inherits a neighboring city's curve.

Core comparisons are qualitative calibration checks only. The completed four-species in-sample replay is not an independent validation of these proposals, and it does not validate a universal catch-count conversion. Phase 3 must inspect all species together without altering already-completed core curves merely to create calendar coverage.

## All 45 pairings

The following retains candidate discovery separately from numeric readiness. “Unresolved” describes evidence sufficiency, not ecological absence or removal from the candidate queue. For each Michigan pairing, tables show modern/recent rates and positive/matched years; a dash means no matched catch-and-effort support. Noncore winter gaps remain visible in the full monthly/daily outputs. These compact tables show April–December to avoid repeating empty January–March strata.
`];
for(const row of config.rows){
 lines.push(`### ${pretty(row.cityId)} — ${pretty(row.speciesId)}\n\n**Research queue:** ${row.candidateStatus}. **Numeric status:** ${row.reviewStatus}. **Confidence:** ${row.confidence}.\n\n${row.calibrationRationale}${refs(row.evidenceIds)}\n\n**Structure/mode:** ${row.attribution} ${row.fishingMode}.\n\n**Unavailable dates:** ${row.unavailableReason}\n`);
 if(row.segments.length){
  lines.push('| Anchor | Proposed seasonal value | Reason |\n| --- | ---: | --- |');
  for(const s of row.segments)for(const a of s.anchors)lines.push(`| ${a.monthDay} | ${a.rating.toFixed(1)} | ${a.rationale} |`);
 }else lines.push(`**Seasonal lead retained:** ${row.seasonalLead}\n\n**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.`);
 if(ports[row.cityId]){
  lines.push('\n| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |\n| --- | ---: | ---: | ---: | ---: | ---: |');
  const local=all.filter(r=>r.port===ports[row.cityId]);
  const names=row.speciesId==='lake_trout'?['Lean Lake Trout']:speciesNames[row.speciesId];
  for(let m=4;m<=12;m++){
   const a=summarizeStrata(local,names,y=>y>=2012&&y<=2022&&y!==2020,m),b=summarizeStrata(local,names,y=>y>=2018&&y<=2022&&y!==2020,m);
   const rate=s=>s.catchPer1000AllSpeciesHours==null?'—':s.catchPer1000AllSpeciesHours.toFixed(1);
   lines.push(`| ${m} | ${rate(a)} | ${a.positiveYears}/${a.matchedYears} | ${rate(b)} | ${b.positiveYears}/${b.matchedYears} | ${b.largestYearCatchShare==null?'—':(b.largestYearCatchShare*100).toFixed(1)+'%'} |`);
  }
  if(row.speciesId==='lake_trout')lines.push('\nLake-trout table is the Lean component only; omitted Fat rows have not been imputed.');
 }else lines.push('\nNo comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.');
 lines.push('');
}
lines.push(`## Reproducibility and next phases

- Run \`npm run generate:pier-cast:remaining-seasonal\` for daily, weekly, monthly and coverage artifacts. Weekly bins begin January 1; week 52 includes December 24–31, with December 27 retained as the core-compatible review midpoint. Monthly means use available days only; availability counts prevent them from implying a complete month.
- Run \`node scripts/generate-pier-cast-remaining-seasonal-report.mjs\` for this evidence report. Raw snapshots and additional bulletin retrieval checksums are preserved locally.
- Run \`npm run check:pier-cast:remaining-seasonal\`, the existing remaining-species evidence checks, complete PierCast suite, core seasonal replay check and TypeScript checks. Tests establish implementation consistency, not empirical score accuracy.
- Phase 2 must resolve exact-side eligibility for each proposal, research thermal responses using appropriate endpoints, and implement bounded availability before enabling any additional runtime species. Do not import null-window anchors into the cyclic core interpolator. Lake whitefish lawful-method magnitude and Frankfort/Sheboygan candidate gaps remain evidence tasks, not permission to invent curves.
- Phase 3 must inspect daily/weekly species succession and overlapping peaks jointly, preserve real unavailable dates and unchanged public scientific gates, and reconcile deployment only if runtime/schema changes require it.

**Completion statement:** This is a reproducible Phase 1 research and provisional calibration package. It does not establish high-confidence numeric scores for all 45 pairings across all 12 months. Exact-side and annual evidence gaps are listed rather than hidden behind low scores. The ten still-unscored research candidates remain in the batch queue.

## Sources

All source records include geographic scope, fishing mode, review date and limitations in the linked JSON registers. Bulletin date headings and send dates can differ; phase1-sources.json preserves both where applicable. The retrieval ledger preserves hashes for newly reviewed bulletins. Each source below is cited for its actual scope; no source endorses the proposed numerical ratings.
`);
for(const s of sourceMap.values())lines.push(`[^${s.number}]: [${s.title}](${s.url}). Published ${s.publishedAt??'date not stated'}; reviewed ${s.reviewedAt}. Scope: ${s.geographicScope}. Mode: ${s.fishingMode}. ${s.limitations}`);
const output=path.join(directory,'PHASE1_SEASONAL_RESEARCH.md'),text=lines.join('\n')+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(output,'utf8')!==text)throw new Error('Regenerate Phase 1 report');}else fs.writeFileSync(output,text);
console.log(`${process.argv.includes('--check')?'Verified':'Generated'} 45-pair seasonal evidence report.`);
