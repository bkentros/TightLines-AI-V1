import type {
  BehaviorProfile,
  GaugeProvider,
  GreatLakesState,
  ReachQuality,
  RiverMetric,
  RiverProfile,
  RiverRunProfile,
  RiverRunSpecies,
  RiverRunValidationIssue,
  RiverValidationResult,
  RunType,
  RunValidationResult,
  Season,
  SupportStatus,
  TemperatureProvider,
  TemperatureSourceType,
  VisibleRiverRunCatalog,
} from "./types.ts";

const STATES: readonly GreatLakesState[] = [
  "MI",
  "WI",
  "IL",
  "IN",
  "OH",
  "PA",
  "NY",
];
const SEASONS: readonly Season[] = ["spring", "summer", "fall", "winter"];
const SPECIES: readonly RiverRunSpecies[] = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "skamania",
  "lake_run_brown_trout",
  "atlantic_salmon",
];
const RUN_TYPES: readonly RunType[] = [
  "fall_spawn",
  "fall_entry",
  "winter_run",
  "spring_spawn",
  "summer_run",
  "holding",
];
const BEHAVIOR_PROFILES: readonly BehaviorProfile[] = [
  "fall_cooling_rain_pulse",
  "spring_warming_flow_pulse",
  "winter_thaw_flow_window",
  "summer_cool_rain_pulse",
  "stable_cool_holding",
];
const METRICS: readonly RiverMetric[] = ["flow_cfs", "gage_height_ft"];
const GAUGE_PROVIDERS: readonly GaugeProvider[] = ["USGS", "OTHER_OFFICIAL"];
const TEMPERATURE_PROVIDERS: readonly TemperatureProvider[] = [
  "USGS",
  "OTHER_OFFICIAL",
  "OpenMeteo",
];
const TEMPERATURE_SOURCE_TYPES: readonly TemperatureSourceType[] = [
  "same_gauge",
  "nearby_gauge",
  "adjusted_reference_gauge",
  "air_temp_proxy",
  "unavailable",
];
const PUBLIC_REACH_QUALITIES: readonly ReachQuality[] = ["good", "acceptable"];
const SUPPORT_STATUSES: readonly SupportStatus[] = ["beta", "verified"];

function issue(
  field: string,
  message: string,
  code: RiverRunValidationIssue["code"] = "config_required_field_missing",
  severity: RiverRunValidationIssue["severity"] = "error",
): RiverRunValidationIssue {
  return { code, severity, field, message };
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function includes<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function isValidTimezone(timezone: unknown): timezone is string {
  if (!hasText(timezone)) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(
      new Date(0),
    );
    return true;
  } catch {
    return false;
  }
}

function isValidLat(lat: unknown): lat is number {
  return hasNumber(lat) && lat >= -90 && lat <= 90;
}

function isValidLon(lon: unknown): lon is number {
  return hasNumber(lon) && lon >= -180 && lon <= 180;
}

function parseMonthDay(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  if (month < 1 || month > 12) return null;
  const daysInMonth =
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (day < 1 || day > daysInMonth) return null;
  return [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335][month - 1] +
    day;
}

function isOrdinalInWindow(
  ordinal: number,
  start: number,
  end: number,
): boolean {
  if (start <= end) {
    return ordinal >= start && ordinal <= end;
  }
  return ordinal >= start || ordinal <= end;
}

