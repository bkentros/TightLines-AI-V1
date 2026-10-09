import type {
  PierCastConditionsMapResponseV4,
  PierCastLeaderboardCityReadV4,
  PierCastLeaderboardResponseV4,
  PierCastSeasonalBandV4,
  PierCastThermalBandV4,
  PierCastThermalMatchReadV4,
} from "./pierCastConditionsV4";
import {
  getPierCastLakeTroutV5Candidate,
  PIER_CAST_LAKE_TROUT_V5_APP_ENABLED,
  PIER_CAST_LAKE_TROUT_V5_CANDIDATES,
  PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION,
} from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate";

// Keep aligned with conditionsV4Thermal.ts. This small app-safe mirror avoids
// bundling the entire server calibration module into the 1.17 client.
const LAKE_TROUT_PROFILE = {
  curveId: "lake_trout__modeled_nearshore_surface__2026_09_v1",
  acceptedDomainC: [0, 38] as const,
  optimumRangeC: [9, 12] as const,
  knots: [
    { temperatureC: 0, suitability: 0.65 },
    { temperatureC: 4, suitability: 0.85 },
    { temperatureC: 9, suitability: 1 },
    { temperatureC: 12, suitability: 1 },
    { temperatureC: 14, suitability: 0.85 },
    { temperatureC: 16, suitability: 0.65 },
    { temperatureC: 18.5, suitability: 0.35 },
    { temperatureC: 24, suitability: 0.05 },
    { temperatureC: 38, suitability: 0.01 },
  ],
} as const;
const THERMAL_FLOOR = 0.3;
const THERMAL_WEIGHT = 0.7;

type Candidate = (typeof PIER_CAST_LAKE_TROUT_V5_CANDIDATES)[number];
type NumericCandidate = Candidate & {
  fisheryStrength: number;
  monthlyAvailability: readonly number[];
};

function isNumericCandidate(candidate: Candidate): candidate is NumericCandidate {
  return candidate.fisheryStrength !== null && candidate.monthlyAvailability !== null;
}

export function isPierCastLakeTroutV5ScoredCity(cityId: string): boolean {
  const candidate = getPierCastLakeTroutV5Candidate(cityId);
  return candidate !== null && isNumericCandidate(candidate);
}

export function pierCastLakeTroutV5NeedsMap(
  leaderboard: PierCastLeaderboardResponseV4,
): boolean {
  if (leaderboard.selectedSpeciesId !== "lake_trout") return false;
  if (!PIER_CAST_LAKE_TROUT_V5_APP_ENABLED) return false;
  const present = new Set(leaderboard.cities.map((city) => city.cityId));
  return PIER_CAST_LAKE_TROUT_V5_CANDIDATES.some((candidate) =>
    isNumericCandidate(candidate) && !present.has(candidate.cityId)
  );
}

function localDateAt(instant: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(instant));
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

function parseLocalDate(localDate: string): Date {
  return new Date(`${localDate}T12:00:00.000Z`);
}

function monthlyAvailabilityAt(
  monthly: readonly number[],
  localDate: string,
): number {
  const target = parseLocalDate(localDate);
  const year = target.getUTCFullYear();
  const month = target.getUTCMonth();
  const center = Date.UTC(year, month, 15, 12);
  const beforeCenter = target.getTime() < center;
  const lowerMonth = beforeCenter ? month - 1 : month;
  const upperMonth = lowerMonth + 1;
  const lowerTime = Date.UTC(year, lowerMonth, 15, 12);
  const upperTime = Date.UTC(year, upperMonth, 15, 12);
  const lowerValue = monthly[(lowerMonth + 12) % 12]!;
  const upperValue = monthly[(upperMonth + 12) % 12]!;
  const progress = (target.getTime() - lowerTime) / (upperTime - lowerTime);
  return lowerValue + progress * (upperValue - lowerValue);
}

function availabilityTrend(
  monthly: readonly number[],
  localDate: string,
): "building" | "steady" | "fading" {
  const target = parseLocalDate(localDate);
  const before = new Date(target.getTime() - 7 * 86_400_000)
    .toISOString().slice(0, 10);
  const after = new Date(target.getTime() + 7 * 86_400_000)
    .toISOString().slice(0, 10);
  const delta = monthlyAvailabilityAt(monthly, after) -
    monthlyAvailabilityAt(monthly, before);
  return delta > 0.025 ? "building" : delta < -0.025 ? "fading" : "steady";
}

function opportunityBand(score: number): PierCastSeasonalBandV4 {
  if (score > 8) return "excellent";
  if (score > 6) return "good";
  if (score > 4) return "fair";
  return "poor";
}

function thermalBand(value: number): PierCastThermalBandV4 {
  if (value >= 0.85) return "excellent";
  if (value >= 0.65) return "good";
  if (value >= 0.35) return "fair";
  return "poor";
}

