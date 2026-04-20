# Known authoring issues (recommender engine tests)

> **Post–rebuild cutover:** The old V3-TS “Phase 4” and cross-species pool tests under
> `recommenderEngine/__tests__/` were **retired**. Production seasonal rows live in
> `data/seasonal-matrix/*.csv` → `npm run gen:seasonal-rows-v4` → `v4/seasonal/generated/*.ts`.

Structured checks on **generated** seasonal rows:

- `supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`

Legacy V3 seasonal authoring (`v3/seasonal/*.ts`) remains for **`legacyV3`** tooling only — do not treat embedded V3 tables as the live rebuild source of truth.

If Deno surfaces new inconsistencies in **generated** output, document them here with approval before changing CSV biology.
