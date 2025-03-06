import { NextRequest, NextResponse } from "next/server";
import { APP_SEGMENT, Month, Routes } from "./lib/routes";

const SIGNIN_ROUTE = Routes.signIn();
const APP_WILDCARD = `/${APP_SEGMENT}(.*)`;

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
const isProtectedRoute = createRouteMatcher([APP_WILDCARD]);

export function middleware(request: NextRequest) {
  const defaultRoute = Routes.recordsByMonth(
    (new Date().getMonth() + 1) as Month
  );

  // For API routes, we'll need a different authentication mechanism
  // This is a simplified version that doesn't actually check authentication
  // In a real app, you would use cookies or JWT tokens

  if (isSignInPage(request)) {
    // We can't check localStorage here since this is server-side
    // In a real app, you would check for authentication cookies or tokens
    return NextResponse.next();
  }

  if (isProtectedRoute(request)) {
    // We can't check localStorage here since this is server-side
    // In a real app, you would check for authentication cookies or tokens
    // For now, we'll just allow access to protected routes
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
