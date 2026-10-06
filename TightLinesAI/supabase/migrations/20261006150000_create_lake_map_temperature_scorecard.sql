create table if not exists public.lake_map_temperature_scorecard_samples (
  station_id text not null check (length(station_id) between 1 and 160),
  sensor_key text not null check (length(sensor_key) between 1 and 320),
  station_name text,
  station_class text not null check (station_class in ('offshore_buoy', 'nearshore_buoy', 'harbor', 'coops')),
  raw_station_type text,
  source text not null,
  waterbody text not null,
  station_lat double precision check (station_lat between 40 and 51),
  station_lon double precision check (station_lon between -94 and -74),
  sensor_depth_m double precision check (sensor_depth_m is null or sensor_depth_m between 0 and 1000),
  parameter_id text,
  observation_time timestamptz not null,
  observation_offset_minutes double precision not null check (observation_offset_minutes between -30 and 30),
  first_collected_at timestamptz,
  model_cycle timestamptz not null,
  model_issued_at timestamptz,
  valid_time timestamptz not null,
  lead_hours smallint not null check (lead_hours between 0 and 120),
  run_id text not null check (length(run_id) between 1 and 120),
  observed_temperature_f double precision not null check (observed_temperature_f between -20 and 150),
  model_temperature_f double precision not null check (model_temperature_f between -20 and 150),
  miss_f double precision generated always as (observed_temperature_f - model_temperature_f) stored,
  miss_c double precision generated always as ((observed_temperature_f - model_temperature_f) * 5.0 / 9.0) stored,
  model_lat double precision check (model_lat between 40 and 51),
  model_lon double precision check (model_lon between -94 and -74),
  model_distance_km double precision check (model_distance_km is null or model_distance_km between 0 and 500),
  sample_method text not null check (sample_method in ('frozen_verification_site', 'saved_surface_grid')),
  wind_speed_mph double precision check (wind_speed_mph is null or wind_speed_mph between 0 and 250),
  wind_from_degrees double precision check (wind_from_degrees is null or wind_from_degrees between 0 and 360),
  wind_observed_at timestamptz,
  wind_offset_minutes double precision check (wind_offset_minutes is null or wind_offset_minutes between 0 and 90),
  source_quality text not null,
  quality_flags text[] not null default '{}',
  strict_quality boolean not null,
  evidence_key text not null check (length(evidence_key) between 1 and 500),
  evidence_sha256 text not null check (evidence_sha256 ~ '^[0-9a-f]{64}$'),
  methodology_version text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (station_id, sensor_key, observation_time, model_cycle, lead_hours),
  check (valid_time = model_cycle + make_interval(hours => lead_hours))
);

comment on table public.lake_map_temperature_scorecard_samples is
  'Private NOAA-vs-observation research evidence. Retained indefinitely (minimum two years); never read by production app paths.';
comment on column public.lake_map_temperature_scorecard_samples.miss_f is
  'Observed water temperature minus NOAA model temperature in degrees Fahrenheit.';
comment on column public.lake_map_temperature_scorecard_samples.miss_c is
  'Observed water temperature minus NOAA model temperature in degrees Celsius.';

create index if not exists lake_map_temperature_scorecard_station_week_lead_idx
  on public.lake_map_temperature_scorecard_samples
  (station_id, date_trunc('week', observation_time at time zone 'UTC'), lead_hours);
create index if not exists lake_map_temperature_scorecard_cycle_idx
  on public.lake_map_temperature_scorecard_samples(model_cycle desc, lead_hours);
create index if not exists lake_map_temperature_scorecard_observation_idx
  on public.lake_map_temperature_scorecard_samples(observation_time desc);

alter table public.lake_map_temperature_scorecard_samples enable row level security;

drop policy if exists "lake_map_temperature_scorecard_service_role_all"
  on public.lake_map_temperature_scorecard_samples;
create policy "lake_map_temperature_scorecard_service_role_all"
  on public.lake_map_temperature_scorecard_samples
  for all to service_role using (true) with check (true);

revoke all on table public.lake_map_temperature_scorecard_samples from public, anon, authenticated;
grant select, insert, update on table public.lake_map_temperature_scorecard_samples to service_role;

