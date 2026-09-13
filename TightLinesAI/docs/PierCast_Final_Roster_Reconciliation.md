# PierCast final roster reconciliation

The current five-city private lineup is **28 city/species combinations**: the existing 20 core combinations plus eight additional pairings. All 45 additional-species decisions have been reconciled against the same recurring-catch standard. Manistee North Pier smallmouth is now admitted. The other seven admissions remain; 37 pairings are not admitted on the available evidence. These are completed evidence-bounded roster decisions, not findings that the excluded fish cannot occur.

This closes the roster-standard inconsistency left by the initial Phase 3 audit. The current specification is **credible recurring identified catches from the exact covered piers**, not a requirement that a species be popular, dominant, or the intended target of most surveyed anglers. Numeric calibration and temperature compatibility remain separate requirements. A sparse fishery can qualify and receive a low score; an unidentified or geographically unresolved fishery cannot be made valid by assigning it 1.0.

This conclusion supports maintaining and extending a **private provisional product**. It does not establish empirically validated score accuracy or justify public release. No amount of desk research can convert missing winter catch/effort observations into measured weekly probabilities. Evidence-limited pairings have explicit reopening criteria below instead of being silently treated as biological absences.

## Final scored lineup

| City | Existing species | Additional species | Total |
| --- | --- | --- | ---: |
| Ludington | Chinook, coho, steelhead, brown trout | Smallmouth bass, yellow perch | 6 |
| Grand Haven | Chinook, coho, steelhead, brown trout | Freshwater drum, largemouth bass | 6 |
| Manistee | Chinook, coho, steelhead, brown trout | Lake trout, smallmouth bass, freshwater drum, yellow perch | 8 |
| Frankfort–Elberta | Chinook, coho, steelhead, brown trout | None established for admission | 4 |
| Sheboygan | Chinook, coho, steelhead, brown trout | None established for admission | 4 |

Covered structures remain Ludington North Breakwater, Grand Haven South Pier, Manistee North Pier, Frankfort North Breakwater, Elberta South Breakwater, and Sheboygan North/South Piers. No river, harbor dock, stub pier, reef or additional breakwater has been added implicitly.

## Admission standard and review method

1. Identify the species. Unspecified bass or whitefish cannot be divided between species without evidence.
2. Establish recurring catches through independent dated reports or port Pier/Dock recurrence plus corroboration. Reprints of one DNR event count once. Directed effort and high catch rates are not admission prerequisites.
3. Resolve the covered structure. Named attribution or a documented, bounded side inference can corroborate port-level recurrence; generic harbor, upstream, and boat reports cannot.
4. Review a complete annual curve independently for the city/species. Weak periods retain explicit provisional low values. Do not copy a neighboring city's peak or invent finely resolved timing.
5. Require an applicable species thermal compatibility profile. Preference, spawning, tolerance, occupancy and growth observations do not become bite probabilities. Public representation and outcome gates remain blocked.

The full existing source collection and 45 decisions were reconciled; targeted searches followed the lake-trout, bass, drum, perch, whitefish and catfish leads that could change admission. Retained Michigan port Pier/Dock estimates, weekly agency paragraphs and structure-specific corroboration take precedence over generic fishing sites. The [Phase 1 report](onboarding/piercast/remaining-species/PHASE1_SEASONAL_RESEARCH.md) retains all monthly evidence and original source references; its older “major target” exclusion wording is superseded by the decisions below. The [updated machine register](PierCast_Phase2_Onboarding_Decisions.json) is authoritative for runtime admission.

The inaccessible AFS Grand Rapids outdoor-activities page was pursued as an exact South Pier lead but returned HTTP 403. Its search text was not accepted as evidence. The 2011 Grand Haven fishing brochure lead returned 404. Wisconsin's September 7, 2026 report was read in full for geography: Sheboygan pier observations concern salmon; smallmouth reports from Door County/Manitowoc do not transfer to Sheboygan. The source itself contains a South Milwaukee paragraph naming Little Sturgeon Bay; that geographically inconsistent paragraph was not used.[^5]

## Manistee smallmouth correction

