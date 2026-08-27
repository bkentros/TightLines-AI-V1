# Sheboygan River River Run Foundation

**River ID:** `sheboygan` **State:** `WI` **Researched:** 2026-08-26\
**Status:** `gate_4b_hidden_owner_review` **Owner section approval:**
`approved_2026-08-26`

> Gate 4A truth and copy are owner-approved. Gate 4B now adds hidden, Limited
> weather-only Activity for all four species with fixed 2007-2025 replay. I-43
> hydraulics remain scoped to Fishability and Gauge Read; no river temperature
> or river response is inferred in Activity.

## 0. Research context

- Branch/worktree inspected; only this generated onboarding workspace is in
  scope.
- Wisconsin/Great Lakes runtime types fit without expansion.
- Live sources were verified against real provider endpoints, not station names
  alone.

## 1. Identity and corridor

| Field                 | Researched value                                                                                    | Evidence     | Status                                 |
| --------------------- | --------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------- |
| Public name           | Sheboygan River                                                                                     | E-001, E-002 | verified                               |
| Jurisdiction/timezone | Wisconsin; Sheboygan County in product corridor; `America/Chicago`                                  | E-001, E-006 | verified                               |
| Mouth                 | Sheboygan Harbor, Lake Michigan; orientation point about `43.748, -87.694`                          | E-001, E-003 | verified; map-derived coordinate       |
| Product corridor      | Mouth upstream to downstream face of Waelderhaus Dam in Kohler                                      | E-002, E-004 | conservative                           |
| Approximate corridor  | DNR describes mouth-to-Waelderhaus as about 9.9 river miles; broader AOC reaches to Sheboygan Falls | E-002, E-003 | verified with source-scope distinction |
| Repeated-name risk    | Lake Michigan Sheboygan River, not another same-name drainage                                       | E-001        | resolved                               |

## 2. Proposed public sections — owner decision required

| Section ID         | Proposed label      | Downstream boundary        | Upstream boundary                  | Order | Passage/caveat                                                                                  | Gauge coverage                                          | Evidence            |
| ------------------ | ------------------- | -------------------------- | ---------------------------------- | ----: | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------- |
| `sheboygan_harbor` | Harbor & Lower City | Lake Michigan mouth        | Kiwanis Park                       |     1 | Open lake entry; harbor influence increases downstream                                          | USGS gauge is upstream                                  | E-003, E-009        |
| `sheboygan_urban`  | Urban River         | Kiwanis Park               | I-43 / USGS gauge vicinity         |     2 | No current impassable barrier identified in this reach                                          | USGS 04086000 directly measures the upper boundary area | E-006, E-009        |
| `sheboygan_kohler` | Kohler Reach        | I-43 / USGS gauge vicinity | downstream face of Waelderhaus Dam |     3 | Ends below first DNR-listed impassable barrier; do not imply public access on private shoreline | Gauge is downstream proxy/context                       | E-002, E-004, E-009 |

Exact wording proposed:

- `Harbor & Lower City — Lake Michigan to Kiwanis Park`
- `Urban River — Kiwanis Park to I-43`
- `Kohler Reach — I-43 to Waelderhaus Dam`

## 3. Barrier and passage inventory

| Structure                  | Status/order                                                                                                  | Species passage                                                                              | Product consequence                  | Evidence     | Confidence                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------ | ------------ | ---------------------------------------------- |
| Waelderhaus/Walderhaus Dam | Existing low dam in Kohler; current DNR VHS table names it as the first impassable barrier from Lake Michigan | Treat impassable for Chinook, Coho, Steelhead, and lake-run Brown Trout                      | Hard upstream boundary below dam     | E-002, E-004 | high                                           |
| River Bend Dam             | Existing/historically documented upstream of Waelderhaus                                                      | Not needed for mouth-to-product chain because Waelderhaus blocks first; do not claim passage | Outside product corridor             | E-002, E-005 | high for existence/order; passage not assessed |
| Sheboygan Falls Dam        | Existing farther upstream                                                                                     | Outside product chain                                                                        | Outside product corridor             | E-003, E-005 | high                                           |
| Franklin Dam               | Removed in 2001, well upstream                                                                                | No current barrier                                                                           | Historical only and outside corridor | E-010        | high                                           |

