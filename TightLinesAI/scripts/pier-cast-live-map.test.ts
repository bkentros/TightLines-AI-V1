import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createPierCastMapPass } from "../supabase/functions/_shared/pierCastMapPass.ts";
import {
  createMapAccessHandler,
  MapAccessError,
  PIER_CAST_FREE_MAP_VISITS,
} from "../supabase/functions/pier-cast-map-access/handler.ts";
// @ts-ignore plain JS Worker module (no types)
import { verifyPass } from "../web/lake-map/gate/worker.js";
import {
  isPierCastLiveMapUrlAllowed,
  parsePierCastMapPassResponse,
  PIER_CAST_FREE_MAP_VISITS as APP_FREE_VISITS,
  parsePierCastLiveMapMessage,
  PIER_CAST_LIVE_MAP_ANALYTICS,
  PIER_CAST_LIVE_MAP_DEFAULT_BASE_URL,
  pierCastLiveMapBaseUrl,
  pierCastLiveMapInjection,
  pierCastLiveMapPageUrl,
  pierCastLiveMapPauseScript,
  pierCastLiveMapRenewScript,
} from "../lib/pierCastLiveMap.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const screen = read("app/pier-cast-map.tsx");
const layout = read("app/_layout.tsx");
const page = read("web/lake-map/src/prototype.js");
const pierCastWeather = read("lib/pierCastWeather.ts");
const locationSearch = read("lib/locationSearch.ts");
const openMeteoAdapter = read(
  "supabase/functions/_shared/openMeteo14DayFetch.ts",
);
const getEnvironmentFunction = read(
  "supabase/functions/get-environment/index.ts",
);
const riverRunFunction = read("supabase/functions/river-run/index.ts");
const accessLimitMigration = read(
  "supabase/migrations/20261001130000_harden_pier_cast_map_access_limits.sql",
);
const pkg = JSON.parse(read("package.json"));

test("map page URL: configured https host, else the gatekeeper", () => {
  assert.equal(pierCastLiveMapBaseUrl(undefined), PIER_CAST_LIVE_MAP_DEFAULT_BASE_URL);
  assert.equal(PIER_CAST_LIVE_MAP_DEFAULT_BASE_URL, "https://map.finfindr.app");
  assert.equal(pierCastLiveMapPageUrl("https://map.finfindr.app", "v1.1.a.b"), "https://map.finfindr.app/map/index.html?app=1&t=v1.1.a.b");
  assert.equal(pierCastLiveMapBaseUrl("  https://maps.finfindr.app/ "), "https://maps.finfindr.app");
  assert.equal(pierCastLiveMapBaseUrl("http://insecure.example"), PIER_CAST_LIVE_MAP_DEFAULT_BASE_URL);
  assert.equal(pierCastLiveMapPageUrl("https://maps.finfindr.app"), "https://maps.finfindr.app/map/index.html?app=1");
});

test("app config is injected as data the page cannot break out of", () => {
  const js = pierCastLiveMapInjection({
    units: "metric", species: "steelhead", speciesFromRoute: true, cityId: "ludington_mi", platform: "ios", trial: null, bridge: 1,
  });
  assert.match(js, /^window\.PC_APP = \{.*\}; true;$/);
  assert.doesNotMatch(pierCastLiveMapInjection({
    units: "imperial", species: null, speciesFromRoute: false, cityId: "</script><x>", platform: "ios", trial: { used: 1, allowed: 2 }, bridge: 1,
  }), /<\/script>/);
  assert.equal(pierCastLiveMapPauseScript(true), "window.PC_PAUSE && window.PC_PAUSE(true); true;");
  assert.equal(pierCastLiveMapRenewScript("v1.1.a.b"), 'window.PC_RENEW && window.PC_RENEW("v1.1.a.b"); true;');
});

test("page messages are validated before the app acts on them", () => {
  assert.deepEqual(parsePierCastLiveMapMessage('{"type":"openCity","cityId":"ludington_mi","speciesId":"coho_salmon"}'),
    { type: "openCity", cityId: "ludington_mi", speciesId: "coho_salmon" });
  assert.deepEqual(parsePierCastLiveMapMessage('{"type":"openCity","cityId":"ludington_mi","speciesId":"shark"}'),
    { type: "openCity", cityId: "ludington_mi", speciesId: null });
  assert.equal(parsePierCastLiveMapMessage('{"type":"openCity","cityId":"../../etc"}'), null);
  assert.equal(parsePierCastLiveMapMessage('{"type":"analytics","event":"anything_else"}'), null);
  assert.deepEqual(parsePierCastLiveMapMessage('{"type":"analytics","event":"layer_changed","props":{"layer":"wind","Bad Key":1}}'),
    { type: "analytics", event: "layer_changed", props: { layer: "wind" } });
  assert.deepEqual(parsePierCastLiveMapMessage('{"type":"ready","run":"20260930T06Z-09301322","sample":false}'),
    { type: "ready", run: "20260930T06Z-09301322", sample: false });
  assert.equal(parsePierCastLiveMapMessage("not json"), null);
  assert.equal(parsePierCastLiveMapMessage({ type: "back" }), null);
  for (const name of Object.values(PIER_CAST_LIVE_MAP_ANALYTICS)) assert.match(name, /^pier_cast_live_map_/);
});

