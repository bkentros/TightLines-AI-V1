# Recommender V3 — Product integration (post-tuning)

Internal note for **Section 5** of the post-tuning checklist: how the tuned freshwater V3 stack reaches the app, what the product layer may assume, and how to decide **engine vs UX** when something looks wrong.

Related: [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md) (baseline), [V3_AUDIT_INTERPRETATION.md](./V3_AUDIT_INTERPRETATION.md) (audit reading), [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md) (commands), [V3_REGRESSION_ANCHORS.md](./V3_REGRESSION_ANCHORS.md) (CI gates).

---

## 5.1 Integration surface (single V3 path)

| Layer | Path | Notes |
|--------|------|--------|
| **Edge** | `supabase/functions/recommender/index.ts` | Validates input, state×species gate, then **`runRecommenderV3Surface(engineReq)`** only. No alternate engine or legacy scorer. |
| **Engine** | `runRecommenderV3Surface` → `computeRecommenderV3` | All seasonal rows, scoring, and top-3 selection live under `supabase/functions/_shared/recommenderEngine/`. |
| **Client** | `lib/recommender.ts` → `invokeEdgeFunction('recommender', …)` | POST body matches edge `buildRecommenderEngineRequest` expectations. |

**Species keys (important):**

- **Wire / UI `SpeciesGroup`** (client + request body): `pike_musky`, `river_trout`, `largemouth_bass`, `smallmouth_bass` for supported freshwater.
- **Internal V3 species** after scope mapping: `northern_pike`, `trout`, etc.
- **API response `species`**: **`toLegacyRecommenderSpecies`** in `runRecommenderV3Surface.ts` — responses stay on **legacy** keys so `RecommenderView` and `SPECIES_DISPLAY` keep working.

Do **not** change the client to expect `northern_pike` in JSON without updating `RecommenderResponse` typing and all UI maps.

**Gating:** `lib/generated/recommenderStateSpecies.ts` is generated from `stateSpeciesGating.ts`; run `npx tsx scripts/generate-recommender-gating.ts` when backend gating changes (see `lib/recommenderContracts.ts` header comment).

---

## 5.2 Output stability (UI vs engine)

| Surface | File | Assumption | Risk |
|---------|------|--------------|------|
| Results layout | `components/fishing/RecommenderView.tsx` | Exactly **3** lure and **3** fly rows; `summary.daily_tactical_preference.*`; `RankedRecommendation` fields (`why_chosen`, `how_to_fish`, `color_style`, tactical enums). | Low — validated in `lib/recommender.ts` `isCachedResultValid` and edge tests. |
| Copy | `RecommenderView` | `opportunity_mix` ∈ {`conservative`,`balanced`,`aggressive`}; `surface_window` ∈ {`closed`,`clean`,`rippled`}. | If engine adds a new enum value, update UI mapping (product fix). |
| Images | `getLureImage` / `getFlyImage` / `getSpeciesImage` | Missing assets return null/undefined; cards still render. | UX polish only. |
| Scores | UI | **No numeric score** in product UI — do not add score-driven “confidence” bars without a product spec; engine scores are for audits. | N/A |

**Misread vs bug:** If matrix/coverage audits pass but a **specific real trip** feels wrong, capture scenario (species, state, context, clarity, date, env snapshot) and triage: copy/images → product; systematic wrong lane across many rows → engine with audit proof.

---

## 5.3 Release confidence

### Considered “done” for this phase

- Four-species **matrix-clean** baseline (see post-tuning state doc).
- **Single** production recommender path through **`runRecommenderV3Surface`**.
- Regression harness: `npm run audit:recommender:v3:freshwater:validate`, `npm run audit:recommender:v3:regression-baselines`, and targeted Deno tests under `supabase/functions/_shared/recommenderEngine/__tests__/`.

### Reopen **tuning** (engine / seasonal / scoring) when

- Matrix, coverage, or daily-shift **regressions** after a deliberate engine change.
- **Repeated** real-world failures that reproduce on archived matrix scenarios (not one-off copy complaints).

### Keep in **product / UX** layer when

- Wording, section intros, chip labels, or education copy.
- Image assets, loading skeletons, navigation, subscription messaging.
- **Cache versioning** (client cache key prefix) when response shape or semantics change — bump prefix and widen `clearRecommenderCache` if needed.

### Suggested pre-release checks (lightweight)

1. `cd TightLinesAI && npm run audit:recommender:v3:freshwater:validate`
2. `cd TightLinesAI && npm run audit:recommender:v3:regression-baselines`
3. `cd TightLinesAI && deno test --allow-read supabase/functions/recommender/index.test.ts`
4. `cd TightLinesAI && deno test --allow-read supabase/functions/_shared/recommenderEngine/__tests__/v3Foundation.test.ts supabase/functions/_shared/recommenderEngine/__tests__/v3Surface.test.ts`

Optional: manual smoke on device for the recommender screen (four species, lake + river where gated).

---

## Changelog (integration doc)

| Date | Change |
|------|--------|
| 2026-04-16 | Initial Section 5 note: single edge path, legacy species in API, UI inventory, release vs product triage, client cache key aligned to `recommender_v3` prefix. |
