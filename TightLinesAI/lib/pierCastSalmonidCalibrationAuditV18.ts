import type { PierCastSeasonalBandV4 } from "./pierCastConditionsV4.ts";
import type { PierCastSpeciesId } from "./pierCastContracts.ts";
import {
  evaluatePierCastOpportunityV5,
  getPierCastOpportunityPairV5,
} from "./pierCastOpportunityV5.ts";
import {
  PIER_CAST_MAIN_WINDOW_MIN_AVAILABILITY,
  type PierCastOpportunityLabelV5,
  pierCastOpportunityLabelV5,
  type PierCastSeasonTimingLabelV5,
  pierCastSeasonTimingLabelV5,
} from "./pierCastOpportunityPresentationV5.ts";
import {
  PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION,
  PIER_CAST_LAKE_TROUT_V5_CANDIDATES,
} from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate.ts";
import {
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_V3_THERMAL_FLOOR,
  PIER_CAST_V3_THERMAL_WEIGHT,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import { evaluatePierCastV3ModePotentials } from "../supabase/functions/_shared/pierCastEngine/scoring/modesV3.ts";

export const PIER_CAST_SALMONID_CALIBRATION_AUDIT_VERSION =
  "piercast-salmonid-calibration-audit-1.18-v1" as const;
export const PIER_CAST_SALMONID_CALIBRATION_AUDIT_YEAR = 2028 as const;

export const PIER_CAST_SALMONID_AUDIT_SPECIES = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
  "atlantic_salmon",
] as const satisfies readonly PierCastSpeciesId[];

export const PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS = [
  { id: "excellent", suitability: 1 },
  { id: "good", suitability: 0.75 },
  { id: "fair", suitability: 0.5 },
  { id: "poor", suitability: 0.2 },
] as const;

type AuditSpeciesId = typeof PIER_CAST_SALMONID_AUDIT_SPECIES[number];
type ThermalScenarioId =
  typeof PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS[number]["id"];
type FindingSeverity = "error" | "review";

export type PierCastSalmonidCalibrationAuditRowV18 = Readonly<{
  pairKey: string;
  cityId: string;
  speciesId: AuditSpeciesId;
  localDate: string;
  thermalScenario: ThermalScenarioId;
  thermalSuitability: number;
  temperatureModifier: number;
  status: "scored" | "closed" | "research_hold" | "unavailable";
  fisheryStrengthCeiling: number | null;
  activeFisheryStrength: number | null;
  activeModeId: string | null;
  activeModeCalibrationId: string | null;
  seasonalAvailability: number | null;
  trend: "building" | "steady" | "fading" | null;
  score: number | null;
  todayLabel: PierCastOpportunityLabelV5 | null;
  seasonPhase: PierCastSeasonTimingLabelV5 | null;
  internalBand: PierCastSeasonalBandV4 | null;
  legacyTiming: string | null;
}>;

export type PierCastSalmonidAuditFindingExampleV18 = Readonly<{
  pairKey: string;
  localDate: string | null;
  detail: string;
}>;

export type PierCastSalmonidAuditFindingGroupV18 = Readonly<{
  severity: FindingSeverity;
  code: string;
  count: number;
  examples: readonly PierCastSalmonidAuditFindingExampleV18[];
}>;

type LabelCounts = Record<PierCastOpportunityLabelV5, number>;
type PhaseCounts = Record<PierCastSeasonTimingLabelV5, number>;

export type PierCastSalmonidAuditPairSummaryV18 = Readonly<{
  pairKey: string;
  cityId: string;
  speciesId: AuditSpeciesId;
  status: "scored" | "research_hold";
  evidenceGrade: "A" | "B" | "C";
  fisheryStrengthCeiling: number | null;
  modeCount: number;
  closedDayCount: number;
  modeHandoffCount: number;
  modeSelectionTieDayCount: number;
  maximumExcellentScore: number | null;
  maximumExcellentLabel: PierCastOpportunityLabelV5 | null;
  excellentScenarioLabelDays: LabelCounts;
  excellentScenarioPhaseDays: PhaseCounts;
}>;

