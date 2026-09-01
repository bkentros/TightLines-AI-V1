# Puyallup River — Washington onboarding dossier

**River ID:** `puyallup`
**State/region:** `WA` / `pacific_northwest`
**Research date:** 2026-08-30
**Status:** `owner_review_ready`
**Guide:** `docs/river_run_onboarding.md`

## 1. Decision and evidence record

- Foundation accepted for hidden lower-river implementation v1.
- Supported now: fall Chinook and fall coho from the official mouth to the Carbon River confluence.
- Steelhead: occurrence is real, but the Puyallup/Carbon/White population, ESA, propagation, passage, and seasonal treatment is not an easy fall-salmon extension; deferred.
- Public promotion/deployment: not authorized.
- Falsification search covered WDFW current rules/reports, Puyallup Tribal Fisheries, NOAA 2026 hatchery review, Ecology/Pierce Electron records, and USGS endpoints.

Contradiction search completed by/date: Codex / 2026-08-30
Independent falsification review by/date: separate evidence-review pass / 2026-08-30

### Evidence ledger

| ID | Authority/title | Direct source | Date/data | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- |
| P-01 | WDFW 2026-27 permanent rules | https://lawfilesext.leg.wa.gov/law/wsr/2026/13/26-13-052.htm | filed 2026-06-11; effective 2026-07-12 | Mouth at 11th Street Bridge; salmon seasons through Carbon; Clarks closure | Emergency rules can supersede |
| P-02 | WDFW emergency rules | https://wdfw.wa.gov/fishing/regulations/emergency-rules | checked 2026-08-30 | Time-sensitive legal recheck | Not a stable biological calendar |
| P-03 | NOAA Puyallup hatchery-program evaluation | https://www.fisheries.noaa.gov/s3/2026-05/puyallup-proposed-evaluation-pending-determination.pdf | 2026 | Voights/Clarks Chinook and Voights/tribal coho programs; Chinook July-Oct.; coho fall; transport dispositions | Program review, not whole-run abundance |
| P-04 | Puyallup Tribal Fisheries research | https://www.puyalluptribe-nsn.gov/member-services/tribal-natural-resources/fisheries/research/ | current | Basin/tributaries; glacial and turbid mainstem; Electron history | Co-manager context, not sport rule |
| P-05 | Puyallup Tribal annual fisheries report | https://www.puyalluptribe-nsn.gov/wp-content/uploads/2022-2023-Annual-Fisheries-Report_Final.pdf | 2022-23 | Electron downstream survival/entrainment concerns | Above first-product endpoint |
| P-06 | WDFW hatchery escapement reports | https://wdfw.wa.gov/fishing/management/hatcheries/escapement | 2022-26 reviewed | Recurring Voights Chinook/coho returns and timing | Preliminary cumulative facility returns, not river census |
| P-07 | USGS Puyallup at Puyallup 12101500 | https://waterdata.usgs.gov/nwis/uv?site_no=12101500 | probed 2026-08-30 | RM 6.6, 15-minute flow/height; sample 1,170-1,260 CFS and 10.40-10.52 ft | No water temp; does not measure turbidity |
| P-08 | USGS Puyallup near Orting 12093500 | https://waterdata.usgs.gov/nwis/uv?site_no=12093500 | current metadata | Upstream hydraulic context | Above Carbon/public endpoint; rejected as primary |
| P-09 | Ecology Electron passage record | https://apps.ecology.wa.gov/aquatics/downloadaction/24309 | 2024 | Passage-enhancement work confirms changing project status | Not used to extend lower product |
| P-10 | City of Puyallup shoreline inventory, Riverfront Trail | https://www.puyallupwa.gov/DocumentCenter/View/1552/Shoreline-Inventory-and-Characterization-PDF | official inventory; current trail existence cross-checked 2026-08-30 | Gated pedestrian riverbank access and fishing locations | Must exclude the signed 400-foot Clarks Creek closure |
| P-11 | WDFW Weiss water access | https://wdfw.wa.gov/places-to-go/water-access-sites/weiss-220 | current, checked 2026-08-30 | Parking, unimproved ramp, vehicle access during regulated sport-fishing seasons | Glacial-river and ramp-condition warning required |
| P-12 | Tacoma waterfront lands analysis | https://cms.cityoftacoma.org/Planning/Shoreline/Presentations/Waterfront_Lands_Study.pdf | official shoreline analysis | No general-public lower-river waterfront facilities | Supports omission, not an access listing |
| P-13 | Ecology 10A040 station/export | https://apps.ecology.wa.gov/continuousflowandwq/StationDetails?sta=10A040 | 2023-25 tables; checked 2026-08-31 | Mean-daily lower-mainstem water temperature at the USGS Puyallup site | Station currently inactive; provisional archive is historical context only |

## 2. Identity and corridor

The canonical Puyallup mainstem product begins at the 11th Street Bridge mouth and ends at the Carbon River confluence, about 26 miles. Current permanent rules provide no mainstem salmon season above that point.

