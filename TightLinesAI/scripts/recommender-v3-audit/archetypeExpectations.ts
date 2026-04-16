import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
} from "../../supabase/functions/_shared/recommenderEngine/v3/contracts.ts";

export const V3_IMPLEMENTATION_SCOPE_AREAS = [
  "Daily conditions need stronger, biologically coherent influence on rank movement.",
  "Every library archetype must have an intentional role and measurable reach target.",
  "Specialty winners need narrow but real primary windows instead of permanent support-only status.",
  "Top-3 diversity must stay tactically coherent rather than mixing contradictory stories.",
  "Audit output must expose dead archetypes, sticky rows, and intended-vs-actual mismatches.",
] as const;

export const ARCHETYPE_EXPECTATION_ROLES = [
  "winner_capable",
  "top3_support",
  "intentional_low_frequency_specialty",
] as const;

export type ArchetypeExpectationRole =
  (typeof ARCHETYPE_EXPECTATION_ROLES)[number];
export type ArchetypeExpectationReach = "top1" | "top3";

export type RecommenderV3ArchetypeAuditExpectation = {
  role: ArchetypeExpectationRole;
  required_reach: ArchetypeExpectationReach;
  notes: string;
};

export const ARCHETYPE_ROLE_DEFINITIONS: Record<
  ArchetypeExpectationRole,
  string
> = {
  winner_capable:
    "Should legitimately win rank 1 in at least one intended scenario.",
  top3_support:
    "Should reach the top 3 in intended scenarios, but is not required to own rank 1.",
  intentional_low_frequency_specialty:
    "Narrow-context tool that should surface rarely, but still only in biologically credible windows.",
};

/**
 * Ratios are evaluated against the whole audited matrix.
 * Low daily sensitivity is defined as a row producing only one top-1 candidate
 * and two or fewer ordered top-3 lineups across all synthetic daily states.
 */
export const V3_AUDIT_SUCCESS_TARGETS = {
  locked_top1_ratio_max: { lure: 0.5, fly: 0.55 },
  low_daily_sensitivity_ratio_max: { lure: 0.45, fly: 0.5 },
  tactical_conflict_rate_max: { lure: 0.02, fly: 0.02 },
  expectation_mismatches_max: { lure: 0, fly: 0 },
  never_viable_max: { lure: 0, fly: 0 },
  never_top3_max: { lure: 0, fly: 0 },
} as const;

function expectation(
  role: ArchetypeExpectationRole,
  required_reach: ArchetypeExpectationReach,
  notes: string,
): RecommenderV3ArchetypeAuditExpectation {
  return { role, required_reach, notes };
}

const winner = (notes: string) => expectation("winner_capable", "top1", notes);
const support = (notes: string) => expectation("top3_support", "top3", notes);
const specialtyWinner = (notes: string) =>
  expectation("intentional_low_frequency_specialty", "top1", notes);
const specialtySupport = (notes: string) =>
  expectation("intentional_low_frequency_specialty", "top3", notes);

export const LURE_ARCHETYPE_EXPECTATIONS: Record<
  LureArchetypeIdV3,
  RecommenderV3ArchetypeAuditExpectation
