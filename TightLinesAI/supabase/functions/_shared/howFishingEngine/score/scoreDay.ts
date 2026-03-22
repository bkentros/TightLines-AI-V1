import type {
  EngineContext,
  ScoreBand,
  ScoredVariableKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import type { ActiveVariableScore } from "./types.ts";
import { computeActiveWeights } from "./reweight.ts";

function scoreForKey(
  key: ScoredVariableKey,
  norm: SharedNormalizedOutput["normalized"]
): number | null {
  switch (key) {
    case "temperature_condition":
      return norm.temperature?.final_score ?? null;
    case "pressure_regime":
      return norm.pressure_regime?.score ?? null;
    case "wind_condition":
      return norm.wind_condition?.score ?? null;
    case "light_cloud_condition":
      return norm.light_cloud_condition?.score ?? null;
    case "precipitation_disruption":
      return norm.precipitation_disruption?.score ?? null;
    case "runoff_flow_disruption":
      return norm.runoff_flow_disruption?.score ?? null;
    case "tide_current_movement":
      return norm.tide_current_movement?.score ?? null;
    default:
      return null;
  }
}

function temperatureDriverLabel(t: SharedNormalizedOutput["normalized"]["temperature"]): string {
  if (!t) return "";
  const band = t.band_label;
  const trend = t.trend_label;
  const score = t.final_score;

  if (score >= 2) {
    if (band === "warm") return "Temperatures are running above average — ideal conditions right now.";
    if (band === "optimal") return "Temperatures are sitting right in the sweet spot for this time of year.";
    return "Temperature is a strong positive today.";
  }
  if (score === 1) {
    if (band === "warm" || band === "optimal") return "Temperatures are favorable and working in your favor today.";
    if (band === "cool" && trend === "warming") return "Temps are cool but trending warmer — conditions are improving.";
    return "Temperature is a moderate positive today.";
  }
  if (score === 0) {
    if (band === "very_warm") return "It's hot — temperatures are well above seasonal norms.";
    return "Temperature is neutral — not helping or hurting.";
  }
  if (score === -1) {
    if (band === "cool") return "Temperatures are running below average — fish may be sluggish.";
    if (band === "very_warm") return "Heat is pushing temperatures past the productive range.";
    return "Temperature is a mild headwind today.";
  }
  // score === -2
  if (band === "very_cold") return "Temperatures are well below normal — tough conditions.";
  if (band === "very_warm") return "Extreme heat is suppressing activity.";
  return "Temperature is working against you today.";
}

function pressureDriverLabel(p: { label: string; score: number } | null | undefined): string {
  if (!p) return "";
  switch (p.label) {
    case "falling_slow": return "Barometric pressure is slowly dropping — that's the sweet spot for feeding activity.";
    case "falling_moderate": return "Pressure is falling steadily with a front pushing in — fish are likely feeding ahead of it.";
    case "falling_hard": return "Pressure is crashing fast — a strong front is moving through and fish are likely to shut down.";
    case "rising_slow": return "Pressure is gradually recovering after a front — conditions are stabilizing and fish are getting active again.";
    case "rising_fast": return "Pressure jumped up quickly — fish are still adjusting to the change.";
    case "volatile": return "Barometric pressure has been erratic and unstable — fish tend to shut down when it's bouncing around.";
    case "stable_neutral": return "Pressure is holding steady — no major influence either way.";
    default: return `Pressure regime: ${p.label.replace(/_/g, " ")}.`;
  }
}

function labelForDriver(key: ScoredVariableKey, norm: SharedNormalizedOutput["normalized"]): string {
  const t = norm.temperature;
  const p = norm.pressure_regime;
  const w = norm.wind_condition;
  const l = norm.light_cloud_condition;
  const pr = norm.precipitation_disruption;
  const r = norm.runoff_flow_disruption;
  const ti = norm.tide_current_movement;

  switch (key) {
    case "temperature_condition":
      return temperatureDriverLabel(t);
    case "pressure_regime":
      return pressureDriverLabel(p);
    case "wind_condition":
      if (!w) return "";
      if (w.score >= 1 && w.label === "light") return "Calm conditions — light wind makes for clean presentations and easy fishing.";
      if (w.score >= 1) return "Wind is light and manageable — good for working the water.";
      if (w.score === 0) return "Wind is moderate — not a major factor today.";
      if (w.score === -1) return "Wind is picking up — it'll push you around out there.";
      return "Strong winds are going to be a challenge today.";
    case "light_cloud_condition":
      if (!l) return "";
      if (l.score >= 1) return "Cloud cover is providing great low-light conditions.";
      if (l.score === 0) return "Light conditions are average — nothing special.";
      return "Bright, clear skies may push fish deeper or into cover.";
    case "precipitation_disruption":
      if (!pr) return "";
      if (pr.score >= 1) return "Dry, clean conditions — no precipitation to muddy things up.";
      if (pr.score === 0) return "Light precipitation isn't a major factor.";
      if (pr.score === -1) return "Recent rain is affecting water clarity and conditions.";
      return "Active precipitation is disrupting conditions right now.";
    case "runoff_flow_disruption":
      if (!r) return "";
      if (r.score >= 1) return "River flows are clean and at fishable levels.";
      if (r.score === 0) return "Flow conditions are moderate — workable.";
      return "Elevated runoff or high flows are making it tough.";
    case "tide_current_movement":
      if (!ti) return "";
      if (ti.score >= 1) return "Strong tidal movement today — that's what drives the bite.";
      if (ti.score === 0) return "Tidal movement is moderate — decent but not exceptional.";
      return "Weak tidal movement — the water isn't doing you many favors.";
    default:
      return "";
  }
}

export function bandFromScore(score0to100: number): ScoreBand {
  if (score0to100 >= 80) return "Excellent";
  if (score0to100 >= 60) return "Good";
  if (score0to100 >= 40) return "Fair";
  return "Poor";
}

export function scoreDay(norm: SharedNormalizedOutput): {
  score: number;
  band: ScoreBand;
  contributions: ActiveVariableScore[];
  drivers: ActiveVariableScore[];
  suppressors: ActiveVariableScore[];
} {
  const available = new Set(norm.available_variables);
  const weights = computeActiveWeights(
    norm.context,
    norm.location.region_key,
    norm.location.local_date,
    available
  );

  const contributions: ActiveVariableScore[] = [];
  for (const { key, finalWeight } of weights) {
    const vs = scoreForKey(key, norm.normalized);
    if (vs == null) continue;
    contributions.push({
      key,
      score: vs as -2 | -1 | 0 | 1 | 2,
      label: labelForDriver(key, norm.normalized),
      weight: finalWeight,
      weightedContribution: finalWeight * vs,
    });
  }

  const rawSum = contributions.reduce((a, c) => a + c.weightedContribution, 0);
  const score = Math.round(((rawSum + 200) / 400) * 100);
  const clamped = Math.max(0, Math.min(100, score));
  const band = bandFromScore(clamped);

  const pos = contributions
    .filter((c) => c.weightedContribution > 0)
    .sort((a, b) => b.weightedContribution - a.weightedContribution);
  const neg = contributions
    .filter((c) => c.weightedContribution < 0)
    .sort((a, b) => a.weightedContribution - b.weightedContribution);

  const baseOrder = (k: ScoredVariableKey) =>
    weights.find((w) => w.key === k)?.base ?? 0;

  const tieBreak = (a: ActiveVariableScore, b: ActiveVariableScore) =>
    baseOrder(b.key) - baseOrder(a.key);

  pos.sort((a, b) =>
    b.weightedContribution !== a.weightedContribution
      ? b.weightedContribution - a.weightedContribution
      : tieBreak(a, b)
  );
  neg.sort((a, b) =>
    a.weightedContribution !== b.weightedContribution
      ? a.weightedContribution - b.weightedContribution
      : tieBreak(a, b)
  );

  return {
    score: clamped,
    band,
    contributions,
    drivers: pos.slice(0, 2),
    suppressors: neg.slice(0, 2),
  };
}
