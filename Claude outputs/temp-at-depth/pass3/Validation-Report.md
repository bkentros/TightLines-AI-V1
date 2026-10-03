# Temp at Depth — Pass 3 Validation Report

Date: 2026-10-03
Branch: `feat/temp-at-depth`
Production changes: none

## Result

The map-page feature is implemented and published only to the isolated staging
bucket. Staging is set to `tempDepth=labs`. The layer exposes 10, 20, 30, 40,
and 50 ft (3, 6, 9, 12, and 15 m), reuses the existing frame/decoder/GPU
pipeline, retains the selected depth, masks shallow water, and uses only the
existing `layer_changed` analytics event with `depth_ft`.

The redundant `job/lake-map-data.workflow.yml` was byte-identical to the root
workflow. It was a historical mirror left behind when the active workflow moved
to `.github/workflows/`; it is removed and the root workflow is documented as
the only source of truth.

## Impact

1. Live app users (1.14) right now: none.
2. App 1.15 in review / after release: none; no app code or production page was changed.
3. Production systems (R2, Worker, map page, Supabase, workflows on main): none.

## Staging resources

- Private bucket: `piercast-lake-map-staging`
- Worker: `piercast-map-gate-staging`
- URL: `https://piercast-map-gate-staging.finfindr.workers.dev`
- Worker version containing the shared pass-verification secret:
  `fd963248-a4dc-41c4-9d33-8e5ce214c739`
- Worker binding: staging R2 bucket only; no custom-domain route and no cron
- Feature flag: `map/features.json` = `{"tempDepth":"labs"}`
- Page: authenticated `GET /map/index.html` = 200
- Capabilities: `rgb16`, `u8`, and feature `tempDepth`
- Depth pointer: run `20261002T12Z-10021559`, depths 10/20/30/40/50 ft,
  3-hour steps, rgb16

The staging Worker now uses the production pass-verification secret so an
app-issued pass is accepted. The secret was installed from `.env` without being
printed. The Worker continues to serve only `piercast-lake-map-staging`.

## Acceptance coverage

- Feature resolution: off, labs locked/unlocked, `?labs=1`, on
- 3-second info-button unlock with `Labs on` / `Labs off`
- Layer selection and remembered depth
- 10, 30, and 50 ft; imperial and metric units
- 1× and 2× playback; depth switch while playing
- Selected-depth-only frame download and isolated buffering store
- rgb16 decode, half-float GPU texture path, temporal blending, band labels,
  smoothing, and the existing fast path
- Shallow-water transparent mask and exact shallow readout
- Pier card while Temp at depth is active
- Superior and Ontario modeled-data note
- Existing `layer_changed` event with `{layer:"temp_depth",depth_ft:30}` and
  snake_case keys
- 320×568 layout; depth chip has no tools or panel collision
- Real Android Chrome against the staging link
- Real iPhone Safari/WebKit simulator against the staging link

The complete scripted browser run reported:

```json
{"ok":true,"initialDepthFrames":0,"selectedDepthFrameRequests":6,"analytics":{"type":"analytics","event":"layer_changed","props":{"layer":"temp_depth","depth_ft":30}},"shallowMaskFound":true,"smallScreen":{"chipTools":false,"crowded":"1"}}
```

## Development-build result

Metro was started with only this process-local override (no `.env` or committed
app change):

```sh
EXPO_PUBLIC_PIER_CAST_LIVE_MAP_URL=https://piercast-map-gate-staging.finfindr.workers.dev \
  npx expo start --dev-client --host localhost --port 8082
```

The available Oct 1 Android development APK connected to Metro and bundled the
current app, but that binary predates the native `react-native-webview` module.
It stops at app startup with `RNCWebViewModule could not be found`, before the
map route can open. A native rebuild was deliberately not made. The owner must
use a current dev build that already contains `react-native-webview`; exact
instructions are in the README and below.

## Owner dev-build instructions

From `TightLinesAI/`, choose a free port and run:

```sh
EXPO_PUBLIC_PIER_CAST_LIVE_MAP_URL=https://piercast-map-gate-staging.finfindr.workers.dev \
  npx expo start --dev-client --host lan --port 8082
```

Open the installed development build and scan Metro's QR code. In PierCast,
open Live Lake Map, press and hold the map `(i)` button for three seconds, and
confirm the `Labs on` toast. Select **Temp at depth**. No native rebuild or
committed configuration change is required when the installed dev binary
already has `react-native-webview`.

For a browser link, from `TightLinesAI/web/lake-map/` run:

```sh
PIER_CAST_LIVE_MAP_URL=https://piercast-map-gate-staging.finfindr.workers.dev \
  .venv/bin/python static-build/test_pass.py
```

Treat the generated signed URL as temporary sensitive data and do not post it.

## Tests

- Lake-map Node tests: 81 passed, 0 failed
- Job Python tests: 78 passed, 0 failed
- Deno edge-function tests (`--no-check`): 1,529 passed, 0 failed
- TypeScript (`npx tsc --noEmit`): passed, 0 errors
- Page build (`npm run build:page`): passed
- Final staging authenticated readback: auth 204; page/features/capabilities/
  pointer all 200

## Files changed

