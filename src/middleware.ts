import { NextResponse, type NextRequest } from 'next/server';


export function middleware(request: NextRequest) {

  const token = request.cookies.get('access_token')?.value;
  console.log("token", token);

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/brand",
    "/offers",
    "/profile",
    "/setting",
    "/store",
    "/((?!auth|_next|favicon.ico|public).*)", // Fallback to secure all other routes
  ],
};