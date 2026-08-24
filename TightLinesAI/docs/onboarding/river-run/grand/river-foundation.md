# Grand River River Run Foundation

**River ID:** `grand`
**State:** `MI`
**Created/researched:** 2026-08-24
**Status:** `research_complete_decisions_blocked`
**Owner section approval:** `pending`

> Stop gate: do not configure species runs, write state copy, or add the river
> to the public catalog until the owner approves the proposed public sections
> and the unresolved passage/source decisions below are closed. Acceptance,
> deployment, and public enablement remain separate decisions; none occurred.

## 1. Identity and corridor

| Field | Researched value | Evidence ID | Status |
| --- | --- | --- | --- |
| Public river name | Grand River | E-001, E-002 | verified |
| State/jurisdictions | Michigan; presentation corridor crosses Ottawa, Kent, Ionia, Eaton, and Ingham counties. Michigan DNR fishing rules apply; municipal/structure-owner access closures can also apply. | E-001, E-003, E-012, E-013 | verified |
| IANA timezone | `America/Detroit` (USGS site metadata emits fixed `EST`; runtime must normalize river civil time independently) | E-009, E-010, E-018 | verified_with_provider_caveat |
| Mouth waterbody | Lake Michigan at Grand Haven | E-001, E-002 | verified |
| Mouth coordinates | Approximately 43.057, -86.255 (Grand Haven pier/mouth orientation point; not an access promise) | E-002 | qualified |
| Downstream product boundary | Lake Michigan-facing Grand Haven pierheads / river mouth. The port-specific November rule extends inland to the northbound US-31/Beacon Boulevard bridge. | E-002, E-013 | verified |
| Upstream migratory/product boundary | **Owner-calibrated proposal:** Chinook guidance ends at Webber Dam pending modern upstream evidence; Coho and Steelhead guidance ends below Moores Park Dam. North Lansing passage is qualified, not unrestricted. | E-003, E-004, E-007 | approval_required |
| Approximate corridor length | Whole river is about 252 miles. Product corridor is about 102 river miles to Webber Dam for proposed Chinook scope and about 152 river miles to Lansing/Moores Park for proposed Coho/Steelhead scope. | E-001, E-004, E-009 | qualified |

The river flows west and northwest from southern Michigan through Lansing,
Ionia, Grand Rapids, and Grand Haven to Lake Michigan. River Run covers only
the migratory mainstem corridor defined here; tributaries are excluded unless a
future version separately researches and names them.

## 2. Proposed public sections — owner approval required

These are orientation ranges, not access or safety promises. The three-section
model is intentionally stable despite the corridor's many structures.

| Section ID | Proposed public label | Downstream boundary | Upstream boundary | Order | Migration access by species | Gauge coverage | Evidence IDs |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `grand_lower` | Lower river | Grand Haven pierheads / Lake Michigan mouth | Sixth Street Dam, Grand Rapids | 1 | Chinook: yes. Coho: yes. Steelhead: yes. Four downtown beautification dams are under active removal and must be reverified. | USGS 04119000 describes only the downtown Grand Rapids reach near river mile 41, not the harbor or entire Lower river. | E-002, E-003, E-005, E-009, E-015 |
| `grand_middle_passage` | Middle passage corridor | Sixth Street Dam | Webber Dam | 2 | All three species have direct historic passage evidence at Webber. Current Sixth Street ladder still exists, but corridor construction and current ladder-operation evidence require release-time verification. Lyons Dam was removed; Wagar remains/status require confirmation. | USGS 04118564 measures temperature at North Park Street just above Sixth Street. Neither accepted station represents the full route to Webber. | E-004, E-005, E-006, E-010 |
| `grand_upper_accessible` | Upper accessible corridor | Webber Dam | Moores Park Dam, Lansing | 3 | Chinook: **no product guidance above Webber pending owner/current evidence**. Coho/Steelhead: current DNR destination support exists below Moores Impoundment, but North Lansing ladder is inefficient and passage is qualified. | No accepted live hydraulic or temperature source represents this section. | E-003, E-004, E-007 |

