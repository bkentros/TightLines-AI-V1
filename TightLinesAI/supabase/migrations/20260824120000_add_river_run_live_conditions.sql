create table if not exists public.river_run_live_conditions (
  id bigserial primary key,
  river_id text not null,
  local_date date not null,
  refresh_slot text not null,
  data_version text not null,
  refreshed_at timestamptz not null,
  conditions jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (river_id, local_date, refresh_slot, data_version)
);

create index if not exists river_run_live_conditions_lookup_idx
  on public.river_run_live_conditions
  (river_id, local_date, refresh_slot, data_version);

create table if not exists public.river_run_metric_seasonal_contexts (
  id bigserial primary key,
  river_id text not null,
  source_id text not null,
  site_id text not null,
  metric text not null check (
    metric in ('flow_cfs', 'gage_height_ft', 'water_temp_f')
  ),
  day_of_year integer not null check (day_of_year between 1 and 366),
  baseline_version text not null,
  context jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (river_id, source_id, metric, day_of_year, baseline_version)
);

create index if not exists river_run_metric_seasonal_contexts_lookup_idx
  on public.river_run_metric_seasonal_contexts
  (river_id, source_id, metric, day_of_year, baseline_version);

drop trigger if exists river_run_live_conditions_set_updated_at
  on public.river_run_live_conditions;

create trigger river_run_live_conditions_set_updated_at
before update on public.river_run_live_conditions
for each row execute function public.set_river_run_updated_at();

drop trigger if exists river_run_metric_seasonal_contexts_set_updated_at
  on public.river_run_metric_seasonal_contexts;

create trigger river_run_metric_seasonal_contexts_set_updated_at
before update on public.river_run_metric_seasonal_contexts
for each row execute function public.set_river_run_updated_at();

alter table public.river_run_live_conditions enable row level security;
alter table public.river_run_metric_seasonal_contexts enable row level security;

drop policy if exists "river_run_live_conditions_service_role_all"
  on public.river_run_live_conditions;
create policy "river_run_live_conditions_service_role_all"
  on public.river_run_live_conditions
  for all to service_role using (true) with check (true);

drop policy if exists "river_run_metric_seasonal_contexts_service_role_all"
  on public.river_run_metric_seasonal_contexts;
create policy "river_run_metric_seasonal_contexts_service_role_all"
  on public.river_run_metric_seasonal_contexts
  for all to service_role using (true) with check (true);

revoke all on table public.river_run_live_conditions from anon, authenticated;
revoke all on table public.river_run_metric_seasonal_contexts
  from anon, authenticated;

grant all on table public.river_run_live_conditions to service_role;
grant all on table public.river_run_metric_seasonal_contexts to service_role;
grant usage, select on sequence public.river_run_live_conditions_id_seq
  to service_role;
grant usage, select on sequence public.river_run_metric_seasonal_contexts_id_seq
  to service_role;
