import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard', '/profile', '/find-jobs'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('insforge_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/find-jobs/:path*'],
};
