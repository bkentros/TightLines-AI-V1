# White River Live Conditions Audit

**River ID:** `white`
**Created / probed:** 2026-08-24
**Status:** `owner_approved_implementation_pending`
**Audit version:** `white-live-conditions-research-v1-2026-08-24`

Live Conditions / Gauge Read is a river-level measurement surface, not a score
and not a fifth primitive. It does not infer migration, fish presence,
responsiveness, clarity, fishability, access, or safety.

## 1. Capability decision

| Metric | Candidate | Accepted source | Live | Historical | Public unit / precision | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Discharge | USGS 04122200 | White River near Whitehall, MI; parameter 00060 | yes; 15 min; provisional | yes; daily mean 1957-08-01-present | whole CFS | Accept as primary hydraulic at Fruitvale Road |
| Gauge height | USGS 04122200 | White River near Whitehall, MI; parameter 00065 | yes; 15 min; provisional | IV since 2017; no accepted datum-consistent average | ft / 0.01 | Accept current/trend only; date average unavailable |
| Measured water temperature | USGS 04122200 parameter 00010; USGS 04122195; TU/Monitor My Watershed Weaver St | South Branch White River at Weaver Street; result 5989 / `Meter_Hydros21_Temp` | yes; 15 min; raw/provisional | yes, 2022-09-08-present, but baseline not yet accepted | °F / 0.1 | Accept live/current and 24h trend. Historical date average remains blocked pending baseline/gap approval. |

**Critical finding:** the primary hydraulic gauge has no temperature series.
The temperature metric comes from a different station and reach, immediately
below Hesperia Dam. Every metric must show its own actual station. Do not label
the two stations as one `White River gauge`.

## 2. Endpoint verification

### USGS 04122200 — hydraulics

- Station: `WHITE RIVER NEAR WHITEHALL, MI`
- Coordinates: 43.46417856, -86.2325668; right bank, 30 ft downstream of
  Fruitvale Road bridge, 6.3 mi below North Branch and 6.9 mi northeast of
  Whitehall.
- Live endpoint probed:
  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04122200&parameterCd=00060,00065,00010&siteStatus=all`
- Probe result at 2026-08-24 15:50Z: 00060 = 217 CFS and 00065 = 0.91 ft,
  both observed 2026-08-24 10:15 EST and flagged `P` (provisional). No 00010
  series was returned.
- Cadence: consecutive values indicate 15 minutes.
- IV availability: discharge 1989-10-01-present; gage height
  2017-10-01-present; water-surface elevation 2020-present (not a current
  public metric proposal).
- Daily discharge endpoint:
  `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04122200&parameterCd=00060&statCd=00003&startDT=1957-08-01&endDT=2026-08-24&siteStatus=all`
- Daily probe: 25,223 values from 1957-08-01 through 2026-08-23 versus
  25,225 expected (99.99%); one two-day gap; 24,946 approved, 277
  provisional, and 1,665 estimated qualifiers (qualifiers may overlap).
- Datum: current site metadata gives gage altitude 593.81 ft NAVD88. A
  gauge-height date normal is rejected until a versioned datum-consistency
  audit exists.
- Reach: Fruitvale free-flowing mainstem. It does not measure the immediate
  Hesperia tailwater, Pines Point, White Lake, or the lower-six-mile lake-level
  influence as a whole.
- Attribution: `U.S. Geological Survey`; current data are provisional and
  subject to revision. Public USGS data.

### Trout Unlimited / Monitor My Watershed Weaver Street — temperature

- Public station: `South Branch White River at Weaver Street`
- Portal site: `Weaver St`; result ID 5989; variable
  `Meter_Hydros21_Temp`; METER HYDROS 21 sensor; liquid-aqueous °F.
- Coordinates: 43.57027, -86.04446; White River Watershed Partnership says
  this station is about 0.25 mi downstream of Hesperia Dam.
- Current page probed:
  `https://monitormywatershed.org/sites/Weaver%20St/`
