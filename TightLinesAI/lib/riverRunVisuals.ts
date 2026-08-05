import type { RiverRunPrimitiveDisplay } from "./riverRunContracts";

export type RiverRunVisualKind =
  | "run_stage"
  | "run_timing"
  | "push"
  | "fishability"
  | "fish_in_river";

export type RiverRunMeterStop = {
  label: string;
  shortLabel: string;
  color: string;
};

export type RiverRunMeterTick = {
  label: string;
  position: number;
};

export type RiverRunHistoricalStrength = "Limited" | "Moderate" | "Strong";

export type RiverRunVisualModel = {
  kind: RiverRunVisualKind;
  kicker: string;
  artLabel: string;
  icon:
    | "calendar-outline"
    | "speedometer-outline"
    | "pulse-outline"
    | "water-outline"
    | "fish-outline";
  stops: RiverRunMeterStop[];
  ticks?: RiverRunMeterTick[];
  selectedIndex: number | null;
  position: number;
  stateLabel: string;
  stateNote: string;
  specialState?: "waiting" | "complete" | "unavailable";
  direction?: "rising" | "near_peak" | "falling" | "outside";
  riverMaximum?: number;
  ceilingPosition?: number;
  historicalRunStrength?: RiverRunHistoricalStrength;
  score?: number | null;
  accent: string;
};

const QUALITY_FIVE: RiverRunMeterStop[] = [
  { label: "Weak", shortLabel: "WEAK", color: "#D94B3A" },
  { label: "No clear", shortLabel: "NO CLEAR", color: "#E89647" },
  { label: "Possible", shortLabel: "POSSIBLE", color: "#E8C547" },
  { label: "Strong", shortLabel: "STRONG", color: "#7CC36A" },
  { label: "Very strong", shortLabel: "VERY STRONG", color: "#3DA85F" },
];

const FISHABILITY_FIVE: RiverRunMeterStop[] = [
  { label: "Poor", shortLabel: "POOR", color: "#D94B3A" },
  { label: "Tough", shortLabel: "TOUGH", color: "#E89647" },
  { label: "Fishable", shortLabel: "FISHABLE", color: "#E8C547" },
  { label: "Good", shortLabel: "GOOD", color: "#7CC36A" },
  { label: "Excellent", shortLabel: "EXCELLENT", color: "#3DA85F" },
];

const RUN_STAGE_SEVEN: RiverRunMeterStop[] = [
  { label: "Before migration", shortLabel: "BEFORE", color: "#76899B" },
  { label: "Beginning", shortLabel: "BEGIN", color: "#3E7C98" },
  { label: "Building", shortLabel: "BUILD", color: "#339493" },
  { label: "Peak", shortLabel: "PEAK", color: "#3DA85F" },
  { label: "Tapering", shortLabel: "TAPER", color: "#91A75B" },
  { label: "Ending", shortLabel: "END", color: "#C08B45" },
  { label: "After migration", shortLabel: "AFTER", color: "#85756A" },
];

const RUN_TIMING_THREE: RiverRunMeterStop[] = [
  { label: "Delayed", shortLabel: "DELAYED", color: "#C94A42" },
  { label: "Typical", shortLabel: "TYPICAL", color: "#D6AA32" },
  { label: "Ahead", shortLabel: "AHEAD", color: "#3DA85F" },
];

const PRESENCE_INDEX_FIVE: RiverRunMeterStop[] = [
  { label: "0–20", shortLabel: "0–20", color: "#D94B3A" },
  { label: "20–40", shortLabel: "20–40", color: "#E89647" },
  { label: "40–60", shortLabel: "40–60", color: "#E8C547" },
  { label: "60–80", shortLabel: "60–80", color: "#7CC36A" },
  { label: "80–100", shortLabel: "80–100", color: "#3DA85F" },
];

const PRESENCE_INDEX_TICKS: RiverRunMeterTick[] = [
  { label: "0", position: 0 },
  { label: "20", position: 0.2 },
  { label: "40", position: 0.4 },
  { label: "60", position: 0.6 },
  { label: "80", position: 0.8 },
  { label: "100", position: 1 },
];

export function resolveRiverRunVisualModel(input: {
  kind: RiverRunVisualKind;
  primitive: RiverRunPrimitiveDisplay & {
    stage?: string;
    timingLabel?: string | null;
    curveDirection?: string;
    handoffScore?: number;
    historicalRunStrength?: "limited" | "moderate" | "strong";
  };
}): RiverRunVisualModel {
  switch (input.kind) {
    case "run_stage":
      return runStageModel(input.primitive);
    case "run_timing":
      return runTimingModel(input.primitive);
    case "push":
      return pushModel(input.primitive);
    case "fishability":
      return fishabilityModel(input.primitive);
    case "fish_in_river":
      return fishInRiverModel(input.primitive);
  }
}

