# PierCast remaining-species seasonal research — Phase 1

Reviewed 2026-09-12. This document accompanies the [authoritative seasonal proposals](../../../PierCast_Remaining_Species_Seasonal_Curves.json), [52-week review](../../../PierCast_Remaining_Species_Weekly_Ratings.csv), [daily values](phase1-daily-ratings.csv), [monthly values](phase1-monthly-ratings.csv) and [coverage counts](phase1-coverage.json).

## Outcome and limits

All 45 city × species combinations have explicit annual review coverage. Fifteen have bounded provisional seasonal proposals; 30 remain numerically unresolved, including ten admitted research candidates. These are **research configuration**, not runtime onboarding or validated annual scores. A complete calendar table is not the same as complete numerical knowledge. Unsupported days remain null. None of these nine species has a justified January–December numerical profile from this evidence package.

The recurring warm-season fisheries deserve batch development. Grand Haven drum and largemouth have the strongest proposed summer windows; Manistee perch has a stronger spring window than summer. Ludington perch peaks later than Manistee perch. A fishery can be worth targeting without being a premier salmonid-scale opportunity. Several species can simultaneously receive strong values: there is no quota of seasonal winners.

The four completed core species, their weekly table and runtime configuration remain unchanged. Their existing 1–10 rubric governs these proposals. The UI, scoring formula, temperature pipeline, daily lock, city footprint, seven covered structures and disabled public release remain unchanged. Phase 2 owns thermal-response work and runtime eligibility; Phase 3 owns the joint annual-lineup review.

## What a number means

A seasonal value is a product calibration judgment about pier opportunity under supportive temperature. It is not fish abundance, a catch percentage, fish per hour, a government rating or a prediction that fish will bite. The existing bands are negligible 1, poor through 2, limited through 4, fair through 6, good through 8, excellent through 9.4, and premier above 9.4. The completed catalog reference remains Manistee late-October steelhead at 10.

Sparse anchors are deliberately coarse, mostly half-point increments. No evidence identifies an exact 6.5 optimum on a particular day. Representative mid-month anchors carry approximately month-level timing resolution. Month boundaries are declared interpolation limits within a researched season, not demonstrated arrival or departure dates. Daily and weekly decimals between anchors are arithmetic, not additional biological findings. A score difference of 0.5 between weakly supported proposals should not be treated as statistically established.

Each anchor has a rationale and source identifiers in the JSON. Linear interpolation is allowed only inside a listed segment. No extrapolation, annual wrapping, missing-month zero, winter floor or interpolation across disconnected seasons is permitted. A bounded segment is continuous within its domain; availability outside it is unresolved. Phase 2 must preserve that distinction, because the existing core runtime interpolator wraps annual curves and cannot safely receive these anchors without bounded-availability support.

## Evidence hierarchy and interpretation

1. Michigan DNR port-specific Pier/Dock estimates establish broad calendar recurrence and within-species comparisons. Modern 2012–2022 and recent 2018–2022 subsets exclude 2020 consistently with the preserved audit. Catch estimates, explicit zeros and omitted rows remain distinct.[^1][^56]
2. Dated DNR weekly paragraphs corroborate pier mode, species identity, practical methods and contemporary timing. A report of bass is not both bass species; whitefish is not automatically lake whitefish or menominee. A report of boats fishing from pierheads out to depth is not pier angling.
3. The 2025 Michigan creel supplement is newer but its Lake Michigan Pier/Dock table is lake-wide. Wisconsin 2022–2024 pier tables combine survey regions and cannot supply Sheboygan-only rates; 2024 sampling and modeling gaps require particular caution.[^2][^3][^4][^5][^6]
4. Agency species accounts and studies explain plausible mechanisms. Spawning, thermal occupancy, tolerances, growth and nearshore juvenile sampling do not supply bite probabilities or establish adult pier catches. Stocking records establish releases, not contemporary adult pier strength.[^62][^64][^67][^72][^55][^54]
5. Dated local reports and historical biologist recollections are corroboration or leads only. Sheboygan smallmouth and perch leads remain distinguishable from regional harvest and upstream fisheries.[^10][^12][^11]

The rates below divide matched published catch estimates by **all-species Pier/Dock hours**. They are not directed catch rates. Changes in target effort, school encounters, fish size and catch-and-release practices can alter them without equivalent changes in an individual's opportunity. Perch counts cannot be converted into the salmonid scale with the same logarithmic transformation. We inspect recurrence, recent concentration, direct observations, method and structure before assigning a band. No invented quantitative discount corrects absent effort data.[^58]

For lake trout the original conservative combined summary requires both Lean and Fat component rows. That omits some known Lean observations. The tables below therefore show **Lean Lake Trout only** for transparent seasonal inspection, never as a complete combined-species total. Candidate recurrence can count a known positive component without assuming that an absent component is zero.

## Material contradictions and their resolution

- **Winter:** January–March contain no matched local strata for the nine species in the preserved extract. DNR reporting also has seasonal interruptions. Ice fishing in a bayou or inland lake is a different mode/location. Winter silence cannot become a 1.0 or an inferred winter fishery. Cold-season fish biology is not a substitute for local catchability.[^91][^76]
- **Perch:** Manistee's April–May strength contrasts with Ludington's June–July pattern. Large pooled estimates coexist with concentrated catch years, small fish and slow contemporary reports. Proposed peaks stop at good or fair, without pretending every year produces the historical best outcome.[^13][^80][^82][^15][^17]
- **Manistee walleye:** older May zero estimates conflict with repeated May night catches in 2019, 2022 and 2023. A narrow night-fishing proposal follows the direct multi-year timing instead of giving the old July estimate an automatic summer peak. The discrepancy is unresolved statistically, not erased.[^84][^18][^19]
- **Drum:** Grand Haven has strong recurring summer port records and contemporary catches. Manistee has recent pier reports despite mostly zero recent creel estimates, while Ludington's modern recurrence exceeds its recent series. They receive separate curves and ceilings; there is no shared drum curve.[^39][^40][^27][^42]
- **Lake trout:** spring Manistee pier catches corroborate a limited proposal. Offshore abundance, stocking and autumn shoal spawning cannot fill other cities or autumn intervals. The April 2025 Ludington “pierheads out to 50 feet” wording occurs in boat context and is excluded from pier corroboration.[^20][^22][^77][^62]
- **Grand Haven lake whitefish:** the DNR recognizes the autumn fishery but describes historical snagging contributions and changed November gear rules. Old jigging harvest and species-unspecified bait catches cannot identify current lawful lake-whitefish magnitude. The November lead stays active with null scores; a made-up percentage reduction would not fix the data.[^8][^9][^78][^86]
- **Species biology:** smallmouth's rocky habitat and largemouth's vegetation association explain different use of harbor faces, but neither makes every pier equivalent. Menominee's shallow spring/fall biology and pre-spawn feeding cessation argue against a generic spawning bonus. Temperature suitability remains a separate Phase 2 endpoint.[^67][^74][^64]

## Cross-city and completed-scale review

The highest new proposal is 7.0, shared by Grand Haven June drum and Manistee May perch. This is an evidence decision, not a permanent rule that non-salmonids must score lower. Neither has sufficiently strong contemporary exact-structure effort evidence here to justify an excellent or premier rating. Grand Haven August largemouth and drum can both be 6.5. Manistee smallmouth/drum and Ludington smallmouth/drum have lower ceilings because contemporary reports and recent estimates are weaker or more variable. No port inherits a neighboring city's curve.

Core comparisons are qualitative calibration checks only. The completed four-species in-sample replay is not an independent validation of these proposals, and it does not validate a universal catch-count conversion. Phase 3 must inspect all species together without altering already-completed core curves merely to create calendar coverage.

## All 45 pairings

The following retains candidate discovery separately from numeric readiness. “Unresolved” describes evidence sufficiency, not ecological absence or removal from the candidate queue. For each Michigan pairing, tables show modern/recent rates and positive/matched years; a dash means no matched catch-and-effort support. Noncore winter gaps remain visible in the full monthly/daily outputs. These compact tables show April–December to avoid repeating empty January–March strata.

### ludington mi — lake trout

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Scattered April/October port estimates do not establish a recurring intentional North Breakwater fishery. Offshore lake-trout abundance is inapplicable. Recent harbor and reef stocking is confirmed, but stocked numbers do not demonstrate a major adult pier target.[^1][^51][^50][^55]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Scattered April/October port estimates do not establish a recurring intentional North Breakwater fishery. Offshore lake-trout abundance is inapplicable. Recent harbor and reef stocking is confirmed, but stocked numbers do not demonstrate a major adult pier target.

**Seasonal lead retained:** Spring/autumn occurrence only; no supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 2.2 | 1/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 1.9 | 1/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 11.0 | 4/7 | 3.6 | 1/4 | 100.0% |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

Lake-trout table is the Lean component only; omitted Fat rows have not been imputed.

### ludington mi — walleye

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

One or two evening pier walleye in May 2022 corroborate possibility, but the pier side, repeated directed effort and major-fishery strength are missing. Basin fishing is not automatically North Breakwater fishing.[^1][^18][^53]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** One or two evening pier walleye in May 2022 corroborate possibility, but the pier side, repeated directed effort and major-fishery strength are missing. Basin fishing is not automatically North Breakwater fishing.

**Seasonal lead retained:** May evening lead; no annual curve.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 4.6 | 1/5 | 5.3 | 1/4 | 100.0% |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 2.2 | 2/7 | 0.0 | 0/4 | — |
| 9 | 0.9 | 1/5 | 2.0 | 1/4 | 100.0% |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — smallmouth bass

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

July catches recur in eight modern port years and three of four recent years. Species-specific pier reports persist through 2026. Fair summer ceiling recognizes many few-fish reports and excludes spring stub-pier catches.[^1][^25][^29][^36][^44][^32][^33]

