# ENGINE REFINEMENT — SWEEP 1: Foundation (Types + Derived Variables + Data Fetching)

## Overview
This sweep establishes all new types, constants, and derived variable logic that Sweeps 2 and 3 depend on. After completing this sweep, `deriveDerivedVariables()` should produce all new fields correctly. No scoring, window, or UI changes in this sweep.

## Files Modified
- `supabase/functions/_shared/coreIntelligence/types.ts`
- `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
- `supabase/functions/get-environment/index.ts`

## Important Context
- Read each target file in FULL before modifying
- Preserve all existing exports and function signatures unless explicitly told to change them
- All new types/functions must be exported
- Run `deno check` after each file modification to verify TypeScript correctness

---

## Change 1.1: Update types.ts — New Types and Expanded Interfaces

**File:** `supabase/functions/_shared/coreIntelligence/types.ts`

### A. Add `LatitudeBand` type
Add this type alongside the existing type definitions:
```typescript
export type LatitudeBand = "deep_south" | "south" | "mid" | "north" | "far_north";
```

### B. Add `"mild_winter_active"` to `SeasonalFishBehaviorState`
Find the `SeasonalFishBehaviorState` type union. Add `"mild_winter_active"` as a new option:
```typescript
export type SeasonalFishBehaviorState =
  | "deep_winter_survival"
  | "pre_spawn_buildup"
  | "spawn_period"
  | "post_spawn_recovery"
  | "summer_peak_activity"
  | "summer_heat_suppression"
  | "fall_feed_buildup"
  | "late_fall_slowdown"
  | "mild_winter_active";  // NEW
```

### C. Add `SaltwaterSeasonalState` type
```typescript
export type SaltwaterSeasonalState =
  | "sw_cold_inactive"
  | "sw_cold_mild_active"
  | "sw_transitional_feed"
  | "sw_summer_peak"
  | "sw_summer_heat_stress";
```

### D. Add new `SolunarState` values for transition zones
Find the `SolunarState` type union. Add transition zone states:
```typescript
export type SolunarState =
  | "within_major_window"
  | "within_30min_of_major"
  | "within_60min_of_major"   // NEW
  | "within_90min_of_major"   // NEW
  | "within_minor_window"
  | "within_30min_of_minor"
  | "within_60min_of_minor"   // NEW
  | "outside_all_windows";
```

### E. Add `FrontSeverity` if not already present
Verify this type exists. If not, add:
```typescript
export type FrontSeverity = "mild" | "moderate" | "severe";
```

### F. Update `DerivedVariables` interface — add new fields
Add these fields to the existing `DerivedVariables` interface:
```typescript
// Add to DerivedVariables:
saltwater_seasonal_state: SaltwaterSeasonalState | null;
latitude_band: LatitudeBand;
effective_latitude: number;
severe_weather_alert: boolean;
severe_weather_reasons: string[];
```

### G. Update `EnvironmentSnapshot` interface — add altitude field
Add this field to the `EnvironmentSnapshot` interface:
```typescript
// Add to EnvironmentSnapshot:
altitude_ft: number | null;
```

### H. Update `EngineEnvironmentSnapshot` interface
Add these fields to `EngineEnvironmentSnapshot`:
```typescript
// Add to EngineEnvironmentSnapshot:
effective_latitude: number;
latitude_band: LatitudeBand;
saltwater_seasonal_state: SaltwaterSeasonalState | null;
altitude_ft: number | null;
severe_weather_alert: boolean;
severe_weather_reasons: string[];
```

### I. Update `EngineOutput` alerts section
Add these fields to the `alerts` section of `EngineOutput`:
```typescript
// Add to EngineOutput.alerts:
severe_weather_alert: boolean;
severe_weather_reasons: string[];
```

### J. Update `WindowLabel` type for 4-tier system
Find the `WindowLabel` type. Replace with:
```typescript
export type WindowLabel = "PRIME" | "GOOD" | "FAIR" | "SLOW";
```

### K. Add `WorstWindow` label field if not present
Ensure `WorstWindow` has an optional label field:
```typescript
export interface WorstWindow {
  start_local: string;
  end_local: string;
  window_score: number;
  label?: WindowLabel;  // NEW — for FAIR/SLOW classification
}
```

---

## Change 1.2: Update derivedVariables.ts — Latitude Band and Effective Latitude

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`

### A. Add altitude and latitude band functions

Add these new functions (place them after the existing `getMeteoSeason` function):

