# Root River Live Conditions Audit

**River ID:** `root` **Researched:** 2026-08-26
**Status:** `gate_4b_configured_split_gauge_weather_only_activity`

## 1. Capability decision

| Metric | Accepted source | Live | Historical | Public unit | Decision |
| --- | --- | --- | --- | --- | --- |
| Discharge | USGS 04087240 | yes, 15-min provisional | daily from 1963; DOY normals available | CFS, whole | feasible as upper-river context |
| Gauge height | USGS 04087240 | yes, 15-min provisional | current series; no public date average | ft, 0.01 | feasible; `No average` |
| Measured water temperature | USGS 04087234 `00010` | yes, hourly provisional | continuous project record from 2017; public date average blocked pending exact gaps/QC audit | °F, 0.1 | feasible as separately labeled far-upstream context |

## 2. Verification record

- Station: USGS `04087240`, Root River at Racine,
  `42.751389,-87.823611`, 350 ft below Horlick Dam and 5.2 mi above mouth.
- Exact two-day probes returned 190 numeric discharge and height readings,
  normal 15-minute cadence, `ft^3/s` and `ft`, provisional status.
- Latest sample: `2026-08-25T23:00:00Z`, 36.0 CFS and 2.48 ft.
- The co-located `04087240` `00010` probe returned no observations. A regional
  temperature-source audit then found USGS `04087234`, Root River at 60th St
  near Caledonia (`42.855556,-87.990722`). Its Aug. 1–25 probe returned 600
  numeric `degC` observations at an hourly cadence; latest was 23.2 °C at
  `2026-08-25T23:00:00Z`. Accept it for current/trend after °F conversion.
- USGS `040872342` at W. Eight Mile Rd was also live (2,211 observations in the
  same period; nominal 15-min cadence with gaps; latest 23.1 °C at the same
  timestamp). It remains an audited alternate because its `00010` history is
  shorter and the runtime does not consume its distinct `00011` final series.
- Discharge DOY statistics returned a feature/data series for Aug. 22–28.
- Daily catalog begins Aug. 1963; USGS notes drainage area 190 mi².
- Attribution: U.S. Geological Survey; provisional values subject to revision.

## 3. Reach limitation

The hydraulic gauge and temperature station are upstream of the proposed initial River Run endpoint at the Root
River Steelhead Facility. It describes hydraulic input near Horlick Dam, not a
measurement at Lincoln Park, downtown, or the harbor; temperature is measured
even farther upstream at 60th Street. The intervening facility
can alter fish passage but does not invalidate same-river flow context. The app
must label each station and its upper-river context and must never infer fish
passage from either. It must not imply that all three metrics are co-located.

Owner accepted these upstream readings on 2026-08-26 only with the separate
station labels and reach limitation above. Any future attempt to remove those
qualifiers must instead disable the affected metric.

Gate 4B does not consume either station in Activity. The accepted Activity
models use only modeled Horlick weather and state that product-corridor level,
clarity, and measured water temperature are unknown. This preserves the useful
split-station Gauge Read without pretending it is a same-reach scoring pair.

## 4. History, freshness, and recovery contract

- Discharge date comparison: same local calendar date across prior years, ±3
  days, current year excluded, provider-approved observations only.
- Gauge height: `No average` until datum-consistent implementation exists.
- Temperature: current/trend may use 04087234; date average remains unavailable
  until exact daily aggregation, gaps, and usable-year rules pass audit. Weather
  is never a fallback.
- Current and 24-hour prior readings resolve independently per metric.
- Null, nonnumeric, wrong-unit, `Eqp`/`EQUIP`, stale, and older-than-24-hour data
  fail closed; last-readable provider timestamp remains visible while numeric
  value is suppressed; later valid data restores automatically.
- Keep provider `observedAt` separate from FinFindr `refreshedAt`.

## 5. Public copy proposal

- Limitation: `Flow and height are measured near Horlick Dam; water temperature
  is measured farther upstream at 60th Street. These are upper-river readings,
  not harbor conditions or proof of fish passage.`
- Discharge/gauge label: `Root River at Racine`
- Temperature label: `Root River at 60th Street near Caledonia`
- Provider: `U.S. Geological Survey` / `USGS`
- Use shared `Partial data`, `Delayed`, `Unreadable`, and `No average` states.

## 6. Weather

Open-Meteo `42.7514,-87.8236` returned HTTP 200, timezone `America/Chicago`, 24
hourly numeric timestamps, °C temperature and mm precipitation/rain. Accept as
modeled upper-Racine weather context only. It does not prove lower-river rain,
flow response, clarity, or fish movement.

## 7. Acceptance status

- [ ] Provider malfunction fails closed.
- [ ] Recovered valid numeric reading automatically restores accurate display.

- [x] Live numeric values/timestamps/units/cadence/status verified.
- [x] Long discharge history and date-normal endpoint verified.
- [x] Regional source audit corrected the initial co-located-only temperature conclusion.
- [x] Upstream reach limitation explicit.
- [x] Owner accepts explicitly labeled upstream-context Gauge Read.
- [x] Gauge Read retains separate upper-river hydraulic/temperature labels;
      Fishability fails closed because neither source represents the product corridor.
- [x] Gate 4B excludes both stations from Activity and passes the fixed
      2007-2025 four-species weather-only replay.
- [ ] Fault, recovery, freshness, trend, history, and rendered matrices run
  after configuration.

**Live Conditions decision:** `feasible_with_split_upstream_stations`
**Audit version:** `root-live-source-v4-gate4b-2026-08-26`