export function validateRiverProfile(
  river: RiverProfile,
): RiverValidationResult {
  const issues: RiverRunValidationIssue[] = [];

  if (!hasText(river.riverId)) {
    issues.push(issue("riverId", "River ID is required."));
  }
  if (!hasText(river.displayName)) {
    issues.push(issue("displayName", "River display name is required."));
  }
  if (!includes(STATES, river.state)) {
    issues.push(
      issue("state", "River state is not supported.", "config_invalid_value"),
    );
  }
  if (river.region !== "great_lakes") {
    issues.push(
      issue(
        "region",
        "River region must be great_lakes.",
        "config_invalid_value",
      ),
    );
  }
  if (!isValidTimezone(river.timezone)) {
    issues.push(
      issue(
        "timezone",
        "River timezone is required and must be valid.",
        "config_invalid_value",
      ),
    );
  }
  if (!isValidLat(river.mouthLat)) {
    issues.push(
      issue(
        "mouthLat",
        "River mouth latitude must be valid.",
        "config_invalid_value",
      ),
    );
  }
  if (!isValidLon(river.mouthLon)) {
    issues.push(
      issue(
        "mouthLon",
        "River mouth longitude must be valid.",
        "config_invalid_value",
      ),
    );
  }
  if (river.weatherLat !== undefined && !isValidLat(river.weatherLat)) {
    issues.push(
      issue(
        "weatherLat",
        "Weather latitude must be valid when configured.",
        "config_invalid_value",
      ),
    );
  }
  if (river.weatherLon !== undefined && !isValidLon(river.weatherLon)) {
    issues.push(
      issue(
        "weatherLon",
        "Weather longitude must be valid when configured.",
        "config_invalid_value",
      ),
    );
  }
  if (!river.gauge) {
    issues.push(issue("gauge", "Gauge config is required."));
  } else {
    if (!includes(GAUGE_PROVIDERS, river.gauge.provider)) {
      issues.push(
        issue(
          "gauge.provider",
          "Gauge provider is not supported.",
          "config_invalid_value",
        ),
      );
    }
    if (!hasText(river.gauge.siteId)) {
      issues.push(issue("gauge.siteId", "Gauge site ID is required."));
    }
    if (!hasText(river.gauge.name)) {
      issues.push(issue("gauge.name", "Gauge name is required."));
    }
    if (!includes(METRICS, river.gauge.primaryMetric)) {
      issues.push(
        issue(
          "gauge.primaryMetric",
          "Gauge primary metric is not supported.",
          "gauge_metric_missing",
        ),
      );
    }
    if (
      river.gauge.availableMetrics &&
      !river.gauge.availableMetrics.includes(river.gauge.primaryMetric)
    ) {
      issues.push(
        issue(
          "gauge.availableMetrics",
          "Gauge available metrics must include the primary metric.",
          "gauge_metric_missing",
        ),
      );
    }
    if (!PUBLIC_REACH_QUALITIES.includes(river.gauge.reachQuality)) {
      issues.push(
        issue(
          "gauge.reachQuality",
          "Gauge reach quality is not sufficient for public support.",
          "gauge_reach_limited",
        ),
      );
    }
    if (!hasText(river.gauge.reachNotes)) {
      issues.push(issue("gauge.reachNotes", "Gauge reach notes are required."));
    }
    if ((river.gauge.historyYearsAvailable ?? 0) < 2) {
      issues.push(
        issue(
          "gauge.historyYearsAvailable",
          "Gauge requires at least 2 years of usable history.",
          "baseline_insufficient_history",
        ),
      );
    }
    if (river.gauge.maxAgeHours !== undefined && river.gauge.maxAgeHours <= 0) {
      issues.push(
        issue(
          "gauge.maxAgeHours",
          "Gauge max age must be positive when configured.",
          "config_invalid_value",
        ),
      );
    }
  }
  if (!includes(SUPPORT_STATUSES, river.supportStatus)) {
    issues.push(
      issue(
        "supportStatus",
        "River support status is invalid.",
        "config_invalid_value",
      ),
    );
  }
  if (!hasText(river.gaugeLimitationCopy)) {
    issues.push(
      issue("gaugeLimitationCopy", "Gauge limitation copy is required."),
    );
  }

  const valid = issues.length === 0;
  return {
    kind: "river",
    riverId: river.riverId,
    valid,
    publicVisible: valid,
    issues,
  };
}

