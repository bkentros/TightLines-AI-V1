# Trail Creek River Run Onboarding Dossier

**River ID:** `trail_creek`
**State:** `IN`
**Created/research cutoff:** 2026-09-01
**Status:** `owner_review_ready`
**Target gate:** `owner_review_ready`
**Guide:** `docs/river_run_onboarding.md`
**Public state:** hidden draft; `publicAudit.isEnabled=false`; deployed behind the protected admin-review gate; no public release or enablement authorized.

## 1. Decisions and evidence ledger

Foundation and run truth were reconciled by Codex on 2026-09-01. Protected owner-review deployment was authorized and completed; rendered owner acceptance and public enablement remain intentionally not granted. Contradiction/falsification searches covered current rules, fishery pages, hatchery/stocking records, barrier operations, live reports, USGS metadata/data, and official access guidance. Recheck all time-sensitive sources immediately before release.

**Contradiction search completed by/date:** Codex / 2026-09-01
**Independent falsification review by/date:** Codex, second source-and-code pass / 2026-09-01

| ID | Authority/title | URL/path | Date/data | Facts supported | Limitations |
| --- | --- | --- | --- | --- | --- |
| E-001 | Indiana DNR, Lake Michigan Fishing | https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/ | accessed 2026-09-01 | Chinook/coho timing; distinct steelhead strains; autumn browns; all 10 access sites | Regional calendar plus direct access; not counts |
| E-002 | Indiana DNR, Fishing Northwest Indiana | https://www.in.gov/dnr/fish-and-wildlife/files/fw-fishing_lake_michigan.pdf | pp. 4, 8-9, 15, 19 | access, calendar, barrier/fishway, closure context | Older guide; current rules control |
| E-003 | Indiana DNR, Bodine hatchery | https://www.in.gov/dnr/fish-and-wildlife/fishing/indiana-fish-stocking/bodine-state-fish-hatchery | accessed 2026-09-01 | Skamania summer-run; Little Manistee winter-run; broodstock/coho timing | Not a Trail count feed |
| E-004 | Indiana DNR, Mixsawbah hatchery | https://www.in.gov/dnr/fish-and-wildlife/fishing/indiana-fish-stocking/mixsawbah-state-fish-hatchery | accessed 2026-09-01 | annual salmonid production, most stocked to Trail/East Branch LCR | Stocking is not returns |
| E-005 | Indiana 2026-27 Lake Michigan regulations | https://www.eregulations.com/indiana/fishing/lake-michigan-regulations | 2026-27 | barrier prohibition and current tackle/handling rules | Recheck at release |
| E-006 | USGS 04095300 | https://waterdata.usgs.gov/monitoring-location/USGS-04095300/ | live 2026-09-01; discharge/height history through 2026; continuous temperature 2025-08-27 onward | Springland location, flow/height/temp cadence/history | Provisional; barrier reach only; temperature lacks a multi-season replay record |
| E-007 | Indiana DNR fishing report | https://secure.in.gov/dnr/fish-and-wildlife/fishing/indiana-fishing-reports/ | 2026-08-27 | low/warm tributaries, few early kings, late Skamania | Snapshot, not abundance calibration |
| E-008 | U.S. Army barrier article | https://www.army.mil/article-amp/80834/new_barriertrap_intended_to_halt_spread_of_sea_lamprey | 2012 | barrier purpose and passage pool | Operations can change |
| E-009 | Final measured-flow audits | `docs/audits/river-run-trail-creek-*-activity-replay.json`, matching `*-activity-review-100.csv` | 2019-2025 | measured-flow Activity distributions, stage means, stratified review rows, hydraulic thresholds, and invariants | Mechanical validation, not fish presence, abundance, or catch rates |
| E-010 | Superseded weather-only audits | `docs/audits/river-run-trail-creek-*-weather-activity-replay.json` | 2007-2025 | records the rejected weather-only iteration | Retained for correction history; not the current model |

## 2. Identity and corridor

