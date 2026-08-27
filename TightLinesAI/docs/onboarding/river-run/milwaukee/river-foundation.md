# Milwaukee River River Run Foundation

**River ID:** `milwaukee` **State:** `WI` **Researched:** 2026-08-26\
**Status:** `gate_4b_activity_owner_review` **Owner section approval:**
`approved_2026-08-26`

> Foundation and Gate 4A truth/copy are owner-approved. Gate 4B Activity is
> implemented only in the hidden draft registry for owner review. Public
> enablement and release remain unauthorized.

## 0. Research context

- Branch: `develop/cross-platform-next`; existing unrelated marketing PNGs were
  not touched.
- Runtime region/schema fit: Wisconsin and `great_lakes` are already supported.
- Exact USGS and Open-Meteo endpoints were probed for timestamps, numeric
  values, units, cadence, and historical-normal availability.

## 1. Identity and corridor

| Field                 | Researched value                                                                         | Evidence     | Status                                                |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| Public name           | Milwaukee River                                                                          | E-001, E-002 | verified                                              |
| Jurisdiction/timezone | Wisconsin; Milwaukee and Ozaukee counties in the proposed corridor; `America/Chicago`    | E-002, E-006 | verified                                              |
| Mouth                 | Milwaukee Harbor / Lake Michigan; orientation point about `43.025, -87.899`              | E-001, E-009 | verified; coordinate is map-derived, not survey-grade |
| Product corridor      | Lake Michigan mouth upstream to the downstream face of Bridge Street Dam in Grafton      | E-003, E-004 | conservative and evidence-backed                      |
| Approximate corridor  | About 32 river miles to Bridge Street Dam                                                | E-003, E-004 | orientation only                                      |
| Repeated-name risk    | This is the Lake Michigan Milwaukee River system; no boundary-water namesake is in scope | E-001, E-002 | resolved                                              |

The Menomonee and Kinnickinnic join the Milwaukee in the estuary, but they are
not additional River Run corridors. Public copy must not extend Milwaukee River
guidance into either tributary. [E-001]

## 2. Proposed public sections — owner decision required

| Section ID                  | Proposed public label | Downstream boundary        | Upstream boundary                             | Order | Passage/caveat                                                                                             | Gauge coverage                                                         | Evidence            |
| --------------------------- | --------------------- | -------------------------- | --------------------------------------------- | ----: | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------- |
| `milwaukee_harbor_downtown` | Harbor & Downtown     | Lake Michigan mouth        | North Avenue                                  |     1 | Open from lake; estuary below North Avenue can experience lake-driven oscillation                          | No accepted mouth discharge; Estabrook gauge is upstream               | E-001, E-002, E-009 |
| `milwaukee_urban_greenway`  | Urban Greenway        | North Avenue               | Kletzsch Park fish passage                    |     2 | Former North Avenue and Estabrook dams are removed                                                         | USGS 04087000 at Estabrook Park directly represents part of this reach | E-002, E-004, E-006 |
| `milwaukee_north_shore`     | North Shore           | Kletzsch Park fish passage | downstream face of Bridge Street Dam, Grafton |     3 | Salmonids can pass Kletzsch; Mequon-Thiensville has a fishway; Bridge Street is the first complete barrier | Estabrook is downstream context, not a North Shore measurement         | E-003, E-004        |

Exact wording proposed for approval:

- `Harbor & Downtown — Lake Michigan to North Avenue`
- `Urban Greenway — North Avenue to Kletzsch Park`
- `North Shore — Kletzsch Park to Bridge Street Dam`

Section labels orient anglers; they do not promise access, passage under every
flow, wading safety, or uniform regulations.

## 3. Barrier, passage, and closure inventory

| Structure                        | Status/location                                                    | Chinook/Coho/Steelhead passage                                                                                                                               | Product consequence                                                                  | Closure                                      | Evidence     | Confidence                                        |
| -------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------- | ------------ | ------------------------------------------------- |
| North Avenue Dam                 | Removed; former river mile about 3                                 | No current barrier                                                                                                                                           | Historical landmark only                                                             | none found                                   | E-002, E-004 | high                                              |
| Estabrook Dam                    | Removed in 2018                                                    | No current barrier                                                                                                                                           | No endpoint                                                                          | none found                                   | E-004        | high                                              |
| Kletzsch Park Dam and bypass     | Dam remains; fish passage completed 2023/2024, about river mile 10 | DNR rule record says salmonids could pass the dam with relative ease even before the project; the bypass reconnects habitat. Passage remains flow-dependent. | May be crossed in the proposed corridor                                              | Fish refuge/no fishing in bypass; obey signs | E-003, E-005 | high for facility/refuge; medium-high for passage |
| Mequon-Thiensville Dam           | Dam with fishway completed 2010                                    | Fishway exists; sources do not prove species-neutral efficiency under every flow                                                                             | May be crossed, but copy must not promise unrestricted passage                       | no specific closure found                    | E-004        | medium                                            |
| Lime Kiln and Chair Factory dams | Removed                                                            | No current barriers                                                                                                                                          | Historical only                                                                      | none found                                   | E-004        | high                                              |
| Bridge Street Dam, Grafton       | Existing complete AIS/fish barrier, about river mile 32            | Treat as impassable for all four candidates                                                                                                                  | Hard upstream physical boundary; Brown v1 guidance ends earlier for evidence reasons | obey posted property/rules                   | E-003, E-004 | high                                              |

