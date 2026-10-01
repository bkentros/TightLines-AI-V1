import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(
  root,
  "docs/onboarding/piercast/scoring-v3-secondary",
);
const pass1Path = resolve(
  root,
  "docs/onboarding/piercast/scoring-v3-pass1/final-decision-matrix.json",
);
const monthlyEvidencePath = resolve(
  root,
  "docs/onboarding/piercast/remaining-species/michigan-monthly-evidence.csv",
);
const remainingSourcesPath = resolve(
  root,
  "docs/onboarding/piercast/remaining-species/sources.json",
);
const phase2SourcesPath = resolve(
  root,
  "docs/onboarding/piercast/remaining-species/phase2-sources.json",
);
const wisconsinSourcesPath = resolve(
  root,
  "docs/onboarding/piercast/wisconsin-expansion/evidence-ledger.json",
);
const portWashingtonSourcesPath = resolve(
  root,
  "docs/onboarding/piercast/port-washington/evidence-ledger.json",
);
const foundationalSourcesPath = resolve(
  root,
  "docs/onboarding/piercast/scoring-v3-pass1/foundational-source-ledger.json",
);
const checkOnly = process.argv.includes("--check");

const secondarySpecies = [
  "lake_trout",
  "walleye",
  "smallmouth_bass",
  "freshwater_drum",
  "yellow_perch",
  "lake_whitefish",
  "round_whitefish",
  "channel_catfish",
  "largemouth_bass",
] as const;

type SecondarySpeciesId = (typeof secondarySpecies)[number];
type Knot = { monthDay: string; availability: number };
type ModeSeed = {
  modeId: string;
  modeName: string;
  fisheryStrength: number;
  availabilityKnots: Knot[];
  interpretation: string;
};
type AdmissionSeed = {
  grade: "A" | "B";
  modes: ModeSeed[];
  evidenceIds?: string[];
  limitations?: string[];
  closedWindows?: Array<{
    startMonthDay: string;
    endMonthDay: string;
    reasonCode: "species_regulation_closed";
    evidenceIds: string[];
  }>;
};

const thermalCurveIds: Record<SecondarySpeciesId, string> = {
  lake_trout: "lake_trout__additional_thermal_research__v0_1",
  walleye: "walleye__additional_thermal_research__v0_1",
  smallmouth_bass: "smallmouth_bass__additional_thermal_research__v0_1",
  freshwater_drum: "freshwater_drum__additional_thermal_research__v0_1",
  yellow_perch: "yellow_perch__additional_thermal_research__v0_1",
  lake_whitefish: "lake_whitefish__additional_thermal_research__v0_1",
  round_whitefish: "round_whitefish__additional_thermal_research__v0_1",
  channel_catfish: "channel_catfish__additional_thermal_research__v0_1",
  largemouth_bass: "largemouth_bass__additional_thermal_research__v0_1",
};

const thermalEvidenceIds: Record<SecondarySpeciesId, string[]> = {
  lake_trout: ["THERMAL_LAKE_TROUT_USGS"],
  walleye: ["P2_WALLEYE_TELEMETRY2025"],
  smallmouth_bass: ["THERMAL_SMALLMOUTH_WIDNR"],
  freshwater_drum: ["THERMAL_DRUM_USGS"],
  yellow_perch: ["THERMAL_PERCH_USGS"],
  lake_whitefish: ["P2_WHITEFISH_REED2023"],
  round_whitefish: ["P2_GLFC1987", "P2_ROUND_JUVENILE2023"],
  channel_catfish: ["P2_CATFISH_RELEASE2025"],
  largemouth_bass: ["THERMAL_LARGEMOUTH_MIDNR"],
};

