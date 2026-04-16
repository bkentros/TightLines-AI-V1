#!/usr/bin/env -S deno run --allow-read --allow-write

import {
  PIKE_AUDIT_ANCHORS,
  PIKE_CORE_MONTHLY_MATRIX,
  PIKE_FULL_AUDIT_MATRIX,
  PIKE_OVERLAY_MATRIX,
} from "./pikeAuditMatrix.ts";

const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/pike-v3-audit-matrix.md";
const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/pike-v3-audit-matrix.json";

function monthName(month: number): string {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][month - 1]!;
}

function byMonthTable(): string {
  const lines = [
    "| Month | Core monthly | Seasonal overlays | Total |",
    "|-------|--------------|-------------------|-------|",
  ];

  for (let month = 1; month <= 12; month++) {
    const core = PIKE_CORE_MONTHLY_MATRIX.filter((scenario) => scenario.month === month).length;
    const overlays = PIKE_OVERLAY_MATRIX.filter((scenario) => scenario.month === month).length;
    lines.push(`| ${monthName(month)} | ${core} | ${overlays} | ${core + overlays} |`);
  }

  return lines.join("\n");
}

function anchorTable(): string {
  const lines = [
    "| Anchor | Role | Region | Context | Default clarity | Notes |",
    "|--------|------|--------|---------|-----------------|-------|",
  ];

  for (const anchor of PIKE_AUDIT_ANCHORS) {
    lines.push(
      `| ${anchor.label} | ${anchor.audit_role} | ${anchor.region_key} | ${anchor.context} | ${anchor.default_clarity} | ${anchor.notes} |`,
    );
  }

  return lines.join("\n");
}

function matrixScenarioLines(): string[] {
  return PIKE_FULL_AUDIT_MATRIX.map((scenario) =>
    `- ${scenario.id} | ${scenario.label} | ${scenario.region_key} | ${scenario.context} | ${scenario.local_date} | ${scenario.default_clarity} | ${scenario.matrix_role} | ${scenario.focus_window}`
  );
}

function toMarkdown(): string {
  return [
    "# Northern Pike V3 Audit Matrix",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Fixed northern pike coverage grid for V3:",
    "- 3 core monthly anchors across all 12 months",
    "- 5 seasonal overlay anchors across 4 high-value months each",
    "",
    `Total scenarios: ${PIKE_FULL_AUDIT_MATRIX.length}`,
    `Core monthly scenarios: ${PIKE_CORE_MONTHLY_MATRIX.length}`,
    `Overlay scenarios: ${PIKE_OVERLAY_MATRIX.length}`,
    "",
    "## Why This Structure",
    "",
    "- Stresses NORTHERN_CORE stained weed-lake behavior, Adirondack clear water, Rainy River current, Alaska interior, and reservoir/post-spawn edges without ad-hoc scenario drift.",
    "- Keeps jerkbait, suspending, large-profile swimbait, spoon, and streamer lanes under seasonal pressure with realistic archive dates.",
    "",
    "## Anchor Fisheries",
    "",
    anchorTable(),
    "",
    "## Month Coverage",
    "",
    byMonthTable(),
    "",
    "## Scenario List",
    "",
    "Format:",
    "- `id | label | region | context | local_date | default_clarity | role | focus_window`",
    "",
    ...matrixScenarioLines(),
    "",
  ].join("\n");
}

async function main() {
  const payload = {
    generated_at: new Date().toISOString(),
    total_scenarios: PIKE_FULL_AUDIT_MATRIX.length,
    core_monthly_count: PIKE_CORE_MONTHLY_MATRIX.length,
    overlay_count: PIKE_OVERLAY_MATRIX.length,
    anchors: PIKE_AUDIT_ANCHORS,
    scenarios: PIKE_FULL_AUDIT_MATRIX,
  };

  await Deno.writeTextFile(OUTPUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  await Deno.writeTextFile(OUTPUT_MARKDOWN, `${toMarkdown()}\n`);
  console.log(`Wrote ${OUTPUT_MARKDOWN}`);
  console.log(`Wrote ${OUTPUT_JSON}`);
}

if (import.meta.main) {
  await main();
}
