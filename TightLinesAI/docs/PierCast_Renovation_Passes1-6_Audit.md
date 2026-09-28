# PierCast Renovation — Passes 1–6 Final Audit

Audit date: **2026-09-28**
Audit result: **Code-complete with no known automated or static defects**
Release status: **Not deployed; native visual approval remains scheduled for October 1**

## Audit method

The audit re-read the frozen Pass 1 product contract and every Pass 2–6
implementation record, then traced the shipping leaderboard, report, map,
observations, saved-report migration, entitlement, compatibility, and ingest
paths. It also searched the current consumer bundle for retired score reads and
copy, reviewed asynchronous request ownership, and reran the independent
renovation, foundation, map, type, bundle, and whitespace gates.

## Requirements reconciliation

| Pass | Intended result | Audited result |
|---|---|---|
| 1 | Freeze the independent seasonal/thermal product, ranking rules, migration rules, golden cases, and visual language. | Complete. Contract, fixtures, thresholds, ordering, saved-report rules, and visual baseline remain versioned and executable. |
| 2 | Add the scalable regional seasonal engine, thermal engine, v4 APIs, reports, saved migration, and shadow comparison without breaking v3. | Complete. All 32 cities, 254 configured pairs, 65 regional profiles, 18 thermal profiles, daily/leap/year seams, regulation gates, and legacy adaptation are covered. |
| 3 | Cut the consumer leaderboard and report to species-specific conditions while preserving entitlements and UI language. | Complete. There is no universal ranking or numeric score in the shipping route; target, unavailable, restricted, saved, paywall, access, and switching paths are explicit. |
| 4 | Convert the five-lake map to Now/Forecast and Match/Temp/Depth with synchronized wind and exact frames. | Complete. Match requires a target, raw layers remain species-free, forecast frames are exact, and camera/back-stack behavior is retained. |
| 5 | Add a separately cached, QC-gated, Now-only observed station layer that never affects model products or ranking. | Complete. Three audited stations preserve identity, provenance, depth/QC/freshness, independent failure, and point-versus-surface disclosure. |
| 6 | Remove retired score presentation from the current app, retain observable compatibility routes, harden states, and finish release gates. | Complete in code. Current consumers use only conditions routes; old reads remain isolated and deprecated; compatibility telemetry cannot break responses. |

## Defects found and corrected during this audit

1. The new conditions catalog inherited the retired opportunity-rating
   disclosure. It now returns the v4 seasonal/thermal disclosure.
2. The How It Works card still described the original five-city footprint and
   used ambiguous `live observations` wording. It now states the current
   32-city Michigan/Huron footprint and says observed station readings.
3. Restricted or incomplete map frames could inherit a colored Match marker
   from raw temperature. Match color now requires a complete, eligible,
   rankable frame; otherwise the marker is neutral and explicitly unavailable
   or restricted.
4. Browse/nearby-port paths could try to open a city where the selected species
   is not configured. Unsupported rows are now disabled, nearby ports are
   target-compatible, and report requests validate the active leaderboard.
5. A background leaderboard refresh could overwrite a newer target response.
   All refresh and selection requests now share one sequence guard and verify
   the captured target before committing.
6. A late city-report response could commit after the user changed species.
   Report and saved-fallback commits now verify account, city, and captured
   species.
7. Returning from a city report after changing target could restore the map's
   old route species. Route targets are applied once per actual route change;
   later focuses restore the shared preference, and map-condition requests are
   sequenced against stale responses.
8. A legacy stored `bluegill` preference was accepted even though bluegill is
   intentionally outside the current 18-species v4 roster. It is now treated
   as no selection, allowing the user to choose a supported target.
9. Long city/report headings received additional shrink/wrap protection.

Regression assertions were added for the corrected score-free disclosure,
release copy, unsupported targets, restricted Match colors, request races,
map target restoration, and obsolete preferences.

## Final verification

- `npm run qa:pier-cast:renovation-pass6`: **76 Node + 35 Deno passed**.
- `npm run qa:pier-cast:foundation`: **11 Node + 256 Deno passed**.
- `npm run qa:pier-cast:map`: **21 Node passed**.
- `npx tsc --noEmit`: **passed**.
- `npx expo export --platform ios`: **passed**, 2,020 modules bundled.
- `git diff --check`: **passed**.

## Remaining release actions

These are not missing product implementation:

1. Apply `20260927120000_publish_pier_cast_observed_temperature_map.sql`.
2. Deploy `pier-cast-ingest`, then `pier-cast`, before shipping the app binary.
3. Smoke the deployed anonymous conditions/catalog, leaderboard, map, and
   observations reads plus authenticated report/saved-report reads.
4. Capture the frozen native visual matrix on or after October 1 when a
   compatible simulator build is available. No screenshot is currently marked
   approved.
5. Monitor `pier_cast_legacy_api_used` before eventually retiring old client
   compatibility routes.

The current repository is ready for those release actions. No deployment or
production mutation was performed by this audit.
