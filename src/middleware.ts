import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;

    console.log("accessToken >>>", accessToken);
    // console.log("request headers >>>", request.headers.get("cookie"));
    // console.log('Request Headers: entiries', [...request.headers.entries()]);


    // if(request.)
    // console.log("request headers >>>", request.cookies.clear());

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
        "/auth",
        "/brand",
        "/offers",
        "/profile",
        "/setting",
        "/store",
        "/((?!auth|_next|favicon.ico|public).*)", // Fallback to secure all other routes
    ],
};