## 3. Canonical reaches

| Reach | Boundaries | Role | Gauge | Decision |
| --- | --- | --- | --- | --- |
| `puyallup_lower` | 11th Street Bridge to Clarks Creek | lower | USGS 12101500 | Accepted; exclude signed 400-foot Clarks closure |
| `puyallup_middle` | Clarks Creek to East Main | middle | no | Reach/date-specific rules |
| `puyallup_upper_salmon` | East Main to Carbon River | terminal | no | Public salmon endpoint |

## 4. Barrier and passage inventory

| Barrier/control | Location | Passage finding | Product treatment |
| --- | --- | --- | --- |
| Electron project | above the Carbon endpoint | Passage work and status are evolving; transported fish are not proof of natural passage | Outside the v1 product and claims |
| Clarks Creek closure | lower reach | Signed regulatory exclusion rather than a biological barrier | Explicitly excluded from fishing guidance |

Passage continues into a larger basin, but that does not enlarge this salmon product. Electron Dam is upstream and has evolving passage records; no claim of unrestricted 2026 passage is made. NOAA documents hatchery-surplus transport upstream of Electron, reinforcing that facility dispositions are not natural passage counts.

## 5. Species endpoints and passage chains

| Species/run | Entry-to-endpoint chain | Endpoint decision |
| --- | --- | --- |
| Fall Chinook | Commencement Bay → lower/middle Puyallup → Carbon confluence | Supported only to the current mainstem salmon endpoint |
| Fall coho | Commencement Bay → lower/middle Puyallup → Carbon confluence | Supported only to the current mainstem salmon endpoint |

## 6. Regulations

The public reminder must cover reach/date-specific open days, barbless hooks, anti-snagging, night closure, wild-Chinook release periods, the Clarks exclusion, emergency rules, and glacial/levee hazards without restating the pamphlet as a guarantee.

## 7. Source and capability audit

| Capability | Decision | Exact limitation |
| --- | --- | --- |
| Gauge Read | available | Lower mainstem at Puyallup; 2-hour freshness; live units/timestamps/cadence verified |
| Live water temperature | unavailable | USGS has no current `00010`, and Ecology 10A040 is currently inactive |
| Historical temperature | available where qualified | 2023-25 Ecology daily means, selected date ±3 days; two qualifying years required; 78.26% July-Dec. date coverage; never presented as current or used in Activity |
| Fishing Shape | available for owner review | Fixed USGS 12101500 bands apply only near Puyallup/Clarks; no inferred turbidity and no extrapolation to the Carbon confluence |
| Activity | weather-only, Limited | Lower-valley light/precipitation only; no inferred runoff, turbidity, river response, or temperature |
| Spot Finder | available for owner review | Audited middle and upper sections only; lower river deliberately omitted for lack of general-public fishing facilities |

### Fish Counts capability

Voights Creek is eligible as a `hatchery_return` source for both species. WDFW weekly reports are cumulative/preliminary and may separate hatchery, wild, and management stock rows, adults/jacks, and dispositions. Display exactly which rows are included plus facility observation date, report date, and official link. Never add transported, released, spawned, surplus, or mortality columns into a fake “fish now in river” total. The application requests the official source on every report load with cache bypass, so a newly published weekly report can appear without waiting for an application cache; the source itself is not daily. Counts never drive Stage, Activity, or Presence and fail closed when stale, revised, absent, or out of season.

## 8. Spot Finder

Accepted for hidden owner review as a sparse two-section inventory. The data model and QA now permit an honest downstream-to-upstream subset instead of relabeling an upper access as “lower.”

| Public section | Foundation reach | Access | Fishing/access proof | Release treatment |
| --- | --- | --- | --- | --- |
| Middle Run Section — 400 feet upstream of Clarks Creek to East Main Bridge | `puyallup_middle` | Puyallup Riverwalk Fishing Access | City shoreline inventory identifies gated riverbank access and fishing at multiple trail locations | Explicitly exclude 400 feet below/above Clarks Creek; use signed public gates only |
| Upper Run Section — East Main Bridge to Carbon River | `puyallup_upper_salmon` | Weiss | WDFW water-access page lists parking, unimproved ramp, and vehicle access during regulated sport-fishing seasons | Warn for glacial flow and require current site/rule verification |

The 11th Street Bridge-to-Clarks lower section remains absent. Official Tacoma material states there are no general-public waterfront facilities in that lower shoreline, and no stronger fishing-oriented access source displaced that finding. Riverside Park's permit-only hand launch and general levee/trail pages were rejected because they did not independently establish public fishing access.

## 9. Candidate species matrix

