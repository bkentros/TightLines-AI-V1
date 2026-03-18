# ENGINE REFINEMENT — SWEEP 2: Scoring, Time Windows, Recovery & Behavior

## Prerequisites
- Sweep 1 MUST be fully completed and verified before starting Sweep 2
- All new types from types.ts must exist
- deriveDerivedVariables must return all new fields (saltwater_seasonal_state, latitude_band, effective_latitude, severe_weather_alert, severe_weather_reasons)
- Read each target file in FULL before modifying

## Files Modified
- `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
- `supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts`
- `supabase/functions/_shared/coreIntelligence/recoveryModifier.ts`
- `supabase/functions/_shared/coreIntelligence/behaviorInference.ts`
- `supabase/functions/_shared/coreIntelligence/index.ts`

---

## Change 2.1: scoreEngine.ts — Solunar Score Map Update

**File:** `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
**Constant:** `SOLUNAR_SCORE_MAP`

REPLACE the solunar score map with the expanded version including transition zones:

```typescript
const SOLUNAR_SCORE_MAP: Record<string, number> = {
  within_major_window: 95,
  within_30min_of_major: 75,
  within_60min_of_major: 40,    // NEW — smooth transition
  within_90min_of_major: 20,    // NEW — smooth transition
  within_minor_window: 58,
  within_30min_of_minor: 35,
  within_60min_of_minor: 18,    // NEW — smooth transition
  outside_all_windows: 8,
};
```

---

## Change 2.2: scoreEngine.ts — Light Condition Scoring with Cloud Interpolation

**File:** `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
**Function:** `scoreLight`

REPLACE the `scoreLight` function. It now takes the cloud cover percentage to interpolate in transition zones:

```typescript
function scoreLight(dv: DerivedVariables, cloudCoverPct: number | null): number | null {
  if (dv.light_condition === null) return null;
  const cc = cloudCoverPct ?? 0;

  // Non-midday conditions: use fixed scores (no cloud transitions)
  if (
    dv.light_condition === "dawn_window_overcast" ||
    dv.light_condition === "dusk_window_overcast" ||
    dv.light_condition === "dawn_window_clear" ||
    dv.light_condition === "dusk_window_clear" ||
    dv.light_condition === "night"
  ) {
    return LIGHT_SCORE_MAP[dv.light_condition] ?? null;
  }

  // Midday conditions: interpolate in transition zones
  // Zone 1: cc 30-40 → blend full_sun (12) and partly_cloudy (40)
  if (cc >= 30 && cc < 40) {
    const t = (cc - 30) / 10;
    return Math.round(lerp(12, 40, t));
  }

  // Zone 2: cc 65-75 → blend partly_cloudy (40) and overcast (60)
  if (cc >= 65 && cc < 75) {
    const t = (cc - 65) / 10;
    return Math.round(lerp(40, 60, t));
  }

  // Outside transition zones: use categorical score
  return LIGHT_SCORE_MAP[dv.light_condition] ?? null;
}
```

**IMPORTANT:** Update the call site in `computeRawScore` to pass cloud cover:
Find `light: scoreLight(dv)` and change to `light: scoreLight(dv, env.cloud_cover_pct)`.

---

## Change 2.3: scoreEngine.ts — Pressure Scoring with Smooth Transitions

**File:** `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
**Function:** `scorePressure`

REPLACE the entire `scorePressure` function with this version that eliminates cliff effects at state boundaries:

