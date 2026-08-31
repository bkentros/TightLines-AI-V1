create table if not exists public.river_run_fish_count_source_cache (
  id bigserial primary key,
  river_id text not null,
  source_id text not null,
  checked_at timestamptz not null,
  last_success_at timestamptz,
  report_identity text not null,
  data_version text not null,
  report jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (river_id, source_id)
);

create index if not exists river_run_fish_count_source_cache_lookup_idx
  on public.river_run_fish_count_source_cache
  (river_id, source_id, checked_at desc);

create table if not exists public.river_run_fish_count_reports (
  id bigserial primary key,
  river_id text not null,
  source_id text not null,
  report_identity text not null,
  report_date date,
  observed_through date,
  data_version text not null,
  report jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (river_id, source_id, report_identity)
);

create index if not exists river_run_fish_count_reports_lookup_idx
  on public.river_run_fish_count_reports
  (river_id, source_id, report_date desc, observed_through desc);

drop trigger if exists river_run_fish_count_source_cache_set_updated_at
  on public.river_run_fish_count_source_cache;
create trigger river_run_fish_count_source_cache_set_updated_at
before update on public.river_run_fish_count_source_cache
for each row execute function public.set_river_run_updated_at();

alter table public.river_run_fish_count_source_cache enable row level security;
alter table public.river_run_fish_count_reports enable row level security;

drop policy if exists "river_run_fish_count_source_cache_service_role_all"
  on public.river_run_fish_count_source_cache;
create policy "river_run_fish_count_source_cache_service_role_all"
  on public.river_run_fish_count_source_cache
  for all to service_role using (true) with check (true);

drop policy if exists "river_run_fish_count_reports_service_role_all"
  on public.river_run_fish_count_reports;
create policy "river_run_fish_count_reports_service_role_all"
  on public.river_run_fish_count_reports
  for all to service_role using (true) with check (true);

revoke all on table public.river_run_fish_count_source_cache
  from anon, authenticated;
revoke all on table public.river_run_fish_count_reports
  from anon, authenticated;
grant all on table public.river_run_fish_count_source_cache to service_role;
grant all on table public.river_run_fish_count_reports to service_role;
grant usage, select on sequence
  public.river_run_fish_count_source_cache_id_seq to service_role;
grant usage, select on sequence public.river_run_fish_count_reports_id_seq
  to service_role;

comment on table public.river_run_fish_count_source_cache is
  'Latest source-level River Run fish-count artifact. One provider fetch is parsed for every eligible species and shared across users and runs.';
comment on table public.river_run_fish_count_reports is
  'Immutable history of distinct official fish-count report revisions, keyed by river, source, and deterministic report identity.';
