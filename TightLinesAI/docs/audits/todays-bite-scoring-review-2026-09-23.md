# Today's Bite scoring review — September 23, 2026

The architecture is reasonable for an explainable fishing-conditions index. Targeted corrections and recalibration are warranted, particularly before relying on fall/winter comparisons across southern fisheries. There is no basis in this review to claim the score is calibrated to catch probability or catch rate. Improving inputs, geographic assignment, and continuity should precede changing global weights or boosting winter scores.

This is a review of the checked-out implementation, not a verification of deployed edge-function versions. No production logic, configuration, or recommender files were changed.

**Cross-feature follow-up:** The dependency review at the end of this document revises the implementation order. Current Daily Picks consumes both the final score and scoring-adjusted thermal fields. Even an activity-only change can alter actual lure/fly selections. Establish the shared condition contract and evaluate both features before broad recalibration.

## Scope and validation

- Traced request construction, region resolution, all seven condition normalizers, weights, production score transformations, timing, report construction, and forecast snapshot paths.
- Read the temperature tables and existing tuning/audit history. The May 14 handoff predates the current V46 production scoring; the May 23 optimism audit documents the later changes.
- Ran the existing engine test directory and normalization label-contract tests: **229 passed, 0 failed**.
- Ran **22,032 synthetic adjacent-month comparisons**: 18 region keys × 4 contexts × 6 starting months (September–February) × 51 temperatures (35–85°F). These are controlled software probes, not representative weather samples or biological validation. Coastal cases use measured water temperature and the engine's regional coastal mappings.
- Added focused probes for actual October 31/November 1 dates, location routing, temperature and cloud boundaries, rain thresholds, source reliability, and pressure-history length.
- The companion [probe script](./todays-bite-scoring-review-probes-2026-09-23.ts) reproduces the numeric examples. Run from the repository root with `deno run --allow-read docs/audits/todays-bite-scoring-review-probes-2026-09-23.ts`.

Unless specified otherwise, probes use stable temperature over three daily inputs, 10 mph wind, 75% cloud, no rain, and 25 pressure readings declining evenly by 3 mb over 24 hours. Coastal probes use 1.3 kt maximum current and stable measured water temperature. These favorable supporting conditions help expose score caps and discontinuities. Scores below use the UI's 0–10 scale; the engine stores integer scores out of 100.

## What the implementation does well

The deterministic engine is shared by report and score-only paths. It separates lakes, rivers, coastal water, and flats/estuaries. It distinguishes measured coastal water temperature from an air proxy, evaluates whether temperature trends improve thermal suitability, penalizes abrupt changes, and avoids treating missing variables as real zero-valued measurements. Several normalizers use continuous ramps. Timing respects actual tide events and includes thermal windows. These foundations should remain.

Base weights are:

| Context | Temperature | Pressure | Wind | Light | Rain/runoff | Tide/current |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Lake/pond | 30 | 20 | 18 | 18 | 14 | — |
| River | 25 | 15 | 14 | 14 | 32 | — |
| Coastal | 14 | 12 | 22 | 10 | 4 | 38 |
| Flats/estuary | 16 | 12 | 24 | 12 | 4 | 32 |

Month and region modifiers adjust these, then available weights are normalized. Production applies additional regional adjustments afterward. Temperature is the largest base term for lakes; runoff and tide/current lead in the other contexts. This is defensible in principle. The fidelity of those inputs matters more than their nominal ranking.

## Findings and recommendations

### 1. Correct geographic assignment before tuning regional bands — high priority

The coordinate resolver always returns a region, including a final `midwest_interior` default. Consequently the state-based fallback in `resolveRegionForCoordinates` cannot rescue uncovered coordinates.

Reproduced results:

| Location | State returned | Region returned |
| --- | --- | --- |
| Montgomery, Alabama | AL | midwest_interior |
| Jackson, Mississippi | MS | midwest_interior |
| Tallahassee, Florida | GA | florida |
| Asheville, North Carolina | TN | south_central |
| Valdosta, Georgia | GA | florida |

Florida-like climate treatment of nearby Georgia could be an intentional policy, but incorrect state labels and Midwest assignment for central Alabama/Mississippi are actual routing defects. South Central selection also precedes some Appalachian overlaps.

