import { ColorServiceError } from "../_shared/colorPickerEngine/serviceSupport.ts";
import type { ReportStore } from "../_shared/colorPickerEngine/reportService.ts";
// Structural boundary lets tests supply the same fluent database API without importing the remote SDK.
export function createReportStore(db: any): ReportStore {
  const checked = (result: any) => { if (result.error?.message === "color request conflict") throw new ColorServiceError("request_conflict", "Use a new request ID for a different report.", 409); if (result.error) throw new Error("Color report storage unavailable"); return result.data; };
  return {
    async byRequest(userId, requestId) { return checked(await db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("request_id", requestId).maybeSingle())?.envelope ?? null; },
    async byDay(userId, typeId, clarity, date) { return checked(await db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("type_id", typeId).eq("clarity", clarity).eq("daily_date", date).maybeSingle())?.envelope ?? null; },
    async byId(userId, reportId) { return checked(await db.from("color_picker_reports").select("envelope").eq("user_id", userId).eq("id", reportId).maybeSingle())?.envelope ?? null; },
    async commit(userId, envelope) { return checked(await db.rpc("commit_color_picker_report", { p_user_id: userId, p_envelope: envelope })); },
  };
}
