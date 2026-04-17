import {
  TACTICAL_COLUMNS_V3,
  TACTICAL_PACES_V3,
  TACTICAL_PRESENCE_V3,
} from "../contracts.ts";
import type {
  FlyArchetypeIdV3,
  ForageBucketV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3Species,
  TacticalColumnV3,
  TacticalLaneV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "../contracts.ts";

/**
 * Authored input for a fly archetype. The tactical ranges
 * (`column_range`, `pace_range`, `presence_range`) are the single source
 * of truth for how this fly behaves in the water. Primaries and
 * secondaries on the resolved profile are derived from `range[0]` and
 * `range[1]` respectively. `is_surface` is derived from the primary
 * column being `"surface"`. See the recommender audit plan for the
 * ordering convention.
 */
type FlyAuthoredProfile = {
  id: FlyArchetypeIdV3;
  display_name: string;
  family_key: string;
  column_range: readonly TacticalColumnV3[];
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

const PIKE_ONLY_FLIES = new Set<FlyArchetypeIdV3>([
  "pike_bunny_streamer",
  "large_articulated_pike_streamer",
]);

const WARMWATER_SURFACE_ONLY_FLIES = new Set<FlyArchetypeIdV3>([
  "frog_fly",
]);

const CURRENT_FRIENDLY_FLIES = new Set<FlyArchetypeIdV3>([
  "clouser_minnow",
  "slim_minnow_streamer",
  "bucktail_baitfish_streamer",
  "woolly_bugger",
  "rabbit_strip_leech",
  "balanced_leech",
  "zonker_streamer",
  "sculpin_streamer",
  "sculpzilla",
  "muddler_sculpin",
  "crawfish_streamer",
  "conehead_streamer",
]);

function assertRangeShape<T extends string>(
  archetypeId: string,
  kind: "column" | "pace" | "presence",
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

function assertColumnShape(
  archetypeId: string,
  range: readonly TacticalColumnV3[],
): void {
  assertRangeShape(archetypeId, "column", range, TACTICAL_COLUMNS_V3);
  if (range[0] === "surface" && range.length !== 1) {
    throw new Error(
      `[recommender v3] archetype "${archetypeId}" column_range: when primary is "surface", range must be ["surface"] only.`,
    );
  }
  for (let i = 1; i < range.length; i++) {
    if (range[i] === "surface") {
      throw new Error(
        `[recommender v3] archetype "${archetypeId}" column_range: "surface" is only valid at index 0.`,
      );
    }
  }
}

function resolveSpeciesAllowed(
  id: FlyArchetypeIdV3,
): readonly RecommenderV3Species[] {
  if (PIKE_ONLY_FLIES.has(id)) return ["northern_pike"];
  if (WARMWATER_SURFACE_ONLY_FLIES.has(id)) return BASS_AND_PIKE_SPECIES;
  return ALL_FRESHWATER_SPECIES;
}

function whyHooks(profile: FlyAuthoredProfile): readonly string[] {
  return [
    `${profile.display_name} fits a ${profile.tactical_lane.replaceAll("_", " ")} window.`,
    `${profile.display_name} tracks well when ${profile.forage_matches[0] ?? "forage"} is a realistic meal.`,
  ];
}

function fly(profile: FlyAuthoredProfile): RecommenderV3ArchetypeProfile {
  assertColumnShape(profile.id, profile.column_range);
  assertRangeShape(profile.id, "pace", profile.pace_range, TACTICAL_PACES_V3);
  assertRangeShape(
    profile.id,
    "presence",
    profile.presence_range,
    TACTICAL_PRESENCE_V3,
  );

  const primaryColumn = profile.column_range[0]!;
  const primaryPace = profile.pace_range[0]!;
  const primaryPresence = profile.presence_range[0]!;

  return {
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: "fly",
    species_allowed: resolveSpeciesAllowed(profile.id),
    water_types_allowed: ["freshwater_lake_pond", "freshwater_river"],
    family_group: profile.family_key,
    column_range: profile.column_range,
    pace_range: profile.pace_range,
    presence_range: profile.presence_range,
    primary_column: primaryColumn,
    secondary_column: profile.column_range[1],
    pace: primaryPace,
    secondary_pace: profile.pace_range[1],
    presence: primaryPresence,
    secondary_presence: profile.presence_range[1],
    is_surface: primaryColumn === "surface",
    current_friendly: CURRENT_FRIENDLY_FLIES.has(profile.id) ? true : undefined,
    forage_tags: profile.forage_matches,
    why_hooks: whyHooks(profile),
    how_to_fish_variants: profile.how_to_fish_text,
    how_to_fish_template: profile.how_to_fish_text[0],
    clarity_strengths: profile.clarity_strengths,
    tactical_lane: profile.tactical_lane,
  };
}

export const FLY_ARCHETYPES_V3: Record<
  FlyArchetypeIdV3,
  RecommenderV3ArchetypeProfile
> = {
  clouser_minnow: fly({
    id: "clouser_minnow",
    display_name: "Clouser Minnow",
    family_key: "baitfish_streamer",
    column_range: ["mid", "bottom"],
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.",
      "Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.",
      "Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.",
    ],
  }),
  deceiver: fly({
    id: "deceiver",
    display_name: "Deceiver",
    family_key: "baitfish_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap.",
      "Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish.",
      "Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips.",
    ],
  }),
  bucktail_baitfish_streamer: fly({
    id: "bucktail_baitfish_streamer",
    display_name: "Bucktail Streamer",
    family_key: "baitfish_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "slow"],
    presence_range: ["subtle"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Strip with medium-length pulls at a steady baitfish pace; bucktail pulsates naturally between strips, so let it breathe by varying strip length slightly.",
      "Cast across or down and retrieve with consistent strips; add a pause every 4-5 strips so the bucktail flares and collapses like a stunned baitfish.",
      "Use a steady pulsing retrieve in open water, or short strips near structure where the pause and flare can trigger fish that are holding tight.",
    ],
  }),
  slim_minnow_streamer: fly({
    id: "slim_minnow_streamer",
    display_name: "Slim Baitfish Streamer",
    family_key: "baitfish_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "slow"],
    presence_range: ["subtle"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip.",
      "Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line.",
      "Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace.",
    ],
  }),
  articulated_baitfish_streamer: fly({
    id: "articulated_baitfish_streamer",
    display_name: "Articulated Baitfish Streamer",
    family_key: "baitfish_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "fast"],
    presence_range: ["bold"],
    forage_matches: ["baitfish"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally.",
      "Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink.",
      "Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping.",
    ],
  }),
  articulated_dungeon_streamer: fly({
    id: "articulated_dungeon_streamer",
    display_name: "Articulated Dungeon Streamer",
    family_key: "articulated_streamer",
    column_range: ["mid"],
    pace_range: ["medium", "fast"],
    presence_range: ["bold"],
    forage_matches: ["baitfish", "bluegill_perch", "crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Strip it with long pulls and full pauses so the articulated profile kicks wide, then hangs and breathes in place.",
      "Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.",
      "Fish it on a sweep-pause cadence near cover and transitions, giving the bulky profile time to hang between strips before moving it again.",
    ],
  }),
  game_changer: fly({
    id: "game_changer",
    display_name: "Game Changer",
    family_key: "articulated_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.",
      "Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink.",
      "Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve.",
    ],
  }),
  woolly_bugger: fly({
    id: "woolly_bugger",
    display_name: "Woolly Bugger",
    family_key: "bugger_leech",
    column_range: ["mid", "bottom"],
    pace_range: ["slow"],
    presence_range: ["subtle", "moderate"],
    forage_matches: ["leech_worm", "baitfish", "crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.",
      "Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.",
      "Fish it on a dead-drift near the bottom, then come alive with a strip-pause retrieve through prime holding water; let the tail do most of the work.",
    ],
  }),
  rabbit_strip_leech: fly({
    id: "rabbit_strip_leech",
    display_name: "Rabbit-Strip Leech",
    family_key: "bugger_leech",
    column_range: ["bottom"],
    pace_range: ["slow"],
    presence_range: ["subtle", "moderate"],
    forage_matches: ["leech_worm", "baitfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve.",
      "Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit.",
      "Swim it slowly through deeper pockets and woody structure; the rabbit strip breathes on a semi-tight line, so use the absolute minimum retrieve speed.",
    ],
  }),
  balanced_leech: fly({
    id: "balanced_leech",
    display_name: "Balanced Leech",
    family_key: "bugger_leech",
    column_range: ["mid", "bottom"],
    pace_range: ["slow"],
    presence_range: ["subtle"],
    forage_matches: ["leech_worm", "baitfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first.",
      "Let it suspend just off bottom or under cover and move it only with tiny strips; the balanced posture is the trigger, not speed.",
      "Count it down to the level you want, then use a very slow strip-pause cadence so the fly hangs horizontally through the zone.",
    ],
  }),
  zonker_streamer: fly({
    id: "zonker_streamer",
    display_name: "Zonker Streamer",
    family_key: "bugger_leech",
    column_range: ["upper", "mid"],
    pace_range: ["medium"],
    presence_range: ["moderate"],
    forage_matches: ["baitfish", "leech_worm"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_baitfish",
    how_to_fish_text: [
      "Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change.",
      "Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip.",
      "Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out.",
    ],
  }),
  sculpin_streamer: fly({
    id: "sculpin_streamer",
    display_name: "Sculpin Streamer",
    family_key: "bottom_streamer",
    column_range: ["bottom"],
    pace_range: ["slow"],
    presence_range: ["subtle", "moderate"],
    forage_matches: ["baitfish", "crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure.",
      "Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating.",
      "Inch it along the bottom with tight-line strips; sculpin barely swim, so keep the fly close to the substrate and use current for most of the motion.",
    ],
  }),
  sculpzilla: fly({
    id: "sculpzilla",
    display_name: "Sculpzilla",
    family_key: "bottom_streamer",
    column_range: ["bottom"],
    pace_range: ["slow", "medium"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish", "crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Drive it down near bottom, then strip it in short, hard pulls with pauses so the fly breathes and kicks like a fleeing sculpin.",
      "Cast across current and let it sink, then work it with compact strips that keep the fly close to the substrate without ripping it away from structure.",
      "Use a strip-pause crawl along the bottom with just enough speed to make the materials pulse; keep it low, heavy, and in the fish's lane.",
    ],
  }),
  muddler_sculpin: fly({
    id: "muddler_sculpin",
    display_name: "Muddler Minnow",
    family_key: "bottom_streamer",
    // Authored as bottom-primary/mid-secondary to match `tactical_lane: "fly_bottom"`
    // and the dominant how_to_fish variants (sink-and-crawl, hop along bottom,
    // swung wet through current). Upper is a legitimate tertiary (skated/waked
    // in shallow riffles) but not the lead column.
    column_range: ["bottom", "mid", "upper"],
    pace_range: ["slow", "medium"],
    presence_range: ["moderate"],
    forage_matches: ["baitfish", "crawfish", "insect_misc"],
    clarity_strengths: ["clear", "stained"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Sink and crawl it along bottom with rod-tip leads so the deer hair pushes water, or swing it through soft seams on a tight line.",
      "Work it as a swung wet fly in current with minimal stripping; on still water, hop it along the bottom with slow, erratic pulls.",
      "Cast across and let current animate the fly; add a slow retrieve in lakes and ponds, using rod dips to make the deer hair head push water and dive.",
    ],
  }),
  crawfish_streamer: fly({
    id: "crawfish_streamer",
    display_name: "Crawfish Streamer",
    family_key: "bottom_streamer",
    column_range: ["bottom"],
    pace_range: ["slow", "medium"],
    presence_range: ["subtle", "moderate"],
    forage_matches: ["crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root.",
      "Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish.",
      "Pinch the fly to the bottom and move it in erratic 1-2 inch hops with long pauses; the slower and lower, the better — crawfish don't sprint.",
    ],
  }),
  conehead_streamer: fly({
    id: "conehead_streamer",
    display_name: "Conehead Streamer",
    family_key: "weighted_streamer",
    column_range: ["bottom"],
    pace_range: ["slow"],
    presence_range: ["moderate"],
    forage_matches: ["baitfish", "leech_worm", "crawfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_bottom",
    how_to_fish_text: [
      "Let the cone dig and dart on each strip — medium pulls with pauses so the fly hunts just off the rocks or wood.",
      "Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip.",
      "Cast across or down, let it sink to depth, then strip with a jig-like cadence where the cone tips the fly nose-down on each pause.",
    ],
  }),
  pike_bunny_streamer: fly({
    id: "pike_bunny_streamer",
    display_name: "Large Rabbit Strip Streamer",
    family_key: "pike_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "pike_big_profile",
    how_to_fish_text: [
      "Strip with long, steady pulls so the rabbit hair breathes and the profile stays big; pause after every 2-3 strips to let following pike close.",
      "Retrieve at a consistent pace that keeps the fly moving but gives the rabbit strip time to pulse; deadstop near structure to trigger strike reactions.",
      "Work it on medium strips with deliberate pauses; the oversized rabbit profile holds fish attention — give it time to be seen before the next strip.",
    ],
  }),
  large_articulated_pike_streamer: fly({
    id: "large_articulated_pike_streamer",
    display_name: "Articulated Pike Streamer",
    family_key: "pike_streamer",
    column_range: ["upper", "mid"],
    pace_range: ["medium", "fast"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish", "bluegill_perch"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "pike_big_profile",
    how_to_fish_text: [
      "Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat.",
      "Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two.",
      "Run it at mid-depth on alternating long and short strips; after a follow, stop completely and let the articulated body collapse before the next strip.",
    ],
  }),
  popper_fly: fly({
    id: "popper_fly",
    display_name: "Popper Fly",
    family_key: "surface_fly",
    column_range: ["surface"],
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["baitfish", "bluegill_perch", "insect_misc"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_surface",
    how_to_fish_text: [
      "Pop once with a short strip, let the rings settle for two seconds, then pop again; in calm conditions, longer pauses are always better.",
      "Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit.",
      "Work it with medium strips that spit and gurgle; slow the cadence near structure and let the fly rest after each pop — target the edge of any surface shadow.",
    ],
  }),
  frog_fly: fly({
    id: "frog_fly",
    display_name: "Frog Fly",
    family_key: "surface_fly",
    column_range: ["surface"],
    pace_range: ["fast", "medium"],
    presence_range: ["moderate", "bold"],
    forage_matches: ["bluegill_perch", "baitfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_surface",
    how_to_fish_text: [
      "Twitch with short strips over and along cover; when it lands near a gap, let it sit still for three seconds before moving — that pause triggers strikes.",
      "Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move.",
      "Retrieve with a strip-rest cadence; the fly should look like a frog resting, then kicking — most strikes come right after the stillness.",
    ],
  }),
  mouse_fly: fly({
    id: "mouse_fly",
    display_name: "Mouse Fly",
    family_key: "surface_fly",
    column_range: ["surface"],
    pace_range: ["fast", "medium"],
    presence_range: ["subtle", "moderate"],
    forage_matches: ["baitfish", "insect_misc"],
    clarity_strengths: ["clear", "stained", "dirty"],
    tactical_lane: "fly_surface",
    how_to_fish_text: [
      "Cast to structure and retrieve with a steady, slow V-wake strip; vary only slightly in speed and resist the urge to twitch — mice move in straight lines.",
      "Swim it on a constant slow retrieve just fast enough to leave a wake; target near-shore edges and structure where big fish expect food to cross.",
      "Work it with a slow, uninterrupted retrieve across open water; the V-wake is the trigger, so keep it moving at a steady pace and stay alert.",
    ],
  }),
};
