# PierCast — Annual Species Biology and Thermal Research

> **Remaining-species review — 2026-09-12:** The [45-pair decision register](onboarding/piercast/remaining-species/README.md) supersedes earlier candidate labels for the nine non-core species. Three narrow fishery leads remain; other pairings are historical/unresolved or excluded. No additional daily seasonal or thermal curve is justified by this review. Numerical onboarding remains unresolved, with explicit unavailable/excluded weekly rows and configuration gates. The existing four-species scores, formula, UI, daily lock, conditions pipeline and disabled public release remain unchanged.

**Completed:** 2026-09-09
**Status:** Full upfront evidence pass for all 13 retained species. A later product-calibration pass added disabled provisional curves for the four core species only; no numerical curve is approved for public use. See [Core temperature and source calibration](PierCast_Core_Temperature_and_Source_Calibration.md).
**Scope:** Chinook salmon, coho salmon, steelhead, brown trout, lake trout, walleye, smallmouth bass, freshwater drum, yellow perch, lake whitefish, round whitefish, channel catfish, and largemouth bass across all twelve months.
**Artifacts:** [Structured evidence](PierCast_Thermal_Evidence.json) · [Shared species/month matrix](PierCast_Species_Month_Biology_Matrix.csv) · [Local city/species/month inventory](PierCast_Pilot_Season_Matrix.csv) · [Environmental feasibility](PierCast_Environmental_Data_Feasibility.md)

## 1. Bottom line

The research supports a small set of reusable seasonal **behavioral contexts**, not 156 independent monthly temperature curves. No source reviewed measures an adult angling-opportunity response to temperature across all seasons at the five candidate pier fisheries. Even the strongest numerical studies measure occupancy, telemetry, net catch, growth, spawning, or broad agency preference. Those endpoints cannot be silently relabeled as bite probability.

Therefore:

- all 13 species have an annual research disposition and a smallest defensible profile set;
- every species × month appears in the shared 156-row CSV;
- local occurrence remains separate in the existing 672-row city matrix;
- conditional profiles are proposed only where behavior and reachability materially change;
- no temperature-trend bonus, hard failure threshold, or activation weight is approved; provisional suitability ordinates now exist only for the four core species;
- round whitefish is not treated as lake whitefish, and smallmouth is not treated as largemouth;
- bowfin and northern pike remain incidental Manistee leads, outside the retained roster; and
- no numerical city forecast can launch until fixed reachable-water samples and prospective validation exist.

This is a completed upfront research package, not a claim that the product is release-ready.

## 2. Evidence and inference rules

| Class | Meaning | Permitted use |
| --- | --- | --- |
| **SB — sourced biology** | Finding stated by a reviewed primary paper or agency source | Describe the source's endpoint with its life stage, season, place, and method |
| **RT — proposed regional transfer** | Relevant Great Lakes or northern-lake finding outside the exact city/structure | Research hypothesis or provisional context; never automatic local configuration |
| **LO — local occurrence** | Named-port/pier evidence in the city research package | Supports occurrence for that report/window, not a thermal curve or abundance ceiling |
| **AE — absent evidence** | This pass found no adequate evidence for the required proposition | Unknown/unavailable, never zero opportunity |
| **IL — input limitation** | Required reachable-water/depth input is not validated | Blocks numerical scoring even when biology is supported |
| **PC — provisional calibration** | Engineering choice constrained by evidence but not itself measured | Version, expose, review, and validate before activation |

Occupancy is not preference; preference is not feeding; feeding is not angling catchability; a spawning temperature is not a year-round optimum; tolerance is not favorability. Monthly context never establishes local presence. The structured JSON preserves reading scope, transfer status, contradictions, and explicit nulls.

## 3. Numerical evidence ledger — endpoints preserved

No row below is an enabled curve. Values are retained to make later calibration auditable.

