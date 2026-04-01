/**
 * Lure family metadata library.
 * Each family's metadata drives the scoring engine — not brands, just families.
 * Stable IDs are the future tackle-box compatibility bridge.
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
import type { LureFamilyId } from "../contracts/families.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { WaterClarity } from "../contracts/input.ts";

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
  clarity_strengths: WaterClarity[];
  cover_strengths: CoverClass[];
  current_suitability: FlowSuitability;
  tide_suitability: FlowSuitability;
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
    examples: ["Bass jig", "Football jig", "Flipping jig", "Shaky head"],
    depth_match: ["near_bottom", "bottom", "mid"],
    speed_match: ["dead_slow", "slow", "moderate"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "subtle",
    profile: "medium",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["rock", "current_seam", "hard_structure", "bottom"],
    current_suitability: "strong",
    tide_suitability: "capable",
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
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["open_water", "current_seam", "flats"],
    current_suitability: "capable",
    tide_suitability: "strong",
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
    display_name: "Soft Worm / Stick Worm",
    examples: ["Stick worm", "Straight-tail worm", "Ribbon-tail worm", "Weightless worm"],
    depth_match: ["surface", "upper", "mid"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "finesse",
    noise_level: "silent",
    flash_level: "none",
    profile: "slim",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["vegetation", "wood", "hard_structure"],
    current_suitability: "poor",
    tide_suitability: "poor",
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
    display_name: "Soft Craw / Creature",
    examples: ["Craw bait", "Creature bait", "Beaver bait", "Texas-rigged craw"],
    depth_match: ["near_bottom", "bottom"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "natural_match",
    noise_level: "subtle",
    flash_level: "none",
    profile: "medium",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["vegetation", "wood", "rock", "bottom"],
    current_suitability: "poor",
    tide_suitability: "poor",
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
    examples: ["Lipless crankbait", "Rat-L-Trap", "Red Eye Shad", "One-knocker"],
    depth_match: ["mid", "near_bottom", "upper"],
    speed_match: ["fast", "moderate", "vary"],
    trigger_type: "reaction",
    noise_level: "loud",
    flash_level: "heavy",
    profile: "medium",
    clarity_strengths: ["stained", "dirty"],
    cover_strengths: ["vegetation", "open_water", "flats"],
    current_suitability: "capable",
    tide_suitability: "capable",
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
      "freshwater_lake_pond", "freshwater_river", "coastal",
    ],
  },

  diving_crankbait: {
    id: "diving_crankbait",
    display_name: "Crankbait / Squarebill",
    examples: ["Squarebill crankbait", "Flat-side crankbait", "Round-bill crankbait", "Shallow diver"],
    depth_match: ["upper", "mid", "near_bottom"],
    speed_match: ["moderate", "fast"],
    trigger_type: "reaction",
    noise_level: "moderate",
    flash_level: "moderate",
    profile: "medium",
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["rock", "wood", "hard_structure", "vegetation"],
    current_suitability: "capable",
    tide_suitability: "poor",
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

  jerkbait: {
    id: "jerkbait",
    display_name: "Jerkbait / Fluke",
    examples: ["Suspending jerkbait", "Soft jerkbait", "Fluke-style minnow", "Twitch bait"],
    depth_match: ["upper", "mid"],
    speed_match: ["slow", "moderate", "vary"],
    trigger_type: "reaction",
    noise_level: "subtle",
    flash_level: "moderate",
    profile: "slim",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "hard_structure", "vegetation"],
    current_suitability: "capable",
    tide_suitability: "capable",
    topwater: false,
    weedless: false,
    current_capable: true,
    forage_affinity: ["baitfish"],
    activity_affinity: ["neutral", "active", "aggressive"],
    valid_species: [
      "largemouth_bass", "smallmouth_bass", "walleye", "pike_musky",
      "striped_bass", "snook", "seatrout", "tarpon",
    ],
    valid_contexts: [
      "freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary",
    ],
  },

  spinnerbait: {
    id: "spinnerbait",
    display_name: "Spinnerbait / Chatterbait",
    examples: ["Spinnerbait", "Bladed jig", "ChatterBait", "Compact spinnerbait"],
    depth_match: ["upper", "mid"],
    speed_match: ["moderate", "fast", "slow"],
    trigger_type: "reaction",
    noise_level: "moderate",
    flash_level: "heavy",
    profile: "medium",
    clarity_strengths: ["stained", "dirty"],
    cover_strengths: ["vegetation", "wood", "open_water"],
    current_suitability: "capable",
    tide_suitability: "poor",
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
    examples: ["Popper", "Chugger", "Splash bait", "Pencil popper"],
    depth_match: ["surface"],
    speed_match: ["slow", "vary"],
    trigger_type: "aggressive",
    noise_level: "loud",
    flash_level: "moderate",
    profile: "medium",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "hard_structure", "current_seam"],
    current_suitability: "poor",
    tide_suitability: "poor",
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
    display_name: "Walking Bait",
    examples: ["Walking bait", "Spook-style walker", "Pencil bait", "Walk-the-dog bait"],
    depth_match: ["surface"],
    speed_match: ["moderate", "slow"],
    trigger_type: "aggressive",
    noise_level: "moderate",
    flash_level: "moderate",
    profile: "slim",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "flats", "current_seam"],
    current_suitability: "poor",
    tide_suitability: "capable",
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
    clarity_strengths: ["stained", "dirty"],
    cover_strengths: ["vegetation"],
    current_suitability: "poor",
    tide_suitability: "poor",
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
    display_name: "Shrimp / Crab Soft Plastic",
    examples: ["DOA Shrimp", "Vudu Shrimp", "Rigged shrimp soft plastic", "Crab soft plastic"],
    depth_match: ["near_bottom", "bottom", "mid"],
    speed_match: ["dead_slow", "slow"],
    trigger_type: "natural_match",
    noise_level: "silent",
    flash_level: "subtle",
    profile: "medium",
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["flats", "bottom", "current_seam"],
    current_suitability: "capable",
    tide_suitability: "strong",
    topwater: false,
    weedless: true,
    current_capable: true,
    forage_affinity: ["shrimp", "crab"],
    activity_affinity: ["neutral", "active", "low", "aggressive"],
    valid_species: ["redfish", "snook", "seatrout", "tarpon"],
    valid_contexts: ["coastal", "coastal_flats_estuary"],
  },

  large_profile_swimbait: {
    id: "large_profile_swimbait",
    display_name: "Big Swimbait / Glide Bait",
    examples: ["Glide bait", "Line-through swimbait", "Big paddle tail", "Multi-jointed swimbait"],
    depth_match: ["upper", "mid", "near_bottom"],
    speed_match: ["slow", "moderate"],
    trigger_type: "reaction",
    noise_level: "subtle",
    flash_level: "moderate",
    profile: "bulky",
    clarity_strengths: ["clear", "stained"],
    cover_strengths: ["open_water", "hard_structure", "current_seam"],
    current_suitability: "capable",
    tide_suitability: "strong",
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
    clarity_strengths: ["clear", "stained", "dirty"],
    cover_strengths: ["open_water", "current_seam", "flats"],
    current_suitability: "strong",
    tide_suitability: "strong",
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
