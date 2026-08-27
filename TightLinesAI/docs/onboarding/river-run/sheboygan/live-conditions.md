# Sheboygan River Live Conditions Audit

**River ID:** `sheboygan` **Researched:** 2026-08-26\
**Status:** `gate_4b_configured_partial_with_discontinuation_risk`

## 1. Capability decision

| Metric                     | Accepted source | Live                    | Historical                                                                   | Public unit | Decision                                       |
| -------------------------- | --------------- | ----------------------- | ---------------------------------------------------------------------------- | ----------- | ---------------------------------------------- |
| Discharge                  | USGS 04086000   | yes, 15-min provisional | long daily record with 1916–1924 / 1950–present split; DOY normals available | CFS, whole  | feasible now                                   |
| Gauge height               | USGS 04086000   | yes, 15-min provisional | continuous stage from 2017; no public date average                           | ft, 0.01    | feasible now; `No average`                     |
| Measured water temperature | none            | no                      | no accepted history                                                          | °F          | unavailable; do not substitute air temperature |

## 2. Verification record

- Station: USGS `04086000`, Sheboygan River at Sheboygan,
  `43.7413889,-87.7521111`, 0.2 mi below I-43 and 3.9 mi above the mouth.
- Exact two-day API probe returned 190 numeric values for each of `00060` and
  `00065`, a normal 15-minute cadence, provisional status, `ft^3/s` and `ft`.
- Latest probe observation: `2026-08-25T23:00:00Z`, 64.1 CFS and 1.92 ft.
- Exact `00010` probe returned zero features at 04086000. A broader 14-day
  regional USGS search also returned no current Sheboygan-basin `00010` series.
- Monitor My Watershed's full public station catalog contained no Sheboygan
  River station. Wisconsin DNR SWIMS exposes monitoring/logger data but no
  stable fresh Sheboygan feed was established. The GLOS Sheboygan Spotter buoy
  measures Lake Michigan, not the river. Those sources are therefore not safe
  substitutes for Gauge Read.
- Gate 4B keeps I-43 flow and height in Fishability/Gauge Read but excludes
  them from Activity: without same-reach measured river temperature, combining
  hydraulics with weather would look more complete than the accepted evidence
  contract. Activity therefore scores modeled weather only and remains Limited.
- Statistics API returned a discharge DOY feature/data series for Aug. 22–28.
- USGS daily catalog spans June 1916–September 1924 and October 1950 onward.
- Reach: direct at I-43/Urban River; contextual downstream of Kohler and
  upstream of the harbor. It is not a whole-river or harbor measurement.
- Attribution: `U.S. Geological Survey`; values provisional and subject to
  revision.

## 3. Source continuity risk

USGS currently warns that 04086000 may be discontinued on `2026-10-01` unless
funding is found. Required handling:

- Recheck the official station page immediately before runtime configuration and
  public release.
- If discontinued, preserve the last-readable timestamp but suppress stale
  numeric values after the shared freshness thresholds.
- Do not relabel permanent outage as `No gauge`; configured-source failure is
  `Unreadable`/unavailable under the shared contract.
- A later valid observation must automatically restore display without a build.
- Owner accepted this fragility on 2026-08-26 with fail-closed handling and the
  mandatory pre-configuration/pre-release rechecks below.

The pre-configuration recheck on 2026-08-26 confirmed fresh numeric flow and
height observations were still publishing at 15-minute cadence. The official
Oct. 1, 2026 possible-discontinuation notice remains, so release-time recheck is
still mandatory.

## 4. Date average and trend

- Discharge: same calendar date across prior years, ±3 days, exclude current
  year; provider-approved statistics must meet shared minimum years/days.
- Gauge height: always `No average` until datum-consistent support is
  implemented.
- Temperature: current, trend, and date average unavailable.
- 24-hour trends choose the closest accepted same-metric observation near 24h;
  missing comparison produces unknown, never stable.

## 5. Public copy proposal

- Limitation:
  `Measured near I-43, 3.9 miles above the mouth. This station does
  not directly represent the harbor or water above Waelderhaus Dam.`
- Discharge/gauge label: `Sheboygan River at Sheboygan`
- Temperature: `No measured water-temperature source`
- Provider: `U.S. Geological Survey` / `USGS`
- Use shared partial/delayed/unreadable copy and keep site/parameter/cache IDs
  out of collapsed public text.

Permanent missing-temperature behavior is governed by
[`../wisconsin-2026-no-temperature-contract.md`](../wisconsin-2026-no-temperature-contract.md):
temperature receives zero scoring credit, air/lake temperature cannot
substitute, Migration Timing and Push remain unavailable, and any future
Activity/Fishability candidate requires reach-specific replay and disclosure.

## 6. Weather

Open-Meteo `43.7414,-87.7521` returned HTTP 200, `America/Chicago`, 24 hourly
numeric timestamps, °C temperature and mm precipitation/rain. Accept as modeled
context only; rain does not prove river rise, clarity, or fish movement.

## 7. Acceptance status

- [ ] Provider malfunction fails closed.
- [ ] Recovered valid numeric reading automatically restores accurate display.

- [x] Live values, timestamps, cadence, units, provisional state verified.
- [x] Discharge history and date-normal endpoint verified.
- [x] Missing temperature represented honestly after USGS, Monitor My Watershed,
      Wisconsin DNR/SWIMS, and Great Lakes observing-network checks.
- [x] Reach limitation documented.
- [x] Owner accepted the possible Oct. 1 discontinuation with fail-closed
      handling and mandatory rechecks.
- [x] Pre-configuration station status rechecked on 2026-08-26.
- [x] Hidden Gauge Read and I-43-scoped Fishability configuration implemented.
- [x] Gate 4B Activity source boundary implemented: weather-only, no hydraulic
      or temperature inference, and missing weather fails closed.
- [ ] Pre-release station status rechecked.
- [ ] Fault/recovery, stale, trend, historical, and rendered matrices executed
      after configuration.

**Live Conditions decision:**
`configured_hidden_partial_with_material_source_risk`\
**Audit version:** `sheboygan-live-source-v4-gate4b-2026-08-26`
