/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auctions from "../auctions.js";
import type * as auth from "../auth.js";
import type * as handlers_auctions from "../handlers/auctions.js";
import type * as handlers_users from "../handlers/users.js";
import type * as http from "../http.js";
import type * as lib_convexEnv from "../lib/convexEnv.js";
import type * as lib_env from "../lib/env.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_rateLimits from "../lib/rateLimits.js";
import type * as lib_session from "../lib/session.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auctions: typeof auctions;
  auth: typeof auth;
  "handlers/auctions": typeof handlers_auctions;
  "handlers/users": typeof handlers_users;
  http: typeof http;
  "lib/convexEnv": typeof lib_convexEnv;
  "lib/env": typeof lib_env;
  "lib/helpers": typeof lib_helpers;
  "lib/rateLimits": typeof lib_rateLimits;
  "lib/session": typeof lib_session;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
