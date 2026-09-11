# PierCast Full-Scale Seasonal Recalibration

## Executive conclusion

PierCast’s v0.3 seasonal curves had credible timing and relative ordering, but their magnitude rubric was too compressed for a consumer-facing 1–10 product. The calibration explicitly reserved 9.5–10.0 until prospective validation, which made a displayed 10 impossible and kept several exceptional, repeatedly documented pier fisheries in the same broad range as merely good fisheries. That was a release policy embedded in the score scale rather than a defensible statement about opportunity.

Version 0.4 keeps the two-input model, temperature formula, adaptive date anchors, city/species boundaries, and evidence confidence rules. It recalibrates every one of the 20 city × species curves against a shared full-scale rubric. This is not a `+2` adjustment or a mathematical stretch: changes vary by fishery and date, weak periods remain weak, and 13 knots representing negligible opportunity are now exactly `1.0`.

Four narrow peak windows can produce a final `10.0/10` when the independent temperature suitability is nearly optimal: Manistee steelhead, Frankfort–Elberta Chinook, Frankfort–Elberta steelhead, and Sheboygan Chinook. A fifth, Manistee Chinook, can approach 10. Other city/species combinations retain lower evidence-supported ceilings.

The values remain **provisional FinFindr ratings**, not agency ratings, fish-abundance indices, or catch probabilities. Public ratings remain disabled pending prospective outcomes and the separate temperature-representation gate.

## Decision and scope

The reviewed question is:

> Under broadly supportive water temperature, how strong is the historically supported opportunity to target this species from the covered pier or breakwater on this date?

The answer owns location quality and seasonal timing. The live water-temperature series remains the only dynamic numeric input:

```text
temperatureModifier = 0.30 + 0.75 × temperatureSuitability
finalScore = clamp(1, 10,
  1 + (seasonalOpportunityRating - 1) × temperatureModifier
)
```

The review covers Chinook salmon, coho salmon, steelhead, and brown trout at Ludington, Grand Haven, Manistee, Frankfort–Elberta, and Sheboygan. It does not add depth, wind, bait, waves, lake level, angler skill, or a separate port-quality multiplier. Those additions would either duplicate information already represented by city-specific seasonality or exceed the present evidence.

## Full-scale rubric

| Seasonal rating | Product meaning under broadly supportive temperature | Evidence expectation |
|---|---|---|
| 1.0 | Negligible meaningful opportunity | Researched dead interval; not a substitute for unknown data |
| 1.1–2.0 | Poor | Rare, incidental, or strongly inaccessible seasonal occurrence |
| 2.1–4.0 | Limited | Inconsistent shoulder or narrow opportunity |
| 4.1–6.0 | Fair | Credible, repeatable target opportunity with material limitations |
| 6.1–8.0 | Good | Strong local or mode-specific evidence and useful targetability |
| 8.1–9.4 | Excellent | Exceptional recurring window with strong local support |
| 9.5–10.0 | Premier peak | One of the strongest supported pier opportunities in the five-city catalog |

`10` means the top of FinFindr’s opportunity scale—not certainty of catching a fish. Conversely, `1` means negligible modeled target opportunity, not biological extinction or a legal closure. Access and open water remain separate eligibility questions.

## Evidence hierarchy and calibration method

The primary Michigan evidence remains the Michigan DNR’s port-, month-, species-, and `Pier/Dock`-specific creel estimates. Creel clerks record trip duration, target species, and catch, and the estimates use a stratified multistage survey design.[^1][^2] The repository’s reproducible extract contains 4,316 effort/catch/harvest rows through 2022. The long series, modern-period catch per 1,000 angler-hours, and positive-catch-year recurrence anchor broad strength and port ordering.[^3]

The April 2026 Michigan statewide report adds important methodological context. It confirms that 2025 creel surveys covered March at all four pilot Michigan ports, November at Manistee and Ludington, and regular open water through October. It also reports that historical Manistee interval-count records through 2024 were corrected in the official database after an underestimation problem was identified.[^4] The current public Power BI model queried for this repository still exposes records only through 2022; therefore, the 2025 statewide report and its mode-specific supplement are used as contemporary seasonality checks rather than silently merged into the older port-level extract.

