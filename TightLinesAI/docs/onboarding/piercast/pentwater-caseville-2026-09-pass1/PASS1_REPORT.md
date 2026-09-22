# PierCast Pentwater–Caseville Pass 1 report

Review date: 2026-09-21

## Outcome

Pass 1 is complete for Pentwater, Rogers City, Tawas City, Charlevoix, and Caseville. The package contains 90 user-facing research decisions (52 candidates, 10 holds, 28 exclusions) plus five fixed bluegill product-policy exclusions. No scores, runtime configuration, migration, deployment, build, public roster, or public-release manifest was changed.

The report is about city fishing conditions around covered public structures. It is not a statement that every named pier is currently fishable. Access and biological evidence remain independent, and live signs, barriers, weather, ice, vessel operations, and local authorities control.

## Quantitative coverage

The preserved DNR Pier/Dock extract contains 3,248 rows: Pentwater 1,004, Rogers City 106, Charlevoix 2,138, and explicit zero-result queries for Tawas, Tawas–East Tawas, and Caseville. A missing dashboard row is not treated as zero. Catch and harvest estimates remain separate and were not converted into scores.

The full-history DNR stocking CSV was filtered reproducibly to 4,602 rows in the five target counties. All 90 user-facing city/species cells plus five pink-salmon reviews have a complete-history result and 5-, 10-, and 20-year windows; every reviewed positive record is classified as exact, connected-water, neighboring-port, or regional.

## Salmonid conclusions

- Pentwater: Atlantic salmon — exclude; Chinook salmon — research_candidate; Coho salmon — research_candidate; Steelhead / rainbow trout — research_candidate; Brown trout — research_candidate; Lake trout — research_candidate.
- Rogers City: Atlantic salmon — research_candidate; Chinook salmon — research_candidate; Coho salmon — hold; Steelhead / rainbow trout — research_candidate; Brown trout — research_candidate; Lake trout — research_candidate.
- Tawas City: Atlantic salmon — research_candidate; Chinook salmon — hold; Coho salmon — research_candidate; Steelhead / rainbow trout — research_candidate; Brown trout — hold; Lake trout — research_candidate.
- Charlevoix: Atlantic salmon — hold; Chinook salmon — research_candidate; Coho salmon — hold; Steelhead / rainbow trout — research_candidate; Brown trout — research_candidate; Lake trout — research_candidate.
- Caseville: Atlantic salmon — exclude; Chinook salmon — hold; Coho salmon — research_candidate; Steelhead / rainbow trout — hold; Brown trout — hold; Lake trout — research_candidate.

Pink salmon remains out of catalog for all five cities. Rogers City has a current offshore/port lead but no user-facing species contract or exact recurring breakwall basis; the other four reviews remain preserved negative or unresolved leads.

## Highest-value findings

- Rogers City Atlantic salmon is a research candidate: direct DNR breakwall guidance, historical Pier/Dock positives, and 2026 advisory minutes establish a credible local fishery even though Atlantic salmon are not stocked there.
- Tawas lake whitefish and burbot have exact wall/state-dock evidence. The dashboard's lack of Tawas rows did not erase these late-fall/winter opportunities.
- Charlevoix cisco/lake herring is the strongest out-of-catalog lead: recurring 2014-2022 Pier/Dock data and exact-pier reports warrant a later full product-contract decision.
- Caseville coho remains a Pass 2 candidate because an agency report records an exact pier catch, while its sparse evidence prevents any score now.
- Historical stocking materially changed the queue: Tawas Chinook/brown trout, Charlevoix Atlantic/coho, and Caseville steelhead/brown/Chinook remain holds or exclusions pending exact-structure recurrence; none was promoted from stocking alone.

## Bluegill policy

Five compatibility records exist solely as fixed product-policy exclusions. Bluegill is not a candidate, hold, score, seasonal mode, ranking input, serialized report species, or client-visible target. Biological bluegill mentions in source data do not override the product rule. A read-only system audit also found four legacy calibrated pairs that the current public v3 projection does not explicitly filter; this is a mandatory integration/release blocker. Pass 1 did not alter or deploy that runtime because this pass is prohibited from changing public visibility.

