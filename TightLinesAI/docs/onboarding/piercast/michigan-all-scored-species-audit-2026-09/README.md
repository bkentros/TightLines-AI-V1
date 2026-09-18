# Michigan all-scored-species audit

This package verifies every current Michigan Formula v3 city/species score and every Michigan city × catalog-species roster cell. Start with [AUDIT_REPORT.md](AUDIT_REPORT.md).

Regenerate the machine artifacts from the `TightLinesAI` directory:

```sh
node --import tsx docs/onboarding/piercast/michigan-all-scored-species-audit-2026-09/generate-audit.ts
```

The generator fails unless it finds seven Michigan cities, 19 catalog species, 133 roster cells, 72 scored pairs, an explicit decision for every no-score cell, and peak values within 2.1–10.0.
