-- Add species_aliases table — parallel to lure_aliases / fly_aliases /
-- bait_aliases. Resolves slang and regional names ("bucketmouth", "smallie",
-- "specks", "musky") to canonical species_catalog rows for voice parsing
-- and typeahead. species_id is text to match species_catalog.id (text PK).

create table if not exists public.species_aliases (
  id uuid primary key default gen_random_uuid(),
  species_id text not null references public.species_catalog (id) on delete cascade,
  alias_text text not null,
  normalized_alias text generated always as (public.normalize_alias_text(alias_text)) stored,
  weight integer not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  unique (species_id, normalized_alias)
);

create index if not exists species_aliases_normalized_trgm_idx
  on public.species_aliases using gin (normalized_alias gin_trgm_ops);

create index if not exists species_aliases_species_id_idx
  on public.species_aliases (species_id);

alter table public.species_aliases enable row level security;

drop policy if exists "species_aliases_public_read" on public.species_aliases;
create policy "species_aliases_public_read"
  on public.species_aliases for select
  using (true);
