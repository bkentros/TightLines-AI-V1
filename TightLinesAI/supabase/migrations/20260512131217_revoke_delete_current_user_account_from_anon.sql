-- Ensures anon cannot invoke account deletion RPC (platform may auto-grant anon).
revoke execute on function public.delete_current_user_account() from anon;
