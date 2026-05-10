# QA8C Broad Fly Row Authoring Cleanup

Date: 2026-05-09

## Executive Summary

QA8C audited broad/high-volume fly row authoring and selection behavior across launch months first, then checked all-month behavior after the narrow cleanup.

Confirmed issue: northern pike rows still carried small generic leech/jig flies as universal padding, and pike lake/pond rows allowed `clouser_minnow` to act as default lake pike fly inventory despite pike-first fly options now existing.

Fix made: removed `lead_eye_leech`, `jighead_marabou_leech`, and `feather_jig_leech` from all pike rows; removed `clouser_minnow` from pike lake/pond rows while keeping it in pike river rows where a weighted current-swing minnow remains defensible.

No scoring weights, biological gates, fallback borrowing, catalog species gates, or new inventory were changed.

## What Was Audited

Scope:
- Species: largemouth bass, smallmouth bass, northern pike, trout
- Launch months: March-November
- All authored regions and water types
- Clear, stained, dirty scenarios
- All-purpose and big-fish goals
- Set A and Set B fly slots
- Archived-weather replay fixtures

Broad/high-volume IDs tracked:
- `clouser_minnow`
- `game_changer`
- `articulated_baitfish_streamer`
- `bucktail_baitfish_streamer`
- `slim_minnow_streamer`
- `unweighted_baitfish_streamer`
- `baitfish_slider_fly`
- `woolly_bugger`
- `rabbit_strip_leech`
- `lead_eye_leech`
- `jighead_marabou_leech`
- `feather_jig_leech`
- `balanced_leech`
- `articulated_dungeon_streamer`
- `conehead_streamer`
- `zonker_streamer`

## Methodology

Added `--broad-fly-audit` to `scripts/audit/daily-picks-quality-harness.ts`.

The mode reports:
- row coverage by fly ID
- selected slot share by fly ID
- selected share by species, water type, goal, Set A/B, and Top/HM slot
- broad fly family-group share
- fly pool min/p10/median
- selected broad-fly score samples

Extended archived-weather replay broad-fly accounting so replay output reports the same expanded broad-fly set.

## Exposure Before And After

Launch harness, March-November:

| Metric | Before | After |
|---|---:|---:|
| Rows | 828 | 828 |
| Contexts | 9234 | 9234 |
| Fly selected slots | 36936 | 36936 |
| Broad fly selected slots | 28080 | 27718 |
| Broad fly share | 0.760 | 0.750 |
| Broad top-pick share | 0.373 | 0.368 |
| Broad honorable share | 0.388 | 0.382 |
| Fly pool min/p10/median | 9/11/14 | 6/9/13 |
| Thin fly contexts `<4` | 0 | 0 |

Archived-weather replay:

| Metric | Before | After |
|---|---:|---:|
| Fixtures | 18 | 18 |
| Goal runs | 36 | 36 |
| Broad fly selected share | 0.611 | 0.569 |
| Adjacent-day exact repeats | 1 | 1 |
| AP/BF identical fixture sets | 0 | 0 |

Pike-specific launch broad selections:

| ID | Before | After |
|---|---:|---:|
| `clouser_minnow` | 1006 | 559 |
| `lead_eye_leech` | 306 | 0 |
| `jighead_marabou_leech` | 116 | 0 |
| `feather_jig_leech` | 48 | 0 |
| `game_changer` | 1109 | 1292 |
| `articulated_baitfish_streamer` | 815 | 899 |
| `pike_bunny_streamer` all-slot selected | 916 | 1121 |
| `large_articulated_pike_streamer` all-slot selected | 894 | 901 |

Interpretation: broad fly share remains high because baitfish streamers are genuinely central to fly recommendations, but the most questionable pike small-leech padding was removed and real pike fly inventory picked up more of the pike workload.

## Confirmed Issues

### Pike Small-Leech Padding

Observed issue:
- `lead_eye_leech`, `jighead_marabou_leech`, and `feather_jig_leech` were authored into every pike row.
- These profiles are small, generic leech/jig fly lanes and were selected in pike launch contexts despite pike-first flies existing.
- Pike rows stayed healthy after removal: all-month pike fly row pool min/p10/median is 6/6/9.

Fix:
- Removed those three IDs from all `northern_pike.csv` rows.
- Added generated-seasonal regression coverage to prevent return.

### Pike Lake Clouser Default

Observed issue:
- `clouser_minnow` was authored in all pike launch rows and selected frequently in pike lake/pond replay.
- Clouser remains biologically plausible for pike in current/swing river situations, but it was acting too much like lake pike default inventory.

