import { IPHONE_LAYOUT_PROFILES } from './responsiveAuth';

/** Logical portrait sizes (pt) for common iPhones — used by admin layout preview. */
export type IphoneLayoutPreviewPreset = {
  id: string;
  label: string;
  width: number | null;
  height: number | null;
};

export const IPHONE_LAYOUT_PREVIEW_PRESETS: readonly IphoneLayoutPreviewPreset[] =
  [
    { id: 'off', label: 'Off', width: null, height: null },
    ...IPHONE_LAYOUT_PROFILES.map((p) => ({
      id: p.id,
      label: `${p.label} (${p.width})`,
      width: p.width,
      height: p.height,
    })),
  ] as const;

export function layoutPreviewLabel(width: number): string {
  return IPHONE_LAYOUT_PREVIEW_PRESETS.find((p) => p.width === width)?.label ??
    `${width}pt`;
}
