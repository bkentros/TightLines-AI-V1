import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeCreel, summarizeStrata, speciesNames } from './pier-cast-remaining-species-evidence.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.join(root,'docs/onboarding/piercast/remaining-species');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const config=read(path.join(root,'docs/PierCast_Remaining_Species_Seasonal_Curves.json'));
const sources=['sources.json','phase1-sources.json','annual-sources.json'].flatMap(f=>read(path.join(directory,f)));
const sourceMap=new Map(sources.map((s,i)=>[s.evidenceId,{...s,number:i+1}]));
const refs=ids=>[...new Set(ids)].map(id=>`[^${sourceMap.get(id).number}]`).join('');
const ports={ludington_mi:'LUDINGTON',grand_haven_mi:'GRAND HAVEN',manistee_mi:'MANISTEE',frankfort_elberta_mi:'FRANKFORT-ELBERTA'};
const all=read(path.join(directory,'creel-snapshot.json')).files.flatMap(f=>decodeCreel(read(path.join(directory,f.file))).map(r=>({year:r['Combined.Year'],port:r['Combined.PORT'],month:r['Combined.Month'],species:r['Combined.SpeciesName'],estimateType:r['Combined.Estimate Type'],estimate:r['Sum(Combined.Estimate)']})));
const pretty=id=>id.replaceAll('_',' ');
const lines=[`# PierCast remaining-species seasonal research — Phase 1

Reviewed 2026-09-12. This document accompanies the [authoritative seasonal proposals](../../../PierCast_Remaining_Species_Seasonal_Curves.json), [52-week review](../../../PierCast_Remaining_Species_Weekly_Ratings.csv), [daily values](phase1-daily-ratings.csv), [monthly values](phase1-monthly-ratings.csv) and [coverage counts](phase1-coverage.json).

## Outcome and limits

All 45 city × species combinations have a final Phase 1 disposition: **16 accepted annual research calibrations and 29 deferred pairings**. The accepted curves contain 192 documented month-day anchors and supply 5,840 numeric species-days and 832 numeric weekly samples in 2025. Deferred pairings remain entirely unavailable; they are not species declared biologically absent. Research acceptance is broader than the earlier strict major-target audit and does not itself authorize runtime or public release.

Every accepted pairing has a continuous January–December curve, including weak periods. This follows the clarified product requirement. Phase 1 configuration and evidence synthesis are complete; high-confidence empirical accuracy is not established by this package. Winter and some shoulder values are explicitly low-confidence habitat/accessibility judgments. They must not be presented as measured local winter catch rates.

The recurring warm-season fisheries deserve batch development. Grand Haven drum and largemouth have the strongest proposed summer windows; Manistee perch has a stronger spring window than summer. Ludington perch peaks later than Manistee perch. A fishery can be worth targeting without being a premier salmonid-scale opportunity. Several species can simultaneously receive strong values: there is no quota of seasonal winners.

The four completed core species, their weekly table and runtime configuration remain unchanged. Their existing 1–10 rubric governs these proposals. The UI, scoring formula, temperature pipeline, daily lock, city footprint, seven covered structures and disabled public release remain unchanged. Phase 2 owns thermal-response work and runtime eligibility; Phase 3 owns the joint annual-lineup review.

## Accepted annual roster

These are additions proposed for Phase 2, alongside the unchanged completed four species in every city.

| City | Accepted additional annual calibrations | Count |
| --- | --- | ---: |
| Ludington | Smallmouth bass, freshwater drum, yellow perch | 3 |
| Grand Haven | Smallmouth bass, freshwater drum, lake whitefish, round whitefish, channel catfish, largemouth bass | 6 |
| Manistee | Lake trout, walleye, smallmouth bass, freshwater drum, yellow perch, round whitefish, largemouth bass | 7 |
| Frankfort–Elberta | None yet; all nine additional pairings deferred | 0 |
| Sheboygan | None yet; all nine additional pairings deferred | 0 |

No additional accepted species in Frankfort–Elberta or Sheboygan means insufficient evidence for this calibration pass, not an assertion that these piers lack other fish or winter fishing.

## What a number means

A seasonal value is a product calibration judgment about pier opportunity under supportive temperature. It is not fish abundance, a catch percentage, fish per hour, a government rating or a prediction that fish will bite. The existing bands are negligible 1, poor through 2, limited through 4, fair through 6, good through 8, excellent through 9.4, and premier above 9.4. The completed catalog reference remains Manistee late-October steelhead at 10.

Sparse anchors are deliberately coarse, mostly half-point increments. No evidence identifies an exact 6.5 optimum on a particular day. Representative mid-month anchors carry approximately month-level timing resolution. Anchor dates are representative seasonal reference points, not demonstrated arrival or departure dates. Daily and weekly decimals between anchors are arithmetic, not additional biological findings. A score difference of 0.5 between weakly supported proposals should not be treated as statistically established.

Each anchor records its rationale, source identifiers, evidence/inference basis and confidence in the JSON. Linear interpolation uses actual calendar days and wraps from December to January, exactly like the completed core curves. There are no seasonal availability windows. The detached generated TypeScript configuration is research-only and is not imported by runtime city assembly. Identical poor-band values in some months express the same coarse judgment, not a shared city curve or a measured common winter rate.

An annual seasonal curve describes accessibility and fishery opportunity under supportive temperature. Regional studies inform habitat direction only after local fishery admission. They do not independently admit a species, justify a strong peak, or fit a temperature-to-bite relationship.

## Evidence hierarchy and interpretation

1. Michigan DNR port-specific Pier/Dock estimates establish broad calendar recurrence and within-species comparisons. Modern 2012–2022 and recent 2018–2022 subsets exclude 2020 consistently with the preserved audit. Catch estimates, explicit zeros and omitted rows remain distinct.${refs(['MI_CREEL','MI_CREEL_PORTAL'])}
2. Dated DNR weekly paragraphs corroborate pier mode, species identity, practical methods and contemporary timing. A report of bass is not both bass species; whitefish is not automatically lake whitefish or menominee. A report of boats fishing from pierheads out to depth is not pier angling.
3. The 2025 Michigan creel supplement is newer but its Lake Michigan Pier/Dock table is lake-wide. Wisconsin 2022–2024 pier tables combine survey regions and cannot supply Sheboygan-only rates; 2024 sampling and modeling gaps require particular caution.${refs(['MI_2025','MI_2025_XLSX','WI_2022','WI_2023','WI_2024'])}
4. Agency species accounts and studies explain plausible mechanisms. Spawning, thermal occupancy, tolerances, growth and nearshore juvenile sampling do not supply bite probabilities or establish adult pier catches. Stocking records establish releases, not contemporary adult pier strength.${refs(['T016','T019','T023','T028','MI_STOCKING','WI_STOCKING'])}
5. Dated local reports and historical biologist recollections are corroboration or leads only. Sheboygan smallmouth and perch leads remain distinguishable from regional harvest and upstream fisheries.${refs(['SHEBOYGAN_SMALLMOUTH','SHEBOYGAN_PERCH_HISTORY','ROUND_DECLINE'])}

The rates below divide matched published catch estimates by **all-species Pier/Dock hours**. They are not directed catch rates. Changes in target effort, school encounters, fish size and catch-and-release practices can alter them without equivalent changes in an individual's opportunity. Perch counts cannot be converted into the salmonid scale with the same logarithmic transformation. We inspect recurrence, recent concentration, direct observations, method and structure before assigning a band. No invented quantitative discount corrects absent effort data.${refs(['CATCHABILITY_METHOD'])}

For lake trout the original conservative combined summary requires both Lean and Fat component rows. That omits some known Lean observations. The tables below therefore show **Lean Lake Trout only** for transparent seasonal inspection, never as a complete combined-species total. Candidate recurrence can count a known positive component without assuming that an absent component is zero.

## Material contradictions and their resolution

- **Winter:** January–March contain no matched local strata in the preserved extract. Missing observations remain missing. Annual weak-season values combine established local seasonal recurrence with explicitly transferred habitat evidence. Drum summer shallowing/deeper late-fall distribution, perch depth use and connected river-mouth movements, and bass habitat studies constrain direction, not numerical catch probability. Walleye winter feeding and continued winter bass/catfish activity contradict a universal inactivity floor. Heated discharge observations cannot establish unheated pier success.${refs(['A_DRUM_BUR1984','A_PERCH_ATLAS1981','A_PERCH_GENETICS2019','A_BASS_CARTER2012','A_BASS_WINTER2008','A_BASS_WINTER2024','A_SMALLMOUTH_RR1971','A_DNR_WALLEYE','A_CATFISH_KRUCKMAN2016','A_CATFISH_DISCHARGE1999'])}
- **Perch:** Manistee's April–May strength contrasts with Ludington's June–July pattern. Large pooled estimates coexist with concentrated catch years, small fish and slow contemporary reports. Proposed peaks stop at good or fair, without pretending every year produces the historical best outcome.${refs(['B_1953bab','P1_1edc9d3','P1_2927150','B_35ed629','B_36281c5'])}
- **Manistee walleye:** older May zero estimates conflict with repeated May night catches in 2019, 2022 and 2023. The annual curve’s strongest night-fishing period follows the direct multi-year timing instead of giving the old July estimate an automatic summer peak. The discrepancy is unresolved statistically, not erased.${refs(['P1_2452955','B_3176352','B_3588f66'])}
- **Drum:** Grand Haven has strong recurring summer port records and contemporary catches. Manistee has recent pier reports despite mostly zero recent creel estimates, while Ludington's modern recurrence exceeds its recent series. They receive separate curves and ceilings; there is no shared drum curve.${refs(['B_41b62ae','B_41c718b','B_3a521c4','B_421929e'])}
- **Lake trout:** spring Manistee pier catches and repeated October Lean-component port catches support limited shoulders with different confidence. Shallow cold-season habitat supports a poor winter accessibility judgment, not a measured winter fishery. Offshore abundance, stocking and spawning cannot supply other cities’ curves. The April 2025 Ludington “pierheads out to 50 feet” wording occurs in boat context and is excluded from pier corroboration.${refs(['B_3548e2b','B_39595be','P1_3dc30dc','T016'])}
- **Grand Haven lake whitefish:** current DNR recognition supports admission of a lawful autumn target. Historical snagging harvest is discarded as a magnitude basis. November 3.5 is an explicitly low-confidence limited-band product judgment; it is not a statistical estimate or a percentage discount applied to historical harvest. Deep summer habitat and nearshore late-autumn behavior inform annual shape. Contemporary lawful-method effort data remain a validation priority.${refs(['WHITEFISH_GEAR','MI_REGS_2026','P1_26a3cdd','P1_26d27d2','A_DNR_WHITEFISH'])}
- **Species biology:** smallmouth's rocky habitat and largemouth's vegetation association explain different use of harbor faces, but neither makes every pier equivalent. Menominee's shallow spring/fall biology and pre-spawn feeding cessation argue against a generic spawning bonus. Temperature suitability remains a separate Phase 2 endpoint.${refs(['T023','T030','T019'])}

## Cross-city and completed-scale review

The highest new proposal is 7.0, shared by Grand Haven June drum and Manistee May perch. This is an evidence decision, not a permanent rule that non-salmonids must score lower. Neither has sufficiently strong contemporary exact-structure effort evidence here to justify an excellent or premier rating. Grand Haven August largemouth and drum can both be 6.5. Manistee smallmouth/drum and Ludington smallmouth/drum have lower ceilings because contemporary reports and recent estimates are weaker or more variable. No port inherits a neighboring city's curve.

Core comparisons are qualitative calibration checks only. The completed four-species in-sample replay is not an independent validation of these proposals, and it does not validate a universal catch-count conversion. Phase 3 must inspect all species together without altering already-completed core curves merely to create calendar coverage.

## All 45 pairings

The following retains candidate discovery separately from numeric readiness. “Unresolved” describes evidence sufficiency, not ecological absence or removal from the candidate queue. For each Michigan pairing, tables show modern/recent rates and positive/matched years; a dash means no matched catch-and-effort support. The anchor tables cover all 12 months for accepted pairings. Creel tables also show all 12 months so missing winter observations remain distinguishable from inferred annual ratings.
`];
for(const row of config.rows){
 lines.push(`### ${pretty(row.cityId)} — ${pretty(row.speciesId)}\n\n**Research queue:** ${row.candidateStatus}. **Numeric status:** ${row.reviewStatus}. **Confidence:** ${row.confidence}.\n\n${row.calibrationRationale}${refs(row.evidenceIds)}\n\n**Structure/mode:** ${row.attribution} ${row.fishingMode}.\n\n**Phase 1 disposition:** ${row.phase1Decision}. ${row.unavailableReason??"Accepted annual research curve: no unavailable calendar dates."}\n`);
 if(row.knots.length){
  lines.push(`**Seasonal mechanism:** ${row.seasonalMechanism}\n\n**Annual limits:** ${JSON.stringify(row.annualLimitations)}\n`);
  lines.push('| Anchor | Seasonal value | Basis / confidence | Reason |\n| --- | ---: | --- | --- |');
  for(const a of row.knots)lines.push(`| ${a.monthDay} | ${a.rating.toFixed(1)} | ${a.basis}; ${a.confidence} | ${a.rationale}${refs(a.evidenceIds)} |`);
 }else lines.push(`**Deferral reason:** ${row.deferralReason}\n\n**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.`);
 if(ports[row.cityId]){
  lines.push('\n| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |\n| --- | ---: | ---: | ---: | ---: | ---: |');
  const local=all.filter(r=>r.port===ports[row.cityId]);
  const names=row.speciesId==='lake_trout'?['Lean Lake Trout']:speciesNames[row.speciesId];
  for(let m=1;m<=12;m++){
   const a=summarizeStrata(local,names,y=>y>=2012&&y<=2022&&y!==2020,m),b=summarizeStrata(local,names,y=>y>=2018&&y<=2022&&y!==2020,m);
   const rate=s=>s.catchPer1000AllSpeciesHours==null?'—':s.catchPer1000AllSpeciesHours.toFixed(1);
   lines.push(`| ${m} | ${rate(a)} | ${a.positiveYears}/${a.matchedYears} | ${rate(b)} | ${b.positiveYears}/${b.matchedYears} | ${b.largestYearCatchShare==null?'—':(b.largestYearCatchShare*100).toFixed(1)+'%'} |`);
  }
  if(row.speciesId==='lake_trout')lines.push('\nLake-trout table is the Lean component only; omitted Fat rows have not been imputed.');
 }else lines.push('\nNo comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.');
 lines.push('');
}
lines.push(`## Reproducibility and next phases

- Run \`npm run generate:pier-cast:remaining-seasonal\` for daily, weekly, monthly and coverage artifacts. Weekly bins begin January 1; week 52 includes December 24–31, with December 27 retained as the core-compatible review midpoint. Accepted monthly means include every day; deferred months contain no numerical mean.
- Run \`node scripts/generate-pier-cast-remaining-seasonal-report.mjs\` for this evidence report. Raw snapshots and additional bulletin retrieval checksums are preserved locally.
- Run \`npm run check:pier-cast:remaining-seasonal\`, the existing remaining-species evidence checks, complete PierCast suite, core seasonal replay check and TypeScript checks. Tests establish implementation consistency, not empirical score accuracy.
- Phase 2 researches species thermal responses, audits covered-side/method eligibility for runtime integration, and uses the existing annual interpolator. It must not reinterpret tolerance, spawning temperature, occupancy or growth optimum as bite probability. Deferred pairings remain unavailable unless new evidence resolves their admission.
- Phase 3 reviews the entire annual lineup and overlapping peaks together against the completed four-species scale, without forcing coverage or weakening public gates. Deploy only when runtime/schema changes require it.

**Completion statement:** Phase 1 supplies complete annual research configurations for 16 pairings and documented deferrals for the other 29. Nine of the original 25 discovery candidates remain deferred, along with seven weaker leads and 13 not-established pairings. The historical discovery queue and strict runtime audit are retained as separate artifacts. Empirical annual accuracy and exact-side runtime eligibility are not certified by research completion.

## Sources

All source records include geographic scope, fishing mode, review date and limitations in the linked JSON registers. Bulletin date headings and send dates can differ; phase1-sources.json preserves both where applicable. The retrieval ledger preserves hashes for newly reviewed bulletins. Each source below is cited for its actual scope; no source endorses the proposed numerical ratings.
`);
for(const s of sourceMap.values())lines.push(`[^${s.number}]: [${s.title}](${s.url}). Published ${s.publishedAt??'date not stated'}; reviewed ${s.reviewedAt}. Scope: ${s.geographicScope}. Mode: ${s.fishingMode}. ${s.limitations}`);
const output=path.join(directory,'PHASE1_SEASONAL_RESEARCH.md'),text=lines.join('\n')+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(output,'utf8')!==text)throw new Error('Regenerate Phase 1 report');}else fs.writeFileSync(output,text);
console.log(`${process.argv.includes('--check')?'Verified':'Generated'} 45-pair seasonal evidence report.`);
