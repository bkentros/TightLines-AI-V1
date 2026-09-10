# PierCast Core-Species Seasonal Opportunity Calibration

## Executive findings

This package establishes a disciplined first numerical calibration for Chinook salmon, coho salmon, steelhead, and brown trout in Ludington, Grand Haven, Manistee, Frankfort–Elberta, and Sheboygan. It contains 20 city–species curves, explicit decimal knots, and 1,040 interpolated weekly review values. Every curve remains a **provisional FinFindr research calibration** and `production_ready=false`.

The strongest supported seasonal peaks are Frankfort steelhead in mid-October, Frankfort Chinook in mid-August, Manistee Chinook in late August, Sheboygan Chinook in late August, and Ludington Chinook near the end of August. These are opportunity ceilings under supportive water temperature, not promises about a trip or claims that fish are physically present.

The evidence does not justify manufacturing 52 independent judgments per curve. The source of truth is therefore a sparse, continuous date curve. Anchors are placed more closely around documented arrivals, peaks, and declines and farther apart during broad slow periods. The weekly table is a deterministic review projection generated from those anchors—not a second configuration and not 1,040 separately researched coefficients.

Michigan DNR describes its creel program as interviews that record fishing duration, target species, and catch, but the public weekly bulletins used here do not provide standardized pier-only effort and catch-rate estimates for each city and week.^1 Wisconsin states that its weekly reports come from randomly scheduled creel clerks, while also warning that they reflect only the sampled days and times.^2 Consequently, the dates and relative shapes are better supported than exact decimal magnitudes. Decimals provide smooth ranking and interpolation; they do not convert qualitative reports into scientific measurements.

## Deliverables

- [Core seasonal curves](PierCast_Core_Species_Seasonal_Curves.json) — authoritative research configuration with 20 explicit curves, evidence IDs, confidence, limitations, anchor rationale, and one-decimal knots.
- [Weekly rating review table](PierCast_Core_Species_Weekly_Ratings.csv) — 52 midpoint evaluations for every curve, including a one-decimal `X.X/10` preview.
- [Weekly table generator](../scripts/generate-pier-cast-weekly-ratings.mjs) — deterministic regeneration and structural validation.
- [Pilot city evidence inventory](PierCast_Pilot_Cities_Research.md) — prior source register and coverage decisions incorporated by reference.

## Score meaning

Each value is the **Seasonal Pier Opportunity Ceiling**:

> Under supportive water temperature, how strong is the historically supported opportunity for this species from the covered pier or piers on this date?

This calibration owns the local fishery strength and the calendar timing. Water temperature remains the only live numeric variable and can only reduce the ceiling:

```text
finalScore = 1 + (seasonalOpportunityCeiling - 1) × temperatureSuitability
```

The seasonal value is not a detected-presence score, biological abundance index, catch probability, catch-rate estimate, percentile, or government rating. A `7.6` means FinFindr judges the target-specific opportunity to be in the upper part of the shared “good” band if water temperature is supportive. It does not mean a 76% chance of catching a fish.

Internal and research values use one decimal at knots and full precision after interpolation. The weekly CSV previews one-decimal `X.X/10` presentation. The product contract and rating formatter now use the same one-decimal format while retaining full precision for aggregation and ranking.

## Common calibration rubric

| Continuous ceiling | Working interpretation | Evidence expectation |
| --- | --- | --- |
| 1.0–1.9 | Little historically supported pier opportunity in the supported annual profile | Broad slow interval inside an otherwise researched curve; never a substitute for missing research |
| 2.0–3.9 | Limited or narrow opportunity | Shoulder season, inconsistent access to fish, or weak/episodic reports |
| 4.0–5.9 | Fair, credible target opportunity | Direct occurrence or repeatable regional/local pattern, generally with meaningful limitations |
| 6.0–7.9 | Good target-specific opportunity | Repeated or comparatively strong local pier evidence, appropriate timing, and a credible local fishery |
| 8.0–8.9 | Exceptional supported window | Strong, structure-specific evidence or unusually favorable repeated reporting; used sparingly |
| 9.0–10.0 | Reserved | Not assigned in v0.1 without effort-aware validation and prospective outcome data |

