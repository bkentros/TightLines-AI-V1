# Largemouth V3 Gold Batch 2 Findings

Generated: 2026-04-04
Batch: `largemouth_v3_gold_batch_2`

## Snapshot

- Untuned Batch 2 starting point:
  - Top 1 primary-hit rate: `3/10`
  - Top 3 primary-present rate: `4/10`
  - Disallowed-lane avoidance: `9/10`
- Tuned Batch 2 result:
  - Top 1 primary-hit rate: `10/10`
  - Top 3 primary-present rate: `10/10`
  - Disallowed-lane avoidance: `10/10`
  - Top color-lane match rate: `10/10`

Batch 2 exposed the next real largemouth tuning layer after Batch 1:

- month-region seasonal rows were still too generic in a few important windows
- equal scores were letting alphabetical order choose the lead instead of the intended seasonal opener
- stained late-fall / grass color lanes were still a little too generic in a few baitfish-forward cases

This pass corrected those issues without widening the engine or adding noisy logic.

## What Changed

- Added focused largemouth monthly overrides for:
  - Florida February prespawn lake
  - Florida October fall grass lake
  - South-central April spawn-transition lake
  - South-central March prespawn river
  - South-central September fall-current river
  - Gulf Coast November late-fall grass lake
  - Northern California November Delta-style river
- Changed seasonal row resolution so later row overrides win cleanly.
- Changed top-3 selection to use seasonal pool order as the tie-breaker instead of alphabetical order.
- Tightened color logic for:
  - bladed jig in stained moving-water / grass style lanes
  - suspending jerkbait in stained but not fully aggressive tightening windows
  - horizontal jigs like swim jigs so they no longer inherit bottom-jig color bias

## Batch Scores

Scoring rubric:

- `2` = clearly right
- `1` = acceptable but not ideal
- `0` = wrong or concerning

Score keys:

- `seasonal_fit`
- `daily_fit`
- `water_column_fit`
- `archetype_fit`
- `color_fit`
- `top3_variety`
- `boundedness`

| Scenario | Total / 14 | Notes |
|----------|------------|-------|
| `lmb_florida_feb_natural_lake_prespawn_stained` | `14` | Strong prespawn baitfish push. Jerkbait / swimbait / soft-jerk lane is exactly where this should live. |
| `lmb_florida_jun_grass_lake_summer` | `14` | Strong summer grass behavior. Frog lead with swim-jig and buzz backup is clean and useful. |
| `lmb_florida_oct_grass_lake_fall` | `13` | Much better. Swim-jig lead with frog and spinnerbait support reads like a believable Florida fall grass opener. |
| `lmb_texas_apr_reservoir_spawn_transition` | `12` | Now clearly in the right shallow spring lane. Still a little more horizontal than target-fishing-first, but solid. |
| `lmb_texas_nov_reservoir_latefall` | `13` | Good late-fall tightening. Jerkbait lead with flat-side and finesse backup is sensible and color-disciplined. |
| `lmb_alabama_mar_river_prespawn` | `13` | Strong improvement. Spinnerbait-first current-seam river read is now clearly largemouth-specific. |
| `lmb_alabama_sep_river_fall_current` | `13` | Strong fall river baitfish lane. Spinnerbait / swimbait / soft-jerk style movement is credible. |
| `lmb_louisiana_nov_grass_lake_latefall` | `13` | Big correction. No more blade-bait leak; now reads like stained late-fall grass with visible cover lanes. |
| `lmb_california_nov_delta_stained` | `13` | Big correction. Bladed-jig lead with dark contrast now fits the Delta window much better. |
| `lmb_ozarks_feb_clear_reservoir_prespawn` | `14` | Strong cold-clear discipline. Jerkbait lead stays clean and appropriately restrained. |

Estimated batch average: `13.2 / 14`

## Remaining Soft Spots

### 1. Texas Spawn Transition Can Still Lean Slightly Too Horizontal

Affected scenario:

- `lmb_texas_apr_reservoir_spawn_transition`

Current behavior:

- The engine is now in the right shallow spring lane.
- It still starts with `swim_jig` rather than a more obvious target-fishing opener like `compact_flipping_jig` or `weightless_stick_worm`.

What to watch next:

- When we expand largemouth again, keep checking whether calm or more cover-specific Texas spring days should tip more clearly toward target-fishing leads.

### 2. Highland-Clear Spring Still Has One Batch 1 Soft Spot

Affected scenario:

- `lmb_georgia_apr_highland_clear`

Current behavior:

- Batch 1 still has one top-1 miss there, even though top 3 is solid.

Why it matters:

- It is the main remaining largemouth example where the engine is correct enough overall, but not yet choosing the sharpest lead.

## Bottom Line

Batch 2 moved largemouth V3 from “good in places” to “strong across the main largemouth windows we care about most.” The remaining work is no longer about architecture or missing lanes. It is now about sharpening a few lead-choice preferences as we expand the largemouth gold set.
