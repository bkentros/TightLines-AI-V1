import {
  auditCurrentRiverRunPortfolio,
  type PortfolioOnboardingAudit,
} from "./lib/river-run-onboarding.ts";

const command = Deno.args[0] ?? "status";
const json = Deno.args.includes("--json");
const US_STATE_CODES = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

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
  const stage = valueFor("--stage") ?? "implementation";
  if (!["implementation", "owner-review", "release"].includes(stage)) {
    usage(
      "validate-packet --stage must be implementation, owner-review, or release.",
    );
  }
  const root = `${outputRoot.replace(/\/$/, "")}/${riverId}`;
  const relative = "river-onboarding.md";
  const path = `${root}/${relative}`;
  const blockingPatterns = [
    /`research_incomplete`/gi,
    /\|\s*unresolved\s*\|/gi,
    /(?:decision|status):\s*`blocked`/gi,
    /\{\{[^}]+\}\}/g,
  ];
  if (stage === "release") {
    blockingPatterns.push(
      /\|\s*pending\s*\|/gi,
      /\bwithheld\b/gi,
      /\bnot authorized\b/gi,
      /\bnot performed\b/gi,
    );
  }
  let errors = 0;
  let content: string;
  try {
    content = await Deno.readTextFile(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`ERROR missing onboarding dossier: ${path}`);
      Deno.exit(1);
    }
    throw error;
  }
  const acceptedStatuses = stage === "release"
    ? ["release_authorized", "released"]
    : stage === "owner-review"
    ? [
      "owner_review_ready",
      "owner_accepted_not_released",
      "release_authorized",
      "released",
    ]
    : [
      "hidden_implementation_ready",
      "owner_review_ready",
      "owner_accepted_not_released",
      "release_authorized",
      "released",
    ];
  const statusMatch = content.match(/^\*\*Status:\*\*\s*`([^`]+)`/m);
  if (!statusMatch || !acceptedStatuses.includes(statusMatch[1])) {
    console.error(
      `ERROR ${relative}: status must be one of ${
        acceptedStatuses.join(", ")
      } for the ${stage} gate.`,
    );
    errors++;
  }
  for (const pattern of blockingPatterns) {
    const matches = content.match(pattern) ?? [];
    if (matches.length) {
      console.error(
        `ERROR ${relative}: ${matches.length} unresolved marker(s) matching ${pattern.source}`,
      );
      errors += matches.length;
    }
  }
  if (!/https?:\/\/|`[^`/]+\/[^`]+`/.test(content)) {
    console.error(`ERROR ${relative}: no evidence URL or repository citation.`);
    errors++;
  }
  for (
    const [label, contract] of [
      ["identity and corridor", /## 2\. Identity and corridor/],
      ["barrier inventory", /## 4\. Barrier and passage inventory/],
      ["species passage chains", /## 5\. Species endpoints and passage chains/],
      ["regulations", /## 6\. Regulations/],
      ["source capability", /## 7\. Source and capability audit/],
      ["Spot Finder", /## 8\. Spot Finder/],
      [
        "candidate species/run matrix",
        /## 9\. Candidate species(?:\/run)? matrix/,
      ],
      ["run records", /## 10\. Species\/run records/],
      ["Activity tuning", /### Activity tuning and fixed replay/],
      ["configuration reconciliation", /## 11\. Configuration reconciliation/],
      ["acceptance and release", /## 12\. Acceptance and release record/],
      ["correction ledger", /## 13\. Correction and learning ledger/],
      ["contradiction review", /Contradiction search completed by\/date/],
      ["independent review", /Independent falsification review by\/date/],
      [
        "stage-by-block table",
        /^\|\s*Stage\s*\|\s*Block\s*\|\s*Usable days\s*\|\s*Samples\s*\|/m,
      ],
      [
        "calibration ledger",
        /^\|\s*Iteration\s*\|\s*Fields changed\s*\|/m,
      ],
    ] as const
  ) {
    if (!contract.test(content)) {
      console.error(
        `ERROR ${relative}: missing ${label}.`,
      );
      errors++;
    }
  }
  if (
    (stage === "owner-review" || stage === "release") &&
    /\*\*Target gate:\*\*/.test(content) &&
    !/### Owner-review digest/.test(content)
  ) {
    console.error(`${relative}: missing standardized owner-review digest.`);
    errors++;
  }
  if (errors > 0) {
    console.error(
      `River Run onboarding packet BLOCKED: ${errors} issue(s) across ${root}.`,
    );
    Deno.exit(1);
  }
  console.log(`River Run onboarding packet READY (${stage}): ${root}`);
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
  if (!state || !US_STATE_CODES.has(state)) {
    usage("init requires a valid two-letter U.S. --state code.");
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
  await Deno.mkdir(root, { recursive: true });
  const replacements: Record<string, string> = {
    "{{RIVER_ID}}": riverId,
    "{{RIVER_NAME}}": displayName,
    "{{STATE}}": state,
    "{{CREATED_ON}}": new Date().toISOString().slice(0, 10),
  };
  let dossier = dossierTemplate();
  for (const [token, value] of Object.entries(replacements)) {
    dossier = dossier.replaceAll(token, value);
  }
  await Deno.writeTextFile(`${root}/river-onboarding.md`, dossier);
  console.log(`Created River Run onboarding workspace: ${root}`);
  console.log(
    "Next gate: complete and approve the shared foundation/source/species sections in river-onboarding.md before run implementation.",
  );
}

function dossierTemplate(): string {
  return `# {{RIVER_NAME}} River Run Onboarding Dossier

