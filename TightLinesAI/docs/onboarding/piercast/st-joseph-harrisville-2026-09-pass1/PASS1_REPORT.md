# PierCast St. Joseph–Harrisville Pass 1 report

Reviewed 2026-09-19. This package completes the exact-structure, access, and exhaustive species-inventory pass for St. Joseph, South Haven, Holland, Lexington, and Harrisville. It is research-only: no Formula v3 scores, runtime calibrations, migrations, public visibility changes, deployments, or app builds were created.

## Result

- Five stable IDs and display names are frozen.
- All 19 current catalog species were reviewed for every city: exactly 95 unique decisions.
- Every cell records all 12 months reviewed, alternate names, evidence channels, source references, a disposition, and the next evidence requirement.
- 57 cells are research candidates, 15 are holds, and 23 are excludes.
- Exclude means the reviewed record did not establish the covered pier fishery; it never asserts biological absence.
- Five required out-of-catalog species were reviewed for every city, plus seven additional leads.

## Frozen physical boundaries and access

- St. Joseph: South Pier from Silver Beach and North Pier from Tiscornia are both covered, but separately labeled. The official dashboard filter did not resolve a St. Joseph port label, so no quantitative zero is inferred.
- South Haven: both pierheads are covered; lower Harborwalk seawalls are separate. Black River Park and SHOUT Park platforms were investigated and excluded as upstream River structures.
- Holland: north pier and the state-park channel walkway are covered. The south-pier/Big Red pedestrian route is excluded because the lighthouse commission says there is currently no public walkway and private property surrounds the approaches.
- Lexington: biological research is retained, but the entire marina is closed from September 8, 2026 through May 28, 2027. Breakwater pedestrian/fishing permission is unresolved, so the city cannot be represented as currently accessible.
- Harrisville: 2025 advisory minutes support fishing from unoccupied docks, while harbor rules restrict fishing to designated areas. Dock occupancy, designated zones, off-season access, and both breakwaters require live confirmation.

The authoritative field-level record is [site-boundaries.json](./site-boundaries.json). Access is a separate gate from biological opportunity. Same-day operator signs, barricades, waves, ice, construction, and dock occupancy supersede this research snapshot.

## Quantitative inventory

The preserved Michigan DNR dashboard extraction contains 7,414 monthly Pier/Dock rows. The reduction keeps Catch and Harvest separate and does not convert sums into rates or scores.

| City | Raw rows | Survey span | Candidate | Hold | Exclude |
| --- | ---: | --- | ---: | ---: | ---: |
| St. Joseph | 0 | none-none | 7 | 6 | 6 |
| South Haven | 2,926 | 1992-2022 | 15 | 2 | 2 |
| Holland | 796 | 1992-2020 | 15 | 2 | 2 |
| Lexington | 3,559 | 1992-2022 | 15 | 2 | 2 |
| Harrisville | 133 | 1998-2012 | 5 | 3 | 11 |

St. Joseph's empty result reflects unresolved dashboard naming/filter coverage, not a sampled zero. South Haven and Lexington have long recurring series; Holland has a more intermittent series; Harrisville's dashboard series is sparse and historical, so recent advisory evidence is preserved separately.

## Evidence discipline

- Exact pier/dock rows, port-level roadmaps, stocking, upstream rivers, boats/charters, and neighboring ports remain distinct.
- A sampled zero or absent row outside a real season is not evidence of absence.
- Stocking is a lead, not exact-pier magnitude. Lexington Atlantic salmon is supported by stocking, multiple Pier/Dock years, an agency program page, and exact-harbor occurrence. Harrisville Atlantic stocking remains proposed/unverified; its harbor opportunity is evaluated from harbor/roadmap evidence instead.
- Current and historical evidence were both retained. Winter and shoulder seasons were explicitly reviewed even where the dashboard survey did not sample them.
- Generic labels such as catfish, bass, trout, perch, and whitefish were not silently translated to a catalog species.

## Material Pass 2 uncertainties

1. Resolve St. Joseph's official dashboard port label or original estimate tables; do not manufacture zeros.
2. Allocate multi-structure port rows without assuming equal opportunity at both pierheads.
3. Reconcile Holland's grouped agency inventory and Holland/Port Sheldon roadmap with Holland-only Pier/Dock rows.
4. Quantify Lexington only as biological research while construction access remains gated; obtain post-project DNR surface permission before implementation.
5. Obtain Harrisville's current designated-fishing map, dock/off-season policy, and direct structure allocation for lake trout and walleye.
6. Reopen every one of the 95 cells, including holds and excludes, under Grade A/B numeric-admission rules.

## Completion proof

[validation-report.json](./validation-report.json) passes every required invariant. The deterministic generator was run and then rerun with `--check`. Pass 2 has not begun.
