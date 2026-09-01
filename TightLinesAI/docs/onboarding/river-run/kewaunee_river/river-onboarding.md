# Kewaunee River Run Onboarding Dossier

**River ID:** `kewaunee_river`
**State:** `WI`
**Created/research cutoff:** 2026-09-01
**Status:** `owner_review_ready`
**Target gate:** `owner_review_ready`
**Guide:** `docs/river_run_onboarding.md`
**Public state:** hidden draft; `publicAudit.isEnabled=false`; deployed behind the protected admin-review gate; no public release or enablement authorized.

## 1. Decisions and evidence ledger

Foundation and run truth were reconciled by Codex on 2026-09-01. Protected owner-review deployment was authorized and completed; rendered owner acceptance and public enablement remain intentionally not granted. Contradiction/falsification searches covered current regulations, access/wildlife-area maps, facility operations and weekly reporting, annual weir reports, stocking, fishery outreach, and USGS metadata/data. Recheck facility operations/count page, current rules, access, stocking, and gauge status immediately before release.

**Contradiction search completed by/date:** Codex / 2026-09-01
**Independent falsification review by/date:** Codex, second source-and-code pass / 2026-09-01

| ID | Authority/title | URL/path | Date/data | Facts supported | Limitations |
| --- | --- | --- | --- | --- | --- |
| E-101 | Wisconsin DNR, Besadny facility | https://dnr.wisconsin.gov/topic/Fishing/hatcheries/cdbesadny | accessed 2026-09-01 | spring steelhead; Chinook mid-Sep-mid-Nov; coho mid-Sep-late Oct; Seeforellen mid-Oct-late Dec | Facility calendar, not first-entry census |
| E-102 | Wisconsin DNR, Besadny report | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/BesadnyFacilityReport | 2026-04-28 current page | Tuesday cadence; Total Captured schema; spring ladder closed/resumes early Oct; transferred Browns | Current page is spring/out of fall season |
| E-103 | Wisconsin DNR, 2024 Lake Michigan Weir Report | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf | 2024, pp. 82-86 | BAFF operations, 624 Chinook, 788 coho, 279 steelhead, 456 Browns; 396 Browns passed | Operational samples; Brown total includes transfers |
| E-104 | Wisconsin DNR, Kewaunee River Access Sites | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_KewauneeRiverAccess.pdf | accessed 2026-09-01 | all seven named access markers and downstream/upstream order | Map markers do not make intervening frontage public |
| E-105 | Wisconsin DNR, C.D. Besadny Wildlife Area | https://dnr.wisconsin.gov/topic/Lands/WildlifeAreas/cdbesadny.html | accessed 2026-09-01 | migratory salmonid fishery, facility, fishing/parking | Posted restrictions control |
| E-106 | Wisconsin DNR 2026-27 fishing regulations | https://dnr.wisconsin.gov/topic/fishing/regulations | 2026-27 PDF | Kewaunee tributary classification, night/hook restrictions, stamp/bag/size, generic weir/refuge rules | Recheck at release |
| E-107 | USGS 04085200 | https://waterdata.usgs.gov/monitoring-location/USGS-04085200/ | live 2026-09-01; flow 1964-2026 | County F location, drainage, flow/temp availability | Provisional; possible 2026-10-01 discontinuation |
| E-108 | Wisconsin DNR, 2025 stocking summary | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf | 2019-2024 tables | recurring Kewaunee salmonid stocking; no direct Skamania after 2019 | Stocking is not adult returns |
| E-109 | Wisconsin DNR fishing report/outreach | https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport | accessed 2026-09-01 | Browns enter tributaries Oct-winter; multi-river brood collection | Regional context; exposes count contamination |
| E-110 | Generated audits | `docs/audits/river-run-kewaunee-river-*-weather-activity-replay.json` | 2007-2025 | complete Activity distributions, stratified review rows, and invariants | Mechanical validation, not catch rates |
| E-111 | Kewaunee County Tourism, Bruemmer Park River Trail | https://www.visitkewauneecounty.com/explore/parks-and-trails/bruemmer-park-trail/ | accessed 2026-09-01 | public south-side river fishing access; north-of-County-F fish refuge | County page; posted refuge boundary controls |
| E-112 | City of Kewaunee, Marina and launch | https://cityofkewauneewi.gov/departments/marina/ | accessed 2026-09-01 | city-operated launch and current daily/annual launch-pass access | Marina slips/campground are not blanket shore access |
| E-113 | City of Kewaunee Comprehensive Outdoor Recreation Plan 2025–2029 | https://cityofkewauneewi.gov/wp-content/uploads/2025/08/2025.08.11-City-Council-Agenda-Packet-1.pdf | accessed 2026-09-01 | city ownership; Harbor Park fishing/boardwalk; Harbor Point Park boardwalk and four fishing piers | Council-packet draft plan; posted city and harbor rules control |

