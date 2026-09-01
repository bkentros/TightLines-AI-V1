import {
  auditCurrentRiverRunPortfolio,
  PUBLIC_RIVER_RUN_PRIMITIVES,
} from "./lib/river-run-onboarding.ts";
import {
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  resolveRunStage,
  resolveSeasonalZone,
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
    const profile = RIVER_RUN_RUN_PROFILES.find((item) =>
      item.runId === run.runId
    );
    assert(
      profile?.seasonalZonePlan,
      `${run.runId} is missing its phase plan.`,
    );
    assert(
      profile.seasonalZonePlan.earlyApproach?.label,
      `${run.runId} is missing early-approach orientation.`,
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
  assert(run.seasonalZonePlan, `${run.runId} draft phase plan is missing.`);
  assert(
    run.seasonalZonePlan.earlyApproach?.label,
    `${run.runId} draft early approach is missing.`,
  );
  assert(
    !RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
    `${run.runId} leaked into the public run registry.`,
  );
}

for (
  const run of [...RIVER_RUN_RUN_PROFILES, ...RIVER_RUN_DRAFT_RUN_PROFILES]
) {
  const river = [
    ...RIVER_RUN_RIVER_PROFILES,
    ...RIVER_RUN_DRAFT_RIVER_PROFILES,
  ].find((item) => item.riverId === run.riverId);
  assert(river, `${run.runId} has no river for early-direction replay.`);
  const localDate = `2026-${run.runWindow.preRunStart}`;
  const stage = resolveRunStage(run, localDate);
  const zone = resolveSeasonalZone({ river, run, stage, localDate });
  assert(stage.stage === "pre_run", `${run.runId} pre-run replay drifted.`);
  assert(
    zone.earlyApproach?.phase === "before_migration",
    `${run.runId} omits early direction before staging.`,
  );
  assert(
    zone.earlyApproach.accessRecommendation === false,
    `${run.runId} incorrectly converts early direction into access.`,
  );
  assert(
    zone.foundationReachIds.length === 0,
    `${run.runId} recommends an in-river reach before migration.`,
  );
}

const onboardingGuidePath = "docs/river_run_onboarding.md";
const onboardingGuide = await Deno.readTextFile(onboardingGuidePath);
for (
  const [label, contract] of [
    ["single authority", /Single normative source of truth/],
    ["national scope", /release a U\.S\. River Run river/],
    [
      "three reads",
      /Migration Stage[\s\S]*Activity Outlook[\s\S]*Seasonal Presence/,
    ],
    [
      "unscored Gauge Read",
      /Gauge Read appears above the reads and is unscored/,
    ],
    [
      "Fishing Shape placement",
      /Fishing Shape is internal Fishability scoring displayed compactly inside Gauge/,
    ],
    [
      "retired copy",
      /`WHERE TO START`[\s\S]*`WHY THIS READ`[\s\S]*`GUIDE'S READ`/,
    ],
    ["evidence hierarchy", /Use this evidence hierarchy/],
    [
      "named onboarding statuses",
      /`research_incomplete`[\s\S]*`owner_review_ready`[\s\S]*`released`/,
    ],
    [
      "passage chains",
      /complete mouth-to-endpoint passage chain for each species/,
    ],
    [
      "managed transport boundary",
      /trap-and-haul[\s\S]*without establishing continuous natural passage/,
    ],
    ["calendar protocol", /Full calendar protocol/],
    ["strength protocol", /Strength and distribution/],
    ["Spot Finder fail closed", /Spot Finder is optional and fail-closed/],
    ["per-run seasonal geography", /versioned `seasonalZonePlan`/],
    ["early approach contract", /required sourced `earlyApproach`/],
    ["prominent Activity condition", /`ONLY IF FISH ARE PRESENT` prominently/],
    [
      "Seasonal Zone recommendation ownership",
      /Spot Finder recommends only audited sections whose `foundationReachIds`[\s\S]*seasonalZone\.foundationReachIds/,
    ],
    [
      "Spot Finder legal-season overlap",
      /Audit legal-season overlap for each species, section, and modeled run window/,
    ],
    [
      "historical-only temperature",
      /historical average with its year count[\s\S]*not a live sensor/,
    ],
    [
      "gauge role separation",
      /`primary_scored`[\s\S]*`context_only`[\s\S]*`rejected`/,
    ],
    [
      "tidal source isolation",
      /tidal or reversing-flow stations[\s\S]*specific normalization/,
    ],
    [
      "unmeasured Fishing Shape factors",
      /turbidity\/visibility[\s\S]*Never\s+infer them from discharge/,
    ],
    [
      "Fish Counts cadence separation",
      /app fetch\/check cadence[\s\S]*source publication cadence[\s\S]*observation-through date/,
    ],
    [
      "Fish Counts publication classes",
      /Live\/near-real-time counter[\s\S]*Retrospective annual research total/,
    ],
    [
      "Spot Finder source reconciliation",
      /Spot Finder completeness is an inventory reconciliation/,
    ],
    [
      "distinct seasonal runs",
      /spring and fall Chinook[\s\S]*summer\s+and winter Steelhead/,
    ],
    ["Activity tuning", /Activity tuning — mandatory per river\/run/],
    ["observed Activity", /Observed-river mode/],
    ["weather-only Activity", /Weather-only mode/],
    ["fixed replay", /Fixed historical replay/],
    ["stage/block review", /stage-by-block table/],
    ["owner-review digest", /standardized owner-review digest/],
    ["calibration ledger", /calibration ledger/],
    ["cross-year math", /Cross-year seasons/],
    ["provider recovery", /automatically restores the\s+metric/],
    [
      "unsupported burden",
      /An `unsupported` conclusion requires affirmative exclusion evidence/,
    ],
    [
      "single dossier",
      /Future onboarding uses one per-river `river-onboarding\.md` dossier/,
    ],
    [
      "release separation",
      /Research acceptance, rendered product acceptance, deployment authorization,[\s\S]*separate decisions/,
    ],
    ["migration reconciliation", /Reconcile local and[\s\S]*linked migrations/],
    ["clean handoff", /ahead\/behind is `0 0`[\s\S]*worktree is clean/],
  ] as const
) {
  assert(
    contract.test(onboardingGuide),
    `${onboardingGuidePath} is missing ${label}.`,
  );
}

for (
  const retiredPath of [
    "docs/river_run_rapid_onboarding_playbook.md",
    "docs/river_run_copy_model.md",
    "docs/river_run_activity_onboarding_standard.md",
    "docs/river_run_live_conditions_onboarding_standard.md",
    "docs/templates/river_run_river_foundation_template.md",
    "docs/templates/river_run_live_conditions_template.md",
    "docs/templates/river_run_species_run_template.md",
    "docs/templates/river_run_acceptance_template.md",
  ]
) {
  try {
    await Deno.lstat(retiredPath);
    throw new Error(
      `${retiredPath} must remain retired; onboarding has one active guide.`,
    );
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
}

const onboardingWorkbench = await Deno.readTextFile(
  "scripts/river-run-onboarding.ts",
);
assert(
  onboardingWorkbench.includes('const relative = "river-onboarding.md"') &&
    onboardingWorkbench.includes('"WA"') &&
    onboardingWorkbench.includes("valid two-letter U.S. --state code") &&
    onboardingWorkbench.includes("function dossierTemplate()") &&
    onboardingWorkbench.includes(
      "Deno.writeTextFile(`${root}/river-onboarding.md`, dossier)",
    ),
  "The onboarding workbench must scaffold and validate one river dossier.",
);
for (
  const requiredScaffoldPrompt of [
    "Historical-only water temperature",
    "Fish Counts",
    "Candidate species/run matrix",
    "distinct seasonal or life-history runs",
    "Authoritative access source",
    "Negative-search completion",
    "Early approach label",
    "Building established",
    "seasonalZonePlan/earlyApproach",
    "Owner-review digest",
    'stage === "release"',
  ]
) {
  assert(
    onboardingWorkbench.includes(requiredScaffoldPrompt),
    `The onboarding scaffold is missing ${requiredScaffoldPrompt}.`,
  );
}
assert(
  !/docs\/templates\/river_run_|runs\/fall-(?:chinook|coho|steelhead)\.md/.test(
    onboardingWorkbench,
  ),
  "The onboarding workbench must not depend on retired templates or hard-coded species packet files.",
);
for (
  const path of [
    "docs/finfindr_river_run_v1_simple_spec.md",
    "docs/river_run_rollout_plan.md",
  ]
) {
  const opening = (await Deno.readTextFile(path)).slice(0, 900);
  assert(
    /Historical|superseded/i.test(opening),
    `${path} must visibly identify its historical/superseded status.`,
  );
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
  `River Run onboarding QA passed: ${report.riverCount} public rivers/${report.runCount} public runs, ${RIVER_RUN_DRAFT_RIVER_PROFILES.length} pending rivers/${RIVER_RUN_DRAFT_RUN_PROFILES.length} pending runs, three public reads, Gauge Read/Fishing Shape capability checks, one canonical onboarding guide, and one-dossier scaffolding.`,
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
