# ENGINE_REBUILD_MASTER_PLAN

## Goal

Replace the current multi-generation fishing engine stack with one clean shared condition layer and one simplified How's Fishing engine that produces consistent daily reports across:

- all supported mainland US regions
- all months
- all supported water contexts:
  - Freshwater Lake/Pond
  - Freshwater River
  - Coastal

The new system is intentionally **not** a deep fish-behavior simulator. It is a **daily conditions outlook engine** with controlled narration and simplified UI.

---

## What the rebuilt engine is

The rebuilt system has two active engine layers:

### 1) Shared condition normalization layer
This layer:
- accepts resolved location and live environmental data
- resolves region and context
- converts raw inputs into normalized condition states

It does **not** produce the final fishing score by itself.

### 2) How's Fishing scoring layer
This layer:
- reads normalized condition states
- applies context weights and light month/region modifiers
- outputs a normalized 0–100 score
- maps score to a band
- selects top drivers and suppressors
- emits one actionable tip and one optional broad daypart note
- provides a tightly-scoped narration payload

---

## What the rebuilt engine is not

The rebuilt system must **not** do the following:

- no exact best/fair/poor time-window engine
- no 7-day calendar / future-day report flow in this rebuild
- no separate brackish tab if it produces the same report as coastal
- no species-specific behavior engine
- no giant "all features in one engine" architecture
- no freshwater water temperature inference
- no measured coastal water temperature use in How's Fishing
- no narrative claims that exceed the engine output
- no dependency on old V2/V3 compatibility output shape

---

## Final user-facing contexts

### Internal engine contexts
- `freshwater_lake_pond`
- `freshwater_river`
- `coastal`

### User-facing labels
- Freshwater Lake/Pond
- Freshwater River
- Coastal

### Important rule
The UI must not show separate saltwater and brackish tabs during this rebuild. They are merged into a single **Coastal** context and a single coastal report path.

---

## Full-day report rule

Every report represents the local day for the selected location:

- `00:00:00` local time through `23:59:59` local time

The score must represent the entire local calendar day.

Broad timing guidance is allowed only as a **daypart note**, not as exact windows.

Allowed examples:
- Better early
- Better late
- Warmest part of the day may help
- No strong timing edge today
- Moving-water periods matter most

Not allowed:
- exact hourly recommendation windows
- a rebuilt version of the old prime / fair / slow window engine

---

## Final scored variables by context

### Freshwater Lake/Pond
Scored variables:
- temperature_condition
- pressure_regime
- wind_condition
- light_cloud_condition
- precipitation_disruption

### Freshwater River
Scored variables:
- temperature_condition
- pressure_regime
- wind_condition
- light_cloud_condition
- runoff_flow_disruption

### Coastal
Scored variables:
- temperature_condition
- pressure_regime
- wind_condition
- light_cloud_condition
- tide_current_movement
- precipitation_disruption

### Not scored
- solunar

Solunar may only be used as a small input to the **broad daypart note**. It may not directly change the daily score.

---

## Shared input contract

The shared layer must accept a resolved request object with these fields:

```ts
type SharedEngineRequest = {
  latitude: number
  longitude: number
  state_code: string | null
  region_key: RegionKey
  local_date: string // YYYY-MM-DD in the target location timezone
  local_timezone: string
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal"
  environment: {
    current_air_temp_f?: number | null
    daily_mean_air_temp_f?: number | null
    prior_day_mean_air_temp_f?: number | null
    day_minus_2_mean_air_temp_f?: number | null
    pressure_mb?: number | null
    pressure_history_mb?: number[] | null
    wind_speed_mph?: number | null
    cloud_cover_pct?: number | null
    precip_24h_in?: number | null
    precip_72h_in?: number | null
    precip_7d_in?: number | null
    active_precip_now?: boolean | null
    tide_movement_state?: string | null
    tide_station_id?: string | null
    sunrise_local?: string | null
    sunset_local?: string | null
    solunar_peak_local?: string[] | null
  }
  data_coverage: {
    source_notes?: string[]
  }
}
```

The shared layer must be location-agnostic. The request may come from:
- current device location
- future manual searched location

The engine contract must not assume device GPS specifically.

---

## Shared normalized output contract

The shared layer must output a normalized object like:

```ts
type SharedNormalizedOutput = {
  location: {
    latitude: number
    longitude: number
    state_code: string | null
    region_key: RegionKey
    local_date: string
    local_timezone: string
  }
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal"
  normalized: {
    temperature: {
      context_group: "freshwater" | "coastal"
      band_label: "very_cold" | "cool" | "optimal" | "warm" | "very_warm"
      band_score: -2 | -1 | 0 | 1 | 2
      trend_label: "warming" | "stable" | "cooling"
      trend_adjustment: -1 | 0 | 1
      shock_label: "none" | "sharp_warmup" | "sharp_cooldown"
      shock_adjustment: -1 | 0
      final_score: -2 | -1 | 0 | 1 | 2
    }
    pressure_regime: VariableState
    wind_condition: VariableState
    light_cloud_condition: VariableState
    precipitation_disruption?: VariableState
    runoff_flow_disruption?: VariableState
    tide_current_movement?: VariableState
  }
  available_variables: string[]
  missing_variables: string[]
  reliability: "high" | "medium" | "low"
}
```

`VariableState` is defined later in the scoring spec.

---

## Final band names

Daily score bands must be:

- Poor
- Fair
- Good
- Excellent

No other public-facing band set should be used in the rebuilt feature.

---

## Region system

