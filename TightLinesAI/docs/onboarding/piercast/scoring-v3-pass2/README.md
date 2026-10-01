# PierCast Scoring v3 — Pass 2

Pass 2 implements the evidence-reviewed Pass 1 calibrations as a private, fail-closed Formula v3 shadow system. It does not promote Formula v3, change Formula v2, rewrite a historical daily snapshot, or expose a v3 score publicly.

## Formula contract

For each supported city/species/mode:

```text
seasonalPotential = 1 + (fisheryStrength - 1) × seasonalAvailability
temperatureModifier = 0.30 + 0.70 × temperatureSuitability
modeScore = 1 + (seasonalPotential - 1) × temperatureModifier
speciesScore = maximum(modeScore); modes are never summed
```

`fisheryStrength` is the evidence-reviewed absolute cross-city ceiling from Pass 1. `seasonalAvailability` is a continuous recurring date curve from 0 to 1. `temperatureSuitability` is the existing provisional shared-species nearshore surface-temperature fit. At ideal availability and fit, the score equals the researched fishery strength. Temperature can reduce opportunity but cannot exceed or create an unsupported fishery.

## Implemented boundary

- 9 cities × 4 core salmonids = 36 admitted calibrations.
- 98 separate seasonal opportunity modes.
- Generated, hash-pinned runtime configuration; hand edits are prohibited.
- Owner-only `/review/v3/outlook` route.
- Exact same-issue, complete 9-city LMHOFS requirement.
- Separate append-only 180-row shadow ledger and authenticated scheduled operation.
- Explicit shadow override required to evaluate disabled configuration.
- Every v3 response and stored row remains promotion-blocked.
- Formula v2, public catalog behavior, daily score snapshots, leaderboards, and old ledgers remain unchanged.

## Reproducibility

```bash
npm run generate:pier-cast:v3-pass2-config
npm run generate:pier-cast:v3-pass2-audit
npm run qa:pier-cast:v3-pass2
npm run evaluate:pier-cast:v3-shadow
```

The drift checks bind the generated runtime configuration to the exact Pass 1 candidate and calibration SHA-256 hashes. The deterministic audit evaluates all 36 pairs on all 365 days at five thermal-fit scenarios (65,700 scores) and creates a 9,360-row weekly v2/v3 comparison.

The prospective evaluator reads the private v3 outcome-pair view, enforces effort-aware lead-day-1 eligibility, and compares ordinal discrimination with the v2 baseline. It writes no forecast or outcome data.

## Promotion boundary

Passing software tests proves implementation correctness, not fisheries forecast accuracy. Promotion remains blocked until all of these independent gates are complete:

1. independent Great Lakes fisheries-specialist sign-off;
2. local LMHOFS representation validation against field evidence;
3. sufficient prospective, effort-aware fishing outcomes under the frozen v3 cohort; and
4. an explicit owner promotion decision after reviewing the evidence.

See [PASS2_COMPLETION_REPORT.md](PASS2_COMPLETION_REPORT.md), [FORMULA_V3_DECISION.md](FORMULA_V3_DECISION.md), and [promotion-gates.json](promotion-gates.json).

Production shadow deployment and the first complete run are recorded in [PRODUCTION_SHADOW_DEPLOYMENT.md](PRODUCTION_SHADOW_DEPLOYMENT.md).