Exact wording proposed for owner decision:

- Primary lower/entry section: `Lower river (Grand Haven mouth–Sixth Street Dam)`.
- Middle/transition section: `Middle passage corridor (Sixth Street Dam–Webber Dam)`.
- Upper accessible section: `Upper accessible corridor (Webber Dam–Moores Park Dam)`; Coho/Steelhead only unless the Chinook scope decision changes.
- Mouth/harbor context: `Grand Haven harbor and pierheads` only when seasonal context is supported; the port has a November gear rule.
- Landmarks prohibited from public copy: Ada Dam, Wagar Dam, Lyons fish ladder, Portland ladder, Grand Ledge ladder, and North Lansing ladder until the applicable current-status/passage row below is resolved; all tributaries unless separately researched.

## 3. Mandatory barrier, passage, and closure inventory

`Limited/qualified` does not mean impassable. An unresolved row cannot be used
to send users above the structure.

| Barrier ID | Official/alternate names | Type/status on 2026-08-24 | Reach/location | Passage: Chinook | Passage: Coho | Passage: Steelhead | Public upstream limit | Closure/regulation | Evidence IDs | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `grand_beautification_set` | Four low-head/beautification dams; Dam 2 is named in the current work update | Four structures between roughly Bridge Street/I-196 and Fulton Street; removal construction began 2026-07-01, with remaining removal planned in 2027 | Lower river, downtown Grand Rapids, downstream of Sixth Street | Historic salmonids reached Sixth Street; current construction changes physical status. Reverify. | Same | Same | no | Ah-Nab-Awen Park is closed for the project period; in-river causeways/cofferdam are active. | E-005, E-015 | qualified_current_work |
| `grand_sixth_street` | Sixth Street Dam; Sixth St. fish ladder; first sea-lamprey barrier | Existing aging low-head dam and salmonid ladder. Removal/replacement alternatives are in EIS; no construction timeline for Upper Reach. | Grand Rapids, about river mile 41, between Fish Ladder Park and Sixth Street Park | Historic ladder purpose and upstream Webber observations support passage; current unrestricted operation not independently verified. | Same | Same | no, but do not guide above until release-time operation check | Fishing in any fish ladder is prohibited. Site/park restrictions must be checked. | E-004, E-006, E-012 | qualified |
| `grand_historic_ada` | Historic Ada Dam | A 1932 source described a mainstem dam; the 2011 DNR assessment said Sixth Street and the beautification set were the only registered lower-valley mainstem dams. Current physical/remnant status was not authoritatively resolved. | Between Grand Rapids and Lyons | unknown current obstruction; historic Webber passage demonstrates some salmon traversed the corridor in 2008 | same | same | **fail closed if field/agency verification identifies a current barrier** | none established | E-004, E-016 | unresolved_blocker |
| `grand_lyons` | Lyons Dam and fish ladder | Dam removed and ladder closed in 2016; free-passage restoration intent | Village of Lyons | removal removes the former dam barrier; no current species restriction found | same | same | no | no current structure closure found | E-008 | confirmed_removed |
| `grand_wagar` | Wagar Dam remains | DNR documented remains in 2008; no current authoritative status located | About four miles upstream of historic Lyons Dam and downstream of Webber | Chinook reached/passed Webber in 2008, so remains were not absolute then; current condition unknown | same historic inference | same historic inference | **do not rely on passage until current verification** | none established | E-004, E-016 | unresolved_blocker |
| `grand_webber` | Webber Dam; Webber fish ladder | Active mainstem hydroelectric facility in DNR report; ladder/current angler enforcement documented in 2024 | 102 river miles from Lake Michigan, Ionia County | Direct 2008 ladder count: 233; proposed Chinook product limit at this endpoint pending modern upper evidence | Direct 2008 ladder count: 1,575 | Direct 2008 ladder count: 164 (fall; report says most Steelhead passage occurs March–April) | proposed Chinook endpoint; not Coho/Steelhead endpoint | Fishing in ladder prohibited; no structure-specific exclusion distance established beyond that rule | E-004, E-014 | confirmed historic passage; current operation qualified |
| `grand_portland` | Portland Dam fish ladder | Dam/ladder appears in DNR state asset inventory; current operating window/efficiency not found | Portland, upstream of Webber | current species-specific passage unresolved | current passage unresolved | current passage unresolved | **guidance above blocked pending verification** | fishing in ladder prohibited | E-006 | unresolved_blocker |
| `grand_grand_ledge` | Grand Ledge Dam fish ladder | Ladder appears in DNR state asset inventory; current operation/efficiency not found | Grand Ledge, upstream of Portland | current species-specific passage unresolved | current passage unresolved | current passage unresolved | **guidance above blocked pending verification** | fishing in ladder prohibited | E-006 | unresolved_blocker |
| `grand_north_lansing` | North Lansing Dam; Lansing Dam fish ladder | Existing unused hydropower dam. DNR says ladder passes only salmonids and is less efficient because gates are not functional. | 42.7456, -84.5500, Lansing | not named as a 2025 target; treat current passage as unknown | qualified/inefficient salmonid passage; DNR target species names Coho | qualified/inefficient salmonid passage; DNR target species names Steelhead | not the proposed endpoint, but no confident routing through it until owner accepts qualified passage | fishing in ladder prohibited | E-006, E-007 | qualified for Coho/Steelhead; unresolved Chinook |
| `grand_moores_park` | Moores Park Dam / Moores Impoundment | Existing upstream destination boundary in current DNR fishing-water table; passage facility not established in this research | Lansing, upstream of North Lansing Dam | current DNR does not list Chinook in the upstream Lansing reaches | DNR lists Coho below Moores Impoundment and omits it above | DNR lists Steelhead below Moores Impoundment and omits it above | **yes: proposed Coho/Steelhead product endpoint below dam** | no structure-specific closure established; statewide rules apply | E-003 | conservative_confirmed_product_boundary |

