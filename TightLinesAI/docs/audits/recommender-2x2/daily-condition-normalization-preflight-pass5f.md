# Daily Condition Normalization Preflight - Pass 5F

Date: 2026-05-08

Scope: documentation/design audit only. No recommender runtime behavior, catalog profiles, seasonal rows, frontend UI, migrations, or tests were changed in this pass.

Historical note: this audit was written before daily-picks 2x2 became the live backend default. The implementation notes below preserve when each layer was still parallel-only; after Pass 8F/9C, the daily-picks scenario, pool, scoring, selector, session, and response layers are the active production recommender path.

## Pass 6A Implementation Note

Pass 6A implemented the first parallel version of this layer at `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts`, with focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/dailyScenario.test.ts`. The builder is pure and was not wired into the production 3:3 recommender runtime at that pass. It preserves request metadata and `recommendation_goal`, maps shared condition analysis into explicit activity, light, wind, thermal, runoff/water-movement, and pressure modes, emits bounded catalog `ConditionTag` scenario tags, tracks missing inputs/confidence, and treats missing wind conservatively instead of silently converting it to calm. The live 2x2 candidate pooling/scoring now consumes this builder rather than reinterpreting raw weather inputs.

Pass 6A.1 tightened `current_swing` semantics before candidate scoring consumes the tag. Breezy river wind alone no longer emits `current_swing`; the tag now requires `freshwater_river` plus elevated/dirty or blown-out runoff-derived water movement. Trout `runoff_streamer` remains trout-specific and continues to pair with `current_swing` only when the runoff signal supports both.

Pass 6B added the first parallel 2x2 pool/scoring foundation at `supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts` and `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`, with focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts`. The pool starts only from row-authored IDs and hard-gates catalog existence, side, species, water type, row exclusions, row column/pace envelope, and seasonal-plus-daily surface eligibility. It deliberately treats `clarity_strengths` as scoring fit only, not a hard gate. Scoring consumes `DailyScenario` and catalog/row metadata only; it does not read raw weather, apply recent-history/variety, select final 2x2 picks, or call the current 3:3 rebuild selector.

Pass 6B.1 added row/scenario identity protection before future selector work consumes these pools. `DailyScenario` now carries `region_key` and `month`, and both `buildCandidatePool` and `scoreCandidate` assert that the seasonal row matches scenario species, region, month, and water type. Mismatches throw explicit errors instead of silently producing misleading empty pools or scores.

Pass 6C added the parallel 2x2 selector and variety layer at `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts`, with focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts`. It consumes scored candidates only, returns Lure/Fly of the Day plus honorable mentions, rejects sides with fewer than two unique candidates, never borrows fallback inventory, keeps intrinsic catalog profile fields unchanged, rotates deterministically by seed/date/goal/variant inside a quality band, and supports future Set B avoid-ID preferences. It remains unwired from production and does not generate response copy.

Pass 6D added the parallel internal assembly runner at `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts`, with focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts`. The runner accepts an explicit seasonal row, builds `DailyScenario`, builds the hard-gated candidate pool, scores every pooled lure/fly, runs the 2x2 selector, and returns an internal result with diagnostics. It deliberately does not resolve seasonal rows, mutate sessions/history, pick colors, produce public API copy, or wire into the current production 3:3 recommender endpoint.

Pass 6E added the parallel 2x2 response shaper at `supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts`, with focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts`. It defines a local future response type for the daily-picks path, preserves selected catalog identity/column/pace/surface fields, emits four named slots, passes through compact diagnostics and scenario summary, and creates deterministic factual copy from score reasons plus actual scenario state. It intentionally omits color selection for now and does not import old 3:3 copy helpers, public contracts, or production adapters.

Pass 6E.1 tightened response copy consistency before adapter/session work consumes the shaper. Goal-fit copy now checks `scenario.recommendation_goal` before using goal score reasons, so stale contradictory all-purpose or big-fish reasons cannot leak into `why_chosen`. How-to-fish copy variant selection now uses `result.diagnostics.variant` as the only variant source.

Pass 6F added the parallel daily-picks surface adapter and exact seasonal resolver at `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts` and `supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts`, with focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksSurface.test.ts`. The resolver reads generated v4 rows directly and requires an exact species/region/month/water match with no region fallback, month borrowing, or state-scoped override. The adapter can accept injected shared analysis for deterministic tests, otherwise uses the existing shared condition analyzer, then runs the exact row through the daily-picks engine and response shaper. It remains unwired from production and does not touch session storage.

