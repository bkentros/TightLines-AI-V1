# PierCast Conditions Renovation — Pass 2 Implementation

Status: implemented behind additive v4 endpoints
Schema: `piercast-conditions-v4`
Formula: `seasonal-outlook-plus-thermal-match-v1`
Ranking: `species-seasonal-band-then-thermal-v1`

## What changed

Pass 2 adds a complete conditions engine beside the existing v3 score engine.
No production screen imports it yet, and the legacy catalog, leaderboard,
report, saved-report, temperature-map, and review routes remain available.

The new engine returns two independent reads:

- Typical Seasonal Outlook, from a species + lake/shoreline region + local
  date + bounded latitude timing model.
- Current Temperature Match, from the species thermal curve and the closest
  coherent NOAA modeled surface-temperature frame.

There is no combined public score and no default all-species leaderboard.

## Scalable seasonal profiles

The 254 reviewed city/species calibrations are treated as calibration evidence,
not as permanent runtime ranking weights. Their seasonal availability is
aggregated into 65 reusable regional profiles. The previous `fisheryStrength`
value is excluded from regional values and from ranking.

Current shoreline regions are:

- Lake Michigan west/north and west/south;
- Lake Michigan east/north and east/south;
- Lake Huron west; and
- Saginaw Bay.

These regions let a newly onboarded city inherit the appropriate
species/region profile from its coordinates. New city-specific annual curves
are not required. Each profile retains evidence IDs, a reference latitude,
weekly recurring knots, a data-derived latitude timing slope capped at four
days per degree, and a maximum absolute shift of fourteen days.
The derivation method, exact v3 source-config version, calibration SHA-256, and
the deliberate exclusion of `fisheryStrength` are carried on every profile;
the source-hash prefix is part of the profile ID so calibration changes cannot
silently retain the same identity.

The north/south segmentation is material for migratory timing. For example,
on September 20 the derived Chinook outlook is already `Good / Fading` at
Frankfort while Grand Haven remains `Excellent / Fading`. Temperature can no
longer make Frankfort appear seasonally superior merely because its water is
thermally ideal.

## Thermal profiles

All 18 configured species have a versioned modeled-nearshore-surface thermal
profile. Optimum ranges are derived only from the plateau already present in
the reviewed curve; Pass 2 does not manufacture narrower precision. Missing,
stale, partial, invalid, and out-of-domain input returns `Unavailable`, never
`Poor`.

## Ranking and reports

`conditions/leaderboard` returns target metadata and no city standings until a
species is selected. For one selected species it ranks only complete, eligible
rows by:

1. Seasonal Outlook band;
2. exact Temperature Match within that band; and
3. stable display-name/city-ID tie breaking.

Regulation closures block a row without erasing its biological seasonal or
thermal read. Local fishery context is retained as explanatory metadata with
`affectsRanking: false`.

The v4 city report includes every supported city species in one response, puts
the selected species first, and carries the current modeled temperature plus
the full 121-hour temperature timeline. Switching species does not require a
new report claim.

## Additive API surface

| Route | Access | Behavior |
|---|---|---|
| `GET conditions/leaderboard` | public | Target options; no universal standings |
| `GET conditions/leaderboard?speciesId=…` | public | Species-specific standings |
| `GET conditions/report?cityId=…&speciesId=…` | signed in | Versioned city/day v4 envelope |
| `GET conditions/saved-report?speciesId=…` | signed in | Native v4 read or faithful legacy adapter |
| `GET review/v4/outlook` | owner only | Full v4 outlook plus v3/v4 shadow comparison |

Existing routes are unchanged. Mobile client helpers for the new routes are
present but not used by the UI until Pass 3.

## Entitlements and saved reports

The existing `cityId:city-local-date` claim key remains authoritative. A v4
refresh of the same city/day replaces that envelope and consumes no additional
free claim. Native envelopes use `piercast-saved-report-v4`.

A legacy report is adapted only when it preserves the city, local date, source
provenance, modeled timeline, and a current frame sufficient to calculate both
new reads. Otherwise the API returns `archived_legacy` with a refresh action;
it never reverse-engineers conditions from the retired 1–10 score.

## Shadow comparison and validation

The owner-only comparison preserves legacy scores beside v4 seasonal/thermal
values and records per-species rank changes. It does not blend the formulas.

Automated Pass 2 coverage includes:

- all 32 cities, 254 configured pairs, 65 regional profiles, and 18 thermal
  profiles;
- 92,710 ordinary city/species/day evaluations plus leap-day evaluation for
  every pair;
- month, leap-day, and year-boundary continuity;
- inclusive band and curve boundaries;
- missing/stale/partial/out-of-domain temperature behavior;
- regulation closures and blocked ranking;
- Detroit/Chicago city-local date divergence near midnight;
- first-visit selection, one-species ranking, full city reports, shadow output,
  claim reuse, native v4 saved reports, and safe legacy fallback; and
- the Frankfort/Grand Haven fall Chinook regression case.

## Deferred by design

Pass 3 will move the existing beautiful leaderboard and report UI to these
contracts. Passes 4 and 5 handle map semantics and observations. Pass 6 owns
final cutover, rendered-device visual regression, monitoring, and removal of
retired score presentation after compatibility is proven.
