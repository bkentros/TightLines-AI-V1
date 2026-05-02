import type { WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts';
import { detectCoveCandidates } from './coves';
import { resolveWaterReaderFeatureConflicts } from './conflicts';
import { detectDamCandidates } from './dams';
import { detectIslandFeatures } from './islands';
import { detectNeckAndSaddleCandidates } from './necks';
import { detectPointCandidates } from './points';
import type { WaterReaderDetectedFeature } from './types';

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

export * from './types';
export * from './islands';
export * from './coves';
export * from './points';
export * from './necks';
export * from './dams';
export * from './conflicts';
export * from './validation';
