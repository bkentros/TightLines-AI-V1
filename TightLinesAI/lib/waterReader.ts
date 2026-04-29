import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
import type {
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
