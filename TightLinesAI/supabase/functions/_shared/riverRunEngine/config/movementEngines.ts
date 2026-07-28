import type { MovementEngineId, RunType, Season } from "../types.ts";

export type MovementEngineDefinition = {
  movementEngineId: MovementEngineId;
  version: string;
  implemented: boolean;
  supportedSeasons: Season[];
  supportedRunTypes: RunType[];
  temperatureDirection: "cooling" | "warming" | "stable";
  rainActsAsPrecursor: boolean;
  gaugeResponseRequiredForStrongPush: boolean;
  description: string;
};

export const MOVEMENT_ENGINE_DEFINITIONS: Record<
  MovementEngineId,
  MovementEngineDefinition
> = {
  fall_cooling: {
    movementEngineId: "fall_cooling",
    version: "fall-cooling-v2",
    implemented: true,
    supportedSeasons: ["fall"],
    supportedRunTypes: ["fall_spawn", "fall_entry"],
    temperatureDirection: "cooling",
    rainActsAsPrecursor: true,
    gaugeResponseRequiredForStrongPush: true,
    description:
      "Fall movement engine for runs where suitable cooling and a measured river response can support movement.",
  },
  spring_warming: {
    movementEngineId: "spring_warming",
    version: "unimplemented",
    implemented: false,
    supportedSeasons: ["spring"],
    supportedRunTypes: ["spring_spawn"],
    temperatureDirection: "warming",
    rainActsAsPrecursor: true,
    gaugeResponseRequiredForStrongPush: true,
    description:
      "Reserved configuration identity for a future spring-warming movement engine.",
  },
  winter_thaw: {
    movementEngineId: "winter_thaw",
    version: "unimplemented",
    implemented: false,
    supportedSeasons: ["winter"],
    supportedRunTypes: ["winter_run"],
    temperatureDirection: "warming",
    rainActsAsPrecursor: true,
    gaugeResponseRequiredForStrongPush: true,
    description:
      "Reserved configuration identity for a future winter-thaw movement engine.",
  },
  summer_cooling: {
    movementEngineId: "summer_cooling",
    version: "unimplemented",
    implemented: false,
    supportedSeasons: ["summer"],
    supportedRunTypes: ["summer_run"],
    temperatureDirection: "cooling",
    rainActsAsPrecursor: true,
    gaugeResponseRequiredForStrongPush: true,
    description:
      "Reserved configuration identity for a future summer-cooling movement engine.",
  },
  stable_cool_holding: {
    movementEngineId: "stable_cool_holding",
    version: "unimplemented",
    implemented: false,
    supportedSeasons: ["spring", "summer", "fall", "winter"],
    supportedRunTypes: ["holding"],
    temperatureDirection: "stable",
    rainActsAsPrecursor: false,
    gaugeResponseRequiredForStrongPush: false,
    description:
      "Reserved configuration identity for a future stable-water holding engine.",
  },
};

export function getMovementEngineDefinition(
  movementEngineId: MovementEngineId,
): MovementEngineDefinition {
  return MOVEMENT_ENGINE_DEFINITIONS[movementEngineId];
}
