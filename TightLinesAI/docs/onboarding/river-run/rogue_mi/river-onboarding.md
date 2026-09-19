# Rogue River (Michigan) River Run Onboarding Dossier

**River ID:** `rogue_mi`

**State:** `MI`

**Created:** 2026-09-18

**Status:** `pass2_public_implementation_complete`

**Target gate:** `implemented_not_deployed`

**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

**Foundation approval/version/date:** Research lock `rogue-mi-foundation-v1-draft`, 2026-09-18.

**Run-truth approval/version/date:** Independent Chinook, Coho, and fall-entry Steelhead reconciliation, 2026-09-18.

**Rendered owner acceptance/date:** User authorized full Pass 2 implementation on 2026-09-18; automated client and source-scope acceptance completed 2026-09-19.

**Deployment authorization/date:** Not granted; no deployment performed.

**Public enablement authorization/date:** Granted by the Pass 2 implementation request; added to the local public catalog on 2026-09-19. No deployment performed.

**Contradiction search completed by/date:** Codex, 2026-09-18; current DNR regulation, fishery, creel, assessment, natural-river, USGS, and EGLE sources reviewed.

**Independent falsification review by/date:** Executable source-scope, exact-calendar, and hidden-registry tests, 2026-09-18.

**Research cutoff and time-sensitive recheck triggers:** 2026-09-18. Recheck after 2027-03-31 regulations, gauge/parameter changes, Rockford Dam passage changes, new DNR creel/stocking assessments, access approval, or release request.

### Delivery contract

**Exact hidden-review river/run IDs:** `rogue_mi`; `rogue_mi_fall_chinook`, `rogue_mi_fall_coho`, `rogue_mi_fall_steelhead`.

**Activity contracts by run:** Unavailable in Pass 1. Rogue has accepted lower-reach hydraulics, but each species still needs a fixed replay and owner-reviewed model in Pass 2; gauge existence alone is not calibration.

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
| Admin/ordinary user, capability/no-capability verification | Registry isolation automated; rendered client verification belongs to Pass 2 |

| ID | Authority/title | URL/path | Published/updated | Event/data years | Page/table | Accessed | Facts supported | Geographic scope | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-001 | Michigan DNR, Natural Rivers — Rogue River | https://www.michigan.gov/dnr/managing-resources/fisheries/natural-rivers | Current agency page | Current summary | Rogue River section | 2026-09-18 | Correct name, Grand tributary, 234-square-mile drainage | Rogue watershed | Not a run calendar |
| E-002 | Michigan DNR, Better Fishing Waters | https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters | Current agency page | Current opportunity list | Rogue entries | 2026-09-18 | Brown, Chinook, Coho, and Steelhead below Rockford Dam; brown trout above | Corridor and endpoint | Qualitative opportunity, not abundance |
| E-003 | Michigan DNR, Spring Trout Fishing | https://www.michigan.gov/dnr/getoutdoors/trout | Current agency page | Current guidance | Steelhead section | 2026-09-18 | Recognized Steelhead opportunity downstream of Rockford Dam | Below-dam corridor | Spring emphasis does not set fall dates |
| E-004 | Michigan DNR, Inland Creel 2000-2006 Estimates | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel/Inland-Creel-2000-to-2006-Estimates.pdf | Agency archive | 2002-2004 Rogue surveys | Sites 502/503 monthly tables | 2026-09-18 | Rogue-specific monthly Chinook, Coho, and rainbow harvest/release observations | Rockford Dam to Grand, split at 10 Mile Road | Monthly bins and older surveys; not current counts or exact dates |
| E-005 | USGS, Rogue River near Rockford, 04118500 | https://waterdata.usgs.gov/monitoring-location/USGS-04118500/ | Current station record | 1952-1982; 1987-current | Station metadata/current series | 2026-09-18 | Current flow/gage height, location, drainage, long record | Packer Drive, 2.2 miles above mouth | Lower-reach source; no accepted live water temperature |
| E-006 | USGS Water Data Report, 04118500 | https://pubs.usgs.gov/wdr/2000/mi-00-1/report.pdf | 2000 | Water year 2000 plus station history | p. 121 | 2026-09-18 | Station 2.2 miles above mouth; Rockford Dam regulation about two miles upstream | Lower Rogue | Historic publication; current service controls live availability |
| E-007 | USGS NLDI/NHDPlus navigation from 04118500 | https://api.water.usgs.gov/nldi/linked-data/nwissite/USGS-04118500/navigation/DM/flowlines?distance=10 | Current service | NHDPlus geometry | Up/downstream flowlines | 2026-09-18 | Grand confluence, Rockford endpoint reconciliation, approx. 6.6 river miles | Configured corridor | Geometry is not fishing access or fish-position evidence |
| E-008 | Michigan DNR, Fisheries Order FO-200.26 | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Orders/Fish-Orders/FO_200.pdf | 2025/2026 | Effective 2026-04-01 | Type 4 stream and Type 4 rules | 2026-09-18 | Rogue to Grand classified Type 4 and current legal framework | Rogue River | Recheck current order before release |
| E-009 | Michigan DNR, Grand River Assessment | https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR020.pdf | 2001 | Historical system assessment | Rogue River discussion | 2026-09-18 | Below-dam Steelhead fishery and passage history | Grand/Rogue system | Older assessment; used as corroboration |
| E-010 | Michigan DNR, Rogue River Natural River Plan | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/NaturalRivers/Archive/Rogue_River_Plan.pdf | Archived plan | Historical | Fishery/access sections and map | 2026-09-18 | Watershed, trout designation, historical Steelhead arrival and access context | Rogue watershed | Old access facts are not used as current pins |
| E-011 | Michigan EGLE, Rogue River PFAS surface-water/foam results | https://www.michigan.gov/egle/-/media/Project/Websites/PFAS-Response/Watersheds/Foam/Results-2020-11-Surface-Water-Foam.pdf | 2020 | 2018-2019 | Rogue/Rockford rows | 2026-09-18 | Current Rockford Dam/impoundment identity and waterbody naming | Rockford area | Water-quality sampling does not set fish timing; include safety recheck before public access work |

