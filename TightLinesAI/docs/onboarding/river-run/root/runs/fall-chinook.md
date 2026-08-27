# Root River Fall Chinook River Run Profile

**River ID:** `root` **Species:** `chinook` **Status:**
`gate_4b_hidden_owner_review`

## 0. Capability and contradictions

DNR handled 2,409 Chinook in 2023, 1,899 in 2024, and 3,548 in 2025 at
the Root River Steelhead Facility. The 2024 return was 14% below its ten-year
facility average, while 2025 remained a strong direct return. These counts prove
recurrence and support the approved 8/10 ceiling but remain an operational
sample: fish can pass before installation or bypass during high flows.

The facility passed thousands upstream in recent falls. It is therefore an
operational structure, not an absolute biological barrier. The owner-approved
v1 product corridor still ends at its downstream face; Horlick Dam remains the
verified biological outer barrier.

**Decision:** `supported_hidden_gate_4b_weather_only_activity`

## 1. Complete field reconciliation

| Runtime field | Accepted value | Basis/status |
| --- | --- | --- |
| Identity/biology | `root_fall_chinook`; `great_lakes_chinook_v1`; `fall_spawn` | recurrent direct returns; semelparous lifecycle |
| Strength/distribution | 8/10; broad | owner-approved portfolio plus current facility series |
| Corridor | Harbor & Downtown; City Parks; Lincoln Park | owner-approved foundation |
| Product endpoint | downstream face of operated Steelhead Facility | conservative v1 scope, not biological exclusion |
| Stage / Fish In River | available | calendar and curve below |
| Fishability | available; upper Horlick context only | fixed 2019-2024 flow baseline |
| Gauge Read | Horlick flow/height plus separately labeled 60th Street temperature | upper-river context, not product-corridor truth |
| Activity | available; Limited weather-only | modeled Horlick weather only; both upstream river stations excluded |
| Push / Migration Timing | unavailable | no accepted paired movement/baseline contract |
| Public audit | disabled | release unauthorized |

## 2. Calendar and Fish In River

The complete evidence-kind/bias reconciliation is in `../timing-audit.md`.

| Boundary | Date |
| --- | --- |
| Pre-run / staging / river start | Aug. 1 / Aug. 15 / Aug. 25 |
| Beginning end / established / broad build | Sept. 8 / Sept. 9 / Sept. 20 |
| Peak start / anchor / end | Oct. 1 / Oct. 8 / Oct. 18 |
| Taper end / main end / tail / late copy | Oct. 31 / Nov. 10 / Nov. 20 / Nov. 30 |

**Curve:** `root-chinook-presence-v1-draft` **Maximum:** 8/10 **Scope:** broad

| Day from Aug. 25 | Fraction |
| ---: | ---: |
| 0 / 15 / 27 / 37 | .06 / .20 / .45 / .72 |
| 44 / 54 / 67 | 1.00 / .90 / .55 |
| 77 / 87 / 97 | .20 / .05 / 0 |

Fish In River is an approximate seasonal opportunity level, never a facility
count, live arrival detector, catch probability, or equal-section claim.

## 3. Corridor and restrictions

Every active Stage plan leads with the Sept. 15-first-Saturday-in-May Lake
Michigan tributary night restriction and the warning that facility operations
can block, process, or pass fish. Guidance progresses Harbor & Downtown → City
Parks → legal Lincoln Park water below the facility. Facility operation never
confirms passage, and section labels do not guarantee access or safety.

## 4. Conditions and evidence

Fishability uses USGS `04087240` only as upper-river presentation context. Six
complete Aug.-Jan. seasons (2019-2024; 1,104/1,104 days) produced p10 10.4,
p25 20.375, median 46.8, p75 113.25, and p95 447.85 CFS. Hidden bands are
`<10`, `10-20`, `20-113`, `113-447`, and `>=448` CFS. They do not describe
harbor conditions, passage, abundance, clarity, access, or safety.

Primary evidence: [2025 fall summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSummaryFall2025.pdf), [2024-2025 facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf), [facility page](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ROOTRIVER), and [current regulations](https://dnr.wisconsin.gov/topic/fishing/regulations).

## 5. Gate

- [x] Capability, contradiction search, strength, endpoint, calendar, curve,
      corridor copy, Fishability, Gauge Read, and hidden config reconciled.
- [x] Activity independently replayed for 2007-2025 with zero invariants; Push and Migration Timing fail closed.
- [x] Owner calibration lowers Staging and Beginning by exactly five points;
      replay means are 69.21 and 69.54 versus 74.21 and 74.54 in the preserved
      no-adjustment baseline.
- [x] Public registry remains unchanged.
- [x] Owner approved Gate 4A truth/copy.
- [x] Owner approved Gate 4B Activity behavior/replay on 2026-08-26.

**Configuration:** `2026-08-27-root-steelhead-local-peak.3`
