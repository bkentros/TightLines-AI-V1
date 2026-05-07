import type { WaterReaderEngineInput, WaterReaderPreprocessResult } from '../contracts';
import type { WaterReaderDamCandidate } from './types';

export function detectDamCandidates(
  _preprocess: WaterReaderPreprocessResult,
  _input: WaterReaderEngineInput,
): WaterReaderDamCandidate[] {
  return [];
}
