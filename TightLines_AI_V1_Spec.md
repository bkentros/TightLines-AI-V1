# TightLines AI — V1 Product Spec

## Dev Environment (Read This First)

**Project directory:** `/Users/brandonkentros/TightLines AI V1/TightLinesAI/`
**Stack:** React Native / Expo SDK 55, Expo Router (`app/` directory), TypeScript, Supabase, Zustand
**Testing:** iPhone 15 Pro Max — EAS dev client build installed. Run Metro with `npx expo start --dev-client --host lan` from the project directory. No simulator — physical device only over LAN.
**Installing packages:** Always use `npm install <package> --legacy-peer-deps`. For expo packages use `npx expo install <package> -- --legacy-peer-deps`. There is a peer dependency conflict with react-dom versions that requires this every time.
**Key packages already installed:** `expo-router`, `expo-dev-client`, `expo-location`, `expo-camera`, `expo-image-picker`, `expo-audio` (NOT expo-av — incompatible with Xcode 26.2), `expo-sqlite`, `expo-notifications`, `@supabase/supabase-js`, `zustand`, `react-dom`
**Bundle ID:** `com.finseekr.tightlinesai` | **EAS project:** `@tightlinesai/tightlines-ai`
**Current state:** Bare scaffold — `app/_layout.tsx` and `app/index.tsx` placeholder only. Supabase not yet configured.

---

## Context Overview

TightLines AI is an AI-powered fishing app for iOS that helps anglers catch more fish through intelligent recommendations, visual water analysis, and effortless catch logging. Built by a solo founder (Brandon) under the FinSeekr brand ecosystem, the app targets both conventional and fly fishing anglers across freshwater and saltwater environments.

**What it does:** Three core features share a single architecture pattern — structured user input → automatic environmental data enrichment via weather/tide/moon APIs → single Claude API call with domain-specific prompt → structured JSON response → clean results UI. The features are: (1) a **Lure/Fly Recommender** that synthesizes weather, water conditions, species behavior, and (in fly mode) insect hatch intelligence to deliver ranked tackle recommendations with retrieval instructions; (2) a **Water Reader** that accepts photos, satellite images, or depth charts of any body of water and returns an AI-analyzed visual overlay highlighting where and how to fish; and (3) a **Voice-to-Text Fishing Log** where anglers speak naturally mid-trip and the app (Whisper transcription → Claude parsing) auto-fills structured catch data — species, size, lure, timestamps — with zero manual entry.

**How it's built:** React Native/Expo on iOS, Supabase for auth/database/edge functions/storage, Claude Sonnet 4.6 for all AI calls via Supabase Edge Functions (API keys never on client), OpenAI Whisper for voice transcription, and free environmental APIs (Open-Meteo, NOAA CO-OPS, USNO, Sunrise-Sunset.org). Monetization is freemium with three tiers (Free, Angler, Master Angler) — all tiers access the same core features (recommender, water reader, logging, community feed, history), differentiated primarily by API usage volume ($0.05 / $0.99 / $2.99). Master Angler exclusively unlocks three premium features: detailed hatch intelligence panel (fly mode), AI trip summary narratives (from voice logs), and catch log export (CSV/PDF). RevenueCat handles iOS subscriptions.

**Key design principles:** GPS/location is helpful but never required — the AI works with partial input and deduces environment from whatever data is provided. All fields are optional except date and user ID. The schema is designed from day one to capture rich, structured fishing data valuable to conservation organizations and fishery departments. Offline support caches environmental data, queues voice recordings and manual logs locally, and syncs everything when connectivity returns. Community features (V1) are minimal — an explicit-share regional catch feed with "Near Me" filtering and strict location privacy (no exact coordinates ever shared). The data flywheel is the long game: more users → richer catch data → better AI recommendations → better community reports (V2) → more users.

**What's NOT in V1:** Trip planner (ranked fishing windows), full community features (auto-generated regional reports, social interaction, leaderboards), Android, ambassador/affiliate program, personal analytics dashboard. These are V2+.

---

**Platform:** iOS (React Native / Expo, EAS Build)
**Backend:** Supabase (Auth, PostgreSQL + PostGIS, Edge Functions, Storage)
**AI:** Claude Sonnet 4.6 via Anthropic Messages API, OpenAI Whisper (voice transcription)
**External APIs:** Open-Meteo (weather), NOAA CO-OPS (tides), USNO (moon/solunar), Sunrise-Sunset.org
**Subscriptions:** RevenueCat
**Analytics:** Mixpanel
**Target Launch:** ~1 month

---

## Build Order

