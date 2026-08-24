# Platte River Live Conditions Audit

**River ID:** `platte`
**Created/researched:** 2026-08-24
**Status:** `owner_approved_implementation_pending`

Gauge Read is a river-level measurement surface, not a fifth scored primitive.
It may report accepted station measurements, station-specific 24-hour change,
same-date prior-year context, freshness, and provenance. It does not determine
migration, presence, Activity, Fishability, clarity, access, or safety.

## 1. Capability decision

| Metric | Candidate / exact series | Accepted source | Live | History | Public unit / precision | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Discharge | USGS 04126740 / 00060 | Platte River at Honor, MI | Yes structurally; temporarily unavailable at probe due `Eqp` | Daily mean from 1990-03-27; prior years available for ±3-day baseline | CFS / whole CFS | Accept as the sole primary hydraulic metric, scoped to US-31/Honor |
| Gauge height | USGS 04126740 / 00065 | Platte River at Honor, MI | Yes structurally; temporarily unavailable at probe due `Eqp` | Continuous since 2017-10-01; no daily datum-consistent baseline accepted | ft / 0.01 ft | Accept current/trend only; always show `No average` |
| Measured water temperature | USGS 04126740 / 00010 and nearby-source review | None | No | No accepted continuous/daily series | °F / n/a | Explicitly unavailable; do not use air/lake/field/borrowed temperature |

**Capability conclusion:** Platte has accepted hydraulics but no accepted
measured water temperature. Gauge Read can therefore be `available` with two
hydraulic tiles when fresh, or `unavailable` when both are stale/missing. It is
not `partial` merely because temperature was researched and rejected; Partial
applies only if a configured accepted metric is unavailable. If temperature is
later configured, that decision changes.

At the actual 2026-08-24 probe, the display state is **Unavailable**: last good
values were 165 CFS and 1.43 ft at 2026-08-20 17:30 fixed EST, after which the
USGS series returned `Eqp` equipment-malfunction placeholders. Values older
than 24 hours are suppressed and no 24-hour trend is produced.

## 2. Accepted source verification

| Field | Verified value |
| --- | --- |
| Provider/station | U.S. Geological Survey, `04126740`, `PLATTE RIVER AT HONOR, MI` |
| Series | `00060` discharge in ft³/s; `00065` gage height in ft; requested `00010` returned no site/series |
| Location | 44.6680551, -86.0348123; right bank 20 ft downstream of US-31 bridge, about 1 mile west of Honor |
| River section | Upper Platte at US-31, upstream of Platte Lake and outside proposed lower River Run sections |
| Normal cadence | 15 minutes in the IV probe |
| Freshness | **Owner-calibrated proposal:** Fresh <=2 h; Delayed >2–6 h; stale 6–24 h may appear only under the engine's accepted stale presentation; suppress >24 h. Exact thresholds require integration-owner confirmation against the engine contract. |
| Flags | Current IV values provisional (`P`); malfunction placeholders (`Eqp`) are nonnumeric/unavailable. Historical daily rows may be approved (`A`), estimated (`e`), or provisional (`P`). |
| History | Daily mean discharge from 1990-03-27 through the current service period. Gage height began 2017-10-01 but has no accepted daily/date-average contract. |
| Datum/method | Gage/land elevation 589.43 ft NAVD88; public gage height is a relative station reading and must not be mixed with parameter 63160 water-surface elevation. Historic reports used an older datum. |
| Attribution | `U.S. Geological Survey`; public data with provisional-data qualification where applicable |
| Represented reach | The Platte at the US-31/Honor station and upstream drainage response; not Platte Lake, Loon Lake, lower weir, El Dorado, or the mouth |
| Exclusions | Does not measure lower-river hydraulics, water temperature, clarity, access, safety, or fish movement. Hatchery diversion about 6 miles upstream is a known influence. |

Exact endpoint probes and citations are recorded as P-001–P-005 and E-003/E-004
in `river-foundation.md`. The source is structurally accepted despite the
temporary outage because identity, parameters, units, cadence, history, and
qualifiers are verified. Runtime must still fail closed on stale/`Eqp` values.

## 3. Date-average contract

- Discharge uses accepted daily mean observations for the target month/day
  ±3 calendar days across prior years only; current year excluded.
- Store sample count, included years, record kind (`daily mean discharge`),
  baseline version, and exact seven-day month/day window.
- Preserve approved/accepted history and disclose gaps/estimated values under
  the provider-specific baseline implementation; do not silently manufacture a
  complete record.
- Do not shrink the window when the exact date exists and do not broaden it
  beyond ±3 days.
- Gauge height always displays `No average` until a datum-consistent daily
  baseline is separately implemented and accepted.
- Measured water temperature displays no tile and no average.
- Insufficient discharge history returns unavailable, never a broad seasonal
  average. `Normal` means within the accepted historical distribution, not
  ideal fishing conditions.

