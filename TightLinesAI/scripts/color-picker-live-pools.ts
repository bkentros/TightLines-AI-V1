/** Export the current broad-choice matrix for review; historical research stays intact. */
import { writeFileSync } from "node:fs";
import { PICKER_CHOICES } from "../supabase/functions/_shared/colorPickerEngine/pickerChoices.ts";
import { COLOR_PATTERNS } from "../supabase/functions/_shared/colorPickerEngine/colorPatterns.ts";
import { compileResearchMatrix } from "../supabase/functions/_shared/colorPickerEngine/researchMatrix.ts";
const pools = compileResearchMatrix().pools;
const rows = PICKER_CHOICES.flatMap(choice => pools.filter(p => p.typeId === choice.poolTypeId).map(pool => ({
  typeId: choice.id, label: choice.label, reviewedPalette: choice.poolTypeId,
  clarity: pool.clarity, light: pool.light,
  colors: pool.patternIds.map(id => ({ id, name: COLOR_PATTERNS.find(p => p.id === id)!.name })),
})));
writeFileSync(new URL("../docs/color-picker/live_picker_pools.json", import.meta.url), JSON.stringify(rows, null, 2) + "\n");
console.log(JSON.stringify({ choices: PICKER_CHOICES.length, cells: rows.length, minimumPool: Math.min(...rows.map(x => x.colors.length)), exactThree: rows.filter(x => x.colors.length === 3).length }));
