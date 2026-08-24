import {
  RIVER_RUN_CONFIGURATION_DOCUMENTS,
  validateRiverProfile,
  validateRunProfile,
  validateSpeciesBiologyProfile,
} from "../../supabase/functions/_shared/riverRunEngine/index.ts";
import type {
  AuditedRiverRunProfile,
  RiverLiveMetricId,
  RiverProfile,
  RiverRunConfigurationDocument,
  RiverRunValidationIssue,
} from "../../supabase/functions/_shared/riverRunEngine/types.ts";

export const PUBLIC_RIVER_RUN_PRIMITIVES = [
  "run_stage",
  "activity",
  "fish_in_river",
  "fishability",
] as const;

export const RIVER_RUN_LIVE_CONDITIONS_SURFACE = "live_conditions" as const;

export type OnboardingSeverity = "error" | "warning" | "info";

export type OnboardingFinding = {
  severity: OnboardingSeverity;
  gate: string;
  field: string;
  message: string;
};

export type RunOnboardingAudit = {
  runId: string;
  species: string;
  publicAuditEnabled: boolean;
  visiblePrimitives: readonly string[];
  activityMode: "observed_river" | "weather_only" | "unavailable";
  findings: OnboardingFinding[];
};

export type RiverOnboardingAudit = {
  riverId: string;
  displayName: string;
  configurationVersion: string;
  status: "ready" | "blocked";
  publicPrimitiveOrder: readonly string[];
  liveConditions: {
    status: "configured" | "unavailable";
    expectedMetrics: RiverLiveMetricId[];
    hydraulicSourceCount: number;
    temperatureSourceCount: number;
  };
  runs: RunOnboardingAudit[];
  findings: OnboardingFinding[];
};

export type PortfolioOnboardingAudit = {
  generatedAt: string;
  status: "ready" | "blocked";
  riverCount: number;
  runCount: number;
  errorCount: number;
  warningCount: number;
  rivers: RiverOnboardingAudit[];
};

export function auditCurrentRiverRunPortfolio(
  documents: readonly RiverRunConfigurationDocument[] =
    RIVER_RUN_CONFIGURATION_DOCUMENTS,
  generatedAt = new Date().toISOString(),
): PortfolioOnboardingAudit {
  const seenRiverIds = new Set<string>();
  const seenRunIds = new Set<string>();
  const rivers = documents.map((document) => {
    const audit = auditConfigurationDocument(document);
    if (seenRiverIds.has(document.river.riverId)) {
      audit.findings.push(finding(
        "error",
        "registry",
        "riverId",
        `Duplicate configuration document for ${document.river.riverId}.`,
      ));
    }
    seenRiverIds.add(document.river.riverId);
    for (const run of document.runs) {
      if (seenRunIds.has(run.runId)) {
        audit.findings.push(finding(
          "error",
          "registry",
          `runs.${run.runId}`,
          `Duplicate run ID ${run.runId}.`,
        ));
      }
      seenRunIds.add(run.runId);
    }
    audit.status = hasErrors(audit) ? "blocked" : "ready";
    return audit;
  });
  const allFindings = rivers.flatMap((river) => [
    ...river.findings,
    ...river.runs.flatMap((run) => run.findings),
  ]);
  const errorCount =
    allFindings.filter((item) => item.severity === "error").length;
  const warningCount =
    allFindings.filter((item) => item.severity === "warning").length;
  return {
    generatedAt,
    status: errorCount === 0 ? "ready" : "blocked",
    riverCount: rivers.length,
    runCount: rivers.reduce((sum, river) => sum + river.runs.length, 0),
    errorCount,
    warningCount,
    rivers,
  };
}

