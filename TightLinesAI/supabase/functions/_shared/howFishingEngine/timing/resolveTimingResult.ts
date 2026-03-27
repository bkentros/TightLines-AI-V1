/**
 * Timing engine orchestrator — the decision flow.
 *
 * 1. If reliability is low → no timing edge
 * 2. Resolve timing family from (context, region, month) — freshwater also
 *    **blends adjacent calendar months** using the local date so handoffs
 *    smooth day-to-day and across month boundaries.
 * 3. Evaluate primary driver → if qualifies, optionally modified by secondary
 * 4. If primary fails → evaluate secondary as anchor
 * 5. If both fail → use combo-specific fallback bias
 * 6. Map to legacy DaypartNotePreset for backward compatibility
 * 7. Build full TimingResult with trace metadata
 */

import type {
  DaypartNotePreset,
  EngineContext,
  RegionKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import type {
  DaypartFlags,
  TimingDriverId,
  TimingEvalOptions,
  TimingFamilyConfig,
  TimingResult,
  TimingSignal,
  TimingSignalRole,
  TimingStrength,
} from "./timingTypes.ts";
import { resolveTimingFamily, seasonFromMonth, climateZoneFromRegion } from "./timingFamilies.ts";
import {
  evaluateTideWindow,
  evaluateTemperatureWindow,
  evaluateLightWindow,
  evaluateSolunarWindow,
  evaluateFallbackBias,
} from "./evaluators/mod.ts";
import { pickTimingNote, synthesizeDaypartNoteForPeriods } from "./timingNotes.ts";
import { adjacentMonthsBlend, collapsePeriodsToMaxTwo } from "./timingMonthBlend.ts";
import { reconcileHeatStressTiming } from "./reconcileHeatStressTiming.ts";

// ── Driver dispatch ──────────────────────────────────────────────────────────

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
    case "low_light_geometry":
      return evaluateLightWindow("low_light_geometry", norm, opts);
    case "cloud_extended_low_light":
      return evaluateLightWindow("cloud_extended_low_light", norm, opts);
    case "solunar_minor":
      return evaluateSolunarWindow(norm, opts);
    case "neutral_fallback":
      return null;
  }
}

function escalateStrength(s: TimingStrength): TimingStrength {
  switch (s) {
    case "fair_default": return "good";
    case "good": return "strong";
    case "strong": return "very_strong";
    case "very_strong": return "very_strong";
  }
}

function capStrength(s: TimingStrength, cap: TimingStrength): TimingStrength {
  const order: TimingStrength[] = ["fair_default", "good", "strong", "very_strong"];
  const sIdx = order.indexOf(s);
  const cIdx = order.indexOf(cap);
  return sIdx <= cIdx ? s : cap;
}

function determineSecondaryRole(
  primary: DaypartFlags,
  secondary: DaypartFlags,
): TimingSignalRole {
  let overlapCount = 0;
  let primaryCount = 0;
  let secondaryCount = 0;

  for (let i = 0; i < 4; i++) {
    if (primary[i]) primaryCount++;
    if (secondary[i]) secondaryCount++;
    if (primary[i] && secondary[i]) overlapCount++;
  }

  if (overlapCount === 0) return "score_only";
  if (overlapCount === primaryCount) return "confirmer";
  if (secondaryCount > primaryCount && overlapCount > 0) return "widener";
  return "confirmer";
}

function mergePeriods(a: DaypartFlags, b: DaypartFlags): DaypartFlags {
  return [a[0] || b[0], a[1] || b[1], a[2] || b[2], a[3] || b[3]];
}