The numeric assignment is an evidence-aware calibration judgment, not a mechanical conversion of adjectives. A single report of “a few fish” can support occurrence and timing, but not an 8. A report of “excellent numbers,” “great activity,” limits, or many successful pier anglers can support a stronger anchor only after checking scope, method, and contradictory weeks. Negative reports are retained rather than discarded.

## Evidence treatment

Five dimensions governed every curve:

1. **Pier specificity.** A catch explicitly attributed to a pier, breakwall, or pierhead receives more weight than a port-wide statement. Boat catches, offshore depths, river runs, and nearby bays do not become pier evidence.
2. **Recurrence.** Similar timing across years is stronger than one isolated bulletin. Older direct reports remain useful for recurring calendar structure but lower current confidence.
3. **Effort and outcome language.** “Excellent numbers,” multiple successful anglers, and reported limits support a higher ceiling than “a few,” “slow,” or unsuccessful effort. These qualitative descriptions are not treated as standardized catch rates.
4. **Contemporary applicability.** 2024–2026 observations receive the most weight. Historical reports fill recurrence gaps but do not independently establish present strength.
5. **Coverage match.** Evidence for an excluded, closed, unresolved, or differently exposed structure stays qualified. Grand Haven North Pier and Manistee south-side construction are not silently treated as active coverage.

The 2024 Wisconsin open-water survey illustrates why fishery mode matters: statewide pier harvest estimates included 1,459 coho, 931 Chinook, 493 rainbow trout, 789 brown trout, but only three lake trout; those are statewide totals and cannot be copied directly into a Sheboygan score.^3 The same report had reduced 2024 sampling, used modeled estimates for unsampled spring periods, and did not include October in modeled ramp/pier/shore estimates.^3 These facts support regional plausibility and relative caution, not city-week precision.

## Peak calibration summary

| City | Chinook peak | Coho peak | Steelhead peak | Brown trout peak |
| --- | ---: | ---: | ---: | ---: |
| Ludington | Aug 30 · 8.2 | Apr 5 · 5.4 | Nov 8 · 6.2 | Apr 5 · 5.2 |
| Grand Haven | Aug 26 · 6.7 | Apr 15 · 5.7 | Oct 30 · 6.5 | Apr 15 · 5.5 |
| Manistee | Aug 30 · 8.7 | Oct 5 · 6.7 | Oct 28 · 6.6 | Apr 10 · 6.2 |
| Frankfort–Elberta | Aug 16 · 8.8 | Oct 5 · 6.4 | Oct 16 · 8.4 | Apr 5 · 6.0 |
| Sheboygan | Aug 31 · 8.3 | Sep 15 · 5.1 | Oct 10 · 5.5 | Apr 15 · 4.9 |

These are curve knots, not final daily forecasts. The final score can be materially lower when representative water temperature is less suitable.

## City findings

### Ludington

Chinook has two supported windows: a smaller early-June opportunity and a stronger late-August/early-September staging opportunity. DNR reported pier Chinook on June 3, 2026, while an August 21, 2024 report said the piers produced salmon and an August 26, 2026 report placed Chinook in the harbor and in front of the piers.^4 The late-September curve declines quickly because a September 25, 2024 report described only a few stub-pier Chinook and a slowing harbor fishery.^5

Steelhead receives spring and late-fall peaks, with the higher one in November. Contemporary November pier catches and older December records support the late window, but January and February remain deliberately low-confidence. Brown trout peaks modestly in early April because several direct reports call catches slow or hit-or-miss. Coho retains two fair windows; neither has enough effort-aware evidence for a “good” ceiling.

### Grand Haven

The active research scope is South Pier because North Pier is excluded during reported construction. This reduces confidence in historical transfer when a report simply says “the pier.”