The July 3, 2024 DNR report explicitly reports smallmouth catches from the pier.[^1] The corresponding July 5 local newspaper report identifies North Pier.[^2] The latter is accepted as dated structure corroboration, under the same bounded standard already used for Manistee drum; it is not an independent catch event and does not turn the original agency wording into an exact-side observation. Species-specific pier reports in July 2023 and July 2026, together with port Pier/Dock recurrence, establish recurrence.[^3][^4] Unidentified North Pier bass in other reports are still not split into smallmouth or largemouth.

The existing Manistee smallmouth annual curve is retained, not copied from Ludington:

| Month-day anchor | Jan 15 | Feb 15 | Mar 15 | Apr 15 | May 15 | Jun 15 | Jul 15 | Aug 15 | Sep 15 | Oct 15 | Nov 15 | Dec 15 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Seasonal score | 1.5 | 1.5 | 1.5 | 2.0 | 2.5 | 3.0 | 4.5 | 3.5 | 2.0 | 1.5 | 1.5 | 1.5 |

Repeated July reports support the timing; sparse recent aggregate catches and the slow July 2026 report restrain the maximum to Fair. Winter and shoulder values remain low-confidence accessibility judgments. Its existing shared smallmouth thermal profile spans the reviewed 0–32°C domain and remains provisional. This admission changes neither thermal knots nor any other city/species's anchors. Bass catch-and-immediate-release and harvest-season restrictions remain distinct from the biological score and are carried in the admission metadata, with regulatory review through March 31, 2027.

## Confidence and reopening rules

Confidence is separated into **roster evidence**, **seasonal timing**, and **numeric magnitude**. Recurring primary reports and named corroboration support admission; they do not validate every interpolated daily decimal. Existing strong seasonal core fisheries have better calibration support than many weak-season additions. No assertion of equal confidence across all months is made.

- Structure deferrals reopen with a credible dated species-specific report naming the covered structure, or agency confirmation resolving the existing port records. Existing recurrence can then be evaluated with that corroboration.
- Recurrence deferrals reopen with an independent dated local pier event or appropriate exact-site creel evidence. One fish or a generic species list is insufficient.
- Species-identification deferrals reopen with explicit identification; bass and whitefish names are not guessed.
- Round-whitefish thermal deferrals require applicable adult response evidence or an explicitly justified adult compatibility calibration. The juvenile avoidance experiment alone remains insufficient.
- Grand Haven lake whitefish additionally needs a defensible lawful-method calibration. DNR states that much port harvest involved snagged fish; historical aggregate harvest therefore cannot automatically calibrate current lawful hook-and-line opportunity.[^6]

These are evidence boundaries, not an implementation backlog hidden behind the word “complete.” New evidence may change a completed roster decision. Public predictive validation and field temperature representation remain separate work and are not declared complete by this reconciliation.

## All additional-species decisions

“Admitted” means included in the private provisional scored lineup with all-year dates and a thermal profile. “Not admitted” means no runtime city/species score. Eight not-admitted pairings retain annual research only; 29 have no accepted annual curve.

### Ludington

**Lake trout — Not admitted.** Port Pier/Dock recurrence and the April 2019 pier report support occurrence, but the North Breakwater attribution is not resolved. Offshore, reef and state-park catches do not resolve this exact structure.

Evidence register IDs: MI_CREEL, B_2521a66, B_257279c, MI_STOCKING.

**Walleye — Not admitted.** Pier catches in May 2022 and multiple port catch years establish a lead; the retained report does not identify North Breakwater. Basin night fishing does not identify shore versus boat mode.

Evidence register IDs: MI_CREEL, B_3176352, B_14ccdb0.

**Smallmouth bass — Admitted.** Named North Breakwater corroboration and recurrent port Pier/Dock evidence support a provisional covered-pier target.

Evidence register IDs: MI_CREEL, B_2e736eb, B_364ea3a, B_3eeac7b, B_425abbc, B_41407c5, B_2d7cf51, A_BASS_CARTER2012, A_SMALLMOUTH_RR1971, T023, P2_REGS2026.

**Freshwater drum — Not admitted.** Repeated city pier reports and an annual curve support recurrence. The covered North Breakwater cannot be separated from other piers in the retained species-specific evidence. This is a structure-attribution deferral, not insufficient popularity.

Evidence register IDs: MI_CREEL, B_421929e, B_423b34d, A_DRUM_BUR1984, T026, P2_REGS2026.

