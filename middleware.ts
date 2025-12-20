import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { updateSession } from './src/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Update Supabase session first
  const { supabaseResponse } = await updateSession(request);
  
  // Handle internationalization - this will return a response or redirect
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware returns a response (redirect), use it but preserve Supabase cookies
  if (intlResponse) {
    // Copy Supabase cookies to the intl response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return intlResponse;
  }
  
  // Otherwise, return the Supabase response
  return supabaseResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

