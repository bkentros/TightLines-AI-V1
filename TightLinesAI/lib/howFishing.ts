/**
 * How's Fishing Right Now? — types and cache
 * Spec reference: hows_fishing_feature_spec.md Section 8
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EngineContextKey, HowFishingRebuildBundle } from './howFishingRebuildContracts';

// ---------------------------------------------------------------------------
// Cache config
// ---------------------------------------------------------------------------

// Stable until the synced location's local midnight via bundle.cache_expires_at
// ~1km match threshold — realistic for GPS drift on a phone
const COORD_MATCH_THRESHOLD = 0.01;

// ---------------------------------------------------------------------------
// Legacy client types retained for older app surfaces; active rebuild report types live in lib/howFishingRebuildContracts.ts
// Client-side types only — no Deno imports.
// ---------------------------------------------------------------------------

export type WaterType = 'freshwater' | 'saltwater' | 'brackish';

export type OverallRating = 'Exceptional' | 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Tough';
export type ReliabilityTier = 'high' | 'degraded' | 'low_confidence' | 'very_low_confidence';
export type ComponentStatus = 'available' | 'fallback_used' | 'unavailable' | 'not_applicable';
export type AlertStatus = 'evaluated' | 'not_evaluable_missing_inputs';

export interface EngineScoring {
  weights: Record<string, number>;
  component_status: Record<string, ComponentStatus>;
  components: Record<string, number>;
  coverage_pct: number;
  reliability_tier: ReliabilityTier;
  raw_score: number;
  recovery_multiplier: number;
  adjusted_score: number;
  overall_rating: OverallRating;
  seasonal_baseline_score?: number;
  daily_opportunity_score?: number;
  water_temp_confidence?: number | null;
}

export interface EngineEnvironment {
  air_temp_f: number | null;
  water_temp_f: number | null;
  water_temp_source: string;
  water_temp_zone: string | null;
  wind_speed_mph: number | null;
  wind_direction: string | null;
  wind_direction_deg?: number | null;          // NEW
  cloud_cover_pct: number | null;
  pressure_mb: number | null;
  pressure_change_rate_mb_hr: number | null;
  pressure_state: string | null;
  precip_48hr_inches: number | null;
  precip_7day_inches: number | null;
  precip_condition: string | null;
  moon_phase: string | null;
  moon_illumination_pct: number | null;
  solunar_state: string | null;
  tide_phase_state: string | null;
  tide_strength_state: string | null;
  range_strength_pct: number | null;
  light_condition: string | null;
  temp_trend_state: string | null;
  temp_trend_direction_f: number | null;
  days_since_front: number;
  freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir' | null;
  seasonal_fish_behavior?: string | null;
  effective_latitude?: number | null;          // NEW
  latitude_band?: string | null;               // NEW
  saltwater_seasonal_state?: string | null;    // NEW
  altitude_ft?: number | null;                 // NEW
  severe_weather_alert?: boolean;              // NEW
  severe_weather_reasons?: string[];           // NEW
}

export interface EngineBehavior {
  metabolic_state: string;
  aggression_state: string;
  feeding_timer: string;
  presentation_difficulty: string;
  positioning_bias: string;
  secondary_positioning_tags: string[];
  dominant_positive_drivers: string[];
  dominant_negative_drivers: string[];
}

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

export interface DataQuality {
  missing_variables: string[];
  fallback_variables: string[];
  notes: string[];
}

export interface TimeWindow {
  label: 'PRIME' | 'GOOD' | 'FAIR' | 'SLOW';
  start_local: string;
  end_local: string;
  window_score: number;
  drivers: string[];
}

export interface WorstWindow {
  label?: 'SLOW';
  start_local: string;
  end_local: string;
  window_score: number;
}

export interface EngineLocation {
  lat: number;
  lon: number;
  timezone: string;
  coastal: boolean;
  nearest_tide_station_id: string | null;
}

export interface EngineOutput {
  location?: EngineLocation;
  environment: EngineEnvironment;
  scoring: EngineScoring;
  behavior: EngineBehavior;
  data_quality: DataQuality;
  alerts: EngineAlerts;
  time_windows: TimeWindow[];
  fair_windows: TimeWindow[];      // NEW
  worst_windows: WorstWindow[];
  // V2 engine-level driver/suppressor lists (from assessments layer)
  v2_drivers?: string[];
  v2_suppressors?: string[];
  v2_score?: number;
  v2_score_band?: string;
  v2_confidence?: string;
  v2_environment_mode?: string;
  v2_timing_hint?: string | null;
}

// ---------------------------------------------------------------------------
// LLM output types (Section 7A output contract)
// ---------------------------------------------------------------------------

export interface LLMRating {
  label: OverallRating;
  summary: string;
}

export interface LLMBestTime {
  time_range: string;
  label: 'PRIME' | 'GOOD' | 'FAIR';    // UPDATED — added FAIR
  reasoning: string;
}

export interface LLMDecentTime {
  time_range: string;
  reasoning: string;
}

export interface LLMWorstTime {
  time_range: string;
  reasoning: string;
}

export interface LLMKeyFactors {
  barometric_pressure?: string;
  temperature_trend?: string;
  light_conditions?: string;
  tide_or_solunar?: string;
  moon_phase?: string;
  wind?: string;
  precipitation_recent_rain?: string;
  [key: string]: string | undefined;
}

export interface LLMStrategy {
  presentation_speed: string;
  depth_focus: string;
  approach_note: string;
}

export interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: LLMRating;
  best_times_to_fish_today: LLMBestTime[];
  decent_times_today?: LLMDecentTime[];
  worst_times_to_fish_today: LLMWorstTime[];
  key_factors: LLMKeyFactors;
  tips_for_today: string[];
  strategy?: LLMStrategy;
}

// ---------------------------------------------------------------------------
// Per-report structure (Section 8C)
// ---------------------------------------------------------------------------

/** Per-water-type token/cost (optional; present when backend includes it for observability). */
export interface WaterTypeUsage {
  input_tokens: number;
  output_tokens: number;
  token_cost_usd: number;
}