**Structure/mode:** North Breakwater corroborated in July; remaining port and unspecified-pier observations qualified. Casting lures/plastics from pier.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 06-01 | 2.5 | Research-window boundary within observed June port season; not an arrival date. |
| 06-15 | 3.5 | Modern June catches recur, but recent matched June estimates are zero; limited shoulder. |
| 07-15 | 4.5 | Best repeatability plus exact North-Pier July corroboration; few-fish reports limit ceiling to fair. |
| 08-15 | 4.0 | Recent August pier reports sustain a limited opportunity despite weaker port density. |
| 09-15 | 2.5 | September port catches concentrated in one recent year; no strong fall tail. |
| 09-30 | 2.0 | Conservative end of evaluated September shoulder; October remains uncalibrated. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 5.4 | 2/7 | 0.0 | 0/4 | — |
| 6 | 48.0 | 3/6 | 0.0 | 0/3 | — |
| 7 | 36.2 | 8/9 | 11.3 | 3/4 | 46.2% |
| 8 | 6.4 | 3/7 | 4.7 | 1/4 | 100.0% |
| 9 | 20.5 | 3/6 | 49.9 | 1/4 | 100.0% |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — freshwater drum

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

Repeated July-August port catches and July/August 2026 pier reports support a short limited-to-fair summer proposal. Recent port recurrence is much weaker than Grand Haven; no borrowed May-June curve.[^1][^42][^43]

**Structure/mode:** Unspecified Ludington piers; exact North Breakwater attribution remains a Phase 2 gate. Lures or bottom-fished crawlers.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 07-01 | 3.0 | Beginning of recurrent July port season, an explicit interpolation boundary. |
| 07-15 | 4.5 | July modern recurrence and several pier drum in July 2026 support fair opportunity, not good or excellent. |
| 08-15 | 3.5 | August 2026 few-fish report and older port catches support a weaker late-summer window. |
| 08-31 | 2.5 | End of evaluated August window; sparse September port evidence is insufficient to extend it. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 3.7 | 1/6 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 59.4 | 5/8 | 11.6 | 1/4 | 100.0% |
| 8 | 30.8 | 3/8 | 0.0 | 0/4 | — |
| 9 | 4.5 | 2/6 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — yellow perch

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

June-July port catches are large but schooling concentrates catches in few years. Three of four recent July strata positive versus one of three in June; 2020 and 2023 slow reports prevent an excellent ceiling. August drops sharply. No automatic spring peak from generic perch biology.[^1][^14][^15][^16][^29][^31][^82]

**Structure/mode:** North Breakwater has exact June/July evidence; August magnitude uses port-mode shoulder inference. Minnows/wigglers and small bait presentations within pier reach.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 06-01 | 3.5 | Evaluated June start; early-June 2023 catches only a couple at North Pier. |
| 06-15 | 5.0 | Large June port estimates but one-year recent concentration and variable direct catches justify fair only. |
| 07-15 | 6.0 | July is the strongest recurring local port window, capped at fair because recent reports remain variable or slow. |
| 08-15 | 2.5 | Recent August density is far below July and dominated by one year. |
| 08-31 | 2.0 | End of weak August shoulder; no inferred winter or autumn fishery. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 1064.8 | 5/7 | 1487.4 | 1/3 | 100.0% |
| 7 | 2235.6 | 5/7 | 1734.3 | 3/4 | 81.6% |
| 8 | 97.4 | 5/7 | 20.0 | 2/4 | 90.4% |
| 9 | 206.6 | 2/6 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — lake whitefish

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Rare port estimates and generic whitefish references do not identify a repeatable lake-whitefish target at North Breakwater. Do not transfer Grand Haven November conditions or misidentify menominee.[^1][^8]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Rare port estimates and generic whitefish references do not identify a repeatable lake-whitefish target at North Breakwater. Do not transfer Grand Haven November conditions or misidentify menominee.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 2.2 | 1/6 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — round whitefish

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Older autumn port catches support a historical lead. Recent matched autumn strata lack comparable catches; no current major directed North Breakwater fishery is established. Regional decline context is not a local absence measurement.[^1][^11]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Older autumn port catches support a historical lead. Recent matched autumn strata lack comparable catches; no current major directed North Breakwater fishery is established. Regional decline context is not a local absence measurement.

**Seasonal lead retained:** Historical October lead; current recurrence unresolved.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 20.8 | 3/7 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — channel catfish

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Reviewed Pier/Dock estimates and dated pier evidence do not establish a major intentional channel-catfish fishery at North Breakwater. River, inland-lake and general Lake Michigan presence are insufficient.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Reviewed Pier/Dock estimates and dated pier evidence do not establish a major intentional channel-catfish fishery at North Breakwater. River, inland-lake and general Lake Michigan presence are insufficient.

**Seasonal lead retained:** No supported score interval; absence of qualifying evidence is not biological absence.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### ludington mi — largemouth bass

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No adequate species-specific North Breakwater target evidence. Do not convert smallmouth, rock bass, or unspecified bass into largemouth; warm-water biology does not establish local fishing opportunity.[^1][^29]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** No adequate species-specific North Breakwater target evidence. Do not convert smallmouth, rock bass, or unspecified bass into largemouth; warm-water biology does not establish local fishing opportunity.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/4 | 0.0 | 0/3 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### grand haven mi — lake trout

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Sparse cold-season port catches and offshore fisheries do not establish a repeatable major South Pier target. A grouped Grand Haven/Holland agency listing cannot identify the productive port, structure or mode.[^1][^55]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Sparse cold-season port catches and offshore fisheries do not establish a repeatable major South Pier target. A grouped Grand Haven/Holland agency listing cannot identify the productive port, structure or mode.

**Seasonal lead retained:** April/October occurrence lead only.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 11.1 | 3/7 | 16.6 | 1/4 | 100.0% |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.9 | 2/5 | 1.3 | 2/4 | 71.4% |
| 10 | 3.3 | 3/6 | 5.3 | 2/4 | 65.4% |
| 11 | 3.0 | 1/2 | 3.0 | 1/2 | 100.0% |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

Lake-trout table is the Lean component only; omitted Fat rows have not been imputed.

### grand haven mi — walleye

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Low and intermittent spring port catches do not establish a major South Pier target. Upstream Grand River fisheries and a combined Grand Haven/Holland listing are outside the required geographic proof.[^1][^53]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Low and intermittent spring port catches do not establish a major South Pier target. Upstream Grand River fisheries and a combined Grand Haven/Holland listing are outside the required geographic proof.

**Seasonal lead retained:** April-May occurrence does not justify a seasonal curve.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 5.7 | 2/7 | 0.0 | 0/4 | — |
| 5 | 5.9 | 2/6 | 9.7 | 1/4 | 100.0% |
| 6 | 0.2 | 1/5 | 0.4 | 1/4 | 100.0% |
| 7 | 0.8 | 1/5 | 1.0 | 1/4 | 100.0% |
| 8 | 2.9 | 3/6 | 1.2 | 1/4 | 100.0% |
| 9 | 1.4 | 3/7 | 0.8 | 1/4 | 100.0% |
| 10 | 0.1 | 1/6 | 0.0 | 0/4 | — |
| 11 | 0.0 | 0/1 | 0.0 | 0/1 | — |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — smallmouth bass

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

Species-specific August pier report corroborates port catches. Modern August positive in six of seven matched years and recent four of four, but one recent year contributes most catches. Unidentified bass in current reports cannot independently raise smallmouth scores.[^1][^52][^34][^44]

**Structure/mode:** Grand Haven piers; South-Pier-specific contribution unresolved. Casting live bait or artificial lures.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 06-01 | 2.5 | June port recurrence establishes a limited proposed shoulder. |
| 06-15 | 3.5 | Four of seven modern June strata positive; no strong exact-side catch series. |
| 07-15 | 4.0 | July catches recur but at low all-mode density; retain limited band. |
| 08-15 | 5.0 | August is strongest within this species at this port; concentration and side uncertainty cap at fair. |
| 09-15 | 2.5 | September has weak recurrence and much lower density. |
| 09-30 | 2.0 | End of proposed fall shoulder, not a biological departure date. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 1.8 | 3/6 | 1.4 | 2/4 | 90.9% |
| 5 | 3.4 | 1/5 | 4.9 | 1/4 | 100.0% |
| 6 | 8.6 | 4/7 | 11.7 | 2/4 | 53.2% |
| 7 | 3.5 | 7/10 | 4.6 | 2/4 | 79.4% |
| 8 | 44.5 | 6/7 | 82.5 | 4/4 | 83.9% |
| 9 | 2.4 | 2/6 | 2.6 | 1/4 | 100.0% |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | 0.0 | 0/1 | 0.0 | 0/1 | — |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — freshwater drum

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** moderate_timing_low_magnitude.

Repeated 2016-2026 pier catches and four of four positive recent May-September strata support a broad summer fishery. June 2026 good results followed by decline justify a good seasonal peak with variable realized scores. July total is one-year concentrated; no July spike is inferred.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90]

