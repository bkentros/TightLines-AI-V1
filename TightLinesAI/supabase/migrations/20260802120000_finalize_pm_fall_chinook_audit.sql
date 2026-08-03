-- Keep the published PM document and cached snapshots aligned with the final
-- owner-audited copy, Presence classification, and late-tail refresh policy.
-- Push still ends with the October 27 main run; only condition evidence needed
-- by live Fishability remains on the active cadence through November 8.
update public.river_run_config_revisions
   set config_version = '2026-08-02.1',
       document = jsonb_set(
         jsonb_set(
           document,
           '{river,conditionRefreshSchedule,evidenceNotes}',
           to_jsonb(
             'PM condition evidence refreshes every four hours from the configured staging start through the historical-presence tail so Fishability remains current anywhere the feature still describes a seasonal opportunity. Push still starts and stops on its separate main-run window. The protected server job runs 17 minutes after the hour so the newest USGS and PMTU transmissions have time to arrive. Outside that seasonal window, the river refreshes once daily.'::text
           ),
           true
         ),
         '{configVersion}',
         to_jsonb('2026-08-02.1'::text),
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
