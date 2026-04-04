# Smallmouth V3 Matrix Pass 1 Findings

Generated: 2026-04-04

## Overall Result

- Matrix scenarios: `68`
- Top-1 primary hit: `56/68`
- Top-3 primary present: `67/68`
- Disallowed-lane avoidance: `68/68`
- Top color-lane match: `64/68`

## Read

This is a strong first matrix pass.

The good news:
- Smallmouth is broadly species-correct across the matrix.
- The engine is not drifting into largemouth-only logic.
- River and lake behavior are both holding up reasonably well.
- The remaining misses are clustered by anchor and season rather than being random.

The main remaining issue is opener order in active clear-water and early-fall baitfish windows.
Several rows are still a little too tube-first or control-first when the scenario should open cleaner minnow, swimbait, spinner, or topwater lanes.

## Anchor Summary

- `great_lakes_clear_lake`: `11/12` top-1, `12/12` top-3, `12/12` disallowed, `12/12` color
- `kentucky_highland_lake`: `11/12` top-1, `12/12` top-3, `12/12` disallowed, `11/12` color
- `tennessee_river`: `11/12` top-1, `12/12` top-3, `12/12` disallowed, `11/12` color
- `pennsylvania_river`: `10/12` top-1, `11/12` top-3, `12/12` disallowed, `11/12` color
- `wisconsin_natural_lake`: `2/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color
- `minnesota_fall_lake`: `3/4` top-1, `4/4` top-3, `4/4` disallowed, `3/4` color
- `colorado_river`: `2/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color
- `washington_river`: `3/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color
- `ohio_dirty_reservoir`: `3/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color

## Main Miss Clusters

### 1. Clear lake opener order

Anchors:
- `great_lakes_clear_lake`
- `wisconsin_natural_lake`

Pattern:
- Early summer and summer-clear lake windows still sometimes open `soft_jerkbait` or `paddle_tail_swimbait` ahead of `drop_shot_worm_minnow`, `tube_jig`, or `hair_jig`.
- The top 3 remains good, but the first pick is sometimes more aggressive than the matrix expectation.

### 2. Early-fall lake and river baitfish windows

Anchors:
- `kentucky_highland_lake`
- `tennessee_river`
- `colorado_river`
- `washington_river`

Pattern:
- Some active fall windows still lead with `tube_jig` or `inline_spinner` when a `suspending_jerkbait`, `spinnerbait`, or `paddle_tail_swimbait` opener would feel more on point.

### 3. Pennsylvania river early summer

Anchor:
- `pennsylvania_river`

Pattern:
- June is the biggest clean miss in the current river matrix.
- The engine stayed too bottom/control-heavy instead of opening topwater / inline / swimbait behavior in a better current-aware summer lane.

### 4. Dirty lake visibility and color polish

Anchors:
- `ohio_dirty_reservoir`
- `minnesota_fall_lake`
- `kentucky_highland_lake`
- `tennessee_river`

Pattern:
- These are not broad failures.
- The engine mostly stays inside the right lane, but a few rows still want stronger shad / bright-contrast bias or less craw-first behavior.

## Priority Tuning Order

1. `wisconsin_natural_lake` and `great_lakes_clear_lake`
2. `pennsylvania_river`
3. `kentucky_highland_lake` and `tennessee_river`
4. `colorado_river` and `washington_river`
5. dirty-lake color polish for `ohio_dirty_reservoir` and `minnesota_fall_lake`

## Bottom Line

Smallmouth is in a good place.

The matrix confirms that V3 SMB logic is broadly strong, but it also gives us a clear final tuning list:
- cleaner opener order in active clear-water windows
- stronger baitfish-forward fall ordering in some river and lake rows
- a few remaining color-lane adjustments

This is tuning work, not architecture work.
