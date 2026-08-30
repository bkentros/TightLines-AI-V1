import type {
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  PrimitiveDisplay,
  RawFlowTrendSignal,
  RiverRunReasonCode,
  RunStageCopyStrategy,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";
import { flowBandReasonCode } from "../metrics/flow.ts";

export type FishabilityScoreComponents = {
  bandBase: number;
  trendModifier: number;
  appliedCaps: number[];
};

export type FishabilityScoreInput = {
  rules: FishabilityBands;
  gaugeFreshness: GaugeFreshness;
  flowBand?: FlowBand;
  flowSignal: RawFlowTrendSignal;
  currentHydraulicValue?: number | null;
  hydraulicAbsoluteChange24h?: number | null;
  hydraulicPercentChange24h?: number | null;
  flowReasonCodes?: RiverRunReasonCode[];
  localDate?: string;
  copyStrategy?: RunStageCopyStrategy;
};

export type FishabilityScoreResult = PrimitiveDisplay & {
  components?: FishabilityScoreComponents;
  rulesVersion?: string;
};

export function scoreFishability(
  input: FishabilityScoreInput,
): FishabilityScoreResult {
  if (
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h" ||
    !isNumber(input.currentHydraulicValue)
  ) {
    return unavailableResult(input, "gauge");
  }
  if (!input.flowBand) return unavailableResult(input, "band");

  const reasonCodes = new Set<RiverRunReasonCode>([
    gaugeReasonCode(input.gaugeFreshness),
    ...(input.flowReasonCodes ?? []),
    flowBandReasonCode(input.flowBand),
  ]);
  const bandBase = bandBaseScore(input.flowBand);
  const trendModifier = trendScoreModifier(input.flowSignal);
  const appliedCaps: number[] = [];
  let score = bandBase + trendModifier;

  if (input.flowBand === "very_low") {
    score = applyCap(score, input.rules.caps.veryLow, appliedCaps);
    reasonCodes.add("fishability_very_low_cap");
  }
  if (input.flowBand === "blown_out") {
    score = applyCap(score, input.rules.caps.blownOut, appliedCaps);
    reasonCodes.add("fishability_blown_out_cap");
  }
  if (
    input.flowSignal === "sharp_rise" &&
    (input.flowBand === "high_fishable" ||
      input.flowBand === "very_high" ||
      input.flowBand === "blown_out")
  ) {
    score = applyCap(score, input.rules.caps.sharpRiseHigh, appliedCaps);
    reasonCodes.add("fishability_sharp_rise_high_cap");
  }
  if (input.flowSignal === "unknown") {
    score = applyCap(score, input.rules.caps.unknownTrend, appliedCaps);
    reasonCodes.add("fishability_unknown_trend_cap");
  }
  if (input.gaugeFreshness === "stale") {
    score = applyCap(score, input.rules.caps.staleGauge, appliedCaps);
    reasonCodes.add("fishability_stale_gauge_cap");
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  const label = fishabilityLabel(finalScore);
  const components = {
    bandBase,
    trendModifier,
    appliedCaps: [...new Set(appliedCaps)].toSorted((a, b) => a - b),
  };
  return {
    score: finalScore,
    label,
    ...fishabilityCopy({
      flowBand: input.flowBand,
      flowSignal: input.flowSignal,
      gaugeFreshness: input.gaugeFreshness,
      sourceLabel: input.rules.sourceLabel,
      copyStrategy: input.copyStrategy,
    }),
    reasonCodes: [...reasonCodes],
    components,
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function bandBaseScore(band: FlowBand): number {
  switch (band) {
    case "very_low":
      return 35;
    case "low":
      return 55;
    case "normal_fishable":
      return 70;
    case "ideal":
      return 88;
    case "high_fishable":
      return 68;
    case "very_high":
      return 40;
    case "blown_out":
      return 15;
  }
}

function trendScoreModifier(signal: RawFlowTrendSignal): number {
  switch (signal) {
    case "stable":
      return 5;
    case "falling":
      return 2;
    case "rising":
      return 0;
    case "meaningful_rise":
      return -8;
    case "sharp_rise":
      return -20;
    case "unknown":
      return -10;
  }
}

function fishabilityLabel(score: number): string {
  if (score <= 24) return "Poor";
  if (score <= 49) return "Tough";
  if (score <= 69) return "Fishable";
  if (score <= 84) return "Good";
  return "Excellent";
}

function fishabilityCopy(input: {
  flowBand: FlowBand;
  flowSignal: RawFlowTrendSignal;
  gaugeFreshness: GaugeFreshness;
  sourceLabel: string;
  copyStrategy?: RunStageCopyStrategy;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.copyStrategy === "pere_marquette") {
    return pereMarquetteFishabilityCopy(input);
  }
  if (input.copyStrategy === "big_manistee_tailwater") {
    const bandPoint = bigManisteeFishabilityBandPoint(input.flowBand);
    const trendPoint = bigManisteeFishabilityTrendPoint(
      input.flowSignal,
      input.flowBand,
      input.gaugeFreshness,
    );
    return {
      headline: bigManisteeFishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
      detail:
        `${bandPoint} ${trendPoint} This read covers only the Upper river (High Bridge–Tippy Dam). Gauge Read compares flow with this date's history; Fishability compares it with this reach's presentation bands.`,
      tip: bigManisteeFishabilityTip(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
    };
  }
  if (input.copyStrategy === "muskegon_croton_tailwater") {
    const bandPoint = bigManisteeFishabilityBandPoint(input.flowBand)
      .replaceAll("Upper river", "Croton area");
    const trendPoint = bigManisteeFishabilityTrendPoint(
      input.flowSignal,
      input.flowBand,
      input.gaugeFreshness,
    ).replaceAll("Upper river", "Croton area").replaceAll(
      "Wellston",
      "Croton",
    );
    return {
      headline: bigManisteeFishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ).replaceAll("Upper-river", "Croton-area").replaceAll(
        "Upper river",
        "Croton area",
      ).replaceAll("Wellston", "Croton"),
      detail:
        `${bandPoint} ${trendPoint} The live flow card compares this date, while this result applies only near Croton Dam in the Upper river (Newaygo–Croton Dam).`,
      tip: bigManisteeFishabilityTip(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ).replaceAll("Upper river", "Croton area"),
    };
  }
  const nilesScoped = input.sourceLabel === "Niles mainstem reach";
  const fultonScoped = input.sourceLabel === "Fulton Street reach";
  const fruitvaleScoped = input.sourceLabel === "Fruitvale Road reach";
  const estabrookScoped = input.sourceLabel ===
    "Estabrook Park Urban Greenway reach";
  const sheboyganI43Scoped = input.sourceLabel === "Urban River near I-43";
  if (estabrookScoped) {
    return {
      headline: fishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
      detail: `${flowBandMeaning(input.flowBand)} ${
        trendMeaning(input.flowSignal, input.flowBand, input.gaugeFreshness)
      } The live flow card compares this date with its recent history; this result uses fixed presentation bands only near Estabrook Park in the Urban Greenway. It does not describe Milwaukee Harbor or the North Shore above Kletzsch.`,
      tip: `${
        fishabilityTip(
          input.flowBand,
          input.flowSignal,
          input.gaugeFreshness,
        )
      } Verify the water and legal access directly before carrying this presentation read elsewhere.`,
    };
  }
  if (sheboyganI43Scoped) {
    return {
      headline: fishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
      detail: `${flowBandMeaning(input.flowBand)} ${
        trendMeaning(input.flowSignal, input.flowBand, input.gaugeFreshness)
      } The live flow card compares this date with its recent history; this result uses fixed presentation bands only near I-43 in the Urban River. It does not directly describe Sheboygan Harbor or the Kohler Reach above I-43.`,
      tip: `${
        fishabilityTip(
          input.flowBand,
          input.flowSignal,
          input.gaugeFreshness,
        )
      } Verify the water and legal access directly before carrying this presentation read elsewhere.`,
    };
  }
  if (nilesScoped) {
    return {
      headline: fishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
      detail: `${flowBandMeaning(input.flowBand)} ${
        trendMeaning(input.flowSignal, input.flowBand, input.gaugeFreshness)
      } Flow card: date-relative; result: Niles reach only.`,
      tip: `${
        bigManisteeFishabilityTip(
          input.flowBand,
          input.flowSignal,
          input.gaugeFreshness,
        ).replaceAll("Upper river", "Niles reach")
      } Verify every other section directly.`,
    };
  }
  if (fultonScoped) {
    return {
      headline: fishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
      detail: `${flowBandMeaning(input.flowBand)} ${
        trendMeaning(input.flowSignal, input.flowBand, input.gaugeFreshness)
      } The live flow card compares this date, while this result assesses presentation only at the Fulton Street reach, not the full Grand River.`,
      tip: `${
        fishabilityTip(
          input.flowBand,
          input.flowSignal,
          input.gaugeFreshness,
        )
      } Verify water shape and safe access directly before carrying this read elsewhere.`,
    };
  }
  if (fruitvaleScoped) {
    return {
      headline: fishabilityHeadline(
        input.flowBand,
        input.flowSignal,
        input.gaugeFreshness,
      ),
      detail: `${flowBandMeaning(input.flowBand)} ${
        trendMeaning(input.flowSignal, input.flowBand, input.gaugeFreshness)
      } The live flow card compares this date, while this result assesses presentation near Fruitvale Road, not the full White River.`,
      tip: `${
        fishabilityTip(
          input.flowBand,
          input.flowSignal,
          input.gaugeFreshness,
        )
      } Verify water shape and safe access directly before carrying this read elsewhere.`,
    };
  }
  const scopeDetail = nilesScoped
    ? " This flow shape applies to the Niles mainstem reach only; verify the harbor, lower Michigan river, individual tailwaters, and Indiana water directly."
    : "";
  const baseTip = fishabilityTip(
    input.flowBand,
    input.flowSignal,
    input.gaugeFreshness,
  );
  return {
    headline: fishabilityHeadline(
      input.flowBand,
      input.flowSignal,
      input.gaugeFreshness,
    ),
    detail: `${flowBandMeaning(input.flowBand)} ${
      trendMeaning(input.flowSignal, input.flowBand, input.gaugeFreshness)
    } Fishability describes how this flow should fish if migratory fish are present; it does not estimate how many fish are in the river.${scopeDetail}`,
    tip: nilesScoped
      ? `${baseTip} Apply this recommendation at Niles; recheck water shape and safe access before carrying it to another St. Joseph section.`
      : baseTip,
  };
}

function bigManisteeFishabilityBandPoint(band: FlowBand): string {
  return ({
    very_low: "Unusually low flow concentrates useful depth into fewer places.",
    low: "Low flow reduces depth and cover across the Upper river.",
    normal_fishable:
      "The flow band supports readable lanes, seams, and holding water.",
    ideal:
      "The flow band offers the broadest mix of depth and presentation control.",
    high_fishable:
      "Higher flow pushes useful presentation water toward softer edges.",
    very_high:
      "Very high flow compresses controllable water into protected edges.",
    blown_out:
      "Excessive flow overwhelms normal lanes and presentation control.",
  } as Record<FlowBand, string>)[band];
}

function bigManisteeFishabilityTrendPoint(
  signal: RawFlowTrendSignal,
  _band: FlowBand,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale") {
    return "The Upper river may have changed since the last Wellston reading.";
  }
  return ({
    stable: "Steady flow should keep presentation lanes consistent.",
    falling: "Falling flow should sharpen established seams.",
    rising: "A modest rise is shifting lanes toward softer edges.",
    meaningful_rise:
      "A clear rise is moving controllable water toward current breaks.",
    sharp_rise: "A fast rise is replacing settled lanes with heavier current.",
    unknown: "Recent Wellston history cannot establish the flow direction.",
  } as Record<RawFlowTrendSignal, string>)[signal];
}

function bigManisteeFishabilityHeadline(
  band: FlowBand,
  trend: RawFlowTrendSignal,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale") {
    return "The aging Wellston reading limits Upper-river Fishability confidence.";
  }
  if (trend === "unknown") {
    return "Upper-river flow is workable, but its direction is unknown.";
  }
  if (band === "blown_out") {
    return "The Upper river is blown out for a dependable presentation plan.";
  }
  if (trend === "sharp_rise") {
    return "A fast Upper-river rise is shifting usable water toward protected edges.";
  }
  return ({
    very_low: "Very low Upper-river flow leaves limited depth and cover.",
    low: "Low Upper-river flow remains workable with less depth and cover.",
    normal_fishable: "Upper-river flow is in a comfortable presentation range.",
    ideal: "Upper-river flow is in its best presentation range.",
    high_fishable: "High Upper-river flow remains fishable in slower water.",
    very_high:
      "Very high Upper-river flow leaves little controllable presentation water.",
    blown_out: "The Upper river is blown out.",
  } as Record<FlowBand, string>)[band];
}

function bigManisteeFishabilityTip(
  band: FlowBand,
  trend: RawFlowTrendSignal,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale" || trend === "unknown") {
    return "Verify the Upper river directly before choosing presentation water.";
  }
  if (band === "blown_out") {
    return "Choose another day and verify current conditions through authoritative local sources.";
  }
  if (band === "very_high" || trend === "sharp_rise") {
    return "Favor protected margins and short controlled presentations. Choose another day if control is not dependable.";
  }
  if (band === "very_low" || band === "low") {
    return "Use the deepest connected water and keep disturbance low.";
  }
  if (band === "high_fishable") {
    return "Prioritize inside seams, protected edges, and current breaks.";
  }
  return "Cover readable seams and holding water with a controlled presentation.";
}

function pereMarquetteFishabilityCopy(input: {
  flowBand: FlowBand;
  flowSignal: RawFlowTrendSignal;
  gaugeFreshness: GaugeFreshness;
  sourceLabel: string;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const headline = input.gaugeFreshness === "stale"
    ? "The aging Scottville reading limits confidence in Lower river Fishability."
    : input.flowSignal === "unknown"
    ? "Scottville flow is workable, but its direction is unknown."
    : ({
      very_low: "Very low Scottville flow leaves limited depth and cover.",
      low: "Low Scottville flow remains workable with less depth and cover.",
      normal_fishable:
        "Scottville flow is in a comfortable presentation range.",
      ideal: "Scottville flow is in its best presentation range.",
      high_fishable: "High Scottville flow remains fishable in slower water.",
      very_high:
        "Very high Scottville flow leaves little controllable presentation water.",
      blown_out:
        "Scottville flow is blown out for a dependable presentation plan.",
    } as Record<FlowBand, string>)[input.flowBand];
  const bandPoint = ({
    very_low: "Unusually low flow concentrates useful depth into fewer places.",
    low: "Lower flow reduces depth and cover across the reach.",
    normal_fishable:
      "The flow band supports readable lanes, seams, and holding water.",
    ideal:
      "The flow band offers the broadest mix of depth, seams, and presentation control.",
    high_fishable:
      "Higher flow pushes useful presentation water toward softer edges.",
    very_high:
      "Very high flow compresses controllable water into the slowest protected edges.",
    blown_out:
      "Excessive flow overwhelms normal lanes and presentation control.",
  } as Record<FlowBand, string>)[input.flowBand];
  const trendPoint = pmFishabilityTrendPoint(
    input.flowSignal,
    input.gaugeFreshness,
  );
  const scopePoint =
    "The live flow card compares this date, while this result assesses the Lower river from Pere Marquette Lake to Scottville, not the full PM.";
  const tip = input.flowBand === "blown_out"
    ? "Choose another day and verify current conditions through authoritative local sources."
    : input.flowBand === "very_high" || input.flowSignal === "sharp_rise"
    ? "Favor protected margins and short controlled presentations. Choose another day if control is not dependable."
    : input.flowBand === "very_low"
    ? "Use the deepest connected water and keep disturbance low."
    : input.flowBand === "low"
    ? "Prioritize deeper seams and current breaks with enough cover."
    : input.flowBand === "high_fishable"
    ? "Prioritize inside seams, protected edges, and current breaks."
    : "Cover readable seams and holding water with a controlled presentation.";
  return {
    headline,
    detail: `${bandPoint} ${trendPoint} ${scopePoint}`,
    tip,
  };
}

function pmFishabilityTrendPoint(
  signal: RawFlowTrendSignal,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale") {
    return "The river may have changed since the last Scottville reading.";
  }
  return ({
    stable: "Stable flow should keep presentation lanes consistent.",
    falling:
      "Falling flow should sharpen established seams as the reach settles.",
    rising: "Rising flow is beginning to shift lanes toward softer edges.",
    meaningful_rise:
      "A clear rise is moving controllable presentations toward inside seams and current breaks.",
    sharp_rise:
      "A fast rise is quickly replacing settled lanes with heavier current.",
    unknown:
      "Recent Scottville history cannot show whether presentation water is improving or worsening.",
  } as Record<RawFlowTrendSignal, string>)[signal];
}

function fishabilityHeadline(
  band: FlowBand,
  trend: RawFlowTrendSignal,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale") {
    return "The last river reading was fishable, but it is aging and may no longer describe the water accurately.";
  }
  if (trend === "unknown") {
    return "The river appears fishable, but its direction is unclear, so confidence is limited.";
  }
  if (band === "blown_out") {
    return trend === "sharp_rise"
      ? "The river is blown out and still rising fast, so normal fishing water is not dependable."
      : "The river is too high and unsettled for a dependable fishing recommendation.";
  }
  if (trend === "sharp_rise") {
    return band === "very_high"
      ? "The river is already very high and rising fast, leaving very little controllable fishing water."
      : "The river is rising fast, and usable fishing water is shifting toward slower margins and current breaks.";
  }
  if (trend === "meaningful_rise" && band === "high_fishable") {
    return "The river is fishable, but rising water and faster current are narrowing the easiest places to present a bait.";
  }
  switch (band) {
    case "very_low":
      return "The river is fishable, but very low water will make fish easier to disturb and productive water harder to find.";
    case "low":
      return "The river is fishable, but lower water leaves less cover and less room for error.";
    case "normal_fishable":
      return "The river is in a comfortable, fishable range with a manageable pace.";
    case "ideal":
      return "The river is in an excellent range for covering water and presenting effectively.";
    case "high_fishable":
      return "The river is fishable, but higher flow is moving at a faster pace and narrowing the easiest water.";
    case "very_high":
      return "The river is running very high, leaving fewer practical places to fish effectively.";
  }
}

