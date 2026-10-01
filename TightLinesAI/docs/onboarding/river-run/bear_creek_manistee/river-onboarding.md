# Bear Creek (Manistee) River Run Onboarding Dossier

**River ID:** `bear_creek_manistee`

**State:** `MI`

**Created:** 2026-09-18

**Status:** `pass2_public_implementation_complete`

**Target gate:** `implemented_not_deployed`

**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

**Foundation approval/version/date:** Research lock `bear-creek-manistee-foundation-v1-draft`, 2026-09-18.

**Run-truth approval/version/date:** Six-field calendar/presence/zone reconciliation for three runs, 2026-09-18.

**Rendered owner acceptance/date:** User authorized full Pass 2 implementation on 2026-09-18; automated client and source-scope acceptance completed 2026-09-19.

**Deployment authorization/date:** Not granted; no deployment performed.

**Public enablement authorization/date:** Granted by the Pass 2 implementation request; added to the local public catalog on 2026-09-19. No deployment performed.

**Contradiction search completed by/date:** Codex, 2026-09-18; current regulations, DNR assessment, USFWS corridor, USGS inventory, and Manistee comparator reviewed.

**Independent falsification review by/date:** Executable source-boundary and hidden-registry tests, 2026-09-18.

**Research cutoff and time-sensitive recheck triggers:** 2026-09-18. Recheck Michigan regulations after 2027-03-31, any new gauge deployment, barrier or passage change, new creel/adult-return study, or public release request.

### Delivery contract

**Exact hidden-review river/run IDs:** `bear_creek_manistee`; `bear_creek_manistee_fall_chinook`, `bear_creek_manistee_fall_coho`, `bear_creek_manistee_fall_steelhead`.

**Activity contracts by run:** Unavailable for all three in Pass 1. Pass 2 must select and replay an evidence-bounded model before any score or mean-by-stage value exists.

**Stopping gate:** `hidden_implementation_ready`

| Delivery class | Changes required | Authorization/status |
| --- | --- | --- |
| Server-only configuration | Hidden river, three hidden run profiles, configuration document, tests | Implemented in owner-review registry only |
| Mobile-binary presentation | None in Pass 1 | Withheld for Pass 2 |
| Database/migration/cron | None in Pass 1 | Not required |
| Function deployment | None in Pass 1 | Not authorized |

| Client compatibility | Decision |
| --- | --- |
| Capability ID | Existing hidden owner-review path only; no new public capability in Pass 1 |
| Protected river/run IDs | River and three run IDs listed above |
| Bundled dependencies | None |
| First compatible app version / iOS build / Android versionCode | Pass 2 decision |
| No-capability behavior | Ordinary clients receive the unchanged public catalog |
| Admin/ordinary user, capability/no-capability verification | Registry isolation is automated; rendered client verification belongs to Pass 2 |

