# Big Manistee — Historical Primitive Outcomes Audit

**Audit date:** 2026-08-27 (Fishability bands revised)
**Primary gauge:** USGS `04125550`, Manistee River near Wellston
**Primitives:** Fishability, Push, Migration Timing
**Runs:** Fall Chinook, Fall Coho, Fall Steelhead

## Executive result

All three primitives produced complete, bounded outcome sets with zero scoring,
cap, copy, or candidate-agreement violations. The distributions are plausible
for a regulated river: ordinary Fishability dominates, Push remains selective
rather than firing on routine tailwater variation, and Migration Timing resolves
primarily Typical with meaningful—but minority—Ahead and Delayed histories.

No missing value was imputed. A historical day was counted only when every
source required by that primitive and its lookback was present.

## Fishability

Fishability was replayed once as a river-level hydraulic primitive because all
three species use the same accepted Wellston bands. The window is the union of
the implemented fall runs, August 15 through December 22, for 1996–2025.

| Result | Days | Share of usable days |
|---|---:|---:|
| Excellent | 1,564 | 46.6% |
| Good | 709 | 21.1% |
| Fishable | 929 | 27.7% |
| Tough | 138 | 4.1% |
| Poor | 17 | 0.5% |
| **Total usable** | **3,357** | **100%** |

Thus 3,202 of 3,357 usable dates (95.4%) were at least Fishable, while 155
(4.6%) were Tough or Poor. “Fishable” in the table is the exact middle label;
it does not include Good or Excellent.

The revised absolute bands reserve Excellent eligibility for the rounded
historical p25-p75 core, 1,400-1,750 CFS. The prior 1,400-1,900 ideal band
extended almost to the fall p90 and made 56.3% of usable days Excellent. Water
from 1,750-2,500 CFS remains high-but-fishable; stable flow there scores Good
rather than implying universally ideal presentation. This absolute presentation
classification is intentionally separate from Gauge Read's date-relative
Normal/Higher comparison.

The replay requested 3,900 dates and resolved 3,357 (86.08%). The 543 excluded
dates lacked either that day's approved daily mean flow or the paired prior-day
value needed to calculate the runtime-equivalent 24-hour trend. Coverage exists
in every year; no missing date was silently bridged.

Band/label combinations:

- Ideal: 1,564 Excellent, 92 Good, 34 Fishable
- High-fishable: 617 Good, 178 Fishable, 71 Tough
- Low: 717 Fishable, 23 Tough
- Very high: 41 Tough, 15 Poor
- Very low: 3 Tough
- Blown out: 2 Poor

## Push

Push used daily Wellston discharge, paired 24-hour flow change, measured
Wellston water temperature with 24/72-hour trend, and modeled precipitation at
the configured Wellston weather point. Unlike the earlier conservative replay,
rain was not forced dry. The replay therefore exercises the production rain
roles, including precursor, partial precursor, absorption after measured gauge
response, and suppression during high flow.

### Fall Chinook

**Window:** August 15–October 31, 2007–2025
**Coverage:** 1,448 / 1,482 days (97.71%)

| Result | Days | Share |
|---|---:|---:|
| Weak | 215 | 14.8% |
| No clear push | 1,004 | 69.3% |
| Possible | 133 | 9.2% |
| Strong | 90 | 6.2% |
| Very strong | 6 | 0.4% |

### Fall Coho

**Window:** September 10–November 30, 2007–2025
**Coverage:** 1,551 / 1,558 days (99.55%)

| Result | Days | Share |
|---|---:|---:|
| Weak | 22 | 1.4% |
| No clear push | 1,264 | 81.5% |
| Possible | 149 | 9.6% |
| Strong | 111 | 7.2% |
| Very strong | 5 | 0.3% |

### Fall Steelhead

**Window:** September 15–December 22, 2007–2025
**Coverage:** 1,870 / 1,881 days (99.42%)

| Result | Days | Share |
|---|---:|---:|
| Weak | 545 | 29.1% |
| No clear push | 1,116 | 59.7% |
| Possible | 136 | 7.3% |
| Strong | 69 | 3.7% |
| Very strong | 4 | 0.2% |

Steelhead's larger Weak share is expected rather than a defect: its longer
window contains 363 too-warm dates and 399 cold-holding dates. Cold holding caps
active-movement confidence while preserving the separate Fish In River value.

Across the replays, rainfall was absorbed after measured gauge response on 109
Chinook, 99 Coho, and 113 Steelhead dates. Strong language never depended on
precipitation alone. All Push safety/copy invariants passed.

## Migration Timing

Migration Timing was generated from cumulative checkpoints using 2007–2025
Wellston flow and measured-water histories. Each run requires five checkpoints:
river start, building start, building established, peak start, and peak
complete.

### Final checkpoint outcomes

| Run | Historical checkpoint reads | Ahead | Typical | Delayed |
|---|---:|---:|---:|---:|
| Chinook | 93 | 9 (9.7%) | 61 (65.6%) | 23 (24.7%) |
| Coho | 93 | 20 (21.5%) | 51 (54.8%) | 22 (23.7%) |
| Steelhead | 93 | 8 (8.6%) | 61 (65.6%) | 24 (25.8%) |

All three runs have 17 usable years at the first river-start checkpoint and 19
at the remaining four. Steelhead
recorded one direct Ahead-to-Delayed reversal, which the production tempering
rule correctly resolved to Typical. Candidate-agreement violations were zero
for every species.

The dominance of Typical is intentional. “Ahead” and “Delayed” require the
combined cumulative flow/temperature index to clear the configured historical
percentile gates; ordinary variation and mixed hydrothermal evidence remain
Typical rather than generating unstable timing claims.

## Source and normalization conclusions

- Discharge and measured temperature both resolve to the exact Wellston site,
  `04125550`.
- Discharge is normalized to daily mean `flow_cfs`; temperature is converted
  from the USGS-reported Celsius daily mean to Fahrenheit.
- Sherman and other upstream context gauges never enter scoring.
- Air temperature never substitutes for measured water temperature.
- Fishability and Push use paired prior observations rather than assuming a
  trend when lookback data is missing.
- Push precipitation is modeled grid context and cannot independently create a
  Strong result after the river fails to respond.
- Every audited cap and output-copy invariant recorded zero violations.

## Product conclusion

The Big Manistee primitives are operating in a credible range. Fishability is
usually favorable but now reserves Excellent for the central presentation core
and still detects rare difficult water. Push is selective:
Strong plus Very strong occurred on only 6.6% of usable Chinook days, 7.5% of
Coho days, and 4.1% of Steelhead days. Migration Timing favors stable Typical
reads while retaining material Ahead and Delayed histories.

The one notable limitation is Fishability's 86.08% historical coverage across
the full 30-year union window. This is acceptable for the calibration replay
and is honestly fail-closed, but it should not be described as complete daily
coverage. Push and Timing, which use the measured-temperature era beginning in
2007, have substantially stronger usable coverage.
