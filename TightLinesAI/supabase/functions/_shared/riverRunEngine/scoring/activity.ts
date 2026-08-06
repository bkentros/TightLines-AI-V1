import type {
  ActivityRules,
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  RawFlowTrendSignal,
  RawTemperatureTrendSignal,
  RunStage,
  WeatherFreshness,
} from "../types.ts";

export type ActivityConfidence = "Full" | "Moderate" | "Limited";

export type ActivityWeatherHour = {
  time_local: string;
  cloud_cover_pct: number | null;
  shortwave_w_m2: number | null;
  clear_sky_shortwave_w_m2?: number | null;
  precipitation_in: number | null;
};

export type ActivityBlock = {
  id: "05-09" | "09-13" | "13-17" | "17-21";
  label: string;
  score: number;
  activityLabel: string;
  positiveDriver: string;
  limitingFactor: string;
  cloudCoverPct: number | null;
  precipitationIn: number | null;
};

export type ActivityResult = {
  score: number | null;
  maximum: 100;
  label: string;
  headline: string;
  detail: string;
  tip: string;
  reasonCodes: string[];
  rulesVersion: string;
  targetDate: string;
  targetDayLabel: "Today" | "Tomorrow";
  confidence: ActivityConfidence;
  conditionalPresence: boolean;
  blocks: ActivityBlock[];
};

const BLOCKS = [
  { id: "05-09", label: "5–9 AM", start: 5, end: 9, lightBase: 72 },
  { id: "09-13", label: "9 AM–1 PM", start: 9, end: 13, lightBase: 46 },
  { id: "13-17", label: "1–5 PM", start: 13, end: 17, lightBase: 43 },
  { id: "17-21", label: "5–9 PM", start: 17, end: 21, lightBase: 70 },
] as const;

