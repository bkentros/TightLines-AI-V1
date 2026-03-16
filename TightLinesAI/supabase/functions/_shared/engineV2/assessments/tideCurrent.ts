// =============================================================================
// ENGINE V2 — Tide / Current Assessment
//
// Highest-weight assessment for brackish and saltwater environments.
// For freshwater: river flow is considered lightly; lake is not applicable.
// Non-species-specific.
//
// Logic summary (salt/brackish):
// - Active, meaningful water movement is the primary driver of fish activity
//   in tidal/coastal environments
// - Moving tide (incoming or outgoing, not slack) is broadly supportive
// - Dead slack (high or low stand) is the weakest period
// - Extreme flow can still be somewhat disruptive but never as bad as dead slack
// - The assessment derives tide stage from today's tide predictions (H/L times)
//   and scores the current state by computing how far we are from each high/low
//
// Logic summary (freshwater_river):
// - High/elevated flow from runoff = somewhat suppressive
// - Normal stable flow = neutral to positive
// - Flow data is inferred indirectly (no direct measurement); modest claim guard
//
// Logic summary (freshwater_lake):
// - Not applicable; returns neutral score with applicable: false
//
// Data used:
// - tidePredictionsToday (H/L tide events with times)
// - measuredWaterTempF difference proxy for tide direction
// - current time vs tide event times
// - precip context for river flow inference
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

type TideStage =
  | 'peak_incoming'     // 1–2hr before high
  | 'incoming'          // between low and high, in first half
  | 'post_high_outgoing' // just past high, outgoing
  | 'outgoing'          // between high and low, moving well
  | 'approaching_low'   // 1–2hr before low
  | 'dead_slack_high'   // within 30min of high
  | 'dead_slack_low'    // within 30min of low
  | 'unknown';

// ---------------------------------------------------------------------------
// Determine minutes since midnight for a "HH:MM" time string
// ---------------------------------------------------------------------------

function parseTimeMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

// ---------------------------------------------------------------------------
// Classify tide stage relative to today's H/L predictions and current time
// ---------------------------------------------------------------------------

function classifyTideStage(
  env: NormalizedEnvironmentV2,
  tzOffset: number
): TideStage {
  const preds = env.marine.tidePredictionsToday;
  if (!preds || preds.length < 2) return 'unknown';

  // Get current local time
  const nowUtc = new Date();
  const nowLocalMinutes = ((nowUtc.getUTCHours() * 60 + nowUtc.getUTCMinutes() + tzOffset * 60) % 1440 + 1440) % 1440;

  // Parse all tide events into sorted list
  type TideEvent = { minutesSinceMidnight: number; type: 'H' | 'L'; heightFt: number };
  const events: TideEvent[] = [];
  for (const p of preds) {
    const minutes = parseTimeMinutes(p.timeLocal);
    if (minutes != null) {
      events.push({ minutesSinceMidnight: minutes, type: p.type, heightFt: p.heightFt });
    }
  }
  events.sort((a, b) => a.minutesSinceMidnight - b.minutesSinceMidnight);
  if (events.length < 2) return 'unknown';

  // Find bracketing events: the one just before and just after now
  let prevEvent: TideEvent | null = null;
  let nextEvent: TideEvent | null = null;
  for (const evt of events) {
    if (evt.minutesSinceMidnight <= nowLocalMinutes) {
      prevEvent = evt;
    } else if (nextEvent == null) {
      nextEvent = evt;
    }
  }

  // If no prev, we're before first event — treat as "before first tide event"
  if (prevEvent == null && nextEvent != null) {
    prevEvent = events[events.length - 1]; // wrap around midnight (yesterday's last)
  }
  if (prevEvent == null || nextEvent == null) return 'unknown';

  const minsSincePrev = (nowLocalMinutes - prevEvent.minutesSinceMidnight + 1440) % 1440;
  const minsToNext = (nextEvent.minutesSinceMidnight - nowLocalMinutes + 1440) % 1440;

  // Classify based on position in the cycle
  if (prevEvent.type === 'H') {
    // Outgoing tide phase
    if (minsSincePrev <= 30) return 'dead_slack_high';
    if (minsToNext <= 90) return 'approaching_low';
    return 'outgoing';
  } else {
    // Incoming tide phase
    if (minsSincePrev <= 30) return 'dead_slack_low';
    if (minsToNext <= 90) return 'peak_incoming';
    return 'incoming';
  }
}

