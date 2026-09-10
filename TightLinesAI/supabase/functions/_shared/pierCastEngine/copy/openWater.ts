export const PIER_CAST_OPEN_WATER_NOTICE =
  "Open-water outlook only. This rating applies only when the covered pier is open, legally accessible, and adjacent water is fishable. PierCast does not assess ice thickness, pier icing, or whether walking onto ice is safe. Verify current access and conditions before going.";

/** Default Great Lakes winter disclosure window; this does not infer ice. */
export function pierCastOpenWaterNoticeApplies(localDate: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) return false;
  return month >= 1 && month <= 3;
}
