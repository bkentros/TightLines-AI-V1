# PierCast remaining-species seasonal research — Phase 1

Reviewed 2026-09-12. This document accompanies the [authoritative seasonal proposals](../../../PierCast_Remaining_Species_Seasonal_Curves.json), [52-week review](../../../PierCast_Remaining_Species_Weekly_Ratings.csv), [daily values](phase1-daily-ratings.csv), [monthly values](phase1-monthly-ratings.csv) and [coverage counts](phase1-coverage.json).

## Outcome and limits

All 45 city × species combinations have a final Phase 1 disposition: **16 accepted annual research calibrations and 29 deferred pairings**. The accepted curves contain 192 documented month-day anchors and supply 5,840 numeric species-days and 832 numeric weekly samples in 2025. Deferred pairings remain entirely unavailable; they are not species declared biologically absent. Research acceptance is broader than the earlier strict major-target audit and does not itself authorize runtime or public release.

Every accepted pairing has a continuous January–December curve, including weak periods. This follows the clarified product requirement. Phase 1 configuration and evidence synthesis are complete; high-confidence empirical accuracy is not established by this package. Winter and some shoulder values are explicitly low-confidence habitat/accessibility judgments. They must not be presented as measured local winter catch rates.

The recurring warm-season fisheries deserve batch development. Grand Haven drum and largemouth have the strongest proposed summer windows; Manistee perch has a stronger spring window than summer. Ludington perch peaks later than Manistee perch. A fishery can be worth targeting without being a premier salmonid-scale opportunity. Several species can simultaneously receive strong values: there is no quota of seasonal winners.

The four completed core species, their weekly table and runtime configuration remain unchanged. Their existing 1–10 rubric governs these proposals. The UI, scoring formula, temperature pipeline, daily lock, city footprint, seven covered structures and disabled public release remain unchanged. Phase 2 owns thermal-response work and runtime eligibility; Phase 3 owns the joint annual-lineup review.

## Accepted annual roster

These are additions proposed for Phase 2, alongside the unchanged completed four species in every city.

| City | Accepted additional annual calibrations | Count |
| --- | --- | ---: |
| Ludington | Smallmouth bass, freshwater drum, yellow perch | 3 |
| Grand Haven | Smallmouth bass, freshwater drum, lake whitefish, round whitefish, channel catfish, largemouth bass | 6 |
| Manistee | Lake trout, walleye, smallmouth bass, freshwater drum, yellow perch, round whitefish, largemouth bass | 7 |
| Frankfort–Elberta | None yet; all nine additional pairings deferred | 0 |
| Sheboygan | None yet; all nine additional pairings deferred | 0 |

No additional accepted species in Frankfort–Elberta or Sheboygan means insufficient evidence for this calibration pass, not an assertion that these piers lack other fish or winter fishing.

## What a number means

A seasonal value is a product calibration judgment about pier opportunity under supportive temperature. It is not fish abundance, a catch percentage, fish per hour, a government rating or a prediction that fish will bite. The existing bands are negligible 1, poor through 2, limited through 4, fair through 6, good through 8, excellent through 9.4, and premier above 9.4. The completed catalog reference remains Manistee late-October steelhead at 10.

Sparse anchors are deliberately coarse, mostly half-point increments. No evidence identifies an exact 6.5 optimum on a particular day. Representative mid-month anchors carry approximately month-level timing resolution. Anchor dates are representative seasonal reference points, not demonstrated arrival or departure dates. Daily and weekly decimals between anchors are arithmetic, not additional biological findings. A score difference of 0.5 between weakly supported proposals should not be treated as statistically established.

Each anchor records its rationale, source identifiers, evidence/inference basis and confidence in the JSON. Linear interpolation uses actual calendar days and wraps from December to January, exactly like the completed core curves. There are no seasonal availability windows. The detached generated TypeScript configuration is research-only and is not imported by runtime city assembly. Identical poor-band values in some months express the same coarse judgment, not a shared city curve or a measured common winter rate.

An annual seasonal curve describes accessibility and fishery opportunity under supportive temperature. Regional studies inform habitat direction only after local fishery admission. They do not independently admit a species, justify a strong peak, or fit a temperature-to-bite relationship.

## Evidence hierarchy and interpretation

1. Michigan DNR port-specific Pier/Dock estimates establish broad calendar recurrence and within-species comparisons. Modern 2012–2022 and recent 2018–2022 subsets exclude 2020 consistently with the preserved audit. Catch estimates, explicit zeros and omitted rows remain distinct.[^1][^56]
2. Dated DNR weekly paragraphs corroborate pier mode, species identity, practical methods and contemporary timing. A report of bass is not both bass species; whitefish is not automatically lake whitefish or menominee. A report of boats fishing from pierheads out to depth is not pier angling.
3. The 2025 Michigan creel supplement is newer but its Lake Michigan Pier/Dock table is lake-wide. Wisconsin 2022–2024 pier tables combine survey regions and cannot supply Sheboygan-only rates; 2024 sampling and modeling gaps require particular caution.[^2][^3][^4][^5][^6]
4. Agency species accounts and studies explain plausible mechanisms. Spawning, thermal occupancy, tolerances, growth and nearshore juvenile sampling do not supply bite probabilities or establish adult pier catches. Stocking records establish releases, not contemporary adult pier strength.[^62][^64][^67][^72][^55][^54]
5. Dated local reports and historical biologist recollections are corroboration or leads only. Sheboygan smallmouth and perch leads remain distinguishable from regional harvest and upstream fisheries.[^10][^12][^11]

The rates below divide matched published catch estimates by **all-species Pier/Dock hours**. They are not directed catch rates. Changes in target effort, school encounters, fish size and catch-and-release practices can alter them without equivalent changes in an individual's opportunity. Perch counts cannot be converted into the salmonid scale with the same logarithmic transformation. We inspect recurrence, recent concentration, direct observations, method and structure before assigning a band. No invented quantitative discount corrects absent effort data.[^58]

For lake trout the original conservative combined summary requires both Lean and Fat component rows. That omits some known Lean observations. The tables below therefore show **Lean Lake Trout only** for transparent seasonal inspection, never as a complete combined-species total. Candidate recurrence can count a known positive component without assuming that an absent component is zero.

## Material contradictions and their resolution

- **Winter:** January–March contain no matched local strata in the preserved extract. Missing observations remain missing. Annual weak-season values combine established local seasonal recurrence with explicitly transferred habitat evidence. Drum summer shallowing/deeper late-fall distribution, perch depth use and connected river-mouth movements, and bass habitat studies constrain direction, not numerical catch probability. Walleye winter feeding and continued winter bass/catfish activity contradict a universal inactivity floor. Heated discharge observations cannot establish unheated pier success.[^93][^95][^96][^94][^97][^98][^101][^103][^99][^100]
- **Perch:** Manistee's April–May strength contrasts with Ludington's June–July pattern. Large pooled estimates coexist with concentrated catch years, small fish and slow contemporary reports. Proposed peaks stop at good or fair, without pretending every year produces the historical best outcome.[^13][^80][^82][^15][^17]
- **Manistee walleye:** older May zero estimates conflict with repeated May night catches in 2019, 2022 and 2023. The annual curve’s strongest night-fishing period follows the direct multi-year timing instead of giving the old July estimate an automatic summer peak. The discrepancy is unresolved statistically, not erased.[^84][^18][^19]
- **Drum:** Grand Haven has strong recurring summer port records and contemporary catches. Manistee has recent pier reports despite mostly zero recent creel estimates, while Ludington's modern recurrence exceeds its recent series. They receive separate curves and ceilings; there is no shared drum curve.[^39][^40][^27][^42]
- **Lake trout:** spring Manistee pier catches and repeated October Lean-component port catches support limited shoulders with different confidence. Shallow cold-season habitat supports a poor winter accessibility judgment, not a measured winter fishery. Offshore abundance, stocking and spawning cannot supply other cities’ curves. The April 2025 Ludington “pierheads out to 50 feet” wording occurs in boat context and is excluded from pier corroboration.[^20][^22][^77][^62]
- **Grand Haven lake whitefish:** current DNR recognition supports admission of a lawful autumn target. Historical snagging harvest is discarded as a magnitude basis. November 3.5 is an explicitly low-confidence limited-band product judgment; it is not a statistical estimate or a percentage discount applied to historical harvest. Deep summer habitat and nearshore late-autumn behavior inform annual shape. Contemporary lawful-method effort data remain a validation priority.[^8][^9][^78][^86][^102]
- **Species biology:** smallmouth's rocky habitat and largemouth's vegetation association explain different use of harbor faces, but neither makes every pier equivalent. Menominee's shallow spring/fall biology and pre-spawn feeding cessation argue against a generic spawning bonus. Temperature suitability remains a separate Phase 2 endpoint.[^67][^74][^64]

