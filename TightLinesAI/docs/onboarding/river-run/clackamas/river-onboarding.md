# Clackamas River — River Run onboarding dossier

**River ID:** `clackamas`
**State:** `OR`
**Research cutoff:** 2026-09-02
**Status:** `owner_review_ready`
**Target/stopping gate:** `owner_review_ready`
**Public state:** disabled; owner acceptance and public enablement have not been authorized.

## 1. Decisions and evidence ledger

Foundation/run truth version `clackamas-foundation-v2-owner-review`, reviewed 2026-09-02. Contradiction search covered PGE fish runs/counts/passage, ODFW Willamette rules and access, USGS live/daily values, and steelhead/trout terminology. Recheck ODFW in-season rules and PGE operations before release.

| ID | Primary authority | URL | Facts used | Limitation |
| --- | --- | --- | --- | --- |
| E-001 | PGE fish runs | https://portlandgeneral.com/about/recreation-fish-wildlife/fish-counts/clackamas-fish-runs | early/late coho distinction; fall Chinook; summer/winter steelhead identities | run descriptions, not abundance |
| E-002 | PGE fish counts | https://portlandgeneral.com/about/recreation-fish-wildlife/fish-counts/clackamas-fish-counts | verified North Fork sorter and daily Chinook/steelhead/coho/lamprey spreadsheets | facility passage only; early coho is the only supported run reaching the facility; no production parser |
| E-003 | PGE fishing/recreation | https://portlandgeneral.com/about/recreation-fish-wildlife/clackamas-river/clackamas-fishing-recreation | timing and River Mill endpoint | conservatively calibrated |
| E-004 | PGE fish protection | https://portlandgeneral.com/about/recreation-fish-wildlife/clackamas-river/protecting-fish | River Mill ladder and North Fork sorter | operations can change |
| E-005 | Oregon DFW Willamette Zone | https://myodfw.com/fishing/willamette-zone | regulation and named-run context | recheck at release |
| E-006 | Oregon DFW access guide | https://myodfw.com/sites/default/files/2026-04/50_in_60_flyer.pdf | seven retained public accesses, including Bonnie Lure and coho-only Estacada Lake | park entry is not blanket frontage |
| E-007 | USGS 14211010 | https://waterdata.usgs.gov/monitoring-location/14211010/ | live flow/height/temp and approved history | lower river; provisional live data |

### Delivery contract

| Item | Decision |
| --- | --- |
| Hidden IDs | `clackamas`; `clackamas_fall_chinook`, `clackamas_fall_coho` |
| Activity | full observed: Oregon City flow + measured temperature + weather |
| Client capability | `fall-2026-owner-review-v1`; default deny including admins |
| Bundled dependencies | picker, river/species art, Spot Finder, Seasonal Zone, Gauge Read |
| Database/deploy | no migration/cron; deploy only `river-run` for hidden review |
| Public/mobile | no public enable, build, store submission, or OTA authorized |

## 2. Identity, reaches, barriers, and species endpoints

Pacific Northwest corridor from the Willamette confluence to the North Fork sorter, approximately 30 miles, `America/Los_Angeles`. Weather near Oregon City is lower-river context only.

| Reach | Boundaries | Species | Gauge |
| --- | --- | --- | --- |
| `clackamas_lower_river` | mouth–Carver | Chinook, early coho | represented |
| `clackamas_middle_river` | Carver–River Mill | Chinook, early coho | not represented |
| `clackamas_coho_corridor` | River Mill–North Fork | early coho only | not represented |

River Mill is the conservative fall-Chinook endpoint. Early coho can pass toward North Fork. North Fork is an operated sorter, not whole-river abundance or access evidence. Late coho is a distinct winter component and is excluded.

## 3. Candidate run matrix

| Candidate | Decision | Reason |
| --- | --- | --- |
| wild fall Chinook | include | PGE documents recurring Sep-Oct run below River Mill |
| early fall coho | include | PGE distinguishes Sep-Oct component and upstream passage |
| late coho | exclude | materially distinct Nov-Jan component |
| fall steelhead | exclude | official truth is summer/winter; sheet label alone inadequate |
| lake-run brown trout | exclude | no credible lake-run evidence found |

## 4. Capability audit

| Capability | Decision | Limitation |
| --- | --- | --- |
| Gauge Read | flow CFS, height ft, measured temp °F at 14211010 | metrics fail closed independently; lower river only |
| Historical temperature | no separate tile | current measured source suffices; no duplicate archive product |
| Fish Counts | verified source, unavailable in product | PGE publishes daily North Fork sorter XLSX files; facility passage is not whole-river abundance and no revision-tested parser is implemented. Early coho alone reaches this modeled facility; fall Chinook ends below River Mill. |
| Fishing Shape | available | 2012-2025 Aug.1-Jan.15, 2,337 days; 772/886/3290/5870/8580 CFS p10/p25/p75/p90/p95 |
| Activity | full observed | .25 light/.35 temp/.30 river/.10 weather; lower reach only |
| Migration Timing / Push | unavailable | no confirmed-movement claim |

