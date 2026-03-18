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
      return t
        ? `Air temperature reads ${t.band_label.replace(/_/g, " ")} for this place and season.`
        : "";
    case "pressure_regime":
      return p ? `Pressure regime: ${p.label.replace(/_/g, " ")}.` : "";
    case "wind_condition":
      return w ? `Wind is ${w.label} (${w.detail ?? ""}).`.trim() : "";
    case "light_cloud_condition":
      return l ? `Light/cloud: ${l.label.replace(/_/g, " ")}.` : "";
    case "precipitation_disruption":
      return pr ? `Precipitation picture: ${pr.label.replace(/_/g, " ")}.` : "";
    case "runoff_flow_disruption":
      return r ? `River runoff proxy: ${r.label.replace(/_/g, " ")}.` : "";
    case "tide_current_movement":
      return ti ? `Tide/current movement: ${ti.label.replace(/_/g, " ")}.` : "";
    default:
      return "";
  }
}

export function bandFromScore(score0to100: number): ScoreBand {
  if (score0to100 >= 75) return "Excellent";
  if (score0to100 >= 58) return "Good";
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
