import type { ActivityRules, FishabilityBands, PushRules } from "../types.ts";

export function buildDirectEventPushRules(input: {
  version: string;
  fishability: FishabilityBands;
  hydraulicTrend: NonNullable<ActivityRules["hydraulicTrend"]>;
  activityProfile: ActivityRules["profile"];
  movementTemperature: Omit<PushRules["temperature"], "suitabilityLabel">;
  hydraulicMode?: "trigger" | "disabled";
  temperatureMode: NonNullable<PushRules["directEvent"]>["temperature"];
  evidenceConfidence?: NonNullable<
    PushRules["directEvent"]
  >["evidenceConfidence"];
  maximumLevel?: NonNullable<PushRules["directEvent"]>["maximumLevel"];
  limitationCopy?: string;
  evidenceNotes: string;
  sourceNotes: string;
}): PushRules {
  const temperature = input.movementTemperature;
  const livingFish = input.activityProfile === "steelhead_feeding" ||
    input.activityProfile === "brown_trout_fall_reaction";
  return {
    version: input.version,
    model: "direct_event_state",
    directEvent: {
      hydraulic: input.hydraulicMode ?? "trigger",
      temperature: input.temperatureMode,
      evidenceConfidence: input.evidenceConfidence ?? "standard",
      ...(input.maximumLevel ? { maximumLevel: input.maximumLevel } : {}),
      ...(input.limitationCopy ? { limitationCopy: input.limitationCopy } : {}),
      buildingCoolingF: 0.75,
      coolingF: 1.5,
      strongCoolingF: 3,
      persistenceHours: 48,
      fullRetentionFraction: 0.65,
      minimumRetentionFraction: 0.35,
    },
    hydraulic: {
      metric: input.fishability.metric,
      sourceLabel: input.fishability.sourceLabel,
      lowValue: input.fishability.tooLow.max,
      highValue: input.fishability.highFishable.max,
      severeHighValue: input.fishability.blownOut.min,
      rising24h: input.hydraulicTrend.rising24h,
      meaningfulRise24h: input.hydraulicTrend.meaningfulRise24h,
      sharpRise24h: input.hydraulicTrend.sharpRise24h,
    },
    rain: { meaningful48hIn: 997, strong48hIn: 998, heavy48hIn: 999 },
    temperature: {
      ...temperature,
      suitabilityLabel: livingFish
        ? "cool-water movement range"
        : input.activityProfile === "coho_fall_reaction"
        ? "fall coho movement range"
        : "fall Chinook movement range",
    },
    caps: {
      staleGauge: 55,
      unknownTrend: 49,
      noGaugeResponse: 50,
      tooWarm: 64,
      migrationBarrier: 49,
      severeHighFlow: 49,
      outsideExtendedWindow: 50,
      coldHolding: 49,
    },
    evidenceNotes: input.evidenceNotes,
    sourceNotes: input.sourceNotes,
  };
}
