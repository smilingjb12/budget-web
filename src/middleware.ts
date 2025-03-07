import { NextRequest, NextResponse } from "next/server";
import { APP_SEGMENT, Month, Routes } from "./lib/routes";

const SIGNIN_ROUTE = Routes.signIn();
const APP_WILDCARD = `/${APP_SEGMENT}(.*)`;
const API_WILDCARD = `/api/(.*)`;

// Helper function to check if a route matches a pattern
const createRouteMatcher = (patterns: string[]) => {
  return (request: NextRequest) => {
    return patterns.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(pattern.replace("*", ".*"));
        return regex.test(request.nextUrl.pathname);
      }
      return request.nextUrl.pathname === pattern;
    });
  };
};

const isSignInPage = createRouteMatcher([SIGNIN_ROUTE]);
const isProtectedRoute = createRouteMatcher([APP_WILDCARD, API_WILDCARD]);
const isApiRoute = createRouteMatcher([API_WILDCARD]);

export function middleware(request: NextRequest) {
  const currentDate = new Date();
  const defaultRoute = Routes.monthlyExpensesSummary(
    currentDate.getFullYear(),
    (currentDate.getMonth() + 1) as Month
  );

  // Check for authentication cookie
  const authCookie = request.cookies.get("auth-token");
  const isAuthenticated = !!authCookie?.value;

  if (isSignInPage(request)) {
    // If already authenticated and trying to access sign-in page, redirect to app
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(request)) {
    // If not authenticated
    if (!isAuthenticated) {
      // For API routes, return 401 Unauthorized instead of redirecting
      if (isApiRoute(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // For app routes, redirect to sign-in
      return NextResponse.redirect(new URL(SIGNIN_ROUTE, request.url));
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  if (request.nextUrl.pathname === `/app`) {
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
