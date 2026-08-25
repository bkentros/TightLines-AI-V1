# Grand River Live Conditions Audit

**River ID:** `grand`
**Created/researched:** 2026-08-24
**Status:** `owner_approved_implementation_pending`

Gauge Read is an unscored measurement surface. It does not determine Stage,
Activity, Fish In River, Fishability, clarity, access, or safety. Evidence IDs
resolve to the ledger in `river-foundation.md`.

## 1. Capability decision

| Metric | Candidate source | Accepted source | Live available | Historical available | Public unit/precision | Decision reason |
| --- | --- | --- | --- | --- | --- | --- |
| Discharge | USGS 04119000, 04119070, 04119400 | **USGS 04119000 / parameter 00060 / statistic 00000** | yes | yes: daily mean 00060/00003 | CFS, whole number | Long, nearly continuous daily record and active 15-minute downtown series. One source avoids averaging. Claim is limited to the Fulton Street/downtown reach and must be re-audited during dam-removal construction. |
| Gauge height | USGS 04119000, 04118564, 04119070, 04119400 | **USGS 04119000 / parameter 00065 / statistic 00000** | yes | raw history exists from 2017, but no accepted datum-consistent date-average baseline | ft, 0.01 | Same station/reach as discharge; render current/trend only and always show `No average`. Stage is especially local and construction-sensitive. |
| Measured water temperature | USGS 04118564; USGS 04119400 | **USGS 04118564 / parameter 00010 / statistic 00000** | yes | yes: daily 00010/00001 max, /00002 min, /00003 mean from July 2020 | °F, 0.1 after °C conversion | North Park returns current 15-minute measured temperature and exceeds five historical years. Eastmanville is rejected as live fallback: its last valid temperature was 2024-10-01 and its 2026 payload contains discontinuation sentinels. |

Not accepted for public rendering: USGS precipitation, turbidity, dissolved
oxygen, specific conductance, water-level elevation, or modeled weather.

## 2. Accepted source verification

### 2.1 Primary hydraulics — USGS 04119000

- Public station name: `Grand River at Grand Rapids`.
- Provider/site/series: U.S. Geological Survey, site `04119000`;
  `00060/00000` instantaneous discharge and `00065/00000` instantaneous gauge
  height. Daily mean discharge is `00060/00003`.
- Physical location: 42.963082, -85.677253, right bank about 500 feet upstream
  of Fulton Street bridge, river mile 41; drainage area about 4,900 square
  miles.
- Public section/reach: Lower river, downtown Grand Rapids. It does **not**
  represent Grand Haven harbor, every lower-river reach, or water above Sixth
  Street.
- Endpoint probe, 2026-08-24: a 2026-08-21 19:00–2026-08-24 10:00 fixed-EST
  window returned 253 values per metric (15-minute cadence), latest discharge
  1,460 CFS and height 1.25 ft, both qualifier `P`. Exact numbers are probe
  evidence only, not seeded product values.
- Current endpoint:
  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04119000&parameterCd=00060,00065,00010&siteStatus=all`.
- Historical endpoint:
  `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04119000&parameterCd=00060,00065,00010&startDT=1900-01-01&endDT=2026-08-24&siteStatus=all`.
- Daily discharge probe: 36,791 values, 1901-03-01 through 2026-08-23;
  expected gap 1906–1930 and observed missing days 2026-07-15–16. USGS's
  current page reports 100 water years for Aug. 24 statistics.
- Datum/method: location metadata now gives gage altitude 585.24 ft NAVD88.
  Older records document relocation/datum changes, including a 1953 site
  change; this is why no gauge-height date average is accepted.
- Freshness proposal requiring owner acceptance: fresh at age ≤2 hours;
  delayed at >2–24 hours; suppress at >24 hours. Each metric classifies
  independently.
- Qualifiers: current values are provisional (`P`) and subject to revision;
  daily record includes approved (`A`) and estimated (`e`) values.
- Material limitation: four low-head dams are being removed immediately
  upstream in the downtown Lower Reach. Re-check the rating, datum, station
  continuity, and represented reach after any material 2026/2027 channel
  change. Do not use gauge height as a cross-season absolute proxy.

### 2.2 Primary measured temperature — USGS 04118564

- Public station name: `Grand River at North Park Street`.
- Provider/site/series: U.S. Geological Survey, site `04118564`,
  `00010/00000` instantaneous temperature in degrees Celsius. Daily max/min/mean
  are `00010/00001`, `/00002`, and `/00003`.
- Physical location: 43.022778, -85.660833, North Park Street NE, Kent County;
  drainage area 4,877.362 square miles; operated with the City of Grand Rapids.
- Public section/reach: Middle passage corridor immediately above Sixth
  Street. It does not represent Grand Haven, Webber, or Lansing.
- Endpoint probe, 2026-08-24: 253 values from 2026-08-21 19:00 to
  2026-08-24 10:00 fixed EST (15-minute cadence); latest 21.2 °C, qualifier
  `P`. Product converts normalized Celsius to Fahrenheit and displays 0.1 °F.
- Current endpoint:
  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04118564&parameterCd=00010,00065&siteStatus=all`.
