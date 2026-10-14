import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  clearSkippedDeliveryFalseAlarm,
  DEPTH_MISMATCH_CYCLES,
  SURFACE_STALE_HOURS,
  easternMondayMorningKey,
  evaluateIncidents,
  initialState,
  parseWorkflowMetrics,
  weeklySummary,
} from '../alerts/logic.js';
import worker, { ingestWorkflowRuns, mapPass, sendEmail } from '../alerts/worker.js';
import { verifyPass } from '../gate/worker.js';

const now = new Date('2026-10-14T16:00:00Z');
const observation = {
  surfaceRun: 'run-1', surfaceCycle: '2026-10-14T12:00:00Z',
  depthEnabled: true, depthRun: 'run-1', deliveryFailed: false,
};

test('surface stale opens once, does not repeat, and sends one recovery', () => {
  let state = evaluateIncidents(initialState(), {
    ...observation, surfaceCycle: '2026-10-14T06:00:00Z',
  }, now);
  assert.equal(SURFACE_STALE_HOURS, 9);
  assert.equal(state.incidents.surfaceStale.active, true);
  assert.equal(state.outbox.filter((item) => item.type === 'surfaceStale').length, 1);
  state.outbox = [];
  state = evaluateIncidents(state, {
    ...observation, surfaceCycle: '2026-10-14T06:00:00Z',
  }, new Date('2026-10-14T16:30:00Z'));
  assert.equal(state.outbox.length, 0);
  state = evaluateIncidents(state, observation, new Date('2026-10-14T17:00:00Z'));
  assert.equal(state.incidents.surfaceStale.active, false);
  assert.match(state.outbox[0].subject, /RECOVERY: SURFACE STALE/);
});

test('depth mismatch counts distinct surface cycles and recovers on a match', () => {
  let state = evaluateIncidents(initialState(), { ...observation, depthRun: 'old' }, now);
  assert.equal(DEPTH_MISMATCH_CYCLES, 2);
  assert.equal(state.mismatch.consecutiveCycles, 1);
  assert.equal(state.incidents.depthMismatch.active, false);
  state = evaluateIncidents(state, { ...observation, depthRun: 'old' }, new Date('2026-10-14T16:30:00Z'));
  assert.equal(state.mismatch.consecutiveCycles, 1, 'checks do not count as cycles');
  state = evaluateIncidents(state, {
    ...observation, surfaceRun: 'run-2', surfaceCycle: '2026-10-14T18:00:00Z', depthRun: 'old',
  }, new Date('2026-10-14T22:00:00Z'));
  assert.equal(state.mismatch.consecutiveCycles, 2);
  assert.equal(state.incidents.depthMismatch.active, true);
  state.outbox = [];
  state = evaluateIncidents(state, {
    ...observation, surfaceRun: 'run-3', surfaceCycle: '2026-10-15T00:00:00Z', depthRun: 'run-3',
  }, new Date('2026-10-15T04:00:00Z'));
  assert.equal(state.incidents.depthMismatch.active, false);
  assert.match(state.outbox[0].subject, /RECOVERY: DEPTH MISMATCH/);
});

test('delivery failure and recovery transition once per incident', () => {
  let state = evaluateIncidents(initialState(), { ...observation, deliveryFailed: true }, now);
  assert.equal(state.incidents.deliveryFailed.active, true);
  state.outbox = [];
  state = evaluateIncidents(state, { ...observation, deliveryFailed: true }, new Date('2026-10-14T16:30:00Z'));
  assert.equal(state.outbox.length, 0);
  state = evaluateIncidents(state, { ...observation, deliveryFailed: false }, new Date('2026-10-14T17:00:00Z'));
  assert.match(state.outbox[0].subject, /RECOVERY: DELIVERY FAILED/);
});

test('weekly summary is due Monday at 9 Eastern across DST and aggregates metrics', () => {
  assert.equal(easternMondayMorningKey(new Date('2026-10-19T13:00:00Z')), '2026-10-19');
  assert.equal(easternMondayMorningKey(new Date('2026-11-02T14:30:00Z')), '2026-11-02');
  assert.equal(easternMondayMorningKey(new Date('2026-11-02T16:30:00Z')), '2026-11-02');
  assert.equal(easternMondayMorningKey(new Date('2026-10-19T12:30:00Z')), null);
  assert.equal(easternMondayMorningKey(new Date('2026-10-19T16:00:00Z')), null);
  const state = initialState();
  state.github.records.push({
    cycle: '2026-10-19T06:00:00Z', completedAt: '2026-10-19T09:00:00Z',
    completeObservedAt: '2026-10-19T08:30:00Z', surfacePublishedAt: '2026-10-19T08:40:00Z',
    depthPublishedAt: '2026-10-19T08:50:00Z', surfaceSource: 'nodd', depthSource: 'nodd',
    retryCount: 2, surfaceFallback: false, depthFallback: true,
  });
  const summary = weeklySummary(state, new Date('2026-10-19T13:00:00Z'));
  assert.equal(summary.cycles, 1);
  assert.equal(summary.expected, 28);
  assert.equal(summary.sourceCounts.nodd, 1);
  assert.equal(summary.retries, 2);
  assert.equal(summary.fallbacks, 1);
  assert.match(summary.text, /median 10\.0 min; worst 10\.0 min/);
});