No natural falls were identified in the accepted mainstem corridor; the DNR
assessment describes rapids but no waterfall barrier. No mainstem harvest weir
was identified. These negative findings must be rechecked with the unresolved
Ada/Wagar and ladder-operation items before approval.

## 4. Regulations and access scope

| Jurisdiction | Regulation/version dates | River reach | Public reminder copy | Last verified | Evidence IDs |
| --- | --- | --- | --- | --- | --- |
| Michigan DNR, 2026 Fishing Regulations and Fisheries Orders | 2026 rules effective through 2027-03-31 | Entire Michigan corridor | `Check the current Michigan fishing regulations and posted local rules before fishing; section names do not establish access, legal methods, or harvest limits.` | 2026-08-24 | E-011, E-012 |
| Michigan DNR Fisheries Order 202 / 2026 digest | Nov. 1–30 | Port of Grand Haven, westernmost Lake Michigan pierhead to northbound US-31/Beacon Boulevard bridge | `Grand Haven harbor has a Nov. 1–30 single-pointed, unweighted-hook restriction; verify the current order before fishing.` | 2026-08-24 | E-013 |
| Michigan statewide fish-ladder rule | current 2026 digest | Every fish ladder in this inventory | `Fishing in a fish ladder is prohibited; obey posted exclusion areas and closures.` | 2026-08-24 | E-012 |
| City of Grand Rapids construction management | active project begun 2026-07-01; approximately two-year project | Lower Reach/I-196–Fulton Street and Ah-Nab-Awen Park | `Downtown construction and access closures are changing; check current City notices before choosing an access point.` | 2026-08-24 | E-005, E-015 |

River Run must not rate access, wading, boating, floating, ice, or personal
safety. All time-sensitive closures and every ladder's operation must be
rechecked immediately before release.

## 5. Source coverage map