export function auditConfigurationDocument(
  document: RiverRunConfigurationDocument,
): RiverOnboardingAudit {
  const river = document.river;
  const findings: OnboardingFinding[] = [];
  if (document.schemaVersion !== "river-run-config-v1") {
    findings.push(finding(
      "error",
      "configuration",
      "schemaVersion",
      "Unsupported River Run configuration schema.",
    ));
  }
  if (!document.configVersion.trim()) {
    findings.push(finding(
      "error",
      "configuration",
      "configVersion",
      "Configuration version is required.",
    ));
  }
  findings.push(...validationFindings(validateRiverProfile(river).issues));
  auditRiverFoundation(river, findings);
  auditLiveConditions(river, findings);

  const biologyById = new Map(
    document.biologyProfiles.map((
      profile,
    ) => [profile.biologyProfileId, profile]),
  );
  for (const profile of document.biologyProfiles) {
    findings.push(
      ...validationFindings(validateSpeciesBiologyProfile(profile)),
    );
  }

  const runs = document.runs.map((run) => {
    const runFindings = validationFindings(
      validateRunProfile(run, river).issues,
    );
    const biology = biologyById.get(run.biologyProfileId);
    if (!biology) {
      runFindings.push(finding(
        "error",
        "species_run",
        "biologyProfileId",
        `Biology profile ${run.biologyProfileId} is not included in this document.`,
      ));
    } else if (biology.species !== run.species) {
      runFindings.push(finding(
        "error",
        "species_run",
        "biologyProfileId",
        "Run species does not match its biology profile.",
      ));
    }
    auditRun(run, river, runFindings);
    return {
      runId: run.runId,
      species: run.species,
      publicAuditEnabled: run.publicAudit.isEnabled,
      visiblePrimitives: PUBLIC_RIVER_RUN_PRIMITIVES,
      activityMode: activityMode(run),
      findings: runFindings,
    } satisfies RunOnboardingAudit;
  });

  const configuredSpecies = new Set(document.runs.map((run) => run.species));
  for (const species of river.foundation?.targetSpecies ?? []) {
    if (!configuredSpecies.has(species)) {
      findings.push(finding(
        "error",
        "registry",
        "foundation.targetSpecies",
        `${species} is declared by the river foundation but has no run profile.`,
      ));
    }
  }

  const expectedMetrics = expectedLiveMetrics(river);
  const audit: RiverOnboardingAudit = {
    riverId: river.riverId,
    displayName: river.displayName,
    configurationVersion: document.configVersion,
    status: "ready",
    publicPrimitiveOrder: PUBLIC_RIVER_RUN_PRIMITIVES,
    liveConditions: {
      status: expectedMetrics.length ? "configured" : "unavailable",
      expectedMetrics,
      hydraulicSourceCount: river.hydraulicSources.length,
      temperatureSourceCount: river.waterTemperatureSources.length,
    },
    runs,
    findings,
  };
  audit.status = hasErrors(audit) ? "blocked" : "ready";
  return audit;
}

export function expectedLiveMetrics(river: RiverProfile): RiverLiveMetricId[] {
  const metrics = new Set<RiverLiveMetricId>();
  const primary = river.hydraulicSources.find((source) =>
    source.role === "primary"
  );
  for (const metric of primary?.availableMetrics ?? []) metrics.add(metric);
  if (river.waterTemperatureSources.length > 0) metrics.add("water_temp_f");
  return [...metrics];
}

function auditRiverFoundation(
  river: RiverProfile,
  findings: OnboardingFinding[],
): void {
  const foundation = river.foundation;
  if (!foundation) {
    findings.push(finding(
      "error",
      "river_foundation",
      "foundation",
      "A researched river foundation is required before onboarding runs.",
    ));
    return;
  }
  if (!foundation.stateRegulations?.length && !foundation.regulation) {
    findings.push(finding(
      "error",
      "river_foundation",
      "foundation.stateRegulations",
      "At least one current regulation jurisdiction record is required.",
    ));
  }
  foundation.reaches.forEach((reach, index) => {
    if (!reach.sourceNotes.trim()) {
      findings.push(finding(
        "error",
        "research_evidence",
        `foundation.reaches[${index}].sourceNotes`,
        "Every public reach requires research provenance.",
      ));
    }
  });
  const represented = foundation.reaches.filter((reach) =>
    reach.gaugeRepresented
  );
  if (river.hydraulicSources.length === 0 && represented.length > 0) {
    findings.push(finding(
      "error",
      "river_foundation",
      "foundation.reaches.gaugeRepresented",
      "An ungauged river cannot mark a reach as gauge represented.",
    ));
  }
  if (
    foundation.primaryGaugeReachId != null &&
    !foundation.reaches.some((reach) =>
      reach.reachId === foundation.primaryGaugeReachId &&
      reach.gaugeRepresented
    )
  ) {
    findings.push(finding(
      "error",
      "river_foundation",
      "foundation.primaryGaugeReachId",
      "Primary gauge reach must resolve to a gauge-represented foundation reach.",
    ));
  }
}

