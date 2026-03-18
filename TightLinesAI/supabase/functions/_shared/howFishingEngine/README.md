# howFishingEngine — canonical How's Fishing rebuild

**Authority:** `tlai_engine_rebuild_docs/` (ENGINE_REBUILD_MASTER_PLAN, VARIABLE_THRESHOLDS_AND_SCORING_SPEC, TEMPERATURE_AND_MODIFIER_REFERENCE, HOWS_FISHING_REPORT_AND_NARRATION_SPEC).

## Layout

| Path | Role |
|------|------|
| `contracts/` | Types only: input, normalized output, report, narration, regions, variables, tip/daypart tags |
| `context/` | US state bounds, **resolveRegion** (state + `RegionKey`) — no legacy engines |
| `config/` | `STATE_TO_REGION`, temp band tables, base weights, month/region modifiers, caps |
| `request/` | Client `env_data` → `SharedEngineRequest` |
| `normalize/` | Raw env → `SharedNormalizedOutput` (+ `data_gaps`) |
| `score/` | Reweight + 0–100 score + band + drivers/suppressors |
| `tips/` | Actionable tip + daypart strings **and** machine tags/presets |
| `narration/` | `NarrationPayload` for LLM polish |
| `types.ts` | Re-exports `contracts/mod.ts` + `ActiveVariableScore` |

Legacy `coreIntelligence`, `engineV2`, `engineV3` are **not** imported here.

## Tests

```bash
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
```

## Client type mirror

`TightLinesAI/lib/howFishingRebuildContracts.ts` — keep aligned with `contracts/report.ts` and related exports.
