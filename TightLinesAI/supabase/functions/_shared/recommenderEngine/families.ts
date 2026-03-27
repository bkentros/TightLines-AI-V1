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
    supported_contexts: ["freshwater_lake_pond"],
    preferred_month_groups: ["spring_transition", "warm_transition", "summer_pattern"],
    habitat_tags: ["cover", "docks", "shade", "grass"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["neutral", "active"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["shallow", "upper_column"],
    relation_fit: ["cover_oriented", "vegetation_oriented", "shade_oriented"],
    forage_fit: ["baitfish", "amphibian"],
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
    forage_fit: ["insect", "crustacean"],
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
    forage_fit: ["crustacean", "baitfish"],
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
    preferred_month_groups: ["summer_pattern", "summer_heat", "topwater_window", "fall_feed"],
    habitat_tags: ["shoreline", "grass_edge", "point"],
    vegetation_affinity: "medium",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["very_shallow", "upper_column"],
    relation_fit: ["shoreline_cruising", "edge_oriented", "grass_edge_oriented", "marsh_edge_oriented"],
    forage_fit: ["baitfish", "amphibian"],
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
    supported_contexts: ["freshwater_lake_pond"],
    preferred_month_groups: ["spring_transition", "warm_transition", "fall_feed"],
    habitat_tags: ["rock", "point", "breakline"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth"],
    relation_fit: ["point_oriented", "depth_transition_oriented", "structure_oriented"],
    forage_fit: ["baitfish"],
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
    strike_zone_fit: ["moderate", "wide"],
    depth_lane_fit: ["shallow", "mid_depth", "upper_column"],
    relation_fit: ["seam_oriented", "current_break_oriented", "undercut_bank_oriented", "structure_oriented"],
    forage_fit: ["baitfish", "insect"],
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
    forage_fit: ["insect", "baitfish"],
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
    preferred_month_groups: ["winter_hold", "spring_transition", "late_fall"],
    habitat_tags: ["seam", "riffle_run", "hole"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["inactive", "neutral"],
    strike_zone_fit: ["narrow", "moderate"],
    depth_lane_fit: ["lower_column", "bottom_oriented"],
    relation_fit: ["seam_oriented", "hole_oriented", "current_break_oriented"],
    forage_fit: ["insect"],
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
    preferred_month_groups: ["warm_transition", "summer_pattern"],
    habitat_tags: ["riffle_run", "shoreline", "shade"],
    vegetation_affinity: "low",
    clarity_fit: ["clear", "stained"],
    activity_fit: ["active", "aggressive"],
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
    preferred_month_groups: ["summer_pattern", "summer_heat"],
    habitat_tags: ["bank", "grass", "shade"],
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
};

for (const family of FAMILY_LIBRARY) {
  if (!FAMILY_METHODS[family.id] || FAMILY_METHODS[family.id]!.length === 0) {
    throw new Error(`Missing canonical methods for recommender family: ${family.id}`);
  }
}

function dominantForage(behavior: BehaviorResolution): string[] {
  const forage = behavior.fish_behavior.forage;
  const entries = [
    ["baitfish", forage.baitfish_bias],
    ["crustacean", forage.crustacean_bias],
    ["insect", forage.insect_bias],
    ["amphibian", forage.amphibian_surface_bias ?? 0],
  ] as const;
  const top = [...entries].sort((a, b) => b[1] - a[1]).slice(0, 2);
  return top.filter(([, score]) => score > 0.2).map(([id]) => id);
}

function colorGuidance(behavior: BehaviorResolution, family: FamilyDefinition): string[] {
  const notes: string[] = [];
  switch (behavior.inferred_clarity) {
    case "clear":
      notes.push("lean natural: olive, tan, translucent, green pumpkin");
      break;
    case "stained":
      notes.push("lean contrast: white, chartreuse accents, darker back");
      break;
    case "dirty":
      notes.push("lean visibility: dark silhouette, black-blue, chartreuse");
      break;
  }
  const forage = dominantForage(behavior);
  if (forage.includes("crustacean")) notes.push("rust, brown, and amber profiles fit the forage cue");
  if (forage.includes("baitfish")) notes.push("white, silver, pearl, and olive baitfish profiles are strong");
  if (family.id === "frog_toad") notes.push("dark silhouettes or natural frog tones are usually the cleanest call");
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
  return {
    score: depthHits * 9 + relationHits * 6,
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
    ranked: scored.slice(0, 5).map((entry) => entry.ranked),
    debug_scores: scored.map((entry) => entry.debug).slice(0, 10),
    method_scores: scored.map((entry) => entry.methodDebug).slice(0, 10),
  };
}