function unavailableThermal(): PierCastThermalMatchReadV4 {
  return {
    status: "unavailable",
    value: null,
    band: null,
    temperatureC: null,
    optimumRangeC: null,
    distanceFromOptimumC: null,
    curveId: LAKE_TROUT_PROFILE?.curveId ?? null,
    validAt: null,
    sourceKind: "model",
    reasonCodes: ["temperature_missing"],
  };
}

function interpolateThermal(
  profile: typeof LAKE_TROUT_PROFILE,
  temperatureC: number,
): number | null {
  const exact = profile.knots.find((knot) => knot.temperatureC === temperatureC);
  if (exact) return exact.suitability;
  const upperIndex = profile.knots.findIndex((knot) => knot.temperatureC > temperatureC);
  if (upperIndex <= 0) return null;
  const lower = profile.knots[upperIndex - 1]!;
  const upper = profile.knots[upperIndex]!;
  const progress = (temperatureC - lower.temperatureC) /
    (upper.temperatureC - lower.temperatureC);
  return lower.suitability + progress * (upper.suitability - lower.suitability);
}

function thermalFromMap(
  city: PierCastConditionsMapResponseV4["cities"][number] | undefined,
  generatedAt: string,
): PierCastThermalMatchReadV4 {
  if (!city || city.temperatureTimeline.length === 0) {
    return unavailableThermal();
  }
  const target = Date.parse(generatedAt);
  const point = [...city.temperatureTimeline].sort((left, right) =>
    Math.abs(Date.parse(left.validAt) - target) -
    Math.abs(Date.parse(right.validAt) - target)
  )[0];
  if (!point) return unavailableThermal();
  const value = interpolateThermal(LAKE_TROUT_PROFILE, point.temperatureC);
  if (value === null) return unavailableThermal();
  const [minimum, maximum] = LAKE_TROUT_PROFILE.optimumRangeC;
  const distance = point.temperatureC < minimum
    ? minimum - point.temperatureC
    : point.temperatureC > maximum
    ? point.temperatureC - maximum
    : 0;
  return {
    status: "available",
    value: Math.round(value * 10_000) / 10_000,
    band: thermalBand(value),
    temperatureC: point.temperatureC,
    optimumRangeC: LAKE_TROUT_PROFILE.optimumRangeC,
    distanceFromOptimumC: Math.round(distance * 1_000) / 1_000,
    curveId: LAKE_TROUT_PROFILE.curveId,
    validAt: point.validAt,
    sourceKind: "model",
    reasonCodes: [],
  };
}

function holdRow(
  candidate: Candidate,
  existing: PierCastLeaderboardCityReadV4 | undefined,
  mapCity: PierCastConditionsMapResponseV4["cities"][number] | undefined,
  generatedAt: string,
): PierCastLeaderboardCityReadV4 | null {
  if (!existing && !mapCity) return null;
  const timezone = existing?.timezone ?? mapCity!.timezone;
  const localDate = localDateAt(generatedAt, timezone);
  return {
    speciesId: "lake_trout",
    cityId: candidate.cityId,
    displayName: existing?.displayName ?? mapCity!.displayName,
    lakeId: existing?.lakeId ?? mapCity!.lakeId,
    stateCode: existing?.stateCode ?? mapCity!.stateCode,
    timezone,
    rank: null,
    seasonalOutlook: {
      status: "unavailable",
      value: null,
      band: null,
      stage: null,
      trend: null,
      profileId: PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION,
      basis: null,
      localDate,
      reasonCodes: ["seasonal_profile_missing"],
    },
    thermalMatch: existing?.thermalMatch ?? thermalFromMap(mapCity, generatedAt),
    targetingEligibility: "unknown",
    rankingDisposition: "unranked",
    localFisheryContext: {
      status: "unavailable",
      label: null,
      evidenceIds: [...candidate.sourceIds],
      affectsRanking: false,
    },
    reasonCodes: ["lake_trout_research_hold"],
  };
}

/**
 * Applies the owner-approved v5 lake-trout calibration to the real standings
 * response without changing the frozen v4 wire contract. Internal scores are
 * used only for labels and ordering and never added to the returned payload.
 */