```typescript
// ---------------------------------------------------------------------------
// Altitude Effective Latitude (adjusts seasonal band for elevation)
// ---------------------------------------------------------------------------

export function computeEffectiveLatitude(lat: number, altitudeFt: number | null): number {
  if (altitudeFt === null || altitudeFt <= 1500) return lat;
  const altitudeAboveBaseline = altitudeFt - 1500;
  const latShift = (altitudeAboveBaseline / 1000) * 1.2;
  return lat + latShift;
}

export function getLatitudeBand(effectiveLat: number): LatitudeBand {
  if (effectiveLat < 30) return "deep_south";
  if (effectiveLat < 34) return "south";
  if (effectiveLat < 39) return "mid";
  if (effectiveLat < 44) return "north";
  return "far_north";
}
```

Add `LatitudeBand` to the imports from `"./types.ts"`.

---

## Change 1.3: Update derivedVariables.ts — 5-Band Freshwater Seasonal Behavior

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
**Function:** `deriveSeasonalFishBehavior`

REPLACE the entire `deriveSeasonalFishBehavior` function with this new version that uses 5 latitude bands, a lookup table, and river overrides:

```typescript
// ---------------------------------------------------------------------------
// Section 4G3 — Deterministic seasonal fish-behavior state
// 5-band latitude system with river overrides for spawn timing
// ---------------------------------------------------------------------------

const FRESHWATER_SEASONAL_MAP: Record<LatitudeBand, Record<number, SeasonalFishBehaviorState>> = {
  deep_south: {
    1: "mild_winter_active",
    2: "pre_spawn_buildup",
    3: "spawn_period",
    4: "post_spawn_recovery",
    5: "summer_peak_activity",
    6: "summer_heat_suppression",
    7: "summer_heat_suppression",
    8: "summer_heat_suppression",
    9: "fall_feed_buildup",
    10: "fall_feed_buildup",
    11: "late_fall_slowdown",
    12: "mild_winter_active",
  },
  south: {
    1: "deep_winter_survival",
    2: "pre_spawn_buildup",
    3: "spawn_period",
    4: "spawn_period",
    5: "post_spawn_recovery",
    6: "summer_heat_suppression",
    7: "summer_heat_suppression",
    8: "summer_heat_suppression",
    9: "fall_feed_buildup",
    10: "late_fall_slowdown",
    11: "late_fall_slowdown",
    12: "deep_winter_survival",
  },
  mid: {
    1: "deep_winter_survival",
    2: "deep_winter_survival",
    3: "pre_spawn_buildup",
    4: "spawn_period",
    5: "spawn_period",
    6: "post_spawn_recovery",
    7: "summer_peak_activity",
    8: "summer_peak_activity",
    9: "fall_feed_buildup",
    10: "fall_feed_buildup",
    11: "late_fall_slowdown",
    12: "deep_winter_survival",
  },
  north: {
    1: "deep_winter_survival",
    2: "deep_winter_survival",
    3: "deep_winter_survival",
    4: "pre_spawn_buildup",
    5: "pre_spawn_buildup",
    6: "spawn_period",
    7: "summer_peak_activity",
    8: "summer_peak_activity",
    9: "fall_feed_buildup",
    10: "fall_feed_buildup",
    11: "late_fall_slowdown",
    12: "deep_winter_survival",
  },
  far_north: {
    1: "deep_winter_survival",
    2: "deep_winter_survival",
    3: "deep_winter_survival",
    4: "deep_winter_survival",
    5: "pre_spawn_buildup",
    6: "pre_spawn_buildup",
    7: "spawn_period",
    8: "summer_peak_activity",
    9: "fall_feed_buildup",
    10: "late_fall_slowdown",
    11: "deep_winter_survival",
    12: "deep_winter_survival",
  },
};

// Rivers warm faster than lakes; spawn shifts ~1 month earlier at north/far_north
const RIVER_SPAWN_OVERRIDES: Partial<Record<LatitudeBand, Record<number, SeasonalFishBehaviorState>>> = {
  north: {
    5: "spawn_period",          // lakes: pre_spawn_buildup
    6: "post_spawn_recovery",   // lakes: spawn_period
  },
  far_north: {
    6: "spawn_period",              // lakes: pre_spawn_buildup
    7: "summer_peak_activity",      // lakes: spawn_period
  },
};

function deriveSeasonalFishBehavior(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  subtype: FreshwaterSubtype | null,
  latBand: LatitudeBand
): SeasonalFishBehaviorState | null {
  if (waterType !== "freshwater") return null;

  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const isRiver = subtype === "river_stream";

  // Check river overrides first
  if (isRiver) {
    const overrides = RIVER_SPAWN_OVERRIDES[latBand];
    if (overrides && overrides[month]) {
      return overrides[month]!;
    }
  }

  return FRESHWATER_SEASONAL_MAP[latBand]?.[month] ?? "deep_winter_survival";
}
```

