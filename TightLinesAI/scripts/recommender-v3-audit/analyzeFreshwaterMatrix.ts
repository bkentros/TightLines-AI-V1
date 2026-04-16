#!/usr/bin/env -S deno run --allow-read --allow-write

type ActualCandidate = {
  id: string;
  display_name: string;
  score: number;
  tactical_lane: string;
  color_theme: string;
  color_recommendations: string[];
};

type ReviewSheetScenario = {
  scenario_id: string;
  label: string;
  priority: "core" | "secondary";
  species: string;
  anchor_key?: string;
  context: string;
  water_clarity: string;
  state_code: string;
  timezone: string;
  local_date: string;
  latitude: number;
  longitude: number;
  expectation: {
    seasonal_story: string;
    primary_lanes: string[];
    acceptable_secondary_lanes?: string[];
    disallowed_lanes?: string[];
    expected_color_lanes: string[];
    notes?: string[];
  };
  engine_run_status: string;
  archived_env_summary: string[];
  actual_output: {
    top_1_lure: ActualCandidate | null;
    top_3_lures: ActualCandidate[];
    top_1_fly: ActualCandidate | null;
    top_3_flies: ActualCandidate[];
    color_notes: string[];
    daily_profile_notes: string[];
  };
  review: {
    precheck_flags: string[];
  };
};

type ReviewSheet = {
  batch_id: string;
  generated_at: string;
  archive_bundle_generated_at: string | null;
  scenario_count: number;
  scenarios: ReviewSheetScenario[];
};

type CountRecord = Record<string, number>;

type SpecialtySummary = {
  expected_count: number;
  top3_hit_count: number;
  top1_hit_count: number;
  unexpected_top3_count: number;
};

type SpeciesSummary = {
  batch_id: string;
  scenario_count: number;
  core_count: number;
  secondary_count: number;
  top1_primary_hit_count: number;
  top3_primary_present_count: number;
  disallowed_avoidance_count: number;
  top_color_match_count: number;
  unique_top1_lure_ids: number;
  unique_top1_fly_ids: number;
  unique_lure_top3_signatures: number;
  unique_fly_top3_signatures: number;
  lure_top1_leaders: Array<{ id: string; count: number }>;
  fly_top1_leaders: Array<{ id: string; count: number }>;
  anchor_top1_primary_hit: Record<string, { hit: number; total: number }>;
  specialty: Record<string, SpecialtySummary>;
  used_region_fallback_count: number;
  top1_tie_count: number;
  explanation_conflict_count: number;
  hard_fail_count: number;
  soft_fail_count: number;
  top1_primary_miss_examples: Array<{
    scenario_id: string;
    label: string;
    actual_top1_ids: string[];
    expected_primary_ids: string[];
    state_code: string;
    context: string;
  }>;
  disallowed_examples: Array<{
    scenario_id: string;
    label: string;
    disallowed_present: string[];
  }>;
};

const INPUTS = [
  {
    species: "largemouth_bass",
    path: "docs/recommender-v3-audit/generated/largemouth-v3-matrix-review-sheet.json",
  },
  {
    species: "smallmouth_bass",
    path: "docs/recommender-v3-audit/generated/smallmouth-v3-matrix-review-sheet.json",
  },
  {
    species: "trout",
    path: "docs/recommender-v3-audit/generated/trout-v3-matrix-review-sheet.json",
  },
  {
    species: "northern_pike",
    path: "docs/recommender-v3-audit/generated/pike-v3-matrix-review-sheet.json",
  },
] as const;

const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/freshwater-v3-matrix-audit-summary.json";
const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/freshwater-v3-matrix-audit-summary.md";

const SPECIALTY_IDS = [
  "hollow_body_frog",
  "frog_fly",
  "mouse_fly",
  "walking_topwater",
  "buzzbait",
  "prop_bait",
  "popper_fly",
] as const;

function parseReviewSheet(path: string): Promise<ReviewSheet> {
  return Deno.readTextFile(path).then((raw) => JSON.parse(raw) as ReviewSheet);
}

function increment(map: CountRecord, key: string | undefined | null) {
  if (!key) return;
  map[key] = (map[key] ?? 0) + 1;
}

function topEntries(map: CountRecord, limit = 8): Array<{ id: string; count: number }> {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id, count]) => ({ id, count }));
}

function hasFlag(flags: readonly string[], exact: string): boolean {
  return flags.includes(exact);
}

function hasFlagPrefix(flags: readonly string[], prefix: string): boolean {
  return flags.some((flag) => flag.startsWith(prefix));
}

