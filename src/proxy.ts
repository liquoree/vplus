import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from './shared/lib/auth/admin-session';

export function proxy(
  request: NextRequest
) {
  const { pathname, search } =
    request.nextUrl;

  const sessionToken =
    request.cookies.get(
      ADMIN_SESSION_COOKIE
    )?.value;

  const session =
    verifyAdminSessionToken(
      sessionToken
    );

  if (pathname === '/admin') {
    if (session) {
      return NextResponse.redirect(
        new URL(
          '/admin/requests',
          request.url
        )
      );
    }

    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(
      '/admin',
      request.url
    );

    loginUrl.searchParams.set(
      'next',
      `${pathname}${search}`
    );

    const response =
      NextResponse.redirect(loginUrl);

    if (sessionToken) {
      response.cookies.delete(
        ADMIN_SESSION_COOKIE
      );
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
  ],
};