# Remaining-species implementation validation

Validated on 2026-09-12 from starting commit `2e6d73d` on `develop/cross-platform-next`.

- All 45 pairings reviewed: 24 excluded, 18 historical/unresolved, three narrow-season/structure-specific leads. No additional numerical onboarding claimed.
- Preserved 12,996 Michigan public Pier/Dock estimates, four raw responses with SHA-256 checksums, 1,872 monthly comparisons, 74 source records, nine thermal reviews and 2,340 weekly unavailable/excluded rows.
- `npm run check:pier-cast:remaining-species`: four numerical extraction tests passed; raw checksums and deterministic artifacts match.
- `npm run qa:pier-cast:foundation`: 120 passed, zero failed, including both handler suites and all engine tests.
- `npx tsc --noEmit`: passed.
- `npm run generate:pier-cast:weekly-ratings`: regenerated 1,040 core weekly rows and 20 core curves with no tracked changes.
- `npm run check:pier-cast:seasonal-replay`: passed; existing retrospective results unchanged.
- `git diff --check`: passed.
- Local/remote migration histories match through `20260911183000`; no schema change or migration required.
- Both existing PierCast functions deployed with JWT verification retained. Production public catalog returns HTTP 200 with an empty city list; anonymous owner-review catalog and outlook return HTTP 403.

The configuration change replaces earlier broad candidate inheritance for the nine additions with reviewed limitations and unavailable seasonal curves. It changes no core curve, formula, daily score-lock policy, live-condition refresh, LMHOFS source, access route, UI or public-release gate.

Numerical onboarding remains unresolved. Required evidence includes current exact-covered-structure intentional targeting and seasonal catch/effort, lawful methods, cross-species calibration against the frozen core scale, and applicable thermal response. Passing software checks does not supply those missing scientific inputs.