- Probe result: 62.6°F at 2026-08-24 10:45 local fixed UTC-05, raw and
  provisional; 15-minute cadence.
- Historical endpoint probed:
  `https://monitormywatershed.org/api/csv-values/?result_ids=5989&min_datetime=2022-09-08&max_datetime=2026-08-25`
- History probe: 126,283 observations from 2022-09-08 18:30Z through
  2026-08-24 15:45Z; 90.98% expected-interval coverage; 802 gaps longer than
  15 minutes; 12,523 missing intervals; largest gap 92.08 days. Annual row
  counts: 2022 10,776; 2023 34,324; 2024 25,857; 2025 33,380; 2026 21,946.
- Data semantics: provider warns that values are raw, provisional, not
  post-processed for QC, supplied as-is and subject to revision.
- Reach: immediate Hesperia tailwater only. It cannot be presented as
  Fruitvale or whole-river temperature.
- Attribution/license: Trout Unlimited via Monitor My Watershed; CC BY-SA
  4.0. Proposed concise attribution: `Trout Unlimited monitoring station;
  data hosted by Monitor My Watershed (CC BY-SA 4.0).`

### Rejected candidates / claims

- USGS 04122200 parameter 00010: rejected; exact endpoint returned no series.
- USGS 04122195 at Hesperia: metadata exists, but no usable current or daily
  series was established; metadata alone is insufficient.
- Seasonal MDNR/WRWP logger studies: valuable evidence, but retrieval-based
  seasonal files are not a stable current Gauge Read feed.
- Air temperature and third-party fishing-site `water temperature`: rejected
  as measured river temperature substitutes.

## 3. Reach and capability contract

| Source | Public section | Responsible claim | Excluded claim |
| --- | --- | --- | --- |
| USGS 04122200 | Lower river at Fruitvale Road | `Fruitvale Road flow / gauge height` | Whole White River, Hesperia tailwater, White Lake backwater |
| Weaver Street temperature | Upper accessible corridor | `Measured water temperature below Hesperia Dam` | Fruitvale temperature, average corridor temperature, lake temperature |
| NWS GRR 24,72 | Pines Point / corridor midpoint | Hourly modeled weather context | Measured river condition or measured rainfall at either station |

Gauge Read capability is `available` when all three readings satisfy freshness,
`partial` when either station/metric is absent, and `unavailable` only when no
accepted metric is displayable. Missing temperature must not suppress fresh
USGS hydraulics, and missing USGS values must not suppress fresh Weaver
temperature.

## 4. Freshness, trends, precision, and history

### Owner-calibrated freshness proposal

| Metric | Fresh | Delayed | Suppressed | Rationale |
| --- | --- | --- | --- | --- |
| USGS discharge / height | <=2 h | >2 h to 24 h | >24 h | 15-min operational cadence with provisional semantics |
| Weaver temperature | <=2 h | >2 h to 24 h | >24 h | 15-min operational cadence; gaps occur and must be visible |

These age thresholds are product calibration, not provider facts, and require
owner approval.

### Twenty-four-hour trend

- Select the closest accepted observation at or before approximately 24 hours
  earlier under the engine tolerance.
- Discharge/height: `Rising`, `Falling`, `Stable`; temperature: `Warming`,
  `Cooling`, `Stable`.
- Stable tolerances remain engine/owner-calibrated; no threshold is asserted
  here as biology.
- No acceptable prior observation => `24-hour trend unavailable`.
- Trends are station trends only; never infer fish movement, clarity, safety,
  or whole-river change.

### Date-average contract

- Discharge: use approved daily means for target month-day ±3 days across
  prior years only. Disclose 69 water years as of this audit, the seven-day
  window, sample count, estimated values/gaps, and baseline version.
- Gauge height: `No average`; datum-consistent baseline is not accepted.
- Temperature: raw history can support research, but public date average is
  `unavailable` until the owner accepts daily aggregation, minimum prior-year
  count, QC treatment, and gap exclusions. There are only three complete prior
  calendar years (2023-2025), a partial 2022 season, and material gaps.
