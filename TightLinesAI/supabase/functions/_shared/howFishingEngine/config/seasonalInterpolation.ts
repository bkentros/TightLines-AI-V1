/** Monthly calibration anchors are centered on the 15th, joined across actual calendar days. */
export function seasonalBracket(
  localDate: string,
): { from: number; to: number; fraction: number } {
  const [year, month, day] = localDate.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("Seasonal calibration requires an ISO local date");
  }
  const current = Date.UTC(year, month - 1, day);
  const before = day < 15
    ? Date.UTC(year, month - 2, 15)
    : Date.UTC(year, month - 1, 15);
  const after = day < 15
    ? Date.UTC(year, month - 1, 15)
    : Date.UTC(year, month, 15);
  return {
    from: new Date(before).getUTCMonth() + 1,
    to: new Date(after).getUTCMonth() + 1,
    fraction: (current - before) / (after - before),
  };
}
export function seasonalValue(
  localDate: string,
  value: (month: number) => number,
): number {
  const { from, to, fraction } = seasonalBracket(localDate);
  const a = value(from);
  return a + (value(to) - a) * fraction;
}
