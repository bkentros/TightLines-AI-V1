#!/usr/bin/env -S deno run --allow-read --allow-write

type ArchiveAuditRow = {
  scenario: {
    id: string;
    fishery_label: string;
    context: string;
  };
  report: {
    score: number;
    band: string;
    summary_line: string;
    drivers: Array<{ variable: string; label: string }>;
    suppressors: Array<{ variable: string; label: string }>;
    condition_context?: {
      normalized_variable_scores: Array<{
        variable_key: string;
        engine_score: number;
        engine_label: string;
        temperature_breakdown?: {
          band_label: string;
          trend_label: string;
          shock_label: string;
          final_score: number;
        } | null;
      }>;
      composite_contributions: Array<{
        variable_key: string;
        normalized_score: number;
        weight: number;
        weighted_contribution: number;
      }>;
    };
  };
};

type FactorSnapshot = {
  scenarioId: string;
  fisheryLabel: string;
  score: number;
  band: string;
  summary: string;
  normalizedScore: number;
  engineLabel: string;
  weight: number;
  weightedContribution: number;
};

type VariableStats = {
  count: number;
  positive: number;
  negative: number;
  neutral: number;
  weightedSum: number;
  absWeightedSum: number;
  normalizedSum: number;
  topLift: FactorSnapshot | null;
  topDrag: FactorSnapshot | null;
};

type AuditFlag = {
  scenarioId: string;
  issue: string;
  detail: string;
};

const FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION = 6;

function average(numerator: number, denominator: number): string {
  if (denominator === 0) return "0.0";
  return (numerator / denominator).toFixed(1);
}

function readRows(jsonlPath: string): ArchiveAuditRow[] {
  const text = Deno.readTextFileSync(jsonlPath).trim();
  if (!text) return [];
  return text.split("\n").map((line) => JSON.parse(line) as ArchiveAuditRow);
}

function parseInputPaths(args: string[], scriptDir: string): string[] {
  const arg = args.find((value) => value.startsWith("--inputs="));
  if (!arg) return [`${scriptDir}/archive-audit-results.jsonl`];
  return arg
    .slice("--inputs=".length)
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => value.startsWith("/") ? value : `${scriptDir}/${value}`);
}

function parseOutputSuffix(args: string[]): string | null {
  const arg = args.find((value) => value.startsWith("--output-suffix="));
  if (!arg) return null;
  const suffix = arg.slice("--output-suffix=".length).trim();
  if (!suffix) return null;
  return suffix.replace(/[^a-zA-Z0-9_-]+/g, "_");
}

function topContributionBySign(
  contributions:
    ArchiveAuditRow["report"]["condition_context"]["composite_contributions"],
  sign: "positive" | "negative",
) {
  const filtered = contributions.filter((entry) =>
    sign === "positive"
      ? entry.weighted_contribution > 0
      : entry.weighted_contribution < 0
  );
  if (filtered.length === 0) return null;
  return filtered.sort((a, b) =>
    sign === "positive"
      ? b.weighted_contribution - a.weighted_contribution
      : a.weighted_contribution - b.weighted_contribution
  )[0]!;
}

function pushIf(
  flags: AuditFlag[],
  condition: boolean,
  scenarioId: string,
  issue: string,
  detail: string,
) {
  if (condition) flags.push({ scenarioId, issue, detail });
}

