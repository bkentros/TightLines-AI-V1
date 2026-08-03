-- Keep the published database-backed PM configuration aligned with the
-- audited local document. This migration changes only Fall Chinook Push:
-- 51-63F is fully supportive, above 63F through 68F is transitional warm.
update public.river_run_config_revisions
   set config_version = '2026-07-29.2',
       document = jsonb_set(
         jsonb_set(
           document,
           '{configVersion}',
           to_jsonb('2026-07-29.2'::text),
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
                     '{push,version}',
                     to_jsonb('pm-fall-chinook-push-v5'::text),
                     true
                   ),
                   '{push,temperature,supportiveMaxF}',
                   '63'::jsonb,
                   true
                 ),
                 '{push,evidenceNotes}',
                 to_jsonb(
                   'Scottville 2016-2025 staging-through-late-window daily means place positive daily rises near 23/3.8% at the median, 47/7.6% at p75, and 83/13.3% at p90; rounded paired absolute/relative thresholds prevent small-base percentage spikes. PM Maple 2021-2025 daily medians show 72-hour cooling near -2.5F at p25 and -5.5F at p05. The fully supportive temperature band ends at 63F so water in the mid-to-upper 60s remains usable but receives the more conservative transitional-warm treatment. Rain is precursor-only and loses independent credit once Scottville shows a meaningful response.'::text
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
