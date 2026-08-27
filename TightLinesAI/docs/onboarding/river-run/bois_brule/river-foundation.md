# Bois Brule River River Run Foundation

**River ID:** `bois_brule` **State:** `WI` **Researched:** 2026-08-26\
**Status:** `gate_4b_owner_approved` **Owner section approval:**
`approved_2026-08-26`

> Scope is the 44-mile Bois Brule River in Douglas County flowing north to Lake
> Superior. It expressly excludes the Wisconsin–Michigan boundary Brule River.

## 0. Research context

- Wisconsin/Great Lakes runtime types fit.
- Actual USGS and weather endpoints were probed.
- Fall River Run scope is deliberately limited to the lower river north of U.S.
  Highway 2 because current season dates differ above Highway 2.

## 1. Exact identity and excluded namesake

| Field                 | Researched value                                                                                                                                                              | Evidence     | Status                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------- |
| Public name           | Bois Brule River (also locally shortened to Brule River)                                                                                                                      | E-001, E-002 | verified                            |
| Jurisdiction/timezone | Douglas County, Wisconsin; entire river in Brule River State Forest; `America/Chicago`                                                                                        | E-001, E-006 | verified                            |
| Mouth                 | Lake Superior; orientation point about `46.754, -91.607`                                                                                                                      | E-001, E-005 | verified; map-derived coordinate    |
| Full river            | 43.92/approximately 44 miles; spring-fed; source near Solon Springs; flows north and falls about 420 ft                                                                       | E-001, E-002 | verified                            |
| Fall product corridor | Lake Superior mouth upstream to downstream side of U.S. Highway 2 bridge                                                                                                      | E-003, E-004 | conservative regulation-based limit |
| Excluded namesake     | Brule River forming part of the WI–MI boundary in Florence/Forest (WI) and Iron (MI), flowing from Brule Lake southeast to the Michigamme and then Menominee/Green Bay system | E-010, E-011 | explicitly excluded                 |

No source, barrier, regulation, gauge, or species fact from the boundary Brule
may be reused for this Lake Superior river.

## 2. Proposed public sections — owner decision required

| Section ID               | Proposed label      | Downstream boundary             | Upstream boundary                        | Order | Passage/closure caveat                                                                                | Gauge coverage                             | Evidence            |
| ------------------------ | ------------------- | ------------------------------- | ---------------------------------------- | ----: | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------- |
| `bois_brule_mouth_lower` | Mouth & Lower River | Lake Superior mouth             | downstream edge of 500-ft fishway refuge |     1 | Open lake entry; never direct inside refuge                                                           | USGS gauge is upstream of Hwy 2            | E-003, E-005        |
| `bois_brule_rapids`      | Rapids Reach        | upstream edge of fishway refuge | County Highway FF                        |     2 | Trout/salmon pass fishway; Box Car Hole and Mays Ledges seasonal refuges must be excluded when closed | Gauge is upstream context                  | E-003, E-005, E-009 |
| `bois_brule_upper_lower` | Upper Lower River   | County Highway FF               | downstream side of U.S. Highway 2        |     3 | Lower-river fall season applies; do not send users south of Hwy 2 after that reach closes             | Gauge is just upstream/context, not direct | E-003, E-004, E-006 |

Exact wording proposed:

- `Mouth & Lower River — Lake Superior to the Fishway Refuge`
- `Rapids Reach — Fishway Refuge to County Highway FF`
- `Upper Lower River — County Highway FF to Highway 2`

The slightly unusual `Upper Lower River` wording preserves DNR's regulatory
concept of the lower river (north of Hwy 2) while distinguishing its upstream
portion. Owner may choose `Highway 2 Reach` if clearer, without changing
endpoints.

## 3. Barrier, passage, and refuge inventory

