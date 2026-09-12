# Phase 1 seasonal research validation — 2026-09-12

## Saved work

- 45 city × species decisions retained separately from candidate admission and runtime eligibility.
- 15 bounded provisional numeric proposals; ten additional research candidates and 20 weaker/non-established pairings remain numerically unresolved.
- 16,425 daily rows, 2,340 weekly rows and 540 monthly rows. There are 1,377 proposed numeric species-days and 15,048 unavailable species-days in the 2025 projection. These counts include all 45 combinations; they are not counts of calendar days without fishing opportunities.
- 17 additional Michigan DNR bulletins and one NOAA-hosted primary historical study preserved with hashes, dates, modes, geographic scope and limitations. The NOAA study's relevant scanned pages were visually checked after OCR.
- Full 45-pair report recomputes modern/recent recurrence and total-mode catch ratios from the preserved primary Michigan snapshots. Lake-trout inspection uses the Lean component explicitly, avoiding an assumed zero for missing Fat components.

## Checks

- `npm run qa:pier-cast:foundation`: 120 passed, zero failed.
- `npx tsc --noEmit`: passed.
- `npm run check:pier-cast:remaining-species`: four evidence tests and existing generated-artifact checks passed.
- `npm run check:pier-cast:seasonal-replay`: completed-core replay artifacts current. This is not validation of the new proposals.
- `npm run check:pier-cast:remaining-seasonal`: six tests cover bounded interpolation, gaps, leap years, scope/release rejection, evidence identity, full-date bounds and generated-artifact consistency; report regeneration checked.
- Existing four-species curves, weekly ratings, runtime configuration, temperature profiles and public-release gates unchanged.

## Deployment decision

No schema, edge-function or runtime configuration change is included. No migration or deployment is required. Prior deployed functions and migration reconciliation are documented in `VALIDATION.md`; this pass does not claim a new production verification.

## Scientific limits

Software checks do not establish measured weekly accuracy. Proposed values are explicit product calibration judgments in the existing rubric; evidence generally resolves broad months, not exact arrival dates or half-point differences. No curve has a supported numeric January–December profile. Several proposed pairings still need exact covered-side attribution before Phase 2 runtime eligibility. Grand Haven lake whitefish requires current lawful-method magnitude evidence; historical snagging harvest cannot be repaired with an invented discount.

The Phase 1 research package is preserved and reproducible, but high-confidence annual numerical coverage remains incomplete. Do not describe null dates as absent fish, mark these species production-ready, enable public ratings, or silently interpolate through gaps.
