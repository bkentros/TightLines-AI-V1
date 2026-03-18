# ENGINE REFINEMENT — SWEEP 3: Integration, LLM, Adapter & UI

## Prerequisites
- Sweep 1 AND Sweep 2 MUST be fully completed and verified before starting Sweep 3
- All new types from types.ts must exist (LatitudeBand, SaltwaterSeasonalState, mild_winter_active, new SolunarState values, FAIR/SLOW WindowLabel, FrontSeverity, etc.)
- deriveDerivedVariables must return all new fields (saltwater_seasonal_state, latitude_band, effective_latitude, severe_weather_alert, severe_weather_reasons)
- scoreEngine, timeWindowEngine, recoveryModifier, behaviorInference, and index.ts changes must all be completed
- computeTimeWindows must return { best_windows, fair_windows, worst_windows }
- EngineOutput must include fair_windows, severe_weather_alert, severe_weather_reasons, component_detail, altitude_ft, effective_latitude, latitude_band, saltwater_seasonal_state
- Read each target file in FULL before modifying

## Files Modified
- `supabase/functions/_shared/envAdapter.ts`
- `supabase/functions/get-environment/index.ts` (minor additions)
- `supabase/functions/how-fishing/index.ts`
- `lib/howFishing.ts`
- `app/how-fishing-results.tsx`

---

## Change 3.1: envAdapter.ts — Pass Altitude Through to Snapshot

**File:** `supabase/functions/_shared/envAdapter.ts`

### A. Add `altitude_ft` to the EnvironmentData interface

Find the `EnvironmentData` interface at the top of the file. Add this field alongside the other optional fields:

```typescript
  altitude_ft?: number | null;
```

### B. Add `gust_speed` to the EnvironmentData weather sub-interface

Find the `weather?:` block inside EnvironmentData. Add gust_speed:

```typescript
  weather?: {
    // ... existing fields ...
    gust_speed?: number | null;    // NEW — wind gusts in same unit as wind_speed
  };
```

### C. Pass altitude and gust through in `toEngineSnapshot`

Find the return object in `toEngineSnapshot`. Add/update these lines:

```typescript
    // Find this existing line:
    gust_speed_mph: null, // not fetched by get-environment currently

    // REPLACE with:
    gust_speed_mph: env.weather?.gust_speed ?? null,

    // Add this new line (after the coastal/tide station block):
    altitude_ft: env.altitude_ft ?? null,
```

The full updated return block should include `altitude_ft` and `gust_speed_mph` mapped correctly.

---

## Change 3.2: get-environment/index.ts — Add gust_speed to response

**File:** `supabase/functions/get-environment/index.ts`

This builds on Change 1.14 from Sweep 1 (which added `wind_gusts_10m` to the Open-Meteo API call). Ensure the gust value is included in the WeatherData interface and response.

### A. Add gust_speed to WeatherData interface

Find the `WeatherData` interface. Add:

```typescript
  gust_speed?: number | null;
```

### B. Set gust_speed when building the weather object

Find where the `weather` object is constructed from the Open-Meteo current data. Add:

```typescript
    gust_speed: Number(current.wind_gusts_10m) || null,
```

This ensures gust data flows from Open-Meteo → get-environment response → envAdapter → EnvironmentSnapshot → severe weather detection.

---

## Change 3.3: how-fishing/index.ts — Dual Engine Runs (Lake + River for Inland)

**File:** `supabase/functions/how-fishing/index.ts`

Currently, inland locations run the engine once with `freshwater` water type using whatever `freshwater_subtype` the client sent. We now run TWO parallel engine calls for inland — one for `lake` and one for `river_stream` — and bundle both into the response.

### A. Update the inland execution path

Find the `if (isCoastal)` / `else` block (around lines 627-644). Replace the **else (inland)** branch:

```typescript
  if (isCoastal) {
    mode = "coastal_multi";
    // Section 5B/5C — three parallel runs for coastal
    const [fwResult, swResult, bkResult] = await Promise.all([
      runReportForWaterType("freshwater"),
      runReportForWaterType("saltwater"),
      runReportForWaterType("brackish"),
    ]);
    reports = { freshwater: fwResult, saltwater: swResult, brackish: bkResult };
    for (const [key, r] of Object.entries(reports)) {
      if (r.status === "error") failedReports.push(key);
    }
  } else {
    // Inland: run BOTH lake and river_stream in parallel
    mode = "single";

    // Create separate snapshots with different freshwater subtype hints
    const lakeSnapshot = { ...engineSnapshot, freshwater_subtype_hint: "lake" as const };
    const riverSnapshot = { ...engineSnapshot, freshwater_subtype_hint: "river_stream" as const };

    // Run both in parallel
    const [lakeResult, riverResult] = await Promise.all([
      runReportForWaterTypeWithSnapshot(lakeSnapshot, "freshwater", "lake"),
      runReportForWaterTypeWithSnapshot(riverSnapshot, "freshwater", "river_stream"),
    ]);

    reports = {
      freshwater_lake: lakeResult,
      freshwater_river: riverResult,
    };

    for (const [key, r] of Object.entries(reports)) {
      if (r.status === "error") failedReports.push(key);
    }
  }
```

### B. Add the new helper function `runReportForWaterTypeWithSnapshot`

Add this function right after the existing `runReportForWaterType` function:

```typescript
  async function runReportForWaterTypeWithSnapshot(
    snapshot: typeof engineSnapshot,
    waterType: WaterType,
    subtypeLabel: string
  ): Promise<ReportEntry> {
    let engineOutput: ReturnType<typeof runCoreIntelligence>;
    try {
      engineOutput = runCoreIntelligence(snapshot, waterType);
    } catch (e) {
      return {
        status: "error",
        water_type: waterType,
        engine: null,
        llm: null,
        error: `engine_error: ${String(e)}`,
      };
    }

    const llmPayload = buildLLMPayload(engineOutput, analysisDateLocal, currentTimeLocal);
    // Add subtype label to payload for LLM context
    (llmPayload as Record<string, unknown>).freshwater_subtype_label = subtypeLabel;

    const { llm, inputTokens, outputTokens, error: llmError } = await callClaudeForReport(
      anthropicKey,
      llmPayload
    );
    totalInputTokens += inputTokens;
    totalOutputTokens += outputTokens;
    const tokenCostUsd = computeCallCost(inputTokens, outputTokens);

    if (llmError || !llm) {
      // LLM failed — generate deterministic fallback (Change 3.6)
      const fallbackLlm = generateDeterministicFallback(engineOutput, subtypeLabel);
      return {
        status: "ok",
        water_type: waterType,
        engine: engineOutput,
        llm: fallbackLlm,
        error: null,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        token_cost_usd: tokenCostUsd,
      };
    }

    return {
      status: "ok",
      water_type: waterType,
      engine: engineOutput,
      llm,
      error: null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      token_cost_usd: tokenCostUsd,
    };
  }
```

### C. Also update `runReportForWaterType` to use fallback on LLM failure

In the existing `runReportForWaterType` function, replace the LLM failure return (around lines 596-609):

```typescript
    if (llmError || !llm) {
      // LLM failed — generate deterministic fallback instead of returning error
      const fallbackLlm = generateDeterministicFallback(engineOutput, waterType);
      return {
        status: "ok",
        water_type: waterType,
        engine: engineOutput,
        llm: fallbackLlm,
        error: null,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        token_cost_usd: tokenCostUsd,
      };
    }
```

### D. Update mode type

The `mode` variable type needs to support the new inland dual-run. Update:

```typescript
// BEFORE:
let mode: "single" | "coastal_multi";

// AFTER:
let mode: "single" | "coastal_multi" | "inland_dual";
```

And set it to `"inland_dual"` in the inland branch:

```typescript
  } else {
    mode = "inland_dual";
    // ... rest of inland logic
  }
```

### E. Update response bundle for inland dual

Find where `responseBundle` is constructed. Update `freshwater_subtype` and `default_tab`:

```typescript
  const responseBundle = {
    feature: "hows_fishing_feature_v1",
    mode,
    default_tab: mode === "inland_dual" ? "freshwater_lake" : "freshwater",
    generated_at: timestampUtc,
    cache_expires_at: cacheExpiresAt,
    freshwater_subtype: freshwaterSubtype,
    reports: Object.fromEntries(
      Object.entries(reports).map(([key, r]) => [
        key,
        {
          status: r.status,
          water_type: r.water_type,
          engine: r.engine
            ? {
                environment: r.engine.environment,
                scoring: r.engine.scoring,
                behavior: r.engine.behavior,
                data_quality: r.engine.data_quality,
                alerts: r.engine.alerts,
                time_windows: r.engine.time_windows,
                fair_windows: r.engine.fair_windows ?? [],      // NEW
                worst_windows: r.engine.worst_windows,
              }
            : null,
          llm: r.llm,
          error: r.error,
          ...(r.input_tokens !== undefined && r.output_tokens !== undefined && r.token_cost_usd !== undefined
            ? {
                usage: {
                  input_tokens: r.input_tokens,
                  output_tokens: r.output_tokens,
                  token_cost_usd: r.token_cost_usd,
                },
              }
            : {}),
        },
      ])
    ),
    failed_reports: failedReports,
  };
```

---

## Change 3.4: how-fishing/index.ts — Coastal Detection Hardening

**File:** `supabase/functions/how-fishing/index.ts`

The current coastal detection relies solely on the NOAA tide station lookup succeeding (`engineSnapshot.coastal`). If NOAA is down, a coastal location gets `coastal: false` and only gets a freshwater report. Add a backup distance-to-coast check.

### A. Add a distance-to-coast backup function

Add this function near the top helpers section:

```typescript
/**
 * Approximate coastal check using latitude/longitude heuristics.
 * Used as a fallback when NOAA station lookup fails.
 * Returns true if the location is likely within ~15 miles of a US coast.
 */
function isLikelyCoastal(lat: number, lon: number): boolean {
  // Florida peninsula: anywhere south of 30°N and east of -87.5°W
  if (lat < 30 && lon > -87.5 && lat > 24) return true;
  // Florida Keys
  if (lat < 25.5 && lat > 24 && lon > -82) return true;
  // US East Coast: within ~0.15° of coast (very rough)
  // The coastline roughly follows these ranges — err on the side of false negatives
  if (lat > 30 && lat < 45 && lon > -76 && lon < -74) return true; // NJ/NY/CT
  if (lat > 25 && lat < 31 && lon > -81.5 && lon < -79.5) return true; // FL/GA/SC east
  // Gulf Coast
  if (lat > 28 && lat < 31 && lon > -97 && lon < -88 && lat < 30.5) return true;
  // Southern California
  if (lat > 32 && lat < 35 && lon > -120 && lon < -117) return true;
  // Pacific Northwest coast
  if (lat > 42 && lat < 49 && lon > -125 && lon < -123.5) return true;

  return false;
}
```

