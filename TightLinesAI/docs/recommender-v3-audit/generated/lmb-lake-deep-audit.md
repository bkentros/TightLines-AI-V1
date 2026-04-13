# LMB lake/pond — deep audit

Generated: 2026-04-13T16:13:29.839Z
Archive: 2026-04-13T15:53:49.094Z
Scenarios run: **286** (skipped 0)

## Goals

- **Variety:** spread of #1 picks and healthy #1−#3 separation.
- **Best-for-conditions:** winner score components (especially `daily_condition_fit` and `clarity_fit`) should reflect the day; use `lure_win_profile` and per-scenario `records` to tune `archetypeConditionWeights.ts` and archetype `clarity_strengths`.

## Summary

| Metric | Value |
|--------|-------|
| Lure #1 entropy (bits) | 3.84 |
| Effective distinct lure #1s (exp entropy) | 14.3 |
| Fly #1 entropy (bits) | 2.96 |
| Median lure score gap (#1−#3) | 0.73 |
| Median share of #1 score from daily_condition_fit | 0.11 |
| Median share of #1 score from clarity_fit | 0.10 |

## Heuristic tuning flags

- Median lure score gap (#1−#3) is 0.73 — rankings may be fragile; small weight changes reorder often.
- 6/11 July-8 clarity triples keep the same #1 lure and fly — clarity may be under-weighted vs weather/posture on peak summer days.
- >15% of scenarios show duplicate family_key in lure top-3 — check top3_redundancy_key coverage on archetypes.

## July 8 clarity sweeps

| Region (base id) | Distinct lure #1 | Distinct fly #1 | Score range (lure #1) |
|------------------|------------------|-----------------|------------------------|
| lmb_viewer_fl_m07_d08 | 2 | 1 | 0.37 |
| lmb_viewer_tx_m07_d08 | 1 | 1 | 0.50 |
| lmb_viewer_ga_m07_d08 | 1 | 1 | 0.51 |
| lmb_viewer_il_m07_d08 | 1 | 1 | 0.51 |
| lmb_viewer_mn_m07_d08 | 1 | 2 | 0.51 |
| lmb_viewer_ny_m07_d08 | 1 | 2 | 0.90 |
| lmb_viewer_la_m07_d08 | 1 | 2 | 0.51 |
| lmb_viewer_ca_m07_d08 | 1 | 1 | 1.05 |
| lmb_viewer_or_m07_d08 | 1 | 1 | 1.05 |
| lmb_viewer_co_m07_d08 | 2 | 2 | 0.51 |
| lmb_viewer_oh_m07_d08 | 1 | 1 | 0.51 |

## Top lure win profile (when #1)

| Lure | Wins | Win rate | mean daily_fit | mean clarity_fit | mean score |
|------|------|----------|----------------|------------------|------------|
| football_jig | 55 | 19.2% | 1.79 | 0.55 | 6.65 |
| compact_flipping_jig | 31 | 10.8% | 0.48 | 0.55 | 5.51 |
| bladed_jig | 28 | 9.8% | 0.35 | 0.55 | 5.54 |
| hollow_body_frog | 27 | 9.4% | 0.76 | 0.55 | 6.08 |
| drop_shot_minnow | 23 | 8.0% | 1.81 | 0.52 | 6.90 |
| paddle_tail_swimbait | 19 | 6.6% | 0.22 | 0.55 | 5.31 |
| texas_rigged_soft_plastic_craw | 18 | 6.3% | 0.46 | 0.55 | 5.31 |
| suspending_jerkbait | 12 | 4.2% | 0.00 | 0.55 | 5.29 |
| wacky_rigged_stick_worm | 11 | 3.8% | 1.79 | 0.55 | 6.04 |
| finesse_jig | 10 | 3.5% | 1.58 | 0.55 | 6.43 |
| lipless_crankbait | 9 | 3.1% | 0.13 | 0.55 | 5.48 |
| blade_bait | 8 | 2.8% | 0.21 | 0.55 | 5.28 |
| walking_topwater | 8 | 2.8% | 1.27 | 0.50 | 5.79 |
| soft_jerkbait | 7 | 2.4% | 0.40 | 0.55 | 5.32 |
| prop_bait | 5 | 1.7% | 1.79 | 0.55 | 6.17 |
| swim_jig | 3 | 1.0% | 0.44 | 0.55 | 4.54 |
| spinnerbait | 3 | 1.0% | -0.02 | 0.55 | 4.83 |
| squarebill_crankbait | 3 | 1.0% | 0.08 | 0.55 | 5.18 |
| texas_rigged_stick_worm | 2 | 0.7% | 0.35 | 0.55 | 5.71 |
| carolina_rigged_stick_worm | 2 | 0.7% | 1.19 | 0.55 | 6.04 |

Full JSON: `docs/recommender-v3-audit/generated/lmb-lake-deep-audit.json` (includes every scenario record with top-3 components).