## Cross-city and completed-scale review

The highest new proposal is 7.0, shared by Grand Haven June drum and Manistee May perch. This is an evidence decision, not a permanent rule that non-salmonids must score lower. Neither has sufficiently strong contemporary exact-structure effort evidence here to justify an excellent or premier rating. Grand Haven August largemouth and drum can both be 6.5. Manistee smallmouth/drum and Ludington smallmouth/drum have lower ceilings because contemporary reports and recent estimates are weaker or more variable. No port inherits a neighboring city's curve.

Core comparisons are qualitative calibration checks only. The completed four-species in-sample replay is not an independent validation of these proposals, and it does not validate a universal catch-count conversion. Phase 3 must inspect all species together without altering already-completed core curves merely to create calendar coverage.

## All 45 pairings

The following retains candidate discovery separately from numeric readiness. “Unresolved” describes evidence sufficiency, not ecological absence or removal from the candidate queue. For each Michigan pairing, tables show modern/recent rates and positive/matched years; a dash means no matched catch-and-effort support. The anchor tables cover all 12 months for accepted pairings. Creel tables also show all 12 months so missing winter observations remain distinguishable from inferred annual ratings.

### ludington mi — lake trout

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Scattered April/October port estimates do not establish a recurring intentional North Breakwater fishery. Offshore lake-trout abundance is inapplicable. Recent harbor and reef stocking is confirmed, but stocked numbers do not demonstrate a major adult pier target.[^1][^51][^50][^55]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Scattered April/October port estimates do not establish a recurring intentional North Breakwater fishery. Offshore lake-trout abundance is inapplicable. Recent harbor and reef stocking is confirmed, but stocked numbers do not demonstrate a major adult pier target.

**Deferral reason:** Scattered April/October port estimates do not establish a recurring intentional North Breakwater fishery. Offshore lake-trout abundance is inapplicable. Recent harbor and reef stocking is confirmed, but stocked numbers do not demonstrate a major adult pier target.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

One or two evening pier walleye in May 2022 corroborate possibility, but the pier side, repeated directed effort and major-fishery strength are missing. Basin fishing is not automatically North Breakwater fishing.[^1][^18][^53]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: One or two evening pier walleye in May 2022 corroborate possibility, but the pier side, repeated directed effort and major-fishery strength are missing. Basin fishing is not automatically North Breakwater fishing.

**Deferral reason:** One or two evening pier walleye in May 2022 corroborate possibility, but the pier side, repeated directed effort and major-fishery strength are missing. Basin fishing is not automatically North Breakwater fishing.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

July catches recur in eight modern port years and three of four recent years. Species-specific pier reports persist through 2026. Fair summer ceiling recognizes many few-fish reports and excludes spring stub-pier catches.[^1][^25][^29][^36][^44][^32][^33][^94][^101][^67]

**Structure/mode:** North Breakwater corroborated in July; remaining port and unspecified-pier observations qualified. Casting lures/plastics from pier.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 04-15 | 1.5 | local_evidence_and_habitat_judgment; low | Modern April zeros and excluded stub-pier records preclude an early spring boost.[^1][^25][^29][^36][^44][^32][^33][^94][^101][^67] |
| 05-15 | 2.5 | local_evidence_and_habitat_judgment; low | Two modern May port-positive years allow a limited shoulder; North Breakwater specificity is weaker than July.[^1][^25][^29][^36][^44][^32][^33][^94][^101][^67] |
| 06-15 | 3.5 | local_evidence_calibration; low | Modern June catches recur, but recent matched June estimates are zero; limited shoulder.[^1][^25][^29][^36][^44][^32][^33] |
| 07-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | Best repeatability plus exact North-Pier July corroboration; few-fish reports limit ceiling to fair.[^1][^25][^29][^36][^44][^32][^33] |
| 08-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | Recent August pier reports sustain a limited opportunity despite weaker port density.[^1][^25][^29][^36][^44][^32][^33] |
| 09-15 | 2.5 | local_evidence_calibration; low | September port catches concentrated in one recent year; no strong fall tail.[^1][^25][^29][^36][^44][^32][^33] |
| 10-15 | 1.5 | local_evidence_and_habitat_judgment; low | Matched October port estimates are zero; no transferred inland fall-bass peak.[^1][^25][^29][^36][^44][^32][^33][^94][^101][^67] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

Repeated July-August port catches and July/August 2026 pier reports support a limited-to-fair summer peak in an annual curve. Recent port recurrence is much weaker than Grand Haven; no borrowed May-June curve.[^1][^42][^43][^93][^70]

**Structure/mode:** Unspecified Ludington piers; exact North Breakwater attribution remains a Phase 2 gate. Lures or bottom-fished crawlers.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 04-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 05-15 | 2.0 | local_evidence_and_habitat_judgment; low | One modern May port-positive year is an episodic poor shoulder, not Grand Haven May strength.[^1][^42][^43][^93][^70] |
| 06-15 | 2.0 | local_evidence_and_habitat_judgment; low | Explicit June port zeros restrain the shoulder before July; shallow-water biology alone cannot earn fair.[^1][^42][^43][^93][^70] |
| 07-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | July modern recurrence and several pier drum in July 2026 support fair opportunity, not good or excellent.[^1][^42][^43] |
| 08-15 | 3.5 | local_evidence_calibration; low | August 2026 few-fish report and older port catches support a weaker late-summer window.[^1][^42][^43] |
| 09-15 | 2.0 | local_evidence_and_habitat_judgment; low | Sparse modern September positives, absent in the recent slice, leave a poor tail.[^1][^42][^43][^93][^70] |
| 10-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

June-July port catches are large but schooling concentrates catches in few years. Three of four recent July strata positive versus one of three in June; 2020 and 2023 slow reports prevent an excellent ceiling. August drops sharply. No automatic spring peak from generic perch biology.[^1][^14][^15][^16][^29][^31][^82][^95][^96][^72]

**Structure/mode:** North Breakwater has exact June/July evidence; August magnitude uses port-mode shoulder inference. Minnows/wigglers and small bait presentations within pier reach.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^95][^96][^72] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^95][^96][^72] |
| 03-15 | 2.0 | local_evidence_and_habitat_judgment; low | Approach to spring habitats permits only a poor pre-season estimate; no invented spring run.[^1][^14][^15][^16][^29][^31][^82][^95][^96][^72] |
| 04-15 | 2.0 | local_evidence_and_habitat_judgment; low | Modern April zeros prevent borrowing Manistee spring strength.[^1][^14][^15][^16][^29][^31][^82][^95][^96][^72] |
| 05-15 | 2.0 | local_evidence_and_habitat_judgment; low | Modern May zeros retain a poor value before the local June increase.[^1][^14][^15][^16][^29][^31][^82][^95][^96][^72] |
| 06-15 | 5.0 | local_evidence_calibration; moderate_timing_low_magnitude | Large June port estimates but one-year recent concentration and variable direct catches justify fair only.[^1][^14][^15][^16][^29][^31][^82] |
| 07-15 | 6.0 | local_evidence_calibration; moderate_timing_low_magnitude | July is the strongest recurring local port window, capped at fair because recent reports remain variable or slow.[^1][^14][^15][^16][^29][^31][^82] |
| 08-15 | 2.5 | local_evidence_calibration; low | Recent August density is far below July and dominated by one year.[^1][^14][^15][^16][^29][^31][^82] |
| 09-15 | 2.0 | local_evidence_and_habitat_judgment; low | Older September catches are concentrated and recent matched strata zero; retain poor.[^1][^14][^15][^16][^29][^31][^82][^95][^96][^72] |
| 10-15 | 1.5 | local_evidence_and_habitat_judgment; low | Recent October port zeros and non-pier autumn reports cannot create a fall peak.[^1][^14][^15][^16][^29][^31][^82][^95][^96][^72] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^1][^95][^96][^72] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^95][^96][^72] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Rare port estimates and generic whitefish references do not identify a repeatable lake-whitefish target at North Breakwater. Do not transfer Grand Haven November conditions or misidentify menominee.[^1][^8]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Rare port estimates and generic whitefish references do not identify a repeatable lake-whitefish target at North Breakwater. Do not transfer Grand Haven November conditions or misidentify menominee.

**Deferral reason:** Rare port estimates and generic whitefish references do not identify a repeatable lake-whitefish target at North Breakwater. Do not transfer Grand Haven November conditions or misidentify menominee.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Older autumn port catches support a historical lead. Recent matched autumn strata lack comparable catches; no current major directed North Breakwater fishery is established. Regional decline context is not a local absence measurement.[^1][^11]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Older autumn port catches support a historical lead. Recent matched autumn strata lack comparable catches; no current major directed North Breakwater fishery is established. Regional decline context is not a local absence measurement.

