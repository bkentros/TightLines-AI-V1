// =============================================================================
// CORE INTELLIGENCE ENGINE — TYPES
// All input/output types for the shared deterministic fishing intelligence engine.
// Spec reference: core_intelligence_spec.md
// =============================================================================

// ---------------------------------------------------------------------------
// Water Type
// ---------------------------------------------------------------------------

export type WaterType = "freshwater" | "saltwater" | "brackish";

export type LatitudeBand = "deep_south" | "south" | "mid" | "north" | "far_north";

// ---------------------------------------------------------------------------
// Environment Snapshot
// This is the normalized input the engine consumes.
// Produced by get-environment, consumed by runCoreIntelligence().
// All fields are nullable to support partial-data operation.
// ---------------------------------------------------------------------------

export interface SolunarPeriod {
  start_local: string; // "HH:MM"
  end_local: string;   // "HH:MM"
}

export interface TidePrediction {
  time_local: string;  // "YYYY-MM-DD HH:mm" in local station time
  type: "H" | "L";
  height_ft: number;
}

export interface EnvironmentSnapshot {
  // Location
  lat: number;
  lon: number;
  timestamp_utc: string;
  timezone: string;
  tz_offset_hours: number;
  coastal: boolean;
  nearest_tide_station_id: string | null;

  // Current weather
  air_temp_f: number | null;
  wind_speed_mph: number | null;
  wind_direction_deg: number | null;
  wind_direction_label: string | null;
  gust_speed_mph: number | null;
  cloud_cover_pct: number | null;
  current_precip_in_hr: number | null;
  humidity_pct: number | null;
  pressure_mb: number | null;

  // Pressure history: hourly values oldest→newest (up to 7*24 hours)
  hourly_pressure_mb: Array<{ time_utc: string; value: number }>;

  // Temperature history: hourly values
  hourly_air_temp_f: Array<{ time_utc: string; value: number }>;

  // Daily high/low for 7 days (oldest first, index 0 = 6 days ago, index 6 = today)
  daily_air_temp_high_f: Array<number | null>;
  daily_air_temp_low_f: Array<number | null>;

  // Precipitation
  precip_48hr_inches: number | null;
  precip_7day_inches: number | null;

  // Sun
  sunrise_local: string | null;     // "HH:MM"
  sunset_local: string | null;      // "HH:MM"
  civil_twilight_begin_local: string | null; // "HH:MM"
  civil_twilight_end_local: string | null;   // "HH:MM"

  // Moon
  moon_phase_label: string | null;
  moon_phase_is_waxing: boolean | null;
  moon_illumination_pct: number | null;
  moonrise_local: string | null;
  moonset_local: string | null;

  // Solunar
  solunar_major_periods: SolunarPeriod[];
  solunar_minor_periods: SolunarPeriod[];

  // Tides
  tide_predictions_today: TidePrediction[];
  tide_predictions_30day: Array<{ date: string; high_ft: number; low_ft: number }>;

  // Measured water temperature (salt/brackish)
  measured_water_temp_f: number | null;
  measured_water_temp_source: WaterTempSource | null;
  // Water temp from ~72 hours ago — used for cold stun drop check (Section 4I)
  // Set to null if no historical observation is available.
  measured_water_temp_72h_ago_f: number | null;

  // Freshwater subtype hint (optional; defaults to "lake" if null for estimation bias).
  // Populated from the client request when the user selects water body type.
  freshwater_subtype_hint: FreshwaterSubtype | null;

  // Altitude in feet — used for effective latitude calculation (elevation shifts seasonal band)
  altitude_ft: number | null;
}

// ---------------------------------------------------------------------------
// Derived Variable Types (Section 4 outputs)
// ---------------------------------------------------------------------------

export type PressureState =
  | "rapidly_falling"
  | "slowly_falling"
  | "stable"
  | "slowly_rising"
  | "rapidly_rising";

export type LightCondition =
  | "night"
  | "dawn_window_overcast"
  | "dawn_window_clear"
  | "dusk_window_overcast"
  | "dusk_window_clear"
  | "midday_overcast"
  | "midday_partly_cloudy"
  | "midday_full_sun";

export type SolunarState =
  | "within_major_window"
  | "within_30min_of_major"
  | "within_60min_of_major"   // NEW
  | "within_90min_of_major"   // NEW
  | "within_minor_window"
  | "within_30min_of_minor"
  | "within_60min_of_minor"   // NEW
  | "outside_all_windows";

