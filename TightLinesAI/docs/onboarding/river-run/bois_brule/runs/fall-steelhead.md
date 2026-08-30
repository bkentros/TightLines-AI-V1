# Bois Brule Fall Steelhead River Run Profile

**River ID:** `bois_brule` **Species:** `steelhead` **Status:**
`gate_4b_owner_approved`

## Truth and runtime reconciliation

This is a fall-entry model, not the separate spring run. Wisconsin DNR reports
extensive fall movement from mid-September through late October and describes
the broader largest Lake Superior tributary migration from late September
through the first half of November. Recent fishway passage was 3,989-5,750 in
2022-2025, including 4,497 in 2025.

| Runtime field           | Accepted value                                                                 |
| ----------------------- | ------------------------------------------------------------------------------ |
| Identity / lifecycle    | `bois_brule_fall_steelhead`; iteroparous fall entry; some fish overwinter      |
| Strength / distribution | owner-approved 9/10; broad                                                     |
| Corridor                | three approved lower-river sections; Highway 2 is regulatory, not biological   |
| Stage / Fish In River   | available; nonzero terminal fall-presence curve                                |
| Activity / Fishability  | Activity available at Limited weather-only confidence; Fishability unavailable |
| Push / Migration Timing | unavailable                                                                    |
| Gauge Read              | upstream flow/height plus qualified historical-only temperature context        |
| Public audit            | disabled                                                                       |

## Calendar and Fish In River

| Phase                                     | Date                                  |
| ----------------------------------------- | ------------------------------------- |
| Pre-run / staging / river start           | July 15 / Aug. 1 / Aug. 15            |
| Beginning end / established / broad build | Aug. 31 / Sept. 1 / Sept. 15          |
| Peak start / anchor / end                 | Sept. 20 / **Sept. 28** / Oct. 20     |
| Taper / fall-model end / tail / late copy | Nov. 10 / Nov. 30 / Dec. 15 / Dec. 31 |

**Curve:** `bois-brule-steelhead-fall-presence-v2-local-peak-draft` **Maximum:** 9/10
**Scope:** broad. Anchors from Aug. 15:
`0/.15, 17/.35, 31/.65, 44/1.00,
66/.90, 87/.78, 107/.68`.

The curve deliberately does not fall to zero or use salmon mortality logic. The
legal lower-river season still closes Nov. 15, so later lifecycle copy reports
fall-entry context without directing fishing. It does not turn the fall model
into a winter or spring prediction.

## Evidence and gate

Primary evidence:
[DNR Bois Brule fishing page](https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing),
[2025 fishway update](https://dnr.wisconsin.gov/sites/default/files/topic/documents/DNR%20Bois%20Brule%20River%20Fall%20Fishway%20Update%202025.pdf),
2022-2024 fishway updates, and current refuge/season rules.

- [x] Fall entry is separated from overwintering and spring behavior.
- [x] Calendar, 9/10 broad curve, restrictions, passage, and hidden config
      reconciled.
- [x] Unsupported primitives fail closed.
- [x] Product-owner Gate 4A truth/copy acceptance on 2026-08-26.
- [x] Activity replayed 2007-2025 with 100% coverage, no salmon decline, and
      zero invariants.
- [x] Product-owner Gate 4B Activity behavior/replay acceptance on 2026-08-26.

**Configuration:** `2026-08-27-bois-brule-fishability-source-audit.5`
