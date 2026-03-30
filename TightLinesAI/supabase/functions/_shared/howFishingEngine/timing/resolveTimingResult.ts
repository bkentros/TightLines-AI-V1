/**
 * Timing engine orchestrator — single-anchor timing design.
 *
 * For each region × context × month combo:
 * 1. Resolve one anchor timing profile
 * 2. Evaluate that anchor only
 * 3. If the anchor produces a real window, use it
 * 4. Otherwise fall back to the combo's feeding-bias window
 * 5. Apply final heat-stress guardrails
 */

import type {
  DaypartNotePreset,
  EngineContext,
  RegionKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import type {
  DaypartFlags,
  TimingDriverId,
  TimingEvalOptions,
  TimingFamilyConfig,
  TimingResult,
  TimingSignal,
  TimingStrength,
} from "./timingTypes.ts";
import { resolveTimingFamily, seasonFromMonth, climateZoneFromRegion } from "./timingFamilies.ts";
import {
  evaluateTideWindow,
  evaluateTemperatureWindow,
  evaluatePreferredLightWindow,
  evaluateFallbackBias,
} from "./evaluators/mod.ts";
import { pickTimingNote } from "./timingNotes.ts";
import { reconcileHeatStressTiming } from "./reconcileHeatStressTiming.ts";
import { pickDeterministic } from "../copy/deterministicPick.ts";

function runEvaluator(
  driverId: TimingDriverId,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  switch (driverId) {
    case "tide_exchange_window":
      return evaluateTideWindow(norm, opts);
    case "seek_warmth":
      return evaluateTemperatureWindow("seek_warmth", norm, opts);
    case "avoid_heat":
      return evaluateTemperatureWindow("avoid_heat", norm, opts);
    case "light_window":
      return evaluatePreferredLightWindow(norm, opts);
    case "low_light_geometry":
    case "cloud_extended_low_light":
    case "solunar_minor":
    case "neutral_fallback":
      return null;
  }
}

function mapToLegacyPreset(periods: DaypartFlags): DaypartNotePreset {
  const key = periods.map((v) => (v ? "1" : "0")).join("");
  switch (key) {
    case "1001": return "early_late_low_light";
    case "1010": return "moving_water_periods";
    case "1011": return "moving_water_periods";
    case "1110": return "moving_water_periods";
    case "0111": return "moving_water_periods";
    case "0010": return "warmest_part_may_help";
    case "1101": return "cooler_low_light_better";
    case "1111": return "moving_water_periods";
    case "0110": return "warmest_part_may_help";
    case "0101": return "early_late_low_light";
    case "1100": return "early_late_low_light";
    case "0000": return "no_timing_edge";
    case "0011": return "warmest_part_may_help";
    case "0001": return "warmest_part_may_help";
    case "0100": return "warmest_part_may_help";
    case "1000": return "early_late_low_light";
    default: return "no_timing_edge";
  }
}

function buildTimingNote(signal: TimingSignal): string {
  const periodsKey = signal.periods.map((v) => (v ? "1" : "0")).join("");
  const seedBase = [
    signal.driver_id,
    signal.note_pool_key,
    periodsKey,
    ...(signal.exchange_times ?? []),
  ].join("|");
  if (signal.note_pool_key === "tide_exchange_specific" && signal.exchange_times?.length) {
    return buildTideExchangeNoteFromSignal(signal.exchange_times, seedBase);
  }
  return pickTimingNote(signal.note_pool_key, seedBase);
}

function computeTimingForProfile(
  context: EngineContext,
  region: RegionKey,
  month: number,
  zone: string,
  season: string,
  profile: TimingFamilyConfig,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingResult {
  const anchorSignal = runEvaluator(profile.anchor_driver, norm, opts);
  const anchorQualified = anchorSignal !== null;

  let signal: TimingSignal;
  let strength: TimingStrength;
  let fallbackUsed: boolean;
  let selectionReason: string;

  if (anchorSignal) {
    signal = anchorSignal;
    strength = anchorSignal.strength;
    fallbackUsed = false;
    selectionReason = `Anchor (${profile.anchor_driver}) produced a distinct timing window for this combo.`;
  } else {
    signal = evaluateFallbackBias(profile.fallback_bias);
    strength = "fair_default";
    fallbackUsed = true;
    selectionReason =
      `Anchor (${profile.anchor_driver}) did not produce a distinct timing window — using fallback bias (${profile.fallback_bias}).`;
  }

  return {
    anchor_driver: signal.driver_id,
    timing_strength: strength,
    highlighted_periods: signal.periods,
    daypart_preset: mapToLegacyPreset(signal.periods),
    daypart_note: buildTimingNote(signal),
    fallback_used: fallbackUsed,
    trace: {
      family_id: profile.family_id,
      family_id_secondary: null,
      month_blend_t: null,
      context,
      region,
      month,
      climate_zone: zone,
      season,
      primary_driver: profile.anchor_driver,
      primary_qualified: anchorQualified,
      primary_signal: anchorSignal,
      secondary_driver: "neutral_fallback",
      secondary_qualified: false,
      secondary_signal: null,
      secondary_role: "not_applicable",
      fallback_bias: profile.fallback_bias,
      fallback_used: fallbackUsed,
      selection_reason: selectionReason,
    },
  };
}

export function resolveTimingResult(
  context: EngineContext,
  region: RegionKey,
  month: number,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingResult {
  const zone = climateZoneFromRegion(region as RegionKey);
  const season = seasonFromMonth(month);
  const profile = resolveTimingFamily(context, region as RegionKey, month);

  const result = computeTimingForProfile(
    context,
    region as RegionKey,
    month,
    zone,
    season,
    profile,
    norm,
    opts,
  );

  return reconcileHeatStressTiming(context, norm, opts, result).result;
}

function buildTideExchangeNoteFromSignal(exchangeTimes: string[], seedBase: string): string {
  if (exchangeTimes.length === 1) {
    return pickDeterministic([
      `Tide exchange ${exchangeTimes[0]} — work the 90 minutes before and after that turn, that's your window.`,
      `The tide turns ${exchangeTimes[0]}. Get positioned ahead of it and fish the moving water hard on both sides.`,
      `Best bite centers on ${exchangeTimes[0]} when the tide shifts. Don't miss that moving-water window.`,
    ], seedBase, "tide_exchange_single");
  }
  if (exchangeTimes.length === 2) {
    return pickDeterministic([
      `Two exchange windows today — ${exchangeTimes[0]} and ${exchangeTimes[1]}. Fish the movement on each side and ease off during the slack between them.`,
      `Tide turns ${exchangeTimes[0]} and ${exchangeTimes[1]}. Those are your two best windows — get in position before each one and fish the moving water hard.`,
      `Best opportunities near ${exchangeTimes[0]} and ${exchangeTimes[1]} around the tide changes. The transition windows are the bite; slack in between is the slow stretch.`,
    ], seedBase, "tide_exchange_double");
  }
  if (exchangeTimes.length === 3) {
    const [a, b, c] = exchangeTimes;
    return pickDeterministic([
      `Three key tide turns — ${a}, ${b}, and ${c}. Fish the highlighted windows hard on each side of those exchanges.`,
      `Moving-water windows ${a}, ${b}, and ${c}. Work those clock bands — each tide change is its own bite opportunity.`,
    ], seedBase, "tide_exchange_triple");
  }
  if (exchangeTimes.length >= 4) {
    const [a, b, c, d] = exchangeTimes;
    return pickDeterministic([
      `Four exchanges today — key turns ${a}, ${b}, ${c}, and ${d}. Rotate with the tide; each highlighted band lines up with a real exchange.`,
      `Active tide cycle: ${a}, ${b}, ${c}, and ${d}. The lit time blocks match those turns — fish the movement, rest the slack.`,
    ], seedBase, "tide_exchange_quad");
  }
  return pickDeterministic([
    `Multiple exchanges today — key windows ${exchangeTimes.join(" and ")}. Fish the moving water around each turn and ease off during the slack.`,
    `Tides are active today. Target those exchange windows — moving water is your trigger, slack is your rest.`,
  ], seedBase, "tide_exchange_multi");
}
