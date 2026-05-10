# QA-5A Catalog Truth and Existing Inventory Cleanup

Date: 2026-05-09

Scope: narrow evidence-backed catalog and seasonal-row cleanup for launch months March-November. No scoring weights, runtime selector policy, surface gates, or broad fallbacks were changed.

## Files changed

- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`
- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `data/seasonal-matrix/trout.csv`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`
- `docs/audits/recommender-2x2/qa5a-catalog-row-cleanup.md`

## Observed issues vs hypotheses

Observed:

- `spinnerbait` allowed `trout` in catalog, even though no trout row authored it.
- `articulated_dungeon_streamer` was authored into all 828 launch rows and behaved as broad Big Fish inventory.
- Pike launch rows authored bass-coded lures broadly: `spinnerbait` in 162 pike launch rows; `squarebill_crankbait`, `flat_sided_crankbait`, `lipless_crankbait`, and `soft_jerkbait` in 118 each; `deep_diving_crankbait` in 81; `buzzbait` in 36.
- `mouse_fly` was trout-only row inventory before QA-5A.
- `warmwater_crawfish_fly` and `crawfish_streamer` shared presentation but not family, which let selector diversity treat two crawfish flies as different families.

Hypotheses:

- `articulated_dungeon_streamer` remains biologically credible in shoulder-season bass lake windows, smallmouth river spring/fall, and trout runoff/fall streamer windows, but not as universal launch inventory.
- Pike All Purpose credibility improves when pike-first tools carry launch rows instead of bass-coded spinnerbait/crankbait/soft-jerkbait carryover.
- Largemouth mouse fly is credible as narrow warm-season lake/pond Big Fish surface inventory under calm/low-light conditions, but should not be row-universal.
- SMB should keep the existing `glidebait` lake-only Big Fish lane, but a future compact smallmouth glidebait should be a separate archetype.

## Catalog metadata changes

- Removed `trout` from `spinnerbait.species_allowed`.
- Changed `warmwater_crawfish_fly.family_group` from `warmwater_crawfish_fly` to `crawfish_fly`, matching `crawfish_streamer` for family-diversity purposes.
- Added `largemouth_bass` to `mouse_fly.species_allowed`.
- Changed `mouse_fly.water_types_allowed` from river-only to lake/pond plus river so trout river rows and narrow LMB lake rows can both use it.
- Updated surface-fly factory invariants to allow `mouse_fly` for `largemouth_bass` and `trout`, while still rejecting pike.

Tests added:

- `QA-5A: crawfish flies share family group for selector diversity`.
- `QA-5A: spinnerbait is not trout catalog inventory`.
- Updated `mouse_fly` factory invariant test for LMB/trout allowance.

## Seasonal row cleanup strategy

`articulated_dungeon_streamer`:

- Launch row presence reduced from 828 to 262.
- Removed from all pike launch rows because pike-first flies already exist: `large_articulated_pike_streamer`, `pike_bunny_streamer`, and `pike_flash_fly`.
- Kept in LMB lake/pond spring/fall shoulder windows: March, April, May, October, November.
- Kept in SMB river streamer windows: March, April, May, September, October, November.
- Kept in trout river runoff/fall streamer windows: March, April, May, June, September, October, November.
- Removed from LMB river rows, SMB lake rows, pike rows, and broad summer rows where it was acting like universal Big Fish padding.

Pike launch lures:

- Removed these bass-coded lure IDs from pike launch rows only: `spinnerbait`, `squarebill_crankbait`, `flat_sided_crankbait`, `lipless_crankbait`, `deep_diving_crankbait`, `soft_jerkbait`, `buzzbait`.
- No broad replacement IDs were added. Remaining pike rows rely on existing pike-first and pike-credible inventory: `large_bucktail_spinner`, `large_profile_pike_swimbait`, `pike_jerkbait`, `pike_jig_and_plastic`, `large_pike_tube`, `large_pike_topwater`, `casting_spoon`, `blade_bait`, and `inline_spinner` where already authored.

Largemouth `mouse_fly`:

- Added to 64 LMB lake/pond rows only.
- Limited to launch months June-September.
- Limited to rows where `surface_seasonally_possible` is true.
- Not added to LMB river rows, spring shoulder rows, fall shoulder rows, smallmouth rows, pike rows, or trout lake/pond rows.

SMB `glidebait`:

- Preserved as-is: lake-only bass Big Fish inventory.
- No compact glidebait was added in QA-5A.

## Row count impact

Launch row authoring changes:

| ID | Before | After |
| --- | ---: | ---: |
| `articulated_dungeon_streamer` | 828 | 262 |
| `mouse_fly` | 59 | 123 |
| pike `spinnerbait` | 162 | 0 |
| pike `squarebill_crankbait` | 118 | 0 |
| pike `flat_sided_crankbait` | 118 | 0 |
| pike `lipless_crankbait` | 118 | 0 |
| pike `deep_diving_crankbait` | 81 | 0 |
| pike `soft_jerkbait` | 118 | 0 |
| pike `buzzbait` | 36 | 0 |

By species:

- LMB `articulated_dungeon_streamer`: 288 -> 80.
- LMB `mouse_fly`: 0 -> 64.
- SMB `articulated_dungeon_streamer`: 252 -> 84.
- Pike `articulated_dungeon_streamer`: 162 -> 0.
- Trout `articulated_dungeon_streamer`: 126 -> 98.

## Pool-health before/after

Launch harness before QA-5A:

- Rows: 828.
- Contexts: 9,234.
- Pool health: lure min/p10/median 6/7/16; fly min/p10/median 10/12/14.
- Thin contexts `<4`: 0.
- Failures: 0.
- Surface leaks: 0.
- Set B reuse reviews: 19.
- Goal-reasonless contexts: 86.

Launch harness after QA-5A:

- Rows: 828.
- Contexts: 9,234.
- Pool health: lure min/p10/median 6/6/16; fly min/p10/median 9/11/13.
- Thin contexts `<4`: 0.
- Failures: 0.
- Surface leaks: 0.
- Set B reuse reviews: 31.
- Goal-reasonless contexts: 183.

Interpretation:

- Pool health remains viable. No row became thin.
- The expected tradeoff is visible: removing universal Big Fish padding reduced broad fly pool depth and increased Big Fish goal-reasonless contexts. This is acceptable for QA-5A because it exposes honest inventory gaps instead of hiding them with `articulated_dungeon_streamer` everywhere.

## Big Fish pool impact by species

- LMB: gained 64 narrow Big Fish `mouse_fly` lake/pond surface rows; lost broad dungeon coverage from river rows and summer lake rows. Calm low-light mouse trace selected `mouse_fly` 57 times, all in Big Fish honorable slots, across 64 authored LMB lake/pond rows.
- SMB: lost broad lake dungeon coverage; retained river shoulder-season dungeon windows and existing lake-only `glidebait`.
- Pike: lost generic dungeon coverage and bass-coded lures; retained pike-first Big Fish inventory. Pike Set B reuse remains a red flag in cold/dirty river contexts.
- Trout: retained dungeon in spring/runoff/fall streamer windows; summer trout surface rows no longer rely on dungeon as default Big Fish padding.

## Surface-window impact

- No surface leaks in all requested harness sweeps.
- `mouse_fly` is now eligible for LMB only in rows that already had seasonal surface open and only under daily surface gates.
- Calm low-light launch sweep after QA-5A: 0 failures, 0 surface leaks, pool health lure 6/7/17 and fly 9/11/15.
- `mouse_fly` did not become universal: it appears in 64 LMB lake/pond rows and 59 trout river rows, 123 launch rows total.

## Harness results

Launch all scenarios after QA-5A:

- Rows: 828.
- Contexts: 9,234.
- Failures: 0.
- Surface leaks: 0.
- Pool health: lure 6/6/16; fly 9/11/13.
- Same-family with in-band alternative: 0 on Set A and Set B.

Launch calm low-light surface:

- Rows: 828.
- Contexts: 1,656.
- Failures: 0.
- Surface leaks: 0.
- Pool health: lure 6/7/17; fly 9/11/15.
- Set B reuse reviews: 0.

Launch dirty elevated river:

- Rows: 477.
- Contexts: 954.
- Failures: 0.
- Surface leaks: 0.
- Pool health: lure 6/6/14; fly 9/11/16.
- Set B reuse reviews: 18.
- Goal-reasonless contexts: 0.

## Commands run

```bash
git status --short
npm run check:seasonal-matrix
npm run gen:seasonal-rows-v4
npm run check:seasonal-matrix
npx tsc --noEmit
deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__
deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --scenario=calm_low_light_surface_stress --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --scenario=dirty_elevated_river --water=freshwater_river --exposure-days=7
```

Results:

- Final `npm run check:seasonal-matrix`: passed.
- `npm run gen:seasonal-rows-v4`: passed, 0 data quality warnings.
- `npx tsc --noEmit`: passed.
- Daily-picks/recommender suite: 135 passed, 0 failed.
- Catalog/factory/generated seasonal suite: 62 passed, 0 failed.
- Harness sweeps: all passed with 0 failures and 0 surface leaks.

Note: the first matrix check after CSV edits correctly reported generated-row mismatches. Regeneration fixed the mismatch, and the final matrix check passed.

## Remaining red flags

- Big Fish goal-reasonless launch contexts increased from 86 to 183 after removing universal dungeon padding. This is honest signal for QA-5B inventory/row work.
- `game_changer`, `clouser_minnow`, `articulated_baitfish_streamer`, and `unweighted_baitfish_streamer` remain broad fly inventory.
- Pike Set B reuse reviews remain in cold/dirty river contexts after pike bass-coded lure cleanup.
- Dirty river lures still show bass/SMB `spinnerbait` and `squarebill_crankbait` exposure; that is outside the pike-specific cleanup and should be reviewed separately by species.
- Adjacent-day repeats remain high and were intentionally not addressed.

## Proposed QA-5B expansion list

Do not add these without image/mapping coverage:

- `compact_glidebait`: SMB lake/pond Big Fish, smaller and clearer than current bass `glidebait`; needs catalog profile, seasonal rows, generated rows, image asset, tackle image manifest entry, and frontend/image mapping check.
- `warmwater_mouse_fly` or `bass_mouse_fly`: only if QA finds the shared `mouse_fly` copy/image is too trout-coded after LMB launch use; needs separate fly art and row mapping.
- `pike_spinnerbait` or `pike_safety_pin_spinner`: only if pike QA shows a true pike-specific spinnerbait gap after removing bass spinnerbait carryover; needs pike-scale image and distinct family/presentation metadata.
- `smallmouth_wake_fly` or compact topwater fly: if SMB river/lake Big Fish surface rows remain goal-reasonless without overusing deer hair slider/poppers; needs new image and narrow summer low-light rows.
- `clear_water_pike_baitfish_fly`: if pike clear-water AP/Big Fish rows over-concentrate on bucktail/spoon/jerkbait after cleanup; needs pike-first fly asset and mapping.

