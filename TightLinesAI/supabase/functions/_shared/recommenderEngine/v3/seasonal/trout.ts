/** See `largemouth.ts` for the row-conversion strategy used by the rebuilt engine. */
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  PresentationStyleV3,
  RecommenderV3SeasonalRow,
  SeasonalLocationV3,
  SeasonalWaterColumnV3,
} from "../contracts.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";
import {
  baseSeasonalWaterColumn,
  finalizeSeasonalRows,
  shiftSeasonalWaterColumn,
  sortEligibleArchetypeIds,
  upsertSeasonalRow,
} from "./tuning.ts";

type LegacyWaterColumn = "top" | "shallow" | "mid" | "bottom";
type LegacyMood = "negative" | "neutral" | "active";

type LegacySeasonalCore = {
  base_water_column: LegacyWaterColumn;
  base_mood: LegacyMood;
  base_presentation_style: PresentationStyleV3;
  primary_forage: RecommenderV3SeasonalRow["primary_forage"];
  secondary_forage?: RecommenderV3SeasonalRow["secondary_forage"];
  primary_lure_archetypes?: readonly LureArchetypeIdV3[];
  viable_lure_archetypes: readonly LureArchetypeIdV3[];
  primary_fly_archetypes?: readonly FlyArchetypeIdV3[];
  viable_fly_archetypes: readonly FlyArchetypeIdV3[];
};

const TROUT_ROWS = new Map<string, RecommenderV3SeasonalRow>();

function inRegions(region_key: RegionKey, regions: readonly RegionKey[]): boolean {
  return regions.includes(region_key);
}

function resolveTroutSeasonalWaterColumn(
  region_key: RegionKey,
  month: number,
  core: LegacySeasonalCore,
): SeasonalWaterColumnV3 {
  let column = baseSeasonalWaterColumn(core.base_water_column);

  if ([12, 1, 2].includes(month) && column === "mid") {
    column = "mid_low";
  }

  if (inRegions(region_key, WARM_TAILWATER_REGIONS)) {
    if ([3, 4, 10, 11].includes(month) && column === "low") {
      column = "mid_low";
    }
    if ([6, 7, 8].includes(month) && column === "top") {
      column = "high";
    }
  } else {
    if ([4, 5, 6].includes(month) && column === "low") {
      column = "mid_low";
    }
    if ([7, 8, 9].includes(month) && column === "top") {
      column = "high";
    }
  }

  if ([5, 6, 7].includes(month) && column === "mid") {
    column = shiftSeasonalWaterColumn(column, 1);
  }

  return column;
}

function resolveTroutSeasonalLocation(
  month: number,
  column: SeasonalWaterColumnV3,
): SeasonalLocationV3 {
  switch (column) {
    case "top":
    case "high":
      return "shallow";
    case "mid":
      return [4, 5, 6, 7, 8, 9, 10].includes(month) ? "shallow_mid" : "mid";
    case "mid_low":
      return [12, 1, 2].includes(month) ? "mid_deep" : "mid";
    case "low":
    default:
      return "mid_deep";
  }
}

function toSeasonalRow(
  region_key: RegionKey,
  month: number,
  core: LegacySeasonalCore,
): RecommenderV3SeasonalRow {
  const typicalColumn = resolveTroutSeasonalWaterColumn(region_key, month, core);
  return {
    species: "trout",
    region_key,
    context: "freshwater_river",
    month,
    typical_seasonal_water_column: typicalColumn,
    typical_seasonal_location: resolveTroutSeasonalLocation(month, typicalColumn),
    primary_forage: core.primary_forage,
    secondary_forage: core.secondary_forage,
    eligible_lure_ids: sortEligibleArchetypeIds(core.viable_lure_archetypes),
    eligible_fly_ids: sortEligibleArchetypeIds(core.viable_fly_archetypes),
  };
}

function addMonths(
  regions: readonly RegionKey[],
  months: readonly number[],
  core: LegacySeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      upsertSeasonalRow(TROUT_ROWS, toSeasonalRow(region_key, month, core));
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
  "sculpzilla",
  "conehead_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "zonker_streamer",
];
// PNW winter pool: woolly leads so it wins the common 3-way tie on cold/negative
// days. PNW prespawn expectations treat woolly as a primary lane; sculpin is
// primary for mountain west but only acceptable_secondary for PNW.
const PNW_WINTER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "sculpin_streamer",
  "conehead_streamer",
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
  "bucktail_baitfish_streamer",
  "balanced_leech",
  "woolly_bugger",
  "sculpin_streamer",
  "muddler_sculpin",
  "zonker_streamer",
];
// Bugger-and-minnow spring fly pool for cold-classic freestone and tailwater
// rivers. Woolly bugger leads because it holds up across all mood/column
// combinations (including cold-front bottom-column days when slim minnow drops
// out of the top tier). Slim minnow and clouser fill out the baitfish lane.
const SLIM_MINNOW_SPRING_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "woolly_bugger",
  "slim_minnow_streamer",
  "bucktail_baitfish_streamer",
  "balanced_leech",
  "clouser_minnow",
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
  "bucktail_baitfish_streamer",
  "muddler_sculpin",
  "sculpzilla",
  "sculpin_streamer",
  "woolly_bugger",
  "zonker_streamer",
];

