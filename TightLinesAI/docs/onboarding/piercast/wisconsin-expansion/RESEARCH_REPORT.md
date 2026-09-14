# Wisconsin PierCast expansion: evidence and year-round calibration report

Prepared September 14, 2026

Scope: Milwaukee, Racine, and Kenosha; Port Washington is retained in the same private Wisconsin shadow cohort

Decision state: implemented for owner-only shadow review; not approved for public release

## Executive assessment

Milwaukee, Racine, and Kenosha are suitable for complete private PierCast onboarding with four scored species: Coho Salmon, Chinook Salmon, Steelhead, and Brown Trout. Wisconsin DNR names those species at the principal public Lake Michigan pier/shore accesses in every city, including McKinley and Cupertino in Milwaukee, North and South piers in Racine, and North and South piers in Kenosha.[^1][^2] The DNR county-by-mode harvest series supplies a second, independent recurrence layer through 2024, while the 2022–2024 statewide pier-mode reports supply the only consistent recent month-bucket effort denominator.[^3][^4][^5][^6]

The resulting year-round values are intentionally conservative FinFindr calibrations. They are not DNR scores, measured catch probabilities, or structure-specific predictions. Confidence is high that the broad seasonal pattern is directionally correct for the four admitted species; confidence is moderate in city-to-city magnitude and low for precise winter values. That distinction is encoded operationally: every new city and curve is `provisional`, `ratingEnabled` remains false, temperature representation is blocked, and forecasts live only in an owner-only shadow archive.

Yellow perch is a genuine Racine and Kenosha summer pier lead. DNR reports repeatedly document perch at Kenosha piers/harbor and on the Racine shoreline in July and August 2024.[^7][^8][^9] It is deliberately not scored. The recent published monthly pier table combines all Wisconsin Lake Michigan and Green Bay survey areas, which makes its perch temporal shape unsafe to transfer to these southern Lake Michigan cities; moreover, the 2026–27 rules close Lake Michigan yellow perch from May 1 through June 15, and the current expansion evaluator does not yet implement species-specific closed-season gating.[^6][^12] Perch appears in owner review as a conditional, unscored lead. Lake trout and all remaining registry species are likewise unscored unless a future evidence packet establishes recurring pier opportunity and a defensible local seasonal calibration.

## Product boundary

Each result is one general reading for the city harbor and its main public fishing piers. It is not dialed to a casting position, a side of a breakwall, or an individual depth. The named structures define the public fishing context and route, while one lakeward LMHOFS surface cell provides the city-scale temperature input.

The covered public contexts are:

| City | Main public pier contexts | Authoritative access basis |
|---|---|---|
| Milwaukee | McKinley Pier; Cupertino Pier | Wisconsin DNR access directory and Close to Home guide |
| Racine | North Pier; South Pier | Wisconsin DNR access directory and Close to Home guide |
| Kenosha | North Pier / Simmons Island; South Pier | Wisconsin DNR access directory and Close to Home guide |

The boundary excludes marina tenant docks, finger piers, launch ramps, restricted port property, live closure status, unsafe wave/ice conditions, and any claim that the model cell measures the water at a pier. McKinley is especially important: DNR identifies public pier fishing access through the marina area, but Milwaukee County marina rules and on-site signs still control which surfaces may be used. The catalog text expressly excludes marina docks and restricted areas.

## Evidence hierarchy and calibration method

The research used primary government sources wherever available. Evidence was ranked in this order:

1. Current, exact DNR city/pier access and species listings.
2. Dated DNR creel-clerk reports that distinguish pier or shoreline fishing from boats and tributaries.
3. DNR county-by-mode annual harvest estimates, used as recurrence and conservative relative-strength evidence.
4. DNR statewide pier-mode monthly harvest divided by estimated pier effort, used only for broad temporal shape.
5. NOAA navigation and LMHOFS data, used only for temperature sampling configuration.

No annual county value was assigned to a month. No statewide monthly value was represented as city-specific. No boat catch was used to admit a pier species. No absence of a weekly report was interpreted as absence of fish. DNR itself explains that weekly report observations are limited to the randomized days and times when creel clerks are present.[^10]

For the four scored species, pooled 2022–2024 statewide pier harvest per estimated angler-hour was calculated for six published buckets: March/April, May, June, July, August, and September/October. The pooled values are stored exactly in `seasonal-curves.json`. They establish the broad spring coho/brown pattern, midsummer Chinook pattern, bimodal steelhead pattern, and fall salmon return. City-specific curve height is then bounded by exact-city reports and recent county pier recurrence, not mechanically multiplied by raw county harvest. This avoids implying city CPUE because DNR does not publish the necessary city-level pier effort denominator in the county table.