**Structure/mode:** Channel-facing South Pier supported by pier-context 2026 reports during North-Pier closure; older port totals pool structures. Casting spoons/crankbaits/Ned rigs or bottom-fished bait in channel.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 05-01 | 5.0 | May 2023 catches and recurrent May port estimates support a fair season start. |
| 05-15 | 6.5 | Strong May recurrence supports good, with pooled-structure limitation. |
| 06-15 | 7.0 | Strong repeated June port catches and contemporary success followed by slower weeks support good peak, below excellent. |
| 07-15 | 6.5 | Recurring summer opportunity; concentrated recent July total does not justify a new peak. |
| 08-15 | 6.5 | August recurrence remains strong; species can overlap bass peaks. |
| 09-15 | 4.5 | September density declines and current reports describe a few drum, while older bait catches confirm recurrence. |
| 09-30 | 3.5 | End of evaluated declining window; sparse October catches retained as a research gap, not zero. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 4.7 | 3/6 | 4.3 | 2/4 | 69.7% |
| 5 | 107.9 | 6/7 | 134.3 | 4/4 | 33.6% |
| 6 | 104.7 | 7/8 | 200.6 | 4/4 | 69.3% |
| 7 | 87.8 | 8/9 | 202.8 | 4/4 | 79.8% |
| 8 | 68.3 | 8/9 | 171.5 | 4/4 | 37.5% |
| 9 | 18.7 | 8/9 | 44.5 | 4/4 | 68.5% |
| 10 | 15.4 | 3/7 | 7.5 | 1/4 | 100.0% |
| 11 | 0.0 | 0/1 | 0.0 | 0/1 | — |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — yellow perch

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Repeated modern port Pier/Dock perch catches justify continued score research. The primary 1981–1982 study confirms historical targeting but its Grand Haven catch statistics explicitly concern North Pier, excluded from current coverage. Recent port catches are highly concentrated in individual years. Neither historical North-Pier catches nor modern offshore perch reports establish current South-Pier magnitude or daily timing.[^1][^2][^92]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Historical Pier/Dock catches are substantial but recent August estimates are sharply lower. Boat perch reports cannot repair the missing contemporary South Pier target evidence; exact structure, size distribution and directed effort are needed.

**Seasonal lead retained:** Historical late-summer/autumn signal; current South Pier timing unproven.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 42.0 | 3/6 | 51.1 | 2/4 | 95.7% |
| 5 | 101.9 | 4/7 | 7.6 | 1/4 | 100.0% |
| 6 | 41.7 | 8/9 | 9.6 | 3/4 | 73.4% |
| 7 | 126.3 | 9/10 | 87.6 | 3/4 | 98.1% |
| 8 | 355.9 | 8/10 | 41.3 | 2/4 | 96.6% |
| 9 | 116.5 | 6/9 | 100.9 | 2/4 | 98.7% |
| 10 | 150.4 | 3/8 | 0.0 | 0/4 | — |
| 11 | 0.0 | 0/1 | 0.0 | 0/1 | — |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — lake whitefish

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Autumn fishery is acknowledged by DNR, with old pier catches on bait and jigs. Historical November harvest includes snagged fish; multiplying it by an invented lawful-catch discount would fabricate current magnitude. Species-unspecified bait reports cannot resolve lake versus round whitefish. Preserve November timing, hold all numerical values.[^1][^8][^9][^46][^78][^86][^85][^75]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** DNR confirms an autumn port fishery, but historical November harvest includes substantial snagging and only two matched modern November years in this extract. The 2025 gear change prevents treating historical harvest as current lawful bite opportunity. South Pier lawful-method catch and effort are unresolved.

**Seasonal lead retained:** November historical target window; no current lawful-method magnitude or daily curve.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 8.9 | 3/6 | 3.6 | 2/4 | 78.6% |
| 5 | 0.5 | 1/5 | 0.7 | 1/4 | 100.0% |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 32.3 | 2/6 | 0.0 | 0/4 | — |
| 11 | 756.5 | 2/2 | 756.5 | 2/2 | 92.5% |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — round whitefish

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

April port catches recur in six of seven modern strata and species-specific pier catches recur in 2018 and 2021. Modest counts and regional decline concern limit the proposal. Adjacent 2021 bulletins count as one year. No autumn peak is borrowed from lake whitefish.[^1][^47][^48][^81][^64][^11]

**Structure/mode:** Grand Haven piers, exact South-Pier contribution unresolved. Skein/spawn, bait-fishing among spring salmonids.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 04-01 | 3.0 | Evaluated April boundary from monthly recurrence, not a measured arrival. |
| 04-15 | 4.0 | Repeated April menominee catches support limited opportunity; mixed catches do not prove a good targeted fishery. |
| 04-30 | 3.0 | End of supported April review window; May zeros do not specify a precise departure. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 21.1 | 6/7 | 30.4 | 4/4 | 62.0% |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 3.9 | 2/7 | 0.0 | 0/4 | — |
| 11 | 9.2 | 1/2 | 9.2 | 1/2 | 100.0% |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — channel catfish

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

May 2023 and September 2018 direct pier catches corroborate unusually persistent port-mode recurrence. August is strongest and less single-year concentrated than perch or smallmouth. Moderate fair ceiling reflects missing current per-side effort. Upstream Grand River catfish are excluded.[^1][^19][^90][^53][^73]

**Structure/mode:** Grand Haven piers; side and current directed effort unresolved. Bottom-fished worms or gizzard shad; feasible evening/night fishing.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 05-01 | 3.5 | May pier bait catches establish a limited-to-fair start. |
| 05-15 | 4.0 | Recurrent May port catches, without strong recent directed report. |
| 06-15 | 4.0 | June occurrence very recurrent but lower port density than August. |
| 07-15 | 4.5 | Summer recurrence improves; fair rating retains method/side uncertainty. |
| 08-15 | 5.5 | All four recent August strata positive with strong relative density; fair peak, not a standardized catch-rate claim. |
| 09-15 | 5.0 | September direct bait-fishing report and all four recent positive strata support sustained fair opportunity. |
| 10-15 | 4.0 | October repeated port catches support a limited shoulder with weaker direct corroboration. |
| 10-31 | 3.0 | End of evaluated October interval; winter is unsurveyed or inadequately resolved. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 9.1 | 6/8 | 7.7 | 3/4 | 76.3% |
| 5 | 21.4 | 5/7 | 20.1 | 3/4 | 48.0% |
| 6 | 9.2 | 8/9 | 14.4 | 4/4 | 43.5% |
| 7 | 13.7 | 7/8 | 19.9 | 4/4 | 51.2% |
| 8 | 48.7 | 7/8 | 65.2 | 4/4 | 47.8% |
| 9 | 18.3 | 8/9 | 34.4 | 4/4 | 41.6% |
| 10 | 27.4 | 6/8 | 16.7 | 3/4 | 61.0% |
| 11 | 0.0 | 0/1 | 0.0 | 0/1 | — |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### grand haven mi — largemouth bass

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** moderate_timing_low_magnitude.

July-August species-specific pier reports recur in 2018, 2025 and 2026. July and August recent port catches are positive in all four matched years, with August spread across years. A good August peak is supported more strongly than the smallmouth peak; spring habitat or spawning does not supply a bonus.[^1][^52][^35][^36][^37][^74]

**Structure/mode:** Grand Haven piers; South-Pier attribution strengthened by August 2026 pier-context report during North closure. Crankbaits, live bait, drop-shot rigs and other suitable artificials.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 06-01 | 3.0 | June port recurrence supports limited shoulder, not a spring spawning peak. |
| 06-15 | 4.0 | Three of four recent June strata positive, below July-August density. |
| 07-15 | 5.0 | Repeated species-specific July pier catches and four of four recent port recurrence support fair. |
| 08-15 | 6.5 | Repeated contemporary pier catches and comparatively stable August port strength support good. |
| 09-15 | 3.5 | September density falls sharply; limited port-supported shoulder. |
| 09-30 | 2.5 | End of evaluated fall shoulder; no unsupported winter tail. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 2.9 | 1/5 | 3.0 | 1/4 | 100.0% |
| 5 | 3.9 | 1/5 | 5.6 | 1/4 | 100.0% |
| 6 | 9.7 | 5/7 | 15.5 | 3/4 | 48.2% |
| 7 | 28.3 | 8/8 | 29.3 | 4/4 | 53.2% |
| 8 | 87.1 | 7/8 | 168.7 | 4/4 | 33.7% |
| 9 | 9.0 | 4/6 | 13.4 | 3/4 | 48.7% |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | 0.0 | 0/1 | 0.0 | 0/1 | — |
| 12 | 0.0 | 0/1 | 0.0 | 0/1 | — |

### manistee mi — lake trout

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

April 2023 and 2024 pier catches provide recurrence distinct from South-Pier-only April 2022 catches. Lean-component port data confirm sparse spring catches. Offshore abundance, autumn reef spawning and juvenile stocking do not establish covered-pier opportunity.[^1][^20][^22][^21][^62]

**Structure/mode:** April 2023 pier catches while South Pier closed support North attribution; 2024 side unspecified. Spawn, spoons or crankbaits within pier reach.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 04-01 | 2.0 | Evaluated spring boundary, consistent with sparse April catches; not an arrival claim. |
| 04-15 | 3.0 | Repeated few-fish spring pier reports justify limited opportunity only. |
| 05-15 | 2.5 | Sparse May lean-lake-trout port catches support only a weak shoulder. |
| 05-31 | 2.0 | End of spring review interval; no fall or summer curve inferred from biology alone. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 6.4 | 3/7 | 0.8 | 1/4 | 100.0% |
| 5 | 7.7 | 1/5 | 8.9 | 1/4 | 100.0% |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 5.3 | 4/6 | 0.9 | 2/4 | 66.7% |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

Lake-trout table is the Lean component only; omitted Fat rows have not been imputed.

### manistee mi — walleye

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

Nighttime pier catches recur in May 2019, 2022 and 2023, including explicit targeting in 2023, and variable April casting in 2024. Older port zero estimates in May conflict with these observations; retain contradiction rather than fit an obsolete July peak.[^1][^84][^18][^19][^23][^53]

**Structure/mode:** Unspecified piers with North-Pier context in May 2022; excluded closure-era South observations not assigned to North. Nighttime pier casting; river and boat trolling excluded.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 04-15 | 3.0 | Late-April casting reports support a limited proposed entry to the window. |
| 05-01 | 4.0 | Repeated May night fishing supports an improving limited window. |
| 05-15 | 4.5 | Multi-year May directed catches support low fair peak; no target-hour denominator. |
| 05-31 | 3.5 | Late-May shoulder; June 2016 North closure prevents extending North-Pier confidence from that report. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 2.2 | 3/8 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 10.9 | 2/7 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — smallmouth bass

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

