import { verifyTokenWithoutDB } from '@/utils/auth-edge'; // Modified auth utility
import { deleteToken, getToken } from '@/utils/tokenHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken();
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === '/signin' || pathname === '/signup';

  try {
    if (token) {
      // Verify token without database access
      const payload= await verifyTokenWithoutDB(token);

      // Redirect authenticated users away from auth pages
      if (isAuthPage) {
        return NextResponse.redirect(
          new URL(payload.role === 'ADMIN' ? '/admin/dashboard' : '/journals', req.url)
        );
      }

      // Role-based routing
      if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/journals', req.url));
      }

      if (pathname.startsWith('/journals') && payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      return NextResponse.next();
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/signin', req.url));
    await deleteToken(response);
    return response;
  }

  // Redirect to signin if accessing protected routes without token
  if (!isAuthPage) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/journals/:path*',
    '/admin/:path*',
    '/signin',
    '/signup'
  ]
};