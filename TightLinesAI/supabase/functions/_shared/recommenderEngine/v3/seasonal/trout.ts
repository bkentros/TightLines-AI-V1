import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3SeasonalRow,
} from "../contracts.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

type SeasonalCore = Omit<RecommenderV3SeasonalRow, "species" | "region_key" | "month" | "context">;

const TROUT_ROWS: RecommenderV3SeasonalRow[] = [];

function addMonths(
  regions: readonly RegionKey[],
  months: readonly number[],
  core: SeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      TROUT_ROWS.push({
        species: "trout",
        region_key,
        context: "freshwater_river",
        month,
        ...core,
      });
    }
  }
}

const WINTER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "blade_bait",
  "casting_spoon",
  "hair_jig",
  "paddle_tail_swimbait",
];
const WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "conehead_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "zonker_streamer",
];

const SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
];
const SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "woolly_bugger",
  "sculpin_streamer",
  "muddler_sculpin",
  "zonker_streamer",
];

const WESTERN_SPRING_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "suspending_jerkbait",
  "casting_spoon",
  "soft_jerkbait",
  "paddle_tail_swimbait",
];
const WESTERN_SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "clouser_minnow",
  "slim_minnow_streamer",
  "muddler_sculpin",
  "sculpin_streamer",
  "woolly_bugger",
  "zonker_streamer",
];

const COOL_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
];
const COOL_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "muddler_sculpin",
  "woolly_bugger",
  "zonker_streamer",
];

const WARM_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "hair_jig",
  "suspending_jerkbait",
  "casting_spoon",
  "paddle_tail_swimbait",
];
const WARM_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "muddler_sculpin",
  "slim_minnow_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "sculpin_streamer",
];

const FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
  "casting_spoon",
  "soft_jerkbait",
  "hair_jig",
];
const FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "game_changer",
  "slim_minnow_streamer",
  "zonker_streamer",
  "sculpin_streamer",
  "mouse_fly",
];

const WESTERN_FALL_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "casting_spoon",
  "hair_jig",
];
const WESTERN_FALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "articulated_baitfish_streamer",
  "game_changer",
  "zonker_streamer",
  "sculpin_streamer",
  "mouse_fly",
];

const NORTHEAST_LATEFALL_HIGHWATER_LURES: readonly LureArchetypeIdV3[] = [
  "suspending_jerkbait",
  "inline_spinner",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "hair_jig",
];
const NORTHEAST_LATEFALL_HIGHWATER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
const NORTHEAST_FALL_PULSE_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "game_changer",
  "slim_minnow_streamer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
const GREAT_LAKES_LATEFALL_HIGHWATER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "sculpin_streamer",
  "zonker_streamer",
  "woolly_bugger",
];
const PACIFIC_NORTHWEST_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];

const COLD_CLASSIC_REGIONS: readonly RegionKey[] = [
  "northeast",
  "great_lakes_upper_midwest",
  "alaska",
  "mountain_alpine",
];
const WESTERN_CLASSIC_REGIONS: readonly RegionKey[] = [
  "mountain_west",
  "pacific_northwest",
  "inland_northwest",
  "northern_california",
];
const WARM_TAILWATER_REGIONS: readonly RegionKey[] = [
  "appalachian",
  "south_central",
  "midwest_interior",
  "southwest_high_desert",
  "southern_california",
];

export const TROUT_V3_SUPPORTED_REGIONS: readonly RegionKey[] = [
  ...COLD_CLASSIC_REGIONS,
  ...WESTERN_CLASSIC_REGIONS,
  ...WARM_TAILWATER_REGIONS,
];

// Cold classic trout water
addMonths(COLD_CLASSIC_REGIONS, [1, 2], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [5], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [6, 7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [8], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(["northeast"], [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: NORTHEAST_FALL_PULSE_FLIES,
});
addMonths(["northeast"], [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  viable_fly_archetypes: NORTHEAST_LATEFALL_HIGHWATER_FLIES,
});
addMonths(["great_lakes_upper_midwest"], [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  viable_fly_archetypes: GREAT_LAKES_LATEFALL_HIGHWATER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Western classic trout rivers
addMonths(WESTERN_CLASSIC_REGIONS, [1, 2, 3], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [4, 5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(["mountain_west"], [5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WESTERN_SPRING_RIVER_LURES,
  viable_fly_archetypes: WESTERN_SPRING_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [7, 8], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
// Mountain West and Inland Northwest midsummer: runoff and stained-water
// conditions push toward visible search presentations, not subtle finesse.
addMonths(["mountain_west", "inland_northwest"], [7, 8], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(["pacific_northwest"], [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: PACIFIC_NORTHWEST_LATEFALL_RIVER_FLIES,
});
addMonths(["northern_california"], [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WESTERN_FALL_RIVER_LURES,
  viable_fly_archetypes: WESTERN_FALL_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Warm tailwaters and southern highland trout water
addMonths(WARM_TAILWATER_REGIONS, [1, 2], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [3, 4, 5], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: SPRING_RIVER_LURES,
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [6], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [7, 8], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: WARM_SUMMER_RIVER_LURES,
  viable_fly_archetypes: WARM_SUMMER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  viable_lure_archetypes: FALL_RIVER_LURES,
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  viable_lure_archetypes: WINTER_RIVER_LURES,
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

export const TROUT_V3_SEASONAL_ROWS = TROUT_ROWS;
