# How's Fishing Right Now? — Implementation Plan

**Status:** Ready to implement  
**Spec reference:** `TightLines_AI_V1_Spec.md` Section 2 (lines 128–172)  
**Scope:** Feature build + spec updates + foundation fixes + debug audit

---

## 1. Executive Summary

Build the "How's Fishing Right Now?" feature — a weather-based AI fishing analysis accessible from the Home Dashboard. Includes: spec updates (paid-only model, usage caps, Hatch deferred), Live Conditions timeout fix, location permission buttons, subscription tier override for dev, subscribe prompt, usage cap logic, and the full How's Fishing flow. Ends with a debug audit and brief summary of all work done.

---

## 2. Spec Updates (`TightLines_AI_V1_Spec.md`)

Apply these changes before or during implementation:

| Location | Change |
|----------|--------|
| **Context Overview (line ~22)** | Change from freemium to **paid-only**: "Zero free usage. All AI features require an active subscription ($9.99 Angler / $14.99 Master Angler). Every feature button prompts unsubscribed users to sign up." Remove "$0.05 taste" language. |
| **Section 2 – How's Fishing (130–134)** | Tier gating: **Subscribers only** (Angler or Master Angler). Location: **GPS only** — no manual entry. If not synced, prompt user to sync location with explicit buttons. Remove "manually entered location" for this feature. |
| **Section 2 – Implementation notes** | Add: "Location is GPS-only. Manual location entry not supported for How's Fishing." |
| **Section 3 – Recommender** | Add note: **Hatch Intelligence Panel deferred to Phase 2.** Complex feature; not required for V1 launch. Fly mode still returns pattern recommendations; detailed hatch panel (Master Angler) ships in V2. |
| **Section 7 – Monetization** | Replace tier table. New model: |
| | **Angler ($9.99/mo):** Core features, $1.00 API usage cap/month |
| | **Master Angler ($14.99/mo):** Core features + AI Trip Summary, Catch Log Export; $3.00 API usage cap/month |
| | No free tier. All feature buttons show subscribe prompt if no active subscription. |
| **Section 7** | Add: Hatch Intelligence Panel deferred to Phase 2. |
| **Section 7 – Implementation** | Document cost-based usage caps: pre-call check against `usage_tracking.total_cost_usd`; cap at $1 (Angler) / $3 (Master Angler) per billing period. |

---

## 3. Foundation Fixes (Prerequisites)

### 3.1 Live Conditions Timeout Fix

**Problem:** Env fetch times out repeatedly after app backgrounded; retries also fail. Edge Function completes in 0.7–3s server-side — likely client-side connection/network issue.

**Changes:**
1. **`lib/env/constants.ts`** — Increase `ENV_FETCH_TIMEOUT_MS` from 30s to 55s.
2. **`lib/env/index.ts`** — Add retry logic: on timeout or network error, retry once after 2s before surfacing error.
3. **`lib/env/index.ts`** — Add optional debug logging when `__DEV__`: log request start, timeout vs error, retry attempt.
4. **Edge Function (optional):** Consider per-API fetch timeout (e.g. 15s each) so one slow external API doesn’t block. Defer if not critical for V1.

### 3.2 Location Sync / Permission Buttons

**Problem:** Live Conditions shows "Sync location to see weather..." but no button to grant permission or refresh.

**Changes:**
1. **`LiveConditionsWidget.tsx`** — When `!hasCoords`:
   - If permission denied/undetermined: show "Enable location" button that calls `Location.requestForegroundPermissionsAsync()` and, if granted, triggers parent to refresh coords (or re-render so Home fetches GPS again).
   - If permission granted but no coords (e.g. still loading): show "Sync location" button that triggers `getCurrentPositionAsync` and passes result up (via callback prop).
2. **`app/(tabs)/index.tsx`** — Pass `onRequestLocation` or `onSyncLocation` callback to LiveConditionsWidget that:
   - Requests permission if needed.
   - Calls `getCurrentPositionAsync` and updates `gpsCoords`.
3. Ensure "Sync location" / "Enable location" flows work and allow How's Fishing button to function once coords are available.

---

## 4. Dev Settings — Subscription Tier Override

**`store/devTestingStore.ts`** (or create if minimal):
- Add `overrideSubscriptionTier: 'free' | 'angler' | 'master_angler' | null`.
- `null` = use real profile tier; otherwise override for dev.
- Persist in AsyncStorage key like `dev_override_tier`.

