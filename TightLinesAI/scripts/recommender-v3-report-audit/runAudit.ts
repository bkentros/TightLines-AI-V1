/**
 * Recommender V3 report audit — CLI runner.
 *
 * Usage:
 *   deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts <species>
 *
 * Species values:
 *   smallmouth | largemouth | pike | trout | all
 *
 * Writes:
 *   docs/audits/recommender-v3/<species>/<scenario-id>.md
 *   docs/audits/recommender-v3/<species>/_summary.md
 */

import { runRecommenderV3 } from "../../supabase/functions/_shared/recommenderEngine/legacyV3.ts";
import { getLaneFitWarnings } from "../../supabase/functions/_shared/recommenderEngine/v3/seasonal/validateSeasonalRow.ts";
import { SMALLMOUTH_SCENARIO_SET } from "./scenarios/smallmouth.ts";
import { LARGEMOUTH_SCENARIO_SET } from "./scenarios/largemouth.ts";
import { PIKE_SCENARIO_SET } from "./scenarios/pike.ts";
import { TROUT_SCENARIO_SET } from "./scenarios/trout.ts";
import { buildRecommenderRequest, monthName } from "./helpers.ts";
import { evaluateScenario } from "./flags.ts";
import { renderScenarioReport } from "./renderReport.ts";
import type { ReportAuditScenarioSet } from "./types.ts";
import type { AutoFlag } from "./flags.ts";

const SPECIES_ARG_TO_SET: Record<string, ReportAuditScenarioSet> = {
  smallmouth: SMALLMOUTH_SCENARIO_SET,
  smallmouth_bass: SMALLMOUTH_SCENARIO_SET,
  largemouth: LARGEMOUTH_SCENARIO_SET,
  largemouth_bass: LARGEMOUTH_SCENARIO_SET,
  pike: PIKE_SCENARIO_SET,
  pike_musky: PIKE_SCENARIO_SET,
  musky: PIKE_SCENARIO_SET,
  trout: TROUT_SCENARIO_SET,
  river_trout: TROUT_SCENARIO_SET,
};

const SPECIES_DIR_NAME: Record<ReportAuditScenarioSet["species"], string> = {
  smallmouth_bass: "smallmouth",
  largemouth_bass: "largemouth",
  pike_musky: "pike",
  river_trout: "trout",
};

const OUTPUT_ROOT = "docs/audits/recommender-v3";

async function ensureDir(path: string): Promise<void> {
  await Deno.mkdir(path, { recursive: true });
}

async function writeFile(path: string, contents: string): Promise<void> {
  await Deno.writeTextFile(path, contents);
}

function summariseFlags(flags: AutoFlag[]): Record<string, number> {
  const out: Record<string, number> = { BLOCKER: 0, BUG: 0, POLISH: 0, FYI: 0 };
  for (const f of flags) {
    out[f.severity] = (out[f.severity] ?? 0) + 1;
  }
  return out;
}

