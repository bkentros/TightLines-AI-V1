# PierCast 1.18 salmonid city integration — Pass 5

Reviewed: 2026-10-19

Runtime boundary: **bundled 1.18 app only**. Pass 5 does not change the frozen
server configuration, response contracts, database, lake map, Edge Function,
Worker, or any installed 1.17-and-older client.

## Outcome

Pass 5 verifies that the calibrated model from Pass 4 reaches every 1.18 city
report and landing condition feed without changing meaning between layers. The
matrix covers all 32 PierCast cities and all 157 supported salmonid pairs: 151
scored pairs and six explicit lake-trout research holds.

The deterministic audit completed 38,779 of 38,779 rows with zero errors:

- 19 seasonal boundary and shoulder dates, including leap day and the year seam
- all 12 knots in each species' actual 1.18 water-temperature profile
- an unavailable-temperature row for every city, species, and date
- 34,044 open, scored presentation rows
- 416 legally closed rows
- 1,482 research-hold rows
- 2,983 unavailable-temperature rows

The diagnostic categories overlap where appropriate: for example, a missing
temperature during a legal closure remains a closed row rather than becoming a
biological rating.

Current deterministic fingerprint:

`dcb3d44677a70243285ce28f785e023f51fbb4f8d94a998ce3b74d3c95f54ab8`

Pass 3 remains the exhaustive 229,848-row daily calibration replay. Pass 5 is
the complementary product-integration matrix: it deliberately passes
frozen-server-shaped data through the app-bundled 1.18 projection and then
checks the user-facing city-report card.

## Contracts verified

For every open scored row, the audit requires exact agreement among:

1. the canonical 1.18 opportunity evaluator;
2. the projected app report's hidden band and compatibility fields;
3. the visible **Today** label: Prime, Good, Fair, or Limited;
4. the visible **Season** phase: Building, Peak window, In season, Tapering, or
   Outside main window;
5. the visible water-fit label, gauge range, and species-specific best range.

It also requires:

- no score, rank, standing, or rank-label field on a city-report card;
- a legal closure to be blocked with `State season closed here` rather than
  described as poor fishing;
- a lake-trout research hold to remain unscored with
  `Local pier evidence still under review`;
- missing modeled water to fail closed with `Water temp updating`;
- the original active-mode availability to remain in the frozen compatibility
  field while pair-relative availability controls the Season phase;
- all projected thermal fields to come from the bundled 1.18 profile, even when
  the synthetic frozen-server fields disagree.

## Entry-path audit

The app wiring was checked for all paths that can present these labels:

- fresh city reports use the local 1.18 projection;
- saved reports use the same projection before display;
- future calendar days recompute from the canonical evaluator and each day's
  representative modeled water temperature;
- landing/My Piers condition feeds project non-lake species through the common
  evaluator and lake trout through its approved candidate path;
- app-facing condition-feed ranks are cleared;
- city-report `speciesStandings` is cleared;
- the raw compatibility transport and server response vocabulary remain
  unchanged for older installed clients.

The species section subtitle now explicitly tells users that each card contains
three separate signals: today's opportunity, season timing, and water fit.

## Reproduce

```sh
npm run audit:pier-cast:salmonid-city-integration
node --import tsx --test scripts/pier-cast-salmonid-city-integration-pass5.test.ts
```

Use `npm run audit:pier-cast:salmonid-city-integration -- --json` for the full
machine-readable report. No command in this pass builds, publishes, updates,
deploys, or submits the app.
