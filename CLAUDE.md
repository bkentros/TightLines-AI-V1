# TightLines AI / FinFindr — Agent Working Notes

Product is **FinFindr**; the repo and many identifiers still use the older
**TightLines AI** name. Both refer to the same app.

App/project root is `TightLinesAI/`. Cursor-oriented environment and stack
details live in `.cursor/rules/project-context.mdc`; this file covers the
things that will silently waste your time if you don't know them.

---

## Running tests — read this before you believe a failure

Edge function tests are Deno tests under `TightLinesAI/supabase/functions/`.
**Two things will produce large numbers of fake failures.**

### 1. Run from `TightLinesAI/`, not from `supabase/functions/`

Several tests read source files by repo-relative path
(e.g. `Deno.readTextFile("supabase/functions/recommender/index.ts")`).
Run them from anywhere else and they fail with
`NotFound: No such file or directory` — a path artifact, not a real defect.

### 2. Do NOT pass `--allow-net`

With network access granted, tests that should use stubs reach real USGS /
weather / Open-Meteo endpoints instead. Results become nondeterministic and
the failing set changes between runs. Keep the suite hermetic.

**The correct invocation:**

```bash
cd TightLinesAI
deno test --allow-read --allow-env --no-check supabase/functions/
# expected (2026-10-02): ok | 1529 passed | 0 failed
```

`--no-check` is required: `@supabase/functions-js`'s edge-runtime types reference
`npm:openai`, which is not installed, so type resolution aborts before any test
runs. Do not `deno install` or change `node_modules`/`deno.lock` to work around it.

Getting either detail wrong yields roughly 6–31 phantom failures across
DailyPicks, recommender, Push history, and owner-review snapshot tests.
**If you see failures, re-run correctly before investigating or "fixing"
anything.**

### Confirming a change is actually responsible for a failure

Don't compare against memory or assumption — build a real baseline:

```bash
git worktree add --detach /tmp/base HEAD
ln -s "$PWD/TightLinesAI/node_modules" /tmp/base/TightLinesAI/node_modules  # required
cd /tmp/base/TightLinesAI && deno test --allow-read --allow-env supabase/functions/
```

The `node_modules` symlink is mandatory — without it Deno cannot resolve
`npm:` specifiers and the suite aborts before running, which looks like
"0 failures" and is meaningless. Clean up with `git worktree remove --force /tmp/base`.

---

## River Run: how a river becomes visible to users

River Run rivers/runs are defined **in code, not in the database**. The
`river-run` edge function imports them directly, so **publishing a river
means deploying the function** — no migration is involved.

Visibility is gated by `publicAudit.isEnabled` on each run profile:

- `false` → hidden, owner-review only
- `true`  → public

Registries live in `supabase/functions/_shared/riverRunEngine/config/`:

- Public: `rivers.ts`, `runs.ts`, `catalog.ts`
- Owner-review: `config/onboarding/index.ts` (`RIVER_RUN_DRAFT_*`)

**As of 2026-09-15 every completed candidate is public and the draft
registries are intentionally empty** (23 rivers / 72 runs, MI IN WI NY WA OR).

When promoting a cohort, append inside the existing
`.map(withSeasonalZonePlan)` / `withSeasonalZonePlans(...)` mappings —
appending after them silently drops seasonal zone plans.

### Counting rivers: 23 vs 24 vs 75

`st_joseph` is intentionally placed in **both MI and IN**. Any count that
walks `states[].rivers[]` double-counts it, so the live `/rivers` catalog
reports 24 placements and 75 runs for 23 unique rivers and 72 unique runs.
This is not a bug. De-duplicate by `riverId` / `runId` before comparing to
config.

### Verify River Run changes with

```bash
cd TightLinesAI
deno run --allow-read scripts/river-run-onboarding-qa.ts   # expects 23 rivers / 72 runs
npm run qa:river-run:onboarding-weather-activity
npm run check:river-run:review-fixtures
npx tsc --noEmit
deno fmt --check <changed files>
```

---

## Environment variables — known traps

Local `TightLinesAI/.env` status, verified 2026-09-16:

| Variable | State | Notes |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | **works** | The real anon JWT. Use this one. |
| `SUPABASE_ANON_KEY` | absent locally | Use `EXPO_PUBLIC_SUPABASE_ANON_KEY`; scripts fall back to it. |
| `CLOUDFLARE_API_KEY` | present locally | The former misplaced `cfk_…` value is a Cloudflare global API key, not a Supabase key. Never expose it; prefer a scoped token for Cloudflare work. |
| `SUPABASE_SERVICE_ROLE_KEY` | works | Valid. |
| `V1_DATABASE_URL` | works locally | One Session pooler URL remains. Its password is URL-encoded; a read-only `SELECT 1` succeeded. |

Scripts that read `SUPABASE_ANON_KEY` fall back to
`EXPO_PUBLIC_SUPABASE_ANON_KEY`; always prefer the latter in new code.

`V1_DATABASE_URL` is only consumed by
`scripts/water-reader-geometry-audit/audit_shoreline_features.py`.

Direct `psql` and the linked Supabase CLI both connected successfully on
2026-09-16. Check migration parity with:

```bash
supabase migration list --linked
supabase inspect db table-stats --linked
```

Never print or materialize API keys into the transcript.

---

## Supabase project

- Project ref `hsesngprhpgajyfbrwbf` ("FinFindr"), East US, already linked.
- Migrations under `TightLinesAI/supabase/migrations/`.
  As of 2026-09-16 local and remote are fully reconciled with **zero drift**;
  check with `supabase migration list --linked` before assuming work is needed.
- Deploy a function with `supabase functions deploy <name>` — required for any
  River Run config change to reach users.

---

## Live Lake Map (`TightLinesAI/web/lake-map/`)

Read `web/lake-map/README.md` first. Quick facts:

- Tests: `npm test` (JS, expect 71+) and `.venv/bin/python -m unittest discover -s job/tests`
  (expect 41+). Always use the project `.venv` for Python; system Python lacks numpy/eccodes.
- The page is published separately from the app: `npm run build:page`, `cp dist/* static-build/proto/`,
  `.venv/bin/python static-build/publish.py`. No app release is needed for map page changes.
- Publish the page BEFORE merging data-job changes: `publish.py` writes `map/capabilities.json`,
  and the scheduled job (runs from `main`) only emits frame encodings the live page declares.

## Git conventions

- `main` is the working and release branch. Work happens on short-lived feature branches off
  `main`, merged through a PR. (`develop/cross-platform-next` was retired 2026-10-02; its
  content is fully superseded by `main` and preserved as `archive/develop-cross-platform-next-2026-09-29`.)
- `main` enforces linear history and required checks (CodeQL, Gitleaks, JS/TS): merge PRs with
  `gh pr merge <n> --rebase`. Never use `--admin`; fix CodeQL findings instead (in tests, prefer
  exact string checks over unanchored URL regexes).
- Abandoned or superseded work is preserved as `archive/*` branches rather
  than left in `git stash`. Keep the stash list empty.