June-August port season corroborated by species-specific July 2023/2024 and July 2026, plus August 2024 catches. Recent estimates are sparse and July 2026 was slow, so the curve remains limited-to-fair despite high older July totals.[^1][^30][^26][^28][^87][^88]

**Structure/mode:** Manistee piers, exact North-side species attribution incomplete; unidentified North-Pier bass not split. Nightcrawlers, spoons, jigs and soft plastics; early morning feasible.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 06-01 | 2.5 | June port recurrence supports a cautious shoulder. |
| 06-15 | 3.0 | June older catches exceed recent evidence; limited rating. |
| 07-15 | 4.5 | Repeated July species-specific pier catches support fair, tempered by sparse recent creel and 2026 slow report. |
| 08-15 | 3.5 | August 2024 few-fish pier report and older recurrence support limited continuation. |
| 08-31 | 2.5 | End of evaluated summer interval; river and lake bass do not extend the curve. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 4.2 | 3/7 | 0.0 | 0/4 | — |
| 5 | 2.4 | 3/6 | 1.4 | 1/4 | 100.0% |
| 6 | 23.0 | 3/7 | 0.0 | 0/4 | — |
| 7 | 57.0 | 5/8 | 6.0 | 1/4 | 100.0% |
| 8 | 21.3 | 3/7 | 6.7 | 1/4 | 100.0% |
| 9 | 5.1 | 2/6 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — freshwater drum

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

Pier reports recur in 2021 and 2023-2025 despite mostly zero recent creel estimates. June/July corroboration justifies a fair short proposal. No offshore or river reports counted; July 2026 boat drum excluded.[^1][^25][^30][^27][^26][^34][^88]

**Structure/mode:** Harbor/channel-facing piers; North-only attribution still needs method/side confirmation. Casting lures or bait on the harbor face.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 06-01 | 2.5 | Beginning of June port occurrence window, a low-confidence interpolation boundary. |
| 06-15 | 3.5 | June harbor-face reports support limited opportunity. |
| 07-15 | 4.5 | Repeated July reports support fair despite weak recent port estimates; below Grand Haven. |
| 07-31 | 3.5 | End of directly corroborated summer window; August is held pending stronger local evidence. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 3.5 | 1/5 | 0.0 | 0/4 | — |
| 6 | 13.5 | 4/8 | 0.0 | 0/4 | — |
| 7 | 35.2 | 2/7 | 0.0 | 0/4 | — |
| 8 | 12.0 | 3/7 | 0.0 | 0/4 | — |
| 9 | 11.2 | 3/7 | 0.2 | 1/4 | 100.0% |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — yellow perch

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** moderate_timing_low_magnitude.

April-May port catches recur strongly and North Pier has exact spring evidence. May exceeds April in both modern and recent pooled density. Large single-year contribution and 2022-2025 slow/sorting reports cap the proposal at good. June drops; July observation does not justify a productive tail.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24]

**Structure/mode:** North Pier explicitly corroborated in April 2017, May 2018 and June 2023. Minnows/wigglers from pier; schooling and small-fish sorting affect outcomes.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 04-01 | 5.0 | Evaluated April boundary supported by repeated monthly spring port catches, not a measured arrival. |
| 04-15 | 6.0 | Exact April North-Pier catches and modern recurrence support upper fair; recent catches concentrated. |
| 05-15 | 7.0 | Highest recurring spring port strength plus North-Pier spring corroboration support good, capped below excellent due variability and sorting. |
| 06-15 | 4.0 | Repeated June 2023 reports say hit-or-miss and include small fish; substantial decline from May. |
| 07-15 | 2.0 | Recent July estimates zero and 2022 observation is presence in otherwise slow fishing; poor meaningful opportunity. |
| 07-31 | 1.5 | Weak end of evaluated July tail; no invented autumn or winter perch curve. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 876.6 | 7/8 | 309.7 | 3/4 | 80.4% |
| 5 | 1703.2 | 8/9 | 2037.9 | 3/4 | 87.9% |
| 6 | 114.7 | 5/7 | 273.3 | 3/4 | 88.8% |
| 7 | 109.6 | 3/7 | 0.0 | 0/4 | — |
| 8 | 4.3 | 1/6 | 0.0 | 0/4 | — |
| 9 | 1.5 | 1/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — lake whitefish

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

April 2025 explicitly names lake whitefish, but older North-Pier spring and November reports say only whitefish. Two positive port years and species-ambiguous reports do not establish a current covered-pier seasonal magnitude; do not copy Grand Haven November.[^1][^21][^24][^80][^78]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** A couple lake whitefish in April 2025 and isolated port catch strata demonstrate occurrence. Unspecified whitefish and cisco from North Pier in 2022 cannot be reassigned. No recurring major intentional North Pier lake-whitefish fishery is proven.

**Seasonal lead retained:** Spring incidental record; no November transfer from Grand Haven.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 2.0 | 1/5 | 2.3 | 1/4 | 100.0% |
| 5 | 16.1 | 1/5 | 18.7 | 1/4 | 100.0% |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 15.5 | 1/5 | 24.1 | 1/4 | 100.0% |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — round whitefish

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

Species-specific menominee catches recur in April 2023 and April 2025. Older autumn port catches do not establish contemporary North-Pier autumn timing or magnitude. Spring remains limited and separate from lake whitefish.[^1][^20][^77][^24][^64][^11]

**Structure/mode:** Manistee piers; North attribution in April 2023 inferred from South closure, 2025 side unspecified. Waxworms, skein or spawn among spring salmonid catches.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 04-01 | 2.5 | Evaluated April boundary from monthly and report timing. |
| 04-15 | 3.5 | Repeated April menominee catches support limited spring opportunity. |
| 04-30 | 3.0 | Late-April 2025 mixed catches sustain a limited tail. |
| 05-15 | 2.5 | Sparse historical May round-whitefish catches justify only a weak proposed shoulder; later dates uncalibrated. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 1.6 | 3/7 | 1.4 | 1/4 | 100.0% |
| 5 | 1.2 | 2/7 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 24.9 | 4/8 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — channel catfish

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No qualifying current species-specific major North Pier fishery is established by reviewed estimates and reports. Upstream river or Manistee Lake catfish evidence would not resolve the pairing.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** No qualifying current species-specific major North Pier fishery is established by reviewed estimates and reports. Upstream river or Manistee Lake catfish evidence would not resolve the pairing.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### manistee mi — largemouth bass

**Research queue:** research_candidate. **Numeric status:** provisional_seasonal_proposal. **Confidence:** low.

Species-specific July 2023 and August 2024 catches support a narrow summer proposal, now stronger than a single-event lead. Only one recent positive July port year and few-fish report language restrict the entire curve to limited.[^1][^31][^87]

**Structure/mode:** Manistee harbor-facing piers; covered North-Pier attribution unresolved. Nightcrawlers or artificial lures.

**Unavailable dates:** Outside a bounded evidence-supported proposal; unknown does not mean absent.

| Anchor | Proposed seasonal value | Reason |
| --- | ---: | --- |
| 07-01 | 2.0 | Evaluated July boundary from sparse port catches, not a confirmed arrival. |
| 07-15 | 3.0 | July species-specific pier corroboration and sparse port recurrence support limited opportunity. |
| 08-07 | 3.0 | A few largemouth explicitly reported from pier in August 2024; does not justify a strong peak. |
| 08-31 | 2.0 | Weak end of August review window; no spring habitat-based or fall extension. |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 3.3 | 2/6 | 0.0 | 0/4 | — |
| 6 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 7 | 23.1 | 2/5 | 30.0 | 1/4 | 100.0% |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — lake trout

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Sparse port-mode cold-season catches do not establish intentional fishing from either covered breakwater. Current reports place the productive lake-trout fishery offshore at depth. Point Betsie stocking is outside the two covered breakwaters.[^1][^49][^55]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Sparse port-mode cold-season catches do not establish intentional fishing from either covered breakwater. Current reports place the productive lake-trout fishery offshore at depth. Point Betsie stocking is outside the two covered breakwaters.

**Seasonal lead retained:** No supported score interval at either structure.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 8.8 | 3/6 | 8.8 | 2/4 | 53.1% |
| 5 | 13.4 | 1/4 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 9.4 | 1/6 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 4.9 | 6/8 | 5.5 | 2/4 | 90.5% |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

Lake-trout table is the Lean component only; omitted Fat rows have not been imputed.

### frankfort elberta mi — walleye

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

April 2024 and May 2026 catches between/inside piers explicitly describe trolling. Historical sparse Pier/Dock catches do not convert that boat fishery into major breakwater casting opportunity.[^1][^23][^49]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** April 2024 and May 2026 catches between/inside piers explicitly describe trolling. Historical sparse Pier/Dock catches do not convert that boat fishery into major breakwater casting opportunity.

**Seasonal lead retained:** Spring trolling excluded; no supported pier curve.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 3.1 | 1/6 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 3.5 | 1/6 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — smallmouth bass

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Occasional summer port catches provide no adequate evidence of major directed fishing on either covered breakwater. Betsie Bay, river and Leland smallmouth reports are not interchangeable with these exact structures.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Occasional summer port catches provide no adequate evidence of major directed fishing on either covered breakwater. Betsie Bay, river and Leland smallmouth reports are not interchangeable with these exact structures.

**Seasonal lead retained:** Scattered August occurrence; no supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 10.9 | 2/6 | 7.4 | 1/4 | 100.0% |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 3.4 | 1/5 | 4.2 | 1/4 | 100.0% |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — freshwater drum

**Research queue:** research_candidate. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Sparse port catch estimates have no sufficient repeated exact-breakwater directed corroboration. Do not copy Grand Haven's channel drum fishery into Frankfort or Elberta.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Sparse port catch estimates have no sufficient repeated exact-breakwater directed corroboration. Do not copy Grand Haven's channel drum fishery into Frankfort or Elberta.

