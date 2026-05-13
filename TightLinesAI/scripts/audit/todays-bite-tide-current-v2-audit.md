# Today's Bite Tide/Current V2 Production Parity Audit

Generated: 2026-05-13T18:05:30.122Z

Phase 8D production parity audit. Production tide/current scoring is wired to the score_only_combined behavior; timing production logic, buildNormalized, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Candidate Formulas

- `production_control`: production scoring and production timing.
- `score_only_soft_current_floor`: preserves labels/source priority; raises true soft moving current to neutral/helpful. Inshore 0.65 kt targets +0.207 while barely-moving 0.55 kt stays slightly negative; flats 0.5-1.0 kt starts at +0.20.
- `score_only_too_hard_penalty`: preserves labels/source priority; makes excessive current meaningfully negative. Inshore >2.6 kt ramps from +0.10 to -1.45 by 4.0 kt; flats reaches -0.35 at 2.0 kt and ramps to -1.60 by 3.2 kt.
- `score_only_combined`: combines soft-current floor and too-hard penalty.
- `timing_diagnostic_only`: scoring unchanged; projects tide priority only for likely timing misses with strong tide-clock data and no heat/light family priority.

## Totals

- Matrix rows per candidate: 15552
- Total JSONL rows: 77760
- Regions: 18
- Months: 12
- Contexts: coastal, coastal_flats_estuary
- Water clarity variants: clear, stained
- Tide/current archetypes: 18
- Recommender: not_applicable for all coastal/flats rows; no recommender production logic was invoked or changed.

## Production Parity

- Production-vs-experiment tide mismatches: 0
- Production-vs-experiment score delta rows: 0
- Production-vs-experiment label changes: 0
- Production-vs-experiment reliability changes: 0
- Timing production behavior changed: 0 (timing is not modified by this audit)

Historical pre-wiring score_only_combined impact retained for context:
- Avg score delta: about -0.53
- Min/max score delta: about -7 / +7
- abs(score_delta) >= 8: 0
- abs(score_delta) >= 12: 0
- soft_current_not_helpful_enough improved from 1296 to 432
- too_hard_current_not_penalized improved from 1296 to 0

## Candidate Sweep

| Candidate | Avg score delta | Min | Max | abs>=8 | abs>=12 | Activity tier changes | Reliability changes | Driver changes | Suppressor changes | Candidate flags | Timing projected changes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| production_control | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1134 | 540 |
| score_only_soft_current_floor | 0.94 | 0 | 7 | 0 | 0 | 774 | 0 | 198 | 1296 | 2430 | 540 |
| score_only_too_hard_penalty | -0.40 | -7 | 0 | 0 | 0 | 426 | 0 | 606 | 864 | 1998 | 540 |
| score_only_combined | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1134 | 540 |
| timing_diagnostic_only | 0.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 594 | 540 |

## Flag Comparison: score_only_combined

| Flag | Production | Candidate | Delta |
| --- | ---: | ---: | ---: |
| soft_current_not_helpful_enough | 432 | 432 | 0 |
| too_hard_current_not_penalized | 0 | 0 | 0 |
| strong_current_too_positive_for_flats | 0 | 0 | 0 |
| strong_current_too_negative_for_inshore | 0 | 0 | 0 |
| optimal_current_not_helpful_enough | 0 | 0 | 0 |
| high_low_exchange_not_reflected | 0 | 0 | 0 |
| weak_exchange_overrewarded | 0 | 0 | 0 |
| conflicting_stage_current_not_handled | 0 | 0 | 0 |
| tide_driver_with_near_zero_score | 0 | 0 | 0 |
| tide_suppressor_with_near_zero_score | 0 | 0 | 0 |
| tide_timing_window_missing_when_tide_data_present | 702 | 702 | 0 |
| tide_timing_window_present_when_tide_missing | 0 | 0 | 0 |
| missing_tide_reliability_too_high | 0 | 0 | 0 |
| stage_unknown_scored_positive | 0 | 0 | 0 |

## Timing Diagnostic Classification

- unusable_clock_data: 12096
- no_timing_miss: 2754
- true_likely_miss: 540
- acceptable_family_priority: 162

Timing diagnostic note: `true_likely_miss` means strong tide score plus same-day tide times, no qualified production tide window, and no heat/light anchor priority. `acceptable_family_priority` is counted separately and is not a production-change recommendation.

## Flats/Estuary Vs Inshore Snapshot: score_only_combined

Florida, June, clear water.

| Context | Archetype | Production tide score | Candidate tide score | Score delta |
| --- | --- | ---: | ---: | ---: |
| coastal | measured_slack | -0.928 | -0.928 | 0 |
| coastal | measured_soft_moving | 0.2071 | 0.2071 | 0 |
| coastal | measured_optimal_moving | 1.0313 | 1.0313 | 0 |
| coastal | measured_strong_moving | 1.6 | 1.6 | 0 |
| coastal | measured_too_hard | -0.5643 | -0.5643 | 0 |
| coastal | large_high_low_exchange | 1.1364 | 1.1364 | 0 |
| coastal | flats_soft_current | -0.0643 | -0.0643 | 0 |
| coastal | flats_too_much_current | 0.75 | 0.75 | 0 |
| coastal_flats_estuary | measured_slack | -0.178 | -0.178 | 0 |
| coastal_flats_estuary | measured_soft_moving | 0.395 | 0.395 | 0 |
| coastal_flats_estuary | measured_optimal_moving | 1.0833 | 1.0833 | 0 |
| coastal_flats_estuary | measured_strong_moving | -0.35 | -0.35 | 0 |
| coastal_flats_estuary | measured_too_hard | -1.6 | -1.6 | 0 |
| coastal_flats_estuary | large_high_low_exchange | 0.872 | 0.872 | 0 |
| coastal_flats_estuary | flats_soft_current | 0.265 | 0.265 | 0 |
| coastal_flats_estuary | flats_too_much_current | -0.7667 | -0.7667 | 0 |

