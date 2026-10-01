# PierCast Live Lake Map — accuracy Pass 2

**Implemented:** 2026-10-01

**Scope:** observation coverage, immutable evidence collection, and prospective five-day forecast verification

**Runtime correction status:** **not approved**

## Outcome

Pass 2 adds a defensible measurement loop around the Pass 1 NOAA surface
forecast. It does not tune the field to a short or convenient sample.

- NOAA NDBC, NOAA CO-OPS, and GLOS Seagull readings are collected centrally
  every 15 minutes, quality filtered, merged by physical station, and retained
  as immutable R2 snapshots.
- The map shows exact reading age, source, sensor depth when known, vertical
  profiles, modeled surface value, and observed-minus-modeled difference.
- Every forecast run freezes its complete 0–120-hour as-issued temperature
  series at every eligible reviewed GLOS and CO-OPS location that has nearby
  model water before later observations exist.
- A daily independent evaluator joins later observations to every applicable
  prior forecast and reports bias, MAE, RMSE, P90 absolute error, and maximum
  error by forecast horizon, frozen lead, lake, and evidence class.
- The evaluator always emits `correctionApproved: false`. Passing basic sample
  counts can only move the status to human research review; it cannot change a
  forecast automatically.

## Live source audit

The 2026-10-01 production-source check found all 21 in-domain NOAA CO-OPS
water-temperature stations returning current six-minute products. Twenty
locations overlap the intermittent NDBC relay; Toledo was a current additional
shore station. The integrated candidate collector returned 108 merged stations,
104 with current water temperature, 37 with known depth, 26 explicitly surface
or at most 3 m, and 15 with multi-depth profiles.

No reading in that single check simultaneously had QARTOD `good` and an explicit
surface/≤3 m depth. That is a useful warning, not a reason to weaken the rule.
CO-OPS/NDBC provider-QC readings and GLOS QARTOD `not evaluated` readings remain
visible context but do not enter strict calibration metrics.

NOAA documents water temperature as a default six-minute meteorological product,
`date=latest` as the newest point within 18 minutes, and the three water-temperature
flags as maximum, minimum, and rate-of-change checks. Pass 2 admits a CO-OPS point
only when all three flags are zero, the value and time are plausible, and station
coordinates remain within 0.5 mile of the reviewed catalog location.

Sources: [NOAA CO-OPS Data API](https://api.tidesandcurrents.noaa.gov/api/prod/),
[CO-OPS response/flag definitions](https://api.tidesandcurrents.noaa.gov/api/prod/responseHelp.html),
[U.S. IOOS QARTOD](https://ioos.noaa.gov/project/qartod/), and
[GLOS ERDDAP](https://seagull-erddap.glos.org/erddap/rest.html).

## Evidence classes

| Class | Admission rule | Product use |
| --- | --- | --- |
| Strict | GLOS QARTOD `good` plus explicit surface variable or sensor depth ≤3 m | Prospective accuracy metrics |
| Context | CO-OPS/NDBC provider checks, unknown depth, deeper sensor, or GLOS QARTOD `not evaluated` | Live observed marker and separately reported diagnostics |
| Rejected | Suspect/failed/flagged quality, implausible temperature, future time, or age >3 h | Neither display nor validation |

An offshore, harbor, river, intake, or fixed sensor is never silently presented
as the temperature at a pier. Geometry and depth remain attached to the evidence.

## Forecast verification contract

For each unique observed timestamp, the evaluator compares the observation with
the exact forecast that was issued beforehand. A pair is accepted only when:

1. the observation maps to the reviewed physical station;
2. the forecast valid time is within 30 minutes of the observed time;
3. the forecast lead is 0–120 hours;
4. the as-issued model series contains that hour; and
5. the reading passes its evidence-class contract.

The report separates nowcast, day 1, day 2, day 3, day 4, and day 5, and also
freezes the 0/24/48/72/96/120-hour checkpoints used by the existing temperature
representation protocol. Unchanged sensor values found in multiple 15-minute
snapshots are deduplicated.

The predeclared minimums remain 60 strict days, three months, 30 matches at every
frozen lead, two operational seasons, required thermal regimes/events, and a
separate holdout before any correction. Global or lakewide success cannot by
itself approve a particular pier.

## Refresh and cost bounds

- Collection cadence: 96 scheduled runs/day.
- CO-OPS: at most 21 small latest-value calls/run, or 2,016/day. Calls are spaced
  in batches because NOAA recommends avoiding bursts.
- NDBC/GLOS: shared-source requests occur once per scheduled run and are cached;
  user map opens do not multiply them.
- R2: one immutable snapshot plus one latest-pointer write per collection. No
  object is deleted. The daily evaluator reads one completed day, not the entire
  historical archive.
- Open-Meteo: unchanged. Observation collection and validation make zero
  Open-Meteo calls; the existing forecast ceiling remains 274,164 calls in the
  worst 31-day month against the configured one-million-call budget.

## Satellite decision

NOAA GLSEA is retained as a useful independent surface-context candidate, but it
is not blended into live temperatures or strict point verification in this pass.
NOAA says GLSEA is produced daily from cloud-free satellite information over a
±10-day window and applies interpolation/smoothing where imagery is missing.
That makes it valuable for broad spatial diagnostics, but not a 10–20-minute pier
thermometer or an independent substitute for a same-time in-water sensor.

Source: [NOAA GLERL GLSEA documentation](https://coastwatch.glerl.noaa.gov/satellite-data-products/great-lakes-surface-environmental-analysis-glsea/).

## Remaining physical limit

Software can now preserve and score the evidence correctly. It cannot manufacture
year-round, pier-local, known-depth observations where none exist. The next material
accuracy gain is the documented local sensor program already specified for the
priority PierCast ports, followed by the frozen-protocol/holdout review. Until that
evidence exists, the correct product language is “NOAA surface model guidance plus
observed sensor context,” not “measured temperature at every pier.”
