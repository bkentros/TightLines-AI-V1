# Milwaukee River Fall Coho River Run Profile

**River ID:** `milwaukee` **Species slug:** `coho` **Created:** 2026-08-25\
**Status:** `gate_4b_activity_owner_review`

> Hidden Activity candidate. Public enablement and release remain unauthorized.

## 0. Candidate capability audit

| Question/source class   | Finding                                                                                                   | Evidence       | Outcome                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------- |
| Occurs and recurs?      | Current Milwaukee stocking and DNR fall-opportunity material support a recurring run                      | C-001, C-002   | supported                                |
| Dependable opportunity? | Owner/local 7/10 calibration; no complete river-return series                                             | C-003          | supported, medium-low ceiling confidence |
| Distribution?           | Sectional below Bridge Street; passage does not establish equal upstream abundance                        | C-004, C-005   | sectional                                |
| Calendar?               | Milwaukee-area DNR calendar marks October peak                                                            | C-001          | calibrated daily boundaries              |
| Lifecycle?              | Fall/early-winter spawning; adult Coho are semelparous                                                    | shared biology | supported                                |
| Regulations?            | Kletzsch refuge and Sept. 15–May night restriction require prominent copy                                 | C-005, C-006   | locked                                   |
| Contradiction search    | No primary source excludes recurring Coho; generic salmon language and stocking are not treated as counts | all            | passed 2026-08-26                        |

**Capability decision:** `supported_hidden`

## 1. Locked truth and field reconciliation

| Field/config path    | Implemented value                                                                     | Basis/status                                                 |
| -------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| identity/biology     | `milwaukee_fall_coho`; `great_lakes_coho_v1`                                          | reconciled                                                   |
| run type/engine      | `fall_spawn`; `fall_cooling`                                                          | shared biology                                               |
| maximum/distribution | **7/10**, `sectional`                                                                 | owner/local calibration; medium-low exact ceiling confidence |
| endpoint             | downstream face of Bridge Street Dam                                                  | owner-approved foundation                                    |
| capabilities         | Stage, Activity, Fish In River, Fishability available; legacy Timing/Push unavailable | gate contract                                                |
| run window           | `08-20` pre-run through `12-20` late copy                                             | calendar below                                               |
| presence curve       | `milwaukee-coho-presence-v1-draft`                                                    | reconciled                                                   |
| Fishability/baseline | shared Estabrook bands; 2019–2025 post-removal flow                                   | USGS audit C-007                                             |
| temperature scoring  | Estabrook same-gauge source; Activity only                                            | same-reach contract                                          |
| copy                 | `onboarding_corridor`, Milwaukee restrictions/routes                                  | reconciled                                                   |
| visibility           | draft registry, `publicAudit=false`                                                   | hidden                                                       |

**Endpoint chain:** Harbor & Downtown → Urban Greenway → legal North Shore below
Bridge Street. Kletzsch and Mequon-Thiensville passage are conditional; the
Kletzsch refuge is excluded.\
**Code reconciliation:** completed 2026-08-26 against
`config/onboarding/milwaukee.ts`.

### Portfolio comparison

The owner/local 7 replaces the 3/10 research prior. It remains below the
accepted 8/10 Grand/Bois Brule comparison and below Root's 9/10 direct-return
calibration. Agency evidence establishes recurrence, not Milwaukee adult-return
abundance; confidence therefore remains medium-low.

## 2. Seasonal calendar

| Boundary                             | Date                  | Meaning/basis                             | Confidence                     |
| ------------------------------------ | --------------------- | ----------------------------------------- | ------------------------------ |
| Pre-run / staging                    | 08-20 / 09-01         | harbor monitoring before dependable entry | medium                         |
| Start / beginning end                | 09-10 / 09-20         | first dependable entry phase              | medium                         |
| Established / broad building         | 09-21 / 10-01         | lower-to-inland progression               | medium                         |
| Peak start / anchor / end            | 10-10 / 10-20 / 10-31 | DNR October peak, calibrated days         | medium-high month; medium days |
| Tapering end                         | 11-20                 | November shoulder declines                | medium                         |
| Main end / presence tail / late copy | 11-30 / 12-10 / 12-20 | residual-to-inactive transition           | medium                         |

The DNR calendar establishes the peak month, not exact daily boundaries. All
day-level values are explicit Gate 4 calibrations.

## 3. Migration Stage and corridor copy