## Access boundary

- Pentwater: Charles Mears State Park accessible fishing pier [covered]; Pentwater north navigation pier [covered]; Pentwater south navigation pier [covered].
- Rogers City: Rogers City outer breakwall ending at Harbor Channel Light 8 [covered]; Rogers City outer breakwall ending at Harbor Channel Light 9 [covered]; Rogers City marina basin designated fishing areas [covered_conditionally].
- Tawas City: Gateway Park fishing pier [covered]; Gateway Park Tawas River-edge walkway/boardwalk [not_separately_admitted_from_gateway_pier]; Shoreline Park L-shaped fishing pier [covered].
- Charlevoix: Bridge Park and Pine River Channel fishing walkway [covered]; Charlevoix municipal marina designated fishing areas [covered_conditionally]; Charlevoix south navigation pier and lighthouse [covered]; Charlevoix north navigation pier [access_hold_separate_from_south_pier].
- Caseville: Pointe Park boardwalk and breakwall fishing pier [covered]; Caseville municipal harbor designated fishing areas [access_hold_separate_from_pointe_park].

## Stocked species still held or excluded

- Rogers City / Coho salmon: hold; Current management and weekly reports show recurring Rogers City coho, but reviewed evidence is mostly boat/offshore and no positive Pier/Dock row resolved. Stocking review found 15 target-county records (1983-1985), including connected-water relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Rogers City / Largemouth bass: exclude; All 5 target-county stocking records (1979-2020) are classified regional-only and do not establish the target-city structure fishery. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Tawas City / Chinook salmon: hold; Historical exact-city stocking and current mixed Tawas-area occurrence create a lead, but the agency's current Tawas City/Bay inventory omits Chinook and exact-pier recurrence is unresolved. Stocking review found 114 target-county records (1979-2011), including exact, neighboring-port relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Tawas City / Brown trout: hold; Substantial historical Tawas Bay/Tawas Point stocking exists, but it ended in the reviewed exact area and current exact-pier recurrence is unresolved. Stocking review found 156 target-county records (1979-2026), including connected-water, exact, neighboring-port relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Tawas City / Channel catfish: exclude; All 7 target-county stocking records (1997-2016) are classified regional-only and do not establish the target-city structure fishery. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Charlevoix / Coho salmon: hold; Recent Medusa Creek stocking creates a local Lake Michigan pathway, but no positive Charlevoix Pier/Dock coho row or exact-channel recurrence was resolved. Stocking review found 4 target-county records (2017-2023), including connected-water relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Charlevoix / Atlantic salmon: hold; A 1986 Lake Charlevoix stocking and occasional modern offshore reports create a historical/local lead, not an exact-pier fishery. Stocking review found 1 target-county records (1986-1986), including connected-water relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Caseville / Chinook salmon: hold; Historical and recent stocking exists at neighboring Huron County ports, but no exact Caseville/Pointe Park catch record was resolved. Stocking review found 114 target-county records (1979-2011), including neighboring-port relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Caseville / Steelhead / rainbow trout: hold; Rainbow trout were stocked at the exact connected Pigeon River/Caseville site through 2022, but exact Pointe Park recurrence remains unresolved. Stocking review found 248 target-county records (1980-2026), including exact, neighboring-port relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Caseville / Brown trout: hold; Historical brown trout stocking at Pigeon River/Caseville ended in 1999; no current exact-pier recurrence was established. Stocking review found 157 target-county records (1982-2011), including exact, neighboring-port relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.
- Caseville / Northern pike: hold; Stocking review found 5 target-county records (1993-1997), including neighboring-port relationships; stocking remains occurrence-pathway evidence only. Stocking was treated only as an occurrence pathway; exact-port follow-up is recorded in the decision and salmonid matrix.

## Boundary for Pass 2

Pass 2 may quantify only research candidates after reopening all 90 cells, resolving holds, comparing same-species anchors, and preserving all mode/geography distinctions. Raw estimate totals and stocking counts are not scores.
