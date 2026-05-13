# Today's Bite Rain / Runoff V2 Production Parity Audit

Generated: 2026-05-13T02:53:53.720Z

Phase 3C production parity check. Production rain/runoff V2 should match the experiment modules exactly. scoreDay, report copy, and recommender selection logic are untouched.

## Summary

| Metric | Value |
| --- | ---: |
| Total rows | 11232 |
| Production vs experiment precipitation mismatches | 0 |
| Production vs experiment runoff mismatches | 0 |
| Production vs experiment Today’s Bite score deltas != 0 | 0 |
| Chosen perfectClearMax | 0.55 |
| Chosen stableMax | 0.35 |
| Average score delta | 0.00 |
| Max score delta | 0 |
| Min score delta | 0 |
| Rows abs(score_delta) >= 8 | 0 |
| Rows abs(score_delta) >= 12 | 0 |
| Activity tier changes | 0 |
| Reliability changes | 0 |
| Corrected variable availability mismatch count | 0 |
| Recommender valid rows | 4680 |
| Recommender error rows | 936 |
| Recommender activity changes | 0 |
| Recommender water_movement_mode changes | 0 |
| Recommender surface gate changes | 0 |
| Recommender scenario tag changes | 0 |
| Recommender selected-pick changes | 0 |
| Recommender selected-pick change percent | 0.0% |

## Historical Adoption Context

These are the final pre-wiring shadow metrics retained for comparison, not the current production-vs-experiment deltas.

| Historical Metric | Value |
| --- | ---: |
| Selected-pick changes | 126 / 4680 = 2.7% |
| Average score delta | -0.76 |
| Max score delta | +5 |
| Min score delta | -11 |
| abs(score_delta) >= 8 | 147 |
| abs(score_delta) >= 12 | 0 |
| Activity tier changes | 804 |
| Water movement changes | 51 |
| Surface gate changes | 50 |
| Scenario tag changes | 73 |
| Variable availability mismatch | 0 |
| Readiness fixtures | 15 passed, 0 questionable, 0 failed, 0 selected-pick fixture changes |

## Runoff Positive-Cap Sweep

Production-vs-experiment parity uses the adopted default experiment constants first; other rows are retained as calibration context only.

| perfectClearMax | stableMax | Avg Delta | Max Delta | Min Delta | abs>=8 | abs>=12 | Activity Tier Changes | Availability Mismatches | Pick Changes | Pick Change % | Water Movement Changes | Light Active Auto-Disruption | Wet Baseline Weak | Missing River Windows | Spring Risk Weak |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0.55 | 0.35 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.25 | 0.25 | -0.08 | 0 | -4 | 0 | 0 | 118 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.25 | 0.35 | -0.06 | 0 | -4 | 0 | 0 | 72 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.35 | 0.25 | -0.06 | 0 | -3 | 0 | 0 | 63 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.35 | 0.35 | -0.04 | 0 | -3 | 0 | 0 | 17 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.45 | 0.25 | -0.04 | 0 | -2 | 0 | 0 | 50 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.45 | 0.35 | -0.02 | 0 | -2 | 0 | 0 | 4 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.55 | 0.25 | -0.02 | 0 | -2 | 0 | 0 | 46 | 0 | 0 | 0.0% | 0 | 0 | 0 | 648 | 6 |
| 0.25 | 0.15 | -0.11 | 0 | -4 | 0 | 0 | 124 | 0 | 3 | 0.1% | 0 | 0 | 0 | 648 | 6 |
| 0.35 | 0.15 | -0.09 | 0 | -3 | 0 | 0 | 69 | 0 | 3 | 0.1% | 0 | 0 | 0 | 648 | 6 |
| 0.45 | 0.15 | -0.07 | 0 | -3 | 0 | 0 | 56 | 0 | 3 | 0.1% | 0 | 0 | 0 | 648 | 6 |
| 0.55 | 0.15 | -0.05 | 0 | -3 | 0 | 0 | 52 | 0 | 3 | 0.1% | 0 | 0 | 0 | 648 | 6 |

## Questionable Behavior Before Vs V2

| Flag | Baseline | V2 | Reduction |
| --- | ---: | ---: | ---: |
| recommender_water_movement_coupling | 1176 | 1176 | 0.0% |
| river_runoff_omitted_incomplete_precip_windows | 648 | 648 | 0.0% |
| spring_snowmelt_or_warm_rain_risk_not_reflected | 6 | 6 | 0.0% |

## V2 Formula / Threshold Notes

