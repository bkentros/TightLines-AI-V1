# Today's Bite Temperature V2 Production Audit

Generated: 2026-05-13T01:20:53.236Z

Temperature V2 is production-wired. This audit now verifies production Temperature V2 parity against the experiment module and keeps the pre-production broad comparison metrics as historical context.

Historical pre-wiring broad audit at adoption: selected-pick changes 25 / 3240 (0.8%), thermal changes 4 / 3240 (0.1%), surface gate changes 5 / 3240 (0.2%), abs(score_delta) >= 8: 0, abs(score_delta) >= 12: 0.

## Summary

| Metric | Value |
| --- | ---: |
| Total rows | 11664 |
| Average score delta | 0.00 |
| Max positive delta | 0 |
| Max negative delta | 0 |
| Rows with abs(score_delta) >= 8 | 0 |
| Rows with abs(score_delta) >= 12 | 0 |
| Activity tier changes | 0 |
| Temperature final_score sign changes | 0 |
| Recommender rows attempted | 3888 |
| Recommender rows with errors | 648 |
| Valid recommender rows | 3240 |
| Recommender thermal_mode changes | 0 |
| Recommender thermal_mode change percent | 0.0% |
| Recommender surface gate changes | 0 |
| Recommender surface gate change percent | 0.0% |
| Recommender selected-pick changes | 0 |
| Recommender selected-pick change percent | 0.0% |

## Chosen V2 Constants

| Constant | Value |
| --- | ---: |
| bandWeight | 0.9 |
| stableBonus | 0.05 |
| maxTrendComponent | 0.7 |

Sweep-selected candidate: bandWeight=0.9, stableBonus=0.05, maxTrendComponent=0.7.

Chosen rationale: candidates are ranked first by lowest selected-pick changes, with hard guard abs(score_delta) >= 12 at 0, thermal changes at or below 3.5%, surface gate changes at or below 9, and then low abs(score_delta) >= 8. Stable complete-history conditions retain a positive but modest benefit via `stableBonus`.

## V2 Formula

`final_score = clamp(band_score * 0.9 + stability_component + clamp(favorability_delta_72h * 0.55, -0.7, 0.7) + shock_component, -2, 2)`

- Stability component: +0.05 for stable same-source conditions with complete 24h and 72h history, 0 for moving or partial/missing history, -0.20 for unstable non-shock movement.
- Shock component: -1.05 for sharp 24h shock, -0.90 for sustained 48h shock.
- Trend component uses whether the move improved or worsened favorability against the selected region/month/source row.
- Shock rows keep `trend_label: "stable"`; diagnostics retain the 24h/72h deltas.

## Constant Sweep