| ID | Authority/title | URL/path | Published/updated | Event/data years | Page/table | Accessed | Facts supported | Geographic scope | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-001 | Michigan DNR, Bear Creek Status of the Fishery Resource Report 2014-195 | https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder2/2014-195.pdf | 2014; renumbered 2024 | 1958-2014 | pp. 1-12; Tables 3, 5, 10 | 2026-09-18 | Identity, watershed, passage, discharge context, access limitations, natural reproduction, management species | Bear Creek watershed | Adult return and smolt production are explicitly unknown; no creel survey |
| E-002 | Michigan DNR, Fisheries Order FO-200.26 | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Orders/Fish-Orders/FO_200.pdf | 2025/2026 | Effective 2026-04-01 | Type 3 table and Type 3 rules | 2026-09-18 | CR 600/Coates-to-Manistee legal reach, year-round season, rainbow limit, artificial-lure window | Configured corridor | Rules expire/change; recheck current order |
| E-003 | U.S. Fish and Wildlife Service, Bear Wild and Scenic River | https://www.fws.gov/rivers/river/bear | Current agency page | Current designation | River description | 2026-09-18 | 6.5-mile Coates Highway-to-Manistee designated segment and broad access context | Configured corridor | Recreation description is not parcel-level fishing-access verification |
| E-004 | USGS, Bear Creek at Coates Highway near Brethren, 04125700 | https://waterdata.usgs.gov/monitoring-location/USGS-04125700/ | Station record | 1958-1968 field measurements | Station inventory | 2026-09-18 | Coordinate and absence of current continuous flow/temperature | Coates Highway endpoint | Sparse historical measurements cannot be a live gauge or daily normal |
| E-005 | USGS NLDI/NHDPlus navigation from 04125700 | https://api.water.usgs.gov/nldi/linked-data/nwissite/USGS-04125700/navigation/DM/flowlines?distance=20 | Current service | NHDPlus geometry | Downstream flowlines | 2026-09-18 | Confluence geometry and reach reconciliation | Bear-to-Manistee corridor | Geometry supports boundaries, not access or fish position |
| E-006 | Michigan DNR, Manistee River below Tippy Dam Status Report 2004-4 | https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder4/StatusReport_ManisteeRiverTippyDam_04-4.pdf | 2004 | Historical fishery record | Species/run discussion | 2026-09-18 | Receiving-system calendar comparator and Bear Creek natural-production context | Manistee below Tippy | Comparator cannot supply Bear-specific abundance or daily timing |
| E-007 | Michigan DNR, Chinook Salmon species profile | https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon | Current agency page | General biology | Species profile | 2026-09-18 | Great Lakes fall-spawning biology | Great Lakes | Not river-specific |
| E-008 | Michigan DNR, Coho Salmon species profile | https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon | Current agency page | General biology | Species profile | 2026-09-18 | Later fall spawning and shared biology profile | Great Lakes | Not river-specific |

## 2. Identity and corridor

| Field | Decision | Evidence IDs | Status |
| --- | --- | --- | --- |
| Official identity/aliases/exclusions | Bear Creek in Manistee County, tributary to the Manistee River below Tippy Dam; excludes other Michigan Bear Creeks | E-001, E-003 | accepted |
| Runtime region/schema fit | Michigan `great_lakes`, existing Chinook/Coho/Steelhead biology and fall engines | E-001, E-007, E-008 | accepted |
| Jurisdictions/presentation contexts | Michigan; lower segment includes federal National Forest/Scenic River context and private frontage | E-001, E-003 | accepted |
| Mouth/receiving water/timezone | Manistee River confluence at 44.292388, -86.116840; America/Detroit | E-001, E-005 | accepted |
| Downstream/upstream product termini and length | Manistee confluence upstream 6.5 miles to CR 600/Coates Highway | E-002, E-003, E-005 | accepted |
| Weather point and representation | Coates station coordinate; modeled weather is context only and no Pass 1 scoring input | E-004 | accepted |

## 3. Canonical reaches

| Reach ID | Public name | Downstream boundary | Upstream boundary | Order/role | Species access | Gauge represented | Evidence IDs |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `bear_creek_lower` | Lower Bear Creek | Manistee confluence | River Road access area | 1/lower | All three | no | E-001, E-003, E-005 |
| `bear_creek_upper` | Upper designated Bear Creek | River Road access area | Coates Highway | 2/upper | All three | no | E-001, E-002, E-003 |

## 4. Barrier and passage inventory

| Barrier ID/name | Type/status/location | Operating/passage limits | Species passage | Product limit/closure | Verified | Evidence IDs | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `bear_creek_coates_endpoint` / Coates Highway | Administrative product boundary at USGS 04125700 | Not a physical fish barrier; Spirit of the Woods lowhead dam near this area does not impede most species per DNR | Migratory fish access most of watershed | Public model stops at current Type 3 upstream boundary | yes | E-001, E-002, E-004 | accepted conservative endpoint |

## 5. Species endpoints and passage chains

| Species | Mouth-to-endpoint chain | Conservative endpoint | Physical endpoint vs opportunity distribution | Evidence IDs | Status |
| --- | --- | --- | --- | --- | --- |
| Chinook | Manistee confluence → lower → upper designated reach | Coates Highway | Administrative endpoint; natural reproduction documented beyond simple catch reputation | E-001, E-002 | accepted |
| Coho | Manistee confluence → lower → upper designated reach | Coates Highway | Administrative endpoint; self-sustaining population documented, adult opportunity weaker than Chinook | E-001, E-002 | accepted |
| Steelhead | Manistee confluence → lower → upper designated reach | Coates Highway | Administrative endpoint; living fall entrants may remain beyond fall model end | E-001, E-002 | accepted |
| Lake-run brown trout | Evidence confirms brown trout but does not separate a dependable lake-run adult migration for this product | None | Resident and lake-run components cannot be responsibly separated | E-001 | excluded from Pass 1 |

