import type {
  EngineContext,
  RegionKey,
  SharedEngineRequest,
} from "../howFishingEngine/contracts/mod.ts";

export type RecommenderGearMode = "lure" | "fly";

export type WaterClarity = "clear" | "stained" | "dirty";

export type RecommenderRefinements = {
  water_clarity?: WaterClarity;
};

export type RecommenderRequest = {
  latitude: number;
  longitude: number;
  context: EngineContext;
  env_data: Record<string, unknown>;
  refinements?: RecommenderRefinements;
  inventory_items?: TackleBoxItem[];
};

export type DepthLaneId =
  | "very_shallow"
  | "shallow"
  | "mid_depth"
  | "deep"
  | "suspended"
  | "bottom_oriented"
  | "upper_column"
  | "lower_column";

export type RelationTagId =
  | "cover_oriented"
  | "vegetation_oriented"
  | "edge_oriented"
  | "structure_oriented"
  | "current_break_oriented"
  | "channel_related"
  | "flats_related"
  | "shoreline_cruising"
  | "open_water_roaming"
  | "shade_oriented"
  | "depth_transition_oriented"
  | "undercut_bank_oriented"
  | "hole_oriented"
  | "seam_oriented"
  | "point_oriented"
  | "drain_oriented"
  | "grass_edge_oriented"
  | "pothole_oriented"
  | "trough_oriented"
  | "oyster_bar_oriented"
  | "marsh_edge_oriented";

export type ActivityState = "inactive" | "neutral" | "active" | "aggressive";
export type StrikeZoneState = "narrow" | "moderate" | "wide";
export type ChaseRadiusState = "short" | "moderate" | "long";

export type PresentationDepthTarget =
  | "surface"
  | "upper_column"
  | "mid_column"
  | "near_bottom"
  | "bottom_contact";

export type PresentationSpeed =
  | "dead_slow"
  | "slow"
  | "moderate"
  | "fast";

export type PresentationMotion =
  | "subtle"
  | "steady"
  | "erratic"
  | "twitch_pause"
  | "hopping"
  | "dragging"
  | "sweeping"
  | "straight_retrieve"
  | "walk_pause"
  | "pop_pause"
  | "drift_natural";

export type PresentationTrigger =
  | "reaction"
  | "finesse"
  | "natural_match"
  | "vibration"
  | "visibility"
  | "current_drift"
  | "bottom_contact"
  | "commotion"
  | "silhouette"
  | "flash";

export type PresentationArchetypeId =
  | "subtle_shallow_cover"
  | "slow_bottom_contact"
  | "horizontal_search_mid_column"
  | "surface_low_light_commotion"
  | "current_seam_drift"
  | "drain_edge_intercept"
  | "grass_edge_swim"
  | "depth_break_suspend_pause"
  | "open_flats_cruise_intercept"
  | "tight_to_cover_vertical";

export type ScoredId<T extends string> = { id: T; score: number };

export type FishBehaviorOutput = {
  baseline_profile_id: string;
  position: {
    depth_lanes: Array<ScoredId<DepthLaneId>>;
    relation_tags: Array<ScoredId<RelationTagId>>;
  };
  behavior: {
    activity: ActivityState;
    style_flags: string[];
    strike_zone: StrikeZoneState;
    chase_radius: ChaseRadiusState;
  };
  forage: {
    baitfish_bias: number;
    crustacean_bias: number;
    insect_bias: number;
    amphibian_surface_bias?: number;
  };
};

export type PresentationArchetypeScore = {
  archetype_id: PresentationArchetypeId;
  score: number;
  reasons: string[];
  depth_target: PresentationDepthTarget;
  speed: PresentationSpeed;
  motions: PresentationMotion[];
  triggers: PresentationTrigger[];
};

export type FamilyDefinition = {
  id: string;
  display_name: string;
  gear_mode: RecommenderGearMode;
  supported_contexts: EngineContext[];
  preferred_regions?: RegionKey[];
  preferred_month_groups?: string[];
  habitat_tags: string[];
  vegetation_affinity: "low" | "medium" | "high";
  clarity_fit: WaterClarity[];
  activity_fit: ActivityState[];
  strike_zone_fit: StrikeZoneState[];
  depth_lane_fit: DepthLaneId[];
  relation_fit: RelationTagId[];
  forage_fit: string[];
  light_fit: string[];
  daypart_fit: string[];
  speed_fit: PresentationSpeed[];
  motion_fit: PresentationMotion[];
  trigger_fit: PresentationTrigger[];
  presentation_archetype_fit: PresentationArchetypeId[];
  vibration_level?: "subtle" | "medium" | "strong";
  silhouette?: "slim" | "medium" | "bulky";
  weedless_level?: "low" | "medium" | "high";
  current_suitability?: "low" | "medium" | "high";
  best_use_cases: string[];
  depriors: string[];
  example_names: string[];
  how_to_fish: string[];
};

