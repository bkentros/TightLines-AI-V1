alter table public.river_run_condition_refreshes
  drop constraint if exists river_run_condition_refreshes_refresh_slot_check;

alter table public.river_run_condition_refreshes
  add constraint river_run_condition_refreshes_refresh_slot_check
  check (refresh_slot ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

-- Preserve an already-published database-backed PM document when the runtime
-- switches from the original global three-slot cadence to river configuration.
update public.river_run_config_revisions
   set config_version = '2026-07-29.1',
       document = jsonb_set(
         jsonb_set(
           document,
           '{river,conditionRefreshSchedule}',
           '{
             "activeSlots": [
               "00:00",
               "04:00",
               "08:00",
               "12:00",
               "16:00",
               "20:00"
             ],
             "inactiveSlots": ["00:00"],
             "evidenceNotes": "PM condition evidence refreshes every four hours from the configured staging start through the main run end. The protected server job runs shortly after each slot so the newest USGS and PMTU transmissions can arrive. Outside that seasonal window, the river refreshes once daily."
           }'::jsonb,
           true
         ),
         '{configVersion}',
         to_jsonb('2026-07-29.1'::text),
         true
       ),
       updated_at = timezone('utc', now())
 where config_key = 'pere_marquette'
   and status = 'published';

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
    '17 * * * *',
    'select public.invoke_river_run_internal_refresh();'
  );
end;
$$;

comment on function public.invoke_river_run_internal_refresh() is
  'Invokes the protected River Run refresh endpoint shortly after each hour. '
  'Each river/run resolves its own active or inactive local condition slot, '
  'and idempotent storage prevents duplicate provider pulls.';
