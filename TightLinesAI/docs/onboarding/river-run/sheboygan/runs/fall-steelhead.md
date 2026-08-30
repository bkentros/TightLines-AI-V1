# Sheboygan River Fall Steelhead River Run Profile

**River ID:** `sheboygan` **Species slug:** `steelhead` **Created:** 2026-08-25\
**Status:** `gate_4b_hidden_owner_review`

## 0. Capability decision

| Question             | Finding                                                                                                                                               | Evidence               | Decision                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------- |
| Current recurrence   | DNR stocked 19,248 Rainbow Trout in the Sheboygan River in 2024; direct river records and access guidance name Steelhead                              | S-S-001, S-S-002       | supported                                     |
| Fall opportunity     | Owner/local calibration supplies an exact Oct. 1 peak; agency sources independently support recurrence and Steelhead lifecycle                       | S-S-003                | fall-entry model supported                    |
| Passage endpoint     | Waelderhaus is the first current impassable barrier                                                                                                   | S-S-004                | stop below dam                                |
| Lifecycle            | Steelhead can survive spawning; fall entrants may overwinter and later spawn or return lakeward                                                       | S-S-003                | no salmon mortality model                     |
| Contradiction search | Stocking, occurrence, all-strain timing, spring/fall distinction, barrier, and regulation sources were checked; no current fall return counter exists | foundation + portfolio | supported with medium-low strength confidence |

**Capability decision:** `supported_hidden_gate_4a`

## 1. Truth and configuration reconciliation

| Field                    | Accepted value                                                    | Basis                                                   | Status      |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------- | ----------- |
| Identity                 | `sheboygan_fall_steelhead`; `great_lakes_steelhead_fall_entry_v1` | iteroparous Steelhead biology                           | reconciled  |
| Movement                 | `fall_entry`; `fall_entry_cooling`                                | fall entry only, not full winter/spring model           | reconciled  |
| Strength/distribution    | 5/10; broad                                                       | owner/local calibration; no return counter              | reconciled  |
| Corridor/endpoint        | Harbor through legal Kohler Reach below Waelderhaus               | shared barrier chain                                    | reconciled  |
| Stage / Fish In River    | available; nonterminal completion                                 | species calendar/curve below                            | reconciled  |
| Fishability / Gauge Read | available near I-43; flow and height only                         | USGS `04086000`                                         | reconciled  |
| Activity                 | available; Limited weather-only                                   | modeled I-43 weather; no inferred river state            | reconciled  |
| Push / Migration Timing  | unavailable                                                       | no measured temperature and no accepted paired baseline | fail closed |
| Handoff                  | none                                                              | no implemented winter/spring Sheboygan product          | explicit    |
| Public audit             | disabled                                                          | release not authorized                                  | locked      |

### Strength comparison

The accepted 5/10 is below Milwaukee and Root's owner-calibrated 7/10 fall
opportunity and well below the St. Joseph's counted/passage-supported 9/10. The
Sheboygan rating recognizes broad multi-strain opportunity without treating
19,248 stocked juveniles or an exceptional catch as a return census.

## 2. Fall-entry calendar

| Boundary           | Date          | Meaning                                    | Evidence/bias                                  |
| ------------------ | ------------- | ------------------------------------------ | ---------------------------------------------- |
| Pre-run monitoring | 08-01         | seasonal monitoring context                | not confirmed entry                            |
| Staging            | 08-15         | sparse pre-entry watch                     | does not establish broad fall fishing          |
| Fall-entry start   | 09-01         | first modeled entrants                     | conservative interpolation                     |
| Beginning end      | 09-10         | sparse lower phase ends                    | interpolated around field anchor                |
| Established build  | 09-11         | cooling-season build                       | calibrated                                     |
| Broad build        | 09-20         | broader corridor distribution becomes plausible | calibrated                                |
| Peak start         | 09-25         | high-presence approach                     | conservative shoulder                          |
| Peak anchor        | **10-01**     | exact owner/local peak                     | locked field calibration                       |
| Peak end           | 10-15         | high fall-entry shoulder ends              | interpolated                                   |
| Tapering end       | 11-15         | fresh entry slows                          | does not imply departure                       |
| Fall model end     | 12-15         | fall-entry estimate stops                  | winter/spring is separate                      |
| Tail / late copy   | 01-15 / 01-31 | completion context only                    | no scored winter presence                      |

The curve uses the owner/local Oct. 1 fall peak. Skamania-specific summer-run
timing and the separate spring migration are outside this calendar.

## 3. Migration Stage corridor copy

