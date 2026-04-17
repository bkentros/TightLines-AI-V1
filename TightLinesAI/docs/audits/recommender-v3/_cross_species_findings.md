# Recommender V3 Report Audit — Cross-Species Findings

Audit scope: 20 scenarios (5 per species) across smallmouth_bass, largemouth_bass, pike_musky, river_trout. This file synthesizes themes that recur across species, classifies them as engine-level vs archetype-level vs copy-template vs seasonal-row issues, and provides a prioritized fix queue.

**Recalibration (2026-04-17):** Product owner confirmed trout uses a **streamer-only** fly pool by design. Findings that required dry flies / nymphs / emergers / terrestrials are retracted; the remaining trout issues are narrower but still material. See `trout/_summary.md` for the full recalibrated trout rollup.

**Code-level confirmations from this audit:**
- Fit-value semantics in `scoring/scoreCandidates.ts#dimensionFit` are `{4.0 | 2.5 | 1.25 | 0.25 | -2.5}` for `{primary-slot hit | secondary-slot hit | tertiary-slot hit | quaternary-slot hit | miss}`. The detail-text fix in P1 #8 below uses this exact set.
- Pike-01 / Pike-03 fly-trio "inversion" is **not** a bug — see Finding 1.4 below.

## 1. Universal themes across species

### 1.1 [BLOCKER] Species-agnostic `temperature_metabolic_context` thresholds

**Where it appears:** pike-02 (63°F → cold_limited, fall feed misclassified as suppressed), pike-05 (78°F → neutral, should be warm_limited), trt-02 (55°F → cold_limited), trt-05 (55°F → cold_limited). Bass scenarios (LMB/SMB) are internally consistent because the current thresholds were clearly tuned for warmwater bass.

**Root cause:** The classifier that emits `temperature_metabolic_context` uses a single set of thresholds regardless of species. Bass/LMB thermoregulate at ~70°F optimum; pike at ~55°F; trout at ~55°F. Applying bass thresholds to pike/trout produces catastrophically wrong day reads on fall-feed pike and any mid-temperature trout scenario.

**Fix:** Make thresholds species-specific. Concrete proposal:

| species | cold_limited | optimal | warm_limited |
| --- | --- | --- | --- |
| largemouth_bass | < 52°F | 65-80°F | > 86°F |
| smallmouth_bass | < 48°F | 58-75°F | > 80°F |
| pike_musky | < 40°F | 45-65°F | > 72°F |
| river_trout | < 40°F | 45-65°F | > 68°F |

Wire into `deriveDailyPreference` so the shift calculations receive species-correct context. Could live on the species profile loaded from seasonal data, or as a static table in the temperature classifier module.

### 1.2 [BUG] `buildColumnHint` contradicts `how_to_fish_variants` selection

**Where it appears:** smb-02 (`inline_spinner`, `muddler_sculpin`), smb-03 (3 picks), smb-05 (`muddler_sculpin`), trt-01 / trt-02 / trt-04 / trt-05 (`muddler_sculpin`, `woolly_bugger`). A new "Keep it high/low in the zone" hint is appended after a how_to_fish template that describes the opposite column.

**Root cause:** In `supabase/functions/_shared/recommenderEngine/v3/recommendationCopy.ts`, `buildColumnHint` fires off `resolved.daily_preference.preferred_column` without inspecting the selected variant. `selectHowToFishTemplate` is likewise not column-aware.

**Fix (pick one or stack):**
- **A** (template metadata): annotate each `how_to_fish_variants` entry with an `implied_column: "upper" | "mid" | "bottom" | "surface"`. `selectHowToFishTemplate` prefers variants whose `implied_column` matches day preference. `buildColumnHint` suppresses itself when the selected variant's implied column already matches.
- **B** (text inspection): cheap keyword pass — if the selected template text contains explicit column cues ("bottom", "surface", "mid-depth"), skip the hint.
- **C** (archetype re-authoring): remove bottom-drag variants from archetypes whose `primary_column` is not bottom.

A combination of **A** (structural fix) and **C** (data cleanup) is the durable solution.

### 1.3 [BUG] Scoring `detail` strings don't differentiate primary (4.0) vs secondary (2.5) / tertiary (1.25) / quaternary (0.25) / miss (-2.5) fits

**Where it appears:** every scenario with any pick that has a non-primary breakdown value — smb-01, smb-02, smb-03, lmb-02, pike-01, pike-02, pike-03, pike-04, pike-05, trt-01 through trt-05.