export interface WaterTypeReport {
  status: 'ok' | 'error';
  water_type: WaterType;
  engine: EngineOutput | null;
  llm: LLMOutput | null;
  error: string | null;
  usage?: WaterTypeUsage;
}

// ---------------------------------------------------------------------------
// Feature Bundle (Section 8A / 8B) — top-level response contract
// ---------------------------------------------------------------------------

export interface HowFishingBundle {
  // V2 backend returns 'hows_fishing_feature_v2'; V1 returns 'hows_fishing_feature_v1'.
  // Both are accepted by the frontend — the reports shape is compatible.
  feature: 'hows_fishing_feature_v1' | 'hows_fishing_feature_v2';
  mode: 'single' | 'coastal_multi' | 'inland_dual';
  default_tab: string;
  generated_at: string;
  cache_expires_at: string;
  freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir' | null;
  // V2 adds a context block — optional so V1 cached bundles still parse
  context?: {
    water_type: WaterType;
    freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir' | null;
    environment_mode: string;
    region?: string;
    seasonal_state?: string;
  };
  reports: {
    freshwater?: WaterTypeReport;
    saltwater?: WaterTypeReport;
    brackish?: WaterTypeReport;
    freshwater_lake?: WaterTypeReport;
    freshwater_river?: WaterTypeReport;
    // V2 dynamic key — environment_mode keyed entry
    [key: string]: WaterTypeReport | undefined;
  };
  failed_reports: string[];
}

// ---------------------------------------------------------------------------
// Cache — keyed per water-type (or full bundle) at location + date
// ---------------------------------------------------------------------------

interface BundleCacheEntry {
  lat: number;
  lon: number;
  date: string;       // retained for backwards compatibility
  fetched_at: string; // retained for backwards compatibility
  cache_expires_at?: string;
  timezone?: string | null;
  bundle: HowFishingBundle;
}

interface InMemoryBundleEntry {
  lat: number;
  lon: number;
  bundle: HowFishingBundle;
}

let currentBundleEntry: InMemoryBundleEntry | null = null;

