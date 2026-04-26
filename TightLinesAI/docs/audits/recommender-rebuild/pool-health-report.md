# Recommender rebuild — pool health audit (Pass 7)

Generated: **2026-04-26T03:09:59.500Z**

## Matrix

- Seasonal rows (unscoped): 1104
- Total evaluated cells: **29808**
- Dimensions: 3 clarities × 3 regimes × 3 wind/surface bands

## Global metrics

| Metric | Value |
| --- | --- |
| Cells | 29808 |
| % 3 lure picks | 100% |
| % 3 fly picks | 100% |
| % <3 lure picks | 0% |
| % <3 fly picks | 0% |
| Zero-output lure cells | 0 |
| Zero-output fly cells | 0 |
| Repeated presentation-group cells | 6928 (23.24%) |
| Avoidable repeated presentation-group cells | 0 (0%) |
| Unavoidable repeated presentation-group cells | 6928 (23.24%) |
| Repeated family-group cells | 6289 (21.1%) |
| Adjacent-date same top lure (rate) | 21.33% |
| Adjacent-date same top fly (rate) | 23.42% |
| Topwater variety rate (surface open, ≥2 surface picks & ≥2 pres. groups) | 39.93% |
| Southern LMB warm-season lake frog exposure rate | 45.45% |
| Southern LMB frog candidate rate when surface slot exists | 100% |
| Southern LMB frog finalist rate when surface slot exists | 100% |
| Southern LMB frog pick rate when surface slot exists | 59.44% |

## Southern LMB frog exposure

Contexts (LMB × FL/Gulf/Southeast × lake × months 3–10 × surface open × row lists frog): **396**; with frog in finalists or picks: **180**.
Surface-slot contexts: **180**; frog candidate: **180**; frog finalist: **180**; frog pick: **107**.
Surface-slot topwater split across all species: open-water surface picks **5053**, frog surface picks **200**.

## Avoidable presentation-group repeats

A repeated presentation group is marked avoidable when the repeated slot still had at least one legal, not-yet-picked candidate with a different presentation group in its compatible candidate pool.

- Repeated presentation-group cells: **6928**
- Avoidable repeated presentation-group cells: **0**
- Unavoidable repeated presentation-group cells: **6928**

## Zero-output samples

- Lure zero: **0** (showing up to 50 in JSON)
- Fly zero: **0**

## Worst thin-pool samples (lowest combined pick counts)

_No cells with fewer than three picks or zero-output sides in this matrix run._

## Thin classification distribution

```json
{
  "ok": 29808
}
```

## Notes

- Expect ~10 minutes on a typical laptop (≈30k cells × 2 dates × full `selectArchetypesForSide` × lure + fly).
- Regimes are driven by fixed How’s score proxies (30 / 50 / 75) for column/pace shaping only.
- Wind uses synthetic hourly series in UTC; `windy` uses 16 mph daylight mean so surface is blocked when seasonally legal.
- Candidate counts are `eligibleCandidateCount` per slot from `selectArchetypesForSide` traces (pre–weighted draw).
- Frog exposure counts rows that list both `frog_fly` and `hollow_body_frog` and checks finalists or chosen ids.

Full machine-readable report: `docs/audits/recommender-rebuild/pool-health-report.json` (default: metrics + first 200 cells as `cells_preview`; set `TL_POOL_AUDIT_FULL_CELLS=1` for complete `cells` + `pool-health-report.cells.jsonl`).