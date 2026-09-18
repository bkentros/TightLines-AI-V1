# Michigan all-scored-species calibration audit

Completed September 18, 2026.

## Answer

No additional confidence-based score suppression was found in the current Michigan Formula v3 roster. All **72 scored Michigan city/species pairs** were re-audited and retained. This audit made **zero numerical changes**.

The earlier 17-city audit covered the six requested common species. This follow-up expands Michigan coverage to every currently scored species and also verifies that every unscored Michigan catalog cell has an explicit prior decision.

## Complete coverage

| Measure | Result |
|---|---:|
| Michigan cities | 7 |
| Catalog species | 19 |
| City × species cells | 133 |
| Numeric pairs audited | 72 |
| Numeric pairs retained | 72 |
| Numeric pairs revised | 0 |
| Additional confidence penalties found | 0 |
| Explicit no-score cells | 61 |
| Evidence holds | 7 |
| Exclusions | 54 |

Cities covered: Ludington, Grand Haven, Manistee, Frankfort–Elberta, Harbor Beach, Oscoda and Port Sanilac.

The 72 numeric pairs comprise 34 Grade A, 37 Grade B and one mixed A/B calibration. Grade B is never used as a score multiplier. The audit traced every peak through one of four calibration lineages:

| Lineage | Pairs | Finding |
|---|---:|---|
| Original salmonid core | 16 | Retained; direct multi-year Michigan DNR port/month Pier/Dock estimates, matched all-species effort and repeated local reports determine magnitude. |
| Secondary-species calibration | 18 | Retained; port-level Pier/Dock recurrence and catch per 1,000 all-species hours determine cross-port magnitude. Missing directed effort remains a limitation only. |
| Lake Huron expansion | 14 | Retained; repeated exact-city pier, catwalk and breakwall reports plus explicit words such as `good`, `some`, `few`, `occasional` and `slow` constrain the ordinal magnitude. |
| Later species expansion | 24 | Retained; western-port quantitative extracts or official Lake Huron port and exact-structure evidence determine magnitude without a confidence factor. |

Forty-two pairs have direct quantitative or matched Pier/Dock magnitude evidence. Thirty use official exact-city or port qualitative evidence because no comparable public effort series exists for those Lake Huron fisheries. Those 30 are more uncertain at decimal-level precision, but their confidence grade did not reduce their value.

## Why the lower Michigan values remain

Lower numbers were retained only where fishery evidence supports an ordinary or limited pier opportunity:

- Western Lake Michigan lake-trout peaks of 3.6–4.0 follow low modern Pier/Dock catch rates, few positive strata and separation from offshore lake-trout abundance.
- Oscoda freshwater drum at 3.9 follows repeated exact-pier occurrence with low qualitative magnitude. Grand Haven remains 7.2 because its direct series contains 18,252 estimated Pier/Dock drum over 246,982 matched all-species hours and 43 of 57 positive strata.
- Port Sanilac steelhead at 4.5 follows recurring exact-breakwall occurrence described as occasional or a few, while Oscoda reaches 7.4 through repeated stronger spring reports.
- Harbor Beach Atlantic salmon at 5.2 and steelhead at 5.6 are ordinary-band port opportunities. The DNR roadmap and shore/breakwall evidence establish real targetability, while no direct record supports placing them with Oscoda Atlantic salmon at 8.4 or the western Lake Michigan steelhead reference class.
- Burbot, whitefish, white bass and the lower pike/walleye rows use their documented port opportunity and explicit qualitative magnitude. They were not reduced because effort denominators are absent.

These are evidence constraints rather than confidence discounts. A stronger city or seasonal event was not inferred from stocking, regional reputation, river catches, charter catch or offshore abundance.

## No-score cells

The 61 no-score cells were checked against the final core matrix, Lake Huron candidate matrix and four-species global disposition matrix. Seven remain evidence holds and 54 remain exclusions. A no-score cell is not assigned an artificially low number. It can be reopened when repeated species-specific city-pier evidence establishes targetability, seasonal shape and relative magnitude.

Examples include Harbor Beach Chinook and brown trout, Oscoda brown trout and lake whitefish, and species that have regional or boat presence without a recurring public-pier record. The complete disposition and rationale for every cell is preserved in `full-roster-decision-audit.csv`.

## Scale result

The Michigan scale spans 3.6 to the hard maximum of 10.0. It contains credible excellent and reference-class peaks:

- Manistee steelhead 10.0
- Frankfort–Elberta steelhead 9.8 and Chinook 9.7
- Manistee Chinook 9.5
- Grand Haven steelhead 9.2 and coho 8.8
- Oscoda Atlantic salmon 8.4
- Ludington Chinook 8.3 and Manistee brown trout/coho 8.2

The complete within-species order is in `michigan-species-rankings.csv`. The ordering is internally consistent with the current absolute Formula v3 bands and with the broader 17-city common-species audit.

## Suppression test

The audit found no confidence coefficient, evidence-grade multiplier or blanket city penalty in any of the four Michigan calibration paths. Strengths are explicit evidence judgments. Seasonal width is represented in `A`; temperature is represented in `T`; confidence stays in the grade and limitations.

Some historical notes use words such as `bounded` or `conservative`. This audit interprets those terms only as product-boundary restrictions: no transfer from boat, offshore, river or neighboring-port fishing. They do not authorize a numerical reduction for missing data. Future work must follow the repository-wide [calibration and research standard](../CALIBRATION_AND_RESEARCH_STANDARD.md).

## Artifacts

- `scored-pair-audit.csv`: every scored Michigan pair, peak, grade, lineage, evidence class and suppression decision.
- `full-roster-decision-audit.csv`: all 133 city/species cells with numeric, hold or exclusion treatment.
- `michigan-species-rankings.csv`: all 72 numeric pairs ranked within species.
- `audit-summary.json`: deterministic counts and hard-bound result.
- `generate-audit.ts`: repeatable coverage and bound checks.

Primary evidence remains the Michigan DNR Great Lakes creel estimate dashboard, Michigan DNR Lake Michigan and Lake Huron port roadmaps, and dated Michigan DNR weekly fishing reports. The exact evidence IDs, URLs, permitted uses and limitations remain in the originating source ledgers.