## 2. Identity and corridor

| Field | Decision | Evidence IDs | Status |
| --- | --- | --- | --- |
| Official identity/aliases/exclusions | Rogue River, not “Rouge”; Grand River tributary in Kent/Newaygo counties | E-001, E-010 | accepted |
| Runtime region/schema fit | Michigan `great_lakes`; existing Chinook/Coho/Steelhead biology and fall engines | E-002, E-003 | accepted |
| Jurisdictions/presentation contexts | Michigan; configured fishery corridor is in Kent County below Rockford Dam | E-001, E-008 | accepted |
| Mouth/receiving water/timezone | Grand River confluence at 43.061178, -85.585854; America/Detroit | E-001, E-005, E-007 | accepted |
| Downstream/upstream product termini and length | Grand confluence upstream approximately 6.6 river miles to Rockford Dam | E-002, E-007 | accepted |
| Weather point and representation | Packer Drive gauge coordinate; modeled weather reserved for Pass 2 replay | E-005 | accepted |

## 3. Canonical reaches

| Reach ID | Public name | Downstream boundary | Upstream boundary | Order/role | Species access | Gauge represented | Evidence IDs |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `rogue_lower` | Lower Rogue | Grand confluence | Packer Drive | 1/lower | All three | yes | E-005, E-006, E-007 |
| `rogue_middle` | Middle Rogue | Packer Drive | 10 Mile Road | 2/middle | All three | no | E-004, E-005 |
| `rogue_upper_tailwater` | Rockford tailwater | 10 Mile Road | Rockford Dam | 3/terminal | All three | no | E-002, E-003, E-004 |

## 4. Barrier and passage inventory

| Barrier ID/name | Type/status/location | Operating/passage limits | Species passage | Product limit/closure | Verified | Evidence IDs | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `rogue_rockford_dam` / Rockford Dam | Active dam/impoundment at Rockford | Flow regulation; no accepted migratory passage above configured endpoint | Chinook, Coho, Steelhead corridor remains below dam | Hard upstream product endpoint | yes | E-002, E-006, E-007, E-011 | accepted |

## 5. Species endpoints and passage chains

