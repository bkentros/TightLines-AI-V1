# PierCast All-Port Seasonal Presence Audit — v0.3

> **Historical calibration artifact:** This audit remains the evidence foundation for timing and relative port ordering, but its numeric magnitudes were superseded by the [v0.4 full-scale recalibration](PierCast_Full_Scale_Seasonal_Recalibration_v0.4.md). Use the current JSON source of truth for live configuration; do not copy v0.3 values into the engine.

> **Formula-v2 interpretation:** The numerical curves and evidence conclusions in this audit are unchanged, but formula v2 treats each value as a **Seasonal Pier Opportunity Rating**, not an absolute ceiling. Only near-optimal thermal fit can exceed it, through a maximum five-percent multiplier on score headroom.

## Executive conclusion

The prior v0.2 curves were directionally useful but not sufficiently calibrated for release. They relied too heavily on narrative weekly reports and therefore understated several real pier fisheries. The most important correction is not simply “raise Sheboygan.” It is to use official, mode-specific creel estimates as the quantitative backbone and use weekly reports only to refine dates inside the broad monthly pattern.

The resulting v0.3 curves are materially stronger and more defensible:

- Brown trout is now a genuine good cold/early-spring target at all five ports. The former Sheboygan spring ceiling of 5.2 was too low; it is now 6.5. The unsupported equal-strength Sheboygan fall peak was removed.
- Grand Haven September coho and June–July/October steelhead were substantially understated.
- Manistee and Frankfort October steelhead are the strongest quantitatively supported species-port windows in the pilot and now reach 9.2 and 9.1 respectively.
- Ludington coho's former spring maximum was not supported by its long-term Pier/Dock record; its smaller maximum now occurs in fall.
- Chinook ordering remains broadly intact—Frankfort and Manistee first, Sheboygan next—but Grand Haven's maximum moves from August to September and Ludington is reduced slightly because its modern record is less consistent than its historical record.

These are **FinFindr Seasonal Pier Opportunity Ratings**, not agency ratings, fish-abundance indices, or catch probabilities. No curve is assigned 10/10. A 9-range seasonal rating is reserved for a port-month combination with both exceptional catch density and unusually high recurrence across surveyed years.

## What changed in the evidence base

Michigan DNR's creel clerks ask anglers about trip duration, target species, and catch, and the agency explicitly uses those surveys to manage fisheries.[^1] The public Great Lakes dashboard exposes estimates by year, port, month, species, fishing mode, and estimate type.[^2] For this audit, the dashboard was queried specifically for `Pier/Dock` mode at Ludington, Grand Haven, Manistee, and Frankfort–Elberta.

The repository now contains both the extracted source rows and a reproducible summary:

- [Official Michigan Pier/Dock estimates](PierCast_Michigan_Pier_Creel_Estimates_1989_2022.csv): 4,316 retained effort/catch/harvest rows.
- [Michigan monthly audit summary](PierCast_Michigan_Pier_Creel_Monthly_Summary.csv): long-term, modern, and recent catch-per-effort plus recurrence for each port, species, and surveyed month.
- [Dashboard extractor](../scripts/extract-pier-cast-michigan-creel.mjs) and [summary generator](../scripts/summarize-pier-cast-michigan-creel.mjs): reproducible research tooling.

The dashboard contains effort and harvest beginning in 1989 and total-catch estimates beginning in 1997; its public data currently end in 2022 even though the report was refreshed in 2025. Therefore, 1997–2022 total catch is the long series, 2012–2022 excluding disrupted 2020 is the modern comparison, and 2018–2022 excluding 2020 is a recency check. Current DNR weekly reports and management documents prevent the series ending in 2022 from being treated as a claim about 2026 conditions.