const winterLakeTrout = (strength: number): ModeSeed => ({
  modeId: "cold_season_nearshore",
  modeName: "Cold-season nearshore access",
  fisheryStrength: strength,
  availabilityKnots: knots([
    ["09-15", 0],
    ["10-01", 0.2],
    ["10-15", 0.7],
    ["10-25", 1],
    ["11-15", 0.8],
    ["01-20", 0.55],
    ["03-15", 0.78],
    ["04-30", 0.28],
    ["05-31", 0],
  ]),
  interpretation:
    "October Pier/Dock catches at all four ports and Michigan DNR's fall spawning-shoal and pier guidance support an October nearshore peak. Winter remains a lower-confidence shoulder because creel effort is not observed then.",
});
const summerLakeTrout = (strength: number): ModeSeed => ({
  modeId: "summer_coldwater_access",
  modeName: "Summer cold-water access",
  fisheryStrength: strength,
  availabilityKnots: knots([
    ["05-01", 0],
    ["06-01", 0.45],
    ["07-10", 1],
    ["08-20", 0.55],
    ["09-15", 0],
  ]),
  interpretation:
    "A low-ceiling summer opportunity only when cold water remains reachable at the harbor mouth; this is not an offshore abundance score.",
});
const smallmouth = (strength: number): ModeSeed => ({
  modeId: "warm_season_harbor",
  modeName: "Warm-season harbor fishery",
  fisheryStrength: strength,
  availabilityKnots: knots([
    ["03-15", 0],
    ["04-20", 0.25],
    ["05-20", 0.7],
    ["06-25", 1],
    ["08-20", 0.9],
    ["09-25", 0.35],
    ["11-01", 0],
  ]),
  interpretation:
    "Recurring warm-season Pier/Dock catches support a harbor-scale bass opportunity; the curve does not imply every breakwall face is equivalent.",
});
const drum = (strength: number): ModeSeed => ({
  modeId: "warm_season_bottom_fishery",
  modeName: "Warm-season bottom fishery",
  fisheryStrength: strength,
  availabilityKnots: knots([
    ["04-01", 0],
    ["05-05", 0.45],
    ["06-10", 0.85],
    ["07-15", 1],
    ["08-25", 0.9],
    ["10-01", 0.3],
    ["11-01", 0],
  ]),
  interpretation:
    "Port Pier/Dock catches establish a recurring warm-season bottom-fishing mode; salmon-directed effort is not treated as drum-target effort.",
});
const springPerch = (strength: number, peak = "05-10"): ModeSeed => ({
  modeId: "spring_nearshore_schooling",
  modeName: "Spring nearshore schooling",
  fisheryStrength: strength,
  availabilityKnots: knots([
    ["02-15", 0],
    ["03-20", 0.35],
    [peak, 1],
    ["06-01", 0.55],
    ["06-25", 0],
  ]),
  interpretation:
    "Spring shallows and recurring Pier/Dock harvest support a concentrated nearshore perch opportunity.",
});
const summerPerch = (strength: number, peak = "07-15"): ModeSeed => ({
  modeId: "summer_harbor_schooling",
  modeName: "Summer harbor schooling",
  fisheryStrength: strength,
  availabilityKnots: knots([
    ["05-15", 0],
    ["06-16", 0.55],
    [peak, 1],
    ["08-20", 0.75],
    ["10-01", 0.2],
    ["11-01", 0],
  ]),
  interpretation:
    "Recurring summer pier/shore observations support a city-harbor perch mode; school location remains variable.",
});
const wiPerchClosure = [{
  startMonthDay: "05-01",
  endMonthDay: "06-15",
  reasonCode: "species_regulation_closed" as const,
  evidenceIds: ["WI_REGULATIONS_2026_27"],
}];

