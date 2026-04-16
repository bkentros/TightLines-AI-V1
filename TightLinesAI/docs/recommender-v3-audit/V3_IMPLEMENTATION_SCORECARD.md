# V3 Implementation Scorecard

This document locks Phase 1 scope for the freshwater V3 recommender audit.

**Current status:** All four freshwater species are **matrix-clean** at the unified audit baseline; see [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md) for numbers, maintainer philosophy, and scoring-exception registry. Rerun commands: [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md). Reading coverage vs matrix output: [V3_AUDIT_INTERPRETATION.md](./V3_AUDIT_INTERPRETATION.md).

## Scope

- Daily conditions must materially change recommendations in a biologically
  coherent way.
- Every lure and fly in the library must have an intentional role.
- Specialty baits and flies must have narrow but real winning windows where
  appropriate.
- Top-3 diversity must stay tactically coherent.
- Audit output must expose dead archetypes, sticky rows, and intended-vs-actual
  gaps.

## Role Definitions

- `winner_capable`: should legitimately win rank 1 in at least one intended
  scenario.
- `top3_support`: should make the top 3 in intended scenarios, but is not
  required to own rank 1.
- `intentional_low_frequency_specialty`: narrow-context tool that should appear
  rarely, but only in biologically credible windows.

## Success Targets

- `locked_top1_ratio_max`: lures `0.50`, flies `0.55`
- `low_daily_sensitivity_ratio_max`: lures `0.45`, flies `0.50`
- `tactical_conflict_rate_max`: lures `0.02`, flies `0.02`
- `expectation_mismatches_max`: lures `0`, flies `0`
- `never_viable_max`: lures `0`, flies `0`
- `never_top3_max`: lures `0`, flies `0`

## Source Of Truth

- Full archetype intent and reach targets live in
  [archetypeExpectations.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/scripts/recommender-v3-audit/archetypeExpectations.ts).
- The generated audit report compares actual recommender behavior against that
  contract in
  [v3-coverage-audit.md](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/docs/recommender-v3-audit/generated/v3-coverage-audit.md).
