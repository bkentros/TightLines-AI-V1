# Today's Bite Tide/Current Current-State Audit

Generated: 2026-05-13T17:24:55.025Z

Phase 8A audit-only. Production tide/current normalization, scoreDay, report copy, app/forecast behavior, other condition normalizers, and recommender production logic were not changed.

## Totals

- Rows: 15552
- Regions: 18
- Months: 12
- Contexts: 2 (coastal, coastal_flats_estuary)
- Water clarity variants: 2 (clear, stained)
- Tide/current archetypes: 18
- Tide driver rows: 8284
- Tide suppressor rows: 2880
- Timing rows with qualified tide exchange timing: 2520
- Recommender rows: not_applicable (15552); Phase 8A covers coastal/flats only and does not invoke the freshwater daily-picks harness.
- Total questionable flags: 3294

## Tide Label Distribution

- moving: 6912
- strong_moving: 4320
- slack: 1728
- missing: 1728
- too_strong: 864

## Reliability Distribution

- medium: 13824
- low: 1728

## Timing Anchor Distribution

- neutral_fallback: 12004
- tide_exchange_window: 2520
- light_window: 972
- avoid_heat: 56

## Questionable Flags

| Flag | Count |
| --- | ---: |
| missing_tide_reliability_too_high | 0 |
| stage_unknown_scored_positive | 0 |
| slack_stage_overpenalized_in_flats | 0 |
| slack_stage_not_penalized_in_inshore | 0 |
| soft_current_not_helpful_enough | 1296 |
| optimal_current_not_helpful_enough | 0 |
| strong_current_too_positive_for_flats | 0 |
| strong_current_too_negative_for_inshore | 0 |
| too_hard_current_not_penalized | 1296 |
| high_low_exchange_not_reflected | 0 |
| weak_exchange_overrewarded | 0 |
| conflicting_stage_current_not_handled | 0 |
| tide_driver_with_near_zero_score | 0 |
| tide_suppressor_with_near_zero_score | 0 |
| tide_timing_window_missing_when_tide_data_present | 702 |
| tide_timing_window_present_when_tide_missing | 0 |

## Score Distribution By Archetype

| Archetype | Avg score | Min | Max |
| --- | ---: | ---: | ---: |
| measured_slack | 50.5 | 41 | 65 |
| measured_soft_moving | 55.6 | 46 | 69 |
| measured_optimal_moving | 67.4 | 57 | 78 |
| measured_strong_moving | 66.6 | 49 | 85 |
| measured_too_hard | 50.3 | 37 | 66 |
| stage_incoming_only | 62.7 | 52 | 75 |
| stage_outgoing_only | 62.7 | 52 | 75 |
| stage_slack_only | 50.8 | 41 | 65 |
| stage_unknown | 59.6 | 47 | 76 |
| large_high_low_exchange | 69.0 | 57 | 81 |
| weak_high_low_exchange | 60.7 | 50 | 72 |
| many_same_day_exchanges | 68.2 | 57 | 80 |
| missing_tide | 59.6 | 47 | 76 |
| conflicting_stage_and_current | 67.9 | 58 | 79 |
| flats_soft_current | 53.6 | 44 | 68 |
| flats_too_much_current | 61.0 | 45 | 79 |
| inshore_stronger_current_ok | 63.8 | 47 | 82 |
| tide_times_without_current | 67.2 | 56 | 79 |

## Flats/Estuary Vs Inshore Snapshot

Single-region/month snapshot (Florida, June, clear water) to show the active policy differences:

| Context | Archetype | Tide label | Tide score |
| --- | --- | --- | ---: |
| coastal | measured_slack | slack | -0.928 |
| coastal | measured_soft_moving | moving | -0.3571 |
| coastal | measured_optimal_moving | moving | 1.0313 |
| coastal | measured_strong_moving | strong_moving | 1.6 |
| coastal | measured_too_hard | too_strong | -0.0143 |
| coastal | stage_incoming_only | moving | 0.7 |
| coastal | stage_slack_only | slack | -0.85 |
| coastal | large_high_low_exchange | strong_moving | 1.2955 |
| coastal_flats_estuary | measured_slack | slack | -0.178 |
| coastal_flats_estuary | measured_soft_moving | moving | 0.29 |
| coastal_flats_estuary | measured_optimal_moving | moving | 1.0833 |
| coastal_flats_estuary | measured_strong_moving | strong_moving | 0.2 |
| coastal_flats_estuary | measured_too_hard | too_strong | -1.4 |
| coastal_flats_estuary | stage_incoming_only | moving | 0.5 |
| coastal_flats_estuary | stage_slack_only | slack | -0.2 |
| coastal_flats_estuary | large_high_low_exchange | strong_moving | 1.09 |

## Recommender Applicability / Coupling

Daily-picks coupling is explicitly recorded as `not_applicable` for every row. The current Phase 8A matrix only covers `coastal` and `coastal_flats_estuary`, while the existing audit harnesses used for daily-picks protection are freshwater lake/pond and river rows. No recommender candidate pools, scenario tags, gates, scoring, catalog data, or pick selection were invoked or changed.

## Representative Questionable Samples