### B. Update the coastal determination

Find the `isCoastal` assignment (around line 543). Replace:

```typescript
// BEFORE:
const isCoastal = engineSnapshot.coastal;

// AFTER:
const isCoastal = engineSnapshot.coastal || isLikelyCoastal(lat, lon);
```

---

## Change 3.5: how-fishing/index.ts — LLM System Prompt Updates

**File:** `supabase/functions/how-fishing/index.ts`
**Constant:** `HOW_FISHING_SYSTEM_PROMPT`

REPLACE the entire `HOW_FISHING_SYSTEM_PROMPT` with this updated version. Key changes:
- Added `"mild_winter_active"` to seasonal behavior guidance
- Added forbidden word replacements for new engine states
- Added FAIR tier guidance for time windows
- Added severe weather alert handling
- Added saltwater seasonal context guidance
- Updated time window JSON schema to include FAIR

```typescript
const HOW_FISHING_SYSTEM_PROMPT = `You are an experienced fishing guide giving a quick, honest rundown of today's fishing conditions. Write like you're talking to a fellow angler — plain language, no jargon, no science terms.

Rules:
- The engine numbers are final. Never recalculate or contradict the score, time windows, or alerts.
- Be direct. Good conditions? Say so. Tough day? Say that clearly too.
- Explain WHY fish will or won't bite — in fish-behavior terms, not meteorological ones.
- Keep it tight. Anglers should understand the situation in a few seconds.
- Never suggest specific lures, species, or tactics.
- Use exactly the time windows the engine provides. Never invent your own.

Language rules:
- Do not use these words: "cold-stunned" (freshwater), "peak water temp", "meteorological", "thermocline", "lethargic" (use "sluggish" instead), "suppressed" (use "slow" or "shut down"), "biological", "solunar" (use "feeding window" or "feeding cycle"), "barometric" (use "pressure"), "thermal stress" (use "too hot" or "heat stress").
- "peak_aggression" zone means fish are in their optimal temperature range — describe it as "fish are comfortable and feeding well" or similar.
- When talking about temperature trends, refer to air temperature for freshwater/inland. Only say "water temperature" trend for coastal when measured data is available (water_temp_is_estimated: false).
- Do not tell the user to check conditions themselves, verify anything, or monitor anything. Give them the answer.
- If water_temp_is_estimated is true, you may mention the water temp is estimated once in the tips — don't dwell on it.
- Use the seasonal_fish_behavior field to frame fish activity: deep_winter_survival means fish are barely moving and holding deep; pre_spawn_buildup means fish are starting to move and feed aggressively; spawn_period means fish are distracted and location-shifted; post_spawn_recovery means fish are scattered and selective; summer_peak_activity means fish are active on dawn/dusk edges; summer_heat_suppression means fish are pushed deep to cool water; fall_feed_buildup means fish are gorging hard before winter; late_fall_slowdown means fish are slowing down; mild_winter_active means fish are comfortable and feeding normally despite winter — treat as a good fishing day, not a survival situation.
- If saltwater_seasonal_state is present: sw_cold_inactive means fish are sluggish and deep, requiring slow presentations; sw_cold_mild_active means fish are feeding but slower — focus on midday warming periods; sw_transitional_feed means fish are actively transitioning and feeding well; sw_summer_peak means summer prime time — fish are aggressive; sw_summer_heat_stress means fish are avoiding heat — focus on dawn, dusk, and night.
- If severe_weather_alert is true: START your headline with a weather safety warning. Mention the specific dangers (from severe_weather_reasons). Still provide the fishing score and times, but lead with safety.

Length limits:
- headline_summary: exactly 1 sentence, max 20 words
- overall_fishing_rating.summary: 1 sentence, max 24 words
- best_times_to_fish_today: max 2 items, reasoning max 16 words each
- worst_times_to_fish_today: max 2 items, reasoning max 16 words each
- decent_times_today: max 2 items, reasoning max 16 words each
- key_factors values: short phrases, max 16 words each
- tips_for_today: exactly 3 tips, max 12 words each — make them actionable, specific to today