- Historical endpoint:
  `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04118564&parameterCd=00010&startDT=1900-01-01&endDT=2026-08-24&siteStatus=all`.
- Daily mean probe: 2,137 values from 2020-07-16 through 2026-08-23. Material
  gaps include about 50 days in March–April 2021, 8 days in November 2024, 6
  days in October 2024, and shorter gaps. Date averages must disclose usable
  sample years, not simply claim a continuous six-year record.
- Freshness proposal requiring owner acceptance: same ≤2 h / >2–24 h / >24 h
  contract as hydraulics.
- Qualifiers: current values provisional; approved daily history is revised
  when USGS quality review requires it.
- Fallback: none accepted. USGS 04119400 Eastmanville had valid temperature
  through 2024-10-01; its 2026 IV response contains only `-999999` with `Dis`.
  Those sentinels must parse as missing, never as temperature.

### 2.3 Attribution and timezone

- Public provider label: `U.S. Geological Survey`.
- Attribution: `Data courtesy of the U.S. Geological Survey.`
- USGS federal data are public domain; USGS requests credit. Provisional values
  are subject to revision.
- USGS metadata and timestamps use fixed `EST`/`-05:00` and say the sites do
  not honor DST. River calendar/display logic must use `America/Detroit` and
  must preserve the observation instant while converting for display. Test
  both EDT and EST dates; do not reinterpret a `-05:00` source timestamp as
  Detroit wall time.

## 3. Date-average contract

- Target: same calendar month/day ±3 calendar days across prior years only;
  current year excluded.
- Discharge: accepted from daily mean `04119000/00060/00003`, with exact
  usable sample count, year span, window dates, approved/estimated qualifiers,
  and gaps disclosed. The historical distribution determines
  lower/normal/higher; no arbitrary percentage threshold.
- Measured temperature: accepted from daily mean
  `04118564/00010/00003`, subject to minimum-history validation at each target
  date. Show colder/normal/warmer only when enough prior-year values exist.
- Gauge height: always `No average` until a datum-consistent baseline is
  separately implemented and accepted.
- Do not shrink the window when exact-date values exist, broaden it to fill
  gaps, use a seasonal average, or mix Eastmanville history with North Park
  current temperature.
- The current year is excluded even when current daily data are already
  approved. Missing days remain part of the record truth.

## 4. Twenty-four-hour trend contract

| Metric | Prior-read tolerance proposal | Stable tolerance | Missing behavior |
| --- | --- | --- | --- |
| Discharge | closest accepted observation at or before roughly 24 h under the engine tolerance; source cadence is 15 min | existing engine contract; owner must verify it is sensible at this reach | Unknown trend |
| Gauge height | same | existing engine contract | Unknown trend |
| Water temperature | same prior-time and smoothing contract used for current read | existing engine contract after °C normalization | Unknown trend |

Trend describes only the named station measurement. It never claims fish
movement, migration, clarity, safety, or a whole-river change. No prior
observation means unknown, not stable.

## 5. Public copy lock (owner approved; implementation QA pending)

- Gauge Read limitation sentence: `Grand Rapids readings describe the Fulton Street and North Park reaches, not the full Grand River.`
- Discharge public station label: `Grand River at Grand Rapids`.
- Temperature public station label: `Grand River at North Park Street`.
- Gauge-height public station label: `Grand River at Grand Rapids`.
- Reach explanation: `Flow and gauge height are measured near Fulton Street; water temperature is measured upstream at North Park Street.`
- No-gauge/partial-data message: `Some Grand Rapids station measurements are unavailable. Available values still describe only their named reach.`
- Public provider label: `U.S. Geological Survey`.
- Attribution: `Data courtesy of the U.S. Geological Survey. Provisional readings may be revised.`
- Internal names prohibited publicly: `USGS:04119000`, `USGS:04118564`,
  `00010`, `00060`, `00065`, `NWIS`, adapter/provider enums,
  `monitor_my_watershed`, `P`, `A`, `e`, `Dis`, `-999999`, refresh-slot IDs,
  baseline IDs, and source IDs.

