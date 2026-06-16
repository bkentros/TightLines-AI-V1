export async function onRequest(context) {
  const anonKey = context.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    return new Response(JSON.stringify({ error: 'portal_not_configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      supabaseUrl: 'https://hsesngprhpgajyfbrwbf.supabase.co',
      supabaseAnonKey: anonKey,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
}
