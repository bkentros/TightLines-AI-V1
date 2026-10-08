# Temp at Depth — Pass 4 Go-Live Preparation

Date: 2026-10-08

Branch: `feat/temp-at-depth`, rebased onto `main` at `bd42b317`

Production changes: none

## Result

The Pass 4 branch is rebased, staged, and ready for an owner-controlled launch.
It keeps the current map Worker caching, ETags, immutable-asset limiter bypass,
signed-pass enforcement, Server-Timing, NOAA NODD surface failover, and
freshness alerts from `main`.

The launch state is explicit `on` or `off`; the former Labs query, local-storage,
and long-press unlock paths were removed. The public layer offers only 10, 20,
30, 40, and 50 ft, retains the inline layer-sheet and readout pickers, uses the
smooth bathymetry/shoreline mask, and displays:

> Modeled by NOAA. Temperatures below the surface are estimates.

Analytics still use only the existing `layer_changed` bridge event with
`depth_ft`; there are no new bridge message types.

## Source and failover verification

The 2026-10-08 12Z audit found complete f120 products for LSOFS, LMHOFS, LEOFS,
and LOOFS in NOAA NODD. Operational THREDDS did not expose a complete horizon.
The NODD native files expose `temp(time, 20 sigma layers, node)`, node-specific
`siglay`/`siglev`, and `h`, but no fixed regular-grid `Depth` axis. Those files
therefore cannot safely use the reviewed fixed-z interpolation without a new
scientific validation pass.

- THREDDS regular-grid source: the reviewed `Depth` slab builds 10–50 ft.
- NODD native source: surface builds normally; depth raises the explicit
  `DepthDataUnavailable` state before any depth upload.
- The surface workflow completes first. The depth job is a separate
  `continue-on-error` job and writes its mutable pointer last.
- If a new surface run has no matching depth run, the client rejects the old
  pointer by surface-run ID and shows the layer disabled as **Unavailable for
  this forecast cycle**. It never displays stale depth data.

The staging depth run exercised this exact degraded path and left the previous
depth pointer unchanged.

## Lake coverage decision

Lake Superior and Lake Ontario remain included. Pass 1 verified that their
LSOFS/LOOFS regular-grid z-level ranges cover the 2–20 m slab required for the
10–50 ft launch product. Pass 3 and shoreline Pass 3b then included both lakes
in the visual/masking matrix. Hiding them would discard validated coverage.
When the only complete source is NODD, the coherent depth product is unavailable
for the whole cycle rather than selectively mixing distributions or lake ages.

## Staging evidence

- Worker: `piercast-map-gate-staging`, version
  `18f1aa2e-bb80-40c5-bff3-27531d1ad796`
- R2 binding: `piercast-lake-map-staging` only
- Page feature: `tempDepth=on`
- Page capabilities: `rgb16`, `u8`, `tempDepth`
- Fresh real surface run: `20261008T12Z-10081639`
- NOAA cycle: `2026-10-08T12:00:00Z`
- Surface build: 598 seconds, 121/121 hours and 100% minimum source and map
  coverage for all four OFS models
- Source distribution: `NOAA_NODD_AWS` for all four models
- Depth pointer: prior `20261002T12Z-10021559`, intentionally rejected because
  it does not match the fresh surface run

Authenticated small-screen checks returned 200 at 320x568 and 393x852. The
fresh map rendered, the layer sheet fit, and Temp at depth was visible but
disabled with the cycle-unavailable label. Request samples retained the current
headers and timing instrumentation:

| Resource | Browser time | Cache behavior |
| --- | ---: | --- |
| `latest.json` | 175–461 ms | 60 s, ETag, rate-limited mutable request |
| run manifest | 63–130 ms | one-year immutable, limiter skipped |
| first temperature frame | 130–145 ms | one-year immutable, limiter skipped |

Screenshots and machine-readable browser results are in `screenshots/` and
`browser-results.json` beside this report.

## Tests

- TypeScript: passed (`npx tsc --noEmit`)
- App Node tests: 182 passed, 0 failed
- Deno Edge tests: 1,544 passed, 0 failed
- Lake-map Python tests: 136 passed, 0 failed
- Lake-map Node tests: 87 passed, 0 failed
- Page build: passed
- Live NODD surface build and staging upload: passed
- Live NODD depth degraded case: passed (intentional exit before upload)

## Prepared production launch (not run)

1. Confirm `main` and this PR head are unchanged and every required check is
   green. Confirm production `features.json` remains `tempDepth=off`.
2. Confirm THREDDS has one coherent complete cycle for all four models. Do not
   enable the feature unless a matching fresh depth pointer can be produced.
3. Back up production `map/`, `map/capabilities.json`, and
   `map/features.json` as a versioned rollback set.
4. Merge the normal PR only after the owner says **launch**.
5. Build and publish the map page first while the production flag stays `off`.
   Verify the existing surface map in live 1.15.
6. Run the normal map data workflow. Verify surface publication succeeds, then
   verify the separate depth job publishes 10–50 ft and its pointer matches the
   current surface run.
7. Deploy the prepared website Terms change with
   `bash TightLinesAI/scripts/deploy-legal-site.sh`, then read back `/terms/`.
8. Set production `tempDepth=on` with the guarded feature tool and read it back.
   Test 10/20/30/40/50 ft, units, playback, both pickers, shoreline masking,
   Superior, Ontario, and `layer_changed` in store app 1.15.
9. Monitor page/map errors, surface freshness, depth completion, and feature
   analytics through the next NOAA cycle.

## Rollback

1. Immediate hide: set production `tempDepth=off` and read it back. This is the
   first action and requires no app release.
2. If the page itself is implicated, restore the backed-up `map/`, capabilities,
   and features objects.
3. If the producer is implicated, revert only the depth workflow/job changes;
   never disable or roll back the surface job.
4. Leave immutable depth objects for lifecycle expiry; do not delete surface
   runs.
5. Reverify live 1.15 surface layers, playback, city-report bridge, freshness,
   and Worker timing headers.

## App impact

- 1.14: no impact; Live Lake Map is not present.
- 1.15 now: no production impact. Staging uses the unchanged 1.15 WebView
  contract. At launch, 1.15 receives the layer from the hosted page with no app
  build; an unavailable NODD-only cycle leaves the surface map working and
  disables only Temp at depth.
