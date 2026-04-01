/**
 * Lure family metadata library.
 * Each family's metadata drives the scoring engine — not brands, just families.
 * Stable IDs are the future tackle-box compatibility bridge.
 */

import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type {
  ActivityLevel,
  DepthLane,
  FlashLevel,
  ForageMode,
  NoiseLevel,
  ProfileSize,
  SpeedPreference,
  TriggerType,
} from "../contracts/behavior.ts";
import type { LureFamilyId } from "../contracts/families.ts";
import type { SpeciesGroup } from "../contracts/species.ts";

export type LureFamilyMetadata = {
  id: LureFamilyId;
  display_name: string;
  examples: string[];
  depth_match: DepthLane[];
  speed_match: SpeedPreference[];
  trigger_type: TriggerType;
  noise_level: NoiseLevel;
  flash_level: FlashLevel;
  profile: ProfileSize;
  topwater: boolean;
  weedless: boolean;
  current_capable: boolean;
  forage_affinity: ForageMode[];
  activity_affinity: ActivityLevel[];
  valid_species: SpeciesGroup[];
  valid_contexts: EngineContext[];
};

export const LURE_FAMILIES: Record<LureFamilyId, LureFamilyMetadata> = {
  jig: {
    id: "jig",
    display_name: "Jig",
    examples: ["Lead-head jig", "Bucktail jig", "Shaky head", "Hair jig"],
    depth_match: ["near_bottom", "bottom", "mid"],
    speed_match: ["dead_slow", "slow", "moderate"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "subtle",
    profile: "medium",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish", "crawfish", "shrimp", "leech"],
    activity_affinity: ["neutral", "active", "low"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "walleye", "river_trout",
      "pike_musky", "redfish", "snook", "seatrout", "striped_bass", "tarpon",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  soft_swimbait: {
    id: "soft_swimbait",
    display_name: "Soft Swimbait",
    examples: ["Paddle tail swimbait", "Curly tail grub", "Boot tail shad"],
    depth_match: ["upper", "mid", "near_bottom"],
    speed_match: ["moderate", "fast", "slow"],
    trigger_type: "reaction",
    noise_level: "subtle",
    flash_level: "moderate",
    profile: "slim",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive", "neutral"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "walleye", "pike_musky",
      "striped_bass", "redfish", "snook", "seatrout", "tarpon",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  soft_stickworm: {
    id: "soft_stickworm",
    display_name: "Finesse Worm",
    examples: ["Senko-style worm", "Stick bait", "Wacky rig", "Neko rig"],
    depth_match: ["surface", "upper", "mid"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "finesse",
    noise_level: "silent",
    flash_level: "none",
    profile: "slim",
    topwater: false,
    weedless: true,
    current_capable: false,
    forage_affinity: ["baitfish", "leech", "mixed"],
    activity_affinity: ["neutral", "low", "inactive"],
    valid_species: ["largemouth_bass", "smallmouth_bass"],
    valid_contexts: ["freshwater_lake_pond", "freshwater_river"],
  },

  soft_craw: {
    id: "soft_craw",
    display_name: "Craw / Creature Bait",
    examples: ["Soft craw", "Creature bait", "Beaver-style bait", "Punch bait"],
    depth_match: ["near_bottom", "bottom"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "natural_match",
    noise_level: "subtle",
    flash_level: "none",
    profile: "medium",
    topwater: false,
    weedless: true,
    current_capable: false,
    forage_affinity: ["crawfish"],
    activity_affinity: ["neutral", "active", "low"],
    valid_species: ["largemouth_bass", "smallmouth_bass"],
    valid_contexts: ["freshwater_lake_pond", "freshwater_river"],
  },

  lipless_crankbait: {
    id: "lipless_crankbait",
    display_name: "Lipless Crankbait",
    examples: ["Rat-L-Trap", "Lipless rattler", "Vibrating crankbait"],
    depth_match: ["mid", "near_bottom", "upper"],
    speed_match: ["fast", "moderate", "vary"],
    trigger_type: "reaction",
    noise_level: "loud",
    flash_level: "heavy",
    profile: "medium",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "walleye", "striped_bass",
      "redfish", "seatrout",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  diving_crankbait: {
    id: "diving_crankbait",
    display_name: "Diving Crankbait",
    examples: ["Squarebill crankbait", "Medium diver", "Deep-diving crankbait"],
    depth_match: ["mid", "near_bottom"],
    speed_match: ["moderate", "fast"],
    trigger_type: "reaction",
    noise_level: "moderate",
    flash_level: "moderate",
    profile: "medium",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish", "crawfish"],
    activity_affinity: ["active", "aggressive", "neutral"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "walleye", "striped_bass",
    ],
    valid_contexts: ["freshwater_lake_pond", "freshwater_river"],
  },

  spinnerbait: {
    id: "spinnerbait",
    display_name: "Spinnerbait / Bladed Jig",
    examples: ["Spinnerbait", "ChatterBait", "Bladed jig", "In-line spinner"],
    depth_match: ["upper", "mid"],
    speed_match: ["moderate", "fast", "slow"],
    trigger_type: "reaction",
    noise_level: "moderate",
    flash_level: "heavy",
    profile: "medium",
    topwater: false,
    weedless: true,
    current_capable: true,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive", "neutral"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "pike_musky", "striped_bass",
    ],
    valid_contexts: ["freshwater_lake_pond", "freshwater_river"],
  },

  topwater_popper: {
    id: "topwater_popper",
    display_name: "Topwater Popper",
    examples: ["Popper", "Chugger", "Pencil popper", "Hollow body popper"],
    depth_match: ["surface"],
    speed_match: ["slow", "vary"],
    trigger_type: "aggressive",
    noise_level: "loud",
    flash_level: "moderate",
    profile: "medium",
    topwater: true,
    weedless: false,
    current_capable: false,
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

  topwater_walker: {
    id: "topwater_walker",
    display_name: "Topwater Walker",
    examples: ["Walk-the-dog lure", "Zara Spook style", "Dog walker"],
    depth_match: ["surface"],
    speed_match: ["moderate", "slow"],
    trigger_type: "aggressive",
    noise_level: "moderate",
    flash_level: "moderate",
    profile: "slim",
    topwater: true,
    weedless: false,
    current_capable: false,
    forage_affinity: ["surface_prey", "baitfish"],
    activity_affinity: ["active", "aggressive"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "snook", "seatrout",
      "striped_bass", "redfish",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  topwater_frog: {
    id: "topwater_frog",
    display_name: "Hollow-Body Frog",
    examples: ["Hollow-body frog", "Toad", "Buzz frog", "Prop frog"],
    depth_match: ["surface"],
    speed_match: ["slow", "moderate"],
    trigger_type: "aggressive",
    noise_level: "moderate",
    flash_level: "none",
    profile: "medium",
    topwater: true,
    weedless: true,
    current_capable: false,
    forage_affinity: ["surface_prey"],
    activity_affinity: ["active", "aggressive"],
    valid_species: ["largemouth_bass", "pike_musky"],
    valid_contexts: ["freshwater_lake_pond"],
  },

  shrimp_crab_plastic: {
    id: "shrimp_crab_plastic",
    display_name: "Soft Shrimp / Crab Lure",
    examples: ["DOA Shrimp", "Soft shrimp jig", "Soft crab lure", "Jerk shrimp"],
    depth_match: ["near_bottom", "bottom", "mid"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "none",
    profile: "slim",
    topwater: false,
    weedless: true,
    current_capable: true,
    forage_affinity: ["shrimp", "crab"],
    activity_affinity: ["neutral", "active", "low"],
    valid_species: ["redfish", "snook", "seatrout", "tarpon"],
    valid_contexts: ["coastal", "coastal_flats_estuary"],
  },

  large_profile_swimbait: {
    id: "large_profile_swimbait",
    display_name: "Large Profile Swimbait",
    examples: ["Big swimbait", "Glide bait", "Paddle tail swimbait 6\"+", "Glidebait"],
    depth_match: ["upper", "mid", "near_bottom"],
    speed_match: ["slow", "moderate"],
    trigger_type: "reaction",
    noise_level: "subtle",
    flash_level: "moderate",
    profile: "bulky",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive", "neutral"],
    valid_species: ["pike_musky", "striped_bass", "largemouth_bass", "tarpon"],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  casting_spoon: {
    id: "casting_spoon",
    display_name: "Casting Spoon",
    examples: ["Casting spoon", "Flutter spoon", "Dardevle-style spoon", "Weedless spoon"],
    depth_match: ["upper", "mid"],
    speed_match: ["fast", "moderate", "vary"],
    trigger_type: "reaction",
    noise_level: "silent",
    flash_level: "heavy",
    profile: "slim",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish"],
    activity_affinity: ["active", "aggressive"],
    valid_species: ["walleye", "pike_musky", "striped_bass", "river_trout"],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal",
    ],
  },
};

export function getLureFamily(id: LureFamilyId): LureFamilyMetadata {
  return LURE_FAMILIES[id];
}
