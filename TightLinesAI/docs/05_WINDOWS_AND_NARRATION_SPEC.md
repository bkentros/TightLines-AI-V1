# TightLines AI V3 Windows and Narration Spec

## 1. Purpose

This document defines how V3 must calculate time windows and how V3 must shape LLM narration.

These two layers are related but must remain separate:
- the engine determines windows and reasons
- the LLM narrates approved outputs only

## 2. Window-engine principle

Windows must not be generated from one generic static formula.

Window logic must vary by:
- measured variables
- region
- month
- water type / subtype
- regime
- historical comparison flags
- tide timing for coastal paths
- solunar overlap

## 3. Recommended daily window blocks

Default blocks:
- dawn
- morning
- midday
- afternoon
- dusk
- evening
- night

Optional:
- overnight, but only if the engine has a real reason to separate it from night

The implementation agent may preserve the current block system if it maps cleanly to these concepts and still satisfies V3 rules.

## 4. Core window rules

- primary conditions shape the baseline quality of the day
- secondary variables refine windows when regime is supportive or neutral
- tertiary variables matter meaningfully only when the regime allows it
- strong suppressors can cap or downgrade windows even when solunar overlap looks strong
- coastal windows must remain tide-aware

## 5. Context guidance for windows

### 5.1 Freshwater cold-season contexts
Likely behavior:
- the warmest stable part of the day may improve
- daylight progression may matter more
- solunar should not overrule suppressive cold/unstable setups

### 5.2 Freshwater hot-season contexts
Likely behavior:
- low-light periods often improve
- cloud cover can soften harsh midday conditions
- night/evening can improve only when broader conditions are not strongly suppressive
- solunar may matter more when the regime is supportive

### 5.3 Saltwater/brackish contexts
Likely behavior:
- tide/current timing often remains central
- wind fishability can strongly degrade windows
- measured coastal water context can refine interpretation
- solunar can enhance already-supportive windows but should not overpower bad baseline conditions

## 6. Window output contract

Every returned window must include:
- `label`
- `relative_rank`
- `score`
- `band` (`best`, `fair`, `poor`)
- `confidence`
- `reasons`
- `suppressors`
- optional `historical_context_note`

Recommended additional trace fields:
- `regime_influence`
- `primary_factor_summary`
- `secondary_factor_summary`
- `tertiary_factor_summary`

## 7. Required reason quality

Window reasons must be specific enough for UI and narration, for example:
- low light and stable conditions support this window
- wind exposure weakens this window
- moving tide improves this window
- solunar overlap gives this otherwise-supportive window a modest boost

Reasons must not be vague placeholders like:
- conditions look good
- fish may bite here

## 8. Narration payload requirements

The LLM must receive a structured V3 payload.

### 8.1 Include
- overall score and band
- regime
- confidence and data-coverage notes
- best/fair/poor windows with reasons
- measured drivers
- measured suppressors
- historical comparison flags
- relative-to-normal summary lines
- mode-specific claim-guard instructions

### 8.2 Exclude
- unsupported biological certainty
- exact fish depth claims unless explicitly supported by deterministic logic and safe claim rules
- fabricated river-flow behavior
- exact promises of fish activity or catches

## 9. Separate narration requirements by mode

### 9.1 Freshwater lake
Narration should emphasize:
- stability / weather pattern
- light and timing
- cautious seasonal-progress framing
- cautious shallow/deeper tendency language only when supported by historical comparison context

### 9.2 Freshwater river
Narration should emphasize:
- recent weather effects
- light/timing/pressure
- moving-water caution without pretending flow data exists
- more conservative behavior wording than a true flow-aware river engine would use

### 9.3 Brackish
Narration should emphasize:
- coastal timing logic
- tide/current where supported
- mixed-environment nuance without overclaiming salinity behavior

### 9.4 Saltwater
Narration should emphasize:
- tide/current
- wind fishability
- measured coastal water context when available
- low-light and timing windows

## 10. Language standard for the LLM

### 10.1 What can be said confidently
The LLM can be more direct about:
- the overall score band
- whether windows are strongest or weakest
- what measured variables are helping or hurting
- whether recent conditions are warmer/cooler or wetter/drier than normal when backed by historical comparison flags

### 10.2 What must stay cautious
The LLM must use cautious wording for behavior interpretation, such as:
- may
- could
- tends to
- suggests
- points toward

The LLM must not present historical-context interpretations as deterministic biological fact.

## 11. Deliverables required from the implementation agent

The windows/narration phase is not complete unless the agent provides:
- updated window engine logic
- explicit window output contract
- reason traces per window
- V3 narration payload builder
- updated mode-specific prompts
- a short summary explaining how suppressive regimes mute tertiary window influence