async function runScenarioSet(set: ReportAuditScenarioSet): Promise<void> {
  const dirName = SPECIES_DIR_NAME[set.species];
  const outDir = `${OUTPUT_ROOT}/${dirName}`;
  await ensureDir(outDir);

  const summaryRows: string[] = [];

  summaryRows.push(`# ${set.species_display_name} — Report Audit Summary`);
  summaryRows.push("");
  summaryRows.push(`**Primary regions:** ${set.primary_regions_rationale}`);
  summaryRows.push("");
  summaryRows.push(`**Commonly-fished months:** ${set.commonly_fished_months_rationale}`);
  summaryRows.push("");
  summaryRows.push(`## Scenarios run`);
  summaryRows.push("");
  summaryRows.push(
    `| # | Id | Region | Month | Context | Profile | Auto-flags (BLK / BUG / POL / FYI) |`,
  );
  summaryRows.push(`| --- | --- | --- | --- | --- | --- | --- |`);

  for (let i = 0; i < set.scenarios.length; i++) {
    const scenario = set.scenarios[i]!;
    const request = buildRecommenderRequest(scenario);

    let response;
    try {
      response = runRecommenderV3(request);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorPath = `${outDir}/${scenario.id}.md`;
      const body = [
        `# ${scenario.id} — ${scenario.title}`,
        ``,
        `> **ENGINE ERROR — could not produce a report for this scenario.**`,
        ``,
        `## Error`,
        ``,
        "```",
        errorMessage,
        "```",
        ``,
        `## Scenario setup`,
        ``,
        "```json",
        JSON.stringify(scenario, null, 2),
        "```",
        ``,
      ].join("\n");
      await writeFile(errorPath, body);
      summaryRows.push(
        `| ${i + 1} | \`${scenario.id}\` | ${scenario.location.region_key} | ${monthName(scenario.location.month)} | ${scenario.context} | ${scenario.condition_profile} | **ENGINE ERROR** |`,
      );
      continue;
    }

    const flags = evaluateScenario(response);
    const counts = summariseFlags(flags);
    const md = renderScenarioReport(scenario, response, flags);
    const outPath = `${outDir}/${scenario.id}.md`;
    await writeFile(outPath, md);

    summaryRows.push(
      `| ${i + 1} | \`${scenario.id}\` | ${scenario.location.region_key} | ${monthName(scenario.location.month)} | ${scenario.context} | ${scenario.condition_profile} | ${counts.BLOCKER} / ${counts.BUG} / ${counts.POLISH} / ${counts.FYI} |`,
    );

    console.log(
      `wrote ${outPath} — BLOCKER ${counts.BLOCKER} BUG ${counts.BUG} POLISH ${counts.POLISH} FYI ${counts.FYI}`,
    );
  }

  summaryRows.push("");
  summaryRows.push(`## Audit workflow`);
  summaryRows.push("");
  summaryRows.push(`For each scenario file:`);
  summaryRows.push(`1. Read the scenario's **Intent** and **Setup** to understand what the harness was trying to simulate.`);
  summaryRows.push(`2. Work through the **Auditor checklist** top-to-bottom.`);
  summaryRows.push(`3. Record findings in the **Auditor notes** section with severity tags and specific ids/quotes.`);
  summaryRows.push(`4. Cross-check each **auto-flag** — confirm or dismiss with reasoning.`);
  summaryRows.push("");
  summaryRows.push(`After all scenarios for this species are audited, write a species-level rollup at the bottom of this file under "Species findings".`);
  summaryRows.push("");
  summaryRows.push(`## Species findings`);
  summaryRows.push("");
  summaryRows.push(`_(fill in after all scenarios audited — top themes, recurring archetype issues, recurring copy issues, tuning recommendations)_`);
  summaryRows.push("");

  const summaryPath = `${outDir}/_summary.md`;
  await writeFile(summaryPath, summaryRows.join("\n"));
  console.log(`wrote ${summaryPath}`);
}

