import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, routes } from '@/lib/i18n/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, studio, and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/review') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Handle route translation
  let internalPathname = pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  
  if (pathParts.length > 0) {
    let currentLocale = defaultLocale;
    let pathStart = 0;
    
    if (locales.includes(pathParts[0] as any)) {
      currentLocale = pathParts[0] as any;
      pathStart = 1;
    }
    
    // Find if the first path segment is an Arabic route
    if (pathStart < pathParts.length) {
      const routeKey = Object.entries(routes[currentLocale]).find(
        ([key, val]) => val === decodeURIComponent(pathParts[pathStart])
      )?.[0];
      
      if (routeKey) {
        // Rewrite Arabic route to internal English folder name
        pathParts[pathStart] = routes.en[routeKey];
        internalPathname = '/' + pathParts.join('/');
        if (currentLocale === defaultLocale && !pathname.startsWith(`/${defaultLocale}`)) {
           internalPathname = `/${defaultLocale}${internalPathname}`;
        }
      }
    }
  }

  if (!locales.some(loc => internalPathname.startsWith(`/${loc}/`) || internalPathname === `/${loc}`)) {
    internalPathname = `/${defaultLocale}${internalPathname}`;
  }

  if (internalPathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = internalPathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|studio|admin|review|.*\\..*).*)'],
};
