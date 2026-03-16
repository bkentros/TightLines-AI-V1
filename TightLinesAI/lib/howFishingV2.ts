/**
 * How's Fishing V2 — Client-side types for the new single-context engine.
 *
 * These mirror the backend engineV2 contracts and replace the old
 * HowFishingBundle / coastal_multi / inland_dual model over time.
 *
 * Import these in new code. The old HowFishingBundle types in howFishing.ts
 * remain for backwards compatibility until the full refactor (Phase 13).
 */

// ---------------------------------------------------------------------------
// Confirmed Environment Modes
// ---------------------------------------------------------------------------

export type EnvironmentModeV2 =
  | 'freshwater_lake'
  | 'freshwater_river'
  | 'brackish'
  | 'saltwater';

export type WaterTypeV2 = 'freshwater' | 'brackish' | 'saltwater';

export type FreshwaterSubtypeV2 = 'lake' | 'river_stream' | 'reservoir';

// ---------------------------------------------------------------------------
// Score Bands
// ---------------------------------------------------------------------------

export type ScoreBandV2 = 'Poor' | 'Fair' | 'Good' | 'Great';

export type ConfidenceBandV2 = 'high' | 'moderate' | 'low' | 'very_low';

// ---------------------------------------------------------------------------
// Confirmed Fishing Context — built by the frontend before calling the engine
// ---------------------------------------------------------------------------

export interface ConfirmedFishingContextV2 {
  waterType: WaterTypeV2;
  freshwaterSubtype?: FreshwaterSubtypeV2 | null;
  environmentMode: EnvironmentModeV2;
  manualFreshwaterWaterTempF?: number | null;
}

// ---------------------------------------------------------------------------
// Opportunity Windows
// ---------------------------------------------------------------------------

export type WindowQualityV2 = 'best' | 'fair' | 'poor';

export interface OpportunityWindowV2 {
  startLocal: string;
  endLocal: string;
  quality: WindowQualityV2;
  windowScore: number;
  drivers: string[];
}

// ---------------------------------------------------------------------------
// LLM Narration Output — client-side shape of narration response
// ---------------------------------------------------------------------------

export interface LLMNarrationOutputV2 {
  headlineSummary: string;
  overallRating: {
    label: ScoreBandV2;
    summary: string;
  };
  bestTimesToFishToday: Array<{
    timeRange: string;
    label: WindowQualityV2;
    reasoning: string;
  }>;
  decentTimesToday?: Array<{
    timeRange: string;
    reasoning: string;
  }>;
  worstTimesToFishToday: Array<{
    timeRange: string;
    reasoning: string;
  }>;
  keyFactors: {
    barometricPressure?: string;
    temperatureTrend?: string;
    lightConditions?: string;
    tideOrSolunar?: string;
    moonPhase?: string;
    wind?: string;
    precipitationRecentRain?: string;
    [key: string]: string | undefined;
  };
  tipsForToday: string[];
  strategy?: {
    presentationSpeed: string;
    depthFocus: string;
    approachNote: string;
  };
}

// ---------------------------------------------------------------------------
// Engine Output — client-side shape of the deterministic engine output
// ---------------------------------------------------------------------------

export interface HowFishingEngineOutputV2 {
  score: number;
  scoreBand: ScoreBandV2;
  confidence: ConfidenceBandV2;
  topDrivers: string[];
  suppressors: string[];
  severeSuppression: boolean;
  severeSuppressionReasons: string[];
  dataQualityNotes: string[];
  behavior: {
    activityState: string;
    feedingReadiness: string;
    opportunityState: string;
    broadPositioningTendency: string;
    presentationSpeedBias: string;
    dominantPositiveDrivers: string[];
    dominantNegativeDrivers: string[];
    suppressionActive: boolean;
    suppressionReasons: string[];
  };
  opportunityCurve: {
    bestWindows: OpportunityWindowV2[];
    fairWindows: OpportunityWindowV2[];
    poorWindows: OpportunityWindowV2[];
  };
  reliability: {
    overallConfidenceBand: ConfidenceBandV2;
    waterTempSource: string;
    waterTempConfidence: number;
    degradedModules: string[];
    criticalInferredInputs: string[];
    claimGuardActive: boolean;
    safeForTacticalSpecificity: boolean;
    notes: string[];
  };
}

// ---------------------------------------------------------------------------
// How's Fishing Response V2 — top-level response contract
// ---------------------------------------------------------------------------

export interface HowFishingResponseV2 {
  feature: 'hows_fishing_feature_v2';
  generated_at: string;
  cache_expires_at: string;

  context: {
    water_type: WaterTypeV2;
    freshwater_subtype?: FreshwaterSubtypeV2 | null;
    environment_mode: EnvironmentModeV2;
    region: string;
    seasonal_state: string;
  };

  engine: HowFishingEngineOutputV2;
  llm: LLMNarrationOutputV2;
}

// ---------------------------------------------------------------------------
// Weekly Overview Response V2
// ---------------------------------------------------------------------------

export interface ForecastDayV2 {
  date: string;
  dailyScore: number;
  scoreBand: ScoreBandV2;
  summaryLine: string;
  highTempF: number;
  lowTempF: number;
  windMphAvg: number;
  precipChancePct: number;
  frontLabel: string | null;
}

export interface WeeklyOverviewResponseV2 {
  feature: 'hows_fishing_weekly_overview_v2';
  generated_at: string;
  cache_expires_at: string;
  context: {
    environment_mode: EnvironmentModeV2;
    region: string;
  };
  days: ForecastDayV2[];
}

// ---------------------------------------------------------------------------
// Context validation helpers (mirrors backend rules)
// ---------------------------------------------------------------------------

export function getValidEnvironmentModes(waterType: WaterTypeV2): EnvironmentModeV2[] {
  switch (waterType) {
    case 'freshwater':
      return ['freshwater_lake', 'freshwater_river'];
    case 'brackish':
      return ['brackish'];
    case 'saltwater':
      return ['saltwater'];
  }
}

export function environmentModeAllowsManualTemp(mode: EnvironmentModeV2): boolean {
  return mode === 'freshwater_lake' || mode === 'freshwater_river';
}

export function isFreshwaterEnvironmentMode(mode: EnvironmentModeV2): boolean {
  return mode === 'freshwater_lake' || mode === 'freshwater_river';
}

export function environmentModeLabel(mode: EnvironmentModeV2): string {
  switch (mode) {
    case 'freshwater_lake':
      return 'Freshwater Lake';
    case 'freshwater_river':
      return 'Freshwater River';
    case 'brackish':
      return 'Brackish';
    case 'saltwater':
      return 'Saltwater';
  }
}
