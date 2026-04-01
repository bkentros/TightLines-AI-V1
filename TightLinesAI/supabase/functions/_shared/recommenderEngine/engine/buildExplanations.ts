/**
 * buildExplanations — assembles per-family explanation strings deterministically.
 *
 * Explanations are derived from each family's actual score breakdown so the
 * copy reflects why that specific family ranked where it did.
 */

import { pickDeterministic } from "../../howFishingEngine/copy/deterministicPick.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { BehaviorOutput, ForageMode, PresentationOutput } from "../contracts/behavior.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type { RankedFamily } from "../contracts/output.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { ScoredFamily } from "./scoreFamilies.ts";
import {
  HOW_TO_FISH_BY_MOTION,
  HOW_TO_FISH_FAMILY_OVERRIDE,
} from "../phrases/howToFishPhrases.ts";
import { COLOR_FAMILY_DISPLAY } from "../config/colorGuidance.ts";
import { FLY_FAMILIES } from "../config/flyFamilies.ts";
import { LURE_FAMILIES } from "../config/lureFamilies.ts";

type FamilyMeta =
  | (typeof LURE_FAMILIES)[keyof typeof LURE_FAMILIES]
  | (typeof FLY_FAMILIES)[keyof typeof FLY_FAMILIES];

function buildSeed(
  local_date: string,
  species: SpeciesGroup,
  family_id: string,
): string {
  return `${local_date}|${species}|${family_id}`;
}

function getFamilyMeta(familyId: string): FamilyMeta {
  if (familyId in LURE_FAMILIES) {
    return LURE_FAMILIES[familyId as keyof typeof LURE_FAMILIES];
  }
  return FLY_FAMILIES[familyId as keyof typeof FLY_FAMILIES];
}

function isFreshwaterBass(species: SpeciesGroup, context: EngineContext): boolean {
  return (
    (species === "largemouth_bass" || species === "smallmouth_bass") &&
    (context === "freshwater_lake_pond" || context === "freshwater_river")
  );
}

function resolveExamples(
  familyId: string,
  species: SpeciesGroup,
  context: EngineContext,
  localDate: string,
  fallback: string[],
): string[] {
  const rotateExamples = (pool: string[], desiredCount = 4): string[] => {
    if (pool.length <= desiredCount) return pool;
    const seed = buildSeed(localDate, species, `${context}|${familyId}`);
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
      hash = ((hash * 31) + seed.charCodeAt(index)) >>> 0;
    }
    const start = hash % pool.length;
    const rotated = pool.slice(start).concat(pool.slice(0, start));
    return rotated.slice(0, desiredCount);
  };

  if (familyId === "jig") {
    if (isFreshwaterBass(species, context)) {
      return rotateExamples(["Bass jig", "Football jig", "Flipping jig", "Swim jig", "Skipping jig", "Shaky head"]);
    }
    if (species === "walleye") {
      return rotateExamples(["Ball-head jig", "Minnow jig", "Hair jig", "Swimbait jighead", "Precision jig", "Paddletail jig"]);
    }
    if (context === "coastal" || context === "coastal_flats_estuary") {
      return rotateExamples(["Bucktail jig", "Paddletail jighead", "Flats jig", "Bridge jig", "Grass-line jig", "Dock-light jig"]);
    }
  }

  if (familyId === "diving_crankbait" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Squarebill crankbait", "Flat-side crankbait", "Round-bill crankbait", "Coffin-bill crankbait", "Shallow-running crankbait", "Wake-style crankbait"]);
  }

  if (familyId === "jerkbait" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Suspending jerkbait", "Soft jerkbait", "Fluke-style minnow", "Twitch bait", "Deep jerkbait", "Slash bait"]);
  }

  if (familyId === "spinnerbait" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Spinnerbait", "Bladed jig", "ChatterBait", "Compact spinnerbait", "Double-willow spinnerbait", "Colorado-blade spinnerbait"]);
  }

  if (familyId === "streamer_articulated" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Game Changer", "Double Deceiver", "Sex Dungeon", "Articulated Minnow", "Articulated baitfish", "Articulated sculpin"]);
  }

  if (familyId === "slider_diver_fly" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Sneaky Pete", "Bass slider", "Foam slider", "Deer-hair slider", "Diver bug", "Hard-foam diver"]);
  }

  if (familyId === "leech_worm_fly" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Woolly Bugger", "Zonker", "Muddler Minnow", "Bunny leech", "Sculpin streamer", "Rabbit-strip leech"]);
  }

  return rotateExamples(fallback);
}

