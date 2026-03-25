/**
 * Deterministic driver/suppressor lines — one canonical string per engine state.
 * No randomness: same normalized input always yields the same label (for LLM + UI).
 */

import type { ScoredVariableKey, SharedNormalizedOutput } from "../contracts/mod.ts";

type Norm = SharedNormalizedOutput["normalized"];

function wordsFromSnake(s: string): string {
  return s.replace(/_/g, " ");
}

function withOptionalDetail(base: string, detail?: string | null): string {
  const d = typeof detail === "string" ? detail.trim() : "";
  return d ? `${base} — ${d}` : base;
}

function variableStateLine(title: string, state: { label: string; score: number; detail?: string }): string {
  return withOptionalDetail(
    `${title}: ${wordsFromSnake(state.label)} (engine score ${state.score})`,
    state.detail,
  );
}

function temperatureDriverLabel(t: NonNullable<Norm["temperature"]>): string {
  return [
    "Temperature:",
    `${wordsFromSnake(t.band_label)} band`,
    `${wordsFromSnake(t.trend_label)} trend`,
    `${wordsFromSnake(t.shock_label)} shock`,
    `band score ${t.band_score}`,
    `trend adj ${t.trend_adjustment}`,
    `shock adj ${t.shock_adjustment}`,
    `final score ${t.final_score}`,
  ].join(" ");
}

export function labelForDriver(key: ScoredVariableKey, norm: Norm): string {
  const t = norm.temperature;
  const p = norm.pressure_regime;
  const w = norm.wind_condition;
  const l = norm.light_cloud_condition;
  const pr = norm.precipitation_disruption;
  const r = norm.runoff_flow_disruption;
  const ti = norm.tide_current_movement;

  switch (key) {
    case "temperature_condition":
      return t ? temperatureDriverLabel(t) : "";
    case "pressure_regime":
      return p ? variableStateLine("Barometric pressure", p) : "";
    case "wind_condition":
      return w ? variableStateLine("Wind", w) : "";
    case "light_cloud_condition":
      return l ? variableStateLine("Cloud cover / light", l) : "";
    case "precipitation_disruption":
      return pr ? variableStateLine("Precipitation / hydrology", pr) : "";
    case "runoff_flow_disruption":
      return r ? variableStateLine("River flow / runoff", r) : "";
    case "tide_current_movement":
      return ti ? variableStateLine("Tide / current movement", ti) : "";
    default:
      return "";
  }
}
