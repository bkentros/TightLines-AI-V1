# Lower Genesee River — New York onboarding dossier

**River ID:** `lower_genesee`
**State/region:** `NY` / `great_lakes`
**Research date:** 2026-08-31
**Status:** hidden owner-review implementation; public audit, release, and deployment withheld
**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

- Foundation accepted for hidden configuration v1 from Lake Ontario to natural Lower Falls.
- Hidden profiles: fall Chinook and fall-entry Steelhead.
- Coho was fully researched but excluded from configuration: historical occurrence/stocking is documented, while the current 2022-26 strategy allocates zero coho to the west-central area and does not establish a dependable recurring Genesee run.
- Spring-entry/spawn Steelhead remains a separate engine-gated future candidate; it is not merged into fall entry.
- Public promotion/deployment and rendered owner acceptance: withheld.

Contradiction search completed by/date: Codex / 2026-08-31
Independent falsification review by/date: separate primary-source and code-contract pass / 2026-08-31

| ID | Authority/title | Direct source | Date/data | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- |
| G-01 | NYSDEC Lower Genesee PFR | https://dec.ny.gov/sites/default/files/pfrgeneseriv.pdf | current map; checked 2026-08-31 | Lower Falls endpoint, Seth Green access, historical Chinook/coho/Steelhead stocking/occurrence | Historic stocking text is not current allocation |
| G-02 | NYSDEC Great Lakes tributary regulations | https://dec.ny.gov/things-to-do/freshwater-fishing/regulations/great-lakes-tributaries | current | Route 104-to-Lower Falls seasonal reach, hours/gear/limits | Recheck before release/fishing |
| G-03 | NYSDEC 2022-26 stocking strategy | https://extapps.dec.ny.gov/docs/fish_marine_pdf/lostockingstrategy.pdf | 2022 allocations | Genesee: 111,400 Chinook, 35,000 Steelhead; primary west-central Chinook fishery; big-river Steelhead rank 4/highest catch-rate subscore; zero west-central coho | Allocations can change; zero allocation does not prove zero strays |
| G-04 | NYSDEC 2023 annual report | https://dec.ny.gov/sites/default/files/2025-02/lakeontarioannualreport.pdf | 2023 | 35,000 Genesee Steelhead stocked; no Genesee coho row | Juvenile stocking, not adult abundance |
| G-05 | NYSDEC Pacific salmon guidance | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/pacific-salmon-fishing | current | Genesee is popular salmon tributary; rain-dependent timing peaks mid-Oct. | Lakewide calendar refined conservatively |
| G-06 | NYSDEC Rochester Embayment aesthetics report | https://dec.ny.gov/sites/default/files/2024-06/rochesterembaymentaestehticsreport_final.pdf | 2024 report | Lower Falls is first impassable barrier; Pacific salmon concentrate below it | Report focus is aesthetics/carcass management |
| G-07 | USGS Genesee at Rochester 04232000 | https://waterdata.usgs.gov/monitoring-location/USGS-04232000/ | probe 2026-08-31 | no current 00060/00065/00010 returned in probe | Upstream of lower fish corridor; rejected |
| G-08 | USGS Ford Street Bridge 04231600 | https://waterdata.usgs.gov/monitoring-location/USGS-04231600/ | live probe 2026-08-31 | 15-minute flow/height/temp; latest 862 CFS, 12.72 ft, 21.5°C | Upstream of Lower Falls; rejected for corridor |
| G-09 | City of Rochester Lower Falls Park | https://www.cityofrochester.gov/locations/lower-gorge-genesee-natural-wonder-heart-city | current | Lower gorge identity and Seth Green Fishing Access | General park page does not replace regulation/PFR proof |

## 2. Identity and corridor

Canonical identity is the 6.5-mile Lower Genesee in Monroe County from Lake Ontario at Charlotte through the Rochester lower gorge to the natural Lower Falls above Driving Park Avenue. The upstream Genesee watershed, High Falls, other tributaries, and canal reaches are excluded. Region is `great_lakes`; timezone `America/New_York`.

## 3. Canonical reaches

| Reach | Boundaries | Role | Gauge | Decision |
| --- | --- | --- | --- | --- |
| `lower_genesee_harbor` | Lake Ontario to Route 104 | lower/harbor | no | No fishing access inferred from general parks |
| `lower_genesee_gorge` | Route 104 to Seth Green | middle | no | Part of source-listed fishing reach |
| `lower_genesee_falls` | Seth Green to Lower Falls | terminal | no | Natural endpoint and concentration corridor |

## 4. Barrier and passage inventory

| Barrier/control | Passage finding | Species decision | Product treatment |
| --- | --- | --- | --- |
| Natural Lower Falls | NYSDEC identifies first natural impassable barrier | Chinook/coho/Steelhead cannot extend above in this product | Exact endpoint; upstream gauges excluded |
| Rochester navigation/urban channel | No material fish barrier documented below Lower Falls in reviewed sources | Mouth-to-falls chain supported | Does not imply shore access along whole corridor |

## 5. Species endpoints and passage chains

| Candidate | Chain/endpoint | Decision |
| --- | --- | --- |
| Fall Chinook | Lake Ontario → harbor/lower river → gorge → Lower Falls | concentrated 7/10 hidden profile |
| Fall-entry Steelhead | same chain/end | concentrated 7/10 hidden profile |
| Fall coho | occurrence documented below falls, but current dependable run not established | no configured run; fail closed |

