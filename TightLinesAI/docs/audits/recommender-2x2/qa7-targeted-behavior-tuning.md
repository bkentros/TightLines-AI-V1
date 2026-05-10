# QA7 Targeted Behavior Tuning and Regression Pass

Date: 2026-05-09

Scope: QA7 traced the QA6 red flags, made only narrow behavior fixes, and re-ran the launch validation stack. No new inventory was added. No seasonal CSV rows were edited. Biological gates were not weakened.

## Files Changed

- `scripts/audit/daily-picks-archived-weather-replay.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `docs/audits/recommender-2x2/qa7-targeted-behavior-tuning.md`

## Trace Additions

The archived-weather replay harness now supports `--trace` and prints focused score traces for:

- broad flies: `clouser_minnow`, `game_changer`, `articulated_baitfish_streamer`, `articulated_dungeon_streamer`, `unweighted_baitfish_streamer`
- pike reaction lures: `pike_spinnerbait`, `large_bucktail_spinner`, `weedless_spoon`, `casting_spoon`, `shallow_minnowbait`, `large_profile_pike_swimbait`, `pike_jerkbait`, `pike_glidebait`
- SMB clear-lake Big Fish lures: `compact_glidebait`, `magnum_jerkbait`, `big_smallmouth_tube`, `suspending_jerkbait`, `bladed_jig`
- the LMB dirty/elevated river Big Fish surface-caution case

## Issues Confirmed vs Dismissed

Confirmed: broad flies are over-represented. Trace evidence shows this is mostly caused by broad row authoring plus broadly truthful catalog tags, not a single broken scoring weight. `clouser_minnow` gets AP lift from `reliable_action` / `versatile_search`; `game_changer` and articulated baitfish flies get Big Fish or open-water/runoff lifts where they are authored broadly.

Confirmed and fixed: `surface_daily_gate: caution` was too permissive. The LMB dirty/elevated river Big Fish fixture selected `buzzbait` and `deer_hair_slider` even though the scenario had no true calm/low-light surface tags. Trace showed the old `-8` caution penalty did not overcome generic Big Fish upside and dirty/reaction reasons.

Confirmed and fixed: pike windy/stained reaction was overly concentrated on `pike_spinnerbait`. The spinnerbait was biologically valid, but trace showed it held a large advantage because it carried both `wind_reaction` and `dirty_vibration` while large bucktail carried only wind. Adding `dirty_vibration` to `large_bucktail_spinner` is a narrow catalog-tag correction for stained/windy pike reaction.

Confirmed but not fixed in QA7: adjacent-day exact repeats remain. Launch harness repeats increased slightly after the targeted changes, and archived replay still has one exact SMB lake AP repeat. This needs a dedicated exposure/variety pass.

Dismissed for now: `compact_glidebait` does not need tuning yet. Trace found it is in the quality neighborhood for clear/stained SMB lake Big Fish rows, but it is outscored by `big_smallmouth_tube`, `magnum_jerkbait`, or topwater depending on forage, cold-slow, and surface context. That is plausible rather than an obvious bug.

## Fixes Made

### Surface Caution Penalty

Changed `surface_daily_gate: caution` scoring from `-8` to `-24`.

Rationale: caution should allow surface candidates to remain in the pool for mixed-but-possible days, but it should not let surface-heavy Big Fish picks win dirty/current river contexts unless true surface conditions are present.

Regression coverage:

- Added a scoring test that a caution-gated surface candidate receives `surface_daily_gate:caution:-24`.
- The test also verifies a comparable subsurface reaction candidate beats the caution surface candidate.
- Updated response-shaping fixture reasons from `-8` to `-24`.

Replay result:

- Before: `lmb_midwest_jun14_dirty_river big_fish` selected `buzzbait` and `deer_hair_slider`.
- After: it selected `squarebill_crankbait` / `bladed_jig` and `baitfish_slider_fly` / `game_changer`.
- Closed-gate surface leaks remain 0.

### Pike Bucktail Reaction Tag

Added `dirty_vibration` to `large_bucktail_spinner.condition_tags`.

Rationale: in stained/windy pike contexts, a large bucktail is an honest flash/vibration reaction tool. The tag gives the existing pike-first inventory a fair quality-band path without weakening gates or broadening species/water eligibility.

Regression coverage:

- Added catalog validation that large bucktail carries `wind_reaction`, `dirty_vibration`, and `big_fish_upside`.

Replay result:

- Before: windy/stained pike AP and Big Fish were topped by `pike_spinnerbait`.
- After: AP selects `pike_spinnerbait` / `large_bucktail_spinner`; Big Fish selects `large_bucktail_spinner` / `pike_spinnerbait`.

## Harness and Replay Results

Launch harness:

- Rows: 828
- Contexts: 9234
- Failures: 0
- Pool health: lure min/p10/median 6/7/17; fly min/p10/median 9/11/14; thin pools 0
- Condition-reason rate: 0.672
- Goal-reason rate: 0.878
- Surface leaks: 0
- Set B reuse reviews: 15/9234
- Identical AP/BF sets: 14/4617
- Adjacent-day repeated sets over 7 days: 8339
- Family-diversity violations with in-band alternatives: 0 on all sides/sets

Archived replay after QA7:

- Fixtures: 18
- Goal runs: 36
- Broad fly selected share: 0.431
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1
- Closed-gate surface selections: 0
- Caution surface selections: 0 reported by the replay watch queue

High-volume replay changes:

- `large_bucktail_spinner`: now 4 total selections in pike reaction contexts.
- `pike_spinnerbait`: still 4 total selections, but no longer monopolizes pike reaction Top Pick.
- `game_changer`: rose from 8 to 9 total selections because the surface-caution fix moved one dirty-river fly slot away from `deer_hair_slider`.
- Broad fly share rose slightly from 0.417 to 0.431, confirming broad-fly dominance needs a dedicated follow-up instead of incidental tuning.

## Tests Run

- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts --trace`

## Remaining Red Flags

Broad flies are still the main launch-quality risk. The trace points to row authoring and truthful but broad catalog tags. Fixing this safely likely requires a row-by-row broad-fly intent pass or species-specific trace thresholds, not a blunt scoring weight change.

Adjacent-day repeats remain high in the synthetic launch harness and are present in archived replay. This is now clearly an exposure/variety policy issue, not a catalog truth issue.

Set B reuse reviews remain concentrated in thin exact river Big Fish rows. This should be evaluated together with exposure policy rather than solved by weak novelty picks.

`compact_glidebait` remains plausible but narrow. Do not tune it until a larger clear-SMB-lake replay shows it is systematically dead.

## Recommended QA8 Exposure/Variety Pass

1. Add adjacent-day exposure policy that avoids exact repeated four-pick sets when valid quality-band alternatives exist.
2. Add species/side/goal exposure diagnostics to the harness and archived replay, including repeated Top Pick, repeated family_group, and repeated broad-fly family counts.
3. Preserve the QA4 family-diversity rule while adding adjacent-day variety. Do not force weak biological picks for novelty.
4. Add a broad-fly row-authoring review queue rather than broad score penalties: rows where broad baitfish flies outrank more specific fly inventory by only jitter/diversity should be candidates for seasonal row cleanup.
5. Re-run archived replay after exposure changes to verify AP/BF separation and pike/LMB/SMB context behavior are unchanged.
