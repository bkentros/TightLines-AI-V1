# Oak Orchard Creek — New York onboarding dossier

**River ID:** `oak_orchard`
**State/region:** `NY` / `great_lakes`
**Research date:** 2026-08-31
**Status:** hidden owner-review implementation; public audit, release, and deployment withheld
**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

- Foundation accepted for hidden configuration v1 from Point Breeze to Waterport Dam.
- Hidden profiles: fall Chinook, fall coho, fall-entry Steelhead.
- Spring-entry/spawn Steelhead remains a distinct engine-gated future candidate; it is not merged with fall entry.
- Public promotion/deployment and rendered owner acceptance: withheld.

Contradiction search completed by/date: Codex / 2026-08-31
Independent falsification review by/date: separate primary-source and code-contract pass / 2026-08-31

| ID | Authority/title | Direct source | Date/data | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- |
| O-01 | NYSDEC Oak Orchard River PFR | https://dec.ny.gov/sites/default/files/pfroakorchrv.pdf | current map; checked 2026-08-31 | Waterport endpoint, marked PFR/footpaths/parking, marine park | Map is not survey quality; adjacent land private |
| O-02 | NYSDEC Great Lakes tributary regulations | https://dec.ny.gov/things-to-do/freshwater-fishing/regulations/great-lakes-tributaries | current | Named power-lines-to-Waterport seasonal reach; hours/gear/limits | Recheck immediately before release/fishing |
| O-03 | NYSDEC 2022-26 stocking strategy | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lostockingstrategy.pdf | 2022 allocations | 111,400 Chinook, 35,000 Steelhead, 22,500 coho; big-river Steelhead rank 3; destination Chinook fishery | Allocation is not adult abundance |
| O-04 | NYSDEC 2023 annual report | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf | 2023 stocking | Oak coho 22,500; Steelhead 35,000 including pen fish | One year; stocked juveniles only |
| O-05 | NYSDEC advisory panel minutes | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lofapminutes11723.pdf | Jan. 2023; 2022 observations | Good Oak Chinook/coho returns; extended Chinook timing; Steelhead improved Nov.-Dec. | Qualitative agency panel record |
| O-06 | NYSDEC tributary salmon guidance | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/pacific-salmon-fishing | current | Rain-dependent tributaries generally peak mid-Oct.; semelparous lifecycle | Refined by Oak evidence |
| O-07 | USGS Oak Orchard near Shelby 04220045 | https://waterdata.usgs.gov/monitoring-location/USGS-04220045/ | live probe 2026-08-31 | 15-minute flow/height/temp; latest 43.1 CFS, 6.32 ft, 18.9°C | Upstream of Waterport Reservoir/Dam; rejected for run corridor |
| O-08 | NYSDEC sportfish restoration plan | https://extapps.dec.ny.gov/docs/wildlife_pdf/lkontfshrestspendplan07.pdf | official plan | Waterport overflow-channel fish stranding after high water | Older event; still material unmeasured hazard |
| O-09 | NYSDEC 2017 angler effort report | https://extapps.dec.ny.gov/docs/fish_marine_pdf/nyas17rpt1.pdf | 2017 survey | 80,238 angler-days; Steelhead 22%, salmon 14% primary targets | Effort, not run-size/time calibration |

## 2. Identity and corridor

Canonical identity is Oak Orchard Creek/Oak Orchard River in Orleans County, excluding the upstream warmwater reservoir fishery and other Oak Orchard waters. The 5.9-mile River Run corridor begins at Lake Ontario/Point Breeze and ends below Waterport Dam. Region is `great_lakes`; timezone `America/New_York`.

## 3. Canonical reaches

| Reach | Boundaries | Role | Gauge | Decision |
| --- | --- | --- | --- | --- |
| `oak_orchard_lower` | Point Breeze to Route 18 | lower/harbor entry | no | Source-audited marine park access |
| `oak_orchard_middle` | Route 18 to Park Avenue area | middle/core | no | Marked PFR corridor |
| `oak_orchard_upper` | Park Avenue area to Waterport Dam | terminal tailwater | no | Ends at dam; Shelby source rejected |

## 4. Barrier and passage inventory

| Barrier/control | Passage finding | Species decision | Product treatment |
| --- | --- | --- | --- |
| Waterport Dam/Lake Alice | First impassable terminal structure for this Lake Ontario fishery; reservoir above | All configured runs end below dam | Exact upstream limit |
| Waterport overflow/tailrace channels | Fish can enter overflow during high water and strand as levels fall | Does not establish passage | Fishing Shape withheld; caution retained |

Complete chain for all configured species: Lake Ontario → Point Breeze/lower creek → PFR middle/upper corridor → Waterport tailrace. No upstream station or reservoir observation crosses the dam in product logic.

## 5. Species endpoints and passage chains

| Run | Endpoint | Distribution/strength |
| --- | --- | --- |
| Fall Chinook | Waterport Dam | sectional 8/10; destination stocking and recurring fishery |
| Fall coho | Waterport Dam | sectional 6/10; independently stocked, shorter run |
| Fall-entry Steelhead | Waterport Dam | sectional 8/10; big-river season-long objective |

## 6. Regulations

