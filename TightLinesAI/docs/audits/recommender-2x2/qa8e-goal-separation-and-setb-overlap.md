# QA8E Goal Separation And Set B Overlap

Date: 2026-05-09

## Executive Summary

QA8E audited the QA8D selector variety change for two regressions:
- AP/BF identical sets rose after QA8D.
- Set A/B overlap improved but remained high.

Confirmed issue:
- QA8D's condition-fit preference was too strong. When any in-band candidate had a `condition_tag:` reason, the selector could discard strong active-goal-fit candidates and make all-purpose and big-fish converge.

Fix made:
- Kept scoring weights, row authoring, catalog metadata, and hard gates unchanged.
- Kept QA8D quality bands and deterministic date variety.
- Changed selector fit ordering inside the existing quality band:
  1. active goal reason + daily condition reason
  2. priority daily condition reason for cold/dirty/runoff/current contexts
  3. active goal reason
  4. daily condition reason
  5. all in-band candidates
- Added an in-band caution-surface restraint: when `surface_daily_gate` is `caution`, prefer non-surface candidates if in-band alternatives exist.

Result:
- Launch AP/BF identical rate improved from QA8D `0.025` to `0.0002` (`821` to `6` contexts).
- All-month AP/BF identical rate improved from QA8D `0.034` to `0.0004` (`1472` to `19` contexts).
- Family-diversity violations stayed `0`.
- Set B full reuse stayed `0`.
- Surface leaks and caution-gate surface selections stayed `0`.

## What Changed

Selector:
- `selectDailyPicks.ts`
  - Added active-goal and condition reason inspection.
  - Added priority-condition handling for `cold_slow`, `dirty_vibration`, `runoff_streamer`, and `current_swing`.
  - Applied the clear-winner guard after in-band fit eligibility, so a raw leader that lacks the active fit lane does not override closer biological context.
  - Added non-surface preference under `surface_daily_gate: caution`, still only within the existing quality band.

Audit tooling:
- `daily-picks-quality-harness.ts`
  - Exposure audit now prints representative AP/BF identical contexts and Set A/B overlap contexts with selected IDs, families, scores, score reasons, goal/condition counts, and in-band alternatives.

Tests:
- Added selector coverage for:
  - active goal fit before condition-only fit when appropriate
  - active goal + condition fit outranking either alone
  - AP/BF separation when valid active-goal alternatives exist in-band
  - no surface candidate selected under caution when subsurface in-band alternatives exist

## AP/BF Identical Contexts Inspected

QA8D after-state:
- Launch: `821/32319` identical AP/BF sets (`0.025`).
- All-month: `1472/43092` identical AP/BF sets (`0.034`).

QA8E after-state:
- Launch: `6/32319` identical AP/BF sets (`0.0002`).
- All-month: `19/43092` identical AP/BF sets (`0.0004`).

Remaining launch examples are concentrated in cold-clear suppressed northern pike rows, mostly March/November river or cold lake cases. Representative pattern:
- AP and BF both select cold-slow bottom/mid pike tools such as `large_pike_tube`, `pike_jig_and_plastic`, `blade_bait`, `rabbit_strip_leech`, and `pike_bunny_streamer`.
- Both goals have valid goal-fit and condition-fit alternatives, but cold-slow priority correctly keeps the recommendation in the same narrow biological lane.
- Classification: acceptable constrained-pool / strong daily-condition case, not suspicious goal collapse.

## Condition-Fit Finding

Confirmed:
- The previous condition-first variety filter could erase AP/BF distinction when both goals shared the same condition-fit subset.
- Pure goal-first ordering fixed AP/BF but briefly allowed poor-context picks, especially dirty/bright surface or glide-style candidates and cold pike broad streamers.
- The final ordering keeps goal separation while preserving priority daily-condition restraint.

Preview fixtures caught and protected this:
- Dirty Florida bass Big Fish no longer promotes `glidebait`.
- Cold suppressed pike river keeps pike/cold inventory and avoids removed padding.
- Caution surface candidates no longer beat in-band subsurface alternatives.

## Set A/B Overlap Inspection

QA8E final metrics:

| Scope | QA8D Before | QA8D After | QA8E Final |
|---|---:|---:|---:|
| Launch Set A/B overlap | 0.511 | 0.475 | 0.490 |
| All-month Set A/B overlap | 0.485 | 0.457 | 0.468 |
| Launch Set B full reuse | 0 | 0 | 0 |
| All-month Set B full reuse | 0 | 0 | 0 |

Representative overlap traces show the same pattern:
- Set B receives Set A avoid IDs.
- Set B avoids IDs when alternatives exist inside the Top/HM quality band.
- Remaining overlaps usually happen when Set A already consumed the only non-weak candidates in the band.
- Example: cold-clear March LMB rows often have `suspending_jerkbait` as a 196-point leader, with the next non-Set-A alternatives below the Top quality band. Forcing a different Set B Top would require dropping below the band.