| Species | Mouth-to-endpoint chain | Conservative endpoint | Physical endpoint vs opportunity distribution | Evidence IDs | Status |
| --- | --- | --- | --- | --- | --- |
| Chinook | Grand confluence → lower → middle → Rockford tailwater | Rockford Dam | Physical endpoint; 2002-2003 observations strongest in lower creel section | E-002, E-004 | accepted |
| Coho | Grand confluence → lower → middle → Rockford tailwater | Rockford Dam | Physical endpoint; confirmed but sparse observations imply concentrated opportunity | E-002, E-004 | accepted conservative |
| Steelhead | Grand confluence → lower → middle → Rockford tailwater | Rockford Dam | Physical endpoint; recurring fall and spring opportunity, but Pass 1 models fall entry only | E-003, E-004, E-009 | accepted |
| Lake-run brown trout | DNR lists brown trout both below and above dam without establishing a separate dependable lake-run calendar | None | Resident and migratory components are not separated for this product | E-002, E-009 | excluded from Pass 1 |

## 6. Regulations

| Authority/version | Reach/effective dates | Public reminder | Access/safety note | Recheck date | Evidence IDs | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Michigan FO-200.26 / 2026 guide | Rogue River downstream to Grand; effective 2026-04-01 | Type 4; consult current Type 4 seasons, size and possession rules | Reach names do not authorize private access, parking, methods, boating, or wading; heed current fish-consumption/water-contact advisories | 2027-03-31 | E-008, E-011 | accepted |

## 7. Source and capability audit

| Source/metric | IDs/location/reach | Live sample/unit/time/cadence | History/gaps/datum | Freshness/fault/recovery | Role: primary_scored/context_only/rejected | Evidence IDs | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| USGS discharge | 04118500, Packer Drive, lower reach | Current continuous CFS, near-real-time | about 69 years; historical gap 1982-1987; regulated | two-hour max age; fail closed on missing/stale | primary_scored for future lower-reach work; display source now | E-005, E-006 | accepted lower reach only |
| USGS gage height | same station/reach | Current continuous feet, near-real-time | station datum 624.80 ft in 2000 report | same freshness | display/context; never double-score with flow | E-005, E-006 | accepted display metric |
| Measured water temperature | no accepted current series at 04118500 | none | spot measurements do not constitute live series | fail closed | rejected | E-005, E-006 | unavailable |
| Modeled weather | Packer coordinate | provider-dependent hourly weather | archive supports future replay | Pass 2 contract required | context_only | E-005 | no Pass 1 scoring |

| Capability | Decision and exact represented reach | Required calibration/artifact | Status |
| --- | --- | --- | --- |
| Gauge Read | Flow and gage height from 04118500, lower Rogue only | existing freshness/trend/date-context provider QA | source accepted; public exposure deferred with river |
| Historical-only water temperature | No accepted configured record | explicit unavailability | unavailable |
| Fish Counts | No official current Rogue facility feed found | explicit unavailability | unavailable |
| Fishing Shape | Gauge exists, but Rogue-specific workability bands are not yet replayed | Pass 2 band calibration and replay | unavailable in Pass 1 |
| Activity source pairing | Candidate hydraulic-only or weather/hydraulic model must remain lower-reach scoped | Pass 2 fixed replay with stage/block means | unavailable in Pass 1 |

## 8. Spot Finder

**Decision:** `seasonal_orientation_only`

| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Grand River near the Rogue River confluence | Rogue is a major Grand tributary | E-001, E-007 | Grand rules/access are separate; broad direction is not an access recommendation | accepted seasonal direction |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | v1 | lower | middle | middle + tailwater | middle + tailwater | all three | middle + tailwater | tailwater | Monthly creel observations plus hard dam endpoint support progression, not exact fish location |
| Coho | v1 | lower | middle | middle + tailwater | middle + tailwater | all three | middle + tailwater | tailwater | Same physical chain, but independent later calendar and low strength |
| Steelhead | v1 | lower | middle | middle + tailwater | middle + tailwater | all three | all three | all three | Living fall entrants retain full-corridor holding context |

| Section ID/position | Foundation reaches | Boundary range | Eligible species | Fishing access IDs | Evidence IDs |
| --- | --- | --- | --- | --- | --- |
| `rogue_below_rockford` | lower, middle, tailwater | Grand confluence to Rockford Dam | Chinook, Coho, Steelhead | none in Pass 1 | E-002, E-004, E-007 |

