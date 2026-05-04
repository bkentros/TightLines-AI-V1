create table if not exists public.water_reader_engine_read_cache (
  lake_id uuid not null,
  season_context_key text not null,
  map_width integer not null,
  engine_version text not null,
  read_response jsonb not null,
  generated_at timestamptz not null default now(),
  source_updated_at timestamptz,
  timings jsonb,
  qa_flags text[] not null default '{}',
  primary key (lake_id, season_context_key, map_width, engine_version)
);

create index if not exists water_reader_engine_read_cache_lookup_idx
  on public.water_reader_engine_read_cache (lake_id, season_context_key, map_width, engine_version);

create index if not exists water_reader_engine_read_cache_generated_at_idx
  on public.water_reader_engine_read_cache (generated_at desc);

alter table public.water_reader_engine_read_cache enable row level security;

drop policy if exists "water_reader_engine_read_cache_service_role_all"
  on public.water_reader_engine_read_cache;

create policy "water_reader_engine_read_cache_service_role_all"
  on public.water_reader_engine_read_cache
  for all
  to service_role
  using (true)
  with check (true);
