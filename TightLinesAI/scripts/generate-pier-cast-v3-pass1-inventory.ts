import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PIER_CAST_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/cities.ts";
import { PIER_CAST_SPECIES_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/species.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/wisconsinShadow.ts";
import { evaluatePierCastSeasonalOpportunity } from "../supabase/functions/_shared/pierCastEngine/scoring/seasonal.ts";

// This historical Pass 1 artifact is intentionally frozen to the original
// thirteen-species scope. Lake Huron schema additions are audited separately.
const PASS1_SPECIES_PROFILES = PIER_CAST_SPECIES_PROFILES.filter((species) =>
  species.speciesId !== "atlantic_salmon" &&
  species.speciesId !== "northern_pike"
);

const OUTPUT_DIRECTORY = resolve(
  "docs/onboarding/piercast/scoring-v3-pass1",
);
const JSON_PATH = resolve(OUTPUT_DIRECTORY, "pairing-inventory.json");
const CSV_PATH = resolve(OUTPUT_DIRECTORY, "pairing-inventory.csv");
const RECONCILIATION_JSON_PATH = resolve(
  OUTPUT_DIRECTORY,
  "baseline-reconciliation.json",
);
const RECONCILIATION_CSV_PATH = resolve(
  OUTPUT_DIRECTORY,
  "baseline-reconciliation.csv",
);
const LEGACY_AUDIT_JSON_PATH = resolve(
  OUTPUT_DIRECTORY,
  "legacy-curve-audit.json",
);
const LEGACY_AUDIT_CSV_PATH = resolve(
  OUTPUT_DIRECTORY,
  "legacy-curve-audit.csv",
);
const GAP_REGISTER_JSON_PATH = resolve(
  OUTPUT_DIRECTORY,
  "evidence-gap-register.json",
);
const GAP_REGISTER_CSV_PATH = resolve(
  OUTPUT_DIRECTORY,
  "evidence-gap-register.csv",
);

const checkOnly = process.argv.includes("--check");

const csvCell = (value: unknown): string => {
  const rendered = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(rendered)
    ? `"${rendered.replaceAll('"', '""')}"`
    : rendered;
};

const allCities = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
];

const cityIds = new Set(allCities.map((city) => city.cityId));
if (allCities.length !== 9 || cityIds.size !== 9) {
  throw new Error(
    `Pass 1 requires exactly nine unique cities; received ${allCities.length} profiles and ${cityIds.size} unique IDs.`,
  );
}

if (PASS1_SPECIES_PROFILES.length !== 13) {
  throw new Error(
    `Pass 1 requires exactly thirteen catalog species; received ${PASS1_SPECIES_PROFILES.length}.`,
  );
}

const speciesNames = new Map(
  PASS1_SPECIES_PROFILES.map((species) => [
    species.speciesId,
    species.displayName,
  ]),
);

const rows = allCities.flatMap((city) => {
  const pass1Ids = new Set(
    PASS1_SPECIES_PROFILES.map((species) => species.speciesId),
  );
  const profiles = new Map(
    city.species.filter((species) => pass1Ids.has(species.speciesId)).map(
      (species) => [species.speciesId, species],
    ),
  );
  if (profiles.size !== PASS1_SPECIES_PROFILES.length) {
    throw new Error(
      `${city.cityId} exposes ${profiles.size} species profiles; expected thirteen.`,
    );
  }

  return PASS1_SPECIES_PROFILES.map((species) => {
    const profile = profiles.get(species.speciesId);
    if (!profile) {
      throw new Error(`${city.cityId}/${species.speciesId} is missing.`);
    }

    const curve = profile.seasonalOpportunityCurve;
    const ratings = curve?.knots.map((knot) => knot.rating) ?? [];
    const configured = curve !== null;

    return {
      cityId: city.cityId,
      cityName: city.displayName,
      stateCode: city.stateCode,
      speciesId: species.speciesId,
      speciesName: speciesNames.get(species.speciesId) ?? species.speciesId,
      currentInheritance: profile.inheritance,
      currentCurveStatus: configured
        ? "configured_provisional"
        : "not_configured",
      currentCurveId: curve?.curveId ?? null,
      currentMinimum: ratings.length > 0 ? Math.min(...ratings) : null,
      currentMaximum: ratings.length > 0 ? Math.max(...ratings) : null,
      ratingEnabled: profile.ratingEnabled,
      pass1Disposition: "pending_research",
      pass1EvidenceGrade: null,
      pass1ModeCount: null,
      pass1ReviewStatus: configured
        ? "requires_full_recalibration"
        : "requires_admission_reaudit",
      currentLimitation: profile.limitation,
    };
  });
});

