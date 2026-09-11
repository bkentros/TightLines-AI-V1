# PierCast Core-Species Seasonal Opportunity Calibration

## Executive findings

This package establishes a disciplined numerical calibration for Chinook salmon, coho salmon, steelhead, and brown trout in Ludington, Grand Haven, Manistee, Frankfort–Elberta, and Sheboygan. It contains 20 city–species curves, explicit decimal knots, and 1,040 interpolated weekly review values. Every curve remains a **provisional FinFindr research calibration** and `production_ready=false`. Version 0.4 preserves the evidence-backed v0.3 timing and ordering while recalibrating magnitudes to use the full consumer-facing 1–10 scale. The complete reasoning is in the [v0.4 full-scale audit](PierCast_Full_Scale_Seasonal_Recalibration_v0.4.md).

The strongest supported seasonal peaks are Manistee steelhead in late October, Frankfort steelhead in mid-October, Frankfort Chinook in mid-August, Sheboygan Chinook in late August, and Manistee Chinook in late August. Manistee steelhead is the reference `10.0` seasonal opportunity; this means the strongest supported window in the five-city FinFindr catalog, not a guaranteed catch.

The evidence does not justify manufacturing 52 independent judgments per curve. The source of truth is therefore a sparse, continuous date curve. Anchors are placed more closely around documented arrivals, peaks, and declines and farther apart during broad slow periods. The weekly table is a deterministic review projection generated from those anchors—not a second configuration and not 1,040 separately researched coefficients.

Michigan DNR describes its creel program as interviews that record fishing duration, target species, and catch.^1 Its public Great Lakes dashboard provides monthly port- and `Pier/Dock`-specific estimates through 2022, which now anchor the Michigan magnitudes and broad shapes.^2 Wisconsin's 2022–2024 reports provide regional mode-specific pier estimates but not a contemporary Sheboygan-only catch-per-effort series.^3 Consequently, the Michigan broad shapes and city ordering are now much better supported, while exact weekly decimals—especially at Sheboygan—remain product calibration rather than measured coefficients.

## Deliverables

- [Core seasonal curves](PierCast_Core_Species_Seasonal_Curves.json) — authoritative research configuration with 20 explicit curves, evidence IDs, confidence, limitations, anchor rationale, and one-decimal knots.
- [Weekly rating review table](PierCast_Core_Species_Weekly_Ratings.csv) — 52 midpoint evaluations for every curve, including a one-decimal `X.X/10` preview.
- [Weekly table generator](../scripts/generate-pier-cast-weekly-ratings.mjs) — deterministic regeneration and structural validation.
- [v0.3 all-port audit](PierCast_All_Port_Seasonal_Presence_Audit_v0.3.md) — quantitative method, findings, revisions, confidence, and full sources.
- [v0.4 full-scale audit](PierCast_Full_Scale_Seasonal_Recalibration_v0.4.md) — current cross-port magnitude decisions and full source list.
- [v0.4 seasonal replay](PierCast_Seasonal_Calibration_Replay_v0.4.md) — reproducible in-sample consistency checks after recalibration.
- [Official Michigan Pier/Dock extract](PierCast_Michigan_Pier_Creel_Estimates_1989_2022.csv) and [monthly summary](PierCast_Michigan_Pier_Creel_Monthly_Summary.csv) — auditable source rows and derived catch-per-effort/recurrence checks.
- [Pilot city evidence inventory](PierCast_Pilot_Cities_Research.md) — prior source register and coverage decisions incorporated by reference.

## Score meaning

Each value is the **Seasonal Pier Opportunity Rating**:

> Under supportive water temperature, how strong is the historically supported opportunity for this species from the covered pier or piers on this date?

This calibration owns the local fishery strength and calendar timing. Water temperature remains the only live numeric variable. Formula v2 softens adverse-temperature penalties and permits only a bounded five-percent synergy when thermal fit is nearly optimal:

```text
temperatureModifier = 0.30 + 0.75 × temperatureSuitability
finalScore = clamp(1, 10,
  1 + (seasonalOpportunityRating - 1) × temperatureModifier
)
```

The seasonal value is not a detected-presence score, biological abundance index, catch probability, catch-rate estimate, percentile, or government rating. A `7.6` means FinFindr judges the target-specific opportunity to be in the upper part of the shared “good” band if water temperature is supportive. It does not mean a 76% chance of catching a fish.

