import type {
  ActivityRules,
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  RawFlowTrendSignal,
  RawTemperatureTrendSignal,
  RunStage,
  RunStageCopyStrategy,
  WeatherFreshness,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";

export type ActivityConfidence = "Full" | "Moderate" | "Limited";
export type ActivityBlockStatus = "upcoming" | "current" | "ended";

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
  status: ActivityBlockStatus;
  lockedAt: string | null;
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
  copyVersion: string;
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
  refreshSlot?: string;
  previousActivity?: ActivityResult | null;
  copyStrategy?: RunStageCopyStrategy;
  fallEntryComplete?: boolean;
  seasonNotStarted?: boolean;
  monitoringStartDate?: string;
}): ActivityResult {
  if (input.seasonNotStarted) {
    const river = input.copyStrategy === "betsie_homestead"
      ? "Betsie"
      : input.copyStrategy === "big_manistee_tailwater"
      ? "Big Manistee"
      : input.copyStrategy === "muskegon_croton_tailwater"
      ? "Muskegon"
      : input.copyStrategy === "st_joseph_corridor"
      ? "St. Joseph"
      : input.copyStrategy === "pere_marquette"
      ? "PM"
      : "Fall-run";
    const returnTiming = input.monitoringStartDate
      ? seasonalReturnPhrase(input.monitoringStartDate.slice(5))
      : "when seasonal monitoring begins";
    return {
      score: null,
      maximum: 100,
      label: "Not active yet",
      headline: `${river} Activity has not started for this year's run.`,
      detail:
        "The upcoming run is still outside its monitoring window, so current weather and water are not scored as an in-season responsiveness signal.",
      tip: `Check back ${returnTiming} when fall monitoring begins.`,
      reasonCodes: ["stage_pre_run"],
      rulesVersion: input.rules.version,
      targetDate: input.targetDate,
      targetDayLabel: input.targetDate !== input.requestDate
        ? "Tomorrow"
        : "Today",
      confidence: "Limited",
      conditionalPresence: false,
      blocks: [],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.fallEntryComplete) {
    const river = input.copyStrategy === "betsie_homestead"
      ? "Betsie"
      : input.copyStrategy === "big_manistee_tailwater"
      ? "Big Manistee"
      : input.copyStrategy === "muskegon_croton_tailwater"
      ? "Muskegon"
      : input.copyStrategy === "st_joseph_corridor"
      ? "St. Joseph"
      : "PM";
    const returnTiming = input.monitoringStartDate
      ? seasonalReturnPhrase(input.monitoringStartDate.slice(5))
      : input.copyStrategy === "betsie_homestead"
      ? "in late August"
      : "in early September";
    return {
      score: null,
      maximum: 100,
      label: "Fall entry complete",
      headline: `${river} Steelhead fall-entry Activity is complete.`,
      detail:
        "Steelhead may remain in the river. This fall-entry model no longer scores their current responsiveness.",
      tip:
        `Do not use this completed fall outlook to infer current activity. Check back ${returnTiming}.`,
      reasonCodes: ["activity_fall_entry_complete"],
      rulesVersion: input.rules.version,
      targetDate: input.targetDate,
      targetDayLabel: input.targetDate !== input.requestDate
        ? "Tomorrow"
        : "Today",
      confidence: "Limited",
      conditionalPresence: false,
      blocks: [],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  const species = activitySpecies(input.rules.profile);
  const weatherOnly = input.rules.dataMode === "weather_only";
  const tomorrow = input.targetDate !== input.requestDate;
  const hasTemperature = !weatherOnly && typeof input.waterTempF === "number";
  const hasRiver = !weatherOnly && input.gaugeFreshness === "fresh" &&
    Boolean(input.flowBand);
  const targetWeather = input.hourlyWeather.filter((hour) =>
    hour.time_local.startsWith(input.targetDate)
  );
  const hasWeather = input.weatherFreshness !== "missing" &&
    targetWeather.length > 0;
  if (weatherOnly && !hasWeather) {
    const tomorrowLabel = tomorrow ? "Tomorrow’s" : "Today’s";
    const scope = input.rules.scopeCopy ? ` ${input.rules.scopeCopy}` : "";
    return {
      score: null,
      maximum: 100,
      label: "Unavailable",
      headline:
        `${tomorrowLabel} weather-only ${species} activity outlook is unavailable.`,
      detail:
        `Required hourly weather is unavailable, so no four-hour block can be scored or ranked. River level, clarity, and measured water temperature are unknown.${scope}`,
      tip:
        "Check back after hourly weather resumes, and independently verify actual river conditions before fishing.",
      reasonCodes: [
        "activity_confidence_limited",
        tomorrow ? "activity_tomorrow" : "activity_today",
        "activity_weather_only",
        "activity_weather_missing",
      ],
      rulesVersion: input.rules.version,
      targetDate: input.targetDate,
      targetDayLabel: tomorrow ? "Tomorrow" : "Today",
      confidence: "Limited",
      conditionalPresence: input.staging,
      blocks: [],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (
    !weatherOnly &&
    input.rules.minimumInputContract ===
      "weather_and_one_measured_river_input" &&
    (!hasWeather || (!hasTemperature && !hasRiver))
  ) {
    const tomorrowLabel = tomorrow ? "Tomorrow’s" : "Today’s";
    const scope = input.rules.scopeCopy ? ` ${input.rules.scopeCopy}` : "";
    const missing = !hasWeather
      ? "Required hourly weather is unavailable, so no four-hour block can be scored or ranked."
      : "Both measured river inputs are unavailable, so the model cannot produce an observed-river score.";
    return {
      score: null,
      maximum: 100,
      label: "Unavailable",
      headline: `${tomorrowLabel} ${species} activity outlook is unavailable.`,
      detail:
        `${missing} The model does not substitute neutral values for a failed source.${scope}`,
      tip:
        "Check back after the required live sources resume, and independently verify actual river conditions before fishing.",
      reasonCodes: [
        "activity_confidence_limited",
        tomorrow ? "activity_tomorrow" : "activity_today",
        ...(!hasWeather ? ["activity_weather_missing" as const] : []),
      ],
      rulesVersion: input.rules.version,
      targetDate: input.targetDate,
      targetDayLabel: tomorrow ? "Tomorrow" : "Today",
      confidence: "Limited",
      conditionalPresence: input.staging,
      blocks: [],
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  const confidence: ActivityConfidence =
    hasWeather && hasTemperature && hasRiver && !tomorrow
      ? "Full"
      : hasWeather && (hasTemperature || hasRiver)
      ? "Moderate"
      : "Limited";

  const refreshMinutes = parseRefreshMinutes(input.refreshSlot ?? "04:00");
  const blocks = BLOCKS.map((block) => {
    const hours = targetWeather.filter((hour) => {
      const parsedHour = Number(hour.time_local.slice(11, 13));
      return parsedHour >= block.start && parsedHour < block.end;
    });
    const cloud = average(hours.map((hour) => hour.cloud_cover_pct));
    const precipitation = sum(hours.map((hour) => hour.precipitation_in));
    const wetHours = hours.filter((hour) =>
      (hour.precipitation_in ?? 0) > 0
    ).length;
    const light = lightScore(block, hours);
    const temperature = temperatureScore(
      input.rules,
      input.waterTempF,
      input.runStage,
      input.temperatureTrend,
    );
    const river = riverScore(
      input.rules.profile,
      input.flowBand,
      input.flowSignal,
      hasRiver,
      input.currentHydraulicValue,
      input.fishabilityBands,
    );
    const weather = weatherScore(precipitation, wetHours, weatherOnly);
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
    if (weatherOnly) {
      score = Math.round(
        score * (input.rules.caps.weatherOnlyEvidenceScale ?? 1),
      );
      score = Math.min(
        score,
        tomorrow
          ? input.rules.caps.weatherOnlyTomorrowMaximum ??
            input.rules.caps.weatherOnlyMaximum ?? 95
          : input.rules.caps.weatherOnlyMaximum ?? 95,
      );
    } else {
      const dataCeilings = [
        ...(!hasTemperature ? [input.rules.caps.noWaterTemperature] : []),
        ...(!hasRiver ? [input.rules.caps.noMeasuredRiverData] : []),
        ...(confidence === "Limited" ? [69] : []),
      ];
      if (dataCeilings.length) {
        score = proportionalCeiling(score, Math.min(...dataCeilings));
      }
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
      score = proportionalCeiling(
        score,
        input.rules.caps.warmWaterMaximum ?? 39,
      );
    }
    if (input.flowBand === "blown_out") {
      score = proportionalCeiling(score, 19);
    }
    const floorStrength = salmonFloorStrength(
      input.rules,
      input.runStage,
      input.targetDate,
    );
    const floorInputsComplete = weatherOnly
      ? hasWeather
      : hasWeather && hasTemperature && hasRiver;
    if (
      floorStrength > 0 && floorInputsComplete &&
      input.rules.profile === "chinook_fall_reaction" && score < 30
    ) {
      score = blendScore(score, conditionalChinookFloor(score), floorStrength);
    } else if (
      floorStrength > 0 && floorInputsComplete &&
      input.rules.profile === "coho_fall_reaction" && score < 25
    ) {
      score = blendScore(score, conditionalCohoFloor(score), floorStrength);
    }
    score = applySalmonLifecycleAdjustment(
      input.rules,
      input.runStage,
      input.targetDate,
      score,
    );
    score = applyStageResponseAdjustment(
      input.rules,
      input.runStage,
      score,
    );
    // A stage prior may soften an otherwise over-dominant environmental
    // distribution, but it must never bypass the accepted hard-condition caps.
    const appliedStageResponseAdjustment =
      input.rules.stageResponseAdjustment?.[input.runStage] ?? 0;
    if (appliedStageResponseAdjustment > 0) {
      const finalDataCeilings = [
        ...(!hasTemperature ? [input.rules.caps.noWaterTemperature] : []),
        ...(!hasRiver ? [input.rules.caps.noMeasuredRiverData] : []),
        ...(confidence === "Limited" ? [69] : []),
      ];
      if (finalDataCeilings.length) {
        score = Math.min(score, ...finalDataCeilings);
      }
      if (
        input.waterTempF != null &&
        input.waterTempF >= input.rules.temperature.barrierF
      ) {
        score = Math.min(score, 29);
      } else if (
        input.waterTempF != null &&
        input.waterTempF >= input.rules.temperature.warmF
      ) {
        score = Math.min(
          score,
          input.rules.caps.warmWaterMaximum ?? 39,
        );
      }
      if (input.flowBand === "blown_out") score = Math.min(score, 19);
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
          ? `The measured water temperature is favorable for ${species}.`
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
        available: hasWeather && precipitation != null && precipitation > 0,
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
      ...(!hasTemperature && !weatherOnly
        ? [{
          value: -2,
          available: true,
          text: "Measured water temperature is unavailable.",
        }]
        : []),
      ...(!hasRiver && !weatherOnly
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
    const status = tomorrow
      ? "upcoming" as const
      : refreshMinutes >= block.end * 60
      ? "ended" as const
      : refreshMinutes >= block.start * 60
      ? "current" as const
      : "upcoming" as const;
    const previousBlock = status === "ended" &&
        input.previousActivity?.targetDate === input.targetDate
      ? input.previousActivity.blocks.find((candidate) =>
        candidate.id === block.id
      )
      : undefined;
    return {
      id: block.id,
      label: block.label,
      score: previousBlock ? previousBlock.score : score,
      activityLabel: previousBlock
        ? previousBlock.activityLabel
        : activityLabel(score),
      positiveDriver: previousBlock
        ? previousBlock.positiveDriver
        : drivers[0]?.text ?? "No positive live driver is available.",
      limitingFactor: previousBlock
        ? previousBlock.limitingFactor
        : limits[0]?.text ?? "No material limitation was identified.",
      cloudCoverPct: previousBlock
        ? previousBlock.cloudCoverPct
        : cloud == null
        ? null
        : Math.round(cloud),
      precipitationIn: previousBlock
        ? previousBlock.precipitationIn
        : precipitation == null
        ? null
        : round2(precipitation),
      status,
      lockedAt: status === "ended"
        ? previousBlock?.lockedAt ??
          `${input.targetDate}T${String(block.end).padStart(2, "0")}:00:00`
        : null,
    };
  });
  const sorted = [...blocks].sort((a, b) => b.score - a.score);
  const actionable = blocks.filter((block) => block.status !== "ended");
  const actionableSorted = [...actionable].sort((a, b) => b.score - a.score);
  const copyLeaders = actionableSorted.length > 0 ? actionableSorted : sorted;
  const averageScore = blocks.reduce((total, block) => total + block.score, 0) /
    blocks.length;
  const score = Math.round(
    averageScore * 0.5 + sorted[0].score * 0.25 + sorted[1].score * 0.25,
  );
  const late = isTerminalSalmonProfile(input.rules.profile) &&
    (input.runStage === "tapering" || input.runStage === "ending" ||
      input.runStage === "post_run");
  const conditionalPresence = input.staging;
  const label = activityLabel(score);
  const baseCopy = activityCopy({
    profile: input.rules.profile,
    scopeCopy: input.rules.scopeCopy,
    earlySeasonScopeCopy: input.rules.earlySeasonScopeCopy,
    label,
    stage: input.runStage,
    conditionalPresence,
    tomorrow,
    confidence,
    bestBlock: copyLeaders[0],
    secondBlock: copyLeaders[1] ?? copyLeaders[0],
    weatherOnly,
    pereMarquette: input.copyStrategy === "pere_marquette",
    betsieHomestead: input.copyStrategy === "betsie_homestead",
    bigManistee: input.copyStrategy === "big_manistee_tailwater",
    muskegon: input.copyStrategy === "muskegon_croton_tailwater",
    stJoseph: input.copyStrategy === "st_joseph_corridor",
    hasWeather,
    blocksSeparated: hasWeather &&
      copyLeaders[0].score - (copyLeaders[1]?.score ?? copyLeaders[0].score) >=
        3,
  });
  const copy = !tomorrow && blocks.some((block) => block.status === "ended")
    ? remainingWindowCopy(baseCopy)
    : baseCopy;
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
      ...(tomorrow ? ["activity_forecast"] : []),
      conditionalPresence
        ? "activity_conditional_presence"
        : "activity_run_present",
      ...(late ? ["activity_late_biology_cap"] : []),
      ...(weatherOnly ? ["activity_weather_only"] : []),
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
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function remainingWindowCopy<
  T extends {
    headline: string;
    detail: string;
    tip: string;
  },
>(copy: T): T {
  const makeRemaining = (value: string) =>
    value
      .replace(/The strongest window is/g, "The strongest remaining window is")
      .replace(
        / is strongest because/g,
        " is the strongest remaining window because",
      )
      .replace(
        / are the leading windows/g,
        " are the leading remaining windows",
      );
  return {
    ...copy,
    detail: makeRemaining(copy.detail),
    tip: makeRemaining(copy.tip),
  };
}

function parseRefreshMinutes(refreshSlot: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(refreshSlot);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function activityCopy(input: {
  profile: ActivityRules["profile"];
  scopeCopy?: string;
  earlySeasonScopeCopy?: string;
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
  secondBlock: ActivityBlock;
  weatherOnly: boolean;
  pereMarquette: boolean;
  betsieHomestead: boolean;
  bigManistee: boolean;
  muskegon: boolean;
  stJoseph: boolean;
  hasWeather: boolean;
  blocksSeparated: boolean;
}) {
  if (input.pereMarquette) return pereMarquetteActivityCopy(input);
  if (input.betsieHomestead) return betsieActivityCopy(input);
  if (input.bigManistee) return bigManisteeActivityCopy(input);
  if (input.muskegon) return muskegonActivityCopy(input);
  if (input.stJoseph) return stJosephActivityCopy(input);
  const species = activitySpecies(input.profile);
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const confidence = input.weatherOnly
    ? "This score ranks only the light, cloud cover, and precipitation included in the weather-only model. River level, clarity, and measured water temperature are unknown, so confidence remains Limited."
    : input.confidence === "Full"
    ? "This read uses a current river level, measured water temperature, and the hourly weather outlook."
    : input.confidence === "Moderate"
    ? "One important reading is unavailable or comes from tomorrow’s forecast, so the outlook is kept conservative."
    : "Several important readings are unavailable, so treat this as a limited outlook.";
  const lifecycle = lifecycleCopy(
    input.profile,
    input.stage,
    input.conditionalPresence,
  );
  const scope = input.scopeCopy ? ` ${input.scopeCopy}` : "";
  const nilesScoped = input.scopeCopy?.includes("mainstem at Niles") ?? false;
  const earlySeasonScope = input.earlySeasonScopeCopy &&
      ["pre_run", "beginning", "building"].includes(input.stage)
    ? ` ${input.earlySeasonScopeCopy}`
    : "";
  const interpretation = input.weatherOnly
    ? input.label === "Highly active"
      ? `The evaluated weather strongly favors a response from ${species} that are present and capable of reacting, but unmeasured river conditions may change the actual response.`
      : input.label === "Active"
      ? "The evaluated weather favors a meaningful reaction opportunity, but this does not verify the river conditions needed to support it."
      : input.label === "Moderate"
      ? "The evaluated weather provides mixed support for responsiveness; actual river conditions remain unknown."
      : input.label === "Reserved"
      ? "The evaluated weather provides limited support for responsiveness, and unknown river conditions add uncertainty."
      : "The evaluated weather provides little support for an aggressive response, without determining the underlying river conditions."
    : input.label === "Highly active"
    ? `Conditions strongly favor a response from ${species} that are present and capable of reacting.`
    : input.label === "Active"
    ? "Conditions favor a meaningful reaction opportunity."
    : input.label === "Moderate"
    ? "Some useful factors are present, but the response window is mixed."
    : input.label === "Reserved"
    ? "Fish may respond selectively, with important environmental limitations."
    : "Conditions provide little environmental support for an aggressive response.";
  const bestWindow =
    `The strongest window is ${input.bestBlock.label}: ${input.bestBlock.positiveDriver} The main limitation: ${input.bestBlock.limitingFactor}`;
  const baseTip = input.weatherOnly
    ? weatherOnlyTip(input.profile, input.stage, input.bestBlock.label)
    : input.profile === "steelhead_feeding"
    ? steelheadTip(input.stage, input.bestBlock.label)
    : input.profile === "brown_trout_fall_reaction"
    ? brownTroutTip(input.stage, input.bestBlock.label)
    : input.stage === "tapering"
    ? `Compare the four time windows, but treat every difference as conditional on finding a living ${species} still capable of responding.`
    : input.stage === "ending" || input.stage === "post_run"
    ? `No late-season window should be treated as broadly favorable; use the block scores only for a living ${species} that is still capable of reacting.`
    : `Start with ${input.bestBlock.label}. If the sky changes from the forecast, favor the darkest practical window.`;
  const tip = nilesScoped
    ? `${baseTip} Apply this response window at Niles; verify temperature, clarity, flow shape, and legal access again before carrying it to another St. Joseph section.`
    : baseTip;
  return {
    headline: input.weatherOnly
      ? `${day} weather-only ${species} activity outlook is ${input.label.toLowerCase()} with Limited confidence.`
      : `${day} ${species} activity outlook is ${input.label.toLowerCase()}.`,
    detail:
      `${interpretation} ${bestWindow} ${lifecycle}${scope}${earlySeasonScope} ${confidence}`,
    tip,
  };
}

function stJosephActivityCopy(input: {
  profile: ActivityRules["profile"];
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
  secondBlock: ActivityBlock;
  hasWeather: boolean;
  blocksSeparated: boolean;
}): Pick<ActivityResult, "headline" | "detail" | "tip"> {
  const species = activitySpecies(input.profile);
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const headline = input.conditionalPresence
    ? `${day} Niles responsiveness is ${input.label.toLowerCase()}, but dependable ${species} presence has not begun.`
    : `${day} Niles ${species} responsiveness is ${input.label.toLowerCase()}.`;
  const interpretation = ({
    "Highly active": `Conditions strongly support ${species} responsiveness.`,
    Active: `Conditions support a meaningful ${species} response.`,
    Moderate: `Conditions offer mixed support for ${species} responsiveness.`,
    Reserved: `${species} may respond selectively under current limitations.`,
    Inactive:
      `Conditions offer little support for an aggressive ${species} response.`,
  } as Record<string, string>)[input.label] ??
    `Conditions provide a ${species} responsiveness outlook.`;
  const blockPoint = input.blocksSeparated
    ? pmStrongestBlockPoint(input.bestBlock)
    : input.hasWeather
    ? `${input.bestBlock.label} and ${input.secondBlock.label} are the leading windows, but neither has a clear advantage.`
    : "Hourly weather is unavailable, so no time block can be separated.";
  const lifecycle = pmActivityLifecyclePoint(input.profile, input.stage);
  const scopePoint = lifecycle ??
    (input.conditionalPresence
      ? `This applies only to an early ${species} already near Niles.`
      : input.confidence === "Full"
      ? "Flow and temperature represent only the Niles mainstem reach."
      : `${input.confidence} confidence reflects missing or forecast inputs; river measurements still represent only Niles.`);
  const tip = input.blocksSeparated
    ? `Begin with ${input.bestBlock.label} at Niles. Verify the Lower and Upper river directly.`
    : input.hasWeather
    ? `Choose between ${input.bestBlock.label} and ${input.secondBlock.label} using actual light. Verify other sections directly.`
    : "No dependable time window is available. Verify conditions directly.";
  return {
    headline,
    detail: `${interpretation} ${blockPoint} ${scopePoint}`,
    tip,
  };
}

function bigManisteeActivityCopy(input: {
  profile: ActivityRules["profile"];
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
  secondBlock: ActivityBlock;
  hasWeather: boolean;
  blocksSeparated: boolean;
}): Pick<ActivityResult, "headline" | "detail" | "tip"> {
  const species = activitySpecies(input.profile);
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const headline = input.conditionalPresence
    ? `${day} Upper-river responsiveness is ${input.label.toLowerCase()}, but dependable ${species} presence has not begun.`
    : `${day} Upper-river ${species} responsiveness is ${input.label.toLowerCase()}.`;
  const interpretation = ({
    "Highly active": `Conditions strongly support ${species} responsiveness.`,
    Active: `Conditions support a meaningful ${species} response.`,
    Moderate: `Conditions offer mixed support for ${species} responsiveness.`,
    Reserved: `${species} may respond selectively under current limitations.`,
    Inactive:
      `Conditions offer little support for an aggressive ${species} response.`,
  } as Record<string, string>)[input.label] ??
    `Conditions provide a ${species} responsiveness outlook.`;
  const blockPoint = input.blocksSeparated
    ? pmStrongestBlockPoint(input.bestBlock)
    : input.hasWeather
    ? `${input.bestBlock.label} and ${input.secondBlock.label} are the leading windows, but neither has a clear advantage.`
    : "Hourly weather is unavailable, so no time block can be separated.";
  const lifecycle = pmActivityLifecyclePoint(input.profile, input.stage);
  const scopePoint = lifecycle ??
    (input.conditionalPresence
      ? `This applies only to an early ${species} already in the river.`
      : input.confidence === "Full"
      ? "Wellston flow and temperature represent the Upper river, especially the Tippy Dam area."
      : `${input.confidence} confidence reflects missing or forecast inputs; Wellston still represents only the Upper river.`);
  const tip = input.blocksSeparated
    ? `Begin with ${input.bestBlock.label}. Apply this window in the Upper river and verify downstream sections directly.`
    : input.hasWeather
    ? `Choose between ${input.bestBlock.label} and ${input.secondBlock.label} using actual light. Verify downstream sections directly.`
    : "No dependable time window is available. Verify conditions directly.";
  return {
    headline,
    detail: `${interpretation} ${blockPoint} ${scopePoint}`,
    tip,
  };
}

function muskegonActivityCopy(input: {
  profile: ActivityRules["profile"];
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
  secondBlock: ActivityBlock;
  hasWeather: boolean;
  blocksSeparated: boolean;
}): Pick<ActivityResult, "headline" | "detail" | "tip"> {
  const species = activitySpecies(input.profile);
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const headline = input.conditionalPresence
    ? `${day} Croton-area responsiveness is ${input.label.toLowerCase()}, but dependable ${species} presence has not begun.`
    : `${day} Croton-area ${species} responsiveness is ${input.label.toLowerCase()}.`;
  const interpretation = ({
    "Highly active": `Conditions strongly support ${species} responsiveness.`,
    Active: `Conditions support a meaningful ${species} response.`,
    Moderate: `Conditions offer mixed support for ${species} responsiveness.`,
    Reserved: `${species} may respond selectively under current limitations.`,
    Inactive:
      `Conditions offer little support for an aggressive ${species} response.`,
  } as Record<string, string>)[input.label] ??
    `Conditions provide a ${species} responsiveness outlook.`;
  const blockPoint = input.blocksSeparated
    ? pmStrongestBlockPoint(input.bestBlock)
    : input.hasWeather
    ? `${input.bestBlock.label} and ${input.secondBlock.label} are the leading windows, but neither has a clear advantage.`
    : "Hourly weather is unavailable, so no time block can be separated.";
  const lifecycle = pmActivityLifecyclePoint(input.profile, input.stage);
  const scopePoint = lifecycle ??
    (input.conditionalPresence
      ? `This applies only to an early ${species} already near Croton Dam.`
      : input.confidence === "Full"
      ? "Croton flow and temperature represent only the area near the dam."
      : `${input.confidence} confidence reflects missing or forecast inputs; river measurements still represent only the Croton Dam area.`);
  const tip = input.blocksSeparated
    ? `Begin with ${input.bestBlock.label} near Croton Dam. Verify every downstream section directly.`
    : input.hasWeather
    ? `Choose between ${input.bestBlock.label} and ${input.secondBlock.label} using actual light. Verify downstream sections directly.`
    : "No dependable time window is available. Verify conditions directly.";
  return {
    headline,
    detail: `${interpretation} ${blockPoint} ${scopePoint}`,
    tip,
  };
}

function betsieActivityCopy(input: {
  profile: ActivityRules["profile"];
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
  secondBlock: ActivityBlock;
  weatherOnly: boolean;
  hasWeather: boolean;
  blocksSeparated: boolean;
}): Pick<ActivityResult, "headline" | "detail" | "tip"> {
  const species = activitySpecies(input.profile);
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const headline = input.conditionalPresence
    ? `${day} weather-only Betsie outlook is ${input.label.toLowerCase()} with Limited confidence, but dependable ${species} presence has not begun.`
    : `${day} weather-only Betsie ${species} responsiveness is ${input.label.toLowerCase()} with Limited confidence.`;
  const interpretation = ({
    "Highly active":
      `Weather strongly supports ${species} responsiveness if fish are present.`,
    Active:
      `Weather supports a meaningful ${species} response if fish are present.`,
    Moderate: `Weather offers mixed support for ${species} responsiveness.`,
    Reserved:
      `${species} may respond selectively under the weather limitations.`,
    Inactive:
      `No time block broadly supports an aggressive ${species} response.`,
  } as Record<string, string>)[input.label] ??
    `The weather provides a conditional ${species} responsiveness outlook.`;
  const blockPoint = input.blocksSeparated
    ? pmStrongestBlockPoint(input.bestBlock)
    : input.hasWeather
    ? `${input.bestBlock.label} and ${input.secondBlock.label} are the leading windows, but neither has a clear advantage.`
    : "Hourly light and weather data are unavailable, so no time block can be separated.";
  const lifecycle = pmActivityLifecyclePoint(input.profile, input.stage);
  const thirdPoint = lifecycle ??
    (input.conditionalPresence
      ? `This outlook applies only to an early ${species} already in the Betsie.`
      : "Confidence is Limited because river level, clarity, and measured water temperature are unavailable.");
  const tip = input.label === "Inactive"
    ? input.blocksSeparated
      ? `Every block is unfavorable. Use ${input.bestBlock.label} only as the least constrained window.`
      : input.hasWeather
      ? `Every block is unfavorable. If you fish, compare only ${input.bestBlock.label} and ${input.secondBlock.label}.`
      : "Hourly conditions cannot identify a better window."
    : input.blocksSeparated
    ? `Begin with ${input.bestBlock.label}. Re-rank the blocks if light or weather changes materially.`
    : input.hasWeather
    ? `Choose between ${input.bestBlock.label} and ${input.secondBlock.label} using actual light. Neither has a dependable advantage.`
    : "Choose the block that best fits current access. Hourly conditions cannot separate the windows.";
  return {
    headline,
    detail: [interpretation, blockPoint, thirdPoint].join(" "),
    tip,
  };
}

function pereMarquetteActivityCopy(input: {
  profile: ActivityRules["profile"];
  label: string;
  stage: RunStage;
  conditionalPresence: boolean;
  tomorrow: boolean;
  confidence: ActivityConfidence;
  bestBlock: ActivityBlock;
  secondBlock: ActivityBlock;
  weatherOnly: boolean;
  hasWeather: boolean;
  blocksSeparated: boolean;
}): Pick<ActivityResult, "headline" | "detail" | "tip"> {
  const species = activitySpecies(input.profile);
  const day = input.tomorrow ? "Tomorrow’s" : "Today’s";
  const headline = input.conditionalPresence
    ? `${day} PM outlook is ${input.label.toLowerCase()}, but dependable ${species} presence has not begun.`
    : `${day} PM ${species} responsiveness is ${input.label.toLowerCase()} if fish are present.`;
  const interpretation = ({
    "Highly active":
      `Conditions strongly support ${species} responsiveness if fish are present.`,
    Active:
      `Conditions support a meaningful ${species} response if fish are present.`,
    Moderate: `Conditions offer mixed support for ${species} responsiveness.`,
    Reserved:
      `${species} may respond selectively under the current limitations.`,
    Inactive:
      `No time block broadly supports an aggressive ${species} response.`,
  } as Record<string, string>)[input.label] ??
    `The current environment provides a conditional ${species} responsiveness outlook.`;
  const blockPoint = input.blocksSeparated
    ? pmStrongestBlockPoint(input.bestBlock)
    : input.hasWeather
    ? `${input.bestBlock.label} and ${input.secondBlock.label} are the leading windows, but neither has a clear advantage.`
    : "Hourly light and weather data are unavailable, so no time block can be separated.";
  const lifecycle = pmActivityLifecyclePoint(input.profile, input.stage);
  const confidence = input.weatherOnly
    ? "Confidence is Limited because river level and measured water temperature are unavailable."
    : input.confidence === "Full"
    ? "Full confidence uses current Scottville flow, measured PM temperature, and hourly weather."
    : input.confidence === "Moderate"
    ? "Confidence is Moderate because one key input is missing or this is tomorrow’s outlook."
    : "Confidence is Limited because several key inputs are unavailable.";
  const thirdPoint = lifecycle ??
    (input.conditionalPresence
      ? `This outlook applies only to an early ${species} already in the PM river.`
      : confidence);
  const tip = input.label === "Inactive"
    ? input.blocksSeparated
      ? `Treat every block as unfavorable. Use ${input.bestBlock.label} only as the least constrained window.`
      : input.hasWeather
      ? `Treat every block as unfavorable. If you fish, limit the test to ${input.bestBlock.label} or ${input.secondBlock.label}.`
      : "Treat every block as unfavorable. Keep presentations conservative and continue only if direct fish response supports it."
    : input.label === "Reserved"
    ? input.blocksSeparated
      ? `Begin with ${input.bestBlock.label}, but leave quickly if direct fish response does not support the outlook.`
      : input.hasWeather
      ? `Fish one short test in ${input.bestBlock.label} or ${input.secondBlock.label}. Leave if direct response does not support the outlook.`
      : "Fish one short, controlled window and leave if direct response does not support the outlook."
    : input.blocksSeparated
    ? `Begin with ${input.bestBlock.label}. Re-rank the blocks if light or weather changes materially.`
    : input.hasWeather
    ? `Choose between ${input.bestBlock.label} and ${input.secondBlock.label} using actual light and access. Neither has a dependable advantage.`
    : "Choose the block that best fits current access. Hourly conditions cannot separate the windows.";
  return {
    headline,
    detail: [interpretation, blockPoint, thirdPoint].join(" "),
    tip,
  };
}

function pmStrongestBlockPoint(block: ActivityBlock): string {
  const driver = block.positiveDriver.toLowerCase().replace(/[.!?]+$/, "");
  return `${block.label} is strongest because ${driver}.`;
}

function pmActivityLifecyclePoint(
  profile: ActivityRules["profile"],
  stage: RunStage,
): string | null {
  if (stage !== "tapering" && stage !== "ending" && stage !== "post_run") {
    return null;
  }
  if (profile === "steelhead_feeding") {
    return "Cold late-fall water can shorten response windows without meaning Steelhead have left the river.";
  }
  if (profile === "brown_trout_fall_reaction") {
    return "Late-run Brown Trout remain living repeat spawners; responsiveness can change without proving that fish died or left the river.";
  }
  const species = activitySpecies(profile);
  return `Late-run ${species} condition varies widely, so individual fish may respond above or below this outlook.`;
}

function weatherOnlyTip(
  profile: ActivityRules["profile"],
  stage: RunStage,
  bestBlockLabel: string,
): string {
  const species = activitySpecies(profile);
  if (
    profile === "steelhead_feeding" &&
    (stage === "tapering" || stage === "ending" || stage === "post_run")
  ) {
    return `Use the four blocks only to compare weather support. These Steelhead remain alive through the winter transition; verify actual water temperature, level, clarity, and safe access before treating ${bestBlockLabel} as favorable.`;
  }
  if (stage === "tapering" || stage === "ending" || stage === "post_run") {
    return `Use the four blocks only to compare weather support for a living ${species} of unknown condition. Verify actual water temperature, level, clarity, and safe access before treating any block as favorable.`;
  }
  return `Start with ${bestBlockLabel} only as the strongest weather-supported window. Verify actual water temperature, level, clarity, and safe access before treating it as favorable.`;
}

function seasonalReturnPhrase(date: string): string {
  const monthDay = date.length >= 5 ? date.slice(-5) : date;
  const month = Number(monthDay.slice(0, 2));
  const day = Number(monthDay.slice(3, 5));
  const period = day <= 10 ? "in early" : day <= 20 ? "in mid" : "in late";
  const monthName = [
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
  ][month - 1];
  return `${period} ${monthName}`;
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
  if (
    rules.profile === "steelhead_feeding" ||
    rules.profile === "brown_trout_fall_reaction"
  ) {
    let score = temp < rules.temperature.preferredMinF
      ? interpolateClamped(
        temp,
        rules.temperature.coldF - 5,
        rules.temperature.preferredMinF,
        18,
        82,
      )
      : temp < 48
      ? interpolateClamped(
        temp,
        rules.temperature.preferredMinF,
        48,
        82,
        95,
      )
      : temp <= 54
      ? 95
      : temp <= rules.temperature.preferredMaxF
      ? interpolateClamped(
        temp,
        54,
        rules.temperature.preferredMaxF,
        95,
        82,
      )
      : temp < rules.temperature.warmF
      ? interpolateClamped(
        temp,
        rules.temperature.preferredMaxF,
        rules.temperature.warmF,
        82,
        38,
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
  const optimal = rules.profile === "coho_fall_reaction" ? 84 : 95;
  let score = temp < rules.temperature.preferredMinF
    ? interpolateClamped(
      temp,
      rules.temperature.coldF - 5,
      rules.temperature.preferredMinF,
      18,
      optimal,
    )
    : temp <= rules.temperature.preferredMaxF
    ? optimal
    : temp < rules.temperature.warmF
    ? interpolateClamped(
      temp,
      rules.temperature.preferredMaxF,
      rules.temperature.warmF,
      optimal,
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
  profile: ActivityRules["profile"],
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
  if (
    isTerminalSalmonProfile(profile) &&
    (signal === "rising" || signal === "meaningful_rise")
  ) score += 5;
  if (signal === "sharp_rise" || signal === "falling") score -= 8;
  return clamp(score);
}

function weatherScore(
  precip: number | null,
  wetHours = 0,
  weatherOnly = false,
): number {
  if (precip == null) return 50;
  const sustainedBonus = weatherOnly && precip > 0 && precip <= 0.12
    ? Math.min(6, Math.max(0, wetHours - 1) * 2)
    : 0;
  if (precip <= 0.04) {
    return clamp(
      interpolateClamped(precip, 0, 0.04, 55, 90) + sustainedBonus,
    );
  }
  if (precip <= 0.12) {
    return clamp(
      interpolateClamped(precip, 0.04, 0.12, 90, 68) + sustainedBonus,
    );
  }
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

function salmonFloorStrength(
  rules: ActivityRules,
  stage: RunStage,
  targetDate: string,
): number {
  if (!isTerminalSalmonProfile(rules.profile)) return 0;
  const ramp = rules.caps.lifecycleRamp;
  if (!ramp) {
    return stage === "tapering" || stage === "ending" || stage === "post_run"
      ? 0
      : 1;
  }
  if (stage === "ending" || stage === "post_run") return 0;
  if (stage !== "tapering") return 1;
  return 1 - calendarProgress(targetDate, ramp.peakEnd, ramp.taperingEnd);
}

function applySalmonLifecycleAdjustment(
  rules: ActivityRules,
  stage: RunStage,
  targetDate: string,
  score: number,
): number {
  if (!isTerminalSalmonProfile(rules.profile)) return score;
  const penalty = rules.caps.taperingPenalty;
  const ramp = rules.caps.lifecycleRamp;
  if (ramp && penalty != null) {
    const tapered = Math.max(0, score - penalty);
    if (stage === "tapering") {
      const progress = calendarProgress(
        targetDate,
        ramp.peakEnd,
        ramp.taperingEnd,
      );
      return blendScore(score, tapered, progress);
    }
    if (stage === "ending") {
      const ending = proportionalCeiling(score, rules.caps.ending);
      const progress = calendarProgress(
        targetDate,
        ramp.taperingEnd,
        ramp.endingEnd,
      );
      return blendScore(tapered, ending, progress);
    }
    if (stage === "post_run") {
      const ending = proportionalCeiling(score, rules.caps.ending);
      const progress = calendarProgress(
        targetDate,
        ramp.taperingEnd,
        ramp.endingEnd,
      );
      return blendScore(tapered, ending, progress);
    }
    return score;
  }
  if (stage === "tapering") {
    return penalty == null
      ? proportionalCeiling(score, rules.caps.lateRun)
      : Math.max(0, score - penalty);
  }
  return stage === "ending" || stage === "post_run"
    ? proportionalCeiling(score, rules.caps.ending)
    : score;
}

function applyStageResponseAdjustment(
  rules: ActivityRules,
  stage: RunStage,
  score: number,
): number {
  const adjustment = rules.stageResponseAdjustment?.[stage] ?? 0;
  return Math.min(
    rules.caps.stageResponseMaximum ?? 100,
    clamp(score + adjustment),
  );
}

function blendScore(from: number, to: number, progress: number): number {
  return Math.round(from + (to - from) * Math.max(0, Math.min(1, progress)));
}

function calendarProgress(
  targetDate: string,
  startMonthDay: string,
  endMonthDay: string,
): number {
  const year = Number(targetDate.slice(0, 4));
  const target = Date.parse(`${targetDate}T00:00:00Z`);
  const start = Date.parse(`${year}-${startMonthDay}T00:00:00Z`);
  let end = Date.parse(`${year}-${endMonthDay}T00:00:00Z`);
  if (end < start) end = Date.parse(`${year + 1}-${endMonthDay}T00:00:00Z`);
  let adjustedTarget = target;
  if (adjustedTarget < start && end > Date.parse(`${year}-12-31T00:00:00Z`)) {
    adjustedTarget = Date.parse(`${year + 1}-${targetDate.slice(5)}T00:00:00Z`);
  }
  return Math.max(0, Math.min(1, (adjustedTarget - start) / (end - start)));
}

function conditionalChinookFloor(score: number): number {
  return Math.round(20 + Math.max(0, score) / 3);
}

function conditionalCohoFloor(score: number): number {
  return Math.round(15 + Math.max(0, score) * 0.4);
}

function activitySpecies(profile: ActivityRules["profile"]): string {
  return profile === "coho_fall_reaction"
    ? "Coho"
    : profile === "steelhead_feeding"
    ? "Steelhead"
    : profile === "brown_trout_fall_reaction"
    ? "lake-run Brown Trout"
    : "Chinook";
}

function lifecycleCopy(
  profile: ActivityRules["profile"],
  stage: RunStage,
  conditionalPresence: boolean,
): string {
  const species = activitySpecies(profile);
  if (conditionalPresence) {
    return `Dependable river presence has not begun. The score applies only to a sparse early ${species} that may already have entered.`;
  }
  if (profile === "coho_fall_reaction") {
    if (stage === "beginning") {
      return "Early lake-fresh Coho can remain reactive when measured water temperatures are suitable; this score applies only to fish already in the river.";
    }
    if (stage === "building") {
      return "More Coho are entering and settling into the river; measured water temperature matters, but this score describes reaction conditions rather than movement or abundance.";
    }
    if (stage === "peak") {
      return "Broad seasonal presence can make fish easier to locate, but this score measures the responsiveness of Coho already present rather than their abundance.";
    }
    if (stage === "tapering") {
      return "This score represents a Coho of unknown condition at this point in the season. A newly arrived or fresher fish may be more active than this score, while a spawning or deteriorating fish may be less responsive.";
    }
    if (stage === "ending" || stage === "post_run") {
      return "This score represents a remaining Coho of unknown condition late in the season. A newly arrived or fresher fish may be more active than this score, while a spent or deteriorating fish may respond less or not at all.";
    }
    return "The score describes conditions for a Coho already present, not the number of fish in the river.";
  }
  if (profile === "steelhead_feeding") {
    if (stage === "beginning") {
      return "Early fall Steelhead are entering with energy reserves intact. This score describes feeding or aggressive responsiveness for fish already in the river, not fresh movement.";
    }
    if (stage === "building") {
      return "Steelhead are becoming more established through the river. The score describes feeding or aggressive responsiveness, while movement and abundance remain separate reads.";
    }
    if (stage === "peak") {
      return "Broad fall presence can make Steelhead easier to locate, but this score measures feeding or aggressive responsiveness rather than how many fish are present.";
    }
    if (stage === "tapering") {
      return "As late fall progresses, Steelhead often become more selective and less willing to move far for a presentation. The fish remain alive and are transitioning toward winter holding; actual responsiveness still depends strongly on water temperature and river conditions.";
    }
    if (stage === "ending") {
      return "These Steelhead remain alive in the river as they transition into winter holding. Their responsiveness follows measured water temperature and current conditions rather than a terminal biological decline.";
    }
    if (stage === "post_run") {
      return "Steelhead remain alive in winter holding after the fall-entry period. Use the dedicated winter read when available; this score only describes current responsiveness.";
    }
    return "The score describes feeding or aggressive responsiveness for a Steelhead already present, not the number of fish in the river.";
  }
  if (profile === "brown_trout_fall_reaction") {
    if (stage === "beginning") {
      return "Early lake-run Brown Trout can remain reactive as they enter the lower river; this score applies only to a fish already present.";
    }
    if (stage === "building" || stage === "peak") {
      return "This score describes feeding or aggressive responsiveness for lake-run Brown Trout already present, not migration or abundance.";
    }
    if (stage === "tapering" || stage === "ending" || stage === "post_run") {
      return "Post-spawn lake-run Brown Trout remain living repeat spawners. An individual may hold in the river or return lakeward, and responsiveness can vary without implying death or departure.";
    }
    return "The score describes feeding or aggressive responsiveness for a lake-run Brown Trout already present, not the number of fish in the river.";
  }
  if (profile === "chinook_fall_reaction") {
    return stage === "beginning"
      ? "Early lake-fresh Chinook can remain reactive in tolerable water, so warmth is penalized without automatically erasing response potential."
      : stage === "building"
      ? "More Chinook are moving and settling into the river; the score describes reaction conditions for fish already present."
      : stage === "peak"
      ? "Broad seasonal presence improves the chance of locating fish, but this score measures responsiveness rather than abundance."
      : stage === "tapering"
      ? "This score represents a Chinook of unknown condition at this point in the season. A newly arrived or fresher fish may be more active than this score, while a spawning or deteriorating fish may be less responsive."
      : stage === "ending" || stage === "post_run"
      ? "This score represents a remaining Chinook of unknown condition late in the season. A newly arrived or fresher fish may be more active than this score, while a spent or dying fish may respond less or not at all."
      : "The score describes conditions for a Chinook already present, not the number of fish in the river.";
  }
  return `The score describes conditions for a ${species} already present, not the number of fish in the river.`;
}

function steelheadTip(stage: RunStage, bestBlockLabel: string): string {
  if (stage === "tapering" || stage === "ending" || stage === "post_run") {
    return `Compare the four time windows, but expect a shorter response in cold water and keep the result separate from the winter holding outlook.`;
  }
  return `Start with ${bestBlockLabel}. If conditions change, favor the window that best combines workable light with measured water temperature.`;
}

function brownTroutTip(stage: RunStage, bestBlockLabel: string): string {
  if (stage === "tapering" || stage === "ending" || stage === "post_run") {
    return `Compare the four time windows, but do not treat a lower late-season read as proof that Brown Trout died or left the river.`;
  }
  return `Start with ${bestBlockLabel}. Keep this responsiveness outlook separate from abundance and migration stage.`;
}

function isTerminalSalmonProfile(profile: ActivityRules["profile"]): boolean {
  return profile === "chinook_fall_reaction" ||
    profile === "coho_fall_reaction";
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
