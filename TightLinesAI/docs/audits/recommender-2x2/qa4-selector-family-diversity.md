# QA-4 Selector Family-Diversity Implementation

Date: 2026-05-08

Scope: narrow selector/test pass for the daily-picks 2x2 recommender. No catalog metadata, seasonal CSV rows, scoring weights, surface gates, or row authoring were tuned.

## Summary

Implemented the QA-3 product rule: Top Pick and Honorable Mention must not share `family_group` on the same side when a valid different-family candidate exists inside the Honorable Mention quality band.

The selector still uses the same hard-gated candidate pool, Top Pick behavior, quality bands, deterministic jitter, and avoid-ID flow. The only selection behavior change is inside Honorable Mention: after building the existing honorable band, the selector filters to different-family candidates when any are available in that band.

## Selector behavior before

Top Pick:

- Used hard-gated candidates only.
- Chose from the Top Pick quality band.
- Applied deterministic jitter inside that band.

Honorable Mention:

- Removed the Top Pick ID.
- Built the Honorable Mention quality band.
- Applied Set B avoid IDs when possible.
- Used score plus diversity bonus plus deterministic jitter.
- Could choose the same `family_group` as Top Pick even when a different-family candidate existed in band.

Set B:

- Avoided Set A IDs when alternatives existed.
- Used the same Honorable Mention logic as Set A, so it inherited the same same-family risk.

## Selector behavior after

Top Pick:

- Unchanged.

Honorable Mention:

- Removes the Top Pick ID.
- Builds the existing Honorable Mention quality band exactly as before.
- If any in-band candidate has a different `family_group` from Top Pick, limits selection to those different-family candidates.
- Applies Set B avoid IDs only within that family-valid subset when possible.
- Uses the existing diversity bonus and deterministic jitter inside the final eligible set.
- Allows same-family reuse only when no different-family candidate exists inside the quality band.
- Never selects below the quality band to force family diversity.

Set B:

- Inherits the same family-diversity rule.
- Still avoids Set A IDs when alternatives exist inside the eligible set.
- Does not use weak, invalid, or out-of-band novelty.

## Diagnostics added

Added `diagnostics.family_diversity` to the engine/response diagnostics:

```ts
family_diversity: {
  lures: {
    top_family_group: string;
    honorable_family_group: string;
    different_family_selected: boolean;
    different_family_available_in_band: boolean;
  };
  flies: {
    top_family_group: string;
    honorable_family_group: string;
    different_family_selected: boolean;
    different_family_available_in_band: boolean;
  };
}
```

The frontend mirror in `lib/recommenderContracts.ts` was updated. No visible UI was added.

## Tests added

Selector tests:

- Honorable Mention chooses different family when an in-band alternative exists.
- Honorable Mention may reuse family when every in-band candidate shares Top Pick family.
- Honorable Mention does not drop outside the quality band for family diversity.
- Family diversity outranks presentation diversity.
- Variant B avoidance still works with family diversity.

Engine/response tests:

- Engine diagnostics include family-diversity status.
- Selected Top/Honorable families differ when in-band alternatives exist.
- Response diagnostics preserve family-diversity fields.

Session test fixtures were updated to include the new diagnostics shape.

## Harness update

The quality harness now reports:

- Set A same-family Top/Honorable cases with in-band different-family alternatives.
- Set B same-family Top/Honorable cases with in-band different-family alternatives.
- `--launch-months` filter for March through November.

## Harness before/after

QA-3 baseline launch-month evidence before this change:

- Set A lure same-family with in-band alternative: 2.
- Set A fly same-family with in-band alternative: 564.

QA-4 after implementation:

| Sweep | Rows | Contexts | Failures | Surface leaks | Set A lures same-family with alt | Set A flies same-family with alt | Set B lures same-family with alt | Set B flies same-family with alt |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| All months, all scenarios | 1,104 | 12,312 | 0 | 0 | 0 | 0 | 0 | 0 |
| Launch months March-November | 828 | 9,234 | 0 | 0 | 0 | 0 | 0 | 0 |

Remaining same-family Top/Honorable cases:

- None observed in the full all-month sweep.
- None observed in the launch-month sweep.

## Commands run

```bash
git status --short
npx tsc --noEmit
deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts
deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts
deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__
npx tsc --noEmit
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7
deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7
```

Results:

- `npx tsc --noEmit`: passed.
- Select tests: 15 passed, 0 failed.
- Engine/response diagnostics tests: 25 passed, 0 failed.
- Full recommender/daily-picks Deno suite: 135 passed, 0 failed.
- Harness full sweep: 0 failures, 0 surface leaks, 0 same-family-with-alternative cases.
- Harness launch-month sweep: 0 failures, 0 surface leaks, 0 same-family-with-alternative cases.

## Remaining caveats

This pass intentionally did not address adjacent-day repeats, broad fly dominance, Set B ID-overlap reviews, catalog truth, seasonal row breadth, scoring weights, or surface-window tuning.

The family-diversity rule can change Honorable Mention composition and therefore can shift identical all-purpose/big-fish set counts and exposure counts. That is expected selector behavior, not row or scoring tuning.

## Recommended QA-5 focus

- Seasonal row cleanup for broad all-row fly inventory.
- Pike-first row credibility and bass-coded crankbait/spinnerbait carryover.
- Smallmouth river Big Fish goal-reason gaps.
- Trout mouse/surface window proof by region and month.
- Set B ID-overlap and adjacent-day repeat policy, separate from family diversity.

