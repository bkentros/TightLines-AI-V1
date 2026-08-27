# Milwaukee River Live Conditions Audit

**River ID:** `milwaukee` **Researched:** 2026-08-26\
**Status:** `hidden_gate_4b_activity_review_candidate`

## 1. Capability decision

| Metric                     | Candidate/accepted source        | Live                   | History/date average                                                              | Public unit       | Decision                                                              |
| -------------------------- | -------------------------------- | ---------------------- | --------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| Discharge                  | USGS 04087000 / accepted         | yes, 5-min provisional | daily record from 1914; DOY statistics endpoint returned data                     | CFS, whole number | enabled in hidden draft                                               |
| Gauge height               | USGS 04087000 / accepted         | yes, 5-min provisional | no datum-consistent public average under current contract                         | ft, 0.01          | enabled in hidden draft; always `No average`                          |
| Measured water temperature | USGS 04087000 `00010` / accepted | yes, 5-min provisional | daily audit found a discontinuous 15-year/noncontiguous record with material gaps | °F, 0.1           | current/trend enabled in hidden draft; historical average unavailable |

USGS 04087170 at the mouth is rejected as primary: the seven-day probe returned
stage but no discharge or temperature, and USGS documents estuary seiches and
flow reversals. Air temperature never substitutes for water temperature.

For Activity, current and historical eligibility are separate. The accepted
Estabrook flow/temperature pair supports observed scoring only in the Urban
Greenway reach. Its primary modern replay window contains two qualifying seasons
(2024–2025), below the five-season norm; sparse 1973–1979 data is a sensitivity
check, not a substitute. The mouth station has extensive older temperature
history but no accepted current discharge/temperature pair, so it cannot power
live observed Activity. Brown Trout now use Estabrook measurements because the
corrected physical corridor includes the Urban Greenway; that score remains
explicitly scoped to the gauge reach and is never presented as Harbor or North
Shore truth.

## 2. Probe and reach record

- Provider/station: U.S. Geological Survey, `04087000`, Milwaukee River at
  Milwaukee, Estabrook Park (`43.1000116,-87.9089745`), 6.6 mi above mouth.
- Parameters: `00060` discharge (`ft^3/s`), `00065` gage height (`ft`), `00010`
  water temperature (`degC`, converted by runtime to °F).
- Two-day API probe: 570 numeric observations per metric; normal cadence five
  minutes. Latest returned timestamp was `2026-08-25T23:00:00Z`; values were 201
  CFS, 0.67 ft, and 24.9 °C; approval `Provisional`; no qualifier.
- Flow and height history are long-term. The temperature audit found
  observations in only 15 noncontiguous years between 1973 and 2026, with
  material partial-year gaps; the historical date average is therefore
  suppressed.
- Seasonal-statistics probe for discharge returned one feature/data series for
  the required Aug. 22–28 day-of-year window.
- Attribution: `U.S. Geological Survey`; readings are provisional and subject to
  revision. Provider `observedAt` must remain distinct from FinFindr
  `refreshedAt`.
- Represented reach: Estabrook/Urban Greenway. It does not directly measure the
  harbor below the seiche limit or the North Shore above Kletzsch.

## 3. Resolved query defect

`LC-MKE-001`: `fetchUsgsInstantaneousValues` in repository v3 requests P7D with
`limit=1000`. A five-minute series produces about 2,016 rows; the API returned
the oldest 1,000, making Aug. 22 look latest during an Aug. 25 probe. The same
limit also affects `fetchUsgsWaterTemperature` when its default four-day window
exceeds 1,000 five-minute rows.

Gate 4 resolution:

1. Follow USGS OGC pagination for each metric independently.
2. Accept only same-origin `continuous/items` next links; fail closed on page
   errors, loops, foreign paths/origins, or the 16-page safety bound.
3. A 1,050-row ascending regression proves the newest second-page flow wins.
4. Existing normalization retains fail-closed handling for `Eqp`/`EQUIP`, null,
   nonnumeric, wrong-unit, stale, and older-than-24-hour values.

Production currently reports `river-live-conditions-v2`, whose two-day gauge
window is below this station's limit. This defect is therefore a future backend
release blocker, not a defect in submitted iOS/Android binaries.

## 4. Public copy lock proposal

- Gauge Read limitation:
  `Measured at Estabrook Park. Harbor levels can move
  with Lake Michigan, and this station does not represent the North Shore.`
- Discharge label: `Milwaukee River at Milwaukee`
- Temperature label: `Milwaukee River at Milwaukee`
- Gauge-height label: `Milwaukee River at Milwaukee`
- Partial/unavailable: use the shared `No gauge`, `Partial data`, `Delayed`, and
  `Unreadable` states; never show zero for a rejected provider value.
- Provider label/attribution: `U.S. Geological Survey` / `USGS`
- Keep internal site IDs, parameter codes, cache keys, and engine versions out
  of collapsed public copy; retain them in source details/provenance.

## 5. Weather

Open-Meteo point `43.1000,-87.9090` returned HTTP 200 with timezone
`America/Chicago`, 24 hourly timestamps, °C temperature, and mm precipitation
and rain. Accept as modeled context for the urban corridor only. It does not
prove river response, clarity, or conditions at Grafton.

## 6. Acceptance status

- [x] Provider normalization faults fail closed in focused tests.
- [x] Recovered valid numeric readings restore accurate normalized output.

- [x] Exact live parameters, numeric samples, timestamps, units, cadence, and
      provisional semantics verified.
- [x] Historical discharge/date-normal endpoint verified.
- [x] Reach and estuary limitations documented.
- [x] Partial-data capability is honest.
- [x] LC-MKE-001 fixed and tested with paginated high-cadence data.
- [x] Temperature daily-history audit found a discontinuous record; date average
      remains suppressed.
- [x] Generated available/degraded Gauge Read states and Activity source outages
      pass the private scenario/structural matrix.
- [ ] Authenticated Current Live, recovery rendering, narrow-layout, and device
      acceptance remain owner/release checks.

**Live Conditions decision:** `hidden_gate_4b_private_review_ready`\
**Audit version:** `milwaukee-live-source-v2-2026-08-26`
