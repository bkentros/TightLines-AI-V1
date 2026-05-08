# Historical Runtime Map - Pre-2x2 Cutover

Pass: 1 current-state audit  
Scope: documentation audit, later annotated after Pass 2

Historical note: this file captured the runtime before the daily-picks 2x2 renovation. It is retained only as audit evidence for why the old 3:3 rebuild/v3 paths were replaced. The live recommender after Pass 9C is `supabase/functions/recommender/index.ts` -> `dailyPicksSession.ts` -> `recommenderEngine/dailyPicks/**`, using v4 catalog profiles and generated v4 seasonal rows.

## Executive Summary

At the time of the Pass 1 audit, the production recommender was the Supabase Edge function `supabase/functions/recommender/index.ts` calling `runRecommenderRebuildSurface`, which called the deterministic rebuild engine under `supabase/functions/_shared/recommenderEngine/rebuild/**`.

The pre-cutover selection model was a 3-slot architecture:

1. Resolve one generated v4 seasonal row.
2. Build three abstract daily `TargetProfile` slots from row column/pace ranges and How's Fishing regime.
3. Select up to three lures and up to three flies that can fill those slots.
4. Map picks into the app response and persist a daily Set A / Set B session.

This is the mechanism the 2x2 renovation is intended to replace. The current path uses v4 catalogs and generated v4 seasonal rows, but it is not the standalone `v4/engine/**` top-three engine.

## Pass 2 Update

Pass 2 added `recommendation_goal` identity without changing recommendation selection behavior.

Current as of Pass 2:

- Public requests may include `recommendation_goal: "all_purpose" | "big_fish"`.
- Missing `recommendation_goal` defaults to `"all_purpose"` in the edge handler/client fetch layer.
- Invalid `recommendation_goal` returns `400 invalid_goal`.
- `RecommenderRequest` now includes `recommendation_goal`.
- `RecommenderResponse` now includes `recommendation_goal`.
- `RECOMMENDER_DAILY_SESSION_ENGINE_VERSION` is now `recommender_rebuild_tacv3_sessionv3_goalv1`.
- The server daily session key now includes `recommendation_goal`.
- The frontend cache key now includes `recommendation_goal`.
- The current rebuild selector/scoring still ignores `recommendation_goal`.
- A migration was added: `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql`.
- The migration has not been locally applied in this workspace.

## Production Runtime

### Edge Entry

- `supabase/functions/recommender/index.ts`
  - Production runtime.
  - Handles CORS, auth, subscription gating, JSON parsing, request validation, state/species/context gating, shared request construction, recent-history load/persist, daily Set A/B session orchestration, and final HTTP response.
  - Calls `buildRecommenderEngineRequest(body)` to convert the public request into a backend `RecommenderRequest`.
  - Calls `runRecommenderRebuildSurface(engineReq, { userSeed, recentHistory })` inside `resolveRecommenderDailySession`.
  - Current request accepts `recommendation_goal`, `refresh_requested`, and `target_date`.
  - `recommendation_goal` defaults to `all_purpose` and is only identity metadata for now.
  - Uses `SeasonalRowMissingError` as a known 422 response.

### Request Validation And Types

- `supabase/functions/_shared/recommenderEngine/contracts/input.ts`
  - Production runtime type.
  - Defines `WaterClarity = "clear" | "stained" | "dirty"`, `RecommendationGoal = "all_purpose" | "big_fish"`, and `RecommenderRequest`.
  - Request fields are location, species, context, water clarity, recommendation goal, and env data.

- `supabase/functions/_shared/recommenderEngine/contracts/species.ts`
  - Production support/integration.
  - Defines public `SpeciesGroup` values, including freshwater species currently supported by the recommender and non-supported saltwater/walleye values that the edge handler rejects after broader validation.

