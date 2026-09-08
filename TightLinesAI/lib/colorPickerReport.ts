import type { ReportEnvelope } from "./colorPicker";

const record = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
const nonEmptyText = (value: unknown, max = 2000): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;

export class InvalidColorReportError extends Error {
  constructor() {
    super("Color report data was incomplete. Please try again.");
    this.name = "InvalidColorReportError";
  }
}

function invalid(): never {
  throw new InvalidColorReportError();
}
function requireRecord(value: unknown): Record<string, unknown> {
  return record(value) ?? invalid();
}
function requireText(value: unknown, max: number): string {
  return nonEmptyText(value, max) ? value : invalid();
}

/**
 * Validate the network/storage boundary before a report reaches React render.
 * New reports must always contain two distinct picks for both explicit lights.
 * Schema 1 remains accepted only for immutable legacy envelopes with that same
 * safe rendered shape.
 */
export function parseColorReportEnvelope(value: unknown): ReportEnvelope {
  const envelope = requireRecord(value);
  if (envelope.schemaVersion !== 1 && envelope.schemaVersion !== 2) invalid();

  const request = requireRecord(envelope.request);
  const requestId = requireText(request.requestId, 100);
  requireText(request.typeId, 200);
  if (!["clear", "stained", "dirty"].includes(request.clarity as string)) invalid();
  const reportDate = requireText(request.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate) ||
    !Number.isFinite(Date.parse(`${reportDate}T00:00:00Z`))) invalid();
  requireText(request.timezone, 200);

  const selection = requireRecord(envelope.selection);
  const report = requireRecord(selection.report);
  if (report.schemaVersion !== 1) invalid();
  const reportId = requireText(report.reportId, 100);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reportId)) invalid();
  requireText(report.userId, 200);
  if (requireText(report.requestId, 100) !== requestId ||
    requireText(report.typeId, 200) !== request.typeId ||
    report.clarity !== request.clarity ||
    !Number.isFinite(Date.parse(requireText(report.generatedAt, 100))) ||
    !nonEmptyText(report.catalogVersion, 100) ||
    !nonEmptyText(report.selectionVersion, 100) ||
    !Array.isArray(report.groups) || report.groups.length !== 2 ||
    (selection.sharedAcrossLight !== undefined && typeof selection.sharedAcrossLight !== "boolean") ||
    !Array.isArray(selection.groups)) invalid();
  const groups = selection.groups as unknown[];
  if (groups.length !== 2) invalid();

  const lights = new Set<string>();
  for (const rawGroup of groups) {
    const group = requireRecord(rawGroup);
    const light = requireText(group.light, 10);
    if (!["sunny", "cloudy"].includes(light) || lights.has(light) ||
      !Number.isInteger(group.poolSize) || (group.poolSize as number) < 2 ||
      typeof group.canRotate !== "boolean" ||
      !Array.isArray(group.choices)) invalid();
    const choices = group.choices as unknown[];
    if (choices.length !== 2) invalid();
    lights.add(light);

    const patternIds = new Set<string>();
    for (const rawChoice of choices) {
      const choice = requireRecord(rawChoice);
      const patternId = requireText(choice.patternId, 200);
      if (patternIds.has(patternId)) invalid();
      requireText(choice.imageId, 400);
      requireText(choice.name, 300);
      requireText(choice.visualDescription, 3000);
      requireText(choice.explanation, 3000);
      if (choice.swatches !== undefined &&
        (!Array.isArray(choice.swatches) || choice.swatches.length < 1 || choice.swatches.length > 8 ||
          choice.swatches.some(color => typeof color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(color)))) invalid();
      patternIds.add(patternId);
    }
  }
  if (!lights.has("sunny") || !lights.has("cloudy")) invalid();

  const savedLights = new Set<string>();
  for (const rawSavedGroup of report.groups as unknown[]) {
    const savedGroup = requireRecord(rawSavedGroup);
    const light = requireText(savedGroup.light, 10);
    if (!["sunny", "cloudy"].includes(light) || savedLights.has(light) || !Array.isArray(savedGroup.patternIds) ||
      savedGroup.patternIds.length !== 2 || savedGroup.patternIds.some(id => !nonEmptyText(id, 200))) invalid();
    const savedPatternIds = savedGroup.patternIds as string[];
    savedLights.add(light);
    const renderedGroup = groups.map(requireRecord).find(group => group.light === light);
    if (!renderedGroup || !Array.isArray(renderedGroup.choices)) invalid();
    const renderedIds = renderedGroup.choices.map(choice => requireText(requireRecord(choice).patternId, 200));
    if (renderedIds.some((id, index) => id !== savedPatternIds[index])) invalid();
  }
  if (!savedLights.has("sunny") || !savedLights.has("cloudy")) invalid();

  return value as ReportEnvelope;
}
