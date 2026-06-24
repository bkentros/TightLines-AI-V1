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

function renderPage(payload, anonKey) {
  const creatorName = escapeHtml(payload.creator.display_name);
  const appStoreUrl = escapeHtml(payload.app_store_app_url || DEFAULT_APP_STORE_URL);
  const deepLink = escapeHtml(payload.deep_link_url || '');
  const referralWebUrl = escapeHtml(payload.referral_web_url || '');
  const deepLinkJs = JSON.stringify(payload.deep_link_url || '');
  const appStoreJs = JSON.stringify(payload.app_store_app_url || DEFAULT_APP_STORE_URL);
  const referralWebJs = JSON.stringify(payload.referral_web_url || '');
  const clickTokenJs = JSON.stringify(payload.click_token || '');
  const supabaseAnonJs = JSON.stringify(anonKey || '');

  const attributionScript = payload.referral_web_url
    ? `<script>
(function () {
  var deepLink = ${deepLinkJs};
  var appStoreUrl = ${appStoreJs};
  var referralWebUrl = ${referralWebJs};
  var clickToken = ${clickTokenJs};
  var supabaseAnonKey = ${supabaseAnonJs};

  function copyReferralPayload() {
    if (!referralWebUrl || !navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.resolve(false);
    }
    return navigator.clipboard.writeText(referralWebUrl).then(function () {
      return true;
    }).catch(function () {
      return false;
    });
  }

  copyReferralPayload();

  if (clickToken && supabaseAnonKey) {
    fetch('${SUPABASE_PROJECT_URL}/functions/v1/creator-referral-enrich', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ click_token: clickToken }),
    }).catch(function () {
      // Non-blocking — install match still tries clipboard + fingerprint in app.
    });
  }

  function goToAppStore() {
    window.location.href = appStoreUrl;
  }

  function handleAppStoreDownload(event) {
    if (event) event.preventDefault();
    copyReferralPayload().finally(goToAppStore);
  }

  function tryOpenAppThenStore(event) {
    if (event) event.preventDefault();
    copyReferralPayload().finally(function () {
      if (!deepLink) {
        goToAppStore();
        return;
      }

      var leftPage = false;
      function markLeft() {
        leftPage = true;
      }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) markLeft();
      }, { once: true });
      window.addEventListener('pagehide', markLeft, { once: true });
      window.addEventListener('blur', markLeft, { once: true });

      // Hidden iframe avoids Safari's "invalid address" alert when the app is not installed.
      var iframe = document.createElement('iframe');
      iframe.style.cssText = 'display:none;border:0;width:0;height:0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
      try {
        iframe.contentWindow.location.replace(deepLink);
      } catch (err) {
        // Ignore — fallback timer sends users to the App Store.
      }

      window.setTimeout(function () {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        if (!leftPage) goToAppStore();
      }, 1400);
    });
  }

  var openBtn = document.getElementById('open-app-cta');
  var downloadBtn = document.getElementById('download-app-cta');
  if (openBtn) {
    openBtn.addEventListener('click', tryOpenAppThenStore);
  }
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleAppStoreDownload);
  }
})();
</script>`
    : '';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${creatorName} · FinFindr</title>
  <meta name="description" content="Get FinFindr — fishing intelligence from ${creatorName}." />
  <meta name="theme-color" content="#d8ebf8" />
  <style>
    :root { --ink:#07192b; --muted:#4d6478; --water:#1f6f97; --card:rgba(255,255,255,.94); }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; min-height:100dvh; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; color:var(--ink);
      background:radial-gradient(circle at 50% -10%, #fff 0%, transparent 46%), linear-gradient(180deg,#eaf5fc 0%,#d4e9f7 55%,#c8e2f4 100%);
      display:flex; align-items:center; justify-content:center;
      padding:max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom)); }
    .card { width:min(440px,100%); background:var(--card); border-radius:30px; box-shadow:0 28px 70px rgba(7,25,43,.14); padding:30px 22px 24px; text-align:center;
      transform:translateY(clamp(-32px, -6vh, -12px)); }
    .icon { width:100px; height:100px; border-radius:24px; box-shadow:0 16px 34px rgba(7,25,43,.18); margin:0 auto 14px; display:block; }
    .eyebrow { margin:0; color:var(--water); font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; }
    h1 { margin:6px 0 0; font-size:28px; line-height:1.05; letter-spacing:-.03em; }
    .tagline { margin:10px auto 0; max-width:22rem; color:var(--muted); font-size:15px; line-height:1.5; }
    .cta { display:block; margin-top:22px; width:100%; border:0; border-radius:16px; padding:17px 18px; background:linear-gradient(180deg,#0a2742 0%,#07192b 100%); color:#fff !important; font-size:17px; font-weight:700; text-decoration:none; box-shadow:0 14px 30px rgba(7,25,43,.22); cursor:pointer; }
    .cta-secondary { background:#fff; color:var(--ink) !important; border:1px solid #c9deec; box-shadow:none; margin-top:10px; }
  </style>
</head>
<body>
  <main class="card">
    <img class="icon" src="/assets/app-icon.png" width="100" height="100" alt="FinFindr app icon" />
    <p class="eyebrow">${creatorName}</p>
    <h1>Get FinFindr</h1>
    <p class="tagline">Bite reports, tackle direction, and water intelligence — shared by ${creatorName}.</p>
    ${deepLink ? `<a id="open-app-cta" class="cta" href="${appStoreUrl}">Get FinFindr</a>` : ''}
    <a id="download-app-cta" class="cta cta-secondary" href="${appStoreUrl}" rel="noopener noreferrer">Download on the App Store</a>
  </main>
  ${attributionScript}
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

  const incomingUrl = new URL(context.request.url);
  const apiUrl = new URL('/functions/v1/creator-referral-click', SUPABASE_PROJECT_URL);
  apiUrl.searchParams.set('slug', slug);

  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'referrer_host']) {
    const value = incomingUrl.searchParams.get(key);
    if (value) apiUrl.searchParams.set(key, value);
  }

  const referer = context.request.headers.get('referer');
  if (!apiUrl.searchParams.has('referrer_host') && referer) {
    try {
      const host = new URL(referer).hostname;
      if (host) apiUrl.searchParams.set('referrer_host', host);
    } catch {
      // ignore malformed referer
    }
  }

  const clientIp = context.request.headers.get('CF-Connecting-IP') ??
    context.request.headers.get('cf-connecting-ip');
  const userAgent = context.request.headers.get('User-Agent') ?? '';

  const fetchHeaders = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Referer: referer ?? '',
  };
  if (clientIp) {
    fetchHeaders['x-forwarded-for'] = clientIp;
    fetchHeaders['x-real-ip'] = clientIp;
  }
  if (userAgent) {
    fetchHeaders['User-Agent'] = userAgent;
  }

  const response = await fetch(apiUrl.toString(), {
    headers: fetchHeaders,
  });

  if (!response.ok) {
    return renderNotFound();
  }

  const payload = await response.json();
  if (!payload?.ok) {
    return renderNotFound();
  }

  return renderPage(payload, anonKey);
}