Trail Creek is an Indiana Lake Michigan tributary in the `great_lakes` runtime region and `America/Chicago` timezone. The product corridor runs from the Trail Creek mouth at Michigan City harbor to Creek Ridge Park/the mapped upper public-access corridor. The 10.5-mile length is orientation, not a navigable-mile or public-frontage claim. East Branch Little Calumet, Salt Creek, Michigan City pier/basin, the marina, and offshore Lake Michigan are excluded.

## 3. Canonical reaches

| Reach ID | Public range | Role/species | Gauge | Evidence |
| --- | --- | --- | --- | --- |
| `trail_creek_lower_city` | mouth to U.S. 12 | downstream; Chinook/coho | no | E-001, E-002 |
| `trail_creek_barrier_corridor` | U.S. 12 to Trail Creek Forks | middle; Chinook/coho | USGS 04095300 | E-002, E-005, E-006 |
| `trail_creek_upper_access` | Forks to Creek Ridge Park | terminal; Chinook/coho | no | E-001, E-002 |

## 4. Barrier and passage inventory

The Springland fixed-crest sea-lamprey barrier uses year-round stop logs and an operated fishway/trap. Designated non-target fish may be passed, but River Run never treats passage as automatic or infers it from gauge readings. Fishing is prohibited in the current statutory/posted barrier reach; current wording controls over older guide copy. Most tributary frontage is private.

Both supported salmon runs use the mouth → lower city → barrier corridor → upper-access chain. The gauge is representative only at Springland; Seasonal Zone orientation above the barrier is never real-time passage proof.

## 5. Species endpoints and passage chains

| Species | Passage chain | Endpoint | Decision |
| --- | --- | --- | --- |
| Chinook | mouth → Lower City → Springland corridor → mapped Upper Access | Creek Ridge/public upper corridor, subject to operated passage | supported |
| Coho | mouth → Lower City → Springland corridor → mapped Upper Access | Creek Ridge/public upper corridor, subject to operated passage | supported |
| Steelhead | distinct summer- and winter-run chains | no merged fall endpoint | unsupported as fall product |
| Lake-run Brown | autumn occurrence, insufficient Trail-specific passage calibration | none configured | unsupported this pass |

## 6. Regulations

Current Indiana Lake Michigan rules, the Springland no-fishing boundary, posted operations, licenses, tackle/handling restrictions, property access, and local safety conditions control. The reminder is configured at river and foundation jurisdiction level from E-005.

## 7. Source and capability audit

| Capability/source | Decision | QA/limitation |
| --- | --- | --- |
| Gauge Read: USGS 04095300 | available flow, height, measured temp; 15-minute provisional; 2026-09-01 sample 48.6 cfs, 2.05 ft, 20.2°C | independent freshness/failure; barrier reach only |
| Historical temperature | unavailable as historical tile or Activity score | official continuous archive query returned no fall observations in 2018-2024 and begins 2025-08-27; no imputation |
| Fish Counts | unavailable | no recurring public Trail-specific series; South Bend ladder is another river |
| Fishing Shape | available near Springland | 2019-2025 Aug. 1-Jan. 15, 1,161 daily means: p10 31, p25 37.6, p75 58.6, p90 84.2, p95 114 cfs |
| Activity | available, observed Springland flow + hourly light/precipitation | full 2019-2025 replay; flow is 55% of the score, light 35%, precipitation 10%; temperature is explicitly zero-weight until a multi-season record exists |
| Migration Timing / Push | unavailable | no separately accepted baseline; Stage is calendar-based and no movement claim is made |

Fishing Shape: too low ≤31; low 31-37.6; ideal 37.6-58.6; high-fishable 58.6-84.2; very-high transition 84.2-114; blown out ≥114 cfs. It is not clarity, safety, passage, or abundance.

## 8. Spot Finder

Early approach is Lake Michigan off Michigan City, Michigan City harbor, and the Trail Creek mouth; separate lake/harbor rules apply. For both runs: Beginning=`lower_city`; Building early/established=`barrier_corridor`; Building broad=`barrier_corridor,upper_access`; Peak=all; Tapering/Ending=`barrier_corridor,upper_access`. Version is `<runId>-seasonal-zone-v3-2026-09-01`.

| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Lake Michigan off Michigan City, harbor, and Trail Creek mouth | receiving lake/harbor feeding the creek entry | E-001, E-002 | lake/harbor rules and access are separate | approach before migration; Lower City at Beginning |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | `trail_creek_fall_chinook-seasonal-zone-v3-2026-09-01` | lower | barrier | barrier | barrier+upper | all | barrier+upper | barrier+upper |
| Coho | `trail_creek_fall_coho-seasonal-zone-v3-2026-09-01` | lower | barrier | barrier | barrier+upper | all | barrier+upper | barrier+upper |

| Section | Official access entries included |
| --- | --- |
| Lower | Site next to DNR building; Hansen Park (E Street); Winding Creek Cove (8th/Dickson Streets); Fire Station #2 (2005 E. U.S. Hwy 12) |
| Middle | Robert Peo Public Access (Liberty Trail); Karwick Nature Park (Karwick Road); U.S. 35 (Chapala Parkway); Trail Creek Forks (U.S. 20) |
| Upper | Johnson Road (Johnson/Wozniak Roads); Creek Ridge Park (7943 W. 400 North) |

E-001/E-002 name 10 sites; 10 included, 0 excluded, and no coordinates invented. DNR building and Creek Ridge are accessible. U.S. 35 carries the barrier warning.

## 9. Candidate species/run matrix

| Candidate | Decision | Evidence-based reason |
| --- | --- | --- |
| Fall Chinook | supported, 7/10 sectional | recurring stocking plus Sep-mid-Nov return and early-entry corroboration |
| Fall coho | supported, 7/10 sectional | direct recurring stocking/return; September entry, October peak, Oct-Nov spawn |
| Skamania steelhead | unsupported as fall product | explicitly summer-run; do not merge life histories |
| Little Manistee steelhead | unsupported as fall product | explicitly winter-run, bulk Feb-Mar |
| Lake-run brown trout | unsupported this pass | autumn occurrence, but no Trail-specific calendar/strength/endpoint precise enough |
| Lake trout | unsupported | lake/shore occurrence is not a Trail river migration |

Negative search included E-001–E-008, stocking strategy, and current rules. Unsupported means insufficient product calibration, not biological absence.

## 10. Species/run records

| Field | Fall Chinook | Fall coho |
| --- | --- | --- |
| Run ID/biology/engine | `trail_creek_fall_chinook`; `great_lakes_chinook_v1`; `fall_cooling` | `trail_creek_fall_coho`; `great_lakes_coho_v1`; `fall_cooling` |
| Lifecycle | semelparous spawn | semelparous spawn |
| Exact boundaries | pre 08-01; staging 08-15; start 08-25; beginning end 09-10; established 09-11; broad 09-20; peak 10-01/10-10/10-20; taper end 11-02; end 11-10; late 11-20; post 11-30 | pre 08-20; staging 09-01; start 09-10; beginning end 09-20; established 09-21; broad 10-01; peak 10-10/10-20/10-31; taper end 11-20; end 11-30; late 12-10; post 12-20 |
| Presence | max 7 sectional; offsets/fractions 0/.06, 14/.22, 27/.55, 45/1, 56/.88, 70/.50, 82/.18, 97/0 | independently versioned same bounded shape and ceiling |
| Activity | `trail-creek-chinook-measured-flow-activity-v2` | `trail-creek-coho-measured-flow-activity-v2` |
| Fishing Shape/audit | `trail-springland-fishability-v1`; hidden `trail-creek-owner-review-ready-v1` | same station model; hidden audit |

Dates combine direct DNR return/spawn windows with conservative shoulders; operations and reports are observations, not first-entry census dates.

### Activity tuning and fixed replay

The first observed-river attempt incorrectly required measured temperature on every replay day and therefore produced 0/686 usable Chinook days. A later owner-review correction separated the accepted measured inputs: approved Springland daily discharge is replayable for every 2019-2025 fall day, while continuous measured temperature begins only on 2025-08-27. The final model uses measured discharge plus hourly light and precipitation, assigns temperature zero weight, and fails closed unless hourly weather and fresh Springland flow are both present. One transient Open-Meteo failure receives a second bounded request before the slot is marked unavailable.

These are the unshaped daily-score means from the accepted measured-flow replay; no stage-response adjustment is configured:

