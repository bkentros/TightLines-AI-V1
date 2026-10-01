import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  appUpdateDismissalKey,
  type AppReleasePolicy,
  parseNativeBuildNumber,
  shouldOfferAppUpdate,
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