Pass 6G added the parallel daily-picks session layer at `supabase/functions/recommender/dailyPicksSession.ts`, with focused tests at `supabase/functions/recommender/dailyPicksSession.test.ts`. It uses the existing `recommender_daily_sessions` table shape under a distinct engine version, stores 2x2 response JSON in variant A/B columns, adds local generated/cache/session metadata, keeps the key goal-aware, returns stable Set A, generates one Set B with Set A lure/fly IDs passed as avoid IDs, locks refresh afterward, and mirrors production-style race handling. This module is now wired as the live recommender session path. The existing `recommendation_goal` migration remains a deployment prerequisite for new environments.

Pass 6H added an explicit internal preview gate inside `supabase/functions/recommender/index.ts` using `x-recommender-preview: daily_picks_2x2`, with focused tests in `supabase/functions/recommender/index.test.ts`. At that pass, the preview branch ran after normal auth, subscription, body validation, and request-building, then called `resolveDailyPicksSession` with the validated request and existing refresh semantics while the default no-header path still returned the old production 3:3 response. After Pass 8F, no-preview requests also return daily-picks 2x2 by default; the preview header remains backward-compatible.

## Executive Summary

The current recommender already receives useful daily weather signals through the shared How's Fishing pipeline, but tactical interpretation is split across several places:

- `supabase/functions/recommender/index.ts` maps raw `env_data` into the shared condition request and preserves `hourly_wind_speed` for the recommender.
- `supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts` produces the shared normalized condition analysis and How's Fishing score.
- `supabase/functions/_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts` turns that score into an `aggressive | neutral | suppressive` regime, computes daylight wind, derives tactical modes, and passes condition state to selection.
- `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts` uses regime and surface wind blocking to build the current three abstract target slots.
- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts` activates a small set of condition-window boosts.
- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts` applies those boosts as scoring bonuses, not hard gates.

For the future 2x2 engine, daily conditions should be normalized once into a compact `DailyScenario` object before candidate scoring. Seasonal rows should answer "is this presentation biologically credible for this species/region/month/water type?" Daily scenario should answer "which credible presentations rise today?" Variety should rotate among strong valid alternatives without breaking either gate.

## Current Available Daily / Weather Inputs

The edge function expects `env_data` in the same shape as the How's Fishing environment payload. `buildSharedEngineRequestFromEnvData` currently extracts these inputs for shared normalization:

