// Redirect verified Supabase email links to the native FinFindr app.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const APP_SCHEME = "finfindr://auth/confirm";
const ALLOWED_TYPES = new Set([
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
]);

Deno.serve((req: Request) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const url = new URL(req.url);
  const tokenHash = url.searchParams.get("token_hash")?.trim();
  const requestedType = url.searchParams.get("type")?.trim().toLowerCase() ??
    "email";
  if (!tokenHash || tokenHash.length > 2048 || !ALLOWED_TYPES.has(requestedType)) {
    return new Response("Invalid authentication link", { status: 400 });
  }

  const redirectUrl = `${APP_SCHEME}?token_hash=${encodeURIComponent(tokenHash)}` +
    `&type=${encodeURIComponent(requestedType)}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