- Active rain is severity-based: active_precip_now alone no longer creates active_disruption.
- Light active rain is light_mist/recent_rain near neutral unless rate/totals rise.
- p7d wet baseline is considered for lake/pond, coastal, and flats; flats use slightly lower wet thresholds.
- River V2 keeps missing p24/p72/p7d as null, preserving omitted hydrology.
- River perfect_clear/stable positives use the chosen shadow calibration: +0.55 max and +0.35 max.
- Spring/early-summer snowmelt regions use lower runoff thresholds; Southwest desert/high desert/SoCal remain flash-sensitive.

## Baseline Precipitation Labels

| Label | Rows |
| --- | ---: |
| omitted | 4104 |
| recent_rain | 3672 |
| light_mist | 1512 |
| active_disruption | 1296 |
| extended_dry | 648 |

## V2 Precipitation Labels

| Label | Rows |
| --- | ---: |
| omitted | 4104 |
| recent_rain | 3672 |
| light_mist | 1512 |
| active_disruption | 1296 |
| extended_dry | 648 |

## Baseline River Hydrology Labels

| Label | Rows |
| --- | ---: |
| omitted | 9072 |
| blown_out | 819 |
| elevated | 414 |
| stable | 354 |
| perfect_clear | 306 |
| slightly_elevated | 267 |

## V2 River Hydrology Labels

| Label | Rows |
| --- | ---: |
| omitted | 9072 |
| blown_out | 819 |
| elevated | 414 |
| stable | 354 |
| perfect_clear | 306 |
| slightly_elevated | 267 |

## Selected-Pick Change Causes

| Cause among selected-pick changes | Count |
| --- | ---: |
| activity_changed | 0 |
| water_movement_changed | 0 |
| surface_gate_changed | 0 |
| tags_changed | 0 |

## Scenario Tag Change Causes

| Tag | Changed Rows |
| --- | ---: |
| None | 0 |

## Selected-Pick Change Samples

| Region | Month | Context | Archetype | Water Movement | Tags | Baseline Picks | V2 Picks |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| None | - | - | - | - | - | - | - |

## V2 Remaining Light Active Rain Auto-Disruption

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
| None | - | - | - | - | - | - | - | - |

## V2 Remaining Missing River Hydrology Windows

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
| northeast | 1 | freshwater_river | missing_24h | -:- | -:- | -:- | -:- | 0 |
| northeast | 1 | freshwater_river | missing_72h | -:- | -:- | -:- | -:- | 0 |
| northeast | 1 | freshwater_river | missing_7d | -:- | -:- | -:- | -:- | 0 |
| northeast | 2 | freshwater_river | missing_24h | -:- | -:- | -:- | -:- | 0 |
| northeast | 2 | freshwater_river | missing_72h | -:- | -:- | -:- | -:- | 0 |
| northeast | 2 | freshwater_river | missing_7d | -:- | -:- | -:- | -:- | 0 |
| northeast | 3 | freshwater_river | missing_24h | -:- | -:- | -:- | -:- | 0 |
| northeast | 3 | freshwater_river | missing_72h | -:- | -:- | -:- | -:- | 0 |
| northeast | 3 | freshwater_river | missing_7d | -:- | -:- | -:- | -:- | 0 |
| northeast | 4 | freshwater_river | missing_24h | -:- | -:- | -:- | -:- | 0 |

## V2 Remaining Dry / Perfect Clear Daymaker Risk

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
| None | - | - | - | - | - | - | - | - |

## V2 Remaining Wet Baseline Not Penalized Enough

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
| None | - | - | - | - | - | - | - | - |

## V2 Remaining Spring Snowmelt / Warm-Rain Risk

| Region | Month | Context | Archetype | Baseline Precip | V2 Precip | Baseline Runoff | V2 Runoff | Delta |
| --- | ---: | --- | --- | --- | --- | --- | --- | ---: |
| mountain_west | 4 | freshwater_river | recent_rain_clearing | -:- | -:- | slightly_elevated:-0.4625 | slightly_elevated:-0.4625 | 0 |
| mountain_west | 5 | freshwater_river | recent_rain_clearing | -:- | -:- | slightly_elevated:-0.4625 | slightly_elevated:-0.4625 | 0 |
| mountain_west | 6 | freshwater_river | recent_rain_clearing | -:- | -:- | slightly_elevated:-0.4625 | slightly_elevated:-0.4625 | 0 |
| inland_northwest | 4 | freshwater_river | recent_rain_clearing | -:- | -:- | slightly_elevated:-0.4625 | slightly_elevated:-0.4625 | 0 |
| inland_northwest | 5 | freshwater_river | recent_rain_clearing | -:- | -:- | slightly_elevated:-0.4625 | slightly_elevated:-0.4625 | 0 |
| inland_northwest | 6 | freshwater_river | recent_rain_clearing | -:- | -:- | slightly_elevated:-0.4625 | slightly_elevated:-0.4625 | 0 |

## Artifacts

- JSONL: `scripts/audit/todays-bite-rain-runoff-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-rain-runoff-audit.md`
