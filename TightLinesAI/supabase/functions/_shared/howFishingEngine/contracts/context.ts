/**
 * Engine contexts — ENGINE_REBUILD_MASTER_PLAN § Final user-facing contexts
 */

export const ENGINE_CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
] as const;

export type EngineContext = (typeof ENGINE_CONTEXTS)[number];

export function isEngineContext(x: string): x is EngineContext {
  return (ENGINE_CONTEXTS as readonly string[]).includes(x);
}

/** True for both inshore coastal and flats/estuary — shared tide/marine normalizers & timing. */
export function isCoastalFamilyContext(ctx: EngineContext): boolean {
  return ctx === "coastal" || ctx === "coastal_flats_estuary";
}

/** User-visible labels (report contract). */
export const DISPLAY_CONTEXT_LABEL = {
  freshwater_lake_pond: "Freshwater Lake/Pond",
  freshwater_river: "Freshwater River",
  coastal: "Coastal Inshore",
  coastal_flats_estuary: "Flats & Estuary",
} as const satisfies Record<EngineContext, string>;

export type DisplayContextLabel = (typeof DISPLAY_CONTEXT_LABEL)[EngineContext];