> = {
  weightless_stick_worm: winner(
    "Weedless stick-worm cover lane across shallow to mid-depth.",
  ),
  carolina_rigged_stick_worm: specialtySupport(
    "Deeper dragging stick-worm support lane on structure.",
  ),
  shaky_head_worm: winner(
    "Subtle bottom-worm lane for pressured or clear-water fish.",
  ),
  drop_shot_worm: winner("Vertical suspended finesse worm lane."),
  drop_shot_minnow: specialtyWinner("Baitfish-forward suspended finesse lane."),
  ned_rig: winner("Tiny bottom finesse lane for tough pressured conditions."),
  tube_jig: winner("Bottom-contact crawfish and goby staple."),
  texas_rigged_soft_plastic_craw: winner(
    "Weedless craw lane in cover and current seams.",
  ),
  football_jig: winner("Offshore hard-bottom craw lane."),
  compact_flipping_jig: winner("Heavy-cover compact jig primary."),
  finesse_jig: winner(
    "Small-profile jig for pressured fish and smaller forage.",
  ),
  swim_jig: winner("Shallow moving bluegill or baitfish jig lane."),
  hair_jig: specialtyWinner("Cold-water finesse baitfish lane."),
  inline_spinner: winner("River search and reaction staple."),
  spinnerbait: winner("Wind-driven horizontal search staple."),
  bladed_jig: winner(
    "Thumping cover-search lane with baitfish/craw crossover.",
  ),
  paddle_tail_swimbait: winner("General-purpose baitfish swim lane."),
  soft_jerkbait: winner("Subsurface darting baitfish lane."),
  suspending_jerkbait: winner("Cold-to-cool pause-and-react baitfish lane."),
  squarebill_crankbait: winner("Shallow deflection crank lane."),
  flat_sided_crankbait: specialtyWinner("Cold-water tight-wobble crank lane."),
  medium_diving_crankbait: specialtyWinner("Mid-depth crank lane."),
  deep_diving_crankbait: specialtyWinner("Deep structure crank lane."),
  lipless_crankbait: specialtyWinner("Burn-or-yo-yo reaction search lane."),
  blade_bait: winner("Cold bottom reaction metal lane."),
  casting_spoon: winner("Flash search lane in open or current water."),
  walking_topwater: winner("Open-water surface cadence lane."),
  popping_topwater: specialtyWinner("Pop-pause surface lane."),
  buzzbait: specialtyWinner("Noisy low-light surface search lane."),
  prop_bait: specialtyWinner("Subtle sputter-and-pause surface lane."),
  hollow_body_frog: winner("Weed-mat and heavy-cover surface lane."),
  large_profile_pike_swimbait: winner("Big-profile pike search lane."),
  pike_jerkbait: winner("Slash-and-pause pike reaction lane."),
};

export const FLY_ARCHETYPE_EXPECTATIONS: Record<
  FlyArchetypeIdV3,
  RecommenderV3ArchetypeAuditExpectation
> = {
  clouser_minnow: winner(
    "Core baitfish streamer lane across species and current.",
  ),
  deceiver: specialtyWinner("Longer-profile baitfish streamer lane."),
  bucktail_baitfish_streamer: specialtyWinner("Sparse baitfish streamer lane."),
  slim_minnow_streamer: winner("Lean baitfish streamer for active fish."),
  articulated_baitfish_streamer: winner("Big articulated baitfish primary."),
  articulated_dungeon_streamer: winner(
    "Heavy articulated streamer with added push.",
  ),
  game_changer: winner("Broad baitfish-and-pulse streamer lane."),
  woolly_bugger: winner("Generalist subsurface staple."),
  rabbit_strip_leech: winner("Slow-pulse leech and sculpin-adjacent lane."),
  balanced_leech: winner("Suspended leech/bugger lane for restrained fish."),
  zonker_streamer: specialtyWinner(
    "Rabbit-strip baitfish lane with slower pulse.",
  ),
  sculpin_streamer: winner("Bottom-scuttling sculpin primary."),
  sculpzilla: specialtyWinner("Large sculpin bottom lane."),
  muddler_sculpin: winner("Shallow waking or stripped sculpin lane."),
  crawfish_streamer: winner("Crawfish-specific bottom fly lane."),
  conehead_streamer: specialtyWinner("Weighted bottom streamer lane."),
  pike_bunny_streamer: winner("Large rabbit-strip pike fly primary."),
  large_articulated_pike_streamer: winner(
    "Large articulated pike fly primary.",
  ),
  popper_fly: winner("Topwater pop-and-pause fly lane."),
  frog_fly: winner("Surface frog or slider lane around cover."),
  mouse_fly: specialtyWinner(
    "Surface wake mouse lane in narrow low-light windows.",
  ),
};

export const ALL_ARCHETYPE_EXPECTATIONS = {
  lure: LURE_ARCHETYPE_EXPECTATIONS,
  fly: FLY_ARCHETYPE_EXPECTATIONS,
} as const;
