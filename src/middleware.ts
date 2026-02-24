import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/rooms', '/mypage'];
const PUBLIC_PATHS = ['/rooms/solo'];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('accessToken')?.value;
  if (token) return NextResponse.next();

  const url = new URL('/', req.url);
  url.searchParams.set('redirect', pathname + search);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/rooms/:path*', '/mypage/:path*'],
};
