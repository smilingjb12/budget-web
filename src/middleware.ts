import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { APP_SEGMENT, Month, Routes } from "./lib/routes";
import { nextEnv } from "./nextEnv";

// Replace this with your Google email address

const SIGNIN_ROUTE = Routes.signIn();
const APP_WILDCARD = `/${APP_SEGMENT}(.*)`;
const API_WILDCARD = `/api/(.*)`;

// Define protected routes using Clerk's createRouteMatcher
const isProtectedRoute = createRouteMatcher([
  APP_WILDCARD,
  API_WILDCARD,
  // Exclude auth API routes
  "!(/api/auth.*)",
]);

const isSignInPage = createRouteMatcher([SIGNIN_ROUTE]);

// Export the Clerk middleware with custom logic
export default clerkMiddleware(async (auth, req) => {
  const currentDate = new Date();
  const defaultRoute = Routes.monthlyExpensesSummary(
    currentDate.getFullYear(),
    (currentDate.getMonth() + 1) as Month
  );

  // Get authentication state from Clerk
  const { userId, sessionClaims } = await auth();
  const isAuthenticated = !!userId;

  // Check if the authenticated user has the authorized email
  // sessionClaims.email contains the user's email address
  const userSub = sessionClaims?.sub;
  const isAuthorized =
    isAuthenticated && userSub === nextEnv.AUTHORIZED_USER_ID;

  // Handle sign-in page redirects
  if (isSignInPage(req)) {
    // If already authenticated and trying to access sign-in page, redirect to app
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }
    return NextResponse.next();
  }

  // Protect routes that need authentication
  if (isProtectedRoute(req)) {
    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      // For API routes, return 401 Unauthorized instead of redirecting
      if (
        req.nextUrl.pathname.startsWith("/api/") &&
        !req.nextUrl.pathname.startsWith("/api/auth")
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // For app routes, redirect to sign-in
      return NextResponse.redirect(new URL(SIGNIN_ROUTE, req.url));
    }

    // If authenticated but not authorized, redirect to sign-in
    if (!isAuthorized) {
      // For API routes, return 403 Forbidden
      if (
        req.nextUrl.pathname.startsWith("/api/") &&
        !req.nextUrl.pathname.startsWith("/api/auth")
      ) {
        return NextResponse.json(
          { error: "Forbidden: Unauthorized email" },
          { status: 403 }
        );
      }

      // For app routes, redirect to sign-in with an error message
      const signInUrl = new URL(SIGNIN_ROUTE, req.url);
      signInUrl.searchParams.set(
        "error",
        "Only authorized Google accounts can access this application"
      );
      return NextResponse.redirect(signInUrl);
    }
  }

  // Handle root and /app redirects
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  if (req.nextUrl.pathname === `/app`) {
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
