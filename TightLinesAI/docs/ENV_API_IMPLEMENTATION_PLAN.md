# Environmental API Integration — Implementation Plan

**Spec reference:** `TightLines_AI_V1_Spec.md` lines 59–78  
**Status:** Implemented

---

## 1. Overview

Implement the full Environmental API Integration layer: a Supabase Edge Function that fetches weather, tides, moon/solunar, and sunrise/sunset in parallel, plus client-side caching and a clean service interface for the dashboard, Recommender, Water Reader, and How's Fishing features.

**APIs used (all free, no keys required for primary stack):**
- **Open-Meteo** — weather + sunrise/sunset
- **NOAA CO-OPS** — tides (coastal US only)
- **US Naval Observatory (USNO)** — moon phase, rise/set, transit (for solunar)

---

## 2. File & Folder Structure

```
TightLinesAI/
├── lib/
│   ├── env/
│   │   ├── index.ts           # Public API: getEnvironment, fetchFreshEnvironment
│   │   ├── types.ts           # EnvironmentData, WeatherData, TideData, etc.
│   │   ├── cache.ts           # 15-min cache, AsyncStorage keys, TTL logic
│   │   └── constants.ts       # CACHE_TTL_MS, etc.
│   └── supabase.ts            # (existing)
├── store/
│   └── envStore.ts            # Zustand store for env state (optional; can use lib/env)
├── supabase/
│   └── functions/
│       └── get-environment/
│           ├── index.ts       # Main handler
│           └── _shared/       # (or inline) fetchOpenMeteo, fetchNOAA, fetchUSNO, solunar
```

**Design principle:** `lib/env/` is the single source of truth for environmental data. The store (if used) is a thin wrapper for React components. Future developers should only need to understand `lib/env/index.ts` and the Edge Function.

---

## 3. Data Types (`lib/env/types.ts`)

Define shared TypeScript interfaces used by both client and Edge Function (or document the contract):

```ts
// Request
interface GetEnvironmentRequest {
  latitude: number;
  longitude: number;
  units?: 'imperial' | 'metric';
}

// Response
interface EnvironmentData {
  weather_available: boolean;
  tides_available: boolean;
  tides_coming_soon?: boolean;   // true when Great Lakes
  moon_available: boolean;
  sun_available: boolean;
  
  weather?: WeatherData;
  tides?: TideData | null;
  moon?: MoonData;
  sun?: SunData;
  solunar?: SolunarData;
  
  fetched_at: string;            // ISO timestamp
}

interface WeatherData { ... }    // temp, wind, pressure, cloud, precip
interface TideData { ... }       // high_low_times, phase, station_name
interface MoonData { ... }       // phase, illumination, rise, set
interface SunData { ... }        // sunrise, sunset, twilight
interface SolunarData { ... }    // major_periods[], minor_periods[]
```

---

## 4. Edge Function: `get-environment`

**Path:** `supabase/functions/get-environment/index.ts`  
**Deploy:** Via Supabase MCP or `supabase functions deploy get-environment`  
**Verify JWT:** Yes (recommended) — env data is per-request, not public cache.

### 4.1 Request

- **Method:** POST  
- **Body:** `{ latitude, longitude, units?: "imperial" | "metric" }`  
- **Headers:** `Authorization: Bearer <supabase anon/user JWT>` (if verify_jwt)

### 4.2 Logic Flow

1. Parse and validate `latitude`, `longitude`, `units`.
2. **Parallel fetch** (Promise.allSettled so partial failure is OK):
   - `fetchOpenMeteo(lat, lon, units)` → weather + sunrise/sunset
   - `fetchNOAA(lat, lon, units)` → tides (or null if inland/Great Lakes)
   - `fetchUSNO(lat, lon)` → moon rise/set/transit, phase
3. **Post-process:**
   - Compute solunar periods from USNO moon transit data.
   - Detect Great Lakes region → set `tides_coming_soon: true`, `tides_available: false`.
   - Convert units per `units` param.
4. **Assemble response** with flags (`weather_available`, `tides_available`, etc.).
5. Return JSON.

### 4.3 NOAA Tide Station Resolution

