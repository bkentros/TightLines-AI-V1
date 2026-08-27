# Root River Gate 4B Activity Replay

**River ID:** `root` **Completed:** 2026-08-26
**Decision:** `hidden_weather_only_candidate`

## Model contract

All four runs use modeled hourly weather near Horlick and score only effective
light plus restrained same-block precipitation. Activity is always labeled
`Limited` and explicitly says river level, clarity, and measured water
temperature are unknown in the product corridor.

USGS `04087240` flow/height and USGS `04087234` temperature remain available
to their accepted non-Activity surfaces, but neither is an Activity input. Both
stations are upstream of the mouth-to-facility product corridor, they are not
co-located, and the 60th Street temperature station is above Horlick Dam.
Combining them would fabricate a same-reach observed-river model. Gauge Read
continues to show each station separately with its upper-river limitation.

The score describes weather responsiveness for a fish already present. It does
not estimate Fish In River, movement, facility passage, catch probability,
access, or safety. Missing target-day weather fails closed to Unavailable with
no leading block.

## Fixed historical replay

Open-Meteo archive weather was replayed for every complete seasonal day from
2007 through 2025 at `42.751389,-87.823611`, using each run's own calendar.

| Run | Usable / expected days | Daily min / p10 / median / mean / p90 / max | Stage means: pre / beginning / building / peak / taper / ending / post |
| --- | ---: | --- | --- |
| Chinook | 1,862 / 1,862 | 31 / 48 / 68 / 68.08 / 86 / 90 | 69.21 / 69.54 / 75.09 / 76.46 / 70.35 / 55.43 / 44.86 |
| Coho | 1,862 / 1,862 | 27 / 46 / 67 / 66.97 / 85 / 90 | 68.26 / 67.90 / 74.90 / 76.75 / 68.67 / 55.15 / 39.88 |
| Steelhead | 2,926 / 2,926 | 49 / 50 / 63 / 62.01 / 72 / 78 | 59.02 / 58.74 / 60.02 / 62.25 / 62.59 / 64.99 / 64.20 |
| Lake-run Brown Trout | 2,546 / 2,546 | 50 / 51 / 65 / 62.27 / 69 / 69 | 59.67 / 60.13 / 61.41 / 65.10 / 61.80 / 63.43 / 63.18 |

All accepted replays had zero incomplete blocks, ceiling violations, daily
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
| Chinook weather-only, Staging/Beginning −5 | Both affected stage means fall exactly five points while Peak remains 76.46; maximum 90 | accept; baseline retained |
| Coho weather-only, Staging/Beginning −5 | Both affected stage means fall exactly five points while Peak remains 76.75; maximum 90 | accept; baseline retained |
| Steelhead weather-only with 0.80 evidence scale and Oct. 10 local peak calendar | Scores remain conservative, maximum 78; all invariants zero; no mortality or forced late decline | accept |
| Brown weather-only with 0.80 evidence scale, no adjustment | Peak mean 64.23 was below taper 65.12; repeat-spawner stage-shape invariant failed once | reject; retained as baseline artifact |
| Brown weather-only with bounded Peak +5 | Peak mean 65.10 exceeds both adjacent shoulders; maximum remains 69; no mortality or departure inference | accept |

Artifacts:

- `docs/audits/river-run-root-chinook-weather-activity-replay.json`
- `docs/audits/river-run-root-coho-weather-activity-replay.json`
- `docs/audits/river-run-root-steelhead-weather-activity-replay.json`
- `docs/audits/river-run-root-brown-trout-weather-activity-replay.json`
- `docs/audits/river-run-root-brown-trout-weather-activity-replay-baseline-without-stage-adjustment.json`
- `docs/audits/river-run-root-chinook-weather-activity-replay-baseline-without-stage-adjustment.json`
- `docs/audits/river-run-root-coho-weather-activity-replay-baseline-without-stage-adjustment.json`

## Remaining boundary

Gate 4B makes Activity available only in hidden review. It does not authorize
public enablement. A future product-corridor temperature or hydraulic source
would require a new source-pairing audit and replay rather than silently
changing this model.
