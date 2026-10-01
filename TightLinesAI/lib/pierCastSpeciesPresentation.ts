import type {
  PierCastReviewDateOutlookRead,
  PierCastSpeciesId,
} from "./pierCastContracts";

export const PRIMARY_PIER_CAST_SPECIES: ReadonlySet<PierCastSpeciesId> =
  new Set([
    "coho_salmon",
    "chinook_salmon",
    "atlantic_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
    "freshwater_drum",
  ]);

export function isPrimaryPierCastSpecies(
  speciesId: PierCastSpeciesId,
): boolean {
  return PRIMARY_PIER_CAST_SPECIES.has(speciesId);
}

const PIER_CAST_SPECIES_SHORT_LABELS: Record<PierCastSpeciesId, string> = {
  chinook_salmon: "CHINOOK",
  coho_salmon: "COHO",
  atlantic_salmon: "ATLANTIC",
  steelhead: "STEELHEAD",
  brown_trout: "BROWN",
  lake_trout: "LAKER",
  walleye: "WALLEYE",
  smallmouth_bass: "SMALLMOUTH",
  freshwater_drum: "DRUM",
  yellow_perch: "PERCH",
  lake_whitefish: "WHITEFISH",
  round_whitefish: "MENOMINEE",
  channel_catfish: "CATFISH",
  largemouth_bass: "LARGEMOUTH",
  northern_pike: "PIKE",
  burbot: "BURBOT",
  white_perch: "WHITE PERCH",
  white_bass: "WHITE BASS",
  bluegill: "BLUEGILL",
};

export function pierCastSpeciesShortLabel(
  speciesId: PierCastSpeciesId,
): string {
  return PIER_CAST_SPECIES_SHORT_LABELS[speciesId];
}

export function sortPierCastSpeciesByOpportunity<
  Species extends PierCastReviewDateOutlookRead["species"][number],
>(species: readonly Species[]): Species[] {
  return [...species].sort((left, right) => {
    const leftScore = left.biological.status === "available"
      ? left.biological.score
      : Number.NEGATIVE_INFINITY;
    const rightScore = right.biological.status === "available"
      ? right.biological.score
      : Number.NEGATIVE_INFINITY;
    return rightScore - leftScore ||
      left.speciesId.localeCompare(right.speciesId);
  });
}

export function pierCastSeasonalPotential(
  species: PierCastReviewDateOutlookRead["species"][number] | undefined,
): number | null {
  if (!species) return null;
  const value = species.seasonalRating ??
    species.activeMode?.seasonalPotential ?? null;
  return value !== null && Number.isFinite(value) ? value : null;
}

export function formatPierCastSeasonalPotential(value: number | null): string {
  return value === null || !Number.isFinite(value)
    ? "—"
    : `~${value.toFixed(1)}`;
}

export type PierCastSeasonalTrend = {
  direction:
    | "rising"
    | "falling"
    | "steady"
    | "turning_up"
    | "turning_down"
    | "unavailable";
  label: string;
  modeShift: boolean;
};

const SEASONAL_TREND_EPSILON = 0.025;

/** Describe the same species across adjacent forecast dates, never card rank. */
export function pierCastSeasonalTrend(input: {
  dates: readonly PierCastReviewDateOutlookRead[];
  selectedIndex: number;
  speciesId: PierCastSpeciesId;
}): PierCastSeasonalTrend {
  const at = (index: number) =>
    input.dates[index]?.species.find((row) =>
      row.speciesId === input.speciesId
    );
  const previous = at(input.selectedIndex - 1);
  const current = at(input.selectedIndex);
  const next = at(input.selectedIndex + 1);
  const previousPotential = pierCastSeasonalPotential(previous);
  const currentPotential = pierCastSeasonalPotential(current);
  const nextPotential = pierCastSeasonalPotential(next);
  const modeIds = [previous, current, next]
    .map((row) => row?.activeMode?.modeId)
    .filter((modeId): modeId is string => Boolean(modeId));
  const modeShift = new Set(modeIds).size > 1;

  if (currentPotential === null) {
    return { direction: "unavailable", label: "TREND UNAVAILABLE", modeShift };
  }

  const before = previousPotential === null
    ? null
    : currentPotential - previousPotential;
  const after = nextPotential === null
    ? null
    : nextPotential - currentPotential;
  if (
    before !== null && after !== null &&
    before < -SEASONAL_TREND_EPSILON && after > SEASONAL_TREND_EPSILON
  ) {
    return { direction: "turning_up", label: "TURNING UP", modeShift };
  }
  if (
    before !== null && after !== null &&
    before > SEASONAL_TREND_EPSILON && after < -SEASONAL_TREND_EPSILON
  ) {
    return { direction: "turning_down", label: "TURNING DOWN", modeShift };
  }

  const delta = after ?? before;
  if (delta === null || Math.abs(delta) <= SEASONAL_TREND_EPSILON) {
    return { direction: "steady", label: "STEADY", modeShift };
  }
  return delta > 0
    ? { direction: "rising", label: "RISING", modeShift }
    : { direction: "falling", label: "FALLING", modeShift };
}

export function formatPierCastModeId(
  modeId: string | null | undefined,
): string {
  return modeId
    ? modeId.replaceAll("_", " ").toUpperCase()
    : "MODE UNAVAILABLE";
}

function headlineForSpecies(
  species: PierCastReviewDateOutlookRead["species"],
): PierCastReviewDateOutlookRead["headline"] {
  const eligible = species
    .filter((row) =>
      row.biological.status === "available" &&
      row.coverage.status === "complete" &&
      row.targetingEligibility === "eligible"
    )
    .sort((left, right) => {
      const leftScore = left.biological.score ?? Number.NEGATIVE_INFINITY;
      const rightScore = right.biological.score ?? Number.NEGATIVE_INFINITY;
      return rightScore - leftScore ||
        left.speciesId.localeCompare(right.speciesId);
    });
  const leader = eligible[0];
  if (!leader) {
    const reasonCode = "no_eligible_headline_species";
    return {
      overall: {
        status: "unavailable",
        score: null,
        reasonCodes: [reasonCode],
        ratingName: "FinFindr Opportunity Rating",
      },
      drivingSpeciesId: null,
      headlineMode: "unavailable",
      promotion: { status: "unknown", reasonCodes: [reasonCode] },
      reasonCodes: [reasonCode],
    };
  }

  const promoted = leader.promotion.status === "eligible" ||
    leader.promotion.status === "limited";
  return {
    overall: leader.biological,
    drivingSpeciesId: leader.speciesId,
    headlineMode: promoted ? "daily_outlook" : "biological_only",
    promotion: leader.promotion,
    reasonCodes: promoted ? [] : ["headline_biology_only"],
  };
}

/** Show all configured targets except bluegill, with a primary-species headline. */
export function presentPierCastDate(
  date: PierCastReviewDateOutlookRead,
): PierCastReviewDateOutlookRead {
  const species = date.species.filter((row) => row.speciesId !== "bluegill");
  return {
    ...date,
    species,
    headline: date.headline.overall.status === "available"
      ? headlineForSpecies(
        species.filter((row) =>
          isPrimaryPierCastSpecies(row.speciesId)
        ),
      )
      : date.headline,
  };
}