export type PierCastSalmonidCalibrationAuditReportV18 = Readonly<{
  schemaVersion: typeof PIER_CAST_SALMONID_CALIBRATION_AUDIT_VERSION;
  auditYear: typeof PIER_CAST_SALMONID_CALIBRATION_AUDIT_YEAR;
  inputs: Readonly<{
    lakeTroutCalibrationVersion:
      typeof PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION;
    thermalFloor: number;
    thermalWeight: number;
    thermalScenarios: typeof PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS;
  }>;
  coverage: Readonly<{
    cityCount: number;
    speciesCount: number;
    pairCount: number;
    scoredPairCount: number;
    researchHoldPairCount: number;
    dayCount: number;
    scenarioCount: number;
    expectedRowCount: number;
    auditedRowCount: number;
    scoredRowCount: number;
    closedRowCount: number;
    researchHoldRowCount: number;
    pairCountBySpecies: Readonly<Record<AuditSpeciesId, number>>;
  }>;
  distributions: Readonly<{
    labelsByScenario: Readonly<Record<ThermalScenarioId, LabelCounts>>;
    phasesByScenario: Readonly<Record<ThermalScenarioId, PhaseCounts>>;
  }>;
  findings: readonly PierCastSalmonidAuditFindingGroupV18[];
  errorCount: number;
  reviewCount: number;
  pairs: readonly PierCastSalmonidAuditPairSummaryV18[];
  limitations: readonly string[];
}>;

type ExcellentDay = Readonly<{
  localDate: string;
  score: number | null;
  label: PierCastOpportunityLabelV5 | null;
  phase: PierCastSeasonTimingLabelV5;
  availability: number;
  modeId: string;
  closed: boolean;
}>;

type FindingAccumulator = {
  severity: FindingSeverity;
  count: number;
  examples: PierCastSalmonidAuditFindingExampleV18[];
};

const MAX_FINDING_EXAMPLES = 5;

function emptyLabelCounts(): LabelCounts {
  return { Prime: 0, Good: 0, Fair: 0, Limited: 0 };
}

function emptyPhaseCounts(): PhaseCounts {
  return {
    "Peak window": 0,
    "In season": 0,
    Building: 0,
    Tapering: 0,
    "Outside main window": 0,
  };
}

function dateSequence(year: number): string[] {
  const dates: string[] = [];
  for (
    let time = Date.UTC(year, 0, 1, 12);
    new Date(time).getUTCFullYear() === year;
    time += 86_400_000
  ) {
    dates.push(new Date(time).toISOString().slice(0, 10));
  }
  return dates;
}

function expectedBand(score: number): PierCastSeasonalBandV4 {
  if (score > 8) return "excellent";
  if (score > 6) return "good";
  if (score > 4) return "fair";
  return "poor";
}

function labelRank(label: PierCastOpportunityLabelV5 | null): number {
  if (label === "Prime") return 3;
  if (label === "Good") return 2;
  if (label === "Fair") return 1;
  return 0;
}

