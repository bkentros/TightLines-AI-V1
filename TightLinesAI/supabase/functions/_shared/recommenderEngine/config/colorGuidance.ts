/**
 * Deterministic color family resolver.
 * Clarity × forage mode × light/time-of-day → ColorFamily.
 *
 * Logic priority:
 *   1. Dirty water still needs visibility, but forage family keeps mattering
 *   2. Forage mode anchors the base color
 *   3. Stained water shifts baitfish away from silver toward gold/amber
 *   4. Low light (overcast or dawn/dusk flag) → dark silhouette for most
 *   5. Species-specific override for known color preferences
 */

import type { ColorFamily, ForageMode } from "../contracts/behavior.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type { SpeciesGroup } from "../contracts/species.ts";

// Light label comes from norm.light.label in the How's Fishing engine
export type LightLabel =
  | "mostly_clear"
  | "mixed_sky"
  | "cloud_dominant"
  | "heavy_overcast";

// ─── Forage base colors ───────────────────────────────────────────────────────

const FORAGE_BASE: Record<ForageMode, ColorFamily> = {
  baitfish:     "shad_silver",
  crawfish:     "craw_pattern",
  shrimp:       "shrimp_tan",
  crab:         "crab_olive",
  leech:        "dark_silhouette",
  surface_prey: "natural_match",
  mixed:        "natural_match",
};

// ─── Species color preference overrides (applied in clear water) ──────────────
// Only apply when clarity is "clear" and the species has a known strong preference.

const SPECIES_CLEAR_WATER_OVERRIDE: Partial<Record<SpeciesGroup, ColorFamily>> = {
  walleye:   "chartreuse_white",  // walleye consistently respond to chartreuse/orange even in clear water
  redfish:   "gold_amber",        // redfish in clear water still eat gold/amber well
};

// ─── Main resolver ────────────────────────────────────────────────────────────

export function resolveColorFamily(
  water_clarity: WaterClarity,
  forage_mode: ForageMode,
  light_label: LightLabel,
  species: SpeciesGroup,
): ColorFamily {

  // 1. Dirty water — visibility matters, but forage family still matters.
  if (water_clarity === "dirty") {
    if (forage_mode === "baitfish" || forage_mode === "surface_prey") {
      return "chartreuse_white";
    }
    if (forage_mode === "crawfish") return "craw_pattern";
    if (forage_mode === "shrimp") return "shrimp_tan";
    if (forage_mode === "crab") return "crab_olive";
    if (forage_mode === "leech") return "dark_silhouette";
    return "gold_amber";
  }

  // 2. Start with forage-anchored base
  let color: ColorFamily = FORAGE_BASE[forage_mode];

  // 3. Stained water adjustments
  if (water_clarity === "stained") {
    if (forage_mode === "baitfish") {
      color = "gold_amber";       // gold reads better than silver in stained water
    } else if (forage_mode === "mixed" || forage_mode === "surface_prey") {
      color = "chartreuse_white"; // contrast helps in stained water for non-specific forage
    }
    // crawfish, shrimp, crab, leech keep their forage-based colors — they're inherently natural
  }

  // 4. Low light modifier (heavy overcast or clear conditions at dawn/dusk implied)
  // Only apply dark silhouette when NOT a crustacean forage mode (crabs/shrimp stay natural)
  if (
    light_label === "heavy_overcast" &&
    forage_mode !== "crab" &&
    forage_mode !== "shrimp" &&
    forage_mode !== "crawfish"
  ) {
    color = "dark_silhouette";
  }

  // 5. Species-specific override in clear water
  if (water_clarity === "clear") {
    const speciesOverride = SPECIES_CLEAR_WATER_OVERRIDE[species];
    if (speciesOverride) color = speciesOverride;
  }

  return color;
}

// ─── Color display text ───────────────────────────────────────────────────────
// Short UI-friendly descriptions for each color family.

export const COLOR_FAMILY_DISPLAY: Record<ColorFamily, {
  label: string;
  description: string;
}> = {
  natural_match: {
    label: "Natural / Match the Hatch",
    description: "Natural tones that closely match the forage — subtle and realistic.",
  },
  shad_silver: {
    label: "Silver / Shad",
    description: "Silver, white, and gray tones that imitate baitfish and shad.",
  },
  chartreuse_white: {
    label: "Chartreuse / White",
    description: "High-visibility chartreuse or white — cuts through murky water and triggers reaction strikes.",
  },
  gold_amber: {
    label: "Gold / Amber",
    description: "Gold and warm amber tones — reads well in stained water and imitates crawfish and shad.",
  },
  dark_silhouette: {
    label: "Dark Silhouette",
    description: "Black, dark blue, or purple — creates a bold silhouette in low light.",
  },
  craw_pattern: {
    label: "Crawfish / Brown-Orange",
    description: "Brown, orange, and green pumpkin tones matching active crawfish.",
  },
  shrimp_tan: {
    label: "Shrimp / Tan",
    description: "Tan, pink, and translucent white — natural shrimp imitation.",
  },
  crab_olive: {
    label: "Crab / Olive",
    description: "Olive, brown, and tan tones matching bottom-dwelling crabs.",
  },
  flash_heavy: {
    label: "Heavy Flash",
    description: "Metallic or highly reflective — maximum visibility and attraction.",
  },
};
