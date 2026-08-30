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
  "grand",
  "platte",
  "white",
  "milwaukee",
  "sheboygan",
  "root",
  "bois_brule",
]);
const fourSpeciesRivers = new Set([
  "big_manistee",
  "milwaukee",
  "sheboygan",
  "root",
  "bois_brule",
]);
const expectedRunIds = new Set([
  "pere_marquette_fall_chinook",
  "pere_marquette_fall_coho",
  "pere_marquette_fall_steelhead",
  "big_manistee_fall_chinook",
  "big_manistee_fall_coho",
  "big_manistee_fall_steelhead",
  "big_manistee_fall_brown_trout",
  "muskegon_fall_chinook",
  "muskegon_fall_coho",
  "muskegon_fall_steelhead",
  "st_joseph_fall_chinook",
  "st_joseph_fall_coho",
  "st_joseph_fall_steelhead",
  "betsie_fall_chinook",
  "betsie_fall_coho",
  "betsie_fall_steelhead",
  "grand_fall_chinook",
  "grand_fall_coho",
  "grand_fall_steelhead",
  "platte_fall_chinook",
  "platte_fall_coho",
  "platte_fall_steelhead",
  "white_fall_chinook",
  "white_fall_coho",
  "white_fall_steelhead",
  "milwaukee_fall_chinook",
  "milwaukee_fall_coho",
  "milwaukee_fall_steelhead",
  "milwaukee_fall_brown_trout",
  "sheboygan_fall_chinook",
  "sheboygan_fall_coho",
  "sheboygan_fall_steelhead",
  "sheboygan_fall_brown_trout",
  "root_fall_chinook",
  "root_fall_coho",
  "root_fall_steelhead",
  "root_fall_brown_trout",
  "bois_brule_fall_chinook",
  "bois_brule_fall_coho",
  "bois_brule_fall_steelhead",
  "bois_brule_fall_brown_trout",
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
  report.riverCount === 12,
  `Expected 12 rivers, received ${report.riverCount}.`,
);
assert(
  report.runCount === 41,
  `Expected 41 runs, received ${report.runCount}.`,
);
for (const river of report.rivers) {
  assert(
    expectedRivers.delete(river.riverId),
    `Unexpected or duplicate river ${river.riverId}.`,
  );
  assert(
    river.runs.length === (fourSpeciesRivers.has(river.riverId) ? 4 : 3),
    `${river.riverId} exposes an unexpected species count.`,
  );
  assert(
    JSON.stringify(river.publicPrimitiveOrder) ===
      JSON.stringify(PUBLIC_RIVER_RUN_PRIMITIVES),
    `${river.riverId} public primitive order drifted.`,
  );
  for (const run of river.runs) {
    assert(
      expectedRunIds.delete(run.runId),
      `Unexpected or duplicate public run ${run.runId}.`,
    );
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
  expectedRunIds.size === 0,
  `Missing public runs: ${[...expectedRunIds].join(", ")}`,
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
    /Calendar evidence protocol/,
    /Strength and distribution protocol/,
    /Same-reach source decision/,
    /Fast execution protocol/,
    /Post-review correction and continuous-learning protocol/,
    /Every hidden run approved for owner review must also be selectable/,
    /Review copy cadence separately from score cadence/,
    /Stage selector must expose every date on which Stage copy can\s+change/,
    /Owner review has two separate modes/,
    /fixture\s+measurements are never substituted/,
    /cross December into January/,
    /automatically resume normal[\s\S]*fresh display and scoring/,
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
    /no numeric score, no blocks, and no strongest-window language/,
    /local-date and year-aware/,
  ],
  "docs/river_run_live_conditions_onboarding_standard.md": [
    /target calendar date ±3 days/,
    /Twenty-four-hour trend/,
    /Current-value precision/,
    /automatically restore the metric/,
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
    ["species endpoint decision", /Species-specific endpoint decision/],
    ["portfolio strength comparison", /Portfolio strength comparison/],
    ["calendar evidence-kind audit", /Evidence kind: entry\/passage\/harvest/],
    ["Activity source pairing", /Source pairing decision/],
    ["missing-weather truth", /Missing hourly weather/],
    ["review learning record", /Post-review correction record/],
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
const foundationTemplate = await Deno.readTextFile(
  "docs/templates/river_run_river_foundation_template.md",
);
for (
  const [label, contract] of [
    ["runtime region gate", /Runtime region\/schema fit/],
    ["species passage chain", /Species endpoint and passage-chain decision/],
    [
      "shared species matrix",
      /Supported species decision and shared comparison matrix/,
    ],
    ["provider recovery", /automatically without a code\/configuration change/],
  ] as const
) {
  assert(
    contract.test(foundationTemplate),
    `River foundation template is missing ${label}.`,
  );
}
const liveConditionsTemplate = await Deno.readTextFile(
  "docs/templates/river_run_live_conditions_template.md",
);
assert(
  /Provider malfunction fails closed/.test(liveConditionsTemplate) &&
    /Recovered valid numeric reading automatically restores/.test(
      liveConditionsTemplate,
    ),
  "Live Conditions template is missing provider fault/recovery cases.",
);
const acceptanceTemplate = await Deno.readTextFile(
  "docs/templates/river_run_acceptance_template.md",
);
for (
  const [label, contract] of [
    [
      "calendar reconciliation gate",
      /calendar evidence-kind\/bias reconciliation/,
    ],
    [
      "strength comparison gate",
      /Strength\/distribution portfolio comparisons/,
    ],
    ["source-pairing gate", /same-reach source-pairing decision/],
    ["cross-year replay gate", /Cross-year replay math/],
    ["missing-weather gate", /Missing-weather unavailable\/no-leader behavior/],
    [
      "provider recovery gate",
      /Provider-fault recovery to valid numeric display/,
    ],
    ["hidden-review catalog parity gate", /Hidden-review catalog parity/],
    ["daily copy progression gate", /Daily copy\/reach-progression replay/],
    [
      "stage fixture boundary gate",
      /Stage fixture selector exposes every copy-transition boundary/,
    ],
    ["live review Gauge Read gate", /Gauge Read uses live providers/],
    [
      "fixture isolation gate",
      /isolates provider inputs from scenario fixtures/,
    ],
    [
      "generalized learning ledger",
      /Post-review correction and generalized-learning ledger/,
    ],
  ] as const
) {
  assert(
    contract.test(acceptanceTemplate),
    `Acceptance template is missing ${label}.`,
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
  `River Run onboarding QA passed: ${report.riverCount} public rivers/${report.runCount} public runs, ${RIVER_RUN_DRAFT_RIVER_PROFILES.length} pending rivers/${RIVER_RUN_DRAFT_RUN_PROFILES.length} pending runs, four public primitives, Live Conditions capability checks, canonical standards, and scaffold templates.`,
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