Add `LatitudeBand` and `SeasonalFishBehaviorState` to the type imports if not already there.

---

## Change 1.4: Update derivedVariables.ts — Saltwater Seasonal State

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`

Add this NEW function after `deriveSeasonalFishBehavior`:

```typescript
// ---------------------------------------------------------------------------
// Saltwater / Brackish Seasonal Thermal Opportunity State
// ---------------------------------------------------------------------------

type CoastalBand = "north_coast" | "mid_coast" | "south_coast";

function getCoastalBand(lat: number): CoastalBand {
  if (lat >= 39) return "north_coast";
  if (lat >= 30) return "mid_coast";
  return "south_coast";
}

const SALTWATER_SEASONAL_MAP: Record<CoastalBand, Record<number, SaltwaterSeasonalState>> = {
  north_coast: {
    1: "sw_cold_inactive", 2: "sw_cold_inactive",
    3: "sw_transitional_feed", 4: "sw_transitional_feed",
    5: "sw_transitional_feed", 6: "sw_summer_peak",
    7: "sw_summer_peak", 8: "sw_summer_peak",
    9: "sw_transitional_feed", 10: "sw_transitional_feed",
    11: "sw_cold_inactive", 12: "sw_cold_inactive",
  },
  mid_coast: {
    1: "sw_cold_mild_active", 2: "sw_cold_mild_active",
    3: "sw_transitional_feed", 4: "sw_transitional_feed",
    5: "sw_summer_peak", 6: "sw_summer_heat_stress",
    7: "sw_summer_heat_stress", 8: "sw_summer_heat_stress",
    9: "sw_transitional_feed", 10: "sw_transitional_feed",
    11: "sw_cold_mild_active", 12: "sw_cold_mild_active",
  },
  south_coast: {
    1: "sw_cold_mild_active", 2: "sw_transitional_feed",
    3: "sw_transitional_feed", 4: "sw_summer_peak",
    5: "sw_summer_heat_stress", 6: "sw_summer_heat_stress",
    7: "sw_summer_heat_stress", 8: "sw_summer_heat_stress",
    9: "sw_summer_heat_stress", 10: "sw_transitional_feed",
    11: "sw_transitional_feed", 12: "sw_cold_mild_active",
  },
};

function deriveSaltwaterSeasonalState(
  env: EnvironmentSnapshot,
  waterType: WaterType
): SaltwaterSeasonalState | null {
  if (waterType === "freshwater") return null;
  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const band = getCoastalBand(env.lat);
  return SALTWATER_SEASONAL_MAP[band]?.[month] ?? "sw_transitional_feed";
}
```

Add `SaltwaterSeasonalState` to the type imports.

---

## Change 1.5: Update derivedVariables.ts — River Groundwater Blending Water Temp Model

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
**Function:** `estimateFreshwaterTemp`

REPLACE the entire `estimateFreshwaterTemp` function with this new version. The lake path uses the existing correction table + hard floor. The river path uses groundwater blending.

```typescript
// ---------------------------------------------------------------------------
// Section 4G — Freshwater Water Temperature Estimate
// Lake: weighted air model + correction table + 32°F floor + deep-winter clamp
// River: groundwater blending model + 33°F floor
// ---------------------------------------------------------------------------

const GROUNDWATER_BASE_TEMP: Record<LatitudeBand, number> = {
  far_north: 42,
  north: 47,
  mid: 52,
  south: 58,
  deep_south: 65,
};

const AIR_INFLUENCE_ALPHA: Record<MeteoSeason, Record<LatitudeBand, number>> = {
  DJF: { far_north: 0.50, north: 0.55, mid: 0.60, south: 0.65, deep_south: 0.70 },
  MAM: { far_north: 0.60, north: 0.65, mid: 0.70, south: 0.72, deep_south: 0.75 },
  JJA: { far_north: 0.78, north: 0.80, mid: 0.82, south: 0.84, deep_south: 0.85 },
  SON: { far_north: 0.65, north: 0.70, mid: 0.72, south: 0.74, deep_south: 0.75 },
};

const SNOWMELT_DAMPENING: Record<LatitudeBand, number> = {
  far_north: -3,
  north: -2,
  mid: 0,
  south: 0,
  deep_south: 0,
};

