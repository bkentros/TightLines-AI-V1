# PierCast 1.18 salmonid calibration — Pass 4

Reviewed: 2026-10-19

Runtime boundary: **bundled 1.18 app only**. This pass does not alter the frozen
server v3 configuration, response contracts, database, lake map, Edge Function,
Worker, or any installed 1.17-and-older client.

## Outcome

Pass 4 completed the three planned calibration waves across every supported
Chinook, coho, steelhead, brown-trout, lake-trout, and Atlantic-salmon city
pair. It preserves every evidence-reviewed fishery-strength ceiling, thermal
curve, evidence ID, configured legal closure, and research hold.

The annual audit remains complete at 229,848 of 229,848 rows:

- 32 cities
- 6 salmonid species
- 157 supported pairs: 151 scored and 6 explicit lake-trout research holds
- 366 dates, including leap day
- 4 standardized water-fit scenarios per date
- 0 structural, coverage, scoring, phase, closure, or presentation errors
- 0 abrupt mode-handoff flags
- 0 November-transition cliff flags
- 2 reviewed legal-season constraints, retained intentionally

Current deterministic fingerprint:

`3410a17e0d22f62852d3e7fbf8ef94bac6ddb560421c592a6abd822982d5bf9b`

## Shared season-phase correction

Today's score still selects the maximum realized mode and uses that mode's exact
evidence-reviewed strength and availability. Season phase is now normalized
against the pair's annual ceiling. This prevents a mode handoff from changing
`Peak window`, `Building`, or `Tapering off` merely because two modes use different
strength ceilings.

The original active-mode availability remains in the frozen app projection for
compatibility. The new pair-relative value is used only to determine the 1.18
season phase and trend. Today and Season therefore remain distinct without
changing score thresholds or wire enums.

## Wave 1 — Chinook and lake trout

Ten high-ceiling Chinook ports receive a conservative late-fall tail: Algoma,
Frankfort/Elberta, Kewaunee, Ludington, Manistee, Manitowoc, Port Washington,
Sheboygan, Two Rivers, and Whitehall.

| Date        | Strong-fishery availability |
| ----------- | --------------------------: |
| October 1   |                        0.55 |
| October 15  |                        0.45 |
| November 1  |                        0.30 |
| November 15 |                        0.10 |
| December 1  |                        0.00 |

With Excellent water fit, these ports are Fair and Tapering off on October 19 but
Limited by November 1–15. This corrects the premature collapse without claiming
that late fish are numerous. Grand Haven receives a smaller Limited tail, while
the evidence-specific St. Joseph curve remains unchanged.

Alpena, Harrisville, Lexington, and Port Sanilac retain their later Lake Huron
timing with smoother post-peak declines. No Chinook ceiling changes.

Lake trout retain November as the high point, but the October monthly anchor is
reduced by regional archetype:

| Existing archetype      | October before | October in 1.18 |
| ----------------------- | -------------: | --------------: |
| Lake Michigan open-year |           0.72 |            0.62 |
| Lake Huron open-year    |           0.82 |            0.65 |
| Wisconsin open-year     |           0.70 |            0.60 |
| Chicago open-year       |           0.76 |            0.65 |

Caseville and Harbor Beach are consequently Fair and Building on October 19, not
already at their peak. Their approved November ceilings and cold-season
continuity remain intact.

## Wave 2 — coho and steelhead

The 19 coho pairs identified by Pass 3 receive a bounded fall taper. The October
15 to November 1 decline is limited to 0.20, followed by steps no larger than
0.25 through December 1 and a zero anchor on December 15. Strong ports may
remain Good or Fair while tapering; weaker ports remain Limited. There is no
blanket coho uplift and no spring or summer mode is changed.

Harbor Beach steelhead receives a small October-to-December continuation that
removes its lone audit cliff. All other steelhead curves are retained after
full-year review.

## Wave 3 — brown trout and Atlantic salmon

The phase normalization resolved every brown-trout mode-handoff discontinuity.
Only the two remaining audit transitions required curve changes:

- Port Sanilac brown trout now tapers smoothly from its October peak through
  November and reaches zero December 10.
- Harbor Beach Atlantic salmon now tapers from October through November and
  reaches zero December 1.

All other brown-trout and Atlantic-salmon curves and all 25 Atlantic research
holds outside the seven supported pairs remain unchanged.

## Accepted constraints

Alpena and Rogers City lake trout retain ceilings above 6 but do not realize a
Good open-season rating in the annual replay. Their strongest configured
November biology overlaps the legal October–December closure. Pass 4 does not
inflate September availability or bypass the closure merely to make the nominal
ceiling reachable.

## Reproduce

```sh
npm run audit:pier-cast:salmonid-calibration
node --import tsx --test scripts/pier-cast-salmonid-seasonality-pass4.test.ts
```

Use `npm run audit:pier-cast:salmonid-calibration -- --json` for the aggregate
report or `-- --rows` for the complete NDJSON matrix. No command in this pass
builds, publishes, updates, deploys, or submits the app.
