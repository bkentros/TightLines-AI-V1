# TightLines AI — Project Overview

**Last updated:** 2026-03-13 (post Engine Refinement Sweeps 1-3)

---

## 1. What Is TightLines AI

A mobile fishing intelligence app (iOS, React Native / Expo) that uses real-time environmental data and a deterministic scoring engine — augmented by Claude LLM narration — to answer the question: **"How's fishing right now?"**

No species-specific folklore. No vibe-based ratings. The engine scores conditions based on fish biology: temperature, pressure, light, solunar timing, tides, wind, and seasonal state.

---

## 2. Tech Stack

| Layer | Tech |
|-------|------|
| Mobile app | React Native (Expo), Expo Router, TypeScript |
| State management | Zustand (auth, env, dev testing stores) |
| Backend | Supabase (PostgreSQL, Edge Functions, Auth) |
| Auth | Supabase Auth with Apple Sign-In (ES256 JWTs) |
| LLM | Anthropic Claude API (claude-sonnet-4-6) |
| Environmental APIs | Open-Meteo (weather, elevation), NOAA CO-OPS (tides), US Naval Observatory (moon/solunar) |
| Payments | RevenueCat (planned, not yet implemented) |
| Build/Deploy | EAS Build (Expo), Supabase CLI for edge function deploys |

---

## 3. Architecture

```
iPhone App (Expo)
  |
  |-- lib/supabase.ts        → invokeEdgeFunction (anon key for gateway, x-user-token for user auth)
  |-- lib/env/                → getEnvironment, fetchFreshEnvironment (calls get-environment edge fn)
  |-- lib/howFishing.ts       → types, cache layer (45-min TTL + in-memory)
  |-- app/how-fishing.tsx     → trigger screen
  |-- app/how-fishing-results.tsx → results display (lake/river tabs, severe weather banner, 4-tier windows)
  |
  v
Supabase Edge Functions
  |
  |-- get-environment/index.ts   → parallel fetch: Open-Meteo + NOAA + USNO → EnvironmentData JSON
  |-- how-fishing/index.ts       → accepts env_data from client body, runs engine + LLM, returns bundle
  |
  |-- _shared/envAdapter.ts      → toEngineSnapshot: maps EnvironmentData → EnvironmentSnapshot
  |-- _shared/coreIntelligence/  → THE ENGINE (see CORE_INTELLIGENCE_SPEC.md)
        |-- types.ts             → all engine types
        |-- derivedVariables.ts  → computes ~30 derived variables from raw env
        |-- scoreEngine.ts       → weighted scoring per water type
        |-- timeWindowEngine.ts  → 30-min block analysis, 4-tier labeling (PRIME/GOOD/FAIR/SLOW)
        |-- behaviorInference.ts → fish behavior state (metabolic, aggression, positioning)
        |-- index.ts             → runCoreIntelligence orchestrator
```

---

## 4. Data Flow (How's Fishing)

1. **Client** fetches GPS coords
2. **Client** calls `get-environment` edge function → gets weather, tides, moon, sun, solunar, elevation
3. **Client** calls `how-fishing` edge function with `env_data` in request body
4. **how-fishing** runs `toEngineSnapshot()` to normalize env data
5. **how-fishing** determines mode:
   - **Coastal:** 3 parallel engine runs (freshwater + saltwater + brackish) → `coastal_multi`
   - **Inland:** 2 parallel engine runs (freshwater_lake + freshwater_river) → `inland_dual`
6. **Engine** (`runCoreIntelligence`) produces: scoring, time windows, behavior inference, alerts
7. **how-fishing** sends engine output to Claude LLM for natural language narration
8. **LLM failure** → deterministic fallback (`generateDeterministicFallback`) — never returns error to user
9. **Client** receives `HowFishingBundle`, caches it, renders results

---

## 5. Auth Pattern (Post-ES256 Migration)

Supabase migrated this project to ES256 user JWTs. The edge function gateway only validates HS256. The workaround:

- `Authorization: Bearer <anon_key>` — HS256, passes the gateway
- `x-user-token: <user_access_token>` — ES256, read by edge function for user auth
- Edge functions call `supabase.auth.getUser(token)` using the `x-user-token` header value
- `how-fishing` no longer calls `get-environment` server-side (gateway rejected internal calls). Client passes `env_data` in the request body.

---

## 6. Subscription Model

| Tier | Price | API Cap |
|------|-------|---------|
| Free | $0 | No AI features — all feature buttons show subscribe prompt |
| Angler | $9.99/mo | $1.00/mo API usage cap |
| Master Angler | $14.99/mo | $3.00/mo API usage cap |

Usage tracked in `usage_tracking` table. Pre-call check in edge functions.

---

## 7. Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| profiles | User profile, home region, fishing mode, subscription tier |
| sessions | Fishing sessions with PostGIS location, conditions |
| catches | Linked to sessions: species, length, weight, lure, photo |
| ai_sessions | LLM call log: session_type, input/response payload, cost |
| usage_tracking | Per-user per-billing-period cost accumulator |

---

## 8. Current Feature Status

| Feature | Status |
|---------|--------|
| Apple Sign-In auth | Working |
| Onboarding flow | Working |
| Live Conditions (dashboard) | Working |
| How's Fishing Right Now? | Working (post-sweep, deployed) |
| Fishing Log | Not yet built |
| AI Recommender | Not yet built |
| Water Reader (photo AI) | Not yet built |
| Hatch Intelligence Panel | Deferred to Phase 2 |

---

## 9. Key Files Reference

### Client
| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client, invokeEdgeFunction, getValidAccessToken |
| `lib/env/index.ts` | getEnvironment, fetchFreshEnvironment with 15-min cache |
| `lib/howFishing.ts` | HowFishingBundle types, 45-min cache layer |
| `app/(tabs)/index.tsx` | Home dashboard, How's Fishing button wiring |
| `app/how-fishing.tsx` | How's Fishing trigger screen |
| `app/how-fishing-results.tsx` | Results display: tabs, badges, severe weather banner |
| `lib/subscription.ts` | getEffectiveTier, usage cap constants |
| `store/authStore.ts` | Zustand auth state (session, access token) |

### Server (Edge Functions)
| File | Purpose |
|------|---------|
| `supabase/functions/get-environment/index.ts` | Weather, tides, moon, solunar, elevation fetch |
| `supabase/functions/how-fishing/index.ts` | Main feature: engine + LLM + fallback |
| `supabase/functions/_shared/envAdapter.ts` | EnvironmentData → EnvironmentSnapshot mapping |
| `supabase/functions/_shared/coreIntelligence/` | The engine (see CORE_INTELLIGENCE_SPEC.md) |

---

## 10. Docs Index

| Doc | Status | Contents |
|-----|--------|----------|
| `PROJECT_OVERVIEW.md` | Current | This file |
| `CORE_INTELLIGENCE_SPEC.md` | Current | Engine architecture post-sweeps |
| `ENGINE_REFINEMENT_SWEEP_1.md` | Completed | Foundation types, derived variables, data fetching changes |
| `ENGINE_REFINEMENT_SWEEP_2.md` | Completed | Scoring cliffs, 4-tier windows, seasonal wiring changes |
| `ENGINE_REFINEMENT_SWEEP_3.md` | Completed | Integration, LLM, UI changes |
| `SONNET_PROMPTS.md` | Completed | Implementation prompts used for sweeps |
| `FOUNDATION_IMPLEMENTATION_PLAN.md` | Completed (historical) | Original foundation layer plan |
| `HOWS_FISHING_IMPLEMENTATION_PLAN.md` | Completed (historical) | Original How's Fishing plan |
| `ENV_API_IMPLEMENTATION_PLAN.md` | Completed (historical) | Original env API plan |
| `ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md` | Completed (historical) | Edge-case rules plan (Rules 1-8 implemented) |
| `DEBUG_AUDIT_HOWS_FISHING.md` | Completed (historical) | Pre-sweep debug audit |