**Yellow perch — Admitted.** Named North Breakwater June/July catches corroborate recurrent Pier/Dock evidence; shoulder magnitudes remain provisional.

Evidence register IDs: MI_CREEL, B_323f6bf, B_35ed629, B_3614332, B_364ea3a, B_3675eed, P1_2927150, A_PERCH_ATLAS1981, A_PERCH_GENETICS2019, T028, P2_REGS2026.

**Lake whitefish — Not admitted.** Rare port estimates and generic whitefish reports do not establish repeated species-specific North Breakwater catches; lake and round whitefish cannot be merged.

Evidence register IDs: MI_CREEL, WHITEFISH_GEAR.

**Round whitefish — Not admitted.** Historical port catches remain a lead, but current species-specific North Breakwater recurrence and an applicable adult thermal calibration are not established.

Evidence register IDs: MI_CREEL, ROUND_DECLINE.

**Channel catfish — Not admitted.** No repeated species-specific catches from North Breakwater are established in the reviewed collection. River or inland-lake records do not resolve the pairing.

Evidence register IDs: MI_CREEL.

**Largemouth bass — Not admitted.** No repeated identified largemouth catches from North Breakwater are established. Unspecified bass, rock bass and smallmouth cannot be relabeled.

Evidence register IDs: MI_CREEL, B_364ea3a.

### Grand Haven

**Lake trout — Not admitted.** Port Pier/Dock catches recur, but the reviewed reports cannot attribute them to South Pier. Grouped Grand Haven/Holland and offshore reports cannot establish the covered structure.

Evidence register IDs: MI_CREEL, MI_STOCKING.

**Walleye — Not admitted.** Port catches establish occurrence, but repeated South Pier catches are not resolved. Upstream Grand River catches and grouped-port listings remain out of scope.

Evidence register IDs: MI_CREEL, B_14ccdb0.

**Smallmouth bass — Not admitted.** Repeated identified city pier catches support an annual research curve, but the covered South Pier attribution remains unverified. The AFS exact-site lead returned 403 and was not accepted from search snippets.

Evidence register IDs: MI_CREEL, B_207cdc1, B_3ebb776, B_425abbc, A_BASS_CARTER2012, A_SMALLMOUTH_RR1971, T023, P2_REGS2026.

**Freshwater drum — Admitted.** Repeated directed pier/channel casting, including 2026 during North Pier closure, supports a provisional South Pier target. Side attribution is an explicit contextual inference, not a named agency station.

Evidence register IDs: MI_CREEL, B_3588f66, B_3614332, B_36281c5, B_3a65224, B_41b62ae, B_41c718b, B_41e9e6e, B_4280cb4, P1_15952cf, P1_20b15b2, A_DRUM_BUR1984, T026, P2_REGS2026.

**Yellow perch — Not admitted.** Repeated port Pier/Dock catches justify research. The historical quantitative study identifies excluded North Pier; recent reports do not resolve recurring South Pier catches and seasonal magnitude. A purported local brochure could not be retrieved.

Evidence register IDs: MI_CREEL, MI_2025, P1_NOAA_1982.

**Lake whitefish — Not admitted.** Repeated pier reports and agency recognition establish a port fishery. Exact South Pier attribution remains unresolved, and catch totals containing snagged fish cannot calibrate lawful hook-and-line magnitude after the gear change. Not deferred for lack of popularity.

Evidence register IDs: MI_CREEL, WHITEFISH_GEAR, MI_REGS_2026, B_3c05a1b, P1_26a3cdd, P1_26d27d2, P1_95e0dc, P1_1cb4c9f, A_DNR_WHITEFISH, T017, P2_REGS2026.

**Round whitefish — Not admitted.** Annual research remains retained; exact South Pier recurrence and adult thermal response remain insufficiently constrained. Juvenile avoidance experiments cannot supply an adult bite curve.

Evidence register IDs: MI_CREEL, B_2cce8db, B_2cea412, P1_1e722ec, T019, ROUND_DECLINE, P2_REGS2026.

**Channel catfish — Not admitted.** Species-specific city pier reports and annual research support a candidate. Repeated catches cannot yet be assigned to covered South Pier. Generic catfish reports cannot distinguish channel from flathead or bullhead.

