import { PICKER_CHOICES } from "./pickerChoices.ts";

/** User-approved September 8 curation. Exclusion is about this product's concise
 * palette, not physical impossibility. Preserve recipes for immutable old reports. */
export const FAMILIARITY_EXCLUSIONS: Readonly<Record<string, readonly string[]>> = {
  soft_plastic_worm: ["plastic_brown", "plastic_smoke", "plastic_black_blue_tip", "plastic_plum_emerald", "plastic_red_shad"],
  soft_craw: ["plastic_brown", "plastic_black"],
  soft_tube: ["plastic_brown", "plastic_smoke", "plastic_black"],
  curly_tail_grub: ["plastic_brown", "plastic_smoke"],
  soft_jerkbait: ["plastic_black", "plastic_smoke", "plastic_chartreuse"],
  paddle_tail_swimbait: ["plastic_smoke", "plastic_chartreuse"],
  underspin: ["underspin_chartreuse"],
  hard_jerkbait: ["hard_black"],
  hard_swimbait: ["hard_black", "hard_chartreuse_back"],
  spoon: ["metal_black", "metal_white", "metal_chartreuse"],
  topwater: ["hard_firetiger", "hard_chartreuse_back"],
  buzzbait: ["buzz_bluegill"],
  fly_popper: ["popper_yellow_orange"],
};

export function familiarityExclusions(typeId: string): readonly string[] {
  const choice = PICKER_CHOICES.find(c => c.id === typeId || c.poolTypeId === typeId || (c.legacyTypeIds as readonly string[]).includes(typeId));
  return FAMILIARITY_EXCLUSIONS[choice?.id ?? typeId] ?? [];
}
