# howFishingEngine — deterministic Today's Bite / How's Fishing engine

This is the active production path for Today's Bite reports and forecast scores.
The report surface is deterministic: scoring, timing, factor copy, summary copy,
Field Strategy, reliability notes, and solunar context are all generated from
engine-owned inputs. The old generative polish path has been retired.

## Layout

| Path | Role |
|------|------|
| `contracts/` | Types only: input, normalized output, report, regions, variables, Field Strategy tags, daypart tags |
| `context/` | US state bounds, **resolveRegion** (state + `RegionKey`) — no legacy engines |
| `config/` | `STATE_TO_REGION`, temp band tables, base weights, month/region modifiers, caps, freshwater elite envelopes |
| `request/` | Client `env_data` → `SharedEngineRequest` |
| `normalize/` | Raw env → `SharedNormalizedOutput` (+ `data_gaps`); also preserves forecast snapshot behavior |
| `score/` | Reweight + 0–100 score + band + driver/suppressor contribution surfaces |
| `summary/` | Deterministic free/paid summary and paid factor row copy |
| `timing/` | Deterministic timing family resolution, guarded priority ladder, notes, and trace |
| `tips/` | Field Strategy text + machine tags/presets |
| `narration/` | Active deterministic helpers for condition context, timing/solunar surface copy, and QA snapshots |
| `types.ts` | Re-exports `contracts/mod.ts` + `ActiveVariableScore` |

Legacy `coreIntelligence`, `engineV2`, `engineV3` are **not** imported here.
Legacy generative polish and payload/tip-focus helpers are also not part of the
active path.

## Active Flow

1. Edge/app callers build a `SharedEngineRequest`.
2. `buildSharedNormalizedOutput` normalizes weather, water, and forecast snapshot
   inputs.
3. `scoreDay` computes the score, band, weighted contributions, and guard caps.
4. `resolveTimingResult` selects timing windows with the guarded priority ladder.
5. `runHowFishingReport` assembles deterministic report copy:
   - score + `summary_line`
   - paid driver/suppressor factor rows
   - timing insight and daypart note
   - reliability and solunar notes
   - Field Strategy on the legacy `actionable_tip` wire field

Tackle Box / recommender owns tackle-specific advice. Today's Bite report copy
explains the condition read.

## Tests

```bash
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/polishSafeSurfaceCopy.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/scoreDeterminism.test.ts
deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/forecastScoresEngineParity.test.ts
```

## Client type mirror

`TightLinesAI/lib/howFishingRebuildContracts.ts` — keep aligned with `contracts/report.ts` and related exports.
