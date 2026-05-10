# QA9A Post-Merge Five-Band Impact

Date: 2026-05-09

## Executive Summary

QA9A reconciled the current repo after the 5-band How's Fishing / verdict merge and checked whether the new bands damaged daily-picks lure/fly recommendations.

Findings:
- Local `main` and `origin/main` both point at `3037814604e6c418ba2682f4c2951d68362bd605`.
- The worktree is not clean. The recommender QA work, image assets, audit docs, and audit scripts remain dirty/untracked relative to `origin/main`.
- This is a coordination blocker for final QA9 validation: the current local behavior includes uncommitted recommender QA work and should not be assumed deployed or merged.
- Daily-picks does not import or consume `ScoreBand` strings. It uses only `analysis.scored.score` as a number.
- The 5-band merge changed band labels/thresholds, not the numeric score formula used by daily-picks.
- Daily-picks activity thresholds remain unchanged: `<=35 suppressed`, `36-69 neutral`, `>=70 active`.
- Typed Deno was initially blocked by stale 4-band summary copy keys. A tiny non-recommender fix aligned `summaryLine.ts` with `Tough/Poor/Fair/Good/Prime`; typed recommender Deno then passed.

No recommender tuning was done in this pass.

## Repo State

Commands run:
- `git fetch --all --prune`
- `git status -sb`
- `git log --oneline --decorate -5 --all`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git diff --stat`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`

Current branch:
- `main`

HEAD:
- `3037814604e6c418ba2682f4c2951d68362bd605`
- `3037814 (HEAD -> main, origin/main, claude/romantic-torvalds-83e9c3) Field-edition dashboard redesign + 5-band scoring`

Origin main:
- `3037814604e6c418ba2682f4c2951d68362bd605`

Recent history:
- `3037814 Field-edition dashboard redesign + 5-band scoring`
- `ba0e7ec Complete daily-picks 2x2 recommender renovation`
- `714eb97 Pass-7 Water Read: blue water gradient + olive island land`
- `d11f87e Pass-6 Daily Read: renovate the report view as a curated field-edition`
- `42b55f0 Pass-5 Water Read: legend/SVG color sync, wordmark stamp, search padding`

Worktree:
- Dirty.
- `git diff --stat` reported `101 files changed, 4209 insertions(+), 2380 deletions(-)` before the QA9A summary fix/doc.
- Untracked files include QA audit docs from QA2 through QA8F, daily-picks audit scripts, new tackle image assets, and reference images.

Coordination blocker:
- The working tree contains substantial local recommender QA state relative to `origin/main`.
- Final QA should be run against the intended official state after Brandon confirms whether the dirty recommender QA changes are meant to be included.

## Five-Band Code Impact

Current score bands:
- `Prime >= 80`
- `Good >= 65`
- `Fair >= 50`
- `Poor >= 35`
- `Tough < 35`

Compared with the previous `ba0e7ec` state:
- `ScoreBand` changed from `"Poor" | "Fair" | "Good" | "Excellent"` to `"Tough" | "Poor" | "Fair" | "Good" | "Prime"`.
- `bandFromScore` changed from `Excellent >=80 / Good >=60 / Fair >=40 / Poor <40` to the new 5-band thresholds.
- The numeric score formula did not change:
  - `POSITIVE_RAW_SCORE_DIVISOR = 3.2`
  - `NEGATIVE_RAW_SCORE_DIVISOR = 4`
  - `50 + rawSum / divisor`, clamped `10..100`

Daily-picks behavior:
- `buildDailyScenario.ts` reads `analysis.scored.score`.
- It does not read `analysis.scored.band`.
- It does not import `ScoreBand`.
- It maps numeric score to activity:
  - `score <= 35` -> `suppressed`
  - `score >= 70` -> `active`
  - otherwise `neutral`

Impact conclusion:
- The 5-band label/threshold change does not directly alter daily-picks selection.
- Daily-picks can still change only if the upstream numeric score changes; this merge did not change the numeric formula.

## Activity Threshold Review

Current thresholds still make biological sense as conservative daily-picks modifiers:
- `Good` scores from `65-69` remain `neutral`, not `active`.
- This is acceptable for launch because daily-picks should not over-promote surface/reaction just because a day is labeled Good.
- `Poor` at exactly `35` is `suppressed`; `36-49` is `neutral`.
- This is also acceptable for now because `35` is the bottom edge of Poor and the surface gate should remain conservative there.

Review later:
- Whether `Good 65-69` should become lightly active.
- Whether `Poor 36-49` should receive a softer suppressed/neutral split.

