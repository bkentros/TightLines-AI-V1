# TightLines AI V3 Implementation Plan

## 1. Implementation rules

This renovation must be implemented in controlled phases.

Rules for the implementation agent:
- complete one phase fully before moving to the next
- do not partially stub a phase and silently continue
- preserve existing working behavior unless the phase explicitly replaces it
- leave clear TODO comments only where a later phase is intentionally responsible
- do not invent new product requirements
- do not reintroduce manual freshwater water temperature under a different name

## 2. Phase order

1. Schema and contract reset
2. Geo/context layer
3. Baseline data layer
4. Measured score engine rebuild
5. Regime and windows rebuild
6. Narration rebuild
7. UI/UX alignment
8. Testing and tuning

## 3. Phase 1 — schema and contract reset

### Goals
- remove manual freshwater water-temperature handling from all layers
- define a strict normalized environment contract for V3
- define a strict V3 engine output contract
- preserve report rendering using temporary adapters only where necessary

### Required tasks
- remove manual freshwater temp from frontend UI/state/request construction
- remove manual freshwater temp from server validation and engine request types
- define canonical normalized environment types
- define canonical V3 result/output types
- add provenance, availability, and data-coverage fields
- add explicit distinctions between measured, derived, historical, and missing values

### Files expected to change
- `app/how-fishing.tsx`
- any shared request payload types used by the frontend and edge function
- `supabase/functions/how-fishing/index.ts`
- `supabase/functions/_shared/engineV2/normalization/normalizeEnvironment.ts`
- any engine request/result type files

### Required output of Phase 1
- no manual freshwater temp path remains
- normalized contract type exists and compiles
- V3 result contract exists and compiles
- existing daily report still renders through a compatibility bridge if required
- a short implementation summary lists exactly what legacy manual-temp code was removed

### Phase-1 rejection conditions
Reject Phase 1 if:
- manual temp still exists in any request, type, component, or edge validation path
- normalization still treats guessed freshwater temperature like a measured signal
- the agent changes scoring logic prematurely before the new contracts exist

## 4. Phase 2 — geo/context layer

### Goals
- resolve both state and region from synced location
- stop relying on bounding-box-only region assignment

### Required tasks
- add a utility to resolve state from coordinates or a geocoded location field already available in the project
- create an explicit `state -> region` map using the current 7 regions
- refactor context resolution to always attempt to produce `state` and `region`
- ensure graceful degradation if state resolution fails
- ensure month is consistently resolved from local report date/time

### Files expected to be added
- `supabase/functions/_shared/engineV2/geo/resolveStateAndRegion.ts`
- `supabase/functions/_shared/engineV2/geo/stateToRegionMap.ts`

### Files expected to be refactored
- `supabase/functions/_shared/engineV2/context/resolveContext.ts`
- any current region config file that uses bounding boxes

### Required output of Phase 2
- V3 context contains `state`, `region`, `month`, `water_type`, `freshwater_subtype`, `environment_mode`
- existing 7 region labels are preserved
- context resolution is deterministic and testable

### Phase-2 rejection conditions
Reject Phase 2 if:
- state is not included in context
- region still depends only on bounding boxes
- month resolution is inconsistent with local report time

## 5. Phase 3 — baseline data layer

### Goals
- add historical baseline lookup support without contaminating score logic

### Required tasks
- define baseline dataset types
- add state monthly air-temp normals/ranges
- add state monthly precipitation normals/ranges
- add state monthly freshwater `lake_pond` temp ranges
- add state monthly freshwater `river_stream` temp ranges
- add coastal monthly water-temp ranges where applicable
- add source metadata and confidence/quality fields
- add a baseline lookup loader/util
- add historical comparison helpers that generate flags rather than fake measured values

### Files expected to be added
- `supabase/functions/_shared/engineV2/baselines/baselineTypes.ts`
- `supabase/functions/_shared/engineV2/baselines/loadHistoricalBaselines.ts`
- `supabase/functions/_shared/engineV2/context/buildHistoricalComparisonFlags.ts`
- one or more baseline data files in a typed JSON or TS format
- one documentation file summarizing source methodology and approximations used

### Required output of Phase 3
- baseline lookup works independently of score calculation
- baseline absence does not break the report
- baseline comparisons create structured context flags only

### Phase-3 rejection conditions
Reject Phase 3 if:
- baseline data is used to fabricate missing measured freshwater temp for scoring
- the data files lack source metadata or methodology notes
- freshwater subtype ranges are missing or collapsed into one undifferentiated freshwater value

## 6. Phase 4 — measured score engine rebuild

### Goals
- rebuild headline score logic so only measured eligible variables affect score
- remove freshwater inferred thermal score from headline composition
- remove river pseudo-current from headline composition

