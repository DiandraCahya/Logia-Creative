import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./lib/cms/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply to /admin and /api/admin
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await verifySessionToken(token);

  // Set noindex headers for all admin routes to prevent search engines from indexing
  const setSecurityHeaders = (res: NextResponse) => {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    return res;
  };

  // Allow access to login endpoints
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    // If already logged in and visiting login page, redirect to /admin dashboard
    if (isAuthenticated && pathname === "/admin/login") {
      const dashboardUrl = new URL("/admin", req.url);
      return setSecurityHeaders(NextResponse.redirect(dashboardUrl));
    }
    return setSecurityHeaders(NextResponse.next());
  }

  // If unauthenticated:
  if (!isAuthenticated) {
    if (pathname.startsWith("/api/admin")) {
      return setSecurityHeaders(
        NextResponse.json({ error: "Sesi telah berakhir atau belum login." }, { status: 401 })
      );
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return setSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return setSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
