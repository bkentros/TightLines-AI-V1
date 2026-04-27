import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
import type {
  AerialTilePlanResponse,
  WaterbodySearchResponse,
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

export async function fetchWaterbodyAerialTilePlan(params: {
  lakeId: string;
  maxCloseTiles?: number;
}): Promise<AerialTilePlanResponse> {
  const token = await getValidAccessToken();
  return invokeEdgeFunction<AerialTilePlanResponse>("waterbody-aerial-tile-plan", {
    accessToken: token,
    body: params,
  });
}
