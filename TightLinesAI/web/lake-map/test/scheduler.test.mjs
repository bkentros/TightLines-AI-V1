import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import scheduler, { dispatchLakeMapWorkflow } from '../scheduler/worker.js';

test('scheduler dispatches the lake-map workflow with force disabled', async () => {
  const requests = [];
  const messages = [];
  const status = await dispatchLakeMapWorkflow(
    { GITHUB_ACTIONS_TOKEN: 'test-token' },
    Date.parse('2026-10-13T14:45:00Z'),
    async (url, init) => {
      requests.push({ url, init });
      return new Response(null, { status: 204 });
    },
    message => messages.push(JSON.parse(message)),
  );

  assert.equal(status, 204);
  assert.equal(requests.length, 1);
  assert.equal(
    requests[0].url,
    'https://api.github.com/repos/bkentros/TightLines-AI-V1/actions/workflows/lake-map-data.yml/dispatches',
  );
  assert.equal(requests[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    ref: 'main',
    inputs: { force: 'false' },
  });
  assert.equal(requests[0].init.headers.Authorization, 'Bearer test-token');
  assert.deepEqual(messages, [{
    event: 'lake_map_workflow_dispatch',
    triggeredAt: '2026-10-13T14:45:00.000Z',
    workflow: 'lake-map-data.yml',
    status: 204,
    ok: true,
  }]);
});

test('scheduler logs and fails a rejected dispatch', async () => {
  const messages = [];
  await assert.rejects(
    dispatchLakeMapWorkflow(
      { GITHUB_ACTIONS_TOKEN: 'test-token' },
      Date.parse('2026-10-13T14:45:00Z'),
      async () => new Response(null, { status: 403 }),
      message => messages.push(JSON.parse(message)),
    ),
    /HTTP 403/,
  );
  assert.equal(messages[0].status, 403);
  assert.equal(messages[0].ok, false);
});

test('scheduled events are attached to the Worker lifetime', async () => {
  const waits = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 204 });
  try {
    scheduler.scheduled(
      { scheduledTime: Date.parse('2026-10-13T14:45:00Z') },
      { GITHUB_ACTIONS_TOKEN: 'test-token' },
      { waitUntil: promise => waits.push(promise) },
    );
    assert.equal(waits.length, 1);
    await waits[0];
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Worker mirrors PR 71 polling windows and has no public route', () => {
  const config = readFileSync(new URL('../scheduler/wrangler.toml', import.meta.url), 'utf8');
  assert.match(config, /name = "finfindr-lake-map-scheduler"/);
  assert.match(config, /"45 2,8,14,20 \* \* \*"/);
  assert.match(config, /"0,15,30,45 3,4,5,9,10,11,15,16,17,21,22,23 \* \* \*"/);
  assert.match(config, /workers_dev = false/);
  assert.doesNotMatch(config, /^routes?\s*=/m);
});
