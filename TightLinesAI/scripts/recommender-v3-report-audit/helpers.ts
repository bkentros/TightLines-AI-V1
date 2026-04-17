/**
 * Helpers for constructing RecommenderRequest objects from ReportAuditScenario
 * inputs, and small utilities used by the renderer and flag detectors.
 */

import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { ReportAuditScenario } from "./types.ts";
import { SPECIES_TO_LEGACY_GROUP } from "./types.ts";

export function buildRecommenderRequest(scenario: ReportAuditScenario): RecommenderRequest {
  return {
    location: {
      latitude: scenario.location.latitude,
      longitude: scenario.location.longitude,
      state_code: scenario.location.state_code,
      region_key: scenario.location.region_key,
      local_date: scenario.location.local_date,
      local_timezone: scenario.location.timezone,
      month: scenario.location.month,
    },
    species: SPECIES_TO_LEGACY_GROUP[scenario.species],
    context: scenario.context,
    water_clarity: scenario.water_clarity,
    env_data: scenario.environment as unknown as Record<string, unknown>,
  };
}

/** Build a smoothly-varying 5-reading pressure history ending at `current`. */
export function pressureTrend(current: number, ago24: number): number[] {
  const step = (current - ago24) / 4;
  return [
    Number(ago24.toFixed(2)),
    Number((ago24 + step).toFixed(2)),
    Number((ago24 + step * 2).toFixed(2)),
    Number((ago24 + step * 3).toFixed(2)),
    Number(current.toFixed(2)),
  ];
}

export function monthName(month: number): string {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month - 1]!;
}

/**
 * Short human label for a condition value. Used in report summaries.
 */
export function formatTemp(f: number | null | undefined): string {
  if (f == null) return "—";
  return `${Math.round(f)}°F`;
}

export function formatPressureMb(mb: number | null | undefined): string {
  if (mb == null) return "—";
  return `${mb.toFixed(1)} mb`;
}

export function formatPct(pct: number | null | undefined): string {
  if (pct == null) return "—";
  return `${Math.round(pct)}%`;
}

export function formatInches(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${v.toFixed(2)}″`;
}

export function classifyPressureTrend(history: readonly number[] | null | undefined): string {
  if (!history || history.length < 2) return "unknown";
  const first = history[0]!;
  const last = history[history.length - 1]!;
  const delta = last - first;
  if (delta >= 3) return "rising strongly";
  if (delta >= 1) return "rising";
  if (delta <= -3) return "falling strongly";
  if (delta <= -1) return "falling";
  return "stable";
}
