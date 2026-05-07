import type { WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts';
import { detectCoveCandidates, detectSmoothLakeCoveCandidates } from './coves';
import { resolveWaterReaderFeatureConflicts } from './conflicts';
import { detectDamCandidates } from './dams';
import { detectIslandFeatures } from './islands';
import { detectNeckAndSaddleCandidates, detectPointSeededNeckCandidates } from './necks';
import { detectPointCandidates, detectSmoothLakePointCandidates } from './points';
import { smoothLakeEnrichmentProfile } from './smoothness';
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
  const pointSeededNecks = detectPointSeededNeckCandidates(preprocessResult, points);
  const dams = detectDamCandidates(preprocessResult, input);
  const normalFeatures = resolveWaterReaderFeatureConflicts({ coves, points, islands, necks: [...necks, ...pointSeededNecks], saddles, dams, metrics });
  const smoothProfile = smoothLakeEnrichmentProfile(preprocessResult, normalFeatures);
  if (!smoothProfile.eligible) return normalFeatures;

  const smoothPoints = detectSmoothLakePointCandidates(preprocessResult, input, points, smoothProfile);
  const smoothCoves = detectSmoothLakeCoveCandidates(preprocessResult, input, coves, smoothProfile);
  if (smoothPoints.length === 0 && smoothCoves.length === 0) return normalFeatures;

  return resolveWaterReaderFeatureConflicts({
    coves: [...coves, ...smoothCoves],
    points: [...points, ...smoothPoints],
    islands,
    necks: [...necks, ...pointSeededNecks],
    saddles,
    dams,
    metrics,
  });
}

export * from './types';
export * from './islands';
export * from './coves';
export * from './points';
export * from './necks';
export * from './dams';
export * from './conflicts';
export * from './validation';
