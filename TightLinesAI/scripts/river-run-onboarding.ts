import {
  auditCurrentRiverRunPortfolio,
  type PortfolioOnboardingAudit,
} from "./lib/river-run-onboarding.ts";

const command = Deno.args[0] ?? "status";
const json = Deno.args.includes("--json");

if (command === "status" || command === "validate" || command === "audit") {
  const report = auditCurrentRiverRunPortfolio();
  if (json || command === "audit") {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printStatus(report);
  }
  if (report.status === "blocked") Deno.exit(1);
} else if (command === "init") {
  await scaffold();
} else if (command === "validate-packet") {
  await validatePacket();
} else {
  usage(`Unknown command: ${command}`);
}

async function validatePacket(): Promise<void> {
  const riverId = valueFor("--river-id");
  if (!riverId || !/^[a-z][a-z0-9_]*$/.test(riverId)) {
    usage("validate-packet requires --river-id using lowercase snake_case.");
  }
  const outputRoot = valueFor("--output-root") ??
    "docs/onboarding/river-run";
  const root = `${outputRoot.replace(/\/$/, "")}/${riverId}`;
  const files = [
    "river-foundation.md",
    "live-conditions.md",
    "runs/fall-chinook.md",
    "runs/fall-coho.md",
    "runs/fall-steelhead.md",
    "acceptance.md",
  ];
  const blockingPatterns = [
    /`research_incomplete`/gi,
    /\|\s*unresolved\s*\|/gi,
    /\|\s*pending\s*\|/gi,
    /(?:decision|status):\s*`blocked`/gi,
    /\{\{[^}]+\}\}/g,
  ];
  let errors = 0;
  for (const relative of files) {
    const path = `${root}/${relative}`;
    let content: string;
    try {
      content = await Deno.readTextFile(path);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.error(`ERROR missing onboarding packet file: ${path}`);
        errors++;
        continue;
      }
      throw error;
    }
    for (const pattern of blockingPatterns) {
      const matches = content.match(pattern) ?? [];
      if (matches.length) {
        console.error(
          `ERROR ${relative}: ${matches.length} unresolved template marker(s) matching ${pattern.source}`,
        );
        errors += matches.length;
      }
    }
    if (!/https?:\/\/|`[^`/]+\/[^`]+`/.test(content)) {
      console.error(
        `ERROR ${relative}: no evidence URL or repository-path citation found.`,
      );
      errors++;
    }
    if (
      relative.startsWith("runs/") &&
      (!content.includes("## 0. Candidate capability audit") ||
        !content.includes("### 1.1 Complete configuration-field inventory") ||
        !content.includes("**Code-to-packet reconciliation reviewer/date:**") ||
        !/^\|\s*Stage\s*\|\s*Block\s*\|\s*Usable days\s*\|\s*Samples\s*\|/m
          .test(content) ||
        !/^\|\s*Iteration\s*\|\s*Fields changed\s*\|/m.test(content) ||
        !/\*\*Capability decision:\*\*/.test(content) ||
        !/\*\*Contradiction search\s+completed by\/date:\*\*/.test(content) ||
        !/\*\*Independent falsification review\s+by\/date:\*\*/.test(content))
    ) {
      console.error(
        `ERROR ${relative}: missing mandatory capability, complete-config, Activity stage/block, calibration-ledger, or contradiction audit.`,
      );
      errors++;
    }
    if (
      relative === "acceptance.md" &&
      (!content.includes("Code-to-packet configuration-field reconciliation") ||
        !content.includes(
          "Activity stage-by-block distributions and iteration ledger",
        ))
    ) {
      console.error(
        `ERROR ${relative}: missing complete-config or Activity replay acceptance gate.`,
      );
      errors++;
    }
  }
  if (errors > 0) {
    console.error(
      `River Run onboarding packet BLOCKED: ${errors} issue(s) across ${root}.`,
    );
    Deno.exit(1);
  }
  console.log(`River Run onboarding packet READY: ${root}`);
}

