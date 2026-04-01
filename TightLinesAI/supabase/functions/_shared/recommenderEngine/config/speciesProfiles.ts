/**
 * Species seasonal baseline profiles.
 *
 * Each profile encodes what a species is LIKELY doing in a given region group
 * and month — before context or daily condition modifiers are applied.
 *
 * Profiles are keyed by `{species}_{region_group}_{month}`.
 * The resolver finds the best match via exact lookup, then falls back to
 * the nearest month in the same region group.
 *
 * Region groups (collapsed from the 18-region engine system):
 *   northeast_coldwater   — ME, NH, VT, MA, RI, CT, NY, PA, NJ, MD, DE, WV, MI, WI, MN
 *   southeast_warmwater   — VA, NC, SC, GA, AL, MS, TN, AR, KY, LA (inland)
 *   florida_gulf          — FL, south TX coast, gulf fishery states (coastal/warm)
 *   midwest_plains        — OH, IN, IL, IA, MO, KS, NE, ND, SD, MN (south), WI (south)
 *   mountain_west         — MT, ID, WY, CO, UT, NV, AZ, NM, WA, OR, CA
 *   atlantic_coast        — Coastal strip ME to FL for striped bass + coastal species
 */

import type {
  ActivityLevel,
  AggressionLevel,
  ChaseRadius,
  DepthLane,
  ForageMode,
  SeasonalFlag,
  SpeedPreference,
  StrikeZone,
} from "../contracts/behavior.ts";
import type { SpeciesGroup } from "../contracts/species.ts";

export type SpeciesRegionGroup =
  | "northeast_coldwater"
  | "southeast_warmwater"
  | "florida_gulf"
  | "midwest_plains"
  | "mountain_west"
  | "atlantic_coast";

export type SpeciesBaselineProfile = {
  species: SpeciesGroup;
  region_group: SpeciesRegionGroup;
  month: number;

  // Activity state
  activity_baseline: ActivityLevel;
  aggression_baseline: AggressionLevel;

  // Position
  depth_tendency: DepthLane;
  habitat_tags: string[];

  // Behavior
  chase_tendency: ChaseRadius;
  strike_zone_baseline: StrikeZone;

  // Forage
  primary_forage: ForageMode;
  secondary_forage?: ForageMode;

  // Presentation bias
  topwater_likelihood: "none" | "low" | "moderate" | "high";
  speed_bias: SpeedPreference;

  // Biological gates — species-specific hard temperature constraints
  temp_floor_f?: number;   // activity collapses below this water temp
  temp_ceiling_f?: number; // activity collapses above this water temp (heat stress)

  // Timing
  low_light_preference: boolean;  // walleye = true
  crepuscular_peak: boolean;      // strong dawn/dusk preference

  // Seasonal context
  seasonal_flag?: SeasonalFlag;
};

// ─── Profile registry ─────────────────────────────────────────────────────────

const profiles: SpeciesBaselineProfile[] = [];

function add(p: SpeciesBaselineProfile) {
  profiles.push(p);
}

// ─── Helper: repeat a profile across a range of months ───────────────────────