| Source ID | Public station name | Provider/site/series | Metric(s) | Physical section | Represented reach | Role | Freshness limit | Historical record | Attribution/license | Evidence IDs | Accepted? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `grand_grand_rapids_hydraulic` | Grand River at Grand Rapids | USGS 04119000; 00060/00000 discharge, 00065/00000 gage height | CFS; ft | Lower river, right bank 500 ft upstream of Fulton Street bridge, river mile 41 | Downtown Grand Rapids near Fulton Street only; not Grand Haven harbor, the full Lower river, or above Sixth Street | proposed primary hydraulic | **owner proposal:** fresh ≤2 h, delayed >2–24 h, suppress >24 h | Daily mean discharge 1901-03-01–1905-12-31 and 1930-10-01–present; a two-day July 2026 gap observed. Instantaneous discharge page advertises 1989-present and gage height 2017-present. No gauge-height date average. | Public domain; credit `U.S. Geological Survey`; live values provisional | E-009, E-017 | yes_for_Phase_B, re-audit during construction |
| `grand_north_park_temperature` | Grand River at North Park Street | USGS 04118564; 00010/00000 | measured water temperature, °C converted to °F | Middle passage corridor, North Park Street, above Sixth Street | North Park/Grand Rapids reach only; not harbor, Webber, or Lansing | proposed primary temperature | **owner proposal:** fresh ≤2 h, delayed >2–24 h, suppress >24 h | Daily max/min/mean series begin 2020-07-15/16; mean has 2,137 observations through 2026-08-23, with a roughly 50-day 2021 gap and shorter gaps. | Public domain; credit `U.S. Geological Survey`; live values provisional | E-010, E-017 | yes |
| `grand_eastmanville_temperature_history_only` | Grand River near Eastmanville | USGS 04119400; 00010 | historic measured water temperature | Lower river, Eastmanville area | Eastmanville/lower-mainstem context only | rejected live fallback; research/history candidate only | not applicable | Daily max/min/mean 2011–2024 with material gaps; last valid IV observed 2024-10-01. The 2026 endpoint returns only `-999999` values qualified `Dis`, so it is not live. | Public domain; credit USGS | E-019 | no_live |

One primary hydraulic source is proposed; raw readings from other Grand River
gauges must not be averaged. Turbidity, dissolved oxygen, conductance,
precipitation, and water-surface elevation are not accepted public metrics even
though some stations publish them.

## 6. Weather strategy

| Weather point ID | Latitude/longitude | Role | Basin/reach represented | Known limitations | Evidence ID | Accepted? |
| --- | --- | --- | --- | --- | --- | --- |
| `grand_grand_rapids_weather` | 42.963082, -85.677253 | primary proposal | Modeled hourly context centered on the Grand Rapids/Fulton Street source reach | One point cannot represent Grand Haven–Lansing precipitation. Production-shaped Open-Meteo probe returned precipitation, cloud cover, and shortwave radiation for 168 hourly rows in `America/Detroit`, but `shortwave_radiation_clear_sky` was all null with unit `undefined`. Activity use is blocked until provider/adapter resolution and replay; weather never proves river response or clarity. | E-018 | coordinate_yes; activity_capability_blocked |

## 7. Supported species decision (foundation capability only)

| Species | Independent biological support | Source support | Planned run | Foundation status | Evidence IDs |
| --- | --- | --- | --- | --- | --- |
| Chinook salmon | Current DNR lists Chinook in Ottawa, Kent, and Ionia Grand River waters; 2008 DNR Webber monitoring directly counted Chinook ladder passage. DNR does not currently list Chinook in Eaton/Ingham Grand River reaches. | Hydraulics and temperature cover only Grand Rapids reaches | Fall | `supported_with_proposed_Webber_limit`; owner approval required | E-003, E-004 |
| Coho salmon | Current DNR lists Coho from Ottawa/Kent/Ionia through Grand River waters below Lansing/Moores Impoundment; direct Webber passage was counted independently. | Same reach-limited sources | Fall | `supported_to_below_Moores_subject_to_ladder_verification` | E-003, E-004, E-007 |
| Steelhead | Current DNR independently lists Steelhead along the same lower-to-below-Moores corridor; direct Webber passage was counted independently. North Lansing project specifically names Steelhead. | Same reach-limited sources | Fall entry | `supported_to_below_Moores_subject_to_ladder_verification` | E-003, E-004, E-007 |

