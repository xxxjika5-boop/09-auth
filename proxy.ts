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

  const nextResponse = NextResponse.next();

  if (!hasAccessToken && refreshToken) {
    try {
      const cookieHeader = request.cookies.toString();

      const response = await checkSession(
        cookieHeader
      );

      const setCookie =
        response.headers['set-cookie'];

      if (setCookie) {
        hasAccessToken = true;

        const cookies = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        for (const cookie of cookies) {
          nextResponse.headers.append(
            'set-cookie',
            cookie
          );
        }
      }
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

  return nextResponse;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};