Positive-rise p50/p75/p90 are 82/550/1850 CFS and 6.5/23.1/65.1%. Missing weather yields no scored block; stale/invalid river inputs fail closed. Fishing Shape is not abundance, clarity, access, passage, or safety.

## 5. Run records and Seasonal Zone

| Run | Dates: pre, staging, start, beginning end, established/broad, peak start/day/end, taper, end, late, post-copy | Presence/endpoint |
| --- | --- | --- |
| `clackamas_fall_chinook` | 08-10,08-25,09-05,09-15,09-16/09-22,09-25/10-05/10-15,10-25,11-02,11-10,11-20 | sectional max 7; River Mill; semelparous |
| `clackamas_fall_coho` | 08-20,09-01,09-10,09-20,09-21/10-01,10-05/10-15/10-25,11-05,11-15,11-25,12-05 | sectional max 7; North Fork corridor; early component only |

Early approach is the lower Willamette confluence and river mouth. Chinook uses the lower/middle two-reach spawner plan and never recommends the coho corridor. Coho uses the audited three-reach plan. Both have independent calendars, lifecycle caps, presence curves, observed source contracts, unavailable legacy primitives, and disabled public audits.

## 6. Spot Finder

Lower: Clackamette, Cross Memorial, Carver. Middle: Barton, Bonnie Lure, and Milo McIver. Coho-only upper corridor: Estacada Lake, with an explicit statement that the fall-Chinook product ends below River Mill. All are government-documented and verified 2026-09-02 with fee, facility-boundary, and non-blanket-access cautions. High Rocks and generic road-frontage references remain excluded because they are not among the safest, clearest discrete recommendations.

## 7. Reconciliation and acceptance

`config/onboarding/fall2026.ts`, Seasonal Zone, Spot Finder, artwork, and picker use exact IDs and reconcile to this dossier. Capability isolation omits the river for incompatible clients and rejects incompatible direct draft snapshots. No database change is required. Hidden rendered review is ready; acceptance and public release remain ungranted.

### Owner-review digest

Two runs only. Full measured lower-river Activity and Gauge Read; percentile Fishing Shape; no count tile. Review the River Mill/North Fork endpoints, lower-gauge scope, early-vs-late coho split, and access cautions.

## 2. Identity and corridor
Identity, termini, timezone, weather point, exclusions, and the 30-mile corridor are approved above against E-001–E-007.

## 4. Barrier and passage inventory
River Mill is the Chinook endpoint and a coho passage link; North Fork is the operated coho sorting endpoint, never access or abundance evidence.

## 5. Species endpoints and passage chains
Chinook: mouth → lower → middle → River Mill. Early coho: mouth → lower → River Mill passage → North Fork. Other candidates are excluded above.

## 6. Regulations
Current Oregon Willamette Zone rules, in-season updates, and posted PGE boundaries govern and require release-day recheck.

## 7. Source and capability audit
USGS 14211010 is primary-scored for the lower reach. PGE counts remain unavailable until a dedicated provider/parser passes revision QA.

## 8. Spot Finder
| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Willamette confluence and Clackamas mouth | receiving-water approach | E-003,E-006 | rules differ | approach only before migration; lower at Beginning |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | v1 | lower | middle | middle | middle | lower+middle | middle | middle | River Mill endpoint |
| Early coho | v1 | lower | middle | middle | middle+coho | all | middle+coho | middle+coho | North Fork chain |

## 9. Candidate species/run matrix
The final inclusion/exclusion matrix and negative official-source search are recorded above.

## 10. Species/run records
The two records reconcile dates, biology, presence, lifecycle, complete Activity, Fishing Shape, geography, and unavailable legacy fields.

### Activity tuning and fixed replay
Fixed 2012–2025 measured lower-river replay; missing hourly weather produces no score.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| All | all blocks | replay artifact | replay artifact | artifact | artifact | artifact | artifact | artifact | artifact | artifact | lifecycle/data caps enforced |

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| v1 | bands, temperature, trends | fixed USGS audit | measured differentiation | onboarding replay | no movement claim | owner-review candidate |

## 11. Configuration reconciliation
Config, capability, catalog isolation, Seasonal Zone, Spot Finder, art, and IDs reconcile; no database object is involved.

## 12. Acceptance and release record
Hidden rendered owner review only. Acceptance, public authorization, and mobile release actions are not granted.

## 13. Correction and learning ledger
Separated late coho; removed unsupported fall steelhead; did not apply North Fork counts to Chinook; withheld unparsed spreadsheets; removed cross-river fallback copy so every stage names only Clackamas reaches.

**Contradiction search completed by/date:** Codex / 2026-09-02
**Independent falsification review by/date:** source-class, run-calendar, counter, temperature-history, and access audit / 2026-09-02
