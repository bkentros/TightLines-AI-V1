# Grand River observed Activity audit — 2026-08-25

## Decision

Grand Chinook, Coho, and fall Steelhead use an observed-river Activity model
only for the downtown Grand Rapids mainstem. The model combines:

- Fulton Street USGS 04119000 discharge and 24-hour change;
- North Park Street USGS 04118564 measured water temperature; and
- the Grand Rapids Open-Meteo hourly light/cloud/precipitation point.

It does not represent Grand Haven, the entire `grand_lower` section, reaches
upstream of North Park, migration, abundance, catch probability, access, or
safety. Fishability remains Fulton-specific. Push and Migration Timing remain
Unavailable.

## Station-pair validation

Fulton and North Park are about 4.21 straight-line miles apart and bracket the
archived Sixth Street temperature station, USGS 04118997. Direct USGS
simultaneous-pair checks found:

| Comparison | Interval/sample | Signed difference | Absolute error |
| ---------- | --------------- | ----------------: | -------------- |
| North Park vs Sixth Street, 15-minute | fall 2024, 8,736 paired observations | Sixth +0.32 °F mean | mean 0.46 °F; median 0.36; p90 1.08; p99 1.80; max 2.34 |
| North Park vs Sixth Street, daily mean | fall 2022–2024, 254 paired dates | not used as an offset | mean 0.28 °F; median 0.18; p90 0.72; max 1.26 |
| North Park vs Eastmanville, daily mean | fall 2022–2024, 254 paired dates | Eastmanville +0.67 °F mean | mean 0.70 °F; median 0.72; p90 1.26; max 2.52 |

The small North Park/Sixth error supports North Park as a downtown proxy, not
as a whole-Lower-river temperature. No offset is applied. Active downtown dam
removal and channel work require this pairing and the Fulton rating/datum to be
re-audited after each construction season or material channel change.

Primary source pages:

- Fulton: <https://waterdata.usgs.gov/monitoring-location/04119000/>
- North Park: <https://waterdata.usgs.gov/monitoring-location/USGS-04118564/>
- archived Sixth Street: <https://waterdata.usgs.gov/monitoring-location/USGS-04118997/>
- construction: <https://engage.grandrapidsmi.gov/r45268>

## Input and failure contract

| Inputs available | Result |
| ---------------- | ------ |
| fresh Fulton + fresh North Park + target-day hourly weather | Full; four scored blocks |
| weather + Fulton, North Park missing | Moderate; missing-temperature proportional ceiling 64 |
| weather + North Park, Fulton missing | Moderate; missing-hydraulics proportional ceiling 64 |
| weather only / both river measurements missing | Unavailable; no score or blocks |
| hourly weather missing | Unavailable; no score or blocks |

The runtime never changes this observed ruleset into weather-only rules and
never inserts a neutral value for a failed gauge. A valid resumed source is
picked up on the next refresh.

## Species rules

| Species | Light / temperature / river / precipitation | Temperature °F: cold / preferred / warm / barrier | Salmon lifecycle |
| ------- | ------------------------------------------- | -------------------------------------------------- | ---------------- |
| Chinook | 0.35 / 0.35 / 0.25 / 0.05 | 45 / 48–60 / 64 / 70 | 15-point taper deduction ramp; ending ceiling 49 |
| Coho | 0.25 / 0.40 / 0.30 / 0.05 | 42 / 45–58 / 62 / 68 | 15-point taper deduction ramp; ending ceiling 42 |
| Steelhead | 0.20 / 0.40 / 0.35 / 0.05 | 40 / 42–55 / 60 / 68 | none; no salmon mortality semantics |

