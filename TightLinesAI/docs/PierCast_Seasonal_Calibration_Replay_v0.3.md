# PierCast v0.3 Seasonal Calibration Replay

**Completed:** 2026-09-10<br>
**Calibration:** `piercast-core-seasonal-v0.3.0`<br>
**Classification:** retrospective in-sample consistency diagnostic<br>
**Release effect:** none; every public PierCast rating remains disabled

> **Formula-v2 interpretation:** This replay validates only the unchanged seasonal curve ordering. References to “ceiling” describe the original v0.3 analysis field; runtime formula v2 treats the same value as a Seasonal Pier Opportunity Rating and evaluates it prospectively against formula v1.

## Decision

The Michigan v0.3 seasonal curves are internally consistent enough to proceed to prospective shadow validation. Across 120 surveyed port × species × month cells, their monthly ordering has a Spearman correlation of **0.854** with the nonbinding evidence guide, **0.836** with modern catch per 1,000 pier/dock angler-hours, and **0.830** with modern positive-year frequency. All 16 Michigan curves place their strongest surveyed month either in the evidence peak month or an adjacent month; 13 match exactly.

This is encouraging evidence of configuration coherence, not proof of predictive accuracy. The v0.3 curves were calibrated using these aggregate records, so the same records cannot be called a held-out test. The archive is monthly and cannot validate exact weekly knots or one-decimal distinctions.

## What was replayed

For each Michigan curve, the script:

1. evaluates the piecewise-linear seasonal curve on every day of each DNR-surveyed month;
2. averages those daily values into a monthly seasonal ceiling;
3. compares that ceiling with official `Pier/Dock` catch per effort and positive-year frequency;
4. checks whether the configured peak month matches the evidence peak;
5. identifies high configured scores with absent or thin aggregate support.

The comparison covers Ludington, Grand Haven, Manistee, and Frankfort/Elberta for Chinook salmon, coho salmon, steelhead, and brown trout. The underlying Michigan records span 1997–2022 for the long period, 2012–2022 excluding 2020 for the modern period, and 2018–2022 excluding 2020 for the small recent diagnostic.

The temperature multiplier was intentionally excluded. This replay assesses only the configured seasonal opportunity ceiling; it is not a replay of the final two-input PierCast score.

## Results

| Diagnostic | Result |
|---|---:|
| Surveyed monthly cells | 120 |
| Spearman vs evidence guide | 0.854 |
| Spearman vs modern catch per effort | 0.836 |
| Spearman vs modern positive-year share | 0.830 |
| Exploratory Spearman vs recent catch per effort | 0.746 |
| Curves with exact evidence peak month | 13 / 16 |
| Curves within one month of evidence peak | 16 / 16 |
| Configured `>= 6.0` cells with zero long and modern catch per effort | 0 |
| Configured `>= 8.0` cells with modern occurrence below 50% | 0 |
| Configured `>= 6.0` cells with modern occurrence below 30% | 0 |

The species-level Spearman correlations with the evidence guide are:

| Species | Monthly cells | Correlation |
|---|---:|---:|
| Chinook salmon | 30 | 0.931 |
| Steelhead | 30 | 0.909 |
| Coho salmon | 30 | 0.758 |
| Brown trout | 30 | 0.750 |

## Curves retained for focused review

Three curves fall below the replay's `0.70` strong-consistency descriptor. This descriptor is a diagnostic label, not a scientific acceptance threshold.

- **Ludington coho — 0.577:** the configured and evidence peaks both occur in October. The lower correlation reflects sparse and inconsistent catches outside the modest September–October window, especially in the four-year recent slice. The v0.3 curve remains appropriately conservative; no rating change is justified from this result alone.
- **Grand Haven steelhead — 0.650:** the configured monthly-average maximum is July while the evidence guide maximum is June. Both June and July are strong, October is also strongly supported, and all configured `good` months have modern support. Preserve the dual summer/fall structure and monitor whether June should slightly exceed July after prospective observations accumulate.
- **Grand Haven brown trout — 0.377:** the important result is sound: April is the configured and observed peak, with 39.34 estimated brown trout per 1,000 modern pier/dock hours and positive estimates in 90% of modern surveyed Aprils. Most rank disagreement comes from the low winter shoulder: November has only three long-period surveyed years and December only one, with just 26 recorded December angler-hours. This is insufficient to infer that accessible open-water winter opportunity is absent. Keep the spring window; treat the November–March shoulder as explicitly access-dependent and provisional.

## Sheboygan boundary

Sheboygan is not included in the quantitative correlation or false-high counts. Wisconsin's public material supports a strong local fishery, current structure-specific Chinook relevance, regional pier harvest, and stocking context, but it does not provide a comparable Sheboygan-only monthly pier/dock catch-and-effort series for all four species. Consequently:

- Sheboygan Chinook remains `medium_high` confidence;
- Sheboygan coho, steelhead, and brown trout remain `medium` confidence;
- none of those curves may be described as quantitatively backtested;
- prospective owner observations are required before release.

## Interpretation limits

- Catch per total pier/dock angler-hour is a fishery-strength proxy, not target-specific catch probability.
- Creel estimates contain sampling uncertainty and do not control for targeting, weather, access, water temperature, or angler skill.
- Months absent from the survey were omitted rather than treated as biological zeroes.
- The recent period has only four non-2020 years, so its statistics are a stability signal, not an independent validation set.
- Exact weekly scores remain researched interpolation. Monthly agency data cannot establish that `7.6` is scientifically distinct from `7.4`.

## Next gate

Start a prospective shadow ledger before public release. For every supported city/date/species, preserve the model version, seasonal rating, source temperature, temperature multiplier, final score, provenance, access state, and later observed outcome. Review false-high examples by score band rather than tuning to a few memorable catches. The deployed ledger now preserves active bounded-temperature formula v2 and the former direct-multiplier v1 against identical issues; neither should be tuned after outcomes are inspected.

## Reproduction

```bash
npm run replay:pier-cast:seasonal
npm run check:pier-cast:seasonal-replay
```

Machine-readable results are in `PierCast_Seasonal_Calibration_Replay_v0.3.json`; the complete 120-cell review table is in `PierCast_Seasonal_Calibration_Replay_v0.3.csv`.

## Primary evidence

- Michigan DNR, [Creel Clerks & Angler Surveys](https://www.michigan.gov/dnr/managing-resources/fisheries/creel).
- Michigan DNR, [Michigan Creel Sportfishing Estimates](https://app.powerbigov.us/view?r=eyJrIjoiOWQ5NjQxMmItYjFkYi00YzI2LTkxMTAtMjMwNjEzOWE5YjM3IiwidCI6ImQ1ZmI3MDg3LTM3NzctNDJhZC05NjZhLTg5MmVmNDcyMjVkMSJ9), data through 2022.
- See `PierCast_All_Port_Seasonal_Presence_Audit_v0.3.md` for the full Michigan and Wisconsin evidence inventory and source-specific limitations.