**Deferral reason:** Older autumn port catches support a historical lead. Recent matched autumn strata lack comparable catches; no current major directed North Breakwater fishery is established. Regional decline context is not a local absence measurement.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Reviewed Pier/Dock estimates and dated pier evidence do not establish a major intentional channel-catfish fishery at North Breakwater. River, inland-lake and general Lake Michigan presence are insufficient.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Reviewed Pier/Dock estimates and dated pier evidence do not establish a major intentional channel-catfish fishery at North Breakwater. River, inland-lake and general Lake Michigan presence are insufficient.

**Deferral reason:** Reviewed Pier/Dock estimates and dated pier evidence do not establish a major intentional channel-catfish fishery at North Breakwater. River, inland-lake and general Lake Michigan presence are insufficient.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No adequate species-specific North Breakwater target evidence. Do not convert smallmouth, rock bass, or unspecified bass into largemouth; warm-water biology does not establish local fishing opportunity.[^1][^29]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No adequate species-specific North Breakwater target evidence. Do not convert smallmouth, rock bass, or unspecified bass into largemouth; warm-water biology does not establish local fishing opportunity.

**Deferral reason:** No adequate species-specific North Breakwater target evidence. Do not convert smallmouth, rock bass, or unspecified bass into largemouth; warm-water biology does not establish local fishing opportunity.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Sparse cold-season port catches and offshore fisheries do not establish a repeatable major South Pier target. A grouped Grand Haven/Holland agency listing cannot identify the productive port, structure or mode.[^1][^55]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Sparse cold-season port catches and offshore fisheries do not establish a repeatable major South Pier target. A grouped Grand Haven/Holland agency listing cannot identify the productive port, structure or mode.

**Deferral reason:** Sparse cold-season port catches and offshore fisheries do not establish a repeatable major South Pier target. A grouped Grand Haven/Holland agency listing cannot identify the productive port, structure or mode.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Low and intermittent spring port catches do not establish a major South Pier target. Upstream Grand River fisheries and a combined Grand Haven/Holland listing are outside the required geographic proof.[^1][^53]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Low and intermittent spring port catches do not establish a major South Pier target. Upstream Grand River fisheries and a combined Grand Haven/Holland listing are outside the required geographic proof.

**Deferral reason:** Low and intermittent spring port catches do not establish a major South Pier target. Upstream Grand River fisheries and a combined Grand Haven/Holland listing are outside the required geographic proof.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

Species-specific August pier report corroborates port catches. Modern August positive in six of seven matched years and recent four of four, but one recent year contributes most catches. Unidentified bass in current reports cannot independently raise smallmouth scores.[^1][^52][^34][^44][^94][^101][^67]

**Structure/mode:** Grand Haven piers; South-Pier-specific contribution unresolved. Casting live bait or artificial lures.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 04-15 | 2.0 | local_evidence_and_habitat_judgment; low | A few positive April port years support poor episodic access, not a spawning peak.[^1][^52][^34][^44][^94][^101][^67] |
| 05-15 | 2.5 | local_evidence_and_habitat_judgment; low | Sparse May port recurrence supports only limited access.[^1][^52][^34][^44][^94][^101][^67] |
| 06-15 | 3.5 | local_evidence_calibration; low | Four of seven modern June strata positive; no strong exact-side catch series.[^1][^52][^34][^44] |
| 07-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | July catches recur but at low all-mode density; retain limited band.[^1][^52][^34][^44] |
| 08-15 | 5.0 | local_evidence_calibration; moderate_timing_low_magnitude | August is strongest within this species at this port; concentration and side uncertainty cap at fair.[^1][^52][^34][^44] |
| 09-15 | 2.5 | local_evidence_calibration; low | September has weak recurrence and much lower density.[^1][^52][^34][^44] |
| 10-15 | 1.5 | local_evidence_and_habitat_judgment; low | Explicit October port zeros dominate the local record despite possible harbor refuge use.[^1][^52][^34][^44][^94][^101][^67] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** moderate_timing_low_magnitude.

Repeated 2016-2026 pier catches and four of four positive recent May-September strata support a broad summer fishery. June 2026 good results followed by decline justify a good seasonal peak with variable realized scores. July total is one-year concentrated; no July spike is inferred.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90][^93][^70]

**Structure/mode:** Channel-facing South Pier supported by pier-context 2026 reports during North-Pier closure; older port totals pool structures. Casting spoons/crankbaits/Ned rigs or bottom-fished bait in channel.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 04-15 | 2.5 | local_evidence_and_habitat_judgment; low | Three of six modern April strata positive, but lower density than May: limited early shoulder.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90][^93][^70] |
| 05-15 | 6.5 | local_evidence_calibration; moderate_timing_low_magnitude | Strong May recurrence supports good, with pooled-structure limitation.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90] |
| 06-15 | 7.0 | local_evidence_calibration; moderate_timing_low_magnitude | Strong repeated June port catches and contemporary success followed by slower weeks support good peak, below excellent.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90] |
| 07-15 | 6.5 | local_evidence_calibration; moderate_timing_low_magnitude | Recurring summer opportunity; concentrated recent July total does not justify a new peak.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90] |
| 08-15 | 6.5 | local_evidence_calibration; moderate_timing_low_magnitude | August recurrence remains strong; species can overlap bass peaks.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90] |
| 09-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | September density declines and current reports describe a few drum, while older bait catches confirm recurrence.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90] |
| 10-15 | 2.5 | local_evidence_and_habitat_judgment; low | Modern October catches recur less strongly and only one recent positive stratum: limited decline, not summer strength.[^1][^19][^16][^17][^26][^39][^40][^41][^45][^89][^90][^93][^70] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Repeated modern port Pier/Dock perch catches justify continued score research. The primary 1981–1982 study confirms historical targeting but its Grand Haven catch statistics explicitly concern North Pier, excluded from current coverage. Recent port catches are highly concentrated in individual years. Neither historical North-Pier catches nor modern offshore perch reports establish current South-Pier magnitude or daily timing.[^1][^2][^92]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Repeated modern port Pier/Dock perch catches justify continued score research. The primary 1981–1982 study confirms historical targeting but its Grand Haven catch statistics explicitly concern North Pier, excluded from current coverage. Recent port catches are highly concentrated in individual years. Neither historical North-Pier catches nor modern offshore perch reports establish current South-Pier magnitude or daily timing.

**Deferral reason:** Repeated modern port Pier/Dock perch catches justify continued score research. The primary 1981–1982 study confirms historical targeting but its Grand Haven catch statistics explicitly concern North Pier, excluded from current coverage. Recent port catches are highly concentrated in individual years. Neither historical North-Pier catches nor modern offshore perch reports establish current South-Pier magnitude or daily timing.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** moderate_autumn_timing_low_lawful_magnitude.

Current DNR recognition establishes the autumn lake-whitefish opportunity; older bait-based pier records and species-specific port recurrence corroborate occurrence. Historical harvest is not used to calibrate strength. A limited November band reflects feasibility with unresolved lawful-method success, explicitly a product judgment rather than a corrected creel estimate.[^1][^8][^9][^46][^78][^86][^85][^75][^102][^63]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Lawful bait/egg presentation with November single-pointed unweighted hook; no jigging or snagging magnitude transfer.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Deep summer habitat reduces pier access; nearshore late-autumn/early-winter behavior and current agency recognition support an autumn opportunity. Historical snagging totals are discarded as a magnitude basis. Limited November 3.5 is a coarse low-confidence lawful-bait opportunity judgment, not an invented percentage reduction of harvest.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Deep summer habitat reduces pier access; nearshore late-autumn/early-winter behavior and current agency recognition support an autumn opportunity. Historical snagging totals are discarded as a magnitude basis. Limited November 3.5 is a coarse low-confidence lawful-bait opportunity judgment, not an invented percentage reduction of harvest.[^102][^8][^9][^63] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Deep summer habitat reduces pier access; nearshore late-autumn/early-winter behavior and current agency recognition support an autumn opportunity. Historical snagging totals are discarded as a magnitude basis. Limited November 3.5 is a coarse low-confidence lawful-bait opportunity judgment, not an invented percentage reduction of harvest.[^102][^8][^9][^63] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Deep summer habitat reduces pier access; nearshore late-autumn/early-winter behavior and current agency recognition support an autumn opportunity. Historical snagging totals are discarded as a magnitude basis. Limited November 3.5 is a coarse low-confidence lawful-bait opportunity judgment, not an invented percentage reduction of harvest.[^1][^102][^8][^9][^63] |
| 04-15 | 2.5 | local_evidence_and_habitat_judgment; low | Scattered April species-specific port catches support limited spring opportunity, much weaker than the acknowledged autumn fishery.[^1][^8][^9][^46][^78][^86][^85][^75][^102][^63] |
| 05-15 | 1.5 | local_evidence_and_habitat_judgment; low | Sparse May port signal and deeper-season transition leave poor opportunity.[^1][^8][^9][^46][^78][^86][^85][^75][^102][^63] |
| 06-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^102][^8][^9][^63] |
| 07-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^102][^8][^9][^63] |
| 08-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^102][^8][^9][^63] |
| 09-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^102][^8][^9][^63] |
| 10-15 | 2.0 | local_evidence_and_habitat_judgment; low | October occasional catches support poor approach to the autumn run; no snagging-derived peak.[^1][^8][^9][^46][^78][^86][^85][^75][^102][^63] |
| 11-15 | 3.5 | local_evidence_and_habitat_judgment; low | DNR recognizes a continuing lake-whitefish angler opportunity; bait-based pier reports corroborate feasibility but not standardized success. Assign limited 3.5 under legal hook methods, with low magnitude confidence.[^1][^8][^9][^46][^78][^86][^85][^75][^102][^63] |
| 12-15 | 2.5 | local_evidence_and_habitat_judgment; low | December 2017 run nearly over supports a declining limited tail; January cannot inherit November strength.[^1][^8][^9][^46][^78][^86][^85][^75][^102][^63] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

