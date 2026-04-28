-- Add engine_canonical_id to species_catalog so user-facing species rows
-- (e.g., rainbow_trout, brown_trout, brook_trout) can roll up to the
-- engine's canonical species (e.g., 'trout') for engine-aligned analytics.
-- Mirrors the engine_canonical_id pattern on lure_catalog and fly_catalog.

alter table public.species_catalog
  add column if not exists engine_canonical_id text;

create index if not exists species_catalog_engine_canonical_id_idx
  on public.species_catalog (engine_canonical_id)
  where engine_canonical_id is not null;
