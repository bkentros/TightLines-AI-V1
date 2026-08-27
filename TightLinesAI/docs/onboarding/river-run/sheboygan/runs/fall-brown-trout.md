# Sheboygan River Fall Lake-run Brown Trout River Run Profile

**River ID:** `sheboygan` **Species slug:** `lake_run_brown_trout`\
**Created:** 2026-08-26 **Status:** `gate_4b_hidden_owner_review`

## 0. Capability decision

| Question                   | Finding                                                                                                                                                                       | Evidence         | Decision                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------- |
| Current recurrence         | DNR stocked 44,691 Seeforellen yearlings directly into the Sheboygan River in 2024, the largest river-specific Brown allocation in this four-river Lake Michigan subset       | S-B-001          | supported; stocking is not adult returns          |
| Broad corridor opportunity | DNR directly lists Brown Trout at Kiwanis, Esslingen, and Kohler; 2024 Sheboygan County harvest was 500 including 56 stream fish                                              | S-B-002, S-B-003 | broad support; county estimate is not river count |
| Passage endpoint           | Waelderhaus is the first current impassable barrier                                                                                                                           | S-B-004          | stop below dam                                    |
| Timing                     | Current DNR reporting supports October tributary entry and ripe/spawning Seeforellen in November-early December                                                               | S-B-005          | regional anchor; exact dates calibrated           |
| Lifecycle                  | Brown Trout are repeat spawners; survivors may hold or return lakeward                                                                                                        | S-B-006          | separate engine required; no salmon death curve   |
| Contradiction search       | Current stocking, creel, three reach listings, barrier, Seeforellen timing, post-spawn behavior, and regulations were checked; Sheboygan is not a brood-return counting river | portfolio        | supported with medium strength confidence         |

**Capability decision:** `supported_hidden_gate_4a`

## 1. Truth and configuration reconciliation

| Field                    | Accepted value                                                      | Basis                                          | Status      |
| ------------------------ | ------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| Identity                 | `sheboygan_fall_brown_trout`; `great_lakes_lake_run_brown_trout_v1` | shared repeat-spawner biology                  | reconciled  |
| Movement                 | `fall_repeat_spawn`; `fall_repeat_spawner_cooling`                  | separate engine boundary                       | reconciled  |
| Strength/distribution    | 8/10; broad                                                         | owner/local calibration + three-reach evidence | reconciled  |
| Corridor/endpoint        | Harbor through legal Kohler Reach below Waelderhaus                 | direct reach listings + barrier chain          | reconciled  |
| Stage / Fish In River    | available; nonterminal post-run copy                                | calendar and curve below                       | reconciled  |
| Fishability / Gauge Read | available near I-43; flow and height only                           | USGS `04086000`                                | reconciled  |
| Activity                 | available; Limited weather-only                                     | modeled I-43 weather; repeat-spawner safeguards | reconciled  |
| Push / Migration Timing  | unavailable                                                         | no accepted temperature baseline               | fail closed |
| Public audit             | disabled                                                            | release not authorized                         | locked      |

### Strength comparison

Sheboygan's 8/10 is below Milwaukee's accepted 9/10, above Root and Bois Brule
at 7/10, and independent of the exact number stocked. The three named river
reaches and county stream harvest support broad distribution, but the absence of
an adult counter prevents high confidence in the exact ceiling.

## 2. Seasonal calendar

| Boundary           | Date          | Meaning                           | Evidence/bias                        |
| ------------------ | ------------- | --------------------------------- | ------------------------------------ |
| Pre-run monitoring | 09-01         | lake/harbor context               | product watch                        |
| Staging            | 09-20         | possible mouth concentration      | regional late-Sept./Oct. entry       |
| River start        | 10-01         | sparse entry estimate             | current DNR October tributary anchor |
| Beginning end      | 10-15         | lower-river phase ends            | calibrated                           |
| Established build  | 10-16         | Urban River becomes regular       | calibrated                           |
| Broad build        | 11-01         | all three sections can enter plan | calibrated                           |
| Peak start         | 11-15         | spawning expectation strengthens  | Seeforellen egg timing               |
| Peak anchor        | 11-25         | highest seasonal estimate         | owner calibration                    |
| Peak end           | 12-10         | ripe/spawning high period ends    | DNR November/early-December anchor   |
| Tapering end       | 12-20         | spawning migration declines       | calibrated                           |
| Main model end     | 01-15         | fall migration estimate stops     | does not assert departure            |
| Tail / late copy   | 01-31 / 02-15 | post-spawn uncertainty only       | no universal winter behavior         |

The model does not choose between every survivor holding in the river and every
survivor returning to Lake Michigan. It ends seasonal estimation and says both
outcomes are possible.

## 3. Migration Stage corridor copy

Every active plan leads with the Lake Michigan tributary night restriction and
current access/sign checks.

