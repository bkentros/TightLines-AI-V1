#!/usr/bin/env -S deno run --allow-read --allow-write

import {
  LARGEMOUTH_AUDIT_ANCHORS,
  LARGEMOUTH_CORE_MONTHLY_MATRIX,
  LARGEMOUTH_FULL_AUDIT_MATRIX,
  LARGEMOUTH_OVERLAY_MATRIX,
} from "./largemouthAuditMatrix.ts";
import { LARGEMOUTH_V3_GOLD_BATCH_1_IDS } from "../recommenderCalibrationScenarios.ts";

const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/largemouth-v3-audit-matrix.md";
const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/largemouth-v3-audit-matrix.json";

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
    const core = LARGEMOUTH_CORE_MONTHLY_MATRIX.filter((scenario) => scenario.month === month).length;
    const overlays = LARGEMOUTH_OVERLAY_MATRIX.filter((scenario) => scenario.month === month).length;
    lines.push(`| ${monthName(month)} | ${core} | ${overlays} | ${core + overlays} |`);
  }

  return lines.join("\n");
}

function anchorTable(): string {
  const lines = [
    "| Anchor | Role | Region | Context | Default clarity | Notes |",
    "|--------|------|--------|---------|-----------------|-------|",
  ];

  for (const anchor of LARGEMOUTH_AUDIT_ANCHORS) {
    lines.push(
      `| ${anchor.label} | ${anchor.audit_role} | ${anchor.region_key} | ${anchor.context} | ${anchor.default_clarity} | ${anchor.notes} |`,
    );
  }

  return lines.join("\n");
}

function matrixScenarioLines(): string[] {
  return LARGEMOUTH_FULL_AUDIT_MATRIX.map((scenario) => {
    const alreadyInBatch1 = LARGEMOUTH_V3_GOLD_BATCH_1_IDS.includes(
      scenario.id as typeof LARGEMOUTH_V3_GOLD_BATCH_1_IDS[number],
    );
    return `- ${scenario.id} | ${scenario.label} | ${scenario.region_key} | ${scenario.context} | ${scenario.local_date} | ${scenario.default_clarity} | ${scenario.matrix_role} | ${scenario.focus_window}${alreadyInBatch1 ? " | batch1" : ""}`;
  });
}

function toMarkdown(): string {
  return [
    "# Largemouth V3 Audit Matrix",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This matrix is the efficient largemouth tuning structure for V3.",
    "It replaces ad-hoc scenario picking with a fixed coverage grid:",
    "- 4 core anchors run across all 12 months",
    "- 5 seasonal overlay anchors run across 4 high-value months each",
    "",
    `Total scenarios: ${LARGEMOUTH_FULL_AUDIT_MATRIX.length}`,
    `Core monthly scenarios: ${LARGEMOUTH_CORE_MONTHLY_MATRIX.length}`,
    `Overlay scenarios: ${LARGEMOUTH_OVERLAY_MATRIX.length}`,
    "",
    "## Why This Is Faster",
    "",
    "- It gives us monthly seasonal coverage without having to hand-pick every next batch from scratch.",
    "- It keeps the most important largemouth archetypes under pressure: tropical lake, reservoir, river, northern clear lake, grass lake, highland reservoir, Delta, and shad reservoirs.",
    "- It lets us tune one failure class against a stable matrix instead of chasing random scenario drift.",
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
    total_scenarios: LARGEMOUTH_FULL_AUDIT_MATRIX.length,
    core_monthly_count: LARGEMOUTH_CORE_MONTHLY_MATRIX.length,
    overlay_count: LARGEMOUTH_OVERLAY_MATRIX.length,
    anchors: LARGEMOUTH_AUDIT_ANCHORS,
    scenarios: LARGEMOUTH_FULL_AUDIT_MATRIX,
  };

  await Deno.writeTextFile(OUTPUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  await Deno.writeTextFile(OUTPUT_MARKDOWN, `${toMarkdown()}\n`);
  console.log(`Wrote ${OUTPUT_MARKDOWN}`);
  console.log(`Wrote ${OUTPUT_JSON}`);
}

if (import.meta.main) {
  await main();
}
