# Oak Orchard Creek — New York onboarding dossier

**River ID:** `oak_orchard`

**State/region:** `NY` / `great_lakes`

**Research date:** 2026-08-31

**Status:** `owner_review_ready`

**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

- Foundation accepted for hidden configuration v2 from Point Breeze to Waterport
  Dam.
- Hidden profiles: fall Chinook, fall coho, fall-entry Steelhead, and fall
  lake-run Brown Trout.
- Spring-entry/spawn Steelhead remains a distinct engine-gated future candidate;
  it is not merged with fall entry.
- Atlantic Salmon is independently documented as a small recurring fall/winter
  candidate but remains engine-gated; it is not merged with Pacific salmon or
  Brown Trout.
- Public promotion/deployment and rendered owner acceptance: withheld.

Contradiction search completed by/date: Codex / 2026-08-31

Independent falsification review by/date: separate primary-source and code-contract pass / 2026-08-31

| ID   | Authority/title                                                     | Direct source                                                                                                                        | Date/data                       | Facts supported                                                                                                  | Scope/limitations                                                                      |
| ---- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| O-01 | NYSDEC Oak Orchard River PFR                                        | https://dec.ny.gov/sites/default/files/pfroakorchrv.pdf                                                                              | current map; checked 2026-08-31 | Waterport endpoint, marked PFR/footpaths/parking, marine park                                                    | Map is not survey quality; adjacent land private                                       |
| O-02 | NYSDEC Great Lakes tributary regulations                            | https://dec.ny.gov/things-to-do/freshwater-fishing/regulations/great-lakes-tributaries                                               | current                         | Named power-lines-to-Waterport seasonal reach; hours/gear/limits                                                 | Recheck immediately before release/fishing                                             |
| O-03 | NYSDEC 2022-26 stocking strategy                                    | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lostockingstrategy.pdf                                                               | 2022 allocations                | 111,400 Chinook, 35,000 Steelhead, 22,500 coho; big-river Steelhead rank 3; destination Chinook fishery          | Allocation is not adult abundance                                                      |
| O-04 | NYSDEC 2023 annual report                                           | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf                                                           | 2023 stocking                   | Oak coho 22,500; Steelhead 35,000 including pen fish                                                             | One year; stocked juveniles only                                                       |
| O-05 | NYSDEC advisory panel minutes                                       | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lofapminutes11723.pdf                                                                | Jan. 2023; 2022 observations    | Good Oak Chinook/coho returns; extended Chinook timing; Steelhead improved Nov.-Dec.                             | Qualitative agency panel record                                                        |
| O-06 | NYSDEC tributary salmon guidance                                    | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/pacific-salmon-fishing | current                         | Rain-dependent tributaries generally peak mid-Oct.; semelparous lifecycle                                        | Refined by Oak evidence                                                                |
| O-07 | USGS Oak Orchard near Shelby 04220045                               | https://waterdata.usgs.gov/monitoring-location/USGS-04220045/                                                                        | live probe 2026-08-31           | 15-minute flow/height since 2008 and temperature since 2020; recheck returned 64.2 CFS, 6.55 ft, 19.1°C                        | Accepted for labeled upstream context only; excluded from corridor scoring across Erie Canal, reservoir, and dam |
| O-08 | NYSDEC sportfish restoration plan                                   | https://extapps.dec.ny.gov/docs/wildlife_pdf/lkontfshrestspendplan07.pdf                                                             | official plan                   | Waterport overflow-channel fish stranding after high water                                                       | Older event; still material unmeasured hazard                                          |
| O-09 | NYSDEC 2017 angler effort report                                    | https://extapps.dec.ny.gov/docs/fish_marine_pdf/nyas17rpt1.pdf                                                                       | 2017 survey                     | 80,238 angler-days; Steelhead 22%, salmon 14% primary targets                                                    | Effort, not run-size/time calibration                                                  |
| O-10 | NYSDEC 2023 Lake Ontario annual report, tributary survey tables 3-7 | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf                                                           | 2022-23 survey; report 2024     | Brown Trout: 3,488 estimated catch vs. 7,906 long-term mean; Atlantic Salmon: 293, mostly Oct.; Steelhead: 3,922 | Survey estimates are not live abundance; combined with long-term/management evidence   |
| O-11 | NYSDEC Atlantic Salmon Fisheries Management Plan 2023-2026          | https://extapps.dec.ny.gov/docs/fish_marine_pdf/loatlanticsalmonplan.pdf                                                             | 2023-26                         | Oak is one of the few tributaries with a consistent Atlantic fishery; returns remain small                       | Current engine lacks an Atlantic run contract and precise full-calendar implementation |
| O-12 | Orleans County Oak Orchard River Stream Fishing Access              | https://www.orleanscountytourism.com/destinations/oak-orchard-river-stream-fishing-access                                             | current; checked 2026-08-31     | Park Avenue Extension locator; 15.8-acre fishing/boating access area; designated-trail entry                                    | County/operator record; posted rules and designated entry control access                |
| O-13 | Orleans County Marine Park and Oak Orchard State Marine Park         | https://www.orleanscountytourism.com/destinations/orleans-county-marine-park-1                                                        | current; checked 2026-08-31     | Distinct east/west lower-river facilities, fishing dock, ramps, addresses, seasonal operator details                           | Facility status/hours/fees can change; recheck before travel                            |