### Required tasks
- define eligible variables per environment mode and subtype
- define base weight profiles keyed by region + month + water type + subtype
- define variable tiers: primary, secondary, tertiary
- add missing-data reweighting utility
- refactor score composition to use only measured eligible inputs
- add score trace output showing eligible variables, removed variables, and final normalized weights
- preserve score band mapping and confidence output or replace them intentionally with documented V3 equivalents

### Files expected to be added
- `supabase/functions/_shared/engineV2/weights/getWeightProfile.ts`
- `supabase/functions/_shared/engineV2/weights/reweightAvailableVariables.ts`
- optional typed config files for monthly/region weight profiles

### Files expected to be refactored
- `supabase/functions/_shared/engineV2/index.ts`
- relevant assessment modules under `assessments/`
- any score-composition helpers

### Required output of Phase 4
- measured-only headline score
- deterministic weight reallocation when variables are missing
- explicit score traces for testing/debugging

### Phase-4 rejection conditions
Reject Phase 4 if:
- inferred freshwater temp still influences headline score
- a missing measured variable is silently backfilled with a guessed score value
- weight profiles are not keyed by region + month + water type/subtype

## 7. Phase 5 — regime and windows rebuild

### Goals
- implement primary conditions regime
- rebuild windows so secondary/tertiary influence obeys regime rules

### Required tasks
- implement `supportive`, `neutral`, `suppressive`, `highly_suppressive` regime resolver using measured variables only
- define context-aware window variable priorities
- rebuild window scoring using explicit blocks
- add reasons, suppressors, and optional historical-context notes to each window
- ensure tertiary factors do not overpower suppressive conditions
- ensure supportive conditions can allow secondary/tertiary refinements to matter more

### Files expected to be added
- `supabase/functions/_shared/engineV2/regime/resolvePrimaryConditionsRegime.ts`
- any window profile config files

### Files expected to be refactored
- current opportunity/window builder under `windows/`
- any time-of-day assessment composition feeding windows

### Required output of Phase 5
- window results are context-aware and regime-aware
- each window includes traceable reasons
- coastal windows continue to respect tide timing

### Phase-5 rejection conditions
Reject Phase 5 if:
- solunar can create strong windows on highly suppressive days
- windows are still produced by a nearly static formula regardless of context
- reasons are not traceable

## 8. Phase 6 — narration rebuild

### Goals
- tighten the LLM payload
- keep separate narration paths by mode
- prevent unsupported certainty

### Required tasks
- define V3 narration payload type
- add historical comparison summary lines
- add explicit claim-guard instructions
- update narration prompts for:
  - freshwater lake
  - freshwater river
  - brackish
  - saltwater
- ensure narration explains the score, windows, and relative-to-normal context without overstating fish behavior

### Files expected to change
- `supabase/functions/how-fishing/index.ts`
- any LLM prompt helpers or payload builders
- fallback deterministic narration if present

### Required output of Phase 6
- tighter narration payload
- distinct prompts per mode
- improved caution on behavior language

### Phase-6 rejection conditions
Reject Phase 6 if:
- prompts collapse all water types into one generic narration style
- the LLM is allowed to invent unsupported exact behavior or flow claims
- historical context is omitted entirely from narration support

## 9. Phase 7 — UI/UX alignment

### Goals
- remove obsolete UI
- show confidence and reasoning more honestly

### Required tasks
- remove manual freshwater temp entry UI fully
- expose confidence/data-coverage state in the report
- expose window reasons in a clear but not cluttered way
- add relative-to-normal detail lines where justified
- adjust any report cards or expandable sections that depended on removed V2 concepts

### Files expected to change
- `app/how-fishing.tsx`
- `components/fishing/ReportView.tsx`
- any child cards/components used by the report

### Required output of Phase 7
- UI reflects V3 outputs honestly
- no obsolete V2 freshwater-temp UI remains
- mode-specific report explanations still feel polished

### Phase-7 rejection conditions
Reject Phase 7 if:
- the UI still references manual freshwater temp
- the UI implies high certainty when data coverage is weak
- report details are missing key V3 concepts like confidence or relative-to-normal context

## 10. Phase 8 — testing and tuning

### Goals
- verify V3 behavior across contexts and missing-data cases

### Required tasks
- add unit tests for contracts, context resolution, baselines, score composition, regime, windows, narration payloads, and UI-facing mappings where practical
- add scenario fixtures across months, regions, and water types
- add missing-data tests
- add regression tests ensuring tertiary variables are muted correctly
- add acceptance notes documenting remaining gaps or follow-up tuning opportunities

### Required output of Phase 8
- test coverage over all critical V3 layers
- scenario matrix exercised
- documented known limitations

### Phase-8 rejection conditions
Reject Phase 8 if:
- the test suite does not verify measured-only score composition
- regime behavior is not tested
- missing-data degradation is not tested
