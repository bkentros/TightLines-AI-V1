import type {
  ReviewedSourcePath,
  SourceValidationRequestMethod,
  SourceProviderHealthValidationResult,
  WaterbodySourceFetchValidationResult,
} from "./contracts.ts";

export interface ValidateApprovedSourcePathOptions {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function nowIso(): string {
  return new Date().toISOString();
}

function blockedResult(
  link: ReviewedSourcePath,
  error: string,
): WaterbodySourceFetchValidationResult {
  const targetUrl = link.sourcePath;
  return {
    linkId: link.linkId,
    lakeId: link.lakeId,
    sourceMode: link.sourceMode,
    depthSourceKind: link.depthSourceKind,
    status: "blocked",
    checkedAtISO: nowIso(),
    scope: "source_path",
    requestMethod: "head",
    targetUrl,
    error,
    httpStatus: null,
    sourcePath: link.sourcePath,
    providerName: link.providerName,
  };
}

function unsupportedResult(
  link: ReviewedSourcePath,
  error: string,
  targetUrl: string,
): WaterbodySourceFetchValidationResult {
  return {
    linkId: link.linkId,
    lakeId: link.lakeId,
    sourceMode: link.sourceMode,
    depthSourceKind: link.depthSourceKind,
    status: "unsupported",
    checkedAtISO: nowIso(),
    scope: "source_path",
    requestMethod: "head",
    targetUrl,
    error,
    httpStatus: null,
    sourcePath: link.sourcePath,
    providerName: link.providerName,
  };
}

function makeResult(
  link: ReviewedSourcePath,
  targetUrl: string,
  requestMethod: SourceValidationRequestMethod,
  status: WaterbodySourceFetchValidationResult["status"],
  httpStatus: number | null,
  error: string | null,
): WaterbodySourceFetchValidationResult {
  return {
    linkId: link.linkId,
    lakeId: link.lakeId,
    sourceMode: link.sourceMode,
    depthSourceKind: link.depthSourceKind,
    status,
    checkedAtISO: nowIso(),
    scope: "source_path",
    requestMethod,
    targetUrl,
    httpStatus,
    error,
    sourcePath: link.sourcePath,
    providerName: link.providerName,
  };
}

export async function validateApprovedSourcePath(
  link: ReviewedSourcePath,
  options: ValidateApprovedSourcePathOptions = {},
): Promise<WaterbodySourceFetchValidationResult> {
  if (link.approvalStatus !== "approved") {
    return blockedResult(link, "Source path is not approved.");
  }
  if (link.reviewStatus !== "allowed") {
    return blockedResult(link, `Source review status is ${link.reviewStatus}.`);
  }
  if (!link.canFetch) {
    return blockedResult(link, "Source rights do not allow fetch.");
  }

  let url: URL;
  const targetUrl = link.sourcePath;
  try {
    url = new URL(targetUrl);
  } catch {
    return unsupportedResult(link, "Source path is not a valid URL.", targetUrl);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return unsupportedResult(link, `Unsupported URL protocol: ${url.protocol}`, targetUrl);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 8_000);
  let requestMethod: SourceValidationRequestMethod = "head";
  try {
    const fetchImpl = options.fetchImpl ?? fetch;
    const baseHeaders = {
      Accept: "application/json, text/html, application/pdf, image/*, */*",
    };

    let response = await fetchImpl(url.toString(), {
      method: "HEAD",
      headers: baseHeaders,
      signal: controller.signal,
    });

    if (response.status === 405 || response.status === 501) {
      requestMethod = "get";
      response = await fetchImpl(url.toString(), {
        method: "GET",
        headers: {
          ...baseHeaders,
          Range: "bytes=0-1023",
        },
        signal: controller.signal,
      });
    }

    if (!response.ok) {
      return makeResult(
        link,
        targetUrl,
        requestMethod,
        "unreachable",
        response.status,
        `Fetch failed with HTTP ${response.status}.`,
      );
    }

    return makeResult(link, targetUrl, requestMethod, "reachable", response.status, null);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    return makeResult(link, targetUrl, requestMethod, "unreachable", null, message);
  } finally {
    clearTimeout(timeout);
  }
}

function makeProviderHealthResult(
  sourceId: string,
  providerName: string,
  providerHealthUrl: string,
  requestMethod: SourceValidationRequestMethod,
  status: SourceProviderHealthValidationResult["status"],
  httpStatus: number | null,
  error: string | null,
): SourceProviderHealthValidationResult {
  return {
    sourceId,
    providerName,
    providerHealthUrl,
    status,
    checkedAtISO: nowIso(),
    scope: "provider_health",
    requestMethod,
    httpStatus,
    error,
  };
}

export async function validateSourceProviderHealth(
  input: {
    sourceId: string;
    providerName: string;
    providerHealthUrl: string;
  },
  options: ValidateApprovedSourcePathOptions = {},
): Promise<SourceProviderHealthValidationResult> {
  let url: URL;
  try {
    url = new URL(input.providerHealthUrl);
  } catch {
    return makeProviderHealthResult(
      input.sourceId,
      input.providerName,
      input.providerHealthUrl,
      "head",
      "unsupported",
      null,
      "Provider health URL is not a valid URL.",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return makeProviderHealthResult(
      input.sourceId,
      input.providerName,
      input.providerHealthUrl,
      "head",
      "unsupported",
      null,
      `Unsupported URL protocol: ${url.protocol}`,
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 8_000);
  let requestMethod: SourceValidationRequestMethod = "head";
  try {
    const fetchImpl = options.fetchImpl ?? fetch;
    const baseHeaders = {
      Accept: "application/json, text/html, application/pdf, image/*, */*",
    };

    let response = await fetchImpl(url.toString(), {
      method: "HEAD",
      headers: baseHeaders,
      signal: controller.signal,
    });

    if (response.status === 405 || response.status === 501) {
      requestMethod = "get";
      response = await fetchImpl(url.toString(), {
        method: "GET",
        headers: {
          ...baseHeaders,
          Range: "bytes=0-1023",
        },
        signal: controller.signal,
      });
    }

    if (!response.ok) {
      return makeProviderHealthResult(
        input.sourceId,
        input.providerName,
        input.providerHealthUrl,
        requestMethod,
        "unreachable",
        response.status,
        `Fetch failed with HTTP ${response.status}.`,
      );
    }

    return makeProviderHealthResult(
      input.sourceId,
      input.providerName,
      input.providerHealthUrl,
      requestMethod,
      "reachable",
      response.status,
      null,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    return makeProviderHealthResult(
      input.sourceId,
      input.providerName,
      input.providerHealthUrl,
      requestMethod,
      "unreachable",
      null,
      message,
    );
  } finally {
    clearTimeout(timeout);
  }
}
