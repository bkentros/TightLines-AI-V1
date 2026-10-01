# PierCast Renovation — Pass 6 Implementation

Pass 6 completes the application and API cutover from the retired combined
numeric score presentation to the species-specific conditions product. It does
not rewrite historical score snapshots or saved claim envelopes, and it keeps
the old HTTP reads functioning for already-installed clients.

## Production cutover

The shipping PierCast route is now a compact conditions-only screen. The old
score-era leaderboard, city report, gauges, mini-bars, review state, helper
code, and styles were removed from the route instead of being left hidden in
the bundle. The shared temperature chart now consumes the v4 modeled-point
contract directly and no longer exports score components.

Both the leaderboard and map now load `GET conditions/catalog`. Its versioned
response contains disclosure and operational city metadata only; it omits the
retired rating name, `/10` format, formula copy, and city species scoring
configuration. `GET catalog` remains available solely for compatibility and
owner/research tooling.

The How It Works guide now describes choosing a target, the independently
visible seasonal outlook and temperature match, the city conditions report,
and the Now/Forecast map. It no longer promises a universal 1–10 pier rating.

## Compatibility and migration safety

The four score-era public reads remain live for supported older binaries:

- `GET leaderboard`
- `GET temperature-map`
- `GET report`
- `GET saved-report`

Those responses now carry `Deprecation: true`, identify
`score-v3-compatibility`, and point to `conditions-v4`. The custom headers are
CORS-exposed. Each legacy read emits a structured
`pier_cast_legacy_api_used` event with route, replacement contract, and time;
telemetry failure is deliberately swallowed so it can never break an old
client.

Historical score snapshots and old claim envelopes are untouched. The v4
saved-report reader still adapts only complete source evidence and otherwise
returns the explicit archived-refresh path.

## UI hardening

- Loading now uses a conditions-shaped paper-dashboard skeleton with no score
  placeholder.
- Nearby ports, pier coverage, access warnings, and coverage requests were
  retained in small dedicated components with the existing colors, type,
  borders, shadows, haptics, corner marks, and topographic texture.
- Pier and heading copy use `flex: 1` plus `minWidth: 0` so long names wrap
  rather than widening the page.
- Missing, stale, restricted, saved-copy, paywall, closed-access, and empty
  roster states remain explicit.
- Rapid target changes are request-sequenced; an older leaderboard response
  cannot overwrite the user's latest species choice.
- Account changes, city changes, silent refresh, saved fallback, route-opened
  reports, and return-to-map behavior retain their isolation boundaries.

## Visual matrix

`PierCast_Renovation_Pass6_Visual_Matrix.json` freezes the final review matrix:
small/standard/large iPhones, default and enlarged text, every report data
state, all map layers and time modes, overview/shoreline zoom, wind and
observation toggles, and the no-clipping/no-fabrication approval rules.

The deterministic UI and map contracts cover the entire matrix. A true native
screenshot approval could not be honestly completed on this machine:

1. the configured iOS 17.2 runtime was restored and a fresh iPhone 15
   simulator was created successfully;
2. the installed Xcode 15.2 cannot build the React Native 0.83 native project;
3. the only prior simulator artifact had expired;
4. a fresh EAS simulator build was rejected because the account's monthly iOS
   build quota is exhausted until October 1, 2026; and
5. Expo Go installed, but Metro was restricted to IPv6 loopback, while opening
   a LAN development source surface was not authorized.

The current iOS JavaScript/Hermes bundle did compile successfully through
`expo export` (2,020 modules). No screenshot is labeled approved. Native
capture remains a release-evidence action once a compatible simulator binary
or newer local Xcode is available; it does not require product-code changes.

## Verification

- `npm run qa:pier-cast:renovation-pass6`: 76 Node tests and 35 Deno tests,
  all passing.
- `npm run qa:pier-cast:foundation`: 256 Deno tests plus 11 Node
  foundation/structure tests, all passing.
- `npm run qa:pier-cast:map`: 21 tests, all passing.
- `npx tsc --noEmit`: passing.
- `npx expo export --platform ios`: passing; production bundle generated.
- `git diff --check`: passing.

The Pass 6 suite covers the previous five passes, the clean shipping cutover,
the conditions catalog, compatibility headers and telemetry, current/legacy
route separation, release copy, target-request race protection, complete
visual matrix inventory, map modes, access/long-copy states, artwork, API
access boundaries, observation isolation, and saved-report migration.

No Edge Function, database migration, or store build was deployed by this
pass. Deployment remains a separate release action.
