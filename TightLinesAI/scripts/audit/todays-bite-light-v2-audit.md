# Today's Bite Light/Cloud V2 Production Parity Audit

Generated: 2026-05-13T17:01:10.627Z

Phase 6C production parity audit. Production light/cloud scoring is expected to match `score_only_heavy_overcast_cap`. Recommender production logic remains unchanged.

## Production Parity

- Production-vs-experiment light mismatches: **0**
- Production-vs-experiment score delta rows: **0**
- Production-vs-experiment selected-pick changes: **0**
- Production-vs-experiment light-mode changes: **0**
- Production-vs-experiment surface-gate changes: **0**
- Production-vs-experiment scenario-tag changes: **0**

## Historical Pre-Wiring Impact

Retained from Phase 6A/6B before production wiring:

- avg delta: **-0.23**
- max/min delta: **0 / -4**
- abs(score_delta) >= 8: **0**
- abs(score_delta) >= 12: **0**
- selected-pick changes: **0 / 14,400**
- total questionable flags: **8,177 -> 3,613**

## Current Production Findings

- Total production baseline rows: 34560
- Production current-state questionable light flags: 3613
- Production bright/cold clear penalty flags: 1754
- Production overcast daymaker flags: 0
- Production heavy-overcast windy flags: 1348
- Production missing wind/cloud overconfident flags: 0

## Candidate Sweep

Best candidate: **score_only_heavy_overcast_cap**

| Candidate | Rows | Light Mismatches | Score Delta Rows | Avg Delta | Max | Min | abs>=8 | abs>=12 | Activity Tier Changes | Reliability Changes | Light Label Changes | Light Sign Changes | Light Driver Changes | Light Suppressor Changes | Rec Valid | Rec Errors | Pick Changes | Pick Change % | Light Mode Changes | Surface Gate Changes | Tag Changes | Total Flags | Meets Targets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| production_control | 34560 | 0 | 0 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0.00% | 0 | 0 | 0 | 3613 | yes |
| score_only_soft_overcast | 34560 | 14688 | 10684 | -0.00 | 4 | -2 | 0 | 0 | 866 | 0 | 0 | 0 | 2898 | 0 | 14400 | 2880 | 47 | 0.33% | 0 | 8 | 38 | 8185 | yes |
| score_only_cold_clear_neutral | 34560 | 8644 | 8644 | 0.55 | 4 | 0 | 0 | 0 | 870 | 0 | 0 | 0 | 1608 | 2292 | 14400 | 2880 | 29 | 0.20% | 0 | 8 | 8 | 8185 | yes |
| score_only_heavy_overcast_cap | 34560 | 0 | 0 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0.00% | 0 | 0 | 0 | 3613 | yes |
| score_only_combined | 34560 | 16420 | 12416 | 0.07 | 4 | -2 | 0 | 0 | 1152 | 0 | 0 | 0 | 1290 | 2292 | 14400 | 2880 | 76 | 0.53% | 0 | 16 | 46 | 3629 | yes |
| label_or_mode_cleanup_diagnostic | 34560 | 3456 | 3456 | 0.23 | 4 | 0 | 0 | 0 | 292 | 0 | 0 | 0 | 1608 | 0 | 14400 | 2880 | 0 | 0.00% | 0 | 0 | 0 | 8177 | yes |

## Flags: Production vs Best

| Flag | Production | score_only_heavy_overcast_cap | Reduction |
| --- | ---: | ---: | ---: |
| bright_clear_penalty_during_cold_or_cool_water_questionable | 1754 | 1754 | 0 |
| overcast_too_strong_as_daymaker | 0 | 0 | 0 |
| heavy_overcast_windy_not_suppressed_enough | 1348 | 1348 | 0 |
| clear_calm_surface_or_clear_subtle_questionable | 511 | 511 | 0 |
| surface_gate_changes_from_light_wind | 0 | 0 | 0 |
| missing_wind_or_cloud_overconfident | 0 | 0 | 0 |
| verbal_driver_mismatch | 0 | 0 | 0 |

## Recommender Coupling

- Valid recommender rows for best candidate: 14400
- Recommender error rows for best candidate: 2880
- Selected-pick changes: 0 (0.00%)
- Light mode changes: 0 (0.00%)
- Surface gate changes: 0 (0.00%)
- Scenario tag changes: 0 (0.00%)

### Best Candidate Light Mode Distribution

- low_light: 5040
- glare: 4366
- mixed: 2160
- bright: 2114
- unknown: 720

### Best Candidate Surface Gate Distribution

- closed: 10214
- open: 2652
- caution: 1534

## Largest Score Deltas For Best Candidate