export type FamilyMethodDefinition = {
  id: string;
  label: string;
  presentation_note: string;
  setup_label?: string;
  preferred_month_groups?: string[];
  depth_lane_fit?: DepthLaneId[];
  activity_fit?: ActivityState[];
  clarity_fit?: WaterClarity[];
  archetype_fit?: PresentationArchetypeId[];
  style_flags?: string[];
};

export type SimplifiedPresentationPace = "slow" | "medium" | "fast";

export type SimplifiedPresentationLane = "upper" | "mid" | "lower" | "bottom";

export type SimplifiedPresentationAction =
  | "steady"
  | "pause-heavy"
  | "subtle twitch"
  | "bottom contact"
  | "natural drift"
  | "surface commotion";

export type SimplifiedPresentationGuide = {
  pace: SimplifiedPresentationPace;
  lane: SimplifiedPresentationLane;
  action: SimplifiedPresentationAction;
  summary: string;
};

export type RankedFamilyMethod = {
  method_id: string;
  label: string;
  presentation_note: string;
  setup_label: string;
  presentation_guide: SimplifiedPresentationGuide;
  reasons: string[];
};

export type RankedFamily = {
  family_id: string;
  display_name: string;
  score: number;
  examples: string[];
  match_reasons: string[];
  best_method: RankedFamilyMethod;
  color_profile_guidance?: string[];
  how_to_fish: string[];
  best_dayparts: string[];
};

export type RecommenderConfidence = {
  behavior_confidence: "high" | "medium" | "low";
  presentation_confidence: "high" | "medium" | "low";
  family_confidence: "high" | "medium" | "low";
  reasons: string[];
};

export type TackleBoxItem = {
  id: string;
  label: string;
  gear_mode: RecommenderGearMode;
  primary_family_id: string;
  compatible_family_ids?: string[];
  presentation_tags: string[];
  motion_tags: string[];
  depth_tags: string[];
  size_class?: "small" | "medium" | "large";
  color_profile?: string;
  vibration_level?: "subtle" | "medium" | "strong";
  weedless_level?: "low" | "medium" | "high";
  active: boolean;
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
  region_key: RegionKey;
  month: number;
  shared_condition_reliability: string;
  seasonal_basis: string[];
  daily_adjustments: string[];
  clarity_adjustments: string[];
  active_modifiers: string[];
  depth_lane_scores: Array<ScoredId<DepthLaneId>>;
  relation_scores: Array<ScoredId<RelationTagId>>;
  archetype_scores: Array<{
    archetype_id: PresentationArchetypeId;
    score: number;
    reasons: string[];
  }>;
  family_scores: Array<{
    family_id: string;
    gear_mode: RecommenderGearMode;
    score: number;
    seasonal_score: number;
    daily_score: number;
    clarity_score: number;
    best_method_id?: string;
    best_method_score?: number;
    reasons: string[];
  }>;
  method_scores: Array<{
    family_id: string;
    gear_mode: RecommenderGearMode;
    methods: Array<{
      method_id: string;
      score: number;
      reasons: string[];
    }>;
  }>;
  confidence_reasons: string[];
};

export const RECOMMENDER_FEATURE = "recommender_v1" as const;

export type RecommenderResponse = {
  feature: typeof RECOMMENDER_FEATURE;
  context: EngineContext;
  generated_at: string;
  cache_expires_at: string;
  shared_condition_summary: {
    reliability: "high" | "medium" | "low";
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
  polished: {
    track_kind: RecommenderGearMode;
    headline: string;
    where_insight: string;
    behavior_read: string;
    presentation_tip: string;
  } | null;
  narration_payload: {
    summary_seed: string;
    position_points: string[];
    behavior_points: string[];
    presentation_points: string[];
    confidence_note?: string | null;
  };
};

export type RecommenderRunInput = {
  request: SharedEngineRequest;
  refinements: RecommenderRefinements;
  inventory_items?: TackleBoxItem[];
};