## 6. Regulations

| Authority/version | Reach/effective dates | Public reminder | Access/safety note | Recheck date | Evidence IDs | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Michigan FO-200.26 / 2026 guide | CR 600/Coates Highway to Manistee; effective 2026-04-01 | Type 3; open all year; no more than one rainbow trout; artificial lures Aug 1-Nov 15 | Check current rules and signs; reach labels do not grant private access or establish safe wading | 2027-03-31 | E-002 | accepted |

## 7. Source and capability audit

| Source/metric | IDs/location/reach | Live sample/unit/time/cadence | History/gaps/datum | Freshness/fault/recovery | Role: primary_scored/context_only/rejected | Evidence IDs | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| USGS field measurements, discharge/stage | 04125700 at Coates Highway | No live sample or transmission cadence | 36 discharge and 36 stage field measurements, 1958-1968; not daily | Cannot pass live freshness; fail closed | context_only | E-004 | exclude from live conditions and scoring |
| Measured water temperature | No accepted station | none | none | fail closed | rejected | E-004 | unavailable |
| Modeled weather | Coates coordinate | Provider-dependent modeled hourly weather | archive may support future replay | Pass 2 contract required | context_only | E-004 | no Pass 1 scoring |

| Capability | Decision and exact represented reach | Required calibration/artifact | Status |
| --- | --- | --- | --- |
| Gauge Read | No live Gauge Read; 04125700 may become clearly labeled archive context in Pass 2 | archive-card semantics and sparse-sample QA | unavailable in Pass 1 |
| Historical-only water temperature | No accepted measured archive configured | explicit unavailability test | unavailable |
| Fish Counts | No current official Bear Creek count feed found | explicit unavailability | unavailable |
| Fishing Shape | No live representative hydraulic source | explicit unavailability test | unavailable |
| Activity source pairing | No accepted model; weather-only remains a Pass 2 research option, not an assumption | fixed replay and stage/block digest | unavailable |

## 8. Spot Finder

**Decision:** `seasonal_orientation_only`

| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Manistee River near the Bear Creek confluence | Bear enters the Manistee below Tippy Dam | E-001, E-005 | Broad direction only; not a verified Manistee access recommendation | accepted seasonal direction |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | v1 | lower | upper | upper | upper | lower + upper | upper | upper | Spawner progression within legal corridor; no live-location claim |
| Coho | v1 | lower | upper | upper | upper | lower + upper | upper | upper | Later spawner progression with lower strength |
| Steelhead | v1 | lower | upper | upper | upper | lower + upper | lower + upper | lower + upper | Living entrants retain full-corridor holding context |

| Section ID/position | Foundation reaches | Boundary range | Eligible species | Fishing access IDs | Evidence IDs |
| --- | --- | --- | --- | --- | --- |
| `bear_creek_designated_corridor` | lower, upper | Manistee confluence to Coates Highway | Chinook, Coho, Steelhead | none in Pass 1 | E-002, E-003 |

| Access ID/name | Fishing access kinds | Detail/caution | Source URL/locator/label | Verified |
| --- | --- | --- | --- | --- |
| None configured | none | USFWS describes Coates Highway and River Road access context, but Pass 1 does not create navigation pins without parcel/site-level fishing verification | E-003 | no |

| Authoritative access source | Named entries found | Included | Excluded | Exclusion reasons/reconciliation |
| --- | ---: | ---: | ---: | --- |
| USFWS Bear River page and DNR status report | 2 broad access references | 0 | 2 | Broad recreation references are insufficient for verified fishing access, parking, and safe-entry claims |

## 9. Candidate species/run matrix