April port catches recur in six of seven modern strata and species-specific pier catches recur in 2018 and 2021. Modest counts and regional decline concern limit the proposal. Adjacent 2021 bulletins count as one year. No autumn peak is borrowed from lake whitefish.[^1][^47][^48][^81][^64][^11]

**Structure/mode:** Grand Haven piers, exact South-Pier contribution unresolved. Skein/spawn, bait-fishing among spring salmonids.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^64][^11] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^64][^11] |
| 03-15 | 2.0 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^1][^64][^11] |
| 04-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | Repeated April menominee catches support limited opportunity; mixed catches do not prove a good targeted fishery.[^1][^47][^48][^81][^64][^11] |
| 05-15 | 2.0 | local_evidence_and_habitat_judgment; low | Modern May zeros lower opportunity despite a regional May shallow-water range.[^1][^47][^48][^81][^64][^11] |
| 06-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^1][^64][^11] |
| 07-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^64][^11] |
| 08-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^64][^11] |
| 09-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^1][^64][^11] |
| 10-15 | 2.5 | local_evidence_and_habitat_judgment; low | Weak October port recurrence supports a limited fall return below April.[^1][^47][^48][^81][^64][^11] |
| 11-15 | 2.5 | local_evidence_and_habitat_judgment; low | Sparse November species-specific port catch plus regional shallowing permits limited opportunity; pre-spawn feeding cessation prevents a peak.[^1][^47][^48][^81][^64][^11] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^64][^11] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

May 2023 and September 2018 direct pier catches corroborate unusually persistent port-mode recurrence. August is strongest and less single-year concentrated than perch or smallmouth. Moderate fair ceiling reflects missing current per-side effort. Upstream Grand River catfish are excluded.[^1][^19][^90][^53][^73][^99][^100]

**Structure/mode:** Grand Haven piers; side and current directed effort unresolved. Bottom-fished worms or gizzard shad; feasible evening/night fishing.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** River telemetry and winter collection at a heated canal contradict blanket winter inactivity. Neither study establishes Grand Haven winter access. Local spring-through-autumn recurrence supports the broad season; winter is a low-confidence poor-access judgment without importing power-plant conditions.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: River telemetry and winter collection at a heated canal contradict blanket winter inactivity. Neither study establishes Grand Haven winter access. Local spring-through-autumn recurrence supports the broad season; winter is a low-confidence poor-access judgment without importing power-plant conditions.[^99][^100][^73] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: River telemetry and winter collection at a heated canal contradict blanket winter inactivity. Neither study establishes Grand Haven winter access. Local spring-through-autumn recurrence supports the broad season; winter is a low-confidence poor-access judgment without importing power-plant conditions.[^99][^100][^73] |
| 03-15 | 2.0 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: River telemetry and winter collection at a heated canal contradict blanket winter inactivity. Neither study establishes Grand Haven winter access. Local spring-through-autumn recurrence supports the broad season; winter is a low-confidence poor-access judgment without importing power-plant conditions.[^1][^99][^100][^73] |
| 04-15 | 3.0 | local_evidence_and_habitat_judgment; low | Six of eight modern April strata positive support a limited early season.[^1][^19][^90][^53][^73][^99][^100] |
| 05-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | Recurrent May port catches, without strong recent directed report.[^1][^19][^90][^53][^73] |
| 06-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | June occurrence very recurrent but lower port density than August.[^1][^19][^90][^53][^73] |
| 07-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | Summer recurrence improves; fair rating retains method/side uncertainty.[^1][^19][^90][^53][^73] |
| 08-15 | 5.5 | local_evidence_calibration; moderate_timing_low_magnitude | All four recent August strata positive with strong relative density; fair peak, not a standardized catch-rate claim.[^1][^19][^90][^53][^73] |
| 09-15 | 5.0 | local_evidence_calibration; moderate_timing_low_magnitude | September direct bait-fishing report and all four recent positive strata support sustained fair opportunity.[^1][^19][^90][^53][^73] |
| 10-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | October repeated port catches support a limited shoulder with weaker direct corroboration.[^1][^19][^90][^53][^73] |
| 11-15 | 2.5 | local_evidence_and_habitat_judgment; low | Modest continuation from repeatedly positive October strata is habitat/shoulder inference, not a measured November catch rate.[^1][^19][^90][^53][^73][^99][^100] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: River telemetry and winter collection at a heated canal contradict blanket winter inactivity. Neither study establishes Grand Haven winter access. Local spring-through-autumn recurrence supports the broad season; winter is a low-confidence poor-access judgment without importing power-plant conditions.[^99][^100][^73] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** moderate_timing_low_magnitude.

July-August species-specific pier reports recur in 2018, 2025 and 2026. July and August recent port catches are positive in all four matched years, with August spread across years. A good August peak is supported more strongly than the smallmouth peak; spring habitat or spawning does not supply a bonus.[^1][^52][^35][^36][^37][^74][^94][^97][^98]

**Structure/mode:** Grand Haven piers; South-Pier attribution strengthened by August 2026 pier-context report during North closure. Crankbaits, live bait, drop-shot rigs and other suitable artificials.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^94][^97][^98][^74] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^94][^97][^98][^74] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^1][^94][^97][^98][^74] |
| 04-15 | 2.0 | local_evidence_and_habitat_judgment; low | Sparse April port occurrence supports poor access; no bonus for generic spawning habitat.[^1][^52][^35][^36][^37][^74][^94][^97][^98] |
| 05-15 | 2.5 | local_evidence_and_habitat_judgment; low | Sparse May occurrence permits limited opportunity below the summer pier reports.[^1][^52][^35][^36][^37][^74][^94][^97][^98] |
| 06-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | Three of four recent June strata positive, below July-August density.[^1][^52][^35][^36][^37][^74] |
| 07-15 | 5.0 | local_evidence_calibration; moderate_timing_low_magnitude | Repeated species-specific July pier catches and four of four recent port recurrence support fair.[^1][^52][^35][^36][^37][^74] |
| 08-15 | 6.5 | local_evidence_calibration; moderate_timing_low_magnitude | Repeated contemporary pier catches and comparatively stable August port strength support good.[^1][^52][^35][^36][^37][^74] |
| 09-15 | 3.5 | local_evidence_calibration; low | September density falls sharply; limited port-supported shoulder.[^1][^52][^35][^36][^37][^74] |
| 10-15 | 2.0 | local_evidence_and_habitat_judgment; low | Modern October zeros and loss of littoral use reduce the tail to poor.[^1][^52][^35][^36][^37][^74][^94][^97][^98] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^1][^94][^97][^98][^74] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^94][^97][^98][^74] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

April 2023 and 2024 pier catches provide recurrence distinct from South-Pier-only April 2022 catches. Lean-component port data confirm sparse spring catches and repeated October catches. These support limited spring and lower-confidence autumn shoulders; offshore abundance, reef spawning and stocking cannot establish covered-pier magnitude.[^1][^20][^22][^21][^62]

