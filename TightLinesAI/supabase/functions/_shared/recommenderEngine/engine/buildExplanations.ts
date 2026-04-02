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
      return rotateExamples(["Bass jig", "Football jig", "Flipping jig", "Swim jig", "Skipping jig", "Shaky head", "Finesse jig", "Arky jig", "Standup jig", "Pitch jig"]);
    }
    if (species === "walleye") {
      return rotateExamples(["Ball-head jig", "Minnow jig", "Hair jig", "Swimbait jighead", "Precision jig", "Paddletail jig", "Stinger-hook jig", "Live-bait jig", "Slow-death jig"]);
    }
    if (species === "river_trout") {
      return rotateExamples(["Marabou jig", "Trout jig", "Micro jig", "Hair jig", "Crappie-size jig", "Feathered jig", "Soft-plastic jig", "Grub jig", "Small swim jig"]);
    }
    if (species === "pike_musky") {
      return rotateExamples(["Musky jig", "Heavy bucktail jig", "Magnum jig", "Rubber-skirted jig", "Pike jig", "Oversized swim jig", "Sucker jig", "Bulldawg jig", "Double-tail jig"]);
    }
    if (context === "coastal" || context === "coastal_flats_estuary") {
      return rotateExamples(["Bucktail jig", "Paddletail jighead", "Flats jig", "Bridge jig", "Grass-line jig", "Dock-light jig", "Channel jig", "Mangrove jig", "Structure jig"]);
    }
  }

  if (familyId === "diving_crankbait" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Squarebill crankbait", "Flat-side crankbait", "Round-bill crankbait", "Coffin-bill crankbait", "Shallow-running crankbait", "Wake-style crankbait", "Silent crankbait", "Deep diver crankbait", "Medium diver crankbait"]);
  }

  if (familyId === "jerkbait") {
    if (isFreshwaterBass(species, context)) {
      return rotateExamples(["Suspending jerkbait", "Soft jerkbait", "Fluke-style minnow", "Twitch bait", "Deep jerkbait", "Slash bait", "Rip bait", "Shallow jerkbait", "Minnow jerkbait"]);
    }
  }

  if (familyId === "spinnerbait" && isFreshwaterBass(species, context)) {
    return rotateExamples(["Spinnerbait", "Bladed jig", "ChatterBait", "Compact spinnerbait", "Double-willow spinnerbait", "Colorado-blade spinnerbait", "Tandem spinnerbait", "Short-arm spinnerbait", "Finesse spinnerbait"]);
  }

  if (familyId === "soft_swimbait") {
    if (species === "walleye") {
      return rotateExamples(["Paddle tail minnow", "Curly tail grub", "Swim shad", "Boot tail minnow", "Walleye swimbait", "Ringworm swimbait", "Fluke minnow", "Glitter shad", "Shad body swimbait"]);
    }
    if (context === "coastal" || context === "coastal_flats_estuary") {
      return rotateExamples(["Paddle tail swimbait", "Saltwater shad", "Mullet swimbait", "Flats swimbait", "Jighead swimbait", "Inshore paddle tail", "Boot tail shad", "Channel swimbait", "Dock-light swimbait"]);
    }
  }

  if (familyId === "shrimp_crab_plastic") {
    if (species === "redfish") {
      return rotateExamples(["Gold-fleck shrimp", "Weighted crab bait", "Flats shrimp", "Rigged shrimp", "Jighead shrimp", "DOA Shrimp", "Sight-cast shrimp", "Mud crab soft plastic", "Fiddler crab bait"]);
    }
    if (species === "snook") {
      return rotateExamples(["Vudu Shrimp", "Suspending shrimp", "Dock-light shrimp", "Live shrimp imitation", "Jighead shrimp", "DOA Shrimp", "Mangrove shrimp", "Light-tackle shrimp", "Channel shrimp"]);
    }
    if (species === "seatrout") {
      return rotateExamples(["DOA Shrimp", "Suspending shrimp", "Popping-cork shrimp", "Vudu Shrimp", "Jighead shrimp", "Flats shrimp", "Grass-flat shrimp", "Light shrimp bait", "Under-cork shrimp"]);
    }
  }

  if (familyId === "topwater_popper") {
    if (context === "coastal" || context === "coastal_flats_estuary") {
      return rotateExamples(["Saltwater popper", "Pencil popper", "Chugger", "Walk-and-pop", "Surf popper", "Inshore chug bait", "Light-tackle popper", "Flats popper", "Mangrove popper"]);
    }
  }

  if (familyId === "topwater_walker") {
    if (context === "coastal" || context === "coastal_flats_estuary") {
      return rotateExamples(["Saltwater walker", "Inshore walking bait", "Cigar walker", "Pencil bait", "Dawn walker", "Mangrove walker", "Dock-light walker", "Channel walker", "Weighted walker"]);
    }
  }

  if (familyId === "streamer_articulated") {
    if (isFreshwaterBass(species, context)) {
      return rotateExamples(["Game Changer", "Double Deceiver", "Sex Dungeon", "Articulated Minnow", "Circus Peanut", "Drunk & Disorderly", "Barely Legal", "Heifer Groomer", "Swimmin' Jimmy"]);
    }
    if (species === "pike_musky") {
      return rotateExamples(["Game Changer", "Buford", "Drunk & Disorderly", "Barely Legal", "Magnum articulated", "Double bunny pike", "Circus Peanut", "Heifer Groomer", "Big Game Changer"]);
    }
  }

  if (familyId === "slider_diver_fly") {
    if (isFreshwaterBass(species, context)) {
      return rotateExamples(["Sneaky Pete", "Bass slider", "Foam slider", "Deer-hair slider", "Diver bug", "Hard-foam diver", "Crease fly", "Subsurface slider", "Gartside Gurgler"]);
    }
  }

  if (familyId === "leech_worm_fly") {
    if (isFreshwaterBass(species, context)) {
      return rotateExamples(["Woolly Bugger", "Zonker", "Muddler Minnow", "Bunny leech", "Sculpin streamer", "Rabbit-strip leech", "Crystal Bugger", "Mohair leech", "Pine Squirrel leech"]);
    }
  }

  if (familyId === "streamer_baitfish") {
    if (species === "striped_bass") {
      return rotateExamples(["Clouser Minnow", "Lefty's Deceiver", "Half & Half", "Hollow Fleye", "EP Minnow", "Grocery Fly", "Surf Candy", "Flatwing", "Polar Fiber Minnow"]);
    }
    if (species === "snook") {
      return rotateExamples(["Clouser Minnow", "Lefty's Deceiver", "EP Minnow", "Hollow Fleye", "Mangrove minnow", "Dock-light streamer", "Glass minnow fly", "Half & Half", "Baitfish Bunny"]);
    }
    if (species === "tarpon") {
      return rotateExamples(["Tarpon Bunny", "Cockroach", "Black Death", "EP Baitfish", "Tarpon Toad", "Apte Too", "Lefty's Deceiver", "Laid-Up streamer", "Mega Clouser"]);
    }
  }

  if (familyId === "shrimp_fly") {
    if (species === "redfish") {
      return rotateExamples(["EP Shrimp", "Ultra Shrimp", "Borski Slider", "Kwan shrimp", "Sight-fish shrimp", "Grass shrimp fly", "Pop-eye shrimp", "Gotcha", "Fox Shrimp"]);
    }
    if (species === "snook") {
      return rotateExamples(["EP Shrimp", "Gotcha", "Dock-light shrimp fly", "Fox Shrimp", "Borski Slider", "Ultra Shrimp", "Glass shrimp fly", "Kwan shrimp", "Mangrove shrimp fly"]);
    }
  }

  if (familyId === "crab_fly") {
    if (species === "redfish") {
      return rotateExamples(["Del Brown Crab", "EP Crab", "Raghead Crab", "Flexo Crab", "Tan crab fly", "Spawning crab fly", "Sight-fish crab", "Permit Crab", "Velcro Crab"]);
    }
    if (species === "tarpon") {
      return rotateExamples(["Del Brown Crab", "EP Crab", "Spawning crab fly", "Flexo Crab", "Raghead Crab", "Tarpon crab", "Velcro Crab", "Permit Crab", "Tan crab fly"]);
    }
  }

  if (familyId === "bucktail_jig") {
    if (species === "striped_bass") {
      return rotateExamples(["Spro bucktail", "Andrus Jetty bucktail", "Hogy bucktail", "Smiling Bill bucktail", "White bucktail jig", "Chartreuse bucktail", "Surf bucktail", "Deep-water bucktail", "Heavy bucktail"]);
    }
    if (species === "snook") {
      return rotateExamples(["White bucktail jig", "Chartreuse bucktail", "Dock-light bucktail", "Light-tackle bucktail", "Mangrove bucktail", "Bridge bucktail", "Flats bucktail", "Channel bucktail", "Jig-and-grub bucktail"]);
    }
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
  seed: string,
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
    const templates = [
      `This family ${anchor} and ${differentiator}.`,
      `Picked because it ${anchor} while also fitting the conditions: ${differentiator}.`,
      `Strong match — ${anchor} and ${differentiator}.`,
      `This one ${anchor}. It also ${differentiator}.`,
      `A good fit because it ${anchor} and ${differentiator}.`,
      `It scored well because it ${anchor}, plus ${differentiator}.`,
      `This family stands out because it ${anchor} and ${differentiator}.`,
      `Two key reasons: it ${anchor} and ${differentiator}.`,
      `Selected because it ${anchor}. Bonus: it also ${differentiator}.`,
      `This family checks the right boxes — it ${anchor} and ${differentiator}.`,
      `Recommended because it ${anchor}, and ${differentiator}.`,
      `This is a top pick because it ${anchor} while also matching: ${differentiator}.`,
      `A strong choice — it ${anchor} and ${differentiator} in today's conditions.`,
      `Why this one? It ${anchor} and ${differentiator}.`,
    ];
    return pickDeterministic(templates, seed, `why:${family.family_id}`);
  }
  if (family.score_reasons.length >= 2) {
    const templates = [
      `This family ${family.score_reasons[0]} and ${family.score_reasons[1]}.`,
      `It ${family.score_reasons[0]}, plus ${family.score_reasons[1]}.`,
      `Picked because it ${family.score_reasons[0]} and ${family.score_reasons[1]}.`,
      `A solid match — ${family.score_reasons[0]} and ${family.score_reasons[1]}.`,
      `Good fit for today: it ${family.score_reasons[0]} and ${family.score_reasons[1]}.`,
      `This one works because it ${family.score_reasons[0]} and ${family.score_reasons[1]}.`,
      `Selected because it ${family.score_reasons[0]}. It also ${family.score_reasons[1]}.`,
    ];
    return pickDeterministic(templates, seed, `why:reasons:${family.family_id}`);
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
  seed: string,
): string {
  if (family.breakdown.some((item) => item.code === "current_fit")) {
    return pickDeterministic([
      "Best when moving current or tide is positioning fish and you need a natural drift through the lane.",
      "This family shines when current or tide is pushing bait and positioning fish along the seam.",
      "Use this when moving water is concentrating fish and a natural drift through the lane is key.",
      "Ideal when tide or current is active and fish are set up along the flow.",
      "A strong choice when moving water is the primary factor positioning fish.",
      "Best fished in current — let the water move the bait naturally through the strike zone.",
      "This family works best when current or tide is creating feeding lanes for fish.",
      "Perfect for moving water situations where fish are stacked along the seam.",
      "Use this when current flow is positioning bait and fish are lined up to eat.",
      "Ideal when tidal movement or river current is actively pushing fish into feeding positions.",
      "This one excels in moving water. Let the current deliver the presentation naturally.",
      "Best when the current is doing the work — drifting or swinging through the lane is the play.",
      "A go-to choice when moving water concentrates fish along current seams and structure edges.",
      "Fish this when current is active. The natural drift through the feeding lane is the trigger.",
    ], seed, `best:current:${family.family_id}`);
  }

  if (family.breakdown.some((item) => item.code === "cover_fit")) {
    return pickDeterministic([
      "Best when fish are tight to grass, reeds, pads, timber, or other snaggy cover.",
      "This family works best when fish are buried in heavy cover and you need to go in after them.",
      "Use this when fish are holding tight to vegetation, wood, or other structure.",
      "Ideal for fishing through thick cover where other presentations would hang up.",
      "A top choice when fish are relating to cover — grass, timber, laydowns, or pads.",
      "Best when you need to fish right in the thick of cover without getting snagged.",
      "This family excels when fish are tight to cover and won't come out to chase.",
      "Perfect for punching through heavy cover or fishing along the edge of thick vegetation.",
      "Use this when fish are hiding in the thickest cover on the water and you need to reach them.",
      "Ideal when cover is the primary factor — fish are using it for ambush or shade.",
      "A strong pick when you need to get into heavy structure without hanging up.",
      "Best when fish are buried in cover. This family gets into tight spots that others can't reach.",
      "This one shines when fish are tight to laydowns, stumps, grass mats, or heavy timber.",
      "Use this when cover is everywhere and you need a presentation that can fish through it cleanly.",
    ], seed, `best:cover:${family.family_id}`);
  }

  const seasonalPrefix = behavior.seasonal_flag
    ? `${behavior.seasonal_flag.replace(/_/g, " ")} periods`
    : "today's window";
  const depthZone = presentation.depth_target.replace(/_/g, " ");

  return pickDeterministic([
    `Best in ${seasonalPrefix} when fish stay ${behavior.activity} and hold around the ${depthZone} zone.`,
    `Strongest during ${seasonalPrefix} with ${behavior.activity} fish set up in the ${depthZone} zone.`,
    `This family fits ${seasonalPrefix} when fish are ${behavior.activity} and holding ${depthZone}.`,
    `A solid pick during ${seasonalPrefix} with ${behavior.activity} fish in the ${depthZone} range.`,
    `Works best in ${seasonalPrefix} when ${behavior.activity} fish are positioned around the ${depthZone} zone.`,
    `Ideal for ${seasonalPrefix} when fish are ${behavior.activity} and set up ${depthZone}.`,
    `Best during ${seasonalPrefix} when the bite is ${behavior.activity} in the ${depthZone} zone.`,
    `This family produces best during ${seasonalPrefix} with fish ${behavior.activity} near the ${depthZone} range.`,
    `A top choice during ${seasonalPrefix} when activity is ${behavior.activity} and fish hold ${depthZone}.`,
    `Use this during ${seasonalPrefix} when fish stay ${behavior.activity} around the ${depthZone} zone.`,
    `Matches well during ${seasonalPrefix} with ${behavior.activity} fish in the ${depthZone} zone.`,
    `Best when the seasonal window is ${seasonalPrefix} and fish are ${behavior.activity} at the ${depthZone} level.`,
    `Strong choice for ${seasonalPrefix} with ${behavior.activity} fish positioned in the ${depthZone} range.`,
    `This family is at its best during ${seasonalPrefix} when fish are ${behavior.activity} in the ${depthZone} zone.`,
  ], seed, `best:seasonal:${family.family_id}`);
}

