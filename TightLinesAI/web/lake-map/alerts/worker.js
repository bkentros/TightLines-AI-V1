import {
  clearSkippedDeliveryFalseAlarm,
  easternMondayMorningKey,
  evaluateIncidents,
  initialState,
  normalizeState,
  parseWorkflowMetrics,
  weeklySummary,
} from './logic.js';

const OWNER = 'bkentros';
const REPOSITORY = 'TightLines-AI-V1';
const WORKFLOW = 'lake-map-data.yml';
const MAP_URL = 'https://map.finfindr.app';
const STATE_KEY = 'state/lake-map-alerts.json';
const EMAIL_TO = 'brandonkentros@icloud.com';
const EMAIL_FROM = 'FinFindr <support@finfindr.app>';

const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

function base64url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export async function mapPass(secret, now = Date.now()) {
  const random = new Uint8Array(12);
  crypto.getRandomValues(random);
  const payload = `v1.${Math.floor(now / 1000) + 600}.${base64url(random)}`;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${base64url(new Uint8Array(signature))}`;
}

async function fetchJson(url, fetchImpl = fetch, headers = {}) {
  const response = await fetchImpl(url, { headers: { accept: 'application/json', ...headers }, cache: 'no-store' });
  if (!response.ok) throw new Error(`${new URL(url).pathname} returned HTTP ${response.status}`);
  return response.json();
}

export async function readPublicPointers(env, fetchImpl = fetch, now = Date.now()) {
  if (!env.PIER_CAST_MAP_PASS_SECRET) throw new Error('PIER_CAST_MAP_PASS_SECRET is not configured');
  const token = await mapPass(env.PIER_CAST_MAP_PASS_SECRET, now);
  const auth = `t=${encodeURIComponent(token)}`;
  const [surface, features] = await Promise.all([
    fetchJson(`${MAP_URL}/latest.json?${auth}`, fetchImpl),
    fetchJson(`${MAP_URL}/map/features.json?${auth}`, fetchImpl),
  ]);
  if (!surface?.run || !surface?.cycle) throw new Error('surface pointer is invalid');
  const depthEnabled = features?.tempDepth === 'on';
  const depth = depthEnabled
    ? await fetchJson(`${MAP_URL}/runs/tdepth/latest.json?surface=${encodeURIComponent(surface.run)}&${auth}`, fetchImpl)
    : null;
  return {
    surfaceRun: surface.run,
    surfaceCycle: surface.cycle,
    depthEnabled,
    depthRun: depth?.run || null,
  };
}

function githubHeaders(env) {
  if (!env.GITHUB_ACTIONS_TOKEN) throw new Error('GITHUB_ACTIONS_TOKEN is not configured');
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${env.GITHUB_ACTIONS_TOKEN}`,
    'user-agent': 'FinFindr-LakeMap-Alerts/1.0',
    'x-github-api-version': '2022-11-28',
  };
}

async function githubJson(path, env, fetchImpl) {
  return fetchJson(`https://api.github.com/repos/${OWNER}/${REPOSITORY}${path}`, fetchImpl, githubHeaders(env));
}

async function jobLog(jobId, env, fetchImpl) {
  const response = await fetchImpl(
    `https://api.github.com/repos/${OWNER}/${REPOSITORY}/actions/jobs/${jobId}/logs`,
    { headers: githubHeaders(env) },
  );
  if (!response.ok) throw new Error(`GitHub job log ${jobId} returned HTTP ${response.status}`);
  return response.text();
}

export async function ingestWorkflowRuns(rawState, env, fetchImpl = fetch) {
  const state = normalizeState(rawState);
  const payload = await githubJson(`/actions/workflows/${WORKFLOW}/runs?status=completed&per_page=12`, env, fetchImpl);
  const seen = new Set(state.github.seenRunIds);
  const pending = (payload.workflow_runs || []).filter((run) => !seen.has(run.id))
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
  let latestDelivery = null;
  for (const run of pending) {
    const jobsPayload = await githubJson(`/actions/runs/${run.id}/jobs?per_page=20`, env, fetchImpl);
    const jobs = jobsPayload.jobs || [];
    const delivery = jobs.find((job) => job.name === 'delivery');
    const deliveryRan = delivery && ['success', 'failure', 'timed_out'].includes(delivery.conclusion);
    if (deliveryRan) {
      latestDelivery = {
        failed: ['failure', 'timed_out'].includes(delivery.conclusion),
        details: `Workflow run ${run.id} delivery job concluded ${delivery.conclusion}.`,
      };
      const build = jobs.find((job) => job.name === 'build');
      const depth = jobs.find((job) => job.name === 'depth');
      // Delivery alerting must survive a transient log-download failure. The
      // job conclusion is authoritative for that incident; missing logs only
      // make this cycle's weekly source/lag fields unknown.
      const [buildLog, depthLog] = await Promise.all([
        build ? jobLog(build.id, env, fetchImpl).catch(() => '') : '',
        depth ? jobLog(depth.id, env, fetchImpl).catch(() => '') : '',
      ]);
      const record = parseWorkflowMetrics(run, buildLog, depthLog);
      state.github.records = state.github.records.filter((item) => item.runId !== run.id);
      state.github.records.push(record);
      state.github.records = state.github.records.slice(-40);
    }
    seen.add(run.id);
  }
  state.github.seenRunIds = [...seen].slice(-100);
  return { state, latestDelivery };
}

