import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware for handling authentication and authorization
 * @param request The NextRequest object representing the incoming request.
 * @returns A NextResponse object with the updated session information.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = [
    '/dashboard',
    '/orders',
    '/profile',
    '/checkout',
  ];

  const adminPaths = ['/admin'];
  const superAdminPaths = ['/super-admin'];

  const path = request.nextUrl.pathname;

  if (protectedPaths.some(p => path.startsWith(p))) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  const isAdminPath = adminPaths.some(p => path.startsWith(p));
  const isSuperAdminPath = superAdminPaths.some(p => path.startsWith(p));

  if (isAdminPath || isSuperAdminPath) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      if (isSuperAdminPath) {
          redirectUrl.searchParams.set('redirect', path);
      }
      return NextResponse.redirect(redirectUrl);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (isSuperAdminPath) {
      if (!profile || profile.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    if (isAdminPath) {
      if (!profile || !['admin', 'super_admin', 'artisan'].includes(profile.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder files
     * - api routes (they have their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)',
  ],
};