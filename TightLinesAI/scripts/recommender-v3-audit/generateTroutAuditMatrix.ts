#!/usr/bin/env -S deno run --allow-read --allow-write

import {
  TROUT_AUDIT_ANCHORS,
  TROUT_CORE_MONTHLY_MATRIX,
  TROUT_FULL_AUDIT_MATRIX,
  TROUT_OVERLAY_MATRIX,
} from "./troutAuditMatrix.ts";

const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/trout-v3-audit-matrix.md";
const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/trout-v3-audit-matrix.json";

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
    const core = TROUT_CORE_MONTHLY_MATRIX.filter((scenario) => scenario.month === month).length;
    const overlays = TROUT_OVERLAY_MATRIX.filter((scenario) => scenario.month === month).length;
    lines.push(`| ${monthName(month)} | ${core} | ${overlays} | ${core + overlays} |`);
  }

  return lines.join("\n");
}

function anchorTable(): string {
  const lines = [
    "| Anchor | Role | Region | Context | Default clarity | Notes |",
    "|--------|------|--------|---------|-----------------|-------|",
  ];

  for (const anchor of TROUT_AUDIT_ANCHORS) {
    lines.push(
      `| ${anchor.label} | ${anchor.audit_role} | ${anchor.region_key} | ${anchor.context} | ${anchor.default_clarity} | ${anchor.notes} |`,
    );
  }

  return lines.join("\n");
}

function matrixScenarioLines(): string[] {
  return TROUT_FULL_AUDIT_MATRIX.map((scenario) =>
    `- ${scenario.id} | ${scenario.label} | ${scenario.region_key} | ${scenario.context} | ${scenario.local_date} | ${scenario.default_clarity} | ${scenario.matrix_role} | ${scenario.focus_window}`
  );
}

function toMarkdown(): string {
  return [
    "# Trout V3 Audit Matrix",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This matrix is the efficient trout tuning structure for V3.",
    "It extends the gold batches into a fixed river-only coverage grid:",
    "- 4 core river anchors run across all 12 months",
    "- 5 seasonal overlay anchors run across 4 high-value months each",
    "",
    `Total scenarios: ${TROUT_FULL_AUDIT_MATRIX.length}`,
    `Core monthly scenarios: ${TROUT_CORE_MONTHLY_MATRIX.length}`,
    `Overlay scenarios: ${TROUT_OVERLAY_MATRIX.length}`,
    "",
    "## Why This Is Faster",
    "",
    "- It pressures trout river logic across cold classic, western, Appalachian tailwater, and Pacific Northwest water without hand-picking every pass from scratch.",
    "- It keeps streamer-minded trout lanes under stress: sculpin, bugger, leech, slim-minnow, articulated baitfish, spinner, and restrained jerkbait support.",
    "- It forces warm-tailwater summer restraint and fall baitfish openings to coexist cleanly under one deterministic model.",
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
    total_scenarios: TROUT_FULL_AUDIT_MATRIX.length,
    core_monthly_count: TROUT_CORE_MONTHLY_MATRIX.length,
    overlay_count: TROUT_OVERLAY_MATRIX.length,
    anchors: TROUT_AUDIT_ANCHORS,
    scenarios: TROUT_FULL_AUDIT_MATRIX,
  };

  await Deno.writeTextFile(OUTPUT_JSON, `${JSON.stringify(payload, null, 2)}\n`);
  await Deno.writeTextFile(OUTPUT_MARKDOWN, `${toMarkdown()}\n`);
  console.log(`Wrote ${OUTPUT_MARKDOWN}`);
  console.log(`Wrote ${OUTPUT_JSON}`);
}

if (import.meta.main) {
  await main();
}
