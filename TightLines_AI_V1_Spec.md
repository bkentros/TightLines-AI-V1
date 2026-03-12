# TightLines AI — V1 Product Spec

## Dev Environment (Read This First)

**Project directory:** `/Users/brandonkentros/TightLines AI V1/TightLinesAI/`
**Stack:** React Native / Expo SDK 55, Expo Router (`app/` directory), TypeScript, Supabase, Zustand
**Testing:** iPhone 15 Pro Max — EAS dev client build installed. Run Metro with `npx expo start --dev-client --host lan` from the project directory. No simulator — physical device only over LAN.
**Installing packages:** Always use `npm install <package> --legacy-peer-deps`. For expo packages use `npx expo install <package> -- --legacy-peer-deps`. There is a peer dependency conflict with react-dom versions that requires this every time.
**Key packages already installed:** `expo-router`, `expo-dev-client`, `expo-location`, `expo-camera`, `expo-image-picker`, `expo-audio` (NOT expo-av — incompatible with Xcode 26.2), `expo-sqlite`, `expo-notifications`, `@supabase/supabase-js`, `zustand`, `react-dom`
**Bundle ID:** `com.finseekr.tightlinesai` | **EAS project:** `@tightlinesai/tightlines-ai`
**Current state:** Active implementation in progress. Foundation, environment integration, and `How's Fishing` architecture/spec work are underway. Canonical feature logic now lives in dedicated spec files rather than a single mixed live-conditions document.

---

## Context Overview

TightLines AI is an AI-powered fishing app for iOS that helps anglers catch more fish through intelligent recommendations, visual water analysis, and effortless catch logging. Built by a solo founder (Brandon) under the FinSeekr brand ecosystem, the app targets both conventional and fly fishing anglers across freshwater and saltwater environments.

**What it does:** TightLines AI is built around a shared environmental intelligence architecture. The app first enriches requests with live weather/tide/moon/sun data, then runs a **deterministic core intelligence engine** that models fish behavior across freshwater, saltwater, and brackish water, and only then calls Claude for feature-specific explanation or recommendations. The three flagship AI features are: (1) a **How's Fishing Right Now?** feature that turns the engine's outputs into an honest real-time conditions report; (2) a **Lure/Fly Recommender** that uses the same engine as its baseline and layers on species, presentation, clarity, structure, and hatch logic to deliver ranked tackle recommendations; and (3) a **Water Reader** that uses the same engine as its baseline and layers on image-derived structure interpretation to show where fish are most likely positioned. The **Voice-to-Text Fishing Log** uses a related structured pipeline (Whisper transcription → Claude parsing) for logging, but it is not a consumer of the core environmental scoring engine in the same way as the three fishing-intelligence features.