## 2. Identity and corridor

Canonical identity is Oak Orchard Creek/Oak Orchard River in Orleans County,
excluding the upstream warmwater reservoir fishery and other Oak Orchard waters.
The 5.9-mile River Run corridor begins at Lake Ontario/Point Breeze and ends
below Waterport Dam. Region is `great_lakes`; timezone `America/New_York`.

## 3. Canonical reaches

| Reach                | Boundaries                        | Role               | Gauge | Decision                            |
| -------------------- | --------------------------------- | ------------------ | ----- | ----------------------------------- |
| `oak_orchard_lower`  | Point Breeze to Route 18          | lower/harbor entry | no    | Source-audited marine park access   |
| `oak_orchard_middle` | Route 18 to Park Avenue area      | middle/core        | no    | Marked PFR corridor                 |
| `oak_orchard_upper`  | Park Avenue area to Waterport Dam | terminal tailwater | no    | Ends at dam; Shelby shown only as upstream context |

## 4. Barrier and passage inventory

| Barrier/control                      | Passage finding                                                                    | Species decision                  | Product treatment                        |
| ------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| Waterport Dam/Lake Alice             | First impassable terminal structure for this Lake Ontario fishery; reservoir above | All configured runs end below dam | Exact upstream limit                     |
| Waterport overflow/tailrace channels | Fish can enter overflow during high water and strand as levels fall                | Does not establish passage        | Fishing Shape withheld; caution retained |

Complete chain for all configured species: Lake Ontario → Point Breeze/lower
creek → PFR middle/upper corridor → Waterport tailrace. No upstream station or
reservoir observation crosses the dam in product logic.

## 5. Species endpoints and passage chains

| Run                       | Endpoint      | Distribution/strength                                      |
| ------------------------- | ------------- | ---------------------------------------------------------- |
| Fall Chinook              | Waterport Dam | sectional 8/10; destination stocking and recurring fishery |
| Fall coho                 | Waterport Dam | sectional 6/10; independently stocked, shorter run         |
| Fall-entry Steelhead      | Waterport Dam | sectional 8/10; big-river season-long objective            |
| Fall lake-run Brown Trout | Waterport Dam | sectional 6/10; recurring fall tributary fishery           |

## 6. Regulations

NYSDEC seasonal tributary rules expressly cover the first power lines 1.9 miles
south of Route 18 upstream to Waterport Dam, while lake/tributary seasons and
limits apply elsewhere. PFR is a fishing easement only. Public copy links
current rules and never promises parking, wading, private-land permission, or
uniform reach legality.

## 7. Source and capability audit

