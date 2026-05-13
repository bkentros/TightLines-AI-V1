# Today's Bite Shadow Audit

Generated: 2026-05-12T20:49:40.193Z

Read-only baseline for Phase 2 scoring renovation. This script does not mutate production logic or recommender selection code.

## Scope

| Metric | Value |
| --- | ---: |
| Regions | 18 |
| Months | 12 |
| Contexts | 4 |
| Archetypes | 9 |
| Total rows | 7776 |
| Recommender rows attempted | 3888 |
| Recommender rows with errors | 648 |

## Context Score Summary

Average / min / max score.

| Context | Rows | Avg / Min / Max |
| --- | ---: | --- |
| freshwater_lake_pond | 1944 | 54.8 / 33 / 86 |
| freshwater_river | 1944 | 57.8 / 32 / 85 |
| coastal | 1944 | 63.3 / 37 / 80 |
| coastal_flats_estuary | 1944 | 60.6 / 35 / 80 |

## Archetype Score Summary

Average / min / max score.

| Archetype | Rows | Avg / Min / Max |
| --- | ---: | --- |
| stable_good | 864 | 64.3 / 41 / 80 |
| cold_front_shock | 864 | 48.2 / 35 / 68 |
| warming_trend | 864 | 62.6 / 40 / 80 |
| heat_limited | 864 | 55.0 / 33 / 67 |
| active_rain | 864 | 61.8 / 32 / 77 |
| recent_rain_runoff | 864 | 60.6 / 32 / 76 |
| bright_calm | 864 | 52.8 / 37 / 74 |
| overcast_breezy | 864 | 71.2 / 49 / 86 |
| windy | 864 | 55.5 / 33 / 75 |

## Artifacts

- JSONL: `scripts/audit/todays-bite-shadow-audit.jsonl`
- Markdown: `scripts/audit/todays-bite-shadow-audit.md`