| Candidate run | Occurs | Recurring run | Dependable opportunity | Endpoint supported | Calibration quality | Contradictions | Decision/evidence IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fall Chinook | yes | yes, natural reproduction | moderate | yes | direct river presence, indirect adult calendar | none material | include / E-001, E-006 |
| Fall Coho | yes | yes, self-sustaining | modest | yes | direct river presence and juveniles; sparse adult record | none material | include conservatively / E-001 |
| Fall Steelhead entry | yes | yes, self-sustaining | moderate | yes | direct management record; fall calendar uses system comparator | spring fishery is separate, not contradictory | include / E-001, E-006 |
| Lake-run brown trout | possible mixed life histories | not separable | not established for this product | not needed | inadequate | DNR evidence does not distinguish dependable adult lake run | exclude / E-001 |

**Negative-search completion:** Current DNR fishery assessment, management direction, survey tables, regulations, USGS inventory, access material, and the receiving Manistee status report were checked. No current Bear Creek adult count feed, continuous gauge, measured-temperature series, creel survey, or evidence-bounded lake-run brown trout calendar was found.

## 10. Species/run records

### Run: Fall Chinook

**Capability decision:** `seasonal_only`

**Run/config/presence/Activity/Fishing Shape versions:** run v1; config `2026-09-18-bear-creek-manistee-pass1-v1`; presence v1; Activity unavailable; Fishing Shape unavailable.

**Code-to-packet reconciliation reviewer/date:** Automated exact-field test and Codex review, 2026-09-18.

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle | Chinook / fall spawn / fall cooling | E-001, E-007 | shared biology + river research | configuration validator | accepted |
| Primitive capabilities and legacy unavailable fields | Stage and Presence only | E-004 | Pass 1 contract | source-boundary test | accepted |
| Species endpoint/Seasonal Zone reaches/seasonalZonePlan/earlyApproach | Coates endpoint; lower/upper; Manistee approach | E-001, E-002, E-005 | river research | phase-plan validator | accepted |
| Presence maximum/distribution/curve/anchors | 6, sectional, eight anchors | E-001, E-006 | conservative calibration | exact-value test | accepted |
| Activity complete rule set | none | source audit | Pass 2 | unavailable-field validator | accepted unavailable |
| Fishing Shape/baseline/temperature policy | none | E-004 | source audit | unavailable-field validator | accepted unavailable |
| Research/source/audit fields | dossier path; public gate false | all | Pass 1 | hidden-registry test | accepted |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart | 08-10 | context begins | calibration | E-001, E-006 | conservative lead-in |
| stagingStart | 08-20 | receiving-system staging context | calibration | E-006 | no Bear daily counts |
| start | 09-01 | recurring entry begins | entry/calibration | E-001, E-006 | rounded early September |
| beginningEnd | 09-10 | early entry closes | calibration | E-006 | explicit interpolation |
| buildingEstablishedStart | 09-11 | established building begins | calibration | E-006 | explicit interpolation |
| buildingBroadStart (optional) | 09-16 | broader corridor context begins | calibration | E-001 | reach orientation only |
| peakStart | 09-20 | core window begins | spawn/calibration | E-001, E-006 | conservative |
| peak | 09-25 | modeled center | calibration | E-006 | no daily count claim |
| peakEnd | 10-10 | core window closes | spawn/calibration | E-001, E-006 | conservative |
| taperingEnd | 10-20 | late spawning tail | calibration | E-001 | modeled boundary |
| end | 11-05 | active model ends | calibration | E-006 | avoids prolonged false precision |
| lateEnd | 11-12 | residual copy tail | calibration | E-006 | low presence only |
| postRunLateCopyEnd | 11-19 | terminal copy ends | calibration | shared engine | presentation only |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
| 0 / 09-01 | 0.08 | first recurring entry context | E-001, E-006 |
| 9 / 09-10 | 0.25 | early building | E-006 |
| 19 / 09-20 | 0.70 | core window opens | E-001, E-006 |
| 24 / 09-25 | 1.00 | corridor-relative maximum | E-001, E-006 |
| 39 / 10-10 | 0.80 | late core | E-001 |
| 49 / 10-20 | 0.42 | taper | E-001 |
| 65 / 11-05 | 0.10 | ending | E-006 |
| 79 / 11-19 | 0.00 | presentation terminal | shared engine |

### Activity tuning and fixed replay

