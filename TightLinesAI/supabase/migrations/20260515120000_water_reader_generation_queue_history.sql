create table if not exists public.water_reader_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  lake_id uuid not null,
  season_context_key text not null,
  map_width integer not null,
  engine_version text not null,
  status text not null default 'queued',
  priority integer not null default 0,
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  requested_by uuid null,
  locked_by text null,
  locked_at timestamptz null,
  next_attempt_at timestamptz not null default now(),
  started_at timestamptz null,
  completed_at timestamptz null,
  failed_at timestamptz null,
  last_error text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint water_reader_generation_jobs_status_check
    check (status in ('queued', 'processing', 'complete', 'failed')),
  constraint water_reader_generation_jobs_cache_key_unique
    unique (lake_id, season_context_key, map_width, engine_version)
);

create index if not exists water_reader_generation_jobs_status_next_attempt_idx
  on public.water_reader_generation_jobs (status, next_attempt_at, priority desc, created_at);

create index if not exists water_reader_generation_jobs_cache_key_idx
  on public.water_reader_generation_jobs (lake_id, season_context_key, map_width, engine_version);

drop trigger if exists water_reader_generation_jobs_set_updated_at on public.water_reader_generation_jobs;
create trigger water_reader_generation_jobs_set_updated_at
before update on public.water_reader_generation_jobs
for each row execute function public.set_generic_updated_at();

alter table public.water_reader_generation_jobs enable row level security;

drop policy if exists "water_reader_generation_jobs_service_role_all"
  on public.water_reader_generation_jobs;

create policy "water_reader_generation_jobs_service_role_all"
  on public.water_reader_generation_jobs
  for all
  to service_role
  using (true)
  with check (true);

create table if not exists public.water_reader_user_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lake_id uuid not null,
  season_context_key text not null,
  map_width integer not null,
  engine_version text not null,
  generation_job_id uuid null references public.water_reader_generation_jobs(id),
  status text not null default 'preparing',
  is_pinned boolean not null default false,
  first_requested_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint water_reader_user_history_status_check
    check (status in ('preparing', 'ready', 'failed')),
  constraint water_reader_user_history_cache_key_unique
    unique (user_id, lake_id, season_context_key, map_width, engine_version)
);

create index if not exists water_reader_user_history_user_recent_idx
  on public.water_reader_user_history (user_id, last_viewed_at desc);

create index if not exists water_reader_user_history_cache_key_idx
  on public.water_reader_user_history (lake_id, season_context_key, map_width, engine_version);

create index if not exists water_reader_user_history_job_idx
  on public.water_reader_user_history (generation_job_id)
  where generation_job_id is not null;

drop trigger if exists water_reader_user_history_set_updated_at on public.water_reader_user_history;
create trigger water_reader_user_history_set_updated_at
before update on public.water_reader_user_history
for each row execute function public.set_generic_updated_at();

alter table public.water_reader_user_history enable row level security;

drop policy if exists "water_reader_user_history_service_role_all"
  on public.water_reader_user_history;

create policy "water_reader_user_history_service_role_all"
  on public.water_reader_user_history
  for all
  to service_role
  using (true)
  with check (true);

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
    requested_by = coalesce(public.water_reader_generation_jobs.requested_by, excluded.requested_by),
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

create or replace function public.claim_water_reader_generation_job(
  in_worker_id text,
  in_lock_timeout interval default interval '15 minutes'
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
  end if;

  return job;
end;
$$;

revoke all on function public.ensure_water_reader_generation_job(uuid, text, integer, text, uuid, integer) from public;
revoke all on function public.claim_water_reader_generation_job(text, interval) from public;
revoke all on function public.mark_water_reader_generation_job_complete(uuid) from public;
revoke all on function public.mark_water_reader_generation_job_failed(uuid, text, integer) from public;

grant execute on function public.ensure_water_reader_generation_job(uuid, text, integer, text, uuid, integer) to service_role;
grant execute on function public.claim_water_reader_generation_job(text, interval) to service_role;
grant execute on function public.mark_water_reader_generation_job_complete(uuid) to service_role;
grant execute on function public.mark_water_reader_generation_job_failed(uuid, text, integer) to service_role;

notify pgrst, 'reload schema';
