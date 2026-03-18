# TightLines AI V1 Engine Architecture — Codebase-Aligned Revision

## What to scrap/remove from the current project

This section is now based on the uploaded codebase, not theory.

### 1. Make `/TightLinesAI` the only canonical app root
Your zip contains two Expo app roots:
- root-level app/files at `/`
- nested full app at `/TightLinesAI`

The nested `/TightLinesAI` project is clearly the real working app because it contains:
- iOS project files
- Supabase functions
- docs
- patches
- richer dependencies
- the current How's Fishing implementation

**Recommendation:**
- keep `/TightLinesAI` as the real app root
- archive or delete the duplicate root-level Expo shell after backup
- do not continue developing both in parallel

### 2. Scrap the current deterministic engine implementation, not the entire feature shell
Remove/retire the current implementation under:
- `TightLinesAI/supabase/functions/_shared/coreIntelligence/`

This includes retiring the current logic in:
- `index.ts`
- `scoreEngine.ts`
- `behaviorInference.ts`
- `timeWindowEngine.ts`
- `contextModifiers.ts`
- `fishBiology.ts`
- `optimalBaselines.ts`
- `seasonalProfiles.ts`
- `recoveryModifier.ts`
- `derivedVariables.ts`
- current tests tied directly to this engine behavior

Reason:
- the current engine is still built around a monolithic seasonal/weighting system
- it already contains many useful ideas, but the logic is too interlocked to safely evolve into the new context-resolution architecture
- trying to patch this in place will keep the project brittle

### 3. Scrap the current multi-report How's Fishing execution model
Current backend/frontend behavior auto-generates multiple reports depending on coastal state:
- coastal: `freshwater`, `saltwater`, `brackish`
- inland: `freshwater_lake`, `freshwater_river`

This behavior is visible in:
- `TightLinesAI/app/how-fishing.tsx`
- `TightLinesAI/lib/howFishing.ts`
- `TightLinesAI/store/forecastStore.ts`
- `TightLinesAI/supabase/functions/how-fishing/index.ts`

**This should be removed.**

The new engine should run for **one confirmed fishing context per report generation**, not all possible contexts for the user's location.

### 4. Scrap location-only context selection as engine truth
Current logic still allows location/coastal detection to drive context too heavily.

That is useful as a suggestion layer, but it should no longer be treated as final truth.

Remove the idea that:
- coast proximity decides the final report type
- inland means auto-run both lake and river reports
- coastal means auto-run all coastal tabs

### 5. Scrap old prompt assumptions that depend on the current engine's shape
The current `how-fishing` edge function prompt structure is usable in spirit, but the payload assumptions and field organization are tied to the old engine bundle format.

These prompt/data-contract assumptions should be replaced together with the engine contract.

### 6. Archive old implementation docs that describe the current engine as if it should be extended
These docs are useful as historical context, but should no longer guide implementation:
- `TightLinesAI/docs/ENGINE_REFINEMENT_SWEEP_1.md`
- `...SWEEP_2.md`
- `...SWEEP_3.md`
- `...DEBUG_AUDIT_HOWS_FISHING.md`
- `...PASS_1_ENGINE_REFACTOR_NOTES.md`
- `...PASS_5_FINAL_POLISH_NOTES.md`
- `...ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md`
- `...HOWS_FISHING_IMPLEMENTATION_PLAN.md`
- `...FOUNDATION_IMPLEMENTATION_PLAN.md`
- `...INTELLIGENCE_ENGINE_OVERVIEW.md`

Keep them as archive references only.

---

## What to keep and reuse

### 1. Keep the environment acquisition stack
The environment/data acquisition side is worth preserving and adapting:
- `TightLinesAI/supabase/functions/get-environment/index.ts`
- `TightLinesAI/supabase/functions/_shared/envAdapter.ts` as a concept, though not necessarily unchanged
- `TightLinesAI/lib/env/*`
- `TightLinesAI/store/envStore.ts`
- weather/tide/moon/sun fetch wiring already in place

This is the strongest reusable part of the backend foundation.

### 2. Keep the auth, subscription, usage, and edge invocation plumbing
These are good infrastructure layers and should not be rebuilt unnecessarily:
- `TightLinesAI/lib/supabase.ts`
- `TightLinesAI/store/authStore.ts`
- subscription/usage plumbing inside `supabase/functions/how-fishing/index.ts`
- frontend edge function invocation flow

### 3. Keep the current UI component shell, but refactor it to match the new setup flow
Reusable UI pieces include:
- `components/fishing/*`
- `components/LiveConditionsWidget.tsx`
- report layout components
- caching patterns in `lib/howFishing.ts`
- weekly forecast store patterns

These should be preserved where practical, but many will need prop/data-contract updates.

