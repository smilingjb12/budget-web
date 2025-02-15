import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Routes } from "./lib/routes";

const SIGNIN_ROUTE = Routes.signIn();
const AUCTIONS_ROUTE = Routes.auctions();
const AUCTIONS_WILDCARD = `${AUCTIONS_ROUTE}(.*)`;

const isSignInPage = createRouteMatcher([SIGNIN_ROUTE]);
const isProtectedRoute = createRouteMatcher([AUCTIONS_WILDCARD]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, AUCTIONS_ROUTE);
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, SIGNIN_ROUTE);
  }

  if (request.nextUrl.pathname === Routes.auctions()) {
    return nextjsMiddlewareRedirect(
      request,
      Routes.auctionsWithYear(new Date().getFullYear())
    );
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
