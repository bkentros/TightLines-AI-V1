import type {
  PierCastCityReportReadV4,
  PierCastConditionsMapResponseV4,
  PierCastLeaderboardResponseV4,
  PierCastSeasonalBandV4,
  PierCastSpeciesConditionsReadV4,
} from "./pierCastConditionsV4";
import type { PierCastSpeciesId } from "./pierCastContracts";
import {
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  getPierCastV3TemperatureCurve,
  type PierCastV3OpportunityMode,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration";
import {
  evaluatePierCastV3ModePotential,
  evaluatePierCastV3ModePotentials,
  pierCastV3RegulationClosureApplies,
} from "../supabase/functions/_shared/pierCastEngine/scoring/modesV3";
import { calculatePierCastV3Opportunity } from "../supabase/functions/_shared/pierCastEngine/scoring/opportunityV3";
import { evaluateTemperatureSuitability } from "../supabase/functions/_shared/pierCastEngine/scoring/temperature";
import { evaluatePierCastLakeTroutOpportunityV5 } from "./pierCastLakeTroutV5";
import { applyPierCastSalmonidBatch1V5 } from "./pierCastSalmonidBatch1V5";
import { applyPierCastSalmonidBatch2V5 } from "./pierCastSalmonidBatch2V5";

export const PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION =
  "piercast-opportunity-v5-1.17-target-summaries-v1" as const;

export type PierCastOpportunityTimingV5 =
  | "off"
  | "approaching"
  | "peak"
  | "past"
  | "in_season";

export type PierCastOpportunityEvaluationV5 = {
  score: number | null;
  availability: number;
  trend: "building" | "steady" | "fading";
  band: PierCastSeasonalBandV4 | null;
  timing: PierCastOpportunityTimingV5;
  closed: boolean;
  evidenceGrade: "A" | "B" | "C";
  evidenceIds: readonly string[];
  modeId: string;
};

function opportunityBand(score: number): PierCastSeasonalBandV4 {
  if (score > 8) return "excellent";
  if (score > 6) return "good";
  if (score > 4) return "fair";
  return "poor";
}

function shiftedLocalDate(localDate: string, days: number): string {
  const instant = new Date(`${localDate}T12:00:00.000Z`);
  instant.setUTCDate(instant.getUTCDate() + days);
  return instant.toISOString().slice(0, 10);
}

function modeTrend(input: {
  localDate: string;
  mode: PierCastV3OpportunityMode;
}): "building" | "steady" | "fading" {
  const before = evaluatePierCastV3ModePotential({
    localDate: shiftedLocalDate(input.localDate, -7),
    mode: input.mode,
  });
  const after = evaluatePierCastV3ModePotential({
    localDate: shiftedLocalDate(input.localDate, 7),
    mode: input.mode,
  });
  if (!before || !after) return "steady";
  const delta = after.seasonalAvailability - before.seasonalAvailability;
  return delta > 0.025 ? "building" : delta < -0.025 ? "fading" : "steady";
}

function timingFor(input: {
  availability: number;
  trend: "building" | "steady" | "fading";
  closed: boolean;
}): PierCastOpportunityTimingV5 {
  if (input.closed || input.availability < 0.05) return "off";
  if (input.availability >= 0.85) return "peak";
  if (input.trend === "building") return "approaching";
  if (input.trend === "fading") return "past";
  return "in_season";
}

/** Temperature suitability on the species' evidence-reviewed v3 curve. */
export function pierCastTemperatureSuitabilityV5(
  speciesId: PierCastSpeciesId,
  temperatureC: number | null,
): number | null {
  const result = evaluateTemperatureSuitability({
    ratingEnabled: true,
    mode: "review",
    monthEvidenceState: "sourced_biology",
    inputStatus: temperatureC === null ? "missing" : "valid",
    waterTemperatureC: temperatureC,
    curve: getPierCastV3TemperatureCurve(speciesId),
  });
  return result.status === "available" ? result.suitability : null;
}

/**
 * Canonical 1.17 candidate calculation for a city/species/local-date tuple.
 * The number never enters the UI; it only supplies ordering and word labels.
 */
export function evaluatePierCastOpportunityV5(input: {
  cityId: string;
  speciesId: PierCastSpeciesId;
  localDate: string;
  thermalValue: number | null;
}): PierCastOpportunityEvaluationV5 | null {
  if (input.speciesId === "lake_trout") {
    const lakeTrout = evaluatePierCastLakeTroutOpportunityV5({
      cityId: input.cityId,
      localDate: input.localDate,
      thermalValue: input.thermalValue,
    });
    return lakeTrout
      ? {
        score: lakeTrout.score,
        availability: lakeTrout.availability,
        trend: lakeTrout.trend,
        band: lakeTrout.band,
        timing: lakeTrout.timing,
        closed: lakeTrout.closed,
        evidenceGrade: lakeTrout.evidenceGrade,
        evidenceIds: lakeTrout.sourceIds,
        modeId: "lake_trout_all_city_v5",
      }
      : null;
  }
  const basePair = PIER_CAST_V3_PAIR_CALIBRATIONS.find((candidate) =>
    candidate.cityId === input.cityId && candidate.speciesId === input.speciesId
  );
  if (!basePair) return null;
  const pair = applyPierCastSalmonidBatch2V5(
    applyPierCastSalmonidBatch1V5(basePair),
  );
  const modes = evaluatePierCastV3ModePotentials({
    localDate: input.localDate,
    modes: pair.modes,
  });
  if (modes.length !== pair.modes.length) return null;
  const closed = pierCastV3RegulationClosureApplies({
    localDate: input.localDate,
    pair,
  });
  const opportunity = input.thermalValue === null
    ? null
    : calculatePierCastV3Opportunity({
      modes,
      temperatureSuitability: input.thermalValue,
      allowDisabledConfiguration: true,
    });
  const active = opportunity?.status === "available"
    ? opportunity.activeMode
    : [...modes].sort((left, right) =>
      right.seasonalPotential - left.seasonalPotential ||
      left.modeCalibrationId.localeCompare(right.modeCalibrationId)
    )[0] ?? null;
  if (!active) return null;
  const configuredMode = pair.modes.find((mode) =>
    mode.modeCalibrationId === active.modeCalibrationId
  );
  if (!configuredMode) return null;
  const trend = modeTrend({ localDate: input.localDate, mode: configuredMode });
  const score = opportunity?.status === "available" && !closed
    ? opportunity.score
    : null;
  const availability = active.seasonalAvailability;
  return {
    score,
    availability,
    trend,
    band: closed || availability < 0.05
      ? "usually_off"
      : score === null
      ? null
      : opportunityBand(score),
    timing: timingFor({ availability, trend, closed }),
    closed,
    evidenceGrade: configuredMode.evidenceGrade,
    evidenceIds: configuredMode.fisheryEvidenceIds,
    modeId: configuredMode.modeId,
  };
}

export function projectPierCastSpeciesConditionsV5(input: {
  cityId: string;
  species: PierCastSpeciesConditionsReadV4;
}): {
  species: PierCastSpeciesConditionsReadV4;
  evaluation: PierCastOpportunityEvaluationV5 | null;
} {
  const { species } = input;
  const localDate = species.seasonalOutlook.localDate;
  const thermalValue = species.thermalMatch.status === "available"
    ? species.thermalMatch.value
    : null;
  const evaluation = evaluatePierCastOpportunityV5({
    cityId: input.cityId,
    speciesId: species.speciesId,
    localDate,
    thermalValue,
  });
  if (!evaluation) return { species, evaluation: null };
  const restricted = species.targetingEligibility === "restricted" ||
    evaluation.closed;
  const unknown = species.targetingEligibility === "unknown";
  const ranked = !restricted && !unknown && evaluation.score !== null;
  const fallbackBand = species.seasonalOutlook.status === "available"
    ? species.seasonalOutlook.band
    : "poor";
  return {
    evaluation,
    species: {
      ...species,
      seasonalOutlook: {
        status: "available",
        value: Math.round(evaluation.availability * 10_000) / 10_000,
        band: evaluation.band ?? fallbackBand,
        stage: evaluation.timing === "off"
          ? "off"
          : evaluation.timing === "approaching"
          ? "building"
          : evaluation.timing === "past"
          ? "fading"
          : "active",
        trend: evaluation.trend,
        profileId: PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION,
        basis: "regional_with_local_context",
        localDate,
        reasonCodes: [
          `pier_cast_v5_timing:${evaluation.timing}`,
          `pier_cast_v5_mode:${evaluation.modeId}`,
        ],
      },
      targetingEligibility: evaluation.closed
        ? "restricted"
        : species.targetingEligibility,
      rankingDisposition: ranked
        ? "ranked"
        : restricted
        ? "blocked"
        : "unranked",
      localFisheryContext: {
        status: "available",
        label: evaluation.evidenceGrade === "A" ? "established" : "documented",
        evidenceIds: [...evaluation.evidenceIds],
        affectsRanking: false,
      },
      reasonCodes: evaluation.closed
        ? [...species.reasonCodes, "targeting_restricted"]
        : species.reasonCodes,
    },
  };
}

/** Applies the common hidden score to a non-lake-trout species leaderboard. */
export function projectPierCastLeaderboardV5(
  leaderboard: PierCastLeaderboardResponseV4,
): PierCastLeaderboardResponseV4 {
  const speciesId = leaderboard.selectedSpeciesId;
  if (!speciesId || speciesId === "lake_trout") return leaderboard;
  const evaluated = leaderboard.cities.map((row) => {
    const projected = projectPierCastSpeciesConditionsV5({
      cityId: row.cityId,
      species: row,
    });
    return {
      row: { ...row, ...projected.species, rank: null },
      score: projected.evaluation?.score ?? null,
    };
  });
  evaluated.sort((left, right) => {
    const leftRanked = left.row.rankingDisposition === "ranked";
    const rightRanked = right.row.rankingDisposition === "ranked";
    if (leftRanked !== rightRanked) return rightRanked ? 1 : -1;
    if (leftRanked && rightRanked) {
      const scoreDifference = (right.score ?? 0) - (left.score ?? 0);
      if (Math.abs(scoreDifference) > 0.0001) return scoreDifference;
      const rightThermal = right.row.thermalMatch.status === "available"
        ? right.row.thermalMatch.value
        : 0;
      const leftThermal = left.row.thermalMatch.status === "available"
        ? left.row.thermalMatch.value
        : 0;
      if (rightThermal !== leftThermal) return rightThermal - leftThermal;
    }
    return left.row.displayName.localeCompare(right.row.displayName);
  });
  let rank = 0;
  const cities = evaluated.map(({ row }) => ({
    ...row,
    rank: row.rankingDisposition === "ranked" ? ++rank : null,
  }));
  const bestSeasonalBand = cities.find((row) =>
    row.rankingDisposition === "ranked"
  )?.seasonalOutlook.band ?? null;
  return {
    ...leaderboard,
    targetSpecies: leaderboard.targetSpecies.map((option) =>
      option.speciesId === speciesId
        ? {
          ...option,
          bestSeasonalBand,
          availableCityCount: rank,
        }
        : option
    ),
    cities,
  };
}

function mapLocalDate(instant: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(instant));
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

function mapTemperatureAt(
  city: PierCastConditionsMapResponseV4["cities"][number],
  generatedAt: string,
): number | null {
  const target = Date.parse(generatedAt);
  if (!Number.isFinite(target)) return null;
  const point = city.temperatureTimeline.reduce<
    (typeof city.temperatureTimeline)[number] | null
  >((nearest, candidate) => {
    if (!Number.isFinite(candidate.temperatureC)) return nearest;
    if (!nearest) return candidate;
    return Math.abs(Date.parse(candidate.validAt) - target) <
        Math.abs(Date.parse(nearest.validAt) - target)
      ? candidate
      : nearest;
  }, null);
  return point?.temperatureC ?? null;
}

/**
 * Replaces every target picker's legacy relative-season summary with the
 * absolute v5 result. One all-city temperature map supplies every species, so
 * selecting a tab never changes its `Best` label merely by loading that board.
 */
export function projectPierCastTargetSpeciesSummariesV5(input: {
  leaderboard: PierCastLeaderboardResponseV4;
  map: PierCastConditionsMapResponseV4;
}): PierCastLeaderboardResponseV4 {
  const { leaderboard, map } = input;
  const selectedSpeciesId = leaderboard.selectedSpeciesId;
  return {
    ...leaderboard,
    targetSpecies: leaderboard.targetSpecies.map((option) => {
      // The fully projected selected board remains authoritative for its exact
      // eligibility gates and count.
      if (option.speciesId === selectedSpeciesId) return option;
      const evaluated = map.cities.flatMap((city) => {
        const temperatureC = mapTemperatureAt(city, leaderboard.generatedAt);
        const thermalValue = pierCastTemperatureSuitabilityV5(
          option.speciesId,
          temperatureC,
        );
        const opportunity = evaluatePierCastOpportunityV5({
          cityId: city.cityId,
          speciesId: option.speciesId,
          localDate: mapLocalDate(leaderboard.generatedAt, city.timezone),
          thermalValue,
        });
        return opportunity && opportunity.score !== null && !opportunity.closed
          ? [{
            cityId: city.cityId,
            score: opportunity.score,
            band: opportunity.band,
            thermalValue: thermalValue ?? 0,
          }]
          : [];
      }).sort((left, right) =>
        right.score - left.score ||
        right.thermalValue - left.thermalValue ||
        left.cityId.localeCompare(right.cityId)
      );
      return {
        ...option,
        bestSeasonalBand: evaluated[0]?.band ?? null,
        availableCityCount: evaluated.length,
      };
    }),
  };
}

/** Never present an unselected v4 seasonal phase as a v5 `Best today` label. */
export function clearUnverifiedPierCastTargetSummariesV5(
  leaderboard: PierCastLeaderboardResponseV4,
): PierCastLeaderboardResponseV4 {
  return {
    ...leaderboard,
    targetSpecies: leaderboard.targetSpecies.map((option) =>
      option.speciesId === leaderboard.selectedSpeciesId
        ? option
        : { ...option, bestSeasonalBand: null }
    ),
  };
}

/**
 * Projects every city-report label locally and removes old standings. This is
 * safe even when the selected leaderboard cannot be fetched, so a saved or
 * degraded report never exposes the v4 relative-season band as Today's label.
 */
export function projectPierCastCityReportLabelsV5(
  report: PierCastCityReportReadV4,
): PierCastCityReportReadV4 {
  const evaluated = report.species.map((species) => {
    const projected = projectPierCastSpeciesConditionsV5({
      cityId: report.cityId,
      species,
    });
    return {
      species: projected.species,
      score: projected.evaluation?.score ?? null,
    };
  });
  evaluated.sort((left, right) => {
    const leftRanked = left.species.rankingDisposition === "ranked";
    const rightRanked = right.species.rankingDisposition === "ranked";
    if (leftRanked !== rightRanked) return rightRanked ? 1 : -1;
    if (leftRanked && rightRanked) {
      const scoreDifference = (right.score ?? 0) - (left.score ?? 0);
      if (Math.abs(scoreDifference) > 0.0001) return scoreDifference;
      const thermalDifference =
        (right.species.thermalMatch.status === "available"
          ? right.species.thermalMatch.value
          : 0) -
        (left.species.thermalMatch.status === "available"
          ? left.species.thermalMatch.value
          : 0);
      if (thermalDifference !== 0) return thermalDifference;
    }
    return left.species.speciesId.localeCompare(right.species.speciesId);
  });
  return {
    ...report,
    species: evaluated.map(({ species }) => species),
    speciesStandings: [],
  };
}

/**
 * Adds only the selected species' verified v5 standing to a locally projected
 * report. This avoids a leaderboard fan-out for every species card.
 */
export function projectPierCastCityReportV5(input: {
  report: PierCastCityReportReadV4;
  selectedLeaderboard: PierCastLeaderboardResponseV4;
}): PierCastCityReportReadV4 {
  const report = projectPierCastCityReportLabelsV5(input.report);
  const selectedRow = input.selectedLeaderboard.cities.find((city) =>
    city.cityId === report.cityId &&
    city.rankingDisposition === "ranked" &&
    typeof city.rank === "number"
  );
  const rankedCityCount = input.selectedLeaderboard.cities.filter((city) =>
    city.rankingDisposition === "ranked"
  ).length;
  return {
    ...report,
    speciesStandings: selectedRow
      ? [{
        speciesId: report.selectedSpeciesId,
        rank: selectedRow.rank,
        rankedCityCount,
      }]
      : [],
  };
}