function flowBandMeaning(band: FlowBand): string {
  switch (band) {
    case "very_low":
      return "Water is unusually low, reducing cover and concentrating the best depth into fewer places.";
    case "low":
      return "Water is lower than ideal but still workable, with less depth and cover across the river.";
    case "normal_fishable":
      return "Flow is in a dependable working range with a useful mix of travel lanes, seams, and holding water.";
    case "ideal":
      return "Flow offers the broadest mix of depth, current breaks, and controllable presentation water.";
    case "high_fishable":
      return "Higher flow is pushing more current through the main channel, but softer edges and protected lanes remain workable.";
    case "very_high":
      return "Very high flow is reducing access and the amount of water where a presentation can be controlled.";
    case "blown_out":
      return "Excessive flow is overwhelming normal holding water and making access and presentation unreliable.";
  }
}

function trendMeaning(
  signal: RawFlowTrendSignal,
  band: FlowBand,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale") {
    return "Because the latest reading is aging, the river may have changed since it was reported.";
  }
  switch (signal) {
    case "stable":
      return stableTrendMeaning(band);
    case "falling":
      return fallingTrendMeaning(band);
    case "rising":
      return risingTrendMeaning(band);
    case "meaningful_rise":
      return meaningfulRiseMeaning(band);
    case "sharp_rise":
      return sharpRiseMeaning(band);
    case "unknown":
      return "There is not enough recent information to tell whether the river is rising or falling, which lowers confidence in the read.";
  }
}