The mouth-to-endpoint structure chain is conservatively resolved for Gate 2.
Gate 3 must still prove useful species distribution through each proposed
section; physical passage alone does not establish dependable fishing.

### Species endpoint and passage-chain decision

For each candidate, the conservative physical endpoint is the downstream face of
Bridge Street Dam. Kletzsch and Mequon-Thiensville are intervening passage
facilities, so Gate 3 must still confirm current species distribution rather
than treating facility existence as equal abundance. The Gate 4B correction
recognizes the same Bridge Street physical endpoint for Brown Trout: Milwaukee
County documents Brown Trout traveling upriver and the structure record
identifies Bridge Street as the first complete fish barrier. Opportunity
guidance remains concentrated toward the lower river; passage does not establish
equal abundance in every section.

## 4. Regulations and access

| Authority/version                                           | Reach                                                         | Public reminder                                                                                                                                                             | Verified   | Evidence     |
| ----------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| Wisconsin DNR 2026–2027 hook-and-line and trout regulations | Lake Michigan tributary reach; Milwaukee River to Grafton Dam | `Check current Wisconsin regulations, posted fish-refuge signs, and property access before fishing. Section names are orientation ranges, not access or safety guarantees.` | 2026-08-26 | E-003, E-008 |
| Wisconsin DNR Kletzsch fish-refuge rule                     | Marked fish-passage area                                      | Do not direct users into the signed no-fishing bypass/refuge                                                                                                                | 2026-08-26 | E-005        |

**Prominent seasonal/section copy lock:** the Kletzsch fish-passage refuge is
closed to fishing year-round. In the Lake Michigan tributary reach, from Sept.
15 through the first Saturday in May, hook-and-line fishing is prohibited from
one-half hour after sunset to one-half hour before sunrise. Both warnings must
appear before section guidance when applicable, not only behind a regulations
link. Exact dates, refuge boundaries, emergency orders, and signs are rechecked
at release. [E-005, E-008, E-010]

Recheck current guides, emergency orders, and posted signs immediately before
release. Do not put harvest limits or tackle rules into evergreen run copy.

## 5. Source coverage and weather

| Source                                      | Metrics/role                                                        | Reach and limitation                                                                      | Probe result 2026-08-26                                                                                    | History                                                                                       | Decision                               |
| ------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------- |
| USGS 04087000, Milwaukee River at Milwaukee | Primary discharge; gauge height; primary measured water temperature | Estabrook Park, 6.6 mi above mouth; not harbor or North Shore truth                       | 5-min numeric CFS/ft/degC; latest probe values 201 CFS, 0.67 ft, 24.9 °C at 2026-08-25 23:00Z; provisional | Daily records begin 1914; continuous catalog begins 1986; statistics API returned DOY normals | accept, subject to row-limit fix below |
| USGS 04087170, Milwaukee River at Mouth     | Candidate mouth stage/context                                       | Estuary reverses with Lake Michigan seiches; no current discharge or temperature returned | Numeric stage, but zero discharge and zero temperature in seven-day probe                                  | short/study record; unsuitable as primary hydraulic normal                                    | reject as primary                      |
| Open-Meteo `43.1000,-87.9090`               | Modeled weather context                                             | Estabrook/urban grid point; not measured river response                                   | HTTP 200, `America/Chicago`, 24 hourly numeric temperature/precipitation/rain values                       | shared adapter forecast/archive contract                                                      | accept for modeled context only        |

**Resolved LC-MKE-001:** the provider reader now follows validated same-origin
USGS OGC `next` links and fails closed if a page fails, loops, leaves the
continuous-items endpoint, or exceeds the safety bound. A 1,050-observation
ascending regression proves that the second-page newest value wins. This change
protects the future backend path; the already-submitted mobile builds were not
affected by the repository-v3 defect.

Provider faults fail closed. A later valid reading must restore automatically
without a code/configuration change.

## 6. Supported species decision and shared comparison matrix (preliminary)

| Candidate            | Gate 2 evidence                                                                                                                                                                                 | Decision carried to Gate 3                                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chinook              | DNR describes stocked trout/salmon spring and fall runs and lists salmon at Milwaukee River access points                                                                                       | plausible; independently prove recurring Chinook opportunity, distribution, and strength                                                                                     |
| Coho                 | DNR fall-fishing material identifies Coho regionally, but reviewed river-specific material does not isolate Milwaukee River Coho strength                                                       | unresolved; no enablement assumption                                                                                                                                         |
| Steelhead            | DNR lists steelhead at Estabrook and Kletzsch Milwaukee River access                                                                                                                            | plausible; independently prove fall-entry timing and strength                                                                                                                |
| Lake-run Brown Trout | Current DNR brood collection directly samples adults from the Milwaukee River/harbor; current stocking and creel records corroborate a strong run; Milwaukee County documents upriver migration | Owner selected 9/10, lower-river weighted, with the common Bridge Street physical endpoint and separate non-salmon lifecycle engine; exact ceiling confidence remains medium |