Older records use variants `Waelderhaus`, `Walderhaus`, `Roller Mills`, and
separate River Bend references. The current DNR waterbody and VHS records govern
the product decision: the lower migratory reach ends at Waelderhaus. Gate 3 may
not infer abundance above it from older AOC-wide salmon observations.

### Species endpoint and passage-chain decision

For Chinook, Coho, Steelhead, and lake-run Brown Trout, the mouth-to-endpoint
chain contains no documented impassable structure before Waelderhaus. All four
physical endpoints are therefore the downstream face of Waelderhaus. Gate 3
independently established recurring broad opportunity for every species.

## 4. Regulations, contamination, and access

| Authority/version                                   | Reach                                           | Public reminder                                                                                                                                                    | Evidence     |
| --------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Wisconsin DNR 2026–2027 fishing guides              | Lake Michigan tributary to first impassable dam | `Check current Wisconsin regulations, fish-consumption advice, posted signs, and property access before fishing. Section names do not guarantee access or safety.` | E-004, E-008 |
| DNR/EPA Sheboygan AOC and fish-consumption guidance | Harbor/lower river through Sheboygan Falls      | Keep current advisory link in details; do not turn contamination history into a fishing-quality score                                                              | E-003, E-011 |

**Prominent seasonal copy lock:** from Sept. 15 through the first Saturday in
May, Lake Michigan tributary hook-and-line fishing is prohibited from one-half
hour after sunset to one-half hour before sunrise. This warning must appear
before section guidance, not only behind a regulations link. Exact dates,
advisories, emergency orders, and posted restrictions are rechecked at release.
[E-008, E-012]

Substantial Kohler shoreline is not established as public access by the reviewed
agency material. No run copy may promise access merely because a section has a
public name. Recheck current rules/advisories immediately before release.

## 5. Source coverage and weather

| Source                                       | Metrics/role                            | Reach/limitation                                                                                                                 | Probe result 2026-08-26                                                                                               | History/risk                                                                                                                      | Decision                                                          |
| -------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| USGS 04086000, Sheboygan River at Sheboygan  | Primary discharge and gauge height      | 0.2 mi below I-43, 3.9 mi above mouth; good Urban Reach measurement, downstream context for Kohler, not harbor truth             | 190 numeric observations over two days, 15-min cadence; latest 64.1 CFS and 1.92 ft at 2026-08-25 23:00Z, provisional | Daily record 1916–1924 and 1950–present; DOY normals returned. USGS warns station may be discontinued 2026-10-01 without funding. | feasible now; owner must accept fragility and pre-release recheck |
| USGS 04086000 temperature `00010`            | Candidate measured water temperature    | same point                                                                                                                       | zero observations in exact probe                                                                                      | no supported continuous series                                                                                                    | reject; show partial Gauge Read                                   |
| USGS regional temperature search             | Candidate alternate continuous stations | Sheboygan River basin/corridor bounding area                                                                                     | zero `00010` observations across the regional 14-day API search                                                       | no current alternate established                                                                                                  | reject                                                            |
| Monitor My Watershed public catalog          | Candidate non-USGS sensor network       | full public catalog, filtered spatially and by river/place identity                                                              | no Sheboygan River station; nearby `MeteoTsu-2` is a stale 2019 Lake Michigan instrument                              | no live river series                                                                                                              | reject                                                            |
| Wisconsin DNR SWIMS / Water Condition Viewer | Candidate state logger network          | DNR repository includes continuous logger/project data, but no stable current Sheboygan River telemetry endpoint was established | retrieval/project data, not a verified fresh app feed                                                                 | useful for research/history only                                                                                                  | reject for Gauge Read                                             |
| GLOS Sheboygan Spotter buoy                  | Candidate Great Lakes observing network | Lake Michigan offshore/nearshore, not the Sheboygan River                                                                        | live sea-water temperature is a different waterbody/reach                                                             | lake history only                                                                                                                 | reject as river temperature                                       |
| Open-Meteo `43.7414,-87.7521`                | Modeled weather                         | I-43/urban grid point; not river measurement                                                                                     | HTTP 200; 24 hourly values; `America/Chicago`; °C/mm units                                                            | shared forecast/archive contract                                                                                                  | accept as modeled context                                         |