Wisconsin does not expose an equivalent contemporary Sheboygan-only monthly Pier/Dock table. Its annual creel reports do, however, publish mode-specific pier estimates across all Wisconsin Lake Michigan/Green Bay survey areas. Those reports establish seasonality and regional plausibility, while current Sheboygan stocking and local creel reports establish local relevance.[^6][^7][^8][^9][^10] Sheboygan therefore remains `medium` rather than `medium_high` for coho, steelhead, and brown trout.

## Quantitative guardrail

The audit uses a nonbinding evidence score to catch implausible manual assignments. It does **not** replace the simple production formula and is not calculated at runtime.

For each Michigan port/species/month:

```text
longCPUE   = total 1997–2022 catch / surveyed Pier-Dock hours × 1,000
modernCPUE = total 2012–2022 catch, excluding 2020 / surveyed hours × 1,000
blendedCPUE = 0.40 × longCPUE + 0.60 × modernCPUE

blendedRecurrence =
  0.40 × long positive-catch-year share +
  0.60 × modern positive-catch-year share

evidenceGuide = 1 + 8.5 ×
  min(1, ln(1 + blendedCPUE) / ln(121)) ×
  (0.70 + 0.30 × blendedRecurrence)
```

The logarithm prevents one huge run from overwhelming every other curve. Recurrence penalizes a high catch estimate concentrated in only one or two years. A missing species row is treated as zero catch only when that same port-month-year has positive surveyed Pier/Dock effort. Months without survey effort are missing data, not zero fishing.

The guide is intentionally not copied directly into the configured score. Weekly reports refine the location of arrivals and peaks; recent five-year direction can lower a stale historical maximum; structure-coverage ambiguity lowers confidence; and a narrow, directly documented week can sit above its monthly average.

## Michigan port audit

The table below shows the most decision-relevant official results. Catch density is estimated total catch per 1,000 surveyed Pier/Dock angler-hours. “Positive share” is the fraction of surveyed years with a positive catch estimate. The modern period is 2012–2022 excluding 2020.

| Port and target month | Long CPUE | Long positive share | Modern CPUE | Modern positive share | Calibration consequence |
| --- | ---: | ---: | ---: | ---: | --- |
| Ludington Chinook, Aug | 61.5 | 62% | 19.6 | 50% | Keep a good late-August peak, but lower it below exceptional |
| Ludington steelhead, Oct | 87.8 | 77% | 42.8 | 50% | Raise the fall ceiling materially |
| Ludington brown, Apr | 50.6 | 72% | 62.9 | 60% | Former 5.2 ceiling was too low |
| Grand Haven Chinook, Sep | 30.6 | 92% | 12.3 | 90% | Move the recurring maximum into September |
| Grand Haven coho, Sep | 54.1 | 92% | 58.5 | 100% | Raise to a strong, highly recurrent 7.8 window |
| Grand Haven steelhead, Jun | 52.8 | 60% | 96.7 | 90% | June–July is a major window, not a modest shoulder |
| Grand Haven steelhead, Oct | 61.4 | 88% | 67.7 | 90% | Raise the fall maximum to 8.3 |
| Grand Haven brown, Apr | 43.7 | 96% | 39.3 | 90% | Raise while retaining a clear warm-season decline |
| Manistee Chinook, Aug | 76.0 | 73% | 28.3 | 70% | Retain the strong late-August window |
| Manistee coho, Oct | 12.3 | 73% | 44.8 | 80% | Modern data support a stronger October maximum |
| Manistee steelhead, Oct | 112.5 | 100% | 159.8 | 100% | Exceptional and uniquely recurrent; 9.2 is justified |
| Manistee brown, Apr | 56.5 | 100% | 46.1 | 100% | Stronger than the former 6.2, but recent decline prevents an 8 |
| Frankfort Chinook, Aug | 109.0 | 69% | 68.3 | 70% | Retain an exceptional staging peak |
| Frankfort coho, Sep | 35.1 | 73% | 53.8 | 90% | September, not October, is the stronger recurring anchor |
| Frankfort steelhead, Oct | 90.5 | 100% | 92.2 | 100% | Exceptional and stable; raise to 9.1 |
| Frankfort brown, Apr | 61.9 | 80% | 31.1 | 60% | Good spring target; recency check keeps it below 7 |

