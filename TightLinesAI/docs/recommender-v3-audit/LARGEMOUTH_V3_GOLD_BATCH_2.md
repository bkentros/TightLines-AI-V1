# Largemouth V3 Gold Batch 2

## Purpose

Batch 2 expands largemouth tuning after the first Batch 1 pass.

Batch 1 proved the engine shape and exposed the first major largemouth miss clusters.
Batch 2 is designed to do two things:

- deepen monthly coverage in the most important largemouth regions
- pressure-test the specific windows Batch 1 did not cover enough

## Batch 2 Focus

Batch 2 emphasizes:

- Florida prespawn, summer grass, and fall grass behavior
- Texas spring transition and late-fall reservoir tightening
- Alabama river prespawn and fall current-seam behavior
- Louisiana late-fall grass
- California Delta stained river / tidal-fresh largemouth
- cold clear inland reservoir discipline in the Ozarks

## Batch 2 Scenarios

The source of truth for these scenarios is:

`scripts/recommenderCalibrationScenarios.ts`

Batch constant:

`LARGEMOUTH_V3_GOLD_BATCH_2`

## Scenario List

1. `lmb_florida_feb_natural_lake_prespawn_stained`
   Why: Florida prespawn stained-water opening before full spring expansion
2. `lmb_florida_jun_grass_lake_summer`
   Why: early-summer grass and surface/cover separation
3. `lmb_florida_oct_grass_lake_fall`
   Why: fall grass and baitfish shift after the long warm season
4. `lmb_texas_apr_reservoir_spawn_transition`
   Why: shallow spring target-fishing without over-jumping to topwater
5. `lmb_texas_nov_reservoir_latefall`
   Why: late-fall tightening baitfish window and color discipline
6. `lmb_alabama_mar_river_prespawn`
   Why: spring river largemouth current-seam opening
7. `lmb_alabama_sep_river_fall_current`
   Why: fall river baitfish movement and river-specific horizontal lanes
8. `lmb_louisiana_nov_grass_lake_latefall`
   Why: late-fall stained grass, visible cover, and slower southern posture
9. `lmb_california_nov_delta_stained`
   Why: western stained Delta / tidal-fresh largemouth behavior
10. `lmb_ozarks_feb_clear_reservoir_prespawn`
   Why: cold clear prespawn discipline and color realism

## What Batch 2 Must Tell Us

Batch 2 should answer these questions:

1. Can V3 hold up across more than one month in the same core largemouth regions?
2. Are Florida and Gulf grass windows truly sensible across seasons?
3. Are south-central river largemouth scenarios now distinct enough?
4. Can the engine stay disciplined in cold clear inland water?
5. Are late-fall stained-water colors and lure lanes still believable?

## Review Rubric

Score every scenario on a `0–2` scale:

- `2` = clearly right
- `1` = acceptable but not ideal
- `0` = wrong or concerning

Required categories:

1. `seasonal_fit`
2. `daily_fit`
3. `water_column_fit`
4. `archetype_fit`
5. `color_fit`
6. `top3_variety`
7. `boundedness`

## Failure Clusters To Track

Track misses under one or more of these labels:

- `seasonal_lane_wrong`
- `daily_overreaction`
- `daily_underreaction`
- `grass_lane_wrong`
- `river_lake_blur`
- `cold_clear_color_wrong`
- `stained_baitfish_color_wrong`
- `topwater_too_aggressive`
- `top3_too_redundant`
- `missing_classic`

## Why Batch 2 Matters

Batch 1 was the first proof and tuning pass.
Batch 2 is the first real largemouth expansion batch.

If Batch 2 comes back strong, largemouth will be moving from “promising and tuned in places” toward “stable across the main largemouth windows we care about most.”
