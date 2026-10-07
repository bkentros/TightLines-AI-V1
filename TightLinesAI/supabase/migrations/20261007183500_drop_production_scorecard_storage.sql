-- Scorecard research storage moved permanently to local/private-R2 Parquet.
-- The verified export contains every production row and the legacy workflow
-- and Edge ingest switches remain disabled. This migration intentionally does
-- not alter any app table, grant, RLS policy, or public API response shape.
set lock_timeout = '5s';
set statement_timeout = '5min';

drop view if exists public.lake_map_temperature_scorecard_weekly;
drop function if exists public.commit_lake_map_temperature_scorecard_samples(jsonb);
drop table if exists public.lake_map_temperature_scorecard_samples;

reset statement_timeout;
reset lock_timeout;