| Species | Recurrence/opportunity | Endpoint | Calendar core | Presence | Decision |
| --- | --- | --- | --- | --- | --- |
| Fall Chinook | two current programs, sport season, recurring Voights returns | Carbon confluence | collection July-Oct.; Aug. build; late Aug.-Sep. core; Oct. tail | 8/10 broad | hidden candidate |
| Fall coho | Voights/tribal programs and recurring returns | Carbon confluence | late-Aug. entry; Sep. build; late Sep.-Oct. core; Nov. tail | 7/10 broad | hidden candidate |
| Steelhead | basin occurrence supported | separate Puyallup/Carbon/White analysis | run type/legal opportunity not one fall profile | not calibrated | defer |
| Lake-run brown trout | not an applicable anadromous product | n/a | n/a | n/a | excluded |

## 10. Species/run records

### Run: Fall Chinook

Conservative July-October calendar; broad Presence 8/10. Stage is calendar-only and Activity is weather-only and Limited.

### Run: Fall coho

Conservative late-August-November calendar; broad Presence 7/10. Stage is calendar-only and Activity is weather-only and Limited.

Configured as `PUYALLUP_RIVER_PROFILE`, `PUYALLUP_FALL_CHINOOK_RUN_PROFILE`, and `PUYALLUP_FALL_COHO_RUN_PROFILE` in `config/onboarding/washington.ts`. Fishing Shape uses audited lower-mainstem flow bands. Historical temperature, counts, and hydraulic trends contribute zero to weather-only Activity. Push and Migration Timing remain unavailable.

### Activity tuning and fixed replay

| Stage | Block | Usable days | Samples | Result |
| --- | --- | ---: | ---: | --- |
| all stages | all named blocks, fall Chinook | 2,223 | 8,892 | 100% coverage; zero invariants |
| all stages | all named blocks, fall coho | 2,147 | 8,588 | 100% coverage; zero invariants |

| Iteration | Fields changed | Evidence/product reason | Outcome |
| --- | --- | --- | --- |
| 1 | calendar anchors and Presence | NOAA program timing, WDFW returns, and legal corridor | conservative lifecycle accepted |
| 2 | no scoring fields changed | controlled perturbations tested isolation | flow, temperature, turbidity, and counts had zero influence |

Full named-block results are retained in `docs/audits/river-run-puyallup-chinook-weather-activity-replay.json` and `docs/audits/river-run-puyallup-coho-weather-activity-replay.json`.

## 11. Configuration reconciliation

| Record | Reconciliation |
| --- | --- |
| River profile | Three reaches, one lower gauge, Voights count source, no live temperature, limited Ecology historical-temperature context |
| Run profiles | Fall Chinook and fall coho only; hidden registry only |
| Primitive isolation | Counts, flow, and inferred runoff/turbidity contribute zero to Activity, Stage, and Presence |

## 12. Acceptance and release record

| Gate | State |
| --- | --- |
| Identity/regulations/lower endpoint | accepted for hidden implementation |
| Passage contradiction review | lower product safe; no Electron claim |
| USGS endpoint/no-live-temperature state | passed |
| Historical temperature audit | passed for 144/184 July-Dec. calendar dates; 673 accepted daily means from Ecology water-year 2024/2025 tables; missing dates remain absent |
| Fishing Shape calibration | passed for the gauge-represented lower reach; 5,472/5,472 seasonal daily-flow dates, 1988-2025 |
| Calendar/presence review | conservative owner-review calibration accepted |
| Activity replay/controlled QA | passed across 2007-25, 2,223/2,147 usable Chinook/coho days, 100% coverage, zero invariants; `docs/audits/river-run-puyallup-*-weather-activity-replay.json` |
| Count adapter/parser/isolation QA | passed against official WDFW PDF structure and duplicate-safe unit fixtures; failures remain fail-closed |
| Spot Finder source/corridor audit | passed for middle/upper sparse inventory; lower reach fails closed |
| Current legal/source recheck | passed 2026-08-31; no Puyallup-specific emergency change appears in the current WDFW index and all accepted Washington access/safety URLs returned HTTP 200 |
| Hidden review fixtures/copy/UI QA | passed; both Puyallup runs are included in the 1,385-scenario, 32-run review set and fixture controls remain absent from the public app |
| Narrow device review | iPhone SE development client boot/layout passed; authenticated Washington report review and Android narrow-width review remain pending |
| Owner acceptance/public registry/deployment | withheld/not authorized |

## 13. Correction and learning ledger

| Date | Trigger | Correction/revalidation rule |
| --- | --- | --- |
| 2026-08-30 | Initial Washington onboarding | Reopen for a legal-endpoint, Electron, Voights-reporting, USGS, or material return-pattern change |
| 2026-08-30 | Full regression exposed generic Grand River fallback copy | Added explicit Puyallup corridor/endpoint copy and a cross-river leakage assertion |
| 2026-08-31 | Green-only condition treatment found during review | Added lower-reach Fishing Shape and limited Ecology historical temperature; retained explicit no-live-sensor and no-turbidity claims |

Reopen for any emergency rule, Carbon/upstream sport-season change, Voights reporting change, USGS datum/sensor change, or authoritative Electron update that changes a claimed boundary.
