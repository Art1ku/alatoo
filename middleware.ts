
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const authToken = cookies.get('authToken'); 

  if (!authToken && nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (authToken && nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/((?!_next/static|_next/image|favicon.ico).*)'], 
};