| Capability                        | Decision              | Exact limitation                                                                                |
| --------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| Gauge Read                        | upstream context available | Shelby flow/height/temperature are displayed with exact station location and separation; not tailrace/lower-creek conditions |
| Historical water-temperature norm | unavailable | Shelby has a continuous temperature archive since 2020, but the USGS same-date statistics probe returned no qualifying norm; no average is fabricated |
| Fish Counts                       | unavailable           | no official recurring facility feed with observation/freshness/revision semantics               |
| Fishing Shape                     | unavailable           | no accepted live corridor hydraulics; overflow/visibility are unmeasured                        |
| Activity                          | weather-only, Limited | Waterport light/precipitation only; Shelby metrics and air temperature contribute zero          |

## 8. Spot Finder

Accepted for hidden review with distinct County and State marine parks plus the
mapped river piers (`lower`), the complete signed-but-unnamed PFR parking and
footpath network (`middle`), and Park Avenue Fishing Trail plus Waterport Dam
PFR (`upper`). Unnamed map markers remain grouped instead of receiving invented
place names. St. Mary's Archers Club is omitted because its paid public parking
is date-limited and the current Spot Finder contract cannot enforce that gate.
All access is unranked; mapped widths are not boundaries; private property
beyond marked footpaths is excluded.

### Early approach and per-run phase plan

| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Decision |
| --- | --- | --- | --- | --- |
| Lake Ontario off Point Breeze, Oak Orchard harbor, and creek mouth | receiving lake/harbor to lower creek | O-01, O-02, foundation corridor | orientation only; lake/harbor rules and access are separate | accepted |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | `oak_orchard_fall_chinook-seasonal-zone-v1-2026-08-31` | lower | lower | lower + middle | all three | all three | middle + upper | middle + upper | independent spawning calendar below Waterport Dam |
| Coho | `oak_orchard_fall_coho-seasonal-zone-v1-2026-08-31` | lower | lower | lower + middle | all three | all three | middle + upper | middle + upper | separate coho calendar/distribution below Waterport |
| Steelhead | `oak_orchard_fall_steelhead-seasonal-zone-v1-2026-08-31` | lower | lower | lower + middle | all three | all three | all three | all three | living fall-entry fish retain all accepted corridor contexts |
| Brown Trout | `oak_orchard_fall_brown_trout-seasonal-zone-v1-2026-08-31` | lower | lower | lower + middle | all three | all three | middle + upper | middle + upper | repeat-spawner geography without salmon terminal biology |

## 9. Candidate species/run matrix

| Candidate run                        | Recurrence/opportunity                                                     | Life history                                               | Decision                                |
| ------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------- |
| Fall Chinook                         | direct allocation + recurring destination fishery                          | Sep.-Nov.; rain-dependent mid-Oct. core                    | hidden profile                          |
| Fall coho                            | direct annual allocation + good documented returns                         | Sep.-Nov.; shorter independent curve                       | hidden profile                          |
| Steelhead — fall entry               | direct allocation; ranked big-river winter fishery                         | Oct.-Dec.; iteroparous                                     | hidden profile                          |
| Steelhead — spring entry/spawn       | separate March-April group documented lakewide                             | spring warming/spawn, not a fall continuation              | engine-gated future profile; not merged |
| Lake-run Brown Trout — fall spawn    | recurring tributary fishery; 3,488 estimated 2022-23 catch                 | Sep.-Dec.; November crest; iteroparous                     | hidden profile; 6/10                    |
| Atlantic Salmon — fall/winter return | one of the plan's consistent tributary fisheries; 293 estimated in 2022-23 | mostly Oct., sparse later observations; distinct lifecycle | engine-gated; hidden and not merged     |

## 10. Species/run records

