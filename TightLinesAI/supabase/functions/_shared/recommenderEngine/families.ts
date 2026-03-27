import type {
  FamilyDefinition,
  PresentationArchetypeScore,
  RankedFamily,
  RecommenderGearMode,
  RecommenderRunInput,
} from "./contracts.ts";
import type { RegionKey } from "../howFishingEngine/contracts/mod.ts";
import type { BehaviorResolution } from "./modifiers.ts";
import { uniq } from "./helpers.ts";

type FamilyScoreDebug = {
  family_id: string;
  gear_mode: RecommenderGearMode;
  score: number;
  reasons: string[];
};

export type FamilyRankingResult = {
  ranked: RankedFamily[];
  debug_scores: FamilyScoreDebug[];
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

function environmentalScore(
  family: FamilyDefinition,
  behavior: BehaviorResolution,
  input: RecommenderRunInput,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (family.clarity_fit.includes(behavior.inferred_clarity)) {
    score += 5;
    reasons.push(`${behavior.inferred_clarity} water fit`);
  }
  if (family.activity_fit.includes(behavior.fish_behavior.behavior.activity)) score += 5;
  if (family.strike_zone_fit.includes(behavior.fish_behavior.behavior.strike_zone)) score += 4;
  if (family.light_fit.includes(behavior.light_profile)) score += 3;
  if ((family.daypart_fit ?? []).some((daypart) => behavior.best_dayparts.includes(daypart))) score += 4;
  if ((family.preferred_month_groups ?? []).some((group) => behavior.month_groups.includes(group))) {
    score += 4;
  }
  if (family.preferred_regions?.includes(input.request.region_key as RegionKey)) score += 3;

  const vegetation = input.refinements.vegetation;
  if (vegetation === "heavy" && family.vegetation_affinity === "high") score += 4;
  if (vegetation === "none" && family.vegetation_affinity === "low") score += 2;

  if (behavior.current_profile !== "slack" && family.current_suitability === "high") score += 3;

  const forageHits = dominantForage(behavior).filter((forage) => family.forage_fit.includes(forage));
  if (forageHits.length > 0) {
    score += forageHits.length * 3;
    reasons.push(`supports the ${forageHits.join(" / ")} cue`);
  }

  return { score, reasons };
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
    const score = Math.max(
      0,
      Number((archetype.score + layout.score + environmental.score + presentation.score - penalty).toFixed(2)),
    );
    const reasons = uniq([
      ...archetype.reasons,
      ...layout.reasons,
      ...environmental.reasons,
      ...presentation.reasons,
    ]).slice(0, 4);
    const bestDayparts = family.daypart_fit.filter((daypart) => behavior.best_dayparts.includes(daypart));
    return {
      family,
      debug: {
        family_id: family.id,
        gear_mode: family.gear_mode,
        score,
        reasons,
      },
      ranked: {
        family_id: family.id,
        display_name: family.display_name,
        score,
        examples: family.example_names.slice(0, 3),
        match_reasons: reasons,
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
  };
}
