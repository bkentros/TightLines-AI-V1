# PierCast Seasonal Granularity and Sheboygan Calibration Audit

> **Historical v0.2 artifact:** The architectural decision in this document remains valid, but its Sheboygan magnitudes and confidence labels have been superseded by the [v0.3 all-port evidence audit](PierCast_All_Port_Seasonal_Presence_Audit_v0.3.md), the [v0.4 full-scale recalibration](PierCast_Full_Scale_Seasonal_Recalibration_v0.4.md), and the current JSON source of truth.

Research date: 2026-09-10<br>
Disposition: private, provisional calibration; not approved for public claims

## Decision

PierCast should keep **daily interpolation from adaptively spaced date anchors**.

It should not use 52 independently configured weekly ratings. That would imply far more evidence than exists, create artificial week-boundary jumps, and make the model easy to overfit to one unusual year. It should also not use twelve monthly values as the sole source of truth. A monthly grid is too coarse for salmon staging and fall steelhead windows that can materially change within ten to twenty days.

The operational design is:

- use broad monthly or four-to-eight-week anchors where opportunity changes slowly;
- use weekly or five-to-ten-day anchors around a documented arrival, peak, or decline;
- interpolate continuously by date between anchors, including across December–January;
- continue exporting 52 weekly midpoint values for human review;
- treat the weekly CSV as a review projection, never as 52 separately researched facts.

This is the model already implemented in `PierCast_Core_Species_Seasonal_Curves.json`. The audit confirms that architecture and rejects a switch to fixed monthly ratings.

## Why adaptive anchors are the most accurate simple model

The public evidence is temporally uneven. Agency reports can identify a strong week, a slow week, or a seasonal mode-level pattern, but they do not provide standardized city-by-pier catch rates for every calendar week. Wisconsin DNR's 2022–2024 reports use a stratified-random creel design, but the published pier tables combine all survey areas and report multi-month bins rather than Sheboygan-by-week estimates.[^1][^2][^3] Michigan's public weekly reports are useful date-specific observations, but generally do not expose the sampled angler-hours needed to turn every report into a comparable weekly coefficient.

Adaptive anchors preserve the date precision that actually exists without manufacturing precision in evidence gaps. They also let the separate live water-temperature factor move a forecast down when near-pier water is unfavorable; temperature should not be baked into the permanent seasonal curve a second time.

## Sheboygan finding

The earlier low-confidence treatment of Sheboygan coho, steelhead, and brown trout was primarily an **evidence-collection gap**, not evidence that Sheboygan is a mediocre fishing port.

Three independent evidence layers support that conclusion:

1. **Sustained fishery use.** Wisconsin DNR estimates Sheboygan County averaged 183,515 angler-hours per year from 2015 through 2024 across surveyed Lake Michigan fishing modes. The 2024 estimate was 197,849 hours. This establishes a heavily used fishery, although it cannot by itself be converted to pier opportunity because the table combines modes.[^3]
2. **Current local fishery support.** Wisconsin's 2024 stocking summary lists 44,691 brown trout, 159,146 Chinook, 66,094 coho, and 33,347 rainbow trout stocked in Sheboygan County. The detailed table places Chinook in Sheboygan Harbor and River and coho in the Sheboygan River. Stocking supports local relevance and return/staging potential; it is not a catch-rate estimate.[^4]
3. **Structure-specific recurrence.** A current Wisconsin DNR report documented extremely high Sheboygan pier/shore effort and many anglers leaving with Chinook in the week ending August 31, 2026.[^5] Archived reproductions of older DNR reports document south-pier rainbow and brown trout in March 2010, mixed rainbow/coho/Chinook/brown trout catches from the piers in August 2010, fair numbers of Chinook/coho/browns from both piers in September 2010, low numbers of south-pier browns in April 2011, and some pier coho/browns in October 2011.[^6][^7][^8][^9][^10] A September 2019 creel-style report also recorded a handful of fish from the piers, mostly kings with smaller browns.[^11]

The archived pages are not equivalent to a live agency URL, so they receive less provenance weight. Their value is recurrence and season shape, not exact numerical magnitude.

## What the statewide pier data changes

The combined Wisconsin pier tables are not Sheboygan-specific, but three consecutive years are useful as a regional regularizer:

| Species | 2022–2024 combined pier-harvest pattern | Calibration implication |
| --- | --- | --- |
| Coho | Spring was recurring, but July was the largest combined bin; July harvest appeared in all three years | Do not force Sheboygan coho into only spring and fall peaks; retain a credible summer shoulder under supportive temperature |
| Chinook | Harvest was concentrated from July through September/October in all three years | Preserve a broad summer-to-staging window, with local evidence controlling Sheboygan's late-August peak |
| Rainbow/steelhead | Highly variable, but July contributed most of the three-year combined pier harvest | A modest summer opportunity is defensible; do not infer a high Sheboygan fall peak without direct local data |
| Brown trout | Most combined harvest occurred in March/April and May | Keep spring as the primary pier window; local historical fall occurrences justify a smaller secondary window |

The coho finding is the most material correction. The old Sheboygan curve fell to `2.0` in late July, even though statewide pier harvest contained 90 coho in July 2022, 590 in July 2023, and 828 in July 2024.[^1][^2][^3] Version 0.2 therefore adds a July anchor and raises the summer shoulder while retaining a conservative confidence label.

## Calibration changes made in v0.2

