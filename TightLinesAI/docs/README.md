# TightLines AI V3 Engine Renovation Docs

This folder contains the Markdown handoff documents for the TightLines AI V3 engine renovation.

These documents are designed to be given to another implementation agent one phase at a time. The implementation agent should not improvise architecture beyond what is defined here. If a detail is unclear, the agent should preserve existing working behavior and leave a documented TODO rather than inventing new engine logic.

## Use order

Read and hand off the documents in this order:

1. `01_V3_MASTER_SPEC.md`
2. `02_IMPLEMENTATION_PLAN.md`
3. `03_DATA_BASELINES_SPEC.md`
4. `04_WEIGHTING_AND_REGIME_SPEC.md`
5. `05_WINDOWS_AND_NARRATION_SPEC.md`
6. `06_UI_UX_IMPACT_SPEC.md`
7. `07_TESTING_AND_ACCEPTANCE_SPEC.md`

## Phase 2 reference

- `BASELINE_SOURCES.md` — documents data sources and methodology for the V3 baseline layer (air temp, precip, freshwater, coastal).

## Workflow rules

- Implement one phase at a time.
- Do not begin the next phase until the current phase has been reviewed.
- Preserve the app's current working flow unless a document explicitly says to remove or replace it.
- Do not reintroduce manual freshwater temperature anywhere.
- Do not allow inferred freshwater water temperature to drive the headline score.
- Do not create a new species-specific engine during this renovation.
- Do not replace missing measured score inputs with guessed values.

## V3 non-negotiables

- The deterministic engine remains the source of truth.
- The LLM only narrates approved structured outputs.
- The headline score must be based only on measured variables that are actually present.
- Historical baselines are for comparison, context, and narration support.
- Region is the rule layer. State is the numeric baseline lookup layer.
- The engine must dynamically reweight when eligible variables are missing.
- The engine must expose confidence/data-coverage effects honestly.
- Lake, river, brackish, and saltwater narration must remain separate.

## Current codebase anchor points

The renovation must be built around the current app structure:

- Frontend flow: `app/how-fishing.tsx`
- Environment fetch/orchestration: `supabase/functions/get-environment/index.ts`
- Report orchestration: `supabase/functions/how-fishing/index.ts`
- Daily path engine: `supabase/functions/_shared/engineV3/` (engineV2 retained for golden-fixtures tests)
- Current report rendering shell: `components/fishing/ReportView.tsx`

## Existing 7 regions to preserve as the rule layer

- `northeast`
- `great_lakes_upper_midwest`
- `mid_atlantic`
- `southeast_atlantic`
- `gulf_florida`
- `interior_south_plains`
- `west_southwest`

## What these docs are meant to prevent

These docs are intentionally detailed so the implementation agent does not:

- partially remove the old engine while leaving hidden dependencies behind
- accidentally keep inferred freshwater temperature in scoring
- collapse all narration into one generic report style
- misuse historical baselines as fake measured inputs
- add weights that are not traceable or testable
- leave the UI communicating more certainty than the engine actually has
