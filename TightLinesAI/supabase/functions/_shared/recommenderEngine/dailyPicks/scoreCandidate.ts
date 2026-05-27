import type {
  ArchetypeProfileV4,
  ForageBucket,
  SeasonalRowV4,
  TacticalPace,
} from "../v4/contracts.ts";
import type { DailyScenario } from "./buildDailyScenario.ts";
import type { CandidateSide } from "./buildCandidatePool.ts";
import { assertScenarioMatchesSeasonalRow } from "./assertScenarioMatchesSeasonalRow.ts";

export type CandidateScore = {
  profile: ArchetypeProfileV4;
  side: CandidateSide;
  score: number;
  reasons: string[];
};

const SCORE = {
  base: 100,
  conditionTag: 16,
  secondaryConditionTagInGroup: 0,
  subtleSlowLane: 10,
  crawBottomLane: 6,
  largemouthTexasCrawLane: 14,
  largemouthTexasCrawBigFishLane: 16,
  largemouthShakyHeadAllPurposeLane: 18,
  largemouthWeightlessStickAllPurposeLane: 30,
  largemouthGlidebaitBigFishLane: 42,
  largemouthSurfaceAllPurposeLane: 20,
  largemouthFrogCoverAllPurposeLane: 24,
  largemouthLiplessCrankAllPurposeLane: 52,
  largemouthMediumCrankAllPurposeLane: 48,
  largemouthSpinnerbaitAllPurposeLane: 18,
  largemouthBladedJigAllPurposeLane: 14,
  largemouthCarolinaRigOffWindowPenalty: -6,
  largemouthTubeJigOffWindowPenalty: -18,
  largemouthPaddleTailBigFishLane: 14,
  largemouthFrogCoverBigFishLane: 36,
  largemouthBuzzbaitBigFishLane: 6,
  largemouthPopperTargetBigFishLane: 20,
  largemouthMouseFlyBigFishLane: 18,
  smallmouthBottomFinesseLane: 6,
  smallmouthNedFinesseLane: 18,
  smallmouthTexasCrawLane: 14,
  smallmouthFinesseJigLane: 14,
  smallmouthTubeJigAllPurposeLane: 14,
  smallmouthPaddleTailSearchLane: 16,
  smallmouthBladeBaitColdReactionLane: 16,
  smallmouthCrawfishFlyBigFishLane: 44,
  smallmouthGurglerSurfaceBigFishLane: 34,
  smallmouthPopperTargetBigFishLane: 34,
  smallmouthMouseBankBigFishLane: 32,
  pikeBucktailReactionLane: 20,
  pikeSpinnerbaitCoverReactionLane: 20,
  pikeJerkbaitPauseLane: 18,
  pikeSpoonSearchLane: 18,
  pikeGlideAmbushLane: 18,
  pikeTubeBottomLane: 16,
  pikeLargeSwimbaitLane: 16,
  pikeFlyAlternativeLane: 14,
  pikeBladeBaitOffWindowPenalty: -56,
  pikeHeavyPaddleTailOffWindowPenalty: -44,
  heatSlowBottomLane: 6,
  troutFinesseMinnowLane: 14,
  troutNedRigAllPurposeRestraint: -12,
  troutNedRigOffWindowPenalty: -44,
  troutCrawfishStreamerLane: 34,
  troutRiverStreamerAlternativeLane: 10,
  troutDirtyCurrentLureAlternativeLane: 14,
  troutHairJigDirtyCurrentPenalty: -16,
  troutHairJigAllPurposeOffWindowPenalty: -48,
  troutSurfacePlugAllPurposeLane: 24,
  troutCastingSpoonAllPurposeLane: 10,
  allPurposeReliable: 18,
  allPurposeVersatile: 12,
  bigFishUpside: 20,
  bigFishHighRisk: 12,
  troutBigFishLureUpside: 12,
  troutDirtyCurrentMismatchPenalty: -12,
  troutClassicFlyLane: 14,
  troutAllPurposeCrossoverFlyPenalty: -10,
  troutHeatCrossoverFlyPenalty: -12,
  clarityStrength: 8,
  primaryForage: 12,
  secondaryForage: 6,
  baselineColumn: 10,
  baselinePrimaryPace: 10,
  baselineSecondaryPace: 6,
  surfaceCautionPenalty: -24,
} as const;

const CONDITION_TAG_GROUPS: readonly (readonly string[])[] = [
  ["wind_reaction", "dirty_vibration"],
  ["warming_search", "open_water_search"],
  ["low_light_surface", "calm_surface"],
];

const CONDITION_TAG_GROUP_BY_TAG = new Map<string, string>(
  CONDITION_TAG_GROUPS.flatMap((group) =>
    group.map((tag) => [tag, group.join("|")] as const)
  ),
);

function addScore(
  reasons: string[],
  label: string,
  value: number,
): number {
  reasons.push(`${label}:${value >= 0 ? "+" : ""}${value}`);
  return value;
}

function paceMatchesBaseline(
  profile: ArchetypeProfileV4,
  pace: TacticalPace,
): "primary" | "secondary" | null {
  if (profile.primary_pace === pace) return "primary";
  if (profile.secondary_pace === pace) return "secondary";
  return null;
}

function hasForage(
  profile: ArchetypeProfileV4,
  forage: ForageBucket | undefined,
): boolean {
  return forage != null && profile.forage_tags.includes(forage);
}

function hasScenarioTag(
  scenario: DailyScenario,
  tags: readonly string[],
): boolean {
  return scenario.scenario_tags.some((tag) => tags.includes(tag));
}

function hasSlowPace(profile: ArchetypeProfileV4): boolean {
  return profile.primary_pace === "slow" || profile.secondary_pace === "slow";
}

function isReliableSlowSubtleProfile(profile: ArchetypeProfileV4): boolean {
  return hasSlowPace(profile) &&
    profile.goal_tags.includes("reliable_action") &&
    profile.condition_tags.some((tag) =>
      tag === "clear_subtle" || tag === "cold_slow" ||
      tag === "heat_finesse"
    );
}

function isSlowSubtleAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  return scenario.recommendation_goal === "all_purpose" &&
    scenario.activity_level !== "active" &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    hasScenarioTag(scenario, ["clear_subtle", "cold_slow", "heat_finesse"]) &&
    isReliableSlowSubtleProfile(profile);
}

function isCrawBottomAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  return scenario.recommendation_goal === "all_purpose" &&
    scenario.activity_level !== "active" &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    !scenario.scenario_tags.includes("dirty_vibration") &&
    profile.column === "bottom" &&
    hasSlowPace(profile) &&
    profile.goal_tags.includes("reliable_action") &&
    profile.forage_tags.includes("crawfish") &&
    (row.primary_forage === "crawfish" ||
      row.secondary_forage === "crawfish") &&
    hasScenarioTag(scenario, ["clear_subtle", "cold_slow", "current_swing"]);
}

function isLargemouthTexasCrawAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    scenario.activity_level === "active" ||
    profile.id !== "texas_rigged_soft_plastic_craw"
  ) {
    return false;
  }

  const hasCrawForage = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";
  const dailyBottomWindow = scenario.scenario_tags.some((tag) =>
    tag === "cold_slow" ||
    tag === "clear_subtle" ||
    tag === "dirty_vibration" ||
    tag === "heat_finesse"
  );

  return hasCrawForage || dailyBottomWindow || row.column_baseline === "bottom";
}

function isLargemouthTexasCrawBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "texas_rigged_soft_plastic_craw"
  ) {
    return false;
  }

  const hasCrawForage = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";
  const tags = new Set(scenario.scenario_tags);
  const bottomAmbushWindow = tags.has("cover_ambush") ||
    tags.has("cold_slow") ||
    tags.has("heat_finesse") ||
    tags.has("clear_subtle") ||
    tags.has("dirty_vibration") ||
    row.column_baseline === "bottom";

  return hasCrawForage && bottomAmbushWindow;
}

function isLargemouthShakyHeadAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    scenario.activity_level === "active" ||
    profile.id !== "shaky_head_worm" ||
    (scenario.water_clarity !== "clear" &&
      scenario.water_clarity !== "stained")
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const finesseWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse");
  const bottomFoodWindow = row.column_baseline === "bottom" ||
    row.column_range.includes("bottom") ||
    row.primary_forage === "leech_worm" ||
    row.secondary_forage === "leech_worm" ||
    row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";

  return finesseWindow && bottomFoodWindow;
}

function isLargemouthWeightlessStickAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "weightless_stick_worm" ||
    scenario.activity_level === "active" ||
    (scenario.water_clarity !== "clear" &&
      scenario.water_clarity !== "stained")
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const calmControlled = scenario.wind_mode === "calm" ||
    scenario.wind_mode === "slight";
  const coverOrFinesse = tags.has("cover_ambush") ||
    tags.has("heat_finesse") ||
    tags.has("clear_subtle") ||
    row.primary_forage === "leech_worm" ||
    row.secondary_forage === "leech_worm" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";

  return calmControlled && coverOrFinesse;
}

function isLargemouthGlidebaitBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    scenario.water_type !== "freshwater_lake_pond" ||
    scenario.activity_level === "suppressed" ||
    profile.id !== "glidebait" ||
    (scenario.water_clarity !== "clear" &&
      scenario.water_clarity !== "stained")
  ) {
    return false;
  }

  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const tags = new Set(scenario.scenario_tags);
  const glideWindow = tags.has("clear_subtle") ||
    tags.has("open_water_search") ||
    tags.has("cover_ambush") ||
    tags.has("calm_surface") ||
    tags.has("low_light_surface");

  return forageFit && glideWindow && !tags.has("dirty_vibration");
}

function isLargemouthPaddleTailBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "paddle_tail_swimbait" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  if (!forageFit) return false;

  const tags = new Set(scenario.scenario_tags);
  const searchWindow = tags.has("open_water_search") ||
    tags.has("warming_search") ||
    tags.has("low_light_surface") ||
    tags.has("calm_surface");
  const heatPenaltyWindow = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return searchWindow && !heatPenaltyWindow;
}

function hasLargemouthFrogForageOrCover(args: {
  row: SeasonalRowV4;
  scenario: DailyScenario;
  tags: ReadonlySet<string>;
  allowGenericStainedLakeProxy: boolean;
}): boolean {
  const { row, scenario, tags } = args;
  const explicitCoverOrForage = tags.has("cover_ambush") ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch" ||
    row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey";
  if (explicitCoverOrForage) return true;
  if (!args.allowGenericStainedLakeProxy) return false;

  const controlledSurface = tags.has("low_light_surface") ||
    (tags.has("calm_surface") && scenario.wind_mode !== "breezy");
  return row.water_type === "freshwater_lake_pond" &&
    scenario.water_clarity !== "clear" &&
    controlledSurface;
}

function isLargemouthFrogCoverBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "hollow_body_frog" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const explicitCoverOrForage = tags.has("cover_ambush") ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch" ||
    row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey";
  const coverOrForageProxy = hasLargemouthFrogForageOrCover({
    row,
    scenario,
    tags,
    allowGenericStainedLakeProxy: true,
  });
  const lightOrSurfaceFit = tags.has("low_light_surface") ||
    tags.has("calm_surface") ||
    (scenario.surface_daily_gate === "caution" && explicitCoverOrForage);
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return coverOrForageProxy && lightOrSurfaceFit && !heatNoLight;
}

function isLargemouthFrogCoverAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "hollow_body_frog" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate !== "open"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const coverOrForageProxy = hasLargemouthFrogForageOrCover({
    row,
    scenario,
    tags,
    allowGenericStainedLakeProxy: false,
  });
  const lightOrCalmFit = tags.has("low_light_surface") ||
    (tags.has("calm_surface") &&
      (scenario.wind_mode === "calm" || scenario.wind_mode === "slight"));
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return coverOrForageProxy && lightOrCalmFit && !heatNoLight;
}

function isLargemouthBuzzbaitBigFishLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "buzzbait" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const noisySurfaceWindow = tags.has("low_light_surface") &&
    (tags.has("wind_reaction") ||
      tags.has("dirty_vibration") ||
      scenario.water_clarity !== "clear");
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return noisySurfaceWindow && !heatNoLight;
}

function isLargemouthPopperTargetBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "popping_topwater" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const targetForage = row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const surfaceFit = tags.has("low_light_surface") ||
    (tags.has("calm_surface") &&
      (scenario.wind_mode === "calm" || scenario.wind_mode === "slight"));
  const targetWater = targetForage ||
    (row.water_type === "freshwater_lake_pond" &&
      scenario.wind_mode !== "breezy" &&
      scenario.water_clarity !== "dirty");
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return targetWater && surfaceFit && !heatNoLight;
}

function isLargemouthMouseFlyBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "mouse_fly" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed" ||
    scenario.water_clarity === "dirty" ||
    scenario.month < 5 ||
    scenario.month > 9
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const controlledSurface = tags.has("low_light_surface") ||
    (tags.has("calm_surface") &&
      (scenario.wind_mode === "calm" || scenario.wind_mode === "slight"));
  const bankOrShadeFood = row.column_baseline === "upper" ||
    row.column_baseline === "surface" ||
    row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch" ||
    row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish";
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return controlledSurface && bankOrShadeFood && !heatNoLight;
}

function isLargemouthLiplessCrankAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "lipless_crankbait" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const reactionOrSearch = tags.has("wind_reaction") ||
    tags.has("dirty_vibration") ||
    tags.has("warming_search") ||
    tags.has("open_water_search");
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";

  return forageFit && reactionOrSearch &&
    (scenario.water_clarity === "stained" ||
      scenario.water_clarity === "dirty");
}

function isLargemouthMediumCrankAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "medium_diving_crankbait" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const searchWindow = tags.has("open_water_search") ||
    tags.has("warming_search") ||
    tags.has("wind_reaction") ||
    tags.has("dirty_vibration");
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return forageFit && searchWindow && !heatNoLight &&
    scenario.water_clarity !== "clear";
}

function isLargemouthSpinnerbaitAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "spinnerbait" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const bladeWindow = tags.has("wind_reaction") ||
    tags.has("dirty_vibration") ||
    tags.has("cover_ambush") ||
    tags.has("current_swing");

  return forageFit && bladeWindow &&
    (scenario.water_clarity === "stained" ||
      scenario.water_clarity === "dirty");
}

function isLargemouthBladedJigAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "bladed_jig" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const chatterbaitWindow = tags.has("wind_reaction") ||
    tags.has("dirty_vibration") ||
    tags.has("cover_ambush") ||
    tags.has("warming_search");

  return forageFit && chatterbaitWindow &&
    (scenario.water_clarity === "stained" ||
      scenario.water_clarity === "dirty");
}

function isLargemouthCarolinaRigOffWindow(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "carolina_rigged_stick_worm"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const bottomFood = row.column_range.includes("bottom") &&
    (row.primary_forage === "leech_worm" ||
      row.secondary_forage === "leech_worm" ||
      row.primary_forage === "crawfish" ||
      row.secondary_forage === "crawfish" ||
      row.primary_forage === "baitfish" ||
      row.secondary_forage === "baitfish");
  const trueDragWindow = bottomFood &&
    scenario.activity_level !== "active" &&
    scenario.water_clarity !== "dirty" &&
    (tags.has("cold_slow") || tags.has("clear_subtle"));

  return !trueDragWindow;
}

function isLargemouthTubeJigOffWindow(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "tube_jig"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const crawFit = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";
  const trueTubeFallback = row.water_type === "freshwater_river" &&
    crawFit &&
    tags.has("cold_slow") &&
    scenario.activity_level !== "active";

  return !trueTubeFallback;
}

function isLargemouthSurfaceAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "largemouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.gear_mode !== "lure" ||
    !profile.is_surface ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate !== "open"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";
  if (heatNoLight) return false;

  const calmOrLowLight = tags.has("calm_surface") ||
    tags.has("low_light_surface");
  if (!calmOrLowLight) return false;

  const forageFit = row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch" ||
    row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish";

  switch (profile.id) {
    case "popping_topwater":
      return scenario.wind_mode === "calm" &&
        scenario.water_clarity !== "dirty" &&
        (forageFit || row.water_type === "freshwater_lake_pond");
    case "walking_topwater":
    case "wake_bait":
      return (scenario.wind_mode === "calm" ||
        scenario.wind_mode === "slight") &&
        (forageFit || tags.has("low_light_surface"));
    case "buzzbait":
      return tags.has("low_light_surface") &&
        (scenario.water_clarity !== "clear" ||
          tags.has("dirty_vibration") ||
          tags.has("wind_reaction"));
    case "hollow_body_frog":
      return row.water_type === "freshwater_lake_pond" &&
        (tags.has("cover_ambush") ||
          row.primary_forage === "bluegill_perch" ||
          row.secondary_forage === "bluegill_perch" ||
          row.primary_forage === "surface_prey" ||
          row.secondary_forage === "surface_prey") &&
        (tags.has("low_light_surface") ||
          (tags.has("calm_surface") && scenario.activity_level === "active"));
    default:
      return false;
  }
}

function isSmallmouthBottomFinesseAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    scenario.activity_level === "active" ||
    ![
      "ned_rig",
      "texas_rigged_soft_plastic_craw",
      "finesse_jig",
    ].includes(profile.id)
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const finesseWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse") ||
    tags.has("current_swing");
  const forageFit = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish" ||
    row.primary_forage === "leech_worm" ||
    row.secondary_forage === "leech_worm";

  return isBottomFinesseProfile(profile) &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    (finesseWindow || forageFit || row.column_baseline === "bottom");
}

function isSmallmouthNedFinesseLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    profile.id !== "ned_rig" ||
    scenario.activity_level === "active"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const finesseWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse") ||
    tags.has("current_swing");
  const forageFit = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish" ||
    row.primary_forage === "leech_worm" ||
    row.secondary_forage === "leech_worm";

  return (scenario.water_clarity === "clear" ||
    scenario.water_clarity === "stained") &&
    (finesseWindow || forageFit || row.column_baseline === "bottom");
}

function isSmallmouthTexasCrawLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    profile.id !== "texas_rigged_soft_plastic_craw" ||
    scenario.activity_level === "active"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const crawWindow = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish" ||
    tags.has("current_swing") ||
    tags.has("cover_ambush");
  const bottomWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse") ||
    tags.has("dirty_vibration") ||
    row.column_baseline === "bottom";

  return crawWindow && bottomWindow;
}

function isSmallmouthFinesseJigLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    profile.id !== "finesse_jig" ||
    scenario.activity_level === "active"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const finesseWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse") ||
    tags.has("current_swing") ||
    row.column_baseline === "bottom";
  const forageFit = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish" ||
    row.primary_forage === "leech_worm" ||
    row.secondary_forage === "leech_worm";

  return forageFit &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    finesseWindow;
}

function isSmallmouthPaddleTailSearchLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    profile.id !== "paddle_tail_swimbait" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const tags = new Set(scenario.scenario_tags);
  const searchWindow = tags.has("open_water_search") ||
    tags.has("warming_search") ||
    tags.has("low_light_surface") ||
    tags.has("calm_surface");
  const heatPenaltyWindow = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return forageFit && searchWindow && !heatPenaltyWindow;
}

function isSmallmouthTubeJigAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "tube_jig" ||
    scenario.activity_level === "active"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const bottomFinesseWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("current_swing") ||
    row.column_baseline === "bottom";
  const forageFit = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish" ||
    row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish";

  return forageFit &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    bottomFinesseWindow;
}

function isSmallmouthBladeBaitColdReactionLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    profile.id !== "blade_bait" ||
    scenario.activity_level === "active"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const coldOrOpen = tags.has("cold_slow") ||
    tags.has("open_water_search") ||
    tags.has("current_swing");
  const reactionSupport = tags.has("wind_reaction") ||
    tags.has("dirty_vibration") ||
    scenario.water_clarity !== "clear";
  const heatPenaltyWindow = scenario.thermal_mode === "heat_limited" &&
    !tags.has("cold_slow");

  return coldOrOpen && reactionSupport && !heatPenaltyWindow;
}

function isSmallmouthGurglerSurfaceBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "foam_gurgler_fly" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const forageFit = row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey" ||
    row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish";
  const surfaceFit = tags.has("low_light_surface") ||
    tags.has("calm_surface") ||
    scenario.surface_daily_gate === "caution";
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return forageFit && surfaceFit && !heatNoLight;
}

function isSmallmouthCrawfishFlyBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "warmwater_crawfish_fly" ||
    scenario.activity_level === "active"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const crawWindow = row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish" ||
    tags.has("current_swing") ||
    tags.has("cover_ambush");
  const bottomRockWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("dirty_vibration") ||
    row.column_baseline === "bottom";

  return crawWindow && bottomRockWindow &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained");
}

function isSmallmouthPopperTargetBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "popper_fly" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed" ||
    scenario.water_clarity === "dirty"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const calmTargetSurface = tags.has("low_light_surface") ||
    (tags.has("calm_surface") &&
      (scenario.wind_mode === "calm" || scenario.wind_mode === "slight"));
  const targetForage = row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch" ||
    row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish";
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return calmTargetSurface && targetForage && !heatNoLight;
}

function isSmallmouthMouseBankBigFishLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "smallmouth_bass" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "mouse_fly" ||
    row.water_type !== "freshwater_river" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate === "closed" ||
    scenario.water_clarity === "dirty" ||
    scenario.month < 7 ||
    scenario.month > 9
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const controlledBankSurface = tags.has("low_light_surface") ||
    (tags.has("calm_surface") &&
      (scenario.wind_mode === "calm" || scenario.wind_mode === "slight"));
  const bankFoodWindow = row.primary_forage === "surface_prey" ||
    row.secondary_forage === "surface_prey" ||
    row.column_baseline === "upper" ||
    row.column_baseline === "surface";
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return controlledBankSurface && bankFoodWindow && !heatNoLight;
}

function isPikeBucktailReactionLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    profile.id !== "large_bucktail_spinner" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const reactionWindow = tags.has("wind_reaction") ||
    tags.has("dirty_vibration") ||
    tags.has("open_water_search");
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";

  return reactionWindow && forageFit;
}

function isPikeSpinnerbaitCoverReactionLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    profile.id !== "pike_spinnerbait" ||
    scenario.activity_level === "suppressed" ||
    (scenario.water_clarity !== "stained" && scenario.water_clarity !== "dirty")
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const reactionOrCover = tags.has("wind_reaction") ||
    tags.has("dirty_vibration") ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch" ||
    row.column_baseline === "upper" ||
    row.column_baseline === "mid";

  return reactionOrCover;
}

function isPikeJerkbaitPauseLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "pike_jerkbait" ||
    scenario.activity_level === "suppressed" ||
    (scenario.water_clarity !== "clear" && scenario.water_clarity !== "stained")
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const pauseWindow = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("open_water_search") ||
    tags.has("wind_reaction");
  const heatPenalty = scenario.thermal_mode === "heat_limited" &&
    !tags.has("open_water_search");

  return pauseWindow && !heatPenalty;
}

function isPikeSpoonSearchLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  if (profile.id === "casting_spoon") {
    return scenario.recommendation_goal === "all_purpose" &&
      (tags.has("wind_reaction") ||
        tags.has("open_water_search") ||
        tags.has("warming_search") ||
        row.primary_forage === "baitfish" ||
        row.secondary_forage === "baitfish");
  }

  if (profile.id === "weedless_spoon") {
    const warmCoverSeason = scenario.month >= 6 && scenario.month <= 10;
    const coverProxy = row.primary_forage === "bluegill_perch" ||
      row.secondary_forage === "bluegill_perch" ||
      row.column_baseline === "upper" ||
      scenario.water_clarity !== "clear";
    return warmCoverSeason && coverProxy &&
      (tags.has("dirty_vibration") ||
        tags.has("wind_reaction") ||
        scenario.water_clarity !== "clear");
  }

  return false;
}

function isPikeGlideAmbushLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "pike_glidebait" ||
    scenario.activity_level === "suppressed" ||
    (scenario.water_clarity !== "clear" && scenario.water_clarity !== "stained")
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const controlledWindow = scenario.wind_mode === "calm" ||
    scenario.wind_mode === "slight" ||
    tags.has("clear_subtle") ||
    tags.has("open_water_search");

  return controlledWindow && !tags.has("dirty_vibration");
}

function isPikeTubeBottomLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    profile.id !== "large_pike_tube" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const bottomOrCurrent = tags.has("cold_slow") ||
    tags.has("current_swing") ||
    row.column_baseline === "bottom";
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";

  return bottomOrCurrent && forageFit;
}

function isPikeLargeSwimbaitLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.id !== "large_profile_pike_swimbait" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const warmSearchOrCover = tags.has("open_water_search") ||
    tags.has("warming_search") ||
    tags.has("cover_ambush") ||
    row.column_baseline === "mid" ||
    row.column_baseline === "upper";

  return forageFit && warmSearchOrCover && !tags.has("cold_slow");
}

function isPikeFlyAlternativeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    profile.gear_mode !== "fly" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  switch (profile.id) {
    case "deceiver":
      return tags.has("wind_reaction") ||
        tags.has("open_water_search") ||
        tags.has("dirty_vibration");
    case "game_changer":
    case "articulated_baitfish_streamer":
      return scenario.recommendation_goal === "big_fish" &&
        (tags.has("open_water_search") ||
          tags.has("warming_search") ||
          tags.has("dirty_vibration"));
    case "bucktail_baitfish_streamer":
      return tags.has("current_swing") ||
        tags.has("wind_reaction") ||
        tags.has("open_water_search");
    default:
      return false;
  }
}

function isPikeBladeBaitOffWindowSpecialist(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species === "northern_pike" &&
    scenario.recommendation_goal === "all_purpose" &&
    profile.id === "blade_bait"
  ) {
    const tags = new Set(scenario.scenario_tags);
    const trueBladeWindow = tags.has("cold_slow") ||
      tags.has("current_swing") ||
      (tags.has("dirty_vibration") && tags.has("open_water_search"));
    return !trueBladeWindow;
  }
  return false;
}

function isPikeHeavyPaddleTailOffWindow(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (
    scenario.species !== "northern_pike" ||
    profile.id !== "pike_jig_and_plastic"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const stainedOrDirty = scenario.water_clarity === "stained" ||
    scenario.water_clarity === "dirty";
  const forageFit = row.primary_forage === "baitfish" ||
    row.secondary_forage === "baitfish" ||
    row.primary_forage === "bluegill_perch" ||
    row.secondary_forage === "bluegill_perch";
  const conditionBackedForage = stainedOrDirty && forageFit &&
    (tags.has("open_water_search") ||
      tags.has("warming_search") ||
      tags.has("cover_ambush"));
  const dirtyHeavyWindow = tags.has("dirty_vibration") &&
    stainedOrDirty &&
    (forageFit ||
      row.column_baseline === "bottom" ||
      tags.has("open_water_search") ||
      tags.has("cover_ambush"));
  const trueHeavyWindow = (tags.has("cold_slow") &&
    scenario.water_clarity !== "clear") ||
    dirtyHeavyWindow ||
    (stainedOrDirty && row.column_baseline === "bottom") ||
    conditionBackedForage;

  return !trueHeavyWindow;
}

function isBottomFinesseProfile(profile: ArchetypeProfileV4): boolean {
  return profile.column === "bottom" && hasSlowPace(profile);
}

function isHeatSlowBottomAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  return scenario.recommendation_goal === "all_purpose" &&
    scenario.activity_level !== "active" &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    scenario.scenario_tags.includes("heat_finesse") &&
    profile.column === "bottom" &&
    hasSlowPace(profile) &&
    profile.goal_tags.includes("reliable_action");
}

function isTroutFinesseMinnowAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "drop_shot_minnow" ||
    scenario.water_clarity === "dirty"
  ) {
    return false;
  }
  return scenario.scenario_tags.includes("clear_subtle") ||
    scenario.scenario_tags.includes("heat_finesse");
}

function isTroutSurfacePlugAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "small_floating_trout_plug" ||
    scenario.activity_level === "suppressed" ||
    scenario.surface_daily_gate !== "open"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const surfaceFit = tags.has("low_light_surface") ||
    (tags.has("calm_surface") &&
      (scenario.wind_mode === "calm" || scenario.wind_mode === "slight"));
  const heatNoLight = scenario.thermal_mode === "heat_limited" &&
    scenario.light_mode !== "low_light";

  return surfaceFit && !heatNoLight &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained");
}

function isTroutCastingSpoonAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "casting_spoon" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const searchOrCurrent = tags.has("open_water_search") ||
    tags.has("warming_search") ||
    tags.has("wind_reaction") ||
    tags.has("current_swing") ||
    tags.has("dirty_vibration");

  return searchOrCurrent && !tags.has("heat_finesse");
}