Evidence register IDs: MI_CREEL, B_3588f66, P1_20b15b2, B_14ccdb0, T029, A_CATFISH_KRUCKMAN2016, A_CATFISH_DISCHARGE1999, P2_REGS2026.

**Largemouth bass — Admitted.** Repeated pier catches in 2018 and 2025 plus August 2026 pier-context drop-shot catches during North closure support a provisional South Pier target. This is a qualified side/mode inference, not generic harbor occupancy.

Evidence register IDs: MI_CREEL, B_207cdc1, B_3e9b7f3, B_3eeac7b, B_426de2b, T030, A_BASS_CARTER2012, A_BASS_WINTER2008, A_BASS_WINTER2024, P2_REGS2026.

### Manistee

**Lake trout — Admitted.** Explicit pier catches in April 2023 while the South Pier was closed, corroborated by another year and Pier/Dock evidence, support provisional North Pier attribution. Offshore summer catches are not transferred.

Evidence register IDs: MI_CREEL, B_3548e2b, B_39595be, B_3155afc, T016, P2_REGS2026.

**Walleye — Not admitted.** Pier catches recur, but North Pier is not identified for walleye. A preceding North Pier perch sentence cannot attribute the following walleye catches; boat or upstream catches do not resolve it.

Evidence register IDs: MI_CREEL, P1_2452955, B_3176352, B_3588f66, B_3987c22, B_14ccdb0, A_DNR_WALLEYE, P2_REGS2026.

**Smallmouth bass — Admitted.** Repeated identified pier catches in 2023, 2024 and 2026, with a July 2024 dated local report explicitly identifying North Pier, meet the recurring-catch standard. The newspaper corroborates the agency event and is not counted as another event. Existing annual curve and shared provisional smallmouth thermal profile are retained.

Evidence register IDs: MI_CREEL, B_366250d, B_3a65224, B_3abfd6e, P1_3ad6654, P1_41fa7c2, A_BASS_CARTER2012, A_SMALLMOUTH_RR1971, T023, R_MAN_SMALL_NORTH2024, P2_REGS2026.

**Freshwater drum — Admitted.** Repeated agency pier catches and the dated June 2024 newspaper North Pier corroboration support provisional admission. The newspaper is not an independent catch event and its added side is not attributed to DNR.

Evidence register IDs: MI_CREEL, B_2e736eb, B_366250d, B_3a521c4, B_3a65224, B_3ebb776, P1_41fa7c2, A_DRUM_BUR1984, T026, P2_REGS2026, P2_MANISTEE_REPRINT2024.

**Yellow perch — Admitted.** Named North Pier catches across April 2017, May 2018 and June 2023 corroborate the recurrent pier fishery.

Evidence register IDs: MI_CREEL, B_1953bab, P1_1edc9d3, B_3176352, B_3588f66, P1_3600e54, B_3614332, B_36281c5, B_323f6bf, B_3de4822, A_PERCH_ATLAS1981, A_PERCH_GENETICS2019, T028, P2_REGS2026.

**Lake whitefish — Not admitted.** The explicit April 2025 lake-whitefish report is not enough to resolve repeat species-specific North Pier catches. Older North Pier reports identify only whitefish and cannot be split into lake versus round whitefish.

Evidence register IDs: MI_CREEL, B_3155afc, B_3de4822, P1_1edc9d3, P1_26a3cdd.

**Round whitefish — Not admitted.** Annual research remains retained. Adult thermal-response evidence is insufficient for a scored profile; juvenile round-whitefish avoidance is not adopted as adult pier compatibility.

Evidence register IDs: MI_CREEL, B_3548e2b, P1_3dc30dc, B_3de4822, T019, ROUND_DECLINE, P2_REGS2026.

**Channel catfish — Not admitted.** No repeated identified channel-catfish catches from North Pier are established. Manistee Lake and upstream river catches are not covered-pier evidence.

Evidence register IDs: MI_CREEL.

**Largemouth bass — Not admitted.** Annual port research remains retained, but repeated identified largemouth catches on North Pier are unresolved. The new July 2024 North Pier corroboration names smallmouth, not largemouth.

Evidence register IDs: MI_CREEL, B_3675eed, P1_3ad6654, A_BASS_CARTER2012, A_BASS_WINTER2008, A_BASS_WINTER2024, T030, P2_REGS2026.

### Frankfort–Elberta