**Source-risk SR-SHE-001:** the only accepted hydraulic gauge carries an
official possible-discontinuation notice for Oct. 1, 2026. A missing source will
fail closed safely, but an advertised Gauge Read may become permanently
unavailable. Recheck funding/status immediately before configuration and again
before public release; either document owner acceptance of partial/no-gauge
fallback or find and fully audit a stable replacement. This does not affect
already submitted builds because the river is not configured there.

Provider faults fail closed. A later valid reading must restore automatically
without a code/configuration change.

## 6. Supported species decision and shared comparison matrix (preliminary)

| Candidate            | Gate 2 evidence                                                                                                               | Gate 3 requirement                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Chinook              | DNR AOC plan documents Chinook entering in the fall; current corridor reaches first barrier                                   | prove current recurrence, strength, distribution, and calendar                                              |
| Coho                 | Same DNR plan documents Coho fall entry; current evidence is older                                                            | find current corroboration and calibrate independently                                                      |
| Steelhead            | DNR access material lists Steelhead in the river; older plan documents fall and spring Rainbow runs                           | prove fall-entry opportunity and current distribution                                                       |
| Lake-run Brown Trout | Current DNR stocking, county creel, and direct Brown listings at Kiwanis, Esslingen, and Kohler independently support the run | Owner selected 8/10 broad distribution with medium evidence confidence; a separate Brown engine is required |

## 7. Evidence ledger

| ID    | Authority/title                                             | URL                                                                                            | Accessed   | Facts/limits                                                                                                        |
| ----- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| E-001 | Wisconsin DNR, Sheboygan River Basin                        | https://dnr.wisconsin.gov/topic/Watersheds/basins/sheboygan                                    | 2026-08-26 | Watershed identity and Lake Michigan drainage                                                                       |
| E-002 | Wisconsin DNR, Sheboygan River water detail                 | https://apps.dnr.wi.gov/water/waterDetail.aspx?key=11354                                       | 2026-08-26 | Mouth-to-Waelderhaus reach, river miles, structure order; monitoring records do not alone prove passage             |
| E-003 | Wisconsin DNR, Sheboygan River AOC                          | https://dnr.wisconsin.gov/topic/GreatLakes/Sheboygan.html                                      | 2026-08-26 | Harbor/lower-river identity and 14-mile AOC; contamination context                                                  |
| E-004 | Wisconsin DNR, Lake Michigan drainage/VHS barrier table     | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf   | 2026-08-26 | Current first impassable barrier is Waelderhaus                                                                     |
| E-005 | U.S. EPA, Sheboygan Harbor and River Superfund site         | https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.cleanup&id=0505188  | 2026-08-26 | Lower 14 miles and dam/corridor context; not current fishing rules                                                  |
| E-006 | USGS, monitoring location 04086000                          | https://waterdata.usgs.gov/monitoring-location/USGS-04086000/                                  | 2026-08-26 | Coordinates, data ranges, station discontinuation warning                                                           |
| E-007 | USGS API probes                                             | https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items                          | 2026-08-26 | Live values/cadence/units/status and absent temperature                                                             |
| E-008 | Wisconsin DNR, 2026–2027 fishing regulations                | https://dnr.wisconsin.gov/topic/fishing/regulations                                            | 2026-08-26 | Current regulation authority; release-time check                                                                    |
| E-009 | Wisconsin DNR, Milwaukee-area fall fishing/access brochure  | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf          | 2026-08-26 | Kiwanis/Esslingen/Kohler recognizable access and candidate fish; older access guide, so no present access guarantee |
| E-010 | Sheboygan County, Dams in Sheboygan County                  | https://www.sheboygancounty.com/home/showpublisheddocument/20674/639045999472370000            | 2026-08-26 | Franklin removal and county dam context                                                                             |
| E-011 | Wisconsin DNR, 1989 Sheboygan River AOC plan                | https://widnr.widen.net/content/ewzyiulpvw/pdf/GW_SHE_RAP1989.pdf?u=chp45u                     | 2026-08-26 | Historic Coho/Chinook/Rainbow runs; old evidence requiring Gate 3 corroboration                                     |
| E-012 | Wisconsin DNR, fall shore fishing close to Milwaukee        | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html                          | 2026-08-26 | Sept. 15–first-Saturday-in-May Lake Michigan tributary night restriction                                            |
| E-013 | Monitor My Watershed public site catalog                    | https://monitormywatershed.org/browse/                                                         | 2026-08-26 | Full public catalog spatial/name audit; no current river station                                                    |
| E-014 | Wisconsin DNR, SWIMS database                               | https://dnr.wisconsin.gov/topic/SurfaceWater/SWIMS                                             | 2026-08-26 | State chemistry/physical/continuous-meter repository; no verified current feed for this product corridor            |
| E-015 | GLOS ERDDAP, Sheboygan Spotter buoy                         | https://seagull-erddap.glos.org/erddap/tabledap/obs_144.html                                   | 2026-08-26 | Lake Michigan water temperature; rejected as river measurement                                                      |
| E-016 | Wisconsin DNR, 2024 Lake Michigan Salmonid Stocking Summary | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf         | 2026-08-26 | 44,691 Brown Trout yearlings stocked in Sheboygan River; stocking is not return strength                            |
| E-017 | Wisconsin DNR, Lake Michigan harvest tables 2006–2024       | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables2006-2024.pdf | 2026-08-26 | Sheboygan County 2024 Brown harvest 500, including 56 stream fish; not an exact river count                         |