test("only the map's own host loads inside the web view", () => {
  const base = "https://map.finfindr.app";
  assert.ok(isPierCastLiveMapUrlAllowed(`${base}/map/index.html?app=1`, base));
  assert.ok(isPierCastLiveMapUrlAllowed("about:blank", base));
  assert.ok(!isPierCastLiveMapUrlAllowed("https://evil.example/map/index.html", base));
});

test("the map screen is the Live Lake Map web view, not the retired native map", () => {
  assert.match(screen, /from "react-native-webview"/);
  assert.doesNotMatch(screen, /@maplibre\/maplibre-react-native/);
  assert.match(screen, /injectedJavaScriptBeforeContentLoaded=\{injection\}/);
  assert.match(screen, /onShouldStartLoadWithRequest/);
  assert.match(screen, /pathname: "\/pier-cast-review"/);
  assert.match(screen, /from: "map"/);
  assert.match(screen, /useFocusEffect/);          // pauses while covered
  assert.match(screen, /AppState\.addEventListener/); // and in the background
  assert.match(screen, /Try again/);
  assert.match(layout, /name="pier-cast-map"[\s\S]{0,200}gestureEnabled: false/);
  assert.equal(pkg.dependencies["react-native-webview"], "13.16.0");
});

test("the page speaks the same bridge", () => {
  for (const type of ["ready", "error", "back", "openCity", "haptic", "analytics"]) {
    assert.match(page, new RegExp(`type: '${type}'`), type);
  }
  for (const event of Object.keys(PIER_CAST_LIVE_MAP_ANALYTICS)) assert.match(page, new RegExp(`'${event}'`), event);
  assert.match(page, /window\.PC_PAUSE =/);
  assert.match(page, /window\.PC_APP/);
});

const SECRET = "s".repeat(64);
const VISIT = "0f8fad5b-d9cb-469f-a165-70867728950e";
function accessHandler(free: boolean, used: string[] = []) {
  const visits = new Set(used);
  return createMapAccessHandler({
    account: async (request) => {
      if (!request.headers.get("x-user-token")) throw new MapAccessError("unauthorized", "Sign in.", 401);
      return { userId: "u1", free };
    },
    claimVisit: async (_user, visitId, allowed) => {
      if (!visits.has(visitId) && visits.size >= allowed) {
        throw new MapAccessError("subscription_required", "Upgrade.", 403);
      }
      visits.add(visitId);
      return visits.size;
    },
    claimPassIssue: async () => {},
    secret: () => SECRET,
  });
}
const ask = (handler: (r: Request) => Promise<Response>, visitId = VISIT, token = "jwt") =>
  handler(new Request("https://x/functions/v1/pier-cast-map-access", {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { "x-user-token": token } : {}) },
    body: JSON.stringify({ visitId }),
  }));

test("server passes open the gatekeeper", async () => {
  const { pass } = await createPierCastMapPass(SECRET);
  assert.ok(await verifyPass(pass, SECRET));
  assert.ok(!(await verifyPass(pass, "t".repeat(64))));
  await assert.rejects(createPierCastMapPass("short"));

  const now = Math.floor(Date.now() / 1000);
  const first = await createPierCastMapPass(SECRET, now, 7200, "account-a");
  const renewed = await createPierCastMapPass(SECRET, now + 1, 7200, "account-a");
  const other = await createPierCastMapPass(SECRET, now, 7200, "account-b");
  assert.equal(first.pass.split(".")[2], renewed.pass.split(".")[2]);
  assert.notEqual(first.pass.split(".")[2], other.pass.split(".")[2]);
  assert.doesNotMatch(first.pass, /account-a/);
});

test("paid accounts always get a pass; free accounts get two visits", async () => {
  assert.equal(PIER_CAST_FREE_MAP_VISITS, 2);
  assert.equal(APP_FREE_VISITS, PIER_CAST_FREE_MAP_VISITS);
  const paid = await (await ask(accessHandler(false, ["a", "b", "c"]))).json();
  assert.equal(paid.access, "subscriber");
  assert.ok(await verifyPass(paid.pass, SECRET));
  assert.ok(parsePierCastMapPassResponse(paid));

  const free = accessHandler(true);
  const first = await (await ask(free)).json();
  assert.equal(first.access, "free_visit");
  assert.equal(first.visitsUsed, 1);
  assert.equal((await (await ask(free)).json()).visitsUsed, 1); // same visit: retry/renewal is free
  const second = await ask(free, "1f8fad5b-d9cb-469f-a165-70867728950e");
  assert.equal((await second.json()).visitsUsed, 2);
  const third = await ask(free, "2f8fad5b-d9cb-469f-a165-70867728950e");
  assert.equal(third.status, 403);
  assert.equal((await third.json()).error, "subscription_required");
});

