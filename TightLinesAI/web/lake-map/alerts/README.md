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

The authenticated `POST /__test/alert` and `POST /__test/weekly` endpoints send
clearly labeled test messages without changing incident state. Resend
idempotency keys make retries safe. The Worker never creates a stale or
mismatched production pointer for testing.
