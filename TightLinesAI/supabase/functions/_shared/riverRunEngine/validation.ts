import { getMovementEngineDefinition } from "./config/movementEngines.ts";
import type {
  GreatLakesState,
  MovementEngineId,
  RiverMetric,
  RiverProfile,
  RiverRunConfigurationRevision,
  RiverRunProfile,
  RiverRunSpecies,
  RiverRunValidationIssue,
  RiverValidationResult,
  RunType,
  RunValidationResult,
  Season,
  SupportStatus,
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
const MOVEMENT_ENGINES: readonly MovementEngineId[] = [
  "fall_cooling",
  "spring_warming",
  "winter_thaw",
  "summer_cooling",
  "stable_cool_holding",
];
const METRICS: readonly RiverMetric[] = ["flow_cfs", "gage_height_ft"];
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

function validCap(value: unknown, maximum: number): value is number {
  return hasNumber(value) && value >= 0 && value <= maximum;
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

function forwardDistance(from: number, to: number): number {
  return to >= from ? to - from : 366 - from + to;
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
        "River timezone must be valid.",
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

  validateHydraulicSources(river, issues);
  validateTemperatureSources(river, issues);
  validateWeatherPoints(river, issues);

  const valid = issues.every((item) => item.severity !== "error");
  return {
    kind: "river",
    riverId: river.riverId,
    valid,
    publicVisible: valid,
    issues,
  };
}

function validateHydraulicSources(
  river: RiverProfile,
  issues: RiverRunValidationIssue[],
): void {
  if (
    !Array.isArray(river.hydraulicSources) ||
    river.hydraulicSources.length === 0
  ) {
    issues.push(
      issue(
        "hydraulicSources",
        "At least one hydraulic source is required.",
        "config_source_invalid",
      ),
    );
    return;
  }
  if (
    river.hydraulicSources.filter((source) => source.role === "primary")
      .length !== 1
  ) {
    issues.push(
      issue(
        "hydraulicSources",
        "Exactly one hydraulic source must be primary.",
        "config_source_invalid",
      ),
    );
  }
  const ids = new Set<string>();
  river.hydraulicSources.forEach((source, index) => {
    const field = `hydraulicSources[${index}]`;
    if (!hasText(source.sourceId) || ids.has(source.sourceId)) {
      issues.push(
        issue(
          `${field}.sourceId`,
          "Hydraulic source IDs must be present and unique.",
          "config_source_invalid",
        ),
      );
    }
    ids.add(source.sourceId);
    if (
      source.provider !== "USGS" || !hasText(source.siteId) ||
      !hasText(source.name)
    ) {
      issues.push(
        issue(
          field,
          "Hydraulic sources require a supported provider, site ID, and name.",
          "config_source_invalid",
        ),
      );
    }
    if (
      !includes(METRICS, source.primaryMetric) ||
      !Array.isArray(source.availableMetrics) ||
      !source.availableMetrics.includes(source.primaryMetric)
    ) {
      issues.push(
        issue(
          `${field}.primaryMetric`,
          "The primary hydraulic metric must be supported and available.",
          "gauge_metric_missing",
        ),
      );
    }
    if (!["good", "acceptable"].includes(source.reachQuality)) {
      issues.push(
        issue(
          `${field}.reachQuality`,
          "A public primary/context gauge needs an audited usable reach.",
          "gauge_reach_limited",
        ),
      );
    }
    if (!hasText(source.reachNotes)) {
      issues.push(
        issue(
          `${field}.reachNotes`,
          "Hydraulic reach notes are required.",
          "config_source_invalid",
        ),
      );
    }
    if (
      !hasNumber(source.historyYearsAvailable) ||
      source.historyYearsAvailable < 2
    ) {
      issues.push(
        issue(
          `${field}.historyYearsAvailable`,
          "Hydraulic sources need at least two usable history years.",
          "baseline_insufficient_history",
        ),
      );
    }
    if (!hasNumber(source.maxAgeHours) || source.maxAgeHours <= 0) {
      issues.push(
        issue(
          `${field}.maxAgeHours`,
          "Hydraulic max age must be positive.",
          "config_source_invalid",
        ),
      );
    }
  });
}

function validateTemperatureSources(
  river: RiverProfile,
  issues: RiverRunValidationIssue[],
): void {
  const ids = new Set<string>();
  const priorities = new Set<number>();
  for (
    const [index, source] of (river.waterTemperatureSources ?? []).entries()
  ) {
    const field = `waterTemperatureSources[${index}]`;
    if (!hasText(source.sourceId) || ids.has(source.sourceId)) {
      issues.push(
        issue(
          `${field}.sourceId`,
          "Temperature source IDs must be present and unique.",
          "temperature_source_invalid",
        ),
      );
    }
    ids.add(source.sourceId);
    if (
      !["USGS", "MONITOR_MY_WATERSHED"].includes(source.provider) ||
      !hasText(source.siteId) || !hasText(source.name)
    ) {
      issues.push(
        issue(
          field,
          "Measured temperature sources require a supported provider, site ID, and name.",
          "temperature_source_invalid",
        ),
      );
    }
    if (
      source.provider === "MONITOR_MY_WATERSHED" && !hasText(source.seriesId)
    ) {
      issues.push(
        issue(
          `${field}.seriesId`,
          "Monitor My Watershed sources require an audited series ID.",
          "temperature_source_invalid",
        ),
      );
    }
    if (
      !Number.isInteger(source.priority) || source.priority < 1 ||
      priorities.has(source.priority)
    ) {
      issues.push(
        issue(
          `${field}.priority`,
          "Temperature priorities must be unique positive integers.",
          "temperature_source_invalid",
        ),
      );
    }
    priorities.add(source.priority);
    if (
      !hasNumber(source.minValidF) || !hasNumber(source.maxValidF) ||
      source.minValidF >= source.maxValidF ||
      source.minValidF < 25 || source.maxValidF > 95
    ) {
      issues.push(
        issue(
          field,
          "Temperature physical bounds are invalid.",
          "temperature_source_invalid",
        ),
      );
    }
    if (
      !hasNumber(source.maxAgeHours) || source.maxAgeHours <= 0 ||
      !hasNumber(source.smoothingWindowHours) ||
      source.smoothingWindowHours <= 0 ||
      !hasNumber(source.maxRateChangeFPerHour) ||
      source.maxRateChangeFPerHour <= 0 ||
      !hasNumber(source.maxPeerDifferenceF) || source.maxPeerDifferenceF <= 0
    ) {
      issues.push(
        issue(
          field,
          "Temperature freshness and QA limits must be positive.",
          "temperature_source_invalid",
        ),
      );
    }
    if (!hasText(source.reachNotes) || !hasText(source.attribution)) {
      issues.push(
        issue(
          field,
          "Temperature reach notes and attribution are required.",
          "temperature_source_invalid",
        ),
      );
    }
  }
  if (
    !Array.isArray(river.waterTemperatureSources) ||
    river.waterTemperatureSources.length === 0
  ) {
    issues.push(
      issue(
        "waterTemperatureSources",
        "At least one audited measured water-temperature source is required before a river can be supported.",
        "temperature_source_invalid",
      ),
    );
  } else if (
    river.waterTemperatureSources.filter((source) => source.role === "primary")
      .length !== 1
  ) {
    issues.push(
      issue(
        "waterTemperatureSources",
        "Exactly one configured water-temperature source must be primary.",
        "temperature_source_invalid",
      ),
    );
  }
}

function validateWeatherPoints(
  river: RiverProfile,
  issues: RiverRunValidationIssue[],
): void {
  if (!Array.isArray(river.weatherPoints) || river.weatherPoints.length === 0) {
    issues.push(
      issue(
        "weatherPoints",
        "At least one weather point is required.",
        "config_source_invalid",
      ),
    );
    return;
  }
  if (
    river.weatherPoints.filter((point) => point.role === "primary").length !== 1
  ) {
    issues.push(
      issue(
        "weatherPoints",
        "Exactly one weather point must be primary.",
        "config_source_invalid",
      ),
    );
  }
  const ids = new Set<string>();
  river.weatherPoints.forEach((point, index) => {
    if (
      !hasText(point.weatherPointId) || ids.has(point.weatherPointId) ||
      !isValidLat(point.lat) || !isValidLon(point.lon)
    ) {
      issues.push(
        issue(
          `weatherPoints[${index}]`,
          "Weather point IDs must be unique and coordinates valid.",
          "config_source_invalid",
        ),
      );
    }
    ids.add(point.weatherPointId);
  });
}

export function validateRunProfile(
  run: RiverRunProfile,
  river?: RiverProfile,
): RunValidationResult {
  const issues: RiverRunValidationIssue[] = [];
  const visibilityIssues: RiverRunValidationIssue[] = [];
  if (!hasText(run.runId)) issues.push(issue("runId", "Run ID is required."));
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
  validateMovementEngine(run, issues);
  validateRunDates(run, issues);
  validateHistoricalPresence(run, issues);
  validatePushRules(run, river, issues);
  validateFishabilityBasis(run, river, issues);
  validateRunTemperaturePolicy(run, river, issues);
  validateConditionsSuggestPolicy(run, river, issues);
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

function validatePushRules(
  run: RiverRunProfile,
  river: RiverProfile | undefined,
  issues: RiverRunValidationIssue[],
): void {
  const rules = run.push;
  if (
    !rules || !hasText(rules.version) || !hasText(rules.evidenceNotes) ||
    !hasText(rules.sourceNotes)
  ) {
    issues.push(
      issue(
        "push",
        "Push requires versioned rules plus evidence and source notes.",
        "config_invalid_value",
      ),
    );
    return;
  }
  const primary =
    river?.hydraulicSources.find((source) => source.role === "primary") ?? null;
  if (
    !includes(METRICS, rules.hydraulic.metric) ||
    !hasText(rules.hydraulic.sourceLabel) ||
    (primary && rules.hydraulic.metric !== primary.primaryMetric)
  ) {
    issues.push(
      issue(
        "push.hydraulic.metric",
        "Push must use the configured primary hydraulic metric.",
        "config_invalid_value",
      ),
    );
  }
  const rises = [
    rules.hydraulic.rising24h,
    rules.hydraulic.meaningfulRise24h,
    rules.hydraulic.sharpRise24h,
  ];
  if (
    rises.some((threshold) =>
      !hasNumber(threshold.absolute) || threshold.absolute <= 0 ||
      !hasNumber(threshold.percent) || threshold.percent <= 0
    ) ||
    !(rises[0].absolute < rises[1].absolute &&
      rises[1].absolute < rises[2].absolute) ||
    !(rises[0].percent < rises[1].percent &&
      rises[1].percent < rises[2].percent)
  ) {
    issues.push(
      issue(
        "push.hydraulic",
        "Push rise thresholds must be positive and strictly increase for both absolute and relative change.",
        "config_invalid_value",
      ),
    );
  }
  if (
    !hasNumber(rules.hydraulic.lowValue) ||
    !hasNumber(rules.hydraulic.highValue) ||
    !hasNumber(rules.hydraulic.severeHighValue) ||
    rules.hydraulic.lowValue <= 0 ||
    !(rules.hydraulic.lowValue < rules.hydraulic.highValue &&
      rules.hydraulic.highValue < rules.hydraulic.severeHighValue)
  ) {
    issues.push(
      issue(
        "push.hydraulic",
        "Push low, high, and severe-high values must be ordered.",
        "config_invalid_value",
      ),
    );
  }
  if (
    !hasNumber(rules.rain.meaningful48hIn) ||
    !hasNumber(rules.rain.strong48hIn) ||
    !hasNumber(rules.rain.heavy48hIn) ||
    rules.rain.meaningful48hIn <= 0 ||
    !(rules.rain.meaningful48hIn < rules.rain.strong48hIn &&
      rules.rain.strong48hIn < rules.rain.heavy48hIn)
  ) {
    issues.push(
      issue(
        "push.rain",
        "Push rain thresholds must be present and strictly increasing.",
        "config_invalid_value",
      ),
    );
  }
  const temperature = rules.temperature;
  if (
    !hasText(temperature.suitabilityLabel) ||
    !hasNumber(temperature.supportiveMinF) ||
    !hasNumber(temperature.supportiveMaxF) ||
    !hasNumber(temperature.tooWarmF) ||
    !hasNumber(temperature.migrationBarrierF) ||
    temperature.supportiveMinF < 32 ||
    temperature.migrationBarrierF > 85 ||
    !(temperature.supportiveMinF < temperature.supportiveMaxF &&
      temperature.supportiveMaxF < temperature.tooWarmF &&
      temperature.tooWarmF < temperature.migrationBarrierF)
  ) {
    issues.push(
      issue(
        "push.temperature",
        "Push temperature thresholds must progress from supportive minimum through migration barrier.",
        "config_invalid_value",
      ),
    );
  }
  const caps = Object.values(rules.caps);
  if (
    caps.some((cap) => !hasNumber(cap) || cap < 0 || cap > 100) ||
    rules.caps.staleGauge > 55 ||
    rules.caps.unknownTrend > 49 ||
    rules.caps.tooWarm > 69 ||
    rules.caps.migrationBarrier > 49 ||
    rules.caps.severeHighFlow > 49 ||
    rules.caps.noGaugeResponse > 69 ||
    rules.caps.outsideExtendedWindow > 69
  ) {
    issues.push(
      issue(
        "push.caps",
        "Push caps must be conservative 0-100 values.",
        "config_invalid_value",
      ),
    );
  }
}

function validateMovementEngine(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  if (!includes(MOVEMENT_ENGINES, run.movementEngineId)) {
    issues.push(
      issue(
        "movementEngineId",
        "Movement engine is unknown.",
        "config_movement_engine_unavailable",
      ),
    );
    return;
  }
  const engine = getMovementEngineDefinition(run.movementEngineId);
  if (!engine.implemented) {
    issues.push(
      issue(
        "movementEngineId",
        "This movement engine is reserved but not implemented; the run fails closed.",
        "config_movement_engine_unavailable",
      ),
    );
  }
  if (
    !engine.supportedSeasons.includes(run.season) ||
    !engine.supportedRunTypes.includes(run.runType)
  ) {
    issues.push(
      issue(
        "movementEngineId",
        "Movement engine, season, and run type are incompatible.",
        "config_invalid_value",
      ),
    );
  }
}

function validateRunDates(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  const fields = ["stagingStart", "start", "peak", "end", "lateEnd"] as const;
  const values = fields.map((field) => parseMonthDay(run.runWindow?.[field]));
  values.forEach((value, index) => {
    if (value === null) {
      issues.push(
        issue(
          `runWindow.${fields[index]}`,
          `${fields[index]} must be MM-DD.`,
          "config_date_invalid",
        ),
      );
    }
  });
  if (values.some((value) => value === null)) return;
  const [staging, start, peak, end, lateEnd] = values as number[];
  const offsets = [
    forwardDistance(staging, start),
    forwardDistance(staging, peak),
    forwardDistance(staging, end),
    forwardDistance(staging, lateEnd),
  ];
  if (
    !(offsets[0] > 0 && offsets[0] < offsets[1] &&
      offsets[1] < offsets[2] && offsets[2] < offsets[3] &&
      offsets[3] <= 366)
  ) {
    issues.push(
      issue(
        "runWindow",
        "Dates must progress stagingStart → start → peak → end → lateEnd, including cross-year runs.",
        "config_date_order_invalid",
      ),
    );
  }
}

function validateHistoricalPresence(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  const presence = run.historicalPresence;
  if (
    !presence || !Number.isInteger(presence.maximum) ||
    presence.maximum < 1 || presence.maximum > 10
  ) {
    issues.push(
      issue(
        "historicalPresence.maximum",
        "Historical presence maximum must be 1 through 10.",
        "config_invalid_value",
      ),
    );
    return;
  }
  if (
    !hasText(presence.curveVersion) || !hasText(presence.evidenceNotes) ||
    !hasText(presence.sourceNotes)
  ) {
    issues.push(
      issue(
        "historicalPresence",
        "The presence curve requires a version, evidence, and sources.",
        "audit_notes_missing",
      ),
    );
  }
  if (!Array.isArray(presence.anchors) || presence.anchors.length < 2) {
    issues.push(
      issue(
        "historicalPresence.anchors",
        "The presence curve requires at least two anchors.",
        "config_invalid_value",
      ),
    );
    return;
  }
  let prior = -1;
  for (const [index, anchor] of presence.anchors.entries()) {
    if (
      !Number.isInteger(anchor.dayOffsetFromStart) ||
      anchor.dayOffsetFromStart < 0 ||
      anchor.dayOffsetFromStart <= prior ||
      !hasNumber(anchor.fractionOfMaximum) ||
      anchor.fractionOfMaximum < 0 || anchor.fractionOfMaximum > 1
    ) {
      issues.push(
        issue(
          `historicalPresence.anchors[${index}]`,
          "Presence anchors must have increasing non-negative day offsets and fractions from 0 to 1.",
          "config_invalid_value",
        ),
      );
    }
    prior = anchor.dayOffsetFromStart;
  }
}

function validateFishabilityBasis(
  run: RiverRunProfile,
  river: RiverProfile | undefined,
  issues: RiverRunValidationIssue[],
): void {
  const bands = run.fishabilityBands;
  if (!bands) {
    issues.push(
      issue(
        "fishabilityBands",
        "Audited reach-specific Fishability bands are required.",
        "config_required_field_missing",
      ),
    );
    return;
  }
  if (!includes(METRICS, bands.metric)) {
    issues.push(
      issue(
        "fishabilityBands.metric",
        "Fishability band metric is invalid.",
        "config_invalid_value",
      ),
    );
  }
  const primaryMetric = river?.hydraulicSources.find((source) =>
    source.role === "primary"
  )?.primaryMetric;
  if (primaryMetric && bands.metric !== primaryMetric) {
    issues.push(
      issue(
        "fishabilityBands.metric",
        "Fishability must use the configured primary hydraulic metric.",
        "config_source_invalid",
      ),
    );
  }
  if (
    !hasText(bands.version) ||
    !hasText(bands.sourceLabel) ||
    !hasText(bands.evidenceNotes) ||
    !hasText(bands.sourceNotes)
  ) {
    issues.push(
      issue(
        "fishabilityBands",
        "Fishability requires version, source label, evidence notes, and source notes.",
        "audit_notes_missing",
      ),
    );
  }
  const thresholds = [
    bands.tooLow?.max,
    bands.lowFishable?.min,
    bands.lowFishable?.max,
    bands.ideal?.min,
    bands.ideal?.max,
    bands.highFishable?.min,
    bands.highFishable?.max,
    bands.blownOut?.min,
  ];
  if (
    thresholds.some((value) => !hasNumber(value) || value < 0) ||
    bands.tooLow.max !== bands.lowFishable.min ||
    bands.lowFishable.min >= bands.lowFishable.max ||
    bands.lowFishable.max > bands.ideal.min ||
    bands.ideal.min >= bands.ideal.max ||
    bands.ideal.max > bands.highFishable.min ||
    bands.highFishable.min >= bands.highFishable.max ||
    bands.highFishable.max >= bands.blownOut.min
  ) {
    issues.push(
      issue(
        "fishabilityBands",
        "Fishability thresholds must be non-negative, ordered, and non-overlapping.",
        "config_invalid_value",
      ),
    );
  }
  const caps = bands.caps;
  if (
    !caps ||
    !validCap(caps.staleGauge, 55) ||
    !validCap(caps.unknownTrend, 69) ||
    !validCap(caps.veryLow, 45) ||
    !validCap(caps.blownOut, 24) ||
    !validCap(caps.sharpRiseHigh, 40)
  ) {
    issues.push(
      issue(
        "fishabilityBands.caps",
        "Fishability caps are missing or exceed conservative release limits.",
        "config_invalid_value",
      ),
    );
  }

  if (!run.baselineCoverage?.hasPercentileBaselines) {
    issues.push(
      issue(
        "baselineCoverage",
        "Fishability requires seasonal percentile baselines for relative context and calibration.",
        "baseline_missing",
      ),
    );
    return;
  }
  if (!hasText(run.baselineCoverage.version)) {
    issues.push(
      issue(
        "baselineCoverage.version",
        "Baseline coverage requires an explicit version.",
        "baseline_insufficient_history",
      ),
    );
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
  if (run.baselineCoverage.minimumHistoryYears < 5) {
    issues.push(
      issue(
        "baselineCoverage.minimumHistoryYears",
        "Fishability baseline coverage requires at least five distinct years.",
        "baseline_insufficient_history",
      ),
    );
  }
  if (!includes(METRICS, run.baselineCoverage.metric)) {
    issues.push(
      issue(
        "baselineCoverage.metric",
        "Baseline metric is invalid.",
        "config_invalid_value",
      ),
    );
  }
  if (!hasText(run.baselineCoverage.sourceNotes)) {
    issues.push(
      issue(
        "baselineCoverage.sourceNotes",
        "Baseline source notes are required.",
        "audit_notes_missing",
      ),
    );
  }
}

function validateRunTemperaturePolicy(
  run: RiverRunProfile,
  river: RiverProfile | undefined,
  issues: RiverRunValidationIssue[],
): void {
  const policy = run.waterTemperature;
  if (!policy || !Array.isArray(policy.sourcePriority)) {
    issues.push(
      issue(
        "waterTemperature",
        "A water-temperature policy is required.",
        "temperature_source_invalid",
      ),
    );
    return;
  }
  if (
    !hasText(policy.notes) ||
    ![0, 1].includes(policy.upstreamFallbackPositiveSignalCap)
  ) {
    issues.push(
      issue(
        "waterTemperature",
        "Temperature fallback policy and notes are invalid.",
        "temperature_source_invalid",
      ),
    );
  }
  if (new Set(policy.sourcePriority).size !== policy.sourcePriority.length) {
    issues.push(
      issue(
        "waterTemperature.sourcePriority",
        "Temperature source priority cannot contain duplicates.",
        "temperature_source_invalid",
      ),
    );
  }
  if (river) {
    const available = new Set(
      river.waterTemperatureSources.map((source) => source.sourceId),
    );
    policy.sourcePriority.forEach((sourceId, index) => {
      if (!available.has(sourceId)) {
        issues.push(
          issue(
            `waterTemperature.sourcePriority[${index}]`,
            `Temperature source ${sourceId} does not exist on the river.`,
            "config_source_reference_missing",
          ),
        );
      }
    });
  }
  if (policy.sourcePriority.length === 0) {
    issues.push(
      issue(
        "waterTemperature.sourcePriority",
        "At least one audited measured water-temperature source is required.",
        "temperature_source_invalid",
      ),
    );
  }
}

function validateConditionsSuggestPolicy(
  run: RiverRunProfile,
  river: RiverProfile | undefined,
  issues: RiverRunValidationIssue[],
): void {
  const policy = run.conditionsSuggest;
  if (!policy || !hasText(policy.baselineVersion)) {
    issues.push(
      issue(
        "conditionsSuggest",
        "Conditions Suggest requires a versioned historical baseline.",
        "conditions_baseline_missing",
      ),
    );
    return;
  }
  if (
    !Number.isInteger(policy.minimumUsableYears) ||
    policy.minimumUsableYears < 5
  ) {
    issues.push(
      issue(
        "conditionsSuggest.minimumUsableYears",
        "Conditions Suggest requires at least five usable historical years.",
        "conditions_baseline_insufficient_years",
      ),
    );
  }
  if (
    !hasNumber(policy.minimumCoveragePercent) ||
    policy.minimumCoveragePercent < 0.5 ||
    policy.minimumCoveragePercent > 1
  ) {
    issues.push(
      issue(
        "conditionsSuggest.minimumCoveragePercent",
        "Conditions Suggest cumulative coverage must be from 0.5 through 1.",
        "config_invalid_value",
      ),
    );
  }
  if (
    !hasNumber(policy.delayedPercentile) ||
    !hasNumber(policy.aheadPercentile) ||
    policy.delayedPercentile < 0 ||
    policy.aheadPercentile > 100 ||
    policy.delayedPercentile >= policy.aheadPercentile
  ) {
    issues.push(
      issue(
        "conditionsSuggest",
        "Conditions Suggest historical percentile boundaries are invalid.",
        "config_invalid_value",
      ),
    );
  }
  if (
    !hasNumber(policy.coolEnoughPercentileCap) ||
    policy.coolEnoughPercentileCap < 50 ||
    policy.coolEnoughPercentileCap > 90
  ) {
    issues.push(
      issue(
        "conditionsSuggest.coolEnoughPercentileCap",
        "Conditions Suggest cool-enough plateau must be from the 50th through 90th percentile.",
        "config_invalid_value",
      ),
    );
  }
  if (
    !hasText(policy.temperatureSourceId) ||
    !run.waterTemperature.sourcePriority.includes(policy.temperatureSourceId)
  ) {
    issues.push(
      issue(
        "conditionsSuggest.temperatureSourceId",
        "Conditions Suggest temperature source must be in the run's measured-water priority.",
        "config_source_reference_missing",
      ),
    );
  }
  if (
    river &&
    !river.waterTemperatureSources.some((source) =>
      source.sourceId === policy.temperatureSourceId
    )
  ) {
    issues.push(
      issue(
        "conditionsSuggest.temperatureSourceId",
        "Conditions Suggest temperature source does not exist on the river.",
        "config_source_reference_missing",
      ),
    );
  }
}

function validateAuditFields(
  run: RiverRunProfile,
  issues: RiverRunValidationIssue[],
): void {
  const requiredCopyHints = [
    ["userCopyHints.stagingTip", run.userCopyHints?.stagingTip],
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
  if (!hasText(run.researchNotes) || !hasText(run.sourceNotes)) {
    issues.push(
      issue(
        "researchNotes",
        "Public runs require research notes and source notes.",
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

export function validateConfigurationRevision(
  revision: RiverRunConfigurationRevision,
): RiverRunValidationIssue[] {
  const issues: RiverRunValidationIssue[] = [];
  if (
    !hasText(revision.configKey) || !Number.isInteger(revision.revision) ||
    revision.revision < 1 || !hasText(revision.evidenceNotes)
  ) {
    issues.push(
      issue(
        "revision",
        "Configuration revisions need a key, positive revision number, and evidence notes.",
        "config_revision_invalid",
      ),
    );
  }
  if (
    revision.document?.schemaVersion !== "river-run-config-v1" ||
    !hasText(revision.document?.configVersion) ||
    !hasText(revision.document?.movementEngineVersion)
  ) {
    issues.push(
      issue(
        "document",
        "Configuration document version metadata is invalid.",
        "config_revision_invalid",
      ),
    );
    return issues;
  }
  issues.push(...validateRiverProfile(revision.document.river).issues);
  for (const run of revision.document.runs) {
    issues.push(...validateRunProfile(run, revision.document.river).issues);
  }
  return issues;
}

export function listVisibleRiverRuns(
  rivers: readonly RiverProfile[],
  runs: readonly RiverRunProfile[],
): VisibleRiverRunCatalog[] {
  const riverById = new Map(rivers.map((river) => [river.riverId, river]));
  const visibleRivers = new Map<GreatLakesState, VisibleRiverRunCatalog>();
  for (const river of rivers) {
    if (!validateRiverProfile(river).publicVisible) continue;
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