**Root cause:** `scoring/scoreCandidates.ts:508-524` emits the same `"It fits / lines up / matches today's X preference."` detail string regardless of the computed fit value from `dimensionFit` (`scoring/scoreCandidates.ts:52-68`), which returns one of `{4.0, 2.5, 1.25, 0.25, -2.5}`.

**Fix:** In the three detail builders (`column_fit`, `pace_fit`, `presence_fit`) in `scoring/scoreCandidates.ts`, branch on the numeric fit value. Suggested phrasing:
- `4.0` → "Sits in today's primary {column|pace|presence} lane."
- `2.5` → "Overlaps as a secondary option for today's {column|pace|presence}."
- `1.25` → "Touches today's tertiary {column|pace|presence} lane."
- `0.25` → "Only grazes today's {column|pace|presence} preference."
- `-2.5` → "Does not match today's {column|pace|presence}."

### 1.4 [FYI] Rank-order auto-flag is a false-positive generator (pike-01 / pike-03 dismissed)

**Where it appears:** smb-01, smb-02, lmb-02 (×2), pike-01, pike-03.

**Root cause (resolved 2026-04-17):** The auto-flag in `scripts/recommender-v3-report-audit/flags.ts` compares emitted `score` across the trio. But `topThreeSelection.ts` selects slot-by-slot with a **per-slot** `diversity_bonus` that is recomputed against the currently-selected set (see `topThreeSelection.ts:98-134`, `changeupBonus`). The best-match slot has `diversity_bonus` forcibly reset to `0` at line 216, so the emitted `diversity_bonus` on picks 2 and 3 cannot be directly summed with `score` to reconstruct the per-slot ranking the engine actually used.

**Concretely for pike-01 / pike-03:** when slot 2 was selected, `frog_fly` and `large_articulated_pike_streamer` were both coherent non-lead-family candidates. The slot-2 diverse sort (`topThreeSelection.ts:276-279`) ranks by `diversity_bonus DESC, then compareScored`. `frog_fly` won the slot-2 diversity comparison against the lead-only set. `pike_streamer` was then the best remaining changeup for slot 3. **This is working as designed.**

**Fix:** Remove the rank-order inversion auto-flag entirely from `flags.ts`, OR downgrade it to an FYI-only diagnostic with a footnote explaining per-slot diversity reordering. There is no clean comparator the flag could use without re-running the full slot-by-slot selection.

### 1.5 [POLISH] `buildWhyChosen` forage attribution can cite forage the archetype does not imitate

**Where it appears:** pike-01 ("Hollow-Body Frog stays in play when bluegill_perch is relevant"). Likely occurs elsewhere but was easiest to spot on an archetype with a specific forage signature.

**Root cause:** Forage hook phrasing pulls from `seasonal_row.secondary_forage` without checking `archetype.forage_matches`.

**Fix:** In `recommendationCopy.ts#buildWhyChosen`, emit the forage sentence only when `seasonal_row.*_forage ∩ archetype.forage_matches ≠ ∅`, and use the intersected forage key for the phrase.

## 2. Engine-level vs archetype-level vs copy-template vs seasonal-row

| Layer | Themes |
| --- | --- |
| **Engine logic** | 1.1 species-agnostic metabolic context. |
| **Archetype authoring** (`candidates/*.ts`) | `muddler_sculpin.primary_column` (should be bottom); `inline_spinner.how_to_fish_variants[1]` (bottom-roll on mid-primary); `weightless_stick_worm.how_to_fish_variants` (bottom-drag on upper-primary). Trout streamer-only pool is by design (not a gap). |
| **Copy templates** (`recommendationCopy.ts`, `scoring/scoreCandidates.ts`, `buildWhyChosen`, `selectHowToFishTemplate`, `buildColumnHint`) | 1.2 column-hint vs variant selection; 1.3 fit-value detail text (covers all of 4.0/2.5/1.25/0.25/-2.5); 1.5 forage attribution; generic "It matches the column/pace…" opener across all trio picks. |
| **Seasonal-row authoring** | `river_trout` rows: `surface_seasonally_possible=false` blocks `mouse_fly`/`popper_fly` under streamer-only scope; `smallmouth_bass|great_lakes_upper_midwest|7|freshwater_river`: missing `slow` pace; `pike_musky|great_lakes_upper_midwest|6|freshwater_river`: presence order authored backwards for stained water; SE Atlantic LMB April pace_shift produces "fast" primary (arguable authoring vs engine shift tuning). |
| **Auto-flag / auditor harness** | Too-loose "bottom" keyword match in `flags.ts`; rank-order inversion auto-flag is fundamentally incompatible with the per-slot `diversity_bonus` model (see 1.4). |

