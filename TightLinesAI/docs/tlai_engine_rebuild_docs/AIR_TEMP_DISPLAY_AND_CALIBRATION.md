# Air temperature: display, scoring definition, and calibration

This document is the **single source of truth** for how air temperature is computed, scored, shown to users, and how regional/monthly tables should be interpreted.

## Phase summary (implementation roadmap)

| Phase | Goal | Status |
|-------|------|--------|
| **A** | Document the **scoring statistic** (representative daily air temp) vs **UI statistic** (forecast low/high for the calendar day). | This doc |
| **B** | Plumb **daily high/low** from `temp_7day_high` / `temp_7day_low` into the engine **LLM environment snapshot** (no change to band math). | Done in codebase |
| **C** | **Narration brief**: use range in temperature copy when high/low exist; add guardrails so the LLM does not treat a single number as “the high”; flag **large diurnal swings** (≥18°F) for time-of-day awareness. | Done in codebase |
| **D** | **UI**: How’s Fishing report shows forecast **low–high**; home **Live Conditions** shows **today’s range** when arrays exist; optional loading tile supports range. | Done in codebase |
| **E** | **Calibration audit**: sample (region × month) against a reference climatology using the **same** statistic as `normalizeTemperature` (see below). Adjust `tempBands*.ts` or the scalar recipe only after documented evidence. | Ongoing / manual |

## What the engine uses for scoring (unchanged)

- **Band placement and tapered score** (`normalizeTemperature`): `daily_mean_air_temp_f`, falling back to `current_air_temp_f`.
- **`buildFromEnvData`recipe for `daily_mean_air_temp_f`:**
  - Base: **(daily high + daily low) / 2** for the target calendar day index when 7-day arrays exist.
  - **Forecast / calendar profile** (`dayOffset > 0` or `useCalendarDayProfileForToday`): **local noon** hourly (`hourly_air_temp_f[12]`) when a full local day of hourly samples exists; else falls back to the daily mean above.
- **Shock / trend**: day-over-day deltas use the **same** mean series (`prior_day_mean_air_temp_f`, `day_minus_2_mean_air_temp_f`), not the daily high alone.

**Important:** Seasonal breakpoints in `tempBandsFreshwater.ts` / coastal equivalents are only “correct” if they were tuned for this representative value—not necessarily for “forecast high” or “climate mean high.” Phase **E** validates that alignment.

## What users should see

- **Primary:** **Forecast low and high** for the report’s **local calendar day** (matches typical weather apps and avoids “why is this number not the high?”).
- **Optional subcopy when high − low ≥ `AIR_TEMP_LARGE_DIURNAL_SWING_F` (18 °F on engine/brief paths):** Short note that **fishable air temps depend on time of day**; tie to **Best Timing** windows rather than changing the headline score. Constant lives in `howFishingEngine/config/airTempDisplayConstants.ts` and `lib/airTempUiConstants.ts` (keep in sync). The How’s Fishing report strip is always °F; metric home tiles use °C from get-environment and do not apply this 18 °F threshold to a secondary “swing” line (range only).
- **Do not** show the internal representative (mean/noon) as the only headline number without explanation.

## Wire fields (snapshot)

`LlmEnvironmentSnapshot` includes:

- `daily_high_air_temp_f` / `daily_low_air_temp_f` — from the same day index as scoring arrays.
- `air_temp_diurnal_range_f` — `high − low` when both present; otherwise `null`.

Scoring logic **does not** consume these fields; they are for **UX, narration, and audits**.

## Follow-up (Phase E) — calibration checklist

1. Export per-`RegionKey` and calendar month: distribution of **engine representative temp** (as built) from historical runs or reanalysis.
2. Compare to published normals **only if** the same statistic is used (e.g. mean of daily max+min vs noon only).
3. If a systematic bias appears (e.g. always “colder” than angler expectation), either:
   - **Retune** band table knots, or
   - **Change** the representative scalar (e.g. weighted toward fishing hours) **and** retune tables.

Do not retune on UI complaints alone without reconciling the statistic.

## Related code

- `howFishingEngine/request/buildFromEnvData.ts` — builds means, high/low, hourly.
- `howFishingEngine/normalize/normalizeTemperature.ts` — bands, shock, trend.
- `howFishingEngine/narration/buildLlmConditionExtensions.ts` — snapshot.
- `howFishingEngine/narration/buildNarrationBrief.ts` — LLM brief including temperature guardrails.
- `components/fishing/RebuildReportView.tsx` — report air strip.
- `components/LiveConditionsWidget.tsx` — home conditions grid.
