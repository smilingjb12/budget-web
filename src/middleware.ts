import { NextRequest, NextResponse } from "next/server";
import { APP_SEGMENT, Month, Routes } from "./lib/routes";

const SIGNIN_ROUTE = Routes.signIn();
const APP_WILDCARD = `/${APP_SEGMENT}(.*)`;
const API_WILDCARD = `/api/(.*)`;
const AUTH_API_ROUTE = `/api/auth`;

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
const isAuthApiRoute = createRouteMatcher([AUTH_API_ROUTE]);

// Custom matcher for API routes that excludes auth API route
const isApiRoute = (request: NextRequest) => {
  return (
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/auth")
  );
};

// Custom matcher for protected routes that excludes auth API route
const isProtectedRoute = (request: NextRequest) => {
  // Skip authentication for auth API route
  if (isAuthApiRoute(request)) {
    return false;
  }

  // Check if it's an app route or other API route
  return (
    request.nextUrl.pathname.startsWith(`/${APP_SEGMENT}`) ||
    (request.nextUrl.pathname.startsWith("/api/") &&
      !request.nextUrl.pathname.startsWith("/api/auth"))
  );
};

export function middleware(request: NextRequest) {
  const currentDate = new Date();
  const defaultRoute = Routes.monthlyExpensesSummary(
    currentDate.getFullYear(),
    (currentDate.getMonth() + 1) as Month
  );

  // Check for authentication cookie
  const authCookie = request.cookies.get("auth-token");
  const isAuthenticated = !!authCookie?.value;

  // Skip authentication check for auth API route
  if (isAuthApiRoute(request)) {
    return NextResponse.next();
  }

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
