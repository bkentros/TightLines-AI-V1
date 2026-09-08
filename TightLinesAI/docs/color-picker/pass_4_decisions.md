# Color picker — pass four weather and report service

> Historical implementation record. The September 8 release correction removes the weather/location contract described here.

Status: implementation and local validation completed September 6, 2026. Endpoint and migration are not deployed. UI integration is pass five.

## Implemented

- `supabase/functions/color-picker/index.ts` wires the authenticated endpoint, existing server subscription resolution, shared user rate limiting, Open-Meteo configuration, report service and database adapter.
- `weather.ts` requests the selected date using raw Unix timestamps and provider-resolved timezone. It retains hourly percentages, clips the requested window to sunrise/sunset, duration-weights partial hours, and requires 75% valid coverage. No null-to-zero conversion or magnitude-based fraction guessing. The provider adapter requires percent units; normalization supports explicitly declared fractions for other adapters/tests.
- The unrounded mean determines group count: at least 70% returns three cloudy colors; below 70% returns three sunny and three cloudy colors. Conditional labels distinguish forecast cloudy periods from “If clouds move in.” This threshold is the product heuristic, not a scientific visibility cutoff.
- Local-date validation supports today through six days ahead. Windows are UTC instants constrained to that local date. Timezone aliases are accepted when they resolve to the same IANA zone; unrelated zones fail. No fixed longitude-derived UTC offsets are used.
- Missing location, insufficient weather, provider errors and daylight-only limits return distinct recoverable errors. Manual fallback requires an explicit sunny/cloudy choice and confirmation that the request concerns daylight. It accepts no timed window and makes no forecast or astronomical daylight claim. No location is required for manual mode, but date/timezone are required.
- Reports persist request context, coordinates, date/timezone, normalized weather evidence, ordered selected IDs, versions, generation time, and an immutable rendered selection snapshot. Reopening uses that stored snapshot, including for older catalogs, without fetching weather or drawing again.
- `commit_color_picker_report` atomically inserts or returns the winner under a unique user/request key. Conflicting request contexts fail. History reads the last ten reports separately for each light group; failed requests and losing duplicate inserts do not create history entries.
- RLS allows authenticated users to read only their own rows; clients cannot insert/update/delete or call the commit function. The service-role RPC handles writes. Endpoint identity comes from the validated token, not request JSON.

## Access decision

Use the existing Angler/Master Angler tier resolver, including its existing full-access accounts. The separate lure/fly trial is not consumed or extended. This is an implementation assumption because no color-picker-specific trial was specified. Rate limits match the recommender's 60/minute and 500/day values, with a separate feature key. Reopen requests currently pass the same subscription gate as generation.

## API contract

POST to `color-picker`, with the existing `x-user-token` or Bearer-token convention. Generate:

```json
{
  "action": "generate",
  "requestId": "unique_tap_123",
  "typeId": "stick_worm",
  "clarity": "dirty",
  "latitude": 42.3,
  "longitude": -83.1,
  "date": "2026-09-06",
  "timezone": "America/Detroit"
}
```

Optional `window` contains canonical UTC ISO `start` and `end` strings. A manual request instead supplies `manualLight: "sunny" | "cloudy"` and `daylightConfirmed: true`; it may omit coordinates and must omit `window`.

Reopen with `{ "action": "reopen", "reportId": "saved-uuid" }`. Use a new request ID for refresh or changed inputs. Retain the original ID for network retries. A weather failure creates no persisted report, so the client may submit its explicit fallback with that ID; if a report already exists, changed context requires a new ID.

Success returns `{ schemaVersion, request, weather, selection }`. The weather groups provide display labels, and selection groups provide three choices, pool size and `canRotate`. Pattern image IDs are asset requirements; files remain pending the image pass.

Recoverable codes include `location_required`, `weather_unavailable`, `manual_light_required`, `daylight_required`, `request_conflict`, and `not_found`. HTTP status codes also distinguish invalid input, auth/access denial, rate limiting, and service/storage failure. Internal provider URLs, API keys and database error details are not returned.

## Validation and deployment boundary

- All 23 engine/weather/service/handler tests pass, including all 336 catalog cells, 69.999/70/70.001 boundaries, partial hours, missing data, explicit fractions, DST/local dates, timezone aliases, provider timeout, manual fallback, replay, auth boundary and duplicate request behavior.
- The migration ran successfully in an isolated temporary PostgreSQL cluster. Eight simultaneous inserts returned the same persisted winner; retry, conflict, RLS user isolation, denied client mutation and denied RPC execution checks passed. The cluster was stopped and removed afterward; the app database was not used.
- Targeted TypeScript compilation and `deno check --node-modules-dir=none supabase/functions/color-picker/index.ts` pass. The latter avoids an unrelated repository node_modules resolution failure for the Supabase runtime's OpenAI type dependency.
- Open-Meteo responses are mocked in tests. A deployed endpoint smoke test against live provider/auth infrastructure remains a deployment check, not a claimed result of this pass. The provider contract was checked against [official documentation](https://open-meteo.com/en/docs).

Migration: `supabase/migrations/20260905120000_create_color_picker_reports.sql`. Apply it before deploying the function. Required secrets are the existing Supabase URL/service-role key and optional `OPEN_METEO_API_KEY` / `OPEN_METEO_BASE_URL`. Deployment must retain the app's gateway/token convention; function-side JWT verification always runs. No live schema change or deployment was performed.

Different refresh request IDs can run concurrently and read the same prior history; their results remain eligible but are not guaranteed disjoint. Same-ID retries are atomically idempotent. Polar dates without usable sunrise/sunset require another daylight date or explicit manual daylight guidance; no polar sunlight model is invented.

Reproduce local checks:

```sh
node --import tsx --test supabase/functions/_shared/colorPickerEngine/__tests__/*.test.ts
deno check --node-modules-dir=none supabase/functions/color-picker/index.ts
python3 scripts/color-picker-storage-qa.py
```

The storage check requires PostgreSQL binaries on PATH and permission to create local shared memory. It creates only a temporary local cluster using a private Unix socket, without a TCP listener.
