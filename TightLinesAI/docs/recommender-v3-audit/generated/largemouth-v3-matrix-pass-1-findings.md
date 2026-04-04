# Largemouth V3 Matrix Pass 1 Findings

Generated from:
- `docs/recommender-v3-audit/generated/largemouth-v3-matrix-review-sheet.json`
- `docs/recommender-v3-audit/generated/largemouth-v3-matrix-review-sheet.md`

This is the first broad precheck pass across the 68-scenario largemouth matrix.
It is not a replacement for hand-scored gold batches.
It is the wider coverage layer used to identify remaining seasonal-row and color-lane drift after the tuned gold batches.

## Summary

- Scenario count: `68`
- Top 1 primary-hit rate: `39/68`
- Top 3 primary-present rate: `49/68`
- Disallowed-lane avoidance: `61/68`
- Top color-lane match rate: `57/68`

## Context Split

- Lake/pond: `52` scenarios
  - Top 1: `32/52`
  - Top 3: `37/52`
  - Disallowed avoidance: `47/52`
  - Color: `46/52`
- River: `16` scenarios
  - Top 1: `7/16`
  - Top 3: `12/16`
  - Disallowed avoidance: `14/16`
  - Color: `11/16`

## Priority Split

- Core monthly: `48` scenarios
  - Top 1: `25/48`
  - Top 3: `33/48`
  - Disallowed avoidance: `41/48`
  - Color: `40/48`
- Secondary overlays: `20` scenarios
  - Top 1: `14/20`
  - Top 3: `16/20`
  - Disallowed avoidance: `20/20`
  - Color: `17/20`

## Month Pressure Points

The weakest broad-coverage months in this pass were:

- August: `1/5` top 1, `2/5` top 3, `3/5` disallowed avoidance
- June: `2/7` top 1, `4/7` top 3
- May: `3/6` top 1, `3/6` top 3

These months point to warm-season lake/pond drift and a few river/current largemouth rows that are still under-tuned.

## Main Miss Clusters

### 1. Warm-season Florida lake drift

Problem rows:
- `lmb_matrix_florida_lake_05`
- `lmb_matrix_florida_lake_07`
- `lmb_matrix_florida_lake_08`

Observed behavior:
- May stayed too horizontal and shad-forward instead of target/shallow first.
- July collapsed into finesse and cold-water reaction lanes.
- August kept one correct lane in the top 3, but still led with too much control.

Interpretation:
- Florida late spawn / postspawn and midsummer warm-season rows still need stronger grass, cover, frog, and swim-jig bias.
- Daily lower-column nudges are overpowering these rows too much in some summer scenarios.

### 2. Texas reservoir summer and early-fall drift

Problem rows:
- `lmb_matrix_texas_reservoir_06`
- `lmb_matrix_texas_reservoir_08`
- `lmb_matrix_texas_reservoir_09`
- `lmb_matrix_texas_reservoir_10`

Observed behavior:
- June and August let `drop_shot_worm_minnow` and `blade_bait` surface.
- September stayed too shallow and grassy for a late-fall-tightening expectation.
- October still had the right family class present, but opener order and color lane drifted.

Interpretation:
- South-central warm reservoir rows still need stronger brush/structure and deep-control bias in summer.
- Early-fall south-central reservoir rows need more explicit jerkbait / flat-side / football-jig authority.

### 3. Alabama river largemouth is still the weakest water-type slice

Problem rows:
- `lmb_matrix_alabama_river_01`
- `lmb_matrix_alabama_river_02`
- `lmb_matrix_alabama_river_04`
- `lmb_matrix_alabama_river_06`
- `lmb_matrix_alabama_river_08`
- `lmb_matrix_alabama_river_11`
- `lmb_matrix_alabama_river_12`

Observed behavior:
- Tube and drop-shot rows are surfacing too often.
- River moving-lane expectations are underweighted in prespawn, summer, and fall.
- Several rows are color-correct enough to be plausible, but tactically wrong for largemouth in river current.

Interpretation:
- River largemouth rows still need stronger separation from smallmouth-style/current-finesse outcomes.
- Current-edge spinnerbait, swim-jig, soft-jerkbait, squarebill, and compact cover lanes need to outrank tube/drop-shot tools more consistently.

### 4. Northern clear-lake largemouth is too bottom-finesse heavy

Problem rows:
- `lmb_matrix_new_york_natural_lake_01`
- `lmb_matrix_new_york_natural_lake_02`
- `lmb_matrix_new_york_natural_lake_04`
- `lmb_matrix_new_york_natural_lake_05`
- `lmb_matrix_new_york_natural_lake_06`
- `lmb_matrix_new_york_natural_lake_07`
- `lmb_matrix_new_york_natural_lake_11`
- plus:
  - `lmb_matrix_minnesota_weed_lake_05`
  - `lmb_matrix_minnesota_weed_lake_08`
  - `lmb_matrix_minnesota_weed_lake_10`

Observed behavior:
- Winter and prespawn clear-north rows are over-allowing drop-shot / blade-bait / craw-bottom mixes.
- Spring and summer clear-north rows are underweighting shallow target lanes, weed-edge lanes, and measured surface lanes.
- November clear-north fall transition still holds too much craw/plastic drag influence.

Interpretation:
- Northern largemouth rows need cleaner separation from generic cold-water bass logic.
- Clear northern largemouth should still reflect largemouth posture, not simply “cold clear bass = finesse/down.”

### 5. Clear highland and Delta overlay rows still need cleanup

Problem rows:
- `lmb_matrix_georgia_highland_06`
- `lmb_matrix_california_delta_06`
- `lmb_matrix_california_delta_09`

Observed behavior:
- Georgia clear summer highland stayed too low and subtle.
- Delta summer/fall rows were partially right but not opener-sharp enough, especially on color lane and cover/current emphasis.

Interpretation:
- These are narrower cleanup items, but they matter because they are strong regional overlay tests.

## Color-Lane Notes

Broadly, color logic is healthier than lure-lane logic in the matrix.
The bigger remaining color misses are tied to row posture problems, not the color engine alone.

Still, a few patterns showed up:

- Some stained winter rows are still too craw-dark when the expectation wants a more mixed shad/control look.
- Some clear summer rows are still letting top options sit outside the cleaner natural/color family we want.
- Delta and Alabama river rows need stronger certainty between `bright_contrast`, `white_shad`, and `green_pumpkin_natural` based on lane type.

## Architecture Read

This matrix pass supports the current architecture.

What it says:
- Gold-batch tuning is holding in targeted scenarios.
- The remaining problems are mostly row tuning and water-type tuning, not structural engine failure.
- The biggest residual weakness is river largemouth and northern clear-lake largemouth.
- Warm-season lake/pond rows still need a stronger anti-drift guard against cold-water finesse outcomes.

## Next Tuning Order

1. Alabama river monthly rows
2. New York and Minnesota clear-northern largemouth rows
3. Florida May/July/August lake rows
4. Texas June/August/September/October reservoir rows
5. Georgia highland June and Delta June/September overlays

## Coverage Note

This matrix is still mostly `stained` and `clear`.
That is useful for the broad monthly sweep, but it does not replace dirty-water largemouth pressure testing.
Dirty-water largemouth should keep being handled through dedicated gold batches and targeted overlays.
