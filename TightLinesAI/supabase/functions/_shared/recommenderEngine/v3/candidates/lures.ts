import {
  TACTICAL_COLUMNS_V3,
  TACTICAL_PACES_V3,
  TACTICAL_PRESENCE_V3,
} from "../contracts.ts";
import type {
  ForageBucketV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3Species,
  TacticalColumnV3,
  TacticalLaneV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "../contracts.ts";

/**
 * Authored input for a lure archetype.
 *
 * Column authoring rules (credibility-first):
 * - `primary_column` is the single water-column zone the lure actually lives
 *   in for most anglers, most of the time. It is what the UI chip shows, and
 *   it is what the scorer rewards as a primary column match.
 * - `secondary_column` is authored ONLY when the lure genuinely has a second
 *   working zone (e.g. a spinnerbait slow-rolled mid vs. burned upper). It is
 *   a fishing fact, not a scoring padding. Most archetypes do not need one.
 * - Surface lures must set `primary_column: "surface"` and must not set a
 *   secondary column.
 * - `bottom_contact`, `fly_bottom`, `cover_weedless` (non-surface) lanes must
 *   have `primary_column` in {"bottom"} — the catalog's hard credibility rail.
 *
 * The factory derives `column_range` as `[primary_column, ...(secondary_column ? [secondary_column] : [])]`
 * for downstream code that still reads a range, but there is no longer a
 * third (tertiary) column anywhere in the system.
 *
 * Pace and presence keep their existing `range` authoring (primary + optional
 * secondary, same rules). We did not touch those in this pass because the
 * credibility problem we fixed was specifically about the displayed column
 * not matching the lure's real zone.
 */
type LureAuthoredProfile = {
  id: LureArchetypeIdV3;
  display_name: string;
  family_key: string;
  top3_redundancy_key?: string;
  primary_column: TacticalColumnV3;
  secondary_column?: TacticalColumnV3;
  pace_range: readonly TacticalPaceV3[];
  presence_range: readonly TacticalPresenceV3[];
  forage_matches: readonly ForageBucketV3[];
  clarity_strengths: readonly ("clear" | "stained" | "dirty")[];
  tactical_lane: TacticalLaneV3;
  how_to_fish_text: readonly [string, string, string];
};

const ALL_FRESHWATER_SPECIES: readonly RecommenderV3Species[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "northern_pike",
  "trout",
] as const;

const BASS_AND_PIKE_SPECIES: readonly RecommenderV3Species[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "northern_pike",
] as const;

const RIVER_AND_PIKE_SPECIES: readonly RecommenderV3Species[] = [
  "smallmouth_bass",
  "northern_pike",
  "trout",
] as const;

const PIKE_ONLY_IDS = new Set<LureArchetypeIdV3>([
  "large_profile_pike_swimbait",
  "pike_jerkbait",
]);

const TROUT_AND_SMALLMOUTH_ONLY_IDS = new Set<LureArchetypeIdV3>([
  "inline_spinner",
]);

const WARMWATER_ONLY_IDS = new Set<LureArchetypeIdV3>([
  "buzzbait",
  "prop_bait",
  "hollow_body_frog",
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

/**
 * Lanes whose credibility hard-requires a specific primary column.
 * Keeps authors from re-introducing the "bass jig shown as upper" class of bug.
 */
const LANE_REQUIRED_PRIMARY_COLUMN: Partial<
  Record<TacticalLaneV3, TacticalColumnV3>
> = {
  bottom_contact: "bottom",
  fly_bottom: "bottom",
  surface: "surface",
  fly_surface: "surface",
};

function assertRangeShape<T extends string>(
  archetypeId: string,
  kind: "pace" | "presence",
  range: readonly T[],
  allowedValues: readonly T[],
): void {
  if (range.length < 1 || range.length > 3) {
    throw new Error(
      `[recommender v3] archetype "${archetypeId}" ${kind}_range must have 1-3 entries (got ${range.length}).`,
    );
  }
  const seen = new Set<T>();
  for (const value of range) {
    if (!allowedValues.includes(value)) {
      throw new Error(
        `[recommender v3] archetype "${archetypeId}" ${kind}_range contains invalid entry "${value}".`,
      );
    }
    if (seen.has(value)) {
      throw new Error(
        `[recommender v3] archetype "${archetypeId}" ${kind}_range has duplicate entry "${value}".`,
      );
    }
    seen.add(value);
  }
}

function assertColumnAuthoring(
  archetypeId: string,
  primary: TacticalColumnV3,
  secondary: TacticalColumnV3 | undefined,
  lane: TacticalLaneV3,
): void {
  if (!TACTICAL_COLUMNS_V3.includes(primary)) {
    throw new Error(
      `[recommender v3] archetype "${archetypeId}" primary_column "${primary}" is not a valid tactical column.`,
    );
  }
  if (secondary != null) {
    if (!TACTICAL_COLUMNS_V3.includes(secondary)) {
      throw new Error(
        `[recommender v3] archetype "${archetypeId}" secondary_column "${secondary}" is not a valid tactical column.`,
      );
    }
    if (secondary === primary) {
      throw new Error(
        `[recommender v3] archetype "${archetypeId}" secondary_column duplicates primary_column ("${primary}").`,
      );
    }
    if (primary === "surface" || secondary === "surface") {
      throw new Error(
        `[recommender v3] archetype "${archetypeId}" surface lures must have primary_column="surface" and no secondary_column.`,
      );
    }
  }
  const required = LANE_REQUIRED_PRIMARY_COLUMN[lane];
  if (required != null && primary !== required) {
    throw new Error(
      `[recommender v3] archetype "${archetypeId}" tactical_lane "${lane}" requires primary_column="${required}" (got "${primary}").`,
    );
  }
}

function resolveSpeciesAllowed(
  id: LureArchetypeIdV3,
): readonly RecommenderV3Species[] {
  if (PIKE_ONLY_IDS.has(id)) return ["northern_pike"];
  if (TROUT_AND_SMALLMOUTH_ONLY_IDS.has(id)) return RIVER_AND_PIKE_SPECIES;
  if (WARMWATER_ONLY_IDS.has(id)) return BASS_AND_PIKE_SPECIES;
  return ALL_FRESHWATER_SPECIES;
}

function whyHooks(profile: LureAuthoredProfile): readonly string[] {
  return [
    `${profile.display_name} matches a ${profile.tactical_lane.replaceAll("_", " ")} look.`,
    `${profile.display_name} stays in play when ${profile.forage_matches[0] ?? "the main forage"} is relevant.`,
  ];
}

function lure(profile: LureAuthoredProfile): RecommenderV3ArchetypeProfile {
  assertColumnAuthoring(
    profile.id,
    profile.primary_column,
    profile.secondary_column,
    profile.tactical_lane,
  );
  assertRangeShape(profile.id, "pace", profile.pace_range, TACTICAL_PACES_V3);
  assertRangeShape(
    profile.id,
    "presence",
    profile.presence_range,
    TACTICAL_PRESENCE_V3,
  );

  const primaryPace = profile.pace_range[0]!;
  const primaryPresence = profile.presence_range[0]!;
  const columnRange: readonly TacticalColumnV3[] = profile.secondary_column
    ? [profile.primary_column, profile.secondary_column]
    : [profile.primary_column];

  return {
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: "lure",
    species_allowed: resolveSpeciesAllowed(profile.id),
    water_types_allowed: ["freshwater_lake_pond", "freshwater_river"],
    family_group: profile.top3_redundancy_key ?? profile.family_key,
    column_range: columnRange,
    pace_range: profile.pace_range,
    presence_range: profile.presence_range,
    primary_column: profile.primary_column,
    secondary_column: profile.secondary_column,
    pace: primaryPace,
    secondary_pace: profile.pace_range[1],
    presence: primaryPresence,
    secondary_presence: profile.presence_range[1],
    is_surface: profile.primary_column === "surface",
    current_friendly: CURRENT_FRIENDLY_IDS.has(profile.id) ? true : undefined,
    forage_tags: profile.forage_matches,
    why_hooks: whyHooks(profile),
    how_to_fish_variants: profile.how_to_fish_text,
    how_to_fish_template: profile.how_to_fish_text[0],
    clarity_strengths: profile.clarity_strengths,
    tactical_lane: profile.tactical_lane,
  };
}

export const LURE_ARCHETYPES_V3: Record<
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile
> = {
  weightless_stick_worm: lure({
    id: "weightless_stick_worm",
    display_name: "Weightless Stick Worm",
    family_key: "stick_worm",
    top3_redundancy_key: "worm",
    // Signature action is the slow shimmying horizontal fall through the
    // upper/mid column. It is not a bottom drag — the lane is cover_weedless
    // and the how_to_fish variants all describe a fall-through retrieve.
    primary_column: "upper",
    secondary_column: "mid",
    pace_range: ["medium", "slow"],
    presence_range: ["subtle", "moderate"],
    forage_matches: ["leech_worm"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "cover_weedless",
    how_to_fish_text: [
      "Pitch or skip it tight to cover and let it glide on a slack line — most hits come on the slow shimmying fall through the upper column; reset after each fall and fish the next pocket.",
      "Cast to shade lines and feed slack on the fall so the bait shimmies naturally through the upper/mid column; if it reaches cover without a bite, lift it free and re-pitch rather than dragging.",
      "Work shallow cover with short pitches and slack-line falls; let the bait hang motionless for a beat after each fall, then lift and re-present — keep it in the fall zone, not on the bottom.",
    ],
  }),
  carolina_rigged_stick_worm: lure({
    id: "carolina_rigged_stick_worm",
    display_name: "Carolina-Rigged Stick Worm",
    family_key: "stick_worm",
    top3_redundancy_key: "worm",
    primary_column: "bottom",
    pace_range: ["slow"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "finesse_worm",
    top3_redundancy_key: "worm",
    primary_column: "bottom",
    pace_range: ["slow"],
    presence_range: ["subtle"],
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
    family_key: "drop_shot",
    top3_redundancy_key: "worm",
    // Drop-shot suspends the worm just off the bottom — the presentation lives
    // in the mid band above the weight, with the weight itself on the bottom.
    primary_column: "mid",
    secondary_column: "bottom",
    pace_range: ["slow"],
    presence_range: ["subtle"],
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
    family_key: "drop_shot",
    primary_column: "mid",
    secondary_column: "bottom",
    pace_range: ["slow", "medium"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "ned_rig",
    primary_column: "bottom",
    pace_range: ["slow"],
    presence_range: ["subtle"],
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
    family_key: "tube",
    primary_column: "bottom",
    pace_range: ["slow", "medium"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "soft_craw",
    primary_column: "bottom",
    pace_range: ["medium", "slow"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "jig",
    primary_column: "bottom",
    pace_range: ["slow", "medium"],
    presence_range: ["moderate", "bold"],
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
    family_key: "jig",
    primary_column: "bottom",
    pace_range: ["medium", "slow"],
    presence_range: ["moderate", "bold"],
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
    family_key: "jig",
    primary_column: "bottom",
    pace_range: ["slow"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "jig",
    // Mid-column steady swim over cover is the lead; shallow burn just under
    // the surface in grass is a legitimate secondary.
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "hair_jig",
    // Hair jigs are a finesse mid-water swim/swing for smallmouth, trout, and
    // pike. In cold-water bass / winter smallmouth presentations they drop to
    // the bottom and get dragged — that is the legitimate secondary zone.
    primary_column: "mid",
    secondary_column: "bottom",
    pace_range: ["slow", "medium"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "spinner",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish", "insect_misc"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "horizontal_search",
    how_to_fish_text: [
      "Cast and retrieve at a steady clip just fast enough to keep the blade spinning; vary depth with rod angle and speed to find the feeding zone.",
      "Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears.",
      "Cast across current and let the blade flash on a quarter-downstream retrieve; speed up briefly after bumps or short strikes.",
    ],
  }),
  spinnerbait: lure({
    id: "spinnerbait",
    display_name: "Spinnerbait",
    family_key: "spinnerbait",
    // Slow-roll through mid-column cover is the headline; burning or bulging
    // just under the surface is a real secondary presentation.
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "bladed_jig",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "swimbait",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "soft_jerkbait",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "jerkbait",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["fast", "medium"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "crankbait",
    // Shallow diving bait — primary column is the upper band, bouncing off
    // shallow cover. No legitimate second column.
    primary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "crankbait",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["fast", "medium"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "crankbait",
    primary_column: "mid",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "crankbait",
    // Deep cranks are designed to dig the bottom on deep structure and come
    // through mid on the retrieve up. Primary = bottom, secondary = mid.
    primary_column: "bottom",
    secondary_column: "mid",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "lipless",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "blade_bait",
    // Vertical jigged off the bottom for cold-water suspended fish; primary
    // is the bottom lift, secondary is the mid-column flutter on the fall.
    primary_column: "bottom",
    secondary_column: "mid",
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
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
    family_key: "spoon",
    primary_column: "mid",
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
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
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    primary_column: "surface",
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
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
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    primary_column: "surface",
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
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
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    primary_column: "surface",
    pace_range: ["fast"],
    presence_range: ["bold"],
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
    family_key: "topwater",
    top3_redundancy_key: "open_topwater",
    primary_column: "surface",
    pace_range: ["fast", "medium"],
    presence_range: ["subtle", "moderate"],
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
    family_key: "frog",
    primary_column: "surface",
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
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
    family_key: "pike_swimbait",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
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
    family_key: "pike_jerkbait",
    primary_column: "mid",
    secondary_column: "upper",
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
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
