# Temp at Depth — Pass 3b Validation Report

Date: 2026-10-04

Branch: `feat/temp-at-depth`

Production changes: none

## Result

The staging map no longer has a floating depth chip. When Temp at depth is
selected, its tile expands an inline five-depth segmented control. The top map
readout has a separate 44 px depth control that opens an anchored five-depth
popover and closes on selection or outside tap.

Both pickers use the same lazy-loading depth switch. A selection recolors the
current forecast hour, leaves the layer sheet open, and does not stop playback.
The selected depth remains in the existing map preferences. Imperial choices
are 10/20/30/40/50 ft and metric choices are 3/6/9/12/15 m.

Depth changes emit only the existing `layer_changed` event. The verified
payloads were `{layer:"temp_depth",depth_ft:50,source:"sheet"}` and
`{layer:"temp_depth",depth_ft:30,source:"readout"}`.

## Impact

1. Live app users (1.14) right now: none.
2. App 1.15 in review / after release: none; no app code or production map page changed.
3. Production systems (R2, Worker, map page, Supabase, workflows on main): none.

## Tests

- Lake-map Node tests: 84 passed, 0 failed
- Job Python tests: 78 passed, 0 failed
- Deno edge-function tests (`--no-check`): 1,529 passed, 0 failed
- TypeScript (`npx tsc --noEmit`): passed, 0 errors
- Page build (`npm run build:page`): passed
- Staging browser QA: six viewports × two open-picker states, all assertions passed

Browser QA also verified that playback advanced while switching to 50 ft, both
pickers showed the metric labels, all picker targets were at least 44 px, and
the readout popover did not intersect the readout, visible tools, alert, or
playback panel at any requested size.

## Staging deploy

- Bucket: `piercast-lake-map-staging`
- Worker URL: `https://piercast-map-gate-staging.finfindr.workers.dev`
- Feature state: `tempDepth=labs`
- Page, feature file, capabilities and depth pointer: authenticated HTTP 200
- Capabilities: `u8`, `rgb16`, `tempDepth`
- Published depths: 10, 20, 30, 40 and 50 ft
- Staging Worker code and binding were unchanged; it continues to serve only the staging bucket.

## Files changed

- `TightLinesAI/web/lake-map/src/engine/tempDepth.js`
- `TightLinesAI/web/lake-map/src/index.html`
- `TightLinesAI/web/lake-map/src/prototype.js`
- `TightLinesAI/web/lake-map/test/engine.test.mjs`
- `TightLinesAI/web/lake-map/test/tempDepth.test.mjs`
- `Claude outputs/temp-at-depth/pass3b/Validation-Report.md`
- `Claude outputs/temp-at-depth/pass3b/screenshots/*.png`

No files under `TightLinesAI/app`, `TightLinesAI/lib`,
`TightLinesAI/components`, `TightLinesAI/supabase`, or `.github/workflows`
changed.

## Screenshots

- `screenshots/320x568-layers-sheet.png`
- `screenshots/320x568-readout-popover.png`
- `screenshots/375x667-layers-sheet.png`
- `screenshots/375x667-readout-popover.png`
- `screenshots/393x852-layers-sheet.png`
- `screenshots/393x852-readout-popover.png`
- `screenshots/440x956-layers-sheet.png`
- `screenshots/440x956-readout-popover.png`
- `screenshots/360x760-layers-sheet.png`
- `screenshots/360x760-readout-popover.png`
- `screenshots/852x393-layers-sheet.png`
- `screenshots/852x393-readout-popover.png`