| Input family | Current fields used | Notes |
|---|---|---|
| Location/date | `latitude`, `longitude`, `state_code`, resolved `region_key`, `local_date`, `local_timezone` | Region can be refined by altitude and latitude rules in `howFishingEngine/request/buildFromEnvData.ts`. |
| Air temperature | `weather.temperature`, `weather.temp_7day_high`, `weather.temp_7day_low`, `hourly_air_temp_f` | Calendar-day profile is used for today's recommender request, so today behaves like forecast-day scoring rather than live-now jitter. |
| Measured water temperature | `measured_water_temp_f`, `measured_water_temp_24h_ago_f`, `measured_water_temp_72h_ago_f`, source label | Supported by shared normalization when present, especially valuable for archived validation later. |
| Pressure | `weather.pressure`, `weather.pressure_48hr`, `hourly_pressure_mb` | Today uses a noon-anchored pressure window when the recommender calls shared build with `useCalendarDayProfileForToday: true`. |
| Wind | `weather.wind_speed`, `weather.wind_speed_unit`, `weather.wind_speed_10m_max_daily`, `hourly_wind_speed` | The edge preserves raw `hourly_wind_speed` because shared normalized output only keeps scalar wind. Rebuild wind uses local 5 AM-9 PM hourly mean when available. |
| Light/cloud | `weather.cloud_cover`, `hourly_cloud_cover_pct`, sunrise/sunset in env | Shared normalization currently reduces cloud/light to a daily label. Hourly cloud exists for timing but is not yet a recommender-specific tactical window. |
| Precipitation/runoff | `weather.precipitation`, `weather.precip_48hr_inches`, `weather.precip_7day_daily`, `weather.precip_7day_inches` | River runoff requires 24h, 72h, and 7d totals together; partial river precip is intentionally omitted with a data gap. |
| Tide/current | tide phase, high/low events, max current speed, optional hourly tide height | Normalized for shared coastal contexts. Current recommender scope is freshwater species/water types, so this is not active in current production recommender picks. |
| Sun/solunar | `sun.sunrise`, `sun.sunset`, solunar major periods | Used by shared timing/narration paths, not directly by current lure/fly candidate scoring. |

## Current Normalized Fields And Recommender Entry Points

Shared normalization produces `SharedNormalizedOutput` in `howFishingEngine/contracts/normalized.ts`:

| Normalized field | Current labels/details | Where recommender uses it today |
|---|---|---|
| `temperature` | band, trend, shock, metabolic context, measurement source | `runRecommenderRebuild.ts` maps band/trend/shock into `ThermalMode` for the diagnostic `dailyTacticalProfile`. Current condition-window selection does not directly use `thermal_mode`. The How's score uses temperature via shared scoring and therefore indirectly affects regime. |
| `pressure_regime` | pressure state/score/detail | Contributes to How's score, which maps to current daily regime. Not exposed as an explicit lure/fly tactical tag. |
| `wind_condition` | scalar wind label/score | Contributes to How's score. Separate recommender wind handling uses `hourly_wind_speed` or normalized `wind_speed_mph` to compute daylight wind and surface blocking. |
| `light_cloud_condition` | labels such as `bright`, `glare`, `low_light`, `heavy_overcast`, `mixed` | Used for color decision and mapped with water clarity into `ClarityLightMode`. Active condition windows currently use only `water_clarity`, `wind_band`, and regime for clear-subtle lure boosts. |
| `precipitation_disruption` | lake/coastal precip disruption label/score | Contributes to How's score for lake contexts. Not directly mapped to recommender candidate tags today. |
| `runoff_flow_disruption` | river runoff labels such as `perfect_clear`, `stable`, `slightly_elevated`, `elevated`, `blown_out` | Mapped into `RunoffMode`; trout river elevated/dirty or blown-out runoff activates a streamer fly boost. |
| `tide_current_movement` | coastal movement label/score | Not active in the current freshwater recommender path. |
| `available_variables`, `missing_variables`, `data_gaps`, `reliability` | coverage and confidence metadata | Available through shared analysis but not currently used to reduce recommender confidence, disable condition claims, or shape candidate ranking. |

Current live recommender flow:

1. `supabase/functions/recommender/index.ts`
   - Validates request.
   - Builds a shared request with calendar-day profile behavior for today.
   - Builds `engineReq.env_data` from shared normalized environment plus raw hourly wind.
2. `supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts`
   - Calls `analyzeSharedConditions`.
3. `supabase/functions/_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts`
   - Resolves the seasonal row.
   - Converts How's score to `DailyRegime`.
   - Computes local daylight mean wind and `WindBand`.
   - Computes seasonal+daily surface availability.
   - Builds current `lureConditionState`, `flyConditionState`, and `dailyTacticalProfile`.
4. `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts`
   - Converts row baseline plus regime into three target column/pace slots.
   - Removes surface only when `computeSurfaceBlocked` sees a seasonally legal surface row and daylight wind over 14 mph.
