// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use `jose` to verify JWT

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    // No token = Unauthorized
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Validate the token
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    // Token is valid → continue
    return NextResponse.next();
  } catch (err) {
    // Token is invalid or expired = Unauthorized
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/brand/:path*",
    "/offers/:path*",
    "/profile/:path*",
    "/setting/:path*",
    "/store/:path*",
    "/((?!login|_next|favicon.ico|public).*)", // Protect all other routes except these
  ],
};
