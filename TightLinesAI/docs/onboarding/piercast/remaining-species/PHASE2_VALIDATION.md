# Phase 2 final onboarding validation

Phase 2 implementation and disposition review are complete. Seven additional city/species pairings are fully integrated into the private provisional scored lineup. The other 38 of the 45 researched pairings have explicit deferrals; nine retain Phase 1 annual curves for research. No public or empirical scientific approval is implied.

## Final private additions

| City | Additions | Total scored species including the core four |
| --- | --- | ---: |
| Ludington | Smallmouth bass, yellow perch | 6 |
| Grand Haven | Freshwater drum, largemouth bass | 6 |
| Manistee | Lake trout, freshwater drum, yellow perch | 7 |
| Frankfort–Elberta | None | 4 |
| Sheboygan | None | 4 |

The [final decision report](PHASE2_ONBOARDING_DECISIONS.md) and [45-pair machine-readable register](../../../PierCast_Phase2_Onboarding_Decisions.json) distinguish named structure corroboration from contextual inference. Recurring pier catches and the retained source chains support the admitted hypotheses; all thermal ordinates remain explicitly provisional product calibrations. Generic harbor occupancy, upstream catches, offshore fisheries and unidentified bass are not substituted for covered-pier species evidence.

Each admission has a continuous full-year seasonal curve, a species-specific thermal profile, private city-roster membership, method constraints, regulation-review provenance, daily scoring and prospective shadow archival. The [private weekly table](../../../PierCast_Private_Lineup_Weekly_Ratings.csv) contains 1,404 seasonal samples for all 27 city/species curves. The completed four species' numerical seasonal and thermal curves and the scoring formula are unchanged.

Round whitefish remains deferred because the preserved laboratory evidence concerns juvenile thermal preference rather than adult pier feeding. Grand Haven lake whitefish retains structure and current lawful-method magnitude limitations. Other deferrals retain their specific side/mode/species identification gaps. No inference that deferred fish are absent is made.

## Runtime and scientific gates

The owner-only scored lineup now uses the explicit versioned city rosters. The nine deferred annual candidates remain in a separate research collection; seven retain combined sensitivity calculations and two round-whitefish pairings retain seasonal baselines only. Deferred candidates cannot drive the headline.

All public city flags, species rating flags and scientific promotion gates remain disabled. The LMHOFS lakeward surface cell is still an unapproved representation of bottom or fish-experienced temperature. Private admission uses the same provisional review standard as the completed core; it does not relabel the proxy as validated. Temperature-input missing/stale/domain/coverage gates and daily aggregation are unchanged.

The 2026 regulation review applies through March 31, 2027; outside that review period, admitted species' targeting eligibility becomes unknown. Bass catch-and-immediate-release and harvest seasons remain distinct. Grand Haven November hook restrictions apply across species. Access closures remain independent.

## Daily locks and validation records

New snapshots carry roster version `piercast-private-roster-v2-2026-09-12`. Legacy snapshots without that field retain the four-species roster; existing first-write daily locks cannot be overwritten by the new deployment. New days use counts 6/6/7/4/4. Missing, duplicate and wrong-city species are rejected.

New private shadow runs contain 135 rows for five dates across 27 city/species pairings. Historical 100-row runs remain supported. Engine `pier-cast-simple-model-v0.9.0` and assembled seasonal/thermal provenance separate the new cohort from prior calibration. The existing frozen evaluation script continues evaluating its preregistered v0.8.0/core cohort; the expansion does not silently pool new species into that confirmatory analysis or change its thresholds. New records remain available for separate cohort evaluation.

## Verification

- Complete PierCast suite: **134 passed, zero failed**.
- TypeScript: `npx tsc --noEmit` passed on the shared working tree.
- Private roster, Phase 2 thermal, Phase 1 annual, original evidence and core replay artifact checks passed; all source identifiers and retained source hashes are verified by their generators.
- Six Phase 1 and four original-evidence Node tests passed.
- New tests cover exact city membership, full leap-year seasonal coverage, public gating, legacy snapshot reads and same-day merging, copied/missing/altered calibration, deferred and wrong-city outcome rejection, plus the existing domain/coverage/scoring tests.
- An isolated local PostgreSQL instance successfully applied the baseline ledger/snapshot schemas and new migration. Rollback-only fixtures verify legacy 100-row and new 135-row shadow commits, shadow idempotency, old and new daily snapshots, preservation of old daily locks, wrong-city and duplicate rejection, and retained public privilege restrictions.
- The SQL fixtures are reproducible with `deno run --allow-read scripts/pier-cast-private-roster-migration-fixtures.ts`; execute the emitted SQL only in an isolated database containing the relevant schemas.

## Deployment

Migration `20260912180000_pier_cast_private_species_roster.sql` is applied; the linked database reports no pending migrations. No historical records were rewritten.

`pier-cast` is active at version **18** and `pier-cast-ingest` at version **13**, both with JWT verification enabled. Deployed read-only checks confirm the expected five city rosters, HTTP 200 with zero public catalog cities, and HTTP 403 for anonymous owner-review access. Authorized full production owner-outlook contents were not smoke-tested without an owner session; handler, pipeline, database and deployment checks cover the implemented contracts.

The other agent's `app/pier-cast-review.tsx` and `components/pier-cast/PierCastVisuals.tsx` edits remain untouched and excluded from this commit.

## Phase 3

The remaining phase is the annual lineup review together: compare all 52 weeks, city-specific relative strength, independent and overlapping species peaks, and weak periods. Deferrals remain visible decisions; do not fill gaps with unsupported fish or call provisional scores measured catch probabilities. Public release still requires explicit authorization and the existing scientific validation gates.
