/**
 * colorPhrases — how to explain color selection to the angler.
 *
 * Keyed on ColorFamily. 6 variants per family for deterministic rotation.
 * Each phrase should explain WHY this color family, not just what it is.
 */

import type { ColorFamily } from "../contracts/behavior.ts";

export const COLOR_PHRASES: Record<
  ColorFamily,
  readonly string[]
> = {
  natural_match: [
    "Clear water — match the exact baitfish or forage color as closely as possible.",
    "High-vis water calls for exact forage matching. Go natural over flashy.",
    "In clear conditions, fish inspect presentations closely — natural color wins.",
    "Clear water demands precision — match the local baitfish shade as exactly as you can.",
    "Fish are using their eyes in clear water — the most realistic color profile wins.",
    "Transparent conditions: natural forage tones outperform bright colors every time.",
  ],
  shad_silver: [
    "Silver and white profiles match the dominant baitfish in this system.",
    "Shad-colored lures are the default baitfish match for most clear-water situations.",
    "Chrome and white imitate vulnerable shad — always a solid baseline choice.",
    "Silver and pearl match the shad and alewife that are dominant forage right now.",
    "White and chrome are the most versatile baitfish colors in clear to lightly stained water.",
    "Shad profile and color are the default starting point when fish are keyed on baitfish.",
  ],
  chartreuse_white: [
    "Stained or murky water — chartreuse and white are the most visible colors available.",
    "High-visibility chartreuse cuts through off-color water when nothing else does.",
    "Off-color conditions call for chartreuse. Fish rely on lateral line; color helps confirm.",
    "Chartreuse is scientifically the most visible color in off-color freshwater — use it.",
    "Stained water reduces visibility; chartreuse with white gives fish the best chance to find it.",
    "Murky conditions require maximum contrast — chartreuse and white deliver that.",
  ],
  gold_amber: [
    "Stained water with crawfish or warm-toned forage — gold and amber mimic both perfectly.",
    "Gold patterns stand out in tannin-stained water and match the warm substrate tones.",
    "Crawfish and bronze shiner imitation — gold is the natural choice in stained conditions.",
    "Golden rod and amber tones match the stained-water baitfish and creek chubs in this system.",
    "Gold and copper flash in stained water creates the right visibility without going chartreuse.",
    "Amber and gold match both the water tone and the warm-colored forage present here.",
  ],
  dark_silhouette: [
    "Low-light and overcast conditions — dark colors create the best silhouette from below.",
    "Black, purple, and dark blue are most visible as a contrast silhouette in flat light.",
    "Overcast or night conditions: fish are looking up — give them a solid dark outline.",
    "Dark colors create the strongest silhouette against a gray sky or overcast canopy.",
    "Overcast light makes dark profiles the highest-contrast option fish can see from below.",
    "Black and dark purple are the most visible colors in low-light and heavy cloud conditions.",
  ],
  craw_pattern: [
    "Brown, orange, and green pumpkin match the crawfish fish are keying on.",
    "Crawfish-toned lures on bottom contact are the most natural choice right now.",
    "Go craw colors — brown, green pumpkin, and orange match the real thing on the bottom.",
    "Green pumpkin and orange match the molting crawfish that are dominant forage right now.",
    "Brown-based craw pattern matches the substrate and the forage at the same time.",
    "Craw colors on the bottom blend with the substrate while matching the primary forage — perfect.",
  ],
  shrimp_tan: [
    "Tan, pink, and light gold match the shrimp fish are targeting.",
    "Natural shrimp colors in clear or lightly stained water are the right call.",
    "Shrimp tan and light pink are subtle enough for clear-water flats fish.",
    "Light tan and pink match the translucent shrimp that coastal fish are keyed on.",
    "Natural shrimp coloration is the most convincing option when fish are feeding selectively.",
    "Shrimp-colored presentations in the right size are the most consistent flats producers.",
  ],
  crab_olive: [
    "Olive, brown, and tan replicate the crabs fish are rooting out on the bottom.",
    "Crab patterns in natural olive and brown are the best match for tailing fish.",
    "Dark olive and brown crab imitation matches the forage fish are actively digging for.",
    "Natural olive and dark brown match the blue crabs and fiddler crabs in this system.",
    "Crab patterns with an olive base are the most convincing to fish that are actively hunting bottom.",
    "Dark olive and tan are the dominant colors of the crabs in this habitat — match them precisely.",
  ],
  flash_heavy: [
    "Heavy flash cuts through deep or dirty water and triggers reaction bites from distance.",
    "Deep or off-color water — maximum flash helps fish locate and commit to the lure.",
    "High-flash spoon or metallic profile is the right call when visibility is limited.",
    "Maximum flash increases detection range in turbid or deep water where visibility is compromised.",
    "Flash in dirty or deep water triggers lateral line response and visual strikes from further away.",
    "Heavy flash compensates for low visibility — fish can detect it at greater distances.",
  ],
};
