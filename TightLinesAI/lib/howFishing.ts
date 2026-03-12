/**
 * How's Fishing Right Now? — types and cache
 * Spec reference: hows_fishing_feature_spec.md Section 8
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Cache config
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes per spec Section 10B
// ~1km match threshold — realistic for GPS drift on a phone
const COORD_MATCH_THRESHOLD = 0.01;

// ---------------------------------------------------------------------------
// Engine output types (mirrors backend _shared/coreIntelligence/types.ts)
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
}

export interface EngineEnvironment {
  air_temp_f: number | null;
  water_temp_f: number | null;
  water_temp_source: string;
  water_temp_zone: string | null;
  wind_speed_mph: number | null;
  wind_direction: string | null;
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
}

export interface DataQuality {
  missing_variables: string[];
  fallback_variables: string[];
  notes: string[];
}

export interface TimeWindow {
  label: 'PRIME' | 'GOOD' | 'SECONDARY';
  start_local: string;
  end_local: string;
  window_score: number;
  drivers: string[];
}

export interface WorstWindow {
  start_local: string;
  end_local: string;
  window_score: number;
}

export interface EngineOutput {
  environment: EngineEnvironment;
  scoring: EngineScoring;
  behavior: EngineBehavior;
  data_quality: DataQuality;
  alerts: EngineAlerts;
  time_windows: TimeWindow[];
  worst_windows: WorstWindow[];
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
  label: 'PRIME' | 'GOOD';
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

export interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: LLMRating;
  best_times_to_fish_today: LLMBestTime[];
  worst_times_to_fish_today: LLMWorstTime[];
  key_factors: LLMKeyFactors;
  tips_for_today: string[];
}

// ---------------------------------------------------------------------------
// Per-report structure (Section 8C)
// ---------------------------------------------------------------------------

export interface WaterTypeReport {
  status: 'ok' | 'error';
  water_type: WaterType;
  engine: EngineOutput | null;
  llm: LLMOutput | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Feature Bundle (Section 8A / 8B) — top-level response contract
// ---------------------------------------------------------------------------

export interface HowFishingBundle {
  feature: 'hows_fishing_feature_v1';
  mode: 'single' | 'coastal_multi';
  default_tab: WaterType;
  generated_at: string;
  cache_expires_at: string;
  reports: {
    freshwater?: WaterTypeReport;
    saltwater?: WaterTypeReport;
    brackish?: WaterTypeReport;
  };
  failed_reports: string[];
}

// ---------------------------------------------------------------------------
// Cache — keyed per water-type (or full bundle) at location + date
// ---------------------------------------------------------------------------

interface BundleCacheEntry {
  lat: number;
  lon: number;
  date: string;       // "YYYY-MM-DD" local date
  fetched_at: string; // ISO timestamp
  bundle: HowFishingBundle;
}

interface InMemoryBundleEntry {
  lat: number;
  lon: number;
  bundle: HowFishingBundle;
}

let currentBundleEntry: InMemoryBundleEntry | null = null;

function cacheKey(lat: number, lon: number): string {
  return `how_fishing_bundle_${lat.toFixed(3)}_${lon.toFixed(3)}`;
}

function localDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_MATCH_THRESHOLD && Math.abs(b - d) < COORD_MATCH_THRESHOLD;
}

export async function getCachedHowFishingBundle(
  latitude: number,
  longitude: number
): Promise<HowFishingBundle | null> {
  try {
    const key = cacheKey(latitude, longitude);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as BundleCacheEntry;

    // Coordinate match
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;

    // Date boundary invalidation — a report from yesterday is stale regardless of TTL
    if (entry.date !== localDateString()) return null;

    // TTL check
    const age = Date.now() - new Date(entry.fetched_at).getTime();
    if (age > CACHE_TTL_MS) return null;

    return entry.bundle;
  } catch {
    return null;
  }
}

export async function setCachedHowFishingBundle(
  latitude: number,
  longitude: number,
  bundle: HowFishingBundle
): Promise<void> {
  try {
    const key = cacheKey(latitude, longitude);
    const entry: BundleCacheEntry = {
      lat: latitude,
      lon: longitude,
      date: localDateString(),
      fetched_at: new Date().toISOString(),
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
