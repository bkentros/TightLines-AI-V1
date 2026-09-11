# PierCast Shadow Validation Evaluation

**Generated:** 2026-09-10T19:37:47.479Z<br>
**Outcome conclusion:** INSUFFICIENT DATA — no eligible paired lead-day-1 outcomes<br>
**Protocol:** `PierCast_Prospective_Evaluation_Protocol_v2.md`

## Live ledger

| Record | Count |
|---|---:|
| Forecast runs | 5 |
| Archived forecasts | 500 |
| Recorded outcomes | 0 |
| Eligible paired lead-day-1 outcomes | 0 |
| Positive outcomes in primary cohort | 0 |
| Effort-backed zero catches in primary cohort | 0 |

Real-world ranking usefulness cannot be estimated until eligible outcomes exist. AUC, uncertainty, catch-per-effort association, and false-high rates are therefore **not available**, not zero.

## Same-issue production snapshot

Active run: `8b015f4e-69ce-4617-b983-7e28ceba7d21`<br>
Comparator run: `93f7e12d-5e28-4b7f-87ea-892afe236f97`<br>
Paired city × species × date × lead forecasts: **100**

| Formula | Minimum | Mean | Maximum |
|---|---:|---:|---:|
| v1 direct multiplier | 1.187 | 3.134 | 8.799 |
| v2 bounded temperature | 1.282 | 3.913 | 9.189 |

| Formula | Poor | Limited | Fair | Good | Excellent |
|---|---:|---:|---:|---:|---:|
| v1 | 34 | 39 | 19 | 7 | 1 |
| v2 | 24 | 30 | 34 | 9 | 3 |

Paired v2 − v1 score change: minimum **0.065**, mean **0.779**, maximum **1.960**.

Band transitions: Excellent → Excellent: 1; Fair → Fair: 15; Fair → Good: 4; Good → Excellent: 2; Good → Good: 5; Limited → Fair: 19; Limited → Limited: 20; Poor → Limited: 10; Poor → Poor: 24.

These are behavior and calibration-distribution checks. They do not establish that v2 predicts catches better.

## Formula guardrails

The exhaustive 0.01-temperature × 0.1-seasonal grid found:

- seasonal monotonicity violations: **0**;
- temperature monotonicity violations: **0**;
- cells where v2 falls below v1: **0**;
- minimum retained seasonally supported opportunity above the 1.0 floor: **30%**;
- temperature synergy begins only above suitability **0.933**; and
- maximum amplification of opportunity above the 1.0 floor: **1.050×**.

At perfect temperature suitability, seasonal ratings 2, 4, 6, 8, and 10 can produce at most 2.05, 4.15, 6.25, 8.35, 10.00, respectively. This prevents temperature alone from manufacturing a high rating where configured seasonal opportunity is low.

## Prospective metrics

| Predictor | Lead-day-1 AUC |
|---|---:|
| v2 bounded-temperature score | n/a |
| v1 direct-multiplier score | n/a |
| seasonal-only rating | n/a |

No formula tuning should be made from this empty outcome cohort. The frozen first checkpoint remains 50 eligible outcomes for data-quality review only; confirmatory evaluation remains at least 200 eligible outcomes with the preregistered balance requirements.