```typescript
function getStablePressureScore(currentMb: number): number {
  if (currentMb < 1010) {
    const t = inverseLerp(1010 - currentMb, 0, 10);
    return Math.round(lerp(50, 69, t));
  }
  if (currentMb <= 1018) {
    const t = inverseLerp(currentMb, 1010, 1018);
    return Math.round(lerp(60, 48, t));
  }
  const t = inverseLerp(currentMb, 1018, 1030);
  return Math.round(lerp(56, 40, t));
}

function scorePressure(dv: DerivedVariables, env: EnvironmentSnapshot): number | null {
  const rate = dv.pressure_change_rate_mb_hr;
  const current = env.pressure_mb;
  if (rate === null || current === null) return null;

  // Rapidly falling (rate < -1.5)
  if (rate < -1.5) {
    const t = inverseLerp(Math.abs(rate), 1.5, 3.0);
    return Math.round(lerp(90, 100, t));
  }

  // Clearly slowly falling (rate < -0.6)
  if (rate < -0.6) {
    const t = inverseLerp(Math.abs(rate), 0.6, 1.5);
    return Math.round(lerp(70, 89, t));
  }

  // Blend zone: slowly_falling → stable (rate -0.6 to -0.4)
  if (rate < -0.4) {
    const fallingScore = 70;
    const stableScore = getStablePressureScore(current);
    const t = inverseLerp(rate, -0.6, -0.4);
    return Math.round(lerp(fallingScore, stableScore, t));
  }

  // Stable zone (rate -0.4 to +0.4)
  if (rate <= 0.4) {
    return getStablePressureScore(current);
  }

  // Blend zone: stable → slowly_rising (rate +0.4 to +0.6)
  if (rate <= 0.6) {
    const stableScore = getStablePressureScore(current);
    const risingScore = 39;
    const t = inverseLerp(rate, 0.4, 0.6);
    return Math.round(lerp(stableScore, risingScore, t));
  }

  // Clearly slowly rising (rate +0.6 to +1.5)
  if (rate <= 1.5) {
    const t = inverseLerp(rate, 0.6, 1.5);
    return Math.round(lerp(39, 20, t));
  }

  // Rapidly rising (rate > 1.5)
  const t = inverseLerp(rate, 1.5, 3.0);
  return Math.round(lerp(19, 0, t));
}
```

---

## Change 2.4: scoreEngine.ts — Pressure Rate Precision Fix

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts` (NOTE: this is in derivedVariables, not scoreEngine)
**Function:** `derivePressureTrend`

Find the line that calculates the rate by dividing by 3:
```typescript
// BEFORE:
const rate = (env.pressure_mb - closest.value) / 3;
```

Replace with actual elapsed hours:
```typescript
// AFTER:
const elapsedMs = Math.abs(new Date(env.timestamp_utc).getTime() - (new Date(env.timestamp_utc).getTime() - 3 * 3600 * 1000 - (closest.diff - 0)));
// Simpler approach: calculate actual hours between now and the closest reading
const closestTimeMs = new Date(env.timestamp_utc).getTime() - 3 * 3600 * 1000;
const actualTimeMs = closestTimeMs + (closest.diff * (new Date(env.timestamp_utc).getTime() - 3 * 3600 * 1000 > new Date(env.hourly_pressure_mb.find(p => {
  const t = new Date(p.time_utc).getTime();
  return Math.abs(t - (new Date(env.timestamp_utc).getTime() - 3 * 3600 * 1000)) === closest.diff;
})!.time_utc).getTime() ? -1 : 1));
```

ACTUALLY — the simpler and correct fix is to track the actual timestamp of the closest reading. Rewrite the function more clearly:

```typescript
function derivePressureTrend(env: EnvironmentSnapshot): {
  pressure_change_rate_mb_hr: number | null;
  pressure_state: PressureState | null;
} {
  if (!env.pressure_mb || env.hourly_pressure_mb.length < 4) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  const now = new Date(env.timestamp_utc).getTime();
  const target = now - 3 * 3600 * 1000;
  let closestPoint: { value: number; timeMs: number; diff: number } | null = null;

  for (const point of env.hourly_pressure_mb) {
    const t = new Date(point.time_utc).getTime();
    const diff = Math.abs(t - target);
    if (!closestPoint || diff < closestPoint.diff) {
      closestPoint = { value: point.value, timeMs: t, diff };
    }
  }

  if (!closestPoint || closestPoint.diff > 2 * 3600 * 1000) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  // Use ACTUAL elapsed hours, not fixed 3
  const actualHours = (now - closestPoint.timeMs) / (3600 * 1000);
  if (actualHours < 0.5) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  const rate = (env.pressure_mb - closestPoint.value) / actualHours;

  let state: PressureState;
  if (rate < -1.5) state = "rapidly_falling";
  else if (rate < -0.5) state = "slowly_falling";
  else if (rate <= 0.5) state = "stable";
  else if (rate <= 1.5) state = "slowly_rising";
  else state = "rapidly_rising";

  return { pressure_change_rate_mb_hr: rate, pressure_state: state };
}
```

---

## Change 2.5: scoreEngine.ts — Water Temp Zone Scoring with mild_winter_active

**File:** `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
**Function:** `scoreWaterTempZone`

