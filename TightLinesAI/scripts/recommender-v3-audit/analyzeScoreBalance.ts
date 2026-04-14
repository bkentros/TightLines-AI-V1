#!/usr/bin/env -S deno run --allow-read --allow-write

import type {
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
} from "../../supabase/functions/_shared/recommenderEngine/v3/index.ts";
import {
  LARGEMOUTH_V3_SEASONAL_ROWS,
  NORTHERN_PIKE_V3_SEASONAL_ROWS,
  resolveFinalProfileV3,
  resolveSeasonalRowV3,
  scoreFlyCandidatesV3,
  scoreLureCandidatesV3,
  SMALLMOUTH_V3_SEASONAL_ROWS,
  TROUT_V3_SEASONAL_ROWS,
} from "../../supabase/functions/_shared/recommenderEngine/v3/index.ts";
import {
  allSyntheticDailyPayloads,
  NEUTRAL_SYNTHETIC_DAILY,
} from "./syntheticRecommenderAudit.ts";

const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/v3-score-balance-audit.json";
const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/v3-score-balance-audit.md";

const ALL_ROWS: readonly RecommenderV3SeasonalRow[] = [
  ...LARGEMOUTH_V3_SEASONAL_ROWS,
  ...SMALLMOUTH_V3_SEASONAL_ROWS,
  ...TROUT_V3_SEASONAL_ROWS,
  ...NORTHERN_PIKE_V3_SEASONAL_ROWS,
];
const AUDITED_ROWS: readonly RecommenderV3SeasonalRow[] = [
  ...new Map(
    ALL_ROWS.map((row) => {
      const key = [row.species, row.region_key, row.month, row.context].join(
        "|",
      );
      return [
        key,
        resolveSeasonalRowV3(
          row.species,
          row.region_key,
          row.month,
          row.context,
        ),
      ];
    }),
  ).values(),
];

const CLARITIES = ["clear", "stained", "dirty"] as const;
const LIGHT_BY_CLARITY = {
  clear: "bright",
  stained: "mixed_sky",
  dirty: "low_light",
} as const;

const DAILY_PAYLOADS: readonly RecommenderV3DailyPayload[] =
  allSyntheticDailyPayloads();

const NEUTRAL_DAILY = NEUTRAL_SYNTHETIC_DAILY;

const COMPONENT_CODES = [
  "water_column_fit",
  "posture_fit",
  "presentation_fit",
  "forage_bonus",
  "daily_condition_fit",
  "clarity_fit",
  "guardrail_penalty",
] as const;

type ComponentCode = (typeof COMPONENT_CODES)[number];
type GearMode = "lure" | "fly";
type GroupCode = "seasonal_core" | "daily_stack" | "forage" | "clarity";

type ComponentAggregate = {
  winner_sum: number;
  winner_abs_sum: number;
  decisive_count: number;
  margin_sum: number;
  max_margin: number;
};

type GroupAggregate = {
  decisive_count: number;
  margin_sum: number;
  max_margin: number;
};

type GearAggregate = {
  states: number;
  top1_changed_vs_neutral: number;
  top3_changed_vs_neutral: number;
  component: Record<ComponentCode, ComponentAggregate>;
  groups: Record<GroupCode, GroupAggregate>;
};

type Example = {
  species: string;
  region_key: string;
  month: number;
  context: string;
  clarity: string;
  top1: string;
  runner_up: string;
  decisive_component: ComponentCode;
  decisive_margin: number;
  decisive_group: GroupCode;
  group_margin: number;
};

function createComponentAggregate(): Record<ComponentCode, ComponentAggregate> {
  return Object.fromEntries(
    COMPONENT_CODES.map((code) => [
      code,
      {
        winner_sum: 0,
        winner_abs_sum: 0,
        decisive_count: 0,
        margin_sum: 0,
        max_margin: 0,
      },
    ]),
  ) as Record<ComponentCode, ComponentAggregate>;
}

function createGroupAggregate(): Record<GroupCode, GroupAggregate> {
  return {
    seasonal_core: { decisive_count: 0, margin_sum: 0, max_margin: 0 },
    daily_stack: { decisive_count: 0, margin_sum: 0, max_margin: 0 },
    forage: { decisive_count: 0, margin_sum: 0, max_margin: 0 },
    clarity: { decisive_count: 0, margin_sum: 0, max_margin: 0 },
  };
}