**How it's built:** React Native/Expo on iOS, Supabase for auth/database/edge functions/storage, Claude via Anthropic Messages API for server-side AI calls (API keys never on client), OpenAI Whisper for voice transcription, and free environmental APIs (Open-Meteo, NOAA CO-OPS, USNO, Sunrise-Sunset.org). Model choice is feature-specific: `How's Fishing Right Now?` uses Claude Haiku 4.5 because the deterministic engine handles the hard reasoning and the LLM is primarily summarizing. Monetization is **paid-only** — zero free usage. All AI features require an active subscription ($9.99 Angler / $14.99 Master Angler). Every feature button prompts unsubscribed users to sign up. Angler gets core features with $1.00 API usage cap/month; Master Angler gets core features plus AI trip summary, catch log export, and $3.00 API usage cap/month. Detailed hatch intelligence panel (fly mode) deferred to Phase 2. RevenueCat handles iOS subscriptions.

**Key design principles:** GPS/location is helpful but never required — the AI works with partial input and deduces environment from whatever data is provided. All fields are optional except date and user ID. The schema is designed from day one to capture rich, structured fishing data valuable to conservation organizations and fishery departments. Offline support caches environmental data, queues voice recordings and manual logs locally, and syncs everything when connectivity returns. Community features (V1) are minimal — an explicit-share regional catch feed with "Near Me" filtering and strict location privacy (no exact coordinates ever shared). The data flywheel is the long game: more users → richer catch data → better AI recommendations → better community reports (V2) → more users.

**What's NOT in V1:** Trip planner (ranked fishing windows), full community features (auto-generated regional reports, social interaction, leaderboards), Android, ambassador/affiliate program, personal analytics dashboard. These are V2+.

---

**Platform:** iOS (React Native / Expo, EAS Build)
**Backend:** Supabase (Auth, PostgreSQL + PostGIS, Edge Functions, Storage)
**AI:** Claude via Anthropic Messages API, OpenAI Whisper (voice transcription)
**External APIs:** Open-Meteo (weather), NOAA CO-OPS (tides), USNO (moon/solunar), Sunrise-Sunset.org
**Subscriptions:** RevenueCat
**Analytics:** Mixpanel
**Target Launch:** ~1 month

---

## Build Order

1. **Foundation Layer** — Auth, onboarding, database schema, Supabase Edge Function framework, weather/environmental API integrations, analytics, error handling patterns
2. **How's Fishing Right Now? + Core Intelligence Engine** — Build the deterministic environmental intelligence layer first, then the feature that consumes it; validate the full pipeline and tier gating (Angler+)
3. **Lure / Fly Recommender** — Core AI feature, form inputs, GPS sync, LLM prompt pipeline, hatch chart reference doc, results UI
4. **Fishing Log** — Manual + voice-to-text logging, auto-log from recommendations, recommendation feedback loop, offline caching
5. **Water Reader** — Image upload, Claude Vision analysis, frontend overlay rendering with forgiving zones
6. **Community Feed** — Regional catch feed with usernames, optional photos, region filter
7. **Monetization & Gating** — Tier enforcement, API cost tracking per user, push notifications, export feature

---

## 1. Foundation Layer

### Auth, Profiles & Onboarding
- Supabase Auth (email + Apple Sign-In for iOS)
- User profile: username (public), display name, home region, preferred fishing mode (conventional or fly), preferred units
- Profile is visible in the community feed
- **Onboarding flow (3 screens):** First launch walks user through: (1) Welcome + value prop, (2) Preferences — fishing mode (conventional/fly/both), home region, favorite target species, (3) GPS permission request with clear explanation of why it improves recommendations. This data personalizes the very first AI recommendation. Keep it fast — skippable but encouraged. Preferences are editable later in settings.

### Environmental API Integration
- **Weather:** Current conditions + forecast — temperature, wind speed/direction, barometric pressure, cloud cover, precipitation
  - **Recommended:** Open-Meteo (free, no API key required, generous rate limits, global coverage, includes pressure/wind/cloud/precip) or OpenWeatherMap (free tier: 1,000 calls/day, well-documented, widely used). Visual Crossing is another strong option with a free tier.
- **Tides:** Tide charts for **coastal locations only** (high/low times, incoming/outgoing). Inland and non-coastal regions do not receive tide data — omit it and set `tides_available: false`.
  - **Recommended:** NOAA CO-OPS Tides & Currents API (free, no key required, US coastal coverage, high/low predictions + hourly data). NOAA requires a **station ID** — resolve nearest tide station from the user's coordinates using NOAA's station list or station-lookup endpoint. For global coverage, StormGlass.io (free tier: 50 requests/day) covers tides worldwide with automatic station selection by coordinates. WorldTides is another option (credit-based, 100 free credits on signup).
- **Moon phase & solunar:** Current lunar phase, major/minor solunar periods
  - **Recommended:** US Naval Observatory API (free, no key, moon phases + rise/set times, highly accurate). **Solunar periods:** Compute in the Edge Function from USNO moon transit times (solunar theory uses moon overhead/underfoot positions). Farmsense Moon API is a free alternative for basic moon phase and illumination data.
- **Sunrise/sunset:** Dawn, dusk, golden hour windows
  - **Preferred:** Open-Meteo (often bundles sunrise/sunset with weather in one call). **Fallback:** Sunrise-Sunset.org API (free, no key) if sun times are needed separately.
- All env data is **fetched in parallel** in the Edge Function (e.g. Promise.all) so one slow API doesn't add latency.
- **Partial failure:** Return whatever env data succeeded; include simple flags (e.g. `tides_available: boolean`) so the prompt and UI can adapt (e.g. "Tide data unavailable for this location"). Consider a weather fallback (e.g. OpenWeatherMap) if Open-Meteo fails.
- **Units:** Convert all env data to the user's preferred units (profile setting) before sending to Claude and to the client.
- All pulled via GPS coordinates when user syncs location, or derived from manual location entry.
- Cached locally for offline reference after initial pull.
- **When to refresh env data:**
  - **Dashboard / Live Conditions widget:** Refresh at most every **15 minutes** (use cache if last fetch was within 15 min). Keeps the main screen snappy without hammering APIs.
  - **On AI action confirm:** When the user taps "Recommend", "How's Fishing Right Now?", or submits Water Reader, **pull fresh env data** for that request so the AI gets current conditions. If offline, use cached data. Do not rely only on the dashboard cache for recommendations — the moment they commit to an AI feature, fetch (or accept client-supplied fresh data) for that call.
- **Scale (1K–5K users):** At ~1K users with 15-min dashboard cache and fresh pull on confirm, env API volume should be manageable. As you approach 3–5K users, consider Edge Function–level caching (e.g. short TTL cache keyed by lat/long bucket) to avoid duplicate fetches for the same area, and monitor external API rate limits.
- **Water Reader:** Send env data with the request when we have location (synced or manual) so the AI can factor conditions into fish behavior. If the user did not sync location and did not manually enter it, run the analysis with image + any other inputs only — the feature works with whatever it gets; more data improves results, less data still produces useful (if less tailored) output.
- **API strategy note:** Prioritize APIs that are free with no key (Open-Meteo, NOAA, USNO, Sunrise-Sunset) to minimize external dependencies and cost. StormGlass.io is the best single-source option if you want weather + tides + astronomy in one API, but the free tier is limited (50 req/day) — evaluate whether the convenience justifies the constraint at scale.

### Shared LLM Pipeline
All AI features follow the same backend pattern:
1. Client sends structured input (form data or image + metadata) to a Supabase Edge Function. For paid operations, client may send an **idempotency key** (e.g. UUID) so retries after timeout don't double-count usage or double-charge.
2. Edge Function enriches with environmental data (weather, tides, solunar, moon). For each request, use **fresh env data** (fetched at confirm time or supplied by client from a just-fetched cache). **Environmental data** may be supplied by the client when recently fetched, or the Edge Function fetches when missing or not provided. If the user provided no location (no sync, no manual entry), run with whatever inputs are present — more data yields better results; partial input still executes.
3. For fishing-intelligence features (`how_fishing`, `recommender`, `water_reader`), the backend runs the **deterministic core intelligence engine first**. This engine classifies environmental states, applies water-type-specific scoring, calculates recovery effects, generates time windows, and produces fish-behavior state outputs. The LLM does not perform this work. If one or more environmental variables are unavailable, the engine must continue using deterministic partial-data normalization rules, exclude missing components from score denominators, and return explicit data-quality metadata rather than failing or silently zeroing those variables.
4. Edge Function constructs a domain-specific prompt using the deterministic engine outputs plus any feature-specific inputs (species, image structure, hatch context, etc.), with **structured JSON output instructions**.
5. Claude returns structured JSON response.
6. Edge Function logs token usage and cost to the user's billing record; **tag the feature** (e.g. `recommender`, `water_reader`, `how_fishing`) for analytics and potential per-feature caps.
7. Response returned to client for rendering.

The framework is built once. Each feature then becomes:

- the shared environment/data enrichment layer
- the shared deterministic core intelligence layer where applicable
- a feature-specific Edge Function orchestrator
- a feature-specific prompt and output contract

**Canonical spec split:**

- Shared deterministic intelligence: `core_intelligence_spec.md`
- `How's Fishing Right Now?` feature: `hows_fishing_feature_spec.md`
- Legacy mixed live-conditions spec is archived and no longer the source of truth

