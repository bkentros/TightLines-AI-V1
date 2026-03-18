# SCRAP_KEEP_REFACTOR_MATRIX

## Purpose

This matrix tells the implementation agent what to:
- delete
- replace
- keep
- simplify
- archive

This rebuild is a hard reset of the engine layer and the How's Fishing report shape.

---

## Engine directories

### Delete after replacement is live
These should not remain in active use.

| path | action | reason |
|---|---|---|
| `supabase/functions/_shared/coreIntelligence` | delete / archive | obsolete first-generation engine |
| `supabase/functions/_shared/engineV2` | delete / archive | obsolete second-generation engine |
| `supabase/functions/_shared/engineV3` | delete / archive | obsolete third-generation engine |
| `supabase/functions/_shared/coreIntelligence/ENGINE_OVERHAUL_PLAN.md` | delete / archive | old engine doc inside engine tree |

### Replace with new engine tree
| path | action |
|---|---|
| `supabase/functions/_shared/howFishingEngine/*` | create new |

---

## Edge function

### Refactor in place
| path | action | notes |
|---|---|---|
| `supabase/functions/how-fishing/index.ts` | heavy refactor | keep auth/subscription/usage and request plumbing; replace engine and report shaping |
| `supabase/functions/get-environment/index.ts` | keep unless minor contract cleanup needed | preserve environment fetch infrastructure |

### Remove from the How's Fishing function
- V3 imports
- V2 type dependencies where avoidable
- legacy compatibility shaping for old report cards
- forecast-day logic if still present in backend response path
- old narration prompt assumptions about exact windows

---

## Frontend libraries

### Refactor
| path | action | notes |
|---|---|---|
| `lib/howFishing.ts` | major contract rewrite | simplify types to new report shape |
| `lib/howFishingV2.ts` | remove or collapse | obsolete once new contract is live |
| `lib/coastalProximity.ts` | keep / minor cleanup | preserve coastal eligibility rule |

### Keep
| path | action |
|---|---|
| `lib/auth.ts` | keep |
| `lib/subscription.ts` | keep |
| `lib/supabase.ts` | keep |
| `lib/env/*` | keep with only minimal request-shape adjustments if needed |
| `store/*` not tied to weekly forecast | mostly keep |

---

## Screens

### Refactor
| path | action | notes |
|---|---|---|
| `app/how-fishing.tsx` | major refactor | remove forecast strip and old result sections |
| `app/how-fishing-results.tsx` | keep as redirect stub or remove if fully unnecessary | only if route no longer needed |

### Remove or simplify related functionality
- 7-day calendar / future-day prompt behavior
- weekly forecast strip integration
- legacy multi-report tab logic

---

## Components

### Likely remove
| path | action | reason |
|---|---|---|
| `components/fishing/WeeklyForecastStrip.tsx` | remove from feature | 7-day report path removed for now |

### Likely refactor
| path | action | reason |
|---|---|---|
| `components/fishing/ReportView*` | simplify heavily | old report contract too complex |
| `components/fishing/WaterTypeTabBar*` | simplify | only current context choices; no salt/brackish split |
| `components/fishing/CondensedLoadingView` | keep if still useful | only visual, not engine-coupled |

---

## Docs

The repo currently contains many overlapping docs under:
- `docs/`
- root duplicate `root-docs/`
- engine-specific notes
- prior spec sweeps

### Action
Archive or remove old docs from the active repo surface.

### Keep only the new rebuild doc pack as the canonical active spec
Old docs to archive/remove from active surface include, at minimum:
- `docs/01_V3_MASTER_SPEC.md`
- `docs/02_IMPLEMENTATION_PLAN.md`
- `docs/03_DATA_BASELINES_SPEC.md`
- `docs/04_WEIGHTING_AND_REGIME_SPEC.md`
- `docs/05_WINDOWS_AND_NARRATION_SPEC.md`
- `docs/06_UI_UX_IMPACT_SPEC.md`
- `docs/07_TESTING_AND_ACCEPTANCE_SPEC.md`
- `docs/BASELINE_SOURCES.md`
- `docs/CORE_INTELLIGENCE_SPEC.md`
- `docs/DEBUG_AUDIT_HOWS_FISHING.md`
- `docs/ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md`
- `docs/ENGINE_REFINEMENT_SWEEP_1.md`
- `docs/ENGINE_REFINEMENT_SWEEP_2.md`
- `docs/ENGINE_REFINEMENT_SWEEP_3.md`
- `docs/ENV_API_IMPLEMENTATION_PLAN.md`
- `docs/FOUNDATION_IMPLEMENTATION_PLAN.md`
- `docs/HOWS_FISHING_IMPLEMENTATION_PLAN.md`
- `docs/PASS_1_ENGINE_REFACTOR_NOTES.md`
- `docs/PASS_5_FINAL_POLISH_NOTES.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/README.md`
- `docs/SONNET_PROMPTS.md`
- `docs/tightlines_scrap_keep_refactor_matrix.md`
- `docs/tightlines_v1_engine_api_input_contract_sheet_codebase_aligned.md`
- `docs/tightlines_v1_engine_architecture_codebase_aligned.md`
- `docs/tightlines_v1_engine_build_implementation_guide_codebase_aligned.md`
- `docs/tightlines_v1_engine_starter_config_pack_codebase_aligned.md`

Also archive/remove duplicated copies under the extracted root duplicate doc set.

### Important note
The implementation agent should not leave both the old doc pack and the new doc pack presented as current.

---

## Tests

### Remove or replace
| path | action | reason |
|---|---|---|
| `supabase/functions/_shared/coreIntelligence/__tests__/*` | remove / archive | obsolete engine |
| `supabase/functions/_shared/engineV2/__tests__/*` | remove / archive | obsolete engine |
| `supabase/functions/_shared/engineV3/__tests__/*` | remove / archive | obsolete engine |

### Add
Create a new focused test suite for:
- normalization
- scoring
- temperature tables
- reweighting
- report shaping
- UI acceptance smoke checks

---

## Preserve infrastructure

The following are not part of the engine reset and should remain unless minor interface cleanup is needed:

- auth stores and auth flow
- subscription / gating flow
- Supabase clients
- environment fetch integrations
- app shell / navigation
- non-How's-Fishing feature screens unrelated to this rebuild
