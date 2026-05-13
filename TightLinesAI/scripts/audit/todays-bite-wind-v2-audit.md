# Today's Bite Wind V2 Shadow Audit

Generated: 2026-05-13T14:00:55.815Z

Phase 4C parity mode. Production wind normalization should match the experiment
winner; recommender production coupling remains untouched.

Phase 4C note: after production wiring, `score_only|high_wind_penalty_only`
is the production-vs-experiment parity check. Historical pre-wiring impact for
this candidate was 33 / 14,400 selected-pick changes (0.2%), 0 surface gate
changes, 0 rows with abs(score_delta) >= 8, and 0 rows with abs(score_delta) >= 12.

## Summary

| Metric | Value |
| --- | ---: |
| Baseline rows | 34560 |
| Candidates evaluated | 30 |
| Production control zero-delta | passed |
| Production-vs-experiment wind mismatches | 0 |
| Production-vs-experiment score deltas | 0.00 avg, 0 abs>=8, 0 abs>=12 |
| Production-vs-experiment selected-pick changes | 0 |
| Production-vs-experiment surface gate changes | 0 |
| Best overall candidate | combined|high_wind_penalty_only|remove_light_breeze_only |
| Best score-only candidate | score_only|high_wind_penalty_only |
| Best tag-only candidate | tag_only|remove_light_breeze_only |
| Best combined candidate | combined|high_wind_penalty_only|remove_light_breeze_only |
| Best avg score delta | 0.00 |
| Best max/min score delta | 0 / 0 |
| Best abs(score_delta) >= 8 | 0 |
| Best abs(score_delta) >= 12 | 0 |
| Best activity tier changes | 0 |
| Best surface gate changes | 0 |
| Best selected-pick changes | 0 |
| Best selected-pick change percent | 0.0% |
| Recommendation | wind score only is safe but tag tuning is not |

## Best Mode Snapshots

| Mode | Candidate | Avg Delta | abs>=8 | abs>=12 | Activity Changes | Tag Changes | Surface Changes | Pick Changes | Pick Change % | Wind Reaction V2 (Reduction) | Open Water V2 (Reduction) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | production_control | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0.0% | 9746 (0) | 4742 (0) |
| score_only | score_only|high_wind_penalty_only | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0.0% | 9746 (0) | 4742 (0) |
| tag_only | tag_only|remove_light_breeze_only | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0.0% | 9746 (0) | 4742 (0) |
| combined | combined|high_wind_penalty_only|remove_light_breeze_only | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0.0% | 9746 (0) | 4742 (0) |

## Corrected Sweep Table