| Run | Coverage | Pre-run/staging | Beginning | Building | Peak | Tapering | Ending | Post-run | Overall | Invariants |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Chinook | 686/686 | 73.11 | 68.24 | 68.77 | 75.30 | 61.77 | 52.93 | 43.69 | 65.07 | all zero |
| Coho | 707/707 | 67.00 | 68.32 | 70.74 | 71.64 | 70.95 | 55.87 | 40.59 | 65.84 | all zero |

Full stage-by-block distributions, percentiles, label counts, and 100-row samples are in E-009. These scores describe conditional responsiveness if fish are present; the separate Presence primitive carries seasonal abundance context. No stage-response override is used.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| all stages | four named blocks | 100% of 2019-2025 expected days | four per usable day | artifact | artifact | see E-009 | artifact | artifact | artifact | E-009 is authoritative stage-by-block table |

| Iteration | Fields changed | Reason | Artifact | Decision |
| --- | --- | --- | --- | --- |
| observed baseline | attempted Springland flow+temp+weather | test measured-input contract | 0/686 usable days | rejected |
| interim v1 | Activity changed to weather-only; river/temp weights zero | official daily temp history unusable | E-010, 100% coverage | superseded after owner review identified usable flow history |
| final v2 candidate | measured Springland flow 55%, block light 35%, block precipitation 10%, temperature 0%; positive-rise p50/p75/p90 thresholds 5.3/20/67.9 CFS and 9.9/35.8/101.4% | use the accepted real river signal without inventing temperature history | E-009, 100% coverage | accepted for owner calibration review |

## 11. Configuration reconciliation

| Object | Reconciliation | Status |
| --- | --- | --- |
| `config/onboarding/midwest.ts` | identity, sources, reaches, capabilities, two runs | reconciled |
| `config/seasonalZonePlans.ts` | exact reach IDs and early approach | reconciled |
| `lib/riverRunSpotFinder.ts` | 10/10 access names | reconciled |
| `lib/riverRunChoiceImages.ts` | `small` mapping | reconciled |
| draft registry | hidden river/config/runs only | reconciled |

## 12. Acceptance and release record

### Owner-review digest

Both candidates are hidden, 7/10 sectional, medium-confidence direct-occurrence/stocking calibrations below stronger counted Wisconsin comparators. Activity uses measured Springland flow with hourly block weather at 100% replay coverage and is scoped only to the barrier corridor. Salmon terminal copy uses continuous semelparous decline and never implies catch probability.

Gauge Read offers Springland flow/height/temp; Fish Counts and historical-only temperature are unavailable; Fishing Shape is station-reach only; Spot Finder contains all official sites.

| Gate | Result |
| --- | --- |
| Foundation/source/species truth | passed for owner review |
| Activity replay/invariants | measured-flow v2 passed at 100% coverage with all invariants zero |
| Fishing Shape | passed fixed percentile audit |
| Fish Counts | explicit unavailability passed |
| Seasonal Zone/Spot Finder | 10/10 reconciled |
| Remaining aggregate QA | command results recorded in final handoff |
| Rendered owner acceptance | not granted; this is the review packet |
| Public registry/deployment | hidden draft registry retained; protected admin-review function deployed; public release not authorized |
| Migration | existing migrations are in exact local/remote parity; no new schema migration required |
| Commit/remote parity | completed in the final reconciliation pass on `develop/cross-platform-next` |

## 13. Correction and learning ledger

| Finding | Correction | Safeguard |
| --- | --- | --- |
| Live USGS temperature existed but lacked a multi-season replay record | temperature retained only in Gauge Read and assigned zero Activity weight | replay each metric independently; never discard an accepted flow history merely because temperature is unavailable |
| First weather request for the initial owner snapshot returned no hourly rows | added one bounded retry before failing the refresh slot closed | a single transient provider response must not strand a new review snapshot |
| Weather-only correction discarded seven accepted flow seasons | replaced it with measured-flow v2 and retained weather only for block light/precipitation | an observed Activity contract may use weather plus one replayable measured river input |
| “Fall steelhead” would combine two named Indiana life histories | rejected merged candidate | split strain/season before calibration |