export function formatRiverRunTabStatus(
  kind: RiverRunVisualKind,
  primitive: RiverRunPrimitiveDisplay & { timingLabel?: string | null },
): string {
  if (kind === "run_timing" && primitive.label === "Timing complete") {
    return "COMPLETE";
  }
  return primitive.label
    .replace("Not monitoring yet", "Not active")
    .replace("Not expected yet", "Waiting")
    .replace("Before migration", "Before")
    .replace("After migration", "After")
    .replace("Migration complete", "Complete")
    .replace(" presence", "")
    .replace("No clear push", "No clear")
    .replace("Waiting for migration", "Waiting")
    .replace("Insufficient evidence", "No read")
    .toUpperCase();
}

function runStageModel(
  primitive: RiverRunPrimitiveDisplay & { stage?: string },
): RiverRunVisualModel {
  const stage = primitive.stage ?? normalize(primitive.label);
  const selectedIndex = indexFor(
    [
      "pre_run",
      "beginning",
      "building",
      "peak",
      "tapering",
      "ending",
      "post_run",
    ],
    normalize(stage),
  );
  const offseason = primitive.label === "Offseason";
  const winterHolding = primitive.label === "Winter holding";
  return baseModel({
    kind: "run_stage",
    kicker: "SEASON POSITION",
    artLabel: "MIGRATION WINDOW",
    icon: "calendar-outline",
    stops: RUN_STAGE_SEVEN,
    selectedIndex: offseason ? null : selectedIndex,
    stateLabel: primitive.label,
    stateNote: winterHolding
      ? "FALL ENTRY COMPLETE · WINTER HOLDING ACTIVE"
      : offseason
      ? "MIGRATION WINDOW INACTIVE"
      : stageNote(selectedIndex),
    specialState: offseason || winterHolding ? "complete" : undefined,
  });
}

function runTimingModel(
  primitive: RiverRunPrimitiveDisplay & { timingLabel?: string | null },
): RiverRunVisualModel {
  const timingLabel = primitive.label === "Timing complete"
    ? primitive.timingLabel
    : primitive.label;
  const selectedIndex = indexFor(
    ["delayed", "typical", "ahead"],
    normalize(timingLabel ?? ""),
  );
  const specialState = primitive.label === "Not monitoring yet" ||
      primitive.label === "Evaluating"
    ? "waiting"
    : primitive.label === "Insufficient evidence"
    ? "unavailable"
    : primitive.label === "Timing complete"
    ? "complete"
    : undefined;
  const model = baseModel({
    kind: "run_timing",
    kicker: "SEASON PACE",
    artLabel: "MIGRATION TIMING",
    icon: "speedometer-outline",
    stops: RUN_TIMING_THREE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: primitive.label === "Not monitoring yet"
      ? "SEASONAL MONITORING WINDOW INACTIVE"
      : specialState === "waiting"
      ? "SEASON PACE IS STILL DEVELOPING"
      : specialState === "unavailable"
      ? "NOT ENOUGH DATA FOR A TIMING CALL"
      : specialState === "complete"
      ? timingLabel
        ? `FINAL READ · ${timingLabel.toUpperCase()}`
        : "FINAL TIMING READ"
      : "PACE OF THIS MIGRATION SO FAR",
    specialState,
  });
  return specialState === "complete" ? { ...model, accent: "#8B98A5" } : model;
}

function pushModel(
  primitive: RiverRunPrimitiveDisplay,
): RiverRunVisualModel {
  const selectedIndex = indexFor(
    ["weak", "no_clear_push", "possible", "strong", "very_strong"],
    normalize(primitive.label),
  );
  const specialState = primitive.label === "Waiting for migration"
    ? "waiting"
    : primitive.label === "Migration complete" ||
        primitive.label === "Winter holding" ||
        primitive.label === "Offseason"
    ? "complete"
    : primitive.label === "Unavailable"
    ? "unavailable"
    : undefined;
  return baseModel({
    kind: "push",
    kicker: "FRESH FISH MOVEMENT SIGNAL",
    artLabel: "LAKE → RIVER",
    icon: "pulse-outline",
    stops: QUALITY_FIVE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: primitive.label === "Offseason"
      ? "FRESH-MOVEMENT WINDOW INACTIVE"
      : primitive.label === "Winter holding"
      ? "FALL-ENTRY SIGNAL COMPLETE · WINTER READ REQUIRED"
      : specialState === "waiting"
      ? "FISH HAVE NOT STARTED ENTERING"
      : specialState === "complete"
      ? "THE MIGRATION IS COMPLETE"
      : specialState === "unavailable"
      ? "WAITING FOR REQUIRED WATER DATA"
      : "FRESH-WAVE POTENTIAL TODAY",
    specialState,
    score: primitive.score,
  });
}

