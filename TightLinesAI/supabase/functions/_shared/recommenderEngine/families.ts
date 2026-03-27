import type {
  FamilyDefinition,
  FamilyMethodDefinition,
  PresentationArchetypeScore,
  RankedFamily,
  RankedFamilyMethod,
  RecommenderGearMode,
  RecommenderRunInput,
  SimplifiedPresentationAction,
  SimplifiedPresentationGuide,
  SimplifiedPresentationLane,
  SimplifiedPresentationPace,
} from "./contracts.ts";
import type { RegionKey } from "../howFishingEngine/contracts/mod.ts";
import type { BehaviorResolution } from "./modifiers.ts";
import { uniq } from "./helpers.ts";

type FamilyScoreDebug = {
  family_id: string;
  gear_mode: RecommenderGearMode;
  score: number;
  seasonal_score: number;
  daily_score: number;
  clarity_score: number;
  best_method_id?: string;
  best_method_score?: number;
  reasons: string[];
};

type FamilyMethodScoreDebug = {
  family_id: string;
  gear_mode: RecommenderGearMode;
  methods: Array<{
    method_id: string;
    score: number;
    reasons: string[];
  }>;
};

export type FamilyRankingResult = {
  ranked: RankedFamily[];
  debug_scores: FamilyScoreDebug[];
  method_scores: FamilyMethodScoreDebug[];
};

