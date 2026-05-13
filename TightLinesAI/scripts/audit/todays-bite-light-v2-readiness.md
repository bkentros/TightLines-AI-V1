# Today's Bite Light/Cloud V2 Production Readiness

Generated: 2026-05-13T17:00:48.366Z

Phase 6C production readiness/parity. Production `normalizeLight(...)` is expected to match `score_only_heavy_overcast_cap`. Recommender production logic was not changed.

Profile tested: `score_only_heavy_overcast_cap`

## Production Parity

- Readiness fixture score delta rows: 0
- Light label changes: 0
- Reliability changes: 0
- Selected-pick changes: 0
- Light mode changes: 0
- Surface gate changes: 0
- Scenario tag changes: 0

## Historical Pre-Wiring Impact

Retained from Phase 6A/6B before production wiring:

- avg delta: **-0.23**
- max/min delta: **0 / -4**
- abs(score_delta) >= 8: **0**
- abs(score_delta) >= 12: **0**
- selected-pick changes: **0 / 14,400**
- total questionable flags: **8,177 -> 3,613**

## Fixture Results

- Fixtures: 18
- Passed: 18
- Questionable: 0
- Failed: 0
- Light label changes: 0
- Reliability changes: 0
- Selected-pick changes: 0
- Light mode changes: 0
- Surface gate changes: 0
- Scenario tag changes: 0
- Recommendation: **production parity ready**

| Fixture | Status | Score Delta | Activity | Reliability | Baseline Light | V2 Light | Light Driver Changed | Light Suppressor Changed | Picks Changed | Light Mode Changed | Surface Gate Changed | Tags Changed | Reason |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lake_summer_heavy_overcast_calm | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | heavy_overcast:0.78 | heavy_overcast:0.78 | false | false | false | false | false | false | heavy overcast calm remains modestly helpful |
| lake_summer_heavy_overcast_strong_wind | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | heavy_overcast:0.4667 | heavy_overcast:0.4667 | false | false | false | false | false | false | heavy overcast strong wind capped |
| river_spring_heavy_overcast_strong_wind | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | high -> high | heavy_overcast:0.4667 | heavy_overcast:0.4667 | false | false | false | false | false | false | heavy overcast strong wind capped |
| river_fall_heavy_overcast_strong_wind | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | heavy_overcast:0.4667 | heavy_overcast:0.4667 | false | false | false | false | false | false | heavy overcast strong wind capped |
| lake_clear_cold | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | bright:0 | bright:0 | false | false | false | false | false | false | public labels and recommender outputs stable |
| lake_clear_hot | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | glare:-0.91 | glare:-0.91 | false | false | false | false | false | false | public labels and recommender outputs stable |
| mixed_cloud_breeze | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | mixed:0.075 | mixed:0.075 | false | false | false | false | false | false | public labels and recommender outputs stable |
| low_light_calm_active | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | high -> high | low_light:0.775 | low_light:0.775 | false | false | false | false | false | false | public labels and recommender outputs stable |
| low_light_windy | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | low_light:0.775 | low_light:0.775 | false | false | false | false | false | false | public labels and recommender outputs stable |
| missing_wind_heavy_overcast | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | medium -> medium | heavy_overcast:0.78 | heavy_overcast:0.78 | false | false | false | false | false | false | missing wind preserves heavy-overcast help |
| missing_cloud | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | medium -> medium | null:null | null:null | false | false | false | false | false | false | public labels and recommender outputs stable |
| coastal_heavy_overcast_calm | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | medium -> medium | heavy_overcast:0.64 | heavy_overcast:0.64 | false | false | false | false | false | false | heavy overcast calm remains modestly helpful |
| coastal_heavy_overcast_strong_wind | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | medium -> medium | heavy_overcast:0.4 | heavy_overcast:0.4 | false | false | false | false | false | false | heavy overcast strong wind capped |
| flats_clear_glare | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | medium -> medium | glare:-0.3 | glare:-0.3 | false | false | false | false | false | false | public labels and recommender outputs stable |
| flats_heavy_overcast_strong_wind | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | medium -> medium | heavy_overcast:0.4 | heavy_overcast:0.4 | false | false | false | false | false | false | heavy overcast strong wind capped |
| florida_warm_water_overcast | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | high -> high | heavy_overcast:0.724 | heavy_overcast:0.724 | false | false | false | false | false | false | warm overcast remains bounded |
| northern_cold_water_overcast | pass | 0 | moderate-high — conditions favor engaged fish responding to proper presentation -> moderate-high — conditions favor engaged fish responding to proper presentation | high -> high | heavy_overcast:0.724 | heavy_overcast:0.724 | false | false | false | false | false | false | cold overcast is not inflated |
| desert_hot_clear | pass | 0 | moderate — conditions support selective feeding; clean presentation matters -> moderate — conditions support selective feeding; clean presentation matters | high -> high | glare:-0.91 | glare:-0.91 | false | false | false | false | false | false | public labels and recommender outputs stable |

## Production Plumbing Proof

Current production call path after Phase 6C:

- `buildSharedNormalizedOutput(req)` reads `const e = req.environment`.
- It computes temperature first, then calls:
  `normalizeLight(e.cloud_cover_pct, req.context, { temperatureBandLabel: temp?.band_label ?? undefined, windMph: e.wind_speed_mph })`
- Production `normalizeLight(...)` keeps the same function name and accepts optional `windMph?: number | null`.
- Missing wind is not treated as strong wind.
- Labels, details, and null behavior remain unchanged.

## Artifacts

- JSONL: `scripts/audit/todays-bite-light-v2-readiness.jsonl`
- Markdown: `scripts/audit/todays-bite-light-v2-readiness.md`
