# PierCast 1.18 salmonid release audit — Pass 6

Reviewed: 2026-10-19

Runtime boundary: **bundled 1.18 app only**. Pass 6 changes no frozen server
calibration, response contract, database object, migration, lake map, Edge
Function, Worker, or older installed client.

## Outcome

Pass 6 completed the planned defect, edge-case, accessibility, and compatibility
audit for the salmonid suitability work from Passes 1–5. Two app-projection
defects were reproduced and fixed. The final dedicated release suite passes 44
of 44 tests.

The scientific calibration itself did not change. Pass 4's 229,848-row daily
audit and Pass 5's 38,779-row city integration audit retain their reviewed
fingerprints and zero-error results.

## Defects found and fixed

### 1. A hostile legacy row could revive a lake-trout research hold

The evaluator correctly returned no lake-trout calibration for Michigan City,
Waukegan, Kenosha, Manitowoc, Two Rivers, and Algoma. However, the city-report
projection previously returned the frozen server row unchanged in that case. If
an older or inconsistent response marked one of those rows as ranked, 1.18 could
preserve the stale rating.

The 1.18 projection now treats `research_hold` as an affirmative fail-closed
product decision. All six cities are forced to `unknown` / `unranked`, receive
the explicit research-hold reason, and display
`Local pier evidence still under
review`. Reprojecting the row is idempotent and
cannot duplicate reason codes.

The Pass 5 matrix was strengthened to inject a deliberately hostile ranked
legacy row for every research hold. It still completes 38,779 of 38,779 rows
with zero errors and the same deterministic fingerprint.

### 2. Invalid lake-trout inputs were not rejected consistently

Direct lake-trout evaluation could throw on malformed calendar dates and could
calculate with `NaN`, infinity, or suitability outside the supported 0–1 domain.
In addition, an older `available` thermal row whose temperature fell outside the
bundled 1.18 profile could survive thermal reprojection unchanged.

The evaluator now validates an exact real `YYYY-MM-DD` date before either
salmonid path runs. Non-finite or out-of-range suitability is treated as
unavailable, never as a score. An available legacy temperature outside the 1.18
domain is converted to an explicit unavailable thermal result with
`temperature_out_of_domain`; the card becomes Not Rated and displays
`Water temp outside model range`.

## Dedicated release checks

The new Pass 6 suite verifies:

- malformed dates fail closed without throwing for Chinook and lake trout;
- `NaN`, positive/negative infinity, and suitability outside 0–1 never create a
  score;
- finite and non-finite out-of-domain water cannot leave a city rated;
- all six lake-trout research holds override a hostile ranked legacy response;
- all 151 scored salmonid projections are idempotent at the calibrated October
  shoulder;
- each salmonid thermal curve remains finite and bounded throughout its full
  accepted domain and rejects both outer edges;
- full city-report projection is stable, score-free, rank-free, and clears
  `speciesStandings`;
- large-text stacking, spoken card labels, stale-request guards, saved/fresh
  projection, and older-client compatibility routes remain present;
- retired `past peak`, vague warm-water, standings, and rank copy remain absent
  from the shipping city-report surface.

## Reproduce

```sh
npm run qa:pier-cast:salmonid-release-pass6
npm run audit:pier-cast:salmonid-calibration
npm run audit:pier-cast:salmonid-city-integration
```

No command in this pass builds, publishes, updates, deploys, migrates, or
submits the app. Repository reconciliation and build-readiness verification
remain Pass 7; Pass 7 must not start a production build.
