# Bois Brule Fall Coho River Run Profile

**River ID:** `bois_brule` **Species:** `coho` **Status:**
`gate_4b_owner_approved`

## Truth and runtime reconciliation

Wisconsin DNR places Coho movement from late August through late November. Its
general peak description is September; direct annual fishway charts put the 2023
peak in week 39, the 2024 peak in the final week of September, and the strongest
2025 counts from late September into mid-October. The 2,090 fish in 2025 prove a
recurring strong run, while remaining a one-structure index.

| Runtime field           | Accepted value                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| Identity / lifecycle    | `bois_brule_fall_coho`; fall-spawning Coho; semelparous                        |
| Strength / distribution | owner-approved 8/10; broad                                                     |
| Corridor                | Lake Superior to downstream side Highway 2, with all refuges excluded          |
| Stage / Fish In River   | available; late-September anchor with mid-October shoulder                     |
| Activity / Fishability  | Activity available at Limited weather-only confidence; Fishability unavailable |
| Push / Migration Timing | unavailable; historical temperature is not a current movement signal           |
| Gauge Read              | upstream flow/height; historical-only exact-date lower-river temperature       |
| Public audit            | disabled                                                                       |

## Calendar and Fish In River

| Phase                                     | Date                                  |
| ----------------------------------------- | ------------------------------------- |
| Pre-run / staging / river start           | Aug. 1 / Aug. 15 / Aug. 25            |
| Beginning end / established / broad build | Sept. 5 / Sept. 6 / Sept. 10          |
| Peak start / anchor / end                 | Sept. 15 / Sept. 28 / Oct. 15         |
| Taper / main end / tail / late copy       | Oct. 31 / Nov. 15 / Nov. 25 / Nov. 30 |

**Curve:** `bois-brule-coho-presence-v1-draft` **Maximum:** 8/10 **Scope:**
broad. Anchors from Aug. 25:
`0/.08, 11/.30, 21/.62, 34/1.00,
51/.90, 67/.60, 82/.25, 92/.08, 97/0`.

The biological tail can extend beyond the legal lower-river close. After Nov.
15, Stage must not offer a legal starting section even when the curve preserves
residual historical presence.

## Evidence and gate

Primary evidence:
[DNR Bois Brule fishing page](https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing),
[2025 fishway update](https://dnr.wisconsin.gov/sites/default/files/topic/documents/DNR%20Bois%20Brule%20River%20Fall%20Fishway%20Update%202025.pdf),
[2024 fishway update](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/BoisBruleFallFishway2024.pdf),
and
[2023 fishway update](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/BoisBruleFallFishway2023.pdf).

- [x] Calendar reconciles agency summary with three current annual passage
      charts.
- [x] Strength, broad scope, curve, restrictions, lifecycle, and hidden config
      reconciled.
- [x] Unsupported primitives fail closed.
- [x] Product-owner Gate 4A truth/copy acceptance on 2026-08-26.
- [x] Activity replayed 2007-2025 with 100% coverage and zero invariants.
- [x] Owner calibration lowers Staging and Beginning by exactly five points;
      replay means are 70.35 and 68.86 versus 75.35 and 73.86 in the preserved
      no-adjustment baseline.
- [x] Product-owner Gate 4B Activity behavior/replay acceptance on 2026-08-26.

**Configuration:** `2026-08-27-bois-brule-steelhead-local-peak.3`
