# Milwaukee River Fall Chinook River Run Profile

**River ID:** `milwaukee` **Species slug:** `chinook` **Created:** 2026-08-25\
**Status:** `gate_4b_activity_owner_review`

> Hidden Activity candidate. Public enablement and release remain unauthorized.

## 0. Candidate capability audit

| Question/source class              | Finding                                                                                                                    | Evidence              | Outcome                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------ |
| Occurs and recurs?                 | Current river stocking plus DNR Milwaukee fall access/calendar material identify a recurring Chinook opportunity           | M-001, M-002          | supported                            |
| Dependable public opportunity?     | Owner/local 8/10 calibration; agency evidence supports recurrence but is not an adult-return census                        | M-001, M-003          | supported, medium ceiling confidence |
| Distribution?                      | Passage corridor supports sectional use below Bridge Street Dam; presence is not assumed equal above Kletzsch              | M-004, M-005          | sectional                            |
| Calendar?                          | Mature stocked Chinook begin returning late Aug.–early Sept.; Milwaukee-area DNR calendar marks September peak             | M-001, M-006          | calibrated daily boundaries          |
| Lifecycle?                         | Fall spawning; adult Chinook are semelparous                                                                               | M-006, shared biology | supported                            |
| Regulations?                       | Kletzsch refuge closed year-round; tributary night restriction applies Sept. 15–first Saturday in May                      | M-007, M-008          | mandatory prominent copy             |
| Contradiction/falsification search | No authoritative source found that excludes a recurring Milwaukee Chinook run; stocking is not treated as return abundance | all                   | passed 2026-08-26                    |

**Capability decision:** `supported_hidden`\
**Independent falsification review:** completed 2026-08-26.

## 1. Species/run truth

| Field             | Locked value                                                                         | Evidence/calibration                                      | Status                                  |
| ----------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------- |
| Public species    | Chinook salmon                                                                       | shared taxonomy                                           | locked                                  |
| Run type / engine | `fall_spawn` / `fall_cooling`                                                        | shared Great Lakes Chinook biology                        | locked                                  |
| Lifecycle         | terminal adult spawning run; completion may not claim every fish vanished on one day | shared biology/copy contract                              | locked                                  |
| Maximum           | **8/10**                                                                             | Wisconsin-local calibration relayed and approved by owner | locked; exact ceiling medium confidence |
| Distribution      | `sectional`                                                                          | corridor/passages plus local calibration                  | locked                                  |
| Product endpoint  | downstream face of Bridge Street Dam                                                 | owner-approved foundation                                 | locked                                  |
| Activity          | observed-river, Estabrook/Urban Greenway only                                        | 2024–2025 primary replay + 1973–1979 sensitivity          | owner review                            |

### 1.1 Endpoint and passage chain

The product corridor is Harbor & Downtown → Urban Greenway → legal North Shore
water below Bridge Street Dam. North Avenue and Estabrook dams are removed.
Kletzsch passage and the Mequon-Thiensville fishway permit movement but do not
prove equal abundance under every flow. Bridge Street is the hard v1 endpoint.
The signed Kletzsch bypass/refuge is never a fishing recommendation.

### 1.2 Complete configuration-field reconciliation

| Config field           | Implemented value                                                                     | Basis                                        | Status     |
| ---------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------- | ---------- |
| identity/biology       | `milwaukee_fall_chinook`; `great_lakes_chinook_v1`                                    | shared biology + M-001                       | reconciled |
| primitive capabilities | Stage, Activity, Fish In River, Fishability available; legacy Timing/Push unavailable | gate contract                                | reconciled |
| run window             | `08-01` pre-run through `11-30` late copy; dates below                                | M-001, M-006 + explicit calendar calibration | reconciled |
| handoff                | none                                                                                  | terminal salmon lifecycle                    | reconciled |
| presence               | max 8, sectional, `milwaukee-chinook-presence-v1-draft`                               | owner/local rating + portfolio               | reconciled |
| Fishability            | Estabrook `flow_cfs`; post-removal p10/p25/p75/p95 bands                              | USGS audit M-009                             | reconciled |
| water temperature      | Estabrook same-gauge source for Activity only                                         | same-reach contract                          | reconciled |
| copy strategy          | `onboarding_corridor`; Milwaukee route/restriction branch                             | approved sections and rules                  | reconciled |
| visibility             | draft registry; `publicAudit.isEnabled=false`                                         | release boundary                             | reconciled |

