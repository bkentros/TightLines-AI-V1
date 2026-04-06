/**
 * Core behavior and presentation output types for the recommender engine.
 */

export type ActivityLevel = "inactive" | "low" | "neutral" | "active" | "aggressive";
export type AggressionLevel = "passive" | "neutral" | "reactive" | "aggressive";
export type StrikeZone = "narrow" | "moderate" | "wide";
export type ChaseRadius = "short" | "moderate" | "long";
export type DepthLane = "surface" | "upper" | "mid" | "near_bottom" | "bottom";
export type SpeedPreference = "dead_slow" | "slow" | "moderate" | "fast" | "vary";
export type NoiseLevel = "silent" | "subtle" | "moderate" | "loud";
export type FlashLevel = "none" | "subtle" | "moderate" | "heavy";
export type ProfileSize = "slim" | "medium" | "bulky";
export type TriggerType = "finesse" | "reaction" | "natural_match" | "aggressive";
export type CoverClass =
  | "vegetation"
  | "wood"
  | "rock"
  | "current_seam"
  | "open_water"
  | "hard_structure"
  | "flats"
  | "bottom";
export type FlowSuitability = "poor" | "capable" | "strong";
export type SeasonalFlag =
  | "pre_spawn"
  | "spawning"
  | "post_spawn"
  | "peak_season"
  | "off_season";

export type ForageMode =
  | "baitfish"
  | "shrimp"
  | "crab"
  | "crawfish"
  | "leech"
  | "surface_prey"
  | "mixed";

export type ColorFamily =
  | "natural_match"     // clear water, match forage color
  | "shad_silver"       // baitfish mode, clear-to-moderate water
  | "chartreuse_white"  // high vis, stained/dirty, reaction strikes
  | "gold_amber"        // stained water, crawfish/warm tones
  | "dark_silhouette"   // low light (black, purple, dark blue)
  | "craw_pattern"      // crawfish mode (brown, orange, green pumpkin)
  | "shrimp_tan"        // shrimp forage (tan, pink, white)
  | "crab_olive"        // crab forage (olive, brown, tan)
  | "flash_heavy";      // deep or dirty water, spoon-dominant flash

export type MotionType =
  | "steady"
  | "hop"
  | "twitch_pause"
  | "rip"
  | "sweep"
  | "walk"
  | "pop"
  | "drag"
  | "swing";

export type CurrentTechnique =
  | "uptide_cast"
  | "cross_current"
  | "downstream_drift"
  | "static";

// ─── Behavior Output ──────────────────────────────────────────────────────────

/** One labeled row in the recommender “fish behavior” card (water / forage / speed). */
export type BehaviorSummaryRow = {
  label: string;
  detail: string;
};

export type BehaviorOutput = {
  activity: ActivityLevel;
  aggression: AggressionLevel;
  strike_zone: StrikeZone;
  chase_radius: ChaseRadius;
  depth_lane: DepthLane;
  habitat_tags: string[];
  forage_mode: ForageMode;
  secondary_forage?: ForageMode;
  topwater_viable: boolean;
  speed_preference: SpeedPreference;
  noise_preference: NoiseLevel;
  flash_preference: FlashLevel;
  /** Three short rows: water column, forage, retrieve speed. */
  behavior_summary: [BehaviorSummaryRow, BehaviorSummaryRow, BehaviorSummaryRow];
  tidal_note?: string;
  seasonal_flag?: SeasonalFlag;
};

// ─── Presentation Output ──────────────────────────────────────────────────────

export type PresentationOutput = {
  depth_target: DepthLane;
  speed: SpeedPreference;
  motion: MotionType;
  trigger_type: TriggerType;
  noise: NoiseLevel;
  flash: FlashLevel;
  profile: ProfileSize;
  color_family: ColorFamily;
  topwater_viable: boolean;
  current_technique?: CurrentTechnique;
};
