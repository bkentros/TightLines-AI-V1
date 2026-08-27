# Sheboygan River Fall Coho River Run Profile

**River ID:** `sheboygan` **Species slug:** `coho` **Created:** 2026-08-25\
**Status:** `gate_4b_hidden_owner_review`

## 0. Capability decision

| Question           | Finding                                                                                                                                              | Evidence               | Decision                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------- |
| Current recurrence | DNR stocked 66,094 Coho in the Sheboygan River in 2024 and 115,236 in 2023                                                                           | S-CO-001               | supported; stocking is not an adult count      |
| Direct opportunity | DNR names salmon at all three corridor references; current river-specific Coho counts are absent                                                     | S-CO-002               | supported with medium confidence               |
| Passage endpoint   | Waelderhaus is the first current impassable barrier                                                                                                  | S-CO-003               | stop below dam                                 |
| Lifecycle/calendar | Coho migrate into Wisconsin Lake Michigan tributaries September-December and die after spawning                                                      | S-CO-004               | shared Coho biology fits                       |
| Falsification      | Stocking, generic-salmon access, older AOC occurrence, barrier, and lifecycle sources were compared; no current exclusion or return census was found | foundation + portfolio | supported but count confidence remains limited |

**Capability decision:** `supported_hidden_gate_4a`

## 1. Truth and configuration reconciliation

| Field                    | Accepted value                                                 | Basis                                        | Status      |
| ------------------------ | -------------------------------------------------------------- | -------------------------------------------- | ----------- |
| Identity                 | `sheboygan_fall_coho`; `great_lakes_coho_v1`                   | shared biology + recurring river stocking    | reconciled  |
| Movement                 | `fall_spawn`; `fall_cooling`                                   | semelparous autumn migration                 | reconciled  |
| Strength/distribution    | 8/10; broad                                                    | owner/local calibration; medium evidence     | reconciled  |
| Corridor/endpoint        | three approved sections through downstream face of Waelderhaus | common passage chain                         | reconciled  |
| Stage / Fish In River    | available; onboarding-corridor copy                            | Coho calendar and curve below                | reconciled  |
| Fishability / Gauge Read | available near I-43; flow and height only                      | shared Sheboygan hydraulics                  | reconciled  |
| Activity                 | available; Limited weather-only                                | modeled I-43 weather; no inferred river state | reconciled  |
| Push / Migration Timing  | unavailable                                                    | no measured-temperature contract             | fail closed |
| Public audit             | disabled                                                       | release not authorized                       | locked      |

No Chinook dates, strength, or terminal prose are reused implicitly. Shared
hydraulics and corridor facts remain river-level inputs; the Coho calendar and
presence curve are species-specific.

### Strength comparison

The 8/10 owner calibration is stronger than Milwaukee Coho's accepted 7/10 and
lower than Root's counted 9/10 return. Sheboygan has recurring, substantial
stocking and broad salmon access evidence but no current adult-return counter.
That supports broad opportunity with medium—not high—ceiling confidence.

## 2. Seasonal calendar

| Boundary           | Date  | Meaning                                  | Evidence/bias                       |
| ------------------ | ----- | ---------------------------------------- | ----------------------------------- |
| Pre-run monitoring | 08-20 | harbor watch begins                      | product shoulder                    |
| Staging            | 09-01 | mouth concentration may begin            | DNR regional September entry        |
| River start        | 09-10 | sparse dependable entry estimate         | calibrated                          |
| Beginning end      | 09-20 | lower-river-only phase ends              | calibrated                          |
| Established build  | 09-21 | Urban River becomes a regular comparison | calibrated                          |
| Broad build        | 10-01 | Kohler can enter the plan                | calibrated, not equal distribution  |
| Peak start         | 10-10 | strongest October expectation begins     | portfolio timing                    |
| Peak anchor        | 10-20 | highest seasonal estimate                | owner calibration                   |
| Peak end           | 10-31 | high period ends                         | calibrated                          |
| Tapering end       | 11-20 | fresh entry less dependable              | lifecycle constraint                |
| Main run end       | 11-30 | dependable active run ends               | within DNR September-December range |
| Presence tail      | 12-10 | sparse residual estimate ends            | terminal salmon tail                |
| Late copy end      | 12-20 | terminal context ends                    | no in-river score afterward         |

The date curve is a product calibration inside the DNR's broad
September-through-December tributary window. Stocking and publication dates do
not establish arrival.

## 3. Migration Stage corridor copy