Classification:
- Set B overlap remains visible but is mostly acceptable under the no-weak-novelty rule.
- No Set B family/presentation avoidance change was made because the evidence did not justify leaving the existing quality band.

## Exposure Metrics

Launch months:

| Metric | QA8D Before | QA8D After | QA8E Final |
|---|---:|---:|---:|
| Set A adjacent exact repeat | 0.497 | 0.314 | 0.358 |
| Set B adjacent exact repeat | 0.240 | 0.167 | 0.232 |
| Slot ID repeat | 0.777 | 0.683 | 0.693 |
| Slot family repeat | 0.785 | 0.695 | 0.703 |
| Set A/B overlap | 0.511 | 0.475 | 0.490 |
| AP/BF identical | 0.002 | 0.025 | 0.0002 |
| Family violations | 0 | 0 | 0 |
| Broad-fly watch share | 0.752 | 0.758 | 0.766 |

All months:

| Metric | QA8D Before | QA8D After | QA8E Final |
|---|---:|---:|---:|
| Set A adjacent exact repeat | 0.496 | 0.311 | 0.359 |
| Set B adjacent exact repeat | 0.254 | 0.163 | 0.224 |
| Slot ID repeat | 0.780 | 0.679 | 0.696 |
| Slot family repeat | 0.795 | 0.694 | 0.709 |
| Set A/B overlap | 0.485 | 0.457 | 0.468 |
| AP/BF identical | 0.006 | 0.034 | 0.0004 |
| Family violations | 0 | 0 | 0 |
| Broad-fly watch share | 0.751 | 0.760 | 0.770 |

Tradeoff:
- QA8E intentionally gives back some QA8D repetition improvement to restore goal separation and condition restraint.
- Repetition remains substantially better than the pre-QA8D baseline for Set A and slot exposure.

## Harness And Replay Results

Launch harness:
- Rows: `828`
- Contexts: `9234`
- Failures: `0`
- Pool health: lure `6/7/17`, fly `6/9/13`, thin `<4` per side `0`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations with in-band alternative: `0`
- Identical AP/BF sets: `3/4617`

All-month harness:
- Rows: `1104`
- Contexts: `12312`
- Failures: `0`
- Pool health: lure `6/6/16`, fly `6/9/12`, thin `<4` per side `0`
- Geometry mismatches: `0`
- Surface leaks: `0`
- Caution surface selections: `0`
- Family-diversity violations with in-band alternative: `0`
- Identical AP/BF sets: `4/6156`

Archived-weather replay:
- Fixtures: `18`
- Goal runs: `36`
- Broad fly selected share: `0.528`
- AP/BF identical fixture sets: `0`
- Adjacent-day exact repeats: `1`

Broad-fly watch:
- Launch broad fly share: `0.766`
- All-month broad fly share: `0.769`
- This remains a watch metric, but QA8E did not tune fly catalog or row authoring.

## Proof No Weak Novelty Was Introduced

Selector safeguards:
- All candidates still come from hard-gated seasonal row pools.
- Variety still operates only inside the existing quality bands.
- Clear winners remain protected inside the active fit lane.
- Priority cold/dirty/runoff/current conditions cannot be erased by goal-only candidates.
- Caution surface candidates are not selected when in-band subsurface alternatives exist.

Test/harness proof:
- Full recommender Deno suite passed.
- Catalog/factory/generated integrity suite passed.
- Launch/all-month harnesses had `0` geometry mismatches, `0` surface leaks, `0` caution surface selections, and `0` thin contexts.

## Remaining Red Flags

- Set A/B overlap is still high: launch `0.490`, all-month `0.468`.
- Broad-fly share remains high in synthetic exposure: launch `0.766`, all-month `0.769`.
- QA8E restored AP/BF separation at a small cost to QA8D repetition wins.
- The remaining AP/BF identical cases are few and appear biologically legitimate, but they are cold-pike concentrated and worth keeping in the watch metric.

## Recommended Next Pass

QA8F should focus on Set B distinction without breaking quality bands:
- Trace overlap only where non-Set-A alternatives exist inside the Top/HM quality bands.
- Consider a Set B-only family/presentation preference inside the band, but do not force it below-band.
- Keep the QA8E goal/condition/caution ordering fixed unless new traces show a concrete regression.
- Keep broad-fly exposure as a watch metric for future row/scoring review, not as a selector-only problem.

## Commands Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-audit --exposure-days=7 --json`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-audit --exposure-days=7 --json`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --broad-fly-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --broad-fly-audit --exposure-days=7`
