# TightLines AI V1 Engine Build Implementation Guide — Codebase-Aligned

This guide converts the architecture into an implementation sequence grounded in the uploaded codebase.

## Goal of this rebuild

Rebuild the deterministic fishing engine **without** rebuilding the whole app.

### Rebuild
- core engine logic
- report setup flow
- engine request/response contracts
- How's Fishing backend orchestration around the new engine

### Keep/refactor
- environment acquisition
- auth/subscription plumbing
- report UI shell
- caching patterns
- most frontend page/component structure

---

## Canonical project root

Use only:
- `TightLinesAI/`

Treat the root-level duplicate Expo shell as archive material and remove it from active development after backup.

---

## The single biggest implementation decision

Do **not** rebuild V2 inside the existing `coreIntelligence` files in place.

### Recommended approach
Create a parallel V2 engine folder first:
- `TightLinesAI/supabase/functions/_shared/engineV2/`

Build and test there until contract parity is reached.
Only then retire the old `coreIntelligence` implementation.

This avoids:
- breaking current app behavior mid-rebuild
- mixing old and new logic in the same files
- losing the ability to compare outputs during migration

---

## Build phases

## Phase 0 — cleanup and branch discipline

### Actions
1. create a rebuild branch
2. mark `/TightLinesAI` as canonical
3. archive/remove duplicate root-level Expo project
4. archive old engine docs into a non-active folder if desired
5. do not delete current `coreIntelligence` yet

### Deliverable
A clean branch where only one app root is considered active.

---

## Phase 1 — establish V2 contracts before logic

### Create these folders
- `supabase/functions/_shared/engineV2/types/`
- `supabase/functions/_shared/engineV2/context/`
- `supabase/functions/_shared/engineV2/normalization/`
- `supabase/functions/_shared/engineV2/reliability/`
- `supabase/functions/_shared/engineV2/config/`
- `supabase/functions/_shared/engineV2/curves/`
- `supabase/functions/_shared/engineV2/assessments/`
- `supabase/functions/_shared/engineV2/behavior/`
- `supabase/functions/_shared/engineV2/windows/`
- `supabase/functions/_shared/engineV2/features/`
- `supabase/functions/_shared/engineV2/__tests__/`

### Define these core contracts first
- `EngineRequestContext`
- `NormalizedEnvironment`
- `ResolvedContext`
- `ReliabilitySummary`
- `AssessmentOutputs`
- `BehaviorOutputs`
- `OpportunityCurve`
- `HowFishingEngineOutput`
- `LLMApprovedReportPayload`

### Important contract change
Replace the old multi-report bundle assumptions.

The new daily report contract should be built around **one confirmed environment mode**:
- `freshwater_lake`
- `freshwater_river`
- `brackish`
- `saltwater`

Not around:
- `mode: coastal_multi`
- `mode: inland_dual`
- a `reports` object containing multiple contexts

### Deliverable
Types compile before any scoring logic exists.

---

## Phase 2 — rebuild the frontend setup flow before backend engine replacement

### Current file to refactor
- `app/how-fishing.tsx`

### What must change
Today this screen effectively:
- loads env
- guesses context from coastal/inland state
- runs report generation with auto-generated context combinations
- shows tabs from generated bundle structure

### New setup flow
Before report generation, the screen must collect:
1. selected water type
2. selected freshwater subtype if applicable
3. optional manual freshwater temperature if applicable
4. then call report generation

### Recommended UI behavior
- location still suggests likely options
- water type/body type choices are explicit user confirmation
- saltwater hides river/stream options
- freshwater reveals lake/river choice
- manual water temp input appears only for freshwater modes
- saltwater/brackish explain that water temp is automatically sourced

### Existing components likely reusable
- `components/LiveConditionsWidget.tsx`
- `components/fishing/WaterTypeTabBar.tsx` should be repurposed from post-run report switching to pre-run setup selection or simplified
- report display components remain reusable once fed a new single-report payload

### Deliverable
The screen can produce a valid confirmed engine request context before engine execution.