export function validateRunProfile(
  run: RiverRunProfile,
  river?: RiverProfile,
): RunValidationResult {
  const issues: RiverRunValidationIssue[] = [];
  const visibilityIssues: RiverRunValidationIssue[] = [];

  if (!hasText(run.runId)) {
    issues.push(issue("runId", "Run ID is required."));
  }
  if (!hasText(run.riverId)) {
    issues.push(issue("riverId", "Run river ID is required."));
  }
  if (river && run.riverId !== river.riverId) {
    issues.push(
      issue(
        "riverId",
        "Run river ID must match the supplied river.",
        "config_invalid_value",
      ),
    );
  }
  if (!hasText(run.displayName)) {
    issues.push(issue("displayName", "Run display name is required."));
  }
  if (!includes(SPECIES, run.species)) {
    issues.push(
      issue("species", "Run species is not supported.", "config_invalid_value"),
    );
  }
  if (!includes(SEASONS, run.season)) {
    issues.push(
      issue("season", "Run season is not supported.", "config_invalid_value"),
    );
  }
  if (!includes(RUN_TYPES, run.runType)) {
    issues.push(
      issue("runType", "Run type is not supported.", "config_invalid_value"),
    );
  }
  if (!includes(BEHAVIOR_PROFILES, run.behaviorProfile)) {
    issues.push(
      issue(
        "behaviorProfile",
        "Behavior profile is not supported.",
        "config_invalid_value",
      ),
    );
  }

  const start = parseMonthDay(run.runWindow?.start);
  const peak = parseMonthDay(run.runWindow?.peak);
  const end = parseMonthDay(run.runWindow?.end);
  if (start === null) {
    issues.push(
      issue(
        "runWindow.start",
        "Run window start must be MM-DD.",
        "config_date_invalid",
      ),
    );
  }
  if (peak === null) {
    issues.push(
      issue(
        "runWindow.peak",
        "Run window peak must be MM-DD.",
        "config_date_invalid",
      ),
    );
  }
  if (end === null) {
    issues.push(
      issue(
        "runWindow.end",
        "Run window end must be MM-DD.",
        "config_date_invalid",
      ),
    );
  }
  if (
    start !== null && peak !== null && end !== null &&
    !isOrdinalInWindow(peak, start, end)
  ) {
    issues.push(
      issue(
        "runWindow.peak",
        "Run window peak must fall between start and end, including cross-year windows.",
        "config_date_order_invalid",
      ),
    );
  }

  if (![1, 2, 3, 4, 5].includes(run.runStrength)) {
    issues.push(
      issue(
        "runStrength",
        "Run strength must be 1 through 5.",
        "config_invalid_value",
      ),
    );
  }
  validateFishabilityBasis(run, issues);
  validateTemperatureSource(run, issues);
  validateAuditFields(run, issues);
  validatePublicAuditGate(run, visibilityIssues);

  const valid = issues.every((item) => item.severity !== "error");
  const publicVisible = valid &&
    visibilityIssues.every((item) => item.severity !== "error");
  return {
    kind: "run",
    riverId: run.riverId,
    runId: run.runId,
    valid,
    publicVisible,
    issues: [...issues, ...visibilityIssues],
  };
}

function validateFishabilityBasis(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  if (run.fishabilityBands) {
    if (!includes(METRICS, run.fishabilityBands.metric)) {
      issues.push(
        issue(
          "fishabilityBands.metric",
          "Fishability band metric is invalid.",
          "config_invalid_value",
        ),
      );
    }
    return;
  }

  if (!run.baselineCoverage?.hasPercentileBaselines) {
    issues.push(
      issue(
        "baselineCoverage",
        "Run needs fishability override bands or percentile baselines.",
        "baseline_missing",
      ),
    );
    return;
  }
  if (run.baselineCoverage.coveredWindowPercent < 0.9) {
    issues.push(
      issue(
        "baselineCoverage.coveredWindowPercent",
        "Baseline coverage must cover at least 90% of the audited run window.",
        "baseline_insufficient_history",
      ),
    );
  }
  if (run.baselineCoverage.minimumHistoryYears < 2) {
    issues.push(
      issue(
        "baselineCoverage.minimumHistoryYears",
        "Baseline coverage requires at least 2 distinct years.",
        "baseline_insufficient_history",
      ),
    );
  }
  if (
    run.baselineCoverage.metric &&
    !includes(METRICS, run.baselineCoverage.metric)
  ) {
    issues.push(
      issue(
        "baselineCoverage.metric",
        "Baseline metric is invalid.",
        "config_invalid_value",
      ),
    );
  }
}

