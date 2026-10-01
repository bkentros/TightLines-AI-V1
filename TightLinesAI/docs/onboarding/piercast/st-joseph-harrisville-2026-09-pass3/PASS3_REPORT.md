# PierCast St. Joseph–Harrisville onboarding — Pass 3 completion report

**Cities:** St. Joseph, South Haven, Holland, Lexington, and Harrisville, Michigan

**Completed:** 2026-09-20

**Status:** complete private owner review; all five cities remain nonpublic

## Result

Pass 3 implements the complete private contract: stable city IDs, exact structures and access warnings, 95 explicit catalog-species dispositions, 49 numeric Formula v3 pairs, 81 seasonal modes, thermal curves, regulation handling, five independently validated NOAA cells, a separate 605-sample archive cohort, coherent six-cohort selection, generated migration/RPC support, owner catalog and reports, deterministic fixtures, and production verification.

The resulting owner model contains **27 cities, 222 city/species pairs, 403 modes, 3,267 hourly source samples, and 1,110 five-day forecast rows**. The new cities contribute **49 pairs, 81 modes, 605 source samples, and 245 report rows**. The remaining new-city decisions stay explicit and unscored: **20 research holds** and **26 exclusions**.

Bluegill is not user facing. All five bluegill cells are Grade D product-policy exclusions with no score, mode, report row, or ranking.

## City results

| City | Numeric pairs | Five-day rows | Access boundary |
| --- | ---: | ---: | --- |
| St. Joseph | 7 | 35 | South and north pier approaches remain separate; published rules are not live access guarantees. |
| South Haven | 13 | 65 | Covered pier, channel, and fishing-platform segments preserve their individual rules. |
| Holland | 10 | 50 | North pier/channel access is separate from the route-unverified south-pier area. |
| Lexington | 14 | 70 | All covered harbor structures are reported closed; reports explicitly describe biology, not a place to fish now. |
| Harrisville | 5 | 25 | Designated docks and breakwater/harbor-edge routes remain unverified and require posted-access checks. |

Every admitted pair appears on all five applicable dates. Scores remain within 1–10, modes do not stack, regulation closures are unavailable, and access status is kept independent of biological opportunity.

## Species due diligence

The all-city lake-trout audit contains 27 explicit decisions. For the new cities, St. Joseph, South Haven, Holland, and Lexington have conservative private numeric calibrations; Harrisville remains a research hold because broader boat-fishery strength was not allocated to covered dock or harbor-edge fishing.

Atlantic salmon was reopened in every new city. Lexington is Grade A numeric at 8.0 based on modern Pier/Dock years plus exact program, stocking, and occurrence evidence. Harrisville is Grade B numeric at 5.8 based on its documented winter harbor fishery and fall occurrence. St. Joseph, South Haven, and Holland remain evidence-based exclusions rather than biological-absence claims.

No out-of-catalog species was admitted, so no global species/product contract was added.

## NOAA LMHOFS validation

Each selected surface cell was independently verified in the official LMHOFS regular-grid product as water (`mask=1`) with finite positive bathymetry and surface depth index 0.

| City | Row / column | Cell | Bathymetry | Reference distance |
| --- | ---: | --- | ---: | ---: |
| St. Joseph | 52 / 156 | 42.12, -86.50 | 8.14 m | 706 m |
| South Haven | 80 / 177 | 42.40, -86.29 | 5.04 m | 225 m |
| Holland | 117 / 184 | 42.77, -86.22 | 7.97 m | 514 m |
| Lexington | 167 / 554 | 43.27, -82.52 | 2.39 m | 441 m |
| Harrisville | 306 / 478 | 44.66, -83.28 | 3.83 m | 211 m |

The live 2026-09-20 18Z audit retrieved all hours 0–120 for every city: **605/605 finite samples with no missing hours**. These candidate cells supply general harbor context only; they do not measure at a pier or resolve harbor mixing, river plumes, depth differences, waves, ice, construction, or live access.

Formula v3 now requires all six source cohorts to share one complete, fresh issue. Missing cities or hours, stale or mismatched issues, wrong cells, non-finite values, missing admitted pairs, and incomplete five-day reports fail closed.

## Database and production verification

Generated migration `20260919230000_pier_cast_st_joseph_harrisville_private_pass3_v10.sql` preserves historical config versions and archive readability while adding the exact 27-city/222-pair manifest, 1,110-row guard, source-cell constraints, private commit/read RPCs, and isolated ingestion schedule. Local and remote histories reconcile through v10.

A post-completion audit found that the new-city ingestion and aggregate Formula v3 jobs were both scheduled for minute 58, which could let aggregation read before the new cohort committed. Follow-up migration `20260920220000_pier_cast_st_joseph_harrisville_schedule_fix.sql` moves the new-city ingestion to minute 55 while leaving aggregation at minute 58. The migration was applied to the linked private project and local/remote histories reconcile through the schedule fix.

Production run `23534827-654f-4d81-91ee-11fbb7ff0f94` stores exactly **1,110 rows, 27 cities, and 222 pairs** from the coherent 2026-09-20 18Z issue under engine `pier-cast-opportunity-modes-v3-shadow-v1.8.0`. It is preview-only with promotion blocked.

Production checks confirmed:

- owner review returns all 27 ranked cities from the same source issue;
- the public projection remains exactly 22 cities with five complete dates each;
- all five private cities are absent from public catalogs and standings;
- direct normal-user access to each private city returns `city_unavailable`;
- owner review remains forbidden to a normal user;
- four distinct free reports succeed and the fifth reaches the paywall;
- a claimed/saved report refreshes;
- a paid account receives all 22 public reports;
- standings do not expose full reports;
- the disposable smoke account was deleted.

## Verification

The focused Pass 3 gate passed **70 tests**. The complete PierCast foundation suite passed after updating two stale historical owner-roster assertions while retaining the frozen 12-city legacy-v2 and 22-city public-v3 expectations. Deno checks, generator drift checks, migration manifest checks, NOAA full-horizon audit, owner QA, public QA, and authenticated production smoke all passed.

Artifacts:

- `acceptance.json`
- `owner-review-fixture.json`
- `representative-date-scores.csv`
- `yearly-peak-scores.csv`
- `lake-trout-all-city-audit.json`
- `atlantic-salmon-review.json`
- `lmhofs-cell-audit.json`
- `production-verification.json`

Pass 3 ends here with all five cities private. `publicV3Release.ts` was not changed.

## Subsequent public release

On September 20, 2026, the owner explicitly authorized a separate production release. All five cities were added to the 27-city public Formula v3 manifest under `piercast-public-research-v3-2026-09-20-twenty-seven-city`. The private-state statements above remain the historical Pass 3 completion record; `PUBLIC_RELEASE.md` records the later promotion.

## Post-completion report UI audit

Cities with a reported pier closure now render the standard report without an oversized warning card or an `ACCESS RESTRICTED` summary tag. Closure evidence remains visible in the expanded Piers Covered section, and a compact access note appears at the bottom of the report immediately above the coverage request control. The report continues to distinguish fishery conditions from live access and directs anglers to check posted notices before visiting.
