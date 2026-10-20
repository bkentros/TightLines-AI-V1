# PierCast brown-trout seasonality — Passes 3 and 4

Completed October 20, 2026. Target: app-only version 1.18.

## Pass 3 — evidence-bounded correction

Eight Wisconsin brown-trout pairs changed. No fishery-strength ceiling, evidence grade, evidence ID, mode count, or temperature profile changed.

### Southern Wisconsin

Port Washington, Milwaukee, Racine, and Kenosha previously remained `Outside main window` through October 21 because their winter mode began at zero on October 15. Their existing cold-season harbor mode now has a conservative autumn ramp:

- August 1: `0`
- August 25: `0.04`
- September 15: `0.10`
- October 1: `0.16`
- October 15: `0.26`
- November 15: existing `0.45`

The change ends the artificial phase gap around September 14 without manufacturing a strong bite. On October 20, all four cities are now `Building` but remain `Limited` at ideal temperature:

| City | Before | After | Hidden after-score |
|---|---|---|---:|
| Port Washington | Outside main window / Limited | Building / Limited | 2.075 |
| Milwaukee | Outside main window / Limited | Building / Limited | 1.959 |
| Racine | Outside main window / Limited | Building / Limited | 1.930 |
| Kenosha | Outside main window / Limited | Building / Limited | 1.814 |

This is intentionally conservative. It acknowledges a real fall return without calling an early or weak window Fair.

### Northern Wisconsin

Two Rivers, Kewaunee, Algoma, and Manitowoc previously ended `fall_harbor` on December 20 at `0.70`. The recurring interpolator carried that nonzero fall mode toward the following August, producing an unintended annual wrap.

The fall tail now explicitly declines from its November 10 peak through December 1 (`0.80`), December 20 (`0.45`), and December 31 (`0`). The existing cold-season portion of `spring_nearshore` then becomes active. The December 20-to-31 score handoff is under 0.1 in every city, so the structural repair does not create a visible cliff.

After correction, the four cities have a plausible summer Outside interval from approximately June 25 through July 28 instead of no Outside days at all.

### Sheboygan

Sheboygan was deliberately retained without a numeric change. It already has separate winter, spring, and fall modes with a continuous fall-to-winter handoff. The evidence supports availability but does not justify forcing October 20 above its existing `Limited / Tapering off` result.

## Pass 4 — complete replay and isolation audit

The corrected calibration was replayed across all 27 public-v3 brown-trout cities for every day of leap year 2028 at 32°F, 50°F, and 72°F:

- 9,882 city-days
- 29,646 temperature scenarios
- 0 missing evaluations
- 0 invalid scores or public labels
- 0 remaining nonzero year-wrap modes
- 19 unapproved brown-trout cities unchanged
- every non-brown-trout calibration unchanged

Automated guards also prove that the correction preserves all existing ceilings, evidence lists, evidence grades, thermal curves, and mode counts. The frozen pre-correction Pass 1 files are protected by SHA-256 checks so later work cannot silently rewrite the baseline.

## Artifacts

- `pass3-4-validation.json`: coverage, correction scope, and enforced invariants.
- `post-correction-city-summary.csv`: full-year city windows and representative dates after correction.
- `post-correction-mode-knot-audit.csv`: all effective brown-trout knots after correction.
- `generate-pass3-4-validation.ts`: deterministic current-state validation generator.
- `scripts/pier-cast-brown-trout-seasonality-pass3-4.test.ts`: seven correction, isolation, continuity, and full-year replay tests.

## Scope boundary

These changes are app-bundled calibration logic for version 1.18. No backend contract, Edge Function, Worker, map, migration, deployment, app build, update channel, or store submission was touched.