Grand Haven Chinook rises through July and August but peaks below the three northern Michigan ports. On July 22, 2026, pier anglers caught a few steelhead and Chinook; on August 26, salmon were caught from the pierheads and by pier anglers.^6 Generic “salmon” language prevents a stronger species-specific claim. Warm-water weeks that pushed salmon offshore were interpreted as temperature-suitability evidence, not proof that the seasonal window disappeared.

Coho and brown trout receive their strongest ceilings in April. An April 24, 2024 bulletin reported a few coho and brown trout from the pier, and April 2026 reporting repeated both species.^7 Steelhead is unusual here: direct reports support an episodic June–July opportunity plus a stronger October–November window. The fall peak is anchored by repeated pier catches on October 16 and October 30, 2024.^8

### Manistee

Manistee has the strongest overall evidence density among the four Michigan species. Chinook reports span early June, late August, and September across multiple years. The curve climbs rapidly in August, reaches 8.7 on August 30, and then declines through September as fish move through the harbor and into river systems. This shape represents recurring staging access, while the live temperature factor handles individual warm-water setbacks.

Coho has distinct spring and fall windows. Steelhead has the broadest supported cool-season pattern in the pilot: March–May and October–December, plus limited June evidence. Brown trout peaks in April based on repeated direct reports from 2019, 2021, 2022, 2023, and 2025. The active city profile covers North Pier; evidence involving south-side or unspecified structures remains a confidence limitation.

### Frankfort–Elberta

Frankfort produces the two highest research ceilings. A Michigan DNR report dated August 16, 2023 described great pier activity for Chinook from roughly 3 a.m. to daylight; that supports an 8.8 mid-August anchor, followed by a still-exceptional late-August window.^9 An explicit zero/negative week on June 17, 2026 is also retained, preventing the early-summer curve from becoming uniformly strong.

Steelhead reaches 8.4 on October 16 because DNR reported excellent numbers from both north and south piers, with better numbers and limits on the south pier.^10 Lower catches in early November pull the curve down rather than extending the peak. Coho peaks in early October with medium-low confidence because the direct evidence is older. Brown trout has a good but short April window and a smaller June shoulder.

### Sheboygan

Sheboygan Chinook is the only Sheboygan curve with a strong local, date-level anchor. On August 31, 2026, Wisconsin DNR reported extremely high pier/shore effort, improved catch rates relative to the prior month, and many anglers leaving with Chinook; successful anglers generally had one or two fish, while others caught none.^11 This supports a strong 8.3 peak without implying universal success.

The coho, steelhead, and brown-trout curves are intentionally marked low confidence. They are regional-transfer research candidates based on Wisconsin pier harvest, agency shore/pier guidance, and general local access descriptions—not production-ready Sheboygan calibrations. Their modest peaks keep the data reviewable without disguising the missing city-specific series. Additional archived Sheboygan creel summaries are required before any of these three curves can be approved.

## Species-level pattern checks

### Chinook salmon

The Michigan curves preserve an early-summer feeding-access shoulder and a stronger late-summer staging peak. Frankfort and Manistee are highest because the retained reports include stronger direct activity language and repeated pier/harbor occurrence. Ludington is close behind. Grand Haven is capped lower because species-specific pier success is less consistent and structure coverage is restricted. The Wisconsin curve is locally strong only at the late-August anchor.

### Coho salmon

Spring and fall are treated as distinct windows. Grand Haven is strongest in spring; Manistee and Frankfort are strongest in fall; Ludington has two fair peaks. Sheboygan remains a regional hypothesis. This prevents the high 2024 Wisconsin-wide coho harvest from being misrepresented as Sheboygan-specific pier performance.

### Steelhead

Spring and autumn/early winter are the dominant calendar windows. Grand Haven also retains a modest summer shoulder because multiple reports directly mention pier steelhead in June and July. Frankfort receives the highest peak because “excellent numbers” and limits from both piers are unusually strong relative evidence. January–March ratings must always carry the separate open-water/access notice.

### Brown trout

