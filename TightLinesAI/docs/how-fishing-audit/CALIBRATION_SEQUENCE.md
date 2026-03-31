# Calibration sequence (accuracy → reliability → credibility)

> Archived note: the older `scripts/how-fishing-audit/*` E2E/LLM workflow has been removed.
> The current deterministic audit entry point is `scripts/audit/run-full-audit.ts`
> via `npm run audit:how-fishing:march-august` or `npm run audit:how-fishing:remaining`.

Recommended order of work so changes are measurable and hard to “fake” with cherry-picked dates.

## 1. Ground truth and contracts (accuracy foundations)

1. **Weather contract parity** — Archive/`get-environment` must agree on MSL pressure history, daily indices (target at 14), and hourly-to-local day bucketing. Any mismatch makes scores untestable.
2. **Prime gating** — Before tuning modifiers, run `check-prime.ts` (or equivalent) on scenarios that claim **Good+** stacks. Drop or relabel dates that fail `evaluatePrimeGates()`.
3. **Explicit regions in audit** — Use `altitude_ft` on `env_data` and `region_key` override in Part B / `--audit-bundle` live runs so each row tests the **intended** region, not an accidental auto-resolve.

## 2. Engine behavior (accuracy)

4. **Synthetic sweep (Part A)** — `alpine-norCal-sweep.ts` mood monotonicity across regions/months/contexts catches global calibration drift cheaply.
5. **Targeted real-weather (Part B)** — Shared list `auditScenarios.ts`; align `expect_band` with prime gates and seasonal intent (`notes`).
6. **Live archive runner** — `run-live-audit.ts` with `--audit-bundle` reproduces Part B against Open-Meteo archive + optional USNO/NOAA aux for cross-checks.

## 3. Reliability (when the score is trustworthy)

7. **Coverage flags** — Prefer scenarios with full hourly day coverage and river `precip_7d` when testing runoff; watch `report.reliability` and `data_coverage` source notes.
8. **Edge buckets** — Volatile pressure, extreme wind, and glare/LCD cloud bands should land in **Fair/Poor** or **low** reliability, not Excellent.

## 4. Credibility (product narrative)

9. **Driver alignment** — Inspect `drivers` / `suppressors` on audited rows; tips and dayparts should follow the top normalized drivers, not fight them.
10. **User-visible copy** — After numeric calibration, adjust narration presets only with reference to the same JSONL audits so language matches behavior.

## Feedback loop

- **Tight loop:** Part A after every structural change to normalization or weights.
- **Slower loop:** Part B subset (10–15 scenarios) after regional or context tweaks.
- **Full loop:** `--audit-bundle` live run before releases; record JSONL and diff bands/scores vs baseline.

This ordering prioritizes **correct inputs and labels** first, then **score quality**, then **trust signals**, then **wording**—so later steps cannot mask broken weather or prime assumptions.