Internal and research values use one decimal at knots and full precision after interpolation. The weekly CSV previews one-decimal `X.X/10` presentation. The product contract and rating formatter now use the same one-decimal format while retaining full precision for aggregation and ranking.

## Common calibration rubric

| Continuous seasonal rating | Working interpretation | Evidence expectation |
| --- | --- | --- |
| 1.0 | Negligible meaningful opportunity in a researched annual profile | Supported dead interval; never a substitute for missing research |
| 1.1–2.0 | Poor | Rare, incidental, or strongly inaccessible seasonal occurrence |
| 2.1–4.0 | Limited | Shoulder season, inconsistent access to fish, or weak/episodic reports |
| 4.1–6.0 | Fair | Direct occurrence or repeatable regional/local pattern with meaningful limitations |
| 6.1–8.0 | Good | Repeated or comparatively strong local pier evidence and useful targetability |
| 8.1–9.4 | Excellent | Exceptional recurring window with strong local or mode-specific evidence |
| 9.5–10.0 | Premier peak | One of the strongest supported pier opportunities in the five-city catalog |

The numeric assignment is an evidence-aware calibration judgment, not a mechanical conversion of adjectives. A single report of “a few fish” can support occurrence and timing, but not an 8. A report of “excellent numbers,” “great activity,” limits, or many successful pier anglers can support a stronger anchor only after checking scope, method, and contradictory weeks. Negative reports are retained rather than discarded.

## Evidence treatment

Five dimensions governed every curve:

1. **Pier specificity.** A catch explicitly attributed to a pier, breakwall, or pierhead receives more weight than a port-wide statement. Boat catches, offshore depths, river runs, and nearby bays do not become pier evidence.
2. **Recurrence.** Similar timing across years is stronger than one isolated bulletin. Older direct reports remain useful for recurring calendar structure but lower current confidence.
3. **Effort and outcome language.** “Excellent numbers,” multiple successful anglers, and reported limits support a higher ceiling than “a few,” “slow,” or unsuccessful effort. These qualitative descriptions are not treated as standardized catch rates.
4. **Quantitative recurrence and contemporary applicability.** Port/mode creel estimates anchor broad strength and recurrence. Modern and recent periods receive more weight than older years, while 2023–2026 reports test whether the older quantitative pattern still applies.
5. **Coverage match.** Evidence for an excluded, closed, unresolved, or differently exposed structure stays qualified. Grand Haven North Pier and Manistee south-side construction are not silently treated as active coverage.

The 2024 Wisconsin open-water survey illustrates why fishery mode matters: statewide pier harvest estimates included 1,459 coho, 931 Chinook, 493 rainbow trout, 789 brown trout, but only three lake trout; those are statewide totals and cannot be copied directly into a Sheboygan score.^3 The same report had reduced 2024 sampling, used modeled estimates for unsampled spring periods, and did not include October in modeled ramp/pier/shore estimates.^3 These facts support regional plausibility and relative caution, not city-week precision.

## Peak calibration summary

| City | Chinook peak | Coho peak | Steelhead peak | Brown trout peak |
| --- | ---: | ---: | ---: | ---: |
| Ludington | Aug 30 · 8.3 | Oct 20 · 5.6 | Oct 20 · 8.1 | Apr 5 · 7.6 |
| Grand Haven | Sep 8 · 7.8 | Sep 10 · 8.8 | Oct 30 · 9.2 | Apr 15 · 7.6 |
| Manistee | Aug 30 · 9.5 | Oct 5 · 8.2 | Oct 28 · 10.0 | Apr 10 · 8.2 |
| Frankfort–Elberta | Aug 16 · 9.7 | Sep 15 · 8.6 | Oct 16 · 9.8 | Apr 5 · 7.5 |
| Sheboygan | Aug 31 · 9.6 | Apr 15 · 7.7 | Jul 15 · 7.3 | Apr 15 · 7.8 |

These are curve knots, not final daily forecasts. The final score can be materially lower when representative water temperature is less suitable.

## City findings

### Ludington

The official Pier/Dock record confirms late August–September Chinook but shows a meaningful modern decline, so Chinook stops at 8.3 rather than joining the premier tier. Coho remains a modest fall target at 5.6. October steelhead reaches 8.1 and April brown trout reaches 7.6. Winter brown and steelhead values apply only when open-water access is safe; the Chinook winter plateau is now exactly 1.0.

### Grand Haven