function rounded(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

/**
 * Executes the complete, deterministic calibration audit in memory. It does
 * not read live conditions, contact a service, or mutate calibration data.
 */
export function buildPierCastSalmonidCalibrationAuditV18(options: {
  onRow?: (row: PierCastSalmonidCalibrationAuditRowV18) => void;
} = {}): PierCastSalmonidCalibrationAuditReportV18 {
  const dates = dateSequence(PIER_CAST_SALMONID_CALIBRATION_AUDIT_YEAR);
  const speciesSet = new Set<string>(PIER_CAST_SALMONID_AUDIT_SPECIES);
  const nonLakePairs = PIER_CAST_V3_PAIR_CALIBRATIONS
    .filter((pair) =>
      pair.speciesId !== "lake_trout" && speciesSet.has(pair.speciesId)
    )
    .map((pair) => ({
      kind: "modes" as const,
      pairKey: pair.pairKey,
      cityId: pair.cityId,
      speciesId: pair.speciesId as AuditSpeciesId,
    }));
  const lakePairs = PIER_CAST_LAKE_TROUT_V5_CANDIDATES.map((candidate) => ({
    kind: "lake_trout" as const,
    pairKey: `${candidate.cityId}__lake_trout`,
    cityId: candidate.cityId,
    speciesId: "lake_trout" as const,
    candidate,
  }));
  const pairs = [...nonLakePairs, ...lakePairs].sort((left, right) =>
    left.speciesId.localeCompare(right.speciesId) ||
    left.cityId.localeCompare(right.cityId)
  );

  const findings = new Map<string, FindingAccumulator>();
  const addFinding = (input: {
    severity: FindingSeverity;
    code: string;
    pairKey: string;
    localDate?: string;
    detail: string;
  }) => {
    const key = `${input.severity}:${input.code}`;
    const current = findings.get(key) ?? {
      severity: input.severity,
      count: 0,
      examples: [],
    };
    current.count += 1;
    if (current.examples.length < MAX_FINDING_EXAMPLES) {
      current.examples.push({
        pairKey: input.pairKey,
        localDate: input.localDate ?? null,
        detail: input.detail,
      });
    }
    findings.set(key, current);
  };

  const coveredCityIds = new Set(pairs.map((pair) => pair.cityId));
  for (const cityId of PIER_CAST_V3_CITY_IDS) {
    if (!coveredCityIds.has(cityId)) {
      addFinding({
        severity: "error",
        code: "supported_city_missing",
        pairKey: cityId,
        detail: "No audited salmonid pair exists for this supported city.",
      });
    }
  }
  for (const speciesId of PIER_CAST_SALMONID_AUDIT_SPECIES) {
    if (!pairs.some((pair) => pair.speciesId === speciesId)) {
      addFinding({
        severity: "error",
        code: "supported_species_missing",
        pairKey: speciesId,
        detail: "No audited city pair exists for this supported species.",
      });
    }
  }
  const pairKeyCounts = new Map<string, number>();
  for (const pair of pairs) {
    pairKeyCounts.set(pair.pairKey, (pairKeyCounts.get(pair.pairKey) ?? 0) + 1);
  }
  for (const [pairKey, count] of pairKeyCounts) {
    if (count > 1) {
      addFinding({
        severity: "error",
        code: "duplicate_pair_key",
        pairKey,
        detail: `Pair key occurs ${count} times in the audit manifest.`,
      });
    }
  }

  const labelsByScenario = Object.fromEntries(
    PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS.map((scenario) => [
      scenario.id,
      emptyLabelCounts(),
    ]),
  ) as Record<ThermalScenarioId, LabelCounts>;
  const phasesByScenario = Object.fromEntries(
    PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS.map((scenario) => [
      scenario.id,
      emptyPhaseCounts(),
    ]),
  ) as Record<ThermalScenarioId, PhaseCounts>;
  const pairCountBySpecies = Object.fromEntries(
    PIER_CAST_SALMONID_AUDIT_SPECIES.map((speciesId) => [speciesId, 0]),
  ) as Record<AuditSpeciesId, number>;

  let auditedRowCount = 0;
  let scoredRowCount = 0;
  let closedRowCount = 0;
  let researchHoldRowCount = 0;
  const pairSummaries: PierCastSalmonidAuditPairSummaryV18[] = [];

  for (const descriptor of pairs) {
    pairCountBySpecies[descriptor.speciesId] += 1;
    const pair = descriptor.kind === "modes"
      ? getPierCastOpportunityPairV5({
        cityId: descriptor.cityId,
        speciesId: descriptor.speciesId,
      })
      : null;
    const hold = descriptor.kind === "lake_trout" &&
      (descriptor.candidate.fisheryStrength === null ||
        descriptor.candidate.monthlyAvailability === null);
    const evidenceGrade = descriptor.kind === "lake_trout"
      ? descriptor.candidate.evidenceGrade
      : pair?.modes.reduce<"A" | "B">(
        (grade, mode) =>
          grade === "A" && mode.evidenceGrade === "A" ? "A" : "B",
        "A",
      ) ?? "B";
    const fisheryStrengthCeiling = descriptor.kind === "lake_trout"
      ? descriptor.candidate.fisheryStrength
      : pair
      ? Math.max(...pair.modes.map((mode) => mode.fisheryStrength))
      : null;
    const modeCount = descriptor.kind === "lake_trout"
      ? (hold ? 0 : 1)
      : pair?.modes.length ?? 0;
    const excellentDays: ExcellentDay[] = [];
    let closedDayCount = 0;
    let tieDayCount = 0;

    if (descriptor.kind === "modes" && !pair) {
      addFinding({
        severity: "error",
        code: "effective_pair_missing",
        pairKey: descriptor.pairKey,
        detail: "The app-local calibration accessor returned no pair.",
      });
    }

    for (const localDate of dates) {
      if (hold) {
        for (const scenario of PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS) {
          auditedRowCount += 1;
          researchHoldRowCount += 1;
          options.onRow?.({
            pairKey: descriptor.pairKey,
            cityId: descriptor.cityId,
            speciesId: descriptor.speciesId,
            localDate,
            thermalScenario: scenario.id,
            thermalSuitability: scenario.suitability,
            temperatureModifier: rounded(
              PIER_CAST_V3_THERMAL_FLOOR +
                PIER_CAST_V3_THERMAL_WEIGHT * scenario.suitability,
            ),
            status: "research_hold",
            fisheryStrengthCeiling: null,
            activeFisheryStrength: null,
            activeModeId: null,
            activeModeCalibrationId: null,
            seasonalAvailability: null,
            trend: null,
            score: null,
            todayLabel: null,
            seasonPhase: null,
            internalBand: null,
            legacyTiming: null,
          });
        }
        continue;
      }

      let expectedModeId: string | null = descriptor.kind === "lake_trout"
        ? "lake_trout_all_city_v5"
        : null;
      let expectedModeCalibrationId: string | null =
        descriptor.kind === "lake_trout"
          ? `${descriptor.cityId}__lake_trout_all_city_v5`
          : null;
      let activeFisheryStrength: number | null =
        descriptor.kind === "lake_trout"
          ? descriptor.candidate.fisheryStrength
          : null;
      if (pair) {
        const potentials = evaluatePierCastV3ModePotentials({
          localDate,
          modes: pair.modes,
        });
        if (
          potentials.length !== pair.modes.length || potentials.length === 0
        ) {
          addFinding({
            severity: "error",
            code: "mode_evaluation_incomplete",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `${potentials.length}/${pair.modes.length} modes evaluated.`,
          });
        } else {
          potentials.sort((left, right) =>
            right.seasonalPotential - left.seasonalPotential ||
            left.modeCalibrationId.localeCompare(right.modeCalibrationId)
          );
          expectedModeId = potentials[0]!.modeId;
          expectedModeCalibrationId = potentials[0]!.modeCalibrationId;
          activeFisheryStrength = potentials[0]!.fisheryStrength;
          if (
            potentials.length > 1 &&
            Math.abs(
                potentials[0]!.seasonalPotential -
                  potentials[1]!.seasonalPotential,
              ) <= 1e-12
          ) {
            tieDayCount += 1;
          }
        }
      }

      let countedClosedDay = false;
      let priorScenarioScore: number | null = null;
      let referenceSeasonalState:
        | Readonly<{
          availability: number;
          trend: "building" | "steady" | "fading";
          closed: boolean;
          modeId: string;
        }>
        | null = null;
      for (const scenario of PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS) {
        auditedRowCount += 1;
        const evaluation = evaluatePierCastOpportunityV5({
          cityId: descriptor.cityId,
          speciesId: descriptor.speciesId,
          localDate,
          thermalValue: scenario.suitability,
        });
        if (!evaluation) {
          addFinding({
            severity: "error",
            code: "evaluation_missing",
            pairKey: descriptor.pairKey,
            localDate,
            detail: `No evaluation for ${scenario.id} thermal suitability.`,
          });
          options.onRow?.({
            pairKey: descriptor.pairKey,
            cityId: descriptor.cityId,
            speciesId: descriptor.speciesId,
            localDate,
            thermalScenario: scenario.id,
            thermalSuitability: scenario.suitability,
            temperatureModifier: rounded(
              PIER_CAST_V3_THERMAL_FLOOR +
                PIER_CAST_V3_THERMAL_WEIGHT * scenario.suitability,
            ),
            status: "unavailable",
            fisheryStrengthCeiling,
            activeFisheryStrength,
            activeModeId: expectedModeId,
            activeModeCalibrationId: expectedModeCalibrationId,
            seasonalAvailability: null,
            trend: null,
            score: null,
            todayLabel: null,
            seasonPhase: null,
            internalBand: null,
            legacyTiming: null,
          });
          continue;
        }
        if (evaluation.closed) {
          closedRowCount += 1;
          if (!countedClosedDay) {
            closedDayCount += 1;
            countedClosedDay = true;
          }
        } else {
          scoredRowCount += 1;
        }
        if (evaluation.modeId !== expectedModeId) {
          addFinding({
            severity: "error",
            code: "active_mode_not_deterministic",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `Expected ${expectedModeId}; received ${evaluation.modeId}.`,
          });
        }
        if (evaluation.closed && evaluation.score !== null) {
          addFinding({
            severity: "error",
            code: "closed_row_has_score",
            pairKey: descriptor.pairKey,
            localDate,
            detail: `${scenario.id} row scored ${evaluation.score}.`,
          });
        }
        if (!evaluation.closed && evaluation.score === null) {
          addFinding({
            severity: "error",
            code: "open_row_missing_score",
            pairKey: descriptor.pairKey,
            localDate,
            detail: `${scenario.id} row is open but has no score.`,
          });
        }
        if (
          !Number.isFinite(evaluation.availability) ||
          evaluation.availability < 0 || evaluation.availability > 1
        ) {
          addFinding({
            severity: "error",
            code: "availability_out_of_range",
            pairKey: descriptor.pairKey,
            localDate,
            detail: `Availability was ${evaluation.availability}.`,
          });
        }
        const label = evaluation.score === null
          ? null
          : pierCastOpportunityLabelV5(evaluation.score);
        const phase = pierCastSeasonTimingLabelV5({
          availability: evaluation.availability,
          trend: evaluation.trend,
          regulationOpen: !evaluation.closed,
          accessOpen: true,
        });
        if (referenceSeasonalState === null) {
          referenceSeasonalState = {
            availability: evaluation.availability,
            trend: evaluation.trend,
            closed: evaluation.closed,
            modeId: evaluation.modeId,
          };
        } else if (
          Math.abs(
              referenceSeasonalState.availability - evaluation.availability,
            ) >
            1e-12 ||
          referenceSeasonalState.trend !== evaluation.trend ||
          referenceSeasonalState.closed !== evaluation.closed ||
          referenceSeasonalState.modeId !== evaluation.modeId
        ) {
          addFinding({
            severity: "error",
            code: "thermal_changed_seasonal_state",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `${scenario.id} changed mode, availability, trend, or closure.`,
          });
        }
        if (
          priorScenarioScore !== null && evaluation.score !== null &&
          evaluation.score > priorScenarioScore + 1e-12
        ) {
          addFinding({
            severity: "error",
            code: "thermal_score_not_monotonic",
            pairKey: descriptor.pairKey,
            localDate,
            detail: `${scenario.id} score ${
              rounded(evaluation.score)
            } exceeded the preceding warmer-fit scenario ${
              rounded(priorScenarioScore)
            }.`,
          });
        }
        if (evaluation.score !== null) priorScenarioScore = evaluation.score;
        options.onRow?.({
          pairKey: descriptor.pairKey,
          cityId: descriptor.cityId,
          speciesId: descriptor.speciesId,
          localDate,
          thermalScenario: scenario.id,
          thermalSuitability: scenario.suitability,
          temperatureModifier: rounded(
            PIER_CAST_V3_THERMAL_FLOOR +
              PIER_CAST_V3_THERMAL_WEIGHT * scenario.suitability,
          ),
          status: evaluation.closed ? "closed" : "scored",
          fisheryStrengthCeiling,
          activeFisheryStrength,
          activeModeId: evaluation.modeId,
          activeModeCalibrationId: expectedModeCalibrationId,
          seasonalAvailability: rounded(evaluation.availability),
          trend: evaluation.trend,
          score: evaluation.score === null ? null : rounded(evaluation.score),
          todayLabel: label,
          seasonPhase: phase,
          internalBand: evaluation.band,
          legacyTiming: evaluation.timing,
        });
        if (!phase || (evaluation.score !== null && !label)) {
          addFinding({
            severity: "error",
            code: "presentation_projection_missing",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `label=${label}; phase=${phase}; score=${evaluation.score}.`,
          });
          continue;
        }
        phasesByScenario[scenario.id][phase] += 1;
        if (label) labelsByScenario[scenario.id][label] += 1;
        if (
          evaluation.score !== null &&
          (evaluation.score < 1 || evaluation.score > 10 ||
            (fisheryStrengthCeiling !== null &&
              evaluation.score > fisheryStrengthCeiling + 1e-9))
        ) {
          addFinding({
            severity: "error",
            code: "score_outside_ceiling",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `score=${evaluation.score}; ceiling=${fisheryStrengthCeiling}.`,
          });
        }
        const expectedInternalBand = evaluation.closed ||
            evaluation.availability < PIER_CAST_MAIN_WINDOW_MIN_AVAILABILITY
          ? "usually_off"
          : evaluation.score === null
          ? null
          : expectedBand(evaluation.score);
        if (evaluation.band !== expectedInternalBand) {
          addFinding({
            severity: "error",
            code: "internal_band_mismatch",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `Expected ${expectedInternalBand}; received ${evaluation.band}.`,
          });
        }
        if (
          label === "Prime" &&
          (evidenceGrade === "C" ||
            (fisheryStrengthCeiling !== null && fisheryStrengthCeiling <= 8))
        ) {
          addFinding({
            severity: "error",
            code: "unsupported_prime_rating",
            pairKey: descriptor.pairKey,
            localDate,
            detail:
              `grade=${evidenceGrade}; ceiling=${fisheryStrengthCeiling}.`,
          });
        }
        if (
          phase === "Outside main window" &&
          (label === "Prime" || label === "Good")
        ) {
          addFinding({
            severity: "review",
            code: "high_rating_outside_main_window",
            pairKey: descriptor.pairKey,
            localDate,
            detail: `${label} at availability ${
              rounded(evaluation.availability)
            }.`,
          });
        }
        if (scenario.id === "excellent") {
          excellentDays.push({
            localDate,
            score: evaluation.score,
            label,
            phase,
            availability: evaluation.availability,
            modeId: evaluation.modeId,
            closed: evaluation.closed,
          });
        }
      }
    }

    let modeHandoffCount = 0;
    for (let index = 1; index < excellentDays.length; index += 1) {
      const previous = excellentDays[index - 1]!;
      const current = excellentDays[index]!;
      if (previous.modeId !== current.modeId) {
        modeHandoffCount += 1;
        if (
          Math.abs(previous.availability - current.availability) >= 0.2 ||
          Math.abs(labelRank(previous.label) - labelRank(current.label)) > 1
        ) {
          addFinding({
            severity: "review",
            code: "mode_handoff_gap",
            pairKey: descriptor.pairKey,
            localDate: current.localDate,
            detail: `${previous.modeId} -> ${current.modeId}; availability ${
              rounded(previous.availability)
            } -> ${rounded(current.availability)}.`,
          });
        }
      }
      if (
        !previous.closed && !current.closed &&
        Math.abs(labelRank(previous.label) - labelRank(current.label)) > 1
      ) {
        addFinding({
          severity: "review",
          code: "one_day_rating_jump",
          pairKey: descriptor.pairKey,
          localDate: current.localDate,
          detail: `${previous.label} -> ${current.label}.`,
        });
      }
    }
    for (let index = 7; index < excellentDays.length; index += 1) {
      const previous = excellentDays[index - 7]!;
      const current = excellentDays[index]!;
      if (
        !previous.closed && !current.closed &&
        labelRank(previous.label) - labelRank(current.label) > 1
      ) {
        addFinding({
          severity: "review",
          code: "seven_day_rating_cliff",
          pairKey: descriptor.pairKey,
          localDate: current.localDate,
          detail: `${previous.label} -> ${current.label} in seven days.`,
        });
      }
    }
    const october15 = excellentDays.find((day) =>
      day.localDate.endsWith("-10-15")
    );
    const november1 = excellentDays.find((day) =>
      day.localDate.endsWith("-11-01")
    );
    if (
      october15 && november1 && !october15.closed && !november1.closed &&
      (october15.availability - november1.availability >= 0.25 ||
        labelRank(october15.label) - labelRank(november1.label) > 1)
    ) {
      addFinding({
        severity: "review",
        code: "november_transition_cliff",
        pairKey: descriptor.pairKey,
        localDate: november1.localDate,
        detail: `availability ${rounded(october15.availability)} -> ${
          rounded(november1.availability)
        }; ${october15.label} -> ${november1.label}.`,
      });
    }

    const excellentLabels = emptyLabelCounts();
    const excellentPhases = emptyPhaseCounts();
    for (const day of excellentDays) {
      if (day.label) excellentLabels[day.label] += 1;
      excellentPhases[day.phase] += 1;
    }
    const maxDay = excellentDays.reduce<ExcellentDay | null>(
      (best, day) =>
        day.score !== null &&
          (best?.score === null || best === null || day.score > best.score)
          ? day
          : best,
      null,
    );
    const maximumExcellentScore = maxDay?.score ?? null;
    const maximumExcellentLabel = maximumExcellentScore === null
      ? null
      : pierCastOpportunityLabelV5(maximumExcellentScore);
    if (
      !hold && fisheryStrengthCeiling !== null && fisheryStrengthCeiling > 6 &&
      labelRank(maximumExcellentLabel) < labelRank("Good")
    ) {
      addFinding({
        severity: "review",
        code: "strong_ceiling_never_good",
        pairKey: descriptor.pairKey,
        detail: `ceiling=${fisheryStrengthCeiling}; max=${
          maximumExcellentScore === null
            ? "null"
            : rounded(maximumExcellentScore)
        }.`,
      });
    }
    if (
      !hold && fisheryStrengthCeiling !== null && fisheryStrengthCeiling > 4 &&
      labelRank(maximumExcellentLabel) < labelRank("Fair")
    ) {
      addFinding({
        severity: "review",
        code: "viable_ceiling_never_fair",
        pairKey: descriptor.pairKey,
        detail: `ceiling=${fisheryStrengthCeiling}; max=${
          maximumExcellentScore === null
            ? "null"
            : rounded(maximumExcellentScore)
        }.`,
      });
    }
    if (
      !hold && excellentDays.every((day) => day.phase === "Outside main window")
    ) {
      addFinding({
        severity: "review",
        code: "no_main_window_days",
        pairKey: descriptor.pairKey,
        detail: "No day reaches the 0.05 main-window availability floor.",
      });
    }

    pairSummaries.push({
      pairKey: descriptor.pairKey,
      cityId: descriptor.cityId,
      speciesId: descriptor.speciesId,
      status: hold ? "research_hold" : "scored",
      evidenceGrade,
      fisheryStrengthCeiling,
      modeCount,
      closedDayCount,
      modeHandoffCount,
      modeSelectionTieDayCount: tieDayCount,
      maximumExcellentScore: maximumExcellentScore === null
        ? null
        : rounded(maximumExcellentScore),
      maximumExcellentLabel,
      excellentScenarioLabelDays: excellentLabels,
      excellentScenarioPhaseDays: excellentPhases,
    });
  }

  const findingGroups = [...findings.entries()]
    .map(([key, value]) => ({
      severity: value.severity,
      code: key.slice(key.indexOf(":") + 1),
      count: value.count,
      examples: value.examples,
    }))
    .sort((left, right) =>
      left.severity.localeCompare(right.severity) ||
      left.code.localeCompare(right.code)
    );
  const expectedRowCount = pairs.length * dates.length *
    PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS.length;
  if (auditedRowCount !== expectedRowCount) {
    findingGroups.unshift({
      severity: "error",
      code: "row_coverage_mismatch",
      count: 1,
      examples: [{
        pairKey: "audit",
        localDate: null,
        detail: `Expected ${expectedRowCount}; audited ${auditedRowCount}.`,
      }],
    });
  }

  return {
    schemaVersion: PIER_CAST_SALMONID_CALIBRATION_AUDIT_VERSION,
    auditYear: PIER_CAST_SALMONID_CALIBRATION_AUDIT_YEAR,
    inputs: {
      lakeTroutCalibrationVersion: PIER_CAST_LAKE_TROUT_V5_CANDIDATE_VERSION,
      thermalFloor: PIER_CAST_V3_THERMAL_FLOOR,
      thermalWeight: PIER_CAST_V3_THERMAL_WEIGHT,
      thermalScenarios: PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS,
    },
    coverage: {
      cityCount: coveredCityIds.size,
      speciesCount: new Set(pairs.map((pair) => pair.speciesId)).size,
      pairCount: pairs.length,
      scoredPairCount:
        pairSummaries.filter((pair) => pair.status === "scored").length,
      researchHoldPairCount:
        pairSummaries.filter((pair) => pair.status === "research_hold").length,
      dayCount: dates.length,
      scenarioCount: PIER_CAST_SALMONID_AUDIT_THERMAL_SCENARIOS.length,
      expectedRowCount,
      auditedRowCount,
      scoredRowCount,
      closedRowCount,
      researchHoldRowCount,
      pairCountBySpecies,
    },
    distributions: { labelsByScenario, phasesByScenario },
    findings: findingGroups,
    errorCount: findingGroups
      .filter((finding) => finding.severity === "error")
      .reduce((sum, finding) => sum + finding.count, 0),
    reviewCount: findingGroups
      .filter((finding) => finding.severity === "review")
      .reduce((sum, finding) => sum + finding.count, 0),
    pairs: pairSummaries,
    limitations: [
      "Runtime pier access, ice, severe-weather, and live regulation overrides are not simulated; this audit verifies configured seasonal closures only.",
      "Thermal scenarios are standardized suitability inputs, not historical or forecast water temperatures.",
      "Research-hold lake-trout cities remain deliberately unscored and are counted for coverage without inventing opportunity ratings.",
    ],
  };
}
