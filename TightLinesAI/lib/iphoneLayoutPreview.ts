/** Logical portrait widths (pt) for common iPhones — used by admin layout preview. */
export type IphoneLayoutPreviewPreset = {
  id: string;
  label: string;
  width: number | null;
};

export const IPHONE_LAYOUT_PREVIEW_PRESETS: readonly IphoneLayoutPreviewPreset[] =
  [
    { id: "off", label: "Off", width: null },
    { id: "se-320", label: "SE 1st (320)", width: 320 },
    { id: "mini-375", label: "SE 2/3 · Mini (375)", width: 375 },
    { id: "std-393", label: "15 · 14 (393)", width: 393 },
    { id: "plus-428", label: "Plus (428)", width: 428 },
    { id: "promax-430", label: "Pro Max (430)", width: 430 },
  ] as const;

export function layoutPreviewLabel(width: number): string {
  return IPHONE_LAYOUT_PREVIEW_PRESETS.find((p) => p.width === width)?.label ??
    `${width}pt`;
}
