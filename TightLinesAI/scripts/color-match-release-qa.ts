import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path: string) => readFileSync(`${root}${path}`, "utf8");
const screen = read("app/color-picker.tsx");
const report = read("components/fishing/ColorPickerView.tsx");
const engine = read("supabase/functions/_shared/colorPickerEngine/selectionEngine.ts");
const migration = read("supabase/migrations/20260908160000_color_picker_privacy_and_clarity_lock.sql");
const publicCopy = `${screen}\n${report}`;

// The setup and report must use inclusive, customer-facing lure/fly language.
for (const phrase of [
  'label: "LURE / FLY"',
  "STEP 2 · LURE / FLY",
  "CHOOSE ANOTHER LURE / FLY",
  "LURE / FLY",
]) assert(publicCopy.includes(phrase), `Missing release copy: ${phrase}`);
for (const stale of [
  "FINFINDr",
  "BAIT PROFILE",
  "CHOOSE ANOTHER BAIT",
  "STEP 2 · BAIT",
  "Across Changing Light",
  "hard surface glare",
]) assert(!publicCopy.includes(stale), `Stale or misleading public copy: ${stale}`);

// Both lighting plans are always explicit and neither is ranked.
assert(report.includes('"SUNNY / DIRECT LIGHT"'));
assert(report.includes('"CLOUDY / DIFFUSE LIGHT"'));
assert(report.includes("report.selection.groups.map"));
assert(engine.includes('lights: ["sunny", "cloudy"]') || engine.includes("input.lights"));
assert.equal(/\b(best|ranked|winner|guaranteed|guarantee|random(?:ly)?)\b/i.test(publicCopy), false,
  "Outcome, ranking, or randomization language leaked into customer copy");

// Swatches are references, not invented body/accent ratios.
assert(report.includes('colorSample: { flex: 1, height: "100%" }'));
assert(!report.includes("flex: i === 0 ? 3 : 1"));
assert(report.includes('accessibilityRole="image"'));
assert(report.includes("approximate color reference"));

// The selected setup artwork can be blue, but report lure art stays on white.
assert(screen.includes("selectionWash"));
assert(report.includes("artPlate:"));
assert(report.includes("backgroundColor: paper.dashboardWhite"));

// Release reliability: stale local bookmarks recover and ownership is checked.
assert(screen.includes("AsyncStorage.removeItem(`color-picker-last:${userId}`)"));
assert(screen.includes("result.selection.report.userId !== owner.current"));
assert(screen.includes("r.selection.report.userId !== owner.current"));

// Server and database lock the two-by-two report shape and prevent rerolls.
assert(engine.includes("export const COLORS_PER_LIGHT = 2"));
for (const light of ["sunny", "cloudy"]) assert(migration.includes(`'${light}'`));
assert(migration.includes("jsonb_array_length"));
assert(migration.includes("create unique index color_picker_daily_unique"));

console.log(JSON.stringify({
  result: "PASS — Color Match release UI and contract guardrails",
  explicitLightSections: 2,
  choicesPerLight: 2,
  rankedClaims: 0,
  proportionalSwatchClaims: 0,
}, null, 2));