No threshold change is recommended in QA9A.

## Typed Deno Fix

Initial typed recommender Deno status:
- Blocked by `summaryLine.ts`.
- Error: `Object literal may only specify known properties, and 'Excellent' does not exist in type 'Record<ScoreBand, readonly string[]>'.`

Fix:
- Updated `OPENERS` keys in `supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts`:
  - `Excellent` -> `Prime`
  - kept `Good`, `Fair`, `Poor`
  - added `Tough`
- This is non-recommender surface copy plumbing only.
- No daily-picks runtime behavior was touched for this fix.

Typed recommender Deno after fix:
- `142 passed`

## Verification Results

Seasonal matrix:
- `npm run check:seasonal-matrix` passed.
- `npm run gen:seasonal-rows-v4` wrote 384 LMB, 336 SMB, 216 pike, 168 trout rows; `DATA_QUALITY_WARN count: 0`.
- Second `npm run check:seasonal-matrix` passed.

TypeScript:
- `npx tsc --noEmit` passed.

Deno:
- Recommender/daily-picks suite: `142 passed`.
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
- Identical AP/BF sets: `3/4617`
- Set B reuse reviews: `44/9234`

All-month harness:
- Rows: `1104`
- Contexts: `12312`
- Failures: `0`
- Pool health: lure `6/6/16`, fly `6/9/12`, thin `<4` per side `0`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations: `0`
- Identical AP/BF sets: `4/6156`
- Set B reuse reviews: `95/12312`

Archived-weather replay:
- Fixtures: `18`
- Goal runs: `36`
- Broad fly selected share: `0.528`
- AP/BF identical fixture sets: `0`
- Adjacent-day exact repeats: `1`

Broad-fly watch:
- Launch broad fly share: `28280/36936` (`0.766`)
- All-month broad fly share: `37877/49248` (`0.769`)

## Exposure Metrics Versus QA8F

Launch:

| Metric | QA8F | QA9A |
|---|---:|---:|
| Set A adjacent exact repeat | 0.358 | 0.358 |
| Set B adjacent exact repeat | 0.232 | 0.232 |
| Slot ID repeat | 0.693 | 0.693 |
| Slot family repeat | 0.703 | 0.703 |
| Set A/B overlap | 0.490 | 0.490 |
| Set B full reuse | 0 | 0 |
| AP/BF identical | 0.0002 | 0.0002 |
| AP/BF identical count | 6 | 6 |
| Family violations | 0 | 0 |
| Broad-fly watch share | 0.766 | 0.766 |

All months:

| Metric | QA8F | QA9A |
|---|---:|---:|
| Set A adjacent exact repeat | 0.359 | 0.359 |
| Set B adjacent exact repeat | 0.224 | 0.224 |
| Slot ID repeat | 0.696 | 0.696 |
| Slot family repeat | 0.709 | 0.709 |
| Set A/B overlap | 0.468 | 0.468 |
| Set B full reuse | 0 | 0 |
| AP/BF identical | 0.0004 | 0.0004 |
| AP/BF identical count | 19 | 19 |
| Family violations | 0 | 0 |
| Broad-fly watch share | 0.770 | 0.770 |

Conclusion:
- Metrics are unchanged from QA8F.
- No evidence that the 5-band merge damaged the lure/fly recommender.

## Blockers Before QA9 Final Validation

Primary blocker:
- The worktree is dirty and contains local recommender QA changes and untracked QA assets/docs/scripts.
- Need Brandon confirmation on whether QA9 final validation should use:
  - current dirty local QA state, or
  - clean `origin/main`, or
  - a branch/commit containing the intended recommender QA work.

Secondary watch items:
- Set A/B overlap remains visible: launch `0.490`, all-month `0.468`.
- Broad-fly share remains high: launch `0.766`, all-month `0.769`.
- Daily-picks activity thresholds may deserve a later product review against the new 5-band language, but there is no break.

## Recommended Next Pass

QA9B final product validation should run only after the intended code state is clarified.

Recommended focus:
- Confirm deployment/merge state for QA2-QA8 recommender changes.
- Re-run final launch product validation on that exact state.
- Decide whether to accept current Set B overlap as the no-weak-novelty tradeoff.
- Keep activity thresholds unchanged unless a product decision says Good/Poor labels should influence daily-picks activity differently.

## Commands Run

- `git fetch --all --prune`
- `git status -sb`
- `git log --oneline --decorate -5 --all`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `git diff --stat`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --broad-fly-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --broad-fly-audit --exposure-days=7`
