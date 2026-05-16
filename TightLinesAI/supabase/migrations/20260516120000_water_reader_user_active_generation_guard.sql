create table if not exists public.water_reader_user_active_generation_requests (
  user_id uuid primary key,
  lake_id uuid not null,
  season_context_key text not null,
  map_width integer not null,
  engine_version text not null,
  generation_job_id uuid null references public.water_reader_generation_jobs(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists water_reader_user_active_generation_requests_job_idx
  on public.water_reader_user_active_generation_requests (generation_job_id)
  where generation_job_id is not null;

create index if not exists water_reader_user_active_generation_requests_cache_key_idx
  on public.water_reader_user_active_generation_requests (lake_id, season_context_key, map_width, engine_version);

drop trigger if exists water_reader_user_active_generation_requests_set_updated_at
  on public.water_reader_user_active_generation_requests;
create trigger water_reader_user_active_generation_requests_set_updated_at
before update on public.water_reader_user_active_generation_requests
for each row execute function public.set_generic_updated_at();

alter table public.water_reader_user_active_generation_requests enable row level security;

drop policy if exists "water_reader_user_active_generation_requests_service_role_all"
  on public.water_reader_user_active_generation_requests;

create policy "water_reader_user_active_generation_requests_service_role_all"
  on public.water_reader_user_active_generation_requests
  for all
  to service_role
  using (true)
  with check (true);

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
    job.created_at,
    job.updated_at;
end;
$$;

create or replace function public.clear_water_reader_user_active_generation_request(
  in_user_id uuid default null,
  in_generation_job_id uuid default null,
  in_lake_id uuid default null,
  in_season_context_key text default null,
  in_map_width integer default null,
  in_engine_version text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer := 0;
begin
  delete from public.water_reader_user_active_generation_requests active_requests
  where (in_user_id is null or active_requests.user_id = in_user_id)
    and (in_generation_job_id is null or active_requests.generation_job_id = in_generation_job_id)
    and (in_lake_id is null or active_requests.lake_id = in_lake_id)
    and (in_season_context_key is null or active_requests.season_context_key = in_season_context_key)
    and (in_map_width is null or active_requests.map_width = in_map_width)
    and (in_engine_version is null or active_requests.engine_version = in_engine_version);

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create or replace function public.mark_water_reader_generation_job_complete(
  in_job_id uuid
)
returns public.water_reader_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  job public.water_reader_generation_jobs;
begin
  update public.water_reader_generation_jobs
  set
    status = 'complete',
    completed_at = now(),
    failed_at = null,
    locked_by = null,
    locked_at = null,
    last_error = null
  where id = in_job_id
  returning * into job;

  update public.water_reader_user_history
  set status = 'ready'
  where generation_job_id = in_job_id;

  delete from public.water_reader_user_active_generation_requests
  where generation_job_id = in_job_id;

  return job;
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
begin
  update public.water_reader_generation_jobs jobs
  set
    attempts = jobs.attempts + 1,
    status = case when jobs.attempts + 1 >= jobs.max_attempts then 'failed' else 'queued' end,
    failed_at = case when jobs.attempts + 1 >= jobs.max_attempts then now() else jobs.failed_at end,
    locked_by = null,
    locked_at = null,
    next_attempt_at = case
      when jobs.attempts + 1 >= jobs.max_attempts then now()
      else now() + make_interval(secs => greatest(coalesce(in_retry_after_seconds, 60), 1))
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
  end if;

  return job;
end;
$$;

create or replace function public.cancel_water_reader_generation_job(
  in_job_id uuid,
  in_error text default 'Water Reader generation was cancelled.'
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
    attempts = jobs.max_attempts,
    status = 'failed',
    failed_at = now(),
    locked_by = null,
    locked_at = null,
    next_attempt_at = now(),
    last_error = left(coalesce(in_error, 'Water Reader generation was cancelled.'), 4000)
  where jobs.id = in_job_id
  returning * into job;

  update public.water_reader_user_history
  set status = 'failed'
  where generation_job_id = in_job_id;

  delete from public.water_reader_user_active_generation_requests
  where generation_job_id = in_job_id;

  return job;
end;
$$;

revoke all on function public.begin_water_reader_generation_request(uuid, uuid, text, integer, text, integer, integer) from public;
revoke all on function public.clear_water_reader_user_active_generation_request(uuid, uuid, uuid, text, integer, text) from public;
revoke all on function public.mark_water_reader_generation_job_complete(uuid) from public;
revoke all on function public.mark_water_reader_generation_job_failed(uuid, text, integer) from public;
revoke all on function public.cancel_water_reader_generation_job(uuid, text) from public;

grant execute on function public.begin_water_reader_generation_request(uuid, uuid, text, integer, text, integer, integer) to service_role;
grant execute on function public.clear_water_reader_user_active_generation_request(uuid, uuid, uuid, text, integer, text) to service_role;
grant execute on function public.mark_water_reader_generation_job_complete(uuid) to service_role;
grant execute on function public.mark_water_reader_generation_job_failed(uuid, text, integer) to service_role;
grant execute on function public.cancel_water_reader_generation_job(uuid, text) to service_role;

notify pgrst, 'reload schema';
