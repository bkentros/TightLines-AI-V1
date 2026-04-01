/**
 * Context modifiers — per-species × per-context behavioral adjustments.
 *
 * These are delta-adjustments applied on top of the species baseline profile.
 * Only fields that genuinely change between contexts are encoded here.
 * Unset fields fall back to the baseline.
 *
 * Design rules:
 *  - Encode biological/tactical reality, not guesses
 *  - River context always considers current: depth shallower, speed up, current_technique set
 *  - Flats context: stealth priority, slower, shallower, forage biased toward crab/shrimp
 *  - Coastal channel: depth deeper, baitfish bias, tidal_dependent
 */

import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type {
  DepthLane,
  FlashLevel,
  ForageMode,
  NoiseLevel,
  SpeedPreference,
  CurrentTechnique,
} from "../contracts/behavior.ts";
import type { SpeciesGroup } from "../contracts/species.ts";

// ─── Modifier shape ───────────────────────────────────────────────────────────

export type ContextModifier = {
  /** Override preferred depth lane from baseline */
  depth_bias?: DepthLane;
  /** Override speed preference */
  speed_adjustment?: SpeedPreference;
  /** Override primary forage mode */
  forage_bias?: ForageMode;
  /** Override secondary forage */
  secondary_forage_bias?: ForageMode;
  /** Suppress topwater (e.g. current too strong, water too deep) */
  topwater_suppressed?: boolean;
  /** Force topwater viable (e.g. glass-calm flat) */
  topwater_boosted?: boolean;
  /** Adjust noise preference */
  noise_preference?: NoiseLevel;
  /** Adjust flash preference */
  flash_preference?: FlashLevel;
  /** Relevant current fishing technique */
  current_technique?: CurrentTechnique;
  /** Is fish position/activity tidal-gated in this context? */
  tidal_dependent?: boolean;
  /** Sight-fishing stealth priority (flats/shallow clear water) */
  stealth_priority?: boolean;
  /** Additional context-specific habitat strings appended to baseline tags */
  extra_habitat_tags?: string[];
};

// ─── Modifier table ───────────────────────────────────────────────────────────

export const CONTEXT_MODIFIERS: Partial<
  Record<SpeciesGroup, Partial<Record<EngineContext, ContextModifier>>>