Find the `switch (dv.seasonal_fish_behavior)` block inside `scoreWaterTempZone`. Add a new case for `mild_winter_active`:

```typescript
    case "mild_winter_active":
      if (zone === "near_shutdown_cold") pct += 15;
      else if (zone === "lethargic") pct += 12;
      else if (zone === "transitional") pct += 8;
      else if (zone === "active_prime") pct += 6;
      break;
```

### Also add saltwater seasonal scoring

After the freshwater seasonal switch block, add saltwater seasonal scoring. Find the section that returns `pct` for non-freshwater and add BEFORE the return:

```typescript
  // Saltwater/Brackish seasonal scoring
  if (waterType !== "freshwater" && dv.saltwater_seasonal_state !== null) {
    switch (dv.saltwater_seasonal_state) {
      case "sw_cold_inactive":
        if (zone === "near_shutdown_cold") pct += 10;
        else if (zone === "lethargic") pct += 8;
        else if (zone === "transitional") pct -= 4;
        break;
      case "sw_cold_mild_active":
        if (zone === "near_shutdown_cold") pct += 14;
        else if (zone === "lethargic") pct += 10;
        else if (zone === "transitional") pct += 6;
        else if (zone === "active_prime") pct += 4;
        break;
      case "sw_transitional_feed":
        if (zone === "transitional") pct += 10;
        else if (zone === "active_prime") pct += 12;
        break;
      case "sw_summer_peak":
        if (zone === "active_prime") pct += 8;
        else if (zone === "peak_aggression") pct += 6;
        else if (zone === "thermal_stress_heat") pct -= 8;
        break;
      case "sw_summer_heat_stress":
        if (zone === "peak_aggression") pct -= 8;
        else if (zone === "thermal_stress_heat") pct -= 16;
        break;
    }
  }

  return clamp(pct, 0, 100);
```

---

## Change 2.6: scoreEngine.ts — Temp Trend Scoring with New States

**File:** `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
**Function:** `scoreTempTrend`

### A. Add mild_winter_active case to the seasonal switch

Find the `switch (dv.seasonal_fish_behavior)` block in `scoreTempTrend`. Add:

```typescript
      case "mild_winter_active":
        if (dv.temp_trend_state === "warming") basePct += 4;
        else if (dv.temp_trend_state === "rapid_warming") basePct += 2;
        else if (dv.temp_trend_state === "cooling") basePct -= 4;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 8;
        break;
```

### B. Add saltwater seasonal trend modifiers

After the freshwater seasonal switch, add a second switch for saltwater:

```typescript
  // Saltwater seasonal trend modifiers
  if (dv.saltwater_seasonal_state !== null) {
    switch (dv.saltwater_seasonal_state) {
      case "sw_cold_inactive":
        if (dv.temp_trend_state === "rapid_warming") basePct += 10;
        else if (dv.temp_trend_state === "warming") basePct += 6;
        else if (dv.temp_trend_state === "cooling") basePct -= 8;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 14;
        break;
      case "sw_cold_mild_active":
        if (dv.temp_trend_state === "warming") basePct += 4;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 6;
        break;
      case "sw_transitional_feed":
        if (dv.temp_trend_state === "stable") basePct += 4;
        break;
      case "sw_summer_peak":
        if (dv.temp_trend_state === "cooling") basePct += 4;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 6;
        break;
      case "sw_summer_heat_stress":
        if (dv.temp_trend_state === "cooling") basePct += 8;
        else if (dv.temp_trend_state === "warming") basePct -= 8;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 14;
        break;
    }
  }
```

### C. Fix rapid_cooling zone modifier

**Function:** `getZoneModifier`

Find the line:
```typescript
if (zone === "near_shutdown_cold") return 0.0;
```
inside the `rapid_cooling` branch. Change to:
```typescript
if (zone === "near_shutdown_cold") return 0.05;
```

---

## Change 2.7: scoreEngine.ts — Wind Scoring Uses Real Wind-Tide Relation

**File:** `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
**Function:** `scoreWind`

