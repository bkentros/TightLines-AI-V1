import {
  clearSkippedDeliveryFalseAlarm,
  easternMondayMorningKey,
  evaluateCanary,
  evaluateIncidents,
  evaluatePipelineRun,
  evaluatePierCastObservation,
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
const PIER_CAST_URL = 'https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/pier-cast/conditions/leaderboard?speciesId=chinook_salmon';

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

export async function readPierCastFreshness(env, fetchImpl = fetch) {
  if (!env.SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is not configured');
  let response;
  try {
    response = await fetchImpl(PIER_CAST_URL, {
      headers: {
        accept: 'application/json',
        apikey: env.SUPABASE_ANON_KEY,
        authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });
  } catch (error) {
    return {
      ok: false,
      failureType: 'network',
      details: `The public PierCast request failed (${error?.name || 'network error'}).`,
    };
  }
  if (!response.ok) {
    const failureType = response.status >= 500 ? 'http_5xx' : 'http_error';
    return {
      ok: false,
      status: response.status,
      failureType,
      details: `The public PierCast endpoint returned HTTP ${response.status}.`,
    };
  }
  let body;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      status: response.status,
      failureType: 'malformed',
      details: 'The public PierCast endpoint returned malformed JSON.',
    };
  }
  if (!body || typeof body.sourceIssuedAt !== 'string'
      || !Number.isFinite(Date.parse(body.sourceIssuedAt))) {
    return {
      ok: false,
      status: response.status,
      failureType: 'malformed',
      details: 'The public PierCast response did not contain a valid sourceIssuedAt timestamp.',
    };
  }
  return { ok: true, status: response.status, sourceIssuedAt: body.sourceIssuedAt };
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
  let state = normalizeState(rawState);
  const payload = await githubJson(`/actions/workflows/${WORKFLOW}/runs?status=completed&per_page=12`, env, fetchImpl);
  const seen = new Set(state.github.seenRunIds);
  const pending = (payload.workflow_runs || []).filter((run) => !seen.has(run.id))
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
  let latestDelivery = null;
  for (const run of pending) {
    const jobsPayload = await githubJson(`/actions/runs/${run.id}/jobs?per_page=20`, env, fetchImpl);
    const jobs = jobsPayload.jobs || [];
    const executed = ['success', 'failure', 'timed_out'].includes(run.conclusion);
    if (executed) {
      const failed = ['failure', 'timed_out'].includes(run.conclusion);
      const failedJob = failed
        ? jobs.find((job) => ['failure', 'timed_out'].includes(job.conclusion))
        : null;
      const failedStep = failedJob?.steps?.find(
        (step) => ['failure', 'timed_out'].includes(step.conclusion),
      );
      const failedLog = failedJob
        ? await jobLog(failedJob.id, env, fetchImpl).catch(() => '')
        : '';
      state = evaluatePipelineRun(state, {
        executed: true,
        failed,
        runId: run.id,
        job: failedJob?.name,
        step: failedStep?.name,
        error: firstErrorLine(failedLog),
        url: run.html_url,
      }, new Date(run.updated_at || run.created_at));
    }
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

export function firstErrorLine(log = '') {
  const lines = String(log).split('\n').map((line) => line
    .replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/^\S+\s+(?:Z\s+)?/, '')
    .trim()).filter(Boolean);
  const line = lines.find((entry) => /##\[error\]|\b(?:FAIL|ERROR|AssertionError|Traceback)\b|Error:/i.test(entry));
  return (line || lines.at(-1) || 'unavailable').slice(0, 500);
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

export async function listRecentEmails(env, fetchImpl = fetch) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
  const response = await fetchImpl('https://api.resend.com/emails?limit=100', {
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Resend email history returned HTTP ${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}

async function drainOutbox(state, env, fetchImpl, log) {
  const sent = [];
  while (state.outbox.length) {
    const message = state.outbox[0];
    const result = await sendEmail(env, message, fetchImpl);
    if (!result?.id) throw new Error('Resend accepted an alert without returning a message ID');
    state.outbox.shift();
    state.alertHistory.push({
      type: message.type,
      transition: message.transition,
      at: message.at,
      messageId: result.id,
      lastEvent: 'accepted',
    });
    state.alertHistory = state.alertHistory.slice(-100);
    await writeState(env, state);
    log(JSON.stringify({ event: 'lake_map_alert_email', type: message.type, transition: message.transition }));
    sent.push({ eventId: message.id, messageId: result?.id || null });
  }
  return sent;
}

function authorizedPipeline(request, env) {
  return Boolean(env.PIPELINE_ALERT_TOKEN)
    && request.headers.get('authorization') === `Bearer ${env.PIPELINE_ALERT_TOKEN}`;
}

async function pipelineCanary(request, env, fetchImpl = fetch) {
  if (!authorizedPipeline(request, env)) return new Response('Not found', { status: 404 });
  let observation;
  try { observation = await request.json(); } catch { return new Response('Bad request', { status: 400 }); }
  if (!['failure', 'timed_out', 'success'].includes(observation?.conclusion)) {
    return new Response('Bad request', { status: 400 });
  }
  const bounded = {
    conclusion: observation.conclusion,
    runId: String(observation.runId || '').slice(0, 30),
    job: String(observation.job || '').slice(0, 120),
    step: String(observation.step || '').slice(0, 120),
    error: String(observation.error || '').slice(0, 500),
    url: /^https:\/\/github\.com\//.test(observation.url || '') ? observation.url : null,
  };
  const state = evaluateCanary(await readState(env), bounded, new Date());
  await writeState(env, state);
  const messages = await drainOutbox(state, env, fetchImpl, console.log);
  return new Response(JSON.stringify({ ok: true, messages }), { status: 200, headers: jsonHeaders });
}

async function resendAudit(request, env, fetchImpl = fetch) {
  if (!authorizedPipeline(request, env)) return new Response('Not found', { status: 404 });
  const emails = await listRecentEmails(env, fetchImpl);
  const records = emails.filter((email) => /FinFindr Live Lake Map/i.test(email.subject || ''))
    .map((email) => ({
      id: email.id,
      createdAt: email.created_at,
      subject: email.subject,
      lastEvent: email.last_event || null,
    }));
  return new Response(JSON.stringify({ records }), { status: 200, headers: jsonHeaders });
}

export async function runAlertCheck(env, scheduledTime = Date.now(), fetchImpl = fetch, log = console.log) {
  let state = await readState(env);
  const [pointers, pierCast] = await Promise.all([
    readPublicPointers(env, fetchImpl, scheduledTime),
    readPierCastFreshness(env, fetchImpl).catch((error) => ({
      ok: false,
      failureType: 'configuration',
      details: `PierCast freshness observation failed (${error?.name || 'Error'}).`,
    })),
  ]);
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
  state = evaluatePierCastObservation(state, pierCast, new Date(scheduledTime));
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
  log(JSON.stringify({
    event: 'lake_map_alert_check',
    ...pointers,
    pierCast: {
      ok: pierCast.ok,
      status: pierCast.status || null,
      sourceIssuedAt: pierCast.sourceIssuedAt || null,
      failureType: pierCast.failureType || null,
    },
  }));
  return { state, pointers, pierCast };
}

function authorizedTest(request, env) {
  return Boolean(env.ALERT_TEST_TOKEN)
    && request.headers.get('authorization') === `Bearer ${env.ALERT_TEST_TOKEN}`;
}

async function testMessage(request, env, fetchImpl = fetch) {
  if (!authorizedTest(request, env)) return new Response('Not found', { status: 404 });
  const kind = new URL(request.url).pathname.split('/').pop();
  if (!['alert', 'weekly', 'piercast'].includes(kind)) return new Response('Not found', { status: 404 });
  const now = new Date();
  const state = await readState(env);
  const message = kind === 'alert'
    ? {
      id: `lake-map-test-alert-${now.toISOString()}`,
      subject: 'TEST — FinFindr Live Lake Map alert delivery',
      text: `TEST ONLY — no production incident was created.\n\nSent ${now.toISOString()}.`,
    }
    : kind === 'piercast'
    ? {
      id: `lake-map-test-piercast-${now.toISOString()}`,
      subject: 'TEST — FinFindr PierCast freshness alert',
      text: `TEST ONLY — PierCast freshness alert delivery. No production incident was created.\n\nSent ${now.toISOString()}.`,
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
    const path = new URL(request.url).pathname;
    if (path === '/__pipeline/canary') return pipelineCanary(request, env);
    if (path === '/__audit/resend') return resendAudit(request, env);
    if (path === '/__repair/delivery-skipped-false-alarm') {
      return repairSkippedDeliveryFalseAlarm(request, env);
    }
    return testMessage(request, env);
  },
};