5. `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
   - Chooses one active lure window and one active fly window.
6. `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
   - Adds condition-window scores to matching candidates.
   - Does not narrow the pool by condition window.
   - Still selects three lures and three flies from abstract slot profiles.

## Current Gaps / Risks

| Area | Current risk | Why it matters for 2x2 |
|---|---|---|
| Scattered daily interpretation | How's score, daylight wind, light/clarity, runoff, and condition windows are interpreted in separate files. | Future scoring should not rediscover or reinterpret raw weather in each lure/fly scoring branch. |
| Regime is too coarse | A single `aggressive | neutral | suppressive` label drives the current target geometry. | Big-fish vs all-purpose, clear-bright subtle days, runoff streamer days, windy reaction days, and heat finesse days need separate tags, not only a score bucket. |
| Surface daily gate is mostly wind-only | Surface is daily-blocked only when seasonally legal surface has daylight wind above 14 mph. | Future topwater should require both seasonal surface truth and daily surface suitability, including light, wind, temperature mode, and species-specific context. |
| Daily wind fallback can become permissive | `meanDaylightWindMph` returns 0 when hourly wind is present but unusable/empty and no normalized scalar fallback exists. Existing tests lock this behavior. | Missing wind can accidentally look calm. The future scenario needs explicit confidence/missing-input status, not silent calm. |
| Condition windows are boosts, not scenario tags | Current windows add weight but leave candidate pools broad. | This is acceptable in the 3:3 bridge, but the 2x2 engine should make condition fit an auditable scoring dimension. |
| Light/cloud is underused tactically | Light informs color and clear-subtle only indirectly. | Low-light surface, clear-bright subtle, and heat/bright midday avoidance should be explicit daily tags. |
| Temperature mode is diagnostic | `thermal_mode` exists in `dailyTacticalProfile` but does not currently activate lure/fly windows. | Cold-slow, warming-search, and heat-finesse tags from Pass 4A need a daily scenario source. |
| Goal is not connected to condition ranking | `recommendation_goal` is in cache/session/contracts, but current selector ignores it. | `big_fish` should not duplicate the matrix; it should score honest big-fish candidates higher when daily scenario supports them. |
| Historical validation cannot judge final recommendations yet | Existing tests validate pieces of the 3:3 runtime, not final 2x2 recommendation quality. | Recommendation-quality audits should wait until DailyScenario and the 2x2 selector exist. |

## Target DailyScenario Contract

Recommended future location: `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts`.

Proposed contract:

```ts
export type DailyActivityLevel =
  | "suppressed"
  | "neutral"
  | "active"
  | "high_opportunity";

export type DailySurfaceGate =
  | "closed"
  | "caution"
  | "open";

export type DailyLightMode =
  | "low_light"
  | "mixed"
  | "bright"
  | "glare"
  | "unknown";

export type DailyWindMode =
  | "calm"
  | "breezy"
  | "windy"
  | "unknown";

export type DailyThermalMode =
  | "cold_slow"
  | "warming"
  | "stable"
  | "cooling_or_shock"
  | "heat_limited"
  | "unknown";

export type DailyWaterMovementMode =
  | "stable"
  | "elevated_or_dirty"
  | "blown_out"
  | "not_applicable"
  | "unknown";

export type DailyScenarioTag =
  | "calm_surface"
  | "low_light_surface"
  | "wind_reaction"
  | "dirty_vibration"
  | "clear_subtle"
  | "cold_slow"
  | "warming_search"
  | "heat_finesse"
  | "runoff_streamer"
  | "current_swing"
  | "cover_ambush"
  | "open_water_search";

export type DailyScenario = {
  local_date: string;
  local_timezone: string;
  species: RecommenderV4Species;
  water_type: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal: RecommendationGoal;
  hows_score: number;
  activity_level: DailyActivityLevel;
  surface_daily_gate: DailySurfaceGate;
  surface_daily_reason_codes: string[];
  light_mode: DailyLightMode;
  wind_mode: DailyWindMode;
  daylight_wind_mph: number | null;
  thermal_mode: DailyThermalMode;
  water_movement_mode: DailyWaterMovementMode;
  pressure_mode: "falling" | "stable" | "rising" | "unstable" | "unknown";
  scenario_tags: DailyScenarioTag[];
  missing_inputs: string[];
  confidence: "high" | "medium" | "low";
};
```

