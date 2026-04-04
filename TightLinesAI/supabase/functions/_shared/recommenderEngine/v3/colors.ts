import type { ColorThemeIdV3 } from "./contracts.ts";

export const BASE_COLOR_SHADE_POOLS_V3: Record<ColorThemeIdV3, readonly string[]> = {
  natural_baitfish: ["olive/white", "shad", "smoke shad"],
  white_shad: ["white", "pearl", "white/silver"],
  bright_contrast: ["white/chartreuse", "chartreuse/black", "firetiger"],
  dark_contrast: ["black/blue", "black/purple", "black/red"],
  craw_natural: ["brown/orange", "rust brown", "amber brown"],
  green_pumpkin_natural: ["green pumpkin", "green pumpkin blue", "pb&j"],
  watermelon_natural: ["watermelon", "watermelon red", "watermelon candy"],
  perch_bluegill: ["perch", "bluegill", "olive/orange"],
  frog_natural: ["leopard frog", "bullfrog", "black frog"],
  mouse_natural: ["gray mouse", "brown mouse", "black mouse"],
  metal_flash: ["chrome/blue", "gold/black", "silver"],
};

export function selectThemeShadesV3(
  themes: readonly ColorThemeIdV3[],
  overrides: Partial<Record<ColorThemeIdV3, readonly string[]>> = {},
): Partial<Record<ColorThemeIdV3, readonly string[]>> {
  const result: Partial<Record<ColorThemeIdV3, readonly string[]>> = {};
  for (const theme of themes) {
    result[theme] = overrides[theme] ?? BASE_COLOR_SHADE_POOLS_V3[theme];
  }
  return result;
}