test("map access refuses bad requests", async () => {
  assert.equal((await ask(accessHandler(false), VISIT, "")).status, 401);
  assert.equal((await ask(accessHandler(false), "not-a-uuid")).status, 400);
  const get = await accessHandler(false)(new Request("https://x/", { method: "GET" }));
  assert.equal(get.status, 405);
  assert.equal(parsePierCastMapPassResponse({ pass: "nope" }), null);

  const limited = createMapAccessHandler({
    account: async () => ({ userId: "u1", free: false }),
    claimVisit: async () => 0,
    claimPassIssue: async () => {
      throw new MapAccessError("rate_limited", "Wait.", 429);
    },
    secret: () => SECRET,
  });
  assert.equal((await ask(limited)).status, 429);
});

test("map access limits are serialized, service-only, and expire old visit IDs", () => {
  assert.match(accessLimitMigration, /pg_advisory_xact_lock/);
  assert.match(accessLimitMigration, /current_count >= p_allowed/);
  assert.match(accessLimitMigration, /interval '6 hours'/);
  assert.match(accessLimitMigration, /map_visit_expired/);
  assert.match(
    accessLimitMigration,
    /revoke all on function public\.claim_pier_cast_map_pass_issue[\s\S]+from public, anon, authenticated/,
  );
  assert.match(
    accessLimitMigration,
    /grant execute on function public\.claim_pier_cast_map_pass_issue[\s\S]+to service_role/,
  );
  assert.doesNotMatch(
    accessLimitMigration,
    /grant execute[^;]+to (?:anon|authenticated)/i,
  );
});

test("the map screen is gated and shows the paywall", () => {
  assert.match(screen, /requestPierCastMapPass\(visitId\.current\)/);
  assert.match(screen, /Crypto\.randomUUID\(\)/);
  assert.match(screen, /subscription_required/);
  assert.match(screen, /<SubscribePrompt/);
  assert.match(screen, /pierCastLiveMapRenewScript/);
  assert.match(page, /window\.PC_RENEW =/);
  assert.match(page, /FREE VISIT/);
  assert.match(page, /history\.replaceState/);
});

test("post-paywall membership fallback is concise, centered, and reopens upgrade", () => {
  assert.match(screen, /Upgrade to Angler Membership to view the Live Lake Map\./);
  assert.match(screen, />Upgrade<\/Text>/);
  assert.doesNotMatch(screen, /Your two free visits have been used/);
  assert.match(screen, /contentContainerStyle=\{\[/);
  assert.match(screen, /flexGrow: 1/);
  assert.match(screen, /maxWidth: 560/);
  assert.match(screen, /style=\{styles\.lockedBackdrop\}/);
  assert.match(screen, /lockedBackdrop:\s*\{[\s\S]+top: 0,[\s\S]+right: 0,[\s\S]+bottom: 0,[\s\S]+left: 0/);
  assert.doesNotMatch(screen, /style=\{StyleSheet\.absoluteFill\}/);
  assert.match(screen, /setPaywall\(true\)/);
  assert.match(screen, /onDismiss=\{\(\) => setPaywall\(false\)\}/);
});

test("visible and Android system back pop the map route instead of WebView history", () => {
  assert.match(screen, /BackHandler\.addEventListener\([\s\S]+"hardwareBackPress"/);
  assert.match(screen, /if \(router\.canGoBack\(\)\) router\.back\(\)/);
  assert.match(screen, /onPress=\{leave\}/);
  assert.doesNotMatch(screen, /goBack\(\)/);
  assert.doesNotMatch(screen, /canGoBack["']\s*:/);
});

test("commercial weather stays behind authenticated paid server adapters", () => {
  assert.match(pierCastWeather, /getEnvironment\(/);
  assert.doesNotMatch(pierCastWeather, /\bfetch\s*\(/);
  assert.doesNotMatch(locationSearch, /\bfetch\s*\(/);
  assert.doesNotMatch(locationSearch, /searchRemoteUsCities/);
  assert.match(openMeteoAdapter, /options\.requirePaid/);
  assert.match(getEnvironmentFunction, /requirePaid: true/);
  assert.match(riverRunFunction, /requirePaid: true/);
  assert.match(getEnvironmentFunction, /weather_fallback:nws/);
  for (const field of [
    "hourly_air_temp_f",
    "hourly_cloud_cover_pct",
    "hourly_wind_speed",
    "hourly_wind_direction_deg",
  ]) {
    assert.match(
      getEnvironmentFunction,
      new RegExp(`nwsFallback\\?\\.${field}`),
      field,
    );
  }
});
