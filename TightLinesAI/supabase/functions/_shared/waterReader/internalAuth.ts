export function assertInternalWaterReaderRequest(req: Request): {
  ok: true;
} | {
  ok: false;
  status: number;
  code: string;
  message: string;
} {
  const configuredSecret = Deno.env.get("WATER_READER_INTERNAL_KEY");
  if (!configuredSecret || configuredSecret.trim().length < 16) {
    return {
      ok: false,
      status: 500,
      code: "internal_misconfigured",
      message: "Water Reader internal validation secret is not configured.",
    };
  }

  const requestSecret = req.headers.get("x-water-reader-internal-key");
  if (!requestSecret || requestSecret !== configuredSecret) {
    return {
      ok: false,
      status: 403,
      code: "forbidden",
      message: "This endpoint is reserved for internal Water Reader infrastructure.",
    };
  }

  return { ok: true };
}