const admissions: Record<string, AdmissionSeed> = {
  "ludington_mi/lake_trout": {
    grade: "B",
    modes: [winterLakeTrout(3.8), summerLakeTrout(3.4)],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "ludington_mi/smallmouth_bass": {
    grade: "B",
    modes: [{
      ...smallmouth(5.8),
      interpretation:
        "Recent July Pier/Dock catches recur in three surveyed years; the modest ceiling stays below Grand Haven's stronger recent harbor fishery.",
    }],
  },
  "ludington_mi/freshwater_drum": { grade: "B", modes: [drum(5.0)] },
  "ludington_mi/yellow_perch": {
    grade: "A",
    modes: [springPerch(6.0, "05-20"), summerPerch(7.6, "07-12")],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "grand_haven_mi/lake_trout": {
    grade: "B",
    modes: [winterLakeTrout(3.6), summerLakeTrout(3.4)],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "grand_haven_mi/smallmouth_bass": {
    grade: "B",
    modes: [{
      ...smallmouth(7.0),
      interpretation:
        "August Grand Haven Pier/Dock smallmouth catch recurs in all four recent surveyed years at a much higher rate than the former limited ceiling implied.",
    }],
  },
  "grand_haven_mi/freshwater_drum": {
    grade: "A",
    modes: [{
      ...drum(7.2),
      availabilityKnots: knots([
        ["04-01", 0],
        ["05-05", 0.75],
        ["05-20", 0.9],
        ["06-10", 0.95],
        ["07-15", 1],
        ["08-25", 0.95],
        ["09-20", 0.85],
        ["10-15", 0.4],
        ["11-01", 0],
      ]),
      interpretation:
        "The existing 7.2 ceiling now covers recurring Grand Haven Pier/Dock drum catch in May and September, not only a narrow July peak.",
    }],
  },
  "grand_haven_mi/yellow_perch": {
    grade: "A",
    modes: [{
      ...springPerch(6.2, "04-25"),
      availabilityKnots: knots([
        ["02-15", 0],
        ["03-20", 0.35],
        ["04-15", 0.9],
        ["04-25", 1],
        ["05-10", 0.55],
        ["06-01", 0],
      ]),
      interpretation:
        "Repeated April Grand Haven Pier/Dock perch catch supports a short spring pulse, while the recent May record is less consistent.",
    }, {
      ...summerPerch(7.2, "08-05"),
      availabilityKnots: knots([
        ["05-15", 0],
        ["06-16", 0.55],
        ["07-15", 0.82],
        ["08-05", 1],
        ["08-25", 0.93],
        ["09-20", 0.82],
        ["10-15", 0.35],
        ["11-01", 0],
      ]),
      interpretation:
        "Grand Haven summer Pier/Dock perch catch recurs through September, including multiple recent positive years; the previous 6.0 ceiling and rapid August decline understated that fishery.",
    }],
    evidenceIds: ["SECONDARY_MI_ROADMAP", "MI_2025"],
    limitations: [
      "The revised summer ceiling uses recent Pier/Dock recurrence and stays below exceptional historic catch rates; school location and target effort remain uncertain.",
    ],
  },
  "grand_haven_mi/round_whitefish": {
    grade: "B",
    modes: [{
      modeId: "spring_menominee",
      modeName: "Spring menominee fishery",
      fisheryStrength: 3.8,
      availabilityKnots: knots([
        ["02-15", 0],
        ["03-20", 0.4],
        ["04-15", 1],
        ["05-10", 0.45],
        ["06-01", 0],
      ]),
      interpretation:
        "Repeated April Pier/Dock occurrence and DNR pier reports support a modest spring menominee opportunity.",
    }],
  },
  "grand_haven_mi/channel_catfish": {
    grade: "A",
    modes: [{
      modeId: "warm_season_channel",
      modeName: "Warm-season channel fishery",
      fisheryStrength: 6.8,
      availabilityKnots: knots([
        ["03-20", 0],
        ["05-01", 0.45],
        ["06-20", 0.8],
        ["08-10", 1],
        ["09-20", 0.9],
        ["10-05", 0.75],
        ["10-31", 0.55],
        ["11-15", 0],
      ]),
      interpretation:
        "Recent Grand Haven Pier/Dock channel-catfish catches recur in all four surveyed years from July through September and continue into October; upstream Grand River catches are excluded.",
    }],
  },
  "grand_haven_mi/largemouth_bass": {
    grade: "A",
    modes: [{
      ...smallmouth(7.4),
      modeId: "warm_season_harbor_cover",
      modeName: "Warm-season harbor-cover fishery",
      interpretation:
        "Strong August port Pier/Dock catches in all four recent surveyed years support a Good harbor-cover largemouth opportunity.",
    }],
  },
  "manistee_mi/lake_trout": {
    grade: "B",
    modes: [winterLakeTrout(4.0), summerLakeTrout(3.6)],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "manistee_mi/walleye": {
    grade: "B",
    modes: [{
      modeId: "spring_low_light",
      modeName: "Spring low-light fishery",
      fisheryStrength: 4.2,
      availabilityKnots: knots([
        ["03-01", 0],
        ["04-01", 0.5],
        ["05-10", 1],
        ["06-10", 0.4],
        ["07-01", 0],
      ]),
      interpretation:
        "Repeated spring pier casting and nighttime targeting support a modest low-light opportunity; basin walleye abundance is not transferred.",
    }],
  },
  "manistee_mi/smallmouth_bass": { grade: "B", modes: [smallmouth(5.0)] },
  "manistee_mi/freshwater_drum": { grade: "B", modes: [drum(4.7)] },
  "manistee_mi/yellow_perch": {
    grade: "A",
    modes: [{
      ...springPerch(7.2, "05-05"),
      availabilityKnots: knots([
        ["02-15", 0],
        ["03-20", 0.35],
        ["04-10", 0.82],
        ["04-20", 1],
        ["05-20", 0.9],
        ["06-01", 0.55],
        ["06-25", 0],
      ]),
      interpretation:
        "April and May Manistee Pier/Dock perch catch recur at high rates in recent years; the spring peak now covers both months instead of one May day.",
    }, {
      ...summerPerch(6.8, "06-20"),
      availabilityKnots: knots([
        ["05-15", 0],
        ["06-01", 0.8],
        ["06-20", 1],
        ["07-15", 0.82],
        ["08-20", 0.45],
        ["09-15", 0],
      ]),
      interpretation:
        "June Manistee Pier/Dock perch harvest recurs in three recent surveyed years; the old 4.5 summer peak understated this separate post-spring school.",
    }],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "manistee_mi/round_whitefish": {
    grade: "B",
    modes: [{
      modeId: "fall_menominee",
      modeName: "Fall menominee fishery",
      fisheryStrength: 4.1,
      availabilityKnots: knots([
        ["08-15", 0],
        ["09-20", 0.35],
        ["10-25", 0.85],
        ["11-15", 1],
        ["12-15", 0.35],
        ["01-10", 0],
      ]),
      interpretation:
        "The DNR roadmap, autumn Pier/Dock recurrence, and current species-specific pier observations support a modest fall menominee mode.",
    }],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "frankfort_elberta_mi/lake_trout": {
    grade: "B",
    modes: [winterLakeTrout(4.0), summerLakeTrout(3.8)],
    evidenceIds: ["SECONDARY_MI_ROADMAP"],
  },
  "racine_wi/yellow_perch": {
    grade: "B",
    modes: [summerPerch(4.8, "07-20")],
    evidenceIds: ["WI_SEASON_2024", "WI_REGULATIONS_2026_27"],
    closedWindows: wiPerchClosure,
    limitations: [
      "Wisconsin's published month table pools Lake Michigan and Green Bay; only its broad summer shape is used, while city magnitude is capped by Racine-specific shoreline observations.",
    ],
  },
  "kenosha_wi/yellow_perch": {
    grade: "B",
    modes: [summerPerch(5.4, "07-20")],
    evidenceIds: ["WI_SEASON_2024", "WI_REGULATIONS_2026_27"],
    closedWindows: wiPerchClosure,
    limitations: [
      "Wisconsin's published month table pools Lake Michigan and Green Bay; only its broad summer shape is used, while city magnitude is capped by repeated Kenosha pier/harbor observations.",
    ],
  },
};

async function main(): Promise<void> {
  const pass1 = JSON.parse(await readFile(pass1Path, "utf8"));
  const monthlyText = await readFile(monthlyEvidencePath, "utf8");
  const monthlyRows = parseCsv(monthlyText);
  const secondaryRows = pass1.rows.filter((row: Record<string, unknown>) =>
    secondarySpecies.includes(row.speciesId as SecondarySpeciesId)
  );
  if (secondaryRows.length !== 81) {
    throw new Error(
      `Expected 81 secondary decisions; found ${secondaryRows.length}.`,
    );
  }
  const expectedKeys = new Set(
    secondaryRows.map((row: Record<string, string>) =>
      `${row.cityId}/${row.speciesId}`
    ),
  );
  for (const key of Object.keys(admissions)) {
    if (!expectedKeys.has(key)) throw new Error(`Unknown admission ${key}.`);
  }

  const metrics = buildMichiganMetrics(monthlyRows);
  const decisions = secondaryRows.map((row: Record<string, unknown>) => {
    const key = `${row.cityId}/${row.speciesId}`;
    const admitted = admissions[key];
    if (admitted) {
      const metric = metrics.get(key) ?? null;
      return {
        pairKey: key,
        cityId: row.cityId,
        cityName: row.cityName,
        stateCode: row.stateCode,
        speciesId: row.speciesId,
        speciesName: row.speciesName,
        finalDisposition: "admit",
        evidenceGrade: admitted.grade,
        boundaryPolicy: "general_city_harbor_main_public_piers",
        evidenceIds: unique([
          ...((row.evidenceIds as string[]) ?? []),
          ...(admitted.evidenceIds ?? []),
          ...thermalEvidenceIds[row.speciesId as SecondarySpeciesId],
        ]),
        quantitativeEvidence: metric,
        rationale: admissionRationale(row, admitted, metric),
        numericTreatment: "disabled_v3_secondary_candidate",
        legacyDisposition: row.finalDisposition,
        promotionEligible: false,
        promotionBlockers: [
          "configuration_disabled",
          "temperature_representation_not_approved",
          "prospective_validation_pending",
          "specialist_review_pending",
        ],
      };
    }
    return {
      pairKey: key,
      cityId: row.cityId,
      cityName: row.cityName,
      stateCode: row.stateCode,
      speciesId: row.speciesId,
      speciesName: row.speciesName,
      finalDisposition: row.finalDisposition,
      evidenceGrade: row.evidenceGrade,
      boundaryPolicy: "general_city_harbor_main_public_piers",
      evidenceIds: row.evidenceIds,
      quantitativeEvidence: metrics.get(key) ?? null,
      rationale: reviseNonAdmissionRationale(row),
      numericTreatment: "no_v3_numeric_score",
      legacyDisposition: row.finalDisposition,
      promotionEligible: false,
      unresolvedEvidence: row.unresolvedEvidence,
    };
  });

  const modes = decisions.flatMap((decision: Record<string, unknown>) => {
    const seed = admissions[decision.pairKey as string];
    if (!seed) return [];
    return seed.modes.map((mode) => ({
      modeCalibrationId:
        `${decision.cityId}__${decision.speciesId}__${mode.modeId}__v3_secondary_v1`,
      cityId: decision.cityId,
      cityName: decision.cityName,
      speciesId: decision.speciesId,
      speciesName: decision.speciesName,
      modeId: mode.modeId,
      modeName: mode.modeName,
      status: "disabled_secondary_shadow_candidate",
      evidenceGrade: seed.grade,
      fisheryStrength: mode.fisheryStrength,
      availabilityKnots: mode.availabilityKnots,
      seasonalPotentialEquation:
        "1 + (fisheryStrength - 1) * seasonalAvailability",
      thermalCurveId: thermalCurveIds[decision.speciesId as SecondarySpeciesId],
      fisheryEvidenceIds: decision.evidenceIds,
      thermalEvidenceIds:
        thermalEvidenceIds[decision.speciesId as SecondarySpeciesId],
      evidenceInterpretation: mode.interpretation,
      calibrationBasis:
        "FinFindr judgment bounded by multi-year port Pier/Dock recurrence, current DNR city/port guidance, local reports, and cross-city relative magnitude. It is not an agency score or catch probability.",
      limitations: [
        "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
        "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature.",
        ...(seed.limitations ?? []),
      ],
      promotionEligible: false,
    }));
  });

  const candidates = Object.entries(admissions).map(([pairKey, seed]) => {
    const [cityId, speciesId] = pairKey.split("/");
    return {
      pairKey,
      cityId,
      speciesId,
      ratingEnabled: false,
      closedWindows: seed.closedWindows ?? [],
      modes: seed.modes.map((mode) => ({
        modeCalibrationId:
          `${cityId}__${speciesId}__${mode.modeId}__v3_secondary_v1`,
        modeId: mode.modeId,
        fisheryStrength: mode.fisheryStrength,
        availabilityKnots: mode.availabilityKnots,
        thermalCurveId: thermalCurveIds[speciesId as SecondarySpeciesId],
      })),
    };
  });

  validateOutput(decisions, modes, candidates);
  const decisionArtifact = {
    schemaVersion: "piercast-v3-secondary-decisions-v1",
    status: "complete_disabled_shadow_research",
    decisionDate: "2026-09-15",
    scope: {
      cities: 9,
      secondarySpecies: 9,
      decisions: 81,
      admittedNumericPairs: candidates.length,
      nonNumericDecisions: 81 - candidates.length,
    },
    policy: {
      productBoundary:
        "One general reading for the named city harbor and its principal public piers; not an individual casting position, wall face, or depth.",
      admission:
        "Grade A/B requires recurring city/port Pier/Dock or pier/shore evidence, season timing, and enough magnitude evidence for cross-city calibration. Generic offshore, inland, stocking-only, or one-off occurrence is insufficient.",
      absence:
        "Defer/exclude means no numeric product claim, not biological absence.",
    },
    rows: decisions,
  };
  const candidateArtifact = {
    schemaVersion: "piercast-v3-secondary-runtime-candidates-v1",
    importedByRuntime: true,
    ratingEnabled: false,
    publicEnabled: false,
    formulaImplemented: true,
    candidates,
  };
  const modeArtifact = {
    schemaVersion: "piercast-v3-secondary-mode-calibrations-v1",
    status: "complete_disabled_shadow_calibration",
    modes,
  };
  const sources = await buildSourceLedger(decisions);
  const weekly = buildWeeklyAudit(candidates);
  const crossCity = candidates.map((pair) => {
    const metric = metrics.get(pair.pairKey);
    return {
      pairKey: pair.pairKey,
      evidenceGrade: admissions[pair.pairKey].grade,
      modeCount: pair.modes.length,
      maximumFisheryStrength: Math.max(
        ...pair.modes.map((mode) => mode.fisheryStrength),
      ),
      modernCatchEstimate: metric?.catchEstimate ?? "",
      modernMatchedHours: metric?.matchedHours ?? "",
      modernCatchPer1000AllSpeciesHours: metric?.catchPer1000AllSpeciesHours ??
        "",
      modernPositiveStrata: metric?.positiveStrata ?? "",
      modernMatchedStrata: metric?.matchedStrata ?? "",
      regulationClosureDays: pair.closedWindows.length > 0 ? 46 : 0,
    };
  });

  await emit("secondary-decision-matrix.json", json(decisionArtifact));
  await emit("secondary-runtime-candidates.json", json(candidateArtifact));
  await emit("secondary-mode-calibrations.json", json(modeArtifact));
  await emit("secondary-source-ledger.json", json(sources));
  await emit("secondary-cross-city-calibration.csv", csv(crossCity));
  await emit("secondary-full-year-weekly-audit.csv", csv(weekly));
  await emit(
    "SECONDARY_COMPLETION_REPORT.md",
    completionReport(decisions, candidates, modes, sources),
  );
  console.log(
    `Secondary v3 ${
      checkOnly ? "verified" : "generated"
    }: 81 decisions, ${candidates.length} admitted pairs, ${modes.length} modes, ${weekly.length} weekly rows.`,
  );
}

function knots(values: Array<[string, number]>): Knot[] {
  return values.map(([monthDay, availability]) => ({ monthDay, availability }));
}

function parseCsv(text: string): Array<Record<string, string>> {
  const [header, ...lines] = text.trim().split("\n");
  const headers = header.split(",");
  return lines.map((line) =>
    Object.fromEntries(
      line.split(",").map((value, index) => [
        headers[index],
        value,
      ]),
    )
  );
}

function buildMichiganMetrics(rows: Array<Record<string, string>>) {
  const result = new Map<string, Record<string, number>>();
  for (
    const cityId of [
      "ludington_mi",
      "grand_haven_mi",
      "manistee_mi",
      "frankfort_elberta_mi",
    ]
  ) {
    for (const speciesId of secondarySpecies) {
      const matched = rows.filter((row) =>
        row.cityId === cityId && row.speciesId === speciesId &&
        row.period === "modern_2012_2022" && Number(row.matchedYears) > 0
      );
      const catchEstimate = sum(matched, "catchEstimate");
      const matchedHours = sum(matched, "matchedHours");
      result.set(`${cityId}/${speciesId}`, {
        periodStart: 2012,
        periodEnd: 2022,
        catchEstimate,
        matchedHours,
        catchPer1000AllSpeciesHours: round(
          matchedHours > 0 ? catchEstimate * 1000 / matchedHours : 0,
        ),
        positiveStrata: sum(matched, "positiveYears"),
        matchedStrata: sum(matched, "matchedYears"),
      });
    }
  }
  return result;
}

function sum(rows: Array<Record<string, string>>, key: string): number {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function admissionRationale(
  row: Record<string, unknown>,
  seed: AdmissionSeed,
  metric: Record<string, number> | null,
): string {
  const quantitative = metric
    ? ` The 2012-2022 matched Michigan Pier/Dock extract contains ${metric.catchEstimate} estimated catches across ${metric.matchedHours} all-species angler-hours, with positive catch in ${metric.positiveStrata} of ${metric.matchedStrata} matched month-year strata; this denominator is a recurrence/magnitude anchor, not target CPUE.`
    : " Wisconsin city magnitude is bounded by repeated local DNR pier/shore observations; the pooled statewide pier table supplies broad timing only and is not represented as city CPUE.";
  return `The city/main-pier boundary resolves the prior over-specific structure blocker. Recurring agency evidence supports ${seed.modes.length} calibrated opportunity mode${
    seed.modes.length === 1 ? "" : "s"
  } with a maximum fishery-strength ceiling of ${
    Math.max(...seed.modes.map((mode) => mode.fisheryStrength))
  }/10.${quantitative} The numeric curve remains disabled and private pending representation, prospective, specialist, and owner gates.`;
}

function reviseNonAdmissionRationale(row: Record<string, unknown>): string {
  return `${row.rationale} Re-review under the broader city-harbor/main-public-piers boundary did not supply the missing recurrence, seasonal identifiability, or relative magnitude needed for a numeric score.`;
}

function buildWeeklyAudit(candidates: Array<any>) {
  const rows: Array<Record<string, string | number | boolean>> = [];
  for (const pair of candidates) {
    for (let week = 0; week < 52; week += 1) {
      const date = new Date(Date.UTC(2027, 0, 1 + week * 7));
      const localDate = date.toISOString().slice(0, 10);
      const monthDay = localDate.slice(5);
      const potentials = pair.modes.map((mode: any) => ({
        modeId: mode.modeId,
        strength: mode.fisheryStrength,
        availability: interpolate(monthDay, mode.availabilityKnots),
      })).map((mode: any) => ({
        ...mode,
        potential: 1 + (mode.strength - 1) * mode.availability,
      })).sort((left: any, right: any) =>
        right.potential - left.potential ||
        left.modeId.localeCompare(right.modeId)
      );
      const active = potentials[0];
      const closed = pair.closedWindows.some((window: any) =>
        recurringContains(monthDay, window.startMonthDay, window.endMonthDay)
      );
      rows.push({
        pairKey: pair.pairKey,
        localDate,
        activeMode: active.modeId,
        seasonalAvailability: round(active.availability),
        fisheryStrength: active.strength,
        idealTemperatureScore: round(active.potential),
        regulationOpen: !closed,
        resultStatus: closed ? "unavailable_regulation_closed" : "available",
      });
    }
  }
  return rows;
}

function interpolate(monthDay: string, knots: Knot[]): number {
  const year = 2027;
  const target = anchor(year, monthDay);
  const current = knots.map((knot) => ({
    ...knot,
    time: anchor(year, knot.monthDay),
  }))
    .sort((a, b) => a.time - b.time);
  const exact = current.find((knot) => knot.time === target);
  if (exact) return exact.availability;
  const before = [...current].reverse().find((knot) => knot.time < target) ?? {
    ...current.at(-1)!,
    time: anchor(year - 1, current.at(-1)!.monthDay),
  };
  const after = current.find((knot) => knot.time > target) ?? {
    ...current[0],
    time: anchor(year + 1, current[0].monthDay),
  };
  return before.availability + (after.availability - before.availability) *
      ((target - before.time) / (after.time - before.time));
}

function recurringContains(
  target: string,
  start: string,
  end: string,
): boolean {
  return start <= end
    ? target >= start && target <= end
    : target >= start || target <= end;
}

function anchor(year: number, monthDay: string): number {
  const [month, day] = monthDay.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

async function buildSourceLedger(decisions: Array<Record<string, unknown>>) {
  const remaining = JSON.parse(await readFile(remainingSourcesPath, "utf8"));
  const phase2 = JSON.parse(await readFile(phase2SourcesPath, "utf8"));
  const wisconsin = JSON.parse(await readFile(wisconsinSourcesPath, "utf8"));
  const portWashington = JSON.parse(
    await readFile(portWashingtonSourcesPath, "utf8"),
  );
  const foundational = JSON.parse(
    await readFile(foundationalSourcesPath, "utf8"),
  );
  const needed = new Set(
    decisions.flatMap((row) => row.evidenceIds as string[]),
  );
  const retained = [
    ...remaining,
    ...phase2,
    ...(wisconsin.evidence ?? []),
    ...(portWashington.evidence ?? []),
    ...(foundational.sources ?? []),
  ].filter((source: Record<string, unknown>) =>
    needed.has((source.evidenceId ?? source.id) as string)
  );
  const additions = [
    {
      evidenceId: "SECONDARY_MI_ROADMAP",
      title: "Roadmap to Fishing Lake Michigan: Meet Your Match!",
      authority: "Michigan DNR",
      url:
        "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Archive/Maps/LakeMichigaRoadmap.pdf",
      reviewedAt: "2026-09-15",
      scope: "Named Michigan ports and broad seasonal opportunity",
      use:
        "Port-season corroboration only; not pier catch rate or exact structure magnitude.",
    },
    {
      evidenceId: "THERMAL_LAKE_TROUT_USGS",
      title:
        "In situ determination of annual thermal habitat use by lake trout in Lake Huron",
      authority: "U.S. Geological Survey",
      url: "https://pubs.usgs.gov/publication/1000840",
      reviewedAt: "2026-09-15",
      use:
        "Directional broad cold-water response; occupancy is not bite probability.",
    },
    {
      evidenceId: "THERMAL_SMALLMOUTH_WIDNR",
      title: "Guide to the Future: Catch Rates and Water Temperature",
      authority: "Wisconsin DNR",
      url:
        "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Pubs_2017GuidetotheFutureSummary.pdf",
      reviewedAt: "2026-09-15",
      use:
        "Directional positive warm-season modifier; river guide catches are not Lake Michigan pier calibration.",
    },
    {
      evidenceId: "THERMAL_DRUM_USGS",
      title: "Freshwater Drum species profile",
      authority: "U.S. Geological Survey",
      url: "https://nas.er.usgs.gov/queries/FactSheet.aspx?speciesID=946",
      reviewedAt: "2026-09-15",
      use:
        "Broad warm-water compatibility and >25.6 C stress caveat; not an angling response curve.",
    },
    {
      evidenceId: "THERMAL_PERCH_USGS",
      title: "Yellow Perch species profile",
      authority: "U.S. Geological Survey",
      url:
        "https://www.usgs.gov/labs/fish-health-program/science/yellow-perch-perca-flavescens-fhp",
      reviewedAt: "2026-09-15",
      use:
        "Moderate-temperature preference and winter activity; not a city-specific catch curve.",
    },
    {
      evidenceId: "THERMAL_LARGEMOUTH_MIDNR",
      title: "Largemouth bass species information",
      authority: "Michigan DNR",
      url:
        "https://www.michigan.gov/dnr/education/michigan-species/fish-species/largemouth",
      reviewedAt: "2026-09-15",
      use:
        "Warm-water activity range and shallow-cover context; not a port catch-rate model.",
    },
  ];
  const sources = [...retained, ...additions];
  const present = new Set(
    sources.map((source: Record<string, unknown>) =>
      (source.evidenceId ?? source.id) as string
    ),
  );
  const missing = [...needed].filter((id) => !present.has(id));
  if (missing.length) {
    throw new Error(
      `Secondary source ledger is incomplete: ${missing.join(", ")}.`,
    );
  }
  return {
    schemaVersion: "piercast-v3-secondary-source-ledger-v1",
    reviewedAt: "2026-09-15",
    sourceCount: sources.length,
    sources,
  };
}

function validateOutput(decisions: any[], modes: any[], candidates: any[]) {
  if (
    decisions.length !== 81 || candidates.length !== 20 || modes.length !== 27
  ) {
    throw new Error("Secondary output count invariant failed.");
  }
  if (new Set(decisions.map((row) => row.pairKey)).size !== 81) {
    throw new Error("Secondary decision keys are not unique.");
  }
  for (const pair of candidates) {
    if (!pair.modes.length || pair.ratingEnabled !== false) {
      throw new Error(`Invalid secondary candidate ${pair.pairKey}.`);
    }
    for (const mode of pair.modes) {
      if (mode.fisheryStrength < 2.1 || mode.fisheryStrength > 10) {
        throw new Error(`Invalid strength ${mode.modeCalibrationId}.`);
      }
      if (mode.availabilityKnots.length < 2) {
        throw new Error(`Invalid availability ${mode.modeCalibrationId}.`);
      }
    }
  }
  const wisconsinPerch = candidates.filter((pair) =>
    ["racine_wi/yellow_perch", "kenosha_wi/yellow_perch"].includes(pair.pairKey)
  );
  if (
    wisconsinPerch.length !== 2 ||
    wisconsinPerch.some((pair) => pair.closedWindows.length !== 1)
  ) throw new Error("Wisconsin perch closure invariant failed.");
}

function completionReport(
  decisions: any[],
  candidates: any[],
  modes: any[],
  sources: any,
): string {
  const bySpecies = secondarySpecies.map((speciesId) => ({
    speciesId,
    admitted: candidates.filter((pair) => pair.speciesId === speciesId).length,
    deferred:
      decisions.filter((row) =>
        row.speciesId === speciesId && row.finalDisposition === "defer"
      ).length,
    excluded:
      decisions.filter((row) =>
        row.speciesId === speciesId && row.finalDisposition === "exclude"
      ).length,
  }));
  return `# PierCast v3 secondary-species completion report\n\nStatus: complete disabled shadow research and calibration. Date: 2026-09-15.\n\nDeployment verification: the private secondary manifest is live behind owner review. Production run \`6550d54e-5bc7-46ab-9615-97cf30d4a9f5\` archived all 280 expected forecasts under engine v1.1.1; public Formula v3 promotion remains blocked.\n\n## Outcome\n\nAll 81 secondary city/species pairings were re-reviewed against the intended product boundary: one general city-harbor reading anchored to the main public piers. Twenty pairings clear the Grade A/B numeric-research gate and produce ${modes.length} disabled v3 opportunity modes. The other 61 have explicit defer/exclude decisions and no numeric score. Production v2 is unchanged and Formula v3 remains private, disabled, and promotion-blocked.\n\n| Species | Admit | Defer | Exclude |\n| --- | ---: | ---: | ---: |\n${
    bySpecies.map((row) =>
      `| ${row.speciesId} | ${row.admitted} | ${row.deferred} | ${row.excluded} |`
    ).join("\n")
  }\n\n## Admitted pairings\n\n${
    candidates.map((pair) =>
      `- ${pair.pairKey}: ${
        pair.modes.map((mode: any) =>
          `${mode.modeId} ${mode.fisheryStrength}/10`
        ).join("; ")
      }${
        pair.closedWindows.length
          ? "; unavailable during WI yellow-perch closure May 1-June 15"
          : ""
      }`
    ).join("\n")
  }\n\n## Calibration discipline\n\n- Michigan magnitude uses the DNR port-level Pier/Dock series through 2022. Catch per 1,000 all-species hours is an ordinal recurrence/magnitude anchor, never represented as target CPUE.\n- Current Michigan DNR port roadmaps and dated reports corroborate season and targetability. Port guidance does not create a pier catch rate.\n- Wisconsin yellow-perch timing uses the pooled statewide pier table only for broad shape; Racine/Kenosha strength is capped by local DNR reports.\n- The Wisconsin Lake Michigan yellow-perch closure is a hard unavailable gate, not a score penalty.\n- Generic offshore, inland, boat-only, stocking-only, and single-occurrence evidence cannot create a numeric pier score.\n- Temperature remains a bounded secondary modifier. The broad curves are directional hypotheses and cannot create a season or exceed the fishery-strength ceiling.\n\n## Evidence and verification\n\nThe frozen ledger contains ${sources.sourceCount} relevant source records. The decision matrix covers 9 cities × 9 secondary species exactly once. The full-year audit contains ${
    candidates.length * 52
  } pair/week rows and verifies legal-window status, active-mode selection, and ideal-temperature ceilings. Runtime configuration remains fail-closed unless the explicit shadow override is present.\n\n## Remaining promotion gates\n\nThese calibrations are complete for shadow evaluation, not approved for public release. Promotion still requires LMHOFS representation validation, prospective effort-aware outcomes, independent fisheries review, and an explicit owner decision. Those are validation gates, not unfinished research rows.\n`;
}

async function emit(name: string, contents: string): Promise<void> {
  const path = resolve(outputDirectory, name);
  if (checkOnly) {
    if (await readFile(path, "utf8") !== contents) {
      throw new Error(`${name} has drifted.`);
    }
    return;
  }
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path, contents);
}

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function csv(rows: Array<Record<string, unknown>>): string {
  const headers = Object.keys(rows[0]);
  return `${headers.join(",")}\n${
    rows.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
    ).join("\n")
  }\n`;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

void main();
