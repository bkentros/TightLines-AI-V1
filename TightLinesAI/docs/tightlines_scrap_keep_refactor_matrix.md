# TightLines AI — Scrap / Keep / Refactor Matrix

This matrix is based on the uploaded codebase and is intended to remove ambiguity before rebuilding the engine.

## Core decision

**The app shell stays. The engine is rebuilt.**

That means:
- Keep the existing mobile app, Supabase plumbing, auth, subscription flow, environment fetching, and most presentation components.
- Remove or replace the current deterministic fishing-logic layer wherever it conflicts with the new architecture.
- Stop generating multiple reports for multiple plausible water contexts. The new engine must run on **one confirmed context** selected before report generation:
  - `freshwater_lake`
  - `freshwater_river`
  - `brackish`
  - `saltwater`

---

## 1) Delete entirely

These files or patterns should be removed from the active project, not migrated.

| Path / group | Action | Why |
|---|---|---|
| `/App.tsx`, `/app/*`, `/assets/*`, `/package.json`, `/package-lock.json`, `/tsconfig.json`, `/index.ts`, `/app.json`, `/eas.json` at the **zip root** | Delete / archive outside active app | The real working app is inside `/TightLinesAI`. The root-level Expo scaffold is duplicate/noise and will confuse future implementation. |
| `/core_intelligence_spec.md`, `/hows_fishing_feature_spec.md`, `/fishing_recommender_spec.md`, `/archived_live_conditions_spec.md`, `/FOUNDATION_NOTES.md`, `/TightLines_AI_V1_Spec.md` at the **zip root** | Archive | Historical planning docs. Keep outside active code repo if you want history, but do not let them guide implementation over the new docs. |
| `TightLinesAI/app/how-fishing-results.tsx` | Delete after routing is cleaned up | It is only a redirect stub and keeps an old mental model alive. Results should remain inline or route to a new single-context results screen later. |
| `TightLinesAI/store/devTestingStore.ts` | Delete unless you actively use it for current QA | Not part of the new engine architecture. Keeping dead debug paths increases confusion. |
| `TightLinesAI/docs/ENGINE_REFINEMENT_SWEEP_1.md` through `_3.md`, `PASS_*`, `DEBUG_AUDIT_HOWS_FISHING.md`, `ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md`, `FOUNDATION_IMPLEMENTATION_PLAN.md`, `HOWS_FISHING_IMPLEMENTATION_PLAN.md`, `CORE_INTELLIGENCE_SPEC.md`, `INTELLIGENCE_ENGINE_OVERVIEW.md` | Archive | These reflect the old engine evolution. Useful for history only. The new markdown set replaces them. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/ENGINE_OVERHAUL_PLAN.md` | Archive | Superseded by the new engine docs. |
| Any backend/client code path that expects `mode: 'coastal_multi'` or 3 simultaneous context reports as the primary flow | Delete as behavior during refactor | The new engine requires one confirmed context before report generation. |

---

## 2) Keep as-is

These should remain and do not need architectural replacement.

| Path / group | Action | Notes |
|---|---|---|
| `TightLinesAI/app/(auth)/*` | Keep | Auth flow is unrelated to engine redesign. |
| `TightLinesAI/app/(onboarding)/*` | Keep, minor copy changes later if needed | Only update if onboarding needs to explain context selection. |
| `TightLinesAI/app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/log.tsx`, `app/(tabs)/settings.tsx` | Keep | App shell/navigation survives. |
| `TightLinesAI/app/subscribe.tsx`, `app/new-entry.tsx`, `app/log-detail.tsx`, `app/personal-bests.tsx` | Keep | Not part of engine replacement. |
| `TightLinesAI/lib/auth.ts`, `lib/subscription.ts`, `lib/supabase.ts`, `lib/theme.ts`, `lib/types.ts` | Keep | Foundational app infrastructure. |
| `TightLinesAI/store/authStore.ts` | Keep | Auth state only. |
| `TightLinesAI/components/Select.tsx`, `components/SubscribePrompt.tsx` | Keep | Generic UI. |
| `TightLinesAI/ios/*`, `patches/*`, app config files inside `TightLinesAI` | Keep | Platform/build infrastructure. |
| `TightLinesAI/supabase/functions/get-environment/index.ts` | Keep as primary environmental data pipeline, but extend contract as needed | This is valuable existing infrastructure and should remain the source pipeline. |
| `TightLinesAI/lib/env/*` | Keep as client-side env fetch/cache layer, with contract adjustments only | Good plumbing to preserve. |
| `TightLinesAI/store/envStore.ts` | Keep | Useful for current env state. |

---

## 3) Keep but rewire

These are useful, but they must be changed to fit the new engine.

| Path / group | Action | What changes |
|---|---|---|
| `TightLinesAI/app/how-fishing.tsx` | Keep but heavily refactor | This screen should become the setup + generate screen for the **single confirmed context** flow. The current mixed coastal/inland multi-report assumptions need to be removed. |
| `TightLinesAI/components/LiveConditionsWidget.tsx` | Keep but refactor | Align with new setup order: water type first, then valid body type options, then optional freshwater temp. |
| `TightLinesAI/components/fishing/*` | Keep selectively but rewire to new payloads | These are useful presentation components, but they must render one confirmed-context report, new score philosophy, confidence, and new labels. |
| `TightLinesAI/store/forecastStore.ts` | Keep but refactor | Weekly forecast must key off one confirmed context, not old auto/multi assumptions. |
| `TightLinesAI/lib/howFishing.ts` | Keep but rewrite contracts/types | It currently mirrors the old bundle shape with `coastal_multi` / `inland_dual` assumptions. Convert it to the new single-context request/response and cache contracts. |
| `TightLinesAI/app/recommender.tsx` | Keep as app surface only | Do not let it depend on the old engine types. Later it should consume the new engine output. |
| `TightLinesAI/app/water-reader.tsx` | Keep as app surface only | Same rule as recommender. |
| `TightLinesAI/supabase/functions/how-fishing/index.ts` | Keep endpoint, rewrite internals | Preserve the endpoint route, auth/subscription checks, usage logging, and LLM orchestration pattern. Replace the engine orchestration and report-mode assumptions. |
| `TightLinesAI/supabase/functions/_shared/envAdapter.ts` | Keep but refactor | Good boundary file. Update it to feed the new engine input contract and context object. |

---

## 4) Replace with new engine modules

These files represent the current deterministic logic layer and should be replaced module-by-module by the new architecture. Do not preserve their scoring assumptions as truth.

| Existing path | Action | Replacement direction |
|---|---|---|
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/index.ts` | Replace | New engine entrypoint around context resolution → normalization/inference → reliability → assessments → behavior → windows → score → feature output. |
| `.../coreIntelligence/types.ts` | Replace | New canonical engine types from the new docs. |
| `.../coreIntelligence/derivedVariables.ts` | Replace | Fold into new normalization/inference + contextual response-curve system. |
| `.../coreIntelligence/scoreEngine.ts` | Replace | New score philosophy: catch opportunity, contextual variable curves, explicit asymmetry, confidence-aware outputs. |
| `.../coreIntelligence/contextModifiers.ts` | Replace | New context resolution layer with region + water type + environment mode + seasonal-state handling. |
| `.../coreIntelligence/seasonalProfiles.ts` | Replace | New region model and seasonal-state config system from starter pack / handbook. |
| `.../coreIntelligence/fishBiology.ts` | Replace | Recast into new behavior engine and seasonal-state interpretation, not fixed old biology tables. |
| `.../coreIntelligence/behaviorInference.ts` | Replace | New behavior module fed by assessments, not legacy score shortcuts. |
| `.../coreIntelligence/timeWindowEngine.ts` | Replace | New hourly opportunity/window builder with clearer separation from overall score. |
| `.../coreIntelligence/recoveryModifier.ts` | Replace | Recovery/front logic should survive conceptually, but as a module inside the new assessment system. |
| `.../coreIntelligence/optimalBaselines.ts` | Replace | Baselines must move into the new config pack and response curves. |

---

## 5) Migration hotspots — the places most likely to cause confusion

These are the exact files where old assumptions are embedded and must be addressed early.

### A. `TightLinesAI/app/how-fishing.tsx`
Current issues visible in the file:
- mixed logic around coastal vs inland
- tab logic tied to old bundle modes
- default multi-context behavior
- active tab and available tabs are still bundle-driven
- report generation does not start from a clean mandatory context-confirmation flow

Required change:
- make this screen the **engine setup screen**
- force this order:
  1. choose water type
  2. if freshwater, choose `lake/pond/reservoir` or `river/stream`
  3. if freshwater, optionally enter observed water temp
  4. generate one report for one context

### B. `TightLinesAI/lib/howFishing.ts`
Current issues:
- types encode `mode: 'single' | 'coastal_multi' | 'inland_dual'`
- `reports` object still expects multiple simultaneous outputs
- cache model is built around bundle-style multi-report assumptions

Required change:
- make this the client contract for **single confirmed context**
- remove multi-report bundle mentality
- preserve cache utilities, but key them by:
  - location
  - date
  - confirmed environment mode

### C. `TightLinesAI/supabase/functions/how-fishing/index.ts`
Current issues:
- comments and orchestration still assume 1 inland or 3 coastal runs
- prompt orchestration still reflects old parallel report generation logic
- endpoint payload likely accepts context in a way that supports old branching

Required change:
- endpoint should run one engine context only
- keep auth, subscription, and LLM narration orchestration
- replace old engine-call shape with new structured feature payload

### D. `TightLinesAI/supabase/functions/_shared/coreIntelligence/*`
Current issues:
- this entire folder is the current engine truth
- lots of useful concepts exist, but the folder as a whole is still the old logic framework

Required change:
- do not “patch” this folder into the new engine
- build a new engine module tree and migrate only concepts worth preserving

---

## 6) Concepts worth preserving from the current engine

The old engine should not remain, but several concepts are worth carrying forward into the new implementation:

- recovery / post-front concept
- light-condition and day-part thinking
- tide-awareness for coastal use
- separation between environment processing and LLM narration
- severe weather safety language
- water temp source tracking
- data-quality / fallback notes
- weekly forecast as a separate consumption layer

These are **concepts**, not exact formulas. Preserve the ideas, not the current scoring implementation.

---

## 7) New module tree to create

Create a new deterministic engine tree instead of continuing to extend `coreIntelligence` in place.

Recommended path:

```text
TightLinesAI/supabase/functions/_shared/engine/
  contracts/
  context/
  normalization/
  reliability/
  curves/
  assessments/
  behavior/
  windows/
  scoring/
  features/howsFishing/
  config/
```

Then retire the old `coreIntelligence` folder once the new engine is wired and tested.

---

## 8) Practical sequence

1. Archive/delete root-level duplicate Expo app files.
2. Freeze the old `coreIntelligence` folder — no more feature work inside it.
3. Refactor `app/how-fishing.tsx` into the new setup flow.
4. Rewrite `lib/howFishing.ts` client contracts around one confirmed context.
5. Build the new engine under `_shared/engine/`.
6. Rewire `supabase/functions/how-fishing/index.ts` to the new engine.
7. Rewire forecast and report components to the new payload.
8. Remove redirect stub and old multi-context assumptions.
9. Then build the Golden Test Scenario Pack and validate before expanding other features.

---

## 9) Bottom line

### Scrap
- duplicate root Expo app
- old multi-context report behavior
- old engine module tree as the decision-making truth
- historical engine-plan docs inside active implementation flow

### Keep
- app shell
- auth/subscription
- env fetching pipeline
- Supabase plumbing
- most presentation components as shells

### Refactor
- live conditions / how-fishing UI
- client report types and caches
- edge-function orchestration
- forecast flow

### Replace
- the deterministic intelligence engine itself