| Structure/area                                 | Status/location                                                                                         | Species response                                                                                                                                                                                                            | Product consequence                                                              | Closure                                                            | Evidence            | Confidence |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------- | ---------- |
| Sea lamprey barrier/fishway at Kleppen's Falls | Permanent low-head barrier about 6 mi above Lake Superior; rebuilt fishway fully operational since 1986 | Adjustable fishway is designed to pass trout and salmon while blocking lamprey; current annual video counts directly prove Chinook, Coho, Steelhead, and Brown Trout passage. Movement still varies with water/temperature. | Corridor can continue upstream, but never through the refuge in fishing guidance | 500 ft upstream and downstream never open to fishing               | E-003, E-005, E-008 | high       |
| Box Car Hole refuge                            | Marked lower-river refuge                                                                               | Not a biological barrier                                                                                                                                                                                                    | Exclude from fishing guidance July 15–Oct. 31                                    | seasonal closure                                                   | E-003               | high       |
| Mays Ledges / Skid Mays refuge                 | Marked lower-river refuge                                                                               | Not a biological barrier                                                                                                                                                                                                    | Exclude Sept. 1–May 31                                                           | seasonal closure                                                   | E-003               | high       |
| U.S. Highway 2 regulatory boundary             | Not a physical barrier                                                                                  | Migratory fish can occur above; fall public season differs                                                                                                                                                                  | Initial fall product endpoint on downstream side                                 | above-Hwy-2 general section closes Sept. 30 under current DNR page | E-004               | high       |

No additional impassable mainstem structure was identified from the fishway to
Highway 2 in DNR's lower-river map, fishway account, fishing page, and creel
survey. Rapids/ledges are not automatically classified as fish barriers.

### Species endpoint and passage-chain decision

Current fishway counts prove Chinook, Coho, Steelhead, and lake-run Brown Trout
passage through the only material structure in the lower chain. The fall product
endpoint for all four is Highway 2 for regulatory, not biological, reasons;
closed refuge areas remain excluded within that corridor.

## 4. Current regulations and access

| Authority/version                                          | Reach                             | Required public reminder                                                                                                                                                                                                                                                                   | Evidence            |
| ---------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| Wisconsin DNR current Brule page and 2026–2027 trout guide | Hwy 2 downstream to Lake Superior | Season currently last Saturday in March–Nov. 15; night restriction, trout-stamp, length/bag rules, and special refuges apply. Evergreen copy must say: `Check current Wisconsin regulations and every posted refuge sign before fishing. Section names do not guarantee access or safety.` | E-003, E-004, E-007 |
| Brule River State Forest                                   | entire corridor                   | Day-use/access and camping rules apply; marked fishing access does not establish safe wading or unrestricted shoreline access                                                                                                                                                              | E-002, E-003        |

Exact limits and dates belong in current regulation details, not scoring copy.
Recheck them and all refuge signs immediately before release.

**Prominent seasonal/section copy lock:** before any section guidance, show that
the lower river is open only from the last Saturday in March through Nov. 15 and
is closed to fishing from one-half hour after sunset to one-half hour before
sunrise. Within that season, Box Car Hole is closed July 15–Oct. 31, Mays
Ledges/Skid Mays is closed Sept. 1–May 31, and the signed 500-ft refuge on both
sides of the sea-lamprey barrier is never open. Do not rely on a generic
regulations link for these closures. [E-003, E-004]

## 5. Source coverage and weather