const FAMILY_LIBRARY: FamilyDefinition[] = [
  {
    id: "soft_stick_worm",
    display_name: "Soft Stick Worm",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river"],
    preferred_month_groups: ["spring_transition", "warm_transition", "summer_pattern"],
    habitat_tags: ["cover", "docks", "shade", "grass"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["shallow", "upper_column"],
    relation_fit: ["cover_oriented", "vegetation_oriented", "shade_oriented"],
    forage_fit: ["baitfish", "worm_invertebrate", "amphibian"],
    depth_range_ft: { min: 1, max: 15 },
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["subtle", "twitch_pause"],
    trigger_fit: ["finesse", "natural_match"],
    presentation_archetype_fit: ["subtle_shallow_cover", "tight_to_cover_vertical"],
    silhouette: "medium",
    weedless_level: "high",
    best_use_cases: ["calm to lightly breezy cover fishing", "tight targets when fish will not move far"],
    depriors: ["dirty_water", "strong_current"],
    example_names: ["wacky-rig stick bait", "senko-style worm", "weightless stick worm"],
    how_to_fish: ["Skip or pitch it tight to cover and let it fall naturally.", "Pause on slack line before the next twitch."],
  },
  {
    id: "finesse_worm",
    display_name: "Finesse Worm",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river"],
    preferred_month_groups: ["winter_hold", "spring_transition", "late_fall", "summer_heat"],
    habitat_tags: ["breakline", "rock", "seam"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["inactive", "neutral"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["mid_depth", "bottom_oriented", "lower_column"],
    relation_fit: ["structure_oriented", "depth_transition_oriented", "seam_oriented"],
    forage_fit: ["crawfish", "worm_invertebrate", "insect"],
    depth_range_ft: { min: 1, max: 30 },
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["subtle", "dragging"],
    trigger_fit: ["finesse", "bottom_contact"],
    presentation_archetype_fit: ["slow_bottom_contact", "tight_to_cover_vertical"],
    silhouette: "slim",
    best_use_cases: ["post-front fish", "bright skies", "tight strike zones"],
    depriors: ["wide_strike_zone"],
    example_names: ["shaky-head worm", "finesse worm", "small straight-tail worm"],
    how_to_fish: ["Keep it near bottom with small drags and pauses.", "Let the worm sit before moving it again."],
  },
  {
    id: "jig_trailer",
    display_name: "Jig + Trailer",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river"],
    preferred_month_groups: ["winter_hold", "spring_transition", "late_fall", "summer_heat"],
    habitat_tags: ["wood", "rock", "shade", "breakline"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained", "dirty"],
    activity_fit: ["inactive", "neutral", "active"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["mid_depth", "deep", "bottom_oriented"],
    relation_fit: ["cover_oriented", "structure_oriented", "depth_transition_oriented"],
    forage_fit: ["crawfish", "baitfish"],  // crawfish is the #1 jig forage cue; coastal crustacean is separate
    depth_range_ft: { min: 1, max: 40 }, // jig + weight = unlimited depth
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["hopping", "dragging"],
    trigger_fit: ["bottom_contact", "finesse"],
    presentation_archetype_fit: ["slow_bottom_contact", "tight_to_cover_vertical"],
    silhouette: "bulky",
    weedless_level: "high",
    best_use_cases: ["isolated cover", "bottom-oriented fish", "cool water"],
    depriors: ["surface_window"],
    example_names: ["flipping jig", "football jig", "swim jig worked slow"],
    how_to_fish: ["Work it slowly through the highest-percentage cover.", "Let it contact bottom or the cover before the next hop."],
  },
  {
    id: "paddle_tail_swimbait",
    display_name: "Paddle Tail Swimbait",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed", "baitfish_push"],
    habitat_tags: ["edge", "grass_edge", "point", "channel_edge"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
    relation_fit: ["edge_oriented", "point_oriented", "channel_related", "grass_edge_oriented"],
    forage_fit: ["baitfish"],
    depth_range_ft: { min: 2, max: 20 },
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Dawn", "Morning", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "straight_retrieve"],
    trigger_fit: ["reaction", "flash", "visibility"],
    presentation_archetype_fit: ["horizontal_search_mid_column", "grass_edge_swim", "open_flats_cruise_intercept"],
    silhouette: "slim",
    current_suitability: "medium",
    best_use_cases: ["baitfish-focused periods", "windy edges", "active fish"],
    depriors: ["tight_cover_bright"],
    example_names: ["paddle-tail swimbait", "boot-tail minnow", "small swimbait on jighead"],
    how_to_fish: ["Match the depth lane and keep the tail moving steadily.", "Speed up only if fish look willing to chase."],
  },
  {
    id: "spinnerbait",
    display_name: "Spinnerbait",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond"],
    preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
    habitat_tags: ["wood", "grass", "wind"],
    vegetation_affinity: "medium",
    clarity_fit: ["stained", "dirty"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "upper_column"],
    relation_fit: ["cover_oriented", "vegetation_oriented", "edge_oriented"],
    forage_fit: ["baitfish"],
    depth_range_ft: { min: 1, max: 8 }, // blade needs to spin — max effective depth limited
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Morning", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "straight_retrieve"],
    trigger_fit: ["vibration", "flash", "reaction"],
    presentation_archetype_fit: ["grass_edge_swim", "horizontal_search_mid_column"],
    vibration_level: "strong",
    weedless_level: "medium",
    best_use_cases: ["windy stained-water search", "shallow cover lanes"],
    depriors: ["clear_flat_calm"],
    example_names: ["single-color spinnerbait", "double willow spinnerbait", "Colorado blade spinnerbait"],
    how_to_fish: ["Keep it just above the cover and bump targets when you can.", "Slow-roll it when visibility is low."],
  },
  {
    id: "chatterbait",
    display_name: "Bladed Jig",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond"],
    preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
    habitat_tags: ["grass", "wood", "wind"],
    vegetation_affinity: "high",
    clarity_fit: ["stained", "dirty"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth"],
    relation_fit: ["vegetation_oriented", "edge_oriented", "cover_oriented"],
    forage_fit: ["baitfish"],
    depth_range_ft: { min: 1, max: 8 }, // blade vibration requires active retrieve — limited effective depth
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Morning", "Evening"],
    speed_fit: ["moderate"],
    motion_fit: ["steady", "erratic"],
    trigger_fit: ["vibration", "reaction"],
    presentation_archetype_fit: ["grass_edge_swim", "horizontal_search_mid_column"],
    vibration_level: "strong",
    weedless_level: "medium",
    best_use_cases: ["grass-edge search work", "active fish in stained water"],
    depriors: ["cold_inactive"],
    example_names: ["bladed jig", "vibrating jig", "compact bladed jig"],
    how_to_fish: ["Rip it free when it hits grass or cover.", "Keep the retrieve steady enough to keep the blade working."],
  },
  {
    id: "jerkbait",
    display_name: "Jerkbait",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "coastal"],
    preferred_month_groups: ["winter_hold", "spring_transition", "fall_feed"],
    habitat_tags: ["breakline", "point", "channel_edge"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["mid_depth", "suspended", "upper_column"],
    relation_fit: ["depth_transition_oriented", "point_oriented", "channel_related"],
    forage_fit: ["baitfish"],
    depth_range_ft: { min: 2, max: 10 }, // model-dependent; most suspend 2-8 ft, deep divers to ~10
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["twitch_pause", "erratic"],
    trigger_fit: ["reaction", "flash"],
    presentation_archetype_fit: ["depth_break_suspend_pause", "horizontal_search_mid_column"],
    silhouette: "slim",
    best_use_cases: ["suspended fish", "clearer water", "cool-to-mild conditions"],
    depriors: ["dirty_water"],
    example_names: ["suspending jerkbait", "soft jerk shad", "glide-style minnow bait"],
    how_to_fish: ["Twitch it down and let the pause do the work.", "Lengthen the pause when fish are not moving far."],
  },
  {
    id: "topwater_walker_popper",
    display_name: "Topwater Walker / Popper",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["warm_transition", "summer_pattern", "summer_heat", "topwater_window", "fall_feed"],
    habitat_tags: ["shoreline", "grass_edge", "point"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["very_shallow", "upper_column"],
    relation_fit: ["shoreline_cruising", "edge_oriented", "grass_edge_oriented", "marsh_edge_oriented"],
    forage_fit: ["baitfish", "amphibian"],
    depth_range_ft: { min: 0, max: 1 }, // surface only — fish must be willing to come up
    light_fit: ["low_light", "mixed"],
    daypart_fit: ["Dawn", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["walk_pause", "pop_pause"],
    trigger_fit: ["commotion", "silhouette"],
    presentation_archetype_fit: ["surface_low_light_commotion"],
    best_use_cases: ["low-light feeding windows", "shallow ambush lanes"],
    depriors: ["bright_midday", "cold_inactive"],
    example_names: ["walking bait", "popper", "pencil-style topwater"],
    how_to_fish: ["Keep it over the shallowest active lane you can reach.", "Pause beside edges and let the fish commit."],
  },
  {
    id: "frog_toad",
    display_name: "Frog / Toad",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond"],
    preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window"],
    habitat_tags: ["grass", "mats", "shade"],
    vegetation_affinity: "high",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["very_shallow", "upper_column"],
    relation_fit: ["vegetation_oriented", "cover_oriented", "shade_oriented"],
    forage_fit: ["amphibian"],
    depth_range_ft: { min: 0, max: 1 }, // surface only — designed specifically for heavy cover/mat fishing
    light_fit: ["low_light", "mixed"],
    daypart_fit: ["Dawn", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["walk_pause", "steady"],
    trigger_fit: ["commotion", "silhouette"],
    presentation_archetype_fit: ["surface_low_light_commotion", "grass_edge_swim"],
    weedless_level: "high",
    best_use_cases: ["thick vegetation", "summer frog windows", "shallow cover"],
    depriors: ["open_clear_water"],
    example_names: ["hollow-body frog", "buzz toad", "soft toad"],
    how_to_fish: ["Run it across the heaviest shallow cover you have.", "Pause it around holes or edges before moving again."],
  },
  {
    id: "crankbait_shallow_mid",
    display_name: "Crankbait",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river"],
    preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed", "late_fall"],
    habitat_tags: ["rock", "point", "breakline"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth"],
    relation_fit: ["point_oriented", "depth_transition_oriented", "structure_oriented"],
    forage_fit: ["baitfish", "crawfish"],  // crawfish color = squarebill on rock; baitfish = shad crank
    depth_range_ft: { min: 1, max: 12 }, // squarebill 1-5 ft; medium diver 5-12 ft
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["moderate", "fast"],
    motion_fit: ["steady", "erratic"],
    trigger_fit: ["reaction", "flash", "vibration"],
    presentation_archetype_fit: ["horizontal_search_mid_column"],
    best_use_cases: ["covering water", "windy points", "active fish on hard edges"],
    depriors: ["inactive_bottom"],
    example_names: ["squarebill crankbait", "medium diver", "flat-sided crankbait"],
    how_to_fish: ["Crash it into the edge or hard cover when possible.", "Use steady speed until fish tell you to pause more."],
  },
  {
    id: "inline_spinner",
    display_name: "Inline Spinner",
    gear_mode: "lure",
    supported_contexts: ["freshwater_river"],
    preferred_month_groups: ["spring_transition", "warm_transition", "summer_pattern", "fall_feed"],
    habitat_tags: ["seam", "current_break", "bank", "riffle"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active", "aggressive"],
    depth_range_ft: { min: 1, max: 5 }, // blade needs speed to spin — most effective 1-5 ft in current
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
    relation_fit: ["seam_oriented", "current_break_oriented", "undercut_bank_oriented", "structure_oriented"],
    forage_fit: ["baitfish", "insect", "worm_invertebrate"],
    light_fit: ["bright", "mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "straight_retrieve", "sweeping"],
    trigger_fit: ["flash", "vibration", "reaction", "current_drift"],
    presentation_archetype_fit: ["current_seam_drift", "horizontal_search_mid_column"],
    vibration_level: "medium",
    silhouette: "slim",
    current_suitability: "high",
    best_use_cases: ["classic river runs and seams", "active fish in wadable water", "covering river water without getting too niche"],
    depriors: ["dirty_water"],
    example_names: ["inline spinner", "in-line blade", "small river spinner"],
    how_to_fish: ["Cast quartering across current and let it swing through the seam.", "Keep the blade turning without overpowering the drift."],
  },
  {
    id: "compact_spoon",
    display_name: "Compact Spoon",
    gear_mode: "lure",
    supported_contexts: ["freshwater_river"],
    preferred_month_groups: ["winter_hold", "spring_transition", "fall_feed", "late_fall"],
    habitat_tags: ["seam", "hole", "tailout", "current_break"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained", "dirty"],
    activity_fit: ["neutral", "active"],
    depth_range_ft: { min: 1, max: 20 }, // can flutter deep on a slow swing or lift-drop
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["mid_depth", "lower_column", "suspended"],
    relation_fit: ["seam_oriented", "current_break_oriented", "hole_oriented", "depth_transition_oriented"],
    forage_fit: ["baitfish"],
    light_fit: ["bright", "mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "twitch_pause", "sweeping"],
    trigger_fit: ["flash", "reaction", "visibility", "current_drift"],
    presentation_archetype_fit: ["current_seam_drift", "depth_break_suspend_pause", "horizontal_search_mid_column"],
    silhouette: "slim",
    current_suitability: "high",
    best_use_cases: ["deeper current lanes", "cold-to-cool river windows", "fish that will react to flash before bulk"],
    depriors: ["surface_window"],
    example_names: ["compact spoon", "casting spoon", "little river spoon"],
    how_to_fish: ["Let it get into the lane first, then swing or flutter it through the softer current.", "Keep the cadence compact so it stays in the fishable water longer."],
  },
  {
    id: "shrimp_imitation",
    display_name: "Shrimp Imitation",
    gear_mode: "lure",
    supported_contexts: ["coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["all_year"],
    habitat_tags: ["drain", "grass_edge", "oyster", "channel_edge"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained", "dirty"],
    activity_fit: ["inactive", "neutral", "active"],
    depth_range_ft: { min: 1, max: 8 },
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["shallow", "lower_column", "bottom_oriented"],
    relation_fit: ["drain_oriented", "grass_edge_oriented", "oyster_bar_oriented", "channel_related"],
    forage_fit: ["crustacean"],
    light_fit: ["bright", "mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["twitch_pause", "hopping"],
    trigger_fit: ["natural_match", "visibility"],
    presentation_archetype_fit: ["drain_edge_intercept", "open_flats_cruise_intercept"],
    best_use_cases: ["shrimp-focused flats or inshore periods", "clean edges around moving water"],
    depriors: ["fast_open_search"],
    example_names: ["soft shrimp bait", "weighted shrimp lure", "shrimp under cork"],
    how_to_fish: ["Use short hops or twitches and let it fall back naturally.", "Keep it in the lane the tide is using."],
  },
  {
    id: "jighead_minnow",
    display_name: "Jighead Minnow",
    gear_mode: "lure",
    supported_contexts: ["coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed", "baitfish_push"],
    habitat_tags: ["channel_edge", "point", "drain"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active", "aggressive"],
    depth_range_ft: { min: 1, max: 15 },
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth", "lower_column"],
    relation_fit: ["channel_related", "point_oriented", "drain_oriented", "current_break_oriented"],
    forage_fit: ["baitfish"],
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Dawn", "Morning", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "twitch_pause"],
    trigger_fit: ["reaction", "flash", "visibility"],
    presentation_archetype_fit: ["horizontal_search_mid_column", "drain_edge_intercept", "open_flats_cruise_intercept"],
    current_suitability: "high",
    best_use_cases: ["moving baitfish", "current edges", "open but defined lanes"],
    depriors: ["heavy_cover_mat"],
    example_names: ["soft jerk shad on jighead", "jighead minnow", "paddle tail on jighead"],
    how_to_fish: ["Swim it just fast enough to stay above the bottom or shell.", "Use pauses when fish are following instead of crushing it."],
  },
  {
    id: "popping_cork_trailer",
    display_name: "Popping Cork + Trailer",
    gear_mode: "lure",
    supported_contexts: ["coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
    habitat_tags: ["grass_edge", "drain", "shoreline"],
    vegetation_affinity: "medium",
    clarity_fit: ["stained", "dirty"],
    activity_fit: ["active", "aggressive"],
    depth_range_ft: { min: 0, max: 4 }, // float system limits depth; trailer hangs 18-24 in below cork
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "upper_column"],
    relation_fit: ["grass_edge_oriented", "drain_oriented", "shoreline_cruising"],
    forage_fit: ["crustacean", "baitfish"],
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Morning", "Evening"],
    speed_fit: ["moderate"],
    motion_fit: ["pop_pause", "steady"],
    trigger_fit: ["commotion", "visibility"],
    presentation_archetype_fit: ["surface_low_light_commotion", "open_flats_cruise_intercept"],
    best_use_cases: ["shallow dirty water", "aggressive fish", "windy flats"],
    depriors: ["slick_calm_clear"],
    example_names: ["popping cork with shrimp trailer", "rattling cork rig", "cork and soft plastic"],
    how_to_fish: ["Pop it just enough to call fish, then let the trailer settle.", "Stay around active edges instead of dead water."],
  },
  {
    id: "weighted_bottom_presentation",
    display_name: "Weighted Bottom Presentation",
    gear_mode: "lure",
    supported_contexts: ["coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["winter_hold", "summer_heat", "late_fall"],
    habitat_tags: ["channel_edge", "oyster", "trough", "point"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained", "dirty"],
    activity_fit: ["inactive", "neutral"],
    depth_range_ft: { min: 2, max: 25 },
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["lower_column", "bottom_oriented"],
    relation_fit: ["channel_related", "oyster_bar_oriented", "trough_oriented", "point_oriented"],
    forage_fit: ["crustacean", "baitfish"],
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["dragging", "hopping"],
    trigger_fit: ["bottom_contact", "finesse"],
    presentation_archetype_fit: ["slow_bottom_contact", "drain_edge_intercept"],
    current_suitability: "high",
    best_use_cases: ["bottom-hugging fish", "heavier tide lanes", "post-front coastal days"],
    depriors: ["surface_feed"],
    example_names: ["bottom jig", "weighted paddletail crawled slow", "shrimp jig near bottom"],
    how_to_fish: ["Stay in contact with the lower lane without dragging too fast.", "Lift it just enough to keep the presentation alive."],
  },
  {
    id: "weighted_streamer",
    display_name: "Weighted Streamer",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river", "freshwater_lake_pond", "coastal"],
    preferred_month_groups: ["winter_hold", "spring_transition", "fall_feed"],
    habitat_tags: ["seam", "breakline", "channel_edge"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active"],
    depth_range_ft: { min: 2, max: 20 },
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["mid_depth", "lower_column", "suspended"],
    relation_fit: ["seam_oriented", "depth_transition_oriented", "channel_related", "point_oriented"],
    forage_fit: ["baitfish"],
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["twitch_pause", "sweeping"],
    trigger_fit: ["reaction", "flash", "current_drift"],
    presentation_archetype_fit: ["depth_break_suspend_pause", "current_seam_drift"],
    current_suitability: "high",
    best_use_cases: ["deeper lanes", "suspended fish", "current edges"],
    depriors: ["surface_window"],
    example_names: ["clouser-style streamer", "weighted baitfish streamer", "heavy sculpin streamer"],
    how_to_fish: ["Let it sink into the right lane before stripping.", "Mix short strips with pauses or swings."],
  },
  {
    id: "baitfish_streamer",
    display_name: "Baitfish Streamer",
    gear_mode: "fly",
    supported_contexts: ["freshwater_lake_pond", "coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed", "baitfish_push"],
    habitat_tags: ["edge", "point", "grass_edge", "channel_edge"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    depth_range_ft: { min: 1, max: 10 },
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
    relation_fit: ["edge_oriented", "point_oriented", "grass_edge_oriented", "channel_related"],
    forage_fit: ["baitfish"],
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Dawn", "Morning", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "twitch_pause"],
    trigger_fit: ["reaction", "flash", "natural_match"],
    presentation_archetype_fit: ["horizontal_search_mid_column", "open_flats_cruise_intercept"],
    best_use_cases: ["baitfish-heavy periods", "cruising fish", "windy edges"],
    depriors: ["bottom_locked"],
    example_names: ["deceiver-style fly", "EP baitfish fly", "hollow fleye"],
    how_to_fish: ["Strip it across the lane at the speed the fish can handle.", "Pause when fish trail without committing."],
  },
  {
    id: "woolly_bugger_leech",
    display_name: "Bugger / Leech Fly",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river", "freshwater_lake_pond"],
    preferred_month_groups: ["all_year"],
    habitat_tags: ["seam", "rock", "weed"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained", "dirty"],
    activity_fit: ["inactive", "neutral", "active"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["mid_depth", "lower_column", "upper_column"],
    relation_fit: ["seam_oriented", "structure_oriented", "vegetation_oriented"],
    forage_fit: ["insect", "baitfish", "crawfish", "worm_invertebrate"], // woolly bugger imitates all of these
    depth_range_ft: { min: 1, max: 15 },
    light_fit: ["bright", "mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["steady", "sweeping"],
    trigger_fit: ["natural_match", "reaction"],
    presentation_archetype_fit: ["current_seam_drift", "horizontal_search_mid_column"],
    best_use_cases: ["versatile freshwater search", "mixed activity levels", "stained water"],
    depriors: [],
    example_names: ["woolly bugger", "balanced leech", "mini streamer leech"],
    how_to_fish: ["Swing it, strip it, or dead-drift it depending on fish position.", "Keep the fly in the lane longer before changing speed."],
  },
  {
    id: "popper_surface_bug",
    display_name: "Popper / Surface Bug",
    gear_mode: "fly",
    supported_contexts: ["freshwater_lake_pond", "coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window"],
    habitat_tags: ["grass_edge", "shoreline", "marsh_edge"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    depth_range_ft: { min: 0, max: 1 }, // surface only
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["very_shallow", "upper_column"],
    relation_fit: ["shoreline_cruising", "grass_edge_oriented", "marsh_edge_oriented"],
    forage_fit: ["baitfish", "amphibian"],
    light_fit: ["low_light", "mixed"],
    daypart_fit: ["Dawn", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["pop_pause", "walk_pause"],
    trigger_fit: ["commotion", "silhouette"],
    presentation_archetype_fit: ["surface_low_light_commotion"],
    best_use_cases: ["surface windows", "shallow edge cruisers", "summer low light"],
    depriors: ["bright_midday"],
    example_names: ["foam popper", "gurgler", "surface slider"],
    how_to_fish: ["Pop it or slide it with deliberate pauses.", "Leave it still after the disturbance if fish are tracking it."],
  },
  {
    id: "nymph_rig",
    display_name: "Nymph Rig",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river", "freshwater_lake_pond"],
    // Nymphing is the most productive fly fishing technique year-round — 80% of trout feed subsurface
    // even during hatches. All_year reflects biological reality; style flags gate it vs dry flies.
    preferred_month_groups: ["all_year"],
    habitat_tags: ["seam", "riffle_run", "hole"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["inactive", "neutral", "active"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["lower_column", "bottom_oriented", "mid_depth"],
    relation_fit: ["seam_oriented", "hole_oriented", "current_break_oriented", "riffle_oriented", "pool_oriented", "depth_transition_oriented", "structure_oriented", "edge_oriented"],
    forage_fit: ["insect", "worm_invertebrate"],
    depth_range_ft: { min: 1, max: 12 }, // indicator depth limits; euro nymphing can go deeper
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["drift_natural"],
    trigger_fit: ["natural_match", "current_drift"],
    presentation_archetype_fit: ["current_seam_drift", "slow_bottom_contact"],
    best_use_cases: ["cold or neutral fish", "river soft seams", "bottom-oriented trout-like setups"],
    depriors: ["surface_window", "dirty_water_fast_search"],
    example_names: ["two-fly nymph rig", "beadhead nymph", "euro nymph pair"],
    how_to_fish: ["Dead-drift it as naturally as you can near the lower lane.", "Adjust weight before changing flies if you are not getting down."],
  },
  {
    id: "dry_emerger",
    display_name: "Dry / Emerger",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river", "freshwater_lake_pond"],
    // Spring BWO and caddis hatches are some of the best dry fly fishing of the year
    preferred_month_groups: ["spring_transition", "warm_transition", "summer_pattern"],
    habitat_tags: ["riffle_run", "shoreline", "shade"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    depth_range_ft: { min: 0, max: 1 }, // surface only
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["very_shallow", "upper_column"],
    relation_fit: ["shoreline_cruising", "edge_oriented", "shade_oriented"],
    forage_fit: ["insect"],
    light_fit: ["low_light", "mixed"],
    daypart_fit: ["Morning", "Evening"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["drift_natural"],
    trigger_fit: ["natural_match", "silhouette"],
    presentation_archetype_fit: ["surface_low_light_commotion", "subtle_shallow_cover"],
    best_use_cases: ["fish looking up", "soft surface feeding lanes", "gentle low-light windows"],
    depriors: ["dirty_water", "deep_bottom_fish"],
    example_names: ["mayfly emerger", "small caddis dry", "film-riding dry fly"],
    how_to_fish: ["Prioritize a clean dead drift over pattern changes.", "Keep the drift in softer surface lanes instead of fast broken water."],
  },
  {
    id: "terrestrial_hopper",
    display_name: "Terrestrial / Hopper",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river", "freshwater_lake_pond"],
    // Warm_transition: early beetles and ants start falling in late spring/early summer
    preferred_month_groups: ["warm_transition", "summer_pattern", "summer_heat"],
    habitat_tags: ["bank", "grass", "shade"],
    depth_range_ft: { min: 0, max: 1 }, // surface only
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["very_shallow", "upper_column"],
    relation_fit: ["shoreline_cruising", "vegetation_oriented", "shade_oriented"],
    forage_fit: ["insect"],
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Morning", "Evening"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["drift_natural"],
    trigger_fit: ["natural_match", "silhouette"],
    presentation_archetype_fit: ["surface_low_light_commotion", "subtle_shallow_cover"],
    best_use_cases: ["summer bank-focused fish", "grass-lined edges", "surface opportunists"],
    depriors: ["deep_structure"],
    example_names: ["hopper fly", "beetle pattern", "foam terrestrial"],
    how_to_fish: ["Land it close to the edge and let it sit.", "Only twitch it if fish are tracking but not eating."],
  },
  {
    id: "shrimp_fly",
    display_name: "Shrimp Fly",
    gear_mode: "fly",
    supported_contexts: ["coastal", "coastal_flats_estuary"],
    preferred_month_groups: ["all_year"],
    habitat_tags: ["drain", "grass_edge", "shoreline"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["inactive", "neutral", "active"],
    depth_range_ft: { min: 1, max: 6 },
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["shallow", "lower_column"],
    relation_fit: ["drain_oriented", "grass_edge_oriented", "shoreline_cruising", "channel_related"],
    forage_fit: ["crustacean"],
    light_fit: ["bright", "mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["twitch_pause", "drift_natural"],
    trigger_fit: ["natural_match", "visibility"],
    presentation_archetype_fit: ["drain_edge_intercept", "open_flats_cruise_intercept"],
    best_use_cases: ["shrimp-focused flats", "clean tide lanes", "subtle eats"],
    depriors: ["fast_surface_commotion"],
    example_names: ["shrimp fly", "EP shrimp", "lightly weighted shrimp pattern"],
    how_to_fish: ["Lead the fish and keep the strip short.", "Let the fly settle after each movement."],
  },
  {
    id: "crab_fly",
    display_name: "Crab Fly",
    gear_mode: "fly",
    supported_contexts: ["coastal_flats_estuary"],
    preferred_month_groups: ["all_year"],
    habitat_tags: ["oyster", "pothole", "trough"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["inactive", "neutral"],
    depth_range_ft: { min: 1, max: 4 }, // flats fishing is by nature shallow
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["shallow", "bottom_oriented"],
    relation_fit: ["oyster_bar_oriented", "pothole_oriented", "trough_oriented"],
    forage_fit: ["crustacean"],
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["subtle", "hopping"],
    trigger_fit: ["natural_match", "bottom_contact"],
    presentation_archetype_fit: ["slow_bottom_contact", "drain_edge_intercept"],
    best_use_cases: ["bottom-focused flats fish", "clear water", "precise shots"],
    depriors: ["dirty_windy_search"],
    example_names: ["small crab fly", "light crab pattern", "weighted crab imitation"],
    how_to_fish: ["Set it down in the fish’s path and barely move it.", "Use tiny hops instead of long strips."],
  },
  {
    id: "lipless_crankbait",
    display_name: "Lipless Crankbait",
    gear_mode: "lure",
    supported_contexts: ["freshwater_lake_pond"],
    preferred_month_groups: ["all_year"],
    habitat_tags: ["grass", "point", "breakline", "open_water"],
    vegetation_affinity: "high",
    clarity_fit: ["clear", "stained", "dirty"],
    activity_fit: ["neutral", "active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["mid_depth", "lower_column", "bottom_oriented"],
    relation_fit: ["vegetation_oriented", "depth_transition_oriented", "edge_oriented", "open_water_roaming"],
    forage_fit: ["baitfish", "crawfish"],
    depth_range_ft: { min: 1, max: 20 }, // yo-yo to surface; weight and retrieve speed control depth
    light_fit: ["bright", "mixed", "low_light"],
    daypart_fit: ["Morning", "Afternoon", "Evening"],
    speed_fit: ["dead_slow", "slow", "moderate"],
    motion_fit: ["steady", "erratic", "hopping"],
    trigger_fit: ["vibration", "reaction", "flash"],
    presentation_archetype_fit: ["horizontal_search_mid_column", "depth_break_suspend_pause"],
    vibration_level: "strong",
    silhouette: "medium",
    weedless_level: "low", // treble hooks — fish over grass, not through dense mats
    current_suitability: "low",
    best_use_cases: [
      "winter yo-yo over deep grass flats",
      "fall baitfish blitz — burn it through schooling fish",
      "spring pre-spawn over shallow grass",
    ],
    depriors: ["strong_current"],
    example_names: ["Rat-L-Trap", "Strike King Red Eye Shad", "Bill Lewis Rat-L-Trap 1/2 oz"],
    how_to_fish: [
      "In winter, let it sink to the grass and yo-yo it with long pauses — the flutter on the fall is the trigger.",
      "In fall, burn it steadily through baitfish schools; fish will tell you if they want a pause added.",
    ],
  },
  {
    id: "soft_hackle_wet_fly",
    display_name: "Soft Hackle / Wet Fly",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river"],
    // Downstream swing during caddis and mayfly emergence — a technique as old as fly fishing itself.
    // Fish intercept ascending nymphs and emergers in the upper column, not on the bottom.
    preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
    habitat_tags: ["seam", "tailout", "riffle", "run"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["upper_column", "mid_depth"],
    relation_fit: ["seam_oriented", "tailout_oriented", "riffle_oriented", "current_break_oriented"],
    forage_fit: ["insect"],
    depth_range_ft: { min: 0, max: 6 }, // swings in the top half of the column
    light_fit: ["mixed", "low_light"],
    daypart_fit: ["Morning", "Evening"],
    speed_fit: ["slow", "moderate"],
    motion_fit: ["sweeping", "drift_natural"],
    trigger_fit: ["natural_match", "current_drift", "silhouette"],
    presentation_archetype_fit: ["current_seam_drift", "surface_low_light_commotion"],
    current_suitability: "high",
    best_use_cases: [
      "caddis and mayfly emergence windows",
      "fish actively rising or intercepting in the upper column",
      "evening seam feeding when fish are not quite on top",
    ],
    depriors: ["dirty_water", "deep_bottom_fish"],
    example_names: ["partridge and orange", "hare’s ear soft hackle", "pheasant tail wet fly"],
    how_to_fish: [
      "Cast slightly across current and swing it downstream on a tight line through the upper column.",
      "Fish it in the top third of the water where ascending insects are most vulnerable.",
    ],
  },
  {
    id: "chironomid_stillwater",
    display_name: "Chironomid / Stillwater Midge",
    gear_mode: "fly",
    supported_contexts: ["freshwater_lake_pond"],
    // The dominant stillwater fly technique in the western US and Pacific Northwest.
    // Chironomids (midges) are the #1 food source in most trout lakes by biomass.
    // This presentation is fundamentally different from river nymphing — nearly motionless,
    // suspended at a precise depth, over drop-offs and weed edges.
    preferred_month_groups: ["all_year"],
    preferred_regions: ["pacific_northwest", "mountain_alpine", "inland_northwest", "great_lakes_upper_midwest", "northern_california"],
    habitat_tags: ["drop_off", "weed_edge", "shoal", "basin"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["inactive", "neutral"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["deep", "lower_column", "suspended", "mid_depth"],
    relation_fit: ["depth_transition_oriented", "structure_oriented", "edge_oriented", "vegetation_oriented"],
    forage_fit: ["insect"],
    depth_range_ft: { min: 4, max: 30 }, // indicator system can fish very deep
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow"],
    motion_fit: ["subtle"],
    trigger_fit: ["natural_match", "silhouette"],
    presentation_archetype_fit: ["depth_break_suspend_pause", "slow_bottom_contact"],
    best_use_cases: [
      "stillwater trout lakes over drop-offs and shoal edges",
      "suspended fish holding just below the thermocline",
      "slow deliberate takes that demand a precise depth presentation",
    ],
    depriors: ["fast_current", "dirty_water"],
    example_names: ["chironomid pupa under indicator", "midge pupa pattern", "bloodworm / bloodworm midge"],
    how_to_fish: [
      "Suspend it at the exact depth of the fish under an indicator and leave it nearly motionless.",
      "Set your indicator so the fly hangs just above the weed tops — depth matters more than pattern.",
    ],
  },
  {
    id: "egg_pattern",
    display_name: "Egg / Flesh Pattern",
    gear_mode: "fly",
    supported_contexts: ["freshwater_river"],
    // The defining fly for fall steelhead, Pacific salmon tributaries, and Great Lakes runs.
    // Eggs drift in the current column during spawning events — opportunistic trout and steelhead
    // sit in current breaks below holding fish and intercept the drift.
    preferred_month_groups: ["fall_feed", "late_fall", "winter_hold"],
    preferred_regions: ["pacific_northwest", "inland_northwest", "great_lakes_upper_midwest", "appalachian", "alaska"],
    habitat_tags: ["seam", "hole", "pool", "current_break"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained", "dirty"], // egg patterns are high-visibility; work in off-color water
    activity_fit: ["inactive", "neutral"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["lower_column", "bottom_oriented", "mid_depth"],
    relation_fit: ["seam_oriented", "hole_oriented", "pool_oriented", "current_break_oriented"],
    forage_fit: ["worm_invertebrate"], // closest proxy for opportunistic spawn drift
    depth_range_ft: { min: 1, max: 15 },
    light_fit: ["bright", "mixed"],
    daypart_fit: ["Morning", "Afternoon"],
    speed_fit: ["dead_slow", "slow"],
    motion_fit: ["drift_natural"],
    trigger_fit: ["natural_match", "visibility"],
    presentation_archetype_fit: ["current_seam_drift", "slow_bottom_contact"],
    current_suitability: "medium",
    best_use_cases: [
      "fall and winter steelhead and salmon tributaries",
      "trout and whitefish opportunistically feeding below spawning fish",
      "high-visibility drift in stained or off-color river conditions",
    ],
    depriors: ["surface_window"],
    example_names: ["Glo Bug", "egg yarn fly", "flesh pattern", "Sucker Spawn"],
    how_to_fish: [
      "Dead-drift it through the current seam below where salmon or steelhead are holding.",
      "Use enough weight to keep it in the lower column without dragging on the bottom.",
    ],
  },
];

const FAMILY_METHODS: Record<string, FamilyMethodDefinition[]> = {
  soft_stick_worm: [
    {
      id: "weightless_fall",
      label: "Weightless Fall",
      presentation_note: "Skip or cast it in and let the worm fall on slack line before a light twitch.",
      preferred_month_groups: ["spring_transition", "warm_transition", "summer_pattern"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["subtle_shallow_cover", "tight_to_cover_vertical"],
      style_flags: ["finesse_best", "natural_profile_window"],
    },
    {
      id: "wacky_skip_pause",
      label: "Wacky Skip + Pause",
      presentation_note: "Skip it tight to cover, let it settle, then give it one short shake before the next pause.",
      preferred_month_groups: ["spring_transition", "warm_transition"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["subtle_shallow_cover"],
      style_flags: ["finesse_best"],
    },
  ],
  finesse_worm: [
    {
      id: "shaky_head_drag",
      label: "Shaky Head Drag",
      presentation_note: "Keep it near bottom with small drags and pauses so it stays in the strike zone longer.",
      preferred_month_groups: ["winter_hold", "spring_transition", "late_fall", "summer_heat"],
      depth_lane_fit: ["mid_depth", "lower_column", "bottom_oriented"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["slow_bottom_contact", "tight_to_cover_vertical"],
      style_flags: ["finesse_best", "natural_profile_window"],
    },
    {
      id: "drop_shot_hover",
      label: "Drop Shot Hover",
      presentation_note: "Hold it just off bottom with tiny shakes and long pauses instead of moving it far.",
      preferred_month_groups: ["spring_transition", "summer_heat"],
      depth_lane_fit: ["mid_depth", "lower_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["tight_to_cover_vertical"],
      style_flags: ["finesse_best"],
    },
  ],
  jig_trailer: [
    {
      id: "crawl_hop_bottom",
      label: "Crawl-Hop Bottom",
      presentation_note: "Crawl it through the lower lane and use short hops only after it contacts bottom or cover.",
      preferred_month_groups: ["winter_hold", "spring_transition", "late_fall", "summer_heat"],
      depth_lane_fit: ["mid_depth", "deep", "bottom_oriented"],
      activity_fit: ["inactive", "neutral", "active"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["slow_bottom_contact", "tight_to_cover_vertical"],
      style_flags: ["finesse_best", "bulk_profile_window"],
    },
    {
      id: "flip_pitch_pause",
      label: "Flip/Pitch Pause",
      presentation_note: "Pitch it to the target, let it fall, and pause before pulling it out for the next drop.",
      preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
      depth_lane_fit: ["shallow", "mid_depth", "bottom_oriented"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["tight_to_cover_vertical"],
      style_flags: ["bulk_profile_window"],
    },
  ],
  paddle_tail_swimbait: [
    {
      id: "jighead_swim",
      label: "Jighead Swim",
      presentation_note: "Swim it just fast enough to keep the tail working through the target lane.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed", "baitfish_push"],
      depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["horizontal_search_mid_column", "open_flats_cruise_intercept"],
      style_flags: ["horizontal_search_best"],
    },
    {
      id: "weedless_edge_swim",
      label: "Weedless Edge Swim",
      presentation_note: "Keep it high over grass or edges and use short pauses when fish follow without eating.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained"],
      archetype_fit: ["grass_edge_swim"],
      style_flags: ["horizontal_search_best"],
    },
  ],
  spinnerbait: [
    {
      id: "slow_roll_cover",
      label: "Slow-Roll Cover",
      presentation_note: "Keep it just above the cover and reel steadily enough to keep the blades thumping.",
      preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["grass_edge_swim", "horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best", "loud_profile_window"],
    },
    {
      id: "cover_bump_search",
      label: "Cover-Bump Search",
      presentation_note: "Use a steady retrieve and let the bait ricochet off cover to trigger reaction bites.",
      preferred_month_groups: ["warm_transition", "fall_feed"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["aggressive"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best", "loud_profile_window"],
    },
  ],
  chatterbait: [
    {
      id: "grass_rip_swim",
      label: "Grass Rip Swim",
      presentation_note: "Run it through the grass line and rip it free when it hangs before resuming the retrieve.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["shallow", "mid_depth"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["grass_edge_swim", "horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best", "loud_profile_window", "bulk_profile_window"],
    },
    {
      id: "steady_pulse_search",
      label: "Steady Pulse Search",
      presentation_note: "Keep a steady retrieve that lets the blade hunt without overpowering the lane.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["shallow", "mid_depth"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best", "loud_profile_window"],
    },
  ],
  jerkbait: [
    {
      id: "suspend_twitch_pause",
      label: "Suspend Twitch-Pause",
      presentation_note: "Twitch it down and let the pause do most of the work before the next snap.",
      preferred_month_groups: ["winter_hold", "spring_transition", "fall_feed"],
      depth_lane_fit: ["mid_depth", "suspended", "lower_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["depth_break_suspend_pause"],
      style_flags: ["natural_profile_window"],
    },
    {
      id: "snap_pause_search",
      label: "Snap-Pause Search",
      presentation_note: "Use sharper snaps and shorter pauses when fish are feeding but still keyed on a pause.",
      preferred_month_groups: ["fall_feed", "warm_transition"],
      depth_lane_fit: ["mid_depth", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["depth_break_suspend_pause", "horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best"],
    },
  ],
  topwater_walker_popper: [
    {
      id: "walk_pause_surface",
      label: "Walk-Pause Surface",
      presentation_note: "Walk it with short side-to-side cadence and pause beside the key edge before moving it again.",
      preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window", "fall_feed"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["surface_low_light_commotion"],
      style_flags: ["topwater_window"],
    },
    {
      id: "pop_pause_surface",
      label: "Pop-Pause Surface",
      presentation_note: "Pop it once or twice, then leave it still long enough for fish to commit.",
      preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained"],
      archetype_fit: ["surface_low_light_commotion"],
      style_flags: ["topwater_window"],
    },
  ],
  frog_toad: [
    {
      id: "hollow_body_pause",
      label: "Hollow-Body Pause",
      presentation_note: "Walk or twitch it over the shallowest cover and pause over openings before moving it again.",
      preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["surface_low_light_commotion"],
      style_flags: ["topwater_window"],
    },
    {
      id: "steady_toad_swim",
      label: "Steady Toad Swim",
      presentation_note: "Swim it steadily over grass or shallow cover without killing the momentum.",
      preferred_month_groups: ["summer_pattern", "summer_heat"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained"],
      archetype_fit: ["grass_edge_swim"],
      style_flags: ["topwater_window", "horizontal_search_best"],
    },
  ],
  crankbait_shallow_mid: [
    {
      id: "squarebill_deflect",
      label: "Squarebill Deflect",
      presentation_note: "Keep it hitting hard edges or cover and let the deflection trigger the bite.",
      preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
      depth_lane_fit: ["shallow", "mid_depth"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best"],
    },
    {
      id: "steady_mid_crank",
      label: "Steady Mid Crank",
      presentation_note: "Use a steady retrieve that keeps the bait in the target lane with only brief hesitations.",
      preferred_month_groups: ["warm_transition", "fall_feed"],
      depth_lane_fit: ["mid_depth"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best"],
    },
  ],
  inline_spinner: [
    {
      id: "quartering_swing",
      label: "Quartering Swing",
      presentation_note: "Cast slightly across current and let it swing while keeping the blade turning through the seam.",
      preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
      depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
      activity_fit: ["neutral", "active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["current_seam_drift", "horizontal_search_mid_column"],
      style_flags: ["current_drift_best", "horizontal_search_best"],
    },
    {
      id: "steady_seam_retrieve",
      label: "Steady Seam Retrieve",
      presentation_note: "Keep it just fast enough to hold the seam and pulse through softer current without blowing past fish.",
      preferred_month_groups: ["warm_transition", "summer_pattern"],
      depth_lane_fit: ["shallow", "mid_depth"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best"],
    },
  ],
  compact_spoon: [
    {
      id: "flutter_swing",
      label: "Flutter Swing",
      presentation_note: "Let it sink into the lane, then sweep it across current so it flashes and flutters without racing out of the zone.",
      preferred_month_groups: ["winter_hold", "spring_transition", "late_fall", "fall_feed"],
      depth_lane_fit: ["mid_depth", "lower_column", "suspended"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["current_seam_drift", "depth_break_suspend_pause"],
      style_flags: ["current_drift_best"],
    },
    {
      id: "lift_drop_current",
      label: "Lift-Drop Current",
      presentation_note: "Give it a short lift, then let it fall back on tension so it stays in the lower lane and flashes on the drop.",
      preferred_month_groups: ["winter_hold", "late_fall"],
      depth_lane_fit: ["lower_column", "suspended"],
      activity_fit: ["neutral"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["depth_break_suspend_pause", "slow_bottom_contact"],
      style_flags: ["finesse_best"],
    },
  ],
  shrimp_imitation: [
    {
      id: "subtle_hop_fall",
      label: "Subtle Hop-Fall",
      presentation_note: "Use short hops or twitches and let it fall back naturally into the lane.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["shallow", "lower_column", "bottom_oriented"],
      activity_fit: ["inactive", "neutral", "active"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["drain_edge_intercept", "open_flats_cruise_intercept"],
      style_flags: ["finesse_best"],
    },
    {
      id: "short_twitch_pause",
      label: "Short Twitch-Pause",
      presentation_note: "Move it in short bursts and pause long enough for the bait to settle back into the strike lane.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["shallow", "lower_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["open_flats_cruise_intercept"],
      style_flags: ["natural_profile_window"],
    },
  ],
  jighead_minnow: [
    {
      id: "steady_jighead_swim",
      label: "Steady Jighead Swim",
      presentation_note: "Swim it just fast enough to hold the lane, then add a pause when fish follow.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed", "baitfish_push"],
      depth_lane_fit: ["shallow", "mid_depth", "lower_column"],
      activity_fit: ["neutral", "active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["horizontal_search_mid_column", "drain_edge_intercept", "open_flats_cruise_intercept"],
      style_flags: ["horizontal_search_best"],
    },
    {
      id: "glide_pause_swim",
      label: "Glide-Pause Swim",
      presentation_note: "Use a smooth swim and let the bait glide or fall on the pause instead of forcing a hard stop.",
      preferred_month_groups: ["warm_transition", "fall_feed"],
      depth_lane_fit: ["mid_depth", "lower_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["depth_break_suspend_pause", "drain_edge_intercept"],
      style_flags: ["natural_profile_window"],
    },
  ],
  popping_cork_trailer: [
    {
      id: "pop_pause_trailer",
      label: "Pop-Pause Trailer",
      presentation_note: "Pop it enough to call fish, then let the trailer settle before the next pop.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["surface_low_light_commotion", "open_flats_cruise_intercept"],
      style_flags: ["loud_profile_window", "topwater_window"],
    },
    {
      id: "search_cork_rhythm",
      label: "Search Cork Rhythm",
      presentation_note: "Keep a repeatable pop-pop-pause cadence so fish can track the trailer under the cork.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["dirty"],
      archetype_fit: ["open_flats_cruise_intercept"],
      style_flags: ["loud_profile_window"],
    },
  ],
  weighted_bottom_presentation: [
    {
      id: "bottom_drag",
      label: "Bottom Drag",
      presentation_note: "Keep steady bottom contact and drag it slowly enough to stay in the lower lane.",
      preferred_month_groups: ["winter_hold", "summer_heat", "late_fall"],
      depth_lane_fit: ["lower_column", "bottom_oriented"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["slow_bottom_contact"],
      style_flags: ["finesse_best"],
    },
    {
      id: "bottom_hop",
      label: "Bottom Hop",
      presentation_note: "Lift it just enough to keep it alive, then let it fall straight back into the strike lane.",
      preferred_month_groups: ["winter_hold", "summer_heat", "late_fall"],
      depth_lane_fit: ["lower_column", "bottom_oriented"],
      activity_fit: ["neutral"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["slow_bottom_contact", "drain_edge_intercept"],
      style_flags: ["bulk_profile_window"],
    },
  ],
  weighted_streamer: [
    {
      id: "sink_strip_pause",
      label: "Sink-Strip-Pause",
      presentation_note: "Let it sink into the lane first, then use short strips and pauses to keep it near fish.",
      preferred_month_groups: ["winter_hold", "spring_transition", "fall_feed"],
      depth_lane_fit: ["mid_depth", "lower_column", "suspended"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["depth_break_suspend_pause"],
      style_flags: ["natural_profile_window"],
    },
    {
      id: "swing_current_edge",
      label: "Swing Current Edge",
      presentation_note: "Use the current to swing it through the seam and add only a light strip to keep tension.",
      preferred_month_groups: ["spring_transition", "fall_feed"],
      depth_lane_fit: ["mid_depth", "lower_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["current_seam_drift"],
      style_flags: ["current_drift_best"],
    },
  ],
  baitfish_streamer: [
    {
      id: "slow_strip_pause",
      label: "Slow Strip + Pause",
      presentation_note: "Strip it at a controlled pace and pause when fish track without committing.",
      preferred_month_groups: ["warm_transition", "fall_feed", "baitfish_push"],
      depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["horizontal_search_mid_column", "open_flats_cruise_intercept"],
      style_flags: ["natural_profile_window"],
    },
    {
      id: "medium_strip_search",
      label: "Medium Strip Search",
      presentation_note: "Use a more assertive strip cadence when fish are feeding and willing to chase.",
      preferred_month_groups: ["summer_pattern", "fall_feed", "baitfish_push"],
      depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained"],
      archetype_fit: ["horizontal_search_mid_column", "open_flats_cruise_intercept"],
      style_flags: ["horizontal_search_best"],
    },
  ],
  woolly_bugger_leech: [
    {
      id: "dead_drift_swing",
      label: "Dead-Drift / Swing",
      presentation_note: "Let the current or drift carry it first, then tighten up and let it swing across the lane.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["mid_depth", "lower_column", "upper_column"],
      activity_fit: ["inactive", "neutral", "active"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["current_seam_drift", "slow_bottom_contact"],
      style_flags: ["current_drift_best", "finesse_best"],
    },
    {
      id: "short_strip_search",
      label: "Short-Strip Search",
      presentation_note: "Use short, controlled strips and keep the fly in the lane longer before speeding it up.",
      preferred_month_groups: ["warm_transition", "summer_pattern"],
      depth_lane_fit: ["mid_depth", "upper_column"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["contrast_profile_window"],
    },
  ],
  popper_surface_bug: [
    {
      id: "pop_pause_bug",
      label: "Pop-Pause Bug",
      presentation_note: "Pop it once or twice, then leave it still long enough for the fish to track and eat.",
      preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["surface_low_light_commotion"],
      style_flags: ["topwater_window"],
    },
    {
      id: "slide_pause_bug",
      label: "Slide-Pause Bug",
      presentation_note: "Slide it gently across the surface and pause beside the target lane instead of overworking it.",
      preferred_month_groups: ["summer_pattern", "summer_heat"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["surface_low_light_commotion"],
      style_flags: ["topwater_window", "natural_profile_window"],
    },
  ],
  nymph_rig: [
    {
      id: "dead_drift_bottom",
      label: "Dead-Drift Bottom",
      presentation_note: "Get it down first and dead-drift it naturally near the lower lane before changing flies.",
      preferred_month_groups: ["winter_hold", "spring_transition", "late_fall"],
      depth_lane_fit: ["lower_column", "bottom_oriented"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["current_seam_drift", "slow_bottom_contact"],
      style_flags: ["current_drift_best", "finesse_best"],
    },
    {
      id: "tight_line_nymph",
      label: "Tight-Line Nymph",
      presentation_note: "Keep direct contact as it drifts through the seam so the fly stays precise and low.",
      preferred_month_groups: ["winter_hold", "spring_transition", "late_fall"],
      depth_lane_fit: ["lower_column", "bottom_oriented"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["current_seam_drift"],
      style_flags: ["current_drift_best"],
    },
  ],
  dry_emerger: [
    {
      id: "clean_dead_drift",
      label: "Clean Dead Drift",
      presentation_note: "Prioritize a clean dead drift through the softer surface lane before changing the fly.",
      preferred_month_groups: ["warm_transition", "summer_pattern"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["surface_low_light_commotion", "subtle_shallow_cover"],
      style_flags: ["natural_profile_window"],
    },
    {
      id: "emerger_pause_lift",
      label: "Emerger Pause-Lift",
      presentation_note: "Let it dead drift, then lift it gently at the end to imitate an emerging insect.",
      preferred_month_groups: ["warm_transition", "summer_pattern"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["subtle_shallow_cover"],
      style_flags: ["natural_profile_window"],
    },
  ],
  terrestrial_hopper: [
    {
      id: "bank_dead_drift",
      label: "Bank Dead Drift",
      presentation_note: "Land it tight to the bank or edge and let it sit before making the next move.",
      preferred_month_groups: ["summer_pattern", "summer_heat"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["surface_low_light_commotion", "subtle_shallow_cover"],
      style_flags: ["natural_profile_window"],
    },
    {
      id: "twitch_rest_bank",
      label: "Twitch-Rest Bank",
      presentation_note: "Give it one small twitch only when fish track it, then let it rest again.",
      preferred_month_groups: ["summer_pattern", "summer_heat"],
      depth_lane_fit: ["very_shallow", "upper_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained"],
      archetype_fit: ["surface_low_light_commotion"],
      style_flags: ["contrast_profile_window"],
    },
  ],
  shrimp_fly: [
    {
      id: "short_strip_pause",
      label: "Short Strip + Pause",
      presentation_note: "Use short strips, then let the fly settle naturally back into the lane.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["shallow", "lower_column"],
      activity_fit: ["inactive", "neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["drain_edge_intercept", "open_flats_cruise_intercept"],
      style_flags: ["natural_profile_window"],
    },
    {
      id: "settle_twitch",
      label: "Settle + Twitch",
      presentation_note: "Lead the fish, let the fly settle, and only twitch it once it is in the right lane.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["shallow", "lower_column"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["slow_bottom_contact", "drain_edge_intercept"],
      style_flags: ["finesse_best"],
    },
  ],
  crab_fly: [
    {
      id: "dead_stick_drop",
      label: "Dead-Stick Drop",
      presentation_note: "Set it down in the fish's path and barely move it once it settles.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["shallow", "bottom_oriented"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["slow_bottom_contact", "drain_edge_intercept"],
      style_flags: ["finesse_best", "natural_profile_window"],
    },
    {
      id: "tiny_hop_crab",
      label: "Tiny Hop Crab",
      presentation_note: "Use tiny hops only when you need to keep the fly visible without pulling it out of the lane.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["shallow", "bottom_oriented"],
      activity_fit: ["neutral"],
      clarity_fit: ["stained"],
      archetype_fit: ["drain_edge_intercept"],
      style_flags: ["finesse_best"],
    },
  ],
  lipless_crankbait: [
    {
      id: "yo_yo_bottom",
      label: "Yo-Yo Bottom",
      presentation_note: "Let it sink to the grass or bottom, then rip it up 2-3 feet and let it flutter back down on a slack line.",
      preferred_month_groups: ["winter_hold", "spring_transition", "late_fall"],
      depth_lane_fit: ["bottom_oriented", "lower_column", "mid_depth"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["depth_break_suspend_pause", "slow_bottom_contact"],
      style_flags: ["finesse_best"],
    },
    {
      id: "burn_rip_grass",
      label: "Burn-Rip Grass",
      presentation_note: "Burn it quickly over or through the grass and rip it free whenever it ticks the top — the deflection triggers the bite.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["mid_depth", "lower_column"],
      activity_fit: ["active", "aggressive"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["horizontal_search_mid_column"],
      style_flags: ["horizontal_search_best", "loud_profile_window"],
    },
  ],
  soft_hackle_wet_fly: [
    {
      id: "downstream_swing",
      label: "Downstream Swing",
      presentation_note: "Cast 45° across current, mend upstream to slow the swing, and let the fly arc through the seam on a tight line.",
      preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
      depth_lane_fit: ["upper_column", "mid_depth"],
      activity_fit: ["neutral", "active"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["current_seam_drift"],
      style_flags: ["current_drift_best", "natural_profile_window"],
    },
    {
      id: "rising_lift_swing",
      label: "Rising Lift + Swing",
      presentation_note: "Let it sink slightly, then let the current tighten the line and lift the fly through the column — imitating an ascending insect.",
      preferred_month_groups: ["warm_transition", "summer_pattern", "fall_feed"],
      depth_lane_fit: ["upper_column", "mid_depth"],
      activity_fit: ["active"],
      clarity_fit: ["clear"],
      archetype_fit: ["surface_low_light_commotion", "current_seam_drift"],
      style_flags: ["natural_profile_window"],
    },
  ],
  chironomid_stillwater: [
    {
      id: "deep_indicator_hang",
      label: "Deep Indicator Hang",
      presentation_note: "Set the indicator so the fly hangs at the right depth and leave it completely motionless — takes are often imperceptible twitches.",
      preferred_month_groups: ["all_year"],
      depth_lane_fit: ["deep", "lower_column", "suspended"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained"],
      archetype_fit: ["depth_break_suspend_pause"],
      style_flags: ["finesse_best"],
    },
    {
      id: "slow_figure_eight",
      label: "Slow Figure-Eight",
      presentation_note: "Use a nearly imperceptible figure-eight retrieve with the rod tip to give the fly a micro-pulse without breaking the drift.",
      preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
      depth_lane_fit: ["mid_depth", "suspended"],
      activity_fit: ["neutral"],
      clarity_fit: ["clear"],
      archetype_fit: ["depth_break_suspend_pause"],
      style_flags: ["finesse_best", "natural_profile_window"],
    },
  ],
  egg_pattern: [
    {
      id: "dead_drift_seam",
      label: "Dead-Drift Seam",
      presentation_note: "Dead-drift it naturally through the current lane below where fish are holding — mend to maintain drag-free drift.",
      preferred_month_groups: ["fall_feed", "late_fall", "winter_hold"],
      depth_lane_fit: ["lower_column", "bottom_oriented", "mid_depth"],
      activity_fit: ["inactive", "neutral"],
      clarity_fit: ["clear", "stained", "dirty"],
      archetype_fit: ["current_seam_drift", "slow_bottom_contact"],
      style_flags: ["current_drift_best", "finesse_best"],
    },
    {
      id: "indicator_depth_drift",
      label: "Indicator Depth Drift",
      presentation_note: "Use an indicator for precise depth control and adjust until the fly drifts in the exact feeding lane.",
      preferred_month_groups: ["fall_feed", "late_fall"],
      depth_lane_fit: ["lower_column", "mid_depth"],
      activity_fit: ["neutral"],
      clarity_fit: ["stained", "dirty"],
      archetype_fit: ["slow_bottom_contact"],
      style_flags: ["finesse_best"],
    },
  ],
};

for (const family of FAMILY_LIBRARY) {
  if (!FAMILY_METHODS[family.id] || FAMILY_METHODS[family.id]!.length === 0) {
    throw new Error(`Missing canonical methods for recommender family: ${family.id}`);
  }
}

function dominantForage(behavior: BehaviorResolution): string[] {
  const forage = behavior.fish_behavior.forage;
  const entries: [string, number][] = [
    ["baitfish", forage.baitfish_bias],
    ["crawfish", forage.crawfish_bias ?? 0],
    ["crustacean", forage.crustacean_bias],
    ["insect", forage.insect_bias],
    ["worm_invertebrate", forage.worm_invertebrate_bias ?? 0],
    ["amphibian", forage.amphibian_surface_bias ?? 0],
  ];
  const top = [...entries].sort((a, b) => b[1] - a[1]).slice(0, 3);
  return top.filter(([, score]) => score > 0.2).map(([id]) => id);
}

function colorGuidance(behavior: BehaviorResolution, family: FamilyDefinition): string[] {
  const clarity = behavior.inferred_clarity;
  const light = behavior.light_profile;
  const forage = dominantForage(behavior);
  const isSpring = behavior.season_phase === "spring_transition";
  const isFallFeed = behavior.season_phase === "fall_feed";
  const notes: string[] = [];

  // ── Per-family color guidance ────────────────────────────────────────────────
  // Rules are grounded in fish vision biology and guide-level field knowledge:
  // dirty water → fish rely on lateral line + silhouette; dark outline OR high-contrast bright
  // stained water → contrast and reaction colors; chartreuse, white, orange
  // clear water → natural, subtle; match the forage closely
  // light modifier: low light → shift brighter; bright sun → shift more natural/subdued

  switch (family.id) {
    case "soft_stick_worm":
      if (clarity === "dirty") notes.push("black/blue or junebug — solid dark silhouette reads best when visibility is low");
      else if (clarity === "stained") notes.push("green pumpkin/chartreuse, watermelon red flake, or black blue — bump up contrast");
      else notes.push(light === "bright" ? "green pumpkin, watermelon seed, natural brown — subtle in clear bright water" : "green pumpkin with black flake, junebug — go slightly darker at low light");
      notes.push("natural worm tones (green pumpkin, watermelon) are the baseline; only go darker or brighter when conditions demand it");
      break;

    case "finesse_worm":
      if (clarity === "dirty") notes.push("black/blue or junebug — dark profile for visibility in off-color water");
      else if (clarity === "stained") notes.push("green pumpkin/red flake, green pumpkin/chartreuse — subtle contrast");
      else notes.push("green pumpkin, natural watermelon, smoke/shad — match the bottom substrate as closely as possible");
      break;

    case "jig_trailer":
      if (clarity === "dirty") notes.push("black/blue — the most reliable dirty-water jig color; bulky trailer adds displacement");
      else if (clarity === "stained") notes.push("black/blue (most versatile), green pumpkin/chart, or brown/orange");
      else if (light === "bright") notes.push("natural brown/green pumpkin or dark crawfish tones — match the bottom closely in clear bright water");
      else notes.push("black/blue or brown/orange — both read in clear low-light conditions");
      if (isSpring) notes.push("orange and brown tones are critical in spring — molting crayfish turn orange-bellied and fish key on this color hard");
      else if (forage.includes("crawfish")) notes.push("natural crawfish tones — brown, green pumpkin, rust/orange — match the local crayfish color");
      else if (forage.includes("baitfish")) notes.push("white/gray or smoke profiles when baitfish are driving the bite");
      break;

    case "paddle_tail_swimbait":
      if (clarity === "dirty") notes.push("white or black/blue — white is the most visible swimbait color in off-color water");
      else if (clarity === "stained") notes.push("white/pearl, chartreuse/white — light-colored swimbaits read in stained water");
      else notes.push(isFallFeed ? "natural shad — silver, white/gray, alewife patterns match the fall baitfish schools precisely" : "natural shad/baitfish — pearl, silver/white, or perch patterns");
      break;

    case "spinnerbait":
      if (clarity === "dirty") notes.push("all-white with Colorado blade — maximum water displacement and visibility in dirty water");
      else if (clarity === "stained") notes.push("chartreuse/white or all-white with willow blades — contrast works best here");
      else notes.push("white/silver with willow blades in clear water — silver blade flashes most naturally");
      notes.push(clarity === "dirty" || clarity === "stained" ? "gold blade in stained/dirty water — gold reads when silver disappears" : "silver blade in clearer water — more natural flash");
      break;

    case "chatterbait":
      if (clarity === "dirty") notes.push("white/chartreuse or black/blue — the blade noise matters as much as the color in dirty water");
      else notes.push("chartreuse, white, or green pumpkin/chart — contrast works best for a moving vibration bait");
      notes.push("add a matching paddletail trailer; the color of the trailer trailing the blade is what fish commit to");
      break;

    case "jerkbait":
      if (clarity === "dirty") notes.push("white/chartreuse if you must fish it — jerkbaits struggle in dirty water; strongly consider a different family");
      else if (clarity === "stained") notes.push("chartreuse/silver, white/silver, or natural shad — brighter than clear-water choices");
      else notes.push(light === "bright" ? "ghost/translucent, natural shad (silver-gray), or bone/white — fish can examine it closely in clear water" : "fire tiger, bone, or chrome-silver — low light activates reaction colors even in clear water");
      notes.push("pause length matters more than color — extend pauses in cold water, shorten as fish get more active");
      break;

    case "topwater_walker_popper":
      // Fish see topwaters from below as silhouettes — belly color matters most
      if (clarity === "dirty") notes.push("white is the #1 topwater color in off-color water — clearest surface silhouette from below");
      else if (clarity === "stained") notes.push("white/chartreuse, bone, or loud chrome patterns — contrast on the surface calls fish in");
      else notes.push(light === "low_light" ? "bone, white, or natural chrome — bright enough to see at dawn/dusk without being overdone" : "bone, ghost, or natural shad — subtle in calm clear water; walk-the-dog style lets the sound do the calling");
      break;

    case "frog_toad":
      // Fish always see the frog from below — underside silhouette is everything
      if (clarity === "dirty") notes.push("black — clearest silhouette from below in dirty water; always the go-to in heavy cover");
      else if (clarity === "stained") notes.push("white belly frog or natural green/brown — white underside reads best from below in stained water");
      else notes.push("natural green/brown frog tones — match the frogs actually living on or near the cover you're fishing");
      notes.push("fish key on the silhouette from below — a dark underside always reads, regardless of clarity");
      break;

    case "crankbait_shallow_mid":
      if (clarity === "dirty") notes.push("chartreuse/white or bright orange/red — crankbaits need maximum visibility in dirty water");
      else if (clarity === "stained") notes.push("firetiger, chartreuse/white, or crawfish orange — reaction colors in stained water");
      else if (isSpring) notes.push("natural crawfish (brown/orange) — spring crankbait fishing keys heavily on crawfish color as fish move shallow");
      else notes.push(light === "bright" ? "natural crawfish (brown/orange), shad/perch patterns — match the forage in clear bright water" : "fire tiger, bone, or natural bone/olive — low light opens up brighter choices even in clear water");
      if (forage.includes("baitfish") && !isSpring) notes.push("shad/baitfish patterns (white, silver, blue/silver) when fish are keying on baitfish instead of crawfish");
      break;

    case "inline_spinner":
      if (clarity === "dirty") notes.push("gold blade with chartreuse or white body — gold reads in off-color water where silver disappears");
      else if (clarity === "stained") notes.push("gold or copper blade with yellow/white body — warm metals in stained river water");
      else notes.push("silver blade with brown/olive/black body — natural river tones in clear water; match the local minnow coloring");
      notes.push("blade color is often more important than body color — silver blade in clear water, gold blade in stained or low-light");
      break;

    case "compact_spoon":
      if (clarity === "dirty") notes.push("hammered gold or copper — gold reads in off-color water and still produces flash on the flutter");
      else if (clarity === "stained") notes.push("hammered gold or copper/brass — warmer metal tones in stained river water");
      else notes.push("plain silver or hammered silver — maximum flash in clear water; smaller profile flutters more naturally");
      notes.push("cold-water note: fish the spoon slower and let it flutter longer — fish are not moving far to eat");
      break;

    case "shrimp_imitation":
      if (clarity === "dirty") notes.push("chartreuse/white or bright pink — maximum visibility while still maintaining the shrimp profile");
      else if (clarity === "stained") notes.push("chartreuse/white, pink/white, or root beer — brighter than natural but still a shrimp shape");
      else notes.push("natural tan/pink/copper or root beer/amber — match real shrimp as closely as possible in clear water");
      break;

    case "jighead_minnow":
      if (clarity === "dirty") notes.push("chartreuse/white or all-white — bright and visible, stays readable in off-color coastal water");
      else if (clarity === "stained") notes.push("chartreuse/white, white/pearl, or natural shad");
      else notes.push("natural shad/silver, clear/pearl, or white/silver — clean baitfish profile in clear inshore water");
      break;

    case "popping_cork_trailer":
      if (clarity === "dirty") notes.push("bright chartreuse or white trailer — the cork noise calls fish, the trailer needs to be easy to find");
      else notes.push("natural shrimp (tan/pink) or chartreuse under the cork — match the shrimp in the tide lanes");
      notes.push("the cork noise is the primary attractor; let the trailer settle and do the work after each pop");
      break;

    case "weighted_bottom_presentation":
      if (clarity === "dirty") notes.push("dark profile or chartreuse tail — darker body with a bright tail tip helps fish find the hook");
      else if (clarity === "stained") notes.push("natural brown/tan with chartreuse tipping — subtle contrast near the bottom");
      else notes.push("natural brown/tan/olive or shrimp tones — match the bottom substrate and forage in clear water");
      break;

    // ── FLY FAMILIES ──────────────────────────────────────────────────────────

    case "weighted_streamer": {
      const bottomFish = behavior.fish_behavior.position.depth_lanes[0]?.id === "lower_column" ||
        behavior.fish_behavior.position.depth_lanes[0]?.id === "bottom_oriented";
      const isRiverLike = behavior.style_flags.includes("current_drift_best");
      if (clarity === "dirty") notes.push("black/chartreuse or white/red — swing it slow and get it deep so fish can find it");
      else if (clarity === "stained") notes.push("chartreuse/white (Clouser-style), olive/yellow, or black/purple — match the forage with contrast");
      else notes.push(light === "bright" ? "natural/olive, sparse white/brown (Clouser) — less flash in clear bright water" : "white/blue, olive/flash, or black/olive — more silhouette at low light even in clear water");
      if (isRiverLike && bottomFish) {
        notes.push("sculpin note: when fish are tight to the bottom, shift to olive/tan/rust with a muddler-style head — brown trout key on sculpin and it reads differently from a mid-column baitfish profile");
      } else {
        notes.push("in rivers, swing deep and slow — a weighted streamer fished on tension through the seam is more effective than a stripped retrieve");
      }
      break;
    }

    case "baitfish_streamer": {
      const isLakeLike = !behavior.style_flags.includes("current_drift_best") &&
        !behavior.style_flags.includes("crustacean_match");
      if (clarity === "dirty") notes.push("white/chartreuse or black/white — keep the silhouette clean and strip with authority");
      else if (clarity === "stained") notes.push(isLakeLike
        ? "chartreuse/white, olive/yellow flash, or yellow/white — yellow and olive read well in stained lake water for panfish-imitating profiles"
        : "chartreuse/white, olive/yellow flash, or white/gold");
      else notes.push(isFallFeed
        ? (isLakeLike
          ? "olive/white, yellow/olive, or natural shiner tones — match the perch, bluegill, and shiner schools that bass and pike key on in fall lakes"
          : "natural shad/baitfish — white/gray, white/olive, or EP-style sparse matches fall schools precisely")
        : (isLakeLike
          ? "olive/white, yellow/olive, or chartreuse/white for panfish (bluegill/perch imitation); white/silver for shiner-style lake baitfish"
          : "natural baitfish — white/olive, white/gray, or EP-style sparse patterns"));
      break;
    }

    case "woolly_bugger_leech":
      // Woolly bugger is the most versatile fly in existence — black is always the right start
      if (clarity === "dirty") notes.push("black — universally the best fly color in dirty water; maximum silhouette contrast");
      else if (clarity === "stained") notes.push("black (best silhouette), olive/black, or dark purple — dark colors read in stained water");
      else notes.push(behavior.season_phase === "winter_hold" || behavior.season_phase === "late_fall" ? "black or dark olive — subdued and natural in cold clear water" : "olive, brown, or black — all work; olive in summer and fall, black as the default when unsure");
      notes.push("black is the universal go-to when in doubt — it reads in any clarity and imitates leeches, large nymphs, and small baitfish simultaneously");
      break;

    case "popper_surface_bug":
      if (clarity === "stained") notes.push("chartreuse/yellow or bright white — louder than clear-water choices but still a surface bait");
      else notes.push("natural tan/cream, yellow/olive, or white — subtle in clear water, let the noise do the calling");
      notes.push("pause after every pop — that is when fish commit; dead-stick it longer than feels comfortable");
      break;

    case "nymph_rig":
      if (clarity === "dirty") notes.push("tungsten beadhead nymphs with hot-spot beads (orange, red, chartreuse) — gets down and gives fish a target in off-color water");
      else if (clarity === "stained") notes.push("hot-spot bead heads (orange, red) help fish locate the fly in off-color water");
      else notes.push("match the hatch — natural PT nymph, hare's ear, RS2, olive caddis; natural colors are always right in clear water");
      notes.push("adjust weight to get to the bottom before changing fly patterns — depth is more important than pattern selection");
      break;

    case "dry_emerger":
      if (clarity === "stained") notes.push("parachute-style with hi-vis post — slightly brighter than natural; the post helps you track the fly in off-color water");
      else notes.push("match the hatch precisely — natural dun colors, cream, tan, olive; fish can examine it closely in clear water");
      notes.push("prioritize a clean dead drift before changing patterns — drag is the #1 reason fish refuse a dry fly");
      break;

    case "terrestrial_hopper":
      if (clarity === "stained") notes.push("foam patterns with chartreuse or yellow accents — helps you track the fly and adds slight contrast");
      else notes.push("natural hopper tones — tan, yellow, olive, brown; match the grasshoppers and beetles living along the bank");
      notes.push("land it tight to the bank and let it sit still — terrestrials fall from the bank and drift, they do not swim");
      break;

    case "shrimp_fly":
      if (clarity === "dirty") notes.push("chartreuse/white or bright pink shrimp pattern — maximum visibility while maintaining shrimp profile");
      else if (clarity === "stained") notes.push("copper/orange shrimp, chartreuse shrimp, or EP shrimp in brighter tones");
      else notes.push("natural tan/pink/copper (EP shrimp), or lightly-weighted shrimp in sand/root beer — match the local shrimp color");
      notes.push("lead the fish and keep the strip subtle — the fly should look like a fleeing shrimp, not a darting minnow");
      break;

    case "crab_fly":
      if (clarity === "stained") notes.push("slightly brighter crab — olive/orange, rust/brown, or tan/orange rather than plain natural");
      else notes.push("natural olive/brown/tan — match the local crab coloring precisely; fish on clear flats are selective");
      notes.push("dead-stick it — most takes happen with zero movement after the fly settles on the bottom");
      break;

    case "lipless_crankbait":
      if (clarity === "dirty") notes.push("all-white or chartreuse/chrome — the rattle does the work in dirty water; color needs maximum visibility");
      else if (clarity === "stained") notes.push("chrome/red (classic), chartreuse/white, or gold — Rat-L-Trap red and chrome is a proven stained-water color");
      else notes.push(light === "bright" ? "natural shad (silver/white), perch/gold, or chrome — match the local baitfish profile closely in clear water" : "chrome/blue or chrome/black back — cleaner in clear low-light conditions");
      if (behavior.season_phase === "spring_transition" || behavior.season_phase === "fall_feed") {
        notes.push(behavior.season_phase === "spring_transition"
          ? "spring note: crawfish-orange belly versions (gold/orange) excel when fish are targeting molting crawfish over grass flats"
          : "fall note: match the dying shad — natural silver/white with a slightly duller finish as baitfish schools thin out");
      } else if (behavior.season_phase === "winter_hold") {
        notes.push("winter yo-yo note: red/chrome or gold in stained; natural shad in clear — the flutter and pause matter more than color at cold-water speeds");
      }
      break;

    case "soft_hackle_wet_fly":
      if (clarity === "dirty") notes.push("orange body with brown partridge — orange reads in off-color water and is the most visible soft hackle color");
      else if (clarity === "stained") notes.push("orange or amber body with partridge, copper-ribbed hare's ear — warm metallic tones read in stained water");
      else notes.push("match the emerging insect: olive or tan for caddis, dun/cream for mayflies, yellow for yellow sallies — natural tones in clear water");
      notes.push("partridge and orange is the universal starting point — if you don't know the hatch, start here before switching to match-the-hatch patterns");
      break;

    case "chironomid_stillwater":
      if (clarity === "stained") notes.push("use a hot-spot bead (orange or red) to give fish a visual target in the water column — the bead matters more than body color in off-color water");
      else notes.push("black with red wire rib is the most universal chironomid color; olive/brown and rust are close seconds — match the locally hatching midge size and color");
      notes.push("depth is more important than color — set your indicator so the fly hangs at the right level before worrying about pattern; go smaller (size 16-20) if fish are refusing");
      break;

    case "egg_pattern":
      if (clarity === "dirty") notes.push("hot orange, fluorescent pink, or chartreuse — maximum visibility in off-color steelhead and salmon rivers");
      else if (clarity === "stained") notes.push("peach/orange or hot pink — bright enough to be found in stained water but not so loud it looks unnatural");
      else notes.push("natural peach/cream (closest to real spawn color) or hot pink as a contrast option in clear water");
      notes.push("match the dominant egg in the river — chinook eggs are larger and redder; coho and steelhead eggs are smaller and lighter; adjust size and color accordingly");
      break;

    default:
      // Generic fallback for any family not explicitly covered
      if (clarity === "dirty") notes.push("lean toward dark silhouettes or high-contrast bright colors (chartreuse, white)");
      else if (clarity === "stained") notes.push("contrast colors: white, chartreuse, or darker-backed profiles with brighter belly");
      else notes.push("natural, subtle colors that match the local forage as closely as possible");
  }

  // ── Universal forage color modifier ─────────────────────────────────────────
  // Only add if not already captured by the family-specific note
  if (notes.length < 2) {
    if (forage.includes("crawfish") && !["jig_trailer", "crankbait_shallow_mid", "finesse_worm"].includes(family.id)) {
      notes.push("crawfish tones (brown, orange, green pumpkin) fit the forage cue");
    } else if (forage.includes("baitfish") && !["paddle_tail_swimbait", "jerkbait", "topwater_walker_popper"].includes(family.id)) {
      notes.push("baitfish profiles (white, silver, pearl) match the active forage");
    } else if (forage.includes("crustacean") && !["shrimp_imitation", "shrimp_fly", "crab_fly", "popping_cork_trailer"].includes(family.id)) {
      notes.push("shrimp/crab tones (tan, pink, copper, rust) fit the flats forage cue");
    }
  }

  return uniq(notes).slice(0, 2);
}

function overlapCount(items: readonly string[], compare: readonly string[]): number {
  return items.filter((item) => compare.includes(item)).length;
}

function setupLabelForMethod(
  family: FamilyDefinition,
  method: FamilyMethodDefinition,
): string {
  if (method.setup_label?.trim()) return method.setup_label.trim();

  const overrides: Record<string, string> = {
    weightless_fall: "Weightless rig",
    wacky_skip_pause: "Wacky rig",
    shaky_head_drag: "Shaky head",
    drop_shot_hover: "Drop shot",
    crawl_hop_bottom: "Jig",
    flip_pitch_pause: "Jig",
    jighead_swim: "Jighead swimbait",
    weedless_edge_swim: "Weedless swimbait",
    slow_roll_cover: "Spinnerbait",
    cover_bump_search: "Spinnerbait",
    steady_jighead_swim: "Jighead minnow",
    hop_pause_bottom: "Bottom jighead",
    cork_pause_pop: "Popping cork",
    dead_drift_bottom: "Nymph rig",
    tight_line_nymph: "Nymph rig",
  };

  return overrides[method.id] ?? family.display_name;
}

function simplifiedPace(speed: PresentationArchetypeScore["speed"] | undefined): SimplifiedPresentationPace {
  if (speed === "moderate" || speed === "fast") return speed === "fast" ? "fast" : "medium";
  return "slow";
}

function simplifiedLane(
  depthTarget: PresentationArchetypeScore["depth_target"] | undefined,
  topDepth: string | undefined,
): SimplifiedPresentationLane {
  if (depthTarget === "surface" || depthTarget === "upper_column") return "upper";
  if (depthTarget === "mid_column") return "mid";
  if (depthTarget === "bottom_contact") return "bottom";
  if (depthTarget === "near_bottom") return "lower";

  if (topDepth === "very_shallow" || topDepth === "shallow" || topDepth === "upper_column") return "upper";
  if (topDepth === "mid_depth" || topDepth === "suspended") return "mid";
  if (topDepth === "bottom_oriented") return "bottom";
  return "lower";
}

function simplifiedAction(
  method: FamilyMethodDefinition,
  topArchetype: PresentationArchetypeScore | undefined,
): SimplifiedPresentationAction {
  const note = `${method.label} ${method.presentation_note}`.toLowerCase();
  const motions = topArchetype?.motions ?? [];

  if (
    note.includes("dead-drift") ||
    note.includes("dead drift") ||
    note.includes("drift") ||
    note.includes("swing")
  ) {
    return "natural drift";
  }
  if (
    note.includes("bottom") ||
    note.includes("drag") ||
    note.includes("crawl") ||
    note.includes("hop")
  ) {
    return "bottom contact";
  }
  if (
    note.includes("pop") ||
    note.includes("walk") ||
    note.includes("surface")
  ) {
    return "surface commotion";
  }
  if (
    note.includes("pause") ||
    motions.includes("walk_pause") ||
    motions.includes("pop_pause")
  ) {
    return "pause-heavy";
  }
  if (
    note.includes("twitch") ||
    motions.includes("twitch_pause")
  ) {
    return "subtle twitch";
  }
  return "steady";
}

function lanePhrase(lane: SimplifiedPresentationLane): string {
  if (lane === "upper") return "the upper lane";
  if (lane === "mid") return "the mid lane";
  if (lane === "lower") return "the lower lane";
  return "the bottom lane";
}

function buildSimplifiedGuide(
  family: FamilyDefinition,
  method: FamilyMethodDefinition,
  behavior: BehaviorResolution,
  topArchetype: PresentationArchetypeScore | undefined,
): SimplifiedPresentationGuide {
  const topDepth = behavior.fish_behavior.position.depth_lanes[0]?.id;
  const pace = simplifiedPace(topArchetype?.speed);
  let lane = simplifiedLane(topArchetype?.depth_target, topDepth);
  const action = simplifiedAction(method, topArchetype);

  let summary = `Fish it ${pace} through ${lanePhrase(lane)} with a steady presentation.`;
  if (action === "natural drift") {
    summary = `Fish it ${pace} through ${lanePhrase(lane)} with a natural drift.`;
  } else if (action === "bottom contact") {
    summary = `Fish it ${pace} along ${lanePhrase(lane)} and keep steady bottom contact.`;
  } else if (action === "surface commotion") {
    summary = `Fish it ${pace} on the surface with short pauses between moves.`;
  } else if (action === "subtle twitch") {
    summary = `Fish it ${pace} through ${lanePhrase(lane)} with small twitches and pauses.`;
  } else if (action === "pause-heavy") {
    summary = `Fish it ${pace} through ${lanePhrase(lane)} with long pauses.`;
  }

  if (family.id === "soft_stick_worm" && method.id === "weightless_fall") {
    lane = "upper";
    summary = "Fish it slow in the upper lane and let the fall do most of the work.";
  } else if (family.id === "soft_stick_worm" && method.id === "wacky_skip_pause") {
    lane = "upper";
    summary = "Fish it slow in the upper lane with long pauses tight to cover.";
  } else if (family.id === "inline_spinner") {
    summary = `Fish it ${pace} through ${lanePhrase(lane)} with a steady swing through current.`;
  } else if (family.id === "compact_spoon") {
    summary = `Fish it ${pace} through ${lanePhrase(lane)} and let it flash on the swing or fall.`;
  }

  return { pace, lane, action, summary };
}

function archetypeMatchScore(
  family: FamilyDefinition,
  archetypes: PresentationArchetypeScore[],
): { score: number; reasons: string[] } {
  const matches = archetypes.filter((archetype) =>
    family.presentation_archetype_fit.includes(archetype.archetype_id)
  );
  if (matches.length === 0) return { score: 0, reasons: [] };
  const score = matches.reduce((sum, match, index) => sum + match.score * (index === 0 ? 0.75 : 0.35), 0);
  return {
    score,
    reasons: matches.slice(0, 2).map((match) => `fits ${match.archetype_id.replaceAll("_", " ")}`),
  };
}

// Rough depth-feet equivalents for each depth lane ID — used for physical depth gating.
// These are approximate midpoints or worst-case depths for the category.
const DEPTH_LANE_FEET: Partial<Record<string, number>> = {
  very_shallow: 1,
  shallow: 4,
  mid_depth: 10,
  deep: 20,
  suspended: 12,
  bottom_oriented: 18,
  upper_column: 3,
  lower_column: 14,
};

function depthAndRelationScore(
  family: FamilyDefinition,
  behavior: BehaviorResolution,
): { score: number; reasons: string[] } {
  const topDepths = behavior.fish_behavior.position.depth_lanes.map((item) => item.id);
  const topRelations = behavior.fish_behavior.position.relation_tags.map((item) => item.id);
  const depthHits = overlapCount(family.depth_lane_fit, topDepths);
  const relationHits = overlapCount(family.relation_fit, topRelations);
  const reasons: string[] = [];
  if (depthHits > 0) reasons.push("matches the preferred depth lane");
  if (relationHits > 0) reasons.push("matches the main cover or structure setup");

  // ── Physical depth gating ──────────────────────────────────────────────────
  // If the family physically cannot reach where fish are holding, apply a score
  // penalty. This prevents recommending topwater on fish holding 20 feet deep.
  let depthPenalty = 0;
  const range = family.depth_range_ft;
  if (range != null && topDepths.length > 0) {
    const primaryDepthLabel = topDepths[0];
    const targetFeet = DEPTH_LANE_FEET[primaryDepthLabel] ?? 0;
    if (targetFeet > range.max * 1.4) {
      // Fish are well below the family's physical max depth
      depthPenalty = -18;
      reasons.push("limited reach — fish are deeper than this lure/fly can effectively work");
    } else if (targetFeet > range.max) {
      // Fish are just beyond the comfortable range but not impossibly deep
      depthPenalty = -8;
    }
  }

  return {
    score: Math.max(0, depthHits * 9 + relationHits * 6 + depthPenalty),
    reasons,
  };
}

type EnvironmentalScoreBreakdown = {
  seasonal: number;
  daily: number;
  clarity: number;
  reasons: string[];
};

function clarityTraitScore(
  family: FamilyDefinition,
  clarity: BehaviorResolution["inferred_clarity"],
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (family.clarity_fit.includes(clarity)) {
    score += 4;
    reasons.push(`${clarity} water fit`);
  } else if (clarity === "dirty") {
    score -= 6;
    reasons.push("visibility mismatch for dirty water");
  } else if (clarity === "clear") {
    score -= 4;
    reasons.push("profile is louder than the clear-water window wants");
  } else {
    score -= 2;
  }

  if (clarity === "dirty") {
    if (family.vibration_level === "strong") score += 3;
    else if (family.vibration_level === "medium") score += 2;
    if (family.silhouette === "bulky") score += 3;
    else if (family.silhouette === "medium") score += 1;
    if (family.depriors.includes("dirty_water")) score -= 3;
  } else if (clarity === "clear") {
    if (family.vibration_level === "subtle") score += 2;
    if (family.silhouette === "slim") score += 2;
    else if (family.silhouette === "medium") score += 1;
  } else {
    if (family.vibration_level === "medium" || family.vibration_level === "strong") score += 1;
    if (family.silhouette === "medium" || family.silhouette === "bulky") score += 1;
  }

  if (score >= 6) reasons.push("profile and vibration fit the visibility level");
  return { score, reasons };
}

function contextCurationScore(
  family: FamilyDefinition,
  behavior: BehaviorResolution,
  input: RecommenderRunInput,
): { seasonal: number; daily: number; reasons: string[] } {
  let seasonal = 0;
  let daily = 0;
  const reasons: string[] = [];
  const context = input.request.context;
  const activity = behavior.fish_behavior.behavior.activity;

  if (context === "freshwater_river") {
    const riverHoldingDepth = behavior.fish_behavior.position.depth_lanes[0]?.id;
    const mainRelation = behavior.fish_behavior.position.relation_tags[0]?.id;
    const coldRiverWindow = ["winter_hold", "late_fall", "spring_transition"].includes(behavior.season_phase);
    const seamDriven =
      mainRelation === "seam_oriented" || mainRelation === "current_break_oriented" || mainRelation === "hole_oriented";
    const riffleDriven = mainRelation === "riffle_oriented";
    const tailoutDriven = mainRelation === "tailout_oriented";
    const poolDriven = mainRelation === "pool_oriented";

    if (["inline_spinner", "compact_spoon", "nymph_rig", "weighted_streamer", "woolly_bugger_leech"].includes(family.id)) {
      seasonal += 5;
      reasons.push("broad river-water fit");
    }
    if (family.id === "finesse_worm") {
      seasonal -= seamDriven ? 14 : 10;
      reasons.push("less river-native than the current-driven options");
    } else if (family.id === "jig_trailer") {
      seasonal -= seamDriven ? 9 : 6;
    }
    // Soft plastics and crankbaits can work in river eddies/pockets but rank behind current-native tools
    if (family.id === "soft_stick_worm" || family.id === "crankbait_shallow_mid") {
      if (riffleDriven || seamDriven) {
        seasonal -= 8;
        reasons.push("current-seam or riffle zone favors current-native presentations");
      } else {
        seasonal -= 4;
        reasons.push("river pocket approach — current-native tools still lead");
      }
    }

    // ── River structural zone routing ──────────────────────────────────────────
    if (riffleDriven) {
      // Riffles: shallow, oxygenated, fast — spinner and nymph are king
      if (family.id === "inline_spinner") {
        daily += 6;
        reasons.push("riffles are the inline spinner's home water");
      }
      if (family.id === "nymph_rig") {
        daily += 8;
        reasons.push("riffle nymphing is the most productive approach in moving water");
      }
      if (family.id === "dry_emerger") {
        daily += 6;
        reasons.push("riffles are prime hatch zones — fish look up here");
      }
      if (family.id === "woolly_bugger_leech") {
        daily += 3;
        reasons.push("bugger swings well through the tail of riffle pockets");
      }
      if (family.id === "compact_spoon") {
        daily -= 5;
        reasons.push("compact spoon is less targeted in fast shallow riffle water");
      }
    }

    if (tailoutDriven) {
      // Tailouts: slowing tail of a pool — great swing and nymph water; risers common
      if (family.id === "nymph_rig") {
        daily += 6;
        reasons.push("tailouts are classic nymph intercept positions");
      }
      if (family.id === "compact_spoon") {
        daily += 5;
        reasons.push("tailout swing — spoon flash covers the current edge cleanly");
      }
      if (family.id === "dry_emerger") {
        daily += 5;
        reasons.push("tailouts see consistent surface feeders during hatches");
      }
      if (family.id === "woolly_bugger_leech") {
        daily += 4;
        reasons.push("bugger swings the tailout lane naturally");
      }
    }

    if (poolDriven) {
      // Pools: deeper, slower — cold refuge; spoon flash and subsurface presentations lead
      if (family.id === "compact_spoon") {
        daily += 8;
        reasons.push("pools are spoon water — fish hold deep and react to flash");
      }
      if (family.id === "nymph_rig") {
        daily += 5;
        reasons.push("deep pool nymphing — adjust weight to get down");
      }
      if (family.id === "woolly_bugger_leech") {
        daily += 5;
        reasons.push("slow swing or strip through the pool column");
      }
      if (family.id === "inline_spinner") {
        daily -= 6;
        reasons.push("pool water is too slow and deep for blade efficiency");
      }
    }

    // ── Hatch window ──────────────────────────────────────────────────────────
    if (behavior.style_flags.includes("hatch_window")) {
      if (family.id === "dry_emerger") {
        daily += 10;
        reasons.push("hatch window active — dry/emerger is the priority call");
      } else if (family.id === "nymph_rig") {
        daily += 4;
        reasons.push("hatch window — nymphs below the surface column still produce");
      } else if (family.id === "terrestrial_hopper") {
        daily -= 3; // don't compete with dry_emerger during an active hatch
      }
    }

    if (
      behavior.current_profile !== "slack" &&
      ["inline_spinner", "compact_spoon", "weighted_streamer", "nymph_rig"].includes(family.id)
    ) {
      daily += 3;
    }
    if (behavior.style_flags.includes("current_drift_best")) {
      if (["inline_spinner", "compact_spoon", "weighted_streamer", "nymph_rig", "woolly_bugger_leech"].includes(family.id)) {
        daily += 6;
        reasons.push("current-driven river windows favor drift-native families");
      }
      if (family.id === "finesse_worm" || family.id === "jig_trailer") {
        daily -= 8;
        reasons.push("current-driven river windows de-prioritize bass-style bottom plastics");
      }
    }
    if (family.id === "compact_spoon" && (coldRiverWindow || riverHoldingDepth === "lower_column" || riverHoldingDepth === "bottom_oriented")) {
      daily += 10;
      reasons.push("cooler river lanes favor a compact flash read over bass-style plastics");
    }
    if (
      family.id === "inline_spinner" &&
      !coldRiverWindow &&
      (behavior.fish_behavior.behavior.activity === "active" || behavior.fish_behavior.behavior.activity === "aggressive")
    ) {
      daily += 4;
      reasons.push("active river fish favor a cleaner moving current tool");
    }
  }

  if (context === "freshwater_lake_pond") {
    const lakePhase = behavior.season_phase;
    const hasBaitfishMatch = behavior.style_flags.includes("baitfish_match");
    const hasTopwaterWindow = behavior.style_flags.includes("topwater_window");
    const hasFinesseBest = behavior.style_flags.includes("finesse_best");

    // ── Winter / Late-fall: slow and deep — jig and finesse are the two calls ──
    if (lakePhase === "winter_hold" || lakePhase === "late_fall") {
      if (family.id === "jig_trailer") {
        seasonal += 6;
        reasons.push("winter lake — jig is the primary call for deep inactive fish on hard structure");
      } else if (family.id === "finesse_worm") {
        seasonal += 4;
        reasons.push("winter lake — drop shot or shaky head is the secondary slow-bottom call");
      } else if (family.id === "lipless_crankbait" && lakePhase === "winter_hold") {
        seasonal += 8;
        reasons.push("lipless crankbait yo-yo over deep grass is the defining winter lake technique");
      } else if (family.id === "lipless_crankbait") {
        seasonal += 5; // late_fall still great
      } else if (family.id === "jerkbait") {
        daily += 3; // suspended fish in clear cold water
      } else if (["paddle_tail_swimbait", "topwater_walker_popper", "frog_toad", "chatterbait", "spinnerbait"].includes(family.id)) {
        seasonal -= 6;
        reasons.push("fish are too deep and inactive for moving-water search tools");
      }
    }

    // ── Spring transition: crawfish peak + pre-spawn shallow movement ──────────
    if (lakePhase === "spring_transition") {
      if (family.id === "jig_trailer") {
        seasonal += 5;
        reasons.push("spring crawfish peak — jig is the #1 call as pre-spawn fish move to spawning flats");
      } else if (family.id === "crankbait_shallow_mid") {
        seasonal += 3;
        reasons.push("squarebill deflecting off shallow cover matches the spring crawfish bite");
      } else if (family.id === "lipless_crankbait") {
        seasonal += 4;
        reasons.push("lipless crankbait over spring grass flats — yo-yo or burn as fish begin to activate");
      } else if (family.id === "spinnerbait") {
        daily += 2; // spring search tool, still works
      }
    }

    // ── Summer pattern: topwater window = frog and walker lead ───────────────
    if (lakePhase === "summer_pattern" && hasTopwaterWindow) {
      if (family.id === "frog_toad") {
        seasonal += 6;
        reasons.push("topwater window — frog over shallow grass is the defining summer lake call");
      } else if (family.id === "topwater_walker_popper") {
        seasonal += 4;
        reasons.push("topwater window — walker or popper on open edges at dawn and dusk");
      } else if (family.id === "lipless_crankbait") {
        daily += 3;
        reasons.push("lipless crankbait along the grass edge at thermocline depth when fish move off the surface");
      }
    }

    // ── Summer heat: deep finesse is the game ─────────────────────────────────
    if (lakePhase === "summer_heat") {
      if (family.id === "jig_trailer") {
        seasonal += 5;
        reasons.push("summer heat — jig follows fish to deep wood and deep rock structure");
      } else if (family.id === "finesse_worm") {
        seasonal += 4;
        reasons.push("summer heat — drop shot off deep structure is the primary finesse call");
      } else if (family.id === "lipless_crankbait") {
        daily += 3;
        reasons.push("lipless at thermocline depth — yo-yo it along the deep grass edge during feeding windows");
      } else if (["topwater_walker_popper", "frog_toad", "spinnerbait", "chatterbait"].includes(family.id)) {
        daily -= 5;
        reasons.push("fish are too deep for sustained surface or shallow feeding in summer heat");
      }
    }

    // ── Fall baitfish blitz: moving search tools and baitfish match dominate ──
    if (lakePhase === "fall_feed" && hasBaitfishMatch) {
      if (family.id === "paddle_tail_swimbait") {
        seasonal += 6;
        reasons.push("fall baitfish blitz — paddle tail matches shad and perch schools precisely");
      } else if (family.id === "lipless_crankbait") {
        seasonal += 5;
        reasons.push("fall lipless crankbait — burn it through schooling baitfish on any depth flat");
      } else if (family.id === "crankbait_shallow_mid") {
        seasonal += 4;
        reasons.push("fall crankbait covers ground efficiently and matches the baitfish schooling pattern");
      } else if (family.id === "topwater_walker_popper") {
        daily += 3;
        reasons.push("fall topwater blowups on schooling fish are a real window — especially at dawn");
      } else if (family.id === "jig_trailer") {
        daily -= 3; // jig still works but baitfish match families lead
      }
    }
  }

  if (context === "coastal" || context === "coastal_flats_estuary") {
    const dirty = behavior.inferred_clarity === "dirty";
    const slower = activity === "inactive" || activity === "neutral";
    if (dirty && slower) {
      if (
        [
          "weighted_bottom_presentation",
          "shrimp_imitation",
          "jighead_minnow",
          "popping_cork_trailer",
          "shrimp_fly",
          "crab_fly",
        ].includes(family.id)
      ) {
        daily += 4;
        reasons.push("dirty inshore water favors easier-to-find lane tools");
      }
      if (family.id === "jerkbait") {
        daily -= 10;
        reasons.push("dirty inshore water de-prioritizes cleaner pause-bait reads");
      }
    }
  }

  if (
    context === "freshwater_lake_pond" &&
    input.request.region_key === "mountain_alpine" &&
    behavior.inferred_clarity === "clear"
  ) {
    if (family.id === "jerkbait" || family.id === "crankbait_shallow_mid") {
      daily += 3;
      reasons.push("clear alpine water favors cleaner baitfish search looks");
    }
    if (family.id === "spinnerbait" || family.id === "chatterbait") {
      daily -= 8;
    }
  }

  if (
    context === "freshwater_lake_pond" &&
    (behavior.climate_band === "warm" || behavior.climate_band === "tropical")
  ) {
    const tropicalLake = behavior.climate_band === "tropical";
    if (["baitfish_streamer", "weighted_streamer", "popper_surface_bug"].includes(family.id)) {
      seasonal += tropicalLake ? 8 : 4;
      reasons.push("warm-lake fly side leans toward baitfish or surface lane tools");
    }
    if (family.id === "nymph_rig") {
      seasonal -= tropicalLake ? 30 : 12;
      reasons.push("warm-lake fly side de-prioritizes trout-style subsurface rigs");
    } else if (family.id === "dry_emerger") {
      seasonal -= tropicalLake ? 24 : 9;
    } else if (family.id === "terrestrial_hopper") {
      seasonal -= tropicalLake ? 18 : 6;
    }
  }

  return { seasonal, daily, reasons };
}

function environmentalScore(
  family: FamilyDefinition,
  behavior: BehaviorResolution,
  input: RecommenderRunInput,
): EnvironmentalScoreBreakdown {
  let seasonal = 0;
  let daily = 0;
  const reasons: string[] = [];

  const preferredGroups = family.preferred_month_groups ?? [];
  if (preferredGroups.includes("all_year")) {
    seasonal += 3;
  }
  if (preferredGroups.includes(behavior.season_phase)) {
    seasonal += 8;
    reasons.push(`strong seasonal fit for ${behavior.season_phase.replaceAll("_", " ")}`);
  }
  const broaderSeasonHits = preferredGroups.filter((group) =>
    group !== "all_year" && group !== behavior.season_phase && behavior.month_groups.includes(group)
  );
  if (broaderSeasonHits.length > 0) {
    seasonal += Math.min(4, broaderSeasonHits.length * 2);
  }
  if (family.preferred_regions?.includes(input.request.region_key as RegionKey)) {
    seasonal += 2;
  }

  if (family.activity_fit.includes(behavior.fish_behavior.behavior.activity)) daily += 5;
  if (family.strike_zone_fit.includes(behavior.fish_behavior.behavior.strike_zone)) daily += 4;
  if (family.light_fit.includes(behavior.light_profile)) daily += 3;
  if ((family.daypart_fit ?? []).some((daypart) => behavior.best_dayparts.includes(daypart))) daily += 3;
  if (behavior.current_profile !== "slack" && family.current_suitability === "high") daily += 3;

  const forageHits = dominantForage(behavior).filter((forage) => family.forage_fit.includes(forage));
  if (forageHits.length > 0) {
    daily += forageHits.length * 3;
    reasons.push(`supports the ${forageHits.join(" / ")} cue`);
  }

  const clarity = clarityTraitScore(family, behavior.inferred_clarity);
  const curated = contextCurationScore(family, behavior, input);
  seasonal += curated.seasonal;
  daily += curated.daily;
  reasons.push(...clarity.reasons);
  reasons.push(...curated.reasons);

  return { seasonal, daily, clarity: clarity.score, reasons: uniq(reasons) };
}

function presentationMatchScore(
  family: FamilyDefinition,
  archetypes: PresentationArchetypeScore[],
): { score: number; reasons: string[] } {
  const top = archetypes[0];
  if (!top) return { score: 0, reasons: [] };
  let score = 0;
  const reasons: string[] = [];
  if (family.speed_fit.includes(top.speed)) score += 4;
  if (top.motions.some((motion) => family.motion_fit.includes(motion))) score += 5;
  if (top.triggers.some((trigger) => family.trigger_fit.includes(trigger))) score += 5;
  if (score > 0) reasons.push("matches the best presentation style");
  return { score, reasons };
}

function depriorityPenalty(
  family: FamilyDefinition,
  behavior: BehaviorResolution,
): number {
  let penalty = 0;
  const seasonMatch =
    family.preferred_month_groups == null ||
    family.preferred_month_groups.length === 0 ||
    family.preferred_month_groups.includes("all_year") ||
    family.preferred_month_groups.some((group) => behavior.month_groups.includes(group));

  if (!seasonMatch) {
    const surfaceLocked = family.presentation_archetype_fit.length === 1 &&
      family.presentation_archetype_fit[0] === "surface_low_light_commotion";
    penalty += surfaceLocked ? 16 : family.preferred_month_groups!.length <= 3 ? 10 : 6;
  }
  if (!family.activity_fit.includes(behavior.fish_behavior.behavior.activity)) penalty += 6;
  if (!family.strike_zone_fit.includes(behavior.fish_behavior.behavior.strike_zone)) penalty += 4;
  if (family.depriors.includes("bright_midday") && behavior.light_profile === "bright") penalty += 8;
  if (family.depriors.includes("dirty_water") && behavior.inferred_clarity === "dirty") penalty += 8;
  if (family.depriors.includes("surface_window") && behavior.style_flags.includes("topwater_window")) penalty -= 2;
  if (family.depriors.includes("cold_inactive") && behavior.fish_behavior.behavior.activity === "inactive") penalty += 10;
  if (family.depriors.includes("tight_cover_bright") && behavior.light_profile === "bright") penalty += 5;
  return penalty;
}

function rankFamilyMethods(
  family: FamilyDefinition,
  behavior: BehaviorResolution,
  archetypes: PresentationArchetypeScore[],
): {
  best: RankedFamilyMethod;
  debug: FamilyMethodScoreDebug["methods"];
} {
  const definitions = FAMILY_METHODS[family.id] ?? [{
    id: `${family.id}_default`,
    label: "Standard Presentation",
    presentation_note: family.how_to_fish[0] ?? "Fish it in the lane the engine selected.",
  }];
  const topDepths = behavior.fish_behavior.position.depth_lanes.map((item) => item.id);
  const topArchetypes = archetypes.slice(0, 2).map((item) => item.archetype_id);
  const topArchetype = archetypes[0];

  const scored = definitions.map((method) => {
    let score = 0;
    const reasons: string[] = [];

    if ((method.preferred_month_groups ?? []).includes(behavior.season_phase)) {
      score += 5;
      reasons.push("fits the seasonal window");
    }
    if ((method.preferred_month_groups ?? []).some((group) => behavior.month_groups.includes(group))) {
      score += 2;
    }
    if ((method.depth_lane_fit ?? []).some((depth) => topDepths.includes(depth))) {
      score += 5;
      reasons.push("matches the target depth lane");
    }
    if ((method.activity_fit ?? []).includes(behavior.fish_behavior.behavior.activity)) {
      score += 4;
      reasons.push("fits the fish activity level");
    }
    if ((method.clarity_fit ?? []).includes(behavior.inferred_clarity)) {
      score += 3;
      reasons.push("fits the water visibility");
    }
    if ((method.archetype_fit ?? []).some((id) => topArchetypes.includes(id))) {
      score += 8;
      reasons.push("matches the top presentation archetype");
    }
    const styleHits = overlapCount(method.style_flags ?? [], behavior.style_flags);
    if (styleHits > 0) {
      score += styleHits * 2;
      reasons.push("matches the current presentation style");
    }

    return {
      method_id: method.id,
      label: method.label,
      presentation_note: method.presentation_note,
      score,
      reasons: uniq(reasons).slice(0, 3),
    };
  });

  scored.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  const top = scored[0]!;
  const topDefinition = definitions.find((definition) => definition.id === top.method_id) ?? definitions[0]!;
  const setupLabel = setupLabelForMethod(family, topDefinition);
  const presentationGuide = buildSimplifiedGuide(family, topDefinition, behavior, topArchetype);
  return {
    best: {
      method_id: top.method_id,
      label: top.label,
      presentation_note: top.presentation_note,
      setup_label: setupLabel,
      presentation_guide: presentationGuide,
      reasons: top.reasons,
    },
    debug: scored.map((entry) => ({
      method_id: entry.method_id,
      score: entry.score,
      reasons: entry.reasons,
    })),
  };
}

export function rankFamilies(
  gearMode: RecommenderGearMode,
  behavior: BehaviorResolution,
  archetypes: PresentationArchetypeScore[],
  input: RecommenderRunInput,
): FamilyRankingResult {
  const candidates = FAMILY_LIBRARY.filter((family) =>
    family.gear_mode === gearMode && family.supported_contexts.includes(input.request.context)
  );

  const scored = candidates.map((family) => {
    const archetype = archetypeMatchScore(family, archetypes);
    const layout = depthAndRelationScore(family, behavior);
    const environmental = environmentalScore(family, behavior, input);
    const presentation = presentationMatchScore(family, archetypes);
    const penalty = depriorityPenalty(family, behavior);
    const method = rankFamilyMethods(family, behavior, archetypes);
    const score = Math.max(
      0,
      Number((
        archetype.score +
        layout.score +
        environmental.seasonal +
        environmental.daily +
        environmental.clarity +
        presentation.score -
        penalty
      ).toFixed(2)),
    );
    const reasons = uniq([
      ...archetype.reasons,
      ...layout.reasons,
      ...environmental.reasons,
      ...presentation.reasons,
      ...method.best.reasons,
    ]).slice(0, 4);
    const bestDayparts = family.daypart_fit.filter((daypart) => behavior.best_dayparts.includes(daypart));
    return {
      family,
      debug: {
        family_id: family.id,
        gear_mode: family.gear_mode,
        score,
        seasonal_score: environmental.seasonal,
        daily_score: environmental.daily,
        clarity_score: environmental.clarity,
        best_method_id: method.best.method_id,
        best_method_score: method.debug[0]?.score ?? 0,
        reasons,
      },
      methodDebug: {
        family_id: family.id,
        gear_mode: family.gear_mode,
        methods: method.debug,
      },
      ranked: {
        family_id: family.id,
        display_name: family.display_name,
        score,
        examples: family.example_names.slice(0, 3),
        match_reasons: reasons,
        best_method: method.best,
        color_profile_guidance: colorGuidance(behavior, family),
        how_to_fish: family.how_to_fish,
        best_dayparts: bestDayparts.length > 0 ? bestDayparts : behavior.best_dayparts.slice(0, 2),
      } satisfies RankedFamily,
    };
  });

  scored.sort((a, b) => b.ranked.score - a.ranked.score || a.family.display_name.localeCompare(b.family.display_name));

  return {
    ranked: scored.slice(0, 3).map((entry) => entry.ranked),
    debug_scores: scored.map((entry) => entry.debug).slice(0, 10),
    method_scores: scored.map((entry) => entry.methodDebug).slice(0, 10),
  };
}