## 2. Identity and corridor

The Kewaunee River is a Wisconsin Lake Michigan tributary in the `great_lakes` runtime region and `America/Chicago` timezone. The full orientation corridor runs from Kewaunee harbor to the third Highway C bridge marker on the official access map, about 16 miles. Chinook and coho stop below the operated Besadny structure; lake-run Browns may use the audited upper reach because DNR documents passage. Little Scarboro, Scarboro, Roger, and Casco creeks are not silently included.

## 3. Canonical reaches

| Reach ID | Public range | Role/species | Gauge | Evidence |
| --- | --- | --- | --- | --- |
| `kewaunee_lower_river` | harbor to first Highway C crossing | downstream; all three | no | E-104 |
| `kewaunee_besadny_reach` | first Highway C to Besadny facility | middle; all three | USGS 04085200 context | E-101–E-104, E-107 |
| `kewaunee_upper_access` | facility to third Highway C crossing | terminal; Brown only | no | E-103, E-104 |

## 4. Barrier and passage inventory

Besadny is an operated fishway/weir and egg-collection facility. Chinook and coho product geography ends below the structure; zero passed upstream in the 2024 report. DNR documented 396 Browns passed, supporting Brown orientation above it. Facility counts never prove whole-river abundance or current fish location.

From Sept. 15-Dec. 31, fishing is prohibited one-half hour after sunset to one-half hour before sunrise; related Jan-first-Saturday-in-May tributary restrictions and the 1/2-inch hook-gap rule apply. A Great Lakes stamp, current trout/salmon size/bag rules, and posted 500-foot weir/refuge or fishway boundaries must be checked. The product never turns an access marker into blanket property permission.

## 5. Species endpoints and passage chains

| Species | Passage chain | Endpoint | Decision |
| --- | --- | --- | --- |
| Chinook | harbor → Lower River → Besadny Reach | downstream face of operated facility | supported |
| Coho | harbor → Lower River → Besadny Reach | downstream face of operated facility | supported |
| Lake-run Brown | harbor → Lower → Besadny → documented Upper Access | third Highway C marker | supported repeat spawner |
| Steelhead | current documented facility chain is spring; fall occurrence overlaps | no independently calibrated fall endpoint | unsupported as fall product |

## 6. Regulations

The night and hook restrictions, Great Lakes stamp, trout/salmon bag and size limits, posted 500-foot weir/refuge boundaries, fishway rules, property access, and current emergency notices are configured from E-106 and must be rechecked before release.

## 7. Source and capability audit

| Capability/source | Decision | QA/limitation |
| --- | --- | --- |
| Gauge Read: USGS 04085200 | available flow and measured temp; 2026-09-01 sample 20.6 cfs and 23.7°C | County F/Besadny reach only; temp starts 2026; gage-height 00065 omitted after Aug. 10 staleness |
| Historical temperature | unavailable | one partial 2026 season cannot meet multi-year minimum; no surrogate |
| Fish Counts | available for Chinook/coho only | weekly in-season page, 240-hour freshness, Total Captured only, cache bypass, blank→not_reported, parser failure→unavailable; Brown excluded due multi-river transfers |
| Fishing Shape | available near County F | 2019-2025 Aug. 1-Jan. 15; 1,160 valid daily means after removing one USGS missing sentinel; p10 14.3, p25 21.9, p75 55, p90 165, p95 278 cfs |
| Activity | available, Limited weather-only | 2007-2025; flow/temp excluded because temp cannot support multi-season replay |
| Migration Timing / Push | unavailable | no accepted historical temperature/combined model; no confirmed-movement claim |

Fishing Shape: too low ≤14.3; low 14.3-21.9; ideal 21.9-55; high-fishable 55-165; very-high transition 165-278; blown out ≥278 cfs. It is not clarity, safety, passage, or abundance.

Fish Counts observation semantics are `trap_recovery`, season-to-date and preliminary. The parser selects the report heading date, species header, and `Total Captured` row only; it does not add Passed Upstream, Females Spawned, Egg Take, or Held in Ponds. Current spring-page salmon blanks correctly return `not_reported`, not zero.

## 8. Spot Finder

Early approach is Lake Michigan off Kewaunee, Kewaunee harbor, and the river mouth; separate lake/harbor rules apply.

| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Lake Michigan off Kewaunee, harbor, and river mouth | receiving lake/harbor feeding the lower river | E-104, E-106 | lake/harbor rules and access are separate | approach before migration; Lower River at Beginning |

