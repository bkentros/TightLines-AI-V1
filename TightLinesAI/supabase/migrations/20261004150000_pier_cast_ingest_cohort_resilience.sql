-- PierCast cohort catch-ups and durable, sanitized ingest outcomes.
--
-- The primary cohort already has a stale-gated catch-up at :15 and the v3
-- aggregate already re-runs at :35. Add the six raw expansion cohorts between
-- them so a single transient cohort failure can be repaired before v3 runs.
--
-- pg_net keeps responses for only six hours. Preserve operational fields for
-- 14 days without retaining request headers, credentials, URLs, or response
-- payloads. Existing invokers are wrapped rather than reimplemented so their
-- Vault access, request bodies, and 150-second timeout remain unchanged.

create table public.pier_cast_ingest_outcomes (
  id bigint generated always as identity primary key,
  request_id bigint unique,
  cohort text not null check (cohort in (
    'primary',
    'wisconsin',
    'lake_huron',
    'pentwater_caseville',
    'five_city',
    'chicago_alpena',
    'st_joseph_harrisville',
    'v3'
  )),
  requested_at timestamptz not null,
  completed_at timestamptz,
  cycle_issued_at timestamptz,
  http_status smallint check (http_status is null or http_status between 100 and 599),
  outcome_code text check (
    outcome_code is null
    or (length(outcome_code) between 1 and 120 and outcome_code ~ '^[A-Za-z0-9_.:-]+$')
  ),
  sample_count integer check (sample_count is null or sample_count >= 0),
  duration_ms bigint check (duration_ms is null or duration_ms >= 0)
);

create index pier_cast_ingest_outcomes_requested_at_idx
  on public.pier_cast_ingest_outcomes (requested_at desc);
create index pier_cast_ingest_outcomes_pending_idx
  on public.pier_cast_ingest_outcomes (request_id)
  where completed_at is null and request_id is not null;

alter table public.pier_cast_ingest_outcomes enable row level security;
revoke all on table public.pier_cast_ingest_outcomes from public, anon, authenticated;
revoke all on sequence public.pier_cast_ingest_outcomes_id_seq from public, anon, authenticated;
grant select on table public.pier_cast_ingest_outcomes to service_role;

comment on table public.pier_cast_ingest_outcomes is
  'Fourteen-day service-only PierCast ingest history. Stores sanitized status and timing fields, never headers, credentials, URLs, or response payloads.';
comment on column public.pier_cast_ingest_outcomes.duration_ms is
  'End-to-end pg_net duration from request enqueue to the HTTP Date response header, or pg_net Total time for transport failures.';

