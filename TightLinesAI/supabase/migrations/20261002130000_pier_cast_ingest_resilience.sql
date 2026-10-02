-- PierCast ingest resilience (2026-10-02 outage).
--
-- What happened: the 09:35Z primary ingest (5 cities x 121 hours from NOAA
-- LMHOFS, plus calibration observations and snapshots) needed longer than the
-- 55 s pg_net timeout on the scheduled HTTP call, committed nothing, and the
-- next chance was six hours later. Every public PierCast read requires all
-- seven cohorts fresh within 13 hours, so one missed primary cycle after an
-- earlier miss took the leaderboard and City Reports down.
--
-- Fixes:
--   1. Every invoke_pier_cast_* scheduler waits up to 150 s (the Edge Function
--      request limit) instead of 55 s. Each function's current definition is
--      rewritten in place, so nothing else about it changes.
--   2. A catch-up run 40 minutes after each primary window re-invokes the
--      primary ingest only if its newest cycle is still stale, then the v3
--      aggregate re-runs (it answers "already_committed" when nothing changed).
--      Re-running is safe: commit_pier_cast_lmhofs_cycle upserts on
--      (city_id, issued_at, forecast_hour).

do $$
declare
  fn record;
  definition text;
  updated integer := 0;
begin
  for fn in
    select p.oid, p.proname
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname like 'invoke\_pier\_cast\_%' escape '\'
  loop
    definition := pg_get_functiondef(fn.oid);
    if position('timeout_milliseconds := 55000' in definition) > 0 then
      execute replace(definition, 'timeout_milliseconds := 55000', 'timeout_milliseconds := 150000');
      updated := updated + 1;
      raise notice 'PierCast ingest timeout raised to 150 s: %', fn.proname;
    end if;
  end loop;
  if updated = 0 then
    raise exception 'No PierCast ingest scheduler with a 55 s timeout was found; review before applying.';
  end if;
end;
$$;

-- Catch-up for the primary cohort: invoke again only when its newest archived
-- cycle is more than 9 hours old. At the catch-up times (hh:15, 40 minutes
-- after the hh:35 window) a successful window leaves a ~4 h old cycle, a failed
-- one leaves a ~10 h old cycle.
create or replace function public.invoke_pier_cast_temperature_ingestion_if_stale()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  newest timestamptz;
begin
  select max(issued_at) into newest from public.pier_cast_temperature_samples;
  if newest is not null and newest > timezone('utc', now()) - interval '9 hours' then
    return null; -- the regular window already committed this cycle
  end if;
  return public.invoke_pier_cast_temperature_ingestion();
end;
$$;

revoke all on function public.invoke_pier_cast_temperature_ingestion_if_stale()
  from public, anon, authenticated;
grant execute on function public.invoke_pier_cast_temperature_ingestion_if_stale()
  to service_role;

comment on function public.invoke_pier_cast_temperature_ingestion_if_stale() is
  'Catch-up for a missed primary PierCast ingest window; does nothing when the newest primary cycle is fresh.';

do $$
declare
  scheduled_job record;
  existing_job_id bigint;
begin
  for scheduled_job in
    select *
      from (values
        ('pier-cast-temperature-ingestion-catchup', '15 4,10,16,22 * * *', 'select public.invoke_pier_cast_temperature_ingestion_if_stale();'),
        ('pier-cast-v3-shadow-ingestion-catchup', '35 4,10,16,22 * * *', 'select public.invoke_pier_cast_v3_shadow_ingestion();')
      ) as jobs(job_name, cron_expression, command_sql)
  loop
    select jobid into existing_job_id from cron.job where jobname = scheduled_job.job_name limit 1;
    if existing_job_id is not null then
      perform cron.unschedule(existing_job_id);
    end if;
    perform cron.schedule(scheduled_job.job_name, scheduled_job.cron_expression, scheduled_job.command_sql);
  end loop;
end;
$$;
