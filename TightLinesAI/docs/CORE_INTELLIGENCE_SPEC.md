# Core Intelligence Engine — Specification

**Last updated:** 2026-03-13 (post Engine Refinement Sweeps 1-3)
**Location:** `supabase/functions/_shared/coreIntelligence/`

---

## 1. Purpose

A deterministic, biology-first scoring engine that evaluates fishing conditions using real-time environmental data. No species-specific rules. No folklore. The engine answers: given these conditions, how favorable is it for fish to be active, feeding, and catchable?

The engine is deterministic and repeatable — same inputs always produce identical outputs.

---

## 2. Pipeline

```
EnvironmentSnapshot (normalized input)
    |
    v
deriveDerivedVariables(env, waterType)     → DerivedVariables (~30 intermediate states)
    |
    v
computeRawScore(env, dv, waterType)        → ScoringOutput (weighted component scores)
    |
    v
detectColdFront(env) + recoveryMultiplier  → adjustedScore (front penalty applied)
    |
    v
getOverallRating(adjustedScore)            → OverallRating label
    |
    v
computeTimeWindows(env, dv, scoring, ...)  → best_windows, fair_windows, worst_windows
    |
    v
deriveBehavior(env, dv, waterType)         → BehaviorOutput (metabolic, aggression, positioning)
    |
    v
EngineOutput (full result)
```

---

## 3. Input: EnvironmentSnapshot

Normalized by `envAdapter.ts` from the raw `EnvironmentData` API response. All fields nullable for partial-data resilience.

Key fields:
- `air_temp_f`, `water_temp_f`, `wind_speed_mph`, `wind_gust_mph`, `wind_direction`
- `pressure_mb`, `hourly_pressure_mb[]` (for trend calculation)
- `cloud_cover_pct`, `precip_rate_in_hr`, `humidity_pct`
- `sunrise`, `sunset`, `solar_noon` (ISO timestamps)
- `moon_phase_label`, `moon_illumination_pct`, `moonrise`, `moonset`
- `solunar_major[]`, `solunar_minor[]` (SolunarPeriod with start/end)
- `tide_high_low[]` (TidePrediction with time/height/type)
- `coastal: boolean`, `freshwater_subtype: "lake" | "river" | null`
- `altitude_ft: number | null`
- `gust_speed: number | null`
- `daily_high_temps[]`, `daily_low_temps[]` (7-day arrays)
- `latitude`, `longitude`, `timestamp_utc`, `timezone`

---

## 4. Derived Variables

Computed in `derivedVariables.ts`. Key derived states:

### 4.1 Latitude System (5-band)
- `effective_latitude` — adjusted for altitude (+1.2 deg per 1000ft above 1500ft baseline)
- `latitude_band`: `deep_south` (<30) | `south` (30-34) | `mid` (34-39) | `north` (39-44) | `far_north` (>=44)

### 4.2 Seasonal States
- **Freshwater:** `SeasonalFishBehaviorState` — 11 states including `deep_winter_survival`, `late_winter_prespawn`, `spawn_period`, `post_spawn_recovery`, `early_summer_feed`, `peak_summer`, `summer_heat_stress`, `early_fall_feed`, `fall_turnover`, `late_fall_cooldown`, `mild_winter_active`
- Uses `FRESHWATER_SEASONAL_MAP` (5-band x 12-month lookup) + `RIVER_SPAWN_OVERRIDES` (spawn shifts 1 month earlier for north/far_north rivers)
- **Saltwater:** `SaltwaterSeasonalState` — 5 states: `sw_cold_inactive`, `sw_transitional`, `sw_summer_peak`, `sw_summer_heat_stress`, `sw_fall_feed`
- Uses `SALTWATER_SEASONAL_MAP` (3-band coastal lookup: north_coast/mid_coast/south_coast)

### 4.3 Pressure Trend
- Tracks actual elapsed hours (not fixed 3h assumption) via closest data point timestamp
- Guards against stale data (>2h gap) and near-zero elapsed time (<0.5h)
- Returns `pressure_trend_state`: `rapidly_rising`, `slowly_rising`, `stable`, `slowly_falling`, `rapidly_falling`

