const OWNER = 'bkentros';
const REPOSITORY = 'TightLines-AI-V1';
const WORKFLOW = 'lake-map-data.yml';
const API_VERSION = '2022-11-28';

export async function dispatchLakeMapWorkflow(env, scheduledTime, fetchImpl = fetch, log = console.log) {
  if (!env?.GITHUB_ACTIONS_TOKEN) throw new Error('GITHUB_ACTIONS_TOKEN is not configured');
  const url = `https://api.github.com/repos/${OWNER}/${REPOSITORY}/actions/workflows/${WORKFLOW}/dispatches`;
  const triggeredAt = new Date(scheduledTime).toISOString();
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_ACTIONS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'FinFindr-LakeMap-Scheduler/1.0',
      'X-GitHub-Api-Version': API_VERSION,
    },
    body: JSON.stringify({ ref: 'main', inputs: { force: 'false' } }),
  });
  log(JSON.stringify({
    event: 'lake_map_workflow_dispatch',
    triggeredAt,
    workflow: WORKFLOW,
    status: response.status,
    ok: response.ok,
  }));
  if (response.status !== 204) {
    throw new Error(`GitHub workflow dispatch failed with HTTP ${response.status}`);
  }
  return response.status;
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(dispatchLakeMapWorkflow(env, controller.scheduledTime));
  },
};
