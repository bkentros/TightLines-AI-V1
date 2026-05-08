import type { ArchetypeProfileV4, ConditionTag } from "../v4/contracts.ts";
import type { DailyScenario } from "./buildDailyScenario.ts";
import type { CandidateScore } from "./scoreCandidate.ts";
import type {
  DailyPicksEngineDiagnostics,
  DailyPicksEngineResult,
} from "./runDailyPicksEngine.ts";
import type { DailyPicksVariant } from "./selectDailyPicks.ts";

export const DAILY_PICKS_RESPONSE_FEATURE =
  "recommender_daily_picks_2x2_future" as const;
export const DAILY_PICKS_RESPONSE_VERSION =
  "daily_picks_2x2_response_v1" as const;

export type DailyPickSlot =
  | "lure_of_the_day"
  | "honorable_lure"
  | "fly_of_the_day"
  | "honorable_fly";

export type DailyPicksResponsePick = {
  slot: DailyPickSlot;
  id: string;
  display_name: string;
  gear_mode: ArchetypeProfileV4["gear_mode"];
  family_group: string;
  presentation_group: string;
  column: ArchetypeProfileV4["column"];
  primary_pace: ArchetypeProfileV4["primary_pace"];
  secondary_pace?: ArchetypeProfileV4["secondary_pace"];
  is_surface: boolean;
  score: number;
  score_reasons: readonly string[];
  why_chosen: string;
  how_to_fish: string;
};

export type DailyPicksScenarioSummary = {
  activity_level: DailyScenario["activity_level"];
  surface_daily_gate: DailyScenario["surface_daily_gate"];
  surface_daily_reason_codes: readonly string[];
  scenario_tags: readonly ConditionTag[];
  missing_inputs: readonly string[];
  confidence: DailyScenario["confidence"];
};

export type DailyPicksFutureResponse = {
  feature: typeof DAILY_PICKS_RESPONSE_FEATURE;
  engine_version: typeof DAILY_PICKS_RESPONSE_VERSION;
  species: DailyScenario["species"];
  context: DailyScenario["water_type"];
  water_type: DailyScenario["water_type"];
  water_clarity: DailyScenario["water_clarity"];
  recommendation_goal: DailyScenario["recommendation_goal"];
  local_date: string;
  region_key: DailyScenario["region_key"];
  month: DailyScenario["month"];
  scenario_summary: DailyPicksScenarioSummary;
  diagnostics: DailyPicksEngineDiagnostics;
  picks: Record<DailyPickSlot, DailyPicksResponsePick>;
};

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function howToFishVariant(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
  slot: DailyPickSlot;
  seed: string;
  variant: DailyPicksVariant;
}): string {
  const index = hashSeed([
    args.seed,
    args.scenario.local_date,
    args.slot,
    args.variant,
    args.profile.id,
  ].join("|")) % args.profile.how_to_fish_variants.length;
  return args.profile.how_to_fish_variants[index]!;
}

function humanizeToken(value: string): string {
  return value.replaceAll("_", " ");
}

function conditionTagLabel(tag: ConditionTag): string {
  switch (tag) {
    case "calm_surface":
      return "calm surface";
    case "low_light_surface":
      return "low-light surface";
    case "wind_reaction":
      return "wind reaction";
    case "dirty_vibration":
      return "stain or vibration";
    case "clear_subtle":
      return "clear-water subtle";
    case "cold_slow":
      return "cold or slow";
    case "warming_search":
      return "warming search";
    case "heat_finesse":
      return "heat finesse";
    case "runoff_streamer":
      return "runoff streamer";
    case "current_swing":
      return "current swing";
    case "cover_ambush":
      return "cover ambush";
    case "open_water_search":
      return "open-water search";
  }
}

function scoreReasonValue(reason: string, prefix: string): string | null {
  if (!reason.startsWith(prefix)) return null;
  const rest = reason.slice(prefix.length);
  const marker = rest.lastIndexOf(":");
  return marker === -1 ? rest : rest.slice(0, marker);
}

function firstGoalFit(
  score: CandidateScore,
  scenario: DailyScenario,
): string | null {
  for (const reason of score.reasons) {
    if (
      scenario.recommendation_goal === "all_purpose" &&
      reason === "goal:all_purpose:reliable_action:+18"
    ) {
      return "fits the all-purpose goal with reliable action";
    }
    if (
      scenario.recommendation_goal === "all_purpose" &&
      reason === "goal:all_purpose:versatile_search:+12"
    ) {
      return "fits the all-purpose goal as a versatile search option";
    }
    if (
      scenario.recommendation_goal === "big_fish" &&
      reason === "goal:big_fish:big_fish_upside:+20"
    ) {
      return "fits the big-fish goal with upside";
    }
    if (
      scenario.recommendation_goal === "big_fish" &&
      reason === "goal:big_fish:high_risk_high_reward:+12"
    ) {
      return "fits the big-fish goal as a higher-risk option";
    }
  }
  return null;
}

