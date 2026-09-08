import test from "node:test";
import assert from "node:assert/strict";
import { summarizeWeather, normalizeCloud, fetchColorWeather, ColorServiceError, type WeatherRequest, type WeatherData } from "../weather.ts";
import { createReportService, parseReportRequest, sameReportRequest, type ReportEnvelope, type ReportStore } from "../reportService.ts";
import { createColorPickerEngine } from "../selectionEngine.ts";
import { createColorHandler } from "../../../color-picker/handler.ts";
const epoch = (s: string) => Date.parse(s);
const req: WeatherRequest = { date: "2026-09-05", timezone: "America/Detroit", latitude: 42.3, longitude: -83.1 };
const request = { ...req, requestId: "request_one", typeId: "soft_plastic_worm", clarity: "dirty" };
function data(cloud: unknown = 70): WeatherData {
  return { timezone: req.timezone, unit: "percent", sunrise: epoch("2026-09-05T10:30:00Z"), sunset: epoch("2026-09-05T14:30:00Z"), hours: Array.from({ length: 5 }, (_, i) => ({ start: epoch("2026-09-05T10:00:00Z") + i * 3600000, cloud })) };
}
const code = (c: string) => (e: unknown) => e instanceof ColorServiceError && e.code === c;
test("both conditional light guides are included at every cloud percentage", () => {
  for (const pct of [0, 29.999, 30, 69.999, 70, 70.001, 100]) {
    const w = summarizeWeather(req, data(pct));
    assert.equal(w.meanCloudPercent, pct);
    assert.equal(w.groups.length, 2);
    assert.equal(w.groups[1].label, "Under cloud cover");
  }
  const mixed = data(40); mixed.hours[2].cloud = 90;
  assert.equal(summarizeWeather(req, mixed).groups[1].label, "Under cloud cover");
});
test("partial daylight hours weighted; null and missing values never become clear skies", () => {
  const d = data(100); d.hours[0].cloud = 0; d.hours[4].cloud = 0;
  assert.equal(summarizeWeather(req, d).meanCloudPercent, 75);
  d.hours[2].cloud = null;
  assert.equal(summarizeWeather(req, d).coverage, .75);
  d.hours[3].cloud = null;
  assert.throws(() => summarizeWeather(req, d), code("weather_unavailable"));
  assert.throws(() => summarizeWeather(req, { ...d, hours: [] }), code("weather_unavailable"));
  for (const v of [null, "70", -1, 101, NaN]) assert.equal(normalizeCloud(v, "percent"), null);
  assert.equal(normalizeCloud(.7, "percent"), .7);
  assert.equal(normalizeCloud(.7, "fraction"), 70);
});
test("clips fishing windows to daylight; rejects night-only and no daylight", () => {
  const clipped = summarizeWeather({ ...req, window: { start: "2026-09-05T09:00:00.000Z", end: "2026-09-05T11:00:00.000Z" } }, data());
  assert.equal(clipped.window!.start, "2026-09-05T10:30:00.000Z");
  assert.throws(() => summarizeWeather({ ...req, window: { start: "2026-09-05T03:00:00Z", end: "2026-09-05T04:00:00Z" } }, data()), code("daylight_required"));
  assert.throws(() => summarizeWeather(req, { ...data(), sunset: data().sunrise }), code("daylight_required"));
});
test("DST, non-US dates and half-hour timezones use UTC instants, not fixed offsets", () => {
  for (const [date, timezone, start] of [["2026-03-08", "America/Detroit", "2026-03-08T11:00:00Z"], ["2026-11-01", "America/Detroit", "2026-11-01T12:00:00Z"], ["2026-09-05", "Asia/Kolkata", "2026-09-05T00:30:00Z"], ["2026-09-05", "Pacific/Auckland", "2026-09-04T18:00:00Z"]]) {
    const sunrise = epoch(start), sunset = sunrise + 3600000;
    assert.equal(summarizeWeather({ ...req, date, timezone }, { timezone, sunrise, sunset, unit: "percent", hours: [{ start: sunrise, cloud: 70 }] }).meanCloudPercent, 70);
  }
  const duplicate = data(); duplicate.hours.push(duplicate.hours[0]);
  assert.throws(() => summarizeWeather(req, duplicate), code("weather_unavailable"));
  assert.throws(() => summarizeWeather(req, { ...data(), timezone: "UTC" }), code("weather_unavailable"));
});
test("provider request uses raw epochs, declared percent units and timeout", async () => {
  const payload = { timezone: req.timezone, hourly_units: { cloud_cover: "%" }, hourly: { time: data().hours.map(h => h.start / 1000), cloud_cover: [70,70,70,70,70] }, daily: { sunrise: [data().sunrise / 1000], sunset: [data().sunset / 1000] } };
  const fake: typeof fetch = async url => { const u = new URL(String(url)); assert.equal(u.searchParams.get("timeformat"), "unixtime"); assert.equal(u.searchParams.get("start_date"), req.date); return Response.json(payload); };
  assert.equal((await fetchColorWeather(req, {}, fake)).sunrise, data().sunrise);
  await assert.rejects(() => fetchColorWeather(req, {}, async () => new Response(null, { status: 500 })), code("weather_unavailable"));
  await assert.rejects(() => fetchColorWeather(req, {}, async () => Response.json({ ...payload, hourly_units: {} })), code("weather_unavailable"));
  await assert.rejects(() => fetchColorWeather(req, { timeoutMs: 5 }, async (_, init) => new Promise<Response>((_resolve, reject) => init!.signal!.addEventListener("abort", () => reject(new Error("timeout"))))), code("weather_unavailable"));
});
function fixture() {
  const rows = new Map<string, ReportEnvelope>(); let fetches = 0, ids = 0;
  const store: ReportStore = {
    async byRequest(u, r) { return rows.get(`${u}/${r}`) ?? null; },
    async byDay(u, t, d) { return [...rows.values()].find(r => r.selection.report.userId === u && r.request.typeId === t && r.request.date === d) ?? null; },
    async byId(u, id) { return [...rows.values()].find(r => r.selection.report.userId === u && r.selection.report.reportId === id) ?? null; },
    async history(u, t, c) { return [...rows.values()].map(r => r.selection.report).filter(r => r.userId === u && r.typeId === t && r.clarity === c); },
    async commit(u, r) { const daily = [...rows.values()].find(row => row.selection.report.userId === u && row.request.typeId === r.request.typeId && row.request.date === r.request.date); if (daily) return daily; const key = `${u}/${r.request.requestId}`; if (!rows.has(key)) rows.set(key, structuredClone(r)); return rows.get(key)!; },
  };
  const deps = { store, weather: async () => { fetches++; return data(); }, now: () => new Date("2026-09-05T12:00:00Z"), uuid: () => `00000000-0000-4000-8000-${String(++ids).padStart(12,"0")}`, engine: createColorPickerEngine(() => 0) };
  return { rows, store, deps, count: () => fetches, service: createReportService(deps) };
}
test("durable retries and concurrent commits return one immutable winner", async () => {
  const f = fixture(); const [a,b] = await Promise.all([f.service.generate("u", request), f.service.generate("u", request)]);
  assert.deepEqual(a,b); assert.equal(f.rows.size,1);
  const before = f.count(); assert.deepEqual(await f.service.generate("u", request),a); assert.equal(f.count(),before);
  await assert.rejects(() => f.service.generate("u", { ...request, clarity: "clear" }), code("request_conflict"));
  a.selection.groups[0].choices[0].name = "changed";
  assert.notEqual((await f.service.reopen("u",b.selection.report.reportId)).selection.groups[0].choices[0].name,"changed");
  await assert.rejects(() => f.service.reopen("other",b.selection.report.reportId),code("not_found"));
});
test("weather cannot be user supplied and missing location blocks generation", async () => {
  const f=fixture();
  await assert.rejects(()=>f.service.generate("u", {...request,manualLight:"sunny",daylightConfirmed:true}), code("invalid_input"));
  await assert.rejects(()=>f.service.generate("u", {...request,latitude:null,longitude:null}), code("location_required"));
  assert.equal(f.rows.size,0);
});
test("invalid inputs and provider failure cannot commit a report; old snapshots reopen",async () => {
  const f=fixture();
  for(const patch of [{latitude:"42"},{latitude:NaN},{date:"2026-02-30"},{timezone:"bad/zone"},{typeId:"saltwater"}]) assert.throws(()=>parseReportRequest({...request,...patch}),code("invalid_input"));
  await assert.rejects(()=>f.service.generate("u",{...request,date:"2026-09-12"}),code("invalid_input"));
  const failing=createReportService({...f.deps,weather:async()=>{throw new ColorServiceError("weather_unavailable","offline",422);}});
  await assert.rejects(()=>failing.generate("u",request),code("weather_unavailable")); assert.equal(f.rows.size,0);
  const saved=await f.service.generate("u",request); f.rows.get("u/request_one")!.selection.report.catalogVersion="archived";
  assert.equal((await f.service.reopen("u",saved.selection.report.reportId)).selection.report.catalogVersion,"archived");
  assert(sameReportRequest(parseReportRequest(request),parseReportRequest({...request,userId:"spoofed"})));
});
test("HTTP method, auth, entitlement and authenticated user boundary",async () => {
  const f=fixture(); const call=(handler:ReturnType<typeof createColorHandler>,body:unknown)=>handler(new Request("https://test",{method:"POST",body:JSON.stringify(body)}));
  const good=createColorHandler({service:f.service,authorize:async()=>"real-user"});
  assert.equal((await good(new Request("https://test"))).status,405);
  for(const status of [401,403,429]) {
    const denied=createColorHandler({service:f.service,authorize:async()=>{throw new ColorServiceError("denied","denied",status);}});
    assert.equal((await call(denied,{action:"generate",...request})).status,status);
  }
  assert.equal(f.rows.size,0);
  const response=await call(good,{action:"generate",...request,userId:"fake-user"});
  assert.equal(response.status,200); assert.equal((await response.json()).selection.report.userId,"real-user");
  assert.equal((await call(good,{action:"unknown"})).status,400);
});

 test("timezone aliases resolve without accepting an unrelated timezone", () => {
  const timezone = "US/Eastern";
  assert.equal(summarizeWeather({ ...req, timezone }, { ...data(), timezone: "America/New_York" }).coverage, 1);
});