| Candidate | Region | Month | Context | Archetype | Clarity | Delta | Baseline Light | V2 Light | V2 Flags | Picks Changed |
| --- | --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | clear_calm | stained | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | clear_windy | clear | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | clear_windy | stained | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | mixed_light_breezy | clear | 0 | mixed:0.075 | mixed:0.075 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | mixed_light_breezy | stained | 0 | mixed:0.075 | mixed:0.075 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | overcast_calm | clear | 0 | low_light:0.825 | low_light:0.825 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | overcast_calm | stained | 0 | low_light:0.825 | low_light:0.825 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | overcast_breezy | clear | 0 | low_light:0.825 | low_light:0.825 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | overcast_breezy | stained | 0 | low_light:0.825 | low_light:0.825 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | low_light_calm | clear | 0 | low_light:0.675 | low_light:0.675 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | low_light_calm | stained | 0 | low_light:0.675 | low_light:0.675 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | low_light_windy | clear | 0 | low_light:0.675 | low_light:0.675 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | low_light_windy | stained | 0 | low_light:0.675 | low_light:0.675 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | severe_wind | clear | 0 | mixed:0.075 | mixed:0.075 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | severe_wind | stained | 0 | mixed:0.075 | mixed:0.075 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | missing_cloud | clear | 0 | null:null | null:null |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | missing_cloud | stained | 0 | null:null | null:null |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | missing_wind | clear | 0 | mixed:0.075 | mixed:0.075 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | missing_wind | stained | 0 | mixed:0.075 | mixed:0.075 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | cold_clear_calm | clear | 0 | bright:0 | bright:0 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | cold_clear_calm | stained | 0 | bright:0 | bright:0 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | cool_clear_breezy | clear | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | cool_clear_breezy | stained | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | neutral_clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | neutral_clear_calm | stained | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | warm_clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 |  | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | warm_clear_calm | stained | 0 | glare:-0.91 | glare:-0.91 |  | false |

## Representative Questionable Samples

| Candidate | Region | Month | Context | Archetype | Clarity | Delta | Baseline Light | V2 Light | V2 Flags | Picks Changed |
| --- | --- | ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | flats_heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_lake_pond | flats_heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 1 | freshwater_river | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 1 | coastal_flats_estuary | cold_clear_calm | clear | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 1 | coastal_flats_estuary | cold_clear_calm | stained | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_lake_pond | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_lake_pond | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_lake_pond | heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_lake_pond | flats_heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_lake_pond | flats_heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_river | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_river | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_river | heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_river | flats_heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | freshwater_river | flats_heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 2 | coastal_flats_estuary | cold_clear_calm | clear | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 2 | coastal_flats_estuary | cold_clear_calm | stained | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 3 | freshwater_lake_pond | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 3 | freshwater_lake_pond | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 3 | freshwater_lake_pond | heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 3 | freshwater_lake_pond | flats_heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 3 | freshwater_lake_pond | flats_heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 3 | freshwater_river | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 3 | coastal_flats_estuary | cold_clear_calm | clear | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 3 | coastal_flats_estuary | cold_clear_calm | stained | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 4 | freshwater_lake_pond | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 4 | freshwater_lake_pond | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 4 | freshwater_lake_pond | heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 4 | freshwater_lake_pond | flats_heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 4 | freshwater_lake_pond | flats_heavy_overcast_windy | stained | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |
| score_only_heavy_overcast_cap | northeast | 4 | freshwater_river | clear_calm | clear | 0 | glare:-0.91 | glare:-0.91 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 4 | coastal_flats_estuary | cold_clear_calm | clear | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 4 | coastal_flats_estuary | cold_clear_calm | stained | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 4 | coastal_flats_estuary | cool_clear_breezy | clear | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 4 | coastal_flats_estuary | cool_clear_breezy | stained | 0 | glare:-0.3 | glare:-0.3 | bright_clear_penalty_during_cold_or_cool_water_questionable | false |
| score_only_heavy_overcast_cap | northeast | 5 | freshwater_lake_pond | clear_calm | clear | 0 | bright:0 | bright:0 | clear_calm_surface_or_clear_subtle_questionable | false |
| score_only_heavy_overcast_cap | northeast | 5 | freshwater_lake_pond | heavy_overcast_windy | clear | 0 | heavy_overcast:0.4667 | heavy_overcast:0.4667 | heavy_overcast_windy_not_suppressed_enough | false |

## Production Plumbing

Production wiring now passes `e.wind_speed_mph` from `buildNormalized.ts` into `normalizeLight(..., { windMph })`. The public function name remains unchanged, labels/details/null behavior are preserved, and only heavy-overcast score ranges changed.

## Recommendation

Production parity confirmed for score_only_heavy_overcast_cap.

## Artifacts

- JSONL: `scripts/audit/todays-bite-light-v2-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-light-v2-audit.md`
