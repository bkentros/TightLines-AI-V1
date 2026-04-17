# River Trout — Report Audit Summary

**Primary regions:** Mountain West (MT/WY/CO) is the iconic North American trout fishery. PNW (OR/WA), Appalachian, and Northeast freestones/tailwaters are equally respected regional fisheries. Mountain Alpine is a secondary for high-altitude calibration.

**Commonly-fished months:** April-October covers the bulk of dry-fly and streamer action across all regions. Early April = cold pre-hatch / streamer; May-June = dominant hatch period; July-August = PMD/terrestrial; September-October = BWO + fall streamer; late October = streamer / cold.

## Scenarios run

| # | Id | Region | Month | Context | Profile | Auto-flags (BLK / BUG / POL / FYI) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `trt-01-mountain-west-river-july-pmd-terrestrial` | mountain_west | July | freshwater_river | stable_high_pressure_clear | 0 / 0 / 0 / 1 |
| 2 | `trt-02-northeast-river-may-caddis-hatch` | northeast | May | freshwater_river | overcast_windy_warm | 0 / 0 / 0 / 1 |
| 3 | `trt-03-appalachian-river-april-cold-pre-hatch` | appalachian | April | freshwater_river | early_season_cold_clear | 0 / 0 / 0 / 2 |
| 4 | `trt-04-pacific-northwest-river-october-fall-streamer` | pacific_northwest | October | freshwater_river | fall_feed_cooling | 0 / 0 / 0 / 2 |
| 5 | `trt-05-mountain-west-river-september-bwo-terrestrial` | mountain_west | September | freshwater_river | fall_feed_cooling | 0 / 0 / 0 / 3 |

## Audit workflow

For each scenario file:
1. Read the scenario's **Intent** and **Setup** to understand what the harness was trying to simulate.
2. Work through the **Auditor checklist** top-to-bottom.
3. Record findings in the **Auditor notes** section with severity tags and specific ids/quotes.
4. Cross-check each **auto-flag** — confirm or dismiss with reasoning.

After all scenarios for this species are audited, write a species-level rollup at the bottom of this file under "Species findings".

## Species findings

_(fill in after all scenarios audited — top themes, recurring archetype issues, recurring copy issues, tuning recommendations)_