function cacheKey(lat: number, lon: number, environmentMode?: string): string {
  // Each water type / environment mode gets its own cache entry.
  // Freshwater, saltwater, and brackish are completely separate reports
  // with different engine outputs, narration, and variables.
  const modeKey = environmentMode || 'default';
  return `how_fishing_bundle_${lat.toFixed(3)}_${lon.toFixed(3)}_${modeKey}`;
}

function localDateStringForTimezone(timezone?: string | null, fallbackDate = new Date()): string {
  try {
    if (timezone) {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(fallbackDate);
    }
  } catch {
    // fall through
  }
  const year = fallbackDate.getFullYear();
  const month = String(fallbackDate.getMonth() + 1).padStart(2, '0');
  const day = String(fallbackDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function bundleTimezone(bundle: HowFishingBundle): string | null {
  const candidate =
    bundle.reports.freshwater_lake?.engine?.location?.timezone ??
    bundle.reports.freshwater?.engine?.location?.timezone ??
    bundle.reports.saltwater?.engine?.location?.timezone ??
    bundle.reports.brackish?.engine?.location?.timezone ??
    bundle.reports.freshwater_river?.engine?.location?.timezone ??
    null;
  return candidate;
}

function currentDeviceLocalDateString(): string {
  return localDateStringForTimezone(null);
}

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_MATCH_THRESHOLD && Math.abs(b - d) < COORD_MATCH_THRESHOLD;
}

export async function getCachedHowFishingBundle(
  latitude: number,
  longitude: number,
  environmentMode?: string
): Promise<HowFishingBundle | null> {
  try {
    const key = cacheKey(latitude, longitude, environmentMode);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as BundleCacheEntry;

    // Coordinate match
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;

    const timezone = entry.timezone ?? bundleTimezone(entry.bundle);
    const cacheExpiresAt = entry.cache_expires_at ?? entry.bundle.cache_expires_at;

    if (cacheExpiresAt) {
      const expiresMillis = new Date(cacheExpiresAt).getTime();
      if (Number.isFinite(expiresMillis) && Date.now() >= expiresMillis) return null;
    } else {
      // Backwards-compatible fallback for older cached entries
      if (entry.date !== localDateStringForTimezone(timezone)) return null;
    }

    return entry.bundle;
  } catch {
    return null;
  }
}

export async function setCachedHowFishingBundle(
  latitude: number,
  longitude: number,
  bundle: HowFishingBundle,
  environmentMode?: string
): Promise<void> {
  try {
    const key = cacheKey(latitude, longitude, environmentMode);
    const timezone = bundleTimezone(bundle);
    const entry: BundleCacheEntry = {
      lat: latitude,
      lon: longitude,
      date: localDateStringForTimezone(timezone),
      fetched_at: new Date().toISOString(),
      cache_expires_at: bundle.cache_expires_at,
      timezone,
      bundle,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Non-fatal cache write failure — silently skip
  }
}

export function setCurrentHowFishingBundle(
  latitude: number,
  longitude: number,
  bundle: HowFishingBundle
): void {
  currentBundleEntry = {
    lat: latitude,
    lon: longitude,
    bundle,
  };
}

export function getCurrentHowFishingBundle(
  latitude?: number,
  longitude?: number
): HowFishingBundle | null {
  if (!currentBundleEntry) return null;
  if (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !coordsMatch(currentBundleEntry.lat, currentBundleEntry.lon, latitude, longitude)
  ) {
    return null;
  }
  return currentBundleEntry.bundle;
}

export function clearCurrentHowFishingBundle(): void {
  currentBundleEntry = null;
}

// ---------------------------------------------------------------------------
// Weekly Forecast types (mirrors backend ForecastDay + weekly_overview response)
// ---------------------------------------------------------------------------

export interface ForecastDay {
  date: string;                  // "YYYY-MM-DD"
  daily_score: number;
  overall_rating: OverallRating;
  summary_line: string;
  high_temp_f: number;
  low_temp_f: number;
  wind_mph_avg: number;
  precip_chance_pct: number;
  front_label: string | null;
}

export interface WeeklyForecastTodaySummary {
  daily_score: number;
  overall_rating: OverallRating;
  summary_line: string;
  environment: EngineEnvironment;
  alerts: EngineAlerts;
  fishable_hours: Array<{ start: string; end: string }>;
}

export interface WeeklyOverviewBundle {
  feature: 'hows_fishing_feature_v1';
  mode: 'weekly_overview';
  water_type: WaterType;
  generated_at: string;
  is_coastal: boolean;
  forecast_days: ForecastDay[];
  today: WeeklyForecastTodaySummary;
}

// ---------------------------------------------------------------------------
// Weekly Forecast Cache — 2-hour TTL, keyed by location + date
// ---------------------------------------------------------------------------

const FORECAST_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface ForecastCacheEntry {
  lat: number;
  lon: number;
  date: string;
  fetched_at: string;
  water_type?: WaterType | 'auto';
  freshwater_subtype?: 'lake' | 'river_stream' | 'reservoir';
  bundle: WeeklyOverviewBundle;
}

function forecastCacheKey(lat: number, lon: number, waterType: WaterType | 'auto' = 'auto', freshwaterSubtype: 'lake' | 'river_stream' | 'reservoir' = 'lake'): string {
  return `forecast_weekly_${lat.toFixed(3)}_${lon.toFixed(3)}_${waterType}_${freshwaterSubtype}`;
}

export async function getCachedWeeklyForecast(
  latitude: number,
  longitude: number,
  waterType: WaterType | 'auto' = 'auto',
  freshwaterSubtype: 'lake' | 'river_stream' | 'reservoir' = 'lake'
): Promise<WeeklyOverviewBundle | null> {
  try {
    const key = forecastCacheKey(latitude, longitude, waterType, freshwaterSubtype);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as ForecastCacheEntry;
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;
    if (entry.date !== currentDeviceLocalDateString()) return null;
    const age = Date.now() - new Date(entry.fetched_at).getTime();
    if (age > FORECAST_CACHE_TTL_MS) return null;
    return entry.bundle;
  } catch {
    return null;
  }
}

export async function setCachedWeeklyForecast(
  latitude: number,
  longitude: number,
  bundle: WeeklyOverviewBundle,
  waterType: WaterType | 'auto' = 'auto',
  freshwaterSubtype: 'lake' | 'river_stream' | 'reservoir' = 'lake'
): Promise<void> {
  try {
    const key = forecastCacheKey(latitude, longitude, waterType, freshwaterSubtype);
    const entry: ForecastCacheEntry = {
      lat: latitude,
      lon: longitude,
      date: currentDeviceLocalDateString(),
      fetched_at: new Date().toISOString(),
      water_type: waterType,
      freshwater_subtype: freshwaterSubtype,
      bundle,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Non-fatal
  }
}

// ---------------------------------------------------------------------------
// Legacy compat shim — deprecated; use HowFishingBundle instead
// ---------------------------------------------------------------------------

/** @deprecated Use HowFishingBundle */
export interface HowFishingResponse {
  rating: string;
  summary: string;
  best_times: Array<{ window: string; label?: string; reasoning: string }>;
  worst_times: Array<{ window: string; reasoning: string }>;
  key_factors: Record<string, string>;
  tips: string[];
}

/** @deprecated Use getCachedHowFishingBundle */
export async function getCachedHowFishing(
  latitude: number,
  longitude: number
): Promise<HowFishingResponse | null> {
  return null; // removed — use bundle cache
}

/** @deprecated Use setCachedHowFishingBundle */
export async function setCachedHowFishing(
  latitude: number,
  longitude: number,
  data: HowFishingResponse
): Promise<void> {
  // no-op — removed
}

// ---------------------------------------------------------------------------
// Rebuild v1 — full-day How's Fishing (canonical contract)
// ---------------------------------------------------------------------------

export type {
  EngineContextKey,
  RebuildScoreBand,
  RebuildReliability,
  ActionableTipTag,
  DaypartNotePreset,
  HowsFishingReportV1,
  HowFishingRebuildBundle,
  HowFishingRebuildMultiBundle,
  HowFishingRebuildResponse,
  RegionKey as RebuildRegionKey,
} from './howFishingRebuildContracts';
export { HOWS_FISHING_REBUILD_FEATURE } from './howFishingRebuildContracts';

function rebuildCacheKey(lat: number, lon: number, ctx: EngineContextKey): string {
  return `how_fishing_rebuild_${lat.toFixed(3)}_${lon.toFixed(3)}_${ctx}`;
}

interface RebuildCacheEntry {
  lat: number;
  lon: number;
  cache_expires_at: string;
  timezone: string | null;
  bundle: HowFishingRebuildBundle;
}

export async function getCachedHowFishingRebuild(
  latitude: number,
  longitude: number,
  engineContext: EngineContextKey
): Promise<HowFishingRebuildBundle | null> {
  try {
    const key = rebuildCacheKey(latitude, longitude, engineContext);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as RebuildCacheEntry;
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;
    const expires = new Date(entry.cache_expires_at).getTime();
    if (Number.isFinite(expires) && Date.now() >= expires) return null;
    return entry.bundle;
  } catch {
    return null;
  }
}

export async function setCachedHowFishingRebuild(
  latitude: number,
  longitude: number,
  bundle: HowFishingRebuildBundle
): Promise<void> {
  try {
    const key = rebuildCacheKey(latitude, longitude, bundle.engine_context);
    const entry: RebuildCacheEntry = {
      lat: latitude,
      lon: longitude,
      cache_expires_at: bundle.cache_expires_at,
      timezone: bundle.report.location.timezone,
      bundle,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // non-fatal
  }
}

// ---------------------------------------------------------------------------
// Multi-bundle cache — wraps per-context cache for the multi-report flow
// ---------------------------------------------------------------------------

import type { HowFishingRebuildMultiBundle } from './howFishingRebuildContracts';

export async function getCachedMultiRebuild(
  latitude: number,
  longitude: number,
  contexts: EngineContextKey[]
): Promise<Record<EngineContextKey, HowFishingRebuildBundle> | null> {
  const results: Partial<Record<EngineContextKey, HowFishingRebuildBundle>> = {};
  for (const ctx of contexts) {
    const cached = await getCachedHowFishingRebuild(latitude, longitude, ctx);
    if (!cached) return null; // all-or-nothing
    results[ctx] = cached;
  }
  return results as Record<EngineContextKey, HowFishingRebuildBundle>;
}

export async function setCachedMultiRebuild(
  latitude: number,
  longitude: number,
  multi: HowFishingRebuildMultiBundle
): Promise<void> {
  for (const ctx of multi.contexts) {
    const bundle = multi.reports[ctx];
    if (bundle) {
      await setCachedHowFishingRebuild(latitude, longitude, bundle);
    }
  }
}

let currentMultiRebuildEntry: {
  lat: number;
  lon: number;
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>;
} | null = null;

export function setCurrentMultiRebuild(
  latitude: number,
  longitude: number,
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>
): void {
  currentMultiRebuildEntry = { lat: latitude, lon: longitude, bundles };
}

export function getCurrentMultiRebuild(
  latitude?: number,
  longitude?: number
): Record<EngineContextKey, HowFishingRebuildBundle> | null {
  if (!currentMultiRebuildEntry) return null;
  if (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !coordsMatch(currentMultiRebuildEntry.lat, currentMultiRebuildEntry.lon, latitude, longitude)
  ) {
    return null;
  }
  return currentMultiRebuildEntry.bundles;
}

let currentRebuildEntry: { lat: number; lon: number; bundle: HowFishingRebuildBundle } | null = null;

export function setCurrentHowFishingRebuild(
  latitude: number,
  longitude: number,
  bundle: HowFishingRebuildBundle
): void {
  currentRebuildEntry = { lat: latitude, lon: longitude, bundle };
}

export function getCurrentHowFishingRebuild(
  latitude?: number,
  longitude?: number
): HowFishingRebuildBundle | null {
  if (!currentRebuildEntry) return null;
  if (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !coordsMatch(currentRebuildEntry.lat, currentRebuildEntry.lon, latitude, longitude)
  ) {
    return null;
  }
  return currentRebuildEntry.bundle;
}
