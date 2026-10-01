# PierCast Renovation — Pass 4 Implementation

Pass 4 converts the Great Lakes visual map from legacy score markers to the
v4 conditions model while preserving the existing five-lake raster, wind,
depth, camera, filter, and visual systems.

## Time modes

### Now

- Uses the closest exact hour shared by the NOAA raster foundation and every
  visible city conditions timeline.
- Hides forecast scrub and playback controls.
- Keeps wind aligned to the same valid hour.
- Is labeled `Now · Modeled`; the continuous map is never called live.

### Forecast

- Starts at the current model frame and excludes older model-cycle frames.
- Exposes hourly scrub, previous/next, and playback controls.
- Keeps temperature raster, city conditions, and wind on one exact timestamp.
- Adjusts the horizon label when the current time consumes part of the
  original 121-hour model cycle.

## Layers

### Match

- Requires an explicitly selected species.
- Marker center shows modeled degrees Fahrenheit.
- Marker fill shows the named temperature-match band.
- Detail labels show the selected species plus seasonal band/stage separately.
- Missing, unsupported, or restricted frames remain gray/unavailable.
- No leaderboard rank or combined score appears on the map.

Tapping Match without a target opens an in-place species selector. Selecting a
target does not move or reset the camera and persists the selection shared by
the leaderboard and report.

### Temp

- Requires no species.
- Retains the smooth NOAA surface raster and shared fixed 32–78°F gradient.
- City markers show exact modeled degrees and use raw temperature colors.
- It displays no seasonal rank or fishing score.

The default map layer is Temp when no target is available.

### Depth

- Retains the five NOAA bathymetry rasters and zoom-responsive contours.
- City markers identify pier cities without temperature-match or rank claims.
- The not-for-navigation limitation remains visible.

### Wind

- Remains an optional overlay in every layer.
- Uses the exact active Now/Forecast hour.
- Retains wind speed, gust, direction, shoreline setup, and caution details.

## Versioned map projection

The new anonymous endpoint is:

`GET conditions/map[?speciesId=…]`

Without a species it returns the complete modeled city timelines and target
catalog but no fishing interpretation. With a species it evaluates seasonal
outlook, regulation/eligibility, and thermal match for every city at every
coherent model hour. This prevents the client from guessing a future thermal
band or reusing the present-hour result across the forecast.

The response is versioned by the existing v4 conditions schema and includes:

- selected species or explicit Match-selection requirement;
- target species catalog;
- city identity, coordinates, lake, basin, and timezone;
- complete modeled temperature timeline;
- selected-species condition frames; and
- model provenance and disclosure.

## Failure boundaries

- Catalog failure still blocks the map because city identity cannot be trusted.
- Map-foundation failure remains isolated with retry/stale-state behavior.
- Conditions-marker failure does not remove raw temperature, depth, or wind.
  The map falls back to Temp, explains that raw layers still work, and offers
  retry.
- An older in-flight target response cannot overwrite a newer selection.
- Only exact synchronized timestamps are joined. Missing timestamps render
  unavailable rather than borrowing a nearby frame.

## Visual preservation

Pass 4 retains the navy map shell, compact paper tabs, state rail, condition
panel, fish/temperature color language, smooth raster transitions, wind
arrows, camera persistence, zoom controls, tactile feedback, and dedicated
map/report back stack. The new Now/Forecast and Match/Temp/Depth controls use
the existing chip and tab geometry.

## Pass 5 boundary

Observed station readings remain intentionally separate. Pass 5 owns the
GLOS/Seagull station endpoint, cache, quality filtering, provenance, and
Now-only point overlay. Pass 4 does not interpolate sparse observations or
label the modeled lake surface as measured/live water.

## Verification

`npm run qa:pier-cast:renovation-pass4` covers all earlier renovation
invariants plus:

- targetless raw map behavior;
- 121-hour server-side species evaluation;
- exact timestamp joins;
- Now frame selection and future-only Forecast frames;
- absence of legacy score markers;
- target prompt/camera continuity;
- synchronized temperature and wind rendering; and
- anonymous optional-species API behavior.

The existing five-lake map suite separately verifies NOAA raster construction,
bathymetry, wind grid/arrows, shoreline wind interpretation, filters, camera
bounds, temperature scaling, and report navigation.