| Run ID                         | Window (pre-run → tail) | Presence                             | Activity version                                                            |
| ------------------------------ | ----------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `oak_orchard_fall_chinook`     | Aug 15 → Nov 22         | 8/10 sectional; independent curve    | `oak_orchard_fall_chinook-weather-activity-v1-owner-review`                 |
| `oak_orchard_fall_coho`        | Aug 25 → Nov 30         | 6/10 sectional; independent curve    | `oak_orchard_fall_coho-weather-activity-v1-owner-review`                    |
| `oak_orchard_fall_steelhead`   | Sep 20 → Dec 31         | 8/10 sectional fall entry            | `oak_orchard_fall_steelhead-weather-activity-v4-stage-shape-owner-review`   |
| `oak_orchard_fall_brown_trout` | Sep 1 → Dec 31          | 6/10 sectional; repeat-spawner curve | `oak_orchard_fall_brown_trout-weather-activity-v3-stage-shape-owner-review` |

All expose Stage, Activity, and Seasonal Presence in hidden review. Fishing
Shape, Push, and Migration Timing are unavailable. Coho Ending is 49. Steelhead
and Brown Trout use a true 69 weather-only maximum because no
corridor-representative measured temperature is accepted; neither receives
salmon mortality shaping.

| Run | Pre | Staging | Beginning | Build established / broad | Peak start /
center / end | Taper end | End / late / copy tail | | --- | --- | --- | --- |
--- | --- | --- | --- | --- | | Chinook | Aug 15 | Aug 25 | Sep 5-20 | Sep 21 /
Oct 1 | Oct 8 / Oct 15 / Oct 25 | Nov 8 | Nov 15 / Nov 22 / Nov 27 | | Coho |
Aug 25 | Sep 1 | Sep 10-25 | Sep 26 / Oct 5 | Oct 12 / Oct 20 / Oct 30 | Nov 15
| Nov 22 / Nov 30 / Dec 5 | | Steelhead, fall entry | Sep 20 | Oct 1 | Oct 15-31
| Nov 1 / Nov 10 | Nov 15 / Nov 25 / Dec 10 | Dec 20 | Dec 28 / Dec 31 / Jan 2 |
| Brown Trout, fall | Sep 1 | Sep 15 | Oct 1-15 | Oct 16 / Nov 1 | Nov 5 / Nov
15 / Nov 30 | Dec 15 | Dec 25 / Dec 31 / Jan 5 |

### Activity tuning and fixed replay

| Stage      | Block                                 | Usable days | Samples | Result                                                                  |
| ---------- | ------------------------------------- | ----------: | ------: | ----------------------------------------------------------------------- |
| all stages | all four blocks, Chinook              |       1,710 |   6,840 | 100%; Peak mean 79.76; zero coded invariants                            |
| all stages | all four blocks, coho                 |       1,729 |   6,916 | 100%; Peak mean 79.66; zero coded invariants                            |
| all stages | all four blocks, fall-entry Steelhead |       1,748 |   6,992 | 100%; repeat-spawner invariance and strict Peak-mean gate passed       |
| all stages | all four blocks, Brown Trout          |       2,052 |   8,208 | 100%; Peak mean 66.34; repeat-spawner and stage-shape invariants passed |

Mean daily Activity by Stage (2007-2025):

| Run         |   Pre | Beginning | Building |  Peak | Tapering | Ending | Post-run |
| ----------- | ----: | --------: | -------: | ----: | -------: | -----: | -------: |
| Chinook     | 68.22 |     69.69 |    77.57 | 79.76 |    71.64 |  58.11 |    45.86 |
| Coho        | 68.84 |     68.63 |    77.27 | 79.66 |    70.45 |  58.81 |    46.14 |
| Steelhead   | 60.59 |     62.83 |    62.66 | 66.24 |    65.83 |  65.32 |    66.07 |
| Brown Trout | 59.59 |     60.87 |    62.32 | 66.34 |    64.54 |  64.46 |    64.66 |

