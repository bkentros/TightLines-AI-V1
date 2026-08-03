-- Keep the published database-backed PM configuration aligned with the
-- owner-audited Fall Chinook presence curve. The main run still ends October
-- 27; only the historical seasonal-presence tail extends through November 8.
update public.river_run_config_revisions
   set config_version = '2026-07-30.2',
       document = jsonb_set(
         jsonb_set(
           document,
           '{configVersion}',
           to_jsonb('2026-07-30.2'::text),
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
                     '{runWindow,lateEnd}',
                     to_jsonb('11-08'::text),
                     true
                   ),
                   '{historicalPresence}',
                   '{
                     "maximum": 10,
                     "curveVersion": "pm-fall-chinook-presence-v2",
                     "evidenceNotes": "The PM is a signature Great Lakes Chinook river. The revised curve represents low river presence beginning in mid-August, building through September, holding near its seasonal maximum through the end of September, remaining meaningful deeper into October, and reaching zero on November 8. It is seasonal context, not a live abundance estimate.",
                     "sourceNotes": "Michigan DNR reports Chinook upstream migration beginning in late summer, catchable river numbers by mid-August, and PM adult migration primarily from August through November. Curve anchors remain subject to PM replay and live-season acceptance.",
                     "anchors": [
                       {"dayOffsetFromStart": 0, "fractionOfMaximum": 0.1},
                       {"dayOffsetFromStart": 7, "fractionOfMaximum": 0.25},
                       {"dayOffsetFromStart": 20, "fractionOfMaximum": 0.5},
                       {"dayOffsetFromStart": 36, "fractionOfMaximum": 1},
                       {"dayOffsetFromStart": 46, "fractionOfMaximum": 0.95},
                       {"dayOffsetFromStart": 55, "fractionOfMaximum": 0.7},
                       {"dayOffsetFromStart": 71, "fractionOfMaximum": 0.25},
                       {"dayOffsetFromStart": 85, "fractionOfMaximum": 0}
                     ]
                   }'::jsonb,
                   true
                 ),
                 '{researchNotes}',
                 to_jsonb(
                   'Beta launch hypothesis for PM Fall Chinook. Run Stage begins its pre-run watch July 1, adds nearby-water staging context July 28, starts the river window August 15, uses explicit stage boundaries through an October 27 main-run end, retains a November 8 historical-presence tail, and uses late post-run copy through November 10 before switching to true-offseason guidance November 11. The September 20 peak reference, expanded peak stage, later main-run end, late post-run copy boundary, and presence curve require PM replay and live-season acceptance before runtime public release. Run Timing retains its separately audited final checkpoint five days after the peak reference.'::text
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