- `supabase/functions/_shared/recommenderEngine/contracts/output.ts`
  - Production runtime type.
  - Defines `RECOMMENDER_FEATURE = "recommender_rebuild"` and `RECOMMENDER_DAILY_SESSION_ENGINE_VERSION = "recommender_rebuild_tacv3_sessionv3_goalv1"`.
  - `RankedRecommendation` has `primary_column`, `pace`, `presence`, `is_surface`, and optional `source_slot_index`.
  - `RecommenderResponse` includes `recommendation_goal`.
  - Response arrays are unconstrained `RankedRecommendation[]`; client validation allows 0-3 per side and at least one total recommendation.

- `supabase/functions/_shared/recommenderEngine/index.ts`
  - Production support/integration barrel.
  - Re-exports `runRecommenderRebuildSurface`, `computeRecommenderRebuild`, seasonal row error helpers, contracts, state/species gating, and many legacy v3 exports.
  - Header comments state that legacy v3 is not the edge path and standalone v4 engine is experimental/diagnostic.

- `supabase/functions/_shared/howFishingEngine/index.ts`
  - Production support/integration.
  - `buildSharedEngineRequestFromEnvData` normalizes request/env data and region information before the recommender-specific request is assembled.

- `supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts`
  - Production support/integration.
  - Imported by the edge handler but not directly used in current code after shared request construction; follow-up can confirm whether this import is stale.

- `supabase/functions/_shared/howFishingEngine/contracts/context.ts`
  - Production support/integration.
  - Defines/exports `ENGINE_CONTEXTS`, used for public context validation.

## Session And Cache

- `supabase/functions/recommender/dailySession.ts`
  - Production runtime.
  - Owns server-authoritative daily sessions in `public.recommender_daily_sessions`.
  - Session key includes user, local date, rounded lat/lon, state, region, species, water type, water clarity, recommendation goal, and engine version.
  - Generates variant A for the first request, returns cached active variant on repeat, and allows one refresh to claim variant B.
  - Uses up to 8 attempts to make B differ from A by recommendation IDs.

- `supabase/migrations/20260507170000_create_recommender_daily_sessions.sql`
  - Production database support.
  - Creates `public.recommender_daily_sessions` with JSONB A/B responses and the current primary key.
  - Original table does not include `recommendation_goal`.

- `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql`
  - Production database support added in Pass 2.
  - Adds `recommendation_goal`, a check constraint, and a goal-inclusive primary key.
  - Must be applied before deploying goal-aware edge code to a target Supabase database.

- `lib/recommender.ts`
  - Frontend production runtime cache/fetch layer.
  - Builds the AsyncStorage and in-memory cache key from engine version, rounded location, state, context, species, water clarity, and local day.
  - Pass 2 added recommendation goal to cache identity and defaults omitted goal to `all_purpose`.
  - `fetchRecommendation` invokes the `recommender` edge function and sends `refresh_requested: true` only for forced refresh.
  - `isCachedResultValid` accepts `recommender_rebuild`, arrays of 0-3 picks per side, and server session metadata.

- `lib/recommenderContracts.ts`
  - Frontend production support.
  - Mirrors backend response/request shape for React Native.
  - Pass 2 added `RecommendationGoal`, optional request `recommendation_goal`, and response `recommendation_goal`.
  - Still exposes optional `source_slot_index`.

## Recent History

- `supabase/functions/recommender/recentHistory.ts`
  - Production runtime.
  - Loads and persists `public.recommender_recent_history` rows for the last 7 days before the current local date.
  - Filters by user, species, region, and water type. It does not filter by water clarity or goal.
  - Persists every returned lure/fly ID when a new daily session variant is generated.

- `supabase/functions/_shared/recommenderEngine/rebuild/recentHistory.ts`
  - Production runtime support for the rebuild selector.
  - Defines the history entry shape used by `selectArchetypesForSide`.
  - `isRecentlyShown` treats the same archetype/side in the previous 7 days as recent.

- `supabase/migrations/20260422130248_create_recommender_recent_history.sql`
  - Production database support.
  - Creates `public.recommender_recent_history`.

- `supabase/migrations/20260420_create_recommender_recent_history.sql`
  - Ambiguous / needs follow-up.
  - Appears to duplicate the later recent-history migration, with nearly identical DDL.
  - Do not remove until migration history is understood.

## Live Engine Adapter

