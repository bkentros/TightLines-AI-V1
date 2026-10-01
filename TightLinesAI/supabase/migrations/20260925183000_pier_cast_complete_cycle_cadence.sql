-- LMHOFS publishes a new cycle every six hours, but the complete 120-hour
-- forecast is not available at the nominal issue time. Run the coordinated
-- PierCast ingestion window after the complete cycle has had time to publish.
-- Cohorts remain staggered and the aggregate remains last.

do $$
declare
  scheduled_job record;
  existing_job_id bigint;
begin
  for scheduled_job in
    select *
      from (values
        ('pier-cast-temperature-ingestion', '35 3,9,15,21 * * *', 'select public.invoke_pier_cast_temperature_ingestion();'),
        ('pier-cast-wisconsin-shadow-ingestion', '45 3,9,15,21 * * *', 'select public.invoke_pier_cast_wisconsin_shadow_ingestion();'),
        ('pier-cast-lake-huron-shadow-ingestion', '50 3,9,15,21 * * *', 'select public.invoke_pier_cast_lake_huron_shadow_ingestion();'),
        ('pier-cast-pentwater-caseville-shadow-ingestion', '52 3,9,15,21 * * *', 'select public.invoke_pier_cast_pentwater_caseville_shadow_ingestion();'),
        ('pier-cast-five-city-shadow-ingestion', '54 3,9,15,21 * * *', 'select public.invoke_pier_cast_five_city_shadow_ingestion();'),
        ('pier-cast-chicago-alpena-shadow-ingestion', '54 3,9,15,21 * * *', 'select public.invoke_pier_cast_chicago_alpena_shadow_ingestion();'),
        ('pier-cast-st-joseph-harrisville-shadow-ingestion', '55 3,9,15,21 * * *', 'select public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();'),
        ('pier-cast-v3-shadow-ingestion', '58 3,9,15,21 * * *', 'select public.invoke_pier_cast_v3_shadow_ingestion();')
      ) as jobs(job_name, cron_expression, command_sql)
  loop
    select jobid
      into existing_job_id
      from cron.job
     where jobname = scheduled_job.job_name
     limit 1;

    if existing_job_id is not null then
      perform cron.unschedule(existing_job_id);
    end if;

    perform cron.schedule(
      scheduled_job.job_name,
      scheduled_job.cron_expression,
      scheduled_job.command_sql
    );
  end loop;
end;
$$;

comment on function public.invoke_pier_cast_temperature_ingestion() is
  'Invokes the authenticated PierCast temperature ingest after each complete LMHOFS cycle is expected to be available.';