| Species | Numerical finding | Endpoint and scope | Disposition |
| --- | --- | --- | --- |
| Chinook salmon | 10–14 °C printed general range; assessment-net catch highest around 9 °C | Wisconsin agency summary; Lake Michigan net catch | SB, but neither is a pier-bite peak. Do not average them. [T001, T006] |
| Coho salmon | 12–14 °C printed general range; historical Lake Michigan adult observation 16.6 °C | Agency summary and historical synthesis | SB/source lead; method and seasonal applicability insufficient for scoring. [T002, T013] |
| Steelhead | 12–14 °C printed general range | Wisconsin agency summary, life stage/method unspecified | SB/source lead; strain, season, depth, and catch response unresolved. [T003] |
| Brown trout | 18–24 °C printed Wisconsin range; Lake Ontario adults mostly occupied 8–18 °C, means about 10–13 °C by sampled season; Michigan describes 10–18.3 °C | Conflicting agency summary versus Great Lakes telemetry/netting | Quarantine 18–24 °C as universal preference. The regional field envelope is RT, not a Lake Michigan pier curve. [T004, T014, T015] |
| Lake trout | 9–11 °C printed range; Michigan describes 4.4–12.8 °C; laboratory-derived optimum 10 °C in a telemetry analysis | Agency summaries, laboratory model parameter, field occupancy | Supports cold-water biology only. Seasonal depth/reachability dominates pier applicability. [T005, T011, T016] |
| Walleye | Historical adult preference observations broadly around 20–24 °C; newer annual study cites peak modeled growth at 21 °C | Multi-study synthesis and Lake Ontario telemetry/bioenergetics | RT; growth/preference is not night feeding or pier catchability. [T013, T020, T021] |
| Smallmouth bass | Adult laboratory preference 28–31 °C; Michigan spawning begins around 15.6 °C | Laboratory HSI source and agency life history | Different endpoints. Neither defines Lake Michigan harbor opportunity; use harbor movement evidence for seasonal reachability. [T023, T024] |
| Freshwater drum | Stress reported above 25.6 °C with low oxygen; spawning 18–26 °C; older-fish growth season in western Lake Erie occurred across bottom temperatures roughly 14–22 °C | Synthesis and regional field growth | RT; stress, spawning, and growth are not an optimum. [T025, T026] |
| Yellow perch | 19–21 °C described as a moderate preference | USGS species summary, method unspecified | SB/source lead only; seasonal nearshore/depth evidence is more defensible than numeric scoring. [T027, T028] |
| Lake whitefish | Tagged fish occupied 0–8 °C in winter and up to roughly 20–21.5 °C in spring–fall; summer average 10.8 °C | 13 recovered archival tags, northwestern Lake Michigan/Green Bay | Strong regional occupancy evidence, but broad occupancy and small recovery sample do not supply suitability scores. [T017] |
| Round whitefish | No adult opportunity-temperature band accepted | Species-specific agency seasonal depth/spawning account | Do not borrow lake-whitefish values. Profile remains nonnumeric. [T019] |
| Channel catfish | Historical adult summer/fall observations around 25 °C; growth optima around 28–30 °C include younger stages | Multi-study historical synthesis | RT/source lead; life stage and Lake Michigan harbor applicability block a curve. [T013] |
| Largemouth bass | Michigan describes activity at 21–29 °C | Agency life-history summary | SB/source lead; not a measured Grand Haven harbor selection/catch curve. [T030] |

## 4. Smallest defensible behavioral profile set

These are configuration names and activation hypotheses, not enabled models.

