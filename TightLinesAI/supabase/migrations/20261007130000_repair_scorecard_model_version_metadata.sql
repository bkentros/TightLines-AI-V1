-- Repair the private scorecard's superseded COMF 3.6 effective-date tag.
-- This table has no app/public read path. Exact-identity collisions are
-- nevertheless checked defensively before any metadata is changed.
do $$
declare
  v_boundary constant timestamptz := '2024-09-16 15:00:00+00';
  v_before_count bigint;
  v_after_count bigint;
  v_obsolete_before_boundary bigint;
  v_obsolete_count bigint;
  v_collision_count bigint;
  v_matching_collision_count bigint;
  v_mismatch_count bigint;
  v_deleted_count bigint;
  v_relabelled_count bigint;
  v_remaining_obsolete_count bigint;
  v_duplicate_identity_count bigint;
begin
  lock table public.lake_map_temperature_scorecard_samples in share row exclusive mode;

  select count(*) into v_before_count
  from public.lake_map_temperature_scorecard_samples;

  select count(*) into v_obsolete_before_boundary
  from public.lake_map_temperature_scorecard_samples
  where model_version like '%:COMF-3.6:2024-09-09'
    and model_cycle < v_boundary;

  if v_obsolete_before_boundary <> 0 then
    raise exception 'scorecard model-version repair refused: % obsolete rows precede the real model boundary',
      v_obsolete_before_boundary;
  end if;

  select count(*) into v_obsolete_count
  from public.lake_map_temperature_scorecard_samples
  where model_version like '%:COMF-3.6:2024-09-09'
    and model_cycle >= v_boundary;

  create temporary table scorecard_model_version_repair_collisions
    on commit drop as
  select
    obsolete.ctid as obsolete_ctid,
    corrected.ctid as corrected_ctid,
    (
      abs(obsolete.observed_temperature_f - corrected.observed_temperature_f) <= 0.01
      and (
        (obsolete.model_temperature_f is null and corrected.model_temperature_f is null)
        or (
          obsolete.model_temperature_f is not null
          and corrected.model_temperature_f is not null
          and abs(obsolete.model_temperature_f - corrected.model_temperature_f) <= 0.01
        )
      )
    ) as values_match
  from public.lake_map_temperature_scorecard_samples obsolete
  join public.lake_map_temperature_scorecard_samples corrected
    on corrected.station_id = obsolete.station_id
   and corrected.sensor_key = obsolete.sensor_key
   and corrected.observation_time = obsolete.observation_time
   and corrected.model_cycle = obsolete.model_cycle
   and abs(corrected.lead_hours - obsolete.lead_hours) < 0.0001
   and corrected.model_version = regexp_replace(
     obsolete.model_version,
     ':COMF-3[.]6:2024-09-09$',
     ':COMF-3.6:2024-09-16'
   )
  where obsolete.model_version like '%:COMF-3.6:2024-09-09'
    and obsolete.model_cycle >= v_boundary;

  select count(*), count(*) filter (where values_match), count(*) filter (where not values_match)
    into v_collision_count, v_matching_collision_count, v_mismatch_count
  from scorecard_model_version_repair_collisions;

  if v_mismatch_count::numeric / nullif(v_collision_count, 0)::numeric > 0.001 then
    raise exception
      'scorecard model-version repair refused: collision mismatches %/% exceed 0.1 percent',
      v_mismatch_count, v_collision_count;
  end if;

  -- The requested postcondition is zero obsolete tags. Even a sub-threshold
  -- mismatch must remain untouched, so fail the transaction rather than leave
  -- a partially repaired model era behind. The ratio guard above preserves the
  -- explicit 0.1% stop diagnostic.
  if v_mismatch_count <> 0 then
    raise exception
      'scorecard model-version repair refused: % collision mismatches require review',
      v_mismatch_count;
  end if;

  delete from public.lake_map_temperature_scorecard_samples obsolete
  using scorecard_model_version_repair_collisions collision
  where obsolete.ctid = collision.obsolete_ctid
    and collision.values_match;
  get diagnostics v_deleted_count = row_count;

  update public.lake_map_temperature_scorecard_samples obsolete
  set model_version = regexp_replace(
        obsolete.model_version,
        ':COMF-3[.]6:2024-09-09$',
        ':COMF-3.6:2024-09-16'
      ),
      updated_at = timezone('utc', now())
  where obsolete.model_version like '%:COMF-3.6:2024-09-09'
    and obsolete.model_cycle >= v_boundary
    and not exists (
      select 1
      from scorecard_model_version_repair_collisions collision
      where collision.obsolete_ctid = obsolete.ctid
    );
  get diagnostics v_relabelled_count = row_count;

  select count(*) into v_remaining_obsolete_count
  from public.lake_map_temperature_scorecard_samples
  where model_version like '%:COMF-3.6:2024-09-09';

  if v_remaining_obsolete_count <> 0 then
    raise exception
      'scorecard model-version repair refused: obsolete remainder %',
      v_remaining_obsolete_count;
  end if;

  select count(*) into v_after_count
  from public.lake_map_temperature_scorecard_samples;

  if v_after_count <> v_before_count - v_deleted_count then
    raise exception
      'scorecard model-version repair refused: row-count invariant failed before=% deleted=% after=%',
      v_before_count, v_deleted_count, v_after_count;
  end if;

  select count(*) into v_duplicate_identity_count
  from (
    select station_id, sensor_key, observation_time, model_cycle, lead_hours
    from public.lake_map_temperature_scorecard_samples
    group by station_id, sensor_key, observation_time, model_cycle, lead_hours
    having count(*) > 1
  ) duplicates;

  if v_duplicate_identity_count <> 0 then
    raise exception 'scorecard model-version repair refused: % duplicate identities remain',
      v_duplicate_identity_count;
  end if;

  -- Exercise the private summary view inside the same transaction.
  perform 1 from public.lake_map_temperature_scorecard_weekly limit 1;

  raise notice
    'scorecard model-version repair: before=%, obsolete=%, collisions=%, matching=%, mismatches=%, deleted=%, relabelled=%, remaining_obsolete=%, duplicate_identities=%, after=%',
    v_before_count, v_obsolete_count, v_collision_count, v_matching_collision_count,
    v_mismatch_count, v_deleted_count, v_relabelled_count, v_remaining_obsolete_count,
    v_duplicate_identity_count, v_after_count;
end;
$$;