function stableTrendMeaning(band: FlowBand): string {
  switch (band) {
    case "very_low":
      return "The low water is holding rather than refilling, so the few deeper slots should remain easy to identify.";
    case "low":
      return "The lower flow is holding steady, so its limited depth and cover should remain consistent.";
    case "normal_fishable":
      return "The steady flow should keep travel lanes, seams, and holding water easy to read from one pass to the next.";
    case "ideal":
      return "The steady flow should keep depth, current breaks, and presentation speed consistent across the river.";
    case "high_fishable":
      return "The higher flow is not climbing, so softer edges beside the main current should remain well defined.";
    case "very_high":
      return "The river is not climbing quickly, but practical fishing water remains compressed into the slowest edges.";
    case "blown_out":
      return "The river is not climbing quickly, but it must fall substantially before normal holding lanes and presentation control return.";
  }
}

function fallingTrendMeaning(band: FlowBand): string {
  if (band === "very_low" || band === "low") {
    return "The river is still falling, so shallow lanes may lose depth while the deepest connected water becomes more important.";
  }
  if (band === "normal_fishable" || band === "ideal") {
    return "The river is settling, which should sharpen seams and make established holding water easier to read.";
  }
  if (band === "high_fishable") {
    return "The higher flow is falling, so controllable edges should expand as the river continues to settle.";
  }
  return "The river is falling, but very high water will take time to restore normal holding lanes and presentation control.";
}

