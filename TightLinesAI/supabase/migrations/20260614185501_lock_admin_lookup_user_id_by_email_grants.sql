-- admin_lookup_user_id_by_email must be callable by service_role only.
--
-- Supabase default privileges auto-grant EXECUTE to anon/authenticated on every
-- new function in schema public. The original migration only did
-- `revoke all ... from public`, which does NOT remove those direct anon/authenticated
-- grants. That left an email -> auth user id enumeration path open over
-- /rest/v1/rpc/admin_lookup_user_id_by_email for anonymous and signed-in users.
-- This locks it back down to the service role used by the admin edge function.

revoke execute on function public.admin_lookup_user_id_by_email(text) from public;
revoke execute on function public.admin_lookup_user_id_by_email(text) from anon;
revoke execute on function public.admin_lookup_user_id_by_email(text) from authenticated;
grant execute on function public.admin_lookup_user_id_by_email(text) to service_role;