function auditRows(rows: ArchiveAuditRow[]) {
  const stats = new Map<string, VariableStats>();
  const flags: AuditFlag[] = [];

  for (const row of rows) {
    const cc = row.report.condition_context;
    if (!cc) {
      flags.push({
        scenarioId: row.scenario.id,
        issue: "MISSING_CONDITION_CONTEXT",
        detail:
          "Report is missing normalized scores or composite contributions.",
      });
      continue;
    }

    const normByVar = new Map(
      cc.normalized_variable_scores.map((entry) =>
        [entry.variable_key, entry] as const
      ),
    );
    const contribByVar = new Map(
      cc.composite_contributions.map((entry) =>
        [entry.variable_key, entry] as const
      ),
    );

    const topPositive = topContributionBySign(
      cc.composite_contributions,
      "positive",
    );
    const topNegative = topContributionBySign(
      cc.composite_contributions,
      "negative",
    );
    const leadDriver = row.report.drivers[0]?.variable ?? null;
    const leadSuppressor = row.report.suppressors[0]?.variable ?? null;

    if (leadDriver && topPositive) {
      pushIf(
        flags,
        topPositive.variable_key !== leadDriver &&
          topPositive.weighted_contribution >=
            FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION,
        row.scenario.id,
        "DRIVER_ORDER_MISMATCH",
        `Top positive contribution is ${topPositive.variable_key} (${
          topPositive.weighted_contribution.toFixed(1)
        }), but surfaced driver is ${leadDriver}.`,
      );
    }

    if (leadSuppressor && topNegative) {
      pushIf(
        flags,
        topNegative.variable_key !== leadSuppressor &&
          Math.abs(topNegative.weighted_contribution) >=
            FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION,
        row.scenario.id,
        "SUPPRESSOR_ORDER_MISMATCH",
        `Top negative contribution is ${topNegative.variable_key} (${
          topNegative.weighted_contribution.toFixed(1)
        }), but surfaced suppressor is ${leadSuppressor}.`,
      );
    }

    for (const driver of row.report.drivers) {
      const contribution =
        contribByVar.get(driver.variable)?.weighted_contribution ?? 0;
      pushIf(
        flags,
        contribution <= 0,
        row.scenario.id,
        "DRIVER_SIGN_MISMATCH",
        `${driver.variable} surfaced as a driver but contributed ${
          contribution.toFixed(1)
        }.`,
      );
      pushIf(
        flags,
        contribution > 0 &&
          contribution < FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION,
        row.scenario.id,
        "DRIVER_TOO_SMALL_TO_SURFACE",
        `${driver.variable} surfaced as a driver with only ${
          contribution.toFixed(1)
        } weighted points.`,
      );
    }

    for (const suppressor of row.report.suppressors) {
      const contribution =
        contribByVar.get(suppressor.variable)?.weighted_contribution ?? 0;
      pushIf(
        flags,
        contribution >= 0,
        row.scenario.id,
        "SUPPRESSOR_SIGN_MISMATCH",
        `${suppressor.variable} surfaced as a suppressor but contributed ${
          contribution.toFixed(1)
        }.`,
      );
      pushIf(
        flags,
        contribution < 0 &&
          Math.abs(contribution) < FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION,
        row.scenario.id,
        "SUPPRESSOR_TOO_SMALL_TO_SURFACE",
        `${suppressor.variable} surfaced as a suppressor with only ${
          contribution.toFixed(1)
        } weighted points.`,
      );
    }

    const tempNorm = normByVar.get("temperature_condition");
    const tempContribution = contribByVar.get("temperature_condition");
    if (tempNorm?.temperature_breakdown && tempContribution) {
      const tb = tempNorm.temperature_breakdown;
      pushIf(
        flags,
        tb.band_label === "optimal" &&
          tb.trend_label === "stable" &&
          tb.shock_label === "none" &&
          tempContribution.weighted_contribution <= -18,
        row.scenario.id,
        "TEMP_OPTIMAL_STABLE_TOO_NEGATIVE",
        `Temperature is optimal/stable with a ${
          tempContribution.weighted_contribution.toFixed(1)
        } weighted drag.`,
      );
    }

    const lightNorm = normByVar.get("light_cloud_condition");
    const lightContribution = contribByVar.get("light_cloud_condition");
    if (lightNorm && lightContribution) {
      pushIf(
        flags,
        lightNorm.engine_label === "glare" &&
          lightContribution.weighted_contribution > 0,
        row.scenario.id,
        "GLARE_POSITIVE_MISMATCH",
        `Glare contributed ${
          lightContribution.weighted_contribution.toFixed(1)
        }.`,
      );
      pushIf(
        flags,
        lightNorm.engine_label === "heavy_overcast" &&
          lightContribution.weighted_contribution < 0,
        row.scenario.id,
        "HEAVY_OVERCAST_NEGATIVE_MISMATCH",
        `Heavy overcast contributed ${
          lightContribution.weighted_contribution.toFixed(1)
        }.`,
      );
    }

    const precipNorm = normByVar.get("precipitation_disruption");
    const precipContribution = contribByVar.get("precipitation_disruption");
    if (precipNorm && precipContribution) {
      pushIf(
        flags,
        precipNorm.engine_label === "active_disruption" &&
          precipContribution.weighted_contribution > 0,
        row.scenario.id,
        "ACTIVE_PRECIP_POSITIVE_MISMATCH",
        `Active precipitation contributed ${
          precipContribution.weighted_contribution.toFixed(1)
        }.`,
      );
    }

    const tideContribution = contribByVar.get("tide_current_movement");
    if (
      row.scenario.context.startsWith("coastal") &&
      tempContribution &&
      tideContribution &&
      tempContribution.weighted_contribution >
        tideContribution.weighted_contribution &&
      tideContribution.weighted_contribution >=
        FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION &&
      row.report.score >= 60
    ) {
      flags.push({
        scenarioId: row.scenario.id,
        issue: "COASTAL_TEMP_BEATS_POSITIVE_TIDE",
        detail: `Temperature contribution ${
          tempContribution.weighted_contribution.toFixed(1)
        } exceeds tide contribution ${
          tideContribution.weighted_contribution.toFixed(1)
        } on a ${row.report.band} coastal report.`,
      });
    }

    for (const contribution of cc.composite_contributions) {
      const norm = normByVar.get(contribution.variable_key);
      if (!norm) continue;
      const key = `${row.scenario.context}|${contribution.variable_key}`;
      const existing = stats.get(key) ?? {
        count: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        weightedSum: 0,
        absWeightedSum: 0,
        normalizedSum: 0,
        topLift: null,
        topDrag: null,
      };

      const snapshot: FactorSnapshot = {
        scenarioId: row.scenario.id,
        fisheryLabel: row.scenario.fishery_label,
        score: row.report.score,
        band: row.report.band,
        summary: row.report.summary_line,
        normalizedScore: contribution.normalized_score,
        engineLabel: norm.engine_label,
        weight: contribution.weight,
        weightedContribution: contribution.weighted_contribution,
      };

      existing.count += 1;
      existing.weightedSum += contribution.weighted_contribution;
      existing.absWeightedSum += Math.abs(contribution.weighted_contribution);
      existing.normalizedSum += contribution.normalized_score;
      if (contribution.weighted_contribution > 0) existing.positive += 1;
      else if (contribution.weighted_contribution < 0) existing.negative += 1;
      else existing.neutral += 1;

      if (
        contribution.weighted_contribution > 0 &&
        (!existing.topLift ||
          contribution.weighted_contribution >
            existing.topLift.weightedContribution)
      ) {
        existing.topLift = snapshot;
      }
      if (
        contribution.weighted_contribution < 0 &&
        (!existing.topDrag ||
          contribution.weighted_contribution <
            existing.topDrag.weightedContribution)
      ) {
        existing.topDrag = snapshot;
      }

      stats.set(key, existing);
    }
  }

  return { stats, flags };
}

