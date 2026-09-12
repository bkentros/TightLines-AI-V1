# Phase 1 annual seasonal calibration validation — 2026-09-12

## Completed configuration

- All 45 city × species pairings have a Phase 1 disposition: 16 accepted annual research curves and 29 whole-pair deferrals. This supersedes the previous 15 partial-season proposals.
- Accepted additions: Ludington 3, Grand Haven 6, Manistee 7, Frankfort–Elberta 0, Sheboygan 0. The latter two still retain the completed four core species. Deferral does not establish ecological absence.
- 192 documented anchors interpolate continuously on actual calendar dates, including December–January and leap day. Every accepted pairing receives a value on every date; no bounded seasonal availability mechanism is needed.
- The 2025 projections contain 16,425 daily rows (5,840 numeric; 10,585 deferred), 2,340 weekly rows (832 numeric; 1,508 deferred), and 540 monthly rows (192 numeric; 348 deferred).
- `additionalSeasonalResearch.generated.ts` contains the 16 provisional curves for Phase 2. It is deliberately detached from runtime city assembly. Original runtime eligibility, core seasonal curves, core weekly ratings, thermal profiles, scoring formula and public gates remain unchanged.
- Eleven additional agency/study records document annual habitat mechanisms and contradictions. Nine raw snapshots have checked hashes; two DNR pages were reviewed in full through the web reader but denied direct downloads, recorded in `annual-download-limitations.json`. The earlier 18-source Phase 1 supplement and original 74-source register remain preserved.
- The 45-pair report recomputes all 12 months of modern/recent Pier/Dock recurrence and total-mode catch ratios from preserved Michigan estimates. Lake-trout inspection explicitly uses the Lean component, avoiding a zero assumption for missing Fat components.

## Verification

- `npm run qa:pier-cast:foundation`: **122 passed, zero failed**. Two added tests compare all 16 curves against the actual runtime evaluator on every date in 2024–2026 and verify that detached research curves neither activate city species nor bypass public calibration approval.
- `npx tsc --noEmit`: passed.
- `npm run check:pier-cast:remaining-seasonal`: six tests passed, including annual interpolation, leap dates, whole-pair deferrals, city-specific seasonal ordering, overlapping peaks, evidence/calendar/scope/release corruption, source hashes and generated-artifact consistency. Report regeneration checked.
- `npm run check:pier-cast:remaining-species`: four evidence tests and the original evidence/configuration artifact checks passed.
- `npm run check:pier-cast:seasonal-replay`: completed-core replay artifacts current. Its correlations do not validate the new curves.

## Scientific interpretation

Phase 1 configuration and evidence synthesis are complete. The numbers are provisional ordinal calibration judgments, not measured catch probabilities, DNR ratings or empirically validated weekly coefficients. Local catch recurrence and dated pier reports establish the stronger seasons; transferred habitat studies inform low-confidence weak-season direction only after local admission. Missing survey observations remain missing data and are never relabeled as zero catches.

Winter and some shoulder magnitudes lack local directed-effort validation. Current lawful-method lake-whitefish strength at Grand Haven remains particularly uncertain; the limited November judgment does not use historical snagging harvest or an invented correction factor. Several pairings retain covered-side attribution limitations that must be addressed before runtime activation. The report and per-anchor metadata preserve these distinctions.

Phase 2 owns species thermal profiles and runtime structure/method eligibility. Phase 3 owns the joint annual lineup and empirical validation review. Neither phase may turn temperature tolerance, occupancy, spawning or growth into an unsupported bite-probability claim, or weaken public scientific gates.

## Deployment

No runtime assembly, endpoint behavior or database schema changed. The new TypeScript module is research-only, so no migration or edge-function deployment is required for Phase 1. Prior deployment reconciliation is documented in `VALIDATION.md`; this pass does not claim a new production verification.
