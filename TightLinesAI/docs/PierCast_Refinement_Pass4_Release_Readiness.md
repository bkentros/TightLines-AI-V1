# PierCast refinement — Pass 4: release readiness

Status: engineering and automated audit complete on the next-build branch. Release remains held for the fresh native-client evidence listed below.

## Hardening completed

- Every renovated catalog, leaderboard, map, report, saved-report, observation,
  and map-foundation response now validates its runtime schema before UI use.
- Species-specific responses must match the requested target. A stale or crossed
  response fails closed instead of displaying another species' conditions.
- Catalog v1 or malformed supported-target data produces an explicit retryable
  incompatibility state instead of a missing-property crash.
- The 121-hour foundation rejects partial wind arrays before they can desynchronize
  temperature and wind.
- Wind particles retain all 173 nodes at the five-lake view, but only buffered
  on-screen nodes are sent through MapLibre at shoreline zoom. Overview updates
  are throttled while detail retains smoother motion.
- Top and bottom map controls now report their rendered size. Camera padding,
  map tools, scale, attribution, and compass use measured insets instead of
  assuming one fixed phone or text size.
- Existing focus, AppState, Reduce Motion, static-arrow, missing-frame, stale
  response, offline-basemap, and retry fallbacks remain intact.

## Automated evidence

- TypeScript no-emit compilation passes.
- The iOS production-style JavaScript/Hermes export bundles successfully with
  the MapLibre route and assets included.
- The unified Pass 1–4 suite covers thermal calibration, seasonal-first ranking,
  report separation, map synchronization, observations, access boundaries,
  runtime contracts, native configuration, and a ten-minute bounded wind-frame
  simulation.
- Expo prebuild configuration resolves the MapLibre 11.4.0 plugin.
- The additive catalog v2 contract is deployed and returns complete supported-
  species rosters for all 32 cities. The conditions, map, foundation, and
  observations routes return their expected current schemas.
- A post-deployment production smoke confirmed the legacy v3 projection still
  returns all 32 ranked cities and complete five-day reports for installed apps.

## Required native evidence

The existing development client cannot load `MLRNCameraModule` because it was
built before MapLibre was added. This is a native-binary boundary, not a Metro
or TypeScript defect. Xcode 15.2 on the current computer cannot build Expo SDK
55, which requires Xcode 26 or newer, and the account's EAS allowance resets
October 1.

After that reset, create one committed-source iOS development build and execute
the Pass 3 visual matrix on a physical phone. Record screenshots and confirm:

- Now/Forecast/Match/Temp/Depth and target changes stay timestamp-synchronized;
- flow and arrow modes, Reduce Motion, background pause, and missing wind work;
- small/standard/large viewport layouts have no control overlap;
- ten minutes of simultaneous flow and forecast playback has no thermal warning,
  crash, runaway memory, or touch lag;
- catalog v2/conditions v4 remain healthy throughout the review.

The additive PierCast backend contract required by the development client is
deployed. No OTA update, native production build, store submission, or current
installed-app behavior change was made.
