-- These indexes match the cycle-first reads used to assemble the coherent
-- 32-city PierCast outlook. Their leading columns also cover the foreign keys
-- flagged by the Supabase performance advisor.
--
-- CONCURRENTLY keeps the live ingest tables writable while the indexes build.
-- This migration must not be wrapped in an explicit transaction.
create index concurrently if not exists pier_cast_expansion_temperature_samples_cycle_idx
  on public.pier_cast_expansion_temperature_samples
    (scope_version, issued_at, city_id, forecast_hour);

create index concurrently if not exists pier_cast_temperature_samples_cycle_idx
  on public.pier_cast_temperature_samples
    (issued_at, city_id, forecast_hour);
