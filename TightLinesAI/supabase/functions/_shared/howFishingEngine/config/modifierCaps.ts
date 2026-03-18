/** Per TEMPERATURE_AND_MODIFIER_REFERENCE — global caps. */
export const MONTH_MODIFIER_CAP = 4;
export const REGION_MODIFIER_CAP = 3;
export const COMBINED_WEIGHT_CAP_FROM_BASE = 5;

export function clampModifierMonth(v: number): number {
  return Math.max(-MONTH_MODIFIER_CAP, Math.min(MONTH_MODIFIER_CAP, v));
}

export function clampModifierRegion(v: number): number {
  return Math.max(-REGION_MODIFIER_CAP, Math.min(REGION_MODIFIER_CAP, v));
}

export function applyFinalWeightClamp(base: number, monthMod: number, regionMod: number): number {
  const m = clampModifierMonth(monthMod);
  const r = clampModifierRegion(regionMod);
  const raw = base + m + r;
  return Math.max(base - COMBINED_WEIGHT_CAP_FROM_BASE, Math.min(base + COMBINED_WEIGHT_CAP_FROM_BASE, raw));
}
