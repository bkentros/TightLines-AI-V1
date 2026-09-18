# PierCast five-city onboarding — Pass 3 completion

Completed September 18, 2026. Scope: Two Rivers, Kewaunee, Algoma, and Manitowoc, Wisconsin; Waukegan, Illinois.

## Decision

Pass 3 is complete for **private owner review**. All five cities now participate in the production Formula v3 source, scoring, report, and archive pipeline. The public application still exposes exactly the existing 12 cities. The five new cities have not gone live.

The app client in this workspace now detects the owner account, loads the 17-city owner catalog and v3 outlook, and opens each complete five-day private report without a public report claim. Other accounts continue using public endpoints. These client changes require a build containing this workspace version; they have not been distributed to existing installed app binaries.

The deployed private run is `piercast-v3-seventeen-city-five-city-pass3-v7`, using engine `pier-cast-opportunity-modes-v3-shadow-v1.5.0`. It is explicitly stored with `previewOnly=true` and `promotionStatus=blocked`.

## Primary report species and calibrated ceilings

`F` is the full seasonal and thermal alignment ceiling. It is not a year-round score or catch probability.

| City | Species shown in the full report | Ideal prime `F` |
|---|---|---:|
| Two Rivers | Chinook salmon | 8.4 |
|  | Coho salmon | 7.1 |
|  | Steelhead | 7.3 |
|  | Brown trout | 7.2 |
| Kewaunee | Chinook salmon | 9.1 |
|  | Coho salmon | 6.8 |
|  | Steelhead | 7.8 |
|  | Brown trout | 7.4 |
|  | Lake trout | 4.2 |
| Algoma | Chinook salmon | 9.0 |
|  | Coho salmon | 7.0 |
|  | Steelhead | 7.7 |
|  | Brown trout | 7.6 |
| Manitowoc | Chinook salmon | 8.5 |
|  | Coho salmon | 7.2 |
|  | Steelhead | 7.2 |
|  | Brown trout | 7.2 |
|  | Smallmouth bass | 5.8 |
|  | Northern pike | 5.2 |
| Waukegan | Chinook salmon | 7.6 |
|  | Coho salmon | 8.8 |
|  | Steelhead | 6.8 |
|  | Brown trout | 7.0 |
|  | Yellow perch | 5.4 |

These 24 pairings are the Grade B rows approved in Pass 2. Evidence grade remains metadata and does not suppress `F`. Seasonal availability controls the timing and width of each peak, thermal fit adjusts the realized report score, and the final formula clamps every result to 1–10. The 20 Grade C leads remain explicit research holds without numeric scores; the other 51 screened rows remain excluded without asserting biological absence.

## Full reports and source pipeline

- Added five city profiles, 19-species classification for each city, exact covered structures, access metadata, and all 24 admitted Formula v3 calibrations.
- Added a fourth isolated LMHOFS cohort with five audited wet surface cells, 121 forecast hours per city, 605 samples per issue, and fresh complete-cycle fallback only.
- Formula v3 now requires one coherent issue across four cohorts: 17 cities and 2,057 temperature samples. It fails closed if any cohort or city timeline is missing.
- Each owner outlook contains five report dates for all 17 cities. The five new cities contribute 120 forecast rows: 24 species pairings × five dates.
- The private archive requires exactly 590 rows, 17 cities, 118 unique city/species pairs, and lead days 0–4 before committing a run.
- The Waukegan yellow-perch May 1–June 15 closure is encoded as legally unavailable rather than as a low score.

