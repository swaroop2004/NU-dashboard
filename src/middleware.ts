import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define paths that are public and don't require authentication
    const publicPaths = [
        "/auth",
        "/api/auth",
        "/api/uploadthing", // If you use uploadthing or similar
        "/_next",
        "/favicon.ico",
        "/images",
        "/api/get-user",
        "/api/get-properties",
        "/api/post-lead",
    ];

    // Check if the current path is public
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Get the session token from cookies
    // better-auth uses "better-auth.session_token" by default
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    // If the user is not authenticated and trying to access a protected route
    if (!sessionToken && !isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth";
        // Optional: Add a callback URL to redirect back after login
        // url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    // If the user is authenticated and trying to access the auth page, redirect to dashboard
    if (sessionToken && pathname === "/auth") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
