# HOW'S FISHING RIGHT NOW?
## Complete Feature Implementation Specification
### Real-Time Fishing Conditions Feature Powered By The Core Intelligence Engine

---

> **Document Purpose:** This document defines the complete `How's Fishing Right Now?` feature. It is written to be handed directly to an AI coding agent or engineering team with no follow-up required.
>
> **Source Of Truth Boundary:** All deterministic environmental intelligence, weighting, scoring, recovery logic, alert logic, window logic, fish-state inference, missing-data normalization, and data-quality metadata come from `core_intelligence_spec.md`. This file does not redefine that logic. It defines how the feature invokes, consumes, displays, caches, and narrates that intelligence.
>
> **Scope:** This is the feature spec for the user-facing conditions product. It covers frontend flow, backend orchestration, prompt engineering, response contracts, UI requirements, caching, failure handling, and replacement rules for legacy logic.

---

## TABLE OF CONTENTS

1. [Feature Purpose And Boundaries](#section-1)
2. [End-To-End User Flow](#section-2)
3. [Feature Architecture And Ownership](#section-3)
4. [Expanded Conditions Page Specification](#section-4)
5. [Backend Orchestration Specification](#section-5)
6. [LLM Payload Construction](#section-6)
7. [System Prompt And Output Contract](#section-7)
8. [Feature Response Schema](#section-8)
9. [Results Page Specification](#section-9)
10. [Caching Strategy](#section-10)
11. [Error Handling And Degradation Rules](#section-11)
12. [Implementation Targets And Replacement Rules](#section-12)

---

## SECTION 1 — FEATURE PURPOSE AND BOUNDARIES {#section-1}

`How's Fishing Right Now?` is a real-time, location-specific fishing conditions assessment.

It tells the user:

- how favorable conditions are right now
- why the score is what it is
- what time windows today are best and worst
- which environmental drivers are helping or hurting
- how fish are behaving in broad, non-species-specific terms

### 1A. What This Feature Is

- A one-tap conditions intelligence feature
- A GPS-driven real-time assessment
- A consumer of the shared core intelligence engine
- A general fish-activity analysis across `freshwater`, `saltwater`, and `brackish`

### 1B. What This Feature Is Not

- Not a lure recommender
- Not a fly recommender
- Not a species-specific analysis
- Not a water-structure or image analysis tool
- Not a trip planner

### 1C. Responsibility Split

#### The Core Intelligence Engine Owns

- environmental variable derivation
- water-type routing
- component weighting
- deterministic scoring
- recovery modifier
- time-window generation
- alerts
- fish behavior state outputs

#### This Feature Owns

- user flow
- expanded page display
- orchestration of engine runs
- orchestration of LLM calls
- feature-specific prompt
- results-page UI
- cache behavior
- final report bundle format

#### The LLM Owns

- clear human-readable explanation
- biologically grounded narrative
- feature-specific summary language
- concise best/worst time reasoning
- practical non-species-specific tips

#### The LLM Explicitly Does Not Own

- score calculation
- weight selection
- alert detection
- tide/solunar/pressure classification
- recovery logic
- window generation

---

## SECTION 2 — END-TO-END USER FLOW {#section-2}

### 2A. Primary User Flow

```text
HOME DASHBOARD
  └── Live Conditions card
        └── user taps card
              └── Expanded Conditions page
                    └── user reviews current conditions
                          └── user taps "How's Fishing Right Now?"
                                └── fresh environment fetch
                                      └── core engine run(s)
                                            └── Claude call(s)
                                                  └── Results page
```

### 2B. Inland Flow

If the user is inland:

1. load expanded conditions page
2. show `freshwater` conditions only
3. on CTA tap, run:
   - fresh `get-environment`
   - one core engine run with `water_type = freshwater`
   - one Claude call
4. show a single-report results page

### 2C. Coastal Flow

If the user is coastal:

1. load expanded conditions page
2. show general conditions cards sourced from the environment snapshot
3. on CTA tap, run:
   - fresh `get-environment`
   - three engine runs in parallel:
     - `freshwater`
     - `saltwater`
     - `brackish`
   - three Claude calls in parallel, one per water type
4. if all three succeed, unlock all three tabs together
5. if one or more reports fail at the report layer, unlock successful tabs immediately and show explicit failed-tab retry states
6. show the results page with:
   - `Freshwater`
   - `Saltwater`
   - `Brackish`

### 2D. GPS Requirement

This feature is GPS-only.

If GPS is unavailable:

- show a location-required screen
- provide a direct action to request location permission
- do not fall back to manual entry

---

## SECTION 3 — FEATURE ARCHITECTURE AND OWNERSHIP {#section-3}

### 3A. Required Inputs

The user does not provide fishing configuration.

The feature requires only:

```json
{
  "latitude": 28.0836,
  "longitude": -82.5716,
  "units": "imperial"
}
```

### 3B. Architecture Overview

```text
Client route: /how-fishing
   │
   ├── reads cached environment for expanded page display
   ├── forces fresh get-environment on CTA tap
   │
   ▼
Backend feature orchestrator: how-fishing Edge Function
   │
   ├── validates subscription and usage limits
   ├── fetches/reuses fresh environment snapshot
   ├── runs core intelligence engine 1x or 3x
   ├── constructs feature-specific LLM payload(s)
   ├── calls Claude 1x or 3x
   ├── packages response bundle
   ├── logs usage and cost
   │
   ▼
Results screen: /how-fishing-results
```

### 3C. Required Backend Modules

This feature must be implemented with three conceptual backend layers:

1. `get-environment`
   Fetches and normalizes raw environment data.

2. `core intelligence engine`
   Consumes environment data and produces deterministic outputs as defined in `core_intelligence_spec.md`.

3. `how-fishing feature orchestrator`
   Consumes engine output, calls Claude, returns feature-ready reports.

### 3D. Required Frontend Surfaces

- dashboard collapsed Live Conditions card
- expanded conditions page: `app/how-fishing.tsx`
- results page: `app/how-fishing-results.tsx`

---

## SECTION 4 — EXPANDED CONDITIONS PAGE SPECIFICATION {#section-4}

This page appears before the report is generated. It gives the user situational awareness and confidence that the app is reading real conditions correctly.

### 4A. Page Purpose

The expanded page must:

- display the latest cached or freshly loaded environment data
- make the user feel informed before generation
- expose the key raw condition cards
- show a deterministic conditions score preview when available
- provide the CTA to generate the full report

### 4B. Required Cards

#### Card 1 — Weather Conditions

Display:

- current air temperature
- humidity
- cloud cover
- current precipitation
- wind speed and direction
- barometric pressure
- pressure trend label

#### Card 2 — Pressure History

Display:

- sparkline of recent pressure history
- current trend label
- last detected cold front timing if any

#### Card 3 — Temperature Trend

Display:

- current air temperature
- 3-day trend label
- 7-day air high/low history

#### Card 4 — Lunar Conditions

Display:

- moon phase
- moon illumination
- moonrise / moonset
- major solunar windows
- minor solunar windows

#### Card 5 — Tide Conditions

Show only for coastal users.

Display:

- current tide phase
- next high / low
- current tide height when available
- daily tidal range
- tide strength label derived from the engine methodology

#### Card 6 — Light Conditions

Display:

- sunrise
- sunset
- civil twilight begin
- civil twilight end
- current light condition label

#### Card 7 — Water Temperature

Display:

- freshwater estimated water temperature when inland
- measured coastal water temperature when coastal, if available
- zone labels
- explicit source label for estimated vs measured readings

Freshwater inferred labeling is mandatory:

- include `Inferred`
- include an explanation disclosure
- never present inferred freshwater temperature as measured

#### Card 8 — Conditions Score Preview

Display:

- deterministic adjusted score
- overall rating
- top score components
- recovery note if applicable

This card is optional only if the engine has not yet been run for the current snapshot. If no precomputed score is available on page load, show a neutral placeholder state until report generation.

### 4C. Button Behavior

The CTA button must:

- read `How's Fishing Right Now?`
- sit at the bottom of the page
- show spinner during report generation
- be disabled while generation is in progress
- force a fresh environment fetch before invoking the feature orchestrator

### 4D. Force-Fresh Rule

The expanded page may show cached environment data.

However:

- tapping the CTA must always force a fresh `get-environment` call
- the report must always be based on one fresh environment snapshot timestamp
- if that fresh snapshot is missing some variables because upstream providers failed partially, the feature may still proceed as long as the core engine returns valid deterministic output with explicit data-quality metadata

V1 behavior:

- no stale-data fallback prompt
- either fetch a fresh snapshot successfully or show error
- a fresh snapshot with partial provider gaps is allowed if the engine marks missing variables explicitly

---

## SECTION 5 — BACKEND ORCHESTRATION SPECIFICATION {#section-5}

The backend feature orchestrator must be the `how-fishing` Supabase Edge Function.

### 5A. Required Execution Order

1. authenticate user
2. validate subscription tier
3. validate usage cap
4. validate coordinates
5. obtain fresh environment snapshot
6. determine coastal vs inland
7. run engine once or three times
8. construct LLM payload(s)
9. call Claude in parallel where needed
10. validate and package responses
11. log usage and AI session metadata
12. return feature bundle

### 5B. Engine Invocation Rules

#### Inland

```typescript
const freshwaterEngine = runCoreIntelligence(env, 'freshwater');
```

#### Coastal

```typescript
const [freshwaterEngine, saltwaterEngine, brackishEngine] = await Promise.all([
  runCoreIntelligence(env, 'freshwater'),
  runCoreIntelligence(env, 'saltwater'),
  runCoreIntelligence(env, 'brackish'),
]);
```

### 5C. Claude Invocation Rules

#### Inland

One Claude call:

```typescript
const freshwaterReport = await callHowFishingLLM(freshwaterEnginePayload);
```

#### Coastal

Three Claude calls in parallel:

```typescript
const [freshwaterReport, saltwaterReport, brackishReport] = await Promise.all([
  callHowFishingLLM(freshwaterPayload),
  callHowFishingLLM(saltwaterPayload),
  callHowFishingLLM(brackishPayload),
]);
```

### 5D. Partial Failure Rule

For coastal runs:

- if one report fails but the others succeed, the response bundle must still return successful reports
- failed tabs must be marked with explicit error metadata
- the UI must show available tabs and a retry state for the failed tab

This is a change from the legacy spec, which waited for all three before unlocking tabs. The engine and backend should support partial success because three parallel LLM calls increase failure surface area.

Frontend presentation rule:

- initial load should still aim to unlock all tabs together when all succeed
- if one fails, show the two successful tabs and a disabled retry/error state for the failed tab rather than hard-failing the whole feature

### 5E. Results Are Not Saved To The Fishing Log

This feature does not create a fishing session and must not auto-log to the journal.

Allowed persistence:

- AI session log row
- usage tracking
- cache storage

Not allowed:

- creating catch logs
- creating trip logs
- creating recommendation history entries

---

## SECTION 6 — LLM PAYLOAD CONSTRUCTION {#section-6}

The LLM must receive the engine outputs, not raw environmental data alone.

### 6A. Required Payload Structure

Each water-type call must receive:

```json
{
  "feature": "hows_fishing_feature_v1",
  "water_type": "saltwater",
  "location": {},
  "environment": {},
  "engine_scoring": {},
  "engine_behavior": {},
  "data_quality": {},
  "alerts": {},
  "time_windows": [],
  "analysis_date_local": "2026-03-11",
  "current_time_local": "09:15"
}
```

### 6B. Required Location Object

```json
{
  "lat": 28.0836,
  "lon": -82.5716,
  "timezone": "America/New_York",
  "coastal": true,
  "nearest_tide_station_id": "8726520"
}
```

### 6C. Required Environment Object

The feature payload must include the relevant engine-normalized environment values used in narrative generation:

```json
{
  "air_temp_f": 71,
  "water_temp_f": 68,
  "water_temp_source": "noaa_coops",
  "water_temp_zone": "active_prime",
  "wind_speed_mph": 9,
  "wind_direction": "SW",
  "cloud_cover_pct": 65,
  "pressure_mb": 1008.4,
  "pressure_change_rate_mb_hr": -0.8,
  "pressure_state": "slowly_falling",
  "precip_48hr_inches": 0.0,
  "precip_7day_inches": 1.2,
  "precip_condition": "no_precip",
  "moon_phase": "waxing_gibbous",
  "moon_illumination_pct": 78,
  "solunar_state": "outside_all_windows",
  "tide_phase_state": "incoming_first_2_hours",
  "tide_strength_state": "above_average_movement",
  "range_strength_pct": 74,
  "light_condition": "midday_overcast",
  "temp_trend_state": "stable",
  "temp_trend_direction_f": -0.4,
  "days_since_front": 6
}
```

### 6D. Required Engine Scoring Object

```json
{
  "weights": {},
  "component_status": {},
  "coverage_pct": 92,
  "reliability_tier": "high",
  "components": {},
  "raw_score": 75,
  "recovery_multiplier": 1.0,
  "adjusted_score": 75,
  "overall_rating": "Excellent"
}
```

### 6E.1 Required Data Quality Object

```json
{
  "missing_variables": [],
  "fallback_variables": ["water_temp_f"],
  "notes": []
}
```

### 6E. Required Engine Behavior Object

```json
{
  "metabolic_state": "active",
  "aggression_state": "strong_feed",
  "feeding_timer": "tide_current",
  "presentation_difficulty": "favorable",
  "positioning_bias": "current_breaks_cuts_passes_flats",
  "secondary_positioning_tags": ["windward_bait_push"],
  "dominant_positive_drivers": ["incoming_tide", "above_average_tidal_range", "active_prime_water_temp"],
  "dominant_negative_drivers": ["outside_solunar_window"]
}
```

### 6F. Required Alerts Object

```json
{
  "cold_stun_alert": false,
  "cold_stun_status": "evaluated",
  "salinity_disruption_alert": false,
  "salinity_disruption_status": "evaluated",
  "rapid_cooling_alert": false,
  "recovery_active": false
}
```

`rapid_cooling_alert` is true when `temp_trend_state == rapid_cooling`.

`recovery_active` is true when `days_since_front` is `0` through `5`.

Implementation note:

- `cold_stun_status = not_evaluable_missing_inputs` remains a supported production outcome when a qualifying 72-hour coastal water-temperature observation is unavailable for the selected NOAA station
- when this status is returned, the feature must treat it as a normal supported state rather than as an engine failure

### 6H. Missing-Data Narration Rules

The LLM payload must include the engine data-quality fields unchanged.

Feature rules:

- if `reliability_tier` is `degraded`, the UI and LLM may still render a normal report, but must acknowledge reduced certainty where appropriate
- if `reliability_tier` is `low_confidence` or `very_low_confidence`, the UI must show a prominent reduced-confidence notice
- the LLM must never invent explanations for variables listed in `missing_variables`
- if an alert status is `not_evaluable_missing_inputs`, the UI must suppress the alert card itself and instead show a small note that the alert could not be fully evaluated
- `cold_stun_status = not_evaluable_missing_inputs` must be handled gracefully and is not, by itself, a reason to fail the report

### 6G. Required Time Windows Array

The feature must pass the deterministic time windows created by the engine.

The LLM must not invent or recalculate windows.

---

## SECTION 7 — SYSTEM PROMPT AND OUTPUT CONTRACT {#section-7}

### 7A. System Prompt — Verbatim

The following system prompt must be used verbatim for the `How's Fishing` feature.

---

**SYSTEM PROMPT — BEGIN**

You are a professional fishing guide writing a short, honest fishing-conditions brief from authoritative deterministic engine output.

Rules:
- The engine is authoritative. Never recalculate or contradict score, alerts, timing windows, or water type.
- Be concise. Anglers should understand the situation in seconds, not minutes.
- Be honest. If conditions are poor, say so directly.
- Explain only the main biological drivers.
- Never give species-specific advice, lure advice, or made-up tactics.
- Respect missing-data boundaries. If water temperature is estimated rather than measured, say estimated. If data quality is reduced, say so briefly.
- Use the exact best and worst windows provided. Never invent windows.
- When engine time_windows include edge-case drivers (e.g. `heat_suppression_midday`, `midday_warming_window`, `runoff_*`, `slack_cap_applied`), explain the biological reason—e.g. cold-water fish prioritizing thermal comfort over weak solunar, or heat suppressing midday activity.
- If `post_front_compression` appears, explain that opportunity is compressed into shorter windows under clear post-front recovery; do not describe it as broad steady action.
- If `cold_inshore_midday_warming` appears, frame it as a protected inshore/brackish cold-water comfort effect. Do not generalize it to all saltwater.
- For brackish salinity_disruption_alert: describe as rainfall-driven freshwater influx disrupting salinity stability, not measured salinity.

Length limits:
- headline_summary: exactly 1 sentence, max 22 words
- overall_fishing_rating.summary: 1 sentence, max 26 words
- best_times_to_fish_today: max 2 items, reasoning max 18 words each
- worst_times_to_fish_today: max 2 items, reasoning max 18 words each
- key_factors values: short sentence fragments, max 18 words each
- tips_for_today: exactly 3 tips, max 14 words each

Water temperature wording:
- If water_temp_source is freshwater_air_model, call it an estimate from recent air-temperature history.
- If water_temp_source is noaa_coops, call it a measured coastal water temperature.

Output valid JSON only matching the exact schema below.

Output schema:

```json
{
  "headline_summary": "string",
  "overall_fishing_rating": {
    "label": "Exceptional | Excellent | Good | Fair | Poor | Tough",
    "summary": "string"
  },
  "best_times_to_fish_today": [
    {
      "time_range": "string",
      "label": "PRIME | GOOD",
      "reasoning": "string"
    }
  ],
  "worst_times_to_fish_today": [
    {
      "time_range": "string",
      "reasoning": "string"
    }
  ],
  "key_factors": {
    "barometric_pressure": "string",
    "temperature_trend": "string",
    "light_conditions": "string",
    "tide_or_solunar": "string",
    "moon_phase": "string",
    "wind": "string",
    "precipitation_recent_rain": "string"
  },
  "tips_for_today": ["string", "string", "string"]
}
```

**SYSTEM PROMPT — END**

---

### 7B. Output Validation Rules

The backend must validate that Claude returned:

- valid JSON
- all required top-level keys
- arrays where arrays are expected
- strings where strings are expected

If the response is malformed:

- retry once
- if the second attempt still fails, return a structured feature error
- never silently substitute a fake report

### 7C. No Mock Fallback Rule

The feature must not use mock narrative content in production.

This explicitly replaces the current legacy behavior where `how-fishing-results` uses mock fallback content to make the page feel complete.

Allowed fallback:

- show a proper error state

Not allowed fallback:

- fabricated best times
- fabricated score
- fabricated factors
- fabricated tips

---

## SECTION 8 — FEATURE RESPONSE SCHEMA {#section-8}

The `how-fishing` Edge Function must return a bundled feature response that is ready for UI rendering.

### 8A. Inland Response

```json
{
  "feature": "hows_fishing_feature_v1",
  "mode": "single",
  "default_tab": "freshwater",
  "generated_at": "2026-03-11T13:15:00Z",
  "cache_expires_at": "2026-03-11T14:00:00Z",
  "reports": {
    "freshwater": {
      "water_type": "freshwater",
      "engine": {},
      "llm": {}
    }
  }
}
```

### 8B. Coastal Response

```json
{
  "feature": "hows_fishing_feature_v1",
  "mode": "coastal_multi",
  "default_tab": "freshwater",
  "generated_at": "2026-03-11T13:15:00Z",
  "cache_expires_at": "2026-03-11T14:00:00Z",
  "reports": {
    "freshwater": {
      "water_type": "freshwater",
      "engine": {},
      "llm": {}
    },
    "saltwater": {
      "water_type": "saltwater",
      "engine": {},
      "llm": {}
    },
    "brackish": {
      "water_type": "brackish",
      "engine": {},
      "llm": {}
    }
  },
  "failed_reports": []
}
```

### 8C. Per-Report Required Structure

Each report object must contain:

```json
{
  "status": "ok",
  "water_type": "saltwater",
  "engine": {
    "environment": {},
    "scoring": {},
    "behavior": {},
    "data_quality": {},
    "alerts": {},
    "time_windows": []
  },
  "llm": {
    "headline_summary": "string",
    "overall_fishing_rating": {
      "label": "Excellent",
      "summary": "string"
    },
    "best_times_to_fish_today": [],
    "worst_times_to_fish_today": [],
    "key_factors": {},
    "tips_for_today": []
  },
  "error": null
}
```

### 8D. Why The Engine Is Embedded In The Response

The results UI must render both:

- the narrative report
- the deterministic score, breakdown, and alerts

Therefore the engine output must be returned to the client alongside the LLM output.

---

## SECTION 9 — RESULTS PAGE SPECIFICATION {#section-9}

The results page must present the deterministic engine output and the LLM narrative together.

### 9A. Page-Level Rules

- default tab is always `Freshwater`
- inland users see one report only
- coastal users see three tabs
- if a tab failed, it shows an error/retry state, not blank content

### 9B. Required Components

#### 1. Water Type Tabs

For coastal users:

- `Freshwater`
- `Saltwater`
- `Brackish`

For inland users:

- no tab bar

#### 2. Overall Fishing Rating

Display:

- adjusted score from engine
- overall rating label from engine
- LLM summary

This score must be displayed as the real engine score out of `100`.

Do not map it to a synthetic `1–10` scale.

#### 3. Recovery Note

If `recovery_active == true`, show a prominent callout:

`Cold front X days ago — fish still recovering`

#### 3A. Confidence / Data Quality Notice

Display:

- `reliability_tier`
- short explanation built from `missing_variables` and `fallback_variables`

Rules:

- `high`: no warning styling
- `degraded`: subtle info treatment
- `low_confidence` or `very_low_confidence`: prominent caution treatment
- never hide this notice if the engine returned missing or fallback variables

#### 4. Rapid Cooling Alert

If `rapid_cooling_alert == true`, show a prominent callout:

`Rapid temperature drop detected — active feed-up window may be brief`

#### 5. Cold Stun Alert

If `cold_stun_alert == true`, show a highest-severity warning card.

This alert must visually outrank normal score cards.

If `cold_stun_status == not_evaluable_missing_inputs`:

- do not show the cold stun warning card
- show a small supporting note only if useful for transparency, such as `Cold stun could not be fully evaluated with current water-temperature history`
- do not let this status suppress the rest of the report

#### 6. Salinity Disruption Alert

If `salinity_disruption_alert == true`, show a prominent estuarine warning card.

#### 7. Best Times To Fish Today

Display LLM-rendered windows using the engine windows as source.

Each item must include:

- time range
- label (`PRIME` or `GOOD`)
- one-sentence reasoning

#### 8. Worst Times To Fish Today

Display:

- time range
- one-sentence reasoning

#### 9. Key Factors Breakdown

Display one card or section per factor:

- barometric pressure
- temperature trend
- light conditions
- tide or solunar depending on water type
- moon phase
- wind
- precipitation / recent rain

#### 10. Score Breakdown

Display the deterministic engine component scores.

At minimum:

- variable name
- component score
- component max weight

Ideal presentation:

- horizontal bars or ranked component list

#### 11. Tips For Today

Display 2–3 concise practical tips.

#### 12. Timestamp And Cache Status

Display:

- generated time
- freshness status
- cache expiration hint

#### 13. Recommender CTA

Show:

`Want species-specific lure recommendations for these conditions? → Open Recommender`

### 9C. Design Integrity Rules

- never hide the adjusted score
- never replace engine values with display-only approximations
- never fabricate missing data
- never hide active alerts beneath generic summary text

---

## SECTION 10 — CACHING STRATEGY {#section-10}

### 10A. Environment Cache

The dashboard and expanded page may use cached environment data for display.

Recommended TTL:

- `15 minutes` for dashboard widget view
- `30 minutes` maximum for general environment display cache

### 10B. Report Cache

Per-water-type report caching is required.

Cache key:

```text
how_fishing_report_{lat}_{lon}_{water_type}_{local_date}
```

Recommended TTL:

- `45 minutes`

### 10C. Coastal Bundle Cache

The client may also store the combined response bundle for convenience, but per-water-type server cache remains the source of truth.

### 10D. Refresh Rules

- opening expanded page: may use cache
- tapping report CTA: must force fresh environment fetch
- if a report cache entry is fresh and matches the same water type, location, and date, it may be returned without another Claude call
- engine outputs tied to that cached report must be returned with it

### 10E. No Mixed-Staleness Rule

Within one report bundle:

- all reports must be generated from the same environment snapshot timestamp

Do not combine:

- one old freshwater report
- one fresh saltwater report
- one different-time brackish report

If using cached bundle data, the full bundle must correspond to one shared snapshot.

---

## SECTION 11 — ERROR HANDLING AND DEGRADATION RULES {#section-11}

### 11A. GPS Failure

If location is unavailable:

- show location-required state
- offer permission request or settings deep link

### 11B. Environment Fetch Failure

If fresh environment fetch fails during report generation:

- show explicit error
- do not call Claude using only stale cached environment data in V1
- if the fresh environment snapshot succeeds but contains partial provider gaps, continue if the core engine returns valid output with explicit data-quality metadata

### 11C. Engine Failure

If a core engine run fails:

- do not call Claude for that water type
- return an explicit feature error for that report

### 11D. Claude Failure

If Claude fails:

- retry once
- if still failing, mark that report as failed

### 11E. Report Validation Failure

If Claude returns malformed output:

- retry once
- if still invalid, return a report-level error

### 11F. Usage Cap Failure

If the user exceeds usage cap:

- return `usage_cap_exceeded`
- do not run Claude
- do not partially create reports

### 11G. Subscription Failure

If unsubscribed:

- return `subscription_required`
- client shows subscribe prompt

---

## SECTION 12 — IMPLEMENTATION TARGETS AND REPLACEMENT RULES {#section-12}

### 12A. Target Files And Surfaces

This feature should be implemented across these app surfaces:

- `TightLinesAI/supabase/functions/how-fishing/index.ts`
- `TightLinesAI/supabase/functions/get-environment/index.ts`
- `TightLinesAI/app/how-fishing.tsx`
- `TightLinesAI/app/how-fishing-results.tsx`
- `TightLinesAI/components/LiveConditionsWidget.tsx`
- supporting shared engine module(s) used by backend orchestration

### 12B. Legacy Logic This Spec Replaces

The following legacy feature behavior must be removed or replaced during implementation:

1. Any `how-fishing` prompt that asks Claude to infer overall fishing quality directly from raw weather without engine outputs.
2. Any UI logic that maps labels like `Good` or `Fair` into a fake `1–10` score.
3. Any mock report fallback content used to make the results page appear complete.
4. Any old `HowFishingResponse` type that omits engine output and score breakdown.

### 12C. Legacy Logic That Stays

These remain valid and should be reused where appropriate:

- `get-environment` raw data fetching
- pressure trend classification
- temperature trend classification
- moon / solunar derivation
- general environment caching

### 12D. Implementation Success Criteria

The feature is complete only when all of the following are true:

1. the UI renders a deterministic score out of `100`
2. the score comes from the core intelligence engine, not Claude
3. the LLM output is based on engine payloads, not raw weather interpretation
4. coastal users receive three distinct reports
5. inland users receive one freshwater report
6. tabs and alerts behave correctly
7. score breakdown is visible
8. no mock/fake narrative fallback remains
9. caching works without serving mismatched snapshot times
10. missing/fallback variables are surfaced explicitly to the UI and never silently hidden

---

*End of Specification — `How's Fishing Right Now?` is a feature consumer of the shared deterministic core intelligence engine. The engine computes the truth; this feature presents that truth clearly, credibly, and without ambiguity.*
