# Regional fall/winter evaluation — preserved pre-correction findings

**Status update:** The Brownsville issue described below is fixed and revalidated. See the [final correction report](./corroboration-fix/README.md): its regional calendar maximum is now two points, with no checked regressions. This document retains the earlier findings for comparison.

**Verdict: the renovated feature is more consistent overall, but it is not yet free of known calendar-induced score regressions.** The expanded evaluation found one remaining Prime-eligibility cliff that should be corrected before release. No production scoring changes were made during this evaluation; this report assesses the model actually delivered in Pass 2/3.

The approved retry succeeded. All 27 public weather snapshots were downloaded and frozen with a SHA-256 manifest. The prior download-approval blocker is resolved.

## What was tested

Nine cities: Tallahassee, Tampa, Miami, Dallas, Houston, Brownsville, Montgomery, Jackson and Detroit. Each has three seven-day target periods, backed by 14 preceding days of daily/hourly history:

- October 28–November 3, 2025: fall, a month boundary and the DST transition.
- January 15–21, 2026: midwinter.
- February 28–March 6, 2026: late winter and another month boundary.

The replay compares the original engine, Pass 1, and the final model using identical captured weather, dates, goals, clarity settings and deterministic seeds. It evaluates **756 reports** (four contexts) and **1,764 supported recommendation sets**, covering bass, pike/musky and river trout where exact seasonal catalog rows exist. Recommendation goals pair all-purpose with clear water and big-fish with stained water, matching the earlier audit design; this is not every possible goal/clarity combination. It uses variant A; retained/variant-B behavior remains covered by the session tests.

Actual daily-mean air inputs span **6.75–83.95°F**. Forty-four report cases include at least a 10°F day-to-day cooling; context duplicates mean these are not 44 independent cold fronts. No measured water or tide/current observations are supplied. Therefore the 378 coastal cases validate air fallback and missing-data behavior, not full coastal opportunity or the new measured-water bands.

Data source: [Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api), which provides reconstructed historical weather. These are real provider inputs, not invented scenarios, but they are not catch observations or the forecasts issued on those historical dates. Requests, coordinates, parameters and raw responses are preserved in `regional-weather.json.gz`.

## Evidence of improvement

| Criterion | Original | Final |
| --- | ---: | ---: |
| Favorable seasonal warmth incorrectly tagged `heat_finesse` (non-trout recommendation sets) | 72 | **0** |
| Mean calendar-only score movement | 0.433 | **0.110** |
| 95th-percentile calendar-only movement | 3 | **1** |
| Maximum calendar-only movement | 21 | **9** |
| Calendar-only movements above 10 points | 8 | **0** |
| Supported recommendation sets | 1,764 | **1,764** |

The calendar check advances each date by one day while holding hourly weather, temperature history and relative sunrise/sunset times fixed. This isolates calendar sensitivity; actual day-to-day score movement with changing weather is not labeled a regression. Average calendar sensitivity fell approximately **75%**, but one individual case worsened materially (below).

Additional final-model checks passed with **zero violations**: report/score-only parity, finite integer scores in range, confidence and missing-input caps, no regional relief for thermal shocks, four distinct picks, closed-surface exclusion, and no loss of original or Pass 1 seasonal-row coverage. These are explicit software/semantic contracts, not proof that all changed scores or picks are more accurate.

Pressure normalization changed in 376 of 378 freshwater cases; that count includes changes to descriptive details, not solely categorical regimes. Corrected geography changes the region in 84 freshwater cases (Montgomery and Jackson). The earlier Pass 1 audit provides exact attribution for those input corrections.

## Score and recommendation effects

Against the original model:

- **550 of 756 scores change**, with 208 band changes. Mean score change is **−0.43/100** overall; the score is not simply inflated.
- Across the 378 freshwater reports, mean score is **57.94 → 58.11**. This near-neutral average conceals useful corrections in both directions.
- **654 of 1,764 recommendation sets change selected picks** (37.1%); activity changes in 270, surface gating in 44, and embedded color themes in 10. Lure/fly consequences are material, not negligible.
- Relative to Pass 1 alone, 442 scores change; mean change is +0.17. Picks change in 221 sets (12.5%), activity in 104, and surface gating in 22. Embedded color themes are unchanged versus Pass 1.

Freshwater mean scores, 42 reports per city (two contexts × three seven-day windows):