The [Illinois DNR 2026 regulations](https://dnr.illinois.gov/content/dam/soi/en/web/dnr/publications/documents/00000953.pdf) list the Lake Michigan yellow-perch closure and are effective April 1, 2026 through March 31, 2027. Recheck the replacement regulations before making a claim about the 2027 open-water season; the annual biological scoring audit is separate from that legal review.

The deterministic owner fixture contains five complete reports, 25 city dates, and 120 species/date rows. The live production run contains all 590 expected rows and all 24 onboarding pairs.

## Access review

| City | Modeled structure status |
|---|---|
| Two Rivers | North Pier/New Beach approach documented; current posted conditions not live checked. |
| Kewaunee | South lighthouse route documented; Harbor Point inner fishing piers listed separately; current posted conditions not live checked. |
| Algoma | South breakwater recorded as closed during USACE construction; tentative completion is April 2027. North-pier public segment remains unresolved. The fishery report remains available and does not recommend access. |
| Manitowoc | Lighthouse Park lists fishing, parking, and 6 a.m.–11 p.m. hours; current posted conditions not live checked. |
| Waukegan | Government Pier public use is documented; current fishing signs, parking, and temporary conditions not live checked. |

Published access is not a live guarantee. Posted signs, construction, emergency orders, weather, waves, and ice control on-site access.

The [USACE Algoma Harbor project page](https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638113/algoma-harbor/) lists south-breakwater construction and the tentative completion date. Its [October 2025 fact sheet](https://lre-ops.usace.army.mil/OandM/factsheets/AlgomaHarbor.pdf) independently describes the south pier under repair and the north pier scheduled for work. The [City of Manitowoc facility page](https://www.manitowoc.org/facilities/facility/details/Lighthouse-Park-53) confirms park fishing, parking, and hours. None provides a live signage feed. A current on-site or land-manager segment check remains necessary before any access guidance is approved for public release.

## Acceptance evidence

- Full generated calibration audit: 118 pairs, 239 modes, 30,680 full-year replay rows, and 215,350 invariant-score evaluations.
- Five-city Pass 2 annual audit: 365 dates for every admitted pair under thermal fits 0, 0.5, and 1; 8,760 pair/date rows.
- Local acceptance: Formula generation, source-cohort selection, legal closure, 1–10 bounds, exact database manifest, authorization, report completeness, and public projection all passed.
- Production owner QA: 17 ranked cities from the same September 18, 2026 06:00 UTC LMHOFS issue.
- Production public QA: exactly 12 ranked released cities and complete five-day reports.
- Authenticated normal-user smoke: all five onboarding cities absent from the catalog, each direct report request returns `city_unavailable`, and the owner-review route returns 403.
- Stored private production run: 590 rows, 17 cities, 118 pairs, five onboarding cities, 24 onboarding pairs, 120 onboarding forecast rows, and every stored numeric score within 1–10.

The authenticated normal-user smoke passed before the final redeploy that updated the owner-review catalog formula label. The repeat post-deploy production smoke was rejected by automatic approval review because of a usage limit; it has not been rerun. The changed catalog branch remains covered by the 220 passing local foundation tests. A live login with the actual owner account and a packaged client was not available in this workspace, so the owner screen was checked by TypeScript, route tests, and production owner-model QA rather than by a physical-device session.

## Artifacts

- `acceptance.json`: deterministic owner/public counts and access status.
- `owner-review-fixture.json`: all five full review reports under a documented constant-temperature fixture.
- `representative-date-scores.csv`: five dates across the year for every admitted pairing under ideal thermal fit.
- `lmhofs-cell-audit.json`: selected grid cells, model bathymetry, and USCG coordinate references.
- `production-verification.json`: verified private production run and exact manifest counts.
- Pass 2 `full-year-daily-audit.csv`: the complete year-round scoring trace.
- Pass 2 `pair-decisions.json`: all 95 city/species decisions and evidence grades.

## Release boundary

The public release list is a separate frozen 12-city manifest. Until the owner explicitly says “go live,” only the account authorized by `brandonkentros@icloud.com` can open the 17-city review routes.

For the eventual release, first reopen every one of the 20 Grade C research holds against fresh exact-pier evidence and confirm the accepted roster still reflects common pier targets. Verify current signs and legal public segments with each land manager, keep Algoma's south breakwater restricted until an authoritative reopening, and refresh Illinois regulations after the current guide expires. Review recent score outcomes and the full-year 1–10 trace. Then make a separate public manifest change, distribute an updated app client, and rerun complete public catalog, 17-city report, authentication, quota, and normal-user production smoke checks. Do not infer public approval from the private production run.
