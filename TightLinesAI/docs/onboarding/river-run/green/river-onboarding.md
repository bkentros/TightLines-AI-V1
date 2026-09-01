# Green/Duwamish River — Washington onboarding dossier

**River ID:** `green`
**State/region:** `WA` / `pacific_northwest`
**Research date:** 2026-08-31
**Status:** `owner_review_ready`
**Guide:** `docs/river_run_onboarding.md`

## 1. Decision and evidence record

- Foundation accepted for hidden implementation v1.
- Supported now: fall Chinook and fall coho.
- Steelhead: researched and deferred. Summer and winter programs/life histories require separate calendars and regulation review; they are not a fall-salmon copy.
- Public promotion/deployment: not authorized.
- Falsification search: WDFW rules and hatchery records, Muckleshoot-co-managed HGMP material, King County, USACE, NOAA, and live USGS endpoints checked 2026-08-30.

Contradiction search completed by/date: Codex / 2026-08-30
Independent falsification review by/date: separate evidence-review pass / 2026-08-30

### Evidence ledger

| ID | Authority/title | Direct source | Date/data | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- |
| G-01 | WDFW, 2026-27 permanent freshwater rules | https://lawfilesext.leg.wa.gov/law/wsr/2026/13/26-13-052.htm | filed 2026-06-11; effective 2026-07-12 | Official mouth/reach boundaries; salmon seasons, closures, release rules | Emergency rules can supersede |
| G-02 | WDFW emergency fishing rules | https://wdfw.wa.gov/fishing/regulations/emergency-rules | current, checked 2026-08-30 | Current Green closures/retention changes | Time-sensitive; recheck at release and fishing date |
| G-03 | King County Green/Duwamish watershed | https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/watersheds/green-duwamish-river | current | 65-mile system identity; salmonids; dams/diversion | Watershed description, not fishing regulation |
| G-04 | USACE Howard Hanson fish passage | https://www.nws.usace.army.mil/Missions/Civil-Works/Programs-and-Projects/Projects/Howard-A-Hanson-Dam-Additional-Water-Storage-Project/ | current; downstream passage target 2030 subject to funding | Trap/haul exists; downstream passage incomplete; upper watershed not a continuous public corridor | Schedule can change |
| G-05 | WDFW Green River Chinook plan | https://wdfw.wa.gov/sites/default/files/publications/02309/wdfw02309.pdf | current plan | Entry begins in July; spawning mid-Sep.-early Nov. | Management evidence, not daily abundance |
| G-06 | King County fish-passage report | https://your.kingcounty.gov/dnrp/library/water-and-land/flooding/green-river/brps-fish-exlusion-and-passage-report.pdf | technical report | Chinook migration mid-Aug.-Nov.; coho mid-Aug.-Dec. | Older timing calibrated against modern returns |
| G-07 | WDFW hatchery escapement reports | https://wdfw.wa.gov/fishing/management/hatcheries/escapement | weekly/final, 2022-26 reviewed | Soos Creek recurring Chinook/coho returns and accumulation | Preliminary cumulative facility returns; not total river abundance |
| G-08 | WDFW Soos Creek HGMP index | https://wdfw.wa.gov/fishing/management/hatcheries/hgmp | current | Authorized co-managed Chinook/coho programs and weir operations | Facility operation affects count meaning |
| G-09 | USGS Green near Auburn 12113000 | https://waterdata.usgs.gov/nwis/uv?site_no=12113000 | endpoint probed 2026-08-30 | 15-minute discharge/height; sample 297-315 CFS and 56.85-56.89 ft | No parameter 00010 temperature; Auburn reach only; height datum history needs care |
| G-10 | USGS Duwamish at Tukwila 12113390 | https://waterdata.usgs.gov/nwis/uv?site_no=12113390 | current metadata | Tidal lower-river context and measured temperature | Raw discharge can reverse; rejected for pairing with Auburn Activity |
| G-11 | City of Kent, Three Friends Fishing Hole | https://www.kentwa.gov/departments/kent-parks/parks-places/parks-trails/three-friends-fishing-hole | current, checked 2026-08-30 | Named Green River fishing park, parking, hours, trail access | Does not replace reach rules or emergency changes |
| G-12 | City of Auburn, Fenster Nature Park | https://www.auburnwa.gov/cms/one.aspx?pageId=15353473&portalId=11470638 | current, checked 2026-08-30 | Direct Green River public fishing access and dawn-to-dusk hours | Remains downstream of the Highway 18 closure boundary |
| G-13 | WDFW current emergency-rule index | https://wdfw.wa.gov/fishing/regulations/emergency-rules | effective dates checked 2026-08-30 | Chinook retention closed Aug. 17-Dec. 14, 2026; upper Green fishing closure Sep. 16-Oct. 31, 2026 | Volatile; must be rechecked immediately before release and every trip |
| G-14 | USGS annual water-data reports, Green River near Auburn 12113000 | https://pubs.usgs.gov/wdr/1983/wa-83-1/report.pdf | approved archival daily means; water years 1982, 1983, 1984, 1986 parsed 2026-08-31 | Discontinued Auburn water-temperature record; qualifying July-December same-calendar-date ±3-day historical averages | Sparse legacy tables; missing dates are not imputed; never a live reading |
| G-15 | USGS approved daily discharge, Green River near Auburn 12113000 | https://waterdata.usgs.gov/nwis/dv?site_no=12113000 | 5,662/5,662 July 20-Dec. 15 dates, water years 1988-2025 | Fixed Auburn Fishability presentation bands: p5 231, p25 291, median 420, p75 1,000, p95 3,000, p99 6,834 CFS | Auburn/Big Soos mainstem shape only; not access, safety, abundance, tidal Duwamish, or upper-river thresholds |

