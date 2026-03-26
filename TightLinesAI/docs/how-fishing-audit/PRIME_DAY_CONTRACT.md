# Prime-day contract (audit / calibration)

This document describes **input-space prime gates** used to label historical dates before expectations such as `expect_band: "Good"` are applied in `auditScenarios.ts`. Prime gates are **not** the engine score; they approximate “did this day have a defensible multisignal stack (pressure, light, wind, river runoff, coastal tides)?”

## Implementation

- **Code:** `scripts/how-fishing-audit/lib/primeGates.ts` → `evaluatePrimeGates()`
- **CLI:** `scripts/how-fishing-audit/check-prime.ts` (single lat/lon/date)
- **Archive mapping:** `scripts/how-fishing-audit/lib/archivePrimeInputs.ts` → `buildPrimeGateInputsFromArchive()` (aligns MSL pressure window and fishing-hour cloud with `mapArchiveToEnvData`)

## Pressure

- Uses **`hourly_pressure_msl`** from Open-Meteo archive, sliced to **48 hours ending at local noon** on the target date (same contract as `weather.pressure_48hr` in `mapEnvData.ts`).
- **Fails prime bar:** `volatile`, `falling_hard`.
- **Excellent-tier stack:** prefers `falling_slow` or `falling_moderate` (see tier logic in `primeGates.ts`).

## Cloud (fishing hours)

- **Window:** local hours **6–20** inclusive; mean of `hourly_cloud_cover` (%).
- **Fails:** mean &lt; 10% (glare) or mean ≥ 88% (very dim / inconsistent with partial-stack expectations).
- **Excellent tier:** stricter band (≥ 20% and ≤ 78%) per `evaluatePrimeGates`.

## Wind

- **Source:** `daily_wind_max_mph` at **daily index 14** (target date in the 21-day archive window).
- **Caps:** ≤ 18 mph for excellent stack contribution; ≤ 26 mph for good-tier pass.

## Freshwater river — 7-day precip

- **Sum:** last **7** days of `daily_precip_in` ending at index 14 (inches).
- **Warn / fail:** sum ≥ **2.5 in** → fails prime bar until flows are verified (runoff risk).

## Coastal — tides

- **Gate:** NOAA CO-OPS predictions for the scenario’s `tide_station_id`; **≥ 2** high/low points on the fetched day counts as valid.
- Without a station id or failed fetch, **coastal** scenarios should be treated as **not prime** for expectation labeling.

## Tiers

| Tier             | Meaning |
|------------------|--------|
| `excellent_stack`| Tight pressure + wind + cloud band; coastal tides ok |
| `good_stack`     | Acceptable pressure + wind; cloud may be mid-band |
| `not_prime`      | Any hard fail (`reasons_fail` non-empty) or stack short of good |

## Using with `expect_band`

- Set **`expect_band`** on a scenario only after **`check-prime`** (or an equivalent gate pass) for that date, **or** keep the scenario as a **negative** calibration case (e.g. ice-season “expect Poor”) explicitly labeled in `notes`.
- Regression on **Good/Excellent** expectations against random archive days is often measuring **prime miss**, not broken engine modifiers.
