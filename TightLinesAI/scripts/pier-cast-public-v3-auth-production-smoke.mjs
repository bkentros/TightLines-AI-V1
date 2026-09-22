import assert from 'node:assert/strict';

const base = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !anon || !service) throw new Error('Supabase environment required');

const marker = crypto.randomUUID();
const password = `PierCast-${marker}-A9!`;
const email = `pier-cast-v3-smoke-${marker}@example.com`;
const admin = { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' };
let userId;

async function request(path, headers, body, method = 'POST') {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${base}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const result = { status: response.status, body: await response.json().catch(() => null) };
    if (response.status < 500 || attempt === 2) return result;
    await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
  }
}

try {
  const created = await request('/auth/v1/admin/users', admin, { email, password, email_confirm: true });
  assert.equal(created.status, 200, 'create smoke user');
  userId = created.body.id;
  const profile = await request('/rest/v1/profiles', { ...admin, Prefer: 'resolution=merge-duplicates' }, {
    id: userId,
    username: `pier_v3_${marker.replaceAll('-', '')}`,
    subscription_tier: 'free',
    onboarding_complete: true,
  });
  assert.equal(profile.status, 201, 'create smoke profile');

  const auth = await request('/auth/v1/token?grant_type=password', {
    apikey: anon,
    'Content-Type': 'application/json',
  }, { email, password });
  assert.equal(auth.status, 200, 'authenticate smoke user');
  const headers = {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    'x-user-token': auth.body.access_token,
  };
  const getPier = path => request(`/functions/v1/pier-cast/${path}`, headers, undefined, 'GET');

  const catalog = await getPier('catalog');
  assert.equal(catalog.status, 200);
  assert.equal(catalog.body.formulaVersion, 'piercast-opportunity-modes-bounded-temperature-v3');
  const cities = catalog.body.cities.filter(city => city.releaseStatus === 'public_research');
  assert.equal(cities.length, 32);
  assert.ok(cities.every(city => city.species.length > 0));
  const onboardingCityIds = [
    'two_rivers_wi',
    'kewaunee_wi',
    'algoma_wi',
    'manitowoc_wi',
  ];
  assert.ok(onboardingCityIds.every(cityId => cities.some(city => city.cityId === cityId)));
  const previouslyReleasedCityIds = [
    'waukegan_il',
    'chicago_il',
    'michigan_city_in',
    'muskegon_mi',
    'whitehall_mi',
    'alpena_mi',
  ];
  assert.ok(previouslyReleasedCityIds.every(cityId => cities.some(city => city.cityId === cityId)));
  const newlyReleasedCityIds = [
    'st_joseph_mi',
    'south_haven_mi',
    'holland_mi',
    'lexington_mi',
    'harrisville_mi',
  ];
  assert.ok(newlyReleasedCityIds.every(cityId => cities.some(city => city.cityId === cityId)));
  const latestReleasedCityIds = [
    'pentwater_mi',
    'rogers_city_mi',
    'tawas_city_mi',
    'charlevoix_mi',
    'caseville_mi',
  ];
  assert.ok(latestReleasedCityIds.every(cityId => cities.some(city => city.cityId === cityId)));

  const forbiddenReview = await getPier('review/v3/outlook');
  assert.equal(forbiddenReview.status, 403, 'normal user owner-review access');
  const leaderboard = await getPier('leaderboard');
  assert.equal(leaderboard.status, 200);
  assert.equal(leaderboard.body.cities.length, 32);
  assert.equal(leaderboard.body.releasePolicyVersion, 'piercast-public-v3-2026-09-22-thirty-two-city');
  assert.ok(onboardingCityIds.every(cityId => leaderboard.body.cities.some(city => city.cityId === cityId)));
  assert.ok(previouslyReleasedCityIds.every(cityId => leaderboard.body.cities.some(city => city.cityId === cityId)));
  assert.ok(newlyReleasedCityIds.every(cityId => leaderboard.body.cities.some(city => city.cityId === cityId)));
  assert.ok(latestReleasedCityIds.every(cityId => leaderboard.body.cities.some(city => city.cityId === cityId)));

  for (const city of cities.slice(0, 4)) {
    const report = await getPier(`report?cityId=${city.cityId}`);
    assert.equal(report.status, 200, `free report ${city.cityId}: ${report.body?.error}`);
    assert.equal(report.body.formulaVersion, 'piercast-opportunity-modes-bounded-temperature-v3');
    assert.equal(report.body.cities[0].dates.length, 5);
  }
  const blocked = await getPier(`report?cityId=${cities[4].cityId}`);
  assert.equal(blocked.status, 403, 'fifth distinct free report');
  assert.equal(blocked.body.error, 'subscription_required');
  assert.equal((await getPier(`report?cityId=${cities[0].cityId}`)).status, 200, 'claimed report refresh');

  const upgrade = await request(`/rest/v1/profiles?id=eq.${userId}`, admin, { subscription_tier: 'angler' }, 'PATCH');
  assert.equal(upgrade.status, 204, 'upgrade smoke profile');
  for (const city of cities) {
    const report = await getPier(`report?cityId=${city.cityId}`);
    assert.equal(report.status, 200, `paid report ${city.cityId}: ${report.body?.error}`);
    assert.equal(report.body.cities[0].cityId, city.cityId);
    assert.equal(report.body.cities[0].dates.length, 5);
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log('PASS: live PierCast v3 exposes all 32 cities to a normal user, serves four free reports with a fifth-report paywall and saved refresh, and serves 32 complete paid reports.');
} finally {
  if (userId) {
    const response = await fetch(`${base}/auth/v1/admin/users/${userId}`, { method: 'DELETE', headers: admin });
    assert.equal(response.status, 200, 'delete disposable smoke account');
  }
}
