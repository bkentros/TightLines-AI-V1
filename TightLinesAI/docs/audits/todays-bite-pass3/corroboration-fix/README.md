# Remaining corroboration cutoff — correction and verification

The identified Brownsville Prime cutoff is fixed locally. The safeguard still prevents a temperature-dominated lake reading from reaching Prime without enough supporting evidence; its numeric cap now transitions continuously instead of switching abruptly at the old thresholds.

## Implementation

A bounded restriction blends over thermal contribution 45–50, pre-lift support score 73–76, and positive contribution mass 73–80. It reduces the maximum score from 100 toward 79 as temperature dominance increases and corroboration weakens. Fully restricted cases retain the existing Prime-disqualification reason. The cap is applied after the legacy score floor so that the floor cannot undo it. Other Prime disqualifiers, weather/data caps, weights, thermal curves, timing and recommendation rules remain unchanged.

These widths are conservative engineering guardrails, not fitted catch-rate coefficients. The correction lowers excess optimism near the boundary instead of removing the corroboration requirement.

The captured Brownsville February 28/March 1 probe now returns **79 → 79**, replacing **88 → 79**. A regression test reuses the preserved normalized inputs, and 1,402 adjacent thermal probes check that no step exceeds one rounded score point across either date.

## Validation

- **591 engine/session/provider tests pass**, including the new captured-case and nearby-value tests.
- **24,232 synthetic condition cases and 10,134 recommendation sets are completely unchanged** from the preserved pre-fix candidate. The comparison enforces unchanged inputs, normalized factors, timing, explanations of individual factors and recommendation coverage; any change outside lake scores would fail.
- The 22,464-pair synthetic calendar sweep retains its three-point maximum and zero cases worsening by more than three points against Pass 1.
- The nine-city, 27-snapshot real-weather replay and exact correction comparison are saved alongside this report; see `regional-fix-comparison.json` for the definitive affected cases and counts.
- Full original/Pass 1/current comparisons and caps/coverage checks are saved in `comparison.json`. Earlier artifacts remain untouched.

## Regional replay results

The corrected regional replay passes all checked contracts with **756 reports and 1,764 recommendation sets**, with no lost coverage. Only **2 report scores** and **1 selected-pick sets** differ from the pre-fix evaluation. Exact changes are listed in [regional-fix-comparison.json](./regional-fix-comparison.json).

The maximum calendar-only movement is now **2 points**, down from 9 before this correction and 21 in the original engine. The mean is **0.098**, versus 0.433 originally (about 77% lower). No calendar probe worsens by more than three points versus the original. Temperature, pressure, source confidence, regional routing and timing are identical to the pre-fix model for all evaluated cases.

All three client-cache tests, app TypeScript checking, four affected edge entry-point checks, audit typechecking and whitespace checks also pass.

## Release standing

The known calibration defect from the regional evaluation is addressed. This completes the identified local software corrections from the three passes. Production deployment, real-database session smoke checks and on-device verification remain unperformed release tasks. No code change can establish a universal no-regression guarantee or improved catch accuracy from synthetic/reanalysis data alone.

No production changes or entitlement resets were performed. Keep the existing all-consumer release and rollback procedure in the parent report. This correction belongs to the same not-yet-deployed model revision; it does not create a new session identity.

## Reproduction

Run from `TightLinesAI`:

```sh
deno test --no-lock --node-modules-dir=none --allow-read --allow-env supabase/functions/_shared/howFishingEngine supabase/functions/_shared/recommenderEngine supabase/functions/_shared/openMeteoDailyDate.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/recommender/index.test.ts
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --output-dir=docs/audits/todays-bite-pass3/corroboration-fix
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --boundaries --output-dir=docs/audits/todays-bite-pass3/corroboration-fix
python3 scripts/audit/todays-bite-pass3/verify-corroboration-fix.py
python3 scripts/audit/todays-bite-pass2/verify.py docs/audits/todays-bite-pass3/corroboration-fix
deno run --no-lock --node-modules-dir=none --allow-read --allow-write scripts/audit/todays-bite-pass3/evaluate-regional-weather.ts /tmp/todays-bite-pass1-original/TightLinesAI/supabase/functions/_shared /tmp/todays-bite-pass2-pass1/_shared docs/audits/todays-bite-pass3/corroboration-fix
python3 scripts/audit/todays-bite-pass3/verify-regional-fix.py
```
