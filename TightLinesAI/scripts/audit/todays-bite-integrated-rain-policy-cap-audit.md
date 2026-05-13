# Today's Bite Integrated Rain/Wet Policy Production Parity Audit

Generated: 2026-05-13T19:59:20.571Z

Phase 9F production parity audit for the rain/wet final-score policy. Production scoreDay now contains the locked `combined_policy_light` behavior; production normalizers, report copy, app/forecast/cache behavior, and recommender production logic were not changed.

## Locked Finalist Parity

- Locked finalist: `combined_policy_light`
- Production-vs-locked-finalist score deltas: 0
- Recommender selected-pick changes vs locked finalist: 0
- Thermal changes vs locked finalist: 0
- Surface gate changes vs locked finalist: 0
- Scenario tag changes vs locked finalist: 0
- Fixed issue regressions: 0
- Parity result: **passed**

## Candidate Sweep

| Candidate | Avg delta | Min | Max | abs>=8 | abs>=12 | Target abs>=12 | Non-target abs>=12 | Activity tier changes | Reliability changes | Total flags | Valid rec rows | Pick changes | Thermal changes | Surface changes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1736 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_policy_light | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1736 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| major_suppressor_ceiling_69 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1736 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_policy_contextual | -0.02 | -3 | 0 | 0 | 0 | 0 | 0 | 164 | 0 | 1736 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_policy_contextual_plus_damp | -0.04 | -3 | 0 | 0 | 0 | 0 | 0 | 242 | 0 | 1546 | 17280 | 18 (0.1%) | 0 (0.0%) | 6 (0.0%) |
| active_rain_cap_55 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1736 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| wet_baseline_cap_65 | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1736 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |

## Flag Reductions And Regressions

| Candidate | Heavy rain too high | Wet baseline too high | High score + major suppressor | Copy conflict | Low-score driver regression |
| --- | ---: | ---: | ---: | ---: | ---: |
| production_control | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 812 (0) |
| combined_policy_light | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 812 (0) |
| major_suppressor_ceiling_69 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 812 (0) |
| combined_policy_contextual | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 812 (0) |
| combined_policy_contextual_plus_damp | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 622 (-190) |
| active_rain_cap_55 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 812 (0) |
| wet_baseline_cap_65 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 812 (0) |

## Target Vs Non-Target Large Deltas

Target rows are production active-disruption rows or rows with wet-baseline evidence. Target-row abs>=12 deltas are accepted when they only lower the score, create no fixed-issue regression, and either remove a rain/wet/high-suppressor flag or cap an over-threshold active-rain/wet-baseline score to the policy threshold.

| Candidate | Target abs>=8 | Target abs>=12 | Accepted target abs>=12 | Unaccepted target abs>=12 | Non-target abs>=8 | Non-target abs>=12 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | 0 | 0 | 0 | 0 | 0 | 0 |
| combined_policy_light | 0 | 0 | 0 | 0 | 0 | 0 |
| major_suppressor_ceiling_69 | 0 | 0 | 0 | 0 | 0 | 0 |
| combined_policy_contextual | 0 | 0 | 0 | 0 | 0 | 0 |
| combined_policy_contextual_plus_damp | 0 | 0 | 0 | 0 | 0 | 0 |
| active_rain_cap_55 | 0 | 0 | 0 | 0 | 0 | 0 |
| wet_baseline_cap_65 | 0 | 0 | 0 | 0 | 0 | 0 |

## Recommender Impact

| Candidate | Valid rows | Pick changes | Thermal changes | Surface changes | Scenario tag changes |
| --- | ---: | ---: | ---: | ---: | ---: |
| production_control | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_policy_light | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| major_suppressor_ceiling_69 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_policy_contextual | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| combined_policy_contextual_plus_damp | 17280 | 18 (0.1%) | 0 (0.0%) | 6 (0.0%) | 20 (0.1%) |
| active_rain_cap_55 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| wet_baseline_cap_65 | 17280 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |

## Unaccepted Target Large Deltas

| Candidate | Region | Month | Context | Archetype | Clarity | Prod | Candidate score | Delta | Prod flags | Candidate flags |
| --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| none | | | | | | | | | |

## Fixed-Issue Regression Check

- production_control: 0
- combined_policy_light: 0
- major_suppressor_ceiling_69: 0
- combined_policy_contextual: 0
- combined_policy_contextual_plus_damp: 0
- active_rain_cap_55: 0
- wet_baseline_cap_65: 0

## Top Rows Improved By combined_policy_light

| Region | Month | Context | Archetype | Clarity | Prod | Candidate | Delta | Prod flags | Candidate flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| none | | | | | | | | | |

## Top Regressions For combined_policy_light

| Region | Month | Context | Archetype | Clarity | Prod | Candidate | Delta | Prod flags | Candidate flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| none | | | | | | | | | |

## Production Finalist

**combined_policy_light**

Recommendation: **production parity confirmed for locked finalist: combined_policy_light**.

Finalist rationale: `combined_policy_light` changes only final score policy, avoids contribution damping, preserves normalized fields/contributions/drivers/suppressors, and preserves recommender output.

Notes:
- Score ceiling candidates change only the final score. `combined_policy_contextual_plus_damp` adjusts contribution math in memory but preserves normalized labels/modes.
- This audit intentionally leaves report-copy strings untouched. Remaining `report_copy_conflicts_with_score` rows should be reviewed in a copy-only pass because candidate score changes can reduce but not fully validate prose alignment.
- Recommender comparisons use current production daily-picks logic with candidate How's Fishing analysis injected in memory.

## Artifacts

- JSONL: `scripts/audit/todays-bite-integrated-rain-policy-cap-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-integrated-rain-policy-cap-audit.md`
