import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
import type {
  AerialTilePlanResponse,
  WaterbodyAerialGeometryCandidatesResponse,
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

export async function fetchWaterbodyAerialGeometryCandidates(params: {
  lakeId: string;
  month?: number;
  maxZones?: number;
}): Promise<WaterbodyAerialGeometryCandidatesResponse> {
  const token = await getValidAccessToken();
  return invokeEdgeFunction<WaterbodyAerialGeometryCandidatesResponse>(
    "waterbody-aerial-geometry-candidates",
    {
      accessToken: token,
      body: params,
    },
  );
}