## 2. Identity and corridor

Canonical identity is the connected Green/Duwamish, excluding Green Lake and other Green Rivers. The product runs from the official mouth line at Harbor Island to the Tacoma municipal watershed boundary below Headworks, about 40 miles of supported corridor.

## 3. Canonical reaches

| Reach | Boundaries | Role | Gauge | Decision |
| --- | --- | --- | --- | --- |
| `green_lower_duwamish` | Harbor Island to Tukwila | lower/tidal entry | no | Keep separate from Auburn hydraulics |
| `green_middle_auburn` | Tukwila through Big Soos/Auburn to Highway 18 | middle/core | USGS 12113000 | Accepted measured reach |
| `green_upper_accessible` | Auburn-Black Diamond Road to watershed boundary | terminal biological corridor | no | Regulatory gap below it must not be implied open |

## 4. Barrier and passage inventory

| Barrier/control | Location | Passage finding | Product treatment |
| --- | --- | --- | --- |
| Tacoma Headworks | upper Green | Collection/diversion; not proof of an unrestricted public corridor | Conservative endpoint below municipal watershed |
| Howard Hanson Dam | upstream of Headworks | Adult trap-and-haul exists; downstream passage remains incomplete | Excluded from v1 corridor |

Passage chain: Puget Sound → Duwamish → free lower/middle Green → Tacoma Headworks collection/diversion. The municipal watershed is not public. Howard Hanson is upstream; trap-and-haul plus incomplete downstream passage does not justify extending this product through the upper watershed. Both supported species use the conservative endpoint.

## 5. Species endpoints and passage chains

| Species/run | Entry-to-endpoint chain | Endpoint decision |
| --- | --- | --- |
| Fall Chinook | Puget Sound → Duwamish → lower/middle Green → below Headworks | Supported through the same conservative corridor |
| Fall coho | Puget Sound → Duwamish → lower/middle Green → below Headworks | Supported through the same conservative corridor |

## 6. Regulations

Rules differ by reach and can change by emergency action. Current rules include closed sections and changing Chinook-retention provisions. Public copy must link to WDFW and never imply uniform access, tackle, retention, or safety.

## 7. Source and capability audit

| Capability | Decision | Exact limitation |
| --- | --- | --- |
| Gauge Read | available | Auburn flow/height only; 2-hour freshness; production timestamps/units/cadence verified |
| Live water temperature | unavailable | Auburn returned zero `00010`; Tukwila tidal temperature is not silently combined |
| Historical temperature | available where qualified | Same-calendar-date ±3-day average from approved 1981-1986 Auburn archival tables, requiring observations from at least two years; gaps are withheld; explicitly not live and excluded from scoring |
| Fishing Shape | available for owner review | Flow-only fixed bands calibrated from 38 complete fall seasons; applies only to the Auburn/Big Soos mainstem and never implies legal access or fish abundance |
| Activity | weather-only, Limited | Auburn-area modeled light/precipitation; hydraulics and counts contribute zero |
| Spot Finder | available for owner review | Two source-audited public fishing sections; tidal Duwamish, the closed Highway 18 gap, and upper seasonal-mismatch access fail closed |

