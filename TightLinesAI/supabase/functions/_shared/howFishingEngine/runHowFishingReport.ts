import type { HowsFishingReport, RegionKey, SharedEngineRequest } from "./contracts/mod.ts";
import { DISPLAY_CONTEXT_LABEL } from "./contracts/mod.ts";
import { buildSharedNormalizedOutput } from "./normalize/buildNormalized.ts";
import { scoreDay } from "./score/scoreDay.ts";
import { buildActionableTip } from "./tips/buildTips.ts";
import { resolveTimingResult } from "./timing/resolveTimingResult.ts";

function sentenceCap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function bandSentence(band: string): string {
  switch (band) {
    case "Excellent": return "It's an excellent day to be on the water.";
    case "Good": return "Conditions are looking good out there today.";
    case "Fair": return "It's a fair day — fishable, but not all factors are lined up.";
    case "Poor": return "Tough conditions today — it's going to take patience and persistence.";
    default: return `Today's outlook: ${band}.`;
  }
}

function summaryLine(
  band: string,
  drivers: { label: string }[],
  suppressors: { label: string }[]
): string {
  const d0 = drivers[0]?.label ?? "";
  const s0 = suppressors[0]?.label ?? "";
  let core = bandSentence(band);
  if (d0) core += ` ${d0}`;
  if (s0) core += ` ${sentenceCap(s0)}`;
  return core.replace(/\s+/g, " ").trim().slice(0, 280);
}

function reliabilityNote(tier: "high" | "medium" | "low"): string | null {
  if (tier === "high") return null;
  if (tier === "medium") {
    return "Today's outlook is still usable, but one or two inputs were limited.";
  }
  return "Today's report is broader than usual because some key inputs were limited.";
}

export function runHowFishingReport(req: SharedEngineRequest): HowsFishingReport {
  const norm = buildSharedNormalizedOutput(req);
  const reliability = norm.reliability;

  const scored = scoreDay(norm);

  // ── Tactical tip (no timing language) ──────────────────────────────────
  const tip = buildActionableTip(
    req.context,
    scored.drivers[0],
    scored.suppressors[0],
    norm.normalized,
  );

  // ── Timing engine (parallel lane to scoring) ──────────────────────────
  const month = parseInt(req.local_date.slice(5, 7), 10) || 1;
  const timing = resolveTimingResult(
    req.context,
    req.region_key as RegionKey,
    month,
    norm,
    {
      local_date: req.local_date,
      tide_high_low: req.environment.tide_high_low,
      solunar_peak_local: req.environment.solunar_peak_local,
      sunrise_local: req.environment.sunrise_local,
      sunset_local: req.environment.sunset_local,
      cloud_cover_pct: req.environment.cloud_cover_pct,
      daily_mean_air_temp_f:
        req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f,
      prior_day_mean_air_temp_f: req.environment.prior_day_mean_air_temp_f,
      hourly_air_temp_f: req.environment.hourly_air_temp_f,
      hourly_cloud_cover_pct: req.environment.hourly_cloud_cover_pct,
    },
  );

  const drivers = scored.drivers.map((c) => ({
    variable: c.key,
    label: c.label || c.key,
    effect: "positive" as const,
  }));
  const suppressors = scored.suppressors.map((c) => ({
    variable: c.key,
    label: c.label || c.key,
    effect: "negative" as const,
  }));

  return {
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
    summary_line: summaryLine(scored.band, drivers, suppressors),
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
    // Full normalized context forwarded to the LLM so it never has to infer
    // fish behavior from raw air temp + season alone.
    condition_context: {
      temperature_band: norm.normalized.temperature?.band_label ?? "optimal",
      temperature_trend: norm.normalized.temperature?.trend_label ?? "stable",
      temperature_shock: norm.normalized.temperature?.shock_label ?? "none",
      pressure_detail: norm.normalized.pressure_regime?.detail ?? null,
      wind_detail: norm.normalized.wind_condition?.detail ?? null,
      tide_detail: norm.normalized.tide_current_movement?.detail ?? null,
      region_key: norm.location.region_key,
      available_variables: norm.available_variables,
      missing_variables: norm.missing_variables,
    },
  };
}
