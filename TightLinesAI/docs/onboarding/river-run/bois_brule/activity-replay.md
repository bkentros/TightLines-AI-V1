# Bois Brule Four-species Activity Replay

**Gate:** `4B` **Replay interval:** `2007-2025` **Mode:** `weather_only`
**Status:** `ready_for_owner_review`

## Accepted input boundary

Activity uses only Open-Meteo hourly effective light and restrained same-block
precipitation at `bois_brule_hwy2_weather`. USGS 04025500 flow/height is
upstream of the Highway 2 product endpoint. The discontinued lower-river USGS
04026005 temperature archive is historical-only. Neither river source enters
Activity, receives a neutral fallback, or changes a score.

Every read is Limited confidence and says product-corridor river level, clarity,
and measured water temperature are unknown. Missing hourly weather returns
Unavailable with no score, blocks, or leader. Weather cannot infer a rise,
cooling, passage, fresh entry, abundance, Fishability, or catch probability.

## Fixed replay result

| Species              | Expected / usable days | Daily min / p10 / mean / median / p90 / max | Stage means: Beginning / Building / Peak / Tapering / Ending | Result                            |
| -------------------- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| Chinook              | 2,242 / 2,242          | 40 / 59 / 72.48 / 72 / 87 / 90              | 70.07 / 74.89 / 76.50 / 69.90 / 62.27                        | pass                              |
| Coho                 | 1,957 / 1,957          | 27 / 44 / 67.32 / 69 / 85 / 90              | 68.86 / 75.43 / 77.61 / 71.06 / 54.22                        | pass                              |
| Fall Steelhead       | 2,603 / 2,603          | 49 / 51 / 62.60 / 64 / 72 / 79              | 60.17 / 60.50 / 62.77 / 64.12 / 65.20                        | pass; Sept. 28 peak calendar, no forced lifecycle decline |
| Lake-run Brown Trout | 2,451 / 2,451          | 49 / 51 / 60.97 / 62 / 69 / 69              | 58.19 / 58.78 / 63.30 / 60.60 / 61.70                        | pass after bounded correction     |

The JSON artifacts contain every four-hour stage/block distribution, label
share, cap note, precipitation group, best-block count, spread distribution,
controlled lifecycle sequence, and invariant count.

## Calibration ledger

| Candidate   | Baseline finding                                                                                | Change                                                                          | Accepted effect                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Chinook     | Generic decline compressed 85→42 into Sept. 30-Oct. 20 and early weather scores were high        | Activity interpolation ends Oct. 31; Staging/Beginning −5                        | exact five-point early reduction; smooth 85→42 sequence; all invariants zero                                     |
| Coho        | Raw shape was coherent but Staging/Beginning weather scores were high                             | Staging/Beginning −5                                                            | exact five-point early reduction; Peak 77.61 and smooth terminal decline remain intact                           |
| Steelhead   | Later seasonal weather raises later means                                                       | none                                                                            | accepted as weather variation for living fish; no salmon ramp, mortality, or departure rule; all invariants zero |
| Brown Trout | Raw Peak 59.99 trailed Ending 62.91 and Post-run 64.40 because later seasonal light was favored | Peak-only +6 before the existing 0.80 evidence scale; stage-response maximum 80 | Peak 63.30 exceeds every stage; displayed max remains 69; no mortality/departure rule; all invariants zero       |

The rejected Brown baseline is retained as
`river-run-bois-brule-brown-trout-weather-activity-replay-baseline-without-stage-adjustment.json`.
The correction is the minimum whole-point adjustment that passed the complete
stage-shape invariant; +5 left Peak 62.71 below Post-run 62.99.
The accepted Chinook and Coho no-adjustment baselines are also retained beside
their final artifacts for direct owner-calibration comparison.

## Invariants

All accepted artifacts report zero for incomplete blocks, scores over the true
ceiling, daily rollups outside block ranges, incomplete copy, missing
weather-only disclosure, inferred river conditions, prohibited claims, lifecycle
cliffs, wrong salmon decline, repeat-spawner mortality language, and Brown
stage-shape failure. Coverage is 100% for every fixed interval.

**Decision:** `four_species_weather_only_activity_ready_for_owner_review`