function scenarioTagFit(
  score: CandidateScore,
  scenario: DailyScenario,
): string | null {
  for (const reason of score.reasons) {
    const rawTag = scoreReasonValue(reason, "condition_tag:");
    if (rawTag == null) continue;
    const tag = rawTag as ConditionTag;
    if (scenario.scenario_tags.includes(tag)) {
      return `matches the ${conditionTagLabel(tag)} daily signal`;
    }
  }
  return null;
}

function forageFit(score: CandidateScore): string | null {
  for (const reason of score.reasons) {
    const primary = scoreReasonValue(reason, "primary_forage:");
    if (primary != null) {
      return `matches the primary ${humanizeToken(primary)} forage`;
    }
    const secondary = scoreReasonValue(reason, "secondary_forage:");
    if (secondary != null) {
      return `also fits the secondary ${humanizeToken(secondary)} forage`;
    }
  }
  return null;
}

function clarityFit(score: CandidateScore): string | null {
  for (const reason of score.reasons) {
    const clarity = scoreReasonValue(reason, "clarity_strength:");
    if (clarity != null) return `has a ${clarity}-water clarity fit`;
  }
  return null;
}

function uncertaintyNote(scenario: DailyScenario): string | null {
  if (scenario.confidence === "high" && scenario.missing_inputs.length === 0) {
    return null;
  }
  const missing = scenario.missing_inputs.length > 0
    ? ` because ${scenario.missing_inputs.map(humanizeToken).join(", ")} ${
      scenario.missing_inputs.length === 1 ? "is" : "are"
    } missing`
    : "";
  return `daily read has ${scenario.confidence} confidence${missing}`;
}

function surfaceNote(
  profile: ArchetypeProfileV4,
  scenario: DailyScenario,
  score: CandidateScore,
): string | null {
  if (!profile.is_surface) return null;
  if (
    scenario.surface_daily_gate === "caution" ||
    score.reasons.includes("surface_daily_gate:caution:-8")
  ) {
    return "surface is only a caution window today";
  }
  if (scenario.surface_daily_gate === "open") return "the surface gate is open";
  return null;
}

function compactSentence(parts: readonly string[]): string {
  const useful = parts.filter((part) => part.length > 0);
  if (useful.length === 0) return "Selected from the valid daily pool.";
  const sentence = useful.slice(0, 3).join("; ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function whyChosen(score: CandidateScore, scenario: DailyScenario): string {
  return compactSentence([
    uncertaintyNote(scenario) ?? "",
    firstGoalFit(score, scenario) ?? "",
    scenarioTagFit(score, scenario) ?? "",
    forageFit(score) ?? "",
    clarityFit(score) ?? "",
    surfaceNote(score.profile, scenario, score) ?? "",
  ]);
}

function shapePick(args: {
  slot: DailyPickSlot;
  score: CandidateScore;
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
}): DailyPicksResponsePick {
  const { profile } = args.score;
  return {
    slot: args.slot,
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: profile.gear_mode,
    family_group: profile.family_group,
    presentation_group: profile.presentation_group,
    column: profile.column,
    primary_pace: profile.primary_pace,
    secondary_pace: profile.secondary_pace,
    is_surface: profile.is_surface,
    score: args.score.score,
    score_reasons: args.score.reasons,
    why_chosen: whyChosen(args.score, args.scenario),
    how_to_fish: howToFishVariant({
      profile,
      scenario: args.scenario,
      slot: args.slot,
      seed: args.seed,
      variant: args.variant,
    }),
  };
}

export function shapeDailyPicksResponse(args: {
  result: DailyPicksEngineResult;
  seed: string;
}): DailyPicksFutureResponse {
  const variant = args.result.diagnostics.variant;
  const { scenario, selection } = args.result;

  return {
    feature: DAILY_PICKS_RESPONSE_FEATURE,
    engine_version: DAILY_PICKS_RESPONSE_VERSION,
    species: scenario.species,
    context: scenario.water_type,
    water_type: scenario.water_type,
    water_clarity: scenario.water_clarity,
    recommendation_goal: scenario.recommendation_goal,
    local_date: scenario.local_date,
    region_key: scenario.region_key,
    month: scenario.month,
    scenario_summary: {
      activity_level: scenario.activity_level,
      surface_daily_gate: scenario.surface_daily_gate,
      surface_daily_reason_codes: scenario.surface_daily_reason_codes,
      scenario_tags: scenario.scenario_tags,
      missing_inputs: scenario.missing_inputs,
      confidence: scenario.confidence,
    },
    diagnostics: args.result.diagnostics,
    picks: {
      lure_of_the_day: shapePick({
        slot: "lure_of_the_day",
        score: selection.lure_of_the_day,
        scenario,
        seed: args.seed,
        variant,
      }),
      honorable_lure: shapePick({
        slot: "honorable_lure",
        score: selection.honorable_lure,
        scenario,
        seed: args.seed,
        variant,
      }),
      fly_of_the_day: shapePick({
        slot: "fly_of_the_day",
        score: selection.fly_of_the_day,
        scenario,
        seed: args.seed,
        variant,
      }),
      honorable_fly: shapePick({
        slot: "honorable_fly",
        score: selection.honorable_fly,
        scenario,
        seed: args.seed,
        variant,
      }),
    },
  };
}
