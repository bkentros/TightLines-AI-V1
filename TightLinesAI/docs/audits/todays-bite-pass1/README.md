# Today's Bite — Pass 1 completion

Completed September 23, 2026. This is the input-correction and regression-baseline pass. Changes are local; no deployment or production cache invalidation was performed.

## Implemented

- **Location routing:** replaced first-matching, overlapping state rectangles with bundled US Census state polygons. Corrected inland Alabama/Mississippi routing, south Georgia's accidental Florida routing, and the Appalachian precedence issue. The existing state fallback is now reachable. Existing region keys and seasonal tables are retained.
- **Cross-feature state consistency:** the recommender's state/species eligibility gate and engine request use the coordinate-resolved state. When land polygons cannot resolve a state, the recommender retains the supplied state fallback. This avoids identifying Asheville as Tennessee or Tallahassee as Georgia in one feature while using another state in the other feature.
- **Pressure horizon:** use the latest 25 hourly endpoints for a 24-hour interval. The report's pressure summary uses that same window. Older front activity no longer contaminates the current 24-hour pressure score.
- **Pressure timestamps and missing data:** timestamped histories end at the requested day's local noon, or at `fetched_at` for the live fallback. Sorting, omitted hours, DST, and future samples no longer shift the window. Null/zero/nonfinite readings remain missing slots; they cannot pull older readings into the window or fabricate a three-hour swing. A missing forecast-noon pressure scalar no longer borrows today's observation. Legacy untimestamped and sparse inputs retain their positional interpretation; those inputs alone cannot establish their true elapsed sampling interval.
- **Seasonal warmth meaning:** Daily Picks no longer interprets a favorable `very_warm` seasonal band as heat limitation automatically. It uses Today's Bite's existing temperature-score threshold (0.5). Genuine adverse heat conditions and the recommender's species-specific summer trout safeguards remain covered. Favorable warming can now follow the warming branch. No temperature bands, scoring weights, score thresholds, or seasonal catalogs were recalibrated in this pass.

The polygons are generated from the [US Census 2024 cartographic boundary download](https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip). Source checksum and regeneration instructions are in the generated file and generator. These are cartographic land boundaries, not legal offshore jurisdiction boundaries. Exact boundary/offshore points may remain unresolved; broad biological-region routing and the documented recommender fallback still apply. The generated source adds approximately 1.25 MB before bundling/compression.

## Frozen before/after evidence

Original engine commit: `7c245d2ca84f6c4c9d73bd87d45695656ab6ef1e`.

| Evaluation | Original fixtures | Original recommendation sets | Updated recommendation sets |
| --- | ---: | ---: | ---: |
| All 18 regions × 12 months × 4 contexts × forecast offsets 0–6, plus southern September–March scenarios and 25 city probes | 21,880 | 9,216 | 9,252 |
| Raw forecast adapter and snapshot materialization: four southern cities, seven month/year boundaries, four contexts, offsets 0–6, cooling/warming/missing-data profiles | 2,352 | 756 | 882 |
| **Total** | **24,232** | **9,972** | **10,134** |

Both original archives are immutable capture outputs with SHA-256 manifests. The second original archive was generated from an untouched export of the original commit, after implementation had begun. It does not use the changed engine. Full request inputs, normalized factors, scores/bands, explanations, timing, reliability, and final recommendation responses are retained. Candidate files can be regenerated; baseline capture refuses to overwrite originals.

The direct-engine matrix is deliberately synthetic and isolates region/context behavior; city probes hold weather fixed while changing routing. Recommendation generation covers supported exact seasonal rows, two goals and their fixed clarity settings, and deterministic variant-A seeds. Some combinations intentionally have no seasonal row; those are counted, not filled with guessed defaults. The forecast-boundary suite also exercises the measured-water-temperature exclusion for future dates. Session/variant-B behavior is covered by the existing tests, rather than the large replay.

## Comparison results

