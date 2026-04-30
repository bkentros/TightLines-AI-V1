/** Muted palette for geometry zones (map + cards). Index = stable per candidate order. */
export const WATER_READER_ZONE_PALETTE = [
  { fill: 'rgba(52, 138, 86, 0.48)', stroke: 'rgba(22, 78, 44, 0.88)' },
  { fill: 'rgba(58, 108, 178, 0.46)', stroke: 'rgba(28, 52, 112, 0.88)' },
  { fill: 'rgba(168, 98, 38, 0.44)', stroke: 'rgba(92, 48, 18, 0.86)' },
  { fill: 'rgba(118, 72, 158, 0.44)', stroke: 'rgba(62, 34, 88, 0.86)' },
  { fill: 'rgba(42, 148, 132, 0.46)', stroke: 'rgba(18, 82, 74, 0.88)' },
] as const;

export function zoneColorsForRank(rank: number): { zoneFillRgba: string; zoneStrokeRgba: string } {
  const row = WATER_READER_ZONE_PALETTE[(Math.max(1, rank) - 1) % WATER_READER_ZONE_PALETTE.length]!;
  return { zoneFillRgba: row.fill, zoneStrokeRgba: row.stroke };
}
