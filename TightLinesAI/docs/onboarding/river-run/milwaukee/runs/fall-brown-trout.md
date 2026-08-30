# Milwaukee River Fall Lake-run Brown Trout River Run Profile

**River ID:** `milwaukee` **Species slug:** `lake_run_brown_trout`\
**Created:** 2026-08-26 **Status:** `gate_4b_activity_owner_review`

> This is the first dedicated lake-run Brown Trout engine path. It must not
> inherit Chinook/Coho death semantics or Steelhead's pre-spawn-overwintering
> purpose.

## 0. Candidate capability audit

| Question/source class  | Finding                                                                                                                                                        | Evidence            | Outcome                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------ |
| Occurs and recurs?     | DNR collected 115 Milwaukee River/harbor adults for brood in fall 2024; current stocking and stream harvest corroborate recurrence                             | B-001, B-002, B-003 | supported                                  |
| Strong opportunity?    | Owner/local **9/10** calibration; direct adult brood sample is not a total return                                                                              | B-004               | supported, medium exact ceiling confidence |
| Calendar?              | Fish enter tributaries in October; Milwaukee brood collection begins late Oct.; ripe/spawning fish anchor Nov.–early Dec.; Seeforellen run generally Nov.–Dec. | B-005, B-006, B-007 | supported/calibrated                       |
| Post-spawn behavior?   | Brown Trout are repeat spawners; survivors may hold in tributaries or return lakeward                                                                          | B-007, B-008        | nonterminal                                |
| Distribution/endpoint? | Brown Trout move upriver from the estuary; Bridge Street is the first complete fish barrier, while dependable opportunity remains lower-river weighted         | B-001, B-009, B-012 | full physical corridor; concentrated lower |
| Regulations?           | Sept. 15–May night restriction applies; the signed Kletzsch fish-passage refuge remains closed year-round                                                      | B-010               | locked                                     |
| Contradiction search   | No evidence supports a salmon death curve, universal immediate lake return, or a biological stop at North Avenue                                               | all                 | corrected 2026-08-26                       |

**Capability decision:** `supported_hidden_repeat_spawner`

## 1. Locked truth and separate engine

| Field/config path    | Implemented value                                                                               | Basis/status                                 |
| -------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------- |
| identity             | `milwaukee_fall_brown_trout`; public “Fall Lake-run Brown Trout”                                | reconciled                                   |
| biology              | `great_lakes_lake_run_brown_trout_v1`; `Salmo trutta`; `semelparous=false`                      | B-007, B-008                                 |
| run type             | `fall_repeat_spawn`                                                                             | new lifecycle identity                       |
| movement engine      | `fall_repeat_spawner_cooling` v1                                                                | implemented separately from salmon/Steelhead |
| maximum/distribution | **9/10**, `concentrated`                                                                        | owner/local; Harbor & Downtown weighted      |
| endpoint             | downstream face of Bridge Street Dam                                                            | first complete physical fish barrier         |
| capabilities         | Stage, observed Activity, Fish In River, and Fishability available; Timing and Push unavailable | Estabrook-scoped measured contract           |
| run window           | `09-01` pre-run through `02-15` completion copy                                                 | calibrated calendar below                    |
| presence             | `milwaukee-lake-run-brown-presence-v1-draft`                                                    | reconciled                                   |
| post-run             | score `null`; “may remain or return lakeward”                                                   | prevents false death/exit claim              |
| Fishability          | available only for the Estabrook Urban Greenway reach                                           | fixed post-removal hydraulic bands           |
| visibility           | draft registry, `publicAudit=false`                                                             | hidden                                       |

### 1.1 Endpoint decision

Bridge Street Dam is the common complete physical endpoint. Brown Trout guidance
remains explicitly concentrated toward Harbor & Downtown, expands into the Urban
Greenway as the run builds, and treats legal North Shore water as a selective
secondary check rather than equal distribution. Estabrook Activity and
Fishability describe only the Urban Greenway near the gauge; they do not measure
Harbor & Downtown or the North Shore.

### 1.2 Configuration reconciliation

The packet matches every runtime-affecting field in
`config/onboarding/milwaukee.ts`: identity, new run/engine types, capability
flags, all calendar boundaries, presence anchors, Fishability/baseline,
Brown-specific observed Activity, copy strategy, source notes, and disabled
public audit. No salmon lifecycle floor, Push, or Conditions Suggest policy is
silently inherited.

