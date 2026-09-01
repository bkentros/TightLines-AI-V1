# Lower Genesee River — New York onboarding dossier

**River ID:** `lower_genesee`

**State/region:** `NY` / `great_lakes`

**Research date:** 2026-08-31

**Status:** `owner_review_ready`

**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

- Foundation accepted for hidden configuration v2 from Lake Ontario to natural
  Lower Falls.
- Hidden profiles: fall Chinook, fall-entry Steelhead, and fall lake-run Brown
  Trout.
- Coho was fully researched but excluded from configuration: historical
  occurrence/stocking is documented, while the current 2022-26 strategy
  allocates zero coho to the west-central area and does not establish a
  dependable recurring Genesee run. It remains `research_unresolved`, not erased
  as absent.
- Spring-entry/spawn Steelhead remains a separate engine-gated future candidate;
  it is not merged into fall entry.
- Atlantic Salmon was searched independently. Current management identifies
  Salmon River and select tributaries, not a dependable Lower Genesee run; this
  remains `research_unresolved` and unconfigured.
- Public promotion/deployment and rendered owner acceptance: withheld.

Contradiction search completed by/date: Codex / 2026-08-31

Independent falsification review by/date: separate primary-source and code-contract pass / 2026-08-31

| ID   | Authority/title                                                     | Direct source                                                                                                                        | Date/data                       | Facts supported                                                                                                                                                  | Scope/limitations                                                                                    |
| ---- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| G-01 | NYSDEC Lower Genesee PFR                                            | https://dec.ny.gov/sites/default/files/pfrgeneseriv.pdf                                                                              | current map; checked 2026-08-31 | Lower Falls endpoint, Seth Green access, historical Chinook/coho/Steelhead stocking/occurrence                                                                   | Historic stocking text is not current allocation                                                     |
| G-02 | NYSDEC Great Lakes tributary regulations                            | https://dec.ny.gov/things-to-do/freshwater-fishing/regulations/great-lakes-tributaries                                               | current                         | Route 104-to-Lower Falls seasonal reach, hours/gear/limits                                                                                                       | Recheck before release/fishing                                                                       |
| G-03 | NYSDEC 2022-26 stocking strategy                                    | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lostockingstrategy.pdf                                                               | 2022 allocations                | Genesee: 111,400 Chinook, 35,000 Steelhead; primary west-central Chinook fishery; big-river Steelhead rank 4/highest catch-rate subscore; zero west-central coho | Allocations can change; zero allocation does not prove zero strays                                   |
| G-04 | NYSDEC 2023 annual report                                           | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf                                                           | 2023                            | 35,000 Genesee Steelhead stocked; no Genesee coho row                                                                                                            | Juvenile stocking, not adult abundance                                                               |
| G-05 | NYSDEC Pacific salmon guidance                                      | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/pacific-salmon-fishing | current                         | Genesee is popular salmon tributary; rain-dependent timing peaks mid-Oct.                                                                                        | Lakewide calendar refined conservatively                                                             |
| G-06 | NYSDEC Rochester Embayment aesthetics report                        | https://dec.ny.gov/sites/default/files/2024-06/rochesterembaymentaestehticsreport_final.pdf                                          | 2024 report                     | Lower Falls is first impassable barrier; Pacific salmon concentrate below it                                                                                     | Report focus is aesthetics/carcass management                                                        |
| G-07 | USGS Genesee at Rochester 04232000                                  | https://waterdata.usgs.gov/monitoring-location/USGS-04232000/                                                                        | probe 2026-08-31                | no current 00060/00065/00010; returned discharge observation is dated 2005-09-30                                                                                 | Discontinued and never presented as live                                                             |
| G-08 | USGS Ford Street Bridge 04231600                                    | https://waterdata.usgs.gov/monitoring-location/USGS-04231600/                                                                        | live probe 2026-08-31           | 15-minute flow/height/temp; recheck returned 694 CFS, 12.83 ft, 21.5°C                                                                                           | Accepted for labeled upstream-basin context only; all metrics excluded from corridor scoring across three falls |
| G-09 | City of Rochester Lower Falls Park                                  | https://www.cityofrochester.gov/locations/lower-gorge-genesee-natural-wonder-heart-city                                              | current                         | Lower gorge identity and Seth Green Fishing Access                                                                                                               | General park page does not replace regulation/PFR proof                                              |
| G-10 | NYSDEC 2023 Lake Ontario annual report, tributary survey tables 3-7 | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf                                                           | 2022-23 survey; report 2024     | Brown Trout: 241 estimated Lower Genesee catch vs. 70 long-term mean; Steelhead: 2,202                                                                           | Survey estimates are not live abundance; low Brown Trout sample supports only a conservative profile |
| G-11 | NYSDEC Atlantic Salmon Fisheries Management Plan 2023-2026          | https://extapps.dec.ny.gov/docs/fish_marine_pdf/loatlanticsalmonplan.pdf                                                             | 2023-26                         | Select-tributary strategy and low overall abundance; consistent tributary fisheries named elsewhere do not establish Lower Genesee recurrence                    | Negative/contradiction search, not proof of absence                                                  |
| G-12 | NYSDEC Monroe County boat launches                                  | https://dec.ny.gov/things-to-do/boating/launch-sites/monroe-county                                                                   | current; checked 2026-08-31     | Port of Rochester Marina municipal hard-surface launch and coordinates                                                                                             | Boat access only; no bank/wading or navigability promise                                             |
| G-13 | Monroe County Ontario Beach Park                                    | https://www.monroecounty.gov/parks-ontariobeach                                                                                      | current; checked 2026-08-31     | Fishing is an allowed activity at the park/pier; current park hours                                                                                                 | Posted pier, weather, construction, and closure conditions control access                            |