| Access ID/name | Fishing access kinds | Detail/caution | Source URL/locator/label | Verified |
| --- | --- | --- | --- | --- |
| None configured | none | Older DNR access descriptions and park references do not independently verify present fishing access, parking, bank suitability, or water-contact advisories | E-010, E-011 | no |

| Authoritative access source | Named entries found | Included | Excluded | Exclusion reasons/reconciliation |
| --- | ---: | ---: | ---: | --- |
| DNR Natural River Plan / grant history / current fishery pages | Multiple broad park and historic access references | 0 | all | Pass 1 intentionally stops before access-facing implementation; current site-owner verification and safety review required |

## 9. Candidate species/run matrix

| Candidate run | Occurs | Recurring run | Dependable opportunity | Endpoint supported | Calibration quality | Contradictions | Decision/evidence IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fall Chinook | yes | yes | moderate-to-strong corridor opportunity | yes | direct monthly creel observations | no material contradiction | include / E-002, E-004 |
| Fall Coho | yes | yes but sparse | low | yes | direct but few monthly observations | low counts constrain, not negate | include at 2/10 / E-002, E-004 |
| Fall Steelhead entry | yes | yes | strong | yes | direct monthly fall creel plus agency fishery guidance | spring emphasis is a separate phase | include / E-003, E-004, E-009 |
| Lake-run brown trout | possible mixed life histories | not separated | not established for separate run | dam context known | inadequate | agency listing does not distinguish adult lake-run timing | exclude / E-002, E-009 |

**Negative-search completion:** Current DNR fishery pages, current regulations, historical Grand/Rogue assessment, Natural River Plan, creel archive, USGS parameter inventory, dam references, and fish-count possibilities were checked. No accepted live water-temperature series, current fish-count feed, Rogue-specific Fishing Shape bands, or separable lake-run brown trout calendar was found.

## 10. Species/run records

### Run: Fall Chinook

**Capability decision:** `seasonal_plus_lower_reach_gauge`

**Run/config/presence/Activity/Fishing Shape versions:** run v1; config `2026-09-18-rogue-mi-pass1-v1`; presence v1; Activity unavailable; Fishing Shape unavailable.

**Code-to-packet reconciliation reviewer/date:** Automated exact-field test and Codex review, 2026-09-18.

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle | Chinook / fall spawn / fall cooling | E-002, E-004 | shared biology + Rogue research | configuration validator | accepted |
| Primitive capabilities and legacy unavailable fields | Stage and Presence; lower Gauge source exists; scoring fields unavailable | E-005 | Pass 1 contract | source-scope test | accepted |
| Species endpoint/Seasonal Zone reaches/seasonalZonePlan/earlyApproach | Rockford Dam; three reaches; Grand approach | E-001, E-002, E-007 | river research | phase-plan validator | accepted |
| Presence maximum/distribution/curve/anchors | 6, sectional, eight anchors | E-004 | monthly-bin calibration | exact-value test | accepted |
| Activity complete rule set | none | calibration gate | Pass 2 | unavailable-field validator | accepted unavailable |
| Fishing Shape/baseline/temperature policy | none | E-005, E-006 | Pass 2 | unavailable-field validator | accepted unavailable |
| Research/source/audit fields | dossier path; public gate false | all | Pass 1 | hidden-registry test | accepted |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart | 08-15 | context begins | calibration | E-004 | before September observations |
| stagingStart | 08-25 | Grand approach context | calibration | E-004 | no fish-location claim |
| start | 09-01 | observed entry month begins | harvest/release | E-004 | first day of monthly evidence bin |
| beginningEnd | 09-15 | early entry ends | calibration | E-004 | within September bin |
| buildingEstablishedStart | 09-16 | established building | calibration | E-004 | within September bin |
| buildingBroadStart (optional) | 09-25 | broad building | calibration | E-004 | pre-October transition |
| peakStart | 10-01 | dominant month begins | harvest/release | E-004 | direct bin boundary |
| peak | 10-10 | modeled peak center | calibration | E-004 | October-dominant, not daily count |
| peakEnd | 10-31 | dominant month ends | harvest/release | E-004 | direct bin boundary |
| taperingEnd | 11-07 | early residual tail | calibration | E-004 | November catches sparse |
| end | 11-15 | active model ends | calibration | E-004 | conservative residual boundary |
| lateEnd | 11-22 | low late copy | calibration | E-004 | presentation tail |
| postRunLateCopyEnd | 11-29 | terminal copy ends | calibration | shared engine | presentation only |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
| 0 / 09-01 | 0.08 | first observed month | E-004 |
| 14 / 09-15 | 0.28 | early build | E-004 |
| 30 / 10-01 | 0.78 | dominant month starts | E-004 |
| 39 / 10-10 | 1.00 | corridor-relative modeled maximum | E-004 |
| 60 / 10-31 | 0.60 | October closes | E-004 |
| 68 / 11-08 | 0.25 | residual November context | E-004 |
| 75 / 11-15 | 0.08 | ending | E-004 |
| 89 / 11-29 | 0.00 | presentation terminal | shared engine |