### 4.4 Water Temperature
- **Lake path:** Air-temp correction table + seasonal offset + 32F hard floor + deep-winter clamp for north/far_north
- **River path:** Groundwater blending model: `alpha * air_temp + (1-alpha) * groundwater_base`. Alpha varies by latitude band and season. Spring snowmelt dampening applied. 33F floor.
- `water_temp_zone`: `near_shutdown_cold`, `lethargic`, `transitional`, `comfortable`, `peak_aggression`, `thermal_stress_heat`

### 4.5 Solunar (Phase-Modulated)
- Window durations vary by moon phase: New/Full = 75/45min, Gibbous = 65/35, Quarter = 50/28, Crescent = 35/20
- Transition zones: `within_60min_of_major` (score 40), `within_90min_of_major` (score 20), `within_60min_of_minor` (score 18)

### 4.6 Wind-Tide Relation
- Approximates tidal flow from US coast geometry (East/West/Gulf)
- Returns `wind_with_tide`, `wind_against_tide`, or `wind_tide_neutral`

### 4.7 Severe Weather Detection
- Triggers on: wind >30mph, gusts >45mph, air temp <0F, wind chill <-10F (NWS formula), precip >1in/hr
- Returns `severe_weather_alert: boolean` and `severe_weather_reasons: string[]`

### 4.8 Other Derived Variables
- `light_condition`: 6 states based on sun position and cloud cover
- `precip_condition`: none/drizzle/light_rain/moderate_rain/heavy_rain/snow
- `freshwater_cold_context`: uses per-band cold/warm season month tables
- `wind_tide_relation`: for coastal scoring

---

## 5. Scoring Engine

`scoreEngine.ts` — weighted component scoring per water type.

### 5.1 Components by Water Type

**Freshwater:** water_temp, pressure, solunar, light, wind, precip, temp_trend
**Saltwater:** water_temp, pressure, solunar, light, wind, precip, temp_trend, tide_phase, tide_strength, wind_tide
**Brackish:** water_temp, pressure, solunar, light, wind, precip, temp_trend, tide_phase, tide_strength, wind_tide

Each component produces a `pct` (0-100) which is multiplied by its weight and summed into a raw score (0-100).

### 5.2 Cliff Elimination (Sweep 2)
- **Light:** Interpolates in transition zones (cloud cover 30-40% and 65-75%) instead of hard bucket boundaries
- **Pressure:** Blend zones at +/-0.4-0.6 mb/hr boundaries using `getStablePressureScore` helper

### 5.3 Seasonal Scoring
- `mild_winter_active`: zone boosts (+15/12/8/6 for cold through active zones)
- Saltwater seasonal: full scoring block for all 5 `SaltwaterSeasonalState` values
- `scoreTempTrend`: seasonal modifiers for both freshwater mild_winter and saltwater states

### 5.4 Front Detection and Recovery
- `detectColdFront()`: checks pressure drop + temp drop + wind shift
- Recovery multiplier reduces adjusted score during front passage and recovery
- `recovery_active` only true when `frontSeverity !== null`

### 5.5 Component Detail Debug
- `component_detail: Record<string, { pct, score, weight }>` included in ScoringOutput for debugging

---

## 6. Time Window Engine

`timeWindowEngine.ts` — 30-minute block analysis across 24 hours.

### 6.1 4-Tier Label System
Every block gets exactly one label: `PRIME` | `GOOD` | `FAIR` | `SLOW`. No gaps — all 24 hours are covered.

### 6.2 Block Scoring
Each 30-min block is scored by combining:
- Base score (from scoring engine)
- Light category bonus/penalty
- Solunar alignment bonus
- Water type-specific modifiers (tide phase, thermal timing)

### 6.3 Thermal Timing Profiles
- Standard freshwater: dawn/dusk bonus
- `mild_winter_active`: dawn/dusk bonus 24, midday warm bonus 18, 10:00-16:00 window
- Summer heat: midday suppression
- Cold season: midday warming bias