function auditLiveConditions(
  river: RiverProfile,
  findings: OnboardingFinding[],
): void {
  const hydraulicAvailable =
    river.conditionDataCapabilities.hydraulics.status === "available";
  const temperatureAvailable =
    river.conditionDataCapabilities.waterTemperature.status === "available";
  if (hydraulicAvailable !== (river.hydraulicSources.length > 0)) {
    findings.push(finding(
      "error",
      "live_conditions",
      "conditionDataCapabilities.hydraulics",
      "Hydraulic capability must agree with configured hydraulic sources.",
    ));
  }
  if (temperatureAvailable !== (river.waterTemperatureSources.length > 0)) {
    findings.push(finding(
      "error",
      "live_conditions",
      "conditionDataCapabilities.waterTemperature",
      "Water-temperature capability must agree with configured temperature sources.",
    ));
  }
  if (
    river.hydraulicSources.length > 0 &&
    !river.hydraulicSources.some((source) => source.role === "primary")
  ) {
    findings.push(finding(
      "error",
      "live_conditions",
      "hydraulicSources",
      "Live Conditions requires exactly one accepted primary hydraulic source.",
    ));
  }
  if (!river.gaugeLimitationCopy.trim()) {
    findings.push(finding(
      "error",
      "live_conditions",
      "gaugeLimitationCopy",
      "Live Conditions requires public reach-limitation copy, including no-gauge rivers.",
    ));
  }
}

function auditRun(
  run: AuditedRiverRunProfile,
  river: RiverProfile,
  findings: OnboardingFinding[],
): void {
  if (!run.publicAudit.isEnabled) {
    findings.push(finding(
      "error",
      "acceptance",
      "publicAudit.isEnabled",
      "Run remains hidden until its versioned public audit is enabled.",
    ));
  }
  if (!run.publicAudit.auditVersion?.trim()) {
    findings.push(finding(
      "error",
      "acceptance",
      "publicAudit.auditVersion",
      "A versioned public audit identifier is required.",
    ));
  }
  if (!run.researchNotes?.trim() || !run.sourceNotes?.trim()) {
    findings.push(finding(
      "error",
      "research_evidence",
      "researchNotes/sourceNotes",
      "Every run requires research notes and source notes.",
    ));
  }
  const activityAvailable =
    run.primitiveCapabilities.activity?.status === "available";
  if (activityAvailable && !run.activity) {
    findings.push(finding(
      "error",
      "activity",
      "activity",
      "An available Activity primitive requires an audited Activity profile.",
    ));
  }
  if (!activityAvailable) {
    findings.push(finding(
      "error",
      "activity",
      "primitiveCapabilities.activity",
      "All new public runs require an accepted Activity calibration.",
    ));
    return;
  }
  const mode = run.activity?.dataMode ?? "observed_river";
  if (mode === "weather_only") {
    if (
      run.activity?.weights.waterTemperature !== 0 ||
      run.activity.weights.riverBehavior !== 0
    ) {
      findings.push(finding(
        "error",
        "activity",
        "activity.weights",
        "Weather-only Activity cannot score unmeasured river or temperature inputs.",
      ));
    }
    if (
      river.hydraulicSources.length > 0 ||
      river.waterTemperatureSources.length > 0
    ) {
      findings.push(finding(
        "warning",
        "activity",
        "activity.dataMode",
        "Weather-only mode is configured even though measured sources exist; document why they are not accepted.",
      ));
    }
  } else if (
    river.hydraulicSources.length === 0 ||
    river.waterTemperatureSources.length === 0
  ) {
    findings.push(finding(
      "error",
      "activity",
      "activity.dataMode",
      "Observed-river Activity requires accepted hydraulics and measured water temperature.",
    ));
  }
  if (!run.activity?.version.trim() || !run.activity.evidenceNotes.trim()) {
    findings.push(finding(
      "error",
      "activity",
      "activity.version/evidenceNotes",
      "Activity rules require a version and evidence rationale.",
    ));
  }
}

function activityMode(
  run: AuditedRiverRunProfile,
): "observed_river" | "weather_only" | "unavailable" {
  if (
    run.primitiveCapabilities.activity?.status !== "available" || !run.activity
  ) {
    return "unavailable";
  }
  return run.activity.dataMode ?? "observed_river";
}

function validationFindings(
  issues: readonly RiverRunValidationIssue[],
): OnboardingFinding[] {
  return issues.map((item) =>
    finding(
      item.severity,
      "engine_validation",
      item.field,
      `${item.code}: ${item.message}`,
    )
  );
}

function finding(
  severity: OnboardingSeverity,
  gate: string,
  field: string,
  message: string,
): OnboardingFinding {
  return { severity, gate, field, message };
}

function hasErrors(audit: RiverOnboardingAudit): boolean {
  return [...audit.findings, ...audit.runs.flatMap((run) => run.findings)]
    .some((item) => item.severity === "error");
}
