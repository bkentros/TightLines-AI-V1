drop function if exists public.begin_water_reader_generation_request(
  uuid,
  uuid,
  text,
  integer,
  text,
  integer,
  integer
);

create or replace function public.begin_water_reader_generation_request(
  in_user_id uuid,
  in_lake_id uuid,
  in_season_context_key text,
  in_map_width integer,
  in_engine_version text,
  in_priority integer default 0,
  in_max_attempts integer default 10
)
returns table (
  allowed boolean,
  same_request boolean,
  job_id uuid,
  lake_id uuid,
  season_context_key text,
  map_width integer,
  engine_version text,
  status text,
  attempts integer,
  max_attempts integer,
  next_attempt_at timestamptz,
  last_error text,
  requested_by uuid,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  active public.water_reader_user_active_generation_requests;
  job public.water_reader_generation_jobs;
  requested_max_attempts integer := greatest(coalesce(in_max_attempts, 10), 1);
  request_is_same boolean;
begin
  perform pg_advisory_xact_lock(
    hashtext('water_reader_user_active_generation_request'),
    hashtext(in_user_id::text)
  );

  delete from public.water_reader_user_active_generation_requests active_requests
  where active_requests.user_id = in_user_id
    and exists (
      select 1
      from public.water_reader_engine_read_cache cache
      where cache.lake_id = active_requests.lake_id
        and cache.season_context_key = active_requests.season_context_key
        and cache.map_width = active_requests.map_width
        and cache.engine_version = active_requests.engine_version
    );

  select *
  into active
  from public.water_reader_user_active_generation_requests
  where user_id = in_user_id
  for update;

  if active.user_id is not null then
    select *
    into job
    from public.water_reader_generation_jobs
    where id = active.generation_job_id;

    if job.id is not null and job.status = 'failed' and job.attempts < job.max_attempts then
      update public.water_reader_generation_jobs jobs
      set
        status = 'queued',
        max_attempts = greatest(jobs.max_attempts, requested_max_attempts),
        failed_at = null,
        locked_by = null,
        locked_at = null,
        next_attempt_at = now()
      where jobs.id = job.id
      returning jobs.* into job;
    end if;

    if job.id is not null and job.status in ('queued', 'processing') then
      request_is_same :=
        active.lake_id = in_lake_id
        and active.season_context_key = in_season_context_key
        and active.map_width = in_map_width
        and active.engine_version = in_engine_version;

      if request_is_same then
        insert into public.water_reader_user_history (
          user_id,
          lake_id,
          season_context_key,
          map_width,
          engine_version,
          generation_job_id,
          status,
          last_viewed_at
        )
        values (
          in_user_id,
          active.lake_id,
          active.season_context_key,
          active.map_width,
          active.engine_version,
          job.id,
          'preparing',
          now()
        )
        on conflict on constraint water_reader_user_history_cache_key_unique
        do update set
          generation_job_id = excluded.generation_job_id,
          status = 'preparing',
          last_viewed_at = now();
      end if;

      return query
      select
        false,
        request_is_same,
        job.id,
        active.lake_id,
        active.season_context_key,
        active.map_width,
        active.engine_version,
        job.status,
        job.attempts,
        job.max_attempts,
        job.next_attempt_at,
        job.last_error,
        job.requested_by,
        job.created_at,
        job.updated_at;
      return;
    end if;

    delete from public.water_reader_user_active_generation_requests
    where user_id = in_user_id;
  end if;

  job := public.ensure_water_reader_generation_job(
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    in_user_id,
    coalesce(in_priority, 0)
  );

  update public.water_reader_generation_jobs jobs
  set
    max_attempts = greatest(jobs.max_attempts, requested_max_attempts),
    status = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then 'queued'
      else jobs.status
    end,
    failed_at = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then null
      else jobs.failed_at
    end,
    locked_by = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then null
      else jobs.locked_by
    end,
    locked_at = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then null
      else jobs.locked_at
    end,
    next_attempt_at = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then now()
      else jobs.next_attempt_at
    end
  where jobs.id = job.id
  returning jobs.* into job;

  insert into public.water_reader_user_active_generation_requests (
    user_id,
    lake_id,
    season_context_key,
    map_width,
    engine_version,
    generation_job_id
  )
  values (
    in_user_id,
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    job.id
  );

  insert into public.water_reader_user_history (
    user_id,
    lake_id,
    season_context_key,
    map_width,
    engine_version,
    generation_job_id,
    status,
    last_viewed_at
  )
  values (
    in_user_id,
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    job.id,
    'preparing',
    now()
  )
  on conflict on constraint water_reader_user_history_cache_key_unique
  do update set
    generation_job_id = excluded.generation_job_id,
    status = 'preparing',
    last_viewed_at = now();

  return query
  select
    true,
    true,
    job.id,
    job.lake_id,
    job.season_context_key,
    job.map_width,
    job.engine_version,
    job.status,
    job.attempts,
    job.max_attempts,
    job.next_attempt_at,
    job.last_error,
    job.requested_by,
    job.created_at,
    job.updated_at;
end;
$$;

create or replace function public.claim_water_reader_generation_job(
  in_worker_id text,
  in_lock_timeout interval default interval '3 minutes'
)
returns public.water_reader_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  job public.water_reader_generation_jobs;
begin
  with candidate as (
    select id
    from public.water_reader_generation_jobs
    where (
        status = 'queued'
        and attempts < max_attempts
        and next_attempt_at <= now()
      )
      or (
        status = 'processing'
        and locked_at < now() - in_lock_timeout
        and attempts < max_attempts
      )
    order by priority desc, next_attempt_at asc, created_at asc
    for update skip locked
    limit 1
  )
  update public.water_reader_generation_jobs jobs
  set
    status = 'processing',
    locked_by = in_worker_id,
    locked_at = now(),
    started_at = coalesce(jobs.started_at, now()),
    last_error = null
  from candidate
  where jobs.id = candidate.id
  returning jobs.* into job;

  return job;
end;
$$;

revoke all on function public.begin_water_reader_generation_request(uuid, uuid, text, integer, text, integer, integer) from public;
revoke all on function public.claim_water_reader_generation_job(text, interval) from public;

grant execute on function public.begin_water_reader_generation_request(uuid, uuid, text, integer, text, integer, integer) to service_role;
grant execute on function public.claim_water_reader_generation_job(text, interval) to service_role;

notify pgrst, 'reload schema';