**Lake trout — Not admitted.** Sparse port-mode cold-season catches remain a lead, but recurring catches from either covered breakwater are not established. Trolling at depth and Point Betsie stocking do not identify breakwater casting catches.

Evidence register IDs: MI_CREEL, B_4160ba5, MI_STOCKING.

**Walleye — Not admitted.** Historical port Pier/Dock catches remain a lead. The reviewed April 2024 and May 2026 inside/between-piers reports explicitly concern trolling and do not establish recurring breakwater catches.

Evidence register IDs: MI_CREEL, B_3987c22, B_4160ba5.

**Smallmouth bass — Not admitted.** Port catches indicate occurrence, but repeated species-specific catches from either covered breakwater are not established. Betsie Bay/river and other-port catches are not substituted.

Evidence register IDs: MI_CREEL.

**Freshwater drum — Not admitted.** Sparse port catches do not resolve repeated catches from either covered breakwater. Grand Haven or Manistee reports cannot establish this pairing.

Evidence register IDs: MI_CREEL.

**Yellow perch — Not admitted.** No repeated contemporary catch evidence from either covered breakwater is established. Inland-lake, bay and boat reports are not substituted.

Evidence register IDs: MI_CREEL.

**Lake whitefish — Not admitted.** Isolated spring port catches do not establish recurring species-specific catches from either covered breakwater. Menominee is a different species.

Evidence register IDs: MI_CREEL, ROUND_DECLINE.

**Round whitefish — Not admitted.** Historical Frankfort pier use is recognized, but the 2026 interview recalls a trip roughly a decade earlier. Contemporary recurrence and adult thermal calibration remain unestablished; it does not support an Elberta transfer.

Evidence register IDs: MI_CREEL, ROUND_DECLINE.

**Channel catfish — Not admitted.** No repeated identified channel-catfish catches on either covered breakwater are established. Regional or river presence does not resolve the pairing.

Evidence register IDs: MI_CREEL.

**Largemouth bass — Not admitted.** No repeated identified largemouth catches on either covered breakwater are established. Unspecified bass and protected inland habitat do not establish these structures.

Evidence register IDs: MI_CREEL.

### Sheboygan

**Lake trout — Not admitted.** Regional pier harvest cannot be assigned to Sheboygan. Reef stocking and boat catches do not establish repeat catches from either covered pier.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_STOCKING, WI_CURRENT.

**Walleye — Not admitted.** Regional Lake Michigan/Green Bay pier harvest cannot be assigned to Sheboygan. River walleye do not establish repeat catches from either covered pier.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_CURRENT.

**Smallmouth bass — Not admitted.** The September 2019 report documents smallmouth caught from the covered piers, regardless of anglers targeting salmon. A second independent dated local pier event is not established in the reviewed evidence; river and regional data do not supply that recurrence.

Evidence register IDs: SHEBOYGAN_SMALLMOUTH, WI_2022, WI_2023, WI_2024, WI_CURRENT.

**Freshwater drum — Not admitted.** No repeated dated species-specific catches from either covered pier are established. Regional catches and unspecified harbor reports are insufficient; unlisted regional harvest is not a zero catch estimate.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_CURRENT.

**Yellow perch — Not admitted.** Historical local recollection and pooled regional pier catches do not establish contemporary repeat catches from either covered pier. Power-plant-area and inland-lake reports are not transferred.

Evidence register IDs: WI_2022, WI_2023, WI_2024, SHEBOYGAN_PERCH_HISTORY, WI_CURRENT.

**Lake whitefish — Not admitted.** No repeated identified lake-whitefish catches from either covered pier are established. Green Bay whitefish fisheries are geographically inapplicable.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_CURRENT.

**Round whitefish — Not admitted.** No repeated species-specific round-whitefish catches from either covered pier are established. Lake whitefish and northern Michigan history are not substituted.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_CURRENT.

**Channel catfish — Not admitted.** No repeated identified channel-catfish catches from either covered pier are established. Sheboygan River reports do not resolve either covered structure.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_CURRENT.

**Largemouth bass — Not admitted.** No repeated identified largemouth catches from either covered pier are established. Smallmouth observations and unspecified bass are not relabeled.

Evidence register IDs: WI_2022, WI_2023, WI_2024, WI_CURRENT, SHEBOYGAN_SMALLMOUTH.