Notes:

- `surface_daily_gate` is only the daily half of the topwater decision. A surface candidate is eligible only when the seasonal row permits surface and `surface_daily_gate !== "closed"`.
- `scenario_tags` should use the same bounded vocabulary as catalog `condition_tags` so candidate scoring can compare daily scenario to profile truth directly.
- `recommendation_goal` belongs on the scenario because candidate scoring needs to know whether reliable action or big-fish upside is being emphasized. It should not create a separate seasonal matrix.
- `missing_inputs` and `confidence` should prevent future copy or scoring from treating absent weather data as a strong positive.

## Mapping Existing Labels To Proposed Scenario

| Existing upstream signal | Current source | Proposed DailyScenario output | Notes |
|---|---|---|---|
| How's score `<= 35` | `regimeFromHowsScore` | `activity_level = "suppressed"` | Keep as a broad activity label, not a complete tactical answer. |
| How's score `36-69` | `regimeFromHowsScore` | `activity_level = "neutral"` | Candidate scoring should still respond to wind/light/runoff tags. |
| How's score `>= 70` | `regimeFromHowsScore` | `activity_level = "active"` or `"high_opportunity"` | Consider reserving `"high_opportunity"` for very strong score plus no major missing core inputs. |
| `light_cloud_condition.label = low_light | heavy_overcast` | Shared normalization | `light_mode = "low_light"`; tag `low_light_surface` when seasonal surface is open and wind/thermal do not close it | Low light should support surface/reaction ranking, not override seasonal gates. |
| `light_cloud_condition.label = bright | glare` | Shared normalization | `light_mode = "bright" | "glare"`; tag `clear_subtle` for clear water; possible `heat_finesse` when thermal mode is heat-limited | Bright clear water should favor subtle/low-profile choices. |
| Water clarity `clear` plus calm/non-aggressive day | Request + wind/regime | tag `clear_subtle` | Current clear-subtle window is a good seed but should become a scenario tag. |
| Water clarity `dirty` or stained plus wind/precip/runoff | Request + shared labels | tag `dirty_vibration` where appropriate | Should rank vibration/flash profiles without authoring false row IDs. |
| Daylight wind `< 6 mph` | `meanDaylightWindMph` | `wind_mode = "calm"`; tag `calm_surface` if seasonally and thermally plausible | Current threshold exists. Add missing-input confidence before treating absent wind as calm. |
| Daylight wind `6-11.99 mph` | `windBandFromDaylightWindMph` | `wind_mode = "breezy"`; possible `open_water_search` or `wind_reaction` by species/clarity | Breezy is often good for search/reaction but does not automatically mean topwater. |
| Daylight wind `>= 12 mph` | `windBandFromDaylightWindMph` | `wind_mode = "windy"`; tag `wind_reaction`; surface `caution` or `closed` by species/threshold | Current surface hard block is `>14 mph`; future scenario can keep a stronger distinction between reaction wind and surface closure. |
| Temperature band `very_cold | cool` | Shared normalized temperature | `thermal_mode = "cold_slow"`; tag `cold_slow` | Should favor slower/bottom/mid presentations inside seasonal row envelope. |
| Temperature trend `warming` without shock | Shared normalized temperature | `thermal_mode = "warming"`; tag `warming_search` | Warming can lift fish shallower/faster, but should not open surface if the seasonal row says no. |
| Temperature trend `cooling` or shock not `none` | Shared normalized temperature | `thermal_mode = "cooling_or_shock"`; likely activity suppression and `cold_slow`/subtle tags | Avoid translating all pressure or warming language directly into fast choices. |
| Temperature band `very_warm` or heat timing context | Shared normalized temperature/timing | `thermal_mode = "heat_limited"`; tag `heat_finesse` | Should support early/late timing and finesse/cover ranking, not blanket topwater. |
| Runoff label `slightly_elevated | elevated` | Shared runoff | `water_movement_mode = "elevated_or_dirty"`; tag `runoff_streamer` for trout rivers | Current trout elevated runoff fly window is a good seed. |
| Runoff label `blown_out` | Shared runoff | `water_movement_mode = "blown_out"`; likely suppressive with selective streamer/heavy profile opportunities | Should reduce confidence or narrow toward honest high-visibility/streamer tools, not pretend all rows are equally valid. |
| Pressure falling/stabilizing/rising | Shared pressure | `pressure_mode` and possible activity modifier | Keep pressure as secondary context unless validated against archived scenarios. |
| River context | Request context | possible `current_swing` tag when runoff/flow and species support it | Current code does not have actual current velocity for freshwater rivers; avoid overclaiming. |
| Lake/pond open water season + baitfish forage + wind | Row + daily wind | possible `open_water_search` | Should rank search baits/flies inside valid row IDs, not add broad fallback inventory. |