1. **Foundation Layer** — Auth, onboarding, database schema, Supabase Edge Function framework, weather/environmental API integrations, analytics, error handling patterns
2. **How's Fishing Right Now?** — Weather-only AI analysis, first pipeline validation, tier gating (Angler+)
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
- **Tides:** Tide charts for **coastal locations only** (high/low times, incoming/outgoing). Inland (e.g. Missouri) and non-coastal regions do not receive tide data — omit it and set `tides_available: false`. Great Lakes do not have NOAA tide stations; treat as no tide data in V1. Revisit later (separate water-level source). In the UI, show "Coming soon" for tide/water-level in Great Lakes regions.
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
3. Edge Function constructs a domain-specific prompt with **structured JSON output instructions** (use Claude's structured output / JSON schema mode to minimize malformed responses).
4. Single Claude API call → structured JSON response.
5. Edge Function logs token usage and cost to the user's billing record; **tag the feature** (e.g. `recommender`, `water_reader`, `how_fishing`) for analytics and potential per-feature caps.
6. Response returned to client for rendering.

Each new feature = a new Edge Function with a new prompt template. The framework is built once.

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
- **Claude API:** Use Claude Sonnet 4.6 (`claude-sonnet-4-6`) for all LLM calls. Sonnet balances quality and cost — Opus is unnecessary for structured fishing recommendations. Use the Messages API with JSON mode for reliable structured output.
- **Whisper API:** OpenAI Whisper (`whisper-1`) for voice transcription. ~$0.006/minute. Alternatively, evaluate Deepgram for potentially faster turnaround and lower latency.
- **Image handling:** Use Expo ImagePicker for uploads. Compress images client-side before sending to Edge Functions (water reader images don't need full resolution for Claude Vision analysis — 1024px on the long edge is sufficient and saves token cost).
- **Subscriptions:** RevenueCat for iOS in-app subscription management. Handles receipt validation, subscription status, and integrates with Supabase via webhooks.
- **State management:** Zustand or React Context for client-side state. Keep it simple — avoid Redux overhead for a V1.
- **Analytics & event tracking:** Mixpanel. Integrate with the first AI feature (How's Fishing); add SDK and event calls as each feature ships. Track: feature usage (which AI features get used most), input form drop-off (where users abandon), usage cap hits, free-to-paid conversion, voice log vs. manual log ratio, session frequency. Without this, you're flying blind on what's working post-launch.
- **Push notifications:** Use Expo Notifications (built into Expo, supports iOS APNs). V1 notifications: approaching usage cap ("You've used 80% of your monthly AI calls"), re-engagement nudges ("You logged a trip Saturday — how'd it go?"), and optionally community feed activity ("Redfish are trending in your region"). Keep notifications minimal and valuable — don't spam.

---

## 2. How's Fishing Right Now?

A weather-based AI fishing analysis accessible from the Home Dashboard below the Live Conditions widget. This is the simplest AI feature in the app — it only uses environmental data (no user spot input, no images) — making it an ideal first validation of the Foundation Layer's environmental API integration and LLM pipeline before building the more complex Recommender.

### Access & Tier Gating
- **Angler and Master Angler only.** Free tier users see the button with a tier badge ("Angler+") and tapping triggers an upgrade prompt.
- Requires a synced location (GPS) or manually entered location to pull weather data. If no location is set, tapping the button prompts the user to sync or enter a location first.

### How It Works
1. User taps "How's Fishing Right Now?" on the Home Dashboard
2. Client sends the user's location (GPS coordinates or manual region) to a Supabase Edge Function
3. Edge Function pulls current + forecast environmental data: temperature, wind speed/direction, barometric pressure, cloud cover, precipitation, tide phase (if coastal), moon phase, solunar periods, sunrise/sunset
4. Edge Function constructs a weather-analysis prompt and makes a single Claude API call
5. Claude returns structured JSON analysis
6. Client renders the analysis in a full-screen results view

### LLM Prompt Design
- System prompt includes fishing-specific weather interpretation: how barometric pressure trends affect bite activity, optimal wind conditions, cloud cover and light penetration effects, tide timing for coastal species, solunar feeding windows, temperature thresholds by species category
- The prompt does NOT receive any user spot details, target species, or water body info — it works purely from environmental conditions and the user's general region
- Output: structured JSON

### Output
1. **Overall Fishing Rating** — a clear rating (e.g., "Good", "Fair", "Excellent", "Tough") with a 1-2 sentence summary explaining why ("Falling pressure and incoming tide create an aggressive feeding window — get out there")
2. **Best Times to Fish Today** — ranked time windows (e.g., "6:30 AM – 9:00 AM — Prime", "4:00 PM – 6:30 PM — Good") with reasoning tied to solunar periods, tide timing, and light conditions
3. **Worst Times to Fish Today** — time windows to avoid with explanations (e.g., "11:00 AM – 2:00 PM — midday sun, high pressure peak, slack tide")
4. **Key Factors** — breakdown of individual conditions and their impact:
   - Barometric pressure trend and what it means for fish behavior
   - Wind assessment (direction, speed, whether it's favorable or unfavorable)
   - Cloud cover / light conditions
   - Tide phase and timing (coastal only)
   - Moon phase and solunar activity
   - Temperature assessment
5. **Tips for Today** — 2-3 actionable tips based on the conditions (e.g., "Fish the shade lines — overcast breaks will push bait into structure", "Work moving water on the tide change")

### API Cost
- Single Claude API call per analysis: ~$0.01-0.015 (text only, no vision)
- Environmental API calls: free (Open-Meteo, NOAA, USNO, Sunrise-Sunset.org)
- Counts toward the user's monthly AI usage cap

### Implementation Notes
- Results are NOT saved to the fishing log (this is a conditions check, not a fishing session)
- Results could be cached for a configurable window (e.g., 30-60 minutes) to avoid redundant API calls if the user taps repeatedly
- The analysis is location-specific but NOT species-specific — it's a general "how's fishing" assessment for the region. Species-specific advice comes from the Recommender.
- Build this feature first after Foundation to validate: (a) environmental API data is flowing correctly, (b) Edge Function → Claude pipeline works end-to-end, (c) tier gating logic works, (d) cost tracking logs correctly

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
- System prompt includes fishing domain expertise, species behavior patterns, seasonal knowledge
- Chain-of-thought prompting: model reasons through environment → fish behavior → lure/fly selection before outputting recommendations
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

**Tier gating:** All tiers get fly pattern recommendations in fly mode — the AI uses hatch knowledge internally to pick the right flies regardless. **Master Angler** unlocks a detailed Hatch Intelligence Panel below the recommendations showing: specific insects hatching, current life stages, size ranges, peak hatch timing windows during the day, and a full pattern-matching table (insect → fly pattern → hook size → presentation). Same AI call and same prompt — the detailed hatch data is included in the JSON response but only displayed in the UI for Master Angler users.

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
3. Image + structured context sent to Claude Vision API
4. **Chain-of-thought prompting:** Model first reasons about the environment from visual cues (water color, vegetation, terrain, structure, current flow, depth indicators) before making recommendations — this handles cases where user provides minimal input
5. Model returns structured JSON:
   - Array of target zones, each with: zone description, percentage-based coordinates on the image (bounding box or region descriptor), why this zone is productive, how to fish it (positioning, approach, depth), lure/fly suggestions tied to mode
   - Overall summary of the water and strategy
6. Frontend renders the overlay on top of the original image

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
Three tiers: **Free**, **Angler**, and **Master Angler**. All tiers get access to the same core features (Lure/Fly Recommender, Water Reader, Fishing Log, Community Feed, Recommendation History). The primary differentiator is usage volume (actual API cost tracking per user per billing cycle). Master Angler additionally unlocks three exclusive features. Pricing TBD pending real API cost data — the cost allocations below are estimates and subject to change.

| | Free | Angler | Master Angler |
|---|---|---|---|
| AI Usage (Recommender + Water Reader + How's Fishing) | ~$0.05 worth of API calls (taste only) | ~$0.99 worth of API calls/month | ~$2.99 worth of API calls/month |
| How's Fishing Right Now? | No | Yes | Yes |
| Voice-to-Text Logging | No | Yes | Yes |
| Manual Logging | Unlimited | Unlimited | Unlimited |
| Recommendation & Water Reader History | Yes | Yes | Yes |
| Community Feed | View only | Full access (share catches) | Full access (share catches) |
| **Detailed Hatch Intelligence Panel** | No | No | **Master Angler only** |
| **AI Trip Summary Narrative** | No | No | **Master Angler only** |
| **Catch Log Export (CSV/PDF)** | No | No | **Master Angler only** |

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
- Pre-call check: if user would exceed their tier's cost cap, show upgrade prompt
- Approaching-limit warning at ~80% usage
- Feature flags stored on the user profile based on subscription tier — controls UI visibility of the 3 gated features (hatch panel, trip summary, export)
- RevenueCat for iOS subscription management — handles receipt validation, subscription status, renewal events. Connect to Supabase via RevenueCat webhooks to update user tier status in real-time.
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