## 2. Identity and corridor

Canonical identity is the 6.5-mile Lower Genesee in Monroe County from Lake
Ontario at Charlotte through the Rochester lower gorge to the natural Lower
Falls above Driving Park Avenue. The upstream Genesee watershed, High Falls,
other tributaries, and canal reaches are excluded. Region is `great_lakes`;
timezone `America/New_York`.

## 3. Canonical reaches

| Reach                  | Boundaries                | Role         | Gauge | Decision                                      |
| ---------------------- | ------------------------- | ------------ | ----- | --------------------------------------------- |
| `lower_genesee_harbor` | Lake Ontario to Route 104 | lower/harbor | no    | Current official pier and launch access only  |
| `lower_genesee_gorge`  | Route 104 to Seth Green   | middle       | no    | Part of source-listed fishing reach           |
| `lower_genesee_falls`  | Seth Green to Lower Falls | terminal     | no    | Natural endpoint and concentration corridor   |

## 4. Barrier and passage inventory

| Barrier/control                    | Passage finding                                                           | Species decision                                           | Product treatment                                |
| ---------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Natural Lower Falls                | NYSDEC identifies first natural impassable barrier                        | Chinook/coho/Steelhead cannot extend above in this product | Exact endpoint; upstream gauges excluded         |
| Rochester navigation/urban channel | No material fish barrier documented below Lower Falls in reviewed sources | Mouth-to-falls chain supported                             | Does not imply shore access along whole corridor |

## 5. Species endpoints and passage chains

| Candidate                 | Chain/endpoint                                                                | Decision                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Fall Chinook              | Lake Ontario → harbor/lower river → gorge → Lower Falls                       | concentrated 7/10 hidden profile                                               |
| Fall-entry Steelhead      | same chain/end                                                                | concentrated 7/10 hidden profile                                               |
| Fall coho                 | occurrence documented below falls, but current dependable run not established | no configured run; fail closed                                                 |
| Fall lake-run Brown Trout | same chain/end                                                                | concentrated 2/10 hidden profile; sparse but affirmative recurring opportunity |

## 6. Regulations

NYSDEC seasonal Lake Ontario tributary rules expressly name Route 104 upstream
to Lower Falls. The Seth Green PFR is a fishing easement, not a safety or
parking guarantee. Public copy links current rules and preserves seasonal hours,
steep-gorge hazards, posted access, and private-property limitations.

## 7. Source and capability audit

| Capability                        | Decision              | Exact limitation                                                                                    |
| --------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| Gauge Read                        | upstream context available | Current Ford Street flow/height/temperature display with exact upstream location; stale 04232000 omitted |
| Historical water-temperature norm | upstream context available | USGS Ford Street same-date statistics returned 15 historical years in the Aug. 31 probe; this is not a Lower Falls/gorge/harbor norm |
| Fish Counts                       | unavailable           | no official recurring facility observation process exists below the natural barrier                 |
| Fishing Shape                     | unavailable           | no corridor hydraulics; gorge/harbor effects not inferred                                           |
| Activity                          | weather-only, Limited | Lower Falls-area light/precipitation only; upstream gauges and air temperature contribute zero      |