No code changes needed here — the function already uses `dv.wind_tide_relation`. Since Sweep 1 changed `deriveWindTideRelation` to return real values instead of always `"neutral_or_unknown_relationship"`, the wind scoring will now automatically differentiate wind-with-tide vs wind-against-tide for coastal locations. Verify the existing scoring logic handles all three relation values correctly.

---

## Change 2.8: timeWindowEngine.ts — mild_winter_active Thermal Timing Profile

**File:** `supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts`
**Function:** `getFreshwaterThermalTimingProfile`

Add a new case to the switch statement:

```typescript
    case "mild_winter_active":
      return {
        dawnDuskBonus: 24,
        middayWarmBonus: 18,
        middayWarmStart: 10 * 60,
        middayWarmEnd: 16 * 60,
      };
```

---

## Change 2.9: timeWindowEngine.ts — 4-Tier Window Classification (All 24 Hours)

**File:** `supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts`

### A. Update `classifyBlock`

REPLACE the `classifyBlock` function:

```typescript
function classifyBlock(block: Block): WindowLabel {
  const score = Math.round((block.points / block.maxPoints) * 100);
  if (score >= 65) return "PRIME";
  if (score >= 45) return "GOOD";
  if (score >= 25) return "FAIR";
  return "SLOW";
}
```

Note: Return type changed from `WindowLabel | null` to `WindowLabel` — every block now gets a label.

### B. Update `computeTimeWindows` merging logic

Find the merging section in `computeTimeWindows`. The current code skips blocks where `label === null || label === "SECONDARY"`. Replace the entire merging and worst-window section:

```typescript
  // Classify all blocks (every block gets a label now)
  const scoredBlocks = blocks.map((b) => ({
    ...b,
    label: classifyBlock(b),
    score: getBlockScore(b),
  }));

  // Merge contiguous blocks of same label into windows
  const allWindows: TimeWindow[] = [];
  let i = 0;
  while (i < scoredBlocks.length) {
    const b = scoredBlocks[i];
    let j = i + 1;
    const mergedDrivers = new Set(b.drivers);
    let maxScore = b.score;

    while (j < scoredBlocks.length && scoredBlocks[j].label === b.label) {
      scoredBlocks[j].drivers.forEach((d) => mergedDrivers.add(d));
      maxScore = Math.max(maxScore, scoredBlocks[j].score);
      j++;
    }

    allWindows.push({
      label: b.label,
      start_local: minutesToHHMM(b.startMin),
      end_local: minutesToHHMM(scoredBlocks[j - 1].startMin + 30),
      window_score: maxScore,
      drivers: Array.from(mergedDrivers),
    });

    i = j;
  }

  // Split into best (PRIME + GOOD) and worst (SLOW) for primary display
  // FAIR windows are included as a separate category
  const best_windows = allWindows.filter(
    (w) => w.label === "PRIME" || w.label === "GOOD"
  );
  const fair_windows = allWindows.filter((w) => w.label === "FAIR");
  const worst_windows: WorstWindow[] = allWindows
    .filter((w) => w.label === "SLOW")
    .map((w) => ({
      start_local: w.start_local,
      end_local: w.end_local,
      window_score: w.window_score,
      label: w.label,
    }));

  return {
    best_windows,
    fair_windows,
    worst_windows,
  };
```

### C. Update the return type of `computeTimeWindows`

Change the return type to include `fair_windows`:

```typescript
export function computeTimeWindows(
  ...
): { best_windows: TimeWindow[]; fair_windows: TimeWindow[]; worst_windows: WorstWindow[] } {
```

---

## Change 2.10: timeWindowEngine.ts — Edge-Case Rules for mild_winter_active

**File:** `supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts`
**Function:** `applyEdgeCaseRules`

Find the Rule 9 section (`if (waterType === "freshwater" && seasonalState !== null)`). Add a new block for `mild_winter_active`:

```typescript
    if (seasonalState === "mild_winter_active") {
      // Mild winter: all-day viable, slight dawn/dusk preference
      // Solunar, pressure, and tide become primary differentiators
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        points += 4;
        if (!drivers.includes("mild_winter_low_light_window")) drivers.push("mild_winter_low_light_window");
      }
      // No midday penalty — fishing is viable all day
    }
```

