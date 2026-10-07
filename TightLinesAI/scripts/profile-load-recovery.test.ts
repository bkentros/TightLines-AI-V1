import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  isMissingProfileError,
  loadProfileWithRetry,
  PROFILE_RETRY_DELAYS_MS,
} from '../lib/profileLoadRecovery';

test('profile loading retries transient failures with bounded backoff', async () => {
  const attempts = [
    { data: null, error: { code: 'PROFILE_FETCH_TIMEOUT', message: 'timed out' } },
    { data: null, error: { code: 'PGRST000', message: 'database unavailable' } },
    { data: { id: 'user-1' }, error: null },
  ];
  const waits: number[] = [];
  const result = await loadProfileWithRetry(
    async () => attempts.shift()!,
    async (milliseconds) => {
      waits.push(milliseconds);
    },
  );

  assert.deepEqual(result.data, { id: 'user-1' });
  assert.deepEqual(waits, [...PROFILE_RETRY_DELAYS_MS]);
});

test('a definitive missing profile is not retried', async () => {
  let attempts = 0;
  const result = await loadProfileWithRetry(
    async () => {
      attempts += 1;
      return {
        data: null,
        error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
      };
    },
    async () => assert.fail('missing profiles must not back off'),
  );

  assert.equal(attempts, 1);
  assert.equal(isMissingProfileError(result.error), true);
});

test('transient failure remains an error after bounded retries', async () => {
  let attempts = 0;
  const waits: number[] = [];
  const result = await loadProfileWithRetry(
    async () => {
      attempts += 1;
      return {
        data: null,
        error: { code: 'PROFILE_FETCH_ERROR', message: 'offline' },
      };
    },
    async (milliseconds) => {
      waits.push(milliseconds);
    },
  );

  assert.equal(attempts, 3);
  assert.deepEqual(waits, [...PROFILE_RETRY_DELAYS_MS]);
  assert.equal(result.error?.code, 'PROFILE_FETCH_ERROR');
});

test('signed-in profile errors hold routing and expose a retry state', () => {
  const layout = readFileSync(new URL('../app/_layout.tsx', import.meta.url), 'utf8');
  const store = readFileSync(new URL('../store/authStore.ts', import.meta.url), 'utf8');

  assert.match(layout, /if \(session && profileLoadError\) return;/);
  assert.match(layout, /Couldn&apos;t connect/);
  assert.match(layout, /onRetry=\{\(\) => void fetchProfile\(user\.id\)\}/);
  assert.match(store, /loadProfileWithRetry/);
  assert.match(store, /isMissingProfileError\(error\)/);
});
