# Today's Bite Production Tuning Handoff

Last updated: 2026-05-14

Final status: production-ready after scoring and timing tuning.

This document is the final handoff for FinFindr / TightLinesAI deterministic
Today's Bite / How's Fishing production tuning. It reflects the completed
production state after the score-curve/boundary patch, guarded timing
priority-ladder patch, deterministic report-copy polish, stale-code cleanup,
post-patch readiness audits, and final hardening pass.

## Product Scope

Today's Bite is a deterministic daily fishing conditions read. It must work
across:

- all supported canonical regions
- all 12 months
- `freshwater_lake_pond`
- `freshwater_river`
- `coastal`
- `coastal_flats_estuary`
- forecast offsets `0..6`

Lake/pond and river remain the highest priority. Coastal and flats/estuary
remain protected, especially measured water temperature and tide/current timing.

## Non-Negotiables

- Keep the engine deterministic and explainable.
- Do not hide uncertainty. Missing data must lower reliability or omit
  variables, not invent zeros.
- Do not edit recommender production logic/catalog/gates/scoring/tags/pick
  selection without explicit approval.
- Today's Bite report, dashboard score chips, score-only calls, and forecast-day
  reports must stay aligned.
- Future-day reports must use target-day forecast snapshot materialization, not
  current live weather.
- Current measured coastal water temperature may only apply to day-0/today
  snapshots, not future forecast days.
- Broad interpolation is still not production-wired.

## Final Scoring Patch Summary

Production scoring is wired and passed post-patch readiness.

Final readiness metrics from
`scripts/audit/todays-bite-post-patch-readiness-audit.md`:

- Result: `PASS`
- Complete-data score range: `10-95`
- Lake max: `95`
- River max: `94`
- Complete-data counts: `>=80 30562`, `>=85 18312`, `>=90 14924`, `>=95 2674`,
  `=100 0`
- Production-style `>=95`: `0`
- Production-style max score: `94`
- Missing/partial `>=80`: `0`
- Low-reliability `>=80`: `0`
- Ordinary-good `>=80`: `0`
- Strong `>=90`: `0`
- Catastrophic `>30`: `0`
- `light_mist_dry_baseline` max / `>=90` / `>=95`: `94 / 3514 / 0`
- Max actual tiny-input final-score cliff: `3`
- Gulf measured-water Oct/Nov 74F focus cliff: `3.667 -> 0`
- Complete-data `>=95` rows are all `calibration_super_elite` lake/pond rows.

Production scoring behavior now includes:

- Gulf measured-water Oct/Nov transition rows for Gulf-mapped focus regions.
- Continuity/taper fixes for pressure, wind, and tide/current thresholds.
- Numeric/tapered precipitation final cap:
  - score `<= -1.1` caps at `55`
  - score `-1.1..-0.45` smoothly tapers `55..65`
- Freshwater relative elite gate and rare upper-9 gate using
  production-observable conditions only.
- Missing/partial cap `64`.
- Low-reliability cap `72`.

River-only `+1` remains a shadow idea only. It was not production-wired.

## Final Timing Patch Summary

Production timing is wired to the guarded priority ladder and passed post-patch
readiness.

Final readiness metrics from
`scripts/audit/todays-bite-timing-post-patch-readiness-audit.md`:

- Result: `PASS`
- Rows compared: `90720`
- Fallback used: `15505` versus `36112` baseline
- Broad/all-day flags: `0`
- Heat attribution flags: `0`
- Coastal moving-tide fallback flags: `0`
- Winter flats moving-tide fallback rows: `0`
- Freshwater hot rows anchored on `avoid_heat`: `6048/6048`
- Cold-warming non-coastal rows anchored on `seek_warmth`: `3024/3024`
- Cold-warming misses: `0`
- Month-boundary driver changes: `296`
- Month-boundary period changes: `732`
- Tide timing without real same-day tide events: `0`
- Forecast offset coverage: `0..6`, `12960` rows each, missing mean-temp
  snapshots `0`