## 8. Spot Finder

Accepted for the currently sourced Ontario Beach Park/Charlotte Pier and Port
of Rochester public launch (`lower`) plus Seth Green–Lower Falls Public Fishing
Area (`upper`, spanning the gorge and terminal reach). General trails,
overlooks, and hand launches are omitted without direct fishing proof. The east
harbor construction area and Summerville Pier remain withheld pending a current
unambiguous open-access source.

## 9. Candidate species/run matrix

| Candidate run                      | Recurrence/opportunity                                                                              | Contradiction                                                                                        | Decision                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Fall Chinook                       | current major allocation and named destination fishery                                              | none material                                                                                        | hidden profile                                                     |
| Fall coho                          | historical stocking/occurrence in G-01                                                              | current strategy gives west-central/Genesee zero allocation and selected coho waters exclude Genesee | research unresolved; strays not erased, dependable run not claimed |
| Steelhead — fall entry             | current 35,000 allocation; big-river rank/catch evidence                                            | none material                                                                                        | hidden profile                                                     |
| Steelhead — spring entry/spawn     | lakewide separate March-April group                                                                 | `spring_warming` unimplemented                                                                       | engine-gated future profile; not merged                            |
| Lake-run Brown Trout — fall spawn  | 241 estimated 2022-23 catch, above 70 long-term mean; Rochester received 23,750 stocked Brown Trout | sparse direct scale; no basis to borrow Oak strength                                                 | hidden profile; concentrated 2/10                                  |
| Atlantic Salmon — tributary return | species occurs in Lake Ontario and select tributaries                                               | no current direct Lower Genesee recurrence/calendar evidence found                                   | research unresolved; no configured run                             |

## 10. Species/run records

| Run ID                           | Window (pre-run → tail) | Presence                                | Activity version                                                              |
| -------------------------------- | ----------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `lower_genesee_fall_chinook`     | Aug 15 → Nov 22         | 7/10 concentrated; independent curve    | `lower_genesee_fall_chinook-weather-activity-v1-owner-review`                 |
| `lower_genesee_fall_steelhead`   | Sep 20 → Dec 31         | 7/10 concentrated fall entry            | `lower_genesee_fall_steelhead-weather-activity-v4-stage-shape-owner-review`   |
| `lower_genesee_fall_brown_trout` | Sep 5 → Dec 31          | 2/10 concentrated; repeat-spawner curve | `lower_genesee_fall_brown_trout-weather-activity-v3-stage-shape-owner-review` |

All three expose Stage, Activity, and Seasonal Presence in hidden review.
Fishing Shape, Push, and Migration Timing are unavailable. Steelhead and Brown
Trout use a true 69 weather-only maximum because no representative measured
temperature exists; neither receives salmon mortality shaping or a
spring-completion claim.

| Run | Pre | Staging | Beginning | Build established / broad | Peak start /
center / end | Taper end | End / late / copy tail | | --- | --- | --- | --- |
--- | --- | --- | --- | --- | | Chinook | Aug 15 | Aug 25 | Sep 5-20 | Sep 21 /
Oct 1 | Oct 8 / Oct 15 / Oct 25 | Nov 8 | Nov 15 / Nov 22 / Nov 27 | |
Steelhead, fall entry | Sep 20 | Oct 1 | Oct 15-31 | Nov 1 / Nov 10 | Nov 15 /
Nov 25 / Dec 10 | Dec 20 | Dec 28 / Dec 31 / Jan 2 | | Brown Trout, fall | Sep 5
| Sep 20 | Oct 5-20 | Oct 21 / Nov 5 | Nov 10 / Nov 20 / Nov 30 | Dec 15 | Dec
25 / Dec 31 / Jan 5 |

### Activity tuning and fixed replay

| Stage      | Block                                 | Usable days | Samples | Result                                                                  |
| ---------- | ------------------------------------- | ----------: | ------: | ----------------------------------------------------------------------- |
| all stages | all four blocks, Chinook              |       1,710 |   6,840 | 100%; Peak mean 79.56; zero coded invariants                            |
| all stages | all four blocks, fall-entry Steelhead |       1,748 |   6,992 | 100%; repeat-spawner invariance and strict Peak-mean gate passed       |
| all stages | all four blocks, Brown Trout          |       1,957 |   7,828 | 100%; Peak mean 66.49; repeat-spawner and stage-shape invariants passed |