**Structure/mode:** April 2023 pier catches while South Pier closed support North attribution; 2024 side unspecified. Spawn, spoons or crankbaits within pier reach.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Michigan DNR describes shallow cold-season use and deep summer use. The local spring pier reports and repeated October Lean-component catches permit two limited shoulders. Winter remains poor at 2 despite biological shallowing because repeatable covered-pier winter catches are unmeasured; summer 1 combines depth separation and repeated local zeros.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Michigan DNR describes shallow cold-season use and deep summer use. The local spring pier reports and repeated October Lean-component catches permit two limited shoulders. Winter remains poor at 2 despite biological shallowing because repeatable covered-pier winter catches are unmeasured; summer 1 combines depth separation and repeated local zeros.[^62][^1] |
| 02-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Michigan DNR describes shallow cold-season use and deep summer use. The local spring pier reports and repeated October Lean-component catches permit two limited shoulders. Winter remains poor at 2 despite biological shallowing because repeatable covered-pier winter catches are unmeasured; summer 1 combines depth separation and repeated local zeros.[^62][^1] |
| 03-15 | 2.5 | local_evidence_and_habitat_judgment; low | Cold-season shallow access is plausible but direct local confirmation strengthens in April; poor-to-limited only.[^1][^20][^22][^21][^62] |
| 04-15 | 3.0 | local_evidence_calibration; low | Repeated few-fish spring pier reports justify limited opportunity only.[^1][^20][^22][^21][^62] |
| 05-15 | 2.5 | local_evidence_calibration; low | Sparse May lean-lake-trout port catches support only a weak shoulder.[^1][^20][^22][^21][^62] |
| 06-15 | 1.5 | local_evidence_and_habitat_judgment; low | Transition toward deeper lake habitat plus local June zeros leaves poor access.[^1][^20][^22][^21][^62] |
| 07-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^62] |
| 08-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^62] |
| 09-15 | 1.5 | local_evidence_and_habitat_judgment; low | No modern September Lean catch signal: poor approach to autumn, not a spawning bonus.[^1][^20][^22][^21][^62] |
| 10-15 | 3.0 | local_evidence_and_habitat_judgment; low | Four modern October Lean-positive years, including 2022, support a limited fall opportunity comparable to the modest spring peak.[^1][^20][^22][^21][^62] |
| 11-15 | 2.5 | local_evidence_and_habitat_judgment; low | Late-fall continuation from October and shallow cold-season biology is low-confidence limited access, not measured November catches.[^1][^20][^22][^21][^62] |
| 12-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Michigan DNR describes shallow cold-season use and deep summer use. The local spring pier reports and repeated October Lean-component catches permit two limited shoulders. Winter remains poor at 2 despite biological shallowing because repeatable covered-pier winter catches are unmeasured; summer 1 combines depth separation and repeated local zeros.[^62][^1] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

Nighttime pier catches recur in May 2019, 2022 and 2023, including explicit targeting in 2023, and variable April casting in 2024. Older port zero estimates in May conflict with these observations; retain contradiction rather than fit an obsolete July peak.[^1][^84][^18][^19][^23][^53][^103]

**Structure/mode:** Unspecified piers with North-Pier context in May 2022; excluded closure-era South observations not assigned to North. Nighttime pier casting; river and boat trolling excluded.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Walleye feed in winter; do not apply a winter inactivity floor. Covered-pier nighttime May catches establish the strongest local opportunity. Deep-water and upstream fisheries cannot support a fall or winter peak, so the annual weak-season band is poor rather than absent.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Walleye feed in winter; do not apply a winter inactivity floor. Covered-pier nighttime May catches establish the strongest local opportunity. Deep-water and upstream fisheries cannot support a fall or winter peak, so the annual weak-season band is poor rather than absent.[^103][^1] |
| 02-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Walleye feed in winter; do not apply a winter inactivity floor. Covered-pier nighttime May catches establish the strongest local opportunity. Deep-water and upstream fisheries cannot support a fall or winter peak, so the annual weak-season band is poor rather than absent.[^103][^1] |
| 03-15 | 2.5 | local_evidence_and_habitat_judgment; low | Spring movement approaches, but no imported upstream spawning strength: limited 2.5.[^1][^84][^18][^19][^23][^53][^103] |
| 04-15 | 3.5 | local_evidence_and_habitat_judgment; low | April port recurrence and variable late-April pier casting support limited 3.5.[^1][^84][^18][^19][^23][^53][^103] |
| 05-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | Multi-year May directed catches support low fair peak; no target-hour denominator.[^1][^84][^18][^19][^23][^53] |
| 06-15 | 2.5 | local_evidence_and_habitat_judgment; low | Decline from recurrent May night catches; closure-era reports cannot establish strong North-Pier June fishing.[^1][^84][^18][^19][^23][^53][^103] |
| 07-15 | 2.5 | local_evidence_and_habitat_judgment; low | Two older July port-positive years justify limited episodic opportunity, below the directly corroborated May peak.[^1][^84][^18][^19][^23][^53][^103] |
| 08-15 | 2.0 | local_evidence_and_habitat_judgment; low | No modern August port catches; poor residual opportunity rather than impossible.[^1][^84][^18][^19][^23][^53][^103] |
| 09-15 | 2.0 | local_evidence_and_habitat_judgment; low | No modern September catch signal; no transferred fall river run.[^1][^84][^18][^19][^23][^53][^103] |
| 10-15 | 2.0 | local_evidence_and_habitat_judgment; low | No modern October catch signal; winter feeding biology cannot create a local autumn peak.[^1][^84][^18][^19][^23][^53][^103] |
| 11-15 | 2.0 | local_evidence_and_habitat_judgment; low | Poor year-round residual access is a low-confidence prior; no Thanksgiving peak imported from Muskegon.[^1][^84][^18][^19][^23][^53][^103] |
| 12-15 | 2.0 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Walleye feed in winter; do not apply a winter inactivity floor. Covered-pier nighttime May catches establish the strongest local opportunity. Deep-water and upstream fisheries cannot support a fall or winter peak, so the annual weak-season band is poor rather than absent.[^103][^1] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

June-August port season corroborated by species-specific July 2023/2024 and July 2026, plus August 2024 catches. Recent estimates are sparse and July 2026 was slow, so the curve remains limited-to-fair despite high older July totals.[^1][^30][^26][^28][^87][^88][^94][^101][^67]

**Structure/mode:** Manistee piers, exact North-side species attribution incomplete; unidentified North-Pier bass not split. Nightcrawlers, spoons, jigs and soft plastics; early morning feasible.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 04-15 | 2.0 | local_evidence_and_habitat_judgment; low | Scattered April port catches permit poor opportunity; no upstream Manistee Lake strength transferred.[^1][^30][^26][^28][^87][^88][^94][^101][^67] |
| 05-15 | 2.5 | local_evidence_and_habitat_judgment; low | Scattered May recurrence supports limited early access below July.[^1][^30][^26][^28][^87][^88][^94][^101][^67] |
| 06-15 | 3.0 | local_evidence_calibration; low | June older catches exceed recent evidence; limited rating.[^1][^30][^26][^28][^87][^88] |
| 07-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | Repeated July species-specific pier catches support fair, tempered by sparse recent creel and 2026 slow report.[^1][^30][^26][^28][^87][^88] |
| 08-15 | 3.5 | local_evidence_calibration; low | August 2024 few-fish pier report and older recurrence support limited continuation.[^1][^30][^26][^28][^87][^88] |
| 09-15 | 2.0 | local_evidence_and_habitat_judgment; low | Weak older September port recurrence and recent zeros restrain the fall tail.[^1][^30][^26][^28][^87][^88][^94][^101][^67] |
| 10-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^1][^94][^101][^67] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Harbor/lake movements and localized refuge use change casting access. Huron River telemetry contradicts a universal winter shutdown. The poor winter band is a low-confidence covered-pier accessibility judgment, not zero activity or a fitted temperature penalty.[^94][^101][^67] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

Pier reports recur in 2021 and 2023-2025 despite mostly zero recent creel estimates. June/July corroboration justifies a fair summer peak in an annual curve. No offshore or river reports counted; July 2026 boat drum excluded.[^1][^25][^30][^27][^26][^34][^88][^93][^70]

**Structure/mode:** Harbor/channel-facing piers; North-only attribution still needs method/side confirmation. Casting lures or bait on the harbor face.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 04-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 05-15 | 2.5 | local_evidence_and_habitat_judgment; low | Sparse May port catch and approaching shallow-water season permit a limited shoulder.[^1][^25][^30][^27][^26][^34][^88][^93][^70] |
| 06-15 | 3.5 | local_evidence_calibration; low | June harbor-face reports support limited opportunity.[^1][^25][^30][^27][^26][^34][^88] |
| 07-15 | 4.5 | local_evidence_calibration; moderate_timing_low_magnitude | Repeated July reports support fair despite weak recent port estimates; below Grand Haven.[^1][^25][^30][^27][^26][^34][^88] |
| 08-15 | 2.5 | local_evidence_and_habitat_judgment; low | Older August positives and adjacent July pier recurrence permit limited continuation; recent August zeros prevent fair.[^1][^25][^30][^27][^26][^34][^88][^93][^70] |
| 09-15 | 2.0 | local_evidence_and_habitat_judgment; low | Recent September catch is very sparse; poor rather than a broad strong fall season.[^1][^25][^30][^27][^26][^34][^88][^93][^70] |
| 10-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^1][^93][^70] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Great Lakes research supports summer shallowing and a late-fall move deeper. Transfer only the directional mechanism; local pier reports and port recurrence set the city peak. Winter 1.5 means poor inferred access, not absent fish or a thermal bite estimate.[^93][^70] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** moderate_timing_low_magnitude.