All four Michigan cities peak in early or mid-April, with conservative magnitudes reflecting reports of a few fish, slow action, and structure ambiguity. Stocking information supports local fishery relevance but does not directly measure pier catchability. Michigan DNR advisory minutes list continued brown-trout stocking at Frankfort, Manistee, and Ludington and a Grand Haven addition; this informs the local-strength prior without dictating weekly values.^12

## Confidence and release disposition

| Confidence | Curves | Meaning |
| --- | ---: | --- |
| Medium-high | 4 | Strongest repeat local timing evidence; still lacks standardized pier-only weekly outcomes |
| Medium | 6 | Direct recurring local evidence with meaningful gaps |
| Medium-low | 7 | Direct evidence exists, but recurrence, species resolution, or structure scope is limited |
| Low | 3 | Regional-transfer curve awaiting Sheboygan-specific corroboration |

All 20 curves remain blocked from public release because the complete scoring system still lacks approved seasonal temperature-suitability curves, a verified representative water-temperature feed for each city, prospective outcome testing, current access verification, and independent domain review. This is a research milestone, not a release authorization.

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

1. Review the 20 peak magnitudes and city ordering as product judgments; do not debate every interpolated weekly decimal independently.
2. Approve, revise, or reject the sparse knots in the JSON. Regenerate the weekly table after every change.
3. Research and approve the seasonal temperature-suitability curves for these four species and their feeding/staging contexts.
4. Select and validate one representative water-temperature series per city.
5. Run historical replays and prospective shadow forecasts with all ratings still private.
6. Verify one-decimal `X.X/10` presentation in the review UI and ensure copy does not imply that every one-tenth difference is practically meaningful.
7. Expand to secondary species only after the core four have a coherent pilot baseline.

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
| W1 | [Wisconsin DNR 2024 open-water sportfishing report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf) | Regional mode-specific harvest and survey limitations |
| W2 | [Wisconsin DNR Lake Michigan report, Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport) | Sheboygan Chinook effort and catches |

## Sources

1. Michigan Department of Natural Resources. “[Creel Clerks & Angler Surveys](https://www.michigan.gov/dnr/managing-resources/fisheries/creel).” Accessed September 9, 2026.
2. Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report — Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” August 31, 2026.
3. Wisconsin Department of Natural Resources. “[Wisconsin’s Lake Michigan Management Reports to the Great Lakes Fishery Commission, 2025](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf),” Sportfishing Effort and Harvest, pp. 89–92. 2025.
4. Michigan Department of Natural Resources. “[Weekly Fishing Report: August 21, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3b02c05).” August 21, 2024; and “[Weekly Fishing Report: August 26, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b).” August 26, 2026.
5. Michigan Department of Natural Resources. “[Weekly Fishing Report: September 25, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3b7fd3a).” September 25, 2024.
6. Michigan Department of Natural Resources. “[Weekly Fishing Report: July 22, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/421929e).” July 22, 2026; and “[Weekly Fishing Report: August 26, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b).” August 26, 2026.
7. Michigan Department of Natural Resources. “[Weekly Fishing Report: April 24, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3987c22).” April 24, 2024; and “[Weekly Fishing Report: April 15, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/4130cd0).” April 15, 2026.
8. Michigan Department of Natural Resources. “[Weekly Fishing Report: October 16, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bc5a97).” October 16, 2024; and “[Weekly Fishing Report: October 30, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bf0cc8).” October 30, 2024.
9. Michigan Department of Natural Resources. “[Weekly Fishing Report: August 16, 2023](https://content.govdelivery.com/accounts/MIDNR/bulletins/36b27d5).” August 16, 2023.
10. Michigan Department of Natural Resources. “[Weekly Fishing Report: October 16, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3bc5a97).” October 16, 2024.
11. Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report — Aug. 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” August 31, 2026.
12. Michigan Department of Natural Resources. “[Lake Michigan Citizen’s Fishery Advisory Committee Minutes](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-oct-17-2023.pdf).” October 17, 2023, pp. 3–4.