## 7. Evidence ledger

| ID    | Authority/title                                             | URL                                                                                                               | Accessed   | Facts and limits                                                                                              |
| ----- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| E-001 | Wisconsin DNR, Milwaukee Estuary Area of Concern            | https://dnr.wisconsin.gov/topic/GreatLakes/Milwaukee.html                                                         | 2026-08-26 | River/tributary identity and Lake Michigan mouth; not passage proof                                           |
| E-002 | Wisconsin DNR, Milwaukee River water detail                 | https://apps.dnr.wi.gov/water/waterDetail.aspx?WBIC=15000                                                         | 2026-08-26 | Assessment river miles and historic structure segments                                                        |
| E-003 | Wisconsin DNR, fishing-season definitions                   | https://dnr.wisconsin.gov/topic/Fishing/seasons/definitions.html                                                  | 2026-08-26 | Tributary extent to Grafton Dam                                                                               |
| E-004 | Wisconsin DNR, Milwaukee habitat-management actions letter  | https://dnr.wisconsin.gov/sites/default/files/topic/GreatLakes/MKE_F%26WHabitatManagementActionsLetter.pdf        | 2026-08-26 | Removed dams, Mequon fishway, Bridge Street complete barrier                                                  |
| E-005 | Wisconsin DNR, FH1022 Kletzsch refuge rule record           | https://dnr.wisconsin.gov/sites/default/files/topic/Rules/FH1022DraftRule.pdf                                     | 2026-08-26 | Salmonid passage and refuge basis; signs/current guide control                                                |
| E-006 | USGS, monitoring location 04087000                          | https://waterdata.usgs.gov/monitoring-location/USGS-04087000/                                                     | 2026-08-26 | Coordinates, timezone, data/history catalog, attribution                                                      |
| E-007 | USGS Water Data API probes                                  | https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items                                             | 2026-08-26 | Live values, cadence, units, status, truncation behavior                                                      |
| E-008 | Wisconsin DNR, 2026–2027 fishing regulations                | https://dnr.wisconsin.gov/topic/fishing/regulations                                                               | 2026-08-26 | Current regulatory source; release-time recheck required                                                      |
| E-009 | USGS, oscillating flows in Milwaukee River estuary          | https://www.usgs.gov/centers/upper-midwest-water-science-center/science/oscillating-flows-milwaukee-river-estuary | 2026-08-26 | Seiche influence reaches near North Avenue                                                                    |
| E-010 | Wisconsin DNR, fall shore fishing close to Milwaukee        | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html                                             | 2026-08-26 | Candidate species/access context; not strength calibration                                                    |
| E-011 | Wisconsin DNR, 2025 Lake Michigan GLFC report               | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf                                        | 2026-08-26 | 115 adult Brown Trout collected from Milwaukee River/harbor in fall 2024; brood sample, not a total return    |
| E-012 | Wisconsin DNR, 2024 Lake Michigan Salmonid Stocking Summary | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf                            | 2026-08-26 | 14,213 Brown Trout yearlings stocked at Milwaukee River net pen; stocking is not a return count               |
| E-013 | Wisconsin DNR, Lake Michigan harvest tables 2006–2024       | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables2006-2024.pdf                    | 2026-08-26 | Milwaukee County 2024 Brown harvest 2,135, including 415 stream fish; county/stream scope exceeds exact river |

## 8. Decisions and gate

| ID    | Issue                                                     | Resolution/status                                                                                                           |
| ----- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| D-001 | Mouth gauge exists but estuary reverses                   | Reject as primary hydraulics; label harbor as seiche-affected                                                               |
| D-002 | Kletzsch has both a dam and passage                       | Record limited/flow-dependent passage and preserve refuge                                                                   |
| D-003 | Exact public labels/endpoints                             | Owner approved on 2026-08-26                                                                                                |
| D-004 | Seven-day/1,000-row truncation                            | Resolved in Gate 4 with fail-closed OGC pagination and a >1,000-row regression; submitted builds were unaffected            |
| D-005 | Seasonal/section restrictions in copy                     | Owner requires prominent pre-guidance warnings; locked above for Gate 3                                                     |
| D-006 | Brown endpoint conflated evidence confidence with biology | Corrected to Bridge Street physical endpoint; retain lower-river opportunity weighting and Estabrook-only measurement scope |

- [x] Identity, timezone, mouth, corridor, barriers, regulations, and source
      feasibility researched.
- [x] Live/history endpoints returned real values and timestamps.
- [x] Unknown species strength remains explicit for Gate 3.
- [x] Gate 3 portfolio species truth, ratings, and distribution approved by
      owner.
- [x] Owner approved exact public labels and endpoints.
- [x] LC-MKE-001 fixed and regression-tested before hidden configuration.
- [ ] Release-time regulation and closure recheck is completed.

**Foundation decision:** `hidden_gate_4b_activity_ready_for_owner_review`\
**Research version:** `milwaukee-foundation-v3-2026-08-26`