function buildStatsTable(stats: Map<string, VariableStats>): string {
  const lines = [
    "| Context | Variable | Avg weighted | Avg abs weighted | Pos | Neg | Top lift | Top drag |",
    "|---------|----------|--------------|------------------|-----|-----|----------|----------|",
  ];

  for (
    const [key, entry] of [...stats.entries()].sort((a, b) =>
      a[0].localeCompare(b[0])
    )
  ) {
    const [context, variable] = key.split("|");
    const lift = entry.topLift
      ? `${entry.topLift.scenarioId} (${
        entry.topLift.weightedContribution.toFixed(1)
      })`
      : "None";
    const drag = entry.topDrag
      ? `${entry.topDrag.scenarioId} (${
        entry.topDrag.weightedContribution.toFixed(1)
      })`
      : "None";
    lines.push(
      `| ${context} | ${variable} | ${
        average(entry.weightedSum, entry.count)
      } | ${
        average(entry.absWeightedSum, entry.count)
      } | ${entry.positive} | ${entry.negative} | ${lift} | ${drag} |`,
    );
  }

  return lines.join("\n");
}

function buildFlagSection(flags: AuditFlag[]): string {
  if (flags.length === 0) return "No factor-consistency flags.";
  return flags
    .slice()
    .sort((a, b) =>
      a.issue.localeCompare(b.issue) || a.scenarioId.localeCompare(b.scenarioId)
    )
    .map((flag) => `- ${flag.scenarioId} | ${flag.issue} | ${flag.detail}`)
    .join("\n");
}

const scriptDir = decodeURIComponent(new URL(".", import.meta.url).pathname)
  .replace(/\/$/, "");
const inputPaths = parseInputPaths(Deno.args, scriptDir);
const outputSuffix = parseOutputSuffix(Deno.args);
const sourceLabel = inputPaths.join(", ");
const mdPath = outputSuffix
  ? `${scriptDir}/factor-audit-report.${outputSuffix}.md`
  : `${scriptDir}/factor-audit-report.md`;

const rows = inputPaths.flatMap((path) => readRows(path));
const { stats, flags } = auditRows(rows);

const markdown = `# TightLines AI — Factor Contribution Audit
Generated: ${new Date().toISOString()}

## Scope

| Metric | Value |
|--------|-------|
| Archive scenarios loaded | ${rows.length} |
| Factor consistency flags | ${flags.length} |
| Context-variable groups audited | ${stats.size} |
| Source JSONL | ${sourceLabel} |

## Factor Consistency Flags

${buildFlagSection(flags)}

## Variable Contribution Summary

${buildStatsTable(stats)}
`;

Deno.writeTextFileSync(mdPath, markdown);
console.log(`Loaded ${rows.length} scenarios.`);
console.log(`Factor consistency flags: ${flags.length}.`);
console.log(`Markdown report: ${mdPath}`);
