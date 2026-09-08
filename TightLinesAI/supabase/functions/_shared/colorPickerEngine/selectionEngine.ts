import { explainColorVisibility } from "./visibilityExplanation.ts";
import { PICKER_CHOICES } from "./pickerChoices.ts";
import { COLOR_PICKER_TAXONOMY } from "./taxonomy.ts";
import { COLOR_PATTERNS } from "./colorPatterns.ts";
import { compileResearchMatrix, RESEARCH_VERSION } from "./researchMatrix.ts";
import { CLARITIES, LIGHT_STATES, type Clarity, type LightState, type ColorPattern } from "./researchSchema.ts";

export const SELECTION_VERSION = "4.0.0";
export const COLORS_PER_LIGHT = 2;
export type EngineErrorCode = "INVALID_INPUT" | "INVALID_CATALOG" | "INVALID_RANDOM" | "INVALID_REPORT" | "VERSION_MISMATCH" | "REQUEST_CONFLICT";
export class ColorPickerError extends Error {
  constructor(public readonly code: EngineErrorCode, message: string) { super(message); this.name = "ColorPickerError"; }
}
export interface DrawInput {
  userId: string;
  requestId: string;
  reportId: string;
  generatedAt: string;
  typeId: string;
  clarity: Clarity;
  /** The report service always requests both conditional light states. */
  lights: LightState[];
}
export interface SavedColorReport extends Omit<DrawInput, "lights"> {
  schemaVersion: 1;
  catalogVersion: string;
  selectionVersion: string;
  groups: { light: LightState; patternIds: string[] }[];
}
export interface ColorChoice {
  patternId: string;
  name: string;
  visualDescription: string;
  explanation: string;
  /** Asset requirement, not a promise that the PNG already exists. */
  imageId: string;
  swatches: string[];
}
export interface SelectionResult {
  report: SavedColorReport;
  /** Identical reviewed pools are presented once instead of implying a light distinction. */
  sharedAcrossLight: boolean;
  groups: { light: LightState; choices: ColorChoice[]; poolSize: number; canRotate: boolean }[];
}
/** Returns a uniformly distributed integer in [0, exclusiveMax). */
export type RandomInt = (exclusiveMax: number) => number;
export const secureRandomInt: RandomInt = (max) => {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) throw new ColorPickerError("INVALID_RANDOM", "Invalid random range.");
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do { globalThis.crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
  return buffer[0] % max;
};
const fail = (code: EngineErrorCode, message: string): never => { throw new ColorPickerError(code, message); };
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fail("INVALID_INPUT", "Expected an object.");
  return value as Record<string, unknown>;
};
const text = (value: unknown, field: string): string => {
  if (typeof value !== "string" || !value.trim() || value !== value.trim() || value.length > 200) return fail("INVALID_INPUT", `Invalid ${field}.`);
  return value;
};
const date = (value: unknown): string => {
  const result = text(value, "generatedAt");
  const timestamp = Date.parse(result);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString() !== result) return fail("INVALID_INPUT", "generatedAt must be a canonical UTC ISO timestamp.");
  return result;
};
const lights = (value: unknown): LightState[] => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 2 || new Set(value).size !== value.length || value.some(x => !LIGHT_STATES.includes(x))) return fail("INVALID_INPUT", "Invalid light groups.");
  return LIGHT_STATES.filter(x => value.includes(x));
};
const clone = <T>(value: T): T => structuredClone(value);
const samePatternPool = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every(id => b.includes(id));