The 2025 Michigan `Pier/Dock` supplement reinforces the core calendar: combined Lake Michigan pier total catch was concentrated in March–April and November for rainbow trout, March–May for brown trout, March–May plus August for coho, and August–September for Chinook.[^5] It does not identify individual ports and therefore cannot justify a city-specific magnitude by itself.

For Wisconsin, the 2022–2024 DNR open-water reports provide mode-specific pier totals and multi-month seasonality.[^6][^7][^8] They do not provide a contemporary Sheboygan-only pier catch-per-effort cross-tabulation. Local strength is instead bounded by current stocking, direct structure-level observations, and the regional pier pattern. The August 31, 2026 DNR report is unusually strong direct evidence for Sheboygan Chinook: it records extremely high pier/shore effort and many anglers leaving the piers with one or two Chinook.[^9]

Each curve was judged across five dimensions:

1. **Fishing-mode fit:** pier/dock evidence outranks boats, charters, rivers, and general port reputation.
2. **Locality:** the named pier or harbor mouth outranks regional or statewide evidence.
3. **Strength:** catch per effort, limits, many successful parties, or unusually strong report language support higher ratings.
4. **Recurrence and recency:** repeat positive years and contemporary reports outrank a single old event.
5. **Scope integrity:** excluded structures, construction, missing effort, and mixed harbor/offshore reports limit magnitude or confidence.

The numerical result is an analytical product judgment. No agency source assigns these 1–10 values, and nearby decimals should not be interpreted as biologically distinct measurements.

## Peak decisions across all 20 curves

| City | Species | v0.3 peak | v0.4 peak | Decision basis |
|---|---|---:|---:|---|
| Ludington | Chinook | 7.8 | **8.3** | Recurring Aug.–Sep pier fishery, but modern decline prevents premier status |
| Ludington | Coho | 5.2 | **5.6** | Real but modest recurring fall opportunity; no prestige uplift |
| Ludington | Steelhead | 7.3 | **8.1** | Strong October density and recurring fall reports |
| Ludington | Brown trout | 6.5 | **7.6** | April catch density and recurrence support a strong target fishery |
| Grand Haven | Chinook | 7.2 | **7.8** | Highly recurrent September occurrence, moderated for lower modern density and North Pier exclusion |
| Grand Haven | Coho | 7.8 | **8.8** | September positive in every modern surveyed year with strong catch density |
| Grand Haven | Steelhead | 8.3 | **9.2** | Two major windows: June–July and October, both strongly recurrent |
| Grand Haven | Brown trout | 6.5 | **7.6** | April occurred in 90% of modern surveyed years and every recent surveyed year |
| Manistee | Chinook | 8.7 | **9.5** | Elite late-August port with strong recurrence and direct contemporary pier reports |
| Manistee | Coho | 7.3 | **8.2** | Modern October density and recurrence support an excellent fall window |
| Manistee | Steelhead | 9.2 | **10.0** | Highest pilot port/species/month density and 100% October recurrence |
| Manistee | Brown trout | 6.8 | **8.2** | April has 100% long and modern recurrence; recent decline limits broader shoulder inflation |
| Frankfort–Elberta | Chinook | 8.8 | **9.7** | Strongest Michigan Chinook density plus direct “great activity” pier evidence |
| Frankfort–Elberta | Coho | 7.5 | **8.6** | Strong September density and 90% modern recurrence |
| Frankfort–Elberta | Steelhead | 9.1 | **9.8** | 100% October recurrence, high density, and direct excellent both-pier reports |
| Frankfort–Elberta | Brown trout | 6.6 | **7.5** | Strong April–May record; weaker recent trend prevents an excellent rating |
| Sheboygan | Chinook | 8.3 | **9.6** | Current direct evidence of extremely high effort and widespread pier success |
| Sheboygan | Coho | 6.3 | **7.7** | Exceptional recent regional coho fishery, repeated pier seasonality, and local stocking; still below excellent without site CPUE |
| Sheboygan | Steelhead | 5.8 | **7.3** | Repeated regional July pier signal and local relevance justify good, not excellent |
| Sheboygan | Brown trout | 6.5 | **7.8** | Strong modern regional March–May pier signal plus recurring local observations |

The exact dates remain adaptively spaced knots. Broad slow periods still use wide spacing, while fast staging and decline windows retain closely spaced August–October anchors. Weekly values remain deterministic midpoint exports, not 1,040 independently researched coefficients.