function fishabilityModel(
  primitive: RiverRunPrimitiveDisplay,
): RiverRunVisualModel {
  const selectedIndex = indexFor(
    ["poor", "tough", "fishable", "good", "excellent"],
    normalize(primitive.label),
  );
  const specialState = primitive.label === "Unavailable"
    ? "unavailable"
    : undefined;
  return baseModel({
    kind: "fishability",
    kicker: "RIVER SHAPE",
    artLabel: "CURRENT FLOW",
    icon: "water-outline",
    stops: FISHABILITY_FIVE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: specialState
      ? "WAITING FOR A CURRENT RIVER LEVEL"
      : "FLOW · TREND · PRESENTATION",
    specialState,
    score: primitive.score,
  });
}

function fishInRiverModel(
  primitive: RiverRunPrimitiveDisplay & {
    curveDirection?: string;
    historicalRunStrength?: "limited" | "moderate" | "strong";
    handoffScore?: number;
  },
): RiverRunVisualModel {
  const direction = normalizeDirection(primitive.curveDirection);
  const riverCeiling = clampScore(primitive.riverCeiling ?? 100);
  const winterHolding = primitive.label === "Winter holding";
  const score = clampScore(
    typeof primitive.score === "number"
      ? primitive.score
      : winterHolding && typeof primitive.handoffScore === "number"
      ? primitive.handoffScore
      : 0,
  );
  const selectedIndex = Math.min(
    PRESENCE_INDEX_FIVE.length - 1,
    Math.max(0, Math.ceil(score / 20) - 1),
  );
  const model = baseModel({
    kind: "fish_in_river",
    kicker: "SEASONAL PRESENCE",
    artLabel: "FISH IN RIVER",
    icon: "fish-outline",
    stops: PRESENCE_INDEX_FIVE,
    ticks: PRESENCE_INDEX_TICKS,
    selectedIndex,
    stateLabel: formatPresenceStateLabel(primitive.label),
    stateNote: winterHolding
      ? `FALL PRESENCE HANDOFF · ${score} · WINTER READ REQUIRED`
      : direction === "rising"
      ? "SEASONAL PRESENCE IS BUILDING"
      : direction === "falling"
      ? "SEASONAL PRESENCE IS DECLINING"
      : direction === "near_peak"
      ? "AT OR NEAR THE SEASONAL HIGH"
      : "OUTSIDE THE MAIN MIGRATION",
    direction,
    riverMaximum: riverCeiling,
    ceilingPosition: riverCeiling / 100,
    historicalRunStrength: primitive.historicalRunStrength
      ? capitalizeStrength(primitive.historicalRunStrength)
      : historicalRunStrength(riverCeiling),
    score: winterHolding ? score : primitive.score,
    specialState: winterHolding ? "complete" : undefined,
  });
  return {
    ...model,
    position: score / 100,
    accent: score === 0 ? "#76899B" : model.accent,
  };
}

function baseModel(
  input: Omit<
    RiverRunVisualModel,
    "position" | "accent"
  >,
): RiverRunVisualModel {
  const position = input.selectedIndex == null
    ? 0.5
    : input.stops.length <= 1
    ? 0
    : input.selectedIndex / (input.stops.length - 1);
  const accent = input.selectedIndex == null
    ? "#8B98A5"
    : input.stops[input.selectedIndex]?.color ?? "#8B98A5";
  return { ...input, position, accent };
}

function indexFor(values: string[], value: string): number | null {
  const index = values.indexOf(value);
  return index >= 0 ? index : null;
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function historicalRunStrength(
  riverCeiling: number,
): RiverRunHistoricalStrength {
  const configuredMaximum = riverCeiling / 10;
  if (configuredMaximum <= 3) return "Limited";
  if (configuredMaximum <= 7) return "Moderate";
  return "Strong";
}

function capitalizeStrength(
  strength: "limited" | "moderate" | "strong",
): RiverRunHistoricalStrength {
  return `${strength[0].toUpperCase()}${
    strength.slice(1)
  }` as RiverRunHistoricalStrength;
}

function formatPresenceStateLabel(label: string): string {
  return label.endsWith(" presence")
    ? `${label.slice(0, -" presence".length)} for this river`
    : label;
}

function normalizeDirection(
  value?: string,
): RiverRunVisualModel["direction"] {
  switch (value) {
    case "rising":
    case "near_peak":
    case "falling":
    case "outside":
      return value;
    default:
      return undefined;
  }
}

function stageNote(index: number | null): string {
  switch (index) {
    case 0:
      return "FISH HAVE NOT STARTED ENTERING";
    case 1:
      return "THE FIRST FISH ARE ENTERING";
    case 2:
      return "MORE FISH ARE MOVING INTO THE RIVER";
    case 3:
      return "THE STRONGEST PART OF THE SEASON";
    case 4:
      return "FISH REMAIN · FRESH ARRIVALS EASING";
    case 5:
      return "THE MIGRATION IS WINDING DOWN";
    case 6:
      return "MAIN MIGRATION WINDOW COMPLETE";
    default:
      return "CURRENT SEASON POSITION";
  }
}