These findings establish real river/run candidates only. They do not establish
calendars, run strength, presence curves, Activity calibration, lifecycle, or
public copy; those remain Phase C/D work. No species was inferred from another.

## 8. Research evidence ledger

All sources accessed 2026-08-24 unless stated otherwise.

| ID | Authority/title | URL | Published/updated | Facts supported | Geographic reach | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| E-001 | Michigan DNR, *Bass River Recreation Area General Management Plan* | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/BassRiverRA_GMP.pdf | 2022/2023 | Grand is Michigan's longest river; 252 miles; Hillsdale headwaters to Grand Haven mouth at Lake Michigan | whole river | not migration-specific |
| E-002 | Michigan DNR, *Grand Haven State Park* | https://www.michigan.gov/recsearch/parks/grandhaven | current page | State park lies at Grand River mouth; Lake Michigan and pier orientation | mouth | coordinates are approximate map orientation, not legal boundary/access |
| E-003 | Michigan DNR, *Better Fishing Waters* | https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters | current, accessed 2026-08-24 | Independently lists Chinook/Coho/Steelhead in Ottawa, Kent, Ionia; Coho/Steelhead below Lansing and below Moores Impoundment; omits those salmonids above Moores and omits Chinook in Eaton/Ingham | county/reach-level mainstem | destination list, not run timing, counts, or proof of passage on a given day |
| E-004 | Michigan DNR, *Grand River, Ionia County — Status of the Fishery Resource Report 2009-78* | https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0155_2009_GrandRiver.pdf | 2009 | Sixth Street ladder history; Webber at river mile 102; direct 2008 species-specific passage counts; Lyons/Wagar sequence; ladders extend salmon fishery toward Lansing; passage declines upstream | Sixth Street–Webber/Lansing corridor | historic; does not prove 2026 operation or unrestricted passage; stocking strategy has changed over time |
| E-005 | City of Grand Rapids, *Lower Reach River Reconstruction* | https://engage.grandrapidsmi.gov/r45268 | live update, 2026 | Four low-head dams; July 1 in-river construction; Dam 2 cofferdam; Ah-Nab-Awen closure; remaining removals planned 2027 | I-196/Bridge Street–Fulton Street | status is time-sensitive |
| E-006 | Michigan DNR, *FY 2023 Capital Outlay Five-Year Plan* | https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Executive/Reports/2021/FY_2023_Capital_Outlay_5-Year_Plan.pdf | FY 2023 plan | State asset inventory names Sixth Street, Webber, Portland, Grand Ledge, and Lansing fish ladders | mainstem structures | inventory proves assets, not 2026 operation/efficiency/species passage |
| E-007 | Michigan DNR, *Priority Habitat Conservation Projects — 2025* | https://www.michigan.gov/dnr/buy-and-apply/grants/aq-wl/fish-hab/priorityprojects | 2025/current | North Lansing Dam exists; ladder only passes salmonids and is less efficient with nonfunctional gates; target species include Coho and Steelhead | North Lansing | does not name Chinook or quantify passage |
| E-008 | Ionia County, *2024 Hazard Mitigation Plan*; USFWS, *Lyons Dam Removal EA* | https://ioniacounty.org/wp-content/uploads/2024/09/852710-Ionia-County-Hazard-Mitigation-Plan-2024.pdf ; https://www.fws.gov/sites/default/files/documents/news-attached-files/Draft_EA.pdf | 2024; 2016 | Lyons Dam removal occurred in 2016; project removed most dam and closed ladder | Lyons | EA is pre-action; county plan confirms completion but not detailed post-project hydraulics |
| E-009 | USGS, 04119000 monitoring metadata/current and daily endpoints | https://waterdata.usgs.gov/nwis/uv?legacy=1&site_no=04119000 ; https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04119000&parameterCd=00060,00065,00010&siteStatus=all ; https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04119000&parameterCd=00060,00065,00010&startDT=1900-01-01&endDT=2026-08-24&siteStatus=all | live/provisional; probe 2026-08-24 | Site/series, coordinates, river mile 41/Fulton Street location, 15-minute cadence, discharge and height only, record/gaps | downtown Grand Rapids | no water temperature; provider timestamps fixed EST; current values provisional; construction may alter stage/rating context |
| E-010 | USGS, 04118564 monitoring metadata/current and daily endpoints | https://waterdata.usgs.gov/monitoring-location/USGS-04118564/ ; https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04118564&parameterCd=00010,00065&siteStatus=all ; https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04118564&parameterCd=00010&startDT=1900-01-01&endDT=2026-08-24&siteStatus=all | live/provisional; probe 2026-08-24 | Exact temperature series/units, 15-minute cadence, location, 2020-present history/gaps | North Park Street/Grand Rapids above Sixth Street | short history; reach-limited; current values provisional |
| E-011 | Michigan DNR, *Fishing Regulations* | https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations | 2026; effective through 2027-03-31 | controlling current digest/orders and need to consult mapped inland trout/salmon rules | statewide | condensed digest; orders/legal descriptions control |
| E-012 | Michigan DNR, *2026 Michigan Fishing Regulations* | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf | 2026 | Fishing in any fish ladder prohibited; current general/special regulation source | statewide | must be rechecked before release |
| E-013 | Michigan DNR, *Ports of Grand Haven, Muskegon and Whitehall/Montague under single-pointed hook regulations Nov. 1–30* | https://www.michigan.gov/dnr/about/newsroom/releases/2025/11/12/single-pointed-hook-regulations-nov-1-30 | 2025-11-12 | Grand Haven port boundary and Nov. 1–30 gear/spearing restrictions under FO-202.25 | pierheads–northbound US-31 bridge | reverify against 2026 order before release |
| E-014 | Michigan DNR Law Enforcement, *9/1/2024–9/14/2024 report* | https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2024/9-1-2024-9-14-2024 | 2024 | Current-era Webber Dam/fish-ladder location and enforcement presence | Webber tailwater | does not prove ladder operation or passage |
| E-015 | City of Grand Rapids, *Grand Rapids breaks ground on Grand River Restoration — Lower Reach* | https://www.grandrapidsmi.gov/city-news/posts/grand-rapids-breaks-ground-on-grand-river-restoration-lower-reach/ | 2026-06-01 | Construction start, two-year duration, four-dam removal scope | downtown Lower Reach | evolving project |
| E-016 | Michigan DNR, *Draft Grand River Assessment*; Michigan EGLE historic geologic notebook | https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/FisheriesReports/FR020.pdf ; https://www.michigan.gov/-/media/Project/Websites/egle/Documents/Programs/GRMD/Catalog/11/OFR-60-Leverett-NB300.pdf | 2011/2017 final publication; historic 1932 notes | No natural waterfalls; registered lower-valley dam inventory; historic Ada/Lyons/Wagar/Webber/Portland sequence | mainstem | historic; Ada/Wagar current physical status remains unresolved |
| E-017 | USGS, data licensing, credit, and provisional-data disclaimer | https://www.usgs.gov/data-management/data-licensing ; https://www.usgs.gov/information-policies-and-instructions/acknowledging-or-crediting-usgs ; https://water.usgs.gov/data/disclaimer.html | current | USGS federal data public domain, credit requested; provisional values subject to revision | all USGS sources | partner-produced data can have separate terms; none identified on these station pages |
| E-018 | Production-shaped Open-Meteo forecast probe for proposed weather point | https://api.open-meteo.com/v1/forecast?latitude=42.963082&longitude=-85.6772533&hourly=precipitation%2Ccloud_cover%2Cshortwave_radiation%2Cshortwave_radiation_clear_sky&daily=precipitation_probability_max&precipitation_unit=inch&timezone=auto&past_days=4&forecast_days=3&timeformat=iso8601 | probe 2026-08-24 | Returned 168 hourly rows, seven daily rows, `America/Detroit`, precipitation/cloud/shortwave values | modeled point near Fulton Street | clear-sky radiation was entirely null and unit `undefined`; provider model, not measured river state |
| E-019 | USGS, 04119400 Eastmanville current/history endpoints | https://waterdata.usgs.gov/nwis/uv?legacy=1&site_no=04119400 ; https://waterservices.usgs.gov/nwis/iv/?format=json&sites=04119400&parameterCd=00010&startDT=2025-01-01&endDT=2026-08-24&siteStatus=all | probe 2026-08-24 | Historic temperature capability; exact discontinued sentinel behavior | Eastmanville | no valid live temperature after 2024-10-01; 2026 values are `-999999`/`Dis` |

