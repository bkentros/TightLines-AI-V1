import type {
  LegacyArchetypeWaterColumnV3,
  LureArchetypeIdV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3Species,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
  TacticalLaneV3,
  ForageBucketV3,
} from "../contracts.ts";

type LegacyLureProfile = {
  id: LureArchetypeIdV3;
  display_name: string;
  gear_mode: "lure";
  family_key: string;
  top3_redundancy_key?: string;
  preferred_water_columns: readonly LegacyArchetypeWaterColumnV3[];
  preferred_moods: readonly MoodV3[];
  preferred_presentation_styles: readonly PresentationStyleV3[];
  forage_matches: readonly ForageBucketV3[];
  clarity_strengths: readonly ("clear" | "stained" | "dirty")[];
  tactical_lane: TacticalLaneV3;
  how_to_fish_text?: readonly [string, string, string];
};

const ALL_FRESHWATER_SPECIES: readonly RecommenderV3Species[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "northern_pike",
  "trout",
] as const;

const TRUE_SURFACE_IDS = new Set<LureArchetypeIdV3>([
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
]);

const PIKE_ONLY_IDS = new Set<LureArchetypeIdV3>([
  "large_profile_pike_swimbait",
  "pike_jerkbait",
]);

const CURRENT_FRIENDLY_IDS = new Set<LureArchetypeIdV3>([
  "inline_spinner",
  "spinnerbait",
  "bladed_jig",
  "paddle_tail_swimbait",
  "soft_jerkbait",
  "suspending_jerkbait",
  "squarebill_crankbait",
  "flat_sided_crankbait",
  "medium_diving_crankbait",
  "deep_diving_crankbait",
  "lipless_crankbait",
  "blade_bait",
  "casting_spoon",
  "walking_topwater",
  "buzzbait",
  "prop_bait",
]);

function mapColumn(
  id: LureArchetypeIdV3,
  column: LegacyArchetypeWaterColumnV3,
): TacticalColumnV3 {
  if (TRUE_SURFACE_IDS.has(id)) return "surface";
  switch (column) {
    case "top":
    case "shallow":
      return "upper";
    case "mid":
      return "mid";
    case "bottom":
    default:
      return "bottom";
  }
}

function mapPresence(style: PresentationStyleV3): TacticalPresenceV3 {
  switch (style) {
    case "subtle":
      return "subtle";
    case "bold":
      return "bold";
    case "balanced":
    default:
      return "moderate";
  }
}

function defaultPaceFromLane(lane: TacticalLaneV3): TacticalPaceV3 {
  switch (lane) {
    case "bottom_contact":
    case "finesse_subtle":
      return "slow";
    case "reaction_mid_column":
    case "surface":
    case "pike_big_profile":
      return "fast";
    case "horizontal_search":
    case "cover_weedless":
    default:
      return "medium";
  }
}

function secondaryPaceFromLegacy(
  primary: TacticalPaceV3,
  moods: readonly MoodV3[],
): TacticalPaceV3 | undefined {
  if (primary === "slow") {
    return moods.includes("active") ? "medium" : undefined;
  }
  if (primary === "medium") {
    if (moods.includes("negative")) return "slow";
    if (moods.includes("active")) return "fast";
    return undefined;
  }
  return moods.includes("neutral") || moods.includes("negative")
    ? "medium"
    : undefined;
}

function whyHooks(profile: LegacyLureProfile): readonly string[] {
  return [
    `${profile.display_name} matches a ${profile.tactical_lane.replaceAll("_", " ")} look.`,
    `${profile.display_name} stays in play when ${profile.forage_matches[0] ?? "the main forage"} is relevant.`,
  ];
}

function howToFishVariants(profile: LegacyLureProfile): readonly [string, string, string] {
  return profile.how_to_fish_text ?? [
    `Fish ${profile.display_name.toLowerCase()} around the day's preferred lane with a controlled retrieve.`,
    `Keep ${profile.display_name.toLowerCase()} in the productive part of the zone and let the fish tell you whether to stay cleaner or more active.`,
    `Work ${profile.display_name.toLowerCase()} where today's conditions make that lane easiest to fish cleanly.`,
  ];
}

