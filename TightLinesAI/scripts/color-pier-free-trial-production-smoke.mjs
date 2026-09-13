import assert from 'node:assert/strict';
const base = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !anon || !service) throw new Error('Supabase environment required');
const marker = crypto.randomUUID();
const password = `Smoke-${marker}-A9!`;
const email = `color-pier-smoke-${marker}@example.com`;
const admin = { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' };
let userId;
async function request(path, headers, body, method = 'POST') {
  const response = await fetch(`${base}${path}`, { method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: await response.json().catch(() => null) };
}
try {
  const created = await request('/auth/v1/admin/users', admin, { email, password, email_confirm: true });
  assert.equal(created.status, 200, 'create smoke user');
  userId = created.body.id;
  const profile = await request('/rest/v1/profiles', { ...admin, Prefer: 'resolution=merge-duplicates' }, { id: userId, username: `cp_smoke_${marker.replaceAll('-', '')}`, subscription_tier: 'free', onboarding_complete: true });
  assert.equal(profile.status, 201, 'create smoke profile');
  const auth = await request('/auth/v1/token?grant_type=password', { apikey: anon, 'Content-Type': 'application/json' }, { email, password });
  assert.equal(auth.status, 200);
  const headers = { apikey: anon, Authorization: `Bearer ${anon}`, 'x-user-token': auth.body.access_token, 'Content-Type': 'application/json' };
  const color = body => request('/functions/v1/color-picker', headers, body);
  const setup = { action: 'generate', requestId: `first_${marker}`, typeId: 'soft_plastic_worm', clarity: 'dirty', date: new Date().toISOString().slice(0,10), timezone: 'UTC' };
  const first = await color(setup);
  assert.equal(first.status, 200, `first report: ${first.body?.error}`);
  const reportId = first.body.selection.report.reportId;
  assert.equal((await color({ ...setup, requestId: `retry_${marker}` })).body.selection.report.reportId, reportId);
  const second = await color({ ...setup, requestId: `second_${marker}`, clarity: 'clear' });
  assert.equal(second.status, 403);
  assert.equal(second.body.error, 'subscription_required');
  assert.equal((await color({ action: 'saved_trial' })).body.report.selection.report.reportId, reportId);
  assert.equal((await color({ action: 'reopen', reportId })).status, 200);
  const paidSetup = { ...setup, requestId: `paid_${marker}`, clarity: 'clear' };
  const upgrade = await request(`/rest/v1/profiles?id=eq.${userId}`, admin, { subscription_tier: 'angler' }, 'PATCH');
  assert.equal(upgrade.status, 204);
  assert.equal((await color(paidSetup)).status, 200, 'paid generation');
  const downgrade = await request(`/rest/v1/profiles?id=eq.${userId}`, admin, { subscription_tier: 'free' }, 'PATCH');
  assert.equal(downgrade.status, 204);
  assert.equal((await color(paidSetup)).status, 403, 'cached request after downgrade');
  assert.equal((await color({ ...paidSetup, requestId: `cached_day_${marker}` })).status, 403, 'cached daily setup after downgrade');
  const denied = await request('/rest/v1/feature_report_trials', { apikey: anon, Authorization: `Bearer ${auth.body.access_token}` }, undefined, 'GET');
  assert.ok(denied.status >= 400, 'trial records must not be client readable');
  const catalog = await request('/functions/v1/pier-cast/catalog', headers, undefined, 'GET');
  assert.equal(catalog.status, 200);
  assert.equal(catalog.body.cities.length, 0, 'scientific release stays disabled');
  const owner = await request('/functions/v1/pier-cast/review/outlook', headers, undefined, 'GET');
  assert.equal(owner.status, 403);
  const saved = await request('/functions/v1/pier-cast/saved-report', headers, undefined, 'GET');
  assert.deepEqual(saved.body, { report: null });
  console.log('PASS: deployed Color Match lifetime allowance, replay, paywall, saved recovery, client isolation; PierCast private release and owner gates preserved');
} finally {
  if (userId) {
    const response = await fetch(`${base}/auth/v1/admin/users/${userId}`, { method: 'DELETE', headers: admin });
    assert.equal(response.status, 200, 'delete disposable smoke account');
  }
}