> = {

  // ─── Largemouth Bass ────────────────────────────────────────────────────────
  largemouth_bass: {
    freshwater_lake_pond: {
      // Baseline — structure-oriented still water. No adjustment needed.
    },
    freshwater_river: {
      // Rivers: shallower current seams, wood/rock structure, presentations speed up slightly
      depth_bias: "mid",
      speed_adjustment: "moderate",
      current_technique: "cross_current",
      forage_bias: "crawfish",          // rock/gravel substrate = more crawfish
      extra_habitat_tags: ["current_seams", "wood_structure", "eddy_pockets"],
    },
  },

  // ─── Smallmouth Bass ────────────────────────────────────────────────────────
  smallmouth_bass: {
    freshwater_river: {
      // Primary context. Current seams, rocky substrate, crawfish dominant.
      depth_bias: "mid",
      speed_adjustment: "moderate",
      forage_bias: "crawfish",
      current_technique: "cross_current",
      extra_habitat_tags: ["current_seams", "rock_substrate", "eddy_seams", "tailouts"],
    },
    freshwater_lake_pond: {
      // Impoundments / clear rocky lakes — deeper than river holds, baitfish mixed in
      depth_bias: "near_bottom",
      forage_bias: "baitfish",
      secondary_forage_bias: "crawfish",
      extra_habitat_tags: ["rocky_points", "main_lake_structure", "deep_transitions"],
    },
  },

  // ─── Pike / Musky ────────────────────────────────────────────────────────────
  pike_musky: {
    freshwater_lake_pond: {
      // Weed edges, bays, ambush from cover — primary context
      extra_habitat_tags: ["weed_edges", "shallow_bays", "ambush_points", "main_basin_edges"],
    },
    freshwater_river: {
      // Slack eddies, deeper holes adjacent to current, slower retrieves
      depth_bias: "mid",
      speed_adjustment: "slow",
      current_technique: "static",      // position in slack water, not in current
      topwater_suppressed: true,         // current reduces topwater effectiveness
      extra_habitat_tags: ["slack_eddies", "deep_river_holes", "behind_structure"],
    },
  },

  // ─── River Trout ─────────────────────────────────────────────────────────────
  river_trout: {
    freshwater_river: {
      // Primary context — current drives everything
      current_technique: "downstream_drift",
      extra_habitat_tags: ["pool_tailouts", "current_seams", "runs", "pocket_water"],
    },
    freshwater_lake_pond: {
      // Tailwater impoundments or stocked lake trout — deeper, slower, less current
      depth_bias: "mid",
      speed_adjustment: "slow",
      forage_bias: "baitfish",           // lake trout key in on baitfish more than insects
      extra_habitat_tags: ["thermocline", "baitfish_schools", "deep_structure"],
    },
  },

  // ─── Walleye ─────────────────────────────────────────────────────────────────
  walleye: {
    freshwater_lake_pond: {
      // Classic walleye lakes — deep structure, low light, main-lake points and humps
      depth_bias: "near_bottom",
      noise_preference: "silent",        // glass-smooth presentations at night
      extra_habitat_tags: ["main_lake_points", "rock_humps", "deep_flats", "low_light_zones"],
    },
    freshwater_river: {
      // Tailwaters, current breaks, wing dams — current-capable jigs and swimbaits
      depth_bias: "near_bottom",
      speed_adjustment: "slow",
      current_technique: "uptide_cast",  // cast uptide, let fall through current seam
      noise_preference: "silent",
      extra_habitat_tags: ["wing_dams", "tailwater_holes", "current_breaks", "river_structure"],
    },
  },

  // ─── Redfish ─────────────────────────────────────────────────────────────────
  redfish: {
    coastal_flats_estuary: {
      // Tailing on shallow flats — stealth, natural presentation, crab/shrimp
      depth_bias: "near_bottom",
      speed_adjustment: "dead_slow",
      forage_bias: "crab",
      secondary_forage_bias: "shrimp",
      stealth_priority: true,
      tidal_dependent: true,
      noise_preference: "silent",
      flash_preference: "none",
      extra_habitat_tags: ["tidal_flats", "mud_edges", "oyster_bars", "tailing_fish"],
    },
    coastal: {
      // Channels and deeper structure — baitfish schools, more active presentations
      depth_bias: "mid",
      speed_adjustment: "moderate",
      forage_bias: "baitfish",
      secondary_forage_bias: "shrimp",
      tidal_dependent: true,
      flash_preference: "moderate",
      extra_habitat_tags: ["tidal_channels", "deeper_structure", "baitfish_schools"],
    },
  },

  // ─── Snook ───────────────────────────────────────────────────────────────────
  snook: {
    coastal_flats_estuary: {
      // Mangrove edges and tidal creeks — ambush, slower, shrimp/crab forage
      depth_bias: "upper",
      speed_adjustment: "slow",
      forage_bias: "shrimp",
      secondary_forage_bias: "baitfish",
      stealth_priority: true,
      tidal_dependent: true,
      noise_preference: "silent",
      current_technique: "downstream_drift",  // present baits drifting with tidal current
      extra_habitat_tags: ["mangrove_edges", "tidal_creeks", "ambush_points", "current_breaks"],
    },
    coastal: {
      // Bridges, passes, inlets — baitfish schooling, more aggressive, higher flash
      depth_bias: "mid",
      speed_adjustment: "moderate",
      forage_bias: "baitfish",
      tidal_dependent: true,
      flash_preference: "moderate",
      noise_preference: "subtle",
      current_technique: "cross_current",
      extra_habitat_tags: ["bridges", "passes", "inlets", "structure_ambush"],
    },
  },

  // ─── Seatrout ─────────────────────────────────────────────────────────────────
  seatrout: {
    coastal_flats_estuary: {
      // Shallow grass flats — sight fishing, finesse, shrimp-focused
      depth_bias: "mid",
      speed_adjustment: "slow",
      forage_bias: "shrimp",
      secondary_forage_bias: "baitfish",
      stealth_priority: true,
      tidal_dependent: true,
      noise_preference: "subtle",
      extra_habitat_tags: ["shallow_grass", "tidal_flats", "pothole_edges"],
    },
    coastal: {
      // Deeper grass flats and channels — more baitfish, wider strike zone
      depth_bias: "mid",
      speed_adjustment: "moderate",
      forage_bias: "baitfish",
      secondary_forage_bias: "shrimp",
      tidal_dependent: true,
      flash_preference: "moderate",
      extra_habitat_tags: ["deeper_grass_flats", "channels", "drop_offs"],
    },
  },

  // ─── Striped Bass ────────────────────────────────────────────────────────────
  striped_bass: {
    freshwater_lake_pond: {
      // Landlocked stripers — schooling baitfish in open water, mid-column
      depth_bias: "mid",
      speed_adjustment: "fast",
      forage_bias: "baitfish",
      flash_preference: "heavy",
      extra_habitat_tags: ["open_water", "baitfish_schools", "points", "creek_channels"],
    },
    coastal: {
      // Migratory stripers — tidal rips, structure, aggressive baitfish blitz
      depth_bias: "upper",
      speed_adjustment: "fast",
      forage_bias: "baitfish",
      tidal_dependent: true,
      flash_preference: "heavy",
      current_technique: "cross_current",
      extra_habitat_tags: ["tidal_rips", "rocky_structure", "baitfish_blitz", "points_and_rips"],
    },
  },

  // ─── Tarpon ──────────────────────────────────────────────────────────────────
  tarpon: {
    coastal_flats_estuary: {
      // Daisy-chaining or laid-up tarpon — extreme stealth, natural presentation
      depth_bias: "upper",
      speed_adjustment: "slow",
      forage_bias: "crab",
      secondary_forage_bias: "shrimp",
      stealth_priority: true,
      tidal_dependent: true,
      noise_preference: "silent",
      flash_preference: "none",
      extra_habitat_tags: ["rolling_fish", "daisy_chains", "tidal_flats", "channel_edges"],
    },
    coastal: {
      // Passes and channels — rolling schools, aggressive presentations viable
      depth_bias: "mid",
      speed_adjustment: "moderate",
      forage_bias: "baitfish",
      secondary_forage_bias: "crab",
      tidal_dependent: true,
      noise_preference: "subtle",
      flash_preference: "moderate",
      current_technique: "cross_current",
      extra_habitat_tags: ["passes", "tidal_channels", "rolling_schools", "tide_rips"],
    },
  },
};

// ─── Accessor ─────────────────────────────────────────────────────────────────

/**
 * Returns the context modifier for a given species + context combination.
 * Returns an empty object if no modifier is defined (no adjustment needed).
 */
export function getContextModifier(
  species: SpeciesGroup,
  context: EngineContext,
): ContextModifier {
  return CONTEXT_MODIFIERS[species]?.[context] ?? {};
}