**Mode/input contract/source pairing/represented reach:** Unavailable; no accepted measured river input and no replayed weather-only contract.

**Fixed interval and coverage:** Not applicable in Pass 1.

**Missing hourly weather:** Unavailable with no score, blocks, or leader.

**Lifecycle/cap invariant result:** No Activity rule exists, so no mean score is calculated or displayed.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Beginning | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Building | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Peak | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Tapering | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Ending | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline | none | Do not invent scoring without calibration | no Activity score | none | Stage and Presence remain available | accepted unavailable |

### Run: Fall Coho

**Capability decision:** `seasonal_only`

**Run/config/presence/Activity/Fishing Shape versions:** run v1; config v1; presence v1; Activity unavailable; Fishing Shape unavailable.

**Code-to-packet reconciliation reviewer/date:** Automated exact-field test and Codex review, 2026-09-18.

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle | Coho / fall spawn / fall cooling | E-001, E-008 | shared biology + river research | configuration validator | accepted |
| Primitive capabilities and legacy unavailable fields | Stage and Presence only | E-004 | Pass 1 contract | source-boundary test | accepted |
| Species endpoint/Seasonal Zone reaches/seasonalZonePlan/earlyApproach | Coates endpoint; lower/upper; Manistee approach | E-001, E-002, E-005 | river research | phase-plan validator | accepted |
| Presence maximum/distribution/curve/anchors | 4, sectional, eight anchors | E-001 | conservative calibration | exact-value test | accepted |
| Activity complete rule set | none | source audit | Pass 2 | unavailable-field validator | accepted unavailable |
| Fishing Shape/baseline/temperature policy | none | E-004 | source audit | unavailable-field validator | accepted unavailable |
| Research/source/audit fields | dossier path; public gate false | all | Pass 1 | hidden-registry test | accepted |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart | 09-01 | context begins | calibration | E-001, E-008 | later than Chinook |
| stagingStart | 09-10 | approach context | calibration | E-008 | biology-bounded |
| start | 09-20 | recurring entry begins | entry/calibration | E-001, E-008 | conservative |
| beginningEnd | 09-30 | early phase ends | calibration | E-001 | rounded |
| buildingEstablishedStart | 10-01 | established building | calibration | E-001 | modeled |
| buildingBroadStart (optional) | 10-10 | broader corridor context | calibration | E-001 | reach orientation only |
| peakStart | 10-20 | core window begins | spawn/calibration | E-001, E-008 | later Coho window |
| peak | 10-25 | modeled center | calibration | E-001, E-008 | no daily count claim |
| peakEnd | 11-05 | core closes | spawn/calibration | E-001 | conservative |
| taperingEnd | 11-20 | late tail | calibration | E-008 | modeled |
| end | 12-05 | active model ends | calibration | E-008 | conservative late boundary |
| lateEnd | 12-15 | residual copy | calibration | E-008 | low presence |
| postRunLateCopyEnd | 12-22 | terminal copy ends | calibration | shared engine | presentation only |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
| 0 / 09-20 | 0.08 | first recurring context | E-001 |
| 10 / 09-30 | 0.22 | early building | E-001 |
| 30 / 10-20 | 0.65 | core opens | E-001, E-008 |
| 35 / 10-25 | 1.00 | corridor-relative maximum | E-001 |
| 46 / 11-05 | 0.82 | late core | E-001 |
| 61 / 11-20 | 0.45 | taper | E-008 |
| 76 / 12-05 | 0.10 | ending | E-008 |
| 93 / 12-22 | 0.00 | presentation terminal | shared engine |

### Activity tuning and fixed replay

**Mode/input contract/source pairing/represented reach:** Unavailable; no accepted measured river input and no replayed weather-only contract.

**Fixed interval and coverage:** Not applicable in Pass 1.

**Missing hourly weather:** Unavailable with no score, blocks, or leader.

**Lifecycle/cap invariant result:** No Activity rule exists, so no mean score is calculated or displayed.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Beginning | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Building | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Peak | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Tapering | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Ending | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline | none | Do not invent scoring without calibration | no Activity score | none | Stage and Presence remain available | accepted unavailable |

### Run: Fall Steelhead

**Capability decision:** `seasonal_only`