## City findings

### Ludington

Ludington is strong but not uniformly elite across all four targets. Chinook reaches excellent territory in late August, while the official modern record prevents equating it with Frankfort, Manistee, or the current Sheboygan peak. Current reports also preserve both positive staging observations and warm-water/slow-pier contradictions.[^10] October steelhead and April brown trout receive larger evidence-driven increases. Coho remains a fair fall target; it is deliberately not elevated merely because Ludington is a respected salmon port.

The Chinook winter plateau is now `1.0`, reflecting negligible meaningful pier opportunity rather than an unavailable research state. Steelhead and brown trout retain nontrivial winter values because agency guidance and cool-season occurrence support opportunity when the structure is safely open.[^14]

### Grand Haven

Grand Haven receives strong species-specific differentiation. September coho and June–July/October steelhead are genuinely exceptional in the mode-specific record and now use the excellent range. Brown trout becomes a strong April target. Chinook remains good rather than premier because modern catch density is lower, and the historical creel record may include North Pier while the present product scope excludes that structure during construction.

This is not a weak-city calibration: Grand Haven has two of the strongest non-Chinook opportunities in the pilot. Its August brown-trout value moves to `1.0` because both the long and modern records show negligible warm-season pier opportunity.

### Manistee

Manistee October steelhead is the reference `10.0` seasonal opportunity. It is the strongest supported Michigan port/species/month result: 100% positive October recurrence in both the long and modern periods, with the highest modern catch density in the core dataset; current DNR reports also continue to document the fall pier fishery.[^11] The rating still does not promise a catch; poor temperature can lower the final score substantially.

Late-August Chinook rises to `9.5`, October coho to `8.2`, and April brown trout to `8.2`. Brown trout remains sharply seasonal, reaching `1.0` in August rather than inheriting spring strength year-round.

### Frankfort–Elberta

Frankfort–Elberta now contains two premier windows: mid-August Chinook at `9.7` and mid-October steelhead at `9.8`. Both combine exceptional official pier-mode evidence with direct structure-level reporting.[^11][^12] September coho rises to `8.6`; spring brown trout rises more moderately to `7.5` because recent support is weaker than the older record.

The narrow late-summer Chinook shape is preserved rather than replaced with a high summer plateau. January, mid-November, and December Chinook anchors reach `1.0`.

### Sheboygan

Sheboygan is calibrated as a major pier-fishing city without applying a citywide bonus. Its Chinook peak rises to `9.6`, supported by the strongest current local report in the five-city evidence set. The report’s very high observed effort and many successful pier anglers are sufficient for a narrow premier rating, even though it is not a standardized CPUE estimate.[^9]

Coho (`7.7`), steelhead (`7.3`), and brown trout (`7.8`) are now meaningfully stronger than v0.3. Wisconsin’s 2024 pier harvest included 1,459 coho, 931 Chinook, 493 rainbow trout, and 789 brown trout, and its seasonal tables support spring coho/brown, summer steelhead, and late-summer Chinook.[^8] Current stocking confirms continued local fishery relevance but is not treated as catchability evidence.[^13] These are statewide mode-specific totals, so the three non-Chinook curves remain `medium` confidence and stop below the excellent band.

This produces the intended product behavior: Sheboygan can be premier for kings, strong for several other salmonids, and still vary materially by species and date.

## Range and formula checks

The authoritative 20 curves contain:

- 13 explicit `1.0` knots across researched dead intervals;
- one explicit `10.0` seasonal knot at Manistee steelhead’s October peak;
- 37 exact `1.0` values in the 1,040-row weekly midpoint review export;
- 40 weekly values in the `>8.0` excellent range; and
- a weekly midpoint range of `1.0–9.8` (the exact `10.0` knot falls between weekly midpoints).

At perfect temperature suitability, the theoretical city/species maxima range from `5.83` for Ludington coho to `10.0` for four premier curves. Temperature still cannot create a high rating from a weak seasonal profile. For example, a seasonal `4.0` reaches only `4.15` at perfect suitability, while a seasonal `1.0` remains exactly `1.0`.