### Canonical regions
1. `northeast`
2. `southeast_atlantic`
3. `florida`
4. `gulf_coast`
5. `great_lakes_upper_midwest`
6. `midwest_interior`
7. `south_central`
8. `mountain_west`
9. `southwest`
10. `pacific_coast`

### State-to-region mapping
```ts
const STATE_TO_REGION: Record<string, RegionKey> = {
  ME: "northeast",
  NH: "northeast",
  VT: "northeast",
  MA: "northeast",
  RI: "northeast",
  CT: "northeast",
  NY: "northeast",
  NJ: "northeast",
  PA: "northeast",

  DE: "southeast_atlantic",
  MD: "southeast_atlantic",
  VA: "southeast_atlantic",
  NC: "southeast_atlantic",
  SC: "southeast_atlantic",
  GA: "southeast_atlantic",

  FL: "florida",

  AL: "gulf_coast",
  MS: "gulf_coast",
  LA: "gulf_coast",
  TX: "gulf_coast",

  OH: "great_lakes_upper_midwest",
  MI: "great_lakes_upper_midwest",
  IN: "great_lakes_upper_midwest",
  IL: "great_lakes_upper_midwest",
  WI: "great_lakes_upper_midwest",
  MN: "great_lakes_upper_midwest",

  IA: "midwest_interior",
  MO: "midwest_interior",
  KS: "midwest_interior",
  NE: "midwest_interior",
  SD: "midwest_interior",
  ND: "midwest_interior",

  WV: "south_central",
  KY: "south_central",
  TN: "south_central",
  AR: "south_central",
  OK: "south_central",

  MT: "mountain_west",
  WY: "mountain_west",
  CO: "mountain_west",
  UT: "mountain_west",
  ID: "mountain_west",

  AZ: "southwest",
  NM: "southwest",
  NV: "southwest",

  CA: "pacific_coast",
  OR: "pacific_coast",
  WA: "pacific_coast",
}
```

### Geofencing rule
For V1 of the rebuild:
- reverse geocode to state where possible
- map state to region
- if state resolution is unavailable, use a fallback geospatial resolver or nearest-state bounds approach
- the region resolver must return one of the ten canonical keys

---

## Coastal availability rule

This is a **UI eligibility rule**, not an engine rule.

### Rule
Show the **Coastal** option only if the user is within 50 miles of an ocean coastline.

### Important implementation note
The existing `lib/coastalProximity.ts` uses simplified bounding boxes. The rebuild should preserve the product rule but may keep the current box-based implementation as an acceptable first pass if no precise coastline-distance utility is added during this rebuild.

### Great Lakes rule
Great Lakes shorelines remain **freshwater only**.

---

## Reliability and graceful degradation

The system must always return a report.

If a scored variable is missing:
1. omit that variable from the scored set
2. dynamically renormalize remaining weights
3. downgrade reliability when appropriate
4. prevent narration from claiming insight based on the missing variable

### Minimum-variable rule
If fewer than **3 scored variables** are available:
- still return a report
- force reliability to `low`
- soften narrative language
- reduce specificity in tips and daypart guidance

### Reliability tiers
- `high` — all or nearly all expected variables available
- `medium` — one or more key variables missing, but enough coverage for a normal report
- `low` — too much missing data for normal confidence, but still enough to return a useful broad report

---

## What the final report must contain

The rebuilt How's Fishing report must include:
- numeric score (0–100)
- score band (Poor / Fair / Good / Excellent)
- one concise summary line
- up to 2 drivers
- up to 2 suppressors
- 1 context-aware actionable tip
- optional broad daypart note
- optional reliability note when medium or low

Removed from the rebuilt feature:
- exact best/fair/poor time windows
- multiple complex section stacks tied to the old engine
- 7-day forecast strip and forecast-day report generation
- separate saltwater vs brackish tabs

---

## Scope for this rebuild

### In scope
- shared normalization layer
- new scoring layer
- temperature band tables
- weight modifiers
- dynamic missing-variable reweighting
- new report contract
- simplified narration
- simplified How's Fishing UI
- deletion / archival of old engine generations
- removal of 7-day forecast path from How's Fishing UI

### Out of scope
- lure/fly recommender implementation
- water reader implementation
- species-specific fishing logic
- deep habitat modeling
- exact tide timing optimization beyond broad daypart use
- exact hourly opportunity windows

---

## Non-engine infrastructure to preserve

The rebuild must preserve and continue using:
- auth
- subscription / usage cap flow
- Supabase edge function structure
- environment fetching integrations
- timezone-aware date handling
- usage logging / gating
- location resolution flow
- current app routing and shell where not in conflict with the new feature

---

## Implementation architecture

### New folder intent (recommended)
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

### Recommended logical modules
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

### Important rule
Do not create a new giant universal engine tree. Build only what the How's Fishing rebuild actually needs.

---

## Cleanup intent

The current engine clutter exists because the codebase carries:
- `coreIntelligence`
- `engineV2`
- `engineV3`
- old docs for several engine generations
- a frontend contract still shaped around old report complexity

The rebuild must:
- remove old engines from active use
- simplify output contracts
- simplify UI
- remove obsolete docs from the repo doc surface or archive them clearly

See the cleanup matrix for exact actions.

---

## Final success definition

The rebuild succeeds only if:
- the app has one clear active How's Fishing engine path
- the report works for any region, any month, and any supported context
- the report remains useful when data is partially missing
- the UI matches the simplified output
- the repo no longer presents multiple active engine generations as if they are all current