Chinook/coho: Beginning=`lower`; Building early/established/broad=`besadny`; Peak=`lower,besadny`; Tapering/Ending=`besadny`. Brown: Beginning=`lower`; Building early/established=`besadny`; Building broad=`besadny,upper`; Peak=all; Tapering/Ending=`besadny,upper`. Versions are `<runId>-seasonal-zone-v3-2026-09-01`.

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | `kewaunee_river_fall_chinook-seasonal-zone-v3-2026-09-01` | lower | Besadny | Besadny | Besadny | lower+Besadny | Besadny | Besadny |
| Coho | `kewaunee_river_fall_coho-seasonal-zone-v3-2026-09-01` | lower | Besadny | Besadny | Besadny | lower+Besadny | Besadny | Besadny |
| Brown | `kewaunee_river_fall_brown_trout-seasonal-zone-v3-2026-09-01` | lower | Besadny | Besadny | Besadny+upper | all | Besadny+upper | Besadny+upper |

| Section | Official access entries included | Species |
| --- | --- | --- |
| Lower | Harbor Park; Harbor Point Park; Kewaunee Landing; 1st Highway C Bridge crossing | all three; launch and harbor limitations retained |
| Middle | Highway C Boat Launch; Bruemmer Park River Trail; C.D. Besadny Anadromous Fish Facility | all three, with refuge/facility warnings |
| Upper | 2nd Highway C Bridge crossing; Highway E Boat Launch; Clyde Hill Bridge; 3rd Highway C Bridge crossing | Brown only |

E-104 names 7 DNR markers; all 7 are included. E-111–E-113 add four separately documented public city/county accesses that the DNR map omits. The reconciled inventory contains 11 entries, excludes the closed Marshlands Walk and proposed/redevelopment-only sites, and invents no coordinates. Bridge entries carry the DNR map's property-boundary limitation; Bruemmer carries the explicit north-side refuge closure.

## 9. Candidate species/run matrix

| Candidate | Decision | Evidence-based reason |
| --- | --- | --- |
| Fall Chinook | supported, 8/10 sectional | long facility series, recurring stocking, explicit mid-Sep-mid-Nov calendar |
| Fall coho | supported, 8/10 sectional | direct recurring counts/stocking, explicit mid-Sep-late-Oct calendar |
| Fall lake-run Brown | supported, 7/10 sectional | direct collection/stocking, mid-Oct-late-Dec calendar, documented passage |
| Fall steelhead | unsupported as independent product | fall 2024 occurrence exists, but current facility calendar is spring and direct Kewaunee Skamania stocking stops after 2019; insufficient current recurring fall calibration |
| Spring steelhead | occurs/recurs | outside requested fall River Run pass | explicit Mar-early-May facility season; requires its own future run model |
| Lake trout | unsupported | lake fishery, not calibrated Kewaunee river migration |
| Brook trout/lake sturgeon | unsupported | tributary/inland or restoration context does not establish requested fall salmonid product |

Negative search included E-101–E-109, historical strain reports, current rules, stocking, and facility/weir documents. Unsupported is not biological absence.

## 10. Species/run records

| Field | Chinook | Coho | Lake-run Brown |
| --- | --- | --- | --- |
| Run ID | `kewaunee_river_fall_chinook` | `kewaunee_river_fall_coho` | `kewaunee_river_fall_brown_trout` |
| Biology/engine | `great_lakes_chinook_v1` / `fall_cooling` | `great_lakes_coho_v1` / `fall_cooling` | `great_lakes_lake_run_brown_trout_v1` / `fall_repeat_spawner_cooling` |
| Exact boundaries | pre 08-15; staging 08-25; start 09-10; beginning end 09-20; established 09-21; broad 09-28; peak 10-01/10-10/10-20; taper 11-02; end 11-10; late 11-20; post 11-30 | pre 08-25; staging 09-05; start 09-15; beginning end 09-25; established 09-26; broad 10-01; peak 10-05/10-15/10-25; taper 11-02; end 11-08; late 11-15; post 11-20 | pre 09-15; staging 10-01; start 10-15; beginning end 10-25; established 10-26; broad 11-01; peak 11-10/11-25/12-05; taper 12-15; end 12-22; late 12-31; post 01-15 |
| Presence | 8 sectional; offsets 0/.06,14/.22,27/.55,45/1,56/.88,70/.5,82/.18,97/0 | independently versioned same bounded shape, max 8 | max 7; 0/.08,10/.22,17/.5,26/.72,41/1,51/.9,61/.68,68/.35,77/.12 |
| Activity | `kewaunee-chinook-weather-activity-v1` | `kewaunee-coho-weather-activity-v2` | `kewaunee-brown-trout-weather-activity-v3`; +10 Peak response correction |
| Endpoint/lifecycle | below facility; semelparous | below facility; semelparous | upper access; living repeat spawner; no mortality/departure claim |
| Audit | hidden `kewaunee-owner-review-ready-v1` | same | same |