| Species | Minimum profiles | Why profiles differ | What remains shared |
| --- | --- | --- | --- |
| Chinook | `lake_feeding`; `mature_return_staging` | Offshore/deeper feeding distribution and mature port return have different reachability and motivation. [T006] | No assumed different intrinsic optimum without evidence |
| Coho | `lake_feeding`; `mature_return_staging` | Spring nearshore feeding and autumn return are locally distinct contexts. [T008] | No borrowed Chinook curve |
| Steelhead | `lake_feeding`; `return_migration`; `post_spawn_return` | Migratory strain timing and post-spawn status alter availability. [T009, T010, T032] | No strain-weight blend invented |
| Brown trout | `lake_feeding`; `return_staging` | Shallow spring fishery and late-summer/fall tributary staging differ in reachability. [T014, T015] | Regional adult evidence remains transfer-limited |
| Lake trout | `reachable_cold_water`; `deep_summer`; `fall_spawning_shoal` | Seasonal depth makes favorable offshore water unusable from a pier; fall shoal use is distinct. [T011, T012, T016] | No strain curve without local stock evidence |
| Walleye | `nearshore_low_light`; `spawning_transition`; `offshore_or_deep` | Light, depth, migration, and spring spawning affect access independently of temperature. [T020, T021, T031] | One nonnumeric thermal evidence track |
| Smallmouth bass | `spring_harbor_spawn`; `warm_season_feeding`; `winter_deep` | Lake Michigan harbor telemetry documents spawning-season harbor use and later movement. [T022] | No lab-preference-to-field-score substitution |
| Freshwater drum | `warm_season_bottom_feeding`; `cold_season_deep` | Bottom/depth and warm-season spawning/feeding drive reachability. [T025, T026] | No separate spawn-temperature score |
| Yellow perch | `spring_shallow`; `warm_season_nearshore`; `winter_active` | Michigan life history supports seasonal depth shifts and winter activity. [T028] | Schooling response remains unmodeled |
| Lake whitefish | `cold_season_feeding`; `deep_summer`; `fall_spawning_shoal` | Tagged occupancy broadens in summer while agency biology places summer fish deep and spawning fish shallow. [T017, T018] | Occupancy stays distinct from suitability |
| Round whitefish | `spring_shallow`; `deep_summer`; `fall_spawning_shoal` | Michigan documents shallow use mainly April–May and October–November. [T019] | No lake-whitefish substitution |
| Channel catfish | `warm_season_nocturnal_shallow`; `cold_season_deep` | Seasonal activity plus diel depth affects reachability; best-time prediction remains outside v1. [T029] | No independent spawning bonus |
| Largemouth bass | `spring_harbor_spawn`; `warm_shallow_feeding`; `winter_deep` | Warm shallow cover differs from overwintering depth. [T022, T030] | No smallmouth substitution |

Use conditional profiles only when behavior changes the meaning or reachability of the input. Otherwise, represent seasonality once in city × species availability. Do not count a fall return in both availability and a thermal multiplier.

## 5. Annual month coverage

The machine-readable [species/month matrix](PierCast_Species_Month_Biology_Matrix.csv) contains exactly 13 × 12 rows. This compact view shows shared contexts only; it says nothing about city occurrence.

Codes: **LF** lake feeding; **MR** mature return/staging; **RM** return migration; **PR** post-spawn return; **SN** shallow/nearshore; **SP** spawning context; **DS** deep/summer or offshore; **WD** winter/deep; **WA** winter active; **TR** transition; **CF** cold-season feeding. A slash means mixed context, not additive scores. `?` is an explicit evidence gap.

| Species | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | LF? | LF? | LF | LF/SN | LF/SN | LF | DS/LF | LF/MR | MR | MR/LF | LF? | LF? |
| Coho | LF? | LF? | LF/SN | LF/SN | LF | LF | DS/LF | LF/MR | MR | MR | MR/LF | LF? |
| Steelhead | RM/WA | RM/WA | RM/SP | SP/PR | PR/LF | LF | LF | LF/RM | RM | RM | RM/WA | RM/WA |
| Brown trout | CF | CF | SN/LF | SN/LF | LF | DS/LF | DS/LF | DS/MR | MR/SP | SP | PR/CF | CF |
| Lake trout | CF/SN | CF/SN | CF/SN | CF/SN | TR | DS | DS | DS | DS/SP | SP | SP/CF | CF/SN |
| Walleye | WA/WD | WA/WD | SP/TR | SP | PR | LF | LF | LF | LF | LF/TR | WA/WD | WA/WD |
| Smallmouth bass | WD | WD | WD/TR | SN | SP | SP/PR | LF | LF | LF/TR | DS | WD | WD |
| Freshwater drum | WD? | WD? | WD/TR | TR | SP/LF | SP/LF | LF | LF | LF | TR | WD? | WD? |
| Yellow perch | WA | WA | SN/SP | SP | PR/LF | LF | LF | LF | SN/LF | SN/LF | WA | WA |
| Lake whitefish | CF | CF | CF | CF/TR | TR | DS | DS | DS | DS/TR | SN/SP | SP | SP/CF |
| Round whitefish | WD | WD | WD | SN | SN/TR | DS | DS | DS | DS/TR | SN/SP | SP | WD/CF? |
| Channel catfish | WD | WD | WD/TR | TR | SP | SP/LF | LF | LF | LF | TR | WD | WD |
| Largemouth bass | WD | WD | WD/TR | SN | SP | SP/PR | LF | LF | LF/TR | TR/WD | WD | WD |

