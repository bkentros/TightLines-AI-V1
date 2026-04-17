# Largemouth Bass — Report Audit Summary

**Primary regions:** Florida (year-round), Southeast Atlantic, Gulf Coast, and South Central dominate the largemouth fishery — the bulk of guides, tournaments, and trophy fisheries live there. Midwest Interior is a strong secondary with a defined spring-through-fall window.

**Commonly-fished months:** FL fishes best Dec-May when bass are on beds and in winter staging; Southeast/Gulf/South Central peak March-October; Midwest Interior is May (spawn) and October (fall feed). The scenarios span cold-front winter, pre-spawn, post-spawn, summer heat, and fall feed.

## Scenarios run

| # | Id | Region | Month | Context | Profile | Auto-flags (BLK / BUG / POL / FYI) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `lmb-01-florida-january-cold-front` | florida | January | freshwater_lake_pond | post_front_bluebird | 0 / 0 / 0 / 0 |
| 2 | `lmb-02-southeast-atlantic-lake-april-prespawn` | southeast_atlantic | April | freshwater_lake_pond | spring_spawn_warming | 0 / 0 / 0 / 3 |
| 3 | `lmb-03-south-central-lake-may-postspawn` | south_central | May | freshwater_lake_pond | stable_high_pressure_clear | 0 / 0 / 0 / 3 |
| 4 | `lmb-04-gulf-coast-lake-july-summer-heat` | gulf_coast | July | freshwater_lake_pond | summer_peak_hot | 0 / 0 / 0 / 2 |
| 5 | `lmb-05-midwest-interior-lake-october-fall-feed` | midwest_interior | October | freshwater_lake_pond | fall_feed_cooling | 0 / 0 / 0 / 3 |

## Audit workflow

For each scenario file:
1. Read the scenario's **Intent** and **Setup** to understand what the harness was trying to simulate.
2. Work through the **Auditor checklist** top-to-bottom.
3. Record findings in the **Auditor notes** section with severity tags and specific ids/quotes.
4. Cross-check each **auto-flag** — confirm or dismiss with reasoning.

After all scenarios for this species are audited, write a species-level rollup at the bottom of this file under "Species findings".

## Species findings

_(fill in after all scenarios audited — top themes, recurring archetype issues, recurring copy issues, tuning recommendations)_