test("every forecast produces two sun picks and two cloud picks", async () => {
  for (const cloud of [0, 29.999, 30, 69.999, 70, 70.001, 100]) {
    const f = fixture();
    const service = createReportService({ ...f.deps, weather: async () => data(cloud) });
    const report = await service.generate("u", request);
    const lights = ["sunny", "cloudy"];
    assert.deepEqual(report.selection.groups.map(g => g.light), lights);
    assert.equal(report.selection.groups.flatMap(g => g.choices).length, lights.length * 2);
    assert.equal(report.weather.source, "open_meteo");
  }
  for (const typeId of ["stick_worm", "squarebill", "deep_crankbait", "woolly_bugger"]) {
    assert.throws(() => parseReportRequest({ ...request, typeId }), code("invalid_input"));
  }
});


test("daily caching ignores new request IDs, clarity and location; different bait and user get separate reports", async () => {
  const f = fixture();
  const first = await f.service.generate("u", request);
  const count = f.count();
  const same = await f.service.generate("u", { ...request, requestId: "new_request", clarity: "clear", latitude: 43 });
  assert.deepEqual(same, first);
  assert.equal(f.count(), count);
  const [a, b] = await Promise.all([
    f.service.generate("other", { ...request, requestId: "concurrent_a" }),
    f.service.generate("other", { ...request, requestId: "concurrent_b", clarity: "clear" }),
  ]);
  assert.deepEqual(a, b);
  assert.notEqual(a.selection.report.reportId, first.selection.report.reportId);
  const different = await f.service.generate("u", { ...request, requestId: "other_bait", typeId: "crankbait" });
  assert.notEqual(different.selection.report.reportId, first.selection.report.reportId);
});

test("new local day allows a new report; future and past generation are rejected", async () => {
  const f = fixture();
  const first = await f.service.generate("u", request);
  const service = createReportService({ ...f.deps, now: () => new Date("2026-09-06T12:00:00Z"), weather: async () => {
    const d = data(); return { ...d, sunrise: d.sunrise + 86400000, sunset: d.sunset + 86400000, hours: d.hours.map(h => ({ ...h, start: h.start + 86400000 })) };
  } });
  const second = await service.generate("u", { ...request, requestId: "next_day", date: "2026-09-06" });
  assert.notEqual(second.selection.report.reportId, first.selection.report.reportId);
  assert.equal(f.rows.size, 2);
  for (const date of ["2026-09-05", "2026-09-07"]) await assert.rejects(() => service.generate("u", { ...request, requestId: "invalid_day", date }), code("invalid_input"));
});
