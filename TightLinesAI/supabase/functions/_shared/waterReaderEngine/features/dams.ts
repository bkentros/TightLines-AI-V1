import type { WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts.ts';
import type { WaterReaderDamCandidate } from './types.ts';

export function detectDamCandidates(
  _preprocess: WaterReaderPreprocessResult,
  _input: WaterReaderEngineInput,
): WaterReaderDamCandidate[] {
  return [];
}
