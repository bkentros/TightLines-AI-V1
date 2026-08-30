# Root River Fall Steelhead River Run Profile

**River ID:** `root` **Species:** `steelhead` **Status:**
`gate_4b_hidden_owner_review`

## 0. Capability and contradictions

Root is Wisconsin's primary Steelhead brood river and receives recurring
Steelhead stocking. Skamania timing is explicitly excluded from this calendar;
the exact Oct. 10 fall peak is owner/local field calibration. Fall facility samples
were only 10 fish in 2025, 60 in 2024, and 17 in 2023, but DNR explicitly says
facility captures are a subset: fish can pass before operation or bypass during
high flow. Those bounded samples cannot overturn the owner/local 7/10 fall
opportunity calibration. The much larger spring run proves recurrence but does
not set the fall ceiling or the fall dates.

**Decision:** `supported_hidden_gate_4b_weather_only_activity`

## 1. Complete field reconciliation

| Runtime field | Accepted value | Basis/status |
| --- | --- | --- |
| Identity/biology | `root_fall_steelhead`; `great_lakes_steelhead_fall_entry_v1`; `fall_entry` | living repeat-spawner lifecycle |
| Strength/distribution | 7/10; broad | owner/local fall calibration plus multi-strain agency evidence |
| Corridor/endpoint | Harbor through below operated Steelhead Facility | product scope; Horlick remains biological outer barrier |
| Stage / Fish In River | available | fall-entry-only calendar and nonterminal curve |
| Fishability | unavailable | no hydraulic source inside the product corridor |
| Gauge Read | upper Horlick flow; separate far-upstream temperature | context only; no passage inference |
| Activity | available; Limited weather-only | modeled Horlick weather only; no mortality or terminal decline |
| Push / Migration Timing | unavailable | no accepted lower-corridor paired history |
| Winter/spring handoff | none | no implemented Root winter or spring experience |
| Public audit | disabled | release unauthorized |

## 2. Calendar and Fish In River

The calendar centers the local Wisconsin angler's exact Oct. 10 peak while
keeping winter holding and the unimplemented spring spawning run separate. See
`../timing-audit.md`.

| Boundary | Date |
| --- | --- |
| Pre-run / staging / river start | Aug. 1 / Aug. 15 / Sept. 1 |
| Beginning end / established / broad build | Sept. 15 / Sept. 16 / Sept. 25 |
| Peak start / anchor / end | Oct. 1 / **Oct. 10** / Oct. 31 |
| Taper end / model end / late context | Nov. 30 / Dec. 31 / Jan. 15-31 |

**Curve:** `root-steelhead-fall-presence-v2-local-peak-draft` **Maximum:** 7/10
**Scope:** broad fall entry

| Day from Sept. 1 | Fraction |
| ---: | ---: |
| 0 / 15 / 24 / 39 | .12 / .35 / .65 / **1.00** |
| 60 / 90 / 121 | .90 / .75 / .62 |

After Dec. 31 the score becomes unavailable rather than zero. Completion means
only that the fall-entry model stopped; fish may overwinter, later spawn, or
return lakeward.

## 3. Corridor, conditions, and evidence

Restriction-first guidance progresses through the three approved sections and
never directs above the operated facility. Fishability fails closed because the
upper-Horlick gauge is beyond that endpoint. Flow and temperature remain
separately labeled Gauge Read context; neither facility handling nor the spring
run can be converted into a live fall-abundance or presentation claim.

Primary evidence: [2024-2025 facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf), [spring 2025 summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSummarySpring2025.pdf), [Steelhead guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_steelhead.pdf), and [facility page](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ROOTRIVER).

## 4. Gate

- [x] Fall opportunity separated from winter holding and spring spawning.
- [x] Strength, endpoint, calendar, nonterminal curve/copy, unavailable Fishability, Gauge
      Read, and hidden config reconciled.
- [x] Activity independently replayed for 2007-2025 with zero invariants and no salmon lifecycle decline.
- [x] Push, Migration Timing, winter, and spring models fail closed.
- [x] Owner approved Gate 4A truth/copy.
- [x] Owner approved Gate 4B Activity behavior/replay on 2026-08-26.

**Configuration:** `2026-08-27-root-fishability-source-scope.5`
