# TightLines AI V1 Engine API / Input Contract Sheet — Codebase-Aligned

This contract sheet is now aligned to the uploaded codebase and clarifies how the new engine should receive data from your existing API stack.

## Current reality from the codebase

You already have a strong environment payload shape flowing through:
- `get-environment`
- `lib/env/*`
- `store/envStore.ts`
- `supabase/functions/_shared/envAdapter.ts`
- `supabase/functions/how-fishing/index.ts`

That foundation should stay.

The major contract change is **not** the raw weather/tide/moon inputs.
The major contract change is the **engine request and response shape** around confirmed user context.

---

## 1. New report request contract

## Required request fields

```ts
interface HowFishingRequestV2 {
  latitude: number;
  longitude: number;
  units: 'imperial' | 'metric';

  water_type: 'freshwater' | 'brackish' | 'saltwater';
  freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir' | null;
  environment_mode: 'freshwater_lake' | 'freshwater_river' | 'brackish' | 'saltwater';

  manual_freshwater_water_temp_f?: number | null;

  target_date?: string | null;
  mode?: 'daily_detail' | 'weekly_overview';

  env_data?: EnvironmentData | null;
}
```

### Key rule
`environment_mode` must be a confirmed context, not inferred on the backend from coastal status alone.

---

## 2. Context validation rules

### Freshwater request validity
If `water_type = freshwater`, then:
- `freshwater_subtype` is required
- `environment_mode` must be either `freshwater_lake` or `freshwater_river`

### Saltwater request validity
If `water_type = saltwater`, then:
- `freshwater_subtype` must be null or omitted
- `environment_mode` must be `saltwater`

### Brackish request validity
If `water_type = brackish`, then:
- `freshwater_subtype` must be null or omitted
- `environment_mode` must be `brackish`

### Manual temp validity
If `environment_mode` is not a freshwater mode:
- `manual_freshwater_water_temp_f` must be ignored or rejected

---

## 3. Existing raw environment payload that should stay

Your current `EnvironmentData` concept is good and should remain the primary transport object for raw environmental inputs.

### Existing useful categories already in code
- weather current conditions
- pressure and pressure history
- temperature history and forecast
- tide data
- moon data
- sun data
- solunar windows
- measured coastal water temperature
- optional manual freshwater temp
- coastal flag and nearest tide station metadata
- forecast_daily for weekly mode

### Recommendation
Do not redesign the raw environment payload unless necessary.
The redesign should happen **after** environment fetch, in normalization and engine contracts.

---

## 4. Source priority rules

## Water temperature
### Freshwater modes
Priority:
1. `manual_freshwater_water_temp_f`
2. inferred freshwater temp model
3. degraded state

### Saltwater / brackish modes
Priority:
1. `measured_water_temp_f`
2. approved fallback measured source if available
3. degraded state

### Rule
Salt/brackish should not accept manual user-entered water temp in V1.

## Tide/current
- only applicable to `saltwater` and `brackish`
- must be treated as not applicable for freshwater modes

## Solunar/moon
- always optional support variables
- should not break report generation if partially unavailable

---

## 5. Existing frontend setup contract changes

### Current problem in codebase
The frontend currently leans too much on coastal/inland detection and old bundle modes.

### New required frontend setup object
Before calling report generation, frontend should resolve something like:

```ts
interface ConfirmedFishingContext {
  waterType: 'freshwater' | 'brackish' | 'saltwater';
  freshwaterSubtype?: 'lake' | 'river_stream' | 'reservoir' | null;
  environmentMode: 'freshwater_lake' | 'freshwater_river' | 'brackish' | 'saltwater';
  manualFreshwaterWaterTempF?: number | null;
}
```

This object should be built in `app/how-fishing.tsx` before invoking the edge function.

---

## 6. Normalized environment contract

The V2 engine should not consume raw `EnvironmentData` directly.
It should consume a normalized environment object.