The active research scope is South Pier because North Pier is excluded during reported construction. September coho is highly recurrent and reaches 8.8; June–July and October steelhead are major windows and the fall maximum reaches 9.2. Chinook's recurring maximum remains September but stops at 7.8 because its modern density is lower and historical North Pier contribution is unresolved. Brown trout reaches 7.6 in April and 1.0 in August.

### Manistee

Manistee's late-August Chinook maximum is 9.5, October coho is 8.2, and October steelhead is the catalog reference at 10.0. Estimated Pier/Dock steelhead catch was positive in every surveyed October and its modern catch density is the highest core port/species/month result. Brown trout rises to 8.2 in April, while stale June strength remains down-weighted and August is 1.0.

### Frankfort–Elberta

Frankfort–Elberta reaches 9.7 for Chinook on August 16 and 9.8 for steelhead on October 16. September coho reaches 8.6. These three peaks combine unusually strong Pier/Dock density and recurrence with direct timing reports. Brown trout rises more moderately to 7.5 in April and stays good into May; older June strength remains reduced because recent catches are sparse.

### Sheboygan

Sheboygan is treated as a major pier-fishing city without a blanket city bonus. Chinook reaches 9.6 in late August because current DNR reporting documents extremely high effort and many successful pier anglers. Wisconsin's mode-specific pier tables, local relevance, and recurring observations support coho at 7.7, steelhead at 7.3, and brown trout at 7.8. Those three remain `medium` confidence because Wisconsin does not publish a contemporary Sheboygan-only Pier/Dock catch-per-effort table.

## Species-level pattern checks

### Chinook salmon

The Michigan curves preserve early feeding-access shoulders where supported and stronger late-summer staging peaks. Frankfort and Manistee remain highest. Ludington is reduced slightly because the modern record is less consistent, while Grand Haven's maximum moves from August to September. Sheboygan remains a strong late-August port.

### Coho salmon

Spring and fall remain distinct where supported, but the new port-level data change the ordering: Grand Haven September is strongest, followed by Frankfort September and Manistee October. Ludington is modest. Sheboygan has credible spring, July, and fall opportunities but remains limited by the absence of contemporary site-only effort data.

### Steelhead

October is exceptional at Manistee and Frankfort and good at Ludington. Grand Haven has three real windows—spring, June–July, and October—and the summer window is no longer described as modest. Sheboygan remains more variable. January–March ratings must always carry the separate open-water/access notice.

### Brown trout

All five cities peak in early or mid-April. Michigan DNR Pier/Dock catch-per-effort confirms that the former Michigan magnitudes were too conservative, while recent trend checks prevent historical strength from being projected without limit. Wisconsin's recent pier tables and Sheboygan stocking support a 6.5 spring ceiling, not an exceptional 8 and not an equal fall peak.

## Confidence and release disposition

| Confidence | Curves | Meaning |
| --- | ---: | --- |
| Medium-high | 17 | Michigan port/mode quantitative record plus direct timing reports, or equivalent strong local Chinook evidence at Sheboygan |
| Medium | 3 | Sheboygan coho, steelhead, and brown: strong local relevance and regional pier seasonality but no contemporary site-only catch-per-effort |
| Medium-low | 0 | No v0.4 core curve remains dependent mainly on isolated qualitative occurrence |
| Low | 0 | No core curve remains a pure regional-transfer hypothesis |

All 20 curves remain private. The temperature curves, representative-temperature pipeline, stale-read fallback, and authenticated ingestion path are implemented, but public release still requires historical/shadow replay, prospective outcome testing, current access verification, and independent domain review. This is a calibration milestone, not a release authorization.

## Validation plan

The next research and validation pass should use a structured observation record rather than editing ratings from memory:

| Field | Purpose |
| --- | --- |
| City, structure, date, and local time | Preserves exact coverage and timing |
| Species and method | Prevents generic salmon or bass reports from being relabeled |
| Angler-hours or sampled parties | Separates effort from catch |
| Catch and harvest counts | Supports comparable catch-per-effort estimates |
| Source and source date | Preserves provenance and staleness |
| Water-temperature series and sampling location | Tests the live suitability factor independently |
| Access/open-water status | Prevents unsafe or closed conditions from being encoded as low biology |
| Forecasted ceiling, suitability, and final score | Enables error analysis and recalibration |

Evaluation should occur prospectively for at least one complete open-water season and should emphasize ranking and band reliability rather than pretending a qualitative rating has an exact observed target. Useful checks include:

