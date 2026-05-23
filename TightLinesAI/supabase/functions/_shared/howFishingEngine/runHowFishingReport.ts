import type {
  HowsFishingReport,
  SharedEngineRequest,
} from "./contracts/mod.ts";
import { DISPLAY_CONTEXT_LABEL } from "./contracts/mod.ts";
import { analyzeSharedConditions } from "./analyzeSharedConditions.ts";

/**
 * Same numeric score as `runHowFishingReport(req).score`.
 * Skips timing, tips, summary, and rich condition context — use for bulk / edge limits.
 */
export function runHowFishingScoreOnly(req: SharedEngineRequest): number {
  return analyzeSharedConditions(req).scored.score;
}
import {
  buildReportSummaryLine,
  type ReportSummaryInput,
} from "./summary/summaryLine.ts";
import { buildActionableTip } from "./tips/buildTips.ts";
import {
  buildDeterministicSolunarNote,
  buildDeterministicTimingInsight,
} from "./narration/polishSafeSurfaceCopy.ts";
import { buildFactorSurfaceLabel } from "./summary/factorSurfaceLabels.ts";
import type { ActiveVariableScore } from "./score/types.ts";

function reliabilityNote(tier: "high" | "medium" | "low"): string | null {
  if (tier === "high") return null;
  if (tier === "medium") {
    return "Today's outlook is still usable, but the read is a little broader than the cleanest cases.";
  }
  return "Today's read is broader than usual because some key inputs were limited.";
}

function toSummaryFactor(
  c: ActiveVariableScore,
  conditionContext: NonNullable<HowsFishingReport["condition_context"]>,
): ReportSummaryInput["drivers"][number] {
  const normVar = conditionContext.normalized_variable_scores.find((v) =>
    v.variable_key === c.key
  );
  return {
    variable: c.key,
    weightedContribution: c.weightedContribution,
    normalizedScore: c.score,
    engineLabel: normVar?.engine_label,
    temperatureBreakdown: normVar?.temperature_breakdown ?? null,
  };
}

export function runHowFishingReport(
  req: SharedEngineRequest,
): HowsFishingReport {
  const analysis = analyzeSharedConditions(req);
  const { norm, scored, timing, condition_context } = analysis;
  const reliability = norm.reliability;
  const limitedData = reliability !== "high" ||
    norm.missing_variables.length > 0 ||
    norm.data_gaps.length > 0;
  const copySeed = [
    req.context,
    req.region_key,
    req.local_date,
    `${req.latitude.toFixed(4)},${req.longitude.toFixed(4)}`,
    scored.band,
    String(scored.score),
    scored.drivers[0]?.key ?? "none",
    scored.suppressors[0]?.key ?? "none",
  ].join("|");
  // ── Tactical tip (no timing language) ──────────────────────────────────
  const tip = buildActionableTip(
    req.context,
    scored.drivers[0],
    scored.suppressors[0],
    norm.normalized,
    copySeed,
    {
      band: scored.band,
      limitedData,
      weatherSignals: {
        storm_risk_later_today: req.environment.storm_risk_later_today,
        rain_risk_later_today: req.environment.rain_risk_later_today,
        heavy_rain_later_today: req.environment.heavy_rain_later_today,
        storm_window_start_local_hour:
          req.environment.storm_window_start_local_hour,
        max_precip_probability_pct: req.environment.max_precip_probability_pct,
        active_precip_now: req.environment.active_precip_now,
        precip_rate_now_in_per_hr: req.environment.precip_rate_now_in_per_hr,
      },
    },
  );

  // ── Timing engine (parallel lane to scoring) ──────────────────────────
  const drivers: HowsFishingReport["drivers"] = scored.drivers.map((c) => ({
    variable: c.key,
    label: buildFactorSurfaceLabel(
      c.key,
      req.context,
      norm.normalized,
      "positive",
      `${copySeed}|driver|${c.key}`,
    ),
    effect: "positive" as const,
  }));
  const suppressors: HowsFishingReport["suppressors"] = scored.suppressors
    .map((c) => ({
      variable: c.key,
      label: buildFactorSurfaceLabel(
        c.key,
        req.context,
        norm.normalized,
        "negative",
        `${copySeed}|suppressor|${c.key}`,
      ),
      effect: "negative" as const,
    }));

  const summaryDrivers: ReportSummaryInput["drivers"] = scored.drivers.map((
    c,
  ) => toSummaryFactor(c, condition_context));
  const summarySuppressors: ReportSummaryInput["suppressors"] = scored
    .suppressors.map((c) => toSummaryFactor(c, condition_context));

  const baseReport: HowsFishingReport = {
    context: req.context,
    display_context_label: DISPLAY_CONTEXT_LABEL[req.context],
    location: {
      latitude: req.latitude,
      longitude: req.longitude,
      state_code: req.state_code,
      region_key: req.region_key,
      timezone: req.local_timezone,
      local_date: req.local_date,
    },
    score: scored.score,
    band: scored.band,
    summary_line: buildReportSummaryLine({
      band: scored.band,
      score: scored.score,
      context: req.context,
      reliability,
      limitedData,
      drivers: summaryDrivers,
      suppressors: summarySuppressors,
      seed: copySeed,
    }),
    drivers,
    suppressors,
    actionable_tip: tip.actionable_tip,
    actionable_tip_tag: tip.actionable_tip_tag,

    // ── Timing fields from the new timing engine ─────────────────────────
    daypart_note: timing.daypart_note,
    daypart_preset: timing.daypart_preset,
    timing_strength: timing.timing_strength,
    highlighted_periods: timing.highlighted_periods,
    timing_debug: {
      family_id: timing.trace.family_id,
      ...(timing.trace.family_id_secondary != null
        ? { family_id_secondary: timing.trace.family_id_secondary }
        : {}),
      ...(timing.trace.month_blend_t != null
        ? { month_blend_t: timing.trace.month_blend_t }
        : {}),
      anchor_driver: timing.anchor_driver,
      primary_driver: timing.trace.primary_driver,
      primary_qualified: timing.trace.primary_qualified,
      secondary_driver: timing.trace.secondary_driver,
      secondary_qualified: timing.trace.secondary_qualified,
      secondary_role: timing.trace.secondary_role,
      fallback_used: timing.fallback_used,
      selection_reason: timing.trace.selection_reason,
    },

    reliability,
    reliability_note: reliabilityNote(reliability),
    ...(req.data_coverage.source_notes?.length
      ? { data_coverage_notes: [...req.data_coverage.source_notes] }
      : {}),
    normalized_debug: {
      available_variables: norm.available_variables,
      missing_variables: norm.missing_variables,
      data_gaps: norm.data_gaps.map((g) => ({
        variable_key: g.variable_key,
        reason: g.reason,
      })),
    },
    condition_context: {
      ...condition_context,
    },
  };

  return {
    ...baseReport,
    timing_insight: buildDeterministicTimingInsight(baseReport),
    solunar_note: buildDeterministicSolunarNote(baseReport),
  };
}