test('workflow log metrics capture sources, retries, fallbacks and pointer lag inputs', () => {
  const build = [
    'build\tstep\t2026-10-14T15:01:00Z NOAA 2026-10-14T12:00:00Z release ready',
    'build\tstep\t2026-10-14T15:01:01Z Surface source choice: thredds (THREDDS circuit closed)',
    'build\tstep\t2026-10-14T15:02:00Z Retrying thredds LSOFS f001 after HttpError (HTTP 503): attempt 2/4 in 2 s',
    'build\tstep\t2026-10-14T15:03:00Z Rebuilding ALL surface frames from nodd; sources will not be mixed',
    'build\tstep\t2026-10-14T15:10:00Z Uploaded run example and pointed latest.json at it',
  ].join('\n');
  const depth = [
    'depth\tstep\t2026-10-14T15:11:00Z Depth source for all four models: NOAA GLOFS native sigma layers (NODD AWS)',
    'depth\tstep\t2026-10-14T15:20:00Z Uploaded complete depth run and wrote runs/tdepth/latest.json last in 20 s',
  ].join('\n');
  const metrics = parseWorkflowMetrics({ id: 123, event: 'workflow_dispatch', updated_at: '2026-10-14T15:21:00Z' }, build, depth);
  assert.equal(metrics.cycle, '2026-10-14T12:00:00Z');
  assert.equal(metrics.surfaceSource, 'nodd');
  assert.equal(metrics.depthSource, 'nodd');
  assert.equal(metrics.surfaceFallback, true);
  assert.equal(metrics.retryCount, 1);
  assert.equal(metrics.retryTypes.http_503, 1);
  assert.equal(metrics.surfacePublishedAt, '2026-10-14T15:10:00Z');
});

test('delivery failure remains alertable when workflow log download is unavailable', async () => {
  const fetchImpl = async (url) => {
    if (url.includes('/actions/workflows/')) return Response.json({ workflow_runs: [{
      id: 42, event: 'workflow_dispatch', created_at: '2026-10-14T15:00:00Z', updated_at: '2026-10-14T15:10:00Z',
    }] });
    if (url.includes('/actions/runs/42/jobs')) return Response.json({ jobs: [
      { id: 420, name: 'build', conclusion: 'success' },
      { id: 422, name: 'delivery', conclusion: 'failure' },
    ] });
    if (url.includes('/actions/jobs/420/logs')) return new Response('unavailable', { status: 503 });
    throw new Error(`unexpected URL ${url}`);
  };
  const result = await ingestWorkflowRuns(initialState(), { GITHUB_ACTIONS_TOKEN: 'token' }, fetchImpl);
  assert.equal(result.latestDelivery.failed, true);
  assert.match(result.latestDelivery.details, /run 42.*failure/);
  assert.equal(result.state.github.records.length, 1);
  assert.equal(result.state.github.records[0].surfaceSource, 'unknown');
});

test('a skipped or cancelled delivery job on a no-op run does not alert or record a publish', async () => {
  for (const conclusion of ['skipped', 'cancelled']) {
    const fetchImpl = async (url) => {
      if (url.includes('/actions/workflows/')) return Response.json({ workflow_runs: [{
        id: conclusion === 'skipped' ? 51 : 52,
        event: 'workflow_dispatch',
        created_at: '2026-10-14T15:00:00Z',
        updated_at: '2026-10-14T15:01:00Z',
      }] });
      if (url.includes('/jobs')) return Response.json({ jobs: [
        { id: 510, name: 'build', conclusion: 'success' },
        { id: 512, name: 'delivery', conclusion },
      ] });
      throw new Error(`unexpected URL ${url}`);
    };
    const result = await ingestWorkflowRuns(initialState(), { GITHUB_ACTIONS_TOKEN: 'token' }, fetchImpl);
    assert.equal(result.latestDelivery, null);
    assert.equal(result.state.github.records.length, 0);
  }
});

