#!/usr/bin/env -S deno run --allow-read --allow-write

import { runRecommender } from "../../supabase/functions/_shared/recommenderEngine/runRecommender.ts";
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import type { WaterClarity, RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { RankedFamily, RecommenderResponse } from "../../supabase/functions/_shared/recommenderEngine/contracts/output.ts";
import type { ForageMode } from "../../supabase/functions/_shared/recommenderEngine/contracts/behavior.ts";
import { SPECIES_META, type SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { LURE_FAMILIES } from "../../supabase/functions/_shared/recommenderEngine/config/lureFamilies.ts";
import { FLY_FAMILIES } from "../../supabase/functions/_shared/recommenderEngine/config/flyFamilies.ts";
import type {
  ExpandedScenario,
  OutputBundle,
  ScenarioSeed,
  ThermalVariant,
} from "./generateHistoricalScenarios.ts";

type AuditSeverity = "high" | "medium" | "low";

type AuditFlag = {
  code: string;
  severity: AuditSeverity;
  detail: string;
};

type ScenarioAuditRow = {
  scenario: {
    id: string;
    seed_id: string;
    fishery_key: string;
    fishery_label: string;
    fishery_group: string;
    species: SpeciesGroup;
    species_display: string;
    context: RecommenderRequest["context"];
    month: number;
    local_date: string;
    thermal_variant: ThermalVariant;
    water_clarity: WaterClarity;
    expected_forage_modes: ForageMode[];
    archive_summary: ScenarioSeed["archive_summary"];
  };
  response: {
    thermal: {
      final_score: number | null;
      band: string;
      metabolic_context: string;
      trend: string;
      shock: string;
    };
    behavior_summary: RecommenderResponse["behavior"]["behavior_summary"];
    activity: RecommenderResponse["behavior"]["activity"];
    depth_lane: RecommenderResponse["behavior"]["depth_lane"];
    forage_mode: RecommenderResponse["behavior"]["forage_mode"];
    secondary_forage?: RecommenderResponse["behavior"]["secondary_forage"];
    seasonal_flag?: RecommenderResponse["behavior"]["seasonal_flag"];
    presentation: RecommenderResponse["presentation"];
    lure_rankings: RankedFamily[];
    fly_rankings: RankedFamily[];
    confidence: RecommenderResponse["confidence"];
  };
  audit: {
    flag_count: number;
    high_flags: number;
    medium_flags: number;
    low_flags: number;
    flags: AuditFlag[];
  };
};

type ThermalGroupMember = {
  row: ScenarioAuditRow;
  scenario: ExpandedScenario;
};

type SummarySignature = {
  signature: string;
  count: number;
  examples: string[];
};

const DEFAULT_INPUT =
  "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/recommenderAudit/generated/historical-scenarios.json";
const DEFAULT_OUTPUT =
  "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/recommenderAudit/generated/historical-audit-results.jsonl";
const DEFAULT_SUMMARY =
  "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/recommenderAudit/generated/historical-audit-report.md";
const TOP_N = 3;
const FORAGE_WINDOW = 2;
const BANNED_EXAMPLE_NAMES = new Set([
  "craft fur streamer",
  "lead head jig",
  "medium diver",
  "dahlberg diver",
  "merkin",
  "crazy charlie",
]);

function parsePathArg(args: string[], flag: "--input=" | "--output=" | "--summary="): string {
  const arg = args.find((value) => value.startsWith(flag));
  if (!arg) {
    if (flag === "--input=") return DEFAULT_INPUT;
    if (flag === "--output=") return DEFAULT_OUTPUT;
    return DEFAULT_SUMMARY;
  }
  return arg.slice(flag.length);
}

function parseLimit(args: string[]): number | null {
  const arg = args.find((value) => value.startsWith("--limit="));
  if (!arg) return null;
  const parsed = Number.parseInt(arg.slice("--limit=".length), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function readBundle(inputPath: string): OutputBundle {
  return JSON.parse(Deno.readTextFileSync(inputPath)) as OutputBundle;
}

function familyMeta(familyId: string) {
  if (familyId in LURE_FAMILIES) return LURE_FAMILIES[familyId as keyof typeof LURE_FAMILIES];
  return FLY_FAMILIES[familyId as keyof typeof FLY_FAMILIES];
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function matchesExpectedForage(familyId: string, expected: readonly ForageMode[]): boolean {
  if (expected.length === 0) return true;
  const meta = familyMeta(familyId);
  return meta.forage_affinity.some((mode) => expected.includes(mode));
}

function familyPrimaryForage(familyId: string): string {
  const meta = familyMeta(familyId);
  return meta.forage_affinity[0] ?? "mixed";
}

function resolveRankedImitation(
  family: RankedFamily,
  behavior: ScenarioAuditRow["response"],
): ForageMode | null {
  const meta = familyMeta(family.family_id);
  const breakdown = family.score_breakdown ?? [];

  if (
    breakdown.some((item) => item.code === "forage_primary_match") &&
    meta.forage_affinity.includes(behavior.forage_mode)
  ) {
    return behavior.forage_mode;
  }

  if (
    behavior.secondary_forage &&
    breakdown.some((item) => item.code === "forage_secondary_match") &&
    meta.forage_affinity.includes(behavior.secondary_forage)
  ) {
    return behavior.secondary_forage;
  }

  if (meta.forage_affinity.length === 1) {
    return meta.forage_affinity[0] ?? null;
  }

  return familyPrimaryForage(family.family_id) as ForageMode;
}

function parseColorLabel(colorGuide: string): string {
  const [label] = colorGuide.split(":");
  return label.trim();
}

function makeRequest(seed: ScenarioSeed, scenario: ExpandedScenario): RecommenderRequest {
  const sharedReq = buildSharedEngineRequestFromEnvData(
    seed.latitude,
    seed.longitude,
    seed.local_date,
    seed.local_timezone,
    seed.context,
    seed.env_data,
    0,
  );

  return {
    location: {
      latitude: seed.latitude,
      longitude: seed.longitude,
      state_code: seed.state_code,
      region_key: seed.region_key,
      local_date: seed.local_date,
      local_timezone: seed.local_timezone,
      month: seed.month,
    },
    species: scenario.species,
    context: seed.context,
    water_clarity: scenario.water_clarity,
    env_data: sharedReq.environment as Record<string, unknown>,
  };
}

function pushFlag(flags: AuditFlag[], code: string, severity: AuditSeverity, detail: string) {
  flags.push({ code, severity, detail });
}

function auditForage(row: ScenarioAuditRow, flags: AuditFlag[]) {
  const expected = row.scenario.expected_forage_modes;
  if (expected.length === 0) return;

  const topLures = row.response.lure_rankings.slice(0, FORAGE_WINDOW);
  const topFlies = row.response.fly_rankings.slice(0, FORAGE_WINDOW);
  const lureMatch = topLures.some((family) => matchesExpectedForage(family.family_id, expected));
  const flyMatch = topFlies.some((family) => matchesExpectedForage(family.family_id, expected));
  const overallMatch = [...topLures, ...topFlies].some((family) => matchesExpectedForage(family.family_id, expected));

  if (!overallMatch) {
    pushFlag(
      flags,
      "FORAGE_MISSING_TOP_WINDOW",
      "high",
      `None of the top ${FORAGE_WINDOW} lure or fly families overlap expected forage ${expected.join(", ")}.`,
    );
  } else {
    const lureTop = row.response.lure_rankings[0];
    const flyTop = row.response.fly_rankings[0];
    if (
      lureTop &&
      flyTop &&
      !matchesExpectedForage(lureTop.family_id, expected) &&
      !matchesExpectedForage(flyTop.family_id, expected)
    ) {
      pushFlag(
        flags,
        "FORAGE_NOT_LEADING",
        "medium",
        `Top lure (${lureTop.display_name}) and top fly (${flyTop.display_name}) miss expected forage ${expected.join(", ")} even though a lower-ranked family matches it.`,
      );
    }

    if (!lureMatch || !flyMatch) {
      pushFlag(
        flags,
        "FORAGE_ONE_TAB_THIN",
        "low",
        `Expected forage ${expected.join(", ")} is only showing clearly in ${lureMatch ? "lures" : "flies"} within the top ${FORAGE_WINDOW}.`,
      );
    }
  }
}

function auditContradictions(rankings: RankedFamily[], gearLabel: "lure" | "fly", flags: AuditFlag[]) {
  const top = rankings[0];
  if (!top || !top.score_breakdown) return;

  const majorPenaltyCodes = new Set(["forage_mismatch", "topwater_contradiction"]);
  const cautionPenaltyCodes = new Set([
    "activity_mismatch",
    "clarity_mismatch",
    "current_mismatch",
    "tide_mismatch",
    "cover_mismatch",
    "noise_too_loud",
    "noise_too_subtle",
    "flash_too_heavy",
    "flash_too_subtle",
    "depth_mismatch",
    "speed_mismatch",
    "profile_too_large",
    "profile_too_small",
  ]);

  const penalties = top.score_breakdown.filter((item) => item.direction === "penalty");
  const major = penalties.filter((item) => majorPenaltyCodes.has(item.code));
  const caution = penalties.filter((item) => cautionPenaltyCodes.has(item.code));

  if (major.length > 0) {
    pushFlag(
      flags,
      `${gearLabel.toUpperCase()}_TOP_PICK_MAJOR_CONTRADICTION`,
      "high",
      `${gearLabel} top pick ${top.display_name} still won despite ${major.map((item) => item.code).join(", ")}.`,
    );
  } else if (caution.length >= 3) {
    pushFlag(
      flags,
      `${gearLabel.toUpperCase()}_TOP_PICK_STACKED_PENALTIES`,
      "medium",
      `${gearLabel} top pick ${top.display_name} carries several penalties: ${caution.map((item) => item.code).slice(0, 4).join(", ")}.`,
    );
  }
}

function auditColors(row: ScenarioAuditRow, flags: AuditFlag[]) {
  const groups = [
    { label: "lure", rankings: row.response.lure_rankings },
    { label: "fly", rankings: row.response.fly_rankings },
  ] as const;

  for (const group of groups) {
    const top = group.rankings.slice(0, TOP_N);
    if (top.length < TOP_N) continue;

    const colorLabels = top.map((family) => parseColorLabel(family.color_guide));
    if (unique(colorLabels).length === 1) {
      pushFlag(
        flags,
        `${group.label.toUpperCase()}_COLOR_COLLAPSE`,
        "medium",
        `All top ${TOP_N} ${group.label} picks use the same color family: ${colorLabels[0]}.`,
      );
    }

    for (const family of top) {
      const label = parseColorLabel(family.color_guide).toLowerCase();
      const forage = resolveRankedImitation(family, row.response);
      if (forage === "baitfish" && label.includes("craw")) {
        pushFlag(
          flags,
          `${group.label.toUpperCase()}_BAITFISH_COLOR_MISMATCH`,
          "high",
          `${family.display_name} is a baitfish-oriented family but got a craw-oriented color guide.`,
        );
      }
      if (forage === "crawfish" && (label.includes("shad") || label.includes("silver"))) {
        pushFlag(
          flags,
          `${group.label.toUpperCase()}_CRAW_COLOR_MISMATCH`,
          "high",
          `${family.display_name} is a craw-oriented family but got a shad/silver color guide.`,
        );
      }
      if ((forage === "shrimp" || forage === "crab") && label.includes("chartreuse")) {
        pushFlag(
          flags,
          `${group.label.toUpperCase()}_INSHORE_COLOR_TOO_GENERIC`,
          "medium",
          `${family.display_name} is ${forage}-oriented but got a generic bright dirty-water color guide.`,
        );
      }
    }
  }
}

function auditExamples(row: ScenarioAuditRow, flags: AuditFlag[]) {
  const groups = [
    { label: "lure", rankings: row.response.lure_rankings },
    { label: "fly", rankings: row.response.fly_rankings },
  ] as const;

  for (const group of groups) {
    const seen = new Map<string, number>();

    for (const family of group.rankings.slice(0, TOP_N)) {
      for (const example of family.examples) {
        const normalized = normalizeText(example);
        seen.set(normalized, (seen.get(normalized) ?? 0) + 1);

        if (BANNED_EXAMPLE_NAMES.has(normalized)) {
          pushFlag(
            flags,
            `${group.label.toUpperCase()}_OBSCURE_EXAMPLE`,
            "high",
            `${family.display_name} includes example "${example}" which is not aligned with the common-name audit standard.`,
          );
        }

        if (/\b(style bait|pattern)\b/.test(normalized)) {
          pushFlag(
            flags,
            `${group.label.toUpperCase()}_GENERIC_EXAMPLE_NAME`,
            "low",
            `${family.display_name} includes a generic example label "${example}" instead of a common angler-facing name.`,
          );
        }
      }
    }

    const repeated = [...seen.entries()].filter(([, count]) => count > 1);
    if (repeated.length > 0) {
      pushFlag(
        flags,
        `${group.label.toUpperCase()}_EXAMPLE_REPETITION`,
        "low",
        `Repeated ${group.label} examples inside the top ${TOP_N}: ${repeated.map(([value]) => value).slice(0, 3).join(", ")}.`,
      );
    }
  }
}

function auditBehavior(row: ScenarioAuditRow, flags: AuditFlag[]) {
  const lines = row.response.behavior_summary.map((line) => normalizeText(line));
  if (unique(lines).length < lines.length) {
    pushFlag(
      flags,
      "BEHAVIOR_DUPLICATE_LINES",
      "medium",
      "Behavior summary repeats one of its lines instead of describing distinct behavior cues.",
    );
  }

  if (
    row.response.activity !== "inactive" &&
    row.response.activity !== "low" &&
    row.response.lure_rankings[0]?.score_breakdown?.some((item) => item.code === "topwater_contradiction")
  ) {
    pushFlag(
      flags,
      "BEHAVIOR_RECOMMENDATION_TENSION",
      "low",
      "Behavior says fish are willing, but the top lure still carries a low-and-bottom-forage contradiction.",
    );
  }
}

function buildScenarioRow(seed: ScenarioSeed, scenario: ExpandedScenario, response: RecommenderResponse): ScenarioAuditRow {
  const sharedReq = buildSharedEngineRequestFromEnvData(
    seed.latitude,
    seed.longitude,
    seed.local_date,
    seed.local_timezone,
    seed.context,
    seed.env_data,
    0,
  );
  const analysis = analyzeSharedConditions(sharedReq);

  return {
    scenario: {
      id: scenario.id,
      seed_id: scenario.seed_id,
      fishery_key: scenario.fishery_key,
      fishery_label: seed.fishery_label,
      fishery_group: seed.fishery_group,
      species: scenario.species,
      species_display: SPECIES_META[scenario.species].display_name,
      context: seed.context,
      month: seed.month,
      local_date: seed.local_date,
      thermal_variant: seed.thermal_variant,
      water_clarity: scenario.water_clarity,
      expected_forage_modes: scenario.expected_forage_modes,
      archive_summary: seed.archive_summary,
    },
    response: {
      thermal: {
        final_score: analysis.norm.normalized.temperature?.final_score ?? null,
        band: analysis.condition_context.temperature_band,
        metabolic_context: analysis.condition_context.temperature_metabolic_context,
        trend: analysis.condition_context.temperature_trend,
        shock: analysis.condition_context.temperature_shock,
      },
      behavior_summary: response.behavior.behavior_summary,
      activity: response.behavior.activity,
      depth_lane: response.behavior.depth_lane,
      forage_mode: response.behavior.forage_mode,
      secondary_forage: response.behavior.secondary_forage,
      seasonal_flag: response.behavior.seasonal_flag,
      presentation: response.presentation,
      lure_rankings: response.lure_rankings,
      fly_rankings: response.fly_rankings,
      confidence: response.confidence,
    },
    audit: {
      flag_count: 0,
      high_flags: 0,
      medium_flags: 0,
      low_flags: 0,
      flags: [],
    },
  };
}

function runScenarioAudit(seed: ScenarioSeed, scenario: ExpandedScenario): ScenarioAuditRow {
  const req = makeRequest(seed, scenario);
  const response = runRecommender(req);
  const row = buildScenarioRow(seed, scenario, response);
  const flags: AuditFlag[] = [];

  auditForage(row, flags);
  auditContradictions(row.response.lure_rankings, "lure", flags);
  auditContradictions(row.response.fly_rankings, "fly", flags);
  auditColors(row, flags);
  auditExamples(row, flags);
  auditBehavior(row, flags);

  row.audit.flags = flags;
  row.audit.flag_count = flags.length;
  row.audit.high_flags = flags.filter((flag) => flag.severity === "high").length;
  row.audit.medium_flags = flags.filter((flag) => flag.severity === "medium").length;
  row.audit.low_flags = flags.filter((flag) => flag.severity === "low").length;

  return row;
}

function attachThermalResponsivenessFlags(rows: ScenarioAuditRow[]) {
  const groups = new Map<string, ThermalGroupMember[]>();

  for (const row of rows) {
    const key = [
      row.scenario.fishery_key,
      row.scenario.species,
      row.scenario.context,
      row.scenario.month,
      row.scenario.water_clarity,
    ].join("|");

    const scenario: ExpandedScenario = {
      id: row.scenario.id,
      seed_id: row.scenario.seed_id,
      fishery_key: row.scenario.fishery_key,
      species: row.scenario.species,
      water_clarity: row.scenario.water_clarity,
      expected_forage_modes: row.scenario.expected_forage_modes,
      species_tier: null,
    };
    const members = groups.get(key) ?? [];
    members.push({ row, scenario });
    groups.set(key, members);
  }

  for (const members of groups.values()) {
    if (members.length < 3) continue;
    const sorted = [...members].sort((a, b) =>
      a.row.scenario.thermal_variant.localeCompare(b.row.scenario.thermal_variant)
    );
    const thermalByVariant = new Map(sorted.map((member) => [member.row.scenario.thermal_variant, member.row]));
    const cold = thermalByVariant.get("cold");
    const normal = thermalByVariant.get("normal");
    const warm = thermalByVariant.get("warm");
    if (!cold || !normal || !warm) continue;

    const tempSpan = warm.scenario.archive_summary.daily_mean_air_f - cold.scenario.archive_summary.daily_mean_air_f;
    const thermalThreshold = SPECIES_META[cold.scenario.species].water_type === "saltwater" ? 8 : 6;
    if (tempSpan < thermalThreshold) continue;

    const signatures = [cold, normal, warm].map((row) =>
      [
        row.response.activity,
        row.response.presentation.speed,
        row.response.presentation.depth_target,
        row.response.forage_mode,
        row.response.presentation.topwater_viable ? "topwater_open" : "topwater_closed",
        row.response.presentation.motion,
        row.response.lure_rankings[0]?.family_id ?? "none",
        row.response.fly_rankings[0]?.family_id ?? "none",
      ].join("|")
    );
    const uniqueSignatures = unique(signatures);

    const thermalBands = unique([cold, normal, warm].map((row) => row.response.thermal.band));
    const metabolicContexts = unique([cold, normal, warm].map((row) => row.response.thermal.metabolic_context));
    const scoreValues = [cold, normal, warm]
      .map((row) => row.response.thermal.final_score)
      .filter((value): value is number => value !== null);
    const scoreSpan = scoreValues.length > 1
      ? Math.max(...scoreValues) - Math.min(...scoreValues)
      : 0;
    const allColdLimited = [cold, normal, warm].every((row) =>
      row.response.thermal.metabolic_context === "cold_limited" ||
      row.response.thermal.band === "very_cold" ||
      row.response.thermal.band === "cool"
    );
    const allWinterPosture = [cold, normal, warm].every((row) =>
      (row.response.activity === "inactive" || row.response.activity === "low") &&
      (row.response.presentation.speed === "dead_slow" || row.response.presentation.speed === "slow") &&
      (row.response.presentation.depth_target === "near_bottom" || row.response.presentation.depth_target === "bottom")
    );

    if (thermalBands.length === 1 && metabolicContexts.length === 1 && scoreSpan < 0.75) {
      continue;
    }

    if (cold.scenario.month <= 2 && allColdLimited && allWinterPosture) {
      continue;
    }

    if (cold.scenario.month <= 1 && allWinterPosture && warm.scenario.archive_summary.daily_mean_air_f <= 40) {
      continue;
    }

    if (uniqueSignatures.length === 1) {
      const detail =
        `Cold/normal/warm variants stayed flat across a ${tempSpan.toFixed(1)}F mean-air spread for ${cold.scenario.fishery_label} ${cold.scenario.species_display} (${cold.scenario.water_clarity}).`;
      for (const row of [cold, normal, warm]) {
        pushFlag(row.audit.flags, "THERMAL_RESPONSE_FLAT", "high", detail);
      }
      continue;
    }

    const distinctActivities = unique([cold, normal, warm].map((row) => row.response.activity));
    const distinctSpeeds = unique([cold, normal, warm].map((row) => row.response.presentation.speed));
    const distinctLureTop = unique([cold, normal, warm].map((row) => row.response.lure_rankings[0]?.family_id ?? "none"));
    const distinctTopwater = unique([cold, normal, warm].map((row) => row.response.presentation.topwater_viable ? "open" : "closed"));
    const distinctMotions = unique([cold, normal, warm].map((row) => row.response.presentation.motion));

    if (
      distinctActivities.length === 1 &&
      distinctSpeeds.length === 1 &&
      distinctLureTop.length === 1 &&
      distinctTopwater.length === 1 &&
      distinctMotions.length === 1
    ) {
      const detail =
        `Thermal variants changed very little despite a ${tempSpan.toFixed(1)}F mean-air spread for ${cold.scenario.fishery_label} ${cold.scenario.species_display}.`;
      for (const row of [cold, normal, warm]) {
        pushFlag(row.audit.flags, "THERMAL_RESPONSE_WEAK", "medium", detail);
      }
    }
  }

  for (const row of rows) {
    row.audit.flag_count = row.audit.flags.length;
    row.audit.high_flags = row.audit.flags.filter((flag) => flag.severity === "high").length;
    row.audit.medium_flags = row.audit.flags.filter((flag) => flag.severity === "medium").length;
    row.audit.low_flags = row.audit.flags.filter((flag) => flag.severity === "low").length;
  }
}

function buildBehaviorSignatures(rows: ScenarioAuditRow[]): SummarySignature[] {
  const signatures = new Map<string, { count: number; examples: string[] }>();

  for (const row of rows) {
    const signature = row.response.behavior_summary.join(" | ");
    const entry = signatures.get(signature) ?? { count: 0, examples: [] };
    entry.count += 1;
    if (entry.examples.length < 3) {
      entry.examples.push(`${row.scenario.fishery_label} | ${row.scenario.species_display} | ${row.scenario.local_date}`);
    }
    signatures.set(signature, entry);
  }

  return [...signatures.entries()]
    .map(([signature, entry]) => ({
      signature,
      count: entry.count,
      examples: entry.examples,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function buildExampleFrequency(rows: ScenarioAuditRow[], key: "lure_rankings" | "fly_rankings") {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const family of row.response[key].slice(0, TOP_N)) {
      for (const example of family.examples) {
        const normalized = normalizeText(example);
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 20);
}

function aggregateFlagCounts(rows: ScenarioAuditRow[]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const flag of row.audit.flags) {
      counts.set(flag.code, (counts.get(flag.code) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function aggregateHotspots(rows: ScenarioAuditRow[], key: "species_display" | "fishery_label") {
  const counts = new Map<string, { scenarios: number; flags: number; highFlags: number }>();
  for (const row of rows) {
    const label = row.scenario[key];
    const entry = counts.get(label) ?? { scenarios: 0, flags: 0, highFlags: 0 };
    entry.scenarios += 1;
    entry.flags += row.audit.flag_count;
    entry.highFlags += row.audit.high_flags;
    counts.set(label, entry);
  }

  return [...counts.entries()]
    .map(([label, entry]) => ({
      label,
      scenarios: entry.scenarios,
      avg_flags: Number((entry.flags / entry.scenarios).toFixed(2)),
      avg_high_flags: Number((entry.highFlags / entry.scenarios).toFixed(2)),
    }))
    .sort((a, b) => b.avg_flags - a.avg_flags || b.avg_high_flags - a.avg_high_flags || a.label.localeCompare(b.label))
    .slice(0, 12);
}

function buildSummaryMarkdown(rows: ScenarioAuditRow[], inputPath: string, outputPath: string): string {
  const totalFlags = rows.reduce((sum, row) => sum + row.audit.flag_count, 0);
  const highFlags = rows.reduce((sum, row) => sum + row.audit.high_flags, 0);
  const mediumFlags = rows.reduce((sum, row) => sum + row.audit.medium_flags, 0);
  const lowFlags = rows.reduce((sum, row) => sum + row.audit.low_flags, 0);
  const flaggedRows = rows.filter((row) => row.audit.flag_count > 0);
  const flagCounts = aggregateFlagCounts(rows);
  const behaviorSignatures = buildBehaviorSignatures(rows);
  const overusedLureExamples = buildExampleFrequency(rows, "lure_rankings");
  const overusedFlyExamples = buildExampleFrequency(rows, "fly_rankings");
  const speciesHotspots = aggregateHotspots(rows, "species_display");
  const fisheryHotspots = aggregateHotspots(rows, "fishery_label");
  const worstRows = [...rows]
    .sort((a, b) =>
      b.audit.high_flags - a.audit.high_flags ||
      b.audit.flag_count - a.audit.flag_count ||
      a.scenario.id.localeCompare(b.scenario.id)
    )
    .slice(0, 20);

  const flagLines = flagCounts.map(([code, count]) => `- ${code}: ${count}`);
  const speciesLines = speciesHotspots.map((entry) =>
    `- ${entry.label}: avg ${entry.avg_flags} flags/scenario, avg ${entry.avg_high_flags} high flags/scenario`
  );
  const fisheryLines = fisheryHotspots.map((entry) =>
    `- ${entry.label}: avg ${entry.avg_flags} flags/scenario, avg ${entry.avg_high_flags} high flags/scenario`
  );
  const behaviorLines = behaviorSignatures.map((entry) =>
    `- ${entry.count}x | ${entry.signature} | ${entry.examples.join(" ; ")}`
  );
  const lureExampleLines = overusedLureExamples.map(([example, count]) => `- ${example}: ${count}`);
  const flyExampleLines = overusedFlyExamples.map(([example, count]) => `- ${example}: ${count}`);
  const worstLines = worstRows.map((row) =>
    `- ${row.scenario.id} | ${row.scenario.fishery_label} | ${row.scenario.species_display} | ${row.scenario.thermal_variant}/${row.scenario.water_clarity} | lure ${row.response.lure_rankings[0]?.display_name ?? "n/a"} | fly ${row.response.fly_rankings[0]?.display_name ?? "n/a"} | ${row.audit.flags.map((flag) => flag.code).join(", ")}`
  );

  return `# Recommender Historical Audit Report

| Generated at | ${new Date().toISOString()} |
| --- | --- |
| Input bundle | ${inputPath} |
| Output rows | ${outputPath} |
| Scenarios audited | ${rows.length} |
| Flagged scenarios | ${flaggedRows.length} |
| Total flags | ${totalFlags} |
| High / Medium / Low | ${highFlags} / ${mediumFlags} / ${lowFlags} |

## Top Issues
${flagLines.join("\n")}

## Species Hotspots
${speciesLines.join("\n")}

## Fishery Hotspots
${fisheryLines.join("\n")}

## Repeated Behavior Summaries
${behaviorLines.join("\n")}

## Overused Lure Examples
${lureExampleLines.join("\n")}

## Overused Fly Examples
${flyExampleLines.join("\n")}

## Worst Cases To Review
${worstLines.join("\n")}
`;
}

async function main() {
  const inputPath = parsePathArg(Deno.args, "--input=");
  const outputPath = parsePathArg(Deno.args, "--output=");
  const summaryPath = parsePathArg(Deno.args, "--summary=");
  const limit = parseLimit(Deno.args);
  const bundle = readBundle(inputPath);
  const seedById = new Map(bundle.seeds.map((seed) => [seed.seed_id, seed]));
  const scenarios = limit ? bundle.scenarios.slice(0, limit) : bundle.scenarios;

  const rows: ScenarioAuditRow[] = [];
  for (const scenario of scenarios) {
    const seed = seedById.get(scenario.seed_id);
    if (!seed) {
      console.warn(`Skipping scenario without seed: ${scenario.id}`);
      continue;
    }
    rows.push(runScenarioAudit(seed, scenario));
  }

  attachThermalResponsivenessFlags(rows);

  await Deno.mkdir(outputPath.slice(0, outputPath.lastIndexOf("/")), { recursive: true });
  const jsonl = rows.map((row) => JSON.stringify(row)).join("\n");
  await Deno.writeTextFile(outputPath, `${jsonl}\n`);
  await Deno.writeTextFile(summaryPath, buildSummaryMarkdown(rows, inputPath, outputPath));

  console.log(`Audited ${rows.length} scenarios.`);
  console.log(`Rows: ${outputPath}`);
  console.log(`Summary: ${summaryPath}`);
}

if (import.meta.main) {
  await main();
}
