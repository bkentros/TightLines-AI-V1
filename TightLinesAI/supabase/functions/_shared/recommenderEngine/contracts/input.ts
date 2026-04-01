import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { SpeciesGroup } from "./species.ts";

export type WaterClarity = "clear" | "stained" | "dirty";

/**
 * Full request to the recommender edge function.
 * water_clarity is required — no default fallback.
 */
export type RecommenderRequest = {
  location: {
    latitude: number;
    longitude: number;
    state_code: string;
    region_key: RegionKey;
    local_date: string;
    local_timezone: string;
    month: number; // 1–12
  };
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  /** Raw environment data — same shape as howFishing engine input */
  env_data: Record<string, unknown>;
};
