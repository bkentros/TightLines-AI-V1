# Live Lake Map alerts

`finfindr-lake-map-alerts` runs every 30 minutes independently of GitHub's
scheduler. It reads the same authenticated public pointer URLs as the map page,
stores incident state at `state/lake-map-alerts.json` in the existing private R2
bucket, and sends transition-only email through the existing Resend account.

Production secrets are installed only with `wrangler secret put`:

- `PIER_CAST_MAP_PASS_SECRET` — signs a short-lived page-contract pass.
- `GITHUB_ACTIONS_TOKEN` — Actions read access for delivery outcomes and weekly
  metrics. Pointer freshness checks do not depend on GitHub.
- `RESEND_API_KEY` — sends from the existing verified
  `support@finfindr.app` sender.
- `ALERT_TEST_TOKEN` — protects the two explicit test-delivery endpoints.
- `SUPABASE_ANON_KEY` — calls the public PierCast leaderboard through the same
  production endpoint as clients. The key is a Worker secret, never source.
- `PIPELINE_ALERT_TOKEN` — authenticates the post-merge dry-run canary callback;
  the same value is stored as a GitHub Actions repository secret.

The authenticated `POST /__test/alert`, `POST /__test/piercast`, and
`POST /__test/weekly` endpoints send clearly labeled test messages without
changing incident state. Resend
idempotency keys make retries safe. The Worker never creates a stale or
mismatched production pointer for testing.

PierCast alerting reads `sourceIssuedAt` from the public leaderboard every 30
minutes. A cycle older than 12 hours opens `PIERCAST STALE`; 12 hours or less
recovers it. The threshold clears the normal aggregate's roughly 10-hour-10-minute
replacement cadence while still detecting a genuinely missed cycle. Network
failures, non-success HTTP responses, malformed JSON, and
missing/invalid timestamps open the separate `PIERCAST AVAILABILITY` incident.
Both are transition-only and are included in the Monday weekly totals.

The Worker also watches completed `Lake map data` runs. Two consecutive
executed failures open `PIPELINE FAILING` with the failed job, step and first
error line; the next successful execution sends recovery. A post-merge
no-upload canary can open `PIPELINE BROKEN` immediately through the authenticated
callback. Resend message IDs are persisted with alert history so accepted sends
can be reconciled with provider delivery events.