**River ID:** \`{{RIVER_ID}}\`

**State:** \`{{STATE}}\`

**Created:** {{CREATED_ON}}

**Status:** \`research_incomplete\`

**Target gate:** \`owner_review_ready\`

**Guide:** \`docs/river_run_onboarding.md\`

## 1. Decisions and evidence ledger

**Foundation approval/version/date:**

**Run-truth approval/version/date:**

**Rendered owner acceptance/date:**

**Deployment authorization/date:**

**Public enablement authorization/date:**

**Contradiction search completed by/date:**

**Independent falsification review by/date:**

**Research cutoff and time-sensitive recheck triggers:**

| ID | Authority/title | URL/path | Published/updated | Event/data years | Page/table | Accessed | Facts supported | Geographic scope | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-001 |  |  |  |  |  |  |  |  |  |

## 2. Identity and corridor

| Field | Decision | Evidence IDs | Status |
| --- | --- | --- | --- |
| Official identity/aliases/exclusions |  |  | unresolved |
| Runtime region/schema fit |  |  | unresolved |
| Jurisdictions/presentation contexts |  |  | unresolved |
| Mouth/receiving water/timezone |  |  | unresolved |
| Downstream/upstream product termini and length |  |  | unresolved |
| Weather point and representation |  |  | unresolved |

## 3. Canonical reaches

| Reach ID | Public name | Downstream boundary | Upstream boundary | Order/role | Species access | Gauge represented | Evidence IDs |
| --- | --- | --- | --- | ---: | --- | --- | --- |
|  |  |  |  |  |  |  |  |

## 4. Barrier and passage inventory

| Barrier ID/name | Type/status/location | Operating/passage limits | Species passage | Product limit/closure | Verified | Evidence IDs | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  | unresolved |

## 5. Species endpoints and passage chains

| Species | Mouth-to-endpoint chain | Conservative endpoint | Physical endpoint vs opportunity distribution | Evidence IDs | Status |
| --- | --- | --- | --- | --- | --- |
| Chinook |  |  |  |  | unresolved |
| Coho |  |  |  |  | unresolved |
| Steelhead |  |  |  |  | unresolved |
| Lake-run brown trout |  |  |  |  | unresolved |

## 6. Regulations

| Authority/version | Reach/effective dates | Public reminder | Access/safety note | Recheck date | Evidence IDs | Status |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  | unresolved |

## 7. Source and capability audit

| Source/metric | IDs/location/reach | Live sample/unit/time/cadence | History/gaps/datum | Freshness/fault/recovery | Role: primary_scored/context_only/rejected | Evidence IDs | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  | unresolved |

| Capability | Decision and exact represented reach | Required calibration/artifact | Status |
| --- | --- | --- | --- |
| Gauge Read |  | freshness/trend/date-context/fault QA | unresolved |
| Historical-only water temperature |  | archive extraction, date-window/year-count QA, non-scoring proof, or explicit unavailability | unresolved |
| Fish Counts |  | live/in-season/final-season/retrospective class; source/fetch/publication/observation cadence; parser/revision/duplicate QA; or explicit unavailability | unresolved |
| Fishing Shape |  | bands and replay, or explicit unavailability | unresolved |
| Activity source pairing |  | observed compatibility or weather-only limitation | unresolved |

## 8. Spot Finder

**Decision:** \`unresolved\`

| Section ID/position | Foundation reaches | Boundary range | Eligible species | Fishing access IDs | Evidence IDs |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

| Access ID/name | Fishing access kinds | Detail/caution | Source URL/locator/label | Verified |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

| Authoritative access source | Named entries found | Included | Excluded | Exclusion reasons/reconciliation |
| --- | ---: | ---: | ---: | --- |
|  |  |  |  |  |

## 9. Candidate species/run matrix

Duplicate rows when one species has distinct seasonal or life-history runs. Do
not merge spring/fall Chinook, summer/winter Steelhead, or other materially
different runs merely because the species is the same.

| Candidate run | Occurs | Recurring run | Dependable opportunity | Endpoint supported | Calibration quality | Contradictions | Decision/evidence IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Owner-requested candidate — season/run type |  |  |  |  |  |  | unresolved |
| Management/stocking-plan candidate — season/run type |  |  |  |  |  |  | unresolved |

**Negative-search completion:** Record the applicable official fishery,
regulation, stocking, creel/assessment, facility, barrier, and recent technical
report classes checked for every unsupported or research-unresolved candidate.

## 10. Species/run records

Duplicate this subsection once for every supported run. Delete unused
candidate rows only after the contradiction/falsification audit is recorded.

### Run: SPECIES

**Capability decision:** \`unresolved\`

**Run/config/presence/Activity/Fishing Shape versions:**

**Code-to-packet reconciliation reviewer/date:**

| Configuration field | Value | Evidence/comparators | Calibration owner | Replay/test artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Identity/biology/run type/engine/lifecycle |  |  |  |  | unresolved |
| Primitive capabilities and legacy unavailable fields |  |  |  |  | unresolved |
| Species endpoint/Seasonal Zone reaches |  |  |  |  | unresolved |
| Presence maximum/distribution/curve/anchors |  |  |  |  | unresolved |
| Activity complete rule set |  |  |  |  | unresolved |
| Fishing Shape/baseline/temperature policy |  |  |  |  | unresolved |
| Research/source/audit fields |  |  |  |  | unresolved |

| Boundary | Date | Meaning | Evidence kind: entry/passage/harvest/spawn/egg-take/operation/calibration | Evidence IDs | Bias/owner calibration |
| --- | --- | --- | --- | --- | --- |
| preRunStart |  |  |  |  |  |
| stagingStart |  |  |  |  |  |
| start |  |  |  |  |  |
| beginningEnd |  |  |  |  |  |
| buildingEstablishedStart |  |  |  |  |  |
| buildingBroadStart (optional) |  |  |  |  |  |
| peakStart |  |  |  |  |  |
| peak |  |  |  |  |  |
| peakEnd |  |  |  |  |  |
| taperingEnd |  |  |  |  |  |
| end |  |  |  |  |  |
| lateEnd |  |  |  |  |  |
| postRunLateCopyEnd |  |  |  |  |  |

| Presence anchor offset/date | Fraction of maximum | Biological/observational reason | Evidence IDs |
| --- | ---: | --- | --- |
|  |  |  |  |

### Activity tuning and fixed replay

**Mode/source pairing/represented reach:**

**Fixed interval and coverage:**

**Missing hourly weather:** Unavailable with no score, blocks, or leader.

**Lifecycle/cap invariant result:**

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Beginning | all blocks |  |  |  |  |  |  |  |  |  |  |
| Building | all blocks |  |  |  |  |  |  |  |  |  |  |
| Peak | all blocks |  |  |  |  |  |  |  |  |  |  |
| Tapering | all blocks |  |  |  |  |  |  |  |  |  |  |
| Ending | all blocks |  |  |  |  |  |  |  |  |  |  |

Add the four named block rows under every stage plus residual/holding rows when
configured.

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline |  |  |  |  |  | unresolved |

## 11. Configuration reconciliation

| Config object/file | Dossier fields reconciled | Validator/replay/fixture result | Reviewer/date | Status |
| --- | --- | --- | --- | --- |
|  |  |  |  | pending |

## 12. Acceptance and release record

### Owner-review digest

**Hidden/public state:**

| Candidate/run | Decision | Exact Stage date ranges | Strength/distribution/confidence and comparators | Mean Activity by Stage/block | Replay interval/coverage | Terminal semantics |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

| Capability | Available metrics/source and represented reach | Scoring role | Completeness/QA | Important limitation or exclusion |
| --- | --- | --- | --- | --- |
| Gauge Read |  |  |  |  |
| Historical-only water temperature |  | none |  |  |
| Fish Counts |  | none |  |  |
| Fishing Shape |  |  |  |  |
| Spot Finder |  | none |  |  |

| Gate | Artifact/command | Result | Reviewer/date | Notes |
| --- | --- | --- | --- | --- |
| Foundation/source/species truth | this dossier | pending |  |  |
| Activity full replay and controlled tests |  | pending |  |  |
| Fishing Shape replay/unavailability |  | pending |  |  |
| Historical-only temperature context/unavailability |  | pending |  |  |
| Fish Counts semantics/parser/isolation/unavailability |  | pending |  |  |
| Seasonal Zone/Spot Finder alignment |  | pending |  |  |
| Configuration and packet validation |  | pending |  |  |
| Fixtures/copy/UI/visual/type QA |  | pending |  |  |
| Rendered owner acceptance |  | pending |  |  |
| Public registry/config source/migrations |  | pending |  |  |
| Deployment/full production smoke |  | pending |  |  |
| Atomic commit/remote parity/clean worktree |  | pending |  |  |

## 13. Correction and learning ledger

| Finding | Root cause | Structured truth/config corrected | Full reruns | General safeguard | Reviewer/date |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
`;
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
      "--river-id <snake_case> [--stage implementation|owner-review|release] " +
      "[--output-root <directory>]\n" +
      "  deno run --allow-read --allow-write scripts/river-run-onboarding.ts init " +
      "--river-id <snake_case> --display-name <name> --state <code> " +
      "[--output-root <directory>]",
  );
  Deno.exit(2);
}