function risingTrendMeaning(band: FlowBand): string {
  if (band === "very_low" || band === "low") {
    return "The early rise is adding depth and cover, but the best travel lanes are beginning to shift.";
  }
  if (band === "normal_fishable" || band === "ideal") {
    return "The early rise is adding pace and depth, with inside seams and the upstream edges of holes changing first.";
  }
  return "The additional rise is adding speed and squeezing controllable presentations toward protected edges.";
}

function meaningfulRiseMeaning(band: FlowBand): string {
  if (band === "very_low" || band === "low") {
    return "The rise is restoring depth, but lanes and resting pockets are changing too quickly to fish as settled low water.";
  }
  if (band === "normal_fishable" || band === "ideal") {
    return "Depth and current are changing enough to move the most controllable presentations toward inside seams and current breaks.";
  }
  return "The rising water is pushing hard through the main channel and compressing practical fishing water along protected edges.";
}

function sharpRiseMeaning(band: FlowBand): string {
  if (band === "very_low" || band === "low") {
    return "The fast rise is rapidly changing depth, lanes, and resting pockets despite the river's lower starting level.";
  }
  if (band === "normal_fishable" || band === "ideal") {
    return "The fast rise is quickly replacing settled lanes with heavier current and newly formed soft edges.";
  }
  return "The fast rise is forcing usable fishing water out of the main flow and into the slowest protected margins.";
}

