import type {
  ArchetypeIdV4,
  ArchetypeProfileV4,
  SeasonalRowV4,
  TacticalColumn,
  TacticalPace,
} from "../v4/contracts.ts";
import type { TargetProfile } from "./shapeProfiles.ts";

type CopyVariants = readonly [string, string, string];
type PaceCopy = Partial<Record<TacticalPace, CopyVariants>>;

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function copyVariantIndex(
  seed: string,
  field: "why" | "how",
): 0 | 1 | 2 {
  return (hashSeed(`${seed}|${field}`) % 3) as 0 | 1 | 2;
}

function columnZoneLabel(c: TacticalColumn): string {
  switch (c) {
    case "bottom":
      return "bottom zone";
    case "mid":
      return "middle of the water column";
    case "upper":
      return "upper water column";
    case "surface":
      return "surface";
  }
}

function columnPlacementPhrase(c: TacticalColumn): string {
  switch (c) {
    case "bottom":
      return "in the bottom zone";
    case "mid":
      return "in the middle of the water column";
    case "upper":
      return "in the upper water column";
    case "surface":
      return "on the surface";
  }
}

function paceLabel(p: TacticalPace): string {
  switch (p) {
    case "slow":
      return "a slow pace";
    case "medium":
      return "a steady medium pace";
    case "fast":
      return "a fast reaction pace";
  }
}

export function buildWhyChosenCopy(args: {
  archetype: ArchetypeProfileV4;
  row: SeasonalRowV4;
  targetProfile: TargetProfile;
  variant: 0 | 1 | 2;
}): string {
  const { archetype, targetProfile, variant } = args;
  const pace = paceLabel(targetProfile.pace);
  const column = columnZoneLabel(targetProfile.column);
  const placement = columnPlacementPhrase(targetProfile.column);

  const variants: CopyVariants = [
    `Fits the ${column} today and works best at ${pace}.`,
    `${archetype.display_name} keeps you ${placement}; fish it at ${pace}.`,
    `Chosen for the ${column}, with ${pace} matching today's bite.`,
  ];

  return variants[variant];
}

const bottomDrag: PaceCopy = {
  slow: [
    "Drag it on bottom with short moves and long pauses.",
    "Keep bottom contact, move it a few inches, then pause.",
    "Work it slowly on bottom and let it sit between moves.",
  ],
  medium: [
    "Hop or drag it across bottom with brief pauses.",
    "Keep it near bottom and move it with steady short pulls.",
    "Cover bottom with controlled hops while staying in contact.",
  ],
};

const softFall: PaceCopy = {
  slow: [
    "Let it fall on slack line, pause, then lift and reset.",
    "Fish the fall slowly and let it hang before moving it.",
    "Give it slack, let it glide down, and pause before the next lift.",
  ],
  medium: [
    "Cast to likely spots, let it glide, then move on.",
    "Work it through the upper column with short lifts and controlled falls.",
    "Let it fall, twitch it once or twice, and keep covering water.",
  ],
};

const dropShot: PaceCopy = {
  slow: [
    "Hold the weight down and shake the bait in place.",
    "Keep it hovering and use tiny rod-tip pulses.",
    "Shake lightly, pause, and let the bait stay in the strike zone.",
  ],
};

const pitchCover: PaceCopy = {
  slow: [
    "Pitch it tight, let it fall, then crawl it slowly.",
    "Drop it into cover and use short hops with pauses.",
    "Let it fall cleanly, then drag it a few inches at a time.",
  ],
};

const swimMid: PaceCopy = {
  slow: [
    "Swim it slowly through the lane and pause near cover.",
    "Keep it moving just fast enough to track and add short pauses.",
    "Use a slow steady retrieve and let it drop beside cover.",
  ],
  medium: [
    "Swim it steadily through the lane with brief pauses.",
    "Use a steady retrieve and keep it tracking cleanly.",
    "Cover water at a medium pace while holding the same depth.",
  ],
  fast: [
    "Burn it through the lane to trigger reaction bites.",
    "Retrieve fast, then pause briefly when it reaches cover.",
    "Cover water quickly while keeping it in the strike zone.",
  ],
};

const spinnerRetrieve: PaceCopy = {
  slow: [
    "Slow-roll it just fast enough to keep the blade working.",
    "Keep it deep and steady with the blade barely turning.",
    "Retrieve slowly and keep light vibration in the lane.",
  ],
  medium: [
    "Retrieve steadily so the blade stays active.",
    "Keep a steady pace and let the flash cover water.",
    "Run it through the lane with a clean, even retrieve.",
  ],
  fast: [
    "Retrieve fast enough to flash and trigger reaction bites.",
    "Burn it through open lanes, then pause near cover.",
    "Cover water quickly while keeping the blade running.",
  ],
};

