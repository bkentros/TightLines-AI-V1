# QA8F Set B Distinction

Date: 2026-05-09

## Executive Summary

QA8F audited whether Set B overlap could be reduced without weakening the recommender.

Conclusion:
- No runtime selector change was retained.
- Set B overlap is still visible, but the representative traces show that much of it is caused by no non-Set-A candidate inside the existing quality band on the overlapping side.
- A Set B-only family/presentation preference was tested locally and rejected because it did not reduce Set A/B overlap and made Set B adjacent repeats worse.
- The correct launch tradeoff remains QA8E behavior: avoid Set A IDs when in-band alternatives exist, preserve quality bands, preserve goal/condition/caution ordering, and avoid weak novelty.

Only audit tooling and documentation were kept.

## What Was Audited

QA8F extended the exposure audit to print richer Set A/B overlap traces:
- Set A and Set B selected IDs.
- Family and presentation group for every selected slot.
- Top-band candidates for Set B by side.
- Non-Set-A in-band alternatives.
- Different-family and different-presentation alternatives inside the top band.
- Score reasons for top alternatives.

## Set B Overlap Contexts Inspected

Representative launch overlap pattern:
- `largemouth_bass/appalachian/m3/freshwater_lake_pond cold_clear_suppressed all_purpose`
- Set A: `suspending_jerkbait`, `tube_jig`, `unweighted_baitfish_streamer`, `woolly_bugger`
- Set B: `suspending_jerkbait`, `finesse_jig`, `lead_eye_leech`, `clouser_minnow`

Trace classification:
- Lure overlap was acceptable: Set B's lure top band contained only `suspending_jerkbait` and `tube_jig`, both already used by Set A. Non-Set-A lure alternatives such as `flat_sided_crankbait` and `finesse_jig` were below the Top quality band.
- Fly side had non-Set-A family alternatives, but the overlap sample did not reuse fly IDs. Remaining fly lane similarity is mostly presentation-level baitfish/leech concentration, not a Set B full-reuse failure.

Observed categories:
- Acceptable: no strong in-band alternative on the overlapping side.
- Acceptable: cold/clear/cold-slow biology creates narrow high-confidence lanes.
- Watch: fly presentation groups still concentrate around baitfish/leech in cold-clear rows.
- Not confirmed: Set B systematically ignoring strong different-family alternatives inside the quality band.

## Experimental Selector Check

An experimental Set B-only lane preference was evaluated:
- Avoid Set A IDs first.
- Within the existing QA8E fit-eligible quality band, prefer candidates not sharing Set A `family_group`.
- Then prefer candidates not sharing Set A `presentation_group`.
- Preserve the clear-winner guard and do not leave the quality band.

Result:
- Launch Set A/B overlap stayed `0.490`.
- All-month Set A/B overlap stayed `0.468`.
- Launch Set B adjacent exact repeats worsened from `0.232` to `0.326`.
- All-month Set B adjacent exact repeats worsened from `0.224` to `0.319`.

Decision:
- Rejected and not retained. It did not solve overlap and made Set B feel more repetitive.

## Final Metrics

Launch months:

| Metric | QA8E Final | QA8F Final |
|---|---:|---:|
| Set A/B overlap | 0.490 | 0.490 |
| Set B full reuse | 0 | 0 |
| Set B adjacent exact repeat | 0.232 | 0.232 |
| Slot ID repeat | 0.693 | 0.693 |
| Slot family repeat | 0.703 | 0.703 |
| AP/BF identical | 0.0002 | 0.0002 |
| Family violations | 0 | 0 |
| Broad-fly watch share | 0.766 | 0.766 |

All months:

| Metric | QA8E Final | QA8F Final |
|---|---:|---:|
| Set A/B overlap | 0.468 | 0.468 |
| Set B full reuse | 0 | 0 |
| Set B adjacent exact repeat | 0.224 | 0.224 |
| Slot ID repeat | 0.696 | 0.696 |
| Slot family repeat | 0.709 | 0.709 |
| AP/BF identical | 0.0004 | 0.0004 |
| Family violations | 0 | 0 |
| Broad-fly watch share | 0.770 | 0.770 |

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
- Set B reuse reviews: `44/9234`

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
- Set B reuse reviews: `95/12312`

Archived replay:
- Fixtures: `18`
- Goal runs: `36`
- Broad fly selected share: `0.528`
- AP/BF identical fixture sets: `0`

Broad-fly watch:
- Launch: `28280/36936` fly slots (`0.766`)
- All-month: `37877/49248` fly slots (`0.769`)

## Proof No Weak Novelty Was Introduced

Because no runtime selector change was retained:
- QA8E hard-gated pool behavior is unchanged.
- QA8E active-goal / priority-condition / caution-surface ordering is unchanged.
- Top/HM same-set family diversity is unchanged.
- Set B still avoids Set A IDs when alternatives exist.
- No candidate is selected below the quality band for novelty.

Harness proof:
- `0` geometry mismatches.
- `0` surface leaks.
- `0` caution surface selections.
- `0` family-diversity violations.
- `0` Set B full reuse.

## Test Notes

The required typed Deno command:
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`

Result:
- Blocked during type-check by unrelated dirty-worktree code in `supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts`:
  - `Object literal may only specify known properties, and 'Excellent' does not exist in type 'Record<ScoreBand, readonly string[]>'.`

Follow-up verification:
- The same recommender/daily-picks suite passed with `--no-check`: `142 passed`.
- `npx tsc --noEmit` passed.
- Catalog/factory/generated suite passed: `69 passed`.

## Remaining Red Flags

- Set A/B overlap remains visible: launch `0.490`, all-month `0.468`.
- Remaining overlap appears to be mostly quality-band limited, not a simple selector-lane bug.
- Broad-fly exposure remains high and should stay on the watch dashboard.
- There is an unrelated type-check blocker in howFishing summary code that should be cleaned up before relying on typed Deno suite status.

## Recommended Next Pass

Move to QA8G with a product-level decision:
- Either accept current Set B overlap as the no-weak-novelty tradeoff for launch.
- Or define a slightly wider Set B-only quality band as an explicit product change, then test it as a new behavior, not as a hidden selector preference.

Do not tune Set B family/presentation lanes further inside the current band unless a new trace shows strong in-band alternatives being skipped.

## Commands Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test --no-check -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-audit --exposure-days=7 --json`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-audit --exposure-days=7 --json`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --broad-fly-audit --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --broad-fly-audit --exposure-days=7`