Mean daily Activity by Stage (2007-2025):

| Run         |   Pre | Beginning | Building |  Peak | Tapering | Ending | Post-run |
| ----------- | ----: | --------: | -------: | ----: | -------: | -----: | -------: |
| Chinook     | 68.75 |     69.70 |    77.70 | 79.56 |    71.45 |  58.26 |    45.38 |
| Steelhead   | 60.83 |     62.65 |    62.51 | 66.34 |    65.69 |  65.22 |    66.12 |
| Brown Trout | 61.05 |     60.82 |    62.56 | 66.49 |    64.46 |  64.36 |    64.65 |

| Iteration | Fields changed                                                    | Reason                                                             | Outcome                                          | Decision                   |
| --------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ | -------------------------- |
| 1         | rejected both Rochester stations                                  | both lie above impassable Lower Falls                              | weather-only 2007-25 replay                      | accepted for hidden review |
| 2         | Coho removed from target species/runs                             | current recurrence evidence fails dependable-run gate              | fail closed while retaining contradiction record | accepted                   |
| 3         | Steelhead Peak +2, Ending/Post -1; true max 69                    | preserve a modest historical fall crest without mortality shaping  | complete replay; Peak 66.34 highest              | accepted for hidden review |
| 4         | Brown Trout added; Peak +5, Taper -1, Ending/Post -2; true max 69 | affirmative but sparse recurring evidence; no measured temperature | complete replay; Peak 66.49 highest              | accepted for hidden review |

Artifacts:
`docs/audits/river-run-lower-genesee-{chinook,steelhead,brown-trout}-weather-activity-replay.json`;
each contains stage-by-block distributions and all invariant records.

## 11. Configuration reconciliation

`LOWER_GENESEE_RIVER_PROFILE` and three run profiles in
`config/onboarding/newYork.ts` reconcile corridor, natural endpoint, current
species truth, source rejection, every calendar boundary, strength,
distribution, Presence, Activity, and hidden audit state. Spot Finder consumes
the exact gorge/falls reach IDs. Coho and Atlantic Salmon are absent from
`targetSpecies` and code by design. Public audit gates are false.

## 12. Acceptance and release record

| Gate                                                                   | Result                                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Identity/barrier/regulations                                           | accepted for hidden implementation                                           |
| USGS live/context probes/source-reach audit                            | passed; Ford Street displays as upstream context and scores zero; stale 04232000 removed |
| Chinook replay and controlled Activity QA                              | passed, 100% coverage, zero coded invariants                                 |
| Steelhead/Brown replays                                                | 100% coverage; all coded invariants and strict Peak-highest mean gate passed |
| Coho/Atlantic truth gates                                              | failed closed for dependable current recurrence; no runs configured          |
| Shape/count capabilities                                               | Fishing Shape and counts remain explicit fail-closed; upstream temperature context is labeled |
| Seasonal Zone/Spot Finder                                              | three source-backed accesses across lower and upper sections; all active days checked |
| River-picker artwork                                                   | large lower-corridor illustration mapped to `lower_genesee`; UI coverage gate passed |
| Automated implementation gate                                         | 403 engine + 58 endpoint tests; 1,425 fixtures; UI, visual, type, packet, and 161-entry live Spot-source audits passed |
| Rendered owner acceptance                                              | withheld                                                                     |
| Public registry, migrations, deployment, production smoke, commit/push | not authorized/not performed                                                 |

## 13. Correction and learning ledger

| Date       | Finding                                                                   | Correction/safeguard                                                            |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 2026-08-31 | Ford Street offers complete live metrics under the same river name        | Metrics display only as upstream-basin context across three falls and remain excluded from Activity/Fishing Shape |
| 2026-08-31 | Old PFR brochure documents coho while current strategy allocates none     | Preserved contradiction; no dependable-run profile                              |
| 2026-08-31 | Initial harbor omission was too broad                                     | Added only current official fishing/launch records at Ontario Beach and Port of Rochester; other general-access sites still fail closed |
| 2026-08-31 | Sparse Brown Trout occurrence could be erased or overstated               | Implemented independently at 2/10 concentrated; no Oak/Salmon strength borrowed |
| 2026-08-31 | Atlantic occurrence in the lake could be mistaken for a Lower Genesee run | Preserved as research-unresolved with no runtime profile                        |
| 2026-08-31 | River selector lacked intentional size artwork                         | Added the large lower-corridor illustration and a permanent UI coverage assertion |
