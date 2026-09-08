import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
export interface ReportRequest {
  requestId: string;
  typeId: string;
  clarity: "clear" | "stained" | "dirty";
  date: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  window?: { start: string; end: string };
}
export interface ReportEnvelope {
  schemaVersion: 1;
  request: ReportRequest;
  weather: {
    source: "manual" | "open_meteo";
    meanCloudPercent: number | null;
    groups: { light: "sunny" | "cloudy"; label: string }[];
  };
  selection: {
    report: { reportId: string; userId: string; requestId: string };
    groups: {
      light: "sunny" | "cloudy";
      poolSize: number;
      canRotate: boolean;
      choices: {
        patternId: string;
        imageId: string;
        name: string;
        visualDescription: string;
        explanation: string;
        swatches?: string[];
      }[];
    }[];
  };
}
export async function generateColorReport(
  request: ReportRequest,
): Promise<ReportEnvelope> {
  try {
    return await invokeEdgeFunction("color-picker", {
      accessToken: await getValidAccessToken(),
      body: { action: "generate", ...request },
      timeoutMs: 30000,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Requested function was not found") {
      throw new Error("Color Match isn’t available on the server yet. Your selections are saved on this screen; please try again after the service is enabled.");
    }
    throw error;
  }
}
export async function reopenColorReport(
  reportId: string,
): Promise<ReportEnvelope> {
  return invokeEdgeFunction("color-picker", {
    accessToken: await getValidAccessToken(),
    body: { action: "reopen", reportId },
  });
}
