import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect authenticated routes
  const protectedPaths = ['/profile', '/dashboard', '/workspace'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect authenticated users away from auth page
  if (request.nextUrl.pathname === '/auth' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/profile/:path*', '/dashboard/:path*', '/workspace/:path*', '/auth']
};
