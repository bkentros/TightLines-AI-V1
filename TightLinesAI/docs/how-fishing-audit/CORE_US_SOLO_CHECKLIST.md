# Core U.S. coverage — solo testing (no beta users yet)

This is a lightweight way to stay honest about **mainstream U.S. fishing** (bass, trout, inshore salt, Great Lakes, etc.) while you are the only tester.

## 1. Automated regression (cheap, repeatable)

**16 curated scenarios** live in:

`scripts/how-fishing-audit/scenarios-core-us-regression.json`

They intentionally **skip** Hawaii, Alaska, and high-alpine torture tests. Tide station IDs match scenarios already used in the wider e2e audit.

Run (from `TightLinesAI/`, with `OPENAI_API_KEY` set):

```bash
npm run audit:how-fishing:core
```

Outputs (gitignored, same shape as full e2e):

- `how-fishing-core-regression.jsonl`
- `how-fishing-core-regression-cost-summary.json`
- `how-fishing-core-regression-in-app.md`

**When to run**

- After any change to **timing**, **region resolution**, **how-fishing polish prompt**, or **engine normalization**.
- Before a **TestFlight / store** build if How’s Fishing changed.
- Optionally **monthly** if you are not touching the engine.

**Pass bar:** automated gate = all rows `pass: true` (no major/blocker flags). Minor flags (e.g. length) are optional to chase.

## 2. Device spot-check (you = the beta)

Pick **3–5** pins you personally care about (home water, a trip, a famous fishery). For each:

1. Open the app → same **context** (lake vs river vs coastal) and **approximate** coords as production would use.
2. Skim: **band**, **score**, **summary**, **timing tiles + daypart note**, **tip**.
3. Ask only: *Does this feel directionally right for that day and place?* Not perfect—**directionally**.

Keep a single note (Notes app, Linear, GitHub issue):

- Date, location label, one line “ok / wrong because …”.

That log **is** your pre-launch beta. Five honest rows beat fifty silent assumptions.

## 3. What this does *not* replace

- **Species-specific** truth (when muskie bite, salmon run windows) will land mainly in the **lure/fly recommender** and later log/telemetry—not in How’s Fishing alone.
- **75–85% “accurate”** in the angler sense still needs **real feedback** after you have users; until then, **core regression + your spot-checks** are the right ceiling.

## 4. Scenario → region map (quick reference)

| id suffix (core-reg-…) | region_key | Typical species story |
|------------------------|------------|------------------------|
| fl-coastal-keys | florida | Snook, tarpon, jacks |
| fl-lake-toho | florida | Largemouth |
| al-mobile-bay, tx-galveston | gulf_coast | Redfish, speckled trout |
| nc-outer-banks, md-chesapeake | southeast_atlantic | Striper, inshore mix |
| nj-delaware-bay, ma-boston | northeast | Striper, NE inshore |
| wa-puget | pacific_northwest | Salmon, sea-run trout |
| wa-lake-washington | pacific_northwest | Trout, warmwater mix |
| id-snake-river | mountain_west | Trout |
| ok-broken-bow, tx-sam-rayburn | south_central | Largemouth |
| mi-grand-traverse | great_lakes_upper_midwest | Smallmouth, walleye |
| il-lake-shelbyville | midwest_interior | Bass, panfish |
| wv-new-river | appalachian | Smallmouth |

## 5. Next product step

When this rhythm feels boring (core audit green, spot-checks not embarrassing), **shift primary time to the lure/fly recommender** and run `audit:how-fishing:core` only as a safety net.