const jerkPause: PaceCopy = {
  slow: [
    "Twitch it once, pause, and let it hang in place.",
    "Use short pulls with long pauses between moves.",
    "Keep the cadence slow and let the bait suspend after each twitch.",
  ],
  medium: [
    "Use a twitch-pause cadence and keep it in the lane.",
    "Work it with steady snaps and short pauses.",
    "Twitch, pause, and repeat at a controlled pace.",
  ],
  fast: [
    "Snap it quickly, then add short pauses to trigger followers.",
    "Use fast twitches with brief stops in the strike zone.",
    "Work it sharply and pause just long enough for a fish to commit.",
  ],
};

const crankRetrieve: PaceCopy = {
  medium: [
    "Crank it steadily so it tracks through the right depth.",
    "Use a steady retrieve and let the bait deflect when it hits cover.",
    "Keep it digging at a medium pace with brief stalls after contact.",
  ],
  fast: [
    "Crank it fast enough to deflect and trigger reaction bites.",
    "Burn it through the lane and pause after it hits cover.",
    "Cover water quickly while keeping the bait digging.",
  ],
};

const bladeLift: PaceCopy = {
  slow: [
    "Lift it off bottom, let it fall, and pause before the next lift.",
    "Use short lifts and controlled drops near bottom.",
    "Hop it slowly and let it settle after each move.",
  ],
  medium: [
    "Snap it off bottom and let it fall on a tight line.",
    "Use steady lift-falls while keeping it near bottom.",
    "Hop it at a medium pace and watch for bites on the drop.",
  ],
};

const surfaceWalk: PaceCopy = {
  slow: [
    "Walk it slowly with pauses between twitches.",
    "Use short twitches and let it sit on top.",
    "Keep it on the surface and pause after each small move.",
  ],
  medium: [
    "Walk it steadily across the surface with short pauses.",
    "Use a steady side-to-side cadence on top.",
    "Keep it moving on the surface and pause near cover.",
  ],
  fast: [
    "Move it quickly across the surface to cover water.",
    "Use a fast topwater cadence with brief pauses.",
    "Keep it high and moving until a fish shows itself.",
  ],
};

const surfacePop: PaceCopy = {
  slow: [
    "Pop it once, let the rings fade, then pop again.",
    "Use single pops with long pauses on the surface.",
    "Keep it still between soft pops.",
  ],
  medium: [
    "Pop it steadily and pause near likely cover.",
    "Use a pop-pause cadence across the surface.",
    "Keep a steady rhythm and let it sit after louder pops.",
  ],
  fast: [
    "Pop it quickly across open lanes and pause at cover.",
    "Use sharp pops to cover water, then stop it briefly.",
    "Move it fast on top while keeping short pauses in the cadence.",
  ],
};

const frogSurface: PaceCopy = {
  slow: [
    "Twitch it in place and pause over cover.",
    "Move it a few inches at a time and let it sit.",
    "Keep it on top, pause often, and work tight to cover.",
  ],
  medium: [
    "Walk it over cover with steady twitches.",
    "Use a steady topwater cadence and pause in openings.",
    "Keep it moving across cover, then stop it at the edges.",
  ],
};

const flyStrip: PaceCopy = {
  slow: [
    "Strip slowly with long pauses so the fly hangs in the lane.",
    "Use short strips, then let the fly pause and sink.",
    "Keep the retrieve slow and let the fly breathe between strips.",
  ],
  medium: [
    "Strip steadily through the lane with brief pauses.",
    "Use medium strips and keep the fly tracking cleanly.",
    "Retrieve with a steady strip-pause rhythm.",
  ],
  fast: [
    "Strip quickly to make the fly dart, then pause briefly.",
    "Use fast strips through the lane to trigger reaction bites.",
    "Move it fast, then kill it for a short pause.",
  ],
};

const flyLeech: PaceCopy = {
  slow: [
    "Let it sink, then use slow strips with long pauses.",
    "Crawl it through the lane with short strips and stalls.",
    "Keep it slow and let the materials pulse between moves.",
  ],
  medium: [
    "Strip it steadily and pause when it reaches cover.",
    "Use medium strips while keeping it in the lower lane.",
    "Swim it with a steady strip-pause cadence.",
  ],
};

const flyBottom: PaceCopy = {
  slow: [
    "Keep it low with short strips and long pauses.",
    "Bump it near bottom and let it settle between moves.",
    "Work it slowly along bottom with controlled strips.",
  ],
  medium: [
    "Use short strips near bottom and pause after contact.",
    "Hop it along the bottom lane at a steady pace.",
    "Keep it low and move it with controlled medium strips.",
  ],
};

