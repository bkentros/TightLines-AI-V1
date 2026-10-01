# Pentwater–Caseville PierCast onboarding: Pass 1

This directory is a generated, auditable research package for five proposed cities. Run:

```sh
+node docs/onboarding/piercast/pentwater-caseville-2026-09-pass1/generate-pass1.mjs --check
+```

To re-extract the two official quantitative inputs (network required), run `extract-source-data.mjs`, then rerun the generator without `--check`. The generator owns all derived JSON, CSV, and Markdown artifacts. Raw inputs are preserved as CSV; hashes appear in reduced/review outputs.

Pass 1 contains no numeric calibration and makes no runtime or release changes. New-city bluegill compatibility records are fixed policy exclusions in `bluegill-policy-exclusions.json`; raw biological inputs may still contain source rows. The same artifact records a pre-existing four-pair runtime serialization gap as a mandatory later release blocker.
