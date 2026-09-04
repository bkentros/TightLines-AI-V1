/**
 * Detects GoTrue / Supabase auth errors where the stored refresh token is no
 * longer valid (user deleted server-side, revocation, etc.). The client must
 * drop the local session without treating it as a generic failure.
 */
export function isRefreshTokenRevokedError(err: unknown): boolean {
  if (err == null) return false;
  const message =
    err instanceof Error
      ? err.message
      : typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          typeof (err as { message: unknown }).message === 'string'
        ? (err as { message: string }).message
        : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes('invalid refresh token') ||
    lower.includes('refresh token not found') ||
    lower.includes('session not found') ||
    lower.includes('user from sub claim in jwt does not exist')
  );
}
