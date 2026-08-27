# Root River River Run Foundation

**River ID:** `root` **State:** `WI` **Researched:** 2026-08-26
**Status:** `gate_4b_hidden_owner_review` **Owner section approval:** `approved_2026-08-26`

> This is the Root River in Racine flowing to Lake Michigan. Gate 4A
> implements owner-approved truth, calendars, restriction-first corridor copy,
> Fish In River, upper-context Fishability/Gauge Read, and hidden configuration.
> Gate 4B now provides independently replayed Limited
> weather-only Activity for all four species; both upstream river stations are
> excluded from that score.

## 0. Research context

- Wisconsin/Great Lakes runtime types fit.
- Actual USGS and Open-Meteo endpoints were probed.
- The seasonal Steelhead Facility weir is treated separately from Horlick Dam;
  the existence of a fish ladder does not imply free upstream passage.

## 1. Identity and corridor

| Field | Researched value | Evidence | Status |
| --- | --- | --- | --- |
| Public name | Root River | E-001, E-002 | verified |
| Jurisdiction/timezone | Wisconsin; Racine County proposed corridor; `America/Chicago` | E-002, E-006 | verified |
| Mouth | Racine Harbor / Lake Michigan; orientation point about `42.733, -87.778` | E-001, E-005 | verified; map-derived coordinate |
| Biological outer limit | Horlick Dam, 5.82 river miles above mouth, is DNR's first impassable barrier | E-003, E-004 | verified |
| Conservative product limit | Downstream face of the Root River Steelhead Facility weir in Lincoln Park while it is operated | E-001, E-015 | owner approved for v1; documented upstream transfers mean this is a product limit, not an absolute biological limit |
| Repeated-name risk | Root River, Racine/Pike-Root Lake Michigan basin; not Minnesota's Root River or another namesake | E-002, E-006 | resolved |

## 2. Proposed public sections — owner decision required

| Section ID | Proposed label | Downstream boundary | Upstream boundary | Order | Migration/access caveat | Gauge coverage | Evidence |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `root_harbor_downtown` | Harbor & Downtown | Lake Michigan mouth | 6th Street | 1 | Open lake entry | USGS gauge is far upstream | E-005, E-009 |
| `root_city_parks` | City Parks | 6th Street | Island Park | 2 | No intervening barrier found in reviewed official corridor sources | Gauge is upstream context | E-005 |
| `root_lincoln_park` | Lincoln Park | Island Park | downstream face of Steelhead Facility weir | 3 | Weir can completely block fish during runs; do not direct above it without an operations/passage decision | USGS gauge lies upstream between facility and Horlick and is contextual, not direct product-reach truth | E-001, E-005, E-006 |

Exact wording proposed:

- `Harbor & Downtown — Lake Michigan to 6th Street`
- `City Parks — 6th Street to Island Park`
- `Lincoln Park — Island Park to the Steelhead Facility`

Alternative broader endpoint `Horlick Dam` is not recommended for first release:
DNR confirms the facility weir can completely block upstream movement and does
not specify in the reviewed public page whether processed fish are released
above or below it. Owner calibration cannot convert that unknown into passage.

## 3. Barrier, passage, and operations inventory

| Structure | Status/location | Species response | Product consequence | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- |
| Root River Steelhead Facility weir and ladder | Seasonal operating structure in Lincoln Park | DNR says it blocks upstream trout/salmon during spawning runs; grates can be lowered to allow some passage. The fall 2025 summary reports 3,372 Chinook, 5,459 Coho, and one Steelhead passed upstream after processing. | Keep the owner-approved v1 product endpoint at the downstream face; describe the structure as operational passage, never a permanent biological barrier | E-001, E-008, E-015 | high |
| Horlick Dam | Existing first impassable barrier, about river mile 5.82 | Treat impassable for all candidate salmonids | Biological outer limit; outside narrower initial product corridor | E-003, E-004, E-006 | high |

No other mainstem dam, falls, or passage structure was identified between the
mouth and Lincoln Park in the reviewed DNR facility/access, waterbody, and VHS
records. This bounded negative finding does not cover tributaries or future dam
changes.

### Species endpoint and passage-chain decision

For all four candidates, the initial product endpoint is the downstream face of
the operated Steelhead Facility weir. Horlick is the verified biological outer
barrier. DNR's fall 2025 report resolves the release-side uncertainty by showing
that processed fish are passed upstream, but passage is operational and the
above-facility reach was not approved as a v1 product section. The app therefore
fails closed at Lincoln Park without falsely describing it as an absolute
biological barrier.

## 4. Regulations, advisories, and access

| Authority/version | Reach | Public reminder | Evidence |
| --- | --- | --- | --- |
| Wisconsin DNR 2026–2027 fishing guides | Lake Michigan tributary to first impassable barrier | `Check current Wisconsin regulations, facility operations, posted signs, fish-consumption advice, and property access before fishing. Section names do not guarantee access or safety.` | E-003, E-007 |
| DNR Root River facility/report | Lincoln Park facility | Operations vary with water and fish numbers; public copy cannot promise a processing schedule or upstream passage | E-001, E-008 |

