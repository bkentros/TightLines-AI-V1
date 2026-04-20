import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { RecommenderV4Species, SeasonalRowV4 } from "../v4/contracts.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/trout.ts";

function rowsForSpecies(
  species: RecommenderV4Species,
): readonly SeasonalRowV4[] {
  switch (species) {
    case "largemouth_bass":
      return LARGEMOUTH_BASS_SEASONAL_ROWS_V4;
    case "smallmouth_bass":
      return SMALLMOUTH_BASS_SEASONAL_ROWS_V4;
    case "northern_pike":
      return NORTHERN_PIKE_SEASONAL_ROWS_V4;
    case "trout":
      return TROUT_SEASONAL_ROWS_V4;
    default: {
      const _e: never = species;
      return _e;
    }
  }
}

/** Thrown when a gated request has no authored seasonal row — intentional 422 response, not a generic engine fault. */
export class SeasonalRowMissingError extends Error {
  readonly species: RecommenderV4Species;
  readonly region_key: RegionKey;
  readonly month: number;
  readonly water_type: EngineContext;

  constructor(args: {
    species: RecommenderV4Species;
    region_key: RegionKey;
    month: number;
    water_type: EngineContext;
  }) {
    super(
      `Seasonal matrix has no published row for ${args.species} × ${args.region_key} × month ${args.month} × ${args.water_type}.`,
    );
    this.name = "SeasonalRowMissingError";
    this.species = args.species;
    this.region_key = args.region_key;
    this.month = args.month;
    this.water_type = args.water_type;
  }
}

function rowMatches(
  row: SeasonalRowV4,
  species: RecommenderV4Species,
  region_key: RegionKey,
  month: number,
  water_type: EngineContext,
): boolean {
  return (
    row.species === species &&
    row.region_key === region_key &&
    row.month === month &&
    row.water_type === water_type &&
    (row.state_code == null || row.state_code === "")
  );
}

/**
 * Exact seasonal lookup — no region borrowing, no state override rows.
 * Generated Phase 2–4 rows omit `state_code`; any future state-scoped rows are ignored here.
 */
export function resolveSeasonalRowRebuild(
  species: RecommenderV4Species,
  region_key: RegionKey,
  month: number,
  water_type: EngineContext,
): SeasonalRowV4 {
  for (const row of rowsForSpecies(species)) {
    if (rowMatches(row, species, region_key, month, water_type)) {
      return row;
    }
  }
  throw new SeasonalRowMissingError({
    species,
    region_key,
    month,
    water_type,
  });
}

/** Fast existence check (no throw). */
export function hasSeasonalRowRebuild(
  species: RecommenderV4Species,
  region_key: RegionKey,
  month: number,
  water_type: EngineContext,
): boolean {
  for (const row of rowsForSpecies(species)) {
    if (rowMatches(row, species, region_key, month, water_type)) {
      return true;
    }
  }
  return false;
}
