create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

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
begin
  select decrypted_secret
    into project_url
    from vault.decrypted_secrets
   where name = 'river_run_project_url'
   limit 1;

  select decrypted_secret
    into anon_key
    from vault.decrypted_secrets
   where name = 'river_run_anon_key'
   limit 1;

  select decrypted_secret
    into internal_key
    from vault.decrypted_secrets
   where name = 'river_run_internal_key'
   limit 1;

  if project_url is null or anon_key is null or internal_key is null then
    raise warning
      'River Run refresh skipped: required Vault secrets are missing.';
    return null;
  end if;

  select net.http_post(
    url := rtrim(project_url, '/') ||
      '/functions/v1/river-run/internal/refresh',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key,
      'x-river-run-internal-key', internal_key
    ),
    body := jsonb_build_object(
      'scheduledAt', timezone('utc', now())
    ),
    timeout_milliseconds := 15000
  )
    into request_id;

  return request_id;
end;
$$;

revoke all on function public.invoke_river_run_internal_refresh() from public;
grant execute on function public.invoke_river_run_internal_refresh()
  to service_role;

do $$
declare
  existing_job_id bigint;
begin
  select jobid
    into existing_job_id
    from cron.job
   where jobname = 'river-run-hourly-refresh'
   limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'river-run-hourly-refresh',
    '7 * * * *',
    'select public.invoke_river_run_internal_refresh();'
  );
end;
$$;

comment on function public.invoke_river_run_internal_refresh() is
  'Invokes the protected River Run refresh endpoint. The hourly cron safely '
  'fills the current 00:00, 08:00, or 16:00 local slot through idempotent keys.';