## 3. `_lane_fit_diagnostics.md` entries — recommended resolution

### Entry 1: `smallmouth_bass | mountain_west | 6 | freshwater_river` × lure `ned_rig`

Archetype `ned_rig`: primary_column=bottom, pace=slow, presence=subtle. Row allowed_columns=[surface,upper,mid] (no bottom), allowed_paces=[medium,fast], allowed_presence=[moderate,bold].

**Recommendation: (C) — the seasonal row is too narrow.** SMB in Mountain West freshwater rivers in June absolutely eat from the bottom (ned rigs, tubes, and small jigs are core patterns on cold western rivers). The row should include `bottom` in allowed_columns and `slow` in allowed_paces; `subtle` in allowed_presence. This matches the SMB post-spawn river pattern everywhere else in the country and the native mountain-west smallmouth fishery (e.g. Boise, Henrys Fork tailwater, Colorado stretches).

Justification: Removing ned_rig from the pool (option B) would strip the catalog of its canonical smallmouth finesse tool in a region where finesse is arguably the dominant presentation. Broadening the archetype (option A) is also wrong — a ned rig is a bottom/slow/subtle tool by design.

After revision, confirm the `topThreeSelection` can still pick faster options when daily signals push the presentation hotter — a properly-authored row with `allowed_paces=[slow,medium,fast]` and `allowed_columns=[bottom,mid,upper,surface]` and `allowed_presence=[subtle,moderate,bold]` gives the daily shift layer room to work.

## 4. Prioritized fix queue

Ordered by severity + blocker-to-fix sequencing (earlier items unlock or reduce noise for later ones).

### P0 — BLOCKERS

1. **Species-specific `temperature_metabolic_context` thresholds.** Effort: S (half day). Impact: fixes every pike/trout day read that hinges on temperature; pike-02, pike-05, trt-02, trt-05 all depend on this. Concrete thresholds are in Finding 1.1 above. _File:_ `deriveDailyPreference` + species profile / temperature classifier module.

### P1 — BUGS (copy/template/archetype/seasonal authoring)

