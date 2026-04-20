import { createHash } from "node:crypto";
import type { EngineContext } from "../../../howFishingEngine/contracts/context.ts";
import type { RecommenderV4Species } from "../contracts.ts";
import { xfnv1a } from "./xfnv1a.ts";

/** P27 — anonymous branch uses `anon-{sha256(...)}` then FNV seeds the PRNG. */
export function buildAnonSeedKey(
  local_date: string,
  species: RecommenderV4Species,
  region_key: string,
  month: number,
  water_type: EngineContext,
): string {
  const material = `${local_date}|${species}|${region_key}|${month}|${water_type}`;
  const hex = createHash("sha256").update(material).digest("hex");
  return `anon-${hex}`;
}

export function buildSeed(
  user_id: string | null | undefined,
  local_date: string,
  species: RecommenderV4Species,
  region_key: string,
  month: number,
  water_type: EngineContext,
): number {
  const key =
    user_id != null && user_id.length > 0
      ? [user_id, local_date, species, region_key, String(month), water_type].join("|")
      : buildAnonSeedKey(local_date, species, region_key, month, water_type);
  return xfnv1a(key);
}
