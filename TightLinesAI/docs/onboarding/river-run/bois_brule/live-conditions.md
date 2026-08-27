# Bois Brule River Live Conditions Audit

**River ID:** `bois_brule` **Researched:** 2026-08-26\
**Status:** `owner_approved_source_feasible_upstream_context`

## 1. Capability decision

| Metric                     | Accepted source | Live                    | Historical                                                                     | Public unit | Decision                                     |
| -------------------------- | --------------- | ----------------------- | ------------------------------------------------------------------------------ | ----------- | -------------------------------------------- |
| Discharge                  | USGS 04025500   | yes, 15-min provisional | long daily record; DOY normals available                                       | CFS, whole  | feasible as upstream input                   |
| Gauge height               | USGS 04025500   | yes, 15-min provisional | current stage; no datum-consistent public average                              | ft, 0.01    | feasible; `No average`                       |
| Measured water temperature | none            | no                      | approved exact-date 2021-2023 archive from discontinued lower station 04026005 | °F          | current unavailable; historical context only |

## 2. Verification record

- Station: USGS `04025500`, Bois Brule River at Brule, `46.5377778,-91.5952778`,
  1.4 mi southwest of Brule, 1.4 mi below Nebagamon Creek, 1.7 mi above Little
  Bois Brule River; drainage area 118 mi².
- Two-day probe returned 190 numeric readings for discharge and height at a
  normal 15-minute cadence, units `ft^3/s` and `ft`, provisional status.
- Latest sample: `2026-08-25T23:00:00Z`, 105 CFS and 1.40 ft.
- Exact `00010` temperature probe returned zero observations.
- A broader source audit found lower-river USGS `04026005`, which historically
  measured temperature in the desired reach, but the valid archive stops in 2023
  and USGS marks the station discontinued. The regional 14-day USGS `00010`
  search returned no observations. Monitor My Watershed's full public catalog
  had no Bois Brule station, and no stable current Wisconsin DNR
  SWIMS/fishway-report telemetry endpoint was established. None qualifies as a
  live fallback.
- Discharge statistics endpoint returned a DOY feature/data series for the
  required Aug. 22–28 window.
- Daily discharge: Oct. 1942–Sep. 1981 and Jan. 1984 onward; the 1981–1984 gap
  must be disclosed in details. Continuous catalog begins 1986.
- USGS warns winter stage/discharge may be affected by ice.
- Attribution: U.S. Geological Survey; provisional values subject to revision.

## 3. Reach limitation

The station is upstream of Highway 2 and therefore upstream of the proposed fall
product corridor. It measures the spring-fed mainstem input entering the lower
river, not the mouth, rapids, fishway, or a specific refuge. Public copy must
say `upstream flow context`; it must not imply fish passage, local access,
safety, or uniform conditions across the 18-mile lower river.

Owner accepted this upstream input on 2026-08-26 only with the reach limitation
above. If that qualifier cannot be preserved, disable Live Conditions instead of
presenting the station as lower-river truth.

## 4. History, freshness, and recovery

- Discharge date comparison uses approved same-date values across prior years,
  ±3 days, current year excluded; record gap disclosed.
- Gauge height always shows `No average` under the current contract.
- Temperature is unavailable for current and trend. Historical-only context uses
  approved 15-minute observations from 2021-2023. A daily mean requires at least
  72 valid observations; an exact calendar date requires at least two qualifying
  years. The generated baseline contains 101 qualifying dates from July 1
  through Oct. 9 and never imputes uncovered dates.
- Flow and height latest/prior observations resolve independently.
- Ice, `Eqp`/`EQUIP`, null, nonnumeric, wrong-unit, stale, and
  older-than-24-hour values fail closed. Last-readable timestamp remains while
  invalid numeric data is suppressed. Later valid data restores without a code
  change.
- Provider `observedAt` and FinFindr `refreshedAt` remain distinct.

## 5. Public copy proposal

- Limitation:
  `Measured upstream near Brule. This is incoming mainstem flow
  context, not a reading at the lower river, fishway, or Lake Superior mouth.`
- Discharge/gauge label: `Bois Brule River at Brule`
- Temperature: `No current sensor`; where qualified, display
  `Historical average for this date across X years` without a current value,
  trend arrow, or current-versus-average comparison.
- Provider: `U.S. Geological Survey` / `USGS`
- Keep station IDs, parameter codes, engine versions, and cache details inside
  source provenance, not collapsed public headlines.

Permanent missing-temperature behavior is governed by
[`../wisconsin-2026-no-temperature-contract.md`](../wisconsin-2026-no-temperature-contract.md).
Because the flow gauge is above the product corridor, lower-river Activity uses
a separately replayed weather-only candidate at Limited confidence. It excludes
both the upstream gauge and historical-only temperature archive; Migration
Timing, Push, and lower-corridor Fishability remain unavailable.

## 6. Weather

Open-Meteo `46.5378,-91.5953` returned HTTP 200, timezone `America/Chicago`, 24
hourly numeric timestamps, °C temperature and mm precipitation/rain. Accept as
modeled Brule/Hwy 2 context only. It cannot prove lower-river rainfall, flow
response, water temperature, clarity, or fish movement.

## 7. Acceptance status

- [ ] Provider malfunction fails closed.
- [ ] Recovered valid numeric reading automatically restores accurate display.

- [x] Live values, timestamps, cadence, units, provisional/ice caveats verified.
- [x] Historical discharge and date-normal endpoint verified; material gap
      recorded.
- [x] Missing temperature and upstream reach limitation are explicit after a
      broader USGS, Monitor My Watershed, and Wisconsin DNR source audit.
- [x] Owner accepts the explicitly labeled upstream-input Gauge Read.
- [ ] Fault/recovery, freshness, trend, history, and rendered acceptance
      matrices executed after configuration.

**Live Conditions decision:** `owner_accepted_partial_upstream_context`\
**Audit version:** `bois-brule-live-source-v3-gate4a-2026-08-26`
