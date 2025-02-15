import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { AUCTIONS_SEGMENT, Routes } from "./lib/routes";

const SIGNIN_ROUTE = Routes.signIn();
const AUCTIONS_WILDCARD = `/${AUCTIONS_SEGMENT}(.*)`;

const isSignInPage = createRouteMatcher([SIGNIN_ROUTE]);
const isProtectedRoute = createRouteMatcher([AUCTIONS_WILDCARD]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(
      request,
      Routes.auctionsList(new Date().getFullYear())
    );
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, SIGNIN_ROUTE);
  }

  if (request.nextUrl.pathname === "/") {
    return nextjsMiddlewareRedirect(
      request,
      Routes.auctionsList(new Date().getFullYear())
    );
  }

  if (request.nextUrl.pathname === `/${AUCTIONS_SEGMENT}`) {
    return nextjsMiddlewareRedirect(
      request,
      Routes.auctionsList(new Date().getFullYear())
    );
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
