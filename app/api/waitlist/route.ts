export async function POST(request: Request) {
  try {
    const { email, tier, company } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const res = await fetch(`${supabaseUrl}/rest/v1/iconycs_waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email, tier: tier || null, company: company || null }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[waitlist] Supabase error:', err);
      // If table doesn't exist yet, still return success to not block UX
      if (res.status === 404 || res.status === 422 || err.includes('does not exist')) {
        console.warn('[waitlist] Table may not exist yet — logging signup locally:', { email, tier, company });
        return Response.json({ success: true, note: 'Logged locally — run SQL migration to enable Supabase persistence' });
      }
      return Response.json({ error: 'Failed to save signup' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    console.error('[waitlist] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
