# Smallmouth Bass — Report Audit Summary

**Primary regions:** Great Lakes / Upper Midwest and Northeast are the historical smallmouth strongholds (Lake Erie, Champlain, St. Lawrence, Finger Lakes, Mille Lacs). Appalachian rivers (New, Shenandoah, Susquehanna) and midwest river systems round out the core fishery.

**Commonly-fished months:** Smallmouth fishing peaks April-October in northern waters. May = spawn, June = aggressive post-spawn feed, July-August = summer crayfish/baitfish pattern, September-October = fall feed before cold-dormant window.

## Scenarios run

| # | Id | Region | Month | Context | Profile | Auto-flags (BLK / BUG / POL / FYI) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `smb-01-upper-midwest-river-may-prespawn` | great_lakes_upper_midwest | May | freshwater_river | spring_spawn_warming | 0 / 0 / 0 / 2 |
| 2 | `smb-02-upper-midwest-lake-july-summer-peak` | great_lakes_upper_midwest | July | freshwater_lake_pond | stable_high_pressure_clear | 0 / 0 / 0 / 2 |
| 3 | `smb-03-northeast-river-june-postspawn` | northeast | June | freshwater_river | pre_front_falling_pressure | 0 / 0 / 0 / 0 |
| 4 | `smb-04-appalachian-river-september-fall-feed` | appalachian | September | freshwater_river | fall_feed_cooling | 0 / 0 / 0 / 1 |
| 5 | `smb-05-upper-midwest-river-july-postfront-bluebird` | great_lakes_upper_midwest | July | freshwater_river | post_front_bluebird | 0 / 0 / 0 / 0 |

## Audit workflow

For each scenario file:
1. Read the scenario's **Intent** and **Setup** to understand what the harness was trying to simulate.
2. Work through the **Auditor checklist** top-to-bottom.
3. Record findings in the **Auditor notes** section with severity tags and specific ids/quotes.
4. Cross-check each **auto-flag** — confirm or dismiss with reasoning.

After all scenarios for this species are audited, write a species-level rollup at the bottom of this file under "Species findings".

## Species findings

_(fill in after all scenarios audited — top themes, recurring archetype issues, recurring copy issues, tuning recommendations)_
