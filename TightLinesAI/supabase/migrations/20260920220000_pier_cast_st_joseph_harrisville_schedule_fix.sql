-- Keep the private source-cohort ingest ahead of the aggregate Formula v3 job.
-- The v3 archive runs at minute 58, so sharing that minute creates a race.
do $$ declare existing_job_id bigint; begin
  select jobid into existing_job_id from cron.job
    where jobname='pier-cast-st-joseph-harrisville-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-st-joseph-harrisville-shadow-ingestion','55 0,6,12,18 * * *',
    'select public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();');
end; $$;

comment on function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion() is
  'Private five-city source ingest scheduled three minutes before aggregate Formula v3 archival.';