| Region | Month | Context | Archetype | Clarity | Tide Label | Tide Score | Score | Reliability | Timing Anchor | Flags |
| --- | ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| northeast | 1 | coastal | measured_soft_moving | clear | moving | -0.3571 | 54 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 1 | coastal | measured_soft_moving | stained | moving | -0.3571 | 54 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 1 | coastal | measured_too_hard | clear | too_strong | -0.0143 | 58 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 1 | coastal | measured_too_hard | stained | too_strong | -0.0143 | 58 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 1 | coastal | flats_soft_current | clear | moving | -0.5857 | 52 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 1 | coastal | flats_soft_current | stained | moving | -0.5857 | 52 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 1 | coastal_flats_estuary | measured_strong_moving | clear | strong_moving | 0.2 | 59 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 1 | coastal_flats_estuary | measured_strong_moving | stained | strong_moving | 0.2 | 59 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 1 | coastal_flats_estuary | large_high_low_exchange | clear | strong_moving | 1.09 | 67 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | large_high_low_exchange | stained | strong_moving | 1.09 | 67 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | many_same_day_exchanges | clear | strong_moving | 1.02 | 67 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | many_same_day_exchanges | stained | strong_moving | 1.02 | 67 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | flats_soft_current | clear | moving | 0.13 | 58 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 1 | coastal_flats_estuary | flats_soft_current | stained | moving | 0.13 | 58 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 1 | coastal_flats_estuary | inshore_stronger_current_ok | clear | strong_moving | -0.0667 | 57 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 1 | coastal_flats_estuary | inshore_stronger_current_ok | stained | strong_moving | -0.0667 | 57 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 1 | coastal_flats_estuary | tide_times_without_current | clear | moving | 0.95 | 66 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 1 | coastal_flats_estuary | tide_times_without_current | stained | moving | 0.95 | 66 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal | measured_soft_moving | clear | moving | -0.3571 | 52 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 2 | coastal | measured_soft_moving | stained | moving | -0.3571 | 52 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 2 | coastal | measured_too_hard | clear | too_strong | -0.0143 | 56 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 2 | coastal | measured_too_hard | stained | too_strong | -0.0143 | 56 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 2 | coastal | flats_soft_current | clear | moving | -0.5857 | 50 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 2 | coastal | flats_soft_current | stained | moving | -0.5857 | 50 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 2 | coastal_flats_estuary | measured_strong_moving | clear | strong_moving | 0.2 | 57 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 2 | coastal_flats_estuary | measured_strong_moving | stained | strong_moving | 0.2 | 57 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 2 | coastal_flats_estuary | large_high_low_exchange | clear | strong_moving | 1.09 | 65 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | large_high_low_exchange | stained | strong_moving | 1.09 | 65 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | many_same_day_exchanges | clear | strong_moving | 1.02 | 65 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | many_same_day_exchanges | stained | strong_moving | 1.02 | 65 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | flats_soft_current | clear | moving | 0.13 | 56 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 2 | coastal_flats_estuary | flats_soft_current | stained | moving | 0.13 | 56 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 2 | coastal_flats_estuary | inshore_stronger_current_ok | clear | strong_moving | -0.0667 | 54 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 2 | coastal_flats_estuary | inshore_stronger_current_ok | stained | strong_moving | -0.0667 | 54 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 2 | coastal_flats_estuary | tide_times_without_current | clear | moving | 0.95 | 64 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 2 | coastal_flats_estuary | tide_times_without_current | stained | moving | 0.95 | 64 | medium | neutral_fallback | tide_timing_window_missing_when_tide_data_present |
| northeast | 3 | coastal | measured_soft_moving | clear | moving | -0.3571 | 58 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 3 | coastal | measured_soft_moving | stained | moving | -0.3571 | 58 | medium | neutral_fallback | soft_current_not_helpful_enough |
| northeast | 3 | coastal | measured_too_hard | clear | too_strong | -0.0143 | 62 | medium | neutral_fallback | too_hard_current_not_penalized |
| northeast | 3 | coastal | measured_too_hard | stained | too_strong | -0.0143 | 62 | medium | neutral_fallback | too_hard_current_not_penalized |

## Behavior Summary

- Measured current speed is the dominant source when present; stage conflicts are ignored in favor of measured current.
- Inshore is much less tolerant of slack water than flats/estuary, while flats softens slack and peaks earlier as current strengthens.
- High/low event data is reflected through either a 3-hour movement proxy or adjacent exchange range when measured current is absent.
- Stage-only incoming/outgoing data creates modest positive movement; unknown stage returns missing/null.
- Missing tide data downgrades coastal reliability through the shared normalization path.
- Tide timing uses `tide_exchange_window` only when that timing driver qualifies; missing/weak tide data falls back to neutral, light, or heat timing rather than claiming a tide window.

## Recommendation

**proceed to Tide/Current V2 shadow tuning**

Primary reasons to consider V2 shadow tuning are any high-current penalty/tolerance flags, high/low exchange reflection flags, and timing-window mismatch flags surfaced above. This artifact does not make production changes.

## Artifacts

- JSONL: `scripts/audit/todays-bite-tide-current-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-tide-current-audit.md`
