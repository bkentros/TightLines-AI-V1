import type {
  EngineContext,
  ScoredVariableKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";

type FactorEffect = "positive" | "negative";
type Norm = SharedNormalizedOutput["normalized"];

function scoreForKey(key: ScoredVariableKey, norm: Norm): number | null {
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

function temperatureLabel(norm: Norm, effect: FactorEffect): string {
  const temp = norm.temperature;
  if (!temp) return "Temperature is shaping the bite today.";

  if (effect === "positive") {
    return "Temperature is helping the bite.";
  }
  return "Temperature is limiting the bite.";
}

function pressureLabel(_norm: Norm, effect: FactorEffect): string {
  if (effect === "positive") {
    return "Pressure is helping the bite.";
  }
  return "Pressure is limiting the bite.";
}

function windLabel(_norm: Norm, effect: FactorEffect): string {
  if (effect === "positive") {
    return "Wind is helping the bite.";
  }
  return "Wind is limiting control.";
}

function lightLabel(_norm: Norm, effect: FactorEffect): string {
  if (effect === "positive") {
    return "Light and cloud cover are helping the bite.";
  }
  return "Light and cloud cover are limiting the bite.";
}

function precipLabel(_norm: Norm, effect: FactorEffect): string {
  if (effect === "positive") {
    return "Rain is not disrupting the bite.";
  }
  return "Rain is limiting the bite.";
}

function runoffLabel(_norm: Norm, effect: FactorEffect): string {
  if (effect === "positive") {
    return "Rain and runoff are helping the river read.";
  }
  return "Rain and runoff are limiting the river read.";
}

function tideLabel(
  context: EngineContext,
  _norm: Norm,
  effect: FactorEffect,
): string {
  if (effect === "positive") {
    if (isCoastalFamilyContext(context)) {
      return "Tide and current are helping the bite.";
    }
    return "Current is helping the bite.";
  }
  return isCoastalFamilyContext(context)
    ? "Tide and current are limiting the bite."
    : "Current is limiting the bite.";
}

export function buildFactorSurfaceLabel(
  key: ScoredVariableKey,
  context: EngineContext,
  norm: Norm,
  effect: FactorEffect,
): string {
  const score = scoreForKey(key, norm);
  const resolvedEffect: FactorEffect = score != null && score < 0
    ? "negative"
    : effect;

  switch (key) {
    case "temperature_condition":
      return temperatureLabel(norm, resolvedEffect);
    case "pressure_regime":
      return pressureLabel(norm, resolvedEffect);
    case "wind_condition":
      return windLabel(norm, resolvedEffect);
    case "light_cloud_condition":
      return lightLabel(norm, resolvedEffect);
    case "precipitation_disruption":
      return precipLabel(norm, resolvedEffect);
    case "runoff_flow_disruption":
      return runoffLabel(norm, resolvedEffect);
    case "tide_current_movement":
      return tideLabel(context, norm, resolvedEffect);
    default:
      return resolvedEffect === "positive"
        ? "This factor is helping the day."
        : "This factor is limiting the day.";
  }
}