---

## Change 2.11: timeWindowEngine.ts — Update TimeWindowRuleContext

**File:** `supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts`
**Interface:** `TimeWindowRuleContext`

Add saltwater seasonal state to the rule context:

```typescript
export interface TimeWindowRuleContext {
  waterType: WaterType;
  water_temp_zone: WaterTempZone | null;
  temp_trend_state: TempTrendState | null;
  pressure_state: PressureState | null;
  cloud_cover_pct: number | null;
  light_condition: LightCondition | null;
  recovery_active: boolean;
  salinity_disruption_alert: boolean;
  range_strength_pct: number | null;
  seasonal_fish_behavior?: SeasonalFishBehaviorState | null;
  freshwater_subtype?: FreshwaterSubtype | null;
  saltwater_seasonal_state?: SaltwaterSeasonalState | null;  // NEW
}
```

Add saltwater-specific edge-case rules to `applyEdgeCaseRules`:

```typescript
  // --- Rule 10: Saltwater seasonal timing adjustments ---
  if (waterType !== "freshwater" && ruleCtx.saltwater_seasonal_state) {
    const swState = ruleCtx.saltwater_seasonal_state;
    const lightCategory = getBlockLightCategory(block.startMin, dawnDusk, cloudCover);

    if (swState === "sw_cold_inactive") {
      // Winter: midday is better (sun warms shallows)
      if (lightCategory === "midday") {
        points += 8;
        if (!drivers.includes("sw_cold_midday_warming")) drivers.push("sw_cold_midday_warming");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        points -= 4;
      }
    }

    if (swState === "sw_summer_heat_stress") {
      // Summer heat: dawn/dusk/night much better
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        points += 8;
        if (!drivers.includes("sw_summer_low_light_feed")) drivers.push("sw_summer_low_light_feed");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 60) {
        points -= 10;
        if (!drivers.includes("sw_summer_heat_midday_penalty")) drivers.push("sw_summer_heat_midday_penalty");
      } else if (lightCategory === "night") {
        points += 5;
        if (!drivers.includes("sw_summer_night_feed")) drivers.push("sw_summer_night_feed");
      }
    }
  }
```

---

## Change 2.12: recoveryModifier.ts — No code changes to multiplier values

The recovery multiplier values (0.82/0.88/0.85 base) are kept as-is per earlier decision. No changes to this file's multiplier logic.

---

## Change 2.13: behaviorInference.ts — mild_winter_active and Saltwater Positioning

**File:** `supabase/functions/_shared/coreIntelligence/behaviorInference.ts`
**Function:** `derivePositioningBias`

### A. Add mild_winter_active to freshwater positioning

In the freshwater section, find the seasonal state chain. Add before the default fallback:

```typescript
    } else if (seasonal === "mild_winter_active") {
      primary = isDawnDusk ? "shallow_feeding_edges" : "warming_flats_and_transitions";
```

### B. Add saltwater seasonal influence on positioning

In the saltwater section, expand the positioning logic to consider the seasonal state. Replace the saltwater positioning section:

```typescript
  if (waterType === "saltwater") {
    let primary: PositioningBias;

    if (dv.cold_stun_alert) {
      primary = "warmest_available_refuge";
    } else if (dv.water_temp_zone === "thermal_stress_heat") {
      primary = "cooler_deeper_current_refuge";
    } else if (
      dv.tide_phase_state === "slack" ||
      dv.tide_strength_state === "minimal_movement"
    ) {
      primary = "deeper_edges_channels_adjacent_structure";
    } else if (dv.saltwater_seasonal_state === "sw_cold_inactive") {
      primary = "deepest_stable_water";
    } else if (dv.saltwater_seasonal_state === "sw_summer_heat_stress") {
      primary = isDawnDusk ? "current_breaks_cuts_passes_flats" : "cooler_deeper_current_refuge";
    } else {
      primary = "current_breaks_cuts_passes_flats";
    }

    if (dv.wind_tide_relation === "wind_with_tide") {
      secondaryTags.push("windward_bait_push");
    }
    if (
      dv.light_condition === "night" &&
      (dv.tide_strength_state === "strong_movement" ||
        dv.tide_strength_state === "above_average_movement")
    ) {
      secondaryTags.push("night_current_window");
    }

    return { primary, secondary: secondaryTags };
  }
```