export function scoreActivity(input: {
  rules: ActivityRules;
  requestDate: string;
  runStage: RunStage;
  staging: boolean;
  targetDate: string;
  waterTempF: number | null;
  temperatureTrend: RawTemperatureTrendSignal;
  gaugeFreshness: GaugeFreshness;
  weatherFreshness: WeatherFreshness;
  flowBand?: FlowBand;
  currentHydraulicValue?: number | null;
  fishabilityBands?: FishabilityBands;
  flowSignal: RawFlowTrendSignal;
  hourlyWeather: ActivityWeatherHour[];
}): ActivityResult {
  const tomorrow = input.targetDate !== input.requestDate;
  const hasTemperature = typeof input.waterTempF === "number";
  const hasRiver = input.gaugeFreshness === "fresh" && Boolean(input.flowBand);
  const targetWeather = input.hourlyWeather.filter((hour) =>
    hour.time_local.startsWith(input.targetDate)
  );
  const hasWeather = input.weatherFreshness !== "missing" &&
    targetWeather.length > 0;
  const confidence: ActivityConfidence =
    hasWeather && hasTemperature && hasRiver && !tomorrow
      ? "Full"
      : hasWeather && (hasTemperature || hasRiver)
      ? "Moderate"
      : "Limited";

  const blocks = BLOCKS.map((block) => {
    const hours = targetWeather.filter((hour) => {
      const parsedHour = Number(hour.time_local.slice(11, 13));
      return parsedHour >= block.start && parsedHour < block.end;
    });
    const cloud = average(hours.map((hour) => hour.cloud_cover_pct));
    const precipitation = sum(hours.map((hour) => hour.precipitation_in));
    const light = lightScore(block, hours);
    const temperature = temperatureScore(
      input.rules,
      input.waterTempF,
      input.runStage,
      input.temperatureTrend,
    );
    const river = riverScore(
      input.flowBand,
      input.flowSignal,
      hasRiver,
      input.currentHydraulicValue,
      input.fishabilityBands,
    );
    const weather = weatherScore(precipitation);
    const weighted = weightedScore(input.rules, {
      light,
      temperature,
      river,
      weather,
    }, {
      light: hasWeather,
      waterTemperature: hasTemperature,
      riverBehavior: hasRiver,
      weather: hasWeather,
    });
    let score = Math.round(weighted);
    const dataCeilings = [
      ...(!hasTemperature ? [input.rules.caps.noWaterTemperature] : []),
      ...(!hasRiver ? [input.rules.caps.noMeasuredRiverData] : []),
      ...(confidence === "Limited" ? [69] : []),
    ];
    if (dataCeilings.length) {
      score = proportionalCeiling(score, Math.min(...dataCeilings));
    }
    if (
      input.waterTempF != null &&
      input.waterTempF >= input.rules.temperature.barrierF
    ) {
      score = proportionalCeiling(score, 19);
    } else if (
      input.waterTempF != null &&
      input.waterTempF >= input.rules.temperature.warmF
    ) {
      score = proportionalCeiling(score, 39);
    }
    if (input.flowBand === "blown_out") {
      score = proportionalCeiling(score, 19);
    }
    if (tomorrow) {
      score = proportionalCeiling(score, input.rules.caps.tomorrow);
    }
    if (input.runStage === "tapering") {
      score = proportionalCeiling(score, input.rules.caps.lateRun);
    }
    if (input.runStage === "ending" || input.runStage === "post_run") {
      score = proportionalCeiling(score, input.rules.caps.ending);
    }
    if (hasWeather && hasTemperature && hasRiver && score < 30) {
      score = conditionalChinookFloor(score);
    }
    const drivers = [
      {
        value: weightedImpact(light, input.rules.weights.light),
        available: hasWeather,
        text: light >= 67
          ? "Clouds or lower light make this window more favorable."
          : "The available light is workable in this window.",
      },
      {
        value: weightedImpact(
          temperature,
          input.rules.weights.waterTemperature,
        ),
        available: hasTemperature,
        text: temperature >= 70
          ? "The measured water temperature is favorable for Chinook."
          : "The measured water temperature remains usable.",
      },
      {
        value: weightedImpact(river, input.rules.weights.riverBehavior),
        available: hasRiver,
        text: river >= 70
          ? "The river level and its recent change are favorable."
          : "The current river level remains workable.",
      },
      {
        value: weightedImpact(weather, input.rules.weights.weather),
        available: hasWeather,
        text: precipitation && precipitation > 0
          ? "Light rain adds some cover."
          : "Rain is not affecting this window.",
      },
    ].filter((factor) => factor.available).sort((a, b) => b.value - a.value);
    const limits = [
      {
        value: weightedImpact(light, input.rules.weights.light),
        available: hasWeather,
        text: light < 55
          ? "Brighter conditions are the main limitation."
          : "Light offers less advantage than the strongest factor.",
      },
      {
        value: weightedImpact(
          temperature,
          input.rules.weights.waterTemperature,
        ),
        available: hasTemperature,
        text: hasTemperature
          ? "Water temperature limits responsiveness."
          : "Measured water temperature is unavailable.",
      },
      {
        value: weightedImpact(river, input.rules.weights.riverBehavior),
        available: hasRiver,
        text: hasRiver
          ? "The river level or its recent change is less favorable."
          : "Current river behavior is unavailable.",
      },
      {
        value: weightedImpact(weather, input.rules.weights.weather),
        available: hasWeather,
        text: precipitation != null && precipitation > 0.25
          ? "Heavier precipitation can unsettle presentation."
          : "Rain adds little extra cover.",
      },
      ...(!hasTemperature
        ? [{
          value: -2,
          available: true,
          text: "Measured water temperature is unavailable.",
        }]
        : []),
      ...(!hasRiver
        ? [{
          value: -1,
          available: true,
          text: "Current river behavior is unavailable.",
        }]
        : []),
      ...(!hasWeather
        ? [{
          value: 0,
          available: true,
          text: "Hourly light and weather data are unavailable.",
        }]
        : []),
    ].filter((factor) => factor.available).sort((a, b) => a.value - b.value);
    return {
      id: block.id,
      label: block.label,
      score,
      activityLabel: activityLabel(score),
      positiveDriver: drivers[0]?.text ??
        "No positive live driver is available.",
      limitingFactor: limits[0]?.text ??
        "No material limitation was identified.",
      cloudCoverPct: cloud == null ? null : Math.round(cloud),
      precipitationIn: precipitation == null ? null : round2(precipitation),
    };
  });
  const sorted = [...blocks].sort((a, b) => b.score - a.score);
  const averageScore = blocks.reduce((total, block) => total + block.score, 0) /
    blocks.length;
  const score = Math.round(
    averageScore * 0.5 + sorted[0].score * 0.25 + sorted[1].score * 0.25,
  );
  const late = input.runStage === "tapering" || input.runStage === "ending" ||
    input.runStage === "post_run";
  const conditionalPresence = input.staging;
  const label = activityLabel(score);
  const copy = activityCopy({
    label,
    stage: input.runStage,
    conditionalPresence,
    tomorrow,
    confidence,
    bestBlock: sorted[0],
  });
  return {
    score,
    maximum: 100,
    label,
    headline: copy.headline,
    detail: copy.detail,
    tip: copy.tip,
    reasonCodes: [
      `activity_confidence_${confidence.toLowerCase()}`,
      tomorrow ? "activity_tomorrow" : "activity_today",
      conditionalPresence
        ? "activity_conditional_presence"
        : "activity_run_present",
      ...(late ? ["activity_late_biology_cap"] : []),
      ...(input.waterTempF != null &&
          input.waterTempF >= input.rules.temperature.barrierF
        ? ["activity_temperature_barrier_cap"]
        : input.waterTempF != null &&
            input.waterTempF >= input.rules.temperature.warmF
        ? ["activity_warm_water_cap"]
        : []),
      ...(input.flowBand === "blown_out" ? ["activity_blown_out_cap"] : []),
    ],
    rulesVersion: input.rules.version,
    targetDate: input.targetDate,
    targetDayLabel: tomorrow ? "Tomorrow" : "Today",
    confidence,
    conditionalPresence,
    blocks,
  };
}

