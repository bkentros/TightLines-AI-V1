-- Invalidate cached PM snapshots for the owner-audited second Falling/Peak
-- Presence copy branch. The curve itself remains presence-v2.
update public.river_run_config_revisions
   set config_version = '2026-07-30.3',
       document = jsonb_set(
         document,
         '{configVersion}',
         to_jsonb('2026-07-30.3'::text),
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
