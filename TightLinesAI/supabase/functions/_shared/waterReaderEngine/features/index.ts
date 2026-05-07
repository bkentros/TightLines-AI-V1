import type { WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts.ts';
import { detectCoveCandidates, detectSmoothLakeCoveCandidates } from './coves.ts';
import { resolveWaterReaderFeatureConflicts } from './conflicts.ts';
import { detectDamCandidates } from './dams.ts';
import { detectIslandFeatures } from './islands.ts';
import { detectNeckAndSaddleCandidates, detectPointSeededNeckCandidates } from './necks.ts';
import { detectPointCandidates, detectSmoothLakePointCandidates } from './points.ts';
import { smoothLakeEnrichmentProfile } from './smoothness.ts';
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

export * from './types.ts';
export * from './islands.ts';
export * from './coves.ts';
export * from './points.ts';
export * from './necks.ts';
export * from './dams.ts';
export * from './conflicts.ts';
export * from './validation.ts';
