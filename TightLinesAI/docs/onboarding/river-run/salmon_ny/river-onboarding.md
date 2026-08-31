# Salmon River — New York onboarding dossier

**River ID:** `salmon_ny`
**State/region:** `NY` / `great_lakes`
**Research date:** 2026-08-31
**Status:** hidden owner-review implementation; public audit, release, and deployment withheld
**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

- Foundation accepted for hidden configuration v1.
- Hidden run profiles: fall Chinook, fall coho, and fall-entry Washington-strain Steelhead.
- Separate Steelhead decisions: Skamania summer-run is excluded after NYSDEC documented discontinuation after the 2021 stocking; the March-April spring-entry/spawn phase is retained as a separate future candidate because `spring_warming` is not implemented. Neither is merged into fall-entry Steelhead.
- Public promotion/deployment: not authorized. Rendered owner acceptance: withheld.

Contradiction search completed by/date: Codex / 2026-08-31
Independent falsification review by/date: separate primary-source and code-contract pass / 2026-08-31

| ID | Authority/title | Direct source | Date/data | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- |
| S-01 | NYSDEC Salmon River | https://dec.ny.gov/places/salmon-river | current; checked 2026-08-31 | 17-mile identity, species, annual stocking, PFR access, late-October-through-spring Steelhead | Fishing overview; exact rules come from S-02 |
| S-02 | NYSDEC Great Lakes tributary regulations | https://dec.ny.gov/things-to-do/freshwater-fishing/regulations/great-lakes-tributaries | current; checked 2026-08-31 | Reach, hour, tackle, fly-section, hatchery-property rules | Recheck immediately before release and fishing |
| S-03 | NYSDEC Salmon River Fisheries Management Plan | https://extapps.dec.ny.gov/docs/fish_marine_pdf/r7srmp2017.pdf | 2018 plan; evidence through 2017 | Chinook late-August entry/September build/early-October peak; coho same period but shorter/rapid; distinct Washington winter and Skamania summer histories | Older plan checked against S-04/S-05/S-06 |
| S-04 | NYSDEC 2022-26 Lake Ontario stocking strategy | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lostockingstrategy.pdf | allocations based on 2022 cap | Salmon: 300,000 Chinook, 157,450 Steelhead; primary broodstock/destination fishery | Allocations can change annually |
| S-05 | NYSDEC 2023 Lake Ontario annual report | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf | 2023 | 70,225 coho released at Altmar; Skamania discontinued after 2021 stocking | Stocking is not adult abundance |
| S-06 | NYSDEC tributary salmon guidance | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/pacific-salmon-fishing | current | Controlled-river salmon peak mid-Sep.-mid-Oct.; coho/Chinook lifecycle | Lakewide guidance refined by S-03 |
| S-07 | USGS Salmon River at Pineville 04250200 | https://waterdata.usgs.gov/monitoring-location/USGS-04250200/ | live probe 2026-08-31; record from 1992 | 15-minute flow/height; latest probe 236 CFS and 5.36 ft; no current 00010 | Middle/upper regulated mainstem only |
| S-08 | NYSDEC Salmon River access | https://dec.ny.gov/places/salmon-river | current | Route 3 platform, Trout Brook, Paradise Pool | Listings do not override signs/private property |
| S-09 | NYSDEC hatchery system | https://dec.ny.gov/things-to-do/freshwater-fishing/hatcheries | current | Hatchery collects Chinook, coho, Steelhead broodstock | No audited recurring count feed/freshness contract |

## 2. Identity and corridor

Canonical river is the Oswego County Salmon River from Lake Ontario at Port Ontario to the Lighthouse Hill Reservoir tailrace, excluding other Salmon Rivers and all reservoir water. Runtime region is `great_lakes`; timezone is `America/New_York`. The configured corridor is 17 miles.

## 3. Canonical reaches

| Reach | Boundaries | Role | Gauge | Decision |
| --- | --- | --- | --- | --- |
| `salmon_ny_lower` | Port Ontario to Pulaski | lower entry | no | Estuary/lower river; Pineville not extrapolated |
| `salmon_ny_middle` | Pulaski to Pineville | middle/core | USGS 04250200 | Accepted flow/height reach |
| `salmon_ny_upper` | Pineville to Lighthouse Hill tailrace | terminal | no | Altmar/fly-section context; reservoir excluded |

## 4. Barrier and passage inventory

| Barrier/control | Status/passage | Species decision | Product treatment |
| --- | --- | --- | --- |
| Lighthouse Hill Reservoir dam/tailrace | Active terminal impoundment; no supported upstream chain | All configured runs end at marked tailrace | Exact upstream limit; reservoir omitted |
| Hatchery/Beaverdam Brook collection | Broodstock collection and property closures; not an upstream mainstem route | Establishes recurring returns, not whole-river counts | Count unavailable; obey exclusions |

Mouth-to-endpoint chain for each configured run is Lake Ontario → lower Salmon → Pulaski/Pineville mainstem → Altmar/tailrace. No downstream barrier interrupts that supported chain.

## 5. Species endpoints and passage chains

| Run | Endpoint | Distribution decision |
| --- | --- | --- |
| Fall Chinook | Lighthouse Hill tailrace | broad; 10/10 portfolio ceiling |
| Fall coho | Lighthouse Hill tailrace | sectional/rapid ascent; 8/10 |
| Fall-entry Steelhead | Lighthouse Hill tailrace | broad fall-entry phase; 9/10; winter/spring presentation not claimed |

## 6. Regulations

NYSDEC Lake Ontario tributary rules apply, with Salmon River-specific night, terminal-tackle, floating-lure, fly-only, release, hatchery-property, and seasonal boundaries. Public reminder: check the current NYSDEC page and every posted sign; section names never imply uniform legality, access, parking, or safe entry.

