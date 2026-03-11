# Foundation Layer — Implementation Plan (Lines 80–124)

**Spec reference:** `TightLines_AI_V1_Spec.md` lines 80–124  
**Scope:** Shared LLM Pipeline, Offline Strategy, Database Schema verification, Key Tech Decisions  
**Does NOT include:** How's Fishing Right Now? (that's Section 2, next)

---

## 1. Database Schema — VERIFIED ✅

Your Supabase project **already has** the core tables. No new migrations needed for Foundation.

| Table | Status | Notes |
|-------|--------|-------|
| **profiles** | ✅ Exists | id, username, display_name, home_region, home_state, home_city, fishing_mode, preferred_units, target_species, subscription_tier, onboarding_complete, avatar_url |
| **sessions** | ✅ Exists | Fishing sessions with date, location (PostGIS geography), conditions, ai_session_id, shared_to_feed, voice_transcript |
| **catches** | ✅ Exists | Linked to sessions; species, length, weight, lure info, photo_url |
| **ai_sessions** | ✅ Exists | session_type (recommendation, water_reader, fishing_now), input_payload, response_payload, token_cost_usd |
| **usage_tracking** | ✅ Exists | user_id, billing_period, total_cost_usd, call_count |

**Per-feature caps:** For per-feature usage caps (e.g. "5 recommender calls/month for free tier"), query `ai_sessions` grouped by `session_type`. No schema change needed. Optional: add per-feature columns to `usage_tracking` later for faster cap checks.

**PostGIS:** Installed. `sessions.location` uses geography type for geospatial queries.

---

## 2. Shared LLM Pipeline — To Build

Framework that all AI features (How's Fishing, Recommender, Water Reader) will use.

### 2.1 Edge Function Template / Shared Logic

- **Auth:** Verify JWT, extract `user_id`
- **Env enrichment:** Accept env data from client OR call `get-environment` internally when missing
- **Claude client:** Single Claude API call with `claude-sonnet-4-6` (from screenshot)
- **Structured output:** Use Claude's JSON schema mode for reliable parsing
- **Idempotency:** For paid ops, accept `idempotency_key` (UUID); check `ai_sessions` for existing record before charging
- **Logging:** Insert `ai_sessions` row; upsert `usage_tracking` (increment call_count, add token_cost_usd)
- **Error handling:** Retry once on timeout/5xx/rate limit; validate response schema; fall back to partial results when possible

### 2.2 Implementation Steps

1. Create shared Edge Function utilities: `lib/claude.ts` (or inline in each function), auth helper, usage logging
2. Implement `logAiUsage(userId, sessionType, costUsd, idempotencyKey?)` — insert ai_sessions, upsert usage_tracking
3. Implement `callClaudeWithRetry(prompt, schema)` — single call, retry once on failure
4. Each new feature = new Edge Function that imports shared logic and defines its own prompt + schema

### 2.3 Tech Confirmations

- **Claude API ID:** `claude-sonnet-4-6` (per screenshot)
- **Whisper:** `whisper-1`; OpenAI key in Edge Function secrets ✅
- **RevenueCat:** Defer to Monetization step; not needed for Foundation

---

## 3. Offline Strategy — Plan

### 3.1 Already Done
- **Environmental data:** 15-min cache via AsyncStorage (lib/env/cache.ts)

### 3.2 To Build (with Fishing Log)
- **Voice logs:** Record locally, queue for processing when online
- **Manual logs:** Save to local DB, sync on reconnect
- **Draft status:** Show "draft" in Log UI until synced
- **Storage choice:** expo-sqlite for structured log entries (or WatermelonDB if you prefer sync primitives)

### 3.3 AI Features
- Require connectivity; show "You're offline" + "Try again when connected" if no network
- No queuing of AI requests in V1 (per spec: "queue inputs for later" is optional / future)

**Recommendation:** Tackle offline log sync when building the Fishing Log feature. Foundation can document the plan; implementation happens with Log.

---

## 4. What to Build Now (Foundation Completion)

| Task | Priority | Notes |
|------|----------|-------|
| Shared LLM Edge Function boilerplate | High | Auth, Claude call, usage logging, error handling |
| Idempotency helper | Medium | Check ai_sessions by idempotency_key before charging |
| Offline plan doc | Low | Already above; no code yet |
| Analytics integration | Low | Mixpanel/Amplitude/PostHog — can add with first AI feature |

---

## 5. Scope Clarification

**Foundation (80–124):** Framework and patterns. Does *not* include the How's Fishing UI or prompt.

**Section 2 — How's Fishing Right Now?:** First concrete AI feature. Uses the Shared LLM Pipeline you build in Foundation. It will:
- Add `hows-fishing` Edge Function
- Use env data + weather-only prompt
- Implement tier gating (Angler+)
- Wire the Home button to the flow

**Order:**
1. Complete Foundation: Shared LLM boilerplate + usage logging
2. Then: How's Fishing (first feature using that boilerplate)

---

## 6. Follow-up Questions

1. **Anthropic API key:** Is `ANTHROPIC_API_KEY` already in your Edge Function secrets? (You have `OPENAI_API_KEY` for Whisper.)
2. **usage_tracking.billing_period format:** Suggest `YYYY-MM` (e.g. `2026-03`). Confirm?
3. **Offline:** Do you want a minimal expo-sqlite schema drafted now for future Log sync, or wait until the Log feature?
4. **Analytics:** Any preference among Mixpanel, Amplitude, PostHog? Or defer until after first AI feature?