### 6.4 Edge-Case Rules (8 rules)
1. **Freshwater cold-season midday warming** — reduces dawn dominance when thermal comfort drives timing
2. **Freshwater summer heat suppression** — suppresses midday when heat stress is dominant
3. **Freshwater rapid warming late-day shift** — boosts afternoon after cold spell
4. **Freshwater overcast extension** — extends productive windows under heavy cloud cover
5. **Post-front bluebird compression** — compresses windows, caps at GOOD under clear post-front
6. **Saltwater slack-tide dominance cap** — prevents PRIME during dead water movement
7. **Brackish runoff/freshwater influx proxy** — penalizes outgoing after heavy rain (precipitation proxy, not measured salinity)
8. **Cold inshore/brackish midday warming** — modest midday bonus in protected cold coastal/brackish settings

### 6.5 Rule 9: Mild Winter Timing
- Dawn/dusk +4 points, no midday penalty

### 6.6 Rule 10: Saltwater Seasonal Timing
- `sw_cold_inactive`: midday warming boost
- `sw_summer_heat_stress`: dawn/dusk boost + midday penalty

### 6.7 Output
```typescript
{ best_windows: TimeWindow[], fair_windows: TimeWindow[], worst_windows: WorstWindow[] }
```

---

## 7. Behavior Inference

`behaviorInference.ts` — derives fish behavior state from conditions.

### 7.1 Output Fields
- `metabolic_state`: lethargy through aggressive
- `aggression_state`: passive through highly_aggressive
- `feeding_timer`: dominant feeding trigger
- `presentation_difficulty`: how selective/wary fish are
- `positioning_primary`: where fish are most likely holding
- `positioning_secondary`: secondary positioning tags
- `positioning_narrative`: human-readable explanation

### 7.2 Seasonal Positioning
- `mild_winter_active`: dawn/dusk = shallow_feeding_edges, otherwise = warming_flats_and_transitions
- Saltwater seasonal: `sw_cold_inactive` = deepest_stable_water, `sw_summer_heat_stress` = dawn/dusk conditional
- Standard freshwater/saltwater/brackish positioning based on temp zone, tide, light

---

## 8. LLM Integration (how-fishing/index.ts)

### 8.1 System Prompt
Instructs Claude to narrate the engine output for anglers. Includes schema for:
- `decent_times_today` with FAIR badges
- `severe_weather_alert` handling
- `mild_winter_active` narrative guidance

### 8.2 Deterministic Fallback
`generateDeterministicFallback()` produces a valid LLM-shaped response from engine data alone when Claude API fails. Status remains "ok" — user never sees an LLM error.

### 8.3 Dual/Multi Mode
- **Inland (`inland_dual`):** Parallel freshwater_lake + freshwater_river engine runs
- **Coastal (`coastal_multi`):** Parallel freshwater + saltwater + brackish engine runs
- Coastal detection: `isLikelyCoastal()` heuristic (FL peninsula, barrier islands, etc.) + engine's `coastal` flag

---

## 9. Known Minor Items (Future Polish)

1. Wind scoring still has hard bucket boundaries (no blend zones like light/pressure)
2. Rule 10 `sw_cold_inactive` dawn/dusk penalty pushes no driver tag string
3. `calculateBearing` function is dead code (never called)
4. `scoreWaterTempZone` `near_shutdown_cold` path could be fragile if `ZONE_BOUNDS` gains that key
5. `getBlockLightCategory` night detection uses `blockMid + 30` shift — verify intent
6. Missing `core_intelligence_spec.md` and `hows_fishing_feature_spec.md` referenced in older docs — this file replaces them

---

## 10. Testing

### 10.1 Engine Tests
`__tests__/engine.test.ts` — fixture-based tests with `baseFreshwaterFixture()` and `baseSaltwaterFixture()`.

### 10.2 Key Test Scenarios
- Latitude band assignment (lat=27 → deep_south, lat=44 → far_north)
- Altitude adjustment (lat=39, alt=7000ft → effective_lat=45.6 → far_north)
- Water temp: lake 32F floor, river groundwater blending
- Seasonal state: mild_winter_active for deep_south in Jan
- Solunar transitions: 60min from major → score 40
- 4-tier coverage: every block has a label
- Pressure trend: actual elapsed hours, no fixed 3h assumption
- Front label: "A cold front" not "A cold cold front"

### 10.3 Pre-existing Infrastructure Note
`deno check` on edge functions fails with `@supabase/functions-js` needing `npm:openai@^4.52.5`. This affects ALL edge functions and predates the sweeps. Actual TypeScript compiles correctly.
