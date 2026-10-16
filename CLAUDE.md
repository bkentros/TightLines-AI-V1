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
| `V1_DATABASE_URL` | legacy local input | Contains a URL-encoded password. Database tools must split it in memory and pass credentials through `PGPASSWORD`/keyword args; never pass or log this URL. Prefer separate `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`. |

Scripts that read `SUPABASE_ANON_KEY` fall back to
`EXPO_PUBLIC_SUPABASE_ANON_KEY`; always prefer the latter in new code.

`V1_DATABASE_URL` is accepted only as a legacy input by the credential-safe
database helper. New tooling must use separate `PG*` environment variables.
No database URL or password may appear in argv, terminal output, CI output, or
exception text; route `psql` and psycopg connections through
`scripts/db_connection_safety.py`.

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
  Always check `supabase migration list --linked` before assuming local and remote are reconciled.
- Deploy a function with `supabase functions deploy <name>` — required for any
  River Run config change to reach users.

---

## Live Lake Map (`TightLinesAI/web/lake-map/`)

Read `web/lake-map/README.md` first. Quick facts:

- Tests: `npm test` (JS) and `.venv/bin/python -m unittest discover -s job/tests`.
  Always use the project `.venv` for Python; system Python lacks numpy/eccodes.
- The page is published separately from the app: `npm run build:page`, `cp dist/* static-build/proto/`,
  `.venv/bin/python static-build/publish.py`. No app release is needed for map page changes.
- Publish the page BEFORE merging data-job changes: `publish.py` writes `map/capabilities.json`,
  and the scheduled job (runs from `main`) only emits frame encodings the live page declares.

### Live Lake Map operations

- The Cloudflare scheduler dispatches the GitHub data workflow during each NOAA window;
  GitHub's native schedule is the backup. A successful surface publish writes its immutable
  run first and `latest.json` last, then the depth job publishes the matching five-depth run
  and writes `runs/tdepth/latest.json` last. Never mix cycles or sources.
- THREDDS is limited to three concurrent requests and honors adaptive/`Retry-After` backoff.
  `state/thredds-health.json` opens the circuit after a THREDDS failure: the next cycle starts
  on validated NODD while a cheap probe runs, and two healthy cycle probes close it.
- `finfindr-lake-map-alerts` runs every 30 minutes, stores transition state in R2, and emails
  `brandonkentros@icloud.com` from `support@finfindr.app` through Resend. It also sends the
  Monday-morning US Eastern weekly summary.
- The production publish workflow checks only candidate data integrity (schema, four-model
  completeness and value sanity) plus public delivery. Repository unit and workflow-policy
  tests belong to the required `lake-map-tests` PR check, never in the scheduled publish path.
- `.github/workflows/lake-map-data.yml` is the single workflow definition; do not restore the
  retired copies under `job/`. Pipeline-path pushes to `main` run a full no-upload NOAA canary.
- Never merge unattended changes to lake-map code, GitHub workflows, Dependabot policy, or the
  scheduler/alerts Workers. Run the full PR suite and, for action updates, manually dispatch the
  no-upload canary on the PR branch. Make one production pipeline change at a time.
- Production Temp at depth is controlled only by `map/features.json`. First rollback action:
  `.venv/bin/python static-build/feature.py tempDepth off --allow-production`, then read back
  the object. Do not roll back surface runs for a depth-only problem.
- R2 expires objects under `runs/` after 14 days; `map/`, the root surface pointer, and state
  are outside that prefix. The depth pointer is rewritten every cycle, so verify it and both
  current pointer targets are younger than 14 days before changing the rule.
- Secret names only: local `TightLinesAI/.env` holds `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `OPEN_METEO_API_KEY`, `GITHUB_ACTIONS_TOKEN`,
  `RESEND_API_KEY`, and `PIER_CAST_MAP_PASS_SECRET`. Worker secrets are installed with
  `wrangler secret put`; `PIPELINE_ALERT_TOKEN` is shared only between GitHub Actions and
  the alerts Worker. Never print or commit values.
- Renewal tracking (audited 2026-10-14): GitHub does not expose the fine-grained
  `GITHUB_ACTIONS_TOKEN` expiry through the repository API, so record its account-settings
  expiry and renew at least 14 days before it (recheck by 2026-11-01). The sending-only Resend
  key exposes no provider expiry; rotate `RESEND_API_KEY` by 2027-10-14 or immediately after
  suspected exposure.

## Current state / open tasks (2026-10-16)

- Production ships app **1.17**, `pier-cast` **v88**, and `pier-cast-ingest` **v63**.
  Those Edge Function versions are frozen until a separately approved rollout.
- The Live Lake Map pipeline, scheduler, THREDDS/NODD circuit breaker, pointer-last delivery,
  alerting, required PR suites, post-merge no-upload canary, and one-production-change-at-a-time
  rule are documented above and in `web/lake-map/README.md`. `PIERCAST STALE` opens only when
  the public cycle is more than 12 hours old; the normal aggregate replaces it at roughly
  10 hours 10 minutes.
- **PARKED — PierCast lake-map feed switchover.** The reader code is on `main`, its
  `PIER_CAST_TEMPERATURE_SOURCE` switch remains off/direct-THREDDS in production, and the
  lake-map pipeline is publishing a complete 32-city × 121-hour point feed. Resume only with
  explicit approval, one production change at a time: (1) download the exact v63 bundle and
  verify a recursive SHA-256 manifest; (2) deploy current `pier-cast-ingest` with source
  `thredds`; (3) verify one automatic cycle; (4) set the source to `lake_map`; (5) verify the
  next automatic cycle against the THREDDS-equivalent gate: mean absolute difference ≤ 0.05°F,
  maximum ≤ 1.0°F, and zero rating-band changes. Roll back first by setting source=`thredds`,
  then, if necessary, redeploy the verified v63 bytes using the saved work directory.
- Deferred work: 12 Edge Functions where `main` is newer than production (ship with the next
  app release); Dependabot PR #89 (requires its manual no-upload canary before merge); three
  development-tool security alerts tied to the Expo upgrade decision; and `wip/*` branches
  holding in-progress PierCast/River Run work plus five unapplied migrations.
- The staging Supabase project no longer exists. Treat every `STAGING_*` variable in local
  environment files as stale; do not infer a usable staging target from those names.

## Git conventions

- `main` is the working and release branch. Work happens on short-lived feature branches off
  `main`, merged through a PR. (`develop/cross-platform-next` was retired 2026-10-02; its
  content is fully superseded by `main` and preserved as `archive/develop-cross-platform-next-2026-09-29`.)
- `main` enforces linear history and required checks (CodeQL, Gitleaks, JS/TS, lake-map-tests): merge PRs with
  `gh pr merge <n> --rebase`. Never use `--admin`; fix CodeQL findings instead (in tests, prefer
  exact string checks over unanchored URL regexes).
- Abandoned or superseded work is preserved as `archive/*` branches rather
  than left in `git stash`. Keep the stash list empty.