| Source                                                      | Metrics/role                            | Reach/limitation                                                                                                                                                | Probe result 2026-08-26                                                                                          | History                                                                         | Decision                                                          |
| ----------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| USGS 04025500, Bois Brule River at Brule                    | Primary discharge and gauge height      | 1.4 mi southwest of Brule and upstream of the Hwy 2 fall endpoint; measures upper input, not lower rapids/mouth directly; winter ice can affect stage/discharge | 190 numeric readings over two days, 15-min cadence; latest 105 CFS and 1.40 ft at 2026-08-25 23:00Z, provisional | Daily discharge Oct. 1942–Sep. 1981 and Jan. 1984–present; DOY normals returned | feasible as upstream hydraulic context, owner acceptance required |
| USGS 04025500 `00010`                                       | Candidate measured temperature          | same station                                                                                                                                                    | zero returned readings                                                                                           | no continuous accepted temperature                                              | reject; partial Gauge Read                                        |
| USGS 04026005, Bois Brule River near Lake Superior, `00010` | Lower-river historical temperature      | In the desired lower corridor                                                                                                                                   | no current observations; station discontinued                                                                    | approved 15-minute observations support 101 exact-date 2021-2023 normals        | accept as historical-only context; never current or scored        |
| USGS regional temperature search                            | Candidate alternate continuous stations | Bois Brule regional bounding area                                                                                                                               | zero `00010` observations in the latest 14 days                                                                  | no current alternate established                                                | reject                                                            |
| Monitor My Watershed public catalog                         | Candidate non-USGS sensors              | full catalog spatial/name audit                                                                                                                                 | no Bois Brule station                                                                                            | none                                                                            | reject                                                            |
| Wisconsin DNR SWIMS / fishway reports                       | Candidate state/manual sources          | logger/project records and periodic fishway updates                                                                                                             | no stable, current machine-readable temperature feed established                                                 | research/report context only                                                    | reject for Gauge Read                                             |
| Open-Meteo `46.5378,-91.5953`                               | Modeled weather                         | Brule/Hwy 2 grid point, not whole lower corridor                                                                                                                | HTTP 200; `America/Chicago`; 24 hourly numeric °C/mm values                                                      | shared adapter                                                                  | accept as modeled context only                                    |

Provider faults fail closed. A later valid reading must restore automatically
without a code/configuration change.

## 6. Supported species decision and shared comparison matrix (preliminary)

| Candidate            | Gate 2 evidence                                                                                                      | Gate 3 requirement                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chinook              | DNR documents a recurring but smaller run and counted 612 at the 2025 fishway                                        | calibrate conservative strength/calendar/distribution independently                                                                                 |
| Coho                 | DNR documents lower-river run and counted 2,090 at the 2025 fishway                                                  | quantify run curve and section distribution                                                                                                         |
| Steelhead            | DNR identifies the river as a destination fishery; 2025 fall fishway count 4,497, with annual index work             | separate fall entry from overwinter/spring lifecycle                                                                                                |
| Lake-run Brown Trout | Direct 2025 fishway count of 3,143 and stable five-year series of 2,694–3,436 establish a strong self-sustaining run | Owner selected a conservative 7/10 with broad lower-river distribution; DNR sets the run early July–late October with a mid-July–mid-September peak |

These figures prove recurrence and passage at the fishway, not equal strength,
equal timing, or uniform distribution among sections.

## 7. Evidence ledger