NYSDEC seasonal tributary rules expressly cover the first power lines 1.9 miles south of Route 18 upstream to Waterport Dam, while lake/tributary seasons and limits apply elsewhere. PFR is a fishing easement only. Public copy links current rules and never promises parking, wading, private-land permission, or uniform reach legality.

## 7. Source and capability audit

| Capability | Decision | Exact limitation |
| --- | --- | --- |
| Gauge Read | unavailable | Shelby live metrics are upstream of reservoir/dam; lower stations lack accepted continuous data |
| Historical-only water temperature | unavailable | no reach-matched archival extraction accepted |
| Fish Counts | unavailable | no official recurring facility feed with observation/freshness/revision semantics |
| Fishing Shape | unavailable | no accepted live corridor hydraulics; overflow/visibility are unmeasured |
| Activity | weather-only, Limited | Waterport light/precipitation only; Shelby metrics and air temperature contribute zero |

## 8. Spot Finder

Accepted for hidden review from O-01: Oak Orchard Marine Park (`lower`), signed PFR footpaths (`middle`), and Waterport Dam PFR (`upper`). All access is unranked; mapped widths are not boundaries; private property beyond marked footpaths is excluded.

## 9. Candidate species/run matrix

| Candidate run | Recurrence/opportunity | Life history | Decision |
| --- | --- | --- | --- |
| Fall Chinook | direct allocation + recurring destination fishery | Sep.-Nov.; rain-dependent mid-Oct. core | hidden profile |
| Fall coho | direct annual allocation + good documented returns | Sep.-Nov.; shorter independent curve | hidden profile |
| Steelhead — fall entry | direct allocation; ranked big-river winter fishery | Oct.-Dec.; iteroparous | hidden profile |
| Steelhead — spring entry/spawn | separate March-April group documented lakewide | spring warming/spawn, not a fall continuation | engine-gated future profile; not merged |

## 10. Species/run records

| Run ID | Window (pre-run → tail) | Presence | Activity version |
| --- | --- | --- | --- |
| `oak_orchard_fall_chinook` | Aug 15 → Nov 22 | 8/10 sectional; independent curve | `oak_orchard_fall_chinook-weather-activity-v1-owner-review` |
| `oak_orchard_fall_coho` | Aug 25 → Nov 30 | 6/10 sectional; independent curve | `oak_orchard_fall_coho-weather-activity-v1-owner-review` |
| `oak_orchard_fall_steelhead` | Sep 20 → Dec 31 | 8/10 sectional fall entry | `oak_orchard_fall_steelhead-weather-activity-v1-owner-review` |

All expose Stage, Activity, and Seasonal Presence in hidden review. Fishing Shape, Push, and Migration Timing are unavailable. Coho Ending is 49 for continuous short-tail mechanics; Steelhead has no mortality ramp.

### Activity tuning and fixed replay

| Stage | Block | Usable days | Samples | Result |
| --- | --- | ---: | ---: | --- |
| all stages | all four blocks, Chinook | 1,710 | 6,840 | 100%; Peak mean 79.76; zero coded invariants |
| all stages | all four blocks, coho | 1,729 | 6,916 | 100%; Peak mean 79.66; zero coded invariants |
| all stages | all four blocks, fall-entry Steelhead | 1,748 | 6,992 | 100%; repeat-spawner invariance passed; strict Peak-mean gate held |

| Iteration | Fields changed | Reason | Artifact/outcome | Decision |
| --- | --- | --- | --- | --- |
| 1 | rejected Shelby; selected weather-only | dam/reservoir reach mismatch | full 2007-25 replays | accepted for hidden review |
| 2 | coho Ending 42→49 | terminal continuity without extending biology | zero coded invariants | accepted |
| 3 | Steelhead tail ends Dec. 31; no shaping | separate later phases/iteroparous behavior | fixed-condition scores invariant | strict Peak-mean release held |

Artifacts: `docs/audits/river-run-oak-orchard-{chinook,coho,steelhead}-weather-activity-replay.json`.

## 11. Configuration reconciliation

`OAK_ORCHARD_RIVER_PROFILE` and its three runs in `config/onboarding/newYork.ts` match the dossier's corridor, barrier, source rejection, calendars, strength, distribution, Activity, and capability decisions. Spot Finder uses the exact three foundation reach IDs. Every public audit gate is false.

## 12. Acceptance and release record

| Gate | Result |
| --- | --- |
| Identity/barrier/regulations/source reach | accepted for hidden implementation |
| USGS real endpoint probe and rejection | passed; all three metrics excluded across Waterport control |
| Chinook/coho replays and controlled QA | passed, 100% coverage, zero coded invariants |
| Steelhead replay | coded invariants passed; strict Peak-highest mean gate held |
| Shape/temperature/count capabilities | explicit fail-closed unavailability |
| Spot Finder alignment | implemented for three PFR-backed sections |
| Rendered owner acceptance | withheld |
| Public registry, migrations, deployment, production smoke, commit/push | not authorized/not performed |

## 13. Correction and learning ledger

| Date | Finding | Correction/safeguard |
| --- | --- | --- |
| 2026-08-31 | Same-name Shelby sensor looked complete | Reach audit detected reservoir+dam separation; all metrics excluded |
| 2026-08-31 | Coho short tail caused a scoring step | Versioned 49 Ending cap; full replay rerun |
| 2026-08-31 | General PFR map could imply broad permission | Spot Finder cautions preserve signed-easement/private-land boundary |