April-May port catches recur strongly and North Pier has exact spring evidence. May exceeds April in both modern and recent pooled density. Large single-year contribution and 2022-2025 slow/sorting reports cap the proposal at good. June drops; July observation does not justify a productive tail.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24][^95][^96][^72]

**Structure/mode:** North Pier explicitly corroborated in April 2017, May 2018 and June 2023. Minnows/wigglers from pier; schooling and small-fish sorting affect outcomes.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^95][^96][^72] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^95][^96][^72] |
| 03-15 | 2.5 | local_evidence_and_habitat_judgment; low | Low-confidence pre-spring shoulder into well-supported April/May; not winter lake-perch harvest transferred to North Pier.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24][^95][^96][^72] |
| 04-15 | 6.0 | local_evidence_calibration; moderate_timing_low_magnitude | Exact April North-Pier catches and modern recurrence support upper fair; recent catches concentrated.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24] |
| 05-15 | 7.0 | local_evidence_calibration; moderate_timing_low_magnitude | Highest recurring spring port strength plus North-Pier spring corroboration support good, capped below excellent due variability and sorting.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24] |
| 06-15 | 4.0 | local_evidence_calibration; moderate_timing_low_magnitude | Repeated June 2023 reports say hit-or-miss and include small fish; substantial decline from May.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24] |
| 07-15 | 2.0 | local_evidence_calibration; low | Recent July estimates zero and 2022 observation is presence in otherwise slow fishing; poor meaningful opportunity.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24] |
| 08-15 | 1.5 | local_evidence_and_habitat_judgment; low | Very weak older August and recent zeros justify poor residual access.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24][^95][^96][^72] |
| 09-15 | 1.5 | local_evidence_and_habitat_judgment; low | Rare older September estimates and recent zeros keep opportunity poor.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24][^95][^96][^72] |
| 10-15 | 1.5 | local_evidence_and_habitat_judgment; low | Explicit October port zeros prevent an autumn peak; connected-lake migration remains a caveat.[^1][^13][^80][^18][^19][^83][^16][^17][^14][^24][^95][^96][^72] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^1][^95][^96][^72] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Historical Lake Michigan winter depth patterns support weaker exposed-pier access, but newer connected-habitat genetics permits autumn/winter movements into drowned river mouths. Neither inland-lake catches nor migration proves a covered-pier school. Winter stays poor rather than absent, with city-specific spring/summer timing from local data.[^95][^96][^72] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

April 2025 explicitly names lake whitefish, but older North-Pier spring and November reports say only whitefish. Two positive port years and species-ambiguous reports do not establish a current covered-pier seasonal magnitude; do not copy Grand Haven November.[^1][^21][^24][^80][^78]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: April 2025 explicitly names lake whitefish, but older North-Pier spring and November reports say only whitefish. Two positive port years and species-ambiguous reports do not establish a current covered-pier seasonal magnitude; do not copy Grand Haven November.

**Deferral reason:** April 2025 explicitly names lake whitefish, but older North-Pier spring and November reports say only whitefish. Two positive port years and species-ambiguous reports do not establish a current covered-pier seasonal magnitude; do not copy Grand Haven November.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

Species-specific menominee catches recur in April 2023 and April 2025. Repeated older October port catches support a lower-confidence limited autumn shoulder, not a contemporary North-Pier catch-rate estimate. Spring has stronger current corroboration; no lake-whitefish curve or spawning bonus is borrowed.[^1][^20][^77][^24][^64][^11]

**Structure/mode:** Manistee piers; North attribution in April 2023 inferred from South closure, 2025 side unspecified. Waxworms, skein or spawn among spring salmonid catches.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^64][^11] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^64][^11] |
| 03-15 | 2.0 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^1][^64][^11] |
| 04-15 | 3.5 | local_evidence_calibration; low | Repeated April menominee catches support limited spring opportunity.[^1][^20][^77][^24][^64][^11] |
| 05-15 | 2.5 | local_evidence_calibration; low | Sparse historical May round-whitefish catches justify only a weak shoulder; later dates uncalibrated.[^1][^20][^77][^24][^64][^11] |
| 06-15 | 1.5 | local_evidence_and_habitat_judgment; low | End of brief spring shallowing and explicit June zeros leave poor access.[^1][^20][^77][^24][^64][^11] |
| 07-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^64][^11] |
| 08-15 | 1.0 | local_evidence_and_habitat_judgment; low | Summer depth/access separation with explicit local port-zero evidence supports negligible meaningful pier opportunity; 1 is not absence of the species.[^1][^64][^11] |
| 09-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^1][^64][^11] |
| 10-15 | 3.0 | local_evidence_and_habitat_judgment; low | Four of eight modern October strata positive, including a recent occurrence, justify a limited return; weaker current evidence than a major fall run.[^1][^20][^77][^24][^64][^11] |
| 11-15 | 2.5 | local_evidence_and_habitat_judgment; low | Regional shallow use and adjacent October catches permit limited continuation; no automatic spawning bonus.[^1][^20][^77][^24][^64][^11] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Agency guidance distinguishes brief shallow spring/fall access from deeper periods. Retained port spring/fall catches set local asymmetry. Summer near-floor values combine explicit local zeros and reduced reachability; pre-spawn nonfeeding rules out a spawning bonus.[^64][^11] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No qualifying current species-specific major North Pier fishery is established by reviewed estimates and reports. Upstream river or Manistee Lake catfish evidence would not resolve the pairing.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No qualifying current species-specific major North Pier fishery is established by reviewed estimates and reports. Upstream river or Manistee Lake catfish evidence would not resolve the pairing.

**Deferral reason:** No qualifying current species-specific major North Pier fishery is established by reviewed estimates and reports. Upstream river or Manistee Lake catfish evidence would not resolve the pairing.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** annual_research_calibrated. **Confidence:** low.

Species-specific July 2023 and August 2024 catches support a limited summer peak in an annual curve, now stronger than a single-event lead. Only one recent positive July port year and few-fish report language restrict the entire curve to limited.[^1][^31][^87][^94][^97][^98][^74]

**Structure/mode:** Manistee harbor-facing piers; covered North-Pier attribution unresolved. Nightcrawlers or artificial lures.

**Phase 1 disposition:** accepted_annual_calibration. Accepted annual research curve: no unavailable calendar dates.

**Seasonal mechanism:** Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.

**Annual limits:** "Numbers are ordinal research judgments, not observed monthly catch probabilities. Habitat-inferred months have low confidence and no local winter effort validation. Conditions/access and thermal-response gates remain separate. No automatic reweighting by ice or average temperature is included."

| Anchor | Seasonal value | Basis / confidence | Reason |
| --- | ---: | --- | --- |
| 01-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^94][^97][^98][^74] |
| 02-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^94][^97][^98][^74] |
| 03-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^1][^94][^97][^98][^74] |
| 04-15 | 1.5 | local_evidence_and_habitat_judgment; low | No modern April port signal; species habitat alone does not establish a spring pier window.[^1][^31][^87][^94][^97][^98][^74] |
| 05-15 | 2.0 | local_evidence_and_habitat_judgment; low | Two older May positives permit poor episodic access, below directly corroborated summer.[^1][^31][^87][^94][^97][^98][^74] |
| 06-15 | 2.0 | local_evidence_and_habitat_judgment; low | June explicit zeros restrain an early summer shoulder.[^1][^31][^87][^94][^97][^98][^74] |
| 07-15 | 3.0 | local_evidence_calibration; low | July species-specific pier corroboration and sparse port recurrence support limited opportunity.[^1][^31][^87] |
| 08-15 | 3.0 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^1][^94][^97][^98][^74] |
| 09-15 | 2.0 | local_evidence_and_habitat_judgment; low | No local September port signal; declining summer tail is poor inference rather than reported catches.[^1][^31][^87][^94][^97][^98][^74] |
| 10-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^1][^94][^97][^98][^74] |
| 11-15 | 1.5 | seasonal_habitat_inference; low | Weak seasonal shoulder/accessibility judgment: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^1][^94][^97][^98][^74] |
| 12-15 | 1.5 | seasonal_habitat_inference; low | Cold-season accessibility calibration: Lake Michigan harbor telemetry supports a more confined habitat pattern than smallmouth. Inland telemetry supports deeper winter use, while recent biologging indicates continued swimming and probable feeding. Poor winter pier opportunity is an access inference, not a claim of dormancy.[^94][^97][^98][^74] |

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Sparse port-mode cold-season catches do not establish intentional fishing from either covered breakwater. Current reports place the productive lake-trout fishery offshore at depth. Point Betsie stocking is outside the two covered breakwaters.[^1][^49][^55]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Sparse port-mode cold-season catches do not establish intentional fishing from either covered breakwater. Current reports place the productive lake-trout fishery offshore at depth. Point Betsie stocking is outside the two covered breakwaters.