function estimateFreshwaterTemp(
  env: EnvironmentSnapshot,
  subtype: FreshwaterSubtype | null,
  latBand: LatitudeBand,
  seasonalState: SeasonalFishBehaviorState | null
): number | null {
  const highs = env.daily_air_temp_high_f;
  const lows = env.daily_air_temp_low_f;
  if (highs.length < 7 || lows.length < 7) return null;

  // Compute daily means for last 7 days (index 0=6 days ago, index 6=today)
  const means: Array<number | null> = [];
  for (let i = 0; i < 7; i++) {
    means.push(dailyMean(highs[i], lows[i]));
  }

  const isRiver = subtype === "river_stream";
  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const season = getMeteoSeason(month);

  // Compute raw weighted air average (no corrections yet)
  const weights = isRiver
    ? [0.40, 0.28, 0.16, 0.08, 0.05, 0.02, 0.01]
    : [0.30, 0.25, 0.20, 0.12, 0.07, 0.04, 0.02];

  let weighted = 0;
  let totalWeight = 0;
  for (let i = 0; i < 7; i++) {
    const dayIndex = 6 - i;
    if (means[dayIndex] !== null) {
      weighted += (means[dayIndex] as number) * weights[i];
      totalWeight += weights[i];
    }
  }
  if (totalWeight < 0.5) return null;
  const rawAirAvg = weighted / totalWeight;

  if (isRiver) {
    // ---- RIVER: Groundwater blending model ----
    const gwBase = GROUNDWATER_BASE_TEMP[latBand];
    const alpha = AIR_INFLUENCE_ALPHA[season][latBand];
    const snowmelt = season === "MAM" ? SNOWMELT_DAMPENING[latBand] : 0;
    const blended = alpha * rawAirAvg + (1 - alpha) * (gwBase + snowmelt);
    return Math.max(33, Math.round(blended * 10) / 10);
  }

  // ---- LAKE (default): Correction table + floor + deep-winter clamp ----
  const correction = getLatSeasonCorrection(env.lat, season, subtype);
  const seasonalOffset = getSeasonalStateTempOffset(seasonalState, subtype, month);
  let estimate = rawAirAvg + correction + seasonalOffset;

  // Hard floor: liquid water cannot be below 32°F
  estimate = Math.max(32, estimate);

  // Deep-winter clamp: northern lakes under ice are 32-35°F
  if (
    seasonalState === "deep_winter_survival" &&
    (latBand === "north" || latBand === "far_north")
  ) {
    estimate = Math.max(32, Math.min(35, estimate));
  }

  return Math.round(estimate * 10) / 10;
}
```

**IMPORTANT**: The function signature changed — it now takes `latBand` and `seasonalState` as parameters. Update all call sites in this file (in `deriveDerivedVariables`).

---

## Change 1.6: Update derivedVariables.ts — Solunar Transition Zones

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
**Function:** `deriveSolunarState`

REPLACE the `deriveSolunarState` function to add 60-min and 90-min transition zones:

```typescript
function deriveSolunarState(
  env: EnvironmentSnapshot,
  currentLocalMinutes: number
): SolunarState | null {
  if (
    env.solunar_major_periods.length === 0 &&
    env.solunar_minor_periods.length === 0
  ) {
    return null;
  }

  const isInside = (start: string, end: string): boolean => {
    const s = hmToMinutes(start);
    const e = hmToMinutes(end);
    if (s === null || e === null) return false;
    return currentLocalMinutes >= s && currentLocalMinutes <= e;
  };

  const minutesFromWindow = (start: string, end: string): number | null => {
    const s = hmToMinutes(start);
    const e = hmToMinutes(end);
    if (s === null || e === null) return null;
    if (currentLocalMinutes >= s && currentLocalMinutes <= e) return 0;
    const distToStart = Math.abs(currentLocalMinutes - s);
    const distToEnd = Math.abs(currentLocalMinutes - e);
    return Math.min(distToStart, distToEnd);
  };

  // Check major periods
  for (const p of env.solunar_major_periods) {
    if (isInside(p.start_local, p.end_local)) return "within_major_window";
  }
  let closestMajor = Infinity;
  for (const p of env.solunar_major_periods) {
    const dist = minutesFromWindow(p.start_local, p.end_local);
    if (dist !== null && dist < closestMajor) closestMajor = dist;
  }
  if (closestMajor <= 30) return "within_30min_of_major";
  if (closestMajor <= 60) return "within_60min_of_major";
  if (closestMajor <= 90) return "within_90min_of_major";

  // Check minor periods
  for (const p of env.solunar_minor_periods) {
    if (isInside(p.start_local, p.end_local)) return "within_minor_window";
  }
  let closestMinor = Infinity;
  for (const p of env.solunar_minor_periods) {
    const dist = minutesFromWindow(p.start_local, p.end_local);
    if (dist !== null && dist < closestMinor) closestMinor = dist;
  }
  if (closestMinor <= 30) return "within_30min_of_minor";
  if (closestMinor <= 60) return "within_60min_of_minor";

  return "outside_all_windows";
}
```

---

## Change 1.7: Update derivedVariables.ts — Severe Weather Detection

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`