function resolveImitation(
  family: ScoredFamily,
  behavior: BehaviorOutput,
  meta: FamilyMeta,
): ForageMode | null {
  if (
    family.breakdown.some((item) => item.code === "forage_primary_match") &&
    meta.forage_affinity.includes(behavior.forage_mode)
  ) {
    return behavior.forage_mode;
  }

  if (
    behavior.secondary_forage &&
    family.breakdown.some((item) => item.code === "forage_secondary_match") &&
    meta.forage_affinity.includes(behavior.secondary_forage)
  ) {
    return behavior.secondary_forage;
  }

  if (meta.forage_affinity.length === 1) {
    return meta.forage_affinity[0] ?? null;
  }

  return null;
}

function buildWhyPicked(
  family: ScoredFamily,
): string {
  const bonuses = family.breakdown.filter((item) => item.direction === "bonus");
  const anchorPriority = [
    "forage_primary_match",
    "forage_secondary_match",
    "trigger_match",
    "flash_match",
    "noise_match",
    "cover_fit",
    "current_fit",
    "depth_match",
    "speed_match",
    "activity_match",
    "profile_match",
  ];
  const anchor = anchorPriority
    .map((code) => bonuses.find((item) => item.code === code)?.detail)
    .find(Boolean);

  const differentiatorPriority = [
    "flash_match",
    "flash_near_match",
    "noise_match",
    "noise_near_match",
    "cover_fit",
    "current_fit",
    "depth_match",
    "depth_near_match",
    "speed_match",
    "speed_near_match",
    "trigger_match",
    "trigger_near_match",
    "activity_match",
    "profile_match",
  ];
  const differentiator = differentiatorPriority
    .map((code) => bonuses.find((item) => item.code === code)?.detail)
    .find((detail) => detail && detail !== anchor);

  if (anchor && differentiator) {
    return `This family ${anchor} and ${differentiator}.`;
  }
  if (family.score_reasons.length >= 2) {
    return `This family ${family.score_reasons[0]} and ${family.score_reasons[1]}.`;
  }
  if (family.score_reasons.length === 1) {
    return `This family ${family.score_reasons[0]}.`;
  }
  return "This family lines up reasonably well with the current conditions.";
}

function buildHowToFish(
  scored: ScoredFamily,
  presentation: PresentationOutput,
  seed: string,
): string {
  const override = HOW_TO_FISH_FAMILY_OVERRIDE[scored.family_id];
  if (override) {
    return pickDeterministic(override, seed, "how");
  }
  return pickDeterministic(HOW_TO_FISH_BY_MOTION[presentation.motion], seed, "how");
}

function buildBestWhen(
  family: ScoredFamily,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
): string {
  if (family.breakdown.some((item) => item.code === "current_fit")) {
    return "Best when moving current or tide is positioning fish and you need a natural drift through the lane.";
  }

  if (family.breakdown.some((item) => item.code === "cover_fit")) {
    return "Best when fish are tight to grass, reeds, pads, timber, or other snaggy cover.";
  }

  const seasonalPrefix = behavior.seasonal_flag
    ? `${behavior.seasonal_flag.replace(/_/g, " ")} periods`
    : "today's window";

  return `Best in ${seasonalPrefix} when fish stay ${behavior.activity} and hold around the ${presentation.depth_target.replace(/_/g, " ")} zone.`;
}

