# White River Fall Coho River Run Profile

## 0. Candidate capability audit

The 2026 DNR assessment establishes annual Coho migration and wild fish in most
accessible tributaries. It also describes only occasional catch and a desire for
a larger run. That combination supports a recurring but sparse profile—not an
absent/unsupported row and not a strong opportunity claim.

**Capability decision:** `supported_sparse_hidden_review` **Contradiction search
completed by/date:** Codex / 2026-08-24 **Independent falsification review
by/date:** required before public enablement

**River ID:** `white`\
**Species slug:** `coho`\
**Status:** `supported_sparse_hidden_review_correction`

## 1. Species/run truth

| Field        | Researched value                                                 | Evidence IDs      | Status                           |
| ------------ | ---------------------------------------------------------------- | ----------------- | -------------------------------- |
| Run          | Annual fall migration from White Lake/Lake Michigan              | CO-001, CO-003    | supported                        |
| Opportunity  | Sparse/occasional relative to White Chinook and Steelhead        | CO-001, CO-002    | supported limitation             |
| Distribution | Broad potential below Hesperia, including accessible tributaries | CO-001            | supported; broad is not abundant |
| Ceiling      | Conservative 2/10                                                | CO-001, CAL-CO-01 | owner calibration                |
| Barrier      | Hesperia Dam is the hard upstream endpoint                       | CO-001            | supported                        |

## 2. Seasonal calendar

DNR documents the annual White migration but not daily timing. Current DNR Coho
biology supplies the early-September-through-November bracket; every exact White
boundary below is intentionally conservative and remains hidden for review.

| Boundary             | Date        | Meaning                                             | Evidence IDs      |
| -------------------- | ----------- | --------------------------------------------------- | ----------------- |
| Pre-run monitoring   | 08-20       | Begin watching before statewide Coho entry          | CO-004            |
| Staging              | 08-27       | Nearby-water context only                           | CO-004            |
| Beginning            | 09-05       | Low first river-presence anchor                     | CO-001, CO-004    |
| Established building | 09-16       | Sparse run developing                               | CAL-CO-02         |
| Broad building       | 10-01       | Possible broader below-dam distribution             | CO-001, CAL-CO-02 |
| Peak window          | 10-08-10-25 | Conservative center of the documented statewide run | CO-004, CAL-CO-02 |
| Tapering end         | 11-10       | Meaningful decline                                  | CO-004, CAL-CO-02 |
| Main end             | 11-20       | Late sparse opportunity                             | CO-004, CAL-CO-02 |
| Presence tail        | 11-30       | Final modeled value; not proof of absence afterward | CO-004, CAL-CO-02 |

## 3. Migration Stage truth

Stage copy must repeatedly preserve the sparse-run qualifier. Lower river is
first during beginning; Forest corridor and Upper accessible corridor become
conditional later. No guidance crosses Hesperia Dam. Seasonal expectation does
not confirm live fish, access, catch, or safety.

## 4. Fish In River profile

- Maximum: **2/10**.
- Distribution: broad but sparse below Hesperia.
- Curve: `white-coho-presence-v2-draft`.
- Terminal: salmon lifecycle; complete is scoreless, never zero.

| Offset from 09-05 | Fraction | Reason                              |
| ----------------: | -------: | ----------------------------------- |
|                 0 |     0.05 | Conservative first presence         |
|                10 |     0.15 | Beginning-to-building transition    |
|                25 |     0.35 | Broad distribution becomes possible |
|                33 |     0.60 | Peak window opens                   |
|                40 |     1.00 | Conservative reference high         |
|                50 |     0.90 | Peak window closes                  |
|                66 |     0.55 | Tapering boundary                   |
|                76 |     0.25 | Main-run end                        |
|                86 |     0.05 | Final presence-tail day             |

## 5. Activity calibration

> **Implementation update (2026-08-24):** The unavailable statement below is
> superseded for weather-only mode while the split-reach observed composite
> remains prohibited. The current hidden candidate is
> `white-fall-coho-weather-activity-v1-draft`: 0.70 effective light / 0.30
> same-block precipitation, Limited confidence, below-Hesperia Pines Point
> weather scope, and no Fruitvale/Weaver scoring inputs. See
> `docs/audits/river-run-grand-platte-white-activity-calibration-2026-08-24.md`.

`unavailable`. Fruitvale hydraulics and Weaver Street temperature represent
different reaches, and no White Coho weather-only calibration/replay is
accepted. Do not borrow Chinook or Steelhead behavior.

## 6. Fishability

Use the accepted Fruitvale discharge bands only, with the permanent represented-
reach limitation. Fishability describes presentation shape, not Coho abundance.

## 7. Four-primitive acceptance

- [ ] Sparse-run wording survives every Stage and Fish In River state.
- [ ] Activity is deterministically unavailable.
- [ ] Fishability never implies that a 2/10 run is abundant.
- [ ] No state recommends above Hesperia Dam.
- [ ] Terminal copy matches Coho mortality and removes score/marker.
- [ ] Narrow iOS/Android and foreign-geography checks pass.

## 8. Evidence ledger

| ID     | Authority / title                                                                                                                                                                     | Published / accessed | Facts supported                                                                                             | Limitations                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| CO-001 | Michigan DNR, [Lower White River Status Report 0460](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0460_2026_Lower_White_River.pdf) | 2026 / 2026-08-24    | Annual Coho migration, wild fish in accessible tributaries, occasional catch, corridor and Hesperia barrier | No daily counts or exact calendar            |
| CO-002 | Michigan DNR, [Better Fishing Waters](https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters)                                                                  | current / 2026-08-24 | White omits Coho while listing Chinook/Steelhead                                                            | Omission supports sparse status, not absence |
| CO-003 | Michigan DNR, [White Lake Status Report 2024-360](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Status/2024/White-Lake-Muskegon-County-2024-360.pdf)  | 2024 / 2026-08-24    | Migratory Coho use White Lake/White River system                                                            | No opportunity curve                         |
| CO-004 | Michigan DNR, [Coho salmon](https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon)                                                                         | current / 2026-08-24 | Early-September-through-November statewide run bracket and lifecycle                                        | Not White-specific daily timing              |

## 9. Run gate

**Run decision:** `supported_sparse_hidden_review`\
**Configuration:** `white-fall-coho-phase-c-draft-v2`\
**Presence curve:** `white-coho-presence-v2-draft`\
**Owner acceptance:** required after regenerated fixture review\
**Public enablement:** not authorized