| ID    | Authority/title                                        | URL                                                                                                                                   | Accessed   | Facts/limits                                                              |
| ----- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| E-001 | Wisconsin DNR, Bois Brule water detail                 | https://apps.dnr.wi.gov/water/waterDetail.aspx?key=17513                                                                              | 2026-08-26 | 43.92 miles, Douglas County, Lake Superior fishery and candidate species  |
| E-002 | Wisconsin DNR, Brule River State Forest history        | https://dnr.wisconsin.gov/topic/StateForests/bruleriver/history                                                                       | 2026-08-26 | Entire 44 miles in state forest, spring-fed, 420-ft fall                  |
| E-003 | Wisconsin DNR, Brule River State Forest fishing        | https://dnr.wisconsin.gov/topic/StateForests/bruleriver/recreation/fishing                                                            | 2026-08-26 | License/stamp and three refuge closures                                   |
| E-004 | Wisconsin DNR, Fishing the Brule River                 | https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing                                                                 | 2026-08-26 | Candidate runs, lower/upper Hwy 2 regulations, access caveats             |
| E-005 | Wisconsin DNR, sea lamprey barrier and fishway         | https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/lampreybarrier.html                                                              | 2026-08-26 | Barrier location/design, trout/salmon passage and monitoring              |
| E-006 | USGS, monitoring location 04025500                     | https://waterdata.usgs.gov/monitoring-location/USGS-04025500/                                                                         | 2026-08-26 | Gauge location, history, timezone, drainage area                          |
| E-007 | Wisconsin DNR, 2026–2027 fishing regulations           | https://dnr.wisconsin.gov/topic/fishing/regulations                                                                                   | 2026-08-26 | Current regulation authority                                              |
| E-008 | Wisconsin DNR, 2025 fall fishway update                | https://dnr.wisconsin.gov/sites/default/files/topic/documents/DNR%20Lower%20Bois%20Brule%20River%20Fall%20Fishway%20Update%202025.pdf | 2026-08-26 | Current counts/timing and actual passage for all candidates               |
| E-009 | Wisconsin DNR, lower Bois Brule creel survey 2016–2018 | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LS_LowerBoisBruleRiverCreelSurvey2018.pdf                                 | 2026-08-26 | Official lower-river landmark order/map; older creel period               |
| E-010 | Wisconsin DNR, fishing-season definitions              | https://dnr.wisconsin.gov/topic/Fishing/seasons/definitions.html                                                                      | 2026-08-26 | WI–MI boundary-water Brule identity/context                               |
| E-011 | Wisconsin DNR, boundary Brule water detail             | https://apps.dnr.wi.gov/water/waterDetail.aspx?key=12160                                                                              | 2026-08-26 | Excluded Brule originates in MI and joins Michigamme/Menominee system     |
| E-012 | USGS API probes                                        | https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items                                                                 | 2026-08-26 | Exact live values/cadence/units and absent temperature                    |
| E-013 | USGS, discontinued monitoring location 04026005        | https://waterdata.usgs.gov/monitoring-location/USGS-04026005/                                                                         | 2026-08-26 | Historical lower-river temperature ended 2025-01-27; not a current source |
| E-014 | Monitor My Watershed public site catalog               | https://monitormywatershed.org/browse/                                                                                                | 2026-08-26 | Full public catalog spatial/name audit; no Bois Brule station             |
| E-015 | Wisconsin DNR, SWIMS database                          | https://dnr.wisconsin.gov/topic/SurfaceWater/SWIMS                                                                                    | 2026-08-26 | Monitoring/logger repository, not a verified current Bois Brule app feed  |

## 8. Decisions and gate

| ID    | Issue                                                     | Resolution/status                                                                                                                                                                    |
| ----- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D-001 | Which Brule river is in scope?                            | Only Douglas County Bois Brule to Lake Superior; boundary Brule excluded                                                                                                             |
| D-002 | Fishway is barrier and passage facility                   | Record both truths; passage documented, refuge always closed                                                                                                                         |
| D-003 | Migratory fish can pass Hwy 2 but fall regulations differ | Use Hwy 2 as product limit, not biological limit                                                                                                                                     |
| D-004 | Gauge lies upstream of product reach                      | Owner accepted explicitly labeled upstream input on 2026-08-26                                                                                                                       |
| D-005 | Exact section labels                                      | Owner approved on 2026-08-26                                                                                                                                                         |
| D-006 | Seasonal/refuge restrictions in copy                      | Owner requires prominent pre-guidance warnings; exact locks recorded above                                                                                                           |
| D-007 | No measured temperature at primary gauge                  | Broader USGS/MMW/DNR audit found only a discontinued lower-river series; retain honest partial Gauge Read and show qualified exact-date history without claiming current temperature |

- [x] Identity/namesake exclusion, corridor, passage, refuges, regulations, and
      sources researched.
- [x] All four candidates have strong agency recurrence/passage evidence,
      including an independently assessed lake-run Brown Trout profile.
- [x] Owner approved labels, Hwy 2 product endpoint, and explicitly labeled
      upstream-gauge limitation.
- [x] Broader non-USGS temperature-source audit completed.
- [x] Gate 3 portfolio strength/distribution decisions owner approved.
- [x] Four independent calendars, curves, lifecycle behavior, and
      restriction-first Stage copy implemented for Gate 4A review.
- [ ] Release-time regulation/refuge/source recheck completed.

**Foundation decision:** `gate_4a_truth_copy_ready_for_owner_review`\
**Research version:** `bois-brule-foundation-v3-gate4a-2026-08-26`
