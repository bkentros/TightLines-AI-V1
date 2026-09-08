import { getValidAccessToken, invokeEdgeFunction } from "./supabase";
import { parseColorReportEnvelope } from "./colorPickerReport";
export interface ReportRequest {
  requestId: string;
  typeId: string;
  clarity: "clear" | "stained" | "dirty";
  date: string;
  timezone: string;
}
export interface ReportEnvelope {
  schemaVersion: 1 | 2;
  request: ReportRequest;
  /** Legacy reports may include a weather snapshot; new reports do not collect it. */
  weather?: { meanCloudPercent: number | null };
  selection: {
    report: {
      schemaVersion: 1;
      reportId: string;
      userId: string;
      requestId: string;
      generatedAt: string;
      typeId: string;
      clarity: ReportRequest["clarity"];
      catalogVersion: string;
      selectionVersion: string;
      groups: { light: "sunny" | "cloudy"; patternIds: string[] }[];
    };
    /** Identical pools reuse a pair; the report still renders both explicit light sections. */
    sharedAcrossLight?: boolean;
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
    const response = await invokeEdgeFunction<unknown>("color-picker", {
      accessToken: await getValidAccessToken(),
      body: { action: "generate", ...request },
      timeoutMs: 30000,
    });
    return parseColorReportEnvelope(response);
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
  const response = await invokeEdgeFunction<unknown>("color-picker", {
    accessToken: await getValidAccessToken(),
    body: { action: "reopen", reportId },
  });
  return parseColorReportEnvelope(response);
}