**Proposed historical label:** `Compared with prior years near this date
(±3 days; USGS daily mean discharge).` Record length should be computed from
accepted samples, not hard-coded as 36 years.

## 4. Twenty-four-hour trend contract

| Metric | Prior read | Direction | Missing behavior |
| --- | --- | --- | --- |
| Discharge | Closest accepted observation at/before approximately 24 h within engine tolerance | Rising / Falling / Stable using engine tolerance | `24-hour trend unavailable` |
| Gauge height | Same accepted prior-observation contract | Rising / Falling / Stable using engine tolerance | `24-hour trend unavailable` |
| Water temperature | Not configured | None | No tile; never infer warming/cooling from air temperature |

The two hydraulic trends describe USGS 04126740 only. A trend cannot become a
claim about the lower river, migration, clarity, safety, or fish presence. At
the probe-time outage both trends are unavailable.

## 5. Public copy proposal

- Gauge Read limitation: `USGS readings describe the Platte at US-31 near
  Honor, upstream of Platte Lake—not the lower river near the weir or mouth.`
- Discharge station label: `Platte River at Honor`.
- Gauge-height station label: `Platte River at Honor`.
- Temperature label: none; no empty temperature tile.
- Reach explanation: `Measured at US-31 near Honor. Platte Lake, Loon Lake,
  and the lower weir separate this station from the lower salmon corridor.`
- All-current-unavailable message: `The Honor gauge has no current displayable
  reading. Check the U.S. Geological Survey station and posted local guidance.`
- Delayed/partial message: `Some Honor gauge measurements are unavailable;
  available values still describe only the US-31 reach.`
- Public provider label / attribution: `U.S. Geological Survey` / `Data from
  the U.S. Geological Survey; recent readings may be provisional and revised.`
- Internal names prohibited publicly: `usgs_04126740`, `00060`, `00065`,
  `63160`, `Eqp`, `NWIS`, adapter/provider enums, source IDs, cache/fetch
  language, and engine freshness keys.

Do not use `upper river` without the named US-31 endpoint. Do not call the
station representative of the public lower sections.

## 6. Weather-point strategy

The separate weather point is `44.6681,-86.0348` at Honor. NWS `/points`
resolved it to APX grid `15,41`; the hourly endpoint returned current periods
on 2026-08-24. It is modeled meteorological context and never a Gauge Read
metric or measured-water-temperature substitute.

## 7. Mixed-capability decision and limitations

The current normative Activity modes do not describe this river:

- `observed_river` requires accepted hydraulics **and** measured water
  temperature;
- `weather_only` requires neither and cannot be used while hydraulics exist.

**Owner decision LC-01 (approved 2026-08-24):** capability is evaluated by
represented run reach. Honor hydraulics remain Gauge Read measurements but are
not Activity inputs for the lower corridor. A supported Platte run may use a
dedicated weather-only Activity model with zero hydraulic/temperature credit,
Limited confidence, explicit limitations, independent species replay, and
fail-closed validation.

**Owner decision LC-02 (approved 2026-08-24):** the upstream US-31 hydraulic
shape cannot influence lower-corridor Fishability. Keep Fishability
deterministically unavailable unless a lower-reach source or validated
transformation is found. Gauge Read may still show the upstream measurements
with the explicit label.

## 8. Phase B acceptance matrix (required later)

- [ ] Both hydraulic metrics fresh.
- [ ] One hydraulic metric missing (Partial).
- [ ] Both unavailable, including current `Eqp` case.
- [ ] Delayed reading and older-than-24-hours suppression.
- [ ] Provisional, approved, estimated, and malfunction qualifier handling.
- [ ] Rising/falling/stable discharge and gage height.
- [ ] Missing 24-hour comparison.
- [ ] Lower/normal/higher discharge date context using exact prior-year ±3 days.
- [ ] Gauge height `No average`; no temperature tile/history.
- [ ] Source precision: whole CFS and 0.01 ft.
- [ ] Honor station/reach limitation in collapsed and expanded states.
- [ ] Long station/attribution wrapping at narrow iOS and Android widths.
- [ ] No internal terminology, lower-river inference, or safety language.
- [ ] Source recovery after `Eqp` does not resurrect stale trend evidence.

## 9. Phase B decision

**Gauge Read source decision:** `hydraulics_accepted_temperature_unavailable`
**Current probe state:** `unavailable_equipment_malfunction`
**Activity capability decision:** `owner_approved_reach_based_weather_only_for_supported_runs`
**Fishability reach decision:** `owner_approved_unavailable_for_lower_corridor`
**Live Conditions decision:** `owner_approved_source_capability_QA_pending`
**Audit version:** `platte-live-conditions-research-v1`
**Owner acceptance/date:** approved / 2026-08-24