| State                 | Primary plan                           | Conditional comparison               | Guardrail                             |
| --------------------- | -------------------------------------- | ------------------------------------ | ------------------------------------- |
| Staging               | harbor/river entrance                  | lower city with direct evidence      | no inland inference                   |
| Beginning             | Harbor & Lower City                    | Urban River after evidence           | sparse entry                          |
| Early building        | Harbor & Lower City                    | Urban River                          | broad rating is seasonal              |
| Established building  | Urban River                            | lower water for fresher fish         | Kohler conditional                    |
| Broad building / Peak | Urban River                            | legal Kohler Reach below Waelderhaus | avoid spawning fish                   |
| Tapering / Ending     | established Urban/Kohler holding water | lower water selectively              | decline is not mortality              |
| Complete              | no active section                      | none                                 | survivors may hold or return lakeward |

## 4. Fish In River

**Curve:** `sheboygan-lake-run-brown-presence-v1-draft` **Maximum:** 8/10\
**Scope:** broad

| Day from Oct. 1 | Fraction | Meaning             |
| --------------: | -------: | ------------------- |
|               0 |      .06 | sparse entry        |
|              14 |      .18 | beginning           |
|              31 |      .52 | broad build         |
|              45 |      .80 | strong build        |
|              55 |     1.00 | Nov. 25 peak        |
|              70 |      .90 | high shoulder       |
|              80 |      .72 | taper               |
|              91 |      .48 | post-spawn shoulder |
|             106 |      .25 | final tracked day   |

After Jan. 15 the public score is unavailable—not zero. Copy explicitly
preserves surviving-fish hold-versus-lakeward uncertainty and contains no
Chinook/Coho mortality semantics.

## 5. Conditions primitives

- Fishability and partial Gauge Read use USGS `04086000` near I-43 only.
- The common Sheboygan bands are `<87`, `87–117`, `118–337`, `338–874`, and
  `>=875` CFS and describe presentation shape, not Brown Trout abundance.
- No measured river temperature, trend, or historical average is displayed.
- Activity uses the Brown-specific response profile with modeled I-43 weather
  only, a 0.80 evidence scale, and a bounded five-point Peak response. The
  2007-2025 replay covered 2,546/2,546 days: min 50, median 65, mean 62.48,
  max 69; Peak mean 65.24 exceeded both adjacent shoulders with every adjusted
  invariant clear. The unadjusted replay failed stage shape once and is retained
  as the baseline. No mortality, universal winter hold, or lakeward-return
  assumption is applied. See `../activity-replay.md`.

## 6. Evidence ledger

| ID      | Primary source                                                                                                                                                                                                                                       | Supports / limitation                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| S-B-001 | Wisconsin DNR, [2024 Lake Michigan Salmonid Stocking Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                                                                                                | 44,691 Sheboygan River Seeforellen yearlings; not returns                             |
| S-B-002 | Wisconsin DNR, [tributary access guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf)                                                                                                                       | direct Brown listings at all three corridor references; old guide/no access guarantee |
| S-B-003 | Wisconsin DNR, [Lake Michigan harvest tables 2006-2024](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables2006-2024.pdf)                                                                                              | 500 countywide/56 stream harvest; not exact river returns                             |
| S-B-004 | Wisconsin DNR, [Lake Michigan drainage barrier table](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf)                                                                                                  | Waelderhaus endpoint                                                                  |
| S-B-005 | Wisconsin DNR, [2026 Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport)                                                                                                                                               | October entry and Nov.-early-Dec. Seeforellen reproductive timing; regional           |
| S-B-006 | Wisconsin DNR, [Lake Michigan trout/salmon questions](https://dnr.wisconsin.gov/topic/Fishing/questions/lakemichtroutsalmon.html) and [Brown Trout life history](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_browntrout.pdf) | nonterminal repeat-spawner behavior and fall timing                                   |
| S-B-007 | Wisconsin DNR, [2026-2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations) and [night restriction](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                                           | controlling rules; release recheck                                                    |
| S-B-008 | USGS, [`04086000`](https://waterdata.usgs.gov/monitoring-location/USGS-04086000/)                                                                                                                                                                    | partial live conditions/source risk                                                   |
| S-B-009 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                                                                                                | 8/10 broad opportunity; experiential                                                  |

## 7. Gate status

- [x] Separate repeat-spawner engine, strength, broad distribution, endpoint,
      lifecycle, and calendar reconciled.
- [x] Restriction-first Stage, Fish In River, Fishability, partial Gauge Read,
      and hidden registry implemented.
- [x] No salmon death curve, universal winter hold, or universal lakeward-return
      claim.
- [x] Limited weather-only Activity implemented and historically replayed;
      missing weather fails closed and repeat-spawner semantics remain intact.
- [x] Push and Migration Timing fail closed.
- [x] Public registry and public audit remain disabled.
- [ ] Owner accepts the hidden Gate 4B Activity candidate.

**Run decision:** `hidden_gate4b_ready_for_owner_review`\
**Configuration:** `2026-08-27-sheboygan-steelhead-local-peak.3`