function isTroutNedRigOffWindow(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  if (scenario.species !== "trout" || profile.id !== "ned_rig") {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const clearOrStained = scenario.water_clarity === "clear" ||
    scenario.water_clarity === "stained";
  const finesseWindow = tags.has("cold_slow") || tags.has("heat_finesse");
  const forageFit = row.primary_forage === "leech_worm" ||
    row.secondary_forage === "leech_worm" ||
    row.primary_forage === "crawfish" ||
    row.secondary_forage === "crawfish";
  const activityFit = scenario.activity_level !== "active";

  return !(clearOrStained && finesseWindow && forageFit && activityFit);
}

function isTroutHairJigAllPurposeOffWindow(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.recommendation_goal !== "all_purpose" ||
    profile.id !== "hair_jig"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const trueHairWindow = tags.has("cold_slow") ||
    tags.has("current_swing") ||
    (tags.has("clear_subtle") && scenario.water_clarity !== "dirty");

  return !trueHairWindow || tags.has("heat_finesse") ||
    tags.has("runoff_streamer") ||
    tags.has("dirty_vibration");
}

function isTroutBigFishLureUpsideLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.gear_mode !== "lure" ||
    profile.is_surface
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const heatLimited = scenario.thermal_mode === "heat_limited" ||
    tags.has("heat_finesse");

  switch (profile.id) {
    case "hair_jig":
      return scenario.water_clarity !== "dirty" &&
        !tags.has("runoff_streamer") &&
        (tags.has("cold_slow") ||
          (tags.has("clear_subtle") && !tags.has("open_water_search")));
    case "blade_bait":
      return tags.has("cold_slow") ||
        tags.has("current_swing");
    case "casting_spoon":
      return !heatLimited &&
        (tags.has("wind_reaction") ||
          tags.has("dirty_vibration") ||
          tags.has("open_water_search") ||
          tags.has("warming_search") ||
          tags.has("current_swing"));
    case "suspending_jerkbait":
      return !heatLimited &&
        (tags.has("cold_slow") ||
          tags.has("clear_subtle"));
    default:
      return false;
  }
}

function isTroutDirtyCurrentLureAlternativeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    profile.gear_mode !== "lure" ||
    scenario.activity_level === "suppressed"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const dirtyCurrentWindow = tags.has("dirty_vibration") ||
    tags.has("runoff_streamer") ||
    tags.has("current_swing");
  if (!dirtyCurrentWindow) return false;

  return profile.id === "inline_spinner" ||
    profile.id === "casting_spoon" ||
    profile.id === "blade_bait" ||
    profile.id === "suspending_jerkbait";
}

function isTroutDirtyCurrentMismatch(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.water_clarity !== "dirty" ||
    scenario.water_movement_mode !== "elevated_or_dirty"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const dirtyCurrentWindow = tags.has("dirty_vibration") ||
    tags.has("runoff_streamer") ||
    tags.has("current_swing");
  if (!dirtyCurrentWindow) return false;

  return profile.id === "suspending_jerkbait" &&
    !profile.clarity_strengths.includes("dirty") &&
    !profile.condition_tags.some((tag) =>
      tag === "dirty_vibration" ||
      tag === "runoff_streamer" ||
      tag === "current_swing"
    );
}

function isTroutHairJigDirtyCurrentMismatch(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (scenario.species !== "trout" || profile.id !== "hair_jig") {
    return false;
  }
  const tags = new Set(scenario.scenario_tags);
  return scenario.water_clarity === "dirty" ||
    tags.has("dirty_vibration") ||
    tags.has("runoff_streamer");
}

function isTroutClassicFlyLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (scenario.species !== "trout" || profile.gear_mode !== "fly") {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const coldOrControlled = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse");
  const riverFoodLane = tags.has("current_swing") ||
    tags.has("runoff_streamer") ||
    tags.has("dirty_vibration");

  switch (profile.id) {
    case "woolly_bugger":
    case "jighead_marabou_leech":
    case "lead_eye_leech":
    case "feather_jig_leech":
      return coldOrControlled || riverFoodLane;
    case "sculpin_streamer":
    case "muddler_sculpin":
      return tags.has("current_swing") ||
        tags.has("runoff_streamer") ||
        tags.has("cold_slow") ||
        tags.has("clear_subtle");
    case "rabbit_strip_leech":
      return scenario.recommendation_goal === "big_fish" ||
        coldOrControlled ||
        tags.has("dirty_vibration");
    default:
      return false;
  }
}

function isTroutCrawfishStreamerLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    profile.id !== "crawfish_streamer" ||
    scenario.water_type !== "freshwater_river"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  return tags.has("current_swing") ||
    tags.has("runoff_streamer") ||
    tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("dirty_vibration");
}

function isTroutRiverStreamerAlternativeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    profile.gear_mode !== "fly" ||
    scenario.water_type !== "freshwater_river"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  switch (profile.id) {
    case "zonker_streamer":
    case "conehead_streamer":
    case "bucktail_baitfish_streamer":
      return tags.has("current_swing") ||
        tags.has("runoff_streamer") ||
        tags.has("open_water_search") ||
        tags.has("wind_reaction") ||
        tags.has("dirty_vibration");
    case "sculpin_streamer":
    case "muddler_sculpin":
      return tags.has("current_swing") ||
        tags.has("runoff_streamer") ||
        tags.has("cold_slow") ||
        tags.has("clear_subtle");
    default:
      return false;
  }
}

function troutAllPurposeCrossoverFlyPenalty(
  profile: ArchetypeProfileV4,
): number {
  switch (profile.id) {
    case "game_changer":
      return SCORE.troutAllPurposeCrossoverFlyPenalty * 2;
    case "articulated_baitfish_streamer":
      return SCORE.troutAllPurposeCrossoverFlyPenalty;
    case "clouser_minnow":
      return SCORE.troutAllPurposeCrossoverFlyPenalty * 2;
    default:
      return 0;
  }
}

function isTroutHeatCrossoverFly(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    profile.gear_mode !== "fly" ||
    !scenario.scenario_tags.includes("heat_finesse")
  ) {
    return false;
  }
  return profile.id === "game_changer" ||
    profile.id === "articulated_baitfish_streamer" ||
    profile.id === "articulated_dungeon_streamer";
}

