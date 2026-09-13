import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir='docs/onboarding/piercast/remaining-species/';
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const config=read('docs/PierCast_Remaining_Species_Temperature_Curves.json');
const eligibility=read(dir+'phase2-eligibility.json');
const sensitivity=read(dir+'phase2-sensitivity.json');
const sources=new Map();
for(const f of config.sourceRegisters){const a=read('docs/'+f);for(const s of Array.isArray(a)?a:a.records)sources.set(s.evidenceId,{...sources.get(s.evidenceId),...s});}
const used=[...new Set([...config.profiles.flatMap(p=>p.evidenceIds), "P2_REGS2026", "P2_MANISTEE_REPRINT2024"])];
const refs=ids=>ids.map(id=>`[^${id}]`).join('');
const pretty=s=>s.replaceAll('_',' ');
const lines=[`# PierCast additional-species thermal calibration and eligibility

## Status

Phase 2 private research integration is implemented with explicit live-activation deferrals. Eight species have provisional thermal sensitivity profiles connected to the owner-only outlook for 14 city/species pairings. The two round-whitefish pairings return their full-year seasonal baselines but no live thermal-combined hypothesis: adult response remains deferred. All nine draft curves remain in offline sensitivity artifacts. None is an empirically fitted adult pier-bite response or an approved live rating. The [machine-readable drafts](../../../PierCast_Remaining_Species_Temperature_Curves.json) preserve every ordinate's calibration basis, rationale and source identifiers.

The eligibility register covers all 16 Phase 1 annual pairings. Three have named covered-structure corroboration, five retain contextual attribution, and eight retain unresolved side attribution. These categories describe the preserved evidence. The Manistee drum newspaper reprint names North Pier, while its linked original DNR report does not name a side; this discrepancy is retained rather than upgrading the primary attribution. All retain temperature-representation and calibration gates. The [eligibility register](phase2-eligibility.json) records each blocking reason.

The four completed species and their seasonal/thermal configuration remain unchanged. The five-city footprint, covered structures, formula, LMHOFS pipeline, caching, daily lock and disabled public catalog remain unchanged. The 29 Phase 1 deferred pairings have no hypothetical combined scores.

## Calibration contract

The variable is normalized **nearshore thermal compatibility**, not the probability of a bite and not the temperature experienced by a fish at depth. This is the same product-calibration interpretation used by the completed core species. Biological evidence constrains plausible direction and breadth. Every numerical ordinate remains a transparent provisional judgment awaiting independent outcome validation.

The formula remains:

\`score = clamp(1, 10, 1 + (seasonal - 1) × (0.30 + 0.75 × thermalFit))\`

The annual seasonal curve owns local fishery strength and timing. No spawning, nighttime, wind, depth, trend or habitat coefficient is added. Temperature cannot make an excluded pairing available, make a seasonal rating of 1 exceed 1, or add more than five percent of seasonal headroom above the seasonal rating.

Cold shoulders remain nonzero because winter activity and reachable cold-season fish are not equivalent to summer growth. A low seasonal rating already represents weak calendar opportunity; the thermal modifier must not silently recreate seasonal exclusions. Conversely, a broad high-fit region does not imply that every fish occupies or feeds optimally at every temperature in it.

Cold-water drafts accept inputs through 26 C; the other drafts through 32 C. Those endpoints are **review-domain choices**, not lethal limits or validated observations. An out-of-domain input returns unavailable. The wider warm-species domain prevents accidental reuse of the core salmonid cutoff, but its warm tail remains an explicit sensitivity hypothesis. Existing core domains are untouched.

## Evidence interpretation

The source hierarchy separates direct angling outcomes, adult habitat observations, agency biological guidance and experimental physiology. No endpoint is silently converted into another. The preserved [Phase 2 source register](phase2-sources.json), [retrieval ledger](phase2-retrieval-ledger.json), earlier thermal inventory and annual source register retain dates, geographic scope, methods and transfer limitations.

The Wisconsin guide study provides a direct smallmouth angling-temperature association, but its river fly-fishing methods and sampled seasons do not establish a pier optimum or winter response. The Escanaba walleye study models air temperature after excluding correlated predictors; its coefficient cannot be substituted for a water-temperature effect. Its successful-trip catch-rate model is also distinct from the probability of any catch.${refs(['P2_WI_GUIDE2017','P2_WALLEYE_CATCH2021'])}

Lake-whitefish loggers recorded a broad range of occupied temperatures, including cold winter water; observed summer means are not selection or feeding experiments. Lake-trout habitat use can be colder than laboratory preference. These observations support broad cold shoulders and caution about treating the lake surface as bottom-water temperature.${refs(['P2_WHITEFISH_REED2023','P2_LAKE_TROUT_HURON2003'])}

The historical GLFC tables distinguish life stages, acclimation, field occurrence and heated-discharge context. The round-whitefish entries are sparse and cannot establish an adult pier-catch optimum. Juvenile drum acute-cold laboratory work describes metabolic responses, not overwintering adult fishing. Catfish post-release movement concerns handling effects; it does not supply a pre-capture bite function.${refs(['P2_GLFC1987','P2_DRUM_COLD2023','P2_CATFISH_RELEASE2025'])}

The largemouth tournament study concerns weigh-in probability in an Iowa lake, including selection by tournament rules and angler behavior. It does not yield an unconditional Great Lakes pier response. General agency activity guidance and independent winter behavior studies constrain the candidate's direction without claiming a measured plateau.${refs(['P2_BASS_TOURNAMENT2022','P2_LARGEMOUTH_DNR','A_BASS_WINTER2008','A_BASS_WINTER2024'])}

## Species-specific candidates
`];
for(const p of config.profiles){
 lines.push(`### ${pretty(p.speciesId)}\n\n**Confidence:** ${p.confidence}. **Disposition:** sensitivity candidate only.\n\n${p.calibrationRationale}${refs(p.evidenceIds)}\n\n${p.limitations}\n\n| Water temperature C | Thermal fit |\n| ---: | ---: |`);
 for(const k of p.curve.knots)lines.push(`| ${k.temperatureC} | ${k.suitability.toFixed(2)} |`);
 lines.push('\nAll listed ordinates are product judgments. The source references constrain interpretation, not exact numerical accuracy.');
}
lines.push(`## Covered structure and fishing mode

A source saying “piers” does not prove which side produced the catch. A closure can strengthen attribution but does not itself prove that a report excludes an unmapped stub or other structure. Those inferences remain visible. Bottom-oriented or sheltered-harbor fishing also requires assessment of whether the frozen lakeward surface cell represents the relevant water; changing curve shape cannot repair an unvalidated water proxy.

The 2026 Michigan guide is preserved and its relevant printed pages 12, 13, 21 and 31 were visually reviewed. Bass catch-and-immediate-release is allowed year-round where fishing is otherwise open; harvest has a separate season. Manistee lake trout (MM 6-8) has year-round possession. Grand Haven's November 1-30 restriction requires one single-pointed unweighted hook no greater than half an inch from point to shank in the pier-head-to-US-31 waters, across species. The rule is not a whitefish-only seasonal exclusion. Great Lakes walleye permissions are not extended to upstream river waters. The review expires March 31, 2027 and is not a live access-closure certification.${refs(['P2_REGS2026'])}

| City | Species | Evaluated covered structure | Attribution status | Private research / live activation |
| --- | --- | --- | --- | --- |`);
for(const r of eligibility.rows)lines.push(`| ${pretty(r.cityId)} | ${pretty(r.speciesId)} | ${r.evaluatedStructureId} | ${r.structureStatus} | ${r.privateResearchDecision}; live deferred |`);
for(const r of eligibility.rows)lines.push(`\n### ${pretty(r.cityId)} — ${pretty(r.speciesId)}\n\n${r.attribution}\n\n${r.fishingMode} ${r.methodConstraint}\n\n**Representation:** ${r.representation}\n\n**Open gates:** ${r.blockingReasons.join('; ')}. Local evidence identifiers and links remain in the [Phase 1 report](PHASE1_SEASONAL_RESEARCH.md) and the eligibility JSON.`);
lines.push(`## Sensitivity review

The [2,889 temperature samples](phase2-temperature-samples.csv) cover each species at 0.1 C intervals through 32 C, retaining unavailable samples outside a curve's domain. The [6,656 weekly scenarios](phase2-weekly-temperature-scenarios.csv) combine the 16 annual curves, 52 weekly midpoints and eight fixed test temperatures (2, 6, 10, 14, 18, 22, 26 and 30 C).

These are **hypothetical test inputs**, not historical water temperatures, forecasts or evidence of winter catches. Both interpolators and the scoring formula are the actual runtime functions. No second implementation of the formula is used. The numerical output provides a review surface for Phase 3, not an independently validated forecast.

The following reports the largest score change caused by a two-degree difference in input at the species' annual seasonal peak. It tests local slope over the accepted domain. It is not a confidence interval, a measured model error or an accepted public-validation threshold.

| City | Species | Seasonal peak | Maximum score change for 2 C |
| --- | --- | ---: | ---: |`);
for(const r of sensitivity.rows)lines.push(`| ${pretty(r.cityId)} | ${pretty(r.speciesId)} | ${r.seasonalPeak} | ${r.maximumScoreChangeForTwoC.toFixed(3)} |`);
lines.push(`## Private runtime integration and Phase 3 handoff

The owner-only outlook includes a separate \`additionalSpeciesResearch\` collection for each city. Ludington has three annual candidates, Grand Haven six, and Manistee seven; Frankfort–Elberta and Sheboygan receive no additions. Each entry preserves structure attribution, method constraints, source identifiers, regulation-review dates and blocking reasons. Fourteen entries carry a provisional surface-temperature sensitivity calculation; the two round-whitefish entries carry seasonal baselines only. Their annual curves remain continuous through December–January.

These results are research hypotheses using the actual hourly interpolation, date windows and unchanged scoring formula. They are not added to \`dates.species\`, headline selection, immutable daily snapshots, the shadow forecast ledger or public catalogs. Scientific gates remain blocked, and targeting eligibility remains unknown. No additional depth, spawning, night or seasonal coefficient has been introduced. Missing coverage and out-of-domain water inputs remain unavailable. Old daily snapshots retain their four-species contract.

Phase 3 should compare the completed four-species lineup and the 16 annual candidates across all 52 weeks, retaining independent species peaks and genuine overlap. Compare the 14 combined hypotheses under matched temperature scenarios; review round whitefish as a seasonal-only deferred case. Do not equate a missing thermal hypothesis with biological absence.

Live activation remains deferred until the retained scientific and structure gates are satisfied. Exact structure uncertainty, adult round-whitefish thermal response, lawful-method whitefish magnitude and the surface-to-fishing-zone transfer cannot be approved by passing software tests or by an annual-lineup discussion. These are explicit limitations, not claims that all species have been onboarded as validated forecasts.

## Reproducibility

Run \`npm run generate:pier-cast:phase2\` to regenerate thermal TypeScript, sampled fits, hypothetical weekly scores and sensitivity data; run \`node scripts/generate-pier-cast-phase2-report.mjs\` for this report. Use \`npm run check:pier-cast:phase2\`, the complete PierCast suite, Phase 1 checks and TypeScript checks for implementation consistency. Passing tests do not establish scientific calibration accuracy.

## Sources
`);
for(const id of used){const s=sources.get(id);if(!s)throw new Error('Missing '+id);lines.push(`[^${id}]: [${s.title}](${s.url??s.urlOrPath}). Published ${s.publishedAt??'date not stated'}; reviewed ${s.reviewedAt??s.accessedAt??'date not recorded in source register'}. Scope: ${s.geographicScope}. ${s.endpoint??s.fishingMode??s.measurementContext??''}. ${typeof s.limitations==='string'?s.limitations:s.limitations?.transferLimit??'Limitations retained in source register'}`);}
const target=path.join(root,dir+'PHASE2_THERMAL_RESEARCH.md'),text=lines.join('\n')+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==text)throw new Error('Regenerate Phase 2 report');}else fs.writeFileSync(target,text);
console.log('Phase 2 nine-species research and 16-pair eligibility report '+(process.argv.includes('--check')?'verified':'generated')+'.');
