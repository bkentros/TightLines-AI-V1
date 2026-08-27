# Sheboygan River Gate 4B Activity Replay

**River ID:** `sheboygan` **Completed:** 2026-08-26
**Decision:** `hidden_weather_only_candidate`

## Model contract

All four runs use modeled hourly weather near I-43 and score only effective
light plus restrained same-block precipitation. Activity is always labeled
`Limited` and explicitly says river level, clarity, and measured water
temperature are unknown. USGS `04086000` flow and height remain available to
Fishability and Gauge Read, but they are excluded from Activity because no
same-reach measured river-temperature series completes an observed-river input
contract. Lake Michigan temperature and air temperature are not presented as
river temperature.

The score describes weather responsiveness for a fish already present. It does
not estimate Fish In River, movement, catch probability, access, or safety.
Missing target-day weather fails closed to Unavailable with no leading block.

## Fixed historical replay

Open-Meteo archive weather was replayed for every complete seasonal day from
2007 through 2025 at `43.7413889,-87.7521111`, using each run's own calendar.

| Run | Usable / expected days | Daily min / p10 / median / mean / p90 / max | Stage means: pre / beginning / building / peak / taper / ending / post |
| --- | ---: | --- | --- |
| Chinook | 1,862 / 1,862 | 31 / 50 / 69 / 69.09 / 86 / 90 | 69.73 / 69.73 / 75.75 / 78.50 / 70.39 / 56.96 / 45.73 |
| Coho | 1,919 / 1,919 | 27 / 47 / 69 / 68.04 / 85 / 90 | 68.61 / 68.93 / 75.99 / 77.61 / 70.02 / 55.26 / 40.78 |
| Steelhead | 2,926 / 2,926 | 49 / 50 / 63 / 62.32 / 72 / 78 | 59.37 / 59.42 / 60.18 / 61.51 / 62.24 / 64.16 / 64.94 |
| Lake-run Brown Trout | 2,546 / 2,546 | 50 / 52 / 65 / 62.48 / 69 / 69 | 60.31 / 60.56 / 61.62 / 65.24 / 63.26 / 63.67 / 62.74 |

All adjusted replays had zero incomplete blocks, ceiling violations, daily
range violations, incomplete copy, missing disclosure, inferred river-condition
claims, prohibited claims, lifecycle cliffs, lifecycle-shape failures,
repeat-spawner mortality language, and repeat-spawner stage-shape failures.

Chinook and Coho use continuous post-Peak lifecycle decline because both die
after spawning. Steelhead has no salmon mortality or late-stage penalty: the
fall-entry model can end while living fish remain or overwinter. Brown Trout
also has no terminal penalty or assumed departure.

## Calibration ledger

| Candidate | Replay finding | Decision |
| --- | --- | --- |
| Chinook weather-only, Staging/Beginning −5 | Both affected stage means fall exactly five points while Peak remains 78.50; maximum 90 | accept; baseline retained |
| Coho weather-only, Staging/Beginning −5 | Both affected stage means fall exactly five points while Peak remains 77.61; maximum 90 | accept; baseline retained |
| Steelhead weather-only with 0.80 evidence scale and Oct. 1 local peak calendar | Scores remain conservative, maximum 78; all invariants zero; no mortality or forced late decline | accept |
| Brown weather-only with 0.80 evidence scale, no adjustment | Peak mean 64.31 was below taper 64.55 and ending 64.96; repeat-spawner stage-shape invariant failed once | reject; retained as baseline artifact |
| Brown weather-only with bounded Peak +5 | Peak mean 65.24 exceeds both adjacent shoulders; maximum remains 69; no mortality or departure inference | accept |

Artifacts:

- `docs/audits/river-run-sheboygan-chinook-weather-activity-replay.json`
- `docs/audits/river-run-sheboygan-coho-weather-activity-replay.json`
- `docs/audits/river-run-sheboygan-steelhead-weather-activity-replay.json`
- `docs/audits/river-run-sheboygan-brown-trout-weather-activity-replay.json`
- `docs/audits/river-run-sheboygan-brown-trout-weather-activity-replay-baseline-without-stage-adjustment.json`
- `docs/audits/river-run-sheboygan-chinook-weather-activity-replay-baseline-without-stage-adjustment.json`
- `docs/audits/river-run-sheboygan-coho-weather-activity-replay-baseline-without-stage-adjustment.json`

## Remaining boundary

Gate 4B makes Activity available only in hidden review. It does not authorize
public enablement. A future accepted river-temperature source would require a
new source-pairing audit and replay rather than silently changing this model.
