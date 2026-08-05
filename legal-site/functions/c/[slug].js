const disabledResponse = () =>
  new Response('Not Found', {
    status: 404,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });

export const onRequest = disabledResponse;
