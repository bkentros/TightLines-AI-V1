# PierCast Live Lake Map engine

The map that runs inside the app's web view. MapLibre GL JS draws the base
layers; two custom GPU layers draw the data:

- `src/engine/fieldLayer.js`: distinct color bands with thin edge lines for
  water temperature (2°F / 1°C), waves (1 ft / 0.5 m) and wind speed
  (5 mph, 5 kt, 10 km/h), depth relief, and the species-match window, read
  straight from the frame PNGs and blended between forecast hours per pixel.
- `src/engine/particleLayer.js`: wind streaks advected on the GPU.
- `src/engine/bandLabels.js`: one range label inside each band ("58–60°"),
  placed at the band's most interior point in map coordinates, so labels ride
  along with zoom and pan and only move when the forecast hour changes.

The coastline is a vector land layer drawn above the color field, so it stays
sharp at every zoom. `src/engine/index.js` exposes the API the native screen
uses (`setTime`, `setLayer`, `setSpecies`, `setUnits`, `setOptions`, `setPiers`,
`setSelected`, `setAlerts`, `flyTo`, `fitAll`, `sampleAt`, events `pierTap`,
`mapTap`, `view`).

## Frame format v1 (written by the data job)

| File | Encoding |
| --- | --- |
| `manifest.json` | domain, grid sizes and encodings, frame list with valid times |
| `temp/<hhh>.png` | 8-bit gray, value = round((°F − 30) × 5), 255 = no data, 0.02° grid |
| `wind/<hhh>.png` | RGBA, R = u·2 + 128, G = v·2 + 128 (mph toward east/north), 0.25° grid over its own wider box (`grids.wind.west/north`: −104.4…−63.9°, 30.2…60.2°) |
| `waves/<hhh>.png` | 8-bit gray, value = round(ft × 20), 255 = no data, 0.05° grid |
| `depth.png` | 8-bit gray, value = round(ft ÷ 6), 255 = no data, 0.02° grid |
| `events.json` | cold-water surge / warm-water push events per pier (rule piercast-surge-v1) |

Row 0 is the north edge. Water values are extended a few cells onto land so
the land layer never shows a gap.

`src/engine/signals.js` holds the cold-water surge / warm-water push rule, shared by the
app and the data job. Tests: `npm test`.

`gen/frames.mjs` writes sample frames in this format from a synthetic model.

## Data job (`job/`)

`job/build.py` builds real runs in this format and publishes them to
Cloudflare R2. GitHub Actions runs it every 3 hours
(`.github/workflows/lake-map-data.yml`); it exits early when NOAA has no new
cycle.

| Layer | Source | Notes |
| --- | --- | --- |
| Water temp, depth | NOAA LSOFS, LMHOFS, LEOFS, LOOFS regular-grid files (THREDDS OPeNDAP, surface layer only) | Regridded to 0.02° with triangle interpolation that never bridges land; where two models meet, the better-covered one wins. A late model keeps its older cycle (listed in `manifest.sources.temp`). |
| Waves | NOAA GLWU 2.5 km (NOMADS GRIB filter, `HTSGW` only) | Matched to each hour by valid time. |
| Wind | Open-Meteo `best_match` over the lake area (2,211 locations per run), NOAA GFS 0.25° for the wider map area (NOMADS GRIB filter, 3-hourly steps, ~41 small downloads), blended over 2 cells at the seam | Uses `OPEN_METEO_API_KEY` when set. If GFS is unavailable the lake-area wind is carried outward. |
| Events | `job/events.mjs` → `src/engine/signals.js` | Same rule as the app, for every pier in `job/piers.json` (the live 32-city roster; a test keeps them in sync). |

Bucket layout: `latest.json` (points at the current run, 2-minute cache),
`runs/<runId>/…` (immutable), `static/geo-v1.json`. Only the newest two runs
are kept. The app loads `latest.json`, then `createLakeMap({ dataUrl: <public
URL>/<base> })`.

Local run: `pip install -r job/requirements.txt`, then
`python3 job/build.py --out out` (add `--upload` with the `R2_*` variables set).
Tests: `npm test` and `npm run test:job` (synthetic NOAA, GLWU and Open-Meteo
responses; no network).
`gen/geo.mjs` builds the prototype's vector layers; the production shoreline
comes from OpenStreetMap land polygons.


The `gen/` scripts read the prototype's source geometry (GLATOS shoreline, Natural Earth
lakes, us-atlas borders) from a local folder; phase 3 moves this into the data job.

## Static map layers (`static-build/`, Phase 4)

Built once (rebuild only when the sources change) and served from the bucket's `static/` folder:

- `lakes-v2.pmtiles` (vector, z3–13): `land` = the map area minus the OpenStreetMap
  outlines of the five Great Lakes and Lake St. Clair; `coast` shoreline lines;
  `inland` = rivers, river mouths and harbor lakes next to the shore (OpenStreetMap
  water via OpenFreeMap z12 tiles, z7+); `contours` = NOAA depth lines in feet
  (`ft`, `major`), denser with zoom (100–300 ft steps at z6 down to 10 ft at z10).
