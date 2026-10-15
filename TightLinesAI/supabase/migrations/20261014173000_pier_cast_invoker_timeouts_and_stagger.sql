-- Normalize every PierCast raw HTTP invoker to the Edge Function's 150-second
-- request budget, then stagger the seven cohorts and aggregate so no two
-- regular jobs begin in the same minute.

do $$
declare
  function_name text;
  function_oid regprocedure;
  definition text;
  rewritten_definition text;
  timeout_match text[];
begin
  foreach function_name in array array[
    'pier_cast_raw_invoke_primary_v1',
    'pier_cast_raw_invoke_wisconsin_v1',
    'pier_cast_raw_invoke_lake_huron_v1',
    'pier_cast_raw_invoke_pentwater_caseville_v1',
    'pier_cast_raw_invoke_five_city_v1',
    'pier_cast_raw_invoke_chicago_alpena_v1',
    'pier_cast_raw_invoke_stj_harrisville_v1',
    'pier_cast_raw_invoke_v3_v1'
  ]
  loop
    function_oid := to_regprocedure(format('public.%I()', function_name));
    if function_oid is null then
      raise exception 'Required PierCast raw invoker is missing: %', function_name;
    end if;

    definition := pg_get_functiondef(function_oid);
    timeout_match := regexp_match(
      definition,
      'timeout_milliseconds[[:space:]]*(:=|=>)[[:space:]]*([0-9]+)'
    );
    if timeout_match is null then
      raise exception 'PierCast raw invoker has no explicit timeout: %', function_name;
    end if;

    rewritten_definition := regexp_replace(
      definition,
      'timeout_milliseconds[[:space:]]*(:=|=>)[[:space:]]*[0-9]+',
      'timeout_milliseconds := 150000',
      'g'
    );
    execute rewritten_definition;

    function_oid := to_regprocedure(format('public.%I()', function_name));
    timeout_match := regexp_match(
      pg_get_functiondef(function_oid),
      'timeout_milliseconds[[:space:]]*(:=|=>)[[:space:]]*([0-9]+)'
    );
    if timeout_match is null or timeout_match[2] <> '150000' then
      raise exception 'Failed to set PierCast raw invoker timeout: %', function_name;
    end if;
  end loop;
end;
$$;

do $$
declare
  scheduled_job record;
  existing_job_id bigint;
  regular_job_count integer;
  distinct_minute_count integer;
begin
  for scheduled_job in
    select *
      from (values
        ('pier-cast-temperature-ingestion',
          '35 3,9,15,21 * * *',
          'select public.invoke_pier_cast_temperature_ingestion();'),
        ('pier-cast-wisconsin-shadow-ingestion',
          '40 3,9,15,21 * * *',
          'select public.invoke_pier_cast_wisconsin_shadow_ingestion();'),
        ('pier-cast-lake-huron-shadow-ingestion',
          '45 3,9,15,21 * * *',
          'select public.invoke_pier_cast_lake_huron_shadow_ingestion();'),
        ('pier-cast-pentwater-caseville-shadow-ingestion',
          '50 3,9,15,21 * * *',
          'select public.invoke_pier_cast_pentwater_caseville_shadow_ingestion();'),
        ('pier-cast-five-city-shadow-ingestion',
          '55 3,9,15,21 * * *',
          'select public.invoke_pier_cast_five_city_shadow_ingestion();'),
        ('pier-cast-chicago-alpena-shadow-ingestion',
          '0 4,10,16,22 * * *',
          'select public.invoke_pier_cast_chicago_alpena_shadow_ingestion();'),
        ('pier-cast-st-joseph-harrisville-shadow-ingestion',
          '5 4,10,16,22 * * *',
          'select public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();'),
        ('pier-cast-v3-shadow-ingestion',
          '10 4,10,16,22 * * *',
          'select public.invoke_pier_cast_v3_shadow_ingestion();')
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

  select count(*), count(distinct split_part(schedule, ' ', 1))
    into regular_job_count, distinct_minute_count
    from cron.job
   where jobname in (
     'pier-cast-temperature-ingestion',
     'pier-cast-wisconsin-shadow-ingestion',
     'pier-cast-lake-huron-shadow-ingestion',
     'pier-cast-pentwater-caseville-shadow-ingestion',
     'pier-cast-five-city-shadow-ingestion',
     'pier-cast-chicago-alpena-shadow-ingestion',
     'pier-cast-st-joseph-harrisville-shadow-ingestion',
     'pier-cast-v3-shadow-ingestion'
   );

  if regular_job_count <> 8 or distinct_minute_count <> 8 then
    raise exception
      'PierCast regular schedule validation failed: % jobs, % unique minutes',
      regular_job_count,
      distinct_minute_count;
  end if;
end;
$$;