## Responsibility Separation For Future 2x2

Seasonal rows:

- Gate species, region, month, and water-type truth.
- Define seasonal column and pace envelopes.
- Define whether surface can be biologically possible in that row.
- Curate allowed lure/fly IDs for that seasonal setting.
- Should not encode day-specific weather decisions or pad inventory just to satisfy old 3:3 coverage.

DailyScenario:

- Interprets weather, light, temperature, wind, runoff, pressure, and data quality for the target local day.
- Produces a bounded tactical tag set that can be compared against catalog `condition_tags`.
- Opens, cautions, or closes the daily half of the surface gate.
- Ranks valid candidates differently for `all_purpose` and `big_fish` without changing the seasonal row matrix.

Candidate scoring:

- Starts from candidates that pass seasonal row, catalog species/water, row-exclusion, and surface gates.
- Scores condition-tag match, goal-tag match, forage, clarity, intrinsic catalog fit, and recent-history/variety penalties.
- Treats current catalog `clarity_strengths` as strengths for scoring, not as an impossibility list or hard gate.
- Must never rewrite an item's intrinsic column/pace for display.

Variety:

- Rotates among strong valid alternatives after hard gates and scoring.
- Should not rescue a biologically false candidate.
- Should preserve Set A/Set B daily session stability and the goal-aware cache/session identity added in Pass 2.

## Archived-Day Validation Plan

Do not fetch archived weather data until the DailyScenario contract exists. Pass 5F only defines what will be needed.

### Historical hourly fields needed

For each archived fixture day, store raw-ish fields plus the normalized result so regressions are debuggable:

- Hourly air temperature for the local date and at least prior two days.
- Daily high/low air temperature arrays around the target date.
- Optional measured water temperature and 24h/72h prior water temperatures where a trusted source exists.
- Hourly pressure for at least 48 hours ending at the target day's local noon.
- Hourly wind speed with units, plus daily max wind if available.
- Hourly cloud cover or solar/light proxy.
- 24h, 72h, and 7d precipitation totals; for rivers, all three must be present to validate runoff.
- Sunrise/sunset for local timing checks.
- Optional solunar major periods.
- Fixture metadata: species, region, month, water type, water clarity, recommendation goal, local timezone, and expected high-level scenario tags.

### Fixture matrix

