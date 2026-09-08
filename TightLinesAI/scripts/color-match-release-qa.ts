import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { InvalidColorReportError, parseColorReportEnvelope } from "../lib/colorPickerReport";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path: string) => readFileSync(`${root}${path}`, "utf8");
const screen = read("app/color-picker.tsx");
const report = read("components/fishing/ColorPickerView.tsx");
const engine = read("supabase/functions/_shared/colorPickerEngine/selectionEngine.ts");
const migration = read("supabase/migrations/20260908160000_color_picker_privacy_and_clarity_lock.sql");
const client = read("lib/colorPicker.ts");
const parser = read("lib/colorPickerReport.ts");
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
assert(client.includes("parseColorReportEnvelope(response)"));
assert(parser.includes('groups.length !== 2'));
assert(parser.includes('choices.length !== 2'));
assert(parser.includes('lights.has("sunny")'));
assert(parser.includes('lights.has("cloudy")'));

// Server and database lock the two-by-two report shape and prevent rerolls.
assert(engine.includes("export const COLORS_PER_LIGHT = 2"));
for (const light of ["sunny", "cloudy"]) assert(migration.includes(`'${light}'`));
assert(migration.includes("jsonb_array_length"));
assert(migration.includes("create unique index color_picker_daily_unique"));

const validEnvelope = {
  schemaVersion: 2,
  request: {
    requestId: "request_12345678",
    typeId: "soft_plastic_worm",
    clarity: "clear",
    date: "2026-09-08",
    timezone: "America/Detroit",
  },
  selection: {
    report: {
      schemaVersion: 1,
      reportId: "11111111-1111-4111-8111-111111111111",
      userId: "user-1",
      requestId: "request_12345678",
      generatedAt: "2026-09-08T16:00:00.000Z",
      typeId: "soft_plastic_worm",
      clarity: "clear",
      catalogVersion: "2026-09-08.4",
      selectionVersion: "4.0.0",
      groups: ["sunny", "cloudy"].map(light => ({
        light,
        patternIds: [`${light}-a`, `${light}-b`],
      })),
    },
    sharedAcrossLight: false,
    groups: ["sunny", "cloudy"].map(light => ({
      light,
      poolSize: 4,
      canRotate: false,
      choices: ["a", "b"].map((marker, index) => ({
        patternId: `${light}-${marker}`,
        imageId: `${light}-${marker}-image`,
        name: `${light} pick ${index + 1}`,
        visualDescription: "A valid visual recipe.",
        explanation: "A restrained visibility explanation.",
        swatches: ["#112233", "#AABBCC"],
      })),
    })),
  },
};
assert.equal(parseColorReportEnvelope(validEnvelope), validEnvelope);
for (const mutate of [
  (x: any) => { x.selection.groups = [x.selection.groups[0]]; },
  (x: any) => { x.selection.groups[1].light = "sunny"; },
  (x: any) => { x.selection.groups[0].choices = [x.selection.groups[0].choices[0]]; },
  (x: any) => { x.selection.groups[0].choices[0].swatches = ["not-a-color"]; },
  (x: any) => { x.selection.report.userId = ""; },
  (x: any) => { x.selection.report.requestId = "different-request"; },
  (x: any) => { x.selection.report.groups[0].patternIds.reverse(); },
]) {
  const malformed = structuredClone(validEnvelope);
  mutate(malformed);
  assert.throws(() => parseColorReportEnvelope(malformed), InvalidColorReportError);
}

console.log(JSON.stringify({
  result: "PASS — Color Match release UI and contract guardrails",
  explicitLightSections: 2,
  choicesPerLight: 2,
  rankedClaims: 0,
  proportionalSwatchClaims: 0,
  malformedReportCasesRejected: 7,
}, null, 2));
