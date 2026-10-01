import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  appUpdateDismissalKey,
  type AppReleasePolicy,
  isVerifiedStoreUrl,
  parseAppReleasePolicy,
  parseNativeBuildNumber,
  shouldOfferAppUpdate,
  shouldPresentAppUpdate,
  VERIFIED_STORE_URLS,
} from "../lib/appUpdatePolicy.ts";

const policy: AppReleasePolicy = {
  platform: "ios",
  enabled: true,
  latest_build: 42,
  latest_version: "1.15",
  store_url: "https://apps.apple.com/app/id6769178136",
  title: "UPDATE AVAILABLE",
  message: "A newer release is ready.",
};

test("native build parsing accepts only non-negative integer build IDs", () => {
  assert.equal(parseNativeBuildNumber("41"), 41);
  assert.equal(parseNativeBuildNumber(" 0 "), 0);
  for (const value of [null, undefined, "", "1.2", "-1", "abc"]) {
    assert.equal(parseNativeBuildNumber(value), null);
  }
});

test("soft update appears only for a newer enabled build on this platform", () => {
  assert.ok(shouldOfferAppUpdate({
    platform: "ios",
    installedBuild: 41,
    policy,
  }));
  assert.ok(!shouldOfferAppUpdate({
    platform: "ios",
    installedBuild: 42,
    policy,
  }));
  assert.ok(!shouldOfferAppUpdate({
    platform: "android",
    installedBuild: 1,
    policy,
  }));
  assert.ok(!shouldOfferAppUpdate({
    platform: "ios",
    installedBuild: 1,
    policy: { ...policy, enabled: false },
  }));
  assert.ok(!shouldOfferAppUpdate({
    platform: "ios",
    installedBuild: 1,
    policy: { ...policy, store_url: "market://unsafe" },
  }));
});

test("remote policy parsing rejects missing or malformed configuration", () => {
  assert.equal(parseAppReleasePolicy(null, "ios"), null);
  assert.equal(parseAppReleasePolicy({ ...policy, enabled: "true" }, "ios"), null);
  assert.equal(parseAppReleasePolicy({ ...policy, latest_build: "42" }, "ios"), null);
  assert.equal(parseAppReleasePolicy({ ...policy, latest_version: {} }, "ios"), null);
  assert.equal(parseAppReleasePolicy({ ...policy, title: "" }, "ios"), null);
  assert.equal(parseAppReleasePolicy({ ...policy, platform: "android" }, "ios"), null);
  assert.deepEqual(parseAppReleasePolicy(policy, "ios"), policy);
});

test("each native platform accepts only its verified store listing", () => {
  assert.ok(isVerifiedStoreUrl("ios", VERIFIED_STORE_URLS.ios));
  assert.ok(isVerifiedStoreUrl("android", VERIFIED_STORE_URLS.android));
  assert.ok(!isVerifiedStoreUrl("ios", VERIFIED_STORE_URLS.android));
  assert.ok(!isVerifiedStoreUrl("android", VERIFIED_STORE_URLS.ios));
  assert.ok(!isVerifiedStoreUrl("ios", "https://example.com/app/id6769178136"));
  assert.ok(!isVerifiedStoreUrl("android", "market://details?id=com.finseekr.finfindr"));
});

test("dismissal and the in-session guard suppress repeat prompts", () => {
  const base = { platform: "ios" as const, installedBuild: 41, policy };
  assert.ok(shouldPresentAppUpdate({ ...base, dismissed: false, alreadyOfferedThisSession: false }));
  assert.ok(!shouldPresentAppUpdate({ ...base, dismissed: true, alreadyOfferedThisSession: false }));
  assert.ok(!shouldPresentAppUpdate({ ...base, dismissed: false, alreadyOfferedThisSession: true }));
});

test("dismissal is scoped to platform and target build", () => {
  assert.equal(appUpdateDismissalKey("ios", 42), "app-update-dismissed:ios:42");
  assert.notEqual(
    appUpdateDismissalKey("ios", 42),
    appUpdateDismissalKey("android", 42),
  );
  assert.notEqual(
    appUpdateDismissalKey("ios", 42),
    appUpdateDismissalKey("ios", 43),
  );
});

test("release policy is public read-only metadata and starts disabled", () => {
  const sql = readFileSync(
    new URL(
      "../supabase/migrations/20261001140000_create_app_release_policies.sql",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /grant select[^;]+to anon, authenticated/i);
  assert.match(sql, /revoke all[^;]+from public, anon, authenticated/i);
  assert.match(sql, /false,\s*0,/g);
  assert.doesNotMatch(
    sql,
    /grant (?:insert|update|delete)[^;]+to (?:anon|authenticated)/i,
  );
});