---

## Change 2.14: index.ts — Front Label Wording Fix

**File:** `supabase/functions/_shared/coreIntelligence/index.ts`
**Function:** `buildFrontLabel`

REPLACE the `buildFrontLabel` function:

```typescript
function buildFrontLabel(
  recoveryActive: boolean,
  daysSinceFront: number,
  frontSeverity: import("./types.ts").FrontSeverity | null
): string | null {
  if (!recoveryActive || frontSeverity === null) return null;

  const sevDesc =
    frontSeverity === "mild" ? "A mild" :
    frontSeverity === "severe" ? "A strong" :
    "A";

  if (daysSinceFront === 0) {
    return `${sevDesc} cold front moved through — fish are tight-lipped today. Expect slow action.`;
  }
  if (daysSinceFront === 1) {
    return `Cold front came through yesterday. Fish still reluctant — try slow presentations near structure.`;
  }
  if (daysSinceFront === 2) {
    return `Two days post-front. Fish starting to stir — bite should improve, especially midday.`;
  }
  if (daysSinceFront === 3) {
    return `Three days after the front. Conditions stabilizing — expect a solid bite window today.`;
  }
  if (daysSinceFront >= 4) {
    return `Front has passed. Fish back to normal patterns — fish confidently.`;
  }
  return null;
}
```

---

## Change 2.15: index.ts — Fix recovery_active in ruleContext

**File:** `supabase/functions/_shared/coreIntelligence/index.ts`
**Function:** `runCoreIntelligence`

Find the `ruleContext` construction. Change the `recovery_active` field:

```typescript
// BEFORE:
recovery_active: daysSinceFront >= 0 && daysSinceFront <= 5,

// AFTER:
recovery_active: daysSinceFront >= 0 && daysSinceFront <= 5 && frontSeverity !== null,
```

---

## Change 2.16: index.ts — Wire Up New Fields in Engine Output

**File:** `supabase/functions/_shared/coreIntelligence/index.ts`

### A. Update `buildEngineEnvironment`

Add the new fields to the returned object:

```typescript
function buildEngineEnvironment(
  env: EnvironmentSnapshot,
  dv: ReturnType<typeof deriveDerivedVariables>,
  daysSinceFront: number
): EngineEnvironmentSnapshot {
  return {
    // ... existing fields stay the same ...
    air_temp_f: env.air_temp_f,
    water_temp_f: dv.water_temp_f,
    water_temp_source: dv.water_temp_source,
    water_temp_zone: dv.water_temp_zone,
    wind_speed_mph: env.wind_speed_mph,
    wind_direction: env.wind_direction_label,
    wind_direction_deg: env.wind_direction_deg,
    cloud_cover_pct: env.cloud_cover_pct,
    pressure_mb: env.pressure_mb,
    pressure_change_rate_mb_hr: dv.pressure_change_rate_mb_hr,
    pressure_state: dv.pressure_state,
    precip_48hr_inches: env.precip_48hr_inches,
    precip_7day_inches: env.precip_7day_inches,
    precip_condition: dv.precip_condition,
    moon_phase: dv.moon_phase,
    moon_illumination_pct: env.moon_illumination_pct,
    solunar_state: dv.solunar_state,
    tide_phase_state: dv.tide_phase_state,
    tide_strength_state: dv.tide_strength_state,
    range_strength_pct: dv.range_strength_pct,
    light_condition: dv.light_condition,
    temp_trend_state: dv.temp_trend_state,
    temp_trend_direction_f: dv.temp_trend_direction_f,
    days_since_front: daysSinceFront,
    freshwater_subtype: dv.freshwater_subtype,
    seasonal_fish_behavior: dv.seasonal_fish_behavior,
    // NEW fields:
    effective_latitude: dv.effective_latitude,
    latitude_band: dv.latitude_band,
    saltwater_seasonal_state: dv.saltwater_seasonal_state,
    altitude_ft: env.altitude_ft,
    severe_weather_alert: dv.severe_weather_alert,
    severe_weather_reasons: dv.severe_weather_reasons,
  };
}
```