**`app/(tabs)/settings.tsx`** — In `__DEV__` Testing section:
- Add "Override subscription tier" control: Free / Angler / Master Angler (and "Use real").
- Wire to devTestingStore.

**Tier check helper** — `lib/subscription.ts` or similar:
- `getEffectiveTier(profile, devOverride): 'free' | 'angler' | 'master_angler'`
- In dev: use override when set; otherwise profile.
- In prod: always use profile.

---

## 5. Subscribe Prompt Component

**`components/SubscribePrompt.tsx`**
- Modal or bottom sheet shown when user taps a feature button and has no subscription (`effectiveTier === 'free'`).
- Message: "Subscribe to use this feature." Generic CTA: "View plans" (or "Subscribe") that navigates to `/subscribe` or a placeholder plans screen.
- Dismissible (close button).
- Reusable for How's Fishing, Recommender, Water Reader, etc.

---

## 6. Usage Caps

### 6.1 Constants
- `lib/subscription.ts` or `lib/constants.ts`:
  - `USAGE_CAP_ANGLER_USD = 1`
  - `USAGE_CAP_MASTER_ANGLER_USD = 3`

### 6.2 Pre-call Check (Edge Functions)
- Before Claude/Whisper call: fetch `usage_tracking` for user + billing period.
- If `total_cost_usd + estimated_cost > cap`, return `429` or error JSON: `{ error: 'usage_cap_exceeded', message: '...' }`.
- Implement in `how-fishing` Edge Function first; pattern for Recommender/Water Reader later.

### 6.3 Client
- When Edge Function returns usage_cap_exceeded: show upgrade/limit message with "View plans" CTA.
- Optional: pre-call check (fetch usage from API or RPC) to avoid unnecessary requests. Defer if simpler to just handle 429 for V1.

---

## 7. How's Fishing Feature

### 7.1 Edge Function: `how-fishing`

**Path:** `supabase/functions/how-fishing/index.ts`

**Flow:**
1. Parse POST body: `{ latitude, longitude, units?, environment? }`.
2. Auth: require JWT; extract `user_id`.
3. Tier check: if `effectiveTier === 'free'`, return 403.
4. Usage cap check: if over cap for billing period, return 429.
5. Env data: use `environment` if provided and recent; else call `get-environment` internally (or invoke same logic).
6. Claude API: construct fishing-weather prompt; single call; structured JSON output.
7. Persist: `ai_sessions` (session_type: `fishing_now`), `usage_tracking` (add cost).
8. Return JSON: `{ rating, summary, best_times, worst_times, key_factors, tips }`.

**Prompt:** System + user prompt with env data; no spot/species details. Structured JSON schema for output.

### 7.2 Response Types

**`lib/howFishing.ts`** or in `lib/types.ts`:
```ts
interface HowFishingResponse {
  rating: string;
  summary: string;
  best_times: Array<{ window: string; label: string; reasoning: string }>;
  worst_times: Array<{ window: string; reasoning: string }>;
  key_factors: { [key: string]: string };
  tips: string[];
}
```

### 7.3 Results Screen

**`app/how-fishing-results.tsx`**
- Full-screen results view.
- Sections: Overall Rating, Best Times, Worst Times, Key Factors, Tips.
- "Try Again" / "Back" actions.
- Receives data via route params or Zustand; no re-fetch.

### 7.4 Client-Side Result Cache (30 min)

**`lib/howFishingCache.ts`** (or extend env cache pattern):
- AsyncStorage key: `how_fishing_cache` — store `{ latitude, longitude, data, fetched_at }`.
- TTL: 30 minutes.
- Before calling Edge Function: check cache for same coords; if fresh, navigate to results with cached data.
- On success: write to cache.

### 7.5 Home Dashboard Button Wiring

**`app/(tabs)/index.tsx`**
- "How's Fishing Right Now?" button `onPress`:
  1. Resolve `effectiveTier` (profile + dev override).
  2. If `effectiveTier === 'free'` → show `SubscribePrompt`.
  3. If no coords → show "Sync location" prompt (reuse Live Conditions messaging or inline).
  4. Check cache (30 min): if hit, navigate to results.
  5. Else: call `fetchFreshEnvironment`, then invoke `how-fishing` with coords + env.
  6. On success: cache, navigate to results.
  7. On usage_cap_exceeded: show upgrade message.
  8. On other error: show error + "Try Again".

