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
  selectedIndex: number | null;
  position: number;
  stateLabel: string;
  stateNote: string;
  specialState?: "waiting" | "complete" | "unavailable";
  direction?: "rising" | "near_peak" | "falling" | "outside";
  riverMaximum?: number;
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
  { label: "Pre-run", shortLabel: "PRE", color: "#76899B" },
  { label: "Beginning", shortLabel: "BEGIN", color: "#3E7C98" },
  { label: "Building", shortLabel: "BUILD", color: "#339493" },
  { label: "Peak", shortLabel: "PEAK", color: "#3DA85F" },
  { label: "Tapering", shortLabel: "TAPER", color: "#91A75B" },
  { label: "Ending", shortLabel: "END", color: "#C08B45" },
  { label: "Post-run", shortLabel: "POST", color: "#85756A" },
];

const RUN_TIMING_THREE: RiverRunMeterStop[] = [
  { label: "Delayed", shortLabel: "DELAYED", color: "#C94A42" },
  { label: "Typical", shortLabel: "TYPICAL", color: "#D6AA32" },
  { label: "Ahead", shortLabel: "AHEAD", color: "#3DA85F" },
];

const PRESENCE_SIX: RiverRunMeterStop[] = [
  { label: "Outside", shortLabel: "OUT", color: "#B83A32" },
  { label: "Low", shortLabel: "LOW", color: "#D94B3A" },
  { label: "Limited", shortLabel: "LIMITED", color: "#E89647" },
  { label: "Moderate", shortLabel: "MOD", color: "#E8C547" },
  { label: "High", shortLabel: "HIGH", color: "#7CC36A" },
  { label: "Peak", shortLabel: "PEAK", color: "#3DA85F" },
];

export function resolveRiverRunVisualModel(input: {
  kind: RiverRunVisualKind;
  primitive: RiverRunPrimitiveDisplay & {
    stage?: string;
    timingLabel?: string | null;
    curveDirection?: string;
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
    const finalTiming = primitive.timingLabel;
    return finalTiming && ["Ahead", "Typical", "Delayed"].includes(finalTiming)
      ? finalTiming.toUpperCase()
      : "COMPLETE";
  }
  return primitive.label
    .replace("Not expected yet", "Waiting")
    .replace("Run complete", "Complete")
    .replace(" presence", "")
    .replace("No clear push", "No clear")
    .replace("Waiting for run", "Waiting")
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
  return baseModel({
    kind: "run_stage",
    kicker: "SEASON POSITION",
    artLabel: "MIGRATION WINDOW",
    icon: "calendar-outline",
    stops: RUN_STAGE_SEVEN,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: stageNote(selectedIndex),
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
  const specialState = primitive.label === "Evaluating"
    ? "waiting"
    : primitive.label === "Insufficient evidence"
    ? "unavailable"
    : primitive.label === "Timing complete"
    ? "complete"
    : undefined;
  return baseModel({
    kind: "run_timing",
    kicker: "SEASON PACE",
    artLabel: "RUN TIMING",
    icon: "speedometer-outline",
    stops: RUN_TIMING_THREE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: specialState === "waiting"
      ? "SEASON PACE IS STILL DEVELOPING"
      : specialState === "unavailable"
      ? "NOT ENOUGH DATA FOR A TIMING CALL"
      : specialState === "complete"
      ? timingLabel
        ? `FINAL READ · ${timingLabel.toUpperCase()}`
        : "FINAL TIMING READ"
      : "PACE OF THIS RUN SO FAR",
    specialState,
  });
}

function pushModel(
  primitive: RiverRunPrimitiveDisplay,
): RiverRunVisualModel {
  const selectedIndex = indexFor(
    ["weak", "no_clear_push", "possible", "strong", "very_strong"],
    normalize(primitive.label),
  );
  const specialState = primitive.label === "Waiting for run"
    ? "waiting"
    : primitive.label === "Run complete"
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
    stateNote: specialState === "waiting"
      ? "THE RUN HAS NOT STARTED"
      : specialState === "complete"
      ? "THE RUN IS COMPLETE"
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
  primitive: RiverRunPrimitiveDisplay & { curveDirection?: string },
): RiverRunVisualModel {
  const normalizedLabel = normalize(primitive.label);
  const selectedIndex = normalizedLabel === "run_complete" ? 0 : indexFor(
    [
      "not_expected_yet",
      "low_presence",
      "limited_presence",
      "moderate_presence",
      "high_presence",
      "peak_presence",
    ],
    normalizedLabel,
  );
  const direction = normalizeDirection(primitive.curveDirection);
  const riverCeiling = typeof primitive.riverCeiling === "number"
    ? primitive.riverCeiling
    : 100;
  return baseModel({
    kind: "fish_in_river",
    kicker: "SEASONAL PRESENCE",
    artLabel: "FISH IN RIVER",
    icon: "fish-outline",
    stops: PRESENCE_SIX,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: direction === "rising"
      ? "SEASONAL PRESENCE IS BUILDING"
      : direction === "falling"
      ? "SEASONAL PRESENCE IS DECLINING"
      : direction === "near_peak"
      ? "AT OR NEAR THE SEASONAL HIGH"
      : "OUTSIDE THE MAIN RUN",
    direction,
    riverMaximum: riverCeiling,
    score: primitive.score,
  });
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
      return "THE RIVER RUN HAS NOT STARTED";
    case 1:
      return "THE FIRST PART OF THE RUN";
    case 2:
      return "THE RUN IS GAINING MOMENTUM";
    case 3:
      return "THE STRONGEST PART OF THE RUN";
    case 4:
      return "FISH REMAIN · FRESH ARRIVALS EASING";
    case 5:
      return "THE RUN IS WINDING DOWN";
    case 6:
      return "MAIN RUN WINDOW COMPLETE";
    default:
      return "CURRENT SEASON POSITION";
  }
}
