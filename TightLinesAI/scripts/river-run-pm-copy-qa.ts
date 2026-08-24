import { splitRiverRunDetailPoints } from "../lib/riverRunCopyFormatting";
import type {
  RiverRunPrimitiveDisplay,
  RiverRunSnapshotResponse,
} from "../lib/riverRunContracts";
import { RIVER_RUN_REVIEW_GROUPS } from "../lib/riverRunReviewFixtures.generated";
import { RIVER_RUN_COHO_REVIEW_GROUPS } from "../lib/riverRunCohoReviewFixtures.generated";
import { RIVER_RUN_STEELHEAD_REVIEW_GROUPS } from "../lib/riverRunSteelheadReviewFixtures.generated";

type SpeciesReview = {
  name: "Chinook" | "Coho" | "Steelhead";
  groups: typeof RIVER_RUN_REVIEW_GROUPS;
  minimumScenarios: number;
};

type PrimitiveKey =
  | "runStage"
  | "conditionsSuggest"
  | "push"
  | "fishability"
  | "activity"
  | "fishInRiver";

const reviews: SpeciesReview[] = [
  { name: "Chinook", groups: RIVER_RUN_REVIEW_GROUPS, minimumScenarios: 120 },
  { name: "Coho", groups: RIVER_RUN_COHO_REVIEW_GROUPS, minimumScenarios: 119 },
  {
    name: "Steelhead",
    groups: RIVER_RUN_STEELHEAD_REVIEW_GROUPS,
    minimumScenarios: 117,
  },
];

const primitiveKeys: PrimitiveKey[] = [
  "runStage",
  "conditionsSuggest",
  "push",
  "fishability",
  "activity",
  "fishInRiver",
];

const foreignCopy =
  /\b(?:Big Manistee|Betsie|Muskegon|St\.? Joseph|Tippy|Croton|Homestead|Niles|Twin Branch|Berrien Springs|Mishawaka|Bear Creek)\b/i;
const implementationCopy =
  /\b(?:baseline|percentile|engine ID|rule ID|configured threshold|accepted|configured|owner-approved|research-approved|audited|calibrated)\b/i;
const forbiddenCertainty =
  /\b(?:guaranteed|fish are everywhere|river is full|fresh wave entered)\b/i;
const obsoletePmPublicGeography = /\bthe Forks\b/i;
const guideOpening =
  /^(?:Begin|Start|Fish|Keep|Skip|Leave|Do not|Stop|Choose|Stay|Target|Work|Check|Cover|Treat|Use|Return|Favor|Prioritize)\b/;

const errors: string[] = [];
let scenarioCount = 0;
let auditedDisplays = 0;
const uniqueCopies = new Set<string>();

for (const review of reviews) {
  const scenarios = review.groups.flatMap((group) => group.scenarios);
  scenarioCount += scenarios.length;
  check(
    scenarios.length >= review.minimumScenarios,
    `${review.name}: expected at least ${review.minimumScenarios} scenarios; found ${scenarios.length}`,
  );
  const groupIds = new Set(review.groups.map((group) => group.id));
  for (
    const required of [
      "run_stage",
      "conditions",
      "push",
      "fishability",
      "activity",
      "fish_in_river",
    ]
  ) {
    check(groupIds.has(required), `${review.name}: missing ${required} group`);
  }

  const labels = new Map<PrimitiveKey, Set<string>>(
    primitiveKeys.map((key) => [key, new Set<string>()]),
  );
  for (const scenario of scenarios) {
    const snapshot = scenario.snapshot as RiverRunSnapshotResponse;
    check(
      snapshot.riverId === "pere_marquette",
      `${review.name}/${scenario.id}: wrong river ${snapshot.riverId}`,
    );
    for (const key of primitiveKeys) {
      const display = snapshot[key];
      if (!display) continue;
      labels.get(key)!.add(display.label);
      auditDisplay(review.name, scenario.id, key, display);
      auditedDisplays += 1;
    }
  }
  auditCoverage(review.name, labels);
}

if (errors.length) {
  console.error(`PM copy QA failed with ${errors.length} issue(s):`);
  for (const issue of errors.slice(0, 100)) console.error(`- ${issue}`);
  if (errors.length > 100) console.error(`- ... ${errors.length - 100} more`);
  process.exit(1);
}

