# PierCast Chicago–Alpena onboarding — Pass 3 completion report

**Cities:** Chicago, Illinois; Michigan City, Indiana; Muskegon, Michigan; Whitehall, Michigan; Alpena, Michigan

**Completed:** 2026-09-19

**Status:** complete private owner review; all five cities remain nonpublic

## Result

Pass 3 is complete. The five city profiles, exact covered structures, accepted Formula v3 calibrations, NOAA source cells, isolated archive cohort, 22-city coherent-source gate, reproducible migration, five-day reports, and production verification are implemented.

- The owner model contains **22 cities, 173 city/species pairs, 322 modes, and 865 five-day forecast rows**.
- The new cohort contributes **5 cities, 55 numeric pairs, 83 modes, 605 hourly source samples, and 275 five-day report rows**.
- All **55 admitted pairs** have complete five-day reports. Every likely primary species appears on every report date.
- The other 40 reviewed cells remain explicit: **23 research holds** and **17 evidence-based excludes**. These states do not assert biological absence.
- Production run `4ad14fff-628e-4cb2-8300-6c3487a77a18` stores exactly **865 rows, 22 cities, and 173 pairs** under engine `pier-cast-opportunity-modes-v3-shadow-v1.7.0`. Promotion is blocked.
- The public Formula v3 manifest remains **16 cities**. Chicago, Michigan City, Muskegon, Whitehall, Alpena, and Waukegan are absent from public catalogs, standings, and direct reports.

No app build, public-manifest change, store submission, or release switch was performed.

## Lake trout review across all 22 cities

Lake trout was reopened across the entire owner roster with special attention to late fall and winter. The resulting values describe covered pier or harbor opportunity under ideal temperature suitability. They are not catch probabilities, lake-wide rankings, or boat-fishery scores.

| City | Decision | Peak F | Legal and seasonal conclusion |
| --- | --- | ---: | --- |
| Ludington | Numeric | 3.8 | All-year MM6–8 season; modest cold-season nearshore mode retained. |
| Grand Haven | Numeric | 3.6 | All-year MM6–8 season; modest cold-season opportunity retained. |
| Manistee | Numeric | 4.0 | All-year MM6–8 season; cold-season opportunity retained. |
| Frankfort/Elberta | Numeric | 4.0 | MM1–5 is open Jan. 1–Sept. 30; Oct. 1–Dec. 31 is unavailable. |
| Sheboygan | Unscored evidence gap | — | No numeric covered-structure calibration is justified by the reviewed record. |
| Port Washington | Unscored evidence gap | — | No numeric covered-structure calibration is justified by the reviewed record. |
| Milwaukee | Unscored evidence gap | — | No numeric covered-structure calibration is justified by the reviewed record. |
| Racine | Unscored evidence gap | — | No numeric covered-structure calibration is justified by the reviewed record. |
| Kenosha | Unscored evidence gap | — | No numeric covered-structure calibration is justified by the reviewed record. |
| Harbor Beach | Numeric | 5.3 | All-year MH3–6 season; fall harbor opportunity remains visible. |
| Oscoda | Numeric | 4.6 | MH1–2 is open Jan. 1–Sept. 30; Oct. 1–Dec. 31 is unavailable. |
| Port Sanilac | Numeric | 5.5 | All-year MH3–6 season; fall harbor opportunity remains visible. |
| Two Rivers | Research hold | — | Plausible occurrence remains unscored pending recurring exact-structure evidence. |
| Kewaunee | Numeric | 4.2 | Continuous Wisconsin Lake Michigan season; late-fall and winter mode retained. |
| Algoma | Research hold | — | Plausible occurrence remains unscored pending recurring exact-structure evidence. |
| Manitowoc | Research hold | — | Plausible occurrence remains unscored pending recurring exact-structure evidence. |
| Waukegan | Research hold | — | Plausible occurrence remains unscored pending recurring exact-structure evidence. |
| Chicago | Numeric | **5.4** | Winter nearshore mode peaks Feb. 15 and remains strong in December and January. |
| Michigan City | Research hold | — | Indiana documents a fall lake-trout fishery near the Port of Indiana, but repeat East Pier evidence remains insufficient. |
| Muskegon | Research hold | — | Historical Pier/Dock positives are sparse and do not support a predictable covered-segment curve. |
| Whitehall | Research hold | — | Historical Pier/Dock positives are sparse and exact Medbery transfer remains uncertain. |
| Alpena | Numeric | **5.0** | Spring and summer/early-fall modes are retained; MH1–2 is unavailable Oct. 1–Dec. 31. |

Chicago at **5.4** is appropriate in the cross-city set. It is slightly below Port Sanilac at 5.5, slightly above Harbor Beach at 5.3, and above the modest western Lake Michigan numeric fisheries. Direct recurring winter lakefront evidence supports the number; the score is limited because one city source cell and the covered Montrose/Navy Pier subareas cannot represent every Chicago lakefront location.

The implementation now treats Frankfort, Oscoda, and Alpena as legally unavailable from October through December. It leaves supported winter fisheries open where their management units permit fishing. The full January, February, September, October, November, and December matrix for all cities is in `lake-trout-all-city-audit.json`.

