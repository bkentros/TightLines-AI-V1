# QA8B Launch Watchlist Row Tuning

Date: 2026-05-09

Scope: QA8B traces the QA8A.2 launch watchlist rows to decide whether the flagged envelopes create questionable selected recommendations. This was a narrow evidence-backed cleanup pass. No scoring weights, biological gates, fallback borrowing, selector behavior, or new inventory were changed.

## Files Changed

- `scripts/audit/daily-picks-quality-harness.ts`
- `data/seasonal-matrix/trout.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `docs/audits/recommender-2x2/qa8b-launch-watchlist-row-tuning.md`

## Method

Added audit-only `--watchlist-trace` mode to the daily-picks quality harness. It traces:

- trout `mouse_fly` selection across surface rows and synthetic daily conditions
- cold March pike/trout fast-capable selections
- cool May/October LMB lake surface rows
- cold-region June/September surface windows

The trace reports selected IDs, surface gate, scenario tags, goal, and representative score reasons. It does not change runtime selection.

## Confirmed Issues

### Trout `mouse_fly` breadth

Observed before cleanup:

| Metric | Before |
| --- | ---: |
| Trout rows authoring `mouse_fly` | 59 |
| `mouse_fly` selections in trace | 59 |
| `mouse_fly` selections outside strong context | 19 |

The issue was not daily-gate leakage: `mouse_fly` only selected when daily surface was open. The problem was row authoring breadth. Because `mouse_fly` appeared wherever trout surface was open, it rose in May/June low-light Big Fish rows that were better treated as broader plug/surface streamer windows rather than special mouse windows.

Fix made:

- Removed `mouse_fly` from trout May and June rows.
- Kept `mouse_fly` in July, August, and September trout surface rows.
- Kept `small_floating_trout_plug` broader across May-September surface rows.

Observed after cleanup:

| Metric | After |
| --- | ---: |
| Trout rows authoring `mouse_fly` | 40 |
| Trout May/June rows authoring `mouse_fly` | 0 |
| `small_floating_trout_plug` rows | 59 |
| `mouse_fly` selections in trace | 40 |
| `mouse_fly` selections outside strong context | 0 |

### Winter pike generic spinnerbait padding

QA8A.2 identified generic `spinnerbait` in Dec/Jan/Feb pike rows where pike-first tools already existed. This pass removed generic `spinnerbait` from winter pike rows while preserving `pike_spinnerbait` in valid pike reaction contexts.

Observed after cleanup:

| Metric | After |
| --- | ---: |
| Dec/Jan/Feb pike rows with generic `spinnerbait` | 0 |
| Pike rows with `pike_spinnerbait` | 162 |

Regression tests now guard against generic winter pike `spinnerbait` returning.

## Dismissed Watch Items

### Cool May/October LMB lake surface

Trace result:

| Metric | Count |
| --- | ---: |
| Cool LMB surface rows traced | 6 |
| Surface selections | 12 |
| Surface selections when daily gate not open | 0 |

Assessment: no row edit. Surface options rose only in open surface scenarios. Bright/cold, windy/stained closed-surface, and heat-caution scenarios did not select surface.

### Cold June/September surface windows

Trace result:

| Metric | Count |
| --- | ---: |
| Cold June/September surface rows traced | 49 |
| Surface selections when daily gate not open | 0 |

Assessment: no row edit. These windows remain biologically plausible northern summer/early-fall opportunities, and daily gates kept them condition-dependent.

## Remaining Watch Items

### Cold March pike/trout fast-capable inventory

Trace result:

| Metric | Count |
| --- | ---: |
| Cold March fast-lane rows traced | 12 |
| Fast-capable selected candidates, all traced scenarios | 54 |
| Fast-capable selected candidates in cold-clear/suppressed | 18 |

Assessment: no row edit in QA8B.

The trace found fast-capable selections in cold-clear/suppressed March rows, but they were mostly medium-primary profiles with fast as a secondary pace, such as `inline_spinner`, `clouser_minnow`, and `large_bucktail_spinner`. Representative top-score reasons were baseline medium, clear/cold tags, forage, and goal fit rather than daily reaction tags. This is not a proven runtime or row-authoring failure, but it remains a good QA9 score-trace target if Brandon wants colder March rows to suppress secondary-fast tools more strongly.

## Tests Added

`generatedSeasonalIntegrity.test.ts` now includes:

- trout `mouse_fly` must stay in trout river rows with surface open and month July-September
- `small_floating_trout_plug` must remain broader than `mouse_fly`
- Dec/Jan/Feb pike rows must not author generic `spinnerbait`

## Harness Results

Watchlist trace before:

| Metric | Before |
| --- | ---: |
| Trout surface mouse rows | 59 |
| `mouse_fly` outside strong context | 19 |
| Cool LMB surface when gate not open | 0 |
| Cold June/September surface when gate not open | 0 |

Watchlist trace after:

| Metric | After |
| --- | ---: |
| Trout surface mouse rows | 40 |
| `mouse_fly` outside strong context | 0 |
| Cool LMB surface when gate not open | 0 |
| Cold June/September surface when gate not open | 0 |

Launch harness:

| Metric | Result |
| --- | ---: |
| Rows | 828 |
| Contexts | 9234 |
| Failures | 0 |
| Lure pool min/p10/median | 6 / 7 / 17 |
| Fly pool min/p10/median | 9 / 11 / 14 |
| Thin pools under 4 per side | 0 |
| Selected geometry mismatches | 0 |
| Surface leaks | 0 |
| Caution-gate surface selections | 0 |
| Family diversity violations with in-band alternative | 0 |

All-month harness:

| Metric | Result |
| --- | ---: |
| Rows | 1104 |
| Contexts | 12312 |
| Failures | 0 |
| Lure pool min/p10/median | 6 / 6 / 16 |
| Fly pool min/p10/median | 9 / 10 / 13 |
| Thin pools under 4 per side | 0 |
| Selected geometry mismatches | 0 |
| Surface leaks | 0 |
| Caution-gate surface selections | 0 |
| Family diversity violations with in-band alternative | 0 |

Envelope audit after cleanup:

| Metric | Result |
| --- | ---: |
| Rows | 1104 |
| Hard invariant breaks | 0 |
| Likely issues | 0 |
| Watch/review findings | 153 |

The remaining watch findings are review prompts, not runtime leaks.

## Commands Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --watchlist-trace`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --row-sanity --json`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --envelope-audit`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`

Note: `npm run check:seasonal-matrix` correctly reported generated-file mismatches immediately after CSV edits and passed after regeneration.

## Remaining Red Flags

- Cold March rows still select medium-primary, fast-capable tools in some cold-clear/suppressed traces. Not a proven bad recommendation, but worth a QA9 scoring trace.
- Two South Central winter pike lake rows still carry non-spinnerbait bass-coded crankbait-style IDs as watch/review. QA8B only removed the explicitly requested generic `spinnerbait` padding.
- Adjacent-day repeats remain high and are intentionally deferred to the exposure/variety pass.

## Recommended Next Pass

Move to QA8 exposure/variety with row geometry, surface gates, and launch watchlist cleanup now in a stable state. Then schedule QA9 winter/pike polish for residual non-spinnerbait bass-coded winter pike carryover and cold March secondary-fast behavior.

## Caveats

- The worktree contains many pre-existing accepted QA5-QA8 changes and unrelated asset/UI changes. This pass only touched the files listed above.
- The watchlist trace is synthetic and deterministic. It proves gate behavior and relative selection in known fixtures, not every possible real-weather day.
