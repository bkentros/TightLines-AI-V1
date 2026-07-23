create table if not exists public.river_run_gauge_baselines (
  id bigserial primary key,
  river_id text not null,
  metric text not null check (metric in ('flow_cfs', 'gage_height_ft')),
  day_of_year integer not null check (day_of_year between 1 and 366),
  baseline_version text not null,
  percentiles jsonb not null default '{}'::jsonb,
  band_data jsonb not null default '{}'::jsonb,
  sample_count integer not null default 0 check (sample_count >= 0),
  distinct_years integer not null default 0 check (distinct_years >= 0),
  window_days integer not null default 14 check (window_days >= 0),
  source_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (river_id, metric, day_of_year, baseline_version)
);

create index if not exists river_run_gauge_baselines_lookup_idx
  on public.river_run_gauge_baselines (river_id, metric, baseline_version, day_of_year);

create table if not exists public.river_run_daily_progression_snapshots (
  id bigserial primary key,
  river_id text not null,
  run_id text not null,
  local_date date not null,
  timezone text not null,
  progression_snapshot_at timestamptz not null,
  run_stage jsonb not null,
  schedule jsonb not null,
  fish_in_river jsonb not null,
  favorability_summaries jsonb not null default '[]'::jsonb,
  source_dates jsonb not null default '[]'::jsonb,
  source_refresh_slots jsonb not null default '{}'::jsonb,
  reason_codes jsonb not null default '[]'::jsonb,
  engine_version text not null,
  config_version text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (river_id, run_id, local_date, engine_version, config_version)
);

create index if not exists river_run_daily_progression_snapshots_lookup_idx
  on public.river_run_daily_progression_snapshots (river_id, run_id, local_date);

create table if not exists public.river_run_condition_refreshes (
  id bigserial primary key,
  river_id text not null,
  run_id text not null,
  local_date date not null,
  refresh_slot text not null check (refresh_slot in ('00:00', '08:00', '16:00')),
  condition_refresh_at timestamptz not null,
  push jsonb not null,
  fishability jsonb not null,
  source_metrics jsonb not null default '{}'::jsonb,
  freshness jsonb not null default '{}'::jsonb,
  data_quality jsonb not null,
  interpretation_note jsonb,
  reason_codes jsonb not null default '[]'::jsonb,
  engine_version text not null,
  config_version text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (river_id, run_id, local_date, refresh_slot, engine_version, config_version)
);

create index if not exists river_run_condition_refreshes_lookup_idx
  on public.river_run_condition_refreshes (river_id, run_id, local_date, refresh_slot);

create index if not exists river_run_condition_refreshes_refresh_at_idx
  on public.river_run_condition_refreshes (river_id, run_id, condition_refresh_at desc);

create or replace function public.set_river_run_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists river_run_daily_progression_snapshots_set_updated_at
  on public.river_run_daily_progression_snapshots;

create trigger river_run_daily_progression_snapshots_set_updated_at
before update on public.river_run_daily_progression_snapshots
for each row
execute function public.set_river_run_updated_at();

drop trigger if exists river_run_condition_refreshes_set_updated_at
  on public.river_run_condition_refreshes;

create trigger river_run_condition_refreshes_set_updated_at
before update on public.river_run_condition_refreshes
for each row
execute function public.set_river_run_updated_at();

alter table public.river_run_gauge_baselines enable row level security;
alter table public.river_run_daily_progression_snapshots enable row level security;
alter table public.river_run_condition_refreshes enable row level security;

drop policy if exists "river_run_gauge_baselines_service_role_all"
  on public.river_run_gauge_baselines;
drop policy if exists "river_run_daily_progression_snapshots_service_role_all"
  on public.river_run_daily_progression_snapshots;
drop policy if exists "river_run_condition_refreshes_service_role_all"
  on public.river_run_condition_refreshes;

create policy "river_run_gauge_baselines_service_role_all"
  on public.river_run_gauge_baselines
  for all
  to service_role
  using (true)
  with check (true);

create policy "river_run_daily_progression_snapshots_service_role_all"
  on public.river_run_daily_progression_snapshots
  for all
  to service_role
  using (true)
  with check (true);

create policy "river_run_condition_refreshes_service_role_all"
  on public.river_run_condition_refreshes
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.river_run_gauge_baselines from anon, authenticated;
revoke all on table public.river_run_daily_progression_snapshots from anon, authenticated;
revoke all on table public.river_run_condition_refreshes from anon, authenticated;
