import { NextRequest, NextResponse } from 'next/server';

// Returns current user's tier based on their session
// Used by frontend to show/hide features
export async function GET(request: NextRequest) {
  // For now return 'free'  -  will check Supabase session when auth is wired
  return NextResponse.json({ tier: 'free', features: ['reports', 'national', 'state'] });
}