test('a failed delivery job after a publish opens an alert', async () => {
  const fetchImpl = async (url) => {
    if (url.includes('/actions/workflows/')) return Response.json({ workflow_runs: [{
      id: 61, event: 'workflow_dispatch', created_at: '2026-10-14T15:00:00Z', updated_at: '2026-10-14T15:10:00Z',
    }] });
    if (url.includes('/actions/runs/61/jobs')) return Response.json({ jobs: [
      { id: 610, name: 'build', conclusion: 'success' },
      { id: 611, name: 'depth', conclusion: 'success' },
      { id: 612, name: 'delivery', conclusion: 'failure' },
    ] });
    if (url.includes('/actions/jobs/610/logs')) return new Response(
      '2026-10-14T15:01:00Z NOAA 2026-10-14T12:00:00Z release ready\n'
      + '2026-10-14T15:08:00Z Uploaded run 20261014T12Z-10141508 and pointed latest.json at it',
    );
    if (url.includes('/actions/jobs/611/logs')) return new Response(
      '2026-10-14T15:09:00Z Uploaded complete depth run and wrote runs/tdepth/latest.json last in 20 s',
    );
    throw new Error(`unexpected URL ${url}`);
  };
  const ingested = await ingestWorkflowRuns(initialState(), { GITHUB_ACTIONS_TOKEN: 'token' }, fetchImpl);
  const state = evaluateIncidents(ingested.state, {
    ...observation,
    deliveryFailed: ingested.latestDelivery.failed,
    deliveryDetails: ingested.latestDelivery.details,
  }, now);
  assert.equal(state.incidents.deliveryFailed.active, true);
  assert.match(state.outbox.at(-1).subject, /DELIVERY FAILED/);
});

test('the known skipped-delivery false alarm is cleared with an explicit recovery', () => {
  const state = initialState();
  state.incidents.deliveryFailed = {
    active: true,
    openedAt: '2026-10-14T15:30:00Z',
    details: 'Workflow run 38585602258 delivery job concluded skipped.',
  };
  const repaired = clearSkippedDeliveryFalseAlarm(state, now);
  assert.equal(repaired.cleared, true);
  assert.equal(repaired.state.incidents.deliveryFailed.active, false);
  assert.match(repaired.state.outbox[0].subject, /false alarm/i);
  assert.match(repaired.state.outbox[0].text, /no publish or delivery failed/i);
});

test('Resend uses the fixed inbox, verified sender and idempotency key without exposing the key', async () => {
  let request;
  await sendEmail({ RESEND_API_KEY: 'secret-value' }, {
    id: 'event-1', subject: 'TEST subject', text: 'body',
  }, async (url, init) => {
    request = { url, init };
    return new Response(JSON.stringify({ id: 'email-1' }), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.init.headers['idempotency-key'], 'event-1');
  assert.equal(request.init.headers.authorization, 'Bearer secret-value');
  const body = JSON.parse(request.init.body);
  assert.equal(body.from, 'FinFindr <support@finfindr.app>');
  assert.deepEqual(body.to, ['brandonkentros@icloud.com']);
  assert.doesNotMatch(request.init.body, /secret-value/);
});

test('alert checks use the same short-lived signed pass contract as production users', async () => {
  const nowMs = Date.parse('2026-10-14T16:00:00Z');
  const token = await mapPass('map-secret', nowMs);
  assert.equal(await verifyPass(token, 'map-secret', Math.floor(nowMs / 1000)), true);
  assert.equal(await verifyPass(token, 'wrong-secret', Math.floor(nowMs / 1000)), false);
});

test('test endpoint is authenticated and clearly labels both messages', async () => {
  const bucket = { get: async () => null };
  const env = { BUCKET: bucket, ALERT_TEST_TOKEN: 'test-auth', RESEND_API_KEY: 'resend' };
  const originalFetch = globalThis.fetch;
  const emails = [];
  globalThis.fetch = async (_url, init) => {
    emails.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ id: 'sent' }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const denied = await worker.fetch(new Request('https://alerts.example/__test/alert', { method: 'POST' }), env);
    assert.equal(denied.status, 404);
    for (const kind of ['alert', 'weekly']) {
      const response = await worker.fetch(new Request(`https://alerts.example/__test/${kind}`, {
        method: 'POST', headers: { authorization: 'Bearer test-auth' },
      }), env);
      assert.equal(response.status, 200);
    }
  } finally { globalThis.fetch = originalFetch; }
  assert.match(emails[0].subject, /^TEST —/);
  assert.match(emails[0].text, /no production incident was created/);
  assert.match(emails[1].subject, /^TEST —/);
  assert.match(emails[1].text, /TEST ONLY/);
});

test('Worker config checks every 30 minutes and stores state in the existing R2 bucket', () => {
  const config = readFileSync(new URL('../alerts/wrangler.toml', import.meta.url), 'utf8');
  assert.match(config, /name = "finfindr-lake-map-alerts"/);
  assert.match(config, /crons = \["\*\/30 \* \* \* \*"\]/);
  assert.match(config, /bucket_name = "piercast-lake-map"/);
  assert.doesNotMatch(config, /RESEND_API_KEY|PIER_CAST_MAP_PASS_SECRET|GITHUB_ACTIONS_TOKEN\s*=/);
});