Interpretation discipline:

- **SB:** sources support the general row context.
- **RT:** transfers from Ontario, Huron, Erie, Illinois Lake Michigan, inland Michigan, or a general account remain proposed until city review.
- **LO:** consult `PierCast_Pilot_Season_Matrix.csv`; a context here never creates a city pairing.
- **AE:** question marks and explicit gaps remain unresolved; absence of a report is not absence of fish.
- **IL:** every row still lacks an approved pier-reachable temperature/depth input.

## 6. Species dossiers and city applicability

### Salmon and trout

**Chinook salmon.** Lake Michigan assessment data support seasonal northward/offshore/deeper movement and autumn return toward eastern ports, with prey and temperature both relevant. Highest net catch near 9 °C is method-specific, not a universal optimum. [T006] Apply `lake_feeding` to locally supported spring/summer windows and `mature_return_staging` only where local evidence supports port return. Frankfort's 2026 report was inside-pier trolling and does not establish shore reachability. Winter pier availability remains AE.

**Coho salmon.** Michigan DNR supports an early-spring east-side Lake Michigan fishery and late-summer/autumn return, while local strength varies. [T008] The four Michigan cities have some direct/local evidence; Sheboygan needs current species-specific corroboration. Winter opportunity remains AE.

**Steelhead.** Great Lakes fish are highly migratory; tributary entry can span autumn through spring, and fish may return to the lake after spawning. Strain descriptions differ, so no stock-mixture weights are assumed. [T009, T010, T032] A Lake Michigan bioenergetic habitat index did not predict spatial angler catch well, reinforcing prospective validation. [T007]

**Brown trout.** Lake Ontario adults were strongly associated with 8–18 °C in sampled spring, summer, and fall, often near the thermocline and within 3.2 km of shore. [T014] This is valuable RT evidence, not a Lake Michigan pier score. Michigan's 10–18.3 °C account and early-spring pier fishery conflict materially with T004, which remains quarantined. [T015]

**Lake trout.** Evidence supports cold-water use, but seasonal depth controls shore access: Michigan describes shallow use in fall through spring and 30–60+ m summer depths. [T016] Huron/Ontario telemetry shows individual/strain variability and occupancy cooler than assumed optima for much of the year. [T011, T012] Only Manistee has limited direct pier evidence in the local inventory.

### Percids and bass

**Walleye.** Adult biologgers show lake, season, and resident/migrant differences; an annual Lake Ontario study associates colder November–May conditions with reduced growth and warm-season vertical feeding activity. [T020, T021] Michigan reports March–May spawning and year-round feeding. [T031] Manistee has direct pier evidence; temperature cannot substitute for light, depth, and local occurrence.

**Smallmouth bass.** Lake Michigan harbor telemetry at North Point Marina found spring spawning use of warm shallow harbor water and reduced harbor presence after reproduction. [T022] Illinois harbor geometry and sample size limit transfer. Ludington depends on unresolved stub-pier mapping; Manistee and Grand Haven have warm-season reports; Frankfort/Sheboygan remain unresolved.