| Phase           | Where to start                                          | Constraint                           |
| --------------- | ------------------------------------------------------- | ------------------------------------ |
| Before/staging  | Milwaukee Harbor; lower river only with direct evidence | staging does not confirm entry       |
| Beginning       | Harbor & Downtown                                       | keep inland distribution conditional |
| Building        | Harbor & Downtown → Urban Greenway                      | passage is not abundance             |
| Broad/peak      | Urban Greenway first; legal North Shore selectively     | stay outside Kletzsch refuge         |
| Tapering/ending | established Urban Greenway/North Shore holding water    | avoid active spawning fish           |
| Complete        | no active starting section                              | do not chase isolated fish broadly   |

The refuge and seasonal night warning precedes every `whereToStart` direction.
No copy crosses Bridge Street Dam or enters the refuge.

## 4. Fish In River

**Maximum:** 7/10 (`70/100`) **Scope:** sectional

| Offset from 09-10 | Fraction | Reason             |
| ----------------: | -------: | ------------------ |
|                 0 |      .05 | first entry        |
|                10 |      .18 | beginning shoulder |
|                21 |      .50 | established build  |
|                30 |      .80 | peak opening       |
|                40 |     1.00 | October peak       |
|                51 |      .88 | peak shoulder      |
|                71 |      .50 | taper              |
|                81 |      .22 | ending             |
|                91 |      .08 | tail               |
|               101 |        0 | inactive           |

The output is an approximate seasonal estimate relative to the Milwaukee Coho
ceiling, never a live count or catch promise.

## 5. Activity

**Decision:** `observed_river_hidden_owner_review`\
**Version:** `milwaukee-fall-coho-observed-activity-v1-draft`

The Estabrook-only model weights effective light 25%, measured temperature 40%,
river presentation 30%, and same-block precipitation 5%. It cannot infer
movement or abundance and fails closed without weather or both river inputs.

The 2024–2025 primary replay covers 181/202 dates (89.60%). Daily scores were
min 19, p10 23, median 49, mean 52.29, p90 88, max 96. Stage means were
Beginning 22.86, Building 55.15, Peak 75.04, Tapering 67.62, Ending 48.80, and
residual 32.50. All scope, cap, block, copy, and lifecycle invariants pass. The
1973–1979 sensitivity interval covered only 49.22% and is not promoted as the
primary calibration; the short two-season modern duration remains a public-
release limitation.

## 6. Fishability and Gauge Read

USGS `04087000` supports independently fresh flow, height, and measured water
temperature at Estabrook Park. Fishability uses the fixed 2019–2025 post-removal
fall flow distribution: `<170`, `170–236`, `237–593`, `594–1519`, and
`>=1520 CFS`. Copy explicitly limits the read to the Urban Greenway and
disclaims harbor, North Shore, access, and safety conclusions. The discontinuous
temperature history does not qualify for a displayed daily average.

## 7. Evidence ledger

| ID    | Primary source                                                                                                                                                                     | Supports / limitation                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| C-001 | Wisconsin DNR, [Milwaukee fall shore fishing](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html) and linked brochure                                           | Milwaukee Coho opportunity and October peak; older, not abundance |
| C-002 | Wisconsin DNR, [2024 Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                              | recurring stocking; not adult returns                             |
| C-003 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                              | 7/10 strength; experiential                                       |
| C-004 | Wisconsin DNR, [Milwaukee habitat-management actions](https://dnr.wisconsin.gov/sites/default/files/topic/GreatLakes/MKE_F%26WHabitatManagementActionsLetter.pdf)                  | passage/barrier chain                                             |
| C-005 | Wisconsin DNR, [Kletzsch refuge rule](https://dnr.wisconsin.gov/sites/default/files/topic/Rules/FH1022DraftRule.pdf)                                                               | refuge and passage context                                        |
| C-006 | Wisconsin DNR, [2026–2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations) and [fall page](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html) | seasonal and section restrictions                                 |
| C-007 | USGS, [`04087000`](https://waterdata.usgs.gov/monitoring-location/USGS-04087000/) daily/continuous APIs                                                                            | post-removal baseline and current metrics; Estabrook only         |

## 8. Gate status

- [x] Truth, calendar, endpoint, lifecycle, curve, sections, and restrictions
      reconciled.
- [x] Stage, Fish In River, Fishability, Gauge Read, and hidden registry
      implemented.
- [x] Observed Activity replay and private fixtures complete; public audit
      disabled.
- [x] Owner accepts the hidden Activity behavior and two-season limitation.

**Run decision:** `hidden_activity_owner_accepted`\
**Configuration:** `2026-08-27-milwaukee-steelhead-local-peak.6`
