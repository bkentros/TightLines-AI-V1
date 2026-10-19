import { PIER_CAST_V4_THERMAL_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/conditionsV4Thermal";
import {
  pierCastThermalBandV4,
  type PierCastThermalMatchReadV4,
  type PierCastThermalProfileV4,
} from "./pierCastConditionsV4";
import type { PierCastSpeciesId } from "./pierCastContracts";

/** The 18 app-supported profiles. Bluegill is intentionally not supported. */
export function pierCastTemperatureProfileV18(
  speciesId: PierCastSpeciesId,
): PierCastThermalProfileV4 | null {
  return PIER_CAST_V4_THERMAL_PROFILES.find((profile) =>
    profile.speciesId === speciesId
  ) ?? null;
}

export function pierCastTemperatureSuitabilityV18(
  speciesId: PierCastSpeciesId,
  temperatureC: number | null,
): number | null {
  if (temperatureC === null || !Number.isFinite(temperatureC)) return null;
  const profile = pierCastTemperatureProfileV18(speciesId);
  if (!profile) return null;
  const [minimum, maximum] = profile.acceptedDomainC;
  if (temperatureC < minimum || temperatureC > maximum) return null;
  const exact = profile.knots.find((knot) =>
    knot.temperatureC === temperatureC
  );
  if (exact) return exact.suitability;
  const upperIndex = profile.knots.findIndex((knot) =>
    knot.temperatureC > temperatureC
  );
  if (upperIndex <= 0) return null;
  const lower = profile.knots[upperIndex - 1]!;
  const upper = profile.knots[upperIndex]!;
  const progress = (temperatureC - lower.temperatureC) /
    (upper.temperatureC - lower.temperatureC);
  return lower.suitability +
    (upper.suitability - lower.suitability) * progress;
}

/**
 * Reprojects a server thermal read through the app-bundled 1.18 profile.
 * This keeps v18 correct before a matching backend rollout and leaves older
 * installed app versions untouched because the wire contract does not change.
 */
export function projectPierCastThermalMatchV18(
  speciesId: PierCastSpeciesId,
  thermal: PierCastThermalMatchReadV4,
): PierCastThermalMatchReadV4 {
  if (thermal.status !== "available") return thermal;
  const profile = pierCastTemperatureProfileV18(speciesId);
  const value = pierCastTemperatureSuitabilityV18(
    speciesId,
    thermal.temperatureC,
  );
  const band = value === null ? null : pierCastThermalBandV4(value);
  if (!profile || value === null || !band) return thermal;
  const [minimum, maximum] = profile.optimumRangeC;
  const distanceFromOptimumC = thermal.temperatureC < minimum
    ? minimum - thermal.temperatureC
    : thermal.temperatureC > maximum
    ? thermal.temperatureC - maximum
    : 0;
  return {
    ...thermal,
    value: Math.round(value * 10_000) / 10_000,
    band,
    optimumRangeC: profile.optimumRangeC,
    distanceFromOptimumC: Math.round(distanceFromOptimumC * 1_000) / 1_000,
    curveId: profile.curveId,
  };
}

export function pierCastWaterFitLabelV18(
  thermal: PierCastThermalMatchReadV4,
): "Excellent fit" | "Good fit" | "Fair fit" | "Poor fit" | null {
  if (thermal.status !== "available") return null;
  switch (thermal.band) {
    case "excellent":
      return "Excellent fit";
    case "good":
      return "Good fit";
    case "fair":
      return "Fair fit";
    case "poor":
      return "Poor fit";
  }
}