---

## Phase 3 — rebuild the request contract and backend orchestration

### Current file to refactor heavily
- `supabase/functions/how-fishing/index.ts`

### Keep
- auth validation
- subscription/usage enforcement
- edge invocation structure
- token/cost logging patterns

### Replace
- old engine invocation model
- old bundle shape
- old branching around inland/coastal multi-run execution
- old payload assumptions into the LLM

### New orchestration order
1. validate auth/subscription
2. validate confirmed user context
3. fetch or accept fresh environment payload
4. normalize/adapt to V2 engine input
5. resolve region + seasonal-state + reliability
6. run engine V2 once for the confirmed environment mode
7. build approved LLM payload from structured output
8. narrate once
9. return one report payload

### Weekly overview note
Weekly overview should also be rebuilt around one confirmed environment mode, not auto-multi-context mode.

### Deliverable
A clean V2 backend orchestration path that can run without old multi-run behavior.

---

## Phase 4 — normalization and source priority layer

### Use as source inspiration
- `supabase/functions/_shared/envAdapter.ts`

### Rebuild goals
Create a V2 normalization layer that:
- preserves raw source visibility
- resolves source priority cleanly
- outputs one normalized environment object
- carries data provenance and confidence inputs

### Required source priority rules
1. manual freshwater water temp, if present
2. measured coastal/brackish water temp
3. inferred freshwater temp
4. fallback/no-confidence state

### Specific rule
Tide/current inputs must be ignored for freshwater modes.
Do not carry them as influential non-applicable fields.

### Deliverable
Normalized environment object with provenance and confidence ingredients.

---

## Phase 5 — context resolution layer

### Build dedicated modules for
- region resolution from coordinates
- month and date context
- seasonal-state inference
- environment mode resolution
- freshwater lake vs river handling

### Important philosophy
Month is not enough.
The engine must resolve a **seasonal state**, not merely a calendar state.

### Deliverable
A `ResolvedContext` object that downstream modules use instead of raw month/water-type alone.

---

## Phase 6 — reliability and claim guard layer

### Why this matters in your codebase
The current code already carries water-temp confidence and some degraded-state behavior, but it is not formalized enough for the new architecture.

### Build a dedicated reliability layer that outputs
- overall confidence band
- critical inferred inputs
- degraded modules
- claim guardrails
- safe/unsafe tactical specificity

### Use this for
- score confidence
- how assertive the LLM payload can be
- whether biological claims should be softened

### Deliverable
A formal reliability summary consumed by feature output and narration layers.

---

## Phase 7 — config-driven variable response system

### Do not port current score logic directly
The old engine has many useful weighting ideas but is too tightly coupled to old module structure.

### Instead build
- variable registry
- response-curve evaluator
- context-specific preferred/stress bands
- asymmetric high-vs-low handling
- dynamic variable importance

### Core variable families for V1
- water temperature
- recent temperature trend
- pressure level/trend
- wind
- cloud/light
- precipitation/runoff
- moon/solunar
- time-of-day
- tide/current for saltwater/brackish only

### Deliverable
Config-driven scoring primitives, independent of feature presentation.

---

## Phase 8 — assessment modules

Create separate modules for:
- thermal assessment
- temp-trend assessment
- pressure assessment
- wind assessment
- light assessment
- precipitation/runoff assessment
- tide/current assessment
- moon/solunar support assessment
- time-of-day support assessment

Each module should return:
- component score
- state label
- dominant explanation tags
- positive/negative direction
- confidence dependencies

### Deliverable
Assessment outputs are modular and individually testable.

---

## Phase 9 — behavior engine

Build a behavior layer that converts assessments into broad biological interpretation:
- activity state
- feeding readiness
- suppression state
- broad positioning tendency
- presentation speed bias

### Guardrail
Do not claim exact species behavior or exact depth.
Keep positioning broad and honest.

### Deliverable
Reusable behavior output for How's Fishing and later premium features.

---

## Phase 10 — hourly opportunity curve and windows

