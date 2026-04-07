import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// FIX: Aggiunto "default" a questa esportazione
export default function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('vito_auth')?.value === 'true';

  if (request.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};