# QA9B State Reconciliation

Date: 2026-05-09

## Executive Summary

QA9B reconciled the current local daily-picks QA state against the official repo state after the 5-band How's Fishing work and the recommender asset update on `main`.

Findings:
- Current branch is `main`.
- `HEAD` and `origin/main` both point at `fd0fac53a584cffb4085368a33ca1e7f70e5bfa9`.
- The worktree is still dirty relative to `origin/main`.
- The dirty state is internally coherent: seasonal matrix checks, generation, TypeScript, recommender Deno suites, launch/all-month harnesses, archived replay, and broad-fly audits passed.
- The dirty files are a mix of recommender QA implementation, recommender QA docs/scripts, generated seasonal rows, one 5-band type-correctness fix, and unrelated/reference assets that need Brandon confirmation before inclusion.
- The 5-band verdict system still does not directly affect daily-picks lure/fly selection. Daily-picks consumes numeric `analysis.scored.score`, not `ScoreBand` labels.

No recommender behavior was tuned in this pass.

## Repo State Commands

Commands run:
- `git fetch --all --prune`
- `git status -sb`
- `git log --oneline --decorate -8 --all`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git diff --stat`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`

Current branch:
- `main`

HEAD:
- `fd0fac53a584cffb4085368a33ca1e7f70e5bfa9`
- `fd0fac5 (HEAD -> main, origin/main) assets: update recommender lure and fly PNGs`

Origin main:
- `fd0fac53a584cffb4085368a33ca1e7f70e5bfa9`

Recent history:
- `fd0fac5 assets: update recommender lure and fly PNGs`
- `3037814 Field-edition dashboard redesign + 5-band scoring`
- `ba0e7ec Complete daily-picks 2x2 recommender renovation`
- `714eb97 Pass-7 Water Read: blue water gradient + olive island land`
- `d11f87e Pass-6 Daily Read: renovate the report view as a curated field-edition`
- `42b55f0 Pass-5 Water Read: legend/SVG color sync, wordmark stamp, search padding`
- `e57abab Pass-4 Water Read: brighter zones, bigger legend swatches, polished stamp`
- `b77738c Pass-3 Water Read: bigger map, brighter zones, true scale, polished chrome`

Worktree:
- Dirty.
- `git diff --stat`: `32 files changed, 4224 insertions(+), 2381 deletions(-)`.

## Modified Files

