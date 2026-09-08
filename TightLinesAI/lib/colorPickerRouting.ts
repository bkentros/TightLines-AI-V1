import { COLOR_PICKER_TAXONOMY } from "../supabase/functions/_shared/colorPickerEngine/taxonomy";
import { PICKER_CHOICES } from "../supabase/functions/_shared/colorPickerEngine/pickerChoices";

// Explicit product decisions: these recommendations already specify their pattern.
const FIXED_PATTERN_ARCHETYPES = new Set(["bluegill_streamer", "mouse_fly", "sculpin_streamer", "sculpzilla", "muddler_sculpin", "crawfish_streamer", "warmwater_crawfish_fly", "frog_fly"]);

/** Only link when the archetype resolves to exactly one supported picker choice. */
export function colorTypeForArchetype(id: string): string | undefined {
  if (FIXED_PATTERN_ARCHETYPES.has(id)) return undefined;
  const mapping = COLOR_PICKER_TAXONOMY.archetypeMappings.find(x => x.archetypeId === id);
  if (!mapping || mapping.disposition === "excluded") return undefined;
  const targets = mapping.disposition === "mapped" ? [mapping.typeId] : mapping.typeIds;
  const choices = targets.map(target => PICKER_CHOICES.find(choice =>
    choice.id === target || (choice.legacyTypeIds as readonly string[]).includes(target)
  )?.id);
  // Former worm and jerkbait subtypes can share one broad choice. Any future
  // mapping spanning different choices must not silently select one of them.
  if (choices.some(choice => !choice)) return undefined;
  return new Set(choices).size === 1 ? choices[0] : undefined;
}
