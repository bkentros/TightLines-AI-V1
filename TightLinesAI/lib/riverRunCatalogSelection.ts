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
};

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
  return catalog.states
    .filter((state) => state.rivers.some((river) => river.runs.length > 0))
    .map((state) => ({
      id: state.state,
      label: state.displayName ?? state.state,
      subtitle: `${state.rivers.length} supported ${
        state.rivers.length === 1 ? "river" : "rivers"
      }`,
    }));
}

export function riverRunSeasonChoices(
  catalog: RiverRunCatalogResponse,
  stateCode: string | null,
): RiverRunChoice[] {
  const state = catalog.states.find((item) => item.state === stateCode);
  if (!state) return [];
  return uniqueById(
    state.rivers.flatMap((river) =>
      river.runs.map((run) => ({
        id: run.season,
        label: formatRiverRunSeason(run.season),
        subtitle: "Seasonal migration",
      }))
    ),
  );
}

export function riverRunSpeciesChoices(
  catalog: RiverRunCatalogResponse,
  stateCode: string | null,
  season: RiverRunSeason | null,
): RiverRunChoice[] {
  const state = catalog.states.find((item) => item.state === stateCode);
  if (!state || !season) return [];
  return uniqueById(
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
}

export function riverRunRiverChoices(
  catalog: RiverRunCatalogResponse,
  stateCode: string | null,
  season: RiverRunSeason | null,
  species: string | null,
): RiverRunChoice[] {
  const state = catalog.states.find((item) => item.state === stateCode);
  if (!state || !season || !species) return [];
  return state.rivers
    .filter((river) =>
      river.runs.some((run) =>
        run.season === season && run.species === species
      )
    )
    .map((river) => ({
      id: river.riverId,
      label: river.displayName,
      subtitle: "Audited river run",
    }));
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
  const river = state.rivers.find((item) =>
    item.riverId === selection.riverId
  );
  if (!river) return null;
  const run = river.runs.find((item) =>
    item.season === selection.season &&
    item.species === selection.species
  );
  return run ? { state, river, run } : null;
}