The tributary night restriction leads all active location guidance. Copy never
claims that fewer new entrants means Steelhead left or died.

| State                 | Primary plan                           | Conditional comparison               | Guardrail                        |
| --------------------- | -------------------------------------- | ------------------------------------ | -------------------------------- |
| Staging               | harbor/river entrance                  | lower city with direct evidence      | monitoring context, not confirmed entry |
| Beginning             | Harbor & Lower City                    | Urban River after direct evidence    | sparse entry                     |
| Early building        | lower first                            | Urban River                          | uneven strain timing             |
| Established building  | Urban River                            | lower lanes for fresher fish         | Kohler conditional               |
| Broad building / Peak | Urban River                            | legal Kohler Reach below Waelderhaus | broad, not equal                 |
| Tapering / Ending     | established Urban/Kohler holding water | lower lanes only with evidence       | fish may remain                  |
| Complete              | no fall-entry starting section         | none                                 | model stops; fish may overwinter |

## 4. Fish In River

**Curve:** `sheboygan-steelhead-fall-presence-v2-local-peak-draft` **Maximum:** 5/10\
**Scope:** broad fall entry

| Day from Sept. 1 | Fraction | Meaning                                |
| ---------------: | -------: | -------------------------------------- |
|                0 |      .12 | sparse early entry                     |
|               10 |      .35 | established build                      |
|               19 |      .65 | broad build                            |
|               30 |     1.00 | **Oct. 1 seasonal crest**              |
|               44 |      .90 | mid-October shoulder                   |
|               75 |      .75 | November holding/entry mix             |
|              105 |      .62 | fish may remain when fall model closes |

After Dec. 15 the score becomes unavailable rather than zero. This prevents the
fall model from claiming Steelhead disappeared, died, or universally returned to
Lake Michigan. No winter or spring handoff exists yet.

## 5. Conditions primitives

- Fishability and Gauge Read use only USGS `04086000` near I-43, with no river
  temperature field or inferred temperature.
- The shared flow bands are `<87`, `87–117`, `118–338`, `339–674`, `675–874`, and `>=875`
  CFS; they describe presentation shape, not fish abundance or safety.
- Activity uses modeled I-43 weather only, remains Limited, and cannot infer
  flow response or fish movement. The 2007-2025 replay covered 3,192/3,192
  days: min 49, median 63, mean 62.06, max 78, with every invariant clear.
  No salmon mortality or forced late-stage decline is applied because living
  fish can remain or overwinter. See `../activity-replay.md`.
- Push and Migration Timing remain unavailable because the accepted evidence
  contract is incomplete.

## 6. Evidence ledger

| ID      | Primary source                                                                                                                                                                                                                   | Supports / limitation                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| S-S-001 | Wisconsin DNR, [2024 Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                                                                            | current Sheboygan river stocking; not returns                                         |
| S-S-002 | Wisconsin DNR, [tributary access guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf) and [Live Release Records](https://dnr.wisconsin.gov/topic/Fishing/recordfish/LiveReleaseRecords) | direct occurrence and all three reaches; old/exceptional evidence cannot set strength |
| S-S-003 | Wisconsin DNR, [2026 Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport) and [Steelhead strain guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_steelhead.pdf)           | current strain timing, repeat-spawner lifecycle; regional                             |
| S-S-004 | Wisconsin DNR, [Lake Michigan drainage barrier table](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf)                                                                              | Waelderhaus endpoint                                                                  |
| S-S-005 | Wisconsin DNR, [2026-2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations) and [night restriction](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                       | controlling rules; release recheck                                                    |
| S-S-006 | USGS, [`04086000`](https://waterdata.usgs.gov/monitoring-location/USGS-04086000/)                                                                                                                                                | partial live conditions and source risk                                               |
| S-S-007 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                                                                            | 5/10 broad opportunity; experiential                                                  |

## 7. Gate status

- [x] Fall opportunity is separated from winter holding and spring spawning.
- [x] Strength, distribution, endpoint, lifecycle, calendar, and nonterminal
      completion are reconciled.
- [x] Restriction-first Stage, Fish In River, Fishability, partial Gauge Read,
      and hidden registry are implemented.
- [x] Limited weather-only Activity implemented and historically replayed;
      missing weather fails closed without ending living-fish semantics.
- [x] Push, Migration Timing, winter, and spring models fail closed.
- [x] Public registry and public audit remain disabled.
- [ ] Owner accepts the hidden Gate 4B Activity candidate.

**Run decision:** `hidden_gate4b_ready_for_owner_review`\
**Configuration:** `2026-08-27-sheboygan-fishability-reconciliation.4`
