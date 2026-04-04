# Largemouth V3 Gold Batch 1

## Purpose

This is the first true largemouth calibration batch for the freshwater V3 recommender.

The goal of Batch 1 is not broad national completeness.
The goal is to pressure-test the highest-value largemouth behavior windows first:

- winter control
- prespawn opening
- wind-reactive late winter
- spring clear-water balance
- river largemouth positioning
- dirty summer cover lanes
- clear summer finesse restraint
- early-fall shallow opening
- fall shad transition
- early-winter slowdown

## Batch 1 Scenarios

The source of truth for these scenarios is:

`scripts/recommenderCalibrationScenarios.ts`

Batch constant:

`LARGEMOUTH_V3_GOLD_BATCH_1`

## Scenario List

1. `lmb_florida_jan_pond_postfront`
   Why: winter control lane and bounded warm-up behavior
2. `lmb_florida_mar_lake_prespawn`
   Why: prespawn opening without abandoning bottom-control options
3. `lmb_texas_feb_reservoir_wind`
   Why: late-winter wind-reactive baitfish lane
4. `lmb_georgia_apr_highland_clear`
   Why: clear-water spring balance and clean color lanes
5. `lmb_alabama_may_river_current`
   Why: river largemouth should not read like generic lake largemouth
6. `lmb_mississippi_jun_backwater_dirty`
   Why: dirty summer cover, visibility, and color pressure
7. `lmb_newyork_aug_natural_lake_bluebird`
   Why: clear-water bluebird restraint and finesse credibility
8. `lmb_louisiana_sep_shallow_grass`
   Why: early-fall shallow grass, surface opening, and top-3 usefulness
9. `lmb_ozarks_oct_shad_transition`
   Why: fall baitfish transition and anti-redundancy
10. `lmb_texas_dec_pond_cold_clear`
   Why: early-winter slowdown and cold clear-water color discipline

## What Batch 1 Must Tell Us

Batch 1 should answer these questions:

1. Is the seasonal lane right for largemouth across the most important bass windows?
2. Are daily nudges strong enough to matter without becoming volatile?
3. Are river and lake recommendations separating correctly?
4. Are colors sensible for both lure/fly archetype and water clarity?
5. Is the top 3 varied enough without breaking the daily gameplan?

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

## Review Questions

For each scenario, answer:

1. Is the top 1 something a strong local bass angler would truly start with?
2. Are the other 2 useful backups instead of filler?
3. Does the recommendation reflect where largemouth should be in the water column?
4. Did daily conditions move the recommendation the correct amount?
5. Did water clarity shape the presentation and color correctly?
6. Are the lure and fly colors realistic for that archetype?
7. Did the engine miss an obvious classic?
8. Did the engine overreact into topwater or another drastic jump?

## Failure Clusters To Track

Track misses under one of these labels:

- `seasonal_lane_wrong`
- `daily_overreaction`
- `daily_underreaction`
- `river_lake_blur`
- `topwater_too_aggressive`
- `top3_too_redundant`
- `color_wrong_for_archetype`
- `color_wrong_for_clarity`
- `missing_classic`
- `fly_not_bass_specific`

## Working Sheet Template

Use this exact format per scenario:

```md
### scenario_id
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:
```

## Tuning Order After Batch 1

Only tune one failure class at a time:

1. seasonal pool problems
2. daily nudge problems
3. water-column boundedness problems
4. color problems
5. top-3 redundancy problems

Then rerun Batch 1 before expanding to Batch 2.

## Pass Bar

Batch 1 is in a strong place when:

1. the majority of top 1 picks feel clearly right
2. no major winter-to-surface overreaction remains
3. river largemouth scenarios feel distinct from lake scenarios
4. dirty and clear-water color misses are uncommon
5. fall baitfish transition scenarios read correctly without collapsing into one lane
