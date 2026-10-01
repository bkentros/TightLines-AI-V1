# PierCast Live Lake Map — Long-Term Validation Operations

**Status:** Prospective collection and scoring infrastructure implemented. It is
validation-only and cannot change a live forecast or approve a correction.

## What this answers

The system is designed to answer four different questions without blending
them together:

1. How accurate is the underlying FinFindr/NOAA water-temperature field at
   reviewed observation locations by model lead hour?
2. How accurate was the portion of the forecast that a FinFindr user could
   actually see after the run was published?
3. Does that product forecast add skill over a no-lookahead persistence
   baseline (the latest reading known when the forecast was issued)?
4. On the exact same observation and valid time, how does the FinFindr
   pier-point value compare with the GLOS Seagull model-summary value captured
   at issue time? Strict and contextual evidence remain separate.

The fourth result is intentionally called `seagullContext`, not a conclusive
competitive score. GLOS documents its endpoint as a model summary for a
geographic geometry or NWS forecast zone. In current responses a pier point
selects a marine zone and returns its minimum, mean and maximum; PierCast uses a
nearby model point. That spatial mismatch can be informative, but it cannot by
itself prove that either product is superior.

Official interfaces used by this protocol:

- [GLOS Seagull API documentation](https://seagull-api.glos.org/docs)
- [GLOS ERDDAP REST documentation](https://seagull-erddap.glos.org/erddap/rest.html)
- [GLOS explanation of Seagull API access](https://glos.org/data/faq/)

No Seagull UI scraping is used.

## Prospective evidence flow

Every complete PierCast model publication freezes:

- the unmodified 121-hour temperature series at reviewed GLOS and NOAA CO-OPS
  observation locations;
- the unmodified 121-hour series at every supported PierCast pier;
- the model cycle and actual FinFindr publication time;
- the exact NOAA model-cycle inputs; and
- a pointer to a nonfatal snapshot of the official GLOS Seagull model summary
  at each pier.

The live map pointer changes before Seagull collection starts. A slow or failed
comparison service therefore cannot delay fresh PierCast map data. The finished
snapshot is stored separately and joined by the daily verifier.

The Seagull capture is bounded to 32 public API calls per successful NOAA
cycle, four cycles per day at most. Failure never delays or replaces the live
PierCast map. It is simply recorded as missing comparison coverage.

The existing Cloudflare Worker continues to archive one centralized
observation snapshot every 15 minutes. User map traffic never creates
validation API traffic.

At 07:25 UTC, after the prior UTC day is complete, the validation workflow:

1. loads that day's observation evidence plus six prior days needed for issue-
   time persistence values;
2. chooses only the nearest observation within 30 minutes for each forecast
   run, sensor/depth, and forecast hour;
3. keeps QARTOD-good surface or no-deeper-than-3 m evidence separate from all
   contextual values;
4. scores model-cycle and post-publication product forecasts separately;
5. scores persistence only from the same sensor, depth, and source at or before
   publication, with a maximum age of three hours;
6. scores FinFindr and Seagull only when both were captured before the valid
   time and can be matched to the identical observation, with strict and
   contextual scoreboards kept separate; and
7. writes versioned evidence, daily materializations, calendar-month reports,
   and an all-time report to private R2 storage.

## Private R2 evidence layout

These objects are not exposed by the map gatekeeper's public allow-list.

| Key | Purpose | Mutation rule |
| --- | --- | --- |
| `runs/<run>/verification.json` | As-issued FinFindr series and comparison pointer | Immutable |
| `validation/benchmarks/seagull/v1/<run>.json` | Post-publication Seagull model-summary capture | Immutable |
| `observations/v1/YYYY/MM/DD/<time>.json` | Central sensor snapshot | Immutable |
| `validation/evidence/v2/YYYY/MM/DD/<time>-<sha>.json` | Match-level audit evidence | Versioned and immutable |
| `validation/daily/YYYY-MM-DD.json` | Latest reproducible daily scorecard | Replaceable materialization |
| `validation/monthly/YYYY-MM/latest.json` | Current monthly scorecard | Replaceable materialization |
| `validation/monthly/YYYY-MM/final/<time>-<sha>.json` | Versioned closed-month scorecard | Immutable |
| `validation/monthly/YYYY-MM/final-latest.json` | Pointer to latest closed-month version | Replaceable pointer |
| `validation/latest.json` | All-time scorecard and monitoring state | Replaceable materialization |

The SHA-256 recorded by each daily report lets an auditor verify its referenced
match-level evidence. Re-running a day creates a new version instead of erasing
the older evidence.

## Scorecards

Every applicable group reports:

- signed bias (forecast minus observed);
- MAE and RMSE;
- median, P90, and maximum absolute error;
- percentage within 1 °C, 2 °C, and 3 °C;
- unique stations, days, runs, and months; and
- paired wins, losses, ties, MAE advantage, and skill percentage for baseline
  comparisons.

Breakdowns include model lead, post-publication horizon, lake, observation
source, sensor depth, thermal regime, season, station, and (for Seagull context)
pier. Surface and depth observations are never silently combined into strict
evidence.

The primary acceptance thresholds remain frozen in
[PierCast_Temperature_Representation_and_Calibration.md](PierCast_Temperature_Representation_and_Calibration.md):
60 days, three months, 30 matches at every core lead, two operational seasons,
the required thermal/event coverage, and an independent holdout before any
correction. The automated system can say that coverage thresholds are met; it
cannot approve a correction.

## Monitoring and alerts

The scheduled GitHub Action fails, creating a visible repository alert, when a
completed UTC day has fewer than 48 of the expected 96 central snapshots or no
eligible forecast runs. It reports warnings (without suppressing evidence) when
there are no strict pairs, an upstream observation source is unavailable in at
least 25% of the day's snapshots, or the optional Seagull capture succeeds for
fewer than 75% of requested pier summaries. The collector's first partial UTC
day is explicitly labeled a startup warning instead of a false outage.

The all-time report also compares the newest 30 days with the prior 30 days.
After both windows contain at least 100 strict product pairs across 10 days, it
warns when MAE rises by both at least 0.5 °C and 20%. This is a drift signal,
not permission to retune the model.

The GitHub run summary shows snapshot coverage, evaluated runs, independent
pairs, cumulative strict product coverage, Seagull-context coverage, pipeline
health, and regression status. Secrets and raw credentials are never written.

## Monthly review

Review `validation/monthly/YYYY-MM/latest.json` during the month and the
versioned `final/` report after it closes. At minimum, inspect:

- coverage before accuracy—especially missing seasons, stations, and depths;
- post-publication horizon performance rather than only model-cycle results;
- bias and P90 error by lake, pier, station, source, and thermal regime;
- whether FinFindr beats persistence at useful horizons;
- whether the Seagull-context result is consistent across enough locations and
  months to merit deeper matched-geometry research; and
- changes in upstream models, sensors, station metadata, QC, or API contracts.

Do not tune and judge on the same period. If a correction is proposed, freeze a
training interval, preserve the original forecast as a comparator, and evaluate
the proposal on a later independent holdout.

## How this improves the product over time

Months of prospective evidence turn anecdotal complaints into diagnosable
failure modes. A warm bias isolated to one lake can lead to a lake-specific
model/source investigation; error isolated to long leads can change how
uncertainty is communicated; poor performance only during transitions can
focus work on upwelling and plume behavior; and failure to beat persistence can
block a feature that looks sophisticated but adds no predictive value.

Just as importantly, the archive protects good decisions. It preserves exactly
what each system said before the water was measured, prevents hindsight from
rewriting forecasts, and keeps unfavorable days in the sample. That is what can
eventually support defensible product claims, pier-specific calibration, and
honest uncertainty ranges—but only after the predeclared coverage and holdout
requirements are met.

## Operations

Run the deterministic verifier tests from `web/lake-map`:

```sh
.venv/bin/python -m unittest job/tests/test_verification.py job/tests/test_seagull.py
```

Run a local read/score for a specific UTC day (credentials are read but never
printed):

```sh
.venv/bin/python job/verify.py --env-file ../../.env --date YYYY-MM-DD --out /tmp/piercast-validation.json
```

Publishing is performed by `.github/workflows/lake-map-validation.yml`. A
manual historical replay is supported by its `date` input. Never use a replay
to delete or overwrite immutable R2 evidence.
