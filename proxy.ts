
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAccessToken = Boolean(
    request.cookies.get('accessToken')?.value
  );

  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isPublicRoute = matchesRoute(pathname, publicRoutes);

  if (!hasAccessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (hasAccessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};