function fishabilityTip(
  band: FlowBand,
  trend: RawFlowTrendSignal,
  freshness: GaugeFreshness,
): string {
  if (freshness === "stale") {
    return "Do not choose a reach from this reading alone. Check the water at the first access, and begin only in bank-side water where you can control the entire presentation.";
  }
  if (band === "blown_out") {
    return "Choose a lower-water day for the better fishing opportunity. If you fish now, stay tight to protected banks, slow inside turns, and the downstream side of major current breaks; keep presentations short and leave the main flow alone.";
  }
  if (trend === "sharp_rise") {
    return "Leave the main channel alone. Fish newly formed soft margins, inside bends, and the downstream side of current breaks with short controlled presentations.";
  }
  if (trend === "unknown") {
    return "Start at a bank-side inside bend or soft seam where the full presentation stays under control. Skip faster water until the river's direction is verified.";
  }
  if (trend === "meaningful_rise") {
    return meaningfulRiseTip(band);
  }
  if (trend === "rising") {
    return risingTip(band);
  }
  if (trend === "falling") {
    return fallingTip(band);
  }
  switch (band) {
    case "very_low":
      return "Fish first or last light. Begin at the deepest shaded holes and slots, approach quietly, and keep foot traffic out of shallow travel lanes.";
    case "low":
      return "Start with the deepest connected holding water, then fish shaded outside bends and cover. Approach quietly and make the first pass count.";
    case "normal_fishable":
      return "Start where a main travel lane enters the first established hole. Fish the head, inside seam, and tail in order, then move to the next piece of holding water.";
    case "ideal":
      return "Begin on the primary travel lane feeding deep holding water. Work each hole from its head through the inside seam and tail, then keep moving until fish establish a pattern.";
    case "high_fishable":
      return "Start tight to the bank on inside bends and below current-breaking cover. Shorten the presentation and keep it in the slower edge instead of forcing the main flow.";
    case "very_high":
      return "Fish only bank-side soft pockets, protected inside turns, and current breaks. Make short controlled presentations and skip every main-channel lane.";
  }
}

