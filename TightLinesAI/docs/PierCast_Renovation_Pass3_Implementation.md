# PierCast Renovation — Pass 3 Implementation

Pass 3 moves the consumer leaderboard and city report from the legacy combined
opportunity score to the versioned v4 conditions contract built in Pass 2. It
does not alter the map's modeled raster semantics; that work remains isolated
to Pass 4.

## Production information architecture

### Target selection

- A first-time visitor receives the target catalog and no universal ranking.
- The target picker separates `commonly_targeted_now` from the remaining
  species without manufacturing a default species.
- A deliberate selection is persisted under a versioned AsyncStorage key.
- A valid route selection takes precedence over the stored selection.
- The selected species is carried between leaderboard, report, and map routes.
- The map reloads the persisted target when it regains focus, including after
  a target change inside a report.

### Species leaderboard

- Every rendered row is for the selected species.
- The server-provided order is preserved: seasonal band first, exact thermal
  value within that band.
- The primary row language shows both `Season` and `Temp` labels. No combined
  1–10 value is rendered.
- Missing, stale, incomplete, unknown, and restricted inputs remain unranked.
  They are never translated to `Poor`.
- Existing visual conventions remain: navy masthead, Fraunces display type,
  JetBrains Mono metadata, fish artwork, medals, paper borders, hard shadows,
  topographic lines, corner marks, and condition-color accents.

### City report

- The selected species is the report hero.
- `Typical Seasonal Outlook` and `Current Temperature Match` are independent
  panels with independent labels and explanatory detail.
- The thermal panel includes modeled water temperature, optimum range, and
  distance from that range.
- The seasonal panel includes stage and direction (`Building`, `Steady`, or
  `Fading`).
- The five-day modeled nearshore temperature timeline remains visible alongside
  nearby air and wind guidance.
- Source product, cycle time, freshness, and the modeled/not-observed boundary
  are visible.
- All report species arrive in one authenticated response. Switching the hero
  species is immediate and does not consume another report entitlement or
  request another city report.
- Local fishery context is explanatory and is explicitly described as
  non-ranking information.
- Existing nearby-port, named-pier, access, feedback, subscription, and
  coverage-request surfaces remain in the report flow.

## Saved reports and entitlement behavior

- Fresh reports use `conditions/report` and the existing city/day entitlement.
- If a fresh request fails for a non-subscription reason, the client asks for
  the selected species' v4 saved envelope.
- A saved report is used only when its city and species match the requested
  report; the UI clearly identifies it as a saved copy.
- An archived legacy score report is never presented as current v4 conditions.
  The client instead asks the user to refresh.
- Subscription errors continue to open the existing subscription prompt.

## Compatibility boundary

- Legacy v3 screen components remain in the review module as a temporary
  rollback boundary while v3 server responses remain supported through the
  migration. The production render path uses only the v4 conditions views.
- The archived Pass 1 visual fingerprint remains immutable evidence of the
  pre-renovation UI. Its QA now verifies that the archive is intact rather than
  requiring production source files to remain byte-identical forever.
- The map still renders the existing score markers until Pass 4, but target
  navigation continuity is already in place.

## Verification

`npm run qa:pier-cast:renovation-pass3` covers:

- Pass 1 contract and golden ranking invariants.
- Pass 2 regional/thermal engine and route invariants.
- explicit target selection and persistence.
- absence of a combined score in the production v4 component.
- independent seasonal and thermal report semantics.
- unavailable/restricted behavior.
- target continuity across leaderboard/report/map.
- saved-report recovery and archived-legacy behavior.
- preservation of the established PierCast visual language.
- temperature/freshness presentation helpers.
- authenticated API route and entitlement tests.

Additional regression checks run for the existing five-lake map foundation,
temperature scale, city navigation, and named-pier coverage.
