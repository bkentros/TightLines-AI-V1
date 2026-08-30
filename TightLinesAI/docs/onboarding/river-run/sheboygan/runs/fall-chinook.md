# Sheboygan River Fall Chinook River Run Profile

**River ID:** `sheboygan` **Species slug:** `chinook` **Created:** 2026-08-25\
**Status:** `gate_4b_hidden_owner_review`

## 0. Capability decision

| Question             | Finding                                                                                                                                 | Evidence               | Decision                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| Current recurrence   | DNR stocked 84,974 Chinook in the river and 74,172 in the harbor in 2024, following 154,552 river/net-pen fish in 2023                  | S-C-001                | supported; stocking is not an adult count                            |
| Direct occurrence    | DNR live-release records include a Sheboygan River Chinook; the agency access guide lists salmon at Kiwanis, Esslingen, and Kohler      | S-C-002, S-C-003       | supported                                                            |
| Passage endpoint     | Current DNR barrier material places Waelderhaus first from Lake Michigan                                                                | S-C-004                | stop below dam                                                       |
| Lifecycle            | Mature Chinook normally enter tributaries September-November and die after spawning                                                     | S-C-005                | shared Chinook biology fits                                          |
| Contradiction search | Stocking, occurrence, access, barrier, regulations, lifecycle, and older AOC sources were compared; no current return counter was found | foundation + portfolio | medium-high recurrence confidence; ceiling remains owner calibration |

**Capability decision:** `supported_hidden_gate_4a`

## 1. Truth and complete configuration reconciliation

| Field                    | Accepted value                                     | Basis                                                         | Status                 |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------- | ---------------------- |
| Identity                 | `sheboygan_fall_chinook`; `great_lakes_chinook_v1` | shared biology + direct river evidence                        | reconciled             |
| Movement                 | `fall_spawn`; `fall_cooling`                       | semelparous fall migration                                    | reconciled             |
| Strength/distribution    | 8/10; broad                                        | owner/local calibration after portfolio comparison            | reconciled             |
| Corridor                 | Harbor & Lower City; Urban River; Kohler Reach     | owner-approved foundation                                     | reconciled             |
| Endpoint                 | downstream face of Waelderhaus Dam                 | first impassable barrier                                      | reconciled             |
| Stage / Fish In River    | available; onboarding-corridor copy                | calendar and presence curve below                             | reconciled             |
| Fishability / Gauge Read | available near I-43; flow and height only          | USGS `04086000` + recent flow baseline                        | reconciled             |
| Activity                 | available; Limited weather-only                    | modeled I-43 weather; no inferred river state                  | Gate 4B reconciled     |
| Push / Migration Timing  | unavailable                                        | flow alone cannot establish movement; no temperature baseline | fail closed            |
| Public audit             | disabled                                           | release not authorized                                        | locked                 |

Every runtime-affecting Gate 4B field is implemented in
`config/onboarding/sheboygan.ts`. Activity is explicitly weather-only; no river
input, threshold, or temperature is silently inherited.

### Strength comparison

The accepted 8/10 is above Milwaukee's original research prior and below no
current counted Sheboygan return series because none exists. It reflects the
owner/local comparison plus substantial recurring river/harbor stocking and
broad agency section support. It is an ordinal opportunity ceiling, not a
conversion of 159,146 stocked juveniles into returning adults.

## 2. Seasonal calendar

| Boundary           | Date  | Meaning and evidence kind             | Basis/limitation                                                            |
| ------------------ | ----- | ------------------------------------- | --------------------------------------------------------------------------- |
| Pre-run monitoring | 08-01 | lake/harbor context                   | conservative product watch                                                  |
| Staging            | 08-15 | rare early mouth concentration        | owner-calibrated shoulder; not river presence                               |
| River start        | 08-25 | first sparse entry estimate           | regional biology allows September-November entry; early date is calibration |
| Beginning end      | 09-10 | lower-river phase ends                | calibrated                                                                  |
| Established build  | 09-11 | repeated entry can reach Urban River  | calibrated                                                                  |
| Broad build        | 09-20 | all three sections may enter the plan | modern Wisconsin timing audit; not equal distribution                       |
| Peak start         | 10-01 | strongest expectation begins          | 2023-2025 DNR regional timing                                               |
| Peak anchor        | 10-10 | highest seasonal estimate             | owner-approved timing calibration                                           |
| Peak end           | 10-20 | broad high period ends                | calibrated                                                                  |
| Tapering end       | 11-02 | fresh entry increasingly inconsistent | lifecycle constraint                                                        |
| Main run end       | 11-10 | dependable active run ends            | within DNR September-November range                                         |
| Presence tail      | 11-20 | sparse residual estimate ends         | does not imply every fish is alive or catchable                             |
| Late copy end      | 11-30 | terminal context ends                 | no lingering in-river score                                                 |

The calendar distinguishes lake staging, first river entry, seasonal peak,
spawning deterioration, and terminal tail. Stocking dates and publication dates
do not set migration boundaries.

## 3. Migration Stage corridor copy

The regulation warning is prepended before every active section plan: from Sept.
15 through the first Saturday in May, Lake Michigan tributary night fishing is
prohibited. Current rules, signs, advisories, access, and emergency orders still
control.

