import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
import type {
  WaterbodyPolygonResponse,
  WaterbodySearchResponse,
  WaterReaderReadRequest,
  WaterReaderReadResponse,
} from "./waterReaderContracts";

export async function searchWaterbodies(params: {
  query: string;
  state?: string;
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