- **Option A:** Fetch NOAA station list once at cold start, cache in memory. Filter by `type` (waterlevels) and find nearest by haversine distance. Station list: `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels`
- **Option B:** Use a pre-bundled JSON file of US tide stations (lat, lon, id) checked into the Edge Function and find nearest. Reduces runtime dependency on NOAA metadata API.
- **Coastal vs inland:** If nearest station is > ~50 miles away, treat as inland → `tides_available: false`.
- **Great Lakes:** Define bounding box or state check for Great Lakes (MI, WI, IL, IN, OH, NY, PA, MN near lakes). If in region, `tides_available: false`, `tides_coming_soon: true`.

### 4.4 Solunar Computation

From USNO `moondata`:
- `U` = upper transit (moon overhead)
- `R` = moonrise, `S` = moonset  
- Lower transit (underfoot) ≈ upper transit + 12 hours.

**Major periods:** 2-hour windows centered on moon overhead and moon underfoot.  
**Minor periods:** 1-hour windows centered on moonrise and moonset.

Output structure: `{ major_periods: [{ start, end, type: "overhead"|"underfoot" }], minor_periods: [{ start, end }] }`.

### 4.5 Partial Failure & Fallbacks

- Use `Promise.allSettled` — one API failure does not block others.
- Set `weather_available: false` if Open-Meteo fails. (Optional: try OpenWeatherMap if `OPENWEATHERMAP_API_KEY` secret exists.)
- Set `tides_available: false` if NOAA fails or no station found.
- Set `moon_available: false` if USNO fails.
- Always return a valid JSON response with whatever succeeded.

### 4.6 Units Conversion

- Request includes `units: "imperial" | "metric"`.
- Open-Meteo: use `temperature_unit=fahrenheit` and `wind_speed_unit=mph` when imperial.
- NOAA: use `units=english` for feet.
- USNO: return times; no unit conversion needed for sun/moon.

---

## 5. Client-Side Service (`lib/env/`)

### 5.1 `lib/env/index.ts`

**Exports:**
- `getEnvironment(params: { latitude, longitude, units?, forceRefresh? }): Promise<EnvironmentData>`
  - If `forceRefresh: true` → always call Edge Function (use for "on AI confirm").
  - Else → check cache; if fresh (< 15 min), return cached. Otherwise fetch and cache.

- `fetchFreshEnvironment(params): Promise<EnvironmentData>`
  - Alias for `getEnvironment(..., forceRefresh: true)`.
  - Used when user taps "Recommend", "How's Fishing", or submits Water Reader.

### 5.2 `lib/env/cache.ts`

- **Storage:** `AsyncStorage` (or existing storage from `lib/supabase.ts`).
- **Key:** e.g. `env_cache_${lat}_${lon}` or `env_cache` with lat/lon in value.
- **TTL:** 15 minutes for dashboard use.
- **Structure:** `{ data: EnvironmentData, fetched_at: string }`.

### 5.3 Invoking the Edge Function

```ts
const { data, error } = await supabase.functions.invoke('get-environment', {
  body: { latitude, longitude, units: profile?.preferred_units ?? 'imperial' },
});
```

---

## 6. Integration Points

### 6.1 Dashboard / Live Conditions Widget

- Call `getEnvironment({ latitude, longitude, units })` (no `forceRefresh`).
- Cache ensures at most one fetch every 15 minutes per location.
- Display: weather summary, tides (if available or "Coming soon"), moon phase, sunrise/sunset.

### 6.2 Recommender, How's Fishing, Water Reader

- On user confirm (e.g. tap "Recommend"), call `fetchFreshEnvironment(...)`.
- Pass resulting `EnvironmentData` in the request body to the respective Edge Function (recommender, hows-fishing, water-reader), OR have those Edge Functions call `get-environment` internally when env is not supplied.
- Spec preference: client can send env when recently fetched; else Edge Function fetches. Implementation: client always fetches fresh on confirm and sends it — simplest and ensures "fresh at confirm time."

### 6.3 Water Reader Without Location

- If user has not synced location and has not manually entered it, do not call `getEnvironment`.
- Water Reader Edge Function receives no env payload and runs with image + other inputs only. Prompt should handle `env: null` gracefully.