create or replace function public.record_pier_cast_ingest_request(
  p_cohort text,
  p_request_id bigint,
  p_requested_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_request_id is null then
    insert into public.pier_cast_ingest_outcomes (
      cohort, requested_at, completed_at, outcome_code, duration_ms
    ) values (
      p_cohort,
      p_requested_at,
      clock_timestamp(),
      'not_enqueued',
      greatest(0, round(extract(epoch from (clock_timestamp() - p_requested_at)) * 1000)::bigint)
    );
    return;
  end if;

  insert into public.pier_cast_ingest_outcomes (
    request_id, cohort, requested_at
  ) values (
    p_request_id, p_cohort, p_requested_at
  );
end;
$$;

create or replace function public.record_pier_cast_ingest_skip(
  p_cohort text,
  p_cycle_issued_at timestamptz,
  p_requested_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pier_cast_ingest_outcomes (
    cohort,
    requested_at,
    completed_at,
    cycle_issued_at,
    outcome_code,
    duration_ms
  ) values (
    p_cohort,
    p_requested_at,
    clock_timestamp(),
    p_cycle_issued_at,
    'skipped_fresh',
    greatest(0, round(extract(epoch from (clock_timestamp() - p_requested_at)) * 1000)::bigint)
  );
end;
$$;

revoke all on function public.record_pier_cast_ingest_request(text,bigint,timestamptz)
  from public, anon, authenticated, service_role;
revoke all on function public.record_pier_cast_ingest_skip(text,timestamptz,timestamptz)
  from public, anon, authenticated, service_role;

-- Keep the deployed invoker definitions intact (including their Vault reads and
-- timeout) and put a small sanitized logging wrapper at each existing name.
alter function public.invoke_pier_cast_temperature_ingestion()
  rename to pier_cast_raw_invoke_primary_v1;
alter function public.invoke_pier_cast_wisconsin_shadow_ingestion()
  rename to pier_cast_raw_invoke_wisconsin_v1;
alter function public.invoke_pier_cast_lake_huron_shadow_ingestion()
  rename to pier_cast_raw_invoke_lake_huron_v1;
alter function public.invoke_pier_cast_pentwater_caseville_shadow_ingestion()
  rename to pier_cast_raw_invoke_pentwater_caseville_v1;
alter function public.invoke_pier_cast_five_city_shadow_ingestion()
  rename to pier_cast_raw_invoke_five_city_v1;
alter function public.invoke_pier_cast_chicago_alpena_shadow_ingestion()
  rename to pier_cast_raw_invoke_chicago_alpena_v1;
alter function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion()
  rename to pier_cast_raw_invoke_stj_harrisville_v1;
alter function public.invoke_pier_cast_v3_shadow_ingestion()
  rename to pier_cast_raw_invoke_v3_v1;

revoke all on function public.pier_cast_raw_invoke_primary_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_wisconsin_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_lake_huron_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_pentwater_caseville_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_five_city_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_chicago_alpena_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_stj_harrisville_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_raw_invoke_v3_v1()
  from public, anon, authenticated, service_role;

create or replace function public.invoke_pier_cast_temperature_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_primary_v1();
  perform public.record_pier_cast_ingest_request('primary', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_wisconsin_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_wisconsin_v1();
  perform public.record_pier_cast_ingest_request('wisconsin', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_lake_huron_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_lake_huron_v1();
  perform public.record_pier_cast_ingest_request('lake_huron', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_pentwater_caseville_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_pentwater_caseville_v1();
  perform public.record_pier_cast_ingest_request('pentwater_caseville', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_five_city_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_five_city_v1();
  perform public.record_pier_cast_ingest_request('five_city', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_chicago_alpena_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_chicago_alpena_v1();
  perform public.record_pier_cast_ingest_request('chicago_alpena', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_stj_harrisville_v1();
  perform public.record_pier_cast_ingest_request('st_joseph_harrisville', request_id, started_at);
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_v3_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_v3_v1();
  perform public.record_pier_cast_ingest_request('v3', request_id, started_at);
  return request_id;
end;
$$;

revoke all on function public.invoke_pier_cast_temperature_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_wisconsin_shadow_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_lake_huron_shadow_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_pentwater_caseville_shadow_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_five_city_shadow_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_chicago_alpena_shadow_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion()
  from public, anon, authenticated;
revoke all on function public.invoke_pier_cast_v3_shadow_ingestion()
  from public, anon, authenticated;

grant execute on function public.invoke_pier_cast_temperature_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_wisconsin_shadow_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_lake_huron_shadow_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_pentwater_caseville_shadow_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_five_city_shadow_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_chicago_alpena_shadow_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion() to service_role;
grant execute on function public.invoke_pier_cast_v3_shadow_ingestion() to service_role;

-- Catch-ups share the primary cohort's nine-hour stale boundary. At 04:20–30,
-- a successful 00Z cohort is about four hours old; a missed one is about ten.
create or replace function public.catch_up_pier_cast_wisconsin_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-wisconsin-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('wisconsin', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_wisconsin_shadow_ingestion();
end;
$$;

create or replace function public.catch_up_pier_cast_lake_huron_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-lake-huron-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('lake_huron', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_lake_huron_shadow_ingestion();
end;
$$;

create or replace function public.catch_up_pier_cast_pentwater_caseville_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-pentwater-caseville-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('pentwater_caseville', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_pentwater_caseville_shadow_ingestion();
end;
$$;

create or replace function public.catch_up_pier_cast_five_city_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-five-city-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('five_city', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_five_city_shadow_ingestion();
end;
$$;

create or replace function public.catch_up_pier_cast_chicago_alpena_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-chicago-alpena-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('chicago_alpena', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_chicago_alpena_shadow_ingestion();
end;
$$;

create or replace function public.catch_up_pier_cast_stj_harrisville_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-st-joseph-harrisville-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('st_joseph_harrisville', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();
end;
$$;

revoke all on function public.catch_up_pier_cast_wisconsin_if_stale()
  from public, anon, authenticated;
revoke all on function public.catch_up_pier_cast_lake_huron_if_stale()
  from public, anon, authenticated;
revoke all on function public.catch_up_pier_cast_pentwater_caseville_if_stale()
  from public, anon, authenticated;
revoke all on function public.catch_up_pier_cast_five_city_if_stale()
  from public, anon, authenticated;
revoke all on function public.catch_up_pier_cast_chicago_alpena_if_stale()
  from public, anon, authenticated;
revoke all on function public.catch_up_pier_cast_stj_harrisville_if_stale()
  from public, anon, authenticated;

grant execute on function public.catch_up_pier_cast_wisconsin_if_stale() to service_role;
grant execute on function public.catch_up_pier_cast_lake_huron_if_stale() to service_role;
grant execute on function public.catch_up_pier_cast_pentwater_caseville_if_stale() to service_role;
grant execute on function public.catch_up_pier_cast_five_city_if_stale() to service_role;
grant execute on function public.catch_up_pier_cast_chicago_alpena_if_stale() to service_role;
grant execute on function public.catch_up_pier_cast_stj_harrisville_if_stale() to service_role;

comment on function public.catch_up_pier_cast_wisconsin_if_stale() is
  'Retries the Wisconsin raw cohort only when its newest cycle is older than nine hours.';
comment on function public.catch_up_pier_cast_lake_huron_if_stale() is
  'Retries the Lake Huron raw cohort only when its newest cycle is older than nine hours.';
comment on function public.catch_up_pier_cast_pentwater_caseville_if_stale() is
  'Retries the Pentwater-Caseville raw cohort only when its newest cycle is older than nine hours.';
comment on function public.catch_up_pier_cast_five_city_if_stale() is
  'Retries the five-city raw cohort only when its newest cycle is older than nine hours.';
comment on function public.catch_up_pier_cast_chicago_alpena_if_stale() is
  'Retries the Chicago-Alpena raw cohort only when its newest cycle is older than nine hours.';
comment on function public.catch_up_pier_cast_stj_harrisville_if_stale() is
  'Retries the St. Joseph-Harrisville raw cohort only when its newest cycle is older than nine hours.';

-- Bring the pre-existing primary catch-up into the same durable log. Its
-- schedule remains unchanged.
create or replace function public.invoke_pier_cast_temperature_ingestion_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_temperature_samples;
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    perform public.record_pier_cast_ingest_skip('primary', newest, started_at);
    return null;
  end if;
  return public.invoke_pier_cast_temperature_ingestion();
end;
$$;
revoke all on function public.invoke_pier_cast_temperature_ingestion_if_stale()
  from public, anon, authenticated;
grant execute on function public.invoke_pier_cast_temperature_ingestion_if_stale()
  to service_role;

create or replace function public.pier_cast_try_jsonb(p_value text)
returns jsonb language plpgsql immutable parallel safe
set search_path = public
as $$
begin
  return p_value::jsonb;
exception when others then
  return null;
end;
$$;

create or replace function public.pier_cast_try_timestamptz(p_value text)
returns timestamptz language plpgsql stable parallel safe
set search_path = public
as $$
begin
  return p_value::timestamptz;
exception when others then
  return null;
end;
$$;

create or replace function public.pier_cast_try_integer(p_value text)
returns integer language plpgsql immutable parallel safe
set search_path = public
as $$
begin
  return p_value::integer;
exception when others then
  return null;
end;
$$;

revoke all on function public.pier_cast_try_jsonb(text)
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_try_timestamptz(text)
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_try_integer(text)
  from public, anon, authenticated, service_role;

create or replace function public.collect_pier_cast_ingest_outcomes()
returns integer
language plpgsql
security definer
set search_path = public, net
as $$
declare
  collected integer := 0;
  missing integer := 0;
begin
  with raw as (
    select
      outcome.id,
      outcome.requested_at,
      response.status_code,
      response.headers,
      response.content,
      response.timed_out,
      response.error_msg,
      public.pier_cast_try_jsonb(response.content) as body,
      public.pier_cast_try_timestamptz(response.headers->>'date') as response_at,
      case
        when response.error_msg ~ 'Total time: [0-9]+[.]?[0-9]* ms'
          then substring(response.error_msg from 'Total time: ([0-9]+[.]?[0-9]*) ms')::numeric
        else null
      end as transport_duration_ms
    from public.pier_cast_ingest_outcomes outcome
    join net._http_response response on response.id = outcome.request_id
    where outcome.completed_at is null
  ), normalized as (
    select
      id,
      status_code,
      body,
      case
        when response_at is not null then response_at
        when transport_duration_ms is not null
          then requested_at + transport_duration_ms * interval '1 millisecond'
        else clock_timestamp()
      end as finished_at,
      case
        when transport_duration_ms is not null then round(transport_duration_ms)::bigint
        when response_at is not null then greatest(
          0,
          round(extract(epoch from (response_at - requested_at)) * 1000)::bigint
        )
        else greatest(
          0,
          round(extract(epoch from (clock_timestamp() - requested_at)) * 1000)::bigint
        )
      end as elapsed_ms,
      case
        when timed_out or error_msg ilike '%timeout%' then 'transport_timeout'
        when error_msg is not null then 'transport_error'
        when body->>'status' is not null then body->>'status'
        when body->>'error' is not null then body->>'error'
        when status_code is not null then 'http_' || status_code::text
        else 'empty_response'
      end as raw_outcome_code
    from raw
  )
  update public.pier_cast_ingest_outcomes outcome
     set completed_at = normalized.finished_at,
         cycle_issued_at = public.pier_cast_try_timestamptz(normalized.body->>'issuedAt'),
         http_status = normalized.status_code,
         outcome_code = left(
           regexp_replace(normalized.raw_outcome_code, '[^A-Za-z0-9_.:-]+', '_', 'g'),
           120
         ),
         sample_count = public.pier_cast_try_integer(normalized.body->>'sampleCount'),
         duration_ms = normalized.elapsed_ms
    from normalized
   where outcome.id = normalized.id;
  get diagnostics collected = row_count;

  -- All invokers time out by 150 seconds. Ten minutes safely distinguishes a
  -- missing pg_net response without racing a legitimate request.
  update public.pier_cast_ingest_outcomes
     set completed_at = clock_timestamp(),
         outcome_code = 'response_missing',
         duration_ms = greatest(
           0,
           round(extract(epoch from (clock_timestamp() - requested_at)) * 1000)::bigint
         )
   where completed_at is null
     and request_id is not null
     and requested_at < clock_timestamp() - interval '10 minutes';
  get diagnostics missing = row_count;

  return collected + missing;
end;
$$;

create or replace function public.cleanup_pier_cast_ingest_outcomes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare deleted integer;
begin
  delete from public.pier_cast_ingest_outcomes
   where requested_at < clock_timestamp() - interval '14 days';
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

revoke all on function public.collect_pier_cast_ingest_outcomes()
  from public, anon, authenticated, service_role;
revoke all on function public.cleanup_pier_cast_ingest_outcomes()
  from public, anon, authenticated, service_role;

do $$
declare
  scheduled_job record;
  existing_job_id bigint;
begin
  for scheduled_job in
    select * from (values
      ('pier-cast-wisconsin-shadow-ingestion-catchup',
        '20 4,10,16,22 * * *',
        'select public.catch_up_pier_cast_wisconsin_if_stale();'),
      ('pier-cast-lake-huron-shadow-ingestion-catchup',
        '22 4,10,16,22 * * *',
        'select public.catch_up_pier_cast_lake_huron_if_stale();'),
      ('pier-cast-pentwater-caseville-shadow-ingestion-catchup',
        '24 4,10,16,22 * * *',
        'select public.catch_up_pier_cast_pentwater_caseville_if_stale();'),
      ('pier-cast-five-city-shadow-ingestion-catchup',
        '26 4,10,16,22 * * *',
        'select public.catch_up_pier_cast_five_city_if_stale();'),
      ('pier-cast-chicago-alpena-shadow-ingestion-catchup',
        '28 4,10,16,22 * * *',
        'select public.catch_up_pier_cast_chicago_alpena_if_stale();'),
      ('pier-cast-st-joseph-harrisville-shadow-ingestion-catchup',
        '30 4,10,16,22 * * *',
        'select public.catch_up_pier_cast_stj_harrisville_if_stale();'),
      ('pier-cast-ingest-outcome-collector',
        '* * * * *',
        'select public.collect_pier_cast_ingest_outcomes();'),
      ('pier-cast-ingest-outcome-cleanup',
        '12 5 * * *',
        'select public.cleanup_pier_cast_ingest_outcomes();')
    ) as jobs(job_name, cron_expression, command_sql)
  loop
    select jobid into existing_job_id
      from cron.job
     where jobname = scheduled_job.job_name
     limit 1;
    if existing_job_id is not null then
      perform cron.unschedule(existing_job_id);
    end if;
    perform cron.schedule(
      scheduled_job.job_name,
      scheduled_job.cron_expression,
      scheduled_job.command_sql
    );
  end loop;
end;
$$;