## 6. Regulations

NYSDEC seasonal Lake Ontario tributary rules expressly name Route 104 upstream to Lower Falls. The Seth Green PFR is a fishing easement, not a safety or parking guarantee. Public copy links current rules and preserves seasonal hours, steep-gorge hazards, posted access, and private-property limitations.

## 7. Source and capability audit

| Capability | Decision | Exact limitation |
| --- | --- | --- |
| Gauge Read | unavailable | 04231600/04232000 are upstream of the natural impassable falls; no accepted live source below falls |
| Historical-only water temperature | unavailable | legacy Rochester temperature is upstream and no corridor extraction is accepted |
| Fish Counts | unavailable | no official recurring facility observation process exists below the natural barrier |
| Fishing Shape | unavailable | no corridor hydraulics; gorge/harbor effects not inferred |
| Activity | weather-only, Limited | Lower Falls-area light/precipitation only; upstream gauges and air temperature contribute zero |

## 8. Spot Finder

Accepted only for the source-listed Seth Green–Lower Falls Public Fishing Area, mapped to `lower_genesee_gorge` + `lower_genesee_falls` and labeled `upper` relative to the supported corridor. Harbor parks/general trails are omitted because direct fishing-access proof was not established. The orientation note explains that intentional omission.

## 9. Candidate species/run matrix

| Candidate run | Recurrence/opportunity | Contradiction | Decision |
| --- | --- | --- | --- |
| Fall Chinook | current major allocation and named destination fishery | none material | hidden profile |
| Fall coho | historical stocking/occurrence in G-01 | current strategy gives west-central/Genesee zero allocation and select coho tributaries exclude Genesee | unsupported for v1; strays not erased, dependable run not claimed |
| Steelhead — fall entry | current 35,000 allocation; big-river rank/catch evidence | none material | hidden profile |
| Steelhead — spring entry/spawn | lakewide separate March-April group | `spring_warming` unimplemented | engine-gated future profile; not merged |

## 10. Species/run records

| Run ID | Window (pre-run → tail) | Presence | Activity version |
| --- | --- | --- | --- |
| `lower_genesee_fall_chinook` | Aug 15 → Nov 22 | 7/10 concentrated; independent curve | `lower_genesee_fall_chinook-weather-activity-v1-owner-review` |
| `lower_genesee_fall_steelhead` | Sep 20 → Dec 31 | 7/10 concentrated fall entry | `lower_genesee_fall_steelhead-weather-activity-v1-owner-review` |

Both expose Stage, Activity, and Seasonal Presence in hidden review. Fishing Shape, Push, and Migration Timing are unavailable. Steelhead has no salmon mortality ramp and makes no winter/spring completion claim.

### Activity tuning and fixed replay

| Stage | Block | Usable days | Samples | Result |
| --- | --- | ---: | ---: | --- |
| all stages | all four blocks, Chinook | 1,710 | 6,840 | 100%; Peak mean 79.56; zero coded invariants |
| all stages | all four blocks, fall-entry Steelhead | 1,748 | 6,992 | 100%; repeat-spawner invariance passed; strict Peak-mean gate held |

| Iteration | Fields changed | Reason | Outcome | Decision |
| --- | --- | --- | --- | --- |
| 1 | rejected both Rochester stations | both lie above impassable Lower Falls | weather-only 2007-25 replay | accepted for hidden review |
| 2 | Coho removed from target species/runs | current recurrence evidence fails dependable-run gate | fail closed while retaining contradiction record | accepted |
| 3 | Steelhead tail ends Dec. 31; no shaping | separate spring phase and iteroparous invariance | zero coded replay invariants | strict Peak-mean release held |

Artifacts: `docs/audits/river-run-lower-genesee-{chinook,steelhead}-weather-activity-replay.json`.

## 11. Configuration reconciliation

`LOWER_GENESEE_RIVER_PROFILE` and two run profiles in `config/onboarding/newYork.ts` reconcile corridor, natural endpoint, current species truth, source rejection, dates, Presence, Activity, and hidden audit state. Spot Finder consumes the exact gorge/falls reach IDs. Coho is absent from `targetSpecies` and code by design. Public audit gates are false.

## 12. Acceptance and release record

| Gate | Result |
| --- | --- |
| Identity/barrier/regulations | accepted for hidden implementation |
| USGS live endpoint probes/source-reach audit | passed; both upstream sources excluded |
| Chinook replay and controlled Activity QA | passed, 100% coverage, zero coded invariants |
| Steelhead replay | coded invariants passed; strict Peak-highest mean gate held |
| Coho truth gate | failed closed for dependable current recurrence; no run configured |
| Shape/temperature/count capabilities | explicit fail-closed unavailability |
| Seasonal Zone/Spot Finder | one source-backed upper section; lower omissions explicit |
| Rendered owner acceptance | withheld |
| Public registry, migrations, deployment, production smoke, commit/push | not authorized/not performed |

## 13. Correction and learning ledger

| Date | Finding | Correction/safeguard |
| --- | --- | --- |
| 2026-08-31 | Ford Street offers complete live metrics under the same river name | Natural Lower Falls reach audit excludes all three metrics |
| 2026-08-31 | Old PFR brochure documents coho while current strategy allocates none | Preserved contradiction; no dependable-run profile |
| 2026-08-31 | General harbor/park pages could be mistaken for fishing access | Only Seth Green PFR enters Spot Finder |