function activityCopy(input: {
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
}) {
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const confidence = input.confidence === "Full"
    ? "This read uses a current river level, measured water temperature, and the hourly weather outlook."
    : input.confidence === "Moderate"
    ? "One important reading is unavailable or comes from tomorrow’s forecast, so the outlook is kept conservative."
    : "Several important readings are unavailable, so treat this as a limited outlook.";
  const lifecycle = input.conditionalPresence
    ? "Dependable river presence has not begun. The score applies only to a sparse early Chinook that may already have entered."
    : input.stage === "beginning"
    ? "Early lake-fresh Chinook can remain reactive in tolerable water, so warmth is penalized without automatically erasing response potential."
    : input.stage === "building"
    ? "More Chinook are moving and settling into the river; the score describes reaction conditions for fish already present."
    : input.stage === "peak"
    ? "Broad seasonal presence improves the chance of locating fish, but this score measures responsiveness rather than abundance."
    : input.stage === "tapering"
    ? "Freshness and individual condition are becoming less consistent. This score applies only to living Chinook still capable of responding; it cannot judge the condition of an individual fish."
    : input.stage === "ending" || input.stage === "post_run"
    ? "Many late-run Chinook may be spawning, spent, dying, or already gone. This score applies only to a living fish still capable of reacting; favorable weather cannot reverse that decline."
    : "The score describes conditions for a Chinook already present, not the number of fish in the river.";
  const interpretation = input.label === "Highly active"
    ? "Conditions strongly favor a response from Chinook that are present and capable of reacting."
    : input.label === "Active"
    ? "Conditions favor a meaningful reaction opportunity."
    : input.label === "Moderate"
    ? "Some useful factors are present, but the response window is mixed."
    : input.label === "Reserved"
    ? "Fish may respond selectively, with important environmental limitations."
    : "Conditions provide little environmental support for an aggressive response.";
  const bestWindow =
    `The strongest window is ${input.bestBlock.label}: ${input.bestBlock.positiveDriver}`;
  const tip = input.stage === "tapering"
    ? "Compare the four time windows, but treat every difference as conditional on finding a living Chinook still capable of responding."
    : input.stage === "ending" || input.stage === "post_run"
    ? "No late-run window should be treated as broadly favorable; use the block scores only for a living Chinook that is still capable of reacting."
    : `Start with ${input.bestBlock.label}. If the sky changes from the forecast, favor the darkest practical window.`;
  return {
    headline:
      `${day} Chinook activity outlook is ${input.label.toLowerCase()}.`,
    detail: `${interpretation} ${bestWindow} ${lifecycle} ${confidence}`,
    tip,
  };
}