All three use Fulton daily-change thresholds of 150 CFS and 8% for Rising,
300 CFS and 15% for Meaningful rise, and 700 CFS and 30% for Sharp rise. In the
2020–2025 Chinook-window replay, positive daily changes had median 110 CFS /
5.71%, p90 500 CFS / 21.99%, and maxima 1,970 CFS / 68.17%. The resulting
signals were 487 Stable, 32 Rising, 33 Meaningful rise, 9 Sharp rise, and 23
Falling across 584 usable dates. This makes a rise selective rather than a
routine positive label.

## Historical replay

The fixed six-season interval is 2020–2025 because accepted North Park daily
temperature begins in July 2020. Each replay combines official USGS daily mean
flow/temperature with archived local hourly Open-Meteo inputs.

| Species | Complete dates | Daily min / p10 / median / mean / p90 / max | Key stage means |
| ------- | -------------- | -------------------------------------------- | --------------- |
| Chinook | 584 / 588 (99.3%) | 0 / 26 / 39 / 41.07 / 68 / 96 | Beginning 29.33; Building 37.39; Peak 54.03; Tapering 48.11; Ending 45.94; Post-run 38.43 |
| Coho | 641 / 678 (94.5%) | 0 / 22 / 34 / 35.67 / 56 / 96 | Beginning 29.21; Building 33.65; Peak 44.02; Tapering 40.00; Ending 36.90; Post-run 26.18 |
| Steelhead | 724 / 768 (94.3%) | 9 / 29 / 66 / 63.35 / 95 / 96 | Beginning 36.51; Building 73.58; Peak 82.90; Tapering 66.75; Ending 60.95; Post-run 57.00 |

Warm downtown water explains low early salmon responsiveness; Activity is not
the run-stage or abundance score. Later salmon thermal improvement can coincide
with lifecycle decline, and the lifecycle ramp still prevents optimistic late
tails. Steelhead appropriately improves after cooling and retains living-fish
semantics across the fall-entry tail. All replay invariants are zero: complete
four-block rows, copy completeness/scope, foreign geography, rollup bounds,
warm/barrier caps, lifecycle/cap behavior, late salmon optimism, and Steelhead
mortality/stage-penalty checks.

Artifacts:

- `docs/audits/river-run-grand-chinook-activity-replay.json`
- `docs/audits/river-run-grand-coho-activity-replay.json`
- `docs/audits/river-run-grand-steelhead-activity-replay.json`
- matching `activity-review-100.csv` files

## Downstream-source decision

No downstream observed Activity model is accepted.

- Grandville USGS 04119070 supplies current hydraulics but no measured water
  temperature: <https://waterdata.usgs.gov/monitoring-location/USGS-04119070/>.
- Eastmanville USGS 04119400 supplies downstream hydraulic context, but its
  temperature series is not a dependable current source; direct current probes
  return no usable live temperature and discontinuation sentinels:
  <https://waterdata.usgs.gov/nwis/uv?legacy=1&site_no=04119400>.
- Current discharge around the audit differed materially by reach (Fulton about
  1,470 CFS versus Grandville about 1,730 and Eastmanville about 1,770), so
  Fulton is not treated as the exact hydraulic value for Grand Haven or the full
  Lower river.

Recommendation 5 is therefore implemented as a documented gate: add a separate
downstream Activity reach only after a dependable live downstream temperature
source, compatible hydraulics, historical coverage, replay, failure matrix, and
owner review all pass. Do not average the three hydraulic gauges or extend the
downtown score downstream.

## Verification

- Activity scorer unit tests cover Full/Moderate/Unavailable minimum inputs.
- Endpoint tests prove Grand without Push still fetches and exposes North Park
  temperature, becomes Full only with all sources, and caps a single-source
  outage at Moderate.
- Private review mode contains Full, each single river-source outage, both
  river sources missing, weather missing, and tomorrow states for all three
  species.
- The generic observed replay now handles seasons crossing New Year; the prior
  zero-row Steelhead false pass is prohibited by expected-day coverage.

Public enablement remains separately blocked by unresolved passage routes,
rendered owner review, construction-era source re-audit, and release approval.