export function scoreCandidate(args: {
  profile: ArchetypeProfileV4;
  side: CandidateSide;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): CandidateScore {
  const { profile, side, row, scenario } = args;
  assertScenarioMatchesSeasonalRow({ row, scenario });

  const reasons: string[] = [`base:+${SCORE.base}`];
  let score = SCORE.base;
  const conditionGroupMatches = new Map<string, number>();

  for (const tag of scenario.scenario_tags) {
    if (profile.condition_tags.includes(tag)) {
      const group = CONDITION_TAG_GROUP_BY_TAG.get(tag) ?? tag;
      const previousMatches = conditionGroupMatches.get(group) ?? 0;
      conditionGroupMatches.set(group, previousMatches + 1);
      const value = previousMatches === 0
        ? SCORE.conditionTag
        : SCORE.secondaryConditionTagInGroup;
      score += addScore(reasons, `condition_tag:${tag}`, value);
    }
  }

  if (scenario.recommendation_goal === "all_purpose") {
    if (profile.goal_tags.includes("reliable_action")) {
      score += addScore(
        reasons,
        "goal:all_purpose:reliable_action",
        SCORE.allPurposeReliable,
      );
    }
    if (profile.goal_tags.includes("versatile_search")) {
      score += addScore(
        reasons,
        "goal:all_purpose:versatile_search",
        SCORE.allPurposeVersatile,
      );
    }
  } else {
    if (profile.goal_tags.includes("big_fish_upside")) {
      score += addScore(
        reasons,
        "goal:big_fish:big_fish_upside",
        SCORE.bigFishUpside,
      );
    }
    if (profile.goal_tags.includes("high_risk_high_reward")) {
      score += addScore(
        reasons,
        "goal:big_fish:high_risk_high_reward",
        SCORE.bigFishHighRisk,
      );
    }
    if (isTroutBigFishLureUpsideLane({ profile, scenario })) {
      score += addScore(
        reasons,
        "goal:big_fish:trout_trophy_lure",
        SCORE.troutBigFishLureUpside,
      );
    }
  }

  if (isSlowSubtleAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:slow_subtle_all_purpose",
      SCORE.subtleSlowLane,
    );
  }
  if (isCrawBottomAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:craw_bottom_all_purpose",
      SCORE.crawBottomLane,
    );
  }
  if (isLargemouthTexasCrawAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_texas_craw_all_purpose",
      SCORE.largemouthTexasCrawLane,
    );
  }
  if (isLargemouthTexasCrawBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_texas_craw_big_fish",
      SCORE.largemouthTexasCrawBigFishLane,
    );
  }
  if (isLargemouthShakyHeadAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_shaky_head_all_purpose",
      SCORE.largemouthShakyHeadAllPurposeLane,
    );
  }
  if (isLargemouthWeightlessStickAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_weightless_stick_all_purpose",
      SCORE.largemouthWeightlessStickAllPurposeLane,
    );
  }
  if (isLargemouthGlidebaitBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_glidebait_big_fish",
      SCORE.largemouthGlidebaitBigFishLane,
    );
  }
  if (isLargemouthSurfaceAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_surface_all_purpose",
      SCORE.largemouthSurfaceAllPurposeLane,
    );
  }
  if (isLargemouthFrogCoverAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_frog_cover_all_purpose",
      SCORE.largemouthFrogCoverAllPurposeLane,
    );
  }
  if (isLargemouthLiplessCrankAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_lipless_crank_all_purpose",
      SCORE.largemouthLiplessCrankAllPurposeLane,
    );
  }
  if (isLargemouthMediumCrankAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_medium_crank_all_purpose",
      SCORE.largemouthMediumCrankAllPurposeLane,
    );
  }
  if (isLargemouthSpinnerbaitAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_spinnerbait_all_purpose",
      SCORE.largemouthSpinnerbaitAllPurposeLane,
    );
  }
  if (isLargemouthBladedJigAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_bladed_jig_all_purpose",
      SCORE.largemouthBladedJigAllPurposeLane,
    );
  }
  if (isLargemouthCarolinaRigOffWindow({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "largemouth_carolina_rig_off_window",
      SCORE.largemouthCarolinaRigOffWindowPenalty,
    );
  }
  if (isLargemouthTubeJigOffWindow({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "largemouth_tube_jig_off_window",
      SCORE.largemouthTubeJigOffWindowPenalty,
    );
  }
  if (isLargemouthPaddleTailBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_paddle_tail_big_fish",
      SCORE.largemouthPaddleTailBigFishLane,
    );
  }
  if (isLargemouthFrogCoverBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_frog_cover_big_fish",
      SCORE.largemouthFrogCoverBigFishLane,
    );
  }
  if (isLargemouthBuzzbaitBigFishLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_buzzbait_big_fish",
      SCORE.largemouthBuzzbaitBigFishLane,
    );
  }
  if (isLargemouthPopperTargetBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_popper_target_big_fish",
      SCORE.largemouthPopperTargetBigFishLane,
    );
  }
  if (isLargemouthMouseFlyBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:largemouth_mouse_fly_big_fish",
      SCORE.largemouthMouseFlyBigFishLane,
    );
  }
  if (isSmallmouthBottomFinesseAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_bottom_finesse_all_purpose",
      SCORE.smallmouthBottomFinesseLane,
    );
  }
  if (isSmallmouthNedFinesseLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_ned_finesse",
      SCORE.smallmouthNedFinesseLane,
    );
  }
  if (isSmallmouthTexasCrawLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_texas_craw",
      SCORE.smallmouthTexasCrawLane,
    );
  }
  if (isSmallmouthFinesseJigLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_finesse_jig",
      SCORE.smallmouthFinesseJigLane,
    );
  }
  if (isSmallmouthPaddleTailSearchLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_paddle_tail_search",
      SCORE.smallmouthPaddleTailSearchLane,
    );
  }
  if (isSmallmouthTubeJigAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_tube_jig_all_purpose",
      SCORE.smallmouthTubeJigAllPurposeLane,
    );
  }
  if (isSmallmouthBladeBaitColdReactionLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_blade_bait_cold_reaction",
      SCORE.smallmouthBladeBaitColdReactionLane,
    );
  }
  if (isSmallmouthGurglerSurfaceBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_gurgler_surface_big_fish",
      SCORE.smallmouthGurglerSurfaceBigFishLane,
    );
  }
  if (isSmallmouthCrawfishFlyBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_crawfish_fly_big_fish",
      SCORE.smallmouthCrawfishFlyBigFishLane,
    );
  }
  if (isSmallmouthPopperTargetBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_popper_target_big_fish",
      SCORE.smallmouthPopperTargetBigFishLane,
    );
  }
  if (isSmallmouthMouseBankBigFishLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:smallmouth_mouse_bank_big_fish",
      SCORE.smallmouthMouseBankBigFishLane,
    );
  }
  if (isPikeBucktailReactionLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_bucktail_reaction",
      SCORE.pikeBucktailReactionLane,
    );
  }
  if (isPikeSpinnerbaitCoverReactionLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_spinnerbait_cover_reaction",
      SCORE.pikeSpinnerbaitCoverReactionLane,
    );
  }
  if (isPikeJerkbaitPauseLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_jerkbait_pause",
      SCORE.pikeJerkbaitPauseLane,
    );
  }
  if (isPikeSpoonSearchLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_spoon_search",
      SCORE.pikeSpoonSearchLane,
    );
  }
  if (isPikeGlideAmbushLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_glide_ambush",
      SCORE.pikeGlideAmbushLane,
    );
  }
  if (isPikeTubeBottomLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_tube_bottom",
      SCORE.pikeTubeBottomLane,
    );
  }
  if (isPikeLargeSwimbaitLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_large_swimbait",
      SCORE.pikeLargeSwimbaitLane,
    );
  }
  if (isPikeFlyAlternativeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:pike_fly_alternative",
      SCORE.pikeFlyAlternativeLane,
    );
  }
  if (isPikeBladeBaitOffWindowSpecialist({ profile, scenario })) {
    score += addScore(
      reasons,
      "pike_blade_bait_off_window_specialist",
      SCORE.pikeBladeBaitOffWindowPenalty,
    );
  }
  if (isPikeHeavyPaddleTailOffWindow({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "pike_heavy_paddle_tail_off_window",
      SCORE.pikeHeavyPaddleTailOffWindowPenalty,
    );
  }
  if (isTroutNedRigOffWindow({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "trout_ned_rig_off_window",
      SCORE.troutNedRigOffWindowPenalty,
    );
  }
  if (
    scenario.species === "trout" &&
    scenario.recommendation_goal === "all_purpose" &&
    profile.id === "ned_rig"
  ) {
    score += addScore(
      reasons,
      "trout_ned_rig_all_purpose_restraint",
      SCORE.troutNedRigAllPurposeRestraint,
    );
  }
  if (isHeatSlowBottomAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:heat_slow_bottom_all_purpose",
      SCORE.heatSlowBottomLane,
    );
  }
  if (isTroutFinesseMinnowAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_finesse_minnow_all_purpose",
      SCORE.troutFinesseMinnowLane,
    );
  }
  if (isTroutSurfacePlugAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_surface_plug_all_purpose",
      SCORE.troutSurfacePlugAllPurposeLane,
    );
  }
  if (isTroutCastingSpoonAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_casting_spoon_all_purpose",
      SCORE.troutCastingSpoonAllPurposeLane,
    );
  }
  if (isTroutHairJigAllPurposeOffWindow({ profile, scenario })) {
    score += addScore(
      reasons,
      "trout_hair_jig_all_purpose_off_window",
      SCORE.troutHairJigAllPurposeOffWindowPenalty,
    );
  }
  if (isTroutDirtyCurrentLureAlternativeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_dirty_current_lure_alternative",
      SCORE.troutDirtyCurrentLureAlternativeLane,
    );
  }
  if (isTroutClassicFlyLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_classic_fly",
      SCORE.troutClassicFlyLane,
    );
  }
  if (isTroutCrawfishStreamerLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_crawfish_streamer",
      SCORE.troutCrawfishStreamerLane,
    );
  }
  if (isTroutRiverStreamerAlternativeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:trout_river_streamer_alternative",
      SCORE.troutRiverStreamerAlternativeLane,
    );
  }

  if (
    scenario.species === "trout" &&
    scenario.recommendation_goal === "all_purpose" &&
    profile.gear_mode === "fly"
  ) {
    const penalty = troutAllPurposeCrossoverFlyPenalty(profile);
    if (penalty !== 0) {
      score += addScore(
        reasons,
        "trout_all_purpose_crossover_fly",
        penalty,
      );
    }
  }
  if (isTroutHeatCrossoverFly({ profile, scenario })) {
    score += addScore(
      reasons,
      "trout_heat_crossover_fly",
      SCORE.troutHeatCrossoverFlyPenalty,
    );
  }

  if (profile.clarity_strengths.includes(scenario.water_clarity)) {
    score += addScore(
      reasons,
      `clarity_strength:${scenario.water_clarity}`,
      SCORE.clarityStrength,
    );
  }

  if (hasForage(profile, row.primary_forage)) {
    score += addScore(
      reasons,
      `primary_forage:${row.primary_forage}`,
      SCORE.primaryForage,
    );
  }
  if (hasForage(profile, row.secondary_forage)) {
    score += addScore(
      reasons,
      `secondary_forage:${row.secondary_forage}`,
      SCORE.secondaryForage,
    );
  }

  if (profile.column === row.column_baseline) {
    score += addScore(
      reasons,
      `baseline_column:${row.column_baseline}`,
      SCORE.baselineColumn,
    );
  }

  const paceMatch = paceMatchesBaseline(profile, row.pace_baseline);
  if (paceMatch === "primary") {
    score += addScore(
      reasons,
      `baseline_primary_pace:${row.pace_baseline}`,
      SCORE.baselinePrimaryPace,
    );
  } else if (paceMatch === "secondary") {
    score += addScore(
      reasons,
      `baseline_secondary_pace:${row.pace_baseline}`,
      SCORE.baselineSecondaryPace,
    );
  }

  if (profile.is_surface && scenario.surface_daily_gate === "caution") {
    score += addScore(
      reasons,
      "surface_daily_gate:caution",
      SCORE.surfaceCautionPenalty,
    );
  }

  if (isTroutDirtyCurrentMismatch({ profile, scenario })) {
    score += addScore(
      reasons,
      "trout_dirty_current_mismatch",
      SCORE.troutDirtyCurrentMismatchPenalty,
    );
  }
  if (isTroutHairJigDirtyCurrentMismatch({ profile, scenario })) {
    score += addScore(
      reasons,
      "trout_hair_jig_dirty_current_mismatch",
      SCORE.troutHairJigDirtyCurrentPenalty,
    );
  }

  return {
    profile,
    side,
    score,
    reasons,
  };
}