## 7. Source and capability audit

| Capability | Decision | Exact limitation |
| --- | --- | --- |
| Gauge Read | flow/height available | Pineville middle/upper mainstem only; 2-hour freshness; 15-minute cadence verified |
| Historical-only water temperature | unavailable | 00010 returned zero current observations; no archival artifact accepted |
| Fish Counts | unavailable | No recurring source with report/observation freshness and revision semantics |
| Fishing Shape | unavailable | No owner-accepted release-aware absolute bands/replay |
| Activity | weather-only, Limited | Pineville light/precipitation; flow, counts, and air temperature contribute zero |

## 8. Spot Finder

Accepted for hidden review with three NYSDEC-listed sections: Route 3 (`salmon_ny_lower`), Trout Brook (`salmon_ny_middle`), and Paradise Pool (`salmon_ny_upper`). All remain collapsed, unranked, and subject to fly-section, hatchery-property, night, PFR, and posted restrictions.

## 9. Candidate species/run matrix

| Candidate run | Recurrence/opportunity | Calendar/life history | Decision |
| --- | --- | --- | --- |
| Fall Chinook | flagship wild+hatchery return | late Aug.-Nov.; early-Oct core; semelparous | hidden profile |
| Fall coho | recurring stocked return; short/rapid ascent | Sep.-Nov.; independent curve; semelparous | hidden profile |
| Washington Steelhead — fall entry | dependable entry begins late Oct. | Oct.-Dec.; iteroparous | hidden profile |
| Washington Steelhead — spring entry/spawn | another group enters Mar.-Apr. | separate spring-warming lifecycle | engine-gated future profile; not merged |
| Skamania Steelhead — summer | historic run declined; strain discontinued after 2021 | distinct summer life history | unsupported; affirmative S-05 evidence |

## 10. Species/run records

| Run ID | Window (pre-run → tail) | Presence | Activity version |
| --- | --- | --- | --- |
| `salmon_ny_fall_chinook` | Aug 1 → Nov 10 | 10/10 broad; independent 8-anchor curve | `salmon_ny_fall_chinook-weather-activity-v1-owner-review` |
| `salmon_ny_fall_coho` | Aug 15 → Nov 20 | 8/10 sectional; independent curve | `salmon_ny_fall_coho-weather-activity-v1-owner-review` |
| `salmon_ny_fall_steelhead` | Sep 20 → Dec 31 | 9/10 broad fall-entry; retained fish not declared absent | `salmon_ny_fall_steelhead-weather-activity-v1-owner-review` |

Stage, Activity, and Seasonal Presence are available in hidden review. Fishing Shape, Push, and Migration Timing are explicitly unavailable. Configured dates/anchors appear in `config/onboarding/newYork.ts`; no calendar is inherited. Coho Ending uses a 49 cap to preserve continuity within its short biological tail. Steelhead has no salmon mortality ramp or terminal decay.

### Activity tuning and fixed replay

| Stage | Block | Usable days | Samples | Result |
| --- | --- | ---: | ---: | --- |
| all stages | all four named blocks, Chinook | 1,672 | 6,688 | 100% coverage; Peak mean 78.48; zero coded invariants |
| all stages | all four named blocks, coho | 1,672 | 6,688 | 100% coverage; Peak mean 77.32; zero coded invariants |
| all stages | all four named blocks, fall-entry Steelhead | 1,748 | 6,992 | 100% coverage; repeat-spawner invariance passed; strict Peak-mean release gate held |

| Iteration | Fields changed | Evidence/product reason | Full replay | Decision |
| --- | --- | --- | --- | --- |
| 1 | source reach/weather-only inputs | no compatible live temperature | 2007-25 | accepted for hidden review |
| 2 | removed prohibited outcome phrase | controlled copy invariant | complete rerun | accepted |
| 3 | coho Ending cap 42→49 | preserve short calendar and ≤2-point continuity | complete rerun | accepted |
| 4 | Steelhead shaping removed; tail ends Dec. 31 | preserve iteroparous invariance/separate later phases | complete rerun | release held on strict Peak-mean criterion |

Artifacts: `docs/audits/river-run-salmon-ny-{chinook,coho,steelhead}-weather-activity-replay.json`.

## 11. Configuration reconciliation

`SALMON_NY_RIVER_PROFILE` and three run profiles in `config/onboarding/newYork.ts` reconcile identity, reaches, endpoint, source exclusion, dates, anchors, weights, caps, evidence, and hidden audit state. Spot Finder consumes the same three reach IDs. `publicAudit.isEnabled` is false for every run.

## 12. Acceptance and release record

| Gate | Result |
| --- | --- |
| Foundation/barrier/regulation/source reach | accepted for hidden implementation |
| USGS live/no-temperature probe | passed 2026-08-31 |
| Chinook/coho fixed replay and controlled Activity QA | passed; 100% coverage, zero coded invariants |
| Steelhead fixed replay | mechanical invariants passed; strict Peak-highest mean gate held for owner review |
| Fishing Shape/historical temperature/Fish Counts | explicitly unavailable and fail closed |
| Seasonal Zone/Spot Finder alignment | implemented for three audited sections |
| Rendered owner acceptance | withheld |
| Public registry, migrations, deployment, production smoke, commit/push | not authorized and not performed |

## 13. Correction and learning ledger

| Date | Finding | Correction/safeguard |
| --- | --- | --- |
| 2026-08-31 | Skamania could hide a distinct summer history | Separate candidate plus affirmative discontinuation; never merged |
| 2026-08-31 | Weather-only copy regex rejected a negated outcome claim | Phrase removed; full interval rerun |
| 2026-08-31 | Short coho tail produced a 3-point step | Versioned 49 Ending cap used instead of extending biology |
