create table if not exists public.lake_map_temperature_scorecard_samples (
  station_id text not null check (length(station_id) between 1 and 160),
  sensor_key text not null check (length(sensor_key) between 1 and 320),
  station_name text,
  station_class text not null check (station_class in ('offshore_buoy', 'nearshore_buoy', 'harbor', 'connecting_water')),
  raw_station_type text,
  source text not null check (source in ('live_archive', 'backfill', 'synthetic')),
  observation_source text not null,
  waterbody text not null,
  station_lat double precision check (station_lat between 40 and 51),
  station_lon double precision check (station_lon between -94 and -74),
  sensor_depth_m double precision not null check (sensor_depth_m between 0 and 1000),
  model_depth_m double precision not null check (model_depth_m between 0 and 1000),
  depth_method text not null check (depth_method in ('surface_layer', 'interpolated_3d', 'pending_3d')),
  depth_assumed boolean not null,
  parameter_id text,
  observation_time timestamptz not null,
  observation_offset_minutes double precision not null check (observation_offset_minutes between -30 and 30),
  first_collected_at timestamptz,
  model_cycle timestamptz not null,
  model_issued_at timestamptz,
  valid_time timestamptz not null,
  lead_hours double precision not null check (lead_hours between 0 and 120),
  lower_model_hour smallint not null check (lower_model_hour between 0 and 120),
  upper_model_hour smallint not null check (upper_model_hour between 0 and 120),
  time_interpolation_fraction double precision not null check (time_interpolation_fraction between 0 and 1),
  run_id text not null check (length(run_id) between 1 and 160),
  model_version text not null check (length(model_version) between 1 and 160),
  pair_status text not null check (pair_status in ('paired', 'pending_3d', 'uncovered')),
  observed_temperature_f double precision not null check (observed_temperature_f between -20 and 150),
  model_temperature_f double precision check (model_temperature_f is null or model_temperature_f between -20 and 150),
  miss_f double precision generated always as (observed_temperature_f - model_temperature_f) stored,
  miss_c double precision generated always as ((observed_temperature_f - model_temperature_f) * 5.0 / 9.0) stored,
  model_lat double precision check (model_lat is null or model_lat between 40 and 51),
  model_lon double precision check (model_lon is null or model_lon between -94 and -74),
  model_distance_km double precision check (model_distance_km is null or model_distance_km between 0 and 6),
  sample_method text not null check (sample_method in ('frozen_verification_site', 'saved_surface_grid', 'interpolated_3d', 'pending_3d', 'uncovered')),
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
  primary key (station_id, sensor_key, observation_time, model_cycle),
  check (valid_time = observation_time),
  check (abs(extract(epoch from (observation_time - model_cycle)) / 3600.0 - lead_hours) < 0.0001),
  check (upper_model_hour >= lower_model_hour and upper_model_hour - lower_model_hour <= 1),
  check ((lower_model_hour = upper_model_hour and time_interpolation_fraction = 0)
    or (upper_model_hour = lower_model_hour + 1)),
  check ((pair_status = 'paired' and model_temperature_f is not null and depth_method <> 'pending_3d')
    or (pair_status in ('pending_3d', 'uncovered') and model_temperature_f is null)),
  check ((sensor_depth_m <= 1.5 and depth_method = 'surface_layer' and model_depth_m = 0)
    or (sensor_depth_m > 1.5 and depth_method in ('interpolated_3d', 'pending_3d') and model_depth_m = sensor_depth_m))
);

comment on table public.lake_map_temperature_scorecard_samples is
  'Private NOAA-vs-observation research evidence. Retained indefinitely (minimum two years); never read by production app paths.';
comment on column public.lake_map_temperature_scorecard_samples.depth_assumed is
  'True only when provider metadata omitted depth and the documented station-class default was used.';
comment on column public.lake_map_temperature_scorecard_samples.model_version is
  'Lake-specific NOAA model/version boundary; analyses must never pool incompatible model eras.';
comment on column public.lake_map_temperature_scorecard_samples.miss_f is
  'Observed water temperature minus NOAA model temperature in degrees Fahrenheit; null for pending or uncovered rows.';

