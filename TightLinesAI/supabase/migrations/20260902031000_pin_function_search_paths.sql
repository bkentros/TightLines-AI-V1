-- Prevent caller-controlled search_path resolution in public helper functions.
-- PostGIS and pg_trgm routines live in extensions, so keep both trusted schemas.

alter function public.browse_waterbodies_near_point(
  double precision,
  double precision,
  double precision,
  text,
  integer
) set search_path = public, extensions;

alter function public.list_waterbody_counties_for_state(text, integer)
  set search_path = public, extensions;

alter function public.normalize_waterbody_name(text)
  set search_path = public, extensions;

alter function public.set_environment_snapshots_updated_at()
  set search_path = public, extensions;

alter function public.set_forecast_score_snapshots_updated_at()
  set search_path = public, extensions;

alter function public.set_generic_updated_at()
  set search_path = public, extensions;

alter function public.set_river_run_updated_at()
  set search_path = public, extensions;

alter function public.water_reader_generation_error_is_retryable(text)
  set search_path = public, extensions;

notify pgrst, 'reload schema';