create or replace function public.commit_lake_map_temperature_scorecard_samples(p_records jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  committed_count integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if jsonb_typeof(p_records) is distinct from 'array' or jsonb_array_length(p_records) > 500 then
    raise exception 'invalid lake-map temperature scorecard batch';
  end if;

  insert into public.lake_map_temperature_scorecard_samples (
    station_id, sensor_key, station_name, station_class, raw_station_type, source, waterbody,
    station_lat, station_lon, sensor_depth_m, parameter_id, observation_time, observation_offset_minutes, first_collected_at,
    model_cycle, model_issued_at, valid_time, lead_hours, run_id,
    observed_temperature_f, model_temperature_f, model_lat, model_lon, model_distance_km,
    sample_method, wind_speed_mph, wind_from_degrees, wind_observed_at, wind_offset_minutes,
    source_quality, quality_flags, strict_quality, evidence_key, evidence_sha256,
    methodology_version, updated_at
  )
  select
    record->>'station_id', record->>'sensor_key', nullif(record->>'station_name', ''),
    record->>'station_class', nullif(record->>'raw_station_type', ''), record->>'source',
    record->>'waterbody', (record->>'station_lat')::double precision,
    (record->>'station_lon')::double precision, (record->>'sensor_depth_m')::double precision,
    nullif(record->>'parameter_id', ''), (record->>'observation_time')::timestamptz,
    (record->>'observation_offset_minutes')::double precision,
    (record->>'first_collected_at')::timestamptz, (record->>'model_cycle')::timestamptz,
    (record->>'model_issued_at')::timestamptz, (record->>'valid_time')::timestamptz,
    (record->>'lead_hours')::smallint, record->>'run_id',
    (record->>'observed_temperature_f')::double precision,
    (record->>'model_temperature_f')::double precision,
    (record->>'model_lat')::double precision, (record->>'model_lon')::double precision,
    (record->>'model_distance_km')::double precision, record->>'sample_method',
    (record->>'wind_speed_mph')::double precision, (record->>'wind_from_degrees')::double precision,
    (record->>'wind_observed_at')::timestamptz, (record->>'wind_offset_minutes')::double precision,
    record->>'source_quality',
    coalesce(array(select jsonb_array_elements_text(record->'quality_flags')), '{}'),
    (record->>'strict_quality')::boolean, record->>'evidence_key', record->>'evidence_sha256',
    record->>'methodology_version', timezone('utc', now())
  from jsonb_array_elements(p_records) record
  on conflict (station_id, sensor_key, observation_time, model_cycle, lead_hours) do update set
    station_name = excluded.station_name,
    station_class = excluded.station_class,
    raw_station_type = excluded.raw_station_type,
    source = excluded.source,
    waterbody = excluded.waterbody,
    station_lat = excluded.station_lat,
    station_lon = excluded.station_lon,
    sensor_depth_m = excluded.sensor_depth_m,
    parameter_id = excluded.parameter_id,
    observation_offset_minutes = excluded.observation_offset_minutes,
    model_issued_at = excluded.model_issued_at,
    valid_time = excluded.valid_time,
    run_id = excluded.run_id,
    observed_temperature_f = excluded.observed_temperature_f,
    model_temperature_f = excluded.model_temperature_f,
    model_lat = excluded.model_lat,
    model_lon = excluded.model_lon,
    model_distance_km = excluded.model_distance_km,
    sample_method = excluded.sample_method,
    wind_speed_mph = excluded.wind_speed_mph,
    wind_from_degrees = excluded.wind_from_degrees,
    wind_observed_at = excluded.wind_observed_at,
    wind_offset_minutes = excluded.wind_offset_minutes,
    source_quality = excluded.source_quality,
    quality_flags = excluded.quality_flags,
    strict_quality = excluded.strict_quality,
    evidence_key = excluded.evidence_key,
    evidence_sha256 = excluded.evidence_sha256,
    methodology_version = excluded.methodology_version,
    updated_at = timezone('utc', now());

  get diagnostics committed_count = row_count;
  return jsonb_build_object('status', 'committed', 'recordCount', committed_count);
end;
$$;

revoke all on function public.commit_lake_map_temperature_scorecard_samples(jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_lake_map_temperature_scorecard_samples(jsonb)
  to service_role;

create or replace view public.lake_map_temperature_scorecard_weekly
with (security_invoker = true)
as
select
  station_id,
  min(station_name) as station_name,
  station_class,
  date_trunc('week', observation_time at time zone 'UTC')::date as week_start,
  lead_hours,
  count(*) as sample_count,
  count(*) filter (where not (quality_flags && array['spike', 'stale', 'out_of_range'])) as quality_sample_count,
  avg(miss_c) filter (where not (quality_flags && array['spike', 'stale', 'out_of_range'])) as mean_miss_c,
  percentile_cont(0.5) within group (order by abs(miss_c))
    filter (where not (quality_flags && array['spike', 'stale', 'out_of_range'])) as typical_miss_c,
  avg(abs(miss_c)) filter (where not (quality_flags && array['spike', 'stale', 'out_of_range'])) as mean_absolute_miss_c
from public.lake_map_temperature_scorecard_samples
group by station_id, station_class, date_trunc('week', observation_time at time zone 'UTC')::date, lead_hours;

comment on view public.lake_map_temperature_scorecard_weekly is
  'Private weekly NOAA miss summary; typical_miss_c is median absolute observed-minus-model miss.';

revoke all on table public.lake_map_temperature_scorecard_weekly from public, anon, authenticated;
grant select on table public.lake_map_temperature_scorecard_weekly to service_role;