console.log(
  `PM copy QA passed: ${scenarioCount} scenarios, ${auditedDisplays} primitive renders, ${uniqueCopies.size} unique primitive copy states.`,
);

function auditDisplay(
  species: SpeciesReview["name"],
  scenarioId: string,
  key: PrimitiveKey,
  display: RiverRunPrimitiveDisplay,
): void {
  const id = `${species}/${scenarioId}/${key}/${display.label}`;
  const headline = display.headline?.trim() ?? "";
  const detail = display.detail?.trim() ?? "";
  const tip = display.tip?.trim() ?? "";
  const where = display.whereToStart?.trim() ?? "";
  const publicCopy = [headline, where, detail, tip].filter(Boolean).join(" ");
  uniqueCopies.add(`${key}|${display.label}|${publicCopy}`);

  check(headline.length > 0, `${id}: missing headline`);
  check(detail.length > 0, `${id}: missing Why This Read copy`);
  check(tip.length > 0, `${id}: missing Guide's Read`);
  check(wordCount(headline) <= 22, `${id}: headline exceeds 22 words`);
  check(wordCount(tip) <= 36, `${id}: Guide's Read exceeds 36 words`);
  check(guideOpening.test(tip), `${id}: Guide's Read lacks a direct opening`);
  check(
    display.copyVersion === "river-run-copy-v36",
    `${id}: stale copy version`,
  );
  check(!foreignCopy.test(publicCopy), `${id}: foreign river geography leaked`);
  check(
    !obsoletePmPublicGeography.test(publicCopy),
    `${id}: unrecognized PM public geography leaked`,
  );
  check(
    !implementationCopy.test(publicCopy),
    `${id}: implementation language leaked`,
  );
  check(
    !forbiddenCertainty.test(publicCopy),
    `${id}: prohibited certainty language`,
  );

  const points = splitRiverRunDetailPoints(detail);
  check(points.length <= 3, `${id}: ${points.length} Why points exceeds 3`);
  for (const [index, point] of points.entries()) {
    check(
      wordCount(point) <= 26,
      `${id}: Why point ${index + 1} exceeds 26 words (${wordCount(point)})`,
    );
    check(!/[;—]/.test(point), `${id}: Why point hides clauses with ; or —`);
  }

  if (where) {
    check(wordCount(where) <= 30, `${id}: Where to Start exceeds 30 words`);
    check(
      key === "runStage",
      `${id}: only Migration Stage may render Where to Start`,
    );
    check(
      !/\b(?:Walhalla|Branch|Baldwin|the Forks)\b/i.test(where),
      `${id}: obsolete or ambiguous PM section wording`,
    );
  }

  if (key === "runStage" && /\b(?:Lower|Middle|Upper) river\b/.test(where)) {
    check(
      /\((?:Pere Marquette Lake–Scottville|Scottville–Maple Leaf|Maple Leaf–M-37)\)/
        .test(
          where,
        ),
      `${id}: section name lacks an approved PM boundary`,
    );
  }

  if (key === "fishability" && display.label !== "Unavailable") {
    check(/Scottville/i.test(publicCopy), `${id}: Scottville scope is missing`);
    check(/Lower river/i.test(detail), `${id}: Lower river scope is missing`);
    check(
      /not the full PM/i.test(detail),
      `${id}: full-river limitation is missing`,
    );
  }

  if (key === "activity") {
    const activity = display as RiverRunPrimitiveDisplay & {
      blocks?: Array<{
        label: string;
        score: number;
        cloudCoverPct: number | null;
      }>;
    };
    const reasons = display.reasonCodes ?? [];
    if (reasons.includes("activity_confidence_limited")) {
      check(
        /Limited/i.test(detail),
        `${id}: Limited confidence is not explained`,
      );
    }
    if (/Hourly light and weather data are unavailable/i.test(publicCopy)) {
      check(
        !/\d.*is strongest/i.test(detail),
        `${id}: missing weather named a strongest block`,
      );
    }
    const ranked = [...(activity.blocks ?? [])].sort((a, b) =>
      b.score - a.score
    );
    const hasHourlyWeather = ranked.length === 4 &&
      ranked.every((block) => block.cloudCoverPct != null);
    if (
      hasHourlyWeather && ranked[0].score - ranked[1].score < 3
    ) {
      check(
        detail.includes(ranked[0].label) && detail.includes(ranked[1].label) &&
          /neither has a clear advantage/i.test(detail),
        `${id}: near-tied leading blocks are not explained`,
      );
    }
    if (hasHourlyWeather && ranked[0].score - ranked[1].score >= 3) {
      check(
        detail.includes(ranked[0].label) &&
          /is (?:the strongest remaining window|strongest) because/i.test(
            detail,
          ),
        `${id}: separated strongest block is not explained`,
      );
    }
  }

  if (key === "fishInRiver") auditPresence(id, display);

  if (species === "Steelhead" && display.label === "Fall entry complete") {
    check(
      display.score == null,
      `${id}: completed fall state retained a score`,
    );
    check(
      /early September/i.test(publicCopy),
      `${id}: return checkpoint is missing`,
    );
    check(
      !/winter/i.test(publicCopy),
      `${id}: unimplemented winter feature leaked`,
    );
  }
}