**Largemouth bass.** The same harbor study included only eight largemouth, making it weak RT evidence. [T022] Michigan describes warm, shallow, cover-associated habitat and 21–29 °C activity. [T030] Only Grand Haven has a direct local report in the current inventory.

**Yellow perch.** Michigan describes shallow nearshore schools, spring spawning, shallower spring/fall distribution, and winter activity. [T028] The generic 19–21 °C range lacks method/pier context. [T027] Manistee has direct pier evidence; Grand Haven has a grouped agency listing.

### Other nearshore species

**Freshwater drum.** Sources support bottom-oriented warm-season feeding/spawning and cold-season depth, but numeric values refer to stress, spawning, or growth—not bite response. [T025, T026] Port reports support Ludington, Grand Haven, and Manistee; Frankfort/Sheboygan remain unresolved.

**Lake whitefish.** Northwestern Lake Michigan/Green Bay tags document wide seasonal occupancy and frequent summer use outside proposed optimal bands. [T017] Michigan describes deep summer habitat and shallow rocky early-winter spawning. [T018] Grand Haven has a regulated November port fishery and Manistee limited direct evidence.

**Round whitefish (menominee).** Michigan documents shallow 2–15 m use mainly April–May and October–November, deeper use otherwise, and usually November spawning. [T019] Historical Ludington/Manistee/Frankfort data are leads, not current calibration. Lake-whitefish values are not transferable by name similarity.

**Channel catfish.** Michigan describes daytime cover/deeper pools, shallow night feeding, and late-spring/early-summer nesting. [T029] Grand Haven has direct/grouped support; the other cities remain unresolved. Diel biology is explanatory only because best-time prediction is outside v1.

### City inheritance disposition

`Candidate` means the shared profile may proceed to local representation/calibration review; it is not enabled. `Conditional` means a specific structure/method or narrow season must be resolved. `Historical lead` needs contemporary corroboration. `Unresolved` remains disabled.

| Species | Ludington | Grand Haven | Manistee | Frankfort | Sheboygan |
| --- | --- | --- | --- | --- | --- |
| Chinook | Candidate | Candidate | Candidate | Candidate; shore method conditional | Candidate |
| Coho | Candidate | Candidate | Candidate | Candidate | Unresolved local species-specific pier evidence |
| Steelhead | Candidate | Candidate | Candidate | Candidate | Candidate |
| Brown trout | Candidate | Candidate | Candidate | Candidate | Candidate |
| Lake trout | Unresolved | Unresolved/grouped lead | Conditional limited pier record | Unresolved | Unresolved |
| Walleye | Unresolved | Unresolved/grouped lead | Candidate | Conditional inside-pier trolling lead | Unresolved |
| Smallmouth bass | Conditional on stub mapping | Historical/local lead | Candidate | Unresolved | Unresolved |
| Freshwater drum | Candidate | Candidate | Candidate | Unresolved | Unresolved |
| Yellow perch | Unresolved | Conditional grouped/boat evidence | Candidate | Unresolved | Unresolved |
| Lake whitefish | Unresolved | Candidate November port context | Conditional limited record | Unresolved | Unresolved |
| Round whitefish | Historical lead | Local lead needing current season review | Historical lead | Historical lead | Unresolved |
| Channel catfish | Unresolved | Candidate | Unresolved | Unresolved | Unresolved |
| Largemouth bass | Unresolved | Candidate/secondary | Unresolved | Unresolved | Unresolved |

The evidence IDs and monthly state for each non-unresolved pairing remain authoritative in `PierCast_Pilot_Season_Matrix.csv`. This table summarizes inheritance; it does not add missing city/species rows.

## 7. Curve and modifier disposition

No species cleared the full chain:

`adult relevant endpoint → applicable population/season → local occurrence → reachable-water input → opportunity/catch calibration → held-out validation`

Some clear the first links; none clear all six. The later four-species package therefore labels every 0–1 ordinate as PC rather than biological evidence. It uses the master's piecewise-linear form with documented anchors, a separate accepted input domain, smooth supported transitions, no favorable out-of-domain clamping, and explicit provenance for every chosen ordinate.

