# Largemouth V3 Gold Batch 1 Findings

Generated: 2026-04-04
Batch: `largemouth_v3_gold_batch_1`

## Snapshot

- Top 1 primary-hit rate: `7/10`
- Top 3 primary-present rate: `10/10`
- Disallowed-lane avoidance: `10/10`
- Top color-lane match rate: `8/10`

This was not a pure read-only review. The batch was run, miss clusters were identified, and the largemouth V3 monthly rows were tuned before this scoring pass was locked.

Primary improvements from the first untuned run:

- Florida March prespawn now lands in a believable baitfish-forward prespawn lane instead of forcing a squarebill / craw top start.
- Georgia April clear spring now resolves to jerkbait / soft-jerkbait / swimbait style highland-lake behavior instead of a jig-heavy lane.
- Alabama May river now behaves like a current-seam largemouth scenario instead of drifting toward tube / generic bottom-river logic.
- New York August bluebird now opens with a finesse lane instead of surface-heavy summer output.
- Texas December now starts with football jig instead of over-prioritizing a Texas-rigged craw.

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
| `lmb_florida_jan_pond_postfront` | `13` | Strong winter control read. Bottom craw/jig lane is clean and bounded. |
| `lmb_florida_mar_lake_prespawn` | `13` | Strong prespawn baitfish window. Top 3 is believable, though still somewhat horizontally concentrated. |
| `lmb_texas_feb_reservoir_wind` | `12` | Good cold/windy late-winter output. Jerkbait plus bladed/jig backup is sensible, but color lane could be a touch sharper. |
| `lmb_georgia_apr_highland_clear` | `13` | Big improvement. Now reads like a clear highland spring scenario instead of a jig-first setup. |
| `lmb_alabama_may_river_current` | `12` | Good current-seam river lane. Paddle-tail / soft jerk / spinnerbait is sensible, but swim-jig/current-seam specificity can still improve. |
| `lmb_mississippi_jun_backwater_dirty` | `12` | Stronger warm dirty-water behavior than before. Still a little split between cover and horizontal lanes, but biologically sensible. |
| `lmb_newyork_aug_natural_lake_bluebird` | `13` | Strong correction. Now starts finesse-first with a believable bluebird clear-water posture. |
| `lmb_louisiana_sep_shallow_grass` | `12` | Good early-fall grass read overall. Still slightly underweights walker/swim-jig style “start high” behavior. |
| `lmb_ozarks_oct_shad_transition` | `13` | Strong fall shad-transition output. Very believable top 3. |
| `lmb_texas_dec_pond_cold_clear` | `12` | Much better than baseline. Football jig lead is right; color lane still needs refinement. |

Estimated batch average: `12.5 / 14`

## Remaining Miss Clusters

### 1. Surface-Grass Opener Still Slightly Underweighted

Affected scenario:

- `lmb_louisiana_sep_shallow_grass`

Current behavior:

- The engine now stays in a believable grass-oriented lane.
- It still prefers `bladed_jig` as the lead instead of pushing `walking_topwater` or `swim_jig` harder.

Why this matters:

- In early-fall southern grass, the engine should be a little more willing to open with a higher, cleaner “find them around the grass” lane before settling down.

### 2. River Current-Seam Specificity Can Still Improve

Affected scenario:

- `lmb_alabama_may_river_current`

Current behavior:

- Output is now sensible and current-friendly.
- It still does not feel fully “bass-in-river-current” specialized yet.

What to refine next:

- Push `swim_jig` / `spinnerbait` / `soft_jerkbait` separation a bit more.
- Keep current-seam largemouth distinct from generic river baitfish behavior.

### 3. Cold-Clear Color Guidance Still Needs One More Pass

Affected scenarios:

- `lmb_texas_dec_pond_cold_clear`
- `lmb_texas_feb_reservoir_wind`

Current behavior:

- Archetypes are now mostly right.
- Top color lanes are still a little broad in cold-clear or cold-stained southern water.

What to refine next:

- Better separate when cold-clear should favor `green_pumpkin_natural` / muted craw versus `natural_baitfish` / `white_shad`.
- Tighten flat-side / jerkbait / football-jig color behavior by condition.

## Recommended Next Largemouth Pass

1. Do a small color-specific tuning pass before expanding the largemouth gold set.
2. Add 10 more largemouth gold scenarios, focused on:
   - southern grass lakes
   - clear highland reservoirs
   - river current largemouth
   - cold-clear southern winter ponds
3. Re-run Batch 1 after the color pass to confirm no regressions.

## Bottom Line

Largemouth V3 is now in a good place structurally and materially better than the first archive-backed run. Batch 1 is no longer exposing architecture problems. The remaining work is tuning quality, mostly around lead-choice sharpness and color refinement in a few largemouth windows.