---

## 7. Great Lakes "Coming Soon"

- Edge Function sets `tides_coming_soon: true` when coordinates are in the Great Lakes region.
- Client UI: when `tides_coming_soon`, show "Tide / water level — Coming soon" instead of hiding the section entirely.

**Great Lakes detection:** Simple bounding box or state-based check (e.g. within X km of lake centroids, or states: MI, parts of WI, IL, IN, OH, NY, PA, MN).

---

## 8. Future Considerations (Not in V1)

- **Edge Function–level caching:** At 3–5K users, add a short TTL cache (e.g. Redis or in-memory) keyed by `lat_lon` bucket to reduce duplicate fetches.
- **OpenWeatherMap fallback:** Add optional `OPENWEATHERMAP_API_KEY`; on Open-Meteo failure, retry with OpenWeatherMap.
- **StormGlass:** If global tides are needed later, add as optional provider.

---

## 9. Implementation Order

| Step | Task | Est. |
|------|------|------|
| 1 | Create `lib/env/types.ts` with all interfaces | 30 min |
| 2 | Create `lib/env/constants.ts` (CACHE_TTL_MS, etc.) | 15 min |
| 3 | Create `lib/env/cache.ts` (AsyncStorage, get/set, TTL) | 30 min |
| 4 | Implement Edge Function: Open-Meteo fetch + unit handling | 45 min |
| 5 | Implement Edge Function: NOAA station resolution + tide fetch | 1 hr |
| 6 | Implement Edge Function: USNO fetch + solunar computation | 45 min |
| 7 | Implement Edge Function: Great Lakes detection, parallel fetch, partial failure | 30 min |
| 8 | Deploy `get-environment` Edge Function | 15 min |
| 9 | Create `lib/env/index.ts` (getEnvironment, fetchFreshEnvironment) | 45 min |
| 10 | Optional: `store/envStore.ts` for React integration | 30 min |
| 11 | Integrate into Dashboard (Live Conditions widget) — placeholder UI | 30 min |
| 12 | Add unit tests or manual QA checklist | 30 min |

**Total estimate:** ~6–7 hours.

---

## 10. QA Checklist

- [ ] Coastal location (e.g. Tampa, FL): weather, tides, moon, sun all populated.
- [ ] Inland location (e.g. Kansas City): tides_available false, no tides.
- [ ] Great Lakes (e.g. Detroit): tides_coming_soon true, "Coming soon" in UI.
- [ ] Dashboard: second load within 15 min uses cache (no new network call).
- [ ] Recommender flow: fresh fetch on "Recommend" tap.
- [ ] Units: imperial vs metric reflected in all numeric values.
- [ ] Offline: cached data returned when available; clear message when not.
- [ ] Partial failure: one API down still returns other data with correct flags.

---

## 11. API Reference Summary

| API | URL | Params | Notes |
|-----|-----|--------|-------|
| Open-Meteo | `https://api.open-meteo.com/v1/forecast` | lat, lon, current, daily=sunrise,sunset, temperature_unit, wind_speed_unit | No key |
| NOAA Stations | `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels` | — | Filter, find nearest |
| NOAA Predictions | `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=...` | station, begin_date, end_date, units, datum | Need station ID |
| USNO RSTT | `https://aa.usno.navy.mil/api/rstt/oneday` | date=today, coords=lat,lon, tz | No key |

---

## 12. Post-Implementation Audit — Bugs to Correct

After implementation, verify and fix the following:

### Edge Function

