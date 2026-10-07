import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';

import worker, { edgeCacheControl, etagMatches, immutableVersionedRequest } from './worker.js';

const SECRET = 'test-map-secret-that-is-at-least-thirty-two-characters';

function pass() {
  const payload = `v1.${Math.floor(Date.now() / 1000) + 600}.test-account`;
  return `${payload}.${createHmac('sha256', SECRET).update(payload).digest('base64url')}`;
}

function environment(key, cacheControl = 'public, max-age=120') {
  const limits = { ip: 0, account: 0 };
  const object = {
    body: new TextEncoder().encode('{}'),
    httpEtag: '"test-etag"',
    size: 2,
    writeHttpMetadata(headers) {
      headers.set('content-type', key.endsWith('.html') ? 'text/html' : 'application/json');
      headers.set('cache-control', cacheControl);
    },
  };
  return {
    limits,
    env: {
      MAP_PASS_SECRET: SECRET,
      MAP_IP_LIMITER: { limit: async () => { limits.ip += 1; return { success: true }; } },
      MAP_ACCOUNT_LIMITER: { limit: async () => { limits.account += 1; return { success: true }; } },
      BUCKET: { get: async (requested) => requested === key ? object : null },
    },
  };
}

function context() {
  return { waitUntil(promise) { promise.catch(() => {}); } };
}

test('immutable run assets keep HMAC enforcement but skip rate-limit lookups', async () => {
  const { env, limits } = environment('runs/test/manifest.json', 'public, max-age=31536000, immutable');
  const response = await worker.fetch(
    new Request(`https://staging.test/runs/test/manifest.json?t=${encodeURIComponent(pass())}`),
    env, context(),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(limits, { ip: 0, account: 0 });
  assert.match(response.headers.get('server-timing'), /skipped-immutable/);
  assert.equal(response.headers.get('etag'), '"test-etag"');
});

test('mutable pointers and HTML retain rate limits and a consistent 60 second cache', async () => {
  for (const key of ['latest.json', 'map/index.html']) {
    const { env, limits } = environment(key);
    const response = await worker.fetch(
      new Request(`https://staging.test/${key}?t=${encodeURIComponent(pass())}`), env, context(),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(limits, { ip: 1, account: 1 });
    assert.equal(response.headers.get('cache-control'), 'private, max-age=60, must-revalidate');
    assert.match(response.headers.get('server-timing'), /auth;dur=/);
    assert.match(response.headers.get('server-timing'), /limit;dur=/);
  }
});

test('an invalid pass cannot access immutable assets', async () => {
  const { env, limits } = environment('runs/test/manifest.json');
  const response = await worker.fetch(
    new Request('https://staging.test/runs/test/manifest.json?t=invalid'), env, context(),
  );
  assert.equal(response.status, 401);
  assert.deepEqual(limits, { ip: 0, account: 0 });
});

test('edge caching cannot hide a mutable cycle pointer for more than 60 seconds', () => {
  assert.equal(edgeCacheControl('latest.json', false, 'public, max-age=14400'),
    'public, max-age=60, must-revalidate');
  assert.equal(edgeCacheControl('map/index.html', false, 'public, max-age=14400'),
    'public, max-age=60, must-revalidate');
  assert.equal(edgeCacheControl('runs/run/frame.bin', true, null),
    'public, max-age=31536000, immutable');
});

test('only run paths or explicitly hashed static assets skip limiters', () => {
  assert.equal(immutableVersionedRequest(new URL('https://x/runs/run/frame.bin'), 'runs/run/frame.bin'), true);
  assert.equal(immutableVersionedRequest(new URL('https://x/map/app.js?v=abcdef123456'), 'map/app.js'), true);
  assert.equal(immutableVersionedRequest(new URL('https://x/map/app.js'), 'map/app.js'), false);
  assert.equal(immutableVersionedRequest(new URL('https://x/latest.json?v=abcdef123456'), 'latest.json'), false);
});

test('conditional cache requests match strong and weak forms of the same ETag', () => {
  assert.equal(etagMatches(new Request('https://x/latest.json', {
    headers: { 'if-none-match': 'W/"abc"' },
  }), '"abc"'), true);
  assert.equal(etagMatches(new Request('https://x/latest.json', {
    headers: { 'if-none-match': '"other", "abc"' },
  }), 'W/"abc"'), true);
  assert.equal(etagMatches(new Request('https://x/latest.json', {
    headers: { 'if-none-match': '"other"' },
  }), '"abc"'), false);
});
