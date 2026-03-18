# HOWS_FISHING_REPORT_AND_NARRATION_SPEC

## Purpose

This document defines:
- the final report contract
- what the frontend should display
- the narration payload
- the narration rules
- tip-generation expectations
- forbidden output behavior

The LLM is not the source of truth. The engine is the source of truth.

---

## Final report output contract

```ts
type HowsFishingReport = {
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal"
  display_context_label: "Freshwater Lake/Pond" | "Freshwater River" | "Coastal"
  location: {
    latitude: number
    longitude: number
    state_code: string | null
    region_key: string
    timezone: string
    local_date: string
    location_label?: string | null
  }
  score: number // integer 0-100
  band: "Poor" | "Fair" | "Good" | "Excellent"
  summary_line: string
  drivers: Array<{
    variable: string
    label: string
    effect: "positive"
  }>
  suppressors: Array<{
    variable: string
    label: string
    effect: "negative"
  }>
  actionable_tip: string
  daypart_note?: string | null
  reliability: "high" | "medium" | "low"
  reliability_note?: string | null
  normalized_debug?: {
    available_variables: string[]
    missing_variables: string[]
  }
}
```

### Important contract notes
- `score` must be visible to the user
- `band` must be visible to the user
- `summary_line` is concise and direct
- `drivers` and `suppressors` must come from contribution logic
- `actionable_tip` must be context-aware
- `daypart_note` is optional and broad only
- `reliability_note` appears only when it helps the user interpret reduced confidence

---

## Final user-visible report sections

The rebuilt report should show:

1. score + band
2. one summary line
3. drivers (up to 2)
4. suppressors (up to 2)
5. one actionable tip
6. one optional broad daypart note
7. reliability note only when medium/low

---

## Removed output sections

Do not keep these sections in the rebuilt report:
- prime/good/fair/worst time windows
- exact time ranges
- multiple timing cards
- weekly forecast day prompts
- forecast strip
- multi-tab saltwater / brackish split

---

## Narration payload contract

The engine should produce a small narration payload:

```ts
type NarrationPayload = {
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal"
  display_context_label: string
  score: number
  band: "Poor" | "Fair" | "Good" | "Excellent"
  summary_line_seed: string
  drivers: string[]
  suppressors: string[]
  actionable_tip_seed: string
  daypart_note_seed?: string | null
  reliability: "high" | "medium" | "low"
  reliability_note_seed?: string | null
}
```

The LLM may rewrite for readability but may not add new engine claims.

---

## Narration rules

### Core rule
The engine decides the content.
The LLM only turns it into clean, readable language.

### Required behavior
The LLM must:
- preserve the score band meaning
- preserve the summary meaning
- preserve the driver/suppressor meaning
- preserve the actionable tip meaning
- preserve reliability softness when reliability is medium or low
- keep phrasing concise
- keep phrasing context-aware

### Forbidden behavior
The LLM must not:
- invent exact windows
- mention missing variables as if they were available
- claim species-specific behavior
- introduce new score reasons not in the payload
- mention measured water temp for freshwater
- split coastal into separate salt/brackish logic in narration
- turn a broad daypart note into an hourly schedule

---

## Context-aware narration style

### Freshwater Lake/Pond
Allowed framing:
- stillwater
- broad daily conditions
- low-light help
- moderate wind/chop can help or hinder
- stable day vs mixed day

Avoid:
- river flow language
- tide/current language

### Freshwater River
Allowed framing:
- runoff
- flow disruption
- changing clarity
- stable river conditions
- warmer or cooler daypart implications when temperature is dominant

Avoid:
- tide/current language
- generic lake-chop language

### Coastal
Allowed framing:
- moving water
- wind exposure
- tide/current advantage
- broad low-light help
- protected water guidance when wind is a suppressor

Avoid:
- separate brackish/saltwater tabs or output distinctions
- offshore-specific claims not supported by the engine

---

## Tip-generation rules

Tips must be based on:
1. dominant scored variable meaning
2. context
3. broad timing implication where relevant

### Tip rules by common scenarios

#### Temperature-dominant positive in cold-month freshwater
If temperature is a top positive contributor in a cold-month freshwater case:
- tip can point toward the warmer part of the day
- especially valid for winter / early spring northern freshwater

#### Temperature-dominant negative in hot-month freshwater
If very warm temperature is a top suppressor in hot-month freshwater:
- tip can point toward cooler / lower-light periods
- tip should not become an exact hourly instruction

#### Runoff-dominant negative in rivers
Tip can emphasize:
- reduced clarity
- unstable flow
- protected/slower water
- lower expectation language if needed

#### Tide/current-dominant positive in coastal
Tip can emphasize:
- moving water periods matter most
- do not waste the best movement windows
- keep note broad, not exact

#### Wind-dominant negative
Tip can emphasize:
- protected water
- less exposed banks/shores
- reduced presentation options

---

## Daypart note rules

### Allowed triggers
- low_light positive context
- temperature timing implication
- tide movement timing implication
- minor solunar hint
- no clear timing edge

### Allowed outputs
- Better early
- Better late
- Warmest part of the day may help
- Cooler / lower-light periods may be better
- Moving-water periods matter most
- No strong timing edge today

### Not allowed
- exact time ranges
- multiple ranked time windows
- anything crossing midnight
- tomorrow references

---

## Reliability wording

### High
Normally no visible reliability note is required.

### Medium
Use a short note only if useful:
- Today's outlook is still usable, but one or two inputs were limited.

### Low
Use a clearer note:
- Today's report is broader than usual because some key inputs were limited.

### Important rule
Low reliability should soften certainty, not make the report useless.

---

## Suggested LLM prompt rules

The prompt should instruct the model to:
- keep the answer short
- preserve engine meaning
- avoid exact timing invention
- avoid species-specific claims
- stay context-aware
- never narrate missing variables as present
- use the seeds and rewrite only for readability

---

## Example report shape

```json
{
  "context": "freshwater_river",
  "display_context_label": "Freshwater River",
  "score": 71,
  "band": "Good",
  "summary_line": "A warmer-than-normal winter day gives this river a better look than usual, even though conditions are not perfect.",
  "drivers": [
    { "variable": "temperature_condition", "label": "Warmer-than-normal air is helping for this time of year.", "effect": "positive" }
  ],
  "suppressors": [
    { "variable": "pressure_regime", "label": "Pressure is not especially supportive today.", "effect": "negative" }
  ],
  "actionable_tip": "Let the warmer part of the day work for you rather than treating the whole day the same.",
  "daypart_note": "Warmest part of the day may help.",
  "reliability": "high"
}
```
