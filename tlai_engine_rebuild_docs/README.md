# TightLines AI Engine Rebuild Doc Pack

Read these in this order:

1. `ENGINE_REBUILD_MASTER_PLAN.md`
2. `TEMPERATURE_AND_MODIFIER_REFERENCE.md`
3. `VARIABLE_THRESHOLDS_AND_SCORING_SPEC.md`
4. `HOWS_FISHING_REPORT_AND_NARRATION_SPEC.md`
5. `UI_UX_REBUILD_SPEC.md`
6. `SCRAP_KEEP_REFACTOR_MATRIX.md`
7. `IMPLEMENTATION_TASK_PLAN.md`
8. `TESTING_AND_ACCEPTANCE_PLAN.md`

## Purpose

This pack replaces the repo's older overlapping engine documents with one clean implementation set for the new, simplified engine and How's Fishing rebuild.

## Important execution rules

- The new engine is a hard reset of the old engine layer.
- Old engine generations are not to remain in active code paths.
- The app must still keep existing non-engine infrastructure:
  - auth
  - subscriptions / usage caps
  - Supabase app structure
  - API integrations
  - app shell / navigation
- The feature scope for this rebuild is:
  - shared condition normalization layer
  - simplified How's Fishing feature
  - simplified How's Fishing UI
- Out of scope for this rebuild:
  - lure / fly recommender implementation
  - water reader implementation
  - 7-day calendar / forecast reports
  - exact hourly window engine
  - separate brackish report tab

## Deliverable expectation for the implementation agent

The implementation agent should:
- read the master plan first
- use the matrix to remove old code and docs cleanly
- build the new shared layer and simplified How's Fishing path
- simplify frontend contracts and UI to match the new output
- run the testing plan before marking the rebuild complete

## Source-of-truth rule

These docs are the canonical V1 source of truth for the rebuild. The implementation agent should not browse for alternate engine logic or invent new scoring behavior unless a document explicitly says to do so. Web use is optional only for framework syntax, library usage, or implementation mechanics unrelated to the engine rules themselves.
