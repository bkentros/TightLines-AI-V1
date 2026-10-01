# Pass 3 report: Pentwater through Caseville

Status: **live for all users** on 2026-09-22. The five cities are part of the complete 32-city public Formula v3 roster.

## Implemented contract

The batch adds five typed city profiles, 15 researched structure records, 36 numeric pairs, 52 non-stacking seasonal modes, 26 Grade C holds, 28 Grade D exclusions, and five explicit bluegill policy exclusions. Twelve structures are admitted as covered rows; three unresolved surfaces remain outside Piers Covered. Access language is structure-level and does not convert a biological city report into a recommendation to fish a particular structure.

Numeric roster:

- Pentwater (Lake Michigan): Chinook salmon, coho salmon, steelhead, brown trout, walleye, smallmouth bass, freshwater drum, and yellow perch.
- Rogers City (Lake Huron): Chinook salmon, steelhead, brown trout, lake trout, walleye, smallmouth bass, and Atlantic salmon.
- Tawas City (Lake Huron): coho salmon, steelhead, lake trout, walleye, smallmouth bass, yellow perch, lake whitefish, northern pike, and burbot.
- Charlevoix (Lake Michigan): Chinook salmon, steelhead, lake trout, walleye, smallmouth bass, freshwater drum, and yellow perch.
- Caseville (Saginaw Bay; parent Great Lake: Lake Huron): coho salmon, steelhead, lake trout, walleye, and smallmouth bass. The salmonid scores are conservative city-condition calibrations and do not claim repeated catches from a specific pier.

Bluegill remains present only as an internal policy exclusion in each city profile. It has no runtime pair, no seasonal mode, no report row, and no serialized catalog row. The V12 runtime manifest contains 254 pairs, 451 modes, and 1,270 five-date forecast rows.

## Source and forecast implementation

A dedicated `piercast-pentwater-caseville-shadow-v1` cohort now owns ingestion, archive validation, coherent-source selection, and the five-city fail-closed path. Each city requires 121 unique hourly samples from the same fresh issue. The complete owner aggregation requires 32 cities and 3,872 samples from all seven source cohorts.

The official NOAA LMHOFS regular-grid product was independently queried. All five configured cells had `mask=1`, finite positive bathymetry, depth index 0, and a complete live 121-hour timeline from the same 2026-09-21 12:00 UTC issue:

| City | Row, column | Cell | Bathymetry | Structure-distance range |
| --- | --- | --- | ---: | ---: |
| Pentwater | 218, 161 | 43.78, -86.45 | 6.438 m | 501–603 m |
| Rogers City | 382, 426 | 45.42, -83.80 | 3.247 m | 789–1,337 m |
| Tawas City | 267, 456 | 44.27, -83.50 | 3.254 m | 1,499–1,588 m |
| Charlevoix | 372, 278 | 45.32, -85.28 | 13.465 m | 863–1,727 m |
| Caseville | 235, 478 | 43.95, -83.28 | 1.729 m | 819–990 m |

The model cells are general city-water context, not pier thermometers. The runtime explicitly calls out Tawas Bay and Saginaw Bay shallowness, Caseville’s Pigeon River/harbor effects, Charlevoix’s Pine River/Round Lake/open-lake transition, Pentwater channel exchange, protected harbor water, depth, waves, ice, and access.

The generated migration is ordered after V10, preserves historical accepted config/forecast-count versions, freezes the exact V11 city/cell/pair manifests, and adds service-only commit/read RPCs. New-cohort ingestion is scheduled at minute 52, six minutes before V3 aggregation at minute 58. Existing required cohorts resolve to minutes 35, 45, 50, 54, 54, and 55; none shares the aggregate minute.

## Acceptance result

The deterministic owner fixture contains five cities, 25 dates, and 180 species/date rows. Every admitted pair appears on all five dates; primary species are valid; scores remain in 1–10. The all-city lake-trout audit has 32 decisions. The mandatory salmonid audit and stocking-to-runtime reconciliation each cover all 30 city/species cells and preserve numeric, hold, and exclusion states.

Client contracts now resolve Pentwater and Charlevoix to Lake Michigan, Rogers City and Tawas City to Lake Huron, and Caseville to Saginaw Bay with Lake Huron parentage. All 32 owner cities have an explicit water-body assignment, standings retain neutral “Great Lakes” wording, structure labels remain full-width, and unresolved structures do not enter the covered-pier list.

The V12 forward-only Caseville species migration was applied, and both PierCast Edge Functions were deployed. Seven production source cohorts supplied one coherent 2026-09-22 00Z issue with 32 cities and 3,872 samples. Run `e004d672-95ae-410a-aff1-96da4b8274a7` committed all 1,270 forecast rows. The model and public projection both return 32 ranked cities.

The first V11 ledger attempt exposed three copied V10 guards that still expected 1,110 rows. PostgreSQL rolled the call back atomically. A separately generated forward-only migration corrected those guards to 1,255 before the successful run, preserving the already-applied migration history.

Authenticated production smoke verified normal-user administrative-route denial, four free lifetime reports, fifth-report paywall, saved refresh, all 32 paid public reports, and leaderboard redaction. Pentwater, Rogers City, Tawas City, Charlevoix, and Caseville are available through the same catalog and report flow as every other city.

## Local verification

- The dedicated Pass 3 suite passed 76 tests with no failures, including config/review/migration drift checks and Deno type checks.
- The complete PierCast foundation suite passed 240 tests with no failures.
- The Formula v3 compatibility suite passed 53 tests with no failures; its original 222-pair/403-mode Pass 2 artifacts are SHA-256 locked rather than reinterpreted under V11.
- The repository TypeScript program passed `tsc --noEmit --allowImportingTsExtensions`, which enables the Deno-style `.ts` imports used by the PierCast engine.
- `git diff --check` passed.