| Rank | Band Weight | Stable Bonus | Max Trend | Avg Delta | Abs >= 8 | Abs >= 12 | Activity Changes | Thermal Changes | Thermal % | Surface Gate Changes | Pick Changes | Pick % |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 0.9 | 0.05 | 0.7 | 0.00 | 0 | 0 | 0 | 0 | 0.0% | 0 | 0 | 0.0% |
| 2 | 0.9 | 0.05 | 0.65 | -0.01 | 0 | 0 | 5 | 0 | 0.0% | 0 | 0 | 0.0% |
| 3 | 0.9 | 0.05 | 0.55 | -0.02 | 0 | 0 | 15 | 0 | 0.0% | 0 | 0 | 0.0% |
| 4 | 0.9 | 0.05 | 0.45 | -0.04 | 0 | 0 | 20 | 2 | 0.1% | 0 | 2 | 0.1% |
| 5 | 0.85 | 0.1 | 0.7 | 0.26 | 0 | 0 | 165 | 0 | 0.0% | 0 | 12 | 0.4% |
| 6 | 0.85 | 0.1 | 0.65 | 0.25 | 0 | 0 | 171 | 0 | 0.0% | 0 | 12 | 0.4% |
| 7 | 0.85 | 0.1 | 0.55 | 0.23 | 0 | 0 | 178 | 0 | 0.0% | 0 | 12 | 0.4% |
| 8 | 0.85 | 0.05 | 0.7 | 0.01 | 0 | 0 | 192 | 0 | 0.0% | 0 | 13 | 0.4% |
| 9 | 0.85 | 0.05 | 0.65 | -0.00 | 0 | 0 | 198 | 0 | 0.0% | 0 | 13 | 0.4% |
| 10 | 0.85 | 0.05 | 0.55 | -0.02 | 0 | 0 | 205 | 0 | 0.0% | 0 | 13 | 0.4% |
| 11 | 0.85 | 0.1 | 0.45 | 0.22 | 0 | 0 | 189 | 2 | 0.1% | 0 | 14 | 0.4% |
| 12 | 0.85 | 0.05 | 0.45 | -0.04 | 0 | 0 | 216 | 2 | 0.1% | 0 | 15 | 0.5% |
| 13 | 0.9 | 0.1 | 0.7 | 0.25 | 0 | 0 | 151 | 0 | 0.0% | 0 | 16 | 0.5% |
| 14 | 0.9 | 0.1 | 0.65 | 0.25 | 0 | 0 | 156 | 0 | 0.0% | 0 | 16 | 0.5% |
| 15 | 0.9 | 0.1 | 0.55 | 0.23 | 0 | 0 | 166 | 0 | 0.0% | 0 | 16 | 0.5% |
| 16 | 0.9 | 0.1 | 0.45 | 0.21 | 0 | 0 | 171 | 2 | 0.1% | 0 | 18 | 0.6% |
| 17 | 0.8 | 0.05 | 0.7 | 0.02 | 0 | 0 | 354 | 2 | 0.1% | 0 | 24 | 0.7% |
| 18 | 0.8 | 0.05 | 0.65 | 0.01 | 0 | 0 | 360 | 2 | 0.1% | 0 | 24 | 0.7% |
| 19 | 0.8 | 0.05 | 0.55 | -0.01 | 0 | 0 | 366 | 2 | 0.1% | 0 | 24 | 0.7% |
| 20 | 0.8 | 0.05 | 0.45 | -0.03 | 0 | 0 | 377 | 4 | 0.1% | 0 | 26 | 0.8% |
| 21 | 0.9 | 0.15 | 0.7 | 0.49 | 0 | 0 | 291 | 0 | 0.0% | 0 | 41 | 1.3% |
| 22 | 0.9 | 0.15 | 0.65 | 0.48 | 0 | 0 | 296 | 0 | 0.0% | 0 | 41 | 1.3% |
| 23 | 0.9 | 0.15 | 0.55 | 0.47 | 0 | 0 | 306 | 0 | 0.0% | 0 | 41 | 1.3% |
| 24 | 0.9 | 0.15 | 0.45 | 0.45 | 0 | 0 | 311 | 2 | 0.1% | 0 | 43 | 1.3% |
| 25 | 0.8 | 0.1 | 0.7 | 0.26 | 0 | 0 | 312 | 50 | 1.5% | 0 | 65 | 2.0% |
| 26 | 0.8 | 0.1 | 0.65 | 0.25 | 0 | 0 | 318 | 50 | 1.5% | 0 | 65 | 2.0% |
| 27 | 0.8 | 0.1 | 0.55 | 0.23 | 0 | 0 | 324 | 50 | 1.5% | 0 | 65 | 2.0% |
| 28 | 0.8 | 0.1 | 0.45 | 0.22 | 0 | 0 | 335 | 52 | 1.6% | 0 | 67 | 2.1% |
| 29 | 0.85 | 0.15 | 0.7 | 0.50 | 0 | 0 | 282 | 48 | 1.5% | 0 | 84 | 2.6% |
| 30 | 0.85 | 0.15 | 0.65 | 0.49 | 0 | 0 | 288 | 48 | 1.5% | 0 | 84 | 2.6% |
| 31 | 0.85 | 0.15 | 0.55 | 0.47 | 0 | 0 | 295 | 48 | 1.5% | 0 | 84 | 2.6% |
| 32 | 0.85 | 0.15 | 0.45 | 0.46 | 0 | 0 | 306 | 50 | 1.5% | 0 | 86 | 2.7% |
| 33 | 0.75 | 0.1 | 0.7 | 0.27 | 0 | 0 | 480 | 52 | 1.6% | 4 | 86 | 2.7% |
| 34 | 0.75 | 0.1 | 0.65 | 0.26 | 0 | 0 | 485 | 52 | 1.6% | 4 | 86 | 2.7% |
| 35 | 0.75 | 0.1 | 0.55 | 0.25 | 0 | 0 | 494 | 52 | 1.6% | 4 | 86 | 2.7% |
| 36 | 0.75 | 0.1 | 0.45 | 0.23 | 0 | 0 | 506 | 52 | 1.6% | 4 | 86 | 2.7% |
| 37 | 0.75 | 0.05 | 0.7 | 0.03 | 0 | 0 | 523 | 52 | 1.6% | 4 | 86 | 2.7% |
| 38 | 0.75 | 0.05 | 0.65 | 0.02 | 0 | 0 | 528 | 52 | 1.6% | 4 | 86 | 2.7% |
| 39 | 0.75 | 0.05 | 0.55 | -0.00 | 0 | 0 | 537 | 52 | 1.6% | 4 | 86 | 2.7% |
| 40 | 0.75 | 0.05 | 0.45 | -0.02 | 0 | 0 | 549 | 52 | 1.6% | 4 | 86 | 2.7% |
| 41 | 0.7 | 0.05 | 0.7 | 0.03 | 0 | 0 | 703 | 52 | 1.6% | 4 | 88 | 2.7% |
| 42 | 0.7 | 0.05 | 0.65 | 0.02 | 0 | 0 | 705 | 52 | 1.6% | 4 | 88 | 2.7% |
| 43 | 0.7 | 0.05 | 0.55 | -0.00 | 0 | 0 | 719 | 52 | 1.6% | 4 | 88 | 2.7% |
| 44 | 0.7 | 0.05 | 0.45 | -0.02 | 0 | 0 | 735 | 52 | 1.6% | 4 | 88 | 2.7% |
| 45 | 0.8 | 0.15 | 0.7 | 0.51 | 0 | 0 | 317 | 50 | 1.5% | 4 | 89 | 2.7% |
| 46 | 0.8 | 0.15 | 0.65 | 0.50 | 0 | 0 | 323 | 50 | 1.5% | 4 | 89 | 2.7% |
| 47 | 0.8 | 0.15 | 0.55 | 0.48 | 0 | 0 | 329 | 50 | 1.5% | 4 | 89 | 2.7% |
| 48 | 0.85 | 0.2 | 0.7 | 0.75 | 0 | 0 | 397 | 48 | 1.5% | 0 | 91 | 2.8% |
| 49 | 0.85 | 0.2 | 0.65 | 0.74 | 0 | 0 | 403 | 48 | 1.5% | 0 | 91 | 2.8% |
| 50 | 0.85 | 0.2 | 0.55 | 0.72 | 0 | 0 | 410 | 48 | 1.5% | 0 | 91 | 2.8% |
| 51 | 0.8 | 0.15 | 0.45 | 0.46 | 0 | 0 | 340 | 52 | 1.6% | 4 | 91 | 2.8% |
| 52 | 0.85 | 0.2 | 0.45 | 0.71 | 0 | 0 | 421 | 50 | 1.5% | 0 | 93 | 2.9% |
| 53 | 0.9 | 0.2 | 0.7 | 0.74 | 0 | 0 | 412 | 48 | 1.5% | 0 | 102 | 3.1% |
| 54 | 0.9 | 0.2 | 0.65 | 0.73 | 0 | 0 | 417 | 48 | 1.5% | 0 | 102 | 3.1% |
| 55 | 0.9 | 0.2 | 0.55 | 0.72 | 0 | 0 | 427 | 48 | 1.5% | 0 | 102 | 3.1% |
| 56 | 0.9 | 0.2 | 0.45 | 0.70 | 0 | 0 | 432 | 50 | 1.5% | 0 | 104 | 3.2% |
| 57 | 0.8 | 0.2 | 0.7 | 0.76 | 0 | 0 | 389 | 62 | 1.9% | 4 | 108 | 3.3% |
| 58 | 0.8 | 0.2 | 0.65 | 0.75 | 0 | 0 | 395 | 62 | 1.9% | 4 | 108 | 3.3% |
| 59 | 0.8 | 0.2 | 0.55 | 0.73 | 0 | 0 | 401 | 62 | 1.9% | 4 | 108 | 3.3% |
| 60 | 0.8 | 0.2 | 0.45 | 0.71 | 0 | 0 | 412 | 64 | 2.0% | 4 | 110 | 3.4% |
| 61 | 0.7 | 0.1 | 0.7 | 0.28 | 0 | 0 | 645 | 98 | 3.0% | 4 | 133 | 4.1% |
| 62 | 0.7 | 0.1 | 0.65 | 0.27 | 0 | 0 | 647 | 98 | 3.0% | 4 | 133 | 4.1% |
| 63 | 0.7 | 0.1 | 0.55 | 0.25 | 0 | 0 | 661 | 98 | 3.0% | 4 | 133 | 4.1% |
| 64 | 0.7 | 0.1 | 0.45 | 0.23 | 0 | 0 | 677 | 98 | 3.0% | 4 | 133 | 4.1% |
| 65 | 0.75 | 0.15 | 0.7 | 0.51 | 0 | 0 | 462 | 98 | 3.0% | 4 | 143 | 4.4% |
| 66 | 0.75 | 0.15 | 0.65 | 0.50 | 0 | 0 | 467 | 98 | 3.0% | 4 | 143 | 4.4% |
| 67 | 0.75 | 0.15 | 0.55 | 0.48 | 0 | 0 | 476 | 98 | 3.0% | 4 | 143 | 4.4% |
| 68 | 0.75 | 0.15 | 0.45 | 0.46 | 0 | 0 | 488 | 98 | 3.0% | 4 | 143 | 4.4% |
| 69 | 0.75 | 0.2 | 0.7 | 0.76 | 0 | 0 | 474 | 98 | 3.0% | 4 | 147 | 4.5% |
| 70 | 0.75 | 0.2 | 0.65 | 0.75 | 0 | 0 | 479 | 98 | 3.0% | 4 | 147 | 4.5% |
| 71 | 0.75 | 0.2 | 0.55 | 0.73 | 0 | 0 | 488 | 98 | 3.0% | 4 | 147 | 4.5% |
| 72 | 0.75 | 0.2 | 0.45 | 0.71 | 0 | 0 | 500 | 98 | 3.0% | 4 | 147 | 4.5% |
| 73 | 0.7 | 0.15 | 0.7 | 0.52 | 0 | 0 | 651 | 98 | 3.0% | 4 | 156 | 4.8% |
| 74 | 0.7 | 0.15 | 0.65 | 0.51 | 0 | 0 | 653 | 98 | 3.0% | 4 | 156 | 4.8% |
| 75 | 0.7 | 0.15 | 0.55 | 0.49 | 0 | 0 | 667 | 98 | 3.0% | 4 | 156 | 4.8% |
| 76 | 0.7 | 0.2 | 0.7 | 0.76 | 0 | 0 | 679 | 98 | 3.0% | 4 | 156 | 4.8% |
| 77 | 0.7 | 0.2 | 0.65 | 0.76 | 0 | 0 | 681 | 98 | 3.0% | 4 | 156 | 4.8% |
| 78 | 0.7 | 0.15 | 0.45 | 0.47 | 0 | 0 | 683 | 98 | 3.0% | 4 | 156 | 4.8% |
| 79 | 0.7 | 0.2 | 0.55 | 0.73 | 0 | 0 | 695 | 98 | 3.0% | 4 | 156 | 4.8% |
| 80 | 0.7 | 0.2 | 0.45 | 0.72 | 0 | 0 | 711 | 98 | 3.0% | 4 | 156 | 4.8% |