**Error & fallback handling:** Every AI call must have graceful failure paths. If the Claude API call fails (timeout, 500, rate limit), retry once then show a user-friendly error with a "Try Again" button. If the response JSON is malformed or missing expected fields, the Edge Function validates the schema before returning to the client — fall back to partial results where possible (e.g., show 3 recommendations instead of 5 if only 3 parsed correctly). Never show a blank screen or crash. Log all failures for debugging.

### Offline Strategy
- **Environmental data:** Cached on device after initial sync so users can reference conditions offline
- **Voice logs:** Audio files recorded and stored locally with timestamps. Queued for processing when connectivity returns
- **Manual logs:** Saved to local storage, synced to Supabase on reconnect
- **AI features (recommender, water reader):** Require connectivity for the LLM call. If offline, user sees a clear message and can queue inputs for later processing
- **Pending entries:** Show as "draft" status in the log UI until synced and processed
- **Recommended:** Use expo-sqlite or WatermelonDB for local offline storage with sync capabilities. React Native's AsyncStorage works for simple key-value caching (environmental data), but a local DB is better for queuing structured log entries.
- **Implementation note:** Design and implement the expo-sqlite (or WatermelonDB) schema when building the Fishing Log feature (Section 4), not during Foundation. AsyncStorage already handles env caching; the local DB is only needed for queuing voice recordings and manual log entries for sync. See Section 4 (Fishing Log) for details.

### Database Schema Principles
The schema is designed from day one to capture rich, structured fishing data with future value for conservation organizations, state fishery departments (aggregated, anonymized), auto-generated community reports (V2), trend analysis and species population insights, and personal analytics for users.

**Key principles:**
- Every catch is a discrete record with its own species, size, lure, timestamp, and location — stored in a `catches` table linked to a parent `sessions` table
- Conditions are captured at the session level (weather, tides, moon, water) — not duplicated per catch
- AI recommendations are linked to sessions for correlation analysis (what was recommended vs. what worked)
- Location stored at full GPS precision internally, but shared externally only at the user's chosen precision level
- All fields optional except date and user ID — the schema accommodates partial data gracefully
- Use Supabase's PostGIS extension for geospatial queries (regional aggregation, nearest body of water)
- Store images (catch photos, water reader uploads) in Supabase Storage with references in the DB
- Use JSONB columns for flexible/extensible data (e.g., AI response payloads, gear details) where strict schema isn't needed yet