function lure(
  profile: LegacyLureProfile,
): RecommenderV3ArchetypeProfile {
  const columnOrder = profile.preferred_water_columns
    .map((column) => mapColumn(profile.id, column))
    .filter((value, index, array) => array.indexOf(value) === index);
  const presenceOrder = profile.preferred_presentation_styles
    .map((style) => mapPresence(style))
    .filter((value, index, array) => array.indexOf(value) === index);
  const primaryPace = defaultPaceFromLane(profile.tactical_lane);
  return {
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: "lure",
    species_allowed: PIKE_ONLY_IDS.has(profile.id)
      ? ["northern_pike"]
      : ALL_FRESHWATER_SPECIES,
    water_types_allowed: ["freshwater_lake_pond", "freshwater_river"],
    family_group: profile.top3_redundancy_key ?? profile.family_key,
    primary_column: columnOrder[0] ?? "mid",
    secondary_column: columnOrder[1],
    pace: primaryPace,
    secondary_pace: secondaryPaceFromLegacy(primaryPace, profile.preferred_moods),
    presence: presenceOrder[0] ?? "moderate",
    secondary_presence: presenceOrder[1],
    is_surface: TRUE_SURFACE_IDS.has(profile.id),
    current_friendly: CURRENT_FRIENDLY_IDS.has(profile.id) ? true : undefined,
    forage_tags: profile.forage_matches,
    why_hooks: whyHooks(profile),
    how_to_fish_variants: howToFishVariants(profile),
    how_to_fish_template: howToFishVariants(profile)[0],
    clarity_strengths: profile.clarity_strengths,
    tactical_lane: profile.tactical_lane,
  };
}