Use accurate state boundaries, explicit climate subregions, a real unmatched-coordinate fallback, and city/boundary fixtures. Decide the intended inland Deep South classification deliberately; simply making state fallback reachable does not establish the correct biological calibration.

Code: [stateToRegion.ts](../../supabase/functions/_shared/howFishingEngine/config/stateToRegion.ts), [resolveRegion.ts](../../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts), [usStateBounds.ts](../../supabase/functions/_shared/howFishingEngine/context/usStateBounds.ts).

### 2. Remove calendar discontinuities and revisit absolute thermal suitability — high priority

Temperature ramps are continuous within a monthly row, but monthly rows switch abruptly. Weights and freshwater elite envelopes also vary by month.

Reproduced examples with identical environmental inputs:

- South Central lake, stable **65°F mean air**: **6.8 on October 31 → 9.5 on November 1**. Temperature component changes from −0.225 to +1.76 on the internal −2…+2 scale. Timing stays at the same strength.
- Gulf coastal, stable **74°F measured water**: **6.8 in September → 8.5 in October**. The September table labels this water `very_cold` and assigns −1.8 after normalization; October assigns 0.
- The largest comparison in this controlled grid was a **3.2-point** change for a Southwest Desert river between October and November at 68°F mean air. This is a maximum within the selected grid, not a proven global maximum.

Seasonality is legitimate, but a calendar flip cannot justify these overnight changes. Interpolate thermal suitability across day-of-year, then check weights, elite envelopes, and eligibility gates for residual discontinuities. Interpolation alone cannot repair biologically unsuitable anchors.

Separate **absolute thermal suitability** from **departure from recent/local seasonal conditions**. A temperature that is unusual for September is not automatically biologically very cold. Keep seasonal migration/spawning opportunity as an explicit, modest influence rather than moving all physiological thresholds with the calendar.

Code: [tempBandsFreshwater.ts](../../supabase/functions/_shared/howFishingEngine/config/tempBandsFreshwater.ts), [tempBandsCoastalWater.ts](../../supabase/functions/_shared/howFishingEngine/config/tempBandsCoastalWater.ts), [normalizeTemperature.ts](../../supabase/functions/_shared/howFishingEngine/normalize/normalizeTemperature.ts), [freshwaterEliteEnvelopes.ts](../../supabase/functions/_shared/howFishingEngine/config/freshwaterEliteEnvelopes.ts).

### 3. Improve the freshwater thermal proxy; do not just increase its weight — high priority

Freshwater always uses air temperature, even if the input contains measured water temperature. The usual daily value is `(daily high + daily low) / 2`, not an hourly-derived daily mean. If absent, current air temperature is substituted. Three daily values provide trend/shock information, but there is no explicit water thermal inertia, depth, reservoir-release, groundwater, or spring influence in this scoring path. Lake and river temperature normalization use the same freshwater row.

This is particularly consequential during fall and winter: the model can penalize an air cold front as if fish experienced a comparable water-temperature change, or reward a brief warm spell before deeper water responds. A small pond, large reservoir, spring-fed stream, and tailwater should not respond identically.

Recommended source hierarchy: representative measured water temperature where available; otherwise a validated estimate based on recent weather and waterbody characteristics; otherwise an explicitly lower-confidence air proxy. Do not substitute an arbitrary nearby station without considering waterbody, depth, freshness, and representativeness. Introduce habitat classes and validate lag length rather than asserting one universal air-to-water conversion.