### B. Update `runCoreIntelligence` to pass new fields through

Add `fair_windows` to the time windows destructuring:

```typescript
// BEFORE:
const { best_windows, worst_windows } = computeTimeWindows(...);

// AFTER:
const { best_windows, fair_windows, worst_windows } = computeTimeWindows(...);
```

Add `saltwater_seasonal_state` to the ruleContext:

```typescript
const ruleContext = {
  // ... existing fields ...
  saltwater_seasonal_state: dv.saltwater_seasonal_state,  // NEW
};
```

Add severe weather and fair_windows to the return object:

```typescript
return {
  // ... existing fields ...
  alerts: {
    // ... existing alert fields ...
    severe_weather_alert: dv.severe_weather_alert,      // NEW
    severe_weather_reasons: dv.severe_weather_reasons,  // NEW
  },
  time_windows: best_windows,
  fair_windows,          // NEW
  worst_windows,
};
```

### C. Add Component Debug Detail

Add a `component_detail` section to the EngineOutput for debugging score consistency:

In `runCoreIntelligence`, after computing raw scores, build a debug object:

```typescript
  // Component debug detail (percentage + score for each component)
  const component_detail: Record<string, { pct: number; score: number; weight: number }> = {};
  for (const [key, score] of Object.entries(components)) {
    const weight = weights[key] ?? 0;
    const pct = weight > 0 ? Math.round((score / weight) * 100) : 0;
    component_detail[key] = { pct, score, weight };
  }
```

Add `component_detail` to the scoring section of the return object:

```typescript
  scoring: {
    // ... existing fields ...
    component_detail,  // NEW — debug info for consistency auditing
  },
```

Also add the type to `EngineOutput.scoring` in types.ts:
```typescript
component_detail?: Record<string, { pct: number; score: number; weight: number }>;
```

---

## Sweep 2 Verification Checkpoint

After completing all changes in this sweep, verify:

1. **TypeScript compiles**: Run `deno check` on all modified files
2. **Solunar smoothing**: Score for `within_60min_of_major` should be 40 (not 8)
3. **Light interpolation**: Cloud cover at 35% should score ~26 (between 12 and 40), not jump from 12 to 40
4. **Pressure smoothing**: Rate of -0.50 mb/hr should score ~70. Rate of -0.49 should score ~68 (smooth), NOT jump to ~55
5. **mild_winter_active scoring**: Verify water temp zone pct += 15 for near_shutdown_cold, pct += 12 for lethargic
6. **Saltwater seasonal scoring**: sw_summer_heat_stress + thermal_stress_heat should apply pct -= 16
7. **Wind-tide**: Coastal location with incoming tide + opposing wind should show `wind_against_tide` (not neutral)
8. **4-tier windows**: Every 30-min block should have a label (PRIME, GOOD, FAIR, or SLOW). No null labels.
9. **fair_windows**: Return value from computeTimeWindows includes fair_windows array
10. **Front label**: Moderate severity should say "A cold front" not "A cold cold front"
11. **recovery_active**: When frontSeverity is null, recovery_active should be false
12. **Component debug**: EngineOutput.scoring.component_detail should contain pct/score/weight for each component

**Test case — Prudenville MI, March, freshwater lake:**
- Water temp: 32-35°F (not 27°F — Sweep 1 fix)
- Seasonal state: deep_winter_survival
- Solunar: smooth transitions (no 87% cliff)
- Overall score should be consistent within ±3 points for scans 15 min apart

**Test case — South Florida, January, freshwater lake:**
- Seasonal state: mild_winter_active
- Time windows: relatively flat (dawn/dusk slight edge, midday viable)
- Water temp: should NOT trigger deep_winter_survival scoring

**Test case — Gulf Coast TX, July, saltwater:**
- Saltwater seasonal: sw_summer_heat_stress
- Dawn/dusk windows should be strongly preferred
- Midday should have heat penalty
- Wind-tide interaction should be non-neutral

---

**STOP HERE. Verify all scoring and window changes before proceeding to Sweep 3.**