| # | Bug / Risk | How to catch | Fix |
|---|------------|--------------|-----|
| 1 | **USNO coord format** — API expects `lat,lon` (N/E positive); negative longitude for US must be correct (e.g. `38.9,-77.0` not `38.9,77.0`). | Test with US coordinates; bad format returns 400 or empty. | Ensure longitude west of Greenwich is negative; validate before calling. |
| 2 | **USNO timezone** — `tz` is hours offset from UTC. iOS/JS timezone may be minutes (e.g. -5.5). USNO expects integer hours. | Odd offsets (e.g. India) may produce wrong times. | Round or truncate to integer hours; use `Math.round(offsetMinutes / 60)` or derive from lat/lon. |
| 3 | **NOAA station list size** — Full list can be large; cold-start fetch may timeout or exceed Edge Function memory. | Cold start slow or OOM. | Use filtered `type=waterlevels`; consider a trimmed static JSON of coastal stations if needed. |
| 4 | **Nearest station too far** — Inland user gets tide data from a distant coastal station. | User in Kansas sees tide times. | Enforce max distance (~50 mi); if nearest > threshold, set `tides_available: false`. |
| 5 | **Solunar date/time mismatch** — USNO returns local times; mixing with UTC or wrong date can shift periods. | Solunar periods don't align with moon. | Use same date and timezone for USNO and for display; keep timezone consistent. |
| 6 | **Empty/malformed API responses** — One API returns `{}` or HTML error page. | `weather_available: true` but `weather` is undefined; UI crashes. | Null-check each API response; only set flag true when data is parseable and complete. |
| 7 | **CORS or fetch failure** — Edge Function calls external APIs; some may block server-side or rate-limit. | Intermittent 403/429. | Use `User-Agent` header if required; implement retry with backoff for 5xx/429. |

### Client / Cache

| # | Bug / Risk | How to catch | Fix |
|---|------------|--------------|-----|
| 8 | **Cache key collision** — Using rounded lat/lon; two nearby locations share cache incorrectly. | User moves 20 mi; still sees old data. | Use a coarse bucket (e.g. 0.1° ≈ 7 mi) or separate keys per location; document behavior. |
| 9 | **Stale cache after 15 min** — Cache expired but `getEnvironment` returns stale data. | Dashboard shows old weather after 16 min. | Compare `fetched_at` to `Date.now()`; if beyond TTL, fetch and update cache. |
| 10 | **AsyncStorage key length** — Keys like `env_cache_${lat}_${lon}` can be long; some impls limit key size. | Write fails silently on long key. | Use fixed key + hash of coords, or single `env_cache` key with coords in value. |
| 11 | **Profile not loaded** — `getEnvironment` uses `profile?.preferred_units` before profile is fetched. | Units default incorrectly. | Fallback to `'imperial'` when profile is null; or await profile in components that need env. |
| 12 | **Double fetch on mount** — Dashboard and Recommender both call `getEnvironment` on init. | Redundant network calls. | Rely on cache; or use a single source (store/hook) that deduplicates in-flight requests. |

### Integration

| # | Bug / Risk | How to catch | Fix |
|---|------------|--------------|-----|
| 13 | **No location** — User hasn't granted GPS or entered location; `getEnvironment` called with null/undefined. | Crash or bad request. | Guard: only call when `latitude` and `longitude` are valid numbers. |
| 14 | **Great Lakes false positive** — Bounding box too large; coastal NJ gets `tides_coming_soon`. | East coast user sees "Coming soon" instead of real tides. | Tighten Great Lakes region (e.g. state + proximity to lake); test with Detroit, Chicago, Cleveland, Buffalo. |
| 15 | **Edge Function error shape** — Supabase returns `{ error: { message: "..." } }`; client assumes `{ data }`. | Error not surfaced to user. | Check `error` from `supabase.functions.invoke`; show fallback UI or "Unable to load conditions" message. |
| 16 | **Timezone for display** — Env data has UTC or mixed zones; UI shows wrong local times. | Sunrise shows 3 AM instead of 7 AM. | Store timezone with env data (from request or device); format all times in user's local zone for display. |

### General

| # | Bug / Risk | How to catch | Fix |
|---|------------|--------------|-----|
| 17 | **Type mismatches** — Edge Function returns camelCase; client expects snake_case (or vice versa). | Undefined fields in UI. | Align contract in `lib/env/types.ts`; validate response shape before use. |
| 18 | **Floating-point coords** — `lat: 28.538336` stored/compared; precision issues in cache key. | Cache miss for "same" location. | Round coords for cache key (e.g. 4 decimal places ≈ 10 m). |
| 19 | **Memory leak** — Store or hook subscribes to env, never unsubscribes. | Growing memory over long sessions. | Use Zustand selectors or React hooks that clean up; avoid global mutable state. |
