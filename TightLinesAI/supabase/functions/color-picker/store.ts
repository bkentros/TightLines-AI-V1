import { ColorServiceError } from "../_shared/colorPickerEngine/weather.ts";
import type { ReportStore, ReportEnvelope } from "../_shared/colorPickerEngine/reportService.ts";
import { RESEARCH_VERSION } from "../_shared/colorPickerEngine/researchMatrix.ts";
import { SELECTION_VERSION } from "../_shared/colorPickerEngine/selectionEngine.ts";
// Structural boundary lets tests supply the same fluent database API without importing the remote SDK.
export function createReportStore(db: any): ReportStore {
  const checked = (result: any) => { if (result.error?.message === "color request conflict") throw new ColorServiceError("request_conflict", "Use a new request ID for a different report.", 409); if (result.error) throw new Error("Color report storage unavailable"); return result.data; };
  return {
    async byRequest(userId, requestId) { return checked(await db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("request_id", requestId).maybeSingle())?.envelope ?? null; },
    async byDay(userId, typeId, date) { return checked(await db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("type_id", typeId).eq("daily_date", date).maybeSingle())?.envelope ?? null; },
    async byId(userId, reportId) { return checked(await db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("id", reportId).maybeSingle())?.envelope ?? null; },
    async history(userId, typeId, clarity) {
      // Query each group separately so sunny-only reports cannot crowd cloudy history out.
      const rows = await Promise.all(["sunny", "cloudy"].map(light => db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("type_id", typeId).eq("clarity", clarity).eq("catalog_version", RESEARCH_VERSION).eq("selection_version", SELECTION_VERSION).contains("lights", [light]).order("created_at", { ascending: false }).order("id").limit(10)));
      return rows.flatMap(result => (checked(result) ?? []).map((r: { envelope: ReportEnvelope }) => r.envelope.selection.report));
    },
    async commit(userId, envelope) { return checked(await db.rpc("commit_color_picker_report", { p_user_id: userId, p_envelope: envelope })) as ReportEnvelope; },
  };
}
