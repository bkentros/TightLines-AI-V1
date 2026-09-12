# PierCast Field Temperature Validation Program

**Protocol:** `piercast-field-temperature-v1`\
**Status:** ingestion and archive contract implemented; physical authorization
and deployment required\
**Runtime role:** none—validation evidence only

## Product decision

LMHOFS remains the only five-day water-temperature forecast. Local loggers exist
to test whether each frozen model cell represents water reachable from the
covered pier. They never replace a missing forecast, select a favorable
temperature, or silently correct a score.

This program is necessary because no qualifying pier-local public feed exists
for Manistee or Frankfort–Elberta, and the existing Ludington, Grand Haven, and
Sheboygan observations do not by themselves prove pier/plume equivalence.

## Frozen deployment sites

One independent source ID is assigned to every covered structure. Frankfort and
Elberta, and Sheboygan North and South, remain separate observations even though
each city pair currently shares a model cell.

| City        | Structure        | Source ID                                       | Reference                                      |
| ----------- | ---------------- | ----------------------------------------------- | ---------------------------------------------- |
| Ludington   | North Breakwater | `ludington_north_breakwater__surface_logger_v1` | NOAA Coast Pilot north-breakwater light        |
| Grand Haven | South Pier       | `grand_haven_south_pier__surface_logger_v1`     | NOAA Coast Pilot south-pierhead entrance light |
| Manistee    | North Pier       | `manistee_north_pier__surface_logger_v1`        | NOAA Coast Pilot north-pierhead light          |
| Frankfort   | North Breakwater | `frankfort_north_breakwater__surface_logger_v1` | USCG Light List 18375                          |
| Elberta     | South Breakwater | `elberta_south_breakwater__surface_logger_v1`   | USCG Light List 18385                          |
| Sheboygan   | North Pier       | `sheboygan_north_pier__surface_logger_v1`       | NOAA Coast Pilot breakwater light              |
| Sheboygan   | South Pier       | `sheboygan_south_pier__surface_logger_v1`       | USCG south-pierhead light                      |

The coordinates are sampling targets, not navigation destinations. A safe,
authorized mounting point within 350 m must be recorded during the site survey.

## Minimum equipment contract

- water-rated temperature logger with documented accuracy of ±0.2 °C or better;
- 15-minute or faster sampling cadence;
- deployment depth of 0.50 m, tolerance ±0.25 m, relative to the instantaneous
  surface;
- stable UTC clock and exported timestamps with timezone;
- immutable serial number and model name;
- calibration check no more than 30 days before the observation, with absolute
  error no greater than 0.2 °C;
- redundant attachment and a documented recovery plan; and
- no deployment until the property/structure authority approves the exact
  attachment method and location.

## Evidence minimum

Each city must accumulate:

- two independent open-water deployments;
- at least 60 QC-good days per deployment;
- at least 30 matched observations at each frozen validation lead;
- cold, transition, and warm regimes plus rapid-change events;
- separate structure results where a city has two covered structures; and
- winter evidence before any claim of annual approval.

The existing prospective representation thresholds remain unchanged. A
correction may be fit only on a declared training period and must improve a
separate holdout period without hiding tail errors.

## Implemented data path

`config/fieldValidation.ts` freezes the seven source contracts.
`validation/fieldTemperature.ts` rejects wrong scope, position, depth,
temperature, instrument accuracy, calibration, time, and source QA. The private
archive migration:

- enables row-level security;
- grants access only to `service_role`;
- stores rejected evidence rather than deleting it;
- is idempotent by source and timestamp; and
- keeps the existing agency pairing RPC agency-only and exposes a separate
  source-specific field pairing RPC, so structures that share a model cell are
  never blended into one evidence set; and
- duplicates the usable-record accuracy, calibration-window, position, and depth
  rules as database constraints instead of trusting the ingestion layer alone.

## Physical deployment checklist

For each site, obtain written authorization, photograph the mounting location
and water face, record exact GPS and depth method, assign the logger serial,
perform pre-deployment calibration, start UTC logging, and enter a
recovery/inspection date. After recovery, perform a post-check before importing
any observations.

No code change can substitute for these physical steps or the elapsed seasonal
record. Until they are complete, the corresponding representation gate remains
blocked and public rating activation remains prohibited.

The [authorization packet](PierCast_Field_Deployment_Authorization_Packet.md)
routes each site to its initial land/structure authority and applicable state
and federal pre-application review. It is ready for applicant identity,
equipment, insurance, dates, and final attachment drawings; those owner choices
must be completed before submission.

## Import operation

Start from
[`docs/onboarding/piercast/field-temperature-import.example.json`](onboarding/piercast/field-temperature-import.example.json)
and replace every example value with the original logger/deployment metadata.
Validate without changing production:

```bash
npm run validate:pier-cast:field-temperature -- --file path/to/export.json
```

After reviewing the usable/rejected counts and rejection reasons, commit the
same file through the authenticated edge operation:

```bash
npm run import:pier-cast:field-temperature -- --file path/to/export.json
```

The import is bounded to 1,000 records per request, rejects duplicate
source/timestamp keys within a batch, and never prints the internal key.