function weightedScore(
  rules: ActivityRules,
  scores: Record<string, number>,
  available: Record<string, boolean>,
): number {
  let total = 0;
  let weight = 0;
  for (
    const key of [
      "light",
      "waterTemperature",
      "riverBehavior",
      "weather",
    ] as const
  ) {
    if (!available[key]) continue;
    const scoreKey = key === "waterTemperature"
      ? "temperature"
      : key === "riverBehavior"
      ? "river"
      : key;
    total += scores[scoreKey] * rules.weights[key];
    weight += rules.weights[key];
  }
  return weight > 0 ? total / weight : 0;
}

function weightedImpact(score: number, weight: number): number {
  return (score - 50) * weight;
}

function lightScore(
  block: typeof BLOCKS[number],
  hours: ActivityWeatherHour[],
): number {
  const ratios = hours.flatMap((hour) => {
    const clear = hour.clear_sky_shortwave_w_m2;
    if (clear == null || clear < 20 || hour.shortwave_w_m2 == null) return [];
    return [Math.max(0, Math.min(1.15, hour.shortwave_w_m2 / clear))];
  });
  if (ratios.length) {
    const transmission = ratios.reduce((sum, value) => sum + value, 0) /
      ratios.length;
    const attenuation = Math.max(0, 1 - transmission);
    const strongDarkness = attenuation ** 1.7;
    return clamp(
      block.lightBase + strongDarkness * (100 - block.lightBase),
    );
  }
  const cloud = average(hours.map((hour) => hour.cloud_cover_pct));
  const radiation = average(hours.map((hour) => hour.shortwave_w_m2));
  if (cloud == null && radiation == null) return 50;
  const cloudHelp = cloud == null
    ? 0
    : (cloud / 100) ** 1.7 * (100 - block.lightBase);
  const brightPenalty = radiation == null ? 0 : Math.max(0, radiation - 650) *
    (block.start === 9 || block.start === 13 ? 0.025 : 0.01);
  return clamp(block.lightBase + cloudHelp - brightPenalty);
}

function temperatureScore(
  rules: ActivityRules,
  temp: number | null,
  stage: RunStage,
  trend: RawTemperatureTrendSignal,
): number {
  if (temp == null) return 50;
  let score = temp < rules.temperature.preferredMinF
    ? interpolateClamped(
      temp,
      rules.temperature.coldF - 5,
      rules.temperature.preferredMinF,
      18,
      95,
    )
    : temp <= rules.temperature.preferredMaxF
    ? 95
    : temp < rules.temperature.warmF
    ? interpolateClamped(
      temp,
      rules.temperature.preferredMaxF,
      rules.temperature.warmF,
      95,
      stage === "beginning" ? 48 : 38,
    )
    : temp < rules.temperature.barrierF
    ? interpolateClamped(
      temp,
      rules.temperature.warmF,
      rules.temperature.barrierF,
      28,
      8,
    )
    : 5;
  if (trend === "cooling" || trend === "strong_cooling") score += 3;
  if (trend === "strong_warming") score -= 4;
  return clamp(score);
}