Add this NEW function:

```typescript
// ---------------------------------------------------------------------------
// Severe Weather Detection — Safety Guard
// ---------------------------------------------------------------------------

function detectSevereWeather(env: EnvironmentSnapshot): {
  severe_weather_alert: boolean;
  severe_weather_reasons: string[];
} {
  const reasons: string[] = [];

  // Dangerous sustained wind
  if (env.wind_speed_mph !== null && env.wind_speed_mph > 30) {
    reasons.push("Dangerous sustained winds above 30 mph");
  }

  // Dangerous gusts
  if (env.gust_speed_mph !== null && env.gust_speed_mph > 45) {
    reasons.push("Dangerous wind gusts above 45 mph");
  }

  // Extreme cold
  if (env.air_temp_f !== null && env.air_temp_f < 0) {
    reasons.push("Extreme cold: air temperature below 0°F");
  }

  // Wind chill calculation (NWS formula)
  if (env.air_temp_f !== null && env.wind_speed_mph !== null &&
      env.air_temp_f <= 50 && env.wind_speed_mph >= 3) {
    const t = env.air_temp_f;
    const v = env.wind_speed_mph;
    const wc = 35.74 + 0.6215 * t - 35.75 * Math.pow(v, 0.16) + 0.4275 * t * Math.pow(v, 0.16);
    if (wc < -10) {
      reasons.push(`Dangerous wind chill of ${Math.round(wc)}°F`);
    }
  }

  // Severe precipitation
  if (env.current_precip_in_hr !== null && env.current_precip_in_hr > 1.0) {
    reasons.push("Severe precipitation exceeding 1 inch per hour");
  }

  return {
    severe_weather_alert: reasons.length > 0,
    severe_weather_reasons: reasons,
  };
}
```

---

## Change 1.8: Update derivedVariables.ts — Wind-Tide Approximation

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
**Function:** `deriveWindTideRelation`

REPLACE the entire `deriveWindTideRelation` function:

```typescript
// ---------------------------------------------------------------------------
// Wind-Tide Relation — Approximate from tide phase + station/user bearing
// ---------------------------------------------------------------------------

function calculateBearing(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function deriveWindTideRelation(
  windDirectionDeg: number | null,
  tidePhaseState: import("./types.ts").TidePhaseState | null,
  env: EnvironmentSnapshot
): WindTideRelation {
  if (windDirectionDeg === null || tidePhaseState === null) {
    return "neutral_or_unknown_relationship";
  }

  // Slack or final hour: no meaningful flow to compare
  if (tidePhaseState === "slack" || tidePhaseState === "final_hour_before_slack") {
    return "neutral_or_unknown_relationship";
  }

  // Need tide station coordinates — approximate from station being "seaward"
  // If no station, stay neutral
  if (!env.nearest_tide_station_id || !env.coastal) {
    return "neutral_or_unknown_relationship";
  }

  // Use the bearing from station lat/lon to user lat/lon as "landward" direction
  // For most fishing spots, the tide station is at an inlet/harbor and user is inland
  // We don't have station lat/lon directly, so use a simplified approach:
  // Incoming tide flows toward shore (roughly from ocean to land)
  // The user's longitude relative to coast gives a rough direction

  // Simplified V1: Use bearing from the midpoint of the nearest coastline
  // Since we lack station coordinates, we approximate:
  // For US East Coast: ocean is to the east (bearing ~90° from shore)
  // For US West Coast: ocean is to the west (bearing ~270°)
  // For Gulf Coast: ocean is to the south (bearing ~180°)
  // Determine rough coast orientation from longitude
  let oceanBearing: number;
  if (env.lon > -82 && env.lat > 30) {
    // East coast (east of Florida panhandle, above Gulf)
    oceanBearing = 90;
  } else if (env.lon < -115) {
    // West coast
    oceanBearing = 270;
  } else if (env.lat < 31 && env.lon > -98) {
    // South Texas / Gulf
    oceanBearing = 170;
  } else if (env.lon >= -98 && env.lon <= -82 && env.lat < 31) {
    // Gulf Coast (LA, MS, AL, FL panhandle)
    oceanBearing = 180;
  } else {
    // Default: assume east
    oceanBearing = 90;
  }

  const isIncoming = tidePhaseState === "incoming_first_2_hours" ||
                     tidePhaseState === "incoming_mid";

  // Incoming: water flows FROM ocean TOWARD land (landward)
  // Tidal flow direction = opposite of ocean bearing (toward land)
  const landwardBearing = (oceanBearing + 180) % 360;
  const tideFlowDeg = isIncoming ? landwardBearing : oceanBearing;

  // Wind "from" direction: wind from N (0°) means air moves S (180°)
  const windFlowDeg = (windDirectionDeg + 180) % 360;

  const angleDelta = Math.abs(windFlowDeg - tideFlowDeg);
  const normalized = angleDelta > 180 ? 360 - angleDelta : angleDelta;

  if (normalized <= 45) return "wind_with_tide";
  if (normalized >= 135) return "wind_against_tide";
  return "neutral_or_unknown_relationship";
}
```