The final formula continues to make water temperature a bounded modifier of the seasonal baseline rather than the primary score driver. Thus a warm or cold model day cannot manufacture a prime opportunity during a biologically weak season.

## City findings

### Milwaukee

The strongest exact access evidence is unusually clear. DNR identifies McKinley Marina as providing pier fishing access and separately identifies Cupertino Pier; both list steelhead, brown trout, and Chinook/Coho salmon.[^2] A May 2024 DNR report says Milwaukee pier anglers were succeeding on coho. In May 2025, the report names McKinley Pier and records coho plus an occasional brown trout, including a large lakeside brown. In June 2025, McKinley catches included brown trout, coho, and occasional rainbow trout/steelhead.[^7][^10][^11]

The county-mode series is consistent with meaningful coho and brown trout recurrence: Milwaukee pier harvest estimates for 2022–2024 were 164, 41, and 192 coho; 64, 0, and 97 brown trout; and 110, 0, and 79 Chinook. The recent rainbow/steelhead pier estimates were zero, but the exact DNR species listing and named-pier 2025 rainbow observation demonstrate why those survey zeros cannot be treated as biological absence.[^3][^11]

Calibration implications:

- Coho receives a strong late-March through May profile, with a May knot of 7.6 because two separate years include direct Milwaukee pier support.
- Chinook peaks at 7.0 in August and remains strong in early September, but stays below Racine because recent county recurrence is less consistent.
- Steelhead is capped at 4.6 in spring and 4.4 in July. This recognizes exact local occurrence without pretending the recent annual survey produced a stable Milwaukee pier estimate.
- Brown trout peaks at 6.6 in April and remains 5.8 in mid-May, supported by two positive recent county years and exact May/June McKinley observations.

Overall score confidence: high for species admission and broad seasonal order; moderate for coho and brown magnitude; moderate-low for Chinook and steelhead magnitude; low for November–February precision.

### Racine

DNR identifies both Racine South Pier and North Pier and lists the same four salmonids at each.[^1][^2] The local dated evidence is the strongest of the three cities across multiple seasonal phases. July and August 2024 reports record shoreline rainbow trout/steelhead, coho, and perch, with a useful mechanism note that west winds can bring cooler water close enough to shore to improve salmonid opportunity.[^7][^8][^9] May 2025 reports shoreline coho and brown trout. The current September 7, 2026 report names Racine South Pier and records coho caught on spoons and tube jigs with shrimp.[^10][^13]

County pier estimates are positive in all three recent years for all four scored species: coho 176/534/120, Chinook 203/65/60, steelhead 70/9/75, and brown trout 25/25/44 for 2022/2023/2024.[^3] This does not create a city catch rate, but it supports the most internally consistent recurrence classification in the cohort.

Calibration implications:

- Coho has two strong windows: spring (7.6 in April, 7.4 in May) and the early September return (7.3), with moderate July opportunity supported by direct shoreline reports.
- Chinook reaches 7.4 in August and 7.2 in early September. County pier harvest is positive in all three years, so Racine is the least conservatively suppressed of the three fall Chinook profiles.
- Steelhead reaches 5.7 in July and 5.3 in April, reflecting both statewide timing and direct July/August Racine shore observations.
- Brown trout reaches 6.7 in April and 5.5 in May, supported by annual recurrence and the May 2025 report.

Overall score confidence: high for species admission and broad pattern; moderate-high for relative city ranking; moderate for seasonal magnitude; low for winter precision.

### Kenosha

DNR identifies North Pier near Simmons Island and South Pier, with steelhead, brown trout, and Chinook/Coho listed at both.[^1][^2] The May 2025 report records coho success from shore. July–August 2024 reports repeatedly identify perch from Kenosha piers and harbor, which supports the conditional perch lead but does not establish a salmonid month on its own.[^7][^8][^9][^10]

The county pier estimates are strong but uneven: coho 100/783/53, Chinook 177/0/0, steelhead 0/9/0, and brown trout 0/0/48 for 2022/2023/2024.[^3] The exact named-pier species guide is therefore essential. The safest interpretation is that all four are valid recurring targets, but only coho supports a high local peak from the recent quantitative record. The other three are bounded below Racine until prospective outcomes improve the calibration.

Calibration implications:

- Coho receives the cohort’s strongest spring peak at 8.0 in April, with 7.5 in May, supported by the 2023 annual estimate and direct 2025 shore report.
- Chinook peaks at 6.7 in August, lower than Milwaukee and Racine because two recent annual pier estimates were zero.
- Steelhead peaks at 4.3 in April and 4.2 in July, deliberately restrained despite exact DNR pier-level admission.
- Brown trout peaks at 5.8 in April and 4.8 in May; the curve acknowledges 2024 recurrence while avoiding strength unsupported in 2022–2023.

Overall score confidence: high for species admission; moderate-high for coho shape; moderate-low for the precise magnitude of Chinook, steelhead, and brown trout; low for winter precision.

## Species exclusion and conditional decisions

Yellow perch is the closest non-core species. It has repeated exact Kenosha pier evidence and recurring Racine shoreline evidence. However, three issues prevent a responsible year-round curve: the recent month table combines Green Bay and Lake Michigan; the DNR reports call Lake Michigan perch harvest an overall declining fishery; and the May 1–June 15 closure would require a hard regulation gate.[^6][^12] A curve would look quantitative without being locally identifiable. It remains visible as `conditional` for Racine/Kenosha and `unresolved` for Milwaukee.

Lake trout occurs in regional and boat reports but recent southern-county pier harvest is sparse: Kenosha recorded none in 2022–2024; Racine recorded 23, 8, and 0; Milwaukee recorded 0, 0, and 1.[^3] That is not enough to call it a main city-pier target.

Smallmouth bass, walleye, freshwater drum, whitefish, and catfish may occur in broader harbor, river, or incidental contexts. The reviewed official evidence does not establish them as recurring main-pier fisheries with locally defensible year-round score curves. They remain research-only rather than inheriting scores from taxonomy or artwork.

## Regulation review

The 2026–27 Wisconsin hook-and-line guide says other trout and salmon in Lake Michigan are open all year, with a five-fish total daily limit with lake trout and a 10-inch minimum. It also requires a fishing license plus a Great Lakes trout and salmon stamp (or valid two-day Sports Fishing License) and a paper copy of license/stamps while fishing Lake Michigan.[^12] The application continues to direct users to verify current season, size, bag, license, and stamp rules before fishing. The regulatory validity marker ends March 31, 2027; ingestion may continue after that date, but promotion or refreshed admission must not.

## Temperature source audit

NOAA Coast Pilot 6 supplies navigation reference coordinates for Milwaukee Breakwater Light and Kenosha Light.[^14] NOAA’s current Aids to Navigation feature service supplies Racine East Harbor Entrance Light 2.[^15] Candidate regular-grid cells were selected lakeward and then probed against NOAA LMHOFS for forecast hours 0, 1, 24, 72, and 120 in the September 14, 2026 12 UTC cycle.[^16]

| City | Cell | Center | Reference distance | Bathymetry | Probe result |
|---|---:|---|---:|---:|---|
| Milwaukee | row 143, col 18 | 43.03, -87.88 | 375 m | 10.61 m | plausible and time-consistent through hour 120 |
| Racine | row 113, col 29 | 42.73, -87.77 | 404 m | 5.33 m | plausible and time-consistent; land immediately west in 3×3 audit |
| Kenosha | row 99, col 26 | 42.59, -87.80 | 716 m | 6.41 m | plausible and time-consistent through hour 120 |

This proves deterministic extraction, not representation quality. Milwaukee’s Discovery World Panther buoy (`obs_194`) is configured only as a seasonal comparison candidate.[^17] The final live query timed out, so no current error statistic is claimed. The available Racine station is too far offshore to represent a pier, and no Kenosha pier-local active station was found. All three runtime profiles therefore retain `blocked_insufficient_evidence` representation status.

## Operational architecture and failure containment

The implementation creates one private `piercast-wisconsin-shadow-v1` cohort comprising Port Washington, Milwaukee, Racine, and Kenosha. Each scheduled cycle is all-or-nothing:

- 4 cities × 121 hourly LMHOFS samples = exactly 484 archived temperature samples.
- 4 cities × 4 species × 5 dates = exactly 80 archived shadow forecasts.
- Every city must contain every forecast hour 0–120 and every city/date must contain all four species.
- Grid row, column, latitude, and longitude are database-constrained by city.
- Partial provider retrieval cannot overwrite or masquerade as a complete cycle.
- Cached fallback is permitted only from a complete fresh cohort cycle.
- The former one-city Port Washington cron job is replaced by the unified Wisconsin schedule.
- Public city scope, public catalog, trial/report eligibility, frozen production archive, and locked public leaderboard remain unchanged.

