alter table public.river_run_conditions_suggest_baselines
  drop constraint if exists
    river_run_conditions_suggest_baselines_checkpoint_id_check;

alter table public.river_run_conditions_suggest_baselines
  add constraint river_run_conditions_suggest_baselines_checkpoint_id_check
  check (
    checkpoint_id in (
      'river_start',
      'building_start',
      'building_established',
      'peak_start',
      'peak_complete'
    )
  );