function fallingTip(band: FlowBand): string {
  switch (band) {
    case "very_low":
      return "Fish only the deepest connected slots at first or last light. Skip shallow lanes that are losing depth, approach from downstream, and keep every pass quiet.";
    case "low":
      return "Begin in the deepest connected holding water and fish its shaded edge first. Skip shallow travel lanes that are draining as the river falls.";
    case "normal_fishable":
      return "Start where a sharpening seam enters an established hole. Fish from the head into the deeper half and tail, then move past shallow lanes that are losing depth.";
    case "ideal":
      return "Begin on the primary seam feeding deep holding water. Work each hole from head to tail, giving the deeper downstream half one final pass as the river settles.";
    case "high_fishable":
      return "Start on inside bends and bank-side current breaks, then test newly defined seams as the river eases. Leave the main-channel current for last.";
    case "very_high":
      return "Stay with bank-side protected pockets and slow inside turns. Do not return to main-channel lanes until the falling river restores presentation control.";
    case "blown_out":
      return "Choose a lower-water day for the better fishing opportunity. If you fish now, stay tight to protected banks and slow inside turns, and use only short controlled presentations.";
  }
}

function risingTip(band: FlowBand): string {
  switch (band) {
    case "very_low":
      return "Start where fresh depth reaches the deepest connected holes. Fish the new inside edge without walking through shallow travel water, then move as the lane changes.";
    case "low":
      return "Begin on newly covered inside seams that connect directly to deep holding water. Keep the presentation on the soft edge and avoid wading through the new lane.";
    case "normal_fishable":
      return "Start on the inside seam forming above the first established hole. Follow that softer edge into the resting water and keep the faster center lane secondary.";
    case "ideal":
      return "Begin on the soft inside edge of the primary travel lane, then fish the first deep resting hole above it. Recheck that edge as added depth changes the lane.";
    case "high_fishable":
      return "Start tight to bank-side cover and protected inside bends. Use short presentations in the new soft edge and leave the accelerating main channel alone.";
    case "very_high":
      return "Fish only protected bank-side pockets and inside turns while the river rises. Skip the main channel and stop when a presentation will not remain controlled.";
    case "blown_out":
      return "Choose a lower-water day for the better fishing opportunity. If you fish now, work only protected banks, slow inside turns, and the downstream side of major current breaks.";
  }
}

