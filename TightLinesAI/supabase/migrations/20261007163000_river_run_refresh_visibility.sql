create table if not exists public.river_run_refresh_outcomes (
  id bigint generated always as identity primary key,
  request_id bigint unique,
  requested_at timestamptz not null,
  completed_at timestamptz,
  http_status smallint check (http_status is null or http_status between 100 and 599),
  outcome_code text check (
    outcome_code is null or outcome_code ~ '^[A-Za-z0-9_.:-]{1,120}$'
  ),
  target_count integer check (target_count is null or target_count >= 0),
  failed_count integer check (failed_count is null or failed_count >= 0),
  duration_ms bigint check (duration_ms is null or duration_ms >= 0)
);

create index if not exists river_run_refresh_outcomes_requested_at_idx
  on public.river_run_refresh_outcomes (requested_at desc);
create index if not exists river_run_refresh_outcomes_pending_idx
  on public.river_run_refresh_outcomes (request_id)
  where completed_at is null and request_id is not null;

alter table public.river_run_refresh_outcomes enable row level security;
revoke all on table public.river_run_refresh_outcomes
  from public, anon, authenticated;
revoke all on sequence public.river_run_refresh_outcomes_id_seq
  from public, anon, authenticated;
grant select on table public.river_run_refresh_outcomes to service_role;

create or replace function public.invoke_river_run_internal_refresh()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  project_url text;
  anon_key text;
  internal_key text;
  request_id bigint;
  started_at timestamptz := clock_timestamp();
begin
  select decrypted_secret into project_url
    from vault.decrypted_secrets where name = 'river_run_project_url' limit 1;
  select decrypted_secret into anon_key
    from vault.decrypted_secrets where name = 'river_run_anon_key' limit 1;
  select decrypted_secret into internal_key
    from vault.decrypted_secrets where name = 'river_run_internal_key' limit 1;

  if project_url is null or anon_key is null or internal_key is null then
    insert into public.river_run_refresh_outcomes (
      requested_at, completed_at, outcome_code, duration_ms
    ) values (started_at, clock_timestamp(), 'not_enqueued', 0);
    raise warning 'River Run refresh skipped: required Vault secrets are missing.';
    return null;
  end if;

  select net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/river-run/internal/refresh',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key,
      'x-river-run-internal-key', internal_key
    ),
    body := jsonb_build_object('scheduledAt', timezone('utc', now())),
    -- The endpoint uses bounded three-way concurrency and 8-second provider
    -- deadlines. 55 seconds covers multiple provider waves without permitting
    -- an unbounded hung refresh.
    timeout_milliseconds := 55000
  ) into request_id;

  begin
    insert into public.river_run_refresh_outcomes (request_id, requested_at)
    values (request_id, started_at);
  exception when others then
    raise warning 'River Run refresh outcome logging failed open';
  end;
  return request_id;
end;
$$;

create or replace function public.collect_river_run_refresh_outcomes()
returns integer
language plpgsql
security definer
set search_path = public, net
as $$
declare
  changed integer := 0;
  missing integer := 0;
begin
  with raw as (
    select
      outcome.id,
      outcome.requested_at,
      response.status_code,
      public.pier_cast_try_jsonb(response.content) as body,
      public.pier_cast_try_timestamptz(response.headers->>'date') as response_at,
      response.timed_out,
      response.error_msg,
      case
        when response.error_msg ~ 'Total time: [0-9]+[.]?[0-9]* ms'
          then substring(response.error_msg from 'Total time: ([0-9]+[.]?[0-9]*) ms')::numeric
        else null
      end as transport_duration_ms
    from public.river_run_refresh_outcomes outcome
    join net._http_response response on response.id = outcome.request_id
    where outcome.completed_at is null
  )
  update public.river_run_refresh_outcomes outcome
     set completed_at = coalesce(
           raw.response_at,
           raw.requested_at + raw.transport_duration_ms * interval '1 millisecond',
           clock_timestamp()
         ),
         http_status = raw.status_code,
         outcome_code = case
           when raw.timed_out or raw.error_msg ilike '%timeout%' then 'transport_timeout'
           when raw.error_msg is not null then 'transport_error'
           when raw.status_code between 200 and 299
             and coalesce((raw.body->>'failedCount')::integer, 0) = 0 then 'succeeded'
           when raw.body->>'error' is not null then left(
             regexp_replace(raw.body->>'error', '[^A-Za-z0-9_.:-]+', '_', 'g'),
             120
           )
           else 'http_' || coalesce(raw.status_code::text, 'unknown')
         end,
         target_count = case when raw.body->>'targetCount' ~ '^[0-9]+$'
           then (raw.body->>'targetCount')::integer else null end,
         failed_count = case when raw.body->>'failedCount' ~ '^[0-9]+$'
           then (raw.body->>'failedCount')::integer else null end,
         duration_ms = greatest(0, round(coalesce(
           raw.transport_duration_ms,
           extract(epoch from (raw.response_at - raw.requested_at)) * 1000,
           extract(epoch from (clock_timestamp() - raw.requested_at)) * 1000
         ))::bigint)
    from raw
   where outcome.id = raw.id;
  get diagnostics changed = row_count;

  update public.river_run_refresh_outcomes
     set completed_at = clock_timestamp(),
         outcome_code = 'response_missing',
         duration_ms = greatest(0, round(
           extract(epoch from (clock_timestamp() - requested_at)) * 1000
         )::bigint)
   where completed_at is null
     and request_id is not null
     and requested_at < clock_timestamp() - interval '5 minutes';
  get diagnostics missing = row_count;

  delete from public.river_run_refresh_outcomes
   where requested_at < clock_timestamp() - interval '14 days';
  return changed + missing;
end;
$$;

revoke all on function public.invoke_river_run_internal_refresh()
  from public, anon, authenticated;
grant execute on function public.invoke_river_run_internal_refresh()
  to service_role;
revoke all on function public.collect_river_run_refresh_outcomes()
  from public, anon, authenticated, service_role;

do $$
declare existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job
   where jobname = 'river-run-refresh-outcome-collector' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule(
    'river-run-refresh-outcome-collector',
    '* * * * *',
    'select public.collect_river_run_refresh_outcomes();'
  );
end;
$$;

comment on table public.river_run_refresh_outcomes is
  'Fourteen-day service-only River Run refresh status; transport timeouts are preserved instead of appearing as successful cron enqueues.';

notify pgrst, 'reload schema';
