-- This index matches the cycle-first expansion reads used to assemble the
-- coherent 32-city PierCast outlook. Its leading columns also cover the
-- foreign key flagged by the Supabase performance advisor.
--
-- CONCURRENTLY keeps the live ingest tables writable while the indexes build.
-- Keep exactly one statement in this migration: Postgres cannot execute two
-- concurrent index builds in the pipeline used by `supabase db push`.
create index concurrently if not exists pier_cast_expansion_temperature_samples_cycle_idx
  on public.pier_cast_expansion_temperature_samples
    (scope_version, issued_at, city_id, forecast_hour);
