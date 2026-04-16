# Recommender V3 — Maintainer validation

Post-tuning reference for rerunning freshwater matrix audits without retuning the engine. All commands assume repository root `TightLinesAI/` (where `package.json` lives).

## Prerequisites

- **Deno** installed and on `PATH` (scripts use `deno run`).
- **Node / npm** for `npm run` orchestration.
- Network access only for **`*:matrix:archive-env`** scripts (they fetch archive weather). Matrix **runs**, combined analysis, coverage audit, and daily-shift audit are offline once archive-env JSON exists.

## One-command freshwater validation

Copy-paste:

```bash
cd TightLinesAI && npm run audit:recommender:v3:freshwater:validate
```

Equivalent alias:

```bash
cd TightLinesAI && npm run audit:recommender:v3:freshwater:full
```

### What it runs (order)

1. `freshwater:matrix:run-all` — regenerates all four species matrix review sheets (engine + archived env from committed `*-archive-env.json`).
2. `freshwater:analyze` — `analyzeFreshwaterMatrix.ts` → combined summary.
3. `audit:recommender:v3:coverage` — static coverage / archetype audit.
4. `audit:recommender:v3:daily-shifts` — daily-shift checks.

The chain uses `&&`; any failing step stops the rest and npm exits non-zero.

After regenerating and committing `docs/recommender-v3-audit/generated/*.json`, optionally confirm they still match the locked headline caps:

```bash
cd TightLinesAI && npm run audit:recommender:v3:regression-baselines
```

See [regression-baselines/CHANGELOG.md](./regression-baselines/CHANGELOG.md) and [V3_REGRESSION_ANCHORS.md](./V3_REGRESSION_ANCHORS.md).

### What it does *not* run

- Matrix **archive-env** rebuilds (`*:matrix:archive-env`). Those are separate, network-heavy steps when scenario locations or dates change. See [Refreshing archive bundles](#refreshing-archive-bundles).

### Expected runtime

- **Full validate**: typically a few minutes on a modern Mac (dominated by four matrix runs + analysis); exact time depends on CPU and disk.
- **Single species matrix run**: proportionally shorter (roughly one quarter of matrix time for the four-species run-all step).

### Pass / fail

- **Matrix + analyze**: `docs/recommender-v3-audit/generated/freshwater-v3-matrix-audit-summary.md` (and `.json`). Exit code **`1`** if any species has hard or soft review failures; **`0`** when all species are clean on those counts.
- **Coverage audit**: `docs/recommender-v3-audit/generated/v3-coverage-audit.md`. Exit **`1`** if any numeric row in `success_targets` fails its `pass` threshold; **`0`** when all targets pass.
- **Daily-shift audit**: `docs/recommender-v3-audit/generated/v3-daily-shift-audit.md`. Exit **`1`** if any pairwise check fails; **`0`** when all checks pass (for example `14/14`).

## Individual species — matrix documentation export

Regenerates the human-readable matrix spec (md + json) for one species:

| Species        | Command |
|----------------|---------|
| Largemouth     | `npm run audit:recommender:v3:lmb:matrix` |
| Smallmouth     | `npm run audit:recommender:v3:smb:matrix` |
| Trout          | `npm run audit:recommender:v3:trout:matrix` |
| Northern pike  | `npm run audit:recommender:v3:pike:matrix` |

Outputs live under `docs/recommender-v3-audit/generated/` with names like `*-v3-audit-matrix.md` / `.json`.

## Individual species — matrix run (review sheet)

| Species        | Command |
|----------------|---------|
| Largemouth     | `npm run audit:recommender:v3:lmb:matrix:run` |
| Smallmouth     | `npm run audit:recommender:v3:smb:matrix:run` |
| Trout          | `npm run audit:recommender:v3:trout:matrix:run` |
| Northern pike  | `npm run audit:recommender:v3:pike:matrix:run` |

Writes `docs/recommender-v3-audit/generated/<species-batch>-review-sheet.{md,json}` (for example `pike-v3-matrix-review-sheet.json`).

## Combined matrix analysis only

After matrix runs produced the four `*-matrix-review-sheet.json` files:

```bash
cd TightLinesAI && npm run audit:recommender:v3:freshwater:analyze
```

## Coverage audit only

```bash
cd TightLinesAI && npm run audit:recommender:v3:coverage
```

Output: `docs/recommender-v3-audit/generated/v3-coverage-audit.{md,json}`.

## Daily-shift audit only

```bash
cd TightLinesAI && npm run audit:recommender:v3:daily-shifts
```

Output: `docs/recommender-v3-audit/generated/v3-daily-shift-audit.{md,json}`.

## Refreshing archive bundles

When matrix scenario coordinates, dates, or timezones change, refresh frozen archive inputs before matrix runs:

```bash
cd TightLinesAI && npm run audit:recommender:v3:freshwater:matrix:archive-env-all
```

Or per species: `npm run audit:recommender:v3:lmb:matrix:archive-env` (and `smb`, `trout`, `pike` equivalents).

Writes `docs/recommender-v3-audit/generated/<batch>-archive-env.json`. Commit updated JSON when the team agrees the new bundle is canonical.

## Generated artifact policy

| Location | Policy |
|----------|--------|
| `docs/recommender-v3-audit/generated/` | **Canonical audit outputs** for V3 (matrix review sheets, archive-env bundles, freshwater summary, coverage, daily-shift) stay **committed** so CI and reviewers can diff intentional changes. |
| `*.local.*` under that folder | **Ignored** (see repo `.gitignore`) for scratch copies; never commit those as replacements for canonical filenames. |
| Ad hoc how-fishing / other audit dumps | Already ignored at repo root per `.gitignore`; do not mix with V3 matrix outputs. |

## Further reading

- Program context: [FRESHWATER_V3_PROGRAM.md](./FRESHWATER_V3_PROGRAM.md)
- Post-tuning engine state (baseline, species notes, philosophy, exceptions): [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md)
- Audit output interpretation (matrix vs coverage vs specialty): [V3_AUDIT_INTERPRETATION.md](./V3_AUDIT_INTERPRETATION.md)
- Product integration (edge/client, species keys, pre-release checks): [V3_PRODUCT_INTEGRATION.md](./V3_PRODUCT_INTEGRATION.md)
- Post-tuning checklist: [../recommender-v3-post-tuning-checklist.md](../recommender-v3-post-tuning-checklist.md)