| Species | Region/month examples | Water type | Clarity | Goals | Scenarios to fixture |
|---|---|---|---|---|---|
| Largemouth bass | Florida March; Great Lakes/Upper Midwest March and May; Southeast summer | Lake/pond | clear, stained, dirty | all_purpose, big_fish | Early southern surface allowed vs northern surface closed; heat finesse; low-light surface; dirty vibration. |
| Smallmouth bass | Appalachian May/June; Great Lakes/Upper Midwest April/May; river summer | Lake/pond and river | clear, stained | all_purpose, big_fish | Clear-bright subtle, windy reaction, warming search, cold/early-season restraint. |
| Northern pike | Great Lakes/Upper Midwest spring/fall; northern river suppressive days | Lake/pond and river | stained, clear, dirty | all_purpose, big_fish | Wind/flash without automatic topwater, cold slow bottom/mid pike, big-profile upside, surface only in credible windows. |
| Trout | Appalachian/Mountain/Pacific Northwest river May-July and shoulder months | River only | clear, stained, dirty | all_purpose, big_fish | Runoff streamer, clear-bright subtle streamer, mouse/surface only when seasonal and daily gates agree, cold slow river finesse. |

### Specific validation examples

| Fixture type | Expected validation |
|---|---|
| Florida LMB March warm low-light calm day | Seasonal surface may be open; daily scenario should include `low_light_surface`/`calm_surface`; all-purpose can pick reliable surface/search, big-fish can emphasize frog/topwater only if row/catalog support it. |
| Michigan/Northern LMB March cold day | Seasonal surface should remain closed; daily low wind or warming should not force topwater. |
| Trout May river bright cold stable day | Daily scenario should not over-promote generic surface. It may favor subtle streamer/nymph-adjacent lure analogs inside the existing streamer/topwater-only fly product scope. |
| Trout elevated runoff day | Daily scenario should tag `runoff_streamer`; row-valid trout streamer flies should rise; surface flies should not rise unless both seasonal and daily surface gates allow them. |
| Pike windy stained lake day | Daily scenario should tag `wind_reaction` and likely `dirty_vibration`; pike flash/bucktail/jerkbait/swimbait profiles should rise; topwater should not open merely because wind exists. |
| Clear bright smallmouth river day | Daily scenario should tag `clear_subtle`; subtle jerkbait/drop-shot/tube/Ned/hair-style profiles should rise when seasonally valid. |
| Summer heat-limited bass day | Daily scenario should tag `heat_finesse`; surface might be a low-light window only, not a full-day green light. |
| Similar-condition multi-day sequence | Set A should be stable within a day, Set B should differ when valid alternatives exist, and adjacent days should rotate among high-scoring alternatives without dropping below biological credibility. |

Final recommendation-quality auditing should wait until:

1. The `DailyScenario` builder exists.
2. The 2x2 candidate pool/scoring/selectors exist.
3. Response copy displays intrinsic candidate profiles rather than abstract slot targets.
4. Archived fixtures can assert expected scenario tags and expected candidate classes without overfitting exact IDs too early.

### Pass 7A implementation note

Pass 7A added the first fixture-based internal preview quality audit now that the parallel daily-picks surface adapter, response shaper, and gated preview path exist. The focused test coverage lives in `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/previewQualityFixtures.test.ts`, and the fixture outcome notes live in `docs/audits/recommender-2x2/daily-picks-preview-quality-pass7a.md`.

The fixtures use direct `runDailyPicksSurface` calls with injected shared-condition analysis, realistic request/env metadata, and archived-day-style scenarios. They assert invariants rather than tuning exact pick sets: four slots, row-authored candidates, catalog species/water compatibility, intrinsic profile fields, surface-gate compliance, removed trout/pike cleanup IDs staying absent, goal-aware score reasons, missing-wind copy restraint, and Set B avoidance in a rich pool. The audit found no cutover blockers, but it identified future tuning/inventory review areas around trout runoff streamer competition and pike generic fly competition.

### Pass 7B implementation note

Pass 7B traced candidate scores for the Pass 7A trout elevated-runoff and pike cold/suppressive river fixtures. The evidence pointed to bounded catalog tag semantics, not seasonal-gate failure or a need for global scoring-weight changes.