### 1.3 Portfolio comparison

The 9/10 owner/local calibration is the strongest selected Brown rating in this
cohort. Bois Brule has stronger direct count quality but a conservative 7/10
product ceiling; these facts are retained rather than forced into a count-to-
score formula. Milwaukee ceiling confidence remains medium.

## 2. Seasonal calendar

| Boundary                        | Date                  | Meaning/basis                                                | Confidence                              |
| ------------------------------- | --------------------- | ------------------------------------------------------------ | --------------------------------------- |
| Pre-run / staging               | 09-01 / 09-20         | harbor watch before October entry                            | medium                                  |
| Start / beginning end           | 10-01 / 10-15         | DNR October tributary entry                                  | high month; medium days                 |
| Established / broad building    | 10-16 / 11-01         | late-Oct. brood collection and November build                | medium-high                             |
| Peak start / anchor / end       | 11-15 / 11-25 / 12-10 | November/early-Dec. ripeness and Nov.–Dec. spawning          | high period; medium days                |
| Tapering end                    | 12-20                 | main spawn build declines                                    | medium                                  |
| Tracked migration end           | 01-15                 | late holding/return mixture no longer estimated as migration | medium-low date; high semantic boundary |
| Presence tail / completion copy | 01-31 / 02-15         | no numeric fall-migration estimate                           | product boundary                        |

Egg-take or brood-collection dates anchor ripeness/spawning; they are not
misrepresented as first river entry. The late tail recognizes variable holding
and lakeward return without claiming their proportions.

## 3. Migration Stage copy contract

| Phase                | Where to start                                    | Required behavior                                    |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| Before/staging       | Milwaukee Harbor; lower river only as early check | no inland claim                                      |
| Beginning/building   | Harbor first; add Urban Greenway selectively      | lower-river weighted; avoid spawners                 |
| Peak/tapering/ending | Harbor/Urban holding water; North Shore selective | no equal-distribution or mortality claim             |
| Complete             | no active starting section in this model          | explicitly say survivors may hold or return lakeward |

The night/refuge warning precedes section guidance. Bridge Street is the
physical endpoint; the Kletzsch refuge is never presented as fishable water.

## 4. Fish In River

**Maximum:** 9/10 (`90/100`) **Scope:** concentrated/lower-river weighted

| Offset from 10-01 | Fraction | Biological/observational reason    |
| ----------------: | -------: | ---------------------------------- |
|                 0 |      .05 | October entry begins               |
|                14 |      .15 | early lower-river build            |
|                31 |      .50 | late-Oct./early-Nov. establishment |
|                45 |      .78 | peak opening                       |
|                55 |     1.00 | Nov. 25 anchor                     |
|                70 |      .90 | early-Dec. spawning shoulder       |
|                80 |      .70 | taper                              |
|                91 |      .45 | post-spawn mixture                 |
|               106 |      .25 | final tracked day                  |

During decline, copy says the tracked migration is winding down—not that Brown
Trout die. After Jan. 15 Fish In River becomes unavailable (`null`), because the
fall engine cannot quantify the mix of tributary holders and lake-returning
fish.

## 5. Activity

**Decision:** `observed_river_hidden_owner_review`\
**Version:** `milwaukee-fall-brown-observed-activity-v2-draft`

The Brown-specific observed profile weights measured Estabrook temperature 45%,
effective light 25%, river presentation 25%, and same-block precipitation 5%.
Full confidence requires the same Urban Greenway measurement pair and weather;
missing one river input is Moderate, while missing weather or both river inputs
returns Unavailable. The score never claims to measure harbor or North Shore
conditions.

The fixed 2024–2025 replay covers 195/268 dates (72.76%). Daily scores were min
4, p10 15, median 62, mean 57.66, p90 83, max 96. Stage means were Beginning
35.96, Building 72.81, Peak 78.79, Tapering 64.80, Ending 59.73, and residual
48.88. The controlled stage response corrects the unadjusted Building/Peak
inversion while retaining repeat-spawner continuity. Every measured-source,
copy, block, thermal, hydraulic, lifecycle, and mortality-language invariant
passes. The two-season/72.76% record remains an explicit public-release
limitation. The separate 1973–1979 sensitivity window covered only 313/938 dates
(33.37%) and is not treated as primary calibration evidence.

## 6. Fishability and Gauge Read