### Brown-trout finding

The user's concern was valid. Brown trout had been held down because many narrative reports said “a few” or “slow,” but that language was not normalized for effort. The official Pier/Dock series shows that April brown trout recur at all four Michigan ports and can represent substantial catch density. Michigan DNR's own port roadmap also lists cold-season brown-trout opportunity at Frankfort, Ludington, Manistee, and the Muskegon/Grand Haven area.[^3]

The correction is not to make browns high all year. The quantitative record and agency guidance support a cold-water shape: meaningful winter opportunity when the water and structure are safely open, a March rise, an April peak, a May decline, and generally weak midsummer access. Michigan DNR has also documented a long-term lakewide brown-trout biomass decline and a sharp decline in Ludington total catch, so the v0.3 peaks remain in the mid-to-upper 6s instead of the 8s.[^4] Continued stocking—81,000 at Ludington, 60,000 at Manistee, 50,000 at Frankfort, and a new 20,000 allocation at Grand Haven—supports present local relevance without proving pier catchability by itself.[^5]

## Sheboygan audit

Sheboygan is not treated as a weak port. The 2024 stocking summary records 44,691 brown trout, 159,146 Chinook (river plus harbor), 66,094 coho, and 33,347 rainbow trout at Sheboygan locations.[^9] The Wisconsin DNR's 2024 report also states that the exceptional coho fishery extended north through Sheboygan County.[^8]

For pier seasonality, the three latest comparable statewide reports show:

| Year | Coho pattern | Chinook pattern | Rainbow pattern | Brown pattern |
| --- | --- | --- | --- | --- |
| 2022 | Low but spread May–Oct | Strongest Aug and Sep/Oct | Small July pulse | Variable May–Oct, strongest Aug |
| 2023 | Present Mar/Apr through Sep/Oct, strongest July | Strongest July and Sep/Oct | Very low | Small spring window |
| 2024 | Strong Mar/Apr, May, and July | Strong July through Sep/Oct | Strongest July, secondary spring | Strongly concentrated Mar/Apr and May |

The variability is real; it argues against copying one year's pattern. Across the three years, Chinook's late-summer peak is stable, coho has legitimate spring and summer/fall opportunities, rainbow/steelhead is episodic with spring and July support, and brown trout is best represented by a primary cold/early-spring window. The 2024 pier estimate alone included 542 browns in March/April and 222 in May, compared with none from July onward.[^8] That is why Sheboygan brown rises from 5.2 to 6.5 in April while the former equal 5.2 September peak falls to 4.5.

The 6.5 ceiling is intentionally not an 8: modern Sheboygan-only Pier/Dock catch-per-effort remains unavailable. Current stocking and multiple local pier observations make a “good” rating defensible; they do not establish an exceptional site-specific catch rate.

## Final v0.3 peaks

| City | Chinook | Coho | Steelhead | Brown trout |
| --- | ---: | ---: | ---: | ---: |
| Ludington | Aug 30 · 7.8 | Oct 20 · 5.2 | Oct 20 · 7.3 | Apr 5 · 6.5 |
| Grand Haven | Sep 8 · 7.2 | Sep 10 · 7.8 | Oct 30 · 8.3 | Apr 15 · 6.5 |
| Manistee | Aug 30 · 8.7 | Oct 5 · 7.3 | Oct 28 · 9.2 | Apr 10 · 6.8 |
| Frankfort–Elberta | Aug 16 · 8.8 | Sep 15 · 7.5 | Oct 16 · 9.1 | Apr 5 · 6.6 |
| Sheboygan | Aug 31 · 8.3 | Apr 15 · 6.3 | Jul 15 · 5.8 | Apr 15 · 6.5 |