**Code-to-packet reconciliation:** completed 2026-08-26 against
`config/onboarding/milwaukee.ts`.

### 1.3 Portfolio comparison

The 8/10 ceiling is owner/local calibration, aligned with accepted 8/10
portfolio opportunities but not derived from stocking. It exceeds the original
6/10 research prior. Confidence remains medium because Milwaukee has no current
complete adult-return counter. Distribution stays sectional independently of
strength.

## 2. Seasonal calendar

| Boundary                  | Date                  | Meaning                                  | Kind/basis                                  | Confidence                     |
| ------------------------- | --------------------- | ---------------------------------------- | ------------------------------------------- | ------------------------------ |
| Pre-run monitoring        | 08-01                 | lake/harbor context only                 | product calibration                         | medium                         |
| Staging                   | 08-15                 | mouth/harbor staging can develop         | DNR late-Aug. return context + calibration  | medium                         |
| Start                     | 08-25                 | first dependable river-entry window      | agency timing + local calibration           | medium                         |
| Beginning end             | 09-07                 | earliest entry phase ends                | calibration                                 | medium                         |
| Established building      | 09-08                 | lower corridor becoming established      | calibration                                 | medium                         |
| Broad building            | 09-20                 | inland supported sections can enter plan | modern Wisconsin timing audit               | medium                         |
| Peak start / anchor / end | 09-28 / 10-08 / 10-18 | late-Sept. lead into early-Oct. maximum  | 2023-2025 DNR regional timing + calibration | medium-high window; medium day |
| Tapering end              | 10-31                 | main movement declining                  | calibration                                 | medium                         |
| Main run end              | 11-10                 | dependable main migration ends           | calibration                                 | medium                         |
| Presence tail / late copy | 11-20 / 11-30         | residual then inactive copy              | lifecycle calibration                       | medium                         |

Agency sources establish months and event order, not every exact boundary. Daily
dates are transparent product calibrations and must be replayed at the next
Milwaukee stop before Activity can be accepted.

## 3. Migration Stage corridor-copy contract

| State                      | Starting-section contract                                             | Required qualifier                                  |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| Before/staging             | Lake Michigan/Milwaukee Harbor; lower river only with direct evidence | staging is not confirmed river entry                |
| Beginning                  | Harbor & Downtown                                                     | do not infer inland distribution                    |
| Early building             | Harbor & Downtown, then Urban Greenway                                | passage is not equal abundance                      |
| Established/broad building | Urban Greenway; North Shore conditional                               | stay outside refuge                                 |
| Peak                       | Urban Greenway first; legal North Shore selectively                   | not every section is equal                          |
| Tapering/ending            | established Urban Greenway or legal North Shore holding water         | avoid visible spawning fish                         |
| Complete                   | no active starting section                                            | isolated fish do not sustain a broad migration plan |

Every `whereToStart` string leads with the Kletzsch-refuge and seasonal-night
restriction warning before giving section guidance. Copy names only the three
owner-approved sections and never extends above Bridge Street Dam.

## 4. Fish In River

**Maximum:** 8/10 (`80/100`) **Scope:** sectional\
**Curve:** `milwaukee-chinook-presence-v1-draft`

| Offset from 08-25 | Fraction of max | Reason                 |
| ----------------: | --------------: | ---------------------- |
|                 0 |             .08 | first dependable entry |
|                10 |             .22 | early build            |
|                17 |             .40 | established build      |
|                26 |             .62 | broader build          |
|                34 |             .82 | peak opening           |
|                44 |            1.00 | Oct. 8 peak anchor     |
|                54 |             .90 | peak shoulder          |
|                67 |             .55 | taper                  |
|                77 |             .22 | ending                 |
|                87 |             .06 | residual tail          |
|                97 |               0 | inactive               |

This is seasonal presence relative to Milwaukee's ceiling—not a count, live
arrival detector, catch probability, or equal distribution statement.

## 5. Activity

**Decision:** `observed_river_hidden_owner_review`\
**Version:** `milwaukee-fall-chinook-observed-activity-v2-draft`

