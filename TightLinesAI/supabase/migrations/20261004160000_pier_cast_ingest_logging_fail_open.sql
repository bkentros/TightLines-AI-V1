-- Make PierCast outcome logging strictly best-effort. The HTTP enqueue remains
-- the source operation: logging errors are isolated in their own subtransaction
-- and can never change the request id returned by an invoker.

create or replace function public.record_pier_cast_ingest_request(
  p_cohort text,
  p_request_id bigint,
  p_requested_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
set lock_timeout = '100ms'
as $$
begin
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
  exception when others then
    -- Do not expose exception details: they can contain database internals.
    raise warning 'PierCast ingest outcome request logging failed open';
  end;
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
set lock_timeout = '100ms'
as $$
begin
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
  exception when others then
    raise warning 'PierCast ingest outcome skip logging failed open';
  end;
end;
$$;

-- Keep a second isolation boundary at every invoker. The raw invoke always runs
-- first, and its exact request id is returned even if the logging function fails.
create or replace function public.invoke_pier_cast_temperature_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_primary_v1();
  begin
    perform public.record_pier_cast_ingest_request('primary', request_id, started_at);
  exception when others then
    raise warning 'PierCast primary outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_wisconsin_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_wisconsin_v1();
  begin
    perform public.record_pier_cast_ingest_request('wisconsin', request_id, started_at);
  exception when others then
    raise warning 'PierCast Wisconsin outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_lake_huron_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_lake_huron_v1();
  begin
    perform public.record_pier_cast_ingest_request('lake_huron', request_id, started_at);
  exception when others then
    raise warning 'PierCast Lake Huron outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_pentwater_caseville_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_pentwater_caseville_v1();
  begin
    perform public.record_pier_cast_ingest_request('pentwater_caseville', request_id, started_at);
  exception when others then
    raise warning 'PierCast Pentwater-Caseville outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_five_city_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_five_city_v1();
  begin
    perform public.record_pier_cast_ingest_request('five_city', request_id, started_at);
  exception when others then
    raise warning 'PierCast five-city outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_chicago_alpena_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_chicago_alpena_v1();
  begin
    perform public.record_pier_cast_ingest_request('chicago_alpena', request_id, started_at);
  exception when others then
    raise warning 'PierCast Chicago-Alpena outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_stj_harrisville_v1();
  begin
    perform public.record_pier_cast_ingest_request('st_joseph_harrisville', request_id, started_at);
  exception when others then
    raise warning 'PierCast St. Joseph-Harrisville outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.invoke_pier_cast_v3_shadow_ingestion()
returns bigint language plpgsql security definer set search_path = public
as $$
declare started_at timestamptz := clock_timestamp(); request_id bigint;
begin
  request_id := public.pier_cast_raw_invoke_v3_v1();
  begin
    perform public.record_pier_cast_ingest_request('v3', request_id, started_at);
  exception when others then
    raise warning 'PierCast V3 outcome logging failed open';
  end;
  return request_id;
end;
$$;

-- Skip logging is also best-effort. A fresh cohort still returns NULL and never
-- invokes its raw ingestion path if the outcome insert fails.
create or replace function public.catch_up_pier_cast_wisconsin_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_expansion_temperature_samples
   where scope_version = 'piercast-wisconsin-shadow-v1';
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    begin
      perform public.record_pier_cast_ingest_skip('wisconsin', newest, started_at);
    exception when others then
      raise warning 'PierCast Wisconsin skip logging failed open';
    end;
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
    begin
      perform public.record_pier_cast_ingest_skip('lake_huron', newest, started_at);
    exception when others then
      raise warning 'PierCast Lake Huron skip logging failed open';
    end;
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
    begin
      perform public.record_pier_cast_ingest_skip('pentwater_caseville', newest, started_at);
    exception when others then
      raise warning 'PierCast Pentwater-Caseville skip logging failed open';
    end;
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
    begin
      perform public.record_pier_cast_ingest_skip('five_city', newest, started_at);
    exception when others then
      raise warning 'PierCast five-city skip logging failed open';
    end;
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
    begin
      perform public.record_pier_cast_ingest_skip('chicago_alpena', newest, started_at);
    exception when others then
      raise warning 'PierCast Chicago-Alpena skip logging failed open';
    end;
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
    begin
      perform public.record_pier_cast_ingest_skip('st_joseph_harrisville', newest, started_at);
    exception when others then
      raise warning 'PierCast St. Joseph-Harrisville skip logging failed open';
    end;
    return null;
  end if;
  return public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();
end;
$$;

create or replace function public.invoke_pier_cast_temperature_ingestion_if_stale()
returns bigint language plpgsql security definer set search_path = public
as $$
declare newest timestamptz; started_at timestamptz := clock_timestamp();
begin
  select max(issued_at) into newest from public.pier_cast_temperature_samples;
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    begin
      perform public.record_pier_cast_ingest_skip('primary', newest, started_at);
    exception when others then
      raise warning 'PierCast primary skip logging failed open';
    end;
    return null;
  end if;
  return public.invoke_pier_cast_temperature_ingestion();
end;
$$;

-- Collector and retention maintenance run in independent cron transactions, but
-- they are fail-open too so malformed response data or logging-table failures do
-- not turn observability into an operational failure.
alter function public.collect_pier_cast_ingest_outcomes()
  rename to pier_cast_collect_ingest_outcomes_v1;
alter function public.cleanup_pier_cast_ingest_outcomes()
  rename to pier_cast_cleanup_ingest_outcomes_v1;

revoke all on function public.pier_cast_collect_ingest_outcomes_v1()
  from public, anon, authenticated, service_role;
revoke all on function public.pier_cast_cleanup_ingest_outcomes_v1()
  from public, anon, authenticated, service_role;

create function public.collect_pier_cast_ingest_outcomes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    return public.pier_cast_collect_ingest_outcomes_v1();
  exception when others then
    raise warning 'PierCast ingest outcome collector failed open';
    return 0;
  end;
end;
$$;

create function public.cleanup_pier_cast_ingest_outcomes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    return public.pier_cast_cleanup_ingest_outcomes_v1();
  exception when others then
    raise warning 'PierCast ingest outcome cleanup failed open';
    return 0;
  end;
end;
$$;

revoke all on function public.collect_pier_cast_ingest_outcomes()
  from public, anon, authenticated, service_role;
revoke all on function public.cleanup_pier_cast_ingest_outcomes()
  from public, anon, authenticated, service_role;

comment on function public.record_pier_cast_ingest_request(text,bigint,timestamptz) is
  'Best-effort sanitized request logger. All logging errors are caught and never affect the underlying ingest request.';
comment on function public.record_pier_cast_ingest_skip(text,timestamptz,timestamptz) is
  'Best-effort sanitized fresh-skip logger. All logging errors are caught.';
comment on function public.collect_pier_cast_ingest_outcomes() is
  'Best-effort response collector. Parsing and persistence errors return zero and never affect ingest.';
comment on function public.cleanup_pier_cast_ingest_outcomes() is
  'Best-effort fourteen-day retention cleanup. Errors return zero.';