## Verification and deployment record

The engine is versioned `pier-cast-simple-model-v0.10.0`; roster v3 retains exact support for legacy v1 and previous private v2. New shadow runs contain 140 forecasts (28 combinations × five dates). Historical 100/135-row runs remain valid. The new migration preserves first-write daily locks and tests a previous v2 snapshot against an attempted v3 write. No existing daily score is overwritten.

The regenerated [annual audit](PierCast_Phase3_Audit.json), [weekly ratings](PierCast_Private_Lineup_Weekly_Ratings.csv), and [heatmap](PierCast_Phase3_Annual_Lineup.html) now cover 28 combinations. Each species retains independent anchor dates; a shared display date causes interpolation only, not another configured anchor.

Validation: 139 PierCast tests and `npx tsc --noEmit` pass; private roster and 1,456 weekly rows match generators; the annual audit passes 40,908 daily evaluations, 11,648 temperature scenarios and 2,520 full-pipeline species-days. Local PostgreSQL migration fixtures pass, including v1/v2/v3 compatibility and unchanged first-write locks. Prior seasonal evidence, Phase 2 generation and core replay checks pass.

**Operational closure:** Migration `20260913120000` was applied and local/remote histories are synchronized. Engine v0.10.0 is deployed in `pier-cast` version 20 and `pier-cast-ingest` version 15; both are ACTIVE with JWT verification enabled. Production checks confirm HTTP 200 with zero public catalog cities, HTTP 403 for anonymous review, and Manistee roster counts of seven for v2 and eight for v3. All 139 PierCast tests, deterministic annual/roster checks and TypeScript pass. Existing locks are preserved.

The full repository commit also includes the separately authored UI changes, score spreadsheet/browser exports and five App Store marketing images, as explicitly authorized. Home entry remains owner-only, and welcome/subscription/help screens retain coming-soon or owner-review gating until public release is authorized. The marketing files are committed assets, not a published App Store submission. No mobile binary or store release is part of this deployment.

## Sources

The comprehensive prior source inventory, dates, fishing modes, scope and caveats remain in the [Phase 1 evidence report](onboarding/piercast/remaining-species/PHASE1_SEASONAL_RESEARCH.md) and [Phase 2 thermal report](onboarding/piercast/remaining-species/PHASE2_THERMAL_RESEARCH.md). New retrievals, including failures, are preserved in the [reconciliation ledger](onboarding/piercast/remaining-species/reconciliation-retrieval-ledger.json); successful downloads have SHA-256 hashes. The dated newspaper source is added to the thermal/admission source register as corroboration, not as a thermal study.

[^1]: Michigan DNR. [Weekly Fishing Report, July 3, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3a65224), Manistee paragraph. Pier mode explicit; side not named. Reviewed September 13, 2026.
[^2]: Arielle Breen, Manistee News Advocate. [Manistee anglers catching Chinook of all sizes](https://www.manisteenews.com/news/article/manistee-anglers-catching-chinook-of-sizes-19555925.php), July 5, 2024. Names North Pier for the same DNR event; no independent effort estimate. Reviewed September 13, 2026.
[^3]: Michigan DNR. [Weekly Fishing Report, July 19, 2023](https://content.govdelivery.com/accounts/MIDNR/bulletins/366250d), Manistee pier smallmouth with spoons/jigs. Side unspecified; separate year supports recurrence. Reviewed September 13, 2026.
[^4]: Michigan DNR. [Weekly Fishing Report, July 8, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/41fa7c2), Manistee pier smallmouth slow; boat drum not reassigned to pier. Reviewed September 13, 2026.
[^5]: Wisconsin DNR. [Lake Michigan Outdoor Fishing Report, September 7, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport), Sheboygan Pier/Shore subsection. Current mutable page preserved September 13, 2026; other county reports do not establish Sheboygan species.
[^6]: Michigan DNR. [Ports of Grand Haven, Muskegon and Whitehall/Montague: new regulations November 1–30](https://content.govdelivery.com/accounts/MIDNR/bulletins/3fb1148), November 12, 2025. Recognition of port lake-whitefish fishery, decline and snagging contribution; not exact South Pier lawful-method CPUE. Current 2026 guide retained as P2_REGS2026 remains the regulation source for configuration.
