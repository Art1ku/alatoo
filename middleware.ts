// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const authToken = cookies.get('authToken'); // Проверка токена из cookies

  // Если пользователь не авторизован и пытается зайти на главную
  if (!authToken && nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Если авторизован и пытается зайти на /login, перенаправляем на главную
  if (authToken && nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next(); // Продолжаем выполнение запроса
}

export const config = {
  matcher: ['/', '/login', '/((?!_next/static|_next/image|favicon.ico).*)'], // Применяется к корневым страницам
};
