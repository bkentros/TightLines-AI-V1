# Phase 2 private research integration validation

The private research calculations are integrated. Live rating activation remains explicitly deferred; this is not empirical validation or public release approval.

## Delivered

- Eight provisional thermal profiles produce private sensitivity output for 14 accepted city/species pairings: Ludington three, Grand Haven five, Manistee six. Frankfort–Elberta and Sheboygan receive no additions.
- Two round-whitefish pairings retain continuous annual seasonal baselines but return no live thermal-combined hypothesis. The newly preserved juvenile experiment cannot calibrate adult pier feeding.
- All 16 pairings retain their structure attribution, fishing mode, regulation scope and scientific blocking reasons. A newspaper's Manistee North Pier attribution is distinguished from its linked DNR report, which does not name a side.
- The 2026 Michigan regulation guide is preserved with SHA-256 verification. Printed pages 12, 13, 21 and 31 were visually inspected. Bass catch-and-release and possession seasons remain distinct; Grand Haven November gear restrictions apply across species. Review-period expiry is visible in the private output.
- Twelve preserved snapshots and three documented retrieval failures across 15 Phase 2 source records. The prior annual/thermal source registers remain linked.
- The nine offline thermal drafts, 2,889 sampled fits and 6,656 hypothetical weekly scenarios remain reproducible. Offline round-whitefish sensitivity is explicitly not a selected adult response.

## Runtime contract

The owner-authorized `/review/outlook` response adds `cities[].additionalSpeciesResearch`. Each entry is labeled `surface_temperature_sensitivity_not_validated_forecast`; `runtimeEligible` and `publicEnabled` remain false. Fourteen entries contain hypothetical daily calculations using the existing hourly interpolation, daily aggregation and scoring formula. Two contain seasonal baselines only. All preserve independent annual curves, including weak periods and December–January interpolation.

Additional research never enters `dates.species`, headline selection, immutable daily snapshots, the shadow forecast ledger, active species profiles or public catalogs. The existing four-species scoring and daily-lock contracts are unchanged. There is no UI change in this commit.

The LMHOFS surface input is not newly approved as fish-experienced or bottom temperature. Covered-side uncertainties and adult round-whitefish response remain explicit activation deferrals. Passing tests does not resolve these scientific questions.

## Verification

- Complete PierCast suite: **130 passed, zero failed**.
- TypeScript: `npx tsc --noEmit` passed.
- Deno checked the runtime pipeline and Phase 2 generator successfully.
- Phase 2 generators, source hashes, sampled fits, sensitivity outputs and evidence report: current.
- Phase 1 annual research: six tests and generated artifacts passed.
- Original remaining-species evidence: four tests and generated artifacts passed.
- Completed-core seasonal replay: current; core seasonal and thermal numeric configuration unchanged.
- New integration tests verify exactly 16 city-specific research entries, 14 combined hypotheses, two thermal deferrals, blocked promotion, no headline/snapshot contamination, cold-water calculations in every month, expired regulation-review status, out-of-domain inputs and incomplete daily coverage.

## Deployment reconciliation

No schema or database data change was required. The linked migration list remains matched through `20260911183000`.

`pier-cast` deployed as version **17**, active with JWT verification enabled. `pier-cast-ingest` remains version **12**, active with JWT verification enabled; its scoring and ingestion contract did not require deployment. Deployed smoke checks returned an empty public catalog (HTTP 200, zero cities) and denied anonymous access to the owner outlook (HTTP 403). Authorized research contents were verified in handler/pipeline tests; no authenticated production owner session was available for a full response smoke check.

The pre-existing `app/pier-cast-review.tsx` working-tree edit was preserved and excluded from the Phase 2 commit.

## Phase 3 handoff

Review the full annual lineup together, including overlapping seasonal peaks, city-specific strength and weak periods. Use the 16 annual baselines and 14 provisional combined hypotheses; keep both round-whitefish thermal responses visibly deferred. Additional species are not validated live forecasts. Activating them still requires the recorded structure, thermal and temperature-representation gates to be satisfied; public release remains disabled.
