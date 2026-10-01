# PierCast Renovation — Pass 5 Implementation

Pass 5 adds a truthful observed-temperature layer without changing the
modeled map, species conditions, leaderboard ordering, reports, or access
entitlements.

## Data path

The existing scheduled GLOS/Seagull ERDDAP ingestion remains the only remote
fetch path. It archives original values, units, variables, aggregate QC flags,
normalized temperatures, timestamps, source URLs, and rejected evidence. The
mobile client never calls ERDDAP directly.

The initial public allowlist is deliberately limited to the three station
contracts already audited end to end (`obs_62`, `obs_671`, and `obs_709`). It
does not claim complete station coverage of all five lakes. Additional stations
must add explicit identity, coordinates, variable/unit, depth, and QC contracts
before ingestion; the app never guesses those fields from a generic catalog.

The new service-only database function returns at most the latest qualifying
reading for each configured station from a bounded 30-day window. The public,
anonymous endpoint is:

`GET observations/temperature-map`

It is cached independently of the NOAA map foundation and v4 conditions map.
An observation database or endpoint failure therefore cannot fail temperature,
wind, depth, Match, leaderboard, or city-report requests.

## Quality and freshness

- Failed aggregate QC flags are excluded.
- Temperatures outside -2–40°C and missing values are excluded.
- QC flag `1` is labeled `Passed`.
- A plausible value with no QC flag is labeled `Not evaluated`; it is never
  described as passed.
- Station readings are `Fresh` through two hours, `Aging` through twelve
  hours, and `Stale` afterward.
- Readings older than 30 days are omitted. A missing seasonal or qualifying
  reading becomes a diagnostic, not a fabricated point.

Every public station preserves reading, station, and dataset identity;
provider; audited coordinates; timestamp; normalized and original values;
variable; measurement depth when known; QC status/flag; freshness; and source
URL.

## Map behavior

- Observations default off.
- The toggle works only in `Now`; Forecast visibly says `OBS NOW ONLY` and
  never renders station points.
- Observations use outlined point markers distinct from pier-city markers and
  the continuous modeled raster.
- Only a fresh qualifying reading may say `Live observation`. Aging and stale
  values say `Observation` with their freshness.
- Tapping a point shows temperature, exact observation time, sensor depth or
  `Depth not reported`, QC status, dataset, source link, and the point-reading
  limitation.
- The UI repeatedly identifies the colored surface as modeled and station
  markers as observed.
- Station presence, absence, proximity, and value never affect seasonal
  outlook, thermal match, ranking, or report content.

## Failure behavior

Observation loading uses the map's independent settled-request boundary. An
outage changes only the observation toggle/readout, retains the last good
response when available, offers its own retry, and explicitly says modeled
layers still work. Zero qualifying readings is a valid successful response
with a seasonal/QC explanation.

## Visual preservation

The overlay reuses the existing navy, gold, paper type, rounded controls,
compact metadata, shadows, haptics, and map tool stack. It adds no new visual
system and leaves the Match, Temp, Depth, wind, camera, filters, timeline, and
city rail intact.

## Verification

`npm run qa:pier-cast:renovation-pass5` covers Passes 1–5 plus public contract
completeness, source metadata, QC semantics, bounded service-only reads,
anonymous API behavior, Now-only rendering, provenance copy, and ranking/map
failure isolation. The broad foundation and map suites remain separate final
regression gates.