- `TightLinesAI/web/lake-map/README.md`
- `TightLinesAI/web/lake-map/gate/setup-staging.sh`
- `TightLinesAI/web/lake-map/job/lake-map-data.workflow.yml` (removed)
- `TightLinesAI/web/lake-map/job/tests/test_job.py`
- `TightLinesAI/web/lake-map/src/engine/bandLabels.js`
- `TightLinesAI/web/lake-map/src/engine/fieldLayer.js`
- `TightLinesAI/web/lake-map/src/engine/frames.js`
- `TightLinesAI/web/lake-map/src/engine/index.js`
- `TightLinesAI/web/lake-map/src/engine/preferences.js`
- `TightLinesAI/web/lake-map/src/engine/scales.js`
- `TightLinesAI/web/lake-map/src/engine/tempDepth.js` (new)
- `TightLinesAI/web/lake-map/src/index.html`
- `TightLinesAI/web/lake-map/src/prototype.js`
- `TightLinesAI/web/lake-map/static-build/test_pass.py`
- `TightLinesAI/web/lake-map/test/preferences.test.mjs`
- `TightLinesAI/web/lake-map/test/tempDepth.test.mjs` (new)
- `Claude outputs/temp-at-depth/pass3/screenshots/*.png` (successful QA evidence)

No files under `TightLinesAI/app`, `TightLinesAI/lib`, or
`TightLinesAI/components` changed.

## Screenshots

- `android-chrome-staging.png`
- `android-chrome-layer-sheet.png`
- `android-chrome-temp-depth.png`
- `iphone-safari-staging.png`
- `chrome-android-10ft-metric.png`
- `chrome-android-30ft-layer.png`
- `chrome-android-50ft-playing-2x.png`
- `chrome-android-pier-card.png`
- `chrome-android-shallow-mask.png`
- `chrome-android-superior-modeled-note.png`
- `chrome-android-ontario-modeled-note.png`
- `chrome-android-320x568.png`

## Open questions

1. Owner sign-off remains needed from a current dev binary containing
   `react-native-webview`; the available archived dev APK cannot host the map.
2. Pass 4 must perform the required labs check inside the actual store 1.15
   build on both platforms after review approval and the stability wait.

## Exact Pass 4 go-live checklist

Do not begin until app 1.15 is approved and has been stable for at least 48
hours with no crash or analytics anomaly.

1. Confirm the Pass 3 owner dev-build check above and archive the exact tested
   commit and screenshots.
2. Back up the current production `map/` page objects, `capabilities.json`, and
   `features.json` as a versioned rollback set. Verify the rollback set can be
   restored without running the current page publisher.
3. Set production `map/features.json` to `tempDepth=off` **before** publishing
   or merging any page rollout. Read it back and confirm `off`.
4. Open the merge PR, rerun actionlint and all four required suites, review that
   no app/native, Supabase, Worker, CSP, or unrelated workflow changes entered
   the diff, then merge only after explicit owner approval.
5. Publish the new page to production. Keep the flag `off`. In store app 1.15
   on iPhone and Android, verify the current surface experience is unchanged:
   layers, 1×/2× playback, units, pier card, City Report, and existing PostHog
   events. Confirm Temp at depth is absent.
6. The branch already wires the depth job after a successful surface publish,
   gated by capabilities and `continue-on-error`. Outside a NOAA release
   window, watch one complete production cycle: surface publishes on time;
   depth cannot block it; the depth pointer appears afterward; integrity and
   14-day retention are correct. If the original two-PR rollout is preferred,
   split the workflow commit before step 4.
7. Set production `features.json` to `labs`. In the actual store 1.15 build on
   both platforms, hold `(i)` for three seconds and test 10/30/50 ft, 1×/2×,
   switching while playing, metric units, masking, pier card, background/
   foreground, and Superior/Ontario notes. Run this labs soak for 2–3 days.
8. Review the validation criteria and error/latency/memory telemetry. Deploy
   the approved website Terms line; leave the in-app Terms catch-up for 1.16.
9. Set production `features.json` to `on`. Read it back. Monitor PostHog
   `layer_changed` where `layer=temp_depth`, `depth_ft`, map errors, page load,
   surface freshness, depth completion time, and the health email through the
   next NOAA cycles.
10. Only after the monitoring window succeeds, close the rollout. Do not add
    the tap chart or Find my temp in Pass 4.

### Rollback

1. Immediate user rollback: set production `features.json` to
   `tempDepth=off` with the explicit production guard and read it back. This
   restores the surface-only UI without an app release.
2. If page behavior is suspect, restore the prelaunch `map/` page,
   `capabilities.json`, and `features.json` rollback set. Removing `tempDepth`
   from capabilities makes future depth jobs exit before NOAA downloads.
3. If workflow behavior is suspect, revert only the depth-job workflow change
   on `main`; do **not** disable the whole lake-map workflow, because it also
   publishes surface data.
4. Leave immutable depth objects to the 14-day retention rule unless a separate
   reviewed cleanup is necessary. Do not touch surface runs.
5. Verify store 1.15 on both platforms is back to the unchanged surface map,
   surface publication/freshness is healthy, and error rates returned to
   baseline. Production Worker, CSP, Supabase, and app binaries require no
   rollback because Pass 4 does not change them.