### Accepted-domain policy

No production `acceptedDomainC` is approved for any of the 13 species. The four core profiles now carry a provisional `0–26 °C` input domain for private testing; it is an engineering validation boundary, not a biological tolerance claim. Until both curve and environmental representation are approved, public evaluation remains unavailable. The other nine species remain nonnumeric.

| Optional effect | Status | Reason |
| --- | --- | --- |
| Temperature trend | Disabled | No independent adult pier-catch response; it would double count some seasonal contexts. |
| Spawning/migration bonus | Disabled | Presence belongs in seasonal availability absent incremental catch evidence. |
| Light/diel modifier | Disabled in v1 | Relevant to walleye/catfish, but best-time prediction and local calibration are absent. |
| Wave/wind biological effect | Disabled | Practical conditions remain separate. |
| Surface–bottom proxy | Disabled | Requires validated depth representation and cannot be inferred from SST alone. |

## 8. Remaining unknowns and consequences

| Unknown | Consequence | Bounded disposition |
| --- | --- | --- |
| No adult pier-catch thermal response | No numerical opportunity curve is production-ready | Collect prospective, effort-aware outcomes and independent review |
| No fixed city/species reachable-water sample | All numerical thermal scores blocked | Complete the environmental representation protocol |
| Sparse winter local evidence for several species | Month remains unknown, not zero | Show no scored target where evidence/validation is insufficient |
| Behavioral transitions vary by year | Hard month switches create false precision | Smooth reviewed seasonal availability; no invented exact dates |
| Stock/strain composition unknown | Steelhead/lake-trout weights unavailable | Shared conservative profile or disabled context; no invented blend |
| Frankfort report used inside-pier trolling | Shore reachability unproven | Occurrence lead only |
| Sheboygan annual evidence thin | Tentative city cannot claim a full roster | Keep unresolved pairings disabled |

### Final research readiness/disposition

| Required category | Final disposition |
| --- | --- |
| Research-supported inputs | Adult/general thermal endpoints, seasonal behavioral contexts, 156 shared month rows, 672 local occurrence rows, and provider format/horizon facts are documented with provenance. |
| Explicit regional transfers | Brown trout (Ontario), lake trout (Huron/Ontario), walleye (Huron/Erie/Ontario), bass (Illinois Lake Michigan harbor), drum (Erie), and lake whitefish (northwestern Lake Michigan/Green Bay) remain labeled RT and unapproved locally. |
| Provisional calibration | Disabled provisional city-seasonal ratings and shared thermal curves are adopted for Chinook, coho, steelhead, and brown trout only. They do not meet the full production evidence chain and are explicitly labeled FinFindr calibration. The other nine species remain nonnumeric. |
| Unresolved launch blockers | Fixed casting-water areas/model layers, local temperature validation, opportunity/catch calibration, current access for noted structures, Sheboygan annual roster, reviewer assignment, and held-out evaluation. |
| Optional effects deliberately disabled | Trend/acclimation lag, migration/spawning bonus, diel/light effect, wave/wind biology, and surface–bottom proxy. |

## 9. Implementation handoff

An implementer may build the schema, deterministic profile resolver, reason-code plumbing, offline provider extractor, and validation harness. Default configuration must keep every numerical species score disabled. The shared matrix supplies annual test contexts; the local matrix supplies occurrence states; the environmental plan supplies input gates.

Do not implement from the historical `PierCast_Agent_Build_Spec.md`. Authority order:

1. [Master Build Specification](PierCast_Master_Build_Spec.md), except superseded pier-keyed/public-profile language;
2. [City Coverage and Engine Plan](PierCast_City_Coverage_and_Engine_Plan.md);
3. [Pilot Cities Research](PierCast_Pilot_Cities_Research.md);
4. this annual biology package and structured artifacts; and
5. [Environmental Data Feasibility](PierCast_Environmental_Data_Feasibility.md).

## 10. Source index