- `supabase/functions/_shared/recommenderEngine/runRecommenderRebuildSurface.ts`
  - Production runtime.
  - Adapts rebuild engine output to the app-facing `RecommenderResponse`.
  - Calls `analyzeRecommenderConditions(req)` and `computeRecommenderRebuild(req, analysis, options)`.
  - Builds color decision with v4 color code and v3-style output labels.
  - Emits `summary.daily_tactical_preference` from target profiles, not from the chosen item identities.
  - Important issue: `archetypeToRankedFields` uses the archetype column but uses the target profile pace/presence. This is how a real fast/medium surface buzzbait can display as slow when it fills a slow surface target profile.

## Current Rebuild Engine

- `supabase/functions/_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts`
  - Production runtime.
  - Main rebuild orchestrator.
  - Resolves v4 species scope, generated seasonal row, How's Fishing regime, daylight wind, surface block, three target profiles, condition state objects, daily tactical profile diagnostics, and per-side selections.

- `supabase/functions/_shared/recommenderEngine/rebuild/seasonalResolve.ts`
  - Production runtime.
  - Loads generated v4 seasonal row arrays for the four supported internal species.
  - Exact lookup by species, region, month, and water type.
  - Ignores state-scoped rows and does not use region fallback.

- `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts`
  - Production runtime.
  - Converts How's Fishing score into `aggressive | neutral | suppressive`.
  - Builds three target column/pace profiles from the seasonal row.
  - Removes surface from effective legal columns only when wind blocks it.
  - Special-cases rows with slow surface specialists so surface target profiles can become slow.

- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
  - Production runtime.
  - Core per-side 3-slot selector.
  - Uses v4 lure/fly catalogs and row `primary_lure_ids` / `primary_fly_ids`.
  - Hard gates gear mode, species, water type, row exclusions, and wind-blocked surface.
  - It does not hard gate clarity; clarity is a score boost/specialist boost.
  - It does not require authored row ID membership for all rescue candidates; `catalog_valid_rotation` can be used in rescue where allowed.
  - Adjacent pace matching is permitted.
  - Emits `source_slot_index`.
  - `archetypeToRankedFields` displays `pace: targetProfile.pace` and `presenceFromPace(targetProfile.pace)`.

- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
  - Production runtime.
  - Defines current daily condition windows and condition-specific candidate ID lists.
  - Uses window IDs such as `surface_commitment_window`, `wind_reaction_window`, `clear_subtle_window`, `trout_mouse_window`, `trout_elevated_runoff_streamer_window`, and `pike_wind_flash_fly_window`.
  - These are score boosts inside the slot selector, not a full normalized 2x2 daily scenario layer.

- `supabase/functions/_shared/recommenderEngine/rebuild/dailyTacticalProfile.ts`
  - Production runtime support.
  - Normalizes light/temperature/runoff labels into modes and records the active condition windows.
  - The normalized object is diagnostic/supporting context, not the sole scorer input.

- `supabase/functions/_shared/recommenderEngine/rebuild/wind.ts`
  - Production runtime.
  - Computes mean daylight wind from local hours 5 AM through 9 PM.
  - If hourly data is absent, falls back to `env_data.wind_speed_mph`.
  - If wind is missing entirely, returns `0`, which means missing wind can leave surface open in the rebuild path. The new plan says missing/untrustworthy wind should close surface.
  - Current `windBandFromDaylightWindMph` uses calm `<6`, breezy `<12`, windy `>=12`; surface block uses `>14` in `shapeProfiles.ts`.

- `supabase/functions/_shared/recommenderEngine/rebuild/copy.ts`
  - Production runtime support.
  - Generates why/how copy for chosen archetypes using target profiles and catalog copy variants.
  - Because copy receives target profile, it can reinforce slot pace rather than item pace.

- `supabase/functions/_shared/recommenderEngine/rebuild/constants.ts`
  - Production runtime support.
  - Shared tactical ordering helpers for columns and pace indexes.

- `supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts`
  - Production runtime support.
  - Adapts shared How's Fishing analysis for recommender use.

