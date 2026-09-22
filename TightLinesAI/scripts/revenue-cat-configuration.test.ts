import test from 'node:test';
import assert from 'node:assert/strict';
import {
  revenueCatUserNeedsLogin,
  waitForRevenueCatConfiguration,
} from '../lib/revenueCatConfiguration';

test('waits for RevenueCat native configuration instead of failing the first check', async () => {
  let checks = 0;
  const delays: number[] = [];

  const configured = await waitForRevenueCatConfiguration(
    async () => ++checks >= 4,
    async (milliseconds) => {
      delays.push(milliseconds);
    },
    [25, 50, 100, 200],
  );

  assert.equal(configured, true);
  assert.equal(checks, 4);
  assert.deepEqual(delays, [25, 50, 100]);
});

test('treats transient bridge errors as not ready and keeps trying', async () => {
  let checks = 0;

  const configured = await waitForRevenueCatConfiguration(
    async () => {
      checks += 1;
      if (checks === 1) throw new Error('bridge is starting');
      return checks === 2;
    },
    async () => undefined,
    [1, 1],
  );

  assert.equal(configured, true);
  assert.equal(checks, 2);
});

test('returns false only after the bounded readiness window is exhausted', async () => {
  let checks = 0;
  let waits = 0;

  const configured = await waitForRevenueCatConfiguration(
    async () => {
      checks += 1;
      return false;
    },
    async () => {
      waits += 1;
    },
    [1, 2, 3],
  );

  assert.equal(configured, false);
  assert.equal(checks, 4);
  assert.equal(waits, 3);
});

test('does not log in again when native RevenueCat already has the requested user', () => {
  assert.equal(
    revenueCatUserNeedsLogin('finfindr-user-123', 'finfindr-user-123'),
    false,
  );
});

test('logs in when the native RevenueCat user differs from the signed-in user', () => {
  assert.equal(
    revenueCatUserNeedsLogin('finfindr-user-old', 'finfindr-user-new'),
    true,
  );
});
