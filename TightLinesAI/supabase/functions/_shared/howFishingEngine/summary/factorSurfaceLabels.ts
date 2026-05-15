import type {
  EngineContext,
  ScoredVariableKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { pickDeterministic } from "../copy/deterministicPick.ts";

type FactorEffect = "positive" | "negative";
type Norm = SharedNormalizedOutput["normalized"];
type LabelBank = Record<FactorEffect, readonly string[]>;

const TEMPERATURE_LABELS: LabelBank = {
  positive: [
    "Air temperatures line up well for this time of year.",
    "Air temperatures are in a favorable seasonal range today.",
    "The air-temperature read is on your side for this date.",
    "Temps are matching the season well enough to help the read.",
  ],
  negative: [
    "Air temperatures are not lining up as well for this time of year.",
    "Air temperatures sit outside the better seasonal range today.",
    "The temperature read is working against the setup a bit.",
    "Temps are less aligned with the season than you would like.",
  ],
};

const PRESSURE_LABELS: LabelBank = {
  positive: [
    "Pressure is helping the bite.",
    "Pressure is in your favor today.",
    "The pressure trend is giving the day some support.",
    "Pressure is adding a useful nudge to the read.",
  ],
  negative: [
    "Pressure is limiting the bite.",
    "Pressure is working against the read today.",
    "The pressure pattern is making the setup tougher.",
    "Pressure is one of the conditions to respect today.",
  ],
};

const WIND_LABELS: LabelBank = {
  positive: [
    "Wind is helping the bite.",
    "Wind is giving the day some useful cover.",
    "Wind is working in your favor today.",
    "The wind setup is adding support to the read.",
  ],
  negative: [
    "Wind is limiting control.",
    "Wind is making clean decisions harder today.",
    "Wind is the condition most likely to complicate the plan.",
    "The wind setup asks for a more controlled approach.",
  ],
};

const LIGHT_LABELS: LabelBank = {
  positive: [
    "Light and cloud cover are helping the bite.",
    "Light and cloud cover are in your favor today.",
    "The sky setup is giving you a useful light advantage.",
    "Cloud cover and light are on your side today.",
  ],
  negative: [
    "Light and cloud cover are limiting the bite.",
    "The light setup is working against the read today.",
    "Light and cloud cover are making the window narrower.",
    "The sky setup asks for more careful timing today.",
  ],
};

const PRECIP_LABELS: LabelBank = {
  positive: [
    "Rain is not disrupting the bite.",
    "Rain is staying out of the way today.",
    "Recent rain is not adding much disruption to the read.",
    "The rain signal is quiet enough to help keep the setup cleaner.",
  ],
  negative: [
    "Rain is limiting the bite.",
    "Rain is adding disruption to the read today.",
    "Recent rain is making the setup less predictable.",
    "The rain signal is one of the day’s bigger complications.",
  ],
};

const RUNOFF_LABELS: LabelBank = {
  positive: [
    "Rain and runoff are helping the river read.",
    "Rain and runoff are staying manageable for the river today.",
    "The river’s rain/runoff signal is in a workable place.",
    "Rain and runoff are giving the river a cleaner read today.",
  ],
  negative: [
    "Rain and runoff are limiting the river read.",
    "Rain and runoff are making the river setup tougher.",
    "The river’s rain/runoff signal is working against you today.",
    "Runoff is adding uncertainty to the river read.",
  ],
};

const COASTAL_TIDE_LABELS: LabelBank = {
  positive: [
    "Tide and current are helping the bite.",
    "Tide and current are in your favor today.",
    "Water movement is giving the coastal read a useful edge.",
    "The tide/current setup is adding support today.",
  ],
  negative: [
    "Tide and current are limiting the bite.",
    "Tide and current are not giving you much help today.",
    "The water-movement setup is making the coastal read narrower.",
    "Tide and current are working against the best window today.",
  ],
};

const CURRENT_LABELS: LabelBank = {
  positive: [
    "Current is helping the bite.",
    "Current is working in your favor today.",
    "Moving water is giving the read some support.",
    "The current setup is adding a useful edge today.",
  ],
  negative: [
    "Current is limiting the bite.",
    "Current is not giving the setup much help today.",
    "The current picture is making the read tougher.",
    "Moving water is not lining up as well today.",
  ],
};

const FALLBACK_LABELS: LabelBank = {
  positive: [
    "This factor is helping the day.",
    "This condition is working in your favor.",
    "This signal is adding support to the read.",
    "This part of the setup is helping today.",
  ],
  negative: [
    "This factor is limiting the day.",
    "This condition is working against the read.",
    "This signal is narrowing the setup today.",
    "This part of the setup needs extra respect.",
  ],
};

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

function pickLabel(
  bank: LabelBank,
  effect: FactorEffect,
  seed: string,
  salt: string,
): string {
  return pickDeterministic(bank[effect], seed, salt);
}

function temperatureLabel(
  norm: Norm,
  effect: FactorEffect,
  seed: string,
): string {
  const temp = norm.temperature;
  if (!temp) return "Air temperatures are part of today's read.";
  return pickLabel(TEMPERATURE_LABELS, effect, seed, "factor:temperature");
}

function pressureLabel(
  _norm: Norm,
  effect: FactorEffect,
  seed: string,
): string {
  return pickLabel(PRESSURE_LABELS, effect, seed, "factor:pressure");
}

function windLabel(_norm: Norm, effect: FactorEffect, seed: string): string {
  return pickLabel(WIND_LABELS, effect, seed, "factor:wind");
}

function lightLabel(_norm: Norm, effect: FactorEffect, seed: string): string {
  return pickLabel(LIGHT_LABELS, effect, seed, "factor:light");
}

function precipLabel(_norm: Norm, effect: FactorEffect, seed: string): string {
  return pickLabel(PRECIP_LABELS, effect, seed, "factor:precip");
}

function runoffLabel(_norm: Norm, effect: FactorEffect, seed: string): string {
  return pickLabel(RUNOFF_LABELS, effect, seed, "factor:runoff");
}

function tideLabel(
  context: EngineContext,
  _norm: Norm,
  effect: FactorEffect,
  seed: string,
): string {
  return isCoastalFamilyContext(context)
    ? pickLabel(COASTAL_TIDE_LABELS, effect, seed, "factor:tide-current")
    : pickLabel(CURRENT_LABELS, effect, seed, "factor:current");
}

export function buildFactorSurfaceLabel(
  key: ScoredVariableKey,
  context: EngineContext,
  norm: Norm,
  effect: FactorEffect,
  seed = `${context}|${key}|${effect}`,
): string {
  const score = scoreForKey(key, norm);
  const resolvedEffect: FactorEffect = score != null && score < 0
    ? "negative"
    : effect;

  switch (key) {
    case "temperature_condition":
      return temperatureLabel(norm, resolvedEffect, seed);
    case "pressure_regime":
      return pressureLabel(norm, resolvedEffect, seed);
    case "wind_condition":
      return windLabel(norm, resolvedEffect, seed);
    case "light_cloud_condition":
      return lightLabel(norm, resolvedEffect, seed);
    case "precipitation_disruption":
      return precipLabel(norm, resolvedEffect, seed);
    case "runoff_flow_disruption":
      return runoffLabel(norm, resolvedEffect, seed);
    case "tide_current_movement":
      return tideLabel(context, norm, resolvedEffect, seed);
    default:
      return pickLabel(
        FALLBACK_LABELS,
        resolvedEffect,
        seed,
        "factor:fallback",
      );
  }
}
