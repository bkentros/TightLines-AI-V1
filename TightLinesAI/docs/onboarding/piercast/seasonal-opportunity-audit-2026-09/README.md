# PierCast seasonal opportunity audit — September 16, 2026

## Scope and decision

This audit replays all **94 scored city/species pairings, 179 opportunity modes, 12 cities, and 19 species** on every date of a 365-day reference year. The two CSV matrices contain every pairing before and after this research recalibration. Each row reports ideal-temperature seasonal ceilings, source identifiers, peak timing, and days in the Good and Excellent bands. The [port-creel comparison](michigan-port-creel-comparison.csv) additionally checks 87 Michigan port-month records with recurring catch against their modeled month; it includes a recent-period check to distinguish persistent fisheries from older spikes. Only admitted pairs are scored; a species absent from a city's roster is not a zero-score fishery.

**Decision:** Keep Formula v3 and the absolute cross-city scale. Revise **17 pairings** where an existing seasonal curve conflicted with recurring port Pier/Dock catch or dated agency shore reports. This includes spring/summer/fall salmon and steelhead shoulders, October lake trout, and strong warm-season Grand Haven and Manistee fisheries. No citywide or specieswide uplift is applied. All revisions remain private, disabled research candidates.

The changed shadow calibration has its own configuration version, `piercast-v3-twelve-city-seasonal-research-v5`, and engine version `pier-cast-opportunity-modes-v3-shadow-v1.4.0`. A forward-only database migration preserves historical v4 runs while accepting the new v5 manifest. The migration and both affected Edge Functions were deployed September 16, 2026, and a complete v5 shadow run was committed. The [production deployment record](../scoring-v3-pass2/PRODUCTION_SHADOW_DEPLOYMENT.md) contains the reconciliation checks. Public Formula v2 remains unchanged.

The formula is `1 + (F - 1) × A × (0.30 + 0.70T)`, with the maximum mode selected. `F` is city/mode fishery strength, `A` is date availability, and `T` is temperature fit. The matrices set `T = 1` to isolate the seasonal configuration. Actual scores can be lower. A 100% fit does not justify raising `F` or activating a mode with no pier support.

## Evidence boundary

The target is fish **reachable from the city's covered public piers or connected harbor shore**, not all fish in the lake, boats offshore, or trout/salmon already upstream. Evidence priority is: port Pier/Dock creel estimates with effort; exact named-pier reports; state pier-mode monthly patterns; state shore/port guidance; general migration or temperature biology. Lower-priority evidence informs the calendar but cannot alone create a high city-pier ceiling.

Primary source checks for the changes below:

- [Michigan DNR lake trout account](https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout): fall spawning on shallow shoals and occasional pier access; winter and spring shallow-water use; summer offshore movement.
- [2026 Michigan fishing regulations](https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations): verify lake-trout rules for the applicable management unit and date. The four changed Lake Michigan port modes have no new closure or harvest claim.
- [Wisconsin DNR September 7, 2026 Lake Michigan report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport): renewed Milwaukee shore casting and Port Washington shore salmon success, with a rapid day-to-day change in success. Milwaukee's report does not assign shore catch to a particular salmon species.
- [Wisconsin DNR Milwaukee-area fall fishing guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf): September Chinook and October coho peak guidance. It covers a broad 60-minute area and some tributary fishing, so it is timing context rather than a city-pier catch-rate estimate.
- [Wisconsin DNR 2024 creel report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf): pier-mode harvest and effort. Its month table is statewide and includes Green Bay, so its month shape cannot be assigned directly to a Milwaukee pier.
- [Michigan DNR Lake Michigan port roadmap](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Archive/Maps/LakeMichigaRoadmap.pdf): broad port and season context; not a pier-specific catch rate.
- [Michigan DNR creel data portal](https://www.michigan.gov/dnr/managing-resources/fisheries/creel): source of the preserved port/month Pier/Dock query used for the 2012–2022 and recent 2018–2022 comparisons. The [local derived table](../remaining-species/michigan-monthly-evidence.csv) preserves the estimates and effort context.

The existing [Michigan port/month Pier/Dock evidence](../remaining-species/michigan-monthly-evidence.csv), [Wisconsin expansion research](../wisconsin-expansion/RESEARCH_REPORT.md), [core v3 source ledger](../scoring-v3-pass1/foundational-source-ledger.json), and source IDs in the after matrix provide pair-level provenance. The fishery-strength decimals remain FinFindr judgments, not agency ratings or catch probabilities.

## Changes made

| Pairing | Prior issue | Revised research hypothesis | Ideal score before → after |
|---|---|---|---:|
| Milwaukee coho | Fall peak of 6.2 began declining immediately after September 7 despite repeated county pier coho harvest, a renewed September shore window, and broader fall guidance. | Fall strength 6.8, still below spring 7.6 and Racine fall 7.3; full fall availability September 7–25, then gradual decline. | September 16: 5.86 → 6.80 |
| Milwaukee Chinook | August peak decayed to Fair by mid-September during the reported shore return. | Keep strength 7.0; retain high fall availability into September before declining in October. | September 16: 5.20 → 6.27 |
| Port Washington Chinook | August peak decayed to Fair despite exact September North Pier/shore salmon success. | Keep strength 7.2; retain high fall availability into September. | September 16: 5.34 → 6.45 |
| Grand Haven steelhead | May Pier/Dock catch recurred in two recent surveyed years, while the April-to-May spring availability collapsed to 0.35. | Keep the 7.1 spring ceiling and use a gentler May shoulder. | May 15: 3.14 → 4.66 |
| Frankfort/Elberta Chinook | July Pier/Dock catch recurred in two recent surveyed years, while summer mode strength rose too late. | Keep 8.8 summer and 9.7 fall ceilings; raise July availability. | July 15: 5.58 → 7.24 |
| Frankfort/Elberta coho | August Pier/Dock catch recurred in two recent surveyed years, but fall mode began its rise too late. | Keep the September 8.6 fall peak and let staging build through August. | August 25: 4.71 → 6.59 |
| Ludington, Grand Haven, Manistee, Frankfort/Elberta lake trout | A January 20 seasonal maximum was unsupported by winter creel coverage, while October Pier/Dock lake-trout catches occur in all four ports and DNR describes fall nearshore spawning. | Move the existing modest 3.6–4.0 cold-season peak to October 25; retain a lower-confidence winter shoulder. No higher ceiling or new admission. | October 15: 1.00 → 2.82–3.10; October 25 reaches existing 3.6–4.0 ceiling |
| Ludington smallmouth | July Pier/Dock catch persisted in three recent surveyed years, while the old peak never entered Good. | Lift its modest summer ceiling from 5.2 to 5.8, still below Grand Haven. | Peak: 5.2 → 5.8 |
| Grand Haven smallmouth | August Pier/Dock catch persisted in all four recent surveyed years (1,072 estimated catch; 82 per 1,000 all-species hours), yet the ceiling was 4.8. | Raise the warm-season ceiling to 7.0. | Peak: 4.8 → 7.0 |
| Grand Haven freshwater drum | May and September catch recurred in all four recent surveyed years, while the curve concentrated almost all strength in July. | Retain the 7.2 ceiling and broaden May–September availability. | September 16: 4.37 → 6.37 |
| Grand Haven yellow perch | Repeated summer Pier/Dock catch continued through September; the old 6.0 peak and fast August drop understated it. April also has a separate recurring pulse. | Raise the summer ceiling to 7.2, extend its September shoulder, and move the spring pulse to late April with a 6.2 ceiling. | September 16: 2.98 → 6.19; April 15: 3.32 → 5.68 |
| Grand Haven channel catfish | July–September catch recurred in all four recent surveyed years; old ceiling was 5.8 and September decayed too fast. | Raise to 6.8 and keep a stronger September shoulder. | September 16: 4.37 → 6.28 |
| Grand Haven largemouth bass | August Pier/Dock catch persisted in all four recent surveyed years (2,192 estimated catch; 169 per 1,000 all-species hours), above the old 6.2 ceiling's implied strength. | Raise the warm-season ceiling to 7.4. | Peak: 6.2 → 7.4 |
| Manistee yellow perch | Large April and May Pier/Dock catches recurred in three recent surveyed years; a separate June catch pulse was also recurring. | Keep spring ceiling 7.2 but broaden its April–May peak; lift June summer ceiling 4.5 → 6.8. | April 15: 5.45 → 6.64; Good days: 25 → 77 |

For the four lake-trout pairings, the port/month Pier/Dock record has October harvest in the modern 2012–2022 window: Ludington 13, Grand Haven 17, Manistee 19, Frankfort/Elberta 49. September is zero in Ludington, Manistee, and Frankfort/Elberta, and low in Grand Haven. The October correction is therefore specific to the nearshore window. It does **not** imply that spawning fish are reliably reachable from every pier or that their low overall pier catch volume warrants a Good rating.

The Milwaukee coho 6.8 ceiling is the most judgmental change. It uses recurring county pier harvest and the cross-city Wisconsin comparison to place fall between the previous Milwaukee ceiling and stronger documented Wisconsin coho fisheries. The available reports do not measure fall catch per hour at McKinley or Cupertino. Its precision and September 7–25 plateau are hypotheses for owner review, not measured facts.

The monthly Michigan record cannot resolve a peak to an exact day either. October 25 for lake trout and the new salmon/perch shoulder knots are representative smooth-curve anchors chosen within supported monthly windows, not observed daily peak dates. Wind, turnover, temperature at the actual pier, and run timing can move the useful window substantially within a month.

The Michigan warm-season revisions have stronger numeric footing but still use **all-species pier effort**, not hours directed at the target. For example, Grand Haven's 2018–2022 Pier/Dock August catches recur in four surveyed years for smallmouth (1,072) and largemouth (2,192), while May–September drum and July–September catfish also recur. These comparisons justify relative strength and timing; they do not turn a rating into catch probability. Recent catch rates fell below historical highs for some species, so revised ceilings remain below what a literal extrapolation of old harvest would imply.

## All-species review disposition

Every admitted pairing appears in the two matrices. Counts by species sum to 94. “Retain” means the current peak or low ceiling was not contradicted by a stronger **city-pier** source in this pass; it does not mean exact decimals have been empirically validated.

| Species | Pairings | Disposition and reason |
|---|---:|---|
| Chinook salmon | 11 | Revise Milwaukee/Port Washington September shoulders and Frankfort/Elberta July summer rise. Other western Michigan and Sheboygan fall peaks are already strong; weaker Huron and southern Wisconsin ceilings lack equivalent pier recurrence. |
| Coho salmon | 12 | Revise Milwaukee fall strength and shoulder and Frankfort/Elberta August rise. Other western Michigan fall and southern Wisconsin spring peaks remain differentiated; Huron pairs have narrower local evidence. |
| Steelhead | 12 | Revise Grand Haven May shoulder. Western Michigan spring/fall modes already reach Good or Excellent. Wisconsin's regional river-run guidance cannot justify Good pier scores where exact pier harvest is sparse; Milwaukee and Port Washington fall remain especially uncertain rather than automatically boosted. |
| Brown trout | 10 | Retain. Spring peaks carry the strongest pier evidence. Generic fall/winter biology is insufficient to extend a strong pier score into September at every port. |
| Lake trout | 7 | Correct October timing at four Lake Michigan ports. Retain the three Lake Huron calibrations, which already encode locally reviewed cold-water and fall opportunity where supported. |
| Atlantic salmon | 3 | Retain the differentiated Huron port peaks; Oscoda reaches 8.4 in spring, while Harbor Beach and Port Sanilac have lower pier-specific ceilings. |
| Yellow perch | 6 | Revise Grand Haven spring/summer and Manistee spring/summer from recent port Pier/Dock recurrence. Retain the other four and the Wisconsin legal closure; lakewide or Green Bay harvest does not establish each harbor's magnitude. |
| Walleye | 5 | Retain supported spring/fall low-light port modes. Offshore or river catches do not become a general pier boost. |
| Smallmouth bass | 6 | Revise Ludington and Grand Haven summer ceilings from recent Pier/Dock recurrence. Retain four locally bounded modes. |
| Northern pike | 6 | Retain spring or warm-season harbor modes where locally admitted. |
| Freshwater drum | 4 | Broaden Grand Haven's Good window across its recurring May–September Pier/Dock catch. Retain three other local modes. |
| Round whitefish | 2 | Retain narrow spring/fall menominee modes and modest ceilings. |
| Channel catfish | 2 | Revise Grand Haven's ceiling and September shoulder from Pier/Dock catch; retain Oscoda's lower evidence-based mode. Upstream river catch remains excluded. |
| White bass | 2 | Retain locally admitted summer schooling modes. |
| Burbot | 2 | Retain winter harbor modes; open-water access remains a separate practical constraint. |
| Largemouth bass | 1 | Raise Grand Haven's harbor-cover ceiling from repeated recent Pier/Dock catch. |
| White perch | 1 | Retain Grand Haven schooling mode. |
| Bluegill | 1 | Retain Grand Haven pier mode. |
| Lake whitefish | 1 | Retain the lawful Grand Haven fall mode and November tackle notice. |

**Scale diagnostic:** In the original full-year ideal-temperature scan, 53 of 94 pairings never entered the Good band (>6); the recalibration leaves 50. This is a review flag, not a target number. Many remain occasional or difficult pier fisheries. Raising every such pairing would erase the distinction between a known shore window and a fish that is merely present somewhere in the lake. The 17 pair changes increase strong days only where the source record points to a specific season; winter and offseason floors remain low.

The port comparison still flags **11 recent recurring month/pair records** with a mean ideal score below Good. The flags are deliberately sensitive, not proof of 11 remaining errors. Ludington Chinook in August and Frankfort/Elberta coho in August already reach Good during part of their respective months; their monthly means also include early or late staging days. Ludington smallmouth in July and Grand Haven perch in April were raised but remain modest outside the strongest part of their windows. Grand Haven coho in April briefly enters Good; Grand Haven steelhead in May has a stronger shoulder but remains below Good, with run timing that the monthly record cannot resolve. Grand Haven round whitefish in April is the clearest low-score watch item: recent catch recurs, yet the full-period total is small, a single recent year contributes most of that month's catch, and exact-pier directed effort remains unresolved. Grand Haven catfish in May/October, Manistee Chinook in June, and Frankfort/Elberta steelhead in July similarly need better evidence for a sustained Good pier window. These are explicit follow-up hypotheses, not quiet assumptions that the existing decimals are correct.

## Validation and limits

Regenerated the Pass 1 core calibration, secondary calibration, combined runtime configuration, and full-year v3 audit. The full v3 quality gate passed: 171,550 invariant score checks, 24,440 weekly replay rows, and 44 focused tests. A regression test verifies the corrected fall windows and that October lake-trout potential exceeds the unobserved January shoulder without raising the fishery ceiling. These tests prove configuration and formula integrity, **not forecast skill**.

No field campaign is required to use these as research-based owner-review scores. The existing prospective validation report still has no eligible effort-aware outcome cohort, and the model-cell temperature is not proven representative of each pier. This audit therefore cannot establish that 6.8 is a measured Milwaukee coho catch rate, that a 57 °F model cell describes a pier's actual water, or that all 94 decimal scores are accurate to a tenth. Public promotion remains blocked; the revisions do not alter Formula v2 or historical snapshots.
