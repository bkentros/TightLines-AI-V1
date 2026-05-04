import type { WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts.ts';
import { detectCoveCandidates } from './coves.ts';
import { resolveWaterReaderFeatureConflicts } from './conflicts.ts';
import { detectDamCandidates } from './dams.ts';
import { detectIslandFeatures } from './islands.ts';
import { detectNeckAndSaddleCandidates } from './necks.ts';
import { detectPointCandidates } from './points.ts';
import type { WaterReaderDetectedFeature } from './types.ts';

export function detectWaterReaderFeatures(
  preprocessResult: WaterReaderPreprocessResult,
  input: WaterReaderEngineInput,
): WaterReaderDetectedFeature[] {
  if (preprocessResult.supportStatus === 'not_supported') return [];
  const primaryPolygon = preprocessResult.primaryPolygon;
  const metrics = preprocessResult.metrics;
  if (!primaryPolygon || !metrics) return [];

  const islands = detectIslandFeatures(primaryPolygon);
  const coves = detectCoveCandidates(preprocessResult, input);
  const points = detectPointCandidates(preprocessResult, input);
  const { necks, saddles } = detectNeckAndSaddleCandidates(preprocessResult);
  const dams = detectDamCandidates(preprocessResult, input);
  return resolveWaterReaderFeatureConflicts({ coves, points, islands, necks, saddles, dams, metrics });
}

export * from './types.ts';
export * from './islands.ts';
export * from './coves.ts';
export * from './points.ts';
export * from './necks.ts';
export * from './dams.ts';
export * from './conflicts.ts';
export * from './validation.ts';
