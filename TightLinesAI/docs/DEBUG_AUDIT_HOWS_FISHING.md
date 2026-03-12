# Debug Audit — How's Fishing Right Now?

**Date:** Post-implementation  
**Scope:** Live Conditions timeout, location sync, tier gating, How's Fishing flow, Edge Function

---

## Checklist

### 9.1 Live Conditions
| Item | Status | Notes |
|------|--------|-------|
| Fetch succeeds after app backgrounded 5+ min | ⏳ Manual test | Timeout 55s + retry should help |
| Retry works when first request times out | ✅ Implemented | `invokeWithRetry` in lib/env |
| Enable location button when no coords | ✅ Implemented | `onRequestLocation` prop, "Enable location" button |
| Button grants permission / refreshes coords | ✅ Implemented | `handleRequestLocation` in Home |
| No infinite loops / duplicate fetches | ✅ | useFocusEffect + cache TTL; single loadEnv per focus |

### 9.2 Tier Gating
| Item | Status | Notes |
|------|--------|-------|
| Dev override: Free → SubscribePrompt | ✅ | `getEffectiveTier` uses override when set |
| Dev override: Angler → feature works | ✅ | Settings Testing section |
| SubscribePrompt dismisses when subscribed | ✅ | `onDismiss` clears state |
| Real profile tier when override "Use real" | ✅ | overrideSubscriptionTier null |

### 9.3 Location
| Item | Status | Notes |
|------|--------|-------|
| How's Fishing requires coords | ✅ | Alert if !coords |
| Sync prompt when none | ✅ | "Sync location" Alert |
| No manual location entry for How's Fishing | ✅ | Spec compliance |
| After sync, button proceeds | ✅ | coords from GPS or dev override |

### 9.4 How's Fishing Flow
| Item | Status | Notes |
|------|--------|-------|
| 30-min cache hit avoids API call | ✅ | `getCachedHowFishing` checked first |
| Cache miss after 30 min triggers new call | ✅ | TTL in lib/howFishing.ts |
| Results screen renders 5 sections | ✅ | Rating, best/worst times, key factors, tips |
| Error + "Try Again" | ✅ | Alert on error; user can tap again |
| Usage cap message + upgrade CTA | ✅ | Alert + SubscribePrompt for usage_cap_exceeded |

### 9.5 Edge Function
| Item | Status | Notes |
|------|--------|-------|
| Request reaches function; auth passes | ✅ | JWT verified via getUser |
| Env data (client or fetched) | ✅ | body.environment or fetch get-environment |
| Claude returns valid JSON | ✅ | try/catch with fallback analysis |
| Cost logged to usage_tracking | ✅ | Insert/update after Claude call |
| ai_sessions with session_type fishing_now | ✅ | Insert before return |

### 9.6 Edge Cases
| Item | Status | Notes |
|------|--------|-------|
| Offline: graceful message | ✅ | Alert on fetch failure |
| Malformed Claude response | ✅ | Fallback to raw text slice |
| Rapid taps: no double submissions | ✅ | Button disabled when howFishingLoading |
| Back from results: no stale state | ✅ | Route params; no global state |

---

## Potential Improvements (Not Blocking)

1. **usage_tracking race:** Two concurrent requests could both insert. Consider upsert (ON CONFLICT) for robustness.
2. **Result payload size:** Passing full JSON in route params may hit URL length limits on very long responses. Consider Zustand store if needed.
3. **Claude model:** `claude-sonnet-4-6-20250514` — verify this is the correct model ID for your Anthropic account.

---

## Manual QA Recommended

- [ ] Background app 5+ min, return, confirm Live Conditions loads (or retries successfully)
- [ ] Settings → Override tier to Free → tap How's Fishing → confirm SubscribePrompt
- [ ] Settings → Override tier to Angler → tap How's Fishing with coords → confirm results
- [ ] Trigger usage cap (run many requests) → confirm 429 and upgrade message
- [ ] Tap How's Fishing twice within 30 min → second tap should use cache (no new network call)
