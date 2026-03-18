/**
 * Engine contexts — ENGINE_REBUILD_MASTER_PLAN § Final user-facing contexts
 */

export const ENGINE_CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
] as const;

export type EngineContext = (typeof ENGINE_CONTEXTS)[number];

export function isEngineContext(x: string): x is EngineContext {
  return (ENGINE_CONTEXTS as readonly string[]).includes(x);
}

/** User-visible labels (report contract). */
export const DISPLAY_CONTEXT_LABEL: Record<
  EngineContext,
  "Freshwater Lake/Pond" | "Freshwater River" | "Coastal"
> = {
  freshwater_lake_pond: "Freshwater Lake/Pond",
  freshwater_river: "Freshwater River",
  coastal: "Coastal",
};
