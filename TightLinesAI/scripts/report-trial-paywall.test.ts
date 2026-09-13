import test from 'node:test';
import assert from 'node:assert/strict';
import { colorTrialRequiresUpgrade, pierTrialRequiresUpgrade } from '../lib/reportTrialPaywall';
import { createReportStore } from '../supabase/functions/color-picker/store';

test('known lifetime claims paywall every different setup/city/day, while paid and saved access remain available', () => {
  const color = { typeId: 'worm', clarity: 'clear', date: '2026-09-13' };
  assert.equal(colorTrialRequiresUpgrade(true, null, color), false);
  assert.equal(colorTrialRequiresUpgrade(true, color, color), false);
  for (const patch of [{ typeId: 'fly' }, { clarity: 'dirty' }, { date: '2026-09-14' }]) {
    assert.equal(colorTrialRequiresUpgrade(true, color, { ...color, ...patch }), true);
    assert.equal(colorTrialRequiresUpgrade(false, color, { ...color, ...patch }), false);
  }
  const pier = { cityId: 'ludington_mi', date: '2026-09-13' };
  assert.equal(pierTrialRequiresUpgrade(true, null, pier.cityId, pier.date), false);
  assert.equal(pierTrialRequiresUpgrade(true, pier, pier.cityId, pier.date), false);
  assert.equal(pierTrialRequiresUpgrade(true, pier, 'grand_haven_mi', pier.date), true);
  assert.equal(pierTrialRequiresUpgrade(true, pier, pier.cityId, '2026-09-14'), true);
  assert.equal(pierTrialRequiresUpgrade(false, pier, 'grand_haven_mi', '2026-09-14'), false);
});

test('cached paid Color Match generations cannot bypass the lifetime RPC after downgrade', async () => {
  let calls = 0;
  const envelope = { saved: true };
  const db = {
    from() { return { select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: { envelope }, error: null }; } }; },
    async rpc(name: string, args: Record<string, unknown>) {
      calls++;
      assert.equal(name, 'commit_color_picker_report_with_trial');
      assert.equal(args.p_is_free, true);
      return { error: { message: 'subscription_required' } };
    },
  };
  const free = createReportStore(db, true);
  await assert.rejects(() => free.byRequest('u', 'prior-paid-request'), { code: 'subscription_required', status: 403 });
  await assert.rejects(() => free.byDay('u', 'worm', 'clear', '2026-09-13'), { code: 'subscription_required', status: 403 });
  assert.deepEqual(await free.byId('u', 'saved-id'), envelope);
  assert.equal(calls, 2);
  assert.deepEqual(await createReportStore(db, false).byRequest('u', 'paid'), envelope);
  assert.equal(calls, 2);
});