## 9. Contradictions, conservative decisions, and blockers

| ID | Question/conflict | Evidence | Resolution/status | Owner/code consequence |
| --- | --- | --- | --- | --- |
| D-001 | Whole-river length is reported as both 252 and 270 miles. | E-001 says 252; City/EPA materials sometimes say 270. | Use current DNR 252-mile identity fact; product lengths use known river-mile stations, not 270. | no scoring consequence |
| D-002 | Historic report says fish ladders extend salmon toward/into Lansing, but current DNR reach lists omit Chinook in Eaton/Ingham and all target salmonids above Moores. | E-003, E-004, E-007 | Species-specific conservative proposal: Chinook ends at Webber; Coho/Steelhead end below Moores, with North Lansing passage qualified. | **owner approval required** before section graph/run work |
| D-003 | Ladder assets exist, but current operational windows and species efficiency are not published for Portland and Grand Ledge. | E-006 versus absence of current operational evidence | Leave unresolved; no above-structure recommendation until agency/operator confirmation. | foundation remains blocked |
| D-004 | Ada and Wagar appear in historic records but current status is incomplete. | E-004, E-016 | Record both; historic Webber passage is not substituted for 2026 status. | foundation remains blocked; contact DNR/EGLE/owner |
| D-005 | Four beautification dams are being removed while 04119000 is at the construction reach's downstream end. | E-005, E-009, E-015 | Accept 04119000 discharge/height for Phase B with downtown-only copy and mandatory rating/datum re-audit after each construction season or material removal. | source version must be time-bounded |
| D-006 | One Grand Rapids weather point cannot describe a 100–150 mile corridor, and the live clear-sky input is null. | E-018 | Keep it as a proposed Grand Rapids modeled-context point only; do not claim basin coverage. Activity remains blocked. | provider/adapter and replay decision required later |
| D-007 | Exact public labels/endpoints are research proposals, not owner facts. | playbook owner gate | No silent acceptance. | **owner approval required** |

## 10. Foundation gate

- [x] Identity, timezone, mouth, and corridor are documented, with qualified mouth coordinates.
- [ ] Public sections are recognizable and owner-approved.
- [ ] Barrier inventory is release-ready; Ada/Wagar and current Portland/Grand Ledge operation remain unresolved.
- [x] Passage is species-qualified and unresolved cases fail closed.
- [x] Current regulation and active construction sources are recorded.
- [x] Gauge, temperature, and weather reach limitations are explicit.
- [x] Gauge Read capability is decided; weather/Activity capability is separately blocked.
- [x] All three candidate species are independently evidence-backed within bounded reaches.
- [x] Every material claim resolves to the evidence ledger.
- [ ] No unresolved blocking decision remains.

**Foundation decision:** `blocked_pending_owner_and_passage_verification`
**Owner approval/date:** pending
**Foundation version:** `grand-foundation-research-v1-2026-08-24`