### Activity tuning and fixed replay

**Mode/input contract/source pairing/represented reach:** Unavailable. USGS flow is accepted for the lower reach, but no species-specific Activity rule has passed replay.

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
| Baseline | none | Gauge availability is not model calibration | no Activity score | none | Gauge remains display-only; Stage/Presence available | accepted unavailable |

### Run: Fall Coho

**Capability decision:** `seasonal_plus_lower_reach_gauge`

**Run/config/presence/Activity/Fishing Shape versions:** run v1; config v1; presence v1; Activity unavailable; Fishing Shape unavailable.

**Code-to-packet reconciliation reviewer/date:** Automated exact-field test and Codex review, 2026-09-18.

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle | Coho / fall spawn / fall cooling | E-002, E-004 | shared biology + Rogue research | configuration validator | accepted |
| Primitive capabilities and legacy unavailable fields | Stage and Presence; lower Gauge source exists; scoring fields unavailable | E-005 | Pass 1 contract | source-scope test | accepted |
| Species endpoint/Seasonal Zone reaches/seasonalZonePlan/earlyApproach | Rockford Dam; three reaches; Grand approach | E-001, E-002, E-007 | river research | phase-plan validator | accepted |
| Presence maximum/distribution/curve/anchors | 2, concentrated, eight anchors | E-004 | sparse-observation calibration | exact-value test | accepted |
| Activity complete rule set | none | calibration gate | Pass 2 | unavailable-field validator | accepted unavailable |
| Fishing Shape/baseline/temperature policy | none | E-005, E-006 | Pass 2 | unavailable-field validator | accepted unavailable |
| Research/source/audit fields | dossier path; public gate false | all | Pass 1 | hidden-registry test | accepted |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart | 09-01 | context begins | calibration | E-004 | low-confidence lead-in |
| stagingStart | 09-15 | Grand approach context | calibration | E-004 | no access claim |
| start | 10-01 | observed opportunity month begins | release | E-004 | direct October bin |
| beginningEnd | 10-10 | early opportunity ends | calibration | E-004 | sparse-data interpolation |
| buildingEstablishedStart | 10-11 | established building | calibration | E-004 | explicit interpolation |
| buildingBroadStart (optional) | 10-20 | broader corridor | calibration | E-002, E-004 | orientation only |
| peakStart | 10-25 | core transition | calibration | E-004 | October/November bridge |
| peak | 11-01 | modeled center | calibration | E-004 | low ceiling acknowledges sparse data |
| peakEnd | 11-10 | core closes | calibration | E-004 | conservative |
| taperingEnd | 11-20 | tail | calibration | E-004 | modeled |
| end | 11-30 | active model ends | calibration | E-004 | month boundary |
| lateEnd | 12-10 | residual copy | calibration | shared biology | low presence only |
| postRunLateCopyEnd | 12-17 | terminal copy ends | calibration | shared engine | presentation only |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
| 0 / 10-01 | 0.08 | first direct monthly context | E-004 |
| 9 / 10-10 | 0.28 | early build | E-004 |
| 24 / 10-25 | 0.75 | core transition | E-004 |
| 31 / 11-01 | 1.00 | low corridor-relative maximum | E-004 |
| 40 / 11-10 | 0.70 | late core | E-004 |
| 50 / 11-20 | 0.35 | taper | E-004 |
| 60 / 11-30 | 0.08 | ending | E-004 |
| 77 / 12-17 | 0.00 | presentation terminal | shared engine |

### Activity tuning and fixed replay

