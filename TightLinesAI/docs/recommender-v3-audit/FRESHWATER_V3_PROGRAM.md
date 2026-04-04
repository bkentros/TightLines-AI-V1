# Freshwater V3 Audit Program

## Goal

Tune the freshwater V3 lure/fly recommender until it is:

- biologically sensible by species, region, month, and water type
- responsive to real daily conditions without becoming volatile
- strong on lure and fly archetype selection
- strong on color guidance
- consistent with how anglers actually fish

This program is for the **freshwater-only V3 recommender**:

- `largemouth_bass`
- `smallmouth_bass`
- `river_trout`
- `pike_musky` (Northern Pike)

Saltwater is intentionally out of scope for this phase.

## Core Standard

The audit standard is not "different outputs" and not "interesting variety."

The standard is:

1. seasonal truth is correct
2. daily nudges are correct
3. water-column movement stays bounded
4. recommended archetypes are familiar, common, and species-correct
5. colors are realistic for the recommended lure or fly type
6. top 3 outputs are tactically useful without becoming random

## Audit Backbone

Use **real archived weather scenarios** as the main audit source.

This is the primary calibration path because it tests the full stack together:

- region
- month
- species
- context
- daily conditions
- clarity
- final archetype recommendations
- final color recommendations

Archived scenarios should be paired with a smaller **synthetic edge-case pack** for stress testing:

- abrupt warm-up
- gradual warming trend
- hard cold front
- strong wind
- dirty water
- clear bluebird conditions

## Audit Order

Audit **species by species**, not all at once.

Recommended order:

1. `largemouth_bass`
2. `smallmouth_bass`
3. `river_trout`
4. `pike_musky`

Reason:

- bass are the flagship priority
- each species has different seasonal truth and different archetype expectations
- isolated species tuning is much faster and cleaner than global tuning

## Geographic Priority

Do not aim for perfectly even national coverage at first.
Weight the most commonly fished and most commercially important freshwater regions hardest.

Priority coverage by species:

### Largemouth

- Florida / Southeast
- Texas / South Central
- Ozarks / highland reservoir belt
- Midwest natural lake belt
- Northeast natural lakes
- California Delta / major western warmwater water

### Smallmouth

- Great Lakes / Upper Midwest
- Appalachian rivers
- Northeast rivers and natural lakes
- Midwest interior rivers

### Trout

- Appalachian rivers
- Mountain West
- Pacific Northwest
- Northeast coldwater rivers

### Pike

- Great Lakes / Upper Midwest
- northern interior lakes
- inland western / mountain-edge northern water

## Scenario Layers

Use three layers of audit data.

### 1. Gold scenarios

Handpicked archived scenarios with strong confidence in the fishing story.
These are the main truth set used for tuning.

Target counts:

- largemouth: `60–80`
- smallmouth: `45–60`
- trout: `35–45`
- pike: `30–40`

### 2. Coverage scenarios

Broader archived scenarios used to catch drift and repetition across months and regions.

### 3. Edge-case scenarios

Synthetic stress tests used to validate boundedness and non-volatility.

## Audit Rubric

Score each scenario with a simple `0–2` rubric:

- `2` = clearly right
- `1` = acceptable but not ideal
- `0` = wrong or concerning

Audit keys:

1. `seasonal_fit`
2. `daily_fit`
3. `water_column_fit`
4. `archetype_fit`
5. `color_fit`
6. `top3_variety`
7. `boundedness`

## What Reviewers Should Look For

For every scenario, ask:

1. Is the top recommendation something a strong local angler would actually start with?
2. Are the other two recommendations believable backups instead of filler?
3. Is the fish position implied by the recommendations sensible for that species and month?
4. Did the daily conditions move the recommendation the right amount?
5. Did clarity shape both presentation and color appropriately?
6. Are the colors realistic and common for that exact lure or fly type?
7. Did the engine miss an obvious classic for that species and scenario?
8. Did the engine create a drastic jump that a real guide would not make?

## Highest-Value Failure Types

Fix these first:

1. wrong seasonal lane
2. daily overreaction
3. wrong color lane for clarity + archetype
4. top 3 too redundant
5. top 3 too random
6. missing classic species-specific archetypes
7. unrealistic surface jump

## Tuning Order

Do not tune everything at once.

Tune in this order:

1. seasonal candidate pools
2. seasonal baseline spacing
3. daily nudge strength
4. clarity and color mapping
5. anti-redundancy behavior

Reason:

If the seasonal pool is wrong, every downstream system becomes noisy.

## Pass Bar

A species is not considered "solid" until:

1. top-1 recommendations feel locally believable across gold scenarios
2. top-3 backups stay tactically useful
3. color guidance passes consistently
4. warm-up and post-front edge cases stay bounded
5. repetition drops without introducing chaos

## Operating Rhythm

Use this loop:

1. run one species batch
2. grade scenarios
3. cluster misses by failure type
4. tune one failure class at a time
5. rerun the same species batch
6. only move to the next species when the current one feels stable

## Immediate Next Step

Start with a dedicated `largemouth_bass` audit program.

That species should be tuned first and most deeply before broader freshwater expansion.