**Seasonal lead retained:** Scattered May/July estimates; no supported curve.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 13.7 | 1/4 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 13.1 | 2/6 | 15.8 | 1/4 | 100.0% |
| 8 | 7.0 | 1/6 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — yellow perch

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Reviewed port-mode estimates and exact-breakwater evidence do not establish a current major targeted perch fishery. Nearby inland lakes and boat fisheries are outside scope.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Reviewed port-mode estimates and exact-breakwater evidence do not establish a current major targeted perch fishery. Nearby inland lakes and boat fisheries are outside scope.

**Seasonal lead retained:** No supported score interval; missing or zero port rows do not prove ecological absence.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — lake whitefish

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Isolated spring port catches do not prove a recurring major lake-whitefish breakwater target. Historical menominee are a different species.[^1][^11]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** Isolated spring port catches do not prove a recurring major lake-whitefish breakwater target. Historical menominee are a different species.

**Seasonal lead retained:** Scattered May occurrence; no November curve inherited from Grand Haven.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 6.9 | 1/3 | 10.2 | 1/2 | 100.0% |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — round whitefish

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

The 2026 biologist interview recalls a Frankfort pier trip about ten years earlier, not a contemporary catch. It describes diminished abundance and interest, consistent with the weak modern port record. No current major target or Elberta-specific recurrence is established.[^1][^11]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** The 2026 biologist interview recalls a Frankfort pier trip about ten years earlier, not a contemporary catch. It describes diminished abundance and interest, consistent with the weak modern port record. No current major target or Elberta-specific recurrence is established.

**Seasonal lead retained:** Historical fishery retained as a lead; current seasonal timing unresolved.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — channel catfish

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No qualifying directed fishery on either covered breakwater was established. Regional catfish biology and river occurrence do not constitute pier evidence.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** No qualifying directed fishery on either covered breakwater was established. Regional catfish biology and river occurrence do not constitute pier evidence.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### frankfort elberta mi — largemouth bass

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No qualifying major directed largemouth fishery on either covered breakwater was established. Protected-harbor and inland-lake habitat cannot be assumed to apply to the breakwaters.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Unavailable dates:** No qualifying major directed largemouth fishery on either covered breakwater was established. Protected-harbor and inland-lake habitat cannot be assumed to apply to the breakwaters.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 4 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 5 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 6 | 0.0 | 0/3 | 0.0 | 0/2 | — |
| 7 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 8 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 9 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 10 | 0.0 | 0/5 | 0.0 | 0/4 | — |
| 11 | — | 0/0 | — | 0/0 | — |
| 12 | — | 0/0 | — | 0/0 | — |

### sheboygan wi — lake trout

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Wisconsin's tiny regional pier harvest cannot be assigned to Sheboygan. The stocking summary explicitly puts lake trout offshore on Sheboygan Reef, not at either covered pier. Boat success and reef stocking do not establish pier catchability.[^4][^5][^6][^54][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** Wisconsin's tiny regional pier harvest cannot be assigned to Sheboygan. The stocking summary explicitly puts lake trout offshore on Sheboygan Reef, not at either covered pier. Boat success and reef stocking do not establish pier catchability.

**Seasonal lead retained:** Regional modeled spring harvest is not a Sheboygan season.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — walleye

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Lake Michigan/Green Bay regional pier harvest has no Sheboygan allocation. River walleye and northern Green Bay fisheries cannot establish a major target at either Sheboygan pier.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** Lake Michigan/Green Bay regional pier harvest has no Sheboygan allocation. River walleye and northern Green Bay fisheries cannot establish a major target at either Sheboygan pier.

**Seasonal lead retained:** No supported score interval; modeled regional spring bins are inapplicable.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — smallmouth bass

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

