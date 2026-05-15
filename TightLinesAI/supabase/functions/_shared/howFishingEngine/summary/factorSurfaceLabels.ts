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
    "Air temperatures are matching the season well enough to help the read.",
    "Temperatures are in a good seasonal range today.",
    "The temperature pattern for this date is giving the read support.",
    "The seasonal temperature check looks supportive today.",
    "Air temperatures are one of the more helpful signals today.",
  ],
  negative: [
    "Air temperatures are not lining up as well for this time of year.",
    "Air temperatures sit outside the better seasonal range today.",
    "The temperature read is giving the setup less support.",
    "Air temperatures are less aligned with the season than you would like.",
    "Temperatures are outside the more helpful seasonal range today.",
    "The temperature pattern for this date is giving the read less support.",
    "Temperature is one seasonal condition to respect today.",
    "The seasonal temperature check is not as supportive today.",
  ],
};

const PRESSURE_LABELS: LabelBank = {
  positive: [
    "Pressure is helping the bite.",
    "Pressure is in your favor today.",
    "The pressure trend is giving the day some support.",
    "Pressure is adding a useful nudge to the read.",
    "Pressure is on the helpful side today.",
    "The pressure read is leaning favorable.",
    "Pressure is supporting the overall setup.",
    "The pressure pattern is one of the better signals today.",
  ],
  negative: [
    "Pressure is giving the read less support today.",
    "Pressure is one of the conditions to respect today.",
    "The pressure pattern is narrowing the margin.",
    "The pressure read is leaning less favorable.",
    "Pressure is asking for a more conservative plan.",
    "Pressure is making the read a little tighter.",
    "The pressure signal is not helping as much today.",
  ],
};

const WIND_LABELS: LabelBank = {
  positive: [
    "Wind is helping the bite.",
    "Wind is giving the day some useful cover.",
    "Wind is working in your favor today.",
    "The wind setup is adding support to the read.",
    "Wind is helping you today.",
    "Wind is in your favor today.",
    "Wind is adding enough movement to help the read.",
    "The wind read is a helpful part of the setup.",
  ],
  negative: [
    "Wind is making control more important today.",
    "Wind is not offering as much help today.",
    "Wind is one of the conditions to respect today.",
    "The wind setup asks for a more controlled approach.",
    "The wind setup is narrowing the margin.",
    "Wind is asking for cleaner angles today.",
    "The wind read is making the plan more selective.",
    "Wind is making exposed water less efficient.",
  ],
};

const LIGHT_LABELS: LabelBank = {
  positive: [
    "Light and cloud cover are helping the bite.",
    "Light and cloud cover are in your favor today.",
    "The sky setup is giving you a useful light advantage.",
    "Cloud cover and light are on your side today.",
    "Clouds are helping you out today.",
    "Cloud cover is in your favor today.",
    "The light read is giving the day support.",
    "The sky read is helping the plan.",
  ],
  negative: [
    "Light and cloud cover are giving the read less support today.",
    "The light setup is asking for better timing today.",
    "Light and cloud cover are making the window narrower.",
    "The sky setup asks for more careful timing today.",
    "Light conditions are making the plan more selective.",
    "The sky setup is one of the day's cautions.",
    "Cloud cover is not giving you as much help today.",
    "The light read is narrowing the margin.",
  ],
};

const PRECIP_LABELS: LabelBank = {
  positive: [
    "Rain is not disrupting the bite.",
    "Rain is staying out of the way today.",
    "Recent rain is not adding much disruption to the read.",
    "The rain signal is quiet enough to help keep the setup cleaner.",
    "Rain is not complicating the read much today.",
    "The rain signal is staying manageable.",
    "Recent rain is giving the setup a cleaner read.",
    "Rain is leaving the main plan fairly clean.",
  ],
  negative: [
    "Rain is adding disruption to the read today.",
    "Recent rain is making the setup less predictable.",
    "The rain signal is one of the day’s bigger complications.",
    "Rain is making water choice more important today.",
    "Recent rain is narrowing the margin today.",
    "The rain signal is asking for a more selective plan.",
    "Rain is one of the conditions to respect today.",
    "Recent rain is giving the read less clarity.",
  ],
};

const RUNOFF_LABELS: LabelBank = {
  positive: [
    "Rain and runoff are helping the river read.",
    "Rain and runoff are staying manageable for the river today.",
    "The river’s rain/runoff signal is in a workable place.",
    "Rain and runoff are giving the river a cleaner read today.",
    "Stable flow has the river's rain/runoff signal manageable today.",
    "Stable flow is keeping the river read more organized.",
    "Stable flow has rain and runoff in a workable range for the river.",
    "Stable flow is giving the river setup support.",
  ],
  negative: [
    "Rain and runoff are making the river setup tougher.",
    "The river’s rain/runoff signal is making the read less clean.",
    "Runoff is adding uncertainty to the river read.",
    "Rain and runoff are narrowing the river margin today.",
    "The river runoff signal is asking for cleaner water choices.",
    "Runoff is making river timing more selective.",
    "Rain and runoff are one of the river read's cautions.",
    "The river flow signal is giving the setup less support.",
  ],
};

const COASTAL_TIDE_LABELS: LabelBank = {
  positive: [
    "Tide and current are helping the bite.",
    "Tide and current are in your favor today.",
    "Water movement is giving the coastal read a useful edge.",
    "The tide/current setup is adding support today.",
    "Moving water is helping shape the plan today.",
    "The tide/current read is on your side today.",
    "Water movement is giving you a useful timing cue.",
    "Tidal movement is one of the stronger signals today.",
  ],
  negative: [
    "Tide and current are not giving you much help today.",
    "The water-movement setup is making the coastal read narrower.",
    "Tide and current are giving the best window less support today.",
    "Water movement is asking for a tighter plan today.",
    "The tide/current read is making timing more selective.",
    "Tide and current are one of the day's cautions.",
    "Water movement is making the better window narrower.",
  ],
};

const CURRENT_LABELS: LabelBank = {
  positive: [
    "Current is helping the bite.",
    "Current is working in your favor today.",
    "Moving water is giving the read some support.",
    "The current setup is adding a useful edge today.",
    "Current is helping shape the plan today.",
    "Moving water is adding support to the read.",
    "The current read is on your side today.",
    "Current is giving you a useful timing cue.",
  ],
  negative: [
    "Current is not giving the setup much help today.",
    "The current picture is making the read tougher.",
    "Moving water is not lining up as well today.",
    "Current is asking for a more careful plan today.",
    "Moving water is making timing more selective.",
    "The current read is one of the day's cautions.",
    "Moving water is giving the read less support today.",
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
    "This factor is giving the day less support.",
    "This condition needs extra respect today.",
    "This signal is narrowing the setup today.",
    "This part of the setup needs extra respect.",
  ],
};

export function listFactorSurfaceCopyForAudit(): string[] {
  return [
    ...Object.values(TEMPERATURE_LABELS).flat(),
    ...Object.values(PRESSURE_LABELS).flat(),
    ...Object.values(WIND_LABELS).flat(),
    ...Object.values(LIGHT_LABELS).flat(),
    ...Object.values(PRECIP_LABELS).flat(),
    ...Object.values(RUNOFF_LABELS).flat(),
    ...Object.values(COASTAL_TIDE_LABELS).flat(),
    ...Object.values(CURRENT_LABELS).flat(),
    ...Object.values(FALLBACK_LABELS).flat(),
  ];
}

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
  const resolvedEffect: FactorEffect = score != null && score !== 0
    ? score < 0 ? "negative" : "positive"
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
