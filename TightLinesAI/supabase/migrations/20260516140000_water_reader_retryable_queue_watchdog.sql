create or replace function public.water_reader_generation_error_is_retryable(
  in_error text
)
returns boolean
language sql
immutable
as $$
  select case
    when in_error is null or btrim(in_error) = '' then true
    when lower(in_error) like '%does not have polygon geometry%' then false
    when lower(in_error) like '%needs geometry cleanup%' then false
    when lower(in_error) like '%not supported%' then false
    when lower(in_error) like '%not_found%' then false
    when lower(in_error) like '%invalid_lake_id%' then false
    when lower(in_error) like '%invalid_map_width%' then false
    when lower(in_error) like '%invalid_engine_version%' then false
    else true
  end;
$$;

create or replace function public.requeue_water_reader_generation_job(
  in_job_id uuid,
  in_reason text default 'Retrying Water Reader generation.'
)
returns public.water_reader_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  job public.water_reader_generation_jobs;
begin
  update public.water_reader_generation_jobs jobs
  set
    status = 'queued',
    attempts = least(jobs.attempts, greatest(jobs.max_attempts - 1, 0)),
    max_attempts = greatest(jobs.max_attempts, 10),
    failed_at = null,
    locked_by = null,
    locked_at = null,
    next_attempt_at = now(),
    last_error = left(coalesce(in_reason, jobs.last_error, 'Retrying Water Reader generation.'), 4000)
  where jobs.id = in_job_id
    and jobs.status = 'failed'
    and public.water_reader_generation_error_is_retryable(jobs.last_error)
  returning * into job;

  if job.id is not null then
    update public.water_reader_user_history
    set status = 'preparing'
    where generation_job_id = in_job_id;
  end if;

  return job;
end;
$$;

create or replace function public.requeue_stale_water_reader_generation_jobs(
  in_lock_timeout interval default interval '3 minutes'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer := 0;
begin
  update public.water_reader_generation_jobs jobs
  set
    status = 'queued',
    locked_by = null,
    locked_at = null,
    next_attempt_at = now(),
    last_error = left(coalesce(jobs.last_error, 'Requeued stale Water Reader generation.'), 4000)
  where jobs.status = 'processing'
    and jobs.locked_at is not null
    and jobs.locked_at < now() - in_lock_timeout
    and jobs.attempts < jobs.max_attempts;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

create or replace function public.mark_water_reader_generation_job_failed(
  in_job_id uuid,
  in_error text,
  in_retry_after_seconds integer default 60
)
returns public.water_reader_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  job public.water_reader_generation_jobs;
  retryable boolean := public.water_reader_generation_error_is_retryable(in_error);
begin
  update public.water_reader_generation_jobs jobs
  set
    attempts = jobs.attempts + 1,
    max_attempts = case
      when retryable then greatest(jobs.max_attempts, jobs.attempts + 2, 10)
      else jobs.max_attempts
    end,
    status = case
      when retryable then 'queued'
      when jobs.attempts + 1 >= jobs.max_attempts then 'failed'
      else 'queued'
    end,
    failed_at = case
      when retryable then null
      when jobs.attempts + 1 >= jobs.max_attempts then now()
      else jobs.failed_at
    end,
    locked_by = null,
    locked_at = null,
    next_attempt_at = case
      when retryable or jobs.attempts + 1 < jobs.max_attempts
        then now() + make_interval(secs => greatest(coalesce(in_retry_after_seconds, 60), 1))
      else now()
    end,
    last_error = left(coalesce(in_error, 'Water Reader generation failed.'), 4000)
  where jobs.id = in_job_id
  returning * into job;

  if job.status = 'failed' then
    update public.water_reader_user_history
    set status = 'failed'
    where generation_job_id = in_job_id;

    delete from public.water_reader_user_active_generation_requests
    where generation_job_id = in_job_id;
  else
    update public.water_reader_user_history
    set status = 'preparing'
    where generation_job_id = in_job_id;
  end if;

  return job;
end;
$$;

revoke all on function public.water_reader_generation_error_is_retryable(text) from public;
revoke all on function public.requeue_water_reader_generation_job(uuid, text) from public;
revoke all on function public.requeue_stale_water_reader_generation_jobs(interval) from public;
revoke all on function public.mark_water_reader_generation_job_failed(uuid, text, integer) from public;

grant execute on function public.water_reader_generation_error_is_retryable(text) to service_role;
grant execute on function public.requeue_water_reader_generation_job(uuid, text) to service_role;
grant execute on function public.requeue_stale_water_reader_generation_jobs(interval) to service_role;
grant execute on function public.mark_water_reader_generation_job_failed(uuid, text, integer) to service_role;

notify pgrst, 'reload schema';