| Iteration | Fields changed                                                    | Reason                                                                | Artifact/outcome                    | Decision                   |
| --------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- | -------------------------- |
| 1         | rejected Shelby; selected weather-only                            | dam/reservoir reach mismatch                                          | full 2007-25 replays                | accepted for hidden review |
| 2         | coho Ending 42→49                                                 | terminal continuity without extending biology                         | zero coded invariants               | accepted                   |
| 3         | Steelhead Peak +2, Ending/Post -1; true max 69                    | preserve a modest historical fall crest without mortality shaping     | complete replay; Peak 66.24 highest | accepted for hidden review |
| 4         | Brown Trout added; Peak +5, Taper -1, Ending/Post -2; true max 69 | direct recurring-run evidence plus missing primary temperature driver | complete replay; Peak 66.34 highest | accepted for hidden review |

Artifacts:
`docs/audits/river-run-oak-orchard-{chinook,coho,steelhead,brown-trout}-weather-activity-replay.json`;
each includes stage-by-block distributions and all invariant records.

## 11. Configuration reconciliation

`OAK_ORCHARD_RIVER_PROFILE` and its four runs in `config/onboarding/newYork.ts`
match the dossier's corridor, barrier, source rejection, every calendar
boundary, strength, distribution, Activity, and capability decisions. Spot
Finder uses the exact three foundation reach IDs. Every public audit gate is
false; Atlantic Salmon has no runtime profile.

## 12. Acceptance and release record

| Gate                                                                   | Result                                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Identity/barrier/regulations/source reach                              | accepted for hidden implementation                                           |
| USGS live/context probe                                                | passed; three Shelby metrics display only as upstream context and score zero  |
| Chinook/coho replays and controlled QA                                 | passed, 100% coverage, zero coded invariants                                 |
| Steelhead/Brown replays                                                | 100% coverage; all coded invariants and strict Peak-highest mean gate passed |
| Shape/count capabilities                                               | Fishing Shape, counts, and a temperature norm remain unavailable; live Shelby temperature is labeled upstream |
| Spot Finder alignment                                                  | six access records across three sections; unnamed PFR markers fully represented as one official-map network |
| River-picker artwork                                                   | small corridor illustration mapped to `oak_orchard`; UI coverage gate passed |
| Automated implementation gate                                         | 405 engine + 58 endpoint tests; 1,425 fixtures; UI, visual, type, packet, and 161-entry live Spot-source audits passed |
| Rendered owner acceptance                                              | withheld                                                                     |
| Public registry, migrations, deployment, production smoke, commit/push | not authorized/not performed                                                 |

## 13. Correction and learning ledger

| Date       | Finding                                                                 | Correction/safeguard                                                                                     |
| ---------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 2026-08-31 | Same-name Shelby sensor looked complete                                 | Reach audit detected Erie Canal/reservoir/dam separation; metrics now display only as transparent upstream context and score zero |
| 2026-08-31 | Coho short tail caused a scoring step                                   | Versioned 49 Ending cap; full replay rerun                                                               |
| 2026-08-31 | General PFR map could imply broad permission                            | Spot Finder cautions preserve signed-easement/private-land boundary                                      |
| 2026-08-31 | Brown Trout and Atlantic Salmon required independent run decisions      | Brown implemented from direct survey/management evidence; Atlantic documented as engine-gated and hidden |
| 2026-08-31 | Cold late-season weather could exceed the intended repeat-spawner crest | Small versioned stage responses plus true 69 maximum; full replay and daily-zone regression              |
| 2026-08-31 | Initial Spot Finder collapsed distinct lower facilities and omitted the searchable Park Avenue trail | Split County/State parks, added river piers and Park Avenue access, retained full unnamed PFR network without invented names |
| 2026-08-31 | Seasonal paid Archers Club parking could be recommended outside its gate | Omitted until Spot Finder can enforce date-limited access; bank access remains reachable from permanent permitted entries |
| 2026-08-31 | River selector lacked intentional size artwork                         | Added the small corridor illustration and a permanent UI coverage assertion                                  |
| 2026-08-31 | Spot Finder provided no early Point Breeze direction and generic late geography treated all life histories alike | Added a non-access Lake Ontario/Point Breeze harbor/mouth orientation plus separate Chinook, coho, Steelhead, and Brown Trout phase-reach plans; plans stop below Waterport Dam and preserve PFR access limits |
