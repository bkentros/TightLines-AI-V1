-- Close explicit Data API grants that remain after revoking from PUBLIC.
-- Supabase projects can grant EXECUTE directly to anon/authenticated when a
-- function is created, so server-only functions must revoke all three roles.

-- Server-only Water Reader queue and geometry operations.
revoke execute on function public.begin_water_reader_generation_request(uuid, uuid, text, integer, text, integer, integer)
  from public, anon, authenticated;
revoke execute on function public.cancel_water_reader_generation_job(uuid, text)
  from public, anon, authenticated;
revoke execute on function public.claim_water_reader_generation_job(text, interval)
  from public, anon, authenticated;
revoke execute on function public.clear_water_reader_user_active_generation_request(uuid, uuid, uuid, text, integer, text)
  from public, anon, authenticated;
revoke execute on function public.ensure_water_reader_generation_job(uuid, text, integer, text, uuid, integer)
  from public, anon, authenticated;
revoke execute on function public.get_waterbody_polygon_for_reader(uuid)
  from public, anon, authenticated;
revoke execute on function public.mark_water_reader_generation_job_complete(uuid)
  from public, anon, authenticated;
revoke execute on function public.mark_water_reader_generation_job_failed(uuid, text, integer)
  from public, anon, authenticated;
revoke execute on function public.requeue_stale_water_reader_generation_jobs(interval)
  from public, anon, authenticated;
revoke execute on function public.requeue_water_reader_generation_job(uuid, text)
  from public, anon, authenticated;
revoke execute on function public.water_reader_generation_error_is_retryable(text)
  from public, anon, authenticated;

grant execute on function public.begin_water_reader_generation_request(uuid, uuid, text, integer, text, integer, integer)
  to service_role;
grant execute on function public.cancel_water_reader_generation_job(uuid, text)
  to service_role;
grant execute on function public.claim_water_reader_generation_job(text, interval)
  to service_role;
grant execute on function public.clear_water_reader_user_active_generation_request(uuid, uuid, uuid, text, integer, text)
  to service_role;
grant execute on function public.ensure_water_reader_generation_job(uuid, text, integer, text, uuid, integer)
  to service_role;
grant execute on function public.get_waterbody_polygon_for_reader(uuid)
  to service_role;
grant execute on function public.mark_water_reader_generation_job_complete(uuid)
  to service_role;
grant execute on function public.mark_water_reader_generation_job_failed(uuid, text, integer)
  to service_role;
grant execute on function public.requeue_stale_water_reader_generation_jobs(interval)
  to service_role;
grant execute on function public.requeue_water_reader_generation_job(uuid, text)
  to service_role;
grant execute on function public.water_reader_generation_error_is_retryable(text)
  to service_role;

-- Internal scheduled/backend operations.
revoke execute on function public.consume_app_feature_rate_limit(uuid, text, integer, integer, timestamptz)
  from public, anon, authenticated;
revoke execute on function public.invoke_river_run_internal_refresh()
  from public, anon, authenticated;
revoke execute on function public.handle_updated_at()
  from public, anon, authenticated;

grant execute on function public.consume_app_feature_rate_limit(uuid, text, integer, integer, timestamptz)
  to service_role;
grant execute on function public.invoke_river_run_internal_refresh()
  to service_role;

-- These helpers are intentionally used by authenticated clients/RLS policies,
-- but must never be callable with the anonymous API role.
revoke execute on function public.auth_creator_ids()
  from public, anon;
revoke execute on function public.is_finfindr_creator_admin()
  from public, anon;
revoke execute on function public.is_username_available(text, uuid)
  from public, anon;

grant execute on function public.auth_creator_ids()
  to authenticated;
grant execute on function public.is_finfindr_creator_admin()
  to authenticated;
grant execute on function public.is_username_available(text, uuid)
  to authenticated;

-- Make future public-schema function exposure opt-in. Migrations that create a
-- client RPC must grant its intended role explicitly.
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

notify pgrst, 'reload schema';
