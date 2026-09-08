import { COLOR_PICKER_TAXONOMY } from "../supabase/functions/_shared/colorPickerEngine/taxonomy";
import { PICKER_CHOICES } from "../supabase/functions/_shared/colorPickerEngine/pickerChoices";
import { COLOR_PICKER_IMAGES, COLOR_PICKER_THUMBNAILS } from "./colorPickerImages";
export const colorPickerCatalog = {
  categories: [
    { id: "soft_plastics", label: "Soft plastics" },
    { id: "jigs_spinners", label: "Jigs & spinners" },
    { id: "hard_baits", label: "Hard baits" },
    { id: "metal_baits", label: "Spoons" },
    { id: "flies", label: "Flies" },
  ],
  baitTypes: PICKER_CHOICES,
};
export function colorTypeImage(typeId: string) {
  const currentId = colorChoiceForType(typeId)?.id ?? typeId;
  return COLOR_PICKER_IMAGES[currentId] ?? null;
}
export function colorTypeThumbnail(typeId: string) {
  const currentId = colorChoiceForType(typeId)?.id ?? typeId;
  return COLOR_PICKER_THUMBNAILS[currentId] ?? null;
}
export { colorTypeForArchetype } from "./colorPickerRouting";

/** Saved subtype reports keep their snapshot; editing starts from the current broad choice. */
export function colorChoiceForType(typeId: string) {
  return PICKER_CHOICES.find((x) => x.id === typeId) ??
    PICKER_CHOICES.find((x) =>
      (x.legacyTypeIds as readonly string[]).includes(typeId)
    );
}
export function colorTypeLabel(typeId: string) {
  return colorChoiceForType(typeId)?.label ??
    COLOR_PICKER_TAXONOMY.baitTypes.find((x) => x.id === typeId)?.label ??
    typeId;
}
