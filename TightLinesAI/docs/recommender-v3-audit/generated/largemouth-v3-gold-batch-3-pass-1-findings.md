# Largemouth V3 Gold Batch 3 Findings

Generated: 2026-04-04
Batch: `largemouth_v3_gold_batch_3`

## Snapshot

- Initial Batch 3 starting point:
  - Top 1 primary-hit rate: `3/10`
  - Top 3 primary-present rate: `4/10`
  - Disallowed-lane avoidance: `8/10`
  - Top color-lane match rate: `10/10`
- Tuned Batch 3 result:
  - Top 1 primary-hit rate: `10/10`
  - Top 3 primary-present rate: `10/10`
  - Disallowed-lane avoidance: `10/10`
  - Top color-lane match rate: `10/10`

Batch 3 was intentionally harder than the earlier largemouth batches.
It used more lake-heavy coverage, a balanced clarity mix, and several windows that expose whether V3 can still make strong leads after the daily nudge and color logic were locked down.

## What Batch 3 Exposed

The first untuned run showed that largemouth was still too generic in a few windows:

- tropical clear spawn still leaned too baitfish-horizontal
- tropical dirty late-summer grass still leaked winter-like tools
- south-central summer reservoirs still allowed too much generic reaction behavior
- river summer largemouth could still blur into lower-control cold-water logic
- clear Delta prespawn still behaved too much like a generic winter river row

This was useful because it showed the remaining work was still mostly in the monthly species rows, not in the V3 architecture.

## What Changed

- Added focused largemouth monthly overrides for:
  - Florida April clear spawn lakes
  - Florida August dirty summer grass lakes
  - Texas January cold stained reservoirs
  - Texas July dirty summer reservoirs
  - Gulf Coast March dirty prespawn grass lakes
  - South-central July rivers
  - Northern California March clear-prespawn Delta river behavior
- Tightened those rows around the specific opener types we actually wanted:
  - clearer spawn target-fishing
  - dirty grass cover control
  - summer reservoir brush/structure control
  - summer river current/shade largemouth
  - clear Delta prespawn cover/baitfish blends

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
| `lmb_florida_apr_spawn_lake_clear` | `13` | Good correction. Now clearly target-fishing-first and properly clear-water restrained. |
| `lmb_florida_aug_grass_lake_heat_dirty` | `13` | Big correction. Now reads like dirty tropical grass instead of a winter-control mistake. |
| `lmb_texas_jan_reservoir_cold_stained` | `13` | Strong cold stained reservoir discipline. Jerkbait / flat-side / slower backup all make sense. |
| `lmb_texas_jul_reservoir_brush_dirty` | `13` | Good correction. Brush/control lane now leads instead of generic moving bait leak-through. |
| `lmb_georgia_dec_highland_clear` | `14` | Very believable clear-winter highland largemouth output. |
| `lmb_louisiana_mar_grass_lake_prespawn_dirty` | `13` | Strong dirty prespawn grass lane with visible baitfish/control options. |
| `lmb_ozarks_may_postspawn_clear` | `14` | Strong clean postspawn shad-following output. |
| `lmb_minnesota_sep_weed_lake_stained` | `13` | Good stained early-fall weedline largemouth read. |
| `lmb_alabama_jul_river_stained` | `13` | Strong summer river largemouth separation from lake logic. |
| `lmb_california_mar_delta_clear` | `13` | Big improvement. Clearer Delta prespawn now behaves like a current-cover largemouth system instead of a cold generic river row. |

Estimated batch average: `13.2 / 14`

## Remaining Soft Spots

Batch 3 no longer has a true miss cluster.

The remaining notes are softer and worth tracking in later largemouth expansion:

### 1. Some Top 3 Sets Still Lean Horizontal On Better Days

Affected examples:

- `lmb_ozarks_may_postspawn_clear`
- `lmb_minnesota_sep_weed_lake_stained`

Current behavior:

- The outputs are good and tactically useful.
- On stronger fishable days, the top 3 can still compress around multiple moving options.

What to watch:

- As the largemouth matrix expands, keep checking whether one cleaner control backup should show up slightly more often in good-but-not-perfect days.

### 2. Dirty-Water Dark Lanes Are Strong, But Bluegill / Perch Themes Still Need Broader Stress

Affected examples:

- `lmb_florida_aug_grass_lake_heat_dirty`
- `lmb_texas_jul_reservoir_brush_dirty`

Current behavior:

- The engine is now choosing sensible bold or dark lanes.
- We still need more scenarios where perch/bluegill-oriented color themes are the right answer instead of just shad, craw, or dark-contrast lanes.

## Bottom Line

Batch 3 did what we needed it to do. It pressure-tested the sharpened V3 largemouth engine across a better clarity spread and more lake-heavy coverage, and after targeted row tuning it came back clean. The architecture held, the daily nudge logic held, and the species-specific monthly rows absorbed the remaining work the way they should.