function meaningfulRiseTip(band: FlowBand): string {
  if (band === "very_low" || band === "low") {
    return "Fish newly covered inside margins that connect directly to the deepest holding water. Skip the old shallow lane and keep moving as depth and current rebuild it.";
  }
  if (band === "normal_fishable" || band === "ideal") {
    return "Move off the center lane. Work inside seams, the downstream side of current breaks, and the first deep resting pocket with short controlled presentations.";
  }
  if (band === "high_fishable" || band === "very_high") {
    return "Fish only protected margins, inside bends, and the downstream side of major current breaks. Leave the main-channel current alone while the rise continues.";
  }
  return "Choose a lower-water day for the better fishing opportunity. If you fish now, stay tight to protected banks and major current breaks, and leave the main flow alone.";
}

function unavailableResult(
  input: FishabilityScoreInput,
  reason: "gauge" | "band",
): FishabilityScoreResult {
  if (input.copyStrategy === "muskegon_croton_tailwater") {
    return {
      score: null,
      label: "Unavailable",
      headline: reason === "band"
        ? "A Fishability band is not available for the Croton area."
        : "A current Croton Fishability reading is unavailable.",
      detail: reason === "band"
        ? "Without a local Fishability band, flow cannot be translated into Croton-area presentation conditions."
        : "Without current Croton flow and direction, presentation conditions near the dam cannot be determined.",
      tip:
        "Do not extend an old or missing Croton read through the Muskegon River. Verify current conditions directly.",
      reasonCodes: reason === "band"
        ? [
          gaugeReasonCode(input.gaugeFreshness),
          "baseline_missing",
          ...(input.flowReasonCodes ?? []),
        ]
        : [gaugeReasonCode(input.gaugeFreshness)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.copyStrategy === "big_manistee_tailwater") {
    return {
      score: null,
      label: "Unavailable",
      headline: reason === "band"
        ? "A Fishability band is not available for the Upper river."
        : "A current Wellston Fishability reading is unavailable.",
      detail: reason === "band"
        ? "Without a local Fishability band, flow cannot be translated into Upper-river presentation conditions."
        : "Without current Wellston flow and direction, Upper-river presentation conditions cannot be determined.",
      tip:
        "Do not extend an old or missing Wellston read through the Big Manistee. Verify current conditions directly.",
      reasonCodes: reason === "band"
        ? [
          gaugeReasonCode(input.gaugeFreshness),
          "baseline_missing",
          ...(input.flowReasonCodes ?? []),
        ]
        : [gaugeReasonCode(input.gaugeFreshness)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.copyStrategy === "pere_marquette") {
    return {
      score: null,
      label: "Unavailable",
      headline: reason === "band"
        ? "A Fishability band is not available at Scottville."
        : "A current Scottville reading is unavailable.",
      detail: reason === "band"
        ? "Without a local Fishability band, Scottville flow cannot be translated into Lower river presentation conditions."
        : "Without current Scottville flow and direction, Lower river presentation conditions cannot be determined.",
      tip:
        "Do not extend an old or missing Scottville read across the PM. Use current authoritative local information.",
      reasonCodes: reason === "band"
        ? [
          gaugeReasonCode(input.gaugeFreshness),
          "baseline_missing",
          ...(input.flowReasonCodes ?? []),
        ]
        : [gaugeReasonCode(input.gaugeFreshness)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (reason === "band") {
    return {
      score: null,
      label: "Unavailable",
      headline: "This river does not have a dependable Fishability read yet.",
      detail:
        "River flow affects each river differently, and there is not enough local knowledge to translate today's water into a responsible fishing recommendation.",
      tip:
        "Do not use this card to choose fishing water. Rely on direct observation and verified local river guidance; FinFindr will not borrow another river's idea of low, ideal, or high flow.",
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        "baseline_missing",
        ...(input.flowReasonCodes ?? []),
      ],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  return {
    score: null,
    label: "Unavailable",
    headline: "There is no dependable Fishability read right now.",
    detail:
      "A recent river-level reading is missing, so current flow and direction cannot be judged responsibly.",
    tip:
      "Do not plan from the last known level. Check again after the next update, and verify the river at the first access before choosing where or how to fish.",
    reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function gaugeReasonCode(freshness: GaugeFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "gauge_fresh";
    case "stale":
      return "gauge_stale";
    case "missing":
      return "gauge_missing";
    case "older_than_24h":
      return "gauge_older_than_24h";
  }
}

function applyCap(score: number, cap: number, appliedCaps: number[]): number {
  if (score > cap) appliedCaps.push(cap);
  return Math.min(score, cap);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
