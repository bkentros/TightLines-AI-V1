import {
  PIER_CAST_V3_THERMAL_FLOOR,
  PIER_CAST_V3_THERMAL_WEIGHT,
  type PierCastV3ModePotential,
  type PierCastV3OpportunityRead,
} from "../config/v3Calibration.ts";

export function calculatePierCastV3ModeScore(input: {
  mode: PierCastV3ModePotential;
  temperatureSuitability: number;
}): number | null {
  const { mode, temperatureSuitability } = input;
  if (
    !Number.isFinite(mode.seasonalPotential) || mode.seasonalPotential < 1 ||
    mode.seasonalPotential > mode.fisheryStrength ||
    mode.fisheryStrength < 2.1 ||
    mode.fisheryStrength > 10 ||
    !Number.isFinite(temperatureSuitability) || temperatureSuitability < 0 ||
    temperatureSuitability > 1
  ) return null;
  const modifier = PIER_CAST_V3_THERMAL_FLOOR +
    PIER_CAST_V3_THERMAL_WEIGHT * temperatureSuitability;
  return 1 + (mode.seasonalPotential - 1) * modifier;
}

export function calculatePierCastV3Opportunity(input: {
  modes: readonly PierCastV3ModePotential[];
  temperatureSuitability: number;
  allowDisabledConfiguration: boolean;
}): PierCastV3OpportunityRead {
  if (!input.allowDisabledConfiguration) {
    return unavailable("v3_configuration_disabled");
  }
  if (input.modes.length === 0) {
    return unavailable("v3_mode_configuration_invalid");
  }
  const scored = input.modes.map((mode) => ({
    mode,
    score: calculatePierCastV3ModeScore({
      mode,
      temperatureSuitability: input.temperatureSuitability,
    }),
  }));
  if (scored.some((candidate) => candidate.score === null)) {
    return unavailable("v3_opportunity_input_invalid");
  }
  scored.sort((left, right) =>
    right.score! - left.score! ||
    left.mode.modeCalibrationId.localeCompare(right.mode.modeCalibrationId)
  );
  const selected = scored[0];
  return {
    status: "available",
    score: selected.score!,
    activeMode: selected.mode,
    temperatureSuitability: input.temperatureSuitability,
    temperatureModifier: PIER_CAST_V3_THERMAL_FLOOR +
      PIER_CAST_V3_THERMAL_WEIGHT * input.temperatureSuitability,
    reasonCodes: [],
  };
}

function unavailable(reason: string): PierCastV3OpportunityRead {
  return {
    status: "unavailable",
    score: null,
    activeMode: null,
    temperatureSuitability: null,
    temperatureModifier: null,
    reasonCodes: [reason],
  };
}
