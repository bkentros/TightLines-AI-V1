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
`setSelected`, `setAlerts`, `setAnimating`, `ready`, `flyTo`, `fitAll`, `sampleAt`, events `pierTap`,
`mapTap`, `view`).

## Frame format v1 (written by the data job)

| File | Encoding |
| --- | --- |
| `manifest.json` | domain, grid sizes and encodings, frame list with valid times |
| `temp/<hhh>.png` | `u8`: 8-bit gray, value = round((°F − 30) × 5) (0.2 °F steps), 255 = no data. `rgb16` (`grids.temp.encoding`): RGB, value = R × 256 + G = round((°F − 30) × 20) (0.05 °F steps), 65535 = no data. NOAA-matched 0.01° grid |
| `wind/<hhh>.png` | RGBA, R = u·2 + 128, G = v·2 + 128 (mph toward east/north), 0.25° grid over its own wider box (`grids.wind.west/north`: −104.4…−63.9°, 30.2…60.2°) |
| `waves/<hhh>.png` | 8-bit gray, value = round(ft × 20), 255 = no data, 0.05° grid |
| `depth.png` | 8-bit gray, value = round(ft ÷ 6), 255 = no data, 0.01° grid |
| `events.json` | cold-water surge / warm-water push events per pier (rule piercast-surge-v1) |

Row 0 is the north edge. Water values are extended a few cells onto land so
the land layer never shows a gap.

`src/engine/signals.js` holds the cold-water surge / warm-water push rule, shared by the
app and the data job. Tests: `npm test`.

`gen/frames.mjs` writes sample frames in this format from a synthetic model.

## Data job (`job/`)

`job/build.py` builds real runs in this format and publishes them to
Cloudflare R2. GitHub Actions polls every 15 minutes during NOAA's four daily
release windows (`.github/workflows/lake-map-data.yml`); it exits before paid
APIs when a complete new cycle is unavailable.

