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
  { label: "Outside", shortLabel: "OUT", color: "#7F8790" },
  { label: "Low", shortLabel: "LOW", color: "#557A91" },
  { label: "Limited", shortLabel: "LIMITED", color: "#397F9B" },
  { label: "Moderate", shortLabel: "MOD", color: "#2C8F98" },
  { label: "High", shortLabel: "HIGH", color: "#37947B" },
  { label: "Peak", shortLabel: "PEAK", color: "#2D9B60" },
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
    .replace("Outside historical window", "Outside")
    .replace(" historical presence", "")
    .replace("No clear push", "No clear")
    .replace("Tracking not started", "Waiting")
    .replace("Tracking complete", "Complete")
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
    kicker: "HISTORICAL PACE",
    artLabel: "RUN TIMING",
    icon: "speedometer-outline",
    stops: RUN_TIMING_THREE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: specialState === "waiting"
      ? "BUILDING THE FIRST COMPARISON"
      : specialState === "unavailable"
      ? "NO TIMING CALL WITHOUT EVIDENCE"
      : specialState === "complete"
      ? timingLabel
        ? `FINAL READ · ${timingLabel.toUpperCase()}`
        : "FINAL TIMING READ"
      : "SEASON TO DATE VS. HISTORY",
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
  const specialState = primitive.label === "Tracking not started"
    ? "waiting"
    : primitive.label === "Tracking complete"
    ? "complete"
    : primitive.label === "Unavailable"
    ? "unavailable"
    : undefined;
  return baseModel({
    kind: "push",
    kicker: "FRESH-ENTRY SIGNAL",
    artLabel: "LAKE → RIVER",
    icon: "pulse-outline",
    stops: QUALITY_FIVE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: specialState === "waiting"
      ? "TRACKING OPENS WITH THE RUN"
      : specialState === "complete"
      ? "TRACKING CLOSED FOR THIS RUN"
      : specialState === "unavailable"
      ? "WAITING FOR REQUIRED WATER DATA"
      : "CURRENT MOVEMENT CONDITIONS",
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
    artLabel: "GAUGED STRETCH",
    icon: "water-outline",
    stops: FISHABILITY_FIVE,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: specialState
      ? "WAITING FOR A USABLE GAUGE READ"
      : "ACCESS · HOLDING WATER · PRESENTATION",
    specialState,
    score: primitive.score,
  });
}

function fishInRiverModel(
  primitive: RiverRunPrimitiveDisplay & { curveDirection?: string },
): RiverRunVisualModel {
  const selectedIndex = indexFor(
    [
      "outside_historical_window",
      "low_historical_presence",
      "limited_historical_presence",
      "moderate_historical_presence",
      "high_historical_presence",
      "peak_historical_presence",
    ],
    normalize(primitive.label),
  );
  const direction = normalizeDirection(primitive.curveDirection);
  const maximum = typeof primitive.maximum === "number"
    ? primitive.maximum
    : 10;
  return baseModel({
    kind: "fish_in_river",
    kicker: "SEASONAL PRESENCE",
    artLabel: "HISTORICAL CURVE",
    icon: "fish-outline",
    stops: PRESENCE_SIX,
    selectedIndex,
    stateLabel: primitive.label,
    stateNote: direction === "rising"
      ? "HISTORICAL CURVE RISING"
      : direction === "falling"
      ? "HISTORICAL CURVE FALLING"
      : direction === "near_peak"
      ? "AT OR NEAR THE SEASONAL HIGH"
      : "OUTSIDE THE MODELED WINDOW",
    direction,
    riverMaximum: maximum,
    score: primitive.score,
  });
}

function baseModel(input: Omit<
  RiverRunVisualModel,
  "position" | "accent"
>): RiverRunVisualModel {
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
      return "BEFORE THE MAIN RIVER WINDOW";
    case 1:
      return "EARLY HISTORICAL WINDOW";
    case 2:
      return "SEASON BUILDING TOWARD PEAK";
    case 3:
      return "RESEARCHED PEAK WINDOW";
    case 4:
      return "PAST PEAK · PRESENCE EASING";
    case 5:
      return "LATE HISTORICAL WINDOW";
    case 6:
      return "MAIN RUN WINDOW COMPLETE";
    default:
      return "RESEARCHED RUN CALENDAR";
  }
}