function disallowedPresent(flags: readonly string[]): string[] {
  const hit = flags.find((flag) => flag.startsWith("DISALLOWED_PRESENT:"));
  if (!hit) return [];
  return hit.slice("DISALLOWED_PRESENT:".length).split(",").filter(Boolean);
}

function combinedTop3(scenario: ReviewSheetScenario): string[] {
  return [
    ...scenario.actual_output.top_3_lures.map((candidate) => candidate.id),
    ...scenario.actual_output.top_3_flies.map((candidate) => candidate.id),
  ];
}

function combinedTop1(scenario: ReviewSheetScenario): string[] {
  return [
    scenario.actual_output.top_1_lure?.id,
    scenario.actual_output.top_1_fly?.id,
  ].filter((value): value is string => Boolean(value));
}

function newSpecialtySummary(): SpecialtySummary {
  return {
    expected_count: 0,
    top3_hit_count: 0,
    top1_hit_count: 0,
    unexpected_top3_count: 0,
  };
}

function summarizeSheet(sheet: ReviewSheet): SpeciesSummary {
  const lureTop1Counts: CountRecord = {};
  const flyTop1Counts: CountRecord = {};
  const lureTop3Signatures = new Set<string>();
  const flyTop3Signatures = new Set<string>();
  const anchorTop1PrimaryHit: Record<string, { hit: number; total: number }> = {};
  const specialty = Object.fromEntries(
    SPECIALTY_IDS.map((id) => [id, newSpecialtySummary()]),
  ) as Record<string, SpecialtySummary>;

  let analyzedScenarioCount = 0;
  let top1PrimaryHitCount = 0;
  let top3PrimaryPresentCount = 0;
  let disallowedAvoidanceCount = 0;
  let topColorMatchCount = 0;
  let coreCount = 0;
  let usedRegionFallbackCount = 0;
  let top1TieCount = 0;
  let explanationConflictCount = 0;
  let hardFailCount = 0;
  let softFailCount = 0;

  const top1PrimaryMissExamples: SpeciesSummary["top1_primary_miss_examples"] = [];
  const disallowedExamples: SpeciesSummary["disallowed_examples"] = [];

  for (const scenario of sheet.scenarios) {
    // Pending / failed archive runs have empty outputs and empty flags; skip so hit rates reflect engine quality only.
    if (scenario.engine_run_status !== "complete") continue;

    analyzedScenarioCount += 1;
    if (scenario.priority === "core") coreCount += 1;

    const flags = scenario.review.precheck_flags ?? [];
    const anchorKey = scenario.scenario_id.replace(/_\d{2}$/, "");
    anchorTop1PrimaryHit[anchorKey] ??= { hit: 0, total: 0 };
    anchorTop1PrimaryHit[anchorKey].total += 1;
    if (hasFlag(flags, "TOP1_PRIMARY_HIT")) top1PrimaryHitCount += 1;
    if (hasFlag(flags, "TOP1_PRIMARY_HIT")) anchorTop1PrimaryHit[anchorKey].hit += 1;
    if (hasFlag(flags, "TOP3_PRIMARY_PRESENT")) top3PrimaryPresentCount += 1;
    if (hasFlag(flags, "NO_DISALLOWED_PRESENT")) disallowedAvoidanceCount += 1;
    if (hasFlagPrefix(flags, "TOP_COLOR_MATCH:")) topColorMatchCount += 1;
    if (hasFlagPrefix(flags, "USED_REGION_FALLBACK:")) usedRegionFallbackCount += 1;
    if (hasFlagPrefix(flags, "TOP1_TIE:")) top1TieCount += 1;
    if (hasFlagPrefix(flags, "EXPLANATION_CONFLICT:")) explanationConflictCount += 1;

    const top1LureId = scenario.actual_output.top_1_lure?.id;
    const top1FlyId = scenario.actual_output.top_1_fly?.id;
    increment(lureTop1Counts, top1LureId);
    increment(flyTop1Counts, top1FlyId);
    lureTop3Signatures.add(
      scenario.actual_output.top_3_lures.map((candidate) => candidate.id).join(" > "),
    );
    flyTop3Signatures.add(
      scenario.actual_output.top_3_flies.map((candidate) => candidate.id).join(" > "),
    );

    if (
      !hasFlag(flags, "TOP1_PRIMARY_HIT") &&
      top1PrimaryMissExamples.length < 16
    ) {
      top1PrimaryMissExamples.push({
        scenario_id: scenario.scenario_id,
        label: scenario.label,
        actual_top1_ids: combinedTop1(scenario),
        expected_primary_ids: scenario.expectation.primary_lanes,
        state_code: scenario.state_code,
        context: scenario.context,
      });
    }

    const disallowed = disallowedPresent(flags);
    const isHardFail = disallowed.length > 0 || hasFlag(flags, "TOP3_PRIMARY_MISSING");
    const isSoftFail = !isHardFail && !hasFlag(flags, "TOP1_PRIMARY_HIT");
    if (isHardFail) hardFailCount += 1;
    if (isSoftFail) softFailCount += 1;
    if (disallowed.length > 0 && disallowedExamples.length < 12) {
      disallowedExamples.push({
        scenario_id: scenario.scenario_id,
        label: scenario.label,
        disallowed_present: disallowed,
      });
    }

    const expectedSpecialties = new Set(
      [
        ...scenario.expectation.primary_lanes,
        ...(scenario.expectation.acceptable_secondary_lanes ?? []),
      ].filter((id) => SPECIALTY_IDS.includes(id as typeof SPECIALTY_IDS[number])),
    );
    const actualTop3 = new Set(combinedTop3(scenario));
    const actualTop1 = new Set(combinedTop1(scenario));

    for (const specialtyId of SPECIALTY_IDS) {
      const isExpected = expectedSpecialties.has(specialtyId);
      const inTop3 = actualTop3.has(specialtyId);
      const inTop1 = actualTop1.has(specialtyId);
      if (isExpected) {
        specialty[specialtyId].expected_count += 1;
        if (inTop3) specialty[specialtyId].top3_hit_count += 1;
        if (inTop1) specialty[specialtyId].top1_hit_count += 1;
      } else if (inTop3) {
        specialty[specialtyId].unexpected_top3_count += 1;
      }
    }
  }

  return {
    batch_id: sheet.batch_id,
    scenario_count: analyzedScenarioCount,
    core_count: coreCount,
    secondary_count: analyzedScenarioCount - coreCount,
    top1_primary_hit_count: top1PrimaryHitCount,
    top3_primary_present_count: top3PrimaryPresentCount,
    disallowed_avoidance_count: disallowedAvoidanceCount,
    top_color_match_count: topColorMatchCount,
    unique_top1_lure_ids: Object.keys(lureTop1Counts).length,
    unique_top1_fly_ids: Object.keys(flyTop1Counts).length,
    unique_lure_top3_signatures: lureTop3Signatures.size,
    unique_fly_top3_signatures: flyTop3Signatures.size,
    lure_top1_leaders: topEntries(lureTop1Counts),
    fly_top1_leaders: topEntries(flyTop1Counts),
    anchor_top1_primary_hit: anchorTop1PrimaryHit,
    specialty,
    used_region_fallback_count: usedRegionFallbackCount,
    top1_tie_count: top1TieCount,
    explanation_conflict_count: explanationConflictCount,
    hard_fail_count: hardFailCount,
    soft_fail_count: softFailCount,
    top1_primary_miss_examples: top1PrimaryMissExamples,
    disallowed_examples: disallowedExamples,
  };
}

