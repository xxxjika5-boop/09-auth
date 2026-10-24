import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

function matchesRoute(
  pathname: string,
  routes: string[]
): boolean {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let hasAccessToken = Boolean(
    request.cookies.get('accessToken')?.value
  );

  const refreshToken =
    request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = matchesRoute(
    pathname,
    privateRoutes
  );

  const isPublicRoute = matchesRoute(
    pathname,
    publicRoutes
  );

  if (!hasAccessToken && refreshToken) {
    try {
      const cookieHeader = request.cookies.toString();

      const response = await checkSession(cookieHeader);

      hasAccessToken = Boolean(
        response.data?.success
      );
    } catch {
      hasAccessToken = false;
    }
  }

  if (!hasAccessToken && isPrivateRoute) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }

  if (hasAccessToken && isPublicRoute) {
    return NextResponse.redirect(
      new URL('/', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};