const COOL_SUMMER_RIVER_LURES: readonly LureArchetypeIdV3[] = [
  "inline_spinner",
  "casting_spoon",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "hair_jig",
];
const COOL_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "slim_minnow_streamer",
  "clouser_minnow",
  "bucktail_baitfish_streamer",
  "articulated_dungeon_streamer",
  "muddler_sculpin",
  "woolly_bugger",
  "zonker_streamer",
];
// Mouse-forward midsummer pool for western trout rivers where low-light bank
// windows can legitimately elevate a waking mouse over standard streamer lanes.
const MOUSE_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "mouse_fly",
  "slim_minnow_streamer",
  "muddler_sculpin",
  "clouser_minnow",
  "woolly_bugger",
  "zonker_streamer",
];
// Alaska-specific summer fly pool: sculpin and bugger lead over slim minnow to
// match the heavy-streamer character of Alaskan rivers in June–July.
const ALASKA_SUMMER_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "sculpin_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "slim_minnow_streamer",
  "muddler_sculpin",
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
  "sculpzilla",
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
  "articulated_dungeon_streamer",
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
  "articulated_dungeon_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
const NORTHEAST_FALL_PULSE_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "game_changer",
  "slim_minnow_streamer",
  "zonker_streamer",
  "sculpin_streamer",
  "woolly_bugger",
];
const GREAT_LAKES_LATEFALL_HIGHWATER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
  "slim_minnow_streamer",
  "game_changer",
  "sculpin_streamer",
  "zonker_streamer",
  "woolly_bugger",
];
const PACIFIC_NORTHWEST_LATEFALL_RIVER_FLIES: readonly FlyArchetypeIdV3[] = [
  "articulated_baitfish_streamer",
  "articulated_dungeon_streamer",
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
  "southeast_atlantic",
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
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [3, 4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [5], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [6, 7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
// Alaska summer: heavy streamer character calls for sculpin and bugger lanes
// over the slim-minnow-forward pool used by other cold-classic regions.
addMonths(["alaska"], [6, 7], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: ALASKA_SUMMER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [8], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
// Alaska late-fall: by November rivers are near or below freezing; fish shift
// to negative mood and slow bottom presentations. Override to WINTER pool so
// sculpin and leech-style flies win the fly slot (rather than active-favoring
// articulated baitfish), and cold-tolerant lures like blade_bait / hair_jig
// claim the lure side.
addMonths(["alaska"], [11], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(["northeast"], [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: NORTHEAST_FALL_PULSE_FLIES,
});
addMonths(["northeast"], [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  primary_fly_archetypes: [
    "articulated_baitfish_streamer",
    "articulated_dungeon_streamer",
  ],
  viable_fly_archetypes: NORTHEAST_LATEFALL_HIGHWATER_FLIES,
});
addMonths(["great_lakes_upper_midwest"], [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  primary_fly_archetypes: [
    "articulated_baitfish_streamer",
    "articulated_dungeon_streamer",
  ],
  viable_fly_archetypes: GREAT_LAKES_LATEFALL_HIGHWATER_FLIES,
});
addMonths(COLD_CLASSIC_REGIONS, [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Western classic trout rivers
addMonths(WESTERN_CLASSIC_REGIONS, [1, 2], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
// Pacific Northwest winter override: woolly-forward pool resolves the
// sculpin/woolly/rabbit 3-way score tie in woolly's favor, matching
// PNW prespawn expectations where woolly is a primary lane.
addMonths(["pacific_northwest"], [1, 2, 3], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "sculpin_streamer"],
  viable_fly_archetypes: PNW_WINTER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [3, 4, 5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "slim_minnow_streamer"],
  viable_fly_archetypes: SPRING_RIVER_FLIES,
});
addMonths(["mountain_west"], [5], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: WESTERN_SPRING_RIVER_LURES,
  primary_fly_archetypes: ["clouser_minnow", "slim_minnow_streamer"],
  viable_fly_archetypes: WESTERN_SPRING_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [6], {
  base_water_column: "shallow",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [7, 8], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
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
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["slim_minnow_streamer", "clouser_minnow"],
  viable_fly_archetypes: COOL_SUMMER_RIVER_FLIES,
});
// Western midsummer mouse window: keep the lure side on realistic trout search
// tools, but let mouse become a true primary fly lane on the right rivers.
addMonths(
  ["mountain_west", "inland_northwest", "northern_california"],
  [7, 8],
  {
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "insect_misc",
    primary_lure_archetypes: ["inline_spinner", "soft_jerkbait"],
    viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
    primary_fly_archetypes: ["mouse_fly", "slim_minnow_streamer"],
    viable_fly_archetypes: MOUSE_SUMMER_RIVER_FLIES,
  },
);
addMonths(WESTERN_CLASSIC_REGIONS, [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(["pacific_northwest"], [11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: [
    "articulated_baitfish_streamer",
    "articulated_dungeon_streamer",
  ],
  viable_fly_archetypes: PACIFIC_NORTHWEST_LATEFALL_RIVER_FLIES,
});
addMonths(["northern_california"], [10], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: WESTERN_FALL_RIVER_LURES,
  primary_fly_archetypes: [
    "slim_minnow_streamer",
    "articulated_baitfish_streamer",
  ],
  viable_fly_archetypes: WESTERN_FALL_RIVER_FLIES,
});
addMonths(WESTERN_CLASSIC_REGIONS, [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Warm tailwaters and southern highland trout water
addMonths(WARM_TAILWATER_REGIONS, [1, 2], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [4, 5], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "balanced_leech"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [3], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: SPRING_RIVER_LURES,
  primary_fly_archetypes: ["woolly_bugger", "slim_minnow_streamer"],
  viable_fly_archetypes: SLIM_MINNOW_SPRING_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [6], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["inline_spinner", "casting_spoon"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["muddler_sculpin", "woolly_bugger"],
  viable_fly_archetypes: WARM_SUMMER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [7, 8], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "hair_jig"],
  viable_lure_archetypes: WARM_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["muddler_sculpin", "woolly_bugger"],
  viable_fly_archetypes: WARM_SUMMER_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [9, 10, 11], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: FALL_RIVER_LURES,
  primary_fly_archetypes: ["articulated_baitfish_streamer", "game_changer"],
  viable_fly_archetypes: FALL_RIVER_FLIES,
});
addMonths(WARM_TAILWATER_REGIONS, [12], {
  base_water_column: "mid",
  base_mood: "negative",
  base_presentation_style: "subtle",
  primary_forage: "leech_worm",
  secondary_forage: "baitfish",
  primary_lure_archetypes: ["suspending_jerkbait", "blade_bait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: WINTER_RIVER_FLIES,
});

// Mountain West April: sparse bucktail profile becomes a true clear-spring
// baitfish option instead of always trailing slim/clouser.
addMonths(["mountain_west"], [4], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "subtle",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["inline_spinner", "suspending_jerkbait"],
  viable_lure_archetypes: WESTERN_SPRING_RIVER_LURES,
  primary_fly_archetypes: [
    "bucktail_baitfish_streamer",
    "slim_minnow_streamer",
  ],
  viable_fly_archetypes: WESTERN_SPRING_RIVER_FLIES,
});

// Northeast November: slower rabbit-strip pulse gets a real high-water baitfish
// lane when trout are still chasing but do not want the biggest articulated
// profile.
addMonths(["northeast"], [11], {
  base_water_column: "mid",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["suspending_jerkbait", "inline_spinner"],
  viable_lure_archetypes: NORTHEAST_LATEFALL_HIGHWATER_LURES,
  primary_fly_archetypes: ["zonker_streamer", "articulated_baitfish_streamer"],
  viable_fly_archetypes: NORTHEAST_LATEFALL_HIGHWATER_FLIES,
});

// Desert tailwater late summer: heavier sculpin push deserves one explicit
// Sculpzilla window instead of always defaulting to muddler/bugger.
addMonths(["southwest_high_desert"], [8], {
  base_water_column: "bottom",
  base_mood: "neutral",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "crawfish",
  primary_lure_archetypes: ["hair_jig", "inline_spinner"],
  viable_lure_archetypes: WARM_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["sculpzilla", "sculpin_streamer"],
  viable_fly_archetypes: WARM_SUMMER_RIVER_FLIES,
});

// Pacific Northwest December: a weighted conehead finally gets one true cold
// current lane where depth control matters more than the softer bugger profile.
addMonths(["pacific_northwest"], [12], {
  base_water_column: "bottom",
  base_mood: "negative",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "leech_worm",
  primary_lure_archetypes: ["blade_bait", "suspending_jerkbait"],
  viable_lure_archetypes: WINTER_RIVER_LURES,
  primary_fly_archetypes: ["conehead_streamer", "sculpin_streamer"],
  viable_fly_archetypes: PNW_WINTER_RIVER_FLIES,
});

// Alaska July: open current and broad baitfish sweeps give the spoon one real
// midsummer flash-search lane instead of always sitting under inline spinner.
addMonths(["alaska"], [7], {
  base_water_column: "mid",
  base_mood: "active",
  base_presentation_style: "balanced",
  primary_forage: "baitfish",
  secondary_forage: "insect_misc",
  primary_lure_archetypes: ["casting_spoon", "inline_spinner"],
  viable_lure_archetypes: COOL_SUMMER_RIVER_LURES,
  primary_fly_archetypes: ["sculpin_streamer", "woolly_bugger"],
  viable_fly_archetypes: ALASKA_SUMMER_RIVER_FLIES,
});

export const TROUT_V3_SEASONAL_ROWS = finalizeSeasonalRows(TROUT_ROWS);
