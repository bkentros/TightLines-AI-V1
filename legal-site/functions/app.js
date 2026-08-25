const APP_STORE_URL = 'https://apps.apple.com/app/id6769178136';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.finseekr.finfindr';

export async function onRequest({ request }) {
  const userAgent = request.headers.get('user-agent') || '';
  const destination = /android/i.test(userAgent) ? PLAY_STORE_URL : APP_STORE_URL;

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      'Cache-Control': 'private, no-store, max-age=0',
      Vary: 'User-Agent',
    },
  });
}