function mapToLegacyPreset(periods: DaypartFlags): DaypartNotePreset {
  const key = periods.map((v) => (v ? "1" : "0")).join("");
  switch (key) {
    case "1001": return "early_late_low_light";
    case "1010": return "moving_water_periods"; // dawn + afternoon (tide / shoulder)
    case "1011": return "moving_water_periods"; // dawn + afternoon + evening
    case "1110": return "moving_water_periods"; // dawn + morning + afternoon
    case "0111": return "moving_water_periods"; // morning + afternoon + evening
    case "0010": return "warmest_part_may_help";
    case "1101": return "cooler_low_light_better";
    case "1111": return "moving_water_periods";
    case "0110": return "warmest_part_may_help";
    case "0101": return "early_late_low_light";
    case "1100": return "early_late_low_light";
    case "0000": return "no_timing_edge";
    case "0011": return "warmest_part_may_help"; // afternoon + evening warmth window
    case "0001": return "warmest_part_may_help"; // evening-only peak / spike
    case "0100": return "warmest_part_may_help"; // morning warmth peak
    case "1000": return "early_late_low_light"; // dawn-only geometry
    default: return "no_timing_edge";
  }
}

const STRENGTH_ORDER: TimingStrength[] = ["fair_default", "good", "strong", "very_strong"];

function compareStrength(a: TimingStrength, b: TimingStrength): number {
  return STRENGTH_ORDER.indexOf(a) - STRENGTH_ORDER.indexOf(b);
}

function blendTimingStrength(a: TimingStrength, b: TimingStrength, st: number): TimingStrength {
  const ia = STRENGTH_ORDER.indexOf(a);
  const ib = STRENGTH_ORDER.indexOf(b);
  const ic = Math.round((1 - st) * ia + st * ib);
  return STRENGTH_ORDER[Math.max(0, Math.min(STRENGTH_ORDER.length - 1, ic))]!;
}

function blendDaypartWeighted(a: DaypartFlags, b: DaypartFlags, st: number): DaypartFlags {
  return [
    (1 - st) * (a[0] ? 1 : 0) + st * (b[0] ? 1 : 0) >= 0.5,
    (1 - st) * (a[1] ? 1 : 0) + st * (b[1] ? 1 : 0) >= 0.5,
    (1 - st) * (a[2] ? 1 : 0) + st * (b[2] ? 1 : 0) >= 0.5,
    (1 - st) * (a[3] ? 1 : 0) + st * (b[3] ? 1 : 0) >= 0.5,
  ];
}

function pickWinnerByStrength(ra: TimingResult, rb: TimingResult, st: number): TimingResult {
  const cmp = compareStrength(ra.timing_strength, rb.timing_strength);
  if (cmp > 0) return ra;
  if (cmp < 0) return rb;
  return st < 0.5 ? ra : rb;
}

function blendTwoTimingResults(
  ra: TimingResult,
  rb: TimingResult,
  st: number,
  calendarMonth: number,
  zone: string,
  season: string,
  context: EngineContext,
  region: RegionKey,
): TimingResult {
  let periods = blendDaypartWeighted(ra.highlighted_periods, rb.highlighted_periods, st);
  if (!periods.some(Boolean)) {
    periods = collapsePeriodsToMaxTwo(mergePeriods(ra.highlighted_periods, rb.highlighted_periods));
  } else {
    periods = collapsePeriodsToMaxTwo(periods);
  }

  const strength = blendTimingStrength(ra.timing_strength, rb.timing_strength, st);
  const winner = pickWinnerByStrength(ra, rb, st);
  const daypartPreset = mapToLegacyPreset(periods);
  // Periods are blended from both months; the strength winner’s note can describe a different
  // window (e.g. afternoon warmth) while tiles show morning — always align copy to final flags.
  const daypartNote = synthesizeDaypartNoteForPeriods(periods);

  return {
    anchor_driver: winner.anchor_driver,
    timing_strength: strength,
    highlighted_periods: periods,
    daypart_preset: daypartPreset,
    daypart_note: daypartNote,
    fallback_used: ra.fallback_used || rb.fallback_used,
    trace: {
      family_id: `${ra.trace.family_id}~${rb.trace.family_id}`,
      family_id_secondary: rb.trace.family_id,
      month_blend_t: st,
      context,
      region,
      month: calendarMonth,
      climate_zone: zone,
      season,
      primary_driver: winner.trace.primary_driver,
      primary_qualified: winner.trace.primary_qualified,
      primary_signal: winner.trace.primary_signal,
      secondary_driver: winner.trace.secondary_driver,
      secondary_qualified: winner.trace.secondary_qualified,
      secondary_signal: winner.trace.secondary_signal,
      secondary_role: winner.trace.secondary_role,
      fallback_bias: winner.trace.fallback_bias,
      fallback_used: ra.fallback_used || rb.fallback_used,
      selection_reason:
        `Blended (${(1 - st).toFixed(2)}×${ra.trace.family_id} + ${st.toFixed(2)}×${rb.trace.family_id}). ` +
        `Tiles merged from both families; daypart note synthesized from final flags. ` +
        `Trace winner (${winner === ra ? "earlier" : "later"} month): ${winner.trace.selection_reason}`,
    },
  };
}