- `depth-v1.pmtiles` (Terrarium PNG DEM, z4–10): NOAA NCEI Great Lakes bathymetry,
  metres relative to each lake's datum. Drives depth colors, relief shading and the
  depth readout.

Rebuild: `fetch-sources.sh`, `fetch-lakes.sh`, `fetch-water.sh` (on a Mac, they
download into `sources/`), then `python3 static-build/build_tiles.py` (~20 min,
~3 GB RAM) and `python3 static-build/publish.py`. After a rebuild, bump
`STATIC_REV` in `src/engine/staticLayers.js` so phones skip their cached tiles.

The base map (roads, towns, borders, piers) comes live from OpenFreeMap
(free, no key; attribution shown on the map). The map is held inside the data area
(`maxBounds` = the wind box, which reaches well past the lakes so the map zooms out and pans freely), so wind streaks cover every visible spot; streaks are off on the
Depth layer.

## In the app (Phase 5)

`app/pier-cast-map.tsx` is a full-screen web view of this page, served by the
gatekeeper at `https://map.finfindr.app/map/index.html` (`EXPO_PUBLIC_PIER_CAST_LIVE_MAP_URL`
overrides the host).

### Access (paid members; free accounts get 2 visits)

- The bucket is private (r2.dev public access off). `gate/worker.js` (Cloudflare Worker,
  custom domain map.finfindr.app, R2 binding) serves `map/`, `static/`, `runs/` and
  `latest.json` only to holders of a valid pass; everything else gets a 401 page.
- Passes (`v1.<expiry>.<nonce>.<HMAC-SHA256>`, 2 hours) come from the Supabase function
  `pier-cast-map-access` (POST `{visitId}`): paid accounts always; free accounts for
  their first 2 visits (table `pier_cast_map_visits`, RPC `claim_pier_cast_map_visit`),
  then `403 subscription_required` → the app shows the paywall. A visit is one opening
  of the map screen; retries and renewals reuse its visit id.
- The app opens `…/map/index.html?app=1&t=<pass>`; the Worker turns the pass into an
  HttpOnly cookie so the page's own requests carry it, and the page strips it from the
  address. The app renews it every 90 minutes via `window.PC_RENEW(pass)` → `/_pass?t=`.
- Shared secret: `PIER_CAST_MAP_PASS_SECRET` (Supabase) = `MAP_PASS_SECRET` (Worker);
  `gate/setup.sh` creates it in `.env`, deploys the Worker and sets both.
- Browser test link (24 h): `python3 static-build/test_pass.py`.
- Cost: the Workers free plan covers 100,000 requests a day; a map visit uses roughly
  50–300 (page, frames, tile ranges), so a few hundred visits a day are free. Beyond
  that, Workers Paid is $5/month for 10 million requests.
The contract lives in `lib/pierCastLiveMap.ts` (tests: `scripts/pier-cast-live-map.test.ts`):

- App → page: `window.PC_APP = { units, species, speciesFromRoute, cityId, platform, bridge: 1 }`
  before the page loads; `window.PC_PAUSE(true|false)` while the map is covered or the app
  is in the background.
- Page → app (`ReactNativeWebView.postMessage`, JSON): `ready`, `error`, `back`,
  `haptic`, `openCity {cityId, speciesId}` (opens City Report, which applies the
  free-report limit), `analytics {event, props}` (allow-listed events only).
- The page remembers the viewer's layer, units, species and toggles in its own storage;
  the app's unit setting is only the starting point.

Build and publish the page: `npm run build:page`, copy `dist/index.html`, `dist/app.js`
and the two `maplibre-gl-csp*.js` files to `static-build/proto/`, then
`python3 static-build/publish.py` (uploads them to both `proto/` and `map/`).

The first native map screen is archived in `legacy/pier-cast-map-v1.tsx` (not routed).

## Alerts and observations (Phase 6)

- **Weather Service alerts** (`src/engine/nws.js`): live from api.weather.gov — marine
  alerts for all five lakes + St. Clair / St. Lawrence and lakeshore alerts (beach hazards,
  rip currents, lakeshore flood) for the eight shore states, limited to the Great Lakes
  box. Updates replace what they refer to; cancels and expired alerts drop. Zone shapes are
  fetched once per session. Areas follow the timeline (start → end, 15-minute steps).
- **Buoys** (`gate/buoys.js`): the gatekeeper serves `/obs/buoys.json` from NOAA NDBC
  `latest_obs.txt` + `activestations.xml` (10 min / 1 day cache): Great Lakes stations with
  water temperature or waves, readings ≤ 3 h old, in °F / mph / ft.
- **Banner:** one banner. It leads with an in-view Weather Service warning, then cold-water
  surges, then advisories / statements; "Also: …" names the rest. Dismissed banners return
  only for something new.
- **Alerts sheet:** two tabs. *Water temp* (default): surge / push cards with the pier's
  5-day forecast curve (`runs/<id>/series.json`), 3 per section with "Show more".
  *Weather & safety*: alerts grouped by type, expandable to their areas, each opening a
  detail page (What / Where / When / Impacts / What to do, "Show on map").
- **Surge rule replay** against 2021–2025 buoy seasons: `job/replay/REPLAY.md`.
