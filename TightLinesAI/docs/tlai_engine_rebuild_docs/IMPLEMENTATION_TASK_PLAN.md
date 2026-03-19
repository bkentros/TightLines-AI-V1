# IMPLEMENTATION_TASK_PLAN

## Goal

Execute the engine reset cleanly and in the correct order so the codebase does not end up with another half-old / half-new architecture.

---

## Phase 1 — create the new documentation surface in the repo

1. Add the new doc pack to the repo.
2. Mark the new pack as canonical.
3. Archive or remove older engine docs from the active doc surface.

**Exit criteria**
- one clear active doc pack
- no ambiguity about which docs are current

---

## Phase 2 — scaffold the new engine tree

Create the new engine folder:

```text
supabase/functions/_shared/howFishingEngine/
  config/
  context/
  normalize/
  score/
  tips/
  narration/
  types.ts
  index.ts
```

Recommended initial files:
- `config/regions.ts`
- `config/stateToRegion.ts`
- `config/baseWeights.ts`
- `config/monthModifiers.ts`
- `config/regionModifiers.ts`
- `config/tempBandsFreshwater.ts`
- `config/tempBandsCoastal.ts`
- `normalize/normalizeTemperature.ts`
- `normalize/normalizePressure.ts`
- `normalize/normalizeWind.ts`
- `normalize/normalizeLight.ts`
- `normalize/normalizePrecip.ts`
- `normalize/normalizeRunoff.ts`
- `normalize/normalizeTide.ts`
- `score/reweight.ts`
- `score/scoreDay.ts`
- `tips/buildTips.ts`
- `narration/buildNarrationPayload.ts`

**Exit criteria**
- the new engine scaffold exists
- no legacy imports inside the new engine tree

---

## Phase 3 — implement config layer

Implement:
- region constants
- state-to-region mapping
- base weights
- month modifiers
- region modifiers
- freshwater temp tables
- coastal temp tables

**Exit criteria**
- config layer is complete
- temp tables are implemented exactly from the reference doc
- modifiers are clamped by the global cap logic

---

## Phase 4 — implement normalization layer

Implement normalizers for:
- temperature
- pressure
- wind
- light/cloud
- precipitation
- runoff
- tide/current

Implement a shared request → normalized-output entry point.

**Exit criteria**
- normalized output shape matches the master plan
- missing variables are carried explicitly
- reliability starts being computed here

---

## Phase 5 — implement scoring layer

Implement:
- active variable selection by context
- final weight calculation
- missing-variable drop
- dynamic reweighting to 100
- weighted contribution scoring
- final 0–100 score
- band mapping
- contribution ranking for drivers/suppressors

**Exit criteria**
- score, band, drivers, suppressors all derive from the new engine only
- no compatibility bridge to V2/V3 remains in the scoring path

---

## Phase 6 — implement tip and daypart logic

Implement:
- context-aware tip generation
- temperature-driven timing implication
- runoff, wind, tide, light, and reliability-aware broad guidance
- optional daypart note generation
- reliability note generation

**Exit criteria**
- tips are clearly derived from the actual scored variables
- no generic score-band-only tip logic
- no exact time windows

---

## Phase 7 — implement narration payload

Implement the narration payload builder and prompt contract.

Rules:
- the engine is the source of truth
- narration may rewrite but not expand meaning
- no exact windows
- no freshwater water-temp claims
- no species-specific claims

**Exit criteria**
- payload matches the report spec
- narration prompt is aligned to the simplified feature

---

## Phase 8 — refactor `supabase/functions/how-fishing/index.ts`

Preserve:
- auth
- subscription usage gating
- environment input plumbing
- edge-function skeleton

Replace:
- old engine imports
- old scoring path
- old window path
- old report shaping
- old narration assumptions
- old multi-report contract if unnecessary

**Exit criteria**
- edge function runs only through the new engine path
- output matches the new report contract

---

## Phase 9 — refactor frontend data layer

Refactor:
- `lib/howFishing.ts`
- any V2 helper types no longer needed
- request / response parsing for the new report
- cache shape if needed

**Exit criteria**
- client types match the new report
- no old prime/good/fair/worst structures remain in the client contract

---

## Phase 10 — simplify the How's Fishing screen

Refactor `app/how-fishing.tsx` to:
- support only today's full-day report
- support the three final context labels
- hide Coastal unless eligible
- remove forecast strip behavior
- remove forecast prompt modal
- remove old complex multi-report assumptions

**Exit criteria**
- user can generate a clean today-only report for the selected context
- no weekly strip remains on the screen

---

## Phase 11 — simplify results UI components

Refactor or replace current report components so the result screen shows only:
- score + band
- summary line
- up to 2 drivers
- up to 2 suppressors
- one actionable tip
- optional daypart note
- optional reliability note

**Exit criteria**
- UI matches the new engine contract exactly
- no empty leftover sections
- no old timing cards

---

## Phase 12 — remove old engine generations and dead code

After the new path is verified:
- remove / archive `coreIntelligence`
- remove / archive `engineV2`
- remove / archive `engineV3`
- remove / archive old tests
- remove / archive obsolete docs
- remove dead imports and compatibility code

**Exit criteria**
- one active engine path remains
- repo no longer looks like three engines are active

---

## Phase 13 — test and validate

Run the test plan:
- unit tests
- golden scenario checks
- missing-data behavior checks
- UI acceptance checks

**Exit criteria**
- all required tests pass
- manual smoke checks confirm the feature works for multiple regions/contexts/months

---

## Completion checklist

The rebuild is not complete until all are true:

- [ ] new engine tree exists and is active
- [ ] old engines are removed from active code paths
- [ ] score is normalized 0–100
- [ ] bands are Poor/Fair/Good/Excellent
- [ ] report is today-only full-day
- [ ] no exact windows remain
- [ ] no 7-day strip remains
- [ ] coastal is one merged context
- [ ] missing-variable reweighting works
- [ ] reliability softening works
- [ ] docs are cleaned up
- [ ] tests pass