| Candidate Mode | Wind Profile | Tag Policy | Avg Delta | Max | Min | abs>=8 | abs>=12 | Activity Changes | Wind Changes | Valid Rec | Rec Errors | Wind Mode Changes | Surface Changes | Tag Changes | Wind Reaction V2 (Reduction) | Open Water V2 (Reduction) | Light Breeze Triggers | Pick Changes | Pick Change % |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| combined | high_wind_penalty_only | remove_light_breeze_only | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 0 | 9746 (0) | 4742 (0) | 0 | 0 | 0.0% |
| combined | high_wind_penalty_only | severe_wind_keeps_reaction_no_open_water | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 0 | 9746 (0) | 4742 (0) | 0 | 0 | 0.0% |
| production_control | production_control | preserve_production_tags | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 0 | 9746 (0) | 4742 (0) | 0 | 0 | 0.0% |
| score_only | high_wind_penalty_only | preserve_production_tags | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 0 | 9746 (0) | 4742 (0) | 0 | 0 | 0.0% |
| tag_only | production_control | remove_light_breeze_only | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 0 | 9746 (0) | 4742 (0) | 0 | 0 | 0.0% |
| tag_only | production_control | severe_wind_keeps_reaction_no_open_water | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 0 | 9746 (0) | 4742 (0) | 0 | 0 | 0.0% |
| combined | mild_combined | remove_light_breeze_only | -0.79 | 0 | -4 | 0 | 0 | 1914 | 21168 | 14400 | 2880 | 0 | 2 | 16 | 9746 (0) | 4742 (0) | 0 | 24 | 0.2% |
| combined | mild_combined | severe_wind_keeps_reaction_no_open_water | -0.79 | 0 | -4 | 0 | 0 | 1914 | 21168 | 14400 | 2880 | 0 | 2 | 16 | 9746 (0) | 4742 (0) | 0 | 24 | 0.2% |
| score_only | mild_combined | preserve_production_tags | -0.79 | 0 | -4 | 0 | 0 | 1914 | 21168 | 14400 | 2880 | 0 | 2 | 16 | 9746 (0) | 4742 (0) | 0 | 24 | 0.2% |
| combined | previous_combined_v2 | remove_light_breeze_only | -1.14 | 0 | -4 | 0 | 0 | 3022 | 21168 | 14400 | 2880 | 0 | 2 | 18 | 9746 (0) | 4742 (0) | 0 | 30 | 0.2% |
| combined | previous_combined_v2 | severe_wind_keeps_reaction_no_open_water | -1.14 | 0 | -4 | 0 | 0 | 3022 | 21168 | 14400 | 2880 | 0 | 2 | 18 | 9746 (0) | 4742 (0) | 0 | 30 | 0.2% |
| score_only | previous_combined_v2 | preserve_production_tags | -1.14 | 0 | -4 | 0 | 0 | 3022 | 21168 | 14400 | 2880 | 0 | 2 | 18 | 9746 (0) | 4742 (0) | 0 | 30 | 0.2% |
| combined | mild_positive_compression | remove_light_breeze_only | -0.41 | 4 | -4 | 0 | 0 | 2712 | 29808 | 14400 | 2880 | 0 | 2 | 64 | 9794 (-48) | 4742 (0) | 0 | 68 | 0.5% |
| combined | mild_positive_compression | severe_wind_keeps_reaction_no_open_water | -0.41 | 4 | -4 | 0 | 0 | 2712 | 29808 | 14400 | 2880 | 0 | 2 | 64 | 9794 (-48) | 4742 (0) | 0 | 68 | 0.5% |
| score_only | mild_positive_compression | preserve_production_tags | -0.41 | 4 | -4 | 0 | 0 | 2712 | 29808 | 14400 | 2880 | 0 | 2 | 64 | 9794 (-48) | 4742 (0) | 0 | 68 | 0.5% |
| combined | high_wind_penalty_only | conservative_cleanup | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 1608 | 9746 (0) | 3134 (1608) | 0 | 1459 | 10.1% |
| combined | high_wind_penalty_only | no_open_water_below_10 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 1608 | 9746 (0) | 3134 (1608) | 0 | 1459 | 10.1% |
| tag_only | production_control | conservative_cleanup | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 1608 | 9746 (0) | 3134 (1608) | 0 | 1459 | 10.1% |
| tag_only | production_control | no_open_water_below_10 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 1608 | 9746 (0) | 3134 (1608) | 0 | 1459 | 10.1% |
| combined | mild_combined | conservative_cleanup | -0.79 | 0 | -4 | 0 | 0 | 1914 | 21168 | 14400 | 2880 | 0 | 2 | 1624 | 9746 (0) | 3134 (1608) | 0 | 1481 | 10.3% |
| combined | mild_combined | no_open_water_below_10 | -0.79 | 0 | -4 | 0 | 0 | 1914 | 21168 | 14400 | 2880 | 0 | 2 | 1624 | 9746 (0) | 3134 (1608) | 0 | 1481 | 10.3% |
| combined | previous_combined_v2 | conservative_cleanup | -1.14 | 0 | -4 | 0 | 0 | 3022 | 21168 | 14400 | 2880 | 0 | 2 | 1626 | 9746 (0) | 3134 (1608) | 0 | 1487 | 10.3% |
| combined | previous_combined_v2 | no_open_water_below_10 | -1.14 | 0 | -4 | 0 | 0 | 3022 | 21168 | 14400 | 2880 | 0 | 2 | 1626 | 9746 (0) | 3134 (1608) | 0 | 1487 | 10.3% |
| combined | mild_positive_compression | conservative_cleanup | -0.41 | 4 | -4 | 0 | 0 | 2712 | 29808 | 14400 | 2880 | 0 | 2 | 1672 | 9794 (-48) | 3134 (1608) | 0 | 1525 | 10.6% |
| combined | mild_positive_compression | no_open_water_below_10 | -0.41 | 4 | -4 | 0 | 0 | 2712 | 29808 | 14400 | 2880 | 0 | 2 | 1672 | 9794 (-48) | 3134 (1608) | 0 | 1525 | 10.6% |
| combined | high_wind_penalty_only | no_open_water_below_11 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 4434 | 9746 (0) | 308 (4434) | 0 | 4055 | 28.2% |
| tag_only | production_control | no_open_water_below_11 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 14400 | 2880 | 0 | 0 | 4434 | 9746 (0) | 308 (4434) | 0 | 4055 | 28.2% |
| combined | mild_combined | no_open_water_below_11 | -0.79 | 0 | -4 | 0 | 0 | 1914 | 21168 | 14400 | 2880 | 0 | 2 | 4448 | 9746 (0) | 308 (4434) | 0 | 4072 | 28.3% |
| combined | previous_combined_v2 | no_open_water_below_11 | -1.14 | 0 | -4 | 0 | 0 | 3022 | 21168 | 14400 | 2880 | 0 | 2 | 4450 | 9746 (0) | 308 (4434) | 0 | 4074 | 28.3% |
| combined | mild_positive_compression | no_open_water_below_11 | -0.41 | 4 | -4 | 0 | 0 | 2712 | 29808 | 14400 | 2880 | 0 | 2 | 4496 | 9794 (-48) | 308 (4434) | 0 | 4116 | 28.6% |