### Key Tech Decisions
- **React Native / Expo:** Use Expo managed workflow for faster iteration. EAS Build for iOS distribution. Expo Router for navigation.
- **Supabase Edge Functions:** Written in Deno/TypeScript. Handle all LLM calls, API enrichment, cost tracking. Keep API keys server-side — never in the client.
- **Claude API:** Select the model by feature complexity. `How's Fishing Right Now?` now uses Claude Haiku 4.5 (`claude-haiku-4-5`) because the deterministic engine handles the hard reasoning and the LLM is primarily summarizing. Reserve stronger Claude models for heavier reasoning or generation tasks where evals prove the quality gain is worth the cost.
- **Whisper API:** OpenAI Whisper (`whisper-1`) for voice transcription. ~$0.006/minute. Alternatively, evaluate Deepgram for potentially faster turnaround and lower latency.
- **Image handling:** Use Expo ImagePicker for uploads. Compress images client-side before sending to Edge Functions (water reader images don't need full resolution for Claude Vision analysis — 1024px on the long edge is sufficient and saves token cost).
- **Subscriptions:** RevenueCat for iOS in-app subscription management. Handles receipt validation, subscription status, and integrates with Supabase via webhooks.
- **State management:** Zustand or React Context for client-side state. Keep it simple — avoid Redux overhead for a V1.
- **Analytics & event tracking:** Mixpanel. Integrate with the first AI feature (How's Fishing); add SDK and event calls as each feature ships. Track: feature usage (which AI features get used most), input form drop-off (where users abandon), usage cap hits, free-to-paid conversion, voice log vs. manual log ratio, session frequency. Without this, you're flying blind on what's working post-launch.
- **Push notifications:** Use Expo Notifications (built into Expo, supports iOS APNs). V1 notifications: approaching usage cap ("You've used 80% of your monthly AI calls"), re-engagement nudges ("You logged a trip Saturday — how'd it go?"), and optionally community feed activity ("Redfish are trending in your region"). Keep notifications minimal and valuable — don't spam.

---

## 2. How's Fishing Right Now?

A real-time fishing conditions feature accessible from the Home Dashboard below the Live Conditions widget. This is the first consumer of the shared deterministic core intelligence engine and the first full validation of the app's environmental intelligence pipeline. It uses environmental data only (no user spot input, no images), making it the ideal first production feature before the more complex Recommender and Water Reader.

### Access & Tier Gating
- **Subscribers only (Angler or Master Angler).** Unsubscribed users see the button and tapping triggers a subscribe prompt.
- **GPS only** — no manual location entry for this feature. Requires a synced location to pull weather data. If no location is set, tapping the button prompts the user to sync location via explicit "Enable location" or "Sync location" buttons.

### How It Works
1. User taps "How's Fishing Right Now?" on the Home Dashboard
2. Client opens the Expanded Conditions page using cached environment data when available
3. When the user confirms the action, the app force-fetches fresh environmental data
4. Backend runs the deterministic core intelligence engine
5. If inland: run one `freshwater` engine pass and one Claude call
6. If coastal: run three engine passes in parallel (`freshwater`, `saltwater`, `brackish`) and three Claude calls in parallel
7. Claude receives deterministic engine outputs and writes the narrative report; it does not calculate the score
8. Client renders the analysis in a full-screen results view with one tab inland or three tabs for coastal users

### LLM Prompt Design
- System prompt is feature-specific but engine-first: the prompt receives deterministic score outputs, alerts, windows, and behavior states from the core intelligence engine
- The prompt does NOT receive user spot details, target species, or lure/fly context
- The LLM is explicitly prohibited from recalculating or contradicting engine outputs
- Output: structured JSON

### Output
1. **Overall Fishing Rating** — deterministic adjusted score out of `100`, rating label, and concise biological summary
2. **Best Times to Fish Today** — ranked deterministic windows with one-sentence reasoning
3. **Worst Times to Fish Today** — lowest-probability windows with one-sentence explanation
4. **Key Factors** — narrative explanations for pressure, temperature trend, light, tide/solunar, moon, wind, and precipitation
5. **Score Breakdown** — deterministic component contribution display; this is mandatory for trust and transparency
6. **Alerts / Recovery Notes** — rapid cooling, cold-front recovery, cold stun, and salinity disruption when applicable
7. **Tips for Today** — 2–3 actionable but non-species-specific suggestions
8. **Water Type Tabs** — inland users see `Freshwater` only; coastal users see `Freshwater`, `Saltwater`, and `Brackish`

### API Cost
- Inland: single Claude API call per analysis: ~$0.01-0.015 (text only)
- Coastal: three Claude API calls per analysis bundle, one per water type: roughly ~$0.03-0.045 total
- Environmental API calls: free (Open-Meteo, NOAA, USNO, Sunrise-Sunset.org)
- Counts toward the user's monthly AI usage cap

### Implementation Notes
- **Location is GPS-only for this feature** — manual location entry is not supported.
- Results are NOT saved to the fishing log (this is a conditions check, not a fishing session)
- Reports must be cached per water type and location for a short TTL (target: 45 minutes)
- The analysis is location-specific but NOT species-specific — species-specific advice comes from the Recommender
- This feature must consume `core_intelligence_spec.md` and `hows_fishing_feature_spec.md`; it must not implement its own parallel scoring rules
- Build this feature first after Foundation to validate: (a) environmental APIs are flowing correctly, (b) the deterministic core engine works end-to-end, (c) Edge Function → Claude pipeline works end-to-end, (d) tier gating works, (e) cost tracking logs correctly

---

## 3. Lure / Fly Recommender

### Modes
- **Conventional fishing mode** — lure recommendations
- **Fly fishing mode** — fly pattern recommendations + hatch chart intelligence

### User Inputs
**Auto-filled via GPS sync (when available):**
- Location (lat/long → region, state, nearest body of water)
- Weather conditions (temp, wind, pressure, cloud cover, precipitation)
- Tide data (if coastal)
- Moon phase, solunar periods
- Sunrise/sunset
- Time of year / season (derived from date + location)

**User-entered (always available):**
- Target species
- Body of water type: river, lake, pond, surf/beach, inshore flats, offshore, creek, reservoir
- Water type: freshwater, saltwater, brackish
- Water clarity: clear, stained, murky, muddy
- Bottom/structure composition: grassy, sandy, rocky, muddy, mixed (optional)
- Water temperature (optional — most users won't know this, but it helps significantly)
- Short text description of the spot (optional — "fishing a deep bend in the river with fallen timber")

**Key design rule:** GPS/location sync is used when available but never required. The AI deduces environment, climate zone, and probable conditions from whatever the user provides. More fields = better accuracy, but the system works with partial input.

### LLM Prompt Design
- System prompt includes fishing domain expertise, species behavior patterns, and seasonal knowledge
- The Recommender must consume the shared deterministic core intelligence engine first, then layer on species behavior, clarity, structure, season, and hatch logic
- Chain-of-thought prompting: model reasons through engine outputs → species behavior → lure/fly selection before outputting recommendations
- Output: structured JSON

### Output — Conventional Mode
1. **Top 5 lure recommendations** — ranked, with specific color, size, and brand-agnostic descriptions
2. **How to fish each** — retrieval style (slow roll, jerk-pause, steady retrieve, hop-the-bottom, etc.)
3. **Where to fish each** — depth, structure, positioning (e.g., "work the edges of grass lines in 3-5 feet of water")
4. **Why each will work** — tied to current conditions (pressure dropping → aggressive feed, murky water → vibration-heavy lures, etc.)
5. **Overview summary** — 2-3 sentence situational assessment tying conditions to strategy

### Output — Fly Fishing Mode
Same structure as conventional, but with fly patterns instead of lures, plus:

**Hatch Chart Intelligence (fly mode + river/stream only):**
- What insects are likely hatching for the given location, date, and conditions
- Life stage: nymph, emerger, dry/adult, spinner
- Specific fly pattern matches with hook sizes
- Presentation notes (dead drift, swing, skate, etc.)

**Hatch Intelligence Panel — deferred to Phase 2.** Complex to build; not required for V1 launch. Fly mode still returns fly pattern recommendations; the detailed Hatch Intelligence Panel (Master Angler) ships in Phase 2.

**Tier gating:** All tiers get fly pattern recommendations in fly mode — the AI uses hatch knowledge internally to pick the right flies regardless. **Master Angler** unlocks a detailed Hatch Intelligence Panel below the recommendations (Phase 2) showing: specific insects hatching, current life stages, size ranges, peak hatch timing windows during the day, and a full pattern-matching table (insect → fly pattern → hook size → presentation). Same AI call and same prompt — the detailed hatch data is included in the JSON response but only displayed in the UI for Master Angler users.

**Hatch data source (V1):** Hybrid approach — a curated reference document (JSON/markdown) covering ~20-30 core insect species across ~15-20 US/Canada geographic zones, loaded into the system prompt as grounding context. The LLM reasons against this reference + its training knowledge. Coverage: US, Canada, Europe where possible. Over time, user log data validates and refines hatch accuracy.

**Build task — Hatch Chart Reference Document:** This is an explicit dependency for fly fishing mode. Must be completed before the fly recommender prompt is finalized. Source from authoritative fly fishing entomology references. Structure as a JSON file keyed by geographic zone and month, with entries for insect species, common names, hatch timing, life stages, and matching fly patterns with sizes. Estimated effort: 1-2 days of research and formatting. Without this, fly fishing mode launches without its key differentiator.

---

## 4. Fishing Log

### Auto-Logging from AI Features
- After every recommender or water reader session, the session is automatically saved to the log as a draft
- All entered data + environmental data + AI recommendations are pre-populated
- **All fields are editable** — including auto-pulled weather and conditions data. Users may move spots mid-session, conditions may change, or auto-pulled data may be slightly off. Every field can be overridden.
- User can add catches, attach photos, or delete the log entry
- Deleted logs still live in recommendation history — user can re-add to log later via an "Add to Log" button

### Manual Log Creation
- Users can create a log entry from scratch without using an AI feature
- All fields available: date/time, location, weather/conditions, species caught, lure/fly used, size, quantity, photos, notes
- Same fields as auto-logged entries, just manually filled
- **Unified entry screen:** Manual and voice logging share a single screen. The default view is the manual form. A prominent "Voice Log" button sits at the top of the form — tapping it activates voice recording. This avoids a separate "choose your entry method" step and lets users switch between typing and speaking within the same flow.

### Voice-to-Text Logging (Angler + Master Angler)
**Pipeline:** Record audio → Whisper API transcription → Claude parses fishing slang → structured fields auto-filled → user reviews and confirms

**Tech implementation:**
- Use `expo-audio` for audio recording on device (M4A/WAV format) — note: `expo-av` was removed due to Xcode compatibility issues
- Audio sent to Supabase Edge Function → forwarded to Whisper API (`whisper-1` model)
- Whisper transcript sent to Claude in the same Edge Function with a parsing prompt that understands fishing slang, species nicknames, and lure shorthand
- Claude returns structured JSON matching the log schema fields
- Two API calls per voice entry: one Whisper (~$0.006/min), one Claude (~$0.01) — total ~$0.016 per voice log

**How it works:**
- User taps mic button, speaks naturally: "Got out around 7, picked up a solid Red right away, probably 26 inches. Switched to the white paddle tail and caught two more."
- Whisper transcribes the audio
- Claude receives the transcript and parses it into structured fields:
  - Species: Redfish
  - Quantity: 3
  - Sizes: 26" (first), unspecified (second two)
  - Lure: White paddle tail
  - Time: ~7:00 AM
- User sees pre-filled fields, confirms or edits, saves

**Mid-trip running log:**
- Users can voice-log catches throughout the day as they happen
- Each entry is timestamped automatically
- At end of day, the app stitches all voice entries into a single structured trip log
- Captures data in the moment — no recall bias, real timestamps, accurate lure/gear data

**AI Trip Summary Narrative (Master Angler only):**
- After a day of mid-trip voice logging, Master Angler users get an AI-generated polished trip narrative stitched from all their voice entries
- Reads like a personal fishing journal entry: "Started the morning on an outgoing tide around 7 AM and immediately connected with a solid 26-inch Redfish on a white paddle tail. Switched spots mid-morning and picked up two more..."
- Stored alongside the structured log data — the user gets both the data fields and the story
- One additional Claude API call at end of day using all transcripts + catch data as input

**Offline voice logging:**
- Audio files recorded and stored locally on device
- Queued as "pending" entries in the log (visible but unprocessed)
- When connectivity returns: Whisper transcription → Claude parsing → fields populated
- User can record as many voice entries as needed while offline

### Log Fields (Schema)
Designed for rich data capture with future conservation/aggregation value:

- **Session:** date, start time, end time, duration
- **Location:** GPS coordinates (if synced), region name, body of water name, water type (fresh/salt/brackish), body of water type (river/lake/surf/etc.)
- **Conditions:** air temp, water temp, wind speed/direction, barometric pressure, cloud cover, precipitation, tide phase + time, moon phase, solunar period, water clarity, bottom composition
- **Catches (array):** species, size (length/weight), quantity, timestamp per catch, lure/fly used (name, color, size, type), retrieval/presentation method, depth caught, photo (optional), release status (kept/released)
- **Gear/notes:** rod/reel setup (optional), general notes, voice transcript (raw text preserved)
- **AI context:** linked recommendation ID or water reader session ID (if auto-logged), AI-recommended lures/flies for that session
- **Recommendation feedback:** simple "Did this recommendation help?" prompt (thumbs up/down or yes/no) shown on log entries linked to AI sessions. Stored as a boolean on the session record. This closes the feedback loop — measures actual recommendation accuracy, improves prompts over time, and becomes a signal for community reports in V2. Trivial to build, extremely valuable data.
- **Privacy:** location precision level (exact, regional, hidden) — user controls what granularity is shared to community

### Personal Bests by Species
- The app tracks the largest catch per species as a **Personal Best (PB)** record
- PB is determined automatically from the `catches` table — largest size (length) per species for a given user
- **My Log tab:** A compact PB preview card sits between the stats row and the New Entry button, showing the user's overall top PB (species, size, weight) with a species count and a tap-through to the full PB screen
- **Personal Bests screen:** Dedicated screen (`/personal-bests`) showing all PBs as cards, one per species. Filter pills at the top let users filter by species (e.g., "All (3)", "Redfish", "Largemouth Bass", "Spotted Seatrout"). Each card shows: species, size, weight, location, date, and conditions. Tappable to navigate to the full log detail for that trip. The overall #1 PB gets a gold accent border.
- PB data is derived from logged catches — no separate table needed. Query: `SELECT DISTINCT ON (species) * FROM catches WHERE user_id = $1 ORDER BY species, length DESC`
- PBs update automatically as new catches are logged

### Recommendation & Water Reader History
- Separate from the log — all AI sessions are permanently stored in history
- User can browse past recommendations and water reader analyses
- "Add to Log" button on any historical session to re-create a log entry

---

## 5. Water Reader

### Image Types Supported
- **River/stream:** Physical photo taken by user, satellite/aerial image, depth/bathymetric chart
- **Lake/reservoir:** Satellite/aerial image, depth/bathymetric chart
- **Coastal/surf:** Satellite/aerial image, depth/bathymetric chart
- **Satellite of a river:** Included — satellite views show bends, pools, riffles, and structure useful for analysis
- Let the user upload whatever they have; the vision model classifies the image type

### User Inputs
Same environmental inputs as the recommender (GPS sync or manual), plus:
- Image upload (required)
- Fishing mode toggle (conventional or fly) — affects whether lure or fly suggestions are included
- All other fields optional but improve accuracy (species, water type, clarity, composition, description)

### AI Analysis Pipeline
1. User uploads image + metadata to Edge Function
2. Edge Function enriches with environmental data
3. Edge Function runs the shared deterministic core intelligence engine when location-based env data is available
4. Image + structured context + engine outputs sent to Claude Vision API
5. **Chain-of-thought prompting:** Model first reasons about the environment from visual cues plus engine outputs before making recommendations — this handles cases where user provides minimal input
6. Model returns structured JSON:
   - Array of target zones, each with: zone description, percentage-based coordinates on the image (bounding box or region descriptor), why this zone is productive, how to fish it (positioning, approach, depth), lure/fly suggestions tied to mode
   - Overall summary of the water and strategy
7. Frontend renders the overlay on top of the original image

### Frontend Overlay Rendering
- **Frontend-rendered, not AI-generated images** — Claude returns structured zone data, the app paints overlays using canvas/SVG
- **Recommended:** Use `react-native-canvas` or `react-native-svg` to render overlay shapes on top of the uploaded image. SVG is simpler for circles, rectangles, and text labels. Canvas gives more control for complex shapes and gradients.
- **V1 approach: large, forgiving zones.** Claude Vision's spatial coordinate accuracy is imperfect — precise bounding boxes may be off by 10-20%. Start with broad zone regions (quadrants, thirds, large shaded areas) rather than precise circles or pinpoints. Claude returns zones as rough percentage-based regions (e.g., `{"x": 0.3, "y": 0.1, "width": 0.25, "height": 0.3}`) with generous sizing. The frontend renders these as semi-transparent shaded overlays with numbered labels. Refine zone precision in future updates as you test and calibrate.
- Tappable zones that expand to show the full explanation, how-to, and suggestions
- Consistent branded visual treatment (TightLines AI aesthetic)
- The structured zone data is stored and reusable (goes into log, history, is queryable)
- **Fallback:** If zone coordinates are clearly unusable, fall back to a numbered list with qualitative descriptions ("Zone 1: the deep pool where the riffle meets the bend on the right side") without an overlay. Always show the summary and recommendations regardless of overlay quality.

### Key Design Notes
- AI works with partial input — if user uploads just an image with no other data, the model deduces environment from visual cues (water color, vegetation, background terrain, angler clothing/gear)
- More context = better analysis, but it always produces useful output
- Each water reader session auto-saves to history and auto-creates a log draft

---

## 6. Community Feed (V1 — Minimal)

### What Ships
- A scrollable regional feed showing recent catch activity
- Each entry displays: username, species, size (if logged), lure/fly used, regional location (e.g., "Tampa Bay Inshore"), time ago, optional photo
- **"Near Me" default filter** — feed defaults to showing catches from the user's home region (set during onboarding). "All Activity" toggle shows the full feed. This keeps the feed relevant even with low user volume at launch — a user in Montana doesn't need to see Tampa Bay catches by default.
- **No exact coordinates ever shown** — all locations aggregated to regional level (this is non-negotiable for angler trust)
- Users can opt into sharing more granular zone info, but default is vague regional
- **Sharing is explicit, not automatic** — catches are NOT auto-published. Users choose to share each catch individually via a "Share to Feed" action on any log entry. This keeps the user in control and builds trust.

### Privacy Controls
- Users control their location precision level per log entry: exact (never shared publicly), regional (shown in feed), or hidden
- Default: regional
- Usernames are visible; catches are attributed but locations are vague

### What's Deferred to V2
- Auto-generated community reports ("Tampa Bay — Last 7 Days" with trending species, top lures, best conditions)
- Interaction (likes, comments, follows)
- Leaderboards or badges
- Full social profile pages
- Network effects and engagement loops

---

## 7. Monetization

### Tier Structure
**Paid-only model** — zero free usage. All AI features require an active subscription. Every feature button prompts unsubscribed users to sign up with a generic subscribe prompt.

| | Angler ($9.99/mo) | Master Angler ($14.99/mo) |
|---|---|---|
| AI Usage cap | $1.00 API cost/month | $3.00 API cost/month |
| How's Fishing Right Now? | Yes | Yes |
| Lure/Fly Recommender | Yes | Yes |
| Water Reader | Yes | Yes |
| Voice-to-Text Logging | Yes | Yes |
| Manual Logging | Unlimited | Unlimited |
| Recommendation & Water Reader History | Yes | Yes |
| Community Feed | Full access (share catches) | Full access (share catches) |
| **Detailed Hatch Intelligence Panel** | No | **Phase 2** |
| **AI Trip Summary Narrative** | No | **Master Angler only** |
| **Catch Log Export (CSV/PDF)** | No | **Master Angler only** |

**Actual per-call cost estimates:** ~$0.012-0.015 for text recommendations, ~$0.03-0.05 for water reader (vision), ~$0.006/minute for Whisper transcription, ~$0.016 per voice log entry (Whisper + Claude parsing).

### Master Angler Exclusive Features

**1. Detailed Hatch Intelligence Panel (fly mode)**
All tiers get fly pattern recommendations in fly mode — the AI uses hatch knowledge internally to pick the right flies regardless. Master Angler unlocks a dedicated Hatch Intelligence Panel displayed below the standard recommendations.

What it shows: specific insects hatching right now, current life stage (nymph, emerger, dry/adult, spinner), size ranges, peak hatch timing windows during the day, and a full pattern-matching table (insect → fly pattern → hook size → presentation technique).

How to build it:
- **Prompt design:** The fly mode prompt already requests hatch-informed fly recommendations for all tiers. For the detailed panel, extend the JSON output schema to include a separate `hatch_intelligence` object alongside the standard `recommendations` array. This object contains: `hatching_insects` (array of insects with species name, common name, life_stage, size_range, peak_window), `pattern_matches` (array mapping each insect to 1-2 fly patterns with hook size and presentation), and `hatch_summary` (2-3 sentence overview of current hatch activity).
- **Single API call, same prompt for all tiers.** The prompt always requests the full hatch intelligence data in the JSON response. The Edge Function returns the complete response to the client. The client checks the user's subscription tier and conditionally renders the Hatch Intelligence Panel — Master Angler sees it, other tiers see an upgrade prompt teaser (e.g., "Unlock detailed hatch intelligence — see what's hatching right now" with a Master Angler badge).
- **UI implementation:** The panel sits below the top 5 fly recommendations as a collapsible section. Header: "What's Hatching Now" with an insect icon. Content: a card per hatching insect showing common name, life stage badge (color-coded: green=nymph, yellow=emerger, blue=dry), size range, peak time window, and the matching fly pattern(s) with hook sizes. Keep it clean and visual — this is the "entomology nerd" layer that serious fly anglers will pay for.
- **Data dependency:** This relies on the hatch chart reference document being loaded into the system prompt (see Build Task in Section 2). Without it, the LLM can still produce hatch data from training knowledge, but accuracy drops for region-specific timing.

**2. AI Trip Summary Narrative**
After a day of mid-trip voice logging, Master Angler users get an AI-generated polished trip narrative stitched from all their voice entries. Angler users get standard voice-to-text field parsing only.

How it works: One additional Claude API call at end of day. Input: all voice transcripts from the session + structured catch data + conditions. Output: a 2-4 paragraph natural language trip report stored alongside the structured log data. The user gets both the data fields and the story.

**3. Catch Log Export (CSV/PDF)**
Master Angler users can export their full catch log history as CSV or PDF. Implementation details in the Implementation section below.

### Implementation
- Supabase Edge Functions log token usage and computed cost after every Claude/Whisper API call
- Cost counter per user per billing cycle stored in a `usage_tracking` table in Supabase (user_id, billing_period, total_cost, call_count)
- **Usage caps:** $1.00/month (Angler), $3.00/month (Master Angler). Pre-call check against `usage_tracking.total_cost_usd`; if user would exceed tier cap, block request and return usage_cap_exceeded
- Approaching-limit warning at ~80% usage
- Feature flags stored on the user profile based on subscription tier — controls UI visibility of the 3 gated features (hatch panel, trip summary, export)
- RevenueCat for iOS subscription management — handles receipt validation, subscription status, renewal events. Connect to Supabase via RevenueCat webhooks to update user tier status in real-time.
- **Subscribe screen:** Currently a placeholder ("Angler $9.99/mo and Master Angler $14.99/mo coming soon"). Wire up full RevenueCat paywall UI during the Monetization phase.
- **80% usage cap warning:** When a user's `usage_tracking.total_cost_usd` crosses 80% of their tier cap, surface a warning in the app (e.g. a banner on Home or an in-app notification: "You've used 80% of your monthly AI calls"). Implement alongside push notification support in the Monetization phase.
- **CSV export:** Query user's catch log from Supabase, format as CSV server-side in an Edge Function, return as downloadable file
- **PDF export:** Use a lightweight PDF generation library in the Edge Function (e.g., `jspdf` or generate HTML → PDF) to create a formatted catch report

---

## 8. V2+ Roadmap (Not in V1 Scope)

- **Trip Planner** — ranked fishing windows synthesizing weather forecast, tides, moon phase, solunar, sunrise/sunset
- **Full Community Features** — auto-generated regional reports, social interaction, follows, leaderboards
- **Android Launch**
- **Ambassador/Affiliate Program** — promo codes, commission on Pro conversions, leveraging FinSeekr network
- **Personal Analytics Dashboard** — catch trends, best conditions, species breakdown over time
- **Hatch Chart Refinement** — user log data validates and improves hatch intelligence over time