Two narrow tag corrections were made: `sculpin_streamer` now includes `runoff_streamer`, which lets a trout river sculpin pattern rise on elevated/dirty runoff days; `pike_bunny_streamer` now includes `cold_slow`, which lets a slow rabbit-strip pike fly compete in cold/suppressive river conditions without making all-purpose pike selection exclusively giant/high-risk. The Pass 7A fixture suite now asserts those outcomes directly. The existing `recommendation_goal` migration remains a deployment prerequisite before any deployed preview or cutover relying on session keying.

### Pass 7C implementation note

Pass 7C added a narrow `glidebait` path for future daily-picks Big Fish bass recommendations. The profile is bass-only, lake/pond-only, mid-column, slow/medium, clear/stained, and tagged only for Big Fish/high-risk goal fit with conservative `clear_subtle`, `open_water_search`, and `cover_ambush` condition fit.

Seasonal authoring is intentionally sparse: five bass lake/pond rows where mid-column slow/medium baitfish or bluegill profiles are biologically defensible. Preview fixtures now prove Big Fish can select `glidebait` when the row authors it and daily conditions fit, while all-purpose and dirty poor-fit fixtures avoid it. No daily weather logic was allowed to resurrect seasonally invalid surface/topwater, and the existing `recommendation_goal` migration remains a deployment prerequisite before deployed preview/cutover.

### Pass 8A implementation note

Pass 8A wired the app-side recommender client and result view to the gated daily-picks 2x2 preview path. `fetchRecommendation` now sends `x-recommender-preview: daily_picks_2x2`, uses the daily-picks session/response version for cache identity, preserves `recommendation_goal`, and rejects stale old 3:3 response shapes for this app path.

`components/fishing/RecommenderView.tsx` now renders the future response shape as four fixed cards using intrinsic selected profile fields, scenario summary, session refresh metadata, and graceful image placeholders when an asset is missing. The backend default remains gated for older app builds, and the `recommendation_goal` daily-session migration remains a deployment prerequisite before any deployed 2x2 app experience can rely on session keying.

## Recommended Implementation Order

1. Add the `DailyScenario` contract and builder beside the future 2x2 engine path, fed by existing `SharedConditionAnalysis`, request metadata, row surface status, and preserved hourly wind.
2. Add focused unit tests for label mapping, missing-input confidence, surface daily gate states, and scenario-tag derivation.
3. Keep the current 3:3 runtime untouched until the new 2x2 engine path is ready behind a controlled adapter/cutover.
4. Build the 2x2 candidate pool from seasonal row IDs plus catalog hard gates. Do not create abstract target slots.
5. Score candidates using catalog `condition_tags`, `goal_tags`, forage, clarity, intrinsic column/pace, daily surface gate, and recent-history/variety rules.
6. Add archived-day fixtures that validate scenario tags first, candidate classes second, and exact recommendations only after scoring stabilizes.
7. Resume seasonal cleanup for remaining questionable trout streamer/surface rows and pike generic fly/crankbait rows with DailyScenario responsibilities clear.

## Files Inspected

- `docs/recommender-2x2-master-agent-handoff.md`
- `docs/recommender-2x2-renovation-plan.md`
- `docs/audits/recommender-2x2/current-runtime-map.md`
- `docs/audits/recommender-2x2/seasonal-row-renovation-preflight-pass5a.md`
- `supabase/functions/recommender/index.ts`
- `supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts`
- `supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts`
- `supabase/functions/_shared/howFishingEngine/contracts/input.ts`
- `supabase/functions/_shared/howFishingEngine/contracts/normalized.ts`
- `supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts`
- `supabase/functions/_shared/howFishingEngine/normalize/buildNormalized.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/dailyTacticalProfile.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/wind.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
- `supabase/functions/_shared/recommenderEngine/runRecommenderRebuildSurface.ts`
- Relevant tests discovered with `rg`, especially `supabase/functions/_shared/recommenderEngine/__tests__/rebuildDailyConditionWindows.test.ts`, `supabase/functions/recommender/index.test.ts`, and shared How's Fishing normalization/scoring tests.