**Deferral reason:** Sparse port-mode cold-season catches do not establish intentional fishing from either covered breakwater. Current reports place the productive lake-trout fishery offshore at depth. Point Betsie stocking is outside the two covered breakwaters.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

April 2024 and May 2026 catches between/inside piers explicitly describe trolling. Historical sparse Pier/Dock catches do not convert that boat fishery into major breakwater casting opportunity.[^1][^23][^49]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: April 2024 and May 2026 catches between/inside piers explicitly describe trolling. Historical sparse Pier/Dock catches do not convert that boat fishery into major breakwater casting opportunity.

**Deferral reason:** April 2024 and May 2026 catches between/inside piers explicitly describe trolling. Historical sparse Pier/Dock catches do not convert that boat fishery into major breakwater casting opportunity.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Occasional summer port catches provide no adequate evidence of major directed fishing on either covered breakwater. Betsie Bay, river and Leland smallmouth reports are not interchangeable with these exact structures.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Occasional summer port catches provide no adequate evidence of major directed fishing on either covered breakwater. Betsie Bay, river and Leland smallmouth reports are not interchangeable with these exact structures.

**Deferral reason:** Occasional summer port catches provide no adequate evidence of major directed fishing on either covered breakwater. Betsie Bay, river and Leland smallmouth reports are not interchangeable with these exact structures.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** research_candidate. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Sparse port catch estimates have no sufficient repeated exact-breakwater directed corroboration. Do not copy Grand Haven's channel drum fishery into Frankfort or Elberta.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Sparse port catch estimates have no sufficient repeated exact-breakwater directed corroboration. Do not copy Grand Haven's channel drum fishery into Frankfort or Elberta.

**Deferral reason:** Sparse port catch estimates have no sufficient repeated exact-breakwater directed corroboration. Do not copy Grand Haven's channel drum fishery into Frankfort or Elberta.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Reviewed port-mode estimates and exact-breakwater evidence do not establish a current major targeted perch fishery. Nearby inland lakes and boat fisheries are outside scope.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Reviewed port-mode estimates and exact-breakwater evidence do not establish a current major targeted perch fishery. Nearby inland lakes and boat fisheries are outside scope.

**Deferral reason:** Reviewed port-mode estimates and exact-breakwater evidence do not establish a current major targeted perch fishery. Nearby inland lakes and boat fisheries are outside scope.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Isolated spring port catches do not prove a recurring major lake-whitefish breakwater target. Historical menominee are a different species.[^1][^11]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Isolated spring port catches do not prove a recurring major lake-whitefish breakwater target. Historical menominee are a different species.

**Deferral reason:** Isolated spring port catches do not prove a recurring major lake-whitefish breakwater target. Historical menominee are a different species.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

The 2026 biologist interview recalls a Frankfort pier trip about ten years earlier, not a contemporary catch. It describes diminished abundance and interest, consistent with the weak modern port record. No current major target or Elberta-specific recurrence is established.[^1][^11]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: The 2026 biologist interview recalls a Frankfort pier trip about ten years earlier, not a contemporary catch. It describes diminished abundance and interest, consistent with the weak modern port record. No current major target or Elberta-specific recurrence is established.

**Deferral reason:** The 2026 biologist interview recalls a Frankfort pier trip about ten years earlier, not a contemporary catch. It describes diminished abundance and interest, consistent with the weak modern port record. No current major target or Elberta-specific recurrence is established.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No qualifying directed fishery on either covered breakwater was established. Regional catfish biology and river occurrence do not constitute pier evidence.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No qualifying directed fishery on either covered breakwater was established. Regional catfish biology and river occurrence do not constitute pier evidence.

**Deferral reason:** No qualifying directed fishery on either covered breakwater was established. Regional catfish biology and river occurrence do not constitute pier evidence.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No qualifying major directed largemouth fishery on either covered breakwater was established. Protected-harbor and inland-lake habitat cannot be assumed to apply to the breakwaters.[^1]

**Structure/mode:** Port Pier/Dock recurrence is not exact covered-pier confirmation; named-pier reports and excluded structures remain distinguished. Pier/Dock.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No qualifying major directed largemouth fishery on either covered breakwater was established. Protected-harbor and inland-lake habitat cannot be assumed to apply to the breakwaters.

**Deferral reason:** No qualifying major directed largemouth fishery on either covered breakwater was established. Protected-harbor and inland-lake habitat cannot be assumed to apply to the breakwaters.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

| Month | Modern catch / 1,000 total-mode hours | Modern positive/matched years | Recent catch / 1,000 total-mode hours | Recent positive/matched years | Largest recent year share of catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | — | 0/0 | — | 0/0 | — |
| 2 | — | 0/0 | — | 0/0 | — |
| 3 | — | 0/0 | — | 0/0 | — |
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

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Wisconsin's tiny regional pier harvest cannot be assigned to Sheboygan. The stocking summary explicitly puts lake trout offshore on Sheboygan Reef, not at either covered pier. Boat success and reef stocking do not establish pier catchability.[^4][^5][^6][^54][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Wisconsin's tiny regional pier harvest cannot be assigned to Sheboygan. The stocking summary explicitly puts lake trout offshore on Sheboygan Reef, not at either covered pier. Boat success and reef stocking do not establish pier catchability.

**Deferral reason:** Wisconsin's tiny regional pier harvest cannot be assigned to Sheboygan. The stocking summary explicitly puts lake trout offshore on Sheboygan Reef, not at either covered pier. Boat success and reef stocking do not establish pier catchability.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — walleye

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Lake Michigan/Green Bay regional pier harvest has no Sheboygan allocation. River walleye and northern Green Bay fisheries cannot establish a major target at either Sheboygan pier.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Lake Michigan/Green Bay regional pier harvest has no Sheboygan allocation. River walleye and northern Green Bay fisheries cannot establish a major target at either Sheboygan pier.

**Deferral reason:** Lake Michigan/Green Bay regional pier harvest has no Sheboygan allocation. River walleye and northern Green Bay fisheries cannot establish a major target at either Sheboygan pier.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — smallmouth bass

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