| Curve | Change | Reason |
| --- | --- | --- |
| Sheboygan Chinook | Confidence `medium_low` → `medium`; peak remains 8.3 | Strong current local week plus recurring local late-summer/fall observations; no basis to inflate an already exceptional peak |
| Sheboygan coho | Confidence `low` → `medium_low`; added July 5.2 and local Aug.–Oct. anchors; fall peak 5.8 | Corrects the missing summer opportunity and replaces a purely regional fall hypothesis with dated local recurrence |
| Sheboygan steelhead | Confidence `low` → `medium_low`; July 3.5 → 4.2 | Local spring/summer occurrence, current stocking, and repeated regional July pier signal; fall magnitude remains cautious |
| Sheboygan brown trout | Confidence `low` → `medium_low`; spring peak 5.2 and secondary Sept. peak 5.2 | Multiple local pier observations support both windows, but most are old and qualitative |

These changes recognize Sheboygan as a serious pier fishery without applying a citywide prestige bonus. Chinook can be exceptional while the available evidence supports only fair-to-good ceilings for another species. That is a feature of an accurate target-specific model, not an inconsistency.

## Remaining lower-confidence curves

The next evidence pass should cover the six Michigan curves still below medium confidence:

- Ludington coho and brown trout;
- Grand Haven Chinook, coho, and brown trout;
- Frankfort–Elberta coho.

The existing Michigan DNR archive already supports several of their major windows. For example, DNR documented decent Ludington pier catches of brown trout, steelhead, and coho on April 12, 2023;[^12] recurring Grand Haven pier coho and brown trout in April 2021, 2023, 2024, 2025, and 2026;[^13][^14][^15][^16] and young coho from both Frankfort piers in October 2015.[^17] The remaining limitation is not whether these fisheries exist. It is whether the exact peak magnitude and rise/decline dates are supported strongly enough to distinguish one port from another.

## Highest-value next research

The best next step is a structured historical observation set, not additional unsystematic searching. For every retained report, capture city, exact structure, observation date, species, positive/negative result, qualitative strength, effort language, method, and source provenance. Then:

1. request or obtain Wisconsin DNR site-level `Sheboygan Piers` creel extracts by date/species with angler-hours, catch, and harvest if available;
2. code the Michigan DNR weekly archive for the six remaining medium-low curves, including negative weeks;
3. fit candidate date curves with partial pooling across years and ports, while preserving city-specific effects only where supported;
4. compare candidate curves using leave-one-year-out tests and ±7-day/±0.5 sensitivity checks;
5. have a Wisconsin Lake Michigan biologist or experienced Sheboygan pier specialist review the shape—not simply the reputation—before public release;
6. prospectively log forecast and observed pier outcomes through one open-water season.

Site-level effort-aware data would materially improve the decimal magnitudes. Until then, the right product posture is to show one decimal for ranking consistency while describing nearby values as practically similar and keeping confidence/provenance visible internally.

## Sources

[^1]: Wisconsin Department of Natural Resources, [Wisconsin's 2022 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf), Table 6, 2023.
[^2]: Wisconsin Department of Natural Resources, [Wisconsin's 2023 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf), Table 6, May 2024.
[^3]: Wisconsin Department of Natural Resources, [Wisconsin's 2024 Open Water Sportfishing Effort and Harvest from Lake Michigan and Green Bay](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf), Tables 1 and 6, 2025.
[^4]: Wisconsin Department of Natural Resources, [Wisconsin's Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf), 2025, pp. 9, 25–27.
[^5]: Wisconsin Department of Natural Resources, [Lake Michigan Outdoor Fishing Report — Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport), Sheboygan County pier/shore section.
[^6]: Wisconsin DNR Outdoor Report, March 25, 2010, [archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=3580.0).
[^7]: Wisconsin DNR Outdoor Report, August 13, 2010, [archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=4046.0).
[^8]: Wisconsin DNR Outdoor Report, September 9, 2010, [archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=4116.0).
[^9]: Wisconsin DNR Outdoor Report, April 14, 2011, [archived reproduction](https://wisconsinoutdoor.com/smf/index.php?topic=4601.0).
[^10]: Wisconsin DNR creel report excerpt, October 2011, [Chicago Sun-Times archive](https://chicago.suntimes.com/news/2011/10/19/18602479/midwest-fishing-report-rivers-rolling-fall-patterns-minocqua-add).
[^11]: Southern Lake Michigan creel report, September 7, 2019, [Seehafer News archive](https://www.seehafernews.com/2019/09/07/outdoor-report-2/).
[^12]: Michigan Department of Natural Resources, [Weekly Fishing Report — April 12, 2023](https://content.govdelivery.com/accounts/MIDNR/bulletins/3548e2b).
[^13]: Michigan Department of Natural Resources, [Weekly Fishing Report — April 21, 2021](https://content.govdelivery.com/accounts/MIDNR/bulletins/2cea412).
[^14]: Michigan Department of Natural Resources, [Weekly Fishing Report — April 24, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3987c22).
[^15]: Michigan Department of Natural Resources, [Weekly Fishing Report — April 23, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3dd426e).
[^16]: Michigan Department of Natural Resources, [Weekly Fishing Report — April 15, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4130cd0).
[^17]: Michigan Department of Natural Resources, [Weekly Fishing Report — October 22, 2015](https://content.govdelivery.com/accounts/MIDNR/bulletins/120bd0c).
