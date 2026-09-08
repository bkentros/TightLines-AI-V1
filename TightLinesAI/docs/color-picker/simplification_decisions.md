# Color Match simplification — September 6, 2026

> Historical implementation record. The September 8 release correction supersedes its weather, recency, artwork-path, and daily-cache behavior.

## Current behavior

The picker exposes 23 broad choices across Soft plastics, Jigs & spinners, Hard baits, Spoons, and Flies. Worm profiles and crankbait diving depths are searchable aliases, not extra questions. Streamer fly and Fly popper remain separate options. Conventional poppers appear under Topwater lure.

Bait → water clarity → results. Today at the Home-selected location supplies the forecast context automatically. The picker has no location/date/weather controls; saved reports retain their original snapshots. Open-Meteo cloud cover is averaged by valid daylight duration. The unrounded mean selects the groups:

| Cloud cover | Result |
| --- | --- |
| Below 30% | Three sunny colors |
| 30% through 70% inclusive | Three sunny plus three cloudy colors |
| Above 70% | Three cloudy colors |

Missing/invalid weather stops generation with a retryable error. No manual light selection or assumed sunshine. Historical saved snapshots remain immutable.

## Palette consolidation

`pickerChoices.ts` explicitly maps each broad choice to one previously reviewed palette. This is conservative reuse, not a union of every specialized variant's colors. For example, Soft plastic worm uses the stick-worm palette, Crankbait uses the medium-crankbait palette, Skirted jig uses the structure-jig palette, and Streamer fly uses the baitfish-streamer palette. All six clarity/light cells remain explicit. The generated `live_picker_pools.json` lists every live cell and its named colors; regenerate it with `node --import tsx scripts/color-picker-live-pools.ts`. Specialized variants remain internal research evidence and legacy navigation aliases. Fresh service requests reject removed subtype IDs.

The selection version is 2.0.0 so old subtype recency does not silently govern the new broad choices. Draws remain unranked and random, with existing recency rotation. No pool is padded to promise more variety.

## Artwork

All 23 bait selectors and three clarity illustrations are newly generated with the built-in image tool. Soft plastics are shown unrigged; complete lures carry their normal hardware; flies use fly hooks. The asset map references only `assets/images/color-picker/selectors`. Generation subjects and the shared prompt are recorded in `selector_artwork_prompts.json`.

These are bait-selection illustrations, not depictions of every recommended color. Result cards still use reviewed names and visual descriptions; bait-pattern result artwork remains part of the later artwork pass.

## Validation and release boundary

Tests exhaust all 138 live bait/clarity/light cells and both forecast thresholds, in addition to the existing 336 research cells, randomization, replay, authenticated identity and persistence contract checks. Local TypeScript and iOS export checks validate integration. Device visual review and live service/database deployment remain pending. Existing lure/fly color advice remains until the picker completes those release gates.


Validation recorded: 25 Node/tsx engine and service tests passed; app `tsc --noEmit` passed; Deno checking of shared report service and HTTP handler passed; iOS Expo export passed with all 26 selector assets resolving. Full endpoint Deno checking encountered an existing Supabase runtime declaration dependency on missing `npm:openai@^4.52.5`; no package changes were made to work around that unrelated dependency. No simulator was booted, so this is not an on-device visual signoff.