The v0.4 retrospective replay retains or slightly improves agreement with the Michigan evidence archive: Spearman correlation is `0.857` against the nonbinding evidence guide, `0.841` against log modern CPUE, and `0.831` against modern positive-year share. All 16 Michigan curves peak in the official evidence peak month or an adjacent month, and no configured monthly value of at least `6.0` lacks aggregate catch support. These are in-sample consistency checks, not predictive validation.

## Limitations and release decision

The largest remaining uncertainty is Sheboygan’s lack of contemporary city-only pier effort and catch tables. Regional Wisconsin pier totals and direct local reports support the revised shapes, but they cannot prove that a `7.7` is distinguishable from a `7.3`. Grand Haven’s historical North Pier contribution and current exclusion also constrain citywide transfer. The Michigan public port-level series ends in 2022 despite newer aggregate reporting, and individual weeks remain more variable than a permanent curve can express.

The v0.3 prospective cohort remains immutable. Because v0.4 changes the seasonal calibration and engine version, it starts a new shadow cohort under `pier-cast-simple-model-v0.8.0` and `piercast-core-seasonal-v0.4.0`. Old forecasts and any future outcomes attached to them must not be pooled silently with v0.4.

Public enablement remains blocked. The next evidentiary steps are structured, non-selective outcome collection—including blank trips—and independent review by a Great Lakes pier specialist. The first 50 eligible outcomes are a data-quality checkpoint only; the confirmatory threshold remains at least 200 balanced, effort-backed outcomes over two open-water seasonal cycles.

## Sources

[^1]: Michigan Department of Natural Resources. “[Creel Clerks & Angler Surveys](https://www.michigan.gov/dnr/managing-resources/fisheries/creel).” Accessed September 10, 2026.
[^2]: Michigan Department of Natural Resources. “[Michigan Creel Sportfishing Estimates](https://app.powerbigov.us/view?r=eyJrIjoiOWQ5NjQxMmItYjFkYi00YzI2LTkxMTAtMjMwNjEzOWE5YjM3IiwidCI6ImQ1ZmI3MDg3LTM3NzctNDJhZC05NjZhLTg5MmVmNDcyMjVkMSJ9).” Port/month/species/mode estimate database, public model currently exposing data through 2022.
[^3]: FinFindr research extract. [Michigan Pier/Dock estimates](PierCast_Michigan_Pier_Creel_Estimates_1989_2022.csv) and [derived monthly summary](PierCast_Michigan_Pier_Creel_Monthly_Summary.csv). Reproducibly extracted from source 2.
[^4]: Michigan Department of Natural Resources. “[2025 Michigan Great Lakes Recreational Fisheries: Creel Surveys, Charter Reporting, and Historical Trends](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049.pdf).” Fisheries Report 49, approved April 1, 2026, pp. 8–18.
[^5]: Michigan Department of Natural Resources. “[2025 Creel Summary Supplement](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049_supp_material_Creel_Summary_2025.xlsx).” `Pier_Dock_Lake_Michigan_2025` worksheet.
[^6]: Wisconsin Department of Natural Resources. “[Wisconsin’s 2022 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf).” Table 6.
[^7]: Wisconsin Department of Natural Resources. “[Wisconsin’s 2023 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf).” Table 6, May 2024.
[^8]: Wisconsin Department of Natural Resources. “[Wisconsin’s 2024 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf).” Tables 1 and 6, May 2025.
[^9]: Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report — Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” Sheboygan County pier/shore section.
[^10]: Michigan Department of Natural Resources. “[Weekly Fishing Report — August 26, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b)” and “[September 2, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4280cb4).” Current staging and warm-water context at Grand Haven, Manistee, and Ludington.
[^11]: Michigan Department of Natural Resources. “[Weekly Fishing Report — October 16, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bc5a97)” and “[October 30, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bf0cc8).” Fall pier steelhead context.
[^12]: Michigan Department of Natural Resources. “[Weekly Fishing Report — August 16, 2023](https://content.govdelivery.com/accounts/MIDNR/bulletins/36b27d5).” Frankfort Chinook pier activity.
[^13]: Wisconsin Department of Natural Resources. “[Wisconsin’s Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf).” 2025 publication, 2024 stocking tables.
[^14]: Michigan Department of Natural Resources. “[Roadmap to Fishing Lake Michigan: Meet Your Match!](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/LakeMichigaRoadmap.pdf).” March 2018.