// ── Single-family resolution ───────────────────────────────────────────────────

function computeTimingForFamily(
  context: EngineContext,
  region: RegionKey,
  calendarMonth: number,
  zone: string,
  season: string,
  family: TimingFamilyConfig,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingResult {
  const primarySignal = runEvaluator(family.primary_driver, norm, opts);
  const primaryQualified = primarySignal !== null;

  let anchorSignal: TimingSignal;
  let anchorStrength: TimingStrength;
  let secondarySignal: TimingSignal | null = null;
  let secondaryQualified = false;
  let secondaryRole: TimingSignalRole = "not_applicable";
  let fallbackUsed = false;
  let selectionReason: string;

  if (primaryQualified) {
    anchorSignal = primarySignal!;
    anchorStrength = anchorSignal.strength;

    secondarySignal = runEvaluator(family.secondary_driver, norm, opts);
    secondaryQualified = secondarySignal !== null;

    if (secondaryQualified) {
      secondaryRole = determineSecondaryRole(
        anchorSignal.periods,
        secondarySignal!.periods,
      );
      secondarySignal = { ...secondarySignal!, role: secondaryRole };

      // Guard: On very_cold days with seek_warmth as anchor, secondary must only
      // confirm (escalate strength) — never widen (add dawn/morning cold periods).
      // Cloud_extended otherwise OR-merges dawn/morning into an afternoon window,
      // recommending the coldest part of the day.
      if (
        primarySignal!.driver_id === "seek_warmth" &&
        norm?.normalized?.temperature?.band_label === "very_cold" &&
        secondaryRole === "widener"
      ) {
        secondaryRole = "confirmer";
        secondarySignal = { ...secondarySignal!, role: secondaryRole };
      }

      if (secondaryRole === "confirmer") {
        anchorStrength = escalateStrength(anchorStrength);
        selectionReason =
          `Primary (${family.primary_driver}) qualifies; secondary (${family.secondary_driver}) ` +
          `confirms — strength escalated to ${anchorStrength}.`;
      } else if (secondaryRole === "widener") {
        anchorSignal = {
          ...anchorSignal,
          periods: mergePeriods(anchorSignal.periods, secondarySignal!.periods),
        };
        selectionReason =
          `Primary (${family.primary_driver}) qualifies; secondary (${family.secondary_driver}) ` +
          `widens the window.`;
      } else {
        selectionReason =
          `Primary (${family.primary_driver}) qualifies; secondary (${family.secondary_driver}) ` +
          `does not align (role=${secondaryRole}) — primary stands alone.`;
      }
    } else {
      selectionReason =
        `Primary (${family.primary_driver}) qualifies; secondary (${family.secondary_driver}) ` +
        `does not qualify — primary stands alone.`;
    }
  } else {
    secondarySignal = runEvaluator(family.secondary_driver, norm, opts);
    secondaryQualified = secondarySignal !== null;

    if (secondaryQualified) {
      anchorSignal = secondarySignal!;
      anchorSignal = { ...anchorSignal, role: "anchor" };
      anchorStrength = capStrength(anchorSignal.strength, "good");
      secondaryRole = "anchor";
      selectionReason =
        `Primary (${family.primary_driver}) does not qualify; secondary ` +
        `(${family.secondary_driver}) rescues as anchor (capped at ${anchorStrength}).`;
    } else {
      // e.g. March "warm winter" family: seek_warmth misses on a freak-hot day and
      // low_light can fail on harsh glare — combo fallback "morning_afternoon" would
      // wrongly praise midday. Prefer avoid_heat when the temp model says so.
      const heatAvoid = runEvaluator("avoid_heat", norm, opts);
      if (heatAvoid) {
        anchorSignal = { ...heatAvoid, role: "anchor" };
        anchorStrength = capStrength(heatAvoid.strength, "strong");
        secondaryRole = "anchor";
        fallbackUsed = false;
        selectionReason =
          `Neither primary (${family.primary_driver}) nor secondary (${family.secondary_driver}) ` +
          `qualified; avoid_heat overrides combo fallback for warm-day dawn/dusk timing.`;
      } else {
        anchorSignal = evaluateFallbackBias(family.fallback_bias);
        anchorStrength = "fair_default";
        fallbackUsed = true;
        selectionReason =
          `Neither primary (${family.primary_driver}) nor secondary ` +
          `(${family.secondary_driver}) qualifies — using fallback bias (${family.fallback_bias}).`;
      }
    }
  }

  const highlightedPeriods = anchorSignal.periods;
  const daypartPreset = mapToLegacyPreset(highlightedPeriods);

  let daypartNote: string;
  if (anchorSignal.note_pool_key === "tide_exchange_specific" && anchorSignal.exchange_times) {
    daypartNote = buildTideExchangeNoteFromSignal(anchorSignal.exchange_times);
  } else if (secondaryRole === "widener") {
    // Widener OR’s in extra buckets; the anchor’s note_pool_key still describes the primary shape only.
    daypartNote = synthesizeDaypartNoteForPeriods(highlightedPeriods);
  } else {
    daypartNote = pickTimingNote(anchorSignal.note_pool_key);
  }

  return buildResult({
    anchor_driver: anchorSignal.driver_id,
    timing_strength: anchorStrength,
    highlighted_periods: highlightedPeriods,
    daypart_preset: daypartPreset,
    daypart_note: daypartNote,
    fallback_used: fallbackUsed,
    trace: {
      family_id: family.family_id,
      family_id_secondary: null,
      month_blend_t: null,
      context,
      region,
      month: calendarMonth,
      climate_zone: zone,
      season,
      primary_driver: family.primary_driver,
      primary_qualified: primaryQualified,
      primary_signal: primarySignal ?? null,
      secondary_driver: family.secondary_driver,
      secondary_qualified: secondaryQualified,
      secondary_signal: secondarySignal ?? null,
      secondary_role: secondaryRole,
      fallback_bias: family.fallback_bias,
      fallback_used: fallbackUsed,
      selection_reason: selectionReason,
    },
  });
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function resolveTimingResult(
  context: EngineContext,
  region: RegionKey,
  month: number,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingResult {
  const reliability = norm.reliability;

  if (reliability === "low") {
    const note = pickTimingNote("no_timing_low_reliability");
    const zone = climateZoneFromRegion(region as RegionKey);
    return buildResult({
      anchor_driver: "neutral_fallback",
      timing_strength: "fair_default",
      highlighted_periods: [false, false, false, false],
      daypart_preset: "no_timing_edge",
      daypart_note: note,
      fallback_used: true,
      trace: {
        family_id: "n/a",
        family_id_secondary: null,
        month_blend_t: null,
        context,
        region,
        month,
        climate_zone: zone,
        season: seasonFromMonth(month),
        primary_driver: "neutral_fallback",
        primary_qualified: false,
        primary_signal: null,
        secondary_driver: "neutral_fallback",
        secondary_qualified: false,
        secondary_signal: null,
        secondary_role: "not_applicable",
        fallback_bias: "all_day",
        fallback_used: true,
        selection_reason: "Reliability is low — suppressing timing recommendation.",
      },
    });
  }

  const zone = climateZoneFromRegion(region as RegionKey);
  const season = seasonFromMonth(month);

  let result: TimingResult;

  if (isCoastalFamilyContext(context)) {
    const family = resolveTimingFamily(context, region as RegionKey, month);
    result = computeTimingForFamily(
      context,
      region as RegionKey,
      month,
      zone,
      season,
      family,
      norm,
      opts,
    );
  } else {
    const blend = opts.local_date ? adjacentMonthsBlend(opts.local_date) : null;

    if (!blend) {
      const family = resolveTimingFamily(context, region as RegionKey, month);
      result = computeTimingForFamily(
        context,
        region as RegionKey,
        month,
        zone,
        season,
        family,
        norm,
        opts,
      );
    } else {
      const fa = resolveTimingFamily(context, region as RegionKey, blend.loMonth);
      const fb = resolveTimingFamily(context, region as RegionKey, blend.hiMonth);

      if (fa.family_id === fb.family_id) {
        result = computeTimingForFamily(
          context,
          region as RegionKey,
          month,
          zone,
          season,
          fa,
          norm,
          opts,
        );
      } else {
        const EPS = 1e-4;
        if (blend.t < EPS) {
          result = computeTimingForFamily(
            context,
            region as RegionKey,
            month,
            zone,
            season,
            fa,
            norm,
            opts,
          );
        } else if (blend.t > 1 - EPS) {
          result = computeTimingForFamily(
            context,
            region as RegionKey,
            month,
            zone,
            season,
            fb,
            norm,
            opts,
          );
        } else {
          const ra = computeTimingForFamily(
            context,
            region as RegionKey,
            month,
            zone,
            season,
            fa,
            norm,
            opts,
          );
          const rb = computeTimingForFamily(
            context,
            region as RegionKey,
            month,
            zone,
            season,
            fb,
            norm,
            opts,
          );
          result = blendTwoTimingResults(ra, rb, blend.t, month, zone, season, context, region as RegionKey);
        }
      }
    }
  }

  return reconcileHeatStressTiming(context, norm, opts, result).result;
}

function buildResult(r: TimingResult): TimingResult {
  return r;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function buildTideExchangeNoteFromSignal(exchangeTimes: string[]): string {
  if (exchangeTimes.length === 1) {
    return pick([
      `Tide exchange ${exchangeTimes[0]} — work the 90 minutes before and after that turn, that's your window.`,
      `The tide turns ${exchangeTimes[0]}. Get positioned ahead of it and fish the moving water hard on both sides.`,
      `Best bite centers on ${exchangeTimes[0]} when the tide shifts. Don't miss that moving-water window.`,
    ]);
  }
  if (exchangeTimes.length === 2) {
    return pick([
      `Two exchange windows today — ${exchangeTimes[0]} and ${exchangeTimes[1]}. Fish the movement on each side and ease off during the slack between them.`,
      `Tide turns ${exchangeTimes[0]} and ${exchangeTimes[1]}. Those are your two best windows — get in position before each one and fish the moving water hard.`,
      `Best opportunities near ${exchangeTimes[0]} and ${exchangeTimes[1]} around the tide changes. The transition windows are the bite; slack in between is the slow stretch.`,
    ]);
  }
  if (exchangeTimes.length === 3) {
    const [a, b, c] = exchangeTimes;
    return pick([
      `Three key tide turns — ${a}, ${b}, and ${c}. Fish the highlighted windows hard on each side of those exchanges.`,
      `Moving-water windows ${a}, ${b}, and ${c}. Work those clock bands — each tide change is its own bite opportunity.`,
    ]);
  }
  if (exchangeTimes.length >= 4) {
    const [a, b, c, d] = exchangeTimes;
    return pick([
      `Four exchanges today — key turns ${a}, ${b}, ${c}, and ${d}. Rotate with the tide; each highlighted band lines up with a real exchange.`,
      `Active tide cycle: ${a}, ${b}, ${c}, and ${d}. The lit time blocks match those turns — fish the movement, rest the slack.`,
    ]);
  }
  return pick([
    `Multiple exchanges today — key windows ${exchangeTimes.join(" and ")}. Fish the moving water around each turn and ease off during the slack.`,
    `Tides are active today. Target those exchange windows — moving water is your trigger, slack is your rest.`,
  ]);
}