Calendar boundaries combine direct facility timing with conservative entry/tail shoulders; operational opening and egg-take dates are biased observations, not first-entry dates.

### Activity tuning and fixed replay

All final runs use 2007-2025 weather-only replays with four daily blocks and 100% usable coverage. Missing hourly weather returns unavailable with no score or leader.

| Run | Coverage | Beginning | Building | Peak | Tapering | Ending | Invariants |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Chinook | 1,672/1,672 | 75.38 | 76.54 | 79.26 | 70.79 | 57.60 | all zero; lifecycle max delta 2 |
| Coho | 1,368/1,368 | 75.29 | 75.99 | 77.79 | 69.37 | 56.49 | all zero after v2 lifecycle smoothing; max delta 2 |
| Brown | 1,748/1,748 | 62.88 | 62.99 | 66.86 | 63.88 | 64.88 | all zero after v3 +10 Peak response; repeat-spawner language/shape pass |

Calibration ledger: Coho v1 failed one lifecycle-cliff invariant; v2 extended the continuous ramp to post-copy end and passed. Brown v1 had no stage response and failed shape; v2 +5 remained below later seasonal weather; v3 +10 created a bounded Peak without exceeding Limited ceilings and passed every invariant. Full distributions/samples are E-110.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| all stages | four named blocks | 100% of 2007-2025 expected days | four per usable day | artifact | artifact | see run summary | artifact | artifact | artifact | E-110 is authoritative stage-by-block table |

| Iteration | Fields changed | Reason | Artifact | Decision |
| --- | --- | --- | --- | --- |
| Coho v1→v2 | lifecycle ending extended to 11-20 | remove adjacent-day cliff | E-110 | accepted |
| Brown v1→v2 | Peak response +5 | establish repeat-spawner peak | full replay | insufficient |
| Brown v2→v3 | Peak response +10 | keep Peak above later winter weather within cap | E-110 | accepted |

## 11. Configuration reconciliation

| Object | Reconciliation | Status |
| --- | --- | --- |
| `config/onboarding/midwest.ts` | identity, sources, reaches, count feed, capabilities, three runs | reconciled |
| `data/fishCounts.ts`, types/contracts/validation/tests | Besadny provider, parser, fail-closed semantics | reconciled |
| `config/seasonalZonePlans.ts` | salmon endpoint and Brown passage geography | reconciled |
| `lib/riverRunSpotFinder.ts` | 7/7 DNR markers plus 4 current city/county accesses | reconciled |
| `lib/riverRunChoiceImages.ts` | `medium` mapping | reconciled |
| draft registry | hidden river/config/runs only | reconciled |

## 12. Acceptance and release record

### Owner-review digest

All three candidates are hidden. Chinook and coho are 8/10 sectional with direct facility evidence; Brown is 7/10 sectional with transfer-aware count exclusion. Activity is Limited weather-only at 100% replay coverage. Salmon terminal copy declines continuously; Brown remains a living repeat spawner.

Gauge Read offers County F flow/temp; historical-only temp is unavailable; Fish Counts are available only for Chinook/coho and fail closed; Fishing Shape is County F only; Spot Finder includes every DNR marker plus the four separately documented city/county public accesses.

| Gate | Result |
| --- | --- |
| Foundation/source/species truth | passed for owner review |
| Activity replay/invariants | all three passed after recorded tuning |
| Fishing Shape | passed fixed percentile audit |
| Fish Counts | parser, blank-cell, no-double-count tests passed; Brown isolated |
| Seasonal Zone/Spot Finder | 11/11 reconciled (7 DNR-map markers + 4 city/county accesses) |
| Remaining aggregate QA | command results recorded in final handoff |
| Rendered owner acceptance | not granted; this is the review packet |
| Public registry/deployment | hidden draft registry retained; protected admin-review function deployed; public release not authorized |
| Migration | existing fish-count cache migration applied; no new schema migration required for Spot Finder/config changes |
| Commit/remote parity | completed in the final reconciliation pass on `develop/cross-platform-next` |

## 13. Correction and learning ledger

| Finding | Correction | Safeguard |
| --- | --- | --- |
| Besadny Brown totals include adults transferred from several rivers | excluded Browns from Kewaunee Fish Counts while retaining independently supported run | audit observation provenance before assigning a number to a river |
| USGS gage-height parameter stopped while flow/temp continued | omitted height; independent metrics remain available | metric-level freshness, never station-level optimism |
| Coho v1 lifecycle ramp changed too sharply | v2 extended ramp through 11-20 | replay adjacent-day lifecycle continuity |
| Brown v1/v2 did not preserve Peak above later winter weather | v3 bounded +10 Peak adjustment | compare all stage means and retain repeat-spawner semantics |