## Activity Tier Changes By Context/Archetype: score_only_combined

- none

## Representative score_only_combined Samples

| Region | Month | Context | Archetype | Clarity | Production Tide | Candidate Tide | Score Delta | Production Score | Candidate Score | Timing Class | Candidate Flags |
| --- | ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| northeast | 1 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 58 | 58 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 1 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 58 | 58 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 1 | coastal_flats_estuary | large_high_low_exchange | clear | 0.872 | 0.872 | 0 | 65 | 65 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | large_high_low_exchange | stained | 0.872 | 0.872 | 0 | 65 | 65 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | many_same_day_exchanges | clear | 0.886 | 0.886 | 0 | 66 | 66 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | many_same_day_exchanges | stained | 0.886 | 0.886 | 0 | 66 | 66 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | tide_times_without_current | clear | 0.95 | 0.95 | 0 | 66 | 66 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | tide_times_without_current | stained | 0.95 | 0.95 | 0 | 66 | 66 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 56 | 56 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 2 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 56 | 56 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 2 | coastal_flats_estuary | large_high_low_exchange | clear | 0.872 | 0.872 | 0 | 63 | 63 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | large_high_low_exchange | stained | 0.872 | 0.872 | 0 | 63 | 63 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | many_same_day_exchanges | clear | 0.886 | 0.886 | 0 | 63 | 63 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | many_same_day_exchanges | stained | 0.886 | 0.886 | 0 | 63 | 63 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | tide_times_without_current | clear | 0.95 | 0.95 | 0 | 64 | 64 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | tide_times_without_current | stained | 0.95 | 0.95 | 0 | 64 | 64 | true_likely_miss | tide_timing_window_missing_when_tide_data_present |
| northeast | 3 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 62 | 62 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 3 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 62 | 62 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 4 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 57 | 57 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 4 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 57 | 57 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 5 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 51 | 51 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 5 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 51 | 51 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 6 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 55 | 55 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 6 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 55 | 55 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 6 | coastal_flats_estuary | large_high_low_exchange | clear | 0.872 | 0.872 | 0 | 62 | 62 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 6 | coastal_flats_estuary | large_high_low_exchange | stained | 0.872 | 0.872 | 0 | 62 | 62 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 6 | coastal_flats_estuary | many_same_day_exchanges | clear | 0.886 | 0.886 | 0 | 62 | 62 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 6 | coastal_flats_estuary | many_same_day_exchanges | stained | 0.886 | 0.886 | 0 | 62 | 62 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 6 | coastal_flats_estuary | tide_times_without_current | clear | 0.95 | 0.95 | 0 | 63 | 63 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 6 | coastal_flats_estuary | tide_times_without_current | stained | 0.95 | 0.95 | 0 | 63 | 63 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 7 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 53 | 53 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 7 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 53 | 53 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 7 | coastal_flats_estuary | large_high_low_exchange | clear | 0.872 | 0.872 | 0 | 60 | 60 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 7 | coastal_flats_estuary | large_high_low_exchange | stained | 0.872 | 0.872 | 0 | 60 | 60 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 7 | coastal_flats_estuary | many_same_day_exchanges | clear | 0.886 | 0.886 | 0 | 60 | 60 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 7 | coastal_flats_estuary | many_same_day_exchanges | stained | 0.886 | 0.886 | 0 | 60 | 60 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 7 | coastal_flats_estuary | tide_times_without_current | clear | 0.95 | 0.95 | 0 | 60 | 60 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 7 | coastal_flats_estuary | tide_times_without_current | stained | 0.95 | 0.95 | 0 | 60 | 60 | acceptable_family_priority | tide_timing_window_missing_when_tide_data_present |
| northeast | 8 | coastal | flats_soft_current | clear | -0.0643 | -0.0643 | 0 | 55 | 55 | unusable_clock_data | soft_current_not_helpful_enough |
| northeast | 8 | coastal | flats_soft_current | stained | -0.0643 | -0.0643 | 0 | 55 | 55 | unusable_clock_data | soft_current_not_helpful_enough |

## Production Candidate

**score_only_combined**

The combined score-only profile is now production-wired and matches the experiment reference while preserving labels, null/missing behavior, source priority, reliability, and inshore/flats policy differences. Timing remains diagnostic-only.

Residual `soft_current_not_helpful_enough` rows are concentrated in the intentionally cross-policy `flats_soft_current` archetype under broad inshore `coastal` context. That fixture uses 0.55 kt, which is barely above slack for inshore; keeping it slightly negative is treated as a likely false positive rather than a failed score target.

## Recommendation

**production parity confirmed; keep timing diagnostic separate**

Production timing changes should not be recommended unless true likely timing misses dominate over acceptable heat/light/seasonal priority. This audit keeps timing separate from score tuning.

## Artifacts

- JSONL: `scripts/audit/todays-bite-tide-current-v2-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-tide-current-v2-audit.md`
