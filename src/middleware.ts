import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ['/credits', '/settings'];
// Routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // First, handle the internationalization
  const response = intlMiddleware(request);
  
  // Get the locale from the path
  const locale = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(locale as 'en' | 'ar');
  const pathWithoutLocale = isValidLocale 
    ? pathname.replace(`/${locale}`, '') || '/'
    : pathname;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // Only check auth for protected routes
  if (isProtectedRoute || isAuthRoute) {
    try {
      const { user } = await updateSession(request);

      // Redirect logic
      if (isProtectedRoute && !user) {
        const loginUrl = new URL(isValidLocale ? `/${locale}/login` : '/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (isAuthRoute && user) {
        const homeUrl = new URL(isValidLocale ? `/${locale}` : '/', request.url);
        return NextResponse.redirect(homeUrl);
      }
    } catch (error) {
      console.error('Middleware auth error:', error);
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Internal Next.js routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

