# ZIP Integration Summary — integrate/zip-update

**Date:** 2026-03-15  
**Source:** `/Users/brandonkentros/Downloads/TightLinesAI/`  
**Target:** `TightLinesAI/` (workspace project)  
**Branches:** `safety/pre-zip-integration` (fallback), `integrate/zip-update` (this work)

---

## 1. Branch strategy

- **safety/pre-zip-integration** — Created from `main` before any changes. Your current project is preserved here as a fallback.
- **integrate/zip-update** — Created from `main`; all replacement and fixes were done on this branch. Do not merge to `main` until the app is validated.

---

## 2. Files replaced (modified)

All of these were overwritten by the ZIP contents; they are the tracked files that actually changed.

| Path | Notes |
|------|--------|
| `TightLinesAI/app.json` | Also fixed: `adaptiveIcon.foregroundImage` → `android-icon-foreground.png` (file was missing). |
| `TightLinesAI/app/how-fishing.tsx` | Unified How's Fishing screen, manual temp override UI, cache/run logic. |
| `TightLinesAI/components/fishing/DataQualityNotice.tsx` | Updated for engine/data quality. |
| `TightLinesAI/components/fishing/KeyFactors.tsx` | Key factors from engine. |
| `TightLinesAI/components/fishing/ReportView.tsx` | Report layout, water-type tabs, time windows. |
| `TightLinesAI/components/fishing/ScoreBreakdown.tsx` | Score breakdown from engine. |
| `TightLinesAI/components/fishing/ScoreCard.tsx` | Score card from engine. |
| `TightLinesAI/components/fishing/TimeWindows.tsx` | Time windows from engine. |
| `TightLinesAI/components/fishing/index.ts` | Barrel export; added `ExpandableSection`. |
| `TightLinesAI/lib/env/types.ts` | Env types; includes `manual_freshwater_water_temp_f`. |
| `TightLinesAI/lib/howFishing.ts` | Cache, bundle types, engine output types. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/derivedVariables.ts` | Derived variables, freshwater temp override, 32–99°F clamp. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/fishBiology.ts` | Fish biology / seasonal logic. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/index.ts` | Engine entrypoint, seasonal context, time windows. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/scoreEngine.ts` | Core scoring, seasonal baseline, daily opportunity. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts` | Time-window engine. |
| `TightLinesAI/supabase/functions/_shared/coreIntelligence/types.ts` | Engine types. |
| `TightLinesAI/supabase/functions/_shared/envAdapter.ts` | Env → engine snapshot; manual freshwater temp passed through and clamped. |
| `TightLinesAI/supabase/functions/how-fishing/index.ts` | How-fishing orchestrator; uses `env_data` from client, runs engine + LLM. |

---

## 3. Files added

| Path | Notes |
|------|--------|
| `TightLinesAI/components/fishing/ExpandableSection.tsx` | Reusable expandable section; exported from `components/fishing/index.ts`. |
| `TightLinesAI/docs/PASS_1_ENGINE_REFACTOR_NOTES.md` | Engine refactor notes. |
| `TightLinesAI/docs/PASS_5_FINAL_POLISH_NOTES.md` | Final polish notes. |

---

## 4. Conflicts

- **None.** Rsync overwrote with ZIP contents; no merge conflicts. `.env` was excluded so your existing env was preserved.

---

## 5. Fixes made

1. **app.json**  
   - `android.adaptiveIcon.foregroundImage` pointed to `./assets/adaptive-icon.png` (missing).  
   - Set to `./assets/android-icon-foreground.png` so Expo config validation passes.

2. **Peer dependencies**  
   - Installed `expo-asset` and `expo-font` with `npx expo install ... -- --legacy-peer-deps` so Expo Doctor peer checks pass.

3. **.env**  
   - Not overwritten; your existing `TightLinesAI/.env` was left as-is.

---

## 6. Verification performed

- **TypeScript:** `npx tsc --noEmit` — passed.
- **Lint:** No errors in `app/how-fishing.tsx`, `components/fishing/ReportView.tsx`, `lib/howFishing.ts`.
- **Supabase function names:** Client and docs use `get-environment` and `how-fishing`; edge functions match.
- **Expo Doctor:** Config schema and peer dependency checks pass. Remaining: Xcode version (environment-specific) and optional patch version mismatches (expo-dev-client, expo-image-picker, expo-notifications, expo-router, react-dom).

---

## 7. Validation checklist (for you)

Run these on the **integrate/zip-update** branch before merging to `main`:

1. **Freshwater inland report** — Lake tab, River tab.
2. **Coastal report** — Saltwater, Brackish, Coastal freshwater tabs.
3. **Manual freshwater temp override** — Clamps 32–99°F, overrides inferred temp, clearing reverts to inferred.
4. **Time formatting** — 12-hour only, local timezone abbreviation, no military time.
5. **Daily report behavior** — Same location + same local day → stable report; new report after local midnight; different location → different report.
6. **App startup/build** — `npx expo start --dev-client --host lan` (and EAS build if you use it); confirm no Expo/TypeScript/dependency/Supabase issues.

---

## 8. Next steps

1. Test the app on device from `integrate/zip-update` (Metro: `npx expo start --dev-client --host lan`).
2. Deploy or test Edge Functions (`how-fishing`, `get-environment`) if you use deployed Supabase.
3. When satisfied, merge into `main`:  
   `git checkout main && git merge integrate/zip-update`
4. To roll back:  
   `git checkout main && git reset --hard safety/pre-zip-integration`