| State                 | Primary plan                                    | Conditional comparison                        | Limitation                             |
| --------------------- | ----------------------------------------------- | --------------------------------------------- | -------------------------------------- |
| Staging               | Sheboygan Harbor and river entrance             | Harbor & Lower City only with direct evidence | calendar does not confirm entry        |
| Beginning             | Harbor & Lower City                             | Urban River only after direct fish evidence   | start low                              |
| Early building        | Harbor & Lower City                             | Urban River                                   | broad rating is not equal distribution |
| Established building  | Urban River                                     | Harbor & Lower City for newer fish            | Kohler remains conditional             |
| Broad building / Peak | Urban River                                     | legal Kohler Reach below Waelderhaus          | Kohler access not guaranteed           |
| Tapering / Ending     | established Urban or legal Kohler holding water | lower water only with direct evidence         | avoid visibly spawning fish            |
| Complete              | no active section                               | none                                          | isolated fish do not extend the model  |

## 4. Fish In River

**Curve:** `sheboygan-chinook-presence-v1-draft`\
**Maximum:** 8/10 **Scope:** broad

| Day from Aug. 25 | Fraction of maximum | Interpretation     |
| ---------------: | ------------------: | ------------------ |
|                0 |                 .08 | sparse beginning   |
|               10 |                 .22 | lower-river build  |
|               17 |                 .40 | established build  |
|               26 |                 .62 | broad build begins |
|               37 |                 .82 | peak opening       |
|               46 |                1.00 | Oct. 10 peak       |
|               56 |                 .90 | high shoulder      |
|               69 |                 .55 | taper              |
|               77 |                 .22 | ending             |
|               87 |                 .06 | sparse tail        |
|               97 |                   0 | complete           |

The public value is a rounded seasonal estimate relative to this river's 8/10
ceiling. It never represents a fish count, catch probability, or confirmation
that fish occupy a named pool.

## 5. Conditions primitives

- Fishability uses USGS `04086000` only near I-43: `<87` very low, `87–117` low,
  `118–338` ideal, `339–674` high, `675–874` very high, and `>=875` blown out.
- Gauge Read exposes flow and height independently, with exact observation time,
  age, provisional attribution, and no temperature placeholder.
- The gauge does not directly represent the harbor or the full Kohler Reach and
  may be discontinued after Oct. 1, 2026 without replacement funding.
- Activity uses modeled I-43 weather only, is labeled Limited, and discloses
  that river level, clarity, and measured temperature are unknown. Its
  2007-2025 replay covered 1,862/1,862 days: min 31, median 69, mean 69.09,
  max 90. The owner-requested −5 Staging/Beginning response is literal:
  Pre-run mean 69.73 versus 74.73 and Beginning 69.73 versus 74.73 in the
  preserved baseline. Peak mean 78.50 declines through Taper 70.39, Ending
  56.96, and Post-run 45.73 with every invariant clear.
- Air or Lake Michigan temperature is not used as river temperature. See
  `../activity-replay.md` for the complete contract and calibration ledger.

## 6. Evidence ledger

| ID      | Primary source                                                                                                                                                                               | Supports / limitation                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| S-C-001 | Wisconsin DNR, [2024 Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                                        | 2023-2024 recurring Sheboygan river/harbor stocking; not returns                             |
| S-C-002 | Wisconsin DNR, [Live Release Records](https://dnr.wisconsin.gov/topic/Fishing/recordfish/LiveReleaseRecords)                                                                                 | direct river occurrence; exceptional fish cannot set strength                                |
| S-C-003 | Wisconsin DNR, [Lake Michigan tributary access guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf)                                                 | named lower, urban, and Kohler salmon access context; old guide, no current access guarantee |
| S-C-004 | Wisconsin DNR, [Lake Michigan drainage barrier table](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf)                                          | first impassable barrier at Waelderhaus                                                      |
| S-C-005 | Wisconsin DNR, [Chinook life history](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_chinooksalmon.pdf)                                                                 | September-November tributary entry and terminal lifecycle; regional, older                   |
| S-C-006 | Wisconsin DNR, [2026-2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations) and [fall tributary rule](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html) | controlling rules and night restriction; recheck at release                                  |
| S-C-007 | USGS, [`04086000`](https://waterdata.usgs.gov/monitoring-location/USGS-04086000/)                                                                                                            | I-43 hydraulics and discontinuation notice; no temperature                                   |
| S-C-008 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                                        | 8/10 broad opportunity; experiential rather than a count                                     |

## 7. Gate status

- [x] Capability, strength, distribution, endpoint, lifecycle, and calendar
      reconciled.
- [x] Restriction-first corridor copy, Stage, Fish In River, Fishability,
      partial Gauge Read, and hidden registry implemented.
- [x] Limited weather-only Activity implemented and historically replayed;
      missing weather fails closed.
- [x] Push and Migration Timing fail closed.
- [x] Public registry and public audit remain disabled.
- [ ] Owner accepts the hidden Gate 4B Activity candidate.

**Run decision:** `hidden_gate4b_ready_for_owner_review`\
**Configuration:** `2026-08-27-sheboygan-fishability-reconciliation.4`