- false “good/excellent” rate when observed pier success is absent despite meaningful effort;
- whether higher-rated city/species days outperform lower-rated alternatives often enough to aid trip choice;
- calibration by displayed band and species, with confidence intervals;
- week-to-week rank stability under plausible knot uncertainty;
- leave-one-year-out testing so one exceptional run does not define the permanent curve;
- sensitivity to moving each knot by ±7 days and each rating by ±0.5;
- review of every abrupt slope, especially the August Chinook rise and October steelhead rise.

## Recommended implementation sequence

1. Preserve the v0.4 magnitude and city-ordering decisions as a frozen prospective cohort; do not tune from memorable trips.
2. Continue the historical/shadow replay and collect current effort-backed outcomes with all ratings private.
3. Measure false-high rates for every displayed band and examine all city/species disagreements between the model and observed pier results.
4. Verify one-decimal `X.X/10` presentation and ensure copy does not imply that every one-tenth difference is practically meaningful.
5. Obtain an independent Great Lakes fisheries/pier-angler review, prioritizing the three medium-confidence Sheboygan curves.
6. Expand to secondary species only after the four core species pass the replay and one open-water prospective validation cycle.

## Evidence ID additions

The original `A1–A20`, `F1–F40`, `S1–S8`, `L1`, and `T001–T032` registers remain in the prior research documents. This pass adds:

