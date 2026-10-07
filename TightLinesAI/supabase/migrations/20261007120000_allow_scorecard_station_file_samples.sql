-- Private scorecard only: identify NOAA OFS fixed-station forecast samples.
-- This is additive metadata and has no public/app read path.
alter table public.lake_map_temperature_scorecard_samples
  drop constraint if exists lake_map_temperature_scorecard_samples_sample_method_check;

alter table public.lake_map_temperature_scorecard_samples
  add constraint lake_map_temperature_scorecard_samples_sample_method_check
  check (sample_method in (
    'frozen_verification_site',
    'saved_surface_grid',
    'interpolated_3d',
    'station_file',
    'pending_3d',
    'uncovered'
  ));

comment on column public.lake_map_temperature_scorecard_samples.sample_method is
  'Model sampling provenance. station_file means a NOAA OFS fixed output station within 6 km on the same modeled waterbody.';