### Fish Counts capability

Soos Creek is eligible as a `hatchery_return` source for both species. WDFW posts cumulative preliminary returns, usually weekly. FinFindr bypasses HTTP caches and checks the authoritative index and newest report whenever a report is requested, so a newly published source report is not held behind an app cache; this daily-or-better checking does not imply WDFW publishes a new count every day. Display must preserve facility, stock/origin rows, adults/jacks, observed-through date, report date, and source link. It must say fish may spawn or be harvested below the rack and the number is not whole-river abundance, current location, angler availability, or catch probability. Counts never modify Stage, Activity, or Presence. Stale, revised, absent, or inactive-season data fails closed.

The 23 adult Chinook shown in the August 27, 2026 report are observations through August 5 at Soos Creek, not fish passing the whole Green River. Comparable early reports were also small (23 in 2021, 3 in 2022, and 25 in 2025), while available later-season reports exceeded 11,000-13,000. The current number is therefore plausible for the front edge of facility handling and must not be interpreted as a river-wide run total.

## 8. Spot Finder

Accepted for hidden owner review with two audited sections, not a fabricated whole-river inventory.

| Public section | Foundation reach | Access | Fishing/access proof | Release treatment |
| --- | --- | --- | --- | --- |
| Lower Run Section — Tukwila International Boulevard to South 212th Street Bridge | `green_middle_auburn` | Three Friends Fishing Hole | City of Kent explicitly lists fishing, parking, trail access, and dawn-to-dusk hours | Show with current-rule warning; 2026 emergency rule closes Chinook retention |
| Middle Run Section — South 212th Street Bridge to Highway 18 Eastbound Bridge | `green_middle_auburn` | Fenster Nature Park | City of Auburn explicitly identifies direct Green River public fishing access and dawn-to-dusk hours | End at Highway 18; never imply access in the closed gap |

The tidal Duwamish has no accepted fishing-oriented access listing in this pass. Flaming Geyser and Green River Natural Area prove upper public angling, but the permanent upper salmon season begins November 1 and a 2026 emergency closure applies September 16-October 31. They are documented research exclusions, not static recommendations. This is intentional section-level fail-closed behavior.

### Early approach and per-run phase plan

| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Puget Sound, Duwamish estuary, and lower Green/Duwamish approach | receiving marine/estuary path to the configured lower river | G-01, G-06, foundation corridor | broad direction only; marine/estuary rules and access are not imported | accepted throughout Before Migration and Beginning |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | `green_fall_chinook-seasonal-zone-v2-2026-09-01` | lower Duwamish | lower Duwamish | lower + Auburn | all three | all three | Auburn + upper | Auburn + upper | independent Chinook calendar/corridor; no lower audited access overlap |
| Coho | `green_fall_coho-seasonal-zone-v2-2026-09-01` | lower Duwamish | lower Duwamish | lower + Auburn | all three | all three | Auburn + upper | Auburn + upper | independent later coho calendar/corridor; no lower audited access overlap |

## 9. Candidate species matrix

| Species | Recurrence/opportunity | Endpoint | Calendar core | Presence | Decision |
| --- | --- | --- | --- | --- | --- |
| Fall Chinook | WDFW plan, fishery rules, Soos returns | boundary below Headworks | entry July; build Aug. 20; peak Sep. 10-Oct. 5; tail mid-Nov. | 7/10 broad | hidden candidate |
| Fall coho | authorized program and recurring Soos returns | same corridor | entry mid/late Aug.; Sep. build; late Sep.-Oct. core; tail mid-Dec. | 8/10 broad | hidden candidate |
| Steelhead | recurring summer/winter fish exist | separate life-cycle work | not one fall-salmon season | not calibrated | defer |
| Lake-run brown trout | no applicable anadromous product candidate | n/a | n/a | n/a | excluded after source-class search |

## 10. Species/run records

### Run: Fall Chinook

Conservative July-November calendar; broad Presence 7/10. Stage follows the fixed calendar only. Activity is weather-only and Limited.

### Run: Fall coho

Conservative August-December calendar; broad Presence 8/10. Stage follows the fixed calendar only. Activity is weather-only and Limited.

