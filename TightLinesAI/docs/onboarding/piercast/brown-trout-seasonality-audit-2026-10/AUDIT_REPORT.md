# PierCast brown-trout seasonality audit — Passes 1 and 2

Completed October 20, 2026. Target release: app-only 1.18.

These passes are diagnostic. They do not change a production calibration, backend, map, deployment, build, or store release.

## Result

The concern is valid, but it is not a blanket “make Wisconsin brown trout Fair” correction.

Pass 1 replayed every day of leap year 2028 for all **27 brown-trout cities in the public v3 roster** at three actual profile temperatures: 32°F (cold), 50°F (ideal), and 72°F (warm). That produced **9,882 city-days and 29,646 scored scenarios**, with no missing pair, invalid score, closure inconsistency, or temperature-dependent season-phase change.

Pass 2 reviewed each city’s current modes and evidence while keeping pier/shore/harbor, tributary, and boat evidence separate. It found:

1. **Four definite southern-Wisconsin timing gaps.** Port Washington, Milwaukee, Racine, and Kenosha remain `Outside main window` from July 11 through October 21 because they have winter and spring modes but no fall transition. This conflicts with agency evidence that brown trout return in fall, including direct annual fall collection in the Milwaukee and Root rivers. October does not have to be Good, but the current hard Outside classification is too severe.
2. **Four definite northern-Wisconsin interpolation defects.** Two Rivers, Kewaunee, Algoma, and Manitowoc end their fall mode on December 20 at availability `0.7`. The recurring interpolator then carries that fall mode through New Year and all the way toward the next August zero. These cities consequently have zero `Outside main window` days. That is a curve-construction artifact, not evidence.
3. **Sheboygan needs a boundary review, not an automatic increase.** Its three-mode structure is sound and already recognizes winter, spring, and fall. At ideal temperature it falls from a modest fall mode into `Limited` by October 20. Regional evidence supports fall availability, but exact-port evidence is not strong enough to declare every October day Fair without the next calibration pass.
4. **The other 18 cities do not show an equally clear contradiction.** Their main seasonal shapes match the best available primary evidence well enough to retain during this evidence pass. Six remain explicitly cautionary because port/grouped evidence does not justify precise daily boundaries. “Retain” means no correction is currently demonstrated; it does not convert a modeled daily knot into an observed fact.

## Wisconsin decisions

| City | October 20 at 50°F | Decision |
|---|---|---|
| Sheboygan | Limited, Tapering off | Review the fall-to-winter handoff; no automatic Fair floor. |
| Port Washington | Limited, Outside main window | Correction required: add/extend an evidence-bounded fall transition. |
| Milwaukee | Limited, Outside main window | Correction required: represent the documented fall river-mouth/harbor return. |
| Racine | Limited, Outside main window | Correction required: represent the Root River fall return conservatively. |
| Kenosha | Limited, Outside main window | Correction required: close the artificial gap, but keep weaker than stronger ports absent new evidence. |
| Two Rivers | Limited, Building | Correction required: remove fall-mode New Year leakage; add winter only if independently justified. |
| Kewaunee | Limited, Building | Correction required: separate credible fall buildup from any winter mode. |
| Algoma | Fair, Building | Correction required: remove wrap first, then determine whether Fair remains independently supported. |
| Manitowoc | Limited, Building | Correction required: remove wrap and preserve city-level uncertainty. |

Wisconsin DNR describes brown trout as a year-round fishery, identifies early spring as a major nearshore period, and documents fall adult collection at Kewaunee, Root, and Milwaukee with egg taking in November and early December. Its year-round guide also describes a strong winter harbor/river-mouth fishery and August pier availability. Those facts support repairing the current gaps; they do **not** support assigning equal strength to every port or importing tributary success directly into a pier score.

The 2024 Wisconsin pier table is spring-heavy, but its east-shore design directly sampled May through September, modeled spring, and omitted October pier/shore estimates. Its lack of October pier harvest therefore cannot prove October absence.

## Remaining-city decisions

| Disposition | Cities | Reason |
|---|---|---|
| Retain | Ludington, Grand Haven, Manistee, Frankfort, Waukegan, Michigan City, Muskegon, Whitehall, South Haven, Harrisville, Port Sanilac | Direct Pier/Dock, pedestrian-creel, or agency seasonal guidance supports the current broad shape and conservative fall treatment. |
| Retain with caution | Chicago, Alpena, St. Joseph, Holland, Lexington, Pentwater, Rogers City | The fishery is supported, but grouped ports, mixed modes, incomplete month coverage, or broad near-year-round phase tails limit confidence in exact daily boundaries. These should not be strengthened without better local evidence. |

The complete 27-row reasoning—including the separate pier/shore, tributary, and boat evidence assessment—is in `city-evidence-disposition.csv`.

## What Pass 3 should change

Pass 3 should be surgical:

- repair the four nonzero year-wrap curves first;
- add conservative fall-to-winter continuity for Port Washington, Milwaukee, Racine, and Kenosha;
- independently reassess Sheboygan’s September-November handoff;
- replay all 27 cities and require that no unrelated city moves;
- keep `Fair`, `Good`, and `Prime` governed by the hidden opportunity score—there should be no Wisconsin-only label override or blanket minimum;
- preserve Grade B uncertainty where city-level pier effort is unavailable.

## Artifacts

- `audit-summary.json`: coverage, invariants, temperature scenarios, and structural flags.
- `full-year-daily-baseline.csv`: all 9,882 city-days with cold/ideal/warm score and label.
- `city-window-summary.csv`: annual windows, transitions, label counts, and seasonal snapshots.
- `mode-knot-audit.csv`: every effective mode and its recurring-year boundary behavior.
- `evidence-inventory.csv`: effective v1.18 evidence IDs and limitations by city/mode.
- `city-evidence-disposition.csv`: manual 27-city source review and next-pass decision.
- `source-ledger.json`: authoritative sources, mode scope, supported claims, and limitations.
- `generate-audit.ts`: original generator plus SHA-256 verification for the frozen pre-correction baseline; run with `--check` to detect drift.

Passes 3 and 4 were subsequently completed. Their implementation and replay results are documented in `PASS_3_4_REPORT.md`; the files in this report remain the frozen pre-correction evidence baseline.

## Scope boundary

The public v3 roster has 27 brown-trout cities. Five additional review-only candidates contain brown-trout rows but are not public-v3 brown-trout members; they are intentionally excluded from this release audit. No live conditions were used, so this tests calibration behavior rather than forecasting a particular weather day.