**Run/config/presence/Activity/Fishing Shape versions:** run v1; config v1; presence v1; Activity unavailable; Fishing Shape unavailable.

**Code-to-packet reconciliation reviewer/date:** Automated exact-field test and Codex review, 2026-09-18.

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle | Steelhead / fall entry / fall-entry cooling | E-001, E-006 | shared biology + river research | configuration validator | accepted |
| Primitive capabilities and legacy unavailable fields | Stage and Presence only | E-004 | Pass 1 contract | source-boundary test | accepted |
| Species endpoint/Seasonal Zone reaches/seasonalZonePlan/earlyApproach | Coates endpoint; living full-corridor tail | E-001, E-002, E-005 | river research | phase-plan validator | accepted |
| Presence maximum/distribution/curve/anchors | 5, broad, nine anchors | E-001, E-006 | conservative calibration | exact-value test | accepted |
| Activity complete rule set | none | source audit | Pass 2 | unavailable-field validator | accepted unavailable |
| Fishing Shape/baseline/temperature policy | none | E-004 | source audit | unavailable-field validator | accepted unavailable |
| Research/source/audit fields | dossier path; public gate false | all | Pass 1 | hidden-registry test | accepted |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart | 08-25 | context begins | calibration | E-001, E-006 | fall-entry lead-in |
| stagingStart | 09-05 | approach context | calibration | E-006 | no count claim |
| start | 09-15 | fall entry begins | entry/calibration | E-001, E-006 | conservative |
| beginningEnd | 09-30 | early entry ends | calibration | E-006 | rounded |
| buildingEstablishedStart | 10-01 | established fall entry | calibration | E-006 | modeled |
| buildingBroadStart (optional) | 10-15 | broader corridor | calibration | E-001 | orientation only |
| peakStart | 11-01 | core fall window | harvest/calibration | E-001, E-006 | system-supported |
| peak | 11-15 | modeled fall center | calibration | E-006 | no daily count claim |
| peakEnd | 11-30 | core closes | calibration | E-006 | living fish remain possible |
| taperingEnd | 12-15 | late fall taper | calibration | E-006 | model scope |
| end | 12-31 | fall-entry model ends | calibration | shared engine | not fish departure |
| lateEnd | 01-15 | holding-context tail | calibration | shared engine | terminal semantics explicit |
| postRunLateCopyEnd | 01-31 | copy ends | calibration | shared engine | presentation only |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
| 0 / 09-15 | 0.05 | first fall entry | E-001, E-006 |
| 15 / 09-30 | 0.20 | early entry | E-006 |
| 30 / 10-15 | 0.45 | established entry | E-006 |
| 47 / 11-01 | 0.72 | core opens | E-001, E-006 |
| 61 / 11-15 | 1.00 | corridor-relative maximum | E-001, E-006 |
| 76 / 11-30 | 0.86 | late core | E-006 |
| 91 / 12-15 | 0.65 | taper | E-006 |
| 107 / 12-31 | 0.50 | living-fish fall endpoint | shared biology |
| 138 / 01-31 | 0.00 | model terminal, not mortality | shared engine |

### Activity tuning and fixed replay

**Mode/input contract/source pairing/represented reach:** Unavailable; no accepted measured river input and no replayed weather-only contract.

**Fixed interval and coverage:** Not applicable in Pass 1.

**Missing hourly weather:** Unavailable with no score, blocks, or leader.

**Lifecycle/cap invariant result:** No Activity rule exists, so no mean score is calculated or displayed.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Beginning | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Building | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Peak | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Tapering | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |
| Ending | all blocks | 0 | 0 | — | — | — | — | — | — | unavailable | Pass 2 required |

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline | none | Do not invent scoring without calibration | no Activity score | none | Stage and Presence remain available | accepted unavailable |

## 11. Configuration reconciliation

| Config object/file | Dossier fields reconciled | Validator/replay/fixture result | Reviewer/date | Status |
| --- | --- | --- | --- | --- |
| `config/onboarding/bearRogue.ts` river profile | identity, corridor, source exclusions, regulation, reaches, locations | river validator passed | Codex / 2026-09-18 | passed |
| Three Bear run profiles | IDs, biology, dates, strength, anchors, capabilities, zones | run validators and exact locks passed | Codex / 2026-09-18 | passed |
| Bear configuration document | biology references and movement versions | revision validator passed | Codex / 2026-09-18 | passed |
| Hidden registry | owner-review inclusion and public-registry exclusion | isolation test passed | Codex / 2026-09-18 | passed |