## 8. Decisions and gate

| ID    | Issue                                             | Resolution/status                                                                                                                                   |
| ----- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-001 | Multiple Kohler dams appear in historic documents | Use current first-barrier table; stop below Waelderhaus                                                                                             |
| D-002 | Current gauge may lose funding                    | Source feasible today; owner/risk decision and release-time status check required                                                                   |
| D-003 | No measured temperature                           | Broader USGS/MMW/DNR/GLOS audit still found no qualifying current river feed; honest partial Gauge Read; weather/lake temperature cannot substitute |
| D-004 | Exact labels/endpoints                            | Owner approved on 2026-08-26                                                                                                                        |
| D-005 | Seasonal/section restrictions in copy             | Owner requires prominent pre-guidance warning; locked above for Gate 3                                                                              |

- [x] Identity, corridor, barrier chain, regulations, live/historical source
      capability researched.
- [x] Unknown access and species-strength claims fail closed.
- [x] Owner approved section labels/endpoints and accepted the documented
      gauge-discontinuation risk with fail-closed handling.
- [x] Broader non-USGS temperature-source audit completed.
- [x] Gate 3 portfolio independently resolves all candidate species and owner
      approved 8/8/5/8 broad calibrations.
- [x] Gate 4A four-species calendars, corridor copy, seasonal curves,
      Fishability, partial Gauge Read, and hidden configuration implemented.
- [x] Owner approved Gate 4A truth/copy implementation.
- [x] Gate 4B Limited weather-only Activity implemented and historically
      replayed for all four species; missing weather fails closed.
- [x] Push and Migration Timing remain unavailable under the no-temperature
      contract.
- [ ] Owner approves the Gate 4B Activity candidate.
- [ ] Release-time source/regulation/advisory checks completed.

**Foundation decision:**
`hidden_gate4b_ready_for_owner_review_with_source_risk`\
**Research version:** `sheboygan-foundation-v4-gate4b-2026-08-26`