USGS work shows groundwater exchange materially influences stream thermal behavior: [USGS thermal-equilibrium study](https://www.usgs.gov/publications/groundwater-flux-estimation-streams-a-thermal-equilibrium-approach). That supports the need for distinct hydrologic contexts, not any particular proposed coefficient.

Also fix the time contract: the air `day_minus_2` value is two days earlier, but several variables/comments describe its delta as 72 hours. Coastal history actually supplies a 72-hour value to the same slot, including code named for sustained 48-hour shock. Make elapsed time and measurement source explicit before recalibrating trend/shock thresholds.

### 4. Replace regional temperature repair with transparent, continuous calibration — high priority

The active score layer modifies the already-normalized temperature for eight `UNDERPARITY_REGIONS`, including Florida. Eligible temperatures between −1.55 and +0.2 receive up to +1.35; a wide interval is flattened to +0.45. Negative temperature weight can also be reduced while favorable wind/light/tide weights increase. These altered weights are not renormalized afterward.

This repairs a distribution issue without resolving its underlying temperature assumptions. Eligibility depends on rain and other conditions, so adding rain can change the reported thermal component despite unchanged temperatures.

Reproduced Florida lake examples:

- November, **58.77°F → 58.78°F**: final score **6.1 → 6.9**, because the regional repair turns on.
- November, stable 65°F: thermal component **−0.99 → +0.36** after repair; final score 8.3 under the stated favorable supporting conditions.
- November, stable 68°F, **0.999 → 1.000 inches of 72-hour rain**: **7.1 → 6.4**. The thermal component simultaneously changes from +0.45 back to −0.36. This is several interacting rules, not merely rain's weighted contribution.

The current score also includes curve lifts, timing lifts, Prime bumps, a bridge to 80, tail lifts, and a final floor at the legacy score for non-shutdown cases. That floor means a later cap or downward adjustment is not necessarily authoritative. Simplify to calibrated factor curves, a transparent aggregation, and a small set of final policies with clear precedence. Preserve provenance of any interaction and expose it in diagnostics. Do not remove all safeguards or the regional repair blindly before comparing replacement behavior.

The existing May 23 audit explicitly accepted remaining severe-thermal Good cases with conservative copy. They are documented product tradeoffs, not newly discovered unexplained failures. Revisit them using outcomes rather than score-distribution parity alone.

Code: [scoreDay.ts](../../supabase/functions/_shared/howFishingEngine/score/scoreDay.ts), especially `adjustV43NormalizedTemperature`, `v43WeightFor`, `applyV43Caps`, and the final legacy floor.

### 5. Correct pressure time windows, then challenge pressure's influence — high priority

The request builder normally supplies **48 hourly readings**, while `normalizePressureDetailed` subtracts first from last and labels the result `mb/24h`. Its range tests also use the whole supplied window. The rolling three-hour test uses a different, shorter window.

A constant decline of 3 mb per 24 hours reproduces:

| Supplied history | Reported change | Pressure component | November South Central lake score |
| --- | --- | ---: | ---: |
| 25 hourly readings | −3.0 mb/24h | +1.15 | 9.5 |
| 48 hourly readings | −5.9 mb/24h | −0.1917 | 8.7 |

Use timestamped samples or an explicitly contracted cadence, compute genuine 24-hour and three-hour windows, and handle gaps without compressing time.

After fixing that, shadow-test a smaller pressure contribution. Twenty percent base weight for lakes is a strong assumption, especially alongside correlated wind, clouds, rain, and temperature-front penalties. Evidence does not establish a universal falling-pressure advantage: an original single-lake study found no significant pressure/catch-rate correlation, which is a reason for caution rather than proof that pressure never matters. [Burkett's original thesis](https://thekeep.eiu.edu/theses/3035/).

Code: [buildFromEnvData.ts](../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts), [normalizePressure.ts](../../supabase/functions/_shared/howFishingEngine/normalize/normalizePressure.ts).

### 6. Make winter sunlight response continuous and habitat-aware — medium/high priority

Freshwater clear-sky penalties are neutralized only for the discrete `cool`/`very_cold` labels and only through 25% cloud. Immediately above that cloud threshold the negative branch resumes. Crossing a temperature label can also turn the full sun penalty on abruptly.

Reproduced examples:

- South Central January lake at 40°F: cloud **25.00% → 25.01%** changes score **6.0 → 5.4**.
- Florida January lake with clear sky: air **62.00°F → 62.01°F** changes score **7.2 → 6.8**, as light changes from neutral to −1.

Use continuous thermal/light interactions. Consider warming potential, hourly exposure, water depth and clarity where known. Sunny winter afternoons can be productive, but a blanket winter sunshine bonus would be another oversimplification. The existing temperature timing lane is useful; its selected window and the daily light score should tell a consistent story.

Code: [normalizeLight.ts](../../supabase/functions/_shared/howFishingEngine/normalize/normalizeLight.ts), [evaluateTemperatureWindow.ts](../../supabase/functions/_shared/howFishingEngine/timing/evaluators/evaluateTemperatureWindow.ts).

### 7. Distinguish favorable conditions from confidence — medium priority

A coastal air fallback downgrades reliability, which caps the score at 72. A measured-water version of the 70°F January Florida coastal fixture scores 8.6; its air-only version scores 7.2. This is partly different source-specific thermal calibration and partly the confidence ceiling. It must not be presented as pure environmental deterioration.

Conversely, a freshwater fixture with only current air temperature and no daily mean/history can still be rated high reliability and score 8.3. Availability-count reliability does not fully reflect thermal source quality or forecast uncertainty.

Keep the prohibition against reusing today's measured water temperature as a future observation. Review source transitions across forecast days and distinguish estimated conditions from confidence, including forecast lead time. Report/score parity is meaningful only for equivalent inputs; the code deliberately supports both live and calendar-day profiles.

Code: [buildNormalized.ts](../../supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts), [forecastSnapshot.ts](../../lib/forecastSnapshot.ts).

### 8. River flow, wind exposure, and coastal tide proxies deserve the next pass

The river's largest base factor is a rainfall proxy, not measured discharge, stage, turbidity, dam operation, or upstream basin rainfall. Dry local weather is rewarded as `perfect_clear`, even though low flow is not necessarily beneficial. Improve hydrology inputs before making this factor more influential; keep honest uncertainty when it is only inferred.

Wind uses speed and broad context, without fetch, exposure, direction relative to shore, or shelter. Current/tide normalization sensibly has a source hierarchy, but uses universal speed/range thresholds across very different coasts. Local tide range and actual flow are not interchangeable. A station's strongest movement is not necessarily the angler's best accessible fishing window.

These are model limitations rather than evidence that every current score is wrong. Prioritize measured river conditions, source-aware coastal calibration, and wind exposure where data supports them. Audit correlated front penalties to avoid repeatedly charging for the same event.

## Southern fall/winter calibration priorities

1. **Florida:** separate Panhandle/north Florida, central peninsula, and subtropical south Florida at least in evaluation. Avoid treating largemouth, crappie, and peacock-oriented fisheries as one thermal response. FWC reports bass spawning as early as January in extreme south Florida and as late as May in the Panhandle: [FWC black bass guidance](https://myfwc.com/fishing/freshwater/sites-forecasts/black-bass/).
2. **Texas:** retain meaningful coastal/inland distinctions, but evaluate upper versus lower coast and north/east reservoirs versus southern systems. Do not interpret a colder bass pattern as poor fishing for every target.
3. **Alabama, Mississippi, Louisiana:** fix routing gaps first; distinguish inland reservoirs, large rivers, coastal marshes, and brackish water.
4. **Georgia/Carolinas/Tennessee:** distinguish upland coldwater/tailwater fishing from lowland warmwater reservoirs. Existing rectangles and a shared freshwater curve are too broad to represent both well.

Regional bands need deeper review, but species/habitat groups and real water conditions are more informative than increasingly small geographic boxes alone. Start with regional evaluations and a few meaningful fishery classes; a species-specific public score would be a separate product decision.

FWC lists different preferred feeding ranges for largemouth bass, striped bass, and catfish, and cautions that preferred ranges vary: [FWC temperature guidance](https://myfwc.com/fishing/freshwater/fishing-tips/temperatures/). Preferred feeding, spawning, thermal stress, and hook-and-line catchability should not be collapsed into one threshold. TPWD documents winter opportunities for large blue catfish: [TPWD winter field study](https://tpwd.texas.gov/newsmedia/releases/?req=20091218d). These sources support differentiated behavior, not precise replacement scoring bands.

## Recommended order of work

1. Correct geographic routing and pressure time windows; add focused geographic and cadence regression coverage.
2. Eliminate month, light-label, and regional-repair discontinuities. Evaluate all final-score policies together, including legacy-floor interactions.
3. Improve thermal source quality and source/time contracts; shadow-test continuous day-of-year curves and a small number of habitat/fishery classes in the priority southern regions.
4. Reassess pressure weight, rainfall-derived river flow, coastal source transitions, and confidence caps after input corrections. Do not tune several interacting layers at once.
5. Backtest on held-out locations and dates, especially September–March cold-front sequences. Use representative water observations and effort-adjusted catch logs where available; agency reports can provide qualitative checks but are not an unbiased catch dataset. Include unsuccessful trips, angler effort, target, access, and method to reduce selection bias.

Success means stable behavior for nearly identical inputs, sensible rankings through actual front/cooling/recovery sequences, and better association with observed fishing outcomes. Equal Prime percentages across regions or passing synthetic fixture tests are insufficient evidence of accuracy. Keep the score framed as an explainable conditions index until outcome calibration supports stronger claims.

## Cross-feature follow-up: Today's Bite and lure/fly Daily Picks

### Verified dependency path

The active recommender endpoint builds the shared request with `buildSharedEngineRequestFromEnvData`, using the calendar-day profile. Daily Picks runs `analyzeRecommenderConditions` → `analyzeSharedConditions` → the same Today's Bite normalization, timing, and scoring. It does not simply read a displayed score from the UI.

`buildDailyScenario` then consumes:

- **Final score:** activity is suppressed at ≤35, neutral at 36–69, and active at ≥70. The declared `high_opportunity` type is not emitted by this mapping. Score ≥80 also enables certain March/April bass surface exceptions.
- **Temperature:** band, trend, shock, and the scoring-adjusted thermal component; trout additionally checks daily high air temperature.
- **Light:** normalized category, not its numeric score directly.
- **Runoff:** normalized category, which affects current/dirty-water/streamer tags.
- **Wind:** a separate 05:00–21:00 hourly average when available, otherwise the normalized request wind. It does not directly consume the numeric Today's Bite wind contribution.
- **Pressure:** category is retained as `pressure_mode`, but current candidate ranking/selection has no direct consumer of that field. Pressure affects picks primarily through composite-score changes.
- **Reliability:** recommender confidence inherits it, with further missing-input adjustments. Confidence alone is not a current candidate-scoring input; reliability can still change picks indirectly through Today's Bite score policies.
- **Region/species/month/context:** exact authored seasonal row, controlling allowed depths, paces, forage, candidate IDs, and seasonal surface eligibility.

Activity, thermal mode, condition tags, and surface eligibility feed candidate filtering/backfill, candidate scores, deterministic selection, explanations, and the recommender's color-family guidance. Lures and flies use the same scenario and pipeline, with their own catalogs and rules. Therefore unchanged recommender source files do **not** imply unchanged recommendations.

Code: [sharedAnalysis.ts](../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts), [buildDailyScenario.ts](../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts), [buildCandidatePool.ts](../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts), [scoreCandidate.ts](../../supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts), [selectDailyPicks.ts](../../supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts).

### Controlled downstream probes

The companion [cross-feature probe script](./todays-bite-cross-feature-review-probes-2026-09-23.ts) isolates changes without editing production logic. It holds normalized conditions, date, species, clarity, goal, row, and selection seed fixed while overriding only the composite score. It evaluates January, March, and November in Florida, Gulf Coast, South Central, and Southeast Atlantic, three clarity settings, two goals, and four species groups. Of 288 attempted fixtures, 180 have exact seasonal rows; 108 missing-row combinations are skipped, not treated as engine defects. These are direct engine fixtures, not authenticated endpoint tests or a representative production distribution.

| Score-only change, UI scale | Cases | Cases with at least one changed selected lure/fly | Changed candidate pools | Changed surface gate |
| --- | ---: | ---: | ---: | ---: |
| 3.5 → 3.6 | 180 | 43 | 30 | 30 |
| 6.9 → 7.0 | 180 | 93 | 36 | 0 |
| 7.9 → 8.0 | 180 | 36 | 36 | 36 |
| 7.5 → 7.6 | 180 | 0 | 0 | 0 |

These counts demonstrate coupling, not the prevalence of future production changes or whether a changed pick is better. The same seed prevents user/day rerandomization from confounding the comparisons.

Examples:

- Florida January largemouth, clear water, all-purpose: 6.9 → 7.0 changes the selected lures from weightless stick worm / Texas-rigged craw to Texas-rigged craw / drop-shot minnow. Both selected flies change too. Temperature, tags, and surface gate remain unchanged; activity-dependent candidate scoring is enough.
- Gulf March largemouth: 7.9 → 8.0 enables the southern March surface exception and changes the selected lure to a popping topwater in the fixture. This is an explicit eligibility effect, not just an activity badge.
- Florida November at 60°F mean air: restoring only the temperature component from its regional-repair value to −1.44, while holding the composite score fixed at 6.8, changes thermal mode from stable to cold/slow. Lure and fly selections change. Removing regional repair therefore needs a thermal-contract review as well as score-distribution review.
- Confidence-only and pressure-label-only interventions leave selected picks unchanged in the focused fixture, as expected from the consumer code. Confidence display and stored pressure mode change respectively.

### Newly identified priority: seasonal warmth is being interpreted as heat stress

South Central January, stable 65°F mean air, has a positive thermal contribution (+1.31), but its monthly band is `very_warm`. The recommender maps any `very_warm` band to `heat_limited` before examining the positive contribution, season, or species-specific thermal evidence. This produces `heat_finesse` for largemouth, pike, and trout fixtures. Gulf January at 75°F mean air shows the same problem for largemouth.

Changing only the label in a sensitivity probe removes the heat designation. The selected picks happen to stay the same in that particular fixture; the tags do change, and other candidate rules consume those tags. This is a demonstrated semantic mismatch, not proof that every resulting pick is wrong. A new label is not itself the proposed fix.

Define separate fields for absolute thermal suitability/stress, recent trend/shock, and seasonal anomaly. A warm winter day must not become biological heat stress solely because it is warm relative to January. Do not repurpose existing labels or switch from air to water units without updating consumers. Existing timing and narration also depend on these labels.

### Effect of the original recommendations

| Proposed change | Today's Bite | Lure/fly recommender | Assessment |
| --- | --- | --- | --- |
| Fix incorrect region mapping | Changes thermal rows, weights, timing, and score | Changes seasonal row, allowed depth/pace/forage/surface options, score-derived activity, and deterministic selection inputs | Beneficial correction; high downstream impact that must be reviewed |
| Add finer southern thermal regions | Can improve local calibration | New shared region keys can lack exact seasonal rows and return `seasonal_row_missing` (422) | Prefer a thermal subregion mapped to existing biological regions initially, or author full matrix coverage before routing |
| Smooth monthly temperature/score curves | Removes artificial daily jumps | Changes activity and thermal signals; separate monthly seasonal-row switches still remain | Beneficial; evaluate both calendars. Do not blindly interpolate lure IDs or remove seasonal hard gates |
| Use measured/estimated freshwater water temperature | Better thermal representation if validated | Changes cold/heat/warming behavior, surface decisions, scores, and potentially picks | High potential benefit; shared source/time/units contract required |
| Remove regional temperature boosts | Cleaner calibration and fewer threshold jumps | Can expose stronger cold-slow behavior even with the composite score held fixed | Conditional benefit; replace the curve and update biological interpretation together |
| Correct pressure history; later reduce pressure weight | Corrects a time-window defect; changes score | Can cross activity/surface thresholds; pressure label alone is not directly ranked | Correct window first, then test weight changes separately |
| Improve winter light scoring | Removes numeric/label discontinuities | Numeric-only changes act through the score; label changes additionally affect tags, surface eligibility, explanations, and color family | Beneficial if physical illumination is kept distinct from whether light helps fishing |
| Improve river flow/runoff | Replaces a high-weight rainfall proxy with better evidence | Can switch streamer/current/vibration tags, colors, and both lure/fly rankings | Potential benefit; distinguish measured flow, clarity, and inferred runoff rather than treating them as equivalent |
| Change wind scoring | Can better represent exposure/usability | Numeric changes act through score; direct surface gates use their own wind measurement/thresholds | Coordinate measurement definitions; do not assume modifying score curves changes the hard wind gate |
| Separate confidence from opportunity | Makes uncertainty more honest | Confidence display can change independently; removal of score caps may still change activity and surface eligibility | Beneficial design direction; do not turn lower confidence into a physiological activity signal |
| Coastal-only tide/water-band changes | Affect coastal/flats scores and timing | No direct effect on the current freshwater-only live recommender if freshwater/shared behavior is preserved | Most isolated workstream |
| Summary wording / purely visual score formatting | Presentation changes | No direct effect on pick math | Isolated only when normalized fields, score, and timing strength remain unchanged |

### Features beyond these two

The direct numerical consumers found are Today's Bite reports, forecast/dashboard scores, and Daily Picks. Today's Bite timing and narratives are also affected, including score changes caused by timing-strength lifts. The standalone Color Picker, River Run, Pier Cast, and Water Reader engines do not directly import this scoring pipeline in the inspected paths. The color guidance embedded inside Daily Picks **does** depend on its shared scenario.

This isolation applies to changes scoped to `howFishingEngine` and its consumers. Changes to shared weather acquisition, location services, payload schemas, or units need a fresh broader dependency review; they should not be assumed isolated.

### Revised implementation order and release checks

1. Define the shared condition contract and correct the seasonal-warmth/heat-stress interpretation. Keep physical/biological condition fields separate from score-distribution repairs.
2. Fix region routing and pressure windows in separate changes, each with joint score-and-pick comparisons. Check seasonal-row coverage before activating corrected/new mappings. The recommender also uses client-supplied state for species validation, so fixing only the shared region resolver does not guarantee state-gating parity.
3. Introduce a species-aware activity signal for recommendation decisions, or explicitly recalibrate the existing score-to-activity mapping during transition. The aggregate opportunity index includes fishability and uncertainty; it should not be the sole proxy for feeding activity. Keep both features on the same underlying facts and explain legitimate differences.
4. Recalibrate thermal curves, seasonal continuity, light, and hydrology incrementally. Preserve species/context/pace/depth/surface eligibility rules unless separately justified. A better winter day can still call for a slow subsurface presentation.
5. Compare final outputs with the same date, seed, snapshot, user goal, clarity, and species: score/band, activity, thermal state, candidate pools, selected lure/fly IDs, surface gate, pace/depth, explanations, and embedded colors. Exercise score boundaries 35/36, 69/70, 79/80, monthly transitions, source changes, missing data, and all southern cold-front/recovery cases.
6. Coordinate deployment and caches. Recommender daily sessions store generated responses and key on an explicit engine version; existing sessions can retain older picks. Today's Bite client caches and forecast snapshots have separate versions. Deploy shared-code changes to all three edge consumers and use a coordinated version/invalidation or next-day migration plan, preserving daily-session/refresh entitlements. Validate both fresh and retained sessions to prevent mixed-version reports and picks.

Validation for this follow-up: **283 recommender-engine tests and 14 daily-session tests passed**. The endpoint test suite was attempted but could not type-resolve the locally missing `npm:openai@^4.52.5` dependency referenced by Supabase's edge-runtime declarations; it did not execute. No dependency installation or production-code change was made. The historical “activity-tier only” audit conclusion must not be treated as evidence that current selections are unaffected: the active Daily Picks engine uses activity in candidate pools and ranking.

## Pass 1 implementation follow-up

The foundation corrections and joint before/after evaluation are complete. See the [Pass 1 completion report](./todays-bite-pass1/README.md) for the geographic, pressure-window, and seasonal-warmth fixes; immutable original baselines; exact attribution of changed reports and recommendations; and the remaining Pass 2 calibration work. The measurements earlier in this review describe the original engine and are retained as historical evidence.

## Pass 2 implementation follow-up

Seasonal calibration and joint recommendation evaluation are complete locally. See the [Pass 2 completion report](./todays-bite-pass2/README.md) for the implemented thermal/source/light/score changes, retained pressure and activity decisions, 580 passing tests, three-generation replay comparisons, and coordinated-release handoff. Earlier findings above describe the historical engine; Pass 2's synthetic evidence demonstrates consistency improvements, not validated catch prediction.

## Pass 3 local release-preparation follow-up

The [Pass 3 report](./todays-bite-pass3/README.md) records cache revisioning, in-place session regeneration without refreshed entitlements, DST expiry and raw-provider daily-date corrections, and final replay parity with Pass 2. Broader real-provider winter downloads and production rollout remain explicitly uncompleted; see that report for evidence and release/rollback steps.

## Expanded provider evaluation follow-up

The approved retry completed the [nine-city fall/winter evaluation](./todays-bite-pass3/regional-evaluation.md): 756 reports and 1,764 recommendation sets, with improved average calendar stability and no favorable-warmth heat conflicts. It also found one remaining nine-point Prime cutoff regression in Brownsville. That issue is documented and uncorrected; the broader download blocker is resolved, but release readiness and production rollout are not complete.

## Final corroboration correction

The [remaining cutoff correction](./todays-bite-pass3/corroboration-fix/README.md) resolves Brownsville’s nine-point calendar cliff while preserving the Prime corroboration safeguard. The final regional maximum is two points; all 591 engine/session/provider tests and three client-cache tests pass. Deployment and on-device validation have not been performed. Earlier unresolved-issue descriptions are historical.
