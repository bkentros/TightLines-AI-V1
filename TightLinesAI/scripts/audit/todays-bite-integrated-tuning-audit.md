# Today's Bite Integrated Tuning Shadow Audit

Generated: 2026-05-13T18:39:40.516Z

Phase 9B shadow-only candidate sweep. Production normalizers, scoreDay, report copy, app/forecast/cache behavior, and recommender production logic were not changed.

## Candidate Sweep

| Candidate | Avg delta | Min | Max | abs>=8 | abs>=12 | Activity tier changes | Reliability changes | Total flags | Valid rec rows | Pick changes | Thermal changes | Surface changes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 3130 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| precip_heavy_cap | -0.03 | -3 | 0 | 0 | 0 | 100 | 0 | 3106 | 17280 | 20 (0.1%) | 0 (0.0%) | 8 (0.0%) |
| wet_baseline_stronger | -0.03 | -3 | 0 | 0 | 0 | 98 | 0 | 2990 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| hot_bright_calm_compound | -0.25 | -5 | 0 | 0 | 0 | 720 | 0 | 2770 | 17280 | 74 (0.4%) | 2 (0.0%) | 86 (0.5%) |
| improving_shock_soften | 0.03 | -5 | 4 | 0 | 0 | 238 | 0 | 3064 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_light | -0.17 | -5 | 2 | 0 | 0 | 802 | 0 | 2906 | 17280 | 54 (0.3%) | 2 (0.0%) | 50 (0.3%) |
| combined_stronger | -0.37 | -7 | 5 | 0 | 0 | 1648 | 0 | 2414 | 17280 | 136 (0.8%) | 4 (0.0%) | 136 (0.8%) |

## Focus Flag Reductions

| Candidate | Heavy rain too high | Wet baseline too high | Hot bright calm | Improving shock over-penalized | Copy conflict |
| --- | ---: | ---: | ---: | ---: | ---: |
| production_control | 500 (0.0%) | 458 (0.0%) | 482 (0.0%) | 236 (0.0%) | 146 (0.0%) |
| precip_heavy_cap | 460 (8.0%) | 458 (0.0%) | 482 (0.0%) | 236 (0.0%) | 146 (0.0%) |
| wet_baseline_stronger | 500 (0.0%) | 418 (8.7%) | 482 (0.0%) | 236 (0.0%) | 96 (34.2%) |
| hot_bright_calm_compound | 500 (0.0%) | 458 (0.0%) | 174 (63.9%) | 236 (0.0%) | 146 (0.0%) |
| improving_shock_soften | 500 (0.0%) | 458 (0.0%) | 482 (0.0%) | 170 (28.0%) | 146 (0.0%) |
| combined_light | 478 (4.4%) | 436 (4.8%) | 444 (7.9%) | 206 (12.7%) | 108 (26.0%) |
| combined_stronger | 456 (8.8%) | 390 (14.8%) | 124 (74.3%) | 162 (31.4%) | 82 (43.8%) |

## Fixed-Issue Regression Check

- production_control: 0
- precip_heavy_cap: 0
- wet_baseline_stronger: 0
- hot_bright_calm_compound: 0
- improving_shock_soften: 0
- combined_light: 0
- combined_stronger: 0

## Top Regressions For Combined Stronger

| Region | Month | Context | Archetype | Clarity | Prod | Candidate | Delta | Prod flags | Candidate flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| northeast | 1 | freshwater_lake_pond | heavy_active_rain | clear | 36 | 34 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| northeast | 1 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 34 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| northeast | 2 | freshwater_lake_pond | heavy_active_rain | clear | 36 | 34 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| northeast | 2 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 34 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| northeast | 3 | freshwater_lake_pond | heavy_active_rain | clear | 37 | 35 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| northeast | 3 | freshwater_lake_pond | heavy_active_rain | stained | 37 | 35 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| northeast | 8 | coastal_flats_estuary | heavy_active_rain | clear | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| northeast | 8 | coastal_flats_estuary | heavy_active_rain | stained | 41 | 40 | -1 |  | low_score_with_multiple_strong_drivers |
| northeast | 10 | freshwater_lake_pond | heavy_active_rain | clear | 42 | 40 | -2 |  | low_score_with_multiple_strong_drivers |
| northeast | 10 | freshwater_lake_pond | heavy_active_rain | stained | 42 | 40 | -2 |  | low_score_with_multiple_strong_drivers |
| southeast_atlantic | 4 | freshwater_lake_pond | warming_into_heat | clear | 38 | 33 | -5 |  |  |
| southeast_atlantic | 4 | freshwater_lake_pond | warming_into_heat | stained | 38 | 33 | -5 |  |  |
| southeast_atlantic | 5 | freshwater_lake_pond | stable_poor_hot | clear | 37 | 33 | -4 |  |  |
| southeast_atlantic | 5 | freshwater_lake_pond | stable_poor_hot | stained | 37 | 33 | -4 |  |  |
| southeast_atlantic | 6 | freshwater_lake_pond | stable_poor_hot | clear | 40 | 35 | -5 |  |  |
| southeast_atlantic | 6 | freshwater_lake_pond | stable_poor_hot | stained | 40 | 35 | -5 |  |  |
| southeast_atlantic | 7 | freshwater_lake_pond | stable_poor_hot | clear | 40 | 35 | -5 |  |  |
| southeast_atlantic | 7 | freshwater_lake_pond | stable_poor_hot | stained | 40 | 35 | -5 |  |  |
| southeast_atlantic | 8 | freshwater_lake_pond | stable_poor_hot | clear | 40 | 35 | -5 |  |  |
| southeast_atlantic | 8 | freshwater_lake_pond | stable_poor_hot | stained | 40 | 35 | -5 |  |  |
| southeast_atlantic | 9 | freshwater_lake_pond | stable_poor_hot | clear | 37 | 33 | -4 |  |  |
| southeast_atlantic | 9 | freshwater_lake_pond | stable_poor_hot | stained | 37 | 33 | -4 |  |  |
| florida | 1 | freshwater_lake_pond | heavy_active_rain | stained | 36 | 34 | -2 | low_score_with_multiple_strong_drivers | low_score_with_multiple_strong_drivers |
| florida | 2 | freshwater_lake_pond | warming_into_heat | clear | 37 | 33 | -4 |  |  |
| florida | 2 | freshwater_lake_pond | warming_into_heat | stained | 37 | 33 | -4 |  |  |
| florida | 3 | freshwater_lake_pond | warming_into_heat | clear | 36 | 33 | -3 |  |  |
| florida | 3 | freshwater_lake_pond | warming_into_heat | stained | 36 | 33 | -3 |  |  |
| florida | 4 | freshwater_lake_pond | stable_poor_hot | clear | 37 | 33 | -4 |  |  |
| florida | 4 | freshwater_lake_pond | stable_poor_hot | stained | 37 | 33 | -4 |  |  |
| florida | 5 | freshwater_lake_pond | warming_into_heat | clear | 38 | 34 | -4 |  |  |

## Recommended Finalist

**no safe finalist**

Recommendation: **no safe finalist; needs narrower sweep and likely copy-only audit follow-up**.

Notes:
- This audit intentionally leaves report-copy strings untouched. Remaining `report_copy_conflicts_with_score` rows should be reviewed in a copy-only pass because candidate score changes can reduce but not fully validate prose alignment.
- Recommender comparisons use current production daily-picks logic with candidate How's Fishing analysis injected in memory.

## Artifacts

- JSONL: `scripts/audit/todays-bite-integrated-tuning-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-integrated-tuning-audit.md`