### Recommended normalized contract
```ts
interface NormalizedEnvironmentV2 {
  location: {
    lat: number;
    lon: number;
    timezone: string;
    coastalHint: boolean;
    nearestTideStationId?: string | null;
  };

  current: {
    airTempF?: number | null;
    pressureMb?: number | null;
    windSpeedMph?: number | null;
    windDirectionDeg?: number | null;
    cloudCoverPct?: number | null;
    precipInHr?: number | null;
  };

  histories: {
    hourlyPressureMb?: Array<{ timeUtc: string; value: number }>;
    hourlyAirTempF?: Array<{ timeUtc: string; value: number }>;
    dailyAirTempHighF?: Array<number | null>;
    dailyAirTempLowF?: Array<number | null>;
    precip48hrInches?: number | null;
    precip7dayInches?: number | null;
  };

  solarLunar: {
    sunriseLocal?: string | null;
    sunsetLocal?: string | null;
    moonPhase?: string | null;
    moonIlluminationPct?: number | null;
    solunarMajorPeriods?: Array<{ startLocal: string; endLocal: string }>;
    solunarMinorPeriods?: Array<{ startLocal: string; endLocal: string }>;
  };

  marine: {
    tidePredictionsToday?: Array<{ timeLocal: string; type: 'H' | 'L'; heightFt: number }>;
    tidePredictions30day?: Array<{ date: string; high_ft: number; low_ft: number }>;
    measuredWaterTempF?: number | null;
    measuredWaterTempSource?: string | null;
  };

  userOverrides: {
    manualFreshwaterWaterTempF?: number | null;
  };
}
```

---

## 7. Reliability input ingredients

The reliability layer should receive at least:
- whether water temp is manual, measured, inferred, or missing
- volatility of recent air temperatures
- whether tide data is available when required
- whether pressure history is available
- whether solunar data is available
- whether precipitation/runoff data is available
- whether the selected context conflicts with available environmental clues

---

## 8. Daily-detail response contract

### Replace old multi-report bundle shape
The daily-detail response should become a single-report object.

```ts
interface HowFishingResponseV2 {
  feature: 'hows_fishing_feature_v2';
  generated_at: string;
  cache_expires_at: string;

  context: {
    water_type: 'freshwater' | 'brackish' | 'saltwater';
    freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir' | null;
    environment_mode: 'freshwater_lake' | 'freshwater_river' | 'brackish' | 'saltwater';
    region: string;
    seasonal_state: string;
  };

  engine: HowFishingEngineOutput;
  llm: HowFishingNarrationOutput;
}
```

### Important change
Remove these old response concepts from active production use:
- `mode: single | coastal_multi | inland_dual`
- `default_tab`
- `reports: { ...multiple contexts... }`

---

## 9. Weekly overview response contract

Weekly overview should also run for one confirmed environment mode only.

```ts
interface WeeklyOverviewResponseV2 {
  feature: 'hows_fishing_weekly_overview_v2';
  generated_at: string;
  cache_expires_at: string;
  context: {
    environment_mode: 'freshwater_lake' | 'freshwater_river' | 'brackish' | 'saltwater';
    region: string;
  };
  days: ForecastDayV2[];
}
```

Do not auto-generate weekly outputs for multiple water types.

---

## 10. LLM payload contract

The LLM payload should be built from deterministic engine output only.
It should include:
- confirmed environment mode
- score and score band
- confidence
- best/fair/poor windows
- key drivers
- suppressors
- presentation speed bias
- broad positioning tendency
- approved caution notes

It should **not** receive:
- raw weather blob as narration truth
- unguarded low-confidence biological claims
- multiple competing context reports

---

## 11. UI/UX alignment contract

The frontend must satisfy these contract rules before calling the engine:
- water type selected first
- invalid body types hidden after selection
- optional freshwater temp only for freshwater modes
- location-based coastal detection is suggestion only
- one confirmed context per generation

This should be treated as a hard product contract, not a soft UI preference.

---

## 12. Codebase files most directly affected by this contract change

### Frontend
- `app/how-fishing.tsx`
- `lib/howFishing.ts`
- `store/forecastStore.ts`

### Backend
- `supabase/functions/how-fishing/index.ts`
- `supabase/functions/_shared/envAdapter.ts`
- new `supabase/functions/_shared/engineV2/*`

### Mostly reusable with light changes
- `lib/env/types.ts`
- `store/envStore.ts`
- `components/LiveConditionsWidget.tsx`

---

## Final implementation note

The raw API wiring is already in good shape.
The main thing to lock now is this:

**APIs provide environmental truth; the UI provides confirmed fishing context; the engine interprets both together.**
