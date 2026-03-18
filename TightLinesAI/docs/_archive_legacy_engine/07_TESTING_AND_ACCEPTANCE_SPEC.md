# TightLines AI V3 Testing and Acceptance Spec

## 1. Purpose

This document defines the minimum testing and acceptance requirements for the V3 renovation.

V3 is not considered complete because it compiles. It must prove:
- measured-only score behavior
- proper missing-data handling
- correct regime behavior
- believable window behavior
- safe narration support
- honest UI behavior

## 2. Test philosophy

The test suite must validate both correctness and honesty.

Honesty means:
- missing measured data is not disguised as certainty
- suppressive conditions are not rescued by tertiary fluff
- historical baselines are used for context, not fake score inputs
- narration payloads remain constrained

## 3. Required test groups

### 3.1 Contract tests
Validate:
- normalized environment contract shape
- V3 result contract shape
- explicit handling of measured / derived / historical / missing states

### 3.2 Context resolution tests
Validate:
- state resolution behavior
- state -> region mapping
- month extraction behavior
- graceful fallback when state resolution fails

### 3.3 Baseline-layer tests
Validate:
- baseline lookup works by state/month/subtype where applicable
- missing baseline rows do not break report generation
- historical comparison flags are generated correctly
- baseline data is not injected into measured score variables

### 3.4 Score-composition tests
Validate:
- only measured eligible variables drive the headline score
- inferred freshwater temperature does not affect headline score
- river pseudo-current does not affect headline score
- weights renormalize correctly when variables are missing
- confidence drops when important variables are absent

### 3.5 Regime tests
Validate:
- supportive days allow stronger secondary/tertiary influence
- suppressive days mute tertiary influence strongly
- highly suppressive days leave little practical room for secondary/tertiary rescue

### 3.6 Window tests
Validate:
- windows vary by month/region/water type context
- coastal windows remain tide-aware
- low-light windows can strengthen in hot freshwater contexts
- warmest stable windows can strengthen in cold freshwater contexts
- solunar does not overpower highly suppressive conditions
- window reasons are present and non-empty

### 3.7 Narration-payload tests
Validate:
- payload includes score, regime, confidence, windows, measured drivers/suppressors, and historical context flags
- payload excludes unsupported fields
- mode-specific narration paths remain separate
- claim-guard flags are present when needed

### 3.8 UI acceptance checks
Validate:
- no manual freshwater temp UI remains
- confidence/data-coverage renders correctly
- relative-to-normal lines appear only when justified
- timing windows display reasons
- UI does not imply confidence higher than engine coverage supports

## 4. Scenario matrix requirement

The implementation agent must create scenario coverage across:
- all 4 environment modes
- multiple months
- multiple regions
- supportive / neutral / suppressive / highly suppressive setups
- high-data and low-data coverage cases

At minimum, the matrix should include examples for:
- northern winter freshwater
- northern summer freshwater
- Gulf/Florida saltwater
- brackish mixed conditions
- missing-key-signal cases

## 5. Rejection criteria

Reject the implementation if any of the following are true:
- inferred freshwater temperature still influences headline score
- missing measured score inputs are silently guessed
- solunar can create a strong positive window on a highly suppressive day
- historical baselines are being treated like measured score inputs
- manual freshwater temperature is still visible anywhere in the product
- confidence does not degrade when key variables are missing
- narration payloads are too loose or generic

## 6. Required testing deliverables

The testing phase is not complete unless the agent provides:
- unit/integration tests for the major V3 layers
- scenario fixtures or golden cases
- a short coverage summary explaining what was tested
- a short known-limitations summary explaining what still needs tuning after the phase