### 4. Keep manual freshwater temperature support as a product behavior
Current support for `manual_freshwater_water_temp_f` is directionally correct and should stay.

But it needs to be moved into a stricter UX flow:
- only shown for freshwater modes
- hidden for saltwater/brackish
- treated as highest-confidence manual input when user enters it

### 5. Keep the idea of freshwater lake vs river split
This already appears in the current app and should remain.
It is one of the better parts of the current direction.

---

## The most important architectural correction after reviewing the codebase

The biggest architecture correction is this:

**How's Fishing should no longer generate multiple parallel reports for all plausible water contexts.**

Instead, the engine should run after the user confirms a single context.

### Correct V1 execution model
The user should confirm, in this order:
1. water type: freshwater, brackish, saltwater
2. body type if applicable:
   - freshwater lake / pond / reservoir
   - freshwater river / stream
3. optional manual freshwater water temp
4. generate report

Then the backend runs **one engine evaluation** for that confirmed environment mode.

That one change will make the system:
- simpler
- more accurate
- easier to calibrate
- easier to explain to users
- cleaner for the LLM layer

---

## Confirmed V1 environment modes

After codebase review, V1 should standardize on these confirmed execution modes:
- `freshwater_lake`
- `freshwater_river`
- `brackish`
- `saltwater`

Not:
- inland dual-run mode
- coastal multi-run mode
- auto-generated comparison tabs as engine truth

Location can still suggest likely options, but the engine should run on the user's confirmed mode only.

---

## Updated architecture layers

### 1. UI Context Confirmation Layer
Collects and validates:
- water type
- freshwater subtype if relevant
- optional manual freshwater temp
- location/time inputs

### 2. Environment Acquisition Layer
Uses the existing API stack to fetch:
- weather
- pressure history
- forecast data
- moon/solunar
- tide/current where applicable
- measured coastal water temperature where available

### 3. Input Normalization + Source Priority Layer
Resolves raw inputs into a normalized environmental snapshot.

Key priority rule:
- manual freshwater temp, if provided, overrides inferred freshwater temp
- measured coastal/brackish water temperature overrides fallback estimates
- tide inputs ignored entirely for freshwater modes

### 4. Context Resolution Layer
Resolves:
- environment mode
- 7-region mainland USA region
- month
- seasonal-state
- source reliability

This is where the engine learns how to interpret the same variable differently by context.

### 5. Reliability and Claim Guard Layer
Determines:
- which modules are degraded
- confidence level
- whether the engine should avoid strong biological claims
- whether water-temp-driven claims should be softened

### 6. Condition Assessment Layer
Evaluates the main variable families:
- thermal state
- temp trend
- pressure state/trend
- wind state
- light condition
- precipitation/runoff signal
- tide/current movement where applicable
- moon/solunar support
- time-of-day support

### 7. Behavior Engine Layer
Builds broad behavioral conclusions such as:
- activity state
- feeding readiness
- opportunity state
- broad positioning tendency
- presentation speed bias

### 8. Hourly Opportunity / Window Builder
Builds:
- best windows
- fair windows
- poor windows
- opportunity curve shaping

Moon/solunar should mainly refine windows, not dominate the score.

### 9. Feature Output Layer
Produces a structured report payload for:
- score
- score band
- windows
- drivers
- suppressors
- confidence
- tactical summary

### 10. LLM Narration Layer
The LLM narrates only from approved structured outputs and the confirmed environment mode.
It must not infer beyond what the engine approved.

---

## Region strategy after codebase review

Use 7 practical mainland USA regions:
- Northeast
- Great Lakes / Upper Midwest
- Mid-Atlantic
- Southeast Atlantic
- Gulf / Florida
- Interior South / Plains
- West / Southwest

The app should map user coordinates into one region deterministically.
Longitude should not be a scoring variable.

---

## Water type and body type UX rules that now need to be treated as architecture rules

### Water type selection order
1. user selects water type first
2. app only shows valid body types for that water type
3. optional manual temp only appears for freshwater modes
4. report generation is enabled only after context is valid

### Freshwater manual temperature rule
- freshwater only
- optional
- user should enter it only when they know it confidently
- if entered, treat as highest-confidence water temperature input

### Saltwater/brackish water temperature rule
- no user entry field
- auto-sourced only

---

## Final architecture judgment after codebase review

You do **not** need to rebuild the whole app.
You **do** need to rebuild the deterministic engine core and the How's Fishing execution flow.

The codebase already has useful foundations:
- live environment acquisition
- edge function orchestration
- caching
- report UI components
- freshwater subtype awareness

But the following must change decisively:
- current engine implementation
- current bundle/response shape
- current multi-context auto-report model
- current setup flow for report generation

That is the cleanest path to an accurate V1 engine.
