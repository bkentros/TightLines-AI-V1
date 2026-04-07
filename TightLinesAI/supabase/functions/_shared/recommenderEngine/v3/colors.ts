import type { ResolvedColorThemeV3 } from "./contracts.ts";

export const RESOLVED_COLOR_SHADE_POOLS_V3: Record<ResolvedColorThemeV3, readonly string[]> = {
  natural: ["green pumpkin", "olive", "smoke"],
  dark: ["black", "black/blue", "black/purple"],
  bright: ["white/chartreuse", "chartreuse", "firetiger"],
};