- Never broaden beyond ±3 days or use the current year to manufacture an
  average.

### Display precision

- Discharge: whole CFS (`217 CFS`).
- Gauge height: two decimals (`0.91 ft`).
- Temperature: one decimal (`62.6°F`).
- Preserve normalized raw values internally; precision is resolution, not
  certainty.

## 5. Public copy lock proposal

- Gauge Read limitation: `Flow and height are measured at Fruitvale Road;
  water temperature is measured below Hesperia Dam. Neither station represents
  the full river.`
- Discharge station: `White River near Whitehall — Fruitvale Road`
- Gauge-height station: `White River near Whitehall — Fruitvale Road`
- Temperature station: `South Branch White River at Weaver Street — below
  Hesperia Dam`
- Partial message: `Some White River station readings are unavailable. The
  measurements shown still apply only to their named reaches.`
- Unavailable message: `No accepted White River station reading is current
  enough to display.`
- Providers: `U.S. Geological Survey`; `Trout Unlimited monitoring station`;
  expanded attribution may name Monitor My Watershed.
- Never expose: `usgs_04122200`, `mmw_weaver_st_temp`, `Weaver St`, `5989`,
  `Meter_Hydros21_Temp`, `monitor_my_watershed`, adapter names, reason codes,
  weights, or thresholds.

## 6. Weather-point audit

- Proposed point: Pines Point, 43.5296, -86.1162, near the geographic center
  of the public corridor.
- NWS point probe resolved to office GRR, grid 24,72, timezone
  `America/Detroit`, hourly URL
  `https://api.weather.gov/gridpoints/GRR/24,72/forecast/hourly`.
- Hourly probe generated successfully at 2026-08-24T15:52:23Z with hourly
  local periods and precipitation probability.
- Weather is modeled context only and is not rendered as a Gauge Read metric.
- Local lake breeze and spot rainfall can differ across the 33-mile corridor.

## 7. Contradictions and decisions

| ID | Issue | Decision / required action | Status |
| --- | --- | --- | --- |
| LC-001 | Third-party sites say USGS 04122200 has temperature; USGS endpoint does not | Reject the claim and use Weaver temperature only | resolved |
| LC-002 | Hydraulic and temperature stations are ~corridor-apart, not co-located | Render actual station per metric and permanent split-reach limitation | approved 2026-08-24 |
| LC-003 | Temperature history exists but is raw, short, and gappy | Accept live/trend; keep date average unavailable pending versioned baseline policy | approved 2026-08-24 |
| LC-004 | Station timestamps display fixed UTC-05 while river timezone observes EDT | Normalize instants to UTC internally and render in `America/Detroit`; test DST boundaries | implementation gate |
| LC-005 | Hesperia/White Cloud operations can alter upper-reach temperature | Do not extrapolate Weaver temperature downstream; re-audit if dam operations/status change | ongoing limitation |
| LC-006 | Split reach may technically satisfy observed-river input presence while misrepresenting a single reach | Activity must remain unapproved until a river/species calibration explicitly accepts or rejects the split-reach contract | Phase C owner gate |

## 8. Phase B acceptance matrix status

- [x] Exact live hydraulic endpoint/parameters probed.
- [x] Exact temperature page and historical series endpoint probed.
- [x] Units, cadence, provisional semantics, coordinates, reach, and license recorded.
- [x] Hydraulic daily-history span and gaps quantified.
- [x] Temperature interval coverage and material gaps quantified.
- [x] NOAA point and hourly endpoint probed.
- [x] Owner accepts split-reach Gauge Read presentation.
- [x] Owner accepts freshness thresholds and automatic recovery from provider outages.
- [ ] Temperature date-average baseline implemented/accepted (otherwise deterministic unavailable).
- [ ] Fresh, partial, delayed, >24h, missing, trend-missing, and narrow-screen fixtures pass.
- [ ] Long station names and attribution pass iOS/Android visual QA.

**Live Conditions decision:** `owner_approved_source_capability_QA_pending`
**Owner acceptance/date:** approved / 2026-08-24
