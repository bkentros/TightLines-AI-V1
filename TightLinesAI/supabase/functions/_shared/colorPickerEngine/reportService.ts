import { createColorPickerEngine, type SelectionResult } from "./selectionEngine.ts";
import { PICKER_CHOICES } from "./pickerChoices.ts";
import { ColorServiceError, localDate } from "./serviceSupport.ts";
import type { Clarity } from "./researchSchema.ts";
export interface ReportRequest {
  requestId: string; typeId: string; clarity: Clarity; date: string; timezone: string;
}
export interface ReportEnvelope {
  schemaVersion: 2;
  request: ReportRequest;
  selection: SelectionResult;
}
export interface ReportStore {
  byRequest(userId: string, requestId: string): Promise<ReportEnvelope | null>;
  byDay(userId: string, typeId: string, clarity: Clarity, date: string): Promise<ReportEnvelope | null>;
  byId(userId: string, reportId: string): Promise<ReportEnvelope | null>;
  /** Atomic insert-or-return-winner; reject a reused key whose request differs. */
  commit(userId: string, report: ReportEnvelope): Promise<ReportEnvelope>;
}
function invalid(message: string): never { throw new ColorServiceError("invalid_input", message); }
export function parseReportRequest(value: unknown): ReportRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid("Expected a report request.");
  const x = value as Record<string, unknown>;
  if (typeof x.requestId !== "string" || !/^[A-Za-z0-9_-]{8,100}$/.test(x.requestId)) return invalid("Invalid request ID.");
  if (typeof x.typeId !== "string" || !PICKER_CHOICES.some(t => t.id === x.typeId)) return invalid("Unknown bait type.");
  if (!["clear", "stained", "dirty"].includes(x.clarity as string)) return invalid("Unknown clarity.");
  if (typeof x.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || !Number.isFinite(Date.parse(x.date)) || new Date(x.date).toISOString().slice(0, 10) !== x.date) return invalid("Invalid local date.");
  if (typeof x.timezone !== "string") return invalid("Device timezone required.");
  try { localDate(0, x.timezone); } catch { return invalid("Invalid IANA timezone."); }
  return { requestId: x.requestId, typeId: x.typeId, clarity: x.clarity as Clarity, date: x.date, timezone: x.timezone };
}
export function sameReportRequest(a: ReportRequest, b: ReportRequest): boolean { return JSON.stringify(parseReportRequest(a)) === JSON.stringify(parseReportRequest(b)); }
export function createReportService(deps: { store: ReportStore; now?: () => Date; uuid?: () => string; engine?: ReturnType<typeof createColorPickerEngine> }) {
  const engine = deps.engine ?? createColorPickerEngine();
  const now = deps.now ?? (() => new Date());
  const uuid = deps.uuid ?? (() => crypto.randomUUID());
  return {
    async reopen(userId: string, reportId: string) {
      const saved = await deps.store.byId(userId, reportId);
      if (!saved || saved.selection.report.userId !== userId) throw new ColorServiceError("not_found", "Report not found.", 404);
      // Immutable rendered snapshot supports old catalog versions without reinterpreting choices.
      return structuredClone(saved);
    },
    async generate(userId: string, value: unknown): Promise<ReportEnvelope> {
      const request = parseReportRequest(value);
      const existing = await deps.store.byRequest(userId, request.requestId);
      if (existing) {
        if (!sameReportRequest(existing.request, request)) throw new ColorServiceError("request_conflict", "Use a new request ID for a different report.", 409);
        return structuredClone(existing);
      }
      const instant = now();
      const today = localDate(instant.getTime(), request.timezone);
      const dayDiff = (Date.parse(request.date) - Date.parse(today)) / 86400000;
      if (dayDiff !== 0) return invalid("New color reports are available for today only.");
      // Request IDs and devices cannot reroll the same bait/clarity/day setup.
      const daily = await deps.store.byDay(userId, request.typeId, request.clarity, today);
      if (daily) return structuredClone(daily);
      const selection = engine.draw({ userId, requestId: request.requestId, reportId: uuid(), generatedAt: instant.toISOString(), typeId: request.typeId, clarity: request.clarity, lights: ["sunny", "cloudy"] });
      const winner = await deps.store.commit(userId, { schemaVersion: 2, request, selection });
      if (winner.selection.report.userId !== userId || winner.request.typeId !== request.typeId || winner.request.clarity !== request.clarity || winner.request.date !== request.date) throw new Error("Invalid daily color report winner");
      return structuredClone(winner);
    },
  };
}
