import { ColorServiceError } from "../_shared/colorPickerEngine/serviceSupport.ts";
import { ColorPickerError } from "../_shared/colorPickerEngine/selectionEngine.ts";
import type { createReportService } from "../_shared/colorPickerEngine/reportService.ts";
export const COLOR_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-user-token",
};
export function createColorHandler(
  deps: {
    authorize: (
      request: Request,
    ) => Promise<
      string | Response | {
        userId: string;
        service: ReturnType<typeof createReportService>;
      }
    >;
    service?: ReturnType<typeof createReportService>;
    savedTrial?: (userId: string) => Promise<unknown>;
  },
) {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        ...COLOR_CORS,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: COLOR_CORS });
    }
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }
    try {
      const authorization = await deps.authorize(request);
      if (authorization instanceof Response) return authorization;
      const user = typeof authorization === "string"
        ? authorization
        : authorization.userId;
      const raw = await request.text();
      if (raw.length > 16384) return json({ error: "request_too_large" }, 413);
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return json({ error: "invalid_json" }, 400);
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ error: "invalid_input" }, 400);
      }
      if (body.action === "saved_trial" && deps.savedTrial) {
        return json(await deps.savedTrial(user));
      }
      const service = typeof authorization === "string"
        ? deps.service!
        : authorization.service;
      if (body.action === "reopen") {
        if (
          typeof body.reportId !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test(body.reportId)
        ) return json({ error: "invalid_report_id" }, 400);
        return json(await service.reopen(user, body.reportId));
      }
      if (body.action !== "generate") {
        return json({ error: "invalid_action" }, 400);
      }
      return json(await service.generate(user, body));
    } catch (error) {
      if (error instanceof ColorServiceError) {
        return json(
          { error: error.code, message: error.message },
          error.status,
        );
      }
      if (error instanceof ColorPickerError) {
        return json(
          { error: error.code, message: error.message },
          error.code === "INVALID_INPUT"
            ? 400
            : error.code === "REQUEST_CONFLICT"
            ? 409
            : 503,
        );
      }
      return json({
        error: "service_unavailable",
        message:
          "Color reports are temporarily unavailable. Retry with the same request ID.",
      }, 503);
    }
  };
}
