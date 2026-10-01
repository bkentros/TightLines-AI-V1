# PierCast Scoring v3 Pass 1

> **September 16 research recalibration:** The [all-pair seasonal opportunity audit](../seasonal-opportunity-audit-2026-09/README.md) supersedes the Milwaukee fall coho strength and timing, Milwaukee/Port Washington fall Chinook timing, Grand Haven spring steelhead timing, and Frankfort/Elberta summer Chinook and fall coho timing described by this historical Pass 1 report. Generated calibration artifacts contain the current disabled candidates.

## Executive decision

Pass 1 is complete as a disabled research and calibration package for all nine configured PierCast cities and all thirteen catalog species. Every one of the 117 city/species pairings now has a final `admit`, `defer`, or `exclude` decision supported by an explicit source chain and limitation.

Thirty-six core-salmonid pairings clear the Grade A/B gate and receive disabled Formula v3 mode calibrations. Twenty-nine Grade C pairings are deferred without a v3 numeric score. Fifty-two Grade D pairings are excluded from the current scope. No production Formula v2 curve, runtime import, release flag, database record, historical snapshot, or leaderboard behavior is changed.

The result is deliberately selective. Eight secondary-species pairings previously had private legacy numbers, but their adult pier thermal-response evidence remains sensitivity-only and their local magnitude evidence is incomplete. Those numbers do not enter v3 merely because they already existed.

## Final decision surface

| Decision | Pairings | Numeric treatment |
|---|---:|---|
| Admit | 36 | Disabled v3 mode candidates; never runtime-enabled by Pass 1 |
| Defer | 29 | No v3 numeric score; exact evidence gap retained |
| Exclude | 52 | No current-scope score; reopening rule retained |
| **Total** | **117** | Every city × species pairing explicitly resolved |

The authoritative row-level record is the [`final-decision-matrix.json`](final-decision-matrix.json), with a reviewable [CSV version](final-decision-matrix.csv). “Exclude” means the reviewed evidence does not establish a recurring intentional main-pier fishery under the product boundary; it does not claim biological absence.

## Final scoring representation

Each admitted city/species pairing contains one or more independent opportunity modes. A mode has:

- a city-specific absolute fishery strength from `1–10`;
- a continuous `0–1` annual availability curve;
- a declared shared-species thermal-response inheritance;
- local fishery and thermal evidence identifiers;
- an evidence grade, limitations, and disabled promotion state.

The Pass 1 seasonal representation is:

```text
mode seasonal potential = 1 + (fishery strength - 1) × seasonal availability
city/species seasonal potential = maximum eligible mode potential
```

Modes are never added. This prevents spring, summer, and fall hypotheses from stacking into an artificial score. Temperature does not create a locally unsupported season; Formula v3’s final thermal combination is a Pass 2 implementation decision.

All 98 admitted modes explicitly inherit the reviewed shared thermal hypothesis for their species. No source supports separate numeric thermal curves for every behavioral mode, so Pass 1 does not invent them.

## Absolute cross-city calibration

The table reports the strongest admitted mode for each city/species. Values are FinFindr calibration judgments—not DNR ratings, catch probabilities, or abundance indices—and remain disabled.

### Chinook salmon

| City | Strongest mode | Strength | Grade |
|---|---|---:|:---:|
| Frankfort–Elberta | Fall harbor staging | 9.7 | A |
| Manistee | Fall harbor staging | 9.5 | A |
| Sheboygan | Fall harbor staging | 9.4 | B |
| Ludington | Fall harbor staging | 8.3 | A |
| Grand Haven | Fall harbor staging | 7.8 | A |
| Racine | Fall harbor staging | 7.4 | B |
| Port Washington | Fall harbor staging | 7.2 | B |
| Milwaukee | Summer cold-water / fall staging | 7.0 | B |
| Kenosha | Fall harbor staging | 6.7 | B |

Sheboygan’s legacy `9.6` was reduced to `9.4`. The September 2026 DNR report supports an exceptional local event but does not supply the recurring city-pier effort denominator required for the reference-class band.[^1] This is a magnitude-evidence decision, not a hidden confidence multiplier.

### Coho salmon

