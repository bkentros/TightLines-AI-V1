const DEFAULT_APP_STORE_URL = 'https://apps.apple.com/app/id6769178136';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Minimal /r handler — validates referral params and redirects to App Store. */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const click = url.searchParams.get('click')?.trim();
  const code = url.searchParams.get('code')?.trim();

  if (!click || !code) {
    return Response.redirect(DEFAULT_APP_STORE_URL, 302);
  }

  const appStoreJs = JSON.stringify(DEFAULT_APP_STORE_URL);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FinFindr</title>
  <meta http-equiv="refresh" content="0;url=${escapeHtml(DEFAULT_APP_STORE_URL)}" />
</head>
<body>
  <p>Opening the App Store…</p>
  <script>
(function () {
  var payload = ${JSON.stringify(url.toString())};
  var appStoreUrl = ${appStoreJs};
  function copyPayload() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.resolve(false);
    return navigator.clipboard.writeText(payload).then(function () { return true; }).catch(function () { return false; });
  }
  copyPayload().finally(function () {
    window.location.replace(appStoreUrl);
  });
})();
  </script>
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
