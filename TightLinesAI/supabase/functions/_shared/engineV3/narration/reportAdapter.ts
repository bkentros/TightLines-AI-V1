// =============================================================================
// ENGINE V3 — Report Adapter
// Phase 5: Maps V3 engine output to frontend EngineOutput / WaterTypeReport shape.
// Preserves compatibility with ReportView, ScoreCard, EngineDriversPanel, TimeWindows.
// =============================================================================

import type { NarrationPayloadV3 } from './narrationPayload.ts';
import type { EnvironmentModeV3 } from '../types.ts';

/** Frontend EngineOutput shape — mirrors lib/howFishing.ts EngineOutput */
export interface EngineOutputShape {
  location?: {
    lat: number;
    lon: number;
    timezone: string;
    coastal: boolean;
    nearest_tide_station_id: string | null;
  };
  environment: Record<string, unknown>;
  scoring: Record<string, unknown>;
  behavior: Record<string, unknown>;
  data_quality: Record<string, unknown>;
  alerts: Record<string, unknown>;
  time_windows: Array<{ label: string; start_local: string; end_local: string; window_score: number; drivers: string[] }>;
  fair_windows: Array<{ label: string; start_local: string; end_local: string; window_score: number; drivers: string[] }>;
  worst_windows: Array<{ start_local: string; end_local: string; window_score: number }>;
  v2_drivers?: string[];
  v2_suppressors?: string[];
  v2_score?: number;
  v2_score_band?: string;
  v2_confidence?: string;
  v2_environment_mode?: string;
  v2_timing_hint?: string | null;
}

function mapConfidenceToReliabilityTier(confidence: 'high' | 'medium' | 'low'): string {
  switch (confidence) {
    case 'high': return 'high';
    case 'medium': return 'degraded';
    case 'low': return 'low_confidence';
    default: return 'very_low_confidence';
  }
}

function mapScoreBandToOverallRating(scoreBand: string): string {
  switch (scoreBand) {
    case 'Great': return 'Excellent';
    case 'Good': return 'Good';
    case 'Fair': return 'Fair';
    case 'Poor': return 'Poor';
    default: return 'Fair';
  }
}

function mapConfidenceToV2Band(confidence: 'high' | 'medium' | 'low'): string {
  switch (confidence) {
    case 'high': return 'high';
    case 'medium': return 'moderate';
    case 'low': return 'low';
    default: return 'very_low';
  }
}

/**
 * Shapes V3 narration payload + location into the EngineOutput shape
 * expected by the frontend ReportView, ScoreCard, EngineDriversPanel, TimeWindows.
 *
 * V3 does NOT have:
 * - water_temp_confidence (inferred freshwater temp) — use data-coverage-based confidence
 * - water_temp_f for freshwater — always null
 * - behavior.activityState, feedingReadiness, etc. — derive simple hints from score/regime
 */
