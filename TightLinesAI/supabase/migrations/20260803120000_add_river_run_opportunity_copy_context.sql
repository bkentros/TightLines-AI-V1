-- Keep database-backed River Run configuration and cached deterministic copy
-- aligned with the ceiling-derived opportunity tiers introduced in copy v11.
-- PM Fall Chinook remains a strong, broadly distributed run, so its accepted
-- public wording is unchanged.
update public.river_run_config_revisions
   set config_version = '2026-08-03.1',
       document = jsonb_set(
         jsonb_set(
           document,
           '{configVersion}',
           to_jsonb('2026-08-03.1'::text),
           true
         ),
         '{runs}',
         (
           select jsonb_agg(
             case
               when run_document ->> 'runId' =
                 'pere_marquette_fall_chinook'
               then jsonb_set(
                 run_document,
                 '{historicalPresence,distributionScope}',
                 to_jsonb('broad'::text),
                 true
               )
               else run_document
             end
             order by run_ordinality
           )
             from jsonb_array_elements(document -> 'runs')
               with ordinality as configured_runs(
                 run_document,
                 run_ordinality
               )
         ),
         true
       ),
       updated_at = timezone('utc', now())
 where config_key = 'pere_marquette'
   and status = 'published'
   and jsonb_typeof(document -> 'runs') = 'array'
   and exists (
     select 1
       from jsonb_array_elements(document -> 'runs') as configured_run
      where configured_run ->> 'runId' =
        'pere_marquette_fall_chinook'
   );