`scheduler/` is the independent Cloudflare Cron trigger for that same workflow.
It uses the two polling-window cron expressions from the workflow and sends a
`workflow_dispatch` on `main` with `force=false`; GitHub's native schedule stays
enabled as a backup. The existing workflow concurrency group serializes duplicate
triggers, and the data job's cycle gate makes the second run a no-op. The Worker
has no route or workers.dev endpoint. Its `GITHUB_ACTIONS_TOKEN` secret must be a
GitHub App installation token (preferred) or fine-grained personal access token
limited to `bkentros/TightLines-AI-V1` with repository Actions read/write only
(plus GitHub's implicit metadata read permission). Deploy from `scheduler/` with
`npx --yes wrangler@4 deploy`, then store the credential without echoing it using
`npx --yes wrangler@4 secret put GITHUB_ACTIONS_TOKEN`.

| Layer | Source | Notes |
| --- | --- | --- |
| Water temp, depth | NOAA LSOFS, LMHOFS, LEOFS, LOOFS (CO-OPS THREDDS primary; official AWS/NODD native fields failover; surface layer only) | The primary 0.01° regular grid is preserved. During a THREDDS distribution outage, range reads select the equivalent surface layer from NOAA's independent NODD publication and regrid it to the same map grid. Publication still requires all four models on one cycle, all 121 hours, at least 98% finite source coverage and 97% post-regrid lake-domain coverage every hour. Any failure retains the previous complete run. |
| Live water observations | NOAA NDBC, NOAA CO-OPS, NOAA GLERL ReCON and the GLOS Seagull bulk latest feed | Collected centrally every 15 minutes and merged by physical station. CO-OPS supplies current six-minute Great Lakes readings (including Toledo when absent from NDBC); GLERL supplies the Muskegon Channel Pier feed. Flagged values and temperatures outside 32–90 °F are rejected. Explicit sensor depths and vertical profiles are preserved. These validate the surface model but are not blindly smeared across unsampled water. |
| Waves | NOAA GLWU 2.5 km (NOMADS GRIB filter, `HTSGW` only) | Matched to each hour by valid time. |
| Wind | Open-Meteo `best_match` over the lake area (2,211 locations per run), NOAA GFS 0.25° for the wider map area (NOMADS GRIB filter, 3-hourly steps, ~41 small downloads), blended over 2 cells at the seam | Production upload requires `OPEN_METEO_API_KEY`. The four-runs/day, 31-day ceiling projects to 274,164 of the configured 1,000,000 monthly calls and the job refuses a future grid that exceeds it. If GFS is unavailable the lake-area wind is carried outward. |
| Events | `job/events.mjs` → `src/engine/signals.js` | Same rule as the app, for every pier in `job/piers.json` (the live 32-city roster; a test keeps them in sync). |

Bucket layout: `latest.json` (points at the current run, 60-second revalidating cache),
`runs/<runId>/…` (immutable), `runs/piercast/latest.json` (60-second
revalidating pointer to the current run's 32-city, 121-hour surface point
feed), and `static/geo-v1.json`. The point feed is extracted from the successful
LMHOFS surface build at the exact reviewed `lmhofs.ts` row/column and records
whether the coherent run used THREDDS or NODD. A bucket lifecycle expires
objects under `runs/` after 14 days while leaving `map/` untouched. The app loads
`latest.json`, then `createLakeMap({ dataUrl: <public
URL>/<base> })`.

The workflow polls every 15 minutes during NOAA's four daily Great Lakes model
release windows. It publishes once only after all four lake systems have the
same complete cycle; it never mixes cycles or lets `--force` bypass integrity
checks. An open map checks `latest.json` every
10 minutes and reloads only when a new run is published. A Cloudflare scheduled
collector refreshes NOAA NDBC, NOAA CO-OPS, NOAA GLERL and GLOS observations every 15 minutes,
writes one central pointer, and retains an immutable dated snapshot in R2. Map opens
therefore do not multiply upstream sensor traffic. The sources are merged and
deduplicated; flagged CO-OPS values, suspect/failed GLOS QARTOD readings, implausible
values and readings older than three hours are excluded. GLOS depth profiles remain attached
to each station instead of being mislabeled as surface temperatures. Readings
older than 90 minutes are visually dimmed and the card shows their exact age,
sensor depth and difference from the modeled surface. If the central archive is
more than 30 minutes old, the endpoint fails visibly instead of serving it or
turning user traffic into repeated upstream-source requests.

The checked-in GLOS metadata catalog is intentionally refreshed through a
reviewed two-step process. The generator validates response type and size,
schema, identifiers, text, coordinates, depths and expected catalog scale, then
emits inert JSON-backed JavaScript to stdout; it never writes network data into
the repository. Generate a candidate with
`npm run refresh:glos-catalog > /tmp/piercast-glos-catalog.js`, run
`node --check /tmp/piercast-glos-catalog.js`, inspect the diff against
`gate/glos-catalog.js`, and only then replace the checked-in file.

Local run: `pip install -r job/requirements.txt`, then
`python3 job/build.py --out out` (add `--upload` with the `R2_*` variables set).
Tests: `npm test` and `npm run test:job` (synthetic NOAA, GLWU and Open-Meteo
responses; no network).
`gen/geo.mjs` builds the prototype's vector layers; the production shoreline
comes from OpenStreetMap land polygons.

### Temp at depth data (feature branch / staging)

`job/depth.py` is a separate, non-blocking producer that starts only after a
surface publish. It reads the immutable surface pointer and selects one source
for all four lake models: THREDDS regular-grid z levels when that distribution
is complete and readable, otherwise the validated NODD native sigma fields.
NODD layer centres are converted with `-siglay * (h + zeta)` and bounded by
their `siglev` cell interfaces; values are never extended above the surface or
below the instantaneous lakebed. The job interpolates 10, 20, 30, 40 and 50 ft
every three forecast hours onto the same output grid and shoreline/bathymetry
mask, and writes `runs/tdepth-<surface-run>-<source>/…`. The source suffix keeps
forced staging proofs immutable instead of overwriting one distribution with
the other. The deeper reviewed
depths (75/100/150 ft) remain available in config but are not published. Each
depth has its own FrameStore-compatible manifest; `runs/tdepth/latest.json` is
written only after every frame, manifest, verification sidecar and timing file.
A failed depth run therefore cannot change either surface data or the previous
complete depth pointer.

Automatic NODD use is allow-listed per model in `job/lakemap/ofs.py` and is
backed by the two-cycle comparison tool `job/validate_depth_sources.py`.
Validation covers f000/f024/f072/f120 on the production grid and requires every
lake/depth combination to meet MAE ≤ 1.0 °F, p95 absolute difference ≤ 2.0 °F,
and mean bias within ±0.5 °F. `--source thredds|nodd` is staging-only; production
refuses a forced distribution. If neither one coherent source nor all required
validated models are available, the previous depth pointer remains unchanged
and the client shows **Unavailable for this forecast cycle** for a new surface
run.

The isolated staging resources are `piercast-lake-map-staging` and
`https://piercast-map-gate-staging.finfindr.workers.dev`. The staging Worker has
no custom-domain route or observation cron. For owner dev-build testing it uses
the same pass-verification secret as production, while its only R2 binding remains
the staging bucket, so an app-issued pass cannot reach production through staging.
`gate/wrangler.staging.toml`, `gate/setup-staging.sh`,
`gate/create-staging-r2-credentials.py`, `job/copy_run_to_staging.py`, and
`static-build/feature.py` are the staging setup tools. Staging depth objects
under `runs/tdepth-` expire after 14 days.

The active and only workflow definition is `.github/workflows/lake-map-data.yml`.
The former copies under `job/` were bootstrap artifacts from when tooling could
not write `.github`; nothing executes or consumes them, and they were removed so
workflow definitions cannot drift.

## Live Lake Map operations

### Production data flow and source selection

The independent `finfindr-lake-map-scheduler` Cloudflare Cron Worker dispatches
`lake-map-data.yml` with `force=false` every 15 minutes during each NOAA polling
window. The matching GitHub `schedule` expressions remain enabled as a backup;
the workflow concurrency group and at-most-once cycle gate safely collapse
duplicate triggers. Discovery remains free and publication requires LSOFS,
LMHOFS, LEOFS and LOOFS to share one complete newest cycle.

For a publish, the job chooses one source for the whole cycle, builds and
validates every immutable surface object, and writes `latest.json` last. Only
after that succeeds does the depth job build 10/20/30/40/50-ft frames from the
same cycle/source and write `runs/tdepth/latest.json` last. A failed build keeps
the previous pointers; partial or mixed-source runs are never published.

THREDDS requests are capped at three in flight. Transient errors use bounded
adaptive exponential backoff, slow further for 503/504, and honor
`Retry-After`; a confirmed 404 is not repeatedly retried. Health is persisted
at `state/thredds-health.json`. A THREDDS build failure opens the circuit, so the
next new cycle starts with validated NODD and runs only a cheap THREDDS probe.
Two consecutive healthy cycle probes close the circuit for the following
cycle. Logs state the chosen source and reason.

### Delivery, monitoring and rollback

The scheduled publish path installs only runtime dependencies and runs the
builder's candidate-data gates: common complete NOAA cycle across all four
models, complete 0–120-hour fields, finite-value/coverage sanity, coherent
single-source output, and pointer-last delivery verification. Repository
hygiene, unit and workflow-policy tests never block the scheduler before data
discovery. They run in the required `lake-map-tests` PR check whenever a PR
touches `web/lake-map/`, any GitHub workflow, Dependabot policy, or the
scheduler/alerts Workers.

Every matching push to `main` also runs `lake-map-dry-run-canary`: a full build
against the latest complete NOAA cycle with no `--upload`, R2 write, or pointer
write. A failure immediately calls the alerts Worker with `PIPELINE BROKEN`;
two consecutive executed production-workflow failures open the transition-only
`PIPELINE FAILING` incident, including job, step and first error line, and the
next successful execution sends recovery.

GitHub Actions updates are one weekly Dependabot group labeled `pipeline` and
are never auto-merged. Before merging one, require the full PR suite and
manually dispatch `Lake map CI` on that branch to prove the no-upload canary.
Do not merge unattended overnight pipeline changes, and make one production
pipeline change at a time.

`finfindr-lake-map-alerts` runs independently of GitHub every 30 minutes. It
reads the authenticated public surface, depth and feature URLs, stores incident
state at `state/lake-map-alerts.json`, and sends transition-only email from
`support@finfindr.app` to `brandonkentros@icloud.com` through Resend. Alerts are
surface cycle age over 9 hours, a depth/surface mismatch across two consecutive
surface cycles while Temp at depth is on, and a failed or timed-out public
delivery job after a publish. Recovery mail clears each incident. A weekly
summary is sent Monday morning (09:00-12:00 US Eastern check window).

Temp at depth is controlled by `map/features.json`, independently of the app
release. For a depth-only production problem, rollback first and read back the
flag; do not modify the surface pointer or delete runs:

```sh
cd TightLinesAI/web/lake-map
.venv/bin/python static-build/feature.py tempDepth off --allow-production
```

R2 lifecycle policy expires immutable objects under `runs/` after 14 days and
keeps the existing seven-day incomplete-multipart abort rule. It does not match
`map/`, the root surface pointer, state, or validation data. The mutable depth
pointer is under `runs/` but is rewritten every cycle; verify it and both current
pointer targets are younger than 14 days before changing the rule. Content-addressed
run objects are immutable; `latest.json` and `runs/tdepth/latest.json` use a
60-second revalidating policy, bypass the Worker edge cache, and never cache
404s.

### Credentials and renewal

Secret values never belong in Git, logs or documentation. Local operator
credentials live in `TightLinesAI/.env` (git-ignored): `R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
`OPEN_METEO_API_KEY`, `GITHUB_ACTIONS_TOKEN`, `RESEND_API_KEY`, and
`PIER_CAST_MAP_PASS_SECRET`. Install Worker copies only with
`wrangler secret put`: the scheduler uses `GITHUB_ACTIONS_TOKEN`; alerts use
`GITHUB_ACTIONS_TOKEN`, `RESEND_API_KEY`, `PIER_CAST_MAP_PASS_SECRET`, and
`ALERT_TEST_TOKEN`, plus `PIPELINE_ALERT_TOKEN` shared only with the repository
Actions secret; the gate uses `MAP_PASS_SECRET` corresponding to
`PIER_CAST_MAP_PASS_SECRET`.

Renewal record (audited 2026-10-14): GitHub's repository API does not expose the
fine-grained `GITHUB_ACTIONS_TOKEN` expiry. Check and record its expiry in the
owner account, renew at least 14 days beforehand, and re-audit by 2026-11-01.
The sending-only Resend key exposes no provider expiry; rotate
`RESEND_API_KEY` by 2027-10-14 or immediately after suspected exposure.

For owner testing, set staging `map/features.json` to `on` with
`R2_BUCKET=piercast-lake-map-staging .venv/bin/python static-build/feature.py
tempDepth on`. The launch has no Labs or hidden-device unlock path; production
rollback is the same command with `off`. Browser testers can generate a signed staging link without
printing any stored secret by running:

```sh
PIER_CAST_LIVE_MAP_URL=https://piercast-map-gate-staging.finfindr.workers.dev \
  .venv/bin/python static-build/test_pass.py
```

To open the staging map from an already-installed development build, start a
one-off Metro session from `TightLinesAI/` (use any free port):

```sh
EXPO_PUBLIC_PIER_CAST_LIVE_MAP_URL=https://piercast-map-gate-staging.finfindr.workers.dev \
  npx expo start --dev-client --host lan --port 8082
```

Scan Metro's QR code from the development build. This does not modify `.env` or
committed app code. The binary must already contain `react-native-webview`; an
`RNCWebViewModule could not be found` error means the installed dev binary is
older than the live-map native dependency.


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
`STATIC_REV` in `src/engine/staticLayers.js` and rebuild the page first: phones keep
tiles for good under the current revision, so `publish.py` refuses to upload a
changed `.pmtiles` while `STATIC_REV` is unchanged.

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
- Passes (`v1.<expiry>.<anonymous-account-key>.<HMAC-SHA256>`, 2 hours) come from the Supabase function
  `pier-cast-map-access` (POST `{visitId}`): paid accounts always; free accounts for
  their first 2 visits (table `pier_cast_map_visits`, RPC `claim_pier_cast_map_visit`),
  then `403 subscription_required` → the app shows the paywall. A visit is one opening
  of the map screen; retries and renewals reuse its visit id for up to 6 hours. Pass
  minting is capped at 20 per account per 10 minutes, so a captured visit id cannot be
  replayed indefinitely and one account cannot churn tickets.
- The app opens `…/map/index.html?app=1&t=<pass>`; the Worker turns the pass into an
  HttpOnly cookie so the page's own requests carry it, and the page strips it from the
  address. The app renews it every 90 minutes via `window.PC_RENEW(pass)` → `/_pass?t=`.
- Shared secret: `PIER_CAST_MAP_PASS_SECRET` (Supabase) = `MAP_PASS_SECRET` (Worker);
  `gate/setup.sh` creates it in `.env`, deploys the Worker and sets both.
- Browser test link (24 h): `python3 static-build/test_pass.py`.
- Cost: the Workers free plan covers 100,000 requests a day; a map visit uses roughly
  50–300 (page, frames, tile ranges), so a few hundred visits a day are free. Beyond
  that, Workers Paid is $5/month for 10 million requests. Before upgrading, enable and
  verify the zone's WAF rate-limit rule and billing alerts because Paid removes the Free
  plan's hard daily request ceiling.
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

**Frame encodings and rollout.** After uploading the page, `publish.py` writes `map/capabilities.json` (`{"frameEncodings": [...]}`, from `FRAME_ENCODINGS` in `src/engine/frames.js`). Before each run the data job reads it and publishes 0.05 °F `rgb16` temperature frames only once the live page lists `rgb16`; until then it keeps the 8-bit format (`--temp-encoding u8|rgb16` overrides). Publish the page first; the next data run switches format by itself. The page reads both.

### Caching and the Cloudflare request budget

Every file the page loads goes through the gatekeeper Worker, and each one counts
as a Worker request (free plan: 100,000 a day; Workers Paid, $5/month: 10 million a
month, then $0.30 per million). The Worker caps traffic at 600 requests/IP/minute and
400 requests/account/minute; PMTiles requests must be a single range no larger than
8 MiB. To keep R2 operations low:

- **Map tiles** (`static/*.pmtiles`, read in byte ranges) are kept on the phone in
  Cache Storage (`StoredSource` in `staticLayers.js`), because iOS doesn't keep range
  downloads in its web cache. They are served with a one-year cache too. The store is
  named after `STATIC_REV`; a new revision starts a fresh store and deletes the old.
- **Page scripts** (`app.js`, the MapLibre files) carry a content hash (`?v=…`, added
  by `build.mjs`) and a one-year cache, so only `index.html` is fetched on each open.
- **Forecast runs** (`runs/<id>/…`) never change once written and are cached for a year.
- **Cloudflare edge cache:** after a pass is validated, non-range objects are cached
  without the pass or cookie in the cache key. The response remains private to the
  browser, while repeat requests avoid another R2 Class B read. The two mutable
  forecast pointers bypass edge Cache API and retain a 60-second browser
  revalidation policy; pointer 404s are never cached.
- **Always fetched:** `index.html` (fresh pass); `latest.json` on open and every
  10 minutes; `/obs/buoys.json` on open and every 5 minutes while the map is open.
  The latter reads the shared 15-minute R2 snapshot and is edge-cached for five
  minutes; upstream sensor requests occur once per scheduled collection, not per user or edge.

After a surface and depth publish, the workflow checks both production pointer
URLs for the new run for up to two minutes, samples multiple Cloudflare POPs when
the runner can reach them, and fails visibly if content or cache policy stays stale.

### Forecast playback

- **Clock:** 3 forecast hours per second at 1×, with a 0.5× / 1× / 1.5× / 2× picker
  (the chip next to Play; remembered with the other map preferences). The rate is the
  same at every zoom. Before each step the page asks `lm.ready(t)`; if the next hour
  is not decoded and on the GPU yet, the clock waits (a ring on Play after 250 ms)
  instead of running ahead of the picture, and gives up waiting after 8 s.
- **Decoding:** PNG frames are fetched and decoded in a background Blob worker
  (OffscreenCanvas; the CSP already allows `blob:` workers) that also packs the
  GPU (value, validity) pairs, so the main thread never stalls on a new hour.
  WebViews without OffscreenCanvas fall back to the `<img>` path automatically.
- **Look-ahead:** `setAnimating(true, hoursPerSecond)` widens the shared decode window
  to ~1.5 s of play (max 12 hours ahead) and the color field uploads one upcoming
  hour per frame in `prerender`, so crossing an hour never waits on a texture upload.
  A released hour that is still on screen keeps its texture until the new one is
  ready, so jumps and drags never flash empty water.
- **Smooth motion:** each pixel moves through the hours on a Catmull-Rom curve using the
  hours on either side, clamped to the two current hours so it never invents a value
  (`blendHours` in `frames.js`; the shader's `hours()` is the same formula, so pier pills
  and the readout match the picture). Straight blending only at the ends of the run.
- **GPU memory:** the color field keeps textures only from 2 hours behind to 4 ahead of
  the playhead and uploads one upcoming hour per frame; 16-bit frames are RG16F half
  floats centered on 56 °F (error under 0.01 °F).
- **New forecasts:** the open map checks `latest.json` every 5 minutes. A new run is
  applied silently while the map is covered, backgrounded or hidden; while it is being
  viewed, an "Updated forecast ready" pill offers it. Either way the page reloads into the
  new run at the same center, zoom, clock time (or "Now") and selected pier.
- **Temperature smoothing (display):** NOAA's field carries grid-scale texture (and 8-bit
  frames carry 0.2 °F steps), which broke band edges in flat pools into islands and holes.
  The decoder threads run a front-preserving (bilateral) filter on temperature: wiggles
  under ~0.4 °F across ~1.5 cells are smoothed, real breaks (upwelling, plumes) stay sharp
  (`smoothedTemperature`, `TEMP_SMOOTHING` in `frames.js`). The store then serves the
  smoothed field as `grids.temp` (0.01 °F steps; the file's own grid is kept as
  `grids.tempSource`), so colors, labels, pier pills and the readout all agree. Decoding
  runs on 2–3 background threads. `?smooth=0` shows the unsmoothed field for comparison.
- **Labels:** band labels fade out while the forecast moves (play or drag) and fade
  back in, placed for the new hour, when it stops.
- **Band edges:** stored values come in fixed steps (0.2 °F, 0.05 ft), so whole
  patches of water can sit exactly on a band edge. Every band decision (shader,
  labels, pier pills) uses `bandIndex` (`BAND_EPS` nudge) and edge lines are only
  drawn where the field actually changes across a pixel; otherwise those patches
  render as dark blocks.

Dynamic frames are decoded into compact buffers (one byte per temperature,
wave or depth pixel; RGBA only for wind). Playback retains seven frames around
the selected time and deletes old WebGL textures. The 0.01° production benchmark
on 2026-10-01 completed in 296 seconds: 121 temperature frames totaled 12.77 MiB
(108 KiB average, 112 KiB maximum), the full immutable run was 16.03 MiB, and
the bounded temperature working set was about 8.9 MiB each for CPU pixels and
GPU R8 textures instead of retaining roughly 614 MiB of decoded RGBA frames.

Measured locally in a browser through the gatekeeper: an active first open (pan to four
harbors, zoom to 12.5, play the forecast, switch every layer) is about 80 requests.
A repeat open on the same phone is a handful, plus the new forecast frames
(about 25) once per six-hour NOAA model cycle.

The first native map screen is archived in `legacy/pier-cast-map-v1.tsx` (not routed).

## Alerts and observations (Phase 6)

- **Weather Service alerts** (`src/engine/nws.js`): live from api.weather.gov — marine
  alerts for all five lakes + St. Clair / St. Lawrence and lakeshore alerts (beach hazards,
  rip currents, lakeshore flood) for the eight shore states, limited to the Great Lakes
  box. Updates replace what they refer to; cancels and expired alerts drop. Zone shapes are
  fetched once per session. Areas follow the timeline (start → end, 15-minute steps).
- **Buoys and fixed sensors** (`gate/buoys.js`): the gatekeeper serves `/obs/buoys.json`
  from NOAA NDBC `latest_obs.txt` + `activestations.xml`, NOAA CO-OPS latest
  water-temperature products, NOAA GLERL ReCON temperature CSVs, and GLOS
  Seagull's bulk latest feed: Great Lakes
  stations with water temperature or waves, readings ≤ 3 h old, in °F / mph / ft.
  Duplicate physical stations are merged. A displayed reading is not automatically
  calibration evidence: only QARTOD-good explicit surface or ≤3 m readings enter the
  strict verification group; provider-QC/unknown-depth and QARTOD-not-evaluated values
  remain separately labeled context.
- **Banner:** one banner. It leads with an in-view Weather Service warning, then cold-water
  surges, then advisories / statements; "Also: …" names the rest. Dismissing it suppresses
  banners for the rest of that map session while every item remains in the Alerts tool.
- **Alerts sheet:** two tabs. *Water temp* (default): surge / push cards with the pier's
  5-day forecast curve (`runs/<id>/series.json`), 3 per section with "Show more".
  *Weather & safety*: alerts grouped by type, expandable to their areas, each opening a
  detail page (What / Where / When / Impacts / What to do, "Show on map").
- **Surge rule replay** against 2021–2025 buoy seasons: `job/replay/REPLAY.md`.

## Prospective temperature verification

Every published model run contains `verification.json`: the unmodified, as-issued
121-hour surface forecast sampled at eligible reviewed GLOS and NOAA CO-OPS
locations that have nearby valid model water, the same frozen series at all 32
PierCast piers, its actual publication time and model inputs. Immediately after
the live pointer changes, production runs capture GLOS Seagull's documented
model-summary API at each pier under a separate immutable validation key for a
contextual prospective comparison. That API returns a marine-zone summary while
PierCast uses a pier point, so it is never labeled an apples-to-apples superiority
test, never feeds the live forecast, and can never delay fresh map publication.
The 15-minute Worker cron retains public observation evidence under
`observations/v1/YYYY/MM/DD/…`; it never deletes snapshots. The daily
`lake-map-validation.yml` workflow joins a completed UTC day of observations to
every forecast that was actually issued up to five days earlier, deduplicates
unchanged readings, keeps only one nearest reading per run/sensor/depth/hour,
and publishes private versioned evidence plus daily, monthly and all-time R2
scorecards under `validation/`.

Reports keep strict and contextual evidence separate and calculate bias, MAE,
RMSE, median/P90/maximum absolute error and within-1/2/3 °C rates. Model-cycle
skill and the post-publication forecast users could actually see are separate.
The post-publication score is compared with a no-lookahead same-sensor persistence
baseline, while the captured Seagull context is paired to the exact same
observation and timestamp with strict and contextual scoreboards kept separate.
Breakdowns cover horizon, lake, source, depth, thermal
regime, season, station and pier. Pipeline gaps fail the scheduled workflow;
30-day-versus-prior-30-day degradation is flagged after minimum coverage.
Collection does not change the displayed field. A correction remains explicitly unapproved until
the predeclared coverage, season, error and independent-holdout requirements in
`docs/PierCast_Temperature_Representation_and_Calibration.md` are met and reviewed.
The storage layout, alert thresholds and monthly review procedure are in
`docs/PierCast_Live_Map_Long_Term_Validation.md`.