2. **Re-author `river_trout` seasonal rows** — flip `surface_seasonally_possible=true` on April–October (confirm winter rows with product) so `mouse_fly` / `popper_fly` streamers can be picked by the daily gate. `primary_forage=baitfish` stays as-is per product direction. Effort: XS. _File:_ `v3/seasonal/riverTrout.ts` (or equivalent).
3. **Fix `buildColumnHint` / `selectHowToFishTemplate` column-awareness.** Preferred path: add `implied_column` metadata to each `how_to_fish_variants` entry, have `selectHowToFishTemplate` prefer variants whose `implied_column` matches day preference, and have `buildColumnHint` suppress itself when the selected variant already matches. Effort: S-M. Impact: eliminates the most-cited BUG category in the audit. _File:_ `recommendationCopy.ts`.
4. **Re-author `muddler_sculpin.primary_column=bottom`.** Effort: XS. Impact: fixes recurring muddler flag across SMB and trout. _File:_ `candidates/flies.ts`.
5. **Re-author `inline_spinner.how_to_fish_variants`** — drop/rewrite the bottom-roll variant so it does not fire on mid/upper days. Effort: S. _File:_ `candidates/lures.ts`.
6. **Re-author `weightless_stick_worm.how_to_fish_variants`** — remove the bottom-drag variant; replace with upper/mid dead-stick technique (the stick worm's canonical use). Effort: S. _File:_ `candidates/lures.ts`.
7. **Scoring `detail` text branching on fit value.** Use the full `{4.0, 2.5, 1.25, 0.25, -2.5}` set per Finding 1.3. Effort: S. _File:_ `scoring/scoreCandidates.ts:508-524`.
8. **`buildWhyChosen` forage intersection fix.** Emit the forage sentence only when `seasonal_row.*_forage ∩ archetype.forage_matches ≠ ∅`. Effort: S. _File:_ `recommendationCopy.ts`.
9. **Auto-flag tuning (`flags.ts`):**
    - **Remove or demote** the rank-order inversion check (per Finding 1.4 — no clean comparator without re-running slot-by-slot selection).
    - "Bottom-copy vs primary_column" check restricted to drag/crawl/slow-roll verbs.
    - Surface-window violation check restricted to `is_surface=true` or `primary_column=surface`.
    - Low-diversity auto-flag downgraded to FYI when `opportunity_mix=conservative`.
    Effort: S. Impact: eliminates auditor noise. _File:_ `scripts/recommender-v3-report-audit/flags.ts`.

### P2 — BUGS (seasonal row authoring)

10. **Broaden `smallmouth_bass|great_lakes_upper_midwest|7|freshwater_river`** to allow slow pace. Effort: XS. _File:_ seasonal data.
11. **Broaden `smallmouth_bass|mountain_west|6|freshwater_river`** (resolves lane-fit diagnostic entry — see §3 below for (C) justification). Effort: XS.
12. **Reorder `pike_musky|great_lakes_upper_midwest|6|freshwater_river` presence** to moderate/bold primary. Effort: XS.

### P3 — POLISH (engine/tuning)

13. **Pace-shift cap under 65°F for warmwater species** (prevents fast primary on cool pre-spawn/post-spawn bass days). Effort: S. _File:_ `deriveDailyPreference`.
14. **Surface-reservation logic** — when `surface_window` is open and `opportunity_mix=aggressive`, boost `is_surface=true` archetypes so at least one surface option contends for the change_up slot. Effort: S. _File:_ `scoreCandidates.ts` / `topThreeSelection.ts`.
15. **Lane-diversity term in `diversity_bonus`** — reward lane diversity across the trio, not only family diversity. Effort: S. _File:_ `topThreeSelection.ts#changeupBonus`.
16. **Deep-structure weighting path** for summer deep LMB (mid_deep seasonal location + day column=bottom). Effort: M. _File:_ `scoreCandidates.ts`.
17. **Tertiary column in `matchesPreferredColumn`** — let tertiary matches fire softer hints. Effort: XS.
18. **Rotating why_chosen opener across trio picks** (avoid three identical leads). Effort: S. _File:_ `recommendationCopy.ts#buildWhyChosen`.

### P4 — FYI / observation-only

19. **Scenario tuning note:** SE Atlantic LMB April pre-spawn environment pushes the engine to `pace=fast` which arguably reads too hot for a 62°F pre-spawn day — may be a combination of scenario input and engine shift tuning (addressed by P3 #13).

## 5. Open questions (all resolved 2026-04-17)

1. ~~**pike-01 / pike-03 fly-trio "ordering inverted"**~~ — **Resolved.** After reading `topThreeSelection.ts`, this is working as designed: `diversity_bonus` is recomputed **per slot** against the growing `selected` set (slot 2 scored against lead only, slot 3 scored against lead + slot 2), so the emitted `diversity_bonus` values on picks 2 and 3 cannot be summed with `score` to reproduce the slot-by-slot decision. The auto-flag is fundamentally incompatible with this model and should be removed (P1 #9).
2. ~~**Breakdown value semantics**~~ — **Resolved.** `scoring/scoreCandidates.ts#dimensionFit` (lines 52-68) emits `{4.0, 2.5, 1.25, 0.25, -2.5}` for `{primary slot hit, secondary slot hit, tertiary slot hit, quaternary slot hit, miss}`. Detail-text fix in P1 #7 uses this exact set.
3. **Trout streamer-only scope** — **Confirmed by product owner.** Dry flies, nymphs, emergers, and terrestrials are intentionally out of scope for V3.

## 6. Final severity counts (recalibrated 2026-04-17, across all 20 scenarios)

- [BLOCKER]: **1 category** — species-agnostic temperature thresholds (root finding 1.1; surface instances: pike-02, pike-05, trt-02, trt-05).
- [BUG]: ~15 — recurring column-hint/variant contradictions, detail-text fit value, archetype authoring mismatches (muddler, inline_spinner, stick_worm), forage attribution, surface-seasonal gating on trout, bottom-keyword auto-flag over-firing.
- [POLISH]: ~12 — copy openers, trout forage key granularity, surface-reservation logic, lane-diversity term, deep-structure weighting.
- [FYI]: ~20 — scenario environment polish, diagnostics-only observations.

Net delta from pre-recalibration: 7 trout-related BLOCKERs retracted as "by design"; 1 pike role-assignment open-question resolved as working-as-designed.

## 7. Top 3 recommended actions (streamer-only scope)

1. **Species-specific `temperature_metabolic_context` thresholds** (P0 #1). Single smallest change with the largest day-read impact — resolves the only remaining BLOCKER category.
2. **Column-hint / variant-selection column awareness + `muddler_sculpin.primary_column=bottom`** (P1 #3 + #4). Together these resolve roughly half of all BUG findings across all species.
3. **Trout seasonal row surface flip + auto-flag cleanup** (P1 #2 + #9). Unblocks mouse/popper streamer recommendations and eliminates the auditor-harness noise that hides real issues in future audits.