async function readState(env) {
  const object = await env.BUCKET.get(STATE_KEY);
  if (!object) return initialState();
  try { return normalizeState(await object.json()); } catch { return initialState(); }
}

async function writeState(env, state) {
  await env.BUCKET.put(STATE_KEY, JSON.stringify(normalizeState(state)), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'private, no-store' },
  });
}

export async function sendEmail(env, message, fetchImpl = fetch) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
      'idempotency-key': message.id,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [EMAIL_TO], subject: message.subject, text: message.text }),
  });
  if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);
  return response.json();
}

async function drainOutbox(state, env, fetchImpl, log) {
  const sent = [];
  while (state.outbox.length) {
    const message = state.outbox[0];
    const result = await sendEmail(env, message, fetchImpl);
    state.outbox.shift();
    state.alertHistory.push({ type: message.type, transition: message.transition, at: message.at });
    state.alertHistory = state.alertHistory.slice(-100);
    await writeState(env, state);
    log(JSON.stringify({ event: 'lake_map_alert_email', type: message.type, transition: message.transition }));
    sent.push({ eventId: message.id, messageId: result?.id || null });
  }
  return sent;
}

export async function runAlertCheck(env, scheduledTime = Date.now(), fetchImpl = fetch, log = console.log) {
  let state = await readState(env);
  const pointers = await readPublicPointers(env, fetchImpl, scheduledTime);
  let workflow;
  try {
    workflow = await ingestWorkflowRuns(state, env, fetchImpl);
    state = workflow.state;
  } catch (error) {
    log(JSON.stringify({ event: 'lake_map_github_observation_failed', error: error.name || 'Error' }));
    workflow = { latestDelivery: null };
  }
  state = evaluateIncidents(state, {
    ...pointers,
    deliveryFailed: workflow.latestDelivery ? workflow.latestDelivery.failed : null,
    deliveryDetails: workflow.latestDelivery?.details,
  }, new Date(scheduledTime));
  await writeState(env, state);
  await drainOutbox(state, env, fetchImpl, log);

  const weeklyKey = easternMondayMorningKey(new Date(scheduledTime));
  if (weeklyKey && state.lastWeeklyKey !== weeklyKey) {
    const summary = weeklySummary(state, new Date(scheduledTime));
    await sendEmail(env, {
      id: `lake-map-weekly-${weeklyKey}`,
      subject: `FinFindr Live Lake Map — Weekly summary ${weeklyKey}`,
      text: summary.text,
    }, fetchImpl);
    state.lastWeeklyKey = weeklyKey;
    await writeState(env, state);
    log(JSON.stringify({ event: 'lake_map_weekly_email', week: weeklyKey }));
  }
  log(JSON.stringify({ event: 'lake_map_alert_check', ...pointers }));
  return { state, pointers };
}

function authorizedTest(request, env) {
  return Boolean(env.ALERT_TEST_TOKEN)
    && request.headers.get('authorization') === `Bearer ${env.ALERT_TEST_TOKEN}`;
}

async function testMessage(request, env, fetchImpl = fetch) {
  if (!authorizedTest(request, env)) return new Response('Not found', { status: 404 });
  const kind = new URL(request.url).pathname.split('/').pop();
  if (!['alert', 'weekly'].includes(kind)) return new Response('Not found', { status: 404 });
  const now = new Date();
  const state = await readState(env);
  const message = kind === 'alert'
    ? {
      id: `lake-map-test-alert-${now.toISOString()}`,
      subject: 'TEST — FinFindr Live Lake Map alert delivery',
      text: `TEST ONLY — no production incident was created.\n\nSent ${now.toISOString()}.`,
    }
    : {
      id: `lake-map-test-weekly-${now.toISOString()}`,
      subject: 'TEST — FinFindr Live Lake Map weekly summary',
      text: `TEST ONLY — sample weekly summary.\n\n${weeklySummary(state, now).text}`,
    };
  const result = await sendEmail(env, message, fetchImpl);
  return new Response(JSON.stringify({ ok: true, kind, id: result?.id || null }), { status: 200, headers: jsonHeaders });
}

async function repairSkippedDeliveryFalseAlarm(request, env, fetchImpl = fetch) {
  if (!authorizedTest(request, env)) return new Response('Not found', { status: 404 });
  const repaired = clearSkippedDeliveryFalseAlarm(await readState(env), new Date());
  if (!repaired.cleared) {
    return new Response(JSON.stringify({ ok: false, cleared: false }), { status: 409, headers: jsonHeaders });
  }
  await writeState(env, repaired.state);
  const messages = await drainOutbox(repaired.state, env, fetchImpl, console.log);
  return new Response(JSON.stringify({ ok: true, cleared: true, messages }), { status: 200, headers: jsonHeaders });
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runAlertCheck(env, controller.scheduledTime));
  },
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Not found', { status: 404 });
    if (new URL(request.url).pathname === '/__repair/delivery-skipped-false-alarm') {
      return repairSkippedDeliveryFalseAlarm(request, env);
    }
    return testMessage(request, env);
  },
};