function percent(numerator: number, denominator: number): string {
  if (denominator === 0) return "0.0%";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function specialtyLines(summary: SpeciesSummary): string[] {
  return SPECIALTY_IDS
    .map((id) => ({ id, data: summary.specialty[id] }))
    .filter(({ data }) =>
      data.expected_count > 0 || data.top3_hit_count > 0 ||
      data.unexpected_top3_count > 0
    )
    .map(({ id, data }) =>
      `- \`${id}\`: expected ${data.expected_count}, top3 hits ${data.top3_hit_count}, top1 hits ${data.top1_hit_count}, unexpected top3 ${data.unexpected_top3_count}`
    );
}

function leaderLines(
  label: string,
  leaders: Array<{ id: string; count: number }>,
): string[] {
  return [
    `${label}:`,
    ...leaders.slice(0, 6).map((leader) => `- \`${leader.id}\`: ${leader.count}`),
  ];
}

function anchorLines(summary: SpeciesSummary): string[] {
  return Object.entries(summary.anchor_top1_primary_hit)
    .sort((a, b) => (b[1].hit / b[1].total) - (a[1].hit / a[1].total) || a[0].localeCompare(b[0]))
    .map(([anchor, value]) =>
      `- \`${anchor}\`: ${value.hit}/${value.total} (${percent(value.hit, value.total)})`
    );
}

function missLines(summary: SpeciesSummary): string[] {
  if (summary.top1_primary_miss_examples.length === 0) {
    return ["- none"];
  }
  return summary.top1_primary_miss_examples.map((example) =>
    `- \`${example.scenario_id}\` (${example.state_code}, ${example.context}): actual ${example.actual_top1_ids.join(" / ") || "none"} | expected ${example.expected_primary_ids.join(", ")}`
  );
}

function toMarkdown(
  generatedAt: string,
  speciesSummaries: Record<string, SpeciesSummary>,
): string {
  const ordered = [
    speciesSummaries.largemouth_bass,
    speciesSummaries.smallmouth_bass,
    speciesSummaries.trout,
    speciesSummaries.northern_pike,
  ];

  const totalScenarios = ordered.reduce((sum, summary) => sum + summary.scenario_count, 0);
  const totalTop1 = ordered.reduce((sum, summary) => sum + summary.top1_primary_hit_count, 0);
  const totalTop3 = ordered.reduce((sum, summary) => sum + summary.top3_primary_present_count, 0);
  const totalDisallowed = ordered.reduce((sum, summary) => sum + summary.disallowed_avoidance_count, 0);
  const totalColor = ordered.reduce((sum, summary) => sum + summary.top_color_match_count, 0);

  const lines = [
    "# Freshwater V3 Matrix Audit Summary",
    "",
    `Generated: ${generatedAt}`,
    "",
    `Total scenarios: ${totalScenarios}`,
    `Top-1 primary hit rate: ${totalTop1}/${totalScenarios} (${percent(totalTop1, totalScenarios)})`,
    `Top-3 primary present rate: ${totalTop3}/${totalScenarios} (${percent(totalTop3, totalScenarios)})`,
    `Disallowed avoidance rate: ${totalDisallowed}/${totalScenarios} (${percent(totalDisallowed, totalScenarios)})`,
    `Top color-lane match rate: ${totalColor}/${totalScenarios} (${percent(totalColor, totalScenarios)})`,
    "",
    "## Species Summaries",
    "",
  ];

  for (const summary of ordered) {
    lines.push(`### ${summary.batch_id}`);
    lines.push("");
    lines.push(
      `- Scenarios: ${summary.scenario_count} (${summary.core_count} core / ${summary.secondary_count} secondary)`,
    );
    lines.push(
      `- Top-1 primary hits: ${summary.top1_primary_hit_count}/${summary.scenario_count} (${percent(summary.top1_primary_hit_count, summary.scenario_count)})`,
    );
    lines.push(
      `- Top-3 primary present: ${summary.top3_primary_present_count}/${summary.scenario_count} (${percent(summary.top3_primary_present_count, summary.scenario_count)})`,
    );
    lines.push(
      `- Disallowed avoidance: ${summary.disallowed_avoidance_count}/${summary.scenario_count} (${percent(summary.disallowed_avoidance_count, summary.scenario_count)})`,
    );
    lines.push(
      `- Top color-lane match: ${summary.top_color_match_count}/${summary.scenario_count} (${percent(summary.top_color_match_count, summary.scenario_count)})`,
    );
    lines.push(
      `- Variety: ${summary.unique_top1_lure_ids} unique lure top-1 IDs, ${summary.unique_top1_fly_ids} unique fly top-1 IDs, ${summary.unique_lure_top3_signatures} lure top-3 signatures, ${summary.unique_fly_top3_signatures} fly top-3 signatures`,
    );
    lines.push(
      `- Failure split: ${summary.hard_fail_count} hard fails, ${summary.soft_fail_count} soft fails, ${summary.top1_tie_count} top-1 ties, ${summary.explanation_conflict_count} explanation conflicts, fallback used ${summary.used_region_fallback_count} times`,
    );
    lines.push("");
    lines.push(...leaderLines("Top lure leaders", summary.lure_top1_leaders));
    lines.push(...leaderLines("Top fly leaders", summary.fly_top1_leaders));
    lines.push("");
    lines.push("Anchor top-1 primary hit:");
    lines.push(...anchorLines(summary));
    lines.push("");
    lines.push("Specialty reach:");
    lines.push(...specialtyLines(summary));
    lines.push("");
    lines.push("Top-1 miss examples:");
    lines.push(...missLines(summary));
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const sheets = await Promise.all(INPUTS.map((input) => parseReviewSheet(input.path)));
  const summaries = Object.fromEntries(
    sheets.map((sheet, index) => [INPUTS[index]!.species, summarizeSheet(sheet)]),
  ) as Record<string, SpeciesSummary>;

  const output = {
    generated_at: new Date().toISOString(),
    species: summaries,
  };

  await Deno.writeTextFile(OUTPUT_JSON, `${JSON.stringify(output, null, 2)}\n`);
  await Deno.writeTextFile(
    OUTPUT_MARKDOWN,
    `${toMarkdown(output.generated_at, summaries)}\n`,
  );

  console.log(`Wrote ${OUTPUT_JSON}`);
  console.log(`Wrote ${OUTPUT_MARKDOWN}`);
}

if (import.meta.main) {
  await main();
}
