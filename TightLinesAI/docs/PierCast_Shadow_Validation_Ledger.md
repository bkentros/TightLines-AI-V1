# PierCast Prospective Shadow Validation Ledger

**Implemented and deployed:** 2026-09-10<br>
**Current engine:** `pier-cast-simple-model-v0.8.0`<br>
**Current seasonal calibration:** `piercast-core-seasonal-v0.4.0`<br>
**Active formula:** `seasonal-opportunity-bounded-temperature-v2`<br>
**Same-issue comparator:** `seasonal-ceiling-x-temperature-v1`<br>
**Migration:** `20260910150000_create_pier_cast_shadow_validation_ledger.sql`<br>
**Hardening:** `20260910154000_harden_pier_cast_shadow_validation_ledger.sql`<br>
**Edge Function:** `pier-cast-ingest` version 7<br>
**Owner review:** `pier-cast` version 10<br>
**Visibility:** service-role-only; no public or authenticated-client access

## Purpose

The ledger freezes PierCast forecasts before outcomes are known. This creates genuinely prospective evidence for testing whether higher FinFindr Opportunity Ratings are associated with better target-specific pier outcomes. It does not approve a city, validate biological accuracy, or expose provisional ratings publicly.

## Forecast capture

The existing authenticated six-hour ingestion job now performs this sequence:

1. acquire and transactionally archive one complete five-city LMHOFS temperature cycle, or use the newest allowed complete archived cycle;
2. build the private five-date owner-review outlook with active formula v2 and the frozen formula-v1 comparator;
3. commit one immutable active-v2 shadow run and one immutable v1-comparator run against the identical model issue and evaluation time; and
4. store exactly 100 forecast rows per formula: five cities × five local dates × four core species.

Each forecast preserves:

- generated time, source issue/fetch time, ingestion source, engine version, formula version, and rating-rubric version;
- seasonal and temperature calibration versions plus exact curve IDs;
- city, species, local date, lead day, timezone, interval, and remaining/full-day scope;
- seasonal opportunity rating, modeled temperature range, thermal-fit range, coverage, continuous score, displayed `X.X/10`, band, and reason codes;
- targeting and promotion states, representation decision, and winter open-water notice applicability.

The run references the immutable `pier_cast_temperature_cycles` issue. Its 605 hourly samples remain the source-temperature record, avoiding redundant copies while retaining reconstruction capability.

## Outcome capture

`pier_cast_shadow_outcomes` is a separate append-only table. An outcome records city, structure, date, species, assessability, result, effort, catch count, source type, evidence quality, provenance, and notes. The service-only `record_pier_cast_shadow_outcome(jsonb)` RPC is idempotent through a caller-supplied deduplication key.

Important integrity rules:

- a `zero_catch` outcome requires explicit positive effort and `catch_count = 0`;
- inaccessible or unsafe days use a non-assessable status and `result = unknown`;
- a positive outcome requires `catch_count >= 1`;
- assessable owner outcomes require `direct_effort`, while an owner access/condition observation uses `direct_observation` and cannot masquerade as fishing effort;
- non-owner reports require a source reference;
- missing evidence is never converted into a negative fishing outcome.

The private `pier_cast_shadow_validation_pairs` view joins each outcome to every previously frozen forecast for that city/date/species, retaining lead day and model versions for later analysis.

The authenticated owner review now exposes ledger counts, the latest frozen run, same-day city/species forecast candidates, a confirmation-gated outcome form, and recent entries. Network retries reuse the same draft key, so the service RPC returns the existing record instead of duplicating it. This interface remains unavailable to non-owner clients.

## Safety and failure behavior

- All three tables have row-level security enabled.
- `public`, `anon`, and `authenticated` have no table privileges or RPC execution.
- `service_role` receives read access and may append only through the constrained security-definer RPCs.
- Forecast runs and rows have no update or delete grants.
- Repeating ingestion for the same source issue and calibration version returns `already_committed`; it cannot duplicate or rewrite the original forecast.
- A shadow-ledger failure is returned as an explicit ingestion diagnostic but does not discard a successfully archived temperature cycle.
- An unavailable temperature cycle creates no shadow forecast.
- Public PierCast profiles, catalog, and promotion remain disabled.

