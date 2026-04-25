import { assertEquals, assertMatch } from "jsr:@std/assert";
import { validateApprovedSourcePath, validateSourceProviderHealth } from "../fetchValidation.ts";
import type { ReviewedSourcePath } from "../contracts.ts";

function buildLink(overrides: Partial<ReviewedSourcePath>): ReviewedSourcePath {
  return {
    linkId: "link-1",
    lakeId: "lake-1",
    sourceId: "source-1",
    providerName: "Fixture Provider",
    sourceMode: "aerial",
    depthSourceKind: "none",
    sourcePath: "https://example.com/source",
    sourcePathType: "service_root",
    approvalStatus: "approved",
    reviewStatus: "allowed",
    canFetch: true,
    lakeMatchStatus: "matched",
    usabilityStatus: "usable",
    providerHealthUrl: null,
    ...overrides,
  };
}

function requestMethodOf(init: Parameters<typeof fetch>[1]): string | undefined {
  return (init as { method?: string } | undefined)?.method;
}

Deno.test("validateApprovedSourcePath returns blocked when rights do not allow fetch", async () => {
  const result = await validateApprovedSourcePath(buildLink({ canFetch: false }));
  assertEquals(result.status, "blocked");
  assertEquals(result.httpStatus, null);
  assertEquals(result.requestMethod, "head");
});

Deno.test("validateApprovedSourcePath returns unsupported for invalid URLs", async () => {
  const result = await validateApprovedSourcePath(buildLink({ sourcePath: "lakefinder:123" }));
  assertEquals(result.status, "unsupported");
});

Deno.test("validateApprovedSourcePath prefers HEAD for lightweight reachability checks", async () => {
  const methods: string[] = [];
  const result = await validateApprovedSourcePath(buildLink({}), {
    fetchImpl: async (_url, init) => {
      methods.push(String(requestMethodOf(init)));
      return new Response(null, { status: 200 });
    },
  });
  assertEquals(result.status, "reachable");
  assertEquals(result.scope, "source_path");
  assertEquals(result.httpStatus, 200);
  assertEquals(result.requestMethod, "head");
  assertEquals(methods, ["HEAD"]);
});

Deno.test("validateApprovedSourcePath falls back to GET when HEAD is not supported", async () => {
  const methods: string[] = [];
  const result = await validateApprovedSourcePath(buildLink({}), {
    fetchImpl: async (_url, init) => {
      methods.push(String(requestMethodOf(init)));
      if (requestMethodOf(init) === "HEAD") {
        return new Response(null, { status: 405 });
      }
      return new Response("ok", { status: 200 });
    },
  });
  assertEquals(result.status, "reachable");
  assertEquals(result.scope, "source_path");
  assertEquals(result.requestMethod, "get");
  assertEquals(methods, ["HEAD", "GET"]);
});

Deno.test("validateApprovedSourcePath validates the actual source path even when provider health URL is present", async () => {
  const requestedUrls: string[] = [];
  const result = await validateApprovedSourcePath(
    buildLink({
      sourcePath: "https://example.com/lakes/lake-mary-depth-map.pdf",
      providerHealthUrl: "https://example.com/provider-status",
    }),
    {
      fetchImpl: async (url) => {
        requestedUrls.push(String(url));
        return new Response(null, { status: 200 });
      },
    },
  );

  assertEquals(result.status, "reachable");
  assertEquals(result.targetUrl, "https://example.com/lakes/lake-mary-depth-map.pdf");
  assertEquals(requestedUrls, ["https://example.com/lakes/lake-mary-depth-map.pdf"]);
});

Deno.test("validateApprovedSourcePath returns unreachable for failed responses", async () => {
  const result = await validateApprovedSourcePath(buildLink({}), {
    fetchImpl: async () => new Response("missing", { status: 404 }),
  });
  assertEquals(result.status, "unreachable");
  assertEquals(result.httpStatus, 404);
  assertEquals(result.requestMethod, "head");
  assertMatch(result.error ?? "", /HTTP 404/);
});

Deno.test("validateSourceProviderHealth is separate from source-path validation", async () => {
  const methods: string[] = [];
  const result = await validateSourceProviderHealth(
    {
      sourceId: "source-1",
      providerName: "Fixture Provider",
      providerHealthUrl: "https://example.com/provider-status",
    },
    {
      fetchImpl: async (_url, init) => {
        methods.push(String(requestMethodOf(init)));
        return new Response(null, { status: 200 });
      },
    },
  );

  assertEquals(result.status, "reachable");
  assertEquals(result.scope, "provider_health");
  assertEquals(result.providerHealthUrl, "https://example.com/provider-status");
  assertEquals(methods, ["HEAD"]);
});
