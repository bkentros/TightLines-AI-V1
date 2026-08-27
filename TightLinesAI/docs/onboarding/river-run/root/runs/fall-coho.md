# Root River Fall Coho River Run Profile

**River ID:** `root` **Species:** `coho` **Status:**
`gate_4b_hidden_owner_review`

## 0. Capability and contradictions

DNR handled 2,010 Coho in 2023, 3,839 in 2024, and 5,559 in 2025. The 2025
return was the second-highest facility return on record, behind only 1997. This
direct recurring series supports the approved 9/10 broad opportunity ceiling.
Processing, spawning, and egg-take totals are still biased facility observations,
not a complete river count or an angler catch rate.

**Decision:** `supported_hidden_gate_4b_weather_only_activity`

## 1. Complete field reconciliation

| Runtime field | Accepted value | Basis/status |
| --- | --- | --- |
| Identity/biology | `root_fall_coho`; `great_lakes_coho_v1`; `fall_spawn` | recurring direct returns; semelparous lifecycle |
| Strength/distribution | 9/10; broad | owner-approved portfolio plus near-record current count |
| Corridor/endpoint | three sections through below the operated Steelhead Facility | owner-approved conservative v1 scope |
| Stage / Fish In River | available | independent Coho calendar and curve |
| Fishability / Gauge Read | upper Horlick flow context; separately labeled 60th Street temperature | not lower-corridor measurements |
| Activity | available; Limited weather-only | modeled Horlick weather only; both upstream river stations excluded |
| Push / Migration Timing | unavailable | no accepted paired history/movement contract |
| Public audit | disabled | release unauthorized |

## 2. Calendar and Fish In River

`../timing-audit.md` distinguishes entry, processing, egg take, and shutdown.

| Boundary | Date |
| --- | --- |
| Pre-run / staging / river start | Aug. 15 / Aug. 25 / Sept. 5 |
| Beginning end / established / broad build | Sept. 15 / Sept. 16 / Sept. 25 |
| Peak start / anchor / end | Oct. 5 / Oct. 15 / Oct. 25 |
| Taper end / main end / tail / late copy | Nov. 10 / Nov. 20 / Nov. 30 / Dec. 10 |

**Curve:** `root-coho-presence-v1-draft` **Maximum:** 9/10 **Scope:** broad

| Day from Sept. 5 | Fraction |
| ---: | ---: |
| 0 / 10 / 20 / 30 | .06 / .20 / .50 / .80 |
| 40 / 50 / 66 | 1.00 / .90 / .55 |
| 76 / 86 / 96 | .22 / .06 / 0 |

The value is relative seasonal opportunity, not a fish count, live weir report,
catch probability, or equal-distribution statement.

## 3. Corridor, conditions, and evidence

Stage guidance leads with the tributary night restriction and operational
facility warning, then progresses Harbor & Downtown → City Parks → legal
Lincoln Park water below the facility. Fishability shares the audited
`<10/10-20/20-113/113-447/>=448` CFS upper-Horlick bands but does not use flow
as evidence of abundance or passage.

Primary evidence: [2025 fall summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSummaryFall2025.pdf), [2024-2025 facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf), [facility page](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ROOTRIVER), and [current regulations](https://dnr.wisconsin.gov/topic/fishing/regulations).

## 4. Gate

- [x] Capability, strength, endpoint, calendar, curve, corridor copy,
      Fishability, Gauge Read, and hidden config reconciled.
- [x] Coho timing and terminal copy remain independent of Chinook.
- [x] Activity independently replayed for 2007-2025 with zero invariants; Push and Migration Timing fail closed; public registry unchanged.
- [x] Owner calibration lowers Staging and Beginning by exactly five points;
      replay means are 68.26 and 67.90 versus 73.26 and 72.90 in the preserved
      no-adjustment baseline.
- [x] Owner approved Gate 4A truth/copy.
- [x] Owner approved Gate 4B Activity behavior/replay on 2026-08-26.

**Configuration:** `2026-08-27-root-steelhead-local-peak.3`
