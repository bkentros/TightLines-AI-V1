# PierCast development-build review handoff

Everything before the native build is complete. The next-build branch is
`develop/cross-platform-next`; the required catalog v2 and conditions v4
backend contracts are live, and legacy v3 production behavior has passed its
post-deployment smoke test.

## Build after the EAS allowance resets

From `TightLinesAI` on a clean checkout of the next-build branch:

```bash
git pull origin develop/cross-platform-next
eas build --platform ios --profile development
```

Install the resulting development client, then start Metro with:

```bash
npm run start:dev-client:8081
```

The old development client cannot open the map because its native binary does
not contain MapLibre. Metro cache clearing cannot add that native module.

## Approval review

1. Leaderboard: start without a default winner, select several species, confirm
   Seasonal Outlook is primary and the smaller `TEMP FIT` marker orders cities
   within each seasonal band.
2. City finder/report: search without selecting a leaderboard target, choose a
   supported city species, and confirm seasonal timing remains separate from
   modeled surface-temperature compatibility.
3. Map target: change species without moving the camera or forecast hour; tap a
   city that does not support the current target and confirm the city-specific
   target chooser opens.
4. Now/Forecast: scrub and play multiple hours; confirm raster, city temperature,
   Match color, wind, and displayed timestamp change together.
5. Wind: compare Flow and Arrows, select a wind node, background/restore the app,
   and repeat with iOS Reduce Motion enabled.
6. Layers/fallbacks: review Match, Temp, Depth, observed stations in Now, several
   state filters, overview and shoreline zoom, and both expanded/collapsed panels.
7. Stability: leave flow and forecast playback active for ten minutes and note
   any touch lag, crash, thermal warning, visual jump, or sustained memory growth.

Review the small, standard, and large device permutations in
`PierCast_Refinement_Pass3_Visual_Matrix.json`. Approval of this development
build is the remaining gate before any production-build or store-release work.
