/**
 * Canonical How's Fishing rebuild contracts — mirror of
 * supabase/functions/_shared/howFishingEngine/contracts/
 * Keep in sync when changing engine report/API shapes.
 * @see tlai_engine_rebuild_docs/HOWS_FISHING_REPORT_AND_NARRATION_SPEC.md
 */

export type RegionKey =
  | 'northeast'
  | 'southeast_atlantic'
  | 'florida'
  | 'gulf_coast'
  | 'great_lakes_upper_midwest'
  | 'midwest_interior'
  | 'south_central'
  | 'mountain_west'
  | 'southwest'
  | 'pacific_coast';

export type EngineContextKey = 'freshwater_lake_pond' | 'freshwater_river' | 'coastal';

export type RebuildScoreBand = 'Poor' | 'Fair' | 'Good' | 'Excellent';
export type RebuildReliability = 'high' | 'medium' | 'low';

export type ActionableTipTag =
  | 'coastal_tide_positive'
  | 'wind_shelter'
  | 'runoff_clarity_flow'
  | 'temperature_intraday_flex'
  | 'lean_into_top_driver'
  | 'general_flexibility';

export type DaypartNotePreset =
  | 'moving_water_periods'
  | 'early_late_low_light'
  | 'warmest_part_may_help'
  | 'cooler_low_light_better'
  | 'no_timing_edge';

export const HOWS_FISHING_REBUILD_FEATURE = 'hows_fishing_rebuild_v1' as const;

export interface HowsFishingReportV1 {
  context: EngineContextKey;
  display_context_label: 'Freshwater Lake/Pond' | 'Freshwater River' | 'Coastal';
  location: {
    latitude: number;
    longitude: number;
    state_code: string | null;
    region_key: string;
    timezone: string;
    local_date: string;
    location_label?: string | null;
  };
  score: number;
  band: RebuildScoreBand;
  summary_line: string;
  drivers: Array<{ variable: string; label: string; effect: 'positive' }>;
  suppressors: Array<{ variable: string; label: string; effect: 'negative' }>;
  actionable_tip: string;
  actionable_tip_tag: ActionableTipTag;
  daypart_note?: string | null;
  daypart_preset: DaypartNotePreset | null;
  reliability: RebuildReliability;
  reliability_note?: string | null;
  normalized_debug?: {
    available_variables: string[];
    missing_variables: string[];
    data_gaps?: Array<{ variable_key: string; reason: string }>;
  };
}

export interface HowFishingRebuildBundle {
  feature: typeof HOWS_FISHING_REBUILD_FEATURE;
  generated_at: string;
  cache_expires_at: string;
  engine_context: EngineContextKey;
  report: HowsFishingReportV1;
  usage?: { input_tokens: number; output_tokens: number; token_cost_usd: number };
}
