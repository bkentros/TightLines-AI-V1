create table if not exists public.river_run_timing_observations (
  id bigserial primary key,
  river_id text not null,
  run_id text not null,
  local_date date not null,
  refresh_slot text not null,
  observation_at timestamptz not null,
  gauge_metric text not null check (gauge_metric in ('flow_cfs', 'gage_height_ft')),
  gauge_site_id text not null,
  gauge_value double precision,
  gauge_freshness text not null,
  temperature_source_id text not null,
  water_temp_f double precision,
  temperature_freshness text not null,
  reason_codes jsonb not null default '[]'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (
    river_id,
    run_id,
    local_date,
    refresh_slot,
    gauge_site_id,
    temperature_source_id
  )
);

create index if not exists river_run_timing_observations_lookup_idx
  on public.river_run_timing_observations (
    river_id,
    run_id,
    local_date,
    gauge_site_id,
    temperature_source_id
  );

drop trigger if exists river_run_timing_observations_set_updated_at
  on public.river_run_timing_observations;

create trigger river_run_timing_observations_set_updated_at
before update on public.river_run_timing_observations
for each row
execute function public.set_river_run_updated_at();

alter table public.river_run_timing_observations enable row level security;

drop policy if exists "river_run_timing_observations_service_role_all"
  on public.river_run_timing_observations;

create policy "river_run_timing_observations_service_role_all"
  on public.river_run_timing_observations
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.river_run_timing_observations
  from anon, authenticated;

grant select, insert, update, delete
  on table public.river_run_timing_observations
  to service_role;

grant usage, select
  on sequence public.river_run_timing_observations_id_seq
  to service_role;

insert into public.river_run_timing_observations (
  river_id,
  run_id,
  local_date,
  refresh_slot,
  observation_at,
  gauge_metric,
  gauge_site_id,
  gauge_value,
  gauge_freshness,
  temperature_source_id,
  water_temp_f,
  temperature_freshness,
  reason_codes,
  provenance
)
select distinct on (
  river_id,
  run_id,
  local_date,
  refresh_slot,
  source_metrics #>> '{gauge,siteId}',
  source_metrics #>> '{conditionsWaterTemperature,sourceId}'
)
  river_id,
  run_id,
  local_date,
  refresh_slot,
  condition_refresh_at,
  source_metrics #>> '{gauge,primaryMetric}',
  source_metrics #>> '{gauge,siteId}',
  (source_metrics #>> '{gauge,value}')::double precision,
  coalesce(freshness ->> 'gauge', 'missing'),
  source_metrics #>> '{conditionsWaterTemperature,sourceId}',
  (source_metrics #>> '{conditionsWaterTemperature,waterTempF}')::double precision,
  coalesce(freshness ->> 'conditionsWaterTemperature', 'missing'),
  reason_codes,
  jsonb_build_object(
    'kind', 'condition_refresh',
    'engineVersion', engine_version,
    'configVersion', config_version,
    'gauge', source_metrics -> 'gauge',
    'temperature', source_metrics -> 'conditionsWaterTemperature'
  )
from public.river_run_condition_refreshes
where source_metrics #>> '{gauge,primaryMetric}' in ('flow_cfs', 'gage_height_ft')
  and nullif(source_metrics #>> '{gauge,siteId}', '') is not null
  and jsonb_typeof(source_metrics #> '{gauge,value}') = 'number'
  and nullif(
    source_metrics #>> '{conditionsWaterTemperature,sourceId}',
    ''
  ) is not null
  and jsonb_typeof(
    source_metrics #> '{conditionsWaterTemperature,waterTempF}'
  ) = 'number'
order by
  river_id,
  run_id,
  local_date,
  refresh_slot,
  source_metrics #>> '{gauge,siteId}',
  source_metrics #>> '{conditionsWaterTemperature,sourceId}',
  condition_refresh_at desc
on conflict (
  river_id,
  run_id,
  local_date,
  refresh_slot,
  gauge_site_id,
  temperature_source_id
)
do update set
  observation_at = excluded.observation_at,
  gauge_metric = excluded.gauge_metric,
  gauge_value = excluded.gauge_value,
  gauge_freshness = excluded.gauge_freshness,
  water_temp_f = excluded.water_temp_f,
  temperature_freshness = excluded.temperature_freshness,
  reason_codes = excluded.reason_codes,
  provenance = excluded.provenance;
