# Bois Brule Fall Lake-run Brown Trout River Run Profile

**River ID:** `bois_brule` **Species:** `lake_run_brown_trout` **Status:**
`gate_4b_owner_approved`

## Truth and runtime reconciliation

This run is materially earlier than the Lake Michigan Seeforellen calendars.
Wisconsin DNR places Bois Brule lake-run browns from early July through late
October, with a mid-July to mid-September peak. Fishway passage was 2,694-3,436
in 2021-2025 and 3,143 in 2025, supporting a strong recurring run.

| Runtime field           | Accepted value                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| Identity / lifecycle    | `bois_brule_fall_brown_trout`; repeat-spawning lake-run Brown Trout            |
| Strength / distribution | owner-approved 7/10; broad                                                     |
| Corridor                | Lake Superior to downstream side Highway 2, excluding all refuges              |
| Stage / Fish In River   | available; Brule-specific early calendar                                       |
| Activity / Fishability  | Activity available at Limited weather-only confidence; Fishability unavailable |
| Push / Migration Timing | unavailable                                                                    |
| Gauge Read              | upstream live flow/height; lower-river exact-date history only                 |
| Public audit            | disabled                                                                       |

## Calendar and Fish In River

| Phase                                     | Date                                 |
| ----------------------------------------- | ------------------------------------ |
| Pre-run / staging / river start           | June 15 / June 25 / July 1           |
| Beginning end / established / broad build | July 10 / July 11 / July 13          |
| Peak start / anchor / end                 | July 15 / Aug. 15 / Sept. 15         |
| Taper / main end / tail / late copy       | Oct. 1 / Oct. 20 / Oct. 31 / Nov. 15 |

**Curve:** `bois-brule-lake-run-brown-presence-v1-draft` **Maximum:** 7/10
**Scope:** broad. Anchors from July 1:
`0/.18, 14/.65, 45/1.00, 76/.90,
92/.55, 111/.25, 122/.08`.

Lake-run browns survive spawning. The model therefore never applies Chinook or
Coho terminal mortality. The available sources do not establish one universal
winter behavior, so post-run copy does not claim that all fish overwinter or
that all return to Lake Superior on a fixed date.

## Evidence and gate

Primary evidence:
[DNR Bois Brule fishing page](https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing),
[2025 fishway update](https://dnr.wisconsin.gov/sites/default/files/topic/documents/DNR%20Bois%20Brule%20River%20Fall%20Fishway%20Update%202025.pdf),
and 2021-2024 fishway updates cataloged in `../timing-audit.md`.

- [x] Independent early calendar; no transfer from Milwaukee, Sheboygan, or
      Root.
- [x] Repeat-spawner lifecycle, 7/10 broad curve, restrictions, and hidden
      config reconciled.
- [x] Unsupported primitives fail closed.
- [x] Product-owner Gate 4A truth/copy acceptance on 2026-08-26.
- [x] Raw and corrected Activity replays retained; minimum Peak +6 correction
      passes all invariants without mortality/departure logic.
- [x] Product-owner Gate 4B Activity behavior/replay acceptance on 2026-08-26.

**Configuration:** `2026-08-27-bois-brule-fishability-source-audit.5`
