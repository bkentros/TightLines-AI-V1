# St. Joseph–Harrisville PierCast Pass 1

Reproducible research-only onboarding package for five Michigan cities, reviewed 2026-09-19.

## Reproduce and validate

From the repository root:

```bash
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass1/generate-pass1.mjs
node docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass1/generate-pass1.mjs --check
```

The generator reads the preserved raw dashboard snapshot and deterministically regenerates every derived JSON, CSV, Markdown, and validation artifact. To intentionally refresh the external snapshot (network required), run `extract-michigan-creel.mjs`, inspect source changes, then regenerate.

## Boundary

This directory assigns no numeric score and makes no runtime, migration, public-catalog, deployment, or build change. The five cities remain private research. The current 22-city public experience is untouched.

## Files

- `PASS1_REPORT.md` — findings, methods, and unresolved questions.
- `PASS2_HANDOFF.md` — disciplined next-pass queue.
- `site-boundaries.json` — 16 structure records with routes, coordinates, access, construction, disposition, and limitations.
- `source-ledger.json` — full mandatory source metadata.
- `species-decisions.json` / `species-decision-matrix.csv` — exactly 95 catalog decisions.
- `out-of-catalog-leads.json` — required global leads kept outside the catalog.
- `stocking-records-reviewed.json` — stocking evidence kept separate from pier magnitude.
- `michigan-creel-pier-dock-raw.json` — preserved official raw extract.
- `michigan-creel-pier-dock-reduced.json` / `.csv` — deterministic reduction.
- `validation-report.json` — machine-checkable completion proof.
- `extract-michigan-creel.mjs` — external-source snapshot extractor.
- `generate-pass1.mjs` — deterministic generator and check mode.
