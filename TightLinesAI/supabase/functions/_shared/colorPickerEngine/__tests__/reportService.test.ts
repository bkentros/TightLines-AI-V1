import test from "node:test";
import assert from "node:assert/strict";
import { ColorServiceError, localDate } from "../serviceSupport.ts";
import { createReportService, parseReportRequest, sameReportRequest, type ReportEnvelope, type ReportStore } from "../reportService.ts";
import { createColorPickerEngine } from "../selectionEngine.ts";
import { createColorHandler } from "../../../color-picker/handler.ts";

const request = { requestId: "request_one", typeId: "soft_plastic_worm", clarity: "dirty" as const, date: "2026-09-05", timezone: "America/Detroit" };
const code = (value: string) => (error: unknown) => error instanceof ColorServiceError && error.code === value;

function fixture() {
  const rows = new Map<string, ReportEnvelope>();
  let ids = 0;
  const store: ReportStore = {
    async byRequest(userId, requestId) { return rows.get(`${userId}/${requestId}`) ?? null; },
    async byDay(userId, typeId, clarity, date) {
      return [...rows.values()].find(row => row.selection.report.userId === userId && row.request.typeId === typeId && row.request.clarity === clarity && row.request.date === date) ?? null;
    },
    async byId(userId, reportId) { return [...rows.values()].find(row => row.selection.report.userId === userId && row.selection.report.reportId === reportId) ?? null; },
    async commit(userId, report) {
      const daily = [...rows.values()].find(row => row.selection.report.userId === userId && row.request.typeId === report.request.typeId && row.request.clarity === report.request.clarity && row.request.date === report.request.date);
      if (daily) return daily;
      const key = `${userId}/${report.request.requestId}`;
      if (!rows.has(key)) rows.set(key, structuredClone(report));
      return rows.get(key)!;
    },
  };
  const deps = { store, now: () => new Date("2026-09-05T12:00:00Z"), uuid: () => `00000000-0000-4000-8000-${String(++ids).padStart(12, "0")}`, engine: createColorPickerEngine(() => 0) };
  return { rows, deps, service: createReportService(deps) };
}

test("local dates remain timezone-aware without collecting a location", () => {
  const instant = Date.parse("2026-09-05T02:00:00Z");
  assert.equal(localDate(instant, "America/Detroit"), "2026-09-04");
  assert.equal(localDate(instant, "Asia/Tokyo"), "2026-09-05");
});

test("request contract excludes location and weather", () => {
  assert.deepEqual(parseReportRequest(request), request);
  assert(sameReportRequest(request, { ...request, latitude: 42, longitude: -83, weather: "ignored" }));
  for (const patch of [{ date: "2026-02-30" }, { timezone: "bad/zone" }, { typeId: "saltwater" }, { clarity: "opaque" }]) {
    assert.throws(() => parseReportRequest({ ...request, ...patch }), code("invalid_input"));
  }
});

test("durable retries and concurrent commits return one immutable winner", async () => {
  const f = fixture();
  const [a, b] = await Promise.all([f.service.generate("u", request), f.service.generate("u", request)]);
  assert.deepEqual(a, b);
  assert.equal(f.rows.size, 1);
  assert.equal(a.schemaVersion, 2);
  assert(!("weather" in a) && !("latitude" in a.request) && !("longitude" in a.request));
  await assert.rejects(() => f.service.generate("u", { ...request, typeId: "crankbait" }), code("request_conflict"));
  a.selection.groups[0].choices[0].name = "changed";
  assert.notEqual((await f.service.reopen("u", b.selection.report.reportId)).selection.groups[0].choices[0].name, "changed");
  await assert.rejects(() => f.service.reopen("other", b.selection.report.reportId), code("not_found"));
});

test("daily lock includes clarity while bait and user remain isolated", async () => {
  const f = fixture();
  const dirty = await f.service.generate("u", request);
  const same = await f.service.generate("u", { ...request, requestId: "new_request" });
  assert.deepEqual(same, dirty);
  const clear = await f.service.generate("u", { ...request, requestId: "clear_water", clarity: "clear" });
  const otherBait = await f.service.generate("u", { ...request, requestId: "other_bait", typeId: "crankbait" });
  const otherUser = await f.service.generate("other", request);
  assert.equal(new Set([dirty, clear, otherBait, otherUser].map(x => x.selection.report.reportId)).size, 4);
  assert.equal(f.rows.size, 4);
});

test("only the current local date can generate a new report", async () => {
  const f = fixture();
  await f.service.generate("u", request);
  const next = createReportService({ ...f.deps, now: () => new Date("2026-09-06T12:00:00Z") });
  const second = await next.generate("u", { ...request, requestId: "next_day", date: "2026-09-06" });
  assert.equal(second.request.date, "2026-09-06");
  for (const date of ["2026-09-05", "2026-09-07"]) await assert.rejects(() => next.generate("u", { ...request, requestId: `bad_${date}`, date }), code("invalid_input"));
});

test("HTTP boundaries enforce auth and strict report UUIDs", async () => {
  const f = fixture();
  const call = (handler: ReturnType<typeof createColorHandler>, body: unknown) => handler(new Request("https://test", { method: "POST", body: JSON.stringify(body) }));
  const good = createColorHandler({ service: f.service, authorize: async () => "real-user" });
  assert.equal((await good(new Request("https://test"))).status, 405);
  for (const status of [401, 403, 429]) {
    const denied = createColorHandler({ service: f.service, authorize: async () => { throw new ColorServiceError("denied", "denied", status); } });
    assert.equal((await call(denied, { action: "generate", ...request })).status, status);
  }
  const generated = await call(good, { action: "generate", ...request, userId: "fake-user" });
  assert.equal(generated.status, 200);
  assert.equal((await generated.json()).selection.report.userId, "real-user");
  for (const reportId of ["------------------------------------", "00000000-0000-0000-0000-000000000000", "short"]) {
    assert.equal((await call(good, { action: "reopen", reportId })).status, 400);
  }
});