Production priority ladder:

- Freshwater lake/pond and river:
  - `avoid_heat`
  - `seek_warmth`
  - shaped `light_window`
  - fallback
- Coastal:
  - real same-day tide/current clock
  - `avoid_heat` only when no usable tide clock qualifies
  - fallback
- Coastal flats/estuary:
  - real same-day tide/current clock
  - `avoid_heat`
  - `seek_warmth`
  - shaped `light_window`
  - fallback

Guardrails:

- `light_window` can act as a priority anchor only when it highlights 1-2
  dayparts.
- `cloud_all_day` / all-period light cannot become a generic priority anchor.
- Tide timing is never invented without real same-day tide events.
- If tide qualifies and heat also qualifies, production keeps the real tide
  anchor and records heat caution in trace/reason.
- Timing debug trace now reports selected non-primary signals in secondary
  fields.
- Final narrow cold-warming fix handles physically cold winter freshwater rows
  where region/month temperature tables label the low edge as
  `near_optimal`/`optimal`, but actual air temp is `<=32F`, band score is not
  positive, and there is a real warming signal.

## Recommender Protection

Recommender production paths remain protected.

Scoring readiness recommender impact:

- Attempted / valid / unsupported / errors: `54432 / 48384 / 6048 / 0`
- Signature / thermal / activity / surface / tags / unexpected:
  `0 / 0 / 5404 / 0 / 0 / 0`
- Impact classification: activity-tier only.

No recommender production logic/catalog/gates/scoring/tags/pick selection files
were changed during the scoring or timing production patches.

## Report Surface Cleanup

Today's Bite report copy is deterministic and no longer routes through the old
generative polish scaffolding.

- Paid factor rows use condition-specific labels while keeping `variable`
  available for UI category eyebrows.
- `GUIDE NOTE` was renamed to `FIELD STRATEGY`.
- Field Strategy stays on the legacy `actionable_tip` wire field for
  compatibility, but production now emits `strategy_*` Field Strategy tags.
- Legacy `presentation_*` tag aliases remain accepted only for old cached client
  bundles.
- Free summaries include concise data-limited caveats on low-reliability rows.
- Tackle Box remains the only owner of tackle specifics.

Retired stale code:

- the old shared generative polish package
- old narration payload / tip-focus helpers
- `supabase/functions/_shared/howFishingEngine/contracts/narration.ts`

## Forecast Snapshot Protection

Forecast snapshot behavior was preserved.

- Scoring readiness covered forecast offsets `0..6` with `15552` rows each.
- Timing readiness covered forecast offsets `0..6` with `12960` rows each.
- Request/environment snapshots are persisted in JSONL audit rows by
  `forecast_offset`.
- `buildNormalized.ts` is unchanged.
- Production forecast day `0..6` snapshot code was not edited.

## Interpolation Status

Interpolation is still not production-wired.

Continuity was achieved with targeted static table/taper changes and guarded
timing priority logic:

- Gulf measured-water Oct/Nov table continuity is static, not runtime
  interpolation.
- Pressure/wind/tide/current continuity uses targeted taper formulas.
- Precipitation cap continuity uses numeric/tapered final cap logic.
- Timing month-boundary behavior was improved with priority selection, not month
  interpolation.

## Final Validation

Latest final hardening validation passed:

```bash
deno fmt supabase/functions/_shared/howFishingEngine/timing/resolveTimingResult.ts supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/timingHeatMatrix.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/scoreDeterminism.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/forecastScoresEngineParity.test.ts
deno run --allow-read --allow-write scripts/audit/run-todays-bite-post-patch-readiness-audit.ts
deno run --allow-read --allow-write scripts/audit/run-todays-bite-timing-post-patch-readiness-audit.ts
git diff --name-only
```

Observed final pass:

- `rebuildEngine.test.ts`: `143 passed | 0 failed`
- `timingHeatMatrix.test.ts`: `1 passed | 0 failed`
- `scoreDeterminism.test.ts`: `2 passed | 0 failed`
- `forecastScoresEngineParity.test.ts`: `3 passed | 0 failed`
- Scoring readiness: `PASS`
- Timing readiness: `PASS`
- Protected recommender diff: empty
- Protected `buildNormalized.ts` diff: empty

## Known Residual Risks

- River max remains `94`; lake/pond reaches `95`.
- Unrelated pre-existing app/package diffs remain in the worktree and should be
  reviewed separately.
- Large JSONL audit artifacts are ignored and should be regenerated locally when
  needed.
- Recommender score impact is activity-tier only, but downstream UI/product
  expectations around activity wording should still be sanity-checked.

## Files To Review For Commit

Production scoring files:

- `supabase/functions/_shared/howFishingEngine/config/tempBandsCoastalWater.ts`
- `supabase/functions/_shared/howFishingEngine/config/freshwaterEliteEnvelopes.ts`
- `supabase/functions/_shared/howFishingEngine/normalize/normalizePressure.ts`
- `supabase/functions/_shared/howFishingEngine/normalize/normalizeWind.ts`
- `supabase/functions/_shared/howFishingEngine/normalize/normalizeTide.ts`
- `supabase/functions/_shared/howFishingEngine/score/scoreDay.ts`

Production timing file:

- `supabase/functions/_shared/howFishingEngine/timing/resolveTimingResult.ts`
- `supabase/functions/_shared/howFishingEngine/timing/evaluators/evaluateTemperatureWindow.ts`

Focused tests:

- `supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts`
- `supabase/functions/_shared/howFishingEngine/__tests__/polishSafeSurfaceCopy.test.ts`
- `supabase/functions/_shared/howFishingEngine/__tests__/scoreDeterminism.test.ts`
- `supabase/functions/_shared/howFishingEngine/__tests__/forecastScoresEngineParity.test.ts`

Report surface and cleanup files:

- `supabase/functions/_shared/howFishingEngine/README.md`
- `supabase/functions/_shared/howFishingEngine/contracts/tipsDaypart.ts`
- `supabase/functions/_shared/howFishingEngine/contracts/mod.ts`
- `supabase/functions/_shared/howFishingEngine/index.ts`
- `supabase/functions/_shared/howFishingEngine/summary/summaryLine.ts`
- `supabase/functions/_shared/howFishingEngine/summary/factorSurfaceLabels.ts`
- `supabase/functions/_shared/howFishingEngine/tips/buildTips.ts`
- `supabase/functions/_shared/howFishingEngine/narration/polishSafeSurfaceCopy.ts`
- `supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts`
- `supabase/functions/how-fishing/index.ts`
- `components/fishing/RebuildReportView.tsx`
- `components/fishing/HowFishingLoadingSkeleton.tsx`
- `lib/howFishingRebuildContracts.ts`

Final readiness audit scripts:

- `scripts/audit/run-todays-bite-post-patch-readiness-audit.ts`
- `scripts/audit/run-todays-bite-timing-post-patch-readiness-audit.ts`
- `scripts/audit/run-todays-bite-report-copy-baseline-audit.ts`

Final readiness markdown:

- `scripts/audit/todays-bite-post-patch-readiness-audit.md`
- `scripts/audit/todays-bite-timing-post-patch-readiness-audit.md`
- `scripts/audit/todays-bite-report-copy-baseline-audit.md`
- `scripts/audit/todays-bite-final-production-readiness-summary.md`

Intermediate untracked shadow/candidate audit scripts and markdown were removed
from the final handoff set. Regenerate historical shadow investigations locally
if needed.

Generated/ignored artifacts:

- `scripts/audit/todays-bite-*.jsonl`

## Release Recommendation

Proceed with production patch review for Today's Bite scoring and timing.

Do not include unrelated app/package diffs in this release unless separately
reviewed. Do not include recommender production changes. Do not wire
interpolation.
