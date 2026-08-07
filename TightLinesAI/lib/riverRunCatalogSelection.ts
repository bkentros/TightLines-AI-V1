import type {
  RiverRunCatalogResponse,
  RiverRunCatalogRiver,
  RiverRunCatalogRun,
  RiverRunCatalogState,
  RiverRunSeason,
} from "./riverRunContracts";

export type RiverRunCatalogTarget = {
  state: RiverRunCatalogState;
  river: RiverRunCatalogRiver;
  run: RiverRunCatalogRun;
};

export type RiverRunChoice = {
  id: string;
  label: string;
  subtitle?: string;
  disabled?: boolean;
};

const COMING_LATER_SUBTITLE = "Coming later";

const STATE_PRESENTATION: RiverRunChoice[] = [
  { id: "MI", label: "Michigan" },
  { id: "IN", label: "Indiana" },
  { id: "NY", label: "New York" },
  { id: "WI", label: "Wisconsin" },
  { id: "OH", label: "Ohio" },
];

const SEASON_PRESENTATION: RiverRunChoice[] = [
  { id: "fall", label: "Fall" },
  { id: "winter", label: "Winter" },
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
];

const SPECIES_PRESENTATION: RiverRunChoice[] = [
  { id: "chinook_salmon", label: "Chinook Salmon" },
  { id: "coho_salmon", label: "Coho Salmon" },
  { id: "steelhead", label: "Steelhead" },
  { id: "atlantic_salmon", label: "Atlantic Salmon" },
];

const MICHIGAN_RIVER_PRESENTATION: RiverRunChoice[] = [
  { id: "pere_marquette", label: "Pere Marquette River" },
  { id: "betsie", label: "Betsie River" },
  { id: "big_manistee", label: "Big Manistee River" },
  { id: "muskegon", label: "Muskegon River" },
  { id: "st_joseph", label: "St. Joseph River" },
  { id: "grand", label: "Grand River" },
  { id: "platte", label: "Platte River" },
  { id: "white", label: "White River" },
  { id: "au_sable", label: "Au Sable River" },
];

const MICHIGAN_FUTURE_RIVER_IDS_BY_SPECIES: Record<string, string[]> = {
  chinook_salmon: MICHIGAN_RIVER_PRESENTATION
    .filter((river) => river.id !== "st_joseph")
    .map((river) => river.id),
  coho_salmon: MICHIGAN_RIVER_PRESENTATION
    .filter((river) => river.id !== "st_joseph")
    .map((river) => river.id),
  steelhead: MICHIGAN_RIVER_PRESENTATION.map((river) => river.id),
  atlantic_salmon: ["au_sable"],
};

function mergeWithPresentation(
  supportedChoices: RiverRunChoice[],
  presentationChoices: RiverRunChoice[],
): RiverRunChoice[] {
  const supportedById = new Map(
    supportedChoices.map((choice) => [choice.id, choice]),
  );
  const presentedIds = new Set(presentationChoices.map((choice) => choice.id));
  return [
    ...presentationChoices.map((choice) =>
      supportedById.get(choice.id) ?? {
        ...choice,
        subtitle: COMING_LATER_SUBTITLE,
        disabled: true,
      }
    ),
    ...supportedChoices.filter((choice) => !presentedIds.has(choice.id)),
  ];
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function formatRiverRunSpecies(species: string): string {
  return species
    .trim()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatRiverRunSeason(season: RiverRunSeason): string {
  return season.charAt(0).toUpperCase() + season.slice(1);
}

export function riverRunStateChoices(
  catalog: RiverRunCatalogResponse,
): RiverRunChoice[] {
  const supportedChoices = catalog.states
    .filter((state) => state.rivers.some((river) => river.runs.length > 0))
    .map((state) => ({
      id: state.state,
      label: state.displayName ?? state.state,
      subtitle: `${state.rivers.length} supported ${
        state.rivers.length === 1 ? "river" : "rivers"
      }`,
    }));
  return mergeWithPresentation(supportedChoices, STATE_PRESENTATION);
}

export function riverRunSeasonChoices(
  catalog: RiverRunCatalogResponse,
  stateCode: string | null,
): RiverRunChoice[] {
  const state = catalog.states.find((item) => item.state === stateCode);
  if (!state) return [];
  const supportedChoices = uniqueById(
    state.rivers.flatMap((river) =>
      river.runs.map((run) => ({
        id: run.season,
        label: formatRiverRunSeason(run.season),
        subtitle: "Seasonal migration",
      }))
    ),
  );
  return mergeWithPresentation(supportedChoices, SEASON_PRESENTATION);
}

export function riverRunSpeciesChoices(
  catalog: RiverRunCatalogResponse,
  stateCode: string | null,
  season: RiverRunSeason | null,
): RiverRunChoice[] {
  const state = catalog.states.find((item) => item.state === stateCode);
  if (!state || !season) return [];
  const supportedChoices = uniqueById(
    state.rivers.flatMap((river) =>
      river.runs
        .filter((run) => run.season === season)
        .map((run) => ({
          id: run.species,
          label: formatRiverRunSpecies(run.species),
          subtitle: run.displayName,
        }))
    ),
  );
  return mergeWithPresentation(supportedChoices, SPECIES_PRESENTATION);
}

export function riverRunRiverChoices(
  catalog: RiverRunCatalogResponse,
  stateCode: string | null,
  season: RiverRunSeason | null,
  species: string | null,
): RiverRunChoice[] {
  const state = catalog.states.find((item) => item.state === stateCode);
  if (!state || !season || !species) return [];
  const supportedChoices = state.rivers
    .filter((river) =>
      river.runs.some((run) => run.season === season && run.species === species)
    )
    .map((river) => ({
      id: river.riverId,
      label: river.displayName,
      subtitle: "Audited river migration",
    }));
  if (stateCode === "IN" && season === "fall" && species === "steelhead") {
    return mergeWithPresentation(supportedChoices, [
      { id: "st_joseph", label: "St. Joseph River" },
    ]);
  }
  if (stateCode !== "MI" || season !== "fall") return supportedChoices;
  const futureRiverIds = MICHIGAN_FUTURE_RIVER_IDS_BY_SPECIES[species] ?? [];
  const futureChoices = MICHIGAN_RIVER_PRESENTATION.filter((river) =>
    futureRiverIds.includes(river.id)
  );
  return mergeWithPresentation(supportedChoices, futureChoices);
}

export function resolveRiverRunTarget(
  catalog: RiverRunCatalogResponse,
  selection: {
    stateCode: string | null;
    season: RiverRunSeason | null;
    species: string | null;
    riverId: string | null;
  },
): RiverRunCatalogTarget | null {
  const state = catalog.states.find((item) =>
    item.state === selection.stateCode
  );
  if (!state || !selection.season || !selection.species || !selection.riverId) {
    return null;
  }
  const river = state.rivers.find((item) => item.riverId === selection.riverId);
  if (!river) return null;
  const run = river.runs.find((item) =>
    item.season === selection.season &&
    item.species === selection.species
  );
  return run ? { state, river, run } : null;
}
