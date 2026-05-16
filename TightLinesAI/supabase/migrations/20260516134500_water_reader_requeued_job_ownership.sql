create or replace function public.ensure_water_reader_generation_job(
  in_lake_id uuid,
  in_season_context_key text,
  in_map_width integer,
  in_engine_version text,
  in_requested_by uuid default null,
  in_priority integer default 0
)
returns public.water_reader_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  job public.water_reader_generation_jobs;
begin
  insert into public.water_reader_generation_jobs (
    lake_id,
    season_context_key,
    map_width,
    engine_version,
    priority,
    requested_by
  )
  values (
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    coalesce(in_priority, 0),
    in_requested_by
  )
  on conflict (lake_id, season_context_key, map_width, engine_version)
  do update set
    priority = greatest(public.water_reader_generation_jobs.priority, excluded.priority),
    requested_by = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then excluded.requested_by
      else coalesce(public.water_reader_generation_jobs.requested_by, excluded.requested_by)
    end,
    status = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then 'queued'
      else public.water_reader_generation_jobs.status
    end,
    locked_by = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then null
      else public.water_reader_generation_jobs.locked_by
    end,
    locked_at = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then null
      else public.water_reader_generation_jobs.locked_at
    end,
    next_attempt_at = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then now()
      else public.water_reader_generation_jobs.next_attempt_at
    end,
    completed_at = case
      when public.water_reader_generation_jobs.status = 'complete' then null
      else public.water_reader_generation_jobs.completed_at
    end
  returning * into job;

  return job;
end;
$$;

revoke all on function public.ensure_water_reader_generation_job(uuid, text, integer, text, uuid, integer) from public;
grant execute on function public.ensure_water_reader_generation_job(uuid, text, integer, text, uuid, integer) to service_role;

notify pgrst, 'reload schema';
