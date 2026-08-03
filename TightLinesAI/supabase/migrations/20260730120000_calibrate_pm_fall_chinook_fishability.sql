-- Keep the published database-backed PM configuration aligned with the
-- audited local document. Scottville flows from 400 through 499.9 cfs are
-- low but fishable; 500 cfs begins the normal-fishable transition.
update public.river_run_config_revisions
   set config_version = '2026-07-30.1',
       document = jsonb_set(
         jsonb_set(
           document,
           '{configVersion}',
           to_jsonb('2026-07-30.1'::text),
           true
         ),
         '{runs}',
         (
           select jsonb_agg(
             case
               when run_document ->> 'runId' =
                 'pere_marquette_fall_chinook'
               then jsonb_set(
                 jsonb_set(
                   jsonb_set(
                     run_document,
                     '{fishabilityBands,version}',
                     to_jsonb('pm-scottville-fishability-v2'::text),
                     true
                   ),
                   '{fishabilityBands,lowFishable,max}',
                   '500'::jsonb,
                   true
                 ),
                 '{fishabilityBands,evidenceNotes}',
                 to_jsonb(
                   'PM Fall Chinook launch calibration for the lower mainstem represented by Scottville. Modern August 15-October 20 daily means from 2016-2025 (670 days) were approximately p10 416, p25 468, median 536, p75 627, p90 802, p95 1066, and p99 1458 cfs. Configured bands therefore treat below 400 as unusually low, 400-500 as low but fishable, 500-525 as the workable transition, 525-750 as ideal, 750-1000 as high but fishable, 1000-1600 as very high/difficult, and 1600+ as blown out. The 500 cfs transition prevents a below-normal Scottville reading such as 480 cfs from being overstated as Good. These are fishing-shape classifications for this gauge reach, not wading or boating safety thresholds.'::text
                 ),
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
