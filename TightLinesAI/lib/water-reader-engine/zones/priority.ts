import type { WaterReaderDetectedFeature } from '../features/types';
import type { WaterReaderZoneDraft } from './types';

export function featureZonePriority(feature: WaterReaderDetectedFeature): number {
  switch (feature.featureClass) {
    case 'dam':
      return 1;
    case 'neck':
      return 2;
    case 'main_lake_point':
      return 3;
    case 'saddle':
      return 4;
    case 'island':
      return 5;
    case 'cove':
      return 6;
    case 'secondary_point':
      return 7;
    case 'universal':
      return 8;
    default:
      return 9;
  }
}

export function featureZoneScore(feature: WaterReaderDetectedFeature): number {
  switch (feature.featureClass) {
    case 'main_lake_point':
    case 'secondary_point':
      return feature.protrusionLengthM;
    case 'cove':
      return feature.coveAreaSqM;
    case 'island':
      return feature.areaSqM;
    case 'neck':
    case 'saddle':
      return feature.score;
    case 'dam':
      return feature.segmentLengthM;
    default:
      return feature.score ?? 0;
  }
}

export function zoneDraftSort(a: WaterReaderZoneDraft, b: WaterReaderZoneDraft): number {
  return a.unitPriority - b.unitPriority || b.unitScore - a.unitScore || a.sourceFeatureId.localeCompare(b.sourceFeatureId);
}

export function visibleZoneCap(acres: number | null | undefined): number {
  if (typeof acres === 'number' && Number.isFinite(acres)) {
    if (acres < 100) return 6;
    if (acres <= 1000) return 10;
  }
  return 12;
}
