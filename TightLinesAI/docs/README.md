# TightLines AI — docs

## Canonical engine / How’s Fishing specs

**Source of truth:** repository root **`tlai_engine_rebuild_docs/`** (ENGINE_REBUILD_MASTER_PLAN, VARIABLE_THRESHOLDS_AND_SCORING_SPEC, HOWS_FISHING_REPORT_AND_NARRATION_SPEC, UI_UX_REBUILD_SPEC, IMPLEMENTATION_TASK_PLAN, TESTING_AND_ACCEPTANCE_PLAN, etc.).

Do not treat archived copies under `_archive_legacy_engine/` as active guidance.

## This folder

- **`ENV_API_IMPLEMENTATION_PLAN.md`** — environment API / client plumbing (still relevant where not superseded by rebuild docs).
- **`_archive_legacy_engine/`** — pre-rebuild V3 specs, old engine architecture notes, and duplicate planning docs (archived Mar 2025).

## Code anchors (rebuild)

- How’s Fishing UI: `app/how-fishing.tsx`
- Engine: `supabase/functions/_shared/howFishingEngine/`
- Edge: `supabase/functions/how-fishing/index.ts`
- Legacy engines (`coreIntelligence`, `engineV2`, `engineV3`): see each folder’s `LEGACY_README.md`