A dated 2019 report explicitly names both piers and a few smallmouth among salmonids and carp. Directed effort was salmon/trout or unspecified. Regional pier harvest corroborates statewide mode relevance but cannot establish current major Sheboygan targeting.[^10][^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: A dated 2019 report explicitly names both piers and a few smallmouth among salmonids and carp. Directed effort was salmon/trout or unspecified. Regional pier harvest corroborates statewide mode relevance but cannot establish current major Sheboygan targeting.

**Deferral reason:** A dated 2019 report explicitly names both piers and a few smallmouth among salmonids and carp. Directed effort was salmon/trout or unspecified. Regional pier harvest corroborates statewide mode relevance but cannot establish current major Sheboygan targeting.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — freshwater drum

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No reviewed source establishes recurring major intentional drum targeting on the two covered piers. Absence from individually named regional harvest categories is not a zero estimate.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No reviewed source establishes recurring major intentional drum targeting on the two covered piers. Absence from individually named regional harvest categories is not a zero estimate.

**Deferral reason:** No reviewed source establishes recurring major intentional drum targeting on the two covered piers. Absence from individually named regional harvest categories is not a zero estimate.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — yellow perch

**Research queue:** occurrence_lead. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

Regional pier perch harvest is real but geographically pooled. A local historical recollection describes diminished South Pier/power-plant-area perch fishing; its exact location and effort are imprecise. Neither establishes a current major fishery on the covered piers.[^4][^5][^6][^12][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: Regional pier perch harvest is real but geographically pooled. A local historical recollection describes diminished South Pier/power-plant-area perch fishing; its exact location and effort are imprecise. Neither establishes a current major fishery on the covered piers.

**Deferral reason:** Regional pier perch harvest is real but geographically pooled. A local historical recollection describes diminished South Pier/power-plant-area perch fishing; its exact location and effort are imprecise. Neither establishes a current major fishery on the covered piers.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — lake whitefish

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No adequate recurring directed fishery at either covered pier was established. Green Bay whitefish fisheries and lake-wide biology are geographically insufficient; unlisted regional harvest is not a zero observation.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No adequate recurring directed fishery at either covered pier was established. Green Bay whitefish fisheries and lake-wide biology are geographically insufficient; unlisted regional harvest is not a zero observation.

**Deferral reason:** No adequate recurring directed fishery at either covered pier was established. Green Bay whitefish fisheries and lake-wide biology are geographically insufficient; unlisted regional harvest is not a zero observation.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — round whitefish

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No adequate species-specific major directed fishery at either covered pier was established. Lake whitefish and northern Michigan menominee history are not transferable evidence.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No adequate species-specific major directed fishery at either covered pier was established. Lake whitefish and northern Michigan menominee history are not transferable evidence.

**Deferral reason:** No adequate species-specific major directed fishery at either covered pier was established. Lake whitefish and northern Michigan menominee history are not transferable evidence.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — channel catfish

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No adequate current major directed channel-catfish fishery at either covered pier was established. Sheboygan River catches and general harbor claims are outside the exact-structure proof.[^4][^5][^6][^7]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No adequate current major directed channel-catfish fishery at either covered pier was established. Sheboygan River catches and general harbor claims are outside the exact-structure proof.

**Deferral reason:** No adequate current major directed channel-catfish fishery at either covered pier was established. Sheboygan River catches and general harbor claims are outside the exact-structure proof.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

### sheboygan wi — largemouth bass

**Research queue:** not_established. **Numeric status:** deferred_pairing. **Confidence:** insufficient_for_numeric_calibration.

No adequate species-specific major directed largemouth fishery at either covered pier was established. Smallmouth observations, unspecified bass and protected inland habitat cannot substitute.[^4][^5][^6][^7][^10]

**Structure/mode:** Wisconsin regional pier totals are not Sheboygan observations; retain local dated reports separately. null.

**Phase 1 disposition:** deferred. Pairing deferred as a whole: No adequate species-specific major directed largemouth fishery at either covered pier was established. Smallmouth observations, unspecified bass and protected inland habitat cannot substitute.

**Deferral reason:** No adequate species-specific major directed largemouth fishery at either covered pier was established. Smallmouth observations, unspecified bass and protected inland habitat cannot substitute.

**Evidence needed:** repeated species-specific catches attributable to covered piers, with current seasonal/method context. Regional, offshore, upstream and excluded-structure catches cannot establish that attribution.

No comparable Sheboygan × covered-pier monthly catch/effort cross-tab was found. Wisconsin regional pier totals, county boat effort, nearshore juvenile surveys and upstream bass habitat do not provide that missing cross-tab.

## Reproducibility and next phases

- Run `npm run generate:pier-cast:remaining-seasonal` for daily, weekly, monthly and coverage artifacts. Weekly bins begin January 1; week 52 includes December 24–31, with December 27 retained as the core-compatible review midpoint. Accepted monthly means include every day; deferred months contain no numerical mean.
- Run `node scripts/generate-pier-cast-remaining-seasonal-report.mjs` for this evidence report. Raw snapshots and additional bulletin retrieval checksums are preserved locally.
- Run `npm run check:pier-cast:remaining-seasonal`, the existing remaining-species evidence checks, complete PierCast suite, core seasonal replay check and TypeScript checks. Tests establish implementation consistency, not empirical score accuracy.
- Phase 2 researches species thermal responses, audits covered-side/method eligibility for runtime integration, and uses the existing annual interpolator. It must not reinterpret tolerance, spawning temperature, occupancy or growth optimum as bite probability. Deferred pairings remain unavailable unless new evidence resolves their admission.
- Phase 3 reviews the entire annual lineup and overlapping peaks together against the completed four-species scale, without forcing coverage or weakening public gates. Deploy only when runtime/schema changes require it.

**Completion statement:** Phase 1 supplies complete annual research configurations for 16 pairings and documented deferrals for the other 29. Nine of the original 25 discovery candidates remain deferred, along with seven weaker leads and 13 not-established pairings. The historical discovery queue and strict runtime audit are retained as separate artifacts. Empirical annual accuracy and exact-side runtime eligibility are not certified by research completion.

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
[^93]: [Bur: Growth, reproduction, mortality, distribution, and biomass of freshwater drum in Lake Erie](https://pubs.usgs.gov/publication/1000094). Published 1984; reviewed 2026-09-12. Scope: Lake Erie, 1977–1979. Mode: Research gill/trap nets and trawls, not angling. Different lake and old food web; no transferable city magnitudes, exact dates or bite probabilities.
[^94]: [Carter et al.: Movement patterns of smallmouth and largemouth bass in and around a Lake Michigan harbor](https://experts.illinois.edu/en/publications/movement-patterns-of-smallmouth-and-largemouth-bass-in-and-around/). Published 2012-06; reviewed 2026-09-12. Scope: North Point Marina, Illinois; 2005–2006. Mode: Telemetry: 26 smallmouth and eight largemouth. Supports species-specific habitat use, not transfer of Illinois pier scores. Observed occupancy temperature is not an angling optimum.
[^95]: [Michigan Sea Grant: Fish in Lake Michigan—Distribution of selected species](https://repository.library.noaa.gov/view/noaa/38961/noaa_38961_DS1.pdf). Published 1981-06; reviewed 2026-09-12. Scope: Lake Michigan basin. Mode: Distribution synthesis reviewed by fishery biologists. Historical distribution map, not contemporary pier catches. Do not erase drowned-river-mouth migration or transfer Green Bay opportunity.
[^96]: [Chorak et al.: Yellow perch genetic structure and habitat use among connected habitats in eastern Lake Michigan](https://repository.library.noaa.gov/view/noaa/62227/noaa_62227_DS1.pdf). Published 2019; reviewed 2026-09-12. Scope: Eastern Lake Michigan and connected drowned river mouths including Manistee and Pere Marquette. Mode: Genetic/habitat sampling; no pier catch-effort model. Autumn/winter movement inference does not locate fish at the covered pier. Connected-lake harvest is not pier evidence.
[^97]: [Hanson et al.: Intersexual variation in seasonal behaviour and depth distribution of largemouth bass](https://www.fecpl.ca/wp-content/uploads/2008/08/CJZ-Hanson-etal-2008.pdf). Published 2008; reviewed 2026-09-12. Scope: Warner Lake, Ontario; 2004–2005. Mode: Whole-lake telemetry of 20 bass. Small inland lake; transfers a qualitative habitat mechanism only. Movement is not bite probability.
[^98]: [Reeve et al.: Winter behaviour and energetics of free-swimming largemouth bass](https://www.fecpl.ca/wp-content/uploads/2024/11/Winter-behaviour-and-energetics-of-free-swimming-largemouth-bass.pdf). Published 2025; reviewed 2026-09-12. Scope: Small temperate lake. Mode: Wild-fish biologging and bioenergetic inference. Consumption inferred from models, not measured pier catchability; no automatic winter zero or numerical thermal response. File path contains 2024; journal publication is 2025.
[^99]: [Kruckman: Diel and seasonal patterns of channel catfish movement and habitat use in the lower Wabash River](https://thekeep.eiu.edu/theses/2504/). Published 2016; reviewed 2026-09-12. Scope: Lower Wabash River; 2014–2016. Mode: Telemetry of 27 channel catfish; thesis. Different river; cannot establish Grand Haven winter fish locations or convert activity to bite probability.
[^100]: [Cooke and McKinley: Winter residency and activity patterns of channel catfish and common carp in a thermal discharge canal](https://www.fecpl.ca/wp-content/uploads/1999/05/Cat_Carp_MS.pdf). Published 1999; reviewed 2026-09-12. Scope: Nanticoke generating station, Lake Erie; winter 1997–1998. Mode: Telemetry; some fish collected by winter angling. Artificial heated canal; not a Grand Haven winter analogue. Retained as counterevidence to total inactivity, not as evidence of a covered winter fishery.
[^101]: [Beam: Daily and seasonal movement, as related to habitat use, of smallmouth bass in the Huron River, Michigan](https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/ResearchReports/RR1901-RR2000/RR1971.pdf). Published 1990-07-06; reviewed 2026-09-12. Scope: Huron River, Washtenaw County; 1987–1989. Mode: Radiotelemetry, 18 fish. Inland river, not any covered pier. No direct support for winter pier scores.
[^102]: [Michigan DNR lake whitefish species account](https://www.michigan.gov/dnr/education/michigan-species/fish-species/whitefish). Published date not stated; reviewed 2026-09-12. Scope: Great Lakes. Mode: Species biology and fishing guidance. Spawning does not imply biting. General historical recovery wording is superseded by the 2025 agency decline notice for current magnitude.
[^103]: [Michigan DNR walleye species account](https://www.michigan.gov/dnr/education/michigan-species/fish-species/walleye). Published date not stated; reviewed 2026-09-12. Scope: Michigan. Mode: Species biology and fishing guidance. Year-round species feeding does not establish a winter pier fishery; no transferred numeric catch rates.
