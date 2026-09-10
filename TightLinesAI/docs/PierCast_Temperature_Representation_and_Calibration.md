# PierCast — Temperature Representation and Calibration Decision

**Completed:** 2026-09-10
**Decision:** All five city cells remain `candidate`; every city is `blocked_insufficient_evidence` for temperature-representation approval. No temperature curve, score formula, or rating flag was changed.
**Machine-readable protocol:** [Temperature representation acceptance protocol](PierCast_Temperature_Representation_Acceptance.json)
**Machine-readable results:** [Temperature representation audit](PierCast_Temperature_Representation_Audit.json)
**Reproduction command:** `npm run audit:pier-cast:temperature-representation`

## Executive conclusion

The temperature plumbing works, but the available evidence is not sufficient to claim that the selected LMHOFS surface cells accurately represent year-round pier-accessible water in any of the five cities.

The short late-summer comparison is informative, not approval-grade. Grand Haven performed reasonably through 72 forecast hours in this limited window, then its tail error increased at 96 and 120 hours. Ludington showed larger tail errors at every evaluated lead and exceeded the predeclared RMSE limit at the longest leads. Those findings identify real product risk because temperature error can materially change the provisional FinFindr rating during strong seasonal weeks. They still cannot justify a permanent correction: both samples are small, seasonal, spatially imperfect, lack documented numeric sensor depth, and provide no independent holdout period.

Manistee and Frankfort–Elberta have no qualified nearby observation dataset in the audited official catalog. Sheboygan's current candidate dataset supplied no aggregate-QC-good records. Those three cities are therefore unevaluable, not presumed accurate.

This is the correct conservative result. NOAA describes LMHOFS as model guidance with four daily cycles and forecasts through 120 hours; it is not a pier thermometer or a fishing-accuracy product. [NOAA LMHOFS operational page](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html) NOAA's own LMHOFS technical report evaluates hydrodynamic skill against environmental observations, not the ability to predict pier catches. [NOAA Technical Report 091](https://tidesandcurrents.noaa.gov/ofs/publications/CO-OPS_Techrpt_091_LMHOFS_2019.pdf)

## What was evaluated

PierCast's numeric model remains intentionally simple:

`rating = 1 + (seasonal opportunity ceiling - 1) × temperature suitability`

The representation question is upstream of that formula: whether the single configured LMHOFS surface series for a city is close enough to relevant nearshore water to be used as the temperature input. This audit did not add depth, wind, wave, current, pressure, trend, or plume coefficients to the score. It tested the one temperature input the product already chose.

The five runtime cells were selected by a temperature-blind geometry rule—the nearest wet regular-grid center on the lakeward side of the port's outer-light reference. The audit then used the nearest native-grid surface node because NOAA's historical archive retains native `fields.fHHH.nc` products rather than the live `regulargrid` products. A same-cycle approximation check compared the native and regular-grid values at four leads before historical results were interpreted.

| City | Runtime cell | Native archive node distance | Largest native-versus-regular difference in check |
| --- | --- | ---: | ---: |
| Ludington | `43.95, -86.47` | 189 m | 0.060 °C |
| Grand Haven | `43.06, -86.26` | 134 m | 0.061 °C |
| Manistee | `44.25, -86.35` | 160 m | 0.118 °C |
| Frankfort–Elberta | `44.63, -86.26` | 178 m | 0.103 °C |
| Sheboygan | `43.75, -87.69` | 117 m | 0.170 °C |

These small one-cycle differences support use of the native node as an archive approximation for this audit. They do not prove that either grid represents casting water. NOAA documents the operational file conventions and a rolling THREDDS archive; at audit time the usable rolling window began on 2026-08-10. [NOAA OFS FAQ](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html) [NOAA LMHOFS THREDDS catalog](https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/LMHOFS/MODELS/catalog.html)

## Acceptance protocol

The thresholds were frozen before historical forecast extraction so the result could not be fitted to the observed errors. Approval requires all of the following for the named city scope:

- a lake-side observation within 10 km and either an explicit surface variable or documented depth of 3 m or less;
- at least 60 distinct observation days, three calendar months, 30 matched forecasts at every tested lead, all three thermal regimes, three rapid-change events, two operational seasons, and winter evidence for annual approval;
- absolute mean bias no greater than 1 °C, RMSE no greater than 3 °C, and 90th-percentile absolute error no greater than 3 °C at every lead;
- at a stress-test seasonal ceiling of 10, mean absolute rating impact no greater than 0.5 point and 90th-percentile impact no greater than 1.0 point for every core species and lead;
- a temperature-blind cell selection, exact source/QC contracts, complete as-issued cycles, and a separate holdout before any correction is approved.