export type TidePhaseState =
  | "incoming_first_2_hours"
  | "outgoing_first_2_hours"
  | "incoming_mid"
  | "outgoing_mid"
  | "final_hour_before_slack"
  | "slack";

export type TideStrengthState =
  | "strong_movement"
  | "above_average_movement"
  | "moderate_movement"
  | "weak_movement"
  | "minimal_movement";

export type TempTrendState =
  | "rapid_warming"
  | "warming"
  | "stable"
  | "cooling"
  | "rapid_cooling";

export type WaterTempZone =
  | "near_shutdown_cold"
  | "lethargic"
  | "transitional"
  | "active_prime"
  | "peak_aggression"
  | "thermal_stress_heat";

export type PrecipCondition =
  | "post_heavy_rain_48hr"
  | "heavy_rain"
  | "moderate_rain"
  | "light_rain"
  | "post_light_rain_clearing"
  | "no_precip_stable"
  | "current_rain_any_intensity" // saltwater alias
  | "no_precip"                  // saltwater alias
  | "post_major_storm";          // saltwater alias

export type MoonPhaseLabel =
  | "new_moon"
  | "full_moon"
  | "waxing_or_waning_gibbous"
  | "first_or_third_quarter"
  | "waxing_or_waning_crescent";

export type WaterTempSource =
  | "freshwater_air_model"
  | "noaa_coops"
  | "noaa_ndbc"
  | "marine_sst"
  | "unavailable";

export type WindTideRelation =
  | "wind_with_tide"
  | "wind_against_tide"
  | "neutral_or_unknown_relationship";

// ---------------------------------------------------------------------------
// Alert Types (Section 4I)
// ---------------------------------------------------------------------------

export type AlertStatus = "evaluated" | "not_evaluable_missing_inputs";

export interface AlertState {
  cold_stun_alert: boolean;
  cold_stun_status: AlertStatus;
  salinity_disruption_alert: boolean;
  salinity_disruption_status: AlertStatus;
}

/** Severity of a detected cold front; used for recovery multiplier adjustment. */
export type FrontSeverity = "mild" | "moderate" | "severe";

/** Freshwater-only: cold water in winter is expected; in summer it is a shock. */
export type FreshwaterColdContext = "seasonally_expected_cold" | "cold_shock" | null;

/**
 * Freshwater body subtype — affects water temperature estimation bias.
 * Lakes are slower to warm/cool than rivers, which track air temps more closely.
 * Reservoirs behave like lakes but may have thermal stratification effects.
 */
export type FreshwaterSubtype = "lake" | "river_stream" | "reservoir";

/**
 * Deterministic seasonal fish-behavior state derived from latitude band + month + subtype.
 * Captures the broad behavioral envelope fish are in for the time of year.
 * Used by the LLM prompt and alert labels to frame narrative accurately.
 */
export type SeasonalFishBehaviorState =
  | "deep_winter_survival"    // fish barely moving, holding deep or in thermal refugia
  | "pre_spawn_buildup"       // fish starting to move, feeding increasing ahead of spawn
  | "spawn_period"            // spawning actively underway — erratic behavior, location shifts
  | "post_spawn_recovery"     // spawn finished, fish scattered and recovering
  | "summer_peak_activity"    // warm water, metabolically active, dawn/dusk bite dominant
  | "summer_heat_suppression" // excessively hot water forcing fish to deep cool water
  | "fall_feed_buildup"       // cooling water triggers aggressive pre-winter feed-up
  | "late_fall_slowdown"      // water rapidly cooling, fish slowing before winter
  | "mild_winter_active";     // NEW — mild southern winters; fish remain somewhat active

export type SaltwaterSeasonalState =
  | "sw_cold_inactive"
  | "sw_cold_mild_active"
  | "sw_transitional_feed"
  | "sw_summer_peak"
  | "sw_summer_heat_stress";

// ---------------------------------------------------------------------------
// Component Status (Section 2E)
// ---------------------------------------------------------------------------

export type ComponentStatus =
  | "available"
  | "fallback_used"
  | "unavailable"
  | "not_applicable";

// ---------------------------------------------------------------------------
// Reliability Tier (Section 5M)
// ---------------------------------------------------------------------------

export type ReliabilityTier =
  | "high"
  | "degraded"
  | "low_confidence"
  | "very_low_confidence";

// ---------------------------------------------------------------------------
// Score Component Keys per Water Type
// ---------------------------------------------------------------------------

