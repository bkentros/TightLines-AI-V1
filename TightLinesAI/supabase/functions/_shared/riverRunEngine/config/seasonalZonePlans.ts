import type {
  AuditedRiverRunProfile,
  RiverRunProfile,
  SeasonalZonePhasePlan,
  SeasonalZonePlan,
} from "../types.ts";

type PlanInput = {
  approach: string;
  source: string;
  phases: SeasonalZonePhasePlan;
  rationale: string;
};

const THREE_REACH_SPAWNER = (
  lower: string,
  middle: string,
  upper: string,
): SeasonalZonePhasePlan => ({
  beginning: [lower],
  buildingEarly: [lower],
  buildingEstablished: [lower, middle],
  buildingBroad: [lower, middle, upper],
  peak: [lower, middle, upper],
  tapering: [middle, upper],
  ending: [middle, upper],
});

const THREE_REACH_LIVING = (
  lower: string,
  middle: string,
  upper: string,
): SeasonalZonePhasePlan => ({
  ...THREE_REACH_SPAWNER(lower, middle, upper),
  tapering: [lower, middle, upper],
  ending: [lower, middle, upper],
});

const TWO_REACH_SPAWNER = (
  lower: string,
  upper: string,
): SeasonalZonePhasePlan => ({
  beginning: [lower],
  buildingEarly: [lower],
  buildingEstablished: [lower, upper],
  buildingBroad: [lower, upper],
  peak: [lower, upper],
  tapering: [upper],
  ending: [upper],
});

const TWO_REACH_LIVING = (
  lower: string,
  upper: string,
): SeasonalZonePhasePlan => ({
  ...TWO_REACH_SPAWNER(lower, upper),
  tapering: [lower, upper],
  ending: [lower, upper],
});

const plans: Record<string, PlanInput> = {};

function assign(
  runIds: string[],
  shared: Omit<PlanInput, "rationale">,
  rationale: (runId: string) => string,
) {
  for (const runId of runIds) {
    plans[runId] = { ...shared, rationale: rationale(runId) };
  }
}

function auditedRationale(runId: string, distinction: string): string {
  return `${runId} was reconciled against its independent calendar, species endpoint, distribution scope, canonical reaches, existing primary-source record, and access inventory. ${distinction} Reach IDs are broad seasonal orientation only and never assert live fish location or equal distribution.`;
}

