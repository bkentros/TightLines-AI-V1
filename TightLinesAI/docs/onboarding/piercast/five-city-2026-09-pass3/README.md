# Five-city onboarding Pass 3

Private production implementation and owner-review evidence for Two Rivers, Kewaunee, Algoma, Manitowoc, and Waukegan. Start with `PASS3_REPORT.md`.

The five cities are available only through the authenticated owner Formula v3 review. The public v2 and v3 manifests remain frozen at the previously released 12 cities.

The owner screen is implemented in the app source and becomes available in a client built from these changes. The existing installed app has not been updated in this pass. See `PASS3_REPORT.md` for the production verification boundary and access limitations.

## Reproduce local acceptance

```sh
npm run qa:pier-cast:five-city-pass3
```

## Recheck production storage

```sh
npm run verify:pier-cast:five-city-pass3:production
```

`owner-review-fixture.json` is a deterministic presentation fixture with constant temperature input. It proves report shape and completeness; it is not a historical or live forecast. `production-verification.json` records the real private production run.

No artifact in this directory authorizes public release. “Go live” requires a separate explicit release change and owner approval.
