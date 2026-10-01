# PierCast Conditions Renovation — Pass 1 Product Contract

Status: **frozen for Pass 2 implementation**
Schema: `piercast-conditions-v4`
Formula: `seasonal-outlook-plus-thermal-match-v1`
Ranking: `species-seasonal-band-then-thermal-v1`

This document is the product and migration contract for the six-pass PierCast
renovation. Pass 1 is additive: it must not change current public scoring,
reports, entitlements, or map behavior. Later passes implement this contract.

## 1. Product promise

PierCast answers two separate questions for one selected species:

1. **Is this species normally a worthwhile pier target here at this time of
   year?** This is the Typical Seasonal Outlook.
2. **Does the modeled nearshore surface temperature currently suit this
   species?** This is the Current Temperature Match.

Neither answer is a fish count, proof of presence, catch forecast, pier-local
thermometer, or guarantee of access. No public UI may recombine the two answers
into an unexplained universal opportunity score.

## 2. Canonical terminology

| Concept | Public name | Values |
|---|---|---|
| Normal timing | Typical Seasonal Outlook | Excellent, Good, Fair, Poor, Usually Off |
| Position in season | Seasonal Stage | Early, Building, Active, Fading, Late, Off-season |
| Temperature compatibility | Current Temperature Match | Excellent, Good, Fair, Poor |
| Current map time | Now | Closest coherent model frame to the actual time |
| Future map time | Forecast | Model frames after Now |
| Fishing interpretation layer | Match | Requires a selected species |
| Raw modeled layer | Temp | Requires no species |
| Static structure layer | Depth | Requires no species |
| Physical point measurement | Observed | Timestamped station value at a stated depth |
| Continuous lake surface | Modeled | NOAA operational model guidance |

The product uses **Now**, not **Live**, for the complete colored map. Only an
individual qualifying station reading may be labeled a live observation.

## 3. Seasonal outlook contract

### 3.1 Inputs

The scalable evaluator introduced in Pass 2 will use:

- species;
- Great Lake/basin;
- local date or day of year;
- latitude/regional band;
- versioned regional profile; and
- optional sourced local context that is displayed separately.

It may not require bespoke annual research for every city. Existing city curves
are inputs for building and validating regional profiles, not permission to
continue indefinitely hand-authoring every new location.

Each versioned regional profile carries species, lake, basin, a reference
latitude, recurring calendar knots, evidence, and a bounded latitude timing
adjustment. The adjustment rate and maximum shift belong to the researched
profile; the engine may not apply one undocumented north/south rule to every
species or lake.

### 3.2 Output and thresholds

The seasonal evaluator returns a continuous `0...1` value. Public bands are:

| Minimum inclusive value | Band |
|---:|---|
| 0.75 | Excellent |
| 0.50 | Good |
| 0.25 | Fair |
| 0.05 | Poor |
| 0.00 | Usually Off |

Exact threshold values enter the more favorable band. The stage and trend
explain whether the seasonal window is early, building, active, fading, late,
or off. Calendar interpolation must be continuous across month and year
boundaries.

### 3.3 Local fishery context

Existing well-supported fishery-strength research is retained as explanatory
context: `Established`, `Documented`, or `Limited evidence`. It never changes
universal leaderboard ordering. Unsupported local context is omitted rather
than inferred.

## 4. Temperature-match contract

### 4.1 Inputs and output

Temperature Match uses the same standardized modeled nearshore surface source
for every ranked city. It returns:

- continuous suitability from `0...1`;
- public band;
- modeled temperature and valid time;
- optimum range;
- signed/absolute distance from the optimum;
- curve identifier; and
- source/coverage reason codes.

Public bands are:

| Minimum inclusive value | Band |
|---:|---|
| 0.85 | Excellent |
| 0.65 | Good |
| 0.35 | Fair |
| 0.00 | Poor |

Missing, stale, partial, invalid, or out-of-domain input is **Unavailable**,
never Poor. Curves remain continuous. A narrow 1–3°F optimum may be configured
only where evidence supports it; the engine must not manufacture precision.

## 5. Ranking contract

There is no all-species city ranking. A user must select a species before the
leaderboard contains ranked cities.

For one selected species:

1. Blocked or restricted rows are not ranked.
2. Rows missing either seasonal or thermal results are unranked.
3. Ranked rows are grouped by Seasonal Outlook in this order: Excellent, Good,
   Fair, Poor, Usually Off.
4. Within the same seasonal band, the exact continuous Temperature Match value
   sorts descending.
5. Exact ties sort by display name and then stable city ID.
6. Local fishery context, another species, the retired 1–10 score, observation
   availability, distance to a buoy, and alphabetical order before a real tie
   may not influence ranking.

The complete ordering is executable in `lib/pierCastConditionsV4.ts`.

## 6. Species selection contract

- First visit: show `What are you targeting?`; render no universal standings.
- `Commonly targeted now` contains species reaching at least Fair seasonal
  status in a visible city/region. `All species` remains available.
- Returning users may restore their last target or explicit favorite.
- Selection is shared between leaderboard, report, and map.
- Opening the map/report from a selected leaderboard carries the species.
- Opening the map without a selected species starts on Temp; Match prompts for
  a target without moving the camera.

## 7. City-report contract

