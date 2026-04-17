# Northern Pike / Musky — Report Audit Summary

**Primary regions:** Great Lakes / Upper Midwest is the heart of the North American pike fishery. Northeast lakes (Champlain, St. Lawrence) and Mountain West cold-water reservoirs round it out. Alaska is a distinct summer-only fishery and is represented in later batches if needed.

**Commonly-fished months:** Pike peak post-ice-out (late April/May) in the shallows, remain fishable June-July on weed edges, shift deeper in peak heat, and trigger a strong fall feed September-October. Scenarios span post-ice-out aggression, early summer weed edge, hot summer, and fall feed.

## Scenarios run

| # | Id | Region | Month | Context | Profile | Auto-flags (BLK / BUG / POL / FYI) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `pike-01-upper-midwest-lake-may-postspawn` | great_lakes_upper_midwest | May | freshwater_lake_pond | pre_front_falling_pressure | 0 / 0 / 0 / 0 |
| 2 | `pike-02-northeast-lake-september-fall-feed` | northeast | September | freshwater_lake_pond | fall_feed_cooling | 0 / 1 / 0 / 0 |
| 3 | `pike-03-upper-midwest-river-june-early-summer` | great_lakes_upper_midwest | June | freshwater_river | stable_high_pressure_clear | 0 / 0 / 0 / 3 |
| 4 | `pike-04-mountain-west-lake-october-cold-front` | mountain_west | October | freshwater_lake_pond | post_front_bluebird | 0 / 2 / 0 / 0 |
| 5 | `pike-05-northeast-lake-july-hot-summer` | northeast | July | freshwater_lake_pond | summer_peak_hot | 0 / 0 / 0 / 2 |

## Audit workflow

For each scenario file:
1. Read the scenario's **Intent** and **Setup** to understand what the harness was trying to simulate.
2. Work through the **Auditor checklist** top-to-bottom.
3. Record findings in the **Auditor notes** section with severity tags and specific ids/quotes.
4. Cross-check each **auto-flag** — confirm or dismiss with reasoning.

After all scenarios for this species are audited, write a species-level rollup at the bottom of this file under "Species findings".

## Species findings

_(fill in after all scenarios audited — top themes, recurring archetype issues, recurring copy issues, tuning recommendations)_
