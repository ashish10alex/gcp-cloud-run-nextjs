import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
    const isVerifyUserRoute = req.nextUrl.pathname.startsWith("/api/verify_user_signin");
    const isIapBypassRoute = isVerifyUserRoute || isAuthRoute;

    if (isApiRoute && !isIapBypassRoute && !isLoggedIn) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (req.nextUrl.pathname === "/" && !isLoggedIn) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    if (req.nextUrl.pathname === "/api/auth/signin" && isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/",
        "/api/auth/signin",
        "/api/verify_user_signin",
        "/api/:path*"
    ],
};
