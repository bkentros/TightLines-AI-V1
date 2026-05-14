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

  const score = temp.final_score;
  const warming = temp.trend_label === "warming" ||
    temp.shock_label === "sharp_warmup";
  const cooling = temp.trend_label === "cooling" ||
    temp.shock_label === "sharp_cooldown";
  const coldSide = temp.measurement_value_f <= 50 ||
    temp.band_label === "cool" ||
    temp.band_label === "very_cold";
  const hotSide = temp.measurement_value_f >= 78 ||
    temp.band_label === "warm" ||
    temp.band_label === "very_warm";

  if (effect === "positive") {
    if (coldSide && warming) {
      return "Cold water is improving as the day warms.";
    }
    if (hotSide && score > 0) {
      return "Warmth is helping activity without becoming stressful.";
    }
    if (cooling && score > 0) {
      return "The recent temperature shift is settling into a better range.";
    }
    return "Temperature is in a strong seasonal range.";
  }

  if (hotSide) {
    return "Heat is narrowing the most comfortable fishing windows.";
  }
  if (coldSide) {
    return warming
      ? "Cold water is still limiting the early part of the day."
      : "Cold water is keeping fish more selective.";
  }
  if (cooling) {
    return "A quick cooldown is tightening the bite window.";
  }
  if (warming) {
    return "A fast warmup is making the bite less settled.";
  }
  return "Temperature is just off the better seasonal range.";
}

function pressureLabel(norm: Norm, effect: FactorEffect): string {
  const label = norm.pressure_regime?.label ?? "";
  if (effect === "positive") {
    if (label === "falling_slow") {
      return "Soft falling pressure is giving the bite a push.";
    }
    if (label === "falling_moderate") {
      return "A clean pressure drop is adding feeding momentum.";
    }
    if (label === "rising_slow" || label === "recently_stabilizing") {
      return "Settling pressure is helping fish get back into rhythm.";
    }
    return "Pressure is steady enough to let other factors work.";
  }
  if (label === "volatile") {
    return "Swinging pressure is shortening the reliable windows.";
  }
  if (label === "rising_fast") {
    return "Fast-rising pressure is making fish more selective.";
  }
  if (label === "falling_hard") {
    return "A sharp pressure drop is making the window less stable.";
  }
  return "Pressure is working against a clean read.";
}

function windLabel(norm: Norm, effect: FactorEffect): string {
  const speed = norm.wind_condition?.score ?? 0;
  if (effect === "positive") {
    if (speed > 1.1) {
      return "Useful breeze adds ripple without hurting control.";
    }
    return "Manageable wind is helping the water read cleanly.";
  }
  if (speed <= -1.4) {
    return "Hard wind is making control and clean reads difficult.";
  }
  return "Strong wind is making control and clean reads harder.";
}

function lightLabel(norm: Norm, effect: FactorEffect): string {
  const label = norm.light_cloud_condition?.label ?? "";
  if (effect === "positive") {
    if (/overcast|cloud/i.test(label)) {
      return "Cloud cover is extending comfortable light.";
    }
    return "The light level is giving fish a more comfortable window.";
  }
  if (/clear|bright|glare/i.test(label)) {
    return "Bright, clear conditions are limiting low-light comfort.";
  }
  return "The light pattern is making the best window narrower.";
}

function precipLabel(norm: Norm, effect: FactorEffect): string {
  const label = norm.precipitation_disruption?.label ?? "";
  if (effect === "positive") {
    if (/dry/i.test(label)) {
      return "Dry weather keeps visibility and comfort steady.";
    }
    return "Rain is light enough to avoid disrupting the read.";
  }
  if (/active|heavy/i.test(label)) {
    return "Active rain is disrupting the most reliable window.";
  }
  if (/recent|wet/i.test(label)) {
    return "Recent rain is still making the read less clean.";
  }
  return "Rain is adding uncertainty to the day.";
}

function runoffLabel(norm: Norm, effect: FactorEffect): string {
  const label = norm.runoff_flow_disruption?.label ?? "";
  if (effect === "positive") {
    return "Stable flow keeps river holding water predictable.";
  }
  if (/blown|high|saturated/i.test(label)) {
    return "Runoff is making river holding water less predictable.";
  }
  return "Flow changes are making the river read less clean.";
}

function tideLabel(
  context: EngineContext,
  norm: Norm,
  effect: FactorEffect,
): string {
  const label = norm.tide_current_movement?.label ?? "";
  if (effect === "positive") {
    if (isCoastalFamilyContext(context)) {
      return "Tide movement gives fish a real feeding clock.";
    }
    return "Current is helping define better holding water.";
  }
  if (/slack/i.test(label)) {
    return "Slack water is taking away the strongest feeding clock.";
  }
  if (/hard|strong/i.test(label)) {
    return "Too much current is making the window harder to use.";
  }
  return isCoastalFamilyContext(context)
    ? "Tide and current are not setting up cleanly."
    : "Current is making the water harder to read.";
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