function buildColorGuide(
  family: ScoredFamily,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  waterClarity: WaterClarity,
): string {
  const meta = getFamilyMeta(family.family_id);
  const imitation = resolveImitation(family, behavior, meta);

  const baitfishLabel = () => {
    if (family.family_id === "streamer_baitfish") {
      if (waterClarity === "dirty") return "White / Gold Minnow";
      if (waterClarity === "stained") return "White / Olive Minnow";
      return "White / Silver Minnow";
    }
    if (family.family_id === "streamer_articulated") {
      if (waterClarity === "dirty") return "Black / Olive Baitfish";
      if (waterClarity === "stained") return "Olive / White Baitfish";
      return "Natural Baitfish";
    }
    if (family.family_id === "leech_worm_fly") {
      if (waterClarity === "dirty") return "Olive / Black";
      if (waterClarity === "stained") return "Olive / Brown";
      return "Natural Olive";
    }
    if (family.family_id === "jerkbait") {
      if (waterClarity === "dirty") return "Chartreuse Shad";
      if (waterClarity === "stained") return "Tennessee Shad";
      return "Ghost Minnow";
    }
    if (family.family_id === "soft_swimbait") {
      if (waterClarity === "dirty") return "White / Chartreuse Tail";
      if (waterClarity === "stained") return "Pearl / Olive";
      return "Pearl Shad";
    }
    if (family.family_id === "spinnerbait") {
      if (waterClarity === "dirty") return "White / Chartreuse";
      if (waterClarity === "stained") return "White / Gold Willow";
      return "White / Silver";
    }
    if (family.family_id === "diving_crankbait") {
      if (waterClarity === "dirty") return "Chartreuse Black Back";
      if (waterClarity === "stained") return "Tennessee Shad";
      return "Sexy Shad";
    }
    if (family.family_id === "lipless_crankbait") {
      if (waterClarity === "dirty") return "Chrome / Black Back";
      if (waterClarity === "stained") return "Gold / Black Back";
      return "Chrome / Blue Back";
    }
    if (family.family_id === "topwater_walker") {
      if (waterClarity === "dirty") return "Bone / Black Back";
      if (waterClarity === "stained") return "Bone";
      return "Natural Shad";
    }
    if (family.family_id === "topwater_popper") {
      if (waterClarity === "dirty") return "Black / Yellow Popper";
      if (waterClarity === "stained") return "Bone / Chartreuse";
      return "Bone / White";
    }
    if (family.family_id === "slider_diver_fly") {
      if (waterClarity === "dirty") return "Black / Olive Slider";
      if (waterClarity === "stained") return "Olive / Yellow Slider";
      return "Frog / White Slider";
    }
    if (family.family_id === "topwater_popper_fly") {
      if (waterClarity === "dirty") return "Black / Chartreuse Popper";
      if (waterClarity === "stained") return "Olive / Yellow Gurgler";
      return "White / Foam Popper";
    }
    if (waterClarity === "dirty" && meta.topwater) return "Black / Dark Back";
    if (waterClarity === "dirty" && meta.trigger_type === "reaction") return "Chartreuse / White";
    if (waterClarity === "dirty") return "Gold / Amber Shad";
    if (waterClarity === "stained" && meta.trigger_type === "reaction") return "Chartreuse / White";
    if (waterClarity === "stained") return "Gold / Olive Shad";
    if (meta.profile === "bulky") return "Olive / White Baitfish";
    return "Pearl / Silver";
  };

  const crawLabel = () => {
    if (family.family_id === "diving_crankbait" || family.family_id === "lipless_crankbait") {
      return waterClarity === "clear" ? "Red Craw / Orange Belly" : "Red-Orange Craw";
    }
    if (family.family_id === "jig") {
      return waterClarity === "dirty" ? "Black-Blue / Green Pumpkin" : "Green Pumpkin / Brown";
    }
    if (family.family_id === "soft_craw") {
      return waterClarity === "dirty" ? "Black-Blue / Junebug" : "Green Pumpkin / Watermelon Red";
    }
    return "Brown-Orange Craw";
  };

  const shrimpLabel = () => waterClarity === "dirty" ? "Tan / Pink Shrimp" : "Natural Tan Shrimp";
  const crabLabel = () => waterClarity === "dirty" ? "Dark Olive / Rust Crab" : "Olive / Tan Crab";

  if (family.family_id === "soft_stickworm") {
    const label = waterClarity === "dirty"
      ? "Junebug / Black Worm"
      : waterClarity === "stained"
      ? "Green Pumpkin / Junebug Worm"
      : "Green Pumpkin / Watermelon Worm";
    const note = behavior.forage_mode === "baitfish"
      ? "Keep finesse worms natural and understated even in a baitfish window; this family works by looking easy, not by looking flashy."
      : "Natural worm shades still fish well here because the family sells a subtle, easy meal without pretending to be a bright shad bait.";
    return `${label}: ${note}`;
  }

  if (imitation === "crawfish") {
    const note = waterClarity === "dirty"
      ? "Keep it in dark craw tones like black-blue or dark green pumpkin with a little orange, not bright shad colors."
      : waterClarity === "stained"
      ? "Stay with green pumpkin, brown, orange, or muted craw tones that still read naturally in off-color water."
      : "Match local craw tones closely with green pumpkin, brown, and soft orange accents.";
    return `${crawLabel()}: ${note}`;
  }

  if (imitation === "baitfish") {
    if (waterClarity === "dirty" && meta.topwater) {
      return `${baitfishLabel()}: Surface bugs read best in dirty water with a dark silhouette that fish can track from below.`;
    }
    if (waterClarity === "dirty" && meta.trigger_type === "reaction") {
      return `${baitfishLabel()}: For moving baitfish families in murky water, lean chartreuse-white, firetiger, or white with a dark back so fish can find it fast.`;
    }
    if (waterClarity === "dirty" && (meta.trigger_type === "aggressive" || meta.profile === "bulky")) {
      return `${baitfishLabel()}: Bigger baitfish patterns hold shape better in murky water with a dark back, black, or strong silhouette.`;
    }
    if (waterClarity === "dirty") {
      return `${baitfishLabel()}: For a more natural baitfish look in murky water, gold, amber, or dark-backed shad tones keep the baitfish cue without washing out.`;
    }
    if (waterClarity === "stained" && meta.trigger_type === "reaction") {
      return `${baitfishLabel()}: A brighter baitfish color helps reaction families show up in stained water without losing the shad look.`;
    }
    if (waterClarity === "stained") {
      return `${baitfishLabel()}: Gold, amber, and darker shad backs stay believable for baitfish in stained water.`;
    }
    return `${baitfishLabel()}: Stay close to white, silver, gray, olive-back, or translucent baitfish tones when fish are tracking forage cleanly.`;
  }

  if (imitation === "shrimp") {
    const note = waterClarity === "dirty"
      ? "Use the darker or slightly hotter version of the shrimp color, but keep it shrimp-like rather than switching to generic chartreuse."
      : "Tan, pink, cream, and translucent shrimp tones keep the profile believable.";
    return `${shrimpLabel()}: ${note}`;
  }

  if (imitation === "crab") {
    const note = waterClarity === "dirty"
      ? "Use darker olive, brown, or rust crab tones that keep a bottom-forage look while still showing up."
      : "Olive, tan, rust, and brown crab tones keep it grounded in the right forage family.";
    return `${crabLabel()}: ${note}`;
  }

  if (family.family_id === "leech_worm_fly") {
    if (presentation.color_family === "craw_pattern") {
      const label = waterClarity === "dirty" ? "Rust / Olive Bugger" : "Brown / Olive Bugger";
      return `${label}: Bugger-style flies can still sell a craw or sculpin look when you stay in rusty olive, brown, and dark natural tones.`;
    }
    if (waterClarity === "dirty") {
      return "Black / Olive Bugger: Dark bugger-style flies hold a strong silhouette in dirty water without looking unnaturally loud.";
    }
  }

  if (family.family_id === "streamer_articulated" && waterClarity === "dirty") {
    return "Black / Olive Baitfish: Big articulated flies show up best in dirty water with a strong dark back and a clean baitfish silhouette.";
  }

  if (family.family_id === "streamer_baitfish" && waterClarity === "dirty") {
    return "White / Gold Minnow: In dirty water, a pale belly with gold flash keeps the baitfish cue visible without washing into one flat chartreuse blob.";
  }

  if (waterClarity === "dirty" && presentation.flash === "heavy") {
    return `${COLOR_FAMILY_DISPLAY.chartreuse_white.label}: Off-color water plus heavy flash calls for the brightest, highest-contrast version of this family.`;
  }

  return `${COLOR_FAMILY_DISPLAY[presentation.color_family].label}: Match the most natural version of this family for the current water color and light level.`;
}

export function buildExplanations(
  scored: ScoredFamily[],
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
  local_date: string,
  waterClarity: WaterClarity,
): RankedFamily[] {
  return scored.map((family) => {
    const seed = buildSeed(local_date, species, family.family_id);
    const meta = getFamilyMeta(family.family_id);

    return {
      family_id: family.family_id,
      display_name: family.display_name,
      examples: resolveExamples(family.family_id, species, context, local_date, meta.examples),
      score: family.score,
      score_reasons: family.score_reasons,
      score_breakdown: family.breakdown,
      why_picked: buildWhyPicked(family),
      how_to_fish: buildHowToFish(family, presentation, seed),
      best_when: buildBestWhen(family, behavior, presentation),
      color_guide: buildColorGuide(family, behavior, presentation, waterClarity),
    };
  });
}