Configured objects are `GREEN_RIVER_PROFILE`, `GREEN_FALL_CHINOOK_RUN_PROFILE`, and `GREEN_FALL_COHO_RUN_PROFILE` in `config/onboarding/washington.ts`. Public Push and Migration Timing remain unavailable. Fishability is a separate flow-only Auburn/Big Soos presentation read. Activity uses light and restrained same-block precipitation only, with continuous semelparous decline; neither flow nor historical temperature enters Activity.

### Activity tuning and fixed replay

| Stage | Block | Usable days | Samples | Result |
| --- | --- | ---: | ---: | --- |
| all stages | all named blocks, fall Chinook | 2,451 | 9,804 | 100% coverage; zero invariants |
| all stages | all named blocks, fall coho | 2,432 | 9,728 | 100% coverage; zero invariants |

| Iteration | Fields changed | Evidence/product reason | Outcome |
| --- | --- | --- | --- |
| 1 | calendar anchors and Presence | authoritative timing plus recurring facility returns | conservative lifecycle accepted |
| 2 | Activity scope disclaimer only | controlled QA rejected a prohibited phrase even when negated | replay passed without hydraulic, count, or temperature influence |

Full named-block results are retained in `docs/audits/river-run-green-chinook-weather-activity-replay.json` and `docs/audits/river-run-green-coho-weather-activity-replay.json`.

## 11. Configuration reconciliation

| Record | Reconciliation |
| --- | --- |
| River profile | Three canonical reaches, Auburn live flow/height, one Soos count source eligible for two species, and explicitly historical-only Auburn temperature context |
| Run profiles | Fall Chinook and fall coho only; hidden registry only |
| Primitive isolation | Fish Counts, Fishability flow, and historical temperature contribute zero to Activity, Stage, and Presence |

## 12. Acceptance and release record

| Gate | State |
| --- | --- |
| Identity/barriers/regulations/source reach | accepted for hidden implementation |
| USGS endpoint/no-temperature probe | passed |
| Calendar/presence falsification | passed for conservative owner review |
| Activity replay/controlled QA | passed across 2007-25, 2,451/2,432 usable Chinook/coho days, 100% coverage, zero invariants; `docs/audits/river-run-green-*-weather-activity-replay.json` |
| Count adapter/parser/isolation QA | passed against official WDFW PDF structure and duplicate-safe unit fixtures; freshness/revision failure remains fail-closed |
| Count source refresh | authoritative page/PDF fetched with cache bypass on every report request; WDFW publication remains weekly rather than fabricated daily data |
| Auburn historical temperature | exact published daily means only, pooled within the selected date ±3 days; missing dates not imputed; output requires two qualifying years; archival context never enters scoring |
| Auburn/Big Soos Fishability | 38-year approved daily-flow distribution accepted for fixed reach-only presentation bands; Puyallup/Cowlitz remain unavailable |
| Spot Finder source/corridor audit | passed for two sections; tidal, closure-gap, and upper seasonal-mismatch sections withheld |
| Current legal/source recheck | passed 2026-08-31; both Green emergency rules remain active and all accepted Washington access/safety URLs returned HTTP 200 |
| Hidden review fixtures/copy/UI QA | passed; both Green runs are included in the 1,385-scenario, 32-run review set and fixture controls remain absent from the public app |
| Narrow device review | iPhone SE development client boot/layout passed; authenticated Washington report review and Android narrow-width review remain pending |
| Rendered owner acceptance | withheld |
| Public registry/deployment | not authorized |

## 13. Correction and learning ledger

| Date | Trigger | Correction/revalidation rule |
| --- | --- | --- |
| 2026-08-30 | Initial Washington onboarding | Reopen any affected decision for a barrier, emergency-rule, station/datum, Soos-operation, or material return-pattern change |
| 2026-08-30 | Full regression exposed generic Grand River fallback copy | Added explicit Green corridor/endpoint copy and a cross-river leakage assertion |
| 2026-08-31 | Generic stage-to-section progression under-described early water and late species behavior | Added sourced Puget Sound/Duwamish early orientation plus independent Chinook/coho phase-reach plans; Beginning lower-river phases fail closed because no audited lower public fishing access overlaps |
| 2026-09-01 | V1 hid early direction before the narrower staging date | V2 shows the sourced approach throughout Before Migration and Beginning as broad fishing direction, never as verified access |

Any new barrier status, emergency rule, station/datum change, Soos operation change, or material five-year return shift reopens the affected decision.
