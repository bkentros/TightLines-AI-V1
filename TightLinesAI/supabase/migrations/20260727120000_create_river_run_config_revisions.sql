create table if not exists public.river_run_config_revisions (
  id bigserial primary key,
  config_key text not null,
  revision integer not null check (revision > 0),
  status text not null check (status in ('draft', 'published', 'archived')),
  schema_version text not null check (schema_version = 'river-run-config-v1'),
  config_version text not null,
  movement_engine_version text not null,
  document jsonb not null,
  evidence_notes text not null check (length(trim(evidence_notes)) > 0),
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (config_key, revision)
);

create unique index if not exists river_run_config_one_published_idx
  on public.river_run_config_revisions (config_key)
  where status = 'published';

create index if not exists river_run_config_status_lookup_idx
  on public.river_run_config_revisions (status, config_key, revision desc);

drop trigger if exists river_run_config_revisions_set_updated_at
  on public.river_run_config_revisions;

create trigger river_run_config_revisions_set_updated_at
before update on public.river_run_config_revisions
for each row
execute function public.set_river_run_updated_at();

alter table public.river_run_config_revisions enable row level security;

drop policy if exists "river_run_config_revisions_service_role_all"
  on public.river_run_config_revisions;

create policy "river_run_config_revisions_service_role_all"
  on public.river_run_config_revisions
  for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.river_run_config_revisions from anon, authenticated;

create or replace function public.publish_river_run_config_revision(
  target_config_key text,
  target_revision integer
)
returns setof public.river_run_config_revisions
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.river_run_config_revisions%rowtype;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;

  select *
    into target
    from public.river_run_config_revisions
   where config_key = target_config_key
     and revision = target_revision
     and status = 'draft'
   for update;

  if not found then
    raise exception 'draft configuration revision not found';
  end if;

  update public.river_run_config_revisions
     set status = 'archived',
         updated_at = timezone('utc', now())
   where config_key = target_config_key
     and status = 'published';

  update public.river_run_config_revisions
     set status = 'published',
         published_at = timezone('utc', now()),
         updated_at = timezone('utc', now())
   where id = target.id;

  return query
  select *
    from public.river_run_config_revisions
   where id = target.id;
end;
$$;

revoke all on function public.publish_river_run_config_revision(text, integer)
  from public, anon, authenticated;
grant execute on function public.publish_river_run_config_revision(text, integer)
  to service_role;
