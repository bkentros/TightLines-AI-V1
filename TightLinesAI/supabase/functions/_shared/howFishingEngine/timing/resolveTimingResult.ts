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
import {
  climateZoneFromRegion,
  resolveTimingFamily,
  seasonFromMonth,
} from "./timingFamilies.ts";
import {
  evaluateFallbackBias,
  evaluatePreferredLightWindow,
  evaluateTemperatureWindow,
  evaluateTideWindow,
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
    case "1001":
      return "early_late_low_light";
    case "1010":
      return "moving_water_periods";
    case "1011":
      return "moving_water_periods";
    case "1110":
      return "moving_water_periods";
    case "0111":
      return "moving_water_periods";
    case "0010":
      return "warmest_part_may_help";
    case "1101":
      return "cooler_low_light_better";
    case "1111":
      return "moving_water_periods";
    case "0110":
      return "warmest_part_may_help";
    case "0101":
      return "early_late_low_light";
    case "1100":
      return "early_late_low_light";
    case "0000":
      return "no_timing_edge";
    case "0011":
      return "warmest_part_may_help";
    case "0001":
      return "warmest_part_may_help";
    case "0100":
      return "warmest_part_may_help";
    case "1000":
      return "early_late_low_light";
    default:
      return "no_timing_edge";
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
  if (
    signal.note_pool_key === "tide_exchange_specific" &&
    signal.exchange_times?.length
  ) {
    return buildTideExchangeNoteFromSignal(signal.exchange_times, seedBase);
  }
  return pickTimingNote(signal.note_pool_key, seedBase);
}

function isShapedLightSignal(
  signal: TimingSignal | null,
): signal is TimingSignal {
  if (!signal) return false;
  const highlighted = signal.periods.filter(Boolean).length;
  return highlighted >= 1 &&
    highlighted <= 2 &&
    signal.note_pool_key !== "cloud_all_day";
}

