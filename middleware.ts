import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // For now just pass through — auth check will be added when Supabase session is wired
  return NextResponse.next();
}

export const config = {
  matcher: ['/reports/cascade/:path*', '/fair-lending/:path*', '/api/v1/:path*'],
};
