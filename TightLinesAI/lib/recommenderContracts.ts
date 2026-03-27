import type { EngineContextKey } from './howFishingRebuildContracts';

export type RecommenderGearMode = 'lure' | 'fly';
export type WaterClarity = 'clear' | 'stained' | 'dirty';
export type VegetationDensity = 'none' | 'sparse' | 'moderate' | 'heavy';
export type PlatformType = 'bank' | 'boat_kayak';

export type RefinementTag =
  | 'grass'
  | 'wood'
  | 'docks'
  | 'rock'
  | 'shade'
  | 'breakline'
  | 'seam'
  | 'eddy'
  | 'hole'
  | 'riffle_run'
  | 'undercut_bank'
  | 'wood_boulder'
  | 'channel_edge'
  | 'point'
  | 'current_seam'
  | 'dock'
  | 'shoreline_edge'
  | 'drain'
  | 'grass_edge'
  | 'pothole'
  | 'trough'
  | 'oyster'
  | 'marsh_edge';

export type RecommenderRefinements = {
  water_clarity?: WaterClarity;
  vegetation?: VegetationDensity;
  platform?: PlatformType;
  habitat_tags?: RefinementTag[];
};

export type FishBehaviorOutput = {
  baseline_profile_id: string;
  position: {
    depth_lanes: Array<{ id: string; score: number }>;
    relation_tags: Array<{ id: string; score: number }>;
  };
  behavior: {
    activity: 'inactive' | 'neutral' | 'active' | 'aggressive';
    style_flags: string[];
    strike_zone: 'narrow' | 'moderate' | 'wide';
    chase_radius: 'short' | 'moderate' | 'long';
  };
  forage: {
    baitfish_bias: number;
    crustacean_bias: number;
    insect_bias: number;
    amphibian_surface_bias?: number;
  };
};

export type PresentationArchetypeScore = {
  archetype_id: string;
  score: number;
  reasons: string[];
  depth_target: string;
  speed: string;
  motions: string[];
  triggers: string[];
};

export type RankedFamily = {
  family_id: string;
  display_name: string;
  score: number;
  examples: string[];
  match_reasons: string[];
  color_profile_guidance?: string[];
  how_to_fish: string[];
  best_dayparts: string[];
};

export type RecommenderConfidence = {
  behavior_confidence: 'high' | 'medium' | 'low';
  presentation_confidence: 'high' | 'medium' | 'low';
  family_confidence: 'high' | 'medium' | 'low';
  reasons: string[];
};

export type InventoryCompatibilityResult = {
  best_overall_family_ids: string[];
  best_from_inventory?: Array<{
    item_id: string;
    label: string;
    family_id: string;
    fit_score: number;
    compromise_notes?: string[];
  }>;
  near_match_from_inventory?: Array<{
    item_id: string;
    label: string;
    family_id: string;
    fit_score: number;
  }>;
  inventory_gap_notes?: string[];
};

export type RecommenderDebugPayload = {
  baseline_profile_id: string;
  region_key: string;
  month: number;
  shared_condition_reliability: string;
  active_modifiers: string[];
  depth_lane_scores: Array<{ id: string; score: number }>;
  relation_scores: Array<{ id: string; score: number }>;
  archetype_scores: Array<{ archetype_id: string; score: number; reasons: string[] }>;
  family_scores: Array<{ family_id: string; gear_mode: RecommenderGearMode; score: number; reasons: string[] }>;
  confidence_reasons: string[];
};

export const RECOMMENDER_FEATURE = 'recommender_v1' as const;

export type RecommenderResponse = {
  feature: typeof RECOMMENDER_FEATURE;
  context: EngineContextKey;
  generated_at: string;
  cache_expires_at: string;
  shared_condition_summary: {
    reliability: 'high' | 'medium' | 'low';
    timing_strength?: string;
    highlighted_periods?: [boolean, boolean, boolean, boolean];
    drivers: Array<{ variable: string; label: string }>;
    suppressors: Array<{ variable: string; label: string }>;
  };
  fish_behavior: FishBehaviorOutput;
  presentation_archetypes: PresentationArchetypeScore[];
  lure_rankings: RankedFamily[];
  fly_rankings: RankedFamily[];
  confidence: RecommenderConfidence;
  debug?: RecommenderDebugPayload;
  inventory?: InventoryCompatibilityResult;
  narration_payload: {
    summary_seed: string;
    position_points: string[];
    behavior_points: string[];
    presentation_points: string[];
    confidence_note?: string | null;
  };
};

export const RECOMMENDER_HABITAT_OPTIONS: Record<EngineContextKey, Array<{ id: RefinementTag; label: string }>> = {
  freshwater_lake_pond: [
    { id: 'grass', label: 'Grass' },
    { id: 'wood', label: 'Wood' },
    { id: 'docks', label: 'Docks' },
    { id: 'rock', label: 'Rock' },
    { id: 'shade', label: 'Shade' },
    { id: 'breakline', label: 'Breakline' },
  ],
  freshwater_river: [
    { id: 'seam', label: 'Seam' },
    { id: 'eddy', label: 'Eddy' },
    { id: 'hole', label: 'Hole' },
    { id: 'riffle_run', label: 'Riffle / Run' },
    { id: 'undercut_bank', label: 'Undercut Bank' },
    { id: 'wood_boulder', label: 'Wood / Boulder' },
  ],
  coastal: [
    { id: 'channel_edge', label: 'Channel Edge' },
    { id: 'point', label: 'Point' },
    { id: 'current_seam', label: 'Current Seam' },
    { id: 'dock', label: 'Dock' },
    { id: 'shoreline_edge', label: 'Shoreline Edge' },
  ],
  coastal_flats_estuary: [
    { id: 'drain', label: 'Drain' },
    { id: 'grass_edge', label: 'Grass Edge' },
    { id: 'pothole', label: 'Pothole' },
    { id: 'trough', label: 'Trough' },
    { id: 'oyster', label: 'Oyster' },
    { id: 'marsh_edge', label: 'Marsh Edge' },
  ],
};