function isMiddayOnlySignal(signal: TimingSignal | null): boolean {
  return signal?.periods[0] === false &&
    signal.periods[1] === false &&
    signal.periods[2] === true &&
    signal.periods[3] === false;
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
  const heatSignal = runEvaluator("avoid_heat", norm, opts);
  const warmthSignal = runEvaluator("seek_warmth", norm, opts);
  const tideSignal = runEvaluator("tide_exchange_window", norm, opts);
  const lightSignal = runEvaluator("light_window", norm, opts);
  const shapedLightSignal = isShapedLightSignal(lightSignal)
    ? lightSignal
    : null;

  let signal: TimingSignal | null = anchorSignal;
  let strength: TimingStrength;
  let fallbackUsed: boolean;
  let selectionReason: string;
  let secondaryDriver: TimingDriverId = "neutral_fallback";
  let secondarySignal: TimingSignal | null = null;

  selectionReason =
    `priority_ladder considered: primary=${profile.anchor_driver}; heat=${
      heatSignal ? "yes" : "no"
    }; warmth=${warmthSignal ? "yes" : "no"}; shaped_light=${
      shapedLightSignal ? "yes" : "no"
    }; tide=${tideSignal ? "yes" : "no"}. `;

  if (signal?.driver_id === "light_window" && !isShapedLightSignal(signal)) {
    selectionReason +=
      "rejected primary light_window because it was broad/all-day. ";
    signal = null;
  }

  if (context === "coastal") {
    if (tideSignal) {
      signal = tideSignal;
      selectionReason += heatSignal && isMiddayOnlySignal(tideSignal)
        ? "coastal tide_heat_conflict_policy kept real tide anchor with heat caution. "
        : "coastal ladder selected real same-day tide clock. ";
    } else if (heatSignal) {
      signal = heatSignal;
      secondaryDriver = "avoid_heat";
      secondarySignal = heatSignal;
      selectionReason +=
        "coastal ladder selected avoid_heat because no usable tide clock qualified. ";
    } else if (!signal) {
      signal = evaluateFallbackBias(profile.fallback_bias);
      selectionReason +=
        `coastal ladder fell back; no tide/heat signal qualified (${profile.fallback_bias}). `;
    }
  } else if (context === "coastal_flats_estuary") {
    if (tideSignal) {
      signal = tideSignal;
      selectionReason += heatSignal && isMiddayOnlySignal(tideSignal)
        ? "flats tide_heat_conflict_policy kept real tide anchor with heat caution. "
        : "flats ladder selected real same-day tide clock. ";
    } else if (heatSignal) {
      signal = heatSignal;
      secondaryDriver = "avoid_heat";
      secondarySignal = heatSignal;
      selectionReason +=
        "flats ladder selected avoid_heat because no usable tide clock qualified. ";
    } else if (warmthSignal) {
      signal = warmthSignal;
      secondaryDriver = "seek_warmth";
      secondarySignal = warmthSignal;
      selectionReason +=
        "flats ladder selected seek_warmth because no usable tide/heat signal qualified. ";
    } else if (shapedLightSignal) {
      signal = shapedLightSignal;
      secondaryDriver = "light_window";
      secondarySignal = shapedLightSignal;
      selectionReason += "flats ladder selected shaped light_window. ";
    } else if (!signal) {
      signal = evaluateFallbackBias(profile.fallback_bias);
      selectionReason +=
        `flats ladder fell back; no qualifying priority signal (${profile.fallback_bias}). `;
    }
  } else {
    if (heatSignal) {
      signal = heatSignal;
      secondaryDriver = "avoid_heat";
      secondarySignal = heatSignal;
      selectionReason += anchorSignal && anchorSignal.driver_id !== "avoid_heat"
        ? `freshwater heat_priority_attribution superseded ${anchorSignal.driver_id}. `
        : "freshwater ladder selected avoid_heat. ";
    } else if (warmthSignal) {
      signal = warmthSignal;
      secondaryDriver = "seek_warmth";
      secondarySignal = warmthSignal;
      selectionReason += "freshwater ladder selected seek_warmth. ";
    } else if (shapedLightSignal) {
      signal = shapedLightSignal;
      secondaryDriver = "light_window";
      secondarySignal = shapedLightSignal;
      selectionReason += "freshwater ladder selected shaped light_window. ";
    } else if (!signal) {
      signal = evaluateFallbackBias(profile.fallback_bias);
      selectionReason +=
        `freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal (${profile.fallback_bias}). `;
    }
  }

  if (!signal) {
    signal = evaluateFallbackBias(profile.fallback_bias);
    selectionReason += `defensive fallback (${profile.fallback_bias}). `;
  }

  fallbackUsed = signal.driver_id === "neutral_fallback";
  strength = fallbackUsed ? "fair_default" : signal.strength;

  if (signal.driver_id === profile.anchor_driver || fallbackUsed) {
    secondaryDriver = "neutral_fallback";
    secondarySignal = null;
  } else {
    secondaryDriver = signal.driver_id;
    secondarySignal = signal;
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
      secondary_driver: secondaryDriver,
      secondary_qualified: secondarySignal !== null,
      secondary_signal: secondarySignal,
      secondary_role: secondarySignal ? "anchor" : "not_applicable",
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

function buildTideExchangeNoteFromSignal(
  exchangeTimes: string[],
  seedBase: string,
): string {
  if (exchangeTimes.length === 1) {
    return pickDeterministic(
      [
        `Tide exchange ${
          exchangeTimes[0]
        } — work the 90 minutes before and after that turn, that's your window.`,
        `The tide turns ${
          exchangeTimes[0]
        }. Get positioned ahead of it and fish the moving water hard on both sides.`,
        `Best bite centers on ${
          exchangeTimes[0]
        } when the tide shifts. Don't miss that moving-water window.`,
      ],
      seedBase,
      "tide_exchange_single",
    );
  }
  if (exchangeTimes.length === 2) {
    return pickDeterministic(
      [
        `Two exchange windows today — ${exchangeTimes[0]} and ${
          exchangeTimes[1]
        }. Fish the movement on each side and ease off during the slack between them.`,
        `Tide turns ${exchangeTimes[0]} and ${
          exchangeTimes[1]
        }. Those are your two best windows — get in position before each one and fish the moving water hard.`,
        `Best opportunities near ${exchangeTimes[0]} and ${
          exchangeTimes[1]
        } around the tide changes. Fish the moving water there; slack in between is slower.`,
      ],
      seedBase,
      "tide_exchange_double",
    );
  }
  if (exchangeTimes.length === 3) {
    const [a, b, c] = exchangeTimes;
    return pickDeterministic(
      [
        `Three key tide turns — ${a}, ${b}, and ${c}. Fish the highlighted windows hard on each side of those exchanges.`,
        `Moving-water windows ${a}, ${b}, and ${c}. Fish those turns first; each exchange can open a bite window.`,
      ],
      seedBase,
      "tide_exchange_triple",
    );
  }
  if (exchangeTimes.length >= 4) {
    const [a, b, c, d] = exchangeTimes;
    return pickDeterministic(
      [
        `Four exchanges today — key turns ${a}, ${b}, ${c}, and ${d}. Rotate with the tide; each highlighted band lines up with a real turn.`,
        `Active tide cycle: ${a}, ${b}, ${c}, and ${d}. Fish the movement and ease off during slack.`,
      ],
      seedBase,
      "tide_exchange_quad",
    );
  }
  return pickDeterministic(
    [
      `Multiple exchanges today — key windows ${
        exchangeTimes.join(" and ")
      }. Fish the moving water around each turn and ease off during the slack.`,
      `Tides are active today. Target those exchange windows — moving water is your trigger, slack is your rest.`,
    ],
    seedBase,
    "tide_exchange_multi",
  );
}