/** No IO, clock reads, writes or rerolls during replay. Callers supply saved history. */
export function createColorPickerEngine(random: RandomInt = secureRandomInt) {
  const types = new Map(COLOR_PICKER_TAXONOMY.baitTypes.map(x => [x.id, x]));
  const patterns = new Map<string, ColorPattern>(COLOR_PATTERNS.map(x => [x.id, clone(x)]));
  let compiled: ReturnType<typeof compileResearchMatrix>;
  try { compiled = compileResearchMatrix(); } catch { return fail("INVALID_CATALOG", "Color catalog is unavailable; do not substitute another bait's colors."); }
  const cells = new Map(compiled.pools.map(x => [`${x.typeId}/${x.clarity}/${x.light}`, clone(x)]));
  const getPool = (type: string, clarity: Clarity, light: LightState) => {
    const poolType = PICKER_CHOICES.find(x => x.id === type)?.poolTypeId ?? type;
    const cell = cells.get(`${poolType}/${clarity}/${light}`);
    if (!cell || cell.patternIds.length < COLORS_PER_LIGHT || cell.patternIds.some(id => !patterns.has(id))) return fail("INVALID_CATALOG", "Missing reviewed color pool.");
    return cell;
  };
  function parseInput(value: unknown): DrawInput {
    const x = object(value);
    const typeId = text(x.typeId, "bait type");
    if (!types.has(typeId) && !PICKER_CHOICES.some(x => x.id === typeId)) return fail("INVALID_INPUT", "Unknown bait type.");
    if (!CLARITIES.includes(x.clarity as Clarity)) return fail("INVALID_INPUT", "Unknown water clarity.");
    return { userId: text(x.userId, "userId"), requestId: text(x.requestId, "requestId"), reportId: text(x.reportId, "reportId"), generatedAt: date(x.generatedAt), typeId, clarity: x.clarity as Clarity, lights: lights(x.lights) };
  }
  function parseReport(value: unknown): SavedColorReport {
    try {
      const x = object(value);
      if (x.schemaVersion !== 1 || x.catalogVersion !== RESEARCH_VERSION || x.selectionVersion !== SELECTION_VERSION) return fail("VERSION_MISMATCH", "Use the saved report's catalog and selection version to replay it.");
      if (!Array.isArray(x.groups)) return fail("INVALID_REPORT", "Missing saved groups.");
      const input = parseInput({ ...x, lights: x.groups.map(g => object(g).light) });
      const groups = input.lights.map(light => {
        const g = object((x.groups as unknown[]).find(g => object(g).light === light));
        const pool = getPool(input.typeId, input.clarity, light);
        if (!Array.isArray(g.patternIds) || g.patternIds.length !== COLORS_PER_LIGHT || new Set(g.patternIds).size !== COLORS_PER_LIGHT || g.patternIds.some(id => typeof id !== "string" || !pool.patternIds.includes(id))) return fail("INVALID_REPORT", "Saved colors do not match the selected condition pool.");
        return { light, patternIds: [...g.patternIds] as string[] };
      });
      const { lights: _, ...fields } = input;
      return { ...fields, schemaVersion: 1, catalogVersion: RESEARCH_VERSION, selectionVersion: SELECTION_VERSION, groups };
    } catch (error) {
      if (error instanceof ColorPickerError && error.code === "INVALID_INPUT") return fail("INVALID_REPORT", error.message);
      throw error;
    }
  }
  function render(report: SavedColorReport): SelectionResult {
    const renderedPools = report.groups.map(group => getPool(report.typeId, report.clarity, group.light));
    const sharedAcrossLight = renderedPools.length === 2 &&
      samePatternPool(renderedPools[0].patternIds, renderedPools[1].patternIds);
    return { report: clone(report), sharedAcrossLight, groups: report.groups.map((group, index) => {
      const pool = renderedPools[index];
      return { light: group.light, poolSize: pool.patternIds.length, canRotate: false,
        choices: group.patternIds.map(patternId => {
          const pattern = patterns.get(patternId)!;
          return { patternId, name: pattern.name, visualDescription: pattern.visualDescription,
            explanation: explainColorVisibility(pattern, report.clarity, sharedAcrossLight ? "shared" : group.light, report.typeId),
            swatches: [...pattern.swatches],
            imageId: `${report.typeId}__${patternId}` };
        }) };
    }) };
  }
  function shuffle<T>(values: readonly T[]): T[] {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = random(i + 1);
      if (!Number.isInteger(j) || j < 0 || j > i) return fail("INVALID_RANDOM", "Random source returned an out-of-range index.");
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function replay(value: unknown, userId: string): SelectionResult {
    const report = parseReport(value);
    if (report.userId !== text(userId, "userId")) return fail("INVALID_REPORT", "Saved report belongs to another user.");
    return render(report);
  }
  function draw(value: unknown, options: { history?: readonly SavedColorReport[]; retryReport?: SavedColorReport } = {}): SelectionResult {
    const input = parseInput(value);
    const sameRequest = (r: SavedColorReport) => r.userId === input.userId && r.requestId === input.requestId;
    // A persisted retry takes precedence and consumes no randomness or history.
    const previous = options.retryReport ?? options.history?.find(sameRequest);
    if (previous) {
      const report = parseReport(previous);
      if (!sameRequest(report) || report.typeId !== input.typeId || report.clarity !== input.clarity || JSON.stringify(report.groups.map(g => g.light)) !== JSON.stringify(input.lights)) return fail("REQUEST_CONFLICT", "Request key already belongs to a different selection.");
      return render(report);
    }
    const selectedPools = input.lights.map(light => getPool(input.typeId, input.clarity, light));
    // Sample each condition independently. Avoiding cross-condition repeats biases
    // marginal color probabilities whenever the two reviewed pools overlap.
    const first = shuffle(selectedPools[0].patternIds).slice(0, COLORS_PER_LIGHT);
    const sharedAcrossLight = selectedPools.length === 2 &&
      samePatternPool(selectedPools[0].patternIds, selectedPools[1].patternIds);
    const selected = selectedPools.map((pool, index) =>
      sharedAcrossLight && index > 0 ? [...first] : index === 0 ? first : shuffle(pool.patternIds).slice(0, COLORS_PER_LIGHT)
    );
    const groups = input.lights.map((light, i) => ({ light, patternIds: selected[i] }));
    const { lights: _, ...fields } = input;
    return render({ ...fields, schemaVersion: 1, catalogVersion: RESEARCH_VERSION, selectionVersion: SELECTION_VERSION, groups });
  }
  return { draw, replay };
}