export function projectPierCastLakeTroutStandingsV5(input: {
  leaderboard: PierCastLeaderboardResponseV4;
  map?: PierCastConditionsMapResponseV4 | null;
}): PierCastLeaderboardResponseV4 {
  const { leaderboard, map = null } = input;
  if (leaderboard.selectedSpeciesId !== "lake_trout") return leaderboard;
  if (!PIER_CAST_LAKE_TROUT_V5_APP_ENABLED) return leaderboard;
  const existingById = new Map(leaderboard.cities.map((city) => [city.cityId, city]));
  const mapById = new Map((map?.cities ?? []).map((city) => [city.cityId, city]));
  const scoreById = new Map<string, number>();
  const rows = PIER_CAST_LAKE_TROUT_V5_CANDIDATES.flatMap((candidate) => {
    const existing = existingById.get(candidate.cityId);
    const mapCity = mapById.get(candidate.cityId);
    if (!isNumericCandidate(candidate)) {
      const row = holdRow(candidate, existing, mapCity, leaderboard.generatedAt);
      return row ? [row] : [];
    }
    if (!existing && !mapCity) return [];
    const timezone = existing?.timezone ?? mapCity!.timezone;
    const localDate = localDateAt(leaderboard.generatedAt, timezone);
    const month = Number(localDate.slice(5, 7));
    const closed = (candidate.closedMonths as readonly number[]).includes(month);
    const availability = closed
      ? 0
      : monthlyAvailabilityAt(candidate.monthlyAvailability, localDate);
    const trend = availabilityTrend(candidate.monthlyAvailability, localDate);
    const thermal = existing?.thermalMatch.status === "available"
      ? existing.thermalMatch
      : thermalFromMap(mapCity, leaderboard.generatedAt);
    const thermalValue = thermal.status === "available" ? thermal.value : null;
    const score = thermalValue === null
      ? null
      : 1 + (candidate.fisheryStrength - 1) * availability *
        (THERMAL_FLOOR + THERMAL_WEIGHT * thermalValue);
    if (score !== null) scoreById.set(candidate.cityId, score);
    const band = closed || availability < 0.05
      ? "usually_off" as const
      : score === null
      ? null
      : opportunityBand(score);
    const timing = closed || availability < 0.05
      ? "off"
      : availability >= 0.85
      ? "peak"
      : trend === "building"
      ? "approaching"
      : trend === "fading"
      ? "past"
      : "in_season";
    const eligible = !closed;
    const ranked = eligible && score !== null;
    const row: PierCastLeaderboardCityReadV4 = {
      speciesId: "lake_trout",
      cityId: candidate.cityId,
      displayName: existing?.displayName ?? mapCity!.displayName,
      lakeId: existing?.lakeId ?? mapCity!.lakeId,
      stateCode: existing?.stateCode ?? mapCity!.stateCode,
      timezone,
      rank: null,
      seasonalOutlook: {
        status: "available",
        value: Math.round(availability * 10_000) / 10_000,
        band: band ?? "poor",
        stage: timing === "off"
          ? "off"
          : timing === "approaching"
          ? "building"
          : timing === "past"
          ? "fading"
          : "active",
        trend,
        profileId: PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION,
        basis: "regional_with_local_context",
        localDate,
        reasonCodes: [`lake_trout_v5_timing:${timing}`],
      },
      thermalMatch: thermal,
      targetingEligibility: eligible ? "eligible" : "restricted",
      rankingDisposition: ranked ? "ranked" : eligible ? "unranked" : "blocked",
      localFisheryContext: {
        status: "available",
        label: candidate.evidenceGrade === "A"
          ? "established"
          : candidate.evidenceGrade === "B"
          ? "documented"
          : "limited_evidence",
        evidenceIds: [...candidate.sourceIds],
        affectsRanking: false,
      },
      reasonCodes: closed ? ["targeting_restricted"] : [],
    };
    return [row];
  });
  rows.sort((left, right) => {
    const leftRanked = left.rankingDisposition === "ranked";
    const rightRanked = right.rankingDisposition === "ranked";
    if (leftRanked !== rightRanked) return rightRanked ? 1 : -1;
    if (leftRanked && rightRanked) {
      const scoreDifference = (scoreById.get(right.cityId) ?? 0) -
        (scoreById.get(left.cityId) ?? 0);
      if (Math.abs(scoreDifference) > 0.0001) return scoreDifference;
      const rightThermal = right.thermalMatch.status === "available"
        ? right.thermalMatch.value
        : 0;
      const leftThermal = left.thermalMatch.status === "available"
        ? left.thermalMatch.value
        : 0;
      if (rightThermal !== leftThermal) return rightThermal - leftThermal;
    }
    return left.displayName.localeCompare(right.displayName);
  });
  let rank = 0;
  const rankedRows = rows.map((row) => ({
    ...row,
    rank: row.rankingDisposition === "ranked" ? ++rank : null,
  }));
  const bestBand = rankedRows.find((row) => row.rankingDisposition === "ranked")
    ?.seasonalOutlook.band ?? null;
  const targetSpecies = leaderboard.targetSpecies.map((option) =>
    option.speciesId === "lake_trout"
      ? {
        ...option,
        bestSeasonalBand: bestBand,
        availableCityCount: rankedRows.filter((row) =>
          row.rankingDisposition === "ranked"
        ).length,
      }
      : option
  );
  return { ...leaderboard, targetSpecies, cities: rankedRows };
}