**NOTE:** The function signature changed — it now takes `tidePhaseState` and `env` as additional parameters. Update the call site in `deriveDerivedVariables`.

---

## Change 1.9: Update derivedVariables.ts — Freshwater Cold Context with 5 Bands

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
**Function:** `deriveFreshwaterColdContext`

REPLACE with updated version using `LatitudeBand`:

```typescript
function deriveFreshwaterColdContext(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  waterTempZone: WaterTempZone | null,
  latBand: LatitudeBand
): FreshwaterColdContext {
  if (waterType !== "freshwater" || waterTempZone === null) return null;
  if (waterTempZone !== "near_shutdown_cold" && waterTempZone !== "lethargic") return null;

  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;

  // Cold season varies by latitude band
  const coldSeasonMonths: Record<LatitudeBand, number[]> = {
    deep_south: [12, 1],
    south: [12, 1, 2],
    mid: [12, 1, 2, 3],
    north: [11, 12, 1, 2, 3, 4],
    far_north: [10, 11, 12, 1, 2, 3, 4],
  };

  const warmSeasonMonths: Record<LatitudeBand, number[]> = {
    deep_south: [5, 6, 7, 8, 9],
    south: [6, 7, 8],
    mid: [6, 7, 8],
    north: [7, 8],
    far_north: [7, 8],
  };

  if (coldSeasonMonths[latBand].includes(month)) return "seasonally_expected_cold";
  if (warmSeasonMonths[latBand].includes(month)) return "cold_shock";

  // Transition months: northern bands treat as expected, southern as shock
  return (latBand === "north" || latBand === "far_north")
    ? "seasonally_expected_cold"
    : "cold_shock";
}
```

---

## Change 1.10: Update derivedVariables.ts — Main `deriveDerivedVariables` Function

