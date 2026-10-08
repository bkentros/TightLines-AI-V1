export type ProfileLoadError = {
  code?: string | null;
  message?: string | null;
} | null;

export type ProfileLoadAttempt<T> = {
  data: T | null;
  error: ProfileLoadError;
};

export const PROFILE_RETRY_DELAYS_MS = [500, 1_500] as const;

export function isMissingProfileError(error: ProfileLoadError): boolean {
  return Boolean(
    error?.code === 'PGRST116' ||
      (typeof error?.message === 'string' &&
        /0 rows|single.*not found/i.test(error.message)),
  );
}

export async function loadProfileWithRetry<T>(
  load: () => Promise<ProfileLoadAttempt<T>>,
  wait: (milliseconds: number) => Promise<void> = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
): Promise<ProfileLoadAttempt<T>> {
  let result = await load();
  for (const delay of PROFILE_RETRY_DELAYS_MS) {
    if (result.data || !result.error || isMissingProfileError(result.error)) {
      return result;
    }
    await wait(delay);
    result = await load();
  }
  return result;
}
