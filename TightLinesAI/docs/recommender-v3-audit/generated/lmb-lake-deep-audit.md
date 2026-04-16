# LMB lake/pond — deep audit

Generated: 2026-04-13T19:20:05.101Z
Archive: 2026-04-13T15:53:49.094Z
Scenarios run: **286** (skipped 0)

## Goals

- **Variety:** spread of #1 picks and healthy #1−#3 separation.
- **Best-for-conditions:** winner score components (especially `daily_condition_fit` and `clarity_fit`) should reflect the day; use `lure_win_profile` and per-scenario `records` to tune `archetypeConditionWeights.ts` and archetype `clarity_strengths`.

## Summary

| Metric | Value |
|--------|-------|
| Lure #1 entropy (bits) | 3.65 |
| Effective distinct lure #1s (exp entropy) | 12.5 |
| Fly #1 entropy (bits) | 2.92 |
| Median lure score gap (#1−#3) | 1.00 |
| Median share of #1 score from daily_condition_fit | 0.12 |
| Median share of #1 score from clarity_fit | 0.08 |

## Heuristic tuning flags

- Median lure score gap (#1−#3) is 1.00 — rankings may be fragile; small weight changes reorder often.
- 6/11 July-8 clarity triples keep the same #1 lure and fly — clarity may be under-weighted vs weather/posture on peak summer days.
- >15% of scenarios show duplicate family_key in lure top-3 — check top3_redundancy_key coverage on archetypes.

## July 8 clarity sweeps

| Region (base id) | Distinct lure #1 | Distinct fly #1 | Score range (lure #1) |
|------------------|------------------|-----------------|------------------------|
| lmb_viewer_fl_m07_d08 | 2 | 1 | 0.22 |
| lmb_viewer_tx_m07_d08 | 2 | 1 | 0.50 |
| lmb_viewer_ga_m07_d08 | 1 | 1 | 0.51 |
| lmb_viewer_il_m07_d08 | 1 | 1 | 0.51 |
| lmb_viewer_mn_m07_d08 | 2 | 3 | 0.68 |
| lmb_viewer_ny_m07_d08 | 1 | 1 | 0.44 |
| lmb_viewer_la_m07_d08 | 1 | 2 | 0.51 |
| lmb_viewer_ca_m07_d08 | 1 | 1 | 1.05 |
| lmb_viewer_or_m07_d08 | 1 | 1 | 1.05 |
| lmb_viewer_co_m07_d08 | 1 | 1 | 1.16 |
| lmb_viewer_oh_m07_d08 | 2 | 1 | 0.23 |

## Top lure win profile (when #1)

| Lure | Wins | Win rate | mean daily_fit | mean clarity_fit | mean score |
|------|------|----------|----------------|------------------|------------|
| football_jig | 50 | 17.5% | 2.70 | 0.55 | 7.58 |
| suspending_jerkbait | 50 | 17.5% | 0.63 | 0.55 | 6.13 |
| swim_jig | 30 | 10.5% | 0.40 | 0.55 | 6.84 |
| hollow_body_frog | 28 | 9.8% | 0.73 | 0.55 | 7.06 |
| spinnerbait | 18 | 6.3% | -0.05 | 0.55 | 5.58 |
| drop_shot_minnow | 18 | 6.3% | 3.15 | 0.51 | 8.27 |
| paddle_tail_swimbait | 17 | 5.9% | 0.30 | 0.55 | 6.26 |
| compact_flipping_jig | 14 | 4.9% | 0.51 | 0.55 | 5.54 |
| texas_rigged_soft_plastic_craw | 13 | 4.5% | 0.55 | 0.55 | 5.75 |
| weightless_stick_worm | 11 | 3.8% | 3.02 | 0.55 | 6.94 |
| finesse_jig | 8 | 2.8% | 2.31 | 0.55 | 7.16 |
| soft_jerkbait | 7 | 2.4% | 0.70 | 0.55 | 6.16 |
| blade_bait | 7 | 2.4% | 0.68 | 0.55 | 5.82 |
| drop_shot_worm | 5 | 1.7% | 2.88 | 0.55 | 6.74 |
| buzzbait | 3 | 1.0% | 1.20 | 0.55 | 7.30 |
| weightless_stick_worm | 2 | 0.7% | 3.18 | 0.55 | 7.46 |
| walking_topwater | 2 | 0.7% | 1.54 | 0.55 | 6.44 |
| prop_bait | 2 | 0.7% | 1.71 | 0.55 | 6.03 |
| squarebill_crankbait | 1 | 0.3% | 1.88 | 0.55 | 8.03 |

Full JSON: `docs/recommender-v3-audit/generated/lmb-lake-deep-audit.json` (includes every scenario record with top-3 components).
