# TightLines AI V3 Weighting and Regime Spec

## 1. Purpose

This document defines how V3 weight profiles work, how variables are tiered, how the primary conditions regime is resolved, and how regime affects the importance of secondary and tertiary variables.

## 2. Core weighting principle

Not all variables need historical baselines, but many variables do need context-sensitive importance.

The weighting system must reflect:
- region
- month
- water type
- freshwater subtype where applicable

State is not the primary weighting axis. State is reserved for historical baseline lookup.

## 3. Weight-profile key

Every weight profile must be keyed by:
- `region`
- `month`
- `water_type`
- `freshwater_subtype` where relevant

The first implementation may group some neighboring months if needed, but if grouped, the grouping must be explicit and documented. It must not be hidden inside code comments or vague branching.

## 4. Variable tiers

Each profile must classify variables into:
- `primary`
- `secondary`
- `tertiary`

### 4.1 Tier meaning
#### Primary
Core drivers/suppressors that usually dominate the day.

#### Secondary
Meaningful refiners that matter more when the regime is not suppressive.

#### Tertiary
Refiners that become more relevant when primary conditions are already decent or supportive.

## 5. Variable inventory expectations

The implementation agent must explicitly define which measured variables are eligible by environment mode.

### Freshwater lake and river eligible measured variables
- air-temp trend
- intraday air-temp shape
- pressure trend
- wind
- cloud/light
- current precipitation and recent precipitation
- solunar
- daylight/time-of-day context

### Saltwater/brackish eligible measured variables
- tide/current
- measured coastal water temperature when available
- air-temp trend where relevant
- pressure trend
- wind
- cloud/light
- current precipitation and recent precipitation
- solunar
- daylight/time-of-day context

These variables may vary in importance by profile, but the headline score must not include inferred freshwater water temperature.

## 6. Regime definitions

### 6.1 Supportive
Conditions are broadly favorable. No major primary suppressor dominates.

Effect:
- primary variables lead
- secondary variables can materially influence the score/window picture
- tertiary variables can add meaningful refinement

### 6.2 Neutral
Conditions are mixed or modestly favorable.

Effect:
- primary variables lead
- secondary variables help
- tertiary variables remain modest

### 6.3 Suppressive
At least one important primary suppressor is dragging the day down.

Effect:
- primary suppressors dominate
- secondary variables may still refine some windows
- tertiary variables should be strongly muted

### 6.4 Highly suppressive
Major suppressive conditions dominate so strongly that refiners should barely matter.

Effect:
- primary suppressors dominate nearly completely
- secondary variables have little practical room
- tertiary variables should contribute little or nothing

## 7. Required weighting flow

The score pipeline must follow this order:

1. load base weight profile
2. determine eligible variables present in current context
3. resolve primary conditions regime using measured variables only
4. apply regime scaling to variable importance
5. renormalize across remaining eligible variables
6. calculate score contribution traces

No alternate hidden order should be used.

## 8. Missing-data rules

- missing variables must be removed from the eligible set
- a missing primary variable should reduce confidence more than a missing tertiary variable
- no missing measured variable may be replaced with a guessed score value
- the output must include which variables were removed and why

## 9. Required score traces

The engine must expose enough trace information for review and testing.

Minimum trace fields:
- `weight_profile_id`
- `resolved_regime`
- `eligible_variables`
- `removed_variables`
- `base_weights`
- `regime_scaled_weights`
- `final_normalized_weights`
- `top_drivers`
- `top_suppressors`

## 10. Weight-profile design guidance

The implementation agent must not use one generic profile for all months and all regions.

### Example philosophy only
These examples guide the style of the system but do not replace the need for actual profiles.

#### Northern freshwater winter
- primary: air-temp trend, daylight/time-of-day, pressure
- secondary: cloud/light softness, wind
- tertiary: solunar

#### Northern freshwater summer
- primary: intraday heat pattern, daylight timing, pressure
- secondary: cloud cover, wind
- tertiary: solunar gains more importance when regime is supportive

#### Gulf/Florida saltwater
- primary: tide/current, wind fishability
- secondary: pressure, light, measured coastal water temperature context
- tertiary: solunar unless conditions are broadly supportive

## 11. What the implementation agent must not do

- do not collapse all profiles into one static mode-level weight table
- do not let tertiary factors materially rescue highly suppressive conditions
- do not use state as the primary weight-profile axis
- do not hide regime scaling rules in opaque hard-coded math with no trace output

## 12. Deliverables required from the implementation agent

The weighting/regime phase is not complete unless the agent provides:
- explicit weight profile definitions or config files
- explicit tier classification per profile
- regime resolver implementation
- missing-data reweight utility
- score trace output
- a short summary documenting how supportive vs suppressive conditions change secondary and tertiary influence