The full curve—not just the peak—is authoritative. Sparse date knots remain the right representation because the data support broad monthly structure plus narrower reported transitions. The generated weekly CSV is still a review projection, and daily scores are interpolated continuously between knots.

## Confidence and remaining uncertainty

All 16 Michigan curves are now `medium_high` because they combine a 26-year port- and mode-specific quantitative record with direct weekly reporting and management context. “Medium-high” applies to the **broad ordering and seasonal shape**, not to the proposition that 7.8 is scientifically distinguishable from 7.6.

Sheboygan Chinook is `medium_high` because it has a current, structure-specific DNR report plus stable regional seasonality. Sheboygan coho, steelhead, and brown trout are `medium`: local relevance is strong, but contemporary site-only monthly catch and effort are not publicly available.

The following release caveats remain mandatory:

1. January–March ratings only apply when the covered structure is legally open, physically accessible, and has safe open water. Access status is not encoded as biology.
2. Creel estimates are estimates with sampling uncertainty. They are not direct fish counts.
3. Pier/Dock catch per total angler-hour is a fishery-strength indicator, not target-specific angler success probability.
4. The Michigan quantitative series ends in 2022; recent reports and prospective validation must detect structural changes.
5. Exact weekly decimals are interpolation and product calibration, not measured agency coefficients.

## Product decision

No additional runtime variables are warranted. This deeper research changes the configured seasonal ratings, not the product's simple two-input structure:

```text
finalScore = 1 + (seasonalOpportunityCeiling - 1) × temperatureSuitability
```

The completed [v0.3 seasonal replay](PierCast_Seasonal_Calibration_Replay_v0.3.md) confirms strong retrospective consistency across the Michigan monthly archive, but it is intentionally labeled in-sample because that archive informed calibration. The right next validation step is a prospective shadow ledger using current observations. The curves should remain private until prospective review confirms that “good” and “excellent” labels do not produce an unacceptable false-high rate.

## Sources

[^1]: Michigan Department of Natural Resources, [“Creel Clerks & Angler Surveys”](https://www.michigan.gov/dnr/managing-resources/fisheries/creel), accessed September 10, 2026.
[^2]: Michigan Department of Natural Resources, [“Michigan Creel Sportfishing Estimates” Power BI dashboard](https://app.powerbigov.us/view?r=eyJrIjoiOWQ5NjQxMmItYjFkYi00YzI2LTkxMTAtMjMwNjEzOWE5YjM3IiwidCI6ImQ1ZmI3MDg3LTM3NzctNDJhZC05NjZhLTg5MmVmNDcyMjVkMSJ9), data through 2022; report refresh April 23, 2025.
[^3]: Michigan Department of Natural Resources, [“Roadmap to Fishing Lake Michigan: Meet Your Match!”](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/LakeMichigaRoadmap.pdf), March 2018.
[^4]: Michigan Department of Natural Resources, [Lake Michigan Citizen's Fishery Advisory Committee minutes](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-april-5-2022.pdf), April 5, 2022, pp. 2–3.
[^5]: Michigan Department of Natural Resources, [Lake Michigan Citizen's Fishery Advisory Committee minutes](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-oct-17-2023.pdf), October 17, 2023, pp. 3–4.
[^6]: Wisconsin Department of Natural Resources, [“Wisconsin's 2022 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay”](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf), May 2023, Table 6.
[^7]: Wisconsin Department of Natural Resources, [“Wisconsin's 2023 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay”](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf), May 2024, Table 6.
[^8]: Wisconsin Department of Natural Resources, [“Wisconsin's 2024 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay”](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf), May 2025, Table 6 and survey limitations.
[^9]: Wisconsin Department of Natural Resources, [“Wisconsin's Lake Michigan Salmonid Stocking Summary”](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf), 2025, 2024 stocking tables.
[^10]: Wisconsin Department of Natural Resources, [“Lake Michigan Outdoor Fishing Report — Aug. 31, 2026”](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport), August 31, 2026.