Modified relative to `origin/main`:
- `assets/images/misty-pines.png`
- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/trout.csv`
- `deno.lock`
- `lib/flyImages.ts`
- `lib/lureImages.ts`
- `lib/recommenderContracts.ts`
- `scripts/data/recommenderTackleImageManifest.ts`
- `scripts/generate-recommender-tackle-images.ts`
- `scripts/strip-recommender-tackle-backgrounds.sh`
- `supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`
- `supabase/functions/recommender/dailyPicksSession.test.ts`

Untracked:
- `assets/reference/fly-examples/deer-hair-slider-user-reference.png`
- `assets/reference/fly-examples/foam-gurgler-user-reference.png`
- `assets/reference/fly-examples/frog-fly-user-reference.png`
- `assets/reference/fly-examples/lead-eye-leech-user-reference.png`
- `assets/reference/fly-examples/rabbit-strip-leech-user-reference.png`
- `assets/reference/fly-examples/sculpzilla-user-reference.png`
- `assets/reference/fly-examples/warmwater-worm-fly-user-reference.png`
- `assets/reference/fly-examples/zonker-streamer-user-reference.png`
- `docs/audits/recommender-2x2/quality-audit-master-plan.md`
- `docs/audits/recommender-2x2/qa2-catalog-truth-audit.md`
- `docs/audits/recommender-2x2/qa3-seasonal-row-biology-and-selector-policy.md`
- `docs/audits/recommender-2x2/qa4-selector-family-diversity.md`
- `docs/audits/recommender-2x2/qa5a-catalog-row-cleanup.md`
- `docs/audits/recommender-2x2/qa5b-big-fish-inventory-expansion.md`
- `docs/audits/recommender-2x2/qa5c-profile-tag-selection-audit.md`
- `docs/audits/recommender-2x2/qa6-archived-weather-replay.md`
- `docs/audits/recommender-2x2/qa7-targeted-behavior-tuning.md`
- `docs/audits/recommender-2x2/qa8a-month-region-daily-condition-audit.md`
- `docs/audits/recommender-2x2/qa8a1-all-month-row-color-audit.md`
- `docs/audits/recommender-2x2/qa8a2-regional-seasonal-envelope-audit.md`
- `docs/audits/recommender-2x2/qa8b-launch-watchlist-row-tuning.md`
- `docs/audits/recommender-2x2/qa8c-broad-fly-row-authoring-cleanup.md`
- `docs/audits/recommender-2x2/qa8d-exposure-variety-policy.md`
- `docs/audits/recommender-2x2/qa8e-goal-separation-and-setb-overlap.md`
- `docs/audits/recommender-2x2/qa8f-setb-distinction.md`
- `docs/audits/recommender-2x2/qa9a-post-merge-five-band-impact.md`
- `docs/audits/recommender-2x2/qa9b-state-reconciliation.md`
- `scripts/audit/daily-picks-archived-weather-replay.ts`
- `scripts/audit/daily-picks-quality-harness.ts`
- `scripts/strip-recommender-tackle-chroma-key.ts`

## Dirty File Classification

### Must Include For Recommender QA

Daily-picks selector, scoring, diagnostics, contracts, and tests:
- `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts`
- `supabase/functions/recommender/dailyPicksSession.test.ts`
- `lib/recommenderContracts.ts`

Catalog, factory, contracts, and invariant tests:
- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`

Seasonal row source, generated rows, and integrity tests:
- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/trout.csv`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`

Recommender image mappings and manifest/tooling:
- `lib/flyImages.ts`
- `lib/lureImages.ts`
- `scripts/data/recommenderTackleImageManifest.ts`
- `scripts/generate-recommender-tackle-images.ts`
- `scripts/strip-recommender-tackle-backgrounds.sh`

Audit harnesses and replay scripts:
- `scripts/audit/daily-picks-quality-harness.ts`
- `scripts/audit/daily-picks-archived-weather-replay.ts`

Audit documentation:
- `docs/audits/recommender-2x2/quality-audit-master-plan.md`
- `docs/audits/recommender-2x2/qa2-catalog-truth-audit.md` through `qa9b-state-reconciliation.md`

### Must Include For 5-Band Type Correctness

- `supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts`

This is the tiny non-recommender fix that aligns summary copy keys with the current 5-band `ScoreBand` type: `Tough`, `Poor`, `Fair`, `Good`, `Prime`.

### Needs Brandon Confirmation

- `assets/images/misty-pines.png`
- `assets/reference/fly-examples/*.png`
- `scripts/strip-recommender-tackle-chroma-key.ts`

These look like image/reference/helper assets rather than required recommender runtime logic. They should not be included in a recommender QA commit unless Brandon confirms they are intended project artifacts.

### Generated Or Tooling State

- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts`
- `deno.lock`

Generated seasonal files should travel with the CSV changes. `deno.lock` should be included if it reflects required test/tooling import resolution from the audit harnesses or updated Deno suites.

## Verification Results

Seasonal matrix:
- `npm run check:seasonal-matrix`: passed.
- `npm run gen:seasonal-rows-v4`: wrote 384 LMB, 336 SMB, 216 pike, and 168 trout rows; `DATA_QUALITY_WARN count: 0`.
- Second `npm run check:seasonal-matrix`: passed.

TypeScript:
- `npx tsc --noEmit`: passed.

Deno:
- Recommender/daily-picks typed suite: `142 passed`.
- Catalog/factory/generated integrity suite: `69 passed`.

Launch harness:
- Rows: `828`
- Contexts: `9234`
- Failures: `0`
- Pool health: lure `6/7/17`, fly `6/9/13`, thin `<4` per side `0`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations: `0`
- Set B reuse reviews: `44/9234`
- Identical AP/BF sets: `3/4617`
- Adjacent-day repeated sets over 7 days: `7242`

All-month harness:
- Rows: `1104`
- Contexts: `12312`
- Failures: `0`
- Pool health: lure `6/6/16`, fly `6/9/12`, thin `<4` per side `0`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations: `0`
- Set B reuse reviews: `95/12312`
- Identical AP/BF sets: `4/6156`
- Adjacent-day repeated sets over 7 days: `9737`

Archived-weather replay:
- Fixtures: `18`
- Goal runs: `36`
- Broad fly selected share: `0.528`
- AP/BF identical fixture sets: `0`
- Adjacent-day exact repeats: `1`

Broad-fly audit:
- Launch broad fly selected slots: `28280/36936` (`0.766`)
- Launch fly pool health: min/p10/median `6/9/13`, thin `<4` `0`
- All-month broad fly selected slots: `37877/49248` (`0.769`)
- All-month fly pool health: min/p10/median `6/9/12`, thin `<4` `0`

## Five-Band Impact On Daily-Picks

The 5-band verdict system does not directly affect daily-picks lure/fly selection:
- Daily-picks reads numeric `analysis.scored.score`.
- Daily-picks does not import or consume `ScoreBand`.
- Daily-picks activity mapping remains numeric:
  - `<=35` -> `suppressed`
  - `36-69` -> `neutral`
  - `>=70` -> `active`
- The QA9A `summaryLine.ts` fix was type/copy alignment for How's Fishing summary labels only.

Review later:
- Whether `Good` scores from `65-69` should remain `neutral` or become lightly active.
- Whether `Poor` scores from `36-49` should remain `neutral`.

No change is recommended before QA9 final validation.

## Recommended Commit Plan

Do not commit until Brandon confirms the intended grouping. Suggested grouping:

1. `Finalize daily-picks recommender QA tuning`
   - Runtime selector/scoring/diagnostics changes.
   - v4 catalog/factory/contracts changes.
   - seasonal CSV and generated seasonal row changes.
   - recommender tests and shared contracts.
   - recommender image maps and manifest updates needed by QA5B inventory.

2. `Add daily-picks audit harnesses and QA reports`
   - `scripts/audit/daily-picks-quality-harness.ts`
   - `scripts/audit/daily-picks-archived-weather-replay.ts`
   - QA docs from the master plan through QA9B.

3. `Align How's Fishing summary copy with 5-band score labels`
   - `supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts`

4. Optional asset/reference/helper commit, only if Brandon confirms:
   - `assets/images/misty-pines.png`
   - `assets/reference/fly-examples/*.png`
   - `scripts/strip-recommender-tackle-chroma-key.ts`

## Blockers Before QA9 Final Validation

Primary blocker:
- The worktree is dirty. QA9 final validation should run against the intended official state, ideally after Brandon confirms which dirty/untracked files belong in the recommender QA branch/commit set.

Coordination notes:
- `HEAD` already matches `origin/main`; the blocker is not branch drift, it is uncommitted local QA state.
- The current dirty state passes the required verification suite.
- If Brandon accepts this dirty state as the intended recommender QA state, commit grouping should happen before final QA9 product validation so the exact validation target is reproducible.

Remaining product watch items, not state blockers:
- Broad-fly selected share remains high: launch `0.766`, all-month `0.769`.
- Set B overlap/reuse review queues remain visible, but no Set B full-reuse break or family-diversity violation appeared in this pass.

## Recommended Next Pass

After Brandon confirms commit scope, create the commit groups or branch, then run QA9 final product validation on the committed intended state.
