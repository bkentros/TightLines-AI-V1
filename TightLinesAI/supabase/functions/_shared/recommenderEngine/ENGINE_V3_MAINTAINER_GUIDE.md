# Recommender Engine V3 Maintainer Guide

## Core Model

V3 is intentionally deterministic and layered:

1. `resolveSeasonalRowV3()` defines the monthly biological world.
2. `resolveDailyPayloadV3()` converts daily conditions into bounded tactical shifts.
3. `resolveFinalProfileV3()` clamps those shifts inside the monthly baseline.
4. `scoreCandidates.ts` ranks only the seasonal pool.
5. `topThreeSelection.ts` turns ranked candidates into a coherent opportunity mix.
6. `recommendationCopy.ts` generates `why_chosen` and `how_to_fish`.

The engine should be improved, not rewritten away from this shape.

## Source Of Truth

- Seasonal biology lives in `v3/seasonal/*.ts`.
- Catalog archetype traits live in `v3/candidates/lures.ts` and `v3/candidates/flies.ts`.
- Species aliases and scope rules live in `v3/scope.ts`.
- Shared conditions plumbing lives in `sharedAnalysis.ts`.

## Guardrails

- Monthly eligibility is the hard world. Daily conditions must not resurrect out-of-pool archetypes.
- Seasonal validation in `v3/seasonal/validateSeasonalRow.ts` stays broad enough to preserve legitimate backup/control lanes in authored rows.
- Runtime scoring applies stricter lane pressure through `archetypeFitsStrictMonthlyBaselineLanes()` so biologically cleaner fits win more often without breaking authored rows.
- Region fallbacks are a product-completeness tool, not a biology claim. Use `seasonal_source_region_key` and `used_region_fallback` when debugging or auditing.

## When Tuning

Tune in this order:

1. Seasonal pools and monthly baseline shape.
2. Species gating in catalogs when an archetype is truly species-specific.
3. Daily tactical shifts and practicality scoring.
4. Top-3 variety/coherence rules.
5. Recommendation copy.

If a row feels wrong, fix the seasonal row before increasing daily weight.

## Tests And Audits

- Fast engine regression tests live in `__tests__/`.
- Coverage and audit scripts live in `scripts/recommender-v3-audit/`.
- Prefer adding focused tests for:
  - scope/species aliasing
  - fallback provenance
  - seasonal pool integrity
  - top-3 coherence
  - deterministic output text

## Practical Rule

If a change makes the engine more "interesting" but less explainable, less bounded, or less species/month sensible, reject it.