## Recommender Comparison Scope

Current recommender comparison covers freshwater daily-picks rows only: largemouth bass for lake/pond and trout for river. Coastal and flats rows remain in the Today’s Bite score audit, including measured-water variants, but do not run daily-picks pick comparisons here.

## Pick-Change Cause Counts

| Cause among selected-pick changes | Count |
| --- | ---: |
| Activity changed | 0 |
| Thermal mode changed | 0 |
| Surface gate changed | 0 |

## Selected-Pick Changes By Context

| Context | Pick Changes |
| --- | ---: |
| No selected-pick changes | 0 |

## Selected-Pick Changes By Archetype

| Archetype | Pick Changes |
| --- | ---: |
| No selected-pick changes | 0 |

## Score Delta By Context

| Context | Rows | Avg Delta | Min Delta | Max Delta | Abs >= 8 |
| --- | ---: | ---: | ---: | ---: | ---: |
| coastal | 3888 | 0.00 | 0 | 0 | 0 |
| coastal_flats_estuary | 3888 | 0.00 | 0 | 0 | 0 |
| freshwater_lake_pond | 1944 | 0.00 | 0 | 0 | 0 |
| freshwater_river | 1944 | 0.00 | 0 | 0 | 0 |

## Score Delta By Archetype

| Archetype | Rows | Avg Delta | Min Delta | Max Delta | Abs >= 8 |
| --- | ---: | ---: | ---: | ---: | ---: |
| active_rain | 1296 | 0.00 | 0 | 0 | 0 |
| bright_calm | 1296 | 0.00 | 0 | 0 | 0 |
| cold_front_shock | 1296 | 0.00 | 0 | 0 | 0 |
| heat_limited | 1296 | 0.00 | 0 | 0 | 0 |
| overcast_breezy | 1296 | 0.00 | 0 | 0 | 0 |
| recent_rain_runoff | 1296 | 0.00 | 0 | 0 | 0 |
| stable_good | 1296 | 0.00 | 0 | 0 | 0 |
| warming_trend | 1296 | 0.00 | 0 | 0 | 0 |
| windy | 1296 | 0.00 | 0 | 0 | 0 |

