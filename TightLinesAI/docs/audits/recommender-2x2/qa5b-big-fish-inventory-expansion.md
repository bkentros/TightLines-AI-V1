# QA-5B Big Fish and Pike-First Inventory Expansion

Date: 2026-05-09

Scope: controlled catalog and seasonal-row expansion after QA-5A exposed honest Big Fish gaps. No scoring weights, runtime gates, selector behavior, or broad fallback borrowing changed.

## Files changed

- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `lib/lureImages.ts`
- `lib/flyImages.ts`
- `scripts/data/recommenderTackleImageManifest.ts`
- `assets/images/lures/compact_glidebait.png`
- `assets/images/lures/magnum_jerkbait.png`
- `assets/images/lures/big_smallmouth_tube.png`
- `assets/images/lures/wake_bait.png`
- `assets/images/lures/magnum_worm.png`
- `assets/images/lures/pike_spinnerbait.png`
- `assets/images/lures/weedless_spoon.png`
- `assets/images/lures/shallow_minnowbait.png`
- `assets/images/lures/pike_glidebait.png`
- `assets/images/flies/bluegill_streamer.png`
- `docs/audits/recommender-2x2/qa5b-big-fish-inventory-expansion.md`

## New archetypes added

Lures:

- `compact_glidebait`: smallmouth-only lake/pond Big Fish glidebait.
- `magnum_jerkbait`: LMB/SMB shoulder-season Big Fish jerkbait.
- `big_smallmouth_tube`: SMB-only bottom Big Fish tube.
- `wake_bait`: LMB/SMB lake/pond surface Big Fish wake bait.
- `magnum_worm`: LMB-only lake/pond Big Fish worm.
- `pike_spinnerbait`: pike-only All Purpose / Big Fish spinnerbait.
- `weedless_spoon`: pike-only lake/pond cover spoon.
- `shallow_minnowbait`: pike-only All Purpose shallow minnowbait.
- `pike_glidebait`: pike-only lake/pond Big Fish glidebait.

Fly:

- `bluegill_streamer`: LMB-only lake/pond Big Fish bluegill/panfish streamer.

Rejected / deferred:

- `large_spoon`: deferred in favor of `weedless_spoon` because existing `casting_spoon` already covers open-water spooning.
- `rubber_pike_bait`: deferred in favor of `pike_glidebait`; rubber pike bait needs a more specific image/product slot.

## Image and mapping coverage

Each new ID has:

- A catalog profile.
- A `scripts/data/recommenderTackleImageManifest.ts` prompt entry.
- A generated PNG in `assets/images/lures/` or `assets/images/flies/`.
- A frontend mapping in `lib/lureImages.ts` or `lib/flyImages.ts`.
- A catalog validation test that checks manifest, frontend mapping text, and asset file existence.

Note: images were generated with the repo tackle image generator using opaque paper background output. Human visual QA and alpha stripping were not done in this pass.

## Seasonal rows changed

Launch-month authoring additions:

| Species | ID | Launch rows |
| --- | --- | ---: |
| LMB | `magnum_jerkbait` | 192 |
| LMB | `wake_bait` | 75 |
| LMB | `magnum_worm` | 64 |
| LMB | `bluegill_streamer` | 80 |
| SMB | `compact_glidebait` | 84 |
| SMB | `magnum_jerkbait` | 168 |
| SMB | `big_smallmouth_tube` | 252 |
| SMB | `wake_bait` | 56 |
| Pike | `pike_spinnerbait` | 162 |
| Pike | `shallow_minnowbait` | 162 |
| Pike | `weedless_spoon` | 45 |
| Pike | `pike_glidebait` | 54 |

No trout rows were expanded in QA-5B.

## Big Fish pool impact by species

Catalog-level Big Fish-capable inventory:

| Species | QA-5A total | QA-5B total | Change |
| --- | ---: | ---: | ---: |
| Largemouth bass | 15 | 19 | +4 |
| Smallmouth bass | 12 | 16 | +4 |
| Northern pike | 19 | 22 | +3 |
| Trout | 8 | 8 | 0 |

Current QA-5B launch row Big Fish-authored depth:

| Species | Min | P10 | Median |
| --- | ---: | ---: | ---: |
| Largemouth bass | 6 | 6 | 8 |
| Smallmouth bass | 6 | 7 | 8 |
| Northern pike | 10 | 10 | 11 |
| Trout | 5 | 5 | 5 |

Interpretation:

- SMB now has a real lake Big Fish glide lane and a separate bottom tube lane instead of overloading the original `glidebait` or generic `tube_jig`.
- LMB gains warm lake/pond Big Fish variety across worm, wake, jerkbait, and fly streamer lanes.
- Pike gains pike-first All Purpose and Big Fish coverage without restoring generic bass spinnerbait/crankbait carryover.
- Trout remains unchanged by design.

## Harness before / after

QA-5A launch baseline:

- Pool health: lure 6/6/16; fly 9/11/13.
- Condition-reason rate: 0.655.
- Goal-reason rate: 0.830.
- Set B reuse reviews: 31/9234.
- Identical AP/BF sets: 25/4617.
- Surface leaks: 0.

QA-5B launch result:

- Pool health: lure 6/7/17; fly 9/11/14.
- Condition-reason rate: 0.668.
- Goal-reason rate: 0.880.
- Set B reuse reviews: 15/9234.
- Identical AP/BF sets: 13/4617.
- Surface leaks: 0.

Calm low-light surface:

- QA-5A: lure 6/7/17; fly 9/11/15; goal-reason rate 0.897; surface leaks 0.
- QA-5B: lure 6/7/18; fly 9/11/15; goal-reason rate 0.908; surface leaks 0.

Dirty elevated river:

- QA-5A: lure 6/6/14; fly 9/11/16; goal-reason rate 0.870; Set B reuse 18/954.
- QA-5B: lure 6/6/14; fly 9/11/16; goal-reason rate 0.907; Set B reuse 14/954.

Family-diversity diagnostics remained clean: same-family with in-band alternative stayed 0 for Set A and Set B, lures and flies.

## Tests run

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

- Final matrix check passed.
- Seasonal generation passed with `DATA_QUALITY_WARN count: 0`.
- TypeScript passed.
- Daily-picks/recommender suite passed: 135 passed, 0 failed.
- Catalog/factory/generated integrity suite passed: 64 passed, 0 failed.
- Harness sweeps passed with 0 failures and 0 surface leaks.

## Red flags

- LMB river Big Fish contexts still show goal-reasonless review samples. QA-5B intentionally did not add broad river Big Fish padding.
- Broad flies still dominate many selected fly slots: `clouser_minnow`, `game_changer`, and existing baitfish streamers remain high-volume.
- Dirty river Set B reuse improved but still appears in LMB/SMB Big Fish contexts.
- Adjacent-day repeats remain high; this was explicitly out of scope.
- New images are generated assets, but not human-approved or alpha-stripped yet.

## Caveats

- No scoring weights, selector rules, surface gates, or runtime rescue/fallback behavior changed.
- No seasonal row was widened to fit a new archetype. Two catalog column corrections were made during matrix validation: `shallow_minnowbait` and `weedless_spoon` were set to `mid` rather than widening pike rows.
- Existing dirty worktree files from QA2-QA5A and unrelated image work were not rolled back.
