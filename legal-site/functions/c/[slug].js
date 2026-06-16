const SUPABASE_PROJECT_URL = 'https://hsesngprhpgajyfbrwbf.supabase.co';
const DEFAULT_APP_STORE_URL = 'https://apps.apple.com/app/id6769178136';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderNotFound() {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>FinFindr</title></head><body style="font-family:system-ui;padding:24px;"><h1>Creator link not found</h1><p><a href="${DEFAULT_APP_STORE_URL}">Download FinFindr</a></p></body></html>`,
    { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

function renderPage(payload) {
  const creatorName = escapeHtml(payload.creator.display_name);
  const discountMonths = Number(payload.discount_duration_months) || 3;
  const discountPercent = Number(payload.discount_percent) || 10;
  const appStoreUrl = escapeHtml(payload.app_store_app_url || DEFAULT_APP_STORE_URL);
  const deepLink = escapeHtml(payload.deep_link_url || '');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${creatorName} · FinFindr</title>
  <meta name="description" content="Get FinFindr with ${discountPercent}% off from ${creatorName}." />
  <meta name="theme-color" content="#d8ebf8" />
  <style>
    :root { --ink:#07192b; --muted:#4d6478; --water:#1f6f97; --card:rgba(255,255,255,.94); }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; color:var(--ink);
      background:radial-gradient(circle at 50% -10%, #fff 0%, transparent 46%), linear-gradient(180deg,#eaf5fc 0%,#d4e9f7 55%,#c8e2f4 100%);
      display:flex; align-items:center; justify-content:center; padding:22px 16px 30px; }
    .card { width:min(440px,100%); background:var(--card); border-radius:30px; box-shadow:0 28px 70px rgba(7,25,43,.14); padding:30px 22px 24px; text-align:center; }
    .icon { width:100px; height:100px; border-radius:24px; box-shadow:0 16px 34px rgba(7,25,43,.18); margin:0 auto 14px; display:block; }
    .eyebrow { margin:0; color:var(--water); font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; }
    h1 { margin:6px 0 0; font-size:28px; line-height:1.05; letter-spacing:-.03em; }
    .tagline { margin:10px auto 0; max-width:22rem; color:var(--muted); font-size:15px; line-height:1.5; }
    .cta { display:block; margin-top:22px; width:100%; border:0; border-radius:16px; padding:17px 18px; background:linear-gradient(180deg,#0a2742 0%,#07192b 100%); color:#fff !important; font-size:17px; font-weight:700; text-decoration:none; box-shadow:0 14px 30px rgba(7,25,43,.22); }
    .cta-secondary { background:#fff; color:var(--ink) !important; border:1px solid #c9deec; box-shadow:none; margin-top:10px; }
    .steps { margin-top:18px; text-align:left; font-size:14px; line-height:1.45; color:var(--muted); }
    .steps strong { color:var(--ink); }
    .fine { margin-top:14px; font-size:12px; color:var(--muted); }
  </style>
</head>
<body>
  <main class="card">
    <img class="icon" src="/assets/app-icon.png" width="100" height="100" alt="FinFindr app icon" />
    <p class="eyebrow">${creatorName}</p>
    <h1>Get FinFindr</h1>
    <p class="tagline">${discountPercent}% off your first ${discountMonths} months when you subscribe in the app.</p>
    ${deepLink ? `<a class="cta" href="${deepLink}">Open FinFindr &amp; claim ${discountPercent}% off</a>` : ''}
    <a class="cta cta-secondary" href="${appStoreUrl}" rel="noopener noreferrer">Download on the App Store</a>
    <div class="steps">
      <p><strong>1.</strong> Download FinFindr if you don't have it yet.</p>
      <p><strong>2.</strong> Open the link again and sign in to your FinFindr account.</p>
      <p><strong>3.</strong> Apply the creator discount in-app, then upgrade to Angler.</p>
    </div>
    <p class="fine">Free · iPhone · United States</p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequest(context) {
  const slug = context.params?.slug;
  if (!slug || !/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug)) {
    return renderNotFound();
  }

  const anonKey = context.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    return new Response('Creator landing is not configured.', { status: 503 });
  }

  const apiUrl = new URL('/functions/v1/creator-referral-click', SUPABASE_PROJECT_URL);
  apiUrl.searchParams.set('slug', slug);

  const response = await fetch(apiUrl.toString(), {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (!response.ok) {
    return renderNotFound();
  }

  const payload = await response.json();
  if (!payload?.ok) {
    return renderNotFound();
  }

  return renderPage(payload);
}
