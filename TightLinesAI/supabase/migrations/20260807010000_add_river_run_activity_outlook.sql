alter table public.river_run_condition_refreshes
  add column if not exists activity jsonb;

alter table public.river_run_condition_refreshes
  drop constraint if exists river_run_condition_refreshes_refresh_slot_check;

alter table public.river_run_condition_refreshes
  add constraint river_run_condition_refreshes_refresh_slot_check
  check (refresh_slot ~ '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');