/** Pick a note variant deterministically and attach it to a color label. */
function rotateNote(
  label: string,
  notes: readonly string[],
  seed: string | undefined,
  salt: string,
): string {
  const note = seed
    ? pickDeterministic(notes, seed, `color:${salt}`)
    : notes[0]!;
  return `${label}: ${note}`;
}

function buildColorGuide(
  family: ScoredFamily,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  waterClarity: WaterClarity,
  seed?: string,
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
    if (family.family_id === "swim_jig") {
      if (waterClarity === "dirty") return "Black-Blue / Chartreuse";
      if (waterClarity === "stained") return "Green Pumpkin / White";
      return "Bluegill / Shad";
    }
    if (family.family_id === "underspin") {
      if (waterClarity === "dirty") return "Pearl / Chartreuse";
      if (waterClarity === "stained") return "Pearl / Olive";
      return "Silver / Natural Shad";
    }
    if (family.family_id === "blade_bait") {
      if (waterClarity === "dirty") return "Gold / Chartreuse";
      if (waterClarity === "stained") return "Gold / Silver";
      return "Chrome / Silver";
    }
    if (family.family_id === "inline_spinner") {
      if (waterClarity === "dirty") return "Chartreuse / Gold Blade";
      if (waterClarity === "stained") return "Silver / White";
      return "Silver / Natural Dressing";
    }
    if (family.family_id === "bucktail_jig") {
      if (waterClarity === "dirty") return "Chartreuse / White Bucktail";
      if (waterClarity === "stained") return "White / Olive Bucktail";
      return "White / Natural Bucktail";
    }
    if (family.family_id === "topwater_prop") {
      if (waterClarity === "dirty") return "Bone / Black Back";
      if (waterClarity === "stained") return "Bone / Chrome";
      return "Clear / Chrome";
    }
    if (family.family_id === "buzzbait") {
      if (waterClarity === "dirty") return "Black / Chartreuse";
      return "White / Gold Blade";
    }
    if (family.family_id === "drop_shot") {
      if (waterClarity === "dirty") return "Smoke / Dark Worm";
      if (waterClarity === "stained") return "Green Pumpkin Shad";
      return "Morning Dawn / Natural";
    }
    if (family.family_id === "sand_eel_fly") {
      if (waterClarity === "dirty") return "Chartreuse / White Eel";
      if (waterClarity === "stained") return "Olive / White Eel";
      return "Tan / White Eel";
    }
    if (family.family_id === "bendback_streamer") {
      if (waterClarity === "dirty") return "Chartreuse / White";
      if (waterClarity === "stained") return "Olive / White";
      return "Tan / White";
    }
    if (family.family_id === "gold_spoon") {
      if (waterClarity === "dirty") return "Hammered Gold";
      if (waterClarity === "stained") return "Gold / Copper";
      return "Polished Gold";
    }
    if (family.family_id === "topwater_plug") {
      if (waterClarity === "dirty") return "Bone / Black Back";
      if (waterClarity === "stained") return "Bone / Silver Flash";
      return "Clear / Chrome";
    }
    if (family.family_id === "soft_jerkbait_coastal") {
      if (waterClarity === "dirty") return "Chartreuse / White Fluke";
      if (waterClarity === "stained") return "Pearl / Olive Fluke";
      return "Clear / Natural Fluke";
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
    if (family.family_id === "ned_rig") {
      return waterClarity === "dirty" ? "Green Pumpkin / Black" : "Green Pumpkin / TRD";
    }
    if (family.family_id === "crawfish_streamer") {
      return waterClarity === "dirty" ? "Rust / Olive Craw" : "Brown / Olive Craw";
    }
    return "Brown-Orange Craw";
  };

  const shrimpLabel = () => waterClarity === "dirty" ? "Tan / Pink Shrimp" : "Natural Tan Shrimp";
  const crabLabel = () => waterClarity === "dirty" ? "Dark Olive / Rust Crab" : "Olive / Tan Crab";

  if (family.family_id === "soft_stickworm" || family.family_id === "wacky_rig") {
    const label = waterClarity === "dirty"
      ? "Junebug / Black Worm"
      : waterClarity === "stained"
      ? "Green Pumpkin / Junebug Worm"
      : "Green Pumpkin / Watermelon Worm";
    const notes = behavior.forage_mode === "baitfish"
      ? [
          "Keep finesse worms natural and understated even in a baitfish window; this family works by looking easy, not by looking flashy.",
          "Even when baitfish are the primary forage, worm colors should stay subdued — this family sells an easy meal, not a shad imitation.",
          "Natural worm tones work because the family triggers a different feeding response than chasing baitfish — keep it subtle.",
          "Don't try to match baitfish colors with a worm — stay in the natural worm lane and let the slow fall do the work.",
          "Stick with understated worm colors even during a baitfish bite; this family catches fish that want something easy and slow.",
          "Finesse worm colors should stay muted — the presentation sells the meal, not the color.",
        ]
      : [
          "Natural worm shades still fish well here because the family sells a subtle, easy meal without pretending to be a bright shad bait.",
          "Stay in the natural color lane — green pumpkin, watermelon, and junebug are proven year-round.",
          "Subtle earth-tone worm colors work across most conditions because the slow action does the selling.",
          "Worm colors should blend in, not stand out — natural tones let the fall and subtle movement do the talking.",
          "This is a presentation-driven family — keep colors realistic and let the action generate the bite.",
          "Match the bottom with natural worm tones; fish eat this family because it looks like an easy, unaware meal.",
        ];
    return rotateNote(label, notes, seed, "worm");
  }

  if (imitation === "crawfish") {
    const notes = waterClarity === "dirty"
      ? [
          "Keep it in dark craw tones like black-blue or dark green pumpkin with a little orange, not bright shad colors.",
          "Dark craw colors like black-blue and green pumpkin with orange accents hold up best in murky water.",
          "Stick to dark, muted craw tones — black-blue, dark pumpkin, and rust read as crawfish even in poor visibility.",
          "In dirty water, crawfish baits need dark contrast colors to stay visible on the bottom.",
          "Go darker than you think — black-blue and green pumpkin with a touch of orange are your best craw tones here.",
          "Dark craw patterns with orange or rust accents give fish a crawfish silhouette they can find in low visibility.",
        ]
      : waterClarity === "stained"
      ? [
          "Stay with green pumpkin, brown, orange, or muted craw tones that still read naturally in off-color water.",
          "Green pumpkin, brown, and amber are the go-to craw colors in stained conditions.",
          "Muted craw tones — pumpkin, brown, and soft orange — read naturally in stained water without washing out.",
          "In stained water, natural craw colors like green pumpkin and brown are more effective than overly bright patterns.",
          "Keep craw colors realistic — green pumpkin and brown with orange accents match natural crawfish in stained water.",
          "Stained water favors natural craw tones over dark or bright extremes — green pumpkin and brown are the sweet spot.",
        ]
      : [
          "Match local craw tones closely with green pumpkin, brown, and soft orange accents.",
          "Clear water demands realistic craw colors — green pumpkin, watermelon red, and natural brown are best.",
          "Go as natural as possible with craw colors in clear water — fish can see every detail.",
          "Natural craw tones like green pumpkin and watermelon red are most convincing in clear conditions.",
          "In clear water, keep craw colors subtle and realistic — green pumpkin with orange or red flake is ideal.",
          "Match the local crawfish color exactly — green pumpkin, brown, and soft orange are the baseline in clear water.",
        ];
    return rotateNote(crawLabel(), notes, seed, "craw");
  }

  if (imitation === "baitfish") {
    const label = baitfishLabel();
    if (waterClarity === "dirty" && meta.topwater) {
      return rotateNote(label, [
        "Surface bugs read best in dirty water with a dark silhouette that fish can track from below.",
        "In murky water, topwater baits need a dark belly or back so fish can see them against the sky.",
        "Dark silhouettes on the surface cut through dirty water — fish track the shadow from below.",
        "Go dark on top in dirty water — a strong silhouette is what fish key on from underneath.",
        "Surface presentations in murky water depend on contrast from below — dark colors win.",
        "A dark topwater profile is critical in dirty water — fish use silhouette, not detail, to strike.",
      ], seed, "bait:dirty:top");
    }
    if (waterClarity === "dirty" && meta.trigger_type === "reaction") {
      return rotateNote(label, [
        "For moving baitfish families in murky water, lean chartreuse-white, firetiger, or white with a dark back so fish can find it fast.",
        "In dirty water, reaction baits need chartreuse, firetiger, or high-contrast white so fish can track them at speed.",
        "Bright, high-contrast baitfish colors help reaction families cut through murky water on the move.",
        "Murky water calls for louder baitfish colors — chartreuse-white and firetiger keep fish locked on a fast-moving bait.",
        "When visibility is low and the bait is moving, go chartreuse-white or firetiger to give fish a target.",
        "Dirty water plus a reaction retrieve means going brighter — chartreuse, white, and dark-backed patterns are the play.",
      ], seed, "bait:dirty:react");
    }
    if (waterClarity === "dirty" && (meta.trigger_type === "aggressive" || meta.profile === "bulky")) {
      return rotateNote(label, [
        "Bigger baitfish patterns hold shape better in murky water with a dark back, black, or strong silhouette.",
        "Large-profile baits in dirty water need a strong silhouette — dark backs and bold outlines read best.",
        "In murky water, bulky baits need contrast: dark backs, strong outlines, and bold baitfish profiles.",
        "Go with a dark-backed or black-accented pattern — big profiles need a strong outline in dirty water.",
        "Bulk plus murky water means relying on silhouette — dark colors and strong outlines are essential.",
        "Large baitfish profiles in low visibility need maximum contrast: dark backs, bold outlines, and clean silhouettes.",
      ], seed, "bait:dirty:bulk");
    }
    if (waterClarity === "dirty") {
      return rotateNote(label, [
        "For a more natural baitfish look in murky water, gold, amber, or dark-backed shad tones keep the baitfish cue without washing out.",
        "Gold, amber, and dark shad backs give fish a baitfish outline in dirty water without looking unnatural.",
        "In murky water, go with gold or amber shad tones — they hold the baitfish silhouette without washing flat.",
        "Natural dark-backed shad tones and gold flash are the best baitfish colors when visibility is poor.",
        "Dirty water baitfish colors should lean gold, amber, or dark-backed — they read as forage without being invisible.",
        "Keep it in the gold and amber lane for dirty-water baitfish — bright enough to find, natural enough to eat.",
      ], seed, "bait:dirty:nat");
    }
    if (waterClarity === "stained" && meta.trigger_type === "reaction") {
      return rotateNote(label, [
        "A brighter baitfish color helps reaction families show up in stained water without losing the shad look.",
        "In stained water, reaction baits benefit from a slightly brighter shad tone — pearl or silver with flash.",
        "Reaction baits in stained water need a little extra brightness to stay visible on the move.",
        "Go a shade brighter than natural on reaction baits in stained water — pearl, silver, and light flash work well.",
        "Stained water reaction baits should lean bright but still look like baitfish — pearl and silver with flash.",
        "Keep it bright but baitfish-shaped in stained water — pearl and silver tones with flash are ideal for reaction families.",
      ], seed, "bait:stain:react");
    }
    if (waterClarity === "stained") {
      return rotateNote(label, [
        "Gold, amber, and darker shad backs stay believable for baitfish in stained water.",
        "In stained water, gold and olive shad tones stay realistic while remaining visible to fish.",
        "Darker shad backs and gold flash are the sweet spot for baitfish colors in stained conditions.",
        "Stained water baitfish colors should lean gold, olive, and dark-backed — natural but not invisible.",
        "Keep baitfish tones in the gold and olive range in stained water — they read as natural forage.",
        "Natural gold and dark-backed shad patterns stay convincing in stained water without washing out.",
      ], seed, "bait:stain");
    }
    return rotateNote(label, [
      "Stay close to white, silver, gray, olive-back, or translucent baitfish tones when fish are tracking forage cleanly.",
      "Clear water calls for the most natural baitfish colors — white, silver, pearl, and translucent tones.",
      "Fish can see every detail in clear water — match the local baitfish as closely as possible with silver, white, and olive.",
      "Go translucent and natural in clear water — pearl, silver, and ghost patterns are the most convincing baitfish colors.",
      "In clear conditions, the most realistic baitfish color wins — silver, white, and translucent shad tones.",
      "Match the hatch exactly in clear water with natural silver, white, pearl, or olive-back baitfish colors.",
    ], seed, "bait:clear");
  }

  if (imitation === "shrimp") {
    const notes = waterClarity === "dirty"
      ? [
          "Use the darker or slightly hotter version of the shrimp color, but keep it shrimp-like rather than switching to generic chartreuse.",
          "In dirty water, go with a slightly darker shrimp tone — tan-pink or root beer keeps the shrimp profile without disappearing.",
          "Dirty water shrimp colors should lean darker — root beer, hot pink, or darker tan keep the forage cue visible.",
          "Don't go chartreuse when imitating shrimp — stay in the shrimp family with a slightly hotter or darker shade.",
          "A darker shrimp color holds up in murky water better than going bright — keep it in the tan and pink family.",
          "In low visibility, bump up the color intensity of the shrimp pattern without leaving the shrimp color family entirely.",
        ]
      : [
          "Tan, pink, cream, and translucent shrimp tones keep the profile believable.",
          "Natural shrimp colors — tan, pink, cream, and translucent — are the most convincing in these conditions.",
          "Stay in the natural shrimp lane with tan, pink, and cream tones for the most realistic presentation.",
          "Match the local shrimp color as closely as possible — tan, pink, and cream are the baseline.",
          "Keep shrimp colors subtle and natural — tan, translucent pink, and cream are the proven tones.",
          "Realistic shrimp colors work best here — stay close to natural tan, pink, and cream.",
        ];
    return rotateNote(shrimpLabel(), notes, seed, "shrimp");
  }

  if (imitation === "crab") {
    const notes = waterClarity === "dirty"
      ? [
          "Use darker olive, brown, or rust crab tones that keep a bottom-forage look while still showing up.",
          "In dirty water, darker crab colors — olive, brown, and rust — hold the bottom-forage profile best.",
          "Go darker on crab patterns in murky water — olive and rust tones maintain the right forage silhouette.",
          "Dark olive and rust crab tones give fish a visible bottom-forage target in low-visibility water.",
          "Dirty water crab colors should lean darker — olive, brown, and rust read as natural crabs near the bottom.",
          "Keep crab patterns in the dark olive and rust family in murky water — they hold their forage identity best.",
        ]
      : [
          "Olive, tan, rust, and brown crab tones keep it grounded in the right forage family.",
          "Natural crab colors — olive, tan, and brown — are the most realistic in these conditions.",
          "Stay in the natural crab lane with olive, tan, rust, and brown for the most convincing look.",
          "Match the local crab color with olive, tan, and brown tones — subtle and natural wins here.",
          "Keep crab colors understated and realistic — olive, tan, and rust are the proven tones.",
          "Natural crab patterns in olive, tan, and brown are the most convincing choice in this clarity.",
        ];
    return rotateNote(crabLabel(), notes, seed, "crab");
  }

  if (family.family_id === "leech_worm_fly") {
    if (presentation.color_family === "craw_pattern") {
      const label = waterClarity === "dirty" ? "Rust / Olive Bugger" : "Brown / Olive Bugger";
      return rotateNote(label, [
        "Bugger-style flies can still sell a craw or sculpin look when you stay in rusty olive, brown, and dark natural tones.",
        "Stay in olive, brown, and rust tones to keep the craw or sculpin silhouette with a bugger-style fly.",
        "Rusty olive and brown bugger patterns sell a craw or sculpin look without needing a dedicated crawfish fly.",
        "This fly works as a crawfish imitation when tied in olive, brown, and rust — keep the tones earthy.",
        "Bugger-style flies in rusty olive and brown double as effective craw or sculpin imitations.",
        "Keep this bugger in dark natural tones — olive, brown, and rust — to sell the crawfish or sculpin look.",
      ], seed, "leech:craw");
    }
    if (waterClarity === "dirty") {
      return rotateNote("Black / Olive Bugger", [
        "Dark bugger-style flies hold a strong silhouette in dirty water without looking unnaturally loud.",
        "In dirty water, black and olive bugger patterns give fish a clear target without being too flashy.",
        "A dark bugger silhouette cuts through murky water effectively — black and olive are your best bets.",
        "Dark-toned bugger flies stay visible in dirty water while keeping a natural profile.",
        "Black and olive bugger patterns are the go-to in dirty water — strong silhouette, natural look.",
        "In murky water, dark bugger flies outperform bright ones — the silhouette matters more than the color detail.",
      ], seed, "leech:dirty");
    }
  }

  if (family.family_id === "streamer_articulated" && waterClarity === "dirty") {
    return rotateNote("Black / Olive Baitfish", [
      "Big articulated flies show up best in dirty water with a strong dark back and a clean baitfish silhouette.",
      "In murky water, large articulated streamers need a dark back and bold baitfish outline to stay visible.",
      "Dark-backed articulated flies cut through dirty water — the strong silhouette is what fish track.",
      "Go dark and bold with articulated streamers in dirty water — the profile matters more than the detail.",
      "A black or olive articulated fly with a clean baitfish shape reads best in low-visibility water.",
      "Large profile plus dirty water means relying on contrast — dark backs and clean outlines are essential.",
    ], seed, "artic:dirty");
  }

  if (family.family_id === "streamer_baitfish" && waterClarity === "dirty") {
    return rotateNote("White / Gold Minnow", [
      "In dirty water, a pale belly with gold flash keeps the baitfish cue visible without washing into one flat chartreuse blob.",
      "White belly with gold flash is the go-to baitfish fly color in murky water — it stays visible without going neon.",
      "A white-and-gold minnow pattern holds the baitfish profile in dirty water better than all-chartreuse.",
      "Keep baitfish flies in the white and gold family in dirty water — they read as forage without looking unnatural.",
      "Gold flash with a white belly gives fish a baitfish target in murky water without losing the natural look.",
      "In dirty water, white and gold baitfish flies outperform all-bright patterns — they stay forage-like.",
    ], seed, "baitfly:dirty");
  }

  // When imitation didn't resolve (family won on trigger/activity, not forage),
  // use the family's own primary forage identity for color instead of the
  // ambient presentation color — a crawfish bait should still look like a
  // crawfish, and a baitfish spinner should still look like a baitfish.
  const familyPrimaryForage = meta.forage_affinity[0];
  if (!imitation && familyPrimaryForage) {
    if (familyPrimaryForage === "crawfish") {
      return rotateNote(crawLabel(), waterClarity === "dirty"
        ? [
            "This family imitates crawfish — keep it in dark craw tones like black-blue or green pumpkin.",
            "Even without a strong crawfish signal, this family should stay in dark craw colors for dirty water.",
            "Dark craw tones are the default for this family — black-blue and green pumpkin in low visibility.",
          ]
        : [
            "Match local craw tones with green pumpkin, brown, and soft orange accents.",
            "This family's crawfish identity should drive the color — green pumpkin and brown are the baseline.",
            "Stay in the crawfish color lane with green pumpkin, brown, and orange regardless of the ambient forage.",
          ], seed, "fallback:craw");
    }
    if (familyPrimaryForage === "baitfish") {
      return rotateNote(baitfishLabel(), [
        "This family imitates baitfish — stay with natural shad, silver, or white tones for the current clarity.",
        "Default to baitfish colors for this family — natural shad and silver tones match its identity.",
        "Keep this family in its baitfish lane with silver, white, or pearl tones for the current water color.",
      ], seed, "fallback:bait");
    }
    if (familyPrimaryForage === "shrimp") {
      return rotateNote(shrimpLabel(), [
        "This family imitates shrimp — keep it in natural tan, pink, or cream tones.",
        "Stay in the shrimp color family with tan, pink, and cream regardless of the ambient forage cue.",
        "Default to natural shrimp colors — tan, pink, and cream are always the right call for this family.",
      ], seed, "fallback:shrimp");
    }
    if (familyPrimaryForage === "crab") {
      return rotateNote(crabLabel(), [
        "This family imitates crab — keep it in olive, tan, or rust tones.",
        "Stay in the crab color lane with olive, tan, and rust regardless of the ambient forage signal.",
        "Default to natural crab colors — olive, tan, and brown are always appropriate for this family.",
      ], seed, "fallback:crab2");
    }
  }

  if (waterClarity === "dirty" && presentation.flash === "heavy") {
    return rotateNote(COLOR_FAMILY_DISPLAY.chartreuse_white.label, [
      "Off-color water plus heavy flash calls for the brightest, highest-contrast version of this family.",
      "In dirty water with heavy flash, go as bright and high-contrast as possible to give fish a target.",
      "Maximum brightness and contrast are the play in dirty water with flash — go chartreuse-white.",
      "Heavy flash in murky water needs the brightest version of this family to stay visible.",
      "Dirty water and heavy flash demand the highest-contrast color available — bright and bold wins.",
      "When visibility is low and flash is high, lean all the way into chartreuse-white and bold contrast.",
    ], seed, "flash:dirty");
  }

  return rotateNote(COLOR_FAMILY_DISPLAY[presentation.color_family].label, [
    "Match the most natural version of this family for the current water color and light level.",
    "Go with the most realistic color option for this family given the current clarity and conditions.",
    "Stay natural — pick the color closest to what local forage looks like in this water clarity.",
    "Match the conditions with the most natural color this family offers for the current water.",
    "Choose the color that best matches the local forage in this clarity and light.",
    "Keep it natural and let the family's action do the work — match the forage color for this clarity.",
  ], seed, "fallback:gen");
}

