import type { WaterClarity } from "../../../contracts/input.ts";
import type {
  RecommenderV3ArchetypeProfile,
  RecommenderV3SeasonalRow,
} from "../../contracts.ts";

/** Mountain West April stained-trout-river runoff edge (non–state-specific slim streamer nudge). */
export function practicalityStateGuardsV3(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  clarity: WaterClarity,
): number {
  let delta = 0;
  if (
    clarity === "stained" &&
    seasonal.species === "trout" &&
    seasonal.context === "freshwater_river" &&
    seasonal.region_key === "mountain_west" &&
    seasonal.month === 4
  ) {
    // Runoff-edge April matrix: headline sculpin / bugger / clouser, not jerkbait + slim defaults.
    if (profile.gear_mode === "fly" && profile.id === "slim_minnow_streamer") {
      delta -= 2.55;
    }
  }
  return delta;
}