export type FreshwaterComponentKey =
  | "water_temp_zone"
  | "pressure"
  | "light"
  | "temp_trend"
  | "solunar"
  | "wind"
  | "moon_phase"
  | "precipitation";

export type SaltwaterComponentKey =
  | "tide_phase"
  | "tide_strength"
  | "water_temp_zone"
  | "pressure"
  | "wind"
  | "light"
  | "temp_trend"
  | "solunar"
  | "moon_phase"
  | "precipitation";

export type BrackishComponentKey =
  | "water_temp_zone"
  | "tide_phase"
  | "pressure"
  | "tide_strength"
  | "light"
  | "temp_trend"
  | "solunar"
  | "wind"
  | "precipitation"
  | "moon_phase";

export type ComponentKey =
  | FreshwaterComponentKey
  | SaltwaterComponentKey
  | BrackishComponentKey;

// ---------------------------------------------------------------------------
// Scoring Output (Section 5, 6)
// ---------------------------------------------------------------------------

export interface ScoringOutput {
  weights: Partial<Record<ComponentKey, number>>;
  component_status: Partial<Record<ComponentKey, ComponentStatus>>;
  components: Partial<Record<ComponentKey, number>>;
  coverage_pct: number;
  reliability_tier: ReliabilityTier;
  raw_score: number;
  recovery_multiplier: number;
  adjusted_score: number;
  overall_rating: OverallRating;
  component_detail?: Record<string, { pct: number; score: number; weight: number }>;
}

export type OverallRating =
  | "Exceptional"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"
  | "Tough";

// ---------------------------------------------------------------------------
// Behavior Output (Section 8)
// ---------------------------------------------------------------------------

export type MetabolicState =
  | "shutdown"
  | "lethargic"
  | "building"
  | "active"
  | "aggressive"
  | "suppressed_heat"
  | "cold_stun";

export type AggressionState =
  | "shut_down"
  | "negative"
  | "cautious"
  | "active"
  | "strong_feed"
  | "peak_feed";

export type FeedingTimer =
  | "light_solunar"
  | "tide_current"
  | "tide_plus_solunar";

export type PresentationDifficulty =
  | "finesse_only"
  | "difficult"
  | "moderate"
  | "standard"
  | "favorable"
  | "easiest_window";

export type PositioningBias =
  // Freshwater
  | "shallow_feeding_edges"
  | "shade_depth_structure"
  | "deepest_stable_water"
  | "warming_flats_and_transitions"
  | "first_drop_and_transition_edges"
  // Saltwater
  | "current_breaks_cuts_passes_flats"
  | "deeper_edges_channels_adjacent_structure"
  | "cooler_deeper_current_refuge"
  | "warmest_available_refuge"
  // Brackish
  | "creek_mouths_oyster_bars_tidal_cuts"
  | "higher_salinity_inlets_and_passes"
  | "deeper_drains_dropoffs_and_shade"
  | "warming_flats_adjacent_to_escape_depth";

export type PositioningSecondaryTag =
  | "windward_banks"
  | "low_light_surface_window"
  | "windward_bait_push"
  | "night_current_window"
  | "wind_driven_shoreline_push"
  | "solunar_overlay_active";

export interface BehaviorOutput {
  metabolic_state: MetabolicState;
  aggression_state: AggressionState;
  feeding_timer: FeedingTimer;
  presentation_difficulty: PresentationDifficulty;
  positioning_bias: PositioningBias;
  secondary_positioning_tags: PositioningSecondaryTag[];
  dominant_positive_drivers: string[];
  dominant_negative_drivers: string[];
}

// ---------------------------------------------------------------------------
// Data Quality Metadata (Section 9)
// ---------------------------------------------------------------------------

export interface DataQuality {
  missing_variables: string[];
  fallback_variables: string[];
  notes: string[];
}

// ---------------------------------------------------------------------------
// Time Window (Section 7)
// ---------------------------------------------------------------------------

export type WindowLabel = "PRIME" | "GOOD" | "FAIR" | "SLOW";

export interface TimeWindow {
  label: WindowLabel;
  start_local: string;   // "HH:MM"
  end_local: string;     // "HH:MM"
  window_score: number;  // 0–100
  drivers: string[];
}

export interface WorstWindow {
  start_local: string;
  end_local: string;
  window_score: number;
  label?: WindowLabel;  // for FAIR/SLOW classification
}

// ---------------------------------------------------------------------------
// Location Output (Section 9)
// ---------------------------------------------------------------------------