The 3 °C RMSE ceiling is adapted from the NOAA NOS surface-temperature skill criterion described in Technical Report 091; it is not a fishing-accuracy claim. The stricter tail-error and score-impact gates are PierCast product-safety criteria because a modest average can hide trip-changing errors.

Only aggregate quality flag `1` entered the comparisons. The U.S. IOOS QARTOD vocabulary identifies `1` as good, `2` as not evaluated, `3` as suspect, `4` as fail/bad, and `9` as missing; the manual discourages treating unevaluated data as passed evidence. [U.S. IOOS QARTOD Data Flags Manual](https://cdn.ioos.noaa.gov/media/2020/07/QARTOD-Data-Flags-Manual_version1.2final.pdf)

## Observation-source audit

| City | Dataset and geometry | Records / QC-good | Useful coverage | Disposition |
| --- | --- | ---: | --- | --- |
| Ludington | GLOS `obs_62`; explicit `sea_surface_temperature`; 7.94 km from runtime cell | 2,147 / 144 | 13 good days, 2 months, all 3 thermal regimes, 6 rapid events | Supplemental seasonal evidence only; numeric sensor depth absent. |
| Grand Haven | GLOS `obs_671`; `sea_water_temperature_1`; 6.48 km from runtime cell | 27,998 / 332 | 29 good days, 3 months, transition/warm only, 9 rapid events | Configured seasonal comparison source; numeric depth and cold regime absent. |
| Manistee | No qualified official observation found | 0 / 0 | None | Unevaluable. |
| Frankfort–Elberta | No qualified official observation found | 0 / 0 | None | Unevaluable. |
| Sheboygan | GLOS `obs_709`; `Temp0`; 0.66 km from runtime cell | 3,814 / 0 | No QC-good coverage | Unevaluable under the frozen QC rule. |

The direct metadata records are [GLOS `obs_62`](https://seagull-erddap.glos.org/erddap/info/obs_62/index.html), [GLOS `obs_671`](https://seagull-erddap.glos.org/erddap/info/obs_671/index.html), and [GLOS `obs_709`](https://seagull-erddap.glos.org/erddap/info/obs_709/index.html). Dataset proximity is necessary, but not proof of equivalence to pier casting water or a river/harbor plume.

The Sheboygan rejection is especially important. Most values carried aggregate flag `2`; four Celsius-looking raw values appeared in a variable declared as Kelvin and were marked bad. The adapter retains those raw records as rejected evidence and never converts them into a usable temperature.

## Historical comparison results

The audit retrieved as-issued LMHOFS native surface forecasts at 0, 24, 48, 72, 96, and 120 hours and matched each to the nearest QC-good observation within 30 minutes. A match count here is a forecast/observation pair across issue cycles and leads, not a count of independent seasons.

| City | Matches per lead | Bias | MAE | RMSE | P90 absolute error | Maximum error |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ludington | 18 | +0.783 °C | 1.990 °C | 2.586 °C | 4.304 °C | 8.767 °C |
| Grand Haven | 13 | +0.426 °C | 1.425 °C | 1.973 °C | 3.210 °C | 8.292 °C |

Overall metrics should not conceal forecast-horizon behavior:

| City / lead | 0 h | 24 h | 48 h | 72 h | 96 h | 120 h |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ludington RMSE | 1.940 | 2.044 | 2.197 | 2.359 | 3.003 | 3.575 °C |
| Ludington P90 error | 3.522 | 3.716 | 4.483 | 4.072 | 4.376 | 7.779 °C |
| Grand Haven RMSE | 1.408 | 1.194 | 0.999 | 1.914 | 2.932 | 2.589 °C |
| Grand Haven P90 error | 1.944 | 1.611 | 1.556 | 2.345 | 4.759 | 4.100 °C |

Grand Haven met the three diagnostic temperature limits through 72 hours in this sparse window. Its P90 error failed at 96 and 120 hours, and 120-hour bias was +1.876 °C. Ludington's P90 error failed at every lead, with RMSE also failing at 96 and 120 hours and 120-hour bias reaching +1.672 °C. Because neither city met the prerequisite coverage gates, these are risk signals rather than final rejection decisions.

## Effect on the FinFindr rating

For each matched pair, the audit ran the unchanged species temperature curve once with model temperature and once with observed temperature. At each city's actual configured seasonal ceiling for that date, the absolute differences were:

| City | Chinook mean / P90 | Coho mean / P90 | Steelhead mean / P90 | Brown trout mean / P90 |
| --- | ---: | ---: | ---: | ---: |
| Ludington | 0.695 / 1.814 | 0.229 / 0.541 | 0.166 / 0.398 | 0.045 / 0.124 |
| Grand Haven | 0.625 / 1.794 | 0.271 / 0.624 | 0.283 / 0.759 | 0.063 / 0.128 |

The high Chinook sensitivity is consequential: during a strong seasonal period, the current temperature curve can turn the observed model error into roughly a 0.6–0.7 point average difference and about a 1.8-point P90 difference. The brown-trout impacts are small in this date window largely because the configured seasonal ceiling was low, not because the temperature source is proven accurate.

The ceiling-10 stress test removed that seasonal damping. Mean/P90 effects were 0.926/2.464 for Ludington Chinook and 1.003/2.868 for Grand Haven Chinook; all four species failed at least part of the strict score-sensitivity protocol. This supports collecting more evidence before public scoring and testing whether the provisional curve shoulders are too sensitive. It does not support tuning those shoulders on this same sample.

## City decisions

| City | Decision | Principal blockers |
| --- | --- | --- |
| Ludington | `blocked_insufficient_evidence` | 13 days; 2 months; 18 matches/lead; one season; no winter; numeric depth and pier/plume equivalence undocumented. |
| Grand Haven | `blocked_insufficient_evidence` | 29 days; 13 matches/lead; no cold regime; one season; no winter; numeric depth and Grand River/pier equivalence undocumented. |
| Manistee | `blocked_insufficient_evidence` | No qualified independent water-temperature dataset. |
| Frankfort–Elberta | `blocked_insufficient_evidence` | No qualified independent dataset and no proof that one cell represents both structures/Betsie influence. |
| Sheboygan | `blocked_insufficient_evidence` | No aggregate-QC-good records; no usable comparison coverage; numeric depth undocumented. |

`Blocked` is deliberately different from `rejected`: the available data are inadequate for an approval-grade conclusion. None of these decisions enables or disables a species automatically; ratings were already disabled and remain so.

## Implemented collection path

The scheduled private ingestion path now has a validation-only GLOS archive implementation for `obs_62`, `obs_671`, and `obs_709`. It:

- requests an exact, bounded 15-day window on every authenticated LMHOFS ingestion run;
- stores raw reported value, Kelvin unit, aggregate QC flag, source URL, fetch time, and rejection reason;
- creates Celsius only after flag `1` passes and the converted value is within `-2–40 °C`;
- commits in bounded idempotent batches to a service-role-only table;
- keeps GLOS failure nonfatal to the primary model-cycle job; and
- exposes a service-role-only validation RPC that pairs archived model samples with the nearest usable observation within a controlled tolerance.

This archive is research infrastructure only. It cannot feed runtime scores, replace a failed model cycle, carry forward a last observation, or select a favorable source.

## What completes calibration

1. Operate the private archive prospectively until each evaluated city has at least two seasonal deployments, the required regimes, 60 good days, and 30 matches per lead. Annual approval additionally requires winter evidence; a narrower explicitly seasonal approval can be considered separately if winter observations are structurally unavailable.
2. Obtain authoritative nearshore observations for Manistee and Frankfort–Elberta. If no agency feed exists, arrange a documented sensor program rather than substituting air temperature or a distant offshore buoy.
3. Resolve sensor depth metadata and characterize harbor/river plume differences with paired local measurements, especially at Grand Haven and Frankfort–Elberta.
4. Re-run the frozen protocol without changing cells or curves. If correction is warranted, fit on a declared training period and judge it only on a separate holdout.
5. Validate the unchanged two-input rating against dated pier outcomes. Temperature representation is necessary, but does not establish fishing-value calibration by itself.
6. Approve or reject one city scope at a time; then separately review individual city × species rating activation.

Until those gates are met, PierCast can honestly say that it uses NOAA model guidance and researched FinFindr seasonal/temperature calibrations, but it should not claim validated pier-water accuracy or biological prediction accuracy.

## Source register

1. [NOAA LMHOFS operational page](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html) — operational model purpose, variables, cycle frequency, and forecast horizon.
2. [NOAA OFS FAQ](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html) — file naming, cycles, products, and archive behavior.
3. [NOAA Technical Report 091](https://tidesandcurrents.noaa.gov/ofs/publications/CO-OPS_Techrpt_091_LMHOFS_2019.pdf) — model implementation and 2018–2019 environmental skill assessment.
4. [NOAA LMHOFS THREDDS catalog](https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/LMHOFS/MODELS/catalog.html) — machine-accessible operational and historical files used by the audit.
5. [U.S. IOOS QARTOD Data Flags Manual](https://cdn.ioos.noaa.gov/media/2020/07/QARTOD-Data-Flags-Manual_version1.2final.pdf) — aggregate quality-flag meanings and use.
6. [GLOS `obs_62`](https://seagull-erddap.glos.org/erddap/info/obs_62/index.html) — Ludington supplemental observation metadata.
7. [GLOS `obs_671`](https://seagull-erddap.glos.org/erddap/info/obs_671/index.html) — Grand Haven observation metadata.
8. [GLOS `obs_709`](https://seagull-erddap.glos.org/erddap/info/obs_709/index.html) — Sheboygan observation metadata.
