-- Read-only verification for launch_required_safe_patch_20260518.sql.

select
  'app_feedback_table_exists' as check_name,
  (to_regclass('public.app_feedback') is not null)::text as result;

select
  'app_feedback_rls_enabled' as check_name,
  coalesce(c.relrowsecurity, false)::text as result
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'app_feedback';

select
  'smart_log_authenticated_policies_remaining' as check_name,
  count(*)::text as result
from pg_policies
where schemaname = 'public'
  and tablename in ('sessions', 'catches')
  and 'authenticated'::name = any(roles);

select
  'launch_lifecycle_constraints' as check_name,
  count(*)::text as result
from pg_constraint
where conname in (
  'app_feedback_user_id_fkey',
  'water_reader_user_history_user_id_fkey',
  'water_reader_user_active_generation_requests_user_id_fkey',
  'app_feature_rate_limit_buckets_user_id_fkey',
  'waterbody_search_miss_events_user_id_fkey',
  'water_reader_generation_jobs_requested_by_fkey'
);

select
  conname,
  convalidated
from pg_constraint
where conname in (
  'app_feedback_user_id_fkey',
  'water_reader_user_history_user_id_fkey',
  'water_reader_user_active_generation_requests_user_id_fkey',
  'app_feature_rate_limit_buckets_user_id_fkey',
  'waterbody_search_miss_events_user_id_fkey',
  'water_reader_generation_jobs_requested_by_fkey'
)
order by conname;