async function writeLaneFitDiagnostics(): Promise<void> {
  const warnings = getLaneFitWarnings();
  const path = `${OUTPUT_ROOT}/_lane_fit_diagnostics.md`;

  const lines: string[] = [];
  lines.push(`# Phase 1 Lane-Fit Regressions`);
  lines.push(``);
  lines.push(
    `This file lists every seasonal-row ↔ archetype pair where the archetype's authored`,
  );
  lines.push(
    `column/pace/presence ranges (post Phase 1 narrowing) have **zero overlap** with the`,
  );
  lines.push(
    `row's allowed tactical lanes. Pre-Phase-1 these pairs validated because the archetype`,
  );
  lines.push(
    `ranges were wider (and often wrong — tube jig primary "upper" etc.). The hard boot-time`,
  );
  lines.push(
    `throw was converted to a collect-and-log so the audit can run end-to-end.`,
  );
  lines.push(``);
  lines.push(`## What to do with each entry`);
  lines.push(``);
  lines.push(
    `For every (row, archetype) pair below, decide — as the auditor — one of:`,
  );
  lines.push(``);
  lines.push(
    `- **(A)** The authored archetype range is too narrow. Broaden the relevant range in`,
  );
  lines.push(
    `  \`supabase/functions/_shared/recommenderEngine/v3/candidates/{lures,flies}.ts\` with`,
  );
  lines.push(
    `  a biologically-defensible secondary (e.g. ned_rig column_range could be ["bottom","mid"]).`,
  );
  lines.push(
    `- **(B)** The archetype genuinely does not belong in this seasonal row. Remove it from`,
  );
  lines.push(
    `  the viable pool in \`v3/seasonal/{species}.ts\`.`,
  );
  lines.push(
    `- **(C)** The seasonal row's allowed lanes are too narrow. Adjust the row's`,
  );
  lines.push(
    `  \`base_water_column\` / \`base_mood\` / \`base_presentation_style\` to better reflect the`,
  );
  lines.push(
    `  species' real behavior in that region/month.`,
  );
  lines.push(``);
  lines.push(
    `Once all entries are resolved, revert \`validateSeasonalRows\` lane-fit check in`,
  );
  lines.push(
    `\`v3/seasonal/validateSeasonalRow.ts\` back to a hard \`throw\`.`,
  );
  lines.push(``);
  lines.push(`## Entries`);
  lines.push(``);

  if (warnings.length === 0) {
    lines.push(`_(none — every seasonal row pool's archetypes overlap the row's allowed lanes)_`);
  } else {
    lines.push(`Total: **${warnings.length}** lane-fit regressions.`);
    lines.push(``);
    lines.push(
      `| row (species\\|region\\|month\\|context\\|state) | kind | id | primary_column | pace | presence | allowed_columns | allowed_paces | allowed_presence |`,
    );
    lines.push(
      `| --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
    );
    for (const w of warnings) {
      const col = w.secondary_column
        ? `${w.primary_column}/${w.secondary_column}`
        : w.primary_column;
      const pace = w.secondary_pace ? `${w.pace}/${w.secondary_pace}` : w.pace;
      const pres = w.secondary_presence
        ? `${w.presence}/${w.secondary_presence}`
        : w.presence;
      lines.push(
        `| \`${w.key}\` | ${w.kind} | \`${w.id}\` | ${col} | ${pace} | ${pres} | ${w.allowed_columns.join(",")} | ${w.allowed_paces.join(",")} | ${w.allowed_presence.join(",")} |`,
      );
    }
  }
  lines.push(``);
  await writeFile(path, lines.join("\n"));
  console.log(`wrote ${path} (${warnings.length} lane-fit warnings)`);
}

async function main(): Promise<void> {
  const speciesArg = (Deno.args[0] ?? "").toLowerCase();
  if (!speciesArg) {
    console.error("Usage: runAudit.ts <smallmouth|largemouth|pike|trout|all>");
    Deno.exit(1);
  }

  await ensureDir(OUTPUT_ROOT);

  if (speciesArg === "all") {
    for (const set of [SMALLMOUTH_SCENARIO_SET, LARGEMOUTH_SCENARIO_SET, PIKE_SCENARIO_SET, TROUT_SCENARIO_SET]) {
      console.log(`\n=== ${set.species_display_name} ===`);
      await runScenarioSet(set);
    }
    await writeLaneFitDiagnostics();
    return;
  }

  const set = SPECIES_ARG_TO_SET[speciesArg];
  if (!set) {
    console.error(`Unknown species '${speciesArg}'. Use one of: smallmouth | largemouth | pike | trout | all`);
    Deno.exit(1);
  }
  await runScenarioSet(set);
  await writeLaneFitDiagnostics();
}

if (import.meta.main) {
  await main();
}