A dated 2019 report explicitly names both piers and a few smallmouth among salmonids and carp. Directed effort was salmon/trout or unspecified. Regional pier harvest corroborates statewide mode relevance but cannot establish current major Sheboygan targeting.[^10][^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** A dated 2019 report explicitly names both piers and a few smallmouth among salmonids and carp. Directed effort was salmon/trout or unspecified. Regional pier harvest corroborates statewide mode relevance but cannot establish current major Sheboygan targeting.

**Seasonal lead retained:** Late-summer historical occurrence; no current exact-pier magnitude.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — freshwater drum

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No reviewed source establishes recurring major intentional drum targeting on the two covered piers. Absence from individually named regional harvest categories is not a zero estimate.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** No reviewed source establishes recurring major intentional drum targeting on the two covered piers. Absence from individually named regional harvest categories is not a zero estimate.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — yellow perch

**Research queue:** occurrence_lead. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

Regional pier perch harvest is real but geographically pooled. A local historical recollection describes diminished South Pier/power-plant-area perch fishing; its exact location and effort are imprecise. Neither establishes a current major fishery on the covered piers.[^4][^5][^6][^12][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** Regional pier perch harvest is real but geographically pooled. A local historical recollection describes diminished South Pier/power-plant-area perch fishing; its exact location and effort are imprecise. Neither establishes a current major fishery on the covered piers.

**Seasonal lead retained:** Historical lead only; no seasonal curve transferred from Michigan or Green Bay.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — lake whitefish

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No adequate recurring directed fishery at either covered pier was established. Green Bay whitefish fisheries and lake-wide biology are geographically insufficient; unlisted regional harvest is not a zero observation.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** No adequate recurring directed fishery at either covered pier was established. Green Bay whitefish fisheries and lake-wide biology are geographically insufficient; unlisted regional harvest is not a zero observation.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — round whitefish

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No adequate species-specific major directed fishery at either covered pier was established. Lake whitefish and northern Michigan menominee history are not transferable evidence.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** No adequate species-specific major directed fishery at either covered pier was established. Lake whitefish and northern Michigan menominee history are not transferable evidence.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — channel catfish

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No adequate current major directed channel-catfish fishery at either covered pier was established. Sheboygan River catches and general harbor claims are outside the exact-structure proof.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** No adequate current major directed channel-catfish fishery at either covered pier was established. Sheboygan River catches and general harbor claims are outside the exact-structure proof.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — largemouth bass

**Research queue:** not_established. **Numeric status:** unresolved_seasonal_calibration. **Confidence:** insufficient_for_numeric_calibration.

No adequate species-specific major directed largemouth fishery at either covered pier was established. Smallmouth observations, unspecified bass and protected inland habitat cannot substitute.[^4][^5][^6][^7][^10]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Unavailable dates:** No adequate species-specific major directed largemouth fishery at either covered pier was established. Smallmouth observations, unspecified bass and protected inland habitat cannot substitute.

**Seasonal lead retained:** No supported score interval.

**Evidence needed to resolve:** dated species-specific catches at a covered structure across the claimed season, with recurring results and enough current method/effort context to distinguish limited from fair or good opportunity. Regional, boat, upstream and excluded-structure reports cannot resolve that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

## Reproducibility and next phases

- Run `npm run generate:pier-cast:remaining-seasonal` for daily, weekly, monthly and coverage artifacts. Weekly bins begin January 1; week 52 includes December 24–31, with December 27 retained as the core-compatible review midpoint. Monthly means use available days only; availability counts prevent them from implying a complete month.
- Run `node scripts/generate-pier-cast-remaining-seasonal-report.mjs` for this evidence report. Raw snapshots and additional bulletin retrieval checksums are preserved locally.
- Run `npm run check:pier-cast:remaining-seasonal`, the existing remaining-species evidence checks, complete PierCast suite, core seasonal replay check and TypeScript checks. Tests establish implementation consistency, not empirical score accuracy.
- Phase 2 must resolve exact-side eligibility for each proposal, research thermal responses using appropriate endpoints, and implement bounded availability before enabling any additional runtime species. Do not import null-window anchors into the cyclic core interpolator. Lake whitefish lawful-method magnitude and Frankfort/Sheboygan candidate gaps remain evidence tasks, not permission to invent curves.
- Phase 3 must inspect daily/weekly species succession and overlapping peaks jointly, preserve real unavailable dates and unchanged public scientific gates, and reconcile deployment only if runtime/schema changes require it.

**Completion statement:** This is a reproducible Phase 1 research and provisional calibration package. It does not establish high-confidence numeric scores for all 45 pairings across all 12 months. Exact-side and annual evidence gaps are listed rather than hidden behind low scores. The ten still-unscored research candidates remain in the batch queue.

## Sources

All source records include geographic scope, fishing mode, review date and limitations in the linked JSON registers. Bulletin date headings and send dates can differ; phase1-sources.json preserves both where applicable. The retrieval ledger preserves hashes for newly reviewed bulletins. Each source below is cited for its actual scope; no source endorses the proposed numerical ratings.

[^1]: [Michigan DNR public creel dashboard; preserved query snapshot](https://app.powerbigov.us/view?r=eyJrIjoiOWQ5NjQxMmItYjFkYi00YzI2LTkxMTAtMjMwNjEzOWE5YjM3IiwidCI6ImQ1ZmI3MDg3LTM3NzctNDJhZC05NjZhLTg5MmVmNDcyMjVkMSJ9). Published date not stated; reviewed 2026-09-12. Scope: Four named Michigan ports; 1989–2022. Mode: Pier/Dock. No exact structure, target-specific effort, method, size composition or sampling uncertainty in this extract; omitted rows remain missing. See creel-snapshot.json.
[^2]: [Michigan DNR Fisheries Report 49 and 2025 creel supplement](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049.pdf). Published 2026-04; reviewed 2026-09-12. Scope: Michigan Great Lakes, including lake-wide Lake Michigan tables. Mode: Modes separated in supplement. Agency collection of trip-level fields does not mean those fields are available in the published aggregate. Cannot update a particular covered pier magnitude.
[^3]: [FR049 supplemental creel summary, Table S4](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049_supp_material_Creel_Summary_2025.xlsx). Published 2026; reviewed 2026-09-12. Scope: All surveyed Michigan Lake Michigan sites. Mode: Pier/Dock. No port or exact structure axis in Table S4; no local target-specific catch-effort series.
[^4]: [Wisconsin DNR 2022 open-water sportfishing report, Table 6](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf). Published 2023; reviewed 2026-09-12. Scope: All Wisconsin Lake Michigan and Green Bay survey areas. Mode: Pier (not shore/stream/boat). No Sheboygan × pier cross-tab; harvest understates released species. Winter unsurveyed periods do not establish fish absence.
[^5]: [Wisconsin DNR 2023 open-water sportfishing report, Table 6](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf). Published 2024; reviewed 2026-09-12. Scope: All Wisconsin Lake Michigan and Green Bay survey areas. Mode: Pier (not shore/stream/boat). No Sheboygan × pier cross-tab; harvest understates released species. Winter unsurveyed periods do not establish fish absence.
[^6]: [Wisconsin DNR 2024 open-water sportfishing report, Table 6](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf). Published 2025; reviewed 2026-09-12. Scope: All Wisconsin Lake Michigan and Green Bay survey areas. Mode: Pier (not shore/stream/boat). No Sheboygan × pier cross-tab; harvest understates released species. 2024 spring values modeled; October absent from modeled ramp/pier/shore values despite Sept/Oct heading.
[^7]: [Wisconsin DNR Lake Michigan Outdoor Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport). Published 2026-09-07; reviewed 2026-09-12. Scope: Sheboygan County paragraph, both piers. Mode: Pier/Shore paragraph; distinguish boat paragraph. Rolling URL. A salmon-directed report cannot establish absence of other species or their target-specific opportunity.
[^8]: [Michigan DNR November hook restrictions notice](https://www.michigan.gov/dnr/about/newsroom/releases/2025/11/12/single-pointed-hook-regulations-nov-1-30). Published 2025-11-12; reviewed 2026-09-12. Scope: Grand Haven port and two other ports; not South Pier alone. Mode: Mixed port angling. Historical harvest is unsuitable as a direct magnitude proxy for lawful current fishing. No lawful-method South-Pier effort/catch breakdown.
[^9]: [2026 Michigan Fishing Regulations](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf). Published 2026; reviewed 2026-09-12. Scope: Michigan; Ottawa County port exception. Mode: Legal context. A regulation is not proof of an abundant targeted fishery; no numeric seasonal values are derived from legal seasons.
[^10]: [Seehafer News, Outdoor Report](https://www.seehafernews.com/2019/09/07/outdoor-report-2/). Published 2019-09-07; reviewed 2026-09-12. Scope: Sheboygan north and south piers, separate from ramp. Mode: Pier; corroborating report reproduction. Incidental mixed-bag catches, not evidence of a major directed smallmouth fishery; seven-year-old observation.
[^11]: [Alan Campbell, Grayling and Menominee, Leelanau Enterprise](https://www.leelanaunews.com/article/7195,grayling-and-menominee). Published 2026-02-25; reviewed 2026-09-12. Scope: Northwest Michigan; biologist recalls Frankfort pier trip. Mode: Historical pier angling; attributed interview. 2026 publication is not a 2026 catch observation. Journalist species/season generalizations do not override species-specific DNR biology.
[^12]: [Grist, Wisconsin Friday Night fish fry](https://grist.org/food/climate-change-and-the-wisconsin-friday-night-fish-fry-midwest/). Published 2022; reviewed 2026-09-12. Scope: Sheboygan; resident recollection of South Pier/power-plant area. Mode: Historical recollection; method/location imprecise. Corroborating decline lead only; cannot prove absence, exact covered structure, effort or dates of a current fishery.
[^13]: [Michigan DNR Weekly Fishing Report 2017-04-20](https://content.govdelivery.com/accounts/MIDNR/bulletins/1953bab). Published 2017-04-20; reviewed 2026-09-12. Scope: Manistee North Pier. Mode: Pier. 2017 timing, not current magnitude.
[^14]: [Michigan DNR Weekly Fishing Report 2022-07-20](https://content.govdelivery.com/accounts/MIDNR/bulletins/323f6bf). Published 2022-07-20; reviewed 2026-09-12. Scope: Ludington and Manistee North Piers. Mode: Pier context. Observed presence is weaker than a quantified catch report.
[^15]: [Michigan DNR Weekly Fishing Report 2023-06-07](https://content.govdelivery.com/accounts/MIDNR/bulletins/35ed629). Published 2023-06-07; reviewed 2026-09-12. Scope: Ludington North Pier end. Mode: Pier. Low catches; does not establish a June peak.
[^16]: [Michigan DNR Weekly Fishing Report 2023-06-21](https://content.govdelivery.com/accounts/MIDNR/bulletins/3614332). Published 2023-06-21; reviewed 2026-09-12. Scope: Manistee North Pier; Ludington unspecified pier; Grand Haven pier. Mode: Pier. Mixed species and boat paragraphs excluded from pier inference.
[^17]: [Michigan DNR Weekly Fishing Report 2023-06-28](https://content.govdelivery.com/accounts/MIDNR/bulletins/36281c5). Published 2023-06-28; reviewed 2026-09-12. Scope: Manistee North Pier and Grand Haven piers. Mode: Pier. No directed angler-hours; Grand Haven side unspecified.
[^18]: [Michigan DNR Weekly Fishing Report 2022-05-11](https://content.govdelivery.com/accounts/MIDNR/bulletins/3176352). Published 2022-05-11; reviewed 2026-09-12. Scope: Manistee North Pier and other piers; Ludington unspecified piers. Mode: Pier and boat separately described. No major walleye fishery established; species catch counts estimated qualitatively.
[^19]: [Michigan DNR Weekly Fishing Report 2023-05-03](https://content.govdelivery.com/accounts/MIDNR/bulletins/3588f66). Published 2023-05-03; reviewed 2026-09-12. Scope: Manistee piers; Grand Haven channel from piers. Mode: Pier, with separate boat context. Pier side unspecified; a few catches do not define magnitude.
[^20]: [Michigan DNR Weekly Fishing Report 2023-04-12](https://content.govdelivery.com/accounts/MIDNR/bulletins/3548e2b). Published 2023-04-12; reviewed 2026-09-12. Scope: Manistee piers, south pier reported closed. Mode: Pier plus distinct channel/trolling paragraphs. Closure helps north-side inference, but low mixed catches do not establish directed fisheries.
[^21]: [Michigan DNR Weekly Fishing Report 2022-04-27](https://content.govdelivery.com/accounts/MIDNR/bulletins/3155afc). Published 2022-04-27; reviewed 2026-09-12. Scope: Manistee South Pier; North Pier. Mode: Pier. South-Pier lake trout cannot support North Pier. Unspecified whitefish cannot be assigned to either whitefish species.
[^22]: [Michigan DNR Weekly Fishing Report 2024-04-10](https://content.govdelivery.com/accounts/MIDNR/bulletins/39595be). Published 2024-04-10; reviewed 2026-09-12. Scope: Manistee unspecified piers. Mode: Pier. Occurrence only; exact side and directed effort absent.
[^23]: [Michigan DNR Weekly Fishing Report 2024-04-24](https://content.govdelivery.com/accounts/MIDNR/bulletins/3987c22). Published 2024-04-24; reviewed 2026-09-12. Scope: Manistee piers; Frankfort channel. Mode: Pier and trolling separately. Frankfort trolling excluded. Manistee casting location insufficiently precise for exact-pier calibration.
[^24]: [Michigan DNR Weekly Fishing Report 2025-04-30](https://content.govdelivery.com/accounts/MIDNR/bulletins/3de4822). Published 2025-04-30; reviewed 2026-09-12. Scope: Manistee unspecified piers. Mode: Pier and boats separately. Names distinguish two whitefish species; incidental catches and mixed modes cannot define major target strength.
[^25]: [Michigan DNR Weekly Fishing Report 2021-07-07](https://content.govdelivery.com/accounts/MIDNR/bulletins/2e736eb). Published 2021-07-07; reviewed 2026-09-12. Scope: Ludington North Pier; Manistee piers. Mode: Pier. Single exact smallmouth observation; Manistee drum advice is not measured directed effort.
[^26]: [Michigan DNR Weekly Fishing Report 2024-07-03](https://content.govdelivery.com/accounts/MIDNR/bulletins/3a65224). Published 2024-07-03; reviewed 2026-09-12. Scope: Manistee piers; Grand Haven channel side. Mode: Pier. Manistee side unspecified; distinct water faces must not be conflated.
[^27]: [Michigan DNR Weekly Fishing Report 2024-06-26](https://content.govdelivery.com/accounts/MIDNR/bulletins/3a521c4). Published 2024-06-26; reviewed 2026-09-12. Scope: Manistee harbor face of piers; Grand Haven piers. Mode: Pier. No exact north/south allocation; harbor-face thermal representation not automatically identical to outer-lake sampling.
[^28]: [Michigan DNR Weekly Fishing Report 2024-07-31](https://content.govdelivery.com/accounts/MIDNR/bulletins/3abfd6e). Published 2024-07-31; reviewed 2026-09-12. Scope: Manistee North Pier; Grand Haven piers. Mode: Pier. Unspecified bass not relabeled smallmouth or largemouth.
[^29]: [Michigan DNR Weekly Fishing Report 2023-07-12](https://content.govdelivery.com/accounts/MIDNR/bulletins/364ea3a). Published 2023-07-12; reviewed 2026-09-12. Scope: Ludington piers; Grand Haven piers. Mode: Pier. Agency send date/body July 12, 2023; page title incorrectly says July 17. Side unspecified.
[^30]: [Michigan DNR Weekly Fishing Report 2023-07-19](https://content.govdelivery.com/accounts/MIDNR/bulletins/366250d). Published 2023-07-19; reviewed 2026-09-12. Scope: Manistee and Ludington piers; Grand Haven piers. Mode: Pier. No exact-side allocation or directed effort.
[^31]: [Michigan DNR Weekly Fishing Report 2023-07-26](https://content.govdelivery.com/accounts/MIDNR/bulletins/3675eed). Published 2023-07-26; reviewed 2026-09-12. Scope: Manistee piers; Ludington piers. Mode: Pier. Side unspecified; broad summer bass evidence cannot create annual curves.
[^32]: [Michigan DNR Weekly Fishing Report 2026-04-22](https://content.govdelivery.com/accounts/MIDNR/bulletins/41407c5). Published 2026-04-22; reviewed 2026-09-12. Scope: Ludington stub pier. Mode: Pier, excluded structure. Explicitly excluded from North Breakwater support.
[^33]: [Michigan DNR Weekly Fishing Report 2021-05-05](https://content.govdelivery.com/accounts/MIDNR/bulletins/2d7cf51). Published 2021-05-05; reviewed 2026-09-12. Scope: Ludington stub pier. Mode: Pier, excluded structure. Does not establish spring smallmouth at North Breakwater.
[^34]: [Michigan DNR Weekly Fishing Report 2025-07-30](https://content.govdelivery.com/accounts/MIDNR/bulletins/3ebb776). Published 2025-07-30; reviewed 2026-09-12. Scope: Grand Haven, Ludington, Manistee piers. Mode: Pier. Species and sides not fully identified.
[^35]: [Michigan DNR Weekly Fishing Report 2025-07-16](https://content.govdelivery.com/accounts/MIDNR/bulletins/3e9b7f3). Published 2025-07-16; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Pier. Not smallmouth; few catches and unspecified side.
[^36]: [Michigan DNR Weekly Fishing Report 2025-08-20](https://content.govdelivery.com/accounts/MIDNR/bulletins/3eeac7b). Published 2025-08-20; reviewed 2026-09-12. Scope: Grand Haven and Ludington piers. Mode: Pier context. No target-effort or side breakdown.
[^37]: [Michigan DNR Weekly Fishing Report 2026-08-26](https://content.govdelivery.com/accounts/MIDNR/bulletins/426de2b). Published 2026-08-26; reviewed 2026-09-12. Scope: Grand Haven pier. Mode: Pier context. South-side inference depends on North-Pier closure, not an explicitly named catch structure.
[^38]: [Michigan DNR Weekly Fishing Report 2026-06-03](https://content.govdelivery.com/accounts/MIDNR/bulletins/41a3a94). Published 2026-06-03; reviewed 2026-09-12. Scope: Grand Haven channel; Manistee piers. Mode: Pier context. Grand Haven channel casting not individually structure-located.
[^39]: [Michigan DNR Weekly Fishing Report 2026-06-10](https://content.govdelivery.com/accounts/MIDNR/bulletins/41b62ae). Published 2026-06-10; reviewed 2026-09-12. Scope: Grand Haven channel from pier context. Mode: Pier context. No target-specific hours or per-side catches.
[^40]: [Michigan DNR Weekly Fishing Report 2026-06-17](https://content.govdelivery.com/accounts/MIDNR/bulletins/41c718b). Published 2026-06-17; reviewed 2026-09-12. Scope: Grand Haven piers/channel. Mode: Pier context. Current recurrence, not a measured daily rate.
[^41]: [Michigan DNR Weekly Fishing Report 2026-07-01](https://content.govdelivery.com/accounts/MIDNR/bulletins/41e9e6e). Published 2026-07-01; reviewed 2026-09-12. Scope: Grand Haven channel, North Pier closed. Mode: Pier context. South-side inference is reasonable but no station ID or catch count.
[^42]: [Michigan DNR Weekly Fishing Report 2026-07-22](https://content.govdelivery.com/accounts/MIDNR/bulletins/421929e). Published 2026-07-22; reviewed 2026-09-12. Scope: Ludington piers. Mode: Pier. No side or evidence of substantial directed drum effort.
[^43]: [Michigan DNR Weekly Fishing Report 2026-08-05](https://content.govdelivery.com/accounts/MIDNR/bulletins/423b34d). Published 2026-08-05; reviewed 2026-09-12. Scope: Ludington piers. Mode: Pier. Incidental/unspecified target; no north-side precision.
[^44]: [Michigan DNR Weekly Fishing Report 2026-08-19](https://content.govdelivery.com/accounts/MIDNR/bulletins/425abbc). Published 2026-08-19; reviewed 2026-09-12. Scope: Grand Haven and Ludington piers. Mode: Pier. Grand Haven bass not identified to species; Ludington side unspecified.
[^45]: [Michigan DNR Weekly Fishing Report 2026-09-02](https://content.govdelivery.com/accounts/MIDNR/bulletins/4280cb4). Published 2026-09-02; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Pier. Retain incidental context and weak September magnitude.
[^46]: [Michigan DNR Weekly Fishing Report 2024-11-06](https://content.govdelivery.com/accounts/MIDNR/bulletins/3c05a1b). Published 2024-11-06; reviewed 2026-09-12. Scope: Grand Haven channel. Mode: Jigging, mode/side not resolved. Historical gear predates current November restrictions; unspecified whitefish species.
[^47]: [Michigan DNR Weekly Fishing Report 2021-04-14](https://content.govdelivery.com/accounts/MIDNR/bulletins/2cce8db). Published 2021-04-14; reviewed 2026-09-12. Scope: Grand Haven pier. Mode: Pier. Side and targeted effort absent.
[^48]: [Michigan DNR Weekly Fishing Report 2021-04-21](https://content.govdelivery.com/accounts/MIDNR/bulletins/2cea412). Published 2021-04-21; reviewed 2026-09-12. Scope: Grand Haven pier. Mode: Pier. Same year and adjacent week are not independent annual recurrence; creel supplies additional year context.
[^49]: [Michigan DNR Weekly Fishing Report 2026-05-06](https://content.govdelivery.com/accounts/MIDNR/bulletins/4160ba5). Published 2026-05-06; reviewed 2026-09-12. Scope: Frankfort between piers. Mode: Boat trolling. Neither supports pier casting.
[^50]: [Michigan DNR Weekly Fishing Report 2019-08-07](https://content.govdelivery.com/accounts/MIDNR/bulletins/257279c). Published 2019-08-07; reviewed 2026-09-12. Scope: Manistee and Ludington. Mode: Pier and boat mixed by separate sentences. No directed pier-drum inference from these city paragraphs; offshore catches excluded.
[^51]: [Michigan DNR Weekly Fishing Report 2019-07-17](https://content.govdelivery.com/accounts/MIDNR/bulletins/2521a66). Published 2019-07-17; reviewed 2026-09-12. Scope: Manistee and Ludington. Mode: Pier and boat context. No directed pier-drum inference from these city paragraphs; offshore catches excluded.
[^52]: [Michigan DNR Weekly Fishing Report 2018-08-23](https://content.govdelivery.com/accounts/MIDNR/bulletins/207cdc1). Published 2018-08-23; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Mixed modes, separated in interpretation. Does not establish present-day exact-covered-pier opportunity.
[^53]: [Michigan DNR Weekly Fishing Report 2016-06-02](https://content.govdelivery.com/accounts/MIDNR/bulletins/14ccdb0). Published 2016-06-02; reviewed 2026-09-12. Scope: Manistee port, Ludington basin, upstream Grand River. Mode: Mixed modes, separated in interpretation. Does not establish present-day exact-covered-pier opportunity.
[^54]: [Wisconsin Lake Michigan Salmonid Stocking Program, August 2025](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf). Published 2025-08; reviewed 2026-09-12. Scope: Sheboygan Reef and county/site tables. Mode: Stocking, not angling. Stocked juveniles and offshore reefs do not establish adult pier catchability. Publication 2025 summarizes 2024 stocking.
[^55]: [Michigan DNR public fish stocking records; selected Lake Michigan sites](https://midnr.maps.arcgis.com/apps/dashboards/77581b13c6984b919ab8ed927496a31f). Published date not stated; reviewed 2026-09-12. Scope: Lake Michigan named waterbodies in Mason, Ottawa, Manistee and Benzie counties, 2023 onward. Mode: Stocking, not angling. Name/county filter is a bounded context query, not an exhaustive absence claim; federal/offshore records may be outside the service. Stocking neither proves nor is required for a fishery.
[^56]: [Michigan DNR creel data portal and ArcGIS item search](https://www.michigan.gov/dnr/managing-resources/fisheries/creel). Published date not stated; reviewed 2026-09-12. Scope: Michigan. Mode: Data discovery. This check did not expose a newer exact-site target-effort dataset. Data availability does not equal absence of agency-held records.
[^57]: [Wolter and Neuswanger, A Guide to the Future, five-year report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Pubs_2017GuidetotheFutureSummary.pdf). Published 2017; reviewed 2026-09-12. Scope: Three northwestern Wisconsin rivers, 2012-2016. Mode: Guided fly angling. Season, river and guide selection constrain transfer; no Lake Michigan pier calibration or warm-side decline is established. Do not reuse for incidental walleye/largemouth.
[^58]: [Jiao, Reid and Nudds, Variation in the catchability of yellow perch](https://academic.oup.com/icesjms/article/63/9/1695/699612). Published 2006; reviewed 2026-09-12. Scope: Lake Erie assessment fishery. Mode: Assessment gear, not pier angling. Methodological caution only; no numerical cross-species pier score mapping or thermal curve derived.
[^59]: [Lake trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_laketrout.pdf). Published 2008-04; reviewed null. Scope: Wisconsin Lake Michigan context. Mode: Agency fact-sheet summary; paired units rounded independently; method, sample and depth unspecified. [object Object]
[^60]: [Realized thermal niche approach eliminates temperature bias in bioenergetic model estimates](https://pmc.ncbi.nlm.nih.gov/articles/PMC10867506/). Published 2024-02-14; reviewed null. Scope: Lake Ontario. Mode: Acoustic and archival telemetry; daily means summarized at 30-day marks using surrounding days. [object Object]
[^61]: [In situ determination of the annual thermal habitat use by lake trout in Lake Huron](https://pubs.usgs.gov/publication/1000840). Published 2003; reviewed null. Scope: Lake Huron. Mode: 33 fish; 75-minute records; up to 14 months/fish. [object Object]
[^62]: [Lake trout species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout). Published date not stated; reviewed null. Scope: Michigan Great Lakes. Mode: Agency life-history summary. [object Object]
[^63]: [Initial insights into thermal ecology of lake whitefish in northwestern Lake Michigan](https://www.usgs.gov/publications/initial-insights-thermal-ecology-lake-whitefish-northwestern-lake-michigan). Published 2023; reviewed null. Scope: Northwestern Lake Michigan and Green Bay. Mode: 400 fish tagged; 13 recovered archival loggers; temperature sampled every four hours for up to 11 months. [object Object]
[^64]: [Round whitefish (menominee) species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/menominee). Published date not stated; reviewed null. Scope: Michigan. Mode: Agency life-history summary. [object Object]
[^65]: [Thermal ecology and seasonal distribution of adult walleye in Lakes Huron and Erie](https://pubs.usgs.gov/publication/70159488). Published 2015; reviewed null. Scope: Lakes Huron and Erie. Mode: Biologgers and telemetry; lake/resident-migrant comparisons. [object Object]
[^66]: [Annual migration and thermal experience of walleye in Lake Ontario](https://doi.org/10.1186/s40317-025-00410-8). Published 2025; reviewed null. Scope: Lake Ontario. Mode: Telemetry with temperature/activity interpretation. [object Object]
[^67]: [Smallmouth bass species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/smallmouth). Published date not stated; reviewed null. Scope: Michigan. Mode: Agency life-history summary. [object Object]
[^68]: [Habitat suitability index models: Smallmouth bass](https://www.govinfo.gov/content/pkg/GOVPUB-I49-PURL-LPS101721/pdf/GOVPUB-I49-PURL-LPS101721.pdf). Published date not stated; reviewed null. Scope: General. Mode: HSI synthesis citing laboratory acclimation/preference studies. [object Object]
[^69]: [Freshwater drum species fact sheet](https://nas.er.usgs.gov/queries/factsheet.aspx?speciesid=946). Published date not stated; reviewed null. Scope: North America. Mode: Agency synthesis of referenced literature. [object Object]
[^70]: [Biology of freshwater drum in western Lake Erie](https://www.usgs.gov/publications/biology-freshwater-drum-western-lake-erie). Published date not stated; reviewed null. Scope: Western Lake Erie. Mode: Historical field study. [object Object]
[^71]: [Yellow perch (Perca flavescens) species profile](https://www.usgs.gov/labs/fish-health-program/science/yellow-perch-perca-flavescens-fhp). Published date not stated; reviewed null. Scope: General. Mode: Agency species summary. [object Object]
[^72]: [Yellow perch species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/yellow-perch). Published date not stated; reviewed null. Scope: Michigan. Mode: Agency life-history summary. [object Object]
[^73]: [Catfish species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/catfish). Published date not stated; reviewed null. Scope: Michigan. Mode: Agency life-history summary. [object Object]
[^74]: [Largemouth bass species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/largemouth). Published date not stated; reviewed null. Scope: Michigan. Mode: Agency life-history summary. [object Object]
[^75]: [Michigan DNR Weekly Fishing Report 2017-12-14](https://content.govdelivery.com/accounts/MIDNR/bulletins/1cb4c9f). Published 2017-12-14; reviewed 2026-09-12. Scope: Grand Haven. Mode: Port, mode unspecified. Neither taxonomic identity of whitefish nor pier mode for perch established; no December pier score.
[^76]: [Michigan DNR Weekly Fishing Report 2026-03-11](https://content.govdelivery.com/accounts/MIDNR/bulletins/40db479). Published 2026-03-11; reviewed 2026-09-12. Scope: Manistee and Frankfort. Mode: Pier and shoreline. Failure during restricted access does not establish species-specific winter absence.
[^77]: [Michigan DNR Weekly Fishing Report 2025-04-16](https://content.govdelivery.com/accounts/MIDNR/bulletins/3dc30dc). Published 2025-04-16; reviewed 2026-09-12. Scope: Manistee piers; Ludington boat paragraph. Mode: Pier at Manistee; boat context at Ludington. Manistee side unspecified. Ludington boat catches must not become North Breakwater evidence.
[^78]: [Michigan DNR Weekly Fishing Report 2019-11-07](https://content.govdelivery.com/accounts/MIDNR/bulletins/26a3cdd). Published 2019-11-07; reviewed 2026-09-12. Scope: Grand Haven and Manistee. Mode: Grand Haven pier context; Manistee pier. Whitefish taxon unspecified; predates current November gear rule. Cannot determine lawful current lake-whitefish magnitude.
[^79]: [Michigan DNR Weekly Fishing Report 2012-11-08](https://content.govdelivery.com/accounts/MIDNR/bulletins/5b6f6e). Published 2012-11-08; reviewed 2026-09-12. Scope: Grand Haven report; Tawas fishing tip. Mode: Grand Haven unspecified; Tawas pier technique. Tawas technique is regional context only; no transfer of Tawas timing or strength to a covered city.
[^80]: [Michigan DNR Weekly Fishing Report 2018-05-03](https://content.govdelivery.com/accounts/MIDNR/bulletins/1edc9d3). Published 2018-05-03; reviewed 2026-09-12. Scope: Manistee North Pier. Mode: Pier. Whitefish taxon unspecified; cannot identify lake versus round whitefish.
[^81]: [Michigan DNR Weekly Fishing Report 2018-04-12](https://content.govdelivery.com/accounts/MIDNR/bulletins/1e722ec). Published 2018-04-12; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Pier. Pier side and directed effort unspecified; modest spring occurrence, not high catch magnitude.
[^82]: [Michigan DNR Weekly Fishing Report 2020-06-24](https://content.govdelivery.com/accounts/MIDNR/bulletins/2927150). Published 2020-06-24; reviewed 2026-09-12. Scope: Ludington North Pier; Manistee North Pier. Mode: Pier. Qualitative 2020 observation retained; 2020 quantitative creel excluded. Unidentified bass not split into species.
[^83]: [Michigan DNR Weekly Fishing Report 2023-06-14](https://content.govdelivery.com/accounts/MIDNR/bulletins/3600e54). Published 2023-06-14; reviewed 2026-09-12. Scope: Manistee North Pier. Mode: Pier. Same-year adjacent bulletins are not independent annual recurrence; variable success limits magnitude.
[^84]: [Michigan DNR Weekly Fishing Report 2019-05-16](https://content.govdelivery.com/accounts/MIDNR/bulletins/2452955). Published 2019-05-16; reviewed 2026-09-12. Scope: Manistee pier paragraph. Mode: Pier context; nighttime. Side unspecified; night timing matters. Frankfort lake trout in same bulletin lack demonstrated pier mode.
[^85]: [Michigan DNR Weekly Fishing Report 2013-11-21](https://content.govdelivery.com/accounts/MIDNR/bulletins/95e0dc). Published 2013-11-21; reviewed 2026-09-12. Scope: Grand Haven. Mode: Pier/surf paragraph. Species and structure unspecified; old observation cannot calibrate contemporary lawful lake-whitefish catchability.
[^86]: [Michigan DNR Weekly Fishing Report 2019-11-21](https://content.govdelivery.com/accounts/MIDNR/bulletins/26d27d2). Published 2019-11-21; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Pier jigging. Unidentified whitefish; jigging and harvest may not be transferable to November rules effective since 2025.
[^87]: [Michigan DNR Weekly Fishing Report 2024-08-07](https://content.govdelivery.com/accounts/MIDNR/bulletins/3ad6654). Published 2024-08-07; reviewed 2026-09-12. Scope: Manistee piers. Mode: Pier. Species identified but pier side, effort, sizes and repeated directed success unspecified; supports a limited August window.
[^88]: [Michigan DNR Weekly Fishing Report 2026-07-08](https://content.govdelivery.com/accounts/MIDNR/bulletins/41fa7c2). Published 2026-07-08; reviewed 2026-09-12. Scope: Manistee piers; separate boat paragraph. Mode: Pier for smallmouth; boat for drum. Drum outside harbor are boat catches, not extra pier corroboration. Slow smallmouth result restrains summer magnitude.
[^89]: [Michigan DNR Weekly Fishing Report 2016-07-28](https://content.govdelivery.com/accounts/MIDNR/bulletins/15952cf). Published 2016-07-28; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Pier. Pier side and effort unspecified; older confirmation of summer recurrence.
[^90]: [Michigan DNR Weekly Fishing Report 2018-09-06](https://content.govdelivery.com/accounts/MIDNR/bulletins/20b15b2). Published 2018-09-06; reviewed 2026-09-12. Scope: Grand Haven piers. Mode: Pier. Pier side and target-specific effort unspecified; no transfer of upstream catches.
[^91]: [Michigan DNR Weekly Fishing Report 2022-10-26](https://content.govdelivery.com/accounts/MIDNR/bulletins/3347f01). Published 2022-10-26; reviewed 2026-09-12. Scope: Michigan statewide reporting program. Mode: Reporting coverage, not a catch observation. Missing winter reports are not zero catches and cannot establish winter opportunity or absence.
[^92]: [Jordan and Talhelm: Economic impacts of sport fishing in Muskegon and Ottawa Counties, October 1981–October 1982](https://repository.library.noaa.gov/view/noaa/2064/noaa_2064_DS1.pdf). Published 1982; reviewed 2026-09-12. Scope: Four sampling areas; Grand Haven North Pier in local catch section. Mode: Pier; separate ice, bayou, boat and charter sections. 1981–1982 evidence, not modern opportunity. North Pier is excluded from current Grand Haven coverage. General regional seasonal narrative cannot establish species timing at South Pier. Historical lake-trout river-run wording is not adopted as a contemporary biological assumption.
