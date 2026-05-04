import type { PointM, RingM } from '../contracts.ts';
import type { WaterReaderDetectedFeature } from '../features/types.ts';

export type WaterReaderDebugCue =
  | {
      featureId: string;
      featureClass: 'main_lake_point' | 'secondary_point';
      tip: PointM;
      leftSlope: PointM;
      rightSlope: PointM;
      baseMidpoint: PointM;
    }
  | {
      featureId: string;
      featureClass: 'cove';
      mouthLeft: PointM;
      mouthRight: PointM;
      back: PointM;
    }
  | {
      featureId: string;
      featureClass: 'island';
      ring: RingM;
      endpointA: PointM;
      endpointB: PointM;
    }
  | {
      featureId: string;
      featureClass: 'neck' | 'saddle';
      endpointA: PointM;
      endpointB: PointM;
      center: PointM;
    }
  | {
      featureId: string;
      featureClass: 'dam';
      cornerA: PointM;
      cornerB: PointM;
    };

export function featureDebugCues(features: WaterReaderDetectedFeature[]): WaterReaderDebugCue[] {
  const cues: WaterReaderDebugCue[] = [];
  for (const feature of features) {
    switch (feature.featureClass) {
      case 'main_lake_point':
      case 'secondary_point':
        cues.push({
          featureId: feature.featureId,
          featureClass: feature.featureClass,
          tip: feature.tip,
          leftSlope: feature.leftSlope,
          rightSlope: feature.rightSlope,
          baseMidpoint: feature.baseMidpoint,
        });
        break;
      case 'cove':
        cues.push({
          featureId: feature.featureId,
          featureClass: feature.featureClass,
          mouthLeft: feature.mouthLeft,
          mouthRight: feature.mouthRight,
          back: feature.back,
        });
        break;
      case 'island':
        cues.push({
          featureId: feature.featureId,
          featureClass: feature.featureClass,
          ring: feature.ring,
          endpointA: feature.endpointA,
          endpointB: feature.endpointB,
        });
        break;
      case 'neck':
      case 'saddle':
        cues.push({
          featureId: feature.featureId,
          featureClass: feature.featureClass,
          endpointA: feature.endpointA,
          endpointB: feature.endpointB,
          center: feature.center,
        });
        break;
      case 'dam':
        cues.push({
          featureId: feature.featureId,
          featureClass: feature.featureClass,
          cornerA: feature.cornerA,
          cornerB: feature.cornerB,
        });
        break;
      default:
        break;
    }
  }
  return cues;
}