**Mode/input contract/source pairing/represented reach:** Unavailable. Sparse Coho evidence particularly argues against borrowing Chinook Activity calibration.

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
| Baseline | none | Do not copy Chinook calibration to a sparse Coho run | no Activity score | none | Independent Stage/Presence remain available | accepted unavailable |

### Run: Fall Steelhead

**Capability decision:** `seasonal_plus_lower_reach_gauge`

**Run/config/presence/Activity/Fishing Shape versions:** run v1; config v1; presence v1; Activity unavailable; Fishing Shape unavailable.

**Code-to-packet reconciliation reviewer/date:** Automated exact-field test and Codex review, 2026-09-18.

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle | Steelhead / fall entry / fall-entry cooling | E-003, E-004, E-009 | shared biology + Rogue research | configuration validator | accepted |
| Primitive capabilities and legacy unavailable fields | Stage and Presence; lower Gauge source exists; scoring fields unavailable | E-005 | Pass 1 contract | source-scope test | accepted |
| Species endpoint/Seasonal Zone reaches/seasonalZonePlan/earlyApproach | Rockford Dam; living full-corridor tail | E-003, E-007, E-009 | river research | phase-plan validator | accepted |
| Presence maximum/distribution/curve/anchors | 7, broad, nine anchors | E-003, E-004, E-009 | fall-entry calibration | exact-value test | accepted |
| Activity complete rule set | none | calibration gate | Pass 2 | unavailable-field validator | accepted unavailable |
| Fishing Shape/baseline/temperature policy | none | E-005, E-006 | Pass 2 | unavailable-field validator | accepted unavailable |
| Research/source/audit fields | dossier path; public gate false | all | Pass 1 | hidden-registry test | accepted |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart | 08-15 | context begins | calibration | E-004 | precedes September observations |
| stagingStart | 08-25 | Grand approach context | calibration | E-004 | no fish-location claim |
| start | 09-01 | observed fall-entry month begins | harvest/release | E-004 | direct monthly bin |
| beginningEnd | 09-15 | early entry ends | calibration | E-004 | within September bin |
| buildingEstablishedStart | 09-16 | established entry | calibration | E-004 | explicit interpolation |
| buildingBroadStart (optional) | 10-01 | broader fall presence | harvest/release | E-004 | direct October boundary |
| peakStart | 10-20 | core fall window begins | calibration | E-004 | rising toward November |
| peak | 11-15 | modeled fall center | harvest/release/calibration | E-004 | November strongest in 2002-2003 observations |
| peakEnd | 11-30 | core month ends | harvest/release | E-004 | direct month boundary |
| taperingEnd | 12-15 | late fall taper | calibration | shared biology | model scope |
| end | 12-31 | fall-entry model ends | calibration | shared engine | not fish departure |
| lateEnd | 01-15 | holding-context tail | calibration | shared biology | living fish may remain |
| postRunLateCopyEnd | 01-31 | copy ends | calibration | shared engine | presentation only |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
| 0 / 09-01 | 0.08 | first observed month | E-004 |
| 14 / 09-15 | 0.22 | early entry | E-004 |
| 30 / 10-01 | 0.48 | October build | E-004 |
| 49 / 10-20 | 0.72 | core opens | E-004 |
| 75 / 11-15 | 1.00 | corridor-relative fall maximum | E-003, E-004 |
| 90 / 11-30 | 0.90 | late core | E-004 |
| 105 / 12-15 | 0.72 | taper | shared biology |
| 121 / 12-31 | 0.58 | fall model endpoint | shared biology |
| 152 / 01-31 | 0.00 | model terminal, not mortality or departure | shared engine |

### Activity tuning and fixed replay

**Mode/input contract/source pairing/represented reach:** Unavailable. Lower-reach flow is accepted, but a Steelhead feeding-response model and hydraulic thresholds require independent replay.

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
| Baseline | none | Do not copy salmon or Grand River response tuning | no Activity score | none | Independent Stage/Presence and Gauge remain available | accepted unavailable |

## 11. Configuration reconciliation