### Why this deserves its own phase
The current app heavily depends on best/fair/worst times. This logic should no longer be implicit inside general score code.

### Build
- hourly opportunity curve generator
- window segmentation
- best/fair/poor window classification
- moon/solunar overlap refinement
- severe suppression capping behavior

### Rule
Moon/solunar should mainly refine windows when baseline conditions already support feeding opportunity.

### Deliverable
Deterministic time-window outputs independent of narration.

---

## Phase 11 — final score and report payload

### Build one final score philosophy
The final score should represent:
**overall catch opportunity for the user's confirmed context**

It should blend:
- baseline activity potential
- feeding window strength
- suppression factors
- fishability conditions

### Output payload should include
- environment mode
- score
- score band
- confidence
- top drivers
- suppressors
- windows
- tactical summary fields
- approved narration facts only

### Deliverable
Single-report deterministic payload, ready for LLM narration.

---

## Phase 12 — LLM integration rebuild

### Current file
- `supabase/functions/how-fishing/index.ts`

### What changes
The current LLM prompt style can remain broadly similar, but the payload feeding it must be rebuilt around the new single-report structure.

### Key rules
- engine outputs are final
- LLM receives approved facts only
- narration must respect selected environment mode
- no invented body-type language outside approved context

### Deliverable
One narration call per report, grounded entirely in structured engine output.

---

## Phase 13 — frontend report rendering refactor

### Existing components likely reusable with prop changes
- `ReportView.tsx`
- `ScoreCard.tsx`
- `ScoreBreakdown.tsx`
- `TimeWindows.tsx`
- `KeyFactors.tsx`
- `TipsSection.tsx`
- `StrategySection.tsx`

### What changes
- stop assuming multiple reports/tabs from one generation
- render one report for one confirmed environment mode
- show context clearly at top of report
- show confidence visibly but not intrusively

### Deliverable
Frontend renders one clean report matching the new engine truth.

---

## Phase 14 — retire old engine and old multi-report data contracts

After V2 passes tests:
- remove `coreIntelligence` from active use
- remove old bundle modes from `lib/howFishing.ts`
- remove old multi-report tab logic from frontend
- remove inland/coastal auto-report generation from backend
- archive old engine tests after preserving any useful scenarios

### Deliverable
Only one engine path remains active in production code.

---

## File-by-file migration priorities

## Highest-priority backend files
- `supabase/functions/how-fishing/index.ts`
- `supabase/functions/_shared/envAdapter.ts`
- `supabase/functions/_shared/coreIntelligence/*` -> replace with `engineV2/*`

## Highest-priority frontend files
- `app/how-fishing.tsx`
- `lib/howFishing.ts`
- `store/forecastStore.ts`
- `components/fishing/WaterTypeTabBar.tsx`
- `components/fishing/ReportView.tsx`

## Lower-priority but likely touched
- `components/LiveConditionsWidget.tsx`
- `lib/env/types.ts`
- any screens that deep-link to How's Fishing output

---

## UI/UX alignment section

This section is now mandatory because the current UX and the new engine no longer match.

### The new UX must do these things
- collect user context before running the report
- hide non-applicable body types after water type selection
- show manual freshwater temp only for freshwater modes
- make auto-detection a suggestion, not a final truth
- stop presenting multiple parallel context reports as if they are equally valid for the same trip

### Live Conditions page order of operation
1. load location + environmental conditions
2. suggest likely water contexts
3. user selects water type
4. UI reveals valid body types
5. optional freshwater temp input appears if relevant
6. user generates one report
7. result is narrated in the selected context only

---

## Exit criteria before coding is considered complete

You are not done when the new engine compiles.
You are done when all of these are true:
- only one canonical app root remains active
- How's Fishing runs on one confirmed environment mode
- old multi-run bundle behavior is gone
- the V2 engine produces deterministic structured outputs
- LLM narration only reflects approved engine facts
- report UI matches the new setup flow
- test fixtures confirm expected behavior across regions and seasons