// Pere Marquette: lake/harbor approach, then the three named inland-mainstem
// sections. Salmon consolidate in established middle/upper water late; living
// fall-entry Steelhead retain a full-corridor holding context.
assign(
  ["pere_marquette_fall_chinook", "pere_marquette_fall_coho"],
  {
    approach:
      "Lake Michigan off Ludington, Ludington harbor, Pere Marquette Lake, and the mainstem mouth",
    source: "docs/river_run_pm_copy_foundation.md sections 2 and 4.1",
    phases: THREE_REACH_SPAWNER(
      "pm_lower_mainstem",
      "pm_middle_mainstem",
      "pm_upper_mainstem",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Late salmon orientation favors established middle and upper mainstem water.",
    ),
);
assign(
  ["pere_marquette_fall_steelhead"],
  {
    approach:
      "Lake Michigan off Ludington, Ludington harbor, Pere Marquette Lake, and the mainstem mouth",
    source: "docs/river_run_pm_copy_foundation.md sections 2, 4.1, and 10.3",
    phases: THREE_REACH_LIVING(
      "pm_lower_mainstem",
      "pm_middle_mainstem",
      "pm_upper_mainstem",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Steelhead are living fall entrants, so late orientation does not force them into a salmon-style terminal concentration.",
    ),
);

// Betsie: an intentionally short two-section product corridor.
assign(
  ["betsie_fall_chinook", "betsie_fall_coho"],
  {
    approach:
      "Lake Michigan, Frankfort and Elberta harbor, Betsie Lake, and the lake-to-river transition",
    source: "docs/river_run_betsie_copy_foundation.md sections 2, 3, and 8",
    phases: TWO_REACH_SPAWNER(
      "betsie_lake_to_us31",
      "betsie_us31_to_homestead",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "The two-reach plan avoids inventing a middle river and keeps the signed Homestead closure as the endpoint.",
    ),
);
assign(
  ["betsie_fall_steelhead"],
  {
    approach:
      "Lake Michigan, Frankfort and Elberta harbor, Betsie Lake, and the lake-to-river transition",
    source: "docs/river_run_betsie_copy_foundation.md sections 2, 3, and 8",
    phases: TWO_REACH_LIVING(
      "betsie_lake_to_us31",
      "betsie_us31_to_homestead",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Living Steelhead retain both legal sections late in the tracked fall-entry window.",
    ),
);

// Big Manistee and Muskegon: long regulated corridors where salmon progress
// from lakeward entry water toward established middle/tailwater reaches.
assign(
  [
    "big_manistee_fall_chinook",
    "big_manistee_fall_coho",
    "big_manistee_fall_brown_trout",
  ],
  {
    approach: "Manistee Lake, Manistee harbor, and the river entrance",
    source: "docs/river_run_big_manistee_copy_foundation.md sections 2 and 8",
    phases: THREE_REACH_SPAWNER(
      "big_manistee_bear_creek_to_m55",
      "big_manistee_high_bridge_to_bear_creek",
      "big_manistee_tippy_tailwater",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Late spawning orientation emphasizes established middle river and Tippy tailwater water without crossing Tippy Dam.",
    ),
);
assign(
  ["big_manistee_fall_steelhead"],
  {
    approach: "Manistee Lake, Manistee harbor, and the river entrance",
    source: "docs/river_run_big_manistee_copy_foundation.md sections 2 and 8",
    phases: THREE_REACH_LIVING(
      "big_manistee_bear_creek_to_m55",
      "big_manistee_high_bridge_to_bear_creek",
      "big_manistee_tippy_tailwater",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "The living fall-entry profile keeps fresh lower/middle fish and established tailwater fish in scope late.",
    ),
);
assign(
  ["muskegon_fall_chinook", "muskegon_fall_coho"],
  {
    approach:
      "Lake Michigan, the Muskegon channel, Muskegon Lake, and the river entrance",
    source: "docs/river_run_muskegon_copy_foundation.md sections 2 and 8",
    phases: THREE_REACH_SPAWNER(
      "muskegon_lake_to_m120",
      "muskegon_m120_to_newaygo",
      "muskegon_croton_tailwater",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Late salmon orientation emphasizes the middle river and Croton tailwater below the hard barrier.",
    ),
);
assign(
  ["muskegon_fall_steelhead"],
  {
    approach:
      "Lake Michigan, the Muskegon channel, Muskegon Lake, and the river entrance",
    source: "docs/river_run_muskegon_copy_foundation.md sections 2 and 8",
    phases: THREE_REACH_LIVING(
      "muskegon_lake_to_m120",
      "muskegon_m120_to_newaygo",
      "muskegon_croton_tailwater",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Living Steelhead retain fresh-entry and established holding sections across the fall-entry tail.",
    ),
);

// St. Joseph has six named reaches and two state presentations. Peak and late
// plans deliberately retain both states while Beginning stays lakeward.
const stJoeSpawner: SeasonalZonePhasePlan = {
  beginning: ["st_joseph_lower_michigan"],
  buildingEarly: ["st_joseph_lower_michigan", "st_joseph_middle_michigan"],
  buildingEstablished: [
    "st_joseph_middle_michigan",
    "st_joseph_niles",
    "st_joseph_indiana",
  ],
  buildingBroad: [
    "st_joseph_lower_michigan",
    "st_joseph_middle_michigan",
    "st_joseph_niles",
    "st_joseph_indiana",
    "st_joseph_twin_branch",
  ],
  peak: [
    "st_joseph_middle_michigan",
    "st_joseph_niles",
    "st_joseph_indiana",
    "st_joseph_twin_branch",
  ],
  tapering: ["st_joseph_niles", "st_joseph_indiana", "st_joseph_twin_branch"],
  ending: ["st_joseph_niles", "st_joseph_indiana", "st_joseph_twin_branch"],
};
assign(
  ["st_joseph_fall_chinook", "st_joseph_fall_coho"],
  {
    approach: "Lake Michigan, St. Joseph harbor, and the river mouth",
    source: "docs/river_run_st_joseph_copy_foundation.md sections 2 and 8",
    phases: stJoeSpawner,
  },
  (runId) =>
    auditedRationale(
      runId,
      "The interstate ladder corridor becomes relevant only after lower-river entry; late guidance remains below Twin Branch Dam.",
    ),
);
assign(
  ["st_joseph_fall_steelhead"],
  {
    approach: "Lake Michigan, St. Joseph harbor, and the river mouth",
    source: "docs/river_run_st_joseph_copy_foundation.md sections 2 and 8",
    phases: {
      ...stJoeSpawner,
      tapering: stJoeSpawner.buildingBroad,
      ending: stJoeSpawner.buildingBroad,
    },
  },
  (runId) =>
    auditedRationale(
      runId,
      "Living Steelhead keep the verified interstate migration corridor in scope through the fall-entry endpoint.",
    ),
);

// Grand, Platte, and White.
assign(
  ["grand_fall_chinook"],
  {
    approach: "Lake Michigan at Grand Haven and the Grand River mouth",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: TWO_REACH_SPAWNER("grand_lower", "grand_middle_passage"),
  },
  (runId) =>
    auditedRationale(
      runId,
      "The Chinook product ends at Webber Dam and never expands into the upper-access profile used by other species.",
    ),
);
assign(
  ["grand_fall_coho"],
  {
    approach: "Lake Michigan at Grand Haven and the Grand River mouth",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: THREE_REACH_SPAWNER(
      "grand_lower",
      "grand_middle_passage",
      "grand_upper_accessible",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Coho use the separately accepted three-reach passage corridor; late orientation favors established middle/upper water.",
    ),
);
assign(
  ["grand_fall_steelhead"],
  {
    approach: "Lake Michigan at Grand Haven and the Grand River mouth",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: THREE_REACH_LIVING(
      "grand_lower",
      "grand_middle_passage",
      "grand_upper_accessible",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "The living fall-entry run retains lower fresh-entry and upstream holding contexts rather than borrowing salmon terminal behavior.",
    ),
);
assign(
  ["platte_fall_chinook", "platte_fall_coho"],
  {
    approach: "Platte Bay, Platte River Point, and the lower-river entrance",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: TWO_REACH_SPAWNER("platte_lower_entry", "platte_weir_approach"),
  },
  (runId) =>
    auditedRationale(
      runId,
      "This is a concentrated two-reach corridor ending at the signed weir closure, not a generic lower/middle/upper river.",
    ),
);
assign(
  ["platte_fall_steelhead"],
  {
    approach: "Platte Bay, Platte River Point, and the lower-river entrance",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: TWO_REACH_LIVING("platte_lower_entry", "platte_weir_approach"),
  },
  (runId) =>
    auditedRationale(
      runId,
      "The living fall-entry run retains both short-corridor reaches while respecting the weir exclusion.",
    ),
);
assign(
  ["white_fall_chinook", "white_fall_coho"],
  {
    approach: "White Lake and the White Lake-to-river transition",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: THREE_REACH_SPAWNER(
      "white_lower_river",
      "white_forest_corridor",
      "white_upper_accessible_corridor",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Late salmon orientation shifts to established forest and upper water below Hesperia Dam.",
    ),
);
assign(
  ["white_fall_steelhead"],
  {
    approach: "White Lake and the White Lake-to-river transition",
    source:
      "docs/audits/river-run-grand-platte-white-calendar-strength-audit-2026-08-24.md",
    phases: THREE_REACH_LIVING(
      "white_lower_river",
      "white_forest_corridor",
      "white_upper_accessible_corridor",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Living Steelhead retain the full accepted corridor through the fall-entry tail.",
    ),
);

// Wisconsin Lake Michigan tributaries. Their audited harbor reaches are part
// of the supported fishing corridor, so they may be active phase reaches—not
// merely external staging context.
function urbanWisconsinSpawner(
  harbor: string,
  middle: string,
  terminal: string,
): SeasonalZonePhasePlan {
  return {
    beginning: [harbor],
    buildingEarly: [harbor, middle],
    buildingEstablished: [middle, terminal],
    buildingBroad: [harbor, middle, terminal],
    peak: [harbor, middle, terminal],
    tapering: [middle, terminal],
    ending: [middle, terminal],
  };
}

for (
  const [river, approach, reaches, source] of [
    [
      "milwaukee",
      "Lake Michigan, Milwaukee Harbor, and the river mouth",
      [
        "milwaukee_harbor_downtown",
        "milwaukee_urban_greenway",
        "milwaukee_north_shore",
      ],
      "supabase/functions/_shared/riverRunEngine/config/onboarding/milwaukee.ts foundation and Wisconsin DNR access-map evidence",
    ],
    [
      "sheboygan",
      "Lake Michigan, Sheboygan Harbor, and the lower-city river mouth",
      [
        "sheboygan_harbor_lower_city",
        "sheboygan_urban_river",
        "sheboygan_kohler",
      ],
      "supabase/functions/_shared/riverRunEngine/config/onboarding/sheboygan.ts foundation and Wisconsin DNR access-map evidence",
    ],
    [
      "root",
      "Lake Michigan, Racine Harbor, and the Root River mouth",
      [
        "root_harbor_downtown",
        "root_city_parks",
        "root_lincoln_park",
      ],
      "supabase/functions/_shared/riverRunEngine/config/onboarding/root.ts foundation and Wisconsin DNR access-map evidence",
    ],
  ] as const
) {
  const [harbor, middle, terminal] = reaches;
  assign(
    [`${river}_fall_chinook`, `${river}_fall_coho`],
    {
      approach,
      source,
      phases: urbanWisconsinSpawner(harbor, middle, terminal),
    },
    (runId) =>
      auditedRationale(
        runId,
        "The officially mapped harbor is both early orientation and an audited supported-corridor section; late salmon guidance favors established river reaches.",
      ),
  );
  assign(
    [`${river}_fall_steelhead`, `${river}_fall_brown_trout`],
    {
      approach,
      source,
      phases: {
        ...urbanWisconsinSpawner(harbor, middle, terminal),
        tapering: [harbor, middle, terminal],
        ending: [harbor, middle, terminal],
      },
    },
    (runId) =>
      auditedRationale(
        runId,
        "The living repeat-spawner/fall-entry profile retains all accepted urban corridor sections late without implying equal abundance.",
      ),
  );
}

assign(
  ["bois_brule_fall_chinook", "bois_brule_fall_coho"],
  {
    approach:
      "Lake Superior at the Bois Brule mouth and the lower-river entrance",
    source:
      "supabase/functions/_shared/riverRunEngine/config/onboarding/boisBrule.ts foundation and Wisconsin DNR lower-river creel/access evidence",
    phases: THREE_REACH_SPAWNER(
      "bois_brule_mouth_lower",
      "bois_brule_rapids",
      "bois_brule_upper_lower",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Late salmon orientation favors established rapids and upstream-lower corridor below the Highway 2 endpoint.",
    ),
);
assign(
  ["bois_brule_fall_steelhead", "bois_brule_fall_brown_trout"],
  {
    approach:
      "Lake Superior at the Bois Brule mouth and the lower-river entrance",
    source:
      "supabase/functions/_shared/riverRunEngine/config/onboarding/boisBrule.ts foundation and Wisconsin DNR lower-river creel/access evidence",
    phases: THREE_REACH_LIVING(
      "bois_brule_mouth_lower",
      "bois_brule_rapids",
      "bois_brule_upper_lower",
    ),
  },
  (runId) =>
    auditedRationale(
      runId,
      "Living fish retain all accepted lower-river contexts late; the plan does not imply universal upstream concentration.",
    ),
);

// Washington owner-review rivers. Marine/estuary approach text is orientation
// only and explicitly does not import separate saltwater rules into River Run.
for (
  const [river, approach, reaches, dossier] of [
    [
      "green",
      "Puget Sound, the Duwamish estuary, and the lower Green/Duwamish approach",
      ["green_lower_duwamish", "green_middle_auburn", "green_upper_accessible"],
      "docs/onboarding/river-run/green/river-onboarding.md",
    ],
    [
      "puyallup",
      "Commencement Bay and the Puyallup mouth at the 11th Street Bridge boundary",
      ["puyallup_lower", "puyallup_middle", "puyallup_upper_salmon"],
      "docs/onboarding/river-run/puyallup/river-onboarding.md",
    ],
    [
      "cowlitz",
      "the Columbia confluence and the lower Cowlitz mouth approach",
      ["cowlitz_lower", "cowlitz_middle", "cowlitz_barrier_reach"],
      "docs/onboarding/river-run/cowlitz/river-onboarding.md",
    ],
  ] as const
) {
  const [lower, middle, upper] = reaches;
  assign(
    [`${river}_fall_chinook`, `${river}_fall_coho`],
    {
      approach,
      source: dossier,
      phases: THREE_REACH_SPAWNER(lower, middle, upper),
    },
    (runId) =>
      auditedRationale(
        runId,
        "The plan follows the accepted mainstem corridor and stops at its documented product endpoint; nearby marine or Columbia water remains separately regulated context.",
      ),
  );
}

// New York owner-review rivers.
for (
  const [river, approach, reaches, dossier] of [
    [
      "salmon_ny",
      "Lake Ontario off Port Ontario, the estuary, and the Salmon River mouth",
      ["salmon_ny_lower", "salmon_ny_middle", "salmon_ny_upper"],
      "docs/onboarding/river-run/salmon_ny/river-onboarding.md",
    ],
    [
      "oak_orchard",
      "Lake Ontario off Point Breeze, Oak Orchard harbor, and the creek mouth",
      ["oak_orchard_lower", "oak_orchard_middle", "oak_orchard_upper"],
      "docs/onboarding/river-run/oak_orchard/river-onboarding.md",
    ],
    [
      "lower_genesee",
      "Lake Ontario off Charlotte, the Port of Rochester, and the Genesee mouth",
      ["lower_genesee_harbor", "lower_genesee_gorge", "lower_genesee_falls"],
      "docs/onboarding/river-run/lower_genesee/river-onboarding.md",
    ],
  ] as const
) {
  const [lower, middle, upper] = reaches;
  const spawner = THREE_REACH_SPAWNER(lower, middle, upper);
  assign(
    [`${river}_fall_chinook`, `${river}_fall_coho`].filter((runId) =>
      runId !== "lower_genesee_fall_coho"
    ),
    { approach, source: dossier, phases: spawner },
    (runId) =>
      auditedRationale(
        runId,
        "Late salmon orientation favors established middle/terminal water while respecting the river-specific dam or natural-falls endpoint.",
      ),
  );
  assign(
    [`${river}_fall_steelhead`],
    {
      approach,
      source: dossier,
      phases: THREE_REACH_LIVING(lower, middle, upper),
    },
    (runId) =>
      auditedRationale(
        runId,
        "Living fall-entry Steelhead retain the accepted corridor late rather than inheriting salmon spawning concentration.",
      ),
  );
  assign(
    [`${river}_fall_brown_trout`],
    { approach, source: dossier, phases: spawner },
    (runId) =>
      auditedRationale(
        runId,
        "Repeat-spawning Brown Trout use a spawning-geography plan but the terminal state does not claim mortality or universal departure.",
      ),
  );
}

export function seasonalZonePlanForRun(runId: string): SeasonalZonePlan {
  const input = plans[runId];
  if (!input) {
    throw new Error(`Missing audited Seasonal Zone plan for ${runId}`);
  }
  return {
    version: `${runId}-seasonal-zone-v2-2026-09-01`,
    earlyApproach: {
      label: input.approach,
      sourceNotes: input.source,
    },
    phases: input.phases,
    evidenceNotes: input.rationale,
  };
}

export function withSeasonalZonePlan<T extends RiverRunProfile>(run: T): T {
  return {
    ...run,
    seasonalZonePlan: seasonalZonePlanForRun(run.runId),
  };
}

export function withSeasonalZonePlans<T extends AuditedRiverRunProfile>(
  runs: T[],
): T[] {
  return runs.map(withSeasonalZonePlan);
}