| ID | Source | Use |
| --- | --- | --- |
| F41 | [Michigan DNR, Aug. 21, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3b02c05) | Manistee and Ludington pier salmon timing |
| F42 | [Michigan DNR, July 1, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/41e9e6e) | Grand Haven steelhead; Manistee/Ludington negative pier context |
| F43 | [Michigan DNR, Aug. 5, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/423b34d) | Grand Haven, Manistee, and Ludington limited pier salmon/steelhead |
| F44 | [Michigan DNR, Aug. 26, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b) | Harbor/pierhead salmon transition at Grand Haven, Manistee, and Ludington |
| F45 | [Michigan DNR, Sept. 2, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4280cb4) | Warm-water suppression and staging-window location |
| F46 | [Michigan DNR, Apr. 24, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3987c22) | Spring brown/coho/steelhead pier occurrence across pilot ports |
| F47 | [Michigan DNR, Apr. 15, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4130cd0) | Grand Haven brown/coho and negative northern-port context |
| F48 | [Michigan DNR, Aug. 16, 2023](https://content.govdelivery.com/accounts/MIDNR/bulletins/36b27d5) | Frankfort great Chinook pier activity |
| F49 | [Michigan DNR, Oct. 16, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bc5a97) | Frankfort excellent steelhead; fall steelhead at other ports |
| F50 | [Michigan DNR, Oct. 30, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bf0cc8) | Grand Haven, Manistee, and Ludington steelhead |
| F51 | [Michigan DNR, Aug. 20, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3eeac7b) | Manistee pier Chinook/coho and Ludington comparison |
| F52 | [Michigan DNR, Oct. 27, 2021](https://content.govdelivery.com/accounts/MIDNR/bulletins/2f9782e) | Grand Haven pier steelhead/coho |
| M1 | [Michigan DNR Lake Michigan advisory minutes, Apr. 5, 2022](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-april-5-2022.pdf) | Port-level fishery-strength context; not pier-mode timing |
| M2 | [Michigan DNR Lake Michigan advisory minutes, Oct. 17, 2023](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-oct-17-2023.pdf) | Brown-trout stocking-site context; not catchability |
| M3 | [Michigan DNR Great Lakes creel dashboard](https://app.powerbigov.us/view?r=eyJrIjoiOWQ5NjQxMmItYjFkYi00YzI2LTkxMTAtMjMwNjEzOWE5YjM3IiwidCI6ImQ1ZmI3MDg3LTM3NzctNDJhZC05NjZhLTg5MmVmNDcyMjVkMSJ9) | 1997–2022 monthly port/species `Pier/Dock` catch plus effort; quantitative backbone for all Michigan curves |
| M4 | [Michigan DNR Lake Michigan port roadmap](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/LakeMichigaRoadmap.pdf) | Agency seasonal opportunity check, including cold-season brown trout and steelhead |
| M5 | [Michigan DNR 2025 Great Lakes recreational fisheries report and supplement](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049.pdf) | Current survey-method, corrected-Manistee, and aggregate 2025 Pier/Dock seasonality check; not a city-specific magnitude source |
| W1 | [Wisconsin DNR 2024 open-water sportfishing report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf) | Regional mode-specific harvest and survey limitations |
| W2 | [Wisconsin DNR Lake Michigan report, Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport) | Sheboygan Chinook effort and catches |
| W3 | [Wisconsin DNR 2022 open-water sportfishing report](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf) | Regional pier-mode month bins and long-term Sheboygan County effort |
| W4 | [Wisconsin DNR 2023 open-water sportfishing report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf) | Regional pier-mode month bins and long-term Sheboygan County effort |
| W5 | [Wisconsin DNR 2024 open-water sportfishing report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf) | Regional pier-mode month bins and long-term Sheboygan County effort |
| W6 | [Wisconsin DNR 2025 salmonid stocking summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf) | Current Sheboygan County and site-level fishery-support context; not catchability |
| W7 | [Wisconsin DNR report, Mar. 25, 2010, archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=3580.0) | Sheboygan South Pier rainbow/brown occurrence; historical, secondary-host provenance |
| W8 | [Wisconsin DNR report, Aug. 13, 2010, archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=4046.0) | Mixed salmonid catches from both Sheboygan piers; historical, secondary-host provenance |
| W9 | [Wisconsin DNR report, Sept. 9, 2010, archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=4116.0) | Fair Chinook/coho/brown catches from both Sheboygan piers; historical, secondary-host provenance |
| W10 | [Wisconsin DNR report, Apr. 14, 2011, archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=4601.0) | Low-number Sheboygan South Pier brown-trout occurrence; historical, secondary-host provenance |
| W11 | [Wisconsin DNR creel excerpt, Oct. 2011, newspaper archive](https://chicago.suntimes.com/news/2011/10/19/18602479/midwest-fishing-report-rivers-rolling-fall-patterns-minocqua-add) | Sheboygan pier coho/brown occurrence; historical, secondary-host provenance |
| W12 | [Southern Lake Michigan report, Sept. 7, 2019](https://www.seehafernews.com/2019/09/07/outdoor-report-2/) | Sheboygan pier Chinook/brown occurrence and effort context; secondary-host provenance |

## Sources

1. Michigan Department of Natural Resources. “[Creel Clerks & Angler Surveys](https://www.michigan.gov/dnr/managing-resources/fisheries/creel).” Accessed September 9, 2026.
2. Michigan Department of Natural Resources. “[Michigan Creel Sportfishing Estimates](https://app.powerbigov.us/view?r=eyJrIjoiOWQ5NjQxMmItYjFkYi00YzI2LTkxMTAtMjMwNjEzOWE5YjM3IiwidCI6ImQ1ZmI3MDg3LTM3NzctNDJhZC05NjZhLTg5MmVmNDcyMjVkMSJ9).” Great Lakes public dashboard, data through 2022.
3. Wisconsin Department of Natural Resources. “[2022](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf), [2023](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf), and [2024](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf) Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay,” pier-fishery tables.
4. Michigan Department of Natural Resources. “[Weekly Fishing Report: August 21, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3b02c05).” August 21, 2024; and “[Weekly Fishing Report: August 26, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b).” August 26, 2026.
5. Michigan Department of Natural Resources. “[Weekly Fishing Report: September 25, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3b7fd3a).” September 25, 2024.
6. Michigan Department of Natural Resources. “[Weekly Fishing Report: July 22, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/421929e).” July 22, 2026; and “[Weekly Fishing Report: August 26, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b).” August 26, 2026.
7. Michigan Department of Natural Resources. “[Weekly Fishing Report: April 24, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3987c22).” April 24, 2024; and “[Weekly Fishing Report: April 15, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4130cd0).” April 15, 2026.
8. Michigan Department of Natural Resources. “[Weekly Fishing Report: October 16, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bc5a97).” October 16, 2024; and “[Weekly Fishing Report: October 30, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bf0cc8).” October 30, 2024.
9. Michigan Department of Natural Resources. “[Weekly Fishing Report: August 16, 2023](https://content.govdelivery.com/accounts/MIDNR/bulletins/36b27d5).” August 16, 2023.
10. Michigan Department of Natural Resources. “[Weekly Fishing Report: October 16, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bc5a97).” October 16, 2024.
11. Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report — Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” August 31, 2026.
12. Michigan Department of Natural Resources. “[Lake Michigan Citizen’s Fishery Advisory Committee Minutes](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-oct-17-2023.pdf).” October 17, 2023, pp. 3–4.