function addMonths(
  months: number[],
  base: Omit<SpeciesBaselineProfile, "month">,
) {
  for (const month of months) {
    add({ ...base, month });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LARGEMOUTH BASS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Florida / Gulf (warm climate) ────────────────────────────────────────────
// Jan–Feb: Winter pattern, deeper, slow, suspending near structure
addMonths([1, 2], {
  species: "largemouth_bass", region_group: "florida_gulf",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_structure", "bridge_shadow", "dock_shadow"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
// Mar: Pre-spawn moving up, feeding aggressively
add({
  species: "largemouth_bass", region_group: "florida_gulf", month: 3,
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["grass_edge", "points", "shallow_flat"],
  chase_tendency: "moderate", strike_zone_baseline: "wide",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
// Apr: Spawning beds — territorial, sight-fishing, aggressive on nest
add({
  species: "largemouth_bass", region_group: "florida_gulf", month: 4,
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["spawning_flat", "hard_bottom", "grass_edge"],
  chase_tendency: "short", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "moderate", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
// May: Post-spawn recovery, scattered, harder to locate
add({
  species: "largemouth_bass", region_group: "florida_gulf", month: 5,
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["structure", "grass_edge", "mid_depth"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "crawfish",
  topwater_likelihood: "low", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "post_spawn",
});
// Jun–Aug: Summer heat stress, push deeper or into grass, early morning/evening only
addMonths([6, 7, 8], {
  species: "largemouth_bass", region_group: "florida_gulf",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_grass", "shade", "thermocline_break"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "low",
  speed_bias: "slow", temp_ceiling_f: 90,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "post_spawn",
});
// Sep–Oct: Fall transition, shad schools, fish move back active
addMonths([9, 10], {
  species: "largemouth_bass", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["points", "baitfish_schools", "grass_edge"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
// Nov–Dec: Cooling, good feeding before winter slowdown
addMonths([11, 12], {
  species: "largemouth_bass", region_group: "florida_gulf",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["points", "structure", "mid_depth"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
});

// ── Southeast warmwater (VA, NC, SC, GA, AL, MS, TN, KY, AR) ─────────────────
addMonths([1, 2], {
  species: "largemouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_structure", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4], {
  species: "largemouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["spawning_flat", "grass_edge", "points"],
  chase_tendency: "moderate", strike_zone_baseline: "wide",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
add({
  species: "largemouth_bass", region_group: "southeast_warmwater", month: 5,
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["spawning_flat", "hard_bottom"],
  chase_tendency: "short", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", topwater_likelihood: "low", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([6, 7, 8], {
  species: "largemouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_structure", "shade", "thermocline_break"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "low",
  speed_bias: "slow", temp_ceiling_f: 90,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "post_spawn",
});
addMonths([9, 10, 11], {
  species: "largemouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["points", "baitfish_schools", "grass_edge"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "largemouth_bass", region_group: "southeast_warmwater", month: 12,
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["structure", "channel_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
});

// ── Northeast coldwater (MA, NY, PA, etc.) ────────────────────────────────────
addMonths([1, 2, 3], {
  species: "largemouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_basin", "hard_bottom", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "largemouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["points", "warming_cove", "shallow_flat"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
add({
  species: "largemouth_bass", region_group: "northeast_coldwater", month: 6,
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["spawning_flat", "hard_bottom", "grass_edge"],
  chase_tendency: "short", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", topwater_likelihood: "moderate", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([7, 8], {
  species: "largemouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["grass_edge", "docks", "shade", "points"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "high", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10], {
  species: "largemouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["points", "baitfish_schools", "rocky_shore"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "largemouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "low", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["deep_structure", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: false,
});

// ── Midwest / Plains (similar to northeast but slightly warmer) ───────────────
// Use same profiles as northeast but slightly earlier spring
addMonths([1, 2], {
  species: "largemouth_bass", region_group: "midwest_plains",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_basin", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([3, 4], {
  species: "largemouth_bass", region_group: "midwest_plains",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["points", "warming_cove", "grass_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([5, 6], {
  species: "largemouth_bass", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["spawning_flat", "hard_bottom", "points"],
  chase_tendency: "short", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", topwater_likelihood: "moderate", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([7, 8], {
  species: "largemouth_bass", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["grass_edge", "docks", "shade"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "high", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10], {
  species: "largemouth_bass", region_group: "midwest_plains",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["points", "baitfish_schools"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "largemouth_bass", region_group: "midwest_plains",
  activity_baseline: "low", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["deep_structure"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: false,
});

// Mountain West — largemouth marginal, similar to midwest but shorter season
addMonths([1, 2, 3, 11, 12], {
  species: "largemouth_bass", region_group: "mountain_west",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_basin"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "largemouth_bass", region_group: "mountain_west",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["warming_flat", "points"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", topwater_likelihood: "low", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([6, 7, 8, 9, 10], {
  species: "largemouth_bass", region_group: "mountain_west",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["rocky_shore", "docks", "points"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "crawfish",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ═══════════════════════════════════════════════════════════════════════════════
// SMALLMOUTH BASS
// ═══════════════════════════════════════════════════════════════════════════════

// Northeast coldwater — prime smallmouth territory
addMonths([1, 2, 3], {
  species: "smallmouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_pool", "channel_edge", "hard_bottom"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "smallmouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["rocky_flat", "gravel_bar", "points"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
add({
  species: "smallmouth_bass", region_group: "northeast_coldwater", month: 6,
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["gravel_flat", "rocky_point", "shoreline_rock"],
  chase_tendency: "short", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", topwater_likelihood: "moderate", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([7, 8], {
  species: "smallmouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["rocky_shore", "points", "shallow_reef"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "crawfish",
  topwater_likelihood: "high", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10], {
  species: "smallmouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["points", "rocky_shore", "baitfish_schools"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "smallmouth_bass", region_group: "northeast_coldwater",
  activity_baseline: "low", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["deep_structure", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: false,
});

// Midwest plains — smallmouth in rivers and some lakes
addMonths([1, 2, 3], {
  species: "smallmouth_bass", region_group: "midwest_plains",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_pool", "winter_hole"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "smallmouth_bass", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["gravel_bar", "rocky_flat", "riffle_tail"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([6, 7, 8], {
  species: "smallmouth_bass", region_group: "midwest_plains",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["rocky_shore", "riffle_tail", "points"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "crawfish",
  topwater_likelihood: "high", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10], {
  species: "smallmouth_bass", region_group: "midwest_plains",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["rocky_shore", "points", "baitfish_schools"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "smallmouth_bass", region_group: "midwest_plains",
  activity_baseline: "low", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "rock_ledge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: false,
});

// Mountain West smallmouth — superb fishery (Columbia, Snake, Ozarks analog)
addMonths([1, 2, 3, 12], {
  species: "smallmouth_bass", region_group: "mountain_west",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_pool", "eddy"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "smallmouth_bass", region_group: "mountain_west",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["gravel_bar", "riffle_tail", "rocky_bank"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([6, 7, 8, 9, 10, 11], {
  species: "smallmouth_bass", region_group: "mountain_west",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["rocky_shore", "riffle_tail", "points"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "crawfish",
  topwater_likelihood: "high", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// Southeast smallmouth — Appalachians, highland rivers
addMonths([1, 2], {
  species: "smallmouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
// Mar–Apr: Pre-spawn staging on transition structure (gravel bars, ledges)
addMonths([3, 4], {
  species: "smallmouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["gravel_bar", "rocky_flat", "riffle_tail"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
// May: Spawning in SE Appalachians — shallower gravel/cobble, territorial, aggressive on nest
add({
  species: "smallmouth_bass", region_group: "southeast_warmwater", month: 5,
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["gravel_bar", "cobble_flat", "spawning_flat"],
  chase_tendency: "short", strike_zone_baseline: "moderate",
  primary_forage: "crawfish", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([6, 7, 8, 9, 10], {
  species: "smallmouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["rocky_shore", "riffle_tail", "points"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "crawfish",
  topwater_likelihood: "high", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "smallmouth_bass", region_group: "southeast_warmwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_pool", "rock_ledge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: false,
});

// ═══════════════════════════════════════════════════════════════════════════════
// PIKE / MUSKY
// ═══════════════════════════════════════════════════════════════════════════════

// Northeast coldwater
addMonths([1, 2], {
  species: "pike_musky", region_group: "northeast_coldwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["weed_edge", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4], {
  species: "pike_musky", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["shallow_weeds", "spawning_flat", "marsh"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([5, 6, 7], {
  species: "pike_musky", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["weed_edge", "drop_off", "submerged_wood"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([8, 9, 10], {
  species: "pike_musky", region_group: "northeast_coldwater",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "mid", habitat_tags: ["deep_weed_edge", "drop_off", "points"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "pike_musky", region_group: "northeast_coldwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_weed_edge", "channel_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: true,
});

// Midwest plains — same pattern, slightly earlier spring
addMonths([1, 2, 3], {
  species: "pike_musky", region_group: "midwest_plains",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["channel_edge", "deep_weed_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6, 7], {
  species: "pike_musky", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["weed_edge", "submerged_wood", "drop_off"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([8, 9, 10, 11], {
  species: "pike_musky", region_group: "midwest_plains",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "mid", habitat_tags: ["deep_weed_edge", "points", "drop_off"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "pike_musky", region_group: "midwest_plains", month: 12,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: false, crepuscular_peak: false,
});

// Mountain West pike (CO, MT, ID, WY)
addMonths([1, 2, 3, 12], {
  species: "pike_musky", region_group: "mountain_west",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_weed_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6, 7, 8, 9, 10, 11], {
  species: "pike_musky", region_group: "mountain_west",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["weed_edge", "points", "submerged_structure"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "moderate",
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ═══════════════════════════════════════════════════════════════════════════════
// RIVER TROUT
// ═══════════════════════════════════════════════════════════════════════════════
// V1 scope: stream/river trout (rainbow, brown, brook). Streamer fly focus.
// temp_ceiling_f: 68 — stress above this, especially brook trout

// Northeast coldwater — prime trout rivers
addMonths([1, 2], {
  species: "river_trout", region_group: "northeast_coldwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "slow_eddy", "undercut_bank"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4, 5], {
  species: "river_trout", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "riffle_tail", "undercut_bank"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([6, 7, 8], {
  species: "river_trout", region_group: "northeast_coldwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_pool", "cold_seam", "shade"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10, 11], {
  species: "river_trout", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "pool_head", "riffle_tail"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "moderate", speed_bias: "fast",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "river_trout", region_group: "northeast_coldwater", month: 12,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "slow_eddy"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
});

// Mountain West — world-class trout rivers (MT, ID, WY, CO, OR, WA)
addMonths([1, 2, 3], {
  species: "river_trout", region_group: "mountain_west",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "slow_eddy"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6], {
  species: "river_trout", region_group: "mountain_west",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "riffle_tail", "pool_head"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([7, 8], {
  species: "river_trout", region_group: "mountain_west",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_pool", "cold_inflow", "shade"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10, 11], {
  species: "river_trout", region_group: "mountain_west",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "pool_head", "riffle_tail"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "river_trout", region_group: "mountain_west", month: 12,
  activity_baseline: "low", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "slow_eddy"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
});

// Southeast (Appalachians — VA, NC, TN highland streams)
addMonths([1, 2], {
  species: "river_trout", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "undercut_bank"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4, 5, 6], {
  species: "river_trout", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "riffle_tail", "pool_head"],
  chase_tendency: "moderate", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([7, 8], {
  species: "river_trout", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["cold_inflow", "deep_pool", "shade"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([9, 10, 11, 12], {
  species: "river_trout", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "riffle_tail", "pool_head"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ── River Trout — Midwest Plains (tailwaters: TN, OH, IN, MO, AR coldwater discharges) ──
// Cold-water tailwaters below dams are the primary trout habitat in the midwest
// plains. These fisheries are temperature-controlled year-round but have distinct
// seasonal patterns driven by dam generation and hatch activity.
addMonths([1, 2], {
  species: "river_trout", region_group: "midwest_plains",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["tailwater_pool", "deep_run", "current_seam"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "leech", secondary_forage: "baitfish",
  topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4, 5], {
  species: "river_trout", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["riffle_tail", "current_seam", "gravel_run"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([6, 7, 8], {
  species: "river_trout", region_group: "midwest_plains",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["coldwater_discharge", "deep_tailrace", "shade"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish",
  topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([9, 10, 11], {
  species: "river_trout", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["current_seam", "pool_head", "riffle_tail"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "leech",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "river_trout", region_group: "midwest_plains", month: 12,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_pool", "tailwater_pool", "slack_water"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish",
  topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_ceiling_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});

// ═══════════════════════════════════════════════════════════════════════════════
// WALLEYE
// ═══════════════════════════════════════════════════════════════════════════════
// Key trait: strongly low_light_preference. Activity drops in bright midday.
// Optimal temp: 55–68°F. Active even in cold (ice fishing species).

// Northeast coldwater
addMonths([1, 2], {
  species: "walleye", region_group: "northeast_coldwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["mud_flat", "deep_basin", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4], {
  species: "walleye", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["rocky_reef", "gravel_bar", "river_mouth"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "moderate",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([5, 6, 7, 8], {
  species: "walleye", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["hard_bottom", "weed_edge", "rock_point"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10, 11], {
  species: "walleye", region_group: "northeast_coldwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["points", "rock_reef", "hard_bottom"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "moderate",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "walleye", region_group: "northeast_coldwater", month: 12,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "near_bottom", habitat_tags: ["deep_basin", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: true, crepuscular_peak: true,
});

// Midwest plains — walleye heartland (MN, WI, IA, ND, SD)
addMonths([1, 2], {
  species: "walleye", region_group: "midwest_plains",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_basin", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4], {
  species: "walleye", region_group: "midwest_plains",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["rocky_reef", "gravel_bar", "inlet"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "moderate",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([5, 6, 7, 8, 9, 10], {
  species: "walleye", region_group: "midwest_plains",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["hard_bottom", "rock_point", "weed_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "walleye", region_group: "midwest_plains",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["channel_edge", "hard_bottom"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
});

// Mountain West walleye
addMonths([1, 2, 3, 12], {
  species: "walleye", region_group: "mountain_west",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_basin"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6, 7, 8, 9, 10, 11], {
  species: "walleye", region_group: "mountain_west",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["hard_bottom", "rock_point", "weed_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ── Walleye — Southeast Warmwater (marginal: VA, NC, TN mountain reservoirs) ──
// Walleye reach the southern edge of their range in Blue Ridge reservoirs and
// TN tailwaters. These fish hold deeper in summer (thermal stress) and peak in
// late winter/early spring. Low-light preference is even more pronounced due to
// clearer water compared to north/midwest fisheries.
addMonths([1, 2], {
  species: "walleye", region_group: "southeast_warmwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "near_bottom", habitat_tags: ["rocky_point", "channel_edge", "deep_structure"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([3, 4], {
  species: "walleye", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "mid", habitat_tags: ["gravel_shoal", "rocky_point", "spawning_flat"],
  chase_tendency: "moderate", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "moderate",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([5, 6], {
  species: "walleye", region_group: "southeast_warmwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_structure", "channel_edge", "rock_pile"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "post_spawn",
});
addMonths([7, 8], {
  species: "walleye", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_basin", "thermocline_break", "deep_channel"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([9, 10, 11], {
  species: "walleye", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["rocky_point", "hard_bottom", "structure"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "moderate",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "walleye", region_group: "southeast_warmwater", month: 12,
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_structure", "channel_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  low_light_preference: true, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ═══════════════════════════════════════════════════════════════════════════════
// REDFISH (Red Drum)
// ═══════════════════════════════════════════════════════════════════════════════
// temp_floor_f: 55 — activity drops below this

// Florida / Gulf — primary redfish territory
addMonths([1, 2], {
  species: "redfish", region_group: "florida_gulf",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_channel", "warm_discharge", "grass_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "shrimp", secondary_forage: "baitfish",
  topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4, 5], {
  species: "redfish", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["grass_flat", "oyster_bar", "grass_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "shrimp", secondary_forage: "crab",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([6, 7, 8], {
  species: "redfish", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["tailing_flat", "pothole", "grass_edge", "oyster_bar"],
  chase_tendency: "moderate", strike_zone_baseline: "wide",
  primary_forage: "crab", secondary_forage: "shrimp",
  topwater_likelihood: "high", speed_bias: "moderate",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10], {
  species: "redfish", region_group: "florida_gulf",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "mid", habitat_tags: ["schooling_water", "points", "channel_edge"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "fast",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "redfish", region_group: "florida_gulf",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["channel_edge", "grass_edge", "deeper_flat"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "shrimp", secondary_forage: "crab",
  topwater_likelihood: "low", speed_bias: "slow",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
});

// Atlantic coast redfish (NC to VA — slightly cooler, shorter season)
addMonths([1, 2, 3], {
  species: "redfish", region_group: "atlantic_coast",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_channel", "warm_area"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "shrimp", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6, 7, 8, 9, 10, 11], {
  species: "redfish", region_group: "atlantic_coast",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["oyster_bar", "grass_edge", "tidal_flat"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "crab", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "redfish", region_group: "atlantic_coast", month: 12,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["channel_edge", "deeper_flat"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "shrimp", topwater_likelihood: "none", speed_bias: "slow",
  temp_floor_f: 55,
  low_light_preference: false, crepuscular_peak: true,
});

// ═══════════════════════════════════════════════════════════════════════════════
// SNOOK
// ═══════════════════════════════════════════════════════════════════════════════
// temp_floor_f: 60 — feeding stops. Below 50°F lethal.
// Primary FL/Gulf. Narrow valid range.

addMonths([1, 2], {
  species: "snook", region_group: "florida_gulf",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["warm_discharge", "deep_canal", "power_plant_outflow"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
add({
  species: "snook", region_group: "florida_gulf", month: 3,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["bridge_shadow", "mangrove_edge", "deep_channel"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "snook", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["mangrove_edge", "bridge_shadow", "seawall"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([6, 7, 8], {
  species: "snook", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["beach_pass", "inlet", "channel_edge"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([9, 10], {
  species: "snook", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["mangrove_edge", "dock", "shoreline_ambush"],
  chase_tendency: "moderate", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "snook", region_group: "florida_gulf",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["mangrove_edge", "deeper_channel"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "slow",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
});

// ── Snook — Atlantic Coast (SE FL Atlantic side, Indian River Lagoon, NC/SC marginal) ──
// Atlantic snook follow the same thermal floor as Gulf fish but have a tighter
// seasonal window — the Indian River Lagoon is primary; north of Cape Canaveral
// is marginal. Spawning aggregations form at inlets Jun–Aug.
addMonths([1, 2], {
  species: "snook", region_group: "atlantic_coast",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["warm_discharge", "deep_hole", "inlet_channel"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
add({
  species: "snook", region_group: "atlantic_coast", month: 3,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["inlet_channel", "dock_shadow", "mangrove_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "snook", region_group: "atlantic_coast",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["inlet_mouth", "beach_trough", "mangrove_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([6, 7, 8], {
  species: "snook", region_group: "atlantic_coast",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "surface", habitat_tags: ["inlet_mouth", "beach_pass", "nearshore_trough"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "high", speed_bias: "fast",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "spawning",
});
addMonths([9, 10], {
  species: "snook", region_group: "atlantic_coast",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["lagoon_edge", "grass_flat", "inlet_mouth"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "post_spawn",
});
addMonths([11, 12], {
  species: "snook", region_group: "atlantic_coast",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deeper_lagoon", "inlet_channel", "dock_shadow"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "slow",
  temp_floor_f: 60,
  low_light_preference: false, crepuscular_peak: true,
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEATROUT (Spotted)
// ═══════════════════════════════════════════════════════════════════════════════

// Florida / Gulf
addMonths([1, 2], {
  species: "seatrout", region_group: "florida_gulf",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deeper_grass", "channel_edge", "warm_grass_flat"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "shrimp", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([3, 4, 5], {
  species: "seatrout", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["grass_flat", "tidal_creek", "grass_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "shrimp", secondary_forage: "baitfish",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([6, 7, 8], {
  species: "seatrout", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["deeper_grass", "channel_adjacent_grass", "grass_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "shrimp", secondary_forage: "baitfish",
  topwater_likelihood: "low", speed_bias: "slow",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([9, 10, 11], {
  species: "seatrout", region_group: "florida_gulf",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["grass_flat", "shell_bar", "grass_edge"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "shrimp", secondary_forage: "baitfish",
  topwater_likelihood: "high", speed_bias: "moderate",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "seatrout", region_group: "florida_gulf", month: 12,
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deeper_grass", "channel_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "shrimp", topwater_likelihood: "low", speed_bias: "slow",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
});

// Atlantic coast seatrout (NC, SC, GA, VA)
addMonths([1, 2, 3], {
  species: "seatrout", region_group: "atlantic_coast",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_grass", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "shrimp", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6, 7, 8, 9, 10, 11], {
  species: "seatrout", region_group: "atlantic_coast",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["grass_flat", "oyster_bar", "grass_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "shrimp", secondary_forage: "baitfish",
  topwater_likelihood: "moderate", speed_bias: "moderate",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "seatrout", region_group: "atlantic_coast", month: 12,
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deeper_grass", "channel_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "shrimp", topwater_likelihood: "none", speed_bias: "slow",
  temp_floor_f: 50,
  low_light_preference: false, crepuscular_peak: true,
});

// ═══════════════════════════════════════════════════════════════════════════════
// STRIPED BASS
// ═══════════════════════════════════════════════════════════════════════════════
// Optimal: 55–68°F. Heat-stressed above 75°F. Coastal migratory + landlocked.
// temp_ceiling_f: 75 — activity falls sharply in summer heat

// Atlantic coast (migratory — ME to NC coastal and estuarine)
addMonths([1, 2, 3], {
  species: "striped_bass", region_group: "atlantic_coast",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_channel", "wintering_hole"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([4, 5], {
  species: "striped_bass", region_group: "atlantic_coast",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["tidal_river", "estuary_mouth", "rocky_point"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "shrimp",
  topwater_likelihood: "moderate", speed_bias: "fast",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([6, 7, 8], {
  species: "striped_bass", region_group: "atlantic_coast",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_channel", "cool_structure", "tidal_rip"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "slow",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([9, 10, 11], {
  species: "striped_bass", region_group: "atlantic_coast",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["rocky_point", "rip_current", "baitfish_school"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "high", speed_bias: "fast",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
add({
  species: "striped_bass", region_group: "atlantic_coast", month: 12,
  activity_baseline: "low", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["deep_channel", "tidal_river"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
});

// Freshwater landlocked (SE reservoirs — VA, NC, SC, GA, KY, TN)
addMonths([1, 2, 3], {
  species: "striped_bass", region_group: "southeast_warmwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["main_channel", "creek_arm", "points"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([4, 5, 6], {
  species: "striped_bass", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["schooling_water", "points", "creek_arm"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([7, 8, 9], {
  species: "striped_bass", region_group: "southeast_warmwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "bottom", habitat_tags: ["deep_channel", "thermocline_edge"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
addMonths([10, 11, 12], {
  species: "striped_bass", region_group: "southeast_warmwater",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["points", "baitfish_schools", "main_channel"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", topwater_likelihood: "moderate", speed_bias: "fast",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// Northeast freshwater stripers (marginal — stocked PA, OH lakes)
addMonths([1, 2, 3, 4, 12], {
  species: "striped_bass", region_group: "northeast_coldwater",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["main_channel", "deep_basin"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
});
addMonths([5, 6, 7, 8, 9, 10, 11], {
  species: "striped_bass", region_group: "northeast_coldwater",
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "mid", habitat_tags: ["points", "main_channel"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", topwater_likelihood: "low", speed_bias: "moderate",
  temp_ceiling_f: 75,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ═══════════════════════════════════════════════════════════════════════════════
// TARPON
// ═══════════════════════════════════════════════════════════════════════════════
// temp_floor_f: 68 — feeding stops below this. Primarily FL and Gulf.
// Very seasonal outside FL — marginal states (LA, TX, SC/GA summer only).

addMonths([1, 2, 3], {
  species: "tarpon", region_group: "florida_gulf",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["warm_canal", "deep_pass", "warm_tributary"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});
add({
  species: "tarpon", region_group: "florida_gulf", month: 4,
  activity_baseline: "neutral", aggression_baseline: "neutral",
  depth_tendency: "upper", habitat_tags: ["channel_edge", "deep_flat_edge", "pass_entrance"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "crab",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "pre_spawn",
});
addMonths([5, 6, 7], {
  species: "tarpon", region_group: "florida_gulf",
  activity_baseline: "aggressive", aggression_baseline: "aggressive",
  depth_tendency: "upper", habitat_tags: ["beach_pass", "channel_edge", "rolling_fish"],
  chase_tendency: "long", strike_zone_baseline: "wide",
  primary_forage: "baitfish", secondary_forage: "crab",
  topwater_likelihood: "moderate", speed_bias: "vary",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([8, 9, 10], {
  species: "tarpon", region_group: "florida_gulf",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "mid", habitat_tags: ["backwater", "backcountry_creek", "channel_edge"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "crab",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});
addMonths([11, 12], {
  species: "tarpon", region_group: "florida_gulf",
  activity_baseline: "low", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_canal", "warm_pass"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "slow",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "off_season",
});

// Marginal coastal states (LA, TX south, SC/GA coast) — shorter window
addMonths([1, 2, 3, 10, 11, 12], {
  species: "tarpon", region_group: "atlantic_coast",
  activity_baseline: "inactive", aggression_baseline: "passive",
  depth_tendency: "mid", habitat_tags: ["deep_channel"],
  chase_tendency: "short", strike_zone_baseline: "narrow",
  primary_forage: "baitfish", topwater_likelihood: "none", speed_bias: "dead_slow",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: false,
  seasonal_flag: "off_season",
});
addMonths([4, 5, 6, 7, 8, 9], {
  species: "tarpon", region_group: "atlantic_coast",
  activity_baseline: "active", aggression_baseline: "reactive",
  depth_tendency: "upper", habitat_tags: ["inlet", "channel_edge", "beach"],
  chase_tendency: "moderate", strike_zone_baseline: "moderate",
  primary_forage: "baitfish", secondary_forage: "crab",
  topwater_likelihood: "low", speed_bias: "moderate",
  temp_floor_f: 68,
  low_light_preference: false, crepuscular_peak: true,
  seasonal_flag: "peak_season",
});

// ─── Registry query ───────────────────────────────────────────────────────────

export function getSpeciesProfile(
  species: SpeciesGroup,
  region_group: SpeciesRegionGroup,
  month: number,
): SpeciesBaselineProfile | null {
  // Exact match first
  const exact = profiles.find(
    (p) => p.species === species && p.region_group === region_group && p.month === month,
  );
  if (exact) return exact;

  // Nearest month fallback within same species + region_group
  const regionProfiles = profiles.filter(
    (p) => p.species === species && p.region_group === region_group,
  );
  if (regionProfiles.length === 0) return null;

  regionProfiles.sort(
    (a, b) => Math.abs(a.month - month) - Math.abs(b.month - month),
  );
  return regionProfiles[0] ?? null;
}

// ─── Region group mapping ─────────────────────────────────────────────────────

import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";

export function regionKeyToSpeciesGroup(region_key: RegionKey): SpeciesRegionGroup {
  switch (region_key) {
    case "northeast":
    case "appalachian":
      return "northeast_coldwater";

    case "southeast_atlantic":
      return "southeast_warmwater";

    case "florida":
    case "gulf_coast":
      return "florida_gulf";

    case "great_lakes_upper_midwest":
    case "midwest_interior":
    case "south_central":
      return "midwest_plains";

    case "mountain_west":
    case "southwest_desert":
    case "southwest_high_desert":
    case "pacific_northwest":
    case "inland_northwest":
    case "southern_california":
    case "northern_california":
    case "mountain_alpine":
    case "alaska":
    case "hawaii":
      return "mountain_west";

    default:
      return "northeast_coldwater";
  }
}

/**
 * Context-aware region group mapping.
 *
 * For coastal and flats/estuary contexts, the northeast and southeast_atlantic
 * regions should use `atlantic_coast` profiles — these are the striped bass,
 * redfish, seatrout, snook, and tarpon populations living on the Atlantic
 * coastal strip, which have very different seasonal patterns than inland fish
 * in the same geographic region.
 *
 * Use this function in resolveBehavior instead of regionKeyToSpeciesGroup.
 */
export function getSpeciesRegionGroup(
  region_key: RegionKey,
  context: EngineContext,
): SpeciesRegionGroup {
  const isCoastal = context === "coastal" || context === "coastal_flats_estuary";
  if (isCoastal) {
    if (region_key === "northeast" || region_key === "appalachian") {
      return "atlantic_coast";
    }
    if (region_key === "southeast_atlantic") {
      return "atlantic_coast";
    }
  }
  return regionKeyToSpeciesGroup(region_key);
}

/**
 * Fallback profile used when no matching profile exists for a species +
 * region group + month combination. This prevents a hard crash and signals
 * the engine to produce a low-confidence result.
 */
export function getFallbackProfile(
  species: SpeciesGroup,
  region_group: SpeciesRegionGroup,
  month: number,
): SpeciesBaselineProfile {
  // Try any profile for this species across all region groups
  const anyRegion = profiles.filter((p) => p.species === species);
  if (anyRegion.length > 0) {
    // Pick nearest month across all regions
    anyRegion.sort((a, b) => Math.abs(a.month - month) - Math.abs(b.month - month));
    return anyRegion[0]!;
  }
  // Absolute last resort — generic neutral profile
  return {
    species,
    region_group,
    month,
    activity_baseline: "neutral",
    aggression_baseline: "neutral",
    depth_tendency: "mid",
    habitat_tags: ["structure"],
    chase_tendency: "moderate",
    strike_zone_baseline: "moderate",
    primary_forage: "baitfish",
    topwater_likelihood: "low",
    speed_bias: "moderate",
    low_light_preference: false,
    crepuscular_peak: true,
  };
}
