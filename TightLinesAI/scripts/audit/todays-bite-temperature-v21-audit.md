# Today's Bite Temperature V2.1-lite Production Parity

Generated: 2026-05-14T16:35:17.219Z

Phase 5C production parity audit. Production `normalizeTemperature(...)` is wired to the no-interpolation `behavior_complete_lite` profile. Recommender production logic is unchanged.

## Production Parity

Production-vs-experiment profile: **behavior_complete_lite**

Experiment defaults: `band=0.9,stable=0.05,bad=0,shockFloor=-0.9,shockImprove=1.5,trendMax=0.7,interp=none,edge=0,stabilityMode=favorability_aware,shockMode=direction_aware`.

- Production-vs-experiment temp mismatches: **0**
- Production-vs-experiment score delta rows: **0**
- Production-vs-experiment selected-pick changes: **0**
- Production-vs-experiment thermal changes: **0**
- Production-vs-experiment surface changes: **0**
- Production-vs-experiment tag changes: **0**

## Candidate / Diagnostic Comparison

| Candidate | Eligible | Constants | Temp Mismatches | Score Delta Rows | Avg Delta | Max | Min | abs>=8 | abs>=12 | Tier Changes | Reliability Changes | Sign Changes | Rec Valid | Pick Changes | Thermal Changes | Surface Changes | Tag Changes |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | no | production | 0 | 0 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16200 | 0 | 0 | 0 | 0 |
| conservative_shock_only | yes | band=0.9,stable=0.05,bad=0,shockFloor=-0.9,shockImprove=1.5,trendMax=0.7,interp=none,edge=0,stabilityMode=production,shockMode=direction_aware | 24540 | 6760 | 0.12 | 1 | 0 | 0 | 0 | 345 | 0 | 3000 | 16200 | 0 | 0 | 0 | 0 |
| behavior_complete_lite | yes | band=0.9,stable=0.05,bad=0,shockFloor=-0.9,shockImprove=1.5,trendMax=0.7,interp=none,edge=0,stabilityMode=favorability_aware,shockMode=direction_aware | 0 | 0 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 16200 | 0 | 0 | 0 | 0 |
| broad_interpolation_diagnostic | no | band=0.9,stable=0.05,bad=0,shockFloor=-0.5,shockImprove=0.75,trendMax=0.7,interp=broad_month,edge=0,stabilityMode=favorability_aware,shockMode=direction_aware | 28370 | 23511 | 0.32 | 26 | -22 | 1645 | 497 | 4628 | 0 | 5152 | 16200 | 1216 | 1202 | 69 | 1202 |
| boundary_interpolation_diagnostic | no | band=0.9,stable=0.05,bad=0,shockFloor=-1.05,shockImprove=99,trendMax=0.7,interp=boundary_only,edge=3,stabilityMode=production,shockMode=production | 37574 | 19647 | -0.01 | 19 | -23 | 872 | 226 | 2968 | 0 | 4866 | 16200 | 737 | 732 | 23 | 732 |

## Historical Pre-Wiring Finalist Impact

Retained from the Phase 5B shadow finalist lock:

- behavior_complete_lite avg score delta: **-0.02**
- max / min score delta: **+2 / -1**
- abs(score_delta) >= 8: **0**
- abs(score_delta) >= 12: **0**
- recommender selected-pick changes: **0**

## Qualitative Diagnostics

| Candidate | Shock Rows | Softened Shock Rows | Softened Toward Better Rows | Stable Favorable Bonus Rows | Stable Neutral No Bonus Rows | Stable Bad No Bonus Rows | Missing History No Bonus Rows |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| conservative_shock_only | 21150 | 6220 | 6220 | 3420 | 0 | 0 | 6480 |
| behavior_complete_lite | 21150 | 6220 | 6220 | 3420 | 6680 | 17860 | 6480 |
| broad_interpolation_diagnostic | 21150 | 8344 | 8344 | 3176 | 6972 | 17812 | 6480 |
| boundary_interpolation_diagnostic | 21150 | 0 | 0 | 3272 | 0 | 0 | 6480 |

## Readiness Fixtures (behavior_complete_lite)

| Fixture | Expectation | Result | Score Delta | Stability Component | Shock Component | Trend Component | Picks Changed |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| stable_favorable_bonus | stability_component is +0.05 for behavior_complete_lite | pass | 0 | 0.05 | 0 | 0 | false |
| stable_neutral_no_bonus | stable neutral gets 0 stability_component | pass | 0 | 0 | 0 | 0 | false |
| stable_bad_hot_no_bonus | stable bad hot gets 0 stability_component | pass | 0 | 0 | 0 | 0 | false |
| stable_bad_cold_no_bonus | stable bad cold gets 0 stability_component | pass | 0 | 0 | 0 | 0 | false |
| missing_history_no_bonus | missing history gets 0 stability_component | pass | 0 | 0 | 0 | 0 | false |
| better_shock_softened_to_floor | shock toward better temp softens to no better than -0.90 | pass | 0 | -0.2 | -0.9 | 0 | false |
| worse_heat_full_shock | shock into worse heat keeps full penalty | pass | 0 | -0.2 | -1.05 | 0 | false |
| worse_cold_full_shock | shock into worse cold keeps full penalty | pass | 0 | -0.2 | -1.05 | 0 | false |
| shock_blocks_trend | shock never stacks trend bonus | pass | 0 | -0.2 | -0.9 | 0 | false |
| coastal_water_source | coastal measured-water uses measured water source | pass | 0 | 0.05 | 0 | 0 | n/a |
| coastal_air_source | coastal air fallback stays air source | pass | 0 | 0 | 0 | 0 | n/a |
| lake_picks_preserved | lake recommender fixture preserves selected picks | pass | 0 | 0 | 0 | 0 | false |
| river_picks_preserved | river recommender fixture preserves selected picks | pass | 0 | 0 | 0 | 0 | false |

Readiness passed: 13 / 13

## Interpolation Parked

Interpolation remains parked and not eligible for production wiring. Production uses the current region/month row directly; target-date/month interpolation plumbing was not added.

## Artifacts

- JSONL: `scripts/audit/todays-bite-temperature-v21-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-temperature-v21-audit.md`