## 6. Capability contradictions and decisions

| ID | Finding | Decision/consequence |
| --- | --- | --- |
| LC-001 | USGS station metadata advertises fixed EST and no DST while the river's civil timezone is America/Detroit. | Preserve the timestamp instant; display in America/Detroit. Add EDT/EST rollover tests. |
| LC-002 | 04119000 has a long discharge record but historical gage relocations/datum changes and active channel work. | Discharge date context allowed; gauge-height average unavailable; mandatory post-construction source re-audit. |
| LC-003 | 04119400 appears to have a temperature parameter through 2026-01-07, but the exact endpoint returns discontinuation sentinels and no valid live value after 2024-10-01. | Reject as live/fallback temperature; parse `-999999`/`Dis` as missing. |
| LC-004 | Temperature station is above the former Sixth Street reference while hydraulic station is below it. | Render actual station names. They may pair only in the downtown observed Activity contract after the recorded North Park/Sixth proxy validation; never infer whole-river conditions. |
| LC-005 | The initial 2026-08-24 probe returned all-null clear-sky radiation. | Historical blocker resolved by the current weather adapter and six-season replay. Missing target-day hourly weather still fails Activity closed. |
| LC-006 | Exact freshness thresholds and public copy are product decisions. | The ≤2 h proposal and copy remain owner-calibrated/approval-required. |

## 7. Probe ledger

| Probe | Result | Status |
| --- | --- | --- |
| 04119000 IV, 00060/00065/00010 | 00060 and 00065 live at 15-minute cadence; no 00010 series | pass for discharge/height |
| 04119000 DV, 1900–2026 | 36,791 discharge daily means; 1901–1905 and 1930–present with gaps | pass with gap disclosure |
| 04118564 IV, 00010/00065 | temperature and local stage live at 15-minute cadence; temperature accepted | pass for temperature |
| 04118564 DV, 00010 | max/min/mean daily series, >6 calendar years but material gaps | pass for ±3-day temperature context subject to per-date sample sufficiency |
| 04119400 IV/DV, 00010 | historical daily record; last valid IV 2024-10-01; 2026 discontinuation sentinels | reject live/fallback |
| Open-Meteo current Activity adapter and archive replay | actual/clear-sky radiation, cloud, and precipitation are normalized per local hour; six fixed seasons replayed | pass for downtown Activity; fail closed on missing hourly weather |

## 8. Test matrix required before acceptance

- [x] All three accepted metrics fresh.
- [x] Each single metric missing and partial combinations.
- [ ] Delayed reading under owner-approved threshold.
- [ ] Older-than-24-hours suppression.
- [ ] `-999999`/`Dis` suppression.
- [ ] Provisional current and approved/estimated historical qualifiers.
- [ ] Rising/falling/stable; warming/cooling/stable; missing prior read.
- [ ] Discharge lower/normal/higher using exact prior-year ±3-day data.
- [ ] Temperature colder/normal/warmer using exact prior-year ±3-day data.
- [ ] Gauge height always says `No average`.
- [ ] Insufficient temperature years/gaps return unavailable.
- [x] No temperature fallback is selected when North Park is absent.
- [ ] Fixed-EST source timestamps render correctly in EDT and EST, including DST transitions.
- [ ] Long station names wrap on narrow iOS and Android widths.
- [ ] Details show actual station, observation time, freshness, provisional status, reach, years/window/gaps, and attribution.
- [ ] No internal IDs/qualifiers leak.
- [ ] Lower Reach construction fixture makes no safety/access claim.
- [ ] Post-2026 and post-2027 dam-removal rating/datum/source re-audit completed.

**Live Conditions decision:** `owner_approved_source_capability_automated_QA_pass_rendered_review_pending`
**Audit version:** `grand-live-conditions-research-v1-2026-08-24`
**Owner acceptance/date:** approved / 2026-08-24