Every active plan begins with the Sept. 15-to-first-Saturday-in-May tributary
night restriction and tells users to verify current rules, signs, access, and
advisories.

| State                 | Primary plan                              | Conditional comparison                   | Guardrail                       |
| --------------------- | ----------------------------------------- | ---------------------------------------- | ------------------------------- |
| Staging               | harbor/river entrance                     | Harbor & Lower City with direct evidence | no inland claim                 |
| Beginning             | Harbor & Lower City                       | Urban River after direct evidence        | start low                       |
| Early building        | Harbor & Lower City                       | Urban River                              | uneven entry expected           |
| Established building  | Urban River                               | lower water for fresher fish             | Kohler conditional              |
| Broad building / Peak | Urban River                               | legal Kohler Reach below Waelderhaus     | broad does not mean equal       |
| Tapering / Ending     | established Urban or Kohler holding water | lower entry water only with evidence     | avoid spawning fish             |
| Complete              | no active section                         | none                                     | isolated fish do not extend run |

## 4. Fish In River

**Curve:** `sheboygan-coho-presence-v1-draft` **Maximum:** 8/10 **Scope:** broad

| Day from Sept. 10 | Fraction | Meaning           |
| ----------------: | -------: | ----------------- |
|                 0 |      .06 | sparse beginning  |
|                10 |      .20 | lower-river build |
|                21 |      .52 | broadening        |
|                30 |      .80 | strong build      |
|                40 |     1.00 | Oct. 20 peak      |
|                51 |      .90 | high shoulder     |
|                71 |      .52 | taper             |
|                81 |      .24 | ending            |
|                91 |      .08 | sparse tail       |
|               101 |        0 | complete          |

This is an approximate seasonal-opportunity estimate, never a fish count or a
claim that equal numbers occupy every section.

## 5. Conditions primitives

- Fishability and partial Gauge Read use USGS `04086000` near I-43, with the
  shared recent `87/118/338/875` CFS boundaries.
- No temperature value, trend, or historical average is shown.
- Fishability is presentation shape near the gauge, not abundance, clarity,
  access, or safety.
- Activity uses modeled I-43 weather only, is labeled Limited, and discloses
  unknown river level, clarity, and measured temperature. Its 2007-2025 replay
  covered 1,919/1,919 days: min 27, median 69, mean 68.04, max 90. The
  owner-requested −5 Staging/Beginning response is literal: Pre-run mean 68.61
  versus 73.61 and Beginning 68.93 versus 73.93 in the preserved baseline.
  Peak mean 77.61 declines through Taper 70.02, Ending 55.26, and Post-run
  40.78 with every invariant clear. See `../activity-replay.md`.

## 6. Evidence ledger

| ID       | Primary source                                                                                                                                                                      | Supports / limitation                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| S-CO-001 | Wisconsin DNR, [2024 Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                               | 2023-2024 river-specific recurrence; juveniles are not returns             |
| S-CO-002 | Wisconsin DNR, [tributary access guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf) and historic Sheboygan AOC plan                      | broad salmon opportunity/occurrence; access guide is old and often generic |
| S-CO-003 | Wisconsin DNR, [Lake Michigan drainage barrier table](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf)                                 | Waelderhaus first barrier                                                  |
| S-CO-004 | Wisconsin DNR, [Coho life history](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_cohosalmon.pdf)                                                              | September-December tributary entry and terminal lifecycle; regional/older  |
| S-CO-005 | Wisconsin DNR, [2026-2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations) and [night rule](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html) | controlling restrictions; release recheck                                  |
| S-CO-006 | USGS, [`04086000`](https://waterdata.usgs.gov/monitoring-location/USGS-04086000/)                                                                                                   | I-43 flow/height and source risk; no temperature                           |
| S-CO-007 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                               | 8/10 broad opportunity; experiential                                       |

## 7. Gate status

- [x] Capability, strength, distribution, endpoint, lifecycle, and calendar
      reconciled.
- [x] Restriction-first Stage, Fish In River, Fishability, partial Gauge Read,
      and hidden registry implemented.
- [x] Limited weather-only Activity implemented and historically replayed;
      missing weather fails closed.
- [x] Push and Migration Timing fail closed.
- [x] Public registry and public audit remain disabled.
- [ ] Owner accepts the hidden Gate 4B Activity candidate.

**Run decision:** `hidden_gate4b_ready_for_owner_review`\
**Configuration:** `2026-08-27-sheboygan-steelhead-local-peak.3`