| City | Original | Final |
| --- | ---: | ---: |
| Tallahassee | 48.14 | 49.95 |
| Tampa | 54.69 | 57.10 |
| Miami | 63.71 | 64.95 |
| Dallas | 58.00 | 60.17 |
| Houston | 62.21 | 61.48 |
| Brownsville | 64.48 | 65.69 |
| Montgomery | 59.76 | 55.12 |
| Jackson | 59.74 | 56.21 |
| Detroit | 50.71 | 52.36 |

Do not treat these means as city rankings or evidence that a lower city score is worse software. For example, Jackson on January 20 moves **89 → 58** for a lake with 41.6°F mean air, principally after fixing its incorrect Midwest region assignment; Pass 1 was already 60. Montgomery on March 4 moves **67 → 93** at 66.6°F mean air, with Pass 1 already at 90. Both examples show why separating routing fixes from recalibration matters.

## Remaining issue: Brownsville's Prime cutoff

On February 28, 2026, the Brownsville lake case has 74.9°F daily-mean air. Advancing the calendar to March 1 with otherwise identical conditions produces:

- Original: four-point movement.
- Final: **88 → 79**, a nine-point drop.
- Positive contribution mass changes only **73.0208 → 72.7887**.
- Temperature contribution changes only **51.3083 → 51.0728**.
- Legacy score remains **73** on both dates, and the selected evening light window remains `strong`.

The production score's `freshwater_temp_dominated_prime_needs_more_corrob` rule imposes the Prime cap when support score is at most 73, temperature contribution is at least 50, and positive mass falls below 73. Smooth seasonal interpolation moves this fixture across that remaining hard cutoff. It is not a genuine change in weather or fishing evidence.

This is the only one of the 756 calendar probes where the final movement exceeds the original by more than three points. It demonstrates that the earlier synthetic matrix's maximum of three points was specific to that matrix, not a universal guarantee. Trace: [brownsville-diagnosis.json](./brownsville-diagnosis.json).

**Recommended next change:** taper the temperature-dominance/corroboration restriction across its boundary while preserving the intent that temperature alone should not earn Prime. Add this captured fixture as a regression case, probe adjacent temperature/support values, and rerun the full three-generation score/pick matrices. Do not remove the corroboration safeguard or raise temperature weights merely to avoid the cap. This correction has not been implemented in this evaluation.

## Judgment and limits

I would keep the direction of the renovation: corrected geography/pressure inputs, explicit air-versus-water provenance, seasonal interpolation, reduced winter-warmth/heat confusion, and coordinated score/recommendation semantics. These improve explainability and internal consistency on the captured conditions as well as the synthetic suites.

I would **not** certify the model as fully release-ready while the Brownsville cliff is known. I also would not infer catch-accuracy improvement or universal validity of the southern measured-water bounds from air-weather reanalysis. Species-specific activity, finer thermal regions and absolute stress thresholds still need waterbody/source-specific evidence; this evaluation does not justify another broad weight or band change.

Production deployment, retained-session verification against a real database, and on-device checks remain separate, unperformed release steps. No production write, model coefficient change, or deployment occurred during this follow-up.

## Artifacts and reproduction

- [Evaluation summary](./regional-evaluation.json): three-version statistics, season/city breakdowns, largest changes, every checked violation and the calendar regression.
- [Findings](./regional-findings.json): freshwater/coastal separation, warmth conflicts and calendar examples.
- `regional-evaluation-detail.json.gz`: every evaluated report summary and selected recommendation IDs/scenarios.
- `regional-weather.json.gz` and `regional-weather.manifest.json`: frozen public capture and checksum.

Run offline from `TightLinesAI`, with original and Pass 1 shared-source archives restored as described in earlier reports:

```sh
deno run --no-lock --node-modules-dir=none --allow-read --allow-write scripts/audit/todays-bite-pass3/evaluate-regional-weather.ts /tmp/todays-bite-pass1-original/TightLinesAI/supabase/functions/_shared /tmp/todays-bite-pass2-pass1/_shared
python3 scripts/audit/todays-bite-pass3/summarize-regional-weather.py
```

The capture script refuses to overwrite an existing frozen download. The replay verifies its checksum and, for each provider sample and engine generation, proves target-day hourly pruning produces an identical request to full-history processing. Pressure history is retained in full. Forecast dates use the documented provider offset, and daily sun fields go through the production snapshot materializer. Audit typechecking, formatting and `git diff --check` passed.
