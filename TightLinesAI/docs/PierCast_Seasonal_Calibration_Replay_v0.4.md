# PierCast Seasonal Calibration Replay v0.4

## Result

The recalibrated Michigan seasonal curves retain strong retrospective consistency with the official 1997–2022 port- and `Pier/Dock`-specific evidence archive. The replay covers 120 city × species × surveyed-month cells across 16 Michigan curves. Sheboygan remains excluded because Wisconsin does not publish a comparable contemporary city-only pier effort-and-catch series.

| Diagnostic | v0.3 | v0.4 |
|---|---:|---:|
| Spearman vs. nonbinding evidence guide | 0.854 | **0.857** |
| Spearman vs. log modern CPUE | 0.836 | **0.841** |
| Spearman vs. modern positive-year share | 0.830 | **0.831** |
| Exploratory Spearman vs. recent CPUE | 0.746 | **0.743** |
| Evidence-peak month exact matches | 13/16 | **13/16** |
| Within one month of evidence peak | 16/16 | **16/16** |
| Unsupported monthly ratings ≥6 | 0 | **0** |
| Fragile monthly ratings ≥6 | 0 | **0** |

The very small change in rank correlations is expected because v0.4 revises scale usage while deliberately preserving the researched seasonal shapes and port ordering. It neither degrades the main in-sample checks nor turns the evidence archive into independent validation.

## Curves requiring continued review

Three curves remain below the replay’s `0.70` per-curve rank-correlation threshold:

- Ludington coho (`0.577`): occurrence is sparse, and the permanent fall shape depends partly on direct weekly reports rather than a strong monthly series.
- Grand Haven steelhead (`0.650`): two genuine peaks—June–July and October—make a simple twelve-month rank comparison less stable even though both windows are supported.
- Grand Haven brown trout (`0.377`): the cold/open-water shoulders retain opportunity from agency guidance while the comparable creel archive is strongest only in April.

These are review flags, not automatic failures. None produces an unsupported good-or-better monthly rating under the replay rules.

## Interpretation

This replay is an **in-sample consistency diagnostic**. The Michigan archive informed both v0.3 and v0.4 calibration, so correlation cannot establish predictive accuracy. Monthly estimates cannot validate exact week knots or one-decimal distinctions. Catch per total pier angler-hour also combines differences in targeting, method, skill, weather, access, and reporting variance.

The machine-readable results are preserved in [JSON](PierCast_Seasonal_Calibration_Replay_v0.4.json) and [CSV](PierCast_Seasonal_Calibration_Replay_v0.4.csv). The full calibration rationale and source list are in the [v0.4 full-scale audit](PierCast_Full_Scale_Seasonal_Recalibration_v0.4.md).