if (rows.length !== 117) {
  throw new Error(
    `Pass 1 requires 117 pairing rows; generated ${rows.length}.`,
  );
}

const configuredCount =
  rows.filter((row) => row.currentCurveStatus === "configured_provisional")
    .length;
if (configuredCount !== 44) {
  throw new Error(
    `Expected 44 currently configured pairings; generated ${configuredCount}.`,
  );
}

const inventory = {
  schemaVersion: "piercast-v3-pass1-pairing-inventory-v1",
  scopeVersion: "piercast-nine-city-thirteen-species-pass1-v1",
  status: "research_in_progress",
  immutableBaseline: {
    configuredPairCount: configuredCount,
    note:
      "This inventory describes the pre-v3 state. It does not approve, alter, or enable a rating.",
  },
  counts: {
    cities: allCities.length,
    species: PASS1_SPECIES_PROFILES.length,
    decisionsRequired: rows.length,
    configuredPairingsRequiringRecalibration: configuredCount,
    unconfiguredPairingsRequiringAdmissionReaudit: rows.length -
      configuredCount,
  },
  cities: allCities.map((city) => ({
    cityId: city.cityId,
    displayName: city.displayName,
    stateCode: city.stateCode,
    timezone: city.timezone,
  })),
  species: PASS1_SPECIES_PROFILES.map((species) => ({
    speciesId: species.speciesId,
    displayName: species.displayName,
  })),
  rows,
};

type ExistingDecision = {
  cityId: string;
  speciesId: string;
  classification: string;
  rationale: string;
  evidenceIds: string[];
  requiredEvidence: string;
};

type CoreCurve = {
  cityId: string;
  speciesId: string;
  confidence: string;
  evidenceIds: string[];
};

const coreSpeciesIds = new Set([
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
]);