**File:** `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
**Function:** `deriveDerivedVariables`

Update the main export function to compute and pass through all new fields. Key changes:
1. Compute `effective_latitude` and `latitude_band`
2. Pass `latBand` to seasonal behavior, cold context, and water temp functions
3. Compute `saltwater_seasonal_state`
4. Compute `severe_weather_alert` and `severe_weather_reasons`
5. Pass new params to `deriveWindTideRelation`

```typescript
export function deriveDerivedVariables(
  env: EnvironmentSnapshot,
  waterType: WaterType
): DerivedVariables {
  const clm = currentLocalMinutes(env);
  const currentUtcMs = new Date(env.timestamp_utc).getTime();

  // Resolve freshwater subtype from hint in the snapshot
  const freshwater_subtype: FreshwaterSubtype | null =
    waterType === "freshwater" ? (env.freshwater_subtype_hint ?? "lake") : null;

  // Compute effective latitude (altitude-adjusted) and band
  const effective_latitude = computeEffectiveLatitude(env.lat, env.altitude_ft);
  const latitude_band = getLatitudeBand(effective_latitude);

  const { pressure_change_rate_mb_hr, pressure_state } = derivePressureTrend(env);
  const light_condition = deriveLightCondition(env, clm);
  const solunar_state = deriveSolunarState(env, clm);
  const tide_phase_state = deriveTidePhase(env, currentUtcMs);
  const { range_strength_pct, tide_strength_state } = deriveTideStrength(env);
  const { temp_trend_direction_f, temp_trend_state } = deriveTempTrend(env);

  // Seasonal behavior BEFORE water temp (water temp model uses it)
  const seasonal_fish_behavior = deriveSeasonalFishBehavior(
    env, waterType, freshwater_subtype, latitude_band
  );

  // Water temp with new params
  const { water_temp_f, water_temp_source } = resolveWaterTemp(
    env, waterType, freshwater_subtype, latitude_band, seasonal_fish_behavior
  );
  const water_temp_zone = deriveWaterTempZone(water_temp_f, waterType);

  // Cold context with latitude band
  const freshwater_cold_context = deriveFreshwaterColdContext(
    env, waterType, water_temp_zone, latitude_band
  );

  // Saltwater seasonal state (new)
  const saltwater_seasonal_state = deriveSaltwaterSeasonalState(env, waterType);

  const moon_phase = deriveMoonPhase(env.moon_phase_label, env.moon_phase_is_waxing);
  const precip_condition = derivePrecipCondition(
    env.current_precip_in_hr, env.precip_48hr_inches, waterType
  );

  const { alert: cold_stun_alert, status: cold_stun_status } = deriveColdStunAlert(
    waterType, env.measured_water_temp_f, env.measured_water_temp_72h_ago_f, env.timestamp_utc
  );

  const { alert: salinity_disruption_alert, status: salinity_disruption_status } =
    deriveSalinityDisruptionAlert(waterType, env.precip_48hr_inches);

  // Wind-tide with new approximation (pass tide phase and full env)
  const wind_tide_relation = deriveWindTideRelation(
    env.wind_direction_deg, tide_phase_state, env
  );

  // Severe weather detection (new)
  const { severe_weather_alert, severe_weather_reasons } = detectSevereWeather(env);

  return {
    current_local_minutes: clm,
    pressure_change_rate_mb_hr,
    pressure_state,
    light_condition,
    solunar_state,
    tide_phase_state,
    tide_strength_state,
    range_strength_pct,
    temp_trend_direction_f,
    temp_trend_state,
    water_temp_f,
    water_temp_source,
    water_temp_zone,
    freshwater_cold_context,
    freshwater_subtype,
    seasonal_fish_behavior,
    moon_phase,
    precip_condition,
    cold_stun_alert,
    cold_stun_status,
    salinity_disruption_alert,
    salinity_disruption_status,
    wind_tide_relation,
    // New fields:
    saltwater_seasonal_state,
    latitude_band,
    effective_latitude,
    severe_weather_alert,
    severe_weather_reasons,
  };
}
```

**IMPORTANT**: Also update the `resolveWaterTemp` function to pass `latBand` and `seasonalState` to `estimateFreshwaterTemp`:

```typescript
function resolveWaterTemp(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  subtype: FreshwaterSubtype | null,
  latBand: LatitudeBand,
  seasonalState: SeasonalFishBehaviorState | null
): { water_temp_f: number | null; water_temp_source: WaterTempSource } {
  if (waterType === "freshwater") {
    const est = estimateFreshwaterTemp(env, subtype, latBand, seasonalState);
    if (est !== null) {
      return { water_temp_f: est, water_temp_source: "freshwater_air_model" };
    }
    return { water_temp_f: null, water_temp_source: "unavailable" };
  }

  if (env.measured_water_temp_f !== null && env.measured_water_temp_source !== null) {
    return {
      water_temp_f: env.measured_water_temp_f,
      water_temp_source: env.measured_water_temp_source,
    };
  }

  return { water_temp_f: null, water_temp_source: "unavailable" };
}
```

Update the re-exports at the bottom of the file to include all new exported functions:
```typescript
export {
  hmToMinutes,
  localTimeStringToUtcMs,
  deriveWaterTempZone,
  estimateFreshwaterTemp,
  getMeteoSeason,
  getLatSeasonCorrection,
  computeEffectiveLatitude,
  getLatitudeBand,
};
```

---

## Change 1.11: Update get-environment/index.ts — Fetch Elevation

**File:** `supabase/functions/get-environment/index.ts`

### A. Add elevation fetch from Open-Meteo

Add a new function to fetch elevation:

```typescript
async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    // Open-Meteo returns elevation in meters; convert to feet
    const meters = data?.elevation?.[0] ?? data?.elevation ?? null;
    if (meters === null || meters === undefined) return null;
    return Math.round(Number(meters) * 3.28084);
  } catch {
    return null;
  }
}
```

### B. Call it in the main handler and include in response

In the main handler function, add the elevation fetch to the parallel fetch calls (Promise.allSettled). Add the result to the response object:

```typescript
// Add to the parallel fetches:
const elevationPromise = fetchElevation(lat, lon);

// After all fetches resolve:
const altitude_ft = await elevationPromise;

