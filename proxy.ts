import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Static files
    // - Favicon
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
