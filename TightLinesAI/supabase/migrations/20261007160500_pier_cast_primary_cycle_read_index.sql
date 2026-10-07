-- This index matches the cycle-first primary reads used to assemble the
-- coherent 32-city PierCast outlook and covers the issued_at foreign key.
--
-- CONCURRENTLY keeps the live ingest table writable while the index builds.
-- Keep exactly one statement in this migration.
create index concurrently if not exists pier_cast_temperature_samples_cycle_idx
  on public.pier_cast_temperature_samples
    (issued_at, city_id, forecast_hour);