The model is limited to Estabrook/Urban Greenway and uses effective light 35%,
measured water temperature 35%, river presentation 25%, and same-block
precipitation 5%. It fails closed without weather or both measured river inputs.
Missing one river input is Moderate and capped; no score is borrowed for Harbor
& Downtown or North Shore. The normal warm-water ceiling is audited at 43
instead of 39 to soften the replay's abrupt 67.6-to-68 F boundary while keeping
every warm-water day Moderate or lower; the 72 F barrier evaluates to 24 in the
fixed favorable-condition boundary test.

The owner-requested Building adjustment is exactly +5 before accepted caps. In
the maximum 2007–2025 audit window, 260 dates had every required measured input;
the candidate Building mean is 48.99 versus 44.34 without the adjustment. The
candidate stage means are Pre-run 23.83, Beginning 33.64, Building 48.99, Peak
80.25, Tapering 73.48, Ending 61.65, and residual 44.63, with every scoring,
copy, scope, block, and lifecycle invariant clear. Candidate and no-adjustment
artifacts are preserved under `docs/audits/`.

**Limitation:** Only 260/1,862 dates (13.96%) in the full audit window contain
every required measured input. This is sufficient to compare the bounded
before/after correction, not to claim continuous 19-year observed coverage.
Public release must retain the short-record limitation or wait for a longer
modern record.

## 6. Fishability and Gauge Read

- Source: USGS `04087000`, Estabrook Park, Urban Greenway only.
- Fixed baseline: 2019–2025 post-Estabrook-removal daily mean flow; 1,176 Aug.
  1–Jan. 15 observations with complete seven-year windows.
- Bands: `<170` very low; `170–236` low; `237–593` ideal; `594–1519` high/very
  high presentation water; `>=1520` blown-out presentation shape.
- Fishability never means fish abundance, legal access, wading/boating safety,
  harbor conditions, or North Shore conditions.
- Gauge Read exposes independently fresh flow, height, and water temperature;
  values older than 24 hours are suppressed. Temperature historical average
  stays unavailable because the daily series is discontinuous.

## 7. Evidence ledger

| ID    | Primary source                                                                                                                                                    | Supports / limitation                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| M-001 | Wisconsin DNR, [Milwaukee fall shore fishing](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html) and linked brochure                          | Milwaukee species opportunity; Sept. Chinook peak; brochure is older and does not quantify returns |
| M-002 | Wisconsin DNR, [2024 Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)             | current Milwaukee Chinook stocking; not return abundance                                           |
| M-003 | Owner-relayed Wisconsin local field calibration, 2026-08-26                                                                                                       | 8/10 opportunity; experiential, not a count                                                        |
| M-004 | Wisconsin DNR, [Milwaukee habitat-management actions](https://dnr.wisconsin.gov/sites/default/files/topic/GreatLakes/MKE_F%26WHabitatManagementActionsLetter.pdf) | dam removal, fishway and Bridge Street barrier chain                                               |
| M-005 | Wisconsin DNR, [Kletzsch refuge rule](https://dnr.wisconsin.gov/sites/default/files/topic/Rules/FH1022DraftRule.pdf)                                              | passage/refuge facts; current signs control                                                        |
| M-006 | Wisconsin DNR, [Chinook research](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/Chinooksalmon.html)                                                        | mature return begins late Aug.–early Sept.; fall spawning lifecycle                                |
| M-007 | Wisconsin DNR, [2026–2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations)                                                                       | controlling regulation source; recheck at release                                                  |
| M-008 | Wisconsin DNR, [Milwaukee fall-fishing page](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                               | seasonal tributary night restriction                                                               |
| M-009 | USGS, [`04087000`](https://waterdata.usgs.gov/monitoring-location/USGS-04087000/) daily and continuous APIs, audited 2026-08-26                                   | 2019–2025 flow distribution and five-minute live metrics; Estabrook reach only                     |

## 8. Gate status

- [x] Capability, strength, distribution, calendar, endpoint, and lifecycle
      reconciled.
- [x] Stage, Fish In River, Fishability, Gauge Read, restrictions, and hidden
      registry implemented.
- [x] Observed Activity calibrated, replayed, fixture-generated, and reach
      scoped.
- [x] Public registry and public audit remain disabled.
- [x] Owner accepts the hidden Activity behavior and two-season limitation.

**Run decision:** `hidden_activity_owner_accepted`\
**Configuration:** `2026-08-27-milwaukee-steelhead-local-peak.6`