| City | Strongest mode | Strength | Grade |
|---|---|---:|:---:|
| Grand Haven | Fall harbor staging | 8.8 | A |
| Frankfort–Elberta | Fall harbor staging | 8.6 | A |
| Manistee | Fall harbor staging | 8.2 | A |
| Kenosha | Spring nearshore | 8.0 | B |
| Port Washington | Spring nearshore | 7.8 | B |
| Sheboygan | Spring nearshore | 7.7 | B |
| Milwaukee | Spring nearshore | 7.6 | B |
| Racine | Spring nearshore | 7.6 | B |
| Ludington | Fall harbor staging | 5.6 | A |

Spring and fall coho are now separate opportunities. Favorable water temperature cannot turn Ludington’s evidence-supported ordinary coho fishery into a Prime score, while southern Wisconsin’s recurring spring fishery can remain strong without inheriting a Michigan fall-staging curve.

### Steelhead

| City | Strongest mode | Strength | Grade |
|---|---|---:|:---:|
| Manistee | Fall harbor staging | 10.0 | A |
| Frankfort–Elberta | Fall harbor staging | 9.8 | A |
| Grand Haven | Fall harbor staging | 9.2 | A |
| Ludington | Fall harbor staging | 8.1 | A |
| Sheboygan | Summer thermal break/upwelling | 7.3 | B |
| Racine | Summer thermal break/upwelling | 5.7 | B |
| Port Washington | Winter/spring thermal front | 5.2 | B |
| Milwaukee | Winter/spring thermal front | 4.6 | B |
| Kenosha | Winter/spring thermal front | 4.3 | B |

Manistee steelhead remains the only `10.0` fishery-strength reference. The complete scale is therefore mathematically and semantically available without guaranteeing a 10 to every city or every species.

### Brown trout

| City | Strongest mode | Strength | Grade |
|---|---|---:|:---:|
| Manistee | Spring nearshore | 8.2 | A |
| Sheboygan | Spring nearshore | 7.8 | B |
| Ludington | Spring nearshore | 7.6 | A |
| Grand Haven | Spring nearshore | 7.6 | A |
| Frankfort–Elberta | Spring nearshore | 7.5 | A |
| Port Washington | Spring nearshore | 7.0 | B |
| Racine | Spring nearshore | 6.7 | B |
| Milwaukee | Spring nearshore | 6.6 | B |
| Kenosha | Spring nearshore | 5.8 | B |

Winter open-water, spring nearshore, and fall harbor modes are separated. Winter availability is still subject to independent open-water, access, and safety gates and must not be presented as a promise that a pier is usable.

The full mode-by-mode record is [`v3-mode-calibrations.json`](v3-mode-calibrations.json). The cross-city matrix includes all admitted and non-admitted species in [`cross-city-calibration.json`](cross-city-calibration.json).

## Legacy renovation results

The reconstruction preserves evidence-supported peak ordering while materially reducing artificial duration caused by interpolation across biologically different windows.

| High-priority legacy claim | Legacy strong days | v3 mode strong days | Change |
|---|---:|---:|---:|
| Sheboygan coho | 152 | 86 | −66 |
| Grand Haven steelhead | 149 | 124 | −25 |
| Sheboygan steelhead | 106 | 56 | −50 |
| Manistee steelhead | 102 | 75 | −27 |
| Sheboygan brown trout | 97 | 58 | −39 |

The new curves do not apply a blanket uplift or compression. Manistee Chinook gains eight strong-mode days after mode separation, while several broad Wisconsin profiles narrow substantially. The audit retains both results rather than forcing every change in one direction.

The [`calibration-audit.json`](calibration-audit.json) confirms:

- all 117 pairings are decided;
- every admitted pairing has one or more complete modes;
- every numeric candidate is Grade A or B;
- every `9.5+` mode is Grade A;
- a legitimate `10.0` reference is present;
- all candidates remain disabled; and
- the 6,084-row weekly matrix is complete.

## Deferred species

All 29 Grade C pairings remain valuable research leads, but they have no v3 numeric score. The eight retired legacy numeric claims are:

- Ludington smallmouth bass and yellow perch;
- Grand Haven freshwater drum and largemouth bass; and
- Manistee lake trout, smallmouth bass, freshwater drum, and yellow perch.

Direct DNR reports support occurrence and targetability, but published local effort, exact covered-mode attribution, annual magnitude, or adult pier thermal response remains insufficient. Their legacy values remain historical comparators only.