---

## 8. Implementation Order

| # | Task | Est. |
|---|------|------|
| 1 | Spec updates (Section 2) | 15 min |
| 2 | Live Conditions timeout fix (timeout + retry) | 20 min |
| 3 | Location sync/permission buttons in LiveConditionsWidget + Home | 30 min |
| 4 | Dev subscription tier override (store + Settings UI) | 25 min |
| 5 | Subscribe prompt component | 20 min |
| 6 | Usage cap constants + pre-call check in how-fishing Edge Function | 30 min |
| 7 | `how-fishing` Edge Function (prompt, Claude, cost tracking) | 60 min |
| 8 | How's Fishing response types + cache (30 min) | 25 min |
| 9 | `app/how-fishing-results.tsx` | 40 min |
| 10 | Home button wiring (tier, location, cache, API, navigation) | 45 min |
| 11 | Spec updates (Monetization, Hatch deferral) | 15 min |
| 12 | Debug audit (see Section 9) | 30 min |
| 13 | Summary document (see Section 10) | 10 min |

**Total:** ~4.5–5 hours

---

## 9. Debug Audit (Post-Implementation)

After all implementation, perform a critical audit. Check:

### 9.1 Live Conditions
- [ ] Fetch succeeds after app backgrounded 5+ minutes.
- [ ] Retry works when first request times out.
- [ ] "Enable location" / "Sync location" appears when no coords.
- [ ] Button grants permission or refreshes coords; widget then loads.
- [ ] No infinite loops or duplicate fetches on focus.

### 9.2 Tier Gating
- [ ] Dev override: Free → SubscribePrompt; Angler → feature works.
- [ ] Real profile tier respected when override is "Use real".
- [ ] SubscribePrompt dismisses and does not block when subscribed.

### 9.3 Location
- [ ] How's Fishing requires coords; shows sync prompt when none.
- [ ] No manual location entry path for How's Fishing.
- [ ] After sync, button proceeds to analysis.

### 9.4 How's Fishing Flow
- [ ] Cache: repeat tap within 30 min uses cache, no new API call.
- [ ] Cache: after 30 min, new API call.
- [ ] Results screen renders all 5 sections.
- [ ] Error handling: network/timeout shows "Try Again".
- [ ] Usage cap: over cap returns clear message and upgrade CTA.

### 9.5 Edge Function
- [ ] Request reaches function; auth passes.
- [ ] Env data flows (client-supplied or fetched).
- [ ] Claude returns valid JSON; schema matches.
- [ ] Cost logged to usage_tracking.
- [ ] ai_sessions record created with session_type `fishing_now`.

### 9.6 Edge Cases
- [ ] Offline: graceful message, no crash.
- [ ] Malformed Claude response: retry once, then report-level error state only. No fabricated or mock fallback.
- [ ] Rapid taps: no double submissions.
- [ ] Navigation: back from results returns to Home; no stale state.

---

## 10. Summary (To Deliver at End)

After implementation, provide a brief summary covering:

- **Spec updates:** Paid-only model, $9.99/$14.99, usage caps, Hatch deferred, GPS-only for How's Fishing.
- **Live Conditions:** Timeout increased, retry added, location permission/sync buttons.
- **Dev tools:** Subscription tier override in Settings.
- **Subscribe prompt:** Reusable component for feature gates.
- **Usage caps:** $1 (Angler) / $3 (Master Angler) per month; pre-call check in Edge Function.
- **How's Fishing:** Edge Function, results screen, 30-min cache, full flow from Home button.
- **Debug audit:** All checklist items verified.

---

## 11. Files to Create/Modify

| Action | Path |
|--------|------|
| Edit | `TightLines_AI_V1_Spec.md` |
| Edit | `lib/env/constants.ts` |
| Edit | `lib/env/index.ts` |
| Edit | `components/LiveConditionsWidget.tsx` |
| Edit | `app/(tabs)/index.tsx` |
| Edit | `store/devTestingStore.ts` |
| Edit | `app/(tabs)/settings.tsx` |
| Create | `lib/subscription.ts` |
| Create | `components/SubscribePrompt.tsx` |
| Create | `supabase/functions/how-fishing/index.ts` |
| Create | `lib/howFishing.ts` (types + cache) |
| Create | `app/how-fishing-results.tsx` |

---

*Plan complete. Proceed with implementation in the order above.*