Fix:
- Removed `clouser_minnow` from pike lake/pond rows only.
- Kept `clouser_minnow` in pike river rows.

## Dismissed Hypotheses

### Articulated Dungeon Universal Big Fish

Dismissed as launch-critical after trace:
- `articulated_dungeon_streamer` is not in pike launch rows.
- It appears in narrower LMB/SMB/trout Big Fish contexts and is selected mainly when its Big Fish tags and row geometry line up.
- No row edit made.

### Trout Broad Streamers Are Automatically Bad

Dismissed as too broad:
- Trout is river-only and streamer-modeled.
- Clouser, Game Changer, baitfish, sculpin, leech, and articulated streamers are high-utility trout tools when row column/pace and daily conditions fit.
- Mouse remains narrow after QA8B.
- No trout broad-streamer cleanup made in QA8C.

### Bass Broad Baitfish Streamers Are Automatically Padding

Dismissed for now:
- LMB/SMB broad streamer selections were usually tied to baitfish forage, row baseline geometry, clarity, and goal reasons.
- LMB surface/bluegill/surface fly inventory still rises in low-light surface windows.
- SMB bottom/current and clear-lake Big Fish lanes still appear in replay.
- No bass row cleanup made in QA8C.

## Fixes Made

Seasonal row edits:
- `data/seasonal-matrix/northern_pike.csv`
  - Removed `lead_eye_leech` from every pike row.
  - Removed `jighead_marabou_leech` from every pike row.
  - Removed `feather_jig_leech` from every pike row.
  - Removed `clouser_minnow` from pike `freshwater_lake_pond` rows only.

Generated output:
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`

Audit tooling:
- `scripts/audit/daily-picks-quality-harness.ts`
  - Added `--broad-fly-audit`.
- `scripts/audit/daily-picks-archived-weather-replay.ts`
  - Expanded broad-fly tracking IDs.
  - Added broad-fly counts by ID/species.

Tests:
- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
  - Added regression that pike rows do not author small generic leech padding.
  - Added regression that pike lake/pond rows do not author `clouser_minnow`.

## Pool Health

After launch cleanup:
- Launch fly pool min/p10/median: 6/9/13
- Launch thin fly contexts `<4`: 0
- All-month fly pool min/p10/median: 6/9/12
- All-month thin fly contexts `<4`: 0

This stays above the QA8C guardrail of 4 candidates per side.

## Scenario And Replay Findings

Replay changes after pike cleanup:
- Windy/stained pike lake all-purpose now selects `pike_bunny_streamer` + `pike_flash_fly` instead of `pike_bunny_streamer` + `clouser_minnow`.
- Clear/calm pike lake all-purpose now selects `unweighted_baitfish_streamer` + `pike_bunny_streamer` instead of `clouser_minnow` + `lead_eye_leech`.
- Windy pike river all-purpose still allows `clouser_minnow` as the honorable fly, which is acceptable because the row is a river/current context.

No selected column/pace mismatches, surface leaks, caution-gate surface selections, or family-diversity regressions appeared in launch/all-month harnesses.

## Remaining Red Flags

Broad fly share is still high:
- Launch broad fly share after cleanup: 0.750
- All-month broad fly share after cleanup: 0.750

This is not automatically wrong because fly recommendations are streamer-only, but it means QA8D/QA9 should continue monitoring high-volume IDs, especially:
- `game_changer`
- `articulated_baitfish_streamer`
- `clouser_minnow`
- `unweighted_baitfish_streamer`

`balanced_leech` remains active catalog inventory but has no generated row coverage because trout is currently river-only and the profile is lake/pond-only. This is dead inventory, not a runtime failure. Defer to an inventory/catalog scope decision.

## Recommended Next Pass

Run QA8D or QA9 as an exposure/variety pass:
- adjacent-day exact repeats remain high in synthetic harnesses
- Set B reuse reviews remain nonzero in narrow dirty-river Big Fish contexts
- broad flies remain high-volume but now appear mostly as legitimate streamer utility rather than obvious pike padding

If further broad-fly tuning is needed, trace `game_changer` and `articulated_baitfish_streamer` by species/goal before any row edits; both rose slightly in pike after removing weaker small-leech padding.

## Commands Run

- `git status --short`
- `npm run gen:seasonal-rows-v4`
- `deno fmt scripts/audit/daily-picks-quality-harness.ts scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno fmt supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --broad-fly-audit`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --broad-fly-audit`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts --trace`