function printStatus(report: PortfolioOnboardingAudit): void {
  console.log(
    `River Run onboarding portfolio: ${report.status.toUpperCase()} · ` +
      `${report.riverCount} rivers · ${report.runCount} runs · ` +
      `${report.errorCount} errors · ${report.warningCount} warnings`,
  );
  for (const river of report.rivers) {
    const metrics = river.liveConditions.expectedMetrics.length
      ? river.liveConditions.expectedMetrics.join(", ")
      : "no accepted live metrics";
    console.log(
      `- ${river.displayName}: ${river.status} · ${river.runs.length} runs · ${metrics}`,
    );
    for (const run of river.runs) {
      console.log(`  - ${run.runId}: Activity ${run.activityMode}`);
      for (
        const item of run.findings.filter((finding) =>
          finding.severity !== "info"
        )
      ) {
        console.log(
          `    ${item.severity.toUpperCase()} ${item.gate}/${item.field}: ${item.message}`,
        );
      }
    }
    for (
      const item of river.findings.filter((finding) =>
        finding.severity !== "info"
      )
    ) {
      console.log(
        `  ${item.severity.toUpperCase()} ${item.gate}/${item.field}: ${item.message}`,
      );
    }
  }
}

async function scaffold(): Promise<void> {
  const riverId = valueFor("--river-id");
  const displayName = valueFor("--display-name");
  const state = valueFor("--state");
  if (!riverId || !/^[a-z][a-z0-9_]*$/.test(riverId)) {
    usage("init requires --river-id using lowercase snake_case.");
  }
  if (!displayName) usage("init requires --display-name.");
  if (!state || !["MI", "WI", "IL", "IN", "OH", "PA", "NY"].includes(state)) {
    usage("init requires a supported Great Lakes --state.");
  }
  const outputRoot = valueFor("--output-root") ??
    "docs/onboarding/river-run";
  const root = `${outputRoot.replace(/\/$/, "")}/${riverId}`;
  try {
    await Deno.lstat(root);
    console.error(
      `ERROR ${root} already exists. The scaffolder never overwrites onboarding research.`,
    );
    Deno.exit(1);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
  await Deno.mkdir(`${root}/runs`, { recursive: true });
  const replacements: Record<string, string> = {
    "{{RIVER_ID}}": riverId,
    "{{RIVER_NAME}}": displayName,
    "{{STATE}}": state,
    "{{CREATED_ON}}": new Date().toISOString().slice(0, 10),
  };
  await renderTemplate(
    "docs/templates/river_run_river_foundation_template.md",
    `${root}/river-foundation.md`,
    replacements,
  );
  await renderTemplate(
    "docs/templates/river_run_live_conditions_template.md",
    `${root}/live-conditions.md`,
    replacements,
  );
  for (const species of ["chinook", "coho", "steelhead"]) {
    await renderTemplate(
      "docs/templates/river_run_species_run_template.md",
      `${root}/runs/fall-${species}.md`,
      { ...replacements, "{{SPECIES}}": species },
    );
  }
  await renderTemplate(
    "docs/templates/river_run_acceptance_template.md",
    `${root}/acceptance.md`,
    replacements,
  );
  console.log(`Created River Run onboarding workspace: ${root}`);
  console.log(
    "Next gate: complete and approve river-foundation.md before run implementation.",
  );
}

async function renderTemplate(
  source: string,
  destination: string,
  replacements: Record<string, string>,
): Promise<void> {
  let content = await Deno.readTextFile(source);
  for (const [token, value] of Object.entries(replacements)) {
    content = content.replaceAll(token, value);
  }
  await Deno.writeTextFile(destination, content);
}

function valueFor(flag: string): string | undefined {
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] : undefined;
}

function usage(message?: string): never {
  if (message) console.error(message);
  console.error(
    "Usage:\n" +
      "  deno run --allow-read scripts/river-run-onboarding.ts status [--json]\n" +
      "  deno run --allow-read scripts/river-run-onboarding.ts validate [--json]\n" +
      "  deno run --allow-read scripts/river-run-onboarding.ts audit\n" +
      "  deno run --allow-read scripts/river-run-onboarding.ts validate-packet " +
      "--river-id <snake_case> [--output-root <directory>]\n" +
      "  deno run --allow-read --allow-write scripts/river-run-onboarding.ts init " +
      "--river-id <snake_case> --display-name <name> --state <code> " +
      "[--output-root <directory>]",
  );
  Deno.exit(2);
}