Fishability uses the same fixed 2019–2025 post-removal Estabrook bands as the
other Milwaukee runs and describes presentation shape only in the Urban Greenway
near `04087000`. Gauge Read independently freshness-gates flow, height, and
temperature. Neither primitive confirms Brown Trout abundance, Harbor/North
Shore conditions, access, or safety. Historical temperature average stays
suppressed.

## 7. Evidence ledger

| ID    | Primary source                                                                                                                                                                                                                                                                                                                                                                          | Supports / limitation                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| B-001 | Wisconsin DNR, [2025 Lake Michigan GLFC report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf)                                                                                                                                                                                                                                                             | 115 Milwaukee River/harbor brood adults in fall 2024; intentional sample, not total return        |
| B-002 | Wisconsin DNR, [2024 stocking summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                                                                                                                                                                                                                                                          | 14,213 yearlings at Milwaukee River net pen; not adult returns                                    |
| B-003 | Wisconsin DNR, [2006–2024 harvest tables](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables2006-2024.pdf)                                                                                                                                                                                                                                               | 2024 Milwaukee County Brown harvest 2,135, 415 stream; broader than this river                    |
| B-004 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                                                                                                                                                                                                                                   | 9/10 strength; experiential                                                                       |
| B-005 | Wisconsin DNR, [2026 Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport)                                                                                                                                                                                                                                                                                  | October tributary entry; late-Oct. collection; Nov./early-Dec. ripeness                           |
| B-006 | Wisconsin DNR, [Milwaukee fall calendar](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                                                                                                                                                                                                                                                         | December peak context; older broad guide                                                          |
| B-007 | Wisconsin DNR, [Lake Michigan trout/salmon questions](https://dnr.wisconsin.gov/topic/Fishing/questions/lakemichtroutsalmon.html) and [Besadny report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/BesadnyFacilityReport)                                                                                                                                                      | Nov.–Dec. Seeforellen spawning and later fall program timing                                      |
| B-008 | Wisconsin DNR, [Brown Trout biology](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_browntrout.pdf); USGS, [Brown Trout species profile](https://nas.er.usgs.gov/queries/factsheet.aspx?SpeciesID=931)                                                                                                                                                             | repeat spawning/survival; general biology                                                         |
| B-009 | Wisconsin DNR, [Milwaukee access material](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                                                                                                                                                                                                                                                       | direct lower-reach support; species omission at an access site is not exclusion evidence          |
| B-010 | Wisconsin DNR, [current regulations](https://dnr.wisconsin.gov/topic/fishing/regulations)/[Kletzsch rule](https://dnr.wisconsin.gov/sites/default/files/topic/Rules/FH1022DraftRule.pdf)                                                                                                                                                                                                | controlling restrictions; release recheck                                                         |
| B-011 | USGS, [`04087000`](https://waterdata.usgs.gov/monitoring-location/USGS-04087000/) APIs                                                                                                                                                                                                                                                                                                  | observed Activity/Fishability in the Estabrook Urban Greenway reach only                          |
| B-012 | Milwaukee County, [Estabrook Dam environmental assessment](https://county.milwaukee.gov/ImageLibrary/Groups/cntyParks/Planning/Construction/Estabrook-Dam/Estabrook-Scoping/DRAFT_EstabrookDamEnvAssmnt090.pdf) and [Kletzsch passage FAQ](https://county.milwaukee.gov/County-Files/Parks-Department/Photo-Gallery/About/Planning/KletzschParkRiverAccessandFishPassageProjectFAQ.pdf) | Brown Trout move upriver; Bridge Street is first complete fish barrier; not equal abundance proof |

## 8. Gate status

- [x] Separate repeat-spawner engine and biology profile implemented.
- [x] Full physical endpoint, lower-river weighting, calendar, curve, and
      post-spawn uncertainty reconciled.
- [x] Stage, Fish In River, Estabrook-scoped Activity/Fishability, Gauge Read,
      restrictions, and hidden registry implemented.
- [x] No salmon death curve, universal winter hold, or universal lake return
      claim.
- [x] Brown-specific observed Activity replay and private fixtures complete.
- [x] Public audit remains disabled.
- [x] Owner accepts the hidden Activity behavior and copy.

**Run decision:** `hidden_activity_owner_accepted`\
**Configuration:** `2026-08-27-milwaukee-fishability-reconciliation.7`
