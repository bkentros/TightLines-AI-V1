import { ColorServiceError } from "../_shared/colorPickerEngine/weather.ts";
import { ColorPickerError } from "../_shared/colorPickerEngine/selectionEngine.ts";
import type { createReportService } from "../_shared/colorPickerEngine/reportService.ts";
export const COLOR_CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token" };
export function createColorHandler(deps: { authorize: (request: Request) => Promise<string | Response>; service: ReturnType<typeof createReportService> }) {
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...COLOR_CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: COLOR_CORS });
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    try {
      const user = await deps.authorize(request);
      if (user instanceof Response) return user;
      const raw = await request.text();
      if (raw.length > 16384) return json({ error: "request_too_large" }, 413);
      let body;
      try { body = JSON.parse(raw); } catch { return json({ error: "invalid_json" }, 400); }
      if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "invalid_input" }, 400);
      if (body.action === "reopen") {
        if (typeof body.reportId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.reportId)) return json({ error: "invalid_report_id" }, 400);
        return json(await deps.service.reopen(user, body.reportId));
      }
      if (body.action !== "generate") return json({ error: "invalid_action" }, 400);
      return json(await deps.service.generate(user, body));
    } catch (error) {
      if (error instanceof ColorServiceError) return json({ error: error.code, message: error.message }, error.status);
      if (error instanceof ColorPickerError) return json({ error: error.code, message: error.message }, error.code === "INVALID_INPUT" ? 400 : error.code === "REQUEST_CONFLICT" ? 409 : 503);
      return json({ error: "service_unavailable", message: "Color reports are temporarily unavailable. Retry with the same request ID." }, 503);
    }
  };
}