Racine and Kenosha yellow perch remain high-priority Wisconsin leads. Wisconsin DNR documents the fishery but also reports low recent adult abundance in southern Lake Michigan, while its recent monthly pier table combines Lake Michigan and Green Bay.[^2] A city score requires Lake-Michigan-only local effort, catch, size/targeting context, and a hard regulatory gate.

The exact 29-pair research queue is [`final-evidence-gap-register.json`](final-evidence-gap-register.json). A deferred fishery can be reopened only after its missing evidence is archived, normalized, and recalibrated across all nine cities for that species.

## Evidence and source controls

Michigan magnitude and timing are anchored by the DNR port/month/species `Pier/Dock` creel record through 2022.[^3] The 2025 statewide survey and supplement provide a more recent directional check but do not expose the same city-specific axis.[^4] Dated 2023–2026 DNR reports provide qualitative holdout evidence for local identity and broad timing, not new city CPUE.

Wisconsin uses county-by-mode annual harvest for recurrence, statewide pier-mode month buckets for broad timing, and exact city/pier DNR records for local applicability.[^5][^6] County harvest cannot become city CPUE because the required city-pier effort denominator is not published.

Every material source use is normalized in the 850-row [`claim-evidence-ledger.json`](claim-evidence-ledger.json). Each row records publisher, title, date when available, URL, permitted claim, prohibited transfer, limitations, and original registry path. Evidence confidence remains separate from the score.

## Holdout assessment

The construction record and holdout record are separated wherever the public data permit:

- Michigan: quantitative city `Pier/Dock` construction evidence through 2022; dated 2023–2026 local DNR reports as directional holdout.
- Wisconsin: 2022–2024 county and statewide survey construction evidence; 2025–2026 local reports as directional holdout.

All 36 admitted pairings receive `partial_directional_support`. The holdout record supports continued local relevance or broad timing, but not decimal accuracy, exact daily shoulders, or catch probability. The full record is [`holdout-review.json`](holdout-review.json). Prospective effort-aware outcome testing remains mandatory before promotion.

## Year-round review

The [full-year weekly matrix](full-year-weekly-review.csv) contains 52 recurring dates for every one of the 117 pairings—6,084 rows total. Admitted pairs contain seasonal potential and strongest active mode. Deferred and excluded pairs contain an explicit unavailable decision rather than a fabricated `1.0` score.

Availability curves are continuous through the annual boundary. Practical closure, ice, waves, construction, and regulations remain separate gates. Missing winter sampling is uncertainty, not measured absence.

## Pass 1 completion status

All internal Pass 1 research, decision, calibration, traceability, full-year review, and disabled handoff artifacts are complete. The generated Pass 2 candidate file is [`v3-disabled-runtime-candidates.json`](v3-disabled-runtime-candidates.json); no runtime file imports it.

An [independent specialist review packet](SPECIALIST_REVIEW_PACKET.md) is prepared. Actual external review has not been fabricated and remains a required Pass 2 promotion gate, alongside LMHOFS representation validation and prospective outcomes.

## Sources

[^1]: Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” Sheboygan pier/shore report dated August 31/September 7, 2026; rolling page reviewed September 14, 2026.
[^2]: Wisconsin Department of Natural Resources. “[Yellow Perch Research](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/Yellowperch).” Reviewed September 14, 2026.
[^3]: Michigan Department of Natural Resources. “[Creel Clerks & Angler Surveys](https://www.michigan.gov/dnr/managing-resources/fisheries/creel).” Public Great Lakes creel program and dataset; reviewed September 14, 2026.
[^4]: Michigan Department of Natural Resources. “[2025 Michigan Great Lakes Recreational Fisheries](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049.pdf).” Fisheries Report 49, April 2026; and [2025 Creel Summary Supplement](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049_supp_material_Creel_Summary_2025.xlsx).
[^5]: Wisconsin Department of Natural Resources. “[Lake Michigan Creel Harvest Tables, 1998–2024](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables1998-2024.pdf).” April 10, 2025.
[^6]: Wisconsin Department of Natural Resources. “[2024 Open Water Sportfishing Effort and Catch](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf).” 2025; interpreted with the corresponding [2022](https://dnr.wisconsin.gov/sites/default/files/topic/LM_LakeMichiganSportHarvestReport2022.pdf) and [2023](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2023.pdf) reports.