- **15,664 unaffected reports are exactly unchanged**, including explanations, timing, confidence, and debug output.
- **All 24,232 updated reports exactly match the original report engine given the corrected inputs.** This is a full-object comparison, not a score-only tolerance check. It attributes changes to corrected state/region and pressure inputs, including time-window selection in the adapter.
- **Zero unexplained report or recommendation changes.** Of 10,134 updated recommendation responses, 10,064 exactly match the original recommender given corrected inputs. The remaining 70 occur only where a favorable seasonal `very_warm` temperature previously triggered heat behavior; the verifier requires the corrected response to remove the heat-finesse tag.
- **Zero lost recommendation sets; 162 additional sets** become available after correcting Georgia's regional routing. These are evaluation combinations across species, date, context, and goal, not 162 new catalog items or production users.
- **8,568 complete reports change; 6,670 numerical scores change.** There are 3,322 band changes and 710 timing-surface changes. No reliability tier changes occur in these two matrices. Missing/invalid-pressure behavior is additionally tested directly.
- Of the original 9,972 recommendation sets, **1,784 responses change**, including **1,205 changes to selected lure/fly IDs**. This confirms that the shared-score corrections affect recommendation selection and have been evaluated jointly.

Machine-readable detail: [main comparison](./comparison.json), [forecast-boundary comparison](./boundaries-comparison.json). Their examples include complete before/after temperature and pressure contributions, scenario tags, and selected lure/fly IDs.

Examples of routing corrections:

| Place | Original state / region | Corrected state / region |
| --- | --- | --- |
| Montgomery | AL / Midwest Interior | AL / South Central |
| Jackson | MS / Midwest Interior | MS / South Central |
| Tallahassee | GA / Florida | FL / Florida |
| Asheville | TN / South Central | NC / Appalachian |
| Valdosta | GA / Florida | GA / Southeast Atlantic |
| El Paso | NM / Southwest Desert | TX / Southwest Desert |
| Pittsburgh | WV / Northeast | PA / Northeast |

Scores can increase or decrease after input corrections. For example, the fixed-weather January Montgomery probe moves from 5.3 to 4.8, Asheville from 4.8 to 6.5, and the Florida January pressure-window probe from 6.6 to 6.8. These are controlled synthetic comparisons, not forecasts for those cities on the completion date. For a South Central January day at 65°F mean air, the positive temperature contribution no longer forces heat-finesse recommendation behavior merely because the monthly band is called `very_warm`.

## Validation

**566 tests passed, zero failures**, with type checking enabled. Coverage includes Today's Bite normalization/reporting/timing, forecast-score parity, all-state/DC polygon probes and detached islands, timestamp/DST/gap pressure cases, seven-day month/year transitions, recommender seasonal/catalog integrity, actual heat safeguards, state/species eligibility, and stored-session/refresh behavior.

Two preexisting pressure adapter fixtures used UTC-midnight or mismatched calendar dates while asserting local-noon behavior. Their timestamps now represent their stated local dates. Existing heat-specific recommender tests now supply adverse thermal scores explicitly; new tests separately verify favorable seasonal warmth. The invalid Florida trout endpoint fixture now actually uses Florida coordinates, and a separate test verifies correction of a stale supplied state.

The standard local Deno node_modules mode could not resolve Supabase's transitive OpenAI declaration package. `--node-modules-dir=none` resolved it through Deno's dependency cache; the final endpoint tests ran with full type checking. No application dependencies or lockfiles were changed for this workaround.

Run from `TightLinesAI`:

```sh
deno test --no-lock --node-modules-dir=none --allow-read --allow-env supabase/functions/_shared/howFishingEngine supabase/functions/_shared/recommenderEngine supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/recommender/index.test.ts

deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --boundaries
```

For exact attribution, export the original commit's `TightLinesAI/supabase/functions/_shared` directory with `git archive` into a temporary directory. Pass the absolute path of that exported `_shared` directory:

```sh
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/verify.ts /absolute/path/to/original/_shared
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/verify.ts /absolute/path/to/original/_shared --boundaries
```

## Pass 2 and release handoff

Pass 1's implementation and evaluation are complete. The original [scoring review](../todays-bite-scoring-review-2026-09-23.md) remains the calibration backlog: southern seasonal temperature bands, month-boundary jumps, air-versus-water interpretation, interaction between temperature repairs and supporting weather, pressure weighting, score/activity thresholds, and confidence handling. Those are separate model decisions, not covered by a claim of improved catch prediction here.

Carry both frozen original archives through Passes 2 and 3. Compare the final model against both the original and this Pass 1 candidate to distinguish input corrections from recalibration. Field/catch validation is still needed to establish predictive accuracy; exhaustive guarantees against real-world regression cannot be established from synthetic fixtures alone.

Before production release, coordinate Today's Bite, forecast-scores, and recommender deployment and their separate caches/session versions. Preserve refresh entitlements and decide how retained sessions migrate. No cache version bump or deployment is included in this implementation-only pass.