const flySurface: PaceCopy = {
  slow: [
    "Move it on top with small twitches and long pauses.",
    "Let it sit on the surface, then give it one short move.",
    "Keep it slow on top and pause after each twitch.",
  ],
  medium: [
    "Work it steadily on the surface with short pauses.",
    "Use a steady topwater cadence and stop it near cover.",
    "Keep it moving on top, then pause in the strike zone.",
  ],
  fast: [
    "Move it quickly across the surface and pause near cover.",
    "Use fast strips on top to cover water, then stop it.",
    "Skate it fast across open lanes with brief pauses.",
  ],
};

export const HOW_COPY_BY_ARCHETYPE_ID: Record<ArchetypeIdV4, PaceCopy> = {
  weightless_stick_worm: softFall,
  carolina_rigged_stick_worm: bottomDrag,
  shaky_head_worm: bottomDrag,
  drop_shot_worm: dropShot,
  drop_shot_minnow: dropShot,
  ned_rig: bottomDrag,
  tube_jig: bottomDrag,
  texas_rigged_soft_plastic_craw: pitchCover,
  football_jig: bottomDrag,
  compact_flipping_jig: pitchCover,
  finesse_jig: bottomDrag,
  swim_jig: swimMid,
  hair_jig: bottomDrag,
  inline_spinner: spinnerRetrieve,
  spinnerbait: spinnerRetrieve,
  bladed_jig: swimMid,
  paddle_tail_swimbait: swimMid,
  soft_jerkbait: jerkPause,
  suspending_jerkbait: jerkPause,
  squarebill_crankbait: crankRetrieve,
  flat_sided_crankbait: crankRetrieve,
  medium_diving_crankbait: crankRetrieve,
  deep_diving_crankbait: crankRetrieve,
  lipless_crankbait: crankRetrieve,
  blade_bait: bladeLift,
  casting_spoon: swimMid,
  walking_topwater: surfaceWalk,
  popping_topwater: surfacePop,
  buzzbait: surfaceWalk,
  prop_bait: surfaceWalk,
  hollow_body_frog: frogSurface,
  large_profile_pike_swimbait: swimMid,
  pike_jerkbait: jerkPause,
  large_bucktail_spinner: spinnerRetrieve,
  large_pike_topwater: surfaceWalk,
  pike_jig_and_plastic: bottomDrag,
  clouser_minnow: flyStrip,
  deceiver: flyStrip,
  bucktail_baitfish_streamer: flyStrip,
  slim_minnow_streamer: flyStrip,
  articulated_baitfish_streamer: flyStrip,
  articulated_dungeon_streamer: flyStrip,
  game_changer: flyStrip,
  jighead_marabou_leech: flyLeech,
  lead_eye_leech: flyLeech,
  woolly_bugger: flyLeech,
  rabbit_strip_leech: flyLeech,
  balanced_leech: flyLeech,
  zonker_streamer: flyStrip,
  sculpin_streamer: flyBottom,
  sculpzilla: flyBottom,
  muddler_sculpin: flyBottom,
  crawfish_streamer: flyBottom,
  conehead_streamer: flyStrip,
  pike_bunny_streamer: flyStrip,
  large_articulated_pike_streamer: flyStrip,
  unweighted_baitfish_streamer: flyStrip,
  baitfish_slider_fly: flyStrip,
  warmwater_crawfish_fly: flyBottom,
  warmwater_worm_fly: flyBottom,
  popper_fly: flySurface,
  deer_hair_slider: flySurface,
  foam_gurgler_fly: flySurface,
  frog_fly: flySurface,
  feather_jig_leech: flyLeech,
  pike_flash_fly: flyStrip,
  mouse_fly: flySurface,
};

const fallbackHow: Record<TacticalPace, CopyVariants> = {
  slow: [
    "Fish it slowly in the right lane with long pauses.",
    "Use short moves, stay in the lane, and pause often.",
    "Keep the retrieve slow and controlled.",
  ],
  medium: [
    "Work it steadily through the right lane.",
    "Use a medium retrieve and keep it tracking cleanly.",
    "Cover water at a controlled pace.",
  ],
  fast: [
    "Move it quickly through the right lane.",
    "Use a fast retrieve to trigger reaction bites.",
    "Cover water quickly while staying at the right depth.",
  ],
};

export function buildHowToFishCopy(args: {
  archetype: ArchetypeProfileV4;
  targetProfile: TargetProfile;
  variant: 0 | 1 | 2;
}): string {
  const { archetype, targetProfile, variant } = args;
  const paceCopy = HOW_COPY_BY_ARCHETYPE_ID[archetype.id];
  const variants = paceCopy[targetProfile.pace] ??
    fallbackHow[targetProfile.pace];
  return variants[variant];
}