The report hero presents the selected species plus the two independent labels.
It includes modeled current temperature, optimum range, distance from optimum,
trend, five-day model guidance, seasonal stage/trend, wind context, relevant
other species, provenance, and freshness.

River Run linkage is allowed only for an explicitly configured city/river and
species relationship. Pier temperature alone may never claim that fish entered
a river. Reports retain all supported species so switching does not consume a
second entitlement or require a second network request.

## 8. Map contract

### 8.1 Time modes

- **Now:** closest coherent NOAA model frame to the current instant. Forecast
  scrubber hidden. Observed station overlay may be enabled.
- **Forecast:** current/future NOAA frames with hourly scrub/play controls.
  Wind is synchronized to the same valid time. Observations are hidden by
  default or visibly muted as the latest past reading.

### 8.2 Layers and markers

- **Match:** requires species. Marker center shows modeled degrees, fill shows
  thermal band, detail shows species and seasonal stage.
- **Temp:** marker shows modeled degrees. No fishing score or seasonal rank.
- **Depth:** marker identifies the city. No fishing score or seasonal rank.
- **Wind:** remains an optional overlay.
- **Observed:** remains an optional Now-only point overlay.

The raw Temp and Depth layers must never inherit a Match rank merely because
the current implementation reuses one marker component.

## 9. Observation contract

GLOS/Seagull ERDDAP observations are fetched through a separate server endpoint
and cache. Failure of observations may not fail NOAA temperature, wind, depth,
leaderboard, or reports.

Every displayed observation preserves reading/station/dataset ID, provider,
coordinates, timestamp, normalized temperature, original value/unit/variable,
measurement depth when known, QC flag/status, freshness, and source URL.
Failed QC and implausible readings are excluded. Missing QC is labeled
`Not evaluated`, not `Passed`.

Observations do not initially alter scoring or ranking. A station is a point at
a particular depth and may not represent a pier, harbor, plume, or another
city. Model correction is a separate future validation decision.

## 10. API and saved-report migration

### 10.1 Additive rollout

- Introduce v4 fields/endpoints before removing any v3 field.
- Keep supported older mobile clients functional during the rollout.
- Run v3 and v4 calculations side by side until Pass 6 cutover.
- Do not rewrite historical score snapshots or claim envelopes.

### 10.2 Saved reports

- New envelopes use `piercast-saved-report-v4`.
- A legacy envelope is adapted read-only when enough fields exist.
- If faithful adaptation is impossible, show an archived-report explanation
  and offer refresh; never fabricate v4 values.
- Refreshing a same-city/same-local-date legacy claim replaces/upgrades the
  envelope without consuming another free claim.
- Report keys remain city plus city-local date; envelope version is metadata,
  not a reason to charge again.

## 11. Visual preservation contract

Passes 2–6 alter information hierarchy, not the design language.

### Preserved foundations

- `paper` color tokens, especially dashboard blue, sky blue, gold, ink, bone,
  band colors, and existing score-band equivalents;
- Fraunces display type, Bricolage Grotesque headings/body hierarchy, and
  JetBrains Mono metadata;
- paper radii, borders, shadows, spacing, corner marks, topographic decoration,
  cards, rails, struck medal treatment, map panels, and tactile motion;
- current dedicated map/report navigation and back-stack behavior;
- temperature, depth, and wind gradients; and
- current loading skeleton, haptic, collapse/expand, and retry conventions.

### Allowed semantic substitutions

- A score circle may become a temperature/condition marker while retaining its
  geometry.
- Medal standings may remain after species selection.
- New species and Now/Forecast selectors must be built from existing chip/tab
  patterns.
- Existing score colors may map to named condition bands, but color can never
  be the only carrier of meaning.

### Review matrix

Every later visual pass must compare small, standard, and large iPhone widths;
default and enlarged text; loading, stale, missing, restricted, and complete
states; long city/species names; all map modes; overview and shoreline zoom;
wind on/off; observations on/off; and Now/Forecast.

Source baselines at the Pass 1 freeze:

- `app/pier-cast-review.tsx`
- `app/pier-cast-map.tsx`
- `components/pier-cast/PierCastVisuals.tsx`
- `components/pier-cast/PierCastTemperatureGradient.tsx`
- `lib/theme.ts`

Their exact source hashes and core token values are archived in
`docs/PierCast_Renovation_Pass1_Visual_Baseline.json`.

The Pass 1 QA locks these structural design dependencies without brittle pixel
hashes. Pass 6 adds rendered-device visual approval.

## 12. Golden acceptance scenarios

`docs/PierCast_Renovation_Pass1_Golden_Scenarios.json` is the executable input
and expected ordering inventory for Pass 2. Its numerical values are synthetic
contract fixtures, not biological calibration claims.

Required scenarios include Frankfort versus Grand Haven, ideal temperature in
off-season, same-season thermal ordering, missing temperature, regulation
blocking, north/south progression, exact ties, mixed-species rejection,
year-boundary continuity, and city-local timezone evaluation.

## 13. Pass 1 completion boundary

Pass 1 is complete when the shared v4 types/constants and ranking behavior,
this specification, golden scenarios, migration rules, and visual invariants
all pass `qa:pier-cast:renovation-pass1`. It intentionally makes no production
behavior change. Pass 2 owns engine and API implementation.
