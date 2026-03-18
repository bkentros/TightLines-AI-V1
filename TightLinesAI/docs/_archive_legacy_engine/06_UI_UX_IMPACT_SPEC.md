# TightLines AI V3 UI and UX Impact Spec

## 1. Purpose

This document defines the UI and UX changes required so the product accurately reflects the V3 engine.

V3 does not require a full redesign. It does require removal of obsolete UI and addition of clearer confidence, window, and context communication.

## 2. Non-negotiable UI removal

### Remove manual freshwater water-temperature entry everywhere
The implementation agent must remove manual freshwater water temperature from:
- report setup flow
- form state
- route params if present
- request payload construction
- any display component that references it
- any helper text or labels that mention it

This removal is not complete unless all references are gone.

## 3. Required UI additions or refinements

### 3.1 Confidence / data-coverage indicator
The UI must communicate whether the report is:
- high-confidence / strong data coverage
- moderate-confidence / some important gaps
- lower-confidence / more directional

This can be visual or textual, but it must not clutter the screen.

### 3.2 Regime display
The UI should optionally expose a user-friendly label for the broad daily setup, such as:
- supportive setup
- mixed setup
- suppressive setup

This helps users understand why secondary or tertiary cues may matter more or less.

### 3.3 Better window explanations
Each best/fair/poor window should surface short reasons, such as:
- low light and stable weather help here
- wind weakens this period
- moving tide helps here
- solunar overlap adds a modest boost

### 3.4 Relative-to-normal detail line
Where justified by available historical comparisons, the UI should surface lines such as:
- recent temperatures have run slightly cooler than normal for this month
- recent rainfall has been above normal for this month

These lines should not appear when the engine lacks the necessary comparison confidence.

### 3.5 Updated "why today looks this way" section
This section should clearly separate:
- measured drivers
- suppressors
- historical context
- timing logic

## 4. Suggested report information architecture

### Top section
- overall score
- score band
- confidence / data-coverage state
- optional regime label

### Timing section
- best windows
- fair windows
- poor windows
- short reasons for each

### Detail section
- top measured drivers
- top suppressors
- relative-to-normal context
- caution notes when key data was missing

## 5. UI honesty rules

The UI must not:
- imply certainty the engine does not have
- display relative-to-normal context when no comparison flag exists
- continue to surface removed V2 concepts after the engine changed
- hide low-confidence conditions behind polished wording

## 6. Likely files to touch

At minimum, the implementation agent should inspect and update:
- `app/how-fishing.tsx`
- `components/fishing/ReportView.tsx`
- any score card component
- any timing window component
- any detail/accordion components used by the report

## 7. Deliverables required from the implementation agent

The UI/UX phase is not complete unless the agent provides:
- removal of manual freshwater temp UI
- updated report rendering that reflects confidence/data-coverage
- updated window presentation with reasons
- updated detail section with relative-to-normal context where justified
- a short note listing which components were changed and why