Output valid JSON only matching this schema:
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
  "decent_times_today": [
    {
      "time_range": "string",
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
}`;
```

---

## Change 3.6: how-fishing/index.ts — Deterministic LLM Fallback

**File:** `supabase/functions/how-fishing/index.ts`

Add a function that generates a structured LLM-like response purely from engine data when Claude is unavailable. This ensures the user ALWAYS gets a report, even if the LLM fails.

Add this function before the `callClaudeForReport` function:

```typescript
// ---------------------------------------------------------------------------
// Deterministic Fallback — generates LLM-shaped output from engine data alone
// Used when Claude is unavailable or returns malformed responses.
// ---------------------------------------------------------------------------

function generateDeterministicFallback(
  engineOutput: ReturnType<typeof runCoreIntelligence>,
  subtypeOrWaterType: string
): LLMOutput {
  const score = engineOutput.scoring.adjusted_score;
  const rating = engineOutput.scoring.overall_rating;
  const env = engineOutput.environment;
  const behavior = engineOutput.behavior;
  const alerts = engineOutput.alerts;

  // Headline
  let headline: string;
  if (alerts.severe_weather_alert) {
    headline = "Severe weather warning — check conditions before heading out.";
  } else if (alerts.cold_stun_alert) {
    headline = "Fish activity near zero — extremely cold water conditions.";
  } else if (score >= 80) {
    headline = `${rating} conditions — fish are feeding actively today.`;
  } else if (score >= 60) {
    headline = `${rating} conditions — decent opportunities if you time it right.`;
  } else if (score >= 40) {
    headline = `${rating} conditions — fish are present but not aggressive.`;
  } else {
    headline = `${rating} conditions — tough fishing expected today.`;
  }

  // Rating summary
  let ratingSummary: string;
  if (score >= 80) {
    ratingSummary = "Strong conditions across the board — multiple factors working in your favor.";
  } else if (score >= 60) {
    ratingSummary = "Conditions are favorable with some factors holding things back slightly.";
  } else if (score >= 40) {
    ratingSummary = "Mixed conditions — target the best time windows for your best shot.";
  } else {
    ratingSummary = "Conditions are working against the bite — patience and finesse will be key.";
  }

  // Best times from engine windows
  const bestTimes = engineOutput.time_windows.slice(0, 2).map((w) => ({
    time_range: `${w.start_local} – ${w.end_local}`,
    label: w.label as "PRIME" | "GOOD",
    reasoning: w.drivers.length > 0
      ? w.drivers.slice(0, 2).join(" + ").replace(/_/g, " ")
      : "Best available window",
  }));

  // Worst times
  const worstTimes = engineOutput.worst_windows.slice(0, 2).map((w) => ({
    time_range: `${w.start_local} – ${w.end_local}`,
    reasoning: "Lowest activity period",
  }));

  // Key factors from engine state
  const keyFactors: Record<string, string> = {
    barometric_pressure: env.pressure_state
      ? env.pressure_state.replace(/_/g, " ")
      : "Data unavailable",
    temperature_trend: env.temp_trend_state
      ? env.temp_trend_state.replace(/_/g, " ")
      : "Data unavailable",
    light_conditions: env.light_condition
      ? env.light_condition.replace(/_/g, " ")
      : "Data unavailable",
    tide_or_solunar: env.solunar_state
      ? env.solunar_state.replace(/_/g, " ")
      : (env.tide_phase_state ? env.tide_phase_state.replace(/_/g, " ") : "Data unavailable"),
    moon_phase: env.moon_phase ?? "Data unavailable",
    wind: env.wind_speed_mph !== null
      ? `${env.wind_speed_mph} mph ${env.wind_direction ?? ""}`
      : "Data unavailable",
    precipitation_recent_rain: env.precip_condition
      ? env.precip_condition.replace(/_/g, " ")
      : "Data unavailable",
  };

  // Tips based on behavior state
  const tips: string[] = [];
  if (behavior.metabolic_state === "shutdown" || behavior.metabolic_state === "lethargic") {
    tips.push("Fish are sluggish — use slow presentations");
  } else if (behavior.metabolic_state === "aggressive") {
    tips.push("Fish are aggressive — cover water quickly");
  } else {
    tips.push("Match your presentation to fish activity level");
  }

  if (behavior.positioning_bias) {
    const pos = behavior.positioning_bias.replace(/_/g, " ");
    tips.push(`Target ${pos}`);
  } else {
    tips.push("Focus on structure and depth transitions");
  }

  if (alerts.recovery_active && alerts.front_label) {
    tips.push("Cold front recovery — slow down your approach");
  } else if (env.pressure_state === "slowly_falling") {
    tips.push("Falling pressure often triggers feeding activity");
  } else {
    tips.push("Fish the prime windows for your best chance");
  }

  // Truncate tips to 12 words max
  const truncatedTips = tips.map((t) => {
    const words = t.split(" ");
    return words.length > 12 ? words.slice(0, 12).join(" ") : t;
  });

  return {
    headline_summary: headline,
    overall_fishing_rating: {
      label: rating,
      summary: ratingSummary,
    },
    best_times_to_fish_today: bestTimes,
    worst_times_to_fish_today: worstTimes,
    key_factors: keyFactors,
    tips_for_today: truncatedTips.slice(0, 3),
  };
}
```

---

## Change 3.7: how-fishing/index.ts — Tip Word Limit Fix (14 → 12)

**File:** `supabase/functions/how-fishing/index.ts`
**Function:** `sanitizeTips`

Find the `sanitizeTips` function. Change the word limit from 14 to 12:

```typescript
// BEFORE:
    .map((value) => truncateWords(value, 14))

// AFTER:
    .map((value) => truncateWords(value, 12))
```

---

## Change 3.8: how-fishing/index.ts — Update LLM Output Interface for FAIR Times

**File:** `supabase/functions/how-fishing/index.ts`

### A. Update the `LLMOutput` interface

Add `decent_times_today` to the interface:

```typescript
interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: { label: string; summary: string };
  best_times_to_fish_today: Array<{ time_range: string; label: string; reasoning: string }>;
  decent_times_today?: Array<{ time_range: string; reasoning: string }>;  // NEW
  worst_times_to_fish_today: Array<{ time_range: string; reasoning: string }>;
  key_factors: Record<string, string>;
  tips_for_today: string[];
}
```

### B. Add `sanitizeDecentTimes` function

Add this function alongside the existing `sanitizeBestTimes` and `sanitizeWorstTimes`:

```typescript
function sanitizeDecentTimes(input: unknown): Array<{ time_range: string; reasoning: string }> {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .slice(0, 2)
    .map((item) => ({
      time_range: sanitizeTopLevelText(item.time_range, 6),
      reasoning: sanitizeTopLevelText(item.reasoning, 18),
    }))
    .filter((item) => item.time_range.length > 0 && item.reasoning.length > 0);
}
```

### C. Update `parseLLMOutput` to include decent_times_today

In the `parseLLMOutput` function, add decent_times_today to the returned object:

```typescript
      return {
        headline_summary: sanitizeTopLevelText(parsed.headline_summary, 22),
        overall_fishing_rating: {
          label: sanitizeTopLevelText(overall.label, 2),
          summary: sanitizeTopLevelText(overall.summary, 26),
        },
        best_times_to_fish_today: sanitizeBestTimes(parsed.best_times_to_fish_today),
        decent_times_today: sanitizeDecentTimes(parsed.decent_times_today),  // NEW
        worst_times_to_fish_today: sanitizeWorstTimes(parsed.worst_times_to_fish_today),
        key_factors: sanitizeKeyFactorMap(parsed.key_factors),
        tips_for_today: sanitizeTips(parsed.tips_for_today),
      };
```

**NOTE:** Do NOT add `decent_times_today` to the required key validation check — it's optional (the LLM may not always include it).

---

## Change 3.9: how-fishing/index.ts — Update buildLLMPayload for New Fields

**File:** `supabase/functions/how-fishing/index.ts`
**Function:** `buildLLMPayload`

Add the new engine fields to the LLM payload so the LLM has full context:

```typescript
function buildLLMPayload(
  engineOutput: ReturnType<typeof runCoreIntelligence>,
  analysisDateLocal: string,
  currentTimeLocal: string
): Record<string, unknown> {
  const waterTempNarrative =
    engineOutput.environment.water_temp_source === "freshwater_air_model"
      ? "estimated from recent air-temperature history"
      : engineOutput.environment.water_temp_source === "noaa_coops"
        ? "measured coastal water temperature from NOAA CO-OPS"
        : "unavailable";

  const isFreshwaterEstimated = engineOutput.environment.water_temp_source !== "noaa_coops";
  const measuredTrendAvailable =
    engineOutput.water_type !== "freshwater" &&
    engineOutput.environment.water_temp_source === "noaa_coops";

  return {
    feature: "hows_fishing_feature_v1",
    water_type: engineOutput.water_type,
    freshwater_subtype: engineOutput.environment.freshwater_subtype ?? null,
    seasonal_fish_behavior: engineOutput.environment.seasonal_fish_behavior ?? null,
    saltwater_seasonal_state: engineOutput.environment.saltwater_seasonal_state ?? null,  // NEW
    location: engineOutput.location,
    score: {
      adjusted_score: engineOutput.scoring.adjusted_score,
      raw_score: engineOutput.scoring.raw_score,
      overall_rating: engineOutput.scoring.overall_rating,
      recovery_multiplier: engineOutput.scoring.recovery_multiplier,
    },
    conditions: {
      air_temp_f: engineOutput.environment.air_temp_f,
      water_temp_f: engineOutput.environment.water_temp_f,
      water_temp_source: engineOutput.environment.water_temp_source,
      water_temp_note: waterTempNarrative,
      water_temp_is_estimated: isFreshwaterEstimated,
      measured_water_temp_trend_available: measuredTrendAvailable,
      air_temp_trend_direction_f: engineOutput.environment.temp_trend_direction_f,
      water_temp_zone: engineOutput.environment.water_temp_zone,
      pressure_mb: engineOutput.environment.pressure_mb,
      pressure_change_rate_mb_hr: engineOutput.environment.pressure_change_rate_mb_hr,
      pressure_state: engineOutput.environment.pressure_state,
      temp_trend_state: engineOutput.environment.temp_trend_state,
      light_condition: engineOutput.environment.light_condition,
      tide_phase_state: engineOutput.environment.tide_phase_state,
      tide_strength_state: engineOutput.environment.tide_strength_state,
      solunar_state: engineOutput.environment.solunar_state,
      moon_phase: engineOutput.environment.moon_phase,
      moon_illumination_pct: engineOutput.environment.moon_illumination_pct,
      wind_speed_mph: engineOutput.environment.wind_speed_mph,
      wind_direction: engineOutput.environment.wind_direction,
      cloud_cover_pct: engineOutput.environment.cloud_cover_pct,
      precip_48hr_inches: engineOutput.environment.precip_48hr_inches,
      precip_7day_inches: engineOutput.environment.precip_7day_inches,
      precip_condition: engineOutput.environment.precip_condition,
      days_since_front: engineOutput.environment.days_since_front,
      front_label: engineOutput.alerts.front_label ?? null,
    },
    behavior_summary: {
      metabolic_state: engineOutput.behavior.metabolic_state,
      aggression_state: engineOutput.behavior.aggression_state,
      feeding_timer: engineOutput.behavior.feeding_timer,
      presentation_difficulty: engineOutput.behavior.presentation_difficulty,
      positioning_bias: engineOutput.behavior.positioning_bias,
      dominant_positive_drivers: engineOutput.behavior.dominant_positive_drivers,
      dominant_negative_drivers: engineOutput.behavior.dominant_negative_drivers,
    },
    data_quality: engineOutput.data_quality,
    alerts: {
      ...engineOutput.alerts,
      severe_weather_alert: engineOutput.alerts.severe_weather_alert ?? false,        // NEW
      severe_weather_reasons: engineOutput.alerts.severe_weather_reasons ?? [],       // NEW
    },
    best_windows: engineOutput.time_windows.slice(0, 2),
    fair_windows: (engineOutput.fair_windows ?? []).slice(0, 2),                     // NEW
    worst_windows: engineOutput.worst_windows.slice(0, 2),
    analysis_date_local: analysisDateLocal,
    current_time_local: currentTimeLocal,
  };
}
```

---

## Change 3.10: lib/howFishing.ts — Update Client-Side Types

**File:** `lib/howFishing.ts`

### A. Update `TimeWindow` interface for 4-tier labels

```typescript
// BEFORE:
export interface TimeWindow {
  label: 'PRIME' | 'GOOD' | 'SECONDARY';
  start_local: string;
  end_local: string;
  window_score: number;
  drivers: string[];
}

// AFTER:
export interface TimeWindow {
  label: 'PRIME' | 'GOOD' | 'FAIR' | 'SLOW';
  start_local: string;
  end_local: string;
  window_score: number;
  drivers: string[];
}
```

### B. Update `WorstWindow` to include label

```typescript
// BEFORE:
export interface WorstWindow {
  start_local: string;
  end_local: string;
  window_score: number;
}

// AFTER:
export interface WorstWindow {
  label?: 'SLOW';
  start_local: string;
  end_local: string;
  window_score: number;
}
```

### C. Update `EngineOutput` to include fair_windows

```typescript
export interface EngineOutput {
  environment: EngineEnvironment;
  scoring: EngineScoring;
  behavior: EngineBehavior;
  data_quality: DataQuality;
  alerts: EngineAlerts;
  time_windows: TimeWindow[];
  fair_windows: TimeWindow[];      // NEW
  worst_windows: WorstWindow[];
}
```

### D. Update `EngineAlerts` for severe weather

```typescript
export interface EngineAlerts {
  cold_stun_alert: boolean;
  cold_stun_status: AlertStatus;
  salinity_disruption_alert: boolean;
  salinity_disruption_status: AlertStatus;
  rapid_cooling_alert: boolean;
  recovery_active: boolean;
  days_since_front: number;
  front_severity?: 'mild' | 'moderate' | 'severe' | null;
  front_label?: string | null;
  severe_weather_alert?: boolean;              // NEW
  severe_weather_reasons?: string[];           // NEW
}
```

### E. Update `EngineEnvironment` for new fields

Add to the existing `EngineEnvironment` interface:

```typescript
export interface EngineEnvironment {
  // ... all existing fields stay ...
  wind_direction_deg?: number | null;          // NEW
  effective_latitude?: number | null;          // NEW
  latitude_band?: string | null;               // NEW
  saltwater_seasonal_state?: string | null;    // NEW
  altitude_ft?: number | null;                 // NEW
  severe_weather_alert?: boolean;              // NEW
  severe_weather_reasons?: string[];           // NEW
}
```

### F. Update `LLMOutput` for decent times

```typescript
export interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: LLMRating;
  best_times_to_fish_today: LLMBestTime[];
  decent_times_today?: LLMDecentTime[];        // NEW
  worst_times_to_fish_today: LLMWorstTime[];
  key_factors: LLMKeyFactors;
  tips_for_today: string[];
}
```

Add the new interface:

```typescript
export interface LLMDecentTime {
  time_range: string;
  reasoning: string;
}
```

### G. Update `HowFishingBundle` for mode and report keys

```typescript
export interface HowFishingBundle {
  feature: 'hows_fishing_feature_v1';
  mode: 'single' | 'coastal_multi' | 'inland_dual';   // UPDATED
  default_tab: string;                                   // UPDATED from WaterType to string
  generated_at: string;
  cache_expires_at: string;
  freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir';
  reports: {
    freshwater?: WaterTypeReport;
    saltwater?: WaterTypeReport;
    brackish?: WaterTypeReport;
    freshwater_lake?: WaterTypeReport;                   // NEW
    freshwater_river?: WaterTypeReport;                  // NEW
  };
  failed_reports: string[];
}
```

### H. Update `LLMBestTime` for FAIR label

```typescript
export interface LLMBestTime {
  time_range: string;
  label: 'PRIME' | 'GOOD' | 'FAIR';    // UPDATED — added FAIR
  reasoning: string;
}
```

---

## Change 3.11: app/how-fishing-results.tsx — Lake/River Tab for Inland

**File:** `app/how-fishing-results.tsx`

### A. Update available tabs logic

Find where `availableTabs` is computed (around line 510). Replace:

```typescript
// BEFORE:
const isCoastal = bundle?.mode === 'coastal_multi';
const availableTabs: WaterType[] = isCoastal
  ? ['freshwater', 'saltwater', 'brackish']
  : ['freshwater'];

// AFTER:
const isCoastal = bundle?.mode === 'coastal_multi';
const isInlandDual = bundle?.mode === 'inland_dual';
const availableTabs: string[] = isCoastal
  ? ['freshwater', 'saltwater', 'brackish']
  : isInlandDual
    ? ['freshwater_lake', 'freshwater_river']
    : ['freshwater'];
```

### B. Update TAB_LABELS for lake/river

Update the `TAB_LABELS` constant:

```typescript
// BEFORE:
const TAB_LABELS: Record<WaterType, string> = {
  freshwater: 'Freshwater',
  saltwater: 'Saltwater',
  brackish: 'Brackish',
};

// AFTER:
const TAB_LABELS: Record<string, string> = {
  freshwater: 'Freshwater',
  freshwater_lake: 'Lake',
  freshwater_river: 'River',
  saltwater: 'Saltwater',
  brackish: 'Brackish',
};
```

### C. Update activeTab state type

```typescript
// BEFORE:
const [activeTab, setActiveTab] = useState<WaterType>(
  (bundle?.default_tab as WaterType) ?? 'freshwater'
);

// AFTER:
const [activeTab, setActiveTab] = useState<string>(
  bundle?.default_tab ?? 'freshwater'
);
```

### D. Update TabBar props to accept string instead of WaterType

Update the `TabBar` component signature:

```typescript
function TabBar({
  tabs,
  active,
  onPress,
  failed,
}: {
  tabs: string[];                  // CHANGED from WaterType[]
  active: string;                  // CHANGED from WaterType
  onPress: (t: string) => void;   // CHANGED from (t: WaterType) => void
  failed: string[];
}) {
```

### E. Update the active report access

Find where `activeReport` is retrieved (around line 547):

```typescript
// BEFORE:
const activeReport = bundle.reports[activeTab];

// AFTER:
const activeReport = (bundle.reports as Record<string, WaterTypeReport | undefined>)[activeTab];
```

### F. Show TabBar for inland_dual mode too

Find the conditional TabBar rendering (around line 577):

```typescript
// BEFORE:
{isCoastal && (
  <TabBar ... />
)}

// AFTER:
{(isCoastal || isInlandDual) && (
  <TabBar
    tabs={availableTabs}
    active={activeTab}
    onPress={setActiveTab}
    failed={bundle.failed_reports ?? []}
  />
)}
```

---

## Change 3.12: app/how-fishing-results.tsx — Severe Weather Alert Banner

**File:** `app/how-fishing-results.tsx`

### A. Add severe weather alert banner to ReportView

Find the alerts section in `ReportView` (after headline, before cold_stun_alert). Add severe weather as the FIRST alert:

```typescript
  return (
    <View>
      {/* Headline */}
      {summary ? (
        <View style={styles.headlineCard}>
          <Text style={styles.headlineText}>{summary}</Text>
        </View>
      ) : null}

      {/* SEVERE WEATHER ALERT — shown first, above all other alerts */}
      {alerts.severe_weather_alert && (
        <AlertBanner
          title="⚠️ Severe Weather Warning"
          body={
            (alerts.severe_weather_reasons ?? []).length > 0
              ? (alerts.severe_weather_reasons ?? []).join('. ') + '. Use caution before heading out.'
              : 'Severe weather conditions detected. Use caution before heading out.'
          }
          severity="critical"
        />
      )}

      {/* Existing alerts continue below */}
      {alerts.cold_stun_alert && (
```

**NOTE:** The severe weather alert should render even when `cold_stun_alert` or other alerts are also active. It sits at the top.

---

## Change 3.13: app/how-fishing-results.tsx — FAIR Times Section (Decent Times)

**File:** `app/how-fishing-results.tsx`

### A. Add DecentTimesSection component

Add this new component alongside BestTimesSection and WorstTimesSection:

```typescript
function DecentTimesSection({ windows }: { windows?: Array<{ time_range: string; reasoning: string }> }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Decent Times</Text>
      {windows.map((w, i) => (
        <View key={i} style={styles.timeCardDecent}>
          <View style={styles.timeCardHeader}>
            <Text style={styles.timeWindow}>{w.time_range}</Text>
            <View style={[styles.labelBadge, styles.badgeFair]}>
              <Text style={styles.labelBadgeText}>FAIR</Text>
            </View>
          </View>
          <Text style={styles.timeReasoningDecent}>{w.reasoning}</Text>
        </View>
      ))}
    </View>
  );
}
```

### B. Add FAIR badge style

Add to the StyleSheet:

```typescript
  badgeFair: { backgroundColor: '#B8860B' },  // dark goldenrod
  timeCardDecent: {
    backgroundColor: '#FFF8E6',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8A838' + '40',
  },
  timeReasoningDecent: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
```

### C. Render DecentTimesSection between Best and Worst times

In the `ReportView` component, find where `BestTimesSection` and `WorstTimesSection` are rendered:

```typescript
      {/* Best + Decent + Worst Times */}
      <BestTimesSection windows={llm.best_times_to_fish_today} />
      <DecentTimesSection windows={llm.decent_times_today} />
      <WorstTimesSection windows={llm.worst_times_to_fish_today} />
```

---

## Change 3.14: app/how-fishing-results.tsx — Engine Fair Windows Fallback

**File:** `app/how-fishing-results.tsx`

The `DecentTimesSection` gets its data from the LLM `decent_times_today` field. But if the LLM doesn't include it (or fallback is used), we should display the engine's `fair_windows` directly.

### A. Add engine-based fair windows display

In `ReportView`, after rendering LLM decent times, add a fallback from engine data:

```typescript
      {/* Decent times — prefer LLM, fall back to engine fair_windows */}
      {llm.decent_times_today && llm.decent_times_today.length > 0 ? (
        <DecentTimesSection windows={llm.decent_times_today} />
      ) : engine.fair_windows && engine.fair_windows.length > 0 ? (
        <DecentTimesSection
          windows={engine.fair_windows.slice(0, 2).map((w) => ({
            time_range: `${w.start_local} – ${w.end_local}`,
            reasoning: w.drivers.length > 0
              ? w.drivers.slice(0, 2).join(', ').replace(/_/g, ' ')
              : 'Fair conditions',
          }))}
        />
      ) : null}
```

Replace the simple `<DecentTimesSection windows={llm.decent_times_today} />` from Change 3.13C with this expanded version.

---

## Change 3.15: how-fishing/index.ts — Update Response Bundle for fair_windows

**File:** `supabase/functions/how-fishing/index.ts`

Ensure fair_windows is included in the response bundle's engine output. In the `responseBundle` construction, the engine section already should include fair_windows per Change 3.3E. Verify it is present:

```typescript
          engine: r.engine
            ? {
                environment: r.engine.environment,
                scoring: r.engine.scoring,
                behavior: r.engine.behavior,
                data_quality: r.engine.data_quality,
                alerts: r.engine.alerts,
                time_windows: r.engine.time_windows,
                fair_windows: r.engine.fair_windows ?? [],      // MUST BE PRESENT
                worst_windows: r.engine.worst_windows,
              }
            : null,
```

---

## Change 3.16: how-fishing/index.ts — Usage Estimation for Inland Dual

**File:** `supabase/functions/how-fishing/index.ts`

The inland path now makes 2 Claude calls instead of 1. Update the pre-check estimation:

```typescript
// BEFORE:
const estimatedCost = ESTIMATED_COST_COASTAL_USD; // use worst case for pre-check

// AFTER:
const estimatedCost = isLikelyCoastal(lat, lon) || (typeof engineSnapshot !== 'undefined' && engineSnapshot?.coastal)
  ? ESTIMATED_COST_COASTAL_USD
  : ESTIMATED_COST_INLAND_USD * 2; // inland dual now uses 2 calls

// NOTE: At the pre-check stage, engineSnapshot doesn't exist yet.
// Use the coastal heuristic as a rough estimator.
// Simplest: just keep using ESTIMATED_COST_COASTAL_USD as worst case.
```

**Actually**, the simplest and safest approach is to keep the existing worst-case estimation as-is since it's already using the coastal max. No code change needed here — the existing `ESTIMATED_COST_COASTAL_USD` already covers the 2-call inland case (3 calls × $0.006 = $0.018 ≥ 2 × $0.006 = $0.012).

---

## Sweep 3 Verification Checkpoint

After completing all changes in this sweep, verify:

1. **TypeScript compiles**: Run `deno check` on all modified Edge Function files. Run `npx tsc --noEmit` on the client-side files.

2. **Altitude flows through**: `get-environment` returns `altitude_ft`. `envAdapter` maps it to `EnvironmentSnapshot.altitude_ft`. Engine uses it for effective latitude.

3. **Wind gusts flow through**: `get-environment` returns `gust_speed` in weather. `envAdapter` maps it to `gust_speed_mph`. Severe weather detection can use it.

4. **Inland dual mode**:
   - Request to inland location returns `mode: "inland_dual"` with two reports: `freshwater_lake` and `freshwater_river`
   - Each report has independent engine scores (river model produces different water temp than lake model)
   - `default_tab` is `"freshwater_lake"`

5. **Coastal mode unchanged**: Request to coastal location still returns 3 reports (freshwater, saltwater, brackish)

6. **LLM fallback works**: When Claude API is unavailable, each report still returns `status: "ok"` with a deterministic fallback LLM output (not `status: "error"`). The fallback includes headline, rating, times, factors, and tips derived from engine data.

7. **Tip word limit**: Tips should be truncated to max 12 words (not 14).

8. **Severe weather**: If wind >30 mph or temp <0°F, the response includes `severe_weather_alert: true` with reasons. The UI shows a critical red banner at the top.

9. **4-tier time windows display**: UI shows Best Times (PRIME/GOOD), Decent Times (FAIR), and Worst Times (SLOW).

10. **Lake/River tabs**: Inland locations show a tab bar with "Lake" and "River" tabs. Each tab shows its own score, breakdown, and narrative.

11. **System prompt**: LLM prompt includes guidance for `mild_winter_active`, `saltwater_seasonal_state`, `severe_weather_alert`, and `decent_times_today`.

12. **Coastal detection hardened**: A coastal location where NOAA is down still gets identified as coastal via the `isLikelyCoastal()` backup.

13. **fair_windows in response**: The response bundle includes `fair_windows` array in each report's engine output.

**Test case — Prudenville MI (inland):**
- Mode should be `inland_dual`
- Two tabs: Lake and River
- Lake water temp: 32-35°F (winter)
- River water temp: 33-38°F (higher due to groundwater blending)
- Both should show deep_winter_survival seasonal state
- LLM (or fallback) should reference winter behavior

**Test case — Tampa FL (coastal):**
- Mode should be `coastal_multi`
- Three tabs: Freshwater, Saltwater, Brackish
- Severe weather alert should NOT fire (normal conditions)
- Saltwater seasonal state should be present in LLM payload

**Test case — LLM failure simulation:**
- Set ANTHROPIC_API_KEY to invalid value
- All reports should still return status: "ok" with deterministic fallback
- Headline, rating, times, factors, and tips should all be populated

---

**ALL THREE SWEEPS ARE NOW COMPLETE.**

## Implementation Order Summary

### Sweep 1 (Foundation): 14 changes
Files: types.ts, derivedVariables.ts, get-environment/index.ts

### Sweep 2 (Scoring + Windows + Recovery + Behavior): 16 changes
Files: scoreEngine.ts, timeWindowEngine.ts, recoveryModifier.ts, behaviorInference.ts, index.ts

### Sweep 3 (Integration + LLM + UI): 16 changes
Files: envAdapter.ts, get-environment/index.ts, how-fishing/index.ts, howFishing.ts, how-fishing-results.tsx

### Total: 46 changes across 10 files