| Config object/file | Dossier fields reconciled | Validator/replay/fixture result | Reviewer/date | Status |
| --- | --- | --- | --- | --- |
| `config/onboarding/bearRogue.ts` Rogue profile | identity, corridor, gauge scope, regulations, reaches, barrier | river validator passed | Codex / 2026-09-18 | passed |
| Three Rogue run profiles | IDs, biology, calendars, strengths, anchors, capabilities, zones | run validators and exact locks passed | Codex / 2026-09-18 | passed |
| Rogue configuration document | biology references and movement versions | revision validator passed | Codex / 2026-09-18 | passed |
| Hidden registry | owner-review inclusion and public-registry exclusion | isolation test passed | Codex / 2026-09-18 | passed |

| Client/catalog compatibility case | Expected catalog/snapshot | Verified result | Status |
| --- | --- | --- | --- |
| Compatible admin client | hidden server candidate available; no Pass 1 UI promise | registry contains complete candidate | passed at config boundary |
| No-capability/incompatible admin client | unchanged public catalog | no public registry entry | passed |
| Ordinary user | authorized public catalog only | no public river or run entry | passed |
| Incompatible direct snapshot request | no public resolution | public lookup cannot find IDs | passed at registry boundary |

## 12. Acceptance and release record

### Owner-review digest

**Hidden/public state:** Hidden implementation is complete. No public catalog, client picker, deployment, or release change was made.

| Candidate/run | Decision | Exact Stage date ranges | Strength/distribution/confidence and comparators | Mean Activity by Stage/block | Replay interval/coverage | Terminal semantics |
| --- | --- | --- | --- | --- | --- | --- |
| Fall Chinook | include hidden | Beginning 09-01–09-15; Building 09-16–09-30; Peak 10-01–10-31; Tapering 11-01–11-07; Ending 11-08–11-15 | 6/10 sectional; direct 2002-2003 Rogue creel observations | unavailable in Pass 1 | none | copy through 11-29; no live abundance claim |
| Fall Coho | include hidden | Beginning 10-01–10-10; Building 10-11–10-24; Peak 10-25–11-10; Tapering 11-11–11-20; Ending 11-21–11-30 | 2/10 concentrated; confirmed but sparse observations | unavailable in Pass 1 | none | copy through 12-17 |
| Fall Steelhead | include hidden | Beginning 09-01–09-15; Building 09-16–10-19; Peak 10-20–11-30; Tapering 12-01–12-15; Ending 12-16–12-31 | 7/10 broad; agency-recognized fishery plus direct fall creel | unavailable in Pass 1 | none | fall model ends 12-31; living fish may remain |

| Capability | Available metrics/source and represented reach | Scoring role | Completeness/QA | Important limitation or exclusion |
| --- | --- | --- | --- | --- |
| Gauge Read | flow CFS and gage height ft, USGS 04118500, lower Rogue | unscored display; future calibration input | source/metric/reach locks tested | does not represent full corridor or temperature |
| Historical-only water temperature | none | none | explicit unavailability | spot measurements are not a continuous accepted baseline |
| Fish Counts | none | none | explicit unavailability | no facility feed found |
| Fishing Shape | none in Pass 1 | none | explicit unavailability | gauge alone does not establish workability bands |
| Spot Finder | three seasonal reaches only | none | phase references validate | no access pins in Pass 1 |

| Gate | Artifact/command | Result | Reviewer/date | Notes |
| --- | --- | --- | --- | --- |
| Foundation/source/species truth | this dossier | passed | Codex / 2026-09-18 | three runs included, brown trout excluded |
| Activity full replay and controlled tests | Pass 2 | not part of this gate | Codex / 2026-09-18 | Activity deliberately unavailable |
| Fishing Shape replay/unavailability | source-scope test | passed unavailable | Codex / 2026-09-18 | no bands invented |
| Historical-only temperature context/unavailability | source-scope test | passed unavailable | Codex / 2026-09-18 | no accepted series |
| Fish Counts semantics/parser/isolation/unavailability | dossier audit | passed unavailable | Codex / 2026-09-18 | no feed configured |
| Seasonal Zone/Spot Finder alignment | run validator and phase tests | passed | Codex / 2026-09-18 | dam-bounded corridor |
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
| Owner shorthand “Rouge” referred to Rogue River | Similar spelling and nearby Grand Rapids context | Canonical display/ID use Rogue; aliases not promoted | identity tests | Resolve official agency waterbody name before IDs | Codex / 2026-09-18 |
| Live flow does not imply live temperature or whole-river representation | Station UI exposes multiple metadata classes | Only flow/height accepted; `rogue_lower` alone marked represented | source-scope tests | Lock every metric and reach independently | Codex / 2026-09-18 |
| Coho occurs but is much weaker than Chinook | Qualitative agency lists alone hide strength differences | Independent 2/10 concentrated Coho curve | exact-value tests | Use river-specific creel/count evidence for strength | Codex / 2026-09-18 |
| Historic access descriptions are not current navigation facts | Old Natural River Plan and grants persist online | No access pins in Pass 1 | configuration review | Require current site-owner fishing/access verification | Codex / 2026-09-18 |