## Production verification

The original formula-v1 production run used LMHOFS issue `2026-09-10T12:00:00Z` and committed run `9ddf47c6-54e1-49e7-9b32-ccd3a5be8dc0`:

- 100 total forecast rows;
- 20 rows for each of five cities;
- 20 rows for each lead day from zero through four;
- all 100 values were calculable private previews;
- all 100 retained `blocked_insufficient_evidence` representation and blocked promotion states.

A formula-v2 deployment run then committed active run `f75ee8cf-5c01-4af5-a27b-86ea4f1f073b` and same-issue comparator run `d005cdb2-de21-4e22-ad5c-a4d5c61f0ad5`. Both use engine `pier-cast-simple-model-v0.7.0`, identical generation time `2026-09-10T18:05:39.788Z`, and the same `2026-09-10T12:00:00Z` LMHOFS issue. Each contains 100 forecasts. All 100 paired calculations reproduced formula v2 within floating-point tolerance (`8.89e-15` maximum absolute difference; zero mismatches).

A repeated authenticated invocation left storage at three runs and 300 forecasts: one historical v0.6/v1 run plus exactly one v0.7/v2 and one v0.7/v1 run. This verifies idempotency for both same-issue formula cohorts. The normal `35 0,6,12,18 * * *` schedule remains active and will accumulate two model-versioned runs per complete issue.

The full-scale v0.4 recalibration was deployed as `pier-cast-simple-model-v0.8.0`. An authenticated production invocation committed active run `8b015f4e-69ce-4617-b983-7e28ceba7d21` and same-issue comparator run `93f7e12d-5e28-4b7f-87ea-892afe236f97`. Both were generated at `2026-09-10T19:37:41.199Z` from the same complete `2026-09-10T12:00:00Z` LMHOFS issue, use seasonal calibration `piercast-core-seasonal-v0.4.0` and temperature calibration `piercast-core-temperature-v0.2.0`, and contain exactly 100 forecasts each. The ledger now contains five immutable runs and 500 forecasts across all historical cohorts.

The v0.4 production snapshot ranges from `1.282` to `9.189`, with a mean of `3.913`. Its same-issue formula-v1 comparator ranges from `1.187` to `8.799`, with a mean of `3.134`. The active cohort contains 24 Poor, 30 Limited, 34 Fair, 9 Good, and 3 Excellent displayed ratings. These distribution checks demonstrate that the revised scale reaches the upper bands in real forecast conditions without turning every port/species/date high; they do not establish predictive accuracy.

A production integrity probe attempted to record `zero_catch` without effort. PostgreSQL rejected it with check-constraint error `23514`, and the outcome table retained zero probe rows.

Production remained at **zero outcomes** when the [prospective evaluation protocol](PierCast_Prospective_Evaluation_Protocol_v1.md) was frozen, so its inclusion rules, metrics, thresholds, and stopping rule precede the evidence they will evaluate.

Local verification passes **100 PierCast tests**, including exact v2 arithmetic, v1 comparator reproduction, snapshot cardinality, complete provenance, database error handling, idempotent RPC behavior, private grants, owner authorization, strict outcome parsing, explicit-effort negatives, and preservation of public release gates.

## What remains

Forecast collection and the private owner outcome-entry/review workflow are operational. What remains is evidence collection and evaluation, not another formula change:

1. collect direct effort-aware observations and documented pier reports without selectively entering only memorable catches;
2. perform the 50-outcome data-quality review without tuning;
3. continue until the preregistered confirmatory sample and coverage conditions are met;
4. compare active v2 against both same-issue v1 and seasonal-only baselines, and report false-high rates by score band; and
5. keep Sheboygan's non-Chinook claims at `medium` confidence until the local evidence condition is met.

No calibration should be altered in response to the first few outcomes. Versioned changes should occur only after the declared review boundary.