| Client/catalog compatibility case | Expected catalog/snapshot | Verified result | Status |
| --- | --- | --- | --- |
| Compatible admin client | hidden server candidate available; no Pass 1 UI promise | registry route contains complete candidate | passed at config boundary |
| No-capability/incompatible admin client | unchanged public catalog | no public registry entry | passed |
| Ordinary user | authorized public catalog only | no public river or run entry | passed |
| Incompatible direct snapshot request | no public resolution | public lookup cannot find IDs | passed at registry boundary |

## 12. Acceptance and release record

### Owner-review digest

**Hidden/public state:** Hidden implementation is complete. No public catalog, client picker, deployment, or release change was made.

| Candidate/run | Decision | Exact Stage date ranges | Strength/distribution/confidence and comparators | Mean Activity by Stage/block | Replay interval/coverage | Terminal semantics |
| --- | --- | --- | --- | --- | --- | --- |
| Fall Chinook | include hidden | Beginning 09-01–09-10; Building 09-11–09-19; Peak 09-20–10-10; Tapering 10-11–10-20; Ending 10-21–11-05 | 6/10 sectional; direct natural reproduction, Manistee calendar comparator | unavailable in Pass 1 | none | post-run copy through 11-19; semelparous end does not equal live count |
| Fall Coho | include hidden | Beginning 09-20–09-30; Building 10-01–10-19; Peak 10-20–11-05; Tapering 11-06–11-20; Ending 11-21–12-05 | 4/10 sectional; direct self-sustaining evidence, sparse adult record | unavailable in Pass 1 | none | post-run copy through 12-22 |
| Fall Steelhead | include hidden | Beginning 09-15–09-30; Building 10-01–10-31; Peak 11-01–11-30; Tapering 12-01–12-15; Ending 12-16–12-31 | 5/10 broad; direct management evidence and Manistee comparator | unavailable in Pass 1 | none | fall model ends 12-31; living fish may hold afterward |

| Capability | Available metrics/source and represented reach | Scoring role | Completeness/QA | Important limitation or exclusion |
| --- | --- | --- | --- | --- |
| Gauge Read | none live; USGS 04125700 archive only | none | source inventory locked | 1958-1968 sparse measurements are not current or a robust daily normal |
| Historical-only water temperature | none | none | explicit unavailability | air temperature is not substituted |
| Fish Counts | none | none | explicit unavailability | no official current feed found |
| Fishing Shape | none | none | explicit unavailability | no representative live hydraulics |
| Spot Finder | seasonal lower/upper reach plan only | none | phase references validate | no access pins in Pass 1 |

| Gate | Artifact/command | Result | Reviewer/date | Notes |
| --- | --- | --- | --- | --- |
| Foundation/source/species truth | this dossier | passed | Codex / 2026-09-18 | three runs included, brown trout excluded |
| Activity full replay and controlled tests | Pass 2 | not part of this gate | Codex / 2026-09-18 | Activity deliberately unavailable |
| Fishing Shape replay/unavailability | source-boundary test | passed unavailable | Codex / 2026-09-18 | no gauge bands invented |
| Historical-only temperature context/unavailability | source-boundary test | passed unavailable | Codex / 2026-09-18 | no measured source |
| Fish Counts semantics/parser/isolation/unavailability | dossier audit | passed unavailable | Codex / 2026-09-18 | no feed configured |
| Seasonal Zone/Spot Finder alignment | run validator and phase tests | passed | Codex / 2026-09-18 | legal corridor only |
| Configuration and packet validation | onboarding QA + packet validator | passed | Codex / 2026-09-18 | hidden gate |
| Fixtures/copy/UI/visual/type QA | Pass 2 | not part of this gate | Codex / 2026-09-18 | no client changes |
| River-picker size/artwork coverage | Pass 2 | not part of this gate | Codex / 2026-09-18 | no public/client picker entry |
| Client capability/catalog compatibility | public-registry exclusion tests | passed | Codex / 2026-09-18 | hidden only |
| Rendered owner acceptance | owner action | not part of this gate | — | required before release |
| Public registry/config source/migrations | none | unchanged | Codex / 2026-09-18 | intentionally absent |
| Deployment/full production smoke | none | not authorized | — | no deployment |
| Atomic commit/remote parity/clean worktree | user handoff | not part of implementation | — | unrelated user files preserved |