## Best Overall Pick-Change Causes

| Cause | Rows |
| --- | ---: |
| None | 0 |

## Best Overall Tag-Change Causes

| Cause | Rows |
| --- | ---: |
| None | 0 |

## Best Score-Only Pick-Change Causes

| Cause | Rows |
| --- | ---: |
| None | 0 |

## Best Tag-Only Pick-Change Causes

| Cause | Rows |
| --- | ---: |
| None | 0 |

## Best Combined Pick-Change Causes

| Cause | Rows |
| --- | ---: |
| None | 0 |

## Selected-Pick Changes By Archetype

| Archetype | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
| clear_breezy | 0 | 720 | 0.0% |
| clear_calm | 0 | 720 | 0.0% |
| clear_windy | 0 | 720 | 0.0% |
| fast_falling_pressure_clear_breezy | 0 | 720 | 0.0% |
| heavy_overcast_windy | 0 | 720 | 0.0% |
| hourly_daylight_wind_mean_vs_scalar_conflict | 0 | 720 | 0.0% |
| hourly_daylight_wind_spike | 0 | 720 | 0.0% |
| insufficient_pressure_history | 0 | 720 | 0.0% |
| low_light_calm | 0 | 720 | 0.0% |
| low_light_windy | 0 | 720 | 0.0% |
| missing_cloud | 0 | 720 | 0.0% |
| missing_wind | 0 | 720 | 0.0% |
| mixed_light_breezy | 0 | 720 | 0.0% |
| overcast_breezy | 0 | 720 | 0.0% |
| overcast_calm | 0 | 720 | 0.0% |
| rising_pressure_post_front_clear_calm | 0 | 720 | 0.0% |
| severe_wind | 0 | 720 | 0.0% |
| slow_falling_pressure_overcast_breezy | 0 | 720 | 0.0% |
| stable_pressure_mixed_light_light_wind | 0 | 720 | 0.0% |
| volatile_pressure_mixed_wind | 0 | 720 | 0.0% |

## Selected-Pick Changes By Context

| Context | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
| freshwater_lake_pond | 0 | 7680 | 0.0% |
| freshwater_river | 0 | 6720 | 0.0% |

## Selected-Pick Changes By Species

| Species | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
| largemouth_bass | 0 | 7680 | 0.0% |
| trout | 0 | 6720 | 0.0% |

## Selected-Pick Changes By Clarity

| Clarity | Pick Changes | Valid Rows | Percent |
| --- | ---: | ---: | ---: |
| clear | 0 | 7200 | 0.0% |
| stained | 0 | 7200 | 0.0% |

## Representative Safe Improvements

| Region | Month | Context | Archetype | Clarity | Score | Wind | Tags | Pick Causes |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| None | - | - | - | - | - | - | - | - |

## Representative Risky Rows

| Region | Month | Context | Archetype | Clarity | Score | Wind | Tags | Pick Causes |
| --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| None | - | - | - | - | - | - | - | - |

## Artifacts

- JSONL: `scripts/audit/todays-bite-wind-v2-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-wind-v2-audit.md`