function validateTemperatureSource(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  const source = run.waterTemperatureSource;
  if (!source) {
    issues.push(
      issue(
        "waterTemperatureSource",
        "Water temperature source is required.",
        "temperature_source_invalid",
      ),
    );
    return;
  }
  if (!includes(TEMPERATURE_SOURCE_TYPES, source.type)) {
    issues.push(
      issue(
        "waterTemperatureSource.type",
        "Water temperature source type is invalid.",
        "temperature_source_invalid",
      ),
    );
  }
  if (
    source.provider !== undefined &&
    !includes(TEMPERATURE_PROVIDERS, source.provider)
  ) {
    issues.push(
      issue(
        "waterTemperatureSource.provider",
        "Water temperature provider is invalid.",
        "temperature_source_invalid",
      ),
    );
  }
  if (
    ["same_gauge", "nearby_gauge", "adjusted_reference_gauge"].includes(
      source.type,
    )
  ) {
    if (!hasText(source.provider)) {
      issues.push(
        issue(
          "waterTemperatureSource.provider",
          "Measured temperature sources require a provider.",
          "temperature_source_invalid",
        ),
      );
    }
    if (!hasText(source.siteId)) {
      issues.push(
        issue(
          "waterTemperatureSource.siteId",
          "Measured temperature sources require a site ID.",
          "temperature_source_invalid",
        ),
      );
    }
  }
  if (
    source.type === "air_temp_proxy" && source.provider &&
    source.provider !== "OpenMeteo"
  ) {
    issues.push(
      issue(
        "waterTemperatureSource.provider",
        "Air proxy temperature must use OpenMeteo when provider is configured.",
        "temperature_source_invalid",
      ),
    );
  }
  if (
    source.type === "adjusted_reference_gauge" && !hasNumber(source.adjustmentF)
  ) {
    issues.push(
      issue(
        "waterTemperatureSource.adjustmentF",
        "Adjusted reference gauges require adjustmentF.",
        "temperature_source_invalid",
      ),
    );
  }
  if (!hasText(source.notes)) {
    issues.push(
      issue(
        "waterTemperatureSource.notes",
        "Temperature source notes are required.",
        "temperature_source_invalid",
      ),
    );
  }
}

function validateAuditFields(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  const requiredCopyHints = [
    ["userCopyHints.preRunTip", run.userCopyHints?.preRunTip],
    ["userCopyHints.peakTip", run.userCopyHints?.peakTip],
    ["userCopyHints.endingTip", run.userCopyHints?.endingTip],
  ] as const;
  for (const [field, value] of requiredCopyHints) {
    if (!hasText(value)) {
      issues.push(
        issue(
          field,
          "Audited launch copy hint is required.",
          "audit_field_missing",
        ),
      );
    }
  }
  if (!hasText(run.researchNotes) && !hasText(run.sourceNotes)) {
    issues.push(
      issue(
        "researchNotes",
        "Public runs require research notes or source notes.",
        "audit_notes_missing",
      ),
    );
  }
}

function validatePublicAuditGate(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  const auditGate = (run as RiverRunProfile & {
    publicAudit?: { isEnabled?: boolean };
  }).publicAudit;

  if (auditGate?.isEnabled !== true) {
    issues.push(
      issue(
        "publicAudit.isEnabled",
        "Public audit gate is disabled for this run.",
        "audit_gate_disabled",
      ),
    );
  }
}

export function listVisibleRiverRuns(
  rivers: readonly RiverProfile[],
  runs: readonly RiverRunProfile[],
): VisibleRiverRunCatalog[] {
  const riverById = new Map(rivers.map((river) => [river.riverId, river]));
  const visibleRivers = new Map<GreatLakesState, VisibleRiverRunCatalog>();

  for (const river of rivers) {
    const riverValidation = validateRiverProfile(river);
    if (!riverValidation.publicVisible) continue;

    const visibleRuns = runs
      .filter((run) => run.riverId === river.riverId)
      .filter((run) =>
        validateRunProfile(run, riverById.get(run.riverId)).publicVisible
      )
      .map((run) => ({
        runId: run.runId,
        displayName: run.displayName,
        species: run.species,
        season: run.season,
        supportStatus: river.supportStatus,
      }));

    if (visibleRuns.length === 0) continue;

    const stateEntry = visibleRivers.get(river.state) ?? {
      state: river.state,
      rivers: [],
    };
    stateEntry.rivers.push({
      riverId: river.riverId,
      displayName: river.displayName,
      runs: visibleRuns,
    });
    visibleRivers.set(river.state, stateEntry);
  }

  return [...visibleRivers.values()];
}
