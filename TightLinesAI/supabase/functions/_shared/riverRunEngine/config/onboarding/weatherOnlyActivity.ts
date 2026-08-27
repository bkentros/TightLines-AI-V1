import type { ActivityRules } from "../../types.ts";

type WeatherOnlyProfile = ActivityRules["profile"];

type WeatherOnlyActivityInput = {
  version: string;
  profile: WeatherOnlyProfile;
  reachIds: string[];
  weatherPointId: string;
  inputNotes: string;
  scopeCopy: string;
  evidenceNotes: string;
  stageResponseAdjustment?: ActivityRules["stageResponseAdjustment"];
  lifecycle?: {
    peakEnd: string;
    taperingEnd: string;
    endingEnd: string;
  };
};

const SPECIES_RULES: Record<
  WeatherOnlyProfile,
  Pick<ActivityRules, "weights" | "temperature"> & {
    ending: number;
  }
> = {
  chinook_fall_reaction: {
    weights: {
      light: 0.75,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.25,
    },
    temperature: {
      coldF: 43,
      preferredMinF: 48,
      preferredMaxF: 62,
      warmF: 68,
      barrierF: 72,
    },
    ending: 49,
  },
  coho_fall_reaction: {
    weights: {
      light: 0.7,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.3,
    },
    temperature: {
      coldF: 40,
      preferredMinF: 45,
      preferredMaxF: 60,
      warmF: 64,
      barrierF: 68,
    },
    ending: 42,
  },
  steelhead_feeding: {
    weights: {
      light: 0.7,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.3,
    },
    temperature: {
      coldF: 39,
      preferredMinF: 44,
      preferredMaxF: 56,
      warmF: 64,
      barrierF: 68,
    },
    ending: 100,
  },
  brown_trout_fall_reaction: {
    weights: {
      light: 0.7,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.3,
    },
    temperature: {
      coldF: 38,
      preferredMinF: 44,
      preferredMaxF: 58,
      warmF: 64,
      barrierF: 70,
    },
    ending: 100,
  },
};

/**
 * Creates a conservative weather-only candidate. These values are starting
 * calibrations, not accepted biological constants; every returned ruleset must
 * pass the fixed historical replay and controlled acceptance suite.
 */
export function buildWeatherOnlyActivity(
  input: WeatherOnlyActivityInput,
): ActivityRules {
  const species = SPECIES_RULES[input.profile];
  const salmon = input.profile === "chinook_fall_reaction" ||
    input.profile === "coho_fall_reaction";
  const hasPositiveStageAdjustment = Object.values(
    input.stageResponseAdjustment ?? {},
  ).some((adjustment) => (adjustment ?? 0) > 0);

  return {
    version: input.version,
    profile: input.profile,
    dataMode: "weather_only",
    inputReach: {
      reachIds: input.reachIds,
      hydraulicSourceIds: [],
      waterTemperatureSourceIds: [],
      weatherPointIds: [input.weatherPointId],
      notes: input.inputNotes,
    },
    scopeCopy: input.scopeCopy,
    weights: { ...species.weights },
    temperature: { ...species.temperature },
    stageResponseAdjustment: input.stageResponseAdjustment,
    caps: {
      noMeasuredRiverData: 90,
      noWaterTemperature: 90,
      weatherOnlyMaximum: 90,
      weatherOnlyTomorrowMaximum: 85,
      ...(input.stageResponseAdjustment
        ? { stageResponseMaximum: hasPositiveStageAdjustment ? 80 : 90 }
        : {}),
      ...(!salmon ? { weatherOnlyEvidenceScale: 0.8 } : {}),
      lateRun: salmon ? 75 : 100,
      ending: species.ending,
      ...(salmon
        ? {
          taperingPenalty: 15,
          lifecycleRamp: input.lifecycle,
        }
        : {}),
    },
    evidenceNotes: input.evidenceNotes,
  };
}
