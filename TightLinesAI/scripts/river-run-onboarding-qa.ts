import {
  auditCurrentRiverRunPortfolio,
  PUBLIC_RIVER_RUN_PRIMITIVES,
} from "./lib/river-run-onboarding.ts";
import {
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  validateRiverProfile,
  validateRunProfile,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const report = auditCurrentRiverRunPortfolio(
  undefined,
  "2026-08-24T00:00:00.000Z",
);
const expectedRivers = new Set([
  "pere_marquette",
  "betsie",
  "big_manistee",
  "muskegon",
  "st_joseph",
]);

assert(report.status === "ready", JSON.stringify(report, null, 2));
assert(
  report.errorCount === 0,
  "Existing portfolio must have no onboarding errors.",
);
assert(
  report.warningCount === 0,
  "Existing portfolio must have no noisy onboarding warnings.",
);
assert(
  report.riverCount === 5,
  `Expected 5 rivers, received ${report.riverCount}.`,
);
assert(
  report.runCount === 15,
  `Expected 15 runs, received ${report.runCount}.`,
);
for (const river of report.rivers) {
  assert(
    expectedRivers.delete(river.riverId),
    `Unexpected or duplicate river ${river.riverId}.`,
  );
  assert(
    river.runs.length === 3,
    `${river.riverId} must expose all three current species.`,
  );
  assert(
    JSON.stringify(river.publicPrimitiveOrder) ===
      JSON.stringify(PUBLIC_RIVER_RUN_PRIMITIVES),
    `${river.riverId} public primitive order drifted.`,
  );
  for (const run of river.runs) {
    assert(run.publicAuditEnabled, `${run.runId} public audit is disabled.`);
    assert(
      run.activityMode !== "unavailable",
      `${run.runId} Activity is unavailable.`,
    );
  }
  if (river.riverId === "betsie") {
    assert(
      river.liveConditions.expectedMetrics.length === 0,
      "Betsie must remain an explicit no-gauge Live Conditions case.",
    );
    assert(
      river.runs.every((run) => run.activityMode === "weather_only"),
      "Betsie Activity must remain explicitly weather-only.",
    );
  } else {
    assert(
      river.liveConditions.expectedMetrics.length > 0,
      `${river.riverId} should expose accepted Live Conditions metrics.`,
    );
  }
}
assert(
  expectedRivers.size === 0,
  `Missing rivers: ${[...expectedRivers].join(", ")}`,
);
assert(
  RIVER_RUN_DRAFT_RIVER_PROFILES.length === 3,
  "Expected Grand, Platte, and White hidden draft foundations.",
);
assert(
  RIVER_RUN_DRAFT_RUN_PROFILES.length === 9,
  "Expected nine supported hidden draft runs.",
);
for (const river of RIVER_RUN_DRAFT_RIVER_PROFILES) {
  const result = validateRiverProfile(river);
  assert(result.valid, `${river.riverId} draft foundation is invalid.`);
}
for (const run of RIVER_RUN_DRAFT_RUN_PROFILES) {
  const river = RIVER_RUN_DRAFT_RIVER_PROFILES.find((item) =>
    item.riverId === run.riverId
  );
  assert(river, `${run.runId} draft river is missing.`);
  const result = validateRunProfile(run, river);
  assert(result.valid, `${run.runId} draft is invalid.`);
  assert(!result.publicVisible, `${run.runId} must remain hidden.`);
  assert(
    !RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
    `${run.runId} leaked into the public run registry.`,
  );
}

const requiredDocuments: Record<string, RegExp[]> = {
  "docs/river_run_rapid_onboarding_playbook.md": [
    /Normative source of truth/,
    /Migration Stage[\s\S]*Activity[\s\S]*Fish In River[\s\S]*Fishability/,
    /Live Conditions[\s\S]*unscored/,
    /Multi-agent operating protocol/,
    /Mandatory candidate capability audit/,
    /Mandatory configuration-field inventory/,
    /stage-by-four-hour-block score distributions/,
    /An `unsupported` decision requires affirmative exclusion evidence/,
    /Acceptance, deployment, and public enablement/,
  ],
  "docs/river_run_copy_model.md": [
    /\*\*Version:\*\* 2\.0/,
    /four visible primitives/,
    /Live Conditions \/ Gauge Read/,
  ],
  "docs/river_run_activity_onboarding_standard.md": [
    /Today\/tomorrow schedule contract/,
    /Historical replay protocol/,
    /Stage-by-block acceptance table/,
    /Calibration iteration ledger/,
    /Weather-only mode/,
  ],
  "docs/river_run_live_conditions_onboarding_standard.md": [
    /target calendar date ±3 days/,
    /Twenty-four-hour trend/,
    /Current-value precision/,
  ],
};
for (const [path, patterns] of Object.entries(requiredDocuments)) {
  const content = await Deno.readTextFile(path);
  for (const pattern of patterns) {
    assert(
      pattern.test(content),
      `${path} is missing required contract ${pattern}.`,
    );
  }
}
for (
  const path of [
    "docs/finfindr_river_run_v1_simple_spec.md",
    "docs/river_run_onboarding_template.md",
    "docs/river_run_agent_handoff.md",
    "docs/river_run_rollout_plan.md",
  ]
) {
  const opening = (await Deno.readTextFile(path)).slice(0, 900);
  assert(
    /Historical|superseded/i.test(opening),
    `${path} must visibly identify its historical/superseded status.`,
  );
}
const speciesTemplate = await Deno.readTextFile(
  "docs/templates/river_run_species_run_template.md",
);
for (
  const [label, contract] of [
    [
      "complete configuration inventory",
      /Complete configuration-field inventory/,
    ],
    [
      "code-to-packet reconciliation",
      /Code-to-packet reconciliation reviewer\/date/,
    ],
    [
      "stage-by-block table",
      /^\|\s*Stage\s*\|\s*Block\s*\|\s*Usable days\s*\|\s*Samples\s*\|/m,
    ],
    [
      "calibration iteration ledger",
      /^\|\s*Iteration\s*\|\s*Fields changed\s*\|/m,
    ],
  ] as const
) {
  assert(
    contract.test(speciesTemplate),
    `Species run template is missing ${label}.`,
  );
}
for (
  const path of [
    "docs/templates/river_run_river_foundation_template.md",
    "docs/templates/river_run_live_conditions_template.md",
    "docs/templates/river_run_species_run_template.md",
    "docs/templates/river_run_acceptance_template.md",
  ]
) {
  const content = await Deno.readTextFile(path);
  assert(content.includes("{{RIVER_ID}}"), `${path} is not scaffold-ready.`);
}
const riverRunScreen = await Deno.readTextFile("app/river-run.tsx");
const primitiveTabs = riverRunScreen.match(
  /const PRIMITIVE_TABS:[\s\S]*?\n\];/,
);
assert(primitiveTabs, "River Run screen is missing its primitive registry.");
assert(
  JSON.stringify(
    [...primitiveTabs[0].matchAll(/id: "([^"]+)"/g)].map((match) => match[1]),
  ) === JSON.stringify(PUBLIC_RIVER_RUN_PRIMITIVES),
  "Onboarding primitive order must match the actual River Run UI registry.",
);
console.log(
  `River Run onboarding QA passed: ${report.riverCount} public rivers/${report.runCount} public runs plus ${RIVER_RUN_DRAFT_RIVER_PROFILES.length} hidden draft rivers/${RIVER_RUN_DRAFT_RUN_PROFILES.length} hidden draft runs, four public primitives, Live Conditions capability checks, canonical standards, and scaffold templates.`,
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
