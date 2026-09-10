create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

create or replace function public.invoke_pier_cast_temperature_ingestion()
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
   where name = 'pier_cast_project_url'
   limit 1;

  select decrypted_secret
    into anon_key
    from vault.decrypted_secrets
   where name = 'pier_cast_anon_key'
   limit 1;

  select decrypted_secret
    into internal_key
    from vault.decrypted_secrets
   where name = 'pier_cast_internal_key'
   limit 1;

  if project_url is null or anon_key is null or internal_key is null then
    raise warning
      'PierCast ingestion skipped: required Vault secrets are missing.';
    return null;
  end if;

  select net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/pier-cast-ingest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key,
      'x-pier-cast-internal-key', internal_key
    ),
    body := jsonb_build_object(
      'scheduledAt', timezone('utc', now())
    ),
    timeout_milliseconds := 55000
  ) into request_id;

  return request_id;
end;
$$;

revoke all on function public.invoke_pier_cast_temperature_ingestion()
  from public, anon, authenticated;
grant execute on function public.invoke_pier_cast_temperature_ingestion()
  to service_role;

do $$
declare
  existing_job_id bigint;
begin
  select jobid
    into existing_job_id
    from cron.job
   where jobname = 'pier-cast-temperature-ingestion'
   limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'pier-cast-temperature-ingestion',
    -- LMHOFS publishes every six hours. The :35 offset allows the full
    -- 120-hour forecast set to finish publishing before ingestion starts.
    '35 0,6,12,18 * * *',
    'select public.invoke_pier_cast_temperature_ingestion();'
  );
end;
$$;

comment on function public.invoke_pier_cast_temperature_ingestion() is
  'Invokes the authenticated PierCast all-city temperature ingest after each '
  'LMHOFS cycle window. Missing Vault secrets fail closed without an HTTP call.';