function auditPresence(id: string, display: RiverRunPrimitiveDisplay): void {
  const presence = display as RiverRunPrimitiveDisplay & {
    displayScore?: number;
    scoreIsApproximate?: boolean;
  };
  if (typeof display.score !== "number") return;
  const ceiling = display.riverCeiling ?? 100;
  const publicScore = presence.displayScore;
  check(typeof publicScore === "number", `${id}: missing public display score`);
  if (typeof publicScore !== "number") return;
  check(
    publicScore % 5 === 0 || publicScore === ceiling,
    `${id}: display score ${publicScore} is not a five-point increment`,
  );
  check(
    publicScore >= 0 && publicScore <= ceiling,
    `${id}: display score exceeds ceiling`,
  );
  if (display.score > 0 && display.score < ceiling) {
    check(
      presence.scoreIsApproximate === true,
      `${id}: intermediate score lacks ≈ state`,
    );
  }
  check(
    presenceBand(publicScore, ceiling, display.label) === display.label,
    `${id}: display rounding changed the presence band`,
  );
}

function presenceBand(score: number, ceiling: number, label: string): string {
  if (!label.endsWith(" presence")) return label;
  const fraction = ceiling > 0 ? score / ceiling : 0;
  if (fraction <= 0.2) return "Low presence";
  if (fraction <= 0.4) return "Limited presence";
  if (fraction <= 0.6) return "Moderate presence";
  if (fraction < 0.9) return "High presence";
  return "Peak presence";
}

function auditCoverage(
  species: SpeciesReview["name"],
  labels: Map<PrimitiveKey, Set<string>>,
): void {
  const expected: Partial<Record<PrimitiveKey, string[]>> = {
    conditionsSuggest: [
      "Ahead",
      "Typical",
      "Delayed",
      "Insufficient evidence",
      "Not monitoring yet",
      "Evaluating",
      "Timing complete",
    ],
    fishability: [
      "Poor",
      "Tough",
      "Fishable",
      "Good",
      "Excellent",
      "Unavailable",
    ],
    activity: ["Inactive", "Reserved", "Moderate", "Active", "Highly active"],
  };
  for (
    const [key, required] of Object.entries(expected) as Array<
      [PrimitiveKey, string[]]
    >
  ) {
    for (const label of required) {
      check(labels.get(key)!.has(label), `${species}/${key}: missing ${label}`);
    }
  }
  const stageComplete = species === "Steelhead"
    ? "Fall entry complete"
    : "Fall run complete";
  check(
    labels.get("runStage")!.has(stageComplete),
    `${species}/Stage: missing ${stageComplete}`,
  );
  check(
    labels.get("fishInRiver")!.has(stageComplete),
    `${species}/Fish In River: missing ${stageComplete}`,
  );
  if (species === "Steelhead") {
    for (const key of ["push", "activity"] as const) {
      check(
        labels.get(key)!.has("Fall entry complete"),
        `${species}/${key}: completion state missing`,
      );
    }
  }
}

function wordCount(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function check(condition: boolean, message: string): void {
  if (!condition) errors.push(message);
}
