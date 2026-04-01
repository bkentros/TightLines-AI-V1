# Recommender Audit Tuning Plan

## Goal

Use the historical recommender audit to tune the engine toward guide-level biological and tactical realism across:

- all supported species
- all valid water types
- all months
- all mainstream U.S. fisheries covered by the audit bundle

The tuning standard is not "different outputs." The standard is:

- forage-first logic
- species- and context-correct presentation
- believable color guidance
- familiar tackle and fly naming
- meaningful daily shifts inside the broader seasonal pattern

## Current State

The first major audit-driven fixes are already in:

- obscure and generic example names were removed from family metadata
- dirty-water flats redfish now favor shrimp/crab families instead of loud baitfish reaction families
- bottom-oriented forage now suppresses topwater when appropriate
- behavior summary copy is more varied and more tactically specific
- dirty-water color logic now keeps forage family meaning instead of forcing everything into chartreuse/white
- the audit runner was refined so it does not over-flag mild contradiction cases

## What The Latest Audit Still Says

The main remaining clusters are:

1. `THERMAL_RESPONSE_FLAT`
The engine still stays too stable across many cold/normal/warm triplets.

2. `LURE_COLOR_COLLAPSE`
Top 3 lure cards still converge on the same color family too often.

3. `FLY_COLOR_COLLAPSE`
Top 3 fly cards still converge on the same color family too often.

4. `FLY_TOP_PICK_MAJOR_CONTRADICTION`
Mostly dirty-river smallmouth scenarios where `Articulated Streamer` still wins too often.

## Tuning Order

### Phase A — Thermal Responsiveness

This is the most important remaining engine task.

Objectives:

- make cold/normal/warm triplets produce meaningfully different behavior when the thermal spread is large enough to matter
- avoid fake responsiveness in scenarios where a real guide would still fish the same basic pattern

Implementation focus:

- incorporate more direct temperature-band sensitivity into `resolveBehavior.ts`
- treat warming and cooling differently by species group and context
- let thermal changes move:
  - activity
  - depth lane
  - speed preference
  - strike-zone width
  - baitfish-vs-bottom-forage emphasis in shoulder-season scenarios

Priority fisheries/species:

- largemouth bass in Southeast/Florida spring and winter
- smallmouth bass rivers in summer/shoulder months
- walleye in upper Midwest lakes/rivers
- striped bass in Atlantic coastal spring/fall

### Phase B — Fly Ranking Cleanup

This is the clearest remaining biological ranking bug.

Objectives:

- stop `Articulated Streamer` from winning dirty-river smallmouth cases when crawfish/current or lower-visibility baitfish flies are a better fit

Implementation focus:

- reduce dirty-water and low-visibility suitability for `streamer_articulated`
- make `streamer_baitfish` and `leech_worm_fly` more competitive in current-heavy, stained/dirty river scenarios
- add stronger penalties when a bulky articulated fly is winning despite a primary forage mismatch

Priority fisheries/species:

- Detroit River smallmouth
- Susquehanna smallmouth

### Phase C — Color Diversity Without Randomness

Objectives:

- keep colors biologically sensible
- avoid top 3 all reading as the exact same color family

Implementation focus:

- add family-specific color subtracks inside forage families
- vary by:
  - bait type
  - retrieve style
  - depth lane
  - dirty/stained/clear visibility
- keep one pick natural, one contrast-biased, and one alternate-forage/secondary-forage track when that makes tactical sense

Priority groups:

- bass crawfish scenarios
- dirty-water baitfish scenarios
- inshore shrimp/crab scenarios

### Phase D — Example Rotation And Regional Realism

Objectives:

- stop the same 3-4 example names from appearing everywhere
- make examples feel more region- and species-appropriate

Implementation focus:

- add deterministic example rotation by species/context/family/date seed
- create family-specific example pools by:
  - freshwater bass
  - trout
  - walleye/pike
  - inshore saltwater

### Phase E — Audit Quality Refinement

The audit must stay useful while tuning.

Objectives:

- keep audit pressure on real guide-level problems
- avoid overfitting to noisy flags

Implementation focus:

- tighten `THERMAL_RESPONSE_FLAT` to focus on spreads and species where a guide would expect an adjustment
- keep contradiction flags focused on forage and major presentation errors
- add scenario spot-check lists for:
  - Florida pond/lake baitfish windows
  - dirty redfish flats
  - dirty smallmouth rivers
  - winter pike/musky

## Success Criteria

The tuning pass is working when:

- top-ranked families almost always include the correct forage family in the top 1-2
- dirty flats/coastal crustacean bites stop surfacing baitfish reaction families as the best answer
- top colors are varied but still forage- and clarity-correct
- behavior summaries sound like a local guide, not a template engine
- the remaining audit report is dominated by a small set of genuinely interesting edge cases
