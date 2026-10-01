# PierCast refinement — Pass 2: leaderboard and city reports

Status: implemented on the next-build branch. No live deployment is part of this pass.

## Product decisions

- The leaderboard has no universal default winner. A user explicitly chooses one species before cities are compared.
- Ranking remains seasonal band first, then temperature fit orders cities within the same seasonal band. Missing or restricted inputs remain unranked.
- Seasonal outlook is the primary visual signal. `TEMP FIT` is a compact secondary indicator with a colored square and modeled surface temperature.
- `Select Your PierCast` is an independent city-report path. City/state search and state filters work without a leaderboard selection.
- If the current target is supported at the chosen city, the report opens directly. Otherwise, PierCast asks for a target and shows only species supported by that city.
- The city report keeps typical target timing and modeled surface temperature compatibility separate. Temperature fit does not claim fish are present, catchable, or at the surface.
- Local fishery context remains explanatory and never changes rank.

## Contract and state handling

- Conditions catalog schema `piercast-conditions-catalog-v2` adds `supportedSpeciesIds` as a discovery-only roster.
- Retired score fields, score curves, and calibration details remain absent from the conditions catalog.
- City-first target selection is persisted and route-addressable just like leaderboard target selection.
- Request sequence and selected-target guards prevent slow leaderboard responses from opening a report for a stale target.
- Existing v3 compatibility routes remain isolated for installed clients; this pass does not alter or deploy the live app.
- Release sequencing must publish the additive catalog v2 edge contract before or with the new native build. The UI fails safely with an unavailable-target message if an older catalog is encountered.

## Acceptance checks

- Explicit species selection and seasonal-first ordering are still enforced.
- Leader and standing rows show one primary seasonal pill plus a smaller `TEMP FIT` signal.
- Search, state filtering, empty search results, supported-target choice, restricted labels, and direct report opening all have explicit states.
- Report copy identifies water temperature as modeled nearshore surface guidance and distinguishes compatibility from fish presence.
- Existing paper/ink colors, typography, fish art, topographic details, corner marks, shadows, and card construction are retained.
