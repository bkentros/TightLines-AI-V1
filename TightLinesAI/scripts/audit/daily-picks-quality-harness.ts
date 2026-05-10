import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type {
  ConditionTag,
  RecommenderV4Species,
  SeasonalRowV4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import {
  LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import {
  LURE_ARCHETYPES_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import {
  FLY_ARCHETYPES_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import {
  SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import {
  NORTHERN_PIKE_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import {
  TROUT_SEASONAL_ROWS_V4,
} from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildCandidatePool,
} from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts";
import type {
  DailyActivityLevel,
  DailyLightMode,
  DailyPressureMode,
  DailyScenario,
  DailySurfaceGate,
  DailyThermalMode,
  DailyWaterMovementMode,
  DailyWindMode,
} from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts";
import {
  type CandidateScore,
  scoreCandidate,
} from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts";
import {
  buildDailyPicksFamilyDiversityDiagnostics,
  type DailyPicksFamilyDiversityDiagnostics,
  selectDailyPicks,
} from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts";

type Goal = "all_purpose" | "big_fish";

type AuditScenarioTemplate = {
  key: string;
  description: string;
  waterTypes?: readonly EngineContext[];
  water_clarity: WaterClarity;
  hows_score: number;
  activity_level: DailyActivityLevel;
  surface_daily_gate: DailySurfaceGate;
  light_mode: DailyLightMode;
  wind_mode: DailyWindMode;
  daylight_wind_mph: number | null;
  thermal_mode: DailyThermalMode;
  water_movement_mode: DailyWaterMovementMode;
  pressure_mode: DailyPressureMode;
  scenario_tags: readonly ConditionTag[];
  missing_inputs?: readonly string[];
  confidence?: DailyScenario["confidence"];
};

type Args = {
  species?: RecommenderV4Species;
  waterType?: EngineContext;
  month?: number;
  launchMonths: boolean;
  region?: string;
  scenario?: string;
  exposureDays: number;
  json: boolean;
  rowSanity: boolean;
  envelopeAudit: boolean;
  watchlistTrace: boolean;
  broadFlyAudit: boolean;
  exposureAudit: boolean;
};

type SelectionRun = {
  row: SeasonalRowV4;
  scenario: DailyScenario;
  lureScores: CandidateScore[];
  flyScores: CandidateScore[];
  lureIds: string[];
  flyIds: string[];
  selected: CandidateScore[];
  familyDiversity: DailyPicksFamilyDiversityDiagnostics;
};

const GOALS: readonly Goal[] = ["all_purpose", "big_fish"];
const AUDIT_TOP_QUALITY_BAND = 18;

const SCENARIOS: readonly AuditScenarioTemplate[] = [
  {
    key: "cold_clear_suppressed",
    description: "clear, cold, suppressed, surface closed",
    water_clarity: "clear",
    hows_score: 25,
    activity_level: "suppressed",
    surface_daily_gate: "closed",
    light_mode: "bright",
    wind_mode: "calm",
    daylight_wind_mph: 3,
    thermal_mode: "cold_slow",
    water_movement_mode: "stable",
    pressure_mode: "rising",
    scenario_tags: ["clear_subtle", "cold_slow"],
    confidence: "high",
  },
  {
    key: "windy_stained_reaction",
    description: "stained, windy, active reaction window, surface closed",
    water_clarity: "stained",
    hows_score: 72,
    activity_level: "active",
    surface_daily_gate: "closed",
    light_mode: "mixed",
    wind_mode: "windy",
    daylight_wind_mph: 17,
    thermal_mode: "stable",
    water_movement_mode: "stable",
    pressure_mode: "falling",
    scenario_tags: ["wind_reaction", "dirty_vibration", "open_water_search"],
    confidence: "high",
  },
  {
    key: "calm_low_light_surface_stress",
    description:
      "calm low-light active surface tags; seasonal rows must still gate surface",
    water_clarity: "stained",
    hows_score: 78,
    activity_level: "active",
    surface_daily_gate: "open",
    light_mode: "low_light",
    wind_mode: "calm",
    daylight_wind_mph: 2,
    thermal_mode: "warming",
    water_movement_mode: "stable",
    pressure_mode: "stable",
    scenario_tags: ["calm_surface", "low_light_surface", "warming_search"],
    confidence: "high",
  },
  {
    key: "dirty_elevated_river",
    description: "dirty elevated river movement with streamer/current tags",
    waterTypes: ["freshwater_river"],
    water_clarity: "dirty",
    hows_score: 55,
    activity_level: "neutral",
    surface_daily_gate: "closed",
    light_mode: "mixed",
    wind_mode: "breezy",
    daylight_wind_mph: 9,
    thermal_mode: "stable",
    water_movement_mode: "elevated_or_dirty",
    pressure_mode: "unstable",
    scenario_tags: ["dirty_vibration", "runoff_streamer", "current_swing"],
    confidence: "medium",
  },
  {
    key: "missing_wind_low_confidence",
    description:
      "missing wind should close surface and avoid confident surface use",
    water_clarity: "clear",
    hows_score: 68,
    activity_level: "neutral",
    surface_daily_gate: "closed",
    light_mode: "low_light",
    wind_mode: "unknown",
    daylight_wind_mph: null,
    thermal_mode: "stable",
    water_movement_mode: "unknown",
    pressure_mode: "unknown",
    scenario_tags: ["clear_subtle"],
    missing_inputs: ["wind"],
    confidence: "medium",
  },
  {
    key: "heat_clear_bright",
    description: "clear bright heat-limited finesse window",
    water_clarity: "clear",
    hows_score: 48,
    activity_level: "neutral",
    surface_daily_gate: "caution",
    light_mode: "bright",
    wind_mode: "calm",
    daylight_wind_mph: 4,
    thermal_mode: "heat_limited",
    water_movement_mode: "stable",
    pressure_mode: "stable",
    scenario_tags: ["clear_subtle", "heat_finesse"],
    confidence: "high",
  },
];

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

function parseArgs(raw: readonly string[]): Args {
  const args: Args = {
    exposureDays: 7,
    json: false,
    launchMonths: false,
    rowSanity: false,
    envelopeAudit: false,
    watchlistTrace: false,
    broadFlyAudit: false,
    exposureAudit: false,
  };
  for (const token of raw) {
    const [key, value] = token.split("=", 2);
    switch (key) {
      case "--species":
        args.species = value as RecommenderV4Species;
        break;
      case "--water":
      case "--water_type":
        args.waterType = value as EngineContext;
        break;
      case "--month":
        args.month = value == null ? undefined : Number(value);
        break;
      case "--launch-months":
        args.launchMonths = true;
        break;
      case "--region":
        args.region = value;
        break;
      case "--scenario":
        args.scenario = value;
        break;
      case "--exposure-days":
        args.exposureDays = value == null ? 7 : Math.max(1, Number(value));
        break;
      case "--json":
        args.json = true;
        break;
      case "--row-sanity":
        args.rowSanity = true;
        break;
      case "--envelope-audit":
        args.envelopeAudit = true;
        break;
      case "--watchlist-trace":
        args.watchlistTrace = true;
        break;
      case "--broad-fly-audit":
        args.broadFlyAudit = true;
        break;
      case "--exposure-audit":
        args.exposureAudit = true;
        break;
      case "--help":
        printHelpAndExit();
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

function printHelpAndExit(): never {
  console.log([
    "Daily-picks quality harness",
    "",
    "Usage:",
    "  deno run -A scripts/audit/daily-picks-quality-harness.ts [filters]",
    "",
    "Filters:",
    "  --species=largemouth_bass|smallmouth_bass|northern_pike|trout",
    "  --water=freshwater_lake_pond|freshwater_river",
    "  --month=1..12",
    "  --launch-months",
    "  --region=<region_key>",
    "  --scenario=<scenario_key>",
    "  --exposure-days=7",
    "  --row-sanity",
    "  --envelope-audit",
    "  --watchlist-trace",
    "  --broad-fly-audit",
    "  --exposure-audit",
    "  --json",
    "",
    "Scenario keys:",
    ...SCENARIOS.map((scenario) =>
      `  ${scenario.key} - ${scenario.description}`
    ),
  ].join("\n"));
  Deno.exit(0);
}

function stableDate(dayOffset: number): string {
  const date = new Date(Date.UTC(2026, 0, 1 + dayOffset));
  return date.toISOString().slice(0, 10);
}

function scenarioFor(args: {
  row: SeasonalRowV4;
  template: AuditScenarioTemplate;
  goal: Goal;
  dayOffset?: number;
}): DailyScenario {
  const { row, template, goal } = args;
  const waterMovementMode = row.water_type === "freshwater_lake_pond"
    ? "not_applicable"
    : template.water_movement_mode;
  return {
    local_date: stableDate(args.dayOffset ?? 0),
    local_timezone: "America/New_York",
    species: row.species,
    region_key: row.region_key,
    month: row.month,
    water_type: row.water_type,
    water_clarity: template.water_clarity,
    recommendation_goal: goal,
    hows_score: template.hows_score,
    activity_level: template.activity_level,
    surface_daily_gate: template.surface_daily_gate,
    surface_daily_reason_codes: [
      row.surface_seasonally_possible
        ? "seasonal_surface_open"
        : "seasonal_surface_closed",
      `audit_template:${template.key}`,
    ],
    light_mode: template.light_mode,
    wind_mode: template.wind_mode,
    daylight_wind_mph: template.daylight_wind_mph,
    thermal_mode: template.thermal_mode,
    water_movement_mode: waterMovementMode,
    pressure_mode: template.pressure_mode,
    scenario_tags: [...template.scenario_tags],
    missing_inputs: [...(template.missing_inputs ?? [])],
    confidence: template.confidence ?? "high",
  };
}

function runSelection(args: {
  row: SeasonalRowV4;
  template: AuditScenarioTemplate;
  goal: Goal;
  variant: "A" | "B";
  seed: string;
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
  dayOffset?: number;
}): SelectionRun {
  const scenario = scenarioFor({
    row: args.row,
    template: args.template,
    goal: args.goal,
    dayOffset: args.dayOffset,
  });
  const pool = buildCandidatePool({ row: args.row, scenario });
  const lureScores = pool.lures.map((candidate) =>
    scoreCandidate({
      profile: candidate.profile,
      side: "lure",
      row: args.row,
      scenario,
    })
  );
  const flyScores = pool.flies.map((candidate) =>
    scoreCandidate({
      profile: candidate.profile,
      side: "fly",
      row: args.row,
      scenario,
    })
  );
  const selection = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: args.seed,
    variant: args.variant,
    avoidLureIds: args.avoidLureIds,
    avoidFlyIds: args.avoidFlyIds,
  });
  const selected = [
    selection.lure_of_the_day,
    selection.honorable_lure,
    selection.fly_of_the_day,
    selection.honorable_fly,
  ];
  const familyDiversity = buildDailyPicksFamilyDiversityDiagnostics({
    selection,
    lureScores,
    flyScores,
  });
  return {
    row: args.row,
    scenario,
    lureScores,
    flyScores,
    lureIds: [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ],
    flyIds: [
      selection.fly_of_the_day.profile.id,
      selection.honorable_fly.profile.id,
    ],
    selected,
    familyDiversity,
  };
}

function setKey(run: Pick<SelectionRun, "lureIds" | "flyIds">): string {
  return [...run.lureIds, ...run.flyIds].join("|");
}

function hasReason(score: CandidateScore, prefix: string): boolean {
  return score.reasons.some((reason) => reason.startsWith(prefix));
}

function selectedProfileFitsRow(
  score: CandidateScore,
  row: SeasonalRowV4,
): boolean {
  return row.column_range.includes(score.profile.column) &&
    (row.pace_range.includes(score.profile.primary_pace) ||
      (score.profile.secondary_pace != null &&
        row.pace_range.includes(score.profile.secondary_pace)));
}

function percentile(values: readonly number[], pct: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor((sorted.length - 1) * pct)),
  );
  return sorted[index]!;
}

function increment(map: Map<string, number>, key: string, by = 1): void {
  map.set(key, (map.get(key) ?? 0) + by);
}

function topEntries(
  map: Map<string, number>,
  limit: number,
): Array<[string, number]> {
  return [...map.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  )
    .slice(0, limit);
}

function rowKey(row: SeasonalRowV4): string {
  return `${row.species}/${row.region_key}/m${row.month}/${row.water_type}`;
}

const COLD_WINTER_REGION_KEYS = new Set([
  "alaska",
  "great_lakes_upper_midwest",
  "inland_northwest",
  "midwest_interior",
  "mountain_alpine",
  "mountain_west",
  "northeast",
  "pacific_northwest",
]);

type ClimateBand =
  | "cold_cold_temperate"
  | "cool_mid_latitude"
  | "warm_southern"
  | "subtropical_desert_special";

const REGION_CLIMATE_BANDS: Record<string, ClimateBand> = {
  alaska: "cold_cold_temperate",
  great_lakes_upper_midwest: "cold_cold_temperate",
  inland_northwest: "cold_cold_temperate",
  mountain_alpine: "cold_cold_temperate",
  mountain_west: "cold_cold_temperate",
  northeast: "cold_cold_temperate",
  appalachian: "cool_mid_latitude",
  midwest_interior: "cool_mid_latitude",
  northern_california: "cool_mid_latitude",
  pacific_northwest: "cool_mid_latitude",
  gulf_coast: "warm_southern",
  south_central: "warm_southern",
  southeast_atlantic: "warm_southern",
  southern_california: "warm_southern",
  florida: "subtropical_desert_special",
  hawaii: "subtropical_desert_special",
  southwest_desert: "subtropical_desert_special",
  southwest_high_desert: "subtropical_desert_special",
};

const WARMWATER_SURFACE_IDS = new Set([
  "buzzbait",
  "hollow_body_frog",
  "walking_topwater",
  "popping_topwater",
  "prop_bait",
  "large_pike_topwater",
  "wake_bait",
  "mouse_fly",
  "frog_fly",
  "popper_fly",
  "deer_hair_slider",
  "foam_gurgler_fly",
]);

const BASS_CODED_PIKE_LURE_IDS = new Set([
  "spinnerbait",
  "squarebill_crankbait",
  "flat_sided_crankbait",
  "lipless_crankbait",
  "medium_diving_crankbait",
  "bladed_jig",
]);

const PIKE_FIRST_LURE_IDS = new Set([
  "pike_spinnerbait",
  "large_bucktail_spinner",
  "casting_spoon",
  "weedless_spoon",
  "shallow_minnowbait",
  "pike_glidebait",
  "pike_jerkbait",
  "large_profile_pike_swimbait",
  "pike_jig_and_plastic",
  "large_pike_tube",
  "large_pike_topwater",
]);

const TROUT_SURFACE_IDS = new Set([
  "small_floating_trout_plug",
  "mouse_fly",
]);

const BROAD_FLY_AUDIT_IDS = new Set([
  "clouser_minnow",
  "game_changer",
  "articulated_baitfish_streamer",
  "bucktail_baitfish_streamer",
  "slim_minnow_streamer",
  "unweighted_baitfish_streamer",
  "baitfish_slider_fly",
  "woolly_bugger",
  "rabbit_strip_leech",
  "lead_eye_leech",
  "jighead_marabou_leech",
  "feather_jig_leech",
  "balanced_leech",
  "articulated_dungeon_streamer",
  "conehead_streamer",
  "zonker_streamer",
]);

const BROAD_FLY_PROFILE_BY_ID = new Map(
  FLY_ARCHETYPES_V4
    .filter((profile) => BROAD_FLY_AUDIT_IDS.has(profile.id))
    .map((profile) => [profile.id, profile]),
);

const SURFACE_PROFILE_IDS = new Set(
  [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4]
    .filter((profile) => profile.is_surface)
    .map((profile) => profile.id),
);

function rowIds(row: SeasonalRowV4): string[] {
  return [...row.primary_lure_ids, ...row.primary_fly_ids];
}

function rowHasAny(row: SeasonalRowV4, ids: ReadonlySet<string>): boolean {
  return rowIds(row).some((id) => ids.has(id));
}

function rowSurfaceIds(row: SeasonalRowV4): string[] {
  return rowIds(row).filter((id) => SURFACE_PROFILE_IDS.has(id));
}

function monthBucket(month: number): string {
  if (month === 12 || month === 1 || month === 2) return "winter";
  if (month === 3 || month === 4) return "early_spring";
  if (month === 5) return "late_spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month === 9) return "early_fall";
  return "late_fall";
}

type EnvelopeSeverity =
  | "hard_invariant_break"
  | "likely_issue"
  | "watch_review";

type EnvelopeFinding = {
  severity: EnvelopeSeverity;
  priority: "launch_critical" | "winter_deferred";
  code: string;
  row: SeasonalRowV4;
  detail: string;
};

function addEnvelopeFinding(
  findings: EnvelopeFinding[],
  severity: EnvelopeSeverity,
  row: SeasonalRowV4,
  code: string,
  detail: string,
) {
  findings.push({
    severity,
    priority: isLaunchMonth(row.month) ? "launch_critical" : "winter_deferred",
    code,
    row,
    detail,
  });
}

function rowIssueLine(row: SeasonalRowV4): string {
  const surfaceIds = rowIds(row).filter((id) => SURFACE_PROFILE_IDS.has(id));
  const warmSurfaceIds = rowIds(row).filter((id) =>
    WARMWATER_SURFACE_IDS.has(id)
  );
  const bassCodedIds = row.primary_lure_ids.filter((id) =>
    BASS_CODED_PIKE_LURE_IDS.has(id)
  );
  const pikeFirstIds = row.primary_lure_ids.filter((id) =>
    PIKE_FIRST_LURE_IDS.has(id)
  );
  const details = [
    `columns=${row.column_range.join("/")}`,
    `paces=${row.pace_range.join("/")}`,
  ];
  if (surfaceIds.length > 0) {
    details.push(`surface_ids=${surfaceIds.join(",")}`);
  }
  if (warmSurfaceIds.length > 0) {
    details.push(`warm_surface_ids=${warmSurfaceIds.join(",")}`);
  }
  if (bassCodedIds.length > 0) {
    details.push(`bass_coded=${bassCodedIds.join(",")}`);
  }
  if (pikeFirstIds.length > 0) {
    details.push(`pike_first=${pikeFirstIds.join(",")}`);
  }
  return `${rowKey(row)} ${details.join(" ")}`;
}

function isLaunchMonth(month: number): boolean {
  return month >= 3 && month <= 11;
}

function appliesTo(
  template: AuditScenarioTemplate,
  row: SeasonalRowV4,
): boolean {
  return template.waterTypes == null ||
    template.waterTypes.includes(row.water_type);
}

function printRowSanityAndExit(rows: readonly SeasonalRowV4[], json: boolean) {
  const bySpecies = new Map<string, number>();
  const byWater = new Map<string, number>();
  const badColumn = rows.filter((row) =>
    !row.column_range.includes(row.column_baseline)
  );
  const badPace = rows.filter((row) =>
    !row.pace_range.includes(row.pace_baseline)
  );
  const baselineSurface = rows.filter((row) =>
    row.column_baseline === "surface"
  );
  const surfaceMismatch = rows.filter((row) =>
    row.column_range.includes("surface") !== row.surface_seasonally_possible
  );
  const troutLakeRows = rows.filter((row) =>
    row.species === "trout" && row.water_type !== "freshwater_river"
  );
  const coldJanFebUpperSurface = rows.filter((row) =>
    COLD_WINTER_REGION_KEYS.has(row.region_key) &&
    (row.month === 1 || row.month === 2) &&
    (row.column_range.includes("upper") ||
      row.column_range.includes("surface") ||
      row.surface_seasonally_possible)
  );
  const coldJanFebFastOnly = rows.filter((row) =>
    COLD_WINTER_REGION_KEYS.has(row.region_key) &&
    (row.month === 1 || row.month === 2) &&
    row.pace_range.length === 1 &&
    row.pace_range.includes("fast")
  );
  const coldJanFebFastIncluded = rows.filter((row) =>
    COLD_WINTER_REGION_KEYS.has(row.region_key) &&
    (row.month === 1 || row.month === 2) &&
    row.pace_range.includes("fast")
  );
  const surfaceIdsWhenClosed = rows.filter((row) =>
    !row.surface_seasonally_possible && rowHasAny(row, SURFACE_PROFILE_IDS)
  );
  const warmSurfaceWinterCold = rows.filter((row) =>
    COLD_WINTER_REGION_KEYS.has(row.region_key) &&
    (row.month === 1 || row.month === 2 || row.month === 12) &&
    rowHasAny(row, WARMWATER_SURFACE_IDS)
  );
  const pikeBassCodedRows = rows.filter((row) =>
    row.species === "northern_pike" && rowHasAny(row, BASS_CODED_PIKE_LURE_IDS)
  );
  const pikeBassCodedWithPikeFirst = pikeBassCodedRows.filter((row) =>
    row.primary_lure_ids.some((id) => PIKE_FIRST_LURE_IDS.has(id))
  );
  const winterPikeGenericSpinnerbaitRows = rows.filter((row) =>
    row.species === "northern_pike" &&
    (row.month === 12 || row.month === 1 || row.month === 2) &&
    row.primary_lure_ids.includes("spinnerbait")
  );

  for (const row of rows) {
    increment(bySpecies, row.species);
    increment(byWater, row.water_type);
  }

  const summary = {
    rows: rows.length,
    species: Object.fromEntries([...bySpecies.entries()].sort()),
    water_types: Object.fromEntries([...byWater.entries()].sort()),
    invariant_counts: {
      bad_column_baseline: badColumn.length,
      bad_pace_baseline: badPace.length,
      surface_baseline: baselineSurface.length,
      surface_column_flag_mismatch: surfaceMismatch.length,
      trout_lake_or_pond_rows: troutLakeRows.length,
      cold_jan_feb_upper_or_surface_rows: coldJanFebUpperSurface.length,
      cold_jan_feb_fast_only_rows: coldJanFebFastOnly.length,
      cold_jan_feb_fast_included_rows: coldJanFebFastIncluded.length,
      surface_ids_when_seasonal_surface_closed: surfaceIdsWhenClosed.length,
      warm_surface_ids_in_cold_winter_rows: warmSurfaceWinterCold.length,
      pike_rows_with_bass_coded_lures: pikeBassCodedRows.length,
      pike_rows_with_bass_coded_and_pike_first_lures:
        pikeBassCodedWithPikeFirst.length,
      winter_pike_rows_with_generic_spinnerbait:
        winterPikeGenericSpinnerbaitRows.length,
    },
    pike_bass_coded: {
      launch_rows: pikeBassCodedRows.filter((row) => isLaunchMonth(row.month))
        .length,
      winter_rows:
        pikeBassCodedRows.filter((row) =>
          row.month === 12 || row.month === 1 || row.month === 2
        ).length,
    },
    samples: {
      bad_column_baseline: badColumn.slice(0, 20).map(rowIssueLine),
      bad_pace_baseline: badPace.slice(0, 20).map(rowIssueLine),
      surface_baseline: baselineSurface.slice(0, 20).map(rowIssueLine),
      surface_column_flag_mismatch: surfaceMismatch.slice(0, 20).map(
        rowIssueLine,
      ),
      trout_lake_or_pond_rows: troutLakeRows.slice(0, 20).map(rowIssueLine),
      cold_jan_feb_upper_or_surface_rows: coldJanFebUpperSurface.slice(0, 20)
        .map(rowIssueLine),
      cold_jan_feb_fast_only_rows: coldJanFebFastOnly.slice(0, 20).map(
        rowIssueLine,
      ),
      cold_jan_feb_fast_included_rows: coldJanFebFastIncluded.slice(0, 20).map(
        rowIssueLine,
      ),
      surface_ids_when_seasonal_surface_closed: surfaceIdsWhenClosed.slice(
        0,
        20,
      ).map(rowIssueLine),
      warm_surface_ids_in_cold_winter_rows: warmSurfaceWinterCold.slice(0, 20)
        .map(rowIssueLine),
      pike_rows_with_bass_coded_lures: pikeBassCodedRows.slice(0, 20).map(
        rowIssueLine,
      ),
      winter_pike_rows_with_generic_spinnerbait:
        winterPikeGenericSpinnerbaitRows.slice(0, 20).map(rowIssueLine),
    },
  };

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("Daily-picks all-month row sanity summary");
  console.log(`Rows: ${summary.rows}`);
  console.log(`Species: ${JSON.stringify(summary.species)}`);
  console.log(`Water types: ${JSON.stringify(summary.water_types)}`);
  console.log("Invariant counts:");
  for (const [label, count] of Object.entries(summary.invariant_counts)) {
    console.log(`  ${label}: ${count}`);
  }
  console.log(
    `Pike bass-coded rows: launch=${summary.pike_bass_coded.launch_rows}, winter=${summary.pike_bass_coded.winter_rows}`,
  );
  const sampleSections = Object.entries(summary.samples).filter(([, values]) =>
    values.length > 0
  );
  if (sampleSections.length > 0) {
    console.log("Sample review queues:");
    for (const [label, values] of sampleSections) {
      console.log(`  ${label}:`);
      for (const value of values) console.log(`    ${value}`);
    }
  }
}

function envelopeFindingLine(finding: EnvelopeFinding): string {
  const { row } = finding;
  const ids = [
    ...row.primary_lure_ids.filter((id) =>
      BASS_CODED_PIKE_LURE_IDS.has(id) ||
      WARMWATER_SURFACE_IDS.has(id) ||
      TROUT_SURFACE_IDS.has(id)
    ),
    ...row.primary_fly_ids.filter((id) =>
      BASS_CODED_PIKE_LURE_IDS.has(id) ||
      WARMWATER_SURFACE_IDS.has(id) ||
      TROUT_SURFACE_IDS.has(id)
    ),
  ];
  return [
    `${finding.code}: ${rowKey(row)}`,
    `band=${REGION_CLIMATE_BANDS[row.region_key] ?? "unknown"}`,
    `bucket=${monthBucket(row.month)}`,
    `cols=${row.column_range.join("/")}`,
    `base=${row.column_baseline}`,
    `paces=${row.pace_range.join("/")}`,
    `pace_base=${row.pace_baseline}`,
    `surface=${row.surface_seasonally_possible}`,
    ids.length > 0 ? `ids=${ids.join(",")}` : null,
    `detail=${finding.detail}`,
  ].filter(Boolean).join(" ");
}

function collectEnvelopeFindings(
  rows: readonly SeasonalRowV4[],
): EnvelopeFinding[] {
  const findings: EnvelopeFinding[] = [];

  for (const row of rows) {
    const band = REGION_CLIMATE_BANDS[row.region_key];
    const isCold = band === "cold_cold_temperate";
    const isCool = band === "cool_mid_latitude";
    const isWarmOrSub = band === "warm_southern" ||
      band === "subtropical_desert_special";
    const winter = row.month === 12 || row.month === 1 || row.month === 2;
    const janFeb = row.month === 1 || row.month === 2;

    if (!row.column_range.includes(row.column_baseline)) {
      addEnvelopeFinding(
        findings,
        "hard_invariant_break",
        row,
        "baseline_column_outside_range",
        "column_baseline must be included in column_range",
      );
    }
    if (!row.pace_range.includes(row.pace_baseline)) {
      addEnvelopeFinding(
        findings,
        "hard_invariant_break",
        row,
        "baseline_pace_outside_range",
        "pace_baseline must be included in pace_range",
      );
    }
    if (row.column_baseline === "surface") {
      addEnvelopeFinding(
        findings,
        "hard_invariant_break",
        row,
        "surface_baseline",
        "surface should never be the row baseline column",
      );
    }
    if (
      row.column_range.includes("surface") !== row.surface_seasonally_possible
    ) {
      addEnvelopeFinding(
        findings,
        "hard_invariant_break",
        row,
        "surface_flag_column_mismatch",
        "surface_seasonally_possible must agree with surface in column_range",
      );
    }
    if (row.species === "trout" && row.water_type !== "freshwater_river") {
      addEnvelopeFinding(
        findings,
        "hard_invariant_break",
        row,
        "trout_non_river_row",
        "daily-picks trout rows should remain river-only",
      );
    }
    if (!row.surface_seasonally_possible && rowSurfaceIds(row).length > 0) {
      addEnvelopeFinding(
        findings,
        "hard_invariant_break",
        row,
        "surface_ids_when_surface_closed",
        "surface profile ids should not be authored when seasonal surface is closed",
      );
    }

    if (
      isCold && janFeb &&
      (row.column_range.includes("upper") ||
        row.column_range.includes("surface") ||
        row.pace_range.includes("fast"))
    ) {
      addEnvelopeFinding(
        findings,
        "likely_issue",
        row,
        "cold_jan_feb_too_aggressive",
        "cold-region Jan/Feb should stay bottom/mid and slow/medium unless explicitly exempted",
      );
    }
    if (isCold && winter && rowHasAny(row, WARMWATER_SURFACE_IDS)) {
      addEnvelopeFinding(
        findings,
        "likely_issue",
        row,
        "cold_winter_warmwater_surface_id",
        "warmwater topwater profile in a cold-region winter row",
      );
    }
    if (
      row.species === "northern_pike" && winter &&
      row.primary_lure_ids.includes("spinnerbait") &&
      row.primary_lure_ids.some((id) => PIKE_FIRST_LURE_IDS.has(id))
    ) {
      addEnvelopeFinding(
        findings,
        "likely_issue",
        row,
        "winter_pike_generic_spinnerbait_padding",
        "generic bass-coded pike carryover remains despite pike-first winter tools",
      );
    }
    if (
      row.species === "northern_pike" && winter &&
      !row.primary_lure_ids.includes("spinnerbait") &&
      row.primary_lure_ids.some((id) => BASS_CODED_PIKE_LURE_IDS.has(id)) &&
      row.primary_lure_ids.some((id) => PIKE_FIRST_LURE_IDS.has(id))
    ) {
      addEnvelopeFinding(
        findings,
        "watch_review",
        row,
        "winter_pike_bass_coded_padding_review",
        "non-spinnerbait bass-coded pike carryover remains despite pike-first winter tools",
      );
    }

    if (isCold && row.month === 3 && row.pace_range.includes("fast")) {
      addEnvelopeFinding(
        findings,
        "watch_review",
        row,
        "cold_march_fast_lane",
        "fast pace in cold March can be credible for reaction/runoff but deserves row review",
      );
    }
    if (
      isCold &&
      (row.month === 6 || row.month === 9) &&
      row.surface_seasonally_possible
    ) {
      addEnvelopeFinding(
        findings,
        "watch_review",
        row,
        "cold_shoulder_surface_window",
        "cold-region June/September surface can be credible but should remain condition-dependent",
      );
    }
    if (
      isCool &&
      (row.month === 5 || row.month === 10) &&
      row.surface_seasonally_possible
    ) {
      addEnvelopeFinding(
        findings,
        "watch_review",
        row,
        "cool_shoulder_surface_window",
        "cool/mid-latitude May/October surface needs species- and water-specific review",
      );
    }
    if (
      isWarmOrSub && winter &&
      (row.column_range.includes("upper") ||
        row.column_range.includes("surface") ||
        row.pace_range.includes("fast"))
    ) {
      addEnvelopeFinding(
        findings,
        "watch_review",
        row,
        "warm_winter_active_envelope",
        "warm/southern winter activity can be plausible but should not become reckless by species",
      );
    }
    if (
      row.species === "trout" &&
      row.surface_seasonally_possible &&
      rowHasAny(row, TROUT_SURFACE_IDS)
    ) {
      addEnvelopeFinding(
        findings,
        "watch_review",
        row,
        "trout_surface_mouse_window",
        "trout plug/mouse surface legality should stay narrow and low-light-seasonal",
      );
    }
  }

  return findings;
}

function countBy<T extends string>(
  values: readonly T[],
): Record<T, number> {
  const result = {} as Record<T, number>;
  for (const value of values) {
    result[value] = (result[value] ?? 0) + 1;
  }
  return result;
}

function printEnvelopeAuditAndExit(
  rows: readonly SeasonalRowV4[],
  json: boolean,
) {
  const findings = collectEnvelopeFindings(rows);
  const uniqueFindingRows = new Set(
    findings.map((finding) => rowKey(finding.row)),
  );
  const hard = findings.filter((finding) =>
    finding.severity === "hard_invariant_break"
  );
  const likely = findings.filter((finding) =>
    finding.severity === "likely_issue"
  );
  const watch = findings.filter((finding) =>
    finding.severity === "watch_review"
  );
  const summary = {
    rows: rows.length,
    climate_bands: REGION_CLIMATE_BANDS,
    counts: {
      unique_flagged_rows: uniqueFindingRows.size,
      hard_invariant_break: hard.length,
      likely_issue: likely.length,
      watch_review: watch.length,
      launch_critical:
        findings.filter((finding) => finding.priority === "launch_critical")
          .length,
      winter_deferred:
        findings.filter((finding) => finding.priority === "winter_deferred")
          .length,
    },
    by_code: countBy(findings.map((finding) => finding.code)),
    launch_by_code: countBy(
      findings.filter((finding) => finding.priority === "launch_critical")
        .map((finding) => finding.code),
    ),
    winter_by_code: countBy(
      findings.filter((finding) => finding.priority === "winter_deferred")
        .map((finding) => finding.code),
    ),
    samples: {
      hard_invariant_break: hard.slice(0, 20).map(envelopeFindingLine),
      launch_likely_issue: likely.filter((finding) =>
        finding.priority === "launch_critical"
      ).slice(0, 20).map(envelopeFindingLine),
      winter_likely_issue: likely.filter((finding) =>
        finding.priority === "winter_deferred"
      ).slice(0, 20).map(envelopeFindingLine),
      launch_watch_review: watch.filter((finding) =>
        finding.priority === "launch_critical"
      ).slice(0, 30).map(envelopeFindingLine),
      winter_watch_review: watch.filter((finding) =>
        finding.priority === "winter_deferred"
      ).slice(0, 30).map(envelopeFindingLine),
    },
  };

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("Daily-picks regional seasonal envelope audit");
  console.log(`Rows: ${summary.rows}`);
  console.log(
    `Findings: hard=${summary.counts.hard_invariant_break}, likely=${summary.counts.likely_issue}, watch=${summary.counts.watch_review}`,
  );
  console.log(`Unique flagged rows: ${summary.counts.unique_flagged_rows}`);
  console.log(
    `Priority: launch=${summary.counts.launch_critical}, winter/deferred=${summary.counts.winter_deferred}`,
  );
  console.log("By code:");
  for (const [code, count] of Object.entries(summary.by_code).sort()) {
    console.log(`  ${code}: ${count}`);
  }
  const sampleSections = Object.entries(summary.samples).filter(([, values]) =>
    values.length > 0
  );
  if (sampleSections.length > 0) {
    console.log("Sample review queues:");
    for (const [label, values] of sampleSections) {
      console.log(`  ${label}:`);
      for (const value of values) console.log(`    ${value}`);
    }
  }
}

function scoreLine(score: CandidateScore): string {
  return [
    score.profile.id,
    `${score.score}`,
    `family=${score.profile.family_group}`,
    `presentation=${score.profile.presentation_group}`,
    `${score.profile.column}/${score.profile.primary_pace}${
      score.profile.secondary_pace == null
        ? ""
        : `+${score.profile.secondary_pace}`
    }`,
    score.profile.is_surface ? "surface" : null,
    score.reasons.join(";"),
  ].filter(Boolean).join(" ");
}

function topSideLines(
  scores: readonly CandidateScore[],
  limit = 5,
): string[] {
  return [...scores].sort((a, b) =>
    b.score - a.score || a.profile.id.localeCompare(b.profile.id)
  ).slice(0, limit).map(scoreLine);
}

function runTraceCase(args: {
  row: SeasonalRowV4;
  templateKey: string;
  goal: Goal;
}): SelectionRun {
  const template = SCENARIOS.find((scenario) =>
    scenario.key === args.templateKey
  );
  if (template == null) {
    throw new Error(`Unknown trace scenario '${args.templateKey}'`);
  }
  return runSelection({
    row: args.row,
    template,
    goal: args.goal,
    variant: "A",
    seed: `watchlist-trace|${rowKey(args.row)}|${template.key}|${args.goal}`,
  });
}

function traceSummaryLine(label: string, run: SelectionRun): string {
  const selected = [
    ...run.lureIds.map((id) => `lure:${id}`),
    ...run.flyIds.map((id) => `fly:${id}`),
  ].join(",");
  return [
    label,
    rowKey(run.row),
    `goal=${run.scenario.recommendation_goal}`,
    `scenario=${
      run.scenario.surface_daily_reason_codes.at(-1)?.replace(
        "audit_template:",
        "",
      )
    }`,
    `surface_gate=${run.scenario.surface_daily_gate}`,
    `tags=${run.scenario.scenario_tags.join("|")}`,
    `selected=${selected}`,
  ].join(" ");
}

function traceWatchlist(rows: readonly SeasonalRowV4[]) {
  const coldRegions = new Set(
    Object.entries(REGION_CLIMATE_BANDS)
      .filter(([, band]) => band === "cold_cold_temperate")
      .map(([region]) => region),
  );
  const coolRegions = new Set(
    Object.entries(REGION_CLIMATE_BANDS)
      .filter(([, band]) => band === "cool_mid_latitude")
      .map(([region]) => region),
  );

  const troutSurfaceRows = rows.filter((row) =>
    row.species === "trout" &&
    row.surface_seasonally_possible &&
    row.primary_fly_ids.includes("mouse_fly")
  );
  const coldMarchRows = rows.filter((row) =>
    (row.species === "northern_pike" || row.species === "trout") &&
    coldRegions.has(row.region_key) &&
    row.month === 3 &&
    row.pace_range.includes("fast")
  );
  const coolLmbSurfaceRows = rows.filter((row) =>
    row.species === "largemouth_bass" &&
    coolRegions.has(row.region_key) &&
    (row.month === 5 || row.month === 10) &&
    row.water_type === "freshwater_lake_pond" &&
    row.surface_seasonally_possible
  );
  const coldSurfaceRows = rows.filter((row) =>
    coldRegions.has(row.region_key) &&
    (row.month === 6 || row.month === 9) &&
    row.surface_seasonally_possible
  );

  const mouseSelections: string[] = [];
  const mouseWeakSelections: string[] = [];
  const coldMarchFastSelections: string[] = [];
  const coldMarchFastColdClearSelections: string[] = [];
  const lmbSurfaceSelections: string[] = [];
  const lmbSurfaceClosedSelections: string[] = [];
  const coldSurfaceClosedSelections: string[] = [];
  const sampleLines: string[] = [];

  for (const row of troutSurfaceRows) {
    for (
      const templateKey of [
        "cold_clear_suppressed",
        "calm_low_light_surface_stress",
        "dirty_elevated_river",
        "heat_clear_bright",
      ]
    ) {
      if (
        templateKey === "dirty_elevated_river" &&
        row.water_type !== "freshwater_river"
      ) {
        continue;
      }
      for (const goal of GOALS) {
        const run = runTraceCase({ row, templateKey, goal });
        if (!run.flyIds.includes("mouse_fly")) continue;
        const line = traceSummaryLine("mouse_fly_selected", run);
        mouseSelections.push(line);
        const strongMouseContext = goal === "big_fish" &&
          run.scenario.light_mode === "low_light" &&
          (row.month === 7 || row.month === 8 || row.month === 9) &&
          run.scenario.surface_daily_gate === "open";
        if (!strongMouseContext) mouseWeakSelections.push(line);
      }
    }
  }

  for (const row of coldMarchRows) {
    for (
      const templateKey of [
        "cold_clear_suppressed",
        "dirty_elevated_river",
        "calm_low_light_surface_stress",
      ]
    ) {
      if (
        templateKey === "dirty_elevated_river" &&
        row.water_type !== "freshwater_river"
      ) {
        continue;
      }
      for (const goal of GOALS) {
        const run = runTraceCase({ row, templateKey, goal });
        const fastSelected = run.selected.filter((score) =>
          score.profile.primary_pace === "fast" ||
          score.profile.secondary_pace === "fast"
        );
        if (fastSelected.length === 0) continue;
        const line = `${
          traceSummaryLine("cold_march_fast_selected", run)
        } fast=${fastSelected.map((score) => score.profile.id).join(",")}`;
        coldMarchFastSelections.push(line);
        if (templateKey === "cold_clear_suppressed") {
          coldMarchFastColdClearSelections.push(line);
        }
      }
    }
  }

  for (const row of coolLmbSurfaceRows) {
    for (
      const templateKey of [
        "cold_clear_suppressed",
        "windy_stained_reaction",
        "calm_low_light_surface_stress",
        "heat_clear_bright",
      ]
    ) {
      for (const goal of GOALS) {
        const run = runTraceCase({ row, templateKey, goal });
        const surfaceSelected = run.selected.filter((score) =>
          score.profile.is_surface
        );
        if (surfaceSelected.length === 0) continue;
        const line = `${
          traceSummaryLine("cool_lmb_surface_selected", run)
        } surface=${
          surfaceSelected.map((score) => score.profile.id).join(",")
        }`;
        lmbSurfaceSelections.push(line);
        if (run.scenario.surface_daily_gate !== "open") {
          lmbSurfaceClosedSelections.push(line);
        }
      }
    }
  }

  for (const row of coldSurfaceRows) {
    for (
      const templateKey of [
        "cold_clear_suppressed",
        "windy_stained_reaction",
        "calm_low_light_surface_stress",
        "heat_clear_bright",
      ]
    ) {
      for (const goal of GOALS) {
        const run = runTraceCase({ row, templateKey, goal });
        if (
          sampleLines.length < 12 && run.scenario.surface_daily_gate === "open"
        ) {
          sampleLines.push(traceSummaryLine("cold_surface_open_sample", run));
        }
        const surfaceSelected = run.selected.filter((score) =>
          score.profile.is_surface
        );
        if (
          surfaceSelected.length > 0 &&
          run.scenario.surface_daily_gate !== "open"
        ) {
          coldSurfaceClosedSelections.push(
            `${traceSummaryLine("cold_surface_closed_selected", run)} surface=${
              surfaceSelected.map((score) => score.profile.id).join(",")
            }`,
          );
        }
      }
    }
  }

  const representativeRows = [
    troutSurfaceRows.find((row) =>
      row.region_key === "appalachian" && row.month === 5
    ),
    troutSurfaceRows.find((row) =>
      row.region_key === "great_lakes_upper_midwest" && row.month === 8
    ),
    coldMarchRows.find((row) =>
      row.species === "northern_pike" &&
      row.water_type === "freshwater_lake_pond"
    ),
    coldMarchRows.find((row) =>
      row.species === "trout" && row.water_type === "freshwater_river"
    ),
    coolLmbSurfaceRows.find((row) =>
      row.region_key === "appalachian" && row.month === 5
    ),
    coolLmbSurfaceRows.find((row) =>
      row.region_key === "appalachian" && row.month === 10
    ),
  ].filter((row): row is SeasonalRowV4 => row != null);

  for (const row of representativeRows) {
    const templateKey = row.species === "trout" && row.month === 8
      ? "calm_low_light_surface_stress"
      : "cold_clear_suppressed";
    const run = runTraceCase({ row, templateKey, goal: "big_fish" });
    sampleLines.push(traceSummaryLine("representative", run));
    sampleLines.push(
      `  top_lures: ${topSideLines(run.lureScores, 4).join(" | ")}`,
    );
    sampleLines.push(
      `  top_flies: ${topSideLines(run.flyScores, 4).join(" | ")}`,
    );
  }

  const summary = {
    rows: {
      trout_surface_mouse_rows: troutSurfaceRows.length,
      cold_march_fast_rows: coldMarchRows.length,
      cool_lmb_surface_rows: coolLmbSurfaceRows.length,
      cold_june_september_surface_rows: coldSurfaceRows.length,
    },
    selected_counts: {
      mouse_fly_total: mouseSelections.length,
      mouse_fly_outside_strong_context: mouseWeakSelections.length,
      cold_march_fast_total: coldMarchFastSelections.length,
      cold_march_fast_cold_clear_suppressed:
        coldMarchFastColdClearSelections.length,
      cool_lmb_surface_total: lmbSurfaceSelections.length,
      cool_lmb_surface_when_gate_not_open: lmbSurfaceClosedSelections.length,
      cold_june_september_surface_when_gate_not_open:
        coldSurfaceClosedSelections.length,
    },
    samples: {
      mouse_fly_outside_strong_context: mouseWeakSelections.slice(0, 20),
      cold_march_fast_cold_clear_suppressed: coldMarchFastColdClearSelections
        .slice(0, 20),
      cool_lmb_surface_when_gate_not_open: lmbSurfaceClosedSelections.slice(
        0,
        20,
      ),
      cold_june_september_surface_when_gate_not_open:
        coldSurfaceClosedSelections.slice(0, 20),
      representative: sampleLines.slice(0, 40),
    },
  };

  return summary;
}

function printWatchlistTraceAndExit(
  rows: readonly SeasonalRowV4[],
  json: boolean,
) {
  const summary = traceWatchlist(rows);
  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  console.log("Daily-picks launch watchlist trace");
  console.log(`Rows: ${JSON.stringify(summary.rows)}`);
  console.log(`Selected counts: ${JSON.stringify(summary.selected_counts)}`);
  const sampleSections = Object.entries(summary.samples).filter(([, values]) =>
    values.length > 0
  );
  if (sampleSections.length > 0) {
    console.log("Sample trace queues:");
    for (const [label, values] of sampleSections) {
      console.log(`  ${label}:`);
      for (const value of values) console.log(`    ${value}`);
    }
  }
}

type BroadFlySlot = {
  set: "A" | "B";
  slot: "top" | "honorable";
  score: CandidateScore;
};

function flySelectionSlots(run: SelectionRun, set: "A" | "B"): BroadFlySlot[] {
  return [
    { set, slot: "top", score: run.selected[2]! },
    { set, slot: "honorable", score: run.selected[3]! },
  ];
}

function mapToSortedObject(map: Map<string, number>): Record<string, number> {
  return Object.fromEntries(
    [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  );
}

function broadContextKey(args: {
  row: SeasonalRowV4;
  template: AuditScenarioTemplate;
  goal: Goal;
}): string {
  return `${rowKey(args.row)} ${args.template.key} ${args.goal}`;
}

function broadFlyTraceLine(args: {
  row: SeasonalRowV4;
  template: AuditScenarioTemplate;
  goal: Goal;
  selected: BroadFlySlot;
}): string {
  const { score } = args.selected;
  return [
    broadContextKey(args),
    `set=${args.selected.set}`,
    `slot=${args.selected.slot}`,
    `id=${score.profile.id}`,
    `score=${score.score}`,
    `family=${score.profile.family_group}`,
    `column=${score.profile.column}`,
    `pace=${score.profile.primary_pace}${
      score.profile.secondary_pace == null
        ? ""
        : `+${score.profile.secondary_pace}`
    }`,
    `reasons=${score.reasons.join(";")}`,
  ].join(" ");
}

function broadFlyProfileRole(id: string): string {
  const profile = BROAD_FLY_PROFILE_BY_ID.get(id);
  if (profile == null) return "missing_profile";
  return [
    `species=${profile.species_allowed.join("/")}`,
    `water=${profile.water_types_allowed.join("/")}`,
    `family=${profile.family_group}`,
    `presentation=${profile.presentation_group}`,
    `column=${profile.column}`,
    `pace=${profile.primary_pace}${
      profile.secondary_pace == null ? "" : `+${profile.secondary_pace}`
    }`,
    `forage=${profile.forage_tags.join("/")}`,
    `clarity=${profile.clarity_strengths.join("/")}`,
    `conditions=${profile.condition_tags.join("/")}`,
    `goals=${profile.goal_tags.join("/")}`,
  ].join(" ");
}

function collectBroadFlyAudit(
  rows: readonly SeasonalRowV4[],
  templates: readonly AuditScenarioTemplate[],
) {
  const rowCoverage = new Map<string, number>();
  const rowCoverageBySpecies = new Map<string, number>();
  const rowCoverageByWater = new Map<string, number>();
  const selectedById = new Map<string, number>();
  const selectedTopById = new Map<string, number>();
  const selectedHonorableById = new Map<string, number>();
  const selectedSetAById = new Map<string, number>();
  const selectedSetBById = new Map<string, number>();
  const selectedBySpecies = new Map<string, number>();
  const selectedByWater = new Map<string, number>();
  const selectedByGoal = new Map<string, number>();
  const selectedByFamily = new Map<string, number>();
  const allFlySelectedById = new Map<string, number>();
  const allFlyFamily = new Map<string, number>();
  const broadCandidatePoolHits = new Map<string, number>();
  const scoreSamples: string[] = [];
  const selectedSamples: string[] = [];
  const flyPoolCounts: number[] = [];
  const thinFlyPools: string[] = [];

  let contexts = 0;
  let setRuns = 0;
  let flySelectedSlots = 0;
  let broadSelectedSlots = 0;
  let broadTopSlots = 0;
  let broadHonorableSlots = 0;

  for (const row of rows) {
    for (const id of row.primary_fly_ids) {
      if (!BROAD_FLY_AUDIT_IDS.has(id)) continue;
      increment(rowCoverage, id);
      increment(rowCoverageBySpecies, `${row.species}:${id}`);
      increment(rowCoverageByWater, `${row.water_type}:${id}`);
    }
  }

  for (const row of rows) {
    for (const template of templates) {
      if (!appliesTo(template, row)) continue;

      for (const goal of GOALS) {
        contexts++;
        const seed = `broad-fly-audit|${rowKey(row)}|${template.key}|${goal}`;
        const runA = runSelection({
          row,
          template,
          goal,
          variant: "A",
          seed,
        });
        const runB = runSelection({
          row,
          template,
          goal,
          variant: "B",
          seed,
          avoidLureIds: runA.lureIds,
          avoidFlyIds: runA.flyIds,
        });

        for (const run of [runA, runB]) {
          setRuns++;
          flyPoolCounts.push(run.flyScores.length);
          if (run.flyScores.length < 4) {
            thinFlyPools.push(
              `${
                broadContextKey({ row, template, goal })
              }: flies=${run.flyScores.length}`,
            );
          }
          for (const score of run.flyScores) {
            if (BROAD_FLY_AUDIT_IDS.has(score.profile.id)) {
              increment(broadCandidatePoolHits, score.profile.id);
              if (scoreSamples.length < 80) {
                scoreSamples.push(
                  `${
                    broadContextKey({ row, template, goal })
                  } candidate=${score.profile.id} score=${score.score} reasons=${
                    score.reasons.join(";")
                  }`,
                );
              }
            }
          }
        }

        for (
          const selected of [
            ...flySelectionSlots(runA, "A"),
            ...flySelectionSlots(runB, "B"),
          ]
        ) {
          flySelectedSlots++;
          const id = selected.score.profile.id;
          increment(allFlySelectedById, id);
          increment(allFlyFamily, selected.score.profile.family_group);

          if (!BROAD_FLY_AUDIT_IDS.has(id)) continue;
          broadSelectedSlots++;
          if (selected.slot === "top") {
            broadTopSlots++;
            increment(selectedTopById, id);
          } else {
            broadHonorableSlots++;
            increment(selectedHonorableById, id);
          }
          if (selected.set === "A") increment(selectedSetAById, id);
          else increment(selectedSetBById, id);
          increment(selectedById, id);
          increment(selectedBySpecies, `${row.species}:${id}`);
          increment(selectedByWater, `${row.water_type}:${id}`);
          increment(selectedByGoal, `${goal}:${id}`);
          increment(selectedByFamily, selected.score.profile.family_group);
          if (selectedSamples.length < 100) {
            selectedSamples.push(
              broadFlyTraceLine({ row, template, goal, selected }),
            );
          }
        }
      }
    }
  }

  return {
    rows: rows.length,
    scenarios: templates.map((template) => template.key),
    contexts,
    set_runs: setRuns,
    broad_fly_ids: [...BROAD_FLY_AUDIT_IDS].sort(),
    broad_fly_roles: Object.fromEntries(
      [...BROAD_FLY_AUDIT_IDS].sort().map((
        id,
      ) => [id, broadFlyProfileRole(id)]),
    ),
    row_coverage: mapToSortedObject(rowCoverage),
    row_coverage_by_species: mapToSortedObject(rowCoverageBySpecies),
    row_coverage_by_water: mapToSortedObject(rowCoverageByWater),
    selected_slots: {
      fly_total: flySelectedSlots,
      broad_total: broadSelectedSlots,
      broad_share: flySelectedSlots === 0
        ? 0
        : broadSelectedSlots / flySelectedSlots,
      broad_top_pick_total: broadTopSlots,
      broad_honorable_total: broadHonorableSlots,
      broad_top_pick_share: flySelectedSlots === 0
        ? 0
        : broadTopSlots / flySelectedSlots,
      broad_honorable_share: flySelectedSlots === 0
        ? 0
        : broadHonorableSlots / flySelectedSlots,
    },
    pool_health: {
      fly_min: Math.min(...flyPoolCounts),
      fly_p10: percentile(flyPoolCounts, 0.1),
      fly_median: percentile(flyPoolCounts, 0.5),
      thin_fly_contexts_lt4: thinFlyPools.length,
    },
    broad_candidate_pool_hits: topEntries(broadCandidatePoolHits, 30),
    broad_selected_by_id: topEntries(selectedById, 30),
    broad_top_pick_by_id: topEntries(selectedTopById, 30),
    broad_honorable_by_id: topEntries(selectedHonorableById, 30),
    broad_set_a_by_id: topEntries(selectedSetAById, 30),
    broad_set_b_by_id: topEntries(selectedSetBById, 30),
    broad_selected_by_species: topEntries(selectedBySpecies, 60),
    broad_selected_by_water: topEntries(selectedByWater, 40),
    broad_selected_by_goal: topEntries(selectedByGoal, 40),
    broad_selected_by_family: topEntries(selectedByFamily, 20),
    all_fly_selected_by_id: topEntries(allFlySelectedById, 30),
    all_fly_family_share: topEntries(allFlyFamily, 20),
    samples: {
      selected_broad_flies: selectedSamples,
      broad_candidate_scores: scoreSamples,
      thin_fly_pools: thinFlyPools.slice(0, 20),
    },
  };
}

function printBroadFlyAuditAndExit(
  rows: readonly SeasonalRowV4[],
  templates: readonly AuditScenarioTemplate[],
  json: boolean,
) {
  const summary = collectBroadFlyAudit(rows, templates);
  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("Daily-picks broad-fly exposure audit");
  console.log(`Rows: ${summary.rows}`);
  console.log(`Scenarios: ${summary.scenarios.join(", ")}`);
  console.log(`Row/scenario/goal contexts: ${summary.contexts}`);
  console.log(
    `Pool health: fly min/p10/median ${summary.pool_health.fly_min}/${summary.pool_health.fly_p10}/${summary.pool_health.fly_median}; thin <4 ${summary.pool_health.thin_fly_contexts_lt4}`,
  );
  console.log(
    `Broad fly selected slots: ${summary.selected_slots.broad_total}/${summary.selected_slots.fly_total} (${
      summary.selected_slots.broad_share.toFixed(3)
    })`,
  );
  console.log(
    `Broad Top/HM slots: top=${summary.selected_slots.broad_top_pick_total} (${
      summary.selected_slots.broad_top_pick_share.toFixed(3)
    }), honorable=${summary.selected_slots.broad_honorable_total} (${
      summary.selected_slots.broad_honorable_share.toFixed(3)
    })`,
  );
  console.log("Broad fly row coverage:");
  for (const [id, count] of Object.entries(summary.row_coverage)) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("Broad fly selected by ID:");
  for (const [id, count] of summary.broad_selected_by_id) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("All fly selected by ID:");
  for (const [id, count] of summary.all_fly_selected_by_id) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("All fly family share:");
  for (const [family, count] of summary.all_fly_family_share) {
    console.log(`  ${family}: ${count}`);
  }
  const sampleSections = Object.entries(summary.samples).filter(([, values]) =>
    values.length > 0
  );
  if (sampleSections.length > 0) {
    console.log("Sample trace queues:");
    for (const [label, values] of sampleSections) {
      console.log(`  ${label}:`);
      for (const value of values.slice(0, 20)) console.log(`    ${value}`);
    }
  }
}

function slotScores(run: SelectionRun): Array<{
  key: "lure_top" | "lure_honorable" | "fly_top" | "fly_honorable";
  side: "lure" | "fly";
  score: CandidateScore;
}> {
  return [
    { key: "lure_top", side: "lure", score: run.selected[0]! },
    { key: "lure_honorable", side: "lure", score: run.selected[1]! },
    { key: "fly_top", side: "fly", score: run.selected[2]! },
    { key: "fly_honorable", side: "fly", score: run.selected[3]! },
  ];
}

function familySetKey(run: SelectionRun): string {
  return slotScores(run).map((slot) => slot.score.profile.family_group).join(
    "|",
  );
}

function selectedDetail(run: SelectionRun): string {
  return slotScores(run).map((slot) =>
    `${slot.key}:${slot.score.profile.id}[${slot.score.score}/${slot.score.profile.family_group}/${slot.score.profile.presentation_group}]`
  ).join(",");
}

function topAlternativesDetail(run: SelectionRun): string {
  return [
    `lures=${topSideLines(run.lureScores, 4).join(" || ")}`,
    `flies=${topSideLines(run.flyScores, 4).join(" || ")}`,
  ].join(" ");
}

function qualityBandForAudit(
  scores: readonly CandidateScore[],
): CandidateScore[] {
  const bestScore = Math.max(...scores.map((score) => score.score));
  return scores.filter((score) =>
    score.score >= bestScore - AUDIT_TOP_QUALITY_BAND
  );
}

function sideLaneAvailabilityDetail(args: {
  side: "lure" | "fly";
  setA: SelectionRun;
  setB: SelectionRun;
}): string {
  const setAIds = new Set(
    args.side === "lure" ? args.setA.lureIds : args.setA.flyIds,
  );
  const setAFamilies = new Set(
    slotScores(args.setA)
      .filter((slot) => slot.side === args.side)
      .map((slot) => slot.score.profile.family_group),
  );
  const setAPresentations = new Set(
    slotScores(args.setA)
      .filter((slot) => slot.side === args.side)
      .map((slot) => slot.score.profile.presentation_group),
  );
  const sideScores = args.side === "lure"
    ? args.setB.lureScores
    : args.setB.flyScores;
  const inBand = qualityBandForAudit(sideScores);
  const nonSetAIds = inBand.filter((score) => !setAIds.has(score.profile.id));
  const differentFamily = nonSetAIds.filter((score) =>
    !setAFamilies.has(score.profile.family_group)
  );
  const differentPresentation = nonSetAIds.filter((score) =>
    !setAPresentations.has(score.profile.presentation_group)
  );

  const summarize = (scores: readonly CandidateScore[]): string =>
    scores.map((score) =>
      `${score.profile.id}:${score.score}/${score.profile.family_group}/${score.profile.presentation_group}`
    ).join("|") || "none";

  return [
    `${args.side}_top_band=${summarize(inBand)}`,
    `${args.side}_non_set_a=${summarize(nonSetAIds)}`,
    `${args.side}_diff_family=${summarize(differentFamily)}`,
    `${args.side}_diff_presentation=${summarize(differentPresentation)}`,
  ].join(" ");
}

function setBOverlapLaneDetail(setA: SelectionRun, setB: SelectionRun): string {
  return [
    sideLaneAvailabilityDetail({ side: "lure", setA, setB }),
    sideLaneAvailabilityDetail({ side: "fly", setA, setB }),
  ].join(" ");
}

function countScoresWithReasonPrefix(
  scores: readonly CandidateScore[],
  prefix: string,
): number {
  return scores.filter((score) =>
    score.reasons.some((reason) => reason.startsWith(prefix))
  ).length;
}

function goalAndConditionCountDetail(run: SelectionRun): string {
  const goalPrefix = `goal:${run.scenario.recommendation_goal}:`;
  return [
    `lure_goal=${countScoresWithReasonPrefix(run.lureScores, goalPrefix)}`,
    `fly_goal=${countScoresWithReasonPrefix(run.flyScores, goalPrefix)}`,
    `lure_condition=${
      countScoresWithReasonPrefix(run.lureScores, "condition_tag:")
    }`,
    `fly_condition=${
      countScoresWithReasonPrefix(run.flyScores, "condition_tag:")
    }`,
  ].join(" ");
}

function exposureRate(count: number, total: number): number {
  return total === 0 ? 0 : count / total;
}

function collectExposureAudit(
  rows: readonly SeasonalRowV4[],
  templates: readonly AuditScenarioTemplate[],
  exposureDays: number,
) {
  const selectedBySlot = new Map<string, number>();
  const selectedByFamilySlot = new Map<string, number>();
  const selectedBySpecies = new Map<string, number>();
  const selectedByWater = new Map<string, number>();
  const selectedByGoal = new Map<string, number>();
  const selectedBySide = new Map<string, number>();
  const topPickBySide = new Map<string, number>();
  const honorableBySide = new Map<string, number>();
  const broadFlySelected = new Map<string, number>();
  const setASetBOverlapSamples: string[] = [];
  const exactRepeatSamples: string[] = [];
  const slotRepeatSamples: string[] = [];
  const familyRepeatSamples: string[] = [];
  const familyDiversitySamples: string[] = [];
  const identicalGoalSamples: string[] = [];

  let contexts = 0;
  let dayRuns = 0;
  let adjacentComparisons = 0;
  let setAExactRepeats = 0;
  let setBExactRepeats = 0;
  let setAFamilySetRepeats = 0;
  let setBFamilySetRepeats = 0;
  let slotIdComparisons = 0;
  let slotIdRepeats = 0;
  let slotFamilyComparisons = 0;
  let slotFamilyRepeats = 0;
  let setASetBComparisons = 0;
  let setASetBAnyOverlap = 0;
  let setASetBFullReuse = 0;
  let familyDiversityViolations = 0;
  let broadFlySlots = 0;
  let flySlots = 0;
  let selectedSlots = 0;
  let apBfComparisons = 0;
  let apBfIdenticalSets = 0;

  for (const row of rows) {
    for (const template of templates) {
      if (!appliesTo(template, row)) continue;
      contexts += GOALS.length;

      const runsByGoalAndDay = new Map<string, SelectionRun>();
      for (const goal of GOALS) {
        const seed = `exposure-audit|${rowKey(row)}|${template.key}|${goal}`;
        let previousA: SelectionRun | null = null;
        let previousB: SelectionRun | null = null;

        for (let day = 0; day < exposureDays; day++) {
          const runA = runSelection({
            row,
            template,
            goal,
            variant: "A",
            seed,
            dayOffset: day,
          });
          const runB = runSelection({
            row,
            template,
            goal,
            variant: "B",
            seed,
            dayOffset: day,
            avoidLureIds: runA.lureIds,
            avoidFlyIds: runA.flyIds,
          });
          runsByGoalAndDay.set(`${goal}|${day}`, runA);
          dayRuns += 2;

          for (const [run, setLabel] of [[runA, "A"], [runB, "B"]] as const) {
            const sideSlots = slotScores(run);
            for (const slot of sideSlots) {
              selectedSlots++;
              increment(
                selectedBySlot,
                `${setLabel}:${slot.key}:${slot.score.profile.id}`,
              );
              increment(
                selectedByFamilySlot,
                `${setLabel}:${slot.key}:${slot.score.profile.family_group}`,
              );
              increment(
                selectedBySpecies,
                `${row.species}:${slot.side}:${slot.score.profile.id}`,
              );
              increment(
                selectedByWater,
                `${row.water_type}:${slot.side}:${slot.score.profile.id}`,
              );
              increment(
                selectedByGoal,
                `${goal}:${slot.side}:${slot.score.profile.id}`,
              );
              increment(
                selectedBySide,
                `${slot.side}:${slot.score.profile.id}`,
              );
              if (slot.key.endsWith("_top")) {
                increment(
                  topPickBySide,
                  `${slot.side}:${slot.score.profile.id}`,
                );
              } else {
                increment(
                  honorableBySide,
                  `${slot.side}:${slot.score.profile.id}`,
                );
              }
              if (slot.side === "fly") {
                flySlots++;
                if (BROAD_FLY_AUDIT_IDS.has(slot.score.profile.id)) {
                  broadFlySlots++;
                  increment(broadFlySelected, slot.score.profile.id);
                }
              }
            }

            if (
              (!run.familyDiversity.lures.different_family_selected &&
                run.familyDiversity.lures.different_family_available_in_band) ||
              (!run.familyDiversity.flies.different_family_selected &&
                run.familyDiversity.flies.different_family_available_in_band)
            ) {
              familyDiversityViolations++;
              if (familyDiversitySamples.length < 20) {
                familyDiversitySamples.push(
                  `${
                    rowKey(row)
                  } ${template.key} ${goal} set=${setLabel} lures=${
                    run.lureIds.join(",")
                  } flies=${run.flyIds.join(",")}`,
                );
              }
            }
          }

          const overlapIds = new Set([
            ...runA.lureIds.filter((id) => runB.lureIds.includes(id)),
            ...runA.flyIds.filter((id) => runB.flyIds.includes(id)),
          ]);
          setASetBComparisons++;
          if (overlapIds.size > 0) {
            setASetBAnyOverlap++;
            if (setASetBOverlapSamples.length < 20) {
              setASetBOverlapSamples.push(
                [
                  `${rowKey(row)} ${template.key} ${goal} ${stableDate(day)}`,
                  `overlap=${[...overlapIds].join(",")}`,
                  `A=${selectedDetail(runA)}`,
                  `B=${selectedDetail(runB)}`,
                  `B_lane=${setBOverlapLaneDetail(runA, runB)}`,
                  `B_alternatives=${topAlternativesDetail(runB)}`,
                ].join(" "),
              );
            }
          }
          if (setKey(runA) === setKey(runB)) setASetBFullReuse++;

          if (previousA != null && previousB != null) {
            adjacentComparisons++;
            if (setKey(previousA) === setKey(runA)) {
              setAExactRepeats++;
              if (exactRepeatSamples.length < 20) {
                exactRepeatSamples.push(
                  `${rowKey(row)} ${template.key} ${goal} set=A ${
                    stableDate(day - 1)
                  }->${stableDate(day)}`,
                );
              }
            }
            if (setKey(previousB) === setKey(runB)) setBExactRepeats++;
            if (familySetKey(previousA) === familySetKey(runA)) {
              setAFamilySetRepeats++;
            }
            if (familySetKey(previousB) === familySetKey(runB)) {
              setBFamilySetRepeats++;
            }

            const previousSlots = slotScores(previousA);
            const currentSlots = slotScores(runA);
            for (const previousSlot of previousSlots) {
              const currentSlot = currentSlots.find((slot) =>
                slot.key === previousSlot.key
              )!;
              slotIdComparisons++;
              slotFamilyComparisons++;
              if (
                previousSlot.score.profile.id === currentSlot.score.profile.id
              ) {
                slotIdRepeats++;
                if (slotRepeatSamples.length < 20) {
                  slotRepeatSamples.push(
                    `${
                      rowKey(row)
                    } ${template.key} ${goal} ${currentSlot.key} ${
                      stableDate(day - 1)
                    }->${stableDate(day)} id=${currentSlot.score.profile.id}`,
                  );
                }
              }
              if (
                previousSlot.score.profile.family_group ===
                  currentSlot.score.profile.family_group
              ) {
                slotFamilyRepeats++;
                if (familyRepeatSamples.length < 20) {
                  familyRepeatSamples.push(
                    `${
                      rowKey(row)
                    } ${template.key} ${goal} ${currentSlot.key} ${
                      stableDate(day - 1)
                    }->${
                      stableDate(day)
                    } family=${currentSlot.score.profile.family_group}`,
                  );
                }
              }
            }
          }
          previousA = runA;
          previousB = runB;
        }
      }

      for (let day = 0; day < exposureDays; day++) {
        const ap = runsByGoalAndDay.get(`all_purpose|${day}`);
        const bf = runsByGoalAndDay.get(`big_fish|${day}`);
        if (ap == null || bf == null) continue;
        apBfComparisons++;
        if (setKey(ap) === setKey(bf)) {
          apBfIdenticalSets++;
          if (identicalGoalSamples.length < 20) {
            identicalGoalSamples.push(
              [
                `${rowKey(row)} ${template.key} ${stableDate(day)}`,
                `AP=${selectedDetail(ap)}`,
                `BF=${selectedDetail(bf)}`,
                `AP_fit=${goalAndConditionCountDetail(ap)}`,
                `BF_fit=${goalAndConditionCountDetail(bf)}`,
                `AP_alternatives=${topAlternativesDetail(ap)}`,
                `BF_alternatives=${topAlternativesDetail(bf)}`,
              ].join(" "),
            );
          }
        }
      }
    }
  }

  const totalTopSlots = [...topPickBySide.values()].reduce((a, b) => a + b, 0);
  const totalHonorableSlots = [...honorableBySide.values()].reduce(
    (a, b) => a + b,
    0,
  );
  const topPickExposure = topEntries(topPickBySide, 20);
  const honorableExposure = topEntries(honorableBySide, 20);

  return {
    rows: rows.length,
    scenarios: templates.map((template) => template.key),
    exposure_days: exposureDays,
    contexts,
    day_runs: dayRuns,
    adjacent: {
      comparisons: adjacentComparisons,
      set_a_exact_repeats: setAExactRepeats,
      set_a_exact_repeat_rate: exposureRate(
        setAExactRepeats,
        adjacentComparisons,
      ),
      set_b_exact_repeats: setBExactRepeats,
      set_b_exact_repeat_rate: exposureRate(
        setBExactRepeats,
        adjacentComparisons,
      ),
      set_a_family_set_repeats: setAFamilySetRepeats,
      set_a_family_set_repeat_rate: exposureRate(
        setAFamilySetRepeats,
        adjacentComparisons,
      ),
      set_b_family_set_repeats: setBFamilySetRepeats,
      set_b_family_set_repeat_rate: exposureRate(
        setBFamilySetRepeats,
        adjacentComparisons,
      ),
      slot_id_repeat_rate: exposureRate(slotIdRepeats, slotIdComparisons),
      slot_family_repeat_rate: exposureRate(
        slotFamilyRepeats,
        slotFamilyComparisons,
      ),
    },
    set_b: {
      comparisons: setASetBComparisons,
      any_overlap: setASetBAnyOverlap,
      any_overlap_rate: exposureRate(setASetBAnyOverlap, setASetBComparisons),
      full_reuse: setASetBFullReuse,
      full_reuse_rate: exposureRate(setASetBFullReuse, setASetBComparisons),
    },
    family_diversity: {
      same_family_with_in_band_alternative: familyDiversityViolations,
    },
    ap_vs_big_fish: {
      comparisons: apBfComparisons,
      identical_sets: apBfIdenticalSets,
      identical_rate: exposureRate(apBfIdenticalSets, apBfComparisons),
    },
    exposure: {
      total_selected_slots: selectedSlots,
      top_pick_total_slots: totalTopSlots,
      honorable_total_slots: totalHonorableSlots,
      top_pick_by_side: topPickExposure,
      honorable_by_side: honorableExposure,
      selected_by_side: topEntries(selectedBySide, 30),
      selected_by_species: topEntries(selectedBySpecies, 60),
      selected_by_water: topEntries(selectedByWater, 40),
      selected_by_goal: topEntries(selectedByGoal, 40),
      selected_by_slot: topEntries(selectedBySlot, 40),
      selected_family_by_slot: topEntries(selectedByFamilySlot, 40),
    },
    broad_fly_watch: {
      fly_slots: flySlots,
      broad_fly_slots: broadFlySlots,
      broad_fly_share: exposureRate(broadFlySlots, flySlots),
      broad_fly_by_id: topEntries(broadFlySelected, 30),
    },
    samples: {
      exact_repeats: exactRepeatSamples,
      slot_id_repeats: slotRepeatSamples,
      slot_family_repeats: familyRepeatSamples,
      set_a_set_b_overlap: setASetBOverlapSamples,
      family_diversity: familyDiversitySamples,
      ap_vs_big_fish_identical: identicalGoalSamples,
    },
  };
}

function printExposureAuditAndExit(
  rows: readonly SeasonalRowV4[],
  templates: readonly AuditScenarioTemplate[],
  exposureDays: number,
  json: boolean,
) {
  const summary = collectExposureAudit(rows, templates, exposureDays);
  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("Daily-picks exposure and variety audit");
  console.log(`Rows: ${summary.rows}`);
  console.log(`Scenarios: ${summary.scenarios.join(", ")}`);
  console.log(`Exposure days: ${summary.exposure_days}`);
  console.log(`Contexts: ${summary.contexts}; day runs: ${summary.day_runs}`);
  console.log(
    `Adjacent Set A exact repeats: ${summary.adjacent.set_a_exact_repeats}/${summary.adjacent.comparisons} (${
      summary.adjacent.set_a_exact_repeat_rate.toFixed(3)
    })`,
  );
  console.log(
    `Adjacent Set B exact repeats: ${summary.adjacent.set_b_exact_repeats}/${summary.adjacent.comparisons} (${
      summary.adjacent.set_b_exact_repeat_rate.toFixed(3)
    })`,
  );
  console.log(
    `Slot ID/family repeat rates: ${
      summary.adjacent.slot_id_repeat_rate.toFixed(3)
    }/${summary.adjacent.slot_family_repeat_rate.toFixed(3)}`,
  );
  console.log(
    `Set A/B overlap: ${summary.set_b.any_overlap}/${summary.set_b.comparisons} (${
      summary.set_b.any_overlap_rate.toFixed(3)
    }); full reuse ${summary.set_b.full_reuse}`,
  );
  console.log(
    `AP/BF identical: ${summary.ap_vs_big_fish.identical_sets}/${summary.ap_vs_big_fish.comparisons} (${
      summary.ap_vs_big_fish.identical_rate.toFixed(3)
    })`,
  );
  console.log(
    `Family diversity violations: ${summary.family_diversity.same_family_with_in_band_alternative}`,
  );
  console.log(
    `Broad fly watch: ${summary.broad_fly_watch.broad_fly_slots}/${summary.broad_fly_watch.fly_slots} (${
      summary.broad_fly_watch.broad_fly_share.toFixed(3)
    })`,
  );
  console.log("Top-pick exposure:");
  for (const [id, count] of summary.exposure.top_pick_by_side) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("Honorable exposure:");
  for (const [id, count] of summary.exposure.honorable_by_side) {
    console.log(`  ${id}: ${count}`);
  }
  const sampleSections = Object.entries(summary.samples).filter(([, values]) =>
    values.length > 0
  );
  if (sampleSections.length > 0) {
    console.log("Sample review queues:");
    for (const [label, values] of sampleSections) {
      console.log(`  ${label}:`);
      for (const value of values.slice(0, 20)) console.log(`    ${value}`);
    }
  }
}

function main() {
  const args = parseArgs(Deno.args);
  const templates = SCENARIOS.filter((template) =>
    args.scenario == null || template.key === args.scenario
  );
  if (templates.length === 0) {
    throw new Error(`No audit scenario matched '${args.scenario}'`);
  }

  const rows = ALL_ROWS.filter((row) =>
    (args.species == null || row.species === args.species) &&
    (args.waterType == null || row.water_type === args.waterType) &&
    (args.month == null || row.month === args.month) &&
    (!args.launchMonths || isLaunchMonth(row.month)) &&
    (args.region == null || row.region_key === args.region)
  );
  if (rows.length === 0) {
    throw new Error("No seasonal rows matched the supplied filters");
  }
  if (args.rowSanity) {
    printRowSanityAndExit(rows, args.json);
    return;
  }
  if (args.envelopeAudit) {
    printEnvelopeAuditAndExit(rows, args.json);
    return;
  }
  if (args.watchlistTrace) {
    printWatchlistTraceAndExit(rows, args.json);
    return;
  }
  if (args.broadFlyAudit) {
    printBroadFlyAuditAndExit(rows, templates, args.json);
    return;
  }
  if (args.exposureAudit) {
    printExposureAuditAndExit(rows, templates, args.exposureDays, args.json);
    return;
  }

  const lurePoolCounts: number[] = [];
  const flyPoolCounts: number[] = [];
  const failures: string[] = [];
  const thinPools: string[] = [];
  const geometryMismatches: string[] = [];
  const surfaceLeaks: string[] = [];
  const surfaceCautionSelections: string[] = [];
  const taglessContexts: string[] = [];
  const goalReasonlessContexts: string[] = [];
  const setBReuseContexts: string[] = [];
  const identicalGoalContexts: string[] = [];
  const repeatedDayContexts: string[] = [];
  const familyDiversityContexts: string[] = [];
  const setBFamilyDiversityContexts: string[] = [];
  const selectedExposure = new Map<string, number>();
  const topExposure = new Map<string, number>();

  let contexts = 0;
  let selectedCount = 0;
  let selectionsWithConditionReason = 0;
  let selectionsWithGoalReason = 0;
  let goalComparisons = 0;
  let setBComparisons = 0;
  let lureSameFamilySelections = 0;
  let flySameFamilySelections = 0;
  let lureSameFamilyWithAlternative = 0;
  let flySameFamilyWithAlternative = 0;
  let setBLureSameFamilyWithAlternative = 0;
  let setBFlySameFamilyWithAlternative = 0;

  for (const row of rows) {
    for (const template of templates) {
      if (!appliesTo(template, row)) continue;

      const goalRuns = new Map<Goal, SelectionRun>();

      for (const goal of GOALS) {
        contexts++;
        const seed = `quality-audit|${rowKey(row)}|${template.key}|${goal}`;
        try {
          const runA = runSelection({
            row,
            template,
            goal,
            variant: "A",
            seed,
          });
          lurePoolCounts.push(runA.lureScores.length);
          flyPoolCounts.push(runA.flyScores.length);
          goalRuns.set(goal, runA);

          if (runA.lureScores.length < 4 || runA.flyScores.length < 4) {
            thinPools.push(
              `${
                rowKey(row)
              } ${template.key} ${goal}: lures=${runA.lureScores.length}, flies=${runA.flyScores.length}`,
            );
          }

          const selectedSurfaces = runA.selected.filter((score) =>
            score.profile.is_surface
          );
          const selectedGeometryMismatches = runA.selected.filter((score) =>
            !selectedProfileFitsRow(score, row)
          );
          if (selectedGeometryMismatches.length > 0) {
            geometryMismatches.push(
              `${rowKey(row)} ${template.key} ${goal}: ${
                selectedGeometryMismatches.map((score) =>
                  `${score.profile.id}[${score.profile.column}/${score.profile.primary_pace}${
                    score.profile.secondary_pace == null
                      ? ""
                      : `+${score.profile.secondary_pace}`
                  }]`
                ).join(",")
              } row=${row.column_range.join("/")}/${row.pace_range.join("/")}`,
            );
          }
          if (
            selectedSurfaces.length > 0 &&
            (!row.surface_seasonally_possible ||
              runA.scenario.surface_daily_gate === "closed")
          ) {
            surfaceLeaks.push(
              `${rowKey(row)} ${template.key} ${goal}: ${
                selectedSurfaces.map((score) => score.profile.id).join(",")
              }`,
            );
          }
          if (
            selectedSurfaces.length > 0 &&
            runA.scenario.surface_daily_gate === "caution"
          ) {
            surfaceCautionSelections.push(
              `${rowKey(row)} ${template.key} ${goal}: ${
                selectedSurfaces.map((score) => score.profile.id).join(",")
              }`,
            );
          }

          for (const selected of runA.selected) {
            selectedCount++;
            increment(
              selectedExposure,
              `${selected.side}:${selected.profile.id}`,
            );
            if (hasReason(selected, "condition_tag:")) {
              selectionsWithConditionReason++;
            }
            if (hasReason(selected, `goal:${goal}:`)) {
              selectionsWithGoalReason++;
            }
          }
          increment(topExposure, `lure:${runA.lureIds[0]}`);
          increment(topExposure, `fly:${runA.flyIds[0]}`);

          if (
            template.scenario_tags.length > 0 &&
            !runA.selected.some((score) => hasReason(score, "condition_tag:"))
          ) {
            taglessContexts.push(`${rowKey(row)} ${template.key} ${goal}`);
          }
          if (
            !runA.selected.some((score) => hasReason(score, `goal:${goal}:`))
          ) {
            goalReasonlessContexts.push(
              `${rowKey(row)} ${template.key} ${goal}`,
            );
          }

          if (!runA.familyDiversity.lures.different_family_selected) {
            lureSameFamilySelections++;
            if (
              runA.familyDiversity.lures.different_family_available_in_band
            ) {
              lureSameFamilyWithAlternative++;
              familyDiversityContexts.push(
                `${
                  rowKey(row)
                } ${template.key} ${goal} lures: family=${runA.familyDiversity.lures.top_family_group} ids=${
                  runA.lureIds.join(",")
                }`,
              );
            }
          }
          if (!runA.familyDiversity.flies.different_family_selected) {
            flySameFamilySelections++;
            if (
              runA.familyDiversity.flies.different_family_available_in_band
            ) {
              flySameFamilyWithAlternative++;
              familyDiversityContexts.push(
                `${
                  rowKey(row)
                } ${template.key} ${goal} flies: family=${runA.familyDiversity.flies.top_family_group} ids=${
                  runA.flyIds.join(",")
                }`,
              );
            }
          }

          const runB = runSelection({
            row,
            template,
            goal,
            variant: "B",
            seed,
            avoidLureIds: runA.lureIds,
            avoidFlyIds: runA.flyIds,
          });
          setBComparisons++;
          const lureOverlap = runB.lureIds.filter((id) =>
            runA.lureIds.includes(id)
          )
            .length;
          const flyOverlap = runB.flyIds.filter((id) =>
            runA.flyIds.includes(id)
          )
            .length;
          if (
            (runA.lureScores.length > 2 && lureOverlap === 2) ||
            (runA.flyScores.length > 2 && flyOverlap === 2)
          ) {
            setBReuseContexts.push(
              `${
                rowKey(row)
              } ${template.key} ${goal}: lureOverlap=${lureOverlap}, flyOverlap=${flyOverlap}`,
            );
          }
          if (
            !runB.familyDiversity.lures.different_family_selected &&
            runB.familyDiversity.lures.different_family_available_in_band
          ) {
            setBLureSameFamilyWithAlternative++;
            setBFamilyDiversityContexts.push(
              `${
                rowKey(row)
              } ${template.key} ${goal} lures: family=${runB.familyDiversity.lures.top_family_group} ids=${
                runB.lureIds.join(",")
              }`,
            );
          }
          if (
            !runB.familyDiversity.flies.different_family_selected &&
            runB.familyDiversity.flies.different_family_available_in_band
          ) {
            setBFlySameFamilyWithAlternative++;
            setBFamilyDiversityContexts.push(
              `${
                rowKey(row)
              } ${template.key} ${goal} flies: family=${runB.familyDiversity.flies.top_family_group} ids=${
                runB.flyIds.join(",")
              }`,
            );
          }

          let previousSet: string | null = null;
          for (let day = 0; day < args.exposureDays; day++) {
            const dayRun = runSelection({
              row,
              template,
              goal,
              variant: "A",
              seed,
              dayOffset: day,
            });
            const currentSet = setKey(dayRun);
            if (previousSet === currentSet) {
              repeatedDayContexts.push(
                `${rowKey(row)} ${template.key} ${goal}: repeated ${
                  stableDate(day - 1)
                } -> ${stableDate(day)}`,
              );
              break;
            }
            previousSet = currentSet;
          }
        } catch (error) {
          failures.push(
            `${rowKey(row)} ${template.key} ${goal}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }

      const allPurpose = goalRuns.get("all_purpose");
      const bigFish = goalRuns.get("big_fish");
      if (allPurpose && bigFish) {
        goalComparisons++;
        if (setKey(allPurpose) === setKey(bigFish)) {
          identicalGoalContexts.push(`${rowKey(row)} ${template.key}`);
        }
      }
    }
  }

  if (contexts === 0) {
    throw new Error(
      "No row/scenario/goal contexts matched the supplied filters",
    );
  }

  const summary = {
    filters: args,
    rows: rows.length,
    scenarios: templates.map((template) => template.key),
    contexts,
    failures: failures.length,
    pool_health: {
      lure_min: Math.min(...lurePoolCounts),
      lure_p10: percentile(lurePoolCounts, 0.1),
      lure_median: percentile(lurePoolCounts, 0.5),
      fly_min: Math.min(...flyPoolCounts),
      fly_p10: percentile(flyPoolCounts, 0.1),
      fly_median: percentile(flyPoolCounts, 0.5),
      thin_contexts_lt4_per_side: thinPools.length,
    },
    condition_reason_rate: selectedCount === 0
      ? 0
      : selectionsWithConditionReason / selectedCount,
    goal_reason_rate: selectedCount === 0
      ? 0
      : selectionsWithGoalReason / selectedCount,
    tagless_contexts: taglessContexts.length,
    goal_reasonless_contexts: goalReasonlessContexts.length,
    selected_geometry_mismatches: geometryMismatches.length,
    surface_leaks: surfaceLeaks.length,
    surface_caution_selections: surfaceCautionSelections.length,
    set_b_reuse_reviews: setBReuseContexts.length,
    set_b_comparisons: setBComparisons,
    family_diversity: {
      lure_same_family_selections: lureSameFamilySelections,
      fly_same_family_selections: flySameFamilySelections,
      lure_same_family_with_in_band_alternative: lureSameFamilyWithAlternative,
      fly_same_family_with_in_band_alternative: flySameFamilyWithAlternative,
      set_b_lure_same_family_with_in_band_alternative:
        setBLureSameFamilyWithAlternative,
      set_b_fly_same_family_with_in_band_alternative:
        setBFlySameFamilyWithAlternative,
    },
    identical_goal_sets: identicalGoalContexts.length,
    goal_comparisons: goalComparisons,
    repeated_adjacent_day_sets: repeatedDayContexts.length,
    exposure_days: args.exposureDays,
    top_selected_ids: topEntries(topExposure, 12),
    most_selected_ids: topEntries(selectedExposure, 12),
    samples: {
      failures: failures.slice(0, 20),
      thin_pools: thinPools.slice(0, 20),
      selected_geometry_mismatches: geometryMismatches.slice(0, 20),
      surface_leaks: surfaceLeaks.slice(0, 20),
      surface_caution_selections: surfaceCautionSelections.slice(0, 20),
      tagless_contexts: taglessContexts.slice(0, 20),
      goal_reasonless_contexts: goalReasonlessContexts.slice(0, 20),
      set_b_reuse_reviews: setBReuseContexts.slice(0, 20),
      family_diversity_reviews: familyDiversityContexts.slice(0, 20),
      set_b_family_diversity_reviews: setBFamilyDiversityContexts.slice(
        0,
        20,
      ),
      identical_goal_sets: identicalGoalContexts.slice(0, 20),
      repeated_adjacent_day_sets: repeatedDayContexts.slice(0, 20),
    },
  };

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("Daily-picks quality harness summary");
  console.log(`Rows: ${summary.rows}`);
  console.log(`Scenarios: ${summary.scenarios.join(", ")}`);
  console.log(`Row/scenario/goal contexts: ${summary.contexts}`);
  console.log(`Failures: ${summary.failures}`);
  console.log(
    `Pool health: lure min/p10/median ${summary.pool_health.lure_min}/${summary.pool_health.lure_p10}/${summary.pool_health.lure_median}; ` +
      `fly min/p10/median ${summary.pool_health.fly_min}/${summary.pool_health.fly_p10}/${summary.pool_health.fly_median}; ` +
      `thin <4 per side ${summary.pool_health.thin_contexts_lt4_per_side}`,
  );
  console.log(
    `Selected condition-reason rate: ${
      summary.condition_reason_rate.toFixed(3)
    }; ` +
      `goal-reason rate: ${summary.goal_reason_rate.toFixed(3)}`,
  );
  console.log(
    `Geometry mismatches: ${summary.selected_geometry_mismatches}; Surface leaks: ${summary.surface_leaks}; ` +
      `caution surface selections: ${summary.surface_caution_selections}; Set B reuse reviews: ${summary.set_b_reuse_reviews}/${summary.set_b_comparisons}; ` +
      `identical all-purpose/big-fish sets: ${summary.identical_goal_sets}/${summary.goal_comparisons}; ` +
      `adjacent-day repeated sets over ${summary.exposure_days} days: ${summary.repeated_adjacent_day_sets}`,
  );
  console.log(
    `Family diversity: Set A same-family with in-band alternative lures=${summary.family_diversity.lure_same_family_with_in_band_alternative}, ` +
      `flies=${summary.family_diversity.fly_same_family_with_in_band_alternative}; ` +
      `Set B lures=${summary.family_diversity.set_b_lure_same_family_with_in_band_alternative}, ` +
      `flies=${summary.family_diversity.set_b_fly_same_family_with_in_band_alternative}`,
  );
  console.log("Top selected IDs:");
  for (const [id, count] of summary.top_selected_ids) {
    console.log(`  ${id}: ${count}`);
  }
  console.log("Most selected IDs across all slots:");
  for (const [id, count] of summary.most_selected_ids) {
    console.log(`  ${id}: ${count}`);
  }

  const sampleSections = Object.entries(summary.samples).filter(([, values]) =>
    values.length > 0
  );
  if (sampleSections.length > 0) {
    console.log("Sample review queues:");
    for (const [label, values] of sampleSections) {
      console.log(`  ${label}:`);
      for (const value of values) console.log(`    ${value}`);
    }
  }
}

if (import.meta.main) {
  main();
}