export const LURE_ARCHETYPES_V3: Record<LureArchetypeIdV3, RecommenderV3ArchetypeProfile> = {
  weightless_stick_worm: lure({
    id: "weightless_stick_worm",
    display_name: "Weightless Stick Worm",
    gear_mode: "lure",
    family_key: "stick_worm",
    top3_redundancy_key: "worm",
    preferred_water_columns: ["top", "shallow"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle"],
    forage_matches: ["leech_worm"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "finesse_subtle",
    how_to_fish_text: [
      "Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses.",
      "Pitch it to shallow cover or open water and give it full slack; the slow, nose-down fall is when fish bite, so watch the line carefully.",
      "Let it sink undisturbed until you feel or see a pickup, then reel down and set; if nothing on the fall, twitch it once and let it settle again.",
    ],
  }),
  texas_rigged_stick_worm: lure({
    id: "texas_rigged_stick_worm",
    display_name: "Texas-Rigged Stick Worm",
    gear_mode: "lure",
    family_key: "stick_worm",
    top3_redundancy_key: "worm",
    preferred_water_columns: ["shallow", "mid", "bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["leech_worm"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "cover_weedless",
    how_to_fish_text: [
      "Pitch or flip into cover and let it fall straight; after the drop, drag it slowly along the bottom with minimal rod movement before repositioning.",
      "Cast to cover and give it slack on the fall; if nothing bites, drag it along the bottom in slow sweeps and pause any time you feel resistance.",
      "Work it through cover with slow drags and short lifts; the bait should be near the bottom most of the time — resist the urge to hop it aggressively.",
    ],
  }),
  wacky_rigged_stick_worm: lure({
    id: "wacky_rigged_stick_worm",
    display_name: "Wacky-Rigged Stick Worm",
    gear_mode: "lure",
    family_key: "stick_worm",
    top3_redundancy_key: "worm",
    preferred_water_columns: ["top", "shallow", "mid"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle"],
    forage_matches: ["leech_worm"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "finesse_subtle",
    how_to_fish_text: [
      "Hook through the midsection, let it sink with a slow wobble, then lift and dead-stick with long pauses so both ends flutter.",
      "Pin the hook through the center and pitch it in; give it complete slack on the fall, then barely move it — the ends flutter with zero effort on a dead-stick.",
      "Toss it beside cover and watch the line; when it stops falling, shake the rod softly once and pause longer than feels comfortable.",
    ],
  }),
  carolina_rigged_stick_worm: lure({
    id: "carolina_rigged_stick_worm",
    display_name: "Carolina-Rigged Stick Worm",
    gear_mode: "lure",
    family_key: "stick_worm",
    top3_redundancy_key: "worm",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["leech_worm", "baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "bottom_contact",
    how_to_fish_text: [
      "Drag the rig slowly across hard bottom and transitions so the leader lets the worm hunt above the weight; pause when you feel it tick structure.",
      "Sweep the rod slowly across rocky or hard bottom and watch for the line to go tight; the worm floats and hunts freely above the sinker on a stretched leader.",
      "Long sweeping drags followed by a complete pause; the worm sinks and rises naturally on the leader — focus on structure changes and hard bottom.",
    ],
  }),
  shaky_head_worm: lure({
    id: "shaky_head_worm",
    display_name: "Shaky-Head Worm",
    gear_mode: "lure",
    family_key: "finesse_worm",
    top3_redundancy_key: "worm",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle"],
    forage_matches: ["leech_worm"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "bottom_contact",
    how_to_fish_text: [
      "Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head.",
      "Pin the nose to bottom and shake the rod tip while crawling it forward an inch at a time — don't rush the retrieve.",
      "Steady drag along hard bottom with subtle rod shakes; pause on any tick or thump and let it sit a full two seconds before moving again.",
    ],
  }),
  drop_shot_worm: lure({
    id: "drop_shot_worm",
    display_name: "Drop-Shot Worm",
    gear_mode: "lure",
    family_key: "drop_shot",
    top3_redundancy_key: "worm",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle"],
    forage_matches: ["leech_worm"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "finesse_subtle",
    how_to_fish_text: [
      "Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again.",
      "Keep the rig nearly vertical and make tiny rod-tip pulses while the weight stays pinned; the worm should hover and tremble without traveling far.",
      "Shake in place with light tension, then pause completely and let the worm hang still; most bites come when the bait barely moves at all.",
    ],
  }),
  drop_shot_minnow: lure({
    id: "drop_shot_minnow",
    display_name: "Drop-Shot Minnow",
    gear_mode: "lure",
    family_key: "drop_shot",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "finesse_subtle",
    how_to_fish_text: [
      "Keep the bait just off bottom with tiny shakes and short glides so the minnow hovers naturally in the strike zone.",
      "Hold the weight down and pulse the rod tip lightly; the minnow should quiver in place, then glide a few inches before the next shake.",
      "Use a subtle shake-pause cadence with the line tight enough to feel the bait; let the minnow suspend and look alive rather than dragging it forward.",
    ],
  }),
  ned_rig: lure({
    id: "ned_rig",
    display_name: "Ned Rig",
    gear_mode: "lure",
    family_key: "ned_rig",
    preferred_water_columns: ["shallow", "mid", "bottom"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle"],
    forage_matches: ["crawfish", "leech_worm"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "bottom_contact",
    how_to_fish_text: [
      "Drag and shake the small head along bottom like a tiny craw — short pulls, let it settle, repeat instead of big hops.",
      "Cast and let it settle fully to the bottom, then drag very slowly with the rod held low; pause between moves so the tail stands upright and wiggles.",
      "Inch it along with small rod pops and long pauses; the mushroom head keeps it nose-down and upright — let it sit longer than you think is necessary.",
    ],
  }),
  tube_jig: lure({
    id: "tube_jig",
    display_name: "Tube Jig",
    gear_mode: "lure",
    family_key: "tube",
    preferred_water_columns: ["shallow", "mid", "bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["crawfish", "baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "bottom_contact",
    how_to_fish_text: [
      "Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line.",
      "Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall.",
      "Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line.",
    ],
  }),
  texas_rigged_soft_plastic_craw: lure({
    id: "texas_rigged_soft_plastic_craw",
    display_name: "Texas-Rigged Soft-Plastic Craw",
    gear_mode: "lure",
    family_key: "soft_craw",
    preferred_water_columns: ["bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "cover_weedless",
    how_to_fish_text: [
      "Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch.",
      "Drop it into cover or along grass edges and count it down; short one-inch hops with a pause mimics a crawfish on the bottom — don't rush the next cast.",
      "Pitch to cover and let it fall freely; if nothing on the drop, slowly crawl it along the bottom and shake gently before picking up for the next pitch.",
    ],
  }),
  football_jig: lure({
    id: "football_jig",
    display_name: "Football Jig",
    gear_mode: "lure",
    family_key: "jig",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["crawfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "bottom_contact",
    how_to_fish_text: [
      "Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate.",
      "Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it.",
      "Crawl it across rock, gravel, or shell beds with steady low lifts and long pauses — the football head keeps it upright and loud the whole time.",
    ],
  }),
  compact_flipping_jig: lure({
    id: "compact_flipping_jig",
    display_name: "Compact Flipping Jig",
    gear_mode: "lure",
    family_key: "jig",
    preferred_water_columns: ["shallow", "mid", "bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["crawfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "cover_weedless",
    how_to_fish_text: [
      "Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy.",
      "Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on.",
      "Pitch tight to lay-downs, dock piles, or mats; give it enough slack line to fall straight, then drag or shake slowly before picking up for the next cast.",
    ],
  }),
  finesse_jig: lure({
    id: "finesse_jig",
    display_name: "Finesse Jig",
    gear_mode: "lure",
    family_key: "jig",
    preferred_water_columns: ["shallow", "mid", "bottom"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["crawfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "bottom_contact",
    how_to_fish_text: [
      "Crawl it slowly along bottom with short drags and tiny hops; the smaller profile should stay in the fish's face longer than a bulkier jig.",
      "Pitch it to light cover or transitions and let it settle fully before moving it; small lifts and long pauses are the whole point.",
      "Drag it with the rod low and barely shake the skirt in place; keep it compact, quiet, and close to bottom the entire retrieve.",
    ],
  }),
  swim_jig: lure({
    id: "swim_jig",
    display_name: "Swim Jig",
    gear_mode: "lure",
    family_key: "jig",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone.",
      "Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop.",
      "Run it parallel to grass edges or fallen timber; keep the pace consistent so the skirt breathes, and pause briefly when it reaches the target zone.",
    ],
  }),
  hair_jig: lure({
    id: "hair_jig",
    display_name: "Hair Jig",
    gear_mode: "lure",
    family_key: "hair_jig",
    preferred_water_columns: ["shallow", "mid", "bottom"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish", "leech_worm", "crawfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "finesse_subtle",
    how_to_fish_text: [
      "Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses.",
      "Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone.",
      "Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along.",
    ],
  }),
  inline_spinner: lure({
    id: "inline_spinner",
    display_name: "Inline Spinner",
    gear_mode: "lure",
    family_key: "spinner",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "insect_misc"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Cast and retrieve at a steady clip just fast enough to keep the blade spinning; vary depth with rod angle and speed to find the feeding zone.",
      "Use a slow-roll retrieve near bottom or cover edges; occasionally bump into structure to trigger reaction strikes.",
      "Cast across current and let the blade flash on a quarter-downstream retrieve; speed up briefly after bumps or short strikes.",
    ],
  }),
  spinnerbait: lure({
    id: "spinnerbait",
    display_name: "Spinnerbait",
    gear_mode: "lure",
    family_key: "spinnerbait",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise.",
      "Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top.",
      "Cast past the target and retrieve through it, varying speed to find the blade thump fish respond to; hesitate briefly at cover edges.",
    ],
  }),
  bladed_jig: lure({
    id: "bladed_jig",
    display_name: "Bladed Jig",
    gear_mode: "lure",
    family_key: "bladed_jig",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall.",
      "Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall.",
      "Snap the rod tip up sharply to activate the blade, then lower it on a semi-tight line so the jig falls at a controlled rate; vary the fall speed with rod angle.",
    ],
  }),
  paddle_tail_swimbait: lure({
    id: "paddle_tail_swimbait",
    display_name: "Paddle-Tail Swimbait",
    gear_mode: "lure",
    family_key: "swimbait",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow.",
      "Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed.",
      "Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.",
    ],
  }),
  soft_jerkbait: lure({
    id: "soft_jerkbait",
    display_name: "Soft Plastic Jerkbait",
    gear_mode: "lure",
    family_key: "soft_jerkbait",
    preferred_water_columns: ["top", "shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches.",
      "Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap.",
      "Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length.",
    ],
  }),
  suspending_jerkbait: lure({
    id: "suspending_jerkbait",
    display_name: "Suspending Jerkbait",
    gear_mode: "lure",
    family_key: "jerkbait",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["negative", "neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "reaction_mid_column",
    how_to_fish_text: [
      "Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.",
      "Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer.",
      "Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight.",
    ],
  }),
  squarebill_crankbait: lure({
    id: "squarebill_crankbait",
    display_name: "Squarebill Crankbait",
    gear_mode: "lure",
    family_key: "crankbait",
    preferred_water_columns: ["shallow"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "crawfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Bang it directly into wood, rock, or stumps so the squared bill deflects the bait sideways — reaction strikes happen on that ricochet.",
      "Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact.",
      "Run it tight to cover at a steady pace; when it hits, give a slight rod pause so the bill pries free and the bait kicks up erratically.",
    ],
  }),
  flat_sided_crankbait: lure({
    id: "flat_sided_crankbait",
    display_name: "Flat-Sided Crankbait",
    gear_mode: "lure",
    family_key: "crankbait",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish", "crawfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "reaction_mid_column",
    how_to_fish_text: [
      "Reel at a slow-to-medium pace; the tight wobble transmits through the line — slow down when you feel the bait tick structure.",
      "Use a steady retrieve with subtle rod-tip pumps to vary the bait's depth and roll; works along transitional depths and current seams.",
      "Work it across hard bottom or rock piles with a consistent slow crank, letting the tight shimmy attract finicky fish holding close to structure.",
    ],
  }),
  medium_diving_crankbait: lure({
    id: "medium_diving_crankbait",
    display_name: "Medium-Diving Crankbait",
    gear_mode: "lure",
    family_key: "crankbait",
    preferred_water_columns: ["mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Crank it to depth and keep a steady grind-and-stop retrieve; let it tick bottom intermittently to kick up sediment and trigger strikes.",
      "Retrieve at a medium pace along depth contours, pausing after any bottom contact so the bait rises before diving back when you resume.",
      "Work it through mid-column structure at steady speed, varying rod angle to bump the lip on rock ledges or submerged debris.",
    ],
  }),
  deep_diving_crankbait: lure({
    id: "deep_diving_crankbait",
    display_name: "Deep-Diving Crankbait",
    gear_mode: "lure",
    family_key: "crankbait",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "crawfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Make a long cast to reach depth, crank down hard, then keep a slow but steady pace so the bait stays near the bottom; feel for any change in resistance.",
      "Run it along drop-offs and ledges, keeping the line angle shallow so the lip catches bottom occasionally; pause on contact and let it rise.",
      "Long cast, fast crank to get it down, then steady-slow retrieve; bump along bottom transitions and slow down after any tick or thump.",
    ],
  }),
  lipless_crankbait: lure({
    id: "lipless_crankbait",
    display_name: "Lipless Crankbait",
    gear_mode: "lure",
    family_key: "lipless",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "crawfish"],
    clarity_strengths: ["stained", "dirty"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle.",
      "Burn it at mid-speed and occasionally pop the rod tip to make the bait jump; over vegetation, rip it free when it ticks the top.",
      "Slow-roll it through grass just above the canopy, and when it hangs up, rip sharply to tear free — that trigger almost always draws a strike.",
    ],
  }),
  blade_bait: lure({
    id: "blade_bait",
    display_name: "Blade Bait",
    gear_mode: "lure",
    family_key: "blade_bait",
    preferred_water_columns: ["mid", "bottom"],
    preferred_moods: ["negative", "neutral"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "reaction_mid_column",
    how_to_fish_text: [
      "Lift with the rod and let the blade flutter back down on a controlled slack line; watch for the tap on the fall and set on anything that interrupts the sink.",
      "Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.",
      "Cast and hop it off bottom with quick wrist snaps, counting the flutter back down; strikes usually come on the fall, so stay in contact with semi-tight line.",
    ],
  }),
  casting_spoon: lure({
    id: "casting_spoon",
    display_name: "Casting Spoon",
    gear_mode: "lure",
    family_key: "spoon",
    preferred_water_columns: ["mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "reaction_mid_column",
    how_to_fish_text: [
      "Cast, let it flutter to depth, then reel with a rhythmic rise-and-fall so the flashing face covers the full water column; vary sink time to find the depth.",
      "Work it with a lift-and-drop over suspended fish; the concave face spins as it falls — strikes are usually on the drop, so keep a semi-tight line.",
      "Retrieve with a wobbly, wandering cadence by mixing speed; bump into cover and let it flutter down beside structure on the pause.",
    ],
  }),
  walking_topwater: lure({
    id: "walking_topwater",
    display_name: "Walking Topwater",
    gear_mode: "lure",
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    preferred_water_columns: ["top"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "surface",
    how_to_fish_text: [
      "Sweep the rod tip side to side in short, rhythmic twitches while reeling in just enough slack — the bait should walk in a steady side-to-side waddle.",
      "Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch.",
      "Work it with consistent wrist flicks over open water or above grass; keep the cadence smooth and only slow down if you see fish following.",
    ],
  }),
  popping_topwater: lure({
    id: "popping_topwater",
    display_name: "Topwater Popper",
    gear_mode: "lure",
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    preferred_water_columns: ["top"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "surface",
    how_to_fish_text: [
      "Pop sharply with the rod tip, let the rings settle, then pop again — give it a 2-3 second pause after each spit so fish can locate and attack.",
      "Use rhythmic 1-2 pops followed by a pause; target the shadow of any surface feature and let the bait sit still in the ring for a count of three.",
      "Short sharp pops followed by deliberate pauses near cover edges; slower and louder pops in flat calm, quicker pops when fish are aggressive.",
    ],
  }),
  buzzbait: lure({
    id: "buzzbait",
    display_name: "Buzzbait",
    gear_mode: "lure",
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    preferred_water_columns: ["top"],
    preferred_moods: ["active"],
    preferred_presentation_styles: ["bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["stained", "dirty"],
    tactical_lane: "surface",
    how_to_fish_text: [
      "Start the retrieve as soon as it hits the water; keep the blade just breaking the surface and never stop reeling until the bait is at the boat.",
      "Burn it across the surface on a constant retrieve tight to cover edges; vary speed only to keep it on top, and set hard when you feel weight.",
      "Run it on a straight, steady retrieve through open pockets in cover; pause only if a fish swipes and misses — then hold still briefly and resume.",
    ],
  }),
  prop_bait: lure({
    id: "prop_bait",
    display_name: "Prop Bait",
    gear_mode: "lure",
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    preferred_water_columns: ["top"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["subtle", "balanced"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "surface",
    how_to_fish_text: [
      "Twitch it just enough to make the props sputter and spit, then let it sit still until the rings disappear before moving it again.",
      "Use a pull-pause cadence so the prop churns on the pull and goes dead still on the pause; fish often eat it after the commotion stops.",
      "Work it around isolated cover with sharp little pops of the rod tip, letting the bait rest between sputters instead of reeling it straight back.",
    ],
  }),
  hollow_body_frog: lure({
    id: "hollow_body_frog",
    display_name: "Hollow-Body Frog",
    gear_mode: "lure",
    family_key: "frog",
    preferred_water_columns: ["top", "shallow"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["bluegill_perch", "baitfish"],
    clarity_strengths: ["stained", "dirty", "clear"],
    tactical_lane: "cover_weedless",
    how_to_fish_text: [
      "Walk it across mats or over lily pads with short side-to-side twitches; when it enters a gap or open pocket, let it sit for two full seconds before moving.",
      "Twitch it just enough to make the legs kick; pause over every opening in the cover and count to three before moving — strikes on mats come after the pause.",
      "Use steady walking cadence across open surface, then slow and pause aggressively when near cover; don't set the hook until you feel the fish pulling.",
    ],
  }),
  large_profile_pike_swimbait: lure({
    id: "large_profile_pike_swimbait",
    display_name: "Large Paddle-Tail Swimbait",
    gear_mode: "lure",
    family_key: "pike_swimbait",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "pike_big_profile",
    how_to_fish_text: [
      "Slow-roll at a steady mid-depth pace; pike follow long before committing, so keep your nerve and don't speed up or stop until the line goes tight.",
      "Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close.",
      "Retrieve at a measured pace over weed tops or along the edge; the big profile does the work — don't twitch or jerk, just keep it gliding.",
    ],
  }),
  pike_jerkbait: lure({
    id: "pike_jerkbait",
    display_name: "Large Jerkbait",
    gear_mode: "lure",
    family_key: "pike_jerkbait",
    preferred_water_columns: ["shallow", "mid"],
    preferred_moods: ["neutral", "active"],
    preferred_presentation_styles: ["balanced", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "pike_big_profile",
    how_to_fish_text: [
      "Use long, hard sweeps with the rod to make the bait dart and glide; pause fully between sweeps so the bait hangs and following fish can catch up.",
      "Rip it hard with two or three sweeps, then kill it completely — let the bait sink or suspend in place while you count three before the next sequence.",
      "Work it erratically with big pulls and deadstops; the key is the pause after the dash, so hold still for at least two seconds before triggering again.",
    ],
  }),
};
