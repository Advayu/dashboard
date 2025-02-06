import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;

    console.log("accessToken >>>", accessToken);

    // if (!accessToken) {
    //     console.log("No access token found. Redirecting to /auth...");
    //     return NextResponse.redirect(new URL("/auth", request.url));
    // }

    // // Example validation logic (optional)
    // try {
    //     const isValid = true; // Replace with your token validation logic
    //     if (!isValid) throw new Error("Invalid token");
    // } catch (error) {
    //     console.log("Invalid token. Redirecting to /auth...");
    //     return NextResponse.redirect(new URL("/auth", request.url));
    // }

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