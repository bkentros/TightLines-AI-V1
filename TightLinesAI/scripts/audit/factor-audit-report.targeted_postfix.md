# TightLines AI — Factor Contribution Audit
Generated: 2026-03-31T12:34:49.123Z

## Scope

| Metric | Value |
|--------|-------|
| Archive scenarios loaded | 18 |
| Factor consistency flags | 0 |
| Context-variable groups audited | 16 |
| Source JSONL | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/archive-audit-results.targeted_postfix.jsonl, /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/archive-audit-results.targeted_postfix_cold.jsonl |

## Factor Consistency Flags

No factor-consistency flags.

## Variable Contribution Summary

| Context | Variable | Avg weighted | Avg abs weighted | Pos | Neg | Top lift | Top drag |
|---------|----------|--------------|------------------|-----|-----|----------|----------|
| coastal_flats_estuary | light_cloud_condition | 6.9 | 6.9 | 1 | 0 | lower_laguna_madre-2024-12-14 (13.9) | None |
| coastal_flats_estuary | precipitation_disruption | 0.6 | 0.6 | 2 | 0 | lower_laguna_madre-2024-03-16 (1.0) | None |
| coastal_flats_estuary | pressure_regime | 2.8 | 2.8 | 2 | 0 | lower_laguna_madre-2024-03-16 (2.9) | None |
| coastal_flats_estuary | temperature_condition | 26.3 | 26.3 | 2 | 0 | lower_laguna_madre-2024-12-14 (26.9) | None |
| coastal_flats_estuary | tide_current_movement | 27.9 | 27.9 | 2 | 0 | lower_laguna_madre-2024-12-14 (29.1) | None |
| coastal_flats_estuary | wind_condition | 0.7 | 6.4 | 1 | 1 | lower_laguna_madre-2024-12-14 (7.1) | lower_laguna_madre-2024-03-16 (-5.7) |
| freshwater_lake_pond | light_cloud_condition | 3.8 | 18.0 | 6 | 6 | lake_okeechobee-2024-06-15 (22.8) | table_rock_lake-2024-05-18 (-17.8) |
| freshwater_lake_pond | precipitation_disruption | -3.7 | 5.4 | 5 | 7 | lake_champlain-2024-11-16 (2.8) | lake_guntersville-2024-05-18 (-17.6) |
| freshwater_lake_pond | pressure_regime | 4.9 | 4.9 | 12 | 0 | lake_guntersville-2024-05-18 (5.0) | None |
| freshwater_lake_pond | temperature_condition | -23.2 | 23.2 | 0 | 12 | None | kentucky_lake-2024-04-13 (-28.4) |
| freshwater_lake_pond | wind_condition | 12.1 | 12.1 | 12 | 0 | lake_champlain-2024-11-16 (16.7) | None |
| freshwater_river | light_cloud_condition | 8.3 | 14.9 | 3 | 1 | white_river-2024-07-13 (16.4) | white_river-2024-05-18 (-13.1) |
| freshwater_river | pressure_regime | 3.6 | 3.6 | 4 | 0 | white_river-2024-09-14 (3.8) | None |
| freshwater_river | runoff_flow_disruption | -1.3 | 14.4 | 2 | 2 | white_river-2024-05-18 (21.4) | white_river-2024-07-13 (-27.5) |
| freshwater_river | temperature_condition | -21.8 | 21.8 | 0 | 4 | None | white_river-2024-09-14 (-23.1) |
| freshwater_river | wind_condition | 0.9 | 0.9 | 3 | 0 | white_river-2024-09-14 (1.4) | None |