## 13. Correction and learning ledger

| Finding | Root cause | Structured truth/config corrected | Full reruns | General safeguard | Reviewer/date |
| --- | --- | --- | --- | --- | --- |
| Coates station is not a live gauge | Station page can look like a normal monitoring location without series inspection | Empty hydraulic source list; historical site context only | validators and source-boundary tests | Require real series/cadence probes before configuring live metrics | Codex / 2026-09-18 |
| DNR describes a popular upstream reach outside the selected corridor | Fishery popularity and current legal/product boundary are different decisions | Product stops at current CR 600 Type 3 boundary | phase and endpoint tests | Legal corridor wins until separately researched expansion | Codex / 2026-09-18 |
| Brown trout evidence does not prove a lake-run product | Resident and migratory life histories were not separated | Brown trout excluded | candidate matrix review | Require adult migration timing and endpoint evidence per run | Codex / 2026-09-18 |

## 14. Pass 2 completion record (supersedes Pass 1 operational status)

Pass 1 sections above remain the historical decision record. This section records the completed Pass 2 implementation and is authoritative for current code status.

### Public/runtime contract

- Public river and configuration IDs are enabled locally; production deployment was not requested or performed.
- Stage and Seasonal Presence retain the independently calibrated Pass 1 dates and strengths.
- Activity is a Limited weather-only read using Open-Meteo hourly radiation, cloud cover, and precipitation at the Coates Highway anchor. It never infers creek flow, level, clarity, or water temperature.
- USGS 04125700 is displayed only as an archival discharge card: 36 approved field measurements across 10 sampled years from 1958–1968. The aggregate mean is 156.37 CFS (p25–p75 103.5–193.25 CFS). It is not a live reading, daily normal, or scoring input.
- Fishing Shape, Push, Migration Timing, measured water temperature, and Fish Counts remain explicitly unavailable because no accepted current source can support them.
- Spot Finder contains only the two primary access areas named by the federal Wild and Scenic River source: River Road and Coates Highway. It makes no public-frontage or safe-wading claim between them.
- River-picker artwork uses the existing audited `small` river asset.

### Fixed Activity replay

Replay interval: 2007–2025 inclusive. Coverage was 100% for all three runs; every copy, ceiling, lifecycle, geography, and missing-data invariant passed. Values below are daily Activity score means on the 0–100 Activity scale.

| Run | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run | Usable days | Artifact |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Fall Chinook | 70.39 | 70.32 | 74.83 | 76.18 | 72.74 | 55.98 | 43.00 | 1,615 | `docs/audits/river-run-bear-creek-manistee-chinook-weather-activity-replay.json` |
| Fall Coho | 68.06 | 70.47 | 77.74 | 79.65 | 72.83 | 57.68 | 41.67 | 1,843 | `docs/audits/river-run-bear-creek-manistee-coho-weather-activity-replay.json` |
| Fall Steelhead | 54.02 | 56.97 | 63.60 | 67.06 | 68.51 | 68.96 | 68.67 | 2,527 | `docs/audits/river-run-bear-creek-manistee-steelhead-weather-activity-replay.json` |

Bear Creek retains its original Activity v1 calibration. All scores remain Limited weather-only context, capped at 90, and do not infer creek hydraulics or temperature. Steelhead remains a living-fish fall-entry model, so favorable later-season weather may legitimately produce a higher late-stage mean than its calendar Peak without introducing salmon mortality semantics.

### Pass 2 verification and remaining boundary

The public configuration validates as a published packet. Automated coverage includes catalog membership, source isolation, historical-only metric semantics, run calendars and strengths, access-source metadata, Activity artifacts, and client rendering/type contracts. The remaining external action is production deployment, which requires a separate explicit request.