**Prominent seasonal copy lock:** from Sept. 15 through the first Saturday in
May, Lake Michigan tributary hook-and-line fishing is prohibited from one-half
hour after sunset to one-half hour before sunrise. This warning must appear in
the run surface before section guidance, not only behind a regulations link.
The facility/weir warning must be equally prominent whenever Lincoln Park is
shown. Exact dates and any emergency or posted restrictions are rechecked at
release. [E-003, E-007, E-011]

The lower Root River has a waterbody-specific impairment/fish-consumption
history; link current advice in source details. Do not turn water-quality status
into a River Run activity score. [E-002]

## 5. Source coverage and weather

| Source | Metrics/role | Reach/limitation | Probe result 2026-08-26 | History | Decision |
| --- | --- | --- | --- | --- | --- |
| USGS 04087240, Root River at Racine | Primary discharge and gauge height | 350 ft below Horlick Dam, 5.2 mi above mouth, upstream of the proposed facility endpoint; upper-river context only | 190 numeric readings over two days, 15-min cadence; latest 36.0 CFS and 2.48 ft at 2026-08-25 23:00Z, provisional | Daily record from Aug. 1963; DOY normals returned | feasible with strong reach label and owner acceptance |
| USGS 04087234, Root River at 60th St near Caledonia, `00010` | Measured water temperature | Far upstream of Horlick and the product corridor, near the return-flow monitoring reach; upper-river input only | 600 numeric readings for Aug. 1–25; hourly cadence; latest 23.2 °C at 2026-08-25 23:00Z | continuous project record from 2017; exact usable-day/gap audit still required | accept current/trend with explicit station and reach; no date average yet |
| USGS 040872342, Root River at W. Eight Mile Rd, `00010` | Alternate measured temperature | Same far-upstream monitoring area | 2,211 numeric readings for Aug. 1–25; nominal 15-min series with material gaps; latest 23.1 °C at 2026-08-25 23:00Z | `00010` from 2024; separate `00011` final-temperature record is unsupported by the current adapter | retain as audited alternate, not primary |
| USGS 04087240 `00010` | Candidate co-located temperature | Horlick hydraulic station | zero returned readings | no continuous series | reject only at this station; not evidence that the river has no live temperature |
| Open-Meteo `42.7514,-87.8236` | Modeled weather | Horlick/upper Racine grid; not river measurement | HTTP 200, 24 hourly numeric values, `America/Chicago`, °C/mm | shared adapter contract | accept as modeled context only |

Both accepted stations are physically above the proposed product endpoint. They
describe upstream input, but public copy must not call either a lower-river
measurement or imply that fish can pass the facility. Flow/height and
temperature come from different stations and may never be collapsed into a
single unnamed `Root River gauge`.

Provider faults fail closed. A later valid reading must restore automatically without a code/configuration change.

## 6. Supported species decision and shared comparison matrix (preliminary)

| Candidate | Gate 2 evidence | Gate 3 requirement |
| --- | --- | --- |
| Chinook | DNR explicitly says migrating Chinook enter in fall/spring context and are handled at the facility | quantify current recurrence, strength, distribution, and exact fall calendar |
| Coho | DNR explicitly says migrating Coho enter and facility is backup egg source | independently assess dependable opportunity and strength |
| Steelhead | Facility is Wisconsin's primary steelhead egg/brood source and publishes recurring fall/spring reports | assess fall-entry run separately from spring/overwinter lifecycle |
| Lake-run Brown Trout | Current DNR reports document adult brood collection from Root, recurring fall facility encounters, and upstream passage | Gate 3 proposes 7/10 broad distribution; model later arrival and repeat survival in a separate engine |

## 7. Evidence ledger

