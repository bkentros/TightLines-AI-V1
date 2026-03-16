# Engine V2 — Golden Fixture Test Runner

## Purpose
Validates the deterministic engine against the 18 golden scenario fixtures defined in:
`docs/tightlines_v1_engine_golden_test_scenario_fixtures.json`

## How to Run

### From the project root (Deno):
```bash
cd TightLinesAI
deno run --allow-read supabase/functions/_shared/engineV2/__tests__/goldenFixtures.test.ts
```

### As a module (import and call):
```typescript
import { runGoldenFixtureTests, printFixtureTestReport } from './goldenFixtures.test.ts';
import fixtures from '../../docs/tightlines_v1_engine_golden_test_scenario_fixtures.json';

const results = runGoldenFixtureTests(fixtures);
printFixtureTestReport(results);
```

## Result Types

| Icon | Type | Meaning |
|------|------|---------|
| ✅ | PASS | Score band, confidence, and key regression checks all pass |
| 🟡 | SOFT | Score band correct but window shape or confidence is approximate — calibration needed |
| ❌ | FAIL | Score band outside expected range, OR a regression check explicitly failed |

## Important Caveats

The fixture scenarios describe conditions **qualitatively** (e.g., `"stable_warm"`, `"post_front"`).
The test runner maps those to **approximate numeric inputs**. This is not perfect — the mapping logic
in `mapFixtureToSpec()` is the key place for calibration over time.

**Soft-passes are expected** for some scenarios, especially those involving:
- Window timing shape (fixture says "narrow" but engine may produce one merged block)
- Confidence band boundary cases

**Hard failures** indicate either a score band regression or a named regression check violation.

## Regression Checks

These are the cross-scenario invariants enforced:

1. `manual_temp_should_raise_confidence` — S03, S15: manual freshwater temp → high/very_high confidence
2. `tide_dominates_in_salt_and_brackish` — S09–S13, S17–S18: tide/current in drivers or window labels
3. `solunar_cannot_rescue_bad_days` — S02, S08, S17: even strong solunar doesn't lift to Good/Great
4. `storm_threat_caps_good_tide` — S17: storm/wind suppression keeps score at Poor/Fair

## Maintenance

When the engine logic is updated (e.g., new weight calibration, new assessments), re-run the fixture tests
to confirm no regressions. Update `mapFixtureToSpec()` if new qualitative descriptors appear in the fixtures.