async function buildBaselineReconciliation() {
  const [decisionText, coreCurveText] = await Promise.all([
    readFile(
      resolve("docs/onboarding/piercast/remaining-species/decisions.json"),
      "utf8",
    ),
    readFile(
      resolve("docs/PierCast_Core_Species_Seasonal_Curves.json"),
      "utf8",
    ),
  ]);
  const existingDecisions =
    (JSON.parse(decisionText).decisions ?? []) as ExistingDecision[];
  const coreCurves = (JSON.parse(coreCurveText).curves ?? []) as CoreCurve[];
  const decisionByPair = new Map(
    existingDecisions.map((decision) => [
      `${decision.cityId}/${decision.speciesId}`,
      decision,
    ]),
  );
  const coreCurveByPair = new Map(
    coreCurves.map((curve) => [
      `${curve.cityId}/${curve.speciesId}`,
      curve,
    ]),
  );

  const reconciledRows = rows.map((row) => {
    const key = `${row.cityId}/${row.speciesId}`;
    const existingDecision = decisionByPair.get(key);
    const coreCurve = coreCurveByPair.get(key);
    const isNewWisconsinCity = PIER_CAST_WISCONSIN_CITY_PROFILES.some((city) =>
      city.cityId === row.cityId
    );
    const configured = row.currentCurveStatus === "configured_provisional";

    let baselineDisposition: "admit" | "defer" | "exclude";
    let evidenceGrade: "A" | "B" | "C" | "D";
    let decisionBasis: string;
    let requiredEvidence: string;
    let evidenceIds: string[];

    if (configured && coreCurve && row.stateCode === "MI") {
      baselineDisposition = "admit";
      evidenceGrade = "A";
      decisionBasis =
        "Legacy Michigan core curve has a port-level monthly Pier/Dock creel series plus dated local DNR observations. It must still be decomposed into v3 opportunity modes and recalibrated cross-city.";
      requiredEvidence =
        "Refresh the post-2022 local record, run holdout testing, and validate each proposed v3 mode against the common magnitude anchors.";
      evidenceIds = coreCurve.evidenceIds;
    } else if (configured && coreCurve) {
      baselineDisposition = "admit";
      evidenceGrade = "B";
      decisionBasis =
        "Legacy Sheboygan core curve has recurring pier evidence and Wisconsin mode-level timing, but lacks a comparable city-specific pier effort denominator.";
      requiredEvidence =
        "Acquire or prospectively collect Sheboygan-specific pier catch and effort by species/month and validate mode-specific magnitude.";
      evidenceIds = coreCurve.evidenceIds;
    } else if (
      configured && isNewWisconsinCity && coreSpeciesIds.has(row.speciesId)
    ) {
      baselineDisposition = "admit";
      evidenceGrade = "B";
      decisionBasis =
        "Wisconsin DNR identifies the species at the city pier context; county pier-mode recurrence and statewide pier timing support a provisional research curve without city-specific CPUE.";
      requiredEvidence =
        "Collect city-pier catch and effort across the proposed peak and shoulder modes; do not infer city CPUE from county harvest alone.";
      evidenceIds = row.cityId === "port_washington_wi"
        ? [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024",
        ]
        : [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024",
        ];
    } else if (configured) {
      baselineDisposition = "admit";
      evidenceGrade = "C";
      decisionBasis =
        "A legacy private secondary-species curve exists, but its magnitude and/or covered-pier attribution relies heavily on calibration judgment and has not cleared temperature-representation gates.";
      requiredEvidence = existingDecision?.requiredEvidence ??
        "Obtain repeated exact-main-pier, effort-aware observations and validate the active opportunity modes before v3 promotion.";
      evidenceIds = existingDecision?.evidenceIds ?? [];
    } else if (existingDecision) {
      baselineDisposition = existingDecision.classification === "excluded"
        ? "exclude"
        : "defer";
      evidenceGrade = existingDecision.classification === "excluded"
        ? "D"
        : "C";
      decisionBasis = existingDecision.rationale;
      requiredEvidence = existingDecision.requiredEvidence;
      evidenceIds = existingDecision.evidenceIds;
    } else if (
      row.currentInheritance === "conditional" ||
      row.currentInheritance === "historical_lead"
    ) {
      baselineDisposition = "defer";
      evidenceGrade = "C";
      decisionBasis = row.currentLimitation ??
        "A local opportunity lead exists, but the annual magnitude and timing are unresolved.";
      requiredEvidence =
        "Obtain repeated exact-city pier/shore observations plus local effort-aware seasonal evidence and applicable mode-specific thermal support.";
      evidenceIds = row.cityId === "port_washington_wi"
        ? [
          "PW_ACCESS_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024",
        ]
        : row.speciesId === "yellow_perch"
        ? [
          "WI_ACCESS_2026",
          "WI_WEEKLY_2024_07_15",
          "WI_WEEKLY_2024_07_29",
          "WI_WEEKLY_2024_08",
          "V3_WI_PERCH_STATUS",
        ]
        : ["WI_ACCESS_2026", "WI_COUNTY_MODE_1998_2024"];
    } else {
      baselineDisposition = "exclude";
      evidenceGrade = "D";
      decisionBasis = row.currentLimitation ??
        "No recurring, intentionally targetable main-pier fishery is established by the retained evidence.";
      requiredEvidence =
        "Reopen only with repeated species-specific city-pier evidence that establishes intentional targetability, timing, and relative magnitude.";
      evidenceIds = row.cityId === "port_washington_wi"
        ? ["PW_ACCESS_001", "PW_HARVEST_001"]
        : [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
        ];
    }

    return {
      cityId: row.cityId,
      cityName: row.cityName,
      stateCode: row.stateCode,
      speciesId: row.speciesId,
      speciesName: row.speciesName,
      baselineDisposition,
      evidenceGrade,
      currentCurveStatus: row.currentCurveStatus,
      currentCurveId: row.currentCurveId,
      decisionBasis,
      evidenceIds,
      requiredEvidence,
      v3DecisionStatus: "requires_source_refresh_and_cross_city_review",
      numericStatus: configured
        ? "legacy_curve_quarantined_for_recalibration"
        : "no_v3_numeric_curve",
    };
  });

  const dispositionCounts = reconciledRows.reduce<Record<string, number>>(
    (counts, row) => {
      counts[row.baselineDisposition] = (counts[row.baselineDisposition] ?? 0) +
        1;
      return counts;
    },
    {},
  );
  const gradeCounts = reconciledRows.reduce<Record<string, number>>(
    (counts, row) => {
      counts[row.evidenceGrade] = (counts[row.evidenceGrade] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return {
    schemaVersion: "piercast-v3-pass1-baseline-reconciliation-v1",
    scopeVersion: "piercast-nine-city-thirteen-species-pass1-v1",
    status: "legacy_evidence_baseline_not_final_v3_decisions",
    warning:
      "Disposition and grade reconcile retained evidence only. Every row requires a source refresh and cross-city review before becoming a final v3 decision.",
    counts: {
      rows: reconciledRows.length,
      dispositions: dispositionCounts,
      evidenceGrades: gradeCounts,
    },
    rows: reconciledRows,
  };
}

function buildEvidenceGapRegister(
  reconciliation: Awaited<ReturnType<typeof buildBaselineReconciliation>>,
  legacyAudit: ReturnType<typeof buildLegacyCurveAudit>,
) {
  const auditByPair = new Map(
    legacyAudit.rows.map((row) => [`${row.cityId}/${row.speciesId}`, row]),
  );
  const rows = reconciliation.rows.filter((row) =>
    row.baselineDisposition === "defer" ||
    (row.baselineDisposition === "admit" && row.evidenceGrade !== "A")
  ).map((row) => {
    const legacy = auditByPair.get(`${row.cityId}/${row.speciesId}`);
    const currentExcellentPeak = (legacy?.maximum ?? 0) >= 8.1;
    const priority = row.baselineDisposition === "admit" &&
        (row.evidenceGrade === "C" || currentExcellentPeak)
      ? "P0"
      : row.baselineDisposition === "admit"
      ? "P1"
      : "P2";
    const text = `${row.decisionBasis} ${row.requiredEvidence}`.toLowerCase();
    const blockerCategories = [
      ...(text.includes("effort") || text.includes("cpue")
        ? ["local_effort_denominator"]
        : []),
      ...(text.includes("structure") || text.includes("pier attribution") ||
          text.includes("side attribution")
        ? ["main_pier_attribution"]
        : []),
      ...(text.includes("thermal") || text.includes("temperature")
        ? ["thermal_mode_validation"]
        : []),
      ...(text.includes("season") || text.includes("timing") ||
          text.includes("annual")
        ? ["seasonal_timing"]
        : []),
      ...(text.includes("recurring") || text.includes("repeated")
        ? ["recurrence"]
        : []),
    ];
    if (blockerCategories.length === 0) {
      blockerCategories.push("magnitude_support");
    }
    return {
      priority,
      cityId: row.cityId,
      speciesId: row.speciesId,
      baselineDisposition: row.baselineDisposition,
      evidenceGrade: row.evidenceGrade,
      currentLegacyMaximum: legacy?.maximum ?? null,
      blockerCategories: [...new Set(blockerCategories)],
      requiredEvidence: row.requiredEvidence,
      evidenceIds: row.evidenceIds,
      closureStatus: "open",
    };
  }).sort((left, right) =>
    left.priority.localeCompare(right.priority) ||
    left.cityId.localeCompare(right.cityId) ||
    left.speciesId.localeCompare(right.speciesId)
  );
  return {
    schemaVersion: "piercast-v3-pass1-evidence-gap-register-v1",
    status: "open",
    ordering:
      "P0 protects an existing high-impact numeric claim; P1 strengthens an admitted Grade B pairing; P2 resolves a deferred pairing.",
    counts: {
      total: rows.length,
      P0: rows.filter((row) => row.priority === "P0").length,
      P1: rows.filter((row) => row.priority === "P1").length,
      P2: rows.filter((row) => row.priority === "P2").length,
    },
    rows,
  };
}

function localDatesForYear(year: number): string[] {
  const dates: string[] = [];
  for (
    let instant = Date.UTC(year, 0, 1);
    instant < Date.UTC(year + 1, 0, 1);
    instant += 24 * 60 * 60 * 1000
  ) {
    dates.push(new Date(instant).toISOString().slice(0, 10));
  }
  return dates;
}

function legacyBand(score: number): string {
  if (score >= 9.5) return "reference_class";
  if (score >= 8.1) return "excellent";
  if (score >= 6.1) return "strong";
  if (score >= 4.1) return "ordinary";
  if (score >= 2.1) return "limited";
  return "negligible";
}

function buildLegacyCurveAudit(
  reconciliation: Awaited<ReturnType<typeof buildBaselineReconciliation>>,
) {
  const gradeByPair = new Map(
    reconciliation.rows.map((row) => [
      `${row.cityId}/${row.speciesId}`,
      row.evidenceGrade,
    ]),
  );
  const dates = localDatesForYear(2025);
  const auditedRows = allCities.flatMap((city) =>
    city.species.flatMap((species) => {
      if (!species.seasonalOpportunityCurve) return [];
      const daily = dates.map((localDate) => {
        const evaluated = evaluatePierCastSeasonalOpportunity({
          ratingEnabled: true,
          mode: "review",
          localDate,
          curve: species.seasonalOpportunityCurve,
        });
        if (evaluated.status !== "available" || evaluated.rating === null) {
          throw new Error(
            `Could not evaluate ${city.cityId}/${species.speciesId}/${localDate}.`,
          );
        }
        return { localDate, rating: evaluated.rating };
      });
      const ratings = daily.map((day) => day.rating);
      const minimum = Math.min(...ratings);
      const maximum = Math.max(...ratings);
      const peakDates = daily.filter((day) =>
        Math.abs(day.rating - maximum) < 1e-9
      )
        .map((day) => day.localDate.slice(5));
      const perfectTemperatureV2Maximum = Math.min(
        10,
        1 + (maximum - 1) * 1.05,
      );
      const evidenceGrade = gradeByPair.get(
        `${city.cityId}/${species.speciesId}`,
      );
      const reviewFlags = [
        ...(evidenceGrade === "C" ? ["low_confidence_numeric_curve"] : []),
        ...(maximum >= 8.1 && evidenceGrade !== "A"
          ? ["excellent_peak_without_grade_a_evidence"]
          : []),
        ...(perfectTemperatureV2Maximum < 9.95
          ? ["legacy_formula_cannot_display_10"]
          : []),
        ...(minimum > 2 ? ["weak_season_never_reaches_negligible_band"] : []),
      ];
      return [{
        cityId: city.cityId,
        cityName: city.displayName,
        speciesId: species.speciesId,
        speciesName: speciesNames.get(species.speciesId) ?? species.speciesId,
        curveId: species.seasonalOpportunityCurve.curveId,
        evidenceGrade,
        minimum: Number(minimum.toFixed(3)),
        maximum: Number(maximum.toFixed(3)),
        peakBand: legacyBand(maximum),
        peakDates,
        daysStrongOrBetter: ratings.filter((rating) => rating >= 6.1).length,
        daysExcellentOrBetter: ratings.filter((rating) => rating >= 8.1).length,
        daysReferenceClass: ratings.filter((rating) => rating >= 9.5).length,
        perfectTemperatureV2Maximum: Number(
          perfectTemperatureV2Maximum.toFixed(3),
        ),
        canDisplayTenUnderV2: perfectTemperatureV2Maximum >= 9.95,
        reviewFlags,
      }];
    })
  );

  const speciesRankings = PASS1_SPECIES_PROFILES.map((species) => ({
    speciesId: species.speciesId,
    currentConfiguredCities: auditedRows.filter((row) =>
      row.speciesId === species.speciesId
    ).sort((left, right) =>
      right.maximum - left.maximum || left.cityId.localeCompare(right.cityId)
    ).map((row) => ({
      cityId: row.cityId,
      maximum: row.maximum,
      evidenceGrade: row.evidenceGrade,
    })),
  }));

  return {
    schemaVersion: "piercast-v3-pass1-legacy-curve-audit-v1",
    status: "diagnostic_only_v2_immutable",
    referenceYear: 2025,
    formulaReviewed: "seasonal-opportunity-bounded-temperature-v2",
    warning:
      "These diagnostics identify recalibration risks in legacy curves. They are not proposed v3 values.",
    counts: {
      curves: auditedRows.length,
      lowConfidenceNumericCurves:
        auditedRows.filter((row) =>
          row.reviewFlags.includes("low_confidence_numeric_curve")
        ).length,
      excellentPeaksWithoutGradeA:
        auditedRows.filter((row) =>
          row.reviewFlags.includes("excellent_peak_without_grade_a_evidence")
        ).length,
      cannotDisplayTenUnderV2:
        auditedRows.filter((row) =>
          row.reviewFlags.includes("legacy_formula_cannot_display_10")
        ).length,
    },
    speciesRankings,
    rows: auditedRows,
  };
}

const csvColumns = [
  "cityId",
  "cityName",
  "stateCode",
  "speciesId",
  "speciesName",
  "currentInheritance",
  "currentCurveStatus",
  "currentCurveId",
  "currentMinimum",
  "currentMaximum",
  "ratingEnabled",
  "pass1Disposition",
  "pass1EvidenceGrade",
  "pass1ModeCount",
  "pass1ReviewStatus",
  "currentLimitation",
] as const;

const jsonText = `${JSON.stringify(inventory, null, 2)}\n`;
const csvText = `${csvColumns.join(",")}\n${
  rows.map((row) => csvColumns.map((column) => csvCell(row[column])).join(","))
    .join("\n")
}\n`;

async function main(): Promise<void> {
  const reconciliation = await buildBaselineReconciliation();
  const legacyAudit = buildLegacyCurveAudit(reconciliation);
  const gapRegister = buildEvidenceGapRegister(reconciliation, legacyAudit);
  const reconciliationColumns = [
    "cityId",
    "cityName",
    "stateCode",
    "speciesId",
    "speciesName",
    "baselineDisposition",
    "evidenceGrade",
    "currentCurveStatus",
    "currentCurveId",
    "decisionBasis",
    "evidenceIds",
    "requiredEvidence",
    "v3DecisionStatus",
    "numericStatus",
  ] as const;
  const reconciliationJsonText = `${JSON.stringify(reconciliation, null, 2)}\n`;
  const reconciliationCsvText = `${reconciliationColumns.join(",")}\n${
    reconciliation.rows.map((row) =>
      reconciliationColumns.map((column) =>
        csvCell(
          column === "evidenceIds" ? row.evidenceIds.join("|") : row[column],
        )
      ).join(",")
    ).join("\n")
  }\n`;
  const legacyAuditColumns = [
    "cityId",
    "cityName",
    "speciesId",
    "speciesName",
    "curveId",
    "evidenceGrade",
    "minimum",
    "maximum",
    "peakBand",
    "peakDates",
    "daysStrongOrBetter",
    "daysExcellentOrBetter",
    "daysReferenceClass",
    "perfectTemperatureV2Maximum",
    "canDisplayTenUnderV2",
    "reviewFlags",
  ] as const;
  const legacyAuditJsonText = `${JSON.stringify(legacyAudit, null, 2)}\n`;
  const legacyAuditCsvText = `${legacyAuditColumns.join(",")}\n${
    legacyAudit.rows.map((row) =>
      legacyAuditColumns.map((column) => {
        const value = row[column];
        return csvCell(Array.isArray(value) ? value.join("|") : value);
      }).join(",")
    ).join("\n")
  }\n`;
  const gapColumns = [
    "priority",
    "cityId",
    "speciesId",
    "baselineDisposition",
    "evidenceGrade",
    "currentLegacyMaximum",
    "blockerCategories",
    "requiredEvidence",
    "evidenceIds",
    "closureStatus",
  ] as const;
  const gapRegisterJsonText = `${JSON.stringify(gapRegister, null, 2)}\n`;
  const gapRegisterCsvText = `${gapColumns.join(",")}\n${
    gapRegister.rows.map((row) =>
      gapColumns.map((column) => {
        const value = row[column];
        return csvCell(Array.isArray(value) ? value.join("|") : value);
      }).join(",")
    ).join("\n")
  }\n`;

  if (checkOnly) {
    const [
      existingJson,
      existingCsv,
      existingReconciliationJson,
      existingReconciliationCsv,
      existingLegacyAuditJson,
      existingLegacyAuditCsv,
      existingGapRegisterJson,
      existingGapRegisterCsv,
    ] = await Promise.all([
      readFile(JSON_PATH, "utf8"),
      readFile(CSV_PATH, "utf8"),
      readFile(RECONCILIATION_JSON_PATH, "utf8"),
      readFile(RECONCILIATION_CSV_PATH, "utf8"),
      readFile(LEGACY_AUDIT_JSON_PATH, "utf8"),
      readFile(LEGACY_AUDIT_CSV_PATH, "utf8"),
      readFile(GAP_REGISTER_JSON_PATH, "utf8"),
      readFile(GAP_REGISTER_CSV_PATH, "utf8"),
    ]);
    if (
      existingJson !== jsonText || existingCsv !== csvText ||
      existingReconciliationJson !== reconciliationJsonText ||
      existingReconciliationCsv !== reconciliationCsvText ||
      existingLegacyAuditJson !== legacyAuditJsonText ||
      existingLegacyAuditCsv !== legacyAuditCsvText ||
      existingGapRegisterJson !== gapRegisterJsonText ||
      existingGapRegisterCsv !== gapRegisterCsvText
    ) {
      throw new Error("PierCast v3 Pass 1 pairing inventory is stale.");
    }
  } else {
    await mkdir(OUTPUT_DIRECTORY, { recursive: true });
    await Promise.all([
      writeFile(JSON_PATH, jsonText),
      writeFile(CSV_PATH, csvText),
      writeFile(RECONCILIATION_JSON_PATH, reconciliationJsonText),
      writeFile(RECONCILIATION_CSV_PATH, reconciliationCsvText),
      writeFile(LEGACY_AUDIT_JSON_PATH, legacyAuditJsonText),
      writeFile(LEGACY_AUDIT_CSV_PATH, legacyAuditCsvText),
      writeFile(GAP_REGISTER_JSON_PATH, gapRegisterJsonText),
      writeFile(GAP_REGISTER_CSV_PATH, gapRegisterCsvText),
    ]);
  }

  console.log(
    JSON.stringify({
      checkOnly,
      cities: allCities.length,
      species: PASS1_SPECIES_PROFILES.length,
      decisions: rows.length,
      configured: configuredCount,
    }),
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
