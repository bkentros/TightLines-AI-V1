/** Keep native intent paths unchanged so Expo Router can handle supported routes. */
export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}): string {
  return path;
}