// ---------------------------------------------------------------------------
// Score by tide stage
// ---------------------------------------------------------------------------

function tideStageToScore(
  stage: TideStage,
  ctx: ResolvedContext
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {
  switch (stage) {
    case 'peak_incoming':
      return {
        score: 85,
        stateLabel: 'peak_incoming_tide',
        tags: ['peak_incoming_tide', 'strong_water_movement', 'high_activity_potential'],
        direction: 'positive',
      };

    case 'incoming':
      return {
        score: 76,
        stateLabel: 'incoming_tide',
        tags: ['incoming_tide', 'good_water_movement', 'favorable_conditions'],
        direction: 'positive',
      };

    case 'post_high_outgoing':
      return {
        score: 72,
        stateLabel: 'early_outgoing_tide',
        tags: ['outgoing_tide_starting', 'movement_re_establishing', 'improving_conditions'],
        direction: 'positive',
      };

    case 'outgoing':
      return {
        score: 74,
        stateLabel: 'outgoing_tide',
        tags: ['outgoing_tide', 'good_water_movement', 'favorable_conditions'],
        direction: 'positive',
      };

    case 'approaching_low':
      return {
        score: 64,
        stateLabel: 'approaching_low_tide',
        tags: ['approaching_low', 'movement_slowing', 'fishing_quality_declining'],
        direction: 'neutral',
      };

    case 'dead_slack_high':
      return {
        score: 28,
        stateLabel: 'dead_slack_high_water',
        tags: ['slack_water', 'minimal_movement', 'low_activity_period'],
        direction: 'negative',
      };

    case 'dead_slack_low':
      return {
        score: 30,
        stateLabel: 'dead_slack_low_water',
        tags: ['slack_water', 'minimal_movement', 'low_activity_period'],
        direction: 'negative',
      };

    case 'unknown':
    default:
      return {
        score: 52,
        stateLabel: 'tide_stage_unknown',
        tags: ['tide_data_limited'],
        direction: 'neutral',
      };
  }
}

// ---------------------------------------------------------------------------
// River current assessment — uses inferred flow state
// ---------------------------------------------------------------------------

function assessRiverCurrent(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): SingleAssessment {
  const precip48 = env.histories.precip48hrInches ?? 0;
  const precip7day = env.histories.precip7dayInches ?? 0;

  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  if (precip48 > 2.0 || precip7day > 5.0) {
    score = 30;
    stateLabel = 'elevated_flow_likely';
    tags = ['elevated_river_flow', 'inferred_from_rain_history', 'conditions_less_stable'];
    direction = 'negative';
  } else if (precip48 > 0.75) {
    score = 48;
    stateLabel = 'mildly_elevated_flow';
    tags = ['flow_may_be_slightly_elevated', 'conditions_mixed'];
    direction = 'neutral';
  } else {
    score = 62;
    stateLabel = 'normal_river_flow_inferred';
    tags = ['stable_river_flow_inferred', 'normal_conditions_likely'];
    direction = 'neutral';
  }

  return {
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    dominantTags: tags,
    direction,
    // River flow is always inferred (no direct stream gauge) — claim guard
    confidenceDependency: 'low',
    applicable: true,
  };
}

// ---------------------------------------------------------------------------
// Main tide/current assessment
// ---------------------------------------------------------------------------

export function assessTideCurrent(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): SingleAssessment {
  const mode = ctx.environmentMode;

  // Lake — not applicable
  if (mode === 'freshwater_lake') {
    return {
      componentScore: 55, // neutral pass-through
      stateLabel: 'tide_not_applicable_lake',
      dominantTags: ['tide_current_not_applicable_freshwater_lake'],
      direction: 'neutral',
      confidenceDependency: 'low',
      applicable: false,
    };
  }

  // River — inferred flow only
  if (mode === 'freshwater_river') {
    return assessRiverCurrent(env, ctx);
  }

  // Brackish / Saltwater — real tide logic
  const tzOffset = env.location.tzOffsetHours ?? 0;

  const stage = classifyTideStage(env, tzOffset);
  const { score, stateLabel, tags, direction } = tideStageToScore(stage, ctx);

  const hasGoodData = env.marine.tidePredictionsToday != null && env.marine.tidePredictionsToday.length >= 2;

  return {
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    dominantTags: tags,
    direction,
    confidenceDependency: hasGoodData ? 'high' : 'very_low',
    applicable: true,
  };
}