| ID | Authority/title | URL | Accessed | Facts/limits |
| --- | --- | --- | --- | --- |
| E-001 | Wisconsin DNR, Root River Steelhead Facility | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ROOTRIVER | 2026-08-26 | All candidate species, weir/ladder/processing; release side unstated |
| E-002 | Wisconsin DNR, Root River water detail | https://apps.dnr.wi.gov/water/waterDetail.aspx?key=4714703 | 2026-08-26 | River miles, counties, impairment context |
| E-003 | Wisconsin DNR, fishing-season definitions | https://dnr.wisconsin.gov/topic/Fishing/seasons/definitions.html | 2026-08-26 | Lake Michigan tributary scope to first barrier |
| E-004 | Wisconsin DNR, Lake Michigan drainage/VHS barrier table | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf | 2026-08-26 | Horlick is first impassable barrier |
| E-005 | Wisconsin DNR, Root River access map | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverAccess.pdf | 2026-08-26 | Recognizable parks/facility/Horlick order; map disclaims access guarantee |
| E-006 | USGS, monitoring location 04087240 | https://waterdata.usgs.gov/monitoring-location/USGS-04087240/ | 2026-08-26 | Gauge coordinates, history, timezone, drainage area |
| E-007 | Wisconsin DNR, 2026–2027 fishing regulations | https://dnr.wisconsin.gov/topic/fishing/regulations | 2026-08-26 | Current regulatory authority |
| E-008 | Wisconsin DNR, Root River Report | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/rootriverreport | 2026-08-26 | Seasonal operations/report cadence; operational page changes |
| E-009 | Wisconsin DNR, fall fishing access brochure | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf | 2026-08-26 | 6th Street and candidate species context; older guide |
| E-010 | USGS API probes | https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items | 2026-08-26 | Exact values/cadence/units and absent temperature |
| E-011 | Wisconsin DNR, fall shore fishing close to Milwaukee | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html | 2026-08-26 | Sept. 15–first-Saturday-in-May Lake Michigan tributary night restriction |
| E-012 | Wisconsin DNR/Waukesha, 2024 Root River monitoring report | https://dnr.wisconsin.gov/sites/default/files/topic/WaterUse/Waukesha/2025WaukeshaWaterDiversionReport.pdf | 2026-08-26 | Continuous upstream temperature program, station context, cadence and offloaded-sonde limitations |
| E-013 | USGS, monitoring locations 04087234 and 040872342 | https://waterdata.usgs.gov/monitoring-location/USGS-04087234/ | 2026-08-26 | Temperature station identity/history; exact freshness established through E-010 API probe |
| E-014 | Monitor My Watershed public site catalog | https://monitormywatershed.org/browse/ | 2026-08-26 | Full public catalog spatial/name audit found no Root corridor station; catalog is not a substitute for USGS project stations |
| E-015 | Wisconsin DNR, Root River fall 2025 facility summary | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSummaryFall2025.pdf | 2026-08-26 | Species totals and direct upstream-passage totals resolve the facility release-side uncertainty |
| E-016 | Wisconsin DNR, 2025 Lake Michigan GLFC report | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf | 2026-08-26 | 305 adult Brown Trout sourced from Root for 2024 brood sampling; sample is not a total return |
| E-017 | Wisconsin DNR, 2024 Lake Michigan Salmonid Stocking Summary | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf | 2026-08-26 | 35,988 Brown Trout yearlings stocked in Root; stocking is not a return count |
| E-018 | Owner-relayed Wisconsin local field knowledge | Conversation record | 2026-08-26 | Root is a good fall Steelhead river; supports the owner-selected 7/10 opportunity calibration but is not a systematic count |
| E-019 | Wisconsin DNR, Root River 2019–2020 report | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiver2019-2020Report.pdf | 2026-08-26 | Facility captures are a subset of seasonal migration; fish can pass before installation or bypass during high flows, so processing totals do not measure the overall return |

## 8. Decisions and gate

| ID | Issue | Resolution/status |
| --- | --- | --- |
| D-001 | Facility ladder versus blocked upstream migration | Treat facility as operational barrier; end initial corridor below it |
| D-002 | Gauge is above proposed endpoint | Owner accepted explicitly labeled upstream context on 2026-08-26 |
| D-003 | Initial audit found no temperature at 04087240 | Corrected after regional/provider audit: accept live `00010` at 04087234 as separately labeled far-upstream temperature context |
| D-004 | Exact section labels/endpoints | Owner approved on 2026-08-26 |
| D-005 | Seasonal/section restrictions in copy | Owner requires prominent pre-guidance warning; locked above for Gate 3 |
| D-006 | Fall 2025 report proves upstream passage at the facility | Correct the absolute-barrier rationale; retain facility as owner-approved v1 product endpoint because passage is operational and no above-facility product section was approved |
| D-007 | Small fall Steelhead facility totals appeared to contradict local experience | Resolved: the DNR describes facility captures as a bounded subset rather than a census. Accept the owner/local 7/10 fall-opportunity calibration, retain medium confidence in its exact ceiling, and use DNR multi-strain timing to shape the run phases |

- [x] Exact river identity, mouth, barrier sequence, regulation sources, and live-source feasibility researched.
- [x] Species occurrence/recurrence has strong preliminary agency support.
- [x] Owner approved exact labels, conservative facility endpoint, and explicitly labeled upstream source limitations.
- [x] Broader USGS, Monitor My Watershed, Wisconsin DNR/SWIMS, and Great Lakes source audit completed; Root temperature correction recorded.
- [x] Gate 3 portfolio establishes species-specific truth and distribution; owner approved the ratings and identified them as Wisconsin-local field calibrations.
- [x] Gate 4A four-species packets, calendars, curves, corridor copy,
      Fishability, Gauge Read, hidden registry, and focused QA implemented.
- [x] Owner approved Gate 4A truth/copy implementation.
- [x] Gate 4B weather-only Activity implemented and historically replayed for
      all four species; Push and Migration Timing remain unavailable.
- [x] Owner approved Gate 4B Activity behavior/replay on 2026-08-26.
- [ ] Facility operations/rules rechecked before release.

**Foundation decision:** `hidden_gate4b_ready_for_owner_review`
**Research version:** `root-foundation-v4-gate4b-2026-08-26`