function createGearAggregate(): GearAggregate {
  return {
    states: 0,
    top1_changed_vs_neutral: 0,
    top3_changed_vs_neutral: 0,
    component: createComponentAggregate(),
    groups: createGroupAggregate(),
  };
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : round(numerator / denominator);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function top3Signature(candidates: readonly RecommenderV3RankedArchetype[]): string {
  return candidates.map((candidate) => candidate.id).join(" > ");
}

function breakdownValue(
  candidate: RecommenderV3RankedArchetype,
  code: ComponentCode,
): number {
  return candidate.breakdown.find((entry) => entry.code === code)?.value ?? 0;
}

function groupValue(
  candidate: RecommenderV3RankedArchetype,
  group: GroupCode,
): number {
  switch (group) {
    case "seasonal_core":
      return breakdownValue(candidate, "water_column_fit") +
        breakdownValue(candidate, "forage_bonus");
    case "daily_stack":
      return breakdownValue(candidate, "posture_fit") +
        breakdownValue(candidate, "presentation_fit") +
        breakdownValue(candidate, "daily_condition_fit") +
        breakdownValue(candidate, "guardrail_penalty");
    case "forage":
      return breakdownValue(candidate, "forage_bonus");
    case "clarity":
      return breakdownValue(candidate, "clarity_fit");
  }
}

function topPositiveMargin(
  winner: RecommenderV3RankedArchetype,
  runnerUp: RecommenderV3RankedArchetype,
): { code: ComponentCode; margin: number } {
  const diffs = COMPONENT_CODES.map((code) => ({
    code,
    margin: breakdownValue(winner, code) - breakdownValue(runnerUp, code),
  }));
  diffs.sort((a, b) =>
    b.margin - a.margin || a.code.localeCompare(b.code)
  );
  return diffs[0]!;
}

function topPositiveGroupMargin(
  winner: RecommenderV3RankedArchetype,
  runnerUp: RecommenderV3RankedArchetype,
): { group: GroupCode; margin: number } {
  const diffs = ([
    "seasonal_core",
    "daily_stack",
    "forage",
    "clarity",
  ] as const).map((group) => ({
    group,
    margin: groupValue(winner, group) - groupValue(runnerUp, group),
  }));
  diffs.sort((a, b) =>
    b.margin - a.margin || a.group.localeCompare(b.group)
  );
  return diffs[0]!;
}

function updateAggregate(
  aggregate: GearAggregate,
  ranked: readonly RecommenderV3RankedArchetype[],
  neutralRanked: readonly RecommenderV3RankedArchetype[],
  row: RecommenderV3SeasonalRow,
  clarity: string,
  examples: Example[],
) {
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const neutralWinner = neutralRanked[0];
  if (!winner || !runnerUp || !neutralWinner) return;

  aggregate.states += 1;
  if (winner.id !== neutralWinner.id) {
    aggregate.top1_changed_vs_neutral += 1;
  }
  if (top3Signature(ranked) !== top3Signature(neutralRanked)) {
    aggregate.top3_changed_vs_neutral += 1;
  }

  for (const code of COMPONENT_CODES) {
    const value = breakdownValue(winner, code);
    aggregate.component[code].winner_sum += value;
    aggregate.component[code].winner_abs_sum += Math.abs(value);
  }

  const decisiveComponent = topPositiveMargin(winner, runnerUp);
  if (decisiveComponent.margin > 0) {
    aggregate.component[decisiveComponent.code].decisive_count += 1;
    aggregate.component[decisiveComponent.code].margin_sum += decisiveComponent.margin;
    aggregate.component[decisiveComponent.code].max_margin = Math.max(
      aggregate.component[decisiveComponent.code].max_margin,
      decisiveComponent.margin,
    );
  }

  const decisiveGroup = topPositiveGroupMargin(winner, runnerUp);
  if (decisiveGroup.margin > 0) {
    aggregate.groups[decisiveGroup.group].decisive_count += 1;
    aggregate.groups[decisiveGroup.group].margin_sum += decisiveGroup.margin;
    aggregate.groups[decisiveGroup.group].max_margin = Math.max(
      aggregate.groups[decisiveGroup.group].max_margin,
      decisiveGroup.margin,
    );
  }

  if (examples.length < 20 && decisiveComponent.margin > 0) {
    examples.push({
      species: row.species,
      region_key: row.region_key,
      month: row.month,
      context: row.context,
      clarity,
      top1: winner.id,
      runner_up: runnerUp.id,
      decisive_component: decisiveComponent.code,
      decisive_margin: round(decisiveComponent.margin),
      decisive_group: decisiveGroup.group,
      group_margin: round(decisiveGroup.margin),
    });
  }
}

function summarizeAggregate(aggregate: GearAggregate) {
  return {
    states: aggregate.states,
    top1_changed_vs_neutral_ratio: ratio(
      aggregate.top1_changed_vs_neutral,
      aggregate.states,
    ),
    top3_changed_vs_neutral_ratio: ratio(
      aggregate.top3_changed_vs_neutral,
      aggregate.states,
    ),
    components: Object.fromEntries(
      COMPONENT_CODES.map((code) => [
        code,
        {
          winner_mean: round(
            aggregate.component[code].winner_sum / aggregate.states,
          ),
          winner_abs_mean: round(
            aggregate.component[code].winner_abs_sum / aggregate.states,
          ),
          decisive_share: ratio(
            aggregate.component[code].decisive_count,
            aggregate.states,
          ),
          mean_decisive_margin: aggregate.component[code].decisive_count === 0
            ? 0
            : round(
              aggregate.component[code].margin_sum /
                aggregate.component[code].decisive_count,
            ),
          max_decisive_margin: round(aggregate.component[code].max_margin),
        },
      ]),
    ),
    groups: {
      seasonal_core: {
        decisive_share: ratio(
          aggregate.groups.seasonal_core.decisive_count,
          aggregate.states,
        ),
        mean_decisive_margin: aggregate.groups.seasonal_core.decisive_count === 0
          ? 0
          : round(
            aggregate.groups.seasonal_core.margin_sum /
              aggregate.groups.seasonal_core.decisive_count,
          ),
        max_decisive_margin: round(aggregate.groups.seasonal_core.max_margin),
      },
      daily_stack: {
        decisive_share: ratio(
          aggregate.groups.daily_stack.decisive_count,
          aggregate.states,
        ),
        mean_decisive_margin: aggregate.groups.daily_stack.decisive_count === 0
          ? 0
          : round(
            aggregate.groups.daily_stack.margin_sum /
              aggregate.groups.daily_stack.decisive_count,
          ),
        max_decisive_margin: round(aggregate.groups.daily_stack.max_margin),
      },
      forage: {
        decisive_share: ratio(
          aggregate.groups.forage.decisive_count,
          aggregate.states,
        ),
        mean_decisive_margin: aggregate.groups.forage.decisive_count === 0
          ? 0
          : round(
            aggregate.groups.forage.margin_sum /
              aggregate.groups.forage.decisive_count,
          ),
        max_decisive_margin: round(aggregate.groups.forage.max_margin),
      },
      clarity: {
        decisive_share: ratio(
          aggregate.groups.clarity.decisive_count,
          aggregate.states,
        ),
        mean_decisive_margin: aggregate.groups.clarity.decisive_count === 0
          ? 0
          : round(
            aggregate.groups.clarity.margin_sum /
              aggregate.groups.clarity.decisive_count,
          ),
        max_decisive_margin: round(aggregate.groups.clarity.max_margin),
      },
    },
  };
}

function toMarkdown(
  lure: ReturnType<typeof summarizeAggregate>,
  fly: ReturnType<typeof summarizeAggregate>,
  examples: { lure: Example[]; fly: Example[] },
) {
  const lines = [
    "# V3 Score Balance Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Audited rows: ${AUDITED_ROWS.length}`,
    `Synthetic daily states per row: ${DAILY_PAYLOADS.length}`,
    "",
    "## Daily Sway",
    "",
    `Lure top-1 changed vs neutral daily: ${formatPercent(lure.top1_changed_vs_neutral_ratio)}`,
    `Lure top-3 lineup changed vs neutral daily: ${formatPercent(lure.top3_changed_vs_neutral_ratio)}`,
    `Fly top-1 changed vs neutral daily: ${formatPercent(fly.top1_changed_vs_neutral_ratio)}`,
    `Fly top-3 lineup changed vs neutral daily: ${formatPercent(fly.top3_changed_vs_neutral_ratio)}`,
    "",
    "## Decisive Group Share",
    "",
    `Lure seasonal core decisive share: ${formatPercent(lure.groups.seasonal_core.decisive_share)}`,
    `Lure daily stack decisive share: ${formatPercent(lure.groups.daily_stack.decisive_share)}`,
    `Lure forage decisive share: ${formatPercent(lure.groups.forage.decisive_share)}`,
    `Lure clarity decisive share: ${formatPercent(lure.groups.clarity.decisive_share)}`,
    "",
    `Fly seasonal core decisive share: ${formatPercent(fly.groups.seasonal_core.decisive_share)}`,
    `Fly daily stack decisive share: ${formatPercent(fly.groups.daily_stack.decisive_share)}`,
    `Fly forage decisive share: ${formatPercent(fly.groups.forage.decisive_share)}`,
    `Fly clarity decisive share: ${formatPercent(fly.groups.clarity.decisive_share)}`,
    "",
    "## Component Table",
    "",
    "| Gear | Component | Winner Mean | Winner Abs Mean | Decisive Share | Mean Decisive Margin | Max Decisive Margin |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const [gear, summary] of [["lure", lure], ["fly", fly]] as const) {
    for (const code of COMPONENT_CODES) {
      const component = summary.components[code];
      lines.push(
        `| ${gear} | ${code} | ${component.winner_mean} | ${component.winner_abs_mean} | ${
          formatPercent(component.decisive_share)
        } | ${component.mean_decisive_margin} | ${component.max_decisive_margin} |`,
      );
    }
  }

  lines.push("", "## Example Decisive States", "");
  lines.push("### Lure", "");
  for (const example of examples.lure.slice(0, 10)) {
    lines.push(
      `- ${example.species} ${example.region_key} m${example.month} ${example.context} ${example.clarity}: ${example.top1} over ${example.runner_up} via ${example.decisive_component} (${example.decisive_margin})`,
    );
  }
  lines.push("", "### Fly", "");
  for (const example of examples.fly.slice(0, 10)) {
    lines.push(
      `- ${example.species} ${example.region_key} m${example.month} ${example.context} ${example.clarity}: ${example.top1} over ${example.runner_up} via ${example.decisive_component} (${example.decisive_margin})`,
    );
  }

  return `${lines.join("\n")}\n`;
}

const aggregates = {
  lure: createGearAggregate(),
  fly: createGearAggregate(),
};
const examples = {
  lure: [] as Example[],
  fly: [] as Example[],
};

for (const row of AUDITED_ROWS) {
  for (const clarity of CLARITIES) {
    const neutralResolved = resolveFinalProfileV3(row, NEUTRAL_DAILY);
    const neutralLures = scoreLureCandidatesV3(
      row,
      neutralResolved,
      NEUTRAL_DAILY,
      clarity,
      LIGHT_BY_CLARITY[clarity],
    );
    const neutralFlies = scoreFlyCandidatesV3(
      row,
      neutralResolved,
      NEUTRAL_DAILY,
      clarity,
      LIGHT_BY_CLARITY[clarity],
    );

    for (const daily of DAILY_PAYLOADS) {
      const resolved = resolveFinalProfileV3(row, daily);
      const lures = scoreLureCandidatesV3(
        row,
        resolved,
        daily,
        clarity,
        LIGHT_BY_CLARITY[clarity],
      );
      const flies = scoreFlyCandidatesV3(
        row,
        resolved,
        daily,
        clarity,
        LIGHT_BY_CLARITY[clarity],
      );
      updateAggregate(
        aggregates.lure,
        lures,
        neutralLures,
        row,
        clarity,
        examples.lure,
      );
      updateAggregate(
        aggregates.fly,
        flies,
        neutralFlies,
        row,
        clarity,
        examples.fly,
      );
    }
  }
}

const lureSummary = summarizeAggregate(aggregates.lure);
const flySummary = summarizeAggregate(aggregates.fly);
const payload = {
  generated_at: new Date().toISOString(),
  audited_rows: AUDITED_ROWS.length,
  synthetic_daily_states_per_row: DAILY_PAYLOADS.length,
  lure: lureSummary,
  fly: flySummary,
  examples,
};

await Deno.writeTextFile(OUTPUT_JSON, JSON.stringify(payload, null, 2));
await Deno.writeTextFile(
  OUTPUT_MARKDOWN,
  toMarkdown(lureSummary, flySummary, examples),
);

console.log(`Wrote ${OUTPUT_JSON}`);
console.log(`Wrote ${OUTPUT_MARKDOWN}`);
