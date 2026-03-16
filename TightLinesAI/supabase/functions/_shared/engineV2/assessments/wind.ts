// =============================================================================
// ENGINE V2 — Wind Assessment
//
// Evaluates wind speed and direction effects on fishing conditions.
// Non-species-specific — operates on broad fishability and fish behavior.
//
// Key differences by environment mode:
// - freshwater_lake: wind creates surface chop, helps/hurts depending on intensity
//   Light wind = good (cover, less spooky fish, O2 mixing)
//   Moderate = neutral to slightly helpful
//   Heavy = degrades casting, presentation, boat control
// - freshwater_river: wind matters less (current dominates)
//   River fishing is more about current seams and presentation
//   Still penalizes extreme wind for angler safety/control
// - saltwater / brackish: wind stirs bait, affects tidal push and water clarity
//   Moderate wind can be excellent (water movement, cloudy water, bait ball activity)
//   Extreme wind = safety and fishability concern
//   Dead calm in salt can mean clear water, spooky fish, low activity
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

// ---------------------------------------------------------------------------
// Wind speed response curves by environment mode (mph)
// ---------------------------------------------------------------------------

interface WindResponse {
  /** Below this = very calm — mode-specific response (lake: neutral/slight negative; salt: negative) */
  deadCalmCeiling: number;
  /** Light wind — generally positive */
  lightWindCeiling: number;
  /** Moderate — neutral to helpful depending on mode */
  moderateCeiling: number;
  /** Heavy — begins degrading fishability */
  heavyCeiling: number;
  /** Above this = significant suppression (safety, presentation breakdown) */
  strongThreshold: number;
}

const WIND_RESPONSE: Record<string, WindResponse> = {
  freshwater_lake: {
    deadCalmCeiling: 3,
    lightWindCeiling: 10,
    moderateCeiling: 18,
    heavyCeiling: 25,
    strongThreshold: 30,
  },
  freshwater_river: {
    deadCalmCeiling: 5,   // river doesn't depend on wind much — calm is fine
    lightWindCeiling: 12,
    moderateCeiling: 20,
    heavyCeiling: 28,
    strongThreshold: 35,  // river anglers can manage more wind (trees, etc.)
  },
  brackish: {
    deadCalmCeiling: 4,
    lightWindCeiling: 12,
    moderateCeiling: 20,
    heavyCeiling: 27,
    strongThreshold: 32,
  },
  saltwater: {
    deadCalmCeiling: 4,
    lightWindCeiling: 12,
    moderateCeiling: 18,
    heavyCeiling: 25,
    strongThreshold: 30,
  },
};

function getWindResponse(ctx: ResolvedContext): WindResponse {
  return WIND_RESPONSE[ctx.environmentMode] ?? WIND_RESPONSE.freshwater_lake;
}

// ---------------------------------------------------------------------------
// Wind score by environment mode
// ---------------------------------------------------------------------------

function windSpeedToScore(
  speedMph: number,
  response: WindResponse,
  ctx: ResolvedContext
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {

  const isSaltOrBrackish = ctx.isCoastal;
  const isRiver = ctx.environmentMode === 'freshwater_river';
  const isLake = ctx.environmentMode === 'freshwater_lake';

  // Dead calm
  if (speedMph <= response.deadCalmCeiling) {
    if (isSaltOrBrackish) {
      // Dead calm salt/brackish = glass flat, clear water, spooky fish, low bait activity
      return {
        score: 48,
        stateLabel: 'dead_calm_coastal',
        tags: ['glass_calm_coastal', 'reduced_water_movement', 'fish_may_be_spooky'],
        direction: 'neutral',
      };
    }
    if (isLake) {
      // Glassy lake — some like it, spooky fish in clear water
      return {
        score: 55,
        stateLabel: 'calm_lake',
        tags: ['calm_surface', 'glass_off_conditions'],
        direction: 'neutral',
      };
    }
    // River: calm is fine (not wind-dependent)
    return {
      score: 62,
      stateLabel: 'calm_river',
      tags: ['calm_conditions', 'current_is_primary_factor'],
      direction: 'neutral',
    };
  }

  // Light wind
  if (speedMph <= response.lightWindCeiling) {
    if (isSaltOrBrackish) {
      return {
        score: 72,
        stateLabel: 'light_favorable_wind',
        tags: ['light_wind', 'surface_movement', 'bait_activity_supported'],
        direction: 'positive',
      };
    }
    if (isRiver) {
      return {
        score: 65,
        stateLabel: 'light_wind_river',
        tags: ['light_wind', 'manageable_presentation'],
        direction: 'neutral',
      };
    }
    // Lake: light chop = good
    return {
      score: 75,
      stateLabel: 'light_favorable_wind',
      tags: ['light_chop', 'surface_disturbance_helps', 'fish_less_spooky'],
      direction: 'positive',
    };
  }

  // Moderate wind
  if (speedMph <= response.moderateCeiling) {
    if (isSaltOrBrackish) {
      // Moderate coastal wind can be excellent — moving water, active fish
      return {
        score: 72,
        stateLabel: 'moderate_wind_coastal',
        tags: ['moderate_wind', 'water_movement', 'favorable_tidal_push'],
        direction: 'positive',
      };
    }
    if (isRiver) {
      return {
        score: 58,
        stateLabel: 'moderate_wind_river',
        tags: ['moderate_wind', 'presentation_manageable'],
        direction: 'neutral',
      };
    }
    // Lake moderate — starts affecting casting and boat control
    return {
      score: 62,
      stateLabel: 'moderate_wind_lake',
      tags: ['moderate_chop', 'some_casting_challenge'],
      direction: 'neutral',
    };
  }

  // Heavy wind
  if (speedMph <= response.heavyCeiling) {
    if (isSaltOrBrackish) {
      return {
        score: 45,
        stateLabel: 'heavy_wind_coastal',
        tags: ['heavy_wind', 'rough_water', 'presentation_difficult'],
        direction: 'neutral',
      };
    }
    if (isRiver) {
      return {
        score: 48,
        stateLabel: 'heavy_wind_river',
        tags: ['heavy_wind', 'some_presentation_challenge'],
        direction: 'neutral',
      };
    }
    return {
      score: 40,
      stateLabel: 'heavy_wind_lake',
      tags: ['heavy_wind', 'rough_water', 'difficult_conditions'],
      direction: 'negative',
    };
  }

  // Strong / dangerous wind
  const overshoot = Math.max(0, speedMph - response.strongThreshold);
  const severeScore = Math.max(5, 28 - overshoot * 2);
  return {
    score: severeScore,
    stateLabel: 'strong_wind_suppression',
    tags: ['dangerous_wind', 'fishing_significantly_impaired', 'safety_consideration'],
    direction: 'negative',
  };
}

// ---------------------------------------------------------------------------
// Main wind assessment function
// ---------------------------------------------------------------------------

export function assessWind(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): SingleAssessment {
  const speedMph = env.current.windSpeedMph;

  if (speedMph == null) {
    return {
      componentScore: 52, // slight neutral pass-through — assume manageable if unknown
      stateLabel: 'wind_data_unavailable',
      dominantTags: ['wind_speed_unknown'],
      direction: 'neutral',
      confidenceDependency: 'very_low',
      applicable: true,
    };
  }

  const response = getWindResponse(ctx);
  const { score, stateLabel, tags, direction } = windSpeedToScore(speedMph, response, ctx);

  return {
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    dominantTags: tags,
    direction,
    confidenceDependency: 'high', // wind data is current and reliable when present
    applicable: true,
  };
}