export function shapeV3ToEngineOutput(
  payload: NarrationPayloadV3,
  lat: number,
  lon: number,
  timezone: string,
  environmentMode: EnvironmentModeV3,
  freshwaterSubtype: 'lake' | 'river_stream' | 'reservoir' | null
): EngineOutputShape {
  const isCoastal = environmentMode === 'saltwater' || environmentMode === 'brackish';

  // Derive simple behavior hints from score and regime (V3 has no behavior layer)
  const score = payload.score;
  let activityState = 'moderate';
  let feedingReadiness = 'opportunistic';
  let positioningTendency = 'unknown';
  let presentationSpeedBias = 'moderate';

  if (score >= 75) {
    activityState = 'high';
    feedingReadiness = 'active';
    positioningTendency = 'shallow_feeding_edges';
    presentationSpeedBias = 'fast';
  } else if (score >= 55) {
    activityState = 'elevated';
    feedingReadiness = 'opportunistic';
    positioningTendency = 'mid_column_transition';
    presentationSpeedBias = 'moderate';
  } else if (score < 35) {
    activityState = 'very_low';
    feedingReadiness = 'reluctant';
    positioningTendency = 'deep_stable_structure';
    presentationSpeedBias = 'slow';
  }

  const coveragePct = payload.confidence === 'high' ? 85 : payload.confidence === 'medium' ? 65 : 40;

  return {
    location: {
      lat,
      lon,
      timezone,
      coastal: isCoastal,
      nearest_tide_station_id: null,
    },
    environment: {
      air_temp_f: payload.approvedFacts.airTempF ?? null,
      water_temp_f: payload.approvedFacts.coastalWaterTempF ?? null,
      water_temp_source: payload.approvedFacts.waterTempIsMeasured ? 'measured_coastal' : 'unavailable',
      water_temp_zone: null,
      wind_speed_mph: payload.approvedFacts.windSpeedMph ?? null,
      wind_direction: null,
      wind_direction_deg: null,
      cloud_cover_pct: payload.approvedFacts.cloudCoverPct ?? null,
      pressure_mb: null,
      pressure_change_rate_mb_hr: null,
      pressure_state: payload.approvedFacts.pressureStateSummary ?? null,
      precip_48hr_inches: null,
      precip_7day_inches: null,
      precip_condition: payload.approvedFacts.precipSummary ?? null,
      moon_phase: payload.approvedFacts.moonPhase ?? null,
      moon_illumination_pct: null,
      solunar_state: null,
      tide_phase_state: payload.approvedFacts.tideStateSummary ?? null,
      tide_strength_state: null,
      range_strength_pct: null,
      light_condition: null,
      temp_trend_state: null,
      temp_trend_direction_f: null,
      days_since_front: 0,
      freshwater_subtype: freshwaterSubtype,
      severe_weather_alert: payload.severeSuppression,
      severe_weather_reasons: payload.severeSuppressionReasons,
    },
    scoring: {
      weights: {},
      component_status: {},
      components: {},
      coverage_pct: coveragePct,
      reliability_tier: mapConfidenceToReliabilityTier(payload.confidence),
      raw_score: payload.score,
      recovery_multiplier: 1,
      adjusted_score: payload.score,
      overall_rating: mapScoreBandToOverallRating(payload.scoreBand),
      water_temp_confidence: null,
    },
    behavior: {
      metabolic_state: activityState,
      aggression_state: feedingReadiness,
      feeding_timer: 'light_solunar',
      presentation_difficulty: presentationSpeedBias,
      positioning_bias: positioningTendency,
      secondary_positioning_tags: [],
      dominant_positive_drivers: payload.topDrivers,
      dominant_negative_drivers: payload.topSuppressors,
    },
    data_quality: {
      missing_variables: payload.variableGroupsMissing,
      fallback_variables: [],
      notes: payload.missingVariablesNote ? [payload.missingVariablesNote] : [],
    },
    alerts: {
      cold_stun_alert: false,
      cold_stun_status: 'evaluated',
      salinity_disruption_alert: false,
      salinity_disruption_status: 'evaluated',
      rapid_cooling_alert: false,
      recovery_active: false,
      days_since_front: 0,
      front_severity: null,
      front_label: null,
      developing_front: false,
      severe_weather_alert: payload.severeSuppression,
      severe_weather_reasons: payload.severeSuppressionReasons,
    },
    time_windows: payload.bestWindows.map((w) => ({
      label: 'PRIME',
      start_local: w.startLocal,
      end_local: w.endLocal,
      window_score: w.score,
      drivers: w.reasons,
    })),
    fair_windows: payload.fairWindows.map((w) => ({
      label: 'FAIR',
      start_local: w.startLocal,
      end_local: w.endLocal,
      window_score: w.score,
      drivers: w.reasons,
    })),
    worst_windows: payload.poorWindows.map((w) => ({
      start_local: w.startLocal,
      end_local: w.endLocal,
      window_score: w.score,
    })),
    v2_drivers: payload.topDrivers,
    v2_suppressors: payload.topSuppressors,
    v2_score: payload.score,
    v2_score_band: payload.scoreBand,
    v2_confidence: mapConfidenceToV2Band(payload.confidence),
    v2_environment_mode: environmentMode,
    v2_timing_hint: payload.timingNarrationHint ?? null,
  };
}