function parseColorLabel(colorGuide: string): string {
  const colonIdx = colorGuide.indexOf(":");
  return colonIdx > 0 ? colorGuide.slice(0, colonIdx).trim() : colorGuide;
}

function buildSecondaryForageColorGuide(
  family: ScoredFamily,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  waterClarity: WaterClarity,
): string | null {
  const meta = getFamilyMeta(family.family_id);
  const secondaryForage = behavior.secondary_forage;
  if (!secondaryForage) return null;
  if (!meta.forage_affinity.includes(secondaryForage)) return null;

  const baitfishLabel = () => {
    if (waterClarity === "dirty") return "Gold / Amber Shad";
    if (waterClarity === "stained") return "Gold / Olive Shad";
    return "Pearl / Silver";
  };
  const shrimpLabel = () => waterClarity === "dirty" ? "Tan / Pink Shrimp" : "Natural Tan Shrimp";
  const crabLabel = () => waterClarity === "dirty" ? "Dark Olive / Rust Crab" : "Olive / Tan Crab";
  const crawLabel = () => waterClarity === "dirty" ? "Black-Blue Craw" : "Green Pumpkin Craw";

  if (secondaryForage === "baitfish") {
    return `${baitfishLabel()}: Secondary forage is baitfish — try a natural shad or silver tone as an alternate look from the primary pick.`;
  }
  if (secondaryForage === "shrimp") {
    return `${shrimpLabel()}: Secondary forage is shrimp — try natural tan, pink, or cream tones as an alternate look.`;
  }
  if (secondaryForage === "crab") {
    return `${crabLabel()}: Secondary forage is crab — try olive, tan, or rust tones as an alternate look.`;
  }
  if (secondaryForage === "crawfish") {
    return `${crawLabel()}: Secondary forage is crawfish — try green pumpkin, brown, or orange accents as an alternate look.`;
  }
  return null;
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
  const results = scored.map((family) => {
    const seed = buildSeed(local_date, species, family.family_id);
    const meta = getFamilyMeta(family.family_id);

    return {
      family_id: family.family_id,
      display_name: family.display_name,
      examples: resolveExamples(family.family_id, species, context, local_date, meta.examples),
      score: family.score,
      score_reasons: family.score_reasons,
      score_breakdown: family.breakdown,
      why_picked: buildWhyPicked(family, seed),
      how_to_fish: buildHowToFish(family, presentation, seed),
      best_when: buildBestWhen(family, behavior, presentation, seed),
      color_guide: buildColorGuide(family, behavior, presentation, waterClarity, seed),
    };
  });

  // Color diversity pass: if the top 3 families all share the same color label,
  // redirect rank 2 or 3 toward secondary forage colors so the angler gets
  // visual variety across their top picks.
  if (results.length >= 3) {
    const top3Labels = results.slice(0, 3).map((r) => parseColorLabel(r.color_guide));
    if (top3Labels[0] === top3Labels[1] && top3Labels[1] === top3Labels[2]) {
      for (let i = 1; i < 3; i++) {
        const alt = buildSecondaryForageColorGuide(
          scored[i]!,
          behavior,
          presentation,
          waterClarity,
        );
        if (alt && parseColorLabel(alt) !== top3Labels[0]) {
          results[i]!.color_guide = alt;
          break; // diversify one pick — enough to break the collapse
        }
      }
    }
  }

  return results;
}