create index if not exists lake_map_temperature_scorecard_station_week_lead_idx
  on public.lake_map_temperature_scorecard_samples
  (station_id, date_trunc('week', observation_time at time zone 'UTC'), lead_hours);
create index if not exists lake_map_temperature_scorecard_cycle_idx
  on public.lake_map_temperature_scorecard_samples(model_cycle desc, lead_hours);
create index if not exists lake_map_temperature_scorecard_pending_idx
  on public.lake_map_temperature_scorecard_samples(pair_status, observation_time)
  where pair_status <> 'paired';

alter table public.lake_map_temperature_scorecard_samples enable row level security;
drop policy if exists "lake_map_temperature_scorecard_service_role_all"
  on public.lake_map_temperature_scorecard_samples;
create policy "lake_map_temperature_scorecard_service_role_all"
  on public.lake_map_temperature_scorecard_samples
  for all to service_role using (true) with check (true);
revoke all on table public.lake_map_temperature_scorecard_samples from public, anon, authenticated;
grant select, insert, update on table public.lake_map_temperature_scorecard_samples to service_role;

create or replace function public.commit_lake_map_temperature_scorecard_samples(p_records jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare committed_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if jsonb_typeof(p_records) is distinct from 'array' or jsonb_array_length(p_records) > 500 then
    raise exception 'invalid lake-map temperature scorecard batch';
  end if;
  insert into public.lake_map_temperature_scorecard_samples (
    station_id, sensor_key, station_name, station_class, raw_station_type, source, observation_source, waterbody,
    station_lat, station_lon, sensor_depth_m, model_depth_m, depth_method, depth_assumed, parameter_id,
    observation_time, observation_offset_minutes, first_collected_at, model_cycle, model_issued_at, valid_time,
    lead_hours, lower_model_hour, upper_model_hour, time_interpolation_fraction, run_id, model_version, pair_status,
    observed_temperature_f, model_temperature_f, model_lat, model_lon, model_distance_km, sample_method,
    wind_speed_mph, wind_from_degrees, wind_observed_at, wind_offset_minutes, source_quality, quality_flags,
    strict_quality, evidence_key, evidence_sha256, methodology_version, updated_at)
  select
    r->>'station_id', r->>'sensor_key', nullif(r->>'station_name',''), r->>'station_class',
    nullif(r->>'raw_station_type',''), r->>'source', r->>'observation_source', r->>'waterbody',
    (r->>'station_lat')::double precision, (r->>'station_lon')::double precision,
    (r->>'sensor_depth_m')::double precision, (r->>'model_depth_m')::double precision,
    r->>'depth_method', (r->>'depth_assumed')::boolean, nullif(r->>'parameter_id',''),
    (r->>'observation_time')::timestamptz, (r->>'observation_offset_minutes')::double precision,
    (r->>'first_collected_at')::timestamptz, (r->>'model_cycle')::timestamptz,
    (r->>'model_issued_at')::timestamptz, (r->>'valid_time')::timestamptz,
    (r->>'lead_hours')::double precision, (r->>'lower_model_hour')::smallint,
    (r->>'upper_model_hour')::smallint, (r->>'time_interpolation_fraction')::double precision,
    r->>'run_id', r->>'model_version', r->>'pair_status',
    (r->>'observed_temperature_f')::double precision, (r->>'model_temperature_f')::double precision,
    (r->>'model_lat')::double precision, (r->>'model_lon')::double precision,
    (r->>'model_distance_km')::double precision, r->>'sample_method',
    (r->>'wind_speed_mph')::double precision, (r->>'wind_from_degrees')::double precision,
    (r->>'wind_observed_at')::timestamptz, (r->>'wind_offset_minutes')::double precision,
    r->>'source_quality', coalesce(array(select jsonb_array_elements_text(r->'quality_flags')), '{}'),
    (r->>'strict_quality')::boolean, r->>'evidence_key', r->>'evidence_sha256',
    r->>'methodology_version', timezone('utc', now())
  from jsonb_array_elements(p_records) r
  on conflict (station_id, sensor_key, observation_time, model_cycle) do update set
    station_name=excluded.station_name, station_class=excluded.station_class, raw_station_type=excluded.raw_station_type,
    source=excluded.source, observation_source=excluded.observation_source, waterbody=excluded.waterbody,
    station_lat=excluded.station_lat, station_lon=excluded.station_lon, sensor_depth_m=excluded.sensor_depth_m,
    model_depth_m=excluded.model_depth_m, depth_method=excluded.depth_method, depth_assumed=excluded.depth_assumed,
    parameter_id=excluded.parameter_id, observation_offset_minutes=excluded.observation_offset_minutes,
    first_collected_at=coalesce(least(public.lake_map_temperature_scorecard_samples.first_collected_at,
      excluded.first_collected_at), public.lake_map_temperature_scorecard_samples.first_collected_at,
      excluded.first_collected_at), model_issued_at=excluded.model_issued_at, valid_time=excluded.valid_time,
    lead_hours=excluded.lead_hours, lower_model_hour=excluded.lower_model_hour,
    upper_model_hour=excluded.upper_model_hour, time_interpolation_fraction=excluded.time_interpolation_fraction,
    run_id=excluded.run_id, model_version=excluded.model_version, pair_status=excluded.pair_status,
    observed_temperature_f=excluded.observed_temperature_f, model_temperature_f=excluded.model_temperature_f,
    model_lat=excluded.model_lat, model_lon=excluded.model_lon, model_distance_km=excluded.model_distance_km,
    sample_method=excluded.sample_method, wind_speed_mph=excluded.wind_speed_mph,
    wind_from_degrees=excluded.wind_from_degrees, wind_observed_at=excluded.wind_observed_at,
    wind_offset_minutes=excluded.wind_offset_minutes, source_quality=excluded.source_quality,
    quality_flags=excluded.quality_flags, strict_quality=excluded.strict_quality,
    evidence_key=excluded.evidence_key, evidence_sha256=excluded.evidence_sha256,
    methodology_version=excluded.methodology_version, updated_at=timezone('utc', now());
  get diagnostics committed_count = row_count;
  return jsonb_build_object('status','committed','recordCount',committed_count);
end;
$$;
revoke all on function public.commit_lake_map_temperature_scorecard_samples(jsonb) from public, anon, authenticated;
grant execute on function public.commit_lake_map_temperature_scorecard_samples(jsonb) to service_role;

create or replace view public.lake_map_temperature_scorecard_weekly with (security_invoker = true) as
select station_id, min(station_name) as station_name, station_class, model_version,
  case when sensor_depth_m <= 1.5 then 'surface'
    when sensor_depth_m <= 3.048 then '1.5-10ft'
    when sensor_depth_m <= 6.096 then '10-20ft'
    when sensor_depth_m <= 9.144 then '20-30ft'
    when sensor_depth_m <= 12.192 then '30-40ft'
    when sensor_depth_m <= 15.24 then '40-50ft' else 'over-50ft' end as depth_band,
  date_trunc('week', observation_time at time zone 'UTC')::date as week_start,
  round(lead_hours)::smallint as lead_hour,
  count(*) as row_count, count(*) filter (where pair_status='paired') as sample_count,
  count(*) filter (where pair_status='paired' and not (quality_flags && array['spike','stale','out_of_range'])) as quality_sample_count,
  avg(miss_c) filter (where pair_status='paired' and not (quality_flags && array['spike','stale','out_of_range'])) as mean_miss_c,
  percentile_cont(0.5) within group (order by abs(miss_c))
    filter (where pair_status='paired' and not (quality_flags && array['spike','stale','out_of_range'])) as typical_miss_c,
  avg(abs(miss_c)) filter (where pair_status='paired' and not (quality_flags && array['spike','stale','out_of_range'])) as mean_absolute_miss_c
from public.lake_map_temperature_scorecard_samples
group by station_id, station_class, model_version, depth_band,
  date_trunc('week', observation_time at time zone 'UTC')::date, round(lead_hours)::smallint;
comment on view public.lake_map_temperature_scorecard_weekly is
  'Private weekly observed-minus-NOAA summary by station, model version, depth band, and lead; typical miss is median absolute miss.';
revoke all on table public.lake_map_temperature_scorecard_weekly from public, anon, authenticated;
grant select on table public.lake_map_temperature_scorecard_weekly to service_role;
