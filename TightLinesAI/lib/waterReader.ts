import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
import type {
  WaterbodyPolygonResponse,
  WaterbodySearchMode,
  WaterbodySearchResponse,
  WaterReaderHistoryResponse,
  WaterReaderReadRequest,
  WaterReaderReadResponse,
} from "./waterReaderContracts";

export async function searchWaterbodies(params: {
  mode?: WaterbodySearchMode;
  query?: string;
  state?: string;
  county?: string;
  lat?: number;
  lon?: number;
  radiusMiles?: number;
  limit?: number;
}): Promise<WaterbodySearchResponse> {
  const token = await getValidAccessToken();
  return invokeEdgeFunction<WaterbodySearchResponse>("waterbody-search", {
    accessToken: token,
    body: params,
  });
}

export async function fetchWaterbodyPolygon(params: {
  lakeId: string;
}): Promise<WaterbodyPolygonResponse> {
  const token = await getValidAccessToken();
  return invokeEdgeFunction<WaterbodyPolygonResponse>("waterbody-polygon", {
    accessToken: token,
    body: params,
  });
}

export async function fetchWaterReaderRead(params: WaterReaderReadRequest): Promise<WaterReaderReadResponse> {
  const token = await getValidAccessToken();
  return invokeEdgeFunction<WaterReaderReadResponse>("water-reader-read", {
    accessToken: token,
    body: params,
  });
}

export async function fetchWaterReaderHistory(params?: { limit?: number }): Promise<WaterReaderHistoryResponse> {
  const token = await getValidAccessToken();
  return invokeEdgeFunction<WaterReaderHistoryResponse>("water-reader-history", {
    accessToken: token,
    body: params ?? {},
  });
}