## Catalog Files Used By Live Path

- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
  - Production runtime data contract.
  - Defines v4 species, columns, paces, forage buckets, closed lure/fly ID sets, `ArchetypeProfileV4`, and `SeasonalRowV4`.

- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
  - Production runtime catalog.
  - 37 lure profiles used by `selectArchetypesForSide`.

- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
  - Production runtime catalog.
  - 31 fly profiles used by `selectArchetypesForSide`.

- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
  - Production runtime support.
  - Constructs catalog profiles and enforces basic invariants: valid ID, valid column, primary pace, adjacent/different secondary pace, forage/clarity present, species/water present, copy length, non-empty presentation group, and surface-fly rules.

- `supabase/functions/_shared/recommenderEngine/v4/candidates/index.ts`
  - Production support / convenience barrel.

- `supabase/functions/_shared/recommenderEngine/v4/colorDecision.ts`
  - Production runtime support for current color label/theme.

## Seasonal Row Files Used By Live Path

- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `data/seasonal-matrix/trout.csv`
  - Production authoring source.
  - These are not read directly at runtime; they generate TypeScript files.

- `data/seasonal-matrix/schema.md`
  - Production authoring documentation, but contains a stale runtime note saying the live edge still uses embedded v3 tables.
  - Current trace shows live rebuild uses generated v4 rows through `rebuild/seasonalResolve.ts`.
  - Mark as conflicting documentation needing cleanup in a later docs pass.

- `scripts/generate-seasonal-rows-v4.ts`
  - Production authoring/generation script.
  - Parses CSVs, validates rows, and writes generated TypeScript.

- `scripts/check-seasonal-matrix-consistency.ts`
  - Production authoring/CI support.
  - Regenerates into a temp directory and confirms committed generated files match CSVs.

- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`
  - Production runtime data.
  - Imported by `rebuild/seasonalResolve.ts`.

## Frontend Call And Render Path

- `app/recommender.tsx`
  - Frontend production runtime.
  - Current setup wizard is 3 steps: species, water type, water clarity.
  - Readiness requires species/context/clarity/location/state support only.
  - Calls `getForecastScores`, builds `env_data` from today's snapshot, then calls `fetchRecommendation`.
  - Sends latitude, longitude, state code, species, context, water clarity, env data, and target date.
  - Does not send goal.
  - Refresh path passes `forceRefresh` to client fetch.

- `components/fishing/RecommenderView.tsx`
  - Frontend production runtime.
  - Renders current response as "LURES" and "FLIES", up to 3 cards per side.
  - Refresh button label is `BUILD SET B`.
  - Displays `summary.daily_tactical_preference` chips, including preferred column/pace/presence.

- `components/fishing/RecommenderLoadingSkeleton.tsx`
  - Frontend production support.
  - Loading UI only; no engine behavior.

- `lib/recommender.ts`
  - Frontend production fetch/cache layer, described above.

- `lib/recommenderContracts.ts`
  - Frontend production contract mirror, described above.

- `lib/speciesImages.ts`, `lib/watertypeImages.ts`, `lib/waterclarityImages.ts`, `lib/lureImages.ts`, `lib/flyImages.ts`, `lib/colorPaletteImages.ts`
  - Frontend production support assets for setup and result cards.

- `lib/generated/recommenderStateSpecies.ts`
  - Frontend production support.
  - Generated state/species/context availability map.

## Tests Directly Protecting Current Live Path

- `supabase/functions/recommender/index.test.ts`
  - Test-only, directly validates edge handler construction, high/low wind surface behavior, auth/subscription/errors, public response shape, daily Set A/B behavior, recent history writes, conflict handling, and `refresh_requested` validation.
  - Current response-shape test explicitly allows 0-3 per side, not 2x2.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSurfaceContract.test.ts`
  - Test-only, directly validates `runRecommenderRebuildSurface`.
  - Includes the current issue explicitly: card column is archetype profile, but pace/presence follow engine slot.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildTripleCoverage.test.ts`
  - Test-only.
  - Protects every generated seasonal row returning a full 3:3 lure/fly set and Set B difference potential.
  - This is a major old-behavior test candidate for removal/replacement after 2x2.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSelectSideSlotExact.test.ts`
  - Test-only.
  - Protects slot matching, adjacent pace fill, source slot index, and fly slot order behavior.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildTargetProfileGeometry.test.ts`
  - Test-only.
  - Protects the three target-profile geometry model.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildDailyConditionWindows.test.ts`
  - Test-only.
  - Protects current condition-window boost behavior.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildWeightedVariety.test.ts`
  - Test-only.
  - Protects deterministic weighted slot selection, 3-pick fills, rescue/fallback behavior, confidence boosts, surface blocking, and recency effects.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildVarietyCoverage.test.ts`
  - Test-only.
  - Protects 3-fly/3-lure variety coverage examples.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildVarietyRegression.test.ts`
  - Test-only.
  - Protects current triple rotation and presentation-group behavior.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildFinalistPoolPolicy.test.ts`
  - Test-only.
  - Protects forage/clarity/recency scoring policies inside current finalist pool logic.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSouthernSpringSurfaceFrog.test.ts`
  - Test-only.
  - Protects Florida spring frog row and pool behavior.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildGatedSeasonalCoverage.test.ts`
  - Test-only.
  - Protects generated seasonal coverage through gated supported scope.

- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSeasonalResolve.test.ts`
  - Test-only.
  - Protects missing-row behavior for rebuild seasonal resolver.

- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
  - Test-only / production data integrity.
  - Protects generated seasonal rows.

- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`
  - Test-only but important to keep/extend.
  - Protect current catalog invariants. Future passes should extend for condition tags, goal tags, and displayed identity invariants.

## Legacy / Offline / Audit-Only

- `supabase/functions/_shared/recommenderEngine/runRecommenderV3.ts`
- `supabase/functions/_shared/recommenderEngine/runRecommenderV3Surface.ts`
- `supabase/functions/_shared/recommenderEngine/legacyV3.ts`
- `supabase/functions/_shared/recommenderEngine/v3/**`
  - Legacy/offline/audit-only for current product path.
  - Still re-exported in part from `index.ts` for tests/scripts and shared helpers such as scope/color mapping.
  - Do not remove until all imports are audited.

- `supabase/functions/_shared/recommenderEngine/v4/engine/**`
  - Legacy/offline/audit-only or experimental.
  - Standalone v4 top-three engine, not production.
  - Has its own tests for top-3 behavior, surface gate, pool construction, forage, etc.

- `supabase/functions/_shared/recommenderEngine/v4/seasonal/resolveSeasonalRow.ts`
  - Ambiguous / test-only for current path.
  - Used by standalone v4 engine and tests. It supports state-scoped rows and region fallback.
  - Not used by live rebuild, which uses `rebuild/seasonalResolve.ts` with exact lookup and no state/fallback.

- `scripts/audit-recommender-*.ts`, `scripts/*-rebuild-audit/*.ts`, `scripts/recommender-v3-audit/**`
  - Offline audit/tooling.
  - Many import current rebuild internals to generate reports. Keep until new 2x2 audit tooling replaces them or they are explicitly quarantined.

## Ambiguous / Follow-Up

- `supabase/functions/_shared/recommenderEngine/index.ts`
  - Production barrel but still re-exports many v3 symbols. After 2x2 cutover, split production exports from legacy exports.

- `supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts`
  - Imported by edge handler but apparently unused in current file. Confirm with lint/build before removal.

- `data/seasonal-matrix/schema.md`
  - Authoring doc has stale runtime note. Update when docs cleanup is allowed.

- `supabase/migrations/20260420_create_recommender_recent_history.sql`
  - Duplicate-looking migration. Needs migration-history follow-up.

- Existing docs under `docs/recommender-v3-*`, `docs/recommender-v4-simplified-design.md`, `docs/recommender-selection-refinement-plan.md`, and `docs/tightlines_recommender_architecture_clean.md`
  - Historical and sometimes already marked superseded, but still contain target architecture language that conflicts with 2x2.