Detailed limitations are in the JSON. All sources were accessed 2026-09-09.

- **T001–T005:** Wisconsin DNR fact sheets for [Chinook](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_chinooksalmon.pdf), [coho](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_cohosalmon.pdf), [rainbow trout](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_rainbowtrout.pdf), [brown trout](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_browntrout.pdf), and [lake trout](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_laketrout.pdf).
- **T006:** [Adlerstein et al., Lake Michigan Chinook movements](https://academic.oup.com/tafs/article/137/3/736/7888693), 2008, DOI 10.1577/T07-122.1.
- **T007:** [Höök et al., Lake Michigan steelhead growth habitat versus catch](https://www.usgs.gov/publications/landscape-scale-measures-steelhead-oncorhynchus-mykiss-bioenergetic-growth-rate), 2004.
- **T008:** [Michigan DNR coho profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon).
- **T009:** [Wisconsin DNR steelhead strains](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_steelhead.pdf).
- **T010:** [Wisconsin DNR Root River facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf), fall 2024/spring 2025.
- **T011:** [Ivanova et al., realized thermal niche](https://pmc.ncbi.nlm.nih.gov/articles/PMC10867506/), 2024, DOI 10.1002/ece3.10974.
- **T012:** [Bergstedt et al., Lake Huron lake-trout habitat](https://pubs.usgs.gov/publication/1000840), 2003.
- **T013:** [Great Lakes Fishery Commission temperature synthesis](https://www.sealamprey.org/pubs/SpecialPubs/Sp87_3.pdf), 1987.
- **T014:** [Haynes et al., Lake Ontario brown-trout temperature/depth](https://www.sciencedirect.com/science/article/pii/S0380133087716402), 1987, DOI 10.1016/S0380-1330(87)71640-2.
- **T015:** [Michigan DNR brown trout profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout).
- **T016:** [Michigan DNR lake trout profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout).
- **T017:** [Reed et al., lake-whitefish thermal ecology](https://www.usgs.gov/publications/initial-insights-thermal-ecology-lake-whitefish-northwestern-lake-michigan), 2023, DOI 10.1016/j.jglr.2023.03.002.
- **T018:** [Michigan DNR lake whitefish profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/whitefish).
- **T019:** [Michigan DNR round whitefish/menominee profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/menominee).
- **T020:** [Peat et al., adult walleye thermal ecology](https://pubs.usgs.gov/publication/70159488), 2015, DOI 10.1016/j.jtherbio.2015.08.009.
- **T021:** [Lake Ontario annual walleye migration/thermal experience](https://doi.org/10.1186/s40317-025-00410-8), 2025.
- **T022:** [Carter et al., bass movements in a Lake Michigan harbor](https://www.sciencedirect.com/science/article/pii/S038013301200038X), 2012, DOI 10.1016/j.jglr.2012.02.003.
- **T023:** [Michigan DNR smallmouth bass profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/smallmouth).
- **T024:** [USFWS smallmouth-bass habitat model](https://www.govinfo.gov/content/pkg/GOVPUB-I49-PURL-LPS101721/pdf/GOVPUB-I49-PURL-LPS101721.pdf), historical laboratory/HSI synthesis.
- **T025:** [USGS NAS freshwater drum fact sheet](https://nas.er.usgs.gov/queries/factsheet.aspx?speciesid=946).
- **T026:** [USGS, freshwater drum in western Lake Erie](https://www.usgs.gov/publications/biology-freshwater-drum-western-lake-erie).
- **T027:** [USGS yellow perch profile](https://www.usgs.gov/labs/fish-health-program/science/yellow-perch-perca-flavescens-fhp).
- **T028:** [Michigan DNR yellow perch profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/yellow-perch).
- **T029:** [Michigan DNR catfish profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/catfish).
- **T030:** [Michigan DNR largemouth bass profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/largemouth).
- **T031:** [Michigan DNR walleye profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/walleye).
- **T032:** [Michigan DNR steelhead profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead).