## 14. Pass 2 completion record (supersedes Pass 1 operational status)

Pass 1 sections above remain the historical decision record. This section records the completed Pass 2 implementation and is authoritative for current code status.

### Public/runtime contract

- Public river and configuration IDs are enabled locally; production deployment was not requested or performed.
- Stage and Seasonal Presence retain the independently calibrated Pass 1 dates and strengths.
- Gauge Read uses current USGS 04118500 flow and gage height at Packer Drive. Every display and scoring statement remains restricted to the lower Rogue; no water temperature is configured.
- Activity is a Limited observed-river read using 60% measured discharge response, 30% effective light, and 10% same-block precipitation. It has zero water-temperature weight and cannot infer clarity, passage, abundance, catch probability, access, or conditions in the middle or Rockford tailwater reaches.
- Fishing Shape uses the fixed 2019–2025 Aug. 1–Jan. 15 discharge distribution: too low below 107 CFS, low-fishable 107–133, ideal 133–225, high-fishable 225–359.5, intentionally very high 359.5–446.25, and blown out at 446.25 CFS or above. These are lower-reach presentation bands, not safety limits.
- Hydraulic Push uses paired positive-rise thresholds of 12 CFS/7%, 32 CFS/16%, and 63 CFS/33%. It is lower-confidence, capped at level 2, and cannot be triggered by temperature, precipitation, or wind.
- Migration Timing, measured water temperature, and Fish Counts remain explicitly unavailable.
- Spot Finder includes only current government-published access: Grand Rogue Park, Rogue River Park, and Richardson-Sowerby Park. Dam exclusions, posted hours, flooding, launch status, and private frontage remain fail-closed cautions.
- River-picker artwork uses the existing audited `medium` river asset.

### Fixed Activity replay

Replay interval: 2019–2025 inclusive. Coverage was 100% for all three runs; every copy, source-scope, cap, lifecycle, and missing-data invariant passed. Values below are daily Activity score means on the 0–100 Activity scale.

| Run | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run | Usable days | Artifact |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Fall Chinook | 43.29 | 43.58 | 51.52 | 56.55 | 47.47 | 39.14 | 32.06 | 630 | `docs/audits/river-run-rogue-mi-chinook-activity-replay.json` |
| Fall Coho | 44.33 | 39.66 | 54.86 | 56.79 | 51.97 | 39.53 | 30.63 | 609 | `docs/audits/river-run-rogue-mi-coho-activity-replay.json` |
| Fall Steelhead | 41.94 | 45.07 | 52.74 | 59.33 | 54.76 | 61.77 | 54.04 | 1,008 | `docs/audits/river-run-rogue-mi-steelhead-activity-replay.json` |

Activity v2 records the owner-requested Rogue River recalibration. Chinook receives a bounded four-point Building response and six points from Peak through the continuously declining salmon lifecycle. Coho receives the same response while retaining its prior one-point Peak shape correction. Steelhead receives four points in Building, seven at Peak, and five through its living-fish tail. No source, weight, hydraulic threshold, cap, or presence date changed. All scores remain Limited and lower-reach scoped, and the existing Limited-confidence rule keeps positively adjusted blocks at 69 or below. Steelhead's higher ending mean reflects observed Packer Drive discharge/weather combinations and is not treated as salmon mortality or abundance.

### Pass 2 verification and remaining boundary

The public configuration validates as a published packet. Automated coverage includes catalog membership, live gauge reach scope, fishability and Push thresholds, run calendars and strengths, access-source metadata, Activity artifacts, and client rendering/type contracts. The remaining external action is production deployment, which requires a separate explicit request.
