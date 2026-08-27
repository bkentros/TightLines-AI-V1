# Root River Fall Lake-run Brown Trout River Run Profile

**River ID:** `root` **Species:** `lake_run_brown_trout` **Status:**
`gate_4b_hidden_owner_review`

## 0. Capability and contradictions

DNR sourced 305 adult Brown Trout from the Root River for 2024 brood work and
stocked 35,988 Seeforellen yearlings there in 2024. Fall facility summaries show
only 13-23 Browns in 2023-2025, but DNR explicitly says the facility normally
shuts down before most Brown Trout are in the river. The low facility totals are
therefore timing-biased and do not contradict the approved 7/10 broad run.

Brown Trout can survive spawning. Surviving fish may hold in the river or
return lakeward; neither outcome is universal, and no Chinook/Coho mortality
curve may be reused.

**Decision:** `supported_hidden_gate_4b_weather_only_activity`

## 1. Complete field reconciliation

| Runtime field | Accepted value | Basis/status |
| --- | --- | --- |
| Identity/biology | `root_fall_brown_trout`; `great_lakes_lake_run_brown_trout_v1`; `fall_repeat_spawn` | independent repeat-spawner engine |
| Strength/distribution | 7/10; broad | owner-approved portfolio, brood sample, stocking, and timing-bias correction |
| Corridor/endpoint | Harbor through below operated Steelhead Facility | current passage occurs operationally; v1 stays conservative |
| Stage / Fish In River | available | later Brown calendar and nonterminal curve |
| Fishability / Gauge Read | upper-river context only | no lower-reach or passage inference |
| Activity | available; Limited weather-only | 0.80 evidence scale and bounded Peak +5; no mortality/departure penalty |
| Push / Migration Timing | unavailable | no accepted paired lower-corridor baseline |
| Public audit | disabled | release unauthorized |

## 2. Calendar and Fish In River

The calendar follows DNR's warning that most Browns arrive after the salmon
facility season and current November-December brood timing. See
`../timing-audit.md`.

| Boundary | Date |
| --- | --- |
| Pre-run / staging / river start | Sept. 1 / Sept. 20 / Oct. 1 |
| Beginning end / established / broad build | Oct. 15 / Oct. 16 / Nov. 1 |
| Peak start / anchor / end | Nov. 15 / Nov. 30 / Dec. 15 |
| Taper end / model end / late context | Dec. 25 / Jan. 15 / Jan. 31-Feb. 15 |

**Curve:** `root-lake-run-brown-presence-v1-draft` **Maximum:** 7/10
**Scope:** broad

| Day from Oct. 1 | Fraction |
| ---: | ---: |
| 0 / 14 / 31 / 45 | .06 / .18 / .50 / .78 |
| 60 / 75 / 85 / 106 | 1.00 / .90 / .72 / .25 |

After Jan. 15 Fish In River is unavailable—not zero. Copy preserves both
post-spawn holding and lakeward return as possibilities.

## 3. Corridor, conditions, and evidence

Restriction-first guidance progresses Harbor & Downtown → City Parks → legal
Lincoln Park below the facility, emphasizes leaving actively spawning fish
undisturbed, and never equates later decline with mortality. Upper-Horlick
Fishability describes presentation only and cannot validate Brown distribution.

Primary evidence: [2024-2025 facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf), [2025 GLFC report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf), [Brown Trout life history](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_browntrout.pdf), and [Lake Michigan trout/salmon Q&A](https://dnr.wisconsin.gov/topic/Fishing/questions/lakemichtroutsalmon.html).

## 4. Gate

- [x] Facility-shutdown contradiction and later calendar reconciled.
- [x] Separate repeat-spawner lifecycle, strength, endpoint, curve/copy,
      Fishability, Gauge Read, and hidden config implemented.
- [x] No mortality, universal winter-hold, or universal lake-return claim.
- [x] Activity replayed for 2007-2025; rejected untuned baseline preserved and bounded Peak +5 passes every invariant.
- [x] Push and Migration Timing fail closed.
- [x] Owner approved Gate 4A truth/copy.
- [x] Owner approved Gate 4B Activity behavior/replay on 2026-08-26.

**Configuration:** `2026-08-27-root-steelhead-local-peak.3`