function riverScore(
  band: FlowBand | undefined,
  signal: RawFlowTrendSignal,
  available: boolean,
  currentValue?: number | null,
  bands?: FishabilityBands,
): number {
  if (!available || !band) return 50;
  let score = currentValue != null && bands
    ? continuousRiverScore(currentValue, bands)
    : ({
      ideal: 92,
      normal_fishable: 76,
      low: 62,
      high_fishable: 68,
      very_low: 28,
      very_high: 30,
      blown_out: 8,
    } as Record<string, number>)[band] ?? 55;
  if (signal === "rising" || signal === "meaningful_rise") score += 5;
  if (signal === "sharp_rise" || signal === "falling") score -= 8;
  return clamp(score);
}

function weatherScore(precip: number | null): number {
  if (precip == null) return 50;
  if (precip <= 0.04) return interpolateClamped(precip, 0, 0.04, 55, 90);
  if (precip <= 0.12) return interpolateClamped(precip, 0.04, 0.12, 90, 68);
  if (precip <= 0.25) return interpolateClamped(precip, 0.12, 0.25, 68, 40);
  return interpolateClamped(precip, 0.25, 0.6, 40, 12);
}

function continuousRiverScore(
  value: number,
  bands: FishabilityBands,
): number {
  if (value < bands.tooLow.max) {
    return interpolateClamped(
      value,
      bands.tooLow.max * 0.5,
      bands.tooLow.max,
      8,
      42,
    );
  }
  if (value < bands.lowFishable.max) {
    return interpolateClamped(
      value,
      bands.lowFishable.min,
      bands.lowFishable.max,
      48,
      76,
    );
  }
  if (value < bands.ideal.min) {
    return interpolateClamped(
      value,
      bands.lowFishable.max,
      bands.ideal.min,
      76,
      88,
    );
  }
  if (value <= bands.ideal.max) {
    const midpoint = (bands.ideal.min + bands.ideal.max) / 2;
    return value <= midpoint
      ? interpolateClamped(value, bands.ideal.min, midpoint, 88, 95)
      : interpolateClamped(value, midpoint, bands.ideal.max, 95, 88);
  }
  if (value <= bands.highFishable.max) {
    return interpolateClamped(
      value,
      bands.highFishable.min,
      bands.highFishable.max,
      84,
      56,
    );
  }
  if (value < bands.blownOut.min) {
    return interpolateClamped(
      value,
      bands.highFishable.max,
      bands.blownOut.min,
      52,
      20,
    );
  }
  return interpolateClamped(
    value,
    bands.blownOut.min,
    bands.blownOut.min * 1.5,
    15,
    3,
  );
}

function proportionalCeiling(score: number, ceiling: number): number {
  return Math.round(score * ceiling / 100);
}

function conditionalChinookFloor(score: number): number {
  return Math.round(20 + Math.max(0, score) / 3);
}

function interpolateClamped(
  value: number,
  start: number,
  end: number,
  startScore: number,
  endScore: number,
): number {
  if (end === start) return endScore;
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return startScore + (endScore - startScore) * progress;
}

function activityLabel(score: number): string {
  return score >= 80
    ? "Highly active"
    : score >= 60
    ? "Active"
    : score >= 40
    ? "Moderate"
    : score >= 20
    ? "Reserved"
    : "Inactive";
}
function average(values: Array<number | null>): number | null {
  const valid = values.filter((value): value is number =>
    typeof value === "number"
  );
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
}
function sum(values: Array<number | null>): number | null {
  const valid = values.filter((value): value is number =>
    typeof value === "number"
  );
  return valid.length ? valid.reduce((a, b) => a + b, 0) : null;
}
function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