// Add to the response object:
altitude_ft: altitude_ft,
```

### C. Add `altitude_ft` to the response interface/shape

Ensure the EnvironmentData interface in get-environment includes:
```typescript
altitude_ft?: number | null;
```

---

## Change 1.12: Update get-environment/index.ts — Solunar Duration by Moon Phase

**File:** `supabase/functions/get-environment/index.ts`

Find the solunar period computation section (where major/minor periods are built from moon transit times). Replace the fixed ±60 and ±30 minute windows with phase-modulated durations:

```typescript
function getSolunarHalfWindow(
  moonPhase: string | null,
  periodType: "major" | "minor"
): number {
  const phase = (moonPhase ?? "").toLowerCase();
  if (phase.includes("new") || phase.includes("full")) {
    return periodType === "major" ? 75 : 45;
  }
  if (phase.includes("gibbous")) {
    return periodType === "major" ? 65 : 35;
  }
  if (phase.includes("quarter")) {
    return periodType === "major" ? 50 : 28;
  }
  if (phase.includes("crescent")) {
    return periodType === "major" ? 35 : 20;
  }
  return periodType === "major" ? 60 : 30;
}
```

Then, where major periods are constructed (±60 min around transits), replace the hardcoded 60 with `getSolunarHalfWindow(moonPhase, "major")`. Similarly replace the hardcoded 30 for minor periods with `getSolunarHalfWindow(moonPhase, "minor")`.

Example — find code like:
```typescript
// BEFORE (approximate pattern — find the actual code):
const majorHalf = 60; // ±60 minutes
// ...
start: subtractMinutes(transit, 60),
end: addMinutes(transit, 60),
```

Replace with:
```typescript
const majorHalf = getSolunarHalfWindow(moonPhaseLabel, "major");
// ...
start: subtractMinutes(transit, majorHalf),
end: addMinutes(transit, majorHalf),
```

Do the same for minor periods using `getSolunarHalfWindow(moonPhaseLabel, "minor")`.

---

## Change 1.13: Update get-environment/index.ts — Timezone from Open-Meteo

**File:** `supabase/functions/get-environment/index.ts`

Find the timezone/offset calculation section. Open-Meteo returns `timezone` and `utc_offset_seconds` in its response. Use these directly instead of the longitude-based fallback:

```typescript
// After parsing Open-Meteo response:
const omTimezone = omData.timezone ?? null;           // e.g., "America/New_York"
const omOffsetSeconds = omData.utc_offset_seconds ?? null; // e.g., -18000

// Use Open-Meteo values as primary, longitude fallback as last resort
const timezone = omTimezone ?? fallbackTimezone(lon);
const tz_offset_hours = omOffsetSeconds !== null
  ? omOffsetSeconds / 3600
  : fallbackTzOffset(lon);
```

Keep the existing longitude-based fallback function as a last resort, but prefer Open-Meteo values.

---

## Change 1.14: Update get-environment/index.ts — Fetch Wind Gusts

**File:** `supabase/functions/get-environment/index.ts`

In the Open-Meteo API call, add `wind_gusts_10m` to the `current` parameter list:

```typescript
// Find the params construction and add wind_gusts_10m:
current: 'temperature_2m,relative_humidity_2m,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,precipitation,wind_gusts_10m',
```

Then extract it from the response:
```typescript
// Add to the weather object:
gust_speed: Number(current.wind_gusts_10m) || null,
```

**IMPORTANT**: Open-Meteo returns gusts in the same unit as wind_speed (mph if imperial). Map this to the response and ensure the adapter passes it through as `gust_speed_mph` in the EnvironmentSnapshot.

---

## Sweep 1 Verification Checkpoint

After completing all changes in this sweep, verify:

1. **TypeScript compiles**: Run `deno check` on all modified files
2. **New types exist**: `LatitudeBand`, `SaltwaterSeasonalState`, `"mild_winter_active"`, new `SolunarState` values, `"FAIR" | "SLOW"` in WindowLabel
3. **deriveDerivedVariables returns new fields**: `saltwater_seasonal_state`, `latitude_band`, `effective_latitude`, `severe_weather_alert`, `severe_weather_reasons`
4. **Water temp test**: For lat=44.3, lon=-84.7 (Prudenville MI), March, lake subtype: water_temp_f should be 32-35°F (not 27°F). River subtype: should be 33-38°F.
5. **Seasonal test**: lat=27 (South FL), January → `mild_winter_active`. lat=44 (MI), March → `deep_winter_survival`. lat=36 (TN), April → `spawn_period`.
6. **Altitude test**: lat=39, altitude=7000ft → effective_latitude=45.6 → `far_north` band
7. **Solunar test**: 31-60 min from major window → `within_60min_of_major` (not `outside_all_windows`)
8. **Wind-tide test**: East coast location, incoming tide, wind from W → `wind_with_tide`

---

**STOP HERE. Verify all changes compile and produce correct derived variables before proceeding to Sweep 2.**