export interface LocationOutput {
  lat: number;
  lon: number;
  timezone: string;
  coastal: boolean;
  nearest_tide_station_id: string | null;
}

// ---------------------------------------------------------------------------
// Full Engine Output Contract (Section 9)
// ---------------------------------------------------------------------------

export interface EngineOutput {
  engine: "fishing_core_intelligence_v1";
  water_type: WaterType;
  location: LocationOutput;
  environment: EngineEnvironmentSnapshot;
  scoring: ScoringOutput;
  behavior: BehaviorOutput;
  data_quality: DataQuality;
  alerts: AlertState & {
    rapid_cooling_alert: boolean;
    recovery_active: boolean;
    days_since_front: number;
    front_severity: FrontSeverity | null;
    /** Plain-language label for the active front/pressure event, e.g. "Cold front moved through — fishing picks up in 1–2 days" */
    front_label: string | null;
    // New fields (Sweep 1):
    severe_weather_alert: boolean;
    severe_weather_reasons: string[];
  };
  time_windows: TimeWindow[];
  fair_windows: TimeWindow[];  // NEW — Sweep 2
  worst_windows: WorstWindow[];
}

// The subset of environment fields the engine exposes in its output
// (all derived/normalized for LLM consumption)
export interface EngineEnvironmentSnapshot {
  air_temp_f: number | null;
  water_temp_f: number | null;
  water_temp_source: WaterTempSource;
  water_temp_zone: WaterTempZone | null;
  wind_speed_mph: number | null;
  wind_direction: string | null;
  wind_direction_deg: number | null;
  cloud_cover_pct: number | null;
  pressure_mb: number | null;
  pressure_change_rate_mb_hr: number | null;
  pressure_state: PressureState | null;
  precip_48hr_inches: number | null;
  precip_7day_inches: number | null;
  precip_condition: PrecipCondition | null;
  moon_phase: MoonPhaseLabel | null;
  moon_illumination_pct: number | null;
  solunar_state: SolunarState | null;
  tide_phase_state: TidePhaseState | null;
  tide_strength_state: TideStrengthState | null;
  range_strength_pct: number | null;
  light_condition: LightCondition | null;
  temp_trend_state: TempTrendState | null;
  temp_trend_direction_f: number | null;
  days_since_front: number;
  freshwater_subtype: FreshwaterSubtype | null;
  seasonal_fish_behavior: SeasonalFishBehaviorState | null;

  // New fields (Sweep 1):
  effective_latitude: number;
  latitude_band: LatitudeBand;
  saltwater_seasonal_state: SaltwaterSeasonalState | null;
  altitude_ft: number | null;
  severe_weather_alert: boolean;
  severe_weather_reasons: string[];
}

// ---------------------------------------------------------------------------
// Derived Variables Bundle (internal use between engine modules)
// ---------------------------------------------------------------------------

export interface DerivedVariables {
  // Computed current-time helpers
  current_local_minutes: number;   // minutes since midnight local

  pressure_change_rate_mb_hr: number | null;
  pressure_state: PressureState | null;

  light_condition: LightCondition | null;

  solunar_state: SolunarState | null;

  tide_phase_state: TidePhaseState | null;
  tide_strength_state: TideStrengthState | null;
  range_strength_pct: number | null;

  temp_trend_direction_f: number | null;
  temp_trend_state: TempTrendState | null;

  water_temp_f: number | null;
  water_temp_source: WaterTempSource;
  water_temp_zone: WaterTempZone | null;

  moon_phase: MoonPhaseLabel | null;

  precip_condition: PrecipCondition | null;

  cold_stun_alert: boolean;
  cold_stun_status: AlertStatus;
  salinity_disruption_alert: boolean;
  salinity_disruption_status: AlertStatus;

  wind_tide_relation: WindTideRelation;

  /** Freshwater only: when water is in a cold zone, was it expected for the season? */
  freshwater_cold_context: FreshwaterColdContext;

  /** Freshwater only: the body-of-water subtype chosen by the user (or defaulting to "lake"). */
  freshwater_subtype: FreshwaterSubtype | null;

  /** Freshwater only: deterministic seasonal fish-behavior state based on lat + month + subtype. */
  seasonal_fish_behavior: SeasonalFishBehaviorState | null;

  // New fields (Sweep 1):
  saltwater_seasonal_state: SaltwaterSeasonalState | null;
  latitude_band: LatitudeBand;
  effective_latitude: number;
  severe_weather_alert: boolean;
  severe_weather_reasons: string[];
}