Owner review receives the complete cohort through the existing expansion outlook endpoint. Owner standings merge all four cities with the five released cities; public clients ignore supplemental shadow outlooks.

## Confidence statement and next evidence needs

I am highly confident that the onboarding decisions are disciplined and that the year-round score shapes are safe enough for shadow review. I am not claiming that the decimal values are scientifically validated catch-rate forecasts. The highest-confidence statements are: the four admitted species are legitimate at the named city pier contexts; coho and brown are primarily spring opportunities; Chinook is primarily midsummer through early fall; steelhead has spring and cool-water summer opportunity; and water temperature should modify rather than replace those seasonal priors.

Promotion should require prospective outcomes across multiple wind/temperature regimes, especially west-wind upwelling events; field temperature comparisons at or near each harbor; a regulation refresh after March 31, 2027; and enough effort-aware observations to review city/species residuals without cherry-picking. Perch should receive its own future packet using Lake-Michigan-only local effort/catch evidence plus a hard closed-season gate before any score is enabled.

## Sources

[^1]: [Wisconsin DNR, Lake Michigan fishing access](https://dnr.wisconsin.gov/topic/OpenOutdoors/AccessFishlakeMichigan). Reviewed 2026-09-14. Current access directory; does not promise live access or safety.
[^2]: [Wisconsin DNR, Close to Home fishing opportunities](https://dnr.wisconsin.gov/sites/default/files/topic/ClosetoHomeFishing.pdf). June 2023. Exact access/species guide; not a catch-rate study.
[^3]: [Wisconsin DNR, Lake Michigan Creel Harvest Tables 1998–2024](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables1998-2024.pdf). Published 2025-04-10. County/mode annual harvest estimates; no city effort or monthly attribution.
[^4]: [Wisconsin DNR, 2022 open-water sportfishing effort and harvest](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf). Statewide month-bucket/mode estimates.
[^5]: [Wisconsin DNR, 2023 open-water sportfishing effort and harvest](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf). Statewide month-bucket/mode estimates.
[^6]: [Wisconsin DNR, 2024 open-water sportfishing effort and harvest](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf). Explains reduced 2024 survey and modeled periods.
[^7]: [Archived Wisconsin DNR Southern Lake Michigan report, July 15, 2024](https://web.archive.org/web/20240722112758id_/https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Dated weekly observation, not a seasonal rate.
[^8]: [Archived Wisconsin DNR Southern Lake Michigan report, late July 2024](https://web.archive.org/web/20240730191913id_/https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Dated weekly observation, not a seasonal rate.
[^9]: [Archived Wisconsin DNR Southern Lake Michigan report, August 2024](https://web.archive.org/web/20240824205048id_/https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Dated weekly observation, not a seasonal rate.
[^10]: [Archived Wisconsin DNR Southern Lake Michigan report, May 2025](https://web.archive.org/web/20250524132145id_/https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Includes McKinley Pier, Kenosha shore, and Racine shore observations.
[^11]: [Archived Wisconsin DNR Southern Lake Michigan report, June 2025](https://web.archive.org/web/20250615151544id_/https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Includes named McKinley Pier observations.
[^12]: [Wisconsin DNR, 2026–27 Hook and Line Fishing Regulations](https://widnr.widen.net/s/glhqr9znsp/fishingregselectronic2627). Lake Michigan rules on pages 88–90; reviewed 2026-09-14.
[^13]: [Wisconsin DNR, Lake Michigan Outdoor Fishing Report, September 7, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Current when reviewed 2026-09-14; reports only observed clerk periods.
[^14]: [NOAA Office of Coast Survey, United States Coast Pilot 6, 2026 edition](https://www.nauticalcharts.noaa.gov/publications/coast-pilot/files/cp6/CPB6_WEB.pdf). Navigation reference, not fishing guidance.
[^15]: [NOAA Office for Coastal Management, Aids to Navigation feature service](https://coast.noaa.gov/arcgis/rest/services/Hosted/AtoNs/FeatureServer/0). Current Racine navigation reference; reviewed 2026-09-14.
[^16]: [NOAA NOS, LMHOFS model catalog](https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/LMHOFS/MODELS/catalog.html). Operational model source; a grid forecast is not a local observation.
[^17]: [GLOS Seagull ERDDAP, Discovery World Panther Buoy `obs_194`](https://seagull-erddap.glos.org/erddap/tabledap/obs_194.html). Seasonal validation candidate only; not a score input.
