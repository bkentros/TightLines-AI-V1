# PierCast refinement — Passes 1–4 audit

Audited: 2026-09-28  
Scope: next-build branch only  
Decision: code-complete; hold release pending fresh-native-client evidence

## Pass 1 — thermal calibration

- All 18 product species use versioned Great Lakes-relevant response curves.
- Shared label thresholds are inclusive and tested; valid extremes become Poor,
  while invalid or out-of-domain model values stay unavailable.
- Every profile has evidence references, a complete optimum plateau, monotonic
  shoulders, and all four labels. The retired v3 calibration fingerprint remains
  isolated for installed-client compatibility.
- Seasonal Outlook and modeled surface Temperature Match remain independent.

## Pass 2 — leaderboard and city reports

- There is no default universal winner. A user chooses one species, and only
  comparable cities for that species enter the leaderboard.
- Ranking is Typical Seasonal Outlook band first, then exact Temperature Match
  within that band. The compact right-side `TEMP FIT` treatment is secondary.
- `Select Your PierCast` remains a city-first search path and offers only that
  city's supported species when the current target is unavailable.
- Reports separate typical timing, surface-temperature compatibility, local
  context, and weather; none claim fish presence or catch probability.
- Async target/report guards reject stale requests. Pass 4 adds runtime catalog
  v2 and selected-species validation for malformed or out-of-order responses.

## Pass 3 — premium map

- Now uses the closest coherent model hour; Forecast scrubs the synchronized
  raster, city temperatures, Match colors, wind frame, and timestamp.
- Match target is persistent across leaderboard, report, and map. Changing it
  preserves camera, zoom, forecast hour, filters, and display state.
- Animated flow shows wind travel direction from exact-hour values. Static
  arrows, Reduce Motion, background/unfocused pause, and missing-frame fallbacks
  are preserved.
- Observed stations are point readings shown only in Now and never affect city
  colors or rankings. Depth remains static context and not for navigation.

## Pass 4 — hardening and release audit

- Runtime schema and identity checks now protect every renovated endpoint.
- Partial 121-hour wind payloads fail closed; shoreline wind rendering culls
  off-screen nodes and remains allocation-bounded in a ten-minute simulation.
- Measured top/bottom control insets protect camera content and native map tools
  across supported viewport and text-size changes.
- Type checking, native configuration resolution, iOS bundling, and the unified
  regression suite are release gates. Android bundling and final suite results
  are recorded in the Pass 4 evidence artifact.

## Unresolved external release gates

- A fresh MapLibre-capable development client must be built after the EAS quota
  reset, because the installed binary lacks `MLRNCameraModule`.
- Physical-device screenshots, Reduce Motion behavior, frame smoothness, memory,
  and thermal observations cannot be truthfully certified without that binary.
- The additive catalog v2/conditions v4 backend cutover must precede or accompany
  the new store build. Legacy v3 stays available for installed clients.

No production deployment, OTA update, store submission, or live-app change was
made during Passes 1–4.
