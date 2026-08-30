# Bois Brule Fall Chinook River Run Profile

**River ID:** `bois_brule` **Species:** `chinook` **Status:**
`gate_4b_owner_approved`

## Truth and runtime reconciliation

Wisconsin DNR describes a small but recurring Chinook run from early July to
mid-October, strongest from mid-August through late September. The fishway
counted 612 Chinook in 2025. Passage totals are an index at one structure, not a
whole-river count, catch rate, or proof of equal distribution.

| Runtime field           | Accepted value                                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity / lifecycle    | `bois_brule_fall_chinook`; fall-spawning Chinook; semelparous                                                                                        |
| Strength / distribution | owner-approved 2/10; sectional and lower-river weighted                                                                                              |
| Corridor                | three approved reaches from Lake Superior to the downstream side of Highway 2                                                                        |
| Stage / Fish In River   | available; independent Brule calendar and curve                                                                                                      |
| Activity / Fishability  | Activity available at Limited weather-only confidence; Fishability unavailable because the upstream gauge cannot represent lower-corridor hydraulics |
| Push / Migration Timing | unavailable; no current same-reach flow-temperature pair                                                                                             |
| Gauge Read              | upstream live flow/height plus historical-only exact-date lower-river temperature where qualified                                                    |
| Public audit            | disabled; release unauthorized                                                                                                                       |

## Calendar and Fish In River

| Phase                                     | Date                                  |
| ----------------------------------------- | ------------------------------------- |
| Pre-run / staging / river start           | June 15 / June 25 / July 1            |
| Beginning end / established / broad build | July 20 / July 21 / Aug. 10           |
| Peak start / anchor / end                 | Aug. 15 / Sept. 5 / Sept. 30          |
| Taper / main end / tail / late copy       | Oct. 10 / Oct. 15 / Oct. 20 / Oct. 31 |

**Curve:** `bois-brule-chinook-presence-v1-draft` **Maximum:** 2/10 **Scope:**
sectional. Anchors from July 1:
`0/.08, 19/.20, 40/.50,
66/1.00, 91/.75, 101/.40, 106/.20, 111/.05, 121/0`.

The score is relative seasonal opportunity, not a live fish count. Copy leads
with the lower-river season, night restriction, Box Car and Mays Ledges
closures, and permanent fishway refuge before suggesting legal sections.

## Evidence and gate

Primary evidence:
[DNR Bois Brule fishing page](https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing),
[2025 fishway update](https://dnr.wisconsin.gov/sites/default/files/topic/documents/DNR%20Bois%20Brule%20River%20Fall%20Fishway%20Update%202025.pdf),
[State Forest refuge rules](https://dnr.wisconsin.gov/topic/StateForests/bruleriver/recreation/fishing),
and the 2023-2024 updates cataloged in `../timing-audit.md`.

- [x] Recurrence, lifecycle, calendar, strength, distribution, passage chain,
      curve, restrictions, and hidden configuration reconciled.
- [x] Activity replayed 2007-2025 with 100% coverage and zero accepted
      invariants; Fishability, Push, and Migration Timing fail closed.
- [x] Owner calibration lowers Staging and Beginning by exactly five points;
      replay means are 72.55 and 70.07 versus 77.55 and 75.07 in the preserved
      no-adjustment baseline.
- [x] Product-owner Gate 4A truth/copy acceptance on 2026-08-26.
- [x] Product-owner Gate 4B Activity behavior/replay acceptance on 2026-08-26.

**Configuration:** `2026-08-27-bois-brule-fishability-source-audit.5`
