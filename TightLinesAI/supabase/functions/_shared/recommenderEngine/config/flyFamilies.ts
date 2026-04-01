/**
 * Fly family metadata library — V1 scope: streamers only.
 * No nymphs, no dry flies in V1.
 * Note shown in UI for trout: "V1 covers streamer/wet fly patterns only."
 */

import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type {
  ActivityLevel,
  CoverClass,
  DepthLane,
  FlashLevel,
  FlowSuitability,
  ForageMode,
  NoiseLevel,
  ProfileSize,
  SpeedPreference,
  TriggerType,
} from "../contracts/behavior.ts";
import type { FlyFamilyId } from "../contracts/families.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { WaterClarity } from "../contracts/input.ts";

export type FlyFamilyMetadata = {
  id: FlyFamilyId;
  display_name: string;
  examples: string[];
  depth_match: DepthLane[];
  speed_match: SpeedPreference[];
  trigger_type: TriggerType;
  noise_level: NoiseLevel;
  flash_level: FlashLevel;
  profile: ProfileSize;
  clarity_strengths: WaterClarity[];
  cover_strengths: CoverClass[];
  current_suitability: FlowSuitability;
  tide_suitability: FlowSuitability;
  topwater: boolean;
  forage_affinity: ForageMode[];
  activity_affinity: ActivityLevel[];
  valid_species: SpeciesGroup[];
  valid_contexts: EngineContext[];
  v1_scope_note?: string;  // shown in UI when scope is limited (e.g. trout streamers only)
};

export const FLY_FAMILIES: Record<FlyFamilyId, FlyFamilyMetadata> = {
  streamer_baitfish: {
    id: "streamer_baitfish",
    display_name: "Baitfish Streamer",
    examples: ["Clouser Minnow", "Lefty's Deceiver", "Half & Half", "Baitfish Bunny"],
    depth_match: ["upper", "mid", "near_bottom"],
    speed_match: ["moderate", "slow", "fast"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "moderate",
    profile: "slim",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "current_seam", "flats"],
    current_suitability: "strong",
    tide_suitability: "strong",
    topwater: false,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive", "neutral"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "pike_musky", "river_trout",
      "walleye", "redfish", "snook", "seatrout", "striped_bass", "tarpon",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  streamer_articulated: {
    id: "streamer_articulated",
    display_name: "Articulated Streamer",
    examples: ["Game Changer", "Double Deceiver", "Sex Dungeon", "Articulated Minnow"],
    depth_match: ["upper", "mid"],
    speed_match: ["slow", "moderate", "vary"],
    trigger_type: "aggressive",
    noise_level: "subtle",
    flash_level: "heavy",
    profile: "bulky",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "hard_structure", "current_seam"],
    current_suitability: "capable",
    tide_suitability: "strong",
    topwater: false,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive"],
    valid_species: [
      "pike_musky", "striped_bass", "tarpon", "river_trout",
      "largemouth_bass", "smallmouth_bass",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  topwater_popper_fly: {
    id: "topwater_popper_fly",
    display_name: "Popper / Gurgler",
    examples: ["Foam popper", "Gurgler", "Mouse fly", "Frog bug"],
    depth_match: ["surface"],
    speed_match: ["slow", "vary"],
    trigger_type: "aggressive",
    noise_level: "loud",
    flash_level: "subtle",
    profile: "medium",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "hard_structure", "current_seam"],
    current_suitability: "poor",
    tide_suitability: "poor",
    topwater: true,
    forage_affinity: ["surface_prey", "baitfish"],
    activity_affinity: ["active", "aggressive"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "pike_musky", "snook",
      "redfish", "seatrout", "striped_bass", "tarpon",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  slider_diver_fly: {
    id: "slider_diver_fly",
    display_name: "Diver / Slider",
    examples: ["Sneaky Pete", "Bass slider", "Foam slider", "Deer-hair slider"],
    depth_match: ["surface", "upper"],
    speed_match: ["slow", "moderate"],
    trigger_type: "reaction",
    noise_level: "moderate",
    flash_level: "subtle",
    profile: "medium",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "flats", "hard_structure"],
    current_suitability: "poor",
    tide_suitability: "capable",
    topwater: true,
    forage_affinity: ["surface_prey", "baitfish"],
    activity_affinity: ["active", "aggressive", "neutral"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "snook", "striped_bass",
      "seatrout", "redfish",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  shrimp_fly: {
    id: "shrimp_fly",
    display_name: "Shrimp Fly",
    examples: ["EP Shrimp", "Gotcha", "Fox Shrimp", "Shrimp fly"],
    depth_match: ["near_bottom", "bottom", "mid"],
    speed_match: ["slow", "dead_slow", "moderate"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "subtle",
    profile: "slim",
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["flats", "bottom", "current_seam"],
    current_suitability: "capable",
    tide_suitability: "strong",
    topwater: false,
    forage_affinity: ["shrimp"],
    activity_affinity: ["neutral", "active", "low", "aggressive"],
    valid_species: ["redfish", "seatrout", "snook", "tarpon"],
    valid_contexts: ["coastal", "coastal_flats_estuary"],
  },

  crab_fly: {
    id: "crab_fly",
    display_name: "Crab Fly",
    examples: ["Del Brown Crab", "Flexo Crab", "Raghead Crab", "Crab fly"],
    depth_match: ["near_bottom", "bottom"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "none",
    profile: "medium",
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["flats", "bottom"],
    current_suitability: "capable",
    tide_suitability: "strong",
    topwater: false,
    forage_affinity: ["crab"],
    activity_affinity: ["neutral", "active", "low", "aggressive"],
    valid_species: ["redfish", "tarpon"],
    valid_contexts: ["coastal", "coastal_flats_estuary"],
  },

  leech_worm_fly: {
    id: "leech_worm_fly",
    display_name: "Woolly Bugger / Leech",
    examples: ["Woolly Bugger", "Zonker", "Muddler Minnow", "Bunny leech", "Sculpin streamer", "Rabbit-strip leech"],
    depth_match: ["mid", "near_bottom"],
    speed_match: ["slow", "moderate", "dead_slow"],
    trigger_type: "natural_match",
    noise_level: "subtle",
    flash_level: "subtle",
    profile: "slim",
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["current_seam", "rock", "wood", "bottom"],
    current_suitability: "strong",
    tide_suitability: "poor",
    topwater: false,
    forage_affinity: ["leech", "crawfish", "baitfish", "mixed"],
    activity_affinity: ["neutral", "active", "low"],
    valid_species: [
      "river_trout", "largemouth_bass", "smallmouth_bass",
      "walleye", "pike_musky",
    ],
    valid_contexts: ["freshwater_lake_pond", "freshwater_river"],
    v1_scope_note: "V1 fly picks focus on streamer and wet fly patterns. Nymph and dry fly recommendations coming soon.",
  },
};

export function getFlyFamily(id: FlyFamilyId): FlyFamilyMetadata {
  return FLY_FAMILIES[id];
}