Regulation sources were rechecked against the [Michigan DNR 2026 regulations](https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations), [Michigan lake trout and splake table](https://www.eregulations.com/michigan/fishing/lake-trout-splake-regulations), [Wisconsin DNR trout and salmon seasons](https://dnr.wisconsin.gov/topic/Fishing/seasons/trout), [Indiana DNR Lake Michigan fishing guidance](https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/), and [Illinois fishing regulations](https://dnr.illinois.gov/content/dam/soi/en/web/dnr/publications/documents/00000953.pdf).

## Alpena salmonid decisions

Alpena now includes Atlantic salmon **7.2**, coho **6.5**, steelhead **5.8**, lake trout **5.0**, Chinook **5.4**, and brown trout **5.4**. Michigan DNR's exact harbor list, annual 2023–26 Thunder Bay River stocking, Atlantic salmon management page, and 2024 Alpena catch records support the four additions. Their Grade B values remain conservative because modern Pier/Dock rows are sparse or zero and connected-river evidence does not measure Bay View breakwall catch rate. Lake whitefish remains a research hold.

## NOAA coverage and source coherence

The five configured cells were independently checked in the official NOAA LMHOFS regular-grid product for the 2026-09-18 06Z cycle. Each cell had water mask `1`, finite positive bathymetry, and a surface index of zero.

| City | Row / column | Cell | Bathymetry | Reference distance |
| --- | ---: | --- | ---: | ---: |
| Chicago | 36 / 44 | 41.96, -87.62 | 6.24 m | 1,210 m from Montrose Harbor entrance |
| Michigan City | 13 / 115 | 41.73, -86.91 | 7.93 m | 310 m from East Pierhead Light |
| Muskegon | 162 / 172 | 43.22, -86.34 | 5.34 m | 780 m from South Pierhead Light |
| Whitehall | 178 / 163 | 43.38, -86.43 | 3.29 m | 420 m from the Medbery channel reference |
| Alpena | 346 / 464 | 45.06, -83.42 | 2.59 m | 240 m from Alpena Harbor Light |

All remain `candidate` cells. A model surface cell supplies general harbor context and does not claim pier-scale temperature, depth, mixing, river-plume, wave, ice, or access precision.

Alpena is kept in the separate `piercast-chicago-alpena-shadow-v1` archive scope. The Formula v3 reader now requires five complete cohorts to share one fresh issue. Any missing city, mismatched issue, wrong row or column, missing forecast hour, or incomplete admitted pair fails closed. Production verified all 22 cities from the same 2026-09-19 06Z issue.

## Access boundary

The report profiles preserve each Pass 1 boundary and warning:

- Chicago keeps Montrose and the legal Navy Pier fishing area as separate structures.
- Michigan City keeps East Pier separate from the route-unverified inner-harbor subarea and excludes Trail Creek, NIPSCO, and Port of Indiana fishing.
- Muskegon separates north and south channel structures; the north route still requires current reopening confirmation.
- Whitehall identifies Medbery Park as City of Montague property in White River Township and preserves its published hours.
- Alpena covers the Bay View breakwall platform and legal contiguous harbor edge; the lighthouse tower is excluded.

Access status is independent of biological opportunity. Weather, waves, ice, construction, security, posted signs, passes, and local operating hours can make a structure unavailable. Candidate or unverified access is disclosed and is not presented as a current open-pier recommendation.

## Verification

Local verification passed:

- 315,725 score evaluations over all 173 pairs, 365 dates, and five thermal-fit values.
- 44,980 deterministic weekly replay rows.
- `1 ≤ score ≤ seasonalPotential ≤ F ≤ 10`, monotonic thermal response, maximum-mode selection, legal closure masking, and year-seam continuity.
- 22-city and 173-pair manifests, five coherent source cohorts, 2,662 source samples, and 865 archived report rows.
- All five profiles contain 19 explicit species decisions, valid structures, time zones, and audited source cells.
- Report access tests cover user isolation, four lifetime free city/day claims, saved-report refresh, fifth-report paywall, paid access, and leaderboard/report separation.

Production verification passed:

- Migrations `20260919150000` and `20260919190000` are present locally and remotely.
- `pier-cast-ingest` and `pier-cast` are deployed with the private cohort and unchanged public projection.
- Owner QA produced 22 ranked cities from one coherent issue.
- Public QA produced 16 ranked cities and 16 complete five-day reports.
- An authenticated disposable normal user could not access owner review or any private city, received four free reports, was paywalled on the fifth distinct report, refreshed a saved report, and received all 16 reports after a paid-tier upgrade.
- The disposable account was deleted after the smoke test.

## Artifacts

- `acceptance.json` — deterministic acceptance counts, access contracts, and primary-species checks.
- `owner-review-fixture.json` — all five complete private five-day reports.
- `representative-date-scores.csv` — 275 representative city/species/date rows.
- `yearly-peak-scores.csv` — annual open-season peaks for all 55 admitted pairs.
- `lake-trout-all-city-audit.json` — all 22 lake-trout decisions and cold-season checks.
- `lmhofs-cell-audit.json` — independent NOAA cell evidence and limitations.
- `production-verification.json` — exact production run, pair, city, row, score-bound, and isolation evidence.

The generator and migration both have drift checks. `npm run qa:pier-cast:chicago-alpena-pass3` reproduces the complete local gate.