## Top 30 Largest Score Deltas

| # | Region | Month | Context | Archetype | Baseline | V2 | Delta |
| ---: | --- | ---: | --- | --- | ---: | ---: | ---: |
| 1 | northeast | 1 | freshwater_lake_pond | stable_good_air | 57 | 57 | 0 |
| 2 | northeast | 1 | freshwater_lake_pond | cold_front_shock_air | 48 | 48 | 0 |
| 3 | northeast | 1 | freshwater_lake_pond | warming_trend_air | 60 | 60 | 0 |
| 4 | northeast | 1 | freshwater_lake_pond | heat_limited_air | 49 | 49 | 0 |
| 5 | northeast | 1 | freshwater_lake_pond | active_rain_air | 57 | 57 | 0 |
| 6 | northeast | 1 | freshwater_lake_pond | recent_rain_runoff_air | 56 | 56 | 0 |
| 7 | northeast | 1 | freshwater_lake_pond | bright_calm_air | 48 | 48 | 0 |
| 8 | northeast | 1 | freshwater_lake_pond | overcast_breezy_air | 67 | 67 | 0 |
| 9 | northeast | 1 | freshwater_lake_pond | windy_air | 49 | 49 | 0 |
| 10 | northeast | 1 | freshwater_river | stable_good_air | 63 | 63 | 0 |
| 11 | northeast | 1 | freshwater_river | cold_front_shock_air | 56 | 56 | 0 |
| 12 | northeast | 1 | freshwater_river | warming_trend_air | 65 | 65 | 0 |
| 13 | northeast | 1 | freshwater_river | heat_limited_air | 58 | 58 | 0 |
| 14 | northeast | 1 | freshwater_river | active_rain_air | 45 | 45 | 0 |
| 15 | northeast | 1 | freshwater_river | recent_rain_runoff_air | 45 | 45 | 0 |
| 16 | northeast | 1 | freshwater_river | bright_calm_air | 58 | 58 | 0 |
| 17 | northeast | 1 | freshwater_river | overcast_breezy_air | 69 | 69 | 0 |
| 18 | northeast | 1 | freshwater_river | windy_air | 59 | 59 | 0 |
| 19 | northeast | 1 | coastal | stable_good_air | 66 | 66 | 0 |
| 20 | northeast | 1 | coastal | stable_good_water | 66 | 66 | 0 |
| 21 | northeast | 1 | coastal | cold_front_shock_air | 61 | 61 | 0 |
| 22 | northeast | 1 | coastal | cold_front_shock_water | 69 | 69 | 0 |
| 23 | northeast | 1 | coastal | warming_trend_air | 71 | 71 | 0 |
| 24 | northeast | 1 | coastal | warming_trend_water | 65 | 65 | 0 |
| 25 | northeast | 1 | coastal | heat_limited_air | 62 | 62 | 0 |
| 26 | northeast | 1 | coastal | heat_limited_water | 62 | 62 | 0 |
| 27 | northeast | 1 | coastal | active_rain_air | 68 | 68 | 0 |
| 28 | northeast | 1 | coastal | active_rain_water | 68 | 68 | 0 |
| 29 | northeast | 1 | coastal | recent_rain_runoff_air | 67 | 67 | 0 |
| 30 | northeast | 1 | coastal | recent_rain_runoff_water | 67 | 67 | 0 |

## Top 30 Selected-Pick Changes

| # | Region | Month | Context | Scenario | Baseline Picks | V2 Picks |
| ---: | --- | ---: | --- | --- | --- | --- |
| No selected-pick changes | - | - | - | - | - | - |

## Artifacts

- JSONL: `scripts/audit/todays-bite-temperature-v2-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-temperature-v2-audit.md`
